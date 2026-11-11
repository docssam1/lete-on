import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const window={};
vm.runInNewContext(readFileSync(new URL('./planner.js',import.meta.url),'utf8'),{window,console});
const P=window.Planner;
const opts={grade:3,mon:3,year:2026,school:12,schoolLeft:1,comp:4,compLeft:7,calc:9,calcLeft:1,speed:2,hw:'none',gifted:true,kmo:'switch'};
for(const band of ['A','B','C','D'])test(`${band}: gifted choice is kept without inventing admission dates`,()=>{
 const p=P.build({...opts,band});
 assert.equal(p.choices.gifted,true);
 assert.ok(p.rows.filter(r=>/^gift/.test(r.key)).every(r=>r.blocks.length===0));
 assert.ok(p.warn.some(x=>x.includes('공식 모집요강 확인 전')));
 assert.match(P.renderTable(p),/공식 모집요강 확인 전/);
 assert.ok(p.flags.every(x=>!String(x[1]).includes('영재원')));
 assert.ok(p.rows.flatMap(r=>r.blocks).every(b=>!/공동 온라인 선교육|사이버영재 접수/.test(b[0])));
 const off=P.build({...opts,band,gifted:false});
 assert.equal(off.choices.gifted,false);
 assert.ok(off.warn.every(x=>!x.includes('공식 모집요강 확인 전')));
 // This correction must not change the existing study schedule.
 for(const key of ['school','school2','comp','calc','sci'])assert.deepEqual(p.rows.find(r=>r.key===key),off.rows.find(r=>r.key===key));
});
test('monthly high-school chain uses current subjects without duplicated calculus I',()=>{
 const p=P.build({...opts,band:'A'}),names=p.rows.find(r=>r.key==='school').blocks.map(b=>b[0]);
 assert.ok(names.some(x=>x==='대수'));assert.ok(names.some(x=>x==='미적분Ⅰ'));
 assert.equal(names.filter(x=>x==='미적분Ⅰ').length,1);
 assert.ok(names.some(x=>x==='확률과 통계'));
 for(const band of ['A','B','C','D']){
  const p=P.build({...opts,band});
  assert.doesNotMatch(p.rows.filter(r=>['school','comp'].includes(r.key)).flatMap(r=>r.blocks).map(b=>b[0]).join('\n'),/수학\(상\)|수학\(하\)|수Ⅰ|수Ⅱ/);
 }
});
test('middle-school high-school preview stops at the 2028 CSAT subjects',()=>{
 // 2028 수능 수학은 대수·미적분Ⅰ·확률과 통계. 중등 동안 미적분Ⅱ·기하 선행을 잡지 않는다(영과고형 D는 별도 설계).
 for(const band of ['A','B','C'])for(const grade of [3,4,5]){
  const names=P.build({...opts,band,grade}).rows.find(r=>r.key==='school').blocks.map(b=>b[0]);
  assert.ok(names.every(x=>!/미적분Ⅱ|기하/.test(x)),`${band} 초${grade}: ${names.join(' / ')}`);
 }
 const a=P.build({...opts,band:'A'}).rows.find(r=>r.key==='school').blocks.map(b=>b[0]);
 assert.ok(a.includes('확률과 통계'));
 assert.ok(a.includes('수능 범위 심화 · 내신 · 진로 탐색'));
});
test('beyond-CSAT high-school preview is only an opt-in, marked not recommended',()=>{
 for(const band of ['A','B','C']){
  const base=P.build({...opts,band}),beyond=P.build({...opts,band,hiScope:'beyond'});
  const names=p=>p.rows.find(r=>r.key==='school').blocks.map(b=>b[0]);
  assert.ok(!names(base).some(x=>/미적분Ⅱ/.test(x)));
  const b=names(beyond),i=b.findIndex(x=>/미적분Ⅱ · 기하/.test(x));
  assert.ok(i>0,band+': '+b.join(' / '));assert.match(b[i],/비추천/);
  assert.ok(b.slice(0,i).some(x=>/확률과 통계/.test(x)),'확통 뒤에 둔다');
  assert.match(JSON.stringify(P.narrative(beyond)),/권하지 않지만/);
  assert.doesNotMatch(JSON.stringify(P.narrative(base)),/권하지 않지만/);
  // 영과고형은 별도 설계라 이 선택과 무관하다.
  assert.deepEqual(P.build({...opts,band:'D',hiScope:'beyond'}).rows,P.build({...opts,band:'D'}).rows);
 }
});
