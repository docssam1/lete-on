'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-range-page68-practice.js');
for(const [x,expected] of [[9.99,false],[10,true],[23.99,true],[24,false]])assert.equal(18*x/2>=90&&18*x/2<216,expected);
const end=[];for(let x=30;x<=200;x++){let count=0;for(let i=30;i<=x;i++)if(i%4===0)count++;if(count===35)end.push(x)}
assert.deepEqual(end,[168,169,170,171]);
const candidates=[];for(let n=20001;n<50000;n++){const d=String(n).split('').map(Number);if(d[0]>=4&&d[1]<1&&d[3]<1&&d[2]+d[4]===18)candidates.push(n)}
assert.deepEqual(candidates,[40909]);assert.equal(api.build(15).answer,String(candidates[0]));
const students=[];for(let n=1;n<400;n++)if(Math.ceil(n/4)===61&&Math.ceil(n/6)===41)students.push(n);
assert.deepEqual(students,[241,242,243,244]);assert.equal(api.build(16).answer,students.join(', ')+'명');
for(const n of [10,14,15,16]){const q=api.build(n);assert.equal(q.sourcePdfPage,65);assert.equal(q.sourcePrintedPage,69)}
console.log('PASS: inverse boundaries, multiples, digit constraints, seating intersection');
