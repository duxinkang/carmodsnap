import moment from 'moment';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { defaultLocale } from '@/config/locale';
import { getThemePage } from '@/core/theme';
import { envConfigs } from '@/config';
import {
  PostType as DBPostType,
  getPosts,
  PostStatus,
  getLocalPostsAndCategories,
} from '@/shared/models/post';
import {
  findTaxonomy,
  getTaxonomies,
  TaxonomyStatus,
  TaxonomyType,
} from '@/shared/models/taxonomy';
import { BreadcrumbListSchemaMarkup } from '@/shared/components/seo/schema-markup';
import {
  Category as CategoryType,
  Post as PostType,
} from '@/shared/types/blocks/blog';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations('pages.blog.metadata');

  const category = await findTaxonomy({
    slug,
    status: TaxonomyStatus.PUBLISHED,
  });

  const categoryName = category?.title || slug;
  const canonicalUrl =
    locale !== envConfigs.locale
      ? `${envConfigs.app_url}/${locale}/blog/category/${slug}`
      : `${envConfigs.app_url}/blog/category/${slug}`;

  return {
    title: `${categoryName} Blog Posts | ${t('title')}`,
    description: `Browse all ${categoryName} articles on CarModSnap.`,
    alternates: {
      canonical: canonicalUrl,
    },
  };
}

export default async function CategoryBlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ page?: number; pageSize?: number }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // load blog data
  const t = await getTranslations('pages.blog');

  const { page: pageNum, pageSize } = await searchParams;
  const page = pageNum || 1;
  const limit = pageSize || 30;

  // Get current category - try database first, then build from slug
  const categoryData = await findTaxonomy({
    slug,
    status: TaxonomyStatus.PUBLISHED,
  });

  // Get all categories for navigation
  const categoriesData = await getTaxonomies({
    type: TaxonomyType.CATEGORY,
    status: TaxonomyStatus.PUBLISHED,
  });

  // Build categories list
  const categories: CategoryType[] = categoriesData.map((category) => ({
    id: category.id,
    slug: category.slug,
    title: category.title,
    url: getLocalizedBlogUrl(`/blog/category/${category.slug}`, locale),
  }));

  // Add "All" category at the beginning
  categories.unshift({
    id: 'all',
    slug: 'all',
    title: t('messages.all'),
    url: getLocalizedBlogUrl('/blog', locale),
  });

  // Current category data - use db data or build from slug
  const currentCategory: CategoryType = categoryData
    ? {
        id: categoryData.id,
        slug: categoryData.slug,
        title: categoryData.title,
        url: getLocalizedBlogUrl(`/blog/category/${categoryData.slug}`, locale),
      }
    : {
        id: slug,
        slug: slug,
        title: slug
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        url: getLocalizedBlogUrl(`/blog/category/${slug}`, locale),
      };

  // Get posts filtered by category
  let posts: PostType[] = [];

  try {
    // Get database posts filtered by category
    const dbPosts = await getPosts({
      category: categoryData?.id || slug,
      type: DBPostType.ARTICLE,
      status: PostStatus.PUBLISHED,
      page,
      limit,
    });

    posts.push(
      ...dbPosts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title || '',
        description: post.description || '',
        author_name: post.authorName || '',
        author_image: post.authorImage || '',
        created_at: moment(post.createdAt).format('MMM D, YYYY') || '',
        image: post.image || '',
        url: getLocalizedBlogUrl(`/blog/${post.slug}`, locale),
      }))
    );
  } catch (e) {
    console.log('get category posts failed:', e);
  }

  // Get local posts filtered by category slug
  try {
    const { posts: localPosts } = await getLocalPostsAndCategories({
      locale,
      postPrefix: '/blog/',
      categoryPrefix: '/blog/category/',
    });

    // Filter local posts by category
    const filteredLocalPosts = localPosts.filter((post) => {
      // post.categories can be string[] or Category[]
      if (Array.isArray(post.categories)) {
        return post.categories.some((cat: any) =>
          typeof cat === 'string' ? cat === slug : cat?.slug === slug
        );
      }
      return false;
    });

    posts.push(
      ...filteredLocalPosts.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title || '',
        description: post.description || '',
        author_name: post.author_name || '',
        author_image: post.author_image || '',
        created_at: post.created_at || '',
        image: post.image || '',
        url: post.url || `/blog/${post.slug}`,
      }))
    );
  } catch (e) {
    console.log('get local category posts failed:', e);
  }

  // Sort posts by created_at desc
  posts = posts.sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  // Pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  posts = posts.slice(startIndex, endIndex);

  // build page sections
  const _page: DynamicPage = {
    title: t('page.title'),
    sections: {
      blog: {
        ...t.raw('page.sections.blog'),
        data: {
          categories,
          currentCategory,
          posts,
        },
      },
    },
  };

  // load page component
  const Page = await getThemePage('dynamic-page');

  return (
    <>
      <Page locale={locale} page={_page} />
      <BreadcrumbListSchemaMarkup
        items={[
          { position: 1, name: 'Home', item: '/' },
          { position: 2, name: 'Blog', item: getLocalizedBlogUrl('/blog', locale) },
          {
            position: 3,
            name: currentCategory.title || slug,
            item: getLocalizedBlogUrl(`/blog/category/${slug}`, locale),
          },
        ]}
      />
    </>
  );
}

function getLocalizedBlogUrl(url: string, locale: string) {
  if (locale === defaultLocale) {
    return url;
  }

  return `/${locale}${url}`;
}
