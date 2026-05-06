import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

import { guidesSource } from '@/core/docs/source';
import { envConfigs } from '@/config';
import { defaultLocale } from '@/config/locale';

export const runtime = 'nodejs';
export const revalidate = 3600;

const SIZE = {
  width: 1200,
  height: 630,
};

const DEFAULT_DESCRIPTION =
  'Pillar guides on car wraps, wheels, and modification rules, built for owners who want to decide once, not three times.';

type GuideOgFrontmatter = {
  title?: string;
  description?: string;
  answer_summary?: string;
  pillar?: boolean;
};

function getFallbackTitle(slug?: string[]) {
  if (!slug || slug.length === 0) return 'CarModSnap Guides';

  return slug
    .at(-1)!
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const guidePage = guidesSource.getPage(slug ?? [], defaultLocale);

  const data = (guidePage?.data ?? {}) as GuideOgFrontmatter;
  const title = data.title || getFallbackTitle(slug);
  const description =
    data.answer_summary || data.description || DEFAULT_DESCRIPTION;
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
      ...SIZE,
    }
  );
}
