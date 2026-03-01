@echo off
chcp 65001 > nul
echo =====================================
echo   体重管理アプリ - サーバー停止
echo =====================================
echo.
echo サーバーを停止しています...

:: Pythonのhttp.serverプロセスを終了
taskkill /F /IM python.exe /FI "WINDOWTITLE eq *http.server*" 2>nul

:: ポート8000を使用しているプロセスを終了
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a 2>nul
)

echo.
echo サーバーを停止しました
echo.
echo このウィンドウは3秒後に自動的に閉じます
timeout /t 3 /nobreak > nul
