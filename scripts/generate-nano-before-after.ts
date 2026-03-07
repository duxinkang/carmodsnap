#!/usr/bin/env tsx
/**
 * Generate before/after comparison images using NanoBanana 2 API
 * Usage: pnpm tsx scripts/generate-nano-before-after.ts
 */
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const OUTPUT_DIR = join(process.cwd(), 'public', 'imgs', 'before-after');

// NanoBanana 2 API configuration
const NANOBANANA_API_KEY = process.env.NANOBANANA_API_KEY || '';
const NANOBANANA_BASE_URL = 'https://api.nanobananaapi.ai/api/v1';

if (!NANOBANANA_API_KEY) {
  console.error('Error: NANOBANANA_API_KEY environment variable is not set');
  console.log('Please set it with: export NANOBANANA_API_KEY=your-api-key');
  process.exit(1);
}

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

async function generateImage(prompt: string): Promise<string> {
  const requestBody = {
    prompt,
    imageUrls: [],
    aspectRatio: 'auto' as const,
    resolution: '1K' as const,
    googleSearch: false,
    outputFormat: 'jpg' as const,
    callBackUrl: 'https://example-callback.com',
  };

  const response = await fetch(`${NANOBANANA_BASE_URL}/nanobanana/generate-2`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${NANOBANANA_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`NanoBanana API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();

  // Get task ID and poll for result
  const taskId = data.taskId || data.id;
  if (!taskId) {
    // Direct response with image URL
    const imageUrl = data.imageUrl || data.output?.imageUrl || data.result?.imageUrl;
    if (imageUrl) {
      return imageUrl;
    }
    throw new Error('No task ID or image URL in response');
  }

  // Poll for task result
  const maxAttempts = 36; // 3 minutes max
  const pollInterval = 5000; // 5 seconds

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    await sleep(pollInterval);

    const statusResponse = await fetch(`${NANOBANANA_BASE_URL}/nanobanana/status/${taskId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${NANOBANANA_API_KEY}`,
      },
    });

    if (!statusResponse.ok) {
      throw new Error(`Failed to query task status: ${statusResponse.status}`);
    }

    const statusData = await statusResponse.json();
    const status = statusData.status || statusData.taskStatus;

    if (status === 'COMPLETED' || status === 'SUCCESS') {
      const imageUrl = statusData.imageUrl || statusData.output?.imageUrl || statusData.result?.imageUrl;
      if (imageUrl) {
        return imageUrl;
      }
    }

    if (status === 'FAILED' || status === 'ERROR') {
      throw new Error(statusData.error || 'Image generation failed');
    }

    console.log(`    Still processing... (attempt ${attempt + 1}/${maxAttempts})`);
  }

  throw new Error('Timeout waiting for image generation');
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('\n=== NanoBanana 2 Before/After Image Generator ===\n');
  console.log(`Output directory: ${OUTPUT_DIR}`);
  console.log(`Generating ${TRANSFORMATIONS.length * 2} images...\n`);

  for (const transformation of TRANSFORMATIONS) {
    console.log(`\n=== ${transformation.description} ===`);

    // Generate "before" image
    try {
      console.log(`  Generating "before" image...`);
      const beforeUrl = await generateImage(transformation.beforePrompt);
      console.log(`  ✓ Before URL: ${beforeUrl}`);

      // Save before image URL
      writeFileSync(
        join(OUTPUT_DIR, `${transformation.name}-before.txt`),
        beforeUrl
      );
    } catch (error) {
      console.error(`  ✗ Failed to generate before image: ${error}`);
    }

    await sleep(3000);

    // Generate "after" image
    try {
      console.log(`  Generating "after" image...`);
      const afterUrl = await generateImage(transformation.afterPrompt);
      console.log(`  ✓ After URL: ${afterUrl}`);

      // Save after image URL
      writeFileSync(
        join(OUTPUT_DIR, `${transformation.name}-after.txt`),
        afterUrl
      );
    } catch (error) {
      console.error(`  ✗ Failed to generate after image: ${error}`);
    }

    await sleep(3000);
  }

  console.log('\n✅ Generation complete!');
  console.log(`\nGenerated image URLs are saved in: ${OUTPUT_DIR}`);
  console.log('\nNext steps:');
  console.log('1. Download the images from the generated .txt files');
  console.log('2. Save them to public/imgs/before-after/ directory');
  console.log('3. Update page.tsx with the actual image paths');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
