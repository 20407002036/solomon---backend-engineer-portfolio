
import React from 'react';

const Community: React.FC = () => {
  return (
    <section className="py-20 bg-white dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Leadership & Community</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Passionate about empowering the next generation of developers in Nairobi and beyond.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/5 to-transparent p-8 md:p-12 border border-primary/10">
            <span className="material-symbols-outlined absolute top-4 left-4 text-4xl text-primary/20 rotate-180">format_quote</span>
            <blockquote className="relative z-10 text-center">
              <p className="text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-200 italic mb-8">
                "True leadership in engineering isn't just about writing the best code—it's about lifting others up to solve complex problems together."
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                   <img src="https://picsum.photos/seed/solomon/100/100" alt="Solomon" className="w-full h-full object-cover" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 dark:text-white">Solomon</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Community Lead & Mentor</p>
                </div>
              </div>
            </blockquote>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
           <div className="flex gap-4 items-start p-6 rounded-xl border border-slate-100 dark:border-slate-800">
             <div className="p-3 rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
               <span className="material-symbols-outlined">groups</span>
             </div>
             <div>
               <h3 className="font-bold dark:text-white">GDG Nairobi Involvement</h3>
               <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                 Actively participating and coordinating technical workshops for 200+ developers on backend and cloud technologies.
               </p>
             </div>
           </div>
           <div className="flex gap-4 items-start p-6 rounded-xl border border-slate-100 dark:border-slate-800">
             <div className="p-3 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
               <span className="material-symbols-outlined">school</span>
             </div>
             <div>
               <h3 className="font-bold dark:text-white">University Mentorship</h3>
               <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                 Mentoring junior students on software engineering best practices, career paths, and technical interviews.
               </p>
             </div>
           </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
