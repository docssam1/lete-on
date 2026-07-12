/* Numbers of Magic — 숫자 캐릭터 렌더러 (실제 캐릭터 아트 기반)
   window.renderNumiChar(char, size) → HTML 문자열 (layered)
   char = {number:0-9, color:'blue', bg:'plain'}   (face/hat는 아트에 내장 → 무시)
   size = 픽셀 너비 (기본 120, 높이 = size×1.25)

   구성: [오라(글로우, color)] + [배경 장식 SVG(bg)] + [캐릭터 PNG(number)]
   캐릭터 이미지: assets/characters/ — 0=누미, 3=포코, 8=모모, 나머지 num-N.png */
(function(){
'use strict';

let UID = 0; // 그라디언트 id 충돌 방지

/* 숫자 → 이미지 파일 */
const IMG_FILE = {0:'numi-0.png', 3:'poco-3.png', 8:'momo-8.png'};
function imgSrc(n){
  const base = window.NM_CHAR_BASE || 'assets/characters/';
  return base + (IMG_FILE[n] || ('num-'+n+'.png'));
}

function getCol(id){
  const av = window.NM_AVATAR;
  if(av){ const c=av.colors.find(x=>x.id===id); if(c) return c; }
  return {fg:'#2980b9',bg:'#d6eaf8'};
}

/* ── 배경 장식 (viewBox 0 0 120 150, 캐릭터 중심 60,78) ── */
function bgDecor(id, uid){
  const cx=60, cy=76, r=52;
  switch(id){
    case 'stars': return [
      [cx-r+4,cy-r+10],[cx+r-8,cy-r+6],[cx-r,cy+8],
      [cx+r-2,cy+16],[cx-4,cy-r-2],[cx+r-6,cy-r+26]
    ].map(([x,y])=>star5(x,y,5.5,2.4,'#ffd93b')).join('');
    case 'hearts': return [
      [cx-r+4,cy-r+16],[cx+r-6,cy-r+14],
      [cx-r+10,cy+r-12],[cx+r-10,cy+r-8]
    ].map(([x,y])=>heartShape(x,y,6,'#ff6b9d')).join('');
    case 'sparks': return [
      [cx-r+2,cy-r+14],[cx+r-4,cy-r+10],[cx-r-1,cy+10],
      [cx+r,cy+22],[cx+8,cy-r+2],[cx-12,cy+r-4]
    ].map(([x,y])=>sparkShape(x,y,'#f39c12')).join('');
    case 'rainbow':
      return `<path d="M${cx-r},${cy+2} A${r-4} ${r-4} 0 0 1 ${cx+r},${cy+2}"
fill="none" stroke="url(#nmrb_${uid})" stroke-width="7" opacity=".55"/>
<defs><linearGradient id="nmrb_${uid}" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" stop-color="#e74c3c"/>
<stop offset="25%" stop-color="#f39c12"/>
<stop offset="55%" stop-color="#2ecc71"/>
<stop offset="80%" stop-color="#3498db"/>
<stop offset="100%" stop-color="#9b59b6"/>
</linearGradient></defs>`;
    case 'magic': return [
      [cx-r+6,cy-r+8],[cx+r-8,cy-r+8],
      [cx-r+3,cy+6],[cx+r-3,cy+6],[cx,cy+r+2]
    ].map(([x,y])=>sparkle4(x,y,6,'#b388ff')).join('');
    default: return '';
  }
}

function star5(cx,cy,ro,ri,fill){
  const pts=[];
  for(let i=0;i<10;i++){
    const a=Math.PI*i/5-Math.PI/2, R=i%2?ri:ro;
    pts.push(cx+R*Math.cos(a)+','+( cy+R*Math.sin(a)));
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`;
}
function heartShape(cx,cy,r,fill){
  const s=r*0.6;
  return `<path d="M${cx},${cy+s} C${cx},${cy} ${cx-r},${cy} ${cx-r},${cy-s} C${cx-r},${cy-r*1.2} ${cx},${cy-r} ${cx},${cy-s} C${cx},${cy-r} ${cx+r},${cy-r*1.2} ${cx+r},${cy-s} C${cx+r},${cy} ${cx},${cy} ${cx},${cy+s}Z" fill="${fill}"/>`;
}
function sparkShape(cx,cy,fill){
  return `<g transform="translate(${cx},${cy})">
<line x1="0" y1="-6" x2="0" y2="6" stroke="${fill}" stroke-width="2" stroke-linecap="round"/>
<line x1="-6" y1="0" x2="6" y2="0" stroke="${fill}" stroke-width="2" stroke-linecap="round"/>
<line x1="-4" y1="-4" x2="4" y2="4" stroke="${fill}" stroke-width="1.5" stroke-linecap="round" opacity=".6"/>
<line x1="4" y1="-4" x2="-4" y2="4" stroke="${fill}" stroke-width="1.5" stroke-linecap="round" opacity=".6"/>
</g>`;
}
function sparkle4(cx,cy,r,fill){
  return `<path d="M${cx},${cy-r} L${cx+r*.25},${cy-r*.25} L${cx+r},${cy} L${cx+r*.25},${cy+r*.25} L${cx},${cy+r} L${cx-r*.25},${cy+r*.25} L${cx-r},${cy} L${cx-r*.25},${cy-r*.25}Z" fill="${fill}"/>`;
}

/* ── 메인 렌더 ── */
window.renderNumiChar = function(char, size){
  char = char || {};
  const num     = char.number != null ? +char.number : 3;
  const colorId = char.color  || 'blue';
  const bgId    = char.bg     || 'plain';
  size = size || 120;

  const fg = getCol(colorId).fg;
  const uid = 'nm'+(++UID);
  const ph = Math.round(size * 1.25);

  // 오라: 캐릭터 뒤 은은한 글로우 (선택한 색)
  const aura = `<span style="position:absolute;left:50%;top:54%;transform:translate(-50%,-50%);
width:92%;height:78%;border-radius:50%;
background:radial-gradient(closest-side,${fg}55,${fg}00 95%);pointer-events:none"></span>`;

  const decor = bgDecor(bgId, uid);
  const decorSvg = decor
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150" preserveAspectRatio="xMidYMid meet"
style="position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none">${decor}</svg>`
    : '';

  return `<span class="numi-fig" style="position:relative;display:inline-block;width:${size}px;height:${ph}px;vertical-align:middle">
${aura}${decorSvg}
<img src="${imgSrc(num)}" alt="${num}" draggable="false"
style="position:absolute;left:50%;bottom:3%;transform:translateX(-50%);
max-width:76%;max-height:88%;object-fit:contain;
filter:drop-shadow(0 ${Math.max(2,size*.025)}px ${Math.max(3,size*.05)}px rgba(0,0,0,.22))">
</span>`;
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.renderNumiChar;
})();
