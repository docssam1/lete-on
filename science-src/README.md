# science-src — 단원평가 원본 그림 전용 브랜치

**이 브랜치는 `main`에 병합하지 않는다.** GitHub Pages로 공개되면 안 되는 원본(스캔 그림)을 담는다.
원문 **문장·정답**은 여기 두지 않는다 — Supabase `public.science_bank_source`에만 있다.
(저장소는 나중에 비공개로 잠근다.)

## 지금 상태 (2026-09-20)

| 단원 | 폴더 | 그림 | Supabase |
|---|---|---|---|
| 4-1 Ⅰ 자석의 이용 (`s41-u01`) | `4-1/자석의 이용/` | 87 + `index.json` | 80행 `figures.status = ok` |
| 4-1 Ⅱ 물의 상태 변화 (`s41-u02`) | `4-1/물의 상태 변화/` | 97 + `index.json` | 80행 `figures.status = ok` |
| 4-1 Ⅲ 땅의 변화 (`s41-u03`) | `4-1/땅의 변화/` | 90 + `index.json` | 80행 `figures.status = ok` |

## 파일 이름 규칙 (단원마다 폴더 하나, 분류는 이름에)

- `E{소단원}-T{유형}-o-{nn}.png` — 문항 한 개(발문+보기+그림). **문항 번호는 지웠다.**
- `E{소단원}-T{유형}-stem-{nn}.png` — 여러 문항이 함께 쓰는 공통 그림/제시문.
- `index.json` — `<원문 source_key> → {file, stem?, element, type, format, source:{set,no}}` 대응표.
- `E`·`T`의 이름은 공개 브랜치 `science-lab/data/units/<단원>.taxonomy.js`(= `bank/taxonomy/<단원>.json`)가 기준이다.

Supabase `figures.block`·`figures.stem`은 이 경로(`science-src/4-1/<단원>/<파일>`)와 일치한다.

## 새 단원 추가 순서
1. 단원평가 PDF 첨부 → `science-lab/bank/tools/crop_blocks.py`로 문항 잘라내기(번호 지움).
2. 분류(E·T) 확정 후 위 규칙으로 이름 붙여 폴더 하나에 모은다.
3. GitHub 웹 업로드: `https://github.com/docssam1/lete-on/upload/science-src/science-src/<학기>/<단원>` 에 파일 끌어 넣기(주소가 폴더를 만든다).
4. `git ls-tree`로 개수·바이트 대조 → Supabase `figures.status`를 `ok`로.
