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
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-background-dark min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">Blog</h1>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">Loading posts...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white dark:bg-[#1a202c] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-700" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/4" />
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-background-dark min-h-screen">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load blog posts. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-background-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="mb-12">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-6"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Blog
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
            Thoughts on backend development, system design, security, and lessons learned building production systems.
          </p>
        </div>

        {/* Tag Filter */}
        <div className="mb-10">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedTag(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedTag === null
                  ? 'bg-primary text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All Posts
            </button>
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedTag === tag
                    ? 'bg-primary text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {tag}
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
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">
              No posts found with the selected tag.
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
  
  const CardWrapper = isExternal 
    ? ({ children }: { children: React.ReactNode }) => (
        <a 
          href={post.externalUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="group bg-white dark:bg-[#1a202c] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
        >
          {children}
        </a>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <Link 
          to={`/blog/${post.slug}`}
          className="group bg-white dark:bg-[#1a202c] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
        >
          {children}
        </Link>
      );

  return (
    <CardWrapper>
      {/* Cover Image */}
      {post.coverImage && (
        <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {isExternal && (
            <div className="absolute top-4 right-4">
              <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/60 text-white text-[10px] font-medium">
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                External
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-[10px] font-bold px-2 py-0.5 rounded bg-primary/10 text-primary"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 flex-grow">
          {post.excerpt}
        </p>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500 mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          <span>{formatDate(post.publishedAt)}</span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">schedule</span>
            {post.readingTime} min read
          </span>
        </div>
      </div>
    </CardWrapper>
  );
};

export default BlogList;
