import http.server
import ssl
import sys
import os

if len(sys.argv) < 2:
    print("Usage: python https_server.py <path-to-website-directory>")
    sys.exit(1)

web_dir = sys.argv[1]

if not os.path.exists(web_dir):
    print(f"The path {web_dir} does not exist!")
    sys.exit(1)

os.chdir(web_dir)

handler = http.server.SimpleHTTPRequestHandler
httpd = http.server.HTTPServer(('localhost', 4443), handler)

httpd.socket = ssl.wrap_socket(httpd.socket,
                               server_side=True,
                               certfile='/home/tariq/work/azh/projects/tohee/web-gui/nano-frontend/ssl-key/cert.pem',  # Path to your certificate file
                               keyfile='/home/tariq/work/azh/projects/tohee/web-gui/nano-frontend/ssl-key/key.pem',    # Path to your key file
                               ssl_version=ssl.PROTOCOL_TLS)

print(f"Serving HTTPS on port 4443 from directory {web_dir}")
httpd.serve_forever()
