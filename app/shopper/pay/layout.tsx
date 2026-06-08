import { createShopperPageMetadata } from '@/lib/seo';

export const metadata = createShopperPageMetadata({
  title: 'Complete Payment',
  description: 'Securely pay for your personal shopper request.',
  path: '/pay',
  noindex: true,
});

export default function PayLayout({ children }: { children: React.ReactNode }) {
  return children;
}
