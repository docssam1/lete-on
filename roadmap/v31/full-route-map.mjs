import {activeModules,routeCandidates} from './engine.mjs';
import {personalBaseline} from './personal-baseline.mjs';
import {trackOf} from './flow.mjs';

const mounts=new WeakMap();
const AREA_DEFS=[
 {id:'math',label:'수학',hint:'교과 · 심화 · 사고력 · 연산',start:'B09'},
 {id:'science',label:'과학',hint:'분야 학습 · 실험 · 탐구',start:'B57'},
 {id:'gifted',label:'영재원',hint:'경험 · 지원 · 계속교육',start:'B36'},
 {id:'competition',label:'대회',hint:'자료 학습 · 응시를 따로',start:'B65'},
 {id:'highSchool',label:'학교·진로',hint:'학교생활 · 목표별 준비',start:'B72'},
 {id:'other',label:'타 과목',hint:'영어 · 국어 · 별도 기록',start:'B99'},
];
const STAGES={S1:'유아~7세',S2:'7세~초2',S3:'초3~초6',S4:'중등 이후'};
const TRACK_NAMES={application:'교과',depth:'심화',thinking:'사고력',arithmetic:'연산',science:'과학',other:'타 과목'};
const REL_NAMES={R01:'기본·응용 이어가기',R02:'심화는 나중에 추가',R03:'다른 범위의 응용·심화 병행',R04:'같은 범위 응용 뒤 심화',R05:'심화 중심에서 응용 병행',R06:'보완 후 합류',R07:'조정·휴식·재개',R08:'보류·후보 비교'};
const DIRECTIONS=[['current','유지','지금 속도 그대로'],['faster','속도 UP','앞으로 할 수학 기간 비교'],['consolidate','다지기','지금 범위를 더 탄탄히'],['deepen','심화','같은 범위를 더 깊게']];
const ROLES={learning_reference:'학습 과정',goal_preparation:'선택 목표 준비',selection_event:'선발·지원 참고',source_annotation:'원표 안내'};
const SPECIAL_IDS=['B55','B78','B95','B96','B97','B98'];
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const array=value=>Array.isArray(value)?value:[];
const clone=value=>structuredClone(value);
const text=value=>String(value??'').trim();
const clean=value=>text(value).replace(/\s*\|\s*/g,' ').replace(/\s+/g,' ');
const button=(label,attr,value,extra='')=>`<button type="button" ${attr}="${esc(value)}" ${extra}>${label}</button>`;
function publicLabel(data,id){const value=data.sourcePublicLabels?.blockLabels?.[id];return typeof value==='string'?text(value):typeof value?.label==='string'?text(value.label):'원표에서 범위 확인';}
function publicLabelState(data,id){const value=data.sourcePublicLabels?.blockLabels?.[id];return typeof value==='string'||typeof value?.label==='string'?(publicLabel(data,id)?'present':'empty'):'missing';}
function blockRole(label){
 if(/(?:선발|시험)\s*없음/.test(label))return 'source_annotation';
 if(/선발\s*준비|(?:프리미어|PREMIER|소마|필즈|황소).*(?:준비|대비)|PREMIER\s*(?:BASE|CORE|DRILL|FINAL)|프리미어\s*학습\s*집중/i.test(label))return 'goal_preparation';
 if(/선발|입학|입시|입반\s*시험|접수|모집|면접|발표|(?:영재원|대학부설|교육청|가천).*(?:지원|회차)|(?:^|[\s·])시험(?:$|[\s·(])/.test(label)&&!/시험\s*대비/.test(label))return 'selection_event';
 return 'learning_reference';
}
function branchArea(id){const n=Number(id.slice(1));return n>=36&&n<=43?'gifted':n>=57&&n<=64?'science':n>=65&&n<=71?'competition':n>=72&&n<=80?'highSchool':n===97||n===99?'other':'math';}
function rowAreas(row){
 const found=new Set(),tracks=array(row.tracks),context=clean([row.group,row.category].join(' ')),isContext=tracks.includes('context')||tracks.includes('institution'),isLearning=tracks.some(t=>['application','depth','thinking','arithmetic','science'].includes(t));
 if(tracks.some(t=>['application','depth','thinking','arithmetic','supplement','institution'].includes(t)))found.add('math');
 if(tracks.includes('science'))found.add('science');
 // Subject tracks take precedence. A school/selection word in one book cell
 // cannot turn the other books in that row into a different subject.
 if(isContext&&!isLearning&&/영재원|영재학급|대학부설|교육청|가천.*브릿지/.test(context))found.add('gifted');
 if(isContext&&!isLearning&&/KMO|경시|대회|올림피아드/i.test(context))found.add('competition');
 if(isContext&&!isLearning&&/고입|입시|내신|학교\s*일정/.test(context))found.add('highSchool');
 if(tracks.includes('other')||isContext&&!isLearning&&/영어|국어|독서|타 과목/.test(context))found.add('other');
 if(!found.size)found.add('math');
 return [...found];
}
function representativeBlocks(row,areaId){return row.blocks.filter(b=>b.labelState==='present'&&b.label&&(areaId!=='math'||!row.tracks.some(t=>['application','depth','thinking','arithmetic'].includes(t))||b.role==='learning_reference'));}
function rowTitle(row,index){
 const category=clean(row.category).replace(/\(?\b20\d{2}(?:\s*년)?[^)]*\)?/g,'').replace(/L[0-4](?:\/L[0-4])*/g,'기준 경로').trim();
 const group=clean(row.group).replace(/\(?\b20\d{2}[^)]*\)?/g,'').trim();
 const label=category||array(row.tracks).map(x=>TRACK_NAMES[x]).filter(Boolean).join('·')||'과정';
 return `${group&&!/^L[0-4]$/.test(group)?group+' · ':''}${label} · ${index+1}`;
}
function recordedCurrent(s){
 return array(s.courses).map(c=>({id:c.id,track:trackOf(c),area:['science','other'].includes(c.axis)?c.axis:'math',name:text(c.course||c.name)||'교재 이름 미입력',scope:[c.volume,c.range].filter(Boolean).map(text).join(' · '),completion:c.completion||'unknown',status:c.status||'active'}));
}
function goalSummary(s,id){
 const g=s.goals||{},q=s.wizard?.quick||{},w=s.wizard||{};
 if(id==='science')return [w.scienceCourse,w.scienceRange,g.sciencePurpose].filter(Boolean).map(text);
 if(id==='gifted')return [g.giftedInstitution,g.giftedField,g.admissionYear?`${g.admissionYear}학년도`:''].filter(Boolean).map(text);
 if(id==='competition')return [w.competitionName,({enter:'응시 희망',do_not_enter:'자료 학습·미응시',undecided:'방향 미정'})[g.competitionIntent]].filter(Boolean).map(text);
 if(id==='highSchool')return [...array(g.schoolTypes).map(x=>({gifted_school:'영재고',science_school:'과학고',autonomous:'자사고',general:'일반고',undecided:'미정'})[x]||x),g.institution,g.schoolAdmissionYear?`${g.schoolAdmissionYear}학년도`:'',g.medical?'의학계열 희망':''].filter(Boolean).map(text);
 if(id==='math')return [q.target==='none'?'학원 목표 없이':q.target==='fields'?'필즈 고려':q.target==='soma'?'소마 고려':''].filter(Boolean);
 return [];
}

