'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path');
const N=require('../challenge/variant-numeric-extension.js'),V=require('../challenge/variant-provider.js');
const root=path.resolve(__dirname,'../..'),out=path.join(root,'hyper-focus/output/qa/challenge-numeric-extension');
const sum=a=>a.reduce((s,x)=>s+x,0),range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i),perm=a=>a.length?a.flatMap((x,i)=>perm(a.filter((_,j)=>j!==i)).map(p=>[x,...p])):[[]];
const unique=a=>[...new Set(a.map(x=>JSON.stringify(x)))].map(x=>JSON.parse(x));
const one=a=>{a=unique(a);assert.equal(a.length,1,'intended result must be unique');return a[0];};
const fruitNames={apple:'사과',pear:'배',berry:'딸기',orange:'귤'};
const magicCache=new Map(),pairCache=new Map();
function solve(q){const p=q.payload,f=p.kind.replace('numeric-','');
 if(['story','age','reference-story'].includes(f)){let n=p.start;for(const c of p.changes){n+=c;assert(n>=0);}return n;}
 if(f==='reverse')return one(range(0,100).filter(n=>{let v=n;for(const c of p.changes){v+=c;if(v<0)return false;}return v===p.end;}));
 if(f==='distribute'){let rem=p.total;for(let i=0;i<p.groups;i++)rem-=p.each;return rem-p.used+p.extra;}
 if(f==='two-groups')return p.groups.reduce((total,row)=>total+sum(row),0)-p.last;
 if(f==='transfer')return p.afterDonor!==null?p.afterDonor+p.moved:one(range(0,p.total).filter(donor=>p.total-donor+p.moved-p.back===p.afterReceiver));
 if(f==='rank-gap'){const line=range(1,p.total),a=p.front+p.extra,b=line.at(-p.back);return line.filter(i=>i>a&&i<b).length;}
 if(f==='chain')return one(range(0,60).flatMap(circle=>range(0,60).filter(box=>circle+p.known===p.total&&circle+p.add-p.extra-box===p.end).map(box=>box)));
 if(f==='tree'){const values=[],all=[p.total,...p.known];let parent=p.total;for(const k of p.known){const child=one(range(1,80).filter(v=>k+v===parent));values.push(child);all.push(child);parent=child;}assert.equal(new Set(all).size,all.length);return values;}
 if(f==='digit'){const n=one(range(10,99).filter(n=>Math.floor(n/10)+n%10===p.digitSum&&(p.givenTens!==null?Math.floor(n/10)===p.givenTens:Math.floor(n/10)-n%10===p.tensExcess)));return n-p.subtract+p.extra;}
 if(f==='maximum'){const candidates=range(0,99).filter(n=>p.lower.every(v=>n>v)&&p.upper.every(v=>n<v)&&n%2===p.parity);assert(candidates.length>1);return Math.max(...candidates);}
 if(f==='digit-select')return p.options.filter(n=>{const digits=String(n).split('').map(Number);return digits.length===2&&n%2===p.parity&&(!p.compare||(p.greater?digits[1]>digits[0]:digits[1]<digits[0]))&&(!p.minSum||sum(digits)>p.minSum);});
 if(f==='pair-sum'){const found=[];for(let a=1;a<=p.max;a++)for(let b=1;b<=p.max;b++)if(new Set([a,b,p.known]).size===3&&a+b+p.known===p.total)found.push([a,b].sort((x,y)=>x-y));return unique(found).length;}
 if(f==='card-rank'){const possible=range(10,99).filter(n=>p.cards.includes(Math.floor(n/10))&&p.cards.includes(n%10)&&Math.floor(n/10)!==n%10);return possible.at(-p.largestRank)-possible[p.smallestRank-1];}
 if(f==='card-pairs'){function rows(rem,i){if(i===p.targets.length)return rem.length?[]:[[]];const found=[];for(const a of rem)for(const b of rem)if(a<b&&a+b===p.targets[i])for(const tail of rows(rem.filter(n=>n!==a&&n!==b),i+1))found.push([[a,b],...tail]);return found;}return one(rows(p.cards,0));}
 if(['house','queue','order','circle'].includes(f)){const solutions=perm(p.people).filter(row=>(!p.anchor||row[0]===p.anchor)&&p.relations.every(rel=>{const [a,b,c]=rel.args,A=row.indexOf(a),B=row.indexOf(b),C=row.indexOf(c);if(rel.kind==='between')return A>Math.min(B,C)&&A<Math.max(B,C);if(rel.kind==='before')return A<B;if(rel.kind==='next')return B-A===1;if(rel.kind==='notLast')return A!==row.length-1;if(rel.kind==='place')return A===b;if(rel.kind==='clockwise')return row[(A+c)%row.length]===b;throw Error('unknown relation');}));return one(solutions.map(row=>p.query!==null?row[p.query]:p.anchor?row.slice(1):row));}
 if(f==='assign')return one(perm(p.items).filter(a=>p.not.every(([i,j])=>a[i]!==p.items[j])&&(!p.fixed||p.fixed.every(([i,j])=>a[i]===p.items[j]))));
  if(f==='length'){const totals=p.rows.map(row=>row.rod*(row.objectCount||1)+sum(row.clips));if(p.equalGroups){for(const[a,b]of p.equalGroups)assert.equal(totals[a],totals[b]);}else assert(totals.every(n=>n===totals[0]));const [a,b]=p.query,[countA,countB]=p.queryCounts||[1,1];return p.rows[a].rod*countA-p.rows[b].rod*countB;}
 if(f==='domino-one'||f==='domino-pair'){assert(p.left.length>=2);assert(p.left.every(n=>n>=0&&n<=6)&&p.right.every(n=>n>=0&&n<=6));const step=values=>one(range(-3,3).filter(s=>s!==0&&p.positions.every((ix,j)=>values[0]+(ix-p.positions[0])*s===values[j]))),a=p.left[0]+step(p.left)*p.queryIndex,b=p.right[0]+step(p.right)*p.queryIndex;assert(a>=0&&a<=6&&b>=0&&b<=6);return f==='domino-one'?b:[a,b];}
 if(f==='cancel'){const counts={};for(const i of p.order)counts[p.kinds[i]]=(counts[p.kinds[i]]||0)+1;return p.kinds.filter(k=>counts[k]%2).map(k=>fruitNames[k]);}
 if(f==='balance'){const answers=[];for(const ordering of perm(p.kinds)){const weights=Object.fromEntries(ordering.map((k,i)=>[k,4-i]));if(p.pans.every(s=>Math.sign(sum(s.left.map(k=>weights[k]))-sum(s.right.map(k=>weights[k])))===Math.sign(s.tilt)))answers.push(ordering.map(k=>fruitNames[k]));}return one(answers);}
 if(f==='domino-sums'){const possible=[],fixedRows=p.missingFixedIndex===null?[p.fixed]:range(0,6).map(n=>p.fixed.map((v,i)=>i===p.missingFixedIndex?n:v));for(const fixed of fixedRows){const[a,b,c,d]=fixed;for(let x=0;x<=6;x++)for(let y=0;y<=6;y++)for(let z=0;z<=6;z++)for(let w=0;w<=6;w++){const v=[x,y,z,w],missing=p.missingFixedIndex===null?[]:[fixed[p.missingFixedIndex]];if(x+a+y===p.target&&y+b+c===p.target&&z+c+d===p.target&&x+w+d===p.target&&Object.entries(p.given).every(([i,n])=>v[i]===n)&&new Set(v.map((n,i)=>[n,fixed[i]].sort().join(','))).size===4&&(!p.blankDistinct||new Set([...v,...missing]).size===5))possible.push([...v.filter((_,i)=>p.given[i]===undefined),...missing]);}}return one(possible);}
 if(f==='magic'){const key=p.values.join(',');if(!magicCache.has(key))magicCache.set(key,perm(p.values));return one(magicCache.get(key).filter(a=>Object.entries(p.givens).every(([i,n])=>a[i]===n)&&p.lines.every(ids=>sum(ids.map(i=>a[i]))===p.target)&&(!p.pairClue||sum(p.pairClue.indices.map(i=>a[i]))===p.pairClue.total)));}
 if(f==='preference'){const possible=[];const rows=range(0,15).map(n=>range(0,3).map(i=>(n>>i)&1)).filter(a=>sum(a)===p.each);for(const a of rows)for(const b of rows)for(const c of rows)for(const d of rows){const m=[a,b,c,d];if(p.facts.every(([i,j,v])=>m[i][j]===v)&&p.totals.every((n,j)=>sum(m.map(row=>row[j]))===n))possible.push(m);}return one(possible);}
 if(f==='period'){const shapes=[],colors=[];while(shapes.length<p.through)shapes.push(...p.shapes);while(colors.length<p.through)colors.push(...p.colors);const shNames={circle:'동그라미',triangle:'세모',square:'네모',star:'별'},wanted=p.colors[p.targetColor],countAt=i=>p.counts?p.counts[(i-1)%p.counts.length]:1,matches=range(p.from,p.through).filter(i=>shapes[i-1]===p.targetShape&&colors[i-1]===wanted&&(!p.counts||countAt(i)===p.targetCount));assert(p.position>p.shown);return[colors[p.position-1]+' '+shNames[shapes[p.position-1]]+(p.counts?' '+countAt(p.position)+'개':''),matches.length];}
 if(f==='code'){const weights=[];for(let c=1;c<=20;c++)for(let b=1;b<=10;b++)if(p.examples.every(e=>e.circle*c+e.bars*b===e.value))weights.push([c,b]);const[c,b]=one(weights);return sum(p.shown.map(s=>s.circle*c+s.bars*b));}
 if(f==='fruit-equations'){function assign(i,a){if(i===p.kinds.length)return p.equations.every(e=>sum(e.terms.map(([id,sign])=>a[id]*sign))===e.value)?[a]:[];return range(1,9).flatMap(n=>assign(i+1,[...a,n]));}const answer=one(assign(0,[]));return sum(p.query.map(i=>answer[i]));}
 if(f==='machines'){const models=p.groups.map(g=>{const functions=[{run:n=>n/2,inverse:n=>n*2},...range(-12,12).map(k=>({run:n=>n+k,inverse:n=>n-k})),{run:n=>n*2,inverse:n=>n/2}];const compatible=functions.filter(f=>g.examples.every(([a,b])=>f.run(a)===b));assert.equal(compatible.length,1);return compatible[0];});if(p.chains)return p.chains.map(q=>q.input===null?one(range(0,100).filter(n=>q.operations.reduce((v,i)=>models[i].run(v),n)===q.output)):q.operations.reduce((v,i)=>models[i].run(v),q.input));return p.groups.map((g,i)=>g.query[0]===null?models[i].inverse(g.query[1]):models[i].run(g.query[0]));}
 throw Error('No independent checker: '+f);
}
function boundaryCheck(q){
 if(q.payload.kind==='numeric-domino-one'){assert.equal(q.resultContract,'draw-dots');assert(Number.isInteger(q.answer)&&q.answer>=1&&q.answer<=6,'The drawing response must add visible dots.');}
 if(q.payload.kind==='numeric-length'&&q.payload.objectCatalog){
  assert.equal(q.payload.unitKey,'clip','Length unit must be an explicit clip.');
  assert.deepEqual(q.payload.objectCatalog.map(item=>item.kind),['eraser','pencil','clip'],'Exactly eraser, pencil, and clip must be declared.');
  assert.deepEqual(q.payload.objectCatalog.map(item=>item.label),['지우개','연필','클립'],'The three visible object names must be preserved.');
  assert.equal((q.problemHtml.match(/data-legend-item=/g)||[]).length,3,'The object key must show all three objects once.');
  for(const label of ['지우개','연필','클립'])assert(q.problemHtml.includes('>'+label+'</text>'),'Missing visible object-key label: '+label);
  const rowKinds=new Set(q.payload.rows.flatMap(row=>row.items.map(item=>item.kind)));
  assert.deepEqual([...rowKinds].sort(),['clip','eraser','pencil'],'Every length relation must contain the same three object kinds.');
   for(const row of q.payload.rows){
    assert.equal(sum(row.items.map(item=>item.lengthUnits)),row.rod*(row.objectCount||1)+sum(row.clips),'Visible item lengths must equal the solver row total.');
    assert.equal(row.items.filter(item=>item.kind==='clip').length,sum(row.clips),'Every clip unit must be explicit in the visible item order.');
    assert.equal(row.items.filter(item=>item.kind===row.kind).length,row.objectCount||1,'Every measured object must be explicit in the visible item order.');
   }
   const eraserRow=q.payload.rows.find(row=>row.objectKey==='eraser');
   assert(eraserRow,'The measured relation needs an eraser row.');
   assert.equal(eraserRow.objectCount,2,'The measured relation must show two separate erasers.');
   assert.equal(eraserRow.items.filter(item=>item.kind==='eraser').length,2,'Two eraser items must be independently modeled.');
   assert.deepEqual(q.payload.queryCounts,[1,2],'The question must compare one pencil with the joined length of two erasers.');
   assert(q.prompt.includes('지우개 2개를 이은 길이'),'The child-facing question must name the two-eraser comparison.');
  for(const kind of ['eraser','pencil','clip'])assert(q.problemHtml.includes(`data-object-kind="${kind}"`),'Missing rendered object kind: '+kind);
 }
 if(q.payload.kind==='numeric-period'&&q.variant.difficulty==='hard'){
  const p=q.payload,unseen=[];for(let i=Math.max(p.from,p.shown+1);i<=p.through;i++){const shape=p.shapes[(i-1)%p.shapes.length],color=p.colors[(i-1)%p.colors.length],count=p.counts?p.counts[(i-1)%p.counts.length]:1;if(shape===p.targetShape&&color===p.colors[p.targetColor]&&(!p.counts||count===p.targetCount))unseen.push(i);}
  assert(unseen.length>=1,'A hard counting response must include an unseen matching item.');
 }
 if(q.payload.kind==='numeric-card-pairs'){assert.equal(q.resultContract,'nested-set');assert.equal(q.answerEquivalence.outerOrder,'fixed');assert.equal(q.answerEquivalence.innerOrder,'irrelevant');assert.equal(q.answerEquivalence.uniqueCards,true);}
}
function equivalentAnswer(q,response){
 const correct=solve(q);
 if(q.resultContract!=='nested-set')return JSON.stringify(response)===JSON.stringify(correct);
 if(!Array.isArray(response)||response.length!==correct.length||response.some((row,i)=>!Array.isArray(row)||row.length!==q.answerEquivalence.rowSizes[i]||row.some(v=>!Number.isInteger(v))))return false;
 if(new Set(response.flat()).size!==response.flat().length)return false;
 return response.every((row,i)=>JSON.stringify([...row].sort((a,b)=>a-b))===JSON.stringify([...correct[i]].sort((a,b)=>a-b)));
}
async function run(){const sources=V.list().map(r=>({row:r,source:V.getSource(r)})).filter(x=>N.supports(x.source));let checks=0,negative=0;const report={stage:N.STAGE,sourceCount:sources.length,levels:{easy:0,same:0,hard:0},coverage:[],failures:[]};
  for(const {row,source} of sources){const levels=N.levels(source),entry={key:row.key,typeId:source.typeId,levels,distinct:{}};for(const difficulty of ['easy','same','hard']){if(!levels[difficulty])continue;report.levels[difficulty]++;const generated=new Set();for(let seed=1;seed<=40;seed++){try{const before=JSON.stringify(source),q=N.generate(source,difficulty,seed),actual=solve(q);assert.deepEqual(q.answer,actual);assert.equal(JSON.stringify(source),before);assert.equal(JSON.stringify(N.generate(source,difficulty,seed)),JSON.stringify(q));assert(Object.isFrozen(q)&&Object.isFrozen(q.payload));assert(q.solution.length>=8);assert.equal(q.learnerFit.learner_stage,'6세 / 유치원');for(const key of ['language','representations','prerequisites','reasoning-load','response-mode'])assert(q.learnerFit[key]);assert.notEqual(q.prompt+q.problemHtml,source.prompt+source.problemHtml);boundaryCheck(q);generated.add(JSON.stringify(q.payload));checks++;const bad=typeof q.answer==='number'?q.answer+1:'wrong-'+JSON.stringify(q.answer);assert.notDeepEqual(actual,bad);negative++;}catch(e){report.failures.push({key:row.key,difficulty,seed,message:e.message});break;}}entry.distinct[difficulty]=generated.size;if(generated.size<10)report.failures.push({key:row.key,difficulty,message:'Fewer than 10 distinct models'});}report.coverage.push(entry);}
 for(const s of [{typeId:'unrelated',payload:{}},{...sources[0].source,payload:{}},{typeId:'r3-main-2',payload:{kind:'roll',start:1,changes:[2]}}])assert.equal(N.supports(s),false);
 assert.throws(()=>N.generate(sources[0].source,'same',NaN));assert.throws(()=>N.generate(sources[0].source,'invalid',1));
 const oneSource=id=>sources.find(s=>s.source.typeId===id).source;
 let bad=JSON.parse(JSON.stringify(N.generate(oneSource('r3-main-17'),'same',2)));bad.payload.not=[];assert.throws(()=>solve(bad));negative++;
 bad=JSON.parse(JSON.stringify(N.generate(oneSource('r2-fruit-logic-table'),'same',2)));bad.payload.facts=[];assert.throws(()=>solve(bad));negative++;
 bad=JSON.parse(JSON.stringify(N.generate(oneSource('replace-magic-triangle'),'same',2)));bad.payload.givens={};assert.throws(()=>solve(bad));negative++;
 bad=JSON.parse(JSON.stringify(N.generate(oneSource('extra-circle-bar-code'),'same',2)));bad.payload.examples.push({...bad.payload.examples[0],value:999});assert.throws(()=>solve(bad));negative++;
 const boundaries={seeds:100,drawingCases:0,unseenPeriodCases:0,nestedSetCases:0,equivalentPositive:0,equivalentNegative:0};
 for(let seed=1;seed<=100;seed++){
  for(const difficulty of ['easy','same','hard']){
   const dot=N.generate(oneSource('r3-main-8'),difficulty,seed);assert.deepEqual(dot.answer,solve(dot));boundaryCheck(dot);boundaries.drawingCases++;
   const cards=N.generate(oneSource('extra-card-distribution'),difficulty,seed);boundaryCheck(cards);assert.deepEqual(cards.answer,solve(cards));boundaries.nestedSetCases++;
   // Every possible choice of swapping the two cards inside each fixed box is equivalent.
   for(let mask=0;mask<2**cards.answer.length;mask++){const response=cards.answer.map((row,i)=>mask&(1<<i)?[...row].reverse():[...row]);assert(equivalentAnswer(cards,response));boundaries.equivalentPositive++;}
   const swappedBoxes=cards.answer.map(row=>[...row]);[swappedBoxes[0],swappedBoxes[1]]=[swappedBoxes[1],swappedBoxes[0]];
   const duplicateCard=cards.answer.map(row=>[...row]);duplicateCard[0][1]=duplicateCard[0][0];
   const foreignCard=cards.answer.map(row=>[...row]);foreignCard[0][0]=99;
   for(const response of [swappedBoxes,duplicateCard,foreignCard,cards.answer.slice(1)]){assert.equal(equivalentAnswer(cards,response),false);boundaries.equivalentNegative++;negative++;}
  }
  const period=N.generate(oneSource('extra-independent-color-shape-period'),'hard',seed);assert.deepEqual(period.answer,solve(period));boundaryCheck(period);boundaries.unseenPeriodCases++;
 }
 const zero=JSON.parse(JSON.stringify(N.generate(oneSource('r3-main-8'),'hard',8)));zero.payload.left=[5,3];zero.payload.right=[4,2];zero.payload.positions=[0,2];zero.payload.queryIndex=4;zero.answer=0;assert.equal(solve(zero),0);assert.throws(()=>boundaryCheck(zero));negative++;
 const onlyVisible=JSON.parse(JSON.stringify(N.generate(oneSource('extra-independent-color-shape-period'),'hard',39)));onlyVisible.payload.through=onlyVisible.payload.shown;onlyVisible.answer=solve(onlyVisible);assert.throws(()=>boundaryCheck(onlyVisible));negative++;
 report.boundaries=boundaries;
 report.checks=checks;report.negative=negative;report.status=report.failures.length?'failed':'passed';
 fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'math-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 if(process.argv.includes('--render'))await render(sources);
 if(report.failures.length)process.exitCode=1;return report;
}
async function render(sources){const{chromium}=require('playwright'),browser=await chromium.launch({headless:true}),page=await browser.newPage({viewport:{width:1100,height:1300}}),visual=[];
 await page.route('**/*',async route=>{const u=new URL(route.request().url());const relative=u.pathname.replace(/^\/hyper-focus\//,'');const file=path.resolve(root,'hyper-focus',relative);if(u.origin==='http://numeric.test'&&file.startsWith(path.join(root,'hyper-focus'))&&fs.existsSync(file)&&fs.statSync(file).isFile())return route.fulfill({path:file});return route.fulfill({body:'',contentType:'text/plain'});});
 await page.goto('http://numeric.test/hyper-focus/challenge/');
 const css='body{font:18px/1.7 "Malgun Gothic",sans-serif;color:#203b54;margin:0;background:#edf2f5}.sheet{box-sizing:border-box;width:794px;min-height:1122px;background:white;margin:20px auto;padding:42px}.problem{font-size:20px;white-space:pre-line}.art{margin:24px 0}.art svg{max-width:100%}table{border-collapse:collapse;width:100%}th,td{border:1px solid #90a6b3;padding:8px;text-align:center}.answer{border-top:1px solid #ccc;font-size:15px;margin-top:45px}.edition-conditions{border:1px solid #bacdd8;padding:10px 18px}.edition-conditions p{margin:7px 0}@media print{body{background:white}.sheet{width:210mm;height:297mm;min-height:0;margin:0;break-after:page;padding:12mm}.answer{font-size:14px}@page{size:A4;margin:0}}';
 let sheets=[];for(const {row,source} of sources){const d=N.levels(source).hard?'hard':'same',seed=source.typeId==='r3-main-8'?8:39,q=N.generate(source,d,seed),html=`<section class="sheet" data-id="${source.typeId}"><h3>${row.key} · ${d}</h3><div class="problem">${q.prompt}</div><div class="art">${q.problemHtml}</div><p>답: _____________________</p><div class="answer"><p>${q.answerHtml}</p>${q.solution}</div></section>`;sheets.push(html);await page.setContent(`<base href="http://numeric.test/hyper-focus/challenge/"><style>${css}</style>${html}`);await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.complete?Promise.resolve():new Promise(r=>{i.onload=r;i.onerror=r})));});const info=await page.evaluate(()=>{const sh=document.querySelector('.sheet'),r=sh.getBoundingClientRect(),overflow=[];for(const e of sh.querySelectorAll('text,rect,circle,path,polygon,table,.problem,.answer')){const b=e.getBoundingClientRect();if(b.left<r.left-1||b.right>r.right+1||b.bottom>r.bottom+1)overflow.push(e.tagName);}return {overflow,images:[...document.querySelectorAll('image')].map(i=>i.getAttribute('href'))};});assert.deepEqual(info.overflow,[],source.typeId);await page.locator('.sheet').screenshot({path:path.join(out,source.typeId+'.png')});visual.push({typeId:source.typeId,difficulty:d,seed,...info});}
 await page.setContent(`<base href="http://numeric.test/hyper-focus/challenge/"><style>${css}</style>${sheets.join('')}`);await page.pdf({path:path.join(out,'numeric-extension-proof.pdf'),format:'A4',printBackground:true});
 await page.setViewportSize({width:390,height:844});await page.addStyleTag({content:'@media screen and (max-width:500px){.sheet{width:100%;min-height:0;padding:18px;margin:8px 0}.problem{font-size:17px}}'});const overflow=await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);assert.equal(overflow,false,'390px horizontal overflow');
 fs.writeFileSync(path.join(out,'visual-report.json'),JSON.stringify({desktop:1100,mobile:390,a4:'35 pages, one per source',horizontalOverflow:overflow,rows:visual},null,2));await browser.close();
}
if(require.main===module)run().catch(e=>{console.error(e);process.exitCode=1;});module.exports={solve,boundaryCheck,equivalentAnswer,run};
