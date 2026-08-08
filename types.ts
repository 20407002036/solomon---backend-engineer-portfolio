
export interface Project {
  id: string;
  title: string;
  description: string;
  problem: string;
  approach: string;
  impact: string;
  tech: string[];
  imageUrl: string;
  category: 'Backend' | 'IoT' | 'Fullstack' | 'IoT Backend' | 'AI/ML';
  link?: string;
  githubUrl?: string;
  featured?: boolean;
  sortOrder?: number;
  stars?: number;
  updatedAt?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  tags: string[];
  coverImage?: string;
  readingTime: number;
  featured?: boolean;
  content?: string;
  externalUrl?: string;
}
