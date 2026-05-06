import { getMDXComponents } from '@/mdx-components';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { defaultLocale } from '@/config/locale';
import { guidesSource } from '@/core/docs/source';
import { getThemePage } from '@/core/theme';
import { Empty } from '@/shared/blocks/common';
import { BlogPostSchemaMarkup } from '@/shared/components/seo/schema-markup';
import { buildLocaleAlternates } from '@/shared/lib/seo';
import { getPostDate } from '@/shared/models/post';
import {
  Post as BlogPostType,
  PostAuthoritySource,
  PostFaq,
  PostKeyStat,
} from '@/shared/types/blocks/blog';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

type GuidePageParams = {
  locale: string;
  slug?: string[];
};

type GuideFrontmatter = {
  title?: string;
  description?: string;
  body: React.ComponentType<{ components?: Record<string, unknown> }>;
  toc?: BlogPostType['toc'];
  pillar?: boolean;
  created_at?: string;
  author_name?: string;
  author_image?: string;
  image?: string;
  answer_summary?: string;
  key_stats?: PostKeyStat[];
  authority_sources?: PostAuthoritySource[];
  faqs?: PostFaq[];
};

function buildGuidePath(slug?: string[]) {
  if (!slug || slug.length === 0) {
    return '/guides';
  }

  return `/guides/${slug.join('/')}`;
}

function buildGuideCanonicalUrl(locale: string, slug?: string[]) {
  const path = buildGuidePath(slug);
  return locale !== envConfigs.locale
    ? `${envConfigs.app_url}/${locale}${path}`
    : `${envConfigs.app_url}${path}`;
}

function getGuideOgImageUrl(image: string | undefined, fallbackUrl: string) {
  if (!image) {
    return fallbackUrl;
  }

  if (image.startsWith('http')) {
    return image;
  }

  return `${envConfigs.app_url}${image}`;
}

function getLocalizedGuideUrl(path: string, locale: string) {
  if (locale === defaultLocale) {
    return path;
  }

  return `/${locale}${path}`;
}

async function loadGuide({ slug, locale }: { slug?: string[]; locale: string }) {
  const guidePage = guidesSource.getPage(slug ?? [], locale);
  if (!guidePage) {
    return null;
  }

  const data = guidePage.data as unknown as GuideFrontmatter;
  const MDXContent = data.body;
  const body = (
    <MDXContent
      components={getMDXComponents({
        a: createRelativeLink(guidesSource, guidePage),
      })}
    />
  );

  const frontmatter = data;
  const guidePath = buildGuidePath(slug);

  const post: BlogPostType = {
    id: guidePage.path,
    slug: (slug ?? []).join('/'),
    title: data.title || '',
    description: data.description || '',
    content: '',
    body,
    toc: data.toc,
    created_at: frontmatter.created_at
      ? getPostDate({
          created_at: frontmatter.created_at,
          locale,
        })
      : '',
    created_at_iso: frontmatter.created_at || '',
    author_name: frontmatter.author_name || '',
    author_image: frontmatter.author_image || '',
    author_role: '',
    image: frontmatter.image || '',
    url: getLocalizedGuideUrl(guidePath, locale),
    answer_summary: frontmatter.answer_summary || '',
    key_stats: frontmatter.key_stats || [],
    authority_sources: frontmatter.authority_sources || [],
    faqs: frontmatter.faqs || [],
  };

  // For pillar pages, surface the cluster children as related_guides automatically.
  if (frontmatter.pillar) {
    const allGuides = guidesSource.getPages(locale);
    const prefix = `${guidePath}/`;
    const childGuides = allGuides
      .filter((g) => {
        const url = g.url.replace(`/${locale}`, '');
        return url !== guidePath && url.startsWith(prefix);
      })
      .map((g) => {
        const childData = g.data as unknown as GuideFrontmatter;
        const childUrl = g.url.replace(`/${locale}`, '');
        return {
          slug: childUrl,
          title: childData.title || '',
          description: childData.description || '',
          image: childData.image || '',
          url: getLocalizedGuideUrl(childUrl, locale),
        };
      });

    post.related_guides = childGuides;
  }

  return post;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<GuidePageParams>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('pages.blog.metadata');

  const canonicalUrl = buildGuideCanonicalUrl(locale, slug);
  const slugPath = (slug ?? []).join('/');
  const fallbackOgImageUrl = slugPath
    ? `${envConfigs.app_url}/api/og/guides/${slugPath}`
    : `${envConfigs.app_url}/api/og/guides`;
  const guidePath = buildGuidePath(slug);

  const post = await loadGuide({ slug, locale });
  if (!post) {
    const fallbackTitle = (slug ?? []).join('/') || 'Guides';
    return {
      title: `${fallbackTitle} | ${t('title')}`,
      description: t('description'),
      alternates: {
        canonical: canonicalUrl,
        languages: buildLocaleAlternates(guidePath),
      },
      openGraph: {
        type: 'article',
        url: canonicalUrl,
        title: `${fallbackTitle} | ${t('title')}`,
        description: t('description'),
        images: [fallbackOgImageUrl],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${fallbackTitle} | ${t('title')}`,
        description: t('description'),
        images: [fallbackOgImageUrl],
      },
    };
  }

  const ogImageUrl = getGuideOgImageUrl(post.image, fallbackOgImageUrl);

  return {
    title: `${post.title} | ${t('title')}`,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLocaleAlternates(guidePath),
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: `${post.title} | ${t('title')}`,
      description: post.description,
      images: [ogImageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | ${t('title')}`,
      description: post.description,
      images: [ogImageUrl],
    },
  };
}

export default async function GuidePage({
  params,
}: {
  params: Promise<GuidePageParams>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await loadGuide({ slug, locale });

  if (!post) {
    return <Empty message={`Guide not found`} />;
  }

  const page: DynamicPage = {
    sections: {
      blogDetail: {
        block: 'blog-detail',
        data: {
          post,
        },
      },
    },
  };

  const Page = await getThemePage('dynamic-page');
  const canonicalUrl = buildGuideCanonicalUrl(locale, slug);

  return (
    <>
      <Page locale={locale} page={page} />
      <BlogPostSchemaMarkup
        post={{
          headline: post.title || '',
          description: post.description || '',
          image: getGuideOgImageUrl(
            post.image,
            `${canonicalUrl}/opengraph-image`
          ),
          datePublished: post.created_at_iso || '',
          dateModified: post.created_at_iso || '',
          faqs:
            post.faqs?.map((faq) => ({
              question: faq.question,
              answer: faq.answer,
            })) || [],
        }}
        url={canonicalUrl}
      />
    </>
  );
}
