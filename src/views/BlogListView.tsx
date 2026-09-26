import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Clock, ArrowRight, Sparkles, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ArtworkVisual } from '../components/ArtworkVisual';

export const BlogListView: React.FC = () => {
  const { blogPosts, navigateToBlog } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = useMemo(() => {
    const cats = new Set(blogPosts.map((b) => b.category));
    return ['All', ...Array.from(cats)];
  }, [blogPosts]);

  const filteredPosts = useMemo(() => {
    return blogPosts.filter((post) => {
      const matchSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory = selectedCategory === 'All' || post.category === selectedCategory;

      return matchSearch && matchCategory && post.isPublished;
    });
  }, [blogPosts, searchQuery, selectedCategory]);

  const leadPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-14 space-y-12">
      {/* Editorial Header */}
      <div className="border-b border-stone-200 pb-8">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs uppercase tracking-widest font-mono text-amber-800 font-semibold">
            The Atelier Journal
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-stone-900 leading-tight">
            Essays on Craft, Material Provenance & Studio Life
          </h1>
          <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed">
            Written by our master craftsmen, visiting writers, and resident baristas. Deep dives into ceramics, woodworking, coffee chemistry, and intentional living.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
        {/* Category Segmented Controls */}
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

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search essays, topics, tags..."
            className="w-full text-xs pl-8 pr-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500 bg-stone-50/50"
          />
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <p className="text-base font-serif font-semibold text-stone-800">
            No essays match your search criteria
          </p>
          <p className="text-xs text-stone-500">
            Try searching for topics like &quot;Craftsmanship&quot;, &quot;Coffee&quot;, or &quot;Workspace&quot;.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Featured Lead Post */}
          {leadPost && (
            <div
              onClick={() => navigateToBlog(leadPost.slug)}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group grid grid-cols-1 lg:grid-cols-12 gap-0"
            >
              <div className="lg:col-span-7 bg-stone-100 aspect-video lg:aspect-auto relative overflow-hidden">
                <ArtworkVisual
                  src={leadPost.coverImage}
                  alt={leadPost.title}
                  category={leadPost.category}
                  aspectRatio="16:9"
                  className="w-full h-full"
                />
              </div>

              <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                    <span className="text-amber-800 font-semibold uppercase">{leadPost.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{leadPost.readTimeMinutes} min read</span>
                    <span aria-hidden="true">·</span>
                    <span>{new Date(leadPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 group-hover:text-stone-700 transition-colors leading-tight">
                    {leadPost.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
                    {leadPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={leadPost.author.avatar}
                      alt={leadPost.author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-medium text-stone-800">{leadPost.author.name}</span>
                  </div>
                  <span className="font-semibold text-stone-900 group-hover:underline inline-flex items-center gap-1">
                    Read Essay <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Grid of Other Posts */}
          {otherPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {otherPosts.map((post) => (
                <div
                  key={post.id}
                  onClick={() => navigateToBlog(post.slug)}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="aspect-video bg-stone-100 overflow-hidden">
                    <ArtworkVisual
                      src={post.coverImage}
                      alt={post.title}
                      category={post.category}
                      aspectRatio="16:9"
                      className="w-full h-full"
                    />
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
                        <span className="text-amber-800 font-semibold uppercase">{post.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>{post.readTimeMinutes} min read</span>
                      </div>

                      <h3 className="font-serif font-semibold text-stone-900 text-lg group-hover:text-stone-700 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                      <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="font-semibold text-stone-900 group-hover:underline inline-flex items-center gap-1">
                        Read <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
