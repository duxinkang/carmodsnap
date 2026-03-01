'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';

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
}

interface SearchResponse {
  list: Shop[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface NearbyResponse {
  list: Shop[];
  total: number;
  location: {
    latitude: string;
    longitude: string;
    source: string;
  };
}

export default function ShopsSearchPage() {
  const t = useTranslations('pages.carmodder');
  const searchParams = useSearchParams();
  const router = useRouter();

  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const [sortBy, setSortBy] = useState<'rating' | 'distance' | 'reviews'>('rating');
  const [certifiedOnly, setCertifiedOnly] = useState(false);

  // 自动定位状态
  const [autoLocation, setAutoLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ city?: string; latitude?: string; longitude?: string }>({});

  // 从 URL 参数获取搜索条件
  const city = searchParams.get('city') || '';
  const state = searchParams.get('state') || '';
  const serviceType = searchParams.get('service') || '';
  const postalCode = searchParams.get('postal') || '';

  useEffect(() => {
    // 如果没有搜索条件，自动获取用户位置并搜索附近店铺
    if (!city && !state && !postalCode) {
      setAutoLocation(true);
      fetchNearbyShops();
    } else {
      fetchShops();
    }
  }, [city, state, serviceType, postalCode, sortBy, certifiedOnly]);

  const fetchNearbyShops = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/shops/nearby');
      const result = await response.json();

      if (result.code === 0) {
        setShops(result.data.list || []);
        setTotal(result.data.total || 0);
        setUserLocation({
          latitude: result.data.location?.latitude,
          longitude: result.data.location?.longitude,
        });
      } else {
        setError(result.message || t('noShopsFound'));
      }
    } catch (e: any) {
      console.error('Failed to fetch nearby shops:', e);
      setError(t('noShopsFound'));
    } finally {
      setLoading(false);
      setAutoLocation(false);
    }
  };

  const fetchShops = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (city) params.set('city', city);
      if (state) params.set('state', state);
      if (postalCode) params.set('postal_code', postalCode);
      if (serviceType) params.set('service_type', serviceType);
      if (certifiedOnly) params.set('certified', 'true');
      params.set('sort_by', sortBy);

      const response = await fetch(`/api/shops/search?${params.toString()}`);
      const result = await response.json();

