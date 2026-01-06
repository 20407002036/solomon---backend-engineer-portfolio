
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-[#111827] border-t border-slate-200 dark:border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 text-center space-y-8">
        <div className="flex justify-center gap-8">
          {['Home', 'Projects', 'About', 'Contact'].map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-slate-500 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors text-sm font-semibold">
              {link}
            </a>
          ))}
        </div>
        <div className="flex justify-center gap-6">
           <a href="#" className="text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">code</span>
           </a>
           <a href="#" className="text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">business_center</span>
           </a>
           <a href="#" className="text-slate-400 hover:text-primary transition-colors">
              <span className="material-symbols-outlined">mail</span>
           </a>
        </div>
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
           <p className="text-sm text-slate-400">
             © {new Date().getFullYear()} Solomon. Based in Kenya. Engineering with integrity and scale.
           </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
