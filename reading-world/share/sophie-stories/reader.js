(() => {
  'use strict';

  const AUDIO_BASE = 'https://fgahqumaldheqettmvqg.supabase.co/storage/v1/object/public/audio/sophie-stories';
  const state = { stories: [], current: 0, timings: [], activeSegment: -1, timingMode: 'exact' };

  const els = {
    tabs: document.getElementById('story-tabs'),
    title: document.getElementById('story-title'),
    byline: document.getElementById('byline'),
    copy: document.getElementById('story-copy'),
    illustrationNumber: document.getElementById('illustration-number'),
    pageNumber: document.getElementById('page-number'),
    audio: document.getElementById('audio'),
    play: document.getElementById('play-button'),
    restart: document.getElementById('restart-button'),
    progress: document.getElementById('progress'),
    currentTime: document.getElementById('current-time'),
    duration: document.getElementById('duration'),
    status: document.getElementById('player-status'),
    speed: document.getElementById('speed')
  };

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

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
    els.pageNumber.textContent = `${state.current + 1} / ${state.stories.length}`;
    renderTabs();
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
      renderStory();
    })
    .catch((error) => {
      els.copy.innerHTML = '<p>Sorry, this story could not be loaded.</p>';
      els.status.textContent = 'Story unavailable';
      console.error(error);
    });
})();
