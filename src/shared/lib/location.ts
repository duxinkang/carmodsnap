/**
 * 根据 IP 地址获取用户位置信息
 */
export async function getLocationByIP(ip?: string): Promise<{
  city?: string;
  region?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
} | null> {
  try {
    // 使用多个免费 IP 定位服务的回退方案
    const services = [
      // ipapi.co - 无需 API key，限制 1000 次/天
      () => fetch(`https://ipapi.co/${ip || 'json'}/json/`).then(r => r.json()),
      // ip-api.com - 免费，非商业用途
      () => fetch(`http://ip-api.com/json/${ip || ''}`).then(r => r.json()),
      // ipwhois.app - 免费，限制 1000 次/天
      () => fetch(`https://ipwhois.app/json/${ip || ''}`).then(r => r.json()),
    ];

    for (const getService of services) {
      try {
        const data = await getService();
        if (data && (data.city || data.latitude)) {
          return {
            city: data.city,
            region: data.region || data.state,
            country: data.country_name || data.country,
            latitude: data.latitude,
            longitude: data.longitude,
            timezone: data.timezone,
          };
        }
      } catch (e) {
        console.log('IP location service failed, trying next:', e);
        continue;
      }
    }

    return null;
  } catch (e) {
    console.error('Failed to get location by IP:', e);
    return null;
  }
}

/**
 * 使用 Google Places API 搜索附近的店铺
 * 需要配置 GOOGLE_PLACES_API_KEY 环境变量
 */
export async function searchShopsByGooglePlaces(
  latitude: number,
  longitude: number,
  radius: number = 5000, // 米
  keyword: string = 'car wrap shop'
): Promise<Array<{
  name: string;
  address: string;
  phone?: string;
  website?: string;
  rating?: number;
  userRatingsTotal?: number;
  placeId: string;
  latitude: number;
  longitude: number;
}>> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;

  if (!apiKey) {
    console.warn('GOOGLE_PLACES_API_KEY not configured');
    return [];
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&keyword=${encodeURIComponent(keyword)}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Google Places API error:', data);
      return [];
    }

    return data.results.map((place: any) => ({
      name: place.name,
      address: place.vicinity,
      phone: place.formatted_phone_number,
      website: place.website,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      placeId: place.place_id,
      latitude: place.geometry.location.lat,
      longitude: place.geometry.location.lng,
    }));
  } catch (e) {
    console.error('Failed to search Google Places:', e);
    return [];
  }
}

/**
 * 使用 OpenStreetMap Overpass API 搜索附近的汽车服务店
 * 免费，无需 API key
 */
export async function searchShopsByOSM(
  latitude: number,
  longitude: number,
  radius: number = 5000 // 米
): Promise<Array<{
  name: string;
  address: string;
  phone?: string;
  website?: string;
  latitude: number;
  longitude: number;
}>> {
  try {
    // Overpass API query to find car-related shops (wrap, tint, custom)
    const query = `
      [out:json];
      (
        node["shop"~"car_repair|car_accessories"](around:${radius},${latitude},${longitude});
        way["shop"~"car_repair|car_accessories"](around:${radius},${latitude},${longitude});
        node["craft"~"car_painter|vehicle_body_construction"](around:${radius},${latitude},${longitude});
        node["amenity"~"car_wash"](around:${radius},${latitude},${longitude});
        node["shop"="car"](around:${radius},${latitude},${longitude});
      );
      out center tags 50;
    `.trim();

    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: { 'User-Agent': 'CarModder-App/1.0' }
    });

    if (!response.ok) {
      throw new Error(`OSM API error: ${response.status}`);
    }

    const data = await response.json();

    return data.elements
      .filter((element: any) => element.tags && element.tags.name)
      .map((element: any) => ({
        name: element.tags.name || 'Unnamed Shop',
        address: element.tags.address
          ? [
              element.tags.address.house_number,
              element.tags.address.road,
              element.tags.address.city,
              element.tags.address.state,
              element.tags.address.postcode,
            ].filter(Boolean).join(', ')
          : element.tags.addr_full || element.tags.street || '',
        phone: element.tags.phone || element.tags['contact:phone'],
        website: element.tags.website || element.tags['contact:website'],
        latitude: element.lat || element.center?.lat || 0,
        longitude: element.lon || element.center?.lon || 0,
      }));
  } catch (e) {
    console.error('Failed to search OSM:', e);
    return [];
  }
}

