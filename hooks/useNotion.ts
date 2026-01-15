import { useState, useEffect } from 'react';
import type { Project, BlogPost } from '../types';

const API_BASE = '/api';

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
        const data = await response.json();
        setProjects(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching projects:', err);
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
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching blogs:', err);
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
        const data = await response.json();
        setBlog(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('Error fetching blog:', err);
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
