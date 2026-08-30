#!/usr/bin/env node
'use strict';
/* 보기 길이 편향 보정용 패치 적용기.
 *
 *   node scripts/apply-choice-fixes.js patches/rp1.json
 *
 * 패치 형식: [{ id, set:'extra'|'new', q:1-based, choice:'A'~'D', text }]
 *
 * 파일을 통째로 다시 직렬화하지 않는다 — 옛 보기 문자열 리터럴이 파일 안에
 * 정확히 한 번 나올 때만 바꾼다. 두 번 이상이면 어느 쪽인지 알 수 없으므로
 * 손대지 않고 멈춘다. 정답 letter(q[3])는 이 도구가 절대 건드리지 않는다 —
 * 3/3/3/3 분포가 보정 때문에 깨지는 일을 원천 차단하기 위해서다. */
const fs = require('fs'), path = require('path');
const DATA = path.join(__dirname, '..', 'reading-world', 'data');
const patches = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

const byId = {};
patches.forEach(p => (byId[p.id] = byId[p.id] || []).push(p));

let applied = 0, failed = 0;
Object.keys(byId).forEach(id => {
  global.window = { LESSONS: {} };
  delete require.cache[require.resolve(path.join(DATA, id + '.js'))];
  require(path.join(DATA, id + '.js'));
  const L = global.window.LESSONS[id];
  const file = path.join(DATA, id + '.js');
  let src = fs.readFileSync(file, 'utf8');

  byId[id].forEach(p => {
    const set = p.set === 'extra' ? L.extraLearning : L.newPassage;
    const q = set.questions[p.q - 1];
    const ci = 'ABCD'.indexOf(p.choice);
    const old = q[2][ci];
    if (old === p.text) { console.log(`= ${id} ${p.set} Q${p.q}${p.choice} 이미 같음`); return; }
    /* 파일마다 따옴표 스타일이 다르다(rp/ws는 홑따옴표, 일부는 겹따옴표).
       원래 쓰인 스타일을 그대로 유지해야 diff가 그 한 줄로 끝난다. */
    const sq = t => "'" + t.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
    const cands = [[JSON.stringify(old), JSON.stringify(p.text)], [sq(old), sq(p.text)]];
    const hit = cands.filter(([lit]) => src.split(lit).length - 1 === 1);
    if (hit.length !== 1) {
      const counts = cands.map(([lit]) => src.split(lit).length - 1).join('/');
      console.log(`! ${id} ${p.set} Q${p.q}${p.choice} 리터럴 ${counts}회 — 건너뜀: ${old}`); failed++; return;
    }
    src = src.replace(hit[0][0], hit[0][1]);
    applied++;
  });
  fs.writeFileSync(file, src);
});
console.log(`적용 ${applied} · 실패 ${failed}`);
process.exit(failed ? 1 : 0);
