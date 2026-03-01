'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
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
} from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { AIMediaType, AITaskStatus } from '@/extensions/ai/types';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { Switch } from '@/shared/components/ui/switch';
import { useAppContext } from '@/shared/contexts/app';
import { LazyImage } from '@/shared/blocks/common';
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

const WHEEL_STYLES = [
  { id: 'stock', name: 'Stock Wheels', nameZh: '原厂轮毂', description: 'Keep original factory wheels', descriptionZh: '保持原厂轮毂样式', price: 0 },
  { id: 'sport', name: 'Sport Wheels', nameZh: '运动轮毂', description: 'Multi-spoke sport style', descriptionZh: '多辐条运动风格', price: 8000 },
  { id: 'luxury', name: 'Luxury Wheels', nameZh: '豪华轮毂', description: 'Large size luxury style', descriptionZh: '大尺寸豪华风格', price: 12000 },
  { id: 'forged', name: 'Forged Wheels', nameZh: '锻造轮毂', description: 'Lightweight forged construction', descriptionZh: '轻量化锻造工艺', price: 18000 },
  { id: 'racing', name: 'Racing Wheels', nameZh: '赛道轮毂', description: 'Professional track style', descriptionZh: '专业赛道风格', price: 22000 },
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

interface GeneratedImage {
  id: string;
  url: string;
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

export default function CarModderConfigurator() {
  const t = useTranslations('pages.carmodder');
  const locale = useLocale();
  const isZh = locale === 'zh';

  const [selectedCar, setSelectedCar] = useState<CarModel>(CHINESE_CAR_MODELS[0]);
  const [selectedWheel, setSelectedWheel] = useState(WHEEL_STYLES[0]);
  const [selectedColor, setSelectedColor] = useState(PAINT_COLORS[0]);
  const [selectedFinish, setSelectedFinish] = useState(FINISH_TYPES[0]);
  const [selectedMods, setSelectedMods] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('paint');
  const [accentOptions, setAccentOptions] = useState<Record<string, boolean>>({
    'chrome-delete': false,
    'carbon-roof': false,
    'racing-stripes': false,
    'custom-badge': false,
  });

  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(null);
  const [taskStatus, setTaskStatus] = useState<AITaskStatus | null>(null);
  const [downloadingImageId, setDownloadingImageId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [testMode, setTestMode] = useState(false);
  const [showAllCars, setShowAllCars] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);

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
    setShowCustomInput(false);
    toast.success(t('carAdded'));
  }, [t]);

  const { user, isCheckSign, setIsShowSignModal, fetchUserCredits } = useAppContext();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const costCredits = 4;
  const remainingCredits = user?.credits?.remainingCredits ?? 0;

  const toggleMod = (modId: string) => {
    setSelectedMods((prev) =>
      prev.includes(modId) ? prev.filter((id) => id !== modId) : [...prev, modId]
    );
  };

  const toggleAccent = (accentId: string) => {
    setAccentOptions((prev) => ({
      ...prev,
      [accentId]: !prev[accentId],
    }));
  };

  const buildPrompt = useCallback(() => {
    const parts: string[] = [];

    parts.push(`${isZh ? selectedCar.nameZh : selectedCar.name} (${selectedCar.brand})`);
    parts.push(`${t('paint')}: ${isZh ? selectedColor.nameZh : selectedColor.name} (${isZh ? selectedFinish.nameZh : selectedFinish.name}${t('paintFinish')})`);
    parts.push(`${t('wheels')}: ${isZh ? selectedWheel.nameZh : selectedWheel.name}`);

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

    parts.push(t('promptSuffix'));

    return parts.join(', ');
  }, [selectedCar, selectedColor, selectedFinish, selectedWheel, selectedMods, accentOptions]);

  const prompt = useMemo(() => buildPrompt(), [buildPrompt]);

  const resetTaskState = useCallback(() => {
    setIsGenerating(false);
    setProgress(0);
    setTaskId(null);
    setGenerationStartTime(null);
    setTaskStatus(null);
  }, []);

  const pollTaskStatus = useCallback(
    async (id: string) => {
      try {
        if (generationStartTime && Date.now() - generationStartTime > GENERATION_TIMEOUT) {
          resetTaskState();
          toast.error(t('generationTimeout'));
          return true;
        }

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
        setTaskStatus(currentStatus);

        const parsedResult = parseTaskResult(task.taskInfo);
        const imageUrls = extractImageUrls(parsedResult);

        if (currentStatus === AITaskStatus.PENDING) {
          setProgress((prev) => Math.max(prev, 20));
          return false;
        }

        if (currentStatus === AITaskStatus.PROCESSING) {
          if (imageUrls.length > 0) {
            setGeneratedImages(
              imageUrls.map((url, index) => ({
                id: `${task.id}-${index}`,
                url,
                prompt: task.prompt ?? undefined,
              }))
            );
            setProgress((prev) => Math.max(prev, 85));
          } else {
            setProgress((prev) => Math.min(prev + 10, 80));
          }
          return false;
        }

        if (currentStatus === AITaskStatus.SUCCESS) {
          if (imageUrls.length === 0) {
            toast.error(t('generationFailed'));
          } else {
            setGeneratedImages(
              imageUrls.map((url, index) => ({
                id: `${task.id}-${index}`,
                url,
                prompt: task.prompt ?? undefined,
              }))
            );
            toast.success(t('generationComplete'));
          }
          setProgress(100);
          resetTaskState();
          return true;
        }

        if (currentStatus === AITaskStatus.FAILED) {
          const errorMessage = parsedResult?.errorMessage || t('generationFailed');
          toast.error(errorMessage);
          resetTaskState();
          fetchUserCredits();
          return true;
        }

        setProgress((prev) => Math.min(prev + 5, 95));
        return false;
      } catch (error: any) {
        console.error('轮询任务状态失败:', error);
        toast.error(`${t('queryFailed')}: ${error.message}`);
        resetTaskState();
        fetchUserCredits();
        return true;
      }
    },
    [generationStartTime, resetTaskState, fetchUserCredits]
  );

  useEffect(() => {
    if (!taskId || !isGenerating) return;

    let cancelled = false;
    const tick = async () => {
      if (!taskId) return;
      const completed = await pollTaskStatus(taskId);
      if (completed) cancelled = true;
    };

    tick();

    const interval = setInterval(async () => {
      if (cancelled || !taskId) {
        clearInterval(interval);
        return;
      }
      const completed = await pollTaskStatus(taskId);
      if (completed) clearInterval(interval);
    }, POLL_INTERVAL);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [taskId, isGenerating, pollTaskStatus]);

  const handleGenerate = async () => {
    if (!user && !testMode) {
      setIsShowSignModal(true);
      return;
    }

    if (remainingCredits < costCredits && !testMode) {
      toast.error(t('insufficientCredits'));
      return;
    }

    setIsGenerating(true);
    setProgress(15);
    setTaskStatus(AITaskStatus.PENDING);
    setGeneratedImages([]);
    setGenerationStartTime(Date.now());

    try {
      const urlRef = selectedCar.customInput?.imageUrl;
      const dataUrlRef = selectedCar.customInput?.imageDataUrl;

      const isValidQwenRef = (value?: string) =>
        !!value &&
        (value.startsWith('http://') ||
          value.startsWith('https://') ||
          value.startsWith('data:image/'));

      const referenceImage = isValidQwenRef(urlRef)
        ? urlRef
        : isValidQwenRef(dataUrlRef)
          ? dataUrlRef
          : undefined;
      const canUseReferenceImage = !!referenceImage;

      const scene =
        canUseReferenceImage
          ? 'image-to-image'
          : 'text-to-image';
      const model =
        scene === 'image-to-image' ? 'qwen-image-edit-max' : 'qwen-image-max';

      if (!canUseReferenceImage && selectedCar.customInput?.imageUrl) {
        toast.error(
          isZh
            ? '参考图格式无效，已切换为文生图。请使用公网图片链接或重新上传。'
            : 'Invalid reference image format. Switched to text-to-image.'
        );
      }

      // Qwen image-to-image is sensitive to long content; keep prompt compact.
      const compactPrompt = [
        `${isZh ? selectedCar.nameZh : selectedCar.name}`,
        `${t('paint')}: ${isZh ? selectedColor.nameZh : selectedColor.name}`,
        `${t('wheels')}: ${isZh ? selectedWheel.nameZh : selectedWheel.name}`,
        selectedMods.length > 0
          ? `${t('modifications_')}: ${selectedMods
              .map((id) => MODIFICATION_OPTIONS.find((m) => m.id === id))
              .map((m) => (isZh ? m?.nameZh : m?.name))
              .filter(Boolean)
              .join(', ')}`
          : null,
      ]
        .filter(Boolean)
        .join(', ');

      const finalPrompt =
        scene === 'image-to-image'
          ? `${compactPrompt}. Keep same car identity from reference image; apply selected modifications only.`
          : prompt;

      const resp = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaType: AIMediaType.IMAGE,
          scene,
          provider: 'qwen',
          model,
          prompt: finalPrompt,
          options: {
            size: '1024*1024',
            n: 1,
            ...(scene === 'image-to-image' && referenceImage
              ? { ref_image: referenceImage }
              : {}),
          },
        }),
      });

      if (!resp.ok) throw new Error(`${t('requestFailed')}: ${resp.status}`);

      const { code, message, data } = await resp.json();
      if (code !== 0) throw new Error(message || t('queryTaskFailed'));

      const newTaskId = data?.id;
      if (!newTaskId) throw new Error(t('queryTaskFailed'));

      if (data.status === AITaskStatus.SUCCESS && data.taskInfo) {
        const parsedResult = typeof data.taskInfo === 'string' 
          ? parseTaskResult(data.taskInfo) 
          : data.taskInfo;
        const imageUrls = extractImageUrls(parsedResult);
        if (imageUrls.length > 0) {
          setGeneratedImages(
            imageUrls.map((url, index) => ({
              id: `${newTaskId}-${index}`,
              url,
              prompt,
            }))
          );
          toast.success(t('generationComplete'));
          setProgress(100);
          resetTaskState();
          await fetchUserCredits();
          return;
        }
      }

      setTaskId(newTaskId);
      setProgress(25);
      await fetchUserCredits();
    } catch (error: any) {
      console.error('生成图片失败:', error);
      toast.error(`${t('generationFailed')}: ${error.message}`);
      resetTaskState();
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
    if (navigator.share) {
      navigator.share({
        title: t('shareTitle', { car: carName }),
        text: t('shareText', { car: carName }),
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success(t('linkCopied'));
    }
  };

  const taskStatusLabel = useMemo(() => {
    if (!taskStatus) return '';
    switch (taskStatus) {
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
  }, [taskStatus, t]);

  const totalBuildCost = useMemo(() => {
    let basePrice = selectedCar.price;
    basePrice += selectedWheel.price;
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
  }, [selectedCar, selectedWheel, selectedColor, selectedFinish, selectedMods, accentOptions]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY' }).format(price);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden font-[family-name:var(--font-sans)]">
      <AnimatePresence>
        {showCustomInput && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm">
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

      <main className="pt-16 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Sidebar - Car Info */}
            <motion.div 
              className="lg:col-span-3 space-y-6"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="space-y-6">
                <motion.div 
                  className="bg-card rounded-2xl p-6 border border-border shadow-lg"
                  whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">{isZh ? selectedCar.nameZh : selectedCar.name}</h2>
                  <div className="flex items-center gap-3 mb-6">
                    <motion.span 
                      className="px-4 py-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full text-xs font-medium shadow-[0_0_10px_rgba(99,102,241,0.4)] text-white"
                      whileHover={{ scale: 1.05 }}
                    >
                      {t('awd')}
                    </motion.span>
                    <span className="text-muted-foreground text-sm">{selectedCar.brand} {selectedCar.type === 'sedan' ? t('sedan') : t('suv')}</span>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-muted-foreground text-sm mb-2 uppercase tracking-wider">{t('totalBuildCost')}</h3>
                    <motion.p 
                      className="text-3xl font-bold text-[#6366f1]"
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
                    <span className="text-muted-foreground text-sm">{t('basePrice')}</span>
                    <span className="text-sm font-medium">{formatPrice(selectedCar.price)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-muted-foreground text-sm">{t('modCost')}</span>
                    <span className="text-sm font-medium text-[#6366f1]">+{formatPrice(totalBuildCost - selectedCar.price)}</span>
                  </div>
                </motion.div>

                <Card className="bg-card border-border shadow-lg overflow-hidden">
                  <CardHeader className="pb-3 bg-card border-b border-border">
                    <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('configDetails')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-6">
                    <motion.div 
                      className="flex justify-between items-center py-3 border-b border-muted"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-muted-foreground text-sm">{t('baseModel')}</span>
                      <span className="font-medium">{formatPrice(selectedCar.price)}</span>
                    </motion.div>
                    <motion.div 
                      className="flex justify-between items-center py-3 border-b border-muted"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-muted-foreground text-sm">{t('wheels')}</span>
                      <span className="font-medium">{formatPrice(selectedWheel.price)}</span>
                    </motion.div>
                    <motion.div 
                      className="flex justify-between items-center py-3 border-b border-muted"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-muted-foreground text-sm">{t('paint')}</span>
                      <span className="font-medium">{formatPrice(selectedColor.price + selectedFinish.price)}</span>
                    </motion.div>
                    {selectedMods.length > 0 && (
                      <div className="py-3 border-b border-muted">
                        <span className="text-muted-foreground text-sm block mb-3 uppercase tracking-wider">{t('modKit')}</span>
                        {selectedMods.map((id) => {
                          const mod = MODIFICATION_OPTIONS.find((m) => m.id === id);
                          return mod ? (
                            <motion.div 
                              key={id} 
                              className="flex justify-between items-center py-2"
                              whileHover={{ x: 5 }}
                            >
                              <span className="text-sm">{isZh ? mod.nameZh : mod.name}</span>
                              <span className="text-sm text-[#6366f1]">+{formatPrice(mod.price)}</span>
                            </motion.div>
                          ) : null;
                        })}
                      </div>
                    )}
                    {Object.entries(accentOptions).some(([_, enabled]) => enabled) && (
                      <div className="py-3">
                        <span className="text-muted-foreground text-sm block mb-3 uppercase tracking-wider">{t('accentsDetail')}</span>
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
                                <span className="text-sm text-[#6366f1]">+{formatPrice(accent.price)}</span>
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
              <Card className="bg-card border-border overflow-hidden shadow-xl">
                <CardContent className="p-0">
                  <div className="relative">
                    {generatedImages.length > 0 ? (
                      <motion.div 
                        className="aspect-[16/9] bg-background relative rounded-xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <LazyImage
                          src={generatedImages[0].url}
                          alt={`${isZh ? selectedCar.nameZh : selectedCar.name} ${t('modEffect')}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-6 w-full">
                            <h3 className="text-xl font-bold mb-2">{isZh ? selectedCar.nameZh : selectedCar.name} {t('modEffect')}</h3>
                            <p className="text-muted-foreground text-sm mb-4">{prompt}</p>
                            <div className="flex gap-3">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleDownloadImage(generatedImages[0])}
                                disabled={downloadingImageId === generatedImages[0].id}
                                className="bg-muted/10 hover:bg-muted/20 backdrop-blur-sm"
                              >
                                {downloadingImageId === generatedImages[0].id ? (
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
                                className="bg-muted/10 hover:bg-muted/20 backdrop-blur-sm"
                              >
                                <Share2 className="w-4 h-4 mr-2" />
                                {t('share')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="aspect-[16/9] bg-background relative flex items-center justify-center overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                      >
                        <img
                          src={selectedCar.localImage}
                          alt={isZh ? selectedCar.nameZh : selectedCar.name}
                          className="w-full h-full object-cover opacity-70 transition-opacity duration-300 hover:opacity-90"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=450&fit=crop';
                          }}
                        />
                        <div className="absolute bottom-4 left-4 bg-background/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                          <span className="text-sm font-medium">{isZh ? selectedCar.nameZh : selectedCar.name}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Car Selection */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{t('selectCarModel')}</h3>
                  <Badge variant="outline" className="text-muted-foreground border-border">
                    {CHINESE_CAR_MODELS.length} {t('carModelsCount')}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* 自定义车型按钮 */}
                  <motion.div
                    className="relative rounded-xl overflow-hidden cursor-pointer border-2 border-dashed border-border/60 hover:border-[#6366f1] transition-all"
                    onClick={() => setShowCustomInput(true)}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="aspect-[4/3] bg-card flex flex-col items-center justify-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center">
                        <span className="text-2xl font-light text-muted-foreground">+</span>
                      </div>
                      <p className="text-xs font-medium text-muted-foreground">{t('customCar')}</p>
                    </div>
                    <div className="p-3 bg-card border-t border-border">
                      <p className="text-xs text-muted-foreground/60 mb-1">Custom</p>
                      <p className="text-sm font-medium truncate">{t('inputYourCar')}</p>
                      <p className="text-xs text-[#6366f1] mt-1">{t('freeTrial')}</p>
                    </div>
                  </motion.div>

                  {(showAllCars ? CHINESE_CAR_MODELS : CHINESE_CAR_MODELS.slice(0, 3)).map((car) => (
                    <motion.div
                      key={car.id}
                      className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedCar.id === car.id ? 'border-[#6366f1] shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'border-transparent hover:border-border/60'}`}
                      onClick={() => setSelectedCar(car)}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="aspect-[4/3] bg-card relative overflow-hidden">
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
                            className="absolute inset-0 bg-[#6366f1]/20 backdrop-blur-sm flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <CircleCheckBig className="h-7 w-7 text-[#6366f1]" />
                          </motion.div>
                        )}
                      </div>
                      <div className="p-3 bg-card border-t border-border">
                        <p className="text-xs text-muted-foreground/60 mb-1">{car.brand}</p>
                        <p className="text-sm font-medium truncate">{isZh ? car.nameZh : car.name}</p>
                        <p className="text-xs text-[#6366f1] mt-1">{formatPrice(car.price)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center mt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllCars(!showAllCars)}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted"
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
                <Card className="bg-card border-border shadow-lg">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CardContent className="space-y-4 p-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{t('generationProgress')}</span>
                        <span className="text-[#6366f1] font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-3 bg-border rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full"
                          style={{ width: `${progress}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                        />
                      </Progress>
                      {taskStatusLabel && (
                        <motion.p 
                          className="text-sm text-muted-foreground text-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {taskStatusLabel}
                        </motion.p>
                      )}
                      <div className="flex justify-center mt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            resetTaskState();
                            setGeneratedImages([]);
                          }}
                          className="text-muted-foreground hover:text-foreground"
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
                  className="bg-card rounded-xl p-1 flex gap-2 border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {['paint', 'wheels', 'mods', 'accents'].map((tab) => (
                    <motion.button
                      key={tab}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-all rounded-lg ${activeTab === tab ? 'bg-card text-foreground shadow-lg border border-border' : 'text-muted-foreground hover:text-foreground'}`}
                      onClick={() => setActiveTab(tab)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {tab === 'paint' && 'PAINT'}
                      {tab === 'wheels' && 'WHEELS'}
                      {tab === 'mods' && 'MODS'}
                      {tab === 'accents' && 'ACCENTS'}
                    </motion.button>
                  ))}
                </motion.div>

                {/* Paint Options */}
                {activeTab === 'paint' && (
                  <Card className="bg-card border-border shadow-lg overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardHeader className="bg-card border-b border-border p-6">
                      <CardTitle className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Paint Lab</CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">Select a finish and color. Premium finishes include ceramic coating.</p>
                    </CardHeader>
                    <CardContent className="space-y-8 p-6">
                      {/* Finish Type */}
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Finish Type</h3>
                        <div className="flex flex-wrap gap-3">
                          {FINISH_TYPES.map((finish) => (
                            <motion.button
                              key={finish.id}
                              className={`px-5 py-3 rounded-xl text-sm transition-all ${selectedFinish.id === finish.id ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-card text-muted-foreground hover:text-foreground border border-border'}`}
                              onClick={() => setSelectedFinish(finish)}
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
                        <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">Manufacturer Colors</h3>
                        <div className="grid grid-cols-5 gap-4">
                          {PAINT_COLORS.map((color) => (
                            <motion.div
                              key={color.id}
                              className={`relative cursor-pointer group ${selectedColor.id === color.id ? 'ring-2 ring-[#6366f1] ring-offset-2 ring-offset-card' : ''}`}
                              onClick={() => setSelectedColor(color)}
                              whileHover={{ scale: 1.15, y: -5 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div
                                className="w-12 h-12 rounded-full shadow-lg border-2 border-border transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                style={{ backgroundColor: color.color }}
                              />
                              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-card px-2 py-1 rounded-lg border border-border">
                                {isZh ? color.nameZh : color.name}
                                {color.price > 0 && (
                                  <span className="ml-1 text-[#6366f1]">+{formatPrice(color.price)}</span>
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
                  <Card className="bg-card border-border shadow-lg overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardHeader className="bg-card border-b border-border p-6">
                      <CardTitle className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Wheel Selector</CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">Choose wheel style and size for your build.</p>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                      {WHEEL_STYLES.map((wheel) => (
                        <motion.div
                          key={wheel.id}
                          className={`p-5 rounded-xl cursor-pointer transition-all border ${selectedWheel.id === wheel.id ? 'border-[#6366f1] bg-card shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-muted hover:border-border bg-card'}`}
                          onClick={() => setSelectedWheel(wheel)}
                          whileHover={{ scale: 1.02, y: -3 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start gap-4">
                            <motion.div 
                              className="w-14 h-14 rounded-full bg-card flex items-center justify-center border border-border"
                              whileHover={{ rotate: 10 }}
                            >
                              <CircleDashed className="h-5 w-5 text-[#6366f1]" />
                            </motion.div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-foreground">{isZh ? wheel.nameZh : wheel.name}</h4>
                                {wheel.price > 0 && (
                                  <motion.span 
                                    className="text-sm font-medium text-[#6366f1]"
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    +{formatPrice(wheel.price)}
                                  </motion.span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{isZh ? wheel.descriptionZh : wheel.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </motion.div>
                </Card>
                )}

                {/* Modification Options */}
                {activeTab === 'mods' && (
                  <Card className="bg-card border-border shadow-lg overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardHeader className="bg-card border-b border-border p-6">
                      <CardTitle className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Performance & Styling</CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">Enhance your vehicle's appearance and performance.</p>
                    </CardHeader>
                    <CardContent className="space-y-3 p-6">
                      {MODIFICATION_OPTIONS.map((mod) => (
                        <motion.div 
                          key={mod.id} 
                          className="flex items-center justify-between py-4 border-b border-muted"
                          whileHover={{ x: 5 }}
                        >
                          <motion.div 
                            className="flex items-center gap-4"
                            onClick={() => toggleMod(mod.id)}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div 
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer ${selectedMods.includes(mod.id) ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] border-[#6366f1] shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'border-border'}`}
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
                            <div>
                              <p className="text-sm font-medium text-foreground">{isZh ? mod.nameZh : mod.name}</p>
                              <p className="text-xs text-muted-foreground">{isZh ? mod.descriptionZh : mod.description}</p>
                            </div>
                          </motion.div>
                          <motion.span 
                            className="text-sm font-medium text-[#6366f1]"
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
                  <Card className="bg-card border-border shadow-lg overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardHeader className="bg-card border-b border-border p-6">
                      <CardTitle className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Accent Details</CardTitle>
                      <p className="text-muted-foreground text-sm mt-1">Add custom touches to your build.</p>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                      {ACCENT_OPTIONS.map((accent) => (
                        <motion.div 
                          key={accent.id} 
                          className="flex items-center justify-between py-4 border-b border-muted"
                          whileHover={{ x: 5 }}
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">{isZh ? accent.nameZh : accent.name}</p>
                            <p className="text-xs text-muted-foreground">{isZh ? accent.descriptionZh : accent.description}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <motion.span 
                              className="text-sm font-medium text-[#6366f1]"
                              whileHover={{ scale: 1.1 }}
                            >
                              +{formatPrice(accent.price)}
                            </motion.span>
                            <Switch
                              checked={accentOptions[accent.id]}
                              onCheckedChange={() => toggleAccent(accent.id)}
                              className="data-[state=checked]:bg-[#6366f1]"
                            />
                          </div>
                        </motion.div>
                      ))}
                    </CardContent>
                  </motion.div>
                </Card>
                )}

                {/* Action Buttons */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Button
                      className="w-full py-6 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-lg font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 text-white"
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
                          {t('generateImage')}
                        </>
                      )}
                    </Button>
                  </motion.div>
                  <div className="flex gap-3">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                      className="flex-1"
                    >
                      <Button
                        variant="secondary"
                        className="w-full py-4 bg-card hover:bg-muted border border-border font-medium transition-all duration-300"
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
                        className="w-full py-4 bg-card hover:bg-muted border border-border font-medium transition-all duration-300"
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
                    <p className="text-xs text-muted-foreground/40">
                      {t('creditsRequired', { credits: costCredits })}
                      {user && ` ${t('remaining', { credits: remainingCredits })}`}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
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
