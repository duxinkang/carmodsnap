#!/usr/bin/env tsx
import { mkdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';

import { db } from '@/core/db';
import { config as configTable } from '@/config/db/schema';
import { AIMediaType, AITaskStatus } from '@/extensions/ai/types';
import { getAIManagerWithConfigs } from '@/shared/services/ai';

const GENERATE_MAX_RETRIES = 5;
const RETRY_DELAY_MS = 20000;
const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 3 * 60 * 1000;

type AssetRecord = {
  id: string;
  type: 'wheel' | 'mod';
  prompt: string;
  output: string;
};

const wheelAssets: AssetRecord[] = [
  {
    id: 'stock',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/stock.png',
    prompt:
      'Photorealistic automotive wheel thumbnail. OEM factory wheel on a clean dark sports sedan, front three-quarter crop focused on the wheel and lower body, neutral studio lighting, premium configurator asset, no text, square composition.',
  },
  {
    id: 'split5',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/split5.png',
    prompt:
      'Photorealistic automotive configurator thumbnail showing a split-5 spoke performance wheel mounted on a lowered sports coupe, front wheel hero crop, premium studio lighting, no text, square composition.',
  },
  {
    id: 'mesh-rs',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/mesh-rs.png',
    prompt:
      'Photorealistic configurator thumbnail of a dense mesh luxury wheel on a premium GT sedan, wheel-focused crop with polished brake hardware visible, premium studio lighting, no text, square composition.',
  },
  {
    id: 'forged-y',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/forged-y.png',
    prompt:
      'Photorealistic thumbnail of a forged Y-spoke performance wheel on a track-oriented coupe, front fender and wheel hero crop, crisp reflections, premium studio lighting, no text, square composition.',
  },
  {
    id: 'te37-style',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/te37-style.png',
    prompt:
      'Photorealistic automotive thumbnail of a classic six spoke motorsport wheel on a Japanese sports car, aggressive wheel close-up, premium studio lighting, no text, square composition.',
  },
  {
    id: 'turbofan',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/turbofan.png',
    prompt:
      'Photorealistic automotive thumbnail featuring a retro turbofan style wheel on a classic tuner car, wheel and lower side crop, premium studio lighting, no text, square composition.',
  },
  {
    id: 'monoblock',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/monoblock.png',
    prompt:
      'Photorealistic thumbnail of a large monoblock luxury wheel on a high-end grand touring sedan, close crop on wheel and side skirt, premium studio lighting, no text, square composition.',
  },
  {
    id: 'drift-x',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/drift-x.png',
    prompt:
      'Photorealistic wheel thumbnail showing an aggressive drift-style multi-spoke wheel on a lowered drift coupe, front wheel crop, premium studio lighting, no text, square composition.',
  },
  {
    id: 'rally-star',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/rally-star.png',
    prompt:
      'Photorealistic wheel thumbnail of a rugged rally-inspired star wheel on a lifted hatchback, wheel and arch detail crop, premium studio lighting, no text, square composition.',
  },
  {
    id: 'concave-v',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/concave-v.png',
    prompt:
      'Photorealistic configurator thumbnail of a deep concave V-spoke wheel on a widebody coupe, dramatic wheel crop, premium studio lighting, no text, square composition.',
  },
  {
    id: 'blade-10',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/blade-10.png',
    prompt:
      'Photorealistic automotive thumbnail with a sharp blade-like ten spoke wheel on a modern sports sedan, wheel hero crop, premium studio lighting, no text, square composition.',
  },
  {
    id: 'classic-mesh',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/classic-mesh.png',
    prompt:
      'Photorealistic thumbnail of a classic mesh wheel on a retro-inspired roadster, wheel and rocker panel crop, premium studio lighting, no text, square composition.',
  },
  {
    id: 'gt-arc',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/gt-arc.png',
    prompt:
      'Photorealistic automotive thumbnail featuring a GT arc spoke wheel on a performance grand tourer, front wheel detail crop, premium studio lighting, no text, square composition.',
  },
  {
    id: 'aero-disc',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/aero-disc.png',
    prompt:
      'Photorealistic thumbnail of an aero disc wheel on a clean electric sedan, modern minimal wheel crop, premium studio lighting, no text, square composition.',
  },
  {
    id: 'wire-lux',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/wire-lux.png',
    prompt:
      'Photorealistic thumbnail showing a refined wire-style luxury wheel on a classic executive coupe, premium wheel crop, no text, square composition.',
  },
  {
    id: 'forged-h',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/forged-h.png',
    prompt:
      'Photorealistic automotive thumbnail of a rigid forged H-spoke wheel on a track-ready coupe, wheel-focused crop, premium studio lighting, no text, square composition.',
  },
  {
    id: 'street-8',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/street-8.png',
    prompt:
      'Photorealistic thumbnail of a clean everyday eight spoke wheel on a sporty daily sedan, front wheel detail crop, premium studio lighting, no text, square composition.',
  },
  {
    id: 'stance-pro',
    type: 'wheel',
    output: '/imgs/carmodder/wheels/stance-pro.png',
    prompt:
      'Photorealistic thumbnail with an ultra low-offset stance wheel on a slammed show car, dramatic wheel and fender crop, premium studio lighting, no text, square composition.',
  },
];

const modAssets: AssetRecord[] = [
  {
    id: 'lowered',
    type: 'mod',
    output: '/imgs/carmodder/mods/lowered.png',
    prompt:
      'Photorealistic car modification thumbnail showing a lowered suspension setup on a sports sedan, full lower-body stance emphasized, premium studio lighting, no text, square composition.',
  },
  {
    id: 'widebody',
    type: 'mod',
    output: '/imgs/carmodder/mods/widebody.png',
    prompt:
      'Photorealistic car modification thumbnail of an aggressive widebody kit on a Japanese sports coupe, fender flare and stance emphasized, premium studio lighting, no text, square composition.',
  },
  {
    id: 'spoiler',
    type: 'mod',
    output: '/imgs/carmodder/mods/spoiler.png',
    prompt:
      'Photorealistic thumbnail showing a performance rear spoiler installed on a sports coupe, rear three-quarter crop, premium studio lighting, no text, square composition.',
  },
  {
    id: 'diffuser',
    type: 'mod',
    output: '/imgs/carmodder/mods/diffuser.png',
    prompt:
      'Photorealistic car modification thumbnail featuring a rear diffuser on a dark performance car, rear bumper close crop, premium studio lighting, no text, square composition.',
  },
  {
    id: 'side-skirts',
    type: 'mod',
    output: '/imgs/carmodder/mods/side-skirts.png',
    prompt:
      'Photorealistic thumbnail of side skirts installed on a lowered sports sedan, side profile lower-body crop, premium studio lighting, no text, square composition.',
  },
  {
    id: 'front-lip',
    type: 'mod',
    output: '/imgs/carmodder/mods/front-lip.png',
    prompt:
      'Photorealistic car modification thumbnail showing an aggressive front lip on a modern sports coupe, front bumper hero crop, premium studio lighting, no text, square composition.',
  },
];

function parseArgs(argv: string[]) {
  const args: { kind?: 'wheels' | 'mods' | 'all'; overwrite?: boolean } = {
    kind: 'all',
    overwrite: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--kind') {
      const next = argv[i + 1] as 'wheels' | 'mods' | 'all';
      if (next) args.kind = next;
      i += 1;
    } else if (arg === '--overwrite') {
      args.overwrite = true;
    }
  }

  return args;
}

