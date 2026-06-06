import type { Metadata } from 'next';
import { getGoodsBaseUrl } from '@/lib/site-urls';

export const SITE_NAME = 'GSG Convenience Goods & More';
export const SITE_TAGLINE = 'Premium Convenience Shopping in Ghana';

export const DEFAULT_DESCRIPTION =
  'Shop groceries, household essentials, personal care, stationery, electronics and more online in Ghana. Fast delivery across Accra and nationwide from GSG Convenience Goods & More.';

export const DEFAULT_KEYWORDS = [
  'GSG Convenience Goods & More',
  'GSG shop Ghana',
  'goods.gsgbrands.com.gh',
  'online shopping Ghana',
  'buy groceries online Accra',
  'household essentials Ghana',
  'convenience store Ghana',
  'ecommerce Ghana',
  'delivery Accra',
  'stationery shop Ghana',
  'personal care products Ghana',
  'phones and electronics Ghana',
];

/** Canonical public origin for the goods storefront (Search Console property). */
export function getSiteUrl(): string {
  return getGoodsBaseUrl();
}

export function absoluteUrl(path: string = '/'): string {
  const base = getSiteUrl();
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized === '/' ? '' : normalized}`;
}

type PageMetadataInput = {
  title: string;
  description?: string;
  path?: string;
  keywords?: string[];
  noindex?: boolean;
  ogImage?: string;
};

/** Build consistent page metadata with canonical URLs for Google. */
export function createPageMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  keywords = [],
  noindex = false,
  ogImage = '/og-image.png',
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

  return {
    title,
    description,
    keywords: [...new Set([...keywords, ...DEFAULT_KEYWORDS])],
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: 'website',
      locale: 'en_GH',
      url,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      creator: '@gsgbrandsgh',
    },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
  };
}

/** Indexable static storefront routes for sitemap.xml */
export const STORE_STATIC_ROUTES: {
  path: string;
  changeFrequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  priority: number;
}[] = [
  { path: '/', changeFrequency: 'daily', priority: 1 },
  { path: '/shop', changeFrequency: 'daily', priority: 0.95 },
  { path: '/categories', changeFrequency: 'weekly', priority: 0.9 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/faqs', changeFrequency: 'monthly', priority: 0.75 },
  { path: '/shipping', changeFrequency: 'monthly', priority: 0.75 },
  { path: '/returns', changeFrequency: 'monthly', priority: 0.65 },
  { path: '/blog', changeFrequency: 'weekly', priority: 0.7 },
  { path: '/gift-card', changeFrequency: 'monthly', priority: 0.6 },
  { path: '/help', changeFrequency: 'monthly', priority: 0.55 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/cookies', changeFrequency: 'yearly', priority: 0.3 },
];

export function generateOrganizationSchema() {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteUrl,
    logo: absoluteUrl('/fgfg.png'),
    description: DEFAULT_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GH',
      addressLocality: 'Accra',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: '+233-246-033-792',
      areaServed: 'GH',
      availableLanguage: ['English'],
    },
    sameAs: [
      'https://facebook.com/gsgbrandsgh',
      'https://instagram.com/gsgbrandsgh',
      'https://twitter.com/gsgbrandsgh',
    ],
  };
}

export function generateWebSiteSchema() {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: siteUrl,
    description: DEFAULT_DESCRIPTION,
    inLanguage: 'en-GH',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/shop?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function generateOnlineStoreSchema() {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: SITE_NAME,
    url: siteUrl,
    image: absoluteUrl('/og-image.png'),
    description: DEFAULT_DESCRIPTION,
    priceRange: 'GHS',
    currenciesAccepted: 'GHS',
    paymentAccepted: 'Mobile Money, Card',
    areaServed: {
      '@type': 'Country',
      name: 'Ghana',
    },
  };
}

export function generateProductSchema(product: {
  name: string;
  description: string;
  image: string;
  price: number;
  currency?: string;
  sku: string;
  slug: string;
  rating?: number;
  reviewCount?: number;
  availability?: string;
  brand?: string;
  category?: string;
}) {
  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || SITE_NAME,
    },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'GHS',
      availability:
        product.availability === 'in_stock'
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: absoluteUrl(`/product/${product.slug}`),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      seller: {
        '@type': 'Organization',
        name: SITE_NAME,
      },
    },
  };

  if (product.rating && product.reviewCount) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (product.category) {
    schema.category = product.category;
  }

  return schema;
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
