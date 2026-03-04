'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';
import {
  Loader2,
  Sparkles,
  Download,
  Image as ImageIcon,
  Share2,
  FileText,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Check,
  CircleCheckBig,
  CircleDashed,
  Undo2,
  Redo2,
  WandSparkles,
} from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { AITaskStatus } from '@/extensions/ai/types';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Switch } from '@/shared/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { useAppContext } from '@/shared/contexts/app';
import { getUuid } from '@/shared/lib/hash';
import { Separator } from '@/shared/components/ui/separator';
import { Badge } from '@/shared/components/ui/badge';
import { CustomCarInput, type CustomCarInputData } from './custom-car-input';

const POLL_INTERVAL = 5000;
const GENERATION_TIMEOUT = 180000;

interface CarModel {
  id: string;
  name: string;
  nameZh: string;
  brand: string;
  type: string;
  image: string;
  localImage: string;
  price: number;
  customInput?: CustomCarInputData;
}

const CHINESE_CAR_MODELS: CarModel[] = [
  // Honda
  { id: 'honda-civic', name: 'Honda Civic', nameZh: '本田思域', brand: 'Honda', type: 'sedan', image: '/imgs/cars/honda-civic.jpg', localImage: '/imgs/cars/honda-civic.jpg', price: 150000 },
  { id: 'honda-s2000', name: 'Honda S2000', nameZh: '本田 S2000', brand: 'Honda', type: 'roadster', image: '/imgs/cars/honda-s2000.jpg', localImage: '/imgs/cars/honda-s2000.jpg', price: 350000 },
  // Toyota / Subaru
  { id: 'toyota-86-brz', name: 'Toyota 86 / Subaru BRZ', nameZh: '丰田 86/斯巴鲁 BRZ', brand: 'Toyota/Subaru', type: 'coupe', image: '/imgs/cars/toyota-86-brz.jpg', localImage: '/imgs/cars/toyota-86-brz.jpg', price: 280000 },
  { id: 'toyota-supra', name: 'Toyota Supra', nameZh: '丰田 Supra', brand: 'Toyota', type: 'sports', image: '/imgs/cars/toyota-supra.jpg', localImage: '/imgs/cars/toyota-supra.jpg', price: 600000 },
  { id: 'toyota-ae86', name: 'Toyota AE86', nameZh: '丰田 AE86', brand: 'Toyota', type: 'coupe', image: '/imgs/cars/toyota-ae86.jpg', localImage: '/imgs/cars/toyota-ae86.jpg', price: 150000 },
  { id: 'subaru-wrx', name: 'Subaru WRX / STI', nameZh: '斯巴鲁 WRX/STI', brand: 'Subaru', type: 'sedan', image: '/imgs/cars/subaru-wrx.jpg', localImage: '/imgs/cars/subaru-wrx.jpg', price: 350000 },
  // Volkswagen
  { id: 'vw-golf', name: 'Volkswagen Golf', nameZh: '大众高尔夫', brand: 'Volkswagen', type: 'hatchback', image: '/imgs/cars/vw-golf.jpg', localImage: '/imgs/cars/vw-golf.jpg', price: 150000 },
  { id: 'vw-beetle', name: 'Volkswagen Beetle', nameZh: '大众甲壳虫', brand: 'Volkswagen', type: 'hatchback', image: '/imgs/cars/vw-beetle.jpg', localImage: '/imgs/cars/vw-beetle.jpg', price: 200000 },
  // Nissan
  { id: 'nissan-gtr', name: 'Nissan Skyline GT-R', nameZh: '日产 GT-R', brand: 'Nissan', type: 'sports', image: '/imgs/cars/nissan-gtr.jpg', localImage: '/imgs/cars/nissan-gtr.jpg', price: 1500000 },
  { id: 'nissan-silvia', name: 'Nissan Silvia (S13-S15)', nameZh: '日产 Silvia', brand: 'Nissan', type: 'coupe', image: '/imgs/cars/nissan-silvia.jpg', localImage: '/imgs/cars/nissan-silvia.jpg', price: 200000 },
  { id: 'nissan-370z', name: 'Nissan 350Z / 370Z', nameZh: '日产 370Z', brand: 'Nissan', type: 'coupe', image: '/imgs/cars/nissan-370z.jpg', localImage: '/imgs/cars/nissan-370z.jpg', price: 350000 },
  // Mazda
  { id: 'mazda-mx5', name: 'Mazda MX-5 (Miata)', nameZh: '马自达 MX-5', brand: 'Mazda', type: 'roadster', image: '/imgs/cars/mazda-mx5.jpg', localImage: '/imgs/cars/mazda-mx5.jpg', price: 350000 },
  { id: 'mazda-rx7', name: 'Mazda RX-7', nameZh: '马自达 RX-7', brand: 'Mazda', type: 'coupe', image: '/imgs/cars/mazda-rx7.jpg', localImage: '/imgs/cars/mazda-rx7.jpg', price: 500000 },
  // BMW
  { id: 'bmw-3series', name: 'BMW 3 Series', nameZh: '宝马 3 系', brand: 'BMW', type: 'sedan', image: '/imgs/cars/bmw-3series.jpg', localImage: '/imgs/cars/bmw-3series.jpg', price: 300000 },
  { id: 'bmw-m3', name: 'BMW M3 / M4', nameZh: '宝马 M3/M4', brand: 'BMW', type: 'sports', image: '/imgs/cars/bmw-m3.jpg', localImage: '/imgs/cars/bmw-m3.jpg', price: 800000 },
  // Ford
  { id: 'ford-mustang', name: 'Ford Mustang', nameZh: '福特野马', brand: 'Ford', type: 'coupe', image: '/imgs/cars/ford-mustang.jpg', localImage: '/imgs/cars/ford-mustang.jpg', price: 400000 },
  { id: 'ford-f150', name: 'Ford F-150 / Raptor', nameZh: '福特 F-150', brand: 'Ford', type: 'truck', image: '/imgs/cars/ford-f150.jpg', localImage: '/imgs/cars/ford-f150.jpg', price: 600000 },
  // Mitsubishi
  { id: 'mitsubishi-evo', name: 'Mitsubishi Lancer Evolution', nameZh: '三菱 EVO', brand: 'Mitsubishi', type: 'sedan', image: '/imgs/cars/mitsubishi-evo.jpg', localImage: '/imgs/cars/mitsubishi-evo.jpg', price: 450000 },
  // Porsche
  { id: 'porsche-911', name: 'Porsche 911', nameZh: '保时捷 911', brand: 'Porsche', type: 'sports', image: '/imgs/cars/porsche-911.jpg', localImage: '/imgs/cars/porsche-911.jpg', price: 1500000 },
  // Jeep / Suzuki / Land Rover
  { id: 'jeep-wrangler', name: 'Jeep Wrangler', nameZh: '吉普牧马人', brand: 'Jeep', type: 'suv', image: '/imgs/cars/jeep-wrangler.jpg', localImage: '/imgs/cars/jeep-wrangler.jpg', price: 450000 },
  { id: 'suzuki-jimny', name: 'Suzuki Jimny', nameZh: '铃木吉姆尼', brand: 'Suzuki', type: 'suv', image: '/imgs/cars/suzuki-jimny.jpg', localImage: '/imgs/cars/suzuki-jimny.jpg', price: 150000 },
  { id: 'landrover-defender', name: 'Land Rover Defender', nameZh: '路虎卫士', brand: 'Land Rover', type: 'suv', image: '/imgs/cars/landrover-defender.jpg', localImage: '/imgs/cars/landrover-defender.jpg', price: 700000 },
  // Audi
  { id: 'audi-a4', name: 'Audi A4 / S4 / RS4', nameZh: '奥迪 A4', brand: 'Audi', type: 'sedan', image: '/imgs/cars/audi-a4.jpg', localImage: '/imgs/cars/audi-a4.jpg', price: 350000 },
  { id: 'audi-a5', name: 'Audi A5 / S5 / RS5', nameZh: '奥迪 A5', brand: 'Audi', type: 'coupe', image: '/imgs/cars/audi-a5.jpg', localImage: '/imgs/cars/audi-a5.jpg', price: 500000 },
  // Mercedes-Benz
  { id: 'mercedes-cclass', name: 'Mercedes-Benz C-Class', nameZh: '奔驰 C 级', brand: 'Mercedes-Benz', type: 'sedan', image: '/imgs/cars/mercedes-cclass.jpg', localImage: '/imgs/cars/mercedes-cclass.jpg', price: 350000 },
  // MINI
  { id: 'mini-cooper', name: 'MINI Cooper', nameZh: 'MINI Cooper', brand: 'MINI', type: 'hatchback', image: '/imgs/cars/mini-cooper.jpg', localImage: '/imgs/cars/mini-cooper.jpg', price: 280000 },
  // Chevrolet / Dodge
  { id: 'chevy-camaro', name: 'Chevrolet Camaro', nameZh: '雪佛兰科迈罗', brand: 'Chevrolet', type: 'coupe', image: '/imgs/cars/chevy-camaro.jpg', localImage: '/imgs/cars/chevy-camaro.jpg', price: 400000 },
  { id: 'dodge-challenger', name: 'Dodge Challenger', nameZh: '道奇挑战者', brand: 'Dodge', type: 'coupe', image: '/imgs/cars/dodge-challenger.jpg', localImage: '/imgs/cars/dodge-challenger.jpg', price: 450000 },
  // Lexus
  { id: 'lexus-is', name: 'Lexus IS', nameZh: '雷克萨斯 IS', brand: 'Lexus', type: 'sedan', image: '/imgs/cars/lexus-is.jpg', localImage: '/imgs/cars/lexus-is.jpg', price: 350000 },
  // Tesla
  { id: 'tesla-model3', name: 'Tesla Model 3', nameZh: '特斯拉 Model 3', brand: 'Tesla', type: 'sedan', image: '/imgs/cars/tesla-model3.jpg', localImage: '/imgs/cars/tesla-model3.jpg', price: 280000 },
  // Infiniti
  { id: 'infiniti-g35', name: 'Infiniti G35 / G37', nameZh: '英菲尼迪 G35', brand: 'Infiniti', type: 'sedan', image: '/imgs/cars/infiniti-g35.jpg', localImage: '/imgs/cars/infiniti-g35.jpg', price: 250000 },
];

type WheelConcavity = 'low' | 'mid' | 'deep';

interface WheelStyle {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  price: number;
  tags: string[];
  defaultSpokeCount: number;
  defaultConcavity: WheelConcavity;
}

interface WheelSpec {
  size: number;
  spokeCount: number;
  colorId: string;
  concavity: WheelConcavity;
}

interface PresetPack {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  wheelId: string;
  colorId: string;
  finishId: string;
  wheelSpec: WheelSpec;
  mods: string[];
  accents: string[];
}

const WHEEL_SIZES = [17, 18, 19, 20];
const SPOKE_COUNTS = [5, 6, 7, 8, 10, 12];
const WHEEL_CONCAVITY_OPTIONS: { id: WheelConcavity; name: string; nameZh: string; extraCost: number }[] = [
  { id: 'low', name: 'Low', nameZh: '浅凹', extraCost: 0 },
  { id: 'mid', name: 'Medium', nameZh: '中凹', extraCost: 800 },
  { id: 'deep', name: 'Deep', nameZh: '深凹', extraCost: 1500 },
];
const WHEEL_COLORS = [
  { id: 'satin-black', name: 'Satin Black', nameZh: '缎面黑', extraCost: 0 },
  { id: 'gunmetal', name: 'Gunmetal Gray', nameZh: '枪灰', extraCost: 500 },
  { id: 'bronze', name: 'Bronze', nameZh: '古铜', extraCost: 1200 },
  { id: 'silver', name: 'Machined Silver', nameZh: '亮银', extraCost: 300 },
  { id: 'white', name: 'Rally White', nameZh: '拉力白', extraCost: 800 },
];

