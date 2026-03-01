#!/usr/bin/env tsx
/**
 * 直接调用 AI 服务生成 31 款车型图片（绕过 API 认证）
 * 使用 Qwen API 直接生成
 */

import { writeFileSync, mkdirSync, existsSync, rmSync } from 'fs';
import { join } from 'path';

// 从环境变量获取 API Key
const QWEN_API_KEY = process.env.DASHSCOPE_API_KEY || process.env.QWEN_API_KEY || '';

// 31 款车型数据
const CAR_MODELS = [
  { id: 'honda-civic', name: 'Honda Civic', brand: 'Honda', type: 'sedan' },
  { id: 'honda-s2000', name: 'Honda S2000', brand: 'Honda', type: 'roadster' },
  { id: 'toyota-86-brz', name: 'Toyota 86 / Subaru BRZ', brand: 'Toyota/Subaru', type: 'coupe' },
  { id: 'toyota-supra', name: 'Toyota Supra', brand: 'Toyota', type: 'sports' },
  { id: 'toyota-ae86', name: 'Toyota AE86', brand: 'Toyota', type: 'coupe' },
  { id: 'subaru-wrx', name: 'Subaru WRX / STI', brand: 'Subaru', type: 'sedan' },
  { id: 'vw-golf', name: 'Volkswagen Golf', brand: 'Volkswagen', type: 'hatchback' },
  { id: 'vw-beetle', name: 'Volkswagen Beetle', brand: 'Volkswagen', type: 'hatchback' },
  { id: 'nissan-gtr', name: 'Nissan Skyline GT-R', brand: 'Nissan', type: 'sports' },
  { id: 'nissan-silvia', name: 'Nissan Silvia (S13-S15)', brand: 'Nissan', type: 'coupe' },
  { id: 'nissan-370z', name: 'Nissan 350Z / 370Z', brand: 'Nissan', type: 'coupe' },
  { id: 'mazda-mx5', name: 'Mazda MX-5 (Miata)', brand: 'Mazda', type: 'roadster' },
  { id: 'mazda-rx7', name: 'Mazda RX-7', brand: 'Mazda', type: 'coupe' },
  { id: 'bmw-3series', name: 'BMW 3 Series', brand: 'BMW', type: 'sedan' },
  { id: 'bmw-m3', name: 'BMW M3 / M4', brand: 'BMW', type: 'sports' },
  { id: 'ford-mustang', name: 'Ford Mustang', brand: 'Ford', type: 'coupe' },
  { id: 'ford-f150', name: 'Ford F-150 / Raptor', brand: 'Ford', type: 'truck' },
  { id: 'mitsubishi-evo', name: 'Mitsubishi Lancer Evolution', brand: 'Mitsubishi', type: 'sedan' },
  { id: 'porsche-911', name: 'Porsche 911', brand: 'Porsche', type: 'sports' },
  { id: 'jeep-wrangler', name: 'Jeep Wrangler', brand: 'Jeep', type: 'suv' },
  { id: 'suzuki-jimny', name: 'Suzuki Jimny', brand: 'Suzuki', type: 'suv' },
  { id: 'landrover-defender', name: 'Land Rover Defender', brand: 'Land Rover', type: 'suv' },
  { id: 'audi-a4', name: 'Audi A4 / S4 / RS4', brand: 'Audi', type: 'sedan' },
  { id: 'audi-a5', name: 'Audi A5 / S5 / RS5', brand: 'Audi', type: 'coupe' },
  { id: 'mercedes-cclass', name: 'Mercedes-Benz C-Class', brand: 'Mercedes-Benz', type: 'sedan' },
  { id: 'mini-cooper', name: 'MINI Cooper', brand: 'MINI', type: 'hatchback' },
  { id: 'chevy-camaro', name: 'Chevrolet Camaro', brand: 'Chevrolet', type: 'coupe' },
  { id: 'dodge-challenger', name: 'Dodge Challenger', brand: 'Dodge', type: 'coupe' },
  { id: 'lexus-is', name: 'Lexus IS', brand: 'Lexus', type: 'sedan' },
  { id: 'tesla-model3', name: 'Tesla Model 3', brand: 'Tesla', type: 'sedan' },
  { id: 'infiniti-g35', name: 'Infiniti G35 / G37', brand: 'Infiniti', type: 'sedan' },
];

// 生成 prompt
function buildPrompt(car: typeof CAR_MODELS[0]): string {
  const typeDesc: Record<string, string> = {
    sedan: '4-door sedan',
    coupe: '2-door sports coupe',
    sports: 'high-performance sports car',
    roadster: '2-seater convertible roadster',
    hatchback: 'compact hatchback',
    suv: 'SUV crossover',
    truck: 'pickup truck',
  };
  
  return `Professional automotive photography of ${car.name} (${typeDesc[car.type] || 'car'}), ${car.brand} brand, full body shot, complete vehicle view, studio lighting, 4K resolution, dark gradient background, 45-degree front side angle, complete body visible, no cropping, ultra high detail, photorealistic, commercial quality`;
}

