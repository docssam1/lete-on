import test from'node:test';import assert from'node:assert/strict';
import{chapter,art}from'../data/book/c22-s51-u03.book.js';import{model}from'../data/book/c22-s51-u03.figures.js';import{renderChapter}from'./book.js';
test('용해 교재는 96문항의 응답·해설·번호를 한 번씩 연결하고 여덟 형식을 제공한다',()=>{
 const ids=chapter.pages.flatMap(p=>p.blocks.filter(b=>b.type==='questions').flatMap(b=>b.ids));assert.equal(ids.length,96);assert.equal(new Set(ids).size,96);assert.deepEqual(ids,chapter.questions.map(q=>q.id));assert.equal(chapter.pages.length,42);assert.equal(chapter.teacherPages.length,24);
 assert.deepEqual([...new Set(chapter.questions.map(q=>q.form))].sort(),['blank','choice','draw','match','multi','order','short','written']);
 for(const[i,q]of chapter.questions.entries()){assert.equal(q.no,i+1);assert.equal(q.status,'authored');assert(q.answer?.length>0);for(const k of['explanation','criteria','misconception'])assert(q[k]?.length>2);if(q.form==='choice')assert.equal(q.answer,'①②③④⑤'[q.key]);if(q.form==='multi')assert.equal(q.answer,q.key.map(i=>'①②③④⑤'[i]).join(', '));if(q.form==='blank')assert(q.prompt.includes('[ ]'));}
 assert.equal(chapter.pages.filter(p=>p.kind==='inquiry').length,8);assert.equal(chapter.pages.filter(p=>p.kind==='assessment').length,6);assert.deepEqual(chapter.pages.filter(p=>p.kind==='assessment').flatMap(p=>p.blocks.find(b=>b.type==='questions').ids),chapter.questions.slice(64,88).map(q=>q.id));
});
test('용해의 제목과 오른쪽 날개를 렌더하고 학생에게는 96개 해설을 넣지 않는다',()=>{
 const s=renderChapter(chapter,art,[]),t=renderChapter(chapter,art,[],{teacher:true});assert.equal((s.match(/class="bk-page /g)||[]).length,42);assert.equal((t.match(/class="bk-page /g)||[]).length,66);assert.equal((s.match(/class="ed-rail"/g)||[]).length,42);assert(!s.includes('빛의 성질'));assert(!s.includes('data-solution='));assert.equal((t.match(/data-solution=/g)||[]).length,96);assert.equal((t.match(/인정 답안·지도 기준/g)||[]).length,96);assert(!s.includes('data-key='));
 for(const p of chapter.pages){assert(p.rail.length>=2);for(const b of p.blocks)if(b.type==='diagram')assert(art[b.key]);}assert(s.includes('더 알아보기'));assert(s.includes('정리할 것'));
});
test('양·질량·실사형 설명 자료와 풀이가 같은 조건을 쓰고 한계를 유지한다',()=>{
 const {water,sugar,cup,paper}=model.mass;assert.equal(water+sugar,92);assert.equal(water+sugar+cup+paper,139);assert(art.mass.includes('139 g'));assert.equal(model.kind.rows.filter(r=>!r[2]).length,1);assert(model.floating.sameObject&&model.floating.sameTemperature);
 // 사진에 좌표·정량 눈금을 만들어 붙이지 않는다. 자유 부유 상태와 비교 조건을 밖에 적는다.
 assert.match(model.floating.states[0],/완전히 잠겨/);assert.equal(model.floating.states.length,3);assert.equal(model.concentration[0].water,model.concentration[1].water);assert.equal(model.concentration[1].sugar,model.concentration[2].sugar);
 for(const k of['mixing','mass','observation','temperature','concentration','floating','communication']){assert.match(art[k],/<img /);assert.match(art[k],/AI 실사형 설명 이미지/);assert(!art[k].includes('<svg'));}assert.match(art.kind,/<table/);
 for(const no of[19,47,48,74])assert.match(chapter.questions[no-1].explanation,/최대|추가|더 넣어/);for(const no of[37,82])assert.match(chapter.questions[no-1].explanation,/구별|비교/);assert.match(chapter.questions[21].answer,/빠르기/);assert.match(chapter.questions[45].answer,/미실행/);
});
