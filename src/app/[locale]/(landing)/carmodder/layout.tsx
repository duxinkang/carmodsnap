import { getTranslations } from 'next-intl/server';

import {
  FAQPageSchemaMarkup,
  SoftwareApplicationSchemaMarkup,
  WebPageSchemaMarkup,
} from '@/shared/components/seo/schema-markup';
import { getMetadata } from '@/shared/lib/seo';

export const generateMetadata = getMetadata({
  metadataKey: 'pages.carmodder.metadata',
  canonicalUrl: '/carmodder',
});

export default async function CarModderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('pages.carmodder');

  const faqs = [
    {
      question: t('faq1Question'),
      answer: t('faq1Answer'),
    },
    {
      question: t('faq2Question'),
      answer: t('faq2Answer'),
    },
    {
      question: t('faq3Question'),
      answer: t('faq3Answer'),
    },
    {
      question: t('faq4Question'),
      answer: t('faq4Answer'),
    },
  ];

  return (
    <>
      {children}
      <WebPageSchemaMarkup
        page={{
          name: 'CarModder Visualizer',
          description:
            'Interactive AI car modification visualizer for previewing wraps, wheels, stance, and body styling directions.',
          url: 'https://www.carmodsnap.com/carmodder',
          inLanguage: 'en',
          about: [
            'AI car modification visualizer',
            'wrap preview',
            'wheel fitment preview',
            'body kit concept planner',
          ],
        }}
      />
      <SoftwareApplicationSchemaMarkup
        application={{
          name: 'CarModder',
          applicationCategory: 'DesignApplication',
          operatingSystem: 'Web',
          description:
            'Interactive web app for testing car wrap colors, wheel styles, and modification concepts before purchase.',
          image: '/og-carmodsnap-20260304.png',
          offers: {
            price: '0',
            priceCurrency: 'USD',
          },
        }}
      />
      <FAQPageSchemaMarkup faqPage={{ questions: faqs }} />
    </>
  );
}
