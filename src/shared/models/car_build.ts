/**
 * Car Build 模型 - 保存用户的改装方案
 */

import { and, desc, eq, sql } from 'drizzle-orm';

import { db } from '@/core/db';
import { carBuild } from '@/config/db/schema';
import { getUserInfo, User } from '@/shared/models/user';

export type CarBuild = typeof carBuild.$inferSelect & {
  user?: User;
};
export type NewCarBuild = typeof carBuild.$inferInsert;
export type UpdateCarBuild = Partial<Omit<NewCarBuild, 'id' | 'createdAt'>>;

/**
 * 创建新的改装方案
 */
export async function createCarBuild(newBuild: NewCarBuild) {
  const [buildResult] = await db().insert(carBuild).values(newBuild).returning();
  return buildResult;
}

/**
 * 获取用户的改装方案列表
 */
export async function getUserBuilds(userId: string, options?: {
  page?: number;
  limit?: number;
  isPublic?: boolean;
}) {
  const { page = 1, limit = 20, isPublic } = options || {};
  const offset = (page - 1) * limit;

  const conditions = [eq(carBuild.userId, userId)];
  if (isPublic !== undefined) {
    conditions.push(eq(carBuild.isPublic, isPublic));
  }

  const builds = await db()
    .select()
    .from(carBuild)
    .where(and(...conditions))
    .orderBy(desc(carBuild.createdAt))
    .limit(limit)
    .offset(offset);

  return builds;
}

/**
 * 获取改装方案总数
 */
export async function getUserBuildsCount(userId: string, isPublic?: boolean) {
  const conditions: any[] = [eq(carBuild.userId, userId)];
  if (isPublic !== undefined) {
    conditions.push(eq(carBuild.isPublic, isPublic));
  }

  const result = await db()
    .select({ count: sql<number>`count(*)` })
    .from(carBuild)
    .where(and(...conditions));

  return Number(result[0]?.count || 0);
}

/**
 * 根据 ID 获取改装方案
 */
export async function getBuildById(id: string) {
  const result = await db()
    .select()
    .from(carBuild)
    .where(eq(carBuild.id, id))
    .limit(1);

  return result[0] || null;
}

/**
 * 根据分享 ID 获取公开的改装方案
 */
export async function getBuildByShareId(shareId: string) {
  const result = await db()
    .select()
    .from(carBuild)
    .where(and(
      eq(carBuild.shareId, shareId),
      eq(carBuild.isPublic, true)
    ))
    .limit(1);

  return result[0] || null;
}

/**
 * 更新改装方案
 */
export async function updateBuild(id: string, data: UpdateCarBuild) {
  const [updated] = await db()
    .update(carBuild)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(carBuild.id, id))
    .returning();

  return updated;
}

/**
 * 删除改装方案
 */
export async function deleteBuild(id: string, userId: string) {
  await db()
    .delete(carBuild)
    .where(and(
      eq(carBuild.id, id),
      eq(carBuild.userId, userId)
    ));
}

/**
 * 更新点赞数
 */
export async function incrementBuildLikes(id: string) {
  await db()
    .update(carBuild)
    .set({ 
      likes: sql`${carBuild.likes} + 1`,
      updatedAt: new Date()
    })
    .where(eq(carBuild.id, id));
}

/**
 * 更新浏览数
 */
export async function incrementBuildViews(id: string) {
  await db()
    .update(carBuild)
    .set({ 
      views: sql`${carBuild.views} + 1`,
      updatedAt: new Date()
    })
    .where(eq(carBuild.id, id));
}
