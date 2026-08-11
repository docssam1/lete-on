(function(){
  'use strict';

  // Level D carries a full layout map (passage shape, media, diagrams). Level B
  // and C only need diagram shapes, so those live in a smaller shared map. Lesson
  // ids never repeat across books, so one lookup covers both.
  const CFG = () => window.CARS_D_LAYOUTS || { lessons: {} };
  const EXTRA_CFG = () => window.CARS_VISUAL_LAYOUTS || { lessons: {} };
  function lessonCfgFor(lessonId){
    return (CFG().lessons || {})[lessonId] || (EXTRA_CFG().lessons || {})[lessonId] || null;
  }
  let scheduled = false;

  function norm(s){ return String(s || '').replace(/\s+/g, ' ').trim(); }
  function esc(s){ return String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function currentLessonId(){
    const titleEl = document.querySelector('.reading-card .title, .question-study .title');
    const title = norm(titleEl && titleEl.textContent);
    if (!title) return null;
    const rows = Object.entries(window.LESSONS || {});
    // Titles can repeat across books, so a match only counts when that lesson id
    // actually has a layout, and the layout agrees about which book it belongs to.
    const hit = rows.find(([id, lesson]) => {
      if (!lesson || norm(lesson.title) !== title) return false;
      const cfg = lessonCfgFor(id);
      return !!cfg && (!cfg.bookId || cfg.bookId === lesson.bookId);
    });
    if (hit) return hit[0];
    // A lesson old enough to predate window.LESSONS declares its title on the
    // layout entry instead, so its diagram still finds its way onto the card.
    const legacy = Object.entries(EXTRA_CFG().lessons || {})
      .find(([, cfg]) => cfg.title && norm(cfg.title) === title);
    return legacy ? legacy[0] : null;
  }

  function sourceMeta(lessonId){
    return (window.CARS_SOURCE_META && window.CARS_SOURCE_META[lessonId]) || {};
  }

  function originalPassage(){
    return document.querySelector('#original-passage, .passage.original-passage[id="original-passage"]');
  }

  function clearBookState(){
    delete document.documentElement.dataset.carsBook;
    delete document.documentElement.dataset.carsLesson;
  }

  function ensureSourceHead(lessonId, lessonCfg, meta){
    const passage = originalPassage();
    if (!passage) return;
    const wrap = passage.closest('.passage-wrap');
    if (!wrap) return;
    let head = wrap.querySelector('.cars-source-head');
    if (!head) {
      head = document.createElement('div');
      head.className = 'cars-source-head';
      const story = passage.closest('.story') || passage.parentElement;
      wrap.insertBefore(head, story);
    }

    const sourceTitle = norm(meta.title || (lessonCfg.original && lessonCfg.original.sourceTitle));
    const instruction = norm(meta.instruction || '');
    head.innerHTML = [
      lessonCfg.sourceLabel ? `<div class="cars-source-label">${esc(lessonCfg.sourceLabel)}</div>` : '',
      instruction ? `<div class="cars-source-instruction">${esc(instruction)}</div>` : '',
      sourceTitle ? `<h2 class="cars-source-title">${esc(sourceTitle)}</h2>` : ''
    ].join('');
  }

  function applySpecialParagraphRoles(lessonCfg, meta){
    const passage = originalPassage();
    if (!passage || !lessonCfg.original) return;
    const paras = [...passage.querySelectorAll(':scope > .sentence-paragraph')];
    const heading = norm(meta.specialHeading || lessonCfg.original.specialHeading || '');
    if (heading) {
      paras.forEach(p => {
        if (norm(p.textContent).toLowerCase() === heading.toLowerCase()) p.classList.add('cars-special-heading');
      });
    }

    const journalCount = Number(meta.journalParagraphsFromEnd || lessonCfg.original.journalParagraphsFromEnd || 0);
    if (journalCount > 0 && !passage.querySelector('.cars-journal-inset')) {
      const candidates = [...passage.querySelectorAll(':scope > .sentence-paragraph')];
      const picked = candidates.slice(Math.max(0, candidates.length - journalCount));
      if (picked.length) {
        const journal = document.createElement('div');
        journal.className = 'cars-journal-inset';
        picked[0].parentNode.insertBefore(journal, picked[0]);
        picked.forEach(p => journal.appendChild(p));
      }
    }
  }

  // Optional exact two-column split. OCR text remains the actual HTML; only its
  // containers move. If private meta has no split point, CSS columns remain the fallback.
  function applyExactColumns(lessonCfg, meta){
    const passage = originalPassage();
    if (!passage || !lessonCfg.original || lessonCfg.original.columns !== 2) return;
    if (passage.querySelector(':scope > .cars-column-grid')) return;
    const breakAfter = Number(meta.columnBreakAfterParagraph);
    if (!Number.isInteger(breakAfter) || breakAfter < 0) return;
    const paras = [...passage.querySelectorAll(':scope > .sentence-paragraph')];
    if (paras.length < 2 || breakAfter >= paras.length - 1) return;

    const grid = document.createElement('div');
    grid.className = 'cars-column-grid';
    const left = document.createElement('div');
    const right = document.createElement('div');
    left.className = 'cars-column cars-column-left';
    right.className = 'cars-column cars-column-right';
    grid.append(left, right);
    paras[0].parentNode.insertBefore(grid, paras[0]);
    paras.forEach((p, i) => (i <= breakAfter ? left : right).appendChild(p));
    passage.classList.add('cars-exact-columns');
  }

  function applyBasePassage(lessonId, lessonCfg, meta){
    const passage = originalPassage();
    if (!passage || !lessonCfg || !lessonCfg.original) return;
    passage.dataset.carsLesson = lessonId;
    passage.classList.add('cars-d-original', `cars-layout-${lessonCfg.original.layout || 'standard'}`);
    if (lessonCfg.original.columns === 2) passage.classList.add('cars-two-column');

    const wrap = passage.closest('.passage-wrap');
    if (wrap) wrap.classList.add('cars-d-wrap');
    const story = passage.closest('.story');
    if (story) story.classList.add('cars-d-story');

    // Source-specific art replaces the generic lesson thumbnail. Scanned textbook
    // pages are never displayed as the exercise UI.
    const defaultArt = story && story.querySelector(':scope > .art-stack');
    if (defaultArt) defaultArt.classList.add('cars-default-art-hidden');

    ensureSourceHead(lessonId, lessonCfg, meta);
    applySpecialParagraphRoles(lessonCfg, meta);
    applyExactColumns(lessonCfg, meta);
  }

  function applyPoster(lessonCfg){
    if (!lessonCfg.original || lessonCfg.original.layout !== 'poster') return;
    const passage = originalPassage();
    if (!passage) return;
    passage.classList.add('cars-poster');
    const paras = [...passage.querySelectorAll('.sentence-paragraph')];
    if (!paras.length) return;

    let rulesTitle = null;
    paras.forEach((p, i) => {
      const txt = norm(p.textContent);
      p.classList.add('cars-poster-line');
      p.classList.remove('cars-poster-kicker','cars-poster-headline','cars-poster-rules-title','cars-poster-rule','cars-poster-callout','cars-poster-copy');
      if (/^hey\s*,?\s*kids/i.test(txt)) p.classList.add('cars-poster-kicker');
      else if (/^rules\b/i.test(txt)) { p.classList.add('cars-poster-rules-title'); rulesTitle = p; }
      else if (/^\d+[.)]\s*/.test(txt)) p.classList.add('cars-poster-rule');
      else if (/time\s+is\s+running\s+out/i.test(txt) || i === paras.length - 1) p.classList.add('cars-poster-callout');
      else if (i <= 2) p.classList.add('cars-poster-headline');
      else p.classList.add('cars-poster-copy');
    });

    if (!passage.querySelector('.cars-poster-art')) {
      const art = document.createElement('div');
      art.className = 'cars-poster-art';
      art.setAttribute('aria-hidden', 'true');
      art.innerHTML = '<div class="cars-magazine"><b>KIDS</b><strong>TODAY</strong><span class="cars-magazine-lines"></span></div><div class="cars-pencil"></div>';
      if (rulesTitle) rulesTitle.insertAdjacentElement('afterend', art);
      else passage.appendChild(art);
    }
  }

  function questionNo(){
    const badge = document.querySelector('#question-drawer .badge, .question-study .badge');
    const m = norm(badge && badge.textContent).match(/^(\d+)\s*\//);
    return m ? Number(m[1]) : null;
  }

  function visualPayload(lessonId, qNo, meta){
    const byMeta = meta && (meta.visualQuestions || meta.questions);
    if (byMeta && byMeta[qNo]) return byMeta[qNo];
    const privateData = window.CARS_VISUAL_DATA && window.CARS_VISUAL_DATA[lessonId];
    return privateData && privateData.questions ? privateData.questions[qNo] : null;
  }

  function boxText(item){
    if (item == null) return '';
    if (typeof item === 'string') return item;
    return item.text || item.content || '';
  }

  function sequenceHtml(layout, payload){
    const n = layout.boxCount || 3;
    const boxes = (payload && payload.boxes) || Array.from({length:n}, () => '');
    return `<div class="cars-visual cars-sequence ${layout.showStepNumbers ? 'with-steps' : ''}">${Array.from({length:n}, (_,i) => {
      const blank = i === layout.blankIndex;
      const text = blank ? '' : boxText(boxes[i]);
      return `<div class="cars-seq-cell"><div class="cars-visual-box ${blank ? 'is-blank' : ''}">${text ? esc(text) : ''}</div>${layout.showStepNumbers ? `<small>${i+1}</small>` : ''}</div>${i<n-1?'<div class="cars-arrow" aria-hidden="true">→</div>':''}`;
    }).join('')}</div>`;
  }

  function causeEffectHtml(layout, payload){
    const cause = payload && boxText(payload.cause);
    const effect = payload && boxText(payload.effect);
    return `<div class="cars-visual cars-cause-effect"><div class="cars-ce-col"><b>${esc((payload&&payload.causeLabel)||'Cause')}</b><div class="cars-visual-box ${layout.blankIndex===0?'is-blank':''}">${layout.blankIndex===0?'':esc(cause||'')}</div></div><div class="cars-arrow" aria-hidden="true">→</div><div class="cars-ce-col"><b>${esc((payload&&payload.effectLabel)||'Effect')}</b><div class="cars-visual-box ${layout.blankIndex===1?'is-blank':''}">${layout.blankIndex===1?'':esc(effect||'')}</div></div></div>`;
  }

  function branchHtml(layout, payload){
    const children = (payload && payload.children) || Array.from({length:layout.childCount||4}, ()=>'');
    const root = payload && boxText(payload.root);
    return `<div class="cars-visual cars-branch"><div class="cars-branch-root">${esc(root||'')}</div><div class="cars-branch-lines" aria-hidden="true"></div><div class="cars-branch-row">${children.map((x,i)=>`<div class="cars-branch-child ${i===layout.blankIndex?'is-blank':''}">${i===layout.blankIndex?'':esc(boxText(x))}</div>`).join('')}</div></div>`;
  }

  function applyQuestionVisual(lessonId, lessonCfg, meta){
    const qNo = questionNo();
    if (!qNo || !lessonCfg.questions || !lessonCfg.questions[qNo]) return;
    const layout = lessonCfg.questions[qNo];
    if (!layout || layout.type === 'standard') return;
    const qcard = document.querySelector('#question-drawer .qcard, .question-study .qcard');
    if (!qcard) return;
    const old = qcard.querySelector('.cars-question-visual');
    if (old && old.dataset.q === String(qNo)) return;
    if (old) old.remove();

    const payload = visualPayload(lessonId, qNo, meta);
    // The scan is a visual reference only. OCR/private source text is inserted as
    // real HTML in the reconstructed boxes, so answer circles/red marks never carry over.
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
    if (prompt && (payload.before || payload.after)) {
      prompt.innerHTML = `${payload.before ? `<span class="cars-visual-intro">${esc(payload.before)}</span>` : ''}${payload.after ? `<span class="cars-visual-followup">${esc(payload.after)}</span>` : ''}`;
      if (payload.before && payload.after) {
        const follow = prompt.querySelector('.cars-visual-followup');
        if (follow) prompt.insertBefore(holder, follow);
        else prompt.appendChild(holder);
      } else if (payload.before) prompt.appendChild(holder);
      else prompt.insertBefore(holder, prompt.firstChild);
    } else if (prompt) {
      qcard.insertBefore(holder, prompt);
    } else {
      qcard.prepend(holder);
    }
  }

  function mediaAsset(lessonId, media){
    return media.src || `assets/images/cars-level-d/${lessonId}-${media.type}.png`;
  }

  function timelineNode(media){
    if (!Array.isArray(media.items) || !media.items.length) return null;
    const fig = document.createElement('figure');
    fig.className = 'cars-html-timeline';
    fig.setAttribute('aria-label', media.ariaLabel || 'Timeline');
    const track = document.createElement('div');
    track.className = 'cars-timeline-track';
    media.items.forEach((item, i) => {
      const stop = document.createElement('div');
      stop.className = `cars-timeline-stop ${item.side === 'bottom' ? 'is-bottom' : 'is-top'}`;
      stop.innerHTML = `<div class="cars-timeline-text">${esc(item.text || '')}</div><div class="cars-timeline-year">${esc(item.year || '')}</div><span class="cars-timeline-tick" aria-hidden="true"></span>`;
      stop.style.setProperty('--cars-stop-index', String(i));
      track.appendChild(stop);
    });
    fig.appendChild(track);
    return fig;
  }

  function insertMediaNode(passage, node, media){
    const paras = [...passage.querySelectorAll(':scope > .sentence-paragraph')];
    const journal = passage.querySelector('.cars-journal-inset');
    const exactRight = passage.querySelector('.cars-column-right');
    const placement = media.placement || 'bottom';

    if (placement === 'column-right-top' && exactRight) {
      node.classList.add('cars-column-figure');
      exactRight.prepend(node);
      return;
    }

    if (placement === 'column-right-top') {
      // Fallback when exact private column split metadata has not been supplied yet.
      node.classList.add('cars-float-right','cars-column-figure-fallback');
      passage.prepend(node);
      return;
    }

    if (placement === 'float-right-top' || placement === 'float-left-top' || placement === 'float-right' || placement === 'float-right-middle') {
      const anchorIndex = Number.isInteger(media.afterParagraph) ? media.afterParagraph : 0;
      const anchor = paras[Math.max(0, Math.min(anchorIndex, paras.length - 1))];
      node.classList.add(placement === 'float-left-top' ? 'cars-float-left' : 'cars-float-right');
      if (placement === 'float-right-middle') node.classList.add('cars-media-middle');
      if (anchor) anchor.parentNode.insertBefore(node, anchor);
      else passage.prepend(node);
      return;
    }

    if (placement === 'float-right-bottom') {
      node.classList.add('cars-float-right','cars-media-low');
      const anchor = paras[Math.max(0, paras.length - 2)];
      if (anchor) anchor.parentNode.insertBefore(node, anchor);
      else passage.appendChild(node);
      return;
    }

    if (placement === 'after-paragraph') {
      const index = Number.isInteger(media.afterParagraph) ? media.afterParagraph : paras.length - 1;
      const anchor = paras[Math.max(0, Math.min(index, paras.length - 1))];
      if (anchor) anchor.insertAdjacentElement('afterend', node);
      else passage.appendChild(node);
      return;
    }

    if (placement === 'journal-bottom-right' && journal) {
      node.classList.add('cars-journal-art');
      journal.appendChild(node);
      return;
    }

    passage.appendChild(node);
  }

  function applyMediaHooks(lessonId, lessonCfg, meta){
    const passage = originalPassage();
    if (!passage || !lessonCfg.original) return;
    const publicMedia = Array.isArray(lessonCfg.original.media) ? lessonCfg.original.media : [];
    const privateMedia = Array.isArray(meta.media) ? meta.media : [];
    const byType = new Map();
    publicMedia.concat(privateMedia).forEach(m => { if (m && m.type) byType.set(m.type, {...(byType.get(m.type)||{}), ...m}); });

    byType.forEach(media => {
      const key = `${lessonId}-${media.type}`;
      if (passage.querySelector(`[data-cars-media="${key}"]`)) return;

      let figure = null;
      if (media.render === 'html-timeline') figure = timelineNode(media);

      if (!figure) {
        figure = document.createElement('figure');
        figure.className = `cars-inline-media cars-media-${media.type} cars-media-${media.width||'auto'}`;
        const img = document.createElement('img');
        img.src = mediaAsset(lessonId, media);
        img.alt = media.alt || '';
        img.loading = 'lazy';
        img.onerror = () => figure.remove();
        figure.appendChild(img);
        if (media.caption) {
          const cap = document.createElement('figcaption');
          cap.textContent = media.caption;
          figure.appendChild(cap);
        }
      }

      figure.dataset.carsMedia = key;
      if (media.essential) figure.dataset.essential = 'true';
      insertMediaNode(passage, figure, media);
    });
  }

  function apply(){
    scheduled = false;
    const lessonId = currentLessonId();
    if (!lessonId) { clearBookState(); return; }
    const lessonCfg = lessonCfgFor(lessonId);
    if (!lessonCfg) { clearBookState(); return; }
    const meta = sourceMeta(lessonId);

    // Level D styling keys off data-cars-book, so a B/C lesson must not claim to
    // be one. The passage/poster/media steps all no-op without lessonCfg.original,
    // which B and C never set — they only bring diagrams.
    document.documentElement.dataset.carsBook =
      lessonCfg.bookId || (window.LESSONS && window.LESSONS[lessonId] && window.LESSONS[lessonId].bookId) || 'cars-level-d';
    document.documentElement.dataset.carsLesson = lessonId;
    applyBasePassage(lessonId, lessonCfg, meta);
    applyPoster(lessonCfg);
    applyMediaHooks(lessonId, lessonCfg, meta);
    applyQuestionVisual(lessonId, lessonCfg, meta);
  }

  function schedule(){
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(apply);
  }

  const root = document.getElementById('app');
  if (root) new MutationObserver(schedule).observe(root, {childList:true, subtree:true});
  window.addEventListener('cars-source-meta', schedule);
  window.addEventListener('load', schedule);
  schedule();

  window.CARS_UI = { apply, currentLessonId, sourceMeta };
})();
