# GPT 후속 검수 — 2026-10-02

기준 코드: origin/main `71b382d94c95f061975f9d7941f323147356d818`에서 분리한
`codex/numbers-handoff-20261002`. 저장소 밖 유아 시안·검수용 영상은 웹에 배포하지 않았습니다.
옛 작업 폴더의 Git 연결이 끊겨 원본을 보존하고, E:에 독립 checkout을 만들었습니다.

## 실행한 필수 검사

`check-answerable`, `check-print-lang`(한국어·영어·중국어 각각 998레벨),
`check-ladder`, `check-stages`, `check-about-stats`, `check-roadmap-sync`,
`check-session-roles --browser`, `check-weekly-sheets`.
최종 코드로 위 8종 모두 실행해 통과했습니다. E: `results.json`과 개별 로그가 근거입니다.
실패·미실행을 통과로 바꾸지 않습니다.

## 추가 검수

- `check-concept-visuals`: 독립 산술 검산, 10개 모델·3언어, 실제 인쇄 개념도 존재, A4 넘침, 390px, 실행 오류 검사.
- `check-weekly-sheets --amt=1.5`: 학습량 1.5배 주간 학습지 148장 통과(기본 학습량도 148장 통과).
- `check-print-overflow`: 2,952벌(12·18·24문항) 통과, 서로 다른 문항이 부족한 42벌은 계약에 따라 건너뜀.
  고등 말투 수정 뒤 MD111·FR4 21벌 재검사 통과, 3벌 건너뜀.
- `check-tone`: 중등·고등 3,780문장 통과. 기존 MD111@4 해요체 2곳 수정.
- `check-tex-hygiene`: 988유형·레벨, 각 60문항 통과.
- `check-curriculum-notation`: 교육과정 밖 약어를 새 문제에 넣지 않는 규칙 검사.
- `check-comics`: 101편 실패 0. 경고 5건 중 새 3건은 `8 + 2 = 10` 등의 수식을 문장처럼 판단한 경고이며 실제 그림을 확인함.
- `check-counting-art`: 열 칸 총수·채운 수, 산가지 수, 안내 PNG 512px RGBA, 인쇄 SVG 자산 내장 검사 통과.
- `build-counting-art.js --check`, `build-symbol-art-briefs.js --check`: 저장 결과와 생성 원본 계약 대조 통과.
- 데스크톱·390px 개념도, 손과 열 칸 그림, 산가지 PNG를 육안으로 확인. 개념도 10개 A4 PDF 저장.

## 언어사고력 — 교사 승인과 자동 검사를 구분

- 독셈 이해편 v2: 3언어 × 유아/초 × 110회차 = 660쪽 생성, 빈 결과·undefined·NaN 없음.
  빈칸 뒤 조사 선택 표기 24쪽은 확인 후보로 별도 기록. 자연스러운 표현·수업 적합성을 교사 승인한 것은 아님.
- 한국어 50주제 검수용 문항·정답 Markdown/JSON과 대표 6쪽 PDF 준비.
- 유아 별도 시안: K1/K2/K3 × 15회차 × 6단계 = 270쪽 A4 넘침 0,
  각 3개 물음, 여섯 단계 동일 이야기, 390px 가로 넘침 0. K1/K2 식 쓰기 강요 없음.
  실제 시안 분위기·서버 저장·학생 계정·실물 인쇄 승인은 아님.
- 기존 이해편 v2는 쪽 아래에 정답이 있는 구조입니다. 교사 검수 때 학생용 정답 분리 여부도 결정해야 합니다.
  이번에는 주제·편성·정답 배치를 임의 확장/변경하지 않았습니다.

## 영상

재촬영한 19장면과 원본 학습지 역할·문항 대조 기록: `showreel-v2/sheets-src/source-proof.json`.
전체 검수본 `showreel-v2/numbers-of-magic-showreel-review-20261002.mp4`는 130.233333초.
기존 공개 영상과 전체 길이가 같고, 기존 음성·배경음 스트림을 복사하여 소리는 바꾸지 않았습니다.
두 영상의 디코딩 음성 SHA-256:
`650aa8dcd8bc6b0eb375b75996a3a65aa84b70fffe48b611f7f732041a308f91`.
대표 프레임 12장과 학습지 풀이 장면을 확인했습니다. 전체 영상 사용자 승인·공개 파일 교체·새 음성 복제는 아직 아닙니다.

## 근거 위치

`E:/Codex/artifacts/numbers-handoff-20261002/`

- `results.json`, `check-*.log`: 실제 검사 결과.
- `visual/`: 개념도 10개 PDF, 데스크톱·390px 캡처.
- `art-390.png`, `art-desktop.png`, `art-review.pdf`, `rods-review.png`·`.pdf`.
- `language-review-result.json`, `understanding-v2-teacher-review.md`·`.json`, `understanding-v2-teacher-samples.pdf`.
- `kids-K1.pdf`, `kids-K2.pdf`, `kids-K3.pdf`, `kids-390.png`.
- `showreel-v2/`: 검수용 영상·원본 쪽 캡처·문항 대조 기록. 공개 저장소에 중간 영상/프레임을 올리지 않음.

자동 검사로 대체할 수 없는 승인: 유아 시안, 교사 표현 검수, 실제 인쇄, 공개 영상 교체와 새 음성.
