@echo off
chcp 65001 >nul
REM ============================================================
REM  OmniVoice 음성 시청 — 원장 PC(GPU)에서 더블클릭으로 실행
REM
REM  왜 이게 있나 (2026-09-21)
REM   원장: "우리 GPU 있잖아, 지금 실행 PC"
REM   맞습니다. GPU 가 있으면 OmniVoice 는 글자당 요금이 0 이 됩니다(전기값만).
REM   Claude 세션은 클라우드 컨테이너라 GPU 가 없어 대신 이 파일을 둡니다.
REM
REM  하는 일
REM   1) 전용 가상환경을 만든다(시스템 파이썬을 더럽히지 않는다)
REM   2) torch(CUDA) + omnivoice 를 넣는다  — 처음 한 번만, 몇 분 걸립니다
REM   3) 앱에 실제로 있는 대사를 캐릭터 목소리 4종으로 읽어 audition\ 에 담는다
REM   4) 폴더를 열어 준다 — 귀로 듣고 정하시면 됩니다
REM
REM  비용 0: 구글·Supabase 키를 하나도 쓰지 않고, 아무것도 올리지 않습니다.
REM  모델 가중치(HuggingFace)는 처음 한 번만 내려받고 그다음부터는 캐시를 씁니다.
REM ============================================================
setlocal
cd /d "%~dp0..\.."

where python >nul 2>&1
if errorlevel 1 (
  echo.
  echo  [!] 파이썬이 없습니다. https://www.python.org/downloads/ 에서 3.11 을 설치하고
  echo      설치 화면의 "Add python.exe to PATH" 를 꼭 체크한 뒤 다시 실행하세요.
  echo.
  pause & exit /b 1
)

set VENV=.venv-omnivoice
if not exist "%VENV%" (
  echo  [1/4] 가상환경 만드는 중...
  python -m venv "%VENV%" || (echo  [!] 가상환경 생성 실패 & pause & exit /b 1)
)
call "%VENV%\Scripts\activate.bat"

if not exist "%VENV%\.installed" (
  echo  [2/4] torch^(CUDA^) 와 OmniVoice 설치 중... 처음 한 번만, 몇 분 걸립니다.
  python -m pip install --upgrade pip --quiet
  REM CUDA 빌드를 먼저 시도하고, 안 되면 기본 wheel 로 물러선다(그래도 돌아는 간다)
  python -m pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu128
  if errorlevel 1 (
    echo  [!] CUDA 빌드 설치 실패 - 기본 wheel 로 다시 시도합니다.
    python -m pip install torch torchaudio || (echo  [!] torch 설치 실패 & pause & exit /b 1)
  )
  python -m pip install omnivoice soundfile || (echo  [!] omnivoice 설치 실패 & pause & exit /b 1)
  echo done> "%VENV%\.installed"
)

echo  [3/4] GPU 확인...
python -c "import torch;print('  CUDA:',torch.cuda.is_available(),'|',(torch.cuda.get_device_name(0) if torch.cuda.is_available() else '없음'))"

echo  [4/4] 시청용 음성 만드는 중... 모델을 처음 받을 땐 오래 걸립니다.
python scripts\omnivoice-audition.py --out audition --device auto
if errorlevel 1 (
  echo.
  echo  [!] 생성에 실패했습니다. 위 메시지를 그대로 복사해 Claude 에게 주세요.
  pause & exit /b 1
)

echo.
echo  완료. 폴더를 엽니다 - wav 를 들어 보세요.
start "" "%cd%\audition"
pause
