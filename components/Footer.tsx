import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col md:flex-row items-center justify-between gap-6 font-mono">
        <div className="text-[10px] text-text-muted uppercase tracking-widest">
          © {new Date().getFullYear()} · dev.server · Solomon Kaniaru
        </div>
        
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] text-text-muted uppercase tracking-[0.2em]">uptime 99.98%</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
