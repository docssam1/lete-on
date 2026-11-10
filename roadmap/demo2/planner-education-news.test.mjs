import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
const read=f=>readFileSync(new URL(f,import.meta.url),'utf8');
const load=files=>{const w={};const c=vm.createContext({window:w});for(const f of files)vm.runInContext(read(f),c,{filename:f});return w;};

test('HS report news is listed as one article with title, source and link only',()=>{
 const w=load(['planner-hs-news-data.js','planner-education-news.js']),hs=w.PLANNER_HS_NEWS,N=w.PlannerEducationNews;
 assert.equal(hs.items.length,40);
 for(const x of hs.items){assert.deepEqual(Object.keys(x).sort(),['category','date','source','title','url']);assert.match(x.url,/^https?:\/\//);assert.match(x.date,/^2026-\d\d-\d\d$/);}
 const item=N.items.find(x=>x.id==='news-hs-report-list');
 assert.equal(item.news.sources.length,40);
 assert.deepEqual(Array.from(item.stages),['preschool','elementary','middle']);
 const html=N.detail(item);
 assert.equal((html.match(/<a href="https?:/g)||[]).length,40);
 assert.match(item.body,/2026-11-10에 옮긴 목록/);
});

test('without the HS data file the four editorial readings stay as they were',()=>{
 const N=load(['planner-education-news.js']).PlannerEducationNews;
 assert.equal(N.items.length,4);
 assert.ok(N.items.every(x=>x.id!=='news-hs-report-list'));
});

test('the school-curriculum reading cites the Hana table as a fact about one school, not a standard',()=>{
 const N=load(['planner-education-news.js']).PlannerEducationNews,x=N.items.find(i=>i.id==='news-middle-courses');
 const row=x.news.reading.find(r=>r[0]==='편성표의 예 · 하나고');
 assert.match(row[1],/1학년 1학기 공통수학1, 2학기 공통수학2와 대수, 2학년 1학기 미적분Ⅰ/);
 assert.match(row[1],/지원할 학교의 표를 직접 보세요/);
 assert.ok(x.news.sources.some(s=>s[1]==='https://www.hana.hs.kr/education/curriculum.do'));
 assert.doesNotMatch(JSON.stringify(x),/합격생의 표준|보통 여기까지/);
});
