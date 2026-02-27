import { respData, respErr } from '@/shared/lib/resp';
import { createQuoteRequest, assignQuoteRequestToShop, getWrapShops } from '@/shared/models/wrap_shop';
import { getUserInfo } from '@/shared/models/user';

/**
 * 提交报价请求
 * POST /api/shops/quote
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      email,
      name,
      phone,
      location,
      vehicleType,
      vehicleModel,
      serviceType,
      description,
      images,
      budget,
      timeline,
    } = body;

    // 验证必填字段
    if (!email || !location || !serviceType) {
      return respErr('email, location and serviceType are required');
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return respErr('invalid email format');
    }

    // 获取用户信息（可选）
    const user = await getUserInfo().catch(() => null);

    // 创建报价请求
    const quoteRequest = await createQuoteRequest({
      email,
      name,
      phone,
      location,
      vehicleType,
      vehicleModel,
      serviceType,
      description,
      images,
      budget,
      timeline,
      userId: user?.id,
    });

    // 自动匹配合适的店铺
    const [city, state] = location.split(',').map((s: string) => s.trim());
    const shops = await getWrapShops({
      city: city || location,
      state,
      serviceType,
      certified: true,
      limit: 5,
    });

    // 将请求分配给匹配的店铺
    const assignedShops = [];
    for (const shop of shops) {
      const assignment = await assignQuoteRequestToShop(quoteRequest.id, shop.id);
      assignedShops.push({ shopId: shop.id, shopName: shop.name });
    }

    // TODO: 发送邮件通知店铺

    return respData({
      quoteRequest: {
        ...quoteRequest,
        assignedShops,
      },
    });
  } catch (e: any) {
    console.log('submit quote request failed:', e);
    return respErr(`submit quote request failed: ${e.message}`);
  }
}
