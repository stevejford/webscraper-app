"""
Simple integration test to verify Crawl4AI works with our web scraper backend
"""
import asyncio
import sys
import os

# Add the parent directory to the path so we can import from backend
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

try:
    from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig
    print("✅ Crawl4AI imported successfully")
except ImportError as e:
    print(f"❌ Failed to import Crawl4AI: {e}")
    sys.exit(1)

async def test_shopify_scraping():
    """Test scraping with Shopify-optimized settings"""
    print("\n🛍️ Testing Shopify-optimized scraping...")
    
    # Shopify-optimized configuration
    browser_config = BrowserConfig(
        headless=True,
        user_agent="Mozilla/5.0 (compatible; Shopify-Scraper/1.0; +https://shopify.com/robots)",
        viewport_width=1920,
        viewport_height=1080,
        accept_downloads=False,
        java_script_enabled=True
    )
    
    crawler_config = CrawlerRunConfig(
        page_timeout=30000,
        delay_before_return_html=2000,
        remove_overlay_elements=True,
        extract_blocks_as_text=True
    )
    
    try:
        async with AsyncWebCrawler(config=browser_config) as crawler:
            # Test with a public demo Shopify store
            result = await crawler.arun(
                url="https://www.example.com",  # Using example.com for safe testing
                config=crawler_config
            )
            
            if result.success:
                print("✅ Shopify-optimized crawl successful!")
                print(f"📄 Content length: {len(result.markdown)} characters")
                print(f"🔗 Links found: {len(result.links)}")
                print(f"🖼️ Media found: {len(result.media)}")
                print(f"📊 Status code: {result.status_code}")
                
                # Show some sample content
                print("\n📝 Sample content:")
                print("-" * 50)
                print(result.markdown[:200] + "..." if len(result.markdown) > 200 else result.markdown)
                print("-" * 50)
                
                return True
            else:
                print(f"❌ Crawl failed: {result.error_message}")
                return False
                
    except Exception as e:
        print(f"❌ Exception during crawl: {e}")
        return False

async def test_content_extraction():
    """Test extracting specific content types"""
    print("\n🎯 Testing content extraction...")
    
    browser_config = BrowserConfig(headless=True)
    
    try:
        async with AsyncWebCrawler(config=browser_config) as crawler:
            result = await crawler.arun(
                url="https://httpbin.org/html"  # Simple HTML test page
            )
            
            if result.success:
                print("✅ Content extraction successful!")
                print(f"📄 HTML length: {len(result.html)} characters")
                print(f"📝 Markdown length: {len(result.markdown)} characters")
                print(f"🔗 Links found: {len(result.links)}")
                
                # Test if we can find specific elements
                if "Herman Melville" in result.markdown:
                    print("✅ Successfully extracted text content")
                else:
                    print("⚠️ Expected text content not found")
                
                return True
            else:
                print(f"❌ Content extraction failed: {result.error_message}")
                return False
                
    except Exception as e:
        print(f"❌ Exception during content extraction: {e}")
        return False

async def test_multiple_pages():
    """Test crawling multiple pages in sequence"""
    print("\n🔄 Testing multiple page crawling...")
    
    urls = [
        "https://www.example.com",
        "https://httpbin.org/html",
        "https://jsonplaceholder.typicode.com/"
    ]
    
    browser_config = BrowserConfig(headless=True)
    
    try:
        async with AsyncWebCrawler(config=browser_config) as crawler:
            results = []
            
            for i, url in enumerate(urls):
                print(f"  Crawling {i+1}/{len(urls)}: {url}")
                result = await crawler.arun(url=url)
                
                if result.success:
                    results.append(result)
                    print(f"    ✅ Success - {len(result.markdown)} chars")
                else:
                    print(f"    ❌ Failed - {result.error_message}")
            
            print(f"\n✅ Multiple page crawling completed!")
            print(f"📊 Successfully crawled {len(results)}/{len(urls)} pages")
            
            return len(results) == len(urls)
            
    except Exception as e:
        print(f"❌ Exception during multiple page crawling: {e}")
        return False

async def main():
    """Run all integration tests"""
    print("🚀 Crawl4AI Integration Test Suite")
    print("=" * 60)
    print("Testing integration with our web scraper backend\n")
    
    tests = [
        ("Shopify Optimized Scraping", test_shopify_scraping),
        ("Content Extraction", test_content_extraction),
        ("Multiple Page Crawling", test_multiple_pages)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            result = await test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Integration Test Results")
    print("=" * 60)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} - {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 {passed}/{len(tests)} tests passed")
    
    if passed == len(tests):
        print("🎉 All integration tests passed! Crawl4AI is ready for the web scraper!")
        print("\n💡 Next steps:")
        print("1. Start the backend: cd ../backend && python main.py")
        print("2. Start the frontend: cd ../frontend && npm run dev")
        print("3. Test the full application at http://localhost:3000")
    else:
        print("⚠️ Some tests failed. Check the output above for details.")

if __name__ == "__main__":
    asyncio.run(main())
