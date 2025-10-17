#!/bin/sh
set -e
sed -i "s|REPLACE_API_URL|${DEAWKOIKID_API_BASE_URL:-http://localhost:8080}|g" /app/site/config.js
exec serve -s site -l tcp://0.0.0.0:3000
