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
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="animate-pulse space-y-8">
            <div className="h-4 bg-surface border border-border rounded w-24"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 bg-surface border border-border rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || featuredPosts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-24 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-16">
          <div className="space-y-4">
            <p className="text-xs font-mono text-text-muted tracking-[0.2em] uppercase">
              // WRITINGS
            </p>
            <h2 className="text-4xl font-bold text-text-main tracking-tight">
              Latest Posts
            </h2>
          </div>
          <Link
            to="/blog"
            className="hidden sm:inline-flex items-center gap-2 text-xs font-mono font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest"
          >
            All Logs
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post) => {
            const isExternal = !!post.externalUrl;
            
            const cardClass = "group relative bg-surface border border-border hover:border-primary/40 rounded-2xl transition-all duration-500 overflow-hidden flex flex-col h-full";
            
            const CardContent = (
              <div className="p-8 flex flex-col h-full space-y-6">
                {/* Meta */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-primary font-bold tracking-widest uppercase">
                    LOG_{post.id.substring(0, 4)}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted uppercase">
                    {formatDate(post.publishedAt)}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-text-main group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-text-muted leading-relaxed line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>

                {/* Bottom Meta */}
                <div className="pt-4 flex items-center justify-between border-t border-border/50 group-hover:border-primary/20 transition-colors">
                  <div className="flex gap-2">
                    {post.tags.slice(0, 2).map(t => (
                      <span key={t} className="text-[9px] font-mono text-text-muted/60 uppercase">#{t}</span>
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-text-muted">
                    {post.readingTime}m_read
                  </span>
                </div>
              </div>
            );

            return isExternal ? (
              <a
                key={post.id}
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cardClass}
              >
                {CardContent}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="material-symbols-outlined text-primary text-[18px]">open_in_new</span>
                </div>
              </a>
            ) : (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className={cardClass}
              >
                {CardContent}
              </Link>
            );
          })}
        </div>

        {/* Mobile View All */}
        <div className="mt-12 text-center sm:hidden">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono font-bold text-primary"
          >
            VIEW ALL LOGS
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestPosts;
