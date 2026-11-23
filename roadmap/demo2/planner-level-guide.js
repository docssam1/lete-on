/* Translate the existing reference table into parent-facing labels for a selected age or grade. */
(function(global){
'use strict';

const learners=[
 ...[4,5,6,7].map(age=>['pre:'+age,age+'세']),
 ...[1,2,3,4,5,6].map(grade=>['grade:'+grade,'초'+grade])
];
const months=Array.from({length:12},(_,index)=>[index+1,(index+1)+'월']);
const axes=[['school','교과'],['depth','교과 심화'],['comp','사고력 수학'],['calc','연산']];
const entities={'&nbsp;':' ','&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"};
const plain=value=>String(value??'').replace(/<[^>]*>/g,' ').replace(/&(?:nbsp|amp|lt|gt|quot|#39);/g,match=>entities[match]).replace(/\s+/g,' ').trim();
const esc=value=>String(value??'').replace(/[&<>"']/g,match=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[match]);

function monthOf(learner,month){
 const n=Number(month);
 if(!learners.some(([value])=>value===learner)||!Number.isInteger(n)||n<1||n>12)return null;
 const [kind,number]=learner.split(':');
 // Reference month zero is 5세 1월. Elementary grade years begin in March.
 return kind==='pre'?(Number(number)-5)*12+n-1:36+12*(Number(number)-1)+n-1+(n<3?12:0);
}

function rowAt(source,at,detail){
 function course(axis){
  return plain(source[axis]?.find(([,start,end])=>start<=at&&at<=end)?.[0]);
 }
 const depth=detail?.school2?.filter(({start,end})=>start<=at&&at<=end).map(({title})=>plain(title));
 return {school:course('school'),depth:depth?.join(' · ')||'',comp:course('comp'),calc:course('calc')};
}

function nameFor({school,depth,comp,calc}){
 const semester=school.match(/^([1-6]-[12])\b/)?.[1];
 if(semester)return '초등 '+semester+' 교과';
 const middle=school.match(/^(중[1-3]-[12])\b/)?.[1];
 if(middle)return middle+' 교과';
 if(/^(?:수학 문장 이해|지문 이해)/.test(school))return '수학 문장·조건 읽기';
 if(school)return school.replace(/^진로:\s*/,'');
 const depthSemester=depth.match(/^([1-6]-[12])\s+심화/)?.[1];
 if(depthSemester)return '초등 '+depthSemester+' 심화';
 if(depth)return depth;
 const thinking=comp.match(/^(킨더팩토|키즈팩토|초등팩토|필즈 베이직|1031 \S+|3% 1과정)/)?.[0];
 if(thinking||comp)return thinking||comp;
 if(calc)return /^소마셈 K/.test(calc)?'수감각·기초 연산':calc;
 return '이 시기 자료 없음';
}

function describe(levelId,at,{levels=global.PLANNER_LEVELS,details=global.PLANNER_STANDARD_DETAILS}={}){
 if(!Number.isFinite(at))return '';
 const source=levels?.find(level=>level.id===levelId);
 return source?nameFor(rowAt(source,at,details?.[source.id])):'';
}

function model({learner,month,levels=global.PLANNER_LEVELS,details=global.PLANNER_STANDARD_DETAILS}={}){
 const choice=learners.find(([value])=>value===learner)||learners.find(([value])=>value==='pre:7');
 const selectedMonth=months.find(([value])=>value===Number(month))||months[10];
 const at=monthOf(choice[0],selectedMonth[0]);
 const columns=details?axes:axes.filter(([id])=>id!=='depth');
 const rows=(levels||[]).map(source=>{
  const books=rowAt(source,at,details?.[source.id]);
  return {id:source.id,name:nameFor(books),books};
 });
 return {learner:choice[0],month:selectedMonth[0],label:choice[1]+' '+selectedMonth[1],at,columns,rows};
}

function rowMarkup(model){
 return model.rows.map(row=>'<tr><th scope="row"><strong>'+esc(row.name)+'</strong> <small class="level-guide-code">'+esc(row.id)+'</small></th>'+
  model.columns.map(([id])=>'<td>'+ (row.books[id]?esc(row.books[id]):'<span class="level-guide-empty">자료 없음</span>')+'</td>').join('')+'</tr>').join('');
}

function selection(model){
 const hasStudy=model.rows.some(row=>model.columns.some(([id])=>row.books[id]));
 return model.label+(hasStudy?' 기준의 참고 진도':' 기준표에 기록된 과정이 없습니다.');
}

function options(items,selected){
 return items.map(([value,label])=>'<option value="'+esc(value)+'"'+(value===selected?' selected':'')+'>'+esc(label)+'</option>').join('');
}

function render({learner,month,open=false}={}){
 const guide=model({learner,month});
 if(!guide.rows.length)return '';
 return '<details class="level-guide"'+(open?' open':'')+'><summary>유아·초등 레벨 기준 보기</summary>'+
  '<p>같은 L번호라도 나이·학년과 월에 따라 공부하는 과정이 달라집니다.</p>'+
  '<div class="level-guide-pickers"><label>나이 또는 학년<select data-level-guide-learner>'+options(learners,guide.learner)+'</select></label>'+
  '<label>기준 월<select data-level-guide-month>'+options(months,guide.month)+'</select></label></div>'+
  '<p class="level-guide-selection" role="status">'+esc(selection(guide))+'</p>'+
  '<div class="level-guide-scroll" tabindex="0" role="region" aria-label="레벨별 참고 진도표"><table>'+
  '<caption>'+esc(guide.label)+' 기준</caption><thead><tr><th scope="col">학습 과정과 L번호</th>'+
  guide.columns.map(([,label])=>'<th scope="col">'+esc(label)+'</th>').join('')+
  '</tr></thead><tbody>'+rowMarkup(guide)+'</tbody></table></div></details>';
}

global.document?.addEventListener('change',event=>{
 if(!event.target.matches?.('[data-level-guide-learner],[data-level-guide-month]'))return;
 const guide=event.target.closest('.level-guide');
 if(!guide)return;
 const data=model({
  learner:guide.querySelector('[data-level-guide-learner]').value,
  month:guide.querySelector('[data-level-guide-month]').value
 });
 guide.querySelector('.level-guide-selection').textContent=selection(data);
 guide.querySelector('caption').textContent=data.label+' 기준';
 guide.querySelector('tbody').innerHTML=rowMarkup(data);
});

global.PlannerLevelGuide=Object.freeze({monthOf,model,describe,render});
})(window);
