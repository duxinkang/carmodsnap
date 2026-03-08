'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Check,
  ChevronDown,
  ChevronUp,
  CircleCheckBig,
  CircleDashed,
  Download,
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  Loader2,
  Redo2,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  Undo2,
  WandSparkles,
  X,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { toast } from 'sonner';

import { Link } from '@/core/i18n/navigation';
import { AITaskStatus } from '@/extensions/ai/types';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Separator } from '@/shared/components/ui/separator';
import { Switch } from '@/shared/components/ui/switch';
import { useAppContext } from '@/shared/contexts/app';
import { getUuid } from '@/shared/lib/hash';

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
  {
    id: 'honda-civic',
    name: 'Honda Civic',
    nameZh: '本田思域',
    brand: 'Honda',
    type: 'sedan',
    image: '/imgs/cars/honda-civic.jpg',
    localImage: '/imgs/cars/honda-civic.jpg',
    price: 150000,
  },
  {
    id: 'honda-s2000',
    name: 'Honda S2000',
    nameZh: '本田 S2000',
    brand: 'Honda',
    type: 'roadster',
    image: '/imgs/cars/honda-s2000.jpg',
    localImage: '/imgs/cars/honda-s2000.jpg',
    price: 350000,
  },
  // Toyota / Subaru
  {
    id: 'toyota-86-brz',
    name: 'Toyota 86 / Subaru BRZ',
    nameZh: '丰田 86/斯巴鲁 BRZ',
    brand: 'Toyota/Subaru',
    type: 'coupe',
    image: '/imgs/cars/toyota-86-brz.jpg',
    localImage: '/imgs/cars/toyota-86-brz.jpg',
    price: 280000,
  },
  {
    id: 'toyota-supra',
    name: 'Toyota Supra',
    nameZh: '丰田 Supra',
    brand: 'Toyota',
    type: 'sports',
    image: '/imgs/cars/toyota-supra.jpg',
    localImage: '/imgs/cars/toyota-supra.jpg',
    price: 600000,
  },
  {
    id: 'toyota-ae86',
    name: 'Toyota AE86',
    nameZh: '丰田 AE86',
    brand: 'Toyota',
    type: 'coupe',
    image: '/imgs/cars/toyota-ae86.jpg',
    localImage: '/imgs/cars/toyota-ae86.jpg',
    price: 150000,
  },
  {
    id: 'subaru-wrx',
    name: 'Subaru WRX / STI',
    nameZh: '斯巴鲁 WRX/STI',
    brand: 'Subaru',
    type: 'sedan',
    image: '/imgs/cars/subaru-wrx.jpg',
    localImage: '/imgs/cars/subaru-wrx.jpg',
    price: 350000,
  },
  // Volkswagen
  {
    id: 'vw-golf',
    name: 'Volkswagen Golf',
    nameZh: '大众高尔夫',
    brand: 'Volkswagen',
    type: 'hatchback',
    image: '/imgs/cars/vw-golf.jpg',
    localImage: '/imgs/cars/vw-golf.jpg',
    price: 150000,
  },
  {
    id: 'vw-beetle',
    name: 'Volkswagen Beetle',
    nameZh: '大众甲壳虫',
    brand: 'Volkswagen',
    type: 'hatchback',
    image: '/imgs/cars/vw-beetle.jpg',
    localImage: '/imgs/cars/vw-beetle.jpg',
    price: 200000,
  },
  // Nissan
  {
    id: 'nissan-gtr',
    name: 'Nissan Skyline GT-R',
    nameZh: '日产 GT-R',
    brand: 'Nissan',
    type: 'sports',
    image: '/imgs/cars/nissan-gtr.jpg',
    localImage: '/imgs/cars/nissan-gtr.jpg',
    price: 1500000,
  },
  {
    id: 'nissan-silvia',
    name: 'Nissan Silvia (S13-S15)',
    nameZh: '日产 Silvia',
    brand: 'Nissan',
    type: 'coupe',
    image: '/imgs/cars/nissan-silvia.jpg',
    localImage: '/imgs/cars/nissan-silvia.jpg',
    price: 200000,
  },
  {
    id: 'nissan-370z',
    name: 'Nissan 350Z / 370Z',
    nameZh: '日产 370Z',
    brand: 'Nissan',
    type: 'coupe',
    image: '/imgs/cars/nissan-370z.jpg',
    localImage: '/imgs/cars/nissan-370z.jpg',
    price: 350000,
  },
  // Mazda
  {
    id: 'mazda-mx5',
    name: 'Mazda MX-5 (Miata)',
    nameZh: '马自达 MX-5',
    brand: 'Mazda',
    type: 'roadster',
    image: '/imgs/cars/mazda-mx5.jpg',
    localImage: '/imgs/cars/mazda-mx5.jpg',
    price: 350000,
  },
  {
    id: 'mazda-rx7',
    name: 'Mazda RX-7',
    nameZh: '马自达 RX-7',
    brand: 'Mazda',
    type: 'coupe',
    image: '/imgs/cars/mazda-rx7.jpg',
    localImage: '/imgs/cars/mazda-rx7.jpg',
    price: 500000,
  },
  // BMW
  {
    id: 'bmw-3series',
    name: 'BMW 3 Series',
    nameZh: '宝马 3 系',
    brand: 'BMW',
    type: 'sedan',
    image: '/imgs/cars/bmw-3series.jpg',
    localImage: '/imgs/cars/bmw-3series.jpg',
    price: 300000,
  },
  {
    id: 'bmw-m3',
    name: 'BMW M3 / M4',
    nameZh: '宝马 M3/M4',
    brand: 'BMW',
    type: 'sports',
    image: '/imgs/cars/bmw-m3.jpg',
    localImage: '/imgs/cars/bmw-m3.jpg',
    price: 800000,
  },
  // Ford
  {
    id: 'ford-mustang',
    name: 'Ford Mustang',
    nameZh: '福特野马',
    brand: 'Ford',
    type: 'coupe',
    image: '/imgs/cars/ford-mustang.jpg',
    localImage: '/imgs/cars/ford-mustang.jpg',
    price: 400000,
  },
  {
    id: 'ford-f150',
    name: 'Ford F-150 / Raptor',
    nameZh: '福特 F-150',
    brand: 'Ford',
    type: 'truck',
    image: '/imgs/cars/ford-f150.jpg',
    localImage: '/imgs/cars/ford-f150.jpg',
    price: 600000,
  },
  // Mitsubishi
  {
    id: 'mitsubishi-evo',
    name: 'Mitsubishi Lancer Evolution',
    nameZh: '三菱 EVO',
    brand: 'Mitsubishi',
    type: 'sedan',
    image: '/imgs/cars/mitsubishi-evo.jpg',
    localImage: '/imgs/cars/mitsubishi-evo.jpg',
    price: 450000,
  },
  // Porsche
  {
    id: 'porsche-911',
    name: 'Porsche 911',
    nameZh: '保时捷 911',
    brand: 'Porsche',
    type: 'sports',
    image: '/imgs/cars/porsche-911.jpg',
    localImage: '/imgs/cars/porsche-911.jpg',
    price: 1500000,
  },
  // Jeep / Suzuki / Land Rover
  {
    id: 'jeep-wrangler',
    name: 'Jeep Wrangler',
    nameZh: '吉普牧马人',
    brand: 'Jeep',
    type: 'suv',
    image: '/imgs/cars/jeep-wrangler.jpg',
    localImage: '/imgs/cars/jeep-wrangler.jpg',
    price: 450000,
  },
  {
    id: 'suzuki-jimny',
    name: 'Suzuki Jimny',
    nameZh: '铃木吉姆尼',
    brand: 'Suzuki',
    type: 'suv',
    image: '/imgs/cars/suzuki-jimny.jpg',
    localImage: '/imgs/cars/suzuki-jimny.jpg',
    price: 150000,
  },
  {
    id: 'landrover-defender',
    name: 'Land Rover Defender',
    nameZh: '路虎卫士',
    brand: 'Land Rover',
    type: 'suv',
    image: '/imgs/cars/landrover-defender.jpg',
    localImage: '/imgs/cars/landrover-defender.jpg',
    price: 700000,
  },
  // Audi
  {
    id: 'audi-a4',
    name: 'Audi A4 / S4 / RS4',
    nameZh: '奥迪 A4',
    brand: 'Audi',
    type: 'sedan',
    image: '/imgs/cars/audi-a4.jpg',
    localImage: '/imgs/cars/audi-a4.jpg',
    price: 350000,
  },
  {
    id: 'audi-a5',
    name: 'Audi A5 / S5 / RS5',
    nameZh: '奥迪 A5',
    brand: 'Audi',
    type: 'coupe',
    image: '/imgs/cars/audi-a5.jpg',
    localImage: '/imgs/cars/audi-a5.jpg',
    price: 500000,
  },
  // Mercedes-Benz
  {
    id: 'mercedes-cclass',
    name: 'Mercedes-Benz C-Class',
    nameZh: '奔驰 C 级',
    brand: 'Mercedes-Benz',
    type: 'sedan',
    image: '/imgs/cars/mercedes-cclass.jpg',
    localImage: '/imgs/cars/mercedes-cclass.jpg',
    price: 350000,
  },
  // MINI
  {
    id: 'mini-cooper',
    name: 'MINI Cooper',
    nameZh: 'MINI Cooper',
    brand: 'MINI',
    type: 'hatchback',
    image: '/imgs/cars/mini-cooper.jpg',
    localImage: '/imgs/cars/mini-cooper.jpg',
    price: 280000,
  },
  // Chevrolet / Dodge
  {
    id: 'chevy-camaro',
    name: 'Chevrolet Camaro',
    nameZh: '雪佛兰科迈罗',
    brand: 'Chevrolet',
    type: 'coupe',
    image: '/imgs/cars/chevy-camaro.jpg',
    localImage: '/imgs/cars/chevy-camaro.jpg',
    price: 400000,
  },
  {
    id: 'dodge-challenger',
    name: 'Dodge Challenger',
    nameZh: '道奇挑战者',
    brand: 'Dodge',
    type: 'coupe',
    image: '/imgs/cars/dodge-challenger.jpg',
    localImage: '/imgs/cars/dodge-challenger.jpg',
    price: 450000,
  },
  // Lexus
  {
    id: 'lexus-is',
    name: 'Lexus IS',
    nameZh: '雷克萨斯 IS',
    brand: 'Lexus',
    type: 'sedan',
    image: '/imgs/cars/lexus-is.jpg',
    localImage: '/imgs/cars/lexus-is.jpg',
    price: 350000,
  },
  // Tesla
  {
    id: 'tesla-model3',
    name: 'Tesla Model 3',
    nameZh: '特斯拉 Model 3',
    brand: 'Tesla',
    type: 'sedan',
    image: '/imgs/cars/tesla-model3.jpg',
    localImage: '/imgs/cars/tesla-model3.jpg',
    price: 280000,
  },
  // Infiniti
  {
    id: 'infiniti-g35',
    name: 'Infiniti G35 / G37',
    nameZh: '英菲尼迪 G35',
    brand: 'Infiniti',
    type: 'sedan',
    image: '/imgs/cars/infiniti-g35.jpg',
    localImage: '/imgs/cars/infiniti-g35.jpg',
    price: 250000,
  },
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
const WHEEL_CONCAVITY_OPTIONS: {
  id: WheelConcavity;
  name: string;
  nameZh: string;
  extraCost: number;
}[] = [
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
  {
    id: 'stock',
    name: 'Stock Wheels',
    nameZh: '原厂轮毂',
    description: 'Keep original factory wheels',
    descriptionZh: '保持原厂轮毂样式',
    price: 0,
    tags: ['daily'],
    defaultSpokeCount: 10,
    defaultConcavity: 'low',
  },
  {
    id: 'split5',
    name: 'Split-5 Sport',
    nameZh: '五辐分叉运动',
    description: 'Balanced street performance style',
    descriptionZh: '街道性能均衡风格',
    price: 7000,
    tags: ['sport', 'street'],
    defaultSpokeCount: 5,
    defaultConcavity: 'mid',
  },
  {
    id: 'mesh-rs',
    name: 'Mesh RS',
    nameZh: '网格 RS',
    description: 'Dense mesh for premium stance',
    descriptionZh: '密辐网格豪华姿态',
    price: 9500,
    tags: ['luxury', 'show'],
    defaultSpokeCount: 12,
    defaultConcavity: 'mid',
  },
  {
    id: 'forged-y',
    name: 'Forged Y-Spoke',
    nameZh: 'Y 辐锻造',
    description: 'Light forged wheel for quick response',
    descriptionZh: '轻量锻造提升响应',
    price: 15000,
    tags: ['track', 'forged'],
    defaultSpokeCount: 10,
    defaultConcavity: 'mid',
  },
  {
    id: 'te37-style',
    name: '6-Spoke Track',
    nameZh: '六辐赛道',
    description: 'Classic six spoke motorsport look',
    descriptionZh: '经典六辐竞技风格',
    price: 12000,
    tags: ['track', 'sport'],
    defaultSpokeCount: 6,
    defaultConcavity: 'deep',
  },
  {
    id: 'turbofan',
    name: 'Turbo Fan',
    nameZh: '涡轮风扇盘',
    description: 'Retro aerodynamic fan face',
    descriptionZh: '复古空气动力学轮面',
    price: 8000,
    tags: ['retro', 'show'],
    defaultSpokeCount: 7,
    defaultConcavity: 'low',
  },
  {
    id: 'monoblock',
    name: 'Luxury Monoblock',
    nameZh: '豪华一体盘',
    description: 'Large monoblock luxury finish',
    descriptionZh: '大尺寸豪华一体盘',
    price: 13800,
    tags: ['luxury'],
    defaultSpokeCount: 5,
    defaultConcavity: 'mid',
  },
  {
    id: 'drift-x',
    name: 'Drift X',
    nameZh: '漂移 X 辐',
    description: 'Aggressive drift style layout',
    descriptionZh: '激进漂移风格布局',
    price: 9800,
    tags: ['drift', 'sport'],
    defaultSpokeCount: 6,
    defaultConcavity: 'deep',
  },
  {
    id: 'rally-star',
    name: 'Rally Star',
    nameZh: '拉力星型',
    description: 'High durability rally wheel look',
    descriptionZh: '耐用拉力风外观',
    price: 9200,
    tags: ['rally', 'street'],
    defaultSpokeCount: 5,
    defaultConcavity: 'low',
  },
  {
    id: 'concave-v',
    name: 'Concave V',
    nameZh: 'V 辐深凹',
    description: 'Deep concave V-spoke profile',
    descriptionZh: 'V 辐深凹轮面',
    price: 12800,
    tags: ['show', 'sport'],
    defaultSpokeCount: 10,
    defaultConcavity: 'deep',
  },
  {
    id: 'blade-10',
    name: 'Blade 10',
    nameZh: '刀锋十辐',
    description: 'Sharp blade-like ten spokes',
    descriptionZh: '锋利刀锋十辐设计',
    price: 10500,
    tags: ['sport'],
    defaultSpokeCount: 10,
    defaultConcavity: 'mid',
  },
  {
    id: 'classic-mesh',
    name: 'Classic Mesh',
    nameZh: '经典网格',
    description: 'Timeless old-school mesh style',
    descriptionZh: '经典老派网格风格',
    price: 8600,
    tags: ['retro', 'luxury'],
    defaultSpokeCount: 12,
    defaultConcavity: 'low',
  },
  {
    id: 'gt-arc',
    name: 'GT Arc',
    nameZh: 'GT 弧线辐',
    description: 'GT-inspired arc spoke geometry',
    descriptionZh: 'GT 灵感弧线辐条',
    price: 11800,
    tags: ['sport', 'track'],
    defaultSpokeCount: 8,
    defaultConcavity: 'mid',
  },
  {
    id: 'aero-disc',
    name: 'Aero Disc',
    nameZh: '空气动力盘',
    description: 'Disc-like aero cover styling',
    descriptionZh: '盘式空气动力学风格',
    price: 9900,
    tags: ['ev', 'show'],
    defaultSpokeCount: 5,
    defaultConcavity: 'low',
  },
  {
    id: 'wire-lux',
    name: 'Wire Lux',
    nameZh: '复古钢丝豪华',
    description: 'Modernized wire wheel feel',
    descriptionZh: '现代化钢丝轮质感',
    price: 13200,
    tags: ['luxury', 'retro'],
    defaultSpokeCount: 12,
    defaultConcavity: 'low',
  },
  {
    id: 'forged-h',
    name: 'Forged H',
    nameZh: 'H 辐锻造',
    description: 'Rigid forged H-spoke shape',
    descriptionZh: '高刚性 H 辐锻造结构',
    price: 16200,
    tags: ['forged', 'track'],
    defaultSpokeCount: 8,
    defaultConcavity: 'deep',
  },
  {
    id: 'street-8',
    name: 'Street 8',
    nameZh: '街道八辐',
    description: 'Clean everyday eight spoke wheel',
    descriptionZh: '干净利落的八辐日常风',
    price: 7600,
    tags: ['daily', 'street'],
    defaultSpokeCount: 8,
    defaultConcavity: 'mid',
  },
  {
    id: 'stance-pro',
    name: 'Stance Pro',
    nameZh: '姿态派 Pro',
    description: 'Ultra low-offset stance look',
    descriptionZh: '低趴姿态派风格',
    price: 14200,
    tags: ['show', 'stance'],
    defaultSpokeCount: 10,
    defaultConcavity: 'deep',
  },
];

