import React from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { Dashboard } from '../../pages/Dashboard';
import { useUIStore } from '../../store/uiStore';

export const MainLayout: React.FC = () => {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <Header />
        
        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-6 py-8">
            <Dashboard />
          </div>
        </main>
        
        <Footer />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => useUIStore.getState().toggleSidebar()}
        />
      )}
    </div>
  );
};
