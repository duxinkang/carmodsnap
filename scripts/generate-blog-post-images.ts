#!/usr/bin/env tsx
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { basename, extname, join } from 'path';

import { db } from '@/core/db';
import { config as configTable } from '@/config/db/schema';
import { AIMediaType, AITaskStatus } from '@/extensions/ai/types';
import { getAIManagerWithConfigs } from '@/shared/services/ai';

type Frontmatter = {
  title?: string;
  description?: string;
  image?: string;
  tags?: string[];
};

type PostRecord = {
  slug: string;
  filePath: string;
  frontmatter: Frontmatter;
};

type Args = {
  provider?: string;
  model?: string;
  limit?: number;
  overwrite: boolean;
  onlyMissing: boolean;
  dryRun: boolean;
  slugs: Set<string>;
};

const POSTS_DIR = join(process.cwd(), 'content', 'posts');
const OUTPUT_DIR = join(process.cwd(), 'public', 'imgs', 'blog', 'posts');
const POLL_INTERVAL_MS = 5000;
const POLL_TIMEOUT_MS = 3 * 60 * 1000;
const GENERATE_MAX_RETRIES = 5;
const RETRY_DELAY_MS = 20000;

const DEFAULT_MODELS: Record<string, string> = {
  qwen: 'qwen-image-max',
  replicate: 'google/nano-banana-pro',
  fal: 'fal-ai/flux-2-flex',
};

const BASE_PROMPT =
  'Create a premium automotive editorial cover image for a blog post. No text, no letters, no watermark, no logo, no UI elements. Photorealistic, commercial quality, dramatic but clean lighting, high detail, 16:9 composition.';

function parseArgs(argv: string[]): Args {
  const args: Args = {
    overwrite: false,
    onlyMissing: true,
    dryRun: false,
    slugs: new Set<string>(),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === '--provider') {
      args.provider = argv[i + 1];
      i += 1;
    } else if (arg === '--model') {
      args.model = argv[i + 1];
      i += 1;
    } else if (arg === '--limit') {
      args.limit = Number(argv[i + 1]);
      i += 1;
    } else if (arg === '--slug') {
      args.slugs.add(argv[i + 1]);
      i += 1;
    } else if (arg === '--overwrite') {
      args.overwrite = true;
      args.onlyMissing = false;
    } else if (arg === '--all') {
      args.onlyMissing = false;
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    }
  }

  return args;
}

function parseFrontmatter(content: string): Frontmatter {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error('Missing frontmatter');
  }

  const raw = match[1];
  const lines = raw.split('\n');
  const result: Frontmatter = {};

  for (const line of lines) {
    if (line.startsWith('title:')) {
      result.title = stripYamlScalar(line.slice('title:'.length));
    } else if (line.startsWith('description:')) {
      result.description = stripYamlScalar(line.slice('description:'.length));
    } else if (line.startsWith('image:')) {
      result.image = stripYamlScalar(line.slice('image:'.length));
    } else if (line.startsWith('tags:')) {
      result.tags = extractInlineArray(line);
    }
  }

  return result;
}

function stripYamlScalar(value: string): string {
  return value.trim().replace(/^['"]|['"]$/g, '');
}

function extractInlineArray(line: string): string[] {
  const match = line.match(/\[(.*)\]/);
  if (!match) {
    return [];
  }

  return match[1]
    .split(',')
    .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

function getPosts(): PostRecord[] {
  return readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => {
      const filePath = join(POSTS_DIR, file);
      const content = readFileSync(filePath, 'utf8');
      const slug = basename(file, '.mdx');

      return {
        slug,
        filePath,
        frontmatter: parseFrontmatter(content),
      };
    });
}

function needsImage(post: PostRecord): boolean {
  const image = post.frontmatter.image ?? '';
  return !image || image.includes('/opengraph-image');
}

function inferScene(slug: string, tags: string[] = []): string {
  const haystack = `${slug} ${tags.join(' ')}`.toLowerCase();

  if (haystack.includes('tesla')) {
    return 'A customized Tesla Model 3 with tasteful wrap and wheel upgrades, parked in a modern architectural setting.';
  }

  if (haystack.includes('truck')) {
    return 'A bold customized pickup truck with full body wrap, aggressive wheels, and commercial-grade detailing.';
  }

  if (haystack.includes('wheel') || haystack.includes('rims')) {
    return 'A lowered performance car where the custom wheels are prominent, with realistic fitment and stance.';
  }

  if (haystack.includes('wrap') || haystack.includes('paint') || haystack.includes('chrome-delete')) {
    return 'A premium modified car focused on wrap color, paint finish, and exterior trim changes, shown as a realistic hero shot.';
  }

  if (haystack.includes('widebody') || haystack.includes('body-kit')) {
    return 'An aggressive widebody sports coupe with refined aero parts, muscular stance, and showroom-level lighting.';
  }

  if (haystack.includes('livery')) {
    return 'A track-inspired car with a clean custom livery design, photographed like a motorsport campaign image.';
  }

  if (haystack.includes('before-after') || haystack.includes('compare')) {
    return 'A comparison-style automotive concept image showing two distinct modification directions in one polished composition, without any text.';
  }

  if (haystack.includes('ppf')) {
    return 'A premium vehicle finish comparison scene emphasizing surface quality, gloss, and protection-oriented styling.';
  }

  return 'A high-end modified sports car concept with tasteful wheels, stance, and exterior styling upgrades.';
}

function buildPrompt(post: PostRecord): string {
  const { slug, frontmatter } = post;
  const title = frontmatter.title ?? slug;
  const description = frontmatter.description ?? '';
  const tags = frontmatter.tags ?? [];
  const scene = inferScene(slug, tags);
  const tagText = tags.length > 0 ? `Key topics: ${tags.join(', ')}.` : '';

  return [
    BASE_PROMPT,
    `Article title: ${title}.`,
    description ? `Article summary: ${description}.` : '',
    tagText,
    `Scene direction: ${scene}`,
    'Make it visually strong for a blog card and social preview. Use a wide horizontal crop. Focus on one hero vehicle. Avoid collage unless the topic is explicitly comparison-oriented.',
  ]
    .filter(Boolean)
    .join(' ');
}

function getOutputPath(slug: string): { fsPath: string; publicPath: string } {
  const publicPath = `/imgs/blog/posts/${slug}.png`;
  return {
    fsPath: join(OUTPUT_DIR, `${slug}.png`),
    publicPath,
  };
}

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
    qwen_custom_storage: getEnvValue(
      'QWEN_CUSTOM_STORAGE',
      'qwen_custom_storage'
    ),
    replicate_api_token: getEnvValue(
      'REPLICATE_API_TOKEN',
      'replicate_api_token'
    ),
    replicate_custom_storage: getEnvValue(
      'REPLICATE_CUSTOM_STORAGE',
      'replicate_custom_storage'
    ),
    fal_api_key: getEnvValue('FAL_API_KEY', 'fal_api_key'),
    fal_custom_storage: getEnvValue(
      'FAL_CUSTOM_STORAGE',
      'fal_custom_storage'
    ),
    gemini_api_key: getEnvValue('GEMINI_API_KEY', 'gemini_api_key'),
    kie_api_key: getEnvValue('KIE_API_KEY', 'kie_api_key'),
  };
}

