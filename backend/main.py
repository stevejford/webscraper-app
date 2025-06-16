# Enhanced FastAPI + Crawl4AI Backend with Supabase Integration

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
import hashlib

# Supabase integration
from supabase import create_client, Client

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

# Initialize Supabase client
SUPABASE_URL = "https://jeymatvbyfaxhxztbjsw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpleW1hdHZieWZheGh4enRianN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAwMjUyOSwiZXhwIjoyMDY1NTc4NTI5fQ.MLCW3Ewz9jTRHBOgkgzbOUzTJqRoow4u6uRps0v2Jjk"

try:
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    logger.info("✅ Supabase client initialized successfully")
except Exception as e:
    logger.error(f"❌ Failed to initialize Supabase client: {e}")
    supabase = None

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
    # New fields for context linking
    source_page_url: Optional[str] = None  # Which page this content was found on
    alt_text: Optional[str] = None  # Alt text for images
    link_text: Optional[str] = None  # Link text for downloadable files
    context: Optional[str] = None  # Surrounding text context

class PageContent(BaseModel):
    """Represents the full content of a scraped page"""
    url: str
    title: Optional[str] = None
    html_content: str
    text_content: str
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    headings: List[str] = []
    links: List[str] = []
    images: List[str] = []
    media_files: List[str] = []
    scraped_at: datetime
    file_path: Optional[str] = None  # Path to saved HTML file

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
    page_contents: List[PageContent] = []  # New: Full page content with HTML
    statistics: Dict[str, Any]
    status: ScrapeStatus

# Global storage
active_sessions: Dict[str, Dict] = {}
session_results: Dict[str, ScrapeResult] = {}
websocket_connections: Dict[str, WebSocket] = {}

# Content deduplication registry
# Maps content hash -> (file_path, session_id, original_url, file_size)
content_hash_registry: Dict[str, tuple] = {}

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

        # Clean up content hash registry entries for this session
        hashes_to_remove = []
        for content_hash, (file_path, reg_session_id, url, file_size) in content_hash_registry.items():
            if reg_session_id == session_id:
                hashes_to_remove.append(content_hash)

        for content_hash in hashes_to_remove:
            content_hash_registry.pop(content_hash, None)

        logger.info(f"Cleaned up old session: {session_id} (removed {len(hashes_to_remove)} content hashes)")

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

