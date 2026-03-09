'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useLocale } from 'next-intl';

import { usePathname } from '@/core/i18n/navigation';
import { useAppContext } from '@/shared/contexts/app';
import { identifyClarityUser } from '@/shared/lib/analytics/clarity';
import { inferPageType } from '@/shared/lib/analytics/events';
import {
  clearPendingAuthIntent,
  readPendingAuthIntent,
} from '@/shared/lib/analytics/pending-intent';
import { trackProductEvent } from '@/shared/lib/analytics/track';

export function AnalyticsBridge() {
  const pathname = usePathname();
  const locale = useLocale();
  const { user } = useAppContext();
  const lastPageViewRef = useRef<string>('');
  const lastUserIdRef = useRef<string>('');

  const pageType = useMemo(() => inferPageType(pathname), [pathname]);

  useEffect(() => {
    const pageKey = `${locale}:${pathname}`;
    if (!pathname || lastPageViewRef.current === pageKey) return;

    lastPageViewRef.current = pageKey;
    trackProductEvent('page_viewed', {
      path: pathname,
      locale,
      page_type: pageType,
      user_id: user?.id,
      is_authenticated: !!user,
    });

    if (pageType === 'carmodder') {
      trackProductEvent('carmodder_viewed', {
        path: pathname,
        locale,
        page_type: pageType,
        user_id: user?.id,
        is_authenticated: !!user,
      });
    }
  }, [locale, pageType, pathname, user]);

  useEffect(() => {
    const userId = user?.id || '';
    if (!userId || lastUserIdRef.current === userId) return;

    const pendingAuth = readPendingAuthIntent();
    lastUserIdRef.current = userId;
    identifyClarityUser(userId);

    if (pendingAuth) {
      trackProductEvent('auth_succeeded', {
        locale,
        user_id: userId,
        is_authenticated: true,
        source: pendingAuth.source,
        method:
          (pendingAuth.method as 'email' | 'google' | 'github' | 'unknown') ||
          'unknown',
      });
      clearPendingAuthIntent();
    }

    if (typeof window !== 'undefined' && typeof window.op === 'function') {
      try {
        window.op('identify', {
          profileId: userId,
        });
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.debug('[analytics:identify]', error);
        }
      }
    }
  }, [user?.id]);

  return null;
}
