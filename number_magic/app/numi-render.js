/* Numbers of Magic — 숫자 캐릭터 렌더러 (실제 캐릭터 아트 기반)
   window.renderNumiChar(char, size) → HTML 문자열 (layered)
   char = {number:0-99, color:'blue', bg:'plain', cape:'none', hat:'none'}
   size = 픽셀 너비 (기본 120, 높이 = size×1.25)

   구성: [오라(글로우, color)] + [배경 장식 SVG(bg)] + [망토 SVG(cape, 캐릭터 뒤)]
        + [캐릭터 PNG(number) × color 톤] + [모자 SVG(hat, 캐릭터 위)]
   - color: 캐릭터 PNG 전체(신발·몸통·무늬 전부)에 CSS 필터로 색조를 입힘 —
     그림 자체는 그대로 두고 "색깔 톤"만 갈아끼우는 방식(부위별 마스킹 없이 전체 재염색).
     예외: 'aurora'(무지개오라)는 단색 글로우 대신 conic-gradient 무지개 링을 그린다.
   - hat: viewBox 0 0 120 150의 정수리 앵커(cx=60,topY=20) 공통 위치에 얹는 SVG
     오버레이 — 캐릭터마다 실제 머리 높이가 달라도 망토와 같은 방식으로 근사한다.
     저장본에 hat 필드가 없어도(구버전) 기본값 'none'으로 정상 동작(하위호환).
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
    case 'snow': return [
      [cx-r+6,cy-r+12],[cx+r-10,cy-r+8],[cx-r+2,cy+14],
      [cx+r-4,cy+20],[cx-8,cy-r+2],[cx+10,cy+r-6]
    ].map(([x,y])=>snowflakeShape(x,y,6,'#aee4f7')).join('');
    case 'bolt': return [
      [cx-r+8,cy-r+16],[cx+r-12,cy-r+10],[cx-r+4,cy+18],
      [cx+r-8,cy+26],[cx+2,cy-r+4]
    ].map(([x,y])=>boltShape(x,y,1.7,'#f1c40f')).join('');
    case 'notes': return [
      [cx-r+8,cy-r+16],[cx+r-14,cy-r+12],[cx-r+2,cy+18],
      [cx+r-6,cy+10],[cx-2,cy+r-2]
    ].map(([x,y])=>noteShape(x,y,'#9b59b6')).join('');
    case 'crownpat': return [
      [cx-r+8,cy-r+14],[cx+r-10,cy-r+10],[cx-r+4,cy+16],
      [cx+r-6,cy+22],[cx,cy-r+2]
    ].map(([x,y])=>crownMotif(x,y,5.5,'#e6ac00')).join('');
    default: return '';
  }
}

/* ── 눈꽃(6방향 십자선) ── */
function snowflakeShape(cx,cy,r,fill){
  let lines='';
  for(let i=0;i<3;i++){
    const a=i*60*Math.PI/180;
    const x1=cx-r*Math.cos(a), y1=cy-r*Math.sin(a);
    const x2=cx+r*Math.cos(a), y2=cy+r*Math.sin(a);
    lines+=`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${fill}" stroke-width="1.4" stroke-linecap="round"/>`;
  }
  return `<g opacity=".9">${lines}</g>`;
}
/* ── 번개(지그재그 폴리곤) ── */
function boltShape(cx,cy,s,fill){
  return `<polygon points="${cx-1*s},${cy-6*s} ${cx+3*s},${cy-6*s} ${cx-0.5*s},${cy-0.5*s} ${cx+2.5*s},${cy-0.5*s} ${cx-2*s},${cy+6*s} ${cx},${cy+0.5*s} ${cx-3*s},${cy+0.5*s}Z" fill="${fill}"/>`;
}
/* ── 음표(타원 머리 + 세로줄기) ── */
function noteShape(cx,cy,fill){
  return `<g>
<ellipse cx="${cx}" cy="${cy+5}" rx="3.4" ry="2.6" fill="${fill}" transform="rotate(-18 ${cx} ${cy+5})"/>
<line x1="${cx+3.2}" y1="${cy+3.8}" x2="${cx+3.2}" y2="${cy-8}" stroke="${fill}" stroke-width="1.6" stroke-linecap="round"/>
<path d="M${cx+3.2},${cy-8} q4,0 4,4" fill="none" stroke="${fill}" stroke-width="1.6" stroke-linecap="round"/>
</g>`;
}
/* ── 왕관무늬(작은 왕관 실루엣) ── */
function crownMotif(cx,cy,r,fill){
  return `<polygon points="${cx-r},${cy+r*0.5} ${cx-r},${cy-r*0.2} ${cx-r*0.5},${cy+r*0.2} ${cx},${cy-r*0.6} ${cx+r*0.5},${cy+r*0.2} ${cx+r},${cy-r*0.2} ${cx+r},${cy+r*0.5}Z" fill="${fill}"/>`;
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

function darkerHsl(fg, factor){
  const [h,s,l] = hex2hsl(fg);
  return `hsl(${h.toFixed(0)},${Math.max(30,s).toFixed(0)}%,${Math.max(8,l*factor).toFixed(0)}%)`;
}
function lighterHsl(fg, target){
  const [h,s] = hex2hsl(fg);
  return `hsl(${h.toFixed(0)},${Math.max(20,s*.6).toFixed(0)}%,${target}%)`;
}

/* ── 망토 (viewBox 0 0 120 150, 캐릭터 뒤에 깔림 — 어깨선 y≈46 기준 보편 배치) ── */
function capeSVG(id, uid){
  if(!id || id==='none') return '';
  const av = window.NM_AVATAR;
  const item = av && av.capes && av.capes.find(x=>x.id===id);
  const cx=60, collarY=45, bottomY=132;
  const special = id==='rainbow' || id==='galaxy';   // 그라디언트 채움(hex 아님) — darkerHsl에 못 넣음
  let fill;
  if(id==='rainbow')      fill = `url(#nmcape_${uid})`;
  else if(id==='galaxy')  fill = `url(#nmgalcape_${uid})`;
  else                    fill = (item && item.fg) || '#2980b9';
  let defs = '';
  if(id==='rainbow'){
    defs = `<defs><linearGradient id="nmcape_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#e74c3c"/><stop offset="30%" stop-color="#f39c12"/>
<stop offset="55%" stop-color="#2ecc71"/><stop offset="80%" stop-color="#3498db"/>
<stop offset="100%" stop-color="#9b59b6"/></linearGradient></defs>`;
  } else if(id==='galaxy'){
    defs = `<defs><linearGradient id="nmgalcape_${uid}" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stop-color="#1b1140"/><stop offset="45%" stop-color="#4a2a82"/>
<stop offset="75%" stop-color="#9b3fa8"/><stop offset="100%" stop-color="#e85f9c"/></linearGradient></defs>`;
  }
  const strokeC = id==='rainbow' ? '#8e44ad' : id==='galaxy' ? '#2a1650' : darkerHsl(fill, 0.55);
  const foldC   = id==='rainbow' ? '#ffffff' : id==='galaxy' ? '#c9a0e0' : darkerHsl(fill, 0.42);
  /* 별무늬 망토·은하 망토에만 얹는 작은 별 장식(원본 도형) */
  let extraDeco = '';
  if(id==='starcape'){
    extraDeco = [[cx-9,collarY+20],[cx+13,collarY+36],[cx-5,collarY+62],[cx+9,collarY+84],[cx-11,collarY+96]]
      .map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.5" fill="#ffe066"/>`).join('');
  } else if(id==='galaxy'){
    extraDeco = [[cx-8,collarY+18],[cx+12,collarY+30],[cx-4,collarY+58],[cx+10,collarY+80]]
      .map(([x,y])=>`<circle cx="${x}" cy="${y}" r="1.6" fill="#fff" opacity=".85"/>`).join('');
  }
  return `${defs}
<path d="M${cx-16},${collarY} Q${cx},${collarY-7} ${cx+16},${collarY}
L${cx+38},${bottomY} Q${cx},${bottomY+9} ${cx-38},${bottomY} Z"
fill="${fill}" stroke="${strokeC}" stroke-width="2" opacity=".97"/>
<path d="M${cx-2},${collarY+4} L${cx-6},${bottomY-6} M${cx+4},${collarY+3} L${cx+10},${bottomY-8}"
stroke="${foldC}" stroke-width="2" opacity=".35" fill="none" stroke-linecap="round"/>
<path d="M${cx-16},${collarY} Q${cx},${collarY-7} ${cx+16},${collarY} L${cx+11},${collarY+9} Q${cx},${collarY+3} ${cx-11},${collarY+9} Z" fill="${foldC}" opacity=".55"/>
${extraDeco}
<circle cx="${cx}" cy="${collarY+1}" r="4" fill="#ffe000" stroke="#c8960a" stroke-width="1"/>`;
}

/* ── 모자 (viewBox 0 0 120 150, 캐릭터 정수리 위치 근사 — 망토와 같은 방식으로
   숫자별 실제 머리 위치 차이는 무시하고 전 캐릭터 공통 앵커 사용) ── */
function hatSVG(id){
  const cx=60, topY=20;
  switch(id){
    case 'party': return `<g>
<polygon points="${cx-16},${topY+6} ${cx+16},${topY+6} ${cx},${topY-26}" fill="#f39c12" stroke="#c9760a" stroke-width="1.5" stroke-linejoin="round"/>
<circle cx="${cx}" cy="${topY-27}" r="4" fill="#fff" stroke="#e0a020" stroke-width="1"/>
<polygon points="${cx-13},${topY} ${cx-2},${topY-9} ${cx-11},${topY+4}" fill="#fff" opacity=".55"/>
<circle cx="${cx-6}" cy="${topY-7}" r="2" fill="#fff" opacity=".8"/>
<circle cx="${cx+4}" cy="${topY-15}" r="2" fill="#fff" opacity=".8"/>
</g>`;
    case 'ribbon': return `<g>
<path d="M${cx-2},${topY-2} C${cx-16},${topY-12} ${cx-16},${topY+8} ${cx-2},${topY+2}
C${cx-16},${topY-2} ${cx-16},${topY-2} ${cx-2},${topY-2}Z" fill="#e91e8c" stroke="#b3106a" stroke-width="1.2"/>
<path d="M${cx+2},${topY-2} C${cx+16},${topY-12} ${cx+16},${topY+8} ${cx+2},${topY+2}
C${cx+16},${topY-2} ${cx+16},${topY-2} ${cx+2},${topY-2}Z" fill="#e91e8c" stroke="#b3106a" stroke-width="1.2"/>
<circle cx="${cx}" cy="${topY}" r="3.4" fill="#ff6bb0" stroke="#b3106a" stroke-width="1"/>
</g>`;
    case 'wizard': return `<g>
<path d="M${cx-15},${topY+6} Q${cx-5},${topY-30} ${cx+11},${topY-25} Q${cx+2},${topY-8} ${cx+15},${topY+6} Z"
fill="#5b3aa5" stroke="#3c2470" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M${cx-15},${topY} Q${cx},${topY-6} ${cx+15},${topY} L${cx+17},${topY+6} Q${cx},${topY+2} ${cx-17},${topY+6} Z" fill="#7c52c9"/>
${star5(cx+10,topY-25,4.4,1.8,'#ffe066')}
</g>`;
    case 'crown': return `<g>
<polygon points="${cx-18},${topY+6} ${cx-18},${topY-4} ${cx-9},${topY+4} ${cx},${topY-10} ${cx+9},${topY+4} ${cx+18},${topY-4} ${cx+18},${topY+6}"
fill="#ffd93b" stroke="#c9960a" stroke-width="1.5" stroke-linejoin="round"/>
<circle cx="${cx-18}" cy="${topY-4}" r="2.4" fill="#e74c3c"/>
<circle cx="${cx}" cy="${topY-10}" r="2.8" fill="#8e44ad"/>
<circle cx="${cx+18}" cy="${topY-4}" r="2.4" fill="#2980b9"/>
</g>`;
    case 'laurel': return `<g fill="none" stroke="#4caf50" stroke-width="2" stroke-linecap="round">
<path d="M${cx-17},${topY+5} Q${cx-21},${topY-6} ${cx-10},${topY-15}"/>
<path d="M${cx+17},${topY+5} Q${cx+21},${topY-6} ${cx+10},${topY-15}"/>
${[0,1,2].map(i=>`<ellipse cx="${(cx-15+i*2).toFixed(1)}" cy="${(topY-1-i*4).toFixed(1)}" rx="3" ry="1.6" fill="#66bb6a" stroke="none" transform="rotate(${-40+i*8} ${(cx-15+i*2).toFixed(1)} ${(topY-1-i*4).toFixed(1)})"/>`).join('')}
${[0,1,2].map(i=>`<ellipse cx="${(cx+15-i*2).toFixed(1)}" cy="${(topY-1-i*4).toFixed(1)}" rx="3" ry="1.6" fill="#66bb6a" stroke="none" transform="rotate(${40-i*8} ${(cx+15-i*2).toFixed(1)} ${(topY-1-i*4).toFixed(1)})"/>`).join('')}
</g>`;
    default: return '';
  }
}

/* ── 메인 렌더 ── */
window.renderNumiChar = function(char, size){
  char = char || {};
  const num     = char.number != null ? +char.number : 3;
  const colorId = char.color  || 'blue';
  const bgId    = char.bg     || 'plain';
  const capeId  = char.cape   || 'none';
  const hatId   = char.hat    || 'none';  // 기존 저장본엔 hat 필드가 없어도 기본값 'none'으로 동작(하위호환)
  size = size || 120;

  const fg = getCol(colorId).fg;
  const uid = 'nm'+(++UID);
  const ph = Math.round(size * 1.25);
  const tint = tintFilter(fg);
  const shadow = `drop-shadow(0 ${Math.max(2,size*.025)}px ${Math.max(3,size*.05)}px rgba(0,0,0,.22))`;

  // 오라: 캐릭터 뒤 은은한 글로우 (선택한 색) — 무지개오라(aurora)만 단색 대신
  // conic-gradient 무지개 링으로 특수 처리
  const aura = colorId==='aurora'
    ? `<span style="position:absolute;left:50%;top:54%;transform:translate(-50%,-50%);
width:96%;height:82%;border-radius:50%;
background:conic-gradient(from 0deg,#ff6b6b55,#ffd93b55,#6bcf7f55,#4fc3f755,#b388ff55,#ff6b9d55,#ff6b6b55);
filter:blur(2px);pointer-events:none"></span>`
    : `<span style="position:absolute;left:50%;top:54%;transform:translate(-50%,-50%);
width:92%;height:78%;border-radius:50%;
background:radial-gradient(closest-side,${fg}45,${fg}00 95%);pointer-events:none"></span>`;

  const decor = bgDecor(bgId, uid);
  const decorSvg = decor
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150" preserveAspectRatio="xMidYMid meet"
style="position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none">${decor}</svg>`
    : '';

  const cape = capeSVG(capeId, uid);
  const capeSvg = cape
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150" preserveAspectRatio="xMidYMid meet"
style="position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none">${cape}</svg>`
    : '';

  const hat = hatSVG(hatId);
  const hatSvg = hat
    ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150" preserveAspectRatio="xMidYMid meet"
style="position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible;pointer-events:none">${hat}</svg>`
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
${aura}${decorSvg}${capeSvg}${figure}${hatSvg}
</span>`;
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.renderNumiChar;
})();
