import { envConfigs } from '@/config';
import { defaultLocale } from '@/config/locale';
import { getMetadata } from '@/shared/lib/seo';
import {
  BreadcrumbListSchemaMarkup,
  CollectionPageSchemaMarkup,
  ItemListSchemaMarkup,
} from '@/shared/components/seo/schema-markup';
import { getShowcaseUrl, showcaseEntries } from '@/shared/data/showcases';

import ShowcasesClientPage from './showcases.client';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'pages.showcases.metadata',
  canonicalUrl: '/showcases',
});

export default async function ShowcasesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const collectionUrl =
    locale === defaultLocale
      ? `${envConfigs.app_url}/showcases`
      : `${envConfigs.app_url}/${locale}/showcases`;

  return (
    <>
      <ShowcasesClientPage />
      <CollectionPageSchemaMarkup
        page={{
          name: 'Real Car Modification Examples | CarModSnap Showcases',
          description:
            'Browse individual car wrap, wheel, and body kit showcase case studies with indexable build detail pages.',
          url: collectionUrl,
        }}
      />
      <ItemListSchemaMarkup
        itemList={{
          itemListElement: showcaseEntries.map((item, index) => ({
            position: index + 1,
            url: `${locale === defaultLocale ? '' : `/${locale}`}${getShowcaseUrl(item.slug)}`,
            name: item.title,
            image: item.image,
            description: item.description,
          })),
        }}
      />
      <BreadcrumbListSchemaMarkup
        items={[
          { position: 1, name: 'Home', item: '/' },
          { position: 2, name: 'Showcases', item: '/showcases' },
        ]}
      />
    </>
  );
}
