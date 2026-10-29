"use strict";
const assert=require('node:assert/strict'), source=require('./source-5-2-u4-page43-mission3.js');
assert.equal(source.pools.length,3);
for(let i=0;i<3;i++)for(const difficulty of [-1,0,1]) {
  const p=source.pools[i],q=source.build(i,difficulty),a=q.answerModel;
  const seconds=a.hours*3600+a.minutes*60+a.seconds;
  assert.equal(seconds*100,p.dayHundredths*24*60*60);
  assert(a.minutes>=0&&a.minutes<60&&a.seconds>=0&&a.seconds<60);
  assert.equal(q.answer,['1시간 26분 24초','2시간 9분 36초','3시간 7분 12초'][i]);
  assert.equal(q.variantProvenance,'synthetic-source-structure');assert.equal(q.publisherKeyVerified,false);
}
console.log('Mission 3: day, hour, minute and second conversions verified');
