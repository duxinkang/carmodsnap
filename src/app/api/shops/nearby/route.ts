import { respData, respErr } from '@/shared/lib/resp';
import { getLocationByIP, searchNearbyWrapShops } from '@/shared/lib/location';

/**
 * 根据用户 IP 自动搜索附近的改装店
 * GET /api/shops/nearby
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // 1. 尝试从参数获取经纬度
    let latitude = searchParams.get('lat');
    let longitude = searchParams.get('lng');
    let radius = parseInt(searchParams.get('radius') || '5000');

    // 2. 如果没有提供经纬度，尝试从 IP 获取位置
    if (!latitude || !longitude) {
      // 从请求头获取 IP（考虑代理情况）
      const forwardedFor = req.headers.get('x-forwarded-for');
      const realIp = req.headers.get('x-real-ip');

      // 提取第一个 IP（如果有多个）
      const ip = forwardedFor
        ? forwardedFor.split(',')[0].trim()
        : realIp || undefined;

      console.log('Getting location by IP:', ip);

      const location = await getLocationByIP(ip);

      if (location && location.latitude && location.longitude) {
        latitude = String(location.latitude);
        longitude = String(location.longitude);
        console.log('Location from IP:', location);
      } else {
        return respErr('Unable to get location from IP');
      }
    }

    // 3. 搜索附近的改装店
    const shops = await searchNearbyWrapShops(
      parseFloat(latitude),
      parseFloat(longitude),
      radius
    );

    // 4. 如果有城市信息，也搜索数据库中的店铺
    const city = searchParams.get('city');
    if (city) {
      // 可以在这里添加数据库搜索逻辑
      console.log('Also searching database for city:', city);
    }

    return respData({
      list: shops,
      total: shops.length,
      location: {
        latitude,
        longitude,
        source: 'ip',
      },
    });
  } catch (e: any) {
    console.error('Search nearby shops failed:', e);
    return respErr(`Search nearby shops failed: ${e.message}`);
  }
}
