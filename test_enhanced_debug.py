#!/usr/bin/env python3

import asyncio
import json
import websockets
import requests

async def test_enhanced_features():
    """Test the enhanced features with debug logging"""
    
    # Start a scraping session
    response = requests.post("http://localhost:8000/api/scrape/start", json={
        "url": "https://www.bnd.com.au/",
        "max_pages": 3,
        "delay": 0.5,
        "download_content": True,
        "content_types": [
            {
                "id": "images",
                "name": "Images",
                "extensions": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
                "mime_types": ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
                "enabled": True
            }
        ]
    })
    
    if response.status_code != 200:
        print(f"Failed to start scraping: {response.text}")
        return
    
    session_data = response.json()
    session_id = session_data["session_id"]
    print(f"Started session: {session_id}")
    
    # Connect to WebSocket
    uri = f"ws://localhost:8000/ws/scrape/{session_id}"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected to WebSocket")
            
            # Send scraping request
            request_data = {
                "url": "https://www.bnd.com.au/",
                "max_pages": 3,
                "delay": 0.5,
                "download_content": True,
                "content_types": [
                    {
                        "id": "images",
                        "name": "Images",
                        "extensions": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"],
                        "mime_types": ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"],
                        "enabled": True
                    }
                ]
            }
            
            await websocket.send(json.dumps(request_data))
            print("Sent scraping request")
            
            # Listen for messages
            while True:
                try:
                    message = await asyncio.wait_for(websocket.recv(), timeout=30.0)
                    data = json.loads(message)
                    print(f"Received: {data.get('type', 'unknown')}")
                    
                    if data.get("type") == "scrape_complete":
                        print("Scraping completed!")
                        break
                    elif data.get("type") == "error":
                        print(f"Error: {data.get('message')}")
                        break
                        
                except asyncio.TimeoutError:
                    print("Timeout waiting for message")
                    break
                    
    except Exception as e:
        print(f"WebSocket error: {e}")
    
    # Check the results
    print(f"\nChecking results for session {session_id}...")
    
    # Get scrape result
    result_response = requests.get(f"http://localhost:8000/api/scrape/result/{session_id}")
    if result_response.status_code == 200:
        result = result_response.json()
        print(f"Pages scraped: {len(result.get('page_contents', []))}")
        print(f"Content downloaded: {len(result.get('scraped_content', []))}")
    else:
        print(f"Failed to get result: {result_response.status_code}")
    
    # Get page content
    page_response = requests.get(f"http://localhost:8000/api/page-content/{session_id}")
    if page_response.status_code == 200:
        page_data = page_response.json()
        print(f"Page contents available: {page_data.get('total_pages', 0)}")
    else:
        print(f"Page content not available: {page_response.status_code}")

    # Check deduplication stats
    dedup_response = requests.get("http://localhost:8000/api/deduplication/stats")
    if dedup_response.status_code == 200:
        dedup_data = dedup_response.json()
        print(f"\nDeduplication Stats:")
        print(f"  Unique files: {dedup_data.get('total_unique_files', 0)}")
        print(f"  Total size: {dedup_data.get('total_file_size_mb', 0)} MB")
        print(f"  Content by type: {dedup_data.get('content_by_type', {})}")

        # Show statistics from the scrape result
        if result_response.status_code == 200:
            result = result_response.json()
            stats = result.get('statistics', {})
            print(f"\nScrape Statistics:")
            print(f"  Total content downloaded: {stats.get('content_downloaded', 0)}")
            print(f"  Unique content: {stats.get('unique_content_downloaded', 0)}")
            print(f"  Duplicates skipped: {stats.get('duplicate_content_skipped', 0)}")
            print(f"  Space saved: {stats.get('space_saved_by_deduplication', 0)} bytes")
    else:
        print(f"Deduplication stats not available: {dedup_response.status_code}")

if __name__ == "__main__":
    asyncio.run(test_enhanced_features())
