import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Copy, CheckCircle } from 'lucide-react';

interface URLTableProps {
  urls: string[];
  searchTerm: string;
  isExternal?: boolean;
}

const URLTable: React.FC<URLTableProps> = ({ urls, searchTerm, isExternal = false }) => {
  const [copiedUrl, setCopiedUrl] = React.useState<string | null>(null);

  const filteredUrls = useMemo(() => {
    if (!searchTerm) return urls;
    return urls.filter(url => 
      url.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [urls, searchTerm]);

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="h-64 overflow-auto">
      {filteredUrls.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <p>{searchTerm ? 'No URLs match your search' : 'No URLs found yet'}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredUrls.map((url, index) => (
            <motion.div
              key={url}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono text-gray-900 dark:text-gray-100 truncate">
                  {url}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new URL(url).pathname || '/'}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => copyUrl(url)}
                  className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  title="Copy URL"
                >
                  {copiedUrl === url ? (
                    <CheckCircle className="w-3 h-3 text-green-500" />
                  ) : (
                    <Copy className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
                
                <button
                  onClick={() => openUrl(url)}
                  className="p-1.5 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  title="Open URL"
                >
                  <ExternalLink className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default URLTable;
