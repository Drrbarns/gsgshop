import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Shop All Products',
  description:
    'Browse groceries, household essentials, personal care, stationery, electronics and fashion. Filter by category, price and rating. Shop online with delivery across Ghana.',
  path: '/shop',
  keywords: ['shop online Ghana', 'GSG products', 'buy groceries Accra', 'online store'],
});

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return children;
}
