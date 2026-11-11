import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFileSync} from 'node:fs';
const read=n=>readFileSync(new URL(n,import.meta.url),'utf8');
const M=createRequire(import.meta.url)('./account-intro.js');
const html=read('account.html'),css=read('account-intro.css'),js=read('account-intro.js');

test('entering text is unseen below the screen, finished by the middle, and never overshoots',()=>{
 assert.equal(M.entered(900,900),0);assert.equal(M.entered(1400,900),0);
 assert.equal(M.entered(450,900),1);assert.equal(M.entered(-200,900),1);
 let last=0;for(let y=900;y>=400;y-=20){const v=M.entered(y,900);assert.ok(v>=last&&v>=0&&v<=1);last=v;}
});
test('a later step in the same row finishes after the earlier one',()=>{
 assert.ok(M.entered(760,900,2)<M.entered(760,900,1));assert.ok(M.entered(760,900,1)<M.entered(760,900,0));
 assert.equal(M.entered(300,900,2),1);
});
test('the row in the middle of the screen is the emphasised one',()=>{
 assert.equal(M.focused(450,900),1);assert.equal(M.focused(0,900),0);assert.equal(M.focused(900,900),0);
 assert.ok(M.focused(650,900)<1&&M.focused(650,900)>M.focused(800,900));
 assert.equal(M.focused(450-60,900),M.focused(450+60,900));
});
test('without a browser the script does nothing and throws nothing',()=>{
 assert.equal(M.mount(null),null);assert.equal(M.mount({document:{}}),null);
});
test('reduced motion turns the motion off and clears what it set',()=>{
 const set=new Map(),classes=new Set(),listeners={};
 const el={hasAttribute:n=>n==='data-zoom',dataset:{},classList:{toggle(){},remove(){}},style:{setProperty:(k,v)=>set.set(k,v),removeProperty:k=>set.delete(k)},getBoundingClientRect:()=>({top:100,height:40,width:200})};
 const media={matches:false,addEventListener:(t,f)=>{listeners.media=f;}};
 let observer;const win={innerHeight:900,scrollY:0,matchMedia:()=>media,requestAnimationFrame:f=>f(),addEventListener(){},removeEventListener(){},
  IntersectionObserver:class{constructor(f){observer=f;}observe(){}disconnect(){}},
  document:{documentElement:{scrollHeight:5000,classList:{add:c=>classes.add(c),remove:c=>classes.delete(c)}},querySelectorAll:()=>[el],addEventListener(){},removeEventListener(){}}};
 M.mount(win);assert.ok(classes.has('intro-motion'));
 observer([{target:el,isIntersecting:true}]);assert.equal(set.get('--zp'),'1.000');
 media.matches=true;listeners.media();assert.ok(!classes.has('intro-motion'));assert.equal(set.has('--zp'),false);
});
test('every line is at its finished size without the script, with reduced motion and in print',()=>{
 const motion=css.slice(css.indexOf('/* Motion.'));
 assert.match(motion,/@media\(prefers-reduced-motion:no-preference\)\{/);
 assert.doesNotMatch(css.slice(0,css.indexOf('/* Motion.')),/\.intro-motion|opacity:0|visibility:hidden/);
 for(const m of motion.matchAll(/var\(--(zp|f)(,[^)]*)?\)/g))assert.equal(m[2],',1',m[0]);
 assert.match(motion,/@media print\{[^}]*opacity:1!important;transform:none!important/);
 assert.doesNotMatch(css,/transition:all|transition:[^;}]*\b(width|height|top|left|margin|padding)\b/);
});
test('the motion only reads position and writes its own three values',()=>{
 assert.doesNotMatch(js,/localStorage|sessionStorage|fetch\(|XMLHttpRequest|cookie|RoadmapMembership/);
 assert.deepEqual([...new Set([...js.matchAll(/setProperty\('(--[a-z]+)'/g)].map(m=>m[1]))].sort(),['--dp','--f','--zp']);
});
test('the introduction keeps its anchors, tabs, links and the single senior example',()=>{
 for(const id of ['introduction','introHeading','previewMap','previewGraph','previewTable','previewMapPanel','previewGraphPanel','previewTablePanel','inputExampleHeading','learningCycleHeading','goalRoadmapsHeading','mockAnalysis','mockHeading','unitTest','unitHeading','bookTest','bookTestHeading','growthHeading','seniorExample','seniorHeading','seniorCaseTitle','stageHeading','libraryHeading','howHeading','questionsHeading','startHeading','accountEntry','memberContent','memberTitle','memberStatus'])assert.equal(html.split(`id="${id}"`).length,2,id);
 for(const href of ['#introduction','#seniorExample','planner.html?books=math','planner.html?goal=contest','planner.html?goal=medicine','planner.html?goal=giftedSchool','planner.html?view=seniors','planner.html?ox=1','assets/roadmap-program-unit-ox-20261111.png','planner.html?academy=schools','planner.html?academy=notices','planner.html?academy=soma-fields','assets/roadmap-program-map-20261111.jpg','assets/roadmap-program-graph-20261111.jpg','assets/roadmap-program-table-20261111.jpg','assets/roadmap-program-mock-20261111.jpg','assets/roadmap-program-booktest-20261111.jpg','assets/senior-seoul-science-roadmap-20261104.svg'])assert.ok(html.includes(`href="${href}"`),href);
 assert.equal((html.match(/role="tab"/g)||[]).length,3);assert.equal((html.match(/role="tabpanel"/g)||[]).length,3);
 assert.equal((html.match(/class="account-senior-example"/g)||[]).length,1);
});
test('no label sits above a heading, no arrow is glued to a link, and nothing zooms inside something that zooms',()=>{
 const below=html.slice(html.indexOf('id="introduction"'));
 assert.doesNotMatch(below,/<span[^>]*>[^<]*<\/span>\s*<h[2-4]/);
 assert.doesNotMatch(below,/↗|aria-hidden="true">→/);
 assert.doesNotMatch(below,/data-zoom="(in|out)"[^>]*>(?:(?!<\/(span|h2|h3|p|div)>).)*data-zoom=/);
 assert.match(html,/account-intro\.css\?v=/);assert.match(html,/account-intro\.js\?v=/);
});
test('the mock analysis and unit test figures are the ones the program holds',()=>{
 const layouts=read('planner-mock-paper-layouts.js'),library=read('planner-mock-library-data.js');
 assert.match(html,/고1·고2 수학 기출 92회차,<br>2,760문항/);assert.match(html,/71단원, 213세트,<br>5,325문항/);
 assert.equal(213*25,5325);assert.equal(71*3,213);assert.equal(92*30,2760);
 assert.match(library,/2017/);assert.match(library,/2026/);assert.ok(layouts.length>1000);
 assert.doesNotMatch(html,/교과·사고력 권별 테스트 <small>개발·연동 준비 중/);
 assert.match(html,/자동 채점은 하지 않습니다/);assert.match(html,/문제 원문과 정답표는 사이트에 올려 두지 않았고/);
});
test('a graph line extends with the scroll, linearly, and is whole without the script',()=>{
 assert.equal(M.drawn(900,900),0);assert.equal(M.drawn(1200,900),0);assert.equal(M.drawn(300,900),1);
 const mid=M.drawn(700,900),next=M.drawn(600,900),after=M.drawn(500,900);
 assert.ok(mid>0&&mid<next&&next<after&&after<1);assert.ok(Math.abs((next-mid)-(after-next))<1e-9);
 assert.match(css,/\.growth-lines\{clip-path:inset\([^)]*var\(--dp,1\)/);assert.match(css,/scaleX\(calc\(var\(--v,1\) \* min\(1,var\(--dp,1\) \* 1\.7\)\)\)/);
 assert.match(css,/@media print\{\.growth-lines\{clip-path:none!important\}/);
 assert.match(js,/removeProperty\('--dp'\)/);
});
test('every picture added to the introduction exists, has its size and says what it shows',()=>{
 const imgs=[...html.matchAll(/<img\b[^>]*>/g)].map(m=>m[0]).filter(t=>/20261111|roadmap-level-lanes/.test(t));
 assert.equal(imgs.length,13);
 for(const t of imgs){
  const src=t.match(/src="([^"]+)"/)[1];assert.ok(readFileSync(new URL(src,import.meta.url)).length>10000,src);
  assert.match(t,/width="\d+" height="\d+"/);assert.match(t,/loading="lazy"/);assert.ok(t.match(/alt="([^"]*)"/)[1].length>15,src);
 }
 for(const old of ['roadmap-program-map-20261101','roadmap-program-graph-20261101','roadmap-program-table-20261101'])assert.doesNotMatch(html,new RegExp(old));
});
test('the example typed in is the one the screens and the graph were made from',()=>{
 assert.match(html,/<dt>교과<\/dt><dd>디딤돌 기본\+응용 5-2<\/dd>/);assert.match(html,/<dt>심화<\/dt><dd>최상위 수학 5-1<\/dd>/);
 assert.match(html,/<dt>사고력<\/dt><dd>1031 입문<\/dd>/);assert.match(html,/<dt>연산<\/dt><dd>기적의 계산법 6권 · 두 자리 수 곱셈<\/dd>/);
 assert.equal((html.match(/class="line-(now|near|far)"/g)||[]).length,3);assert.equal((html.match(/class="key-(now|near|far)"/g)||[]).length,3);
 assert.match(html,/class="growth-chart" role="img" aria-label="[^"]{30,}"/);
});
test('the book test is described as it is: ten books, marked by hand, not yet joined to the roadmap',()=>{
 assert.match(html,/id="bookTest"/);assert.match(html,/1031·팩토·필즈·<br>3% 올림피아드/);assert.match(html,/차후 업데이트/);assert.doesNotMatch(html,/1과정 10권/);
 assert.match(html,/<a href="#unitTest">지금 쓸 수 있는 초등 교과 단원테스트 보기<\/a>/);
 assert.match(html,/번호마다 ○·✕를 누르면, ✕가 나온 문항을 영역별로 묶어/);
 assert.doesNotMatch(html,/사고력 권별 테스트는 준비하고 있습니다/);
});
