import { useState, useEffect } from 'react';
import type { Project, BlogPost } from '../types';
import { projects as fallbackProjects } from '../data/projects';
import { blogPosts as fallbackBlogs } from '../data/blogs';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper to safely parse JSON response
async function safeJsonParse<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Invalid JSON response: ${text.substring(0, 100)}...`);
  }
}

// Hook to fetch projects from Notion via serverless function
export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch(`${API_BASE}/projects`);
        if (!response.ok) throw new Error('Failed to fetch projects');
        const data = await safeJsonParse<Project[]>(response);
        setProjects(data);
      } catch (err) {
        // Fall back to local data in development
        console.warn('API unavailable, using fallback data:', err);
        setProjects(fallbackProjects);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return { projects, loading, error };
}

// Hook to fetch all blogs from Notion
export function useBlogs() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const response = await fetch(`${API_BASE}/blogs`);
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const data = await safeJsonParse<BlogPost[]>(response);
        setBlogs(data);
      } catch (err) {
        // Fall back to local data in development
        console.warn('API unavailable, using fallback data:', err);
        setBlogs(fallbackBlogs);
      } finally {
        setLoading(false);
      }
    }

    fetchBlogs();
  }, []);

  return { blogs, loading, error };
}

// Hook to fetch a single blog post with full content
export function useBlogPost(slug: string | null) {
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    async function fetchBlog() {
      try {
        const response = await fetch(`${API_BASE}/blogs/${slug}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error('Blog post not found');
          throw new Error('Failed to fetch blog post');
        }
        const data = await safeJsonParse<BlogPost>(response);
        setBlog(data);
      } catch (err) {
        // Fall back to local data in development
        console.warn('API unavailable, using fallback data:', err);
        const fallbackBlog = fallbackBlogs.find(b => b.slug === slug);
        if (fallbackBlog) {
          setBlog(fallbackBlog);
        } else {
          setError('Blog post not found');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [slug]);

  return { blog, loading, error };
}

// Hook to fetch featured blogs only
export function useFeaturedBlogs() {
  const { blogs, loading, error } = useBlogs();
  const featuredBlogs = blogs.filter((blog) => blog.featured).slice(0, 3);
  
  return { blogs: featuredBlogs, loading, error };
}