const PAINT_COLORS = [
  {
    id: 'midnight-black',
    name: 'Midnight Black',
    nameZh: '午夜黑',
    color: '#0a0a0a',
    description: 'Deep mysterious black',
    descriptionZh: '深邃神秘的黑色',
    price: 0,
  },
  {
    id: 'pearl-white',
    name: 'Pearl White',
    nameZh: '珍珠白',
    color: '#f5f5f5',
    description: 'Elegant pure white',
    descriptionZh: '优雅纯净的白色',
    price: 0,
  },
  {
    id: 'racing-red',
    name: 'Racing Red',
    nameZh: '赛道红',
    color: '#c41e3a',
    description: 'Passionate vibrant red',
    descriptionZh: '激情澎湃的红色',
    price: 0,
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    nameZh: '海洋蓝',
    color: '#0066cc',
    description: 'Deep tranquil blue',
    descriptionZh: '深邃宁静的蓝色',
    price: 0,
  },
  {
    id: 'forest-green',
    name: 'Forest Green',
    nameZh: '森林绿',
    color: '#228b22',
    description: 'Natural fresh green',
    descriptionZh: '自然清新的绿色',
    price: 0,
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    nameZh: '日落橙',
    color: '#ff6b35',
    description: 'Energetic vibrant orange',
    descriptionZh: '活力四射的橙色',
    price: 3000,
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    nameZh: '皇家紫',
    color: '#6b3fa0',
    description: 'Noble elegant purple',
    descriptionZh: '高贵典雅的紫色',
    price: 3000,
  },
  {
    id: 'titanium-gray',
    name: 'Titanium Gray',
    nameZh: '钛金灰',
    color: '#4a5568',
    description: 'Tech-inspired gray',
    descriptionZh: '科技感十足的灰色',
    price: 0,
  },
  {
    id: 'champagne-gold',
    name: 'Champagne Gold',
    nameZh: '香槟金',
    color: '#d4af37',
    description: 'Luxurious atmospheric gold',
    descriptionZh: '奢华大气的金色',
    price: 5000,
  },
  {
    id: 'matte-black',
    name: 'Matte Black',
    nameZh: '哑光黑',
    color: '#1a1a1a',
    description: 'Low-key understated matte black',
    descriptionZh: '低调内敛的哑光黑',
    price: 4000,
  },
];

