import LegalDoc from '@/components/legal/LegalDoc';
import { TERMS_INTRO, TERMS_SECTIONS } from '@/components/legal/terms-sections';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Terms & Conditions',
  description:
    'Terms and conditions for using GSG Convenience Goods & More — orders, delivery, payments, returns and your rights as a customer in Ghana.',
  path: '/terms',
});

export default function TermsPage() {
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
