@echo off
chcp 65001 > nul
echo =====================================
echo   体重管理アプリ - ローカルサーバー
echo =====================================
echo.
echo サーバーを起動しています...
echo.

:: ブラウザを開く
timeout /t 2 /nobreak > nul
start http://localhost:8000

:: サーバーを起動
echo サーバーが起動しました！
echo.
echo ブラウザで http://localhost:8000 が開きます
echo.
echo [重要] このウィンドウを閉じるとサーバーが停止します
echo サーバーを停止する場合は stop-server.bat を実行してください
echo.
echo =====================================

python -m http.server 8000
