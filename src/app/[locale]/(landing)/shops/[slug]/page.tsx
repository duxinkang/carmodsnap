'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  Globe,
  Info,
  Mail,
  MapPin,
  Phone,
  Quote,
  Send,
  Star,
  Store,
  Verified,
} from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: string | null;
  images: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  address: string;
  city: string;
  state: string | null;
  country: string;
  postalCode: string | null;
  latitude: string | null;
  longitude: string | null;
  rating: number;
  reviewCount: number;
  serviceCount: number;
  certified: boolean;
  featured: boolean;
  source?: string;
  services?: ShopService[];
  reviews?: ShopReview[];
}

interface ShopService {
  id: string;
  name: string;
  description?: string | null;
  priceFrom?: number | null;
  priceTo?: number | null;
}

interface ShopReview {
  id: string;
  userId?: string | null;
  rating: number;
  createdAt: string;
  serviceType?: string | null;
  title?: string | null;
  content: string;
}

interface ShopDetailResponse {
  code: number;
  message?: string;
  data: {
    shop: Shop;
  };
}

interface QuoteResponse {
  code: number;
  message?: string;
}

export default function ShopDetailPage() {
  const t = useTranslations('pages.carmodder');
  const params = useParams();
  const slug = params.slug as string;

  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [showQuoteForm, setShowQuoteForm] = useState(false);

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    vehicleYear: '',
    vehicleMake: '',
    vehicleModel: '',
    serviceType: '',
    description: '',
    budget: '',
    timeline: 'flexible',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const fetchShop = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/shops/${slug}`);
      const result = (await response.json()) as ShopDetailResponse;

      if (result.code === 0) {
        setShop(result.data.shop);
      } else {
        setError(result.message || 'Failed to load shop');
      }
    } catch (error: unknown) {
      console.error('Failed to fetch shop:', error);
      setError('Failed to load shop');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchShop();
  }, [fetchShop]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/shops/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          location: shop ? `${shop.city}, ${shop.state}` : '',
        }),
      });
      const result = (await response.json()) as QuoteResponse;

      if (result.code === 0) {
        setSubmitResult({ success: true, message: t('quoteRequestSuccess') });
        setFormData({
          name: '',
          email: '',
          phone: '',
          vehicleYear: '',
          vehicleMake: '',
          vehicleModel: '',
          serviceType: '',
          description: '',
          budget: '',
          timeline: 'flexible',
        });
      } else {
        setSubmitResult({ success: false, message: result.message || t('quoteRequestError') });
      }
    } catch (error: unknown) {
      console.error('Failed to submit quote:', error);
      setSubmitResult({ success: false, message: t('quoteRequestError') });
    } finally {
      setSubmitting(false);
    }
  };

  const formatRating = (rating: number) => {
    return (rating / 100).toFixed(1);
  };

  const getImages = () => {
    if (!shop?.images) return [];
    try {
      return JSON.parse(shop.images);
    } catch {
      return [];
    }
  };

  const images = getImages();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4725f4] mx-auto mb-4"></div>
          <p className="text-gray-400">{t('loadingShops')}</p>
        </div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-gray-600" />
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-400">{error || 'Shop not found'}</p>
          <Link href="/shops" className="mt-4 inline-block text-[#4725f4] hover:text-white">
            {t('backToSearch')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {images.length > 0 ? (
          <>
            <Image
              src={images[activeImage]}
              alt={shop.name}
              className="w-full h-full object-cover"
              fill
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent"></div>
          </>
        ) : (
          <div className="w-full h-full bg-[#131022] flex items-center justify-center">
            <Store className="h-24 w-24 text-gray-700" />
          </div>
        )}

        {/* Thumbnail Navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img: string, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                  activeImage === idx ? 'border-[#4725f4]' : 'border-white/20 hover:border-white/40'
                }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx}`}
                  className="w-full h-full object-cover"
                  width={64}
                  height={48}
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Back Button */}
        <Link
          href="/shops"
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-sm rounded-full text-white hover:bg-black/70 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToSearch')}
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#131022] border border-white/5 rounded-2xl p-8 mb-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-white">{shop.name}</h1>
                    {shop.certified && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#4725f4] text-white text-xs font-bold">
                        <Verified className="h-3 w-3" />
                        Certified
                      </span>
                    )}
                    {shop.featured && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500 text-black text-xs font-bold">
                        <Star className="h-3 w-3" />
                        Featured
                      </span>
                    )}
                    {shop.source === 'demo' && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-700 text-white text-xs font-bold">
                        <Info className="h-3 w-3" />
                        Demo Data
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {shop.address}, {shop.city}{shop.state && `, ${shop.state}`} {shop.postalCode}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                    <span className="text-2xl font-bold text-white">
                      {shop.source === 'demo' ? 'N/A' : formatRating(shop.rating)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {shop.source === 'demo'
                      ? (t('demoDataNotice') || 'Demo data')
                      : `${shop.reviewCount} ${t('shopReviews')}`}
                  </p>
                </div>
              </div>

              {shop.description && (
                <p className="text-gray-400 leading-relaxed mb-6">
                  {shop.description}
                </p>
              )}

              {/* Services */}
              {shop.services && shop.services.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white mb-4">{t('shopServices')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {shop.services.map((service) => (
                      <div
                        key={service.id}
                        className="flex items-center justify-between p-4 bg-[#1c1830] rounded-lg"
                      >
                        <div>
                          <p className="text-white font-medium">{service.name}</p>
                          {service.description && (
                            <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                          )}
                        </div>
                        {service.priceFrom && (
                          <p className="text-[#4725f4] font-bold">
                            ${service.priceFrom / 100}
                            {service.priceTo && ` - $${service.priceTo / 100}`}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Contact Info */}
              <div className="border-t border-white/10 pt-6">
                <h3 className="text-lg font-bold text-white mb-4">{t('contactInfo')}</h3>
                <div className="space-y-3">
                  {shop.phone && (
                    <a href={`tel:${shop.phone}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                      <Phone className="h-4 w-4" />
                      {shop.phone}
                    </a>
                  )}
                  {shop.email && (
                    <a href={`mailto:${shop.email}`} className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                      <Mail className="h-4 w-4" />
                      {shop.email}
                    </a>
                  )}
                  {shop.website && (
                    <a href={shop.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors">
                      <Globe className="h-4 w-4" />
                      {shop.website}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Reviews */}
            {shop.reviews && shop.reviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#131022] border border-white/5 rounded-2xl p-8"
              >
                <h3 className="text-xl font-bold text-white mb-6">{t('customerReviews')}</h3>
                <div className="space-y-4">
                  {shop.reviews.map((review) => (
                    <div key={review.id} className="p-4 bg-[#1c1830] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-[#4725f4]/20 flex items-center justify-center text-[#4725f4] font-bold">
                            {review.userId?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">Anonymous</span>
                              <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? 'text-yellow-500' : 'text-gray-600'
                                    }`}
                                    fill="currentColor"
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {review.serviceType && (
                          <span className="text-xs text-gray-500">{t(review.serviceType)}</span>
                        )}
                      </div>
                      {review.title && (
                        <p className="text-white font-medium mb-2">{review.title}</p>
                      )}
                      <p className="text-gray-400 text-sm">{review.content}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Quote Form Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#131022] border border-white/5 rounded-2xl p-6 sticky top-24"
            >
              <button
                onClick={() => setShowQuoteForm(!showQuoteForm)}
                className="w-full py-4 bg-[#4725f4] hover:bg-[#361bb8] text-white font-bold rounded-xl transition-colors mb-6 flex items-center justify-center gap-2"
              >
                <Quote className="h-5 w-5" />
                {showQuoteForm ? t('viewShopDetail') : t('requestQuote')}
              </button>

              {showQuoteForm && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="text-lg font-bold text-white mb-4">{t('quoteDetailTitle')}</h3>

                  {submitResult && (
                    <div className={`p-4 rounded-lg text-sm ${
                      submitResult.success
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {submitResult.message}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">{t('contactName')}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-[#1c1830] border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#4725f4]"
                      placeholder={t('contactName')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">{t('contactEmail')}</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#1c1830] border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#4725f4]"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">{t('contactPhone')}</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-[#1c1830] border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#4725f4]"
                      placeholder="(555) 123-4567"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">{t('vehicleYear')}</label>
                      <input
                        type="text"
                        name="vehicleYear"
                        value={formData.vehicleYear}
                        onChange={handleInputChange}
                        className="w-full bg-[#1c1830] border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#4725f4]"
                        placeholder="2024"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-1">{t('vehicleMake')}</label>
                      <input
                        type="text"
                        name="vehicleMake"
                        value={formData.vehicleMake}
                        onChange={handleInputChange}
                        className="w-full bg-[#1c1830] border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#4725f4]"
                        placeholder="Toyota"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">{t('vehicleModel_detail')}</label>
                    <input
                      type="text"
                      name="vehicleModel"
                      value={formData.vehicleModel}
                      onChange={handleInputChange}
                      className="w-full bg-[#1c1830] border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#4725f4]"
                      placeholder="Supra"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">{t('serviceType')}</label>
                    <select
                      name="serviceType"
                      value={formData.serviceType}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#1c1830] border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#4725f4]"
                    >
                      <option value="">{t('selectCarModel')}</option>
                      <option value="full_wrap">{t('fullColorChange')}</option>
                      <option value="chrome_delete">{t('chromeDelete')}</option>
                      <option value="ppf">{t('paintProtection')}</option>
                      <option value="tint">{t('windowTint')}</option>
                      <option value="ceramic">{t('ceramicCoating')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">{t('projectDescription')}</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full bg-[#1c1830] border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#4725f4] resize-none"
                      placeholder={t('projectDescription')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">{t('projectTimeline')}</label>
                    <select
                      name="timeline"
                      value={formData.timeline}
                      onChange={handleInputChange}
                      className="w-full bg-[#1c1830] border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#4725f4]"
                    >
                      <option value="asap">{t('asap')}</option>
                      <option value="withinWeek">{t('withinWeek')}</option>
                      <option value="withinMonth">{t('withinMonth')}</option>
                      <option value="flexible">{t('flexible')}</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 bg-[#4725f4] hover:bg-[#361bb8] disabled:bg-gray-600 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        {t('submitQuoteRequest')}
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
