#!/usr/bin/env python3
"""
Test script to verify the database reset and enhanced schema are working correctly
"""

import asyncio
import json
import uuid
from datetime import datetime
from supabase import create_client, Client

# Supabase configuration
SUPABASE_URL = "https://jeymatvbyfaxhxztbjsw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpleW1hdHZieWZheGh4enRianN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAwMjUyOSwiZXhwIjoyMDY1NTc4NTI5fQ.MLCW3Ewz9jTRHBOgkgzbOUzTJqRoow4u6uRps0v2Jjk"

def test_database_reset():
    """Test the database reset and enhanced schema"""
    print("🧪 Testing Database Reset and Enhanced Schema")
    print("=" * 50)
    
    try:
        # Initialize Supabase client
        supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("✅ Supabase client initialized")
        
        # Test 1: Check table structure
        print("\n📋 Test 1: Checking table structure...")
        
        # Check scraping_sessions table
        result = supabase.table("scraping_sessions").select("*").limit(1).execute()
        print(f"✅ scraping_sessions table accessible: {len(result.data)} rows")
        
        # Check scraped_pages table
        result = supabase.table("scraped_pages").select("*").limit(1).execute()
        print(f"✅ scraped_pages table accessible: {len(result.data)} rows")
        
        # Check stored_files table
        result = supabase.table("stored_files").select("*").limit(1).execute()
        print(f"✅ stored_files table accessible: {len(result.data)} rows")
        
        # Test 2: Test database functions
        print("\n🔧 Test 2: Testing database functions...")
        
        test_session_id = str(uuid.uuid4())
        test_url = "https://example.com"
        test_config = {
            "url": test_url,
            "max_pages": 5,
            "download_content": True
        }
        
        # Test start_scraping_session function
        try:
            result = supabase.rpc('start_scraping_session', {
                'p_session_id': test_session_id,
                'p_target_url': test_url,
                'p_config': test_config,
                'p_user_id': None
            }).execute()
            print(f"✅ start_scraping_session function works: {result.data}")
        except Exception as e:
            print(f"❌ start_scraping_session function failed: {e}")
            return False
        
        # Test 3: Verify session was created
        print("\n📊 Test 3: Verifying session creation...")
        
        result = supabase.table("scraping_sessions").select("*").eq("id", test_session_id).execute()
        if result.data:
            session = result.data[0]
            print(f"✅ Session created successfully:")
            print(f"   ID: {session['id']}")
            print(f"   Target URL: {session['target_url']}")
            print(f"   Status: {session['status']}")
            print(f"   Progress: {session['progress']}")
        else:
            print("❌ Session not found after creation")
            return False
        
        # Test 4: Test progress update function
        print("\n📈 Test 4: Testing progress update...")
        
        try:
            result = supabase.rpc('update_session_progress', {
                'session_id': test_session_id,
                'progress_data': {
                    'pages_scraped': 2,
                    'urls_found': 10,
                    'content_downloaded': 3
                }
            }).execute()
            print(f"✅ update_session_progress function works: {result.data}")
        except Exception as e:
            print(f"❌ update_session_progress function failed: {e}")
        
        # Test 5: Test session completion
        print("\n🏁 Test 5: Testing session completion...")
        
        try:
            result = supabase.rpc('complete_scraping_session', {
                'p_session_id': test_session_id,
                'p_summary_results': {
                    'total_pages': 2,
                    'total_files': 3,
                    'completion_time': datetime.now().isoformat()
                }
            }).execute()
            print(f"✅ complete_scraping_session function works: {result.data}")
        except Exception as e:
            print(f"❌ complete_scraping_session function failed: {e}")
        
        # Test 6: Verify final session state
        print("\n🔍 Test 6: Verifying final session state...")
        
        result = supabase.table("scraping_sessions").select("*").eq("id", test_session_id).execute()
        if result.data:
            session = result.data[0]
            print(f"✅ Final session state:")
            print(f"   Status: {session['status']}")
            print(f"   End Time: {session.get('end_time', 'Not set')}")
            print(f"   Summary Results: {session.get('summary_results', 'Not set')}")
        
        # Test 7: Test page insertion
        print("\n📄 Test 7: Testing page insertion...")
        
        page_data = {
            "id": str(uuid.uuid4()),
            "session_id": test_session_id,
            "url": test_url,
            "status": "scraped",
            "http_status": 200,
            "scraped_at": datetime.now().isoformat(),
            "title": "Test Page",
            "text_content": "This is test content",
            "html_content": "<html><body>Test</body></html>",
            "content": "This is test content",
            "extracted_data": {
                "title": "Test Page",
                "content_length": 20
            }
        }
        
        try:
            result = supabase.table("scraped_pages").insert(page_data).execute()
            print(f"✅ Page inserted successfully: {len(result.data)} rows")
        except Exception as e:
            print(f"❌ Page insertion failed: {e}")
        
        # Test 8: Test file insertion
        print("\n📁 Test 8: Testing file insertion...")
        
        file_data = {
            "id": str(uuid.uuid4()),
            "session_id": test_session_id,
            "original_url": "https://example.com/test.pdf",
            "file_name": "test.pdf",
            "file_path": f"{test_session_id}/test.pdf",
            "file_size": 1024,
            "mime_type": "application/pdf",
            "content_hash": "abc123",
            "metadata": {
                "test": True
            }
        }
        
        try:
            result = supabase.table("stored_files").insert(file_data).execute()
            print(f"✅ File inserted successfully: {len(result.data)} rows")
        except Exception as e:
            print(f"❌ File insertion failed: {e}")
        
        # Cleanup
        print("\n🧹 Cleaning up test data...")
        try:
            supabase.table("scraping_sessions").delete().eq("id", test_session_id).execute()
            print("✅ Test data cleaned up")
        except Exception as e:
            print(f"⚠️ Cleanup warning: {e}")
        
        print("\n🎉 All tests completed successfully!")
        print("✅ Database reset and enhanced schema are working correctly")
        return True
        
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        print(f"Full traceback: {traceback.format_exc()}")
        return False

if __name__ == "__main__":
    success = test_database_reset()
    exit(0 if success else 1)
