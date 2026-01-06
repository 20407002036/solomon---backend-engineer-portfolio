
import React from 'react';
import { Project } from '../types';

const projects: Project[] = [
  {
    id: "1",
    title: "PropertyPulse",
    category: "Fullstack",
    description: "Rental management platform streamlining landlord-tenant interactions.",
    problem: "Traditional property management involves cumbersome paperwork, manual data entry, and fragmented communication channels between landlords and tenants.",
    approach: "Flask backend with PostgreSQL database. Implemented role-based access for landlords and tenants, lease management, maintenance request tracking, and online payment processing.",
    impact: "Streamlined rental workflows with automated notifications and centralized communication hub.",
    tech: ["Python", "Flask", "PostgreSQL", "HTML/CSS", "REST API"],
    imageUrl: "https://picsum.photos/seed/property/800/600",
    githubUrl: "https://github.com/20407002036/PropertyPulse"
  },
  {
    id: "2",
    title: "URDS-Backend",
    category: "IoT Backend",
    description: "Flask backend for IoT sensor data with automated alerting.",
    problem: "Real-time monitoring of environmental sensors requires reliable data ingestion and instant notifications when thresholds are exceeded.",
    approach: "Flask application integrated with MySQL for sensor data storage. Implemented automated SMS and email notifications via Ozeki gateway and SMTP for threshold violations.",
    impact: "24/7 monitoring with real-time alerts for environmental anomalies.",
    tech: ["Python", "Flask", "MySQL", "SMS/Email API", "IoT"],
    imageUrl: "https://picsum.photos/seed/urds/800/600",
    githubUrl: "https://github.com/20407002036/URDS-Backend"
  },
  {
    id: "3",
    title: "Mashujaa Voices",
    category: "AI/ML",
    description: "Image-to-audio storytelling application using AI services.",
    problem: "Creating accessible storytelling experiences from visual content for diverse audiences.",
    approach: "React frontend with Python backend for image analysis. Integrated language/image AI services for story generation and voice synthesis to create narrated audio from uploaded images.",
    impact: "Enables users to generate personalized audio stories from any image.",
    tech: ["TypeScript", "React", "Python", "AI/ML APIs", "Vite"],
    imageUrl: "https://picsum.photos/seed/mashujaa/800/600",
    githubUrl: "https://github.com/20407002036/mashujaa_voices"
  },
  {
    id: "4",
    title: "CashTracker",
    category: "Backend",
    description: "Personal finance tracking system with income/expense management.",
    problem: "Tracking personal finances manually is tedious and error-prone, making it hard to understand spending patterns.",
    approach: "Python CLI application with MySQL database backend. Implemented income/expense tracking with timestamps, source categorization, and net worth calculations.",
    impact: "Simplified personal finance management with automated calculations and data persistence.",
    tech: ["Python", "MySQL", "CLI", "OOP"],
    imageUrl: "https://picsum.photos/seed/cash/800/600",
    githubUrl: "https://github.com/20407002036/CashTracker"
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
