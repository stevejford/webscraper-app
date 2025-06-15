"""
Standalone WebSocket Server for Testing and Debugging
"""
import asyncio
import websockets
import json
import uuid
import logging
import sys
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Store active connections
active_connections = {}

async def handle_websocket(websocket, path):
    """Handle WebSocket connections"""
    session_id = path.split('/')[-1]
    logger.info(f"New connection: {session_id} from {websocket.remote_address}")
    
    # Store the connection
    active_connections[session_id] = websocket
    
    try:
        # Send initial connection confirmation
        await websocket.send(json.dumps({
            "type": "connection_established",
            "session_id": session_id,
            "message": "WebSocket connection established"
        }))
        logger.info(f"Sent connection confirmation to {session_id}")
        
        # Process messages
        async for message in websocket:
            logger.info(f"Received message from {session_id}: {message[:100]}...")
            
            try:
                data = json.loads(message)
                url = data.get('url', 'https://example.com')
                
                # Send status update
                await websocket.send(json.dumps({
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
                await websocket.send(json.dumps({
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
                await websocket.send(json.dumps({
                    "type": "scrape_complete",
                    "data": {
                        "session_id": session_id,
                        "domain": url.split('/')[2],
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
                await websocket.send(json.dumps({
                    "type": "error",
                    "message": "Invalid JSON format"
                }))
            except Exception as e:
                logger.error(f"Error processing message from {session_id}: {e}")
                await websocket.send(json.dumps({
                    "type": "error",
                    "message": str(e)
                }))
    
    except websockets.exceptions.ConnectionClosed:
        logger.info(f"Connection closed for {session_id}")
    except Exception as e:
        logger.error(f"Error in WebSocket handler for {session_id}: {e}")
    finally:
        # Remove connection
        active_connections.pop(session_id, None)
        logger.info(f"Connection removed for {session_id}")

async def main():
    # Start WebSocket server
    port = 8000
    host = 'localhost'
    
    logger.info(f"Starting WebSocket server on {host}:{port}")
    server = await websockets.serve(
        handle_websocket, 
        host, 
        port,
        # Enable CORS by setting appropriate headers
        process_request=lambda path, request_headers: {
            'headers': [
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'),
                ('Access-Control-Allow-Headers', '*'),
                ('Access-Control-Allow-Credentials', 'true'),
            ]
        } if request_headers.get('origin') else None
    )
    
    logger.info(f"WebSocket server running at ws://{host}:{port}")
    logger.info("Press Ctrl+C to stop")
    
    # Keep the server running
    await server.wait_closed()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")
        sys.exit(1)
