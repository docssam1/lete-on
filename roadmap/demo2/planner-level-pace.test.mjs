import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const read=f=>readFileSync(new URL(f,import.meta.url),'utf8');
const w={},cx=vm.createContext({window:w});
for(const f of ['planner-levels.js','planner-level-pace.js'])vm.runInContext(read(f),cx,{filename:f});
const P=w.PlannerLevelPace,LEVELS=w.PLANNER_LEVELS;
const level=id=>LEVELS.find(l=>l.id===id);
const end=(id,re)=>level(id).school.find(b=>re.test(b[0]))[2];
// 표준 계획이 넘겨주는 값만 흉내 낸다: 기준 레벨, 지금 위치(now), 교과 기준점(anchor).
const standard=(id,now,anchor=now,source='level-table')=>({level:id,now,lanes:[{id:'school',source,anchor}]});
const fields={year:'2026',mon:'11'};

test('rows come from the level table: one level up finishes each course earlier by the table shift',()=>{
 const now=40,m=P.model(standard('L2',now),LEVELS,fields);
 assert.equal(m.rows.map(r=>r.id).join(),'up2,up1,now,down1');
 assert.equal(m.rows.map(r=>r.level).join(),'L0,L1,L2,L3');
 const row=id=>m.rows.find(r=>r.id===id);
 assert.equal(row('now').ends[0],end('L2',/^6-2/)+1-now);
 assert.equal(row('up1').ends[1],end('L1',/^중3-2/)+1-now);
 assert.equal(row('up1').delta,level('L2').shift-level('L1').shift);
 assert.equal(row('down1').delta,level('L2').shift-level('L3').shift);
 assert.equal(row('now').delta,null);
});

test('the current plan is measured from the real study position, other rows from the same grade and month',()=>{
 const m=P.model(standard('L2',40,38),LEVELS,fields),row=id=>m.rows.find(r=>r.id===id);
 assert.equal(row('now').ends[0],end('L2',/^6-2/)+1-38);
 assert.equal(row('up1').ends[0],end('L1',/^6-2/)+1-40);
});

test('top and bottom of the table: missing neighbours are left out, not invented',()=>{
 assert.equal(P.model(standard('L0',40),LEVELS,fields).rows.map(r=>r.id).join(),'now,down1');
 assert.equal(P.model(standard('L13',60),LEVELS,fields).rows.map(r=>r.id).join(),'up2,up1,now');
});

test('a table without common math keeps null instead of a made-up date',()=>{
 // 실제 레벨표는 모두 공통수학까지 있으므로, 공통수학이 빠진 표를 따로 만들어 확인한다.
 const cut=LEVELS.map(l=>l.id==='L10'?{...l,school:l.school.filter(b=>!/^공통수학|^진로/.test(b[0]))}:l);
 const m=P.model(standard('L10',60),cut,fields);
 assert.equal(m.rows.find(r=>r.id==='now').ends[2],null);
 assert.equal(typeof m.rows.find(r=>r.id==='up1').ends[2],'number');
});

test('every level in the real table reaches common math, in order after middle school',()=>{
 for(const l of LEVELS){
  const at=re=>l.school.findIndex(b=>re.test(b[0]));
  assert.ok(at(/^중3-2/)>=0&&at(/^공통수학1/)===at(/^중3-2/)+1&&at(/^공통수학2/)===at(/^공통수학1/)+1,l.id);
  assert.equal(l.school[at(/^공통수학1/)][1],l.school[at(/^중3-2/)][2]+1,l.id);
 }
 assert.doesNotMatch(P.render(standard('L13',94,91.5),fields),/기준표에 없음/);
});

test('no chart when the plan is not anchored to the level table',()=>{
 assert.equal(P.model(standard('L2',40,40,'current-profile'),LEVELS,fields),null);
 assert.equal(P.model(standard(null,40),LEVELS,fields),null);
 assert.equal(P.model(standard('L2',NaN),LEVELS,fields),null);
 assert.equal(P.render(standard(null,40),fields),'');
});

