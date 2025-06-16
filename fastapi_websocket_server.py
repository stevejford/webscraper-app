"""
FastAPI WebSocket Server for Testing and Debugging
"""
import asyncio
import json
import uuid
import logging
import sys
from datetime import datetime
from typing import Dict, Any

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(title="WebSocket Test Server")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store active connections
active_connections: Dict[str, WebSocket] = {}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "ok",
        "active_sessions": len(active_connections),
        "timestamp": datetime.now().isoformat()
    }

@app.websocket("/ws/scrape/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for scraping sessions"""
    await websocket.accept()
    logger.info(f"New connection: {session_id}")
    
    # Store the connection
    active_connections[session_id] = websocket
    
    try:
        # Send initial connection confirmation
        await websocket.send_text(json.dumps({
            "type": "connection_established",
            "session_id": session_id,
            "message": "WebSocket connection established"
        }))
        logger.info(f"Sent connection confirmation to {session_id}")
        
        # Process messages
        while True:
            message = await websocket.receive_text()
            logger.info(f"Received message from {session_id}: {message[:100]}...")
            
            try:
                data = json.loads(message)
                url = data.get('url', 'https://example.com')
                
                # Send status update
                await websocket.send_text(json.dumps({
                    "type": "status_update",
                    "data": {
                        "session_id": session_id,
                        "status": "running",
                        "current_url": url,
                        "pages_scraped": 1,
                        "urls_found": 5,
                        "external_urls_found": 2,
                        "content_downloaded": 0,
                        "progress": 20.0,
                        "started_at": datetime.now().isoformat(),
                        "estimated_total_pages": 5
                    }
                }))
                logger.info(f"Sent status update to {session_id}")
                
                # Wait a bit to simulate processing
                await asyncio.sleep(2)
                
                # Send another status update
                await websocket.send_text(json.dumps({
                    "type": "status_update",
                    "data": {
                        "session_id": session_id,
                        "status": "running",
                        "current_url": url,
                        "pages_scraped": 3,
                        "urls_found": 12,
                        "external_urls_found": 5,
                        "content_downloaded": 2,
                        "progress": 60.0,
                        "started_at": datetime.now().isoformat(),
                        "estimated_total_pages": 5
                    }
                }))
                logger.info(f"Sent second status update to {session_id}")
                
                # Wait a bit more
                await asyncio.sleep(2)
                
                # Generate realistic mock content
                domain = url.split('/')[2] if '/' in url else url
                mock_content = [
                    {
                        "id": f"content_1_{session_id[:8]}",
                        "url": f"{url}/image1.jpg",
                        "content_type": "image",
                        "file_name": "hero-banner.jpg",
                        "file_size": 245760,
                        "mime_type": "image/jpeg",
                        "downloaded_at": datetime.now().isoformat(),
                        "local_path": f"/downloads/{session_id}/images/hero-banner.jpg",
                        "metadata": {
                            "width": 1920,
                            "height": 1080,
                            "alt_text": "Hero banner image"
                        }
                    },
                    {
                        "id": f"content_2_{session_id[:8]}",
                        "url": f"{url}/document.pdf",
                        "content_type": "pdf",
                        "file_name": "whitepaper.pdf",
                        "file_size": 1048576,
                        "mime_type": "application/pdf",
                        "downloaded_at": datetime.now().isoformat(),
                        "local_path": f"/downloads/{session_id}/pdfs/whitepaper.pdf",
                        "metadata": {
                            "pages": 12,
                            "title": "Technical Whitepaper"
                        }
                    },
                    {
                        "id": f"content_3_{session_id[:8]}",
                        "url": f"{url}/logo.png",
                        "content_type": "image",
                        "file_name": "company-logo.png",
                        "file_size": 32768,
                        "mime_type": "image/png",
                        "downloaded_at": datetime.now().isoformat(),
                        "local_path": f"/downloads/{session_id}/images/company-logo.png",
                        "metadata": {
                            "width": 200,
                            "height": 100,
                            "alt_text": "Company logo"
                        }
                    },
                    {
                        "id": f"content_4_{session_id[:8]}",
                        "url": f"{url}/video.mp4",
                        "content_type": "video",
                        "file_name": "demo-video.mp4",
                        "file_size": 5242880,
                        "mime_type": "video/mp4",
                        "downloaded_at": datetime.now().isoformat(),
                        "local_path": f"/downloads/{session_id}/videos/demo-video.mp4",
                        "metadata": {
                            "duration": 120,
                            "resolution": "1280x720"
                        }
                    },
                    {
                        "id": f"content_5_{session_id[:8]}",
                        "url": f"{url}/data.csv",
                        "content_type": "document",
                        "file_name": "export-data.csv",
                        "file_size": 16384,
                        "mime_type": "text/csv",
                        "downloaded_at": datetime.now().isoformat(),
                        "local_path": f"/downloads/{session_id}/documents/export-data.csv",
                        "metadata": {
                            "rows": 500,
                            "columns": 8
                        }
                    }
                ]

                # Generate page contents
                page_contents = [
                    {
                        "id": f"page_1_{session_id[:8]}",
                        "url": url,
                        "title": f"Homepage - {domain}",
                        "content": f"Welcome to {domain}. This is the main page with lots of interesting content about our services and products.",
                        "scraped_at": datetime.now().isoformat(),
                        "word_count": 250,
                        "links_found": 15,
                        "images_found": 3,
                        "metadata": {
                            "description": f"Main page of {domain}",
                            "keywords": ["homepage", "services", "products"]
                        }
                    },
                    {
                        "id": f"page_2_{session_id[:8]}",
                        "url": f"{url}/about",
                        "title": f"About Us - {domain}",
                        "content": f"Learn more about {domain} and our mission to provide excellent services to our customers.",
                        "scraped_at": datetime.now().isoformat(),
                        "word_count": 180,
                        "links_found": 8,
                        "images_found": 2,
                        "metadata": {
                            "description": f"About page for {domain}",
                            "keywords": ["about", "company", "mission"]
                        }
                    },
                    {
                        "id": f"page_3_{session_id[:8]}",
                        "url": f"{url}/contact",
                        "title": f"Contact - {domain}",
                        "content": f"Get in touch with {domain}. We'd love to hear from you and answer any questions.",
                        "scraped_at": datetime.now().isoformat(),
                        "word_count": 120,
                        "links_found": 5,
                        "images_found": 1,
                        "metadata": {
                            "description": f"Contact information for {domain}",
                            "keywords": ["contact", "support", "help"]
                        }
                    }
                ]

                # Send completion message
                await websocket.send_text(json.dumps({
                    "type": "scrape_complete",
                    "data": {
                        "session_id": session_id,
                        "domain": domain,
                        "urls": [url, f"{url}/about", f"{url}/contact"],
                        "external_urls": [f"https://external1.com", f"https://external2.com"],
                        "scraped_content": mock_content,
                        "page_contents": page_contents,
                        "statistics": {
                            "total_pages_scraped": 3,
                            "total_urls_found": 15,
                            "external_urls_found": 7,
                            "content_downloaded": 5,
                            "content_by_type": {
                                "image": 2,
                                "pdf": 1,
                                "video": 1,
                                "document": 1
                            },
                            "total_file_size": 6635520,
                            "duration_seconds": 8
                        },
                        "status": {
                            "session_id": session_id,
                            "status": "completed",
                            "pages_scraped": 3,
                            "urls_found": 15,
                            "external_urls_found": 7,
                            "content_downloaded": 5,
                            "progress": 100.0,
                            "started_at": datetime.now().isoformat(),
                            "ended_at": datetime.now().isoformat()
                        }
                    }
                }))
                logger.info(f"Sent completion message to {session_id}")
                
            except json.JSONDecodeError:
                logger.error(f"Invalid JSON from {session_id}")
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": "Invalid JSON format"
                }))
            except Exception as e:
                logger.error(f"Error processing message from {session_id}: {e}")
                await websocket.send_text(json.dumps({
                    "type": "error",
                    "message": str(e)
                }))
    
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for {session_id}")
    except Exception as e:
        logger.error(f"Error in WebSocket handler for {session_id}: {e}")
    finally:
        # Remove connection
        active_connections.pop(session_id, None)
        logger.info(f"Connection removed for {session_id}")

if __name__ == "__main__":
    try:
        uvicorn.run(app, host="0.0.0.0", port=8000, log_level="info")
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")
        sys.exit(1)