// Complete source inventory and catalog, without changing records or creating a child calendar.
export function buildFullRouteModel(s,data={}){
 const source=data.sourceMonthly||{},catalog=data.catalog||{},contract=data.contract||{};
 const current=recordedCurrent(s),baseline=personalBaseline(s,data),active=new Set(activeModules(s,contract).branchIds);
 const sources=catalog.sources||{},candidateMap=new Map(routeCandidates({...s,exploreAll:true},catalog,contract).map(n=>[n.id,n]));
 const sections=array(source.sections).map(section=>({
  id:section.id,title:STAGES[section.id]||'원표 구간',sourcePath:text(section.sourcePath),sourceHash:text(section.sha256),referenceUrl:/^S[1-4]$/.test(section.id)?`reference/display/${section.id}.html`:'',
  columns:array(section.columns).map(c=>({index:c.index,label:text(c.label),group:text(c.group),month:c.month})),
  rows:array(section.rows).map((row,index)=>{
   const blocks=array(row.blocks).map(b=>{const label=publicLabel(data,b.id),labelState=publicLabelState(data,b.id);return {id:b.id,label,labelState,isEmpty:labelState==='empty',start:b.start,end:b.end,span:b.span,timingQuality:b.timingQuality||'unconfirmed_timing',role:labelState==='missing'?'source_annotation':labelState==='empty'?'empty':blockRole(label),sourceCellIndex:b.sourceCellIndex,sourceId:section.id,rowId:row.id,countsAsLearningProgress:false};});
   return {id:row.id,sectionId:section.id,title:rowTitle(row,index),tracks:[...array(row.tracks)],areas:rowAreas(row),sourceTableIndex:row.sourceTableIndex,sourceRowIndex:row.sourceRowIndex,blocks};
  }),
 }));
 const nodes=array(catalog.branches).map(raw=>{
  const candidate=candidateMap.get(raw.id)||{};
  return {id:raw.id,title:text(raw.title),area:branchArea(raw.id),active:active.has(raw.id),status:text(raw.status),origin:text(raw.origin),questionIds:[...array(raw.question_ids)],answerFollowups:text(raw.answer_followups),paths:clone(candidate.paths||[]),conditions:text(raw.entry_and_remediation),parallel:text(raw.parallel_courses),nextBranchIds:[...array(raw.next_branch_ids)],sourceIds:[...array(raw.source_ids)],sources:array(raw.source_ids).map(id=>({id,...clone(sources[id]||{})})),conditionState:candidate.conditionState||'unknown',explanation:text(raw.explanation)};
 });
 const nodeIds=new Set(nodes.map(n=>n.id)),edges=nodes.flatMap(n=>n.nextBranchIds.map((to,index)=>({id:`${n.id}:${to}:${index}`,from:n.id,to,resolved:nodeIds.has(to),kind:'catalog_followup',automaticJoin:false})));
 const areas=AREA_DEFS.map(def=>({...def,records:current.filter(c=>c.area===def.id),notes:goalSummary(s,def.id),branchIds:nodes.filter(n=>n.area===def.id).map(n=>n.id),rowIds:sections.flatMap(section=>section.rows.filter(row=>row.areas.includes(def.id)).map(row=>row.id)),interest:s.goals?.[def.id]===true?'interested':s.wizard?.quick?.detailStatuses?.[def.id]==='none'?'none':'unconfirmed'}));
 const overview=areas.map(area=>({areaId:area.id,cells:sections.map(section=>{
  const rows=section.rows.filter(r=>r.areas.includes(area.id)),available=rows.filter(r=>representativeBlocks(r,area.id).length),anchor=baseline.records.find(r=>available.some(row=>row.id===r.anchor?.rowId))?.anchor;
  const preferred=area.id==='math'?available.filter(r=>r.tracks.some(t=>['application','depth','thinking','arithmetic'].includes(t))):available;
  const row=available.find(r=>r.id===anchor?.rowId)||preferred[0]||available[0],blocks=row?representativeBlocks(row,area.id):[];
  return {sectionId:section.id,areaId:area.id,rowCount:rows.length,representative:row?{rowId:row.id,firstBlockId:blocks[0].id,lastBlockId:blocks.at(-1).id,first:blocks[0].label,last:blocks.at(-1).label}:null,branchId:area.start,branchTitle:nodes.find(n=>n.id===area.start)?.title||'목표 갈림길 확인'};
 })}));
 const v=s.wizard?.v10||{};
 return {version:1,kind:'full_source_route_comparison',sections,nodes,edges,areas,overview,current,academies:array(s.wizard?.academies).map(a=>({institution:text(a.institution),level:text(a.level)})),currentMatches:baseline.records.map(r=>({courseId:r.courseId,track:r.track,anchor:r.anchor?{section:r.anchor.section,rowId:r.anchor.rowId,blockId:r.anchor.blockId,matchKind:r.anchor.matchKind}:null,matches:r.matches.map(m=>({section:m.section,rowId:m.rowId,blockId:m.blockId,matchKind:m.matchKind}))})),specialNodes:SPECIAL_IDS.filter(id=>nodeIds.has(id)),relations:array(v.relations).map(r=>({id:r.id,kind:r.kind,label:REL_NAMES[r.kind]||'기록한 관계',sourceCourseIds:[...array(r.sourceCourseIds)],targetPlannedCourseIds:[...array(r.targetPlannedCourseIds)],condition:text(r.condition),automaticJoin:false})),plannedCourses:array(v.plannedCourses).map(p=>({id:p.id,track:p.track,name:text(p.name),scope:text(p.scope),state:'planned'})),direction:s.wizard?.quick?.learningDirection||'current',sourceYear:/^\d{4}/.exec(text(source.source?.sourceDate))?.[0]||'',counts:{sections:sections.length,rows:sections.reduce((n,x)=>n+x.rows.length,0),blocks:sections.reduce((n,x)=>n+x.rows.reduce((m,r)=>m+r.blocks.length,0),0),nodes:nodes.length,edges:edges.length},referenceOnly:true,automaticApply:false,automaticPromotion:false,calendarDates:null,mastery:null};
}

