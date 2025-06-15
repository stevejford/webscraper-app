"""
Browser-compatible WebSocket server with detailed error logging
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
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger('websocket_server')

# Store active connections
active_connections = {}

async def send_status_updates(websocket, session_id):
    """Send periodic status updates to the client"""
    try:
        # Send connection established message
        await websocket.send(json.dumps({
            "type": "connection_established",
            "session_id": session_id,
            "message": "WebSocket connection established"
        }))
        logger.info(f"Sent connection established message to {session_id}")
        
        # Wait a bit
        await asyncio.sleep(2)
        
        # Send first status update
        await websocket.send(json.dumps({
            "type": "status_update",
            "data": {
                "session_id": session_id,
                "status": "running",
                "current_url": "https://example.com",
                "pages_scraped": 1,
                "urls_found": 5,
                "external_urls_found": 2,
                "content_downloaded": 0,
                "progress": 20.0,
                "started_at": datetime.now().isoformat(),
                "estimated_total_pages": 5
            }
        }))
        logger.info(f"Sent first status update to {session_id}")
        
        # Wait a bit more
        await asyncio.sleep(2)
        
        # Send second status update
        await websocket.send(json.dumps({
            "type": "status_update",
            "data": {
                "session_id": session_id,
                "status": "running",
                "current_url": "https://example.com/page1",
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
                "domain": "example.com",
                "urls": ["https://example.com", "https://example.com/page1", "https://example.com/page2"],
                "external_urls": ["https://external1.com", "https://external2.com"],
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
        
    except websockets.exceptions.ConnectionClosed as e:
        logger.error(f"Connection closed while sending updates: {e}")
    except Exception as e:
        logger.error(f"Error sending updates: {e}")

async def handle_websocket(websocket, path):
    """Handle a WebSocket connection"""
    session_id = None
    try:
        # Extract session ID from path
        if path.startswith('/ws/scrape/'):
            session_id = path.split('/ws/scrape/')[1]
            logger.info(f"New connection with session ID: {session_id}")
        else:
            logger.warning(f"Invalid path: {path}")
            await websocket.close(1008, "Invalid path")
            return
        
        # Store the connection
        active_connections[session_id] = websocket
        
        # Start sending status updates
        update_task = asyncio.create_task(send_status_updates(websocket, session_id))
        
        # Handle incoming messages
        try:
            async for message in websocket:
                try:
                    data = json.loads(message)
                    logger.info(f"Received message from {session_id}: {data}")
                    
                    # Here you would normally process the message
                    # For now, we just acknowledge it
                    await websocket.send(json.dumps({
                        "type": "message_received",
                        "session_id": session_id,
                        "message": "Message received"
                    }))
                    
                except json.JSONDecodeError:
                    logger.warning(f"Invalid JSON from {session_id}")
                    await websocket.send(json.dumps({
                        "type": "error",
                        "message": "Invalid JSON format"
                    }))
        except websockets.exceptions.ConnectionClosed as e:
            logger.info(f"Connection closed: {e}")
        
        # Wait for the update task to complete
        await update_task
        
    except Exception as e:
        logger.error(f"Error handling WebSocket: {e}")
    finally:
        # Clean up
        if session_id and session_id in active_connections:
            del active_connections[session_id]
        logger.info(f"Connection closed for session {session_id}")

async def main():
    """Start the WebSocket server"""
    port = 8000
    host = '0.0.0.0'
    
    logger.info(f"Starting WebSocket server on {host}:{port}")
    
    # Create the server with CORS headers
    async with websockets.serve(
        handle_websocket, 
        host, 
        port,
        # Set CORS headers
        process_request=lambda path, request_headers: {
            'headers': [
                ('Access-Control-Allow-Origin', '*'),
                ('Access-Control-Allow-Methods', 'GET, POST'),
                ('Access-Control-Allow-Headers', 'Content-Type'),
                ('Access-Control-Allow-Credentials', 'true'),
            ]
        }
    ):
        logger.info("Server started")
        await asyncio.Future()  # Run forever

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Server stopped by user")
    except Exception as e:
        logger.error(f"Server error: {e}")
