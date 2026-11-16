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
 assert.match(html,/exams\/app\.js\?v=won-middle22-r04-20261116/);
});

test('third round uses the same confirmed clock window without changing the first two editions',()=>{
 const fresh=exams.find(e=>e.id==='wm-middle22-basic-mixed-r03');
 assert.equal(fresh.questionCount,50);
 assert.equal(fresh.durationMinutes,140);
 assert.deepEqual(fresh.sectionMinutes,{ALG:70,GEO:70});
 for(const format of [entryTime,promoTime]){
  assert.match(format(fresh),/총 160분/);
  assert.match(format(fresh),/교시 사이 20분/);
  assert.doesNotMatch(format(fresh),/휴식 20분/);
 }
 assert.equal(exams.find(e=>e.id==='wm-middle22-basic-r01').breakMinutes,10);
 assert.equal(exams.find(e=>e.id==='wm-middle22-basic-mixed-r02').pageCount,23);
});

test('fourth round keeps the confirmed clock window and its own protected document counts',()=>{
 const fresh=exams.find(e=>e.id==='wm-middle22-basic-mixed-r04');
 assert.equal(fresh.questionCount,50);
 assert.deepEqual([fresh.pageCount,fresh.answerPageCount,fresh.analysisPageCount],[22,26,5]);
 assert.deepEqual(fresh.sectionMinutes,{ALG:70,GEO:70});
 assert.equal(fresh.durationMinutes,140);
 assert.equal(fresh.totalWindowMinutes,160);
 for(const format of [entryTime,promoTime]){
  assert.match(format(fresh),/총 160분/);
  assert.match(format(fresh),/교시 사이 20분/);
  assert.doesNotMatch(format(fresh),/휴식 20분/);
 }
 assert.deepEqual(['wm-middle22-basic-r01','wm-middle22-basic-mixed-r02','wm-middle22-basic-mixed-r03'].map(id=>exams.find(e=>e.id===id).pageCount),[19,23,25]);
});
