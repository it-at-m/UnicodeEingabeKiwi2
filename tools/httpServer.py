#!/usr/bin/python3

from http.server import HTTPServer, SimpleHTTPRequestHandler 
import sys

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(CORSRequestHandler, self).end_headers()

CORSRequestHandler.extensions_map['.mjs'] = 'application/javascript'
        
httpd = HTTPServer((sys.argv[1], int(sys.argv[2])), CORSRequestHandler)
print("Listening on port {} at {}. Press Ctrl+C to stop.".format(sys.argv[2],sys.argv[1]))
httpd.serve_forever()
