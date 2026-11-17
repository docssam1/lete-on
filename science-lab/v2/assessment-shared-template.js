// Reuse the existing GFIELD page builder; science only adapts question content.
import {layoutWorksheetPages,PRINT_TEMPLATE_OPTIONS} from '../../fields-classic/question-bank/print-templates.js?v=20261023';
import {sourceTableHtml,assessmentTitle} from './source-presentation.js?v=20261116-assessment-language';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const settings=m=>({cover:'none',unit:'none',form:'exam',cols:m.cols==='2'?'2':'1',pageNo:m.pageNo!==false});
const adapter=questions=>questions.map(q=>({type:{id:q.id,middle:'과학',label:'과학'}}));
const info={title:'과학 평가',footLabel:'GFIELD · 지필드'};
function givenLabel(label,value){
 if(!['연습 자료','연습자료'].includes(label))return label;
 const text=Array.isArray(value)?value.join(' / '):typeof value==='string'?value:'';
 return /(?:^|[\n/])\s*ㄱ[ .]/.test(text)&&/(?:^|[\n/])\s*ㄴ[ .]/.test(text)?'보기':'자료';
}
function modelOf({unit,items,course,title,scope=[],form=null,prefix='ap',cols='1',pageNo=true}){
 return {unit:typeof unit==='string'?unit:unit.id,course,title:assessmentTitle(title||unit.title),scope,form,prefix,cols:cols==='2'?'2':'1',pageNo,
  questions:items.map((q,i)=>({id:q.id,no:prefix==='ap'?q.sourceRef.no:i+1,set:q.sourceRef.set,prompt:q.prompt,givens:Object.fromEntries(Object.entries(q.givens||{}).map(([k,v])=>[k==='가상 관찰 자료'?'자료':Object.hasOwn(q.givens,givenLabel(k,v))?k:givenLabel(k,v),v?.caption==='가상 관찰 자료'?{...v,caption:'자료'}:v])),choices:q.choices,responseForm:q.answerContract.type,points:Number.isFinite(q.points)&&q.points>0?q.points:null}))};
}
export function initialExamGroups(model){
 const questions=model.questions,grid=layoutWorksheetPages({cards:questions.map((_,i)=>`<i data-exam-index="${i}"></i>`),questions:adapter(questions),settings:settings(model),info,book:null}).grid;
 return [...grid.matchAll(/<section class="question-page"[\s\S]*?<\/section>/g)].map(page=>[...page[0].matchAll(/data-exam-index="(\d+)"/g)].map(m=>questions[Number(m[1])]));
}
function material(givens){return Object.entries(givens||{}).map(([label,value])=>{
 const table=sourceTableHtml(value?.caption==='가상 관찰 자료'?{...value,caption:'자료'}:value);
 return `<div class="exam-material">${table||`<b>${esc(givenLabel(label,value))}</b><p>${esc(Array.isArray(value)?value.join('\n'):value)}</p>`}</div>`;
}).join('');}
function card(q){return `<article class="q-item question-card" data-paper-item="${esc(q.id)}"><div class="q-head"><span class="q-num">${esc(q.no)}.</span><span class="q-pts">[${q.points??'　'}점]</span></div><p class="q-stem">${esc(q.prompt)}</p>${material(q.givens)}${q.choices?`<ol class="exam-choices">${q.choices.map((c,i)=>`<li><span>${'①②③④⑤'[i]}</span>${esc(c)}</li>`).join('')}</ol>`:''}${q.responseForm==='written-explanation'?'<div class="workspace ap-writing" aria-label="답 쓰는 칸"></div>':`<p class="answer-line${q.responseForm==='short-text'?' ap-short':''}">답 <i></i></p>`}</article>`;}
function heading(m,group){const form=group[0]?.set===2?'B형':'A형',allPoints=group.every(q=>q.points!=null),sum=allPoints?group.reduce((s,q)=>s+q.points,0):'';
 return `<header class="sheet-head"><div><p class="sheet-course">지필드 · ${esc(m.course)}</p><h1 class="sheet-title">${esc(m.title)} · ${form}</h1></div><table class="score-table" aria-label="배점표"><tbody><tr><th scope="row">문항</th>${group.map(q=>`<td>${esc(q.no)}</td>`).join('')}<td>합계</td></tr><tr><th scope="row">점수</th>${group.map(q=>`<td>${q.points??''}</td>`).join('')}<td class="total">${sum}</td></tr></tbody></table><div class="sheet-info"><span class="sheet-fields"><span>이름 <i></i></span><span>반 <i></i></span><span>날짜 <i></i></span></span><span>${m.questions.filter(q=>q.set===group[0]?.set).length}문항</span></div></header><p class="sheet-rule">${m.scope.map(esc).join(' · ')}</p>`;
}
export function renderExamGroups(m,groups){return groups.map((group,i)=>{
 const cards=group.map(card),grid=layoutWorksheetPages({cards,questions:adapter(group),settings:settings(m),info,book:null}).grid;
 const cut=Math.ceil(cards.length/2),body=m.cols==='2'?`<div class="exam-column">${cards.slice(0,cut).join('')}</div><div class="exam-column">${cards.slice(cut).join('')}</div>`:cards.join('');
 return grid.replace(cards.join(''),'').replace(/^<section[^>]+>/,`<section class="sheet exam-page" data-exam-page="${i}" aria-label="${i+1}쪽">${heading(m,group)}<div class="sheet-body${m.cols==='2'?' cols-2':''}">${body}</div>`).replace('class="pt-pg">1<',`class="pt-pg">${m.pageNo?`${group[0]?.set===2?'B형':'A형'} · ${i+1} / ${groups.length}`:''}<`);
}).join('');}
function groupsFor(m){return [1,2].filter(set=>m.questions.some(q=>q.set===set)).flatMap(set=>initialExamGroups({...m,questions:m.questions.filter(q=>q.set===set)}));}
export function assessmentStudentExam(config){const m=modelOf(config),id=esc(m.unit),form=m.form;
 const navigation=form?`<a class="btn" href="#/${id}/exam/${form}">평가로</a><a class="btn" href="#/${id}/exam/${form}/teacher">교사 해설</a>`:`<a class="btn" href="#/${id}/exam/1">A형 풀기</a><a class="btn" href="#/${id}/exam/2">B형 풀기</a><a class="btn" href="#/${id}/print/teacher">교사 해설</a><a class="btn" href="#/${id}/print/quick">빠른 정답표</a>`;
 return `<div class="science-exam pt-form-exam"><nav class="exam-tools no-print" aria-label="시험지 인쇄 설정">${navigation}<fieldset><legend>단 수</legend>${PRINT_TEMPLATE_OPTIONS.cols.map(o=>`<button type="button" class="btn" data-exam-cols="${o.id}" aria-pressed="${m.cols===o.id}">${esc(o.label)}</button>`).join('')}</fieldset><label><input type="checkbox" data-exam-page-no${m.pageNo?' checked':''}>쪽 번호</label><button type="button" class="btn primary" data-exam-print disabled>A4 인쇄</button><p role="status" data-print-status>글꼴을 준비하고 있어요.</p></nav><main class="exam-pages">${renderExamGroups(m,groupsFor(m))}</main><template data-exam-model>${esc(JSON.stringify(m))}</template></div>`;
}
export function wireAssessmentStudentExam(root){
 const outer=root.querySelector('.science-exam');if(!outer)return()=>{};
 const m=JSON.parse(outer.querySelector('[data-exam-model]').content.textContent),pages=outer.querySelector('.exam-pages'),print=outer.querySelector('[data-exam-print]'),status=outer.querySelector('[data-print-status]');let active=true,ready=false;
 const overflow=page=>{const body=page.querySelector('.sheet-body'),rect=body.getBoundingClientRect();return [...body.querySelectorAll('[data-paper-item]')].some(q=>q.getBoundingClientRect().bottom>rect.bottom+1||q.scrollWidth>q.clientWidth+2);};
 const draw=()=>{
  print.disabled=true;let groups=groupsFor(m);pages.innerHTML=renderExamGroups(m,groups);
  // Keep every question at its original size. Move a long question onto its own page.
  for(let i=0;i<groups.length;i++)while(groups[i].length>1&&overflow(pages.children[i])){const moved=groups[i].pop();groups.splice(i+1,0,[moved]);pages.innerHTML=renderExamGroups(m,groups);}
  const bad=[...pages.children].filter(overflow);print.disabled=bad.length>0;status.textContent=bad.length?'지면을 넘는 문항이 있어요. 1단으로 바꾸어 확인해 주세요.':`${groups.length}쪽 · 인쇄할 준비가 되었습니다.`;
  if(bad.length)status.textContent='지면을 넘는 문항이 있어요. 1단으로 바꾸어 확인해 주세요.';
  outer.querySelectorAll('[data-exam-cols]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.examCols===m.cols)));
 };
 const change=e=>{const button=e.target.closest('[data-exam-cols]');if(button){m.cols=button.dataset.examCols;if(ready)draw();}else if(e.type==='change'&&e.target.matches('[data-exam-page-no]')){m.pageNo=e.target.checked;if(ready)draw();}};
 const doPrint=e=>{if(e.target.closest('[data-exam-print]')&&!print.disabled)window.print();};outer.addEventListener('click',change);outer.addEventListener('change',change);outer.addEventListener('click',doPrint);
 document.fonts.ready.then(()=>{if(active&&root.isConnected){ready=true;draw();}}).catch(()=>{if(active)status.textContent='글꼴을 준비하지 못했어요. 다시 열어 주세요.';});
 return()=>{active=false;outer.removeEventListener('click',change);outer.removeEventListener('change',change);outer.removeEventListener('click',doPrint);};
}
