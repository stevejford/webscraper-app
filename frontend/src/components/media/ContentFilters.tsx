import React from 'react';
import { Calendar, FileType, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useScrapingStore } from '../../store/scrapingStore';
import { Button } from '../common/Button';
import { Input } from '../common/Input';

export const ContentFilters: React.FC = () => {
  const { contentFilters, updateContentFilters } = useScrapingStore();

  const handleStatusChange = (status: 'all' | 'success' | 'error') => {
    updateContentFilters({ status });
  };

  const handleTypeChange = (type: string) => {
    updateContentFilters({ type });
  };

  const handleReset = () => {
    updateContentFilters({
      search: '',
      type: 'all',
      status: 'all',
    });
  };

  const contentTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'image', label: 'Images' },
    { id: 'pdf', label: 'PDFs' },
    { id: 'video', label: 'Videos' },
    { id: 'document', label: 'Documents' },
    { id: 'text', label: 'Text Files' },
    { id: 'other', label: 'Other' },
  ];

  const statusOptions = [
    { id: 'all', label: 'All Status', icon: null },
    { id: 'success', label: 'Downloaded', icon: CheckCircle },
    { id: 'error', label: 'Failed', icon: XCircle },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-xs"
        >
          <RotateCcw size={12} className="mr-1" />
          Reset
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Content Type Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            <FileType size={14} className="inline mr-1" />
            Content Type
          </label>
          <select
            value={contentFilters.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {contentTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <div className="flex space-x-2">
            {statusOptions.map((status) => {
              const Icon = status.icon;
              return (
                <Button
                  key={status.id}
                  variant={contentFilters.status === status.id ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => handleStatusChange(status.id as 'all' | 'success' | 'error')}
                  className="text-xs flex-1"
                >
                  {Icon && <Icon size={12} className="mr-1" />}
                  {status.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
            <Calendar size={14} className="inline mr-1" />
            Date Range
          </label>
          <select
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            defaultValue="all"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* File Size Filter */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          File Size Range
        </label>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            placeholder="Min (KB)"
            className="text-xs"
          />
          <span className="text-gray-500 dark:text-gray-400">-</span>
          <Input
            type="number"
            placeholder="Max (KB)"
            className="text-xs"
          />
        </div>
      </div>

      {/* Advanced Search */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Advanced Search
        </label>
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Search in titles..."
            className="text-xs"
          />
          <Input
            type="text"
            placeholder="Search in URLs..."
            className="text-xs"
          />
          <Input
            type="text"
            placeholder="Search in descriptions..."
            className="text-xs"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
          Quick Filters
        </label>
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" className="text-xs">
            Large Files (&gt;1MB)
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            Recent (24h)
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            High Quality Images
          </Button>
          <Button variant="ghost" size="sm" className="text-xs">
            Failed Downloads
          </Button>
        </div>
      </div>
    </div>
  );
};
