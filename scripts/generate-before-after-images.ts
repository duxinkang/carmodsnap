#!/usr/bin/env tsx
/**
 * Generate before/after comparison images for the landing page
 * Usage: pnpm tsx scripts/generate-before-after-images.ts
 */
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

import { AIMediaType, AITaskStatus } from '@/extensions/ai/types';
import { getAIManagerWithConfigs } from '@/shared/services/ai';
import { db } from '@/core/db';
import { config as configTable } from '@/config/db/schema';

const OUTPUT_DIR = join(process.cwd(), 'public', 'imgs', 'before-after');

const TRANSFORMATIONS = [
  {
    name: 'wrap-color',
    beforePrompt: 'A stock silver BMW M3 sedan in showroom condition, clean factory paint, OEM wheels, photographed from front three-quarter angle, professional automotive photography, studio lighting, 16:9 aspect ratio',
    afterPrompt: 'The same BMW M3 with a full matte black vinyl wrap, aggressive satin black custom forged wheels, lowered suspension, dramatic side lighting showing the matte texture, automotive editorial photography, 16:9 aspect ratio',
    description: 'Matte Black Wrap Transformation',
  },
  {
    name: 'wheel-upgrade',
    beforePrompt: 'A white Audi RS5 with stock factory wheels, clean OEM appearance, front three-quarter view, professional automotive photography, 16:9 aspect ratio',
    afterPrompt: 'The same Audi RS5 with custom bronze forged concave wheels, lowered on coilovers, aggressive stance, golden hour lighting highlighting the wheel design, 16:9 aspect ratio',
    description: 'Custom Forged Wheel Upgrade',
  },
  {
    name: 'body-kit',
    beforePrompt: 'A clean white Porsche 911 Carrera, stock body, factory appearance, front three-quarter angle, professional automotive photography, 16:9 aspect ratio',
    afterPrompt: 'The same Porsche 911 with full Techart widebody kit, front lip spoiler, side skirts, rear diffuser, aggressive aero, dramatic lighting, 16:9 aspect ratio',
    description: 'Full Aero Body Kit',
  },
  {
    name: 'chrome-delete',
    beforePrompt: 'A black Mercedes-AMG C63 with chrome window trim and silver Mercedes badges, front three-quarter view, professional automotive photography, 16:9 aspect ratio',
    afterPrompt: 'The same Mercedes with full chrome delete, gloss black window trim, blacked out badges, 20% window tint, aggressive blacked out appearance, 16:9 aspect ratio',
    description: 'Chrome Delete & Tint',
  },
];

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

function getEnvValue(...keys: string[]): string {
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
    nanobanana_api_key: getEnvValue('NANOBANANA_API_KEY', 'nanobanana_api_key'),
    nanobanana_base_url: getEnvValue('NANOBANANA_BASE_URL', 'nanobanana_base_url'),
    replicate_api_token: getEnvValue('REPLICATE_API_TOKEN', 'replicate_api_token'),
    fal_api_key: getEnvValue('FAL_API_KEY', 'fal_api_key'),
    qwen_api_key: getEnvValue('QWEN_API_KEY', 'DASHSCOPE_API_KEY', 'qwen_api_key'),
  };
}

async function withDbConfigs(configs: Record<string, string>) {
  const neededKeys = [
    'qwen_api_key',
    'replicate_api_token',
    'fal_api_key',
  ];

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

async function generateImage({
  providerName,
  model,
  prompt,
}: {
  providerName: string;
  model: string;
  prompt: string;
}): Promise<string> {
  const configs = await withDbConfigs(getScriptConfigs());
  const aiManager = getAIManagerWithConfigs(configs);
  const provider = aiManager.getProvider(providerName);

  if (!provider) {
    throw new Error(`Provider "${providerName}" is not configured`);
  }

  const result = await provider.generate({
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

  if (result.taskStatus === AITaskStatus.SUCCESS) {
    const imageUrl = result.taskInfo?.images?.[0]?.imageUrl;
    if (imageUrl) {
      return imageUrl;
    }
  }

  // For providers that return async tasks
  if (provider.query) {
    const startedAt = Date.now();
    const POLL_TIMEOUT_MS = 3 * 60 * 1000;
    const POLL_INTERVAL_MS = 5000;

    while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
      await sleep(POLL_INTERVAL_MS);

      const queryResult = await provider.query({
        taskId: result.taskId,
        mediaType: AIMediaType.IMAGE,
        model,
      });

      if (queryResult.taskStatus === AITaskStatus.SUCCESS) {
        const imageUrl = queryResult.taskInfo?.images?.[0]?.imageUrl;
        if (imageUrl) {
          return imageUrl;
        }
      }

      if (queryResult.taskStatus !== AITaskStatus.PENDING) {
        throw new Error(queryResult.taskInfo?.errorMessage || 'Image generation failed');
      }
    }

    throw new Error('Timed out while waiting for image generation');
  }

  throw new Error('Provider does not support async task querying');
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const providers = ['nanobanana', 'replicate', 'fal', 'qwen'];
  const models: Record<string, string> = {
    nanobanana: 'nano-banana-2',
    replicate: 'google/nano-banana-pro',
    fal: 'fal-ai/flux-2-flex',
    qwen: 'qwen-image-max',
  };

  // Find available provider
  const configs = await withDbConfigs(getScriptConfigs());
  const aiManager = getAIManagerWithConfigs(configs);
  const availableProviders = aiManager.getProviderNames();

  const providerName = providers.find((p) => availableProviders.includes(p));
  if (!providerName) {
    console.error('No supported image provider is configured');
    console.log('Please configure at least one of: nanobanana, replicate, fal, qwen');
    return;
  }

  const model = models[providerName];

  console.log(`\nUsing provider: ${providerName}`);
  console.log(`Using model: ${model}`);
  console.log(`Generating ${TRANSFORMATIONS.length * 2} images...\n`);

  for (const transformation of TRANSFORMATIONS) {
    console.log(`\n=== ${transformation.description} ===`);

    // Generate "before" image
    try {
      console.log(`  Generating "before" image...`);
      const beforeUrl = await generateImage({
        providerName,
        model,
        prompt: transformation.beforePrompt,
      });
      console.log(`  Before URL: ${beforeUrl}`);

      // Save before image URL
      writeFileSync(
        join(OUTPUT_DIR, `${transformation.name}-before.txt`),
        beforeUrl
      );
    } catch (error) {
      console.error(`  Failed to generate before image: ${error}`);
    }

    await sleep(2000);

    // Generate "after" image
    try {
      console.log(`  Generating "after" image...`);
      const afterUrl = await generateImage({
        providerName,
        model,
        prompt: transformation.afterPrompt,
      });
      console.log(`  After URL: ${afterUrl}`);

      // Save after image URL
      writeFileSync(
        join(OUTPUT_DIR, `${transformation.name}-after.txt`),
        afterUrl
      );
    } catch (error) {
      console.error(`  Failed to generate after image: ${error}`);
    }

    await sleep(2000);
  }

  console.log('\n✅ Generation complete!');
  console.log(`\nGenerated images are stored in: ${OUTPUT_DIR}`);
  console.log('\nTo use these images:');
  console.log('1. Download the images from the generated URLs');
  console.log('2. Place them in the public/imgs/before-after/ directory');
  console.log('3. Update the page.tsx file with the new image paths');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
