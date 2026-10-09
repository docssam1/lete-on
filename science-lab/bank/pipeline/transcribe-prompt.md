You are transcribing one set of a Korean elementary science unit test (「최다빈출 단원평가」 세트{SET}) into JSON, exactly as printed. The owner holds the rights to this material and wants the original text used as-is.

UNIT: {SEM} {UNIT_LABEL}
Drive folder id: {FOLDER}
Work dir (create it): {WORK}/set{SET}/
Output file: {WORK}/set{SET}.json

## 1. Get the two PDFs
- Load the Drive tools with ToolSearch: "select:mcp__Google_Drive__search_files,mcp__Google_Drive__download_file_content".
- List the folder with search_files, query `parentId = '{FOLDER}'`, excludeContentSnippets true. Follow nextPageToken until you have every file.
- You need two files:
  - the question PDF, titled like 「최다빈출 단원평가 세트{SET}.pdf」;
  - the answer PDF, titled like 「… 세트{SET} 정답 및 풀이.pdf」 or 「… 정답 및 해설.pdf」.
- Some units (탐구 units) have ONE test with no set number (「최다빈출 단원평가.pdf」 + 「… 정답 및 해설.pdf」). Then: if {SET} = 1, transcribe that single test as set 1 (skip the 세트 check); if {SET} > 1, stop at once and reply "no set {SET}".
- Call download_file_content for each one. The tool reports that the result was saved to a file: a JSON object whose `content` field is base64.
- Decode each one into an explicit filename: `{WORK}/set{SET}/q.pdf` and `{WORK}/set{SET}/a.pdf`. Do not use globs, and do not touch other sets' folders.
- Check: `head -c 5` shows `%PDF-`, and page 1 of q.pdf shows 세트{SET}.
- Run python with `-I`, e.g. `python3 -I -c "..."`. Use PyMuPDF (`import fitz`) to render every page to PNG at 150 dpi inside `{WORK}/set{SET}/`.
- Read the PNGs with the Read tool. If text is small or unclear, render a crop at 250–300 dpi (`page.get_pixmap(clip=fitz.Rect(...), dpi=300)`) and read that.
- Page size is in PDF points. Print `doc[0].rect` once.

## 2. Transcribe every question
Write one JSON array, one object per question number, in printed order:
```
{"no": 1, "page": 1, "prompt": "...", "givens": null | {...}, "choices": null | ["① ...","② ...",...],
 "format": "선택형" | "단답형" | "서술형", "responseContract": "one choice" | "two choices" | "one symbol" | "two symbols" | "one word" | "fill-in" | "evidence-based written explanation" | ...,
 "answer": "...", "accepted": ["...", ...], "rubric": null | [{"criterion": "...", "ratio": "100%"}, ...],
 "explanation": "...", "topic": "...", "concept": "...",
 "figure": null | {"note": "...", "needed": true|false, "bbox": [x0, y0, x1, y1]}, "uncertain": null | "..."}
```

Rules:
- Copy the text exactly as printed: spelling, spacing, punctuation, ①~⑤, ㄱ/ㄴ/ㄷ, ㈎/㈏, ㉠/㉡, units such as "15 g". Do not paraphrase. Do not fix wording.
- `choices` keeps the printed ①~⑤ prefixes. If the choices are a table (rows ① to ⑤ under column heads), write each row as "① A / B" and note the column heads in `uncertain`.
- `givens` holds everything printed besides the question sentence and the choices:
  - 〈보기〉 → `{"보기": ["ㄱ. ...", "ㄴ. ...", ...]}`
  - a passage, condition or experiment description → `{"지문": "..."}`
  - a table → `{"표": {"<head col>": [rows...], "<col>": [...]}}`, as in this example:
    `{"표": {"구분": ["모양", "손으로 만졌을 때의 특징"], "㈎": ["모양이 일정함.", "㉠"], "㈏": ["일정한 모양이 없음.", "손으로 잡을 수 없음."]}}`
  - a shared stem like 「[04~05] 다음은 … 물음에 답하세요.」 → `{"지문": "[04~05] 다음은 …"}` in EVERY question it covers.
  - Several of these may be combined in one object.
- `answer`: take it from the answer PDF, in printed form (e.g. "③", "②, ④", "ㄷ", "수증기", "㉠-부피, ㉡-무게").
  - For 서술형, `answer` is the model answer text and `rubric` is the printed 채점 기준 with each ratio.
- `accepted` lists equivalent student inputs:
  - for choices: the symbol, its digit, and the choice text without the symbol;
  - for 단답형: reasonable spacing and spelling variants;
  - for 서술형: the model answer only.
- `explanation`: copy the 풀이/해설 text for that question from the answer PDF.
- `topic`: write a short Korean label for what the question asks.
- `concept`: write one Korean sentence stating the science fact it tests. Write this in your own words, from the answer explanation.
- `figure`: use it for any picture, photo, graph or table drawn on the question page.
  - `bbox`: the figure's box in PDF points on that page, from the top-left. Measure it: x = px / dpi * 72. Check the crop by rendering it.
  - `needed`: true if the question cannot be answered without seeing the figure.
  - `note`: describe what the figure shows. If the figure carries text that is needed, also transcribe that text into `givens`.
  - If two questions share one figure, give both of them the same bbox. If the figure is on a different page from the question, add `"page": <figure page>` inside `figure`.
- `uncertain`: note anything ambiguous: illegible characters, underlined words, line breaks, or a difference between the question PDF and the answer PDF.
- Write the JSON with a small python script, e.g. `{WORK}/set{SET}/mk.py`, run with `python3 -I`, using `ensure_ascii=False, indent=1`. Validate it with `json.load`.

## 3. Verify before finishing
- Count the questions on the paper and in your JSON (sets usually have 15 or 20). They must match, numbered 1..N.
- Compare each answer against the answer PDF a second time, question by question. For choice items, check that the `answer` symbol points at the choice the 해설 describes. Fix any mismatch.
- Re-render every figure bbox as a crop and look at it. It must contain the whole figure and no neighbouring question text.

Reply with:
- the number of questions;
- the format counts;
- the list of question numbers with figures, saying which are needed;
- any `uncertain` items;
- the line "answers re-checked: yes".

Do not paste the question text into the reply.