const WHEEL_SIZE_EXTRA_COST: Record<number, number> = {
  17: 0,
  18: 1000,
  19: 2200,
  20: 3800,
};

const WHEEL_STYLES: WheelStyle[] = [
  { id: 'stock', name: 'Stock Wheels', nameZh: '原厂轮毂', description: 'Keep original factory wheels', descriptionZh: '保持原厂轮毂样式', price: 0, tags: ['daily'], defaultSpokeCount: 10, defaultConcavity: 'low' },
  { id: 'split5', name: 'Split-5 Sport', nameZh: '五辐分叉运动', description: 'Balanced street performance style', descriptionZh: '街道性能均衡风格', price: 7000, tags: ['sport', 'street'], defaultSpokeCount: 5, defaultConcavity: 'mid' },
  { id: 'mesh-rs', name: 'Mesh RS', nameZh: '网格 RS', description: 'Dense mesh for premium stance', descriptionZh: '密辐网格豪华姿态', price: 9500, tags: ['luxury', 'show'], defaultSpokeCount: 12, defaultConcavity: 'mid' },
  { id: 'forged-y', name: 'Forged Y-Spoke', nameZh: 'Y 辐锻造', description: 'Light forged wheel for quick response', descriptionZh: '轻量锻造提升响应', price: 15000, tags: ['track', 'forged'], defaultSpokeCount: 10, defaultConcavity: 'mid' },
  { id: 'te37-style', name: '6-Spoke Track', nameZh: '六辐赛道', description: 'Classic six spoke motorsport look', descriptionZh: '经典六辐竞技风格', price: 12000, tags: ['track', 'sport'], defaultSpokeCount: 6, defaultConcavity: 'deep' },
  { id: 'turbofan', name: 'Turbo Fan', nameZh: '涡轮风扇盘', description: 'Retro aerodynamic fan face', descriptionZh: '复古空气动力学轮面', price: 8000, tags: ['retro', 'show'], defaultSpokeCount: 7, defaultConcavity: 'low' },
  { id: 'monoblock', name: 'Luxury Monoblock', nameZh: '豪华一体盘', description: 'Large monoblock luxury finish', descriptionZh: '大尺寸豪华一体盘', price: 13800, tags: ['luxury'], defaultSpokeCount: 5, defaultConcavity: 'mid' },
  { id: 'drift-x', name: 'Drift X', nameZh: '漂移 X 辐', description: 'Aggressive drift style layout', descriptionZh: '激进漂移风格布局', price: 9800, tags: ['drift', 'sport'], defaultSpokeCount: 6, defaultConcavity: 'deep' },
  { id: 'rally-star', name: 'Rally Star', nameZh: '拉力星型', description: 'High durability rally wheel look', descriptionZh: '耐用拉力风外观', price: 9200, tags: ['rally', 'street'], defaultSpokeCount: 5, defaultConcavity: 'low' },
  { id: 'concave-v', name: 'Concave V', nameZh: 'V 辐深凹', description: 'Deep concave V-spoke profile', descriptionZh: 'V 辐深凹轮面', price: 12800, tags: ['show', 'sport'], defaultSpokeCount: 10, defaultConcavity: 'deep' },
  { id: 'blade-10', name: 'Blade 10', nameZh: '刀锋十辐', description: 'Sharp blade-like ten spokes', descriptionZh: '锋利刀锋十辐设计', price: 10500, tags: ['sport'], defaultSpokeCount: 10, defaultConcavity: 'mid' },
  { id: 'classic-mesh', name: 'Classic Mesh', nameZh: '经典网格', description: 'Timeless old-school mesh style', descriptionZh: '经典老派网格风格', price: 8600, tags: ['retro', 'luxury'], defaultSpokeCount: 12, defaultConcavity: 'low' },
  { id: 'gt-arc', name: 'GT Arc', nameZh: 'GT 弧线辐', description: 'GT-inspired arc spoke geometry', descriptionZh: 'GT 灵感弧线辐条', price: 11800, tags: ['sport', 'track'], defaultSpokeCount: 8, defaultConcavity: 'mid' },
  { id: 'aero-disc', name: 'Aero Disc', nameZh: '空气动力盘', description: 'Disc-like aero cover styling', descriptionZh: '盘式空气动力学风格', price: 9900, tags: ['ev', 'show'], defaultSpokeCount: 5, defaultConcavity: 'low' },
  { id: 'wire-lux', name: 'Wire Lux', nameZh: '复古钢丝豪华', description: 'Modernized wire wheel feel', descriptionZh: '现代化钢丝轮质感', price: 13200, tags: ['luxury', 'retro'], defaultSpokeCount: 12, defaultConcavity: 'low' },
  { id: 'forged-h', name: 'Forged H', nameZh: 'H 辐锻造', description: 'Rigid forged H-spoke shape', descriptionZh: '高刚性 H 辐锻造结构', price: 16200, tags: ['forged', 'track'], defaultSpokeCount: 8, defaultConcavity: 'deep' },
  { id: 'street-8', name: 'Street 8', nameZh: '街道八辐', description: 'Clean everyday eight spoke wheel', descriptionZh: '干净利落的八辐日常风', price: 7600, tags: ['daily', 'street'], defaultSpokeCount: 8, defaultConcavity: 'mid' },
  { id: 'stance-pro', name: 'Stance Pro', nameZh: '姿态派 Pro', description: 'Ultra low-offset stance look', descriptionZh: '低趴姿态派风格', price: 14200, tags: ['show', 'stance'], defaultSpokeCount: 10, defaultConcavity: 'deep' },
];

const PAINT_COLORS = [
  { id: 'midnight-black', name: 'Midnight Black', nameZh: '午夜黑', color: '#0a0a0a', description: 'Deep mysterious black', descriptionZh: '深邃神秘的黑色', price: 0 },
  { id: 'pearl-white', name: 'Pearl White', nameZh: '珍珠白', color: '#f5f5f5', description: 'Elegant pure white', descriptionZh: '优雅纯净的白色', price: 0 },
  { id: 'racing-red', name: 'Racing Red', nameZh: '赛道红', color: '#c41e3a', description: 'Passionate vibrant red', descriptionZh: '激情澎湃的红色', price: 0 },
  { id: 'ocean-blue', name: 'Ocean Blue', nameZh: '海洋蓝', color: '#0066cc', description: 'Deep tranquil blue', descriptionZh: '深邃宁静的蓝色', price: 0 },
  { id: 'forest-green', name: 'Forest Green', nameZh: '森林绿', color: '#228b22', description: 'Natural fresh green', descriptionZh: '自然清新的绿色', price: 0 },
  { id: 'sunset-orange', name: 'Sunset Orange', nameZh: '日落橙', color: '#ff6b35', description: 'Energetic vibrant orange', descriptionZh: '活力四射的橙色', price: 3000 },
  { id: 'royal-purple', name: 'Royal Purple', nameZh: '皇家紫', color: '#6b3fa0', description: 'Noble elegant purple', descriptionZh: '高贵典雅的紫色', price: 3000 },
  { id: 'titanium-gray', name: 'Titanium Gray', nameZh: '钛金灰', color: '#4a5568', description: 'Tech-inspired gray', descriptionZh: '科技感十足的灰色', price: 0 },
  { id: 'champagne-gold', name: 'Champagne Gold', nameZh: '香槟金', color: '#d4af37', description: 'Luxurious atmospheric gold', descriptionZh: '奢华大气的金色', price: 5000 },
  { id: 'matte-black', name: 'Matte Black', nameZh: '哑光黑', color: '#1a1a1a', description: 'Low-key understated matte black', descriptionZh: '低调内敛的哑光黑', price: 4000 },
];

const FINISH_TYPES = [
  { id: 'gloss', name: 'Gloss Metallic', nameZh: '金属亮光', description: 'High-gloss metallic paint', descriptionZh: '高光泽度金属漆', price: 0 },
  { id: 'matte', name: 'Matte Wrap', nameZh: '哑光贴膜', description: 'Matte body wrap film', descriptionZh: '哑光车身膜', price: 8000 },
  { id: 'satin', name: 'Satin Pearl', nameZh: '缎面珍珠', description: 'Satin pearl paint', descriptionZh: '缎面珍珠漆', price: 6000 },
  { id: 'chrome', name: 'Chrome', nameZh: '镀铬', description: 'Chrome effect', descriptionZh: '镀铬效果', price: 15000 },
  { id: 'carbon', name: 'Carbon Fiber', nameZh: '碳纤维', description: 'Carbon fiber texture', descriptionZh: '碳纤维纹理', price: 20000 },
];

const MODIFICATION_OPTIONS = [
  { id: 'lowered', name: 'Lowered Suspension', nameZh: '降低车身', description: 'Sport stance, lower center of gravity', descriptionZh: '运动姿态，降低重心', price: 5000 },
  { id: 'widebody', name: 'Widebody Kit', nameZh: '宽体套件', description: 'Wider track, aggressive look', descriptionZh: '更宽的轮距，更激进的外观', price: 15000 },
  { id: 'spoiler', name: 'Rear Spoiler', nameZh: '尾翼', description: 'Add downforce, sport style', descriptionZh: '增加下压力，运动风格', price: 3000 },
  { id: 'diffuser', name: 'Rear Diffuser', nameZh: '扩散器', description: 'Optimize aerodynamics', descriptionZh: '优化空气动力学', price: 4000 },
  { id: 'side-skirts', name: 'Side Skirts', nameZh: '侧裙', description: 'Lower visual center of gravity', descriptionZh: '降低视觉重心', price: 2500 },
  { id: 'front-lip', name: 'Front Lip', nameZh: '前唇', description: 'Enhance front sportiness', descriptionZh: '增强前部运动感', price: 2000 },
];

const ACCENT_OPTIONS = [
  { id: 'chrome-delete', name: 'Chrome Delete', nameZh: '镀铬删除', description: 'Remove chrome trim', descriptionZh: '去除镀铬装饰', price: 1500 },
  { id: 'carbon-roof', name: 'Carbon Roof', nameZh: '碳纤维车顶', description: 'Carbon fiber roof', descriptionZh: '碳纤维车顶', price: 8000 },
  { id: 'racing-stripes', name: 'Racing Stripes', nameZh: '赛车条纹', description: 'Racing stripe decals', descriptionZh: '赛车条纹', price: 2000 },
  { id: 'custom-badge', name: 'Custom Badge', nameZh: '定制徽章', description: 'Custom emblem', descriptionZh: '定制徽章', price: 1000 },
];

