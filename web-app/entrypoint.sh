#!/bin/sh
set -e
sed -i "s|SERVER_URL: \".*\"|SERVER_URL: \"${SERVER_URL}\"|" /usr/share/nginx/html/config.js
exec "$@"