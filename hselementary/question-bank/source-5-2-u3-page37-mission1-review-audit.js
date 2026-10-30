'use strict';
const assert=require('node:assert/strict');
// The printed glyphs omit the upper bar of 6 and the lower bar of 9.
const glyph={'6':'cdefg','9':'abcfg','5':'acdfg','2':'abdeg'};
const turn={a:'d',b:'e',c:'f',d:'a',e:'b',f:'c',g:'g'};
const canonical=s=>[...s].sort().join('');
function rotate(d){const turned=canonical([...glyph[d]].map(s=>turn[s]).join(''));const result=Object.keys(glyph).filter(x=>canonical(glyph[x])===turned);assert.equal(result.length,1);return result[0];}
assert.equal(rotate('6'),'9');assert.equal(rotate('9'),'6');assert.equal(rotate('5'),'5');assert.equal(rotate('2'),'2');
const rotated=[...'6952'].reverse().map(rotate).join('');assert.equal(rotated,'2569');assert.equal(6952+Number(rotated),9521);
const row=require('./source-inventory/5-2-u3-e5-e8-readiness-review.json').items.find(x=>x.sourceItemId==='5-2-u3-e7-mission-1');assert.equal(row.independentAnswer,'9521');assert.equal(row.publicDecision,'locked');
console.log('37쪽 Mission 1: 원문 숫자 획 180° 대응·자리 역순 및 덧셈 후보 9521 검증');