      if (result.code === 0) {
        setShops(result.data.list || []);
        setTotal(result.data.total || 0);
      } else {
        setError(result.message || t('noShopsFound'));
      }
    } catch (e: any) {
      console.error('Failed to fetch shops:', e);
      setError(t('noShopsFound'));
    } finally {
      setLoading(false);
    }
  };

  // 使用浏览器地理定位
  const useBrowserLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // 直接跳转到 nearby API
        router.push(`/shops?lat=${latitude}&lng=${longitude}&auto=1`);
      },
      (error) => {
        console.error('Failed to get browser location:', error);
        // 即使定位失败，也尝试使用 IP 定位
        fetchNearbyShops();
      }
    );
  };

  const handleSortChange = (value: 'rating' | 'distance' | 'reviews') => {
    setSortBy(value);
  };

  const formatRating = (rating: number) => {
    return (rating / 100).toFixed(1);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/#find-shop"
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <span className="material-icons text-sm">arrow_back</span>
              {t('backToSearch')}
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {autoLocation ? t('loadingShops') : t('shopsPageTitle')}
              </h1>
              <p className="text-gray-400">
                {autoLocation
                  ? 'Detecting your location...'
                  : t('shopsPageDescription')}
              </p>
            </div>
            {!autoLocation && (
              <button
                onClick={useBrowserLocation}
                className="px-4 py-2 bg-[#4725f4] hover:bg-[#361bb8] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
              >
                <span className="material-icons text-sm">my_location</span>
                {t('useCurrentLocation')}
              </button>
            )}
          </div>
        </motion.div>

        {/* Search Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#131022] border border-white/5 rounded-xl p-6 mb-8"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              {city && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#4725f4]/20 text-[#4725f4] text-sm">
                  <span className="material-icons text-sm">location_on</span>
                  {city}{state && `, ${state}`}
                </span>
              )}
              {serviceType && (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#4725f4]/20 text-[#4725f4] text-sm">
                  <span className="material-icons text-sm">format_paint</span>
                  {t(serviceType) || serviceType}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-400">{t('sortBy')}:</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value as any)}
                className="bg-[#1c1830] border border-slate-700 text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#4725f4]"
              >
                <option value="rating">{t('sortByRating')}</option>
                <option value="distance">{t('sortByDistance')}</option>
                <option value="reviews">{t('sortByReviews')}</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={certifiedOnly}
                  onChange={(e) => setCertifiedOnly(e.target.checked)}
                  className="rounded border-slate-700 bg-[#1c1830] text-[#4725f4] focus:ring-[#4725f4]"
                />
                {t('certifiedShopsOnly')}
              </label>
            </div>
          </div>
        </motion.div>

        {/* Results */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4725f4]"></div>
            <span className="ml-4 text-gray-400">{t('loadingShops')}</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <span className="material-icons text-6xl text-gray-600 mb-4">store</span>
            <h3 className="text-xl font-bold text-white mb-2">{t('noShopsFound')}</h3>
            <p className="text-gray-400">{t('tryDifferentSearch')}</p>
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-icons text-6xl text-gray-600 mb-4">store</span>
            <h3 className="text-xl font-bold text-white mb-2">{t('noShopsFound')}</h3>
            <p className="text-gray-400">{t('tryDifferentSearch')}</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-gray-400">
                {t('searchResults')}: {total} {t('shopReviews')}
              </div>
              {autoLocation && (
                <div className="text-xs text-[#4725f4] flex items-center gap-1">
                  <span className="material-icons text-xs">public</span>
                  {t('fromIP')}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop, index) => (
                <motion.div
                  key={shop.id}
                  className="group relative bg-[#131022] border border-white/5 rounded-xl overflow-hidden hover:border-[#4725f4]/50 transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {/* Shop Image */}
                  <div className="aspect-[16/9] overflow-hidden bg-[#1c1830]">
                    {shop.images ? (
                      <img
                        src={JSON.parse(shop.images)[0] || '/placeholder-shop.jpg'}
                        alt={shop.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-icons text-6xl text-gray-600">store</span>
                      </div>
                    )}
                    {shop.certified && (
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#4725f4] text-white text-xs font-bold">
                          <span className="material-icons text-xs">verified</span>
                          Certified
                        </span>
                      </div>
                    )}
                    {shop.featured && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/90 text-black text-xs font-bold">
                          <span className="material-icons text-xs">star</span>
                          Featured
                        </span>
                      </div>
                    )}
                    {shop.source && (
                      <div className="absolute bottom-3 right-3">
                        <span className="px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium flex items-center gap-1">
                          <span className="material-icons text-xs">public</span>
                          {shop.source === 'google'
                            ? 'Google'
                            : shop.source === 'demo'
                              ? 'Demo Data'
                              : 'OSM'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Shop Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-white truncate">{shop.name}</h3>
                        <p className="text-sm text-gray-400 truncate">
                          {shop.city}{shop.state && `, ${shop.state}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 ml-2">
                        <span className="material-icons text-yellow-500 text-sm">star</span>
                        <span className="text-sm font-bold text-white">
                          {shop.source === 'demo' ? 'N/A' : formatRating(shop.rating)}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                      {shop.description || ''}
                    </p>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xs text-gray-500">
                        {shop.source === 'demo'
                          ? (t('demoDataNotice') || 'Demo data')
                          : `${shop.reviewCount} ${t('shopReviews')}`}
                      </span>
                      <span className="text-xs text-gray-600">•</span>
                      <span className="text-xs text-gray-500">
                        {shop.serviceCount} {t('shopServices')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/shops/${shop.slug}`}
                        className="flex-1 px-4 py-2 bg-[#4725f4] hover:bg-[#361bb8] text-white text-sm font-medium rounded-lg transition-colors text-center"
                      >
                        {t('viewShopDetail')}
                      </Link>
                      {shop.phone && (
                        <a
                          href={`tel:${shop.phone}`}
                          className="px-4 py-2 bg-[#1c1830] hover:bg-[#26233b] text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1"
                        >
                          <span className="material-icons text-sm">phone</span>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    </div>
  );
}
