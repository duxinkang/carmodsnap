/**
 * 批量生成 31 款车型的展示图片
 * 使用网站自带的生图 API
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

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

// 生成每款车型的 prompt
function buildPrompt(car: typeof CAR_MODELS[0]): string {
  return `${car.name} (${car.brand}) full body shot, complete vehicle view, professional automotive photography, studio lighting, 4K resolution, dark background, 45-degree side angle, complete body visible, no cropping, high detail, realistic`;
}

// 保存目录
const OUTPUT_DIR = join(process.cwd(), 'public', 'imgs', 'cars');

// 创建输出目录
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  console.log(`✓ 创建目录：${OUTPUT_DIR}`);
}

console.log(`\n🚗 开始生成 ${CAR_MODELS.length} 款车型图片...\n`);

// 生成图片
async function generateCarImages() {
  const results: Array<{ id: string; success: boolean; error?: string }> = [];
  
  for (let i = 0; i < CAR_MODELS.length; i++) {
    const car = CAR_MODELS[i];
    const prompt = buildPrompt(car);
    const filename = `${car.id}.jpg`;
    const filepath = join(OUTPUT_DIR, filename);
    
    console.log(`[${i + 1}/${CAR_MODELS.length}] 生成 ${car.name}...`);
    
    try {
      // 调用生图 API
      const response = await fetch('http://localhost:3000/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mediaType: 'image',
          scene: 'text-to-image',
          provider: 'qwen',
          model: 'qwen-image-max',
          prompt: prompt,
          options: {
            size: '1024*1024',
            n: 1,
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API 响应失败：${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.code !== 0) {
        throw new Error(result.message || '生成失败');
      }
      
      // 提取图片 URL
      const taskInfo = JSON.parse(result.data.taskInfo || '{}');
      const imageUrl = taskInfo.output?.[0]?.url || taskInfo.images?.[0];
      
      if (!imageUrl) {
        throw new Error('未找到图片 URL');
      }
      
      // 下载图片
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error('下载图片失败');
      }
      
      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      writeFileSync(filepath, buffer);
      
      console.log(`  ✓ 已保存：${filepath}`);
      results.push({ id: car.id, success: true });
      
      // 避免请求过快
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
}

// 执行
generateCarImages().catch(console.error);
