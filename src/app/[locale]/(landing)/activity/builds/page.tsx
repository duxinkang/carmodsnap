/**
 * 用户改装方案列表页
 */
import { getTranslations } from 'next-intl/server';

import { Empty, LazyImage } from '@/shared/blocks/common';
import { Button } from '@/shared/components/ui/button';
import { getUserBuilds, getUserBuildsCount } from '@/shared/models/car_build';
import { getUserInfo } from '@/shared/models/user';
import { Link } from '@/core/i18n/navigation';

export default async function BuildsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: number; pageSize?: number }>;
}) {
  const { page: pageNum, pageSize } = await searchParams;
  const page = pageNum || 1;
  const limit = pageSize || 20;

  const user = await getUserInfo();
  const t = await getTranslations('activity.builds');

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Empty
          title={t('pleaseSignIn')}
          description={t('pleaseSignInDesc')}
          action={
            <Button asChild>
              <Link href="/auth/signin">{t('signIn')}</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const [builds, total] = await Promise.all([
    getUserBuilds(user.id, { page, limit }),
    getUserBuildsCount(user.id),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t('title')}</h1>
        <Button asChild>
          <Link href="/carmodder">{t('createNew')}</Link>
        </Button>
      </div>

      {builds.length === 0 ? (
        <Empty
          title={t('noBuilds')}
          description={t('noBuildsDesc')}
          action={
            <Button asChild>
              <Link href="/carmodder">{t('startModding')}</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {builds.map((build) => (
            <div
              key={build.id}
              className="bg-[#131324] border border-white/10 rounded-xl overflow-hidden hover:border-white/20 transition-all"
            >
              <div className="aspect-video bg-[#1a1a2e] relative">
                {build.generatedImages && build.generatedImages.length > 0 ? (
                  <LazyImage
                    src={build.generatedImages[0]}
                    alt={build.carName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <LazyImage
                    src={build.carImage || '/preview.png'}
                    alt={build.carName}
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      build.isPublic
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}
                  >
                    {build.isPublic ? t('public') : t('private')}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg">{build.carName}</h3>
                  {build.title && (
                    <p className="text-sm text-white/60 mt-1">{build.title}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">{t('totalPrice')}</span>
                  <span className="font-medium text-[#6366f1]">
                    ¥{(build.totalPrice / 100).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-white/40">
                  <span>
                    ❤️ {build.likes} {t('likes')}
                  </span>
                  <span>
                    👁️ {build.views} {t('views')}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex-1"
                    asChild
                  >
                    <Link href={`/carmodder?build=${build.id}`}>
                      {t('edit')}
                    </Link>
                  </Button>
                  {build.isPublic && (
                    <Button
                      size="sm"
                      variant="secondary"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/builds/${build.shareId}`} target="_blank">
                        {t('share')}
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <Button
              size="sm"
              variant="secondary"
              asChild
            >
              <Link href={`/activity/builds?page=${page - 1}`}>
                {t('previous')}
              </Link>
            </Button>
          )}
          <span className="text-sm text-white/60">
            {t('pageOf', { current: page, total: totalPages })}
          </span>
          {page < totalPages && (
            <Button
              size="sm"
              variant="secondary"
              asChild
            >
              <Link href={`/activity/builds?page=${page + 1}`}>
                {t('next')}
              </Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
