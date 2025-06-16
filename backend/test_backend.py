#!/usr/bin/env python3
"""
Backend Test Suite - Comprehensive testing for web scraper components
"""

import asyncio
import json
import uuid
from datetime import datetime
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import requests

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = "https://jeymatvbyfaxhxztbjsw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpleW1hdHZieWZheGh4enRianN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDI1MjksImV4cCI6MjA2NTU3ODUyOX0.F6vOOWnYxYTHUx1AsEvKZ3T58xh7QfJoRBz37qk9XTk"

class BackendTester:
    def __init__(self):
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
        self.test_session_id = str(uuid.uuid4())
        self.results = []
        
    def log_result(self, test_name: str, success: bool, message: str, data=None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "message": message,
            "data": data,
            "timestamp": datetime.now().isoformat()
        }
        self.results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        if data and not success:
            print(f"   Data: {data}")
    
    def test_supabase_connection(self):
        """Test 1: Supabase Connection"""
        try:
            # Test basic connection
            result = self.supabase.table("scraping_sessions").select("count").execute()
            self.log_result("Supabase Connection", True, "Successfully connected to Supabase")
            return True
        except Exception as e:
            self.log_result("Supabase Connection", False, f"Failed to connect: {str(e)}")
            return False
    
    def test_database_schema(self):
        """Test 2: Database Schema Validation"""
        try:
            # Test scraping_sessions table
            sessions_result = self.supabase.table("scraping_sessions").select("*").limit(1).execute()
            
            # Test scraped_pages table  
            pages_result = self.supabase.table("scraped_pages").select("*").limit(1).execute()
            
            # Test stored_files table
            files_result = self.supabase.table("stored_files").select("*").limit(1).execute()
            
            self.log_result("Database Schema", True, "All required tables exist and are accessible")
            return True
        except Exception as e:
            self.log_result("Database Schema", False, f"Schema validation failed: {str(e)}")
            return False
    
    def test_session_creation(self):
        """Test 3: Session Creation"""
        try:
            session_data = {
                "id": self.test_session_id,
                "user_id": None,  # Use NULL for anonymous user
                "target_url": "https://test.com",
                "status": "running",
                "config": {
                    "url": "https://test.com",
                    "max_pages": 5,
                    "download_content": True
                },
                "progress": {
                    "pages_scraped": 0,
                    "files_downloaded": 0,
                    "urls_found": 0,
                    "content_downloaded": 0
                }
            }
            
            result = self.supabase.table("scraping_sessions").insert(session_data).execute()
            
            if result.data:
                self.log_result("Session Creation", True, f"Session created successfully: {self.test_session_id}")
                return True
            else:
                self.log_result("Session Creation", False, "No data returned from session creation")
                return False
                
        except Exception as e:
            self.log_result("Session Creation", False, f"Failed to create session: {str(e)}")
            return False
    
    def test_page_insertion(self):
        """Test 4: Page Data Insertion"""
        try:
            page_data = {
                "session_id": self.test_session_id,
                "url": "https://test.com/page1",
                "title": "Test Page",
                "content": "This is test content for the page",
                "html_content": "<html><body>Test</body></html>",
                "metadata": {
                    "scraped_at": datetime.now().isoformat(),
                    "content_length": 100
                }
            }
            
            result = self.supabase.table("scraped_pages").insert(page_data).execute()
            
            if result.data:
                self.log_result("Page Insertion", True, f"Page inserted successfully")
                return True
            else:
                self.log_result("Page Insertion", False, "No data returned from page insertion")
                return False
                
        except Exception as e:
            self.log_result("Page Insertion", False, f"Failed to insert page: {str(e)}")
            return False
    
    def test_file_insertion(self):
        """Test 5: File Data Insertion"""
        try:
            file_data = {
                "session_id": self.test_session_id,
                "original_url": "https://test.com/file.pdf",
                "file_name": "test_file.pdf",
                "file_path": f"{self.test_session_id}/test_file.pdf",
                "file_size": 1024,
                "mime_type": "application/pdf",
                "content_hash": "test_hash_123",
                "public_url": f"https://storage.supabase.co/object/public/scraped-content/{self.test_session_id}/test_file.pdf",
                "is_deduped": False,
                "metadata": {
                    "downloaded_at": datetime.now().isoformat()
                }
            }
            
            result = self.supabase.table("stored_files").insert(file_data).execute()
            
            if result.data:
                self.log_result("File Insertion", True, f"File record inserted successfully")
                return True
            else:
                self.log_result("File Insertion", False, "No data returned from file insertion")
                return False
                
        except Exception as e:
            self.log_result("File Insertion", False, f"Failed to insert file record: {str(e)}")
            return False
    
    def test_data_retrieval(self):
        """Test 6: Data Retrieval"""
        try:
            # Test session retrieval
            session_result = self.supabase.table("scraping_sessions").select("*").eq("id", self.test_session_id).execute()
            
            # Test pages retrieval
            pages_result = self.supabase.table("scraped_pages").select("*").eq("session_id", self.test_session_id).execute()
            
            # Test files retrieval
            files_result = self.supabase.table("stored_files").select("*").eq("session_id", self.test_session_id).execute()
            
            session_count = len(session_result.data) if session_result.data else 0
            pages_count = len(pages_result.data) if pages_result.data else 0
            files_count = len(files_result.data) if files_result.data else 0
            
            self.log_result("Data Retrieval", True, 
                          f"Retrieved - Sessions: {session_count}, Pages: {pages_count}, Files: {files_count}",
                          {
                              "session_data": session_result.data,
                              "pages_data": pages_result.data,
                              "files_data": files_result.data
                          })
            return True
            
        except Exception as e:
            self.log_result("Data Retrieval", False, f"Failed to retrieve data: {str(e)}")
            return False
    
    def test_backend_api(self):
        """Test 7: Backend API Endpoints"""
        try:
            # Test health endpoint
            response = requests.get("http://localhost:8001/health", timeout=5)
            
            if response.status_code == 200:
                self.log_result("Backend API", True, f"API is responding: {response.json()}")
                return True
            else:
                self.log_result("Backend API", False, f"API returned status {response.status_code}")
                return False
                
        except requests.exceptions.ConnectionError:
            self.log_result("Backend API", False, "Cannot connect to backend API - is it running on port 8001?")
            return False
        except Exception as e:
            self.log_result("Backend API", False, f"API test failed: {str(e)}")
            return False
    
    def test_storage_bucket(self):
        """Test 8: Storage Bucket Access"""
        try:
            # Test bucket access by listing objects
            result = self.supabase.storage.from_("scraped-content").list()
            
            self.log_result("Storage Bucket", True, f"Storage bucket accessible, contains {len(result)} items")
            return True
            
        except Exception as e:
            self.log_result("Storage Bucket", False, f"Storage bucket test failed: {str(e)}")
            return False
    
    def cleanup_test_data(self):
        """Cleanup: Remove test data"""
        try:
            # Delete test files
            self.supabase.table("stored_files").delete().eq("session_id", self.test_session_id).execute()
            
            # Delete test pages
            self.supabase.table("scraped_pages").delete().eq("session_id", self.test_session_id).execute()
            
            # Delete test session
            self.supabase.table("scraping_sessions").delete().eq("id", self.test_session_id).execute()
            
            self.log_result("Cleanup", True, "Test data cleaned up successfully")
            
        except Exception as e:
            self.log_result("Cleanup", False, f"Cleanup failed: {str(e)}")
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🧪 Starting Backend Test Suite...")
        print("=" * 50)
        
        tests = [
            self.test_supabase_connection,
            self.test_database_schema,
            self.test_session_creation,
            self.test_page_insertion,
            self.test_file_insertion,
            self.test_data_retrieval,
            self.test_backend_api,
            self.test_storage_bucket
        ]
        
        passed = 0
        total = len(tests)
        
        for test in tests:
            if test():
                passed += 1
        
        print("=" * 50)
        print(f"🧪 Test Results: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All tests passed! Backend is working correctly.")
        else:
            print("❌ Some tests failed. Check the details above.")
        
        # Always cleanup
        self.cleanup_test_data()
        
        return self.results

def main():
    """Main test runner"""
    tester = BackendTester()
    results = tester.run_all_tests()
    
    # Save results to file
    with open("test_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to test_results.json")

if __name__ == "__main__":
    main()
