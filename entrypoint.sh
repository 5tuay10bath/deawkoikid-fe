#!/bin/sh
# Replace placeholder with runtime env
sed -i "s|REPLACE_API_URL|${DEAWKOIKID_API_BASE_URL}|g" /usr/share/nginx/html/env.js

# Start Nginx
exec "$@"
