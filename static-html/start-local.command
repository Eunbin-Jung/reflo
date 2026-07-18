#!/bin/bash

set -u
cd "$(dirname "$0")" || exit 1

PORT="${REFLO_PORT:-8080}"
URL="http://127.0.0.1:${PORT}/"

if command -v python3 >/dev/null 2>&1 && python3 -c 'import sys' >/dev/null 2>&1; then
  PYTHON_BIN="python3"
elif command -v python >/dev/null 2>&1 && python -c 'import sys; raise SystemExit(sys.version_info.major != 3)' >/dev/null 2>&1; then
  PYTHON_BIN="python"
elif command -v ruby >/dev/null 2>&1; then
  PYTHON_BIN=""
else
  echo "Python 3 또는 Ruby 실행 환경을 찾지 못했습니다."
  echo "https://www.python.org/downloads/ 에서 Python 3를 설치한 뒤 다시 실행해주세요."
  read -r -p "Enter 키를 누르면 종료합니다."
  exit 1
fi

open_browser() {
  if [ "${REFLO_NO_BROWSER:-0}" = "1" ]; then
    return
  fi
  if command -v open >/dev/null 2>&1; then
    open "$URL"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$URL" >/dev/null 2>&1
  else
    echo "브라우저에서 $URL 을 열어주세요."
  fi
}

if command -v lsof >/dev/null 2>&1 && lsof -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "이미 로컬 서버가 실행 중입니다: $URL"
  open_browser
  exit 0
fi

echo "REFLO 로컬 서버를 시작합니다: $URL"
if [ -n "$PYTHON_BIN" ]; then
  "$PYTHON_BIN" -m http.server "$PORT" --bind 127.0.0.1 &
else
  ruby -run -e httpd . -p "$PORT" -b 127.0.0.1 &
fi
SERVER_PID=$!

cleanup() {
  kill "$SERVER_PID" >/dev/null 2>&1 || true
}
trap cleanup EXIT INT TERM

sleep 1
if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
  echo "서버를 시작하지 못했습니다. 8080 포트를 사용하는 프로그램이 있는지 확인해주세요."
  read -r -p "Enter 키를 누르면 종료합니다."
  exit 1
fi

open_browser
echo "이 창을 닫으면 로컬 서버가 종료됩니다."
wait "$SERVER_PID"
