import { headers } from 'next/headers';

import { Configs } from '@/shared/models/config';

import {
  BaseAnalyticsPayload,
  inferPageType,
  ProductEventName,
  ProductEventPayloadMap,
} from './events';

function decodeSafe(value?: string) {
  if (!value) return undefined;
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(
    new RegExp(
      `(?:^|; )${name.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}=([^;]*)`
    )
  );
  return decodeSafe(match?.[1]);
}

async function getRequestContext(payload: BaseAnalyticsPayload = {}) {
  try {
    const requestHeaders = await headers();
    const path =
      payload.path ||
      requestHeaders.get('x-pathname') ||
      requestHeaders.get('next-url') ||
      undefined;
    const cookieHeader = requestHeaders.get('cookie');
    const acceptLanguage = requestHeaders.get('accept-language') || '';

    const locale =
      payload.locale ||
      (path?.startsWith('/zh/') || path === '/zh'
        ? 'zh'
        : acceptLanguage.toLowerCase().startsWith('zh')
          ? 'zh'
          : 'en');

    return {
      path,
      locale,
      page_type: payload.page_type || (path ? inferPageType(path) : undefined),
      referrer:
        payload.referrer ||
        requestHeaders.get('referer') ||
        requestHeaders.get('referrer') ||
        undefined,
      utm_source:
        payload.utm_source || getCookieValue(cookieHeader, 'utm_source'),
      utm_medium:
        payload.utm_medium || getCookieValue(cookieHeader, 'utm_medium'),
      utm_campaign:
        payload.utm_campaign || getCookieValue(cookieHeader, 'utm_campaign'),
    } satisfies BaseAnalyticsPayload;
  } catch {
    return payload;
  }
}

export async function trackServerEvent<T extends ProductEventName>(
  event: T,
  payload: ProductEventPayloadMap[T],
  configs: Configs
) {
  const clientId = (configs.openpanel_client_id || '').trim();
  const clientSecret = (configs.openpanel_client_secret || '').trim();

  if (!clientId || !clientSecret) {
    return;
  }

  const requestContext = await getRequestContext(
    payload as BaseAnalyticsPayload
  );
  const properties = {
    ...requestContext,
    ...payload,
  };

  try {
    await fetch('https://api.openpanel.dev/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'openpanel-client-id': clientId,
        'openpanel-client-secret': clientSecret,
        ...(requestContext.referrer
          ? { referer: requestContext.referrer }
          : {}),
      },
      body: JSON.stringify({
        type: 'track',
        payload: {
          name: event,
          profileId: properties.user_id,
          properties,
        },
      }),
      cache: 'no-store',
    });
  } catch (error) {
    console.error('[analytics] server track failed:', error);
  }
}
