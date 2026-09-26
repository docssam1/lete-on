@echo off
chcp 65001 >nul
REM ============================================================
REM  독쌤 목소리를 원장님 실제 녹음으로 — 사이언스 랩 독쌤 대사 전부
REM
REM  쓰는 법: 녹음 파일(예: 녹음 2026-09-24 045754.mp4)을 이 파일 위에 끌어다 놓거나,
REM          더블클릭하면 다운로드 폴더에서 그 이름을 찾습니다.
REM  결과:   science-lab\audio\docssam\*.mp3 + manifest.json
REM          .docssam-work\듣기.html  (원본 녹음과 만든 음성을 한 장에서 비교)
REM  키를 하나도 쓰지 않고, 녹음 원본은 어디에도 올리지 않습니다.
REM ============================================================
setlocal
call "%~dp0_setup-omnivoice.cmd" || (echo  [!] 준비 단계 실패 & pause & exit /b 1)
python -m pip install imageio-ffmpeg --quiet

set REF=%~1
if "%REF%"=="" set REF=%USERPROFILE%\Downloads\녹음 2026-09-24 045754.mp4
if not exist "%REF%" (
  echo.
  echo  [!] 녹음 파일을 찾지 못했습니다: %REF%
  echo      녹음 파일을 이 cmd 파일 위에 끌어다 놓아 주세요.
  echo.
  pause & exit /b 1
)

echo.
echo  [실행] 독쌤 목소리로 대사를 만드는 중... 처음엔 모델을 받느라 오래 걸립니다.
python scripts\omnivoice-docssam.py --ref "%REF%" --device auto %2 %3 %4
if errorlevel 1 ( echo. & echo  [!] 실패했습니다. 위 메시지를 그대로 복사해 Claude 에게 주세요. & pause & exit /b 1 )

echo.
echo  완료. 듣기 페이지를 엽니다. 같은 사람 목소리로 들리면 아래 폴더를 GitHub 에 올려 주세요:
echo    science-lab\audio\docssam\
echo  (GitHub Desktop 이면 커밋 후 Push. 그다음 Claude 에게 "독쌤 음성 올렸어" 라고만 말하면 됩니다.)
start "" "%cd%\.docssam-work\듣기.html"
pause
