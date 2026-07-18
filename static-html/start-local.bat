@echo off
setlocal
cd /d "%~dp0"

set "PORT=8080"
set "URL=http://127.0.0.1:%PORT%/"

where py >nul 2>nul
if not errorlevel 1 (
  set "PYTHON_CMD=py -3"
  goto python_found
)

where python >nul 2>nul
if not errorlevel 1 (
  set "PYTHON_CMD=python"
  goto python_found
)

echo Python 3가 설치되어 있지 않습니다.
echo https://www.python.org/downloads/ 에서 Python 3를 설치한 뒤 다시 실행해주세요.
pause
exit /b 1

:python_found

netstat -ano | findstr /R /C:":%PORT% .*LISTENING" >nul
if not errorlevel 1 (
  echo 이미 로컬 서버가 실행 중입니다: %URL%
  start "" "%URL%"
  exit /b 0
)

echo REFLO 로컬 서버를 시작합니다: %URL%
start "" "%URL%"
%PYTHON_CMD% -m http.server %PORT% --bind 127.0.0.1

if not %errorlevel%==0 (
  echo 서버를 시작하지 못했습니다. 8080 포트를 사용하는 프로그램이 있는지 확인해주세요.
  pause
  exit /b 1
)

endlocal
