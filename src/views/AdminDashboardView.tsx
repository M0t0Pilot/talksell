import React, { useState } from 'react';
import {
  Package,
  FileText,
  CreditCard,
  BarChart3,
  Plus,
  Trash2,
  Edit,
  Eye,
  Search,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MarkdownEditor } from '../components/MarkdownEditor';
import { Product, BlogPost, OrderStatus } from '../types';
import { ArtworkVisual } from '../components/ArtworkVisual';

export const AdminDashboardView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    blogPosts,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    orders,
    updateOrderStatus,
    currentUser,
    navigateToBlog,
    navigateToProduct,
    isAdmin,
    setIsAuthModalOpen,
  } = useApp();

  // Active Admin Tab: 'overview' | 'blogs' | 'products' | 'orders'
  const [activeTab, setActiveTab] = useState<'overview' | 'blogs' | 'products' | 'orders'>('blogs');

  // Blog CMS State
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Product CMS State
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // New Product Form State
  const [productForm, setProductForm] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    longDescription: '',
    price: 45.0,
    compareAtPrice: 0,
    category: 'Home & Living',
    inventory: 20,
    sku: 'AT-NEW-001',
    images: 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800',
    tags: 'Artisanal, Handmade',
    materials: 'Natural clay / organic linen',
    dimensions: 'Standard size',
    origin: 'Studio Workshop',
  });

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-full flex items-center justify-center mx-auto">
          <Shield className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-serif font-bold text-stone-900">Admin Authentication Required</h2>
        <p className="text-xs text-stone-600">
          The Content Management System and Stripe order dashboard is restricted to Atelier Administrators.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-5 py-2.5 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Sign In as Admin (1-Click Demo)
        </button>
      </div>
    );
  }

  // Analytics Metrics
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.total, 0);
  const totalItemsSold = orders.reduce(
    (sum, ord) => sum + ord.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  const totalBlogViews = blogPosts.reduce((sum, b) => sum + b.viewsCount, 0);
  const lowStockProducts = products.filter((p) => p.inventory <= 10);

  // Handle Product Submit
  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productSlug = productForm.slug.trim() || productForm.title.toLowerCase().replace(/[^\w]+/g, '-');
    const imageList = productForm.images
      .split('\n')
      .map((img) => img.trim())
      .filter(Boolean);

    const tagList = productForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newProdData = {
      title: productForm.title,
      slug: productSlug,
      subtitle: productForm.subtitle,
      description: productForm.description,
      longDescription: productForm.longDescription,
      price: Number(productForm.price),
      compareAtPrice: productForm.compareAtPrice ? Number(productForm.compareAtPrice) : undefined,
      category: productForm.category,
      inventory: Number(productForm.inventory),
      sku: productForm.sku,
      images: imageList.length > 0 ? imageList : ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800'],
      tags: tagList,
      rating: 5.0,
      reviewCount: 1,
      materials: productForm.materials,
      dimensions: productForm.dimensions,
      origin: productForm.origin,
    };

    if (editingProductId) {
      updateProduct(editingProductId, newProdData);
      setEditingProductId(null);
    } else {
      addProduct(newProdData);
      setIsCreatingProduct(false);
    }

    // Reset
    setProductForm({
      title: '',
      slug: '',
      subtitle: '',
      description: '',
      longDescription: '',
      price: 45.0,
      compareAtPrice: 0,
      category: 'Home & Living',
      inventory: 20,
      sku: 'AT-NEW-' + Math.floor(100 + Math.random() * 900),
      images: '',
      tags: '',
      materials: '',
      dimensions: '',
      origin: '',
    });
  };

  const startEditProduct = (p: Product) => {
    setProductForm({
      title: p.title,
      slug: p.slug,
      subtitle: p.subtitle,
      description: p.description,
      longDescription: p.longDescription,
      price: p.price,
      compareAtPrice: p.compareAtPrice || 0,
      category: p.category,
      inventory: p.inventory,
      sku: p.sku,
      images: p.images.join('\n'),
      tags: p.tags.join(', '),
      materials: p.materials || '',
      dimensions: p.dimensions || '',
      origin: p.origin || '',
    });
    setEditingProductId(p.id);
    setIsCreatingProduct(true);
  };

  const editingPost = editingPostId ? blogPosts.find((b) => b.id === editingPostId) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Top CMS Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-800 font-semibold">
              Atelier Management Engine
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-mono px-2 py-0.5 rounded font-semibold">
              v2.4 Live
            </span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-stone-900 mt-1">
            Studio CMS & Commerce Dashboard
          </h1>
        </div>

        {/* Tab Navigation Controls */}
        <div className="flex items-center bg-stone-200/80 p-1 rounded-xl text-xs font-medium text-stone-700 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('overview');
              setIsCreatingPost(false);
              setIsCreatingProduct(false);
            }}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-white text-stone-950 font-bold shadow-xs'
                : 'hover:text-stone-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('blogs');
              setIsCreatingProduct(false);
            }}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'blogs'
                ? 'bg-white text-stone-950 font-bold shadow-xs'
                : 'hover:text-stone-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-800" />
            <span>Blog CMS ({blogPosts.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('products');
              setIsCreatingPost(false);
            }}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'products'
                ? 'bg-white text-stone-950 font-bold shadow-xs'
                : 'hover:text-stone-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('orders');
              setIsCreatingPost(false);
              setIsCreatingProduct(false);
            }}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-white text-stone-950 font-bold shadow-xs'
                : 'hover:text-stone-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Stripe Orders ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
                Gross Sales (Stripe)
              </span>
              <p className="text-2xl font-serif font-bold text-stone-900 font-mono tabular-nums">
                ${totalRevenue.toFixed(2)}
              </p>
              <span className="text-[11px] text-emerald-700 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> All payments verified
              </span>
            </div>

            <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
                Total Orders
              </span>
              <p className="text-2xl font-serif font-bold text-stone-900 font-mono tabular-nums">
                {orders.length}
              </p>
              <span className="text-[11px] text-stone-500">
                {totalItemsSold} artifacts dispatched
              </span>
            </div>

            <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
                Journal Readership
              </span>
              <p className="text-2xl font-serif font-bold text-stone-900 font-mono tabular-nums">
                {totalBlogViews}
              </p>
              <span className="text-[11px] text-stone-500">
                Across {blogPosts.length} published essays
              </span>
            </div>

            <div className="p-5 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-xs text-stone-500 uppercase tracking-wider font-mono">
                Inventory Alerts
              </span>
              <p className="text-2xl font-serif font-bold text-stone-900 font-mono tabular-nums">
                {lowStockProducts.length}
              </p>
              <span className="text-[11px] text-amber-700">
                Items below 10 stock units
              </span>
            </div>
          </div>

          {/* Quick Actions & Recent Orders Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent Orders */}
            <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Recent Stripe Transactions
                </h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs text-stone-600 hover:text-stone-950 font-semibold underline"
                >
                  View All Orders
                </button>
              </div>

              <div className="divide-y divide-stone-100 overflow-x-auto">
                {orders.slice(0, 4).map((ord) => (
                  <div key={ord.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-stone-900">
                        {ord.orderNumber} · {ord.customer.name}
                      </p>
                      <p className="text-[11px] text-stone-400 font-mono">
                        {ord.stripePaymentIntentId} · {new Date(ord.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-stone-900 tabular-nums">
                        ${ord.total.toFixed(2)}
                      </p>
                      <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded uppercase font-semibold ${
                        ord.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                        ord.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                        ord.status === 'shipped' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick CMS Shortcuts */}
            <div className="lg:col-span-4 bg-[#FBFBF9] p-6 rounded-2xl border border-stone-200 space-y-4">
              <h3 className="text-base font-serif font-bold text-stone-900">
                Editorial & Shop Shortcuts
              </h3>
              <div className="space-y-2.5">
                <button
                  onClick={() => {
                    setActiveTab('blogs');
                    setIsCreatingPost(true);
                  }}
                  className="w-full p-3 bg-white border border-stone-200 hover:border-stone-400 rounded-xl text-xs font-semibold text-stone-800 flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-800" />
                    Write New Journal Essay
                  </span>
                  <Plus className="w-4 h-4 text-stone-400" />
                </button>

                <button
                  onClick={() => {
                    setActiveTab('products');
                    setIsCreatingProduct(true);
                  }}
                  className="w-full p-3 bg-white border border-stone-200 hover:border-stone-400 rounded-xl text-xs font-semibold text-stone-800 flex items-center justify-between transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-stone-700" />
                    Add New Catalog Product
                  </span>
                  <Plus className="w-4 h-4 text-stone-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BLOG CMS & MARKDOWN WRITER TAB */}
      {activeTab === 'blogs' && (
        <div className="space-y-6">
          {isCreatingPost ? (
            /* Markdown Editor view */
            <MarkdownEditor
              initialTitle={editingPost?.title || ''}
              initialSlug={editingPost?.slug || ''}
              initialExcerpt={editingPost?.excerpt || ''}
              initialContent={editingPost?.content || ''}
              initialCoverImage={editingPost?.coverImage || ''}
              initialCategory={editingPost?.category || 'Essays'}
              initialTags={editingPost?.tags || ['Craftsmanship', 'Design']}
              initialSeoTitle={editingPost?.seoTitle || ''}
              initialSeoDescription={editingPost?.seoDescription || ''}
              initialLinkedProductIds={editingPost?.linkedProductIds || []}
              availableProducts={products}
              isEditing={Boolean(editingPostId)}
              onCancel={() => {
                setIsCreatingPost(false);
                setEditingPostId(null);
              }}
              onSave={(data) => {
                if (editingPostId) {
                  updateBlogPost(editingPostId, data);
                } else {
                  addBlogPost({
                    ...data,
                    author: {
                      name: currentUser?.name || 'Eleanor Vance',
                      role: currentUser?.role === 'admin' ? 'Editor in Chief' : 'Guest Contributor',
                      avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                    },
                    publishedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  });
                }
                setIsCreatingPost(false);
                setEditingPostId(null);
              }}
            />
          ) : (
            /* Blog Post Management Table */
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    Journal Articles & SEO Slugs
                  </h3>
                  <p className="text-xs text-stone-500">
                    All articles support standard Markdown syntax and generate indexable slugs formatted as <code className="font-mono text-amber-900 font-bold">/blogs/-post-title</code>.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingPostId(null);
                    setIsCreatingPost(true);
                  }}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write New Essay</span>
                </button>
              </div>

              {/* Table of Articles */}
              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs text-stone-800">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                    <tr>
                      <th className="px-5 py-3.5">Article & SEO Slug</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Metrics</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {blogPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-stone-900 text-sm">{post.title}</p>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-amber-800 mt-1">
                            <span>{post.slug}</span>
                            <span className="text-stone-400">·</span>
                            <span className="text-stone-500">{post.readTimeMinutes} min read</span>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-medium text-stone-700">
                          {post.category}
                        </td>
                        <td className="px-4 py-4 font-mono text-[11px] text-stone-600">
                          <div>{post.viewsCount} views</div>
                          <div className="text-stone-400">{post.comments?.length || 0} comments</div>
                        </td>
                        <td className="px-4 py-4">
                          <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                            post.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-700'
                          }`}>
                            {post.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => navigateToBlog(post.slug)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                            title="View live essay"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingPostId(post.id);
                              setIsCreatingPost(true);
                            }}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                            title="Edit Markdown"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Delete essay "${post.title}"?`)) {
                                deleteBlogPost(post.id);
                              }
                            }}
                            className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. PRODUCT CATALOG CMS TAB */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {isCreatingProduct ? (
            /* Add / Edit Product Form */
            <form onSubmit={handleProductSubmit} className="bg-white rounded-xl border border-stone-200 p-6 space-y-6 shadow-sm">
              <div className="flex items-center justify-between border-b border-stone-200 pb-4">
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  {editingProductId ? 'Edit Catalog Piece' : 'Add New Handcrafted Product'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingProduct(false);
                    setEditingProductId(null);
                  }}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg hover:bg-stone-50"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    required
                    placeholder="e.g. Kuro Sand Ceramic Dripper"
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={productForm.slug}
                    onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                    placeholder="kuro-sand-ceramic-dripper"
                    className="w-full text-sm font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Subtitle / Kicker
                  </label>
                  <input
                    type="text"
                    value={productForm.subtitle}
                    onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                    placeholder="Hand-thrown stoneware with spiral extraction"
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Category
                  </label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500 bg-white"
                  >
                    <option value="Coffee & Tea">Coffee & Tea</option>
                    <option value="Stationery">Stationery</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Workspace">Workspace</option>
                    <option value="Textiles">Textiles</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Price (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })}
                    required
                    className="w-full text-sm font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Inventory Units in Stock
                  </label>
                  <input
                    type="number"
                    value={productForm.inventory}
                    onChange={(e) => setProductForm({ ...productForm, inventory: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full text-sm font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full text-sm font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Origin / Workshop
                  </label>
                  <input
                    type="text"
                    value={productForm.origin}
                    onChange={(e) => setProductForm({ ...productForm, origin: e.target.value })}
                    placeholder="e.g. Shigaraki, Japan"
                    className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Product Image URLs (One URL per line)
                </label>
                <textarea
                  value={productForm.images}
                  onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
                  rows={2}
                  className="w-full text-xs font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Short Description
                </label>
                <textarea
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={2}
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-1">
                  Long Craftsmanship & Materials Description
                </label>
                <textarea
                  value={productForm.longDescription}
                  onChange={(e) => setProductForm({ ...productForm, longDescription: e.target.value })}
                  rows={4}
                  className="w-full text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreatingProduct(false);
                    setEditingProductId(null);
                  }}
                  className="px-4 py-2 text-xs font-medium border border-stone-300 rounded-lg hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  {editingProductId ? 'Update Piece' : 'Save Piece to Catalog'}
                </button>
              </div>
            </form>
          ) : (
            /* Product List Table */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-stone-900">
                    Product Inventory Management
                  </h3>
                  <p className="text-xs text-stone-500">
                    Manage prices, stock levels, and studio craft pieces.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProductId(null);
                    setIsCreatingProduct(true);
                  }}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-medium transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs text-stone-800">
                  <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                    <tr>
                      <th className="px-5 py-3.5">Product</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Price</th>
                      <th className="px-4 py-3.5">Stock Level</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((prod) => (
                      <tr key={prod.id} className="hover:bg-stone-50/60 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                              <ArtworkVisual
                                src={prod.images[0]}
                                alt={prod.title}
                                category={prod.category}
                                aspectRatio="1:1"
                                className="w-full h-full"
                              />
                            </div>
                            <div>
                              <p className="font-semibold text-stone-900">{prod.title}</p>
                              <p className="text-[11px] font-mono text-stone-400">SKU: {prod.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-stone-600 font-medium">
                          {prod.category}
                        </td>
                        <td className="px-4 py-3.5 font-mono tabular-nums font-semibold text-stone-900">
                          ${prod.price.toFixed(2)}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-block font-mono text-[11px] font-semibold px-2 py-0.5 rounded ${
                            prod.inventory <= 5 ? 'bg-red-100 text-red-800' :
                            prod.inventory <= 15 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-800'
                          }`}>
                            {prod.inventory} in stock
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-1">
                          <button
                            type="button"
                            onClick={() => navigateToProduct(prod.slug)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                            title="View in store"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => startEditProduct(prod)}
                            className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove "${prod.title}" from catalog?`)) {
                                deleteProduct(prod.id);
                              }
                            }}
                            className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. STRIPE ORDERS & FULFILLMENT TAB */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-serif font-bold text-stone-900">
              Stripe Payments & Order Fulfillment
            </h3>
            <p className="text-xs text-stone-500">
              Review live client checkouts, billing details, and update shipping fulfillment status.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs text-stone-800">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="px-5 py-3.5">Order & Customer</th>
                  <th className="px-4 py-3.5">Stripe Transaction</th>
                  <th className="px-4 py-3.5">Items & Amount</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-bold text-stone-900 font-mono text-sm">{ord.orderNumber}</p>
                      <p className="text-stone-700 font-medium">{ord.customer.name}</p>
                      <p className="text-[11px] text-stone-400">{ord.customer.email}</p>
                    </td>
                    <td className="px-4 py-4 font-mono text-[11px] text-stone-600">
                      <div className="text-stone-800 font-semibold">{ord.stripePaymentIntentId}</div>
                      <div className="text-stone-400 uppercase">{ord.cardBrand} •••• {ord.cardLast4}</div>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-mono font-bold text-stone-900 tabular-nums text-sm">
                        ${ord.total.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {ord.items.map((i) => `${i.quantity}× ${i.product.title}`).join(', ')}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                        ord.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                        ord.status === 'processing' ? 'bg-amber-100 text-amber-800' :
                        ord.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                        ord.status === 'delivered' ? 'bg-purple-100 text-purple-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {ord.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="text-xs px-2.5 py-1.5 border border-stone-300 rounded-lg bg-white font-medium text-stone-800 focus:outline-none"
                      >
                        <option value="paid">Paid</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
