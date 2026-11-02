import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const c={window:{},console,URL};vm.createContext(c);
for(const f of ['planner-levels.js','planner.js','demo-content.js','planner-intake.js','planner-progression.js','planner-standard.js','planner-academy-data.js','planner-direct-links.js','planner-counselling-updates.js','planner-report.js','planner-classroom-example.js'])vm.runInContext(readFileSync(new URL(f,import.meta.url),'utf8'),c);
const V=c.window.PlannerClassroomExample,plain=v=>JSON.parse(JSON.stringify(v));
test('confirmed units, completed upper book and completed calculation do not become half-progress defaults',()=>{
 const m=V.model();assert.equal(m.facts.schoolFraction,1/3);assert.match(m.facts.school,/2단원 완료/);assert.equal(m.facts.thinking,'필즈 베이직 상권 완료');assert.equal(m.lanes[1].blocks[0].initialFraction,1/3);assert.equal(m.lanes[2].blocks[0].title,'기적의 계산법 4권');assert.equal(m.lanes[2].blocks[0].studyDays,50);assert.equal(m.lanes[2].blocks[0].weeks,10);assert.equal(m.facts.english,'SR GE 3점대 초반');
});
test('all planned subjects cover the horizon and transitions have no artificial empty months',()=>{
 for(const l of V.model().lanes){assert.equal(l.blocks[0].start,0);for(let i=1;i<l.blocks.length;i++)assert.ok(Math.abs(l.blocks[i].start-l.blocks[i-1].end)<1e-8,l.id);assert.ok(l.blocks.at(-1).end>=14,l.id);}assert.equal(V.date(0).label,'2026년 6세 11월');assert.equal(V.date(13).label,'2027년 7세 12월');
});
test('E1 reference is the supplied E1 course, not S; calculations stay separate',()=>{
 const source=JSON.stringify(c.window.PLANNER_ACADEMY_ROADMAPS),m=V.model(),e=m.references.find(x=>x.id==='fields-e1');assert.equal(e.tracks[0].blocks[0].title,'더클래식 1과정');assert.equal(e.tracks[0].blocks[0].start,2);assert.equal(e.tracks[0].blocks[0].end,20);const intro=e.tracks[1].blocks[0],skill=e.tracks[1].blocks[1];assert.equal(intro.end-intro.start,6);assert.equal(skill.end-skill.start,7);assert.equal(skill.end,15);assert.equal(m.references.find(x=>x.id==='soma').tracks[0].blocks[0].end,12);assert.equal(m.lanes[2].blocks[0].title,'기적의 계산법 4권');V.choose(m.state,'fields');assert.equal(JSON.stringify(c.window.PLANNER_ACADEMY_ROADMAPS),source);
});
test('comparison controls restore only known values and never remove own study lanes',()=>{
 const initial=V.restore(null),hidden=V.choose(initial,'fields');assert.equal(initial.fields,true);assert.equal(hidden.fields,false);assert.equal(V.model(hidden).references.length,1);assert.equal(V.model(hidden).lanes.length,4);assert.deepEqual(plain(V.restore({axis:'bad',month:999,soma:false,fields:false,student:'private'})),{version:1,axis:'thinking',soma:false,fields:false,month:0});assert.equal(V.choose(initial,'month','13').month,13);
});
test('direct class link is anonymous and rejects mixed or duplicated routes',()=>{
 const L=c.window.PlannerDirectLinks,base='https://example.com/roadmap/demo2/planner.html?name=private#x',href=L.classroomHref(base);assert.equal(href,'https://example.com/roadmap/demo2/planner.html?classroom=gfield-6-national2');assert.equal(L.resolve(href).kind,'classroom');for(const query of ['classroom=other','classroom=gfield-6-national2&classroom=gfield-6-national2','classroom=gfield-6-national2&study=grade5-balanced','classroom=gfield-6-national2&senior=premier-cohort'])assert.equal(L.resolve('https://example.com/planner.html?'+query),null);
});

test('printed report keeps confirmed facts and marks the unfinished seven-month skill course as partial',()=>{
 const r=V.reportModel(null);assert.equal(r.name,V.TITLE);assert.ok(r.front.prose.join(' ').includes('2단원 완료'));assert.ok(r.front.prose.join(' ').includes('SR GE 3점대 초반'));assert.equal(r.front.checkpoints[0].date,'2026년 6세 12월');const skill=r.lanes[0].blocks.at(-1);assert.equal(skill.end,14);assert.equal(skill.partial,true);assert.match(skill.endLabel,/이후 계속/);assert.ok(c.window.PlannerReport.render(r).includes('더클래식 1과정'));
});
