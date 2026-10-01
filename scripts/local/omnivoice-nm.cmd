@echo off
chcp 65001 >nul
REM ============================================================
REM  넘버스 오브 매직 앱 음성 — OmniVoice 복제 목소리로 전부 만들기
REM
REM  원장 지시(2026-09-29): "복제음성으로 해. omni"
REM  지금 앱 목소리(구글)를 참조로 복제해 앱 대사 약 760줄을 다시 읽힌다.
REM  구글 요금 0 원 - GPU 전기값만. 키를 하나도 쓰지 않는다.
REM
REM  결과: number_magic\audio\omni\*.mp3 + number_magic\data\tts-map-omni.js
REM        .omni-nm-work\듣기.html  (참조와 만든 음성을 한 장에서 비교)
REM  한 번 만든 줄은 다음 실행에서 건너뛴다 - 중간에 꺼도 이어서 된다.
REM  처음엔 몇 줄만 들어 보려면:  omnivoice-nm.cmd --limit 12
REM ============================================================
setlocal
call "%~dp0_setup-omnivoice.cmd" || (echo  [!] 준비 단계 실패 & pause & exit /b 1)
python -m pip install imageio-ffmpeg --quiet

echo.
echo  [실행] 앱 대사를 복제 목소리로 만드는 중... 처음엔 모델을 받느라 오래 걸립니다.
python scripts\omnivoice-nm.py --device auto %*
if errorlevel 1 ( echo. & echo  [!] 실패했습니다. 위 메시지를 그대로 복사해 Claude 에게 주세요. & pause & exit /b 1 )

echo.
echo  완료. 듣기 페이지를 엽니다. 괜찮으면 아래 두 곳을 GitHub 에 올려 주세요:
echo    number_magic\audio\omni\
echo    number_magic\data\tts-map-omni.js
echo  (GitHub Desktop 이면 커밋 후 Push. 그다음 Claude 에게 "넘버스 음성 올렸어" 라고만 말하면 됩니다.)
if exist "%cd%\.omni-nm-work\듣기.html" start "" "%cd%\.omni-nm-work\듣기.html"
pause
