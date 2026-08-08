@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"

echo ============================================
echo  CARS D OCR - Supabase 연결 도구
echo ============================================
echo.
set /p ZIPPATH=복원 OCR ZIP 전체 경로를 붙여넣으세요: 
if not exist "%ZIPPATH%" (
  echo ZIP 파일을 찾을 수 없습니다.
  pause
  exit /b 1
)

echo.
echo [1/2] 먼저 검증합니다...
python "%~dp0import-cars-d-from-restored-ocr.py" "%ZIPPATH%"
if errorlevel 1 (
  echo.
  echo 검증 실패. 위 오류를 확인하세요.
  pause
  exit /b 1
)

echo.
set /p GO=검증 완료. Supabase에 실제 저장하려면 YES를 입력하세요: 
if /i not "%GO%"=="YES" (
  echo 저장하지 않고 종료합니다.
  pause
  exit /b 0
)

echo.
echo [2/2] Service Role Key는 화면에 표시되지 않게 입력됩니다.
python "%~dp0import-cars-d-from-restored-ocr.py" "%ZIPPATH%" --apply
if errorlevel 1 (
  echo.
  echo 업로드 중 오류가 발생했습니다.
  pause
  exit /b 1
)

echo.
echo 완료. Reading World를 새로고침한 뒤 cars-d-check.html을 확인하세요.
pause
