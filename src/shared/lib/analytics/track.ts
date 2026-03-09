'use client';

import { tagClarity } from './clarity';
import { getClientAnalyticsContext } from './context';
import {
  BaseAnalyticsPayload,
  ProductEventName,
  ProductEventPayloadMap,
} from './events';

declare global {
  interface Window {
    op?: {
      (...args: any[]): void;
    };
  }
}

const clarityTagMap: Partial<Record<ProductEventName, string>> = {
  carmodder_auth_required: 'auth_required',
  carmodder_insufficient_credits: 'insufficient_credits',
  carmodder_generation_failed: 'generation_failed',
  carmodder_generation_timeout: 'generation_timeout',
  checkout_started: 'checkout_started',
  payment_succeeded: 'payment_succeeded',
  payment_failed: 'payment_failed',
  payment_canceled: 'payment_canceled',
};

export function trackProductEvent<T extends ProductEventName>(
  event: T,
  payload?: ProductEventPayloadMap[T]
) {
  if (typeof window === 'undefined') return;

  const mergedPayload = getClientAnalyticsContext(
    (payload || {}) as BaseAnalyticsPayload
  );

  if (process.env.NODE_ENV !== 'production') {
    console.debug('[analytics]', event, mergedPayload);
  }

  if (typeof window.op === 'function') {
    try {
      window.op('track', event, mergedPayload);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.debug('[analytics:openpanel]', error);
      }
    }
  }

  const tagKey = clarityTagMap[event];
  if (tagKey) {
    tagClarity(tagKey, 'true');
  }
}
