@echo off
chcp 65001 >nul
REM ============================================================
REM  OmniVoice 목소리 복제 — 지금 쓰는 우리 목소리를 그대로 이어 간다
REM
REM  원장 지시(2026-09-21): "그냥 우리 나온 목소리 복제해."
REM  아이들이 이미 아는 누미 목소리가 바뀌면 안 되니까 — 맞는 판단입니다.
REM
REM  하는 일
REM   1) 우리 MP3(공개 URL)에서 언어마다 3~10초짜리 참조 음성을 뽑는다
REM      전사는 지어내지 않는다 — 우리가 합성에 쓴 바로 그 문장을 그대로 쓴다
REM   2) 그 참조로 앱 대사를 다시 읽혀 clone\ 에 담는다
REM   3) 폴더를 연다 — clone-ref\ 의 원본과 clone\ 을 번갈아 들어 비교하세요
REM
REM  구글·Supabase 키를 쓰지 않고, 아무것도 올리지 않습니다.
REM ============================================================
setlocal
call "%~dp0_setup-omnivoice.cmd" || (echo  [!] 준비 단계 실패 & pause & exit /b 1)

echo.
echo  [실행] 참조 음성 뽑고 복제하는 중... 모델을 처음 받을 땐 오래 걸립니다.
python scripts\omnivoice-clone.py --out clone --ref-dir clone-ref --device auto
if errorlevel 1 (
  echo.
  echo  [!] 실패했습니다. 위 메시지를 그대로 복사해 Claude 에게 주세요.
  pause & exit /b 1
)

echo.
echo  완료. 듣기 페이지를 엽니다 - 원본과 복제를 번갈아 눌러 비교하세요.
echo.
echo  [원격이라 소리가 안 들리면] clone\듣기.html 한 장에 소리가 전부 들어 있습니다.
echo  메일이나 메신저로 그 파일만 옮기면 휴대폰에서도 그냥 열립니다.
echo.
start "" "%cd%\clone\듣기.html"
start "" "%cd%\clone"
pause
