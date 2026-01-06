
import React from 'react';
import { SkillCategory } from '../types';

const skillCategories: SkillCategory[] = [
  {
    title: "Backend & APIs",
    icon: "api",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    skills: ["Python", "Django / DRF", "Flask", "FastAPI", "RESTful Design", "NLP (spaCy)", "Authentication (JWT/OAuth)"]
  },
  {
    title: "Databases",
    icon: "database",
    color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
    skills: ["PostgreSQL", "MySQL", "SQLite", "Redis", "SQLAlchemy", "Supabase"]
  },
  {
    title: "DevOps & Tooling",
    icon: "terminal",
    color: "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    skills: ["Git & GitHub", "Linux (Ubuntu)", "Docker", "Postman", "CI/CD Concepts", "Arduino / ESP32"]
  },
  {
    title: "Supporting Skills",
    icon: "web",
    color: "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
    skills: ["Blazor (MudBlazor)", "React (API Driven)", ".NET MAUI", "Kotlin (Basics)", "Tailwind CSS"]
  }
];

const Skills: React.FC = () => {
  return (
    <section className="py-20 bg-background-light dark:bg-[#111827]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Technical Expertise</h2>
          <p className="mt-4 text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
            A comprehensive breakdown of my backend-heavy technical toolkit, focusing on robust data processing and API reliability.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skillCategories.map((cat) => (
            <div key={cat.title} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-[#151c2a] transition-all hover:-translate-y-1 hover:shadow-md">
              <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
                <div className={`flex size-10 items-center justify-center rounded-full ${cat.color}`}>
                  <span className="material-symbols-outlined">{cat.icon}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cat.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span key={skill} className="inline-flex items-center rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors hover:border-primary/50">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
