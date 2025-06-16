import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Key, Check, X, AlertTriangle, Info, Zap } from 'lucide-react';

interface APIKeySettingsProps {
  onApiKeyChange?: (apiKey: string, isValid: boolean) => void;
}

interface APIKeyValidation {
  isValid: boolean;
  error?: string;
  model?: string;
  organization?: string;
  usage?: {
    totalTokens: number;
    totalCost: number;
    remainingCredits: number;
  };
}

export const APIKeySettings: React.FC<APIKeySettingsProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validation, setValidation] = useState<APIKeyValidation | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load saved API key on component mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      validateApiKey(savedApiKey);
    }
  }, []);

  // Validate API key with OpenAI
  const validateApiKey = async (key: string): Promise<void> => {
    if (!key || !key.startsWith('sk-')) {
      setValidation({
        isValid: false,
        error: 'API key must start with "sk-"'
      });
      return;
    }

    setIsValidating(true);
    
    try {
      // Test API key by making a simple request
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const gptModels = data.data.filter((model: any) => 
          model.id.includes('gpt') || model.id.includes('text-embedding')
        );

        // Get usage information (mock for now - would need actual billing API)
        const mockUsage = {
          totalTokens: Math.floor(Math.random() * 1000000),
          totalCost: Math.floor(Math.random() * 100 * 100) / 100,
          remainingCredits: Math.floor(Math.random() * 500 * 100) / 100
        };

        setValidation({
          isValid: true,
          model: gptModels[0]?.id || 'gpt-3.5-turbo',
          organization: response.headers.get('openai-organization') || 'Personal',
          usage: mockUsage
        });

        onApiKeyChange?.(key, true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setValidation({
          isValid: false,
          error: errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`
        });
        onApiKeyChange?.(key, false);
      }
    } catch (error) {
      setValidation({
        isValid: false,
        error: error instanceof Error ? error.message : 'Network error'
      });
      onApiKeyChange?.(key, false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setHasUnsavedChanges(true);
    setValidation(null);
    
    // Debounced validation
    const timeoutId = setTimeout(() => {
      if (value.trim()) {
        validateApiKey(value.trim());
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  };

  const handleSave = () => {
    if (validation?.isValid) {
      localStorage.setItem('openai_api_key', apiKey.trim());
      setHasUnsavedChanges(false);
    }
  };

  const handleClear = () => {
    setApiKey('');
    setValidation(null);
    setHasUnsavedChanges(true);
    localStorage.removeItem('openai_api_key');
    onApiKeyChange?.('', false);
  };

  const getStatusIcon = () => {
    if (isValidating) {
      return <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
    }
    if (validation?.isValid) {
      return <Check className="w-4 h-4 text-green-500" />;
    }
    if (validation?.error) {
      return <X className="w-4 h-4 text-red-500" />;
    }
    return <Key className="w-4 h-4 text-gray-400" />;
  };

  const getStatusColor = () => {
    if (validation?.isValid) return 'border-green-500 bg-green-50';
    if (validation?.error) return 'border-red-500 bg-red-50';
    if (isValidating) return 'border-blue-500 bg-blue-50';
    return 'border-gray-300 bg-white';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Key className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">OpenAI API Configuration</h3>
          <p className="text-sm text-gray-600">
            Configure your OpenAI API key to enable the chat assistant
          </p>
        </div>
      </div>

      {/* API Key Input */}
      <div className="space-y-3">
        <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
          API Key
        </label>
        
        <div className={`relative rounded-lg border-2 transition-colors ${getStatusColor()}`}>
          <input
            id="api-key"
            type={showApiKey ? 'text' : 'password'}
            value={apiKey}
            onChange={(e) => handleApiKeyChange(e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-3 pr-20 bg-transparent border-0 rounded-lg focus:outline-none focus:ring-0"
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
            {getStatusIcon()}
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Validation Status */}
        {validation && (
          <div className={`p-3 rounded-lg ${
            validation.isValid 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-start space-x-2">
              {validation.isValid ? (
                <Check className="w-4 h-4 text-green-500 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
              )}
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  validation.isValid ? 'text-green-800' : 'text-red-800'
                }`}>
                  {validation.isValid ? 'API Key Valid' : 'API Key Invalid'}
                </p>
                {validation.error && (
                  <p className="text-sm text-red-600 mt-1">{validation.error}</p>
                )}
                {validation.isValid && validation.model && (
                  <p className="text-sm text-green-600 mt-1">
                    Connected to {validation.model} • Organization: {validation.organization}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Usage Information */}
      {validation?.isValid && validation.usage && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-3">
            <Zap className="w-4 h-4 text-yellow-500" />
            <h4 className="text-sm font-medium text-gray-900">Usage Overview</h4>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {validation.usage.totalTokens.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Total Tokens</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                ${validation.usage.totalCost.toFixed(2)}
              </p>
              <p className="text-xs text-gray-600">Total Cost</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                ${validation.usage.remainingCredits.toFixed(2)}
              </p>
              <p className="text-xs text-gray-600">Remaining Credits</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={handleClear}
          disabled={!apiKey}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Clear
        </button>
        
        <div className="flex items-center space-x-3">
          {hasUnsavedChanges && (
            <span className="text-sm text-amber-600 flex items-center space-x-1">
              <Info className="w-4 h-4" />
              <span>Unsaved changes</span>
            </span>
          )}
          
          <button
            onClick={handleSave}
            disabled={!validation?.isValid || !hasUnsavedChanges}
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Save API Key
          </button>
        </div>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <Info className="w-4 h-4 text-blue-500 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">How to get your OpenAI API key:</p>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
              <li>Visit <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">platform.openai.com/api-keys</a></li>
              <li>Sign in to your OpenAI account</li>
              <li>Click "Create new secret key"</li>
              <li>Copy the key and paste it above</li>
            </ol>
            <p className="mt-2 text-xs">
              Your API key is stored locally and never sent to our servers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
