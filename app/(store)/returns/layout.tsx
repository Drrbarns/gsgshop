import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Returns & Refunds',
  description:
    'How to return or exchange items at GSG Convenience Goods & More. 14-day return policy, refund timelines and who pays return shipping in Ghana.',
  path: '/returns',
});

export default function ReturnsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
