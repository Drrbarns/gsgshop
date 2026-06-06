import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Help Centre',
  description: 'Get help with your GSG orders, account, delivery and payments. Browse help articles or contact our support team in Ghana.',
  path: '/help',
});

export default function HelpLayout({ children }: { children: React.ReactNode }) {
  return children;
}
