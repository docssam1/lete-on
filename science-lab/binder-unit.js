import {ORDERED,DOMAINS,domainOf} from './data/curriculum.js';

const esc=value=>String(value??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function unitLinks(current){
 return DOMAINS.map(domain=>{
  const units=ORDERED.filter(unit=>domainOf(unit).id===domain.id);
  if(!units.length)return '';
  return `<section><h3>${esc(domain.title)}</h3><ol>${units.map(unit=>`<li><a href="#/u/${unit.id}"${unit.id===current.id?' aria-current="page"':''}><span>${unit.part==='A'?'참고':String(ORDERED.indexOf(unit)+1).padStart(2,'0')}</span>${esc(unit.title)}</a></li>`).join('')}</ol></section>`;
 }).join('');
}
export function binderUnitIndexHtml(unit){
 return `<aside class="binder-unit-index" aria-label="실험 자료 차례"><h2>서류철 차례</h2><nav>${unitLinks(unit)}</nav><a class="binder-unit-all" href="#/">전체 자료 고르기</a></aside>`;
}
export function binderUnitMobileIndexHtml(unit){
 return `<details class="binder-unit-mobile-index"><summary>실험 자료 차례</summary><nav aria-label="실험 자료 차례">${unitLinks(unit)}<a class="binder-unit-all" href="#/">전체 자료 고르기</a></nav></details>`;
}
export function binderUnitNotesHtml(unit){
 const variables=unit.activity.vars;
 return `<aside class="binder-unit-notes" aria-label="실험 정리 날개">
  <section><h2>핵심 정리</h2><ul>${unit.concept.points.slice(0,3).map(([title])=>`<li>${esc(title)}</li>`).join('')}</ul></section>
  <section><h2>확인할 조건</h2><dl><dt>바꿀 조건</dt><dd>${variables.diff.map(esc).join(' · ')}</dd><dt>같게 할 조건</dt><dd>${variables.same.map(esc).join(' · ')}</dd><dt>관찰하거나 잴 것</dt><dd>${variables.measure.map(esc).join(' · ')}</dd></dl></section>
  <section><h2>정리 질문</h2><p>${esc(unit.discuss[0]?.q||unit.concept.lead)}</p></section>
  <p class="binder-unit-origin">기존 지도자료의 주제별 실험이에요. 현행 학년·학기별 수업은 <a href="./v2/#/">교과 연결 사고력</a>에서 골라요.</p>
 </aside>`;
}
