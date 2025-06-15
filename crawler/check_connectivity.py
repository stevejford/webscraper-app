"""
Check internet connectivity and network settings for Crawl4AI
"""
import socket
import urllib.request
import sys
import subprocess
import platform
import time
from datetime import datetime

def print_header(message):
    """Print a formatted header"""
    print("\n" + "=" * 50)
    print(f"  {message}")
    print("=" * 50)

def check_dns():
    """Check if DNS resolution is working"""
    print("🔍 Testing DNS resolution...")
    
    test_domains = ["example.com", "google.com", "microsoft.com"]
    results = []
    
    for domain in test_domains:
        try:
            ip = socket.gethostbyname(domain)
            results.append((domain, True, ip))
            print(f"✅ {domain} resolves to {ip}")
        except socket.gaierror:
            results.append((domain, False, None))
            print(f"❌ Failed to resolve {domain}")
    
    success_count = sum(1 for _, success, _ in results if success)
    if success_count == 0:
        print("❌ DNS resolution is completely failing")
        print("   This is likely a network configuration issue")
        return False
    elif success_count < len(test_domains):
        print("⚠️ Some DNS lookups are failing, but not all")
        print("   This could indicate partial connectivity issues")
        return True
    else:
        print("✅ DNS resolution is working correctly")
        return True

def check_http_connectivity():
    """Check if HTTP connections can be established"""
    print("\n🌐 Testing HTTP connectivity...")
    
    test_urls = [
        "http://example.com",
        "https://www.google.com",
        "https://www.microsoft.com"
    ]
    
    results = []
    
    for url in test_urls:
        try:
            start_time = time.time()
            response = urllib.request.urlopen(url, timeout=5)
            elapsed = time.time() - start_time
            
            results.append((url, True, response.status, elapsed))
            print(f"✅ {url} - Status: {response.status} - Time: {elapsed:.2f}s")
        except Exception as e:
            results.append((url, False, None, None))
            print(f"❌ Failed to connect to {url}: {e}")
    
    success_count = sum(1 for _, success, _, _ in results if success)
    if success_count == 0:
        print("❌ HTTP connectivity is completely failing")
        print("   This could be due to network restrictions or firewall issues")
        return False
    elif success_count < len(test_urls):
        print("⚠️ Some HTTP connections are failing, but not all")
        print("   This could indicate partial connectivity or specific site blocking")
        return True
    else:
        print("✅ HTTP connectivity is working correctly")
        return True

def check_proxy_settings():
    """Check system proxy settings"""
    print("\n🔄 Checking proxy settings...")
    
    system = platform.system()
    
    if system == "Windows":
        try:
            # Check Windows proxy settings
            import winreg
            internet_settings = winreg.OpenKey(winreg.HKEY_CURRENT_USER, 
                r'Software\Microsoft\Windows\CurrentVersion\Internet Settings')
            proxy_enabled = winreg.QueryValueEx(internet_settings, 'ProxyEnable')[0]
            
            if proxy_enabled:
                proxy_server = winreg.QueryValueEx(internet_settings, 'ProxyServer')[0]
                print(f"⚠️ System proxy is enabled: {proxy_server}")
                print("   This might interfere with Crawl4AI's network connections")
                return True
            else:
                print("✅ No system proxy detected")
                return False
        except Exception as e:
            print(f"⚠️ Could not check Windows proxy settings: {e}")
            return False
    elif system == "Linux" or system == "Darwin":  # Darwin is macOS
        try:
            # Check environment variables for proxy
            import os
            http_proxy = os.environ.get('http_proxy') or os.environ.get('HTTP_PROXY')
            https_proxy = os.environ.get('https_proxy') or os.environ.get('HTTPS_PROXY')
            
            if http_proxy or https_proxy:
                print(f"⚠️ Proxy environment variables detected:")
                if http_proxy:
                    print(f"   HTTP_PROXY: {http_proxy}")
                if https_proxy:
                    print(f"   HTTPS_PROXY: {https_proxy}")
                print("   These might interfere with Crawl4AI's network connections")
                return True
            else:
                print("✅ No proxy environment variables detected")
                return False
        except Exception as e:
            print(f"⚠️ Could not check proxy environment variables: {e}")
            return False
    else:
        print(f"ℹ️ Proxy check not implemented for {system}")
        return False

def check_firewall():
    """Basic check for firewall that might be blocking connections"""
    print("\n🔥 Checking for potential firewall issues...")
    
    # Try connecting to common ports
    test_ports = [
        ("www.google.com", 80),
        ("www.google.com", 443),
        ("example.com", 80),
        ("example.com", 443)
    ]
    
    results = []
    
    for host, port in test_ports:
        try:
            start_time = time.time()
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.settimeout(3)
            s.connect((host, port))
            s.close()
            elapsed = time.time() - start_time
            
            results.append((f"{host}:{port}", True, elapsed))
            print(f"✅ Connection to {host}:{port} succeeded - Time: {elapsed:.2f}s")
        except Exception as e:
            results.append((f"{host}:{port}", False, None))
            print(f"❌ Connection to {host}:{port} failed: {e}")
    
    success_count = sum(1 for _, success, _ in results if success)
    if success_count == 0:
        print("❌ All port connections failed")
        print("   This strongly suggests a firewall is blocking outbound connections")
        return True
    elif success_count < len(test_ports):
        print("⚠️ Some port connections failed")
        print("   This could indicate selective port blocking by a firewall")
        return True
    else:
        print("✅ All port connections succeeded")
        print("   No obvious firewall blocking detected")
        return False

