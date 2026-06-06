import { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/auth/',
          '/account/',
          '/checkout',
          '/cart',
          '/basket',
          '/wishlist',
          '/pay/',
          '/order-success',
          '/order-tracking',
          '/returns/confirmation',
          '/support/',
          '/maintenance',
          '/offline',
          '/pwa-settings',
        ],
      },
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
