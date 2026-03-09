import { ReactNode } from 'react';

import type { TOCItemType } from '@/core/docs/toc';

export interface PostKeyStat {
  value: string;
  label: string;
  source?: string;
  url?: string;
}

export interface PostAuthoritySource {
  title: string;
  url: string;
  publisher?: string;
}

export interface PostFaq {
  question: string;
  answer: string;
}

export interface Blog {
  id?: string;
  sr_only_title?: string;
  title?: string;
  description?: string;
  categories?: Category[];
  currentCategory?: Category;
  posts: Post[];
  className?: string;
}

export interface Post {
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  image?: string;
  content?: string;
  created_at?: string;
  created_at_iso?: string;
  author_name?: string;
  author_role?: string;
  author_image?: string;
  url?: string;
  target?: string;
  categories?: Category[];
  body?: ReactNode;
  toc?: TOCItemType[];
  tags?: string[];
  version?: string;
  date?: string;
  answer_summary?: string;
  key_stats?: PostKeyStat[];
  authority_sources?: PostAuthoritySource[];
  faqs?: PostFaq[];
}

export interface Category {
  id?: string;
  slug?: string;
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  target?: string;
}
