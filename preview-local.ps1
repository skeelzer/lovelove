$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$indexPath = Join-Path $projectRoot "index.html"
$port = 5500

$isListening = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue
$pyLauncher = Get-Command py -ErrorAction SilentlyContinue
$python = Get-Command python -ErrorAction SilentlyContinue

if (-not $isListening -and $pyLauncher) {
  Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -LiteralPath '$projectRoot'; py -m http.server $port" | Out-Null
  Start-Sleep -Seconds 1
}

if (-not $isListening -and -not $pyLauncher -and $python) {
  Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location -LiteralPath '$projectRoot'; python -m http.server $port" | Out-Null
  Start-Sleep -Seconds 1
}

if ($pyLauncher -or $python) {
  Write-Host "Ouverture de http://localhost:$port"
  Start-Process "http://localhost:$port"
  exit 0
}

Write-Host "Python non detecte. Ouverture directe du fichier local index.html"
Start-Process $indexPath
