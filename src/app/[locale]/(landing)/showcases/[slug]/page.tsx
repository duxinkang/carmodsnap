import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { Link } from '@/core/i18n/navigation';
import { envConfigs } from '@/config';
import { defaultLocale, locales } from '@/config/locale';
import {
  BreadcrumbListSchemaMarkup,
  CreativeWorkSchemaMarkup,
} from '@/shared/components/seo/schema-markup';
import { getShowcaseBySlug, getShowcaseUrl, showcaseEntries } from '@/shared/data/showcases';

export const revalidate = 3600;

export async function generateStaticParams() {
  return showcaseEntries.map((entry) => ({
    locale: defaultLocale,
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const showcase = getShowcaseBySlug(slug);
  if (!showcase) {
    return {};
  }

  const path = getShowcaseUrl(slug);
  const canonical =
    locale === defaultLocale
      ? `${envConfigs.app_url}${path}`
      : `${envConfigs.app_url}/${locale}${path}`;

  return {
    title: `${showcase.title} Showcase | CarModSnap`,
    description: showcase.description,
    alternates: {
      canonical,
      ...(locale === defaultLocale
        ? {
            languages: {
              [defaultLocale]: canonical,
              'x-default': canonical,
            },
          }
        : {}),
    },
    openGraph: {
      type: 'article',
      title: `${showcase.title} Showcase | CarModSnap`,
      description: showcase.description,
      url: canonical,
      images: [showcase.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${showcase.title} Showcase | CarModSnap`,
      description: showcase.description,
      images: [showcase.image],
    },
  };
}

export default async function ShowcaseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const showcase = getShowcaseBySlug(slug);
  if (!showcase) {
    notFound();
  }

  const path = getShowcaseUrl(slug);
  const canonical =
    locale === defaultLocale
      ? `${envConfigs.app_url}${path}`
      : `${envConfigs.app_url}/${locale}${path}`;
  const showcasesIndexPath =
    locale === defaultLocale ? '/showcases' : `/${locale}/showcases`;

  return (
    <>
      <main className="bg-[#131022] text-white">
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#1c1833] shadow-[0_24px_80px_-40px_rgba(0,0,0,0.95)]">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={showcase.image}
                  alt={showcase.imageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-sm font-semibold tracking-[0.28em] text-[#c7bbff] uppercase">
                  Showcase case study
                </p>
                <h1 className="text-4xl font-bold tracking-tight text-white">
                  {showcase.title}
                </h1>
                <p className="text-base leading-7 text-slate-200/88">
                  {showcase.description}
                </p>
              </div>

              <div className="grid gap-4 rounded-3xl border border-white/10 bg-[#17132a]/92 p-6">
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                    Vehicle
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {showcase.vehicle}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                    Style
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {showcase.style}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                    Creator
                  </p>
                  <p className="mt-1 text-lg font-semibold text-white">
                    {showcase.creator}
                  </p>
                  <p className="text-sm text-slate-300">{showcase.creatorRole}</p>
                </div>
                {showcase.tags && showcase.tags.length > 0 ? (
                  <div>
                    <p className="text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                      Key tags
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {showcase.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-sm text-slate-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="rounded-3xl border border-white/10 bg-[#17132a]/92 p-6">
                <h2 className="text-xl font-semibold text-white">
                  Why this concept is indexable
                </h2>
                <p className="mt-3 leading-7 text-slate-200/85">
                  {showcase.summary}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/carmodder"
                    className="rounded-full bg-[#4725f4] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#3b1fd0]"
                  >
                    Try this direction in CarModder
                  </Link>
                  <Link
                    href="/pricing"
                    className="rounded-full border border-white/15 bg-white/6 px-5 py-2.5 text-sm font-semibold text-slate-100 hover:bg-white/10"
                  >
                    Compare pricing
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <CreativeWorkSchemaMarkup
        creativeWork={{
          name: showcase.title,
          description: showcase.description,
          image: showcase.image,
          url: canonical,
          creator: showcase.creator,
          keywords: showcase.tags,
        }}
      />
      <BreadcrumbListSchemaMarkup
        items={[
          { position: 1, name: 'Home', item: '/' },
          { position: 2, name: 'Showcases', item: showcasesIndexPath },
          { position: 3, name: showcase.title, item: path },
        ]}
      />
    </>
  );
}
