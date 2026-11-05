import {readFileSync,existsSync} from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';

const paper={id:'h1-06',exam:'2026년 6월 학평',title:'2026년 고1 6월 수학 기출',level:'1',files:{problem:'https://wdown.ebsi.co.kr/W61001/01exam/20260604/go1/math_mun_D7P5UME3.pdf',explanation:'https://wdown.ebsi.co.kr/W61001/01exam/20260604/go1/math_hsj_AX588329.pdf'},papers:'https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs?targetCd=D100'};
const selected=(n=30,extra={})=>({version:1,paperId:'h1-06',metadataVersion:'v1',mode:'current',selected:Array.from({length:n},(_,i)=>i+1),excludedUnlearned:Array.from({length:30-n},(_,i)=>i+n+1),excludedOther:[],unmapped:[],...extra});
function setup(extra={}){const window={location:{href:'https://roadmap.gfieldacademy.net/demo2/planner.html'},document:{currentScript:{src:'https://roadmap.gfieldacademy.net/demo2/planner-mock-print.js?v=1'}},PlannerMockSchedule:{resolvePaper:v=>v==='h1-06'||v?.exam===paper.exam&&v?.level===paper.level?paper:null},PlannerMockItems:{items:()=>Array.from({length:30},(_,i)=>({number:i+1,unitId:i<15?'poly':'equation',question:'SECRET QUESTION',answer:'SECRET ANSWER',solution:'SECRET SOLUTION'})),UNIT:{poly:{title:'다항식'},equation:{title:'이차방정식'}}},...extra};const ctx=vm.createContext({window,URL});vm.runInContext(readFileSync(new URL('planner-mock-print.js',import.meta.url),'utf8'),ctx);return{P:window.PlannerMockPrint,window};}
const options=(extra={})=>({paper,selection:selected(),practiceDate:'2026-11-26',...extra});