const PRESET_PACKS: PresetPack[] = [
  {
    id: 'street-sport',
    name: 'Street Sport',
    nameZh: '街头运动',
    description: 'Balanced sporty setup for daily use',
    descriptionZh: '日常可用的均衡运动方案',
    wheelId: 'split5',
    colorId: 'racing-red',
    finishId: 'gloss',
    wheelSpec: { size: 18, spokeCount: 5, colorId: 'gunmetal', concavity: 'mid' },
    mods: ['lowered', 'front-lip'],
    accents: ['chrome-delete'],
  },
  {
    id: 'blackout',
    name: 'Blackout',
    nameZh: '黑武士',
    description: 'Stealth all-black appearance',
    descriptionZh: '全黑隐形风格',
    wheelId: 'stance-pro',
    colorId: 'matte-black',
    finishId: 'matte',
    wheelSpec: { size: 19, spokeCount: 10, colorId: 'satin-black', concavity: 'deep' },
    mods: ['widebody', 'side-skirts', 'front-lip'],
    accents: ['chrome-delete', 'carbon-roof'],
  },
  {
    id: 'track-day',
    name: 'Track Day',
    nameZh: '赛道日',
    description: 'Lightweight and aero-focused',
    descriptionZh: '轻量与空气动力导向',
    wheelId: 'forged-y',
    colorId: 'pearl-white',
    finishId: 'gloss',
    wheelSpec: { size: 19, spokeCount: 10, colorId: 'bronze', concavity: 'mid' },
    mods: ['lowered', 'spoiler', 'diffuser'],
    accents: ['custom-badge'],
  },
  {
    id: 'luxury-gt',
    name: 'Luxury GT',
    nameZh: '豪华 GT',
    description: 'Premium grand touring look',
    descriptionZh: '豪华巡航 GT 风',
    wheelId: 'monoblock',
    colorId: 'champagne-gold',
    finishId: 'satin',
    wheelSpec: { size: 20, spokeCount: 5, colorId: 'silver', concavity: 'mid' },
    mods: ['side-skirts'],
    accents: ['chrome-delete', 'custom-badge'],
  },
  {
    id: 'jdm-drift',
    name: 'JDM Drift',
    nameZh: 'JDM 漂移',
    description: 'Sharp stance with drift vibe',
    descriptionZh: '激进姿态漂移风',
    wheelId: 'drift-x',
    colorId: 'sunset-orange',
    finishId: 'gloss',
    wheelSpec: { size: 18, spokeCount: 6, colorId: 'white', concavity: 'deep' },
    mods: ['lowered', 'widebody', 'spoiler'],
    accents: ['racing-stripes'],
  },
  {
    id: 'retro-club',
    name: 'Retro Club',
    nameZh: '复古俱乐部',
    description: 'Classic style with modern paint',
    descriptionZh: '复古轮毂搭配现代涂装',
    wheelId: 'classic-mesh',
    colorId: 'ocean-blue',
    finishId: 'satin',
    wheelSpec: { size: 17, spokeCount: 12, colorId: 'silver', concavity: 'low' },
    mods: ['side-skirts'],
    accents: ['custom-badge'],
  },
  {
    id: 'offroad-rally',
    name: 'Rally Build',
    nameZh: '拉力风',
    description: 'Rugged wheel + vivid accents',
    descriptionZh: '硬朗轮毂与亮色点缀',
    wheelId: 'rally-star',
    colorId: 'forest-green',
    finishId: 'gloss',
    wheelSpec: { size: 18, spokeCount: 5, colorId: 'white', concavity: 'low' },
    mods: ['spoiler'],
    accents: ['racing-stripes'],
  },
  {
    id: 'ev-clean',
    name: 'EV Clean',
    nameZh: '新能源极简',
    description: 'Minimal aero look for modern EVs',
    descriptionZh: '现代新能源简洁风格',
    wheelId: 'aero-disc',
    colorId: 'titanium-gray',
    finishId: 'gloss',
    wheelSpec: { size: 19, spokeCount: 5, colorId: 'gunmetal', concavity: 'low' },
    mods: ['side-skirts', 'front-lip'],
    accents: ['chrome-delete'],
  },
];

const HISTORY_STORAGE_KEY = 'carmodder-history-v1';

interface BuildSnapshot {
  selectedCar: CarModel;
  selectedWheelId: string;
  selectedColorId: string;
  selectedFinishId: string;
  selectedMods: string[];
  accentOptions: Record<string, boolean>;
  wheelSpec: WheelSpec;
  activePresetId: string | null;
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt?: string;
}

type ShowcaseShotType = 'panorama' | 'closeup';
type ShotStatus = 'idle' | AITaskStatus;

interface ShowcaseShotState {
  image: GeneratedImage | null;
  status: ShotStatus;
  taskId: string | null;
  error: string | null;
}

type ShowcaseStates = Record<ShowcaseShotType, ShowcaseShotState>;

interface ShowcaseTaskResp {
  shotType: ShowcaseShotType;
  id?: string;
  status: AITaskStatus | 'failed';
  message?: string;
  taskInfo?: string | null;
  taskResult?: string | null;
  prompt?: string;
}

interface BackendTask {
  id: string;
  status: string;
  provider: string;
  model: string;
  prompt: string | null;
  taskInfo: string | null;
  taskResult: string | null;
}

const SHOT_TYPES: ShowcaseShotType[] = ['panorama', 'closeup'];

const getInitialShowcaseStates = (): ShowcaseStates => ({
  panorama: {
    image: null,
    status: 'idle',
    taskId: null,
    error: null,
  },
  closeup: {
    image: null,
    status: 'idle',
    taskId: null,
    error: null,
  },
});

function parseTaskResult(taskResult: string | null): any {
  if (!taskResult) return null;
  try {
    return JSON.parse(taskResult);
  } catch {
    return null;
  }
}

function extractImageUrls(result: any): string[] {
  if (!result) return [];
  const output = result.output ?? result.images ?? result.data;
  if (!output) return [];
  if (typeof output === 'string') return [output];
  if (Array.isArray(output)) {
    return output.flatMap((item) => {
      if (!item) return [];
      if (typeof item === 'string') return [item];
      if (typeof item === 'object') {
        const candidate = item.url ?? item.uri ?? item.image ?? item.src ?? item.imageUrl;
        return typeof candidate === 'string' ? [candidate] : [];
      }
      return [];
    }).filter(Boolean);
  }
  if (typeof output === 'object') {
    const candidate = output.url ?? output.uri ?? output.image ?? output.src ?? output.imageUrl;
    if (typeof candidate === 'string') return [candidate];
  }
  return [];
}

function buildAccentMap(ids: string[]): Record<string, boolean> {
  return ACCENT_OPTIONS.reduce<Record<string, boolean>>((acc, item) => {
    acc[item.id] = ids.includes(item.id);
    return acc;
  }, {});
}

function normalizeWheelSpec(spec?: Partial<WheelSpec>): WheelSpec {
  return {
    size: WHEEL_SIZES.includes(spec?.size ?? 0) ? (spec?.size as number) : 18,
    spokeCount: SPOKE_COUNTS.includes(spec?.spokeCount ?? 0) ? (spec?.spokeCount as number) : 8,
    colorId: WHEEL_COLORS.some((item) => item.id === spec?.colorId) ? (spec?.colorId as string) : 'satin-black',
    concavity: WHEEL_CONCAVITY_OPTIONS.some((item) => item.id === spec?.concavity)
      ? (spec?.concavity as WheelConcavity)
      : 'mid',
  };
}

