import React, { useState } from 'react';
import {
  X,
  Lock,
  CreditCard,
  ShieldCheck,
  CheckCircle,
  Printer,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { OrderCustomer } from '../types';

export const StripeCheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    setIsCheckoutOpen,
    cart,
    cartTotal,
    promoDiscount,
    appliedPromo,
    createOrder,
    currentUser,
    setCurrentView,
  } = useApp();

  // Form State
  const [name, setName] = useState(currentUser?.name || 'Clara Henderson');
  const [email, setEmail] = useState(currentUser?.email || 'clara.h@example.com');
  const [address, setAddress] = useState('1480 NW 12th Ave, Suite 300');
  const [city, setCity] = useState('Portland');
  const [state, setState] = useState('OR');
  const [postalCode, setPostalCode] = useState('97209');
  const [country, setCountry] = useState('United States');
  const [phone, setPhone] = useState('+1 (503) 555-4421');

  // Stripe Card Details
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('424');
  const [cardBrand, setCardBrand] = useState<'visa' | 'mastercard' | 'amex'>('visa');

  // Checkout Status: 'form' | 'processing' | 'success' | 'error'
  const [status, setStatus] = useState<'form' | 'processing' | 'success' | 'error'>('form');
  const [errorMessage, setErrorMessage] = useState('');
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  if (!isCheckoutOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const discountAmount = (subtotal * promoDiscount) / 100;
  const shipping = subtotal >= 75 ? 0 : 8.50;
  const tax = (subtotal - discountAmount) * 0.08;
  const finalTotal = Math.max(0, subtotal - discountAmount + shipping + tax);

  // Test card autofill helper
  const handlePrefillTestCard = (type: 'success' | '3ds' | 'decline') => {
    if (type === 'success') {
      setCardNumber('4242 4242 4242 4242');
      setCardExpiry('08/29');
      setCardCvc('424');
      setCardBrand('visa');
    } else if (type === '3ds') {
      setCardNumber('4000 0000 0000 0119');
      setCardExpiry('11/27');
      setCardCvc('319');
      setCardBrand('visa');
    } else {
      setCardNumber('4000 0000 0000 0002');
      setCardExpiry('05/26');
      setCardCvc('002');
      setCardBrand('visa');
    }
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (cardNumber.includes('0002')) {
      setStatus('processing');
      setTimeout(() => {
        setStatus('error');
        setErrorMessage('Your card was declined. Please try another test card.');
      }, 1500);
      return;
    }

    setStatus('processing');

    setTimeout(() => {
      // Simulate Stripe 3D Secure / Success flow
      const customerData: OrderCustomer = {
        name,
        email,
        address,
        city,
        state,
        postalCode,
        country,
        phone,
      };

      const paymentIntentId = `pi_3Mtw${Math.random().toString(36).substring(2, 10)}`;

      const newOrder = createOrder({
        customer: customerData,
        items: cart,
        subtotal,
        tax,
        shipping,
        discount: discountAmount,
        total: finalTotal,
        status: 'paid',
        stripePaymentIntentId: paymentIntentId,
        cardBrand: cardBrand,
        cardLast4: cardNumber.replace(/\s+/g, '').slice(-4) || '4242',
        receiptUrl: `https://stripe.com/receipt/sim_${paymentIntentId}`,
      });

      setCompletedOrder(newOrder);
      setStatus('success');

      // Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D97706', '#78716C', '#1C1917', '#F59E0B'],
      });
    }, 1800);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleClose = () => {
    setIsCheckoutOpen(false);
    setStatus('form');
    setCompletedOrder(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#FBFBF9]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-white flex items-center justify-center font-serif font-bold text-sm">
              A
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-stone-900">Atelier Checkout</span>
                <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  <Lock className="w-3 h-3" /> Stripe Secure 256-bit
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {status === 'success' && completedOrder ? (
            /* Success Receipt View */
            <div id="printable-receipt" className="space-y-6 text-stone-800">
              <div className="text-center space-y-2 pb-6 border-b border-stone-200">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-stone-900">
                  Payment Received & Confirmed
                </h3>
                <p className="text-xs text-stone-500">
                  Order <span className="font-mono font-bold text-stone-800">#{completedOrder.orderNumber}</span> · A confirmation receipt has been dispatched to {completedOrder.customer.email}.
                </p>
              </div>

              {/* Receipt Details */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Stripe Payment ID</span>
                  <span className="font-mono text-stone-800">{completedOrder.stripePaymentIntentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Card Billed</span>
                  <span className="font-mono text-stone-800 uppercase">{completedOrder.cardBrand} ending in •••• {completedOrder.cardLast4}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Ship To</span>
                  <span className="text-stone-800 text-right">
                    {completedOrder.customer.name}<br />
                    {completedOrder.customer.address}, {completedOrder.customer.city}
                  </span>
                </div>
              </div>

              {/* Itemized list */}
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-2">
                  Items Ordered
                </h4>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg overflow-hidden bg-white">
                  {completedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-medium text-stone-900">{item.product.title}</p>
                        <p className="text-stone-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-mono tabular-nums font-semibold text-stone-800">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-1.5 pt-2 border-t border-stone-200 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums">${completedOrder.subtotal.toFixed(2)}</span>
                </div>
                {completedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">-${completedOrder.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stone-600">
                  <span>Shipping</span>
                  <span className="font-mono tabular-nums">
                    {completedOrder.shipping === 0 ? 'FREE' : `$${completedOrder.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Estimated Tax</span>
                  <span className="font-mono tabular-nums">${completedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Paid</span>
                  <span className="font-mono tabular-nums text-base">${completedOrder.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="flex-1 px-4 py-2.5 text-xs font-medium border border-stone-300 rounded-lg text-stone-700 hover:bg-stone-50 flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  Print / Save Invoice
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    setCurrentView('shop');
                  }}
                  className="flex-1 px-4 py-2.5 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleProcessPayment} className="space-y-6">
              {/* Order quick summary */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-500">{cart.length} distinct item(s) in order</p>
                  <p className="text-sm font-semibold text-stone-900 font-mono tabular-nums">
                    Total Due: ${finalTotal.toFixed(2)} USD
                  </p>
                </div>
                {appliedPromo && (
                  <span className="text-xs font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    Code: {appliedPromo} (-{promoDiscount}%)
                  </span>
                )}
              </div>

              {/* Quick Apple/Google Pay Button Simulation */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    handlePrefillTestCard('success');
                    // quick submit simulation
                  }}
                  className="w-full py-3 bg-black hover:bg-stone-800 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <span>Pay with</span>
                  <span className="font-semibold tracking-tight">Pay</span>
                  <span className="text-xs text-stone-400">/ Google Pay</span>
                </button>
                <div className="flex items-center gap-2 text-stone-400 text-xs my-3">
                  <div className="flex-1 h-px bg-stone-200" />
                  <span>Or pay with card</span>
                  <div className="flex-1 h-px bg-stone-200" />
                </div>
              </div>

              {/* Customer Contact */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                  1. Contact & Shipping Address
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-600 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">State / Prov</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      required
                      className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-600 mb-1">ZIP / Postal</label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Card Section (Stripe Elements UI) */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-semibold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-stone-700" />
                    2. Stripe Payment Details
                  </h4>
                  {/* Test card presets */}
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-stone-400">Test Fill:</span>
                    <button
                      type="button"
                      onClick={() => handlePrefillTestCard('success')}
                      className="text-amber-800 hover:text-amber-950 font-medium underline"
                    >
                      Success
                    </button>
                    <span className="text-stone-300">·</span>
                    <button
                      type="button"
                      onClick={() => handlePrefillTestCard('3ds')}
                      className="text-amber-800 hover:text-amber-950 font-medium underline"
                    >
                      3D Secure
                    </button>
                  </div>
                </div>

                {/* Stripe Elements Input Container */}
                <div className="border border-stone-300 rounded-xl overflow-hidden bg-white shadow-2xs focus-within:ring-2 focus-within:ring-stone-500">
                  <div className="p-3 border-b border-stone-200 flex items-center justify-between">
                    <div className="flex-1">
                      <label className="block text-[10px] uppercase tracking-wider text-stone-400">
                        Card Number
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4242 4242 4242 4242"
                        className="w-full text-sm font-mono text-stone-900 focus:outline-none bg-transparent"
                        required
                      />
                    </div>
                    <div className="flex items-center gap-1 text-stone-400">
                      <span className="text-xs font-mono font-bold text-stone-700">VISA</span>
                      <span className="text-xs font-mono font-bold text-stone-400">MC</span>
                      <span className="text-xs font-mono font-bold text-stone-400">AMEX</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 divide-x divide-stone-200">
                    <div className="p-3">
                      <label className="block text-[10px] uppercase tracking-wider text-stone-400">
                        Expiration
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM / YY"
                        className="w-full text-sm font-mono text-stone-900 focus:outline-none bg-transparent"
                        required
                      />
                    </div>
                    <div className="p-3">
                      <label className="block text-[10px] uppercase tracking-wider text-stone-400">
                        CVC / CVV
                      </label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        maxLength={4}
                        className="w-full text-sm font-mono text-stone-900 focus:outline-none bg-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Error Box */}
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={status === 'processing'}
                className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-400 text-white rounded-xl text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {status === 'processing' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authorizing with Stripe...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pay ${finalTotal.toFixed(2)} USD</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  PCI-DSS Level 1 Certified
                </span>
                <span>·</span>
                <span>Encrypted Transport</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