function sourcePeriod(section,block){const a=section.columns.find(c=>c.index===block.start)?.label||'원표에서 확인',b=section.columns.find(c=>c.index===block.end)?.label||'원표에서 확인';return a===b?a:`${a}~${b}`;}
function currentMarkup(model,area){
 const records=area.records;
 if(area.id==='math')return `<div class="full-route-math-records">${['application','depth','thinking','arithmetic'].map(track=>{const own=records.filter(c=>c.track===track);return `<span><b>${TRACK_NAMES[track]}</b> ${own.length?own.map(c=>esc([c.name,c.scope].filter(Boolean).join(' '))).join(' / '):'아직 기록 없음'}</span>`;}).join('')}</div>`;
 return records.length?records.map(c=>esc([c.name,c.scope].filter(Boolean).join(' '))).join(' / '):area.notes.length?area.notes.map(esc).join(' · '):area.interest==='none'?'관심 없음으로 기록':'필요할 때 살펴보기';
}
function areaMarkup(model,ui){
 return `<div class="full-route-areas" role="group" aria-label="전체 로드맵 영역">${model.areas.map(a=>button(`<span class="full-route-area-name">${esc(a.label)}</span><span class="full-route-area-record">${currentMarkup(model,a)}</span><small>${esc(a.hint)}</small>`, 'data-full-route-domain',a.id,`aria-pressed="${ui.area===a.id}"`)).join('')}</div>`;
}
function overviewMarkup(model,ui){
 return `<div class="full-route-overview-scroll" tabindex="0" role="region" aria-label="유아부터 중등 이후까지, 여섯 영역 전체 로드맵"><table class="full-route-overview"><caption>배움의 전체 경로</caption><thead><tr><th scope="col">영역</th>${model.sections.map(section=>`<th scope="col">${button(`<strong>${esc(section.title)}</strong>`,'data-full-route-section',section.id,`aria-pressed="${section.id===ui.section}"`)}</th>`).join('')}</tr></thead><tbody>${model.overview.map(row=>{const area=model.areas.find(a=>a.id===row.areaId);return `<tr><th scope="row">${esc(area.label)}</th>${row.cells.map(cell=>`<td>${button(cell.representative?`<small class="full-route-example-label">같은 원표 행의 예시</small><span class="full-route-example-book">${esc(cell.representative.first)}</span>${cell.representative.firstBlockId!==cell.representative.lastBlockId?`<span class="full-route-example-between" aria-label="중간 과정은 펼쳐보기">···</span><span class="full-route-example-book">${esc(cell.representative.last)}</span>`:''}<small class="full-route-cell-branch">갈림길 · ${esc(cell.branchTitle)}</small><span class="full-route-cell-more">전체 과정 보기 ›</span>`:`<span class="full-route-no-source">이 구간의 원표 행 없음</span><small>목표 갈림길 자료는 볼 수 있어요.</small><small class="full-route-cell-branch">${esc(cell.branchTitle)}</small>`,'data-full-route-cell',`${cell.sectionId}:${cell.areaId}`,`aria-pressed="${ui.section===cell.sectionId&&ui.area===cell.areaId}"`)}</td>`).join('')}</tr>`;}).join('')}</tbody></table></div><p class="full-route-note full-route-overview-note">지금 보는 구간: ${esc(model.sections.find(s=>s.id===ui.section)?.title||'')}. 원표 예시의 처음·끝은 같은 영역의 한 행이며, 칸 사이를 개인 일정이나 자동 진급으로 잇지 않아요.</p>`;
}
function selectedRows(model,ui){const section=model.sections.find(x=>x.id===ui.section)||model.sections[0];return {section,rows:section?.rows.filter(r=>ui.allRows||r.areas.includes(ui.area))||[]};}
function blockMarkup(section,b,ui,matchSet){
 if(b.isEmpty)return `<span class="full-route-empty-block" data-full-route-empty="${esc(b.id)}" style="grid-column:${b.start+1}/${b.end+2}" aria-hidden="true"></span>`;
 return button(`<span class="full-route-block-role">${matchSet.has(b.id)?'입력 범위 비교 · ':''}${ROLES[b.role]||'원표 안내'}</span><strong>${esc(b.label)}</strong><small>${esc(sourcePeriod(section,b))}</small>`,'data-full-route-block',b.id,`class="full-route-block is-${b.role}${matchSet.has(b.id)?' is-record-match':''}" style="grid-column:${b.start+1}/${b.end+2}" aria-pressed="${ui.block===b.id}"`);
}
function timelineMarkup(model,ui){
 const {section,rows}=selectedRows(model,ui);if(!section)return '<p>비교할 원표 자료를 확인해야 해요.</p>';
 const row=rows.find(x=>x.id===ui.row)||rows[0],selectedBlock=row?.blocks.find(x=>x.id===ui.block)||null;
 const matchSet=new Set(model.currentMatches.flatMap(m=>m.anchor&&row&&m.anchor.rowId===row.id?[m.anchor.blockId]:[]));
 const sourceLabel=section.columns.length?`${section.columns[0].label}~${section.columns.at(-1).label}`:'월축 확인 필요';
 return `<section class="full-route-timeline-panel" aria-label="전체 원표 과정"><div class="full-route-panel-heading"><h3>${esc(model.areas.find(a=>a.id===ui.area)?.label||'전체')}의 전체 과정</h3>${button(ui.allRows?'선택 영역만':'모든 원표 행 보기','data-full-route-all-rows',ui.allRows?'off':'on',`aria-pressed="${ui.allRows}"`)}</div><p class="full-route-note">${esc(sourceLabel)} · 원표의 비교 구간이에요. 개인 일정에 붙이지 않아요.</p>${rows.length?`<label class="full-route-row-picker">살펴볼 원표 경로<select data-full-route-row-select>${rows.map(r=>`<option value="${esc(r.id)}"${r.id===row?.id?' selected':''}>${esc(r.title)} (${r.blocks.filter(b=>b.labelState==='present').length}구간)</option>`).join('')}</select></label>`:'<p class="full-route-empty">이 구간의 원표에는 해당 영역 행이 없어요. 다른 구간이나 아래 갈림길을 볼 수 있어요.</p>'}${row?`<div class="full-route-scroll" tabindex="0" role="region" aria-label="${esc(section.title)} 전체 과정, 옆으로 넘겨 보기"><div class="full-route-timeline" style="--full-route-months:${section.columns.length}"><div class="full-route-months">${section.columns.map(c=>`<span>${esc(c.label)}</span>`).join('')}</div><div class="full-route-blocks">${row.blocks.map(b=>blockMarkup(section,b,ui,matchSet)).join('')}</div></div></div><p class="full-route-note full-route-key">선발·지원과 선택 목표 준비는 학습 진도에 합산하지 않아요. 같은 원표 행에 다른 축이 함께 있어도 실제 기록은 따로 남아요.</p>${selectedBlock?`<div class="full-route-block-readout" tabindex="-1" aria-live="polite"><strong>${esc(selectedBlock.label)}</strong><span>${ROLES[selectedBlock.role]} · ${esc(sourcePeriod(section,selectedBlock))}</span><span>${selectedBlock.timingQuality==='source_reference'?`원표 ${selectedBlock.span}개월 구간`:selectedBlock.timingQuality==='academic_year_structure'?`원표 ${selectedBlock.span}칸 · 학년 구조 참고`:selectedBlock.timingQuality==='approximate_reference'?`원표 약 ${selectedBlock.span}칸 · 근사 구간`:`원표 ${selectedBlock.span}칸 · 시점 확인 필요`}</span>${matchSet.has(selectedBlock.id)?'<small>입력 범위와 비교한 원표예요. 완료·숙달을 판정한 위치가 아니에요.</small>':''}</div>`:''}<details class="full-route-source-evidence"><summary>원표와 기간 근거</summary><p>${model.sourceYear?'자료 정리 기준: '+esc(model.sourceYear)+'년 · ':''}사용자 제공 원표이며 최신 공식 일정 확인을 뜻하지 않아요.</p><p>선택한 경로의 ${row.blocks.filter(b=>b.labelState==='present').length}개 구간과 빈 칸을 원래 위치에 표시했어요.</p><a href="${esc(section.referenceUrl)}" target="_blank" rel="noopener">원표 넓게 보기 ↗</a><p class="full-route-source-id">${esc(section.sourcePath)} · 표 ${row.sourceTableIndex+1}, 행 ${row.sourceRowIndex+1}${selectedBlock?`, 칸 ${selectedBlock.sourceCellIndex+1}`:''}</p></details>`:''}</section>`;
}
function nodeMarkup(model,ui){
 const node=model.nodes.find(n=>n.id===ui.branch)||model.nodes.find(n=>n.id===model.areas.find(a=>a.id===ui.area)?.start)||model.nodes[0];
 if(!node)return '<p>갈림길 자료를 확인해야 해요.</p>';
 const next=node.nextBranchIds.map(id=>model.nodes.find(n=>n.id===id)||{id,title:'연결 자료 확인 필요'});
 const chosen=node.paths.find(p=>p.id===ui.path);
 return `<section class="full-route-node" data-full-route-node="${esc(node.id)}"><div class="full-route-node-heading"><span class="full-route-overline">${esc(node.id)} · 자료의 갈림길</span><h3>${esc(node.title)}</h3></div><p class="full-route-note">실제 진입 가능 여부와 개인 추천은 별도로 확인해요.</p><div class="full-route-path-choices" role="group" aria-label="비교할 선택 경로">${node.paths.map(p=>button(esc(p.label),'data-full-route-path',p.id,`aria-pressed="${ui.path===p.id}"`)).join('')}</div>${chosen?`<p class="full-route-comparison-choice" role="status">비교 중: ${esc(chosen.label)} · 계획에는 적용하지 않았어요.</p>`:''}<dl><div><dt>진입·보완 확인</dt><dd>${esc(node.conditions||'자료 확인 필요')}</dd></div><div><dt>병행 검토</dt><dd>${esc(node.parallel||'실제 여건을 확인해요.')}</dd></div></dl><h4>다음 갈림길</h4><div class="full-route-next">${next.length?next.map(n=>button(`${esc(n.title)} <span aria-hidden="true">›</span>`,'data-full-route-branch',n.id)).join(''):'<p>다음 연결은 자료 확인이 필요해요.</p>'}</div><details class="full-route-node-evidence"><summary>출처와 확정 상태</summary><p>${esc(node.status||'확인 필요')}</p><p>${esc(node.origin)}</p><ul>${node.sources.map(source=>`<li><strong>${esc(source.id)}</strong> ${esc(source.file||source.locator||'출처 확인 필요')}${source.year?` · ${esc(source.year)}`:''}${source.kind?`<small>${esc(source.kind)}</small>`:''}</li>`).join('')}</ul><p>질문 ${node.questionIds.length}개는 상세 확인용 자료예요. 이 화면에서 모두 답할 필요는 없어요.</p></details></section>`;
}
function specialMarkup(model,ui){
 const names=new Map(model.current.map(c=>[c.id,[c.name,c.scope].filter(Boolean).join(' ')])),planned=new Map(model.plannedCourses.map(p=>[p.id,[p.name,p.scope].filter(Boolean).join(' ')]));
 return `<details class="full-route-special"${ui.special?' open':''}><summary>보완·목표 변경·쉬었다 이어가기</summary><div class="full-route-special-links">${model.specialNodes.map(id=>{const n=model.nodes.find(n=>n.id===id);return button(esc(n.title),'data-full-route-open-special',id);}).join('')}</div>${model.relations.length?`<h4>남겨 둔 과정 관계</h4><ul>${model.relations.map(r=>`<li><strong>${esc(r.label)}</strong><span>${r.sourceCourseIds.map(id=>esc(names.get(id)||'기존 과정')).join(' / ')}${r.targetPlannedCourseIds.length?' → '+r.targetPlannedCourseIds.map(id=>esc(planned.get(id)||'예정 과정')).join(' / '):''}</span>${r.condition?`<small>${esc(r.condition)}</small>`:''}</li>`).join('')}</ul>`:''}${model.plannedCourses.length?`<h4>나중에 추가하려고 남긴 과정</h4><ul>${model.plannedCourses.map(p=>`<li><strong>${esc(TRACK_NAMES[p.track]||'과정')}</strong><span>${esc([p.name,p.scope].filter(Boolean).join(' · '))} · 예정</span></li>`).join('')}</ul>`:''}<p class="full-route-note">보완 뒤 합류·재개는 가족이 다시 선택해요. 자동 합류나 완료로 처리하지 않아요.</p></details>`;
}
function markup(model,ui){
 const area=model.areas.find(a=>a.id===ui.area)||model.areas[0];
 return `<section class="full-route-map"><header class="full-route-heading"><span class="full-route-overline">지금부터 다음 목표까지</span><h2>전체 로드맵</h2><p>우리 아이 기록과 여러 경로를 함께 살펴보세요.</p></header>${overviewMarkup(model,ui)}<h3 class="full-route-current-heading">입력한 현재 기록</h3>${areaMarkup(model,ui)}${model.academies.length?`<p class="full-route-academy-record">학원 경험 · ${model.academies.map(a=>esc([a.institution,a.level].filter(Boolean).join(' '))).join(' / ')}</p>`:''}<div class="full-route-directions" role="group" aria-label="학습 방향">${DIRECTIONS.map(([id,label,hint])=>button(`<strong>${label}</strong><small>${hint}</small>`,'data-full-route-action',id==='faster'?'speed':`direction:${id}`,`aria-pressed="${model.direction===id}"`)).join('')}</div><p class="full-route-note full-route-speed-note">속도 UP은 수학의 앞으로 할 구간을 비교해요. 적용 전에 변경될 기간을 확인할 수 있어요.</p>${timelineMarkup(model,ui)}<div class="full-route-area-actions">${area.id==='math'?button('프리미어·소마·필즈 살펴보기','data-full-route-action','academy:premier')+button('황소 선발 살펴보기','data-full-route-action','academy:hwangso'):button(`${esc(area.label)} 기록·목표 살펴보기`,'data-full-route-action',`purpose:${area.id}`)}</div>${specialMarkup(model,ui)}<details class="full-route-explorer"${ui.explore?' open':''}><summary>다른 갈림길 살펴보기</summary><label class="full-route-node-picker">살펴볼 갈림길<select data-full-route-branch-select>${model.areas.map(a=>`<optgroup label="${esc(a.label)}">${model.nodes.filter(n=>n.area===a.id).map(n=>`<option value="${esc(n.id)}"${n.id===ui.branch?' selected':''}>${esc(n.title)}</option>`).join('')}</optgroup>`).join('')}</select></label>${nodeMarkup(model,ui)}</details><p class="full-route-note full-route-inventory">자료 전체 ${model.counts.sections}구간 · ${model.counts.rows}행 · ${model.counts.blocks}블록 · 갈림길 ${model.counts.nodes}개. 각 원표의 월축은 따로 보존해요.</p></section>`;
}
function initialSection(state,model){const stage=state.wizard?.quick?.stage||'';const wanted=/^p[4-7]$|^[4-7]세$/.test(stage)?'S1':/^(?:e[12]|초[12])$/.test(stage)?'S2':/^(?:e[3-6]|초[3-6])$/.test(stage)?'S3':'S4';return model.sections.some(s=>s.id===wanted)?wanted:model.sections[0]?.id||'';}

