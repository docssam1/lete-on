// 공원 지도의 두 아이(나래·도윤) — 옆모습 SVG. 오른쪽을 본다(왼쪽은 CSS로 뒤집음).
// 다리(.lg)는 엉덩이(20, 44), 팔(.ar)은 어깨(20, 31)를 축으로 CSS가 흔든다(report.css .pk-kid). 원본 도형만 썼다.
const SKIN = '#ffd9b8', SKIN_DK = '#efbf98';
const LOOK = {
  narae: { shirt: '#f3a6bf', shirtDk: '#d9809f', pants: '#5b6b8c', pantsDk: '#46546f', shoe: '#ffffff', shoeDk: '#d9d9e2', hair: '#3b2a20', bag: '#8f7bd6', bagDk: '#6b58b0' },
  doyun: { shirt: '#86b6e6', shirtDk: '#5f90c6', pants: '#3d4a63', pantsDk: '#2e384c', shoe: '#f1f1f1', shoeDk: '#c9cdd6', hair: '#2a1f18', bag: '#2f4f8f', bagDk: '#22396a', cap: '#24365e', capDk: '#182644' },
};

export function kidSvg(who) {
  const c = LOOK[who];
  const leg = (cls, pants, shoe) => `<g class="lg ${cls}"><rect x="17.2" y="42" width="5.6" height="16.5" rx="2.7" fill="${pants}"/><ellipse cx="21.6" cy="59.6" rx="4.4" ry="2.4" fill="${shoe}" stroke="rgba(40,30,30,.25)" stroke-width=".6"/></g>`;
  const arm = (cls, shirt, hand) => `<g class="ar ${cls}"><rect x="17.8" y="29.5" width="4.4" height="12" rx="2.2" fill="${shirt}"/><circle cx="20" cy="42.3" r="2.3" fill="${hand}"/></g>`;
  const hair = who === 'narae'
    ? `<path d="M11.2 13.5 q-7 3 -4.6 13.5 q3.6 -1.4 5.4 -7.6 z" fill="${c.hair}"/><circle cx="21" cy="18" r="10.5" fill="${SKIN}"/>
       <path d="M10.6 19.5 Q10 7.6 21 7.4 Q30.6 7.6 31.4 15.6 Q25.5 15.4 22.6 11.4 Q19 16.6 13.4 17.2 L13.2 25 Q10.6 23 10.6 19.5 z" fill="${c.hair}"/>
       <circle cx="11.6" cy="13.6" r="2.2" fill="#f07ca0"/>`
    : `<circle cx="21" cy="18" r="10.5" fill="${SKIN}"/>
       <path d="M10.6 20.5 Q10.2 12 16 10.6 L24 12.6 Q17.4 13.6 14.2 17.4 L13.6 23.6 Q11 22.6 10.6 20.5 z" fill="${c.hair}"/>
       <path d="M10.4 15.4 Q11 6.6 21 6.6 Q30.6 6.8 31.6 14.8 z" fill="${c.cap}"/><path d="M29.4 14.2 Q35.6 13.8 38.4 16 Q34 17.4 28.6 16.6 z" fill="${c.capDk}"/><circle cx="20.6" cy="7.2" r="1.3" fill="${c.capDk}"/>`;
  return `<svg viewBox="0 0 40 66" aria-hidden="true"><ellipse cx="20" cy="62.6" rx="9.5" ry="2.4" fill="rgba(20,30,20,.3)"/>
    <g class="bd">${leg('lb', c.pantsDk, c.shoeDk)}${arm('ab', c.shirtDk, SKIN_DK)}
      <rect x="8.4" y="29" width="8.8" height="14.4" rx="3.3" fill="${c.bag}"/><rect x="9.4" y="35.4" width="6.8" height="4.2" rx="1.6" fill="${c.bagDk}"/>
      <rect x="13.4" y="27.6" width="13.8" height="18.4" rx="5.6" fill="${c.shirt}"/><path d="M16.4 28.6 L17.4 43.6" stroke="${c.bagDk}" stroke-width="1.7" stroke-linecap="round"/>
      ${leg('lf', c.pants, c.shoe)}${arm('af', c.shirt, SKIN)}
      ${hair}<circle cx="17" cy="19.6" r="2.2" fill="${SKIN_DK}"/>
      <ellipse cx="26.2" cy="19.4" rx="1.3" ry="1.75" fill="#2a2320"/><circle cx="26.7" cy="18.7" r=".45" fill="#fff"/>
      <circle cx="24.6" cy="23.2" r="1.9" fill="#ff9a9a" opacity=".55"/><path d="M27.2 24.6 Q28.4 25.5 29.5 24.5" stroke="#7a3b2e" stroke-width=".9" fill="none" stroke-linecap="round"/></g></svg>`;
}
