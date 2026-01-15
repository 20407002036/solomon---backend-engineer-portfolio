import React from 'react';
import { Link } from 'react-router-dom';
import { useFeaturedBlogs } from '../hooks/useNotion';

const LatestPosts: React.FC = () => {
  const { blogs: featuredPosts, loading, error } = useFeaturedBlogs();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Latest Posts</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">Loading posts...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-[#1a202c] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
                <div className="h-44 bg-slate-200 dark:bg-slate-700" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                  <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || featuredPosts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-[#0d1117]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              Latest Posts
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">
              Thoughts on backend development and lessons from building production systems.
            </p>
          </div>
          <Link
            to="/blog"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View all posts
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post) => {
            const isExternal = !!post.externalUrl;

            const CardContent = (
              <>
                {/* Cover Image */}
                {post.coverImage && (
                  <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {isExternal && (
                      <div className="absolute top-3 right-3">
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-white text-[10px] font-medium">
                          <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-2 flex-grow">
                    {post.excerpt}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-auto">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {post.readingTime} min
                    </span>
                  </div>
                </div>
              </>
            );

            return isExternal ? (
              <a
                key={post.id}
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white dark:bg-[#1a202c] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
              >
                {CardContent}
              </a>
            ) : (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="group bg-white dark:bg-[#1a202c] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
              >
                {CardContent}
              </Link>
            );
          })}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View all posts
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestPosts;
