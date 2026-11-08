'use strict';
const assert=require('node:assert/strict');
const bank=require('./source-5-2-u5-grid-sizes-similar.js');
assert.equal(bank.build(-1),null);assert.equal(bank.build(4),null);
for(let i=0;i<bank.cases.length;i++){const [w,d,h]=bank.cases[i],seen=new Set();for(let x1=0;x1<w;x1++)for(let x2=x1+1;x2<=w;x2++)for(let y1=0;y1<d;y1++)for(let y2=y1+1;y2<=d;y2++)for(let z1=0;z1<h;z1++)for(let z2=z1+1;z2<=h;z2++)seen.add(`${x2-x1},${y2-y1},${z2-z1}`);const q=bank.build(i);assert.equal(Number(q.answer),seen.size);assert.equal(q.publisherKeyVerified,false);assert.match(q.prompt,/위치만 다르고 세 방향의 길이가 같으면 같은 크기/);assert.match(q.prompt,/정육면체도 직육면체에 포함/);}
console.log('PASS: distinct directional sizes independently enumerated from all grid-aligned boxes');
