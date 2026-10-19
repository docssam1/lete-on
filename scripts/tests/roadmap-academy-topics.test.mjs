import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

// These checks exercise pure state/markup modules; never the storage/API adapter.
const networkAttempts=[];
for(const name of ['fetch','XMLHttpRequest','WebSocket','EventSource'])globalThis[name]=()=>{networkAttempts.push(name);throw Error('Network prohibited');};
const {createState,validateState}=await import('../../roadmap/v31/engine.mjs');
const {ensureWizard}=await import('../../roadmap/v31/flow.mjs');
const {ensureQuick,commitLearning}=await import('../../roadmap/v31/quick-flow.mjs');
const {startCompact,ensureCompact,collectCompact,commitCompact}=await import('../../roadmap/v31/compact-intake.mjs');
const {startScene,collectScene}=await import('../../roadmap/v31/scene-intake.mjs');
const {collectAcademyDraft,saveAcademyDraft}=await import('../../roadmap/v31/intake.mjs');
const {academyTiming,academyTimingLabel}=await import('../../roadmap/v31/academy-input.mjs');
const {academyExperienceMarkup,academyTopicGroups,academyTopicsMarkup}=await import('../../roadmap/v31/academy-experience.mjs');
const {ACADEMY_TOPIC_HEADINGS:headings,ACADEMY_TOPIC_SOURCES:sources}=await import('../../roadmap/v31/data/academy-topic-headings.mjs');
const {resultHubScreen}=await import('../../roadmap/v31/result-hub.mjs');
const form=values=>new Map(Object.entries(values));
function fresh(records=[]){
 const s=ensureQuick(ensureWizard(createState('2026-10-19T00:00:00.000Z')));
 s.wizard.quick.stage='p5';s.profile.reportedAge=5;s.wizard.step='learning';
 s.wizard.academies=structuredClone(records);if(records.length)s.wizard.quick.academyId=records[0].id;
 startCompact(s);return s;
}
const record=(institution='CMS',level='WHY 9',more={})=>({id:`old-${institution}`,institution,level,note:'원래 메모',...more});
const collect=(s,values,name='')=>collectCompact(s,form(values),name);
const timing=(s,value)=>collect(s,{'compact:academy:timing':value},'compact:academy:timing');
const institution=(s,value,extra={})=>collect(s,{'compact:academy:choice':value,...extra},'compact:academy:choice');

