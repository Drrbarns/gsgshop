-- =====================================================================
-- Move "Personal Shopper only" categories out of the goods catalogue
-- =====================================================================
-- These categories are fulfilled exclusively through the Personal Shopper
-- service (shopper.gsgbrands.com.gh) — we don't stock them in the goods
-- storefront. They held no products, so we soft-delete the roots AND their
-- children (status = 'inactive') to pull them out of every data-driven
-- category surface (storefront nav, /categories, /shop filters).
--
-- The storefront then hard-codes these category names in the nav and links
-- them straight to the shopper subdomain (see lib/shopper-categories.ts).
--
-- Soft-delete (not DROP) keeps the rows recoverable if we ever decide to
-- stock them in the goods catalogue later.
-- =====================================================================

WITH targets AS (
    SELECT id
    FROM public.categories
    WHERE slug IN (
        'fresh-frozen-foods',
        'health-wellness',
        'home-appliances-furniture',
        'building-materials',
        'special-order-services'
    )
)
UPDATE public.categories
SET status = 'inactive',
    updated_at = now()
WHERE id IN (SELECT id FROM targets)
   OR parent_id IN (SELECT id FROM targets);
