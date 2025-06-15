#!/usr/bin/env python3
"""
Test script to isolate Crawl4AI issues
"""
import asyncio
import sys
import os

# Add the backend directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'backend'))

try:
    from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig, CacheMode
    print("✅ Crawl4AI imports successful")
except ImportError as e:
    print(f"❌ Failed to import Crawl4AI: {e}")
    sys.exit(1)

async def test_crawl4ai():
    """Test Crawl4AI with the same configuration as the backend"""
    
    print("🚀 Starting Crawl4AI test...")
    
    # Configure browser (same as backend)
    browser_config = BrowserConfig(
        headless=True,
        java_script_enabled=True,
        browser_type="chromium",
        verbose=True
    )
    
    # Configure crawler (same as backend)
    crawler_config = CrawlerRunConfig(
        wait_for_timeout=10000,
        remove_overlay_elements=True,
        delay_before_return_html=2.0,
        cache_mode=CacheMode.BYPASS,
        word_count_threshold=10,
        only_text=False
    )
    
    test_url = "https://example.com"
    
    try:
        print(f"🌐 Testing URL: {test_url}")
        print(f"📋 Browser config: {browser_config}")
        print(f"📋 Crawler config: {crawler_config}")
        
        async with AsyncWebCrawler(config=browser_config) as crawler:
            print("🔧 Crawler initialized successfully")
            
            print("🕷️ Starting crawl...")
            result = await crawler.arun(url=test_url, config=crawler_config)
            
            print(f"📊 Crawl completed!")
            print(f"   - Result object: {result is not None}")
            print(f"   - Success: {result.success if result else 'No result'}")
            print(f"   - HTML present: {result.html is not None if result else 'No result'}")
            print(f"   - HTML length: {len(result.html) if result and result.html else 'No HTML'}")
            
            if result and hasattr(result, 'error_message'):
                print(f"   - Error message: {result.error_message}")
            
            if result and result.html:
                print(f"   - HTML preview (first 200 chars): {result.html[:200]}...")
                print("✅ SUCCESS: HTML content retrieved successfully!")
                
                # Test BeautifulSoup parsing
                try:
                    from bs4 import BeautifulSoup
                    soup = BeautifulSoup(result.html, 'html.parser')
                    links = soup.find_all('a', href=True)
                    print(f"   - Found {len(links)} links")
                    print("✅ SUCCESS: BeautifulSoup parsing successful!")
                except Exception as e:
                    print(f"❌ BeautifulSoup parsing failed: {e}")
            else:
                print("❌ FAILED: No HTML content retrieved")
                if result:
                    print(f"   - Result attributes: {dir(result)}")
                
    except Exception as e:
        print(f"❌ FAILED: Exception during crawl: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("🧪 Crawl4AI Test Script")
    print("=" * 50)
    asyncio.run(test_crawl4ai())
