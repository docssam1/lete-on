(function(){
  'use strict';

  const CFG = () => window.CARS_D_LAYOUTS || { lessons: {} };
  let scheduled = false;

  function norm(s){ return String(s || '').replace(/\s+/g, ' ').trim(); }

  function currentLessonId(){
    const titleEl = document.querySelector('.reading-card .title, .question-study .title');
    const title = norm(titleEl && titleEl.textContent);
    if (!title) return null;
    const rows = Object.entries(window.LESSONS || {});
    const hit = rows.find(([id, lesson]) => lesson && lesson.bookId === 'cars-level-d' && norm(lesson.title) === title);
    return hit ? hit[0] : null;
  }

  function originalPassage(){
    return document.querySelector('#original-passage, .passage.original-passage[id="original-passage"]');
  }

  function applyBasePassage(lessonId, lessonCfg){
    const passage = originalPassage();
    if (!passage || !lessonCfg || !lessonCfg.original) return;
    passage.dataset.carsLesson = lessonId;
    passage.classList.add('cars-d-original', `cars-layout-${lessonCfg.original.layout || 'standard'}`);
    const wrap = passage.closest('.passage-wrap');
    if (wrap) wrap.classList.add('cars-d-wrap');
  }

  function applyPoster(lessonId, lessonCfg){
    if (!lessonCfg.original || lessonCfg.original.layout !== 'poster') return;
    const passage = originalPassage();
    if (!passage || passage.dataset.carsPosterDone === '1') return;
    const paras = [...passage.querySelectorAll('.sentence-paragraph')];
    if (!paras.length) return;

    passage.dataset.carsPosterDone = '1';
    passage.classList.add('cars-poster');
    paras.forEach((p, i) => {
      const txt = norm(p.textContent);
      p.classList.add('cars-poster-line');
      if (i === 0) p.classList.add('cars-poster-kicker');
      else if (/^rules\b/i.test(txt)) p.classList.add('cars-poster-rules-title');
      else if (/^\d+[.)]\s*/.test(txt)) p.classList.add('cars-poster-rule');
      else if (i === paras.length - 1) p.classList.add('cars-poster-callout');
      else if (i <= 2) p.classList.add('cars-poster-headline');
      else p.classList.add('cars-poster-copy');
    });

    if (!passage.querySelector('.cars-poster-art')) {
      const art = document.createElement('div');
      art.className = 'cars-poster-art';
      art.setAttribute('aria-hidden', 'true');
      art.innerHTML = '<div class="cars-magazine"><b>KIDS</b><strong>TODAY</strong><span></span></div><div class="cars-pencil"></div>';
      passage.appendChild(art);
    }
  }

  function questionNo(){
    const badge = document.querySelector('#question-drawer .badge, .question-study .badge');
    const m = norm(badge && badge.textContent).match(/^(\d+)\s*\//);
    return m ? Number(m[1]) : null;
  }

  function visualPayload(lessonId, qNo){
    // Licensed wording stays private. When a private source supplies visual data,
    // the renderer consumes it here without putting textbook text in public Git.
    const privateData = window.CARS_VISUAL_DATA && window.CARS_VISUAL_DATA[lessonId];
    return privateData && privateData.questions ? privateData.questions[qNo] : null;
  }

  function boxText(item){
    if (item == null) return '';
    if (typeof item === 'string') return item;
    return item.text || item.content || '';
  }

  function escapeHtml(s){
    return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  function sequenceHtml(layout, payload){
    const n = layout.boxCount || 3;
    const boxes = (payload && payload.boxes) || Array.from({length:n}, () => '');
    return `<div class="cars-visual cars-sequence ${layout.showStepNumbers ? 'with-steps' : ''}">${Array.from({length:n}, (_,i) => {
      const blank = i === layout.blankIndex;
      const text = blank ? '' : boxText(boxes[i]);
      return `<div class="cars-seq-cell"><div class="cars-visual-box ${blank ? 'is-blank' : ''}">${text ? escapeHtml(text) : ''}</div>${layout.showStepNumbers ? `<small>${i+1}</small>` : ''}</div>${i<n-1?'<div class="cars-arrow" aria-hidden="true">→</div>':''}`;
    }).join('')}</div>`;
  }

  function causeEffectHtml(layout, payload){
    const cause = payload && boxText(payload.cause);
    const effect = payload && boxText(payload.effect);
    return `<div class="cars-visual cars-cause-effect"><div class="cars-ce-col"><b>Cause</b><div class="cars-visual-box ${layout.blankIndex===0?'is-blank':''}">${layout.blankIndex===0?'':escapeHtml(cause||'')}</div></div><div class="cars-arrow" aria-hidden="true">→</div><div class="cars-ce-col"><b>Effect</b><div class="cars-visual-box ${layout.blankIndex===1?'is-blank':''}">${layout.blankIndex===1?'':escapeHtml(effect||'')}</div></div></div>`;
  }

  function branchHtml(layout, payload){
    const children = (payload && payload.children) || Array.from({length:layout.childCount||4}, ()=>'');
    const root = payload && boxText(payload.root);
    return `<div class="cars-visual cars-branch"><div class="cars-branch-root">${escapeHtml(root||'')}</div><div class="cars-branch-stem"></div><div class="cars-branch-row">${children.map((x,i)=>`<div class="cars-branch-child ${i===layout.blankIndex?'is-blank':''}">${i===layout.blankIndex?'':escapeHtml(boxText(x))}</div>`).join('')}</div></div>`;
  }

  function applyQuestionVisual(lessonId, lessonCfg){
    const qNo = questionNo();
    if (!qNo || !lessonCfg.questions || !lessonCfg.questions[qNo]) return;
    const layout = lessonCfg.questions[qNo];
    if (!layout || layout.type === 'standard') return;
    const qcard = document.querySelector('#question-drawer .qcard, .question-study .qcard');
    if (!qcard) return;
    const old = qcard.querySelector('.cars-question-visual');
    if (old && old.dataset.q === String(qNo)) return;
    if (old) old.remove();

    const payload = visualPayload(lessonId, qNo);
    // Do not invent licensed diagram wording. Until private data is supplied, keep
    // the public UI unchanged rather than showing misleading empty boxes.
    if (!payload) return;

    let html = '';
    if (layout.type === 'sequence') html = sequenceHtml(layout, payload);
    else if (layout.type === 'cause-effect') html = causeEffectHtml(layout, payload);
    else if (layout.type === 'branch-map') html = branchHtml(layout, payload);
    if (!html) return;

    const holder = document.createElement('div');
    holder.className = 'cars-question-visual';
    holder.dataset.q = String(qNo);
    holder.innerHTML = html;
    const prompt = qcard.querySelector('.prompt');
    if (prompt) qcard.insertBefore(holder, prompt);
    else qcard.prepend(holder);
  }

  function applyMediaHooks(lessonId, lessonCfg){
    const passage = originalPassage();
    if (!passage || !lessonCfg.original || !Array.isArray(lessonCfg.original.media)) return;
    lessonCfg.original.media.forEach(media => {
      const key = `${lessonId}-${media.type}`;
      if (passage.querySelector(`[data-cars-media="${key}"]`)) return;
      const asset = media.src || `assets/images/cars-level-d/${lessonId}-${media.type}.png`;
      const img = document.createElement('img');
      img.className = `cars-inline-media cars-media-${media.type}`;
      img.dataset.carsMedia = key;
      img.src = asset;
      img.alt = '';
      img.loading = 'lazy';
      img.onerror = () => img.remove();
      passage.appendChild(img);
    });
  }

  function apply(){
    scheduled = false;
    const lessonId = currentLessonId();
    if (!lessonId) return;
    const lessonCfg = CFG().lessons && CFG().lessons[lessonId];
    if (!lessonCfg) return;
    document.documentElement.dataset.carsBook = 'cars-level-d';
    document.documentElement.dataset.carsLesson = lessonId;
    applyBasePassage(lessonId, lessonCfg);
    applyPoster(lessonId, lessonCfg);
    applyMediaHooks(lessonId, lessonCfg);
    applyQuestionVisual(lessonId, lessonCfg);
  }

  function schedule(){
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(apply);
  }

  const observer = new MutationObserver(schedule);
  const root = document.getElementById('app');
  if (root) observer.observe(root, {childList:true, subtree:true});
  window.addEventListener('load', schedule);
  schedule();

  window.CARS_UI = { apply, currentLessonId };
})();
