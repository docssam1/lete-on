#!/usr/bin/env node
'use strict';
/* 진단 → 속도·양 자동 편성(data/placement-paths.js autoPlan) 계약 검사 — 2026-10-04
 *   원장: "자동 편성을 하고 그 이후 수동 조절 가능하도록". 자동 값은 처음 맞춰 두는 시작값이고,
 *   로드맵의 '속도 · 양 조절'(0.7·0.85·1·1.25·1.5)이 그 뒤 수동 조절을 맡는다.
 *   여기서는 순수 함수의 계약만 본다:
 *     · 속도·양은 항상 허용 배수 안(속도 0.85~1.5, 양 1~1.5), 같은 입력이면 같은 출력
 *     · 안정(이전≥5·현재≥9)이면 속도가 목표 기본값보다 낮지 않고, 흔들림(현재≤5 또는 이전≤3)이면 속도가 높지 않으며 양은 낮지 않다
 *     · 한 번에 한 칸만 움직인다(목표 기본값 ±1칸)
 *     · 다음 4문항은 결과에 영향이 없다(승급 근거로 쓰지 않는다)
 *     · 3개 언어 문구가 모두 있고, 합격·숙달을 단정하는 말이 없다
 *   쓰는 법: node scripts/check-placement-auto.js */
const assert = require('assert');
const path = require('path');
global.window = global;
require(path.resolve(__dirname, '../data/placement-paths.js'));
const P = global.NM_PLACEMENT_PATHS;
assert(P && typeof P.autoPlan === 'function', 'autoPlan API missing');
const LIST = [0.7, 0.85, 1, 1.25, 1.5];
const base = { curriculum: { speed: 1, amount: 1 }, competition: { speed: 1, amount: 1.25 }, science: { speed: 1.25, amount: 1 } };
const mk = (prev, cur, next, skipped) => ({ bands: { previous: { correct: prev, asked: 6, skipped: skipped || 0 }, current: { correct: cur, asked: 10, skipped: 0 }, next: { correct: next, asked: 4, skipped: 0 } } });
let n = 0;
for (const goal of ['curriculum', 'competition', 'science']) for (const cadence of ['w1', 'w2'])
  for (let prev = 0; prev <= 6; prev++) for (let cur = 0; cur <= 10; cur++) for (let next = 0; next <= 4; next++) {
    const sel = { goal, cadence, goalTarget: goal === 'competition' ? 'soma-a' : '' };
    const a = P.autoPlan(mk(prev, cur, next), sel), where = `${goal}/${cadence}/${prev}-${cur}-${next}`;
    n++;
    assert(LIST.includes(a.speed) && LIST.includes(a.amount), where + ': multiplier outside the allowed list');
    assert(a.speed >= 0.85 && a.speed <= 1.5 && a.amount >= 1 && a.amount <= 1.5, where + ': outside auto range');
    assert.strictEqual(a.cadence, cadence, where + ': cadence must follow the user choice');
    assert.deepStrictEqual(P.autoPlan(mk(prev, cur, next), sel), a, where + ': deterministic');
    assert.deepStrictEqual(P.autoPlan(mk(prev, cur, 0), sel).speed, a.speed, where + ': next band must not change speed');
    assert.deepStrictEqual(P.autoPlan(mk(prev, cur, 4), sel).amount, a.amount, where + ': next band must not change amount');
    const b = base[goal], stable = prev >= 5 && cur >= 9, shaky = cur <= 5 || prev <= 3;
    const moved = LIST.indexOf(a.speed) - LIST.indexOf(b.speed);
    if (stable) assert.strictEqual(moved, 1, where + ': stable → one step faster');
    else if (shaky) { assert.strictEqual(moved, -1, where + ': shaky → one step slower'); assert.strictEqual(LIST.indexOf(a.amount) - LIST.indexOf(b.amount), 1, where + ': shaky → one step more amount'); }
    else { assert.strictEqual(a.speed, b.speed, where + ': middle keeps goal speed'); assert.strictEqual(a.amount, b.amount, where + ': middle keeps goal amount'); }
    assert(Array.isArray(a.reasons) && a.reasons.length >= 2, where + ': reasons missing');
    a.reasons.concat([a.note]).forEach(r => ['ko', 'en', 'zh'].forEach(l => assert(typeof r[l] === 'string' && r[l].trim(), where + ': ' + l + ' text missing')));
    JSON.stringify(a.reasons).split(/\W+/); /* no throw */
    assert(!/합격|보장|숙달했|guarantee|admission is|录取保证/.test(JSON.stringify(a.reasons) + JSON.stringify(a.note).replace(/합격을 뜻하지|admission|录取/g, '')), where + ': must not promise outcomes');
  }
assert.throws(() => P.autoPlan(null, {}), /required/, 'missing result must throw');
console.log('PLACEMENT_AUTO_OK cases=' + n + ' goals=3 cadences=2');
