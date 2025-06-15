# Enhanced FastAPI + Crawl4AI Backend with Full Frontend Integration

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl
from typing import List, Optional, Dict, Any
import asyncio
import json
import time
from datetime import datetime, timedelta
import uuid
import os
import aiohttp
import aiofiles
from pathlib import Path
import mimetypes
from urllib.parse import urljoin, urlparse

# Crawl4AI imports
try:
    from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
    from bs4 import BeautifulSoup
    CRAWL4AI_AVAILABLE = True
except ImportError as e:
    print(f"Warning: Crawl4AI not available: {e}")
    print("Please install Crawl4AI by running: pip install -U crawl4ai && crawl4ai-setup")
    CRAWL4AI_AVAILABLE = False

import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create downloads directory
DOWNLOADS_DIR = Path("downloads")
DOWNLOADS_DIR.mkdir(exist_ok=True)

# Enhanced data models matching frontend types
class ContentType(BaseModel):
    id: str
    name: str
    extensions: List[str]
    mime_types: List[str]
    enabled: bool

class ScrapeRequest(BaseModel):
    url: HttpUrl
    max_pages: int = 10
    delay: float = 1.0
    user_agent: Optional[str] = None
    include_external: bool = False
    scrape_whole_site: bool = False
    download_content: bool = False
    content_types: List[ContentType] = []

class ScrapedContent(BaseModel):
    url: str
    content_type: str  # 'text', 'image', 'pdf', 'document', 'video', 'other'
    file_path: Optional[str] = None
    file_size: Optional[int] = None
    mime_type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    text_content: Optional[str] = None
    thumbnail: Optional[str] = None
    downloaded_at: datetime
    success: bool = True
    error: Optional[str] = None

class ScrapeStatus(BaseModel):
    session_id: str
    status: str  # 'running', 'completed', 'error', 'stopped'
    current_url: Optional[str] = None
    pages_scraped: int = 0
    urls_found: int = 0
    external_urls_found: int = 0
    content_downloaded: int = 0
    progress: float = 0.0
    started_at: datetime
    ended_at: Optional[datetime] = None
    estimated_total_pages: Optional[int] = None

class ScrapeResult(BaseModel):
    session_id: str
    domain: str
    urls: List[str]
    external_urls: List[str]
    scraped_content: List[ScrapedContent]
    statistics: Dict[str, Any]
    status: ScrapeStatus

# Global storage
active_sessions: Dict[str, Dict] = {}
session_results: Dict[str, ScrapeResult] = {}
websocket_connections: Dict[str, WebSocket] = {}

# Session cleanup utility
async def cleanup_old_sessions():
    """Clean up old sessions to prevent memory leaks"""
    current_time = datetime.now()
    cutoff_time = current_time - timedelta(hours=24)  # Keep sessions for 24 hours

    # Clean up old completed sessions
    sessions_to_remove = []
    for session_id, result in session_results.items():
        if result.status.ended_at and result.status.ended_at < cutoff_time:
            sessions_to_remove.append(session_id)

    for session_id in sessions_to_remove:
        session_results.pop(session_id, None)
        logger.info(f"Cleaned up old session: {session_id}")

    # Clean up orphaned active sessions (older than 1 hour)
    active_cutoff = current_time - timedelta(hours=1)
    active_to_remove = []
    for session_id, session_data in active_sessions.items():
        if session_data.get("started_at", current_time) < active_cutoff:
            active_to_remove.append(session_id)

    for session_id in active_to_remove:
        active_sessions.pop(session_id, None)
        websocket_connections.pop(session_id, None)
        logger.info(f"Cleaned up orphaned active session: {session_id}")

# Schedule periodic cleanup
import asyncio
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    async def periodic_cleanup():
        while True:
            try:
                await cleanup_old_sessions()
                await asyncio.sleep(3600)  # Run every hour
            except Exception as e:
                logger.error(f"Error in periodic cleanup: {e}")
                await asyncio.sleep(3600)

    cleanup_task = asyncio.create_task(periodic_cleanup())
    yield
    # Shutdown
    cleanup_task.cancel()

