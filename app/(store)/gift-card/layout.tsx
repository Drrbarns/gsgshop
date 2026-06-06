import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Gift Cards',
  description: 'Buy GSG gift cards for friends and family. Redeemable on groceries, household essentials and more at GSG Convenience Goods & More.',
  path: '/gift-card',
});

export default function GiftCardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
