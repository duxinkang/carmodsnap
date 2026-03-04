'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Loader2, Sparkles, Download, Image as ImageIcon } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import { AIMediaType, AITaskStatus } from '@/extensions/ai/types';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Progress } from '@/shared/components/ui/progress';
import { useAppContext } from '@/shared/contexts/app';
import { LazyImage } from '@/shared/blocks/common';

const POLL_INTERVAL = 5000;
const GENERATION_TIMEOUT = 180000;

const CHINESE_CAR_MODELS = [
  { id: 'xiaomi-su7', name: '小米 SU7', brand: '小米', type: 'sedan', image: 'https://img-s-msn-com.akamaized.net/tenant/amp/entityid/AA1s6hvh.img?w=800&h=415&m=6' },
  { id: 'byd-han', name: '比亚迪 汉', brand: '比亚迪', type: 'sedan', image: 'https://autoimg.vastimg.com/files/202401/2024010909444047275.jpg' },
  { id: 'byd-tang', name: '比亚迪 唐', brand: '比亚迪', type: 'suv', image: 'https://img1.bitautoimg.com/bitauto/2023/03/20/f8e2b7c2-8c7f-4c2d-9e5e-3b8c7f8e2b7c2.jpg' },
  { id: 'byd-seal', name: '比亚迪 海豹', brand: '比亚迪', type: 'sedan', image: 'https://img1.bitautoimg.com/bitauto/2023/06/15/7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d.jpg' },
  { id: 'zeekr-001', name: '极氪 001', brand: '极氪', type: 'sedan', image: 'https://img1.bitautoimg.com/bitauto/2023/04/20/a1b2c3d4-e5f6-7890-abcd-ef1234567890.jpg' },
  { id: 'zeekr-007', name: '极氪 007', brand: '极氪', type: 'sedan', image: 'https://img1.bitautoimg.com/bitauto/2024/01/15/12345678-90ab-cdef-1234-567890abcdef.jpg' },
  { id: 'nio-et7', name: '蔚来 ET7', brand: '蔚来', type: 'sedan', image: 'https://img1.bitautoimg.com/bitauto/2023/05/10/abcdef12-3456-7890-abcd-ef1234567890.jpg' },
  { id: 'nio-es6', name: '蔚来 ES6', brand: '蔚来', type: 'suv', image: 'https://img1.bitautoimg.com/bitauto/2023/07/20/23456789-0abc-def1-2345-67890abcdef1.jpg' },
  { id: 'xpeng-p7', name: '小鹏 P7', brand: '小鹏', type: 'sedan', image: 'https://img1.bitautoimg.com/bitauto/2023/02/15/34567890-abcd-ef12-3456-7890abcdef12.jpg' },
  { id: 'xpeng-g9', name: '小鹏 G9', brand: '小鹏', type: 'suv', image: 'https://img1.bitautoimg.com/bitauto/2023/08/25/45678901-bcde-f123-4567-890abcdef123.jpg' },
  { id: 'lixiang-l7', name: '理想 L7', brand: '理想', type: 'suv', image: 'https://img1.bitautoimg.com/bitauto/2023/09/10/56789012-cdef-1234-5678-90abcdef1234.jpg' },
  { id: 'lixiang-l9', name: '理想 L9', brand: '理想', type: 'suv', image: 'https://img1.bitautoimg.com/bitauto/2023/10/05/67890123-def1-2345-6789-0abcdef12345.jpg' },
  { id: 'avatr-11', name: '阿维塔 11', brand: '阿维塔', type: 'suv', image: 'https://img1.bitautoimg.com/bitauto/2023/11/15/78901234-ef12-3456-7890-abcdef123456.jpg' },
  { id: 'avatr-12', name: '阿维塔 12', brand: '阿维塔', type: 'sedan', image: 'https://img1.bitautoimg.com/bitauto/2023/12/20/89012345-f123-4567-890a-bcdef1234567.jpg' },
  { id: 'aion-s', name: '广汽埃安 S', brand: '广汽埃安', type: 'sedan', image: 'https://img1.bitautoimg.com/bitauto/2024/01/10/90123456-1234-5678-90ab-cdef12345678.jpg' },
  { id: 'aion-y', name: '广汽埃安 Y', brand: '广汽埃安', type: 'suv', image: 'https://img1.bitautoimg.com/bitauto/2024/02/15/01234567-2345-6789-0abc-def123456789.jpg' },
  { id: 'deepal-sl03', name: '深蓝 SL03', brand: '深蓝', type: 'sedan', image: 'https://img1.bitautoimg.com/bitauto/2024/03/20/12345678-3456-7890-abcd-ef1234567890.jpg' },
  { id: 'deepal-s7', name: '深蓝 S7', brand: '深蓝', type: 'suv', image: 'https://img1.bitautoimg.com/bitauto/2024/04/25/23456789-4567-890a-bcde-f12345678901.jpg' },
  { id: 'voyah-ziyou', name: '岚图 逍遥', brand: '岚图', type: 'suv', image: 'https://img1.bitautoimg.com/bitauto/2024/05/10/34567890-5678-90ab-cdef-123456789012.jpg' },
  { id: 'im-l7', name: '智己 L7', brand: '智己', type: 'sedan', image: 'https://img1.bitautoimg.com/bitauto/2024/06/15/45678901-6789-0abc-def1-234567890123.jpg' },
];

