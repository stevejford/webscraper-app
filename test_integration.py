"""
Integration test script to verify frontend-backend connection with Crawl4AI
"""
import asyncio
import json
import requests
import time
from datetime import datetime

# Test configuration
BACKEND_URL = "http://localhost:8000"
FRONTEND_URL = "http://localhost:3000"

def test_backend_health():
    """Test if backend is running and healthy"""
    print("🔍 Testing backend health...")
    
    try:
        response = requests.get(f"{BACKEND_URL}/health", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend is healthy")
            print(f"   Crawl4AI Available: {data.get('crawl4ai_available', False)}")
            print(f"   Active Sessions: {data.get('active_sessions', 0)}")
            return True
        else:
            print(f"❌ Backend health check failed: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to backend: {e}")
        return False

def test_api_endpoints():
    """Test basic API endpoints"""
    print("\n🔍 Testing API endpoints...")
    
    # Test root endpoint
    try:
        response = requests.get(f"{BACKEND_URL}/", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Root endpoint: {data.get('message', '')}")
        else:
            print(f"❌ Root endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Root endpoint error: {e}")
    
    # Test sessions endpoint
    try:
        response = requests.get(f"{BACKEND_URL}/api/scrape/sessions", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Sessions endpoint: {len(data.get('active_sessions', []))} active, {len(data.get('completed_sessions', []))} completed")
        else:
            print(f"❌ Sessions endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Sessions endpoint error: {e}")

def test_start_scraping():
    """Test starting a scraping session"""
    print("\n🔍 Testing scraping start endpoint...")
    
    # Prepare test request
    test_request = {
        "url": "https://example.com",
        "max_pages": 2,
        "delay": 0.5,
        "include_external": False,
        "scrape_whole_site": False,
        "download_content": True,
        "content_types": [
            {
                "id": "images",
                "name": "Images",
                "extensions": [".jpg", ".png"],
                "mime_types": ["image/*"],
                "enabled": True
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{BACKEND_URL}/api/scrape/start",
            json=test_request,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            session_id = data.get('session_id')
            print(f"✅ Scraping started: Session {session_id}")
            return session_id
        else:
            print(f"❌ Scraping start failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Scraping start error: {e}")
        return None

def test_frontend_accessibility():
    """Test if frontend is accessible"""
    print("\n🔍 Testing frontend accessibility...")
    
    try:
        response = requests.get(FRONTEND_URL, timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is accessible")
            return True
        else:
            print(f"❌ Frontend not accessible: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to frontend: {e}")
        return False

def test_static_files():
    """Test if static files are served correctly"""
    print("\n🔍 Testing static file serving...")
    
    try:
        # Test downloads directory
        response = requests.get(f"{BACKEND_URL}/downloads/", timeout=5)
        print(f"✅ Downloads directory accessible (status: {response.status_code})")
        return True
    except Exception as e:
        print(f"❌ Static files test error: {e}")
        return False

def test_cors_headers():
    """Test CORS headers for frontend-backend communication"""
    print("\n🔍 Testing CORS configuration...")
    
    try:
        # Test preflight request
        headers = {
            'Origin': FRONTEND_URL,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type'
        }
        
        response = requests.options(f"{BACKEND_URL}/api/scrape/start", headers=headers, timeout=5)
        
        cors_headers = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
        }
        
        if cors_headers['Access-Control-Allow-Origin']:
            print("✅ CORS is properly configured")
            print(f"   Allowed Origin: {cors_headers['Access-Control-Allow-Origin']}")
            return True
        else:
            print("❌ CORS headers not found")
            return False
    except Exception as e:
        print(f"❌ CORS test error: {e}")
        return False

def print_setup_instructions():
    """Print setup instructions if tests fail"""
    print("\n" + "="*60)
    print("🛠️  SETUP INSTRUCTIONS")
    print("="*60)
    print("\n1. Install and setup Crawl4AI:")
    print("   cd crawler")
    print("   install.bat  # Windows")
    print("   # or: ./install.sh  # macOS/Linux")
    
    print("\n2. Start the backend:")
    print("   cd backend")
    print("   venv\\Scripts\\activate  # Windows")
    print("   # or: source venv/bin/activate  # macOS/Linux")
    print("   python main.py")
    
    print("\n3. Start the frontend:")
    print("   cd frontend")
    print("   npm install")
    print("   npm run dev")
    
    print("\n4. Open your browser:")
    print(f"   Frontend: {FRONTEND_URL}")
    print(f"   Backend API Docs: {BACKEND_URL}/docs")
    
    print("\n5. Test the integration:")
    print("   - Enter a URL to scrape")
    print("   - Enable content download options")
    print("   - Start scraping and watch real-time progress")

def main():
    """Run all integration tests"""
    print("🕷️ Web Scraper Integration Test Suite")
    print("=" * 50)
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"🎯 Backend URL: {BACKEND_URL}")
    print(f"🎯 Frontend URL: {FRONTEND_URL}")
    
    tests = [
        ("Backend Health", test_backend_health),
        ("API Endpoints", test_api_endpoints),
        ("Frontend Accessibility", test_frontend_accessibility),
        ("Static Files", test_static_files),
        ("CORS Configuration", test_cors_headers),
        ("Scraping Start", test_start_scraping)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = test_func()
            results.append((test_name, bool(result)))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "="*50)
    print("📊 Integration Test Results")
    print("="*50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("\n🎉 All tests passed! The web scraper is ready to use.")
        print(f"🌐 Open {FRONTEND_URL} to start scraping!")
    else:
        print(f"\n⚠️  {len(tests) - passed} tests failed.")
        if passed < 3:  # If major components are failing
            print_setup_instructions()
        else:
            print("💡 Check the console output above for specific issues.")
    
    print(f"\n⏰ Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()
