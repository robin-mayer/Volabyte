#!/bin/bash
java -jar /app/server.jar &
nginx -g "daemon off;"