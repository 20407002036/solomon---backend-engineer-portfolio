import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import SecurityMindset from './components/SecurityMindset';
import Community from './components/Community';
import Contact from './components/Contact';
import Footer from './components/Footer';
import LatestPosts from './components/LatestPosts';
import BlogList from './components/BlogList';
import BlogPostPage from './components/BlogPostPage';

const HomePage: React.FC = () => {
  return (
    <main className="bg-background min-h-screen">
      <Hero />
      <Skills />
      <Projects />
      <SecurityMindset />
      <LatestPosts />
      <Community />
      <Contact />
    </main>
  );
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    
    // Auto-detect device preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if the user hasn't manually overridden it in this session
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-background text-text-main selection:bg-primary selection:text-white transition-colors duration-300">
        <Navbar onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
