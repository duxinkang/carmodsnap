import { eq, and, like, or, desc, asc, between, count } from 'drizzle-orm';

import { db } from '@/core/db';
import {
  wrapShop,
  wrapShopService,
  wrapShopReview,
  quoteRequest,
  quoteRequestShop,
} from '@/config/db/schema';

export interface WrapShopFilter {
  city?: string;
  state?: string;
  postalCode?: string;
  serviceType?: string;
  certified?: boolean;
  featured?: boolean;
  status?: string;
  page?: number;
  limit?: number;
}

export interface QuoteRequestFilter {
  status?: string;
  serviceType?: string;
  page?: number;
  limit?: number;
}

/**
 * 获取改装店列表
 */
export async function getWrapShops(filter: WrapShopFilter) {
  const {
    city,
    state,
    postalCode,
    serviceType,
    certified,
    featured,
    status = 'active',
    page = 1,
    limit = 20,
  } = filter;

  const conditions: any[] = [eq(wrapShop.status, status)];

  if (city) {
    conditions.push(like(wrapShop.city, `%${city}%`));
  }

  if (state) {
    conditions.push(eq(wrapShop.state, state));
  }

  if (postalCode) {
    conditions.push(like(wrapShop.postalCode, `${postalCode}%`));
  }

  if (certified !== undefined) {
    conditions.push(eq(wrapShop.certified, certified));
  }

  if (featured !== undefined) {
    conditions.push(eq(wrapShop.featured, featured));
  }

  // 如果指定了服务类型，需要先筛选出提供该服务的店铺
  let shopIds: string[] = [];
  if (serviceType) {
    const serviceResults = await db()
      .selectDistinct({ shopId: wrapShopService.shopId })
      .from(wrapShopService)
      .where(
        and(
          eq(wrapShopService.slug, serviceType),
          eq(wrapShopService.available, true)
        )
      );
    shopIds = serviceResults.map((r: { shopId: string }) => r.shopId);
    if (shopIds.length > 0) {
      conditions.push(
        or(
          ...shopIds.map((id) => eq(wrapShop.id, id))
        )
      );
    } else {
      // 如果没有店铺提供该服务，返回空结果
      return [];
    }
  }

  const results = await db()
    .select()
    .from(wrapShop)
    .where(conditions.length > 1 ? and(...conditions) : conditions[0])
    .orderBy(desc(wrapShop.rating), desc(wrapShop.featured))
    .limit(limit)
    .offset((page - 1) * limit);

  return results;
}

/**
 * 获取改装店数量
 */
export async function getWrapShopsCount(filter: WrapShopFilter) {
  const { city, state, certified, featured, status = 'active' } = filter;

  const conditions: any[] = [eq(wrapShop.status, status)];

  if (city) {
    conditions.push(like(wrapShop.city, `%${city}%`));
  }

  if (state) {
    conditions.push(eq(wrapShop.state, state));
  }

  if (certified !== undefined) {
    conditions.push(eq(wrapShop.certified, certified));
  }

  if (featured !== undefined) {
    conditions.push(eq(wrapShop.featured, featured));
  }

  const results = await db()
    .select({ count: count() })
    .from(wrapShop)
    .where(conditions.length > 1 ? and(...conditions) : conditions[0]);

  return results[0]?.count || 0;
}

/**
 * 根据 ID 获取改装店
 */
export async function getWrapShopById(id: string) {
  const results = await db()
    .select()
    .from(wrapShop)
    .where(eq(wrapShop.id, id));

  return results[0] || null;
}

/**
 * 根据 slug 获取改装店
 */
export async function getWrapShopBySlug(slug: string) {
  const results = await db()
    .select()
    .from(wrapShop)
    .where(eq(wrapShop.slug, slug));

  return results[0] || null;
}

/**
 * 获取店铺服务列表
 */
export async function getWrapShopServices(shopId: string) {
  const results = await db()
    .select()
    .from(wrapShopService)
    .where(
      and(
        eq(wrapShopService.shopId, shopId),
        eq(wrapShopService.available, true)
      )
    )
    .orderBy(asc(wrapShopService.sort));

  return results;
}

/**
 * 获取店铺评论
 */
export async function getWrapShopReviews(
  shopId: string,
  page: number = 1,
  limit: number = 20
) {
  const results = await db()
    .select()
    .from(wrapShopReview)
    .where(
      and(
        eq(wrapShopReview.shopId, shopId),
        eq(wrapShopReview.approved, true)
      )
    )
    .orderBy(desc(wrapShopReview.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  return results;
}

/**
 * 创建报价请求
 */
export async function createQuoteRequest(data: {
  email: string;
  name?: string;
  phone?: string;
  location: string;
  vehicleType?: string;
  vehicleModel?: string;
  serviceType: string;
  description?: string;
  images?: string;
  budget?: number;
  timeline?: string;
  userId?: string;
}) {
  const result = await db()
    .insert(quoteRequest)
    .values({
      ...data,
      status: 'pending',
    })
    .returning();

  return result[0];
}

/**
 * 将报价请求分配给店铺
 */
export async function assignQuoteRequestToShop(
  quoteRequestId: string,
  shopId: string
) {
  const result = await db()
    .insert(quoteRequestShop)
    .values({
      quoteRequestId,
      shopId,
      status: 'pending',
    })
    .returning();

  return result[0];
}

/**
 * 搜索附近的店铺（基于经纬度）
 */
export async function searchNearbyShops(
  latitude: number,
  longitude: number,
  radius: number = 50, // 英里
  limit: number = 20
) {
  // 简单的距离计算（Haversine 公式近似）
  // 注意：对于生产环境，建议使用数据库的地理空间查询
  const latDiff = radius / 69; // 1 度纬度约等于 69 英里
  const lngDiff = radius / (Math.cos((latitude * Math.PI) / 180) * 69);

  const results = await db()
    .select()
    .from(wrapShop)
    .where(
      and(
        eq(wrapShop.status, 'active'),
        between(wrapShop.latitude, String(latitude - latDiff), String(latitude + latDiff)),
        between(wrapShop.longitude, String(longitude - lngDiff), String(longitude + lngDiff))
      )
    )
    .orderBy(desc(wrapShop.rating))
    .limit(limit);

  return results;
}

/**
 * 更新店铺评分
 */
export async function updateShopRating(shopId: string) {
  const reviews = await getWrapShopReviews(shopId, 1, 1000);

  if (reviews.length === 0) {
    return;
  }

  const totalRating = reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
  const avgRating = Math.round((totalRating / reviews.length) * 100); // 放大 100 倍

  await db()
    .update(wrapShop)
    .set({
      rating: avgRating,
      reviewCount: reviews.length,
    })
    .where(eq(wrapShop.id, shopId));
}