def suggest_solutions(dns_issue, http_issue, proxy_active, firewall_active):
    """Suggest solutions based on detected issues"""
    print_header("DIAGNOSIS & SOLUTIONS")
    
    if not dns_issue and not http_issue and not proxy_active and not firewall_active:
        print("✅ No major connectivity issues detected!")
        print("   If you're still experiencing problems with Crawl4AI, try:")
        print("   1. Checking for antivirus software that might be blocking browser automation")
        print("   2. Reinstalling Playwright browsers: python -m playwright install --with-deps chromium")
        print("   3. Updating Crawl4AI: pip install -U crawl4ai")
        return
    
    print("Based on the tests, here are potential solutions:\n")
    
    if dns_issue:
        print("🔧 DNS Resolution Issues:")
        print("   1. Check your network connection")
        print("   2. Try using alternative DNS servers (e.g., 8.8.8.8 or 1.1.1.1)")
        print("   3. Flush your DNS cache:")
        if platform.system() == "Windows":
            print("      - Run Command Prompt as Administrator")
            print("      - Execute: ipconfig /flushdns")
        elif platform.system() == "Darwin":  # macOS
            print("      - Execute: sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder")
        elif platform.system() == "Linux":
            print("      - Execute: sudo systemd-resolve --flush-caches")
        print()
    
    if http_issue:
        print("🔧 HTTP Connectivity Issues:")
        print("   1. Check if your internet connection is working")
        print("   2. Try disabling VPN or proxy services temporarily")
        print("   3. Check if your firewall is blocking web access")
        print("   4. For Crawl4AI specifically, try:")
        print("      - python -m playwright install --with-deps chromium")
        print()
    
    if proxy_active:
        print("🔧 Proxy Configuration:")
        print("   1. Crawl4AI might have issues with system proxies")
        print("   2. Try setting explicit proxy in Crawl4AI:")
        print("      ```python")
        print("      browser_config = BrowserConfig(")
        print("          proxy={")
        print("              'server': 'http://your-proxy-server:port',")
        print("              'username': 'user',  # if needed")
        print("              'password': 'pass'   # if needed")
        print("          }")
        print("      )")
        print("      ```")
        print("   3. Or try disabling system proxy temporarily for testing")
        print()
    
    if firewall_active:
        print("🔧 Firewall Issues:")
        print("   1. Check if your firewall is blocking Playwright/Chromium")
        print("   2. Add exceptions for Python and browser processes")
        print("   3. Temporarily disable firewall for testing (if safe to do so)")
        print("   4. For corporate networks, consult your IT department")
        print()
    
    print("🔧 General Crawl4AI Fixes:")
    print("   1. Try running with explicit offline mode:")
    print("      ```python")
    print("      browser_config = BrowserConfig(offline=False)")
    print("      ```")
    print("   2. Update Playwright: python -m playwright install")
    print("   3. Check for Crawl4AI updates: pip install -U crawl4ai")
    print("   4. Try with different browser: BrowserConfig(browser_name='firefox')")

def main():
    """Main function to run all checks"""
    print_header("CRAWL4AI CONNECTIVITY CHECKER")
    print(f"Date/Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"System: {platform.system()} {platform.release()} ({platform.version()})")
    print(f"Python: {platform.python_version()}")
    
    # Run all checks
    dns_issue = not check_dns()
    http_issue = not check_http_connectivity()
    proxy_active = check_proxy_settings()
    firewall_active = check_firewall()
    
    # Suggest solutions
    suggest_solutions(dns_issue, http_issue, proxy_active, firewall_active)
    
    # Summary
    print_header("SUMMARY")
    issues_found = sum([dns_issue, http_issue, proxy_active, firewall_active])
    
    if issues_found == 0:
        print("✅ No connectivity issues detected")
        print("   If you're still having problems with Crawl4AI, please check:")
        print("   - Crawl4AI version compatibility")
        print("   - Playwright browser installation")
        print("   - System resource limitations")
    else:
        print(f"⚠️ {issues_found} potential issue(s) detected")
        print("   Please review the suggestions above to resolve them")
    
    print("\nTo run Crawl4AI with verbose logging:")
    print("```python")
    print("import logging")
    print("logging.basicConfig(level=logging.DEBUG)")
    print("# Then run your Crawl4AI code")
    print("```")

if __name__ == "__main__":
    main()