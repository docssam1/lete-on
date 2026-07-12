/* Numbers of Magic — 숫자 캐릭터 렌더러 (실제 캐릭터 아트 기반)
   window.renderNumiChar(char, size) → HTML 문자열 (layered)
   char = {number:0-99, color:'blue', bg:'plain'}
   size = 픽셀 너비 (기본 120, 높이 = size×1.25)

   구성: [오라(글로우, color)] + [배경 장식 SVG(bg)] + [캐릭터 PNG(number) × color 톤]
   - color: 캐릭터 PNG 전체(신발·몸통·무늬 전부)에 CSS 필터로 색조를 입힘 —
     그림 자체는 그대로 두고 "색깔 톤"만 갈아끼우는 방식(부위별 마스킹 없이 전체 재염색)
   - number: 0~9 = 단일 캐릭터 이미지. 10 = 전용 원본 아트(num-10.png).
     11~99(10 제외) = 자리별 캐릭터를 나란히 붙인 "두 자리 수" 합체 —
     특별 보상(코인)으로 잠금 해제되는 프레스티지 캐릭터
   캐릭터 이미지: assets/characters/ — 0=누미, 3=포코, 8=모모, 나머지 num-N.png */
(function(){
'use strict';

let UID = 0; // 그라디언트 id 충돌 방지

/* 숫자 → 이미지 파일 (한 자리, 0~10) */
const IMG_FILE = {0:'numi-0.png', 3:'poco-3.png', 8:'momo-8.png'};
function digitImgSrc(n){
  const base = window.NM_CHAR_BASE || 'assets/characters/';
  return base + (IMG_FILE[n] || ('num-'+n+'.png'));
}

function getCol(id){
  const av = window.NM_AVATAR;
  if(av){ const c=av.colors.find(x=>x.id===id); if(c) return c; }
  return {fg:'#2980b9',bg:'#d6eaf8'};
}

/* ── hex → hsl ── */
function hex2hsl(hex){
  hex = hex.replace('#','');
  if(hex.length===3) hex = hex.split('').map(c=>c+c).join('');
  const r=parseInt(hex.slice(0,2),16)/255, g=parseInt(hex.slice(2,4),16)/255, b=parseInt(hex.slice(4,6),16)/255;
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  let h=0, s=0; const l=(max+min)/2;
  if(max!==min){
    const d=max-min;
    s = l>0.5 ? d/(2-max-min) : d/(max+min);
    switch(max){
      case r: h=(g-b)/d+(g<b?6:0); break;
      case g: h=(b-r)/d+2; break;
      default: h=(r-g)/d+4;
    }
    h*=60;
  }
  return [h, s*100, l*100];
}

/* ── 색상 톤(color) → CSS filter 문자열 ──
   grayscale+sepia로 원본 톤을 지운 뒤 hue-rotate로 목표 색상에 맞춰 재염색.
   신발·몸통·무늬가 전부 한 그림 안에 있으므로 이 필터 하나로 다 같이 물든다. */
function tintFilter(fg){
  const [h,s,l] = hex2hsl(fg);
  const rotate = Math.round(((h - 28) % 360 + 360) % 360);
  const sat = Math.min(7, Math.max(2.2, s/16));
  const bright = Math.min(1.12, Math.max(0.72, 0.55 + l/150));
  return `grayscale(1) sepia(1) saturate(${sat.toFixed(2)}) hue-rotate(${rotate}deg) brightness(${bright.toFixed(2)})`;
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
  const tint = tintFilter(fg);
  const shadow = `drop-shadow(0 ${Math.max(2,size*.025)}px ${Math.max(3,size*.05)}px rgba(0,0,0,.22))`;

  // 오라: 캐릭터 뒤 은은한 글로우 (선택한 색)
  const aura = `<span style="position:absolute;left:50%;top:54%;transform:translate(-50%,-50%);
width:92%;height:78%;border-radius:50%;
background:radial-gradient(closest-side,${fg}45,${fg}00 95%);pointer-events:none"></span>`;

  const decor = bgDecor(bgId, uid);
  const decorSvg = decor
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150" preserveAspectRatio="xMidYMid meet"
style="position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none">${decor}</svg>`
    : '';

  // 11~99(10 제외) → 두 자리 합체: 자리별 캐릭터를 나란히 배치
  let figure;
  if(num >= 11 && num <= 99){
    const tens = Math.floor(num/10), ones = num%10;
    figure = `<span style="position:absolute;left:50%;bottom:3%;transform:translateX(-50%);
display:flex;align-items:flex-end;justify-content:center;height:88%">
<img src="${digitImgSrc(tens)}" alt="${tens}" draggable="false"
style="max-width:100%;max-height:100%;object-fit:contain;margin-right:-6%;filter:${tint} ${shadow}">
<img src="${digitImgSrc(ones)}" alt="${ones}" draggable="false"
style="max-width:100%;max-height:100%;object-fit:contain;filter:${tint} ${shadow}">
</span>`;
  } else {
    figure = `<img src="${digitImgSrc(num)}" alt="${num}" draggable="false"
style="position:absolute;left:50%;bottom:3%;transform:translateX(-50%);
max-width:76%;max-height:88%;object-fit:contain;filter:${tint} ${shadow}">`;
  }

  return `<span class="numi-fig" style="position:relative;display:inline-block;width:${size}px;height:${ph}px;vertical-align:middle">
${aura}${decorSvg}${figure}
</span>`;
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.renderNumiChar;
})();
