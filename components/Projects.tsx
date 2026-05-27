import React from 'react';
import { useProjects } from '../hooks/useNotion';

const Projects: React.FC = () => {
  const { projects, loading, error } = useProjects();

  const projectList = Array.isArray(projects) ? projects : [];

  const getMethod = (category: string) => {
    switch (category.toLowerCase()) {
      case 'iot': return 'STREAM';
      case 'backend': return 'POST';
      case 'ai/ml': return 'RUN';
      default: return 'GET';
    }
  };

  const getPath = (title: string) => {
    return `/${title.toLowerCase().replace(/\s+/g, '-')}`;
  };

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="animate-pulse space-y-12">
            <div className="h-4 bg-surface border border-border rounded w-24"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-72 bg-surface border border-border rounded-3xl"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-32 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        
        {/* Minimal Code-Comment Header */}
        <div className="mb-20">
          <p className="text-[10px] font-mono text-text-muted tracking-[0.4em] uppercase">
            // DEPLOYED
          </p>
        </div>

        {/* High Density Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {projectList.map((project) => (
            <div 
              key={project.id} 
              className="group relative bg-surface border border-border hover:border-primary/20 rounded-[2.5rem] transition-all duration-700 overflow-hidden"
            >
              <div className="p-10 space-y-8">
                {/* Meta Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono text-primary font-bold tracking-widest uppercase">
                      {getMethod(project.category)}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted lowercase tracking-wider">
                      {getPath(project.title)}
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-text-main/[0.03] border border-border rounded-full text-[9px] font-mono text-text-muted uppercase tracking-[0.2em]">
                    STABLE
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-text-main group-hover:text-primary transition-colors tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-base text-text-main/40 leading-relaxed line-clamp-2 font-medium">
                    {project.description}
                  </p>
                </div>

                {/* Tech Stack - Horizontal pills */}
                <div className="flex flex-wrap gap-3 pt-6">
                  {(Array.isArray(project.tech) ? project.tech : []).map((t) => (
                    <span 
                      key={t} 
                      className="text-[9px] font-mono font-bold tracking-widest text-text-muted uppercase px-3 py-1.5 bg-text-main/[0.02] rounded-lg border border-border group-hover:border-primary/10 transition-colors"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
              
              {/* GitHub Link Overlay */}
              <a 
                href={project.githubUrl || '#'} 
                target="_blank" 
                rel="noopener noreferrer"
                className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all p-3 bg-surface hover:bg-primary text-text-main hover:text-white rounded-full border border-border shadow-2xl translate-y-2 group-hover:translate-y-0"
              >
                 <span className="material-symbols-outlined text-[20px]">open_in_new</span>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
