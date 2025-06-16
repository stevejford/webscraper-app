import React, { useState, useEffect } from 'react';
import { MessageSquare, Sliders, Brain, Zap, Info, Save } from 'lucide-react';

interface ChatPreferencesProps {
  onSettingsChange?: (hasChanges: boolean) => void;
}

interface ChatSettings {
  model: string;
  temperature: number;
  maxTokens: number;
  contextLength: number;
  responseStyle: 'concise' | 'detailed' | 'technical';
  includeSourceUrls: boolean;
  showConfidenceScores: boolean;
  enableFollowUpSuggestions: boolean;
  searchThreshold: number;
  maxSources: number;
}

const defaultSettings: ChatSettings = {
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 1000,
  contextLength: 4000,
  responseStyle: 'detailed',
  includeSourceUrls: true,
  showConfidenceScores: true,
  enableFollowUpSuggestions: true,
  searchThreshold: 0.7,
  maxSources: 5
};

const modelOptions = [
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', description: 'Fast and cost-effective' },
  { value: 'gpt-4', label: 'GPT-4', description: 'Most capable, higher cost' },
  { value: 'gpt-4-turbo', label: 'GPT-4 Turbo', description: 'Latest model with improved performance' }
];

const responseStyleOptions = [
  { value: 'concise', label: 'Concise', description: 'Brief, to-the-point answers' },
  { value: 'detailed', label: 'Detailed', description: 'Comprehensive explanations' },
  { value: 'technical', label: 'Technical', description: 'In-depth technical analysis' }
];

export const ChatPreferences: React.FC<ChatPreferencesProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<ChatSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('chat_preferences');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse saved chat preferences:', error);
      }
    }
  }, []);

  // Calculate estimated cost based on settings
  useEffect(() => {
    const modelCosts = {
      'gpt-3.5-turbo': 0.002,
      'gpt-4': 0.03,
      'gpt-4-turbo': 0.01
    };
    
    const tokensPerRequest = settings.maxTokens + settings.contextLength;
    const costPer1000Tokens = modelCosts[settings.model as keyof typeof modelCosts] || 0.002;
    const estimatedCostPerRequest = (tokensPerRequest / 1000) * costPer1000Tokens;
    
    setEstimatedCost(estimatedCostPerRequest);
  }, [settings.model, settings.maxTokens, settings.contextLength]);

  const handleSettingChange = <K extends keyof ChatSettings>(
    key: K,
    value: ChatSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
    onSettingsChange?.(true);
  };

  const handleSave = () => {
    localStorage.setItem('chat_preferences', JSON.stringify(settings));
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
        <div className="p-2 bg-purple-100 rounded-lg">
          <MessageSquare className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Chat Assistant Preferences</h3>
          <p className="text-sm text-gray-600">
            Customize how the AI assistant responds to your questions
          </p>
        </div>
      </div>

      {/* Model Selection */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
          <Brain className="w-4 h-4" />
          <span>AI Model</span>
        </h4>
        
        <div className="grid gap-3">
          {modelOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                settings.model === option.value
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="model"
                value={option.value}
                checked={settings.model === option.value}
                onChange={(e) => handleSettingChange('model', e.target.value)}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{option.label}</span>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    settings.model === option.value
                      ? 'border-purple-500 bg-purple-500'
                      : 'border-gray-300'
                  }`}>
                    {settings.model === option.value && (
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

      {/* Response Settings */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
          <Sliders className="w-4 h-4" />
          <span>Response Settings</span>
        </h4>

        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Creativity (Temperature)
            </label>
            <span className="text-sm text-gray-600">{settings.temperature}</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={settings.temperature}
            onChange={(e) => handleSettingChange('temperature', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Focused</span>
            <span>Creative</span>
          </div>
        </div>

        {/* Max Tokens */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Response Length (Max Tokens)
            </label>
            <span className="text-sm text-gray-600">{settings.maxTokens}</span>
          </div>
          <input
            type="range"
            min="100"
            max="2000"
            step="100"
            value={settings.maxTokens}
            onChange={(e) => handleSettingChange('maxTokens', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Short</span>
            <span>Long</span>
          </div>
        </div>

        {/* Context Length */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Context Length (Tokens)
            </label>
            <span className="text-sm text-gray-600">{settings.contextLength}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="8000"
            step="500"
            value={settings.contextLength}
            onChange={(e) => handleSettingChange('contextLength', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Less context</span>
            <span>More context</span>
          </div>
        </div>
      </div>

      {/* Response Style */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Response Style</h4>
        
        <div className="grid gap-3">
          {responseStyleOptions.map((option) => (
            <label
              key={option.value}
              className={`flex items-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                settings.responseStyle === option.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="responseStyle"
                value={option.value}
                checked={settings.responseStyle === option.value}
                onChange={(e) => handleSettingChange('responseStyle', e.target.value as any)}
                className="sr-only"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">{option.label}</span>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    settings.responseStyle === option.value
                      ? 'border-blue-500 bg-blue-500'
                      : 'border-gray-300'
                  }`}>
                    {settings.responseStyle === option.value && (
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

      {/* Search Settings */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Search & Sources</h4>

        {/* Search Threshold */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Search Relevance Threshold
            </label>
            <span className="text-sm text-gray-600">{settings.searchThreshold}</span>
          </div>
          <input
            type="range"
            min="0.3"
            max="0.9"
            step="0.1"
            value={settings.searchThreshold}
            onChange={(e) => handleSettingChange('searchThreshold', parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>More results</span>
            <span>Higher quality</span>
          </div>
        </div>

        {/* Max Sources */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Maximum Sources
            </label>
            <span className="text-sm text-gray-600">{settings.maxSources}</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={settings.maxSources}
            onChange={(e) => handleSettingChange('maxSources', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Features</h4>
        
        <div className="space-y-3">
          {[
            { key: 'includeSourceUrls', label: 'Include source URLs in responses' },
            { key: 'showConfidenceScores', label: 'Show confidence scores' },
            { key: 'enableFollowUpSuggestions', label: 'Enable follow-up question suggestions' }
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings[key as keyof ChatSettings] as boolean}
                onChange={(e) => handleSettingChange(key as keyof ChatSettings, e.target.checked as any)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Cost Estimation */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Zap className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Estimated Cost per Request</p>
            <p className="text-2xl font-bold text-yellow-900">
              ${estimatedCost.toFixed(4)}
            </p>
            <p className="mt-1">
              Based on {settings.model} with {settings.maxTokens + settings.contextLength} tokens
            </p>
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
          className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Save Preferences</span>
        </button>
      </div>
    </div>
  );
};
