/* ============================================================
   수학사 네 컷 만화 — 공용 도형 어휘 (빌드 전용)

   data/story-comics-src/<유닛>.js 파트가 이 헬퍼를 받아 그림을 만들고,
   scripts/build-comics.js가 결과 문자열을 data/story-comics.js로 굽는다.
   런타임(브라우저)에는 완성된 SVG 문자열만 실리므로 이 파일은 로드되지 않는다.

   그림 규격: viewBox 0 0 200 140. 팔레트는 아래 C만 쓴다(앱 팔레트와 동일).
   ============================================================ */
'use strict';

/* 팔레트 — 그림 속 색은 여기 있는 값만 쓴다 */
const C = {
  ink:'#1A2233', blue:'#16417C', bluedeep:'#0E2C57', gold:'#C9A063',
  goldbright:'#F5D98B', red:'#D9534F', ok:'#2E9E6B', purple:'#8B6BC7',
  paper:'#fdf6e3', mist:'#f1f0ec', brown:'#8a6d46', sub:'#4a5468',
  grey:'#b0b7c3', wool:'#f5f1e6', cream:'#fdfaf3', sky:'#7ea4d6',
  /* 2026-10-04 셀셰이딩용 보조색 — 같은 색상의 밝기만 다른 한 단계 */
  wool2:'#e3dccb', grass:'#9bcf84', grass2:'#6fa85b', soil:'#b88a55', soil2:'#8f6636',
  stone:'#aab0ba', stone2:'#7d8493', sun:'#ffd45a', blush:'#f6a6a0',
};

/* 바깥 껍데기 — 모든 패널은 이걸로 감싼다 */
function svg(inner){
  return '<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">'+inner+'</svg>';
}

/* 막대 사람 — (x,y)가 몸통 중심, s=배율, col=선 색 */
function stick(x,y,s,col){
  col=col||C.blue;
  return '<g transform="translate('+x+','+y+') scale('+s+')" stroke="'+col+'" stroke-width="2.4" stroke-linecap="round" fill="none">'
    +'<circle cx="0" cy="-18" r="6" fill="#fff"/>'
    +'<line x1="0" y1="-12" x2="0" y2="6"/>'
    +'<line x1="0" y1="-6" x2="-9" y2="0"/><line x1="0" y1="-6" x2="9" y2="0"/>'
    +'<line x1="0" y1="6" x2="-7" y2="18"/><line x1="0" y1="6" x2="7" y2="18"/></g>';
}

/* 양 — (x,y) 몸통 중심, s=배율, flip=왼쪽 보기.
   2026-08-31 다시 그림: 타원+점 머리가 양으로 안 보인다는 원장 지적 →
   뭉게뭉게 양털 실루엣 + 귀 + 정수리 털뭉치 + 흰 눈으로 교체(크기·중심 호환) */
function sheep(x,y,s,flip){
  /* translate(x,y)로 이미 로컬 원점이 양 중심이므로 거울은 scale(-1,1)만.
     (예전 translate(-2x) 덧붙임은 양을 3x 위치로 날려 화면 밖으로 보냈다 — 실측으로 확인) */
  const f=flip?'scale(-1,1)':'';
  return '<g transform="translate('+x+','+y+') scale('+s+') '+f+'">'
    +'<line x1="-8" y1="8" x2="-8" y2="17" stroke="'+C.ink+'" stroke-width="2.2"/>'
    +'<line x1="6" y1="8" x2="6" y2="17" stroke="'+C.ink+'" stroke-width="2.2"/>'
    +'<path d="M -16 0 Q -21 -6 -14 -9 Q -13 -16 -5 -13 Q 0 -18 6 -13 Q 14 -16 14 -8 Q 20 -4 15 2 Q 15 8 7 8 Q 1 13 -5 9 Q -13 11 -16 0 Z" '
      +'fill="'+C.wool+'" stroke="'+C.ink+'" stroke-width="2" stroke-linejoin="round"/>'
    +'<ellipse cx="10.5" cy="-9.5" rx="4" ry="2.2" fill="'+C.ink+'" transform="rotate(-28 10.5 -9.5)"/>'
    +'<ellipse cx="15.5" cy="-5" rx="6" ry="5.2" fill="'+C.ink+'"/>'
    +'<circle cx="13.5" cy="-11" r="3.2" fill="'+C.wool+'" stroke="'+C.ink+'" stroke-width="1.6"/>'
    +'<circle cx="17.2" cy="-6.4" r="1.5" fill="#fff"/></g>';
}

