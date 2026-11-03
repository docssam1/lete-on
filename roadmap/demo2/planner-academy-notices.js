/* Public notice metadata only. Learner plans and authentication are not read here. */
(function(g){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kinds={notice:'공지',admission:'모집·접수',test:'시험',seminar:'설명회'};
let feed={academies:[],sources:[],items:[],generatedAt:null},loading=false,error=false,pending=null;
const day=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
function validDate(v){if(typeof v!=='string'||!/^20\d\d-\d\d-\d\d(?:T\d\d:\d\d:\d\d(?:\+09:00|Z))?$/.test(v))return false;const d=v.slice(0,10);return !Number.isNaN(Date.parse(v))&&new Date(d+'T00:00:00Z').toISOString().startsWith(d);}
function url(v,hosts){try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password&&(!u.port||u.port==='443')&&hosts.has(u.hostname)?u.href:'';}catch{return '';}}
function validate(raw){
 if(raw?.schemaVersion!==1||!Array.isArray(raw.academies)||!Array.isArray(raw.items)||!Array.isArray(raw.sources)||raw.academies.length>100||raw.items.length>600)throw Error('invalid feed');
 const hosts=new Set(['blog.naver.com','apply.dailystudy.com','fieldsgood.co.kr','www.fieldsgood.co.kr','soma1.somai.co.kr']);
 // Source hostnames are fixed by the installed registry, not supplied by an article.
 for(const h of ['somai.co.kr','kiparang.co.kr','imsc21.com','ensight-academy.com','thinkeng.co','peakacademy.kr','proud7.com','edisen.co.kr','miedu.co.kr','jprep.co.kr','twinkledaechi.com']){hosts.add(h);hosts.add('www.'+h);}
 const academies=raw.academies.filter(a=>/^[a-z0-9-]+$/.test(a.id)&&typeof a.name==='string'&&Array.isArray(a.stages)).map(a=>({id:a.id,name:a.name.slice(0,80),subject:a.subject,stages:a.stages.filter(x=>['preschool','elementary','middle','high'].includes(x)),url:url(a.url,hosts)}));
 const ids=new Set(academies.map(a=>a.id)),sources=raw.sources.filter(s=>ids.has(s.academy)&&url(s.url,hosts)).map(s=>({...s,url:url(s.url,hosts)}));
 const items=raw.items.filter(x=>ids.has(x.academy)&&/^[a-zA-Z0-9가-힣_-]+$/.test(x.id)&&typeof x.title==='string'&&Object.hasOwn(kinds,x.kind)&&url(x.url,hosts)).map(x=>({id:x.id.slice(0,140),academy:x.academy,sourceId:x.sourceId,branch:String(x.branch||'지점은 원문 확인').slice(0,50),kind:x.kind,title:x.title.slice(0,180),url:url(x.url,hosts),publishedAt:validDate(x.publishedAt)?x.publishedAt:null,checkedAt:validDate(x.checkedAt)?x.checkedAt:null,scheduleCheckedAt:validDate(x.scheduleCheckedAt)?x.scheduleCheckedAt:null,sourceState:['changed','delayed','unchanged'].includes(x.sourceState)?x.sourceState:null,stages:(x.stages||[]).filter(s=>['preschool','elementary','middle','high'].includes(s)&&!(s==='preschool'&&x.kind==='test')),scheduleText:String(x.scheduleText||'').slice(0,350),dateStatus:x.dateStatus==='confirmed'?'confirmed':'unconfirmed',related:/^[a-z0-9-]+$/.test(x.related||'')?x.related:null,registration:x.registration&&validDate(x.registration.start)&&validDate(x.registration.end)?{start:x.registration.start,end:x.registration.end,endExclusive:x.registration.endExclusive===true,label:String(x.registration.label||'').slice(0,150)}:null,events:(x.events||[]).filter(e=>validDate(e.date)&&(!e.through||validDate(e.through))).map(e=>({date:e.date,through:e.through||null,label:String(e.label||'일정').slice(0,70),note:String(e.note||'').slice(0,180)}))}));
 return {academies,sources,items,generatedAt:typeof raw.generatedAt==='string'&&Number.isFinite(Date.parse(raw.generatedAt))?raw.generatedAt:null};
}
function ingest(raw){feed=validate(raw);return feed;}
function dates(x){return [...x.events.map(e=>e.through||e.date),...(x.registration?[x.registration.end]:[])];}
function status(x,today=day(),now=Date.now()){
 const last=dates(x).map(s=>s.slice(0,10)).sort().at(-1);
 if(x.dateStatus==='confirmed'&&last&&last<today)return {label:'지난 일정',code:'past'};
 if(x.sourceState==='changed')return {label:'원문 변경 · 재확인',code:'review'};
 if(x.sourceState==='delayed')return {label:'원문 확인 지연',code:'review'};
 if(x.dateStatus!=='confirmed'||!dates(x).length)return {label:'원문 일정 확인',code:'unknown'};

 if(x.registration){const r=x.registration,stamp=s=>s.includes('T')?Date.parse(s):Date.parse(s+'T00:00:00+09:00');
  if(stamp(r.start)>now)return {label:'접수 예정',code:'upcoming'};
  const closed=r.end.includes('T')?now>=stamp(r.end):today>r.end;
  if(!closed)return {label:'접수 기간',code:'open'};
  return {label:'접수 마감 · 후속 일정',code:'closed'};
 }
 return {label:x.events.some(e=>e.date.slice(0,10)===today)?'오늘 일정':'예정 일정',code:'upcoming'};
}
function select(stage,subject='전체',filters={},today=day()){
 const names=feed.academies.filter(a=>a.stages.includes(stage)&&(subject==='전체'||a.subject===subject));const ids=new Set(names.map(a=>a.id));
 const academy=names.some(a=>a.id===filters.academy)?filters.academy:'all',kind=Object.hasOwn(kinds,filters.kind)?filters.kind:'all',when=['recent','upcoming','past','all'].includes(filters.when)?filters.when:'recent';
 const items=feed.items.filter(x=>ids.has(x.academy)&&x.stages.includes(stage)&&(academy==='all'||x.academy===academy)&&(kind==='all'||x.kind===kind)).filter(x=>{
  const s=status(x,today);return when==='all'||when==='past'?when==='all'||s.code==='past':when==='upcoming'?['open','upcoming','closed'].includes(s.code):s.code!=='past';
 }).sort((a,b)=>{const first=x=>dates(x).filter(d=>d.slice(0,10)>=today).sort()[0]||'9999';return first(a).localeCompare(first(b))||(b.publishedAt||'').localeCompare(a.publishedAt||'');});
 return {names,items,filters:{academy,kind,when}};
}
function when(v){if(!validDate(v))return '';if(v.includes('T'))return new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',month:'long',day:'numeric',hour:'numeric',minute:'2-digit',hour12:false}).format(new Date(v));return v.replace(/^(\d{4})-(\d{2})-(\d{2})$/,'$1.$2.$3');}
function find(id){const x=feed.items.find(x=>'notice-'+x.id===id);return x?{...x,id,stage:x.stages[0],notice:true}:null;}
function render(stage,subject,filters){
 const data=select(stage,subject,filters),opts=(xs,value)=>xs.map(([v,t])=>'<option value="'+esc(v)+'"'+(v===value?' selected':'')+'>'+esc(t)+'</option>').join('');
 return '<section class="ast-notices" aria-label="학원 공지와 일정 게시판"><div class="ast-notice-controls"><label>학원<select data-notice-filter="academy">'+opts([['all','전체 학원'],...data.names.map(a=>[a.id,a.name])],data.filters.academy)+'</select></label><label>종류<select data-notice-filter="kind">'+opts([['all','전체 공지'],...Object.entries(kinds)],data.filters.kind)+'</select></label><label>기간<select data-notice-filter="when">'+opts([['recent','최근 공지'],['upcoming','예정·진행 일정'],['past','지난 일정'],['all','전체 기록']],data.filters.when)+'</select></label></div><p class="ast-notice-policy">날짜가 확인된 일정과 원문 확인이 필요한 공지를 구분합니다.</p><div class="ast-notice-meta"><span role="status" aria-live="polite">'+(loading?'공지 불러오는 중 · ':error?'공지를 새로 불러오지 못했습니다 · ':'')+data.items.length+'개 공지</span><button type="button" data-notice-retry>새로 확인</button></div><div class="ast-post-list">'+data.items.slice(0,120).map(x=>{const s=status(x),a=feed.academies.find(a=>a.id===x.academy),date=x.events.find(e=>e.date.slice(0,10)>=day())||x.events[0];return '<button type="button" class="ast-post ast-notice-post" data-ast-post="notice-'+esc(x.id)+'"><span class="ast-post-tag"><b>'+esc(a.name)+'</b><span>'+esc(x.branch)+' · '+esc(kinds[x.kind])+'</span></span><strong>'+esc(x.title)+'</strong><span><em class="ast-notice-state state-'+s.code+'">'+esc(s.label)+'</em> '+(date?esc((s.code==='open'||s.code==='upcoming')&&x.registration?(s.code==='open'?'접수 마감 ':'접수 시작 ')+when(s.code==='open'?x.registration.end:x.registration.start):date.label+' '+when(date.date)+(date.through?'~'+when(date.through):'')):x.publishedAt?'게시 '+esc(when(x.publishedAt)):'날짜는 원문에서 확인')+'</span><i aria-hidden="true">↗</i></button>';}).join('')+'</div>'+(data.items.length?'':'<p class="ast-empty">이 조건에서 확인된 공지가 없습니다. 아래 학원별 공식 공지처도 살펴보세요.</p>')+'<details class="ast-notice-sources"><summary>학원별 공식 공지처와 확인 상태</summary>'+data.names.map(a=>{const source=feed.sources.filter(s=>s.academy===a.id),latest=source.map(s=>s.lastSuccessAt||'').sort().at(-1),delayed=source.some(s=>s.status!=='ok');return '<p><b>'+esc(a.name)+'</b> '+(a.url?'<a href="'+esc(a.url)+'" target="_blank" rel="noopener noreferrer">공식 공지처 ↗</a>':'공식 공지처 확인 중')+'<small>'+(latest?'목록 확인 '+esc(latest):'')+(delayed?' · 자동 확인 지연 · 원문 확인':'')+'</small></p>';}).join('')+'</details><p class="ast-notice-foot">매일 17시부터 공식 공지를 확인합니다. '+(feed.generatedAt?'최근 확인 작업 '+esc(new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',dateStyle:'short',timeStyle:'short'}).format(new Date(feed.generatedAt))):'')+' · 접수 가능 여부는 공식 신청 페이지에서 확인해 주세요.</p></section>';
}
function detail(x){const a=feed.academies.find(a=>a.id===x.academy),s=status(x);return '<small>'+esc(a?.name||'학원 공지')+' · '+esc(x.branch)+' · '+esc(kinds[x.kind])+'</small><h2 id="academyPostTitle">'+esc(x.title)+'</h2><p class="ast-focus"><b class="ast-notice-state state-'+s.code+'">'+esc(s.label)+'</b></p>'+(x.scheduleText?'<p>'+esc(x.scheduleText)+'</p>':'')+(x.registration?'<aside class="ast-notice-registration"><h3>예약·접수</h3><p>'+esc(x.registration.label||when(x.registration.start)+' ~ '+when(x.registration.end))+'</p></aside>':'')+(x.events.length?'<ol class="ast-notice-dates">'+x.events.map(e=>'<li><strong>'+esc(e.label)+'</strong><span>'+esc(when(e.date)+(e.through?' ~ '+when(e.through):''))+'</span>'+(e.note?'<p>'+esc(e.note)+'</p>':'')+'</li>').join('')+'</ol>':'<p>날짜·시간·대상 과정은 공식 원문에서 확인해 주세요. 게시일을 시험일이나 설명회 날짜로 바꾸어 표시하지 않습니다.</p>')+(s.code==='review'?'<p class="ast-notice-alert">원문 변경 또는 접근 지연으로 일정 재확인이 필요합니다. 아래 날짜는 마지막으로 검토한 기록입니다.</p>':'')+'<a class="ast-notice-source" href="'+esc(x.url)+'" target="_blank" rel="noopener noreferrer">공식 공지 원문 보기 ↗</a><p class="ast-notice-foot">'+(x.publishedAt?'게시 '+esc(x.publishedAt)+' · ':'')+(x.checkedAt?'일정·목록 검토 '+esc(x.checkedAt):'')+(x.scheduleCheckedAt?' · 원문 변경 확인 '+esc(x.scheduleCheckedAt):'')+'</p>'+(x.related?'<button type="button" data-ast-post="'+esc(x.related)+'">수업 준비와 입학 절차도 보기 ↗</button>':'');}
function changed(){if(typeof g.dispatchEvent==='function')g.dispatchEvent(new g.CustomEvent('roadmap-notices-ready'));}
async function load(){if(pending)return pending;loading=true;error=false;changed();pending=(async()=>{try{const r=await g.fetch('data/academy-notices.json?v=1',{cache:'no-store',signal:g.AbortSignal.timeout(15000)});if(!r.ok)throw Error('load');ingest(await r.json());}catch{error=true;}finally{loading=false;pending=null;changed();}})();return pending;}
g.PlannerAcademyNotices=Object.freeze({kinds,validate,ingest,select,status,find,render,detail,load});
if(typeof document!=='undefined')load();
})(window);
