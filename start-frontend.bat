@echo off
chcp 65001 >nul 2>&1
echo ========================================
echo   Starting Vue3 Frontend Development Server
echo ========================================

echo.
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed
    echo Please install Node.js 18+ version
    pause
    exit /b 1
)

echo.
echo Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed
    pause
    exit /b 1
)

echo.
echo Current directory: %cd%
echo Checking dependencies...

if not exist "node_modules" (
    echo Dependencies not installed, installing...
    echo Using Taobao registry for faster download...
    npm install --registry=https://registry.npmmirror.com
    
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo Dependencies exist, skipping installation
)

echo.
echo ========================================
echo   🚀 Starting Frontend Development Server
echo ========================================
echo.
echo 📱 Access URL: http://localhost:3000
echo 🔧 Tech Stack: Vue3 + Vuex + Element Plus + Vite
echo 🎨 UI Framework: Element Plus
echo 📡 Backend API: Backend service should run on localhost:8080
echo.
echo 💡 Tips: 
echo    - Make sure backend service is running (gin-backend)
echo    - Press Ctrl+C to stop development server
echo    - Code changes will auto-reload
echo.

echo Starting development server...
npm run dev 