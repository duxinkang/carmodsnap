'use client';

const AUTH_SOURCE_KEY = 'analytics_pending_auth_source';
const AUTH_METHOD_KEY = 'analytics_pending_auth_method';

function getSessionStorage() {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage;
}

export function setPendingAuthIntent(source: string, method?: string) {
  const storage = getSessionStorage();
  if (!storage) return;
  const existingSource = storage.getItem(AUTH_SOURCE_KEY);
  storage.setItem(AUTH_SOURCE_KEY, existingSource || source);
  if (method) {
    storage.setItem(AUTH_METHOD_KEY, method);
  }
}

export function readPendingAuthIntent() {
  const storage = getSessionStorage();
  if (!storage) return null;
  const source = storage.getItem(AUTH_SOURCE_KEY);
  const method = storage.getItem(AUTH_METHOD_KEY);
  if (!source) return null;
  return { source, method: method || undefined };
}

export function clearPendingAuthIntent() {
  const storage = getSessionStorage();
  if (!storage) return;
  storage.removeItem(AUTH_SOURCE_KEY);
  storage.removeItem(AUTH_METHOD_KEY);
}
