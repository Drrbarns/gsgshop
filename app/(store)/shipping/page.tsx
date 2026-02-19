'use client';

import Link from 'next/link';
import PageHero from '@/components/PageHero';

export default function ShippingPage() {
  const deliveryOptions = [
    { id: 'pickup', type: 'Pickup', time: 'Within 72hrs (excl. Sunday)', cost: 'As quoted', description: 'After confirmation. Pickup location shown at confirmation stage.', icon: 'ri-store-2-line' },
    { id: 'free-delivery', type: 'Free Delivery', time: 'Tue/Fri only', cost: 'FREE (min 5% discount)', description: 'Minimum 5% discount on total as Free Delivery Discount. Orders confirmed before noon of preceding delivery day; after noon delivered next available day.', icon: 'ri-truck-line' },
    { id: 'sole-express', type: 'Sole Express', time: 'Daily', cost: 'As quoted', description: 'Fresh produce/bakery/meat/frozen/seafood/fish/poultry MUST use Express. Delivery within 2hr, 6hr, 12hr, 24hr or 48hr after confirmation.', icon: 'ri-time-line' },
    { id: 'joint-express', type: 'Joint Express', time: 'Daily', cost: 'Shared fee', description: 'Share delivery fee with neighbor/colleague; items remain private. Same perishable rule. 2hr, 6hr, 12hr, 24hr or 48hr after confirmation.', icon: 'ri-group-line' },
  ];

  const zones = [
    {
      zone: 'Zone 1 - Accra Metro',
      areas: 'East Legon, Osu, Labone, Airport, Dzorwulu, Cantonments, Adabraka, Tema',
      standard: '1-2 days',
      express: 'Next day'
    },
    {
      zone: 'Zone 2 - Greater Accra',
      areas: 'Madina, Legon, Haatso, Achimota, Dansoman, Spintex, Teshie, Kasoa',
      standard: '2-3 days',
      express: 'Next day'
    },
    {
      zone: 'Zone 3 - Major Cities',
      areas: 'Kumasi, Takoradi, Cape Coast, Tamale, Sunyani, Ho, Koforidua',
      standard: '3-4 days',
      express: '1-2 days'
    },
    {
      zone: 'Zone 4 - Other Areas',
      areas: 'All other locations within Ghana',
      standard: '4-5 days',
      express: 'Not available'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero 
        title="Shipping & Delivery" 
        subtitle="Pickup, free delivery (Tue/Fri), Sole Express, and Joint Express across Ghana."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gsg-black mb-10 text-center">Delivery Options</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryOptions.map((option) => (
              <div key={option.id} id={option.id} className="scroll-mt-24 bg-white border border-gray-100 p-8 rounded-2xl hover:border-gsg-purple hover:shadow-xl transition-all group">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gsg-purple group-hover:text-white transition-colors text-gsg-purple">
                  <i className={`${option.icon} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold text-gsg-black mb-2">{option.type}</h3>
                <div className="text-gsg-purple font-bold mb-2">{option.cost}</div>
                <div className="text-gray-500 font-medium mb-4 text-sm bg-gray-50 inline-block px-3 py-1 rounded-full">{option.time}</div>
                <p className="text-gray-600 leading-relaxed text-sm">{option.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-10 mb-16 text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-50 rounded-full -ml-24 -mb-24 opacity-50"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-gsg-purple rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-200">
              <i className="ri-gift-line text-4xl text-white"></i>
            </div>
            <h3 className="text-2xl font-bold text-gsg-black mb-3">Free Standard Shipping</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Spend <span className="font-bold text-gsg-black">GHS 300</span> or more and get <span className="font-bold text-gsg-purple">FREE standard delivery</span> anywhere in Ghana
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gsg-black mb-8">Delivery Zones & Timeframes</h2>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gsg-black uppercase tracking-wider">Zone</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gsg-black uppercase tracking-wider">Areas Covered</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gsg-black uppercase tracking-wider">Standard</th>
                    <th className="px-8 py-5 text-left text-sm font-bold text-gsg-black uppercase tracking-wider">Express</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {zones.map((zone, index) => (
                    <tr key={index} className="hover:bg-purple-50/30 transition-colors">
                      <td className="px-8 py-6 font-bold text-gsg-black">{zone.zone}</td>
                      <td className="px-8 py-6 text-gray-600 text-sm leading-relaxed">{zone.areas}</td>
                      <td className="px-8 py-6 text-gsg-black font-medium">{zone.standard}</td>
                      <td className="px-8 py-6 text-gsg-purple font-medium">{zone.express}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold text-gsg-black mb-8">How Shipping Works</h2>
            <div className="space-y-8">
              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-purple-100 rounded-full flex items-center justify-center shadow-sm group-hover:border-gsg-purple transition-colors">
                  <span className="font-bold text-gsg-purple text-lg">1</span>
                </div>
                <div>
                  <h3 className="font-bold text-gsg-black mb-2 text-lg">Order Processing</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Orders placed before 2pm are processed same day. We carefully pack your items and prepare them for dispatch.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-purple-100 rounded-full flex items-center justify-center shadow-sm group-hover:border-gsg-purple transition-colors">
                  <span className="font-bold text-gsg-purple text-lg">2</span>
                </div>
                <div>
                  <h3 className="font-bold text-gsg-black mb-2 text-lg">Dispatch</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Your order is handed to our trusted delivery partner. You'll receive a tracking number via email and SMS.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-purple-100 rounded-full flex items-center justify-center shadow-sm group-hover:border-gsg-purple transition-colors">
                  <span className="font-bold text-gsg-purple text-lg">3</span>
                </div>
                <div>
                  <h3 className="font-bold text-gsg-black mb-2 text-lg">Track Your Order</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Use your tracking number to monitor your delivery in real-time. You'll get updates at each stage.
                  </p>
                </div>
              </div>

              <div className="flex gap-6 group">
                <div className="flex-shrink-0 w-12 h-12 bg-white border-2 border-purple-100 rounded-full flex items-center justify-center shadow-sm group-hover:border-gsg-purple transition-colors">
                  <span className="font-bold text-gsg-purple text-lg">4</span>
                </div>
                <div>
                  <h3 className="font-bold text-gsg-black mb-2 text-lg">Delivery</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our delivery partner will contact you before arrival. Sign for your package and enjoy your purchase!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gsg-black mb-8">Important Information</h2>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-8">
              <div>
                <h3 className="font-bold text-gsg-black mb-2 flex items-center gap-3">
                  <i className="ri-time-line text-gsg-purple text-xl"></i>
                  Cut-off Times
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm pl-8">
                  Orders placed before 2pm are dispatched same day. Orders after 2pm are dispatched next business day.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gsg-black mb-2 flex items-center gap-3">
                  <i className="ri-calendar-line text-gsg-purple text-xl"></i>
                  Business Days
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm pl-8">
                  Delivery timeframes exclude weekends and public holidays. We process orders Monday to Friday.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gsg-black mb-2 flex items-center gap-3">
                  <i className="ri-phone-line text-gsg-purple text-xl"></i>
                  Delivery Contact
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm pl-8">
                  Our delivery partner will call you before arrival. Please ensure your phone number is correct and reachable.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gsg-black mb-2 flex items-center gap-3">
                  <i className="ri-home-line text-gsg-purple text-xl"></i>
                  Failed Deliveries
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm pl-8">
                  If you're unavailable, we'll attempt delivery twice. After that, the package is held at a collection point for 5 days.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-gsg-black mb-2 flex items-center gap-3">
                  <i className="ri-secure-payment-line text-gsg-purple text-xl"></i>
                  Package Security
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm pl-8">
                  All packages are insured during transit. Report any damage or missing items within 48 hours of delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-10 mb-16 shadow-sm">
          <h2 className="text-3xl font-bold text-gsg-black mb-6">Order Tracking</h2>
          <p className="text-gray-600 mb-10 leading-relaxed max-w-3xl">
            Track your order anytime using your order number and email address. You'll see real-time updates including:
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gsg-purple group-hover:text-white transition-colors text-gsg-purple">
                <i className="ri-checkbox-circle-line text-3xl"></i>
              </div>
              <p className="font-bold text-gsg-black">Order Confirmed</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gsg-purple group-hover:text-white transition-colors text-gsg-purple">
                <i className="ri-package-line text-3xl"></i>
              </div>
              <p className="font-bold text-gsg-black">Processing</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gsg-purple group-hover:text-white transition-colors text-gsg-purple">
                <i className="ri-truck-line text-3xl"></i>
              </div>
              <p className="font-bold text-gsg-black">Out for Delivery</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gsg-purple group-hover:text-white transition-colors text-gsg-purple">
                <i className="ri-gift-line text-3xl"></i>
              </div>
              <p className="font-bold text-gsg-black">Delivered</p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/order-tracking"
              className="inline-flex items-center gap-2 bg-gsg-purple text-white px-8 py-4 rounded-xl font-bold hover:bg-gsg-purple-dark transition-colors shadow-lg shadow-purple-200"
            >
              <i className="ri-map-pin-line"></i>
              Track Your Order
            </Link>
          </div>
        </div>

        <div className="bg-gsg-black rounded-2xl p-12 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Need Help with Your Delivery?</h2>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto text-lg">
              Questions about shipping costs, delivery times, or tracking? Our customer service team is here to help.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-gsg-black px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                href="/faqs"
                className="inline-flex items-center gap-2 bg-white/10 text-white px-8 py-4 rounded-xl font-bold hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                View FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
