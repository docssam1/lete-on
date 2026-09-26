import { createLabWorkspace } from './lab-workspace.js';
import { pauseLearningMedia } from './media-session.js';

// The same reading stays in the book. Video sources load only on an explicit play.
// autoplay: the video starts muted when it comes into view (not with reduced motion); sound stays the learner's choice.
export function wireReading(root, { mountLab = null, openLab = null, autoplay = false } = {}) {
  const abort = new AbortController(), { signal } = abort;
  const workspace = mountLab ? createLabWorkspace(root, { title: '화산 실험실', mount: mountLab }) : null;
  const articles = [...root.querySelectorAll('.sl-reading')];
  const videos = [];
  const offscreen = new IntersectionObserver(entries => {
    for (const entry of entries) if (!entry.isIntersecting) entry.target.pause();
  }, { threshold: 0.01 });
  for (const article of articles) {
    const box = article.querySelector('.sl-reading-player'), video = box?.querySelector('video');
    if (!video) continue;
    videos.push(video); article.classList.add('is-live'); offscreen.observe(video);
    const play = box.querySelector('[data-reading-play]'), status = box.querySelector('[data-video-status]');
    const failedSources = new Set();
    let attempt = 0;
    const fail = () => { status.hidden = false; play.hidden = false; play.textContent = '영상 다시 재생'; };
    const start = async ({ quiet = false } = {}) => {
      if (signal.aborted) return;
      const currentAttempt = ++attempt;
      status.hidden = true;
      let reload = !!video.error || video.networkState === HTMLMediaElement.NETWORK_NO_SOURCE;
      if (!video.querySelector('source')) {
        for (const [key, type] of [['src', 'video/webm'], ['mp4', 'video/mp4'], ['full', 'video/webm']]) {
          const url = box.dataset[key]; if (!url || !/^https:\/\//.test(url)) continue;
          const source = document.createElement('source'); source.src = url; source.type = type;
          source.addEventListener('error', () => {
            failedSources.add(source);
            // With <source> children Chrome may never emit an error on <video>.
            if (failedSources.size === video.querySelectorAll('source').length) fail();
          }, { signal });
          video.appendChild(source);
        }
        reload = true;
      }
      if (!video.querySelector('source')) { fail(); return; }
      if (!quiet) { video.muted = false; pauseLearningMedia(video); }
      if (reload) { failedSources.clear(); video.load(); }
      try { await video.play(); } catch (error) {
        // Closing, changing pages or retrying may cancel a pending play intentionally.
        if (!signal.aborted && currentAttempt === attempt && error.name !== 'AbortError') fail();
      }
    };
    play.addEventListener('click', event => { event.stopPropagation(); start(); }, { signal });
    if (autoplay && !matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      const seen = new IntersectionObserver(([entry]) => {
        if (!entry?.isIntersecting || signal.aborted) return;
        seen.disconnect(); if (video.paused && !video.currentTime) { video.muted = true; start({ quiet: true }); }
      }, { threshold: 0.5 });
      seen.observe(box); signal.addEventListener('abort', () => seen.disconnect());
    }
    article.querySelector('[data-reading-watch]')?.addEventListener('click', event => {
      event.preventDefault(); event.stopPropagation(); video.scrollIntoView({ block: 'center', behavior: 'instant' }); start();
    }, { signal });
    video.addEventListener('playing', () => { play.hidden = true; status.hidden = true; }, { signal });
    // A failed <source> must not suppress the browser's next format fallback.
    video.addEventListener('error', fail, { signal });
    article.querySelector('.sl-reading-online')?.addEventListener('click', event => {
      if (!workspace && !openLab) return; // ordinary route remains a no-JS/unsupported fallback
      event.preventDefault(); event.stopPropagation();
      (openLab || (from => workspace.open(from)))(event.currentTarget);
    }, { signal });
  }
  // Flipbook leaves remain connected: inert/aria-hidden, not removal, marks page exit.
  const checkPages = () => videos.forEach(video => {
    if (!video.isConnected || video.closest('[inert], [aria-hidden="true"]')) video.pause();
  });
  const pages = new MutationObserver(checkPages);
  pages.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['inert', 'aria-hidden'] });
  return () => {
    abort.abort(); offscreen.disconnect(); pages.disconnect(); workspace?.dispose();
    videos.forEach(video => { video.pause(); video.replaceChildren(); video.removeAttribute('src'); video.load(); });
    articles.forEach(article => article.classList.remove('is-live'));
  };
}
