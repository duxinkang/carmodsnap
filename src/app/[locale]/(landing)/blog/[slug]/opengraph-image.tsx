import { ImageResponse } from 'next/og';

import { envConfigs } from '@/config';
import { getPost } from '@/shared/models/post';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getPost({ slug, locale });

  const title = post?.title || 'CarModSnap Blog';
  const description =
    post?.description ||
    'Car modification guides, visual planning tips, and practical upgrade workflows.';

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
            gap: '16px',
            fontSize: '28px',
            opacity: 0.95,
          }}
        >
          <div
            style={{
              width: '16px',
              height: '16px',
              borderRadius: '999px',
              background: 'white',
            }}
          />
          CarModSnap Blog
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
              fontSize: '28px',
              lineHeight: 1.4,
              color: 'rgba(255,255,255,0.88)',
              maxWidth: '1020px',
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
