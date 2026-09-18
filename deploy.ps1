param(
  [string]$ProjectName = "pocketlink",
  [string]$Branch = "main",
  [string]$WorkerName = "pocketlink-proxy",
  [string]$AllowedHosts = ""
)

$ErrorActionPreference = "Stop"

Write-Host "PocketLink 部署开始" -ForegroundColor Cyan
Write-Host "1. 部署静态 PWA 到 Cloudflare Pages"
npx --yes wrangler pages deploy . --project-name $ProjectName --branch $Branch

Write-Host "2. 部署 CORS Worker"
if ($AllowedHosts) {
  Write-Host "提示：ALLOWED_HOSTS 建议在 Cloudflare Dashboard 的 Worker 环境变量中配置。" -ForegroundColor Yellow
}
npx --yes wrangler deploy cloudflare-worker.js --name $WorkerName

Write-Host "3. 健康检查地址"
Write-Host "Pages:  https://$ProjectName.pages.dev"
Write-Host "Worker: https://$WorkerName.<account>.workers.dev/health"
Write-Host "部署完成。" -ForegroundColor Green