export function mountFullRouteMap(host,{state,data={},onAction}={}){
 if(!host)return {dispose(){}};mounts.get(host)?.dispose();
 const model=buildFullRouteModel(state||{},data),ui={area:'math',section:initialSection(state||{},model),row:'',block:'',branch:'B09',path:'',explore:false,special:false,allRows:false};
 const initial=model.currentMatches.find(m=>m.anchor?.section===ui.section)?.anchor;if(initial)ui.row=initial.rowId;
 let disposed=false,firstRender=true;
 const remember=()=>({scroll:host.querySelector('.full-route-scroll')?.scrollLeft||0,matrixScroll:host.querySelector('.full-route-overview-scroll')?.scrollLeft||0,details:[...host.querySelectorAll('details[open]')].map(el=>el.className)});
 function render({preserveScroll=false,focus=''}={}){
  if(disposed)return;const previous=remember();host.innerHTML=markup(model,ui);for(const cls of previous.details)for(const el of host.querySelectorAll('details'))if(el.className===cls)el.open=true;
  if(preserveScroll&&host.querySelector('.full-route-scroll'))host.querySelector('.full-route-scroll').scrollLeft=previous.scroll;
  const matrix=host.querySelector('.full-route-overview-scroll');
  if(matrix){matrix.scrollLeft=previous.matrixScroll;if(firstRender){const cell=host.querySelector(`[data-full-route-cell="${ui.section}:${ui.area}"]`),sticky=host.querySelector('.full-route-overview tbody th');if(cell&&sticky)matrix.scrollLeft=Math.max(0,cell.getBoundingClientRect().left-matrix.getBoundingClientRect().left-sticky.getBoundingClientRect().width-3);}}
  firstRender=false;
  if(focus)host.querySelector(focus)?.focus({preventScroll:true});
 }
 function chooseRow(id){const row=model.sections.flatMap(s=>s.rows).find(r=>r.id===id);if(!row)return;ui.section=row.sectionId;ui.row=row.id;ui.block='';}
 const onClick=event=>{
  event.stopPropagation();const el=event.target?.closest?.('button');if(!el||!host.contains(el))return;
  if(el.hasAttribute('data-full-route-action')){onAction?.(el.dataset.fullRouteAction);return;}
  if(el.hasAttribute('data-full-route-cell')){const [section,area]=el.dataset.fullRouteCell.split(':');const cell=model.overview.find(r=>r.areaId===area)?.cells.find(c=>c.sectionId===section);if(!cell)return;ui.section=section;ui.area=area;ui.row=cell.representative?.rowId||'';ui.block='';ui.allRows=false;ui.branch=cell.branchId;ui.path='';if(!cell.representative)ui.explore=true;render();host.querySelector(cell.representative?'.full-route-timeline-panel':'.full-route-node-heading')?.scrollIntoView({block:'nearest',behavior:'auto'});host.querySelector(cell.representative?'[data-full-route-row-select]':'[data-full-route-branch-select]')?.focus({preventScroll:true});return;}
  if(el.hasAttribute('data-full-route-domain')){ui.area=el.dataset.fullRouteDomain;ui.allRows=false;ui.row='';ui.block='';if(!model.sections.find(s=>s.id===ui.section)?.rows.some(r=>r.areas.includes(ui.area)))ui.section=model.sections.find(s=>s.rows.some(r=>r.areas.includes(ui.area)))?.id||ui.section;ui.branch=model.areas.find(a=>a.id===ui.area)?.start||model.nodes[0]?.id;ui.path='';render({focus:`[data-full-route-domain="${ui.area}"]`});return;}
  if(el.hasAttribute('data-full-route-section')){ui.section=el.dataset.fullRouteSection;ui.row='';ui.block='';render({focus:`[data-full-route-section="${ui.section}"]`});return;}
  if(el.hasAttribute('data-full-route-all-rows')){ui.allRows=!ui.allRows;ui.row='';ui.block='';render({focus:'[data-full-route-all-rows]'});return;}
  if(el.hasAttribute('data-full-route-block')){ui.block=el.dataset.fullRouteBlock;render({preserveScroll:true,focus:'[data-full-route-block="'+ui.block+'"]'});return;}
  if(el.hasAttribute('data-full-route-branch')||el.hasAttribute('data-full-route-open-special')){ui.branch=el.dataset.fullRouteBranch||el.dataset.fullRouteOpenSpecial;ui.explore=true;ui.path='';render({preserveScroll:true});host.querySelector('.full-route-node-heading')?.scrollIntoView({block:'nearest',behavior:'auto'});host.querySelector('[data-full-route-branch-select]')?.focus({preventScroll:true});return;}
  if(el.hasAttribute('data-full-route-path')){ui.path=el.dataset.fullRoutePath;render({preserveScroll:true,focus:`[data-full-route-path="${ui.path}"]`});}
 };
 const onChange=event=>{
  event.stopPropagation();if(event.target?.hasAttribute('data-full-route-row-select')){chooseRow(event.target.value);render({focus:'[data-full-route-row-select]'});}
  else if(event.target?.hasAttribute('data-full-route-branch-select')){ui.branch=event.target.value;ui.explore=true;ui.path='';render({preserveScroll:true,focus:'[data-full-route-branch-select]'});}
 };
 const stop=event=>event.stopPropagation();host.addEventListener('click',onClick);host.addEventListener('change',onChange);host.addEventListener('input',stop);render();
 const api={dispose(){if(disposed)return;disposed=true;host.removeEventListener('click',onClick);host.removeEventListener('change',onChange);host.removeEventListener('input',stop);host.replaceChildren();if(mounts.get(host)===api)mounts.delete(host);}};mounts.set(host,api);return api;
}
