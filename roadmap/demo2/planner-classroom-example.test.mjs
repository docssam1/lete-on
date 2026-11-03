import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const c={window:{},console,URL};vm.createContext(c);
for(const f of ['planner-levels.js','planner.js','demo-content.js','planner-intake.js','planner-progression.js','planner-standard.js','planner-academy-data.js','planner-direct-links.js','planner-counselling-updates.js','planner-report.js','planner-classroom-example.js'])vm.runInContext(readFileSync(new URL(f,import.meta.url),'utf8'),c);
const V=c.window.PlannerClassroomExample,plain=v=>JSON.parse(JSON.stringify(v));
test('confirmed units, completed upper book and completed calculation do not become half-progress defaults',()=>{
 const m=V.model();assert.equal(m.facts.schoolFraction,1/3);assert.match(m.facts.school,/2단원 완료/);assert.equal(m.facts.thinking,'필즈 베이직 상권 완료');assert.equal(m.lanes[1].blocks[0].initialFraction,1/3);assert.equal(m.lanes.find(l=>l.id==='calc').blocks[0].title,'기적의 계산법 4권');assert.equal(m.lanes.find(l=>l.id==='calc').blocks[0].studyDays,50);assert.equal(m.lanes.find(l=>l.id==='calc').blocks[0].weeks,10);assert.equal(m.facts.english,'SR GE 3점대 초반');
});
test('all planned subjects cover the horizon and transitions have no artificial empty months',()=>{
 for(const l of V.model().lanes){assert.equal(l.blocks[0].start,0);for(let i=1;i<l.blocks.length;i++)assert.ok(Math.abs(l.blocks[i].start-l.blocks[i-1].end)<1e-8,l.id);assert.ok(l.blocks.at(-1).end>=37,l.id);}assert.equal(V.date(0).label,'2026년 6세 11월');assert.equal(V.date(36).label,'2029년 초2 11월');
});
test('E1 reference is the supplied E1 course, not S; calculations stay separate',()=>{
 const source=JSON.stringify(c.window.PLANNER_ACADEMY_ROADMAPS),m=V.model(),e=m.references.find(x=>x.id==='fields-e1');assert.equal(e.tracks[0].blocks[0].title,'더클래식 1과정');assert.equal(e.tracks[0].blocks[0].start,2);assert.equal(e.tracks[0].blocks[0].end,20);const intro=e.tracks[1].blocks[0],skill=e.tracks[1].blocks[1];assert.equal(intro.end-intro.start,6);assert.equal(skill.end-skill.start,7);assert.equal(skill.end,15);assert.equal(m.references.find(x=>x.id==='soma').tracks[0].blocks[0].end,12);assert.equal(m.lanes.find(l=>l.id==='calc').blocks[0].title,'기적의 계산법 4권');V.choose(m.state,'fields');assert.equal(JSON.stringify(c.window.PLANNER_ACADEMY_ROADMAPS),source);
});
test('comparison controls restore only known values and never remove own study lanes',()=>{
 const initial=V.restore(null),hidden=V.choose(initial,'fields');assert.equal(initial.fields,true);assert.equal(hidden.fields,false);assert.equal(V.model(hidden).references.length,1);assert.equal(V.model(hidden).lanes.length,5);assert.deepEqual(plain(V.restore({axis:'bad',month:999,soma:false,fields:false,student:'private'})),{version:1,axis:'thinking',soma:false,fields:false,month:0});assert.equal(V.choose(initial,'month','13').month,13);
});
test('direct class link is anonymous and rejects mixed or duplicated routes',()=>{
 const L=c.window.PlannerDirectLinks,base='https://example.com/roadmap/demo2/planner.html?name=private#x',href=L.classroomHref(base);assert.equal(href,'https://example.com/roadmap/demo2/planner.html?classroom=gfield-6-national2');assert.equal(L.resolve(href).kind,'classroom');for(const query of ['classroom=other','classroom=gfield-6-national2&classroom=gfield-6-national2','classroom=gfield-6-national2&study=grade5-balanced','classroom=gfield-6-national2&senior=premier-cohort'])assert.equal(L.resolve('https://example.com/planner.html?'+query),null);
});

