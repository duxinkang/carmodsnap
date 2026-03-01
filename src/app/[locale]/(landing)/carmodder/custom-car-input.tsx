/**
 * 自定义车型输入组件
 */
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Card, CardContent } from '@/shared/components/ui/card';
import { cn } from '@/shared/lib/utils';

export interface CustomCarInputData {
  brand: string;
  model: string;
  year: number;
  type: string;
  imageUrl?: string;
  imageDataUrl?: string;
  description?: string;
}

interface CustomCarInputProps {
  onSubmit: (data: CustomCarInputData) => void;
  onCancel: () => void;
}

const CAR_TYPES = [
  { id: 'sedan', name: 'Sedan', nameZh: '轿车' },
  { id: 'coupe', name: 'Coupe', nameZh: '轿跑' },
  { id: 'suv', name: 'SUV', nameZh: 'SUV' },
  { id: 'hatchback', name: 'Hatchback', nameZh: '掀背车' },
  { id: 'roadster', name: 'Roadster', nameZh: '跑车' },
  { id: 'sports', name: 'Sports Car', nameZh: '性能车' },
  { id: 'truck', name: 'Truck', nameZh: '皮卡' },
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 30 }, (_, i) => CURRENT_YEAR - i);

export function CustomCarInput({ 
  onSubmit, 
  onCancel
}: CustomCarInputProps) {
  const t = useTranslations('pages.carmodder');
  const locale = useLocale();
  const isZh = locale === 'zh';

  const [formData, setFormData] = useState<CustomCarInputData>({
    brand: '',
    model: '',
    year: CURRENT_YEAR,
    type: 'sedan',
  });
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = () => {
    if (!formData.brand || !formData.model) return;
    onSubmit(formData);
  };

  const toDataUrl = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(new Error('read file failed'));
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error(isZh ? '请上传图片文件' : 'Please upload an image file');
      return;
    }

    setIsUploading(true);
    try {
      const imageDataUrl = await toDataUrl(file);
      const form = new FormData();
      form.append('files', file);

      const resp = await fetch('/api/storage/upload-image', {
        method: 'POST',
        body: form,
      });

      if (!resp.ok) {
        throw new Error(`Upload failed: ${resp.status}`);
      }

      const result = await resp.json();
      const uploadedUrl = result?.data?.urls?.[0];
      if (result?.code !== 0 || !uploadedUrl) {
        throw new Error(result?.message || 'Upload failed');
      }

      setFormData((prev) => ({ ...prev, imageUrl: uploadedUrl, imageDataUrl }));
      toast.success(isZh ? '图片上传成功' : 'Image uploaded');
    } catch (error: any) {
      toast.error(
        isZh
          ? `图片上传失败：${error?.message || ''}`
          : `Upload failed: ${error?.message || ''}`
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 p-6 rounded-2xl bg-card text-foreground border border-border shadow-xl"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">{t('customInput.title')}</h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>{t('customInput.brand')}</Label>
          <Input
            placeholder={t('customInput.brandPlaceholder')}
            value={formData.brand}
            onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label>{t('customInput.model')}</Label>
          <Input
            placeholder={t('customInput.modelPlaceholder')}
            value={formData.model}
            onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
            className="bg-background border-border text-foreground"
          />
        </div>
        <div className="space-y-2">
          <Label>{t('customInput.year')}</Label>
          <Select
            value={String(formData.year)}
            onValueChange={(value) => setFormData(prev => ({ ...prev, year: Number(value) }))}
          >
            <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
            <SelectContent>
              {YEARS.map(year => (
                <SelectItem key={year} value={String(year)}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>{t('customInput.type')}</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
          >
            <SelectTrigger className="bg-background border-border text-foreground"><SelectValue /></SelectTrigger>
            <SelectContent>
              {CAR_TYPES.map(type => (
                <SelectItem key={type.id} value={type.id}>{isZh ? type.nameZh : type.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t('customInput.description')}</Label>
        <Textarea
          placeholder={t('customInput.descriptionPlaceholder')}
          value={formData.description || ''}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="bg-background border-border text-foreground"
        />
      </div>

      <div className="space-y-2">
        <Label>{t('customInput.uploadImage')}</Label>
        <Card className="border-dashed bg-background/50 border-border">
          <CardContent className="p-6">
            {formData.imageUrl ? (
              <div className="relative">
                <img src={formData.imageUrl} alt="Preview" className="w-48 h-32 object-cover rounded-lg" />
                <Button size="sm" variant="destructive" className="absolute -top-2 -right-2"
                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: undefined }))}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center cursor-pointer">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {isUploading ? (isZh ? '上传中...' : 'Uploading...') : t('customInput.clickToUpload')}
                </span>
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3 pt-4">
        <Button variant="secondary" className="flex-1" onClick={onCancel}>{t('customInput.cancel')}</Button>
        <Button className="flex-1 bg-primary text-primary-foreground hover:opacity-90"
          onClick={handleSubmit} disabled={!formData.brand || !formData.model || isUploading}>
          {t('customInput.startModding')}
        </Button>
      </div>
    </motion.div>
  );
}
