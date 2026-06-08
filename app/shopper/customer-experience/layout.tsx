import { createShopperPageMetadata } from '@/lib/seo';

export const metadata = createShopperPageMetadata({
  title: 'Customer Experience',
  description:
    'See how My Personal Shopper by GSG delivers a premium customer experience — transparent pricing, WhatsApp updates and reliable delivery across Ghana.',
  path: '/customer-experience',
});

export default function CustomerExperienceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
