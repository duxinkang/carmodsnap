import { envConfigs } from '@/config';

interface ArticleSchema {
  headline: string;
  description: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
}

interface FAQPageSchema {
  questions: {
    question: string;
    answer: string;
  }[];
}

interface CreativeWorkSchema {
  name: string;
  description: string;
  image?: string;
  url: string;
  creator?: string;
  keywords?: string[];
}

interface ProductSchema {
  name: string;
  description: string;
  image?: string;
  brand: string;
  offers: {
    price: string;
    priceCurrency: string;
    availability: string;
  }[];
}

interface OrganizationSchema {
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

interface LocalBusinessSchema {
  name: string;
  image?: string;
  url: string;
  telephone?: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
}

interface BreadcrumbListSchema {
  itemListElement: {
    position: number;
    name: string;
    item: string;
  }[];
}

interface WebSiteSchema {
  name: string;
  url: string;
  description?: string;
  language?: string;
  searchUrlTemplate?: string;
}

interface CollectionPageSchema {
  name: string;
  description?: string;
  url: string;
}

interface ItemListSchema {
  itemListElement: {
    position: number;
    url: string;
    name: string;
    image?: string;
    description?: string;
    datePublished?: string;
  }[];
}

interface SoftwareApplicationSchema {
  name: string;
  applicationCategory: string;
  operatingSystem: string;
  description: string;
  image?: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
  aggregateRating?: {
    ratingValue: number;
    ratingCount: number;
    bestRating: number;
    worstRating: number;
  };
}

function generateSchema<T extends object>(type: string, data: T): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': type,
    ...data,
  });
}

export function ArticleSchemaMarkup({ post }: { post: ArticleSchema & { url?: string } }) {
  const schema = {
    headline: post.headline,
    description: post.description,
    image: post.image
      ? post.image.startsWith('http')
        ? post.image
        : `${envConfigs.app_url}${post.image}`
      : `${envConfigs.app_url}/og.png`,
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    author: post.author
      ? {
          '@type': 'Person',
          name: post.author,
        }
      : {
          '@type': 'Organization',
          name: envConfigs.app_name,
        },
    publisher: {
      '@type': 'Organization',
      name: envConfigs.app_name,
      logo: {
        '@type': 'ImageObject',
        url: `${envConfigs.app_url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url || `${envConfigs.app_url}/blog/${post.headline}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: generateSchema('Article', schema) }}
    />
  );
}

export function ProductSchemaMarkup({ product }: { product: ProductSchema }) {
  const schema = {
    name: product.name,
    description: product.description,
    image: product.image
      ? product.image.startsWith('http')
        ? product.image
        : `${envConfigs.app_url}${product.image}`
      : `${envConfigs.app_url}/og.png`,
    brand: {
      '@type': 'Brand',
      name: product.brand,
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: product.offers[0]?.price || '9.9',
      highPrice: product.offers[product.offers.length - 1]?.price || '29.9',
      priceCurrency: product.offers[0]?.priceCurrency || 'USD',
      offerCount: product.offers.length.toString(),
      offers: product.offers.map((offer) => ({
        '@type': 'Offer',
        price: offer.price,
        priceCurrency: offer.priceCurrency,
        availability: offer.availability || 'https://schema.org/InStock',
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: generateSchema('Product', schema) }}
    />
  );
}

export function OrganizationSchemaMarkup({
  organization,
}: {
  organization: OrganizationSchema;
}) {
  const schema = {
    name: organization.name,
    url: organization.url,
    logo: organization.logo
      ? {
          '@type': 'ImageObject',
          url: organization.logo.startsWith('http')
            ? organization.logo
            : `${envConfigs.app_url}${organization.logo}`,
        }
      : undefined,
    sameAs: organization.sameAs,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: generateSchema('Organization', schema),
      }}
    />
  );
}

export function LocalBusinessSchemaMarkup({
  business,
}: {
  business: LocalBusinessSchema;
}) {
  const schema = {
    name: business.name,
    image: business.image
      ? business.image.startsWith('http')
        ? business.image
        : `${envConfigs.app_url}${business.image}`
      : undefined,
    url: business.url,
    telephone: business.telephone,
    address: business.address,
    geo: business.geo,
    openingHours: business.openingHours,
    priceRange: business.priceRange,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: generateSchema('LocalBusiness', schema),
      }}
    />
  );
}

