#!/usr/bin/env python3
"""
Test script to verify the enhanced web scraper features.
This script will test:
1. Page content capture with HTML storage
2. Context-aware content downloading
3. New API endpoints for serving files
4. Relationship tracking between pages and content
"""

import asyncio
import json
import time
import requests
import websockets
from urllib.parse import urljoin

# Configuration
BASE_URL = "http://localhost:8000"
WS_URL = "ws://localhost:8000"
TEST_URL = "https://httpbin.org/html"  # Simple test page with some content

def test_api_health():
    """Test if the API is healthy and has our new features"""
    print("🔍 Testing API health...")
    
    response = requests.get(f"{BASE_URL}/health")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ API is healthy: {data}")
        return True
    else:
        print(f"❌ API health check failed: {response.status_code}")
        return False

def start_scraping_session():
    """Start a new scraping session"""
    print("🚀 Starting new scraping session...")
    
    scrape_request = {
        "url": TEST_URL,
        "max_pages": 3,
        "delay": 1.0,
        "include_external": False,
        "scrape_whole_site": False,
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
    
    response = requests.post(f"{BASE_URL}/api/scrape/start", json=scrape_request)
    if response.status_code == 200:
        data = response.json()
        session_id = data["session_id"]
        print(f"✅ Session started: {session_id}")
        return session_id
    else:
        print(f"❌ Failed to start session: {response.status_code}")
        return None

async def run_scraping_session(session_id):
    """Run the scraping session via WebSocket"""
    print(f"🔌 Connecting to WebSocket for session {session_id}...")
    
    ws_url = f"{WS_URL}/ws/scrape/{session_id}"
    
    try:
        async with websockets.connect(ws_url) as websocket:
            print("✅ WebSocket connected")
            
            # Send scrape request
            scrape_request = {
                "url": TEST_URL,
                "max_pages": 3,
                "delay": 1.0,
                "include_external": False,
                "scrape_whole_site": False,
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
            
            await websocket.send(json.dumps(scrape_request))
            print("📤 Sent scrape request")
            
            # Listen for updates
            while True:
                try:
                    message = await asyncio.wait_for(websocket.recv(), timeout=30.0)
                    data = json.loads(message)
                    
                    print(f"📨 Received: {data.get('type', 'unknown')}")
                    
                    if data.get("type") == "scrape_complete":
                        print("✅ Scraping completed!")
                        return data.get("data")
                    elif data.get("type") == "error":
                        print(f"❌ Error: {data.get('message')}")
                        return None
                    elif data.get("type") == "status_update":
                        status = data.get("data", {})
                        print(f"📊 Progress: {status.get('progress', 0):.1f}% - {status.get('pages_scraped', 0)} pages")
                    elif data.get("type") == "content_downloaded":
                        content = data.get("data", {})
                        print(f"📥 Downloaded: {content.get('content_type')} - {content.get('url', '')[:50]}...")
                        
                except asyncio.TimeoutError:
                    print("⏰ WebSocket timeout")
                    break
                except websockets.exceptions.ConnectionClosed:
                    print("🔌 WebSocket connection closed")
                    break
                    
    except Exception as e:
        print(f"❌ WebSocket error: {e}")
        return None

def test_session_result(session_id):
    """Test getting session results and check for new features"""
    print(f"🔍 Testing session result for {session_id}...")
    
    response = requests.get(f"{BASE_URL}/api/scrape/result/{session_id}")
    if response.status_code == 200:
        data = response.json()
        
        print(f"✅ Session result retrieved")
        print(f"📊 Statistics:")
        print(f"  - Pages scraped: {data.get('statistics', {}).get('total_pages_scraped', 0)}")
        print(f"  - URLs found: {data.get('statistics', {}).get('total_urls_found', 0)}")
        print(f"  - Content downloaded: {data.get('statistics', {}).get('content_downloaded', 0)}")
        
        # Check for new page_contents field
        page_contents = data.get('page_contents', [])
        print(f"📄 Page contents: {len(page_contents)} pages")
        
        if page_contents:
            print("✅ Enhanced page content capture is working!")
            for i, page in enumerate(page_contents[:2]):  # Show first 2 pages
                print(f"  Page {i+1}: {page.get('title', 'No title')} - {page.get('url', '')[:50]}...")
                print(f"    Headings: {len(page.get('headings', []))}")
                print(f"    Images: {len(page.get('images', []))}")
                print(f"    Links: {len(page.get('links', []))}")
        else:
            print("⚠️  No page contents found (might be expected for simple test page)")
        
        # Check scraped content for context information
        scraped_content = data.get('scraped_content', [])
        print(f"📁 Scraped content: {len(scraped_content)} items")
        
        if scraped_content:
            for i, content in enumerate(scraped_content[:3]):  # Show first 3 items
                print(f"  Content {i+1}: {content.get('content_type')} - {content.get('url', '')[:50]}...")
                print(f"    File path: {content.get('file_path', 'No file')}")
                print(f"    Source page: {content.get('source_page_url', 'No source')[:50]}...")
                print(f"    Context: {content.get('context', 'No context')[:100]}...")
        
        return data
    else:
        print(f"❌ Failed to get session result: {response.status_code}")
        return None

def test_page_content_api(session_id):
    """Test the new page content API endpoint"""
    print(f"🔍 Testing page content API for {session_id}...")
    
    response = requests.get(f"{BASE_URL}/api/page-content/{session_id}")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Page content API working!")
        print(f"📄 Total pages: {data.get('total_pages', 0)}")
        
        page_contents = data.get('page_contents', [])
        if page_contents:
            print("📋 Page content details:")
            for i, page in enumerate(page_contents[:2]):
                print(f"  Page {i+1}: {page.get('title', 'No title')}")
                print(f"    URL: {page.get('url', '')}")
                print(f"    Text length: {len(page.get('text_content', ''))}")
                print(f"    HTML file: {page.get('file_path', 'No file')}")
        
        return data
    elif response.status_code == 404:
        print("⚠️  Page content not found (expected for old sessions)")
        return None
    else:
        print(f"❌ Page content API failed: {response.status_code}")
        return None

def test_file_serving(session_id, scraped_content):
    """Test the new file serving API"""
    print(f"🔍 Testing file serving API...")
    
    if not scraped_content:
        print("⚠️  No scraped content to test file serving")
        return
    
    # Find a content item with a file
    for content in scraped_content:
        file_path = content.get('file_path')
        if file_path:
            # Test the new API endpoint
            test_url = f"{BASE_URL}/api/content/{session_id}/{file_path.replace(session_id + '/', '')}"
            print(f"🔗 Testing file URL: {test_url}")
            
            response = requests.head(test_url)  # Use HEAD to avoid downloading
            if response.status_code == 200:
                print(f"✅ File serving API working!")
                print(f"  Content-Type: {response.headers.get('Content-Type', 'Unknown')}")
                print(f"  Content-Length: {response.headers.get('Content-Length', 'Unknown')}")
                return True
            else:
                print(f"❌ File serving failed: {response.status_code}")
    
    print("⚠️  No files found to test serving")
    return False

async def main():
    """Main test function"""
    print("🧪 Testing Enhanced Web Scraper Features")
    print("=" * 50)
    
    # Test 1: API Health
    if not test_api_health():
        print("❌ API health check failed, aborting tests")
        return
    
    print()
    
    # Test 2: Start session
    session_id = start_scraping_session()
    if not session_id:
        print("❌ Failed to start session, aborting tests")
        return
    
    print()
    
    # Test 3: Run scraping
    result = await run_scraping_session(session_id)
    if not result:
        print("❌ Scraping failed, continuing with other tests...")
    
    print()
    
    # Wait a moment for processing
    print("⏳ Waiting for processing to complete...")
    time.sleep(2)
    
    # Test 4: Check session result
    session_data = test_session_result(session_id)
    
    print()
    
    # Test 5: Test page content API
    test_page_content_api(session_id)
    
    print()
    
    # Test 6: Test file serving
    if session_data:
        test_file_serving(session_id, session_data.get('scraped_content', []))
    
    print()
    print("🎉 Enhanced feature testing completed!")
    print(f"📋 Session ID for manual testing: {session_id}")
    print(f"🌐 Frontend URL: http://localhost:3000")
    print(f"📚 API Docs: {BASE_URL}/docs")

if __name__ == "__main__":
    asyncio.run(main())
