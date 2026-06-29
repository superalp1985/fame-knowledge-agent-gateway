$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new($false)
$OutputEncoding = [Console]::OutputEncoding

$ProjectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $ProjectRoot

if (-not (Test-Path -LiteralPath "logs")) {
  New-Item -ItemType Directory -Path "logs" | Out-Null
}

$env:FAME_GATEWAY_HOST = if ($env:FAME_GATEWAY_HOST) { $env:FAME_GATEWAY_HOST } else { "127.0.0.1" }
$env:FAME_GATEWAY_PORT = if ($env:FAME_GATEWAY_PORT) { $env:FAME_GATEWAY_PORT } else { "5191" }
$env:FAME_WORKBENCH_PORT = if ($env:FAME_WORKBENCH_PORT) { $env:FAME_WORKBENCH_PORT } else { "5178" }

Write-Host "FAME Knowledge Agent Gateway"
Write-Host "Project: $ProjectRoot"
Write-Host "Workbench: http://$($env:FAME_GATEWAY_HOST):$($env:FAME_WORKBENCH_PORT)"
Write-Host "Gateway:   http://$($env:FAME_GATEWAY_HOST):$($env:FAME_GATEWAY_PORT)/health"
Write-Host ""

node scripts/start-all.mjs
