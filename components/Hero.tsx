import React, { useState } from 'react';

const Hero: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-12">
      {/* Subtle Background Grid */}
      <div className="absolute inset-0 bg-grid opacity-[0.03] pointer-events-none"></div>
      
      {/* Background Glow */}
      <div className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-32">
          
          {/* Text Content */}
          <div className="flex-1 space-y-12">
            <div className="space-y-6">
              <h1 className="text-7xl md:text-9xl font-bold tracking-tighter leading-none flex flex-col">
                <span className="text-text-main">Solomon</span>
                <span className="text-text-main opacity-10">Kaniaru.</span>
              </h1>
              
              <p className="text-xs md:text-sm font-mono text-text-muted tracking-[0.2em] uppercase">
                Backend engineer · distributed systems · APIs that don't fall over.
              </p>
            </div>
            
            <p className="max-w-md text-lg text-text-main/50 leading-relaxed font-medium">
              I build resilient server-side infrastructure for products that 
              need to scale quietly. Go and Rust on the hot path, Postgres 
              at the core, observability everywhere.
            </p>
            
            <div className="flex items-center gap-10">
              <a 
                href="#projects" 
                className="px-10 py-4 bg-primary hover:bg-primary/80 text-white font-bold rounded-lg transition-all text-sm tracking-wider"
              >
                See projects
              </a>
              <a 
                href="#contact" 
                className="group flex items-center gap-3 text-sm font-bold tracking-widest text-text-main hover:text-primary transition-colors uppercase"
              >
                Get in touch —
              </a>
            </div>
            
            <p className="text-[10px] font-mono text-text-muted italic opacity-50 tracking-widest">
              ↳ Grab the badge and let it swing.
            </p>
          </div>

          {/* Interactive Dev Card with Lanyard */}
          <div className="flex-1 relative flex justify-center pt-24">
            
            {/* Lanyard Strap - The defining visual from the image */}
            <div className="absolute -top-[500px] left-1/2 -translate-x-1/2 w-8 h-[500px] bg-primary shadow-2xl z-30">
               {/* Lanyard Metal Grommet */}
               <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#111] border-2 border-white/20 shadow-inner"></div>
            </div>

            <div 
              className={`relative w-80 h-[500px] transition-all duration-700 ease-out transform perspective-2000 ${
                isHovered ? 'rotate-y-12 rotate-x-6 scale-105' : ''
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Card Body - True Black like the image */}
              <div className="absolute inset-0 bg-[#050505] border border-white/10 rounded-3xl overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] flex flex-col">
                
                {/* Badge Header */}
                <div className="h-14 border-b border-white/5 flex items-center px-6 justify-between bg-white/[0.02]">
                  <span className="text-[10px] font-mono text-text-muted uppercase tracking-[0.2em]">dev.server</span>
                  <span className="text-xl font-bold text-primary">S</span>
                </div>
                
                {/* Content */}
                <div className="p-5 space-y-8">
                  {/* Portrait - Large and Grayscale */}
                  <div className="relative aspect-square bg-white/[0.03] rounded-2xl overflow-hidden grayscale">
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
                    <img 
                      src="/images/DSC_6745.JPG" 
                      alt="Solomon" 
                      className="w-full h-full object-cover opacity-80"
                    />
                  </div>
                  
                  {/* Metadata Box - High Density detail */}
                  <div className="bg-white/[0.05] rounded-xl p-5 border border-white/5 space-y-5">
                    <div className="space-y-1">
                      <p className="text-[8px] font-mono text-text-muted uppercase tracking-[0.2em]">Role</p>
                      <p className="text-xs font-bold text-white uppercase tracking-widest">Backend Engineer</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[8px] font-mono text-text-muted uppercase tracking-[0.2em]">Name</p>
                        <p className="text-[10px] font-mono text-white">S. KANIARU</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-mono text-text-muted uppercase tracking-[0.2em]">Sector</p>
                        <p className="text-[10px] font-mono text-white">01</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-mono text-text-muted uppercase tracking-[0.2em]">Stack</p>
                        <p className="text-[10px] font-mono text-white uppercase">PY-DJO-DOCK</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-mono text-text-muted uppercase tracking-[0.2em]">Badge</p>
                        <p className="text-[10px] font-mono text-white">881999951</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Decoration */}
                <div className="absolute bottom-6 right-6 opacity-40">
                   <div className="grid grid-cols-4 gap-0.5">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className={`w-1.5 h-1.5 ${Math.random() > 0.4 ? 'bg-white' : 'bg-transparent border border-white/10'}`}></div>
                      ))}
                   </div>
                </div>
              </div>
              
              {/* Card Connection Hardware */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-4 border-white/10 bg-[#050505] z-40 flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;
