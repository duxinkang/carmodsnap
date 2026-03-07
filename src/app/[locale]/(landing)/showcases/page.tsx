import { getMetadata } from '@/shared/lib/seo';
import { BreadcrumbListSchemaMarkup } from '@/shared/components/seo/schema-markup';

import ShowcasesClientPage from './showcases.client';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'pages.showcases.metadata',
  canonicalUrl: '/showcases',
});

export default function ShowcasesPage() {
  return (
    <>
      <ShowcasesClientPage />
      <BreadcrumbListSchemaMarkup
        items={[
          { position: 1, name: 'Home', item: '/' },
          { position: 2, name: 'Showcases', item: '/showcases' },
        ]}
      />
    </>
  );
}
