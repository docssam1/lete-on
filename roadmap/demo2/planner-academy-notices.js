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
// ── 달력 보기 ── 날짜가 확인된 일정만 칸에 놓는다. 게시일(publishedAt)은 일정이 아니므로 쓰지 않는다.
const DAY_MS=864e5,weekdays=['일','월','화','수','목','금','토'];
const pad=n=>String(n).padStart(2,'0');
// 날짜·시각 문자열을 서울 날짜(YYYY-MM-DD)로. exclusive면 그 시각 직전(마감 시각이 0시인 접수의 마지막 날).
function seoulDay(v,exclusive=false){
 if(!validDate(v))return '';
 if(!v.includes('T'))return exclusive?addDays(v,-1):v;
 return new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(Date.parse(v)-(exclusive?1:0)));
}
function addDays(d,n){const t=Date.parse(String(d).slice(0,10)+'T00:00:00Z');return Number.isNaN(t)?'':new Date(t+n*DAY_MS).toISOString().slice(0,10);}
function validMonth(m){return typeof m==='string'&&/^20\d\d-(0[1-9]|1[0-2])$/.test(m);}
function monthDays(m){return new Date(Date.UTC(Number(m.slice(0,4)),Number(m.slice(5,7)),0)).getUTCDate();}
function shiftMonth(m,n){if(!validMonth(m))return '';const i=Math.min(2099*12+11,Math.max(2000*12,Number(m.slice(0,4))*12+Number(m.slice(5,7))-1+n));return Math.floor(i/12)+'-'+pad(i%12+1);}
// 일요일부터 시작하는 주 단위 격자. 그 달이 아닌 칸은 null.
function monthGrid(m){
 if(!validMonth(m))return [];
 const cells=[...Array(new Date(m+'-01T00:00:00Z').getUTCDay()).fill(null),...Array.from({length:monthDays(m)},(_,i)=>m+'-'+pad(i+1))];
 while(cells.length%7)cells.push(null);
 return Array.from({length:cells.length/7},(_,i)=>cells.slice(i*7,i*7+7));
}
function expandRange(start,end,max=400){
 if(!validDate(start)||start.includes('T'))return [];
 if(!validDate(end)||end.includes('T')||end<start)end=start;
 const out=[];for(let d=start;d&&d<=end&&out.length<max;d=addDays(d,1))out.push(d);return out;
}
// 달력 격자의 키보드 이동. 옮길 곳이 없으면 ''.
function moveDay(d,key,shift=false){
 if(!validDate(d)||d.includes('T'))return '';
 const dow=new Date(d+'T00:00:00Z').getUTCDay(),step={ArrowLeft:-1,ArrowRight:1,ArrowUp:-7,ArrowDown:7,Home:-dow,End:6-dow}[key];
 if(step!==undefined){const next=addDays(d,step);return validDate(next)?next:'';}
 if(key!=='PageUp'&&key!=='PageDown')return '';
 const m=shiftMonth(d.slice(0,7),(key==='PageUp'?-1:1)*(shift?12:1));return m+'-'+pad(Math.min(Number(d.slice(8,10)),monthDays(m)));
}
// 칸에 쓰는 짧은 종류 이름은 일정 이름에서 읽는다. 읽히지 않으면 공지 종류로 넘겨짚지 않고 '일정'으로 둔다.
const entryTypes=[[/설명회/,'설명회','seminar'],[/시험|테스트/,'시험','test'],[/접수|예약|신청/,'접수','apply'],[/개강|수업 시작/,'개강','etc'],[/상담/,'상담','etc'],[/모집/,'모집','etc']];
function entryType(label){const t=entryTypes.find(t=>t[0].test(label));return t?{type:t[1],tone:t[2]}:{type:'일정',tone:'etc'};}
// 확인된 공지의 일정과 접수 기간을 하루 단위로 펼친다.
function entries(items){
 const out=[];
 for(const x of items||[]){
  if(x.dateStatus!=='confirmed')continue;
  const put=(start,end,label,note,registration)=>{const days=expandRange(start,end),t=registration?{type:'접수',tone:'apply'}:entryType(label);days.forEach((date,i)=>out.push({date,id:x.id,academy:x.academy,kind:x.kind,label,note:note||'',registration,type:t.type,tone:t.tone,start:days[0],end:days.at(-1),part:days.length===1?'single':i===0?'start':i===days.length-1?'end':'middle'}));};
  const r=x.registration,span=e=>{const s=seoulDay(e.date),t=e.through?seoulDay(e.through):s;return [s,t<s?s:t];};
  let rs='',re='';
  if(r){rs=seoulDay(r.start);re=seoulDay(r.end,r.end.includes('T')||r.endExclusive===true);if(re<rs)re=rs;}
  // 접수 기간과 같은 범위를 한 번 더 적은 일정은 접수 한 줄로 합친다.
  const twin=rs?(x.events||[]).find(e=>{const [s,t]=span(e);return s===rs&&t===re;}):null;
  if(rs)put(rs,re,'접수',r.label||twin?.note,true);
  for(const e of x.events||[]){if(e===twin)continue;const [s,t]=span(e);if(s)put(s,t,e.label,e.note,false);}
 }
 return out;
}
// 날짜별로 묶는다. 하루짜리·시작·마감을 먼저, 기간 중간 날은 뒤로.
function groupByDate(list){
 const map={},rank=e=>e.part==='middle'?1:0;
 for(const e of list||[])(map[e.date]||=[]).push(e);
 for(const d of Object.keys(map))map[d].sort((a,b)=>rank(a)-rank(b));
 return map;
}
// 달력에 필요한 자료. 기간 필터는 쓰지 않고(달 이동이 그 역할) 단계·과목·학원·종류만 적용한다.
function calendar(stage,subject='전체',filters={},today=day()){
 const data=select(stage,subject,{...filters,when:'all'},today),placed=entries(data.items),byDate=groupByDate(placed),ids=new Set(placed.map(e=>e.id));
 const month=validMonth(filters.month)?filters.month:today.slice(0,7),days=Object.keys(byDate).filter(d=>d.startsWith(month)).sort();
 const selected=validDate(filters.day)&&!filters.day.includes('T')&&filters.day.startsWith(month)?filters.day:today.startsWith(month)?today:days[0]||month+'-01';
 // 여러 날에 걸친 접수 기간은 날마다 세지 않고 한 건으로 센다.
 const monthCount=new Set(days.flatMap(d=>byDate[d].map(e=>[e.id,e.start,e.end,e.label].join('|')))).size;
 return {...data,today,month,selected,weeks:monthGrid(month),byDate,monthCount,undated:data.items.filter(x=>!ids.has(x.id))};
}
function dayText(d){return Number(d.slice(5,7))+'월 '+Number(d.slice(8,10))+'일 '+weekdays[new Date(d+'T00:00:00Z').getUTCDay()]+'요일';}
function dayLabel(d,count,today){return dayText(d)+(d===today?', 오늘':'')+', '+(count?'일정 '+count+'건':'일정 없음');}
function chipText(e){return e.type+(e.part==='start'?' 시작':e.part==='end'?(e.registration?' 마감':' 끝'):e.part==='middle'?' 중':'');}
function dayState(e,x,today=day()){
 if(e.date<today)return {label:'지난 일정',code:'past'};
 const s=status(x,today);
 if(s.code==='review'||(e.registration&&['open','upcoming','closed'].includes(s.code)))return s;
 return {label:e.date===today?'오늘 일정':'예정 일정',code:'upcoming'};
}
function postItem(x,arrow){const s=status(x),a=feed.academies.find(a=>a.id===x.academy),date=x.events.find(e=>e.date.slice(0,10)>=day())||x.events[0];return '<button type="button" class="ast-post ast-notice-post" data-ast-post="notice-'+esc(x.id)+'"><span class="ast-post-tag"><b>'+esc(a.name)+'</b><span>'+esc(x.branch)+' · '+esc(kinds[x.kind])+'</span></span><strong>'+esc(x.title)+'</strong><span><em class="ast-notice-state state-'+s.code+'">'+esc(s.label)+'</em> '+(date?esc((s.code==='open'||s.code==='upcoming')&&x.registration?(s.code==='open'?'접수 마감 ':'접수 시작 ')+when(s.code==='open'?x.registration.end:x.registration.start):date.label+' '+when(date.date)+(date.through?'~'+when(date.through):'')):x.publishedAt?'게시 '+esc(when(x.publishedAt)):'날짜는 원문에서 확인')+'</span>'+(arrow?'<i aria-hidden="true">↗</i>':'')+'</button>';}
function calendarCell(d,cal){
 if(!d)return '<div role="gridcell" class="ast-cal-cell is-out"></div>';
 const list=cal.byDate[d]||[],n=list.length,shown=n>3?list.slice(0,2):list,name=e=>feed.academies.find(a=>a.id===e.academy)?.name||'학원';
 return '<div role="gridcell" class="ast-cal-cell" aria-selected="'+(d===cal.selected)+'"><button type="button" class="ast-cal-day'+(d<cal.today?' is-past':'')+'" data-cal-day="'+d+'" tabindex="'+(d===cal.selected?0:-1)+'"'+(d===cal.today?' aria-current="date"':'')+' aria-label="'+esc(dayLabel(d,n,cal.today))+'"><span class="ast-cal-date"><span class="ast-cal-num">'+Number(d.slice(8,10))+'</span>'+(d===cal.today?'<span class="ast-cal-today">오늘</span>':'')+'</span>'+(n?'<span class="ast-cal-chips">'+shown.map(e=>'<span class="ast-cal-chip tone-'+e.tone+(e.part==='middle'?' is-middle':'')+'"><b>'+esc(name(e))+'</b><span>'+esc(chipText(e))+'</span></span>').join('')+(n>shown.length?'<span class="ast-cal-more">+'+(n-shown.length)+'</span>':'')+'</span><span class="ast-cal-count'+(list.every(e=>e.part==='middle')?' is-ongoing':'')+'">'+n+'건</span>':'')+'</button></div>';
}
function panelMarkup(cal){
 const list=cal.byDate[cal.selected]||[];
 return '<h3>'+esc(dayText(cal.selected))+(cal.selected===cal.today?' · 오늘':'')+' <span>일정 '+list.length+'건</span></h3>'+(list.length?'<div class="ast-post-list">'+list.map(e=>{const x=cal.items.find(x=>x.id===e.id),a=feed.academies.find(a=>a.id===e.academy),s=dayState(e,x,cal.today),range=e.part==='single'?'':when(e.start)+' ~ '+when(e.end);return '<button type="button" class="ast-post ast-notice-post ast-cal-row" data-ast-post="notice-'+esc(x.id)+'"><span class="ast-post-tag"><b>'+esc(a?.name||'학원')+'</b><span>'+esc(x.branch)+' · '+esc(kinds[x.kind])+'</span></span><strong>'+esc(e.registration?chipText(e):e.label+(e.part==='single'?'':' ·'+chipText(e).slice(e.type.length)))+'</strong><span><em class="ast-notice-state state-'+s.code+'">'+esc(s.label)+'</em> '+esc([range,e.note,x.title].filter(Boolean).join(' · '))+'</span></button>';}).join('')+'</div>':'<p class="ast-empty">이 날에는 날짜가 확인된 일정이 없습니다.</p>');
}
function dayPanel(stage,subject,filters){return panelMarkup(calendar(stage,subject,filters));}
function calendarMarkup(cal){
 const title=m=>Number(m.slice(0,4))+'년 '+Number(m.slice(5,7))+'월',prev=shiftMonth(cal.month,-1),next=shiftMonth(cal.month,1);
 return '<div class="ast-cal"><div class="ast-cal-bar"><h3 id="astCalTitle">'+title(cal.month)+'</h3><div class="ast-cal-nav"><button type="button" data-cal-nav="prev" aria-label="이전 달, '+title(prev)+'">이전 달</button><button type="button" data-cal-nav="today" aria-label="오늘, '+esc(dayText(cal.today))+'">오늘</button><button type="button" data-cal-nav="next" aria-label="다음 달, '+title(next)+'">다음 달</button></div></div><div class="ast-cal-grid" role="grid" aria-labelledby="astCalTitle" data-cal-month="'+cal.month+'"><div role="row" class="ast-cal-week ast-cal-head">'+weekdays.map(w=>'<span role="columnheader" aria-label="'+w+'요일">'+w+'</span>').join('')+'</div>'+cal.weeks.map(w=>'<div role="row" class="ast-cal-week">'+w.map(d=>calendarCell(d,cal)).join('')+'</div>').join('')+'</div><section class="ast-cal-panel" aria-label="고른 날의 일정">'+panelMarkup(cal)+'</section><section class="ast-cal-undated" aria-labelledby="astCalUndated"><h3 id="astCalUndated">날짜는 원문에서 확인할 공지 '+cal.undated.length+'건</h3>'+'<p>달력에는 날짜가 확인된 일정과 접수 기간만 놓았습니다. 게시일은 일정으로 보지 않습니다.'+(cal.undated.length?' 아래 공지는 날짜를 확인하지 못해 따로 모았습니다. 일정은 공식 원문에서 확인해 주세요.':' 이 조건에서는 날짜를 따로 확인해야 할 공지가 없습니다.')+'</p>'+(cal.undated.length?'<div class="ast-post-list">'+cal.undated.slice(0,120).map(x=>postItem(x,false)).join('')+'</div>':'')+'</section></div>';
}
function render(stage,subject,filters={}){
 const cal=filters.view==='calendar'?calendar(stage,subject,filters):null,data=cal||select(stage,subject,filters),opts=(xs,value)=>xs.map(([v,t])=>'<option value="'+esc(v)+'"'+(v===value?' selected':'')+'>'+esc(t)+'</option>').join('');
 return '<section class="ast-notices'+(cal?' is-calendar':'')+'" aria-label="학원 공지와 일정 게시판"><div class="ast-notice-controls"><label>학원<select data-notice-filter="academy">'+opts([['all','전체 학원'],...data.names.map(a=>[a.id,a.name])],data.filters.academy)+'</select></label><label>종류<select data-notice-filter="kind">'+opts([['all','전체 공지'],...Object.entries(kinds)],data.filters.kind)+'</select></label>'+(cal?'':'<label>기간<select data-notice-filter="when">'+opts([['recent','최근 공지'],['upcoming','예정·진행 일정'],['past','지난 일정'],['all','전체 기록']],data.filters.when)+'</select></label>')+'</div>'+(cal?'':'<p class="ast-notice-policy">날짜가 확인된 일정과 원문 확인이 필요한 공지를 구분합니다.</p>')+'<div class="ast-notice-meta"><div class="ast-notice-view" role="group" aria-label="공지 보기 방식">'+[['list','목록'],['calendar','달력']].map(([v,t])=>'<button type="button" data-notice-view="'+v+'" aria-pressed="'+(cal?v==='calendar':v==='list')+'">'+t+'</button>').join('')+'</div><span role="status" aria-live="polite">'+(loading?'공지 불러오는 중 · ':error?'공지를 새로 불러오지 못했습니다 · ':'')+(cal?Number(cal.month.slice(5,7))+'월 일정 '+cal.monthCount+'건':data.items.length+'개 공지')+'</span><button type="button" data-notice-retry>새로 확인</button></div>'+(cal?calendarMarkup(cal):'<div class="ast-post-list">'+data.items.slice(0,120).map(x=>postItem(x,true)).join('')+'</div>'+(data.items.length?'':'<p class="ast-empty">이 조건에서 확인된 공지가 없습니다. 아래 학원별 공식 공지처도 살펴보세요.</p>'))+'<details class="ast-notice-sources"><summary>학원별 공식 공지처와 확인 상태</summary>'+data.names.map(a=>{const source=feed.sources.filter(s=>s.academy===a.id),latest=source.map(s=>s.lastSuccessAt||'').sort().at(-1),delayed=source.some(s=>s.status!=='ok');return '<p><b>'+esc(a.name)+'</b> '+(a.url?'<a href="'+esc(a.url)+'" target="_blank" rel="noopener noreferrer">공식 공지처 ↗</a>':'공식 공지처 확인 중')+'<small>'+(latest?'목록 확인 '+esc(latest):'')+(delayed?' · 자동 확인 지연 · 원문 확인':'')+'</small></p>';}).join('')+'</details><p class="ast-notice-foot">매일 17시부터 공식 공지를 확인합니다. '+(feed.generatedAt?'최근 확인 작업 '+esc(new Intl.DateTimeFormat('ko-KR',{timeZone:'Asia/Seoul',dateStyle:'short',timeStyle:'short'}).format(new Date(feed.generatedAt))):'')+' · 접수 가능 여부는 공식 신청 페이지에서 확인해 주세요.</p></section>';
}
function detail(x){const a=feed.academies.find(a=>a.id===x.academy),s=status(x);return '<small>'+esc(a?.name||'학원 공지')+' · '+esc(x.branch)+' · '+esc(kinds[x.kind])+'</small><h2 id="academyPostTitle">'+esc(x.title)+'</h2><p class="ast-focus"><b class="ast-notice-state state-'+s.code+'">'+esc(s.label)+'</b></p>'+(x.scheduleText?'<p>'+esc(x.scheduleText)+'</p>':'')+(x.registration?'<aside class="ast-notice-registration"><h3>예약·접수</h3><p>'+esc(x.registration.label||when(x.registration.start)+' ~ '+when(x.registration.end))+'</p></aside>':'')+(x.events.length?'<ol class="ast-notice-dates">'+x.events.map(e=>'<li><strong>'+esc(e.label)+'</strong><span>'+esc(when(e.date)+(e.through?' ~ '+when(e.through):''))+'</span>'+(e.note?'<p>'+esc(e.note)+'</p>':'')+'</li>').join('')+'</ol>':'<p>날짜·시간·대상 과정은 공식 원문에서 확인해 주세요. 게시일을 시험일이나 설명회 날짜로 바꾸어 표시하지 않습니다.</p>')+(s.code==='review'?'<p class="ast-notice-alert">원문 변경 또는 접근 지연으로 일정 재확인이 필요합니다. 아래 날짜는 마지막으로 검토한 기록입니다.</p>':'')+'<a class="ast-notice-source" href="'+esc(x.url)+'" target="_blank" rel="noopener noreferrer">공식 공지 원문 보기 ↗</a><p class="ast-notice-foot">'+(x.publishedAt?'게시 '+esc(x.publishedAt)+' · ':'')+(x.checkedAt?'일정·목록 검토 '+esc(x.checkedAt):'')+(x.scheduleCheckedAt?' · 원문 변경 확인 '+esc(x.scheduleCheckedAt):'')+'</p>'+(x.related?'<button type="button" data-ast-post="'+esc(x.related)+'">수업 준비와 입학 절차도 보기 ↗</button>':'');}
function changed(){if(typeof g.dispatchEvent==='function')g.dispatchEvent(new g.CustomEvent('roadmap-notices-ready'));}
async function load(){if(pending)return pending;loading=true;error=false;changed();pending=(async()=>{try{const r=await g.fetch('data/academy-notices.json?v=1',{cache:'no-store',signal:g.AbortSignal.timeout(15000)});if(!r.ok)throw Error('load');ingest(await r.json());}catch{error=true;}finally{loading=false;pending=null;changed();}})();return pending;}
g.PlannerAcademyNotices=Object.freeze({kinds,validate,ingest,select,status,find,render,detail,load,seoulDay,addDays,shiftMonth,monthGrid,expandRange,moveDay,entries,groupByDate,calendar,dayLabel,dayPanel});
if(typeof document!=='undefined')load();
})(window);
