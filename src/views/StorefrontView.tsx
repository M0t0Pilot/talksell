import React from 'react';
import { ArrowRight, Sparkles, Compass, ShieldCheck, Heart, BookOpen, ShoppingBag } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArtworkVisual } from '../components/ArtworkVisual';

export const StorefrontView: React.FC = () => {
  const { products, blogPosts, navigateToProduct, navigateToBlog, addToCart, setCurrentView } = useApp();

  const featuredProducts = products.slice(0, 4);
  const featuredArticle = blogPosts[0];
  const recentArticles = blogPosts.slice(1, 3);

  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-14 pb-12 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono text-stone-500 uppercase tracking-wider">
                <span>Direct-from-Maker</span>
                <span aria-hidden="true">·</span>
                <span>Issue No. 08</span>
                <span aria-hidden="true">·</span>
                <span>Spring 2026</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 leading-[1.12] text-balance">
                Tactile goods for intentional spaces and thoughtful rituals.
              </h1>

              <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl font-light">
                Atelier bridges artisanal small-batch manufacturing with slow editorial publishing. Every ceramic dripper, leather journal, and essay is crafted to endure beyond seasonal noise.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => {
                    setCurrentView('shop');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 bg-stone-900 text-white rounded-xl text-xs sm:text-sm font-medium hover:bg-stone-800 transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Explore Shop Catalog</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('blog_list');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-3.5 border border-stone-300 text-stone-800 hover:text-stone-950 rounded-xl text-xs sm:text-sm font-medium hover:bg-stone-100 transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Read the Journal</span>
                </button>
              </div>

              {/* Trust markers */}
              <div className="pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-4 text-xs text-stone-600">
                <div>
                  <p className="font-semibold text-stone-900 font-serif text-sm">Small-Batch</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Handmade in studio workshops</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-900 font-serif text-sm">Zero Plastic</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">100% recyclable paper pack</p>
                </div>
                <div>
                  <p className="font-semibold text-stone-900 font-serif text-sm">Global Stripe</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">Encrypted payment & receipts</p>
                </div>
              </div>
            </div>

            {/* Right Hero Visual */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200 bg-stone-100">
                <ArtworkVisual
                  src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=900&auto=format&fit=crop&q=80"
                  alt="Artisanal ceramics and journal table"
                  category="Artisanal Collection"
                  aspectRatio="4:3"
                  className="w-full"
                />
                <div className="p-5 bg-white border-t border-stone-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400">
                        Featured Craft Piece
                      </span>
                      <h3 className="font-serif font-semibold text-stone-900 text-base">
                        Kuro Sand Ceramic Dripper
                      </h3>
                    </div>
                    <span className="font-mono tabular-nums text-sm font-semibold text-stone-900">
                      $88.00
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-stone-100">
                    <span className="text-stone-500">Wheel-thrown in Shigaraki, Japan</span>
                    <button
                      onClick={() => navigateToProduct('kuro-sand-ceramic-dripper')}
                      className="text-stone-900 font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      View Piece <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Products Collection Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-mono text-stone-500 font-medium">
              Curated Selection
            </span>
            <h2 className="text-3xl font-serif font-bold text-stone-900 mt-1">
              Objects of Lasting Value
            </h2>
          </div>
          <button
            onClick={() => {
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-stone-900 hover:text-stone-700 inline-flex items-center gap-1 group self-start md:self-auto cursor-pointer"
          >
            <span>View all products</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl border border-stone-200/80 overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col"
            >
              {/* Image box */}
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
                {product.inventory < 5 && product.inventory > 0 && (
                  <span className="absolute top-3 left-3 text-[10px] font-mono uppercase bg-amber-100/90 text-amber-900 px-2 py-0.5 rounded backdrop-blur-xs font-semibold">
                    Only {product.inventory} left
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-400 font-mono mb-1">
                    <span>{product.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{product.origin || 'Studio'}</span>
                  </div>
                  <h3
                    onClick={() => navigateToProduct(product.slug)}
                    className="font-serif font-semibold text-stone-900 text-base hover:text-stone-700 cursor-pointer line-clamp-1"
                  >
                    {product.title}
                  </h3>
                  <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                    {product.subtitle || product.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div className="flex items-baseline gap-1.5 font-mono">
                    <span className="text-sm font-semibold text-stone-900 tabular-nums">
                      ${product.price.toFixed(2)}
                    </span>
                    {product.compareAtPrice && (
                      <span className="text-xs text-stone-400 line-through tabular-nums">
                        ${product.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product, 1)}
                    className="px-3 py-1.5 text-xs font-medium bg-stone-900 hover:bg-stone-800 text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Add to Bag
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Editorial Journal Section */}
      <section className="bg-[#F4F4EE] border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-mono text-stone-500 font-medium">
                The Atelier Journal
              </span>
              <h2 className="text-3xl font-serif font-bold text-stone-900 mt-1">
                Essays on Craft, Material & Pacing
              </h2>
            </div>
            <button
              onClick={() => {
                setCurrentView('blog_list');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-stone-900 hover:text-stone-700 inline-flex items-center gap-1 group self-start md:self-auto cursor-pointer"
            >
              <span>Explore all essays</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Lead Story Card (Left 7 cols) */}
            {featuredArticle && (
              <div
                onClick={() => navigateToBlog(featuredArticle.slug)}
                className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col"
              >
                <div className="relative aspect-video overflow-hidden bg-stone-200">
                  <ArtworkVisual
                    src={featuredArticle.coverImage}
                    alt={featuredArticle.title}
                    category={featuredArticle.category}
                    aspectRatio="16:9"
                    className="w-full h-full"
                  />
                </div>
                <div className="p-6 md:p-8 space-y-4">
                  {/* Zero-pill metadata */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                    <span className="text-amber-800 font-medium uppercase">{featuredArticle.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{featuredArticle.readTimeMinutes} min read</span>
                    <span aria-hidden="true">·</span>
                    <span>By {featuredArticle.author.name}</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 group-hover:text-stone-700 transition-colors text-balance">
                    {featuredArticle.title}
                  </h3>

                  <p className="text-stone-600 text-sm md:text-base leading-relaxed line-clamp-3">
                    {featuredArticle.excerpt}
                  </p>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="font-mono text-stone-400">
                      Canonical: {featuredArticle.slug}
                    </span>
                    <span className="font-semibold text-stone-900 group-hover:underline inline-flex items-center gap-1">
                      Read Essay <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Secondary Stories List (Right 5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {recentArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => navigateToBlog(article.slug)}
                  className="bg-white rounded-xl border border-stone-200 p-5 shadow-2xs hover:shadow-md transition-all cursor-pointer group space-y-3"
                >
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                    <span className="text-amber-800 font-medium uppercase">{article.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{article.readTimeMinutes} min read</span>
                  </div>

                  <h4 className="text-lg font-serif font-semibold text-stone-900 group-hover:text-stone-700 transition-colors">
                    {article.title}
                  </h4>

                  <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-xs text-stone-500">
                    <span>{new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span className="font-semibold text-stone-900 group-hover:underline inline-flex items-center gap-1">
                      Read <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Story & Values Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-8 sm:p-12 lg:p-16 border border-stone-800">
          <div className="max-w-3xl space-y-6">
            <span className="text-xs uppercase tracking-widest font-mono text-amber-400 font-semibold">
              The Philosophy
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium leading-snug">
              Every object tells the story of the hands that formed it.
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed font-light">
              We collaborate directly with independent potters, leather smiths, and textile weavers who honor generational techniques. By cutting out intermediaries and publishing honest documentation, we ensure fair compensation for craftsmen and transparent provenance for you.
            </p>
            <div className="pt-4 flex flex-wrap gap-8 text-xs font-mono text-stone-400">
              <div>
                <strong className="block text-xl text-white font-serif mb-0.5">100%</strong>
                Traceable material origins
              </div>
              <div>
                <strong className="block text-xl text-white font-serif mb-0.5">0%</strong>
                Synthetic mass-fillers
              </div>
              <div>
                <strong className="block text-xl text-white font-serif mb-0.5">256-bit</strong>
                Stripe encrypted checkouts
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
