'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Loader2, Sparkles, Download, Image as ImageIcon, Share2, FileText, RefreshCw, Eye, EyeOff, ChevronDown, ChevronUp } from 'lucide-react';

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

const POLL_INTERVAL = 5000;
const GENERATION_TIMEOUT = 180000;

const CHINESE_CAR_MODELS = [
  { id: 'honda-civic', name: 'Honda Civic (思域)', brand: 'Honda', type: 'sedan', image: 'https://images.unsplash.com/photo-1606611013016-969c19ba27bb?w=800&h=600&fit=crop', price: 150000 },
  { id: 'toyota-86-brz', name: 'Toyota 86 / Subaru BRZ', brand: 'Toyota/Subaru', type: 'coupe', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop', price: 280000 },
  { id: 'vw-golf', name: 'Volkswagen Golf (高尔夫)', brand: 'Volkswagen', type: 'hatchback', image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=600&fit=crop', price: 150000 },
  { id: 'nissan-gtr', name: 'Nissan Skyline GT-R (R32-R35)', brand: 'Nissan', type: 'sports', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop', price: 1500000 },
  { id: 'mazda-mx5', name: 'Mazda MX-5 (Miata)', brand: 'Mazda', type: 'roadster', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop', price: 350000 },
  { id: 'bmw-3series', name: 'BMW 3 Series (3系)', brand: 'BMW', type: 'sedan', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop', price: 300000 },
  { id: 'ford-mustang', name: 'Ford Mustang (野马)', brand: 'Ford', type: 'coupe', image: 'https://images.unsplash.com/photo-1584345604476-8ec5f82d718c?w=800&h=600&fit=crop', price: 400000 },
  { id: 'nissan-silvia', name: 'Nissan Silvia (S13-S15)', brand: 'Nissan', type: 'coupe', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop', price: 200000 },
  { id: 'toyota-supra', name: 'Toyota Supra', brand: 'Toyota', type: 'sports', image: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&h=600&fit=crop', price: 600000 },
  { id: 'subaru-wrx', name: 'Subaru WRX / STI', brand: 'Subaru', type: 'sedan', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop', price: 350000 },
  { id: 'mitsubishi-evo', name: 'Mitsubishi Lancer Evolution (EVO)', brand: 'Mitsubishi', type: 'sedan', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop', price: 450000 },
  { id: 'porsche-911', name: 'Porsche 911', brand: 'Porsche', type: 'sports', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop', price: 1500000 },
  { id: 'jeep-wrangler', name: 'Jeep Wrangler (牧马人)', brand: 'Jeep', type: 'suv', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop', price: 450000 },
  { id: 'suzuki-jimny', name: 'Suzuki Jimny (吉姆尼)', brand: 'Suzuki', type: 'suv', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop', price: 150000 },
  { id: 'nissan-370z', name: 'Nissan 350Z / 370Z', brand: 'Nissan', type: 'coupe', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop', price: 350000 },
  { id: 'audi-a4', name: 'Audi A4 / S4 / RS4', brand: 'Audi', type: 'sedan', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', price: 350000 },
  { id: 'mercedes-cclass', name: 'Mercedes-Benz C-Class (C级)', brand: 'Mercedes-Benz', type: 'sedan', image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=600&fit=crop', price: 350000 },
  { id: 'mini-cooper', name: 'MINI Cooper', brand: 'MINI', type: 'hatchback', image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop', price: 280000 },
  { id: 'mazda-rx7', name: 'Mazda RX-7', brand: 'Mazda', type: 'coupe', image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop', price: 500000 },
  { id: 'vw-beetle', name: 'Volkswagen Beetle (甲壳虫)', brand: 'Volkswagen', type: 'hatchback', image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&h=600&fit=crop', price: 200000 },
  { id: 'chevy-camaro', name: 'Chevrolet Camaro (大黄蜂)', brand: 'Chevrolet', type: 'coupe', image: 'https://images.unsplash.com/photo-1584345604476-8ec5f82d718c?w=800&h=600&fit=crop', price: 400000 },
  { id: 'dodge-challenger', name: 'Dodge Challenger (挑战者)', brand: 'Dodge', type: 'coupe', image: 'https://images.unsplash.com/photo-1584345604476-8ec5f82d718c?w=800&h=600&fit=crop', price: 450000 },
  { id: 'lexus-is', name: 'Lexus IS', brand: 'Lexus', type: 'sedan', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop', price: 350000 },
  { id: 'tesla-model3', name: 'Tesla Model 3', brand: 'Tesla', type: 'sedan', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop', price: 280000 },
  { id: 'infiniti-g35', name: 'Infiniti G35 / G37', brand: 'Infiniti', type: 'sedan', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop', price: 250000 },
  { id: 'ford-f150', name: 'Ford F-150 / Raptor', brand: 'Ford', type: 'truck', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop', price: 600000 },
  { id: 'audi-a5', name: 'Audi A5 / S5 / RS5', brand: 'Audi', type: 'coupe', image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&h=600&fit=crop', price: 500000 },
  { id: 'bmw-m3', name: 'BMW M3 / M4', brand: 'BMW', type: 'sports', image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop', price: 800000 },
  { id: 'toyota-ae86', name: 'Toyota AE86', brand: 'Toyota', type: 'coupe', image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&h=600&fit=crop', price: 150000 },
  { id: 'landrover-defender', name: 'Land Rover Defender (卫士)', brand: 'Land Rover', type: 'suv', image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&h=600&fit=crop', price: 700000 },
];

const WHEEL_STYLES = [
  { id: 'stock', name: '原厂轮毂', description: '保持原厂轮毂样式', price: 0 },
  { id: 'sport', name: '运动轮毂', description: '多辐条运动风格', price: 8000 },
  { id: 'luxury', name: '豪华轮毂', description: '大尺寸豪华风格', price: 12000 },
  { id: 'forged', name: '锻造轮毂', description: '轻量化锻造工艺', price: 18000 },
  { id: 'racing', name: '赛道轮毂', description: '专业赛道风格', price: 22000 },
];

const PAINT_COLORS = [
  { id: 'midnight-black', name: '午夜黑', color: '#0a0a0a', description: '深邃神秘的黑色', price: 0 },
  { id: 'pearl-white', name: '珍珠白', color: '#f5f5f5', description: '优雅纯净的白色', price: 0 },
  { id: 'racing-red', name: '赛道红', color: '#c41e3a', description: '激情澎湃的红色', price: 0 },
  { id: 'ocean-blue', name: '海洋蓝', color: '#0066cc', description: '深邃宁静的蓝色', price: 0 },
  { id: 'forest-green', name: '森林绿', color: '#228b22', description: '自然清新的绿色', price: 0 },
  { id: 'sunset-orange', name: '日落橙', color: '#ff6b35', description: '活力四射的橙色', price: 3000 },
  { id: 'royal-purple', name: '皇家紫', color: '#6b3fa0', description: '高贵典雅的紫色', price: 3000 },
  { id: 'titanium-gray', name: '钛金灰', color: '#4a5568', description: '科技感十足的灰色', price: 0 },
  { id: 'champagne-gold', name: '香槟金', color: '#d4af37', description: '奢华大气的金色', price: 5000 },
  { id: 'matte-black', name: '哑光黑', color: '#1a1a1a', description: '低调内敛的哑光黑', price: 4000 },
];

const FINISH_TYPES = [
  { id: 'gloss', name: 'Gloss Metallic', description: '高光泽度金属漆', price: 0 },
  { id: 'matte', name: 'Matte Wrap', description: '哑光车身膜', price: 8000 },
  { id: 'satin', name: 'Satin Pearl', description: '缎面珍珠漆', price: 6000 },
  { id: 'chrome', name: 'Chrome', description: '镀铬效果', price: 15000 },
  { id: 'carbon', name: 'Carbon Fiber', description: '碳纤维纹理', price: 20000 },
];

const MODIFICATION_OPTIONS = [
  { id: 'lowered', name: '降低车身', description: '运动姿态，降低重心', price: 5000 },
  { id: 'widebody', name: '宽体套件', description: '更宽的轮距，更激进的外观', price: 15000 },
  { id: 'spoiler', name: '尾翼', description: '增加下压力，运动风格', price: 3000 },
  { id: 'diffuser', name: '扩散器', description: '优化空气动力学', price: 4000 },
  { id: 'side-skirts', name: '侧裙', description: '降低视觉重心', price: 2500 },
  { id: 'front-lip', name: '前唇', description: '增强前部运动感', price: 2000 },
];

const ACCENT_OPTIONS = [
  { id: 'chrome-delete', name: 'Chrome Delete', description: '去除镀铬装饰', price: 1500 },
  { id: 'carbon-roof', name: 'Carbon Roof', description: '碳纤维车顶', price: 8000 },
  { id: 'racing-stripes', name: 'Racing Stripes', description: '赛车条纹', price: 2000 },
  { id: 'custom-badge', name: 'Custom Badge', description: '定制徽章', price: 1000 },
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

  const [selectedCar, setSelectedCar] = useState(CHINESE_CAR_MODELS[0]);
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

    parts.push(`${selectedCar.name} (${selectedCar.brand}) 完整车身全身照`);
    parts.push(`车身颜色: ${selectedColor.name} (${selectedFinish.name}漆面)`);
    parts.push(`轮毂: ${selectedWheel.name}`);

    const activeMods = selectedMods
      .map((id) => MODIFICATION_OPTIONS.find((m) => m.id === id)?.name)
      .filter(Boolean);
    if (activeMods.length > 0) {
      parts.push(`改装: ${activeMods.join('、')}`);
    }

    const activeAccents = Object.entries(accentOptions)
      .filter(([_, enabled]) => enabled)
      .map(([id]) => ACCENT_OPTIONS.find((a) => a.id === id)?.name)
      .filter(Boolean);
    if (activeAccents.length > 0) {
      parts.push(`细节: ${activeAccents.join('、')}`);
    }

    parts.push('高质量汽车摄影，专业打光，4K分辨率，细节丰富，深色背景，完整展示整车，侧面45度角，车身完整可见，无裁剪');

    return parts.join('，');
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
          toast.error('生成超时，请重试');
          return true;
        }

        const resp = await fetch('/api/ai/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ taskId: id }),
        });

        if (!resp.ok) throw new Error(`请求失败: ${resp.status}`);

        const { code, message, data } = await resp.json();
        if (code !== 0) throw new Error(message || '查询任务失败');

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
            toast.error('生成失败，请重试');
          } else {
            setGeneratedImages(
              imageUrls.map((url, index) => ({
                id: `${task.id}-${index}`,
                url,
                prompt: task.prompt ?? undefined,
              }))
            );
            toast.success('图片生成成功');
          }
          setProgress(100);
          resetTaskState();
          return true;
        }

        if (currentStatus === AITaskStatus.FAILED) {
          const errorMessage = parsedResult?.errorMessage || '生成失败';
          toast.error(errorMessage);
          resetTaskState();
          fetchUserCredits();
          return true;
        }

        setProgress((prev) => Math.min(prev + 5, 95));
        return false;
      } catch (error: any) {
        console.error('轮询任务状态失败:', error);
        toast.error(`查询失败: ${error.message}`);
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
      toast.error('积分不足，请充值后继续');
      return;
    }

    setIsGenerating(true);
    setProgress(15);
    setTaskStatus(AITaskStatus.PENDING);
    setGeneratedImages([]);
    setGenerationStartTime(Date.now());

    try {
      const resp = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mediaType: AIMediaType.IMAGE,
          scene: 'text-to-image',
          provider: 'qwen',
          model: 'qwen-image-max',
          prompt,
          options: {
            size: '1024*1024',
            n: 1,
          },
        }),
      });

      if (!resp.ok) throw new Error(`请求失败: ${resp.status}`);

      const { code, message, data } = await resp.json();
      if (code !== 0) throw new Error(message || '创建任务失败');

      const newTaskId = data?.id;
      if (!newTaskId) throw new Error('响应中缺少任务ID');

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
          toast.success('图片生成成功');
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
      toast.error(`生成失败: ${error.message}`);
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
      toast.success('图片已下载');
    } catch (error) {
      console.error('下载图片失败:', error);
      toast.error('下载失败');
    } finally {
      setDownloadingImageId(null);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${selectedCar.name} 改装方案`,
        text: `查看我的 ${selectedCar.name} 改装方案`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('链接已复制到剪贴板');
    }
  };

  const taskStatusLabel = useMemo(() => {
    if (!taskStatus) return '';
    switch (taskStatus) {
      case AITaskStatus.PENDING:
        return '等待模型启动...';
      case AITaskStatus.PROCESSING:
        return '正在生成图片...';
      case AITaskStatus.SUCCESS:
        return '生成完成';
      case AITaskStatus.FAILED:
        return '生成失败';
      default:
        return '';
    }
  }, [taskStatus]);

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
    <div className="min-h-screen bg-[#0a0a1a] text-white overflow-hidden font-[family-name:var(--font-sans)]">
      {/* Top Navigation */}
      <header className="fixed top-0 left-0 w-full z-50 bg-[#0a0a1a]/95 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.6)]"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="material-icons text-white text-sm font-bold">sports_car</span>
            </motion.div>
            <span className="text-xl font-bold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">MODPLAYGROUND</span>
          </motion.div>
          <motion.div 
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTestMode(!testMode)}
                className={`text-xs ${testMode ? 'text-[#6366f1] bg-[#6366f1]/10' : 'text-white/60'} border border-white/10`}
              >
                {testMode ? '🧪 测试模式开启' : '🧪 测试模式关闭'}
              </Button>
              {user ? (
                <>
                  <motion.div 
                    className="px-4 py-2 bg-[#131324] rounded-full border border-white/10 flex items-center gap-2"
                    whileHover={{ scale: 1.05, borderColor: 'rgba(99,102,241,0.5)' }}
                  >
                    <span className="text-sm text-white/60">积分:</span>
                    <span className="text-sm font-medium text-[#6366f1]">{remainingCredits}</span>
                  </motion.div>
                  <Badge variant="outline" className="text-white/80 border-white/20">
                    {user?.email?.split('@')[0] || '用户'}
                  </Badge>
                </>
              ) : (
                <Button 
                  variant="ghost" 
                  onClick={() => setIsShowSignModal(true)} 
                  className="text-white/80 hover:text-white border border-white/10 hover:border-[#6366f1] transition-all"
                >
                  登录
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </header>

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
                  className="bg-gradient-to-br from-[#131324] to-[#1a1a3a] rounded-2xl p-6 border border-white/10 shadow-lg"
                  whileHover={{ y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">{selectedCar.name}</h2>
                  <div className="flex items-center gap-3 mb-6">
                    <motion.span 
                      className="px-4 py-1 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] rounded-full text-xs font-medium shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                      whileHover={{ scale: 1.05 }}
                    >
                      AWD
                    </motion.span>
                    <span className="text-white/60 text-sm">{selectedCar.brand} {selectedCar.type === 'sedan' ? '轿车' : 'SUV'}</span>
                  </div>
                  <div className="mb-4">
                    <h3 className="text-white/60 text-sm mb-2 uppercase tracking-wider">Total Build Cost</h3>
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
                  <Separator className="bg-white/10 my-4" />
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 text-sm">基础价格</span>
                    <span className="text-sm font-medium">{formatPrice(selectedCar.price)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-white/60 text-sm">改装成本</span>
                    <span className="text-sm font-medium text-[#6366f1]">+{formatPrice(totalBuildCost - selectedCar.price)}</span>
                  </div>
                </motion.div>

                <Card className="bg-[#131324] border-white/10 shadow-lg overflow-hidden">
                  <CardHeader className="pb-3 bg-[#1a1a2e] border-b border-white/10">
                    <CardTitle className="text-sm font-medium text-white/80 uppercase tracking-wider">配置详情</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-6">
                    <motion.div 
                      className="flex justify-between items-center py-3 border-b border-white/5"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-white/60 text-sm">基础车型</span>
                      <span className="font-medium">{formatPrice(selectedCar.price)}</span>
                    </motion.div>
                    <motion.div 
                      className="flex justify-between items-center py-3 border-b border-white/5"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-white/60 text-sm">轮毂</span>
                      <span className="font-medium">{formatPrice(selectedWheel.price)}</span>
                    </motion.div>
                    <motion.div 
                      className="flex justify-between items-center py-3 border-b border-white/5"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-white/60 text-sm">漆面</span>
                      <span className="font-medium">{formatPrice(selectedColor.price + selectedFinish.price)}</span>
                    </motion.div>
                    {selectedMods.length > 0 && (
                      <div className="py-3 border-b border-white/5">
                        <span className="text-white/60 text-sm block mb-3 uppercase tracking-wider">改装套件</span>
                        {selectedMods.map((id) => {
                          const mod = MODIFICATION_OPTIONS.find((m) => m.id === id);
                          return mod ? (
                            <motion.div 
                              key={id} 
                              className="flex justify-between items-center py-2"
                              whileHover={{ x: 5 }}
                            >
                              <span className="text-sm">{mod.name}</span>
                              <span className="text-sm text-[#6366f1]">+{formatPrice(mod.price)}</span>
                            </motion.div>
                          ) : null;
                        })}
                      </div>
                    )}
                    {Object.entries(accentOptions).some(([_, enabled]) => enabled) && (
                      <div className="py-3">
                        <span className="text-white/60 text-sm block mb-3 uppercase tracking-wider">细节装饰</span>
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
                                <span className="text-sm">{accent.name}</span>
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
              <Card className="bg-[#131324] border-white/10 overflow-hidden shadow-xl">
                <CardContent className="p-0">
                  <div className="relative">
                    {generatedImages.length > 0 ? (
                      <motion.div 
                        className="aspect-[16/9] bg-gradient-to-br from-black to-[#0a0a1a] relative rounded-xl overflow-hidden"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <LazyImage
                          src={generatedImages[0].url}
                          alt={`${selectedCar.name} 改装效果图`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                          <div className="p-6 w-full">
                            <h3 className="text-xl font-bold mb-2">{selectedCar.name} 改装效果</h3>
                            <p className="text-white/60 text-sm mb-4">{prompt}</p>
                            <div className="flex gap-3">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleDownloadImage(generatedImages[0])}
                                disabled={downloadingImageId === generatedImages[0].id}
                                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm"
                              >
                                {downloadingImageId === generatedImages[0].id ? (
                                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                ) : (
                                  <>
                                    <Download className="w-4 h-4 mr-2" />
                                    下载
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
                                分享
                              </Button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        className="aspect-[16/9] bg-gradient-to-br from-[#1a1a2e] to-[#0a0a1a] relative flex items-center justify-center overflow-hidden"
                        whileHover={{ scale: 1.02 }}
                      >
                        <img
                          src={selectedCar.image}
                          alt={selectedCar.name}
                          className="w-full h-full object-cover opacity-70 transition-opacity duration-300 hover:opacity-90"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=450&fit=crop';
                          }}
                        />
                        <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                          <span className="text-sm font-medium">{selectedCar.name}</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Car Selection */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">选择车型</h3>
                  <Badge variant="outline" className="text-white/60 border-white/10">
                    {CHINESE_CAR_MODELS.length} 款车型
                  </Badge>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {(showAllCars ? CHINESE_CAR_MODELS : CHINESE_CAR_MODELS.slice(0, 4)).map((car) => (
                    <motion.div
                      key={car.id}
                      className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedCar.id === car.id ? 'border-[#6366f1] shadow-[0_0_20px_rgba(99,102,241,0.4)]' : 'border-transparent hover:border-white/20'}`}
                      onClick={() => setSelectedCar(car)}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <div className="aspect-[4/3] bg-[#1a1a2e] relative overflow-hidden">
                        <motion.img
                          src={car.image}
                          alt={car.name}
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
                            <span className="material-icons text-[#6366f1] text-2xl">check_circle</span>
                          </motion.div>
                        )}
                      </div>
                      <div className="p-3 bg-[#131324] border-t border-white/10">
                        <p className="text-xs text-white/40 mb-1">{car.brand}</p>
                        <p className="text-sm font-medium truncate">{car.name}</p>
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
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    {showAllCars ? (
                      <>
                        <ChevronUp className="w-4 h-4 mr-2" />
                        收起
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4 mr-2" />
                        查看全部 {CHINESE_CAR_MODELS.length} 款车型
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Generation Progress */}
              {isGenerating && (
                <Card className="bg-[#131324] border-white/10 shadow-lg">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <CardContent className="space-y-4 p-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">生成进度</span>
                        <span className="text-[#6366f1] font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-3 bg-white/10 rounded-full overflow-hidden">
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
                          className="text-sm text-white/60 text-center"
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
                          className="text-white/60 hover:text-white"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          取消生成
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
                  className="bg-[#131324] rounded-xl p-1 flex gap-2 border border-white/10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {['paint', 'wheels', 'mods', 'accents'].map((tab) => (
                    <motion.button
                      key={tab}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-all rounded-lg ${activeTab === tab ? 'bg-[#1a1a2e] text-white shadow-lg' : 'text-white/60 hover:text-white'}`}
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
                  <Card className="bg-[#131324] border-white/10 shadow-lg overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardHeader className="bg-gradient-to-r from-[#1a1a2e] to-[#131324] border-b border-white/10 p-6">
                      <CardTitle className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Paint Lab</CardTitle>
                      <p className="text-white/60 text-sm mt-1">Select a finish and color. Premium finishes include ceramic coating.</p>
                    </CardHeader>
                    <CardContent className="space-y-8 p-6">
                      {/* Finish Type */}
                      <div>
                        <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Finish Type</h3>
                        <div className="flex flex-wrap gap-3">
                          {FINISH_TYPES.map((finish) => (
                            <motion.button
                              key={finish.id}
                              className={`px-5 py-3 rounded-xl text-sm transition-all ${selectedFinish.id === finish.id ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-[#1a1a2e] text-white/60 hover:text-white border border-white/10'}`}
                              onClick={() => setSelectedFinish(finish)}
                              whileHover={{ scale: 1.03, y: -2 }}
                              whileTap={{ scale: 0.97 }}
                            >
                              {finish.name}
                              {finish.price > 0 && (
                                <span className="ml-2 text-xs font-medium">+{formatPrice(finish.price)}</span>
                              )}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Manufacturer Colors */}
                      <div>
                        <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Manufacturer Colors</h3>
                        <div className="grid grid-cols-5 gap-4">
                          {PAINT_COLORS.map((color) => (
                            <motion.div
                              key={color.id}
                              className={`relative cursor-pointer group ${selectedColor.id === color.id ? 'ring-2 ring-[#6366f1] ring-offset-2 ring-offset-[#131324]' : ''}`}
                              onClick={() => setSelectedColor(color)}
                              whileHover={{ scale: 1.15, y: -5 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <div
                                className="w-12 h-12 rounded-full shadow-lg border-2 border-white/20 transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                style={{ backgroundColor: color.color }}
                              />
                              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-[#1a1a2e] px-2 py-1 rounded-lg border border-white/10">
                                {color.name}
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
                  <Card className="bg-[#131324] border-white/10 shadow-lg overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardHeader className="bg-gradient-to-r from-[#1a1a2e] to-[#131324] border-b border-white/10 p-6">
                      <CardTitle className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Wheel Selector</CardTitle>
                      <p className="text-white/60 text-sm mt-1">Choose wheel style and size for your build.</p>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                      {WHEEL_STYLES.map((wheel) => (
                        <motion.div
                          key={wheel.id}
                          className={`p-5 rounded-xl cursor-pointer transition-all border ${selectedWheel.id === wheel.id ? 'border-[#6366f1] bg-gradient-to-r from-[#1a1a2e] to-[#131324] shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-white/5 hover:border-white/10 bg-[#131324]'}`}
                          onClick={() => setSelectedWheel(wheel)}
                          whileHover={{ scale: 1.02, y: -3 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-start gap-4">
                            <motion.div 
                              className="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a1a2e] to-[#131324] flex items-center justify-center border border-white/10"
                              whileHover={{ rotate: 10 }}
                            >
                              <span className="material-icons text-[#6366f1] text-lg">sports_motorsports</span>
                            </motion.div>
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-white">{wheel.name}</h4>
                                {wheel.price > 0 && (
                                  <motion.span 
                                    className="text-sm font-medium text-[#6366f1]"
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    +{formatPrice(wheel.price)}
                                  </motion.span>
                                )}
                              </div>
                              <p className="text-xs text-white/60">{wheel.description}</p>
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
                  <Card className="bg-[#131324] border-white/10 shadow-lg overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardHeader className="bg-gradient-to-r from-[#1a1a2e] to-[#131324] border-b border-white/10 p-6">
                      <CardTitle className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Performance & Styling</CardTitle>
                      <p className="text-white/60 text-sm mt-1">Enhance your vehicle's appearance and performance.</p>
                    </CardHeader>
                    <CardContent className="space-y-3 p-6">
                      {MODIFICATION_OPTIONS.map((mod) => (
                        <motion.div 
                          key={mod.id} 
                          className="flex items-center justify-between py-4 border-b border-white/5"
                          whileHover={{ x: 5 }}
                        >
                          <motion.div 
                            className="flex items-center gap-4"
                            onClick={() => toggleMod(mod.id)}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div 
                              className={`w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer ${selectedMods.includes(mod.id) ? 'bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] border-[#6366f1] shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'border-white/20'}`}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {selectedMods.includes(mod.id) && (
                                <motion.span 
                                  className="material-icons text-white text-xs"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  check
                                </motion.span>
                              )}
                            </motion.div>
                            <div>
                              <p className="text-sm font-medium text-white">{mod.name}</p>
                              <p className="text-xs text-white/60">{mod.description}</p>
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
                  <Card className="bg-[#131324] border-white/10 shadow-lg overflow-hidden">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <CardHeader className="bg-gradient-to-r from-[#1a1a2e] to-[#131324] border-b border-white/10 p-6">
                      <CardTitle className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">Accent Details</CardTitle>
                      <p className="text-white/60 text-sm mt-1">Add custom touches to your build.</p>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6">
                      {ACCENT_OPTIONS.map((accent) => (
                        <motion.div 
                          key={accent.id} 
                          className="flex items-center justify-between py-4 border-b border-white/5"
                          whileHover={{ x: 5 }}
                        >
                          <div>
                            <p className="text-sm font-medium text-white">{accent.name}</p>
                            <p className="text-xs text-white/60">{accent.description}</p>
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
                      className="w-full py-6 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-lg font-bold shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-3" />
                          生成中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-3" />
                          生成效果图
                        </>
                      )}
                    </Button>
                  </motion.div>
                  <div className="flex gap-3">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Button
                        variant="secondary"
                        className="flex-1 py-4 bg-gradient-to-r from-[#1a1a2e] to-[#131324] hover:from-[#252540] hover:to-[#1a1a2e] border border-white/10 font-medium transition-all duration-300"
                        onClick={handleShare}
                      >
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <Button
                        variant="secondary"
                        className="flex-1 py-4 bg-gradient-to-r from-[#1a1a2e] to-[#131324] hover:from-[#252540] hover:to-[#1a1a2e] border border-white/10 font-medium transition-all duration-300"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Quote
                      </Button>
                    </motion.div>
                  </div>
                  <motion.div 
                    className="text-center mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    <p className="text-xs text-white/40">
                      生成效果图需要 {costCredits} 积分
                      {user && ` (剩余: ${remainingCredits})`}
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
