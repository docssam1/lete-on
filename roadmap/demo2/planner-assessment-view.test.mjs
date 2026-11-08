import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';

const count=(eligible,independent,submitted)=>({eligible,independent,submitted});
const row={id:'a',date:'2026-11-01',track:'curriculum',semester:'2-1',unitId:'1',unitTitle:'수 <비교>'};
const attempts=[row,{...row,id:'b',track:'thinking',semester:'도형',unitTitle:'도형'}];
function view(points,chosen,input=attempts) {
  let args;
  const context={window:{PlannerAssessmentTrend:{build(options){args=options;return {points};}}}};
  runInNewContext(readFileSync(new URL('./planner-assessment-view.js',import.meta.url),'utf8'),context);
  const html=context.window.PlannerAssessmentView.markup({attempts:input,day:'2026-11-08'},chosen);
  return {html,args};
}
const points=[
  {date:'2026-11-02',initial:count(5,3,4),recheck:count(0,0,0)},
  {date:'2026-11-08',initial:count(8,4,7),recheck:count(2,1,2)}
];
test('distinct cumulative results display rates, denominators and dates in both chart and table',()=>{
  const {html}=view(points);
  assert.match(html,/50%/);assert.match(html,/4 \/ 8문항/);assert.match(html,/1 \/ 2문항/);
  assert.match(html,/수 &lt;비교&gt;/);assert.ok(!html.includes('수 <비교>'));
  assert.match(html,/data-assessment-series="initial" d="M0.000,40.000 L100.000,50.000"/);
  assert.match(html,/data-assessment-series="recheck" d="M100.000,50.000"/);
  assert.equal((html.match(/data-at-date="2026-11-02"/g)||[]).length,1);
  assert.match(html,/data-assessment-table/);assert.match(html,/2026\.11\.02/);
});
test('one isolated observation, zero and unavailable have distinct representations',()=>{
  const {html}=view([{date:'2026-11-08',initial:count(1,0,0),recheck:count(0,0,0)}]);
  assert.match(html,/M50.000,100.000/);assert.match(html,/0 \/ 1문항/);
  assert.doesNotMatch(html,/data-assessment-series="recheck"/);assert.match(html,/평가 전/);
  const empty=view([]).html;assert.match(empty,/집계할 문항이 없어요/);assert.doesNotMatch(empty,/<svg/);
});
test('dependent filters disambiguate units from different tracks and semesters',()=>{
  const option=JSON.stringify(['thinking','도형','','1']);let {args,html}=view(points,{unit:option,metric:'submitted'});
  assert.equal(args.track,'thinking');assert.equal(args.semester,'도형');assert.equal(args.unitId,'1');assert.equal(args.bookId,'');
  assert.match(html,/87.5%/);assert.match(html,/7 \/ 8문항/);
  ({args}=view(points,{track:'curriculum',semester:'2-1',unit:option}));assert.equal(args.track,'curriculum');assert.equal(args.unitId,undefined);
  const counts=view(points,{metric:'count'}).html;assert.match(counts,/4문항<\/dd>/);assert.match(counts,/<span>0<\/span>/);
});

test('same-named unit scopes are visibly identified by volume',()=>{
  const pair=[{...row,bookId:'기본편'},{...row,bookId:'응용편'}];
  const chosen={unit:JSON.stringify(['curriculum','2-1','기본편','1'])};
  const {args,html}=view(points,chosen,pair);
  assert.equal(args.bookId,'기본편');
  assert.match(html,/수 &lt;비교&gt; · 응용편/);
});

test('O/X paper coverage displays recorded paper numbers; rechecks without an assigned denominator only display recorded count',()=>{
  const initial={...count(2,1,2),paper:{eligible:25,submitted:2}};
  const recheck={...count(1,1,1),recordedOnly:true};
  const points=[{date:'2026-11-08',initial,recheck}];
  const submitted=view(points,{metric:'submitted'}).html;
  assert.match(submitted,/8%/);assert.match(submitted,/2 \/ 25문항/);assert.match(submitted,/세트 기록률/);
  assert.match(submitted,/1문항 기록/);assert.doesNotMatch(submitted,/data-assessment-series="recheck"/);
  const independent=view(points,{metric:'independent'}).html;
  assert.match(independent,/50%/);assert.match(independent,/1 \/ 2문항/);
  assert.match(independent,/data-assessment-series="recheck"/);
});
