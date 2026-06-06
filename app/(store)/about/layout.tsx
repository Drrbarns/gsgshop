import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'About Us',
  description:
    'Learn about GSG Convenience Goods & More — your trusted online convenience store in Ghana, delivering quality everyday essentials across Accra and nationwide.',
  path: '/about',
});

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
