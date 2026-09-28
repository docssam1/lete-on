// Only one learning medium speaks at a time. Pausing never rewinds or auto-resumes.
export function pauseLearningMedia(except = null) {
  document.querySelectorAll('video, audio').forEach(media => { if (media !== except) media.pause(); });
  try { window.speechSynthesis?.cancel(); } catch { /* device speech unavailable */ }
  document.dispatchEvent(new CustomEvent('science:media-focus', { detail: { except } }));
}
// A muted autoplay (a living page's moving picture) does not speak, so it does not silence anything.
// Unmuting a playing medium counts as starting to speak.
document.addEventListener('play', event => {
  if (event.target instanceof HTMLMediaElement && !event.target.muted) pauseLearningMedia(event.target);
}, true);
document.addEventListener('volumechange', event => {
  const media = event.target;
  if (media instanceof HTMLMediaElement && !media.muted && !media.paused) pauseLearningMedia(media);
}, true);
document.addEventListener('science:lab-open', () => pauseLearningMedia());
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseLearningMedia(); });
window.addEventListener('beforeprint', () => pauseLearningMedia());
window.addEventListener('hashchange', () => pauseLearningMedia());
