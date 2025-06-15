"""
Configuration settings for the Enhanced Web Scraper API
"""

import os
from typing import List

class Config:
    """Application configuration"""
    
    # Server settings
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", 8000))
    RELOAD = os.getenv("RELOAD", "true").lower() == "true"
    
    # CORS settings
    CORS_ORIGINS = [
        "http://localhost:3000", "http://localhost:3001", "http://localhost:3002",
        "http://localhost:5173", "http://localhost:5174", "http://localhost:5175",
        "http://127.0.0.1:3000", "http://127.0.0.1:3001", "http://127.0.0.1:3002",
        "http://127.0.0.1:5173", "http://127.0.0.1:5174", "http://127.0.0.1:5175"
    ]
    
    # File download settings
    MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 50 * 1024 * 1024))  # 50MB default
    DOWNLOADS_DIR = os.getenv("DOWNLOADS_DIR", "downloads")
    MAX_CONTENT_PER_PAGE = int(os.getenv("MAX_CONTENT_PER_PAGE", 10))
    
    # Session management
    SESSION_CLEANUP_INTERVAL = int(os.getenv("SESSION_CLEANUP_INTERVAL", 3600))  # 1 hour
    SESSION_MAX_AGE_HOURS = int(os.getenv("SESSION_MAX_AGE_HOURS", 24))  # 24 hours
    ACTIVE_SESSION_TIMEOUT_HOURS = int(os.getenv("ACTIVE_SESSION_TIMEOUT_HOURS", 1))  # 1 hour
    
    # Crawling settings
    DEFAULT_DELAY = float(os.getenv("DEFAULT_DELAY", 1.0))
    DEFAULT_TIMEOUT = int(os.getenv("DEFAULT_TIMEOUT", 30))
    MAX_PAGES_DEFAULT = int(os.getenv("MAX_PAGES_DEFAULT", 1000))
    
    # Security settings
    ALLOWED_URL_SCHEMES = ["http", "https"]
    BLOCKED_EXTENSIONS = [".exe", ".bat", ".sh", ".cmd", ".scr"]
    
    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
    
    @classmethod
    def get_cors_origins(cls) -> List[str]:
        """Get CORS origins from environment or default"""
        env_origins = os.getenv("CORS_ORIGINS")
        if env_origins:
            return [origin.strip() for origin in env_origins.split(",")]
        return cls.CORS_ORIGINS
    
    @classmethod
    def is_url_allowed(cls, url: str) -> bool:
        """Check if URL scheme is allowed"""
        return any(url.startswith(scheme + "://") for scheme in cls.ALLOWED_URL_SCHEMES)
    
    @classmethod
    def is_file_extension_blocked(cls, filename: str) -> bool:
        """Check if file extension is blocked"""
        return any(filename.lower().endswith(ext) for ext in cls.BLOCKED_EXTENSIONS)

# Development configuration
class DevelopmentConfig(Config):
    """Development-specific configuration"""
    DEBUG = True
    RELOAD = True
    LOG_LEVEL = "DEBUG"

# Production configuration  
class ProductionConfig(Config):
    """Production-specific configuration"""
    DEBUG = False
    RELOAD = False
    LOG_LEVEL = "WARNING"
    
    # Stricter limits for production
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB for production
    MAX_CONTENT_PER_PAGE = 5
    SESSION_MAX_AGE_HOURS = 12  # Shorter session lifetime

# Get configuration based on environment
def get_config():
    """Get configuration based on environment"""
    env = os.getenv("ENVIRONMENT", "development").lower()
    
    if env == "production":
        return ProductionConfig()
    else:
        return DevelopmentConfig()

# Global config instance
config = get_config()
