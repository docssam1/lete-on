You are building the question bank for one Korean elementary science unit in the repo /home/user/lete-on (science-lab).

UNIT: {UNIT} = {SEM} {UNIT_LABEL} (grade {GRADE}, semester {SEMESTER}, unit no {NO}, area {AREA})
Work dir: {WORK}
- `set1.json`~`set4.json` hold the original test questions, transcribed and checked against the answer key. The owner holds the rights. They are used as-is; never edit them.
- `figmap.json` and `figs/` already exist (figures cropped from the papers).

Reference implementation — read these first:
- `scripts/bank-science-s42u02.mjs` (the config you will imitate)
- `scripts/bank-science-lib.mjs` (what the config feeds)
- the work dir for that unit, `science-lab/bank/work/s42u02/`, for the shape of `map.json` and `sim/a.json`

## Step 1 — classify: `{WORK}/map.json`
Read every original question. Then group them by the science they actually test:
- 4–6 content elements, `E1..`, ordered as the unit is taught;
- 8–13 question types, `T01..`; each type belongs to one element and holds at least 2 originals.

Write:
```
{"types": {"T01": "E1 <type name>", ...},
 "map": {"1-1": "T01", ...  every original key "<set>-<no>"},
 "misconceptions": {"M01": "<label: what the child wrongly thinks, in 해요체>", ...}}
```
- Aim for 6–10 misconceptions. Each one should be a real wrong idea that the wrong choices of several originals represent.

## Step 2 — similar items: `{WORK}/sim/a.json` (sets 1–2) and `{WORK}/sim/b.json` (sets 3–4)
Write exactly one similar item per original. Each one keeps the same type, format and difficulty, and changes the situation, objects and numbers enough to be a new question. Never copy the original sentence.

Item shape:
```
{"key": "1-1", "T": "T01", "fmt": "선택형|단답형|서술형", "kind": "sc|mc|st|wr",
 "prompt": "...", "givens": null | {"보기": [...]} | {"지문": "..."} | {"표": {...}},
 "choices": [5 strings, no ①② prefix] (sc/mc only),
 "answer": index (sc) | [indices] (mc) | "text" (st),
 "accepted": [...] (st),
 "sample": "...", "required": ["element 1", "element 2"], "ex": {"ok": [3], "part": [1], "no": [2]} (wr only),
 "explanation": "...", "m": "M0x" or null}
```
- `kind`:
  - sc = one choice;
  - mc = several choices (state "(정답 2개)" in the prompt);
  - st = short answer or symbol (for ㄱ/ㄴ/ㄷ answers, put the 보기 in givens);
  - wr = written explanation.
- Normally `kind` follows the original's format. If an original is a symbol pick from 〈보기〉, either st with 〈보기〉 or sc is fine.
- Science must be correct for grade {GRADE}. Use only terms taught by that grade. Never use these words: 자기장, 자기력선, 전자석, 전류, 코일, 자화, 원자, 분자, 에너지 전환.
- Numbers must be consistent and plausible. Recompute every answer yourself.
- Distractors must be plausible misconceptions, not nonsense. The correct choice must NOT be the unique longest choice by 3+ characters. Check every sc item programmatically.
- Balance answer positions across all sc items: count per position 0–4, max − min ≤ 2. Rearrange choices to fix it, and update `answer`.
- `m` is the misconception the wrong choices represent. Use null only if none fits.
- For `wr`, `ex` is used to test the judge:
  - ok = 3 good student answers, worded differently;
  - part = 1 answer with only the first required element;
  - no = 2 wrong answers.
- The explanation is 1–2 sentences in 해요체 and gives the reason, not just the answer.
- Write JSON with python (`python3 -I`), using `ensure_ascii=False`.

## Step 3 — config: `scripts/bank-science-{USHORT}.mjs`
Copy the structure of `scripts/bank-science-s42u02.mjs` with these differences:
- Pass: `unit: '{UNIT}'`, `no: {NO}`, `unitTitle: '<plain unit title without numeral>'`, `title: '{SEM} <numeral> <title>'`, `grade`, `semester`, `uKey: 'u0{NO}'`, `area`, `course: '초등 {SEM}'`, `unitLabel: '{UNIT_LABEL}'`, `sourceId: 'sci-{SEMNODASH}-{NO}-cats'`, `edition: '시매쓰DMC 최다빈출 단원평가'`.
- `elements` and `types`: names from map.json. Write a one-sentence `desc` for each type.
- No `lessonTypes`, `mElement`, or `book` (this unit has no lesson yet).
- `newMis`: every misconception from map.json. Give each:
  - `label`, `element`;
  - `terms`: 2–3 words;
  - `fix`: one 해요체 sentence correcting it, with the key words in `<b>…</b>`;
  - `step: 3`.
- `required` for every 서술형 original (`'src:<key>'`): split its rubric into 2 short elements.
- `judge` for every 서술형 original (`src:<key>`) and every wr similar (`sim:<key>`):
  - Shape: `need` (each with `t`, `ask`, and `any` regex list) / optional `wrong` / `ex` {ok, part, no}.
  - Regexes run on normalized text: spaces and punctuation removed, lowercase.
    - So write `물이수증기` rather than `물이 수증기`.
    - Allow particles and word-order variants with `.{0,12}`.
    - Remember conjugations (달다 → 답니다·달아요).
  - The model answer (`answer` / `sample`) and every ex.ok must judge ok. ex.part must judge part. ex.no must never judge ok.
  - Test the regexes with `node -e` and `science-lab/v2/judge.js` `judgeText`.
- `accept`: extra variants for multi-blank short answers if useful.
- If an st/mc item has no misconception, add `mFix: {'<key>': 'M0x'}`.

## Step 4 — run and pass every check
```
node scripts/bank-science-{USHORT}.mjs {WORK}
cd science-lab && node bank/taxonomy/build.mjs && node bank/audit.mjs && node bank/misc-audit.mjs && node bank/written-audit.mjs
```
- Fix anything reported for {UNIT}: wrong position skew, longest-choice, missing distractors or typed, judge failures.
- Do NOT edit any test file (other builders run in parallel; I register units in the tests myself). To test your judge entries, temporarily run: node -e "import('./science-lab/bank/judge.test.mjs')" is not enough — instead copy the U list check: write a scratch script in {WORK}/ that imports science-lab/v2/judge.js and checks every judge key of {UNIT} (ex.ok → ok, ex.part → part, ex.no never ok, every 서술형 sample/answer → ok, every short-text accepted → ok and '모르겠어요' → no).
- Do NOT touch other units' data, `science-lab/v2/*.js` app code, or `units-index.js`. Do NOT commit.

Reply with:
- the elements and types with their counts;
- the misconceptions;
- the sc answer-position counts;
- the result of every check;
- anything you were unsure about scientifically.
