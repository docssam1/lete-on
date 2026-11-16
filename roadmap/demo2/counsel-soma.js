/* Academy operating tables are references only, never assigned study. */
(function(g){
'use strict';
function source(ctx){const c=g.PLANNER_SOMA_CURRENT;return c&&(ctx?.sources||[]).find(r=>(!r.status||r.status==='approved')&&String(r.source||'').includes(c.source.sha256)&&/현재\s*5세/u.test(r.body||''));}
const when=(c,n)=>(c.startYear+Math.floor(n/12))+'.'+String(n%12+1).padStart(2,'0');
function monthlyRows(c=g.PLANNER_SOMA_CURRENT){if(!c)return [];const points=[...new Set([c.start,c.end,...c.tracks.flatMap(t=>t.blocks.flatMap(b=>[b.start,b.end]))])].sort((a,b)=>a-b);return points.slice(0,-1).map((start,i)=>({start,end:points[i+1],period:when(c,start)+(points[i+1]-1===start?'':' ~ '+when(c,points[i+1]-1)),cells:c.tracks.map(t=>t.blocks.find(b=>b.start<=start&&start<b.end)?.label||'—')}));}
function mount(host,ctx,{openSource}={}){
 const evidence=source(ctx);if(!host||!evidence)return false;
 const doc=g.document,el=(tag,attrs={},text)=>{const n=doc.createElement(tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);if(text!=null)n.textContent=text;return n;};
 host.replaceChildren();host.className='cs-soma';
 const fold=el('details',{class:'cs-reference'});fold.open=/월별|운영표|로드맵.*표/u.test(ctx.question||'');
 fold.append(el('summary',{},'참고용 · 현재 5세 소마 월별 운영표'),el('p',{},'학원 운영 사례를 비교하는 자료입니다. 이 교재를 학습 과제로 배정하거나 아이의 필수 진도·부족 판단 기준으로 쓰지 않습니다. 현재 5세는 별도 반 레벨을 나누지 않으며 Ray A3-3은 교재 진도 표기입니다.'));
 const scroll=el('div',{class:'cs-table-scroll',tabindex:'0',role:'region','aria-label':'소마 월별 참고표. 좌우로 이동할 수 있습니다.'}),table=el('table');table.append(el('caption',{},'사고력·부교재·연산·도형 · 2026.11~2028.08'));
 const head=el('thead'),tr=el('tr');for(const text of ['기간','사고력','부교재','연산','도형'])tr.append(el('th',{scope:'col'},text));head.append(tr);table.append(head);
 const body=el('tbody');for(const row of monthlyRows()){const tr=el('tr');tr.append(el('th',{scope:'row'},row.period));for(const cell of row.cells)tr.append(el('td',{},cell));body.append(tr);}table.append(body);scroll.append(table);fold.append(scroll,el('p',{class:'cs-note'},'—는 원표의 공백이며, 표의 마지막 달을 교재 완료월로 보지 않습니다. B5~B8과 소마연산 3학년은 원표의 교재 이름입니다.'));
 const cite=el('button',{type:'button',class:'cc-citation'},'운영표 근거 보기');cite.onclick=()=>openSource?.(evidence.id);fold.append(cite);host.append(fold);
 host.append(el('p',{class:'cs-note'},'실제 학습은 아이의 현재 개념·독립 풀이 범위에서 지필드 확인 문제와 보완 학습으로 이어갑니다. 학원 선택은 필요하지 않습니다.'));
 return true;
}
g.RoadmapCounselSoma=Object.freeze({source,monthlyRows,mount});
})(typeof window==='undefined'?globalThis:window);