test('printed report keeps confirmed facts and unfinished regular thinking is partial',()=>{
 const r=V.reportModel(null);assert.equal(r.name,V.TITLE);assert.ok(r.front.prose.join(' ').includes('2단원 완료'));assert.ok(r.front.prose.join(' ').includes('SR GE 3점대 초반'));assert.equal(r.front.checkpoints[0].date,'2026년 6세 12월');const skill=r.lanes[0].blocks.at(-1);assert.equal(skill.end,37);assert.match(skill.title,/황소/);assert.ok(c.window.PlannerReport.render(r).includes('더클래식 1과정'));
});

test('regular thinking is Basic through December, 1031 introduction B then elementary; academy books remain references',()=>{
 const m=V.model(),thinking=m.lanes.find(l=>l.id==='thinking').blocks;
 assert.equal(thinking[0].end,2);assert.equal(thinking[1].title,'1031 입문 B');assert.equal(thinking[1].start,2);assert.equal(thinking[3].title,'1031 초급');assert.ok(thinking.every(b=>!/^필즈 (입문|실력)/.test(b.title)));
 const depth=m.lanes.find(l=>l.id==='depth').blocks;assert.equal(depth[1].title,'최상위 수학 2-1');assert.equal(depth[1].start,2);assert.equal(m.lanes.find(l=>l.id==='school').blocks[1].stage,'2-2');
 const english=m.lanes.find(l=>l.id==='english').blocks;assert.equal(english.length,7);assert.match(english[1].title,/Magic Tree House/);assert.match(english[1].note,/보캡 그린/);assert.match(V.reportModel().front.prose.join(' '),/챌린지.*P3/);
 const html=V.graph({...m,state:{...m.state,axis:'school'}});assert.ok(html.includes('M90 277'));assert.match(V.table(m),/ce-academy-soma/);assert.match(V.table(m),/ce-academy-fields/);
});

test('Hwangso goal includes elementary depth, exactly six months of 3 percent after 5-2 depth, and summer preparation',()=>{
 const m=V.model(),t=m.lanes.find(l=>l.id==='thinking').blocks,d=m.lanes.find(l=>l.id==='depth').blocks,three=t.find(b=>b.id==='c-three');assert.equal(three.end-three.start,6);assert.equal(d.find(b=>b.stage==='5-2').end,three.start);assert.match(V.date(three.end).label,/초2 7월/);assert.match(t.at(-1).title,/초2 11월/);assert.ok(m.questions.some(q=>q.answer.includes('휴원')));assert.ok(m.lanes.find(l=>l.id==='calc').blocks.filter(b=>/중학/.test(b.title)).every(b=>Math.abs(b.end-b.start-2)<1e-8));
});

test('academy comparison includes own four math lanes and continues Soma beginner to intermediate to advanced',()=>{
 const m=V.model(),html=V.table(m),soma=m.references.find(x=>x.id==='soma');assert.match(html,/국가대표2 · 우리 반 진도/);assert.match(html,/ce-academy-own/);assert.deepEqual(plain(soma.tracks[0].blocks.map(b=>b.title)),['Premier 라이즈','Premier 초급 · 6권','Premier 중급 · 8권','Premier 고급 · 10권']);for(const t of soma.tracks)for(let n=1;n<t.blocks.length;n++)assert.equal(t.blocks[n].start,t.blocks[n-1].end);assert.ok(m.references.find(x=>x.id==='fields-e1').tracks[1].blocks.every(b=>b.title!=='경시'));
});

test('English reaches CARS E in elementary grade 2 May with B C D E transitions and parallel reading',()=>{
 const e=V.model().lanes.find(l=>l.id==='english').blocks,stages=e.filter(b=>b.id.startsWith('c-en-cars-'));assert.deepEqual(plain(stages.map(b=>b.id)),['c-en-cars-b','c-en-cars-c','c-en-cars-d','c-en-cars-e']);assert.equal(V.date(stages[3].start).label,'2029년 초2 5월');assert.equal(stages[2].end,stages[3].start);assert.match(stages[3].note,/주 2회/);assert.match(stages[3].note,/원서와 논픽션/);
});
