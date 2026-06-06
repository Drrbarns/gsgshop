import { Metadata } from 'next';
import {
  absoluteUrl,
  createPageMetadata,
  DEFAULT_DESCRIPTION,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateProductSchema,
  generateWebSiteSchema,
  getSiteUrl,
  SITE_NAME,
} from '@/lib/seo';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: 'website' | 'product' | 'article';
  price?: number;
  currency?: string;
  availability?: string;
  category?: string;
  publishedTime?: string;
  author?: string;
  noindex?: boolean;
  path?: string;
}

export function generateMetadata({
  title = 'Premium Online Shopping in Ghana',
  description = DEFAULT_DESCRIPTION,
  keywords = [],
  ogImage = '/og-image.png',
  ogType = 'website',
  publishedTime,
  author,
  noindex = false,
  path = '/',
}: SEOProps): Metadata {
  const metadata = createPageMetadata({
    title,
    description,
    path,
    keywords,
    noindex,
    ogImage,
  });

  if (ogType === 'article' && publishedTime) {
    metadata.openGraph = {
      ...metadata.openGraph,
      type: 'article',
      publishedTime,
    };
  }

  if (author) {
    metadata.authors = [{ name: author }];
  }

  return metadata;
}

export {
  generateProductSchema,
  generateBreadcrumbSchema,
  generateOrganizationSchema,
  generateWebSiteSchema,
  getSiteUrl,
  absoluteUrl,
  SITE_NAME,
};

export function StructuredData({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
