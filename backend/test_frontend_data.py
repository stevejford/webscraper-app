#!/usr/bin/env python3
"""
Frontend Data Test - Check what data is available for the frontend
"""

import json
from supabase import create_client, Client
from datetime import datetime

# Supabase configuration
SUPABASE_URL = "https://jeymatvbyfaxhxztbjsw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpleW1hdHZieWZheGh4enRianN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDI1MjksImV4cCI6MjA2NTU3ODUyOX0.F6vOOWnYxYTHUx1AsEvKZ3T58xh7QfJoRBz37qk9XTk"

class FrontendDataTester:
    def __init__(self):
        self.supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    def check_sessions_data(self):
        """Check what session data exists"""
        print("🔍 Checking Sessions Data...")
        try:
            result = self.supabase.table("scraping_sessions").select("*").order("created_at", desc=True).execute()
            
            print(f"📊 Found {len(result.data)} sessions")
            
            for i, session in enumerate(result.data[:5]):  # Show first 5
                print(f"  Session {i+1}:")
                print(f"    ID: {session['id']}")
                print(f"    Domain: {session['domain']}")
                print(f"    Status: {session['status']}")
                print(f"    Created: {session['created_at']}")
                print(f"    Statistics: {session.get('statistics', {})}")
                print()
            
            return result.data
            
        except Exception as e:
            print(f"❌ Error checking sessions: {e}")
            return []
    
    def check_pages_data(self):
        """Check what page data exists"""
        print("🔍 Checking Pages Data...")
        try:
            result = self.supabase.table("scraped_pages").select("*").order("scraped_at", desc=True).execute()
            
            print(f"📊 Found {len(result.data)} pages")
            
            for i, page in enumerate(result.data[:5]):  # Show first 5
                print(f"  Page {i+1}:")
                print(f"    URL: {page['url']}")
                print(f"    Title: {page.get('title', 'No title')}")
                print(f"    Session ID: {page['session_id']}")
                print(f"    Content Length: {len(page.get('content', ''))}")
                print(f"    Scraped: {page['scraped_at']}")
                print()
            
            return result.data
            
        except Exception as e:
            print(f"❌ Error checking pages: {e}")
            return []
    
    def check_files_data(self):
        """Check what file data exists"""
        print("🔍 Checking Files Data...")
        try:
            result = self.supabase.table("stored_files").select("*").order("uploaded_at", desc=True).execute()
            
            print(f"📊 Found {len(result.data)} files")
            
            for i, file in enumerate(result.data[:5]):  # Show first 5
                print(f"  File {i+1}:")
                print(f"    Name: {file['file_name']}")
                print(f"    URL: {file['original_url']}")
                print(f"    Size: {file['file_size']} bytes")
                print(f"    Type: {file['mime_type']}")
                print(f"    Session ID: {file['session_id']}")
                print(f"    Public URL: {file.get('public_url', 'None')}")
                print(f"    Uploaded: {file['uploaded_at']}")
                print()
            
            return result.data
            
        except Exception as e:
            print(f"❌ Error checking files: {e}")
            return []
    
    def check_session_relationships(self):
        """Check relationships between sessions, pages, and files"""
        print("🔍 Checking Session Relationships...")
        try:
            # Get sessions with their related data
            sessions = self.supabase.table("scraping_sessions").select("*").execute().data
            
            for session in sessions[:3]:  # Check first 3 sessions
                session_id = session['id']
                print(f"📋 Session: {session_id}")
                print(f"   Domain: {session['domain']}")
                print(f"   Status: {session['status']}")
                
                # Get pages for this session
                pages = self.supabase.table("scraped_pages").select("*").eq("session_id", session_id).execute().data
                print(f"   📄 Pages: {len(pages)}")
                
                # Get files for this session
                files = self.supabase.table("stored_files").select("*").eq("session_id", session_id).execute().data
                print(f"   📁 Files: {len(files)}")
                
                # Show some page URLs
                if pages:
                    print(f"   📄 Sample pages:")
                    for page in pages[:3]:
                        print(f"      - {page['url']}")
                
                # Show some file names
                if files:
                    print(f"   📁 Sample files:")
                    for file in files[:3]:
                        print(f"      - {file['file_name']} ({file['mime_type']})")
                
                print()
            
        except Exception as e:
            print(f"❌ Error checking relationships: {e}")
    
    def check_recent_activity(self):
        """Check for recent scraping activity"""
        print("🔍 Checking Recent Activity...")
        try:
            # Get sessions from last 24 hours
            from datetime import datetime, timedelta
            yesterday = (datetime.now() - timedelta(days=1)).isoformat()
            
            recent_sessions = self.supabase.table("scraping_sessions").select("*").gte("created_at", yesterday).execute().data
            print(f"📊 Recent sessions (last 24h): {len(recent_sessions)}")
            
            recent_pages = self.supabase.table("scraped_pages").select("*").gte("scraped_at", yesterday).execute().data
            print(f"📊 Recent pages (last 24h): {len(recent_pages)}")
            
            recent_files = self.supabase.table("stored_files").select("*").gte("uploaded_at", yesterday).execute().data
            print(f"📊 Recent files (last 24h): {len(recent_files)}")
            
            if recent_sessions:
                print("🕒 Most recent session:")
                latest = max(recent_sessions, key=lambda x: x['created_at'])
                print(f"   ID: {latest['id']}")
                print(f"   Domain: {latest['domain']}")
                print(f"   Status: {latest['status']}")
                print(f"   Created: {latest['created_at']}")
                print(f"   Statistics: {latest.get('statistics', {})}")
            
        except Exception as e:
            print(f"❌ Error checking recent activity: {e}")
    
    def generate_frontend_test_data(self):
        """Generate sample data that frontend should be able to see"""
        print("🔍 Generating Frontend Test Data...")
        try:
            # Get all data in the format the frontend expects
            sessions = self.supabase.table("scraping_sessions").select("*").order("created_at", desc=True).execute().data
            
            frontend_data = {
                "sessions": [],
                "total_sessions": len(sessions),
                "total_pages": 0,
                "total_files": 0,
                "timestamp": datetime.now().isoformat()
            }
            
            for session in sessions:
                session_id = session['id']
                
                # Get pages and files for this session
                pages = self.supabase.table("scraped_pages").select("*").eq("session_id", session_id).execute().data
                files = self.supabase.table("stored_files").select("*").eq("session_id", session_id).execute().data
                
                frontend_data["total_pages"] += len(pages)
                frontend_data["total_files"] += len(files)
                
                session_data = {
                    "id": session_id,
                    "domain": session['domain'],
                    "status": session['status'],
                    "created_at": session['created_at'],
                    "statistics": session.get('statistics', {}),
                    "pages_count": len(pages),
                    "files_count": len(files),
                    "pages": [{"url": p['url'], "title": p.get('title')} for p in pages[:5]],
                    "files": [{"name": f['file_name'], "type": f['mime_type'], "size": f['file_size']} for f in files[:5]]
                }
                
                frontend_data["sessions"].append(session_data)
            
            # Save to file for frontend debugging
            with open("frontend_test_data.json", "w") as f:
                json.dump(frontend_data, f, indent=2)
            
            print(f"✅ Generated frontend test data:")
            print(f"   📊 Total Sessions: {frontend_data['total_sessions']}")
            print(f"   📄 Total Pages: {frontend_data['total_pages']}")
            print(f"   📁 Total Files: {frontend_data['total_files']}")
            print(f"   💾 Saved to: frontend_test_data.json")
            
            return frontend_data
            
        except Exception as e:
            print(f"❌ Error generating frontend data: {e}")
            return None
    
    def run_all_checks(self):
        """Run all frontend data checks"""
        print("🧪 Starting Frontend Data Analysis...")
        print("=" * 60)
        
        sessions = self.check_sessions_data()
        pages = self.check_pages_data()
        files = self.check_files_data()
        
        print("=" * 60)
        self.check_session_relationships()
        
        print("=" * 60)
        self.check_recent_activity()
        
        print("=" * 60)
        frontend_data = self.generate_frontend_test_data()
        
        print("=" * 60)
        print("🎯 Summary:")
        print(f"   📊 Sessions in DB: {len(sessions)}")
        print(f"   📄 Pages in DB: {len(pages)}")
        print(f"   📁 Files in DB: {len(files)}")
        
        if len(sessions) == 0:
            print("⚠️  WARNING: No sessions found! This explains why frontend shows no results.")
        elif len(pages) == 0:
            print("⚠️  WARNING: No pages found! Sessions exist but no content was saved.")
        elif len(files) == 0:
            print("⚠️  WARNING: No files found! Pages exist but no files were downloaded.")
        else:
            print("✅ Data looks good! Frontend should be able to display results.")
        
        return {
            "sessions": sessions,
            "pages": pages,
            "files": files,
            "frontend_data": frontend_data
        }

def main():
    """Main test runner"""
    tester = FrontendDataTester()
    results = tester.run_all_checks()

if __name__ == "__main__":
    main()