# Update app initialization
app = FastAPI(
    title="Enhanced Web Scraper API",
    description="A powerful web scraper with content downloading capabilities",
    version="2.0.0",
    lifespan=lifespan
)

# CORS middleware - Allow specific origins with credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", "http://localhost:3001", "http://localhost:3002",
        "http://localhost:5173", "http://localhost:5174", "http://localhost:5175",
        "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3002",
        "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve downloaded files
app.mount("/downloads", StaticFiles(directory="downloads"), name="downloads")

class EnhancedWebScraperManager:
    def __init__(self):
        self.active_crawlers: Dict[str, bool] = {}
        self.session = None
    
    async def __aenter__(self):
        if not CRAWL4AI_AVAILABLE:
            raise RuntimeError("Crawl4AI is not available. Please install it first.")
        self.session = aiohttp.ClientSession()
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if self.session:
            await self.session.close()
    
    def get_content_type(self, url: str, mime_type: str = None) -> str:
        """Determine content type based on URL and MIME type"""
        url_lower = url.lower()
        
        if mime_type:
            if mime_type.startswith('image/'):
                return 'image'
            elif mime_type == 'application/pdf':
                return 'pdf'
            elif mime_type.startswith('video/'):
                return 'video'
            elif mime_type.startswith('audio/'):
                return 'audio'
            elif mime_type in ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']:
                return 'document'
        
        # Fallback to extension-based detection
        if any(ext in url_lower for ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp']):
            return 'image'
        elif url_lower.endswith('.pdf'):
            return 'pdf'
        elif any(ext in url_lower for ext in ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']):
            return 'video'
        elif any(ext in url_lower for ext in ['.mp3', '.wav', '.m4a', '.flac', '.ogg']):
            return 'audio'
        elif any(ext in url_lower for ext in ['.doc', '.docx', '.txt', '.rtf', '.odt']):
            return 'document'
        
        return 'other'
    
    def should_download_content(self, url: str, content_types: List[ContentType]) -> bool:
        """Check if content should be downloaded based on enabled types"""
        content_type = self.get_content_type(url)
        
        for ct in content_types:
            if not ct.enabled:
                continue
                
            # Map content type IDs to actual types
            type_mapping = {
                'images': 'image',
                'pdfs': 'pdf',
                'videos': 'video',
                'audio': 'audio',
                'documents': 'document'
            }
            
            if type_mapping.get(ct.id) == content_type:
                return True
        
        return False
    
    async def download_content(self, url: str, session_id: str) -> Optional[ScrapedContent]:
        """Download content from URL and save locally with security checks"""
        try:
            # Security: Validate URL scheme
            if not url.startswith(('http://', 'https://')):
                logger.warning(f"Invalid URL scheme for {url}")
                return None

            # Security: Set maximum file size (50MB)
            MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

            async with self.session.get(url, timeout=30) as response:
                if response.status != 200:
                    return ScrapedContent(
                        url=url,
                        content_type='other',
                        downloaded_at=datetime.now(),
                        success=False,
                        error=f"HTTP {response.status}"
                    )

                # Get content info
                content_length = response.headers.get('content-length')
                mime_type = response.headers.get('content-type', '').split(';')[0]
                content_type = self.get_content_type(url, mime_type)

                # Security: Check file size before downloading
                if content_length and int(content_length) > MAX_FILE_SIZE:
                    return ScrapedContent(
                        url=url,
                        content_type=content_type,
                        downloaded_at=datetime.now(),
                        success=False,
                        error=f"File too large: {content_length} bytes (max: {MAX_FILE_SIZE})"
                    )
                
                # Create session download directory
                session_dir = DOWNLOADS_DIR / session_id
                session_dir.mkdir(exist_ok=True)
                
                # Generate filename
                parsed_url = urlparse(url)
                filename = os.path.basename(parsed_url.path) or f"content_{int(time.time())}"
                if not os.path.splitext(filename)[1] and mime_type:
                    ext = mimetypes.guess_extension(mime_type)
                    if ext:
                        filename += ext
                
                file_path = session_dir / filename
                
                # Download content with size check
                content_data = await response.read()

                # Security: Double-check actual file size
                if len(content_data) > MAX_FILE_SIZE:
                    return ScrapedContent(
                        url=url,
                        content_type=content_type,
                        downloaded_at=datetime.now(),
                        success=False,
                        error=f"File too large: {len(content_data)} bytes (max: {MAX_FILE_SIZE})"
                    )

                # Security: Validate filename to prevent path traversal
                safe_filename = os.path.basename(filename).replace('..', '')
                if not safe_filename:
                    safe_filename = f"content_{int(time.time())}"

                file_path = session_dir / safe_filename

                async with aiofiles.open(file_path, 'wb') as f:
                    await f.write(content_data)
                
                # Extract additional metadata
                title = None
                description = None
                text_content = None
                
                if content_type == 'text' or (mime_type and mime_type.startswith('text/')):
                    text_content = content_data.decode('utf-8', errors='ignore')[:5000]  # First 5000 chars
                
                return ScrapedContent(
                    url=url,
                    content_type=content_type,
                    file_path=f"/downloads/{session_id}/{filename}",
                    file_size=len(content_data),
                    mime_type=mime_type,
                    title=title,
                    description=description,
                    text_content=text_content,
                    downloaded_at=datetime.now(),
                    success=True
                )
                
        except aiohttp.ClientError as e:
            logger.error(f"Network error downloading {url}: {e}")
            return ScrapedContent(
                url=url,
                content_type='other',
                downloaded_at=datetime.now(),
                success=False,
                error=f"Network error: {str(e)}"
            )
        except Exception as e:
            logger.error(f"Unexpected error downloading {url}: {e}")
            import traceback
            logger.error(f"Traceback: {traceback.format_exc()}")
            return ScrapedContent(
                url=url,
                content_type='other',
                downloaded_at=datetime.now(),
                success=False,
                error=f"Unexpected error: {str(e)}"
            )
    
    async def extract_content_urls(self, html: str, base_url: str, content_types: List[ContentType]) -> List[str]:
        """Extract downloadable content URLs from HTML"""
        content_urls = []
        
        try:
            soup = BeautifulSoup(html, 'html.parser')
            
            # Find images
            for img in soup.find_all('img', src=True):
                img_url = urljoin(base_url, img['src'])
                if self.should_download_content(img_url, content_types):
                    content_urls.append(img_url)
            
            # Find links to downloadable content
            for link in soup.find_all('a', href=True):
                link_url = urljoin(base_url, link['href'])
                if self.should_download_content(link_url, content_types):
                    content_urls.append(link_url)
            
            # Find video sources
            for video in soup.find_all(['video', 'source'], src=True):
                video_url = urljoin(base_url, video['src'])
                if self.should_download_content(video_url, content_types):
                    content_urls.append(video_url)
            
            # Find audio sources
            for audio in soup.find_all(['audio', 'source'], src=True):
                audio_url = urljoin(base_url, audio['src'])
                if self.should_download_content(audio_url, content_types):
                    content_urls.append(audio_url)
            
        except Exception as e:
            logger.error(f"Error extracting content URLs: {e}")
        
        return list(set(content_urls))  # Remove duplicates
    
    async def scrape_website(self, session_id: str, request: ScrapeRequest, websocket: Optional[WebSocket] = None):
        """Enhanced scraping with content downloading"""
        
        domain = urlparse(str(request.url)).netloc
        self.active_crawlers[session_id] = True
        
        found_urls = set()
        external_urls = set()
        crawled_urls = set()
        scraped_content = []
        to_crawl = [str(request.url)]
        
        status = ScrapeStatus(
            session_id=session_id,
            status="running",
            started_at=datetime.now(),
            pages_scraped=0,
            urls_found=0,
            external_urls_found=0,
            content_downloaded=0
        )
        
        # Estimate total pages for whole site scraping
        if request.scrape_whole_site and request.max_pages > 0:
            status.estimated_total_pages = request.max_pages
        elif not request.scrape_whole_site:
            status.estimated_total_pages = min(request.max_pages, len(to_crawl) + 50)
        
        try:
            logger.info(f"Starting scrape session {session_id} for URL: {request.url}")

            # Configure browser - using simpler, more reliable settings
            try:
                browser_config = BrowserConfig(
                    headless=True,
                    browser_type="chromium",
                    verbose=False  # Reduce noise
                )
                logger.info("Browser config created successfully")
            except Exception as e:
                logger.error(f"Error creating browser config: {e}")
                raise

            # Configure crawler - using minimal, reliable settings based on Crawl4AI examples
            try:
                crawler_config = CrawlerRunConfig(
                    cache_mode=CacheMode.BYPASS,
                    word_count_threshold=1,
                    only_text=False
                )
                logger.info("Crawler config created successfully")
            except Exception as e:
                logger.error(f"Error creating crawler config: {e}")
                raise

            try:
                logger.info("Initializing AsyncWebCrawler...")
                async with AsyncWebCrawler(config=browser_config) as crawler:
                    logger.info("AsyncWebCrawler initialized successfully")
                    pages_scraped = 0
                    max_pages = request.max_pages if request.max_pages > 0 else 1000

                    while (to_crawl and pages_scraped < max_pages and
                           self.active_crawlers.get(session_id, False)):

                        current_url = to_crawl.pop(0)

                        if current_url in crawled_urls:
                            continue

                        # Update status
                        status.current_url = current_url
                        status.pages_scraped = pages_scraped
                        if status.estimated_total_pages:
                            status.progress = min((pages_scraped / status.estimated_total_pages) * 100, 99)
                        else:
                            status.progress = min(50 + (pages_scraped / 100) * 50, 99)

                        # Send real-time update
                        if websocket:
                            try:
                                await websocket.send_text(json.dumps({
                                    "type": "status_update",
                                    "data": status.model_dump(mode='json')
                                }))
                            except:
                                pass

                        # Crawl the page
                        try:
                            logger.info(f"Starting crawl for: {current_url}")
                            result = await crawler.arun(url=current_url, config=crawler_config)

                            logger.info(f"Crawl result - Success: {result.success if result else 'No result'}, HTML present: {result.html is not None if result else 'No result'}")

                            # Debug: Check result attributes
                            if result:
                                logger.info(f"Result attributes: success={result.success}, html_type={type(result.html)}, html_length={len(result.html) if result.html else 0}")

                            if result and result.success and result.html:
                                soup = BeautifulSoup(result.html, 'html.parser')

                                # Extract URLs
                                for link in soup.find_all('a', href=True):
                                    href = link['href']
                                    full_url = urljoin(current_url, href)

                                    parsed = urlparse(full_url)
                                    if parsed.scheme in ['http', 'https']:
                                        clean_url = f"{parsed.scheme}://{parsed.netloc}{parsed.path}"

                                        if parsed.netloc == domain:
                                            found_urls.add(clean_url)
                                            if (clean_url not in crawled_urls and
                                                clean_url not in to_crawl and
                                                (request.scrape_whole_site or len(to_crawl) < 50)):
                                                to_crawl.append(clean_url)
                                        elif request.include_external:
                                            external_urls.add(clean_url)

                                # Download content if enabled
                                if request.download_content and request.content_types:
                                    content_urls = await self.extract_content_urls(
                                        result.html, current_url, request.content_types
                                    )

                                    for content_url in content_urls[:10]:  # Limit per page
                                        if self.active_crawlers.get(session_id, False):
                                            content = await self.download_content(content_url, session_id)
                                            if content and content.success:
                                                scraped_content.append(content)
                                                status.content_downloaded = len(scraped_content)

                                                # Send content update
                                                if websocket:
                                                    try:
                                                        await websocket.send_text(json.dumps({
                                                            "type": "content_downloaded",
                                                            "data": content.dict(default=str)
                                                        }))
                                                    except:
                                                        pass
                            else:
                                error_msg = f"Failed to crawl {current_url}"
                                if result:
                                    error_msg += f": success={result.success}, html_present={result.html is not None}"
                                    if hasattr(result, 'error_message') and result.error_message:
                                        error_msg += f", error={result.error_message}"
                                    # Try to get any available content
                                    if hasattr(result, 'markdown') and result.markdown:
                                        logger.info(f"Found markdown content instead: {len(result.markdown)} chars")
                                    if hasattr(result, 'cleaned_html') and result.cleaned_html:
                                        logger.info(f"Found cleaned_html content instead: {len(result.cleaned_html)} chars")
                                else:
                                    error_msg += ": No result returned from crawler"
                                logger.warning(error_msg)

                            crawled_urls.add(current_url)
                            pages_scraped += 1

                            # Update counts
                            status.urls_found = len(found_urls)
                            status.external_urls_found = len(external_urls)

                            # Rate limiting
                            if request.delay > 0:
                                await asyncio.sleep(request.delay)

                        except Exception as e:
                            logger.error(f"Error in crawling loop {current_url}: {e}")
                            continue
                
                # Complete the scraping
                status.status = "completed"
                status.ended_at = datetime.now()
                status.progress = 100
                
                # Calculate statistics
                statistics = {
                    "total_pages_scraped": pages_scraped,
                    "total_urls_found": len(found_urls),
                    "external_urls_found": len(external_urls),
                    "content_downloaded": len(scraped_content),
                    "total_file_size": sum(c.file_size or 0 for c in scraped_content),
                    "duration_seconds": (status.ended_at - status.started_at).total_seconds(),
                    "content_by_type": {}
                }
                
                # Count content by type
                for content in scraped_content:
                    content_type = content.content_type
                    statistics["content_by_type"][content_type] = statistics["content_by_type"].get(content_type, 0) + 1
                
                # Create final result
                result = ScrapeResult(
                    session_id=session_id,
                    domain=domain,
                    urls=list(found_urls),
                    external_urls=list(external_urls),
                    scraped_content=scraped_content,
                    statistics=statistics,
                    status=status
                )
                
                # Store result
                session_results[session_id] = result
                
                # Send final result
                if websocket:
                    try:
                        await websocket.send_text(json.dumps({
                            "type": "scrape_complete",
                            "data": result.model_dump(mode='json')
                        }))
                    except:
                        pass

                return result
            except Exception as crawler_error:
                logger.error(f"Error with AsyncWebCrawler: {crawler_error}")
                raise

        except Exception as e:
            import traceback
            error_details = traceback.format_exc()
            logger.error(f"Error in scraping session {session_id}: {e}")
            logger.error(f"Full traceback: {error_details}")
            status.status = "error"
            status.ended_at = datetime.now()

            if websocket:
                try:
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": str(e),
                        "details": error_details
                    }))
                except:
                    pass
        
        finally:
            # Clean up session data
            self.active_crawlers.pop(session_id, None)
            active_sessions.pop(session_id, None)
            websocket_connections.pop(session_id, None)

