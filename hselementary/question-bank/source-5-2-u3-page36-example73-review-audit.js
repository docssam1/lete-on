'use strict';
const assert=require('node:assert/strict');
// Cell coordinates: left-top=(0,0), center O=(3,1.5), y increases down.
const source=[{cell:[0,0],letter:'ㄹ'},{cell:[0,1],letter:'ㄷ'},{cell:[1,1],letter:'ㄴ'},{cell:[2,1],letter:'ㄱ'}];
const rotate=([x,y])=>[6-x,3-y];
const target=source.map(({cell:[x,y],letter})=>({cell:[5-x,2-y],letter}));
assert.deepEqual(target.map(x=>x.cell),[[5,2],[5,1],[4,1],[3,1]]);
for(let i=0;i<source.length;i++){const [x,y]=source[i].cell,[u,v]=target[i].cell;assert.deepEqual(rotate([x,y]),[u+1,v+1]);assert.deepEqual(rotate([x+1,y+1]),[u,v]);}
// Stroke centerlines in local unit-cell coordinates, matching the pictured forms.
const strokes={'ㄱ':[[0,0],[1,0],[1,1]],'ㄴ':[[0,0],[0,1],[1,1]],'ㄷ':[[1,0],[0,0],[0,1],[1,1]],'ㄹ':[[0,0],[1,0],[1,.5],[0,.5],[0,1],[1,1]]};
const turnLocal=p=>[1-p[0],1-p[1]],normalize=p=>JSON.stringify(p),reverse=p=>[...p].reverse();
assert.equal(normalize(strokes['ㄱ'].map(turnLocal)),normalize(reverse(strokes['ㄴ'])));
assert.equal(normalize(strokes['ㄹ'].map(turnLocal)),normalize(reverse(strokes['ㄹ'])));
assert.deepEqual(strokes['ㄷ'].map(turnLocal),[[0,1],[1,1],[1,0],[0,0]]);
const row=require('./source-inventory/5-2-u3-e5-e8-readiness-review.json').items.find(x=>x.sourceItemId==='5-2-u3-e7-example-7-3');assert.equal(row.publicDecision,'locked');assert.match(row.independentAnswer,/획/);assert.match(row.independentCalculation,/ㄷ은 왼쪽으로 열린/);
console.log('36쪽 예제 7-3: 원문 네 칸 위치·중심·고정 글자 획의 반 바퀴 회전 검증');
