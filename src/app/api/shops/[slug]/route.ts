import { respData, respErr } from '@/shared/lib/resp';
import { getWrapShopBySlug, getWrapShopServices, getWrapShopReviews } from '@/shared/models/wrap_shop';

/**
 * 获取单个店铺详情
 * GET /api/shops/:slug
 */
export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return respErr('shop slug is required');
    }

    const shop = await getWrapShopBySlug(slug);

    if (!shop) {
      return respErr('shop not found');
    }

    // 获取店铺服务
    const services = await getWrapShopServices(shop.id);

    // 获取店铺评论
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const reviews = await getWrapShopReviews(shop.id, page, 10);

    return respData({
      shop: {
        ...shop,
        services,
        reviews,
      },
    });
  } catch (e: any) {
    console.log('get shop detail failed:', e);
    return respErr(`get shop detail failed: ${e.message}`);
  }
}