test('end labels are calendar months counted from the intake month',()=>{
 const now=40,html=P.render(standard('L2',now),fields),months=end('L2',/^6-2/)+1-now;
 const i=10+months-1,label=`${2026+Math.floor(i/12)}.${i%12+1}`;
 assert.ok(html.includes('>'+label+'</span>'),label);
 assert.ok(html.includes('class="bar is-now"'));
 assert.ok(!/합격 가능|도달 가능/.test(html));
});

test('Premier, Fields S and Challenge tables are named as the standard roadmap of passers',()=>{
 const html=P.render(standard('L3',40),fields);
 assert.match(html,/필즈 S 합격생의 표준 로드맵/);
 assert.match(html,/챌린지 합격생의 표준 로드맵/);
 assert.match(P.render(standard('L1',40),fields),/프리미어 합격생의 표준 로드맵/);
 assert.match(P.render(standard('L8',60),fields),/L7 기준표/);
});

test('each row names its level and what it studies now, and the table puts the last book under each end month',()=>{
 const now=60,m=P.model(standard('L7',now),LEVELS,fields),row=m.rows.find(r=>r.id==='up1');
 assert.equal(row.level,'L6');assert.equal(row.summary,level('L6').summary);
 assert.deepEqual(Array.from(row.books),['6-2 디딤돌 응용','중3-2 원리해설','공통수학2']);
 const at=(rows,t)=>rows.find(b=>t>=b[1]&&t<b[2]+1)[0];
 assert.equal(row.doing.school,at(level('L6').school,now));assert.equal(row.doing.comp,at(level('L6').comp,now));
 const html=P.render(standard('L7',now),fields);
 assert.match(html,/한 레벨 위/);assert.doesNotMatch(html,/단계 위|단계 아래/);
 assert.ok(html.includes('class="lv">L6 · '+level('L6').summary));
 const months=end('L7',/^중3-2/)+1-now,i=10+months-1;
 assert.ok(html.includes(`<div class="cell c1 is-now"><b>${2026+Math.floor(i/12)}.${i%12+1}</b><small>중3-2 원리해설</small></div>`));
});

test('KMO follows common math 2 directly; algebra and calculus 1 are not rows but vacation study',()=>{
 for(const l of LEVELS){
  const i=l.school.findIndex(b=>b[0]==='공통수학2'),next=l.school[i+1];
  assert.equal(next[0],'진로: KMO 입문 또는 이과 상위권',l.id);
  assert.equal(next[1],l.school[i][2]+1,l.id);
  assert.ok(!l.school.some(b=>/^대수$|^미적분Ⅰ/.test(b[0])),l.id);
 }
 const now=60,m=P.model(standard('L7',now),LEVELS,fields),row=m.rows.find(r=>r.id==='now');
 assert.equal(row.ends.length,3);assert.equal(row.after,'KMO 입문 또는 이과 상위권');
 const html=P.render(standard('L7',now),fields),months=end('L7',/^공통수학2/)+1-now,ym=k=>{const i=10+k;return`${2026+Math.floor(i/12)}.${i%12+1}`;};
 assert.ok(html.includes(`<div class="cell c3 fork is-now"><b>${ym(months)}부터</b>`));
 assert.ok(html.includes(`<i>이과 상위권</i>대수 → 미적분Ⅰ을 바로 이어서<span>대수 ${ym(months+2)}까지 · 미적분Ⅰ ${ym(months+5)}까지</span>`));
 assert.ok(html.includes('<i>영과고 · KMO</i>KMO 준비. 대수 · 미적분Ⅰ 선행은 쉬는 구간과 방학에<span><em>1차 시험 뒤 발표 전 (5월 중순~6월 중순)</em> 대수 시작</span><span><em>1차에 떨어졌을 때</em> 대수 · 미적분Ⅰ을 이어서. 다음 해 1차 재도전 또는 고등 선행으로 전환</span><span><em>1차에 붙었을 때</em> 2차 준비(11월). 선행은 2차 뒤 겨울방학에</span>'));
 assert.match(html,/class="head c3">공통수학2 뒤/);
 assert.match(html,/1차 시험이 5월 중순 토요일, 1차 발표가 30일 뒤인 6월 중순, 2차 시험이 11월 초·중순/);
});
