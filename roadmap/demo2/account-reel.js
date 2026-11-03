/* Intro playback only. A user's sound and pause choices take priority over autoplay. */
(() => {
  'use strict';
  const video = document.querySelector('#growthReel');
  if (!video) return;
  const play = document.querySelector('#reelPlay');
  const sound = document.querySelector('#reelSound');
  const hint = document.querySelector('#reelAudioHint');
  const enlarge = document.querySelector('.member-reel-controls a');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const compact = window.matchMedia('(max-height: 520px) and (orientation: landscape)');
  const soundKey = 'gfield.roadmap.intro.sound';
  let soundWanted = true;
  try { soundWanted = localStorage.getItem(soundKey) !== 'off'; } catch {}
  let wanted = !reduced.matches;
  let visible = true;
  let failed = false;
  let pendingSound = false;
  // Invalidates in-flight play promises after a pause, visibility or sound change.
  let request = 0;
  video.volume = 0.3;
  video.muted = !soundWanted;

  const canPlay = () => wanted && visible && !document.hidden && !failed;
  function update() {
    play.textContent = compact.matches ? (video.paused ? '재생' : '정지') : video.paused ? (video.ended ? '다시 보기' : '영상 재생') : '일시정지';
    play.setAttribute('aria-label', video.paused ? '소개 영상 재생' : '소개 영상 일시정지');
    sound.textContent = compact.matches ? '소리' : video.muted ? '배경음 켜기' : '배경음 끄기';
    sound.setAttribute('aria-label', video.muted ? '소개 영상 배경음 켜기' : '소개 영상 배경음 끄기');
    sound.setAttribute('aria-pressed', String(!video.muted));
    enlarge.textContent = compact.matches ? '확대' : '크게 보기';
    enlarge.setAttribute('aria-label', '소개 영상 크게 보기');
    if (hint) hint.hidden = !pendingSound || !wanted;
  }
  function pause() {
    request++;
    video.pause();
    update();
  }
  async function start(withSound = soundWanted && !pendingSound) {
    if (!canPlay()) return;
    const current = ++request;
    video.muted = !withSound;
    try {
      await video.play();
      if (current !== request) return;
      if (!canPlay()) { pause(); return; }
      if (withSound) pendingSound = false;
    } catch (error) {
      if (current !== request || !canPlay()) return;
      // A denied sound request may still play muted. Other errors keep the play control.
      if (withSound && error.name === 'NotAllowedError') {
        pendingSound = soundWanted;
        video.muted = true;
        try { await video.play(); } catch {}
        if (current !== request) return;
        if (!canPlay()) { pause(); return; }
      }
    }
    update();
  }
  function saveSound() {
    try { localStorage.setItem(soundKey, soundWanted ? 'on' : 'off'); } catch {}
  }
  play.addEventListener('click', () => {
    wanted = video.paused;
    if (wanted) { pendingSound = false; start(soundWanted); }
    else pause();
    update();
  });
  sound.addEventListener('click', () => {
    soundWanted = video.muted;
    pendingSound = false;
    saveSound();
    if (soundWanted) { wanted = true; start(true); }
    else { request++; video.muted = true; }
    update();
  });
  function firstInteraction(event) {
    if (!event.isTrusted || !pendingSound || !soundWanted || !canPlay()) return;
    if (event.target.closest?.('#reelSound, #reelPlay')) return;
    if (event.type === 'keydown' && !['Enter', ' '].includes(event.key)) return;
    // Runs in the gesture handler so browsers can grant audible playback.
    start(true);
  }
  document.addEventListener('click', firstInteraction, true);
  document.addEventListener('keydown', firstInteraction, true);
  ['play', 'pause', 'ended', 'volumechange'].forEach(event => video.addEventListener(event, update));
  video.addEventListener('ended', () => { wanted = false; pendingSound = false; request++; update(); });
  video.addEventListener('error', () => {
    failed = true;
    wanted = false;
    pendingSound = false;
    pause();
    video.hidden = true;
    document.querySelector('.member-reel-fallback').hidden = false;
    document.querySelector('.member-reel-controls').hidden = true;
    if (hint) hint.hidden = true;
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause(); else start();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      const next = entries[0].isIntersecting;
      if (next === visible) return;
      visible = next;
      if (visible) start(); else pause();
    }, { threshold: 0.15 }).observe(video);
  }
  reduced.addEventListener('change', event => {
    if (event.matches) { wanted = false; pendingSound = false; pause(); }
  });
  compact.addEventListener('change', update);
  update();
  start();
})();
