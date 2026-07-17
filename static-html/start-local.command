#!/bin/bash
cd "$(dirname "$0")" || exit 1
python3 -m http.server 8080 &
server_pid=$!
sleep 1
open "http://localhost:8080"
wait "$server_pid"
