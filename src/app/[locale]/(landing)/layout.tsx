import { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';

import { getThemeLayout } from '@/core/theme';
import { LocaleDetector, TopBanner } from '@/shared/blocks/common';
import {
  Footer as FooterType,
  Header as HeaderType,
} from '@/shared/types/blocks/landing';
import { FAQPageSchemaMarkup } from '@/shared/components/seo/schema-markup';

export default async function LandingLayout({
  children,
}: {
  children: ReactNode;
}) {
  // load page data
  const t = await getTranslations('landing');

  // load layout component
  const Layout = await getThemeLayout('landing');

  // header and footer to display
  const header: HeaderType = t.raw('header');
  const footer: FooterType = t.raw('footer');

  // FAQ schema for homepage
  const faqs = {
    questions: [
      {
        question: 'What is CarModSnap?',
        answer:
          'CarModSnap is an AI-powered car modification platform that allows you to visualize and customize your car with 3D technology. It also helps you connect with local service providers to bring your ideas to life.',
      },
      {
        question: 'Do I need technical skills to use CarModSnap?',
        answer:
          'No! CarModSnap is designed to be user-friendly. You don't need any technical skills to use our 3D configurator or browse the community showcases.',
      },
      {
        question: 'What types of cars does CarModSnap support?',
        answer:
          'CarModSnap supports a wide range of car makes and models, from popular brands to rare classics. Our database is constantly growing.',
      },
      {
        question: 'How realistic are the 3D renderings?',
        answer:
          'Our 3D renderings are highly realistic, giving you a clear idea of how your modifications will look in real life. We use advanced rendering technology to ensure accuracy.',
      },
      {
        question: 'How do I connect with service providers?',
        answer:
          'CarModSnap has a directory of trusted local mechanics and shops. You can browse providers in your area, read reviews, and contact them directly through the platform.',
      },
      {
        question: 'Is CarModSnap free to use?',
        answer:
          'CarModSnap offers both free and premium plans. The free plan allows you to use the basic 3D configurator and browse the community. Premium plans offer additional features like advanced customization options, AI-generated images, and priority service provider connections. Payment is processed securely through Creem.',
      },
    ],
  };

  return (
    <Layout header={header} footer={footer}>
      <LocaleDetector />
      {header.topbanner && header.topbanner.text && (
        <TopBanner
          id="topbanner"
          text={header.topbanner?.text}
          buttonText={header.topbanner?.buttonText}
          href={header.topbanner?.href}
          target={header.topbanner?.target}
          closable
          rememberDismiss
          dismissedExpiryDays={header.topbanner?.dismissedExpiryDays ?? 1}
        />
      )}
      {children}
      <FAQPageSchemaMarkup faqPage={faqs} />
    </Layout>
  );
}
