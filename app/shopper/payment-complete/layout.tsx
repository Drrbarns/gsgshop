import { createShopperPageMetadata } from '@/lib/seo';

export const metadata = createShopperPageMetadata({
  title: 'Payment Complete',
  description: 'Your personal shopper payment confirmation.',
  path: '/payment-complete',
  noindex: true,
});

export default function PaymentCompleteLayout({ children }: { children: React.ReactNode }) {
  return children;
}
