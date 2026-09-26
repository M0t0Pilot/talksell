import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentView, isAdmin, setIsAuthModalOpen } = useApp();

  const handleNav = (view: any) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-stone-200 bg-[#F5F4EE] text-stone-700 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-stone-200">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <span className="text-xl font-serif font-bold text-stone-900 block">
              Atelier
            </span>
            <p className="text-stone-500 text-xs leading-relaxed">
              Curated artisanal store and slow editorial journal. Direct from independent workshops to your living space.
            </p>
          </div>

          {/* Catalog Col */}
          <div className="space-y-2">
            <span className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] block">
              Collections
            </span>
            <ul className="space-y-1.5 text-stone-600">
              <li>
                <button onClick={() => handleNav('shop')} className="hover:text-stone-950 transition-colors">
                  Coffee & Pour-Over
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop')} className="hover:text-stone-950 transition-colors">
                  Leather & Stationery
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop')} className="hover:text-stone-950 transition-colors">
                  Home & Studio Textiles
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop')} className="hover:text-stone-950 transition-colors">
                  Full Catalog Archive
                </button>
              </li>
            </ul>
          </div>

          {/* Journal Col */}
          <div className="space-y-2">
            <span className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] block">
              Editorial Journal
            </span>
            <ul className="space-y-1.5 text-stone-600">
              <li>
                <button onClick={() => handleNav('blog_list')} className="hover:text-stone-950 transition-colors">
                  Slow Craftsmanship Essays
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('blog_list')} className="hover:text-stone-950 transition-colors">
                  Workspace Architecture
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('blog_list')} className="hover:text-stone-950 transition-colors">
                  Brewing Masterclasses
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('blog_list')} className="hover:text-stone-950 transition-colors">
                  Markdown Journal Archive
                </button>
              </li>
            </ul>
          </div>

          {/* Admin & System Col */}
          <div className="space-y-2">
            <span className="font-semibold text-stone-900 uppercase tracking-wider text-[11px] block">
              Management & Access
            </span>
            <ul className="space-y-1.5 text-stone-600">
              <li>
                <button
                  onClick={() => handleNav('admin')}
                  className="hover:text-stone-950 transition-colors text-amber-900 font-medium flex items-center gap-1"
                >
                  <Shield className="w-3 h-3" />
                  Admin CMS Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('account')} className="hover:text-stone-950 transition-colors">
                  Customer Orders & Receipts
                </button>
              </li>
              <li>
                <button onClick={() => setIsAuthModalOpen(true)} className="hover:text-stone-950 transition-colors">
                  Switch User Role (Demo)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Quiet Bottom Legal */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500">
          <p>© {new Date().getFullYear()} Atelier Studio & Journal. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Stripe Payments Verified</span>
            <span aria-hidden="true">·</span>
            <span>Markdown Powered</span>
            <span aria-hidden="true">·</span>
            <span>SEO Optimized /blogs/-*</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
