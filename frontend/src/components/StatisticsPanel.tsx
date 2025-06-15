import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Clock, Globe, Link, TrendingUp } from 'lucide-react';
import { ScrapeResult } from '../types';

interface StatisticsPanelProps {
  session: ScrapeResult;
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ session }) => {
  const { statistics, status, urls, external_urls } = session;
  
  // Calculate additional stats
  const avgTimePerPage = statistics.duration_seconds / statistics.total_pages_scraped;
  const successRate = (statistics.total_pages_scraped / statistics.total_pages_scraped) * 100; // Simplified
  
  // Prepare chart data
  const chartData = [
    { name: 'Internal URLs', value: statistics.total_urls_found, color: '#3B82F6' },
    { name: 'External URLs', value: statistics.external_urls_found, color: '#8B5CF6' },
  ];
  
  const timelineData = [
    { name: 'Start', time: 0 },
    { name: 'End', time: statistics.duration_seconds },
  ];

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {statistics.total_pages_scraped}
              </div>
              <div className="text-sm text-blue-600/70 dark:text-blue-400/70">
                Pages Scraped
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Link className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {statistics.total_urls_found}
              </div>
              <div className="text-sm text-green-600/70 dark:text-green-400/70">
                URLs Found
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {statistics.external_urls_found}
              </div>
              <div className="text-sm text-purple-600/70 dark:text-purple-400/70">
                External Links
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500 rounded-lg">
              <Clock className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {formatDuration(statistics.duration_seconds)}
              </div>
              <div className="text-sm text-orange-600/70 dark:text-orange-400/70">
                Duration
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* URL Distribution */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            URL Distribution
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Performance
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Avg. Time per Page</span>
                <span className="font-medium">{avgTimePerPage.toFixed(2)}s</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((avgTimePerPage / 5) * 100, 100)}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                <span className="font-medium">{successRate.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${successRate}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600 dark:text-gray-400">URLs per Page</span>
                <span className="font-medium">
                  {(statistics.total_urls_found / statistics.total_pages_scraped).toFixed(1)}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(((statistics.total_urls_found / statistics.total_pages_scraped) / 20) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Session Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
      >
        <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-gray-100">
          Session Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-600 dark:text-gray-400">Domain:</span>
            <span className="ml-2 font-mono">{session.domain}</span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Status:</span>
            <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
              status.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
              status.status === 'running' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {status.status}
            </span>
          </div>
          <div>
            <span className="text-gray-600 dark:text-gray-400">Started:</span>
            <span className="ml-2">{new Date(status.started_at).toLocaleString()}</span>
          </div>
          {status.ended_at && (
            <div>
              <span className="text-gray-600 dark:text-gray-400">Ended:</span>
              <span className="ml-2">{new Date(status.ended_at).toLocaleString()}</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default StatisticsPanel;