const FINISH_TYPES = [
  {
    id: 'gloss',
    name: 'Gloss Metallic',
    nameZh: '金属亮光',
    description: 'High-gloss metallic paint',
    descriptionZh: '高光泽度金属漆',
    price: 0,
  },
  {
    id: 'matte',
    name: 'Matte Wrap',
    nameZh: '哑光贴膜',
    description: 'Matte body wrap film',
    descriptionZh: '哑光车身膜',
    price: 8000,
  },
  {
    id: 'satin',
    name: 'Satin Pearl',
    nameZh: '缎面珍珠',
    description: 'Satin pearl paint',
    descriptionZh: '缎面珍珠漆',
    price: 6000,
  },
  {
    id: 'chrome',
    name: 'Chrome',
    nameZh: '镀铬',
    description: 'Chrome effect',
    descriptionZh: '镀铬效果',
    price: 15000,
  },
  {
    id: 'carbon',
    name: 'Carbon Fiber',
    nameZh: '碳纤维',
    description: 'Carbon fiber texture',
    descriptionZh: '碳纤维纹理',
    price: 20000,
  },
];

const MODIFICATION_OPTIONS = [
  {
    id: 'lowered',
    name: 'Lowered Suspension',
    nameZh: '降低车身',
    description: 'Sport stance, lower center of gravity',
    descriptionZh: '运动姿态，降低重心',
    price: 5000,
  },
  {
    id: 'widebody',
    name: 'Widebody Kit',
    nameZh: '宽体套件',
    description: 'Wider track, aggressive look',
    descriptionZh: '更宽的轮距，更激进的外观',
    price: 15000,
  },
  {
    id: 'spoiler',
    name: 'Rear Spoiler',
    nameZh: '尾翼',
    description: 'Add downforce, sport style',
    descriptionZh: '增加下压力，运动风格',
    price: 3000,
  },
  {
    id: 'diffuser',
    name: 'Rear Diffuser',
    nameZh: '扩散器',
    description: 'Optimize aerodynamics',
    descriptionZh: '优化空气动力学',
    price: 4000,
  },
  {
    id: 'side-skirts',
    name: 'Side Skirts',
    nameZh: '侧裙',
    description: 'Lower visual center of gravity',
    descriptionZh: '降低视觉重心',
    price: 2500,
  },
  {
    id: 'front-lip',
    name: 'Front Lip',
    nameZh: '前唇',
    description: 'Enhance front sportiness',
    descriptionZh: '增强前部运动感',
    price: 2000,
  },
];

const ACCENT_OPTIONS = [
  {
    id: 'chrome-delete',
    name: 'Chrome Delete',
    nameZh: '镀铬删除',
    description: 'Remove chrome trim',
    descriptionZh: '去除镀铬装饰',
    price: 1500,
  },
  {
    id: 'carbon-roof',
    name: 'Carbon Roof',
    nameZh: '碳纤维车顶',
    description: 'Carbon fiber roof',
    descriptionZh: '碳纤维车顶',
    price: 8000,
  },
  {
    id: 'racing-stripes',
    name: 'Racing Stripes',
    nameZh: '赛车条纹',
    description: 'Racing stripe decals',
    descriptionZh: '赛车条纹',
    price: 2000,
  },
  {
    id: 'custom-badge',
    name: 'Custom Badge',
    nameZh: '定制徽章',
    description: 'Custom emblem',
    descriptionZh: '定制徽章',
    price: 1000,
  },
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
    wheelSpec: {
      size: 18,
      spokeCount: 5,
      colorId: 'gunmetal',
      concavity: 'mid',
    },
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
    wheelSpec: {
      size: 19,
      spokeCount: 10,
      colorId: 'satin-black',
      concavity: 'deep',
    },
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
    wheelSpec: {
      size: 19,
      spokeCount: 10,
      colorId: 'bronze',
      concavity: 'mid',
    },
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
    wheelSpec: {
      size: 17,
      spokeCount: 12,
      colorId: 'silver',
      concavity: 'low',
    },
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
    wheelSpec: {
      size: 19,
      spokeCount: 5,
      colorId: 'gunmetal',
      concavity: 'low',
    },
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
    return output
      .flatMap((item) => {
        if (!item) return [];
        if (typeof item === 'string') return [item];
        if (typeof item === 'object') {
          const candidate =
            item.url ?? item.uri ?? item.image ?? item.src ?? item.imageUrl;
          return typeof candidate === 'string' ? [candidate] : [];
        }
        return [];
      })
      .filter(Boolean);
  }
  if (typeof output === 'object') {
    const candidate =
      output.url ?? output.uri ?? output.image ?? output.src ?? output.imageUrl;
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
    spokeCount: SPOKE_COUNTS.includes(spec?.spokeCount ?? 0)
      ? (spec?.spokeCount as number)
      : 8,
    colorId: WHEEL_COLORS.some((item) => item.id === spec?.colorId)
      ? (spec?.colorId as string)
      : 'satin-black',
    concavity: WHEEL_CONCAVITY_OPTIONS.some(
      (item) => item.id === spec?.concavity
    )
      ? (spec?.concavity as WheelConcavity)
      : 'mid',
  };
}

function getWheelThumbnail(id: string) {
  return `/imgs/carmodder/wheels/${id}.png`;
}

function getModThumbnail(id: string) {
  return `/imgs/carmodder/mods/${id}.png`;
}

