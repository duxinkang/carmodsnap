import { setRequestLocale } from 'next-intl/server';

import HomePageClient from './home-page.client';

import { envConfigs } from '@/config';
import { defaultLocale } from '@/config/locale';
import {
  FAQPageSchemaMarkup,
  WebPageSchemaMarkup,
} from '@/shared/components/seo/schema-markup';
import { getMetadata } from '@/shared/lib/seo';

export const generateMetadata = getMetadata({
  title: 'AI Car Modification Visualizer & Wrap Preview | CarModSnap',
  description:
    'Preview wraps, wheels, and body kits with CarModSnap. Explore AI car modification concepts, compare build directions, and request local wrap shop quotes.',
  keywords:
    'ai car modification visualizer, car wrap preview, wheel fitment preview, body kit visualizer, car customization tool, local wrap shop quotes',
  canonicalUrl: '/',
});

const homepageFaqs = {
  questions: [
    {
      question: 'What is CarModSnap?',
      answer:
        'CarModSnap is an AI-powered car modification visualizer for testing wrap colors, wheel styles, body kits, and other appearance changes before you buy or book installation.',
    },
    {
      question: 'Do I need technical skills to use CarModSnap?',
      answer:
        "No. CarModSnap is built for everyday drivers, wrap buyers, and car enthusiasts, so you can explore visual concepts without 3D or design experience.",
    },
    {
      question: 'What kinds of modifications can I preview?',
      answer:
        'You can preview wrap and paint directions, wheel changes, body kit concepts, trim styling, and before-and-after visual comparisons for supported vehicle templates.',
    },
    {
      question: 'How accurate are the results?',
      answer:
        'CarModSnap is intended for planning and concept validation. Final color, finish, and fitment decisions should still be confirmed with physical samples, installer guidance, and vehicle-specific measurements.',
    },
    {
      question: 'Can I connect with a local wrap shop?',
      answer:
        'Yes. CarModSnap includes quote-request and shop discovery flows designed to help users share their build direction with local wrap and customization providers in supported markets.',
    },
    {
      question: 'Is CarModSnap free to use?',
      answer:
        'CarModSnap offers free entry points for exploring the product, with paid plans for higher credit limits, advanced AI generation, and higher-resolution exports.',
    },
  ],
};

export default async function LandingHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const canonicalUrl =
    locale === defaultLocale
      ? envConfigs.app_url
      : `${envConfigs.app_url}/${locale}`;

  return (
    <>
      <HomePageClient />
      <WebPageSchemaMarkup
        page={{
          name: 'CarModSnap Home',
          description:
            'AI car modification visualizer for wraps, wheels, body kits, and build planning.',
          url: canonicalUrl,
          inLanguage: locale,
          about: [
            'car wrap visualizer',
            'wheel fitment preview',
            'body kit visualization',
            'AI car modification',
          ],
        }}
      />
      <FAQPageSchemaMarkup faqPage={homepageFaqs} />
    </>
  );
}
