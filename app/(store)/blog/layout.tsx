import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Blog',
  description:
    'Shopping tips, product guides and lifestyle articles from GSG Convenience Goods & More — your guide to smart online shopping in Ghana.',
  path: '/blog',
});

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
