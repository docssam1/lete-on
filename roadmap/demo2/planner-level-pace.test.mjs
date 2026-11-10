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
 const m=P.model(standard('L10',60),LEVELS,fields);
 assert.equal(m.rows.find(r=>r.id==='now').ends[2],null);
 assert.equal(typeof m.rows.find(r=>r.id==='up1').ends[2],'number');
 assert.match(P.render(standard('L10',60),fields),/기준표에 없음/);
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
