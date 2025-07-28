# Docker 前端服务启动脚本 (PowerShell)
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Docker 前端服务启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查 Docker 是否安装
Write-Host "检查 Docker 服务状态..." -ForegroundColor Yellow

try {
    $dockerVersion = docker --version
    Write-Host "✓ Docker 已安装: $dockerVersion" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Docker 未安装或未添加到 PATH" -ForegroundColor Red
    Write-Host "请确保 Docker Desktop 已安装并正在运行" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

# 检查 Docker 守护进程是否运行
try {
    docker info | Out-Null
    Write-Host "✓ Docker 守护进程正在运行" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] Docker 守护进程未运行" -ForegroundColor Red
    Write-Host "请启动 Docker Desktop" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""
Write-Host "开始构建前端镜像..." -ForegroundColor Yellow

# 构建 Docker 镜像
try {
    docker build -t gin-shop-frontend .
    Write-Host "✓ 镜像构建成功" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] 镜像构建失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""
Write-Host "停止并删除旧容器（如果存在）..." -ForegroundColor Yellow
docker stop gin-shop-frontend-container 2>$null
docker rm gin-shop-frontend-container 2>$null

Write-Host ""
Write-Host "启动新容器..." -ForegroundColor Yellow

# 启动容器
try {
    docker run -d --name gin-shop-frontend-container -p 3000:80 gin-shop-frontend
    Write-Host "✓ 容器启动成功" -ForegroundColor Green
}
catch {
    Write-Host "[ERROR] 容器启动失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  🚀 前端服务启动成功！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 访问地址: http://localhost:3000" -ForegroundColor White
Write-Host "🐳 容器名称: gin-shop-frontend-container" -ForegroundColor White
Write-Host "💡 技术栈: Vue3 + Element Plus + Nginx" -ForegroundColor White
Write-Host ""
Write-Host "常用命令:" -ForegroundColor Yellow
Write-Host "  查看容器状态: docker ps" -ForegroundColor Gray
Write-Host "  查看容器日志: docker logs gin-shop-frontend-container" -ForegroundColor Gray
Write-Host "  停止服务:     docker stop gin-shop-frontend-container" -ForegroundColor Gray
Write-Host "  重启服务:     docker restart gin-shop-frontend-container" -ForegroundColor Gray
Write-Host ""

# 显示容器状态
Write-Host "当前容器状态:" -ForegroundColor Yellow
docker ps --filter "name=gin-shop-frontend-container"

Read-Host "按回车键退出" 