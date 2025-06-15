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
                
                # Send completion message
                await websocket.send_text(json.dumps({
                    "type": "scrape_complete",
                    "data": {
                        "session_id": session_id,
                        "domain": url.split('/')[2] if '/' in url else url,
                        "urls": [url, f"{url}/page1", f"{url}/page2"],
                        "external_urls": [f"https://external1.com", f"https://external2.com"],
                        "scraped_content": [],
                        "status": {
                            "session_id": session_id,
                            "status": "completed",
                            "pages_scraped": 5,
                            "urls_found": 15,
                            "external_urls_found": 7,
                            "content_downloaded": 3,
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
