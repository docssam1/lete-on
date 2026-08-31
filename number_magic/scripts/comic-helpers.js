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

module.exports = { C, svg, stick, sheep, numi, pouch, arrow, paper, bubble, txt, ground };
