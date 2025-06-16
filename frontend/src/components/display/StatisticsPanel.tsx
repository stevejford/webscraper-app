import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Globe, Download, Clock, TrendingUp, FileText, Image, Video, File } from 'lucide-react';
import { useScrapingStore } from '../../store/scrapingStore';
import { formatFileSize, formatDuration, formatNumber } from '../../utils/helpers';

export const StatisticsPanel: React.FC = () => {
  const { currentSession } = useScrapingStore();

  if (!currentSession?.result) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Statistics
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          No data available. Start a scraping session to see statistics.
        </p>
      </div>
    );
  }

  const { statistics } = currentSession.result;

  // Prepare data for charts with safe fallbacks
  const contentByType = statistics?.content_by_type || {};
  const contentTypeData = Object.entries(contentByType).map(([type, count]) => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: count,
    count: count,
  }));

  // If no content_by_type data, create mock data based on scraped content
  const fallbackContentTypeData = contentTypeData.length === 0 && currentSession.result?.scraped_content ?
    currentSession.result.scraped_content.reduce((acc: any[], item: any) => {
      const type = item.content_type || 'other';
      const existing = acc.find(entry => entry.name.toLowerCase() === type);
      if (existing) {
        existing.value += 1;
        existing.count += 1;
      } else {
        acc.push({
          name: type.charAt(0).toUpperCase() + type.slice(1),
          value: 1,
          count: 1,
        });
      }
      return acc;
    }, []) : contentTypeData;

  const performanceData = [
    {
      name: 'Pages',
      value: statistics?.total_pages_scraped || currentSession.status?.pages_scraped || 0,
      color: '#3B82F6',
    },
    {
      name: 'URLs',
      value: statistics?.total_urls_found || currentSession.status?.urls_found || 0,
      color: '#10B981',
    },
    {
      name: 'External',
      value: statistics?.external_urls_found || currentSession.status?.external_urls_found || 0,
      color: '#F59E0B',
    },
    {
      name: 'Content',
      value: statistics?.content_downloaded || currentSession.status?.content_downloaded || 0,
      color: '#8B5CF6',
    },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#6B7280'];

  const getContentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'image':
        return <Image size={16} className="text-blue-500" />;
      case 'pdf':
      case 'document':
        return <FileText size={16} className="text-red-500" />;
      case 'video':
        return <Video size={16} className="text-purple-500" />;
      default:
        return <File size={16} className="text-gray-500" />;
    }
  };

  const overviewStats = [
    {
      label: 'Total Pages',
      value: formatNumber(statistics?.total_pages_scraped || currentSession.status?.pages_scraped || 0),
      icon: Globe,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
    },
    {
      label: 'URLs Found',
      value: formatNumber(statistics?.total_urls_found || currentSession.status?.urls_found || 0),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900',
    },
    {
      label: 'Content Downloaded',
      value: formatNumber(statistics?.content_downloaded || currentSession.status?.content_downloaded || 0),
      icon: Download,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      label: 'Total Size',
      value: formatFileSize(statistics?.total_file_size || 0),
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        Session Statistics
      </h2>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {overviewStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${stat.bgColor} mb-2`}>
                <Icon size={24} className={stat.color} />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Performance Chart */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Performance Overview
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="name" 
                  className="text-gray-600 dark:text-gray-400"
                  fontSize={12}
                />
                <YAxis 
                  className="text-gray-600 dark:text-gray-400"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                />
                <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Type Distribution */}
        {fallbackContentTypeData.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Content Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={fallbackContentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {fallbackContentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Content Types Breakdown */}
        {fallbackContentTypeData.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Content Types
            </h3>
            <div className="space-y-3">
              {fallbackContentTypeData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getContentIcon(item.name)}
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {item.count} files
                    </span>
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session Details */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Session Details
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatDuration(statistics?.duration_seconds || 0)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Average per Page</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {(statistics?.total_pages_scraped || 0) > 0
                  ? formatDuration((statistics?.duration_seconds || 0) / (statistics?.total_pages_scraped || 1))
                  : '0s'
                }
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">Success Rate</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {(statistics?.total_pages_scraped || 0) > 0
                  ? Math.round(((statistics?.content_downloaded || 0) / (statistics?.total_pages_scraped || 1)) * 100)
                  : 0
                }%
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="text-sm text-gray-600 dark:text-gray-400">External Links</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {formatNumber(statistics?.external_urls_found || currentSession.status?.external_urls_found || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
