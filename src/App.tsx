import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { StripeCheckoutModal } from './components/StripeCheckoutModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';
import { StorefrontView } from './views/StorefrontView';
import { ProductCatalogView } from './views/ProductCatalogView';
import { ProductDetailView } from './views/ProductDetailView';
import { BlogListView } from './views/BlogListView';
import { BlogReaderView } from './views/BlogReaderView';
import { AdminDashboardView } from './views/AdminDashboardView';
import { AccountView } from './views/AccountView';

const MainLayout: React.FC = () => {
  const { currentView, selectedBlogSlug, getBlogBySlug } = useApp();

  // Dynamic document title update for SEO & readability
  useEffect(() => {
    if (currentView === 'home') {
      document.title = 'Atelier — Artisanal Shop & Editorial Journal';
    } else if (currentView === 'shop') {
      document.title = 'Shop Handcrafted Objects — Atelier Catalog';
    } else if (currentView === 'blog_list') {
      document.title = 'The Journal — Essays on Craft & Material Provenance';
    } else if (currentView === 'blog_reader' && selectedBlogSlug) {
      const post = getBlogBySlug(selectedBlogSlug);
      if (post) {
        document.title = `${post.title} — Atelier Journal`;
      }
    } else if (currentView === 'admin') {
      document.title = 'Admin CMS & Commerce Dashboard — Atelier';
    } else if (currentView === 'account') {
      document.title = 'My Account & Orders — Atelier';
    }
  }, [currentView, selectedBlogSlug, getBlogBySlug]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFBF9] text-[#1C1917] font-sans antialiased">
      {/* Top Bar Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && <StorefrontView />}
        {currentView === 'shop' && <ProductCatalogView />}
        {currentView === 'product_detail' && <ProductDetailView />}
        {currentView === 'blog_list' && <BlogListView />}
        {currentView === 'blog_reader' && <BlogReaderView />}
        {currentView === 'admin' && <AdminDashboardView />}
        {currentView === 'account' && <AccountView />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <StripeCheckoutModal />
      <AuthModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