function getFinishPreviewStyle(finishId: string, color: string) {
  switch (finishId) {
    case 'gloss':
      return {
        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.34), rgba(255,255,255,0.02) 36%, rgba(0,0,0,0.14) 62%, ${color} 100%)`,
      };
    case 'matte':
      return {
        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02) 30%, rgba(0,0,0,0.28) 100%), repeating-linear-gradient(145deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 3px, rgba(0,0,0,0.02) 3px, rgba(0,0,0,0.02) 6px), linear-gradient(180deg, ${color}, ${color})`,
      };
    case 'satin':
      return {
        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.03) 40%, rgba(0,0,0,0.2) 100%), linear-gradient(180deg, ${color}, ${color})`,
      };
    case 'chrome':
      return {
        backgroundImage:
          'linear-gradient(120deg, #fafafa 0%, #cfd4dc 16%, #7d8592 32%, #eceff3 48%, #7d8592 64%, #c9d0da 82%, #ffffff 100%)',
      };
    case 'carbon':
      return {
        backgroundImage:
          'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.01) 40%, rgba(0,0,0,0.28) 100%), repeating-linear-gradient(45deg, #2f3136 0px, #2f3136 6px, #181a1e 6px, #181a1e 12px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.05) 0px, rgba(255,255,255,0.05) 6px, transparent 6px, transparent 12px)',
      };
    default:
      return {
        backgroundColor: color,
      };
  }
}

function getColorCardStyle(color: string, finishId: string) {
  const finishStyle = getFinishPreviewStyle(finishId, color);
  return {
    backgroundColor: color,
    ...finishStyle,
  };
}

export default function CarModderConfigurator() {
  const t = useTranslations('pages.carmodder');
  const locale = useLocale();
  const isZh = locale === 'zh';

  const [selectedCar, setSelectedCar] = useState<CarModel>(
    CHINESE_CAR_MODELS[0]
  );
  const [selectedWheel, setSelectedWheel] = useState<WheelStyle>(
    WHEEL_STYLES[0]
  );
  const [wheelSpec, setWheelSpec] = useState<WheelSpec>(() =>
    normalizeWheelSpec({
      size: 18,
      spokeCount: WHEEL_STYLES[0].defaultSpokeCount,
      colorId: 'satin-black',
      concavity: WHEEL_STYLES[0].defaultConcavity,
    })
  );
  const [selectedColor, setSelectedColor] = useState(PAINT_COLORS[0]);
  const [selectedFinish, setSelectedFinish] = useState(FINISH_TYPES[0]);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('paint');
  const [accentOptions, setAccentOptions] = useState<Record<string, boolean>>(
    buildAccentMap([])
  );
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [showAdvancedWheels, setShowAdvancedWheels] = useState(false);

  const [showcaseStates, setShowcaseStates] = useState<ShowcaseStates>(
    getInitialShowcaseStates
  );
  const [activeShot, setActiveShot] = useState<ShowcaseShotType>('panorama');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(
    null
  );
  const [downloadingImageId, setDownloadingImageId] = useState<string | null>(
    null
  );
  const [isMounted, setIsMounted] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [showAllCars, setShowAllCars] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [carSearch, setCarSearch] = useState('');
  const [activeBrandFilter, setActiveBrandFilter] = useState('all');
  const [compareMode, setCompareMode] = useState(false);
  const [comparePosition, setComparePosition] = useState(52);
  const [historyState, setHistoryState] = useState<{
    entries: BuildSnapshot[];
    index: number;
  }>({
    entries: [],
    index: -1,
  });
  const [historyReady, setHistoryReady] = useState(false);
  const applyingSnapshotRef = useRef(false);

  const handleCustomCarSubmit = useCallback(
    (data: CustomCarInputData) => {
      const customCar = {
        id: `custom-${Date.now()}`,
        name: `${data.brand} ${data.model}`,
        nameZh: `${data.brand} ${data.model}`,
        brand: data.brand,
        type: data.type,
        image:
          data.imageUrl ||
          'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop',
        localImage: data.imageUrl || '/imgs/cars/honda-civic.jpg',
        price: 300000,
        customInput: data,
      };
      setSelectedCar(customCar);
      setActivePresetId(null);
      setShowCustomInput(false);
      toast.success(t('carAdded'));
    },
    [t]
  );

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
    setSelectedWheel(
      WHEEL_STYLES.find((w) => w.id === snapshot.selectedWheelId) ??
        WHEEL_STYLES[0]
    );
    setSelectedColor(
      PAINT_COLORS.find((item) => item.id === snapshot.selectedColorId) ??
        PAINT_COLORS[0]
    );
    setSelectedFinish(
      FINISH_TYPES.find((item) => item.id === snapshot.selectedFinishId) ??
        FINISH_TYPES[0]
    );
    setSelectedMods(
      snapshot.selectedMods.filter((id) =>
        MODIFICATION_OPTIONS.some((m) => m.id === id)
      )
    );
    setAccentOptions(
      buildAccentMap(
        Object.entries(snapshot.accentOptions)
          .filter(([, enabled]) => enabled)
          .map(([id]) => id)
      )
    );
    setWheelSpec(normalizeWheelSpec(snapshot.wheelSpec));
    setActivePresetId(snapshot.activePresetId);
    setTimeout(() => {
      applyingSnapshotRef.current = false;
    }, 0);
  }, []);

  const createSnapshot = useCallback(
    (): BuildSnapshot => ({
      selectedCar,
      selectedWheelId: selectedWheel.id,
      selectedColorId: selectedColor.id,
      selectedFinishId: selectedFinish.id,
      selectedMods,
      accentOptions,
      wheelSpec: normalizeWheelSpec(wheelSpec),
      activePresetId,
    }),
    [
      selectedCar,
      selectedWheel,
      selectedColor,
      selectedFinish,
      selectedMods,
      accentOptions,
      wheelSpec,
      activePresetId,
    ]
  );

  useEffect(() => {
    if (!isMounted) return;
    try {
      const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BuildSnapshot[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.slice(-10).map((item) => ({
            ...item,
            selectedMods: Array.isArray(item.selectedMods)
              ? item.selectedMods
              : [],
            accentOptions: item.accentOptions ?? buildAccentMap([]),
            wheelSpec: normalizeWheelSpec(item.wheelSpec),
            activePresetId: item.activePresetId ?? null,
          }));
          setHistoryState({
            entries: normalized,
            index: normalized.length - 1,
          });
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
      window.localStorage.setItem(
        HISTORY_STORAGE_KEY,
        JSON.stringify(historyState.entries)
      );
    } catch (error) {
      console.error('保存历史记录失败:', error);
    }
  }, [historyState.entries, isMounted, historyReady]);

  const costCredits = 4;
  const remainingCredits = user?.credits?.remainingCredits ?? 0;

  const toggleMod = (modId: string) => {
    setActivePresetId(null);
    setSelectedMods((prev) =>
      prev.includes(modId)
        ? prev.filter((id) => id !== modId)
        : [...prev, modId]
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
    setWheelSpec((prev) =>
      normalizeWheelSpec({
        ...prev,
        spokeCount: wheel.defaultSpokeCount,
        concavity: wheel.defaultConcavity,
      })
    );
  }, []);

  const applyPreset = useCallback(
    (preset: PresetPack) => {
      const wheel =
        WHEEL_STYLES.find((item) => item.id === preset.wheelId) ??
        WHEEL_STYLES[0];
      const color =
        PAINT_COLORS.find((item) => item.id === preset.colorId) ??
        PAINT_COLORS[0];
      const finish =
        FINISH_TYPES.find((item) => item.id === preset.finishId) ??
        FINISH_TYPES[0];
      setSelectedWheel(wheel);
      setSelectedColor(color);
      setSelectedFinish(finish);
      setSelectedMods(
        preset.mods.filter((id) =>
          MODIFICATION_OPTIONS.some((mod) => mod.id === id)
        )
      );
      setAccentOptions(buildAccentMap(preset.accents));
      setWheelSpec(normalizeWheelSpec(preset.wheelSpec));
      setActivePresetId(preset.id);
      toast.success(
        t('presetApplied', { name: isZh ? preset.nameZh : preset.name })
      );
    },
    [isZh, t]
  );

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

    parts.push(
      `${isZh ? selectedCar.nameZh : selectedCar.name} (${selectedCar.brand})`
    );
    parts.push(
      `${t('paint')}: ${isZh ? selectedColor.nameZh : selectedColor.name} (${isZh ? selectedFinish.nameZh : selectedFinish.name}${t('paintFinish')})`
    );
    const wheelColor =
      WHEEL_COLORS.find((item) => item.id === wheelSpec.colorId) ??
      WHEEL_COLORS[0];
    const concavity =
      WHEEL_CONCAVITY_OPTIONS.find((item) => item.id === wheelSpec.concavity) ??
      WHEEL_CONCAVITY_OPTIONS[1];
    parts.push(
      `${t('wheels')}: ${isZh ? selectedWheel.nameZh : selectedWheel.name}, ${wheelSpec.size}" ` +
        `${isZh ? wheelColor.nameZh : wheelColor.name}, ${wheelSpec.spokeCount}${t('spokeUnit')}, ` +
        `${isZh ? concavity.nameZh : concavity.name} ${t('concavity')}`
    );

    const activeMods = selectedMods
      .map((id) => MODIFICATION_OPTIONS.find((m) => m.id === id))
      .map((m) => (isZh ? m?.nameZh : m?.name))
      .filter(Boolean);
    if (activeMods.length > 0) {
      parts.push(`${t('modifications_')}: ${activeMods.join('、')}`);
    }

    const activeAccents = Object.entries(accentOptions)
      .filter(([_, enabled]) => enabled)
      .map(([id]) => ACCENT_OPTIONS.find((a) => a.id === id))
      .map((a) => (isZh ? a?.nameZh : a?.name))
      .filter(Boolean);
    if (activeAccents.length > 0) {
      parts.push(`${t('details')}: ${activeAccents.join('、')}`);
    }

    if (activePresetId) {
      const preset = PRESET_PACKS.find((item) => item.id === activePresetId);
      if (preset) {
        parts.push(
          `${t('stylePreset')}: ${isZh ? preset.nameZh : preset.name}`
        );
      }
    }

    parts.push(t('promptSuffix'));

    return parts.join(', ');
  }, [
    selectedCar,
    selectedColor,
    selectedFinish,
    selectedWheel,
    selectedMods,
    accentOptions,
    wheelSpec,
    activePresetId,
    isZh,
    t,
  ]);

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
  }, [
    selectedCar.customInput?.imageDataUrl,
    selectedCar.customInput?.imageUrl,
  ]);

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

  const applyShowcaseTask = useCallback((task: ShowcaseTaskResp) => {
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
  }, []);

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
      panorama: {
        image: null,
        status: AITaskStatus.PENDING,
        taskId: null,
        error: null,
      },
      closeup: {
        image: null,
        status: AITaskStatus.PENDING,
        taskId: null,
        error: null,
      },
    });
    setActiveShot('panorama');
    setIsGenerating(true);
    setProgress(15);
    setGenerationStartTime(Date.now());

    try {
      const data = await requestShowcaseGeneration();
      data.tasks.forEach((task) => applyShowcaseTask(task));
      const panoramaSuccess = data.tasks.some(
        (item) =>
          item.shotType === 'panorama' && item.status === AITaskStatus.SUCCESS
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
      const data = await requestShowcaseGeneration({
        retryShotType: shotType,
        bundleId,
      });
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
      const resp = await fetch(
        `/api/proxy/file?url=${encodeURIComponent(image.url)}`
      );
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
    const wheelColor =
      WHEEL_COLORS.find((item) => item.id === wheelSpec.colorId) ??
      WHEEL_COLORS[0];
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
      navigator.clipboard.writeText(
        `${window.location.href}\n\n${shareDescription}`
      );
      toast.success(t('linkCopied'));
    }
  };

  const getShotStatusLabel = useCallback(
    (status: ShotStatus) => {
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
    },
    [t]
  );

  const totalBuildCost = useMemo(() => {
    let basePrice = selectedCar.price;
    basePrice += selectedWheel.price;
    basePrice += WHEEL_SIZE_EXTRA_COST[wheelSpec.size] ?? 0;
    basePrice +=
      WHEEL_COLORS.find((item) => item.id === wheelSpec.colorId)?.extraCost ??
      0;
    basePrice +=
      WHEEL_CONCAVITY_OPTIONS.find((item) => item.id === wheelSpec.concavity)
        ?.extraCost ?? 0;
    basePrice += selectedColor.price;
    basePrice += selectedFinish.price;
    basePrice += selectedMods.reduce((sum, modId) => {
      const mod = MODIFICATION_OPTIONS.find((m) => m.id === modId);
      return sum + (mod?.price || 0);
    }, 0);
    basePrice += Object.entries(accentOptions)
      .filter(([_, enabled]) => enabled)
      .reduce((sum, [accentId]) => {
        const accent = ACCENT_OPTIONS.find((a) => a.id === accentId);
        return sum + (accent?.price || 0);
      }, 0);
    return basePrice;
  }, [
    selectedCar,
    selectedWheel,
    selectedColor,
    selectedFinish,
    selectedMods,
    accentOptions,
    wheelSpec,
  ]);

  const formatPrice = (price: number) => {
    const inK = price / 1000;
    const rounded = Number.isInteger(inK)
      ? String(inK)
      : inK.toFixed(1).replace(/\.0$/, '');
    const currencySymbol = isZh ? '¥' : '$';
    return `${currencySymbol}${rounded}k`;
  };

  const selectedWheelColor =
    WHEEL_COLORS.find((item) => item.id === wheelSpec.colorId) ??
    WHEEL_COLORS[0];
  const selectedConcavity =
    WHEEL_CONCAVITY_OPTIONS.find((item) => item.id === wheelSpec.concavity) ??
    WHEEL_CONCAVITY_OPTIONS[1];
  const wheelSpecExtraCost =
    (WHEEL_SIZE_EXTRA_COST[wheelSpec.size] ?? 0) +
    selectedWheelColor.extraCost +
    selectedConcavity.extraCost;
  const canUndo = historyState.index > 0;
  const canRedo =
    historyState.index >= 0 &&
    historyState.index < historyState.entries.length - 1;
  const carBrands = useMemo(
    () => ['all', ...Array.from(new Set(CHINESE_CAR_MODELS.map((car) => car.brand)))],
    []
  );
  const filteredCars = useMemo(() => {
    const keyword = carSearch.trim().toLowerCase();

    return CHINESE_CAR_MODELS.filter((car) => {
      const matchesBrand =
        activeBrandFilter === 'all' || car.brand === activeBrandFilter;
      const matchesSearch =
        keyword.length === 0 ||
        `${car.name} ${car.nameZh} ${car.brand} ${car.type}`
          .toLowerCase()
          .includes(keyword);

      return matchesBrand && matchesSearch;
    });
  }, [activeBrandFilter, carSearch]);
  const visibleCars = showAllCars ? filteredCars : filteredCars.slice(0, 6);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#131022] font-[family-name:var(--font-sans)] text-white">
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(71,37,244,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(71,37,244,0.05)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,black_45%,transparent_100%)] bg-[size:100px_100px]" />
        <div className="absolute -top-20 -left-16 h-[420px] w-[420px] rounded-full bg-[#4725f4]/18 blur-[110px]" />
        <div className="absolute -right-16 -bottom-24 h-[520px] w-[520px] rounded-full bg-[#7c5cff]/16 blur-[130px]" />
      </div>
      <AnimatePresence>
        {showCustomInput && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#131022]/80 p-4 backdrop-blur-sm sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto shadow-2xl"
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
            {/* Center - Car Preview */}
            <motion.div
              className="space-y-6 lg:col-span-8"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="overflow-hidden border-white/10 bg-[#1c1833]/90 shadow-xl">
                <CardHeader className="border-b border-white/10 bg-[linear-gradient(135deg,rgba(71,37,244,0.16),rgba(28,24,51,0.96))] p-5 sm:p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge className="border-0 bg-[#4725f4]/18 px-3 py-1 text-[11px] font-semibold text-[#c9bcff]">
                          {t('generateShowcase')}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-white/12 bg-white/[0.04] text-slate-200/85"
                        >
                          {selectedCar.brand}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-white/12 bg-white/[0.04] text-slate-200/85"
                        >
                          {selectedCar.type === 'sedan' ? t('sedan') : t('suv')}
                        </Badge>
                      </div>
                      <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                          {isZh ? selectedCar.nameZh : selectedCar.name}
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-200/85 sm:text-base">
                          {t('ultimateConfiguratorDescription')}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:min-w-[300px]">
                      <div className="rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3">
                        <p className="text-[11px] font-medium tracking-[0.18em] text-slate-300 uppercase">
                          {t('totalBuildCost')}
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-white">
                          {formatPrice(totalBuildCost)}
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3">
                        <p className="text-[11px] font-medium tracking-[0.18em] text-slate-300 uppercase">
                          {t('generationProgress')}
                        </p>
                        <p className="mt-2 text-sm font-medium text-slate-100">
                          {isGenerating
                            ? `${progress}%`
                            : getShotStatusLabel(
                                showcaseStates[activeShot].status || 'idle'
                              )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative">
                    {activeImage ? (
                      <motion.div
                        className="relative min-h-[360px] overflow-hidden bg-[#131022] sm:min-h-[420px] lg:min-h-[520px] xl:min-h-[560px]"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <img
                          src={selectedCar.localImage}
                          alt={`${isZh ? selectedCar.nameZh : selectedCar.name} before`}
                          className="absolute inset-0 h-full w-full object-cover"
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
                          <div className="w-full p-6">
                            <h3 className="mb-2 line-clamp-2 max-w-full text-xl leading-tight font-semibold tracking-tight break-words">
                              {isZh ? selectedCar.nameZh : selectedCar.name}{' '}
                              {activeShot === 'panorama'
                                ? t('shotPanorama')
                                : t('shotCloseup')}
                            </h3>
                            <p className="mb-4 line-clamp-3 max-w-full text-sm leading-relaxed break-words text-slate-200/85">
                              {activeImage.prompt || prompt}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleDownloadImage(activeImage)}
                                disabled={downloadingImageId === activeImage.id}
                                className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
                              >
                                {downloadingImageId === activeImage.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    <Download className="mr-2 h-4 w-4" />
                                    {t('download')}
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={handleShare}
                                className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
                              >
                                <Share2 className="mr-2 h-4 w-4" />
                                {t('share')}
                              </Button>
                              {activeShot === 'panorama' && (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() =>
                                    setCompareMode((prev) => !prev)
                                  }
                                  className="bg-white/10 backdrop-blur-sm hover:bg-white/20"
                                >
                                  {compareMode ? (
                                    <>
                                      <EyeOff className="mr-2 h-4 w-4" />
                                      {t('hideCompare')}
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="mr-2 h-4 w-4" />
                                      {t('compare')}
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        {activeShot === 'panorama' && compareMode && (
                          <div className="absolute bottom-4 left-1/2 w-[75%] -translate-x-1/2 rounded-lg border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-md">
                            <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
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
                        className="relative flex min-h-[360px] items-center justify-center overflow-hidden bg-[#131022] sm:min-h-[420px] lg:min-h-[520px] xl:min-h-[560px]"
                        whileHover={{ scale: 1.02 }}
                      >
                        <img
                          src={selectedCar.localImage}
                          alt={isZh ? selectedCar.nameZh : selectedCar.name}
                          className="h-full w-full object-cover opacity-70 transition-opacity duration-300 hover:opacity-90"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=450&fit=crop';
                          }}
                        />
                        <div className="absolute bottom-4 left-4 max-w-[85%] rounded-lg bg-black/45 px-4 py-2 backdrop-blur-sm">
                          <span className="line-clamp-2 text-sm leading-snug font-medium break-words">
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
                              <div className="mt-1 text-[11px] text-slate-300">
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

              <Card className="overflow-hidden border-white/10 bg-[#1c1833]/90 shadow-lg">
                <CardHeader className="border-b border-white/10 bg-[#1c1833]/90 p-5">
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    {t('presetPacksTitle')}
                  </CardTitle>
                  <p className="mt-1 text-sm leading-relaxed text-slate-200/85">
                    {t('presetPacksDesc')}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 p-5">
                  <div className="space-y-2">
                    <p className="text-xs tracking-wider text-slate-300 uppercase">
                      {t('recommendedForThisCar')}
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
                      {recommendedPresets.map((preset) => (
                        <Button
                          key={preset.id}
                          variant={
                            activePresetId === preset.id
                              ? 'default'
                              : 'secondary'
                          }
                          className={`h-auto justify-start px-3 py-3 ${
                            activePresetId === preset.id
                              ? 'bg-gradient-to-r from-[#4725f4] to-[#7c5cff] text-white'
                              : 'border border-white/10 bg-[#1c1833]/90'
                          }`}
                          onClick={() => applyPreset(preset)}
                        >
                          <div className="min-w-0 text-left">
                            <div className="line-clamp-1 text-sm font-semibold break-words">
                              {isZh ? preset.nameZh : preset.name}
                            </div>
                            <div className="line-clamp-2 text-xs leading-relaxed break-words opacity-80">
                              {isZh ? preset.descriptionZh : preset.description}
                            </div>
                          </div>
                        </Button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs tracking-wider text-slate-300 uppercase">
                      {t('allPacks')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {PRESET_PACKS.map((preset) => (
                        <Button
                          key={preset.id}
                          size="sm"
                          variant={
                            activePresetId === preset.id ? 'default' : 'outline'
                          }
                          className={
                            activePresetId === preset.id
                              ? 'bg-[#4725f4] text-white'
                              : ''
                          }
                          onClick={() => applyPreset(preset)}
                        >
                          <WandSparkles className="mr-1.5 h-3.5 w-3.5" />
                          {isZh ? preset.nameZh : preset.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Car Selection */}
              <div className="rounded-3xl border border-white/10 bg-[#1c1833]/92 p-5 shadow-[0_20px_50px_-34px_rgba(0,0,0,0.9)] sm:p-6">
                <div className="mb-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                      <p className="text-[11px] font-medium tracking-[0.18em] text-slate-300 uppercase">
                        Vehicle Catalog
                      </p>
                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
                        {t('selectCarModel')}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-200/80">
                        {isZh
                          ? '按品牌和关键词筛选车型，然后继续做轮毂、漆面和套件配置。'
                          : 'Filter by brand and keyword, then continue with wheels, paint, and aero setup.'}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="w-fit border-white/10 bg-white/[0.04] text-slate-300"
                    >
                      {filteredCars.length} {t('carModelsCount')}
                    </Badge>
                  </div>

                  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
                    <div className="relative">
                      <Search className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-300" />
                      <input
                        value={carSearch}
                        onChange={(event) => {
                          setCarSearch(event.target.value);
                          setShowAllCars(false);
                        }}
                        placeholder={
                          isZh
                            ? '搜索车型、品牌，例如 Honda、Supra、BMW'
                            : 'Search model or brand, e.g. Honda, Supra, BMW'
                        }
                        className="h-12 w-full rounded-2xl border border-white/10 bg-white/[0.04] pr-12 pl-11 text-sm text-white outline-none transition-colors placeholder:text-slate-400 focus:border-[#4725f4]/50"
                      />
                      {carSearch && (
                        <button
                          type="button"
                          onClick={() => setCarSearch('')}
                          className="absolute top-1/2 right-3 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                          aria-label={isZh ? '清除搜索' : 'Clear search'}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      className="min-h-12 border border-white/10 bg-white/[0.04] px-4 text-slate-100 hover:bg-white/[0.08]"
                      onClick={() => setShowCustomInput(true)}
                    >
                      <span className="mr-2 text-lg leading-none">+</span>
                      {t('customCar')}
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {carBrands.map((brand) => {
                      const isActive = activeBrandFilter === brand;
                      return (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => {
                            setActiveBrandFilter(brand);
                            setShowAllCars(false);
                          }}
                          className={`rounded-full border px-4 py-2 text-xs font-medium transition-colors ${
                            isActive
                              ? 'border-[#4725f4]/40 bg-[#4725f4]/12 text-white'
                              : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:text-white'
                          }`}
                        >
                          {brand === 'all'
                            ? isZh
                              ? '全部品牌'
                              : 'All Brands'
                            : brand}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {/* 自定义车型按钮 */}
                  <motion.div
                    className="relative cursor-pointer overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/[0.03] transition-all hover:border-[#4725f4]"
                    onClick={() => setShowCustomInput(true)}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="flex aspect-[16/10] flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_top,rgba(71,37,244,0.22),rgba(255,255,255,0.03)_55%,rgba(0,0,0,0.06))]">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                        <span className="text-2xl font-light text-slate-300">
                          +
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-200">
                        {t('customCar')}
                      </p>
                    </div>
                    <div className="border-t border-white/10 bg-[#1c1833]/90 p-4">
                      <p className="mb-1 text-xs text-slate-400">
                        {t('custom')}
                      </p>
                      <p className="line-clamp-2 text-sm leading-snug font-medium break-words text-white">
                        {t('inputYourCar')}
                      </p>
                      <p className="mt-2 line-clamp-1 text-xs text-[#b7a8ff]">
                        {t('freeTrial')}
                      </p>
                    </div>
                  </motion.div>

                  {visibleCars.map((car) => (
                    <motion.div
                      key={car.id}
                      className={`relative cursor-pointer overflow-hidden rounded-2xl border transition-all ${
                        selectedCar.id === car.id
                          ? 'border-[#4725f4] bg-[#4725f4]/10 shadow-[0_0_20px_rgba(99,102,241,0.22)]'
                          : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                      }`}
                      onClick={() => {
                        setActivePresetId(null);
                        setSelectedCar(car);
                      }}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-[#1c1833]/90">
                        <motion.img
                          src={car.image}
                          alt={isZh ? car.nameZh : car.name}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=200&h=150&fit=crop';
                          }}
                          whileHover={{ scale: 1.06 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#131022]/88 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3">
                          <Badge className="border-0 bg-black/35 text-[10px] text-white backdrop-blur-sm">
                            {car.brand}
                          </Badge>
                        </div>
                        {selectedCar.id === car.id && (
                          <motion.div
                            className="absolute inset-0 flex items-center justify-center bg-[#4725f4]/20 backdrop-blur-sm"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CircleCheckBig className="h-7 w-7 text-[#4725f4]" />
                          </motion.div>
                        )}
                      </div>
                      <div className="border-t border-white/10 bg-[#1c1833]/90 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm leading-snug font-medium break-words text-white">
                              {isZh ? car.nameZh : car.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              {car.type}
                            </p>
                          </div>
                          <span className="shrink-0 text-xs font-medium text-[#b7a8ff]">
                            {formatPrice(car.price)}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-300">
                          <span>{car.brand}</span>
                          <span>
                            {car.type === 'sedan'
                              ? t('sedan')
                              : car.type === 'suv'
                                ? t('suv')
                                : car.type}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {filteredCars.length === 0 && (
                  <div className="mt-4 rounded-2xl border border-dashed border-white/12 bg-white/[0.03] px-4 py-10 text-center">
                    <p className="text-sm font-medium text-white">
                      {isZh ? '没有匹配的车型' : 'No matching vehicles'}
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-slate-300">
                      {isZh
                        ? '试试切换品牌筛选，或者搜索其他品牌/车型关键词。'
                        : 'Try another brand filter or search keyword.'}
                    </p>
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-slate-300">
                    {isZh
                      ? `当前显示 ${visibleCars.length} / ${filteredCars.length} 辆车型`
                      : `Showing ${visibleCars.length} of ${filteredCars.length} vehicles`}
                  </p>
                  {filteredCars.length > 6 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllCars(!showAllCars)}
                      className="min-h-11 max-w-full break-words text-center text-slate-300 hover:bg-white/10 hover:text-white"
                    >
                      {showAllCars ? (
                        <>
                          <ChevronUp className="mr-2 h-4 w-4" />
                          {t('collapse')}
                        </>
                      ) : (
                        <>
                          <ChevronDown className="mr-2 h-4 w-4" />
                          {t('viewAll')} {filteredCars.length} {t('carModelsCount')}
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              {/* Generation Progress */}
              {isGenerating && (
                <Card className="border-white/10 bg-[#1c1833]/90 shadow-lg">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CardContent className="space-y-4 p-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">
                          {t('generationProgress')}
                        </span>
                        <span className="font-medium text-[#4725f4]">
                          {progress}%
                        </span>
                      </div>
                      <Progress
                        value={progress}
                        className="bg-border h-3 overflow-hidden rounded-full"
                      >
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-[#4725f4] to-[#7c5cff]"
                          style={{ width: `${progress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5, ease: 'easeOut' }}
                        />
                      </Progress>
                      <motion.div
                        className="space-y-1 text-xs text-slate-300"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {SHOT_TYPES.map((shotType) => (
                          <p
                            key={shotType}
                            className="flex items-center justify-between"
                          >
                            <span>
                              {shotType === 'panorama'
                                ? t('shotPanorama')
                                : t('shotCloseup')}
                            </span>
                            <span>
                              {getShotStatusLabel(
                                showcaseStates[shotType].status
                              )}
                            </span>
                          </p>
                        ))}
                      </motion.div>
                      <div className="mt-2 flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            resetTaskState();
                            setShowcaseStates(getInitialShowcaseStates());
                          }}
                          className="text-slate-300 hover:text-white"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
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
              className="space-y-6 lg:sticky lg:top-24 lg:col-span-4 lg:self-start"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="space-y-6">
                <motion.div
                  className="rounded-3xl border border-white/10 bg-[#1c1833]/92 p-6 shadow-[0_24px_60px_-36px_rgba(0,0,0,0.95)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45 }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-medium tracking-[0.18em] text-slate-300 uppercase">
                        {t('configDetails')}
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                        {isZh ? selectedCar.nameZh : selectedCar.name}
                      </h2>
                    </div>
                    <Badge className="border-0 bg-[#4725f4]/16 text-[#d4cbff]">
                      {selectedCar.brand}
                    </Badge>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3">
                      <p className="text-[11px] font-medium tracking-[0.14em] text-slate-300 uppercase">
                        {t('basePrice')}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">
                        {formatPrice(selectedCar.price)}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/12 bg-white/[0.05] px-4 py-3">
                      <p className="text-[11px] font-medium tracking-[0.14em] text-slate-300 uppercase">
                        {t('modCost')}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-[#b7a8ff]">
                        +{formatPrice(totalBuildCost - selectedCar.price)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 text-sm">
                      <span className="text-slate-300">{t('wheels')}</span>
                      <span className="text-white">
                        {isZh ? selectedWheel.nameZh : selectedWheel.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 text-sm">
                      <span className="text-slate-300">{t('paint')}</span>
                      <span className="text-white">
                        {isZh ? selectedColor.nameZh : selectedColor.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-white/10 pb-3 text-sm">
                      <span className="text-slate-300">{t('spec')}</span>
                      <span className="text-white">
                        {wheelSpec.size}" / {wheelSpec.spokeCount}
                        {t('spokeUnit')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-300">
                        {t('totalBuildCost')}
                      </span>
                      <span className="text-lg font-semibold text-white">
                        {formatPrice(totalBuildCost)}
                      </span>
                    </div>
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={!canUndo}
                      onClick={handleUndo}
                      className="min-h-11 border border-white/12 bg-white/[0.05] text-slate-100 hover:bg-white/[0.08]"
                    >
                      <Undo2 className="mr-2 h-4 w-4" />
                      {t('undo')}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={!canRedo}
                      onClick={handleRedo}
                      className="min-h-11 border border-white/12 bg-white/[0.05] text-slate-100 hover:bg-white/[0.08]"
                    >
                      <Redo2 className="mr-2 h-4 w-4" />
                      {t('redo')}
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  className="rounded-3xl border border-white/10 bg-[#1c1833]/92 p-4 shadow-[0_20px_50px_-34px_rgba(0,0,0,0.9)]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-medium tracking-[0.18em] text-slate-300 uppercase">
                        Configurator
                      </p>
                      <h3 className="mt-2 text-xl font-semibold tracking-tight text-white">
                        Build Controls
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate-200/80">
                        Tune paint, stance, aero, and final details without
                        leaving the preview.
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="border-white/12 bg-white/[0.04] text-slate-200/85"
                    >
                      {activeTab === 'paint'
                        ? t('paint')
                        : activeTab === 'wheels'
                          ? t('wheels')
                          : activeTab === 'mods'
                            ? t('modifications_')
                            : t('accentsDetail')}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {[
                      {
                        id: 'paint',
                        icon: ImageIcon,
                        title: t('paint'),
                        summary: `${isZh ? selectedColor.nameZh : selectedColor.name} · ${isZh ? selectedFinish.nameZh : selectedFinish.name}`,
                      },
                      {
                        id: 'wheels',
                        icon: CircleDashed,
                        title: t('wheels'),
                        summary: `${isZh ? selectedWheel.nameZh : selectedWheel.name} · ${wheelSpec.size}"`,
                      },
                      {
                        id: 'mods',
                        icon: Sparkles,
                        title: t('modifications_'),
                        summary:
                          selectedMods.length > 0
                            ? `${selectedMods.length} ${t('modifications_')}`
                            : t('performanceStylingDesc'),
                      },
                      {
                        id: 'accents',
                        icon: WandSparkles,
                        title: t('accentsDetail'),
                        summary:
                          Object.values(accentOptions).filter(Boolean).length >
                          0
                            ? `${Object.values(accentOptions).filter(Boolean).length} ${t('accentsDetail')}`
                            : t('accentDetailsDesc'),
                      },
                    ].map((section) => {
                      const Icon = section.icon;
                      const isOpen = activeTab === section.id;

                      return (
                        <div
                          key={section.id}
                          className={`overflow-hidden rounded-2xl border transition-all ${
                            isOpen
                              ? 'border-[#4725f4]/40 bg-[linear-gradient(180deg,rgba(71,37,244,0.12),rgba(255,255,255,0.02))]'
                              : 'border-white/10 bg-white/[0.03]'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setActiveTab(section.id)}
                            className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-white/[0.03]"
                          >
                            <div className="flex min-w-0 items-center gap-3">
                              <div
                                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                                  isOpen
                                    ? 'bg-[#4725f4]/18 text-[#c8bbff]'
                                    : 'bg-white/[0.05] text-slate-200/85'
                                }`}
                              >
                                <Icon className="h-5 w-5" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-white">
                                  {section.title}
                                </p>
                                <p className="line-clamp-1 text-xs text-slate-300">
                                  {section.summary}
                                </p>
                              </div>
                            </div>
                            {isOpen ? (
                              <ChevronUp className="h-4 w-4 text-slate-300" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-300" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="border-t border-white/10 px-4 py-5">
                              {section.id === 'paint' && (
                                <div className="space-y-8">
                                  <div className="overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(135deg,rgba(71,37,244,0.14),rgba(255,255,255,0.03))]">
                                    <div className="grid gap-0 md:grid-cols-[1.15fr_0.85fr]">
                                      <div className="p-5">
                                        <p className="text-[11px] font-medium tracking-[0.18em] text-slate-300 uppercase">
                                          Paint Direction
                                        </p>
                                        <h4 className="mt-3 text-xl font-semibold tracking-tight text-white">
                                          {isZh ? selectedColor.nameZh : selectedColor.name}
                                        </h4>
                                        <p className="mt-1 text-sm text-slate-200/85">
                                          {isZh ? selectedFinish.nameZh : selectedFinish.name}
                                          {selectedFinish.price > 0
                                            ? ` · +${formatPrice(selectedFinish.price)}`
                                            : ''}
                                        </p>
                                        <p className="mt-3 text-xs leading-relaxed text-slate-300">
                                          {isZh ? selectedColor.descriptionZh : selectedColor.description}
                                        </p>
                                      </div>
                                      <div className="border-t border-white/10 md:border-t-0 md:border-l">
                                        <div
                                          className="h-full min-h-[180px] w-full"
                                          style={getColorCardStyle(
                                            selectedColor.color,
                                            selectedFinish.id
                                          )}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                      <h4 className="text-sm font-medium tracking-wider text-slate-300 uppercase">
                                        {t('finishType')}
                                      </h4>
                                      <span className="text-xs text-slate-300">
                                        {isZh
                                          ? selectedFinish.nameZh
                                          : selectedFinish.name}
                                      </span>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                      {FINISH_TYPES.map((finish) => (
                                        <motion.button
                                          key={finish.id}
                                          className={`overflow-hidden rounded-2xl border text-left transition-all ${
                                            selectedFinish.id === finish.id
                                              ? 'border-[#4725f4]/45 bg-[#4725f4]/10 text-white shadow-[0_0_15px_rgba(99,102,241,0.18)]'
                                              : 'border-white/10 bg-white/[0.04] text-white hover:border-[#4725f4]/40'
                                          }`}
                                          onClick={() => {
                                            setActivePresetId(null);
                                            setSelectedFinish(finish);
                                          }}
                                          whileHover={{ scale: 1.03, y: -2 }}
                                          whileTap={{ scale: 0.97 }}
                                        >
                                          <div
                                            className="h-24 w-full border-b border-white/10"
                                            style={getFinishPreviewStyle(
                                              finish.id,
                                              selectedColor.color
                                            )}
                                          />
                                          <div className="flex items-start justify-between gap-3 p-4">
                                            <div>
                                              <p className="text-sm font-semibold text-white">
                                                {isZh ? finish.nameZh : finish.name}
                                              </p>
                                              <p className="mt-1 text-xs leading-relaxed text-slate-300">
                                                {isZh ? finish.descriptionZh : finish.description}
                                              </p>
                                            </div>
                                            {finish.price > 0 && (
                                              <span className="shrink-0 text-xs font-medium text-[#c9bcff]">
                                                +{formatPrice(finish.price)}
                                              </span>
                                            )}
                                          </div>
                                        </motion.button>
                                      ))}
                                    </div>
                                  </div>

                                  <div>
                                    <div className="mb-4 flex items-center justify-between gap-3">
                                      <h4 className="text-sm font-medium tracking-wider text-slate-300 uppercase">
                                        {t('manufacturerColors')}
                                      </h4>
                                      <div className="flex items-center gap-2 text-xs text-slate-300">
                                        <span
                                          className="h-3 w-3 rounded-full border border-white/20"
                                          style={{
                                            backgroundColor:
                                              selectedColor.color,
                                          }}
                                        />
                                        <span>
                                          {isZh
                                            ? selectedColor.nameZh
                                            : selectedColor.name}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                      {PAINT_COLORS.map((color) => (
                                        <motion.button
                                          key={color.id}
                                          type="button"
                                          className={`group relative overflow-hidden rounded-2xl border text-left ${
                                            selectedColor.id === color.id
                                              ? 'border-[#4725f4]/45 bg-[#4725f4]/10'
                                              : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                                          }`}
                                          onClick={() => {
                                            setActivePresetId(null);
                                            setSelectedColor(color);
                                          }}
                                          whileHover={{ y: -3 }}
                                          whileTap={{ scale: 0.95 }}
                                        >
                                          <div
                                            className="h-20 w-full border-b border-white/10"
                                            style={getColorCardStyle(
                                              color.color,
                                              selectedFinish.id
                                            )}
                                          />
                                          <div className="p-3">
                                            <div className="flex items-center justify-between gap-2">
                                              <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-white">
                                                  {isZh ? color.nameZh : color.name}
                                                </p>
                                                <p className="mt-0.5 truncate text-[11px] text-slate-300">
                                                  {color.id}
                                                </p>
                                              </div>
                                              <span
                                                className="h-3.5 w-3.5 shrink-0 rounded-full border border-white/20"
                                                style={{ backgroundColor: color.color }}
                                              />
                                            </div>
                                            {color.price > 0 && (
                                              <p className="mt-2 text-xs font-medium text-[#c9bcff]">
                                                +{formatPrice(color.price)}
                                              </p>
                                            )}
                                          </div>
                                          {selectedColor.id === color.id && (
                                            <div className="pointer-events-none absolute top-3 right-3 rounded-full bg-[#4725f4] p-1 text-white shadow-[0_0_16px_rgba(71,37,244,0.5)]">
                                              <Check className="h-3 w-3" />
                                            </div>
                                          )}
                                        </motion.button>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {section.id === 'wheels' && (
                                <div className="space-y-5">
                                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                    <div className="flex items-start gap-4">
                                      <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#141122]">
                                        <img
                                          src={getWheelThumbnail(
                                            selectedWheel.id
                                          )}
                                          alt={
                                            isZh
                                              ? selectedWheel.nameZh
                                              : selectedWheel.name
                                          }
                                          className="h-full w-full object-cover"
                                          loading="lazy"
                                          onError={(e) => {
                                            e.currentTarget.src =
                                              selectedCar.localImage;
                                          }}
                                        />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-semibold text-white">
                                          {isZh
                                            ? selectedWheel.nameZh
                                            : selectedWheel.name}
                                        </p>
                                        <p className="mt-1 text-xs leading-relaxed text-slate-300">
                                          {isZh
                                            ? selectedWheel.descriptionZh
                                            : selectedWheel.description}
                                        </p>
                                        <div className="mt-3 flex items-center justify-between gap-3">
                                          <div className="text-xs text-slate-300">
                                            {wheelSpec.size}" ·{' '}
                                            {wheelSpec.spokeCount}
                                            {t('spokeUnit')}
                                          </div>
                                          <span className="text-sm font-semibold text-[#b7a8ff]">
                                            +{formatPrice(selectedWheel.price)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="grid max-h-[320px] grid-cols-1 gap-3 overflow-y-auto pr-1">
                                    {WHEEL_STYLES.map((wheel) => (
                                      <motion.div
                                        key={wheel.id}
                                        className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                                          selectedWheel.id === wheel.id
                                            ? 'border-[#4725f4] bg-[#4725f4]/10 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                            : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                                        }`}
                                        onClick={() =>
                                          handleWheelStyleSelect(wheel)
                                        }
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                      >
                                        <div className="flex items-start gap-4">
                                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#141122]">
                                            <img
                                              src={getWheelThumbnail(wheel.id)}
                                              alt={
                                                isZh ? wheel.nameZh : wheel.name
                                              }
                                              className="h-full w-full object-cover"
                                              loading="lazy"
                                              onError={(e) => {
                                                e.currentTarget.src =
                                                  selectedCar.localImage;
                                              }}
                                            />
                                          </div>
                                          <div className="min-w-0 flex-1">
                                            <div className="mb-1 flex items-center justify-between gap-2">
                                              <h4 className="line-clamp-1 min-w-0 text-sm font-semibold break-words text-white">
                                                {isZh
                                                  ? wheel.nameZh
                                                  : wheel.name}
                                              </h4>
                                              <span className="shrink-0 text-xs font-medium text-[#b7a8ff]">
                                                +{formatPrice(wheel.price)}
                                              </span>
                                            </div>
                                            <p className="line-clamp-2 text-xs leading-relaxed break-words text-slate-300">
                                              {isZh
                                                ? wheel.descriptionZh
                                                : wheel.description}
                                            </p>
                                          </div>
                                        </div>
                                      </motion.div>
                                    ))}
                                  </div>

                                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        setShowAdvancedWheels((prev) => !prev)
                                      }
                                      className="min-h-11 w-full justify-between px-0 text-slate-100 hover:bg-transparent"
                                    >
                                      <span className="pr-2 text-left text-sm leading-snug">
                                        {t('advancedWheelSpec')}
                                      </span>
                                      {showAdvancedWheels ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </Button>
                                    {showAdvancedWheels && (
                                      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <div className="space-y-1">
                                          <p className="text-xs text-slate-300">
                                            {t('wheelSize')}
                                          </p>
                                          <Select
                                            value={String(wheelSpec.size)}
                                            onValueChange={(value) =>
                                              updateWheelSpec({
                                                size: Number(value),
                                              })
                                            }
                                          >
                                            <SelectTrigger className="w-full">
                                              <SelectValue
                                                placeholder={t('selectSize')}
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {WHEEL_SIZES.map((size) => (
                                                <SelectItem
                                                  key={size}
                                                  value={String(size)}
                                                >
                                                  {size}" (
                                                  {WHEEL_SIZE_EXTRA_COST[size] >
                                                  0
                                                    ? `+${formatPrice(WHEEL_SIZE_EXTRA_COST[size])}`
                                                    : t('base')}
                                                  )
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-xs text-slate-300">
                                            {t('wheelSpokes')}
                                          </p>
                                          <Select
                                            value={String(wheelSpec.spokeCount)}
                                            onValueChange={(value) =>
                                              updateWheelSpec({
                                                spokeCount: Number(value),
                                              })
                                            }
                                          >
                                            <SelectTrigger className="w-full">
                                              <SelectValue
                                                placeholder={t('selectSpokes')}
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {SPOKE_COUNTS.map((count) => (
                                                <SelectItem
                                                  key={count}
                                                  value={String(count)}
                                                >
                                                  {count} {t('spokeUnit')}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-xs text-slate-300">
                                            {t('wheelColor')}
                                          </p>
                                          <Select
                                            value={wheelSpec.colorId}
                                            onValueChange={(value) =>
                                              updateWheelSpec({
                                                colorId: value,
                                              })
                                            }
                                          >
                                            <SelectTrigger className="w-full">
                                              <SelectValue
                                                placeholder={t('selectColor')}
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {WHEEL_COLORS.map((color) => (
                                                <SelectItem
                                                  key={color.id}
                                                  value={color.id}
                                                >
                                                  {isZh
                                                    ? color.nameZh
                                                    : color.name}{' '}
                                                  {color.extraCost > 0
                                                    ? `(+${formatPrice(color.extraCost)})`
                                                    : ''}
                                                </SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-1">
                                          <p className="text-xs text-slate-300">
                                            {t('wheelConcavity')}
                                          </p>
                                          <Select
                                            value={wheelSpec.concavity}
                                            onValueChange={(value) =>
                                              updateWheelSpec({
                                                concavity:
                                                  value as WheelConcavity,
                                              })
                                            }
                                          >
                                            <SelectTrigger className="w-full">
                                              <SelectValue
                                                placeholder={t(
                                                  'selectConcavity'
                                                )}
                                              />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {WHEEL_CONCAVITY_OPTIONS.map(
                                                (item) => (
                                                  <SelectItem
                                                    key={item.id}
                                                    value={item.id}
                                                  >
                                                    {isZh
                                                      ? item.nameZh
                                                      : item.name}{' '}
                                                    {item.extraCost > 0
                                                      ? `(+${formatPrice(item.extraCost)})`
                                                      : ''}
                                                  </SelectItem>
                                                )
                                              )}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}

                              {section.id === 'mods' && (
                                <div className="grid grid-cols-1 gap-3">
                                  {MODIFICATION_OPTIONS.map((mod) => (
                                    <motion.button
                                      key={mod.id}
                                      type="button"
                                      className={`flex items-start justify-between gap-3 rounded-2xl border p-4 text-left transition-all ${
                                        selectedMods.includes(mod.id)
                                          ? 'border-[#4725f4]/45 bg-[#4725f4]/10'
                                          : 'border-white/10 bg-white/[0.03] hover:border-white/20'
                                      }`}
                                      onClick={() => toggleMod(mod.id)}
                                      whileHover={{ y: -2 }}
                                      whileTap={{ scale: 0.99 }}
                                    >
                                      <div className="flex min-w-0 gap-4">
                                        <div className="relative h-18 w-18 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-[#141122]">
                                          <img
                                            src={getModThumbnail(mod.id)}
                                            alt={isZh ? mod.nameZh : mod.name}
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                            onError={(e) => {
                                              e.currentTarget.src =
                                                selectedCar.localImage;
                                            }}
                                          />
                                        </div>
                                        <div className="min-w-0">
                                          <div className="flex items-center gap-2">
                                            <div
                                              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                                                selectedMods.includes(mod.id)
                                                  ? 'border-[#4725f4] bg-[#4725f4] text-white'
                                                  : 'border-white/15 text-transparent'
                                              }`}
                                            >
                                              <Check className="h-3 w-3" />
                                            </div>
                                            <p className="text-sm leading-snug font-medium break-words text-white">
                                              {isZh ? mod.nameZh : mod.name}
                                            </p>
                                          </div>
                                          <p className="mt-2 text-xs leading-relaxed break-words text-slate-300">
                                            {isZh
                                              ? mod.descriptionZh
                                              : mod.description}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="shrink-0 text-sm font-medium text-[#b7a8ff]">
                                        +{formatPrice(mod.price)}
                                      </span>
                                    </motion.button>
                                  ))}
                                </div>
                              )}

                              {section.id === 'accents' && (
                                <div className="grid grid-cols-1 gap-3">
                                  {ACCENT_OPTIONS.map((accent) => (
                                    <div
                                      key={accent.id}
                                      className="flex items-start justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                                    >
                                      <div className="min-w-0">
                                        <p className="text-sm leading-snug font-medium break-words text-white">
                                          {isZh ? accent.nameZh : accent.name}
                                        </p>
                                        <p className="mt-1 text-xs leading-relaxed break-words text-slate-300">
                                          {isZh
                                            ? accent.descriptionZh
                                            : accent.description}
                                        </p>
                                      </div>
                                      <div className="flex shrink-0 items-center gap-3">
                                        <span className="text-sm font-medium text-[#b7a8ff]">
                                          +{formatPrice(accent.price)}
                                        </span>
                                        <Switch
                                          checked={accentOptions[accent.id]}
                                          onCheckedChange={() =>
                                            toggleAccent(accent.id)
                                          }
                                          className="data-[state=checked]:bg-[#4725f4]"
                                        />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                <Card className="overflow-hidden border-white/10 bg-[#1c1833]/90 shadow-lg">
                  <CardHeader className="border-b border-white/10 bg-[#1c1833]/90 p-5">
                    <CardTitle className="text-base font-semibold">
                      {t('recentConfigsTitle')}
                    </CardTitle>
                    <p className="text-xs leading-relaxed text-slate-200/85">
                      {t('recentConfigsDesc')}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-2 p-5">
                    <Select
                      value={
                        historyState.index >= 0
                          ? String(historyState.index)
                          : undefined
                      }
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
                          <SelectItem
                            key={`${entry.selectedCar.id}-${idx}`}
                            value={String(idx)}
                          >
                            {isZh
                              ? entry.selectedCar.nameZh
                              : entry.selectedCar.name}{' '}
                            · {entry.wheelSpec.size}" ·{' '}
                            {idx === historyState.index
                              ? t('current')
                              : `${t('step')} ${idx + 1}`}
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
                      className="min-h-[52px] w-full bg-gradient-to-r from-[#4725f4] to-[#7c5cff] py-5 text-base font-bold text-white shadow-[0_0_24px_rgba(99,102,241,0.35)] transition-all duration-300 hover:from-[#361bb8] hover:to-[#5b2de1]"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                          {t('generating')}
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-3 h-5 w-5" />
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
                        className="min-h-11 w-full border border-white/10 bg-[#1c1833]/90 py-3 text-center font-medium break-words text-slate-100 transition-all duration-300 hover:bg-white/10"
                        onClick={handleShare}
                      >
                        <Share2 className="mr-2 h-4 w-4" />
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
                        className="min-h-11 w-full border border-white/10 bg-[#1c1833]/90 py-3 text-center font-medium break-words text-slate-100 transition-all duration-300 hover:bg-white/10"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        {t('quote')}
                      </Button>
                    </motion.div>
                  </div>
                  <motion.div
                    className="mt-2 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <p className="mx-auto max-w-[260px] text-xs leading-relaxed text-slate-300 sm:max-w-none">
                      {t('creditsRequired', { credits: costCredits })}
                      {user &&
                        ` ${t('remaining', { credits: remainingCredits })}`}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
          <div className="mt-10 rounded-xl border border-white/10 bg-[#1c1833]/70 p-4 text-xs leading-relaxed text-slate-300">
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
