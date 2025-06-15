#!/usr/bin/env python3
"""
Minimal test server to debug WebSocket issues
"""
import json
import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Test Server")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Test server is working", "status": "ok"}

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.websocket("/ws/scrape/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    print(f"WebSocket connection attempt for session {session_id}")
    
    try:
        await websocket.accept()
        print(f"WebSocket connection accepted for session {session_id}")
        
        # Send initial confirmation
        await websocket.send_text(json.dumps({
            "type": "connection_established",
            "session_id": session_id,
            "message": "Test WebSocket connection established"
        }))
        
        # Wait for message
        data = await websocket.receive_text()
        print(f"Received: {data}")
        
        # Parse request
        request_data = json.loads(data)
        url = request_data.get("url", "unknown")
        
        # Send status update
        await websocket.send_text(json.dumps({
            "type": "status_update",
            "data": {
                "status": "processing",
                "current_url": url,
                "progress": 50
            }
        }))
        
        # Simulate some work
        await asyncio.sleep(2)
        
        # Send completion
        await websocket.send_text(json.dumps({
            "type": "scrape_complete",
            "data": {
                "session_id": session_id,
                "domain": "example.com",
                "urls": ["https://example.com", "https://example.com/about"],
                "statistics": {
                    "total_pages_scraped": 2,
                    "total_urls_found": 2,
                    "duration_seconds": 2.0
                }
            }
        }))
        
    except WebSocketDisconnect:
        print(f"WebSocket disconnected for session {session_id}")
    except Exception as e:
        print(f"WebSocket error for session {session_id}: {e}")
        try:
            await websocket.send_text(json.dumps({
                "type": "error",
                "message": str(e)
            }))
        except:
            pass

if __name__ == "__main__":
    import uvicorn
    print("🧪 Starting Test Server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
