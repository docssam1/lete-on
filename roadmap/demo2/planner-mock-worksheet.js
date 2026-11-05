/* Assemble selected question images in the visitor's browser. The public site
 * stores only official URLs, file hashes and reviewed crop coordinates. */
(function(g){'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const base=g.document?.currentScript?.src||g.location?.href||'https://roadmap.gfieldacademy.net/roadmap/demo2/planner.html';
const asset=n=>new URL(n,base).href;
let engine;
function layoutFor(p){return g.PlannerMockPaperLayoutData?.[p?.id]||null;}
function validate(options){
 const p=g.PlannerMockSchedule?.resolvePaper(options?.paper),s=p&&g.PlannerMockItems?.restoreSelection(options?.selection,p),layout=layoutFor(p);
 if(!p||!s||s.projected||!s.selected.length)return{error:'현재 배운 단원에서 풀 문항을 먼저 선택해 주세요.'};
 if(!layout||layout.sourceUrl!==p.files?.problem||!/^https:\/\/wdown\.ebsi\.co\.kr\/W\d+\/.+\.pdf$/i.test(layout.sourceUrl)||!/^[a-f0-9]{64}$/.test(layout.sha256))return{error:'이 회차는 원문 문항 배치를 확인하고 있습니다. 확인되지 않은 위치로 문제를 잘라 인쇄하지 않습니다.'};
 const items=s.selected.map(n=>layout.items?.find(q=>q.number===n));
 if(items.some(q=>!q||!Number.isInteger(q.page)||q.page<1||q.page>layout.pageCount||!Array.isArray(q.rect)||q.rect.length!==4||q.rect.some(n=>!Number.isFinite(n))||q.rect[2]<=q.rect[0]||q.rect[3]<=q.rect[1]))return{error:'선택 문항의 원문 위치를 모두 확인하지 못했습니다.'};
 for(const q of items){const page=layout.pages[q.page-1];if(!page||q.rect[0]<0||q.rect[1]<0||q.rect[2]>page.width||q.rect[3]>page.height)return{error:'원문 문항 위치가 페이지 범위를 벗어납니다.'};}
 return{paper:p,selection:s,layout,items};
}
function shell(p,s,date){return `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><title>${esc(p?.title||'기출')} · 선택 문항 학습지</title><link rel="stylesheet" href="${asset('planner-mock-worksheet.css?v=20261106-worksheets1')}"></head><body><nav class="mw-tools"><div><strong>선택 문항 학습지</strong><p>${esc(p?.title)} · ${esc(date||'학습일 직접 기록')}</p></div><label>단 수 <select data-columns><option value="1">1단 · 넉넉하게</option><option value="2">2단 · 모아 보기</option></select></label><button data-print disabled>학습지 인쇄</button><button data-guide disabled>결과 기록지</button><a href="${esc(p?.files?.problem||'#')}" target="_blank" rel="noopener noreferrer">공식 원본 확인</a><p data-status role="status">공식 원문에서 선택한 문항을 불러오고 있습니다.</p><p>A4 · 배율 100% · 브라우저 머리글·바닥글 끄기</p></nav><main class="mw-pages" aria-label="선택 문항 학습지"></main></body></html>`;}
function makePage(d,p,s,date,columns){
 const page=d.createElement('article');page.className='mw-page';
 page.innerHTML=`<header class="mw-header"><p>지필드 영재교육 · ${s.mode==='remedial'?'보완 후 재점검':'현재 진도별 학습'}</p><h1>${s.mode==='remedial'?'재점검 문제 학습지':'기출 문제 학습지'}</h1><p class="mw-paper">${esc(p.title)} · ${s.selected.length}문항</p><div class="mw-name"><span>이름 <i></i></span><span>학습일 ${esc(date||'__________')}</span><span>풀이 시간 <i></i>분</span></div></header><div class="mw-columns" data-columns="${columns}">${Array.from({length:columns},()=>'<div class="mw-column"></div>').join('')}</div><footer><span>출처: EBSi 공식 기출 · 원문 번호 유지</span><span data-page-number></span></footer>`;
 d.querySelector('.mw-pages').append(page);return page;
}
function paginate(d,data,images,columns,date){
 d.querySelector('.mw-pages').replaceChildren();let page=makePage(d,data.paper,data.selection,date,columns),column=page.querySelector('.mw-column'),ci=0;
 for(const [i,x]of images.entries()){
  const card=d.createElement('section');card.className='mw-question';card.dataset.questionNumber=x.number;
  const q=g.PlannerMockItems.items(data.paper).find(q=>q.number===x.number),u=g.PlannerMockItems.UNIT[g.PlannerMockItems.focusUnit(data.selection,q)];
  card.innerHTML=`<div class="mw-q-head"><strong>${i+1}. <span>원문 ${x.number}번</span></strong><span>${esc(u?.title||'단원 확인 중')}${x.points?' · '+x.points+'점':''}</span></div><img alt="${esc(data.paper.title+' '+x.number+'번 원문 문제와 도형')}" src="${x.url}" width="${x.width}" height="${x.height}"><div class="mw-work"><span>풀이 · 답</span></div>`;
  const img=card.querySelector('img');img.style.width=Math.min(x.width/x.scale*25.4/72,columns===1?146:83)+'mm';
  column.append(card);
  if(column.scrollHeight>column.clientHeight+1&&column.children.length>1){card.remove();ci++;if(ci>=columns){page=makePage(d,data.paper,data.selection,date,columns);ci=0;}column=page.querySelectorAll('.mw-column')[ci];column.append(card);}
  if(column.scrollHeight>column.clientHeight+1){const space=column.clientHeight-card.querySelector('.mw-q-head').offsetHeight-card.querySelector('.mw-work').offsetHeight-24,scale=Math.min(1,space/img.offsetHeight);if(scale<=0)throw Error('문항 배치를 위한 여백을 확보하지 못했습니다.');img.style.width=parseFloat(img.style.width)*scale+'mm';}
  if(column.scrollHeight>column.clientHeight+2)throw Error('문항이 페이지를 벗어나 인쇄를 중단했습니다.');
 }
 const pages=[...d.querySelectorAll('.mw-page')];pages.forEach((p,i)=>p.querySelector('[data-page-number]').textContent=(i+1)+' / '+pages.length+'쪽');return pages.length;
}
async function pdfEngine(){
 if(!engine)engine=import(asset('vendor/pdfjs/pdf.min.mjs')).then(x=>{x.GlobalWorkerOptions.workerSrc=asset('vendor/pdfjs/pdf.worker.min.mjs');return x;}).catch(e=>{engine=null;throw e;});return engine;
}
async function sourceBytes(layout){
 const c=new AbortController(),timer=setTimeout(()=>c.abort(),45000);
 try{const r=await fetch(layout.sourceUrl,{credentials:'omit',referrerPolicy:'no-referrer',signal:c.signal});if(!r.ok)throw Error('공식 PDF 응답 '+r.status);if(Number(r.headers.get('content-length'))>25000000)throw Error('원문 파일 크기를 확인해야 합니다.');const b=await r.arrayBuffer();if(b.byteLength>25000000||new TextDecoder().decode(new Uint8Array(b,0,Math.min(5,b.byteLength)))!=='%PDF-')throw Error('올바른 PDF 원문이 아닙니다.');const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',b))).map(n=>n.toString(16).padStart(2,'0')).join('');if(hash!==layout.sha256)throw Error('공식 원문 파일이 변경되었습니다. 문항 위치를 다시 확인해야 합니다.');return new Uint8Array(b);}finally{clearTimeout(timer);}
}
function trim(canvas,d){
 const ctx=canvas.getContext('2d',{willReadFrequently:true}),w=canvas.width,h=canvas.height,p=ctx.getImageData(0,0,w,h).data;let left=w,right=-1,top=h,bottom=-1;
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const i=(y*w+x)*4;if(p[i+3]>32&&Math.min(p[i],p[i+1],p[i+2])<225){if(x<left)left=x;if(x>right)right=x;if(y<top)top=y;if(y>bottom)bottom=y;}}
 if(right<0||bottom<0)throw Error('원문 문항이 비어 있어 출력하지 않았습니다.');
 const pad=10;left=Math.max(0,left-pad);top=Math.max(0,top-pad);right=Math.min(w,right+pad+1);bottom=Math.min(h,bottom+pad+1);
 const out=d.createElement('canvas');out.width=right-left;out.height=bottom-top;out.getContext('2d').drawImage(canvas,left,top,out.width,out.height,0,0,out.width,out.height);canvas.width=canvas.height=0;return out;
}
function stylesReady(d){
 const link=d.querySelector('link[rel="stylesheet"]');if(link?.sheet)return Promise.resolve();
 return new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('인쇄 서식을 불러오지 못했습니다. 다시 열어 주세요.')),30000);link.addEventListener('load',()=>{clearTimeout(timer);resolve();},{once:true});link.addEventListener('error',()=>{clearTimeout(timer);reject(Error('인쇄 서식을 불러오지 못했습니다.'));},{once:true});});
}
async function render(target,options,data){
 const d=target.document,status=d.querySelector('[data-status]'),urls=[];let pdf,task;
 target.addEventListener('beforeunload',()=>urls.forEach(u=>URL.revokeObjectURL(u)),{once:true});
 try{
  const [lib,bytes]=await Promise.all([pdfEngine(),sourceBytes(data.layout),stylesReady(d)]);if(target.closed)return;
  const support='https://cdn.jsdelivr.net/npm/pdfjs-dist@6.5.438/';
  task=lib.getDocument({data:bytes,ownerDocument:d,disableWorkerRendering:true,isEvalSupported:false,disableFontFace:false,useSystemFonts:false,withCredentials:false,cMapUrl:support+'cmaps/',cMapPacked:true,standardFontDataUrl:support+'standard_fonts/',wasmUrl:support+'wasm/',iccUrl:support+'iccs/'});pdf=await task.promise;
  if(pdf.numPages!==data.layout.pageCount)throw Error('원문 페이지 수가 바뀌어 문항 위치 확인이 필요합니다.');
  const images=[];
  for(const item of data.items){
   if(target.closed)return;status.textContent=`${data.items.length}문항 중 ${images.length+1}번째 · 원문 ${item.number}번 준비`;
   const p=await pdf.getPage(item.page),size=p.getViewport({scale:1}),expected=data.layout.pages[item.page-1];if(Math.abs(size.width-expected.width)>1||Math.abs(size.height-expected.height)>1)throw Error('원문 페이지 규격이 바뀌었습니다.');
   const scale=2.5,[x0,y0,x1,y1]=item.rect,canvas=d.createElement('canvas');canvas.width=Math.ceil((x1-x0)*scale);canvas.height=Math.ceil((y1-y0)*scale);
   await p.render({canvasContext:canvas.getContext('2d'),viewport:p.getViewport({scale}),transform:[1,0,0,1,-x0*scale,-y0*scale],background:'#ffffff'}).promise;
   const cropped=trim(canvas,d),blob=await new Promise(resolve=>cropped.toBlob(resolve,'image/png'));if(!blob)throw Error('문항 이미지를 만들지 못했습니다.');if(target.closed){cropped.width=cropped.height=0;return;}const url=URL.createObjectURL(blob);urls.push(url);images.push({number:item.number,points:item.points,width:cropped.width,height:cropped.height,scale,url});cropped.width=cropped.height=0;p.cleanup();
  }
  await Promise.all([d.fonts.load('600 22pt "Mock Worksheet Serif"','기출 문제 학습지'),d.fonts.load('400 10pt "Mock Worksheet Sans"','지필드 학습일'),...images.map(x=>{const img=d.createElement('img');img.src=x.url;return img.decode();})]);
  await d.fonts.ready;let columns=1;
  const place=()=>{const pages=paginate(d,data,images,columns,options.practiceDate);status.textContent=`선택한 ${images.length}문항 · ${pages}쪽 준비 완료. 인쇄 미리보기에서 문제와 도형을 확인하세요.`;};place();
  const print=d.querySelector('[data-print]');print.disabled=false;print.addEventListener('click',async()=>{await d.fonts.ready;await Promise.all([...d.images].map(i=>i.decode()));target.print();});
  d.querySelector('[data-columns]').addEventListener('change',e=>{columns=Number(e.target.value)===2?2:1;place();});
  const guide=d.querySelector('[data-guide]');guide.disabled=false;guide.addEventListener('click',()=>g.PlannerMockPrint.open(options));
  d.documentElement.dataset.worksheetReady='true';return{ok:true,questionNumbers:images.map(x=>x.number),pages:d.querySelectorAll('.mw-page').length};
 }catch(e){if(!target.closed){status.textContent='학습지를 만들지 못했습니다. '+(e?.message||'잠시 뒤 다시 시도해 주세요.');status.setAttribute('role','alert');d.querySelector('.mw-pages').replaceChildren();d.documentElement.dataset.worksheetError='true';}return{ok:false,error:String(e?.message||e)};}
 finally{if(target.closed)urls.forEach(u=>URL.revokeObjectURL(u));await task?.destroy();}
}
function open(options){
 const data=validate(options);if(data.error)return{ok:false,error:data.error};let target;
 try{target=g.open('about:blank','_blank');if(!target)return{ok:false,error:'팝업을 허용한 뒤 다시 눌러 주세요.'};target.opener=null;target.document.open();target.document.write(shell(data.paper,data.selection,options.practiceDate));target.document.close();target.focus?.();return{ok:true,window:target,ready:render(target,options,data)};}catch(e){target?.close();return{ok:false,error:'선택 문항 학습지를 열지 못했습니다.'};}
}
g.PlannerMockWorksheet=Object.freeze({validate,layoutFor,shell,paginate,open});
})(window);
