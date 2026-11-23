# 주간 학습지 Typst 조판 (실험용 · 실제 PDF 길에는 연결 안 됨)

`ws.html`이 그리는 주간 학습지(표지 → 목차 → 학습 쪽 → 마법 노트·교구·매거진 → 정답지)를
Typst로 다시 조판해 같은 쪽 구성의 PDF를 만든다. 2026-11-20 시험 결과 74개 과정(C0~C73) 1주차가
브라우저 PDF와 쪽 수·쪽별 숫자 구성이 모두 일치했다. **그래도 실제 주간 PDF(`scripts/nm-weekly-worksheets.cjs`,
헤드리스 크롬)는 바꾸지 않았다**(원장 2026-11-20 결정) — 이유: 표지·교구·마법 노트·매거진·그림 영역은 크롬 PDF를
벡터로 오려 넣으므로 크롬이 어차피 필요하고, 다시 타이핑한 쪽은 `exam.js` 변경마다 이쪽도 맞춰야 한다.
크롬 PDF에서 수식·쪽 나눔이 실제로 문제가 되거나 인쇄소가 PDF 규격을 요구할 때 다시 본다.
그때 할 일: ① 숫자 계산 쪽 문제 칸의 카드 테두리를 없애 원본 모양에 맞춘다(지금은 카드 틀이 생긴다)
② 한 묶음(예: 초등 C1~C28)만 한 달쯤 크롬 판과 나란히 돌려 본다.

## 흐름
1. `extract2.js <C번호> <k> <출력 폴더>` — 인쇄 폭으로 `ws.html`을 그려 칸 위치(mm)·글·수식(TeX)을 `data.json`으로,
   브라우저 PDF를 `src.pdf`로 저장. (`.nm-draw-answer-key`, 정답 구역의 `.nm-w2-concept-tip`도 읽는다.)
2. `build2.py <출력 폴더>` — `conv.js`(tex2typst + 손질)로 수식을 Typst로 바꾸고 `tpl2.typ`에 얹어 `full.typ` → `full.pdf`.
   표지·교구·마법 노트·매거진 쪽과 그림이 든 영역(세로셈·수직선·그래프 등)은 `src.pdf`에서 벡터로 오려 넣는다.
3. `verify.py <출력 폴더>…` — `src.pdf`와 `full.pdf`를 쪽마다 숫자 낱자 꾸러미로 견준다(`V=1`이면 어긋난 쪽 상세).
4. `runall.sh` — 74과정 전부 1~3. 걸리는 시간 약 20분.

## 준비
- `npm install` (이 폴더 — tex2typst), Python `pip install typst`, Playwright(`scripts/lib/playwright.js`가 찾는 것), `pdftotext`·`pdfinfo`.
- 글꼴: npm `pretendard`의 정적 OTF 폴더를 `fonts/`에 두거나 `NM_TYPST_FONTS`로 가리킨다.
- 가상환경을 쓰면 `NM_TYPST_PY=venv/bin/python bash runall.sh`.

## 알려진 한계 · 했던 실수
- 그림이 든 문제 칸을 칸마다 오려 넣으면 잘린다 → 문제 영역 전체를 한 덩어리로(`snipfit`, 쪽 높이에 맞춰 줄임).
- 정답 구역 안 「기억 고리·조심」 팁 상자를 빼먹으면 정답지 숫자가 어긋난다.
- Typst `display(a, b)`는 맨 윗단의 `, : ;`를 인자 구분으로 읽는다 → `_esc_top`.
- `#h(0.5em)(x+m…)`처럼 함수 뒤에 괄호가 붙으면 호출로 읽힌다 → `#h(..);`.
- 오려 넣은 PDF 쪽의 글자는 Typst PDF에서 글자로 안 읽힌다 — 숫자 견주기는 그 부분을 못 보므로 그림으로도 확인한다.
- 이 도구를 만들다 찾은 학습지 버그(붉은 깨진 수식 등)는 `scripts/check-weekly-sheets.js`가 이제 잡는다.
