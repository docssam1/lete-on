import test from 'node:test';
import assert from 'node:assert/strict';
import {exportGrade5} from './export-grade5.mjs';
for(const winter of ['calculation','review'])for(const academy of ['summer','afterFinish'])for(const scienceMode of ['academy','home']){
 test(`Typst data equals the screen report: ${winter}/${academy}/${scienceMode}`,()=>{
  const state={version:1,id:'grade5-application-middle',winter,academy,scienceMode},before=JSON.stringify(state),d=exportGrade5(state);
  assert.equal(JSON.stringify(state),before);assert.equal(d.plan.months.length,45);assert.equal(d.report.lanes.length,9);
  for(const row of d.plan.lanes){
   const printed=d.report.lanes.find(l=>l.id===row.id);assert.ok(printed);
   assert.deepEqual(printed.blocks.map(b=>[b.id,b.start,b.end,b.book]),row.blocks.map(b=>[b.id,b.start,b.end,b.book]));
  }
  assert.deepEqual(d.calendar.flatMap(h=>h.months).map(m=>m.index),Array.from({length:45},(_,i)=>i));
  for(const half of d.calendar)for(const row of half.rows){
   assert.equal(row.cells.reduce((n,c)=>n+c.span,0),half.end-half.start);
   let month=half.start;
   for(const cell of row.cells)for(let n=0;n<cell.span;n++,month++){
    const active=d.plan.lanes.find(l=>l.id===row.id).blocks.filter(b=>b.start<month+1&&b.end>month);
    for(const b of active)assert.ok(cell.text.includes(b.title),`${row.id} month ${month}: ${b.title}`);
   }
  }
  const thinking=d.plan.lanes.find(l=>l.id==='thinking').blocks.find(b=>b.kind==='thinking');
  assert.equal(thinking.start,2);assert.equal(thinking.end,8);
  assert.ok(d.report.front.prose.join(' ').includes(d.plan.classPlan.science.label));
  assert.match(d.report.front.prose.join(' '),academy==='summer'?/9월 대형학원/:/12월 대형학원/);
  assert.match(d.graph,/^<svg\b[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);assert.match(d.graph,/font-family="Pretendard Variable"/);
 });
}
