/* Optional, local-screen comparison. Never rewrites a learner's saved plan. */
(function(global){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let selection={months:[],pace:0};
function eligible(answers,fields){const grade=global.PlannerIntake.gradeChoice(answers,fields);return !fields.internationalCalendar&&['7','8','9'].includes(String(grade));}
function months(fields,count=24){const year=Number(fields.year),month=Number(fields.mon);if(!Number.isInteger(year)||!Number.isInteger(month)||month<1||month>12)return[];return Array.from({length:count},(_,i)=>{const n=year*12+month-1+i,y=Math.floor(n/12),m=n%12+1;return{index:i,key:y+'-'+String(m).padStart(2,'0'),label:y+'년 '+m+'월',month:m};});}
function calendarFields(model,fields){return Number.isInteger(Number(model?.year))&&Number.isInteger(Number(model?.month))&&Number(model.month)>=1&&Number(model.month)<=12?{...fields,year:Number(model.year),mon:Number(model.month)}:fields;}
function compare(model,fields,state={}){
 fields=calendarFields(model,fields);
 const calendar=months(fields),chosen=new Set((state.months||[]).filter(k=>calendar.some(m=>m.key===k))),pace=state.pace===.5?.5:0;
 let position=0;
 const rows=calendar.map(m=>{const exam=chosen.has(m.key),capacity=exam?pace:1,start=position;position+=capacity;return{...m,exam,capacity,start,end:position};});
 const lanes=(model?.lanes||[]).filter(l=>['school','deep'].includes(l.id)).map(l=>({...l,months:rows.map(m=>({...m,blocks:m.capacity===0?[]:(l.blocks||[]).filter(b=>b.end>m.start+1e-8&&b.start<m.end-1e-8).map(b=>({id:b.id,title:b.title,additional:!!b.additional}))}))}));
 return{rows,lanes,selected:chosen.size,pace,delayed:calendar.length-position};
}
function render(model,fields,state){
 const c=compare(model,fields,state),controls=c.rows.map(m=>'<label><input type="checkbox" data-exam-month="'+m.key+'"'+(m.exam?' checked':'')+'>'+esc(m.label)+'</label>').join('');
 const table=c.selected?'<div class="exam-season-scroll" tabindex="0" role="region" aria-label="내신 우선 비교 일정"><table><thead><tr><th scope="col">월</th>'+c.lanes.map(l=>'<th scope="col">'+esc(l.label||l.title||l.id)+'</th>').join('')+'</tr></thead><tbody>'+c.rows.map((m,i)=>'<tr'+(m.exam?' class="exam-season-priority"':'')+'><th scope="row">'+esc(m.label)+(m.exam?'<small>내신 우선 · '+(c.pace===0?'새 진도 쉬기':'새 진도 절반')+'</small>':'')+'</th>'+c.lanes.map(l=>'<td>'+(m.capacity===0?'학교 시험 범위·오답 복습':l.months[i].blocks.length?l.months[i].blocks.map(b=>esc(b.title)+(b.additional?' (병행 심화)':'')).join('<br>'):'확인된 다음 과정 없음')+'</td>').join('')+'</tr>').join('')+'</tbody></table></div><p>선택한 '+c.selected+'개월 동안 새 진도를 줄이면, 표시한 24개월에 들어가는 새 진도는 원래 계획보다 '+c.delayed+'개월분 적습니다. 뒤로 밀린 과정은 24개월 이후에도 이어집니다.</p>':'<p>학교에서 안내한 시험·준비 월을 선택하면 비교 일정이 나타납니다. 미선택 상태에서는 날짜를 추정하지 않습니다.</p>';
 return '<details class="exam-season" open><summary>학교 내신 우선 월별 계획 비교</summary><p>4·6·9·11월은 선택 예시일 뿐입니다. 학교·학년별 시험일, 자유학기와 수행평가에 맞춰 준비할 월을 고르세요. 이 비교는 교과·심화의 새 진도만 늦추며 기존 저장 계획·교재 진도·시험 기록을 바꾸지 않습니다.</p><fieldset><legend>이번 화면에서 비교할 내신 준비 월</legend><div class="exam-season-months">'+controls+'</div></fieldset><div class="exam-season-actions"><button type="button" data-exam-example>4·6·9·11월 예시 선택</button><button type="button" data-exam-clear>선택 해제</button><label>새 진도 분량 <select data-exam-pace><option value="0"'+(c.pace===0?' selected':'')+'>잠시 쉬기</option><option value="0.5"'+(c.pace===.5?' selected':'')+'>평소의 절반으로</option></select></label></div><p class="exam-season-note">실제 공부 시간은 개인별로 조절하세요. 연산·사고력·과학·경시 일정은 이 비교에서 이동하지 않으므로 병행 부담과 응시일은 별도로 확인합니다. 선택은 이 화면에서만 유지됩니다.</p>'+table+'</details>';
}
function mount(host,{answers={},fields={},model}={}){
 if(!host||!eligible(answers,fields)||!model?.lanes?.some(l=>['school','deep'].includes(l.id)&&l.blocks?.length))return;
 const box=global.document.createElement('section');host.append(box);
 const paint=()=>{box.innerHTML=render(model,fields,selection);};paint();
 box.addEventListener('change',e=>{if(e.target.matches('[data-exam-month]')){const key=e.target.dataset.examMonth;selection.months=selection.months.filter(x=>x!==key);if(e.target.checked)selection.months.push(key);}else if(e.target.matches('[data-exam-pace]'))selection.pace=Number(e.target.value);else return;paint();});
 box.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.hasAttribute('data-exam-example'))selection.months=months(calendarFields(model,fields)).filter(m=>[4,6,9,11].includes(m.month)).map(m=>m.key);else if(b.hasAttribute('data-exam-clear'))selection={months:[],pace:0};else return;paint();});
}
global.PlannerExamSeason=Object.freeze({eligible,months,compare,render,mount});
})(window);
