#!/usr/bin/env tsx
/**
 * Generate before/after comparison images and save them into public/imgs/before-after
 * Usage: pnpm tsx scripts/generate-before-after-images.ts
 */
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

import { db } from '@/core/db';
import { config as configTable } from '@/config/db/schema';
import { AIMediaType, AITaskStatus } from '@/extensions/ai/types';
import { beforeAfterItems } from '@/shared/config/before-after';
import { getAIManagerWithConfigs } from '@/shared/services/ai';

const GENERATE_MAX_RETRIES = 5;
const RETRY_DELAY_MS = 20000;

function parseArgs(argv: string[]) {
  const args: { provider?: string; item?: string } = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--provider') {
      args.provider = argv[i + 1];
      i += 1;
    } else if (arg === '--item') {
      args.item = argv[i + 1];
      i += 1;
    }
  }

  return args;
}

function getEnvValue(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (value) {
      return value;
    }
  }

  return '';
}

function getScriptConfigs() {
  return {
    qwen_api_key: getEnvValue('QWEN_API_KEY', 'DASHSCOPE_API_KEY', 'qwen_api_key'),
    qwen_base_url: getEnvValue(
      'QWEN_BASE_URL',
      'DASHSCOPE_BASE_URL',
      'qwen_base_url'
    ),
    replicate_api_token: getEnvValue(
      'REPLICATE_API_TOKEN',
      'replicate_api_token'
    ),
    fal_api_key: getEnvValue('FAL_API_KEY', 'fal_api_key'),
  };
}

async function withDbConfigs(configs: Record<string, string>) {
  const neededKeys = ['qwen_api_key', 'replicate_api_token', 'fal_api_key'];
  const missingKeys = neededKeys.filter((key) => !configs[key]);

  if (missingKeys.length === 0 || !process.env.DATABASE_URL) {
    return configs;
  }

  try {
    const rows = await db().select().from(configTable);
    for (const row of rows) {
      if (row.name && typeof row.value === 'string' && !configs[row.name]) {
        configs[row.name] = row.value;
      }
    }
  } catch (error) {
    console.warn('Failed to load AI configs from database:', error);
  }

  return configs;
}

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function resolveImageUrl({
  providerName,
  model,
  prompt,
}: {
  providerName: string;
  model: string;
  prompt: string;
}) {
  const configs = await withDbConfigs(getScriptConfigs());
  const aiManager = getAIManagerWithConfigs(configs);
  const provider = aiManager.getProvider(providerName);

  if (!provider) {
    throw new Error(`Provider "${providerName}" is not configured`);
  }

  let result;

  for (let attempt = 0; attempt < GENERATE_MAX_RETRIES; attempt += 1) {
    try {
      result = await provider.generate({
        params: {
          mediaType: AIMediaType.IMAGE,
          prompt,
          model,
          options: {
            size: '1536*864',
            n: 1,
          },
        },
      });
      break;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const isRateLimited =
        message.includes('429') ||
        message.includes('RateQuota') ||
        message.includes('rate limit');

      if (!isRateLimited || attempt === GENERATE_MAX_RETRIES - 1) {
        throw error;
      }

      const delay = RETRY_DELAY_MS * (attempt + 1);
      console.warn(
        `Rate limited by provider, retrying in ${Math.round(delay / 1000)}s...`
      );
      await sleep(delay);
    }
  }

  if (!result) {
    throw new Error('Image generation did not return a task result');
  }

  if (result.taskStatus === AITaskStatus.SUCCESS) {
    const imageUrl = result.taskInfo?.images?.[0]?.imageUrl;
    if (imageUrl) {
      return imageUrl;
    }
  }

  if (!provider.query) {
    throw new Error('Provider returned a pending task but does not support polling');
  }

  const startedAt = Date.now();
  while (Date.now() - startedAt < 3 * 60 * 1000) {
    await sleep(5000);
    result = await provider.query({
      taskId: result.taskId,
      mediaType: AIMediaType.IMAGE,
      model,
    });

    if (result.taskStatus === AITaskStatus.SUCCESS) {
      const imageUrl = result.taskInfo?.images?.[0]?.imageUrl;
      if (imageUrl) {
        return imageUrl;
      }
    }

    if (
      result.taskStatus === AITaskStatus.FAILED ||
      result.taskStatus === AITaskStatus.CANCELED
    ) {
      throw new Error(result.taskInfo?.errorMessage || 'Image generation failed');
    }
  }

  throw new Error('Timed out while waiting for image generation');
}

async function downloadImage(url: string, outputPath: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, buffer);
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const providers = ['replicate', 'fal', 'qwen'];
  const models: Record<string, string> = {
    replicate: 'google/nano-banana-pro',
    fal: 'fal-ai/flux-2-flex',
    qwen: 'qwen-image-max',
  };

  const configs = await withDbConfigs(getScriptConfigs());
  const aiManager = getAIManagerWithConfigs(configs);
  const availableProviders = aiManager.getProviderNames();
  const providerName =
    (args.provider &&
      availableProviders.includes(args.provider) &&
      args.provider) ||
    providers.find((name) => availableProviders.includes(name));

  if (!providerName) {
    console.error('No supported image provider is configured');
    console.log('Please configure at least one of: replicate, fal, qwen');
    process.exit(1);
  }

  const model = models[providerName];
  console.log(`Using provider: ${providerName}`);
  console.log(`Using model: ${model}`);

  const items = args.item
    ? beforeAfterItems.filter((item) => item.slug === args.item)
    : beforeAfterItems;

  if (items.length === 0) {
    throw new Error(`No before/after item found for "${args.item}"`);
  }

  for (const item of items) {
    const beforeOutput = join(
      process.cwd(),
      'public',
      item.beforeImage.replace(/^\//, '')
    );
    const afterOutput = join(
      process.cwd(),
      'public',
      item.afterImage.replace(/^\//, '')
    );

    console.log(`\n=== ${item.slug} ===`);

    const beforeUrl = await resolveImageUrl({
      providerName,
      model,
      prompt: item.beforePrompt,
    });
    await downloadImage(beforeUrl, beforeOutput);
    console.log(`Saved before image: ${beforeOutput}`);

    await sleep(2000);

    const afterUrl = await resolveImageUrl({
      providerName,
      model,
      prompt: item.afterPrompt,
    });
    await downloadImage(afterUrl, afterOutput);
    console.log(`Saved after image: ${afterOutput}`);

    await sleep(2000);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