async function withDbConfigs(configs: Record<string, string>) {
  const neededKeys = [
    'qwen_api_key',
    'qwen_base_url',
    'qwen_custom_storage',
    'replicate_api_token',
    'replicate_custom_storage',
    'fal_api_key',
    'fal_custom_storage',
    'gemini_api_key',
    'kie_api_key',
    'kie_custom_storage',
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

async function resolveImageUrl({
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
  while (Date.now() - startedAt < POLL_TIMEOUT_MS) {
    await sleep(POLL_INTERVAL_MS);

    result = await provider.query({
      taskId: result.taskId,
      mediaType: AIMediaType.IMAGE,
      model,
    });

    if (result.taskStatus === AITaskStatus.SUCCESS) {
      const imageUrl = result.taskInfo?.images?.[0]?.imageUrl;
      if (!imageUrl) {
        throw new Error('Task succeeded but no image URL was returned');
      }
      return imageUrl;
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

async function downloadImage(url: string, fsPath: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`);
  }

  const contentType = response.headers.get('content-type') ?? '';
  const extension = extname(new URL(url).pathname).toLowerCase();

  if (
    !contentType.startsWith('image/') &&
    !['.png', '.jpg', '.jpeg', '.webp'].includes(extension)
  ) {
    throw new Error(`Unexpected image response: ${contentType || extension}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(fsPath, buffer);
}

function updatePostImage(filePath: string, publicPath: string) {
  const content = readFileSync(filePath, 'utf8');

  if (/^image:/m.test(content)) {
    const nextContent = content.replace(
      /^image:\s*.*$/m,
      `image: '${publicPath}'`
    );
    writeFileSync(filePath, nextContent);
    return;
  }

  const nextContent = content.replace(
    /^description:\s*.*$/m,
    (match) => `${match}\nimage: '${publicPath}'`
  );
  writeFileSync(filePath, nextContent);
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const args = parseArgs(process.argv.slice(2));
  const configs = await withDbConfigs(getScriptConfigs());
  const aiManager = getAIManagerWithConfigs(configs);
  const providers = aiManager.getProviderNames();

  const providerName =
    args.provider ||
    ['qwen', 'replicate', 'fal'].find((name) => providers.includes(name));
  if (!providerName) {
    throw new Error('No supported image provider is configured');
  }

  const model = args.model || DEFAULT_MODELS[providerName];
  if (!model) {
    throw new Error(`No default model configured for provider "${providerName}"`);
  }

  let posts = getPosts();

  if (args.slugs.size > 0) {
    posts = posts.filter((post) => args.slugs.has(post.slug));
  }

  if (args.onlyMissing) {
    posts = posts.filter(needsImage);
  }

  if (typeof args.limit === 'number' && Number.isFinite(args.limit)) {
    posts = posts.slice(0, args.limit);
  }

  if (posts.length === 0) {
    console.log('No posts require image generation.');
    return;
  }

  console.log(`Using provider: ${providerName}`);
  console.log(`Using model: ${model}`);
  console.log(`Posts to process: ${posts.length}`);

  const failures: Array<{ slug: string; error: string }> = [];

  for (const [index, post] of posts.entries()) {
    const { slug } = post;
    const { fsPath, publicPath } = getOutputPath(slug);
    const prompt = buildPrompt(post);

    console.log(`\n[${index + 1}/${posts.length}] ${slug}`);
    console.log(`Image path: ${publicPath}`);

    if (args.dryRun) {
      console.log(`Prompt: ${prompt}`);
      continue;
    }

    try {
      const imageUrl = await resolveImageUrl({
        providerName,
        model,
        prompt,
      });

      console.log(`Generated URL: ${imageUrl}`);
      await downloadImage(imageUrl, fsPath);
      updatePostImage(post.filePath, publicPath);
      console.log(`Saved: ${fsPath}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      failures.push({ slug, error: message });
      console.error(`Failed: ${slug} - ${message}`);
    }
  }

  if (failures.length > 0) {
    console.log('\nGeneration finished with failures:');
    for (const failure of failures) {
      console.log(`- ${failure.slug}: ${failure.error}`);
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
