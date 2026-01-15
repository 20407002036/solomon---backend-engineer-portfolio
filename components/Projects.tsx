
import React from 'react';
import { useProjects } from '../hooks/useNotion';

const Projects: React.FC = () => {
  const { projects, loading, error } = useProjects();

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Featured Projects</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">Loading projects...</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-[#1a202c] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-700" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
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
      <section className="py-20 bg-white dark:bg-background-dark">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load projects. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-20 bg-white dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Featured Projects</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg">Case studies on solving real-world problems with production-ready code.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="group bg-white dark:bg-[#1a202c] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col">
              <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img 
                  src={project.imageUrl} 
                  alt={project.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-primary text-white text-[10px] font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 font-medium">
                  {project.description}
                </p>
                <div className="space-y-4 mb-6">
                  <div>
                    <h4 className="text-xs font-bold text-primary uppercase mb-1">The Problem</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{project.problem}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-green-600 uppercase mb-1">Impact</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{project.impact}</p>
                  </div>
                </div>
                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map(t => (
                      <span key={t} className="text-[10px] font-bold px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                        {t}
                      </span>
                    ))}
                  </div>
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all"
                  >
                    View on GitHub
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
