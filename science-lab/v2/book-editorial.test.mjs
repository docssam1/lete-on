import test from 'node:test';import assert from 'node:assert/strict';
import{chapter,art}from'../data/book/c22-s51-u02.book.js';import{rayGeometry}from'../data/book/c22-s51-u02.figures.js';import{renderChapter}from'./book.js';
test('빛 교재는 80문항을 번호 밀림 없이 한 번씩 배치하고 정리·평가·보완을 연결한다',()=>{
 const ids=chapter.pages.flatMap(p=>p.blocks.filter(b=>b.type==='questions').flatMap(b=>b.ids));assert.equal(ids.length,80);assert.equal(new Set(ids).size,80);assert.deepEqual(ids,chapter.questions.map(q=>q.id));assert.equal(chapter.pages.length,32);assert.equal(chapter.teacherPages.length,20);
 for(const [i,q]of chapter.questions.entries()){assert.equal(q.no,i+1);assert(q.answer&&q.explanation&&q.criteria&&q.misconception);assert.equal(q.status,'authored');if(q.form==='choice')assert.equal(q.answer,'①②③④⑤'[q.key]);if(q.form==='multi')assert.equal(q.answer,q.key.map(i=>'①②③④⑤'[i]).join(', '));if(q.form==='blank')assert(q.prompt.includes('[ ]'));}
 assert.deepEqual([...new Set(chapter.questions.map(q=>q.form))].sort(),['blank','choice','draw','match','multi','order','short','written']);assert.equal(chapter.pages.filter(p=>p.kind==='assessment').length,4);assert.equal(chapter.pages.filter(p=>p.kind==='inquiry').length,7);
 const assessment=chapter.pages.filter(p=>p.kind==='assessment').flatMap(p=>p.blocks.filter(b=>b.type==='questions').flatMap(b=>b.ids));assert.deepEqual(assessment,chapter.questions.slice(56,76).map(q=>q.id));
});
test('학생 문항에는 해설·답 키를 넣지 않고 교사용 별도 해설에만 80개 풀이를 넣는다',()=>{
 const s=renderChapter(chapter,art,[]),t=renderChapter(chapter,art,[],{teacher:true});assert.equal((s.match(/class="bk-page /g)||[]).length,32);assert.equal((t.match(/class="bk-page /g)||[]).length,52);assert(!s.includes('data-solution='));assert(!s.includes('data-key='));assert(!s.includes('오개념 점검</b>'));assert.equal((t.match(/data-solution=/g)||[]).length,80);assert.equal((t.match(/인정 답안·지도 기준/g)||[]).length,80);assert.equal((s.match(/GFIELD · 지필드/g)||[]).length,32);assert.equal((t.match(/GFIELD · 지필드/g)||[]).length,52);
 for(const p of chapter.pages){assert(p.rail.length>=2);for(const b of p.blocks)if(b.type==='diagram')assert(art[b.key]);}
});
test('거울 모식도의 경로와 그림 문항은 반사 방향이 일치하고 숨긴 다른 그림에 의존하지 않는다',()=>{
 // x+y=355인 / 거울에 오른쪽 진행(1,0)이 닿으면 위쪽(0,-1)으로 반사한다.
 const incoming=rayGeometry('M95 70H285'),outgoing=rayGeometry('M285 70V16');assert(incoming.x2>incoming.x1);assert.equal(incoming.x2,outgoing.x1);assert.equal(incoming.y2,outgoing.y1);assert.equal(outgoing.x1+outgoing.y1,355);assert.equal(outgoing.x1,outgoing.x2);assert(outgoing.y2<outgoing.y1);
 assert(art.reflection.includes('M250 105L320 35'));assert(art.mirrorTask.includes('M220 100L300 20'));const task=rayGeometry('M70 60H260');assert.equal(task.x2+task.y2,320);assert(chapter.questions[44].answer.includes('위쪽'));
 // CSS marker 참조는 숨긴 중복 SVG에서 사라질 수 있으므로 실제 화살촉을 지점으로 그린다.
 for(const value of Object.values(art)){assert(!value.includes('marker-end'));assert(!value.includes('<defs'));}for(const key of['seeing','straight','reflection','refraction','periscope','mirrorTask'])assert(art[key].includes('<polygon'));
 const r=rayGeometry('M85 18L235 75'),water=rayGeometry('M235 75L285 153');assert.equal(r.x2,water.x1);assert.equal(r.y2,water.y1);assert(Math.abs((water.x2-water.x1)/(water.y2-water.y1))<Math.abs((r.x2-r.x1)/(r.y2-r.y1)));
});
