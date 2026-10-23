# Grade 5-2 Unit 1, printed page 9, Mission 6 source review (corrected)

Status: source, independent answer, local browser, and A4 verified; deployment pending.

## Source

- Original: `5-2 심화.pdf`, PDF page 7 / printed page 9.
- Drive file ID: `1fAXZ_Gjv_EIum11cPRFA_PSIMkOXR7oL`.
- Original PDF SHA-256: `d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463`.
- Direct page inspection and Apple Vision OCR confirm: “감귤 농장에서 3일 동안 수확한 감귤의 개수는 첫째 날 4283개, 둘째 날 3976개, 셋째 날 4015개이다. 수확한 감귤은 500개씩 상자에 넣고 포장하여 한 상자에 150000원씩 판매한다고 한다. 포장된 감귤을 모두 판매한다면 판매금액의 합은 얼마인가?”
- The crop and OCR were reviewed as source evidence. Handwriting, including any nearby penciled answer, was excluded. No publisher answer key was verified (`publisherKeyVerified=false`).

## Independent calculation

`4,283 + 3,976 + 4,015 = 12,274` mandarins. Packing 500 each gives `12,274 = 24×500 + 274`: 24 complete boxes and 274 unpacked mandarins. The source prices a box containing 500 mandarins and asks for sales of the packed mandarins. The 274 remainder does not form a 500-mandarin box and is not part of the packed stock being sold. Therefore `24×150,000 = 3,600,000` won.

The previous draft treated a 274-mandarin partial box as an alternative. That reading contradicts “500개씩” and invents a sale price for a non-500 box; it is withdrawn. A prior inventory title also said “감자”; the printed source says “감귤,” so the record is corrected to mandarins. The connected solution explicitly accounts for the 274 unboxed remainder. No source counts, box size, or price are used in synthetic public pools.

## Local verification

- Focused arithmetic audit passed all 9 synthetic pool/difficulty combinations; it independently confirms the source answer and checks that no answer leaks into the prompt.
- Browser audit passed 12 states at 1280px and 375px, 24 horizontal overflow checks, 12 blocked external requests, and answer separation. The source is text-only; the learner variant preserves that structure without adding a diagram.
- Problem and solution exports each render to one A4 portrait page. The solution layout was shortened after the first visual review so the remainder explanation stays comfortably within the page box.
- Whole-bank availability, source-release, elementary-language, math-notation, numeric-display, and source-classification audits passed at 2,036 total / 1,248 generatable / 788 pending. This is local verification only; deployment/live check is still pending.

No student data was accessed or changed.
