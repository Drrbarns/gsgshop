'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PageHero from '@/components/PageHero';

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const urlOrderNumber = searchParams.get('order') || '';
  
  const [orderNumber, setOrderNumber] = useState(urlOrderNumber);
  const [email, setEmail] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-track if order number AND email are in the URL
  const urlEmail = searchParams.get('email') || '';
  
  useEffect(() => {
    if (urlOrderNumber && urlEmail) {
      setEmail(urlEmail);
      fetchOrder(urlOrderNumber, urlEmail);
    }
  }, [urlOrderNumber, urlEmail]);

  const fetchOrder = async (orderNum: string, verifyEmail?: string) => {
    const emailToVerify = verifyEmail || email;
    
    if (!emailToVerify) {
      setError('Please enter your email address to verify your identity.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          payment_status,
          total,
          email,
          created_at,
          shipping_address,
          metadata,
          order_items (
            id,
            product_name,
            variant_name,
            quantity,
            unit_price,
            metadata,
            products (
              product_images (url)
            )
          )
        `)
        .eq('order_number', orderNum)
        .single();

      if (fetchError || !data) {
        setError('Order not found. Please check your order number and try again.');
        setIsTracking(false);
        return;
      }

      if (data.email?.toLowerCase() !== emailToVerify.toLowerCase()) {
        setError('The email address does not match this order. Please use the email you placed the order with.');
        setIsTracking(false);
        return;
      }

      setOrder(data);
      setIsTracking(true);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!orderNumber) {
      setError('Please enter your order number');
      return;
    }

    if (!email) {
      setError('Please enter your email address for verification');
      return;
    }

    fetchOrder(orderNumber, email);
  };

  const getTrackingSteps = () => {
    if (!order) return [];

    const status = order.status || 'pending';
    const paymentStatus = order.payment_status || 'pending';

    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(status);

    const steps = [
      {
        key: 'placed',
        title: 'Order Placed',
        description: 'Your order has been confirmed',
        date: new Date(order.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        icon: 'ri-file-list-3-line',
        status: 'completed' as const
      },
      {
        key: 'payment',
        title: 'Payment',
        description: paymentStatus === 'paid' ? 'Payment confirmed' : 'Awaiting payment',
        date: paymentStatus === 'paid' 
          ? (order.metadata?.payment_verified_at 
            ? new Date(order.metadata.payment_verified_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
            : 'Confirmed')
          : 'Pending',
        icon: 'ri-secure-payment-line',
        status: paymentStatus === 'paid' ? 'completed' as const : 'pending' as const
      },
      {
        key: 'processing',
        title: 'Processing',
        description: 'Your order is being prepared',
        date: currentIndex >= 1 ? 'In progress' : 'Pending',
        icon: 'ri-box-3-line',
        status: currentIndex >= 1 ? 'completed' as const : currentIndex === 0 && paymentStatus === 'paid' ? 'active' as const : 'pending' as const
      },
      {
        key: 'shipped',
        title: 'On the Way',
        description: 'Your order is out for delivery',
        date: currentIndex >= 2 ? 'In transit' : 'Pending',
        icon: 'ri-truck-line',
        status: currentIndex >= 2 ? 'completed' as const : currentIndex === 1 ? 'active' as const : 'pending' as const
      },
      {
        key: 'delivered',
        title: 'Delivered',
        description: 'Package delivered successfully',
        date: currentIndex >= 3 ? 'Delivered' : 'Pending',
        icon: 'ri-check-double-line',
        status: currentIndex >= 3 ? 'completed' as const : currentIndex === 2 ? 'active' as const : 'pending' as const
      }
    ];

    return steps;
  };

  const getStatusBadge = () => {
    if (!order) return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    
    const statusMap: Record<string, { label: string; color: string }> = {
      'pending': { label: 'Pending', color: 'bg-amber-100 text-amber-800' },
      'processing': { label: 'Processing', color: 'bg-blue-100 text-blue-800' },
      'shipped': { label: 'On the Way', color: 'bg-purple-100 text-purple-800' },
      'delivered': { label: 'Delivered', color: 'bg-green-100 text-green-800' },
      'cancelled': { label: 'Cancelled', color: 'bg-red-100 text-red-800' }
    };

    return statusMap[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' };
  };

  if (!isTracking || !order) {
    return (
      <main className="min-h-screen bg-gray-50">
        <PageHero title="Track Your Order" subtitle="Enter your order details to see real-time updates" />
        <div className="py-12 px-4">
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <form onSubmit={handleTrack} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gsg-black mb-2">
                    Order Number
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gsg-purple focus:border-gsg-purple transition-all outline-none border-gray-200 bg-gray-50 focus:bg-white"
                    placeholder="e.g. ORD-123456789"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gsg-black mb-2">
                    Email Address <span className="text-red-500 font-normal">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-gsg-purple focus:border-gsg-purple transition-all outline-none border-gray-200 bg-gray-50 focus:bg-white"
                    placeholder="you@example.com"
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                    <i className="ri-error-warning-fill text-red-500 mt-0.5"></i>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gsg-black hover:bg-gsg-purple text-white py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap cursor-pointer"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <i className="ri-loader-4-line animate-spin"></i>
                      Searching...
                    </span>
                  ) : 'Track Order'}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-start space-x-3 text-sm text-gray-500">
                  <i className="ri-information-fill text-gsg-purple text-lg mt-0.5"></i>
                  <p>
                    You can find your order number in the confirmation email or SMS we sent you.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const trackingSteps = getTrackingSteps();
  const statusBadge = getStatusBadge();
  const trackingNumber = order.metadata?.tracking_number || '';
  const shippingAddress = order.shipping_address || {};
  const estimatedDelivery = new Date(new Date(order.created_at).getTime() + 7 * 24 * 60 * 60 * 1000)
    .toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <main className="min-h-screen bg-gray-50">
      <PageHero title="Order Status" subtitle={`Order #${order.order_number}`} />
      
      <div className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <button 
              onClick={() => { setIsTracking(false); setOrder(null); setOrderNumber(''); setEmail(''); }}
              className="text-gray-500 hover:text-gsg-purple font-medium inline-flex items-center gap-2 transition-colors"
            >
              <i className="ri-arrow-left-line"></i>
              Track Another Order
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gsg-black mb-1">Order {order.order_number}</h1>
                  <p className="text-gray-500 text-sm">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className={`px-4 py-2 rounded-full font-bold text-sm ${statusBadge.color}`}>
                  {statusBadge.label}
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-gsg-purple">
                      <i className="ri-map-pin-line"></i>
                    </div>
                    <span className="text-sm font-bold text-gray-900">Shipping To</span>
                  </div>
                  <p className="text-gray-600 text-sm pl-11">
                    {shippingAddress.city || shippingAddress.region || 'Ghana'}
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-gsg-purple">
                      <i className="ri-money-cny-circle-line"></i>
                    </div>
                    <span className="text-sm font-bold text-gray-900">Total Amount</span>
                  </div>
                  <p className="text-gray-600 text-sm pl-11 font-medium">
                    GH₵ {Number(order.total).toFixed(2)}
                  </p>
                </div>

                <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-gsg-purple">
                      <i className="ri-time-line"></i>
                    </div>
                    <span className="text-sm font-bold text-gray-900">Est. Delivery</span>
                  </div>
                  <p className="text-gray-600 text-sm pl-11">
                    {estimatedDelivery}
                  </p>
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="relative pl-4 sm:pl-8">
                {trackingSteps.map((step, index) => (
                  <div key={step.key} className="flex items-start mb-8 last:mb-0 relative">
                    {/* Vertical Line */}
                    {index < trackingSteps.length - 1 && (
                      <div className={`absolute left-[19px] top-10 bottom-0 w-0.5 ${
                        step.status === 'completed' ? 'bg-gsg-purple' : 'bg-gray-200'
                      }`}></div>
                    )}
                    
                    <div className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-full border-4 mr-6 flex-shrink-0 transition-colors ${
                      step.status === 'completed'
                        ? 'bg-gsg-purple border-purple-100 text-white'
                        : step.status === 'active'
                        ? 'bg-white border-gsg-purple text-gsg-purple'
                        : 'bg-gray-100 border-gray-50 text-gray-400'
                    }`}>
                      <i className={`${step.icon} text-lg`}></i>
                    </div>
                    
                    <div className="flex-1 pt-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                        <h3 className={`font-bold text-lg ${
                          step.status === 'pending' ? 'text-gray-400' : 'text-gsg-black'
                        }`}>
                          {step.title}
                        </h3>
                        <span className={`text-xs font-bold px-2 py-1 rounded-md inline-block sm:inline ${
                          step.status === 'pending' ? 'bg-gray-100 text-gray-400' : 'bg-purple-50 text-gsg-purple'
                        }`}>
                          {step.date}
                        </span>
                      </div>
                      <p className={`text-sm mt-1 ${
                        step.status === 'pending' ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-gsg-black mb-6">Items in Order</h2>
            <div className="space-y-4">
              {order.order_items?.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 relative">
                    {item.products?.product_images?.[0]?.url || item.metadata?.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.products?.product_images?.[0]?.url || item.metadata?.image}
                        alt={item.product_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className="ri-image-line text-2xl text-gray-300"></i>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gsg-black truncate">{item.product_name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Qty: {item.quantity} {item.variant_name && `• ${item.variant_name}`}</p>
                  </div>
                  <p className="font-bold text-gsg-purple whitespace-nowrap">GH₵ {Number(item.unit_price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-gray-500 mb-4">Need help with your order?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gsg-black font-bold hover:border-gsg-purple hover:text-gsg-purple transition-colors shadow-sm">
                <i className="ri-customer-service-line"></i>
                Contact Support
              </Link>
              <Link href="/returns" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gsg-black font-bold hover:border-gsg-purple hover:text-gsg-purple transition-colors shadow-sm">
                <i className="ri-arrow-left-right-line"></i>
                Returns Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <i className="ri-loader-4-line animate-spin text-4xl text-gsg-purple"></i>
      </div>
    }>
      <OrderTrackingContent />
    </Suspense>
  );
}
