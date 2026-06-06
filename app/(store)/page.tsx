import HomePageClient from '@/components/HomePageClient';
import { createPageMetadata, SITE_NAME, SITE_TAGLINE } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description:
    'Shop groceries, household essentials, personal care, stationery, phones, electronics and fashion online in Ghana. Fast delivery from Accra with GSG Convenience Goods & More.',
  path: '/',
  keywords: [
    'buy online Ghana',
    'grocery delivery Accra',
    'convenience goods Ghana',
    'GSG shop',
  ],
});

export default function HomePage() {
  return <HomePageClient />;
}
