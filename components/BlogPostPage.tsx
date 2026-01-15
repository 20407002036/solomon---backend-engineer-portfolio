import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBlogPost } from '../hooks/useNotion';

const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { blog: post, loading, error } = useBlogPost(slug || null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Handle external URL redirect
  useEffect(() => {
    if (post?.externalUrl) {
      window.location.href = post.externalUrl;
    }
  }, [post]);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-background-dark min-h-screen">
        <div className="max-w-3xl mx-auto px-6 lg:px-10">
          <div className="animate-pulse space-y-6">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
            <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-2xl" />
            <div className="space-y-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-background-dark min-h-screen">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <div className="mb-8">
            <span className="material-symbols-outlined text-6xl text-slate-300 dark:text-slate-600">
              article
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Post Not Found
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            The blog post you're looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Blog
          </Link>
        </div>
      </section>
    );
  }

  // Show loading state for external redirects
  if (post.externalUrl) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-background-dark min-h-screen">
        <div className="max-w-3xl mx-auto px-6 lg:px-10 text-center">
          <div className="animate-pulse mb-8">
            <span className="material-symbols-outlined text-6xl text-primary">
              open_in_new
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Redirecting...
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Taking you to the external article.
          </p>
          <a
            href={post.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Open Article
            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
          </a>
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
    <section className="py-20 bg-gray-50 dark:bg-background-dark min-h-screen">
      <article className="max-w-3xl mx-auto px-6 lg:px-10">
        {/* Back Link */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-8"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-10">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="text-xs font-bold px-3 py-1 rounded-full bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <span>{formatDate(post.publishedAt)}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              {post.readingTime} min read
            </span>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div 
          className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-a:text-primary prose-code:text-primary prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-slate-900 prose-pre:text-slate-100"
          dangerouslySetInnerHTML={{ __html: post.content || '' }}
        />

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to all posts
            </Link>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-primary border border-slate-200 dark:border-slate-700 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              Share Post
            </button>
          </div>
        </footer>
      </article>
    </section>
  );
};

export default BlogPostPage;
