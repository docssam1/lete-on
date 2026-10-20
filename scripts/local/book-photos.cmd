@echo off
chcp 65001 >nul
REM ============================================================
REM  교재 실사 사진 만들기 — 원장 PC GPU, 비용 0
REM
REM  원장 지시(2026-10-19): "실사 수준으로 만들어야 하는거 알지"
REM  Claude 세션에는 GPU 가 없고 이미지 생성 서비스·사진 사이트가 막혀 있어 여기서 만든다.
REM
REM  하는 일
REM   1) 무료 공개 모델 FLUX.1-schnell(Apache 2.0)로 장면마다 후보 3장을 만든다
REM      (GPU 메모리가 10 GB 보다 적으면 SDXL 로 자동 전환)
REM   2) book-photos\고르기.html 에 후보를 한 장에 모아 연다
REM   3) 후보를 GitHub 의 별도 수신 브랜치 inbox/book-photos 로 올린다
REM      — 이 PC 의 작업 폴더와 main 은 건드리지 않는다
REM  다 끝나면 Claude 에게 "사진 올렸어" 라고만 말해 주세요.
REM
REM  처음 한 번은 모델(약 30 GB)을 받느라 오래 걸립니다. 중간에 끊겨도 다시 실행하면 이어서 합니다.
REM ============================================================
setlocal
cd /d "%~dp0..\.."

REM 이 도구는 작업 브랜치(claude/jolly-allen-w57yqh)에 있다. 원장 PC 의 원래 작업 폴더(main)를 건드리지 않게
REM 옆에 만든 전용 폴더(lete-on-photos, git worktree · 브랜치 없이 붙음)에서 돌리고, 돌 때마다 최신 장면 목록을 받는다.
set SRC=claude/jolly-allen-w57yqh
where git >nul 2>&1
if not errorlevel 1 (
  echo  [준비] 최신 장면 목록 받는 중...
  git symbolic-ref -q HEAD >nul 2>&1
  if errorlevel 1 (
    git fetch origin %SRC% 2>nul && git checkout --detach FETCH_HEAD 2>nul || echo   ^(받지 못했습니다 - 지금 폴더에 있는 것으로 진행합니다^)
  ) else (
    git pull --ff-only 2>nul || echo   ^(받지 못했습니다 - 지금 폴더에 있는 것으로 진행합니다^)
  )
)
where python >nul 2>&1
if errorlevel 1 (
  echo  [!] 파이썬이 없습니다. https://www.python.org/downloads/ 에서 3.11 을 설치하고
  echo      설치 화면의 "Add python.exe to PATH" 를 꼭 체크한 뒤 다시 실행하세요.
  pause & exit /b 1
)

set VENV=.venv-imagegen
if not exist "%VENV%" (
  echo  [준비] 가상환경 만드는 중...
  python -m venv "%VENV%" || (pause & exit /b 1)
)
call "%VENV%\Scripts\activate.bat"
if not exist "%VENV%\.installed" (
  echo  [준비] torch^(CUDA^) 와 diffusers 설치 중... 처음 한 번만, 몇 분 걸립니다.
  python -m pip install --upgrade pip --quiet
  python -m pip install torch --index-url https://download.pytorch.org/whl/cu128
  if errorlevel 1 python -m pip install torch || (pause & exit /b 1)
  python -m pip install diffusers transformers accelerate sentencepiece protobuf pillow || (pause & exit /b 1)
  echo done> "%VENV%\.installed"
)
python -c "import torch;print('  GPU:',(torch.cuda.get_device_name(0) if torch.cuda.is_available() else '없음 - CPU 로 돌면 매우 느립니다'))"

echo.
echo  [실행] 사진 만드는 중...
python scripts\book-photos.py %*
if errorlevel 1 (
  echo.
  echo  [!] 실패했습니다. 위 메시지를 그대로 복사해 Claude 에게 주세요.
  pause & exit /b 1
)
start "" "%cd%\book-photos\고르기.html"
echo.
echo  완료. Claude 에게 "사진 올렸어" 라고 말해 주세요.
pause
