@echo off
chcp 65001 >nul
REM ============================================================
REM  독쌤 목소리 비교 듣기 — 지금(OmniVoice) 옆에 Qwen3-TTS 복제 음성을 나란히
REM  (원장 2026-11-08 「옴니보이스보다 한국어에 맞는 복제 프로그램 찾아봐」 → 「진행」)
REM
REM  쓰는 법: 독쌤 녹음 파일을 이 파일 위에 끌어다 놓거나, 더블클릭하면 다운로드 폴더에서 찾습니다.
REM  결과:   .docssam-work\qwen3\듣기.html  (줄마다 OmniVoice · Qwen3-TTS 를 번갈아 듣기)
REM  사이트 음성은 바꾸지 않고, 녹음 원본도 어디에도 올리지 않습니다. 키도 쓰지 않습니다.
REM  처음 한 번은 설치와 모델 받기(약 5GB)로 오래 걸립니다.
REM ============================================================
setlocal
cd /d "%~dp0..\.."
where git >nul 2>&1
if not errorlevel 1 (
  echo  [준비] 최신 코드 받는 중...
  git pull --ff-only 2>nul || echo   ^(받지 못했습니다 - 지금 폴더에 있는 것으로 진행합니다^)
)
where python >nul 2>&1
if errorlevel 1 (
  echo  [!] 파이썬이 없습니다. python.org 에서 3.12 를 설치하고 "Add python.exe to PATH" 를 체크한 뒤 다시 실행하세요.
  pause & exit /b 1
)
REM OmniVoice 와 필요한 판(transformers 등)이 달라 가상환경을 따로 둔다
set VENV=.venv-qwen3tts
if not exist "%VENV%" (
  echo  [준비] 가상환경 만드는 중...
  python -m venv "%VENV%" || (pause & exit /b 1)
)
call "%VENV%\Scripts\activate.bat"
if not exist "%VENV%\.installed" (
  echo  [준비] torch^(CUDA^) 와 Qwen3-TTS 설치 중... 처음 한 번만, 몇 분 걸립니다.
  python -m pip install --upgrade pip --quiet
  python -m pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu128
  if errorlevel 1 python -m pip install torch torchaudio || (pause & exit /b 1)
  python -m pip install -U qwen-tts soundfile numpy imageio-ffmpeg || (echo  [!] 설치 실패 - 위 메시지를 Claude 에게 주세요. & pause & exit /b 1)
  echo done> "%VENV%\.installed"
)
python -c "import torch;print('  GPU:',(torch.cuda.get_device_name(0) if torch.cuda.is_available() else '없음 - CPU 로 돕니다'))"

set REF=%~1
if "%REF%"=="" set REF=%USERPROFILE%\Downloads\녹음 2026-09-24 045754.mp4
if not exist "%REF%" (
  echo  [!] 녹음 파일을 찾지 못했습니다: %REF%
  echo      독쌤 녹음 파일을 이 cmd 파일 위에 끌어다 놓아 주세요.
  pause & exit /b 1
)
echo.
echo  [실행] 같은 대사 8줄을 Qwen3-TTS 로 만드는 중...
python scripts\qwen3tts-audition.py --ref "%REF%" %2 %3 %4 %5
if errorlevel 1 (
  echo.
  echo  [!] 실패했습니다. 그래픽 메모리가 모자라다는 말이면 작은 모델로 다시:
  echo      이 파일에 녹음을 끌어다 놓는 대신 명령창에서  scripts\local\qwen3tts-audition.cmd "녹음경로" --model Qwen/Qwen3-TTS-12Hz-0.6B-Base
  echo      그 밖의 오류는 위 메시지를 그대로 Claude 에게 주세요.
  pause & exit /b 1
)
echo.
echo  완료. 듣기 페이지를 엽니다. 어느 쪽이 녹음과 더 같은 사람 같은지 Claude 에게 알려 주세요.
start "" "%cd%\.docssam-work\qwen3\듣기.html"
pause
