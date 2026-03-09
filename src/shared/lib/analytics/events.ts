export type PageType =
  | 'landing'
  | 'carmodder'
  | 'pricing'
  | 'auth'
  | 'settings'
  | 'blog'
  | 'showcases'
  | 'other';

export type ConfiguratorPanel = 'paint' | 'wheels' | 'mods' | 'accents';

export type ProductEventName =
  | 'page_viewed'
  | 'carmodder_viewed'
  | 'carmodder_vehicle_selected'
  | 'carmodder_panel_viewed'
  | 'carmodder_generate_clicked'
  | 'carmodder_auth_required'
  | 'carmodder_insufficient_credits'
  | 'carmodder_generation_requested'
  | 'carmodder_generation_completed'
  | 'carmodder_generation_partial_success'
  | 'carmodder_generation_failed'
  | 'carmodder_generation_timeout'
  | 'pricing_viewed'
  | 'checkout_started'
  | 'checkout_created'
  | 'payment_succeeded'
  | 'payment_failed'
  | 'payment_canceled';

export type BaseAnalyticsPayload = {
  path?: string;
  locale?: string;
  page_type?: PageType;
  source?: string;
  user_id?: string;
  is_authenticated?: boolean;
  referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  clarity_session_id?: string;
  clarity_page_id?: string;
};

export type ProductEventPayloadMap = {
  page_viewed: BaseAnalyticsPayload;
  carmodder_viewed: BaseAnalyticsPayload;
  carmodder_vehicle_selected: BaseAnalyticsPayload & {
    car_id: string;
    car_brand: string;
    car_name: string;
    car_type: string;
    is_custom_car: boolean;
  };
  carmodder_panel_viewed: BaseAnalyticsPayload & {
    panel: ConfiguratorPanel;
  };
  carmodder_generate_clicked: BaseAnalyticsPayload & {
    car_id: string;
    panel_at_click: ConfiguratorPanel;
    has_custom_car: boolean;
    has_mods: boolean;
    cost_credits: number;
    remaining_credits: number;
  };
  carmodder_auth_required: BaseAnalyticsPayload & {
    trigger: 'generate_click';
  };
  carmodder_insufficient_credits: BaseAnalyticsPayload & {
    source: 'generate_click' | 'server_generate_request';
    cost_credits: number;
    remaining_credits: number;
  };
  carmodder_generation_requested: BaseAnalyticsPayload & {
    bundle_id: string;
    provider: string;
    model: string;
    scene: 'text-to-image' | 'image-to-image';
    shot_count: number;
    charged_credits: number;
  };
  carmodder_generation_completed: BaseAnalyticsPayload & {
    bundle_id?: string;
    success_shots: number;
    failed_shots: number;
    duration_ms?: number;
  };
  carmodder_generation_partial_success: BaseAnalyticsPayload & {
    bundle_id?: string;
    success_shots: number;
    failed_shots: number;
    duration_ms?: number;
  };
  carmodder_generation_failed: BaseAnalyticsPayload & {
    bundle_id?: string;
    failed_shots: number;
    duration_ms?: number;
    error?: string;
  };
  carmodder_generation_timeout: BaseAnalyticsPayload & {
    bundle_id?: string;
    duration_ms?: number;
  };
  pricing_viewed: BaseAnalyticsPayload;
  checkout_started: BaseAnalyticsPayload & {
    source: 'pricing' | 'carmodder_insufficient_credits';
    product_id: string;
    payment_provider?: string;
    currency?: string;
  };
  checkout_created: BaseAnalyticsPayload & {
    order_id: string;
    product_id: string;
    payment_provider: string;
    payment_type: string;
    currency: string;
    amount: number;
  };
  payment_succeeded: BaseAnalyticsPayload & {
    order_id: string;
    payment_provider: string;
    payment_type: string;
    currency?: string;
    amount?: number;
    credits_amount?: number;
  };
  payment_failed: BaseAnalyticsPayload & {
    order_id?: string;
    payment_provider?: string;
    payment_type?: string;
    currency?: string;
    amount?: number;
    stage?: 'checkout_create' | 'payment_callback';
    error?: string;
  };
  payment_canceled: BaseAnalyticsPayload & {
    order_id?: string;
    payment_provider?: string;
    payment_type?: string;
    currency?: string;
    amount?: number;
  };
};

export function inferPageType(pathname: string): PageType {
  const normalized = pathname.replace(/^\/(zh)(?=\/|$)/, '') || '/';

  if (normalized === '/' || normalized.startsWith('/#')) return 'landing';
  if (normalized.startsWith('/carmodder')) return 'carmodder';
  if (normalized.startsWith('/pricing')) return 'pricing';
  if (normalized.startsWith('/showcases')) return 'showcases';
  if (normalized.startsWith('/blog')) return 'blog';
  if (normalized.startsWith('/settings')) return 'settings';
  if (
    normalized.startsWith('/sign-in') ||
    normalized.startsWith('/sign-up') ||
    normalized.startsWith('/verify-email')
  ) {
    return 'auth';
  }

  return 'other';
}
