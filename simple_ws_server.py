"""
Simple WebSocket Server Implementation
"""
import asyncio
import base64
import hashlib
import json
import socket
import struct
import threading
import time
import uuid
from datetime import datetime

# WebSocket constants
GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
HANDSHAKE_TEMPLATE = (
    "HTTP/1.1 101 Switching Protocols\r\n"
    "Upgrade: websocket\r\n"
    "Connection: Upgrade\r\n"
    "Sec-WebSocket-Accept: {}\r\n"
    "Access-Control-Allow-Origin: *\r\n"
    "\r\n"
)

def log(message):
    """Print a timestamped log message"""
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {message}")

def parse_headers(data):
    """Parse HTTP headers from data"""
    headers = {}
    lines = data.decode('utf-8').split('\r\n')
    
    # Skip the first line (HTTP request line)
    for line in lines[1:]:
        if not line:
            break
        key, value = line.split(': ', 1)
        headers[key.lower()] = value
    
    return headers

def create_accept_value(key):
    """Create the Sec-WebSocket-Accept value"""
    sha1 = hashlib.sha1((key + GUID).encode('utf-8')).digest()
    return base64.b64encode(sha1).decode('utf-8')

def decode_websocket_frame(data):
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
    
    return {
        'fin': fin,
        'opcode': opcode,
        'mask': mask,
        'payload_len': payload_len,
        'payload': payload
    }

def encode_websocket_frame(payload, opcode=0x01):
    """Encode a WebSocket frame"""
    # First byte: FIN bit and opcode
    first_byte = 0x80 | opcode  # FIN bit set, text frame
    
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

def handle_client(client_socket, addr):
    """Handle a client connection"""
    try:
        # Receive the HTTP upgrade request
        data = client_socket.recv(1024)
        if not data:
            log(f"Empty request from {addr}")
            return
        
        # Parse headers
        headers = parse_headers(data)
        if 'sec-websocket-key' not in headers:
            log(f"Not a WebSocket handshake request from {addr}")
            return
        
        # Extract the session ID from the path
        request_line = data.decode('utf-8').split('\r\n')[0]
        path = request_line.split(' ')[1]
        session_id = path.split('/')[-1]
        
        # Create the accept value
        accept = create_accept_value(headers['sec-websocket-key'])
        
        # Send the handshake response
        handshake = HANDSHAKE_TEMPLATE.format(accept)
        client_socket.send(handshake.encode('utf-8'))
        
        log(f"WebSocket connection established with {addr} for session {session_id}")
        
        # Send connection established message
        connection_msg = {
            "type": "connection_established",
            "session_id": session_id,
            "message": "WebSocket connection established"
        }
        client_socket.send(encode_websocket_frame(json.dumps(connection_msg).encode('utf-8')))
        
        # Process WebSocket frames
        while True:
            frame_data = client_socket.recv(1024)
            if not frame_data:
                log(f"Connection closed by client {addr}")
                break
            
            frame = decode_websocket_frame(frame_data)
            if not frame:
                continue
            
            # Handle different opcodes
            if frame['opcode'] == 0x01:  # Text frame
                try:
                    message = frame['payload'].decode('utf-8')
                    log(f"Received message from {addr}: {message[:50]}...")
                    
                    # Parse JSON
                    data = json.loads(message)
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
                    client_socket.send(encode_websocket_frame(json.dumps(status_update).encode('utf-8')))
                    log(f"Sent status update to {addr}")
                    
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
                    client_socket.send(encode_websocket_frame(json.dumps(status_update2).encode('utf-8')))
                    log(f"Sent second status update to {addr}")
                    
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
                    client_socket.send(encode_websocket_frame(json.dumps(complete_msg).encode('utf-8')))
                    log(f"Sent completion message to {addr}")
                    
                except json.JSONDecodeError:
                    log(f"Invalid JSON from {addr}")
                    error_msg = {
                        "type": "error",
                        "message": "Invalid JSON format"
                    }
                    client_socket.send(encode_websocket_frame(json.dumps(error_msg).encode('utf-8')))
                except Exception as e:
                    log(f"Error processing message from {addr}: {e}")
                    error_msg = {
                        "type": "error",
                        "message": str(e)
                    }
                    client_socket.send(encode_websocket_frame(json.dumps(error_msg).encode('utf-8')))
            
            elif frame['opcode'] == 0x08:  # Close frame
                log(f"Received close frame from {addr}")
                # Send close frame back
                client_socket.send(encode_websocket_frame(b'', opcode=0x08))
                break
            
            elif frame['opcode'] == 0x09:  # Ping frame
                # Send pong frame
                client_socket.send(encode_websocket_frame(frame['payload'], opcode=0x0A))
            
            elif frame['opcode'] == 0x0A:  # Pong frame
                pass  # Ignore pong frames
    
    except Exception as e:
        log(f"Error handling client {addr}: {e}")
    
    finally:
        client_socket.close()
        log(f"Connection closed with {addr}")

def main():
    """Main function"""
    # Create socket
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    
    # Bind to port 8000
    host = '0.0.0.0'
    port = 8000
    server_socket.bind((host, port))
    
    # Listen for connections
    server_socket.listen(5)
    log(f"WebSocket server running on {host}:{port}")
    log("Press Ctrl+C to stop the server")
    
    try:
        while True:
            # Accept connection
            client_socket, addr = server_socket.accept()
            log(f"New connection from {addr[0]}:{addr[1]}")
            
            # Handle client in a new thread
            client_thread = threading.Thread(target=handle_client, args=(client_socket, addr))
            client_thread.daemon = True
            client_thread.start()
    
    except KeyboardInterrupt:
        log("Server stopped by user")
    except Exception as e:
        log(f"Server error: {e}")
    finally:
        server_socket.close()

if __name__ == "__main__":
    main()
