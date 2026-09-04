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

/* 숫자 → 이미지 파일 (한 자리, 0~10) */
const IMG_FILE = {0:'numi-0.png', 3:'poco-3.png', 8:'momo-8.png'};
function digitImgSrc(n){
  const base = window.NM_CHAR_BASE || 'assets/characters/';
  return base + (IMG_FILE[n] || ('num-'+n+'.png'));
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
window.renderHumanChar = function(kind, size){
  size = size || 120;
  const file = HUMAN_IMG[kind] || HUMAN_IMG.boy;
  const base = window.NM_CHAR_BASE || 'assets/characters/';
  const ph = Math.round(size * 1.25);
  return `<div class="nm-human" style="width:${size}px;height:${ph}px"><img src="${base}${file}" alt="" draggable="false"></div>`;
};

/* window.renderPartyHtml(avatarKind, character, size) → 아바타(사람) + 오른쪽 아래로 살짝
   겹쳐 서 있는 동행 숫자/기호 캐릭터. character는 renderNumiChar와 같은 형식. */
window.renderPartyHtml = function(avatarKind, character, size){
  size = size || 120;
  const human = window.renderHumanChar ? window.renderHumanChar(avatarKind, size) : '';
  const buddy = window.renderNumiChar ? window.renderNumiChar(character, Math.round(size*.75)) : '';
  return `<div class="nm-party">${human}<span class="nm-party-buddy">${buddy}</span></div>`;
};

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
