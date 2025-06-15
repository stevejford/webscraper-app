#!/usr/bin/env python3
"""
Simplified Web Scraper API - Working Version
"""
import json
import uuid
import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Optional, Set
from collections import deque

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI app
app = FastAPI(title="Enhanced Web Scraper API", version="2.0.0")

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

# Data models
class ScrapeRequest(BaseModel):
    url: str
    max_pages: int = 10
    delay: float = 1.0
    include_external: bool = False
    scrape_whole_site: bool = False
    download_content: bool = False
    content_types: List[str] = []
    user_agent: Optional[str] = None

class ScrapeStatus(BaseModel):
    status: str = "starting"
    current_url: str = ""
    pages_scraped: int = 0
    urls_found: int = 0
    external_urls_found: int = 0
    content_downloaded: int = 0
    progress: float = 0.0
    estimated_total_pages: Optional[int] = None
    started_at: datetime = datetime.now()
    ended_at: Optional[datetime] = None

class ScrapeResult(BaseModel):
    session_id: str
    domain: str
    urls: List[str]
    external_urls: List[str]
    statistics: Dict
    status: ScrapeStatus

# Global storage
active_sessions: Dict[str, Dict] = {}
session_results: Dict[str, ScrapeResult] = {}
websocket_connections: Dict[str, WebSocket] = {}

class SimpleWebScraperManager:
    def __init__(self):
        self.active_crawlers: Dict[str, bool] = {}

    async def __aenter__(self):
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        pass

    async def scrape_website(self, session_id: str, request: ScrapeRequest, websocket: Optional[WebSocket] = None):
        """Simple web scraping using requests and BeautifulSoup"""
        
        # Initialize tracking
        self.active_crawlers[session_id] = True
        status = ScrapeStatus()
        status.started_at = datetime.now()
        
        # Parse domain
        parsed_url = urlparse(request.url)
        domain = parsed_url.netloc
        
        # Initialize collections
        to_crawl = deque([request.url])
        crawled_urls: Set[str] = set()
        found_urls: Set[str] = set()
        external_urls: Set[str] = set()
        
        try:
            pages_scraped = 0
            max_pages = request.max_pages if request.max_pages > 0 else 10
            
            # Estimate total pages
            status.estimated_total_pages = min(max_pages, 50)
            
            while (to_crawl and pages_scraped < max_pages and 
                   self.active_crawlers.get(session_id, False)):
                
                current_url = to_crawl.popleft()
                
                if current_url in crawled_urls:
                    continue
                
                # Update status
                status.current_url = current_url
                status.pages_scraped = pages_scraped
                status.progress = min((pages_scraped / max_pages) * 100, 99)
                
                # Send real-time update
                if websocket:
                    try:
                        await websocket.send_text(json.dumps({
                            "type": "status_update",
                            "data": status.dict(default=str)
                        }))
                    except:
                        pass
                
                # Scrape the page using requests
                try:
                    logger.info(f"Scraping: {current_url}")
                    
                    headers = {
                        'User-Agent': request.user_agent or 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                    
                    response = requests.get(current_url, headers=headers, timeout=10)
                    response.raise_for_status()
                    
                    soup = BeautifulSoup(response.content, 'html.parser')
                    
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
                                    (request.scrape_whole_site or len(to_crawl) < 20)):
                                    to_crawl.append(clean_url)
                            elif request.include_external:
                                external_urls.add(clean_url)
                    
                    logger.info(f"Successfully scraped {current_url}, found {len(soup.find_all('a', href=True))} links")
                    
                except Exception as e:
                    logger.error(f"Error scraping {current_url}: {e}")
                
                crawled_urls.add(current_url)
                pages_scraped += 1
                
                # Update counts
                status.urls_found = len(found_urls)
                status.external_urls_found = len(external_urls)
                
                # Rate limiting
                if request.delay > 0:
                    await asyncio.sleep(request.delay)
            
            # Complete the scraping
            status.status = "completed"
            status.ended_at = datetime.now()
            status.progress = 100
            
            # Calculate statistics
            statistics = {
                "total_pages_scraped": pages_scraped,
                "total_urls_found": len(found_urls),
                "external_urls_found": len(external_urls),
                "duration_seconds": (status.ended_at - status.started_at).total_seconds(),
            }
            
            # Create final result
            result = ScrapeResult(
                session_id=session_id,
                domain=domain,
                urls=list(found_urls),
                external_urls=list(external_urls),
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
                        "data": result.dict(default=str)
                    }))
                    # Give time for the message to be sent
                    await asyncio.sleep(0.5)
                except:
                    pass
            
            return result
            
        except Exception as e:
            logger.error(f"Error in scraping session {session_id}: {e}")
            status.status = "error"
            status.ended_at = datetime.now()
            
            if websocket:
                try:
                    await websocket.send_text(json.dumps({
                        "type": "error",
                        "message": str(e)
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
    return {"message": "Enhanced Web Scraper API", "version": "2.0.0", "mode": "simple"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "mode": "simple",
        "active_sessions": len(active_sessions),
        "completed_sessions": len(session_results)
    }

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
        async with SimpleWebScraperManager() as manager:
            await manager.scrape_website(session_id, request, websocket)

        # Keep connection open briefly to ensure all messages are delivered
        await asyncio.sleep(1.0)
            
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

if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting Simple Web Scraper API...")
    print("🌐 API Documentation: http://localhost:8000/docs")
    print("🔌 WebSocket endpoint: ws://localhost:8000/ws/scrape/{session_id}")
    
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
