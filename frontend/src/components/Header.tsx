import React from 'react';
import { Moon, Sun, Globe, Settings } from 'lucide-react';
import { useThemeStore } from '../store/themeStore';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();

  return (
    <header className="sticky top-0 z-50 glass dark:glass-dark border-b border-gray-200/20 dark:border-gray-700/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="p-2 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Web Scraper Pro
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Powered by Crawl4AI
              </p>
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
            
            <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
