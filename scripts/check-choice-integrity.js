#!/usr/bin/env node
'use strict';
/* 보기 보정 뒤에 확인해야 하는 것들.
 *  - 한 문항 안에 같은 보기가 두 번 나오지 않는가 (보정 중 문장을 서로 닮게 쓰다 겹치기 쉽다)
 *  - 정답 letter가 여전히 유효하고 보기 개수와 맞는가
 *  - 세트별 정답 분포가 3/3/3/3인가 (보정기는 letter를 안 건드리므로 변하면 안 된다)
 *  - 빈 보기·앞뒤 공백이 없는가
 *   node scripts/check-choice-integrity.js rp1 rp2 ... */
const path = require('path');
const DATA = path.join(__dirname, '..', 'reading-world', 'data');
global.window = { LESSONS: {} };
const ids = process.argv.slice(2);
ids.forEach(id => { try { require(path.join(DATA, id + '.js')); } catch (e) { console.log(`! ${id} 로드 실패: ${e.message}`); } });
let bad = 0;
ids.forEach(id => {
  const L = global.window.LESSONS[id];
  if (!L) { console.log(`! ${id} 없음`); bad++; return; }
  [['추가 학습', L.extraLearning], ['유사 지문', L.newPassage]].forEach(([label, s]) => {
    if (!s || !s.questions) return;
    const dist = {};
    s.questions.forEach((q, i) => {
      const ch = (q[2] || []).map(String);
      const ai = 'ABCD'.indexOf(q[3]);
      const where = `${id}/${label} Q${i + 1}`;
      if (ai < 0 || ai >= ch.length) { console.log(`! ${where} 정답 letter ${q[3]} 가 보기 범위 밖`); bad++; }
      const seen = new Set();
      ch.forEach(c => {
        if (!c.trim()) { console.log(`! ${where} 빈 보기`); bad++; }
        if (c !== c.trim()) { console.log(`! ${where} 앞뒤 공백: "${c}"`); bad++; }
        const k = c.trim().toLowerCase();
        if (seen.has(k)) { console.log(`! ${where} 보기 중복: "${c}"`); bad++; }
        seen.add(k);
      });
      dist[q[3]] = (dist[q[3]] || 0) + 1;
    });
    const n = s.questions.length;
    if (n === 12) {
      const want = ['A', 'B', 'C', 'D'].every(k => dist[k] === 3);
      if (!want) { console.log(`! ${id}/${label} 분포 3/3/3/3 아님 — ${JSON.stringify(dist)}`); bad++; }
    }
  });
});
console.log(bad ? `문제 ${bad}건` : `${ids.length}개 레슨 이상 없음`);
process.exit(bad ? 1 : 0);
