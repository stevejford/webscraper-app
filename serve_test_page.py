"""
Simple HTTP server to serve the WebSocket test page
"""
import http.server
import socketserver
import os
import sys
from datetime import datetime

def log(message):
    """Print a timestamped log message"""
    timestamp = datetime.now().strftime('%H:%M:%S')
    print(f"[{timestamp}] {message}")
    sys.stdout.flush()

# Define the port
PORT = 8080

class TestPageHandler(http.server.SimpleHTTPRequestHandler):
    """Handler for serving the test page"""
    
    def log_message(self, format, *args):
        """Override to use our custom logging"""
        log(f"{self.address_string()} - {format % args}")
    
    def end_headers(self):
        """Add CORS headers"""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

def main():
    """Main function"""
    log(f"Starting HTTP server on port {PORT}")
    log(f"Open http://localhost:{PORT}/websocket_test.html in your browser")
    
    # Create the server
    with socketserver.TCPServer(("", PORT), TestPageHandler) as httpd:
        log("Server started")
        try:
            # Serve until interrupted
            httpd.serve_forever()
        except KeyboardInterrupt:
            log("Server stopped by user")
        finally:
            httpd.server_close()
            log("Server stopped")

if __name__ == "__main__":
    main()
