"""
WebSocket Connection Test Script for Web Scraper Backend
"""
import asyncio
import websockets
import json
import uuid
import sys
import requests
import time

# Configuration
BACKEND_HOST = "localhost"
BACKEND_PORT = 8000
TEST_URL = "https://example.com"

async def test_websocket_connection():
    """Test WebSocket connection to the backend"""
    print("=" * 50)
    print("WebSocket Connection Test")
    print("=" * 50)
    
    # Generate a session ID
    session_id = str(uuid.uuid4())
    print(f"Test session ID: {session_id}")
    
    # Create WebSocket URL
    ws_url = f"ws://{BACKEND_HOST}:{BACKEND_PORT}/ws/scrape/{session_id}"
    print(f"Connecting to: {ws_url}")
    
    try:
        # Connect to WebSocket
        print("\nAttempting connection...")
        async with websockets.connect(ws_url, timeout=10) as websocket:
            print("✅ Connection established!")
            
            # Create a simple scrape request
            request = {
                "url": TEST_URL,
                "max_pages": 1,
                "delay": 0.5,
                "include_external": False,
                "scrape_whole_site": False,
                "download_content": False,
                "content_types": []
            }
            
            # Send the request
            print(f"\nSending test request for URL: {TEST_URL}")
            await websocket.send(json.dumps(request))
            print("✅ Request sent!")
            
            # Wait for responses
            print("\nWaiting for responses (max 30 seconds)...")
            for _ in range(10):  # Try to receive up to 10 messages
                try:
                    response = await asyncio.wait_for(websocket.recv(), timeout=3.0)
                    data = json.loads(response)
                    print(f"\n📥 Received message: {data['type']}")
                    
                    if data['type'] == 'status_update':
                        print(f"  Status: {data['data']['status']}")
                        print(f"  Progress: {data['data']['progress']:.1f}%")
                        print(f"  Pages scraped: {data['data']['pages_scraped']}")
                    
                    elif data['type'] == 'scrape_complete':
                        print("✅ Scraping completed successfully!")
                        break
                        
                    elif data['type'] == 'error':
                        print(f"❌ Error: {data['message']}")
                        break
                        
                except asyncio.TimeoutError:
                    print("⏱️ Timeout waiting for response")
                    break
                except Exception as e:
                    print(f"❌ Error receiving message: {e}")
                    break
            
            print("\n✅ Test completed successfully!")
            return True
            
    except ConnectionRefusedError:
        print("\n❌ Connection refused! The backend server is not running or not accepting connections.")
        print("   Make sure the backend server is running on port 8000.")
        return False
    except Exception as e:
        print(f"\n❌ Connection failed: {e}")
        return False

def check_backend_api():
    """Check if the backend API is running"""
    print("=" * 50)
    print("Backend API Check")
    print("=" * 50)
    
    try:
        # Check health endpoint
        print("Checking health endpoint...")
        response = requests.get(f"http://{BACKEND_HOST}:{BACKEND_PORT}/health")
        if response.status_code == 200:
            data = response.json()
            print("✅ Backend API is running!")
            print(f"   Status: {data['status']}")
            print(f"   Crawl4AI available: {data.get('crawl4ai_available', 'unknown')}")
            print(f"   Active sessions: {data.get('active_sessions', 0)}")
            print(f"   Completed sessions: {data.get('completed_sessions', 0)}")
            return True
        else:
            print(f"❌ Health check failed with status: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to backend API. Make sure the server is running.")
        return False
    except Exception as e:
        print(f"❌ Backend API check failed: {e}")
        return False

def main():
    print("=" * 50)
    print("Web Scraper Backend Connection Test")
    print("=" * 50)
    print()
    
    # Check if backend API is running
    api_running = check_backend_api()
    
    if not api_running:
        print("\n❌ Backend API is not running. Please start the backend server first.")
        print("   Run: cd backend && python main.py")
        return
    
    # Test WebSocket connection
    asyncio.run(test_websocket_connection())
    
    print("\n" + "=" * 50)
    print("Diagnostics Complete")
    print("=" * 50)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nTest interrupted by user.")
        sys.exit(0)