/* 주머니 + 조약돌 n개 */
function pouch(x,y,n){
  let dots='';
  for(let i=0;i<n;i++){dots+='<circle cx="'+(x-8+(i%3)*8)+'" cy="'+(y+2+Math.floor(i/3)*8)+'" r="3.2" fill="'+C.sub+'"/>';}
  return '<path d="M '+(x-15)+' '+(y-6)+' Q '+x+' '+(y-16)+' '+(x+15)+' '+(y-6)+' L '+(x+12)+' '+(y+16)+' Q '+x+' '+(y+22)+' '+(x-12)+' '+(y+16)+' Z" fill="#EAC996" stroke="'+C.ink+'" stroke-width="2"/>'
    +'<line x1="'+(x-15)+'" y1="'+(y-6)+'" x2="'+(x+15)+'" y2="'+(y-6)+'" stroke="'+C.ink+'" stroke-width="2"/>'+dots;
}

/* 누미 — 앱 마스코트(개념 노트의 마법사)를 원본 도형으로 그린 만화용 캐릭터.
   (x,y)=몸통 중심, s=배율. 만화 속 "궁금해하는 아이·관찰자·안내자" 역할 전용 —
   역사 인물은 stick()을 그대로 쓴다(누미가 실존 인물 행세를 하지 않도록). */
function numi(x,y,s){
  return '<g transform="translate('+x+','+y+') scale('+s+')">'
    /* 몸통(방울) */
    +'<circle cx="0" cy="2" r="12" fill="'+C.paper+'" stroke="'+C.ink+'" stroke-width="2"/>'
    /* 고깔 모자 + 챙 + 별 */
    +'<polygon points="-9,-8 9,-8 2,-26" fill="'+C.purple+'" stroke="'+C.ink+'" stroke-width="1.8" stroke-linejoin="round"/>'
    +'<rect x="-12" y="-9.5" width="24" height="3.6" rx="1.8" fill="'+C.purple+'" stroke="'+C.ink+'" stroke-width="1.6"/>'
    +'<polygon points="2,-22 3.2,-19 6.4,-19 3.8,-17 4.8,-14 2,-15.8 -0.8,-14 0.2,-17 -2.4,-19 0.8,-19" fill="'+C.goldbright+'"/>'
    /* 눈·미소 */
    +'<circle cx="-4" cy="0" r="1.6" fill="'+C.ink+'"/>'
    +'<circle cx="4" cy="0" r="1.6" fill="'+C.ink+'"/>'
    +'<path d="M -4 6 Q 0 9.5 4 6" fill="none" stroke="'+C.ink+'" stroke-width="1.8" stroke-linecap="round"/></g>';
}

/* ══════════════════════════════════════════════════════════
   캐릭터 로스터 — 그림은 assets/images/characters/<이름>.png (외주 작화, 투명 배경)

   좌표 규약은 도형 시절과 그대로다: (x,y)=몸통 중심, s=배율.
   PNG는 정사각형 캔버스에 인물이 6% 여백을 두고 가운데 놓여 있으므로,
   한 변 CHAR_BOX(=46)로 그리면 인물 키가 0.88×46≈40이 되어
   예전 도형 캐릭터가 차지하던 범위(머리끝 y-23 ~ 발밑 y+17)와 일치한다.
   → 만화 380컷의 좌표를 하나도 고치지 않고 그림만 바뀐다.

   stick()은 쓰지 않는다(검사기가 경고). 아래 12종에서 고를 것.
   ══════════════════════════════════════════════════════════ */
const CHAR_BOX = 46;      /* s=1일 때 PNG 정사각형 한 변 */
const CHAR_TOP = -26.24;  /* s=1일 때 정사각형 윗변의 y (발밑이 y+17에 오도록) */
/* 2026-10-04: 인물이 컷 높이의 29%뿐이라 장면 속 배우가 아니라 도장처럼 보였다.
   발밑(y+17)과 x는 그대로 두고 키만 키운다 — 좌표를 안 고쳐도 서 있는 자리는 같다. */
const CHAR_BOOST = 1.65;

function charImg(name,x,y,s){
  s = (s===undefined||s===null) ? 1 : s;
  const S = CHAR_BOX*s*(name==='numi' ? 1.3 : CHAR_BOOST);   /* 누미는 256px 옛 그림이라 예전 배율 유지 */
  const foot = y + 17*s;                 /* 발밑 y — 키울 때 고정점 */
  return '<image href="assets/images/characters/'+name+'.png"'
    +' x="'+(x-S/2).toFixed(2)+'" y="'+(foot-S*0.94).toFixed(2)+'"'
    +' width="'+S.toFixed(2)+'" height="'+S.toFixed(2)+'"/>';
}