export function BreadcrumbListSchemaMarkup({
  items,
}: {
  items: BreadcrumbListSchema['itemListElement'];
}) {
  const schema = {
    itemListElement: items.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.item.startsWith('http')
        ? item.item
        : `${envConfigs.app_url}${item.item}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: generateSchema('BreadcrumbList', schema),
      }}
    />
  );
}

export function WebSiteSchemaMarkup({ website }: { website: WebSiteSchema }) {
  const schema = {
    name: website.name,
    url: website.url,
    description: website.description,
    inLanguage: website.language || 'en',
    ...(website.searchUrlTemplate
      ? {
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: website.searchUrlTemplate,
            },
            'query-input': 'required name=search_term_string',
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: generateSchema('WebSite', schema) }}
    />
  );
}

export function SoftwareApplicationSchemaMarkup({
  application,
}: {
  application: SoftwareApplicationSchema;
}) {
  const schema = {
    name: application.name,
    applicationCategory: application.applicationCategory,
    operatingSystem: application.operatingSystem,
    description: application.description,
    image: application.image
      ? application.image.startsWith('http')
        ? application.image
        : `${envConfigs.app_url}${application.image}`
      : `${envConfigs.app_url}/og.png`,
    offers: application.offers
      ? {
          '@type': 'Offer',
          price: application.offers.price,
          priceCurrency: application.offers.priceCurrency,
        }
      : undefined,
    aggregateRating: application.aggregateRating
      ? {
          '@type': 'AggregateRating',
          ...application.aggregateRating,
        }
      : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: generateSchema('SoftwareApplication', schema),
      }}
    />
  );
}

export function FAQPageSchemaMarkup({ faqPage }: { faqPage: FAQPageSchema }) {
  const schema = {
    mainEntity: faqPage.questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: generateSchema('FAQPage', schema) }}
    />
  );
}

export function CreativeWorkSchemaMarkup({
  creativeWork,
}: {
  creativeWork: CreativeWorkSchema;
}) {
  const schema = {
    name: creativeWork.name,
    description: creativeWork.description,
    image: creativeWork.image
      ? creativeWork.image.startsWith('http')
        ? creativeWork.image
        : `${envConfigs.app_url}${creativeWork.image}`
      : `${envConfigs.app_url}/og.png`,
    url: creativeWork.url,
    creator: creativeWork.creator
      ? {
          '@type': 'Person',
          name: creativeWork.creator,
        }
      : {
          '@type': 'Organization',
          name: envConfigs.app_name,
        },
    keywords: creativeWork.keywords,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: generateSchema('CreativeWork', schema) }}
    />
  );
}

export function CollectionPageSchemaMarkup({
  page,
}: {
  page: CollectionPageSchema;
}) {
  const schema = {
    name: page.name,
    description: page.description,
    url: page.url,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: generateSchema('CollectionPage', schema),
      }}
    />
  );
}

export function ItemListSchemaMarkup({ itemList }: { itemList: ItemListSchema }) {
  const schema = {
    itemListElement: itemList.itemListElement.map((item) => ({
      '@type': 'ListItem',
      position: item.position,
      url: item.url.startsWith('http')
        ? item.url
        : `${envConfigs.app_url}${item.url}`,
      name: item.name,
      image: item.image
        ? item.image.startsWith('http')
          ? item.image
          : `${envConfigs.app_url}${item.image}`
        : undefined,
      description: item.description,
      datePublished: item.datePublished,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: generateSchema('ItemList', schema),
      }}
    />
  );
}

// 组合组件 - 用于全站通用的 Schema
export function GlobalSchemaMarkup() {
  return (
    <>
      <OrganizationSchemaMarkup
        organization={{
          name: envConfigs.app_name,
          url: envConfigs.app_url,
          logo: '/logo.png',
          sameAs: [
            'https://twitter.com/carmodsnap',
            'https://www.instagram.com/carmodsnap',
            'https://www.facebook.com/carmodsnap',
          ],
        }}
      />
      <WebSiteSchemaMarkup
        website={{
          name: envConfigs.app_name,
          url: envConfigs.app_url,
          description: 'AI-powered car modification visualizer platform',
          language: 'en',
        }}
      />
      <SoftwareApplicationSchemaMarkup
        application={{
          name: envConfigs.app_name,
          applicationCategory: 'DesignApplication',
          operatingSystem: 'Web',
          description:
            'AI-powered car modification visualization tool to preview custom builds before you buy',
          image: '/og.png',
          offers: {
            price: '9.90',
            priceCurrency: 'USD',
          },
        }}
      />
    </>
  );
}

// 博客文章专用 Schema 组合
export function BlogPostSchemaMarkup({
  post,
  url,
}: {
  post: ArticleSchema & {
    faqs?: FAQPageSchema['questions'];
  };
  url: string;
}) {
  const breadcrumbs = {
    itemListElement: [
      { position: 1, name: 'Home', item: '/' },
      { position: 2, name: 'Blog', item: '/blog' },
      { position: 3, name: post.headline, item: url },
    ],
  };

  return (
    <>
      <ArticleSchemaMarkup post={{ ...post, url }} />
      <BreadcrumbListSchemaMarkup items={breadcrumbs.itemListElement} />
      {post.faqs && post.faqs.length > 0 ? (
        <FAQPageSchemaMarkup faqPage={{ questions: post.faqs }} />
      ) : null}
    </>
  );
}

// Pricing 页面专用 Schema 组合
export function PricingSchemaMarkup({
  productName,
  description,
  offers,
}: {
  productName: string;
  description: string;
  offers: ProductSchema['offers'];
}) {
  return (
    <ProductSchemaMarkup
      product={{
        name: productName,
        description,
        brand: envConfigs.app_name,
        offers,
      }}
    />
  );
}
