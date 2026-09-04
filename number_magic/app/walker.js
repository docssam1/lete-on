/* Numbers of Magic — 걸어다니는 사람 캐릭터 리그(rig) 렌더러
   window.renderWalker(kind, size) → HTML 문자열
   kind = 'boy'|'girl'|'elder'|'doc' (모르면 boy로 폴백), size = px 폭(높이=size*1.25)

   기존 renderHumanChar(numi-render.js)는 완성된 PNG를 그대로 붙이는 "정지 초상화"용.
   이 파일은 그 대신 팔다리·머리·몸통을 따로 움직일 수 있는 SVG 리그를 그려서
   실제로 "걷는" 느낌을 CSS 애니메이션(styles.css)으로 낸다. 2026-09-04 비주얼
   보정판: assets/characters/kid-boy.png·kid-girl.png·elder.png·docssam.png 원본
   일러스트의 실루엣(헤어·로브·소품)을 그대로 참고해 다시 그렸다 — 프로포션(2.5등신
   치비), 이목구비, 헤어 실루엣, 옷 트림·소품, 그라디언트/외곽선을 전부 갱신.
   구조(리그)·CSS 클래스명·픽셀 pivot 방식은 기존과 동일하게 유지(town-game 연동 불변).

   구조: <div class="nm-walker" data-kind data-dir>
           <svg viewBox="0 0 120 150">
             <ellipse class="wk-shadow">                (바닥 그림자, 뷰 공통)
             <g class="wk-view wk-front">...</g>          (정면, dir='s')
             <g class="wk-view wk-back">...</g>           (후면, dir='n')
             <g class="wk-view wk-side">...</g>           (측면, dir='e', 'w'는 CSS로 좌우반전)
           </svg>
         </div>
   각 파츠는 <g transform="translate(pivotX,pivotY)"><g class="wk-legL">(0,0 기준 회전)…</g></g>
   식으로 "관절 좌표로 옮긴 뒤 그 안에서 0,0 기준 회전"하는 중첩 g 방식을 쓴다 — SVG
   "transform" 속성과 CSS keyframes의 transform을 같은 태그에 같이 두면 CSS가 속성을
   통째로 덮어써서 관절이 원점으로 튄다(합성 안 됨). 그래서 고정 위치용 바깥 g +
   회전만 하는 안쪽 g(transform-origin:0 0)로 반드시 분리한다.
*/
(function(){
'use strict';

let WUID = 0; // 그라디언트 id 충돌 방지(같은 페이지에 여러 명 렌더될 때)
const OUTLINE = 'rgba(40,25,20,.35)'; // 56px 축소본에서도 실루엣이 읽히도록 body·head·limb 공통 외곽선

/* ── 색상 헬퍼 ── */
function hex2rgb(hex){hex=hex.replace('#','');if(hex.length===3)hex=hex.split('').map(c=>c+c).join('');
  return [parseInt(hex.slice(0,2),16),parseInt(hex.slice(2,4),16),parseInt(hex.slice(4,6),16)];}
function rgb2hex(r,g,b){return '#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');}
function lighten(hex,amt){const[r,g,b]=hex2rgb(hex);return rgb2hex(r+amt*1.6,g+amt*1.6,b+amt*1.6);}
function darken(hex,amt){const[r,g,b]=hex2rgb(hex);return rgb2hex(r-amt*1.6,g-amt*1.6,b-amt*1.6);}

/* ── 캐릭터별 팔레트(참고 PNG 실사 색 근사) ── */
const PALETTE = {
  boy:  {skin:'#ffd9b3', robe:'#2f7be0', robeDk:'#173f80', trim:'#f4c542',
         hair:'#7a4a24', hairHi:'#a86b3c', hairDk:'#4a2c12', eyes:'#3b8be8',
         leg:'#2f6fd0', legDk:'#173f80', boot:'#2f6fd0', bootDk:'#173f80', bootAccent:'#ffffff',
         accent:'#8a5a34', accentDk:'#5c3a20'},
  girl: {skin:'#ffdcc0', robe:'#7a3fd6', robeDk:'#4a2496', trim:'#f4c542',
         hair:'#8a5232', hairHi:'#b97b4e', hairDk:'#552f16', eyes:'#3b8be8',
         leg:'#ffffff', legDk:'#d8d3e0', boot:'#7a3fd6', bootDk:'#4a2496', bootAccent:'#f4c542',
         accent:'#8e5be0', accentDk:'#5c34a0', bow:'#8e5be0'},
  elder:{skin:'#f3c9a3', robe:'#1e3f9c', robeDk:'#0f2560', trim:'#f4c542',
         hair:'#f4f4f4', hairHi:'#ffffff', hairDk:'#d8d8de', eyes:'#6b4a2e',
         leg:'#1e3f9c', legDk:'#0f2560', boot:'#5a3b22', bootDk:'#331f0f', bootAccent:'#caa46a',
         accent:'#5a3b22', accentDk:'#331f0f', gem:'#3fa8e8', glasses:'#d9a93a'},
  doc:  {skin:'#f0c19c', robe:'#2a7d4f', robeDk:'#164a2e', trim:'#f4c542',
         hair:'#3b2a22', hairHi:'#5c4433', hairDk:'#1f150f', eyes:'#6b4a2e',
         leg:'#5a3b22', legDk:'#331f0f', boot:'#3b2612', bootDk:'#1f1208', bootAccent:'#caa46a',
         accent:'#8a5a34', accentDk:'#5c3a20', tie:'#2a7d4f', glasses:'#2b2b2b'}
};

/* ── 그라디언트 defs — 몸(로브)·다리·부츠·소품색 각 3-stop(밝음-기본-어둠) + 피부는 radial ── */
function defsFor(uid, pal){
  const g3=(id,c1,cBase,c2)=>`<linearGradient id="${id}${uid}" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="${c1}"/><stop offset="50%" stop-color="${cBase}"/><stop offset="100%" stop-color="${c2}"/>
  </linearGradient>`;
  return `<defs>
    <radialGradient id="wkSkin${uid}" cx="35%" cy="30%" r="75%">
      <stop offset="0%" stop-color="${lighten(pal.skin,22)}"/>
      <stop offset="55%" stop-color="${pal.skin}"/>
      <stop offset="100%" stop-color="${darken(pal.skin,12)}"/>
    </radialGradient>
    ${g3('wkRobe', lighten(pal.robe,16), pal.robe, pal.robeDk)}
    ${g3('wkHair', lighten(pal.hair,18), pal.hair, pal.hairDk)}
    ${g3('wkLeg',  lighten(pal.leg,14),  pal.leg,  pal.legDk)}
    ${g3('wkBoot', lighten(pal.boot,16), pal.boot, pal.bootDk)}
    ${g3('wkAcc',  lighten(pal.accent,16), pal.accent, pal.accentDk)}
    <radialGradient id="wkShade${uid}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#000" stop-opacity=".28"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0"/>
    </radialGradient>
  </defs>`;
}

/* 5각 별(가슴 배지·부츠 장식) */
function star5(cx,cy,ro,ri,fill){
  const pts=[];
  for(let i=0;i<10;i++){
    const a=Math.PI*i/5-Math.PI/2, R=i%2?ri:ro;
    pts.push((cx+R*Math.cos(a)).toFixed(1)+','+(cy+R*Math.sin(a)).toFixed(1));
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`;
}

/* ── 헤어 캡용 삼각함수 헬퍼 ── 화면각도 0°=+x(정면, 캐릭터가 보는 쪽)·90°=+y(아래)·
   180°=-x(뒤통수)·270°=-y(정수리). 측면 머리는 "정수리를 지나 뒤통수까지"를 이 각도로
   훑어서 그린다(손으로 그린 베지어 곡선 대신 삼각함수로 좌표를 뽑아 일관성 확보). */
function arcXY(r, aDeg){
  const rad = aDeg*Math.PI/180;
  return [+(r*Math.cos(rad)).toFixed(2), +(r*Math.sin(rad)).toFixed(2)];
}
/* aStart(예: 325, 이마 헤어라인)에서 aEnd(예: 100, 목덜미)까지 반지름 rOuterFn(a)를
   따라가는 바깥 호를 그린 뒤 중심(0,0)으로 닫는다 — 정수리~뒤통수 구간은 중심으로
   닫아도 눈·코·입과 안 겹친다(그 구간은 전부 뒤통수 쪽이라 얼굴이 없다). */
function capWedge(aStart, aEnd, rOuterFn, steps){
  steps = steps||22;
  let d='';
  for(let i=0;i<=steps;i++){
    const a = aStart + (aEnd-aStart)*(i/steps);
    const r = (typeof rOuterFn==='function') ? rOuterFn(a) : rOuterFn;
    const [x,y] = arcXY(r,a);
    d += (i===0?'M':'L') + x + ',' + y + ' ';
  }
  return d + 'L0,0 Z';
}
/* 방사형 뭉치머리(삐침머리·컬 볼륨 공용) — aDeg 방향으로 rBase~rBase+len 사이에
   길쭉한 타원을 얹어 둥근 뭉치 하나를 만든다(뾰족한 삼각형 대신). */
function radialTuft(aDeg, rBase, len, wid, uid, fillOverride){
  const rMid = rBase + len/2;
  const [mx,my] = arcXY(rMid, aDeg);
  const fill = fillOverride || `url(#wkHair${uid})`;
  return `<ellipse cx="${mx}" cy="${my}" rx="${wid}" ry="${(len/2+1.6).toFixed(1)}" fill="${fill}" stroke="${OUTLINE}" stroke-width=".7" transform="rotate(${(aDeg-90).toFixed(1)} ${mx} ${my})"/>`;
}

/* ── 다리(허벅지~부츠) · 팔(어깨~손) ── 중첩 g(고정 위치 바깥 + 회전만 하는 안쪽)로
   SVG 속성 transform과 CSS keyframes transform 충돌을 피한다(파일 상단 docstring 참고). */
/* 부츠 = 가로로 넓고 세로로 낮은 "알약(stadium)" 모양 — 둥근 앞코의 신발 실루엣.
   흰 퍼(fur) 밴드는 부츠 폭 전체를 덮는 캡이 아니라 윗단을 가로지르는 가는 띠 하나. */
function legPart(cls, x, y, uid, pal, accentType){
  const legW=8, legH=18;                 // 허벅지(로브 밑단에 가려짐)
  const bootW=21, bootH=12, bootTop=legH; // 신발(로브 밑단 아래로 드러남)
  const bootBottom = bootTop+bootH, bootCy = bootTop+bootH/2;
  let accent='';
  if(accentType==='fur')
    accent=`<rect x="${-bootW/2+1.6}" y="${bootTop+1.8}" width="${bootW-3.2}" height="2.6" rx="1.3" fill="#fff" stroke="${OUTLINE}" stroke-width=".7" opacity=".95"/>`;
  if(accentType==='star')
    accent=star5(0, bootTop+bootH*0.62, 2.6, 1.1, pal.bootAccent);
  return `<g transform="translate(${x},${y})"><g class="${cls}" style="transform-origin:0px 0px">
    <rect x="${-legW/2}" y="0" width="${legW}" height="${legH}" rx="${legW/2}" fill="url(#wkLeg${uid})" stroke="${OUTLINE}" stroke-width="1.2"/>
    <rect x="${-bootW/2}" y="${bootTop}" width="${bootW}" height="${bootH}" rx="${bootH/2}" ry="${bootH/2}" fill="url(#wkBoot${uid})" stroke="${OUTLINE}" stroke-width="1.2"/>
    ${accent}
    <ellipse cx="-4" cy="${bootTop+3.4}" rx="3.4" ry="1.8" fill="#fff" opacity=".32"/>
    <rect x="${-bootW/2+1.5}" y="${bootBottom-2.4}" width="${bootW-3}" height="2.4" rx="1.2" fill="rgba(0,0,0,.2)"/>
  </g></g>`;
}
/* propSvg가 있으면 손 끝에 붙여 같이 스윙 */
function armPart(cls, x, y, uid, propSvg){
  const armW=8.5, armH=16, handR=6.6, handCy=armH+handR-2;
  return `<g transform="translate(${x},${y})"><g class="${cls}" style="transform-origin:0px 0px">
    <rect x="${-armW/2}" y="0" width="${armW}" height="${armH}" rx="${armW/2}" fill="url(#wkRobe${uid})" stroke="${OUTLINE}" stroke-width="1.1"/>
    <circle cx="0" cy="${handCy}" r="${handR}" fill="url(#wkSkin${uid})" stroke="${OUTLINE}" stroke-width="1"/>
    ${propSvg||''}
  </g></g>`;
}

/* ── 로브(후드 옷깃 + 트림 + 가슴 별) — translate(60,58)로 옮긴 뒤 이 안에서 로컬 (0,0) 기준 ── */
function robeBody(uid, w, h, pal){
  const collar = `<path d="M-${(w*0.55).toFixed(1)},-2 Q0,7 ${(w*0.55).toFixed(1)},-2 L${(w*0.4).toFixed(1)},4 Q0,11 -${(w*0.4).toFixed(1)},4 Z" fill="${darken(pal.robe,16)}" opacity=".92"/>`;
  const body = `<path d="M-${w},4 Q0,-9 ${w},4 L${w+6},${h} Q0,${h+9} -${w+6},${h} Z" fill="url(#wkRobe${uid})" stroke="${OUTLINE}" stroke-width="1.2"/>`;
  const hemShade = `<path d="M-${w+3},${h-7} Q0,${h+5} ${w+3},${h-7} L${w+1},${h-1} Q0,${h+8} -${w+1},${h-1} Z" fill="rgba(0,0,0,.16)"/>`;
  const hi = `<path d="M-${(w*0.75).toFixed(1)},1 Q-${(w*0.28).toFixed(1)},-7 0,-2 L-${(w*0.3).toFixed(1)},7 Q-${(w*0.65).toFixed(1)},9 -${(w*0.75).toFixed(1)},1Z" fill="#fff" opacity=".16"/>`;
  const seam = `<path d="M0,3 L0,${h-4}" stroke="${pal.trim}" stroke-width="2.4" opacity=".95"/>`;
  const hemTrim = `<path d="M-${w+4},${h-1} Q0,${h+8} ${w+4},${h-1}" fill="none" stroke="${pal.trim}" stroke-width="2" opacity=".9"/>`;
  const cuffs = `<path d="M-${w+1},6 L-${w-5},${(h*0.42).toFixed(1)} M${w-1},6 L${w-5},${(h*0.42).toFixed(1)}" stroke="${pal.trim}" stroke-width="1.5" opacity=".6" fill="none"/>`;
  const star = star5(0, h*0.3, 4.6, 2, pal.trim);
  return collar+body+hemShade+hi+seam+hemTrim+cuffs+star;
}
/* 로브 위에 얹는 캐릭터별 장식(정면 전용): 소년=대각선 가방끈, 소녀=(별 배지로 충분),
   할아버지=허리띠+보석, 독쌤=조끼+넥타이. */
function bodyExtras(kind, uid, w, h, pal){
  if(kind==='boy'){
    return `<path d="M-${w+2},2 L${w-6},${h-4}" stroke="url(#wkAcc${uid})" stroke-width="5.4" stroke-linecap="round" opacity=".95"/>
      <circle cx="${w-6}" cy="${h-4}" r="3.6" fill="${pal.trim}" stroke="${darken(pal.trim,20)}" stroke-width=".8"/>`;
  }
  if(kind==='elder'){
    const by=h*0.56;
    return `<rect x="${-(w-1)}" y="${by}" width="${(w-1)*2}" height="6.5" rx="3" fill="url(#wkAcc${uid})" stroke="${OUTLINE}" stroke-width="1"/>
      <circle cx="0" cy="${by+3.2}" r="3.6" fill="${pal.gem}" stroke="${darken(pal.gem,22)}" stroke-width="1"/>`;
  }
  if(kind==='doc'){
    const vy=h*0.5;
    return `<path d="M-9,2 L0,${vy} L9,2 L5.5,-1 L0,3.4 L-5.5,-1Z" fill="url(#wkAcc${uid})" stroke="${OUTLINE}" stroke-width=".9"/>
      <path d="M-1.6,3.4 L1.6,3.4 L2.4,${(vy*0.62).toFixed(1)} L0,${(vy*0.62+4).toFixed(1)} L-2.4,${(vy*0.62).toFixed(1)}Z" fill="${pal.tie}"/>`;
  }
  return '';
}

/* ── 머리(정면/측면/후면) — 셋 다 반지름 26의 같은 원(circle r=26)에서 시작해
   측면도 정면과 "같은 크기"를 보장한다(요청사항 1). translate(60,38) 공통 앵커. ── */
function headFront(uid, kind, pal){
  const hairSvg = HAIR[kind].front(uid, pal);
  const glasses = (kind==='elder'||kind==='doc') ? GLASSES[kind]() : '';
  const facial  = kind==='elder' ? BEARD() : '';
  return `<g transform="translate(60,38)"><g class="wk-head" style="transform-origin:0px 0px">
    <circle cx="0" cy="0" r="26" fill="url(#wkSkin${uid})" stroke="${OUTLINE}" stroke-width="1.2"/>
    <ellipse cx="3" cy="6" rx="22" ry="19" fill="url(#wkShade${uid})" opacity=".4"/>
    <path d="M-13,-6 Q-8,-9 -3,-7" stroke="#6b4a2e" stroke-width="1.7" fill="none" stroke-linecap="round"/>
    <path d="M13,-6 Q8,-9 3,-7" stroke="#6b4a2e" stroke-width="1.7" fill="none" stroke-linecap="round"/>
    <ellipse cx="-9" cy="2" rx="3.6" ry="4.6" fill="#fff"/><ellipse cx="9" cy="2" rx="3.6" ry="4.6" fill="#fff"/>
    <circle cx="-9" cy="2.4" r="2.3" fill="${pal.eyes}"/><circle cx="9" cy="2.4" r="2.3" fill="${pal.eyes}"/>
    <circle cx="-9" cy="2.8" r="1.1" fill="#1a2233"/><circle cx="9" cy="2.8" r="1.1" fill="#1a2233"/>
    <circle cx="-10.1" cy="0.6" r=".7" fill="#fff"/><circle cx="7.9" cy="0.6" r=".7" fill="#fff"/>
    <circle cx="-8" cy="3.8" r=".4" fill="#fff" opacity=".8"/><circle cx="10" cy="3.8" r=".4" fill="#fff" opacity=".8"/>
    <circle cx="0" cy="9.5" r="1.2" fill="${darken(pal.skin,14)}"/>
    <path d="M-5,13.5 Q0,17.5 5,13.5 Q0,16 -5,13.5Z" fill="#e0576f"/>
    <path d="M-3.6,14.1 L3.6,14.1" stroke="#fff" stroke-width="1" stroke-linecap="round"/>
    <ellipse cx="-15" cy="11" rx="4.2" ry="2.6" fill="#ff9fae" opacity=".45"/>
    <ellipse cx="15" cy="11" rx="4.2" ry="2.6" fill="#ff9fae" opacity=".45"/>
    <ellipse cx="-9" cy="-12" rx="11" ry="8.5" fill="#fff" opacity=".35"/>
    ${hairSvg}${facial}${glasses}
  </g></g>`;
}
function headBack(uid, kind, pal){
  return `<g transform="translate(60,38)"><g class="wk-head" style="transform-origin:0px 0px">
    <circle cx="0" cy="0" r="26" fill="url(#wkSkin${uid})" stroke="${OUTLINE}" stroke-width="1.2"/>
    <ellipse cx="0" cy="6" rx="23" ry="19" fill="url(#wkShade${uid})" opacity=".5"/>
    ${HAIR[kind].back(uid, pal)}
  </g></g>`;
}
function headSide(uid, kind, pal){
  const glasses = (kind==='elder'||kind==='doc') ? GLASSES[kind](true) : '';
  const facial  = kind==='elder' ? BEARD(true) : '';
  return `<g transform="translate(60,38)"><g class="wk-head" style="transform-origin:0px 0px">
    <circle cx="0" cy="0" r="26" fill="url(#wkSkin${uid})" stroke="${OUTLINE}" stroke-width="1.2"/>
    <ellipse cx="4" cy="6" rx="19" ry="19" fill="url(#wkShade${uid})" opacity=".4"/>
    <path d="M23,0 Q31,4 24,10 Q21,5 23,0Z" fill="url(#wkSkin${uid})" stroke="${OUTLINE}" stroke-width="1"/>
    <ellipse cx="-24" cy="4" rx="4" ry="6" fill="${darken(pal.skin,8)}"/>
    <path d="M10,-6 Q16,-9 20,-7" stroke="#6b4a2e" stroke-width="1.7" fill="none" stroke-linecap="round"/>
    <ellipse cx="16" cy="2" rx="3.2" ry="4.2" fill="#fff"/>
    <circle cx="16.6" cy="2.4" r="2.1" fill="${pal.eyes}"/><circle cx="16.6" cy="2.8" r="1" fill="#1a2233"/>
    <circle cx="15.6" cy="0.8" r=".6" fill="#fff"/>
    <path d="M13,13.5 Q19,17 22,12.5" stroke="#7a3b2e" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <ellipse cx="-9" cy="-12" rx="10" ry="8" fill="#fff" opacity=".32"/>
    ${HAIR[kind].side(uid, pal)}${facial}${glasses}
  </g></g>`;
}
/* 할아버지 흰 수염 — 얼굴 아랫절반을 덮는 둥근 형태 */
function BEARD(side){
  return side
    ? `<path d="M18,6 Q30,11 27,23 Q19,27 13,22 Q10,13 18,6Z" fill="#f4f4f4" stroke="#d8d8de" stroke-width="1"/>
       <path d="M19,12 Q25,15 23,21 Q18,22 16,17Z" fill="#d8d8de" opacity=".55"/>`
    : `<path d="M-16,6 Q0,29 16,6 Q14,20 0,24 Q-14,20 -16,6Z" fill="#f4f4f4" stroke="#d8d8de" stroke-width="1"/>
       <path d="M-8,13 Q0,21 8,13 Q4,19 0,19 Q-4,19 -8,13Z" fill="#d8d8de" opacity=".5"/>`;
}
/* 안경 — 할아버지=금테(#d9a93a), 독쌤=검은테(#2b2b2b) */
const GLASSES = {
  elder:(side)=> side
    ? `<circle cx="16" cy="2" r="4.6" fill="none" stroke="${PALETTE.elder.glasses}" stroke-width="1.4"/>`
    : `<circle cx="-9" cy="2" r="4.8" fill="none" stroke="${PALETTE.elder.glasses}" stroke-width="1.4"/><circle cx="9" cy="2" r="4.8" fill="none" stroke="${PALETTE.elder.glasses}" stroke-width="1.4"/><path d="M-3.2,2 L3.2,2" stroke="${PALETTE.elder.glasses}" stroke-width="1.4"/>`,
  doc:(side)=> side
    ? `<circle cx="16" cy="2" r="5" fill="none" stroke="${PALETTE.doc.glasses}" stroke-width="1.6"/>`
    : `<circle cx="-9" cy="2" r="5.2" fill="none" stroke="${PALETTE.doc.glasses}" stroke-width="1.6"/><circle cx="9" cy="2" r="5.2" fill="none" stroke="${PALETTE.doc.glasses}" stroke-width="1.6"/><path d="M-2.6,2 L2.6,2" stroke="${PALETTE.doc.glasses}" stroke-width="1.6"/>`
};

/* ── 헤어 실루엣 — 참고 PNG 헤어라인을 단순화한 원본 도형(하이라이트 스트릭 포함) ── */
const HAIR = {
  boy:{ /* 둥근 뭉치머리 5개(높이 8~10) + 이마로 늘어진 부드러운 앞머리 한 갈래 */
    front:(uid,pal)=>{
      const cap = `<path d="M-21,-5 Q-24,-24 0,-26 Q24,-24 21,-5 Q18,-13 10,-11 Q14,-18 0,-19 Q-14,-18 -10,-11 Q-18,-13 -21,-5Z" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width="1"/>`;
      const angles=[218,244,270,296,322];
      const tufts = angles.map(a=>radialTuft(a,22,9,4.3,uid)).join('');
      const hi = [244,270,296].map(a=>radialTuft(a,23,6,2.2,uid,pal.hairHi)).join('');
      const forelock = `<path d="M-6,-19 Q-1,-7 5,-14 Q0,-9 -4,-9 Q-8,-14 -6,-19Z" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width=".7"/>`;
      return cap+tufts+forelock+`<g opacity=".6">${hi}</g>`;
    },
    back:(uid,pal)=>`<path d="M-27,-4 Q-29,-28 0,-30 Q29,-28 27,-4 Q26,14 14,20 Q17,4 6,0 Q3,4 0,0 Q-3,4 -6,0 Q-17,4 -14,20 Q-26,14 -27,-4Z" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width="1"/>
      <path d="M-11,-24 Q0,-28 11,-24" fill="none" stroke="${pal.hairHi}" stroke-width="2.2" opacity=".5"/>`,
    /* 측면: 정수리(270°)를 지나 뒤통수(100°)까지 캡으로 덮고, 캡 위에 작은 뭉치머리
       2~3개 + 이마 헤어라인(325° 부근)에서 늘어지는 앞머리 한 갈래를 얹는다. */
    side:(uid,pal)=>{
      const cap = capWedge(326, 100, a=>24, 22);
      const tufts=[248,272,296].map(a=>radialTuft(a,23,8,3.8,uid)).join('');
      const fore = `<path d="M20,-13 Q26,-6 19,-1 Q15,-7 16,-13 Q18,-15 20,-13Z" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width=".7"/>`;
      return `<path d="${cap}" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width="1"/>${tufts}${fore}`;
    }
  },
  girl:{ /* 이마 앞머리 + 양갈래 땋은 머리(어깨 높이까지), 리본 */
    front:(uid,pal)=>`<path d="M-25,-4 Q-27,-22 0,-24 Q27,-22 25,-4 Q21,-12 12,-11 Q15,-18 0,-19 Q-15,-18 -12,-11 Q-21,-12 -25,-4Z" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width="1"/>
      <ellipse cx="-31" cy="15" rx="9" ry="17" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width="1" transform="rotate(-14 -31 15)"/>
      <ellipse cx="31" cy="15" rx="9" ry="17" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width="1" transform="rotate(14 31 15)"/>
      <ellipse cx="-27" cy="-2" rx="4" ry="10" fill="${pal.hairHi}" opacity=".4" transform="rotate(-14 -27 -2)"/>
      <g transform="rotate(-14 -28 -3)"><ellipse cx="-31" cy="-3" rx="4.2" ry="3" fill="${pal.bow}"/><ellipse cx="-25" cy="-3" rx="4.2" ry="3" fill="${pal.bow}"/><circle cx="-28" cy="-3" r="2" fill="${darken(pal.bow,20)}"/></g>
      <g transform="rotate(14 28 -3)"><ellipse cx="31" cy="-3" rx="4.2" ry="3" fill="${pal.bow}"/><ellipse cx="25" cy="-3" rx="4.2" ry="3" fill="${pal.bow}"/><circle cx="28" cy="-3" r="2" fill="${darken(pal.bow,20)}"/></g>`,
    back:(uid,pal)=>`<path d="M-26,-4 Q-28,-23 0,-25 Q28,-23 26,-4 Q25,6 18,8 Q20,-4 8,-4 Q4,0 0,-3 Q-4,0 -8,-4 Q-20,-4 -18,8 Q-25,6 -26,-4Z" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width="1"/>
      <ellipse cx="-31" cy="15" rx="9" ry="17" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width="1" transform="rotate(-12 -31 15)"/>
      <ellipse cx="31" cy="15" rx="9" ry="17" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width="1" transform="rotate(12 31 15)"/>
      <g transform="rotate(-12 -28 -2)"><ellipse cx="-31" cy="-2" rx="3.8" ry="2.8" fill="${pal.bow}"/><ellipse cx="-25" cy="-2" rx="3.8" ry="2.8" fill="${pal.bow}"/></g>
      <g transform="rotate(12 28 -2)"><ellipse cx="31" cy="-2" rx="3.8" ry="2.8" fill="${pal.bow}"/><ellipse cx="25" cy="-2" rx="3.8" ry="2.8" fill="${pal.bow}"/></g>`,
    /* 측면: 앞머리(뱅) 캡 + 뒤통수 쪽으로 늘어지는 땋은머리 하나(이 각도에선 하나만 보임) + 리본 */
    side:(uid,pal)=>{
      const cap = capWedge(340, 105, a=>23, 20);
      const [px,py] = arcXY(30, 200);
      return `<path d="${cap}" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width="1"/>
        <ellipse cx="${px}" cy="${(py+14).toFixed(1)}" rx="8" ry="16" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width="1" transform="rotate(-8 ${px} ${(py+14).toFixed(1)})"/>
        <g transform="rotate(-8 ${(px-2).toFixed(1)} 0)"><ellipse cx="${(px-2).toFixed(1)}" cy="-1" rx="3.8" ry="2.8" fill="${pal.bow}"/><ellipse cx="${(px-7).toFixed(1)}" cy="-1" rx="3.8" ry="2.8" fill="${pal.bow}"/></g>`;
    }
  },
  elder:{ /* 정수리·옆머리만 남은 하얀 웨이브(수염이 아래를 덮음) */
    front:(uid,pal)=>`<path d="M-20,-6 Q-22,-18 0,-19 Q22,-18 20,-6 Q17,-11 10,-9 Q13,-14 0,-15 Q-13,-14 -10,-9 Q-17,-11 -20,-6Z" fill="url(#wkHair${uid})" stroke="rgba(40,25,20,.25)" stroke-width="1"/>`,
    /* 뒤통수는 (수염에 가려질 얼굴이 없으니) 정수리부터 목덜미까지 통짜로 덮어야
       "정수리만 하얀 테두리, 나머지는 살구색 민머리"로 보이지 않는다. */
    back:(uid,pal)=>`<path d="M-25,0 Q-27,-23 0,-25 Q27,-23 25,0 Q25,13 16,18 Q19,2 0,1 Q-19,2 -16,18 Q-25,13 -25,0Z" fill="url(#wkHair${uid})" stroke="rgba(40,25,20,.25)" stroke-width="1"/>`,
    /* 측면도 같은 방식(정수리→뒤통수 캡)으로 덮는다. 반지름을 boy보다 살짝 작게 해
       머리숱 적은 느낌을 유지. */
    side:(uid,pal)=>{
      const cap = capWedge(328, 102, a=>21.5, 18);
      return `<path d="${cap}" fill="url(#wkHair${uid})" stroke="rgba(40,25,20,.25)" stroke-width="1"/>`;
    }
  },
  doc:{ /* 짙은 갈색 곱슬머리, 옆으로 볼륨 */
    front:(uid,pal)=>`<path d="M-23,-6 Q-27,-26 -2,-29 Q9,-33 17,-22 Q27,-19 21,-2 Q18,-12 9,-10 Q13,-19 1,-20 Q7,-11 -4,-12 Q-10,-20 -16,-13 Q-12,-7 -19,-4 Q-22,-2 -23,-6Z" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width="1"/>
      <path d="M-16,-20 Q-8,-26 0,-24" fill="none" stroke="${pal.hairHi}" stroke-width="2" opacity=".5"/>`,
    back:(uid,pal)=>`<path d="M-24,-4 Q-27,-26 0,-29 Q27,-26 24,-4 Q25,10 16,16 Q18,2 7,-2 Q3,2 0,-2 Q-3,2 -7,-2 Q-18,2 -16,16 Q-25,10 -24,-4Z" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width="1"/>`,
    /* 측면: 정수리~뒤통수 캡 + 옆쪽(귀 위, 200~250°) 볼륨감 있는 큰 웨이브 뭉치 2개 */
    side:(uid,pal)=>{
      const cap = capWedge(324, 100, a=>24, 20);
      const waves=[215,250].map(a=>radialTuft(a,22,8,6.4,uid)).join('');
      const fore = `<path d="M19,-14 Q26,-7 18,-2 Q14,-8 15,-14 Q17,-16 19,-14Z" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width=".7"/>`;
      return `<path d="${cap}" fill="url(#wkHair${uid})" stroke="${OUTLINE}" stroke-width="1"/>${waves}${fore}`;
    }
  }
};

/* ── 소품(팔에 붙어 스윙) — 손 위치(로컬 y≈20)에 맞춰 부착 ── */
function wandProp(){
  return `<g transform="translate(0,19)">
    <rect x="-1.6" y="-2" width="3.2" height="20" rx="1.6" fill="#f4b93d" stroke="#c98a0f" stroke-width=".6"/>
    <path d="M0,-13 L2.5,-5.5 L9,-3.5 L3.6,1 L5.2,8 L0,4 L-5.2,8 L-3.6,1 L-9,-3.5 L-2.5,-5.5Z" fill="#c07fe8" stroke="#8e44ad" stroke-width="1"/>
  </g>`;
}
function staffProp(){
  return `<g transform="translate(0,19)">
    <rect x="-2" y="-38" width="4" height="40" rx="2" fill="#6a4526" stroke="#3f2a16" stroke-width=".6"/>
    <circle cx="0" cy="-42" r="7" fill="none" stroke="#3fa8e8" stroke-width="3.2"/>
    <circle cx="0" cy="-42" r="3.2" fill="#bfe6ff"/>
  </g>`;
}
function bookProp(){
  return `<g transform="translate(5,17) rotate(-8)">
    <rect x="-7.5" y="-5" width="15" height="19" rx="1.6" fill="#2f8f52" stroke="#155f31" stroke-width="1"/>
    <rect x="-7.5" y="-5" width="3.8" height="19" fill="#e6c14a"/>
    <circle cx="0" cy="4" r="2.4" fill="#ffe066"/>
  </g>`;
}
const PROPS = {girl:wandProp, elder:staffProp, doc:bookProp};

/* ── 뷰 3종 조립 (프로포션: 머리 지름≈52 = viewBox 120×150 안에서 약 2.5등신) ── */
function buildFront(uid, kind, pal){
  const prop = PROPS[kind];
  return `<g class="wk-view wk-front">
    ${legPart('wk-legL', 47, 78, uid, pal, kind==='boy'?'fur':kind==='girl'?'star':null)}
    ${legPart('wk-legR', 73, 78, uid, pal, kind==='boy'?'fur':kind==='girl'?'star':null)}
    <g transform="translate(60,58)"><g class="wk-body" style="transform-origin:0px 0px">${robeBody(uid,22,30,pal)}${bodyExtras(kind,uid,22,34,pal)}</g></g>
    ${armPart('wk-armL', 38, 56, uid, kind==='girl'?prop():null)}
    ${armPart('wk-armR', 82, 56, uid, (kind==='elder'||kind==='doc')?prop():null)}
    ${headFront(uid, kind, pal)}
  </g>`;
}
function buildBack(uid, kind, pal){
  return `<g class="wk-view wk-back">
    ${legPart('wk-legL', 47, 78, uid, pal, null)}
    ${legPart('wk-legR', 73, 78, uid, pal, null)}
    ${armPart('wk-armL', 38, 56, uid, null)}
    ${armPart('wk-armR', 82, 56, uid, null)}
    <g transform="translate(60,58)"><g class="wk-body" style="transform-origin:0px 0px">${robeBody(uid,22,30,pal)}
      <path d="M-11,3 L-15,22 L-3,24 L-1,5Z" fill="${darken(pal.robe,16)}" opacity=".55"/>
    </g></g>
    ${headBack(uid, kind, pal)}
  </g>`;
}
function buildSide(uid, kind, pal){
  const prop = PROPS[kind];
  return `<g class="wk-view wk-side">
    ${legPart('wk-legL', 57, 78, uid, pal, null)}
    ${legPart('wk-legR', 63, 78, uid, pal, null)}
    ${armPart('wk-armL', 52, 56, uid, null)}
    <g transform="translate(60,58)"><g class="wk-body" style="transform-origin:0px 0px">${robeBody(uid,17,28,pal)}</g></g>
    ${armPart('wk-armR', 74, 56, uid, prop?prop():null)}
    ${headSide(uid, kind, pal)}
  </g>`;
}

window.renderWalker = function(kind, size){
  kind = PALETTE[kind] ? kind : 'boy';
  const pal = PALETTE[kind];
  size = size || 90;
  const ph = Math.round(size * 1.25);
  const uid = 'wk'+(++WUID);
  const defs = defsFor(uid, pal);
  return `<div class="nm-walker" data-kind="${kind}" data-dir="s" style="width:${size}px;height:${ph}px">
    <svg viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg" overflow="visible">
      ${defs}
      <ellipse class="wk-shadow" cx="60" cy="108" rx="21" ry="5.5" fill="#000" opacity=".22"/>
      ${buildFront(uid, kind, pal)}
      ${buildBack(uid, kind, pal)}
      ${buildSide(uid, kind, pal)}
    </svg>
  </div>`;
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.renderWalker;
})();