/* 왕·황제 배역 */
function king(x,y,s){ return charImg('king',x,y,s); }
/* 현자·스승·연장자 배역(수염+지팡이) */
function sage(x,y,s){ return charImg('sage',x,y,s); }
/* 고대 그리스 수학자 — 유클리드·피타고라스·아르키메데스·히파소스·탈레스 */
function greek(x,y,s){ return charImg('greek',x,y,s); }
/* 이슬람·페르시아·인도 학자 — 알콰리즈미·브라마굽타·아부 알와파·알비루니 */
function scholar(x,y,s){ return charImg('scholar',x,y,s); }
/* 15~19세기 유럽 수학자 — 뉴턴·라이프니츠·데카르트·오일러·네이피어 등 */
function wig(x,y,s){ return charImg('wig',x,y,s); }
/* 남자 아이·학생(어린 가우스 포함) */
function boy(x,y,s){ return charImg('boy',x,y,s); }
/* 여자 아이·학생 */
function girl(x,y,s){ return charImg('girl',x,y,s); }
/* 양치기 배역 */
function shepherd(x,y,s){ return charImg('shepherd',x,y,s); }
/* 필경사·기록자 배역(깃펜) */
function scribe(x,y,s){ return charImg('scribe',x,y,s); }
/* 상인 배역(앞치마+동전) */
function merchant(x,y,s){ return charImg('merchant',x,y,s); }
/* 천문학자·항해사 배역 */
function astronomer(x,y,s){ return charImg('astronomer',x,y,s); }
/* 앱 마스코트 누미 — 이름 없는 질문자·관찰자·안내자 전용 */
function numi(x,y,s){ return charImg('numi',x,y,s); }


/* 실존 위인 22명 — 원장 승인(2026-10-04). assets/images/characters/fig-<이름>.png, 512×512 투명, 위 12역과 같은 좌표 규약((x,y)=몸통 중심, s=배율). */
function gaussBoy(x,y,s){ return charImg('fig-gauss-boy',x,y,s); }
function gauss(x,y,s){ return charImg('fig-gauss',x,y,s); }
function recorde(x,y,s){ return charImg('fig-recorde',x,y,s); }
function goldbach(x,y,s){ return charImg('fig-goldbach',x,y,s); }
function oughtred(x,y,s){ return charImg('fig-oughtred',x,y,s); }
function euclid(x,y,s){ return charImg('fig-euclid',x,y,s); }
function ptolemy1(x,y,s){ return charImg('fig-ptolemy1',x,y,s); }
function alkhwarizmi(x,y,s){ return charImg('fig-alkhwarizmi',x,y,s); }
function liuhui(x,y,s){ return charImg('fig-liuhui',x,y,s); }
function wallis(x,y,s){ return charImg('fig-wallis',x,y,s); }
function descartes(x,y,s){ return charImg('fig-descartes',x,y,s); }
function pythagoras(x,y,s){ return charImg('fig-pythagoras',x,y,s); }
function hippasus(x,y,s){ return charImg('fig-hippasus',x,y,s); }
function napier(x,y,s){ return charImg('fig-napier',x,y,s); }
function euler(x,y,s){ return charImg('fig-euler',x,y,s); }
function leibniz(x,y,s){ return charImg('fig-leibniz',x,y,s); }
function newton(x,y,s){ return charImg('fig-newton',x,y,s); }
function fermat(x,y,s){ return charImg('fig-fermat',x,y,s); }
function viete(x,y,s){ return charImg('fig-viete',x,y,s); }
function alwafa(x,y,s){ return charImg('fig-alwafa',x,y,s); }
function archimedes(x,y,s){ return charImg('fig-archimedes',x,y,s); }
function brahmagupta(x,y,s){ return charImg('fig-brahmagupta',x,y,s); }

/* 화살표 (x1,y1)→(x2,y2) */
function arrow(x1,y1,x2,y2,col,w){
  col=col||C.gold; w=w||3;
  const ang=Math.atan2(y2-y1,x2-x1), L=9;
  const hx1=x2-L*Math.cos(ang-0.42), hy1=y2-L*Math.sin(ang-0.42);
  const hx2=x2-L*Math.cos(ang+0.42), hy2=y2-L*Math.sin(ang+0.42);
  return '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round"/>'
    +'<polygon points="'+x2+','+y2+' '+hx1.toFixed(1)+','+hy1.toFixed(1)+' '+hx2.toFixed(1)+','+hy2.toFixed(1)+'" fill="'+col+'"/>';
}

/* 양피지/책장 — 낡은 문서 느낌의 판 */
function paper(x,y,w,h){
  return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="'+C.paper+'" stroke="'+C.gold+'" stroke-width="2.5"/>';
}

/* 말풍선 — (cx,cy) 중심 타원 + (tx,ty) 방향 꼬리 */
function bubble(cx,cy,rx,ry,tx,ty){
  return '<ellipse cx="'+cx+'" cy="'+cy+'" rx="'+rx+'" ry="'+ry+'" fill="#fff" stroke="'+C.ink+'" stroke-width="2"/>'
    +'<path d="M '+(cx+(tx-cx)*0.5)+' '+(cy+(ty-cy)*0.55)+' L '+tx+' '+ty+' L '+(cx+(tx-cx)*0.62)+' '+(cy+(ty-cy)*0.42)+' Z" fill="#fff" stroke="'+C.ink+'" stroke-width="2"/>';
}

