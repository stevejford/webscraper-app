import React from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../store/themeStore';
import Header from '../components/Header';
import ScrapeForm from '../components/ScrapeForm';
import ResultsPanel from '../components/ResultsPanel';
import SessionHistory from '../components/SessionHistory';
import { useScrapeStore } from '../store/scrapeStore';

const MainLayout: React.FC = () => {
  const { darkMode } = useThemeStore();
  const { currentSession } = useScrapeStore();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input & Configuration */}
          <div className="lg:col-span-1 space-y-6">
            <ScrapeForm />
            <SessionHistory />
          </div>
          
          {/* Right Column - Results */}
          <div className="lg:col-span-2">
            <ResultsPanel />
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
