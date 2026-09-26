import React from 'react';
import { User, Package, MapPin, CreditCard, LogOut, ShoppingBag, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AccountView: React.FC = () => {
  const { currentUser, orders, logout, setCurrentView, setIsAuthModalOpen } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-stone-900">Sign In to View Your Account</h2>
        <p className="text-xs text-stone-600">Access your order history, tracking receipts, and shipping information.</p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  // Filter orders for current user or all if admin
  const userOrders = orders.filter(
    (o) => o.customer.email.toLowerCase() === currentUser.email.toLowerCase()
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      {/* Profile Header */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-stone-200 border-2 border-stone-100">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900">{currentUser.name}</h1>
            <p className="text-xs text-stone-500 font-mono">{currentUser.email}</p>
            <span className="inline-block mt-1 text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700 font-semibold">
              Member since {new Date(currentUser.createdAt).getFullYear()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              logout();
            }}
            className="px-4 py-2 text-xs font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-stone-700" />
            <span>Order History & Receipts ({userOrders.length})</span>
          </h2>
          <button
            onClick={() => setCurrentView('shop')}
            className="text-xs font-semibold text-stone-900 hover:underline flex items-center gap-1"
          >
            <span>Shop Store</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {userOrders.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-stone-200 text-center space-y-3">
            <p className="text-sm font-medium text-stone-700">No past orders found for this account.</p>
            <p className="text-xs text-stone-500">Explore our curated artisanal catalog and place your first order.</p>
            <button
              onClick={() => setCurrentView('shop')}
              className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {userOrders.map((ord) => (
              <div key={ord.id} className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100 text-xs">
                  <div>
                    <span className="font-mono font-bold text-stone-900 text-sm">#{ord.orderNumber}</span>
                    <span className="text-stone-400 mx-2">·</span>
                    <span className="text-stone-500">{new Date(ord.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                      ord.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                      ord.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                      ord.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {ord.status}
                    </span>
                    <span className="font-mono font-bold text-stone-900 text-sm tabular-nums">
                      ${ord.total.toFixed(2)} USD
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-2">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-stone-700">
                      <span>{item.quantity} × {item.product.title}</span>
                      <span className="font-mono tabular-nums">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-mono">Stripe ID: {ord.stripePaymentIntentId} ({ord.cardBrand} •••• {ord.cardLast4})</span>
                  <span>Ship To: {ord.customer.city}, {ord.customer.country}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
