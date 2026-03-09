'use client';

import { getCookie } from '@/shared/lib/cookie';

import { BaseAnalyticsPayload, inferPageType } from './events';

function decodeCookieValue(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function getClarityCookiePart(cookieName: string, index: number) {
  const value = decodeCookieValue(getCookie(cookieName));
  if (!value) return undefined;
  const parts = value.split('.');
  return parts[index] || undefined;
}

export function getClientAnalyticsContext(
  payload: BaseAnalyticsPayload = {}
): BaseAnalyticsPayload {
  if (typeof window === 'undefined') return payload;

  const pathname = window.location.pathname;
  const locale =
    payload.locale ||
    (pathname.startsWith('/zh/') || pathname === '/zh' ? 'zh' : 'en');

  return {
    path: pathname,
    locale,
    page_type: payload.page_type || inferPageType(pathname),
    referrer: payload.referrer || document.referrer || undefined,
    utm_source:
      payload.utm_source || decodeCookieValue(getCookie('utm_source')),
    utm_medium:
      payload.utm_medium || decodeCookieValue(getCookie('utm_medium')),
    utm_campaign:
      payload.utm_campaign || decodeCookieValue(getCookie('utm_campaign')),
    clarity_session_id:
      payload.clarity_session_id || getClarityCookiePart('_clck', 0),
    clarity_page_id:
      payload.clarity_page_id || getClarityCookiePart('_clsk', 1),
    ...payload,
  };
}
