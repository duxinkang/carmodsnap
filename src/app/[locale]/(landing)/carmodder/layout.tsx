import { getTranslations } from 'next-intl/server';

import { FAQPageSchemaMarkup } from '@/shared/components/seo/schema-markup';
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
      <FAQPageSchemaMarkup faqPage={{ questions: faqs }} />
    </>
  );
}
