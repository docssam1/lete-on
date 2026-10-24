/* Numbers of Magic — 숫자 캐릭터 렌더러 (실제 캐릭터 아트 기반)
   window.renderNumiChar(char, size) → HTML 문자열 (layered)
   char = {number:0-99, color:'blue', bg:'plain', cape:'none', hat:'none'}
   size = 픽셀 너비 (기본 120, 높이 = size×1.25)

   + window.renderHumanChar(kind, size) / window.renderPartyHtml(avatarKind, char, size)
     — 사람 아바타(아이 boy/girl, 마을 NPC elder/doc) + 동행 캐릭터 합성 렌더.
     마을세계관-설계.md §1 "사람 아바타 + 동행" 참고.

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

/* 숫자 → 이미지 파일 (한 자리, 0~10). 이 중 표정 파일(-happy/-think)이 있는 것은
   IMG_HAS_MOOD의 세 캐릭터뿐(학습무대-작화지시서.md §3) — 나머지 num-N.png는
   표정 파일이 없으므로 mood가 와도 기본 그림을 그대로 쓴다. */
const IMG_FILE = {0:'numi-0.png', 3:'poco-3.png', 8:'momo-8.png'};
const IMG_HAS_MOOD = {0:true, 3:true, 8:true};
function digitImgSrc(n, mood){
  const base = window.NM_CHAR_BASE || 'assets/characters/';
  const file = IMG_FILE[n] || ('num-'+n+'.png');
  if(mood && IMG_HAS_MOOD[n]) return base + file.replace(/\.png$/,'') + '-' + mood + '.png';
  return base + file;
}
/* 기호 → PNG 경로(캐릭터-승급-설계.md §0 수정사항: PNG 우선, 없으면 SVG 폴백).
   파일 존재를 미리 확인(HEAD 등)하지 않고 <img onerror>로만 판별 — 없으면
   조용히 숨어서 밑에 항상 그려둔 SVG가 그대로 보인다. 콘솔 404는 허용. */
