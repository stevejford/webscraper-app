import React, { useState, useEffect } from 'react';
import { Palette, Sun, Moon, Monitor, Eye, Save } from 'lucide-react';

interface ThemeSettingsProps {
  onSettingsChange?: (hasChanges: boolean) => void;
}

interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  compactMode: boolean;
  animations: boolean;
  highContrast: boolean;
}

const defaultSettings: ThemeSettings = {
  mode: 'system',
  primaryColor: 'blue',
  fontSize: 'medium',
  compactMode: false,
  animations: true,
  highContrast: false
};

const colorOptions = [
  { value: 'blue', label: 'Blue', color: 'bg-blue-500' },
  { value: 'purple', label: 'Purple', color: 'bg-purple-500' },
  { value: 'green', label: 'Green', color: 'bg-green-500' },
  { value: 'red', label: 'Red', color: 'bg-red-500' },
  { value: 'orange', label: 'Orange', color: 'bg-orange-500' },
  { value: 'pink', label: 'Pink', color: 'bg-pink-500' },
  { value: 'indigo', label: 'Indigo', color: 'bg-indigo-500' },
  { value: 'teal', label: 'Teal', color: 'bg-teal-500' }
];

const fontSizeOptions = [
  { value: 'small', label: 'Small', description: 'Compact text size' },
  { value: 'medium', label: 'Medium', description: 'Default text size' },
  { value: 'large', label: 'Large', description: 'Larger text for better readability' }
];

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<ThemeSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState<'light' | 'dark'>('light');

  // Load saved settings
  useEffect(() => {
    const savedSettings = localStorage.getItem('theme_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse theme settings:', error);
      }
    }
  }, []);

  // Apply theme changes to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply color scheme
    if (settings.mode === 'dark' || (settings.mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Apply primary color
    root.style.setProperty('--primary-color', settings.primaryColor);
    
    // Apply font size
    const fontSizeMap = {
      small: '14px',
      medium: '16px',
      large: '18px'
    };
    root.style.setProperty('--base-font-size', fontSizeMap[settings.fontSize]);

    // Apply compact mode
    if (settings.compactMode) {
      root.classList.add('compact');
    } else {
      root.classList.remove('compact');
    }

    // Apply animations
    if (!settings.animations) {
      root.classList.add('no-animations');
    } else {
      root.classList.remove('no-animations');
    }

    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [settings]);

  const handleSettingChange = <K extends keyof ThemeSettings>(
    key: K,
    value: ThemeSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
    onSettingsChange?.(true);
  };

  const handleSave = () => {
    localStorage.setItem('theme_settings', JSON.stringify(settings));
    setHasChanges(false);
    onSettingsChange?.(false);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
    onSettingsChange?.(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-pink-100 rounded-lg">
          <Palette className="w-5 h-5 text-pink-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Appearance & Theme</h3>
          <p className="text-sm text-gray-600">
            Customize the look and feel of your web scraper
          </p>
        </div>
      </div>

      {/* Theme Mode */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Theme Mode</h4>
        
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'light', label: 'Light', icon: Sun, description: 'Light theme' },
            { value: 'dark', label: 'Dark', icon: Moon, description: 'Dark theme' },
            { value: 'system', label: 'System', icon: Monitor, description: 'Follow system preference' }
          ].map(({ value, label, icon: Icon, description }) => (
            <label
              key={value}
              className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                settings.mode === value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="mode"
                value={value}
                checked={settings.mode === value}
                onChange={(e) => handleSettingChange('mode', e.target.value as any)}
                className="sr-only"
              />
              <Icon className={`w-6 h-6 mb-2 ${
                settings.mode === value ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <span className="font-medium text-gray-900">{label}</span>
              <span className="text-xs text-gray-600 text-center mt-1">{description}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Primary Color */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Primary Color</h4>
        
        <div className="grid grid-cols-4 gap-3">
          {colorOptions.map((color) => (
            <label
              key={color.value}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                settings.primaryColor === color.value
                  ? 'border-gray-400 bg-gray-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="primaryColor"
                value={color.value}
                checked={settings.primaryColor === color.value}
                onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                className="sr-only"
              />
              <div className={`w-4 h-4 rounded-full ${color.color} mr-3`} />
              <span className="text-sm font-medium text-gray-900">{color.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Font Size */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Font Size</h4>
        
        <div className="space-y-3">
          {fontSizeOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                settings.fontSize === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="fontSize"
                value={option.value}
                checked={settings.fontSize === option.value}
                onChange={(e) => handleSettingChange('fontSize', e.target.value as any)}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{option.label}</span>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    settings.fontSize === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {settings.fontSize === option.value && (
                      <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mt-1">{option.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Accessibility & Preferences */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Accessibility & Preferences</h4>
        
        <div className="space-y-3">
          {[
            { 
              key: 'compactMode', 
              label: 'Compact mode', 
              description: 'Reduce spacing and padding for more content' 
            },
            { 
              key: 'animations', 
              label: 'Enable animations', 
              description: 'Show smooth transitions and animations' 
            },
            { 
              key: 'highContrast', 
              label: 'High contrast mode', 
              description: 'Increase contrast for better visibility' 
            }
          ].map(({ key, label, description }) => (
            <label key={key} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings[key as keyof ThemeSettings] as boolean}
                onChange={(e) => handleSettingChange(key as keyof ThemeSettings, e.target.checked as any)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-0.5"
              />
              <div className="flex-1">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <p className="text-xs text-gray-600 mt-1">{description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-md font-medium text-gray-900">Preview</h4>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setPreviewMode('light')}
              className={`p-2 rounded-lg ${previewMode === 'light' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('dark')}
              className={`p-2 rounded-lg ${previewMode === 'dark' ? 'bg-blue-100 text-blue-600' : 'text-gray-400'}`}
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className={`p-6 rounded-lg border-2 border-gray-200 ${
          previewMode === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
        }`}>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-lg bg-${settings.primaryColor}-500`} />
              <div>
                <h5 className="font-semibold">Web Scraper Dashboard</h5>
                <p className="text-sm opacity-75">Preview of your theme settings</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className={`p-3 rounded-lg ${previewMode === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className="text-sm font-medium">Sessions</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className={`p-3 rounded-lg ${previewMode === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className="text-sm font-medium">Files</p>
                <p className="text-2xl font-bold">1,247</p>
              </div>
              <div className={`p-3 rounded-lg ${previewMode === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <p className="text-sm font-medium">Storage</p>
                <p className="text-2xl font-bold">2.4 GB</p>
              </div>
            </div>

            <button className={`px-4 py-2 rounded-lg bg-${settings.primaryColor}-500 text-white text-sm font-medium`}>
              Start New Session
            </button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Reset to Defaults
        </button>
        
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-pink-600 rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Theme</span>
        </button>
      </div>
    </div>
  );
};