const WHEEL_STYLES = [
  { id: 'stock', name: '原厂轮毂', description: '保持原厂轮毂样式' },
  { id: 'sport', name: '运动轮毂', description: '多辐条运动风格' },
  { id: 'luxury', name: '豪华轮毂', description: '大尺寸豪华风格' },
  { id: 'forged', name: '锻造轮毂', description: '轻量化锻造工艺' },
  { id: 'racing', name: '赛道轮毂', description: '专业赛道风格' },
];

const PAINT_COLORS = [
  { id: 'midnight-black', name: '午夜黑', color: '#0a0a0a', description: '深邃神秘的黑色' },
  { id: 'pearl-white', name: '珍珠白', color: '#f5f5f5', description: '优雅纯净的白色' },
  { id: 'racing-red', name: '赛道红', color: '#c41e3a', description: '激情澎湃的红色' },
  { id: 'ocean-blue', name: '海洋蓝', color: '#0066cc', description: '深邃宁静的蓝色' },
  { id: 'forest-green', name: '森林绿', color: '#228b22', description: '自然清新的绿色' },
  { id: 'sunset-orange', name: '日落橙', color: '#ff6b35', description: '活力四射的橙色' },
  { id: 'royal-purple', name: '皇家紫', color: '#6b3fa0', description: '高贵典雅的紫色' },
  { id: 'titanium-gray', name: '钛金灰', color: '#4a5568', description: '科技感十足的灰色' },
  { id: 'champagne-gold', name: '香槟金', color: '#d4af37', description: '奢华大气的金色' },
  { id: 'matte-black', name: '哑光黑', color: '#1a1a1a', description: '低调内敛的哑光黑' },
];

const FINISH_TYPES = [
  { id: 'gloss', name: '亮面', description: '高光泽度，反射强烈' },
  { id: 'matte', name: '哑光', description: '低调内敛，质感独特' },
  { id: 'satin', name: '缎面', description: '介于亮面与哑光之间' },
  { id: 'chrome', name: '镀铬', description: '金属质感，高反射' },
  { id: 'carbon', name: '碳纤维', description: '轻量化，运动风格' },
];