function symbolImgSrc(id){
  const base = window.NM_CHAR_BASE || 'assets/characters/';
  return base + 'sym-' + id + '.png';
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
  const extra=cosmeticSVG('bg',id,uid); if(extra)return extra;
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
  // <polygon points="..."> auto-closes the shape — a trailing "Z" (path-only syntax)
  // here made the whole points list invalid, so the bolt silently failed to render.
  return `<polygon points="${cx-1*s},${cy-6*s} ${cx+3*s},${cy-6*s} ${cx-0.5*s},${cy-0.5*s} ${cx+2.5*s},${cy-0.5*s} ${cx-2*s},${cy+6*s} ${cx},${cy+0.5*s} ${cx-3*s},${cy+0.5*s}" fill="${fill}"/>`;
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
  // Same fix as boltShape() above — a stray trailing "Z" broke the points list.
  return `<polygon points="${cx-r},${cy+r*0.5} ${cx-r},${cy-r*0.2} ${cx-r*0.5},${cy+r*0.2} ${cx},${cy-r*0.6} ${cx+r*0.5},${cy+r*0.2} ${cx+r},${cy-r*0.2} ${cx+r},${cy+r*0.5}" fill="${fill}"/>`;
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
  const extra=cosmeticSVG('cape',id,uid); if(extra)return extra;
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
  const extra=cosmeticSVG('hat',id,'hat'+(++UID)); if(extra)return extra;
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

/* New original cosmetics share the same layered-SVG anchors as the approved art.
   Geometry is drawn locally, never downloaded or copied from another game's assets. */
function cosmeticSVG(type,id,uid){
  const C=window.NM_COSMETICS, it=C&&C.item(type,id); if(!it)return '';
  const a=it.art, b=a.base, t=a.trim, h=a.accent;
  const path=(d,fill=b,stroke=t,w=1.5)=>`<path d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"/>`;
  const line=(d,color=t,w=1.6)=>path(d,'none',color,w);
  const circle=(x,y,r,fill=h,stroke=t,w=1)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${w}"/>`;
  const ellipse=(x,y,rx,ry,fill=b,stroke=t)=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" stroke="${stroke}" stroke-width="1.4"/>`;
  const polygon=(p,fill=b,stroke=t)=>`<polygon points="${p}" fill="${fill}" stroke="${stroke}" stroke-width="1.4" stroke-linejoin="round"/>`;
  const leaf=(x,y,s=1,rot=0)=>`<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})">${path('M0 0 Q-9 -13 0 -20 Q10 -10 0 0',b,t,1)}${line('M0 -2 L0 -16',t,1)}</g>`;
  const diamond=(x,y,r,fill=h)=>polygon(`${x},${y-r} ${x+r*.6},${y} ${x},${y+r} ${x-r*.6},${y}`,fill,t);
  let s='';
  if(type==='hat')switch(a.shape){
    case 'explorer-brim':
      s=ellipse(60,29,28,6)+path('M40 27 L43 11 Q60 4 75 12 L79 27 Z')+line('M43 24 Q60 18 77 24',h,3)+path('M75 19 Q73 5 89 2 Q87 14 75 19',h,t)+line('M76 18 L87 4');break;
    case 'scholar-beret':
      s=path('M32 20 Q37 6 61 7 Q84 5 88 18 Q75 28 39 27 Z')+path('M40 25 Q60 28 77 24 L76 30 Q60 33 41 30 Z',t,b)+line('M60 8 L63 3',b,4)+star5(73,20,5,2.2,h);break;
    case 'library-cap':
      s=path('M43 24 L43 33 Q59 40 77 32 L77 23 Z')+polygon('29,18 60,5 92,18 60,31',b,t)+line('M61 18 L85 22 L86 37',h,2)+path('M82 36 L90 36 L90 45 L86 41 L82 45 Z',h,t)+line('M42 17 L59 10 L77 17',h,1);break;
    case 'sky-goggles':
      s=path('M35 34 L35 20 Q37 5 59 5 Q83 6 85 23 L85 40 L75 42 L73 27 L45 27 L43 42 L34 39 Z')+line('M38 23 L82 23',t,5)+circle(49,22,9,h)+circle(71,22,9,h)+line('M57 22 L63 22',t,3)+line('M44 19 L49 16 M66 19 L71 16','#fff6df',1.3);break;
    case 'leaf-wreath':
      s=line('M34 32 Q27 12 48 6 M86 32 Q93 12 72 6',t,3)+[0,1,2,3].map(i=>leaf(35+i*3,28-i*6,.55,-55)+leaf(85-i*3,28-i*6,.55,55)).join('')+line('M51 32 Q60 36 69 32',h,2);break;
    case 'flower-circlet':
      s=line('M31 28 Q60 12 89 28',t,4)+[0,1,2,3,4].map(i=>{const x=34+i*13,y=24-Math.sin(i*Math.PI/4)*7;return `<g>`+[0,1,2,3,4].map(k=>`<ellipse cx="${x}" cy="${y-4}" rx="3" ry="5" fill="${i%2?h:b}" transform="rotate(${k*72} ${x} ${y})"/>`).join('')+circle(x,y,2.5,t,t)+`</g>`;}).join('');break;
    case 'moon-tiara':
      s=path('M32 30 Q60 17 88 30 L84 34 Q60 25 36 34 Z',t,b)+path('M65 1 A14 14 0 1 0 72 24 A12 12 0 0 1 65 1',h,t)+diamond(39,24,4)+diamond(81,24,4)+circle(60,32,3,b,t);break;
    case 'crystal-diadem':
      s=path('M31 30 L89 30 L84 36 L36 36 Z',t,b)+[[-24,17],[-12,8],[0,0],[12,8],[24,17]].map(([x,y])=>polygon(`${60+x-5},30 ${60+x-5},${y+7} ${60+x},${y} ${60+x+5},${y+7} ${60+x+5},30`,x===0?h:b,t)+line(`M${60+x} ${y+2} L${60+x} 29`,h,1)).join('');break;
    case 'compass-tricorne':
      s=path('M30 30 Q42 16 59 3 Q72 17 91 30 Q70 25 59 37 Q47 26 30 30 Z')+line('M35 28 Q46 26 58 10 M64 12 Q74 25 85 28',h,2)+circle(60,26,7,t,b)+polygon('60,20 62,26 60,32 58,26',b,h);break;
    case 'fox-hood':
      s=path('M31 40 L31 12 L43 3 L53 15 Q60 11 67 15 L78 3 L89 14 L89 41 L79 35 Q60 22 41 35 Z')+polygon('35,17 42,8 48,19',h,t)+polygon('72,19 79,8 85,18',h,t)+line('M35 39 Q60 21 85 39',h,4);break;
    case 'sprout-cap':
      s=path('M34 31 Q35 11 60 11 Q85 11 86 31 Q60 39 34 31 Z')+line('M60 13 Q58 5 61 1',t,2.3)+leaf(60,10,.6,-50)+leaf(61,10,.7,50)+line('M40 28 Q60 34 80 28',h,2);break;
    case 'winter-knit':
      s=path('M36 28 Q37 7 59 7 Q82 7 84 28 Z')+path('M32 26 Q60 22 88 26 L86 36 Q60 32 34 36 Z',t,b)+circle(60,5,6,h,t)+[0,1,2,3,4,5,6].map(i=>line(`M${38+i*7} 27 L${38+i*7} 33`,b,1.2)).join('')+line('M44 17 L49 13 L54 17 L59 13 L64 17 L69 13 L74 17',h,1.3);break;
    case 'quill-band':
      s=path('M30 29 Q60 19 90 29 L88 35 Q60 26 32 35 Z')+path('M77 27 Q76 8 96 1 Q95 18 77 27',h,t)+line('M76 30 L94 4',t,1.3)+line('M82 19 L89 18 M85 13 L92 12',b,1)+circle(78,28,3,t,b);break;
    case 'sailor-cap':
      s=path('M32 21 Q35 9 60 9 Q85 9 88 21 L79 28 L41 28 Z')+path('M36 22 Q60 27 84 22 L83 33 Q60 38 37 33 Z',h,t)+line('M51 29 Q55 23 60 29 Q65 35 69 29 Q64 23 59 29 Q55 35 51 29',t,2)+line('M59 29 L55 38 M62 29 L66 38',t,1.5);break;
    case 'astral-turban':
      s=path('M31 32 Q29 7 60 5 Q89 6 89 32 Q60 42 31 32 Z')+path('M34 14 Q58 17 82 34 L70 37 Q49 24 33 23 Z',t,b)+line('M49 7 Q71 20 84 30 M35 29 Q49 25 72 10',h,2)+diamond(60,28,7,h);break;
    case 'mushroom-cap':
      s=path('M26 29 Q28 2 60 1 Q92 3 95 29 Z')+ellipse(60,29,34,7,h,t)+[35,44,53,62,71,80,89].map(x=>line(`M60 34 L${x} 26`,t,.9)).join('')+circle(44,16,5,h,h)+circle(66,10,5,h,h)+circle(80,20,4,h,h)+circle(58,23,3,h,h);break;
    case 'clockwork-top':
      s=ellipse(60,32,30,6)+path('M40 29 L37 3 L79 3 L81 29 Z')+path('M40 20 L80 20 L81 27 L40 27 Z',t,b)+circle(76,19,8,h,b)+[0,1,2,3,4,5,6,7].map(k=>{const a=k*Math.PI/4;return line(`M${76+6*Math.cos(a)} ${19+6*Math.sin(a)} L${76+10*Math.cos(a)} ${19+10*Math.sin(a)}`,t,3);}).join('')+circle(76,19,3,b,t)+line('M84 7 L93 3 L96 9 M89 5 L93 13',t,3);break;
    case 'observatory-dome':
      s=path('M29 30 Q31 7 59 7 Q87 7 90 30 Z')+line('M60 8 L60 29 M39 14 Q51 21 43 29 M78 14 Q68 21 76 29',h,1)+path('M27 29 L93 29 L93 35 L27 35 Z',t,b)+path('M62 14 L79 2 L84 10 L67 21 Z',h,t)+ellipse(82,5,5,3,b,t)+star5(38,21,3.5,1.5,h);break;
  }
  if(type==='cape'){
    const full='M43 46 Q60 38 77 46 L105 133 Q60 144 15 133 Z';
    const clasp=()=>circle(60,47,4,h,t);
    switch(a.shape){
      case 'traveler-short':s=path('M41 45 Q60 38 79 45 L98 104 Q60 121 22 104 Z')+path('M25 83 L42 82 L41 98 Q32 102 26 96 Z',t,b)+line('M44 51 L33 108 M76 51 L87 108',h,1)+clasp();break;
      case 'silk-scarf':s=path('M38 45 Q60 38 82 45 L77 58 L46 56 L30 132 L15 123 L28 53 Z')+path('M72 52 L87 58 L106 119 L90 133 L78 73 Z',t,b)+line('M19 121 L27 127 M21 116 L30 123 M91 123 L101 116',h,1.5)+clasp();break;
      case 'leaf-cut':s=path('M59 43 Q86 45 99 68 L91 77 L104 87 L91 96 L98 109 L82 115 L81 132 L60 141 L39 131 L38 116 L22 108 L30 95 L17 86 L29 75 L22 66 Q37 47 59 43 Z')+line('M60 49 L60 133 M60 70 L32 63 M60 89 L25 84 M60 108 L30 106 M60 123 L42 125 M60 71 L88 63 M60 90 L94 84 M60 108 L89 105 M60 122 L79 125',t,1.5)+clasp();break;
      case 'feathered':s=path(full)+[0,1,2].map(row=>[0,1,2,3,4].map(i=>path(`M${25+i*14+row*3} ${57+row*24} Q${18+i*14+row*3} ${81+row*20} ${28+i*14+row*3} ${93+row*17} Q${40+i*14+row*2} ${76+row*20} ${25+i*14+row*3} ${57+row*24}`,row%2?t:b,h,1)).join('')).join('')+clasp();break;
      case 'tidal-collar':s=path('M42 44 L78 44 L105 129 Q95 142 84 131 Q72 142 60 131 Q48 142 36 131 Q25 142 15 129 Z')+path('M35 48 Q33 26 49 43 Q60 21 70 43 Q87 27 85 49 Q60 62 35 48 Z',h,t)+[0,1,2].map(i=>line(`M${24+i*2} ${102+i*10} Q42 ${92+i*10} 60 ${103+i*10} Q79 ${114+i*10} ${96-i*2} ${103+i*10}`,t,1.7)).join('')+clasp();break;
      case 'geometric-trim':s=path('M40 45 L80 45 L104 135 L16 135 Z')+polygon('16,135 27,119 32,135 43,119 49,135 60,119 66,135 77,119 83,135 94,119 104,135',t,h)+line('M38 53 L22 124 M82 53 L98 124',h,2)+clasp();break;
      case 'comet-tail':s=path('M42 45 Q61 38 78 45 L105 141 L69 117 L48 130 L17 111 Z')+line('M78 70 Q83 105 99 132 M70 72 Q72 102 88 124',t,2)+star5(78,79,7,3,h)+line('M74 85 L49 111 M79 88 L66 109',h,2)+clasp();break;
      case 'fern-embroidered':s=path(full)+[31,88].map((x,i)=>line(`M${x} 127 Q${x+(i?-15:15)} 87 ${x+(i?-10:10)} 56`,t,1.7)+[0,1,2,3,4].map(k=>leaf(x+(i?-1:1)*(k+2),122-k*12,.35,i?50:-50)+leaf(x+(i?-1:1)*(k+3),116-k*12,.35,i?-35:35)).join('')).join('')+clasp();break;
      case 'paper-fold':s=polygon('42,44 78,44 105,118 89,140 60,127 31,140 15,118')+polygon('42,44 60,75 15,118',h,t)+polygon('78,44 60,75 105,118',t,b)+polygon('15,118 60,75 31,140',t,b)+polygon('105,118 60,75 89,140',h,t)+line('M60 75 L60 126',b,2)+clasp();break;
      case 'sunburst':s=path('M43 45 Q60 38 77 45 L108 121 Q60 153 12 121 Z')+[0,1,2,3,4,5,6].map(i=>line(`M60 49 L${17+i*14} ${125+Math.sin(i*Math.PI/6)*12}`,t,2)).join('')+circle(60,49,8,h,t)+[0,1,2,3,4,5,6,7].map(i=>{const q=i*Math.PI/4;return line(`M${60+9*Math.cos(q)} ${49+9*Math.sin(q)} L${60+13*Math.cos(q)} ${49+13*Math.sin(q)}`,h,1.4);}).join('');break;
      case 'checker-weave':{const clip='nmweave_'+uid;s=`<defs><clipPath id="${clip}">${path(full)}</clipPath></defs>`+path(full)+`<g clip-path="url(#${clip})">`+[0,1,2,3,4,5,6].map(y=>[0,1,2,3,4,5,6].filter(x=>(x+y)%2===0).map(x=>`<rect x="${11+x*15}" y="${44+y*15}" width="15" height="15" fill="${t}" opacity=".58"/>`).join('')).join('')+`</g>`+[0,1,2,3,4,5,6,7,8].map(i=>line(`M${20+i*10} 134 L${18+i*10} 143`,h,2)).join('')+clasp();break;}
      case 'butterfly-split':s=path('M55 45 Q27 42 15 74 Q7 99 38 97 Q15 125 38 140 Q58 129 60 68 Q64 129 82 140 Q105 125 82 97 Q113 99 105 74 Q94 42 65 45 Z')+line('M57 53 Q31 58 23 79 Q44 74 53 67 M63 53 Q89 58 97 79 Q76 74 67 67 M53 87 Q35 116 40 128 M67 87 Q85 116 80 128',h,2)+clasp();break;
      case 'constellation':s=path('M42 45 Q60 38 78 45 L103 134 L72 129 L60 140 L49 129 L17 134 Z')+line('M26 111 L37 81 L42 60 M29 115 L49 125 M78 61 L87 86 L95 113 L75 125',t,1.5)+[[26,111],[37,81],[42,60],[49,125],[78,61],[87,86],[95,113],[75,125]].map(([x,y])=>star5(x,y,3,1.3,h)).join('')+clasp();break;
      case 'aurora-fan':s=path('M42 45 Q60 37 78 45 L107 128 Q60 154 13 128 Z')+path('M42 46 L78 46 L98 111 Q60 134 22 111 Z',t,b)+path('M42 45 Q60 38 78 45 L89 91 Q60 112 31 91 Z',h,t)+line('M35 99 Q60 112 85 99 M25 119 Q60 138 95 119',h,2)+clasp();break;
      case 'atlas-scroll':s=path('M39 45 L81 45 L95 132 Q105 139 103 123 L92 55 L99 55 Q101 40 82 42 L38 42 Q18 40 20 55 L28 55 L17 123 Q15 141 27 133 L93 133 Z')+line('M32 59 L27 121 M88 59 L93 121',t,1.5)+line('M25 112 Q32 104 30 94 Q26 81 40 74 M79 67 Q92 74 84 86 Q79 99 94 109',t,1.6)+circle(28,111,3,h,t)+star5(87,78,4,1.7,t)+line('M36 128 L46 128 M73 128 L83 128',t,1)+clasp();break;
    }
  }
  if(type==='bg')switch(a.shape){
    case 'moon-orbit':s=path('M31 12 A17 17 0 1 0 43 39 A14 14 0 0 1 31 12',b,t)+ellipse(60,77,52,59,'none',t)+circle(109,57,4,b,t)+circle(19,112,3,h,t)+circle(88,25,2,h,t);break;
    case 'constellation-map':s=line('M12 46 L26 20 L45 32 L62 9 L93 27 L109 58 M13 106 L30 123 L12 141 M98 108 L109 131 L88 143',b,1.3)+[[12,46],[26,20],[45,32],[62,9],[93,27],[109,58],[13,106],[30,123],[12,141],[98,108],[109,131],[88,143]].map(([x,y],i)=>star5(x,y,i%3===0?5:3.3,1.6,t)).join('');break;
    case 'book-arch':s=[[-43,-25],[-28,-50],[10,-51],[30,-29]].map(([x,y],i)=>`<g transform="translate(${60+x} ${77+y}) rotate(${i*27-42})">${path('M-12 -12 Q-6 -16 0 -12 Q6 -16 12 -12 L12 12 Q6 8 0 12 Q-6 8 -12 12 Z',h,b)}${line('M0 -12 L0 12',t,1)}${line('M-8 -5 L-3 -5 M3 -5 L8 -5 M-8 1 L-3 1 M3 1 L8 1',t,.8)}</g>`).join('')+line('M13 76 Q7 111 26 138 M107 76 Q113 111 94 138',t,2);break;
    case 'compass-rose':s=circle(60,77,54,'none',t)+[0,1,2,3,4,5,6,7].map(i=>`<g transform="rotate(${i*45} 60 77)">${polygon('60,17 66,57 60,49 54,57',i%2?b:h,t)}</g>`).join('')+circle(60,77,42,'none',b);break;
    case 'firefly-garden':s=line('M10 137 Q13 116 20 103 M20 139 Q24 122 34 116 M110 137 Q104 114 99 102 M102 141 Q94 125 86 119',b,2)+[[12,88],[26,59],[16,32],[99,25],[109,53],[105,90],[87,12]].map(([x,y])=>circle(x,y,5,h,'none')+circle(x,y,1.7,t,'none')).join('');break;
    case 'leaf-spiral':s=line('M15 120 C-2 60 21 4 64 9 C108 13 130 54 106 100 Q93 127 87 140',t,1.5)+[[14,111,-40],[13,80,-90],[19,47,-115],[37,20,-145],[72,13,90],[99,35,130],[110,67,170],[101,105,30],[91,130,15]].map(([x,y,r])=>leaf(x,y,.6,r)).join('');break;
    case 'planet-rings':s=`<g transform="rotate(-24 60 76)">${ellipse(60,76,56,41,'none',b)}</g><g transform="rotate(28 60 76)">${ellipse(60,76,53,60,'none',t)}</g>`+circle(19,40,10,b,t)+line('M7 43 L30 34',h,3)+circle(100,109,8,h,t)+circle(87,14,5,t,b);break;
    case 'cloud-window':s=path('M23 134 Q-3 132 10 110 Q-7 91 10 77 Q-4 57 13 44 Q5 20 30 18 Q40 -1 60 12 Q79 -1 91 19 Q116 15 111 42 Q129 56 110 76 Q129 94 111 110 Q124 135 97 137 Z','none',b,3)+line('M18 48 Q20 26 41 28 M85 23 Q104 28 103 45',h,2);break;
    case 'crystal-cluster':s=[[13,98,25],[24,109,37],[101,104,34],[111,120,29],[8,133,20],[96,142,23]].map(([x,y,r])=>polygon(`${x},${y-r} ${x+6},${y-r+10} ${x+7},${y} ${x-6},${y} ${x-5},${y-r+10}`,b,t)+line(`M${x} ${y-r+2} L${x} ${y-1}`,h,1)).join('')+diamond(21,25,8)+diamond(96,31,7);break;
    case 'prism-fan':s=[0,1,2,3,4,5,6].map(i=>`<g transform="rotate(${i*24-72} 60 137)">${polygon('55,137 45,14 60,3 75,14 65,137',i%3===0?b:i%3===1?t:h,t)}</g>`).join('');break;
    case 'sundial-ring':s=circle(60,76,55,'none',b)+circle(60,76,48,'none',t)+[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>`<g transform="rotate(${i*30} 60 76)">${line('M60 21 L60 28',b,2)}</g>`).join('')+polygon('60,75 99,112 74,84',b,t)+circle(60,15,7,h,t);break;
    case 'geometric-bloom':s=[0,1,2,3,4,5,6,7].map(i=>`<g transform="rotate(${i*45} 60 77)">${ellipse(60,26,12,20,i%2?b:t,h)}${polygon('54,29 60,7 66,29',h,b)}</g>`).join('')+circle(60,77,49,'none',t);break;
    case 'ink-ripples':s=[0,1,2,3].map(i=>ellipse(60,126-i*2,52-i*10,15-i*2,'none',i%2?b:t)).join('')+path('M16 77 Q7 63 16 49 Q25 64 16 77',b,t)+path('M104 52 Q94 39 104 24 Q113 40 104 52',b,t)+circle(17,91,3,t,t)+circle(101,64,2,t,t);break;
    case 'floating-scrolls':s=[[-44,-26,-12],[40,-44,14],[-41,39,12],[42,40,-9]].map(([x,y,r])=>`<g transform="translate(${60+x} ${77+y}) rotate(${r})">${path('M-10 -18 L10 -18 L10 16 Q17 23 17 12 L-6 12 Q-16 12 -10 22 L-10 -18 Q-16 -25 -17 -15 L10 -15',h,b)}${line('M-6 -8 L6 -8 M-6 -2 L6 -2 M-6 4 L2 4',t,1)}</g>`).join('');break;
    case 'lantern-halo':s=ellipse(60,78,51,61,'none',t)+[0,1,2,3,4,5,6,7].map(i=>{const q=i*Math.PI/4,x=60+50*Math.sin(q),y=78-59*Math.cos(q);return line(`M${x} ${y-9} L${x} ${y-5}`,b,1)+path(`M${x-5} ${y-5} Q${x} ${y-10} ${x+5} ${y-5} L${x+5} ${y+7} Q${x} ${y+12} ${x-5} ${y+7} Z`,h,t)+line(`M${x} ${y-4} L${x} ${y+6}`,t,1);}).join('');break;
    case 'snow-peaks':s=polygon('0,134 21,57 39,98 63,12 88,93 105,52 120,134',b,t)+polygon('12,88 21,57 30,82 24,79 20,88',h,t)+polygon('49,52 63,12 76,55 66,47 61,58 56,45',h,t)+polygon('98,78 105,52 113,83 106,75 103,82',h,t);break;
    case 'observatory-chart':s=circle(60,77,56,'none',b)+circle(60,77,47,'none',t)+`<g transform="rotate(25 60 77)">${ellipse(60,77,56,23,'none',t)}</g><g transform="rotate(-25 60 77)">${ellipse(60,77,56,35,'none',b)}</g>`+[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map(i=>`<g transform="rotate(${i*22.5} 60 77)">${line('M60 21 L60 25',t,1)}</g>`).join('')+[[16,49],[38,24],[83,29],[106,96],[87,127],[15,111]].map(([x,y])=>star5(x,y,4,1.7,h)).join('');break;
    case 'portal-rings':s=path('M12 137 L12 57 Q12 6 60 6 Q108 6 108 57 L108 137 Z','none',b,4)+path('M21 137 L21 58 Q21 17 60 17 Q99 17 99 58 L99 137','none',t,2)+[[17,70],[17,105],[103,70],[103,105]].map(([x,y],i)=>i%2?diamond(x,y,5,h):circle(x,y,4,h,b)).join('')+polygon('51,11 60,0 69,11 60,22',h,b)+line('M30 138 L91 138',t,3);break;
  }
  if(type==='bg'&&s){
    const bgid='nmbg_'+uid,seed=[...id].reduce((sum,c)=>sum+c.charCodeAt(0),0);
    const scenePalettes=[['#24365e','#9369a6'],['#1b315c','#546ba4'],['#5d3155','#b2819a'],['#253f4f','#a17845'],['#1a5242','#6b9471'],['#2e573b','#8aa75c'],['#342453','#ab7f9f'],['#447a99','#b9d4e6'],['#28616b','#9eb5e4'],['#4d3173','#d5a7cb'],['#694334','#d9a769'],['#615079','#d6a1aa'],['#33495f','#6aa5af'],['#705544','#e2c697'],['#634c71','#e1ad5c'],['#365873','#b5c5d6'],['#27304c','#8f87bb'],['#402b6a','#b47ba6']];
    const sceneIndex=C.groups.bg.findIndex(item=>item.id===id),sceneColors=scenePalettes[sceneIndex]||[b,t];
    const stars=Array.from({length:12},(_,i)=>{const x=9+(seed+i*37)%102,y=13+(seed*3+i*29)%119,r=i%3===0?2.2:1;
      return i%3===0?`<path d="M${x-r} ${y} L${x} ${y-r*2} L${x+r} ${y} L${x} ${y+r*2} Z" fill="${h}" opacity=".8"/>`:`<circle cx="${x}" cy="${y}" r="${r}" fill="${h}" opacity=".7"/>`;}).join('');
    const scene=`<defs><linearGradient id="${bgid}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${sceneColors[0]}"/><stop offset=".5" stop-color="${sceneColors[1]}"/><stop offset="1" stop-color="${sceneColors[0]}"/></linearGradient><radialGradient id="${bgid}_light"><stop stop-color="${h}" stop-opacity=".85"/><stop offset="1" stop-color="${h}" stop-opacity="0"/></radialGradient></defs>
      <path d="M7 140 L7 58 Q7 7 60 7 Q113 7 113 58 L113 140 Q60 151 7 140 Z" fill="url(#${bgid})" opacity=".94" stroke="${t}" stroke-width="1.2"/>
      <ellipse cx="60" cy="65" rx="51" ry="55" fill="url(#${bgid}_light)"/>
      <path d="M15 134 V58 Q15 17 60 17 Q105 17 105 58 V134" fill="none" stroke="${h}" stroke-width=".8" opacity=".62"/>
      <path d="M13 128 Q60 109 107 128 M13 135 Q60 116 107 135" fill="none" stroke="${h}" opacity=".6"/>
      <g opacity=".2" fill="${h}"><path d="M60 80 L13 35 L37 12 Z"/><path d="M60 80 L78 11 L109 37 Z"/></g>${stars}`;
    s=scene+s;
  }
  return s?`<g data-nm-cosmetic="${type}:${id}" stroke-linecap="round" stroke-linejoin="round">${s}</g>`:'';
}

/* Isolated shop-card art for the extension catalog. Returning '' for a legacy ID
   lets callers retain the established full-character preview for approved items. */
window.renderCosmeticItem=function(type,id,size){
  const svg=cosmeticSVG(type,id,'item'+(++UID));if(!svg)return '';
  const view={hat:'20 0 80 48',cape:'10 35 100 112',bg:'0 0 120 150'}[type];
  if(!view)return '';
  const width=Math.max(32,Math.min(240,Number(size)||80)),height=Math.round(width*1.12);
  return `<span class="nm-cosmetic-art" data-nm-item-art="${type}:${id}" style="display:inline-flex;align-items:center;justify-content:center;width:${width}px;height:${height}px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" aria-hidden="true" style="width:100%;height:100%;overflow:visible">${svg}</svg></span>`;
};

/* ── 수학 기호 캐릭터 (SVG 폴백, 캐릭터-승급-설계.md §2 "그림 규격") ──
   viewBox 0 0 120 150, 캐릭터 중심 (60,78), 글리프 바깥 지름 약 62px.
   전부 원본 path/circle — 어떤 그림도 베끼지 않음. */
function symGlyphPath(id, fg){
  const sw = {plus:15, equal:15, minus:16, times:14, divide:13, sqrt:13, pi:14, sigma:13, infinity:11}[id] || 14;
  const common = `fill="none" stroke="${fg}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`;
  switch(id){
    case 'plus':     return `<path d="M60,47 L60,109 M29,78 L91,78" ${common}/>`;
    case 'equal':    return `<path d="M29,63 L91,63 M29,93 L91,93" ${common}/>`;
    case 'minus':    return `<path d="M27,78 L93,78" ${common}/>`;
    case 'times':    return `<path d="M36,54 L84,102 M84,54 L36,102" ${common}/>`;
    /* ÷ · % — 안의 동그라미·점이 눈으로 착각되지 않도록 눈 자리(y 59~73)를 비우고
       위·아래로 확실히 띄운다(기호캐릭터-작화지시서.md §2 "공통 함정"). */
    case 'divide':   return `<path d="M29,80 L91,80" ${common}/>
<circle cx="60" cy="46" r="7.5" fill="${fg}"/><circle cx="60" cy="102" r="7.5" fill="${fg}"/>`;
    case 'sqrt':     return `<path d="M27,86 L40,101 L55,50 L93,50" ${common}/>`;
    case 'percent':  return `<circle cx="31" cy="44" r="10.5" fill="none" stroke="${fg}" stroke-width="8"/>
<circle cx="91" cy="106" r="10.5" fill="none" stroke="${fg}" stroke-width="8"/>
<path d="M30,110 L92,46" fill="none" stroke="${fg}" stroke-width="10" stroke-linecap="round"/>`;
    case 'pi':       return `<path d="M32,54 L88,54 M46,54 L41,104 M74,54 L79,104" ${common}/>`;
    case 'sigma':    return `<path d="M86,52 L36,52 L68,78 L36,104 L86,104" ${common}/>`;
    case 'infinity': return `<path d="M24,86 C24,68 44,68 60,86 C76,104 96,104 96,86 C96,68 76,68 60,86 C44,104 24,104 24,86 Z" ${common}/>`;
    default:         return `<circle cx="60" cy="78" r="28" fill="none" stroke="${fg}" stroke-width="14"/>`;
  }
}
/* 표정은 전 기호 동일(흰자+검은 눈동자 · 작은 미소) — 12종 숫자 로스터 규칙과 같다. */
function symFace(id){
  /* ∞는 고리 구멍이 눈으로 읽히는 함정이 있어(작화지시서 §2) 눈을 고리 '위 획'에
     얹고 구멍은 비워 둔다. 나머지는 공통 위치. */
  const P={infinity:{ex1:38,ex2:82,ey:70}}[id];
  const ex1=P?P.ex1:47, ex2=P?P.ex2:73, ey=P?P.ey:66;
  return `<circle cx="${ex1}" cy="${ey}" r="7" fill="#fff"/><circle cx="${ex2}" cy="${ey}" r="7" fill="#fff"/>
<circle cx="${ex1+1}" cy="${ey+1}" r="3.2" fill="#1A2233"/><circle cx="${ex2+1}" cy="${ey+1}" r="3.2" fill="#1A2233"/>
<path d="M${ex1+5},${ey+14} Q60,${ey+20} ${ex2-5},${ey+14}" fill="none" stroke="#1A2233" stroke-width="2" stroke-linecap="round"/>`;
}
/* 짧은 둥근 팔다리 — 글리프 몸통(중심 60,78·지름≈62) 바깥쪽에 얹는다. */
function symLimbs(fg, id){
  const c = darkerHsl(fg, 0.8);
  /* 몸이 아래까지 내려오는 기호(÷ 아래 점 · % 아래 동그라미 · ∞ 아래 고리)는
     다리를 넓게 벌려 기호를 가리지 않게 한다 — 좁은 기본 자세면 겹쳐서
     아래 점·동그라미가 다리 사이에 묻힌다(육안 검토에서 잡은 결함). */
  const wide = (id==='divide'||id==='percent'||id==='infinity');
  const lx1=wide?38:48, lx2=wide?82:72, lex1=wide?32:44, lex2=wide?88:76;
  const ly=wide?112:106, ley=wide?127:123;
  return `<g fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round">
<path d="M32,90 L17,80"/><path d="M88,90 L103,80"/>
<path d="M${lx1},${ly} L${lex1},${ley}"/><path d="M${lx2},${ly} L${lex2},${ley}"/>
</g>`;
}
function symbolCharacterSVG(id, fg){
  /* 젤리 캐릭터(app/jelly-char.js)가 있으면 졸라맨식 도형 대신 그것을 쓴다. */
  const it = (window.NM_AVATAR && window.NM_AVATAR.symbols || []).find(s=>s.id===id);
  const J = window.NM_JELLY;
  if(J && it && J.has(it.glyph)) return `<g>${J.svg(it.glyph,{color:fg,inner:true})}</g>`;
  return `<g>${symLimbs(fg, id)}${symGlyphPath(id, fg)}${symFace(id)}</g>`;
}
/* PNG 우선(sym-<id>.png, 숫자 캐릭터와 같은 tintFilter 적용) · 없으면 <img onerror>로
   숨겨 밑에 항상 그려둔 SVG가 보이게(§0 수정사항 — HEAD 요청 아님). */
/* 기호 캐릭터 PNG는 **색 톤 필터(tint)를 씌우지 않는다.**
   숫자 캐릭터는 단색이라 hue-rotate로 재염색해도 되지만, 기호 마법단은 보라 모자·
   빨강 망토·금색 소품처럼 여러 색을 입고 있어서 필터를 걸면 옷과 소품이 전부
   한 색으로 뭉개진다(2026-09-01 납품 시안 검토). 선택한 색은 뒤쪽 오라로만 보인다.
   폴백 SVG는 원래대로 선택한 색(fg)을 쓴다. */
function symbolFigure(id, fg, tint, shadow){
  const png = symbolImgSrc(id);
  const item = (window.NM_AVATAR && window.NM_AVATAR.symbols || []).find(s=>s.id===id) || {};
  const alt = item.glyph || id;
  /* PNG가 뜨면 밑에 깔린 폴백 SVG를 감춘다 — 안 감추면 SVG의 팔다리·눈이 PNG 밖으로
     삐져나와 이중으로 보인다(2026-09-02 실화면 검토에서 잡음). PNG가 없으면
     onerror로 img만 사라지고 SVG가 그대로 남는다. */
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 150" preserveAspectRatio="xMidYMid meet"
data-symfallback="1" style="position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible">${symbolCharacterSVG(id, fg)}</svg>
<img src="${png}" alt="${alt}" draggable="false"
onload="var s=this.parentNode&&this.parentNode.querySelector('[data-symfallback]');if(s)s.style.display='none'"
onerror="this.style.display='none'"
style="position:absolute;left:50%;bottom:3%;transform:translateX(-50%);max-width:92%;max-height:96%;object-fit:contain;filter:${shadow}">`;
}

/* ── 사람 아바타(아이) / 마을 NPC 렌더 ── 마을세계관-설계.md §1
   window.renderHumanChar(kind, size) → HTML 문자열
   kind: 'boy'|'girl'(아이, S.avatar) · 'elder'(할아버지) · 'doc'(독쌤 선생님)
   원본 PNG를 그대로 쓴다 — 숫자 캐릭터와 달리 색조 필터·모자/망토 오버레이 없음
   (사람은 이미 완성된 일러스트라 재염색 대상이 아니다). 모르는 kind는 boy로 폴백. */
const HUMAN_IMG = {boy:'kid-boy.png', girl:'kid-girl.png', elder:'elder.png', doc:'docssam.png'};
function humanLabel(H, c){
  const l = String(window.NM_LANG || (document.documentElement && document.documentElement.lang) || 'ko').slice(0,2);
  const lg = (l==='en'||l==='zh') ? l : 'ko';
  const lk = H.looks.find(x=>x.id===c.look), ot = H.outfits.find(x=>x.id===c.outfit);
  let t = (lk && lk[lg]) || '';
  if(ot && ot.id!=='original' && ot[lg]) t += ' · ' + ot[lg];
  return t.replace(/[<>&"']/g,'');
}
window.renderHumanChar = function(kind, size){
  size = size || 120;
  if(kind && typeof kind==='object'){
    const H = window.NM_HUMANS;
    const c = H ? H.clean(kind) : {kind:kind.kind==='girl'?'girl':'boy', look:kind.kind==='girl'?'girl':'boy', outfit:'original'};
    const base = window.NM_CHAR_BASE || 'assets/characters/';
    const ph = Math.round(size * 1.25);
    const legacy = (c.look==='boy'||c.look==='girl') && c.outfit==='original';
    if(legacy || !H || !window.renderWalker){
      const file = HUMAN_IMG[c.kind] || HUMAN_IMG.boy;
      const label = H ? humanLabel(H, c) : '';
      return `<div class="nm-human" data-look="${c.look}" data-outfit="${c.outfit}" style="width:${size}px;height:${ph}px"><img src="${base}${file}" alt="${label}" draggable="false"></div>`;
    }
    // Pre-rendered from the same Three.js model/palette as town, avoiding dozens
    // of WebGL contexts in the gallery while keeping the selected outfit visible.
    return `<div class="nm-human nm-human-custom" data-look="${c.look}" data-outfit="${c.outfit}" style="width:${size}px;height:${ph}px"><img src="${base}portraits/${c.look}-${c.outfit}.png" alt="${humanLabel(H,c)}" draggable="false"></div>`;
  }
  const file = HUMAN_IMG[kind] || HUMAN_IMG.boy;
  const base = window.NM_CHAR_BASE || 'assets/characters/';
  const ph = Math.round(size * 1.25);
  return `<div class="nm-human" style="width:${size}px;height:${ph}px"><img src="${base}${file}" alt="" draggable="false"></div>`;
};

/* window.renderPartyHtml(avatarKind, character, size) → 아바타(사람) + 오른쪽 아래로 살짝
   겹쳐 서 있는 동행 숫자/기호 캐릭터. character는 renderNumiChar와 같은 형식. */
/* avatarKind: 문자열(기존) 또는 프로필 객체 — renderHumanChar로 그대로 전달 */
window.renderPartyHtml = function(avatarKind, character, size){
  size = size || 120;
  const human = window.renderHumanChar ? window.renderHumanChar(avatarKind, size) : '';
  const buddy = window.renderNumiChar ? window.renderNumiChar(character, Math.round(size*.75)) : '';
  return `<div class="nm-party">${human}<span class="nm-party-buddy">${buddy}</span></div>`;
};

/* ── 메인 렌더 ──
   opts.mood ∈ 'think'|'happy'|undefined(기본 그림) — 학습 무대(§2 학습무대-작화지시서.md).
   표정 파일이 있는 캐릭터(0·3·8)의 <img>에만 실제로 반영되고, 그 img에는 항상
   data-mood(현재 무드)·data-mood-base(파일 stem, 예: 'numi-0')를 남겨 나중에
   feedbackFx()가 정답 시 -happy로, 시간이 지나면 -think로 갈아 끼울 수 있게 한다. */
window.renderNumiChar = function(char, size, opts){
  char = char || {};
  const num     = char.number != null ? +char.number : 3;
  const colorId = char.color  || 'blue';
  const bgId    = char.bg     || 'plain';
  const capeId  = char.cape   || 'none';
  const hatId   = char.hat    || 'none';  // 기존 저장본엔 hat 필드가 없어도 기본값 'none'으로 동작(하위호환)
  const mood    = (opts && opts.mood) || null;
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

  // char.symbol이 있으면 숫자 대신 기호 캐릭터(있으면 없으면 기존 숫자 경로 그대로 — 하위호환)
  const symId = char.symbol || null;
  // 11~99(10 제외) → 두 자리 합체: 자리별 캐릭터를 나란히 배치
  let figure;
  if(symId){
    figure = symbolFigure(symId, fg, tint, shadow);
  } else if(num >= 11 && num <= 99){
    const tens = Math.floor(num/10), ones = num%10;
    figure = `<span style="position:absolute;left:50%;bottom:3%;transform:translateX(-50%);
display:flex;align-items:flex-end;justify-content:center;height:88%">
<img src="${digitImgSrc(tens)}" alt="${tens}" draggable="false"
style="max-width:100%;max-height:100%;object-fit:contain;margin-right:-6%;filter:${tint} ${shadow}">
<img src="${digitImgSrc(ones)}" alt="${ones}" draggable="false"
style="max-width:100%;max-height:100%;object-fit:contain;filter:${tint} ${shadow}">
</span>`;
  } else {
    const moodAttrs = IMG_HAS_MOOD[num]
      ? ` data-mood="${mood||'base'}" data-mood-base="${IMG_FILE[num].replace(/\.png$/,'')}"`
      : '';
    figure = `<img src="${digitImgSrc(num, mood)}" alt="${num}" draggable="false"${moodAttrs}
style="position:absolute;left:50%;bottom:3%;transform:translateX(-50%);
max-width:76%;max-height:88%;object-fit:contain;filter:${tint} ${shadow}">`;
  }

  return `<span class="numi-fig" style="position:relative;display:inline-block;width:${size}px;height:${ph}px;vertical-align:middle">
${aura}${decorSvg}${capeSvg}${figure}${hatSvg}
</span>`;
};

/* window.preloadNumiMoodImgs(char) — 유닛 진입 시 그 동행의 -think/-happy 두 장을
   미리 받아 둬(§4 학습무대-작화지시서.md) feedbackFx()의 정답 스와핑이 깜빡이지
   않게 한다. 표정 파일이 없는 캐릭터(0·3·8 외)는 조용히 아무 것도 안 함. */
window.preloadNumiMoodImgs = function(char){
  char = char || {};
  const num = char.number != null ? +char.number : 3;
  if(!IMG_HAS_MOOD[num]) return;
  const base = window.NM_CHAR_BASE || 'assets/characters/';
  const stem = IMG_FILE[num].replace(/\.png$/,'');
  ['think','happy'].forEach(mood=>{ new Image().src = base+stem+'-'+mood+'.png'; });
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.renderNumiChar;
})();
