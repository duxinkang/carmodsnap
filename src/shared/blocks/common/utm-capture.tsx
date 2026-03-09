'use client';

import { useEffect } from 'react';

import { getCookie, setCookie } from '@/shared/lib/cookie';

const UTM_COOKIE_NAMES = ['utm_source', 'utm_medium', 'utm_campaign'] as const;
const COOKIE_DAYS = 30;

function sanitizeUtmSource(value: string) {
  const decoded = (() => {
    try {
      return decodeURIComponent(value);
    } catch {
      return value;
    }
  })();

  return decoded
    .trim()
    .replace(/[^\w\-.:]/g, '') // allow a-zA-Z0-9_ - . :
    .slice(0, 100);
}

/**
 * Capture utm_source from landing URL and persist in cookie.
 * This enables server-side signup to save it into the user table.
 */
export function UtmCapture() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    UTM_COOKIE_NAMES.forEach((cookieName) => {
      if (getCookie(cookieName)) return;

      const value = params.get(cookieName);
      if (!value) return;

      const sanitized = sanitizeUtmSource(value);
      if (!sanitized) return;

      setCookie(cookieName, encodeURIComponent(sanitized), COOKIE_DAYS);
    });
  }, []);

  return null;
}
