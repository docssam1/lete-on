(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const escape = value => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const copy = value => JSON.parse(JSON.stringify(value));
  const freeze = value => { if(value && typeof value === 'object' && !Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);} return value; };
  const diagnosis = window.HFChallengeDiagnosis;
  const variants = window.HFChallengeVariants;
  const localHost = ['localhost','127.0.0.1','[::1]'].includes(location.hostname);
  const localPreview = localHost && new URLSearchParams(location.search).get('teacherPreview')==='1';
  const state = {tab:'grade',round:1,bankRound:'all',responses:new Map(),selected:{bank:new Set(),wrong:new Set()},query:'',area:'',type:'',section:'all',difficulty:'same',snapshot:null,report:null,preview:null,composing:false,busy:false,printRevision:0,approvedIdentity:null,localName:''};
  const rounds = new Map();
  const rows = new Map();
  const hoverCache = new Map();
  let hoverTimer=0,hoverRequest=0;
  const statusLabels = {insufficient:'판단 자료 부족',pending:'채점 미완료',strength:'강점 근거 있음',developing:'추가 확인',review:'보완 필요'};
  const levelLabels = {easy:'더 쉽게',same:'같은 난이도',hard:'더 어렵게'};
  function message(text, error=false){$('studioMessage').textContent=text;$('studioMessage').classList.toggle('error',error);}
  function allowed(product, typeId){
    if(window.HFChallengeAccess){try{return window.HFChallengeAccess.allow(product,typeId)===true;}catch(_){return false;}}
    return localPreview;
  }
  function permitted(row){return allowed('challenge-bank',row.typeId);}
  function selectedSet(){return state.selected[state.tab==='wrong'?'wrong':'bank'];}
  function typeGroupKey(row){const t=row.taxonomy;return `${t.areaId}:${t.subareaId}:${t.typeId}`;}
  function selectionLimit(){return Math.min(20,...[...selectedSet()].map(id=>eligibility(rows.get(id)).poolCounts?.[state.difficulty]??20));}
  function currentRound(){return rounds.get(state.round);}
  function roundResponses(round=state.round){return (rounds.get(round)?.questions||[]).map(row=>state.responses.get(row.occurrenceId)||{occurrenceId:row.occurrenceId,fingerprint:row.fingerprint,status:'pending'});}
  function analyze(){return diagnosis.analyze({round:state.round,responses:roundResponses()});}
  function verifiedIdentity(){const value=window.HFChallengeAccess?.watermarkIdentity?.();return value?.studentId&&value?.name?{studentId:value.studentId,name:value.name}:null;}
  function identity(){return {name:verifiedIdentity()?.name||$('studioStudent').value.trim(),school:$('studioSchool').value.trim()};}
  function updateExamLink(){const params=new URLSearchParams({round:String(state.round)});if(localPreview)params.set('teacherPreview','1');$('studioExamLink').setAttribute('href',`exam.html?${params}`);}
  function sameIdentity(first,second){return JSON.stringify(first||null)===JSON.stringify(second||null);}
  function updateAccessNotice(){
    const approved=verifiedIdentity();
    $('accessNotice').textContent=localPreview?'교사용 로컬 미리보기 · 입력한 내용은 이 화면에서만 사용하며 공식 성적으로 저장되지 않습니다.':approved?`${approved.name} · 승인된 자료만 사용할 수 있습니다. 이 화면의 채점은 공식 성적이 아닙니다.`:'이용 승인 확인이 필요합니다. 승인된 자료와 학생 이름을 확인한 뒤 이용할 수 있습니다.';
    if(!localPreview){$('studioStudent').value=approved?.name||'';$('studioStudent').readOnly=true;}
  }
  function rowLabel(row){return `${row.round}회 ${row.section==='extra'?'추가 ':''}${row.number}번`;}
  function pathLabel(row){const t=row.taxonomy;return `${t.areaLabel} / ${t.subareaLabel} / ${t.typeLabel}`;}
  function sourceFor(row){return variants.getSource({round:row.round,section:row.section,number:row.number});}
  function eligibility(row){return variants.describe({round:row.round,section:row.section,number:row.number});}
  function canSelect(row){return permitted(row)&&eligibility(row)?.eligibility?.[state.difficulty]===true;}
  function activeWrong(row){const response=state.responses.get(row.occurrenceId);return row.section==='main'&&response?.status==='wrong'&&response.fingerprint===row.fingerprint;}
  function syncWrongSelection(){let removed=0;for(const id of state.selected.wrong){if(!activeWrong(rows.get(id))){state.selected.wrong.delete(id);removed++;}}return removed;}
  function changeTab(tab,focus=false){
    state.tab=tab;state.query='';state.area='';state.type='';state.section='all';$('studioSearch').value='';$('sectionFilter').value='all';
    document.querySelectorAll('[data-tab]').forEach(button=>{const active=button.dataset.tab===tab;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;if(active&&focus)button.focus();});
    $('roundContext').hidden=tab==='bank';$('bankRoundControl').hidden=tab!=='bank';
    $('grade-panel').hidden=tab!=='grade';$('bank-panel').hidden=tab==='grade';$('bank-panel').setAttribute('aria-labelledby',`tab-${tab==='wrong'?'wrong':'bank'}`);
    message('');if(tab==='grade')renderGrade();else{renderBankFilters();renderBank();}
  }
  function renderGrade(){
    $('diagnosisPanel').hidden=true;state.report=null;
    if(!allowed(`challenge-mock-${state.round}`)){$('gradeRows').innerHTML='<p class="bank-empty">이 회차의 이용 승인이 필요합니다.</p>';$('scoreSummary').innerHTML='';$('makeDiagnosis').disabled=true;return;}
    $('makeDiagnosis').disabled=false;
    $('gradeRows').innerHTML=currentRound().questions.map(row=>{
      const status=state.responses.get(row.occurrenceId)?.status||'pending';
      return `<article class="grade-row"><b class="grade-number">${row.number}</b><div><button type="button" class="grade-preview grade-title" data-preview="${escape(row.occurrenceId)}">${escape(row.taxonomy.typeLabel)}</button><div class="grade-path">${escape(row.taxonomy.areaLabel)} / ${escape(row.taxonomy.subareaLabel)}</div></div><fieldset class="grade-status"><legend>${row.number}번 채점</legend>${[['pending','미입력'],['correct','정답'],['wrong','오답']].map(([value,label])=>`<label><input type="radio" name="grade-${escape(row.occurrenceId)}" data-grade="${escape(row.occurrenceId)}" value="${value}" ${value===status?'checked':''}>${label}</label>`).join('')}</fieldset></article>`;
    }).join('');
    renderScore();
  }
  function renderScore(){
    const result=analyze();
    const registered=result.correctCount+result.wrongCount;
    $('scoreSummary').innerHTML=`<h3>${state.round}회 채점 현황</h3><div class="score-value">${registered===0?'미입력':result.complete?`${result.score}<small> / 100점</small>`:`${registered}<small> / 20문항</small>`}</div><progress value="${registered}" max="20" aria-label="채점 완료 문항"></progress><p>${result.complete?(result.score>=60?'기준 60점에 도달했습니다.':`기준까지 ${60-result.score}점, ${Math.ceil((60-result.score)/5)}문항이 더 필요합니다.`):registered?`현재 확보 ${result.earnedPoints}점 · 가능한 점수 ${result.possibleScoreRange[0]}~${result.possibleScoreRange[1]}점`:'아직 채점을 입력하지 않았습니다. 정답·오답을 입력하면 이 화면에서 점수를 확인할 수 있습니다.'}</p><div class="score-detail"><span>정답 ${result.correctCount}</span><span>오답 ${result.wrongCount}</span><span>미입력 ${result.pendingCount}</span></div>`;
  }
  function groupTable(groups){return `<table class="diagnosis-table"><thead><tr><th scope="col">영역·유형</th><th scope="col">정답 / 채점</th><th scope="col">미입력</th><th scope="col">확인 결과</th></tr></thead><tbody>${groups.map(group=>`<tr><td>${escape(group.label)}</td><td>${group.correct} / ${group.graded}</td><td>${group.pending}</td><td><span class="evidence-tag ${escape(group.status)}">${escape(statusLabels[group.status]||group.evidenceLabel||'확인 필요')}</span></td></tr>`).join('')}</tbody></table>`;}
  function recommendationsHtml(result){
    if(!result.recommendations.length)return `<p class="diagnosis-note">${result.complete?'틀린 문항이 없습니다. 다른 유형의 결과도 함께 보며 강점을 확인하세요.':'입력된 오답이 없습니다. 남은 문항을 채점한 뒤 학습 순서를 정하세요.'}</p>`;
    return `<ol class="recommendation-list">${result.recommendations.map(item=>`<li><strong>${item.number}번 · ${escape(item.typeLabel)}</strong>${escape(item.reason)}<br>${escape(item.action)}</li>`).join('')}</ol>`;
  }
  function showDiagnosis(){
    if(!allowed(`challenge-mock-${state.round}`))return message('이 회차의 이용 승인이 필요합니다.',true);
    const result=analyze();state.report=freeze(copy({result,round:state.round,student:identity(),approvedIdentity:verifiedIdentity()}));
    const lead=result.complete?`${result.score}점. ${result.score>=60?'기준 60점에 도달했습니다.':`기준까지 ${60-result.score}점입니다.`}`:`채점 ${20-result.pendingCount}/20문항. 미입력 ${result.pendingCount}문항은 점수나 약점으로 판단하지 않습니다.`;
    const groups=result.groups;
    $('diagnosisPanel').innerHTML=`<div class="diagnosis-toolbar"><div><h2>${escape(identity().name||'학생')}의 ${state.round}회 진단</h2><p class="diagnosis-note">교사 입력 결과 · 공식 성적표 아님</p></div><button type="button" id="printDiagnosis">진단지 인쇄 보기</button></div><p class="diagnosis-lead">${escape(lead)}</p><p class="diagnosis-note">한두 문항의 결과만으로 강점·약점을 단정하지 않습니다. 영역에서 잘 풀었더라도 틀린 세부 유형은 따로 확인합니다.</p><section class="diagnosis-group"><h3>대영역</h3>${groupTable(groups.areas)}</section><section class="diagnosis-group"><h3>소영역</h3>${groupTable(groups.subareas)}</section><details class="diagnosis-group"><summary>세부 유형별 근거 보기</summary>${groupTable(groups.types)}</details><section class="diagnosis-group"><h3>다음에 맞혀 볼 문제</h3><p class="diagnosis-note">${escape(result.scorePlan?.statement||'틀린 유형의 조건과 풀이 방법을 다시 확인합니다.')}</p>${recommendationsHtml(result)}</section><button type="button" class="primary" id="practiceWrong">틀린 문제의 유사유형 선택</button>`;
    $('diagnosisPanel').hidden=false;$('diagnosisPanel').scrollIntoView({block:'start',behavior:'auto'});
  }
  function baseRows(){return [...rows.values()].filter(row=>state.tab==='wrong'?(row.round===state.round&&activeWrong(row)):(state.bankRound==='all'||row.round===Number(state.bankRound)));}
  function sectionRows(){return baseRows().filter(row=>state.section==='all'||row.section===state.section);}
  function renderAreaFilter(){
    const areas=new Map(sectionRows().map(row=>[row.taxonomy.areaId,row.taxonomy.areaLabel]));
    if(state.area&&!areas.has(state.area)){state.area='';state.type='';}
    $('areaFilter').innerHTML='<option value="">전체 영역</option>'+[...areas].map(([id,label])=>`<option value="${escape(id)}">${escape(label)}</option>`).join('');$('areaFilter').value=state.area;
  }
  function renderTypeFilter(){
    const candidates=sectionRows().filter(row=>!state.area||row.taxonomy.areaId===state.area),types=new Map();
    candidates.forEach(row=>{const t=row.taxonomy,key=typeGroupKey(row),label=state.area?`${t.subareaLabel} · ${t.typeLabel}`:`${t.areaLabel} · ${t.typeLabel}`;if(!types.has(key))types.set(key,label);});
    if(state.type&&!types.has(state.type))state.type='';
    $('typeFilter').innerHTML='<option value="">전체 유형</option>'+[...types].map(([id,label])=>`<option value="${escape(id)}">${escape(label)}</option>`).join('');$('typeFilter').value=state.type;
  }
  function renderBankFilters(){renderAreaFilter();renderTypeFilter();}
  function visibleRows(){const query=state.query.normalize('NFC').replace(/\s+/g,'').toLocaleLowerCase();return baseRows().filter(row=>{
    if(state.area&&row.taxonomy.areaId!==state.area)return false;
    if(state.type&&typeGroupKey(row)!==state.type)return false;
    if(state.section!=='all'&&row.section!==state.section)return false;
    if(!query)return true;
    const question=permitted(row)?sourceFor(row):null;
    return `${pathLabel(row)} ${rowLabel(row)} ${question?.prompt||''}`.normalize('NFC').replace(/\s+/g,'').toLocaleLowerCase().includes(query);
  });}
  function renderBank(){
    hideHoverPreview();
    const wrong=state.tab==='wrong';$('bankTitle').textContent=wrong?'오답에서 다음 학습 고르기':'영역·유형 문제은행';$('bankScope').textContent=wrong?`${state.round}회에서 오답으로 입력한 본시험 문항만 표시합니다. 미입력·추가 연습은 포함하지 않습니다.`:state.bankRound==='all'?'전체 4회에서 영역과 유형을 골라 한 학습지로 인쇄할 수 있습니다.':'선택한 회차에서 영역과 유형을 골라 한 학습지로 인쇄할 수 있습니다.';
    const visible=visibleRows(),visibleTypes=new Set(visible.map(typeGroupKey));$('resultCount').textContent=`${visible.length}개 원문 · ${visibleTypes.size}개 학습 유형`;
    const selected=selectedSet();
    $('bankRows').innerHTML=visible.length?visible.map(row=>{
      const description=eligibility(row), access=permitted(row), can=access&&description.eligibility[state.difficulty];
      const levels=Object.entries(levelLabels).filter(([level])=>description.eligibility[level]).map(([,label])=>label);
      return `<article class="bank-row ${selected.has(row.occurrenceId)?'is-selected':''}" data-hover-preview="${escape(row.occurrenceId)}" tabindex="${access?'0':'-1'}" aria-label="${escape(row.taxonomy.typeLabel)} 문제 미리보기" ${access?'':'aria-disabled="true"'}><label><input type="checkbox" data-select="${escape(row.occurrenceId)}" ${selected.has(row.occurrenceId)?'checked':''} ${!can&&!selected.has(row.occurrenceId)?'disabled':''}><span><b>${escape(rowLabel(row))} · ${escape(row.taxonomy.typeLabel)}</b><small>${escape(row.taxonomy.areaLabel)} / ${escape(row.taxonomy.subareaLabel)}</small><small class="availability ${can?'':'unavailable'}" title="${escape(description.heldReason||'')}">${!access?'유형별 이용 승인 필요':can?`${levels.join(' · ')} 선택 가능`:`${levelLabels[state.difficulty]} · 검수 중`}</small></span></label><span class="hover-preview-note" aria-hidden="true">올려서 보기</span></article>`;
    }).join(''):`<p class="bank-empty">${wrong&&!baseRows().length?'이 회차에 입력된 오답이 없습니다. 채점 화면에서 확인한 오답을 표시하세요.':'현재 조건에 맞는 유형이 없습니다.'}</p>`;
    const areaRows=state.area?sectionRows().filter(row=>row.taxonomy.areaId===state.area):[],typeRows=state.type?sectionRows().filter(row=>typeGroupKey(row)===state.type):[];
    $('selectArea').disabled=!state.area||!areaRows.some(canSelect);$('selectType').disabled=!state.type||!typeRows.some(canSelect);$('selectVisible').disabled=!visible.some(canSelect);$('clearVisible').disabled=!visible.some(row=>selected.has(row.occurrenceId));renderSelection();
  }
  function renderSelection(){
    const selected=selectedSet(),visible=new Set(visibleRows().map(row=>row.occurrenceId));
    const hidden=[...selected].filter(id=>!visible.has(id)).length;
    const selectedRows=[...selected].map(id=>rows.get(id)).filter(Boolean),typeCount=new Set(selectedRows.map(typeGroupKey)).size;
    $('selectionCount').textContent=`선택 ${selected.size}개 원문 · ${typeCount}개 학습 유형${hidden?` · 현재 결과 밖 ${hidden}개`:''}`;
    $('jumpAssembly').textContent=`선택 ${selected.size}개 · 구성으로 이동`;
    $('selectedList').innerHTML=[...selected].map(id=>{const row=rows.get(id);return `<li><span>${escape(rowLabel(row))} · ${escape(row.taxonomy.typeLabel)}${canSelect(row)?'':' · 현재 사용 불가'}</span><button type="button" data-remove="${escape(id)}" aria-label="${escape(rowLabel(row))} 선택 해제">해제</button></li>`;}).join('');
    const limit=selectionLimit();$('variantCount').max=String(limit);const count=Number($('variantCount').value),valid=Number.isInteger(count)&&count>0&&count<=limit, total=valid?count*selected.size:0;
    const locked=[...selected].filter(id=>!canSelect(rows.get(id))).length;
    $('assemblySummary').textContent=locked?`선택 중 ${locked}개 유형이 현재 난이도에서 사용 불가합니다. 난이도를 바꾸거나 해당 선택을 해제하세요.`:!selected.size?'원문 유형을 선택하세요.':!valid?`선택한 유형은 원문당 1~${limit}문항으로 구성할 수 있습니다.`:total>100?'총 100문항 이내로 문항 수를 줄여 주세요.':`${selected.size}개 원문 유형 × ${count}문항 = 총 ${total}문항`;
    $('buildPractice').disabled=state.busy||!selected.size||!valid||total>100||locked>0;
    $('clearSelection').disabled=!selected.size;
  }
  async function showPreview(id){
    const row=rows.get(id);const access=state.tab==='grade'?allowed(`challenge-mock-${row.round}`):permitted(row);
    if(!access)return message('이 자료의 이용 승인이 필요합니다.',true);
    const requestedIdentity=verifiedIdentity();let question;try{question=state.tab==='grade'?await sourceFor(row):await hoverQuestion(row);}catch(e){return message(e.message,true);}if(!sameIdentity(requestedIdentity,verifiedIdentity()))return;if(!question?.prompt)return message('원문을 불러오지 못했습니다.',true);
    state.preview={row,question:freeze(copy(question)),access:state.tab==='grade'?'mock':'bank',approvedIdentity:verifiedIdentity()};
    $('previewLocation').textContent=pathLabel(row);$('previewTitle').textContent=`${rowLabel(row)} 원문`;
    $('previewQuestion').innerHTML=`<p class="studio-prompt">${escape(question.prompt)}</p><div class="studio-art">${question.problemHtml||''}</div>`;
    $('previewAnswer').innerHTML='';$('previewAnswer').hidden=true;$('revealPreview').hidden=false;
    $('previewQuestion').dataset.watermark=approvedWatermark();$('previewAnswer').dataset.watermark=approvedWatermark();$('questionPreview').dataset.zoom='false';$('togglePreviewZoom').hidden=!question.problemHtml;$('togglePreviewZoom').textContent='그림 크게 보기';$('togglePreviewZoom').setAttribute('aria-pressed','false');
    $('questionPreview').showModal();
  }
  function hideHoverPreview(){clearTimeout(hoverTimer);hoverTimer=0;hoverRequest++;const panel=$('hoverPreview');panel.hidden=true;panel.innerHTML='';delete panel.dataset.watermark;}
  function positionHoverPreview(trigger){const panel=$('hoverPreview'),rect=trigger.getBoundingClientRect(),gap=12,margin=14,width=Math.min(430,innerWidth-margin*2);panel.style.width=`${width}px`;let left=rect.right+gap;if(left+width>innerWidth-margin)left=rect.left-width-gap;if(left<margin)left=margin;const height=panel.getBoundingClientRect().height;panel.style.left=`${Math.round(left)}px`;panel.style.top=`${Math.round(Math.max(margin,Math.min(rect.top,innerHeight-height-margin)))}px`;}
  function hoverQuestion(row){if(hoverCache.has(row.occurrenceId))return hoverCache.get(row.occurrenceId);const request=Promise.resolve(sourceFor(row)).catch(error=>{hoverCache.delete(row.occurrenceId);throw error;});hoverCache.set(row.occurrenceId,request);return request;}
  async function showHoverPreview(id,trigger){
    const row=rows.get(id);if(!row||!permitted(row))return hideHoverPreview();const token=++hoverRequest,requestedIdentity=verifiedIdentity(),panel=$('hoverPreview');
    panel.innerHTML='<p class="hover-preview-loading">문제를 불러오는 중입니다.</p>';panel.hidden=false;positionHoverPreview(trigger);
    try{const question=await hoverQuestion(row);if(token!==hoverRequest||!sameIdentity(requestedIdentity,verifiedIdentity())||!permitted(row))return;panel.innerHTML=`<header><small>${escape(pathLabel(row))}</small><b>${escape(rowLabel(row))} · ${escape(row.taxonomy.typeLabel)}</b></header><p class="studio-prompt">${escape(question.prompt)}</p><div class="studio-art">${question.problemHtml||''}</div><p class="hover-preview-help">클릭하거나 Enter를 누르면 크게 볼 수 있습니다.</p>`;panel.dataset.watermark=approvedWatermark();const overlay=createWatermarkOverlay('hover-watermark');if(overlay)panel.append(overlay);panel.hidden=false;positionHoverPreview(trigger);}catch(_){if(token===hoverRequest)hideHoverPreview();}
  }
  function scheduleHoverPreview(trigger){clearTimeout(hoverTimer);hoverTimer=setTimeout(()=>showHoverPreview(trigger.dataset.hoverPreview,trigger),160);}
  function showGeneratedPreview(index){
    const snapshot=state.snapshot;if(!snapshot||snapshot.kind!=='practice'||!snapshotAllowed(snapshot))return;
    const entry=snapshot.entries[index],row=rows.get(entry.occurrenceId);if(!entry||!row)return;
    state.preview={row,question:entry.question,access:'bank',approvedIdentity:snapshot.approvedIdentity};
    $('previewLocation').textContent=`${rowLabel(row)} 유형 · ${levelLabels[snapshot.difficulty]}`;$('previewTitle').textContent=`학습지 ${index+1}번`;
    $('previewQuestion').innerHTML=`<p class="studio-prompt">${escape(entry.question.prompt)}</p><div class="studio-art">${entry.question.problemHtml||''}</div>`;
    $('previewAnswer').innerHTML='';$('previewAnswer').hidden=true;$('revealPreview').hidden=false;$('previewQuestion').dataset.watermark=approvedWatermark();$('previewAnswer').dataset.watermark=approvedWatermark();$('togglePreviewZoom').hidden=false;$('togglePreviewZoom').textContent='전체 그림 보기';$('togglePreviewZoom').setAttribute('aria-pressed','true');$('questionPreview').dataset.zoom='true';$('questionPreview').showModal();
  }
  function logo(){return '<div class="page-logo"><img src="assets/gfield-logo.png" alt="지필드"><span>LETE-ON</span></div>';}
  function watermarkDetails(){const approved=verifiedIdentity();if(approved?.name)return {name:approved.name,brand:'학생 · GFIELD · LETE-ON'};if(localPreview)return {name:'교사용 검토',brand:'GFIELD · LETE-ON'};return null;}
  function approvedWatermark(){const mark=watermarkDetails();return mark?`${mark.name} · ${mark.brand}`:'';}
  function createWatermarkOverlay(className){const mark=watermarkDetails();if(!mark)return null;const overlay=document.createElement('div');overlay.className=className;overlay.setAttribute('aria-hidden','true');
    for(let line=0;line<3;line++){const row=document.createElement('span'),name=document.createElement('b'),brand=document.createElement('small');name.className='watermark-name';name.textContent=mark.name;brand.className='watermark-brand';brand.textContent=mark.brand;row.append(name,brand);overlay.append(row);}return overlay;
  }
  function addPageWatermark(element){element.querySelector(':scope > .page-watermark')?.remove();const overlay=createWatermarkOverlay('page-watermark');if(!overlay)return false;element.dataset.watermark=approvedWatermark();element.append(overlay);return true;}
  function watermarkReady(){const mark=watermarkDetails(),pages=[...$('worksheetPages').children].filter(element=>!element.classList.contains('blank'));return !!mark&&pages.length>0&&pages.every(element=>{const lines=[...element.querySelectorAll(':scope > .page-watermark > span')];return element.dataset.watermark===approvedWatermark()&&lines.length===3&&lines.every(line=>line.querySelector('.watermark-name')?.textContent===mark.name&&line.querySelector('.watermark-brand')?.textContent===mark.brand);});}
  function lockPrint(){document.body.dataset.printReady='false';document.body.dataset.watermarkReady='false';}
  function page(title,content,student,classes=''){return `<section class="studio-page ${classes}"><header class="page-brand">${logo()}<h2><small>2026년 9월 챌린지 대비</small>${escape(title)}</h2></header><div class="page-identity"><span>이름: ${escape(student.name||'________________')}</span><span>유치원: ${escape(student.school||'________________')}</span></div>${content}<footer class="page-folio"></footer></section>`;}
  function chunks(list,size){const result=[];for(let i=0;i<list.length;i+=size)result.push(list.slice(i,i+size));return result;}
  function questionMarkup(entry,index){const q=entry.question;return `<article class="studio-problem" data-entry="${index}"><strong>${index+1}</strong><div class="source-ref">${escape(rowLabel(entry.source))} 유형</div><p class="studio-prompt">${escape(q.prompt)}</p><div class="studio-art">${q.problemHtml||''}</div>${q.problemHtml?`<button class="enlarge-art" type="button" data-enlarge="${index}">그림 확대</button>`:''}<div class="studio-answer-line">답:<span aria-hidden="true"></span></div></article>`;}
  function answerMarkup(entry,index,part=null){const q=entry.question,continued=part?.continued===true,text=part?part.text:(q.solution||'풀이 설명이 준비되지 않았습니다.'),diagram=part?part.diagram:!!q.solutionDiagram;return `<article class="${continued?'studio-answer-continuation':'studio-answer'}" data-answer-entry="${index}"><h3>${index+1}번${continued?' (계속)':` · ${escape(q.answerHtml==null?q.answer:q.answerHtml)}`}</h3>${text?`<p data-solution-text>${escape(text)}</p>`:''}${diagram?`<div class="studio-art">${q.solutionDiagram}</div>`:''}</article>`;}
  function textBoundaries(text,granularity){
    if(typeof Intl.Segmenter==='function'){const segmenter=new Intl.Segmenter('ko',{granularity});return [...segmenter.segment(text)].map(s=>s.index+s.segment.length);}
    const pieces=granularity==='sentence'?(text.match(/[^.!?。！？]+(?:[.!?。！？]+\s*|$)|[.!?。！？]+\s*/gu)||[text]):Array.from(text);let end=0;return pieces.map(s=>(end+=s.length));
  }
  async function splitAnswer(entry,index,measure){
    const probe=document.createElement('div');measure.append(probe);const limit=850,parts=[];
    const height=part=>{probe.innerHTML=answerMarkup(entry,index,part);return Math.ceil(probe.firstElementChild.getBoundingClientRect().height);};
    try{
      if(entry.question.solutionDiagram){height({text:'',diagram:true,continued:true});await waitImages(probe);if(Math.ceil(probe.firstElementChild.getBoundingClientRect().height)>limit)throw new Error(`${index+1}번의 풀이 그림이 한 페이지를 넘습니다. 인쇄 구성을 확인해야 합니다.`);}
      let remaining=String(entry.question.solution||'풀이 설명이 준비되지 않았습니다.');
      while(remaining){
        const continued=parts.length>0,fit=end=>height({text:remaining.slice(0,end),diagram:false,continued})<=limit;
        let boundaries=textBoundaries(remaining,'sentence');
        if(!fit(boundaries[0]))boundaries=textBoundaries(remaining,'grapheme');
        let low=0,high=boundaries.length;
        while(low<high){const mid=Math.ceil((low+high)/2);if(fit(boundaries[mid-1]))low=mid;else high=mid-1;}
        if(!low)throw new Error(`${index+1}번의 답안 제목 또는 글이 한 페이지를 넘습니다. 인쇄 구성을 확인해야 합니다.`);
        const end=boundaries[low-1];parts.push({text:remaining.slice(0,end),diagram:false,continued});remaining=remaining.slice(end);
      }
      if(entry.question.solutionDiagram){const last=parts.at(-1),withDiagram={...last,diagram:true};if(height(withDiagram)<=limit)parts[parts.length-1]=withDiagram;else parts.push({text:'',diagram:true,continued:true});}
      return parts.map(part=>({entry,index,part,size:Math.max(100,height(part))}));
    }finally{probe.remove();}
  }
  function snapshotAllowed(snapshot){return sameIdentity(snapshot.approvedIdentity,verifiedIdentity())&&snapshot.entries.every(entry=>allowed('challenge-bank',entry.source.typeId))&&(localPreview||!!verifiedIdentity());}
  function snapshotPrintAllowed(snapshot){if(!snapshot)return false;if(snapshot.kind==='diagnosis')return allowed(`challenge-mock-${snapshot.round}`)&&sameIdentity(snapshot.approvedIdentity,verifiedIdentity())&&(localPreview||!!verifiedIdentity());return snapshotAllowed(snapshot);}
  function selectionScope(selected){const areas=new Map(selected.map(row=>[row.taxonomy.areaId,row.taxonomy.areaLabel])),types=new Map(selected.map(row=>[typeGroupKey(row),row.taxonomy.typeLabel]));if(types.size===1){const label=[...types.values()][0];return {kind:'type',label:`${label} 유형`,title:`${label} 유형 유사문제 학습지`};}if(areas.size===1){const label=[...areas.values()][0];return {kind:'area',label:`${label} 영역 · ${types.size}개 유형`,title:`${label} 영역 유사문제 학습지`};}return {kind:'mixed',label:`${areas.size}개 영역 · ${types.size}개 유형`,title:'선택 유형 유사문제 학습지'};}
  async function buildPractice(){
    if(state.busy)return;
    const selected=[...selectedSet()].map(id=>rows.get(id)),count=Number($('variantCount').value),difficulty=state.difficulty;
    if(!selected.length||!Number.isInteger(count)||count<1||count>selectionLimit()||selected.length*count>100||selected.some(row=>!canSelect(row)))return message('유형별 사용 상태와 문항 수를 확인하세요.',true);
    if(state.tab==='wrong'&&selected.some(row=>!activeWrong(row)))return message('채점이 바뀐 문항이 있습니다. 오답 선택을 다시 확인하세요.',true);
    const startingIdentity=verifiedIdentity();
    state.busy=true;renderSelection();message('선택한 유형의 문항을 확인하고 있습니다.');await new Promise(resolve=>requestAnimationFrame(resolve));
    try{
      const entries=[],seen=new Set(),seed=Date.now()%2000000000;
      for(const row of selected){
        for(let i=0;i<count;i++){
          let accepted=null;
          for(let retry=0;retry<25;retry++){
            if(!permitted(row)||!sameIdentity(startingIdentity,verifiedIdentity()))throw new Error('유형 이용 상태나 승인 학생이 바뀌었습니다.');
            const result=await variants.generate({round:row.round,section:row.section,number:row.number,difficulty,seed:seed+entries.length*1009+i*103+retry*7919});
            if(result.status!=='verified'||!result.question)throw new Error(`${rowLabel(row)}: ${result.reason||'검증된 유사문제가 준비되지 않았습니다.'}`);
            const signature=JSON.stringify([result.question.prompt,result.question.payload,result.question.problemHtml]);
            if(seen.has(signature))continue;
            if(!result.question.remoteReference){if(result.question.answerHtml==null&&result.question.answer==null)throw new Error(`${rowLabel(row)}: 답안을 확인할 수 없습니다.`);if(!result.question.solution)throw new Error(`${rowLabel(row)}: 인쇄용 풀이를 확인할 수 없습니다.`);}
            seen.add(signature);accepted={question:result.question,source:{...result.source,round:row.round,section:row.section,number:row.number,typeId:row.typeId},occurrenceId:row.occurrenceId};break;
          }
          if(!accepted)throw new Error(`${rowLabel(row)}의 서로 다른 문항이 부족합니다. 문항 수를 줄여 주세요.`);
          entries.push(accepted);
        }
      }
      const scope=selectionScope(selected),snapshot=freeze(copy({kind:'practice',title:state.tab==='wrong'?'오답 유사문제 학습지':scope.title,scope,student:identity(),approvedIdentity:startingIdentity,difficulty,entries,createdAt:new Date().toISOString()}));
      state.snapshot=snapshot;$('printMode').value='questions';await renderWorksheet();message(`${entries.length}문항을 구성했습니다. 보기와 인쇄 범위를 바꿔도 문제는 바뀌지 않습니다.`);if(!$('worksheetPanel').hidden){$('worksheetTitle').focus({preventScroll:true});$('worksheetPanel').scrollIntoView({block:'start'});}
    }catch(error){message(`${error.message} 기존 학습지는 변경하지 않았습니다.`,true);}
    finally{state.busy=false;renderSelection();}
  }
  async function waitImages(container){await Promise.all([...container.querySelectorAll('img')].map(img=>img.complete?(img.naturalWidth?Promise.resolve():Promise.reject(new Error('그림을 불러오지 못했습니다.'))):new Promise((resolve,reject)=>{img.onload=resolve;img.onerror=()=>reject(new Error('그림을 불러오지 못했습니다.'));})));await document.fonts.ready;}
  function setFolios(){let marked=true;[...$('worksheetPages').children].forEach((element,index)=>{const footer=element.querySelector('.page-folio');if(footer)footer.textContent=String(index+1);if(element.classList.contains('blank')){delete element.dataset.watermark;element.querySelector(':scope > .page-watermark')?.remove();}else marked=addPageWatermark(element)&&marked;});return marked&&watermarkReady();}
  async function measuredGroups(entries,answers=false){
    const measure=document.createElement('div');measure.className='studio-measure';measure.setAttribute('aria-hidden','true');measure.inert=true;
    measure.innerHTML=entries.map((entry,index)=>answers?answerMarkup(entry,index):questionMarkup(entry,index)).join('');document.body.append(measure);
    try{
      await waitImages(measure);const heights=[...measure.children].map(node=>Math.ceil(node.getBoundingClientRect().height));const groups=[];let group=[],used=0;
      const items=[];for(let index=0;index<entries.length;index++){const entry=entries[index],size=Math.max(answers?100:410,heights[index]);if(size>850){if(!answers)throw new Error(`${index+1}번의 그림과 글이 한 페이지를 넘습니다. 인쇄 구성을 확인해야 합니다.`);items.push(...await splitAnswer(entry,index,measure));}else items.push({entry,index,size});}
      items.forEach(item=>{const {size}=item;if(group.length&&(group.length===(answers?4:2)||used+16+size>850)){groups.push(group);group=[];used=0;}group.push(item);used+=size+(group.length>1?16:0);});if(group.length)groups.push(group);return groups;
    }finally{measure.remove();}
  }
  async function renderWorksheet(){
    const snapshot=state.snapshot;if(!snapshot)return;const revision=++state.printRevision;
    lockPrint();$('printWorksheet').disabled=true;
    if(snapshot.kind==='diagnosis')return renderDiagnosisPrint(snapshot,revision);
    if(!snapshotAllowed(snapshot)){$('worksheetPages').innerHTML='';$('worksheetPanel').hidden=true;return message('선택 자료의 이용 상태가 바뀌어 학습지를 숨겼습니다.',true);}
    const mode=$('printMode').value,student=snapshot.student;let entries=snapshot.entries;
    if(mode!=='questions'&&variants.answers){try{entries=await Promise.all(entries.map(async entry=>({...entry,question:await variants.answers(entry.question)})));}catch(error){$('worksheetPages').innerHTML='';$('worksheetPanel').hidden=true;return message(error.message,true);}if(revision!==state.printRevision||!snapshotAllowed(snapshot))return;}
    let questionGroups=[],answerGroups=[];
    try{if(mode==='questions'||mode==='both')questionGroups=await measuredGroups(entries);if(mode==='answers'||mode==='both')answerGroups=await measuredGroups(entries,true);}catch(error){$('worksheetPages').innerHTML='';message(error.message,true);return;}
    if(revision!==state.printRevision||!snapshotAllowed(snapshot))return;
    const questions=questionGroups.map(group=>page(snapshot.title,`<div class="page-problems">${group.map(({entry,index})=>questionMarkup(entry,index)).join('')}</div>`,student));
    const answers=answerGroups.map(group=>page('정답과 풀이',group.map(({entry,index,part})=>answerMarkup(entry,index,part)).join(''),student));
    let pages=[];
    if(mode==='questions')pages=questions;
    if(mode==='answers')pages=answers;
    if(mode==='quick')pages=chunks(entries,20).map((group,i)=>page('빠른 정답',`<div class="quick-answer-list">${group.map((entry,j)=>`<p><b>${i*20+j+1}</b><span>${escape(entry.question.answerHtml==null?entry.question.answer:entry.question.answerHtml)}</span></p>`).join('')}</div>`,student));
    if(mode==='both'){
      pages=[...questions];if(pages.length%2)pages.push('<section class="studio-page blank" aria-label="양면 인쇄용 빈 면"></section>');
      pages.push(`<section class="studio-page answer-front">${logo()}<h1>정답과 풀이</h1><p>${escape(snapshot.title)} · ${entries.length}문항</p><p class="answer-front-note">문제를 푼 뒤 확인하세요.</p><footer class="page-folio"></footer></section>`,...answers);
    }
    $('worksheetTitle').textContent=snapshot.title;$('worksheetMeta').textContent=`${snapshot.scope?.label?`${snapshot.scope.label} · `:''}확정 ${entries.length}문항 · ${levelLabels[snapshot.difficulty]} · 현재 화면의 입력을 바꿔도 이 학습지는 유지됩니다.`;
    $('worksheetPages').innerHTML=pages.join('');$('worksheetPanel').hidden=false;document.body.dataset.worksheetOpen='true';$('printMode').disabled=false;setFolios();
    try{await waitImages($('worksheetPages'));if(revision!==state.printRevision||!snapshotAllowed(snapshot))return;if(!setFolios())throw new Error('승인 학생 워터마크를 모든 페이지에 넣지 못했습니다.');document.body.dataset.watermarkReady='true';document.body.dataset.printReady='true';$('printWorksheet').disabled=false;}catch(error){lockPrint();message(error.message+' 인쇄를 중단했습니다.',true);}
  }
  function reportPages(snapshot){
    const {result,round,student}=snapshot;
    const summary=`<h3>${round}회 진단</h3><p class="diagnosis-lead">${result.complete?`${result.score}점 / 100점`:`채점 미완료 · 확보 ${result.earnedPoints}점`} · 기준 60점</p><p class="diagnosis-note">정답 ${result.correctCount} · 오답 ${result.wrongCount} · 미입력 ${result.pendingCount}<br>교사 입력 결과로 만든 로컬 진단지이며 공식 성적표가 아닙니다.</p>`;
    let pages=[page('챌린지 학습 진단',summary+'<h3>대영역</h3>'+groupTable(result.groups.areas)+`<p class="diagnosis-note">${escape(result.scorePlan?.statement||'미입력은 약점으로 판단하지 않습니다.')}</p>`,student,'print-diagnosis-page')];
    for(const [title,groups] of [['소영역',result.groups.subareas],['세부 유형',result.groups.types]])chunks(groups,12).forEach(group=>pages.push(page('챌린지 학습 진단',`<h3>${title}</h3>${groupTable(group)}<p class="diagnosis-note">채점한 문항 수가 적으면 판단 자료 부족으로 표시합니다.</p>`,student,'print-diagnosis-page')));
    chunks(result.recommendations,5).forEach(group=>pages.push(page('다음에 맞혀 볼 문제',recommendationsHtml({...result,recommendations:group}),student,'print-diagnosis-page')));
    return pages;
  }
  async function renderDiagnosisPrint(snapshot,revision){
    if(!allowed(`challenge-mock-${snapshot.round}`)||!sameIdentity(snapshot.approvedIdentity,verifiedIdentity())||(!localPreview&&!verifiedIdentity()))return message('진단 대상 회차의 이용 승인과 학생을 다시 확인해야 합니다.',true);
    $('worksheetTitle').textContent=`${snapshot.round}회 진단지`;$('worksheetMeta').textContent='진단지를 연 시점의 채점 결과입니다.';$('printMode').disabled=true;
    $('worksheetPages').innerHTML=reportPages(snapshot).join('');$('worksheetPanel').hidden=false;document.body.dataset.worksheetOpen='true';setFolios();
    try{await waitImages($('worksheetPages'));if(revision!==state.printRevision||!sameIdentity(snapshot.approvedIdentity,verifiedIdentity()))return;if(!setFolios())throw new Error('승인 학생 워터마크를 모든 페이지에 넣지 못했습니다.');document.body.dataset.watermarkReady='true';document.body.dataset.printReady='true';$('printWorksheet').disabled=false;}catch(error){lockPrint();message(error.message,true);}
  }
  function ready(){
    if(!diagnosis||!variants)throw new Error('진단·유사문제 자료를 불러오지 못했습니다. 새로고침해 주세요.');
    for(let round=1;round<=4;round++){
      const description=diagnosis.describeRound(round);rounds.set(round,description);
      [...description.questions,...description.extra].forEach(row=>rows.set(row.occurrenceId,{...row,round}));
    }
    if(!localPreview&&!window.HFChallengeAccess)throw new Error(localHost?'교사용 로컬 미리보기는 주소에 ?teacherPreview=1을 붙여 여세요.':'교사용 접근 확인이 필요합니다. 이 주소에서는 로컬 미리보기를 사용할 수 없습니다.');
    const initialParams=new URLSearchParams(location.search),initialRound=Number(initialParams.get('round'));if([1,2,3,4].includes(initialRound)){state.round=initialRound;$('studioRound').value=String(initialRound);}const requestedBankRound=initialParams.get('bankRound')||(initialParams.has('round')?String(state.round):'all');if(['all','1','2','3','4'].includes(requestedBankRound))state.bankRound=requestedBankRound;$('bankRoundFilter').value=state.bankRound;updateExamLink();
    document.querySelectorAll('[data-tab]').forEach(button=>button.addEventListener('click',()=>changeTab(button.dataset.tab)));
    document.querySelector('.studio-tabs').addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      const tabs=['grade','wrong','bank'],index=tabs.indexOf(state.tab);event.preventDefault();changeTab(event.key==='Home'?tabs[0]:event.key==='End'?tabs[2]:tabs[(index+(event.key==='ArrowRight'?1:2))%3],true);
    });
    $('studioRound').addEventListener('change',()=>{state.round=Number($('studioRound').value);updateExamLink();state.area='';state.type='';if(state.tab==='grade')renderGrade();else{renderBankFilters();renderBank();}message('');});
    $('gradeRows').addEventListener('change',event=>{
      const input=event.target;if(!input.dataset.grade)return;const row=rows.get(input.dataset.grade);
      state.responses.set(row.occurrenceId,{occurrenceId:row.occurrenceId,fingerprint:row.fingerprint,status:input.value});const removed=syncWrongSelection();renderScore();$('diagnosisPanel').hidden=true;state.report=null;
      if(removed)message(`채점 변경으로 오답이 아닌 ${removed}개 선택을 오답 구성에서 제외했습니다.`);
    });
    $('workspace').addEventListener('click',event=>{
      const preview=event.target.closest('[data-preview]');if(preview)showPreview(preview.dataset.preview);
      const enlarge=event.target.closest('[data-enlarge]');if(enlarge)showGeneratedPreview(Number(enlarge.dataset.enlarge));
      const remove=event.target.closest('[data-remove]');if(remove){selectedSet().delete(remove.dataset.remove);renderBank();}
      if(event.target.id==='practiceWrong'){changeTab('wrong');$('bank-panel').scrollIntoView({block:'start'});}
      if(event.target.id==='printDiagnosis'&&state.report){state.snapshot=freeze(copy({...state.report,kind:'diagnosis'}));renderWorksheet();}
    });
    $('makeDiagnosis').addEventListener('click',showDiagnosis);
    $('studioStudent').addEventListener('change',()=>{
      const name=$('studioStudent').value.trim();if(localPreview&&state.localName&&name!==state.localName){state.responses.clear();state.selected.wrong.clear();state.report=null;$('diagnosisPanel').hidden=true;$('worksheetPanel').hidden=true;lockPrint();renderGrade();message('학생 이름을 바꾸어 이전 채점을 비웠습니다. 학습지 구성본은 이전 이름으로 보존됩니다.');}state.localName=name;
    });
    $('studioSearch').addEventListener('compositionstart',()=>{state.composing=true;});
    $('studioSearch').addEventListener('compositionend',()=>{state.composing=false;state.query=$('studioSearch').value;renderBank();});
    $('studioSearch').addEventListener('input',()=>{if(!state.composing){state.query=$('studioSearch').value;renderBank();}});
    $('studioSearch').addEventListener('keydown',event=>{if(event.key==='Enter'&&(event.isComposing||state.composing))event.preventDefault();});
    $('bankRoundFilter').addEventListener('change',()=>{state.bankRound=$('bankRoundFilter').value;state.area='';state.type='';renderBankFilters();renderBank();});
    $('areaFilter').addEventListener('change',()=>{state.area=$('areaFilter').value;state.type='';renderTypeFilter();renderBank();});
    $('typeFilter').addEventListener('change',()=>{state.type=$('typeFilter').value;renderBank();});
    $('sectionFilter').addEventListener('change',()=>{state.section=$('sectionFilter').value;renderBankFilters();renderBank();});
    $('bankRows').addEventListener('change',event=>{const input=event.target,row=rows.get(input.dataset.select);if(!row)return;if(input.checked&&canSelect(row))selectedSet().add(row.occurrenceId);else selectedSet().delete(row.occurrenceId);renderBank();});
    $('selectArea').addEventListener('click',()=>{if(state.area)sectionRows().filter(row=>row.taxonomy.areaId===state.area&&canSelect(row)).forEach(row=>selectedSet().add(row.occurrenceId));renderBank();});
    $('selectType').addEventListener('click',()=>{if(state.type)sectionRows().filter(row=>typeGroupKey(row)===state.type&&canSelect(row)).forEach(row=>selectedSet().add(row.occurrenceId));renderBank();});
    $('selectVisible').addEventListener('click',()=>{visibleRows().filter(canSelect).forEach(row=>selectedSet().add(row.occurrenceId));renderBank();});
    $('clearVisible').addEventListener('click',()=>{visibleRows().forEach(row=>selectedSet().delete(row.occurrenceId));renderBank();});
    $('clearSelection').addEventListener('click',()=>{selectedSet().clear();renderBank();});
    document.querySelectorAll('[name=difficulty]').forEach(input=>input.addEventListener('change',()=>{state.difficulty=input.value;renderBank();}));
    $('variantCount').addEventListener('input',renderSelection);$('buildPractice').addEventListener('click',buildPractice);
    $('jumpAssembly').addEventListener('click',()=>{$('assemblyPanel').scrollIntoView({block:'start'});$('assemblyPanel').focus({preventScroll:true});});
    $('closePreview').addEventListener('click',()=>$('questionPreview').close());
    $('questionPreview').addEventListener('close',()=>{state.preview=null;$('previewAnswer').innerHTML='';$('previewQuestion').innerHTML='';delete $('previewQuestion').dataset.watermark;delete $('previewAnswer').dataset.watermark;});
    $('togglePreviewZoom').addEventListener('click',()=>{const zoom=$('questionPreview').dataset.zoom!=='true';$('questionPreview').dataset.zoom=String(zoom);$('togglePreviewZoom').textContent=zoom?'전체 그림 보기':'그림 크게 보기';$('togglePreviewZoom').setAttribute('aria-pressed',String(zoom));});
    $('revealPreview').addEventListener('click',async()=>{if(!state.preview)return;const captured=state.preview,{row,access,approvedIdentity}=captured;let question=captured.question;if(!sameIdentity(approvedIdentity,verifiedIdentity())||!(access==='mock'?allowed(`challenge-mock-${row.round}`):permitted(row)))return;try{if(variants.answers)question=await variants.answers(question);}catch(e){return message(e.message,true);}if(state.preview!==captured||!sameIdentity(approvedIdentity,verifiedIdentity()))return;$('previewAnswer').innerHTML=`<h3>정답 ${escape(question.answerHtml==null?question.answer:question.answerHtml)}</h3><p>${escape(question.solution||'풀이 설명 확인 필요')}</p>${question.solutionDiagram?`<div class="studio-art">${question.solutionDiagram}</div>`:''}`;$('previewAnswer').hidden=false;$('revealPreview').hidden=true;});
    $('printMode').addEventListener('change',renderWorksheet);
    $('closeWorksheet').addEventListener('click',()=>{$('worksheetPanel').hidden=true;document.body.dataset.worksheetOpen='false';lockPrint();});
    $('printWorksheet').addEventListener('click',async()=>{
      await renderWorksheet();if(document.body.dataset.printReady!=='true'||document.body.dataset.watermarkReady!=='true')return;
      window.print();
    });
    const fineHover=()=>matchMedia('(hover:hover) and (pointer:fine)').matches;
    $('bankRows').addEventListener('pointerover',event=>{const trigger=event.target.closest('[data-hover-preview]');if(!fineHover()||!trigger||trigger.contains(event.relatedTarget))return;scheduleHoverPreview(trigger);});
    $('bankRows').addEventListener('pointerout',event=>{const trigger=event.target.closest('[data-hover-preview]');if(trigger&&!trigger.contains(event.relatedTarget))hideHoverPreview();});
    $('bankRows').addEventListener('focusin',event=>{const trigger=event.target.closest('[data-hover-preview]');if(trigger&&event.target===trigger)scheduleHoverPreview(trigger);});
    $('bankRows').addEventListener('focusout',event=>{const trigger=event.target.closest('[data-hover-preview]');if(trigger&&!trigger.contains(event.relatedTarget))hideHoverPreview();});
    $('bankRows').addEventListener('keydown',event=>{const trigger=event.target.closest('[data-hover-preview]');if(trigger&&['Enter',' '].includes(event.key)){event.preventDefault();hideHoverPreview();showPreview(trigger.dataset.hoverPreview);}});
    $('bankRows').addEventListener('click',event=>{const trigger=event.target.closest('[data-hover-preview]');if(trigger&&!fineHover()&&!event.target.closest('label,input,button')){hideHoverPreview();showPreview(trigger.dataset.hoverPreview);}});
    window.addEventListener('scroll',hideHoverPreview,{passive:true,capture:true});window.addEventListener('resize',hideHoverPreview,{passive:true});
    window.addEventListener('beforeprint',()=>{if(document.body.dataset.printReady!=='true'||!snapshotPrintAllowed(state.snapshot)||!setFolios()){lockPrint();message('승인 학생 이름의 3줄 워터마크를 확인할 수 없어 인쇄를 중단했습니다.',true);return;}document.body.dataset.watermarkReady='true';});
    window.addEventListener('hfchallengeaccesschange',()=>{
      const approved=verifiedIdentity();if(!sameIdentity(state.approvedIdentity,approved)){state.responses.clear();state.selected.wrong.clear();state.report=null;state.approvedIdentity=approved;}
      state.printRevision++;updateAccessNotice();
      document.body.dataset.worksheetOpen='false';
      hoverCache.clear();hideHoverPreview();if($('questionPreview').open)$('questionPreview').close();$('diagnosisPanel').hidden=true;$('worksheetPages').innerHTML='';$('worksheetPanel').hidden=true;lockPrint();
      renderGrade();if(state.tab!=='grade')renderBank();message('이용 승인 상태가 변경되었습니다. 선택한 자료를 다시 확인하세요.');
    });
    $('refreshAccess').addEventListener('click',async()=>{$('refreshAccess').disabled=true;await window.HFChallengeAccess.refresh();updateAccessNotice();renderGrade();if(state.tab!=='grade')renderBank();$('refreshAccess').disabled=false;});
    state.approvedIdentity=verifiedIdentity();updateAccessNotice();renderGrade();if(['bank','wrong'].includes(initialParams.get('tab')))changeTab(initialParams.get('tab'));
    window.HFChallengeStudio=Object.freeze({getSnapshot:()=>state.snapshot?copy(state.snapshot):null,getResponses:()=>copy(roundResponses()),getSelection:()=>[...selectedSet()],isLocalPreview:localPreview});
  }
  (async()=>{try{if(!window.HFChallengeAccess)throw new Error('이용 승인 확인 기능을 불러오지 못했습니다.');await window.HFChallengeAccess.refresh();ready();}catch(error){message(error.message,true);$('gradeRows').innerHTML='';$('scoreSummary').innerHTML='';$('makeDiagnosis').disabled=true;document.querySelectorAll('[data-tab]').forEach(button=>{button.disabled=true;});}})();
})();
