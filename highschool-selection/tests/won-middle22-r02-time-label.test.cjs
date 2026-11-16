'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
require('../data/available-mocks.js');
const exams=globalThis.HIGHSELECT_AVAILABLE_MOCKS;
const entry=fs.readFileSync(path.join(root,'public/exam-entry.js'),'utf8');
const promo=fs.readFileSync(path.join(root,'promo/index.html'),'utf8');
const entryTime=vm.runInNewContext('('+entry.match(/function timeLabel\(e\)\{[^\n]+\}/)[0]+')');
const promoTime=vm.runInNewContext('('+promo.match(/const mockTime=(.+);/)[1]+')');
test('entry and round cards distinguish R2 gap from R1 official rest',()=>{
 const old=exams.find(e=>e.id==='wm-middle22-basic-r01'),fresh=exams.find(e=>e.id==='wm-middle22-basic-mixed-r02');
 for(const format of [entryTime,promoTime]){
  assert.match(format(old),/휴식 10분/);
  assert.match(format(fresh),/총 160분/);assert.match(format(fresh),/대수 70분/);
  assert.match(format(fresh),/기하 70분/);assert.match(format(fresh),/교시 사이 20분/);
  assert.doesNotMatch(format(fresh),/휴식 20분/);
 }
});

test("entry script invalidates the previous timing formatter cache",()=>{
 const html=fs.readFileSync(path.join(root,"public/exam-entry.html"),"utf8");
 assert.match(html,/exams\/app\.js\?v=won-middle22-r02-20261116/);
});
