from pathlib import Path
import hashlib,base64,re
r=Path(__file__).resolve().parents[1]
hashes=set()
for path in [r/'index.html',r/'en/index.html',r/'zh-hant/index.html',r/'zh-hans/index.html']:
 for s in re.findall(r'<script type="application/ld\+json">(.*?)</script>',path.read_text(),re.S):hashes.add("'sha256-"+base64.b64encode(hashlib.sha256(s.encode()).digest()).decode()+"'")
csp="default-src 'self'; script-src 'self' https://www.googletagmanager.com https://www.google-analytics.com/analytics.js "+' '.join(sorted(hashes))+"; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com; connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'none'; frame-src 'none'; upgrade-insecure-requests"
config='''# Only the Wayne Club static site; does not modify other proxy hosts.
limit_req_zone $binary_remote_addr zone=wayne_requests:10m rate=10r/s;
limit_conn_zone $binary_remote_addr zone=wayne_connections:10m;
server {
    listen 80;
    listen [::]:80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;
    server_tokens off;
    autoindex off;
    # Nginx Proxy Manager overwrites X-Real-IP before proxying.
    set_real_ip_from 172.18.0.0/16;
    real_ip_header X-Real-IP;
    real_ip_recursive off;
    client_max_body_size 16k;
    client_body_timeout 10s;
    client_header_timeout 10s;
    send_timeout 15s;
    limit_req zone=wayne_requests burst=80 nodelay;
    limit_req_status 429;
    limit_conn wayne_connections 30;
    limit_conn_status 429;
    if ($request_method !~ ^(GET|HEAD)$) { return 405; }
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=(), usb=()" always;
    add_header Content-Security-Policy "CSP_VALUE" always;
    add_header Cache-Control "no-cache" always;
    location ~ /\\. { return 404; }
    location ~* \\.(php|asp|aspx|cgi|env|sql|bak|ini|log)$ { return 404; }
    location / { try_files $uri $uri/ =404; }
}
'''.replace('CSP_VALUE',csp)
(r/'deploy/nginx.conf').write_text(config);print('Generated security config with',len(hashes),'JSON-LD script hashes')
