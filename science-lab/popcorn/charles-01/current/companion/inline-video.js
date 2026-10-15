// Shared loader for the existing reader and the guided study player.
const API_KEY = '__POPCORN_YOUTUBE_API__';
let playerSerial = 0;

export function loadYouTubeAPI() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (window[API_KEY]) return window[API_KEY];
  const promise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    let settled = false;
    let timer;
    const finish = (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      script.removeEventListener('error', failed);
      if (window.onYouTubeIframeAPIReady === ready) window.onYouTubeIframeAPIReady = previous;
      if (error) {
        if (script.dataset.popcornYoutubeApi === 'true') script.remove();
        reject(error);
      } else resolve(window.YT);
    };
    const ready = () => {
      try { previous?.(); } finally { finish(window.YT?.Player ? null : Error('video-api-unavailable')); }
    };
    const failed = () => finish(Error('video-api-unavailable'));
    let script = document.querySelector('script[src="https://www.youtube.com/iframe_api"]');
    if (!script) {
      script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.referrerPolicy = 'strict-origin-when-cross-origin';
      script.dataset.popcornYoutubeApi = 'true';
    }
    window.onYouTubeIframeAPIReady = ready;
    script.addEventListener('error', failed, {once: true});
    timer = setTimeout(() => finish(Error('video-api-timeout')), 15000);
    if (!script.isConnected) document.head.append(script);
  });
  window[API_KEY] = promise;
  promise.catch(() => { if (window[API_KEY] === promise) delete window[API_KEY]; });
  return promise;
}

const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset = name => new URL('../assets/' + name, import.meta.url).href;

export function mountInlineVideo(host, video, {onState = () => {}, locale = 'ko', startTime = 0, muted = true, active = true} = {}) {
  let player = null, destroyed = false, ready = false, state = 'loading', focused = false;
  let position = Math.max(0, Number(startTime) || 0), isMuted = muted !== false, isActive = active;
  let language = locale === 'en' ? 'en' : 'ko';
  const id = 'popcorn-inline-video-' + (++playerSerial);
  const words = () => language === 'en'
    ? {sound: 'Sound on', mute: 'Mute', loading: 'Preparing the video.', blocked: 'Press play in the video.', error: 'The video could not load. You can continue to the next page.'}
    : {sound: '소리 켜기', mute: '소리 끄기', loading: '영상을 준비하고 있어요.', blocked: '영상의 재생 버튼을 눌러요.', error: '영상을 불러오지 못했어요. 다음으로 이어 갈 수 있어요.'};
  host.innerHTML = `<div class="inline-video" data-video-state="loading"><div class="inline-video-layout"><div class="inline-video-frame"><img class="inline-video-poster" src="${asset(video.image)}" alt="${esc(video[language].title)}"><div id="${id}"></div></div><div class="inline-video-copy"><p class="inline-video-question"></p><p class="inline-video-watch"></p><div class="inline-video-meta"><span>${esc(video.publisher)} · ${esc(video.duration)}</span><button type="button" class="inline-video-sound"></button></div></div></div><p class="inline-video-status" role="status" aria-live="polite"></p></div>`;
  const shell = host.querySelector('.inline-video');
  const status = host.querySelector('.inline-video-status');
  const sound = host.querySelector('.inline-video-sound');
  const getPosition = () => {
    try { const time = player?.getCurrentTime?.(); if (Number.isFinite(time)) position = time; } catch {}
    return position;
  };
  const snapshot = () => ({state, playing: focused, ready, muted: isMuted, currentTime: getPosition(), videoId: video.videoId});
  const updateCopy = () => {
    const text = video[language];
    shell.lang = language;
    host.querySelector('.inline-video-question').textContent = text.question;
    host.querySelector('.inline-video-watch').textContent = text.watch;
    sound.textContent = isMuted ? words().sound : words().mute;
    sound.setAttribute('aria-pressed', String(!isMuted));
    sound.disabled = !ready;
    status.textContent = state === 'loading' ? words().loading : state === 'blocked' ? words().blocked : state === 'error' ? words().error : '';
    status.hidden = !status.textContent;
  };
  const notify = (next, focus = focused) => {
    if (destroyed) return;
    state = next; focused = focus;
    shell.dataset.videoState = state;
    shell.classList.toggle('is-playing', focused);
    updateCopy();
    onState(snapshot());
  };
  const pause = () => {
    getPosition();
    try { player?.pauseVideo?.(); } catch {}
    if (state !== 'error' && state !== 'loading') notify('paused', false);
  };
  const toggleSound = () => {
    if (!ready) return;
    isMuted = !isMuted;
    try { isMuted ? player.mute() : player.unMute(); } catch {}
    updateCopy(); onState(snapshot());
  };
  const visibility = () => { if (document.hidden) pause(); };
  sound.addEventListener('click', toggleSound);
  document.addEventListener('visibilitychange', visibility);
  updateCopy();
  loadYouTubeAPI().then(yt => {
    if (destroyed) return;
    player = new yt.Player(id, {
      width: '100%', height: '100%', videoId: video.videoId,
      host: 'https://www.youtube-nocookie.com',
      playerVars: {autoplay: 0, playsinline: 1, controls: 1, rel: 0, origin: location.origin, start: Math.floor(position)},
      events: {
        onReady(event) {
          if (destroyed) return;
          player = event.target; ready = true;
          const frame = player.getIframe();
          frame.title = video[language].title;
          frame.referrerPolicy = 'strict-origin-when-cross-origin';
          frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
          frame.allowFullscreen = true;
          try { isMuted ? player.mute() : player.unMute(); } catch {}
          notify('ready', false);
          if (isActive && !document.hidden) player.playVideo();
        },
        onStateChange(event) {
          if (destroyed) return;
          if (event.data === 1) {
            if (!isActive || document.hidden) { pause(); return; }
            notify('playing', true);
          } else if (event.data === 2) notify('paused', false);
          else if (event.data === 0) notify('ended', false);
          else if (event.data === 3) notify('buffering');
          else if (event.data === 5 || event.data === -1) notify('ready', false);
        },
        onAutoplayBlocked() { notify('blocked', false); },
        onError(event) { shell.dataset.videoError = String(event.data); notify('error', false); }
      }
    });
    const frame = player.getIframe?.();
    if (frame) { frame.referrerPolicy = 'strict-origin-when-cross-origin'; frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'; frame.title = video[language].title; }
  }).catch(() => notify('error', false));
  return {
    getPlayer: () => player,
    getState: snapshot,
    setLocale(value) { language = value === 'en' ? 'en' : 'ko'; updateCopy(); const frame = player?.getIframe?.(); if (frame) frame.title = video[language].title; },
    setActive(value) {
      const wasActive = isActive; isActive = Boolean(value);
      if (wasActive === isActive) return;
      if (!isActive) pause();
      else if (!wasActive && ready && !document.hidden && state !== 'ended' && state !== 'error') {
        try { player.playVideo(); } catch {}
      }
    },
    destroy() {
      if (destroyed) return;
      getPosition(); destroyed = true;
      document.removeEventListener('visibilitychange', visibility);
      sound.removeEventListener('click', toggleSound);
      try { player?.destroy?.(); } catch {}
      player = null;
    }
  };
}
