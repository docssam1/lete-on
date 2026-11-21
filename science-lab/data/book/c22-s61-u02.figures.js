// 위치/수치의 의미를 보존하는 자료 도해. 사진이나 실제 측정 결과를 대체하지 않습니다.
import {questions} from './c22-s61-u02.questions.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function motionDataTable(model){
 if(!model?.heads?.length||!model.rows?.length||model.rows.some(r=>r.length!==model.heads.length))throw Error('운동 자료표의 행/열이 맞지 않습니다.');
 return `<table class="ed-table motion-data-table"><caption>풀이를 위한 연습 자료</caption><thead><tr>${model.heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${model.rows.map(row=>`<tr>${row.map((v,i)=>`<${i?'td':'th'}${i?'':' scope="row"'}>${esc(v)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table>`;
}
export function motionCoordinatePlot(model){
 if(model.range!==5||!model.points?.length)throw Error('좌표 모형 범위를 확인하세요.');
 const left=50,bottom=270,step=46;
 const grid=Array.from({length:6},(_,n)=>`<path d="M${left+n*step} 40V${bottom}M${left} ${bottom-n*step}H280" stroke="#ccd5e2" stroke-width="1"/><text x="${left+n*step}" y="293" text-anchor="middle">${n}</text>${n?`<text x="35" y="${bottom-n*step+6}" text-anchor="end">${n}</text>`:''}`).join('');
 const points=model.points.map(p=>{
  if(!Number.isInteger(p.x)||!Number.isInteger(p.y)||p.x<0||p.x>5||p.y<0||p.y>5||!['circle','square'].includes(p.shape))throw Error('좌표 점을 확인하세요.');
  const x=left+p.x*step,y=bottom-p.y*step;
  const shape=p.shape==='square'?`<rect x="${x-6}" y="${y-6}" width="12" height="12"/>`:`<circle cx="${x}" cy="${y}" r="6"/>`;
  // 점 자체는 질문 자료이며, 읽어야 할 좌표 숫자는 라벨/대체 텍스트에 넣지 않습니다.
  return `<g fill="#173d77" data-point="${esc(p.label)}">${shape}<text x="${x+11}" y="${y-10}" font-weight="700">${esc(p.label)}</text></g>`;
 }).join('');
 return `<svg class="motion-coordinate-plot" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 326" role="img" aria-label="가로와 세로의 0부터 5까지 같은 간격 눈금 및 ${esc(model.points.map(p=>p.label).join(', '))}의 위치 그림" style="display:block;width:100%;max-width:340px;height:auto;margin:12px auto;font-family:Pretendard,sans-serif;font-size:17px;fill:#22334b">${grid}<path d="M50 29V270H299" fill="none" stroke="#33465f" stroke-width="2"/><text x="15" y="22">세로</text><text x="290" y="318" text-anchor="end">가로</text>${points}</svg>`;
}
export const art=Object.fromEntries(questions.filter(q=>q.figure).map(q=>[q.figure,q.plot?motionCoordinatePlot(q.plot):motionDataTable(q.table)]));
