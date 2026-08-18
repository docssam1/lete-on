(() => {
  'use strict';

  const AUDIO_BASE = 'https://fgahqumaldheqettmvqg.supabase.co/storage/v1/object/public/audio/sophie-stories';
  const WV_AI_URL = 'https://fgahqumaldheqettmvqg.supabase.co/functions/v1/writing-feedback';
  const WV_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs';
  const state = {
    stories: [], current: 0, timings: [], activeSegment: -1, timingMode: 'exact',
    studioBusy: false, studioError: '', studioDeepLinkPending: false, studioLang: 'en'
  };

  const els = {
    tabs: document.getElementById('story-tabs'),
    title: document.getElementById('story-title'),
    byline: document.getElementById('byline'),
    copy: document.getElementById('story-copy'),
    illustrationNumber: document.getElementById('illustration-number'),
    illustration: document.getElementById('story-illustration'),
    illustrationPlaceholder: document.getElementById('illustration-placeholder'),
    pageNumber: document.getElementById('page-number'),
    audio: document.getElementById('audio'),
    play: document.getElementById('play-button'),
    restart: document.getElementById('restart-button'),
    progress: document.getElementById('progress'),
    currentTime: document.getElementById('current-time'),
    duration: document.getElementById('duration'),
    status: document.getElementById('player-status'),
    speed: document.getElementById('speed'),
    studio: document.getElementById('author-studio'),
    studioContent: document.getElementById('studio-content'),
    studioEyebrow: document.getElementById('studio-eyebrow'),
    studioTitle: document.getElementById('studio-title'),
    studioIntro: document.getElementById('studio-intro')
  };

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const STUDIO_TEXT = {
    en: {
      eyebrow: "AUTHOR'S NEXT PAGE", title: 'A note for the author', intro: 'Read one short note, choose one branch, and keep the story growing.',
      worked: 'What worked beautifully', try: 'One thing to try next', nextQuestion: 'What would you like to write next?',
      noWrong: 'Choose one branch. There is no wrong answer.', chapter: 'My Next Chapter', placeholder: 'Start your next chapter here…',
      hear: 'Hear the prompt', save: 'Save my next chapter', feedback: 'Get one Rainbow Pen note', received: 'Rainbow Pen note received', busy: 'Rainbow Pen is reading…',
      saved: 'Saved on this device.', draft: 'Draft kept on this device.', short: 'Write one more sentence before saving.',
      feedbackFirst: 'Write and save a short next chapter first.', daily: "Today's Rainbow Pen notes are all used. Your chapter is still saved.",
      setup: "Rainbow Pen needs the teacher's API setup. Your chapter is still saved.", unavailable: 'Rainbow Pen could not open just now. Your chapter is still saved.', rainbow: 'Rainbow Pen note', challenge: 'Next little challenge:',
      polished: 'See a polished example'
    },
    ko: {
      eyebrow: '다음 이야기 쓰기', title: '작가에게 보내는 코멘트', intro: '짧은 코멘트를 읽고, 가지 하나를 골라 이야기를 이어 써 보세요.',
      worked: '특히 잘한 점', try: '다음에 한 가지 시도해 보기', nextQuestion: '다음에는 어떤 이야기를 써 볼래요?',
      noWrong: '가지 하나를 골라 보세요. 틀린 답은 없어요.', chapter: '나의 다음 챕터', placeholder: '다음 이야기를 여기에서 시작해 보세요…',
      hear: '질문 듣기', save: '다음 챕터 저장하기', feedback: '무지개 펜 코멘트 한 번 받기', received: '무지개 펜 코멘트를 받았어요', busy: '무지개 펜이 읽고 있어요…',
      saved: '이 기기에 저장했어요.', draft: '작성 중인 글을 이 기기에 보관했어요.', short: '한 문장을 조금 더 쓴 뒤 저장해 보세요.',
      feedbackFirst: '짧은 다음 챕터를 쓰고 저장한 뒤 눌러 주세요.', daily: '오늘 받을 수 있는 무지개 펜 코멘트를 모두 사용했어요. 글은 저장되어 있어요.',
      setup: '관리자가 무지개 펜 API를 설정하면 사용할 수 있어요. 글은 안전하게 저장되어 있어요.', unavailable: '지금은 무지개 펜을 열 수 없어요. 글은 안전하게 저장되어 있어요.', rainbow: '무지개 펜 코멘트', challenge: '다음 작은 도전:',
      polished: '다듬은 문장 예시 보기'
    }
  };

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
    const whole = Math.floor(seconds);
    return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
  };

  function storySegments(story) {
    const segments = [];
    if (story.title) segments.push({ type: 'title', text: story.title });
    story.paragraphs.forEach((paragraph, paragraphIndex) => {
      paragraph.forEach((text, sentenceIndex) => segments.push({ type: 'sentence', paragraphIndex, sentenceIndex, text }));
    });
    return segments;
  }

  function renderTabs() {
    els.tabs.innerHTML = state.stories.map((story, index) => `
      <button class="story-tab" type="button" role="tab" aria-selected="${index === state.current}" data-index="${index}">
        ${escapeHtml(story.tabLabel)}
      </button>
    `).join('');
  }

  function studioKey(storyId) {
    return `sophie-next-chapter-v1:${storyId}`;
  }

  function readStudioDraft(storyId) {
    try {
      return JSON.parse(localStorage.getItem(studioKey(storyId)) || '{}');
    } catch (_) {
      return {};
    }
  }

  function saveStudioDraft(storyId, draft) {
    try { localStorage.setItem(studioKey(storyId), JSON.stringify(draft)); } catch (_) {}
  }

  function browserStudentId() {
    const key = 'sophie-reader-id-v1';
    try {
      let id = localStorage.getItem(key);
      if (!id) {
        id = `reader-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
        localStorage.setItem(key, id);
      }
      return id;
    } catch (_) {
      return `reader-${Date.now()}`;
    }
  }

  function renderRainbowFeedback(ai, text) {
    if (!ai) return '';
    const praise = Array.isArray(ai.praise) ? ai.praise : [];
    const fixes = Array.isArray(ai.fixes) ? ai.fixes : [];
    return `<div class="rainbow-feedback" id="rainbow-feedback">
      <h4>${escapeHtml(text.rainbow)}</h4>
      ${praise.length ? `<div class="rainbow-praise">${praise.slice(0, 2).map((item) => `<span>★ ${escapeHtml(item)}</span>`).join('')}</div>` : ''}
      ${fixes.slice(0, 1).map((fix) => `<div class="rainbow-fix"><span>${escapeHtml(fix.orig || '')}</span> → <b>${escapeHtml(fix.better || '')}</b>${fix.why ? `<small>${escapeHtml(fix.why)}</small>` : ''}</div>`).join('')}
      ${ai.challenge ? `<p class="rainbow-challenge">${escapeHtml(text.challenge)} ${escapeHtml(ai.challenge)}</p>` : ''}
      ${ai.corrected ? `<details class="rainbow-corrected"><summary>${escapeHtml(text.polished)}</summary><p>${escapeHtml(ai.corrected)}</p></details>` : ''}
    </div>`;
  }

  function renderStudio() {
    const story = state.stories[state.current];
    const studio = story?.authorStudio;
    if (!studio) {
      els.studio.hidden = true;
      return;
    }
    els.studio.hidden = false;
    const lang = state.studioLang === 'ko' ? 'ko' : 'en';
    const text = STUDIO_TEXT[lang];
    const localValue = (object, key) => lang === 'ko' && object?.[`${key}Ko`] ? object[`${key}Ko`] : object?.[key];
    els.studioEyebrow.textContent = text.eyebrow;
    els.studioTitle.textContent = text.title;
    els.studioIntro.textContent = text.intro;
    const draft = readStudioDraft(story.id);
    const choices = Array.isArray(studio.choices) ? studio.choices : [];
    const selected = choices.find((choice) => choice.id === draft.choiceId);
    const status = state.studioError ? text[state.studioError] : (draft.savedAt ? text.saved : '');

    els.studioContent.innerHTML = `<div class="studio-language" role="group" aria-label="Comment language">
      <button type="button" data-studio-lang="en" aria-pressed="${lang === 'en'}">EN</button>
      <button type="button" data-studio-lang="ko" aria-pressed="${lang === 'ko'}">한글</button>
    </div><div class="studio-grid">
      <article class="studio-card">
        <h3>${escapeHtml(text.worked)}</h3>
        <ul class="praise-list">${(localValue(studio, 'praise') || []).slice(0, 2).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
      </article>
      <article class="studio-card try-card">
        <h3>${escapeHtml(text.try)}</h3>
        <p>${escapeHtml(localValue(studio, 'tryNext') || '')}</p>
      </article>
      <article class="studio-card branch-card">
        <h3>${escapeHtml(text.nextQuestion)}</h3>
        <p class="branch-intro">${escapeHtml(text.noWrong)}</p>
        <div class="branch-choices">${choices.map((choice) => `<button class="branch-choice ${choice.id === draft.choiceId ? 'is-selected' : ''}" type="button" data-studio-choice="${escapeHtml(choice.id)}">${escapeHtml(localValue(choice, 'label'))}</button>`).join('')}</div>
      </article>
      <article class="next-page" id="next-page" ${selected ? '' : 'hidden'}>
        <h3>${escapeHtml(text.chapter)}</h3>
        <p class="next-prompt">${escapeHtml(localValue(selected, 'prompt') || '')}</p>
        <textarea id="next-chapter-text" maxlength="1800" placeholder="${escapeHtml(text.placeholder)}">${escapeHtml(draft.text || '')}</textarea>
        <div class="studio-actions">
          <button class="studio-button" type="button" data-studio-action="hear">${escapeHtml(text.hear)}</button>
          <button class="studio-button primary" type="button" data-studio-action="save">${escapeHtml(text.save)}</button>
          <button class="studio-button violet" type="button" data-studio-action="feedback" ${state.studioBusy || draft.ai ? 'disabled' : ''}>${escapeHtml(state.studioBusy ? text.busy : (draft.ai ? text.received : text.feedback))}</button>
        </div>
        <p class="studio-status" id="studio-status" aria-live="polite">${escapeHtml(status)}</p>
        ${renderRainbowFeedback(draft.ai, text)}
      </article>
    </div>`;
  }

  function renderStory() {
    const story = state.stories[state.current];
    const segments = storySegments(story);
    let segmentIndex = story.title ? 1 : 0;

    els.byline.textContent = story.byline ? `Written by ${story.byline}` : '';
    els.title.textContent = story.title || '';
    if (story.title) els.title.dataset.segment = '0';
    else els.title.removeAttribute('data-segment');

    els.copy.innerHTML = story.paragraphs.map((paragraph) => {
      const sentenceHtml = paragraph.map((sentence) => {
        const index = segmentIndex++;
        return `<span class="sentence" data-segment="${index}">${escapeHtml(sentence)}</span>`;
      }).join(' ');
      return `<p>${sentenceHtml}</p>`;
    }).join('');

    els.illustrationNumber.textContent = String(state.current + 1).padStart(2, '0');
    if (story.illustration?.src) {
      els.illustration.alt = story.illustration.alt || '';
      els.illustration.src = story.illustration.src;
      els.illustration.hidden = false;
      els.illustrationPlaceholder.hidden = true;
    } else {
      els.illustration.removeAttribute('src');
      els.illustration.alt = '';
      els.illustration.hidden = true;
      els.illustrationPlaceholder.hidden = false;
    }
    els.pageNumber.textContent = `${state.current + 1} / ${state.stories.length}`;
    renderTabs();
    state.studioBusy = false;
    state.studioError = '';
    renderStudio();
    resetPlayerUi();
    loadAudio(story, segments);
  }

  async function loadAudio(story, segments) {
    const version = Date.now();
    els.audio.src = `${AUDIO_BASE}/${story.id}.mp3?v=${version}`;
    els.audio.load();
    state.timings = [];
    state.timingMode = 'exact';
    els.status.textContent = 'Loading narration…';

    try {
      const response = await fetch(`${AUDIO_BASE}/${story.id}.timings.json?v=${version}`, { cache: 'no-store' });
      if (!response.ok) throw new Error(`Timing file ${response.status}`);
      const timingData = await response.json();
      if (!Array.isArray(timingData.segments) || timingData.segments.length !== segments.length) {
        throw new Error('Timing data does not match the story text');
      }
      state.timings = timingData.segments;
      els.status.textContent = 'Ready to read';
    } catch (error) {
      state.timingMode = 'estimated';
      state.timings = buildEstimatedTimings(segments);
      els.status.textContent = 'Ready to read';
      console.warn('Using estimated sentence timing until the generated timing file is available.', error);
    }
  }

  function buildEstimatedTimings(segments) {
    const totalWeight = segments.reduce((sum, segment) => sum + Math.max(1, segment.text.length), 0);
    let cursor = 0;
    return segments.map((segment) => {
      const startRatio = cursor / totalWeight;
      cursor += Math.max(1, segment.text.length);
      return { startRatio, endRatio: cursor / totalWeight };
    });
  }

  function currentTimingIndex(currentTime) {
    if (!state.timings.length) return -1;
    if (state.timingMode === 'estimated') {
      const duration = els.audio.duration;
      if (!Number.isFinite(duration) || duration <= 0) return -1;
      const ratio = currentTime / duration;
      return state.timings.findIndex((timing) => ratio >= timing.startRatio && ratio < timing.endRatio);
    }
    return state.timings.findIndex((timing, index) => {
      const nextStart = state.timings[index + 1]?.start;
      const end = Number.isFinite(timing.end) ? timing.end : (Number.isFinite(nextStart) ? nextStart : els.audio.duration);
      return currentTime >= timing.start && currentTime < end;
    });
  }

  function setActiveSegment(index) {
    if (index === state.activeSegment) return;
    state.activeSegment = index;
    document.querySelectorAll('[data-segment]').forEach((node) => {
      node.classList.toggle('is-reading', Number(node.dataset.segment) === index);
    });
    const active = document.querySelector(`[data-segment="${index}"]`);
    if (active && !isMostlyVisible(active)) active.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function isMostlyVisible(element) {
    const rect = element.getBoundingClientRect();
    return rect.top >= 90 && rect.bottom <= window.innerHeight - 110;
  }

  function resetPlayerUi() {
    els.audio.pause();
    els.audio.removeAttribute('src');
    els.play.classList.remove('is-playing');
    els.play.setAttribute('aria-label', 'Play story');
    els.progress.value = '0';
    els.currentTime.textContent = '0:00';
    els.duration.textContent = '0:00';
    els.status.textContent = 'Loading narration…';
    setActiveSegment(-1);
  }

  function togglePlay() {
    if (!els.audio.src) return;
    if (els.audio.paused) {
      els.audio.play().catch(() => { els.status.textContent = 'Tap play to start'; });
    } else {
      els.audio.pause();
    }
  }

  els.tabs.addEventListener('click', (event) => {
    const button = event.target.closest('[data-index]');
    if (!button) return;
    const next = Number(button.dataset.index);
    if (!Number.isInteger(next) || next === state.current) return;
    state.current = next;
    history.replaceState(null, '', `#${state.stories[next].id}`);
    renderStory();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  els.studioContent.addEventListener('input', (event) => {
    if (event.target.id !== 'next-chapter-text') return;
    const story = state.stories[state.current];
    const draft = readStudioDraft(story.id);
    draft.text = event.target.value;
    draft.savedAt = null;
    draft.ai = null;
    saveStudioDraft(story.id, draft);
    const status = document.getElementById('studio-status');
    if (status) status.textContent = STUDIO_TEXT[state.studioLang].draft;
  });

  els.studioContent.addEventListener('click', async (event) => {
    const story = state.stories[state.current];
    const studio = story?.authorStudio;
    if (!studio) return;
    const languageButton = event.target.closest('[data-studio-lang]');
    if (languageButton) {
      state.studioLang = languageButton.dataset.studioLang === 'ko' ? 'ko' : 'en';
      try { localStorage.setItem('sophie-studio-language-v1', state.studioLang); } catch (_) {}
      renderStudio();
      return;
    }
    const choiceButton = event.target.closest('[data-studio-choice]');
    if (choiceButton) {
      const draft = readStudioDraft(story.id);
      if (draft.choiceId !== choiceButton.dataset.studioChoice) draft.ai = null;
      draft.choiceId = choiceButton.dataset.studioChoice;
      saveStudioDraft(story.id, draft);
      renderStudio();
      requestAnimationFrame(() => document.getElementById('next-page')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      return;
    }

    const actionButton = event.target.closest('[data-studio-action]');
    if (!actionButton) return;
    const draft = readStudioDraft(story.id);
    const selected = studio.choices.find((choice) => choice.id === draft.choiceId);
    const text = String(document.getElementById('next-chapter-text')?.value || draft.text || '').trim();
    const ui = STUDIO_TEXT[state.studioLang];
    const selectedPrompt = state.studioLang === 'ko' && selected?.promptKo ? selected.promptKo : selected?.prompt;

    if (actionButton.dataset.studioAction === 'hear') {
      if (!selected || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(selectedPrompt);
      utterance.lang = state.studioLang === 'ko' ? 'ko-KR' : 'en-US';
      utterance.rate = .88;
      window.speechSynthesis.speak(utterance);
      return;
    }

    if (actionButton.dataset.studioAction === 'save') {
      if (text.length < 10) {
        const status = document.getElementById('studio-status');
        if (status) status.textContent = ui.short;
        return;
      }
      draft.text = text;
      draft.savedAt = Date.now();
      saveStudioDraft(story.id, draft);
      state.studioError = '';
      renderStudio();
      return;
    }

    if (actionButton.dataset.studioAction === 'feedback') {
      if (text.length < 10 || !selected || state.studioBusy || draft.ai) {
        const status = document.getElementById('studio-status');
        if (status) status.textContent = ui.feedbackFirst;
        return;
      }
      draft.text = text;
      draft.savedAt = Date.now();
      draft.ai = null;
      saveStudioDraft(story.id, draft);
      state.studioBusy = true;
      state.studioError = '';
      renderStudio();
      try {
        const response = await fetch(WV_AI_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${WV_ANON}`, apikey: WV_ANON },
          body: JSON.stringify({
            studentId: browserStudentId(),
            palName: 'Oli',
            unitTitle: story.title || story.tabLabel,
            question: state.studioLang === 'ko'
              ? `이 영어 글에 대한 칭찬, 고칠 점, 다음 도전을 한국어로 답해주세요. 이어쓰기 질문: ${selectedPrompt}`
              : selectedPrompt,
            journal: text
          })
        });
        const result = await response.json();
        if (!response.ok || !result || result.error) throw new Error(String(result?.error || 'feedback unavailable'));
        draft.ai = result;
        saveStudioDraft(story.id, draft);
      } catch (error) {
        const message = String(error.message);
        state.studioError = message.includes('daily-limit') ? 'daily' : (message.includes('GEMINI_API_KEY') ? 'setup' : 'unavailable');
      } finally {
        state.studioBusy = false;
        renderStudio();
        requestAnimationFrame(() => document.getElementById('rainbow-feedback')?.scrollIntoView({ behavior: 'smooth', block: 'center' }));
      }
    }
  });

  els.illustration.addEventListener('error', () => {
    els.illustration.hidden = true;
    els.illustrationPlaceholder.hidden = false;
  });

  els.play.addEventListener('click', togglePlay);
  els.restart.addEventListener('click', () => {
    els.audio.currentTime = 0;
    setActiveSegment(0);
    els.audio.play().catch(() => { els.status.textContent = 'Tap play to start'; });
  });

  els.speed.addEventListener('change', () => {
    els.audio.playbackRate = Number(els.speed.value) || 1;
  });

  els.progress.addEventListener('input', () => {
    if (!Number.isFinite(els.audio.duration)) return;
    els.audio.currentTime = (Number(els.progress.value) / 1000) * els.audio.duration;
  });

  els.audio.addEventListener('loadedmetadata', () => {
    els.duration.textContent = formatTime(els.audio.duration);
    els.audio.playbackRate = Number(els.speed.value) || 1;
  });

  els.audio.addEventListener('play', () => {
    els.play.classList.add('is-playing');
    els.play.setAttribute('aria-label', 'Pause story');
    els.status.textContent = 'Reading aloud';
  });

  els.audio.addEventListener('pause', () => {
    els.play.classList.remove('is-playing');
    els.play.setAttribute('aria-label', 'Play story');
    if (!els.audio.ended && els.audio.currentTime > 0) els.status.textContent = 'Paused';
  });

  els.audio.addEventListener('timeupdate', () => {
    const duration = els.audio.duration;
    els.currentTime.textContent = formatTime(els.audio.currentTime);
    if (Number.isFinite(duration) && duration > 0) els.progress.value = String(Math.round((els.audio.currentTime / duration) * 1000));
    setActiveSegment(currentTimingIndex(els.audio.currentTime));
  });

  els.audio.addEventListener('ended', () => {
    els.play.classList.remove('is-playing');
    els.play.setAttribute('aria-label', 'Play story');
    els.status.textContent = 'Story finished';
    setActiveSegment(-1);
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    els.studio.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  });

  els.audio.addEventListener('error', () => {
    els.status.textContent = 'Narration is still being prepared';
    els.play.classList.remove('is-playing');
  });

  fetch('./stories.json', { cache: 'no-store' })
    .then((response) => {
      if (!response.ok) throw new Error(`Story data ${response.status}`);
      return response.json();
    })
    .then((stories) => {
      state.stories = stories;
      const requested = location.hash.slice(1);
      const requestedIndex = stories.findIndex((story) => story.id === requested);
      state.current = requestedIndex >= 0 ? requestedIndex : 0;
      try { state.studioLang = localStorage.getItem('sophie-studio-language-v1') === 'ko' ? 'ko' : 'en'; } catch (_) {}
      state.studioDeepLinkPending = new URLSearchParams(location.search).get('studio') === '1';
      renderStory();
      if (state.studioDeepLinkPending) {
        state.studioDeepLinkPending = false;
        window.setTimeout(() => els.studio.scrollIntoView({ behavior: 'smooth', block: 'start' }), 250);
      }
    })
    .catch((error) => {
      els.copy.innerHTML = '<p>Sorry, this story could not be loaded.</p>';
      els.status.textContent = 'Story unavailable';
      console.error(error);
    });
})();
