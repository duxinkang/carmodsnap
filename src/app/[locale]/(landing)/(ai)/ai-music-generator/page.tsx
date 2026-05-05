import { redirect } from 'next/navigation';

import { defaultLocale } from '@/config/locale';

export default async function AiMusicGeneratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(locale === defaultLocale ? '/carmodder' : `/${locale}/carmodder`);
}
