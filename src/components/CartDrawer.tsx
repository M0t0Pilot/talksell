import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArtworkVisual } from './ArtworkVisual';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    cartTotal,
    appliedPromo,
    promoDiscount,
    applyPromoCode,
    setIsCheckoutOpen,
    setCurrentView,
  } = useApp();

  const [promoInput, setPromoInput] = useState('');

  if (!isCartOpen) return null;

  const rawSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (rawSubtotal * promoDiscount) / 100;
  const freeShippingThreshold = 75;
  const progressToFreeShipping = Math.min(100, (rawSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - rawSubtotal);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const success = applyPromoCode(promoInput);
    if (success) setPromoInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-2xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-6 border-b border-stone-200 flex items-center justify-between bg-[#FBFBF9]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-stone-900" />
              <h2 className="text-lg font-serif font-semibold text-stone-900">
                Your Shopping Bag
              </h2>
              <span className="text-xs font-mono bg-stone-200/80 px-2 py-0.5 rounded text-stone-700">
                {cart.reduce((n, i) => n + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="px-6 py-3 bg-stone-50 border-b border-stone-200 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-stone-600 mb-1.5">
                Add <span className="font-mono font-semibold text-stone-900">${remainingForFreeShipping.toFixed(2)}</span> more to unlock <strong className="text-stone-900">Complimentary Shipping</strong>
              </p>
            ) : (
              <p className="text-emerald-800 font-medium mb-1.5 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Unlocked complimentary priority shipping!
              </p>
            )}
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-700 transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-500 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-semibold text-stone-800">
                    Your bag is empty
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs">
                    Explore our curated collection of artisanal stoneware, handbound leather, and studio textiles.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setCurrentView('shop');
                  }}
                  className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-3 rounded-xl border border-stone-200/80 bg-[#FAFAF8]"
                >
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 border border-stone-200 bg-white">
                    <ArtworkVisual
                      src={item.product.images[0]}
                      alt={item.product.title}
                      category={item.product.category}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-semibold text-stone-900 truncate pr-2">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-stone-500 font-mono tabular-nums mt-0.5">
                        ${item.product.price.toFixed(2)} each
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-200/60">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-300 rounded-md bg-white">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                          title="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-medium text-stone-800 tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                          title="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-mono font-semibold text-stone-900 tabular-nums">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 bg-[#FBFBF9] space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-3" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Discount code (try ATELIER15)"
                    className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3 py-2 text-xs font-medium border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors text-stone-700"
                >
                  Apply
                </button>
              </form>

              {appliedPromo && (
                <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <span>Coupon {appliedPromo} applied</span>
                  <span className="font-mono font-semibold">-{promoDiscount}%</span>
                </div>
              )}

              {/* Subtotal breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">${rawSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono">
                    {rawSubtotal >= freeShippingThreshold ? 'FREE' : '$8.50'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Estimated Total</span>
                  <span className="font-mono tabular-nums text-base">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs sm:text-sm font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Checkout with Stripe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