const MODIFICATION_OPTIONS = [
  { id: 'lowered', name: '降低车身', description: '运动姿态，降低重心' },
  { id: 'widebody', name: '宽体套件', description: '更宽的轮距，更激进的外观' },
  { id: 'spoiler', name: '尾翼', description: '增加下压力，运动风格' },
  { id: 'diffuser', name: '扩散器', description: '优化空气动力学' },
  { id: 'side-skirts', name: '侧裙', description: '降低视觉重心' },
  { id: 'front-lip', name: '前唇', description: '增强前部运动感' },
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
  const [activeTab, setActiveTab] = useState('car');

  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [generationStartTime, setGenerationStartTime] = useState<number | null>(null);
  const [taskStatus, setTaskStatus] = useState<AITaskStatus | null>(null);
  const [downloadingImageId, setDownloadingImageId] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

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

  const buildPrompt = useCallback(() => {
    const parts: string[] = [];

    parts.push(`${selectedCar.name} (${selectedCar.brand})`);
    parts.push(`车身颜色: ${selectedColor.name} (${selectedFinish.name}漆面)`);
    parts.push(`轮毂: ${selectedWheel.name}`);

    if (selectedMods.length > 0) {
      const modNames = selectedMods
        .map((id) => MODIFICATION_OPTIONS.find((m) => m.id === id)?.name)
        .filter(Boolean);
      if (modNames.length > 0) {
        parts.push(`改装: ${modNames.join('、')}`);
      }
    }

    parts.push('高质量汽车摄影，专业打光，4K分辨率，细节丰富');

    return parts.join('，');
  }, [selectedCar, selectedColor, selectedFinish, selectedWheel, selectedMods]);

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
    if (!user) {
      setIsShowSignModal(true);
      return;
    }

    if (remainingCredits < costCredits) {
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
          model: 'wanx-v1',
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
        const parsedResult = parseTaskResult(data.taskInfo);
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

  return (
    <div className="min-h-screen bg-[#131022] text-white overflow-hidden font-[family-name:var(--font-sans)]">
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 bg-[#131022]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-10 h-10 rounded-full bg-[#4725f4] flex items-center justify-center shadow-[0_0_20px_rgba(71,37,244,0.5)]"
              whileHover={{ scale: 1.05 }}
            >
              <span className="material-icons text-white text-xl">speed</span>
            </motion.div>
            <span className="text-xl font-bold tracking-widest uppercase">CarMod AI</span>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <span className="text-sm text-white/60">积分: {remainingCredits}</span>
            ) : (
              <Button variant="ghost" onClick={() => setIsShowSignModal(true)}>
                登录
              </Button>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#4725f4] to-purple-400 bg-clip-text text-transparent">
              AI 汽车改装效果图生成器
            </h1>
            <p className="text-white/60 text-lg">选择车型、颜色、轮毂和改装选项，AI 为您生成逼真的改装效果图</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card className="bg-[#1c1833] border-white/5">
                <CardHeader>
                  <div className="flex gap-2">
                    {['car', 'color', 'wheels', 'mods'].map((tab) => (
                      <button
                        key={tab}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          activeTab === tab
                            ? 'bg-[#4725f4] text-white'
                            : 'bg-[#26233b] text-white/60 hover:text-white'
                        }`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab === 'car' && '车型'}
                        {tab === 'color' && '颜色'}
                        {tab === 'wheels' && '轮毂'}
                        {tab === 'mods' && '改装'}
                      </button>
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {activeTab === 'car' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {CHINESE_CAR_MODELS.map((car) => (
                        <motion.div
                          key={car.id}
                          className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                            selectedCar.id === car.id
                              ? 'border-[#4725f4] shadow-[0_0_20px_rgba(71,37,244,0.3)]'
                              : 'border-transparent hover:border-white/20'
                          }`}
                          onClick={() => setSelectedCar(car)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="aspect-[4/3] bg-[#26233b] relative">
                            <img
                              src={car.image}
                              alt={car.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&h=300&fit=crop';
                              }}
                            />
                          </div>
                          <div className="p-2 bg-[#1c1833]">
                            <p className="text-xs text-white/40">{car.brand}</p>
                            <p className="text-sm font-medium truncate">{car.name}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'color' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-sm font-medium text-white/60 mb-3">漆面类型</h3>
                        <div className="flex flex-wrap gap-2">
                          {FINISH_TYPES.map((finish) => (
                            <button
                              key={finish.id}
                              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                                selectedFinish.id === finish.id
                                  ? 'bg-[#4725f4] text-white'
                                  : 'bg-[#26233b] text-white/60 hover:text-white'
                              }`}
                              onClick={() => setSelectedFinish(finish)}
                            >
                              {finish.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-white/60 mb-3">车身颜色</h3>
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                          {PAINT_COLORS.map((color) => (
                            <motion.div
                              key={color.id}
                              className={`relative cursor-pointer group ${
                                selectedColor.id === color.id ? 'ring-2 ring-[#4725f4] ring-offset-2 ring-offset-[#1c1833]' : ''
                              }`}
                              onClick={() => setSelectedColor(color)}
                              whileHover={{ scale: 1.1 }}
                            >
                              <div
                                className="w-10 h-10 rounded-full shadow-lg"
                                style={{ backgroundColor: color.color }}
                              />
                              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                                {color.name}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'wheels' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                      {WHEEL_STYLES.map((wheel) => (
                        <motion.div
                          key={wheel.id}
                          className={`p-4 rounded-xl cursor-pointer transition-all ${
                            selectedWheel.id === wheel.id
                              ? 'bg-[#4725f4]/20 border border-[#4725f4]'
                              : 'bg-[#26233b] border border-white/5 hover:border-white/20'
                          }`}
                          onClick={() => setSelectedWheel(wheel)}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#1c1833] flex items-center justify-center">
                            <span className="material-icons text-[#4725f4]">album</span>
                          </div>
                          <p className="text-sm font-medium text-center">{wheel.name}</p>
                          <p className="text-xs text-white/40 text-center mt-1">{wheel.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'mods' && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {MODIFICATION_OPTIONS.map((mod) => (
                        <motion.div
                          key={mod.id}
                          className={`p-4 rounded-xl cursor-pointer transition-all ${
                            selectedMods.includes(mod.id)
                              ? 'bg-[#4725f4]/20 border border-[#4725f4]'
                              : 'bg-[#26233b] border border-white/5 hover:border-white/20'
                          }`}
                          onClick={() => toggleMod(mod.id)}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              selectedMods.includes(mod.id)
                                ? 'bg-[#4725f4] border-[#4725f4]'
                                : 'border-white/20'
                            }`}>
                              {selectedMods.includes(mod.id) && (
                                <span className="material-icons text-white text-xs">check</span>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{mod.name}</p>
                              <p className="text-xs text-white/40">{mod.description}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-[#1c1833] border-white/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ImageIcon className="w-5 h-5" />
                    生成的效果图
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedImages.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                      {generatedImages.map((image) => (
                        <div key={image.id} className="relative rounded-xl overflow-hidden border border-white/10">
                          <LazyImage
                            src={image.url}
                            alt={image.prompt || '生成的改装效果图'}
                            className="w-full h-auto"
                          />
                          <div className="absolute bottom-4 right-4">
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleDownloadImage(image)}
                              disabled={downloadingImageId === image.id}
                            >
                              {downloadingImageId === image.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Download className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="w-16 h-16 rounded-full bg-[#26233b] flex items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8 text-white/40" />
                      </div>
                      <p className="text-white/40">
                        {isGenerating ? '正在生成图片...' : '选择配置后点击生成按钮'}
                      </p>
                    </div>
                  )}

                  {isGenerating && (
                    <div className="mt-4 space-y-2 rounded-lg border border-white/10 p-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>生成进度</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} />
                      {taskStatusLabel && (
                        <p className="text-xs text-white/40 text-center">{taskStatusLabel}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-[#1c1833] border-white/5 sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">配置预览</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-white/60 text-sm">车型</span>
                      <span className="font-medium">{selectedCar.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-white/60 text-sm">颜色</span>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: selectedColor.color }}
                        />
                        <span>{selectedColor.name} ({selectedFinish.name})</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                      <span className="text-white/60 text-sm">轮毂</span>
                      <span>{selectedWheel.name}</span>
                    </div>
                    {selectedMods.length > 0 && (
                      <div className="py-2 border-b border-white/5">
                        <span className="text-white/60 text-sm block mb-2">改装</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedMods.map((id) => {
                            const mod = MODIFICATION_OPTIONS.find((m) => m.id === id);
                            return mod ? (
                              <span
                                key={id}
                                className="px-2 py-1 bg-[#4725f4]/20 text-[#4725f4] text-xs rounded"
                              >
                                {mod.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#4725f4]">消耗积分</span>
                      <span>{costCredits}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/60">剩余积分</span>
                      <span>{remainingCredits}</span>
                    </div>
                  </div>

                  {!isMounted ? (
                    <Button className="w-full" disabled>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      加载中...
                    </Button>
                  ) : isCheckSign ? (
                    <Button className="w-full" disabled>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      检查账户...
                    </Button>
                  ) : user ? (
                    <Button
                      className="w-full bg-[#4725f4] hover:bg-[#361bb8]"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          生成中...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          生成效果图
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => setIsShowSignModal(true)}>
                      登录后生成
                    </Button>
                  )}

                  {user && remainingCredits < costCredits && (
                    <Link href="/pricing">
                      <Button variant="outline" className="w-full">
                        充值积分
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="mt-8 rounded-xl border border-white/10 bg-[#1c1833]/70 p-4 text-xs leading-relaxed text-white/60">
            声明：页面中出现的汽车品牌、车型名称及商标仅用于识别与兼容性说明。CarModSnap
            为独立服务，除非另有明确说明，不隶属于、也不代表任何汽车制造商或商标权利人。
          </div>
        </div>
      </main>

      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    </div>
  );
}
