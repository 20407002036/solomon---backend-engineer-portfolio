import React from 'react';

const Contact: React.FC = () => {
  return (
    <section id="contact" className="py-40 bg-background relative overflow-hidden">
      {/* Subtle Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="space-y-20">
          {/* Section Info */}
          <div className="space-y-8">
            <p className="text-[10px] font-mono text-text-muted tracking-[0.4em] uppercase">
              // CONTACT
            </p>
            <h2 className="text-6xl md:text-8xl font-bold text-text-main tracking-tighter leading-none">
              Got a hard <br className="hidden md:block"/> backend problem?
            </h2>
            <p className="max-w-xl text-xl text-text-main/40 leading-relaxed font-medium">
              I'm open to staff-level roles and consulting on infrastructure, 
              APIs, and data pipelines. Let's build something that scales.
            </p>
          </div>

          {/* Action Buttons - Minimal like the image */}
          <div className="flex flex-wrap gap-6">
            <a 
              href="mailto:solomonkaniaru154@gmail.com" 
              className="px-10 py-5 bg-white text-black font-bold rounded-xl hover:bg-white/90 transition-all text-sm tracking-widest uppercase"
            >
              solomonkaniaru154@gmail.com
            </a>
            
            <a 
              href="https://github.com/20407002036" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-10 py-5 bg-white/[0.03] border border-white/10 text-white font-bold rounded-xl hover:bg-white/[0.08] transition-all text-sm tracking-widest uppercase"
            >
              GitHub
            </a>

            <a 
              href="https://www.linkedin.com/in/solomon-kaniaru-99bb93280/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-10 py-5 bg-white/[0.03] border border-white/10 text-white font-bold rounded-xl hover:bg-white/[0.08] transition-all text-sm tracking-widest uppercase"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
