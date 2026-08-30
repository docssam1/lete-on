# Motion families

Eight families cover the strategy units in this codebase. They were derived by reading the return fields of all 78 generators the 창의수연 units use — not by grouping their titles. Pick the smallest family that carries the reasoning; combine only when one representation genuinely hands off to another.

Each family is defined by **what moves**, because that is what the beat list has to express.

| Family | What moves | Example generators |
|---|---|---|
| **묶기** group | Members of `nums[]` that satisfy a condition are gathered and folded into a subtotal | `comp100`, `pair10`, `pair10_2d`, `addSubGroup`, `splitPlace`, `jumpAdd`, `stairAdd`, `adv_gather`, `ml_pair10` |
| **이사** transfer | An amount leaves one number and joins another, making it round and leaving a remainder behind | `move10`, `move10_2d`, `add10sub`, `deficientFrom10`, `galaxy999`, `adv_1001`, `ml_end9`, `adv_anchorTens` |
| **쪼개기** split | One number separates along place value, each part is handled, then they rejoin | `splitHundred`, `splitAdd2Digit`, `splitAddByDigit`, `splitSubtract`, `splitTwo`, `digitShiftSub`, `subByPlace`, `ml_div_decomp`, `ml_partial` |
| **보정** compensate | Round first, compute, then give back exactly what was over- or under-taken | `addSimilarNums`, `addSameSub`, `subSameSub`, `moveAndSub`, `subEasyFirst`, `expandRewrite`, `ml_overmul`, `adv_estimate`, `adv_divNear` |
| **자리 이동** place-shift | Digits move a whole place and a correcting operation follows (×5 = ×10 ÷2) | `ml_x5`, `ml_x25`, `ml_x11`, `ml_x9`, `ml_placeshift`, `ml_decimal_mul`, `ml_decimal_div`, `adv_bigscale` |
| **부분곱** partial-product | A product decomposes into partial products that accumulate on a grid or cross | `ml8_mul2d2d`, `ml9_mul3d2d`, `ml6_mul2d1dMental`, `ml_veda`, `ml11_squares`, `adv_nearSquare`, `adv_splitSquare`, `ml_diff2sq`, `adv_sqcube` |
| **무지개** pair-sum | Ends pair inward and the same sum repeats — (first + last) × pairs | `ml_gauss`, `gaussAdd1`, `adv_sumSquares`, `countBetween` |
| **표기 바꾸기** notation | Two writings of one value stand side by side and correspond | `romanNumerals`, `ml_frac_conv`, `fr8_frDec`, `adv_baseSystem`, `adv_repeatDec` |

## Reading a family into a scene

The family tells you the **model**, not the coordinates. Build the model, let the renderer compute positions.

- 묶기 → group boundaries and a fold target
- 이사 → source point, destination point, and the amount in transit
- 쪼개기 → the split lines and each part's own lane
- 보정 → the rounded value, the correction, and the direction it is returned in
- 자리 이동 → the shift distance and the correcting operation attached to it
- 부분곱 → the grid cells and their accumulation order
- 무지개 → the arcs and the repeated sum
- 표기 바꾸기 → two parallel tracks and the correspondences between them

## Where the numbers come from

Generators in the semantic-field group already name what moves:

```
comp100        → {nums, sum, pairCount, target}    묶기
move10         → {a, b, need, rest}                이사 — need moves b → a
splitHundred   → {a, b, rest, comp}                쪼개기
digitShiftSub  → {a, b, before, comp}              쪼개기 / 이사
addSubGroup    → {nums, plusSum, minusSum}         묶기, by sign
addSimilarNums → {a, b, ra, rb, adj}               보정 — adj returned after ra·rb
gaussAdd1      → {n, pairSum, pairCount}           무지개
```

Generators in the step-only group expose nothing but `steps:[{tex, blank}]`. `ml_x9` computes `n`, `n×10` and the answer, yet `n` survives only inside a TeX string. **Do not parse it out.** Add a `scene` field beside the existing return value:

```js
return {
  prompt, tex, answer, answerType: 'steps', widget: 'steps',
  steps: [ … ],
  scene: { family: 'place-shift', n, shifted: n * 10, back: n, result: answer }
};
```

Purely additive. The problem, its answer, and its printed form must be identical before and after.

## Conservation

Every family has an invariant the validator can check, and checking it is how a picture that disagrees with its problem gets caught:

- 묶기 — subtotals sum to the total
- 이사 — `a + b` unchanged across the move
- 쪼개기 — parts sum to the original
- 보정 — after the correction, the result equals the answer
- 자리 이동 — shifted value ÷ shift factor, corrected, equals the answer
- 부분곱 — partial products sum to the product
- 무지개 — pairSum × pairCount (plus any middle term) equals the total
- 표기 바꾸기 — both writings evaluate to the same value
