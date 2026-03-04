import {
  AnalyticsManager,
  ClarityAnalyticsProvider,
  GoogleAnalyticsProvider,
  OpenPanelAnalyticsProvider,
  PlausibleAnalyticsProvider,
  VercelAnalyticsProvider,
} from '@/extensions/analytics';
import { envConfigs } from '@/config';
import { Configs, getAllConfigs } from '@/shared/models/config';

function normalizePlausibleDomain(domain?: string): string {
  if (!domain) return '';

  const cleaned = domain
    .trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '');

  if (cleaned === 'modsnap.tech' || cleaned === 'www.modsnap.tech') {
    return 'www.carmodsnap.com';
  }

  return cleaned;
}

/**
 * get analytics manager with configs
 */
export function getAnalyticsManagerWithConfigs(configs: Configs) {
  const analytics = new AnalyticsManager();
  const fallbackDomain = normalizePlausibleDomain(envConfigs.app_url);
  const plausibleDomain =
    normalizePlausibleDomain(configs.plausible_domain) || fallbackDomain;
  const plausibleSrc = (configs.plausible_src || '').trim();

  // Debug: Check if Plausible configs are present
  console.log('Plausible configs:', {
    plausible_domain: plausibleDomain,
    plausible_src: plausibleSrc,
    hasBoth: plausibleDomain && plausibleSrc,
  });

  // google analytics
  if (configs.google_analytics_id) {
    analytics.addProvider(
      new GoogleAnalyticsProvider({ gaId: configs.google_analytics_id })
    );
  }

  // clarity
  if (configs.clarity_id) {
    analytics.addProvider(
      new ClarityAnalyticsProvider({ clarityId: configs.clarity_id })
    );
  }

  // plausible
  if (plausibleDomain && plausibleSrc) {
    console.log('Adding Plausible analytics provider');
    analytics.addProvider(
      new PlausibleAnalyticsProvider({
        domain: plausibleDomain,
        src: plausibleSrc,
      })
    );
  } else {
    console.log('Plausible configs missing, skipping');
  }

  // openpanel
  if (configs.openpanel_client_id) {
    analytics.addProvider(
      new OpenPanelAnalyticsProvider({
        clientId: configs.openpanel_client_id,
      })
    );
  }

  // vercel analytics
  if (configs.vercel_analytics_enabled === 'true') {
    analytics.addProvider(new VercelAnalyticsProvider({ mode: 'auto' }));
  }

  return analytics;
}

/**
 * global analytics service
 */
let analyticsService: AnalyticsManager | null = null;

/**
 * get analytics service instance
 */
export async function getAnalyticsService(
  configs?: Configs
): Promise<AnalyticsManager> {
  if (!configs) {
    configs = await getAllConfigs();
  }
  analyticsService = getAnalyticsManagerWithConfigs(configs);

  return analyticsService;
}
