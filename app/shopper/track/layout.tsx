import { createShopperPageMetadata } from '@/lib/seo';

export const metadata = createShopperPageMetadata({
  title: 'Track Your Request',
  description:
    'Track your personal shopper request status with My Personal Shopper by GSG using your Request ID or phone number.',
  path: '/track',
  keywords: ['track personal shopper request', 'order status Ghana'],
});

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
