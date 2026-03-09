'use client';

import { TOCItems, TOCProvider } from 'fumadocs-ui/components/layout/toc';
import { CalendarIcon, ListIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { MarkdownPreview } from '@/shared/blocks/common';
import { Crumb } from '@/shared/blocks/common/crumb';
import { type Post as PostType } from '@/shared/types/blocks/blog';
import { NavItem } from '@/shared/types/blocks/common';

import '@/config/style/docs.css';

export function BlogDetail({ post }: { post: PostType }) {
  const t = useTranslations('pages.blog.messages');

  const crumbItems: NavItem[] = [
    {
      title: t('crumb'),
      url: '/blog',
      icon: 'Newspaper',
      is_active: false,
    },
    {
      title: post.title || '',
      url: `/blog/${post.slug}`,
      is_active: true,
    },
  ];

  // Check if TOC should be shown
  const showToc = post.toc && post.toc.length > 0;

  // Check if Author info should be shown
  const showAuthor = post.author_name || post.author_image || post.author_role;

  // Calculate main content column span based on what sidebars are shown
  const getMainColSpan = () => {
    if (showToc && showAuthor) return 'lg:col-span-6';
    if (showToc || showAuthor) return 'lg:col-span-9';
    return 'lg:col-span-12';
  };

  return (
    <TOCProvider toc={post.toc || []}>
      <section id={post.id}>
        <div className="py-24 md:py-32">
          <div className="mx-auto w-full max-w-7xl px-6 md:px-8">
            <Crumb items={crumbItems} />

            {/* Header Section */}
            <div className="mt-16 text-center">
              <h1 className="text-foreground mx-auto mb-4 w-full text-3xl font-bold md:max-w-4xl md:text-4xl">
                {post.title}
              </h1>
              <div className="text-muted-foreground text-md mb-8 flex items-center justify-center gap-4">
                {post.created_at && (
                  <div className="text-muted-foreground text-md mb-8 flex items-center justify-center gap-2">
                    <CalendarIcon className="size-4" /> {post.created_at}
                  </div>
                )}
              </div>
            </div>

            {post.image && (
              <div className="mx-auto mb-10 max-w-5xl overflow-hidden rounded-2xl border shadow-sm">
                <div className="aspect-[16/9]">
                  <img
                    src={post.image}
                    alt={post.title || ''}
                    className="block h-full w-full object-cover object-center"
                  />
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 gap-8 md:mt-12 lg:grid-cols-12">
              {/* Table of Contents - Left Sidebar */}
              {showToc && (
                <div className="lg:col-span-3">
                  <div className="sticky top-24 hidden md:block">
                    <div className="bg-muted/30 rounded-lg p-4">
                      <h2 className="text-foreground mb-4 flex items-center gap-2 font-semibold">
                        <ListIcon className="size-4" /> {t('toc')}
                      </h2>
                      <TOCItems />
                    </div>
                  </div>
                </div>
              )}

              {/* Main Content - Center */}
              <div className={getMainColSpan()}>
                {post.answer_summary || post.key_stats?.length ? (
                  <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    {post.answer_summary ? (
                      <div className="mb-5">
                        <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-slate-500 uppercase">
                          Quick answer
                        </p>
                        <p className="text-base leading-7 text-slate-700">
                          {post.answer_summary}
                        </p>
                      </div>
                    ) : null}

                    {post.key_stats && post.key_stats.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {post.key_stats.map((stat) => (
                          <div
                            key={`${stat.value}-${stat.label}`}
                            className="rounded-xl border border-slate-200 bg-white p-4"
                          >
                            <p className="text-2xl font-semibold text-slate-900">
                              {stat.value}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">
                              {stat.label}
                            </p>
                            {stat.url ? (
                              <a
                                href={stat.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-3 inline-flex text-xs font-medium text-slate-500 underline underline-offset-4"
                              >
                                {stat.source || 'Source'}
                              </a>
                            ) : stat.source ? (
                              <p className="mt-3 text-xs text-slate-500">
                                {stat.source}
                              </p>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null}

                <article className="p-0">
                  {post.body ? (
                    <div className="docs text-foreground text-md space-y-4 font-normal *:leading-relaxed">
                      {post.body}
                    </div>
                  ) : (
                    post.content && (
                      <div className="prose prose-lg text-muted-foreground max-w-none space-y-6 *:leading-relaxed">
                        <MarkdownPreview content={post.content} />
                      </div>
                    )
                  )}
                </article>

                {post.authority_sources && post.authority_sources.length > 0 ? (
                  <section className="mt-12 rounded-2xl border border-slate-200 bg-white p-6">
                    <h2 className="text-xl font-semibold text-slate-900">
                      Authority sources
                    </h2>
                    <div className="mt-4 space-y-3">
                      {post.authority_sources.map((source) => (
                        <a
                          key={source.url}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block rounded-xl border border-slate-200 p-4 transition-colors hover:border-slate-300 hover:bg-slate-50"
                        >
                          <p className="font-medium text-slate-900">
                            {source.title}
                          </p>
                          {source.publisher ? (
                            <p className="mt-1 text-sm text-slate-500">
                              {source.publisher}
                            </p>
                          ) : null}
                        </a>
                      ))}
                    </div>
                  </section>
                ) : null}

                {post.faqs && post.faqs.length > 0 ? (
                  <section className="mt-12">
                    <h2 className="text-2xl font-semibold text-slate-900">
                      Frequently asked questions
                    </h2>
                    <div className="mt-6 space-y-4">
                      {post.faqs.map((faq) => (
                        <div
                          key={faq.question}
                          className="rounded-2xl border border-slate-200 bg-white p-5"
                        >
                          <h3 className="text-lg font-semibold text-slate-900">
                            {faq.question}
                          </h3>
                          <p className="mt-2 leading-7 text-slate-600">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>

              {/* Author Info - Right Sidebar */}
              {showAuthor && (
                <div className="lg:col-span-3">
                  <div className="sticky top-24">
                    <div className="bg-muted/30 rounded-lg p-6">
                      <div className="text-center">
                        {post.author_image && (
                          <div className="ring-foreground/10 mx-auto mb-4 aspect-square size-20 overflow-hidden rounded-xl border border-transparent shadow-md ring-1 shadow-black/15">
                            <img
                              src={post.author_image}
                              alt={post.author_name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        {post.author_name && (
                          <p className="text-foreground mb-1 text-lg font-semibold">
                            {post.author_name}
                          </p>
                        )}
                        {post.author_role && (
                          <p className="text-muted-foreground mb-4 text-sm">
                            {post.author_role}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </TOCProvider>
  );
}
