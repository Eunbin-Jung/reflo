@echo off
setlocal
cd /d "%~dp0"

if not defined REFLO_PORT set "REFLO_PORT=8080"
set "PORT=%REFLO_PORT%"
set "URL=http://127.0.0.1:%PORT%/"
set "PYTHON_CMD="

py -3 -c "import sys" >nul 2>nul
if not errorlevel 1 (
  set "PYTHON_CMD=py -3"
  goto runtime_ready
)

python -c "import sys; raise SystemExit(sys.version_info.major != 3)" >nul 2>nul
if not errorlevel 1 (
  set "PYTHON_CMD=python"
)

:runtime_ready
netstat -ano | findstr /R /C:":%PORT% .*LISTENING" >nul
if not errorlevel 1 (
  echo 이미 로컬 서버가 실행 중입니다: %URL%
  if /I not "%REFLO_NO_BROWSER%"=="1" start "" "%URL%"
  exit /b 0
)

echo REFLO 로컬 서버를 시작합니다: %URL%
if /I not "%REFLO_NO_BROWSER%"=="1" start "" "%URL%"

if defined PYTHON_CMD goto run_python
goto run_powershell

:run_python
%PYTHON_CMD% -m http.server %PORT% --bind 127.0.0.1
goto server_finished

:run_powershell
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0serve-local.ps1" -Port %PORT%

:server_finished
if errorlevel 1 (
  echo 서버를 시작하지 못했습니다. %PORT% 포트를 사용하는 프로그램이 있는지 확인해주세요.
  pause
  exit /b 1
)

endlocal
