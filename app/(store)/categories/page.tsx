import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';

export const revalidate = 0; // Ensure fresh data on every visit

export default async function CategoriesPage() {
  const { data: categoriesData } = await supabase
    .from('categories')
    .select(`
      id,
      name,
      slug,
      description,
      image_url,
      position
    `)
    .eq('status', 'active')
    .order('position', { ascending: true });

  // Palette to cycle through for visual variety
  const palette = [
    { color: 'from-purple-500 to-indigo-600', icon: 'ri-store-2-line', bg: 'bg-purple-50', text: 'text-purple-600' },
    { color: 'from-blue-500 to-cyan-600', icon: 'ri-shopping-bag-3-line', bg: 'bg-blue-50', text: 'text-blue-600' },
    { color: 'from-emerald-500 to-teal-600', icon: 'ri-t-shirt-line', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    { color: 'from-orange-500 to-amber-600', icon: 'ri-home-smile-line', bg: 'bg-orange-50', text: 'text-orange-600' },
    { color: 'from-rose-500 to-pink-600', icon: 'ri-heart-line', bg: 'bg-rose-50', text: 'text-rose-600' },
    { color: 'from-violet-500 to-purple-600', icon: 'ri-star-smile-line', bg: 'bg-violet-50', text: 'text-violet-600' },
  ];

  const categories = categoriesData?.map((c, i) => {
    const style = palette[i % palette.length];
    return {
      ...c,
      image: c.image_url || 'https://via.placeholder.com/600x400?text=Category',
      color: style.color,
      icon: style.icon,
      bg: style.bg,
      text: style.text
    };
  }) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero
        title="Shop by Category"
        subtitle="Explore our wide range of premium products"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {categories.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/shop?category=${category.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 flex flex-col h-full"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white mb-1">{category.name}</h3>
                    <div className="h-1 w-12 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 ${category.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <i className={`${category.icon} text-2xl ${category.text}`}></i>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {category.description || 'Discover our exclusive collection of high-quality products in this category. Handpicked for you.'}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between text-sm font-bold">
                    <span className="text-gsg-black group-hover:text-gsg-purple transition-colors">Explore Collection</span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-gsg-purple group-hover:text-white transition-all">
                      <i className="ri-arrow-right-line"></i>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="ri-layout-grid-line text-4xl text-gray-300"></i>
            </div>
            <h3 className="text-2xl font-bold text-gsg-black mb-2">No Categories Found</h3>
            <p className="text-gray-500">We couldn't find any categories at the moment.</p>
          </div>
        )}
      </div>

      <div className="bg-gsg-purple py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Can't Find What You're Looking For?</h2>
          <p className="text-lg text-purple-100 mb-10 max-w-2xl mx-auto">
            Our team is here to help! Try our advanced search or reach out to us directly for personalized assistance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-white text-gsg-purple px-8 py-4 rounded-full font-bold hover:bg-gray-50 transition-colors shadow-lg"
            >
              <i className="ri-search-line"></i>
              Search All Products
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
            >
              <i className="ri-customer-service-line"></i>
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
