@echo off
title DND Battle Map
cd /d "%~dp0"

if not exist node_modules (
    echo [启动项目] 未检测到依赖，正在执行 npm install，首次安装需要几分钟...
    call npm install
    if errorlevel 1 (
        echo [启动项目] 依赖安装失败，请检查网络后重试。
        pause
        exit /b 1
    )
)

echo [启动项目] 正在启动 shared / server / web 三个服务...
echo [启动项目] 浏览器稍后会自动打开 http://localhost:5173
echo [启动项目] 使用结束后直接关闭本窗口即可停止全部服务。
start "" /min cmd /c "timeout /t 8 /nobreak >nul & start http://localhost:5173"
call npm run dev
echo.
echo [启动项目] 服务已停止。
pause
