import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const source=readFileSync(new URL('planner-ox-view.js',import.meta.url),'utf8');
const context={window:{}};
vm.runInNewContext(source.replace('Object.freeze({render, openQueue})','Object.freeze({render, openQueue, mathText, exerciseDiagram, exerciseBody})'),context);
const api=context.window.PlannerOxView;
const bank=JSON.parse(readFileSync(new URL('planner-ox-supplements.json',import.meta.url),'utf8'));
test('fraction output is stacked, accessible and still escapes untrusted markup',()=>{
 const html=api.mathText('<img src=x onerror=alert(1)> 5/36과 2과 1/3');
 assert.ok(html.includes('&lt;img'));assert.ok(!html.includes('<img'));
 assert.ok(html.includes('aria-label="36분의 5"'));assert.ok(html.includes('aria-label="3분의 1"'));
 assert.ok(!html.includes('5/36'));
});
test('all four visual reading exercises have whitelisted, accessible SVGs',()=>{
 let count=0;
 for(const [uid,qs] of Object.entries(bank.units))for(const exercise of qs){
  if(!exercise.diagram)continue;
  count++;const html=api.exerciseBody({id:uid,exercise});
  assert.ok(html.includes('<svg'));assert.ok(html.includes('role="img"'));assert.ok(html.includes('aria-label='));
 }
 assert.equal(count,4);assert.equal(api.exerciseDiagram('<script>alert(1)</script>'),'');
});
test('diagram values preserve the existing mathematical answers',()=>{
 const cases=[['didimdol22-2-1-u6','t06','3×4＝12'],['didimdol22-4-1-u5','t09','4명'],['didimdol22-6-1-u5','t07','A반 5명, B반 6명'],['didimdol22-6-1-u2','t08','삼각기둥']];
 for(const [uid,type,answer]of cases)assert.ok(bank.units[uid].find(q=>q.typeId===type).check.includes(answer));
 assert.ok(api.exerciseDiagram('library-bars').includes('화요일 32명'));
 assert.ok(api.exerciseDiagram('reading-pies').includes('독서부 20%'));
});
