import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useBlogs } from '../hooks/useNotion';
import { BlogPost } from '../types';

const BlogList: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const { blogs: blogPosts, loading, error } = useBlogs();
  
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogPosts.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, [blogPosts]);

  const filteredPosts = selectedTag
    ? blogPosts.filter(post => post.tags.includes(selectedTag))
    : blogPosts;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-32 bg-background min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="animate-pulse space-y-8">
            <div className="h-4 bg-surface border border-border rounded w-24"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-64 bg-surface border border-border rounded-2xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-32 bg-background min-h-screen relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* Header */}
        <div className="mb-16 space-y-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-[10px] font-mono font-bold text-primary tracking-widest hover:text-primary/80 transition-colors uppercase"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Node
          </Link>
          <div className="space-y-4">
            <p className="text-xs font-mono text-text-muted tracking-[0.2em] uppercase">
              // REPOSITORY / LOGS
            </p>
            <h1 className="text-5xl md:text-7xl font-bold text-text-main tracking-tighter">
              The Archives.
            </h1>
          </div>
        </div>

        {/* Tag Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase transition-all ${
                selectedTag === null
                  ? 'bg-primary text-white'
                  : 'bg-surface border border-border text-text-muted hover:border-primary/40'
              }`}
            >
              ALL_SYSTEMS
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase transition-all ${
                  selectedTag === tag
                    ? 'bg-primary text-white'
                    : 'bg-surface border border-border text-text-muted hover:border-primary/40'
                }`}
              >
                {tag.toUpperCase().replace(/\s+/g, '_')}
              </button>
            ))}
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <BlogCard key={post.id} post={post} formatDate={formatDate} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-24 border border-dashed border-border rounded-2xl">
            <p className="font-mono text-text-muted uppercase tracking-widest">
              No entries found in current selection.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

interface BlogCardProps {
  post: BlogPost;
  formatDate: (date: string) => string;
}

const BlogCard: React.FC<BlogCardProps> = ({ post, formatDate }) => {
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
      to={`/blog/${post.slug}`}
      className={cardClass}
    >
      {CardContent}
    </Link>
  );
};

export default BlogList;
