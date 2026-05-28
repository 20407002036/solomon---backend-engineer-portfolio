import React from 'react';

const SecurityMindset: React.FC = () => {
  return (
    <section id="security" className="py-32 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32">
          
          <div className="lg:w-1/3 space-y-8">
            <p className="text-[10px] font-mono text-text-muted tracking-[0.4em] uppercase">
              // MINDSET
            </p>
            <h2 className="text-5xl font-bold text-text-main tracking-tight">
              Beyond code: <br/> Root causes.
            </h2>
            <p className="text-text-main/40 leading-relaxed font-medium">
              Engineering reliable systems requires the foresight to anticipate 
              vulnerabilities. I think like an attacker to build resilient defenses.
            </p>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="p-10 bg-surface border border-border rounded-[2rem] space-y-6 hover:border-primary/20 transition-all">
              <div className="text-primary opacity-80">
                <span className="material-symbols-outlined text-[36px]">terminal</span>
              </div>
              <h3 className="text-lg font-bold text-text-main uppercase tracking-[0.2em]">REVERSE ENGINEERING</h3>
              <p className="text-base text-text-main/40 leading-relaxed font-medium">
                Analyzing binary logic to identify potential exploits. 
                Familiar with Ghidra and x86 assembly basics for root cause analysis.
              </p>
            </div>

            <div className="p-10 bg-surface border border-border rounded-[2rem] space-y-6 hover:border-primary/20 transition-all">
              <div className="text-primary opacity-80">
                <span className="material-symbols-outlined text-[36px]">verified_user</span>
              </div>
              <h3 className="text-lg font-bold text-text-main uppercase tracking-[0.2em]">SECURE ARCHITECTURE</h3>
              <p className="text-base text-text-main/40 leading-relaxed font-medium">
                Implementing OWASP best practices, strict input validation, 
                and secure authentication flows as a baseline standard.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default SecurityMindset;
