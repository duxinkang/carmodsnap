import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { envConfigs } from '@/config';
import { Empty } from '@/shared/blocks/common';
import { BlogPostSchemaMarkup } from '@/shared/components/seo/schema-markup';
import { buildPostRelationships } from '@/shared/lib/blog-clusters';
import { buildLocaleAlternates } from '@/shared/lib/seo';
import { getPost, getPostsAndCategories } from '@/shared/models/post';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('pages.blog.metadata');

  const canonicalUrl = getBlogCanonicalUrl(locale, slug);
  const fallbackOgImageUrl = `${canonicalUrl}/opengraph-image`;

  const post = await getPost({ slug, locale });
  if (!post) {
    return {
      title: `${slug} | ${t('title')}`,
      description: t('description'),
      alternates: {
        canonical: canonicalUrl,
        languages: buildLocaleAlternates(`/blog/${slug}`),
      },
      openGraph: {
        type: 'article',
        url: canonicalUrl,
        title: `${slug} | ${t('title')}`,
        description: t('description'),
        images: [fallbackOgImageUrl],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${slug} | ${t('title')}`,
        description: t('description'),
        images: [fallbackOgImageUrl],
      },
    };
  }

  const postOgImageUrl = getPostOgImageUrl(post.image, fallbackOgImageUrl);

  return {
    title: `${post.title} | ${t('title')}`,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
      languages: buildLocaleAlternates(`/blog/${slug}`),
    },
    openGraph: {
      type: 'article',
      url: canonicalUrl,
      title: `${post.title} | ${t('title')}`,
      description: post.description,
      images: [postOgImageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | ${t('title')}`,
      description: post.description,
      images: [postOgImageUrl],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPost({ slug, locale });

  if (!post) {
    return <Empty message={`Post not found`} />;
  }

  const { posts: allPosts } = await getPostsAndCategories({
    locale,
    limit: 100,
  });
  const relationships = buildPostRelationships(post, allPosts);
  const enrichedPost = {
    ...post,
    decision_path: relationships.decisionPath.map((item) => ({
      slug: item.slug,
      title: item.title,
      description: item.description,
      image: item.image,
      url: item.url,
    })),
    related_guides: relationships.relatedGuides.map((item) => ({
      slug: item.slug,
      title: item.title,
      description: item.description,
      image: item.image,
      url: item.url,
    })),
  };

  // build page sections
  const page: DynamicPage = {
    sections: {
      blogDetail: {
        block: 'blog-detail',
        data: {
          post: enrichedPost,
        },
      },
    },
  };

  const Page = await getThemePage('dynamic-page');

  const canonicalUrl = getBlogCanonicalUrl(locale, slug);

  return (
    <>
      <Page locale={locale} page={page} />
      <BlogPostSchemaMarkup
        post={{
          headline: enrichedPost.title || slug,
          description: enrichedPost.description || '',
          image: getPostOgImageUrl(
            enrichedPost.image,
            `${canonicalUrl}/opengraph-image`
          ),
          datePublished: enrichedPost.created_at_iso || '',
          dateModified: enrichedPost.created_at_iso || '',
          faqs:
            enrichedPost.faqs?.map((faq) => ({
              question: faq.question,
              answer: faq.answer,
            })) || [],
        }}
        url={canonicalUrl}
      />
    </>
  );
}

function getBlogCanonicalUrl(locale: string, slug: string) {
  return locale !== envConfigs.locale
    ? `${envConfigs.app_url}/${locale}/blog/${slug}`
    : `${envConfigs.app_url}/blog/${slug}`;
}

function getPostOgImageUrl(postImage: string | undefined, fallbackUrl: string) {
  if (!postImage) {
    return fallbackUrl;
  }

  if (postImage.startsWith('http')) {
    return postImage;
  }

  return `${envConfigs.app_url}${postImage}`;
}
