@echo off
set "PROJECT_DIR=%~dp0"
set "PORT=5500"
set "URL=http://localhost:%PORT%/?preview=all"

where py >nul 2>&1
if %errorlevel%==0 (
  start "Serveur perso" powershell -NoExit -Command "Set-Location -LiteralPath '%PROJECT_DIR%'; py -m http.server %PORT%"
  timeout /t 1 >nul
  start "" "%URL%"
  goto :eof
)

where python >nul 2>&1
if %errorlevel%==0 (
  start "Serveur perso" powershell -NoExit -Command "Set-Location -LiteralPath '%PROJECT_DIR%'; python -m http.server %PORT%"
  timeout /t 1 >nul
  start "" "%URL%"
  goto :eof
)

echo Python non detecte. Ouverture directe du fichier local avec preview.
start "" "%PROJECT_DIR%index.html#preview"
