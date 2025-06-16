import React, { useState, useEffect } from 'react';
import { Key, CheckCircle, XCircle, AlertTriangle, Settings } from 'lucide-react';

interface APIKeyStatusProps {
  onConfigureClick?: () => void;
  className?: string;
}

interface APIKeyState {
  hasKey: boolean;
  isValid: boolean;
  isValidating: boolean;
  error?: string;
}

export const APIKeyStatus: React.FC<APIKeyStatusProps> = ({ 
  onConfigureClick, 
  className = '' 
}) => {
  const [keyState, setKeyState] = useState<APIKeyState>({
    hasKey: false,
    isValid: false,
    isValidating: false
  });

  useEffect(() => {
    checkAPIKey();
  }, []);

  const checkAPIKey = async () => {
    const savedKey = localStorage.getItem('openai_api_key');
    
    if (!savedKey) {
      setKeyState({
        hasKey: false,
        isValid: false,
        isValidating: false
      });
      return;
    }

    setKeyState(prev => ({
      ...prev,
      hasKey: true,
      isValidating: true
    }));

    try {
      // Quick validation - just check format
      if (savedKey.startsWith('sk-') && savedKey.length > 20) {
        setKeyState({
          hasKey: true,
          isValid: true,
          isValidating: false
        });
      } else {
        setKeyState({
          hasKey: true,
          isValid: false,
          isValidating: false,
          error: 'Invalid API key format'
        });
      }
    } catch (error) {
      setKeyState({
        hasKey: true,
        isValid: false,
        isValidating: false,
        error: 'Failed to validate API key'
      });
    }
  };

  const getStatusIcon = () => {
    if (keyState.isValidating) {
      return <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
    }
    
    if (!keyState.hasKey) {
      return <Key className="w-4 h-4 text-gray-400" />;
    }
    
    if (keyState.isValid) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusText = () => {
    if (keyState.isValidating) {
      return 'Validating...';
    }
    
    if (!keyState.hasKey) {
      return 'No API key';
    }
    
    if (keyState.isValid) {
      return 'API key valid';
    }
    
    return keyState.error || 'API key invalid';
  };

  const getStatusColor = () => {
    if (keyState.isValidating) {
      return 'text-blue-600';
    }
    
    if (!keyState.hasKey) {
      return 'text-gray-500';
    }
    
    if (keyState.isValid) {
      return 'text-green-600';
    }
    
    return 'text-red-600';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {getStatusIcon()}
      <span className={`text-sm ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      
      {onConfigureClick && (
        <button
          onClick={onConfigureClick}
          className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          title="Configure API key"
        >
          <Settings className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