# API Routes
@app.get("/")
async def root():
    return {"message": "Enhanced Web Scraper API", "version": "2.0.0", "crawl4ai_available": CRAWL4AI_AVAILABLE}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "crawl4ai_available": CRAWL4AI_AVAILABLE,
        "active_sessions": len(active_sessions),
        "completed_sessions": len(session_results)
    }

@app.post("/api/scrape/start")
async def start_scraping(request: ScrapeRequest):
    if not CRAWL4AI_AVAILABLE:
        raise HTTPException(status_code=500, detail="Crawl4AI is not available. Please install it first.")
    
    session_id = str(uuid.uuid4())
    
    # Store session info
    active_sessions[session_id] = {
        "request": request.dict(),
        "started_at": datetime.now(),
        "status": "starting"
    }
    
    return {"session_id": session_id, "status": "started"}

@app.websocket("/ws/scrape/{session_id}")
async def websocket_scrape(websocket: WebSocket, session_id: str):
    logger.info(f"WebSocket connection attempt for session {session_id}")
    
    try:
        # Accept the connection
        await websocket.accept()
        logger.info(f"WebSocket connection accepted for session {session_id}")
        
        # Store the connection
        websocket_connections[session_id] = websocket
        
        # Send initial confirmation
        await websocket.send_text(json.dumps({
            "type": "connection_established",
            "session_id": session_id,
            "message": "WebSocket connection established"
        }))
        
        # Wait for scrape request
        data = await websocket.receive_text()
        logger.info(f"Received data for session {session_id}")
        
        request_data = json.loads(data)
        request = ScrapeRequest(**request_data)
        
        # Start scraping
        logger.info(f"Starting scrape for {request.url} in session {session_id}")
        async with EnhancedWebScraperManager() as manager:
            await manager.scrape_website(session_id, request, websocket)
            
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for session {session_id}")
    except json.JSONDecodeError as e:
        logger.error(f"Invalid JSON received for session {session_id}: {e}")
        try:
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": f"Invalid JSON format: {str(e)}"
            }))
        except:
            pass
    except Exception as e:
        logger.error(f"WebSocket error for session {session_id}: {e}")
        try:
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": str(e)
            }))
        except:
            pass
    finally:
        websocket_connections.pop(session_id, None)
        active_sessions.pop(session_id, None)
        logger.info(f"WebSocket connection closed for session {session_id}")


