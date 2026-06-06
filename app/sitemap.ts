import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getShopperBaseUrl } from '@/lib/site-urls';
import { absoluteUrl, STORE_STATIC_ROUTES } from '@/lib/seo';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const shopperUrl = getShopperBaseUrl();
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = STORE_STATIC_ROUTES.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const shopperPages: MetadataRoute.Sitemap = [
    { url: shopperUrl, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${shopperUrl}/how-it-works`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${shopperUrl}/shopping-list`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${shopperUrl}/track`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${shopperUrl}/faqs`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${shopperUrl}/customer-experience`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${shopperUrl}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${shopperUrl}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${shopperUrl}/cookies`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = ['1', '2', '3'].map((id) => ({
    url: absoluteUrl(`/blog/${id}`),
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  let productPages: MetadataRoute.Sitemap = [];
  let categoryPages: MetadataRoute.Sitemap = [];

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: products } = await supabase
      .from('products')
      .select('slug, updated_at')
      .eq('status', 'active');

    if (products) {
      productPages = products.map((product) => ({
        url: absoluteUrl(`/product/${product.slug}`),
        lastModified: product.updated_at ? new Date(product.updated_at) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    }

    const { data: categories } = await supabase
      .from('categories')
      .select('slug, updated_at')
      .eq('status', 'active');

    if (categories) {
      categoryPages = categories.map((category) => ({
        url: absoluteUrl(`/shop?category=${category.slug}`),
        lastModified: category.updated_at ? new Date(category.updated_at) : now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }

  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return [...staticPages, ...shopperPages, ...productPages, ...categoryPages, ...blogPages];
}
