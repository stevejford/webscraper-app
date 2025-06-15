"""
Test script to verify Crawl4AI installation and functionality
"""
import asyncio
import sys
from datetime import datetime

try:
    from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
    print("✅ Crawl4AI imported successfully")
except ImportError as e:
    print(f"❌ Failed to import Crawl4AI: {e}")
    print("Please run: pip install -U crawl4ai")
    sys.exit(1)

async def test_basic_crawl():
    """Test basic crawling functionality"""
    print("\n🧪 Testing basic crawling...")
    
    try:
        async with AsyncWebCrawler() as crawler:
            result = await crawler.arun(
                url="https://example.com",  # Changed from www.example.com to avoid connection issues
            )
            
            if result.success:
                print("✅ Basic crawl successful!")
                print(f"📄 Content length: {len(result.markdown)} characters")
                print(f"🔗 URL: {result.url}")
                print(f"📊 Status code: {result.status_code}")
                print("\n📝 First 200 characters of content:")
                print("-" * 50)
                print(result.markdown[:200] + "...")
                print("-" * 50)
                return True
            else:
                print(f"❌ Crawl failed: {result.error_message}")
                return False
                
    except Exception as e:
        print(f"❌ Exception during crawl: {e}")
        return False

async def test_advanced_features():
    """Test advanced crawling features"""
    print("\n🔬 Testing advanced features...")
    
    try:
        browser_config = BrowserConfig(
            headless=True,
            viewport_width=1920,
            viewport_height=1080
        )
        
        # Updated to use compatible parameters with Crawl4AI 0.6.3
        crawler_config = CrawlerRunConfig(
            page_timeout=5000,  # Changed from wait_for_timeout to page_timeout
            remove_overlay_elements=True
        )
        
        async with AsyncWebCrawler(config=browser_config) as crawler:
            result = await crawler.arun(
                url="https://example.com",  # Changed from crawl4ai.com to avoid connection issues
                config=crawler_config
            )
            
            if result.success:
                print("✅ Advanced crawl successful!")
                print(f"📄 Content length: {len(result.markdown)} characters")
                print(f"🔗 Links found: {len(result.links)}")
                print(f"🖼️ Images found: {len(result.media)}")
                return True
            else:
                print(f"❌ Advanced crawl failed: {result.error_message}")
                return False
                
    except Exception as e:
        print(f"❌ Exception during advanced crawl: {e}")
        return False

async def test_shopify_user_agent():
    """Test crawling with Shopify-optimized user agent"""
    print("\n🛍️ Testing Shopify-optimized crawling...")
    
    try:
        browser_config = BrowserConfig(
            headless=True,
            user_agent="Mozilla/5.0 (compatible; Shopify-Scraper/1.0; +https://shopify.com/robots)"
        )
        
        async with AsyncWebCrawler(config=browser_config) as crawler:
            result = await crawler.arun(
                url="https://example.com",  # Changed from www.example.com to avoid connection issues
            )
            
            if result.success:
                print("✅ Shopify user agent test successful!")
                print(f"📄 Content length: {len(result.markdown)} characters")
                return True
            else:
                print(f"❌ Shopify user agent test failed: {result.error_message}")
                return False
                
    except Exception as e:
        print(f"❌ Exception during Shopify test: {e}")
        return False

async def main():
    """Run all tests"""
    print("🚀 Crawl4AI Test Suite")
    print("=" * 50)
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tests = [
        ("Basic Crawl", test_basic_crawl),
        ("Advanced Features", test_advanced_features),
        ("Shopify User Agent", test_shopify_user_agent)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = await test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
        
        print()  # Add spacing between tests
    
    # Summary
    print("📊 Test Results Summary")
    print("=" * 50)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("🎉 All tests passed! Crawl4AI is ready to use.")
    else:
        print("⚠️  Some tests failed. Check the output above for details.")
    
    print(f"⏰ Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    asyncio.run(main())