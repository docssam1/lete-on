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

/* 양 — (x,y) 몸통 중심, s=배율, flip=왼쪽 보기 */
function sheep(x,y,s,flip){
  const f=flip?'scale(-1,1) translate('+(-2*x)+',0)':'';
  return '<g transform="translate('+x+','+y+') scale('+s+') '+f+'">'
    +'<ellipse cx="0" cy="0" rx="16" ry="10" fill="'+C.wool+'" stroke="'+C.ink+'" stroke-width="2"/>'
    +'<circle cx="14" cy="-6" r="6" fill="'+C.ink+'"/>'
    +'<circle cx="16" cy="-7" r="1.4" fill="#fff"/>'
    +'<line x1="-8" y1="9" x2="-8" y2="16" stroke="'+C.ink+'" stroke-width="2"/>'
    +'<line x1="6" y1="9" x2="6" y2="16" stroke="'+C.ink+'" stroke-width="2"/></g>';
}

/* 주머니 + 조약돌 n개 */
function pouch(x,y,n){
  let dots='';
  for(let i=0;i<n;i++){dots+='<circle cx="'+(x-8+(i%3)*8)+'" cy="'+(y+2+Math.floor(i/3)*8)+'" r="3.2" fill="'+C.sub+'"/>';}
  return '<path d="M '+(x-15)+' '+(y-6)+' Q '+x+' '+(y-16)+' '+(x+15)+' '+(y-6)+' L '+(x+12)+' '+(y+16)+' Q '+x+' '+(y+22)+' '+(x-12)+' '+(y+16)+' Z" fill="#EAC996" stroke="'+C.ink+'" stroke-width="2"/>'
    +'<line x1="'+(x-15)+'" y1="'+(y-6)+'" x2="'+(x+15)+'" y2="'+(y-6)+'" stroke="'+C.ink+'" stroke-width="2"/>'+dots;
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

module.exports = { C, svg, stick, sheep, pouch, arrow, paper, bubble, txt, ground };
