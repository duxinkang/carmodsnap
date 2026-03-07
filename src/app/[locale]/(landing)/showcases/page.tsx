import { getMetadata } from '@/shared/lib/seo';

import ShowcasesClientPage from './showcases.client';

export const revalidate = 3600;

export const generateMetadata = getMetadata({
  metadataKey: 'pages.showcases.metadata',
  canonicalUrl: '/showcases',
});

export default function ShowcasesPage() {
  return <ShowcasesClientPage />;
}
