/**
 * Categories that are fulfilled exclusively through the Personal Shopper
 * service (shopper.gsgbrands.com.gh) rather than the goods storefront.
 *
 * They are intentionally NOT stored as active rows in the `categories` table
 * (see migration 20260602000000_shopper_redirect_categories.sql). Instead they
 * are hard-coded here and rendered in the storefront navigation as links that
 * redirect straight to the shopper subdomain.
 *
 * Keep this list in sync with the soft-deleted slugs in that migration.
 */

import { shopperUrl } from './site-urls';

export type ShopperRedirectCategory = {
  id: string;
  name: string;
  /** Original catalogue slug (kept for reference / analytics only). */
  slug: string;
  /** Remix icon class used in the nav. */
  icon: string;
};

export const SHOPPER_REDIRECT_CATEGORIES: ShopperRedirectCategory[] = [
  { id: 'shopper-fresh-frozen-foods', name: 'Fresh & Frozen Foods', slug: 'fresh-frozen-foods', icon: 'ri-fridge-line' },
  { id: 'shopper-health-wellness', name: 'Health & Wellness', slug: 'health-wellness', icon: 'ri-heart-pulse-line' },
  { id: 'shopper-home-appliances-furniture', name: 'Home Appliances & Furniture', slug: 'home-appliances-furniture', icon: 'ri-sofa-line' },
  { id: 'shopper-building-construction', name: 'Building & Construction', slug: 'building-materials', icon: 'ri-building-2-line' },
  { id: 'shopper-special-order-services', name: 'Special-Order Services', slug: 'special-order-services', icon: 'ri-customer-service-2-line' },
];

/**
 * The destination these categories link to. Currently the personal shopper
 * landing page; swap the path here if a more specific entry point is wanted.
 */
export function shopperCategoryHref(): string {
  return shopperUrl('/');
}
