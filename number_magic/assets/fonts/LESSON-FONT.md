# 학습 화면 손글씨

`nm-lesson-hand.woff2`는 Google Fonts의 Nanum Pen Script를 WOFF2로 변환한
학습 화면용 파일입니다. 한글 11,172음절·라틴 문자를 유지합니다.
형식 변환본의 글꼴 내부 가족명은 OFL 예약 이름과 겹치지 않는 `NM Lesson Hand`입니다.
저작권·라이선스 정보는 원본 그대로 유지하며, `OFL-NanumPenScript.txt`를 함께 제공합니다.
기존 광고 표지용 `nanum-pen-cover.ttf`는 수정하지 않습니다.

- 원본: https://raw.githubusercontent.com/google/fonts/main/ofl/nanumpenscript/NanumPenScript-Regular.ttf
- 원본 SHA-256: `6f0d1ab29c7894010dc88831fb7a0a51edb79136e450344183de5b1a8b52bd43`
- 라이선스: https://raw.githubusercontent.com/google/fonts/main/ofl/nanumpenscript/OFL.txt
- 재생성: `python scripts/build-lesson-font.py <원본 ttf 경로>` (`fonttools[woff]` 필요)

화면에서만 유아·초등의 제목과 짧은 이야기 말풍선에 사용합니다.
중국어는 지원하지 않으므로 중국어 제목에는 본문 산세리프와 구분선을 사용합니다.
긴 설명·문제·수식·숫자 입력·조작 버튼·인쇄물에는 적용하지 않습니다.
