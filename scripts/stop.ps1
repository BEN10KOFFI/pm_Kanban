$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

docker compose down --remove-orphans

Write-Host "PM app stopped"
