/**
 * Export Service for Data Export Operations
 * 
 * This service handles various data export formats including:
 * - JSON exports
 * - CSV exports
 * - ZIP file creation
 * - Bulk content downloads
 */

import { ScrapeResult, ScrapedContent } from '../types';

export type ExportFormat = 'json' | 'csv' | 'txt';

export interface ExportOptions {
  format: ExportFormat;
  includeContent: boolean;
  includeStatistics: boolean;
  includeMetadata: boolean;
  filename?: string;
}

class ExportService {
  /**
   * Export session data in specified format
   */
  async exportSession(session: ScrapeResult, options: ExportOptions): Promise<void> {
    const { format, filename } = options;
    const defaultFilename = `webscraper-${session.domain}-${new Date().toISOString().split('T')[0]}`;
    const finalFilename = filename || defaultFilename;

    let content: string;
    let mimeType: string;
    let extension: string;

    switch (format) {
      case 'json':
        content = this.exportAsJSON(session, options);
        mimeType = 'application/json';
        extension = 'json';
        break;
      case 'csv':
        content = this.exportAsCSV(session, options);
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      case 'txt':
        content = this.exportAsText(session, options);
        mimeType = 'text/plain';
        extension = 'txt';
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    this.downloadFile(content, `${finalFilename}.${extension}`, mimeType);
  }

  /**
   * Export multiple sessions
   */
  async exportMultipleSessions(sessions: ScrapeResult[], options: ExportOptions): Promise<void> {
    const { format, filename } = options;
    const defaultFilename = `webscraper-sessions-${new Date().toISOString().split('T')[0]}`;
    const finalFilename = filename || defaultFilename;

    let content: string;
    let mimeType: string;
    let extension: string;

    switch (format) {
      case 'json':
        content = JSON.stringify(sessions, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
      case 'csv':
        content = this.exportMultipleSessionsAsCSV(sessions, options);
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      case 'txt':
        content = sessions.map(session => this.exportAsText(session, options)).join('\n\n---\n\n');
        mimeType = 'text/plain';
        extension = 'txt';
        break;
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }

    this.downloadFile(content, `${finalFilename}.${extension}`, mimeType);
  }

  /**
   * Export URLs only
   */
  async exportUrls(urls: string[], filename?: string): Promise<void> {
    const content = urls.join('\n');
    const finalFilename = filename || `urls-${new Date().toISOString().split('T')[0]}.txt`;
    this.downloadFile(content, finalFilename, 'text/plain');
  }

  /**
   * Export scraped content metadata
   */
  async exportContentMetadata(content: ScrapedContent[], format: ExportFormat = 'csv'): Promise<void> {
    const filename = `content-metadata-${new Date().toISOString().split('T')[0]}`;
    
    let exportContent: string;
    let mimeType: string;
    let extension: string;

    switch (format) {
      case 'json':
        exportContent = JSON.stringify(content, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;
      case 'csv':
        exportContent = this.contentToCSV(content);
        mimeType = 'text/csv';
        extension = 'csv';
        break;
      case 'txt':
        exportContent = content.map(item => 
          `URL: ${item.url}\nType: ${item.content_type}\nSize: ${item.file_size || 'Unknown'}\nDownloaded: ${item.downloaded_at}\n`
        ).join('\n---\n');
        mimeType = 'text/plain';
        extension = 'txt';
        break;
      default:
        throw new Error(`Unsupported format: ${format}`);
    }

    this.downloadFile(exportContent, `${filename}.${extension}`, mimeType);
  }

  // Private helper methods

  private exportAsJSON(session: ScrapeResult, options: ExportOptions): string {
    const data: any = {
      session_id: session.session_id,
      domain: session.domain,
      urls: session.urls,
      external_urls: session.external_urls,
    };

    if (options.includeContent) {
      data.scraped_content = session.scraped_content;
    }

    if (options.includeStatistics) {
      data.statistics = session.statistics;
    }

    if (options.includeMetadata) {
      data.status = session.status;
      data.exported_at = new Date().toISOString();
    }

    return JSON.stringify(data, null, 2);
  }

  private exportAsCSV(session: ScrapeResult, options: ExportOptions): string {
    const rows: string[] = [];
    
    // Header
    rows.push('Type,URL,Status,Content Type,File Size,Downloaded At');
    
    // URLs
    session.urls.forEach(url => {
      rows.push(`Internal URL,"${url}",Found,,,`);
    });
    
    session.external_urls.forEach(url => {
      rows.push(`External URL,"${url}",Found,,,`);
    });
    
    // Content if included
    if (options.includeContent) {
      session.scraped_content.forEach(content => {
        rows.push(`Content,"${content.url}",${content.success ? 'Downloaded' : 'Failed'},"${content.content_type}",${content.file_size || ''},"${content.downloaded_at}"`);
      });
    }
    
    return rows.join('\n');
  }

  private exportAsText(session: ScrapeResult, options: ExportOptions): string {
    const lines: string[] = [];
    
    lines.push(`Web Scraper Results - ${session.domain}`);
    lines.push(`Session ID: ${session.session_id}`);
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push('');
    
    if (options.includeStatistics && session.statistics) {
      lines.push('STATISTICS:');
      lines.push(`- Total Pages Scraped: ${session.statistics.total_pages_scraped}`);
      lines.push(`- Total URLs Found: ${session.statistics.total_urls_found}`);
      lines.push(`- External URLs Found: ${session.statistics.external_urls_found}`);
      lines.push(`- Content Downloaded: ${session.statistics.content_downloaded}`);
      lines.push(`- Total File Size: ${this.formatFileSize(session.statistics.total_file_size || 0)}`);
      lines.push(`- Duration: ${session.statistics.duration_seconds} seconds`);
      lines.push('');
    }
    
    lines.push(`INTERNAL URLS (${session.urls.length}):`);
    session.urls.forEach(url => lines.push(`- ${url}`));
    lines.push('');
    
    if (session.external_urls.length > 0) {
      lines.push(`EXTERNAL URLS (${session.external_urls.length}):`);
      session.external_urls.forEach(url => lines.push(`- ${url}`));
      lines.push('');
    }
    
    if (options.includeContent && session.scraped_content.length > 0) {
      lines.push(`DOWNLOADED CONTENT (${session.scraped_content.length}):`);
      session.scraped_content.forEach(content => {
        lines.push(`- ${content.url}`);
        lines.push(`  Type: ${content.content_type}`);
        lines.push(`  Size: ${this.formatFileSize(content.file_size || 0)}`);
        lines.push(`  Status: ${content.success ? 'Success' : 'Failed'}`);
        if (content.error) lines.push(`  Error: ${content.error}`);
        lines.push('');
      });
    }
    
    return lines.join('\n');
  }

  private exportMultipleSessionsAsCSV(sessions: ScrapeResult[], options: ExportOptions): string {
    const rows: string[] = [];
    
    // Header
    rows.push('Session ID,Domain,Total URLs,External URLs,Content Downloaded,Duration (seconds),Status');
    
    sessions.forEach(session => {
      rows.push([
        session.session_id,
        session.domain,
        session.urls.length.toString(),
        session.external_urls.length.toString(),
        session.scraped_content.length.toString(),
        session.statistics.duration_seconds?.toString() || '0',
        session.status.status
      ].map(field => `"${field}"`).join(','));
    });
    
    return rows.join('\n');
  }

  private contentToCSV(content: ScrapedContent[]): string {
    const rows: string[] = [];
    
    // Header
    rows.push('URL,Content Type,File Size,MIME Type,Title,Success,Downloaded At,Error');
    
    content.forEach(item => {
      rows.push([
        item.url,
        item.content_type,
        item.file_size?.toString() || '',
        item.mime_type || '',
        item.title || '',
        item.success.toString(),
        item.downloaded_at,
        item.error || ''
      ].map(field => `"${field}"`).join(','));
    });
    
    return rows.join('\n');
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    console.log(`📥 Downloaded: ${filename}`);
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Export singleton instance
export const exportService = new ExportService();

// Export class for testing
export { ExportService };
