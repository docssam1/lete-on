import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const window={},ctx=vm.createContext({window});
vm.runInContext(readFileSync(new URL('planner-high-study.js',import.meta.url),'utf8'),ctx);
const H=window.PlannerHighStudy,plain=v=>JSON.parse(JSON.stringify(v));
const actual=(stage='공통수학1',extra={})=>({stage,book:'기본정석',fraction:0,done:false,...extra});
const input=extra=>({schoolLane:{id:'school',blocks:[]},deepLane:{id:'deep',blocks:[]},actualSchool:actual(),...extra});

test('basic and type practice share one subject block; prior depth overlaps the next subject',()=>{
 const m=H.apply(input()),school=m.schoolLane.blocks,deep=m.deepLane.blocks;
 assert.deepEqual(plain(school[0].books),['기본정석','쎈 고등']);
 assert.equal(school.filter(b=>b.stage==='공통수학1').length,1);
 assert.deepEqual(plain(school.slice(0,2).map(b=>[b.start,b.end])),[[0,6],[6,12]]);
 assert.equal(deep[0].stage,'공통수학1');assert.equal(deep[0].start,school[1].start);
 assert.equal(m.readyAt['공통수학1'],6);
});
test('finishing only the concept book retains same-subject application before moving on',()=>{
 const m=H.apply(input({actualSchool:actual('공통수학1',{done:true})}));
 const b=m.schoolLane.blocks[0];assert.equal(b.stage,'공통수학1');assert.equal(b.applicationOnly,true);
 assert.equal(b.conceptFraction,1);assert.equal(b.applicationFraction,0);assert.equal(b.end,6);
 assert.match(b.title,/쎈.*유형 보완/);assert.ok(m.warnings.some(t=>t.includes('개념 교재 완료만으로')));
});
test('explicitly completing both books starts the next subject and current-subject depth now',()=>{
 const m=H.apply(input({actualSchool:actual('대수',{done:true}),state:{subjects:{대수:{book:'쎈 고등',status:'done'}}}}));
 assert.equal(m.schoolLane.blocks[0].stage,'미적분Ⅰ');assert.equal(m.schoolLane.blocks[0].start,0);
 assert.equal(m.deepLane.blocks[0].stage,'대수');assert.equal(m.deepLane.blocks[0].start,0);
 assert.equal(m.readyAt.대수,0);assert.ok(!m.deepLane.blocks.some(b=>b.stage==='공통수학1'));
});
test('the slower of concept and application remaining work controls the next subject date',()=>{
 const m=H.apply(input({actualSchool:actual('공통수학1',{fraction:.75}),state:{subjects:{공통수학1:{book:'쎈 고등',status:'progress',done:1,total:2}}}}));
 assert.equal(m.schoolLane.blocks[0].end,3);assert.equal(m.schoolLane.blocks[1].start,3);
 assert.equal(m.deepLane.blocks[0].start,3);
 const unknown=H.apply(input({actualSchool:actual('공통수학1',{fraction:.75})}));
 assert.equal(unknown.schoolLane.blocks[0].end,6);
});
test('reported same-subject SSEN in the depth input contributes application without duplicate work',()=>{
 const m=H.apply(input({actualSchool:actual('공통수학1',{done:true}),actualDeep:actual('공통수학1',{book:'쎈 고등',fraction:.5})}));
 assert.equal(m.schoolLane.blocks[0].applicationFraction,.5);assert.equal(m.schoolLane.blocks[0].end,3);
 assert.equal(m.deepLane.blocks[0].start,3);assert.equal(m.deepLane.blocks[0].current,false);
 assert.ok(!m.deepLane.blocks.some(b=>b.current&&b.books.includes('쎈 고등')));
});
test('reported advanced depth retains its actual remaining time and later depth waits for subject basics',()=>{
 const current={id:'old',stage:'대수',title:'대수 고쟁이',start:0,end:3,current:true,custom:'keep'};
 const m=H.apply(input({actualSchool:actual('미적분Ⅰ'),actualDeep:actual('대수',{book:'고쟁이',fraction:.5}),deepLane:{id:'deep',blocks:[current]}}));
 const [first,next]=m.deepLane.blocks;assert.equal(first.stage,'대수');assert.equal(first.end,3);assert.equal(first.custom,'keep');
 assert.equal(next.stage,'미적분Ⅰ');assert.equal(next.start,6);
 assert.ok(!m.schoolLane.blocks.some(b=>b.stage==='공통수학1'));
});
test('a reported earlier-subject type workbook is retained without restarting that subject concept course',()=>{
 const m=H.apply(input({actualSchool:actual('공통수학2'),actualDeep:actual('공통수학1',{book:'쎈 고등',fraction:.5})}));
 assert.equal(m.schoolLane.blocks[0].stage,'공통수학2');assert.equal(m.schoolLane.blocks[0].start,0);
 const first=m.deepLane.blocks[0];assert.equal(first.stage,'공통수학1');assert.equal(first.highPhase,'application-review');assert.equal(first.end,3);
 assert.equal(m.readyAt['공통수학1'],3);assert.equal(m.deepLane.blocks[1].stage,'공통수학1');assert.equal(m.deepLane.blocks[1].start,3);
});
test('a current type workbook does not claim that concept mastery was verified',()=>{
 const m=H.apply(input({actualSchool:actual('공통수학1',{book:'쎈 고등',fraction:.5})}));
 assert.equal(m.schoolLane.blocks[0].end,3);assert.ok(m.warnings.some(t=>t.includes('개념 교재의 이수 여부')));
});
test('an explicit different type book uses its own progress without copying the previous workbook completion',()=>{
 const m=H.apply(input({actualSchool:actual('공통수학2'),actualDeep:actual('공통수학1',{book:'쎈 고등',done:true}),state:{subjects:{공통수학1:{book:'RPM 고등',status:'none'}}}}));
 assert.equal(m.deepLane.blocks[0].books[0],'RPM 고등');assert.equal(m.deepLane.blocks[0].end,6);assert.equal(m.readyAt['공통수학1'],6);
});
test('basic or unclassified Jeongseok in depth is preserved for review, not treated as completed depth',()=>{
 for(const book of ['기본정석','수학의 정석']){
  const m=H.apply(input({actualDeep:actual('공통수학1',{book,fraction:.5})}));
  const review=m.deepLane.blocks.find(b=>b.needsDepthReview);assert.equal(review.books[0],book);assert.equal(review.highPhase,'concept-review');
  assert.ok(m.deepLane.blocks.some(b=>b.stage==='공통수학1'&&b.highPhase==='deep'&&b.start>=6));
  assert.ok(m.warnings.some(t=>t.includes('심화 완료로 판단하지')));
 }
});
test('middle depth is retained and high depth waits for its lane while high basics keep their own schedule',()=>{
 const middle={id:'mid-depth',stage:'중3-2',start:0,end:10,title:'중3-2 A급'};
 const m=H.apply(input({actualSchool:actual('중3-2'),highStart:3,actualDeep:actual('중3-2',{book:'A급'}),deepLane:{id:'deep',blocks:[middle]}}));
 assert.equal(m.schoolLane.blocks[0].start,3);assert.equal(m.schoolLane.blocks[0].end,9);
 assert.deepEqual(plain(m.deepLane.blocks[0]),middle);assert.equal(m.deepLane.blocks[1].start,10);
});
test('no known high entry creates no invented course; clipped blocks cannot appear complete',()=>{
 const missing=H.apply(input({actualSchool:null}));assert.equal(missing.schoolLane.blocks.length,0);assert.equal(missing.deepLane.blocks.length,0);
 const m=H.apply(input({limit:8})),second=m.schoolLane.blocks[1];assert.equal(second.end,8);assert.equal(second.unclippedEnd,12);assert.equal(second.endClipped,true);assert.equal(second.continues,true);
 assert.equal(m.readyAt['공통수학2'],12);
});
test('restoration and validated updates preserve data and reject completion disguised as progress',()=>{
 const source=input({state:{version:1,subjects:{공통수학1:{book:'RPM 고등',status:'progress',done:1,total:4}},deepMonths:4}}),snapshot=JSON.stringify(source);
 const m=H.apply(source);assert.equal(JSON.stringify(source),snapshot);assert.equal(m.deepLane.blocks[0].full,4);
 assert.ok(H.updateRecord(source.state,'공통수학1',{book:'쎈 고등',status:'progress',done:4,total:4}).errors.length);
 assert.ok(H.updateRecord(source.state,'공통수학1',{book:'쎈 고등',status:'progress',done:-1,total:4}).errors.length);
 assert.equal(H.updateRecord(source.state,'공통수학1',{book:'쎈 고등',status:'done'}).state.subjects['공통수학1'].status,'done');
 assert.deepEqual(plain(H.restore({subjects:{공통수학1:{book:'쎈 고등',status:'unknown',done:99,total:100}}})),{version:1,subjects:{공통수학1:{book:'쎈 고등',status:'unknown'}}});
 assert.equal(H.updateRecord(null,'공통수학1',{book:'쎈 고등',status:'none'}).state.subjects['공통수학1'].status,'none');
 assert.ok(H.updateRecord(null,'공통수학1',{book:'쎈 고등',status:'progress',done:1,total:10000}).errors.length);
 assert.equal(H.restore({deepMonths:.25}).deepMonths,undefined);assert.equal(H.restore({deepMonths:25}).deepMonths,undefined);assert.equal(H.restore({deepMonths:.5}).deepMonths,.5);
});
