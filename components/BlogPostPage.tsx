import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBlogPost } from '../hooks/useNotion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { blog: post, loading, error } = useBlogPost(slug || null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (post?.externalUrl) {
      window.location.href = post.externalUrl;
    }
  }, [post]);

  if (loading) {
    return (
      <section className="py-32 bg-background min-h-screen">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="animate-pulse space-y-8">
            <div className="h-4 bg-surface border border-border rounded w-24"></div>
            <div className="h-12 bg-surface border border-border rounded w-3/4"></div>
            <div className="h-4 bg-surface border border-border rounded w-1/4"></div>
            <div className="h-64 bg-surface border border-border rounded-2xl"></div>
            <div className="space-y-4">
               <div className="h-4 bg-surface border border-border rounded w-full"></div>
               <div className="h-4 bg-surface border border-border rounded w-full"></div>
               <div className="h-4 bg-surface border border-border rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !post) {
    const isNotFound = (error || '').toLowerCase().includes('not found');
    return (
      <section className="py-32 bg-background min-h-screen">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center space-y-8">
          <p className="text-[10px] font-mono text-primary font-bold tracking-[0.2em] uppercase">
            {isNotFound ? '// ERROR: NOT_FOUND' : '// ERROR: OFFLINE'}
          </p>
          <h1 className="text-4xl font-bold text-text-main">
            {isNotFound ? 'Post not in archives.' : 'Log temporarily unavailable.'}
          </h1>
          {!isNotFound && (
            <p className="text-sm text-text-muted max-w-md mx-auto leading-relaxed">
              The backend is not responding right now. Try again in a bit.
            </p>
          )}
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-bold"
          >
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <section className="py-32 bg-background min-h-screen relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid pointer-events-none"></div>

      <article className="max-w-3xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-primary tracking-widest hover:text-primary/80 transition-colors uppercase mb-12"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          Back to Archives
        </Link>

        {/* Header */}
        <header className="mb-16 space-y-8">
          <div className="space-y-4">
             <p className="text-[10px] font-mono text-primary font-bold tracking-widest uppercase">
                LOG_{post.id.substring(0, 4)} // {formatDate(post.publishedAt)}
             </p>
             <h1 className="text-4xl md:text-5xl font-bold text-text-main tracking-tight leading-tight">
               {post.title}
             </h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="text-[9px] font-mono font-bold tracking-widest text-text-muted/60 uppercase px-2 py-1 bg-surface border border-border rounded"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-16 rounded-2xl overflow-hidden border border-border grayscale hover:grayscale-0 transition-all duration-700">
            <img
              src={post.coverImage}
              alt={post.title}
              onError={(e) => {
                e.currentTarget.src = '/images/blog-placeholder.svg';
              }}
              className="w-full h-auto object-cover max-h-[400px]"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-text-main prose-p:text-text-main/70 prose-a:text-primary prose-code:text-primary prose-code:bg-surface prose-pre:bg-surface prose-pre:border prose-pre:border-border prose-img:rounded-2xl">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ node, ...props }) => (
                // eslint-disable-next-line jsx-a11y/alt-text
                <img
                  {...props}
                  onError={(e) => {
                    e.currentTarget.src = '/images/blog-placeholder.svg';
                  }}
                />
              ),
            }}
          >
            {post.content || ''}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            to="/blog"
            className="text-[10px] font-mono font-bold text-text-muted hover:text-primary transition-colors tracking-widest uppercase"
          >
            ← Close Log
          </Link>
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
            }}
            className="px-6 py-2 text-[10px] font-mono font-bold text-text-muted border border-border rounded hover:border-primary transition-all uppercase tracking-widest"
          >
            Share_Entry
          </button>
        </footer>
      </article>
    </section>
  );
};

export default BlogPostPage;