/**
 * 搜索附近的改装店（综合多个数据源）
 */
export async function searchNearbyWrapShops(
  latitude: number,
  longitude: number,
  radius: number = 5000
): Promise<Array<{
  id: string;
  name: string;
  slug: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  latitude: string;
  longitude: string;
  phone?: string;
  website?: string;
  rating: number;
  reviewCount: number;
  certified: boolean;
  featured: boolean;
  source: string;
}>> {
  const shops: any[] = [];

  // 1. 优先使用 Google Places（如果有 API key）
  const googleShops = await searchShopsByGooglePlaces(latitude, longitude, radius, 'car wrap shop');
  googleShops.forEach((shop, index) => {
    shops.push({
      id: `google_${shop.placeId}`,
      name: shop.name,
      slug: `google_${shop.placeId}`,
      address: shop.address,
      city: shop.address.split(',').pop()?.trim() || '',
      country: 'US',
      latitude: String(shop.latitude),
      longitude: String(shop.longitude),
      phone: shop.phone,
      website: shop.website,
      rating: shop.rating ? Math.round(shop.rating * 20) : 0,
      reviewCount: shop.userRatingsTotal || 0,
      certified: false,
      featured: false,
      source: 'google',
    });
  });

  // 2. 使用 OSM 补充
  const osmShops = await searchShopsByOSM(latitude, longitude, radius);
  osmShops.forEach((shop, index) => {
    const isDuplicate = shops.some(s =>
      Math.abs(parseFloat(s.latitude) - shop.latitude) < 0.001 &&
      Math.abs(parseFloat(s.longitude) - shop.longitude) < 0.001
    );

    if (!isDuplicate && shop.latitude && shop.longitude) {
      shops.push({
        id: `osm_${index}_${Date.now()}`,
        name: shop.name,
        slug: `osm_${shop.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
        address: shop.address,
        city: '',
        country: 'US',
        latitude: String(shop.latitude),
        longitude: String(shop.longitude),
        phone: shop.phone,
        website: shop.website,
        rating: 0,
        reviewCount: 0,
        certified: false,
        featured: false,
        source: 'osm',
      });
    }
  });

  // 3. 如果还是没有结果，返回一些示例店铺（仅用于演示）
  if (shops.length === 0) {
    console.log('No shops found from APIs, returning demo shops');
    return getDemoShops(latitude, longitude);
  }

  return shops;
}

/**
 * 示例店铺数据（当 API 没有结果时用于演示）
 */
function getDemoShops(latitude: number, longitude: number) {
  const demoShops = [
    {
      name: 'Pro Wrap Studio',
      address: '123 Main Street',
      phone: '(555) 123-4567',
      website: 'https://prowrapstudio.com',
      rating: 4.8,
      latitude: 0.008,
      longitude: 0.008,
    },
    {
      name: 'Elite Auto Graphics',
      address: '456 Oak Avenue',
      phone: '(555) 234-5678',
      website: 'https://eliteautographics.com',
      rating: 4.6,
      latitude: -0.012,
      longitude: -0.01,
    },
    {
      name: 'Chrome Killers',
      address: '789 Industrial Blvd',
      phone: '(555) 345-6789',
      rating: 4.9,
      latitude: 0.015,
      longitude: -0.005,
    },
    {
      name: 'VINYL FX',
      address: '321 Design District',
      website: 'https://vinylfx.com',
      rating: 4.5,
      latitude: -0.008,
      longitude: 0.012,
    },
    {
      name: 'Wrap Masters LA',
      address: '555 Commerce Way',
      phone: '(555) 456-7890',
      rating: 4.7,
      latitude: 0.02,
      longitude: 0.015,
    },
  ];

  return demoShops.map((shop, index) => ({
    id: `demo_${index}`,
    name: shop.name,
    slug: `demo_${shop.name.toLowerCase().replace(/\s+/g, '-')}`,
    address: shop.address,
    city: 'Demo City',
    country: 'US',
    latitude: String(latitude + shop.latitude),
    longitude: String(longitude + shop.longitude),
    phone: shop.phone,
    website: shop.website,
    rating: Math.round(shop.rating * 20),
    reviewCount: Math.floor(Math.random() * 200) + 50,
    certified: index < 2,
    featured: index === 0,
    source: 'demo',
  }));
}
