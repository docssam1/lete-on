# science-src — 단원평가 원본 전용 브랜치

**이 브랜치는 `main`에 병합하지 않는다.** GitHub Pages로 공개되면 안 되는 원본(스캔 그림)을 담는다.
저장소를 비공개로 잠그기 전까지는 여기에 원문 **문장**을 두지 않는다 — 문장·정답은 Supabase
`public.science_bank_source`에만 있다.

## 지금 상태 (2026-09-20)

- `4-1/자석의 이용/index.json` — 원문 80문항의 **대응표**. `<원문 source_key> → {file, stem?, element, type, format, source:{set,no}}`.
- 분류 폴더 14개(E1~E4 × T01~T14)는 만들어 두었으나 **PNG는 아직 없다.**

### PNG가 없는 이유
`bank/tools/crop_blocks.py`는 원본 PDF를 디스크에서 읽는다. 이 작업을 한 세션은
클라우드 컨테이너였고, 네트워크 정책이 `drive.google.com`·`docs.google.com`을 막아
(CONNECT 403) PDF를 내려받을 수 없었다. Drive MCP의 `download_file_content`는 파일을
base64 문자열로 대화 문맥에 싣는 방식이라 2.4MB PDF에는 쓸 수 없다.
또한 Drive 폴더에 **세트4 PDF가 없다**(세트1~3과 정답·풀이만 있음).

### 이어서 할 일
1. `최다빈출 단원평가 세트1~4.pdf`를 세션에 **파일 첨부**하거나 로컬에서 작업한다.
2. `pip install pymupdf opencv-python numpy`
3. `python science-lab/bank/tools/crop_blocks.py <PDF폴더> /tmp/blocks`
4. `/tmp/blocks/s{세트}-q{번호}.png` → `index.json`의 `file` 경로로, `s{세트}-g{번호}.png` → `stem` 경로로 옮긴다.
5. 눈으로 전수 확인(번호 흔적·잘림·다른 문항 섞임). 확인되면 Supabase `figures.status`를
   `pending-crop` → `ok`로 바꾼다.

경로는 이미 Supabase `figures.block`·`figures.stem`·`item.visualModel.figure`와 일치하므로,
파일만 제자리에 놓으면 더 고칠 것이 없다.

## 분류 기준
`science-lab/bank/taxonomy/s41-u01.json`(공개 브랜치)가 유일한 기준이다. 내용 요소 4개(E1~E4) ·
유형 14개(T01~T14) · 형식 4종(선택형·단답형·표·서술형).
