import LegalDoc from '@/components/legal/LegalDoc';
import {
  COOKIES_INTRO,
  COOKIES_SECTIONS,
} from '@/components/legal/cookies-sections';
import { createShopperPageMetadata } from '@/lib/seo';

export const metadata = createShopperPageMetadata({
  title: 'Cookie Policy',
  description:
    'How GSG Personal Shopper uses cookies and similar technologies, and how you can manage your preferences.',
  path: '/cookies',
});

export default function ShopperCookies() {
  return (
    <LegalDoc
      title="Cookie Policy"
      intro={COOKIES_INTRO}
      effectiveDate="11 May 2026"
      documentTag="Cookies"
      sections={COOKIES_SECTIONS}
    />
  );
}
