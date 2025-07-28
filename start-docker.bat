@echo off
chcp 65001 >nul 2>&1
echo ========================================
echo   Docker 前端服务启动脚本
echo ========================================

echo.
echo 检查 Docker 服务状态...

REM 检查 Docker 是否安装
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker 未安装或未添加到 PATH
    echo 请确保 Docker Desktop 已安装并正在运行
    pause
    exit /b 1
)

echo ✓ Docker 已安装

REM 检查 Docker 守护进程是否运行
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Docker 守护进程未运行
    echo 请启动 Docker Desktop
    pause
    exit /b 1
)

echo ✓ Docker 守护进程正在运行

echo.
echo 开始构建前端镜像...
docker build -t gin-shop-frontend .

if %errorlevel% neq 0 (
    echo [ERROR] 镜像构建失败
    pause
    exit /b 1
)

echo ✓ 镜像构建成功

echo.
echo 停止并删除旧容器（如果存在）...
docker stop gin-shop-frontend-container >nul 2>&1
docker rm gin-shop-frontend-container >nul 2>&1

echo.
echo 启动新容器...
docker run -d ^
  --name gin-shop-frontend-container ^
  -p 3000:80 ^
  gin-shop-frontend

if %errorlevel% neq 0 (
    echo [ERROR] 容器启动失败
    pause
    exit /b 1
)

echo.
echo ========================================
echo   🚀 前端服务启动成功！
echo ========================================
echo.
echo 📱 访问地址: http://localhost:3000
echo 🐳 容器名称: gin-shop-frontend-container
echo 💡 技术栈: Vue3 + Element Plus + Nginx
echo.
echo 常用命令:
echo   查看容器状态: docker ps
echo   查看容器日志: docker logs gin-shop-frontend-container
echo   停止服务:     docker stop gin-shop-frontend-container
echo   重启服务:     docker restart gin-shop-frontend-container
echo.

pause 