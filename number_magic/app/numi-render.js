/* Numbers of Magic — 숫자 캐릭터 SVG 렌더러
   window.renderNumiChar(char, size) → SVG 문자열
   char = {number:0-9, color:'blue', face:'happy', hat:'wizard', bg:'plain'}
   size = 픽셀 너비 (기본 120, 높이는 자동)
   viewBox="0 0 120 140"  (모자 공간 20px 확보) */
(function(){
'use strict';

function getCol(id){
  const av = window.NM_AVATAR;
  if(av){ const c=av.colors.find(x=>x.id===id); if(c) return c; }
  return {fg:'#2980b9',bg:'#d6eaf8'};
}

/* ── 배경 장식 ── */
function bgDecor(id, cx, cy, r){
  switch(id){
    case 'stars': return [
      [cx-r+8,cy-r+12],[cx+r-14,cy-r+8],[cx-r+5,cy+10],
      [cx+r-8,cy+16],[cx,cy-r+5],[cx+r-12,cy-r+24]
    ].map(([x,y])=>star5(x,y,5,2.2,'#ffe000')).join('');
    case 'hearts': return [
      [cx-r+8,cy-r+18],[cx+r-12,cy-r+16],
      [cx-r+18,cy+r-14],[cx+r-18,cy+r-10]
    ].map(([x,y])=>heartShape(x,y,6,'#ff6b9d')).join('');
    case 'sparks': return [
      [cx-r+6,cy-r+16],[cx+r-10,cy-r+12],[cx-r+3,cy+12],
      [cx+r-6,cy+22],[cx+8,cy-r+4],[cx-12,cy+r-6]
    ].map(([x,y])=>sparkShape(x,y,'#f39c12')).join('');
    case 'rainbow':
      return `<path d="M${cx-r+4},${cy+6} A${r-4} ${r-4} 0 0 1 ${cx+r-4},${cy+6}"
fill="none" stroke="url(#nmrb_${cx})" stroke-width="7" opacity=".55"/>
<defs><linearGradient id="nmrb_${cx}" x1="0%" y1="0%" x2="100%" y2="0%">
<stop offset="0%" stop-color="#e74c3c"/>
<stop offset="25%" stop-color="#f39c12"/>
<stop offset="55%" stop-color="#2ecc71"/>
<stop offset="80%" stop-color="#3498db"/>
<stop offset="100%" stop-color="#9b59b6"/>
</linearGradient></defs>`;
    case 'magic': return [
      [cx-r+10,cy-r+10],[cx+r-14,cy-r+10],
      [cx-r+7,cy+8],[cx+r-9,cy+8]
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

/* ── 모자 (ty = 원의 최상단 y좌표) ── */
function hatSVG(id, cx, ty){
  switch(id){
    case 'wizard':
      return `<polygon points="${cx},${ty-28} ${cx-22},${ty+2} ${cx+22},${ty+2}" fill="#5b2c94"/>
<ellipse cx="${cx}" cy="${ty+2}" rx="26" ry="6" fill="#3a1c71" opacity=".92"/>
<circle cx="${cx}" cy="${ty-20}" r="3.5" fill="#ffe000"/>
<polygon points="${cx},${ty-28} ${cx-2},${ty-18} ${cx+2},${ty-18}" fill="#ffe000" opacity=".7"/>`;
    case 'crown':
      return `<path d="M${cx-22},${ty+2} L${cx-22},${ty-10} L${cx-11},${ty-2} L${cx},${ty-16} L${cx+11},${ty-2} L${cx+22},${ty-10} L${cx+22},${ty+2}Z" fill="#e6ac00" stroke="#c8960a" stroke-width="1.5"/>
<circle cx="${cx-8}" cy="${ty-2}" r="2.5" fill="#e74c3c"/>
<circle cx="${cx+8}" cy="${ty-2}" r="2.5" fill="#3498db"/>
<circle cx="${cx}" cy="${ty-5}" r="2.5" fill="#2ecc71"/>`;
    case 'bow':
      return `<path d="M${cx-20},${ty-10} Q${cx-8},${ty+2} ${cx},${ty-2} Q${cx-8},${ty-6} ${cx-20},${ty+6}Z" fill="#ff6b9d"/>
<path d="M${cx+20},${ty-10} Q${cx+8},${ty+2} ${cx},${ty-2} Q${cx+8},${ty-6} ${cx+20},${ty+6}Z" fill="#ff6b9d"/>
<circle cx="${cx}" cy="${ty-2}" r="5" fill="#ff4081"/>`;
    case 'party':
      return `<polygon points="${cx},${ty-28} ${cx-18},${ty+2} ${cx+18},${ty+2}" fill="#e74c3c"/>
<line x1="${cx-12}" y1="${ty-16}" x2="${cx+4}" y2="${ty-20}" stroke="white" stroke-width="2" opacity=".7"/>
<line x1="${cx-8}" y1="${ty-6}" x2="${cx+8}" y2="${ty-10}" stroke="white" stroke-width="2" opacity=".7"/>
<ellipse cx="${cx}" cy="${ty+2}" rx="18" ry="5" fill="#c0392b" opacity=".85"/>
<circle cx="${cx}" cy="${ty-28}" r="3" fill="#ffe000"/>`;
    case 'halo':
      return `<ellipse cx="${cx}" cy="${ty-10}" rx="22" ry="6" fill="none" stroke="#ffe000" stroke-width="4.5" opacity=".92"/>`;
    default: return '';
  }
}

/* ── 눈 ── */
function eyesSVG(id, lx, rx, ey){
  const dk='#2c3e50';
  switch(id){
    case 'cool':
      return `<rect x="${lx-11}" y="${ey-5}" width="22" height="10" rx="5" fill="${dk}"/>
<rect x="${rx-11}" y="${ey-5}" width="22" height="10" rx="5" fill="${dk}"/>
<rect x="${lx+1}" y="${ey-1}" width="8" height="4" rx="2" fill="rgba(255,255,255,.3)"/>
<rect x="${rx+1}" y="${ey-1}" width="8" height="4" rx="2" fill="rgba(255,255,255,.3)"/>`;
    case 'excited':
      return `<text x="${lx}" y="${ey+5}" font-size="13" text-anchor="middle" fill="#f39c12" font-weight="bold">★</text>
<text x="${rx}" y="${ey+5}" font-size="13" text-anchor="middle" fill="#f39c12" font-weight="bold">★</text>`;
    case 'sleepy':
      return `<path d="M${lx-6},${ey-2} Q${lx},${ey+5} ${lx+6},${ey-2}" fill="none" stroke="${dk}" stroke-width="3" stroke-linecap="round"/>
<path d="M${rx-6},${ey-2} Q${rx},${ey+5} ${rx+6},${ey-2}" fill="none" stroke="${dk}" stroke-width="3" stroke-linecap="round"/>
<line x1="${lx-4}" y1="${ey-7}" x2="${lx+4}" y2="${ey-2}" stroke="${dk}" stroke-width="2" stroke-linecap="round" opacity=".45"/>
<line x1="${rx-4}" y1="${ey-7}" x2="${rx+4}" y2="${ey-2}" stroke="${dk}" stroke-width="2" stroke-linecap="round" opacity=".45"/>`;
    case 'wink':
      return `<circle cx="${lx}" cy="${ey}" r="5.5" fill="${dk}"/>
<circle cx="${lx+2}" cy="${ey-2}" r="1.8" fill="white"/>
<path d="M${rx-6},${ey} Q${rx},${ey+6} ${rx+6},${ey}" fill="none" stroke="${dk}" stroke-width="3" stroke-linecap="round"/>`;
    case 'surprised':
      return `<circle cx="${lx}" cy="${ey}" r="7.5" fill="${dk}"/>
<circle cx="${rx}" cy="${ey}" r="7.5" fill="${dk}"/>
<circle cx="${lx+2.5}" cy="${ey-3}" r="2.5" fill="white"/>
<circle cx="${rx+2.5}" cy="${ey-3}" r="2.5" fill="white"/>`;
    case 'love':
      return [lx,rx].map(x=>`<path d="M${x},${ey+4} C${x},${ey} ${x-6},${ey} ${x-6},${ey-3} C${x-6},${ey-8} ${x},${ey-6} ${x},${ey-3} C${x},${ey-6} ${x+6},${ey-8} ${x+6},${ey-3} C${x+6},${ey} ${x},${ey} ${x},${ey+4}Z" fill="#e74c3c"/>`).join('');
    case 'fire':
      return `<path d="M${lx-7},${ey+4} L${lx-2},${ey-5} L${lx+3},${ey+4}Z" fill="${dk}"/>
<path d="M${rx-7},${ey+4} L${rx-2},${ey-5} L${rx+3},${ey+4}Z" fill="${dk}"/>`;
    default: // happy
      return `<circle cx="${lx}" cy="${ey}" r="5.5" fill="${dk}"/>
<circle cx="${rx}" cy="${ey}" r="5.5" fill="${dk}"/>
<circle cx="${lx+2}" cy="${ey-2}" r="1.8" fill="white"/>
<circle cx="${rx+2}" cy="${ey-2}" r="1.8" fill="white"/>`;
  }
}

/* ── 입 ── */
function mouthSVG(id, cx, my){
  const dk='#2c3e50';
  switch(id){
    case 'cool':
      return `<line x1="${cx-12}" y1="${my+4}" x2="${cx+12}" y2="${my+4}" stroke="${dk}" stroke-width="3" stroke-linecap="round"/>`;
    case 'excited':
      return `<ellipse cx="${cx}" cy="${my+5}" rx="10" ry="8" fill="${dk}"/>
<ellipse cx="${cx}" cy="${my+4}" rx="7" ry="4.5" fill="#c0392b"/>`;
    case 'sleepy':
      return `<path d="M${cx-10},${my+4} Q${cx-3},${my+9} ${cx+3},${my+4} Q${cx+9},${my} ${cx+12},${my+4}" fill="none" stroke="${dk}" stroke-width="2.5" stroke-linecap="round"/>`;
    case 'wink':
    case 'love':
      return `<path d="M${cx-12},${my+2} Q${cx},${my+14} ${cx+12},${my+2}" fill="none" stroke="${id==='love'?'#e74c3c':dk}" stroke-width="3" stroke-linecap="round"/>`;
    case 'surprised':
      return `<ellipse cx="${cx}" cy="${my+7}" rx="9" ry="10" fill="${dk}"/>
<ellipse cx="${cx}" cy="${my+6}" rx="6" ry="6" fill="rgba(255,255,255,.2)"/>`;
    case 'fire':
      return `<path d="M${cx-14},${my+2} L${cx-8},${my+9} L${cx-2},${my+2} L${cx+4},${my+9} L${cx+10},${my+2} L${cx+14},${my+9}" fill="none" stroke="${dk}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>`;
    default: // happy
      return `<path d="M${cx-14},${my} Q${cx},${my+14} ${cx+14},${my}" fill="none" stroke="${dk}" stroke-width="3" stroke-linecap="round"/>`;
  }
}

/* ── 메인 렌더 ── */
window.renderNumiChar = function(char, size){
  char = char || {};
  const num    = char.number != null ? char.number : 3;
  const colorId = char.color  || 'blue';
  const faceId  = char.face   || 'happy';
  const hatId   = char.hat    || 'wizard';
  const bgId    = char.bg     || 'plain';
  size = size || 120;

  const col = getCol(colorId);
  const fg = col.fg, bg = col.bg;

  // viewBox 0 0 120 140 (상단 20px = 모자 공간)
  const cx=60, cy=86, r=50;
  const circleTop = cy - r;  // y=36

  const eyeLX=41, eyeRX=79, eyeY=68;
  const numY=100, numSz=46;
  const mouthY=110;

  const ph = Math.round(size * 140 / 120);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" width="${size}" height="${ph}" style="display:block">
${bgDecor(bgId,cx,cy,r)}
<circle cx="${cx}" cy="${cy}" r="${r}" fill="${bg}" stroke="${fg}" stroke-width="3"/>
${hatSVG(hatId,cx,circleTop)}
${eyesSVG(faceId,eyeLX,eyeRX,eyeY)}
<text x="${cx}" y="${numY}" text-anchor="middle"
  font-family="'Pretendard','Arial Rounded MT Bold','Helvetica Neue',Arial,sans-serif"
  font-size="${numSz}" font-weight="900" fill="${fg}">${num}</text>
${mouthSVG(faceId,cx,mouthY)}
</svg>`;
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.renderNumiChar;
})();
