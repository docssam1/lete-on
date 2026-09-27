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
call "%~dp0_setup-omnivoice.cmd" || (echo  [!] 준비 단계 실패 & pause & exit /b 1)

echo  [실행] 시청용 음성 만드는 중... 모델을 처음 받을 땐 오래 걸립니다.
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