export default function CarModderConfigurator() {
  const t = useTranslations('pages.carmodder');
  const locale = useLocale();
  const isZh = locale === 'zh';

  const [selectedCar, setSelectedCar] = useState<CarModel>(CHINESE_CAR_MODELS[0]);
  const [selectedWheel, setSelectedWheel] = useState<WheelStyle>(WHEEL_STYLES[0]);
  const [wheelSpec, setWheelSpec] = useState<WheelSpec>(() => normalizeWheelSpec({
    size: 18,
    spokeCount: WHEEL_STYLES[0].defaultSpokeCount,
    colorId: 'satin-black',
    concavity: WHEEL_STYLES[0].defaultConcavity,
  }));
  const [selectedColor, setSelectedColor] = useState(PAINT_COLORS[0]);
  const [selectedFinish, setSelectedFinish] = useState(FINISH_TYPES[0]);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('paint');
  const [accentOptions, setAccentOptions] = useState<Record<string, boolean>>(buildAccentMap([]));
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [showAdvancedWheels, setShowAdvancedWheels] = useState(false);

  const [showcaseStates, setShowcaseStates] = useState<ShowcaseStates>(
    getInitialShowcaseStates
  );
  const [activeShot, setActiveShot] = useState<ShowcaseShotType>('panorama');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(null);
  const [downloadingImageId, setDownloadingImageId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [showAllCars, setShowAllCars] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [comparePosition, setComparePosition] = useState(52);
  const [historyState, setHistoryState] = useState<{ entries: BuildSnapshot[]; index: number }>({
    entries: [],
    index: -1,
  });
  const [historyReady, setHistoryReady] = useState(false);
  const applyingSnapshotRef = useRef(false);

  const handleCustomCarSubmit = useCallback((data: CustomCarInputData) => {
    const customCar = {
      id: `custom-${Date.now()}`,
      name: `${data.brand} ${data.model}`,
      nameZh: `${data.brand} ${data.model}`,
      brand: data.brand,
      type: data.type,
      image: data.imageUrl || 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop',
      localImage: data.imageUrl || '/imgs/cars/honda-civic.jpg',
      price: 300000,
      customInput: data,
    };
    setSelectedCar(customCar);
    setActivePresetId(null);
    setShowCustomInput(false);
    toast.success(t('carAdded'));
  }, [t]);

  const { user, setIsShowSignModal, fetchUserCredits } = useAppContext();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (activeShot !== 'panorama' && compareMode) {
      setCompareMode(false);
    }
  }, [activeShot, compareMode]);

  const applySnapshot = useCallback((snapshot: BuildSnapshot) => {
    applyingSnapshotRef.current = true;
    setSelectedCar(snapshot.selectedCar);
    setSelectedWheel(WHEEL_STYLES.find((w) => w.id === snapshot.selectedWheelId) ?? WHEEL_STYLES[0]);
    setSelectedColor(PAINT_COLORS.find((item) => item.id === snapshot.selectedColorId) ?? PAINT_COLORS[0]);
    setSelectedFinish(FINISH_TYPES.find((item) => item.id === snapshot.selectedFinishId) ?? FINISH_TYPES[0]);
    setSelectedMods(snapshot.selectedMods.filter((id) => MODIFICATION_OPTIONS.some((m) => m.id === id)));
    setAccentOptions(buildAccentMap(
      Object.entries(snapshot.accentOptions)
        .filter(([, enabled]) => enabled)
        .map(([id]) => id)
    ));
    setWheelSpec(normalizeWheelSpec(snapshot.wheelSpec));
    setActivePresetId(snapshot.activePresetId);
    setTimeout(() => {
      applyingSnapshotRef.current = false;
    }, 0);
  }, []);

  const createSnapshot = useCallback((): BuildSnapshot => ({
    selectedCar,
    selectedWheelId: selectedWheel.id,
    selectedColorId: selectedColor.id,
    selectedFinishId: selectedFinish.id,
    selectedMods,
    accentOptions,
    wheelSpec: normalizeWheelSpec(wheelSpec),
    activePresetId,
  }), [
    selectedCar,
    selectedWheel,
    selectedColor,
    selectedFinish,
    selectedMods,
    accentOptions,
    wheelSpec,
    activePresetId,
  ]);

  useEffect(() => {
    if (!isMounted) return;
    try {
      const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BuildSnapshot[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.slice(-10).map((item) => ({
            ...item,
            selectedMods: Array.isArray(item.selectedMods) ? item.selectedMods : [],
            accentOptions: item.accentOptions ?? buildAccentMap([]),
            wheelSpec: normalizeWheelSpec(item.wheelSpec),
            activePresetId: item.activePresetId ?? null,
          }));
          setHistoryState({ entries: normalized, index: normalized.length - 1 });
          applySnapshot(normalized[normalized.length - 1]);
        }
      }
    } catch (error) {
      console.error('读取历史记录失败:', error);
    } finally {
      setHistoryReady(true);
    }
  }, [isMounted, applySnapshot]);

  useEffect(() => {
    if (!isMounted || !historyReady || applyingSnapshotRef.current) return;
    const current = createSnapshot();
    setHistoryState((prev) => {
      const base = prev.entries.slice(0, prev.index + 1);
      const last = base[base.length - 1];
      const lastSignature = last ? JSON.stringify(last) : '';
      const currentSignature = JSON.stringify(current);
      if (lastSignature === currentSignature) return prev;
      const nextEntries = [...base, current].slice(-10);
      return {
        entries: nextEntries,
        index: nextEntries.length - 1,
      };
    });
  }, [isMounted, historyReady, createSnapshot]);

  useEffect(() => {
    if (!isMounted || !historyReady) return;
    try {
      window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyState.entries));
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
  }, [historyState.entries, isMounted, historyReady]);

  const costCredits = 4;
  const remainingCredits = user?.credits?.remainingCredits ?? 0;

  const toggleMod = (modId: string) => {
    setActivePresetId(null);
    setSelectedMods((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
  };

  const toggleAccent = (accentId: string) => {
    setActivePresetId(null);
    setAccentOptions((prev) => ({
      ...prev,
      [accentId]: !prev[accentId],
    }));
  };

  const updateWheelSpec = useCallback((patch: Partial<WheelSpec>) => {
    setActivePresetId(null);
    setWheelSpec((prev) => normalizeWheelSpec({ ...prev, ...patch }));
  }, []);

  const handleWheelStyleSelect = useCallback((wheel: WheelStyle) => {
    setActivePresetId(null);
    setSelectedWheel(wheel);
    setWheelSpec((prev) => normalizeWheelSpec({
      ...prev,
      spokeCount: wheel.defaultSpokeCount,
      concavity: wheel.defaultConcavity,
    }));
  }, []);

  const applyPreset = useCallback((preset: PresetPack) => {
    const wheel = WHEEL_STYLES.find((item) => item.id === preset.wheelId) ?? WHEEL_STYLES[0];
    const color = PAINT_COLORS.find((item) => item.id === preset.colorId) ?? PAINT_COLORS[0];
    const finish = FINISH_TYPES.find((item) => item.id === preset.finishId) ?? FINISH_TYPES[0];
    setSelectedWheel(wheel);
    setSelectedColor(color);
    setSelectedFinish(finish);
    setSelectedMods(preset.mods.filter((id) => MODIFICATION_OPTIONS.some((mod) => mod.id === id)));
    setAccentOptions(buildAccentMap(preset.accents));
    setWheelSpec(normalizeWheelSpec(preset.wheelSpec));
    setActivePresetId(preset.id);
    toast.success(t('presetApplied', { name: isZh ? preset.nameZh : preset.name }));
  }, [isZh, t]);

  const handleUndo = useCallback(() => {
    setHistoryState((prev) => {
      if (prev.index <= 0) return prev;
      const nextIndex = prev.index - 1;
      const snapshot = prev.entries[nextIndex];
      if (snapshot) {
        applySnapshot(snapshot);
      }
      return { ...prev, index: nextIndex };
    });
  }, [applySnapshot]);

  const handleRedo = useCallback(() => {
    setHistoryState((prev) => {
      if (prev.index >= prev.entries.length - 1) return prev;
      const nextIndex = prev.index + 1;
      const snapshot = prev.entries[nextIndex];
      if (snapshot) {
        applySnapshot(snapshot);
      }
      return { ...prev, index: nextIndex };
    });
  }, [applySnapshot]);

  const recommendedPresets = useMemo(() => {
    const type = selectedCar.type;
    const map: Record<string, string[]> = {
      sedan: ['street-sport', 'blackout', 'luxury-gt'],
      coupe: ['track-day', 'jdm-drift', 'blackout'],
      sports: ['track-day', 'blackout', 'street-sport'],
      suv: ['offroad-rally', 'blackout', 'luxury-gt'],
      hatchback: ['jdm-drift', 'retro-club', 'street-sport'],
      roadster: ['track-day', 'retro-club', 'street-sport'],
      truck: ['offroad-rally', 'blackout', 'street-sport'],
    };
    const ids = map[type] ?? ['street-sport', 'blackout', 'track-day'];
    return ids
      .map((id) => PRESET_PACKS.find((item) => item.id === id))
      .filter((item): item is PresetPack => !!item);
  }, [selectedCar.type]);

  const buildPrompt = useCallback(() => {
    const parts: string[] = [];

    parts.push(`${isZh ? selectedCar.nameZh : selectedCar.name} (${selectedCar.brand})`);
    parts.push(`${t('paint')}: ${isZh ? selectedColor.nameZh : selectedColor.name} (${isZh ? selectedFinish.nameZh : selectedFinish.name}${t('paintFinish')})`);
    const wheelColor = WHEEL_COLORS.find((item) => item.id === wheelSpec.colorId) ?? WHEEL_COLORS[0];
    const concavity = WHEEL_CONCAVITY_OPTIONS.find((item) => item.id === wheelSpec.concavity) ?? WHEEL_CONCAVITY_OPTIONS[1];
    parts.push(
      `${t('wheels')}: ${isZh ? selectedWheel.nameZh : selectedWheel.name}, ${wheelSpec.size}" ` +
      `${isZh ? wheelColor.nameZh : wheelColor.name}, ${wheelSpec.spokeCount}${t('spokeUnit')}, ` +
      `${isZh ? concavity.nameZh : concavity.name} ${t('concavity')}`
    );

    const activeMods = selectedMods
      .map((id) => MODIFICATION_OPTIONS.find((m) => m.id === id))
      .map(m => isZh ? m?.nameZh : m?.name)
      .filter(Boolean);
    if (activeMods.length > 0) {
      parts.push(`${t('modifications_')}: ${activeMods.join('、')}`);
    }

    const activeAccents = Object.entries(accentOptions)
      .filter(([_, enabled]) => enabled)
      .map(([id]) => ACCENT_OPTIONS.find((a) => a.id === id))
      .map(a => isZh ? a?.nameZh : a?.name)
      .filter(Boolean);
    if (activeAccents.length > 0) {
      parts.push(`${t('details')}: ${activeAccents.join('、')}`);
    }

    if (activePresetId) {
      const preset = PRESET_PACKS.find((item) => item.id === activePresetId);
      if (preset) {
        parts.push(`${t('stylePreset')}: ${isZh ? preset.nameZh : preset.name}`);
      }
    }

    parts.push(t('promptSuffix'));

    return parts.join(', ');
  }, [selectedCar, selectedColor, selectedFinish, selectedWheel, selectedMods, accentOptions, wheelSpec, activePresetId, isZh, t]);

  const prompt = useMemo(() => buildPrompt(), [buildPrompt]);

  const activeImage =
    showcaseStates[activeShot].image ??
    showcaseStates.panorama.image ??
    showcaseStates.closeup.image;

  const getReferenceImage = useCallback(() => {
    const urlRef = selectedCar.customInput?.imageUrl;
    const dataUrlRef = selectedCar.customInput?.imageDataUrl;
    const isValidQwenRef = (value?: string) =>
      !!value &&
      (value.startsWith('http://') ||
        value.startsWith('https://') ||
        value.startsWith('data:image/'));

    if (isValidQwenRef(urlRef)) return urlRef;
    if (isValidQwenRef(dataUrlRef)) return dataUrlRef;
    return undefined;
  }, [selectedCar.customInput?.imageDataUrl, selectedCar.customInput?.imageUrl]);

  const buildCompactPrompt = useCallback(() => {
    const wheelColor =
      WHEEL_COLORS.find((item) => item.id === wheelSpec.colorId) ??
      WHEEL_COLORS[0];
    return [
      `${isZh ? selectedCar.nameZh : selectedCar.name}`,
      `${t('paint')}: ${isZh ? selectedColor.nameZh : selectedColor.name}`,
      `${t('wheels')}: ${isZh ? selectedWheel.nameZh : selectedWheel.name} ${wheelSpec.size}" ${isZh ? wheelColor.nameZh : wheelColor.name}`,
      selectedMods.length > 0
        ? `${t('modifications_')}: ${selectedMods
            .map((id) => MODIFICATION_OPTIONS.find((m) => m.id === id))
            .map((m) => (isZh ? m?.nameZh : m?.name))
            .filter(Boolean)
            .join(', ')}`
        : null,
      activePresetId ? `${t('preset')}: ${activePresetId}` : null,
    ]
      .filter(Boolean)
      .join(', ');
  }, [
    activePresetId,
    isZh,
    selectedCar.name,
    selectedCar.nameZh,
    selectedColor.name,
    selectedColor.nameZh,
    selectedMods,
    selectedWheel.name,
    selectedWheel.nameZh,
    t,
    wheelSpec.colorId,
    wheelSpec.size,
  ]);

  const buildShowcasePrompts = useCallback(
    (scene: 'text-to-image' | 'image-to-image') => {
      const compactPrompt = buildCompactPrompt();
      const baseIdentityPrompt =
        scene === 'image-to-image'
          ? `${compactPrompt}. Keep same car identity from reference image; apply selected modifications only.`
          : prompt;

      const panoramaPrompt = `${baseIdentityPrompt}, cinematic automotive commercial shot, 3/4 front view, camera pulled back wide framing, centered composition, full car from front bumper to rear bumper fully visible, all four wheels fully visible, clear ground shadow under the whole vehicle, leave clean space around the vehicle edges, nothing cropped or cut off, dramatic studio lighting, rich reflections, high contrast, premium ad style, ultra-detailed, 4k`;
      const closeupPrompt = `${compactPrompt}. cinematic close-up automotive commercial shot, focus on front wheel and fender area, wheel texture and brake caliper details, shallow depth of field, dramatic highlights, premium ad style, ultra-detailed, 4k`;

      return { panoramaPrompt, closeupPrompt };
    },
    [buildCompactPrompt, prompt]
  );

  const resetTaskState = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setGenerationStartTime(null);
    setShowcaseStates((prev) => ({
      panorama: { ...prev.panorama, taskId: null, status: 'idle', error: null },
      closeup: { ...prev.closeup, taskId: null, status: 'idle', error: null },
    }));
  }, []);

  const pollShotTask = useCallback(
    async (shotType: ShowcaseShotType, id: string) => {
      try {
        const resp = await fetch('/api/ai/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId: id }),
        });

        if (!resp.ok) throw new Error(`${t('requestFailed')}: ${resp.status}`);

        const { code, message, data } = await resp.json();
        if (code !== 0) throw new Error(message || t('queryTaskFailed'));

        const task = data as BackendTask;
        const currentStatus = task.status as AITaskStatus;
        const parsedResult = parseTaskResult(task.taskInfo);
        const imageUrls = extractImageUrls(parsedResult);

        setShowcaseStates((prev) => {
          const current = prev[shotType];
          const next: ShowcaseShotState = {
            ...current,
            status: currentStatus,
            error: null,
          };

          if (
            (currentStatus === AITaskStatus.PROCESSING ||
              currentStatus === AITaskStatus.SUCCESS) &&
            imageUrls.length > 0
          ) {
            next.image = {
              id: `${task.id}-${shotType}`,
              url: imageUrls[0],
              prompt: task.prompt ?? undefined,
            };
          }

          if (currentStatus === AITaskStatus.SUCCESS) {
            next.taskId = null;
            next.error = imageUrls.length === 0 ? t('generationFailed') : null;
            if (imageUrls.length === 0) {
              next.status = AITaskStatus.FAILED;
            }
          }

          if (currentStatus === AITaskStatus.FAILED) {
            next.taskId = null;
            next.error = parsedResult?.errorMessage || t('generationFailed');
          }

          return {
            ...prev,
            [shotType]: next,
          };
        });
      } catch (error: any) {
        console.error('poll shot task failed:', error);
        setShowcaseStates((prev) => ({
          ...prev,
          [shotType]: {
            ...prev[shotType],
            status: AITaskStatus.FAILED,
            taskId: null,
            error: `${t('queryFailed')}: ${error.message}`,
          },
        }));
      }
    },
    [t]
  );

  useEffect(() => {
    if (!isGenerating) return;

    const progressMap: Record<ShotStatus, number> = {
      idle: 10,
      [AITaskStatus.PENDING]: 25,
      [AITaskStatus.PROCESSING]: 70,
      [AITaskStatus.SUCCESS]: 100,
      [AITaskStatus.FAILED]: 100,
      [AITaskStatus.CANCELED]: 100,
    };

    const progressValue = Math.round(
      (progressMap[showcaseStates.panorama.status] +
        progressMap[showcaseStates.closeup.status]) /
        2
    );
    setProgress(progressValue);

    const hasTimedOut =
      generationStartTime &&
      Date.now() - generationStartTime > GENERATION_TIMEOUT;
    if (hasTimedOut) {
      setShowcaseStates((prev) => ({
        panorama:
          prev.panorama.status === AITaskStatus.SUCCESS
            ? prev.panorama
            : {
                ...prev.panorama,
                status: AITaskStatus.FAILED,
                taskId: null,
                error: t('generationTimeout'),
              },
        closeup:
          prev.closeup.status === AITaskStatus.SUCCESS
            ? prev.closeup
            : {
                ...prev.closeup,
                status: AITaskStatus.FAILED,
                taskId: null,
                error: t('generationTimeout'),
              },
      }));
      setIsGenerating(false);
      setGenerationStartTime(null);
      toast.error(t('generationTimeout'));
      void fetchUserCredits();
      return;
    }

    const doneStatuses = new Set<ShotStatus>([
      AITaskStatus.SUCCESS,
      AITaskStatus.FAILED,
      AITaskStatus.CANCELED,
    ]);
    const allDone =
      doneStatuses.has(showcaseStates.panorama.status) &&
      doneStatuses.has(showcaseStates.closeup.status);

    if (allDone) {
      const panoramaOk = !!showcaseStates.panorama.image;
      const closeupOk = !!showcaseStates.closeup.image;
      if (panoramaOk && closeupOk) {
        toast.success(t('generationComplete'));
      } else if (panoramaOk || closeupOk) {
        toast.success(t('partialSuccessHint'));
      } else {
        toast.error(t('generationFailed'));
      }
      setIsGenerating(false);
      setGenerationStartTime(null);
      setShowcaseStates((prev) => ({
        panorama: { ...prev.panorama, taskId: null },
        closeup: { ...prev.closeup, taskId: null },
      }));
      void fetchUserCredits();
      return;
    }

    const interval = setInterval(() => {
      for (const shotType of SHOT_TYPES) {
        const shot = showcaseStates[shotType];
        if (!shot.taskId) continue;
        if (
          shot.status === AITaskStatus.PENDING ||
          shot.status === AITaskStatus.PROCESSING
        ) {
          void pollShotTask(shotType, shot.taskId);
        }
      }
    }, POLL_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, [
    fetchUserCredits,
    generationStartTime,
    isGenerating,
    pollShotTask,
    showcaseStates,
    t,
  ]);

  const applyShowcaseTask = useCallback(
    (task: ShowcaseTaskResp) => {
      const parsedResult = parseTaskResult(task.taskInfo ?? null);
      const imageUrls = extractImageUrls(parsedResult);

      setShowcaseStates((prev) => {
        const base = prev[task.shotType];
        const next: ShowcaseShotState = {
          ...base,
          status:
            task.status === 'failed'
              ? AITaskStatus.FAILED
              : (task.status as ShotStatus),
          taskId: task.id ?? null,
          error: task.message || null,
        };

        if (imageUrls.length > 0) {
          next.image = {
            id: `${task.id || getUuid()}-${task.shotType}`,
            url: imageUrls[0],
            prompt: task.prompt,
          };
        }

        if (task.status === AITaskStatus.SUCCESS || task.status === 'failed') {
          next.taskId = null;
        }

        return {
          ...prev,
          [task.shotType]: next,
        };
      });
    },
    []
  );

  const requestShowcaseGeneration = useCallback(
    async ({
      retryShotType,
      bundleId,
    }: {
      retryShotType?: ShowcaseShotType;
      bundleId?: string;
    } = {}) => {
      const referenceImage = getReferenceImage();
      const canUseReferenceImage = !!referenceImage;
      const scene = canUseReferenceImage ? 'image-to-image' : 'text-to-image';
      const model =
        scene === 'image-to-image' ? 'qwen-image-edit-max' : 'qwen-image-max';

      if (!canUseReferenceImage && selectedCar.customInput?.imageUrl) {
        toast.error(
          isZh
            ? '参考图格式无效，已切换为文生图。请使用公网图片链接或重新上传。'
            : 'Invalid reference image format. Switched to text-to-image.'
        );
      }

      const { panoramaPrompt, closeupPrompt } = buildShowcasePrompts(scene);

      const resp = await fetch('/api/ai/generate-showcase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'qwen',
          model,
          scene,
          prompts: {
            panorama: panoramaPrompt,
            closeup: closeupPrompt,
          },
          referenceImage,
          retryShotType,
          bundleId,
        }),
      });

      if (!resp.ok) throw new Error(`${t('requestFailed')}: ${resp.status}`);

      const { code, message, data } = await resp.json();
      if (code !== 0) throw new Error(message || t('queryTaskFailed'));
      return data as { bundleId: string; tasks: ShowcaseTaskResp[] };
    },
    [
      buildShowcasePrompts,
      getReferenceImage,
      isZh,
      selectedCar.customInput?.imageUrl,
      t,
    ]
  );

  const handleGenerate = async () => {
    if (!user && !testMode) {
      setIsShowSignModal(true);
      return;
    }

    if (remainingCredits < costCredits && !testMode) {
      toast.error(t('insufficientCredits'));
      return;
    }

    setShowcaseStates({
      panorama: { image: null, status: AITaskStatus.PENDING, taskId: null, error: null },
      closeup: { image: null, status: AITaskStatus.PENDING, taskId: null, error: null },
    });
    setActiveShot('panorama');
    setIsGenerating(true);
    setProgress(15);
    setGenerationStartTime(Date.now());

    try {
      const data = await requestShowcaseGeneration();
      data.tasks.forEach((task) => applyShowcaseTask(task));
      const panoramaSuccess = data.tasks.some(
        (item) => item.shotType === 'panorama' && item.status === AITaskStatus.SUCCESS
      );
      if (!panoramaSuccess) {
        setActiveShot('closeup');
      }
      await fetchUserCredits();
    } catch (error: any) {
      console.error('生成图片失败:', error);
      toast.error(`${t('generationFailed')}: ${error.message}`);
      resetTaskState();
    }
  };

  const handleRetryShot = async (shotType: ShowcaseShotType) => {
    if (!user && !testMode) {
      setIsShowSignModal(true);
      return;
    }

    setShowcaseStates((prev) => ({
      ...prev,
      [shotType]: {
        ...prev[shotType],
        status: AITaskStatus.PENDING,
        taskId: null,
        error: null,
      },
    }));
    setActiveShot(shotType);
    setIsGenerating(true);
    setGenerationStartTime(Date.now());

    try {
      const bundleId = (() => {
        for (const shot of SHOT_TYPES) {
          const taskId = showcaseStates[shot].taskId;
          if (taskId) return taskId;
        }
        return undefined;
      })();
      const data = await requestShowcaseGeneration({ retryShotType: shotType, bundleId });
      data.tasks.forEach((task) => applyShowcaseTask(task));
      await fetchUserCredits();
    } catch (error: any) {
      toast.error(`${t('generationFailed')}: ${error.message}`);
      setShowcaseStates((prev) => ({
        ...prev,
        [shotType]: {
          ...prev[shotType],
          status: AITaskStatus.FAILED,
          taskId: null,
          error: error.message || t('generationFailed'),
        },
      }));
    }
  };

  const handleDownloadImage = async (image: GeneratedImage) => {
    if (!image.url) return;
    try {
      setDownloadingImageId(image.id);
      const resp = await fetch(`/api/proxy/file?url=${encodeURIComponent(image.url)}`);
      if (!resp.ok) throw new Error('获取图片失败');
      const blob = await resp.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `car-mod-${image.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 200);
      toast.success(isZh ? '图片下载成功' : 'Image downloaded');
    } catch (error) {
      console.error('下载图片失败:', error);
      toast.error(isZh ? '图片下载失败' : 'Download failed');
    } finally {
      setDownloadingImageId(null);
    }
  };

  const handleShare = () => {
    const carName = isZh ? selectedCar.nameZh : selectedCar.name;
    const wheelColor = WHEEL_COLORS.find((item) => item.id === wheelSpec.colorId) ?? WHEEL_COLORS[0];
    const activeModsText = selectedMods
      .map((id) => MODIFICATION_OPTIONS.find((item) => item.id === id))
      .filter((item): item is (typeof MODIFICATION_OPTIONS)[number] => !!item)
      .slice(0, 3)
      .map((item) => (isZh ? item.nameZh : item.name))
      .join(', ');
    const shareDescription = [
      `${t('shareCar')}: ${carName}`,
      `${t('shareWheel')}: ${isZh ? selectedWheel.nameZh : selectedWheel.name} ${wheelSpec.size}"`,
      `${t('shareWheelColor')}: ${isZh ? wheelColor.nameZh : wheelColor.name}`,
      activeModsText ? `${t('shareMods')}: ${activeModsText}` : null,
      `${t('shareBudget')}: ${formatPrice(totalBuildCost)}`,
    ]
      .filter(Boolean)
      .join('\n');

    if (navigator.share) {
      navigator.share({
        title: t('shareTitle', { car: carName }),
        text: `${t('shareText', { car: carName })}\n\n${shareDescription}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.href}\n\n${shareDescription}`);
      toast.success(t('linkCopied'));
    }
  };

  const getShotStatusLabel = useCallback((status: ShotStatus) => {
    switch (status) {
      case 'idle':
        return t('idle');
      case AITaskStatus.PENDING:
        return t('waitingModel');
      case AITaskStatus.PROCESSING:
        return t('generatingImage');
      case AITaskStatus.SUCCESS:
        return t('generationComplete');
      case AITaskStatus.FAILED:
        return t('generationFailed');
      default:
        return '';
    }
  }, [t]);

  const totalBuildCost = useMemo(() => {
    let basePrice = selectedCar.price;
    basePrice += selectedWheel.price;
    basePrice += WHEEL_SIZE_EXTRA_COST[wheelSpec.size] ?? 0;
    basePrice += WHEEL_COLORS.find((item) => item.id === wheelSpec.colorId)?.extraCost ?? 0;
    basePrice += WHEEL_CONCAVITY_OPTIONS.find((item) => item.id === wheelSpec.concavity)?.extraCost ?? 0;
    basePrice += selectedColor.price;
    basePrice += selectedFinish.price;
    basePrice += selectedMods.reduce((sum, modId) => {
      const mod = MODIFICATION_OPTIONS.find(m => m.id === modId);
      return sum + (mod?.price || 0);
    }, 0);
    basePrice += Object.entries(accentOptions)
      .filter(([_, enabled]) => enabled)
      .reduce((sum, [accentId]) => {
        const accent = ACCENT_OPTIONS.find(a => a.id === accentId);
        return sum + (accent?.price || 0);
      }, 0);
    return basePrice;
  }, [selectedCar, selectedWheel, selectedColor, selectedFinish, selectedMods, accentOptions, wheelSpec]);

  const formatPrice = (price: number) => {
    const inK = price / 1000;
    const rounded = Number.isInteger(inK) ? String(inK) : inK.toFixed(1).replace(/\.0$/, '');
    const currencySymbol = isZh ? '¥' : '$';
    return `${currencySymbol}${rounded}k`;
  };

  const selectedWheelColor = WHEEL_COLORS.find((item) => item.id === wheelSpec.colorId) ?? WHEEL_COLORS[0];
  const selectedConcavity = WHEEL_CONCAVITY_OPTIONS.find((item) => item.id === wheelSpec.concavity) ?? WHEEL_CONCAVITY_OPTIONS[1];
  const wheelSpecExtraCost =
    (WHEEL_SIZE_EXTRA_COST[wheelSpec.size] ?? 0) +
    selectedWheelColor.extraCost +
    selectedConcavity.extraCost;
  const canUndo = historyState.index > 0;
  const canRedo = historyState.index >= 0 && historyState.index < historyState.entries.length - 1;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#131022] text-white font-[family-name:var(--font-sans)]">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(71,37,244,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(71,37,244,0.05)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,black_45%,transparent_100%)]" />
        <div className="absolute -top-20 -left-16 h-[420px] w-[420px] rounded-full bg-[#4725f4]/18 blur-[110px]" />
        <div className="absolute -bottom-24 -right-16 h-[520px] w-[520px] rounded-full bg-[#7c5cff]/16 blur-[130px]" />
      </div>
      <AnimatePresence>
        {showCustomInput && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#131022]/80 p-4 backdrop-blur-sm sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <CustomCarInput
                onSubmit={handleCustomCarSubmit}
                onCancel={() => setShowCustomInput(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-16 pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
            {/* Left Sidebar - Car Info */}
            <motion.div 
              className="lg:col-span-3 space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="space-y-6">
                <motion.div 
                  className="bg-[#1c1833]/90 rounded-2xl p-6 border border-white/10 shadow-lg"
                  whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="mb-3 max-w-full break-words text-2xl font-semibold leading-tight tracking-tight text-white">
                    {isZh ? selectedCar.nameZh : selectedCar.name}
                  </h2>
                  <div className="mb-6 flex items-center gap-3">
                    <motion.span 
                      className="px-4 py-1 bg-gradient-to-r from-[#4725f4] to-[#7c5cff] rounded-full text-xs font-medium shadow-[0_0_10px_rgba(99,102,241,0.4)] text-white"
                      whileHover={{ scale: 1.05 }}
                    >
                      {t('awd')}
                    </motion.span>
                    <span className="min-w-0 break-words text-sm text-gray-400">
                      {selectedCar.brand} {selectedCar.type === 'sedan' ? t('sedan') : t('suv')}
                    </span>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-gray-400 text-sm mb-2 uppercase tracking-wider">{t('totalBuildCost')}</h3>
                    <motion.p 
                      className="text-3xl font-bold text-[#4725f4]"
                      key={totalBuildCost}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      {formatPrice(totalBuildCost)}
                    </motion.p>
                  </div>
                  <Separator className="bg-border my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">{t('basePrice')}</span>
                    <span className="text-sm font-medium">{formatPrice(selectedCar.price)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-400 text-sm">{t('modCost')}</span>
                    <span className="text-sm font-medium text-[#4725f4]">+{formatPrice(totalBuildCost - selectedCar.price)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={!canUndo}
                      onClick={handleUndo}
                      className="bg-[#1c1833]/90 border border-white/10"
                    >
                      <Undo2 className="w-4 h-4 mr-2" />
                      {t('undo')}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={!canRedo}
                      onClick={handleRedo}
                      className="bg-[#1c1833]/90 border border-white/10"
                    >
                      <Redo2 className="w-4 h-4 mr-2" />
                      {t('redo')}
                    </Button>
                  </div>
                </motion.div>

                <Card className="bg-[#1c1833]/90 border-white/10 shadow-lg overflow-hidden">
                  <CardHeader className="pb-3 bg-[#1c1833]/90 border-b border-white/10">
                    <CardTitle className="text-sm font-medium text-gray-400 uppercase tracking-wider">{t('configDetails')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-6">
                    <motion.div 
                      className="flex justify-between items-center py-3 border-b border-white/10"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-gray-400 text-sm">{t('baseModel')}</span>
                      <span className="font-medium">{formatPrice(selectedCar.price)}</span>
                    </motion.div>
                    <motion.div 
                      className="flex justify-between items-center py-3 border-b border-white/10"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-gray-400 text-sm">{t('wheels')}</span>
                      <span className="font-medium">{formatPrice(selectedWheel.price)}</span>
                    </motion.div>
                    <motion.div
                      className="flex justify-between items-center py-3 border-b border-white/10"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-gray-400 text-sm">
                        {`${t('spec')} ${wheelSpec.size}" / ${wheelSpec.spokeCount}${t('spokeUnit')}`}
                      </span>
                      <span className="text-sm text-[#4725f4]">
                        +{formatPrice(wheelSpecExtraCost)}
                      </span>
                    </motion.div>
                    <motion.div 
                      className="flex justify-between items-center py-3 border-b border-white/10"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-gray-400 text-sm">{t('paint')}</span>
                      <span className="font-medium">{formatPrice(selectedColor.price + selectedFinish.price)}</span>
                    </motion.div>
                    {selectedMods.length > 0 && (
                      <div className="py-3 border-b border-white/10">
                        <span className="text-gray-400 text-sm block mb-3 uppercase tracking-wider">{t('modKit')}</span>
                        {selectedMods.map((id) => {
                          const mod = MODIFICATION_OPTIONS.find((m) => m.id === id);
                          return mod ? (
                            <motion.div 
                              key={id} 
                              className="flex justify-between items-center py-2"
                              whileHover={{ x: 5 }}
                            >
                              <span className="text-sm">{isZh ? mod.nameZh : mod.name}</span>
                              <span className="text-sm text-[#4725f4]">+{formatPrice(mod.price)}</span>
                            </motion.div>
                          ) : null;
                        })}
                      </div>
                    )}
                    {Object.entries(accentOptions).some(([_, enabled]) => enabled) && (
                      <div className="py-3">
                        <span className="text-gray-400 text-sm block mb-3 uppercase tracking-wider">{t('accentsDetail')}</span>
                        {Object.entries(accentOptions)
                          .filter(([_, enabled]) => enabled)
                          .map(([id]) => {
                            const accent = ACCENT_OPTIONS.find((a) => a.id === id);
                            return accent ? (
                              <motion.div 
                                key={id} 
                                className="flex justify-between items-center py-2"
                                whileHover={{ x: 5 }}
                              >
                                <span className="text-sm">{isZh ? accent.nameZh : accent.name}</span>
                                <span className="text-sm text-[#4725f4]">+{formatPrice(accent.price)}</span>
                              </motion.div>
                            ) : null;
                          })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </motion.div>

            {/* Center - Car Preview */}
            <motion.div 
              className="lg:col-span-5 space-y-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="bg-[#1c1833]/90 border-white/10 overflow-hidden shadow-xl">
                <CardContent className="p-0">
                  <div className="relative">
                    {activeImage ? (
                      <motion.div
                        className="aspect-[16/9] bg-[#131022] relative rounded-xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <img
                          src={selectedCar.localImage}
                          alt={`${isZh ? selectedCar.nameZh : selectedCar.name} before`}
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1280&h=720&fit=crop';
                          }}
                        />
                        {activeShot === 'panorama' && compareMode ? (
                          <>
                            <div
                              className="absolute inset-0 overflow-hidden"
                              style={{
                                clipPath: `inset(0 0 0 ${comparePosition}%)`,
                              }}
                            >
                              <img
                                key={activeImage.url}
                                src={activeImage.url}
                                alt={`${isZh ? selectedCar.nameZh : selectedCar.name} ${t('modEffect')}`}
                                className="absolute inset-0 h-full w-full object-cover"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    selectedCar.localImage;
                                }}
                              />
                            </div>
                            <div
                              className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(255,255,255,0.8)]"
                              style={{ left: `${comparePosition}%` }}
                            />
                          </>
                        ) : (
                          <img
                            key={activeImage.url}
                            src={activeImage.url}
                            alt={`${isZh ? selectedCar.nameZh : selectedCar.name} ${t('modEffect')}`}
                            className="absolute inset-0 h-full w-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                selectedCar.localImage;
                            }}
                          />
                        )}
                        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100 transition-opacity duration-300 sm:opacity-0 sm:hover:opacity-100">
                          <div className="p-6 w-full">
                            <h3 className="mb-2 line-clamp-2 max-w-full break-words text-xl font-semibold leading-tight tracking-tight">
                              {isZh ? selectedCar.nameZh : selectedCar.name}{' '}
                              {activeShot === 'panorama'
                                ? t('shotPanorama')
                                : t('shotCloseup')}
                            </h3>
                            <p className="mb-4 line-clamp-3 max-w-full break-words text-sm leading-relaxed text-gray-400">
                              {activeImage.prompt || prompt}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleDownloadImage(activeImage)}
                                disabled={downloadingImageId === activeImage.id}
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                              >
                                {downloadingImageId === activeImage.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                  <>
                                    <Download className="w-4 h-4 mr-2" />
                                    {t('download')}
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={handleShare}
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                              >
                                <Share2 className="w-4 h-4 mr-2" />
                                {t('share')}
                              </Button>
                              {activeShot === 'panorama' && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => setCompareMode((prev) => !prev)}
                                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                                >
                                  {compareMode ? (
                                    <>
                                      <EyeOff className="w-4 h-4 mr-2" />
                                      {t('hideCompare')}
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4 mr-2" />
                                      {t('compare')}
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        {activeShot === 'panorama' && compareMode && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[75%] bg-black/45 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2">
                            <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                              <span>{t('before')}</span>
                              <span>{t('after')}</span>
                            </div>
                            <input
                              type="range"
                              min={0}
                              max={100}
                              value={100 - comparePosition}
                              onChange={(event) => {
                                const afterValue = Number(event.target.value);
                                setComparePosition(100 - afterValue);
                              }}
                              className="w-full accent-[#4725f4]"
                            />
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        className="aspect-[16/9] bg-[#131022] relative flex items-center justify-center overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                      >
                        <img
                          src={selectedCar.localImage}
                          alt={isZh ? selectedCar.nameZh : selectedCar.name}
                          className="w-full h-full object-cover opacity-70 transition-opacity duration-300 hover:opacity-90"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=450&fit=crop';
                          }}
                        />
                        <div className="absolute bottom-4 left-4 max-w-[85%] rounded-lg bg-black/45 px-4 py-2 backdrop-blur-sm">
                          <span className="line-clamp-2 break-words text-sm font-medium leading-snug">
                            {isZh ? selectedCar.nameZh : selectedCar.name}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  {(showcaseStates.panorama.image ||
                    showcaseStates.closeup.image ||
                    showcaseStates.panorama.error ||
                    showcaseStates.closeup.error) && (
                    <div className="grid grid-cols-2 gap-2 p-4">
                      {SHOT_TYPES.map((shotType) => {
                        const shot = showcaseStates[shotType];
                        const selected = activeShot === shotType;
                        return (
                          <div
                            key={shotType}
                            className={`rounded-lg border p-2 ${
                              selected
                                ? 'border-[#4725f4] bg-[#4725f4]/20'
                                : 'border-white/10 bg-black/20'
                            }`}
                          >
                            <button
                              type="button"
                              className="w-full text-left"
                              onClick={() => {
                                if (shot.image) setActiveShot(shotType);
                              }}
                            >
                              <div className="text-xs font-medium text-white">
                                {shotType === 'panorama'
                                  ? t('shotPanorama')
                                  : t('shotCloseup')}
                              </div>
                              <div className="mt-1 text-[11px] text-gray-400">
                                {getShotStatusLabel(shot.status)}
                              </div>
                            </button>
                            {shot.error && (
                              <div className="mt-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="h-7 w-full bg-white/10 text-xs"
                                  onClick={() => handleRetryShot(shotType)}
                                  disabled={isGenerating}
                                >
                                  <RefreshCw className="mr-1.5 h-3 w-3" />
                                  {t('shotRetry')}
                                </Button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-[#1c1833]/90 border-white/10 shadow-lg overflow-hidden">
                <CardHeader className="bg-[#1c1833]/90 border-b border-white/10 p-5">
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    {t('presetPacksTitle')}
                  </CardTitle>
                  <p className="mt-1 text-sm leading-relaxed text-gray-400">{t('presetPacksDesc')}</p>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      {t('recommendedForThisCar')}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {recommendedPresets.map((preset) => (
                        <Button
                          key={preset.id}
                          variant={activePresetId === preset.id ? 'default' : 'secondary'}
                          className={`justify-start h-auto py-3 px-3 ${
                            activePresetId === preset.id
                              ? 'bg-gradient-to-r from-[#4725f4] to-[#7c5cff] text-white'
                              : 'bg-[#1c1833]/90 border border-white/10'
                          }`}
                          onClick={() => applyPreset(preset)}
                        >
                          <div className="min-w-0 text-left">
                            <div className="line-clamp-1 break-words text-sm font-semibold">{isZh ? preset.nameZh : preset.name}</div>
                            <div className="line-clamp-2 break-words text-xs leading-relaxed opacity-80">
                              {isZh ? preset.descriptionZh : preset.description}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-wider text-gray-400">
                      {t('allPacks')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_PACKS.map((preset) => (
                        <Button
                          key={preset.id}
                          size="sm"
                          variant={activePresetId === preset.id ? 'default' : 'outline'}
                          className={activePresetId === preset.id ? 'bg-[#4725f4] text-white' : ''}
                          onClick={() => applyPreset(preset)}
                        >
                          <WandSparkles className="w-3.5 h-3.5 mr-1.5" />
                          {isZh ? preset.nameZh : preset.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Car Selection */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">{t('selectCarModel')}</h3>
                  <Badge variant="outline" className="text-gray-400 border-white/10">
                    {CHINESE_CAR_MODELS.length} {t('carModelsCount')}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  {/* 自定义车型按钮 */}
                  <motion.div
                    className="relative rounded-xl overflow-hidden cursor-pointer border-2 border-dashed border-white/10/60 hover:border-[#4725f4] transition-all"
                    onClick={() => setShowCustomInput(true)}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="aspect-[4/3] bg-[#1c1833]/90 flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <span className="text-2xl font-light text-gray-400">+</span>
                      </div>
                      <p className="text-xs font-medium text-gray-400">{t('customCar')}</p>
                    </div>
                    <div className="border-t border-white/10 bg-[#1c1833]/90 p-3">
                      <p className="text-xs text-gray-500 mb-1">{t('custom')}</p>
                      <p className="line-clamp-2 break-words text-sm font-medium leading-snug">{t('inputYourCar')}</p>
                      <p className="mt-1 line-clamp-1 text-xs text-[#4725f4]">{t('freeTrial')}</p>
                    </div>
                  </motion.div>

                  {(showAllCars ? CHINESE_CAR_MODELS : CHINESE_CAR_MODELS.slice(0, 3)).map((car) => (
                    <motion.div
                      key={car.id}
                      className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedCar.id === car.id ? 'border-[#4725f4] shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'border-transparent hover:border-white/10/60'}`}
                      onClick={() => {
                        setActivePresetId(null);
                        setSelectedCar(car);
                      }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="aspect-[4/3] bg-[#1c1833]/90 relative overflow-hidden">
                        <motion.img
                          src={car.image}
                          alt={isZh ? car.nameZh : car.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&h=150&fit=crop';
                          }}
                          whileHover={{ scale: 1.1 }}
                        />
                        {selectedCar.id === car.id && (
                          <motion.div 
                            className="absolute inset-0 bg-[#4725f4]/20 backdrop-blur-sm flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CircleCheckBig className="h-7 w-7 text-[#4725f4]" />
                          </motion.div>
                        )}
                      </div>
                      <div className="border-t border-white/10 bg-[#1c1833]/90 p-3">
                        <p className="text-xs text-gray-500 mb-1">{car.brand}</p>
                        <p className="line-clamp-2 break-words text-sm font-medium leading-snug">{isZh ? car.nameZh : car.name}</p>
                        <p className="mt-1 text-xs text-[#4725f4]">{formatPrice(car.price)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllCars(!showAllCars)}
                    className="min-h-11 max-w-full break-words text-center text-gray-400 hover:bg-white/10 hover:text-white"
                  >
                    {showAllCars ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        {t('collapse')}
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        {t('viewAll')} {CHINESE_CAR_MODELS.length} {t('carModelsCount')}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Generation Progress */}
              {isGenerating && (
                <Card className="bg-[#1c1833]/90 border-white/10 shadow-lg">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CardContent className="space-y-4 p-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{t('generationProgress')}</span>
                        <span className="text-[#4725f4] font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-3 bg-border rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#4725f4] to-[#7c5cff] rounded-full"
                          style={{ width: `${progress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </Progress>
                      <motion.div
                        className="space-y-1 text-xs text-gray-400"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {SHOT_TYPES.map((shotType) => (
                          <p key={shotType} className="flex items-center justify-between">
                            <span>
                              {shotType === 'panorama'
                                ? t('shotPanorama')
                                : t('shotCloseup')}
                            </span>
                            <span>{getShotStatusLabel(showcaseStates[shotType].status)}</span>
                          </p>
                        ))}
                      </motion.div>
                      <div className="flex justify-center mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            resetTaskState();
                            setShowcaseStates(getInitialShowcaseStates());
                          }}
                          className="text-gray-400 hover:text-white"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          {t('cancelGenerate')}
                        </Button>
                      </div>
                    </CardContent>
                  </motion.div>
                </Card>
              )}
            </motion.div>

            {/* Right Sidebar - Modification Options */}
            <motion.div 
              className="lg:col-span-4 space-y-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="space-y-6">
                {/* Tab Navigation */}
                <motion.div 
                  className="flex gap-2 overflow-x-auto rounded-xl border border-white/10 bg-[#1c1833]/90 p-1"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {['paint', 'wheels', 'mods', 'accents'].map((tab) => (
                    <motion.button
                      key={tab}
                      className={`min-h-11 min-w-[88px] flex-1 rounded-lg px-3 py-2 text-center text-xs font-semibold tracking-wide transition-all sm:px-4 sm:py-3 sm:text-sm ${activeTab === tab ? 'border border-white/10 bg-[#1c1833]/90 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                      onClick={() => setActiveTab(tab)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {tab === 'paint' && t('paint')}
                      {tab === 'wheels' && t('wheels')}
                      {tab === 'mods' && t('modifications_')}
                      {tab === 'accents' && t('accentsDetail')}
                    </motion.button>
                  ))}
                </motion.div>

                {/* Paint Options */}
                {activeTab === 'paint' && (
                  <Card className="bg-[#1c1833]/90 border-white/10 shadow-lg overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardHeader className="border-b border-white/10 bg-[#1c1833]/90 p-6">
                      <CardTitle className="text-lg font-semibold tracking-tight text-white">{t('paintLabTitle')}</CardTitle>
                      <p className="mt-1 text-sm leading-relaxed text-gray-400">{t('paintLabDesc')}</p>
                    </CardHeader>
                    <CardContent className="space-y-8 p-6">
                      {/* Finish Type */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">{t('finishType')}</h3>
                        <div className="flex flex-wrap gap-3">
                          {FINISH_TYPES.map((finish) => (
                            <motion.button
                              key={finish.id}
                              className={`min-h-11 rounded-xl border px-4 py-2 text-sm transition-all ${selectedFinish.id === finish.id ? 'border-transparent bg-gradient-to-r from-[#4725f4] to-[#7c5cff] text-white shadow-[0_0_15px_rgba(99,102,241,0.35)]' : 'border-white/10 bg-[#1c1833]/90 text-white hover:border-[#4725f4]/40'}`}
                              onClick={() => {
                                setActivePresetId(null);
                                setSelectedFinish(finish);
                              }}
                              whileHover={{ scale: 1.03, y: -2 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              {isZh ? finish.nameZh : finish.name}
                              {finish.price > 0 && (
                                <span className="ml-2 text-xs font-medium">+{formatPrice(finish.price)}</span>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Manufacturer Colors */}
                      <div>
                        <h3 className="text-sm font-medium text-gray-400 mb-4 uppercase tracking-wider">{t('manufacturerColors')}</h3>
                        <div className="grid grid-cols-4 gap-4 sm:grid-cols-5">
                          {PAINT_COLORS.map((color) => (
                            <motion.div
                              key={color.id}
                              className={`relative cursor-pointer group ${selectedColor.id === color.id ? 'ring-2 ring-[#4725f4] ring-offset-2 ring-offset-card' : ''}`}
                              onClick={() => {
                                setActivePresetId(null);
                                setSelectedColor(color);
                              }}
                              whileHover={{ scale: 1.15, y: -5 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div
                                className="w-12 h-12 rounded-full shadow-lg border-2 border-white/10 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                style={{ backgroundColor: color.color }}
                              />
                              <div className="absolute -bottom-12 left-1/2 max-w-[94px] -translate-x-1/2 rounded-lg border border-white/10 bg-[#1c1833]/90 px-2 py-1 text-center text-[10px] leading-tight opacity-0 transition-opacity group-hover:opacity-100">
                                {isZh ? color.nameZh : color.name}
                                {color.price > 0 && (
                                  <span className="ml-1 text-[#4725f4]">+{formatPrice(color.price)}</span>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </motion.div>
                </Card>
                )}

                {/* Wheel Options */}
                {activeTab === 'wheels' && (
                  <Card className="bg-[#1c1833]/90 border-white/10 shadow-lg overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardHeader className="border-b border-white/10 bg-[#1c1833]/90 p-6">
                      <CardTitle className="text-lg font-semibold tracking-tight text-white">{t('wheelSelectorTitle')}</CardTitle>
                      <p className="mt-1 text-sm leading-relaxed text-gray-400">{t('wheelSelectorDesc')}</p>
                    </CardHeader>
                    <CardContent className="space-y-5 p-6">
                      <div className="grid grid-cols-1 gap-3 max-h-[360px] overflow-y-auto pr-1">
                        {WHEEL_STYLES.map((wheel) => (
                          <motion.div
                            key={wheel.id}
                            className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedWheel.id === wheel.id ? 'border-[#4725f4] bg-[#1c1833]/90 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-white/10 hover:border-white/10 bg-[#1c1833]/90'}`}
                            onClick={() => handleWheelStyleSelect(wheel)}
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-start gap-4">
                              <motion.div 
                                className="w-12 h-12 rounded-full bg-[#1c1833]/90 flex items-center justify-center border border-white/10 shrink-0"
                                whileHover={{ rotate: 10 }}
                              >
                                <CircleDashed className="h-4 w-4 text-[#4725f4]" />
                              </motion.div>
                              <div className="flex-1 min-w-0">
                                <div className="mb-1 flex items-center justify-between gap-2">
                                  <h4 className="line-clamp-1 min-w-0 break-words text-sm font-semibold text-white">{isZh ? wheel.nameZh : wheel.name}</h4>
                                  {wheel.price > 0 && (
                                    <motion.span 
                                      className="text-xs font-medium text-[#4725f4] shrink-0"
                                      whileHover={{ scale: 1.1 }}
                                    >
                                      +{formatPrice(wheel.price)}
                                    </motion.span>
                                  )}
                                </div>
                                <p className="line-clamp-2 break-words text-xs leading-relaxed text-gray-400">{isZh ? wheel.descriptionZh : wheel.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {wheel.tags.slice(0, 3).map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-[10px] border-white/10 text-gray-400">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-white/10">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setShowAdvancedWheels((prev) => !prev)}
                          className="min-h-11 w-full justify-between"
                        >
                          <span className="pr-2 text-left text-sm leading-snug">{t('advancedWheelSpec')}</span>
                          {showAdvancedWheels ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </Button>
                        {showAdvancedWheels && (
                          <div className="mt-3 space-y-3">
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              <div className="space-y-1">
                                <p className="text-xs text-gray-400">{t('wheelSize')}</p>
                                <Select
                                  value={String(wheelSpec.size)}
                                  onValueChange={(value) => updateWheelSpec({ size: Number(value) })}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('selectSize')} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {WHEEL_SIZES.map((size) => (
                                      <SelectItem key={size} value={String(size)}>
                                        {size}" ({WHEEL_SIZE_EXTRA_COST[size] > 0 ? `+${formatPrice(WHEEL_SIZE_EXTRA_COST[size])}` : t('base')})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-gray-400">{t('wheelSpokes')}</p>
                                <Select
                                  value={String(wheelSpec.spokeCount)}
                                  onValueChange={(value) => updateWheelSpec({ spokeCount: Number(value) })}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('selectSpokes')} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {SPOKE_COUNTS.map((count) => (
                                      <SelectItem key={count} value={String(count)}>
                                        {count} {t('spokeUnit')}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              <div className="space-y-1">
                                <p className="text-xs text-gray-400">{t('wheelColor')}</p>
                                <Select
                                  value={wheelSpec.colorId}
                                  onValueChange={(value) => updateWheelSpec({ colorId: value })}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('selectColor')} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {WHEEL_COLORS.map((color) => (
                                      <SelectItem key={color.id} value={color.id}>
                                        {isZh ? color.nameZh : color.name} {color.extraCost > 0 ? `(+${formatPrice(color.extraCost)})` : ''}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-1">
                                <p className="text-xs text-gray-400">{t('wheelConcavity')}</p>
                                <Select
                                  value={wheelSpec.concavity}
                                  onValueChange={(value) => updateWheelSpec({ concavity: value as WheelConcavity })}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder={t('selectConcavity')} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {WHEEL_CONCAVITY_OPTIONS.map((item) => (
                                      <SelectItem key={item.id} value={item.id}>
                                        {isZh ? item.nameZh : item.name} {item.extraCost > 0 ? `(+${formatPrice(item.extraCost)})` : ''}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </motion.div>
                </Card>
                )}

                {/* Modification Options */}
                {activeTab === 'mods' && (
                  <Card className="bg-[#1c1833]/90 border-white/10 shadow-lg overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardHeader className="border-b border-white/10 bg-[#1c1833]/90 p-6">
                      <CardTitle className="text-lg font-semibold tracking-tight text-white">{t('performanceStylingTitle')}</CardTitle>
                      <p className="mt-1 text-sm leading-relaxed text-gray-400">{t('performanceStylingDesc')}</p>
                    </CardHeader>
                    <CardContent className="space-y-3 p-6">
                      {MODIFICATION_OPTIONS.map((mod) => (
                        <motion.div 
                          key={mod.id} 
                          className="flex items-start justify-between gap-3 border-b border-white/10 py-4"
                          whileHover={{ x: 5 }}
                        >
                          <motion.div 
                            className="flex min-w-0 items-start gap-4"
                            onClick={() => toggleMod(mod.id)}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div 
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer ${selectedMods.includes(mod.id) ? 'bg-gradient-to-r from-[#4725f4] to-[#7c5cff] border-[#4725f4] shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'border-white/10'}`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {selectedMods.includes(mod.id) && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Check className="h-3 w-3 text-white" />
                                </motion.div>
                              )}
                            </motion.div>
                            <div className="min-w-0">
                              <p className="break-words text-sm font-medium leading-snug text-white">{isZh ? mod.nameZh : mod.name}</p>
                              <p className="mt-1 break-words text-xs leading-relaxed text-gray-400">{isZh ? mod.descriptionZh : mod.description}</p>
                            </div>
                          </motion.div>
                          <motion.span 
                            className="shrink-0 pt-0.5 text-sm font-medium text-[#4725f4]"
                            whileHover={{ scale: 1.1 }}
                          >
                            +{formatPrice(mod.price)}
                          </motion.span>
                        </motion.div>
                      ))}
                    </CardContent>
                  </motion.div>
                </Card>
                )}

                {/* Accent Options */}
                {activeTab === 'accents' && (
                  <Card className="bg-[#1c1833]/90 border-white/10 shadow-lg overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardHeader className="border-b border-white/10 bg-[#1c1833]/90 p-6">
                      <CardTitle className="text-lg font-semibold tracking-tight text-white">{t('accentDetailsTitle')}</CardTitle>
                      <p className="mt-1 text-sm leading-relaxed text-gray-400">{t('accentDetailsDesc')}</p>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                      {ACCENT_OPTIONS.map((accent) => (
                        <motion.div 
                          key={accent.id} 
                          className="flex items-start justify-between gap-3 border-b border-white/10 py-4"
                          whileHover={{ x: 5 }}
                        >
                          <div className="min-w-0">
                            <p className="break-words text-sm font-medium leading-snug text-white">{isZh ? accent.nameZh : accent.name}</p>
                            <p className="mt-1 break-words text-xs leading-relaxed text-gray-400">{isZh ? accent.descriptionZh : accent.description}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <motion.span 
                              className="text-sm font-medium text-[#4725f4]"
                              whileHover={{ scale: 1.1 }}
                            >
                              +{formatPrice(accent.price)}
                            </motion.span>
                            <Switch
                              checked={accentOptions[accent.id]}
                              onCheckedChange={() => toggleAccent(accent.id)}
                              className="data-[state=checked]:bg-[#4725f4]"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </motion.div>
                </Card>
                )}

                <Card className="bg-[#1c1833]/90 border-white/10 shadow-lg overflow-hidden">
                  <CardHeader className="bg-[#1c1833]/90 border-b border-white/10 p-5">
                    <CardTitle className="text-base font-semibold">
                      {t('recentConfigsTitle')}
                    </CardTitle>
                    <p className="text-xs leading-relaxed text-gray-400">
                      {t('recentConfigsDesc')}
                    </p>
                  </CardHeader>
                  <CardContent className="p-5 space-y-2">
                    <Select
                      value={historyState.index >= 0 ? String(historyState.index) : undefined}
                      onValueChange={(value) => {
                        const idx = Number(value);
                        const snapshot = historyState.entries[idx];
                        if (!snapshot) return;
                        applySnapshot(snapshot);
                        setHistoryState((prev) => ({ ...prev, index: idx }));
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={t('chooseSnapshot')} />
                      </SelectTrigger>
                      <SelectContent>
                        {historyState.entries.map((entry, idx) => (
                          <SelectItem key={`${entry.selectedCar.id}-${idx}`} value={String(idx)}>
                            {isZh ? entry.selectedCar.nameZh : entry.selectedCar.name} · {entry.wheelSpec.size}" · {idx === historyState.index ? t('current') : `${t('step')} ${idx + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Button
                      className="min-h-12 w-full bg-gradient-to-r from-[#4725f4] to-[#7c5cff] py-5 text-base font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-all duration-300 hover:from-[#361bb8] hover:to-[#5b2de1]"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-3" />
                          {t('generating')}
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-3" />
                          {t('generateShowcase')}
                        </>
                      )}
                    </Button>
                  </motion.div>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="flex-1"
                    >
                      <Button
                        variant="secondary"
                        className="min-h-11 w-full break-words border border-white/10 bg-[#1c1833]/90 py-3 text-center font-medium transition-all duration-300 hover:bg-white/10"
                        onClick={handleShare}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        {t('share')}
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                      className="flex-1"
                    >
                      <Button
                        variant="secondary"
                        className="min-h-11 w-full break-words border border-white/10 bg-[#1c1833]/90 py-3 text-center font-medium transition-all duration-300 hover:bg-white/10"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        {t('quote')}
                      </Button>
                    </motion.div>
                  </div>
                  <motion.div 
                    className="text-center mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <p className="mx-auto max-w-[260px] text-xs leading-relaxed text-gray-500 sm:max-w-none">
                      {t('creditsRequired', { credits: costCredits })}
                      {user && ` ${t('remaining', { credits: remainingCredits })}`}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="mt-10 rounded-xl border border-white/10 bg-[#1c1833]/70 p-4 text-xs leading-relaxed text-gray-400">
            {isZh ? (
              <p>
                声明：页面中提及的汽车品牌、车型名称与商标仅用于识别和兼容性说明。CarModSnap
                为独立服务，除非另有明确说明，不隶属于、也不代表任何汽车制造商或商标权利人。
              </p>
            ) : (
              <p>
                Disclaimer: Car brand names, model names, and trademarks shown
                on this page are used for identification and compatibility
                reference only. CarModSnap is an independent service and is not
                affiliated with, endorsed by, or sponsored by any vehicle
                manufacturer or trademark owner unless explicitly stated.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  
  );
}

/*
// 保存方案功能
const handleSaveBuild = async () => {
...
*/
