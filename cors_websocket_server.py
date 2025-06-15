"""
WebSocket Server with CORS support for browser clients
"""
import asyncio
import json
import socket
import base64
import hashlib
import struct
import threading
import time
import uuid
from datetime import datetime
import re
import sys

# WebSocket constants
GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"

def log(message):
    """Print a timestamped log message"""
    timestamp = datetime.now().strftime('%H:%M:%S')
    print(f"[{timestamp}] {message}")
    sys.stdout.flush()  # Ensure output is displayed immediately

class WebSocketServer:
    def __init__(self, host='0.0.0.0', port=8000):
        self.host = host
        self.port = port
        self.socket = None
        self.clients = {}
        self.running = False
    
    def start(self):
        """Start the WebSocket server"""
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        self.socket.bind((self.host, self.port))
        self.socket.listen(5)
        self.running = True
        
        log(f"WebSocket server running on {self.host}:{self.port}")
        log("Press Ctrl+C to stop the server")
        
        try:
            while self.running:
                try:
                    client_socket, addr = self.socket.accept()
                    client_thread = threading.Thread(
                        target=self.handle_client,
                        args=(client_socket, addr)
                    )
                    client_thread.daemon = True
                    client_thread.start()
                except Exception as e:
                    log(f"Error accepting connection: {e}")
        except KeyboardInterrupt:
            log("Server stopped by user")
        finally:
            self.stop()
    
    def stop(self):
        """Stop the WebSocket server"""
        self.running = False
        if self.socket:
            self.socket.close()
        log("Server stopped")
    
    def handle_client(self, client_socket, addr):
        """Handle a client connection"""
        log(f"New connection from {addr[0]}:{addr[1]}")
        
        try:
            # Receive HTTP upgrade request
            data = client_socket.recv(4096)
            if not data:
                log(f"Empty request from {addr}")
                client_socket.close()
                return
            
            # Check if this is a WebSocket upgrade request
            request_text = data.decode('utf-8', errors='ignore')
            
            # Extract headers
            headers = {}
            for line in request_text.split('\r\n')[1:]:
                if not line or line.isspace():
                    break
                if ': ' in line:
                    key, value = line.split(': ', 1)
                    headers[key.lower()] = value
            
            # Check for WebSocket upgrade
            if 'upgrade' not in headers or headers['upgrade'].lower() != 'websocket':
                log(f"Not a WebSocket upgrade request from {addr}")
                client_socket.close()
                return
            
            # Extract WebSocket key
            if 'sec-websocket-key' not in headers:
                log(f"No Sec-WebSocket-Key in request from {addr}")
                client_socket.close()
                return
            
            # Get session ID from URL
            match = re.search(r'GET /ws/scrape/([^/\s]+)', request_text)
            if not match:
                log(f"Invalid WebSocket URL path from {addr}")
                client_socket.close()
                return
            
            session_id = match.group(1)
            log(f"Session ID: {session_id}")
            
            # Create accept key
            ws_key = headers['sec-websocket-key']
            ws_accept = base64.b64encode(
                hashlib.sha1((ws_key + GUID).encode('utf-8')).digest()
            ).decode('utf-8')
            
            # Send WebSocket handshake response with CORS headers
            origin = headers.get('origin', '*')
            handshake = (
                "HTTP/1.1 101 Switching Protocols\r\n"
                "Upgrade: websocket\r\n"
                "Connection: Upgrade\r\n"
                f"Sec-WebSocket-Accept: {ws_accept}\r\n"
                f"Access-Control-Allow-Origin: {origin}\r\n"
                "Access-Control-Allow-Credentials: true\r\n"
                "Access-Control-Allow-Headers: *\r\n"
                "\r\n"
            )
            
            client_socket.send(handshake.encode('utf-8'))
            log(f"WebSocket handshake completed with {addr}")
            
            # Store client
            self.clients[session_id] = client_socket
            
            # Send connection established message
            connection_msg = {
                "type": "connection_established",
                "session_id": session_id,
                "message": "WebSocket connection established"
            }
            self.send_message(client_socket, json.dumps(connection_msg))
            log(f"Sent connection confirmation to {session_id}")
            
            # Process WebSocket frames
            while True:
                try:
                    frame_data = client_socket.recv(4096)
                    if not frame_data:
                        log(f"Connection closed by client {addr}")
                        break
                    
                    # Process the WebSocket frame
                    message = self.decode_frame(frame_data)
                    if message is None:
                        continue
                    
                    if message['opcode'] == 0x1:  # Text frame
                        self.handle_text_message(client_socket, session_id, message['payload'])
                    elif message['opcode'] == 0x8:  # Close frame
                        log(f"Received close frame from {addr}")
                        # Send close frame back
                        self.send_close(client_socket)
                        break
                    elif message['opcode'] == 0x9:  # Ping
                        # Send pong
                        self.send_pong(client_socket, message['payload'])
                    
                except ConnectionResetError:
                    log(f"Connection reset by {addr}")
                    break
                except Exception as e:
                    log(f"Error processing frame from {addr}: {e}")
                    break
        
        except Exception as e:
            log(f"Error handling client {addr}: {e}")
        
        finally:
            # Clean up
            if session_id in self.clients:
                del self.clients[session_id]
            try:
                client_socket.close()
            except:
                pass
            log(f"Connection closed with {addr}")
    
    def handle_text_message(self, client_socket, session_id, message_text):
        """Handle a text message from a client"""
        try:
            log(f"Received message from {session_id}: {message_text[:50]}...")
            
            # Parse JSON
            data = json.loads(message_text)
            url = data.get('url', 'https://example.com')
            
            # Send status update
            status_update = {
                "type": "status_update",
                "data": {
                    "session_id": session_id,
                    "status": "running",
                    "current_url": url,
                    "pages_scraped": 1,
                    "urls_found": 5,
                    "external_urls_found": 2,
                    "content_downloaded": 0,
                    "progress": 20.0,
                    "started_at": datetime.now().isoformat(),
                    "estimated_total_pages": 5
                }
            }
            self.send_message(client_socket, json.dumps(status_update))
            log(f"Sent status update to {session_id}")
            
            # Wait a bit
            time.sleep(2)
            
            # Send another status update
            status_update2 = {
                "type": "status_update",
                "data": {
                    "session_id": session_id,
                    "status": "running",
                    "current_url": url,
                    "pages_scraped": 3,
                    "urls_found": 12,
                    "external_urls_found": 5,
                    "content_downloaded": 2,
                    "progress": 60.0,
                    "started_at": datetime.now().isoformat(),
                    "estimated_total_pages": 5
                }
            }
            self.send_message(client_socket, json.dumps(status_update2))
            log(f"Sent second status update to {session_id}")
            
            # Wait a bit more
            time.sleep(2)
            
            # Send completion message
            complete_msg = {
                "type": "scrape_complete",
                "data": {
                    "session_id": session_id,
                    "domain": url.split('/')[2] if '/' in url else url,
                    "urls": [url, f"{url}/page1", f"{url}/page2"],
                    "external_urls": [f"https://external1.com", f"https://external2.com"],
                    "scraped_content": [],
                    "status": {
                        "session_id": session_id,
                        "status": "completed",
                        "pages_scraped": 5,
                        "urls_found": 15,
                        "external_urls_found": 7,
                        "content_downloaded": 3,
                        "progress": 100.0,
                        "started_at": datetime.now().isoformat(),
                        "ended_at": datetime.now().isoformat()
                    }
                }
            }
            self.send_message(client_socket, json.dumps(complete_msg))
            log(f"Sent completion message to {session_id}")
            
        except json.JSONDecodeError:
            log(f"Invalid JSON from {session_id}")
            error_msg = {
                "type": "error",
                "message": "Invalid JSON format"
            }
            self.send_message(client_socket, json.dumps(error_msg))
        except Exception as e:
            log(f"Error processing message from {session_id}: {e}")
            error_msg = {
                "type": "error",
                "message": str(e)
            }
            self.send_message(client_socket, json.dumps(error_msg))
    
    def decode_frame(self, data):
        """Decode a WebSocket frame"""
        if len(data) < 2:
            return None
        
        # First byte: FIN bit and opcode
        first_byte = data[0]
        fin = (first_byte & 0x80) != 0
        opcode = first_byte & 0x0F
        
        # Second byte: MASK bit and payload length
        second_byte = data[1]
        mask = (second_byte & 0x80) != 0
        payload_len = second_byte & 0x7F
        
        # Extended payload length
        offset = 2
        if payload_len == 126:
            payload_len = struct.unpack(">H", data[offset:offset+2])[0]
            offset += 2
        elif payload_len == 127:
            payload_len = struct.unpack(">Q", data[offset:offset+8])[0]
            offset += 8
        
        # Masking key
        if mask:
            masking_key = data[offset:offset+4]
            offset += 4
        else:
            masking_key = None
        
        # Payload
        payload = data[offset:offset+payload_len]
        
        # Unmask payload if masked
        if mask and masking_key:
            unmasked = bytearray(payload_len)
            for i in range(payload_len):
                unmasked[i] = payload[i] ^ masking_key[i % 4]
            payload = bytes(unmasked)
        
        # For text frames, decode the payload
        if opcode == 0x1:  # Text frame
            try:
                payload = payload.decode('utf-8')
            except UnicodeDecodeError:
                log(f"Error decoding text frame: {payload}")
                return None
        
        return {
            'fin': fin,
            'opcode': opcode,
            'mask': mask,
            'payload_len': payload_len,
            'payload': payload
        }
    
    def send_message(self, client_socket, message):
        """Send a text message to a client"""
        try:
            frame = self.create_text_frame(message)
            client_socket.send(frame)
        except Exception as e:
            log(f"Error sending message: {e}")
    
    def send_close(self, client_socket, code=1000, reason=""):
        """Send a close frame to a client"""
        try:
            payload = struct.pack('!H', code)
            if reason:
                payload += reason.encode('utf-8')
            
            frame = self.create_frame(payload, 0x8)
            client_socket.send(frame)
        except Exception as e:
            log(f"Error sending close frame: {e}")
    
    def send_pong(self, client_socket, payload):
        """Send a pong frame to a client"""
        try:
            frame = self.create_frame(payload, 0xA)
            client_socket.send(frame)
        except Exception as e:
            log(f"Error sending pong frame: {e}")
    
    def create_text_frame(self, message):
        """Create a text frame"""
        return self.create_frame(message.encode('utf-8'), 0x1)
    
    def create_frame(self, payload, opcode):
        """Create a WebSocket frame"""
        # First byte: FIN bit and opcode
        first_byte = 0x80 | opcode  # FIN bit set
        
        # Payload length
        payload_len = len(payload)
        if payload_len < 126:
            header = struct.pack('!BB', first_byte, payload_len)
        elif payload_len < 65536:
            header = struct.pack('!BBH', first_byte, 126, payload_len)
        else:
            header = struct.pack('!BBQ', first_byte, 127, payload_len)
        
        # No masking for server-to-client
        return header + payload

def main():
    """Main function"""
    server = WebSocketServer()
    server.start()

if __name__ == "__main__":
    main()
