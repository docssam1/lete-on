# 과학 탐구 랩 — 세션 인수인계 (2026-09-19)

> 새 세션(로컬 포함)은 이 파일 → `DESIGN.md` → `UX-TEST-2026-09-19.md` → 저장소 루트 `CLAUDE.md`의 "과학 탐구 랩" 절 순서로 읽고 시작한다.

## 지금 상태
- 브랜치 `claude/jolly-allen-w57yqh` (main 미병합). `/science-lab/` 1차 버전: 지도자료 차례 15유닛, 개념→3D→탐구→토론→확인, Playwright 검증 통과.
- 재설계 규격 `DESIGN.md` **초안·승인 전**. 구조는 5E 탐구 순환: ① 궁금 → ② 실험(아이가 3D 조작) → ③ 개념(docssam 해설, 실험값 인용) → ④ 확장(영재원 문제은행) → ⑤ 점검.
- 사용성 점검 기준선 `UX-TEST-2026-09-19.md` (심각 4: 3D 위 스크롤 막힘, 가로 모드, 퀴즈 재도전 없음, 진도 기록 누락).

## 사용자가 정한 것
- 콘셉트: **"실험으로 탐구하고, 개념으로 이해하고, 영재원으로 확장한다."**
- 캐릭터 이름 **docssam**. 그림 `docssam science.png`(Drive 내 드라이브 루트, 1.2MB). 이론 화면에 크게 등장.
- 문제은행을 만들어 학습에 쓴다(유형 5종, 영재원 기출 원문은 Supabase에만).
- 화올 최종교재는 제외.
- 작업 방식: 인터뷰 → 계획 → 승인 → 구현(gajae-code). 디자인 규격은 MengTo design-first-ui-prompting 형식.

## 로컬 세션에서 바로 할 일 (C:·E:·F:·G: 접근 가능)
1. `docssam science.png` → `science-lab/assets/docssam.png` 로 복사(필요하면 1000px 폭으로 축소). 표정 그림이 더 있으면 `docssam-<상태>.png`.
2. `F:\지필드 usb\지필드 영재교육 업무\교재\과학교재\이론편`, `실험2` 를 열어 **차례만** 추출해 `science-lab/data/source-toc.md`에 적는다(원문은 git에 넣지 않는다 — 라이선스). 원문이 필요하면 Supabase `lesson_content` 패턴으로.
3. `DESIGN.md` 인터뷰 항목(1~7)에 사용자 답을 채우고 "승인"으로 바꾼 뒤 구현 시작. 1차 범위 권장: 뚝배기 1유닛.

## 클라우드 세션(이 대화)에서 못 한 것과 이유
- 캐릭터 파일 저장소 반입: Drive 다운로드가 프록시 차단(403), API 다운로드는 base64로 대화에 실려 와 파일로 쓸 수 없음.
- `이론편`·`실험2`: Drive 서버에 동기화 안 됨(폴더만 있고 비어 있음). hwp는 어차피 못 읽음 → PDF 권장.
- 3부 주제 10(터널 등) 원문: PDF 텍스트가 278쪽에서 잘려 제목 기준으로 작성함(`curriculum.js`의 `note`).

## 산출물 링크(이 세션)
- 3D 샘플(뚝배기, 독립 실행): https://claude.ai/artifact/R8WeG5f5pKcZUtyuXxbAd6
- 사용성 점검 보고서: https://claude.ai/artifact/96q99YfXtCEU4dYZE39jhz
