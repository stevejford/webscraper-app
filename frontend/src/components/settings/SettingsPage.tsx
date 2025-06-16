import React, { useState } from 'react';
import { Settings, Key, Palette, Database, Download, Bell, Shield } from 'lucide-react';
import { APIKeySettings } from './APIKeySettings';
import { ChatPreferences } from './ChatPreferences';
import { StorageSettings } from './StorageSettings';
import { ThemeSettings } from './ThemeSettings';
import { ExportSettings } from './ExportSettings';

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  component: React.ComponentType<any>;
}

const settingsTabs: SettingsTab[] = [
  {
    id: 'api',
    label: 'API Configuration',
    icon: Key,
    component: APIKeySettings
  },
  {
    id: 'chat',
    label: 'Chat Preferences',
    icon: Settings,
    component: ChatPreferences
  },
  {
    id: 'storage',
    label: 'Storage & Files',
    icon: Database,
    component: StorageSettings
  },
  {
    id: 'theme',
    label: 'Appearance',
    icon: Palette,
    component: ThemeSettings
  },
  {
    id: 'export',
    label: 'Export & Import',
    icon: Download,
    component: ExportSettings
  }
];

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('api');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const activeTabData = settingsTabs.find(tab => tab.id === activeTab);
  const ActiveComponent = activeTabData?.component;

  const handleTabChange = (tabId: string) => {
    if (hasUnsavedChanges) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Are you sure you want to leave this tab?'
      );
      if (!confirmLeave) return;
    }
    
    setActiveTab(tabId);
    setHasUnsavedChanges(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Settings className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-600">
                  Configure your web scraper and chat assistant
                </p>
              </div>
            </div>
            
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-lg">
                <Bell className="w-4 h-4" />
                <span className="text-sm font-medium">Unsaved changes</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                  Configuration
                </h2>
              </div>
              
              <div className="p-2">
                {settingsTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className="text-sm font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* Quick Stats */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">API Status</span>
                  <span className="text-green-600 font-medium">Connected</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Storage Used</span>
                  <span className="text-gray-900 font-medium">2.4 GB</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sessions</span>
                  <span className="text-gray-900 font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Files Processed</span>
                  <span className="text-gray-900 font-medium">1,247</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Tab Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  {activeTabData && (
                    <>
                      <activeTabData.icon className="w-5 h-5 text-gray-600" />
                      <h2 className="text-lg font-semibold text-gray-900">
                        {activeTabData.label}
                      </h2>
                    </>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {ActiveComponent && (
                  <ActiveComponent
                    onSettingsChange={(hasChanges: boolean) => setHasUnsavedChanges(hasChanges)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Privacy & Security</p>
              <p>
                All settings are stored locally in your browser. API keys and sensitive data 
                are encrypted and never transmitted to our servers. Your scraped content 
                remains private and under your control.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
