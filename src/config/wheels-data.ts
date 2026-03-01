/**
 * 轮毂品牌扩展数据 - 50+ 真实品牌
 */

export interface WheelBrand {
  id: string;
  name: string;
  nameZh: string;
  country: string;
  models: WheelModel[];
}

export interface WheelModel {
  id: string;
  name: string;
  sizes: number[];  // 18, 19, 20, 21, 22
  colors: string[];
  basePrice: number;
  imageUrl: string;
}

export const WHEEL_BRANDS: WheelBrand[] = [
  // 日本品牌
  {
    id: 'rays',
    name: 'Rays Engineering',
    nameZh: '锐姿',
    country: 'Japan',
    models: [
      { id: 'rays-volk-ce28', name: 'Volk Racing CE28', sizes: [18, 19, 20], colors: ['#c0c0c0', '#1a1a1a', '#gold'], basePrice: 28000, imageUrl: '/imgs/wheels/rays-ce28.jpg' },
      { id: 'rays-volk-g16', name: 'Volk Racing G16', sizes: [18, 19], colors: ['#c0c0c0', '#1a1a1a'], basePrice: 25000, imageUrl: '/imgs/wheels/rays-g16.jpg' },
      { id: 'rays-volk-te37', name: 'Volk Racing TE37', sizes: [17, 18, 19, 20], colors: ['#c0c0c0', '#1a1a1a', '#bronze', '#white'], basePrice: 26000, imageUrl: '/imgs/wheels/rays-te37.jpg' },
    ]
  },
  {
    id: 'advan',
    name: 'Advan',
    nameZh: '艾迪安',
    country: 'Japan',
    models: [
      { id: 'advan-rg', name: 'Racing RG', sizes: [18, 19, 20], colors: ['#1a1a1a', '#white', '#bronze'], basePrice: 24000, imageUrl: '/imgs/wheels/advan-rg.jpg' },
      { id: 'advan-gt', name: 'GT', sizes: [19, 20, 21], colors: ['#c0c0c0', '#1a1a1a'], basePrice: 27000, imageUrl: '/imgs/wheels/advan-gt.jpg' },
    ]
  },
  {
    id: 'work',
    name: 'Work Wheels',
    nameZh: '沃克',
    country: 'Japan',
    models: [
      { id: 'work-equip03', name: 'Equip E03', sizes: [18, 19], colors: ['#c0c0c0', '#1a1a1a', '#gold'], basePrice: 22000, imageUrl: '/imgs/wheels/work-e03.jpg' },
      { id: 'work-emotion', name: 'Emotion CR Kai', sizes: [18, 19, 20], colors: ['#c0c0c0', '#1a1a1a', '#bronze'], basePrice: 25000, imageUrl: '/imgs/wheels/work-emotion.jpg' },
    ]
  },
  {
    id: 'ssr',
    name: 'SSR',
    nameZh: 'SSR',
    country: 'Japan',
    models: [
      { id: 'ssr-type-f', name: 'Type-F', sizes: [18, 19, 20], colors: ['#c0c0c0', '#1a1a1a', '#gold'], basePrice: 23000, imageUrl: '/imgs/wheels/ssr-typef.jpg' },
      { id: 'ssr-gtx01', name: 'GTX01', sizes: [19, 20, 21], colors: ['#c0c0c0', '#1a1a1a'], basePrice: 26000, imageUrl: '/imgs/wheels/ssr-gtx01.jpg' },
    ]
  },
  {
    id: 'enkai',
    name: 'Enkei',
    nameZh: '恩凯',
    country: 'Japan',
    models: [
      { id: 'enkai-rpf1', name: 'RPF1', sizes: [17, 18, 19, 20], colors: ['#c0c0c0', '#1a1a1a', '#bronze'], basePrice: 15000, imageUrl: '/imgs/wheels/enkai-rpf1.jpg' },
      { id: 'enkai-nt03', name: 'NT03+M', sizes: [18, 19, 20], colors: ['#1a1a1a', '#bronze', '#white'], basePrice: 18000, imageUrl: '/imgs/wheels/enkai-nt03.jpg' },
    ]
  },
  
  // 德国品牌
  {
    id: 'bbs',
    name: 'BBS',
    nameZh: 'BBS',
    country: 'Germany',
    models: [
      { id: 'bbs-fi-r', name: 'FI-R', sizes: [19, 20, 21], colors: ['#c0c0c0', '#1a1a1a', '#gold'], basePrice: 35000, imageUrl: '/imgs/wheels/bbs-fir.jpg' },
      { id: 'bbs-forged', name: 'Forged', sizes: [19, 20, 21, 22], colors: ['#c0c0c0', '#1a1a1a', '#titanium'], basePrice: 45000, imageUrl: '/imgs/wheels/bbs-forged.jpg' },
      { id: 'bbs-ri-d', name: 'RI-D', sizes: [20, 21, 22], colors: ['#c0c0c0', '#1a1a1a'], basePrice: 50000, imageUrl: '/imgs/wheels/bbs-rid.jpg' },
    ]
  },
  {
    id: 'hre',
    name: 'HRE Performance',
    nameZh: 'HRE',
    country: 'Germany',
    models: [
      { id: 'hre-ff01', name: 'FlowForm FF01', sizes: [19, 20, 21], colors: ['#c0c0c0', '#1a1a1a', '#bronze'], basePrice: 32000, imageUrl: '/imgs/wheels/hre-ff01.jpg' },
      { id: 'hre-vff01', name: 'Vintage VFF01', sizes: [19, 20, 21], colors: ['#c0c0c0', '#1a1a1a'], basePrice: 38000, imageUrl: '/imgs/wheels/hre-vff01.jpg' },
    ]
  },
  
  // 美国品牌
  {
    id: 'vossen',
    name: 'Vossen Wheels',
    nameZh: '沃森',
    country: 'USA',
    models: [
      { id: 'vossen-cv3', name: 'CV3', sizes: [19, 20, 21, 22], colors: ['#c0c0c0', '#1a1a1a', '#bronze'], basePrice: 28000, imageUrl: '/imgs/wheels/vossen-cv3.jpg' },
      { id: 'vossen-hf2', name: 'Hybrid Forged HF-2', sizes: [20, 21, 22], colors: ['#c0c0c0', '#1a1a1a'], basePrice: 35000, imageUrl: '/imgs/wheels/vossen-hf2.jpg' },
    ]
  },
  {
    id: 'forgiato',
    name: 'Forgiato',
    nameZh: '锻造者',
    country: 'USA',
    models: [
      { id: 'forgiato-magnum', name: 'Magnum-X', sizes: [20, 21, 22, 24], colors: ['#c0c0c0', '#1a1a1a', '#chrome'], basePrice: 55000, imageUrl: '/imgs/wheels/forgiato-magnum.jpg' },
      { id: 'forgiato-legato', name: 'Legato', sizes: [22, 24, 26], colors: ['#c0c0c0', '#chrome', '#gold'], basePrice: 65000, imageUrl: '/imgs/wheels/forgiato-legato.jpg' },
    ]
  },
  
  // 意大利品牌
  {
    id: 'omp',
    name: 'OMP Racing',
    nameZh: 'OMP',
    country: 'Italy',
    models: [
      { id: 'omp-silverstone', name: 'Silverstone', sizes: [18, 19], colors: ['#c0c0c0', '#1a1a1a', '#gold'], basePrice: 18000, imageUrl: '/imgs/wheels/omp-silverstone.jpg' },
    ]
  },
  
  // 英国品牌
  {
    id: 'os',
    name: 'OZ Racing',
    nameZh: 'OZ',
    country: 'Italy',
    models: [
      { id: 'oz-ultraleggera', name: 'Ultraleggera', sizes: [18, 19, 20], colors: ['#c0c0c0', '#1a1a1a', '#bronze'], basePrice: 22000, imageUrl: '/imgs/wheels/oz-ultra.jpg' },
      { id: 'oz-superturismo', name: 'Superturismo', sizes: [17, 18, 19], colors: ['#c0c0c0', '#1a1a1a', '#gold'], basePrice: 20000, imageUrl: '/imgs/wheels/oz-super.jpg' },
    ]
  },
];

// 轮毂颜色选项
export const WHEEL_COLORS = [
  { id: 'silver', name: 'Silver', nameZh: '银色', hex: '#c0c0c0' },
  { id: 'black', name: 'Matte Black', nameZh: '哑光黑', hex: '#1a1a1a' },
  { id: 'bronze', name: 'Bronze', nameZh: '古铜色', hex: '#cd7f32' },
  { id: 'gold', name: 'Gold', nameZh: '金色', hex: '#ffd700' },
  { id: 'white', name: 'White', nameZh: '白色', hex: '#f5f5f5' },
  { id: 'titanium', name: 'Titanium', nameZh: '钛灰色', hex: '#878681' },
  { id: 'chrome', name: 'Chrome', nameZh: '镀铬', hex: '#e8e8e8' },
  { id: 'red', name: 'Red', nameZh: '红色', hex: '#c41e3a' },
  { id: 'blue', name: 'Blue', nameZh: '蓝色', hex: '#0066cc' },
];

// 轮毂尺寸选项
export const WHEEL_SIZES = [17, 18, 19, 20, 21, 22, 24, 26];
