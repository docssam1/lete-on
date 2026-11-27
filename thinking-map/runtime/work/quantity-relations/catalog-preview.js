(function () {
  'use strict';
  const work = document.querySelector('main'), rows = DATA.lookupCorpus;
  const rowById = new Map([...rows, ...DATA.sourceRecords].map(r => [r.id, r]));
  const baseSource = sourceCard;
  sourceCard = row => baseSource(row).replace('<article class="source-card"', `<article class="source-card" data-source-id="${escape(row.id)}" tabindex="0"`);
  const originalRender = render;
  function addPreviewButtons() {
    for (const card of document.querySelectorAll('.source-card[data-source-id]')) {
      if (card.querySelector('[data-preview-source]')) continue;
      const button = document.createElement('button'); button.className = 'preview-trigger';
      button.dataset.previewSource = card.dataset.sourceId; button.textContent = '문제 미리보기'; button.setAttribute('aria-haspopup', 'dialog'); card.append(button);
    }
  }
  render = function () { originalRender(); addPreviewButtons(); };
  const observer = new MutationObserver(addPreviewButtons);
  observer.observe(document.querySelector('#lookup-results'), {childList:true});
  observer.observe(document.querySelector('#identification'), {childList:true});
  const preview = document.createElement('aside'); preview.id = 'question-preview'; preview.className = 'question-preview no-print';
  preview.setAttribute('role', 'dialog'); preview.setAttribute('aria-label', '문제 미리보기'); preview.hidden = true; document.body.append(preview);
  let timer, activeCard, pinned = false;
  function closePreview() { clearTimeout(timer); preview.hidden = true; pinned = false; activeCard = null; }
  function openPreview(row, typeId, pin = false, requestedInstance = null, requestedOriginalAsset = null) {
    const id = typeId || row?.typeIds?.[0];
    const linked = row && DATA.specimens.find(s => s.sourceItemIds?.includes(row.id));
    const reviewed = DATA.specimens.filter(s => row?.reviewedSpecimenIds?.includes(s.instanceId));
    if(reviewed.length && linked && !reviewed.includes(linked)) reviewed.unshift(linked);
    const requestedReviewed = reviewed.find(s => s.instanceId === requestedInstance);
    const exact = requestedReviewed || linked || reviewed.find(s => s.proposedTypeId === id) || reviewed[0] || DATA.specimens.find(s => s.proposedTypeId === id);
    const specimen = exact || DATA.specimens.find(s => (related[id] || []).includes(s.proposedTypeId));
    const reused = specimen && reviewed.includes(specimen);
    const providerIds = new Set(row?.providerSpecimenIds || []);
    const providerPool = [...(DATA.providerSpecimens || []), ...(DATA.normalizationExamples || [])];
    const providers = providerPool.filter(s => providerIds.has(s.instanceId) || s.instanceId === requestedInstance);
    pinned = pin;
    const originals = row?.originalPreviews?.length ? row.originalPreviews : row?.originalPreview ? [row.originalPreview] : [];
    const query = String(document.querySelector('#lookup-query')?.value || '').trim();
    const locatorText = value => String(value || '').toLowerCase().replace(/\s+/g, '');
    const queryMatches = query ? originals.filter(page => [page.questionNumber, '인쇄 '+page.printedPage+'쪽', 'PDF '+page.pdfPage+'쪽'].some(value => locatorText(value).includes(locatorText(query)))) : [];
    const original = originals.find(x => x.assetId === requestedOriginalAsset) || (queryMatches.length === 1 ? queryMatches[0] : originals[0]);
    preview.innerHTML = `<div class="preview-head"><h2>문제 미리보기</h2><button id="preview-close" aria-label="미리보기 닫기">닫기</button></div>${row ? `<p class="meta">선택한 교재 위치 · ${escape(QuantitySearch.position(row))}</p>` : '<p class="meta">유형의 대표 문제입니다. 원본은 교재 문항을 선택해 확인하세요.</p>'}<div class="preview-switch" role="group" aria-label="문제 종류"><button data-preview-mode="original" aria-pressed="false">원본</button><button data-preview-mode="similar" aria-pressed="false">유사문제</button></div><section id="original-preview-panel" hidden>${original ? `<p class="preview-kind">원본 페이지 · ${escape(original.sourceFileName)} · PDF ${original.pdfPage}쪽</p><p class="meta">${escape(original.questionNumber || "선택한 활동")} · ${escape(original.notice)}</p><p class="meta">원본 페이지 위치와 이미지 해시를 기존 기록과 대조했습니다. 정답 검증 여부와는 별개입니다.</p><img class="original-page-image" alt="${escape(original.book)} ${original.unitNumber==null?'':original.unitNumber+'단원'} ${escape(original.questionNumber)} 문항이 포함된 원본 페이지"><p class="original-load-status" role="status"></p>` : '<p>이 문항의 원본 페이지는 아직 연결하지 않았습니다. 유사문제 탭에서 연결된 생성 문항을 확인할 수 있습니다.</p>'}</section><section id="similar-preview-panel" hidden><p class="preview-kind">${linked ? '선택한 문항에서 변형한 유사문제' : exact ? '같은 유형의 생성 문제' : '관련 유형의 생성 문제'}</p><p class="meta">선택한 교재의 원본이 아닙니다. 문항별 난이도 일치는 별도 확인이 필요합니다.</p>${specimen ? `<div class="preview-problem" data-instance-id="${escape(specimen.instanceId)}"><p>${escape(specimen.problem.prompt)}</p><div class="given-visual">${studentVisualMarkup(specimen) || ''}</div></div><button id="preview-answer">정답·풀이 보기</button><div id="preview-answer-content" hidden><b>정답 ${escape(specimen.problem.answer)}</b><p>${escape(specimen.validation.explanation)}</p>${specimen.solutionVisualMarkup||''}</div>` : '<p>이 유형의 유사문항은 아직 연결하지 않았습니다.</p>'}</section>`;
    preview.hidden = false;
    if (originals.length > 1) {
      const label = document.createElement('label'); label.className = 'original-page-select';
      label.append(document.createTextNode('원본 쪽 선택 '));
      const select = document.createElement('select'); select.id = 'original-page-select';
      for (const page of originals) {
        const option = document.createElement('option'); option.value = page.assetId;
        option.textContent = `인쇄 ${page.printedPage}쪽 · PDF ${page.pdfPage}쪽${page.questionNumber ? ' · '+page.questionNumber : ''}`;
        option.selected = page.assetId === original.assetId; select.append(option);
      }
      select.onchange = () => { openPreview(row, id, pin, requestedInstance, select.value); preview.querySelector('[data-preview-mode="original"]').click(); };
      label.append(select); preview.querySelector('#original-preview-panel').prepend(label);
    }
    if(row?.sourceBoundReview){
      const notice=document.createElement('div');notice.className='source-contract-notice meta';
      const title=document.createElement('strong');title.textContent='원문과 비교한 조건 · '+row.sourceBoundReview.label;notice.append(title,document.createElement('br'),document.createTextNode(row.sourceBoundReview.providerNotice));
      preview.querySelector('.preview-switch').after(notice);
    }
    const similar=preview.querySelector('#similar-preview-panel');
    if(reused){
      similar.querySelector('.preview-kind').textContent='기존 분석에서 검산한 유형 예시';
      similar.querySelector('.meta').textContent='기존 문제·정답·풀이를 재사용했습니다. 선택한 교재의 원본과 조건·응답·난도가 같다는 뜻은 아닙니다.';
      if(row?.sourceBoundReview){similar.querySelector('.preview-kind').textContent='원문 조건을 대조한 검산 예시';similar.querySelector('.meta').textContent='이 위치의 고정 조각·조각 묶음 또는 넓이 규칙을 보존한 유사문제입니다. 회전·수치·발판에 따른 난도 차이는 별도 확인합니다.';}
      const band=studentDifficultyBand(specimen),notice=document.createElement('p');notice.className='difficulty';notice.textContent=band==null?'난도 확인 중':'이 예시의 난도 후보 '+band+' · 교사 확인 전';similar.querySelector('.preview-problem').before(notice);
      if(reviewed.length>1){
        const label=document.createElement('label');label.textContent='검산한 예시 ';const select=document.createElement('select');select.id='reviewed-preview-select';
        for(const s of reviewed){const option=document.createElement('option');option.value=s.instanceId;option.textContent=s.name+' · '+(reviewed.indexOf(s)+1);select.append(option);}select.value=specimen.instanceId;
        select.onchange=()=>{openPreview(row,id,pinned,select.value);preview.querySelector('[data-preview-mode="similar"]').click();};label.append(select);notice.after(label);
      }
    }
    if(specimen){
      const actions=document.createElement('div');actions.className='provider-actions';
      const add=document.createElement('button');add.id='similar-add';add.textContent=selected.has(specimen.instanceId)?'문제지에서 빼기':'문제지에 담기';add.onclick=()=>{if(selected.has(specimen.instanceId))selected.delete(specimen.instanceId);else selected.add(specimen.instanceId);render();add.textContent=selected.has(specimen.instanceId)?'문제지에서 빼기':'문제지에 담기';};
      const basket=document.createElement('button');basket.id='similar-view-basket';basket.textContent='담은 문제 보기';basket.onclick=()=>{closePreview();document.querySelector('#basket').scrollIntoView({block:'start'});};actions.append(add,basket);similar.append(actions);
    }
    if (providers.length) {
      preview.querySelector('.preview-switch').insertAdjacentHTML('beforeend','<button data-preview-mode="provider" aria-pressed="false">필즈 더 클래식 문제은행 유사문제</button>');
      const panel=document.createElement('section');panel.id='provider-preview-panel';panel.hidden=true;preview.append(panel);
      function drawProvider(instanceId=providers[0].instanceId) {
        const s=providers.find(s=>s.instanceId===instanceId) || providers[0];
        panel.innerHTML=`<p class="preview-kind">${s.responseScopeChanged?'기존 은행의 그림 조건을 정리한 파생 예시':s.origin==='derived-response-projection'?'기존 분석에서 구할 것을 나눈 예시':'기존 필즈 더 클래식 문제은행에서 만든 유형 예시'}</p><p class="meta">선택한 교재의 원본이 아닙니다. 원문과 조건·응답이 같은지는 별도 확인합니다.</p>${s.normalization?`<p class="difficulty">이 예시의 난도 후보 ${s.commonBandCandidate} · 교사 확인 전</p><p class="meta">먼저 필요한 능력 · ${escape(s.normalization.minimumCapabilities.join(' · '))}</p>`:'<p class="meta">통합 난도는 아직 정하지 않았습니다.</p>'}${s.presentationRepairs?.length?`<details><summary>통합 예시의 표현 보완</summary><ul>${s.presentationRepairs.map(text=>`<li>${escape(text)}</li>`).join('')}</ul></details>`:''}${providers.length>1?`<label>은행 유형 <select id="provider-preview-select">${providers.map(p=>`<option value="${escape(p.instanceId)}" ${s.instanceId===p.instanceId?'selected':''}>${escape(p.normalizedDisplayName||p.name)}</option>`).join('')}</select></label>`:`<p class="meta">${escape(s.normalizedDisplayName||s.name)}</p>`}<div class="preview-problem" data-provider-instance="${escape(s.instanceId)}"><p>${s.promptMarkup||escape(s.problem.prompt)}</p><div class="given-visual">${s.visualMarkup||''}</div></div><div class="provider-actions"><button id="provider-answer">정답·풀이 보기</button><button id="provider-add">${selected.has(s.instanceId)?'문제지에서 빼기':'문제지에 담기'}</button></div><div id="provider-answer-content" hidden><p class="meta">${s.validation.independentAnswerCheck?'이 대표 문항의 답을 별도로 확인했습니다.':'기존 은행의 정답·풀이입니다. 이 통합 화면에서의 별도 검산은 아직 하지 않았습니다.'}</p><b>정답 ${s.answerMarkup||escape(s.problem.answer)}</b><p>${s.explanationMarkup||escape(s.validation.explanation)}</p>${s.solutionVisualMarkup||''}</div>`;
        if(s.sourceConditionConflict||s.sourceResponseConflict||s.sourcePresentationConflict){const notice=document.createElement('p');notice.className='source-condition-correction';notice.textContent=s.integratedNotice||'기존 은행 예시의 도형 조건이 성립하지 않아, 이 유사문제의 수와 그림을 고쳤습니다. 선택한 교재의 원문을 정정한 것은 아닙니다.';panel.querySelector('.preview-problem').before(notice);}
        panel.querySelector('#provider-preview-select')?.addEventListener('change',event=>drawProvider(event.target.value));
        if(row?.sourceBoundReview&&!row.sourceBoundReview.providerDefaultMatchesSourceBranch){panel.querySelector('.preview-kind').textContent='원문과 조건이 다른 은행 기본 예시';panel.querySelector('.meta').textContent=row.sourceBoundReview.providerNotice+' 유사문제 탭에서 원문 조건에 맞춘 검산 예시를 확인하세요.';}
        const answer=panel.querySelector('#provider-answer');answer.onclick=()=>{const body=panel.querySelector('#provider-answer-content');body.hidden=!body.hidden;answer.textContent=body.hidden?'정답·풀이 보기':'정답·풀이 숨기기';};
        const add=panel.querySelector('#provider-add');add.onclick=()=>{if(selected.has(s.instanceId))selected.delete(s.instanceId);else selected.add(s.instanceId);render();add.textContent=selected.has(s.instanceId)?'문제지에서 빼기':'문제지에 담기';};
        const basket=document.createElement('button');basket.id='provider-view-basket';basket.textContent='담은 문제 보기';basket.onclick=()=>{closePreview();document.querySelector('#basket').scrollIntoView({block:'start'});};panel.querySelector('.provider-actions').append(basket);
      }
      drawProvider(requestedInstance || providers[0].instanceId);
    }
    function setPreviewMode(mode) {
      preview.querySelector('#original-preview-panel').hidden = mode !== 'original';
      preview.querySelector('#similar-preview-panel').hidden = mode !== 'similar';
      if (preview.querySelector('#provider-preview-panel')) preview.querySelector('#provider-preview-panel').hidden = mode !== 'provider';
      for (const button of preview.querySelectorAll('[data-preview-mode]')) button.setAttribute('aria-pressed', String(button.dataset.previewMode === mode));
      const image = preview.querySelector('.original-page-image');
      if (mode === 'original' && image && !image.getAttribute('src')) {
        const status = preview.querySelector('.original-load-status');
        if (!/^https?:$/.test(location.protocol)) { status.textContent = '원본 페이지는 전용 로컬 실행 화면에서 열어 주세요.'; return; }
        status.textContent = '원본 페이지를 불러오는 중입니다.';
        image.onload = () => { status.textContent = ''; };
        image.onerror = () => { status.textContent = '원본 페이지를 열지 못했습니다. Drive 연결과 로컬 실행 상태를 확인해 주세요.'; image.hidden = true; };
        image.src = `/api/original/${original.assetId}`;
      }
    }
    for (const button of preview.querySelectorAll('[data-preview-mode]')) button.onclick = () => setPreviewMode(button.dataset.previewMode);
    setPreviewMode(requestedReviewed ? 'similar' : original ? 'original' : reviewed.length ? 'similar' : providers.length && !linked ? 'provider' : 'similar');
    document.querySelector('#preview-close').onclick = closePreview;
    const answer = document.querySelector('#preview-answer');
    if (answer) answer.onclick = () => { const body = document.querySelector('#preview-answer-content'); body.hidden = !body.hidden; answer.textContent = body.hidden ? '정답·풀이 보기' : '정답·풀이 숨기기'; };
    if (pin) document.querySelector('#preview-close').focus({preventScroll:true});
  }
  document.addEventListener('mouseover', event => {
    const card = event.target.closest('.source-card[data-source-id], [data-node], [data-family-node]');
    if (!card || card === activeCard || pinned || card.contains(event.relatedTarget)) return;
    clearTimeout(timer); activeCard = card;
    timer = setTimeout(() => openPreview(rowById.get(card.dataset.sourceId), card.dataset.node || card.dataset.familyNode), 300);
  });
  document.addEventListener('mouseout', event => {
    if (!activeCard || pinned || !activeCard.contains(event.target) || activeCard.contains(event.relatedTarget) || preview.contains(event.relatedTarget)) return;
    activeCard = null; clearTimeout(timer); timer = setTimeout(() => { if (!preview.matches(':hover')) closePreview(); }, 220);
  });
  preview.addEventListener('mouseenter', () => clearTimeout(timer));
  preview.addEventListener('mouseleave', () => { if (!pinned) closePreview(); });
  document.addEventListener('focusin', event => {
    if (event.target.matches('.source-card[data-source-id]')) openPreview(rowById.get(event.target.dataset.sourceId));
  });
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-preview-source]');
    if (button) {
      const row=rowById.get(button.dataset.previewSource);openPreview(row, null, true, button.dataset.reviewedInstance || button.dataset.providerInstance);
      if(button.dataset.providerInstance){
        preview.querySelector('[data-preview-mode="provider"]')?.click();
        const select=preview.querySelector('#provider-preview-select');
        if(select){select.value=button.dataset.providerInstance;select.dispatchEvent(new Event('change'));}
      }
    }
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') closePreview(); });

  function bookInfo(book) {
    let match;
    if ((match = book.match(/^1031 (Pre|입문|초급|중급)\s*([A-D])$/))) return {series:'1031',stage:match[1],volume:match[2]+'권',book};
    if ((match = book.match(/^필즈 더클래식 (\d+과정) (\d+권)$/))) return {series:'필즈 더클래식',stage:match[1],volume:match[2],book};
    if ((match = book.match(/^필즈 더클래식 (2과정) ([AG][1-5])$/))) return {series:'필즈 더클래식',stage:match[1],volume:match[2],book};
    if ((match = book.match(/^소마 프리미어 (초급|중급|고급) (\d+)$/))) return {series:'소마',stage:'프리미어 '+match[1],volume:match[2]+'권',book};
    if ((match = book.match(/^RAY (B[12])-1$/))) return {series:'소마',stage:'RAY',volume:match[1]+'-1',book};
    if ((match = book.match(/^필즈 (킨더|베이직|입문|초급|중급|실력)\s*(.*)$/))) return {series:'필즈',stage:match[1],volume:match[2]||'본문',book};
    if ((match = book.match(/^3% 올림피아드 (\d+과정)$/))) return {series:'3% 올림피아드',stage:match[1],volume:'본문·단원 자료',book};
    if ((match = book.match(/^초등팩토\s*원리\s*([123])([ABC])(?:\s+(\d{4}))?$/))) return {series:'팩토',stage:'초등 '+match[1],volume:'원리 '+match[2]+(match[3]?' '+match[3]:''),book};
    return {series:book,stage:'연결 자료',volume:'본문',book};
  }
  const scope = TEXTBOOK_SCOPE, seriesLabel = name => scope.seriesLabels[name] || name;
  const stageName = name => scope.somaStageAliases[name] || name;
  const inventory = [...new Set(rows.map(r => r.book))].map(bookInfo);
  const catalogEntries = (DATA.catalogInventory?.entries || []).filter(r=>scope.series.includes(r.series)&&r.title!=='소마 프리미어 라이즈');
  const sourceInventory = DATA.catalogSourceInventory;
  const sourceFiles = sourceInventory?.files || [];
  const sourceBooks = sourceInventory?.bookCandidates || [];
  const roleNames = {'body-candidate-role-unconfirmed':'본문 후보 · 역할 확인 필요','teacher-material':'교사용 자료 후보','excluded-mission-test':'미션·시험 · 신규 분석 제외','answer-material':'답안·해설 후보','cover-material':'표지 후보','toc-roadmap':'목차·로드맵'};
  const navBooks = inventory.slice();
  function register(series, stage, volumes, prefix, entryTitle) {
    for (const volume of volumes) {
      const book = prefix(volume);
      const existing = navBooks.find(r => r.book === book);
      if (existing) existing.entryTitle = entryTitle;
      else {
        const normalize = value => String(value).toLocaleLowerCase().replace(/\b20\d{2}\b/g,'').replace(/[\s_-]+/g,'');
        const alias = navBooks.find(r => r.series===series && r.stage===stage && normalize(r.volume)===normalize(volume));
        if (alias) alias.entryTitle = entryTitle;
        else navBooks.push({series,stage,volume,book,entryTitle});
      }
    }
  }
  for (const level of ['Pre','입문','초급','중급']) register('1031',level,['A권','B권','C권','D권'],v=>'1031 '+level+' '+v[0],'1031 '+level);
  register('필즈 더클래식','1과정',Array.from({length:10},(_,i)=>(i+1)+'권'),v=>'필즈 더클래식 1과정 '+v,'필즈 더클래식 1과정');
  for (const [level,n] of [['2과정',5],['3과정',4]]) register('필즈 더클래식',level,['A','G'].flatMap(c=>Array.from({length:n},(_,i)=>c+(i+1))),v=>'필즈 더클래식 '+level+' '+v,'필즈 더클래식 '+level);
  register('필즈 더클래식','4과정',['권별 범위 확인 중'],()=> '필즈 더클래식 4과정','필즈 더클래식 4과정');
  for (const [level,volumes] of [['킨더',['상','중','하']],['베이직',['상','중','하']],['입문',['상','중','하']],['초급',['상','하']],['중급',['상','하']],['실력',['권별 범위 확인 중']]]) register('필즈',level,volumes,v=>'필즈 '+level+' '+v,'필즈 '+level);
  for (const level of ['프리미어 초급','프리미어 중급']) register('소마',level,Array.from({length:8},(_,i)=>(i+1)+'권'),v=>'소마 '+level+' '+parseInt(v),'소마 '+level);
  for (const level of ['프리미어 라이즈','Ray Kids','Prism']) register('소마',level,['권별 범위 확인 중'],()=> '소마 '+level,level.startsWith('프리미어')?'소마 '+level:'뉴소마·Ray Kids·RAY·Prism');
  register('소마','프리미어 고급',['AL1','GE1'],v=>'소마 프리미어 고급 '+v,'소마 프리미어 고급');
  register('소마','뉴소마',['A','B','C','D','E','F'],v=>'뉴소마 '+v,'뉴소마·Ray Kids·RAY·Prism');
  register('소마','RAY',['B1-1','B2-1'],v=>'RAY '+v,'RAY B1·B2');
  register('팩토','키즈',['권별 범위 확인 중'],()=> '팩토 키즈','팩토 키즈');
  register('팩토','킨더',['A','B','C','D'],v=>'팩토 킨더 '+v,'팩토 킨더·초등팩토 2·3');
  for (const level of [1,2,3]) register('팩토','초등 '+level,(level===3?['탐구']:['원리','탐구']).flatMap(c=>['A','B','C'].map(v=>c+' '+v)),v=>'초등팩토 '+level+' '+v,level===1?'초등팩토 1':'팩토 킨더·초등팩토 2·3');
  register('GM·GIFTED MATH','문제 해결력 GM 초급',['A','B','C','D'],v=>'문제 해결력 GM 초급 1단계 '+v,'문제 해결력 GM 초급');
  register('GM·GIFTED MATH','GIFTED MATH 3',['V1-1','V1-2','V1-3'],v=>'GIFTED MATH 3 '+v,'GIFTED MATH 3');
  register('Thinking Core','Thinking Core',['CH1','CH2','CH3','CH4','CH5'],v=>'Thinking Core '+v,'Thinking Core');
  for (const level of ['1과정','2과정','3과정','4과정']) register('3% 올림피아드',level,['본문·단원 자료'],()=> '3% 올림피아드 '+level,level==='3과정'||level==='4과정'?'3% 올림피아드 3·4과정':'3% 올림피아드 '+level);
  for (const candidate of sourceBooks) {
    const entryTitle = candidate.stage.startsWith('프리미어') ? '소마 '+candidate.stage : candidate.stage==='RAY'&&['B1-1','B2-1'].includes(candidate.volume) ? 'RAY B1·B2' : '뉴소마·Ray Kids·RAY·Prism';
    register('소마',candidate.stage,[candidate.volume],()=>candidate.book,entryTitle);
  }
  for (let i=navBooks.length-1;i>=0;i--) if (navBooks[i].volume==='권별 범위 확인 중'&&sourceBooks.some(b=>b.stage===navBooks[i].stage&&b.series===navBooks[i].series)) navBooks.splice(i,1);
  for (const entry of catalogEntries) if (!navBooks.some(r=>r.entryTitle===entry.title)) register(entry.series,entry.title,['확인한 범위 보기'],()=>entry.title,entry.title);
  if (DATA.textbookItemPolicy) for(let i=navBooks.length-1;i>=0;i--) {
    const candidate=sourceBooks.find(b=>b.book===navBooks[i].book);
    if(navBooks[i].series==='교과·연산'||candidate?.hasBodyCandidate===false)navBooks.splice(i,1);
  }
  // Restrict the active work menu; historical records and immutable book keys stay intact.
  for(let i=navBooks.length-1;i>=0;i--){
    const b=navBooks[i];
    if(!scope.series.includes(b.series)){navBooks.splice(i,1);continue;}
    if(b.series==='소마'){
      const oldStage=b.stage;b.stage=stageName(oldStage);
      if(!scope.somaStages.includes(b.stage)){navBooks.splice(i,1);continue;}
      if(oldStage==='Ray Kids')b.volume='Ray Kids '+b.volume;
      if(oldStage==='RAY 플러스북')b.volume='플러스북 '+b.volume;
    }
  }
  const home = document.createElement('main'); home.id = 'catalog-home'; home.className = 'catalog-home no-print'; document.body.prepend(home);
  const statusPanel = document.createElement('section'); statusPanel.id = 'book-research-status'; statusPanel.className = 'book-research-status no-print'; statusPanel.hidden = true; work.prepend(statusPanel);
  const nav = document.createElement('nav'); nav.className = 'book-navigation no-print'; nav.innerHTML = '<button id="back-to-books">교재 목록</button><strong id="selected-book-title"></strong><button id="open-input-search">문제로 유형 찾기</button>'; work.prepend(nav);
  let series = '', stage = '';
  function fileTable(files) {
    return `<div class="catalog-table-scroll"><table><thead><tr><th>파일명·기록 위치</th><th>자료 구분</th><th>기존 근거</th></tr></thead><tbody>${files.map(f=>`<tr data-source-file="${escape(f.id)}"><th>${escape(f.fileName)}<small class="inventory-file-path">${escape(f.sourceRootLabel||'기존 보존 자료')} / ${escape(f.relativePath)}</small></th><td>${escape(roleNames[f.role]||f.role)}<small class="inventory-file-path">${escape(f.format)} · ${(f.bytes/1024/1024).toFixed(1)}MB · 판본 대조 전</small></td><td>${f.existingPathReferences?'이전 경로 참조 있음 · 분석 범위는 별도 확인':'당시 경로 참조 미연결 · 미분석 확정 아님'}</td></tr>`).join('')}</tbody></table></div>`;
  }
  function inventoryMarkup() {
    if (DATA.textbookItemPolicy) return '';
    if (!sourceInventory) return '';
    return `<details class="catalog-status-list catalog-source-files"><summary>원본 파일 장부 · ${sourceFiles.length.toLocaleString()}개 경로</summary><p>${escape(sourceInventory.inventoryDate)} 장부의 파일명·폴더 기록입니다. 권수·본문 검토 완료 수와 다릅니다. 같은 이름의 다른 판은 각각 보존했습니다.</p><div class="source-file-controls"><label>자료 구분 <select id="source-file-role"><option value="">전체 자료</option>${Object.entries(roleNames).map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label><label>파일·권 코드 <input id="source-file-query" type="search" placeholder="Ray B3-2, Prism, GE3"></label></div><p class="source-file-count" role="status"></p><div class="source-file-results"></div><button id="source-files-more" hidden>더 보기</button></details>`;
  }
  function bindInventory() {
    const container=home.querySelector('.catalog-source-files');if(!container)return;
    let limit=40;
    const searchKey=value=>value.toLocaleLowerCase().replace(/[\s_-]+/g,'');
    function update() {
      const role=home.querySelector('#source-file-role').value;
      const query=searchKey(home.querySelector('#source-file-query').value.trim());
      const files=sourceFiles.filter(f=>(!series||f.series===series)&&(!role||f.role===role)&&(!query||searchKey(f.fileName+' '+f.relativePath+' '+(f.bookCandidateId||'')).includes(query)));
      container.querySelector('.source-file-count').textContent=`${files.length.toLocaleString()}개 경로 중 ${Math.min(limit,files.length)}개 표시 · 본문 신규 분석 0`;
      container.querySelector('.source-file-results').innerHTML=files.length?fileTable(files.slice(0,limit)):'<p>이 조건에 맞는 파일 기록이 없습니다. 다른 권 코드나 파일명으로 찾아보세요.</p>';
      home.querySelector('#source-files-more').hidden=files.length<=limit;
    }
    home.querySelector('#source-file-role').onchange=()=>{limit=40;update();};
    home.querySelector('#source-file-query').oninput=()=>{limit=40;update();};
    home.querySelector('#source-files-more').onclick=()=>{limit+=40;update();};update();
  }
  function showHome() { closePreview(); work.hidden = true; home.hidden = false; document.body.classList.add('catalog-open'); drawHome(); window.scrollTo(0,0); }
  function card(label, sub, action, letter = '') {
    const art = !series ? CATALOG_ARTWORK[{'1031':'foldy','소마':'orbi','필즈 더클래식':'cubi','필즈 더 클래식':'cubi'}[label]] : null;
    const symbol = {'3% 올림피아드':'3%','필즈':'F','팩토':'F','GM·GIFTED MATH':'GM','Thinking Core':'TC','CMS·시매쓰':'CMS','교과·연산':'+ ×','프리미어 초급':'PF','프리미어 중급':'PS','프리미어 고급':'AL·GE','프리미어 라이즈':'R','뉴소마':'SOMA','Ray Kids':'KIDS','Prism':'PRISM'}[label] || letter || label;
    return `<button class="catalog-card" data-catalog-action="${escape(action)}"><small>${escape(sub)}</small><strong>${escape(label)}</strong><span class="catalog-cover" aria-hidden="true">${art ? `<img src="${art}" alt="">` : escape(symbol.length>5?'···':symbol)}</span><span class="catalog-enter">선택하기</span></button>`;
  }
  function drawHome() {
    home.dataset.depth = stage ? 'volume' : series ? 'stage' : 'series';
    let cards;
    const filtered = navBooks.filter(r => !series || r.series === series).filter(r => !stage || r.stage === stage);
    if (!series) cards = scope.series.filter(name=>navBooks.some(r=>r.series===name)).map(name => card(seriesLabel(name), '교재와 문제 보기', name));
    else if (!stage) cards = (series==='소마'?scope.somaStages:[...new Set(filtered.map(r => r.stage))]).map(name => card(name, seriesLabel(series), name));
    else cards = filtered.sort((a,b)=>a.volume.localeCompare(b.volume,'ko',{numeric:true})).map(r => card(r.volume, sourceBooks.some(b=>b.book===r.book)?r.book+' · 파일 장부 기준':r.book, r.book, r.volume.replace('권','')));
    const scopeEntries = catalogEntries.filter(r=>!series||r.series===series);
  home.innerHTML = `<header class="catalog-mast"><a class="catalog-brand" id="catalog-brand" href="#"><i>GF</i><span>통합 사고력 문제은행</span></a><button id="catalog-search">문제로 유형 찾기</button></header><nav class="catalog-path"><button id="catalog-root">전체 교재</button>${series ? '<span>›</span><button id="catalog-series">'+escape(seriesLabel(series))+'</button>' : ''}${stage ? '<span>›</span><span>'+escape(stage)+'</span>' : ''}</nav><section class="catalog-stage"><div class="catalog-heading"><p>${stage ? '권을 선택하세요' : series ? '단계를 선택하세요' : '교재를 선택하세요'}</p><h1>${escape(stage ? seriesLabel(series)+' '+stage : seriesLabel(series) || '생각을 잇는 수학')}</h1></div><div class="catalog-giant" aria-hidden="true">${stage ? escape(stage) : series ? escape(seriesLabel(series)) : 'THINKING MATH'}</div><section class="catalog-grid">${cards.join('')}</section>${series==='소마'?'<p class="catalog-footnote">소마 사고력 학원 교재: 레이 · 프리즘 · 프리미어 초급·중급·고급. 레이의 기존 Ray Kids·플러스북 표기는 권 선택에서 구별합니다.</p>':''}</section><details class="catalog-status-list" ${series?'open':''}><summary>전체 작업 현황 · ${scopeEntries.length}개 교재·단계 묶음</summary><p>기존 분석과 미검토 범위를 함께 표시합니다. 아래 항목 수는 권수나 전체 문항 수가 아닙니다.</p><div class="catalog-table-scroll"><table><thead><tr><th>교재</th><th>확인한 범위</th><th>현재 작업</th><th>남은 작업</th></tr></thead><tbody>${scopeEntries.map(r=>`<tr><th>${escape(r.title)}</th><td>${escape(r.scope)}</td><td>${escape(r.current)}</td><td>${escape(r.remaining)}</td></tr>`).join('')}</tbody></table></div></details><p class="catalog-footnote">1031 · 소마 · 3% 올림피아드 · 필즈 더 클래식 · 필즈 · 팩토를 다룹니다. 필즈와 필즈 더 클래식은 서로 다른 교재입니다.</p>`;
    document.querySelector('#catalog-brand').onclick = event => { event.preventDefault(); series='';stage='';drawHome(); };
    home.querySelector('.catalog-status-list').insertAdjacentHTML('afterend',inventoryMarkup());bindInventory();
    document.querySelector('#catalog-root').onclick = () => { series = ''; stage = ''; drawHome(); };
    if (series) document.querySelector('#catalog-series').onclick = () => { stage = ''; drawHome(); };
    document.querySelector('#catalog-search').onclick = openSearch;
    for (const button of home.querySelectorAll('[data-catalog-action]')) button.onclick = () => { const value = button.dataset.catalogAction; if (!series) { series=value; drawHome(); } else if (!stage) { stage=value; drawHome(); } else openBook(value); };
  }
  function showWork(title) { home.hidden = true; work.hidden = false; work.classList.remove('book-unlinked', 'bank-position-only'); document.body.classList.remove('catalog-open'); document.querySelector('#selected-book-title').textContent = title; }
  function openSearch() { closePreview(); showWork('문제로 유형 찾기'); statusPanel.hidden = true; document.querySelector('.lookup-panel').hidden = false; document.querySelector('.input-panel').hidden = false; document.querySelector('.input-panel').scrollIntoView({block:'start'}); document.querySelector('#problem-text').focus({preventScroll:true}); }
  function openBook(book) {
    closePreview(); showWork(book); document.querySelector('.input-panel').hidden = true;
    const registered = navBooks.find(r=>r.book===book);
    const entry = catalogEntries.find(r=>r.title===registered?.entryTitle);
    const available = rows.filter(r=>r.book===book);
    // Do not show the previously selected book's map/questions for a new native-only position list.
    if (available.length && available.every(r=>r.giftedSourceBridge)) work.classList.add('bank-position-only');
    const sourceCandidate=sourceBooks.find(r=>r.book===book);
    const bookFiles=sourceCandidate?sourceFiles.filter(f=>sourceCandidate.fileIds.includes(f.id)&&(!DATA.textbookItemPolicy||(f.format==='.pdf'&&f.role==='body-candidate-role-unconfirmed'))):[];
    statusPanel.hidden = false;
    statusPanel.innerHTML = `<h2>${escape(book)}</h2>${entry?`<dl><dt>확인한 범위</dt><dd>${escape(entry.scope)}</dd><dt>기존 작업</dt><dd>${escape(entry.current)}</dd><dt>남은 작업</dt><dd>${escape(entry.remaining)}</dd></dl>`:''}<p>${available.length?`현재 검색에 연결된 위치·대표 분석 ${available.length}건 · 원본 미리보기 ${available.filter(r=>r.originalPreview).length}건`:'이 권은 현재 문항 검색에 연결하지 않았습니다. 위의 기존 작업과 남은 범위를 확인해 주세요.'}</p>`;
    const nativeExamples=new Set(available.flatMap(r=>r.providerSpecimenIds||[]));
    if(nativeExamples.size)statusPanel.insertAdjacentHTML('beforeend',`<p>기존 필즈 더 클래식 문제은행 유형 예시 ${nativeExamples.size}개를 연결했습니다. 문제 미리보기에서 원본과 구별해 보고 문제지에 담을 수 있습니다.</p>`);
    if(sourceCandidate)statusPanel.insertAdjacentHTML('beforeend',`<div class="book-source-status"><h3>이 권 코드로 기록된 자료</h3><p>${escape(sourceCandidate.bodyReviewStatus)} · ${sourceCandidate.observedPathCount}개 파일 경로</p><p>파일명으로 묶은 후보입니다. 판본 동일성·전권 본문 분석을 확정한 표시가 아닙니다.</p>${fileTable(bookFiles)}</div>`);
    const lookup = document.querySelector('.lookup-panel'); lookup.open = true;
    if (!available.length) { lookup.hidden = true; work.classList.add('book-unlinked'); statusPanel.scrollIntoView({block:'start'}); return; }
    lookup.hidden = false;
    document.querySelector('#lookup-book').value = book; document.querySelector('#lookup-query').value = ''; document.querySelector('#lookup-book').dispatchEvent(new Event('change'));
    lookup.scrollIntoView({block:'start'});
  }
  document.querySelector('#back-to-books').onclick = showHome;
  document.querySelector('#open-input-search').onclick = openSearch;
  render(); addPreviewButtons();
  if (new URLSearchParams(location.search).get('view') === 'research' || location.protocol === 'file:') { home.hidden = true; showWork('통합 연구 화면'); } else showHome();
  window.ThinkingCatalog = {showHome,openBook,openSearch,closePreview,inventory:navBooks};
}());
