import { ImageResponse } from 'next/og';

import { envConfigs } from '@/config';
import { guidesSource } from '@/core/docs/source';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

type GuideOgFrontmatter = {
  title?: string;
  description?: string;
  answer_summary?: string;
  pillar?: boolean;
};

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale, slug } = await params;
  const guidePage = guidesSource.getPage(slug ?? [], locale);

  const data = (guidePage?.data ?? {}) as GuideOgFrontmatter;
  const title = data.title || 'CarModSnap Guides';
  const description =
    data.answer_summary ||
    data.description ||
    'Pillar guides on car wraps, wheels, and modification rules — built for owners who want to decide once, not three times.';
  const isPillar = Boolean(data.pillar);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '56px',
          background:
            'linear-gradient(135deg, rgb(16, 14, 29) 0%, rgb(28, 24, 48) 45%, rgb(71, 37, 244) 100%)',
          color: 'white',
          fontFamily:
            'ui-sans-serif, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '28px',
            opacity: 0.95,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '999px',
                background: 'white',
              }}
            />
            CarModSnap Guides
          </div>
          {isPillar ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '20px',
                fontWeight: 600,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                padding: '8px 18px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.14)',
                border: '1px solid rgba(255,255,255,0.32)',
              }}
            >
              Pillar Guide
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          <div
            style={{
              fontSize: '60px',
              lineHeight: 1.1,
              fontWeight: 800,
              letterSpacing: '-0.02em',
              maxWidth: '1080px',
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: '26px',
              lineHeight: 1.4,
              color: 'rgba(255,255,255,0.88)',
              maxWidth: '1040px',
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '24px',
            color: 'rgba(255,255,255,0.82)',
          }}
        >
          <div>{envConfigs.app_name}</div>
          <div>{envConfigs.app_url.replace(/^https?:\/\//, '')}</div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
