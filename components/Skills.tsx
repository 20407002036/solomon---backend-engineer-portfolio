import React from 'react';

const skillCategories = [
  {
    id: "01",
    title: "Languages",
    skills: "Python · JavaScript · C# · SQL",
    subtitle: "Go · Rust on the roadmap"
  },
  {
    id: "02",
    title: "Frameworks",
    skills: "Django · Flask · FastAPI · React",
    subtitle: "Fast, reliable web primitives"
  },
  {
    id: "03",
    title: "Infra",
    skills: "Docker · Linux · Nginx · Vercel",
    subtitle: "Containered and ready to scale"
  },
  {
    id: "04",
    title: "Tooling",
    skills: "Git · Postman · Bash · Arduino",
    subtitle: "Sharper tools for low latency"
  }
];

const Skills: React.FC = () => {
  return (
    <section id="about" className="py-32 bg-background border-y border-white/[0.03]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32">
          {/* Minimal Section Info */}
          <div className="lg:w-1/3 space-y-8">
            <p className="text-[10px] font-mono text-text-muted tracking-[0.4em] uppercase">
              // STACK
            </p>
            <h2 className="text-5xl font-bold text-text-main tracking-tight">
              Tools on <br/> the path
            </h2>
            <p className="text-text-main/40 leading-relaxed font-medium">
              Boring tech where it counts, sharper tools where latency matters. 
              Always building with a security-first approach.
            </p>
          </div>

          {/* High Density Skills Grid */}
          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-20">
            {skillCategories.map((cat) => (
              <div key={cat.id} className="space-y-6">
                <div className="flex items-center gap-5">
                  <span className="text-[10px] font-mono text-primary font-bold tracking-widest">
                    [{cat.id}]
                  </span>
                  <h3 className="text-lg font-bold text-text-main uppercase tracking-[0.2em]">
                    {cat.title}
                  </h3>
                </div>
                <div className="space-y-2">
                   <p className="text-xl text-text-main/80 font-bold tracking-tight">
                     {cat.skills}
                   </p>
                   <p className="text-[10px] font-mono text-text-muted lowercase tracking-widest">
                     {cat.subtitle}
                   </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default Skills;
