You are adding the original unit-test questions to an EXISTING question-bank unit in /home/user/lete-on (science-lab). The unit already has similar items, a taxonomy, a misconception table (misc.js) and a judge table, all written by hand. Do not change any of those.

UNIT: {UNIT} ({SEM} {UNIT_LABEL})
Work dir: {WORK}
- `set1.json`~`set4.json`: fresh transcription of the test papers, made from the Drive PDFs.
- `figmap.json` and `figs/`: figures cropped from the papers.

## Step 1 — cross-check against the previous transcription in Supabase
The same originals were transcribed once before and stored in Supabase.
- Load the tool with ToolSearch "select:mcp__Supabase__execute_sql". Project id: fgahqumaldheqettmvqg.
- Run this query: `select set_no, original_no, item->'answerContract'->>'answer' as ans, item->>'prompt' as prompt, item->'taxonomy'->>'type' as type from science_bank_source where unit_id='{UNIT}' order by 1,2`.
- For every (set, no):
  - The answers must agree.
  - The prompts must be the same question. Small spacing or punctuation differences are fine.
  - The Supabase type must equal `taxonomy.sources['<set>-<no>'][0]` in `science-lab/data/units/{UNIT}.taxonomy.js`.
- If an answer disagrees, open the PDFs in `{WORK}/set<N>/` (`q.pdf`, `a.pdf`; render the page with PyMuPDF and read it) and decide which one is right. If the fresh JSON is wrong, fix the fresh JSON by editing `{WORK}/set<N>.json` directly with python. Never edit Supabase.
- List every disagreement in your reply and say how you resolved it.

## Step 2 — config `scripts/bank-science-{USHORT}.mjs`
Read `scripts/bank-science-lib.mjs`, function `importSourceOnly`. Then write:
```js
import { importSourceOnly } from './bank-science-lib.mjs';
const dir = process.argv[2];
await importSourceOnly({ unit: '{UNIT}', dir, date: '2026-10-09', title: '{SEM} {UNIT_LABEL}', uKey: 'u0{NO}', course: '초등 {SEM}',
  unitLabel: '{UNIT_LABEL}', sourceId: 'sci-{SEMNODASH}-{NO}-cats', edition: '시매쓰DMC 최다빈출 단원평가',
  required: { 'src:<key>': ['element 1', 'element 2'] /* every 서술형 original */ },
  accept: { /* optional extra accepted variants for short answers */ },
  mFix: { /* '<key>': 'M0x' for st/sc/mc originals whose paired similar item has no misconception */ },
  judge: { 'src:<key>': { need: [...], wrong: [...], ex: { ok: [3], part: [1], no: [2] } } /* every 서술형 original */ } });
```
- `required` and `judge` follow the official 채점 기준 (the `rubric` in the set JSON).
  - If the rubric gives full credit for either of two answers, or has a single criterion, use ONE need whose `any` holds the alternatives.
  - If the rubric has 정답 + 부분 정답 rows, use two needs.
- Look at the existing judge entries in `science-lab/data/units/{UNIT}.judge.js` for this unit's style. Reuse their regexes where the concept is the same.
- Judge regexes run on normalized text: spaces and punctuation are removed and ㄱ~ㅇ become ㉠~㉧. Allow particles with `.{0,12}`. Remember conjugations.
- The model answer and every `ex.ok` must judge ok. `ex.part` must judge part. `ex.no` must never judge ok on try 1 or try 2. Test this with a scratch script that imports `science-lab/v2/judge.js`.
- Misconception codes must already exist in `{UNIT}.misc.js`.

## Step 3 — run it and pass every check
```
node scripts/bank-science-{USHORT}.mjs {WORK}
cd science-lab && node bank/audit.mjs && node bank/misc-audit.mjs && node bank/written-audit.mjs
```
- Also make sure `node --test science-lab/bank/judge.test.mjs` passes. This unit is already in its list; the test now also loads `{UNIT}.source.js`.
- Do NOT edit any other test file, any app code (`v2/*`) or any other unit.
- Do NOT commit.
- `importSourceOnly` appends a block to the end of `{UNIT}.misc.js` and `{UNIT}.judge.js`. That is expected. Do not otherwise touch those files.

In your reply, give:
- the Supabase cross-check result;
- the number of originals and figures;
- the 서술형 keys you wrote judges for;
- the result of each check;
- anything you were unsure about.
