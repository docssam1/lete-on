@echo off
chcp 65001 >nul
REM ============================================================
REM  쇼릴 내레이션 — 원장 목소리(복제)로 대본 12줄 읽히기, 원장 PC(GPU)에서
REM
REM  원장(2026-09-26): "내 로컬에서 돌리면 되잖아" — GitHub 서버(CPU)는 한 시간이 넘게 걸렸다.
REM  GPU 에서는 몇 분이면 끝난다.
REM
REM  하는 일
REM   1) 준비(가상환경·OmniVoice) — omnivoice-clone.cmd 와 같은 준비 단계를 쓴다
REM   2) 작업 브랜치에서 쇼릴 대본·참조 녹음·스크립트만 가져온다(지금 브랜치는 그대로 둔다)
REM   3) number_magic\scripts\showreel\narration\omnivoice-rec\ 에 n01~n12 를 만든다
REM   4) 그 폴더를 연다 — 폴더째 구글 드라이브에 올려 주시면 영상에 넣습니다
REM
REM  구글·Supabase 키를 쓰지 않고, 아무것도 올리지 않습니다.
REM ============================================================
setlocal
call "%~dp0_setup-omnivoice.cmd" || (echo  [!] 준비 단계 실패 & pause & exit /b 1)

set BR=claude/patch-number-magic-map-4ow1mr
echo.
echo  [가져오기] 작업 브랜치의 쇼릴 대본·참조 녹음을 가져옵니다...
git fetch origin %BR% || (echo  [!] 받지 못했습니다 - 인터넷 연결을 확인하세요 & pause & exit /b 1)
git checkout origin/%BR% -- number_magic/scripts/showreel scripts/omnivoice-clone.py || (echo  [!] 파일을 가져오지 못했습니다 & pause & exit /b 1)

echo.
echo  [실행] 원장 목소리로 12줄을 읽히는 중... 처음 한 번은 모델 받는 데 시간이 걸립니다.
python number_magic\scripts\showreel\narrate-omni.py
if errorlevel 1 (
  echo.
  echo  [!] 실패했습니다. 위 메시지를 그대로 복사해 Claude 에게 주세요.
  pause & exit /b 1
)

echo.
echo  완료. 결과 폴더를 엽니다.
echo  이 폴더(omnivoice-rec)를 통째로 구글 드라이브에 올리고 Claude 에게 알려 주세요.
echo  (wav 파일 12개와 _ref.json 이 들어 있습니다)
echo.
start "" "%cd%\number_magic\scripts\showreel\narration\omnivoice-rec"
pause