function getEnvValue(...keys: string[]) {
  for (const key of keys) {
    const value = process.env[key];
    if (value) return value;
  }
  return '';
}

function getScriptConfigs() {
  return {
    qwen_api_key: getEnvValue(
      'QWEN_API_KEY',
      'DASHSCOPE_API_KEY',
      'qwen_api_key'
    ),
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

async function resolveImageUrl(prompt: string) {
  const configs = await withDbConfigs(getScriptConfigs());
  const aiManager = getAIManagerWithConfigs(configs);
  const provider = aiManager.getProvider('qwen');

  if (!provider) {
    throw new Error('Qwen provider is not configured');
  }

  let result;
  for (let attempt = 0; attempt < GENERATE_MAX_RETRIES; attempt += 1) {
    try {
      result = await provider.generate({
        params: {
          mediaType: AIMediaType.IMAGE,
          prompt,
          model: 'qwen-image-max',
          options: {
            size: '1024*1024',
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
      console.warn(`Rate limited, retrying in ${Math.round(delay / 1000)}s...`);
      await sleep(delay);
    }
  }

  if (!result) {
    throw new Error('Image generation did not return a task result');
  }

  if (result.taskStatus === AITaskStatus.SUCCESS) {
    const url = result.taskInfo?.images?.[0]?.imageUrl;
    if (url) return url;
  }

  if (!provider.query) {
    throw new Error(
      'Provider returned pending task but does not support polling'
    );
  }

  const startedAt = Date.now();
  while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
    await sleep(POLL_INTERVAL_MS);
    result = await provider.query({
      taskId: result.taskId,
      mediaType: AIMediaType.IMAGE,
      model: 'qwen-image-max',
    });

    if (result.taskStatus === AITaskStatus.SUCCESS) {
      const url = result.taskInfo?.images?.[0]?.imageUrl;
      if (url) return url;
    }

    if (
      result.taskStatus === AITaskStatus.FAILED ||
      result.taskStatus === AITaskStatus.CANCELED
    ) {
      throw new Error(
        result.taskInfo?.errorMessage || 'Image generation failed'
      );
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
  const assets = [
    ...(args.kind === 'mods' ? [] : wheelAssets),
    ...(args.kind === 'wheels' ? [] : modAssets),
  ];

  for (const asset of assets) {
    const outputPath = join(
      process.cwd(),
      'public',
      asset.output.replace(/^\//, '')
    );
    console.log(`\n=== ${asset.type}:${asset.id} ===`);

    try {
      const imageUrl = await resolveImageUrl(asset.prompt);
      await downloadImage(imageUrl, outputPath);
      console.log(`Saved ${outputPath}`);
      await sleep(1500);
    } catch (error) {
      console.error(`Failed to generate ${asset.id}:`, error);
      throw error;
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
