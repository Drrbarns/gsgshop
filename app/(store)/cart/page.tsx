'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import CartCountdown from '@/components/CartCountdown';
import AdvancedCouponSystem from '@/components/AdvancedCouponSystem';
import { useCart } from '@/context/CartContext';
import PageHero from '@/components/PageHero';
import { usePageTitle } from '@/hooks/usePageTitle';

export default function CartPage() {
  usePageTitle('Shopping Cart');
  const { cart: cartItems, removeFromCart, updateQuantity, subtotal, addToCart } = useCart();
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [savedItems, setSavedItems] = useState<any[]>([]);

  // Function to move item to saved for later (local state only for now)
  const saveForLater = (id: string) => {
    const item = cartItems.find(item => item.id === id);
    if (item) {
      setSavedItems([...savedItems, item]);
      removeFromCart(item.id, item.variant); // Use context's removeFromCart
    }
  };

  const moveToCart = (id: string) => {
    const item = savedItems.find(item => item.id === id);
    if (item) {
      // addToCart expects a CartItem object which already includes quantity
      addToCart(item);
      setSavedItems(savedItems.filter(item => item.id !== id));
    }
  };

  const applyCoupon = (coupon: any) => {
    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  // Savings calculation is tricky without originalPrice in Context.
  // Assuming 0 for now unless we update Context.
  const savings = 0;

  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      couponDiscount = subtotal * (appliedCoupon.discount / 100);
    } else {
      couponDiscount = appliedCoupon.discount;
    }
  }

  const shipping = subtotal >= 200 ? 0 : 15;
  const total = subtotal - couponDiscount + shipping;

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHero title="Shopping Cart" subtitle="Review your items and proceed to checkout" />
      <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <CartCountdown />
        {/* <FreeShippingBar currentAmount={subtotal} threshold={200} /> */}

        {cartItems.length === 0 && savedItems.length === 0 ? (
          <section className="py-20">
            <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
              <div className="w-24 h-24 flex items-center justify-center mx-auto mb-6 bg-purple-50 rounded-full">
                <i className="ri-shopping-cart-2-line text-5xl text-gsg-purple"></i>
              </div>
              <h2 className="text-3xl font-bold text-gsg-black mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-8 text-lg">Looks like you haven't added anything to your cart yet. Explore our products to find something you love.</p>
              <Link href="/shop" className="inline-flex items-center gap-2 bg-gsg-purple hover:bg-gsg-purple-dark text-white px-8 py-4 rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                <span>Start Shopping</span>
                <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          </section>
        ) : (
          <section className="py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gsg-black flex items-center gap-2">
                      <i className="ri-shopping-bag-3-line text-gsg-purple"></i>
                      Cart Items ({cartItems.length})
                    </h2>
                    {savings > 0 && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                        You save GH₵{savings.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-8">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.variant || ''}`} className="flex flex-col sm:flex-row gap-6 pb-8 border-b border-gray-100 last:border-0 last:pb-0">
                        <Link href={`/product/${item.slug || item.id}`} className="relative w-full sm:w-32 h-32 flex-shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 128px" quality={80} />
                        </Link>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <Link href={`/product/${item.slug || item.id}`} className="text-lg font-bold text-gsg-black hover:text-gsg-purple transition-colors line-clamp-2">
                                {item.name}
                              </Link>
                              <button
                                onClick={() => removeFromCart(item.id, item.variant)}
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                aria-label="Remove item"
                              >
                                <i className="ri-delete-bin-line text-xl"></i>
                              </button>
                            </div>

                            <div className="text-sm text-gray-500 mb-4 space-y-1">
                              {item.variant && <p className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-gray-300"></span> Variant: {item.variant}</p>}
                              <p className="text-green-600 font-medium flex items-center gap-1"><i className="ri-check-line"></i> In Stock</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1, item.variant)}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-white hover:text-gsg-purple rounded-l-lg transition-colors"
                                disabled={item.quantity <= (item.moq || 1)}
                              >
                                <i className="ri-subtract-line"></i>
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || (item.moq || 1), item.variant)}
                                className="w-12 h-10 text-center bg-transparent border-x border-gray-200 focus:outline-none font-bold text-gsg-black text-sm"
                                min={item.moq || 1}
                                max={item.maxStock}
                              />
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1, item.variant)}
                                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-white hover:text-gsg-purple rounded-r-lg transition-colors"
                              >
                                <i className="ri-add-line"></i>
                              </button>
                            </div>

                            <span className="text-xl font-bold text-gsg-black">GH₵{item.price.toFixed(2)}</span>
                          </div>
                          
                          {(item.moq || 1) > 1 && (
                            <p className="text-xs text-orange-500 mt-2 font-medium">
                              Minimum order: {item.moq} units
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {savedItems.length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gsg-black mb-6">Saved for Later ({savedItems.length})</h3>
                    <div className="space-y-6">
                      {savedItems.map((item) => (
                        <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                          <div className="relative w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" quality={60} />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-gsg-black mb-1 line-clamp-1">{item.name}</p>
                            <p className="text-gsg-purple font-bold mb-3">GH₵{item.price.toFixed(2)}</p>
                            <button 
                              onClick={() => moveToCart(item.id)}
                              className="text-sm font-bold text-gsg-purple hover:text-gsg-purple-dark hover:underline"
                            >
                              Move to Cart
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                  <h3 className="text-xl font-bold text-gsg-black mb-6">Order Summary</h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-bold text-gsg-black">GH₵{subtotal.toFixed(2)}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-green-600 bg-green-50 p-2 rounded-lg">
                        <div className="flex items-center gap-2">
                          <i className="ri-coupon-3-fill"></i>
                          <span>Coupon ({appliedCoupon.code})</span>
                        </div>
                        <span className="font-bold">-GH₵{couponDiscount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-gray-600">
                      <span>Shipping Estimate</span>
                      <span className="font-bold text-gsg-black">{shipping === 0 ? 'FREE' : `GH₵${shipping.toFixed(2)}`}</span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between items-end">
                      <span className="text-gray-900 font-bold">Total</span>
                      <span className="text-2xl font-extrabold text-gsg-purple">GH₵{total.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-right">Including taxes</p>
                  </div>

                  <AdvancedCouponSystem
                    subtotal={subtotal}
                    onApply={applyCoupon}
                    onRemove={removeCoupon}
                    appliedCoupon={appliedCoupon}
                  />

                  <Link
                    href="/checkout"
                    className="block w-full bg-gsg-black hover:bg-gsg-purple text-white py-4 rounded-xl font-bold text-center transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 mt-6 mb-3"
                  >
                    Proceed to Checkout
                  </Link>

                  <Link
                    href="/shop"
                    className="block w-full text-center text-gray-500 hover:text-gsg-purple font-semibold py-2 transition-colors"
                  >
                    Continue Shopping
                  </Link>

                  <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                        <i className="ri-shield-check-line"></i>
                      </div>
                      <span className="text-[10px] font-medium text-gray-500">Secure</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                        <i className="ri-truck-line"></i>
                      </div>
                      <span className="text-[10px] font-medium text-gray-500">Fast</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-600">
                        <i className="ri-customer-service-2-line"></i>
                      </div>
                      <span className="text-[10px] font-medium text-gray-500">Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
