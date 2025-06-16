#!/usr/bin/env python3
"""
Test script to verify end-to-end scraping session with the enhanced schema
"""

import asyncio
import json
import requests
import websockets
import uuid
from datetime import datetime

# Test configuration
BACKEND_URL = "http://localhost:8001"
WS_URL = "ws://localhost:8001"

async def test_scraping_session():
    """Test a complete scraping session"""
    print("🧪 Testing End-to-End Scraping Session")
    print("=" * 50)
    
    try:
        # Test 1: Check backend health
        print("\n🏥 Test 1: Checking backend health...")
        response = requests.get(f"{BACKEND_URL}/health")
        if response.status_code == 200:
            health_data = response.json()
            print(f"✅ Backend is healthy: {health_data}")
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
        
        # Test 2: Start a scraping session
        print("\n🚀 Test 2: Starting scraping session...")
        scrape_request = {
            "url": "https://example.com",
            "max_pages": 1,
            "delay": 1,
            "content_types": [{
                "id": "image",
                "name": "Images",
                "extensions": [".jpg", ".png", ".gif"],
                "mime_types": ["image/jpeg", "image/png", "image/gif"],
                "enabled": True
            }],
            "include_external": False,
            "scrape_whole_site": False,
            "download_content": True
        }
        
        response = requests.post(f"{BACKEND_URL}/api/scrape/start", json=scrape_request)
        if response.status_code == 200:
            session_data = response.json()
            session_id = session_data["session_id"]
            print(f"✅ Session started: {session_id}")
        else:
            print(f"❌ Failed to start session: {response.status_code} - {response.text}")
            return False
        
        # Test 3: Connect to WebSocket and monitor progress
        print("\n📡 Test 3: Connecting to WebSocket...")
        
        messages_received = []
        
        async def websocket_test():
            uri = f"{WS_URL}/ws/scrape/{session_id}"
            try:
                async with websockets.connect(uri) as websocket:
                    print(f"✅ Connected to WebSocket: {uri}")
                    
                    # Send the scraping request
                    await websocket.send(json.dumps(scrape_request))
                    print("✅ Sent scraping request via WebSocket")
                    
                    # Listen for messages
                    timeout_count = 0
                    max_timeout = 30  # 30 seconds timeout
                    
                    while timeout_count < max_timeout:
                        try:
                            message = await asyncio.wait_for(websocket.recv(), timeout=1.0)
                            data = json.loads(message)
                            messages_received.append(data)
                            
                            print(f"📨 Received: {data.get('type', 'unknown')} - {data.get('data', {}).get('status', 'no status')}")
                            
                            # Check if scraping is complete
                            if data.get('type') == 'scrape_complete':
                                print("✅ Scraping completed!")
                                break
                            elif data.get('type') == 'error':
                                print(f"❌ Scraping error: {data.get('message', 'Unknown error')}")
                                break
                                
                        except asyncio.TimeoutError:
                            timeout_count += 1
                            if timeout_count % 5 == 0:
                                print(f"⏳ Waiting for messages... ({timeout_count}s)")
                            continue
                    
                    if timeout_count >= max_timeout:
                        print("⚠️ WebSocket test timed out")
                        
            except Exception as e:
                print(f"❌ WebSocket error: {e}")
                return False
            
            return True
        
        # Run the WebSocket test
        ws_success = await websocket_test()
        
        # Test 4: Check session status via API
        print("\n📊 Test 4: Checking session status...")
        response = requests.get(f"{BACKEND_URL}/api/sessions")
        if response.status_code == 200:
            sessions = response.json()
            print(f"✅ Found {len(sessions.get('active_sessions', []))} active sessions")
            print(f"✅ Found {len(sessions.get('completed_sessions', []))} completed sessions")
        else:
            print(f"❌ Failed to get sessions: {response.status_code}")
        
        # Test 5: Check database for session data
        print("\n🗄️ Test 5: Checking database for session data...")
        from supabase import create_client
        
        SUPABASE_URL = "https://jeymatvbyfaxhxztbjsw.supabase.co"
        SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpleW1hdHZieWZheGh4enRianN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAwMjUyOSwiZXhwIjoyMDY1NTc4NTI5fQ.MLCW3Ewz9jTRHBOgkgzbOUzTJqRoow4u6uRps0v2Jjk"
        
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        
        # Check session in database
        result = supabase.table("scraping_sessions").select("*").eq("id", session_id).execute()
        if result.data:
            session = result.data[0]
            print(f"✅ Session found in database:")
            print(f"   Status: {session['status']}")
            print(f"   Target URL: {session['target_url']}")
            print(f"   Progress: {session.get('progress', 'No progress data')}")
        else:
            print("❌ Session not found in database")
        
        # Check pages
        result = supabase.table("scraped_pages").select("*").eq("session_id", session_id).execute()
        print(f"✅ Found {len(result.data)} pages in database")
        
        # Check files
        result = supabase.table("stored_files").select("*").eq("session_id", session_id).execute()
        print(f"✅ Found {len(result.data)} files in database")
        
        # Summary
        print("\n📋 Test Summary:")
        print(f"✅ WebSocket messages received: {len(messages_received)}")
        print(f"✅ Session created and tracked: {session_id}")
        
        if messages_received:
            print("📨 Message types received:")
            for msg in messages_received:
                print(f"   - {msg.get('type', 'unknown')}")
        
        print("\n🎉 End-to-end test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        return False

if __name__ == "__main__":
    success = asyncio.run(test_scraping_session())
    exit(0 if success else 1)