/* 텍스트 — 그림 속 글자는 이야기의 대상(기호·낱말·숫자)만! */
function txt(x,y,size,col,str,extra){
  return '<text x="'+x+'" y="'+y+'" text-anchor="middle" font-size="'+size+'" font-weight="800" fill="'+col+'"'
    +(extra?' '+extra:'')+'>'+str+'</text>';
}

/* 땅/지평선 */
function ground(y){
  return '<line x1="0" y1="'+y+'" x2="200" y2="'+y+'" stroke="'+C.gold+'" stroke-width="3"/>';
}


/* ══════════════════════════════════════════════════════════
   셀셰이딩 소품 (2026-10-04) — 단색 도형 위에 그림자 한 겹·하이라이트 한 겹.
   defs/그라데이션을 쓰지 않는다: 한 화면에 컷이 여러 장 떠도 id 충돌이 없고,
   숨은 컨테이너에서도 색이 사라지지 않는다. 색은 전부 C 팔레트.
   ══════════════════════════════════════════════════════════ */
const OL = C.ink;

/* 구름 뭉치(양털·구름 공용) — circles=[[cx,cy,r],…]. 윤곽선 → 바탕 → 아래쪽 그림자 → 위쪽 하이라이트 */
function puff(circles, base, shade, ow){
  ow = ow || 2.2;
  let s = '';
  circles.forEach(c => { s += '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+c[2]+'" fill="'+OL+'" stroke="'+OL+'" stroke-width="'+(ow*2)+'"/>'; });
  circles.forEach(c => { s += '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+c[2]+'" fill="'+base+'"/>'; });
  circles.forEach(c => { s += '<circle cx="'+(c[0]+c[2]*0.12)+'" cy="'+(c[1]+c[2]*0.22)+'" r="'+(c[2]*0.72)+'" fill="'+shade+'"/>'; });
  circles.forEach(c => { s += '<circle cx="'+(c[0]-c[2]*0.05)+'" cy="'+(c[1]-c[2]*0.12)+'" r="'+(c[2]*0.62)+'" fill="'+base+'"/>'; });
  circles.forEach(c => { s += '<ellipse cx="'+(c[0]-c[2]*0.32)+'" cy="'+(c[1]-c[2]*0.4)+'" rx="'+(c[2]*0.22)+'" ry="'+(c[2]*0.13)+'" fill="#fff" opacity=".8" transform="rotate(-30 '+(c[0]-c[2]*0.32)+' '+(c[1]-c[2]*0.4)+')"/>'; });
  return s;
}

/* 양 — 복슬복슬 양털(그림자·하이라이트) + 얼굴·귀·발굽. (x,y)=몸통 중심, s=배율, flip=왼쪽 보기 */
function sheep2(x,y,s,flip){
  const f = flip ? ' scale(-1,1)' : '';
  const legs = [[-13,17],[-4,19],[8,19],[17,17]].map(l =>
    '<rect x="'+(l[0]-2.6)+'" y="'+l[1]+'" width="5.2" height="13" rx="2.4" fill="'+C.ink+'"/>'
    +'<rect x="'+(l[0]-2.6)+'" y="'+(l[1]+10)+'" width="5.2" height="3.4" rx="1.6" fill="'+C.bluedeep+'"/>').join('');
  const wool = puff([[-14,2,12],[-1,-7,13.5],[14,-1,12.5],[3,8,13],[-10,10,11.5],[17,10,10]], C.wool, C.wool2, 2.1);
  const head = '<ellipse cx="29" cy="-4" rx="10.5" ry="9" transform="rotate(-8 29 -4)" fill="'+C.ink+'"/>'
    +'<ellipse cx="22" cy="-10" rx="5.2" ry="3" transform="rotate(-30 22 -10)" fill="'+C.ink+'"/>'
    +'<ellipse cx="22.4" cy="-10" rx="3.2" ry="1.6" transform="rotate(-30 22.4 -10)" fill="'+C.blush+'"/>'
    +'<circle cx="26" cy="-13" r="6.2" fill="'+C.wool+'" stroke="'+OL+'" stroke-width="2"/>'
    +'<circle cx="24.2" cy="-14.8" r="2.2" fill="#fff" opacity=".85"/>'
    +'<circle cx="31" cy="-6" r="3.4" fill="#fff"/><circle cx="31.9" cy="-5.6" r="1.8" fill="'+C.ink+'"/>'
    +'<ellipse cx="37.5" cy="0" rx="4" ry="2.6" fill="'+C.bluedeep+'"/><ellipse cx="37" cy="-0.8" rx="1.6" ry="0.9" fill="'+C.blush+'"/>'
    +'<ellipse cx="29" cy="2.6" rx="2.6" ry="1.5" fill="'+C.blush+'" opacity=".75"/>';
  return '<g transform="translate('+x+','+y+') scale('+s+')'+f+'">'
    +'<ellipse cx="2" cy="31" rx="26" ry="3.4" fill="'+C.ink+'" opacity=".13"/>'
    +legs+wool+head+'</g>';
}

/* 조약돌 — (x,y) 중심, r 반지름. 그림자 한 겹 + 하이라이트 */
function pebble(x,y,r,col){
  col = col || C.stone;
  const dk = (col === C.stone) ? C.stone2 : C.bluedeep;
  return '<ellipse cx="'+(x+r*0.15)+'" cy="'+(y+r*0.9)+'" rx="'+(r*1.05)+'" ry="'+(r*0.3)+'" fill="'+OL+'" opacity=".16"/>'
    +'<ellipse cx="'+x+'" cy="'+y+'" rx="'+r+'" ry="'+(r*0.82)+'" fill="'+col+'" stroke="'+OL+'" stroke-width="1.8"/>'
    +'<path d="M '+(x-r*0.7)+' '+(y+r*0.3)+' Q '+x+' '+(y+r*1.05)+' '+(x+r*0.85)+' '+(y+r*0.15)+' Q '+(x+r*0.3)+' '+(y+r*0.75)+' '+(x-r*0.7)+' '+(y+r*0.3)+' Z" fill="'+dk+'" opacity=".55"/>'
    +'<ellipse cx="'+(x-r*0.32)+'" cy="'+(y-r*0.3)+'" rx="'+(r*0.3)+'" ry="'+(r*0.18)+'" fill="#fff" opacity=".8" transform="rotate(-28 '+(x-r*0.32)+' '+(y-r*0.3)+')"/>';
}

/* 가죽 주머니 — 입구를 끈으로 묶었고 조약돌 n개가 보인다. (x,y)=바닥 중심 */
function pouch2(x,y,n){
  let stones = '';
  [[-6,-31],[5,-32],[-0.5,-37],[-10,-35],[9,-36]].slice(0, Math.min(n,5)).forEach(q => { stones += pebble(x+q[0], y+q[1], 5.4); });
  return stones
    +'<path d="M '+(x-17)+' '+(y-26)+' Q '+(x-23)+' '+(y-4)+' '+(x-13)+' '+(y-1)+' Q '+x+' '+(y+4)+' '+(x+13)+' '+(y-1)+' Q '+(x+23)+' '+(y-4)+' '+(x+17)+' '+(y-26)+' Q '+x+' '+(y-31)+' '+(x-17)+' '+(y-26)+' Z" fill="'+C.soil+'" stroke="'+OL+'" stroke-width="2.2" stroke-linejoin="round"/>'
    +'<path d="M '+(x+8)+' '+(y-27)+' Q '+(x+20)+' '+(y-8)+' '+(x+12)+' '+(y-1)+' Q '+(x+2)+' '+(y+2)+' '+(x-4)+' '+(y+1)+' Q '+(x+12)+' '+(y-8)+' '+(x+8)+' '+(y-27)+' Z" fill="'+C.soil2+'" opacity=".55"/>'
    +'<path d="M '+(x-14)+' '+(y-25)+' Q '+x+' '+(y-21)+' '+(x+14)+' '+(y-25)+'" fill="none" stroke="'+C.gold+'" stroke-width="3.2" stroke-linecap="round"/>'
    +'<path d="M '+(x+1)+' '+(y-23)+' L '+(x-3)+' '+(y-16)+' M '+(x+1)+' '+(y-23)+' L '+(x+6)+' '+(y-16)+'" fill="none" stroke="'+C.gold+'" stroke-width="2.4" stroke-linecap="round"/>'
    +'<path d="M '+(x-10)+' '+(y-12)+' Q '+(x-12)+' '+(y-7)+' '+(x-8)+' '+(y-3)+'" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".5"/>'
    +'<path d="M '+(x-9)+' '+(y-14)+' L '+(x-9)+' '+(y-5)+' M '+(x+9)+' '+(y-14)+' L '+(x+9)+' '+(y-5)+'" fill="none" stroke="'+C.soil2+'" stroke-width="1.3" stroke-dasharray="2 2.4" opacity=".7"/>';
}

/* 나무 울타리 — (x,y)=땅에 닿는 왼쪽 끝, w 너비, 기둥 n개 */
function fence(x,y,w,n){
  n = n || 3;
  let s = '';
  const gap = (w - 8) / (n - 1);
  [y-30, y-16].forEach(ry => {
    s += '<rect x="'+x+'" y="'+ry+'" width="'+w+'" height="7" rx="3" fill="'+C.soil+'" stroke="'+OL+'" stroke-width="2"/>'
      +'<rect x="'+(x+3)+'" y="'+(ry+1.4)+'" width="'+(w-6)+'" height="2" rx="1" fill="#fff" opacity=".28"/>';
  });
  for(let i=0;i<n;i++){
    const px = x + i*gap;
    s += '<rect x="'+px+'" y="'+(y-40)+'" width="9" height="42" rx="4" fill="'+C.soil+'" stroke="'+OL+'" stroke-width="2"/>'
      +'<rect x="'+(px+5.2)+'" y="'+(y-37)+'" width="2.6" height="36" rx="1.3" fill="'+C.soil2+'" opacity=".55"/>'
      +'<rect x="'+(px+1.6)+'" y="'+(y-37)+'" width="1.8" height="14" rx=".9" fill="#fff" opacity=".4"/>';
  }
  return s;
}

/* 풀밭 — y 에서 아래로 연두 띠 + 풀잎 + 작은 꽃. 땅 위 물건은 이 선에 닿게 놓는다. */
function meadow(y, tufts){
  let s = '<path d="M 0 '+y+' Q 50 '+(y-5)+' 100 '+y+' T 200 '+y+' L 200 140 L 0 140 Z" fill="'+C.grass+'"/>'
    +'<path d="M 0 '+(y+9)+' Q 60 '+(y+4)+' 120 '+(y+10)+' T 200 '+(y+7)+' L 200 140 L 0 140 Z" fill="'+C.grass2+'" opacity=".55"/>'
    +'<path d="M 0 '+y+' Q 50 '+(y-5)+' 100 '+y+' T 200 '+y+'" fill="none" stroke="'+C.grass2+'" stroke-width="2.4" stroke-linecap="round"/>';
  (tufts || [14, 70, 126, 186]).forEach((tx, i) => {
    const ty = y + 10 + (i % 2) * 8;
    s += '<path d="M '+tx+' '+ty+' l -3 -7 M '+tx+' '+ty+' l 0 -9 M '+tx+' '+ty+' l 3 -7" fill="none" stroke="'+C.grass2+'" stroke-width="2" stroke-linecap="round"/>';
  });
  return s;
}
function flower(x,y,col){
  col = col || C.blush;
  let s = '<path d="M '+x+' '+y+' l 0 8" stroke="'+C.grass2+'" stroke-width="1.8" stroke-linecap="round"/>';
  for(let i=0;i<5;i++){ const a = i*72*Math.PI/180; s += '<circle cx="'+(x+Math.sin(a)*3.4).toFixed(1)+'" cy="'+(y-Math.cos(a)*3.4).toFixed(1)+'" r="2.4" fill="'+col+'" stroke="'+OL+'" stroke-width=".9"/>'; }
  return s + '<circle cx="'+x+'" cy="'+y+'" r="1.8" fill="'+C.sun+'"/>';
}
function sunDisc(x,y,r){
  let s = '';
  for(let i=0;i<8;i++){ const a = i*45*Math.PI/180; s += '<line x1="'+(x+Math.cos(a)*(r+3)).toFixed(1)+'" y1="'+(y+Math.sin(a)*(r+3)).toFixed(1)+'" x2="'+(x+Math.cos(a)*(r+7)).toFixed(1)+'" y2="'+(y+Math.sin(a)*(r+7)).toFixed(1)+'" stroke="'+C.sun+'" stroke-width="2.6" stroke-linecap="round"/>'; }
  return s + '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+C.sun+'" stroke="'+OL+'" stroke-width="2"/><ellipse cx="'+(x-r*0.3)+'" cy="'+(y-r*0.35)+'" rx="'+(r*0.3)+'" ry="'+(r*0.18)+'" fill="#fff" opacity=".7" transform="rotate(-35 '+(x-r*0.3)+' '+(y-r*0.35)+')"/>';
}
function moonDisc(x,y,r){
  return '<path d="M '+x+' '+(y-r)+' A '+r+' '+r+' 0 1 0 '+(x+r*0.9)+' '+(y+r*0.5)+' A '+(r*0.8)+' '+(r*0.8)+' 0 1 1 '+x+' '+(y-r)+' Z" fill="'+C.goldbright+'" stroke="'+OL+'" stroke-width="2" stroke-linejoin="round"/>'
    +'<circle cx="'+(x-r*0.35)+'" cy="'+(y+r*0.1)+'" r="'+(r*0.14)+'" fill="'+C.gold+'" opacity=".6"/>';
}
function cloud(x,y,s){
  s = s || 1;
  return '<g transform="translate('+x+','+y+') scale('+s+')">'+puff([[-9,2,7],[0,-3,9],[10,1,7.5]], '#fff', '#dfe9f7', 1.8)+'</g>';
}
function star4(x,y,r){
  return '<path d="M '+x+' '+(y-r)+' Q '+x+' '+y+' '+(x+r)+' '+y+' Q '+x+' '+y+' '+x+' '+(y+r)+' Q '+x+' '+y+' '+(x-r)+' '+y+' Q '+x+' '+y+' '+x+' '+(y-r)+' Z" fill="'+C.goldbright+'" stroke="'+OL+'" stroke-width="1.2" stroke-linejoin="round"/>';
}
/* 느낌표 — 글자가 아니라 그린 도형 */
function bang(x,y,s,col){
  s = s || 1; col = col || C.red;
  return '<g transform="translate('+x+','+y+') scale('+s+')"><rect x="-4.5" y="-24" width="9" height="26" rx="4.5" fill="'+col+'" stroke="'+OL+'" stroke-width="2"/><circle cx="0" cy="11" r="5" fill="'+col+'" stroke="'+OL+'" stroke-width="2"/><ellipse cx="-1.6" cy="-17" rx="1.4" ry="4" fill="#fff" opacity=".6"/></g>';
}
/* 가는 끈(점선 대신) — 두 점을 부드러운 곡선으로, 끝에 작은 고리 */
function rope(x1,y1,x2,y2,col,bend){
  col = col || C.gold; bend = bend == null ? 10 : bend;
  const mx = (x1+x2)/2, my = (y1+y2)/2 - bend;
  const ang = Math.atan2(y2-my, x2-mx), L = 7;
  const hx1 = x2 - L*Math.cos(ang-0.5), hy1 = y2 - L*Math.sin(ang-0.5), hx2 = x2 - L*Math.cos(ang+0.5), hy2 = y2 - L*Math.sin(ang+0.5);
  return '<path d="M '+x1+' '+y1+' Q '+mx+' '+my+' '+x2+' '+y2+'" fill="none" stroke="'+col+'" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="1 5.5"/>'
    +'<path d="M '+hx1.toFixed(1)+' '+hy1.toFixed(1)+' L '+x2+' '+y2+' L '+hx2.toFixed(1)+' '+hy2.toFixed(1)+'" fill="none" stroke="'+col+'" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>';
}


/* ══════════════════════════════════════════════════════════
   유아(N) 만화 소품 (2026-10-05) — 실사 물건 PNG + 셀셰이딩 무대(물·징검돌·계단·가게·눈금 막대).
   ══════════════════════════════════════════════════════════ */
/* 실사 물건 — assets/images/real/<name>.png(512 투명). (x,y)=바닥 중심, h=높이(px, viewBox 기준). 바닥 그림자 한 겹. */
function real(name,x,y,h,flip){
  h = h || 28;
  const img = '<image href="assets/images/real/'+name+'.png" x="'+(x-h/2).toFixed(1)+'" y="'+(y-h).toFixed(1)+'" width="'+h+'" height="'+h+'"/>';
  return '<ellipse cx="'+x+'" cy="'+(y-1)+'" rx="'+(h*0.36).toFixed(1)+'" ry="'+(h*0.07).toFixed(1)+'" fill="'+OL+'" opacity=".14"/>'
    + (flip ? '<g transform="translate('+(2*x)+',0) scale(-1,1)">'+img+'</g>' : img);   /* flip = 왼쪽 보기 */
}
/* 물(개울) — y 에서 아래로 */
function water(y){
  let s = '<path d="M 0 '+y+' Q 50 '+(y-4)+' 100 '+y+' T 200 '+y+' L 200 140 L 0 140 Z" fill="'+C.sky+'"/>';
  [[30,y+14],[96,y+22],[156,y+12],[64,y+30],[176,y+28]].forEach(w => {
    s += '<path d="M '+(w[0]-8)+' '+w[1]+' q 4 -3 8 0 t 8 0" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round" opacity=".75"/>';
  });
  return s;
}
/* 징검돌 — 납작한 돌 위에 숫자. hi=강조색(금) */
function stepStone(x,y,label,hi){
  const col = hi ? C.goldbright : C.stone;
  return '<ellipse cx="'+x+'" cy="'+(y+4)+'" rx="14" ry="4.5" fill="'+OL+'" opacity=".18"/>'
    +'<ellipse cx="'+x+'" cy="'+y+'" rx="13" ry="7" fill="'+col+'" stroke="'+OL+'" stroke-width="2"/>'
    +'<ellipse cx="'+(x-5)+'" cy="'+(y-3)+'" rx="5" ry="1.6" fill="#fff" opacity=".6"/>'
    +(label!=null&&label!=='' ? '<text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-size="11" font-weight="800" fill="'+C.ink+'">'+label+'</text>' : '');
}
/* 폴짝 — 포물선 화살표 */
function hop(x1,x2,y,h,col){
  col = col || C.red; h = h || 18;
  const mx = (x1+x2)/2, dir = x2 > x1 ? 1 : -1;
  return '<path d="M '+x1+' '+y+' Q '+mx+' '+(y-h)+' '+x2+' '+y+'" fill="none" stroke="'+col+'" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="1 5"/>'
    +'<path d="M '+(x2-dir*6)+' '+(y-6)+' L '+x2+' '+y+' L '+(x2-dir*7.5)+' '+(y+1)+'" fill="none" stroke="'+col+'" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>';
}
/* 계단 — 왼쪽 아래에서 오른쪽 위로 n칸. (x,y)=맨 아래 왼쪽, w·h=한 칸. labels=아래부터 숫자 표시 여부 */
function stairs(x,y,n,w,h,labels,hiIdx){
  let s = '';
  for(let i=0;i<n;i++){
    const sx = x + i*w, sy = y - (i+1)*h;
    const col = (hiIdx===i) ? C.goldbright : C.cream;
    s += '<rect x="'+sx+'" y="'+sy+'" width="'+(n-i)*w+'" height="'+h+'" fill="'+col+'" stroke="'+OL+'" stroke-width="1.8"/>'
      +'<rect x="'+(sx+2)+'" y="'+(sy+2)+'" width="'+(w-4)+'" height="2" rx="1" fill="#fff" opacity=".7"/>';
    if(labels) s += '<text x="'+(sx+w/2)+'" y="'+(sy+h-4)+'" text-anchor="middle" font-size="9" font-weight="800" fill="'+C.sub+'">'+(i+1)+'</text>';
  }
  return s;
}
/* 작은 가게(차양 줄무늬) — (x,y)=땅에 닿는 왼쪽, 폭 w */
function stall(x,y,w){
  w = w || 40;
  let stripes = '';
  for(let i=0;i<5;i++) stripes += '<rect x="'+(x+i*w/5)+'" y="'+(y-52)+'" width="'+(w/5)+'" height="12" fill="'+(i%2?'#fff':C.red)+'"/>';
  return '<rect x="'+(x+3)+'" y="'+(y-40)+'" width="'+(w-6)+'" height="40" fill="'+C.cream+'" stroke="'+OL+'" stroke-width="2"/>'
    +'<rect x="'+(x+3)+'" y="'+(y-22)+'" width="'+(w-6)+'" height="8" fill="'+C.soil+'" stroke="'+OL+'" stroke-width="1.6"/>'
    +stripes+'<rect x="'+x+'" y="'+(y-52)+'" width="'+w+'" height="12" fill="none" stroke="'+OL+'" stroke-width="2"/>'
    +'<path d="M '+x+' '+(y-40)+' q '+(w/10)+' 5 '+(w/5)+' 0 q '+(w/10)+' 5 '+(w/5)+' 0 q '+(w/10)+' 5 '+(w/5)+' 0 q '+(w/10)+' 5 '+(w/5)+' 0 q '+(w/10)+' 5 '+(w/5)+' 0" fill="'+C.red+'" stroke="'+OL+'" stroke-width="1.6"/>';
}
/* 눈금 막대(탤리 막대) — 세로 나무 막대에 가로 눈금 n개. (x,y)=바닥 중심, h 높이 */
function tallyStick(x,y,h,n){
  let s = '<rect x="'+(x-5)+'" y="'+(y-h)+'" width="10" height="'+h+'" rx="4" fill="'+C.soil+'" stroke="'+OL+'" stroke-width="2"/>'
    +'<rect x="'+(x+1)+'" y="'+(y-h+3)+'" width="2.4" height="'+(h-6)+'" rx="1.2" fill="'+C.soil2+'" opacity=".6"/>';
  for(let i=0;i<n;i++){ const ty = y - h + 10 + i*((h-18)/Math.max(1,n-1 || 1)); s += '<line x1="'+(x-7)+'" y1="'+ty.toFixed(1)+'" x2="'+(x+7)+'" y2="'+ty.toFixed(1)+'" stroke="'+OL+'" stroke-width="2.4" stroke-linecap="round"/>'; }
  return s;
}
/* 탤리 표시 — n개(5마다 비스듬한 묶음). (x,y)=왼쪽 아래, h 높이 */
function tallyMarks(x,y,n,h,col){
  h = h || 26; col = col || C.ink;
  let s = '', cx = x;
  for(let i=0;i<n;i++){
    const inGroup = i % 5;
    if(inGroup === 4){
      s += '<line x1="'+(cx-34)+'" y1="'+(y-4)+'" x2="'+(cx+2)+'" y2="'+(y-h+4)+'" stroke="'+C.red+'" stroke-width="3" stroke-linecap="round"/>';
      cx += 14;
    } else {
      s += '<line x1="'+cx+'" y1="'+y+'" x2="'+cx+'" y2="'+(y-h)+'" stroke="'+col+'" stroke-width="3.2" stroke-linecap="round"/>';
      cx += 9;
    }
  }
  return s;
}
/* 강조 고리 */
function ring(x,y,r,col){ return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="none" stroke="'+(col||C.gold)+'" stroke-width="3"/>'; }

module.exports = { real, water, stepStone, hop, stairs, stall, tallyStick, tallyMarks, ring, C, svg, stick, sheep, sheep2, pebble, pouch2, fence, meadow, flower, sunDisc, moonDisc, cloud, star4, bang, rope, puff, numi, pouch, arrow, paper, bubble, txt, ground,
  king, sage, greek, scholar, wig, boy, girl, shepherd, scribe, merchant, astronomer,
  gaussBoy, gauss, recorde, goldbach, oughtred, euclid, ptolemy1, alkhwarizmi, liuhui, wallis, descartes, pythagoras, hippasus, napier, euler, leibniz, newton, fermat, viete, alwafa, archimedes, brahmagupta };
