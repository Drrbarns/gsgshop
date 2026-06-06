import { Metadata } from 'next';
import { createClient } from '@supabase/supabase-js';
import ProductDetailClient from './ProductDetailClient';
import {
  absoluteUrl,
  createPageMetadata,
  generateBreadcrumbSchema,
  generateProductSchema,
} from '@/lib/seo';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type Props = {
  params: Promise<{ slug: string }>;
};

function resolveCategory(categories: { name: string; slug: string } | { name: string; slug: string }[] | null | undefined) {
  if (!categories) return { name: 'Shop', slug: 'shop' };
  if (Array.isArray(categories)) return categories[0] || { name: 'Shop', slug: 'shop' };
  return categories;
}

async function fetchProduct(slug: string) {
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

  let query = supabase
    .from('products')
    .select(`
      id,
      name,
      slug,
      description,
      price,
      quantity,
      sku,
      rating_avg,
      categories(name, slug),
      product_images(url, position),
      product_variants(id, price, quantity)
    `)
    .eq('status', 'active');

  if (isUUID) {
    query = query.or(`id.eq.${slug},slug.eq.${slug}`);
  } else {
    query = query.eq('slug', slug);
  }

  const { data } = await query.single();
  return data;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return {
      title: 'Product Not Found',
      description: 'The requested product could not be found.',
      robots: { index: false, follow: false },
    };
  }

  const mainImage = product.product_images
    ?.sort((a: { position: number }, b: { position: number }) => a.position - b.position)[0]?.url;
  const description =
    product.description?.substring(0, 160) ||
    `Buy ${product.name} online at GSG Convenience Goods & More. Fast delivery across Ghana.`;
  const category = resolveCategory(product.categories);

  return createPageMetadata({
    title: product.name,
    description,
    path: `/product/${product.slug || slug}`,
    keywords: [
      product.name,
      category.name || '',
      'buy online Ghana',
      'GSG shop',
    ].filter(Boolean),
    ogImage: mainImage || '/og-image.png',
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProduct(slug);

  if (!product) {
    return <ProductDetailClient slug={slug} />;
  }

  const mainImage = product.product_images
    ?.sort((a: { position: number }, b: { position: number }) => a.position - b.position)[0]?.url;
  const variants = product.product_variants || [];
  const hasVariants = variants.length > 0;
  const minVariantPrice = hasVariants
    ? Math.min(...variants.map((v: { price: number }) => v.price || product.price))
    : product.price;
  const totalVariantStock = hasVariants
    ? variants.reduce((sum: number, v: { quantity: number }) => sum + (v.quantity || 0), 0)
    : 0;
  const effectiveStock = hasVariants ? totalVariantStock : product.quantity;
  const category = resolveCategory(product.categories);
  const categoryName = category.name || 'Shop';
  const categorySlug = category.slug || 'shop';
  const productSlug = product.slug || slug;

  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description || `Buy ${product.name} at GSG Convenience Goods & More.`,
    image: mainImage || absoluteUrl('/og-image.png'),
    price: hasVariants ? minVariantPrice : product.price,
    currency: 'GHS',
    sku: product.sku || product.id,
    slug: productSlug,
    rating: product.rating_avg || undefined,
    reviewCount: undefined,
    availability: effectiveStock > 0 ? 'in_stock' : 'out_of_stock',
    category: categoryName,
  });

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: absoluteUrl('/') },
    { name: 'Shop', url: absoluteUrl('/shop') },
    { name: categoryName, url: absoluteUrl(`/shop?category=${categorySlug}`) },
    { name: product.name, url: absoluteUrl(`/product/${productSlug}`) },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProductDetailClient slug={slug} />
    </>
  );
}
