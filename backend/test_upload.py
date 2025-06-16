#!/usr/bin/env python3
"""
Test script to verify Supabase Storage content-type upload
"""

import os
from supabase import create_client, Client
import requests

# Supabase configuration
SUPABASE_URL = "https://jeymatvbyfaxhxztbjsw.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpleW1hdHZieWZheGh4enRianN3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDAwMjUyOSwiZXhwIjoyMDY1NTc4NTI5fQ.MLCW3Ewz9jTRHBOgkgzbOUzTJqRoow4u6uRps0v2Jjk"

def test_upload():
    # Initialize Supabase client
    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    # Create a simple test PDF content (just some bytes that look like a PDF)
    test_pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000074 00000 n \n0000000120 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n179\n%%EOF"
    
    # Test file path
    test_file_path = "test-uploads/test-content-type.pdf"
    
    print("Testing Supabase Storage upload with content-type...")
    
    try:
        # Test 1: Upload with content-type parameter
        print("\n1. Testing with file_options={'content-type': 'application/pdf'}")
        result1 = supabase.storage.from_("scraped-content").upload(
            test_file_path,
            test_pdf_content,
            file_options={"content-type": "application/pdf"}
        )
        print(f"Upload result: {result1}")
        
        # Get public URL
        public_url = supabase.storage.from_("scraped-content").get_public_url(test_file_path)
        print(f"Public URL: {public_url}")
        
        # Test the content-type by making a HEAD request
        print("\n2. Testing HTTP headers...")
        response = requests.head(public_url)
        print(f"Status: {response.status_code}")
        print(f"Content-Type: {response.headers.get('Content-Type', 'Not set')}")
        print(f"All headers: {dict(response.headers)}")
        
        # Clean up - delete the test file
        print("\n3. Cleaning up...")
        delete_result = supabase.storage.from_("scraped-content").remove([test_file_path])
        print(f"Delete result: {delete_result}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    test_upload()
