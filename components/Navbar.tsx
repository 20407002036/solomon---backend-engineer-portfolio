
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  onToggleTheme: () => void;
  isDarkMode: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onToggleTheme, isDarkMode }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const navItems = ['Home', 'About', 'Projects', 'Security', 'Blog', 'Community', 'Contact'];

  const handleNavClick = (item: string) => {
    if (item === 'Blog' && isHomePage) {
      // On homepage, scroll to blog section or navigate to /blog
      return;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-[#101622]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-8 flex items-center justify-center bg-primary rounded text-white font-bold text-lg">
            S
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight dark:text-white">Solomon_</h2>
        </Link>
        
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            // Blog link goes to /blog route
            if (item === 'Blog') {
              return (
                <Link
                  key={item}
                  to="/blog"
                  className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
                >
                  {item}
                </Link>
              );
            }
            
            // Other links: if on homepage, use anchor; if on other page, go to home with anchor
            const href = isHomePage ? `#${item.toLowerCase()}` : `/#${item.toLowerCase()}`;
            
            return (
              <a 
                key={item}
                href={href}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors"
              >
                {item}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <a href={import.meta.env.VITE_RESUME_URL || '#'} download className="hidden sm:flex items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-blue-700 transition-colors text-white text-sm font-bold shadow-sm shadow-blue-500/20">
            Download Resume
          </a>
          <button className="md:hidden p-2 text-gray-700 dark:text-gray-300">
            <span className="material-symbols-outlined">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
