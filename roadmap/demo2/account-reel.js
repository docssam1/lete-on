/* Autoplay is always muted. Sound requires an explicit tap; no membership data is used. */
(() => {
  const video = document.querySelector('#growthReel');
  if (!video) return;
  const play = document.querySelector('#reelPlay');
  const sound = document.querySelector('#reelSound');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let wanted = !reduced.matches;
  let visible = true;
  video.muted = true;
  function update() {
    play.textContent = video.paused ? (video.ended ? '다시 보기' : '영상 재생') : '일시정지';
    play.setAttribute('aria-label', video.paused ? '소개 영상 재생' : '소개 영상 일시정지');
    sound.textContent = video.muted ? '배경음 켜기' : '배경음 끄기';
    sound.setAttribute('aria-pressed', String(!video.muted));
  }
  function start() {
    if (!wanted || !visible || document.hidden) return;
    video.play().then(update).catch(update);
  }
  play.addEventListener('click', () => {
    wanted = video.paused;
    if (wanted) start(); else video.pause();
    update();
  });
  sound.addEventListener('click', () => {
    video.muted = !video.muted;
    if (!video.muted) { wanted = true; start(); }
    update();
  });
  ['play', 'pause', 'ended', 'volumechange'].forEach(event => video.addEventListener(event, update));
  video.addEventListener('ended', () => { wanted = false; update(); });
  video.addEventListener('error', () => {
    wanted = false;
    video.hidden = true;
    document.querySelector('.member-reel-fallback').hidden = false;
    document.querySelector('.member-reel-controls').hidden = true;
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause(); else start();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible) start(); else video.pause();
    }, {threshold: 0.15}).observe(video);
  }
  reduced.addEventListener('change', event => {
    if (event.matches) { wanted = false; video.pause(); }
  });
  update();
  start();
})();
