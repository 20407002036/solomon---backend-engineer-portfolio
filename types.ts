
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
}

export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
  color: string;
}
