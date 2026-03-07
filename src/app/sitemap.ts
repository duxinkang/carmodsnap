import { MetadataRoute } from 'next';

import { postsSource } from '@/core/docs/source';
import { envConfigs } from '@/config';
import { defaultLocale, locales } from '@/config/locale';

const staticPaths = [
  '/',
  '/pricing',
  '/showcases',
  '/blog',
  '/privacy-policy',
  '/terms-of-service',
  '/refund-policy',
  '/data-and-claims-policy',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appUrl = envConfigs.app_url;
  const now = new Date();
  const blogPaths = getBlogPaths();
  const allPaths = Array.from(new Set([...staticPaths, ...blogPaths]));

  return locales.flatMap((locale) =>
    allPaths.map((path) => ({
      url: `${appUrl}${locale === defaultLocale ? '' : `/${locale}`}${path === '/' ? '' : path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '/' ? 1 : 0.7,
    }))
  );
}

function getBlogPaths() {
  const paths = new Set<string>();

  for (const locale of locales) {
    const pages = postsSource.getPages(locale);
    for (const page of pages) {
      const path = normalizePath(page.url, locale);
      if (path.startsWith('/blog/')) {
        paths.add(path);
      }
    }
  }

  return Array.from(paths);
}

function normalizePath(url: string, locale: string) {
  if (locale !== defaultLocale && url.startsWith(`/${locale}/`)) {
    return url.slice(`/${locale}`.length);
  }

  return url;
}
