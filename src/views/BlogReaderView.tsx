import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  Heart,
  Share2,
  Bookmark,
  MessageSquare,
  Check,
  ShoppingBag,
  Send,
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { ArtworkVisual } from '../components/ArtworkVisual';

export const BlogReaderView: React.FC = () => {
  const {
    selectedBlogSlug,
    getBlogBySlug,
    setCurrentView,
    likeBlogPost,
    addBlogComment,
    incrementBlogViews,
    products,
    addToCart,
    navigateToProduct,
    currentUser,
    setIsAuthModalOpen,
  } = useApp();

  const [commentName, setCommentName] = useState(currentUser?.name || '');
  const [commentEmail, setCommentEmail] = useState(currentUser?.email || '');
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  const post = selectedBlogSlug ? getBlogBySlug(selectedBlogSlug) : null;

  useEffect(() => {
    if (post) {
      incrementBlogViews(post.id);
    }
  }, [post?.id]);

  // Scroll progress listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-stone-900">Journal Entry Not Found</h2>
        <p className="text-xs text-stone-500">The requested article could not be located in our archives.</p>
        <button
          onClick={() => setCurrentView('blog_list')}
          className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800"
        >
          Return to Journal
        </button>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + post.slug);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleLike = () => {
    if (!hasLiked) {
      likeBlogPost(post.id);
      setHasLiked(true);
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    const authorName = commentName.trim() || 'Anonymous Reader';
    const authorEmail = commentEmail.trim() || 'reader@example.com';
    const authorAvatar = `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(authorName)}`;

    addBlogComment(post.id, {
      authorName,
      authorEmail,
      authorAvatar,
      content: commentText.trim(),
    });

    setCommentText('');
  };

  // Find tagged products
  const taggedProducts = (post.linkedProductIds || [])
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as any[];

  return (
    <div className="relative pb-24">
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-stone-200">
        <div
          className="h-full bg-amber-700 transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setCurrentView('blog_list')}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Journal Archive</span>
          </button>

          {/* Canonical slug display for SEO inspection */}
          <div className="flex items-center gap-1 font-mono text-[11px] text-stone-400 bg-stone-100 px-2.5 py-1 rounded">
            <LinkIcon className="w-3 h-3 text-stone-500" />
            <span>{post.slug}</span>
          </div>
        </div>

        {/* Article Header */}
        <header className="space-y-4 pt-2">
          {/* Zero-pill metadata */}
          <div className="flex items-center gap-2 text-xs font-mono text-stone-500">
            <span className="text-amber-800 font-semibold uppercase">{post.category}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTimeMinutes} min read</span>
            <span aria-hidden="true">·</span>
            <span>Published {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-[1.15] text-balance">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-base sm:text-lg text-stone-600 font-serif italic leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Author Block & Interaction Toolbar */}
          <div className="pt-4 pb-6 border-y border-stone-200 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-11 h-11 rounded-full object-cover border border-stone-200"
              />
              <div>
                <h3 className="text-xs font-semibold text-stone-900">{post.author.name}</h3>
                <p className="text-[11px] text-stone-500">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Like Button */}
              <button
                type="button"
                onClick={handleLike}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                  hasLiked
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-red-600 text-red-600' : ''}`} />
                <span className="font-mono tabular-nums">{post.likesCount}</span>
              </button>

              {/* Share / Copy URL */}
              <button
                type="button"
                onClick={handleShare}
                className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Link Copied</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Featured Cover Hero Image */}
        {post.coverImage && (
          <div className="rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm aspect-video">
            <ArtworkVisual
              src={post.coverImage}
              alt={post.title}
              category={post.category}
              aspectRatio="16:9"
              className="w-full h-full"
            />
          </div>
        )}

        {/* Main Article Body (Rendered with Markdown) */}
        <main className="pt-4">
          <MarkdownRenderer content={post.content} />
        </main>

        {/* Article Tags */}
        <div className="pt-8 border-t border-stone-200">
          <span className="text-xs text-stone-400 font-mono uppercase tracking-wider block mb-2">
            Archival Index Topics
          </span>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-mono text-stone-600 bg-stone-100 px-2.5 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Tagged Shop Products Module */}
        {taggedProducts.length > 0 && (
          <div className="my-12 p-6 sm:p-8 bg-[#F5F4EE] rounded-2xl border border-stone-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest font-mono text-amber-800 font-semibold">
                  Featured in this Essay
                </span>
                <h3 className="text-xl font-serif font-bold text-stone-900 mt-0.5">
                  Studio Artifacts Mentioned
                </h3>
              </div>
              <ShoppingBag className="w-5 h-5 text-stone-700" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {taggedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 bg-white rounded-xl border border-stone-200 flex gap-4 items-center justify-between shadow-2xs"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                    <ArtworkVisual
                      src={prod.images[0]}
                      alt={prod.title}
                      category={prod.category}
                      aspectRatio="1:1"
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={() => navigateToProduct(prod.slug)}
                      className="text-xs font-semibold text-stone-900 hover:underline cursor-pointer truncate"
                    >
                      {prod.title}
                    </h4>
                    <p className="text-[11px] text-stone-500 font-mono tabular-nums mt-0.5">
                      ${prod.price.toFixed(2)} · {prod.category}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => addToCart(prod, 1)}
                    className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comments Section */}
        <section className="pt-12 border-t border-stone-200 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif font-bold text-stone-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-stone-600" />
              <span>Reader Discussion ({post.comments?.length || 0})</span>
            </h3>
          </div>

          {/* Comment submission form */}
          <form onSubmit={handleCommentSubmit} className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-600">
              Leave a Thought or Question
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="Your Name (e.g. Thomas Cole)"
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  value={commentEmail}
                  onChange={(e) => setCommentEmail(e.target.value)}
                  placeholder="Your Email (kept private)"
                  className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                />
              </div>
            </div>

            <div>
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={3}
                placeholder="Share your perspective on slow craft, materials, or rituals..."
                className="w-full text-xs px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-500"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Post Comment</span>
              </button>
            </div>
          </form>

          {/* Comment list */}
          <div className="space-y-4">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment) => (
                <div key={comment.id} className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-stone-200">
                        <img src={comment.authorAvatar} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs font-semibold text-stone-900">{comment.authorName}</span>
                    </div>
                    <span className="text-[11px] font-mono text-stone-400">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed pl-9">
                    {comment.content}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 italic">Be the first to leave a comment on this essay.</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
