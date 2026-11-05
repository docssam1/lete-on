// 단추 그림(원장 2026-11-05 「대비랑 이모지 단추 고쳐」). 이모지(🔊 ⏸ 🗑 🔒)는 기기마다 모양·색이 달라
// 따뜻한 종이 + 깊은 초록 화면에서 튀고, 화면 읽기 프로그램이 「스피커 높은 볼륨」처럼 엉뚱하게 읽는다.
// 그래서 선 하나 굵기의 작은 SVG로 바꾼다 — 색은 글자색(currentColor)을 따르고, 이름은 단추의 aria-label이 맡는다.
const PATHS = {
  soundOn: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none"/><path d="M15.5 9a4.2 4.2 0 0 1 0 6"/><path d="M18 6.5a7.6 7.6 0 0 1 0 11"/>',
  soundOff: '<path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" stroke="none"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
  pause: '<path d="M8.5 5.5v13M15.5 5.5v13" stroke-width="3"/>',
  play: '<path d="M8 5.2v13.6L19 12z" fill="currentColor"/>',
  first: '<path d="M6 5.5v13" stroke-width="2.4"/><path d="M18.5 5.5L9 12l9.5 6.5z" fill="currentColor"/>',
  trash: '<path d="M4.5 7h15"/><path d="M9.5 7V4.5h5V7"/><path d="M6.5 7l1 12.5h9l1-12.5"/><path d="M10.2 10.5v6M13.8 10.5v6"/>',
  lock: '<rect x="5" y="10.5" width="14" height="9.5" rx="2"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/>',
};

export function icon(name, size = "1.2em") {
  const body = PATHS[name];
  if (!body) return "";
  return `<svg class="ui-icon" viewBox="0 0 24 24" width="24" height="24" style="width:${size};height:${size};vertical-align:-0.2em;flex:none" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${body}</svg>`;
}

// 단추 안의 그림만 바꾼다(글자 span 등 다른 자식은 그대로).
export function setIcon(button, name, size) {
  if (!button) return;
  const old = button.querySelector(":scope > svg.ui-icon");
  const tmp = document.createElement("span");
  tmp.innerHTML = icon(name, size);
  const next = tmp.firstChild;
  if (old) old.replaceWith(next); else button.prepend(next);
}
