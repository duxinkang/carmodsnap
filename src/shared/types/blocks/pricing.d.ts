import { Button } from '@/types/blocks/base/button';

export interface PricingGroup {
  name?: string;
  title?: string;
  description?: string;
  label?: string;
  is_featured?: boolean;
}

export interface PricingCurrency {
  currency: string; // currency code
  amount: number; // price amount
  price: string; // price text
  original_price: string; // original price text
  payment_product_id?: string;
  payment_providers?: string[];
}

export interface PricingItem {
  title?: string;
  description?: string;
  label?: string;

  currency: string; // default currency
  amount: number; // default price amount
  price?: string; // default price text
  original_price?: string; // default original price text
  currencies?: PricingCurrency[]; // alternative currencies with different prices

  unit?: string;
  features_title?: string;
  features?: string[];
  button?: Button;
  tip?: string;
  is_featured?: boolean;
  interval: 'one-time' | 'day' | 'week' | 'month' | 'year';
  product_id: string;
  payment_product_id?: string;
  payment_providers?: string[];
  product_name?: string;
  plan_name?: string;

  credits?: number;
  valid_days?: number;
  group?: string;
}

export interface FeatureComparisonRow {
  name: string;
  starter: boolean | string;
  standard: boolean | string;
  premium: boolean | string;
  category?: string;
}

export interface FeatureDetailItem {
  title: string;
  description: string;
}

export interface FeatureDetailSection {
  title: string;
  icon?: string;
  features: FeatureDetailItem[];
}

export interface FeatureComparison {
  title?: string;
  description?: string;
  features: FeatureComparisonRow[];
}

export interface FeaturesDetail {
  title?: string;
  description?: string;
  sections: FeatureDetailSection[];
}

export interface TrustBadge {
  title?: string;
  description?: string;
}

export interface TrustBadges {
  money_back?: TrustBadge;
  secure_payment?: TrustBadge;
  cancel_anytime?: TrustBadge;
  instant_access?: TrustBadge;
}

export interface Pricing {
  id?: string;
  disabled?: boolean;
  name?: string;
  title?: string;
  description?: string;
  items?: PricingItem[];
  groups?: PricingGroup[];
  className?: string;
  sr_only_title?: string;

  // New fields for enhanced pricing page
  feature_comparison?: FeatureComparison;
  features_detail?: FeaturesDetail;
  trust_badges?: TrustBadges;
}
