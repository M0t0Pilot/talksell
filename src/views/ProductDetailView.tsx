import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArtworkVisual } from '../components/ArtworkVisual';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProductSlug,
    getProductBySlug,
    setCurrentView,
    addToCart,
    setIsCheckoutOpen,
    products,
    navigateToProduct,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const product = selectedProductSlug ? getProductBySlug(selectedProductSlug) : null;

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-stone-900">Product Not Found</h2>
        <p className="text-xs text-stone-500">The requested handcrafted piece could not be located.</p>
        <button
          onClick={() => setCurrentView('shop')}
          className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const handleQuickBuy = () => {
    addToCart(product, quantity);
    setIsCheckoutOpen(true);
  };

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
      {/* Breadcrumbs / Back button */}
      <button
        onClick={() => setCurrentView('shop')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Product Catalog</span>
      </button>

      {/* Main Contiguous Purchase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl overflow-hidden border border-stone-200 bg-[#F4F4F0] shadow-sm">
            <ArtworkVisual
              src={product.images[activeImageIndex] || product.images[0]}
              alt={product.title}
              category={product.category}
              aspectRatio="4:3"
              className="w-full"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-stone-900 ring-2 ring-stone-400/50'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Badges */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
              <span className="text-amber-800 font-semibold uppercase">{product.category}</span>
              <span aria-hidden="true">·</span>
              <span>SKU: {product.sku}</span>
              <span aria-hidden="true">·</span>
              <span>{product.origin || 'Artisanal Studio'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-tight">
              {product.title}
            </h1>

            <p className="text-sm font-serif italic text-stone-600">
              {product.subtitle}
            </p>

            {/* Ratings & Price */}
            <div className="pt-2 flex items-center justify-between">
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-2xl font-bold text-stone-900 tabular-nums">
                  ${product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-stone-600">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span className="font-semibold text-stone-900">{product.rating}</span>
                <span className="text-stone-400">({product.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Short description */}
          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed pt-2 border-t border-stone-200">
            <p>{product.description}</p>
          </div>

          {/* Stock & Availability */}
          <div className="flex items-center gap-2 text-xs">
            {product.inventory > 0 ? (
              <span className="flex items-center gap-1.5 text-emerald-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                In Stock ({product.inventory} units remaining)
              </span>
            ) : (
              <span className="text-red-600 font-medium">
                Currently Sold Out (Next batch in kiln)
              </span>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-stone-300 rounded-xl bg-white p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-sm font-mono font-medium text-stone-900 tabular-nums">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                  className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                disabled={product.inventory === 0}
                onClick={() => addToCart(product, quantity)}
                className="flex-1 py-3.5 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-xl text-xs sm:text-sm font-medium transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Shopping Bag</span>
              </button>
            </div>

            <button
              type="button"
              disabled={product.inventory === 0}
              onClick={handleQuickBuy}
              className="w-full py-3 bg-amber-800 hover:bg-amber-900 disabled:bg-stone-300 text-white rounded-xl text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Instant Buy with Stripe</span>
            </button>
          </div>

          {/* Specifications Box */}
          <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2.5 text-xs text-stone-600">
            {product.materials && (
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-400">Materials</span>
                <span className="text-stone-800 font-medium text-right">{product.materials}</span>
              </div>
            )}
            {product.dimensions && (
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-400">Dimensions</span>
                <span className="text-stone-800 font-medium text-right">{product.dimensions}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-stone-400">Shipping</span>
              <span className="text-stone-800 font-medium text-right">Free on orders $75+</span>
            </div>
          </div>

          {/* Trust points */}
          <div className="grid grid-cols-2 gap-3 pt-2 text-[11px] text-stone-500">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-stone-400" />
              <span>Tracked Courier Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-stone-400" />
              <span>30-Day Return Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Long Craft Story */}
      <div className="pt-10 border-t border-stone-200 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Craftsmanship & Provenance
          </h2>
          <div className="prose-editorial text-sm sm:text-base text-stone-700 leading-relaxed whitespace-pre-line">
            {product.longDescription || product.description}
          </div>
        </div>
        <div className="lg:col-span-4 bg-[#F8F8F4] p-6 rounded-2xl border border-stone-200 space-y-4">
          <h3 className="text-base font-serif font-semibold text-stone-900">
            Our Studio Promise
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Every batch undergoes manual quality inspection by our master ceramicists and bookbinders. Small textural variations in raw iron clay, timber grain, or full-grain leather are genuine signatures of handcrafted authenticity.
          </p>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-stone-200 space-y-6">
          <h3 className="text-2xl font-serif font-semibold text-stone-900">
            Complementary Studio Pieces
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                onClick={() => navigateToProduct(rel.slug)}
                className="group p-4 bg-white rounded-xl border border-stone-200 hover:shadow-md transition-all cursor-pointer space-y-3"
              >
                <div className="aspect-square rounded-lg overflow-hidden bg-stone-100">
                  <ArtworkVisual
                    src={rel.images[0]}
                    alt={rel.title}
                    category={rel.category}
                    aspectRatio="1:1"
                    className="w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="font-serif font-semibold text-stone-900 text-sm group-hover:text-stone-700 truncate">
                    {rel.title}
                  </h4>
                  <p className="text-xs font-mono text-stone-600 mt-1 tabular-nums">
                    ${rel.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
