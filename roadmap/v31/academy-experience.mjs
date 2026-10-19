import {ACADEMY_TOPIC_HEADINGS} from './data/academy-topic-headings.mjs';
import {academyTimingLabel} from './academy-input.mjs';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const ACADEMY_COMPARISON_COPY='학원 경험을 기본 로드맵과 함께 살펴보세요.';

// Read-only reference catalog. No course, row selection, calendar, or progress is inferred.
export function academyTopicGroups(record={}){
 const groups=ACADEMY_TOPIC_HEADINGS.filter(g=>g.institution===record.institution);
 // Only the exact new WHY spelling narrows the reference list. Legacy W9/9 stay exact.
 return record.institution==='CMS'&&/^WHY (?:[1-9]|1[0-5])$/.test(record.level||'')?groups.filter(g=>g.stage===record.level):groups;
}
export function academyRecordMarkup(record={}){
 const timing=academyTimingLabel(record);
 return `<span class="academy-record-heading"><strong>${esc(record.institution||'학원 이름 미입력')}</strong>${record.level?`<span class="academy-record-level">${esc(record.level)}</span>`:''}${timing?`<span class="academy-timing-badge">${timing}</span>`:''}</span>`;
}
function topicList(groups){
 return groups.map(group=>`${groups.length>1?`<h5>${esc(group.part)}</h5>`:''}<ol>${group.topics.map(topic=>`<li>${topic.part?`<span class="academy-topic-part">${esc(topic.part)}</span> `:''}${esc(topic.title)}</li>`).join('')}</ol>`).join('');
}
export function academyTopicsMarkup(record={}){
 const groups=academyTopicGroups(record);if(!groups.length)return '';
 const series=[...new Set(groups.map(g=>g.series))];
 return `<details class="academy-topics" data-academy-topics><summary>참고 목차 보기</summary><div class="academy-topic-catalog" aria-label="${esc(record.institution)} 제공 자료의 수록 주제">${series.map(name=>{
  const items=groups.filter(g=>g.series===name),stages=[...new Set(items.map(g=>g.stage))];
  const body=stages.length===1?`<h4>${esc(stages[0])} 참고 목차</h4>${topicList(items)}`:stages.map(stage=>`<details class="academy-topic-stage"><summary>${esc(stage)}</summary>${topicList(items.filter(g=>g.stage===stage))}</details>`).join('');
  return series.length===1?body:`<details class="academy-topic-series"><summary>${esc(name)} 참고 목차</summary>${body}</details>`;
 }).join('')}</div></details>`;
}
export function academyExperienceMarkup(academies=[],{intro=true,topics=true}={}){
 if(!academies.length)return '';
 return `<section class="academy-experience" data-academy-experience><h3>학원 경험</h3>${intro?`<p class="academy-experience-intro">${ACADEMY_COMPARISON_COPY}</p>`:''}<ul class="academy-experience-records">${academies.map(record=>`<li class="academy-experience-record">${academyRecordMarkup(record)}${topics?academyTopicsMarkup(record):''}</li>`).join('')}</ul></section>`;
}
