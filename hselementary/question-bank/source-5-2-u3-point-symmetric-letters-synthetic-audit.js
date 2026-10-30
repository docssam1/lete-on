'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-point-symmetric-letters-synthetic.js');
const turn=([x,y])=>[390-x,215-y];
for(let i=0;i<3;i++)for(const level of [-1,0,1]){const q=api.makeQuestion(i,level),m=q.answerModel;assert.equal(new Set(m.letters).size,4);for(const [x,y] of m.cells){for(const [u,v] of [[0,0],[55,0],[55,55],[0,55]]){const p=[30+x*55+u,25+y*55+v],r=turn(p);assert.deepEqual(turn(r),p);assert.ok(r[0]>=0&&r[0]<=390&&r[1]>=0&&r[1]<=230);}}for(const d of m.letters)assert.ok(api.paths[d]);assert.equal(q.automaticGrading,false);assert.doesNotMatch(q.prompt,/data-letter-answer/);assert.match(q.answerVisual,/rotate\(180 195 107.5\)/);}
console.log('글자 회전 감사: 세 배열·세 난이도, 칸 꼭짓점 대응·고정 획·그리기 답 분리 검증');
