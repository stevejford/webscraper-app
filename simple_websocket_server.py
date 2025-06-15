"""
Simple WebSocket Server using only standard library
"""
import asyncio
import json
import http.server
import socketserver
import threading
import time
import uuid
import sys
from datetime import datetime

# Simple HTTP server to serve a diagnostic page
class DiagnosticHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            
            html = """
            <!DOCTYPE html>
            <html>
            <head>
                <title>WebSocket Diagnostics</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                    .log { background: #f4f4f4; padding: 10px; border-radius: 4px; height: 300px; overflow-y: auto; }
                    .success { color: green; }
                    .error { color: red; }
                    .warning { color: orange; }
                    button { padding: 10px; margin: 10px 0; }
                </style>
            </head>
            <body>
                <h1>WebSocket Diagnostics</h1>
                <p>This page tests the WebSocket connection to the backend server.</p>
                
                <button id="testBtn">Test WebSocket Connection</button>
                <button id="clearBtn">Clear Log</button>
                
                <h2>Connection Log:</h2>
                <div id="log" class="log"></div>
                
                <script>
                    const logEl = document.getElementById('log');
                    const testBtn = document.getElementById('testBtn');
                    const clearBtn = document.getElementById('clearBtn');
                    
                    function log(message, type = 'info') {
                        const entry = document.createElement('div');
                        entry.className = type;
                        entry.textContent = `${new Date().toLocaleTimeString()}: ${message}`;
                        logEl.appendChild(entry);
                        logEl.scrollTop = logEl.scrollHeight;
                    }
                    
                    clearBtn.addEventListener('click', () => {
                        logEl.innerHTML = '';
                    });
                    
                    testBtn.addEventListener('click', () => {
                        const sessionId = crypto.randomUUID();
                        log(`Starting WebSocket test with session ID: ${sessionId}`);
                        
                        // Create WebSocket connection
                        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
                        const host = window.location.hostname || 'localhost';
                        const wsUrl = `${protocol}//${host}:8000/ws/scrape/${sessionId}`;
                        
                        log(`Connecting to: ${wsUrl}`);
                        const ws = new WebSocket(wsUrl);
                        
                        // Connection opened
                        ws.addEventListener('open', (event) => {
                            log('Connection established!', 'success');
                            
                            // Send test request
                            const testRequest = {
                                url: 'https://example.com',
                                max_pages: 1,
                                delay: 0.5
                            };
                            
                            log(`Sending test request: ${JSON.stringify(testRequest)}`);
                            ws.send(JSON.stringify(testRequest));
                        });
                        
                        // Listen for messages
                        ws.addEventListener('message', (event) => {
                            try {
                                const data = JSON.parse(event.data);
                                log(`Received message: ${data.type}`, 'success');
                                
                                if (data.type === 'status_update') {
                                    log(`Status: ${data.data.status}, Progress: ${data.data.progress}%`);
                                } else if (data.type === 'scrape_complete') {
                                    log('Scraping completed successfully!', 'success');
                                } else if (data.type === 'error') {
                                    log(`Error: ${data.message}`, 'error');
                                } else if (data.type === 'connection_established') {
                                    log('Server confirmed connection!', 'success');
                                }
                            } catch (e) {
                                log(`Error parsing message: ${e}`, 'error');
                            }
                        });
                        
                        // Connection closed
                        ws.addEventListener('close', (event) => {
                            log(`Connection closed: Code=${event.code}, Reason=${event.reason || 'No reason provided'}`, 
                                event.code === 1000 ? 'info' : 'warning');
                        });
                        
                        // Connection error
                        ws.addEventListener('error', (event) => {
                            log('WebSocket error occurred', 'error');
                            console.error('WebSocket error:', event);
                        });
                    });
                </script>
            </body>
            </html>
            """
            
            self.wfile.write(html.encode())
            return
        
        return super().do_GET()

def run_http_server():
    """Run a simple HTTP server for diagnostics"""
    print("Starting HTTP diagnostic server on port 8080...")
    
    try:
        with socketserver.TCPServer(("", 8080), DiagnosticHandler) as httpd:
            print("HTTP server running at http://localhost:8080/")
            httpd.serve_forever()
    except Exception as e:
        print(f"HTTP server error: {e}")

def main():
    """Main function"""
    print("=" * 50)
    print("WebSocket Connection Diagnostic Tool")
    print("=" * 50)
    print()
    print("This tool provides a simple diagnostic page to test WebSocket connections.")
    print()
    
    # Start HTTP server in a separate thread
    http_thread = threading.Thread(target=run_http_server, daemon=True)
    http_thread.start()
    
    print("=" * 50)
    print("Instructions:")
    print("=" * 50)
    print("1. Open http://localhost:8080/ in your browser")
    print("2. Click the 'Test WebSocket Connection' button")
    print("3. Check the connection log for results")
    print()
    print("Press Ctrl+C to stop the server")
    print("=" * 50)
    
    # Keep the main thread alive
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nServer stopped by user")
        sys.exit(0)

if __name__ == "__main__":
    main()
