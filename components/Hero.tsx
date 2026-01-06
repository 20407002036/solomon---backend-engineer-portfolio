
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section className="w-full bg-white dark:bg-background-dark py-16 lg:py-24 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex flex-col gap-8 flex-1">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Available for Global Remote Roles
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight tracking-tight text-[#111318] dark:text-white">
                Building Scalable Systems <br className="hidden lg:block"/> & Robust APIs
              </h1>
              <h2 className="text-lg sm:text-xl font-normal leading-relaxed text-gray-600 dark:text-gray-400 max-w-2xl">
                Hi, I'm <span className="font-bold text-slate-900 dark:text-white">Solomon Kaniaru</span>, a Junior Backend Engineer based in Kenya. I specialize in building reliable, well-structured backend systems and APIs using Python (Django, Flask), with a focus on security and maintainability.
              </h2>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#projects" className="flex items-center justify-center rounded-lg h-12 px-8 bg-primary hover:bg-blue-700 text-white text-base font-bold transition-all shadow-lg shadow-blue-500/30">
                View My Work
              </a>
              <a href="#contact" className="flex items-center justify-center rounded-lg h-12 px-8 bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/20 text-slate-900 dark:text-white text-base font-bold transition-all">
                Contact Me
              </a>
            </div>
            
            <div className="pt-6 border-t border-gray-200 dark:border-gray-800 mt-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Core Technologies</p>
              <div className="flex flex-wrap gap-6 items-center grayscale opacity-60 hover:opacity-100 transition-opacity">
                {[
                  { label: 'Python', icon: 'terminal' },
                  { label: 'PostgreSQL', icon: 'database' },
                  { label: 'Django', icon: 'developer_board' },
                  { label: 'Docker', icon: 'deployed_code' },
                  { label: 'Linux', icon: 'laptop_chromebook' }
                ].map((tech) => (
                  <div key={tech.label} className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">{tech.icon}</span>
                    <span className="font-bold text-sm dark:text-gray-300">{tech.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1 w-full max-w-[500px] relative group">
             <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full blur-3xl opacity-50"></div>
             <div className="relative overflow-hidden rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800">
               <img 
                 src="/Images/DSC_6745.JPG" 
                 alt="Solomon Kaniaru" 
                 className="w-full h-auto object-cover"
               />
             </div>
             <div className="absolute -bottom-4 -right-4 bg-white dark:bg-[#1a202c] rounded-xl shadow-lg p-4 border border-gray-100 dark:border-gray-800">
               <div className="flex items-center gap-3">
                 <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Open to opportunities</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
