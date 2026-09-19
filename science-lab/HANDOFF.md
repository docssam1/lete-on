# 과학 탐구 랩 — 세션 인수인계 (2026-09-19, 2차)

> 새 세션(로컬 포함)은 이 파일 → `DESIGN.md` → `data/source-toc.md` → `UX-TEST-2026-09-19.md` → 저장소 루트 `CLAUDE.md`의 "과학 탐구 랩" 절 순서로 읽고 시작한다.

## 지금 상태
- 브랜치 `claude/jolly-allen-w57yqh` (main 미병합). `/science-lab/` 1차 버전: 지도자료 차례 15유닛, 개념→3D→탐구→토론→확인, Playwright 검증 통과.
- 재설계 규격 `DESIGN.md` **초안·승인 전**. 5E 탐구 순환(궁금→실험→개념→확장→점검) + **단원 축을 Drive `과학 단원평가` 폴더로 교체** + **단원 파일 = 문제은행 DB**.
- 교과 순서 지도 `data/source-toc.md` 완성: 단원 축(8학기×단원) · 지필드 이론편/실험2 ↔ 단원 매핑 · 교재 구조 · 원문 차례 전문은 `data/toc/*.md`(이론 3~4·5~6·7~9, 실험 3~4·5~6·중등).
- 사용성 점검 기준선 `UX-TEST-2026-09-19.md`.

## 사용자가 정한 것 (누적)
- 콘셉트: **"실험으로 탐구하고, 개념으로 이해하고, 영재원으로 확장한다."**
- 캐릭터 **docssam**(그림 확인함: 남자아이 과학자, 흰 가운·남색 넥타이·태블릿·PHYSICS 책, 표정 1장). 이론 화면에 크게.
- **단원 = Drive `과학 단원평가` 폴더**("이게 현재 단원이야"). 이것이 **문제은행 DB로도** 돼야 한다.
- 문항 계약은 저장소 스킬 `gfield-science-question-bank`(브랜치 `codex/golden-bell-semantic-workbook`)를 따른다.
- 지필드 이론편·실험2는 **라이선스 없음** → 원문 사용 가능. 화올 최종교재는 제외.
- 참고: 지필드 강의 슬라이드 `NEW STUDY Ⅰ 고체·액체·기체`(pptx) → 빈칸 개념 카드·정리표·Mini Test 패턴 채택(DESIGN.md).
- 작업 방식: 인터뷰 → 계획 → 승인 → 구현(gajae-code). 디자인 규격은 MengTo design-first-ui-prompting 형식.

## 로컬 세션에서 바로 할 일 (C:·E:·F:·G: 접근 가능)
1. `docssam science.png` → `science-lab/assets/docssam.png`(배경 투명 유지, 1000px 폭). 대화 첨부 이미지는 디스크에 안 남아 클라우드에서 못 넣었다.
2. `과학 단원평가` PDF는 **스캔본**(텍스트 레이어 없음). 4-1 Ⅰ 자석의 이용 세트1 + 정답 풀이를 OCR 또는 전사해 Supabase `science_bank_source`에 넣거나(원문·정답은 git 금지), 우선 `authored` 문항만으로 진행할지 사용자에게 확인(DESIGN.md 인터뷰 8·9).
3. `DESIGN.md` 인터뷰 항목 3~9 답을 채우고 "승인"으로 바꾼 뒤 구현. 1차 범위 권장: **4-1 Ⅰ 자석의 이용** 1단원(5E + 문항 20개 + 어댑터).

## 클라우드 세션에서 못 한 것과 이유
- 캐릭터 파일 저장소 반입(위 1).
- 단원평가 PDF 원문 읽기: Drive 텍스트 추출이 빈 문자열(스캔본). 이 환경엔 OCR 도구(tesseract·PyMuPDF)도 없음.
- pptx 슬라이드 렌더링: soffice가 30MB pptx 로드 실패, pdftoppm 없음 → 텍스트와 미디어 파일로만 파악(충분했음).
- 실험편 PDF 텍스트가 모두 32쪽(4번 실험)에서 끝남 — 단계당 4실험이 실제 구성으로 보이나, Drive 변환이 32쪽에서 잘렸을 가능성은 실물로 확인 요망.
- 이론편 3-2-2단계는 원본 앞부분 삭제(파일명대로) → Ⅰ·Ⅱ 단원명 미확보.

## 산출물 링크(이 세션)
- 3D 샘플(뚝배기, 독립 실행): https://claude.ai/artifact/R8WeG5f5pKcZUtyuXxbAd6
- 사용성 점검 보고서: https://claude.ai/artifact/96q99YfXtCEU4dYZE39jhz
