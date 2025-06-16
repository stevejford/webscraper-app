import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { createClient } from '@supabase/supabase-js';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { createHash } from 'crypto';
import { URL } from 'url';

// Initialize Express app
const app = express();
const server = createServer(app);

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));
app.use(express.json());

// Supabase client
const supabase = createClient(
  'https://jeymatvbyfaxhxztbjsw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpleW1hdHZieWZheGh4enRianN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAwMjUyOSwiZXhwIjoyMDY1NTc4NTI5fQ.MLCW3Ewz9jTRHBOgkgzbOUzTJqRoow4u6uRps0v2Jjk'
);

// WebSocket server
const wss = new WebSocketServer({ server });

// Global state
const activeSessions = new Map();
const wsConnections = new Map();
let browser = null;

// Initialize Puppeteer
async function initBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu'
      ]
    });
  }
  return browser;
}

// WebSocket connection handler
wss.on('connection', (ws, req) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const sessionId = url.pathname.split('/').pop();
  
  console.log(`🔌 WebSocket connected for session: ${sessionId}`);
  wsConnections.set(sessionId, ws);
  
  ws.send(JSON.stringify({
    type: 'connection_established',
    sessionId
  }));
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log(`📨 Received message for session ${sessionId}:`, data);
      
      // Handle different message types
      if (data.type === 'start_scraping') {
        await startScraping(sessionId, data.config);
      } else if (data.type === 'pause_scraping') {
        pauseScraping(sessionId);
      } else if (data.type === 'resume_scraping') {
        resumeScraping(sessionId);
      } else if (data.type === 'stop_scraping') {
        stopScraping(sessionId);
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Failed to process message'
      }));
    }
  });
  
  ws.on('close', () => {
    console.log(`🔌 WebSocket disconnected for session: ${sessionId}`);
    wsConnections.delete(sessionId);
  });
});

// Send WebSocket message
function sendWSMessage(sessionId, message) {
  const ws = wsConnections.get(sessionId);
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify(message));
  }
}

