/* Dated legacy preschool reference only. No learner answers, current levels,
 * academy operating data, storage or study assignments are changed here. */
(function(global){
'use strict';
const SOURCE_VERSION='2026-10-22',SOURCE_LABEL=SOURCE_VERSION+' 유아 상세 설계 참고';
const PROFILES=Object.freeze([
 Object.freeze({id:'fast-premier',label:'선행이 빠른 프리미어 참고',shift:0}),
 Object.freeze({id:'premier-standard',label:'프리미어 표준 참고',shift:3}),
 Object.freeze({id:'challenge',label:'챌린지 이후 P2·S2 준비 참고',shift:7}),
 Object.freeze({id:'fields-e2',label:'필즈 주 2회 E2 참고',shift:10}),
 Object.freeze({id:'soma-a',label:'소마 A반 참고',shift:12})
]);
const ROWS=Object.freeze([
 Object.freeze({key:'school',label:'교과·응용·심화',method:'교과의 개념과 응용을 익힌 뒤, 배운 범위의 심화로 연결한 배치입니다.'}),
 Object.freeze({key:'thinking1',label:'사고력 기본',method:'기본 발상과 조건 읽기를 익히고, PRE 1031의 기본·심화에서 1031 입문으로 이어갑니다.'}),
 Object.freeze({key:'thinking2',label:'사고력 적용·선택 준비',method:'개념·실전·마무리로 나눈 준비 순서입니다. 현재 수업과 목표에 맞는 부분만 참고합니다.'}),
 Object.freeze({key:'home',label:'가정 보완',method:'수업에서 부족한 문장제·규칙·논리를 보완할 때 참고합니다. 같은 역할의 교재를 겹쳐 더하지 않습니다.'}),
 Object.freeze({key:'calc',label:'연산',method:'수 감각과 계산의 정확도를 교과와 나란히 챙기는 축입니다. 실제 연습량과 남은 분량은 아이의 현재 공부에서 따로 정합니다.'})
]);
const NOTES=Object.freeze([
 '원표의 다섯 축을 함께 펼친 구성 참고입니다. 현재 학생에게 모두 해야 할 필수 과제를 배정한 표가 아닙니다.',
 '최신 필즈 E1·소마 운영표는 별도로 살펴보세요. 이 표는 2026-10-22 자료의 배치이며, 현재 학원의 반 이름·운영 진도와 구분합니다.',
 '별도 배정 없음은 원자료에 해당 시기의 별도 교재가 표시되지 않았다는 뜻입니다. 공부를 멈추거나 쉬는 기간으로 정한 것이 아닙니다.',
 '표의 마지막 달 이후에 공부가 끝나는 것은 아닙니다. 원자료에서 확인되는 마지막 배치까지 보여주며, 이후 과정은 현재 공부와 최신 운영표에서 이어 봅니다.'
]);
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const text=value=>String(value??'').replace(/<br\s*\/?\s*>/gi,' ').replace(/<[^>]*>/g,'').replace(/\s+/g,' ').trim();
function ids(){return PROFILES.map(profile=>profile.id);}
function restoreId(value){return PROFILES.some(profile=>profile.id===value)?value:PROFILES[0].id;}
function monthAt(at){const age=5+Math.floor(at/12),month=((at%12)+12)%12+1;return {at,age,month,quarter:Math.floor((month-1)/3)+1,label:age+'세 '+month+'월'};}
function mergeCells(row,months){return months.reduce((cells,month)=>{
 const b=row.blocks.find(item=>item.start<=month.at&&item.end>month.at),index=b?.index??-1,last=cells.at(-1),key=b?.id||'empty';
 if(last?.key===key){last.end=month.at+1;last.span++;}
 else cells.push({key,id:b?.id||null,kind:b?'course':'empty',title:b?.title||'별도 배정 없음',index,start:month.at,end:month.at+1,span:1,sourceStart:b?.sourceStart??null,sourceEnd:b?.sourceEnd??null});
 return cells;
},[]);}
function model(value='fast-premier'){
 const id=restoreId(value),profile=PROFILES.find(item=>item.id===id),source=global.DemoContent;
 const originals=typeof source?.originalRows==='function'?source.originalRows():[];
 const rows=ROWS.map(meta=>{
  const original=originals.find(row=>row.key===meta.key),shift=meta.key==='thinking2'?0:profile.shift;
  const blocks=(original?.blocks||[]).filter(b=>Number.isFinite(b.s)&&Number.isFinite(b.e)&&b.e>=b.s).map((b,index)=>({
   id:'ppd-'+meta.key+'-'+index,index,rowKey:meta.key,title:typeof source?.shortText==='function'?source.shortText(b.text):text(b.text),
   originalStart:b.s,originalEnd:b.e,sourceStart:b.s+shift,sourceEnd:b.e+shift,start:b.s+shift,end:b.e+shift+1,fullMonths:b.e-b.s+1,shift,referenceOnly:true
  }));
  return {...meta,blocks};
 });
 const periods=rows.flatMap(row=>row.blocks),ready=periods.length>0&&rows.every(row=>row.blocks.length>0),start=periods.length?Math.min(...periods.map(b=>b.start)):0,end=periods.length?Math.max(...periods.map(b=>b.end)):0;
 const months=Array.from({length:Math.max(0,end-start)},(_,index)=>monthAt(start+index));
 const years=months.reduce((list,month)=>{const last=list.at(-1);if(last?.age===month.age)last.end=month.at+1;else list.push({age:month.age,start:month.at,end:month.at+1});return list;},[]);
 return {ready,id,label:profile.label,shift:profile.shift,sourceVersion:SOURCE_VERSION,sourceLabel:SOURCE_LABEL,sourceScope:'legacy-preschool-five-strands',coordinate:'5세 1월=0',referenceOnly:true,start,end,months,years,profiles:PROFILES.map(item=>({...item})),rows:rows.map(row=>({...row,cells:mergeCells(row,months)})),notes:[...NOTES]};
}
function table(m,start=m.start,end=m.end){
 const months=m.months.filter(month=>month.at>=start&&month.at<end),quarters=[];
 for(const month of months){const key=month.age+'세 '+month.quarter+'분기',last=quarters.at(-1);if(last?.label===key)last.span++;else quarters.push({label:key,span:1});}
 return `<table class="ppd-table" data-preschool-source="${SOURCE_VERSION}" data-preschool-profile="${m.id}" data-month-start="${start}" data-month-end="${end}" style="--ppd-month-count:${months.length}"><caption>${esc(m.label)} · ${esc(months[0]?.label)} ~ ${esc(months.at(-1)?.label)}</caption><colgroup><col class="ppd-row-col">${months.map(()=>'<col class="ppd-month-col">').join('')}</colgroup><thead><tr><th scope="col" rowspan="2">함께 살펴볼 축</th>${quarters.map(q=>`<th scope="colgroup" colspan="${q.span}">${esc(q.label)}</th>`).join('')}</tr><tr>${months.map(month=>`<th scope="col" data-month="${month.at}"><small>${month.age}세</small><b>${month.month}월</b></th>`).join('')}</tr></thead><tbody>${m.rows.map(row=>`<tr data-preschool-row="${row.key}"><th scope="row">${esc(row.label)}</th>${row.cells.filter(cell=>cell.start<end&&cell.end>start).map(cell=>`<td colspan="${Math.min(end,cell.end)-Math.max(start,cell.start)}" class="${cell.kind==='course'?'ppd-tone-'+cell.index%4:'ppd-empty'}" data-reference-block="${esc(cell.id||'')}" data-source-start="${cell.sourceStart??''}" data-source-end="${cell.sourceEnd??''}"${cell.kind==='course'?` title="${esc(cell.title+' · '+monthAt(cell.sourceStart).label+' ~ '+monthAt(cell.sourceEnd).label)}"`:''}><span>${esc(cell.title)}</span></td>`).join('')}</tr>`).join('')}</tbody></table>`;
}
function explanations(m){return `<div class="ppd-explanations">${m.rows.map(row=>`<article><strong>${esc(row.label)}</strong><p>${esc(row.method)}</p></article>`).join('')}</div>`;}
function printTables(m){return m.years.map(year=>`<section class="ppd-print-chunk"><h4>${esc(m.label)} · ${year.age}세</h4>${table(m,year.start,year.end)}</section>`).join('');}
function render(value='fast-premier',options={}){
 const m=model(value),heading=`<header class="ppd-heading"><small>${esc(m.sourceLabel)}</small><h3>유아 시기의 다섯 축을 함께 살펴보세요.</h3><p>${esc(m.notes[0])}</p></header>`;
 if(!m.ready)return `<details class="ppd-reference"><summary>유아 상세 설계 참고 보기</summary>${heading}<p>참고 자료를 불러온 뒤 원표의 교재와 월별 배치를 보여드립니다.</p></details>`;
 const notes=`<div class="ppd-notes">${m.notes.slice(1).map(note=>'<p>'+esc(note)+'</p>').join('')}</div>`;
 if(options.print)return `<section class="ppd-reference ppd-print-reference" aria-label="${esc(m.sourceLabel)}">${heading}${printTables(m)}${explanations(m)}${notes}</section>`;
 const buttons=`<div class="ppd-controls" role="group" aria-label="옛 유아 상세 설계 예시 선택">${m.profiles.map(profile=>`<button type="button" data-preschool-detail="${profile.id}" aria-pressed="${profile.id===m.id}">${esc(profile.label)}</button>`).join('')}</div>`;
 return `<details class="ppd-reference"${options.open?' open':''}><summary><span>유아 상세 설계 참고 보기</span><small>교과·사고력·선택 준비·가정 보완·연산</small></summary>${heading}${buttons}<div class="ppd-screen"><div class="ppd-scroll" role="region" aria-label="${esc(m.label+' 전체 월별 참고표')}" tabindex="0">${table(m)}</div></div><div class="ppd-print-only">${printTables(m)}</div>${explanations(m)}${notes}</details>`;
}
global.PlannerPreschoolDetail=Object.freeze({ids,restoreId,model,render});
})(window);
