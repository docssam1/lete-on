/* KST attendance dates and a read-only wizard stamp card.
   No coin, account, progress, storage or network writes. The caller persists mark().attend. */
(function(root){
'use strict';
const KST=9*3600000;
const safeCount=v=>Number.isSafeInteger(v)&&v>=0?v:0;
function instant(now){const value=now===undefined?new Date():new Date(now);return Number.isFinite(value.getTime())?value:null;}
function dayKey(now){const value=instant(now);return value?new Date(value.getTime()+KST).toISOString().slice(0,10):'';}
function validDay(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const date=new Date(value+'T00:00:00Z');
  return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value&&value>='1970-01-01'&&value<='2100-12-31';
}
function knownDates(attend,today){
  const a=attend&&typeof attend==='object'?attend:{},raw=a.dates;
  const list=Array.isArray(raw)?raw:raw&&typeof raw==='object'?Object.keys(raw).filter(key=>!!raw[key]):[];
  const dates=list.filter(key=>validDay(key)&&key<=today);
  // The old aggregate knows exactly one date. Never invent the remaining days.
  if(validDay(a.last)&&a.last<=today)dates.push(a.last);
  return Array.from(new Set(dates)).sort();
}
function mark(attend,now){
  const a=attend&&typeof attend==='object'&&!Array.isArray(attend)?{...attend}:{},today=dayKey(now);
  // A clock/date rollback cannot create another visit or erase a later saved record.
  if(!validDay(today)||(validDay(a.last)&&today<a.last))return {attend:a,firstToday:false};
  const dates=knownDates(a,today),already=a.last===today||dates.includes(today),days=Math.max(safeCount(a.days),dates.length);
  if(!already)dates.push(today);
  const next={...a,last:today,days:Math.min(Number.MAX_SAFE_INTEGER,days+(already?0:1)),dates:dates.sort()};
  return {attend:next,firstToday:!already};
}
const words={
 ko:{title:'마법사의 출석 기록',lead:'오늘의 발걸음이 도장으로 남아요.',close:'닫기',prev:'지난달',next:'다음 달',today:'이번 달',total:'누적 출석',month:'선택한 달',selectedMonth:'선택한 달',saved:'날짜 기록',days:'일',stamp:'출석',current:'오늘',empty:'아직 기록된 출석 날짜가 없어요.',
  rules:'출석 코인 1개 · 하루 전체 적립 최대 20개',note:'달력은 실제 저장된 출석 날짜만 보여 줘요.',unknown:n=>`이전 출석 ${n}일은 날짜 정보 없이 누적 횟수에 남아 있어요.`,week:['일','월','화','수','목','금','토'],monthTitle:(y,m)=>`${y}년 ${m}월`,dateTitle:(y,m,d)=>`${y}년 ${m}월 ${d}일`},
 en:{title:'My wizard attendance',lead:'Each visit leaves a stamp in your book.',close:'Close',prev:'Previous month',next:'Next month',today:'This month',total:'Total visits',month:'Selected month',selectedMonth:'Selected month',saved:'Dated visits',days:'days',stamp:'Visited',current:'Today',empty:'No attendance dates have been recorded yet.',
  rules:'1 attendance coin · Up to 20 coins in total per day',note:'The calendar shows only recorded attendance dates.',unknown:n=>`${n} earlier visits remain in your total without a recorded date.`,week:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],monthTitle:(y,m)=>new Intl.DateTimeFormat('en',{month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(y,m-1,1))),dateTitle:(y,m,d)=>new Intl.DateTimeFormat('en',{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}).format(new Date(Date.UTC(y,m-1,d)))},
 zh:{title:'魔法师的出勤记录',lead:'每次到访，都会在书中留下一枚印章。',close:'关闭',prev:'上个月',next:'下个月',today:'本月',total:'累计出勤',month:'所选月份',selectedMonth:'所选月份',saved:'有日期的记录',days:'天',stamp:'已出勤',current:'今天',empty:'还没有保存出勤日期。',
  rules:'出勤可得1金币 · 每天总共最多获得20金币',note:'日历只显示实际保存的出勤日期。',unknown:n=>`以前的${n}次出勤保留在累计次数中，没有具体日期。`,week:['日','一','二','三','四','五','六'],monthTitle:(y,m)=>`${y}年${m}月`,dateTitle:(y,m,d)=>`${y}年${m}月${d}日`}
};
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function monthKey(value,today){return typeof value==='string'&&/^\d{4}-(0[1-9]|1[0-2])$/.test(value)&&value>='1970-01'&&value<=today.slice(0,7)?value:today.slice(0,7);}
function shiftMonth(month,delta){const [year,number]=month.split('-').map(Number),d=new Date(Date.UTC(year,number-1+delta,1));return d.toISOString().slice(0,7);}
const seal=`<svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="45"/><circle cx="50" cy="50" r="37"/><path d="M23 36 Q37 30 50 37 Q63 30 77 36 L77 67 Q63 61 50 68 Q37 61 23 67 Z M50 38 L50 67"/><path class="nm-at-seal-star" d="M50 14 L53 21 L61 22 L55 27 L57 35 L50 31 L43 35 L45 27 L39 22 L47 21 Z"/><path d="M30 45 L43 45 M30 51 L43 51 M57 45 L70 45 M57 51 L70 51"/></svg>`;
const stamp=`<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13.5"/><circle cx="16" cy="16" r="10.5"/><path d="M9 16 L14 21 L23 11"/></svg>`;
const arrow=direction=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${direction==='prev'?'M15 5 L8 12 L15 19':'M9 5 L16 12 L9 19'}"/></svg>`;
function model(options){
  const o=options||{},today=dayKey(o.now)||dayKey(),attend=o.attend&&typeof o.attend==='object'?o.attend:{},dates=knownDates(attend,today),month=monthKey(o.month,today);
  const [year,number]=month.split('-').map(Number),total=Math.max(safeCount(attend.days),dates.length);
  return {today,attend,dates,month,year,number,total,dated:dates.length,unknown:Math.max(0,total-dates.length),thisMonth:dates.filter(date=>date.startsWith(month)).length,lang:words[o.lang]?o.lang:'ko'};
}
function html(options){
  const m=model(options),w=words[m.lang],days=new Date(Date.UTC(m.year,m.number,0)).getUTCDate(),offset=new Date(Date.UTC(m.year,m.number-1,1)).getUTCDay(),dateSet=new Set(m.dates),cells=[];
  for(let i=0;i<offset;i++)cells.push('<td class="nm-at-blank" aria-hidden="true"></td>');
  for(let day=1;day<=days;day++){
    const date=`${m.month}-${String(day).padStart(2,'0')}`,visited=dateSet.has(date),isToday=date===m.today,future=date>m.today,label=w.dateTitle(m.year,m.number,day)+(visited?' · '+w.stamp:'')+(isToday?' · '+w.current:'');
    cells.push(`<td class="nm-at-cell${visited?' is-attended':''}${isToday?' is-today':''}${future?' is-future':''}" aria-label="${esc(label)}"><div class="nm-at-day"><time datetime="${date}"${isToday?' aria-current="date"':''}>${day}</time>${visited?`<span class="nm-at-stamp">${stamp}</span><span class="nm-at-state">${esc(w.stamp)}</span>`:''}</div></td>`);
  }
  while(cells.length%7)cells.push('<td class="nm-at-blank" aria-hidden="true"></td>');
  const rows=[];for(let i=0;i<cells.length;i+=7)rows.push('<tr>'+cells.slice(i,i+7).join('')+'</tr>');
  return `<section class="nm-at-card" tabindex="-1" aria-labelledby="nmAttendanceTitle" aria-describedby="nmAttendanceLead">
    <div class="nm-at-foil" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    <header class="nm-at-head"><span class="nm-at-kicker">NUMBERS OF MAGIC</span><button type="button" class="nm-at-close" data-att-action="close" aria-label="${esc(w.close)}"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6 L18 18 M18 6 L6 18"/></svg></button></header>
    <div class="nm-at-hero"><div class="nm-at-seal">${seal}</div><div><h2 id="nmAttendanceTitle">${esc(w.title)}</h2><p id="nmAttendanceLead">${esc(w.lead)}</p></div></div>
    <dl class="nm-at-stats"><div><dt>${esc(w.total)}</dt><dd><strong>${m.total}</strong> ${esc(w.days)}</dd></div><div><dt>${esc(m.month===m.today.slice(0,7)?w.month:w.selectedMonth)}</dt><dd><strong>${m.thisMonth}</strong> ${esc(w.days)}</dd></div><div><dt>${esc(w.saved)}</dt><dd><strong>${m.dated}</strong> ${esc(w.days)}</dd></div></dl>
    <div class="nm-at-calendar"><div class="nm-at-monthbar"><button type="button" data-att-action="prev" aria-label="${esc(w.prev)}"${m.month==='1970-01'?' disabled':''}>${arrow('prev')}</button><h3 id="nmAttendanceMonth" aria-live="polite">${esc(w.monthTitle(m.year,m.number))}</h3><button type="button" data-att-action="next" aria-label="${esc(w.next)}"${m.month>=m.today.slice(0,7)?' disabled':''}>${arrow('next')}</button></div>
    <table aria-labelledby="nmAttendanceMonth"><thead><tr>${w.week.map(day=>`<th scope="col">${esc(day)}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table>
    <div class="nm-at-calendar-foot"><span><i class="nm-at-key" aria-hidden="true"></i>${esc(w.stamp)}</span><button type="button" data-att-action="today">${esc(w.today)}</button></div></div>
    ${m.dated===0?`<p class="nm-at-empty">${esc(w.empty)}</p>`:''}
    <p class="nm-at-rules">${esc(w.rules)}</p><p class="nm-at-note">${esc(w.note)}${m.unknown?'<br>'+esc(w.unknown(m.unknown)):''}</p>
  </section>`;
}
let activeClose=null;
function mount(options){
  if(!root.document)return ()=>{};
  if(activeClose)activeClose('replace');
  const o=options||{},doc=root.document,opener=o.opener||doc.activeElement,today=dayKey(o.now)||dayKey(),overlay=doc.createElement('div');let month=monthKey(o.month,today),closed=false;
  overlay.className='nm-at-overlay';overlay.id='nmAttendanceOverlay';
  function draw(action){
    overlay.innerHTML=html({...o,month});const card=overlay.querySelector('.nm-at-card');card.setAttribute('role','dialog');card.setAttribute('aria-modal','true');
    const target=action&&overlay.querySelector(`[data-att-action="${action}"]:not([disabled])`);(target||card).focus({preventScroll:true});
  }
  function close(reason){
    if(closed)return;closed=true;overlay.removeEventListener('click',click);overlay.removeEventListener('keydown',keydown);overlay.remove();if(activeClose===close)activeClose=null;
    if(reason!=='replace'&&opener&&opener.isConnected&&typeof opener.focus==='function')opener.focus({preventScroll:true});
    if(reason!=='replace'&&typeof o.onClose==='function')o.onClose();
  }
  function click(event){
    if(event.target===overlay){close('backdrop');return;}
    const button=event.target.closest('[data-att-action]');if(!button||button.disabled)return;const action=button.dataset.attAction;
    if(action==='close'){close('button');return;}
    if(action==='prev'||action==='next')month=monthKey(shiftMonth(month,action==='prev'?-1:1),today);
    if(action==='today')month=today.slice(0,7);draw(action);
  }
  function keydown(event){
    if(event.key==='Escape'){event.preventDefault();event.stopPropagation();close('escape');return;}
    if(event.key!=='Tab')return;
    const buttons=Array.from(overlay.querySelectorAll('button:not([disabled])')),first=buttons[0],last=buttons[buttons.length-1];
    if(event.shiftKey&&(doc.activeElement===first||!buttons.includes(doc.activeElement))){event.preventDefault();last?.focus();}
    else if(!event.shiftKey&&(doc.activeElement===last||!buttons.includes(doc.activeElement))){event.preventDefault();first?.focus();}
  }
  overlay.addEventListener('click',click);overlay.addEventListener('keydown',keydown);doc.body.appendChild(overlay);activeClose=close;draw();return ()=>close('dispose');
}
const api={version:'20261024-attendance-dates',dayKey,mark,html,mount};root.NM_ATTENDANCE=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
