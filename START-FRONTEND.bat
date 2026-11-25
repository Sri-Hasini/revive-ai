@echo off
cd /d "%~dp0frontend"
if not exist node_modules (
  echo Installing frontend packages...
  call npm install || goto fail
)
call npm run dev
:fail
pause
