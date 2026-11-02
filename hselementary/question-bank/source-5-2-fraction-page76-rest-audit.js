'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-fraction-page76-practice.js');assert.equal((480-480*2/3)/4,40);assert.equal((380-380*2/5)*2/3,152);
const fast=7*24*3/2,slow=14*(60+11*60/15);assert.equal(fast,252);assert.equal(slow,1456);
const clock=sec=>{sec=(sec+86400)%86400;return [Math.floor(sec/3600),Math.floor(sec%3600/60),sec%60]};assert.deepEqual(clock(12*3600+fast),[12,4,12]);assert.deepEqual(clock(12*3600-slow),[11,35,44]);assert.equal(api.build(15).automaticGrading,false);assert.equal(api.build(16).automaticGrading,false);console.log('PASS: fraction remainders and clock offsets down to seconds');
