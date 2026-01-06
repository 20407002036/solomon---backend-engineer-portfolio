
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Skills from './components/Skills';
import Projects from './components/Projects';
import SecurityMindset from './components/SecurityMindset';
import Community from './components/Community';
import Contact from './components/Contact';
import Footer from './components/Footer';

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
    <div className="flex flex-col min-h-screen">
      <Navbar onToggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <main>
        <div id="home"><Hero /></div>
        <div id="about"><Skills /></div>
        <div id="projects"><Projects /></div>
        <div id="security"><SecurityMindset /></div>
        <div id="community"><Community /></div>
        <div id="contact"><Contact /></div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