@app.get("/health")
async def health_check():
    """Health check endpoint for testing"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "supabase_connected": supabase is not None,
        "crawl4ai_available": True
    }

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

    def calculate_content_hash(self, content_data: bytes) -> str:
        """Calculate SHA-256 hash of content for deduplication"""
        return hashlib.sha256(content_data).hexdigest()

    def check_duplicate_content(self, content_hash: str) -> Optional[tuple]:
        """Check if content with this hash already exists
        Returns (file_path, session_id, original_url, file_size) if found, None otherwise"""
        return content_hash_registry.get(content_hash)

    def register_content(self, content_hash: str, file_path: str, session_id: str, url: str, file_size: int):
        """Register content in the deduplication registry"""
        content_hash_registry[content_hash] = (file_path, session_id, url, file_size)
    
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

    async def save_page_content(self, url: str, html: str, session_id: str) -> PageContent:
        """Save full page content with HTML and extract metadata"""
        try:
            soup = BeautifulSoup(html, 'html.parser')

            # Extract page metadata
            title = soup.find('title')
            title_text = title.get_text().strip() if title else None

            meta_desc = soup.find('meta', attrs={'name': 'description'})
            meta_description = meta_desc.get('content') if meta_desc else None

            meta_keys = soup.find('meta', attrs={'name': 'keywords'})
            meta_keywords = meta_keys.get('content') if meta_keys else None

            # Extract headings
            headings = []
            for h in soup.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']):
                heading_text = h.get_text().strip()
                if heading_text:
                    headings.append(heading_text)

            # Extract all links
            links = []
            for link in soup.find_all('a', href=True):
                full_url = urljoin(url, link['href'])
                links.append(full_url)

            # Extract all images
            images = []
            for img in soup.find_all('img', src=True):
                img_url = urljoin(url, img['src'])
                images.append(img_url)

            # Extract media files
            media_files = []
            for media in soup.find_all(['video', 'audio', 'source'], src=True):
                media_url = urljoin(url, media['src'])
                media_files.append(media_url)

            # Extract clean text content
            for script in soup(["script", "style"]):
                script.decompose()
            text_content = soup.get_text()
            text_content = ' '.join(text_content.split())  # Clean whitespace

            # Save HTML file
            session_dir = DOWNLOADS_DIR / session_id
            session_dir.mkdir(exist_ok=True)

            # Create safe filename from URL
            parsed_url = urlparse(url)
            safe_filename = f"{parsed_url.netloc}_{parsed_url.path.replace('/', '_')}.html"
            safe_filename = safe_filename.replace('..', '').replace(':', '_')
            if not safe_filename.endswith('.html'):
                safe_filename += '.html'

            html_file_path = session_dir / safe_filename

            async with aiofiles.open(html_file_path, 'w', encoding='utf-8') as f:
                await f.write(html)

            # Save to Supabase
            await self.save_page_to_supabase(session_id, url, title_text or "", text_content, html)

            return PageContent(
                url=url,
                title=title_text,
                html_content=html,
                text_content=text_content[:10000],  # Limit text content
                meta_description=meta_description,
                meta_keywords=meta_keywords,
                headings=headings,
                links=links,
                images=images,
                media_files=media_files,
                scraped_at=datetime.now(),
                file_path=str(html_file_path.relative_to(DOWNLOADS_DIR))
            )

        except Exception as e:
            logger.error(f"Error saving page content for {url}: {e}")
            return PageContent(
                url=url,
                title=None,
                html_content=html,
                text_content="",
                scraped_at=datetime.now()
            )

    async def download_content(self, url: str, session_id: str, source_page_url: str = None, context: str = None) -> Optional[ScrapedContent]:
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

                # Check for duplicate content
                content_hash = self.calculate_content_hash(content_data)
                duplicate_info = self.check_duplicate_content(content_hash)

                if duplicate_info:
                    existing_file_path, existing_session_id, original_url, file_size = duplicate_info
                    logger.info(f"Duplicate content found for {url}, referencing existing file from {original_url}")

                    # Ensure the existing file path includes session folder for consistency
                    if not existing_file_path.startswith(existing_session_id + "/"):
                        corrected_existing_path = f"{existing_session_id}/{existing_file_path}"
                    else:
                        corrected_existing_path = existing_file_path

                    # Save a deduplicated record to the database for this session
                    await self.save_deduplicated_file_to_supabase(
                        session_id, url, corrected_existing_path, os.path.basename(existing_file_path),
                        file_size, mime_type, content_hash, original_url
                    )

                    # Return reference to existing file instead of downloading again
                    return ScrapedContent(
                        url=url,
                        content_type=content_type,
                        file_path=corrected_existing_path,  # Reference to existing file with correct path
                        file_size=file_size,
                        mime_type=mime_type,
                        downloaded_at=datetime.now(),
                        success=True,
                        source_page_url=source_page_url,
                        context=context[:500] if context else None,
                        # Add a note that this is a duplicate
                        description=f"Duplicate of content from {original_url}"
                    )

                # Security: Validate filename to prevent path traversal
                safe_filename = os.path.basename(filename).replace('..', '')
                if not safe_filename:
                    safe_filename = f"content_{int(time.time())}"

                file_path = session_dir / safe_filename

                # Save the new file
                async with aiofiles.open(file_path, 'wb') as f:
                    await f.write(content_data)

                # Save to Supabase Storage and Database
                await self.save_file_to_supabase(session_id, url, str(file_path), safe_filename, len(content_data), mime_type, content_hash)

                # Register the content in deduplication registry with session-based path
                session_based_path = f"{session_id}/{safe_filename}"
                self.register_content(content_hash, session_based_path, session_id, url, len(content_data))
                logger.info(f"Registered new content: {url} -> {safe_filename} (hash: {content_hash[:8]}...)")
                
                # Extract additional metadata
                title = None
                description = None
                text_content = None
                alt_text = None
                link_text = None

                if content_type == 'text' or (mime_type and mime_type.startswith('text/')):
                    text_content = content_data.decode('utf-8', errors='ignore')[:5000]  # First 5000 chars

                # Extract context information if source page is provided
                if source_page_url and context:
                    # Try to extract alt text or link text from context
                    try:
                        soup = BeautifulSoup(context, 'html.parser')
                        # Look for img with this src
                        img = soup.find('img', src=lambda x: x and url in x)
                        if img:
                            alt_text = img.get('alt', '')

                        # Look for link with this href
                        link = soup.find('a', href=lambda x: x and url in x)
                        if link:
                            link_text = link.get_text().strip()
                    except:
                        pass

                return ScrapedContent(
                    url=url,
                    content_type=content_type,
                    file_path=safe_filename,  # Store just filename, session_id is handled by API endpoint
                    file_size=len(content_data),
                    mime_type=mime_type,
                    title=title,
                    description=description,
                    text_content=text_content,
                    downloaded_at=datetime.now(),
                    success=True,
                    source_page_url=source_page_url,
                    alt_text=alt_text,
                    link_text=link_text,
                    context=context[:500] if context else None  # Limit context size
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
    
    async def extract_content_urls_with_context(self, html: str, base_url: str, content_types: List[ContentType]) -> List[tuple]:
        """Extract downloadable content URLs from HTML with context information"""
        content_items = []

        try:
            soup = BeautifulSoup(html, 'html.parser')

            # Find images with context
            for img in soup.find_all('img', src=True):
                img_url = urljoin(base_url, img['src'])
                if self.should_download_content(img_url, content_types):
                    # Get surrounding context
                    parent = img.parent
                    context_html = str(parent) if parent else str(img)
                    content_items.append((img_url, context_html))

            # Find links to downloadable content with context
            for link in soup.find_all('a', href=True):
                link_url = urljoin(base_url, link['href'])
                if self.should_download_content(link_url, content_types):
                    # Get the link and its surrounding context
                    parent = link.parent
                    context_html = str(parent) if parent else str(link)
                    content_items.append((link_url, context_html))

            # Find video sources with context
            for video in soup.find_all(['video', 'source'], src=True):
                video_url = urljoin(base_url, video['src'])
                if self.should_download_content(video_url, content_types):
                    # Get video element and its context
                    if video.name == 'source':
                        parent = video.parent  # Get the video element
                        context_html = str(parent) if parent else str(video)
                    else:
                        context_html = str(video)
                    content_items.append((video_url, context_html))

            # Find audio sources with context
            for audio in soup.find_all(['audio', 'source'], src=True):
                audio_url = urljoin(base_url, audio['src'])
                if self.should_download_content(audio_url, content_types):
                    # Get audio element and its context
                    if audio.name == 'source':
                        parent = audio.parent  # Get the audio element
                        context_html = str(parent) if parent else str(audio)
                    else:
                        context_html = str(audio)
                    content_items.append((audio_url, context_html))

        except Exception as e:
            logger.error(f"Error extracting content URLs: {e}")

        # Remove duplicates while preserving context
        seen_urls = set()
        unique_items = []
        for url, context in content_items:
            if url not in seen_urls:
                seen_urls.add(url)
                unique_items.append((url, context))

        return unique_items

    async def extract_content_urls(self, html: str, base_url: str, content_types: List[ContentType]) -> List[str]:
        """Extract downloadable content URLs from HTML (backward compatibility)"""
        items = await self.extract_content_urls_with_context(html, base_url, content_types)
        return [url for url, context in items]
    
    async def save_session_to_supabase(self, session_id: str, request: ScrapeRequest, status: str = "running"):
        """Save session data to Supabase"""
        logger.info(f"🔄 save_session_to_supabase called for session {session_id}")
        if not supabase:
            logger.warning("❌ Supabase not available, skipping database save")
            return None

        try:
            # Use the new database function for session creation
            config_data = {
                "url": str(request.url),
                "max_pages": getattr(request, 'max_pages', 10),
                "delay": getattr(request, 'delay', 1),
                "user_agent": getattr(request, 'user_agent', 'WebScraper/1.0'),
                "include_external": getattr(request, 'include_external', False),
                "scrape_whole_site": getattr(request, 'scrape_whole_site', True),
                "download_content": getattr(request, 'download_content', True),
                "content_types": [str(ct) for ct in getattr(request, 'content_types', ['image', 'pdf', 'document'])],
                "depth_limit": getattr(request, 'depth_limit', 3),
                "respect_robots": getattr(request, 'respect_robots', True)
            }

            result = supabase.rpc('start_scraping_session', {
                'p_session_id': session_id,
                'p_target_url': str(request.url),
                'p_config': config_data,
                'p_user_id': None  # Anonymous user for now
            }).execute()

            logger.info(f"✅ Session {session_id} created using enhanced schema function")
            logger.info(f"📊 Database function result: {result}")
            return result
        except Exception as e:
            logger.error(f"❌ Database function failed: {e}")
            # Fallback to direct insert for backward compatibility
            try:
                logger.info("🔄 Attempting fallback session creation...")
                session_data = {
                    "id": session_id,
                    "user_id": None,  # NULL for anonymous
                    "target_url": str(request.url),
                    "status": status,
                    "config": config_data,
                    "progress": {
                        "pages_scraped": 0,
                        "files_downloaded": 0,
                        "urls_found": 0,
                        "external_urls_found": 0,
                        "errors_count": 0,
                        "last_checkpoint": datetime.now().isoformat()
                    }
                }

                result = supabase.table("scraping_sessions").insert(session_data).execute()
                logger.info(f"✅ Session {session_id} created using fallback method")
                return result
            except Exception as fallback_error:
                logger.error(f"❌ CRITICAL: Both function and fallback session creation failed: {fallback_error}")
                logger.error(f"❌ This will cause foreign key errors when saving pages and files!")
                return None

    async def save_page_to_supabase(self, session_id: str, url: str, title: str, content: str, html: str):
        """Save page content to Supabase using enhanced schema"""
        if not supabase:
            return

        try:
            page_data = {
                "id": str(uuid.uuid4()),
                "session_id": session_id,
                "url": url,
                "status": "scraped",
                "http_status": 200,  # Assume success if we got content
                "scraped_at": datetime.now().isoformat(),
                "extracted_data": {
                    "title": title,
                    "content_length": len(content),
                    "html_length": len(html)
                },
                # Legacy compatibility fields
                "title": title,
                "text_content": content,
                "html_content": html,
                "content": content,
                "metadata": {
                    "content_length": len(content),
                    "scraped_at": datetime.now().isoformat()
                }
            }

            result = supabase.table("scraped_pages").insert(page_data).execute()
            logger.info(f"✅ Page {url} saved to Supabase with enhanced schema")
            return result
        except Exception as e:
            logger.error(f"❌ Failed to save page to Supabase: {e}")
            return None

    async def save_file_to_supabase(self, session_id: str, original_url: str, file_path: str, file_name: str, file_size: int, mime_type: str, content_hash: str):
        """Save file metadata to Supabase"""
        if not supabase:
            return

        try:
            # Upload file to Supabase Storage
            storage_path = f"{session_id}/{file_name}"

            with open(file_path, 'rb') as f:
                file_data = f.read()

            # Upload to storage bucket
            storage_result = supabase.storage.from_("scraped-content").upload(storage_path, file_data)

            # Get public URL
            public_url = supabase.storage.from_("scraped-content").get_public_url(storage_path)

            # Save metadata to database
            file_data = {
                "id": str(uuid.uuid4()),
                "session_id": session_id,
                "original_url": original_url,
                "file_name": file_name,
                "file_path": storage_path,
                "file_size": file_size,
                "mime_type": mime_type,
                "content_hash": content_hash,
                "public_url": public_url,
                "is_deduped": False
            }

            result = supabase.table("stored_files").insert(file_data).execute()
            logger.info(f"✅ File {file_name} saved to Supabase Storage and DB")
            return result
        except Exception as e:
            logger.error(f"❌ Failed to save file to Supabase: {e}")
            return None

    async def save_deduplicated_file_to_supabase(self, session_id: str, original_url: str, existing_file_path: str, file_name: str, file_size: int, mime_type: str, content_hash: str, original_source_url: str):
        """Save deduplicated file reference to Supabase"""
        if not supabase:
            return

        try:
            # Get the public URL from the existing file path
            # The existing_file_path should be in format "session_id/filename"
            public_url = supabase.storage.from_("scraped-content").get_public_url(existing_file_path)

            # Save metadata to database with deduplication flag
            file_data = {
                "id": str(uuid.uuid4()),
                "session_id": session_id,
                "original_url": original_url,
                "file_name": file_name,
                "file_path": existing_file_path,  # Reference to existing file
                "file_size": file_size,
                "mime_type": mime_type,
                "content_hash": content_hash,
                "public_url": public_url,
                "is_deduped": True,
                "metadata": {
                    "original_source_url": original_source_url,
                    "deduplication_note": f"References existing file from {original_source_url}"
                }
            }

            result = supabase.table("stored_files").insert(file_data).execute()
            logger.info(f"✅ Deduplicated file reference {file_name} saved to Supabase DB")
            return result
        except Exception as e:
            logger.error(f"❌ Failed to save deduplicated file to Supabase: {e}")
            return None

    async def update_session_statistics(self, session_id: str, statistics: dict, status: str = "running"):
        """Update session statistics in Supabase using enhanced schema with real-time updates"""
        if not supabase:
            return

        try:
            now = datetime.now().isoformat()

            # Use the database function for progress updates
            progress_data = {
                "pages_scraped": statistics.get("total_pages_scraped", 0),
                "files_downloaded": statistics.get("content_downloaded", 0),
                "urls_found": statistics.get("total_urls_found", 0),
                "external_urls_found": statistics.get("external_urls_found", 0),
                "errors_count": 0,
                "last_checkpoint": now,
                "current_status": status
            }

            # Try using the database function first
            try:
                result = supabase.rpc('update_session_progress', {
                    'session_id': session_id,
                    'progress_data': progress_data
                }).execute()
                logger.info(f"✅ Session {session_id} progress updated using database function")
            except Exception as func_error:
                logger.warning(f"Database function failed, using direct update: {func_error}")
                # Fallback to direct update
                update_data = {
                    "status": status,
                    "progress": progress_data,
                    "last_updated": now,
                    # Legacy compatibility
                    "statistics": statistics
                }

                if status == "completed":
                    # Use the completion function
                    try:
                        summary_results = {
                            "completion_time": now,
                            "final_statistics": statistics,
                            "total_duration": statistics.get("duration_seconds", 0)
                        }
                        result = supabase.rpc('complete_scraping_session', {
                            'p_session_id': session_id,
                            'p_summary_results': summary_results
                        }).execute()
                        logger.info(f"✅ Session {session_id} completed using database function")
                    except Exception as complete_error:
                        logger.warning(f"Completion function failed, using direct update: {complete_error}")
                        update_data["end_time"] = now
                        update_data["summary_results"] = summary_results
                        result = supabase.table("scraping_sessions").update(update_data).eq("id", session_id).execute()
                else:
                    result = supabase.table("scraping_sessions").update(update_data).eq("id", session_id).execute()

            logger.info(f"✅ Session {session_id} statistics updated in Supabase")
            return result
        except Exception as e:
            logger.error(f"❌ Failed to update session statistics: {e}")
            return None

    async def scrape_website(self, session_id: str, request: ScrapeRequest, websocket: Optional[WebSocket] = None):
        """Enhanced scraping with content downloading and Supabase storage"""

        domain = urlparse(str(request.url)).netloc
        self.active_crawlers[session_id] = True

        # Save initial session to Supabase - CRITICAL for foreign key constraints
        logger.info(f"🔄 Attempting to save session {session_id} to Supabase...")
        session_saved = await self.save_session_to_supabase(session_id, request, "running")
        if not session_saved:
            logger.error(f"❌ CRITICAL: Failed to save session {session_id} to database. Scraping will continue but data won't be saved to Supabase.")
            logger.error(f"❌ This will cause foreign key errors when saving pages and files!")
        else:
            logger.info(f"✅ Session {session_id} successfully saved to Supabase database")
        
        found_urls = set()
        external_urls = set()
        crawled_urls = set()
        scraped_content = []
        page_contents = []  # New: Store full page content
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

                    # Helper function to send status updates
                    async def send_status_update(additional_info: str = "", current_page_url: str = ""):
                        status.current_url = current_page_url or getattr(status, 'current_url', "")
                        status.pages_scraped = pages_scraped
                        status.urls_found = len(found_urls)
                        status.external_urls_found = len(external_urls)
                        status.content_downloaded = len(scraped_content)

                        if status.estimated_total_pages:
                            base_progress = (pages_scraped / status.estimated_total_pages) * 100
                            status.progress = min(base_progress, 99)
                        else:
                            status.progress = min(50 + (pages_scraped / 100) * 50, 99)

                        if websocket:
                            try:
                                update_data = status.model_dump(mode='json')
                                if additional_info:
                                    update_data['additional_info'] = additional_info
                                await websocket.send_text(json.dumps({
                                    "type": "status_update",
                                    "data": update_data,
                                    "timestamp": datetime.now().isoformat()
                                }))
                                logger.info(f"✅ Sent status update: {additional_info or 'Progress update'} | Pages: {status.pages_scraped} | URLs: {status.urls_found} | Progress: {status.progress}%")
                            except Exception as e:
                                logger.error(f"❌ Failed to send status update: {e}")
                                pass

                    while (to_crawl and pages_scraped < max_pages and
                           self.active_crawlers.get(session_id, False)):

                        # Check if session is paused
                        if session_id in active_sessions and active_sessions[session_id].get("status") == "paused":
                            logger.info(f"Crawling paused for session {session_id}, waiting...")
                            await send_status_update("Scraping paused - waiting for resume", "")

                            # Wait until resumed or stopped
                            while (session_id in active_sessions and
                                   active_sessions[session_id].get("status") == "paused" and
                                   self.active_crawlers.get(session_id, False)):
                                await asyncio.sleep(1)

                            if not self.active_crawlers.get(session_id, False):
                                logger.info(f"Crawling stopped while paused for session {session_id}")
                                break

                            logger.info(f"Crawling resumed for session {session_id}")
                            await send_status_update("Scraping resumed", "")

                        current_url = to_crawl.pop(0)

                        if current_url in crawled_urls:
                            continue

                        # Send initial status for this page
                        await send_status_update(f"Starting page {pages_scraped + 1}: {current_url}", current_url)

                        # Crawl the page
                        try:
                            logger.info(f"Starting crawl for: {current_url}")
                            await send_status_update(f"Fetching page {pages_scraped + 1}: {current_url}", current_url)

                            result = await crawler.arun(url=current_url, config=crawler_config)

                            logger.info(f"Crawl result - Success: {result.success if result else 'No result'}, HTML present: {result.html is not None if result else 'No result'}")

                            # Debug: Check result attributes
                            if result:
                                logger.info(f"Result attributes: success={result.success}, html_type={type(result.html)}, html_length={len(result.html) if result.html else 0}")

                            if result and result.success and result.html:
                                await send_status_update(f"Processing page {pages_scraped + 1}: Extracting content", current_url)
                                # Save full page content
                                logger.info(f"Saving page content for {current_url}")
                                try:
                                    page_content = await self.save_page_content(current_url, result.html, session_id)
                                    page_contents.append(page_content)
                                    logger.info(f"Successfully saved page content for {current_url}")
                                except Exception as e:
                                    logger.error(f"Error saving page content for {current_url}: {e}")
                                    import traceback
                                    logger.error(f"Traceback: {traceback.format_exc()}")

                                soup = BeautifulSoup(result.html, 'html.parser')

                                # Extract URLs
                                await send_status_update(f"Processing page {pages_scraped + 1}: Extracting URLs", current_url)
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

                                # Send update after URL extraction
                                await send_status_update(f"Page {pages_scraped + 1}: Found {len(found_urls)} URLs total", current_url)

                                # Download content if enabled
                                logger.info(f"Checking content download: download_content={request.download_content}, content_types_count={len(request.content_types) if request.content_types else 0}")
                                if request.download_content and request.content_types:
                                    logger.info(f"Starting content extraction for {current_url}")
                                    await send_status_update(f"Page {pages_scraped + 1}: Searching for downloadable content", current_url)
                                    try:
                                        content_items = await self.extract_content_urls_with_context(
                                            result.html, current_url, request.content_types
                                        )
                                        logger.info(f"Found {len(content_items)} content items for {current_url}")

                                        if content_items:
                                            await send_status_update(f"Page {pages_scraped + 1}: Found {len(content_items)} items to download", current_url)

                                        for i, (content_url, context_html) in enumerate(content_items[:10]):  # Limit per page
                                            if self.active_crawlers.get(session_id, False):
                                                logger.info(f"Downloading content: {content_url}")
                                                await send_status_update(f"Page {pages_scraped + 1}: Downloading item {i + 1}/{min(len(content_items), 10)}", current_url)

                                                content = await self.download_content(
                                                    content_url, session_id, current_url, context_html
                                                )
                                                if content and content.success:
                                                    scraped_content.append(content)
                                                    status.content_downloaded = len(scraped_content)
                                                    logger.info(f"Successfully downloaded: {content_url}")

                                                    # Send content update with real-time status
                                                    if websocket:
                                                        try:
                                                            await websocket.send_text(json.dumps({
                                                                "type": "content_downloaded",
                                                                "data": content.dict(default=str)
                                                            }))
                                                            # Also send status update
                                                            await send_status_update(f"Downloaded: {content.title or content_url}", current_url)
                                                        except:
                                                            pass
                                                else:
                                                    logger.warning(f"Failed to download content: {content_url}")
                                    except Exception as e:
                                        logger.error(f"Error in content extraction for {current_url}: {e}")
                                        import traceback
                                        logger.error(f"Traceback: {traceback.format_exc()}")
                                else:
                                    logger.info(f"Content download disabled or no content types specified")
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

                            # Update counts and send completion status for this page
                            status.urls_found = len(found_urls)
                            status.external_urls_found = len(external_urls)
                            await send_status_update(f"Completed page {pages_scraped}/{max_pages}: {current_url}", current_url)

                            # Rate limiting
                            if request.delay > 0:
                                await send_status_update(f"Waiting {request.delay}s before next page...", current_url)
                                await asyncio.sleep(request.delay)

                        except Exception as e:
                            logger.error(f"Error in crawling loop {current_url}: {e}")
                            continue
                
                # Complete the scraping
                await send_status_update("Finalizing results...")
                status.status = "completed"
                status.ended_at = datetime.now()
                status.progress = 100
                
                # Calculate statistics
                # Count duplicates vs unique content
                unique_content = [c for c in scraped_content if not c.description or not c.description.startswith("Duplicate of")]
                duplicate_content = [c for c in scraped_content if c.description and c.description.startswith("Duplicate of")]

                statistics = {
                    "total_pages_scraped": pages_scraped,
                    "total_urls_found": len(found_urls),
                    "external_urls_found": len(external_urls),
                    "content_downloaded": len(scraped_content),
                    "unique_content_downloaded": len(unique_content),
                    "duplicate_content_skipped": len(duplicate_content),
                    "total_file_size": sum(c.file_size or 0 for c in scraped_content),
                    "unique_file_size": sum(c.file_size or 0 for c in unique_content),
                    "space_saved_by_deduplication": sum(c.file_size or 0 for c in duplicate_content),
                    "duration_seconds": (status.ended_at - status.started_at).total_seconds(),
                    "content_by_type": {},
                    "deduplication_enabled": True
                }
                
                # Count content by type
                for content in scraped_content:
                    content_type = content.content_type
                    statistics["content_by_type"][content_type] = statistics["content_by_type"].get(content_type, 0) + 1
                
                # Update final statistics in Supabase
                await self.update_session_statistics(session_id, statistics, "completed")

                # Create final result
                result = ScrapeResult(
                    session_id=session_id,
                    domain=domain,
                    urls=list(found_urls),
                    external_urls=list(external_urls),
                    scraped_content=scraped_content,
                    page_contents=page_contents,  # Include full page content
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
        "timestamp": datetime.now().isoformat(),
        "supabase_connected": supabase is not None,
        "crawl4ai_available": CRAWL4AI_AVAILABLE,
        "active_sessions": len(active_sessions),
        "completed_sessions": len(session_results)
    }

@app.get("/api/sessions")
async def get_sessions():
    """Get all sessions from database"""
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not available")

    try:
        # Get all sessions from database
        result = supabase.table("scraping_sessions").select("*").order("start_time", desc=True).execute()

        active_sessions_list = []
        completed_sessions_list = []

        for session in result.data:
            session_info = {
                "id": session["id"],
                "target_url": session["target_url"],
                "status": session["status"],
                "start_time": session["start_time"],
                "end_time": session.get("end_time"),
                "progress": session.get("progress", {}),
                "domain": session.get("domain")
            }

            if session["status"] in ["running", "pending", "paused"]:
                active_sessions_list.append(session_info)
            else:
                completed_sessions_list.append(session_info)

        return {
            "active_sessions": active_sessions_list,
            "completed_sessions": completed_sessions_list
        }
    except Exception as e:
        logger.error(f"Failed to get sessions: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to get sessions: {str(e)}")

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


@app.post("/api/scrape/pause/{session_id}")
async def pause_scraping(session_id: str):
    if session_id in active_sessions:
        active_sessions[session_id]["status"] = "paused"

        # Notify via WebSocket
        if session_id in websocket_connections:
            try:
                await websocket_connections[session_id].send_text(json.dumps({
                    "type": "status_update",
                    "data": {
                        "session_id": session_id,
                        "status": "paused",
                        "message": "Scraping paused by user"
                    }
                }))
            except Exception as e:
                logger.warning(f"Error sending pause notification for session {session_id}: {e}")

        return {"message": "Scraping paused", "session_id": session_id}
    else:
        raise HTTPException(status_code=404, detail="Session not found")

@app.post("/api/scrape/resume/{session_id}")
async def resume_scraping(session_id: str):
    if session_id in active_sessions:
        active_sessions[session_id]["status"] = "running"

        # Notify via WebSocket
        if session_id in websocket_connections:
            try:
                await websocket_connections[session_id].send_text(json.dumps({
                    "type": "status_update",
                    "data": {
                        "session_id": session_id,
                        "status": "running",
                        "message": "Scraping resumed by user"
                    }
                }))
            except Exception as e:
                logger.warning(f"Error sending resume notification for session {session_id}: {e}")

        return {"message": "Scraping resumed", "session_id": session_id}
    else:
        raise HTTPException(status_code=404, detail="Session not found")

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

@app.get("/api/content/{session_id}/{filename:path}")
async def get_content_file(session_id: str, filename: str):
    """Serve downloaded content files from Supabase Storage with proper headers"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database not available")

        # First, try to find the file in the database to get metadata
        try:
            result = supabase.table("stored_files").select("*").eq("session_id", session_id).eq("file_name", filename).execute()

            if not result.data:
                # If not found by filename, try by file_path
                storage_path = f"{session_id}/{filename}"
                result = supabase.table("stored_files").select("*").eq("file_path", storage_path).execute()

            if not result.data:
                raise HTTPException(status_code=404, detail="File not found in database")

            file_record = result.data[0]
            storage_path = file_record["file_path"]
            mime_type = file_record["mime_type"] or 'application/octet-stream'

        except Exception as db_error:
            logger.warning(f"Database lookup failed for {session_id}/{filename}: {db_error}")
            # Fallback: try direct storage path
            storage_path = f"{session_id}/{filename}"
            mime_type = 'application/octet-stream'

        # Download file from Supabase Storage
        try:
            # Use the correct Supabase storage download method
            storage_response = supabase.storage.from_("scraped-content").download(storage_path)

            if not storage_response:
                raise HTTPException(status_code=404, detail="File not found in storage")

            # The response should be bytes
            file_content = storage_response

        except Exception as storage_error:
            logger.error(f"Storage download failed for {storage_path}: {storage_error}")
            logger.error(f"Full storage error: {type(storage_error).__name__}: {str(storage_error)}")

            # Try alternative: redirect to public URL if available
            try:
                if 'file_record' in locals() and file_record.get("public_url"):
                    from fastapi.responses import RedirectResponse
                    return RedirectResponse(url=file_record["public_url"])
                else:
                    # Generate public URL as fallback
                    public_url = supabase.storage.from_("scraped-content").get_public_url(storage_path)
                    from fastapi.responses import RedirectResponse
                    return RedirectResponse(url=public_url)
            except Exception as redirect_error:
                logger.error(f"Redirect fallback failed: {redirect_error}")
                raise HTTPException(status_code=404, detail="File not found in storage")

        # Guess mime type if not available
        if mime_type == 'application/octet-stream':
            mime_type, _ = mimetypes.guess_type(filename)
            if not mime_type:
                mime_type = 'application/octet-stream'

        from fastapi.responses import Response
        return Response(
            content=file_content,
            media_type=mime_type,
            headers={
                "Content-Disposition": f"inline; filename={filename}",
                "Cache-Control": "public, max-age=3600",
                "Access-Control-Allow-Origin": "*"
            }
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error serving file {session_id}/{filename}: {e}")
        import traceback
        logger.error(f"Full traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail="Error serving file")

@app.get("/api/content-url/{session_id}/{filename:path}")
async def get_content_file_url(session_id: str, filename: str):
    """Get the public URL for a content file from Supabase Storage"""
    try:
        if not supabase:
            raise HTTPException(status_code=500, detail="Database not available")

        # Find the file in the database to get the public URL
        try:
            result = supabase.table("stored_files").select("public_url, file_path").eq("session_id", session_id).eq("file_name", filename).execute()

            if not result.data:
                # If not found by filename, try by file_path
                storage_path = f"{session_id}/{filename}"
                result = supabase.table("stored_files").select("public_url, file_path").eq("file_path", storage_path).execute()

            if not result.data:
                raise HTTPException(status_code=404, detail="File not found")

            file_record = result.data[0]
            public_url = file_record.get("public_url")

            if public_url:
                return {"public_url": public_url}
            else:
                # Generate public URL if not stored
                storage_path = file_record["file_path"]
                public_url = supabase.storage.from_("scraped-content").get_public_url(storage_path)
                return {"public_url": public_url}

        except Exception as e:
            logger.error(f"Error getting file URL for {session_id}/{filename}: {e}")
            raise HTTPException(status_code=404, detail="File not found")

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting file URL {session_id}/{filename}: {e}")
        raise HTTPException(status_code=500, detail="Error getting file URL")

@app.get("/api/page-content/{session_id}")
async def get_page_contents(session_id: str):
    """Get all page contents for a session including stored files with public URLs"""
    try:
        # Get page contents from memory if available
        page_contents = []
        if session_id in session_results:
            result = session_results[session_id]
            page_contents = result.page_contents

        # Get stored files from database with public URLs
        stored_files = []
        if supabase:
            try:
                files_result = supabase.table("stored_files").select("*").eq("session_id", session_id).execute()
                if files_result.data:
                    for file_record in files_result.data:
                        # Ensure public URL is correct for the file path
                        file_path = file_record.get("file_path", "")
                        if file_path and not file_path.startswith(session_id + "/"):
                            # Fix inconsistent file paths - should include session folder
                            corrected_path = f"{session_id}/{file_record.get('file_name', '')}"
                            public_url = supabase.storage.from_("scraped-content").get_public_url(corrected_path)
                        else:
                            public_url = file_record.get("public_url") or supabase.storage.from_("scraped-content").get_public_url(file_path)

                        stored_files.append({
                            "id": file_record.get("id"),
                            "url": file_record.get("original_url", ""),
                            "content_type": "image" if file_record.get("mime_type", "").startswith("image/")
                                          else "pdf" if file_record.get("mime_type") == "application/pdf"
                                          else "document" if file_record.get("mime_type", "").startswith("application/")
                                          else "other",
                            "file_path": file_record.get("file_path"),
                            "filename": file_record.get("file_name"),
                            "file_size": file_record.get("file_size"),
                            "size": file_record.get("file_size"),  # Alias
                            "mime_type": file_record.get("mime_type"),
                            "type": file_record.get("mime_type"),  # Alias
                            "public_url": public_url,
                            "title": file_record.get("file_name"),
                            "downloaded_at": file_record.get("uploaded_at", ""),
                            "success": True,
                            "metadata": file_record.get("metadata", {})
                        })

            except Exception as db_error:
                logger.warning(f"Failed to fetch stored files for session {session_id}: {db_error}")

        # Enhance page contents with stored files
        enhanced_page_contents = []
        for page in page_contents:
            enhanced_page = dict(page)
            enhanced_page["stored_files"] = stored_files
            enhanced_page_contents.append(enhanced_page)

        return {
            "session_id": session_id,
            "page_contents": enhanced_page_contents,
            "stored_files": stored_files,
            "total_pages": len(page_contents),
            "total_files": len(stored_files)
        }

    except Exception as e:
        logger.error(f"Error getting page contents for session {session_id}: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving page contents")

@app.get("/api/deduplication/stats")
async def get_deduplication_stats():
    """Get global deduplication statistics"""
    total_unique_files = len(content_hash_registry)
    total_file_size = sum(info[3] for info in content_hash_registry.values())  # info[3] is file_size

    # Count content by type from registry
    content_types = {}
    for file_path, session_id, url, file_size in content_hash_registry.values():
        # Try to determine content type from file extension
        ext = os.path.splitext(file_path)[1].lower()
        if ext in ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp']:
            content_type = 'image'
        elif ext == '.pdf':
            content_type = 'pdf'
        elif ext in ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm']:
            content_type = 'video'
        elif ext in ['.mp3', '.wav', '.m4a', '.flac', '.ogg']:
            content_type = 'audio'
        elif ext in ['.doc', '.docx', '.txt', '.rtf', '.odt']:
            content_type = 'document'
        else:
            content_type = 'other'

        content_types[content_type] = content_types.get(content_type, 0) + 1

    return {
        "total_unique_files": total_unique_files,
        "total_file_size_bytes": total_file_size,
        "total_file_size_mb": round(total_file_size / (1024 * 1024), 2),
        "content_by_type": content_types,
        "registry_size": len(content_hash_registry)
    }

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Enhanced Web Scraper API...")
    print(f"📦 Crawl4AI Available: {CRAWL4AI_AVAILABLE}")
    if not CRAWL4AI_AVAILABLE:
        print("⚠️  Install Crawl4AI with: pip install -U crawl4ai && crawl4ai-setup")
    print("🌐 API Documentation: http://localhost:8000/docs")
    print("🔌 WebSocket endpoint: ws://localhost:8000/ws/scrape/{session_id}")
    
    uvicorn.run(app, host="0.0.0.0", port=8001)