test('a complete 30-question selection prints two consistent pages with actual numbers, units, checkboxes and writing lines',()=>{
 const {P}=setup(),html=P.document(options());assert.match(html,/<!doctype html>/i);assert.match(html,/<html lang="ko">/);assert.equal((html.match(/data-print-page=/g)||[]).length,2);assert.equal((html.match(/data-question-number=/g)||[]).length,30);
 for(let n=1;n<=30;n++)assert.equal((html.match(new RegExp('data-question-number="'+n+'"','g'))||[]).length,1);
 assert.equal((html.match(/class="mp-result-states"/g)||[]).length,30);assert.equal((html.match(/class="mp-note"/g)||[]).length,30);assert.match(html,/다항식/);assert.match(html,/이차방정식/);assert.match(html,/1 \/ 2쪽/);assert.match(html,/2 \/ 2쪽/);assert.match(html,/2026\. 11\. 26\./);
 assert.match(html,/이름/);assert.match(html,/실제 풀이일/);assert.match(html,/소요 시간/);assert.match(html,/planner-mock-print\.css\?v=/);
});
test('the handout links the official question PDF separately and never embeds original text, answers, solutions or answer files',()=>{
 const {P}=setup(),html=P.document(options({paper:{...paper,question:'SECRET QUESTION',answer:'SECRET ANSWER',solution:'SECRET SOLUTION'},answers:{1:'correct',2:'helped',3:'SECRET ANSWER'}}));
 assert.match(html,/공식 문제 PDF 열기 · 별도 인쇄/);assert.ok(html.includes(paper.files.problem));assert.ok(!html.includes(paper.files.explanation));assert.doesNotMatch(html,/SECRET QUESTION|SECRET ANSWER|SECRET SOLUTION|<iframe|<object|<embed|<img/i);assert.match(html,/선택 문항 학습지 또는 공식 시험지/);assert.match(html,/class="mp-check" aria-hidden="true">✓/);
});
test('selected, unlearned, other and unmapped groups remain distinct and no excluded number gains a result row',()=>{
 const {P}=setup(),s=selected(2,{selected:[1,6],excludedUnlearned:[2,3],excludedOther:[4],unmapped:[5],mode:'remedial'}),html=P.document(options({selection:s}));assert.equal((html.match(/data-question-number=/g)||[]).length,2);assert.match(html,/미학습 제외/);assert.match(html,/2, 3번/);assert.match(html,/보완 대상 외/);assert.match(html,/단원 검수 대기/);assert.doesNotMatch(html,/data-question-number="[2345]"/);
});
test('empty, projected, wrong-paper and invalid-number selections produce an explanation page without fabricated questions',()=>{
 const {P}=setup();for(const s of [selected(0),selected(3,{projected:true}),selected(3,{paperId:'h2-06'}),selected(3,{selected:[1,1,3]}),selected(3,{selected:[0,1,3]})]){const html=P.document(options({selection:s}));assert.equal((html.match(/data-print-page=/g)||[]).length,1);assert.doesNotMatch(html,/data-question-number=/);assert.match(html,/확인|선택된 문항이 없습니다/);}
 const projected=P.document(options({selection:selected(3,{projected:true})}));assert.match(projected,/현재 배운 단원/);
});
test('book plans get their own pages and preserve the recorded workload without turning it into a score',()=>{
 const {P}=setup(),items=Array.from({length:10},(_,i)=>({bookName:'쎈 공통수학1',unitTitle:'이차방정식 '+i,location:'유형 연습',measure:'problem',planned:20,completed:12})),html=P.document(options({selection:selected(2),topics:[{title:'이차방정식'}],bookPlan:{items}}));assert.equal((html.match(/data-print-page=/g)||[]).length,3);assert.equal((html.match(/12 \/ 20문항/g)||[]).length,10);assert.match(html,/교재 분량 완료와 기출 수행률은 따로/);assert.match(html,/공부한 날/);
});
test('untrusted labels are escaped and only approved HTTPS EBS question links are clickable',()=>{
 const malicious='<img src=x onerror=alert(1)>',unsafe={...paper,title:malicious,files:{problem:'javascript:alert(1)'},papers:'https://www.ebsi.co.kr.evil.test/ebs/xip/xipc/previousPaperList.ebs'};
 const {P}=setup({PlannerMockSchedule:{resolvePaper:()=>unsafe},PlannerMockItems:{items:()=>[{number:1,unitId:'bad'}],UNIT:{bad:{title:malicious}}}}),html=P.document(options({selection:selected(1),topics:[{title:malicious}],bookPlan:{items:[{bookName:malicious,unitTitle:'<script>bad()</script>'}]}}));assert.doesNotMatch(html,/<img|<script>bad|href="javascript:|href="https:\/\/www\.ebsi\.co\.kr\.evil/i);assert.match(html,/&lt;img/);assert.match(html,/&lt;script&gt;/);
 for(const url of ['http://wdown.ebsi.co.kr/W61001/p.pdf','https://evil.test/p.pdf','https://user:pass@wdown.ebsi.co.kr/W61001/p.pdf','https://wdown.ebsi.co.kr:444/W61001/p.pdf']){const {P:other}=setup({PlannerMockSchedule:{resolvePaper:()=>({...paper,files:{problem:url},papers:null})}});assert.ok(!other.document(options()).includes('href="'+url+'"'));}
});
test('open handles blocked popups and writes only into a detached about:blank document',()=>{
 const blocked=setup({open:()=>null}).P.open(options());assert.equal(blocked.ok,false);assert.match(blocked.error,/팝업/);
 const calls=[],target={opener:{},document:{open:()=>calls.push('document.open'),write:h=>calls.push(h),close:()=>calls.push('document.close')},focus:()=>calls.push('focus')};
 const {P}=setup({open:(url,name)=>{calls.push([url,name]);return target;}}),r=P.open(options({selection:selected(1)}));assert.equal(r.ok,true);assert.equal(r.window,target);assert.equal(target.opener,null);assert.deepEqual(calls[0],['about:blank','_blank']);assert.equal(calls[1],'document.open');assert.match(calls[2],/^<!doctype html>/);assert.equal(calls[3],'document.close');
});
test('A4 styles use bundled serif fonts, monochrome printing and page breaks without hiding overflow',()=>{
 const css=readFileSync(new URL('planner-mock-print.css',import.meta.url),'utf8');assert.match(css,/@page\{size:A4;margin:0\}/);assert.match(css,/min-height:297mm/);assert.match(css,/break-after:page/);assert.match(css,/break-inside:avoid/);assert.match(css,/@media print/);assert.doesNotMatch(css,/fonts\.googleapis|font-weight:900|overflow:hidden/);
 for(const m of css.matchAll(/url\('(\/fields-classic\/question-bank\/assets\/fonts\/[^']+)'\)/g))assert.ok(existsSync(new URL('../../'+m[1].slice(1),import.meta.url)),m[1]);
});
