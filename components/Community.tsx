import React from 'react';

const Community: React.FC = () => {
  return (
    <section id="community" className="py-32 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="space-y-24">
          
          <div className="space-y-8">
            <p className="text-[10px] font-mono text-text-muted tracking-[0.4em] uppercase">
              // LEADERSHIP
            </p>
            <h2 className="text-5xl font-bold text-text-main tracking-tight max-w-2xl">
              Building the next generation <br/> in Nairobi.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="space-y-8">
               <div className="text-primary opacity-30">
                  <span className="material-symbols-outlined text-[64px]">format_quote</span>
               </div>
               <p className="text-3xl font-medium text-text-main/80 italic leading-snug tracking-tight">
                 "True leadership in engineering isn't just about writing code—it's about lifting others up to solve complex problems together."
               </p>
               <div className="flex items-center gap-6 pt-6">
                  <div className="w-16 h-16 rounded-full overflow-hidden grayscale border border-white/10">
                     <img src="/images/DSC_6745.JPG" alt="Solomon" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-bold text-text-main">S. Kaniaru</p>
                    <p className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">Community Lead</p>
                  </div>
               </div>
            </div>

            <div className="space-y-12">
               <div className="space-y-4">
                  <h3 className="text-xl font-bold text-text-main uppercase tracking-[0.2em]">MASTERCRAFT PROGRAM</h3>
                  <p className="text-base text-text-main/40 leading-relaxed font-medium">
                    Served as Community Manager, coordinating activities and supporting learners in their journey to build backend and full-stack skills.
                  </p>
               </div>
               <div className="space-y-4">
                  <h3 className="text-xl font-bold text-text-main uppercase tracking-[0.2em]">MNU CS Club</h3>
                  <p className="text-base text-text-main/40 leading-relaxed font-medium">
                    Founding member establishing a student-led community focused on peer learning and technical workshops.
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Community;
