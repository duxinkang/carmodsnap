import { respData, respErr } from '@/shared/lib/resp';
import {
  getWrapShops,
  getWrapShopsCount,
  searchNearbyShops,
} from '@/shared/models/wrap_shop';

/**
 * 搜索改装店
 * GET /api/shops/search?city=Los+Angeles&state=CA&serviceType=full_wrap&certified=true&page=1&limit=20
 * GET /api/shops/search?lat=34.0522&lng=-118.2437&radius=50
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const city = searchParams.get('city') || undefined;
    const state = searchParams.get('state') || undefined;
    const postalCode = searchParams.get('postal_code') || undefined;
    const serviceType = searchParams.get('service_type') || undefined;
    const certified = searchParams.get('certified') === 'true';
    const featured = searchParams.get('featured') === 'true';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);

    // 地理位置搜索
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    const radius = parseInt(searchParams.get('radius') || '50');

    let shops;

    if (lat && lng) {
      // 按地理位置搜索
      shops = await searchNearbyShops(
        parseFloat(lat),
        parseFloat(lng),
        radius,
        limit
      );
    } else {
      // 按城市/州搜索
      shops = await getWrapShops({
        city,
        state,
        postalCode,
        serviceType,
        certified: searchParams.get('certified') ? certified : undefined,
        featured: searchParams.get('featured') ? featured : undefined,
        page,
        limit,
      });

      // 获取总数量
      const total = await getWrapShopsCount({
        city,
        state,
        postalCode,
        serviceType,
        certified: searchParams.get('certified') ? certified : undefined,
        featured: searchParams.get('featured') ? featured : undefined,
      });

      return respData({
        list: shops,
        total,
        page,
        limit,
        hasMore: page * limit < total,
      });
    }

    return respData({
      list: shops,
      total: shops.length,
    });
  } catch (e: any) {
    console.log('search shops failed:', e);
    return respErr(`search shops failed: ${e.message}`);
  }
}
