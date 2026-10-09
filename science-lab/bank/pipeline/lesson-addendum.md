## LESSON UNIT — extra rules (this unit already has a 5-step lesson)

This unit already exists in the app with a lesson. Its files are in `science-lab/data/units/{UNIT}.*` and `science-lab/data/book/{UNIT}.book.js`. `importUnit` keeps the lesson but replaces the old practice items (about 20 authored similars, ids `{UNIT}-v001…`) with the new originals and 1:1 similars. Follow `scripts/bank-science-s42u02.mjs` exactly. It is a lesson unit too, so copy its `lessonTypes`, `mElement` and `book` fields.

1. **Read the lesson first.**
   - Read `{UNIT}.js`. Its `items` are the 12 lesson questions `{UNIT}-b01…b12`.
   - Read `{UNIT}.misc.js`; its `misconceptions` are hand-written codes M01…Mk.
   - Read `{UNIT}.taxonomy.js` (old types), `{UNIT}.lesson.js` and `data/book/{UNIT}.book.js`.
   - When you build map.json, the elements should follow the order the lesson teaches.
2. **`lessonTypes`**: map EVERY lesson item `b01`…`b12` to one of your new types (`importUnit` throws if one is missing).
3. **Existing misconceptions stay.**
   - `mElement` gives EVERY existing code (M01…Mk) its new element.
   - In map.json and in the sim items' `m`, reuse an existing code when the wrong idea is the same.
   - Number new codes after the highest existing code (Mk+1 …) and put only those in `newMis`.
   - Do not rename or delete existing codes. The lesson's `-b` distractors use them.
4. **`book`**:
   - `check` = 6 original keys ("set-no") whose similar items fit the book's 확인 page (단답과 서술형 확인 문제). Include at least 2 단답형 and at least 1 서술형, spread across the elements in teaching order.
   - `formative` = 4 keys, matching the book's `formative.standards` in order where possible (one per standard, plus one more).
   - The keys must exist (`importUnit` checks).
   - `importUnit` rewrites those two lists in the book file. That is the only change to the book file.
5. **Judges and tests.**
   - The old judge keys `{UNIT}-v0NN` disappear. Some app tests (`science-lab/v2/lab-*.test.mjs`) assert on those old keys. Do NOT edit them; just list in your reply which test lines reference `{UNIT}-v…` keys, and I will update them.
   - Also run `node --test science-lab/v2/*.test.mjs science-lab/bank/*.test.mjs` and report the failures (some may be expected for the reason above, or because I have not registered the unit's source count yet).
6. Do not touch `{UNIT}.lesson.js`, `data/book/{UNIT}.interact.js`, scenes, labs or any app code.
