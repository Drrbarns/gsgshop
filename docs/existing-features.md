# Existing Features Inventory

**Project:** E-commerce platform (MultiMey Supplies → rebranding to GSG Convenience Goods)  
**Stack:** Next.js 15 App Router, TypeScript, TailwindCSS, Supabase, Remix Icons.  
**Last inventory:** Before GSG storefront redesign.

---

## Storefront routes (app/(store)/)

| Route | Purpose |
|-------|--------|
| `/` | Homepage – hero slider, categories grid, featured products, newsletter |
| `/shop` | Shop – product grid, category/sort/search filters, pagination, uses `/api/storefront/products` and `/api/storefront/categories` |
| `/categories` | Categories – server component; lists active categories with links to `/shop?category=slug` |
| `/product/[slug]` | Product detail – client component; gallery, variants, add-to-cart, reviews, related products; uses slug or UUID |
| `/cart` | Shopping cart – CartContext, coupon (AdvancedCouponSystem), save for later, checkout CTA |
| `/checkout` | Checkout – steps (shipping → delivery → payment), guest/account, deliveryMethod (pickup/doorstep), Moolre payment, reCAPTCHA |
| `/pay/[orderId]` | Payment flow – post-checkout payment page |
| `/order-success` | Order success – confirmation after payment |
| `/order-tracking` | Order tracking – enter order number + email |
| `/account` | Account dashboard – tabs: profile, orders, addresses, security; links to /referral |
| `/account/verify-email` | Email verification |
| `/account/verify-phone` | Phone verification |
| `/account/privacy` | Privacy settings |
| `/auth/login` | Login |
| `/auth/signup` | Sign up |
| `/auth/forgot-password` | Forgot password |
| `/wishlist` | Wishlist (localStorage) |
| `/about` | About page |
| `/contact` | Contact page |
| `/shipping` | Shipping & delivery info – delivery options, zones, FAQ |
| `/faqs` | FAQs |
| `/help` | Help center |
| `/help/article/[id]` | Help article |
| `/blog` | Blog listing |
| `/blog/[id]` | Blog post |
| `/terms` | Terms of service |
| `/privacy` | Privacy policy |
| `/returns` | Returns policy |
| `/returns/confirmation` | Return confirmation |
| `/support/tickets` | Support tickets list |
| `/support/ticket` | New ticket |
| `/maintenance` | Maintenance page |
| `/offline` | Offline page |
| `/pwa-settings` | PWA settings |

**Added for GSG:** `/referral-rewards`, `/gift-card` (placeholder pages). `/basket` redirects to `/cart`.
**Note:** No `/browse/[broad]`, `/categories/[main]`, `/categories/[main]/[sub]` hierarchy routes.

---

## Storefront components

- **Layout:** `Header`, `Footer`, `MobileBottomNav`, `AnnouncementBar`, `ScrollToTop`, `ErrorBoundary`, `CookieConsent`, `NavigationProgress`
- **Cart:** `MiniCart`, `CartCountdown`, `AdvancedCouponSystem`, `OrderSummary`, `CheckoutSteps`
- **Product:** `ProductCard`, `ProductCardSkeleton`, `ProductFilters`, `ProductSort`, `ProductReviews`, `QuickViewModal`, `ImageZoom`, `LazyImage`, `SizeGuideModal`, `StockNotification`
- **Homepage:** `AnimatedSection`, `AnimatedGrid`, `NewsletterSection`
- **UI:** `PageHero`, `SkeletonLoader`, `AdvancedSearch`, `MobileSearchOverlay`, `MobileFilterDrawer`
- **Other:** `PWAPrompt`, `PWAInstaller`, `PWASplash`, `SessionTimeoutWarning`, `OfflineIndicator`, `NetworkStatusMonitor`, `UpdatePrompt`, `LiveSalesNotification`, `AccessibilityMenu`, `FlashSaleBanner`, `FreeShippingBar`, `OrderBumpUpsell`, `CartSuggestions`, `SmartRecommendations`, `RecentlyViewed`, `MessengerChatButton`, `FraudDetectionAlert`, `SEOHead`, `InstallInstructions`

---

## Context & data

- **CartContext:** cart in localStorage, addToCart, removeFromCart, updateQuantity, clearCart, subtotal, isCartOpen, setIsCartOpen
- **WishlistContext:** wishlist (localStorage)
- **CMSContext:** getSetting() for site_name, contact_email, etc. (store_settings/cms_content)
- **Data:** Supabase `products`, `categories`, `product_images`, `product_variants`, `orders`, `profiles`; APIs: `/api/storefront/products`, `/api/storefront/categories`; `cachedQuery` in lib/query-cache.ts

---

## Admin routes (app/admin/)

- `/admin` – Dashboard
- `/admin/login` – Admin login
- `/admin/orders`, `/admin/orders/[id]` – Orders list and detail
- `/admin/products`, `/admin/products/new`, `/admin/products/[id]` – Products CRUD
- `/admin/categories` – Categories CRUD
- `/admin/customers`, `/admin/customers/[id]` – Customers
- `/admin/coupons` – Coupons
- `/admin/analytics` – Analytics
- `/admin/inventory` – Inventory
- `/admin/pos` – POS
- `/admin/reviews` – Reviews
- `/admin/blog` – Blog
- `/admin/notifications` – Notifications
- `/admin/modules` – Store modules (feature flags)
- `/admin/customer-insights` – Customer insights
- `/admin/test-sms` – SMS testing

**Admin layout:** Sidebar, auth/role check (profiles.role admin/staff). Keep unchanged per spec.

---

## APIs (unchanged)

- `GET/POST /api/storefront/products` – List/create (if used)
- `GET /api/storefront/categories` – List categories
- `POST /api/recaptcha/verify` – reCAPTCHA
- `POST /api/payment/moolre/route` – Create payment
- `POST /api/payment/moolre/callback` – Payment callback
- `POST /api/payment/moolre/verify` – Verify payment
- `GET /api/cron/payment-reminders` – Cron
- `POST /api/notifications/route` – Notifications

---

## Theming (before GSG)

- **Tailwind:** `brand` (blue), `fontFamily`: Outfit (sans), Playfair Display (serif), Pacifico (handwriting)
- **globals.css:** Remix Icon CDN, animations (fadeInUp, shimmer, etc.), PWA and safe-area styles
- **No shadcn/ui or lucide-react** in package.json

---

## Checkout delivery (current)

- **State:** `deliveryMethod`: `'pickup' | 'doorstep'` (only two options in UI; more options commented out).
- **Fields:** shipping address, Ghana regions, payment method (moolre). No “Add To My Personal Shopper”, “Sole Express”, “Joint Express” or neighbor fields in current UI.

---

This inventory is the source of truth for what exists; the GSG redesign only changes storefront UI/layout/copy and adds new storefront components/routes where specified, without removing or breaking existing backend or admin behavior.
