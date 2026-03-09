'use client';

type ClarityArgs = [string, ...any[]];

declare global {
  interface Window {
    clarity?: ((...args: ClarityArgs) => void) & { q?: unknown[] };
  }
}

function callClarity(...args: ClarityArgs) {
  if (typeof window === 'undefined' || typeof window.clarity !== 'function') {
    return;
  }

  try {
    window.clarity(...args);
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug('[analytics:clarity]', error);
    }
  }
}

export function identifyClarityUser(userId?: string | null) {
  if (!userId) return;
  callClarity('identify', userId);
}

export function tagClarity(
  key: string,
  value: string | number | boolean | undefined
) {
  if (value === undefined) return;
  callClarity('set', key, value);
}
