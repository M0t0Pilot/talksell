import React, { useState } from 'react';
import { ShoppingBag, User as UserIcon, Shield, Search, Menu, X, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    cartItemCount,
    setIsCartOpen,
    currentUser,
    setIsAuthModalOpen,
    isAdmin,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'home' | 'shop' | 'blog_list' | 'admin' | 'account') => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBFBF9]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-stone-900 hover:opacity-80 transition-opacity text-left cursor-pointer"
          >
            Atelier
          </button>

          {/* Zone 2: 4-6 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-stone-900 transition-colors cursor-pointer py-1 ${
                currentView === 'home' ? 'text-stone-950 font-semibold border-b-2 border-stone-900' : ''
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`hover:text-stone-900 transition-colors cursor-pointer py-1 ${
                currentView === 'shop' || currentView === 'product_detail'
                  ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                  : ''
              }`}
            >
              Shop Catalog
            </button>
            <button
              onClick={() => handleNavClick('blog_list')}
              className={`hover:text-stone-900 transition-colors cursor-pointer py-1 ${
                currentView === 'blog_list' || currentView === 'blog_reader'
                  ? 'text-stone-950 font-semibold border-b-2 border-stone-900'
                  : ''
              }`}
            >
              Journal & Essays
            </button>
            {isAdmin && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center gap-1.5 hover:text-stone-900 transition-colors cursor-pointer py-1 text-amber-900 ${
                  currentView === 'admin' ? 'font-semibold border-b-2 border-amber-900' : ''
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                CMS Dashboard
              </button>
            )}
          </nav>

          {/* Zone 3: 1-2 primary actions */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick Admin Toggle / Account Button */}
            {currentUser ? (
              <button
                onClick={() => handleNavClick(isAdmin ? 'admin' : 'account')}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-xs font-medium text-stone-800 transition-colors"
                title={`Signed in as ${currentUser.name}`}
              >
                <div className="w-6 h-6 rounded-full overflow-hidden bg-stone-300">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                </div>
                <span className="hidden sm:inline-block max-w-[100px] truncate">
                  {currentUser.name}
                </span>
                {isAdmin && (
                  <span className="hidden sm:inline-block text-[10px] font-mono text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                    Admin
                  </span>
                )}
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline-block text-xs font-medium">Bag</span>
              {cartItemCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 font-mono text-[11px] font-bold flex items-center justify-center -mr-1">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-[#FBFBF9] px-4 pt-2 pb-6 space-y-3">
          <button
            onClick={() => handleNavClick('home')}
            className="block w-full text-left py-2 text-sm font-medium text-stone-800 hover:text-stone-950"
          >
            Overview
          </button>
          <button
            onClick={() => handleNavClick('shop')}
            className="block w-full text-left py-2 text-sm font-medium text-stone-800 hover:text-stone-950"
          >
            Shop Catalog
          </button>
          <button
            onClick={() => handleNavClick('blog_list')}
            className="block w-full text-left py-2 text-sm font-medium text-stone-800 hover:text-stone-950"
          >
            Journal & Essays
          </button>
          <button
            onClick={() => handleNavClick('admin')}
            className="flex items-center gap-2 w-full text-left py-2 text-sm font-medium text-amber-900 hover:text-amber-950"
          >
            <Shield className="w-4 h-4" />
            Admin CMS Dashboard
          </button>
          <button
            onClick={() => handleNavClick('account')}
            className="block w-full text-left py-2 text-sm font-medium text-stone-800 hover:text-stone-950"
          >
            My Account & Orders
          </button>
        </div>
      )}
    </header>
  );
};
