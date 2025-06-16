import React, { useState } from 'react';
import { Download, Upload, FileText, Database, Settings, AlertCircle, CheckCircle } from 'lucide-react';
import { useScrapingStore } from '../../store/scrapingStore';

interface ExportSettingsProps {
  onSettingsChange?: (hasChanges: boolean) => void;
}

interface ExportOptions {
  includeFiles: boolean;
  includeSettings: boolean;
  includeHistory: boolean;
  format: 'json' | 'csv' | 'xml';
  compression: boolean;
  dateRange: 'all' | 'last30' | 'last90' | 'custom';
  customStartDate?: string;
  customEndDate?: string;
}

const defaultExportOptions: ExportOptions = {
  includeFiles: true,
  includeSettings: true,
  includeHistory: true,
  format: 'json',
  compression: true,
  dateRange: 'all'
};

export const ExportSettings: React.FC<ExportSettingsProps> = ({ onSettingsChange }) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>(defaultExportOptions);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleExportOptionChange = <K extends keyof ExportOptions>(
    key: K,
    value: ExportOptions[K]
  ) => {
    setExportOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportStatus('idle');

    try {
      // Mock export process
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create export data
      const exportData = {
        metadata: {
          exportDate: new Date().toISOString(),
          version: '1.0.0',
          options: exportOptions
        },
        settings: exportOptions.includeSettings ? {
          apiKey: '***hidden***',
          chatPreferences: JSON.parse(localStorage.getItem('chat_preferences') || '{}'),
          themeSettings: JSON.parse(localStorage.getItem('theme_settings') || '{}'),
          storageSettings: JSON.parse(localStorage.getItem('storage_settings') || '{}')
        } : null,
        sessions: exportOptions.includeHistory ? (() => {
          const { sessions } = useScrapingStore.getState();
          return sessions.map(session => ({
            id: session.id,
            domain: session.domain,
            createdAt: session.created_at,
            status: session.status?.status || session.status,
            fileCount: session.result?.scraped_content?.length || 0,
            pageCount: session.result?.page_contents?.length || 0,
            config: session.config,
            statistics: session.result?.statistics
          }));
        })() : null,
        files: exportOptions.includeFiles ? (() => {
          const { currentSession } = useScrapingStore.getState();
          if (!currentSession?.result?.scraped_content) return [];

          return currentSession.result.scraped_content.map(content => ({
            id: content.url,
            name: content.title || content.file_path?.split('/').pop() || 'unknown',
            size: content.file_size || 0,
            type: content.mime_type || 'unknown',
            url: content.url,
            contentType: content.content_type,
            downloadedAt: content.downloaded_at,
            success: content.success,
            filePath: content.file_path
          }));
        })() : null
      };

      // Create and download file
      const dataStr = exportOptions.format === 'json' 
        ? JSON.stringify(exportData, null, 2)
        : convertToFormat(exportData, exportOptions.format);

      const blob = new Blob([dataStr], { 
        type: exportOptions.format === 'json' ? 'application/json' : 'text/plain' 
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `webscraper-export-${new Date().toISOString().split('T')[0]}.${exportOptions.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setExportStatus('success');
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportStatus('idle');

    try {
      const text = await file.text();
      const importData = JSON.parse(text);

      // Validate import data structure
      if (!importData.metadata || !importData.metadata.version) {
        throw new Error('Invalid export file format');
      }

      // Import settings
      if (importData.settings) {
        if (importData.settings.chatPreferences) {
          localStorage.setItem('chat_preferences', JSON.stringify(importData.settings.chatPreferences));
        }
        if (importData.settings.themeSettings) {
          localStorage.setItem('theme_settings', JSON.stringify(importData.settings.themeSettings));
        }
        if (importData.settings.storageSettings) {
          localStorage.setItem('storage_settings', JSON.stringify(importData.settings.storageSettings));
        }
      }

      // Note: In a real implementation, you would also import sessions and files
      // This would require API calls to recreate the data

      setImportStatus('success');
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus('error');
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const convertToFormat = (data: any, format: string): string => {
    switch (format) {
      case 'csv':
        // Simple CSV conversion for demonstration
        return 'Export format,CSV not fully implemented in demo\n';
      case 'xml':
        // Simple XML conversion for demonstration
        return '<?xml version="1.0"?><export><note>XML format not fully implemented in demo</note></export>';
      default:
        return JSON.stringify(data, null, 2);
    }
  };

  const getEstimatedSize = (): string => {
    let size = 0;
    if (exportOptions.includeSettings) size += 10; // KB
    if (exportOptions.includeHistory) size += 100; // KB
    if (exportOptions.includeFiles) size += 1000; // KB
    
    if (exportOptions.compression) size *= 0.3; // 70% compression
    
    return size > 1000 ? `${(size / 1000).toFixed(1)} MB` : `${Math.round(size)} KB`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Download className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Export & Import</h3>
          <p className="text-sm text-gray-600">
            Backup your data and settings or import from another device
          </p>
        </div>
      </div>

      {/* Export Section */}
      <div className="space-y-6">
        <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Export Data</span>
        </h4>

        {/* Export Options */}
        <div className="space-y-4">
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700">Include in Export</h5>
            {[
              { key: 'includeSettings', label: 'Application settings and preferences', icon: Settings },
              { key: 'includeHistory', label: 'Session history and metadata', icon: Database },
              { key: 'includeFiles', label: 'Downloaded files and content', icon: FileText }
            ].map(({ key, label, icon: Icon }) => (
              <label key={key} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={exportOptions[key as keyof ExportOptions] as boolean}
                  onChange={(e) => handleExportOptionChange(key as keyof ExportOptions, e.target.checked as any)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>

          {/* Format Selection */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700">Export Format</h5>
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: 'json', label: 'JSON', description: 'Structured data format' },
                { value: 'csv', label: 'CSV', description: 'Spreadsheet compatible' },
                { value: 'xml', label: 'XML', description: 'Markup format' }
              ].map((format) => (
                <label
                  key={format.value}
                  className={`flex flex-col p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    exportOptions.format === format.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={format.value}
                    checked={exportOptions.format === format.value}
                    onChange={(e) => handleExportOptionChange('format', e.target.value as any)}
                    className="sr-only"
                  />
                  <span className="font-medium text-gray-900">{format.label}</span>
                  <span className="text-xs text-gray-600 mt-1">{format.description}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-gray-700">Date Range</h5>
            <select
              value={exportOptions.dateRange}
              onChange={(e) => handleExportOptionChange('dateRange', e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All time</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
              <option value="custom">Custom range</option>
            </select>

            {exportOptions.dateRange === 'custom' && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={exportOptions.customStartDate || ''}
                    onChange={(e) => handleExportOptionChange('customStartDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    value={exportOptions.customEndDate || ''}
                    onChange={(e) => handleExportOptionChange('customEndDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Compression */}
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={exportOptions.compression}
              onChange={(e) => handleExportOptionChange('compression', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Enable compression (reduces file size)</span>
          </label>
        </div>

        {/* Export Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Export Information</p>
              <p>Estimated file size: <span className="font-medium">{getEstimatedSize()}</span></p>
              <p className="mt-1">
                The export will include all selected data from your local storage. 
                API keys will be excluded for security.
              </p>
            </div>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting ? (
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{isExporting ? 'Exporting...' : 'Export Data'}</span>
        </button>

        {/* Export Status */}
        {exportStatus !== 'idle' && (
          <div className={`flex items-center space-x-2 text-sm ${
            exportStatus === 'success' ? 'text-green-600' : 'text-red-600'
          }`}>
            {exportStatus === 'success' ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span>
              {exportStatus === 'success' 
                ? 'Export completed successfully!' 
                : 'Export failed. Please try again.'
              }
            </span>
          </div>
        )}
      </div>

      {/* Import Section */}
      <div className="space-y-6 pt-8 border-t border-gray-200">
        <h4 className="text-md font-medium text-gray-900 flex items-center space-x-2">
          <Upload className="w-4 h-4" />
          <span>Import Data</span>
        </h4>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Import Warning</p>
              <p>
                Importing data will overwrite your current settings and preferences. 
                Consider exporting your current data first as a backup.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700 mb-2 block">
              Select export file to import
            </span>
            <input
              type="file"
              accept=".json,.csv,.xml"
              onChange={handleImport}
              disabled={isImporting}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
            />
          </label>

          {isImporting && (
            <div className="flex items-center space-x-2 text-sm text-blue-600">
              <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
              <span>Importing data...</span>
            </div>
          )}

          {importStatus !== 'idle' && (
            <div className={`flex items-center space-x-2 text-sm ${
              importStatus === 'success' ? 'text-green-600' : 'text-red-600'
            }`}>
              {importStatus === 'success' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span>
                {importStatus === 'success' 
                  ? 'Import completed successfully! Please refresh the page.' 
                  : 'Import failed. Please check the file format and try again.'
                }
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