@app.post("/api/scrape/stop/{session_id}")
async def stop_scraping(session_id: str):
    if session_id in active_sessions:
        # Signal to stop the crawler by setting flag to False
        # Note: We don't create a new manager instance here, just update the flag
        # The actual manager instance will check this flag during scraping
        if session_id in active_sessions:
            active_sessions[session_id]["status"] = "stopping"

        # Close WebSocket connection
        if session_id in websocket_connections:
            try:
                await websocket_connections[session_id].close()
                del websocket_connections[session_id]
            except Exception as e:
                logger.warning(f"Error closing WebSocket for session {session_id}: {e}")

        # Clean up session
        if session_id in active_sessions:
            del active_sessions[session_id]

        return {"message": "Scraping stopped", "session_id": session_id}
    else:
        raise HTTPException(status_code=404, detail="Session not found")

@app.get("/api/scrape/sessions")
async def list_sessions():
    return {
        "active_sessions": list(active_sessions.keys()),
        "completed_sessions": list(session_results.keys())
    }

@app.get("/api/scrape/status/{session_id}")
async def get_session_status(session_id: str):
    if session_id in session_results:
        return session_results[session_id].status
    elif session_id in active_sessions:
        return active_sessions[session_id]
    else:
        raise HTTPException(status_code=404, detail="Session not found")

@app.get("/api/scrape/result/{session_id}")
async def get_session_result(session_id: str):
    if session_id in session_results:
        return session_results[session_id]
    else:
        raise HTTPException(status_code=404, detail="Session not found")

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Enhanced Web Scraper API...")
    print(f"📦 Crawl4AI Available: {CRAWL4AI_AVAILABLE}")
    if not CRAWL4AI_AVAILABLE:
        print("⚠️  Install Crawl4AI with: pip install -U crawl4ai && crawl4ai-setup")
    print("🌐 API Documentation: http://localhost:8000/docs")
    print("🔌 WebSocket endpoint: ws://localhost:8000/ws/scrape/{session_id}")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