// 保存目录
const OUTPUT_DIR = join(process.cwd(), 'public', 'imgs', 'cars');

// 创建输出目录
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 清空旧图片
console.log('🧹 清理旧图片...');
const oldFiles = require('fs').readdirSync(OUTPUT_DIR);
oldFiles.forEach((f: string) => {
  if (f.endsWith('.jpg') || f.endsWith('.png')) {
    rmSync(join(OUTPUT_DIR, f));
  }
});

// 调用 Qwen API
async function generateWithQwen(prompt: string): Promise<string> {
  if (!QWEN_API_KEY) {
    throw new Error('缺少 DASHSCOPE_API_KEY 或 QWEN_API_KEY 环境变量');
  }
  
  const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${QWEN_API_KEY}`,
      'Content-Type': 'application/json',
      'X-DashScope-Async': 'enable'
    },
    body: JSON.stringify({
      model: 'wanx2.1-t2i-turbo',
      input: {
        prompt: prompt,
      },
      parameters: {
        size: '1024*1024',
        n: 1
      },
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Qwen API 提交任务失败：${response.status} - ${error}`);
  }
  
  const initialResult = await response.json();
  const taskId = initialResult.output?.task_id;
  
  if (!taskId) {
    throw new Error('未获取到任务 ID');
  }

  console.log(`  任务已提交，ID: ${taskId}，等待生成...`);

  // 轮询任务状态
  let imageUrl = '';
  while (true) {
    const statusResponse = await fetch(`https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${QWEN_API_KEY}`,
      },
    });

    if (!statusResponse.ok) {
      throw new Error(`获取任务状态失败：${statusResponse.status}`);
    }

    const statusResult = await statusResponse.json();
    const taskStatus = statusResult.output?.task_status;

    if (taskStatus === 'SUCCEEDED') {
      imageUrl = statusResult.output?.results?.[0]?.url;
      break;
    } else if (taskStatus === 'FAILED') {
      throw new Error(`图片生成失败: ${statusResult.output?.message || '未知错误'}`);
    } else {
      // 继续等待
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  if (!imageUrl) {
    throw new Error('未找到图片 URL');
  }
  
  return imageUrl;
}

// 下载图片
async function downloadImage(url: string, filepath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('下载图片失败');
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  writeFileSync(filepath, buffer);
}

// 主函数
async function generateCarImages() {
  if (!QWEN_API_KEY) {
    console.error('❌ 错误：缺少 API Key');
    console.error('请设置环境变量: export DASHSCOPE_API_KEY=your_key');
    process.exit(1);
  }
  
  console.log(`\n🚗 开始使用 Qwen API 生成 ${CAR_MODELS.length} 款车型图片...\n`);
  
  const results: Array<{ id: string; success: boolean; error?: string }> = [];
  
  for (let i = 0; i < CAR_MODELS.length; i++) {
    const car = CAR_MODELS[i];
    const prompt = buildPrompt(car);
    const filename = `${car.id}.jpg`;
    const filepath = join(OUTPUT_DIR, filename);
    
    console.log(`\n[${i + 1}/${CAR_MODELS.length}] 生成 ${car.name} (${car.id})...`);
    
    try {
      // 调用 Qwen API
      const imageUrl = await generateWithQwen(prompt);
      console.log(`  图片 URL: ${imageUrl.substring(0, 60)}...`);
      console.log(`  下载图片中...`);
      
      // 下载图片
      await downloadImage(imageUrl, filepath);
      
      console.log(`  ✓ 已保存：${filepath}`);
      results.push({ id: car.id, success: true });
      
      // 避免请求过快，等待 2 秒
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error: any) {
      console.error(`  ✗ 失败：${error.message}`);
      results.push({ id: car.id, success: false, error: error.message });
    }
  }
  
  // 输出统计
  console.log('\n\n📊 生成统计:');
  console.log(`  总计：${results.length} 款`);
  console.log(`  成功：${results.filter(r => r.success).length} 款`);
  console.log(`  失败：${results.filter(r => !r.success).length} 款`);
  
  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.log('\n❌ 失败列表:');
    failed.forEach(r => console.log(`  - ${r.id}: ${r.error}`));
  }
  
  console.log(`\n✅ 图片已保存到：${OUTPUT_DIR}`);
}

// 执行
generateCarImages().catch(err => {
  console.error('执行出错:', err);
  process.exit(1);
});
