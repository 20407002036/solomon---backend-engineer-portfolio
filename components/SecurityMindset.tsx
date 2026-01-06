
import React from 'react';

const SecurityMindset: React.FC = () => {
  return (
    <section className="py-20 bg-background-light dark:bg-[#111827]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col gap-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-px w-8 bg-primary"></span>
              <span className="text-sm font-bold uppercase tracking-widest text-primary">Security-First Mindset</span>
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
              Beyond the Code: Finding <span className="text-primary">Root Causes</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Engineering reliable backend systems requires the foresight to anticipate vulnerabilities. My background in CTFs and reverse engineering allows me to think like an attacker to build more resilient defenses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div className="bg-white dark:bg-[#151c2a] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                  <span className="material-symbols-outlined text-[28px]">terminal</span>
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">Reverse Engineering</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Experience analyzing binary logic to identify potential exploits. Familiar with tools like Ghidra and x86 assembly basics.
                </p>
             </div>
             <div className="bg-white dark:bg-[#151c2a] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                  <span className="material-symbols-outlined text-[28px]">bug_report</span>
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">Debugging Workflow</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Rigorous root cause analysis. I don't just patch symptoms; I dive into logs and stack traces to ensure bugs never recur.
                </p>
             </div>
             <div className="bg-white dark:bg-[#151c2a] p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                <div className="mb-6 flex size-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                  <span className="material-symbols-outlined text-[28px]">verified_user</span>
                </div>
                <h3 className="text-xl font-bold mb-3 dark:text-white">Secure Architecture</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  Implementing OWASP best practices, strict input validation, and secure authentication flows as standard procedure.
                </p>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecurityMindset;
