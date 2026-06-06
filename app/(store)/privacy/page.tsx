import LegalDoc from '@/components/legal/LegalDoc';
import {
  PRIVACY_INTRO,
  PRIVACY_SECTIONS,
} from '@/components/legal/privacy-sections';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Privacy Policy',
  description:
    'How GSG Convenience Goods & More collects, uses, shares, and protects your personal information — in compliance with the Data Protection Act, 2012 (Act 843) of Ghana.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <LegalDoc
      title="Privacy Policy"
      intro={PRIVACY_INTRO}
      effectiveDate="11 May 2026"
      documentTag="Privacy"
      sections={PRIVACY_SECTIONS}
    />
  );
}
