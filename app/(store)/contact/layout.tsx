import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Contact Us',
  description:
    'Get in touch with GSG Convenience Goods & More. WhatsApp, phone, email and location in Accra, Ghana. We are here to help with orders, delivery and support.',
  path: '/contact',
  keywords: ['contact GSG Ghana', 'customer support Accra', 'GSG phone number'],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
