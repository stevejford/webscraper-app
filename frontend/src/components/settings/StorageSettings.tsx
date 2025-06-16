import React, { useState, useEffect } from 'react';
import { Database, HardDrive, Trash2, Download, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

interface StorageSettingsProps {
  onSettingsChange?: (hasChanges: boolean) => void;
}

interface StorageStats {
  totalSize: number;
  usedSize: number;
  fileCount: number;
  sessionCount: number;
  breakdown: {
    images: { count: number; size: number };
    documents: { count: number; size: number };
    pdfs: { count: number; size: number };
    videos: { count: number; size: number };
    audio: { count: number; size: number };
    archives: { count: number; size: number };
  };
  deduplication: {
    totalFiles: number;
    uniqueFiles: number;
    spaceSaved: number;
    savingsPercentage: number;
  };
}

interface StorageSettings {
  autoCleanup: boolean;
  cleanupDays: number;
  maxFileSize: number;
  enableDeduplication: boolean;
  compressionLevel: number;
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

const defaultSettings: StorageSettings = {
  autoCleanup: false,
  cleanupDays: 30,
  maxFileSize: 50, // MB
  enableDeduplication: true,
  compressionLevel: 6,
  autoBackup: false,
  backupFrequency: 'weekly'
};

export const StorageSettings: React.FC<StorageSettingsProps> = ({ onSettingsChange }) => {
  const [settings, setSettings] = useState<StorageSettings>(defaultSettings);
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Load storage stats and settings
  useEffect(() => {
    loadStorageStats();
    loadSettings();
  }, []);

  const loadStorageStats = async () => {
    setIsLoading(true);
    try {
      // Mock storage stats - in real implementation, fetch from API
      const mockStats: StorageStats = {
        totalSize: 5368709120, // 5GB
        usedSize: 2684354560, // 2.5GB
        fileCount: 1247,
        sessionCount: 12,
        breakdown: {
          images: { count: 456, size: 1073741824 }, // 1GB
          documents: { count: 234, size: 536870912 }, // 512MB
          pdfs: { count: 123, size: 805306368 }, // 768MB
          videos: { count: 45, size: 268435456 }, // 256MB
          audio: { count: 67, size: 134217728 }, // 128MB
          archives: { count: 12, size: 67108864 } // 64MB
        },
        deduplication: {
          totalFiles: 1247,
          uniqueFiles: 892,
          spaceSaved: 355 * 1024 * 1024, // 355MB
          savingsPercentage: 28.5
        }
      };

      setStats(mockStats);
    } catch (error) {
      console.error('Failed to load storage stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSettings = () => {
    const savedSettings = localStorage.getItem('storage_settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse storage settings:', error);
      }
    }
  };

  const handleSettingChange = <K extends keyof StorageSettings>(
    key: K,
    value: StorageSettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
    onSettingsChange?.(true);
  };

  const handleSave = () => {
    localStorage.setItem('storage_settings', JSON.stringify(settings));
    setHasChanges(false);
    onSettingsChange?.(false);
  };

  const handleCleanup = async () => {
    setIsCleaningUp(true);
    try {
      // Mock cleanup process
      await new Promise(resolve => setTimeout(resolve, 2000));
      await loadStorageStats(); // Refresh stats
    } catch (error) {
      console.error('Cleanup failed:', error);
    } finally {
      setIsCleaningUp(false);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getUsagePercentage = (): number => {
    if (!stats) return 0;
    return (stats.usedSize / stats.totalSize) * 100;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-green-100 rounded-lg">
          <Database className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Storage & File Management</h3>
          <p className="text-sm text-gray-600">
            Manage your storage usage and file handling preferences
          </p>
        </div>
      </div>

      {/* Storage Overview */}
      {stats && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center space-x-2">
            <HardDrive className="w-4 h-4" />
            <span>Storage Overview</span>
          </h4>

          {/* Usage Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Used: {formatBytes(stats.usedSize)}</span>
              <span>Total: {formatBytes(stats.totalSize)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  getUsagePercentage() > 80 ? 'bg-red-500' :
                  getUsagePercentage() > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${getUsagePercentage()}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {getUsagePercentage().toFixed(1)}% used
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.fileCount.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Total Files</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.sessionCount}</p>
              <p className="text-xs text-gray-600">Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {formatBytes(stats.deduplication.spaceSaved)}
              </p>
              <p className="text-xs text-gray-600">Space Saved</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {stats.deduplication.savingsPercentage.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600">Deduplication</p>
            </div>
          </div>

          {/* File Type Breakdown */}
          <div className="space-y-2">
            <h5 className="text-sm font-medium text-gray-700">File Type Breakdown</h5>
            {Object.entries(stats.breakdown).map(([type, data]) => (
              <div key={type} className="flex items-center justify-between text-sm">
                <span className="capitalize text-gray-600">{type}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500">{data.count} files</span>
                  <span className="font-medium text-gray-900">{formatBytes(data.size)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Storage Settings */}
      <div className="space-y-6">
        <h4 className="text-md font-medium text-gray-900">Storage Preferences</h4>

        {/* Auto Cleanup */}
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoCleanup}
              onChange={(e) => handleSettingChange('autoCleanup', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Enable automatic cleanup of old files
            </span>
          </label>

          {settings.autoCleanup && (
            <div className="ml-7 space-y-2">
              <label className="text-sm text-gray-600">
                Delete files older than {settings.cleanupDays} days
              </label>
              <input
                type="range"
                min="7"
                max="365"
                value={settings.cleanupDays}
                onChange={(e) => handleSettingChange('cleanupDays', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>7 days</span>
                <span>1 year</span>
              </div>
            </div>
          )}
        </div>

        {/* Max File Size */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Maximum file size: {settings.maxFileSize} MB
          </label>
          <input
            type="range"
            min="1"
            max="100"
            value={settings.maxFileSize}
            onChange={(e) => handleSettingChange('maxFileSize', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>1 MB</span>
            <span>100 MB</span>
          </div>
        </div>

        {/* Deduplication */}
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.enableDeduplication}
            onChange={(e) => handleSettingChange('enableDeduplication', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">
            Enable file deduplication
          </span>
        </label>

        {/* Compression Level */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Compression level: {settings.compressionLevel}
          </label>
          <input
            type="range"
            min="1"
            max="9"
            value={settings.compressionLevel}
            onChange={(e) => handleSettingChange('compressionLevel', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Fast</span>
            <span>Best</span>
          </div>
        </div>

        {/* Auto Backup */}
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.autoBackup}
              onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">
              Enable automatic backups
            </span>
          </label>

          {settings.autoBackup && (
            <div className="ml-7">
              <select
                value={settings.backupFrequency}
                onChange={(e) => handleSettingChange('backupFrequency', e.target.value as any)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-gray-900">Storage Actions</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={handleCleanup}
            disabled={isCleaningUp}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
          >
            {isCleaningUp ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">
              {isCleaningUp ? 'Cleaning...' : 'Clean Up Files'}
            </span>
          </button>

          <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export Data</span>
          </button>

          <button
            onClick={loadStorageStats}
            className="flex items-center justify-center space-x-2 px-4 py-3 bg-gray-50 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="text-sm font-medium">Refresh Stats</span>
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className="flex items-center space-x-2 px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
};
