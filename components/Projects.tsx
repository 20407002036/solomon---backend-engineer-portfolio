
import React from 'react';
import { Project } from '../types';

const projects: Project[] = [
  {
    id: "1",
    title: "ATS_Proto",
    category: "Fullstack",
    description: "Hybrid Applicant Tracking System prototype for automated resume screening.",
    problem: "Recruiters spend an average of 7.4 seconds scanning a resume. Manual volume screening leads to fatigue and missing top candidates.",
    approach: "Decoupled architecture: Blazor WASM frontend for the dashboard, Python/FastAPI microservice with spaCy NLP for entity extraction (PERSON, ORG, SKILLS).",
    impact: "40% reduction in initial screening time with 90% accuracy in skill identification.",
    tech: ["Blazor (C#)", "Python", "spaCy NLP", "FastAPI", "PostgreSQL"],
    imageUrl: "https://picsum.photos/seed/ats/800/600"
  },
  {
    id: "2",
    title: "Carebook Backend",
    category: "Backend",
    description: "Django-based healthcare system with secure data management.",
    problem: "Managing medical records securely with role-based access for patients and doctors, while ensuring HIPAA compliance.",
    approach: "Django REST Framework with JWT authentication, custom middleware for role validation, and email verification for onboarding.",
    impact: "Successfully handled 100+ concurrent requests in testing with optimized database queries.",
    tech: ["Django", "PostgreSQL", "JWT", "Redis"],
    imageUrl: "https://picsum.photos/seed/carebook/800/600"
  },
  {
    id: "3",
    title: "IoT Sensor Data Pipeline",
    category: "IoT",
    description: "Real-time monitoring system for environmental sensors.",
    problem: "Ingesting and visualizing data from distributed ESP32 modules without high latency or data loss.",
    approach: "Flask backend integrated with MySQL. Implemented automated SMS/Email alerting system for threshold violations using background tasks.",
    impact: "Provides 24/7 monitoring with less than 2-second alert latency.",
    tech: ["Flask", "MySQL", "Arduino/ESP", "Twilio API"],
    imageUrl: "https://picsum.photos/seed/iot/800/600"
  }
];

const Projects: React.FC = () => {
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
                  <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border border-primary text-primary font-bold text-sm hover:bg-primary hover:text-white transition-all">
                    View Details
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
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
