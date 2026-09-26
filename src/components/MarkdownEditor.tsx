import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image as ImageIcon,
  Table as TableIcon,
  Minus,
  Eye,
  Columns2,
  PenTool,
  Clock,
  Sparkles,
  FileText,
  Search,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';
import { calculateReadTime, generateSlug } from '../services/store';
import { Product } from '../types';

interface MarkdownEditorProps {
  initialTitle?: string;
  initialSlug?: string;
  initialExcerpt?: string;
  initialContent?: string;
  initialCoverImage?: string;
  initialCategory?: string;
  initialTags?: string[];
  initialSeoTitle?: string;
  initialSeoDescription?: string;
  initialLinkedProductIds?: string[];
  availableProducts: Product[];
  onSave: (data: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage: string;
    category: string;
    tags: string[];
    seoTitle: string;
    seoDescription: string;
    linkedProductIds: string[];
    isPublished: boolean;
  }) => void;
  onCancel?: () => void;
  isEditing?: boolean;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  initialTitle = '',
  initialSlug = '',
  initialExcerpt = '',
  initialContent = '',
  initialCoverImage = '',
  initialCategory = 'Essays',
  initialTags = ['Craftsmanship', 'Design'],
  initialSeoTitle = '',
  initialSeoDescription = '',
  initialLinkedProductIds = [],
  availableProducts,
  onSave,
  onCancel,
  isEditing = false,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [slug, setSlug] = useState(initialSlug || (initialTitle ? generateSlug(initialTitle) : '/blogs/-'));
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(Boolean(initialSlug));
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [content, setContent] = useState(initialContent);
  const [coverImage, setCoverImage] = useState(initialCoverImage);
  const [category, setCategory] = useState(initialCategory);
  const [tagsInput, setTagsInput] = useState(initialTags.join(', '));
  const [seoTitle, setSeoTitle] = useState(initialSeoTitle || initialTitle);
  const [seoDescription, setSeoDescription] = useState(initialSeoDescription || initialExcerpt);
  const [linkedProductIds, setLinkedProductIds] = useState<string[]>(initialLinkedProductIds);
  const [isPublished, setIsPublished] = useState(true);

  // Editor mode: 'write' | 'split' | 'preview'
  const [mode, setMode] = useState<'write' | 'split' | 'preview'>('split');
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'products'>('content');

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-generate slug when title changes unless user manually customized it
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(newTitle));
    }
    if (!seoTitle || seoTitle === title) {
      setSeoTitle(newTitle ? `${newTitle} — Atelier Journal` : '');
    }
  };

  const handleExcerptChange = (newExcerpt: string) => {
    setExcerpt(newExcerpt);
    if (!seoDescription || seoDescription === excerpt) {
      setSeoDescription(newExcerpt);
    }
  };

  const insertMarkdown = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || defaultText;

    const newContent =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const cursorPosition = start + before.length + selectedText.length;
      textarea.setSelectionRange(cursorPosition, cursorPosition);
    }, 0);
  };

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTime = calculateReadTime(content);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Please enter a blog post title');
      return;
    }
    if (!content.trim()) {
      alert('Please enter some markdown content');
      return;
    }

    // Ensure slug starts with /blogs/-
    let finalSlug = slug.trim();
    if (!finalSlug.startsWith('/blogs/')) {
      finalSlug = `/blogs/${finalSlug.startsWith('-') ? finalSlug : '-' + finalSlug}`;
    }

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onSave({
      title: title.trim(),
      slug: finalSlug,
      excerpt: excerpt.trim() || title.trim(),
      content: content.trim(),
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&auto=format&fit=crop&q=80',
      category: category.trim() || 'Essays',
      tags: parsedTags.length > 0 ? parsedTags : ['Craftsmanship'],
      seoTitle: seoTitle.trim() || `${title.trim()} — Atelier Journal`,
      seoDescription: seoDescription.trim() || excerpt.trim() || title.trim(),
      linkedProductIds,
      isPublished,
    });
  };

  const toggleProductLink = (productId: string) => {
    setLinkedProductIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-b border-stone-200 bg-stone-50/70">
        <div>
          <h2 className="text-xl font-serif font-semibold text-stone-900">
            {isEditing ? 'Edit Journal Entry' : 'Write New Journal Entry'}
          </h2>
          <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
            <span className="flex items-center gap-1 font-mono">
              <FileText className="w-3.5 h-3.5" />
              {wordCount} words
            </span>
            <span>·</span>
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5" />
              {readTime} min read
            </span>
            <span>·</span>
            <span className="text-amber-800 font-mono text-[11px] truncate max-w-xs">
              {slug}
            </span>
          </div>
        </div>

        {/* View Tabs & Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Sub-tabs: Content, SEO, Products */}
          <div className="flex items-center bg-stone-200/70 p-1 rounded-lg text-xs font-medium text-stone-700">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'content'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'hover:text-stone-900'
              }`}
            >
              Post Body
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1 ${
                activeTab === 'seo'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              SEO & Social
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`px-3 py-1.5 rounded-md transition-all ${
                activeTab === 'products'
                  ? 'bg-white text-stone-900 shadow-xs font-semibold'
                  : 'hover:text-stone-900'
              }`}
            >
              Shop Tags ({linkedProductIds.length})
            </button>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="px-5 py-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors shadow-xs"
          >
            {isPublished ? 'Publish Article' : 'Save as Draft'}
          </button>
        </div>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'content' && (
        <div className="p-6 space-y-6">
          {/* Title & Slug Section */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-1">
                Article Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., The Art of Slow Craftsmanship in a Hyper-Digital Age"
                className="w-full text-xl md:text-2xl font-serif font-medium px-4 py-2.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 bg-stone-50/30"
                required
              />
            </div>

            {/* SEO Slug Config Box */}
            <div className="bg-amber-50/50 border border-amber-200/70 rounded-lg p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-medium text-amber-950 flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5 text-amber-700" />
                  SEO Canonical Slug (Format: <code className="font-mono text-amber-800 font-bold">/blogs/-post-title</code>)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setSlug(generateSlug(title));
                    setIsSlugManuallyEdited(false);
                  }}
                  className="text-[11px] text-amber-800 underline hover:text-amber-950"
                >
                  Regenerate from title
                </button>
              </div>
              <div className="mt-1 flex items-center bg-white border border-amber-200 rounded-md px-3 py-1.5 font-mono text-xs text-stone-700">
                <span className="text-stone-400 select-none">https://atelier.studio</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => {
                    setSlug(e.target.value);
                    setIsSlugManuallyEdited(true);
                  }}
                  placeholder="/blogs/-my-post-slug"
                  className="w-full ml-1 font-mono text-stone-900 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Excerpt & Meta Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-1">
                  Excerpt / Lead Paragraph
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => handleExcerptChange(e.target.value)}
                  rows={2}
                  placeholder="A concise, captivating one or two sentence summary for article listings and RSS feeds."
                  className="w-full text-sm px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 bg-stone-50/30"
                />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 bg-white"
                >
                  <option value="Essays">Essays</option>
                  <option value="Guides">Guides</option>
                  <option value="Rituals">Rituals</option>
                  <option value="Studio Stories">Studio Stories</option>
                  <option value="Design Philosophy">Design Philosophy</option>
                </select>

                <div className="mt-2">
                  <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Craft, Leather, Design"
                    className="w-full text-xs px-3 py-1.5 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                  />
                </div>
              </div>
            </div>

            {/* Cover Image URL */}
            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-stone-600 mb-1">
                Featured Cover Image URL
              </label>
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full text-xs font-mono px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
              />
            </div>
          </div>

          {/* Markdown Toolbar & Mode Switcher */}
          <div className="border border-stone-200 rounded-xl overflow-hidden bg-white shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b border-stone-200 bg-stone-50 text-stone-700">
              {/* Quick Formatting Buttons */}
              <div className="flex flex-wrap items-center gap-1">
                <button
                  type="button"
                  title="Bold (**text**)"
                  onClick={() => insertMarkdown('**', '**', 'bold text')}
                  className="p-1.5 rounded hover:bg-stone-200 transition-colors"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Italic (*text*)"
                  onClick={() => insertMarkdown('*', '*', 'italic text')}
                  className="p-1.5 rounded hover:bg-stone-200 transition-colors"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-stone-300 mx-1" />
                <button
                  type="button"
                  title="Heading 1 (# )"
                  onClick={() => insertMarkdown('# ', '', 'Heading 1')}
                  className="p-1.5 rounded hover:bg-stone-200 transition-colors"
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Heading 2 (## )"
                  onClick={() => insertMarkdown('## ', '', 'Heading 2')}
                  className="p-1.5 rounded hover:bg-stone-200 transition-colors"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Heading 3 (### )"
                  onClick={() => insertMarkdown('### ', '', 'Heading 3')}
                  className="p-1.5 rounded hover:bg-stone-200 transition-colors"
                >
                  <Heading3 className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-stone-300 mx-1" />
                <button
                  type="button"
                  title="Bullet List (- )"
                  onClick={() => insertMarkdown('- ', '', 'List item')}
                  className="p-1.5 rounded hover:bg-stone-200 transition-colors"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Numbered List (1. )"
                  onClick={() => insertMarkdown('1. ', '', 'Numbered item')}
                  className="p-1.5 rounded hover:bg-stone-200 transition-colors"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Blockquote (> )"
                  onClick={() => insertMarkdown('> ', '', 'Thoughtful quote...')}
                  className="p-1.5 rounded hover:bg-stone-200 transition-colors"
                >
                  <Quote className="w-4 h-4" />
                </button>
                <div className="h-4 w-px bg-stone-300 mx-1" />
                <button
                  type="button"
                  title="Code Block"
                  onClick={() => insertMarkdown('```markdown\n', '\n```', 'code content')}
                  className="p-1.5 rounded hover:bg-stone-200 transition-colors"
                >
                  <Code className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Insert Link"
                  onClick={() => insertMarkdown('[', '](https://example.com)', 'link text')}
                  className="p-1.5 rounded hover:bg-stone-200 transition-colors"
                >
                  <Link className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Insert Image"
                  onClick={() => insertMarkdown('![Image description](', ')', 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=800')}
                  className="p-1.5 rounded hover:bg-stone-200 transition-colors"
                >
                  <ImageIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Insert Table"
                  onClick={() => insertMarkdown('\n| Column 1 | Column 2 | Column 3 |\n| :--- | :--- | :--- |\n| Value A | Value B | Value C |\n| Value D | Value E | Value F |\n')}
                  className="p-1.5 rounded hover:bg-stone-200 transition-colors"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  title="Divider"
                  onClick={() => insertMarkdown('\n---\n')}
                  className="p-1.5 rounded hover:bg-stone-200 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              {/* Layout Mode Switcher */}
              <div className="flex items-center bg-stone-200/80 p-0.5 rounded-lg text-xs">
                <button
                  type="button"
                  onClick={() => setMode('write')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
                    mode === 'write' ? 'bg-white text-stone-900 shadow-2xs font-medium' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <PenTool className="w-3 h-3" />
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setMode('split')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
                    mode === 'split' ? 'bg-white text-stone-900 shadow-2xs font-medium' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Columns2 className="w-3 h-3" />
                  Split
                </button>
                <button
                  type="button"
                  onClick={() => setMode('preview')}
                  className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
                    mode === 'preview' ? 'bg-white text-stone-900 shadow-2xs font-medium' : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  Preview
                </button>
              </div>
            </div>

            {/* Editor Workspace */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200 min-h-[480px]">
              {/* Left: Raw Markdown Editor */}
              {(mode === 'write' || mode === 'split') && (
                <div className={`${mode === 'write' ? 'md:col-span-2' : ''} p-4 flex flex-col`}>
                  <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="# Write your essay in markdown here...

Use **bold**, *italics*, blockquotes, and lists to structure your thoughts."
                    className="w-full flex-1 font-mono text-sm text-stone-800 leading-relaxed p-2 focus:outline-none resize-y min-h-[400px] bg-transparent"
                  />
                </div>
              )}

              {/* Right: Live Preview */}
              {(mode === 'preview' || mode === 'split') && (
                <div className={`${mode === 'preview' ? 'md:col-span-2' : ''} p-6 overflow-y-auto max-h-[600px] bg-[#FBFBF9]/60`}>
                  <div className="mb-4 pb-3 border-b border-stone-200">
                    <span className="text-xs uppercase tracking-widest text-amber-800 font-medium">
                      {category} · Live Preview
                    </span>
                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mt-1">
                      {title || 'Untitled Post'}
                    </h1>
                    {excerpt && (
                      <p className="text-sm font-serif italic text-stone-600 mt-2">
                        {excerpt}
                      </p>
                    )}
                  </div>
                  <MarkdownRenderer content={content || '*Start typing on the left to see live Markdown rendering...*'} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SEO & Social Metadata Tab */}
      {activeTab === 'seo' && (
        <div className="p-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input fields */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">
                Search Engine Optimization
              </h3>
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Meta Title ({seoTitle.length}/60 chars)
                </label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Title optimized for Google search"
                  className="w-full text-sm px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Meta Description ({seoDescription.length}/160 chars)
                </label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={3}
                  placeholder="Brief compelling description for search engine results..."
                  className="w-full text-sm px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Custom SEO URL Slug
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="/blogs/-slug-title"
                  className="w-full text-sm font-mono px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-stone-400 bg-stone-50"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="w-4 h-4 text-stone-900 rounded border-stone-300 focus:ring-stone-400"
                  />
                  <span className="text-sm font-medium text-stone-800">
                    Publish immediately (indexable by search bots)
                  </span>
                </label>
              </div>
            </div>

            {/* Live Search & Social Preview Mockups */}
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">
                SERP & Social Card Previews
              </h3>

              {/* Google Snippet Preview */}
              <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-2xs">
                <span className="text-xs text-stone-400 font-medium flex items-center gap-1 mb-2">
                  <Search className="w-3 h-3 text-stone-400" /> Google Search Result
                </span>
                <div className="text-xs text-stone-600 font-mono truncate">
                  https://atelier.studio{slug}
                </div>
                <div className="text-base text-blue-800 hover:underline font-medium cursor-pointer line-clamp-1 mt-0.5">
                  {seoTitle || title || 'Post Title'}
                </div>
                <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
                  {seoDescription || excerpt || 'Search snippet description goes here...'}
                </p>
              </div>

              {/* Social Share Card Preview */}
              <div className="p-4 bg-white border border-stone-200 rounded-lg shadow-2xs">
                <span className="text-xs text-stone-400 font-medium flex items-center gap-1 mb-2">
                  <Share2 className="w-3 h-3 text-stone-400" /> OpenGraph Social Card Preview
                </span>
                <div className="border border-stone-200 rounded-md overflow-hidden bg-stone-50">
                  <div className="h-32 bg-stone-200 relative overflow-hidden">
                    {coverImage ? (
                      <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
                        No image provided
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-white">
                    <span className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">
                      ATELIER.STUDIO
                    </span>
                    <h4 className="text-sm font-serif font-bold text-stone-900 line-clamp-1">
                      {seoTitle || title || 'Post Title'}
                    </h4>
                    <p className="text-xs text-stone-500 line-clamp-1 mt-0.5">
                      {seoDescription || excerpt}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Linked Products Tab */}
      {activeTab === 'products' && (
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">
              Tag Relevant Catalog Products
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Tagged items will appear below the essay with 1-click &quot;Add to Cart&quot; buy modules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {availableProducts.map((prod) => {
              const isLinked = linkedProductIds.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  onClick={() => toggleProductLink(prod.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center gap-3 ${
                    isLinked
                      ? 'border-amber-700 bg-amber-50/50 shadow-2xs'
                      : 'border-stone-200 bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="w-12 h-12 rounded bg-stone-100 shrink-0 overflow-hidden">
                    {prod.images[0] ? (
                      <img src={prod.images[0]} alt={prod.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">
                        Item
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-stone-900 truncate">
                      {prod.title}
                    </p>
                    <p className="text-[11px] text-stone-500 font-mono tabular-nums">
                      ${prod.price.toFixed(2)} · {prod.category}
                    </p>
                  </div>
                  <div>
                    {isLinked ? (
                      <CheckCircle2 className="w-5 h-5 text-amber-700" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-stone-300" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </form>
  );
};