// Real web scraping function
async function startScraping(sessionId, config) {
  console.log(`🚀 Starting real scraping for session ${sessionId}`);
  
  try {
    // Create session in Supabase using enhanced schema
    const { data: session, error: sessionError } = await supabase
      .rpc('start_scraping_session', {
        p_session_id: sessionId,
        p_target_url: config.url,
        p_config: config,
        p_user_id: null  // Anonymous user
      });

    if (sessionError) {
      console.error('Database function failed, trying fallback:', sessionError);
      // Fallback to direct insert
      const { data: fallbackSession, error: fallbackError } = await supabase
        .from('scraping_sessions')
        .insert({
          id: sessionId,
          user_id: null,
          target_url: config.url,
          status: 'running',
          config,
          progress: {
            pages_scraped: 0,
            urls_found: 0,
            content_downloaded: 0,
            total_file_size: 0
          }
        })
        .select()
        .single();

      if (fallbackError) {
        console.error('Fallback session creation also failed:', fallbackError);
        throw fallbackError;
      }
      console.log('✅ Session created using fallback method');
    } else {
      console.log('✅ Session created using database function');
    }

    activeSessions.set(sessionId, { status: 'running', config });

    // Initialize browser
    const browserInstance = await initBrowser();
    const page = await browserInstance.newPage();

    // Set user agent if provided
    if (config.user_agent) {
      await page.setUserAgent(config.user_agent);
    }

    // Navigate to the URL
    console.log(`📄 Scraping ${config.url}`);
    await page.goto(config.url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Get page content
    const html = await page.content();
    const $ = cheerio.load(html);

    // Extract page data
    const title = $('title').text() || '';
    const content = $('body').text().trim();

    // Save page content to Supabase using enhanced schema
    const { error: pageError } = await supabase
      .from('scraped_pages')
      .insert({
        id: uuidv4(),
        session_id: sessionId,
        url: config.url,
        status: 'scraped',
        http_status: 200,
        scraped_at: new Date().toISOString(),
        extracted_data: {
          title: title,
          content_length: content.length,
          html_length: html.length
        },
        // Legacy compatibility fields
        title,
        text_content: content,
        html_content: html,
        content,
        metadata: {
          content_length: content.length,
          scraped_at: new Date().toISOString()
        }
      });

    if (pageError) {
      console.error('Error saving page:', pageError);
    }

    // Extract and download content
    let contentDownloaded = 0;
    let totalFileSize = 0;

    if (config.download_content) {
      // Extract image URLs
      const imageUrls = [];
      $('img[src]').each((_, element) => {
        const src = $(element).attr('src');
        if (src) {
          try {
            const absoluteUrl = new URL(src, config.url).href;
            imageUrls.push(absoluteUrl);
          } catch (e) {
            // Invalid URL, skip
          }
        }
      });

      console.log(`🖼️ Found ${imageUrls.length} images to download`);

      // Download images
      for (const imageUrl of imageUrls.slice(0, 10)) { // Limit to 10 images for demo
        try {
          const fileInfo = await downloadAndStoreFile(sessionId, imageUrl, config.url);
          if (fileInfo) {
            contentDownloaded++;
            totalFileSize += fileInfo.size;
            
            // Send progress update
            sendWSMessage(sessionId, {
              type: 'scrape_progress',
              data: {
                sessionId,
                status: 'running',
                pages_scraped: 1,
                urls_found: imageUrls.length,
                content_downloaded: contentDownloaded,
                total_file_size: totalFileSize,
                current_url: imageUrl
              }
            });
          }
        } catch (error) {
          console.error(`Failed to download ${imageUrl}:`, error);
        }
      }
    }

    // Update session statistics
    const finalStats = {
      pages_scraped: 1,
      urls_found: imageUrls?.length || 0,
      content_downloaded: contentDownloaded,
      total_file_size: totalFileSize
    };

    // Complete session using enhanced schema
    try {
      await supabase.rpc('complete_scraping_session', {
        p_session_id: sessionId,
        p_summary_results: {
          completion_time: new Date().toISOString(),
          final_statistics: finalStats
        }
      });
      console.log('✅ Session completed using database function');
    } catch (funcError) {
      console.log('Database function failed, using direct update:', funcError);
      await supabase
        .from('scraping_sessions')
        .update({
          status: 'completed',
          end_time: new Date().toISOString(),
          progress: {
            pages_scraped: finalStats.pages_scraped,
            urls_found: finalStats.urls_found,
            content_downloaded: finalStats.content_downloaded,
            total_file_size: finalStats.total_file_size
          },
          summary_results: {
            completion_time: new Date().toISOString(),
            final_statistics: finalStats
          },
          // Legacy compatibility
          statistics: finalStats,
          completed_at: new Date().toISOString()
        })
        .eq('id', sessionId);
    }

    // Send completion message
    sendWSMessage(sessionId, {
      type: 'scrape_complete',
      data: {
        sessionId,
        status: 'completed',
        statistics: finalStats,
        scraped_content: [], // Will be populated from database
        page_contents: [{ url: config.url, title, content }]
      }
    });

    console.log(`✅ Scraping completed for session ${sessionId}`);
    activeSessions.delete(sessionId);
    await page.close();

  } catch (error) {
    console.error(`❌ Scraping failed for session ${sessionId}:`, error);
    
    // Update session status
    await supabase
      .from('scraping_sessions')
      .update({ status: 'failed' })
      .eq('id', sessionId);

    // Send error message
    sendWSMessage(sessionId, {
      type: 'scrape_error',
      data: {
        sessionId,
        error: error.message
      }
    });

    activeSessions.delete(sessionId);
  }
}

// Download and store file in Supabase Storage
async function downloadAndStoreFile(sessionId, url, sourceUrl) {
  try {
    console.log(`📥 Downloading ${url}`);
    
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
      maxContentLength: 10 * 1024 * 1024 // 10MB limit
    });

    const buffer = Buffer.from(response.data);
    const contentHash = createHash('sha256').update(buffer).digest('hex');
    
    // Generate filename
    const urlObj = new URL(url);
    const fileName = urlObj.pathname.split('/').pop() || `file_${Date.now()}`;
    const filePath = `${sessionId}/${fileName}`;
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('scraped-content')
      .upload(filePath, buffer, {
        contentType: response.headers['content-type'] || 'application/octet-stream',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('scraped-content')
      .getPublicUrl(filePath);

    // Save file metadata to database
    const { error: dbError } = await supabase
      .from('stored_files')
      .insert({
        id: uuidv4(),
        session_id: sessionId,
        original_url: url,
        file_name: fileName,
        file_path: filePath,
        file_size: buffer.length,
        mime_type: response.headers['content-type'] || 'application/octet-stream',
        content_hash: contentHash,
        public_url: publicUrl,
        is_deduped: false
      });

    if (dbError) {
      console.error('Database error:', dbError);
    }

    console.log(`✅ Downloaded and stored: ${fileName}`);
    return {
      fileName,
      size: buffer.length,
      url: publicUrl
    };

  } catch (error) {
    console.error(`Failed to download ${url}:`, error);
    return null;
  }
}

// Control functions
function pauseScraping(sessionId) {
  const session = activeSessions.get(sessionId);
  if (session) {
    session.status = 'paused';
    console.log(`⏸️ Paused session ${sessionId}`);
  }
}

function resumeScraping(sessionId) {
  const session = activeSessions.get(sessionId);
  if (session) {
    session.status = 'running';
    console.log(`▶️ Resumed session ${sessionId}`);
  }
}

function stopScraping(sessionId) {
  activeSessions.delete(sessionId);
  console.log(`⏹️ Stopped session ${sessionId}`);
}

// REST API Routes
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    active_sessions: activeSessions.size,
    websocket_connections: wsConnections.size
  });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Web Scraper Node.js Backend with Supabase',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      websocket: 'ws://localhost:8000/ws/scrape/{sessionId}'
    }
  });
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket endpoint: ws://localhost:${PORT}/ws/scrape/{sessionId}`);
  console.log(`📊 Supabase connected`);
  console.log(`🤖 Puppeteer ready for scraping`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🛑 Shutting down server...');
  if (browser) {
    await browser.close();
  }
  server.close(() => {
    console.log('✅ Server shut down gracefully');
    process.exit(0);
  });
});
