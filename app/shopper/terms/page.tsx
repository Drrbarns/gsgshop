import LegalDoc from '@/components/legal/LegalDoc';
import { TERMS_INTRO, TERMS_SECTIONS } from '@/components/legal/terms-sections';
import { createShopperPageMetadata } from '@/lib/seo';

export const metadata = createShopperPageMetadata({
  title: 'Terms & Conditions',
  description:
    'The contract that governs how you use the GSG Personal Shopper service — sourcing, payments, delivery and your rights as a customer in Ghana.',
  path: '/terms',
});

export default function ShopperTerms() {
  return (
    <LegalDoc
      title="General Terms & Conditions"
      intro={TERMS_INTRO}
      effectiveDate="11 May 2026"
      documentTag="Terms"
      sections={TERMS_SECTIONS}
    />
  );
}
