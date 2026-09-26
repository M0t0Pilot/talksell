import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, Check, ShoppingBag, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArtworkVisual } from '../components/ArtworkVisual';

export const ProductCatalogView: React.FC = () => {
  const { products, navigateToProduct, addToCart } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [onlyInStock, setOnlyInStock] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['All', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchStock = !onlyInStock || p.inventory > 0;

      return matchSearch && matchCategory && matchStock;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, searchQuery, selectedCategory, sortBy, onlyInStock]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-stone-500 font-medium">
              Permanent Catalog
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900 mt-1">
              Handcrafted Objects
            </h1>
          </div>
          <p className="text-xs text-stone-500 font-mono">
            Showing {filteredProducts.length} of {products.length} archival creations
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        {/* Category Segmented Controls (Interactive buttons allowed per Constitution) */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-60">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full text-xs pl-8 pr-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500 bg-stone-50/50"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-stone-500 hidden sm:inline">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs px-2.5 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500 bg-white text-stone-800"
            >
              <option value="featured">Featured First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Products */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <p className="text-base font-serif font-semibold text-stone-800">
            No artisanal items match your search
          </p>
          <p className="text-xs text-stone-500">
            Try adjusting your category filter or search keywords.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* Image Container */}
              <div
                onClick={() => navigateToProduct(product.slug)}
                className="cursor-pointer overflow-hidden bg-stone-100 relative"
              >
                <ArtworkVisual
                  src={product.images[0]}
                  alt={product.title}
                  category={product.category}
                  aspectRatio="4:3"
                  className="w-full"
                />
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1.5">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToProduct(product.slug);
                    }}
                    className="p-2 bg-white/90 hover:bg-white text-stone-800 rounded-lg shadow-xs backdrop-blur-xs transition-colors"
                    title="Quick View Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>

                {product.inventory === 0 && (
                  <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-2xs flex items-center justify-center text-white font-mono text-xs uppercase tracking-wider font-semibold">
                    Sold Out
                  </div>
                )}
              </div>

              {/* Info Container */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-400 font-mono mb-1">
                    <span>{product.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.origin || 'Studio'}</span>
                  </div>

                  <h3
                    onClick={() => navigateToProduct(product.slug)}
                    className="font-serif font-semibold text-stone-900 text-lg hover:text-stone-700 cursor-pointer line-clamp-1"
                  >
                    {product.title}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                    {product.subtitle || product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-baseline gap-2 font-mono">
                      <span className="text-base font-semibold text-stone-900 tabular-nums">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-stone-400 line-through tabular-nums">
                          ${product.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-400">
                      ★ {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>

                  <button
                    disabled={product.inventory === 0}
                    onClick={() => addToCart(product, 1)}
                    className="px-4 py-2 text-xs font-medium bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
