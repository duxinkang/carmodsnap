import { MetadataRoute } from 'next';

import { envConfigs } from '@/config';

export default function robots(): MetadataRoute.Robots {
  const appUrl = envConfigs.app_url;

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/*?*q=',
          '/settings/*',
          '/activity/*',
          '/admin/*',
          '/api/*',
        ],
      },
      {
        userAgent: [
          'Googlebot',
          'Bingbot',
          'PerplexityBot',
          'ChatGPT-User',
          'GPTBot',
          'ClaudeBot',
          'anthropic-ai',
        ],
        allow: '/',
        disallow: ['/admin/*', '/api/*'],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}
