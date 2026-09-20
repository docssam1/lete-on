@echo off
REM 공용 준비 단계 — omnivoice-audition.cmd 와 omnivoice-clone.cmd 가 둘 다 부른다.
REM 가상환경을 저장소 루트에 하나만 두고 같이 쓴다(설치가 두 번 일어나지 않게).
chcp 65001 >nul
cd /d "%~dp0..\.."

where python >nul 2>&1
if errorlevel 1 (
  echo.
  echo  [!] 파이썬이 없습니다. https://www.python.org/downloads/ 에서 3.11 을 설치하고
  echo      설치 화면의 "Add python.exe to PATH" 를 꼭 체크한 뒤 다시 실행하세요.
  echo.
  exit /b 1
)

set VENV=.venv-omnivoice
if not exist "%VENV%" (
  echo  [준비] 가상환경 만드는 중...
  python -m venv "%VENV%" || exit /b 1
)
call "%VENV%\Scripts\activate.bat"

if not exist "%VENV%\.installed" (
  echo  [준비] torch^(CUDA^) 와 OmniVoice 설치 중... 처음 한 번만, 몇 분 걸립니다.
  python -m pip install --upgrade pip --quiet
  REM CUDA 빌드를 먼저 시도하고, 안 되면 기본 wheel 로 물러선다(느려도 돌기는 한다)
  python -m pip install torch torchaudio --index-url https://download.pytorch.org/whl/cu128
  if errorlevel 1 (
    echo  [!] CUDA 빌드 설치 실패 - 기본 wheel 로 다시 시도합니다.
    python -m pip install torch torchaudio || exit /b 1
  )
  REM librosa 는 mp3 를 읽는 데 쓴다(ffmpeg 없이 우리 MP3 에서 참조 음성을 뽑기 위해)
  python -m pip install omnivoice soundfile librosa || exit /b 1
  echo done> "%VENV%\.installed"
)

python -c "import torch;print('  GPU:',(torch.cuda.get_device_name(0) if torch.cuda.is_available() else '없음 - CPU 로 돕니다'))"
exit /b 0
