import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleTheme, isDarkMode }) => {
  const navItems = [
    { label: 'WORK', href: '/#projects' },
    { label: 'STACK', href: '/#about' },
    { label: 'CONTACT', href: '/#contact' }
  ];

  return (
    <header className="fixed top-0 z-50 w-full h-20 flex items-center bg-transparent">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full flex items-center justify-between">
        
        {/* Minimal dot logo */}
        <Link to="/" className="group flex items-center">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
        </Link>
        
        {/* Minimal Uppercase Nav */}
        <nav className="flex items-center gap-10">
          {navItems.map((item) => (
            <a 
              key={item.label}
              href={item.href}
              className="text-[10px] font-bold text-text-muted hover:text-text-main transition-colors tracking-[0.3em] font-mono"
            >
              {item.label}
            </a>
          ))}
          
          {/* Theme Toggle - subtle */}
          <button 
            onClick={onToggleTheme}
            className="text-text-muted hover:text-text-main transition-colors ml-4"
            aria-label="Toggle theme"
          >
             <span className="material-symbols-outlined text-[18px]">
               {isDarkMode ? 'light_mode' : 'dark_mode'}
             </span>
          </button>
        </nav>

      </div>
    </header>
  );
};

export default Navbar;
