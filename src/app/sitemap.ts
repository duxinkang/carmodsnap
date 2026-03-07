import { MetadataRoute } from 'next';

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

export default function sitemap(): MetadataRoute.Sitemap {
  const appUrl = envConfigs.app_url;
  const now = new Date();

  return locales.flatMap((locale) =>
    staticPaths.map((path) => ({
      url: `${appUrl}${locale === defaultLocale ? '' : `/${locale}`}${path === '/' ? '' : path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: path === '/' ? 1 : 0.7,
    }))
  );
}
