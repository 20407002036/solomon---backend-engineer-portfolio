import React, { useState, useMemo } from 'react';
import { useProjects } from '../hooks/useNotion';

// Live preview of a deployed project.
// Most production sites block inline framing via X-Frame-Options / CSP,
// so we render a screenshot of the live URL directly (no iframe attempt).
const LiveProjectPreview: React.FC<{ liveUrl: string; title: string }> = ({ liveUrl, title }) => {
  const shot = `https://api.microlink.io/?url=${encodeURIComponent(liveUrl)}&screenshot=true&embed=screenshot.url`;
  return (
    <div className="relative aspect-[16/9] bg-text-main/[0.03] border border-border rounded-2xl overflow-hidden mb-6">
      <img
        src={shot}
        alt={`Preview of ${title}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover object-top"
      />
      <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-[9px] font-mono rounded">
        LIVE_PREVIEW
      </span>
    </div>
  );
};

const Projects: React.FC = () => {
  const { projects, loading, error } = useProjects();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTech, setSelectedTech] = useState<string | null>(null);

  const projectList = useMemo(() => {
    return (Array.isArray(projects) ? projects : [])
      .slice()
      .sort((a, b) => {
        if ((a.featured && b.featured) || (!a.featured && !b.featured)) {
          return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
        }
        return a.featured ? -1 : 1;
      });
  }, [projects]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projectList.forEach(p => { if (p.category) set.add(p.category); });
    return Array.from(set).sort();
  }, [projectList]);

  const techs = useMemo(() => {
    const set = new Set<string>();
    projectList.forEach(p =>
      (Array.isArray(p.tech) ? p.tech : []).forEach(t => { if (t) set.add(t); })
    );
    return Array.from(set).sort();
  }, [projectList]);

  const filtered = useMemo(() => {
    return projectList.filter(p => {
      const catOk = !selectedCategory || p.category === selectedCategory;
      const techOk = !selectedTech || (Array.isArray(p.tech) && p.tech.includes(selectedTech));
      return catOk && techOk;
    });
  }, [projectList, selectedCategory, selectedTech]);

  const stats = useMemo(() => {
    let stars = 0;
    let lastPush = '';
    for (const p of filtered) {
      stars += p.stars || 0;
      if (p.updatedAt && p.updatedAt > lastPush) lastPush = p.updatedAt;
    }
    return { total: filtered.length, stars, lastPush };
  }, [filtered]);

  const formatDate = (d?: string) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  const filterChip = (active: boolean) =>
    `px-4 py-2 rounded-lg text-[10px] font-mono font-bold tracking-widest uppercase transition-all ${
      active
        ? 'bg-primary text-white'
        : 'bg-surface border border-border text-text-muted hover:border-primary/40'
    }`;

  if (loading) {
    return (
      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="animate-pulse space-y-12">
            <div className="h-4 bg-surface border border-border rounded w-24"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-surface border border-border rounded-3xl"></div>
              ))}
            </div>
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
        <div className="mb-12">
          <p className="text-[10px] font-mono text-text-muted tracking-[0.4em] uppercase">
            // DEPLOYED
          </p>
          {error && (
            <p className="mt-3 text-[9px] font-mono text-text-muted/60 uppercase tracking-[0.3em]">
              // offline — local snapshot
            </p>
          )}
        </div>

        {/* Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: 'DEPLOYED', value: String(stats.total) },
            { label: 'STARS', value: String(stats.stars) },
            { label: 'CATEGORIES', value: String(categories.length) },
            { label: 'LAST PUSH', value: stats.lastPush ? formatDate(stats.lastPush) : '—' },
          ].map((stat, i) => (
            <div key={stat.label} className="p-6 bg-surface border border-border rounded-3xl space-y-4">
              <p className="flex items-center gap-3 text-[10px] font-mono text-text-muted tracking-[0.3em] uppercase">
                <span className="text-primary font-bold">
                  [{String(i + 1).padStart(2, '0')}]
                </span>
                {stat.label}
              </p>
              <p className="text-3xl md:text-4xl font-bold text-text-main tracking-tight">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Category Filters */}
        {categories.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={filterChip(selectedCategory === null)}
            >
              ALL_SYSTEMS
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                className={filterChip(selectedCategory === cat)}
              >
                {cat.toUpperCase().replace(/\s+/g, '_')}
              </button>
            ))}
          </div>
        )}

        {/* Tech Filters */}
        {techs.length > 0 && (
          <div className="mb-20 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedTech(null)}
              className={filterChip(selectedTech === null)}
            >
              ALL_TECH
            </button>
            {techs.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTech(selectedTech === t ? null : t)}
                className={filterChip(selectedTech === t)}
              >
                {t.toUpperCase().replace(/\s+/g, '_')}
              </button>
            ))}
          </div>
        )}

        {/* High Density Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
          {filtered.map((project) => {
            // The live page URL is stored in the Notion "ImageUrl" property,
            // exposed by the backend as `imageUrl`.
            const live = project.liveUrl || project.imageUrl;
            const hasLive = !!live && live !== "/images/project-placeholder.jpg";
            return (
            <div
              key={project.id}
              className="group relative bg-surface border border-border hover:border-primary/20 rounded-[2.5rem] transition-all duration-700 overflow-hidden"
            >
              {hasLive ? (
                <LiveProjectPreview liveUrl={live} title={project.title} />
              ) : (
                <div className="relative aspect-[16/9] bg-text-main/[0.03] border-b border-border overflow-hidden mb-6">
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-[10px] font-mono text-text-muted/50 uppercase tracking-widest">
                      NO_LIVE_PREVIEW
                    </span>
                  </div>
                </div>
              )}
              <div className="p-10 space-y-8">
                {/* Meta Header */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-[10px] font-mono text-primary font-bold tracking-widest uppercase">
                      {getMethod(project.category)}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted lowercase tracking-wider truncate">
                      {getPath(project.title)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {project.category && (
                      <div className="px-3 py-1 bg-text-main/[0.03] border border-border rounded-full text-[9px] font-mono text-text-muted uppercase tracking-[0.2em]">
                        {project.category}
                      </div>
                    )}
                    <div className="px-3 py-1 bg-text-main/[0.03] border border-border rounded-full text-[9px] font-mono text-text-muted uppercase tracking-[0.2em]">
                      {project.featured ? 'FEATURED' : 'STABLE'}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-text-main group-hover:text-primary transition-colors tracking-tight">
                    {project.title}
                  </h3>
                  {project.description ? (
                    <p className="text-base text-text-main/40 leading-relaxed line-clamp-2 font-medium">
                      {project.description}
                    </p>
                  ) : (
                    <p className="text-sm font-mono text-text-muted/50 italic leading-relaxed">
                      // description pending — check the repo for details
                    </p>
                  )}
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

                {/* Footer Meta */}
                <div className="flex items-center justify-between border-t border-border/50 pt-6">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                    ★ {project.stars || 0}
                  </span>
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">
                    push {project.updatedAt ? formatDate(project.updatedAt) : '—'}
                  </span>
                </div>
              </div>

              {/* Subtle Overlay */}
              <div className="absolute inset-0 bg-primary/[0.02] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              {/* Live Site Link Overlay */}
              {hasLive ? (
                <a
                  href={live}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.title} live site`}
                  className="absolute top-8 right-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all p-3 bg-surface hover:bg-primary text-text-main hover:text-white rounded-full border border-border shadow-2xl md:translate-y-2 md:group-hover:translate-y-0"
                >
                  <span className="material-symbols-outlined text-[20px]">language</span>
                </a>
              ) : null}

              {/* GitHub Link Overlay */}
              {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${project.title} on GitHub`}
                  className={`absolute top-8 ${hasLive ? 'right-24' : 'right-8'} opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all p-3 bg-surface hover:bg-primary text-text-main hover:text-white rounded-full border border-border shadow-2xl md:translate-y-2 md:group-hover:translate-y-0`}
                >
                  <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                </a>
              ) : null}
            </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div className="text-center py-24 border border-dashed border-border rounded-[2.5rem]">
            <p className="font-mono text-text-muted uppercase tracking-widest">
              No projects match current selection.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