test('catalog keeps seven distinct series and exact source heading counts',()=>{
 const counts=new Map();for(const g of headings){const key=g.institution+'/'+g.series;counts.set(key,(counts.get(key)||0)+g.topics.length);}
 assert.deepEqual(Object.fromEntries(counts),{'CMS/WHY':180,'소마/Ray·Prism':216,'소마/뉴소마':252,'소마/프리미어':104,'시매쓰/NC':36,'시매쓰/AP':36,'시매쓰/위니매쓰':36});
 assert.equal(headings.length,218);assert.equal(new Set(headings.map(g=>[g.institution,g.series,g.stage,g.part].join('|'))).size,218);
});
test('WHY9 has all twelve themes, retaining the awkward B7 source wording',()=>{
 const g=academyTopicGroups(record());assert.equal(g.length,3);assert.equal(g.flatMap(x=>x.topics).length,12);
 assert.deepEqual(g[0].topics.map(x=>x.title),['펜토미노','시간과 각','기둥의 뿔과 부피관계','스도쿠']);
 assert.equal(g[0].topics[2].cell,'B7');assert.equal(sources['cms-why'].sha256,'79297a8149673e83113f5f71236d968e609f068aa4b055da114249550a62a8f6');
});
test('NC4 six topics are not volumes or curriculum/grade mappings',()=>{
 const g=headings.find(g=>g.series==='NC'&&g.stage==='4단계');
 assert.deepEqual(g.topics.map(x=>x.title),['숫자카드놀이','요리조리붙이고나누고','1년에서1초까지','그래프가좋아요','알쏭달쏭수퍼즐','지오리플렉터']);
 assert.ok(!g.topics.some(x=>x.part));assert.ok(!JSON.stringify(g).includes('4-1-4'));
});
test('public data contains heading/provenance fields only, not lesson or machine paths',()=>{
 const text=readFileSync(new URL('../../roadmap/v31/data/academy-topic-headings.mjs',import.meta.url),'utf8');
 assert.doesNotMatch(text,/\/Users\/|CloudStorage|선수학습|교과진도|수업내용|연산프린트/);
 for(const g of headings)for(const topic of g.topics)assert.deepEqual(Object.keys(topic).filter(k=>!['title','part','cell'].includes(k)),[]);
});
test('legacy W9/9/WHY9 and old soma names are never normalized to new choices',()=>{
 for(const level of ['W9','9','WHY9']){const r=record('CMS',level),before=structuredClone(r);assert.equal(academyTopicGroups(r).length,45);assert.deepEqual(r,before);}
 for(const level of ['P','프리미어 P1','A1반'])assert.equal(academyTopicGroups(record('소마',level)).length,143);
});
test('catalog browsing is collapsed, native, read-only and separates NC/AP and soma editions',()=>{
 const cmath=academyTopicsMarkup(record('시매쓰',''));
 assert.match(cmath,/NC 참고 목차/);assert.match(cmath,/AP 참고 목차/);assert.match(cmath,/위니매쓰 참고 목차/);
 assert.doesNotMatch(cmath,/<(?:input|select|button)\b|<details[^>]*\bopen\b/);
 const soma=academyTopicsMarkup(record('소마','A1'));assert.match(soma,/Ray·Prism 참고 목차/);assert.match(soma,/뉴소마 참고 목차/);
});
test('missing and default unknown timing remain distinct from an explicit unknown selection',()=>{
 for(const r of [record(),record('CMS','WHY 9',{status:'unknown'})]){assert.equal(academyTiming(r),'');assert.equal(academyTimingLabel(r),'');assert.doesNotMatch(academyExperienceMarkup([r]),/academy-timing-badge/);}
 assert.equal(academyTimingLabel(record('CMS','WHY 9',{status:'unknown',timingReported:true})),'모름');
});
test('compact unchanged submission and JSON reopen preserve old missing keys exactly',()=>{
 for(const r of [record('CMS','W5'),record('소마','P',{status:'unknown'}),record('필즈','옛 자유반',{status:'past'})]){
  const s=fresh([r]);commitCompact(s);assert.deepEqual(s.wizard.academies,[r]);
  const restored=JSON.parse(JSON.stringify(s));startCompact(restored,{reset:true});commitCompact(restored);assert.deepEqual(restored.wizard.academies,[r]);
 }
});
test('explicit compact timing changes only status and its report marker',()=>{
 const r=record('소마','프리미어 P1',{status:'unknown',evidenceDate:'2025-01-01'}),s=fresh([r]);
 timing(s,'past');commitCompact(s);assert.deepEqual(s.wizard.academies,[{...r,status:'past',timingReported:true}]);
 assert.equal(s.courses.length,0);assert.equal(s.wizard.quick.monthlyLanes,undefined);assert.equal(validateState(s).valid,true);
});
test('per-institution timing drafts survive a round trip without stale controls leaking',()=>{
 const s=fresh([record('CMS','WHY 9',{status:'current'}),record('소마','P',{status:'past'})]);
 timing(s,'unknown');institution(s,'소마',{'compact:academy:timing':'unknown','compact:academy:level':'WHY 9'});
 assert.equal(ensureCompact(s).academy.timing,'past');assert.equal(ensureCompact(s).academy.level,'P');
 institution(s,'CMS',{'compact:academy:timing':'past'});assert.equal(ensureCompact(s).academy.timing,'unknown');commitCompact(s);
 assert.equal(s.wizard.academies[0].timingReported,true);assert.equal(s.wizard.academies[1].status,'past');assert.ok(!Object.hasOwn(s.wizard.academies[1],'timingReported'));
});
test('current CMS, former soma, explicit unknown and missing timing coexist',()=>{
 const rows=[record('CMS','WHY 9',{status:'current'}),record('소마','A1반',{status:'past'}),record('시매쓰','',{status:'unknown',timingReported:true}),record('필즈','G')];
 const before=structuredClone(rows),html=academyExperienceMarkup(rows);
 assert.equal((html.match(/academy-timing-badge/g)||[]).length,3);assert.match(html,/>현재<|>이전<|>모름</);assert.deepEqual(rows,before);
 assert.equal((html.match(/academy-experience-intro/g)||[]).length,1);assert.doesNotMatch(html,/선택한 표준|레벨 미입력|undefined/);
 const s=fresh(rows);s.wizard.quick.resultTab='analysis';assert.equal((resultHubScreen(s,{},{}).html.match(/academy-timing-badge/g)||[]).length,3);
});
test('scene timing restores by institution and commits only the selected experience',()=>{
 const s=fresh([record('CMS','W5'),record('소마','P',{status:'past'})]);startScene(s,{track:'thinking'});s.wizard.quick.scene.cursor='thinking-academy';
 collectScene(s,form({'academy:institution':'CMS','academy:timing':'unknown'}),'academy:timing');
 collectScene(s,form({'academy:institution':'소마','academy:timing':'unknown'}),'academy:institution');assert.equal(s.wizard.quick.draft['academy:timing'],'past');
 collectScene(s,form({'academy:institution':'CMS','academy:timing':'past'}),'academy:institution');assert.equal(s.wizard.quick.draft['academy:timing'],'unknown');
 s.wizard.quick.scene.academyTouched=true;commitLearning(s,{sceneOnly:true});
 assert.deepEqual(s.wizard.academies[0],{...record('CMS','W5'),status:'unknown',timingReported:true});assert.equal(s.wizard.academies[1].status,'past');
});
test('pending scene timing survives switching to compact input',()=>{
 const s=fresh([record()]);startScene(s,{track:'thinking'});s.wizard.quick.scene.cursor='thinking-academy';
 collectScene(s,form({'academy:institution':'CMS','academy:timing':'past'}),'academy:timing');s.wizard.quick.scene.academyTouched=true;
 startCompact(s,{reset:true});assert.equal(ensureCompact(s).academy.timing,'past');commitCompact(s);assert.equal(s.wizard.academies[0].status,'past');
});
test('legacy editor unchanged timing preserves absent/default fields',()=>{
 for(const r of [record('CMS','W5'),record('CMS','W5',{status:'unknown'})]){
  const s=fresh([r]);s.wizard.editAcademyId=r.id;s.wizard.academyDraft={institution:'CMS',academyLevel:'W5'};
  collectAcademyDraft(s,form({institution:'CMS',academyLevel:'W5',academyStatus:''}));saveAcademyDraft(s);assert.deepEqual(s.wizard.academies,[r]);
 }
});
test('legacy editor commits a new explicit unknown and ignores prior institution timing',()=>{
 const s=fresh([record('CMS','W5'),record('소마','P',{status:'past'})]);s.wizard.academyDraft={institution:'CMS',academyLevel:'W5'};
 collectAcademyDraft(s,form({institution:'CMS',academyStatus:'unknown'}));
 collectAcademyDraft(s,form({institution:'소마',academyStatus:'unknown'}));assert.equal(s.wizard.academyDraft.academyTiming,'past');
 collectAcademyDraft(s,form({institution:'CMS',academyStatus:'past'}));assert.equal(s.wizard.academyDraft.academyTiming,'unknown');saveAcademyDraft(s);
 assert.deepEqual(s.wizard.academies[0],{...record('CMS','W5'),status:'unknown',timingReported:true});
});
test('reference rendering never changes courses, source rows, goals or saved aliases',()=>{
 const s=fresh([record('CMS','W5'),record('소마','A1반')]);s.wizard.quick.monthlyLanes={thinking:'old-row'};s.wizard.quick.sourceSection='S2';s.wizard.quick.level='L3';
 const before=structuredClone(s);academyExperienceMarkup(s.wizard.academies);resultHubScreen(s,{},{});assert.deepEqual(s,before);
});
test('parent-entered academy and legacy class strings are escaped',()=>{
 const html=academyExperienceMarkup([record('<img onerror=alert(1)>','<script>alert(2)</script>')]);
 assert.doesNotMatch(html,/<img|<script/);assert.match(html,/&lt;img/);assert.match(html,/&lt;script/);
});
test('changing another academy name ignores the previous name timing controls',()=>{
 const rows=[record('첫 학원','옛 반',{status:'current'}),record('다른 학원','다른 반',{status:'past'})];
 const s=fresh(rows);collect(s,{'compact:academy:name':'다른 학원','compact:academy:timing':'current'},'compact:academy:name');
 assert.equal(ensureCompact(s).academy.timing,'past');assert.equal(ensureCompact(s).academy.timingTouched,false);
 const legacy=fresh(rows);legacy.wizard.academyDraft={institution:'other',institutionOther:'첫 학원',academyTiming:'current'};
 collectAcademyDraft(legacy,form({institution:'other',institutionOther:'다른 학원',academyStatus:'current'}));
 assert.equal(legacy.wizard.academyDraft.academyTiming,'past');assert.equal(legacy.wizard.academyDraft.academyTimingTouched,false);
});
test('no network/API attempt was made',()=>assert.deepEqual(networkAttempts,[]));
