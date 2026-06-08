import { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/seo';

// Private/transactional paths kept out of every crawler.
const DISALLOW = [
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
];

// AI / LLM search crawlers we explicitly welcome so the brand can be cited in
// AI answers (ChatGPT, Claude, Perplexity, Google AI Overviews, etc.).
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'Amazonbot',
  'CCBot',
  'cohere-ai',
  'Meta-ExternalAgent',
  'Bytespider',
  'DuckAssistBot',
  'YouBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW,
      },
      // Explicitly allow each AI crawler to index public content.
      ...AI_CRAWLERS.map((agent) => ({
        userAgent: agent,
        allow: '/',
        disallow: DISALLOW,
      })),
    ],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: absoluteUrl('/'),
  };
}
