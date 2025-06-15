# Crawl4AI Setup Guide

This directory contains the Crawl4AI installation and setup for our web scraper application.

## Installation Steps

### 1. Create Virtual Environment
```bash
cd D:\webscraper_project\web-scraper-app\crawler
python -m venv crawl4ai_env
```

### 2. Activate Virtual Environment

**Windows:**
```bash
crawl4ai_env\Scripts\activate
```

**macOS/Linux:**
```bash
source crawl4ai_env/bin/activate
```

### 3. Install Crawl4AI
```bash
# Install core Crawl4AI
pip install -U crawl4ai

# Run post-installation setup (installs Playwright browsers)
crawl4ai-setup

# Verify installation
crawl4ai-doctor
```

### 4. Test Installation
```python
import asyncio
from crawl4ai import AsyncWebCrawler, BrowserConfig, CrawlerRunConfig

async def main():
    async with AsyncWebCrawler() as crawler:
        result = await crawler.arun(url="https://www.example.com")
        print(result.markdown[:300])

if __name__ == "__main__":
    asyncio.run(main())
```

## Advanced Installation (Optional)

For enhanced features, you can install with additional dependencies:

```bash
# For PyTorch features (text clustering, semantic analysis)
pip install crawl4ai[torch]

# For Transformer features (advanced NLP)
pip install crawl4ai[transformer]

# For all features (comprehensive)
pip install crawl4ai[all]

# Pre-fetch models (optional, for better performance)
crawl4ai-download-models
```

## Integration with Our Web Scraper

The Crawl4AI installation will be used by our FastAPI backend located in `../backend/main.py`.

## Troubleshooting

### Common Issues:

1. **Playwright Setup Failures**
   ```bash
   python -m playwright install --with-deps chromium
   ```

2. **Missing OS Dependencies (Linux)**
   ```bash
   sudo apt-get install -y libwoff1 libopus0 libwebp7 libwebpdemux2
   ```

3. **Permission Issues (Windows)**
   - Run Command Prompt as Administrator
   - Disable antivirus temporarily during installation

### Verification Commands:
```bash
# Check Crawl4AI version
python -c "import crawl4ai; print(crawl4ai.__version__)"

# Run diagnostics
crawl4ai-doctor

# Test basic crawling
python test_crawl4ai.py
```

## Documentation Links

- [Official Docs](https://docs.crawl4ai.com/)
- [GitHub Repository](https://github.com/unclecode/crawl4ai)
- [Installation Guide](https://docs.crawl4ai.com/core/installation/)
- [Quick Start](https://docs.crawl4ai.com/core/quickstart/)