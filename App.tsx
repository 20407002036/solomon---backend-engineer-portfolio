
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
    <main>
      <div id="home"><Hero /></div>
      <div id="about"><Skills /></div>
      <div id="projects"><Projects /></div>
      <div id="security"><SecurityMindset /></div>
      <div id="blog"><LatestPosts /></div>
      <div id="community"><Community /></div>
      <div id="contact"><Contact /></div>
    </main>
  );
};

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
