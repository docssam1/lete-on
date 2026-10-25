/* ============================================================
   Numbers of Magic — 매거진(읽을거리)

   왜 따로 있나 (2026-09-20, 원장: "도형이 여기 있을 리는 없어 — 매거진인 거야")
   ------------------------------------------------------------
   「수의 마법」은 연산 앱이다. 그런데 수학 이야기 자료에는 연산 유닛에 붙일 자리가
   없는 최상급 소재가 잔뜩 있다 — 평균의 함정, 축구공과 정이십면체, 삼각 탁자,
   지어낸 숫자 가려내기. 억지로 유닛에 붙이면 유닛이 망가지고, 안 쓰면 자료가 썩는다.
   그래서 **유닛에 안 붙는 읽을거리는 매거진 기사로 싣는다.**

   세 군데에서 같은 글을 쓴다:
     · 마을 — 가판대(S.view='magazine')에서 언제든 읽는다
     · 학습지 — 회차 상황에 맞는 기사 한 편이 문제 뒤에 실린다(app/exam.js)
     · (앞으로) 편지함·리포트에서도 같은 데이터를 쓸 수 있다

   기사 하나 = 이 배열의 원소 하나. **글만 있으면 안 된다** — 표제 그림 1장과
   본문 그림이 함께 있어야 한다(원장: "글로만이 아니라 잘 이해하고 설명되도록").

   상황 매칭(fit)
   ------------------------------------------------------------
   `fit.units`·`fit.threads` 에 닿으면 그 회차에 그 기사를 싣는다. 비어 있으면
   나이대(age)로만 고르고 봉투 코드로 돌린다 — **과정 번호(주차)로는 고르지 않는다.**

   나이 표시(age) 기준 — 2026-09-30 원장 "과정과 난이도에 맞게":
     young = 유아·초1~2 → 주간 지면은 기존 언어사고력 구성을 유지(매거진 추가 없음). mid = 초3~4(축구공·삼각 탁자·뫼비우스·당구처럼
     그림으로 이해되는 것). senior = 초5 이상·중·고(평균·외심·생일 문제·지어낸 숫자처럼 개념어가 필요한 것).

   그림 규칙: viewBox 는 표제 320×170 · 본문 320×130 고정, 색은 아래 C 만,
   그림 속 글자는 숫자·기호·단위만(3개 언어가 그림 한 벌을 공유한다).
   검사기: node scripts/check-magazine.js
   ============================================================ */
(function(){
'use strict';

const C = {
  ink:'#1A2233', blue:'#16417C', bluedeep:'#0E2C57', gold:'#C9A063',
  goldbright:'#F5D98B', red:'#D9534F', ok:'#2E9E6B', purple:'#8B6BC7',
  paper:'#fdf6e3', mist:'#f1f0ec', brown:'#8a6d46', sub:'#4a5468',
  grey:'#b0b7c3', cream:'#fdfaf3', sky:'#7ea4d6', water:'#5b8dd9',
  /* 당구대 나사천 — 팔레트에 '면으로 깔 초록'이 없다(C.ok 는 글자용이라 너무 진하다) */
  felt:'#dfe7db'
};
const FRACTIONS={'½':['1','2'],'⅓':['1','3'],'⅔':['2','3'],'¼':['1','4'],'¾':['3','4'],'⅕':['1','5'],'⅖':['2','5'],'⅗':['3','5'],'⅘':['4','5'],'⅙':['1','6'],'⅚':['5','6'],'⅛':['1','8'],'⅜':['3','8'],'⅝':['5','8'],'⅞':['7','8']};
const fractionPattern=()=>/\d+\s*\/\s*\d+|[½⅓⅔¼¾⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞]/g;
const fractionParts=t=>FRACTIONS[t]||t.split(/\s*\/\s*/);
const safeText=t=>String(t??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
function magazineRich(value){
  const text=safeText(value).replace(/&lt;(\/?)b&gt;/g,'<$1b>');
  return text.replace(fractionPattern(),m=>{const[n,d]=fractionParts(m),tex='\\dfrac{'+n+'}{'+d+'}';
    if(window.katex&&typeof window.katex.renderToString==='function')return '<span class="nm-inline-math">'+window.katex.renderToString(tex,{throwOnError:false,trust:false,strict:'ignore'})+'</span>';
    return '<math class="nm-native-fraction" xmlns="http://www.w3.org/1998/Math/MathML"><mfrac><mn>'+n+'</mn><mn>'+d+'</mn></mfrac></math>';
  });
}
function fitMath(inner,height){return inner.replace(/(<g data-mz-math="1" data-height="([\d.]+)" transform="translate\(0,)([-\d.]+)(\)">)/g,(_,a,h,y,z)=>a+Math.max(+h/2+2,Math.min(height-h/2-2,+y)).toFixed(3)+z);}
const head = inner => '<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">'+fitMath(inner,170)+'</svg>';
const fig  = inner => '<svg viewBox="0 0 320 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">'+fitMath(inner,130)+'</svg>';
const svgText=(x,y,s,c,str,extra)=>'<text x="'+x+'" y="'+y+'" text-anchor="middle" font-size="'+s+'" font-weight="700" fill="'+c+'"'+(extra?' '+extra:'')+'>'+safeText(str)+'</text>';
const runWidth=(text,size)=>Array.from(text).reduce((w,c)=>w+(/\s/.test(c)?.27:/[.,:]/.test(c)?.28:/[+×÷=−≈→]/.test(c)?.76:.60)*size,0);
function T(x,y,size,c,value,extra){
  const str=String(value),re=fractionPattern();if(!re.test(str))return svgText(x,y,size,c,str,extra);
  const tokens=[];let at=0;for(const m of str.matchAll(fractionPattern())){if(m.index>at)tokens.push({text:str.slice(at,m.index)});const[n,d]=fractionParts(m[0]);tokens.push({n,d});at=m.index+m[0].length;}if(at<str.length)tokens.push({text:str.slice(at)});
  const widths=tokens.map(t=>t.text!=null?runWidth(t.text,size):Math.max(t.n.length,t.d.length)*size*.54+size*.28),width=widths.reduce((a,b)=>a+b,0);let cursor=Math.max(2,Math.min(318-width,x-width/2));
  const body=tokens.map((t,i)=>{const w=widths[i],cx=cursor+w/2;cursor+=w;if(t.text!=null)return svgText(cx,size*.35,size,c,t.text,extra);const fs=size*.88,pad=size*.10;return '<g class="nm-svg-fraction" data-numerator="'+t.n+'" data-denominator="'+t.d+'">'+svgText(cx,-size*.18,fs,c,t.n)+svgText(cx,size*.83,fs,c,t.d)+'<line x1="'+(cx-w/2+pad)+'" y1="0" x2="'+(cx+w/2-pad)+'" y2="0" stroke="'+c+'" stroke-width="'+Math.max(1.2,size*.055)+'"/></g>';}).join('');
  return '<g data-mz-math="1" data-height="'+(size*2.18)+'" transform="translate(0,'+(y-size*.35)+')">'+body+'</g>';
}
const line = (x1,y1,x2,y2,c,w,dash) => '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2
  +'" stroke="'+c+'" stroke-width="'+(w||2)+'" stroke-linecap="round"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';
const box = (x,y,w,h,f,s) => '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="'+(f||C.paper)
  +'" stroke="'+(s||C.gold)+'" stroke-width="2.5"/>';
/* 화살표 — 선 + 삼각 머리. 만화 헬퍼에는 있는데 여기엔 없어서 한 번 걸렸다. */
const arrow = (x1,y1,x2,y2,c,w) => {
  const a = Math.atan2(y2-y1, x2-x1), L = 10;
  const h1x = x2 - L*Math.cos(a-0.42), h1y = y2 - L*Math.sin(a-0.42);
  const h2x = x2 - L*Math.cos(a+0.42), h2y = y2 - L*Math.sin(a+0.42);
  return line(x1,y1,x2,y2,c||C.gold,w||3)
    + '<polygon points="'+x2+','+y2+' '+h1x.toFixed(1)+','+h1y.toFixed(1)+' '
    + h2x.toFixed(1)+','+h2y.toFixed(1)+'" fill="'+(c||C.gold)+'"/>';
};
const dot = (x,y,r,c) => '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'"/>';

/* ── 깎은 정이십면체 ───────────────────────────────────────────────────────
   축구공 기사의 그림은 **진짜 그 입체를 계산해서** 그린다. 처음엔 원 하나에 오각형을
   대충 얹어 그렸는데 원장이 바로 "축구공 넘 대충"이라고 했다 — 정오각형 12·정육각형 20이
   기사의 본문인데 그림이 그걸 안 보여 주면 글과 그림이 따로 논다.

   ① 정이십면체 꼭짓점 = (0, ±1, ±φ) 의 순환치환 12개, 모서리는 거리 2 인 쌍 30개
   ② 각 모서리를 1/3 지점에서 끊으면 점 60개 — 원래 꼭짓점마다 오각형 12개,
      원래 삼각형마다 육각형 20개가 생긴다(= 깎은 정이십면체)
   ③ 정사영해서 앞면만 그린다(면 중심의 z 로 자르고 z 순으로 쌓는다)
   그래서 본문의 60·90·32 와 그림이 같은 물체를 말한다. */
const PHI=(1+Math.sqrt(5))/2;
function solid(){
  if(solid._c) return solid._c;
  const v=[];
  [[0,1,PHI],[0,1,-PHI],[0,-1,PHI],[0,-1,-PHI]].forEach(p=>{
    v.push([p[0],p[1],p[2]],[p[1],p[2],p[0]],[p[2],p[0],p[1]]);
  });
  const E=[], adj=v.map(()=>[]);
  for(let i=0;i<12;i++) for(let j=i+1;j<12;j++){
    const d=Math.hypot(v[i][0]-v[j][0],v[i][1]-v[j][1],v[i][2]-v[j][2]);
    if(Math.abs(d-2)<1e-6){ E.push([i,j]); adj[i].push(j); adj[j].push(i); }
  }
  const F=[];
  for(let a=0;a<12;a++) for(const b of adj[a]) for(const c of adj[b])
    if(c>b && b>a && adj[a].indexOf(c)>=0) F.push([a,b,c]);
  const key=(a,b)=>a+'_'+b, P={}, pts=[];
  const cut=(a,b)=>{ P[key(a,b)]=pts.length; pts.push([0,1,2].map(k=>v[a][k]+(v[b][k]-v[a][k])/3)); };
  E.forEach(([a,b])=>{ cut(a,b); cut(b,a); });
  const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const crs=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const nrm=a=>{const L=Math.hypot(a[0],a[1],a[2]);return [a[0]/L,a[1]/L,a[2]/L];};
  const pent=[];
  for(let a=0;a<12;a++){
    const ns=adj[a].slice(), n=nrm(v[a]), u=nrm(sub(v[ns[0]],v[a])), w=crs(n,u);
    ns.sort((x,y)=>Math.atan2(dot(sub(v[x],v[a]),w),dot(sub(v[x],v[a]),u))
                  -Math.atan2(dot(sub(v[y],v[a]),w),dot(sub(v[y],v[a]),u)));
    pent.push(ns.map(b=>P[key(a,b)]));
  }
  const hex=F.map(([a,b,c])=>[P[key(a,b)],P[key(b,a)],P[key(b,c)],P[key(c,b)],P[key(c,a)],P[key(a,c)]]);
  return (solid._c={icoV:v, icoF:F, pts, pent, hex});
}
function spin(p,ax,ay){
  let x=p[0],y=p[1],z=p[2],c=Math.cos(ay),s=Math.sin(ay);
  const x2=x*c+z*s, z2=-x*s+z*c; c=Math.cos(ax); s=Math.sin(ax);
  return [x2, y*c-z2*s, y*s+z2*c];
}
const AX=0.36, AY=0.30;
function poly(pts,fill,stroke,w,dash){
  return '<polygon points="'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')
    +'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linejoin="round"'
    +(dash?' stroke-dasharray="'+dash+'"':'')+'/>';
}
/* 축구공 — hi 를 주면 그 번호의 오각형만 빨강(어느 꼭짓점이 잘렸는지 가리킬 때) */
function ballArt(cx,cy,R,hi){
  const S=solid(), rad=Math.hypot(S.pts[0][0],S.pts[0][1],S.pts[0][2]);
  const P=S.pts.map(p=>spin([p[0]/rad,p[1]/rad,p[2]/rad],AX,AY));
  const out=[];
  const put=(idx,fill)=>{
    let z=0; idx.forEach(i=>{ z+=P[i][2]; }); z/=idx.length;
    if(z<=-0.04) return;
    out.push({z:z, fill:fill, pts:idx.map(i=>[cx+P[i][0]*R, cy-P[i][1]*R])});
  };
  S.hex.forEach(f=>put(f,C.paper));
  S.pent.forEach((f,i)=>put(f, hi===i ? C.red : C.ink));
  out.sort((a,b)=>a.z-b.z);
  return '<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="'+C.paper+'" stroke="'+C.ink+'" stroke-width="2.5"/>'
    +out.map(f=>poly(f.pts,f.fill,C.ink,1.6)).join('');
}
/* 정이십면체 — 앞면은 채우고 뒷면은 점선으로(입체가 보이게). mark 를 주면 그 꼭짓점에 빨간 점 */
function icoArt(cx,cy,R,mark){
  const S=solid(), rad=Math.hypot(S.icoV[0][0],S.icoV[0][1],S.icoV[0][2]);
  const V=S.icoV.map(p=>spin([p[0]/rad,p[1]/rad,p[2]/rad],AX,AY));
  const f=S.icoF.map(idx=>{
    let z=0; idx.forEach(i=>{ z+=V[i][2]; }); z/=3;
    return {z:z, pts:idx.map(i=>[cx+V[i][0]*R, cy-V[i][1]*R])};
  }).sort((a,b)=>a.z-b.z);
  return f.map(x=>x.z>0 ? poly(x.pts,C.mist,C.blue,2) : poly(x.pts,'none',C.grey,1.4,'4 3')).join('')
    + (mark===undefined ? '' : dot(cx+V[mark][0]*R, cy-V[mark][1]*R, 5.5, C.red));
}

/* 강 단면 — 바닥 곡선 + 물. depth(0~1) 배열을 받아 가운데가 깊은 강을 그린다 */
function riverBed(pts, top, bottom){
  let d = 'M 20 '+top;
  pts.forEach((v,i) => { d += ' L '+(20+i*(280/(pts.length-1)))+' '+(top+v*(bottom-top)); });
  d += ' L 300 '+top+' Z';
  return '<path d="'+d+'" fill="'+C.water+'" opacity="0.55"/><path d="'+d.replace(/ Z$/,'')+'" fill="none" stroke="'+C.brown+'" stroke-width="2.5"/>';
}

/* ── 뫼비우스의 띠 ─────────────────────────────────────────────────────────
   띠를 "대충 꼬인 고리"로 그리면 **면이 하나**라는 기사의 본문이 그림에 안 보인다.
   그래서 축구공과 같은 원칙으로 실제 곡면을 매개변수로 그린다.
     x = (R + v·cos(u/2))·cos u ,  y = (R + v·cos(u/2))·sin u ,  z = v·sin(u/2)
   u 를 한 바퀴 돌리는 동안 v 축(띠의 폭)이 **반 바퀴만** 돌기 때문에, 한 바퀴를 돌고
   오면 앞뒤가 뒤집혀 있다 — 그게 면이 하나인 이유다. 조각마다 깊이로 정렬해 겹침을
   맞춘다. */
function mobiusArt(cx, cy, R, w, n){
  const quads = [];
  const P = (u, v) => {
    const r = R + v * Math.cos(u / 2);
    const x = r * Math.cos(u), y = r * Math.sin(u), z = v * Math.sin(u / 2);
    return [cx + x, cy - (y * 0.40 + z * 0.92), y];      /* 살짝 기울여 본 투영 */
  };
  for(let i = 0; i < n; i++){
    const u0 = i * 2 * Math.PI / n, u1 = (i + 1) * 2 * Math.PI / n;
    const a = P(u0, -w), b = P(u0, w), c = P(u1, w), d = P(u1, -w);
    quads.push({ z: (a[2] + c[2]) / 2, i: i,
      pts: [a, b, c, d].map(q => [q[0], q[1]]) });
  }
  quads.sort((p, q) => p.z - q.z);
  return quads.map(q =>
    poly(q.pts, q.i % 2 ? C.paper : C.goldbright, C.brown, 1.2)).join('');
}

/* Reviewed quantitative scenes. Coordinates and units share the same model. */
function meanBars(){
  const groups=[[40,40,40,40],[10,10,10,130]],base=100,scale=.5;
  return groups.map((values,g)=>'<g data-mean-values="'+values+'">'+values.map((v,i)=>{const x=28+g*160+i*26;return '<rect x="'+x+'" y="'+(base-v*scale)+'" width="18" height="'+v*scale+'" fill="'+(g?C.gold:C.ok)+'"/>'+T(x+9,base-v*scale-7,11,C.ink,v);}).join('')+T(76+g*160,123,14,C.ink,g?'B':'A')+'</g>').join('')+line(18,80,302,80,C.red,1.6,'4 3')+T(160,16,14,C.red,'(160 ÷ 4) = 40');
}
function riverScene(){
  const top=24,scale=.36,depths=[60,140,220];
  return '<g data-depths="60,140,220" data-depth-scale="'+scale+'">'+depths.map((d,i)=>{const x=32+i*86;return '<rect x="'+x+'" y="'+top+'" width="86" height="'+d*scale+'" fill="'+C.water+'" opacity=".5"/>'+line(x,top+d*scale,x+86,top+d*scale,C.brown,2)+T(x+43,top+d*scale+15,13,C.ink,d);}).join('')+line(24,top,300,top,C.blue,2)+T(160,13,12,C.sub,'cm')+'</g>';
}
function probabilityChart(){return line(30,106,300,106,C.grey,2)+[[23,50.7,C.blue],[25,56.9,C.red],[30,70.6,C.ok]].map(([n,p,c],i)=>{const x=68+i*90,h=p*.9;return '<rect data-probability="'+p+'" x="'+(x-20)+'" y="'+(106-h)+'" width="40" height="'+h+'" fill="'+c+'"/>'+T(x,99-h,13,c,p+'%')+T(x,124,13,C.sub,n);}).join('')+line(30,61,300,61,C.red,1.5,'4 3')+T(300,56,11,C.red,'50%');}
function birthdayPeople(){let g='';for(let i=0;i<25;i++){const x=32+(i%9)*32,y=35+Math.floor(i/9)*32;g+='<circle data-person="'+i+'" cx="'+x+'" cy="'+y+'" r="'+([4,17].includes(i)?8:5)+'" fill="'+([4,17].includes(i)?C.red:C.grey)+'"/>';}return g+line(160,35,288,67,C.red,2,'4 3')+T(160,147,23,C.red,'≈ 56.9%');}
function pairCount(){const pts=Array.from({length:5},(_,i)=>[160+46*Math.cos(i*2*Math.PI/5-Math.PI/2),58+35*Math.sin(i*2*Math.PI/5-Math.PI/2)]);let g='<g data-pair-people="5">';for(let i=0;i<5;i++)for(let j=i+1;j<5;j++)g+=line(...pts[i],...pts[j],C.grey,1.4);return g+pts.map(p=>dot(...p,5,C.ok)).join('')+T(160,111,15,C.ink,'5 × 4 ÷ 2 = 10')+'</g>';}
function benfordBars(){return line(25,105,304,105,C.grey,1.5)+Array.from({length:9},(_,i)=>{const d=i+1,p=100*Math.log10(1+1/d),h=p*2.2,x=32+i*30;return '<rect data-first-digit="'+d+'" data-probability="'+p+'" x="'+x+'" y="'+(105-h)+'" width="18" height="'+h+'" fill="'+(i?C.gold:C.ok)+'"/>'+T(x+9,124,12,C.sub,d)+(i===0?T(x+9,105-h-7,12,C.ok,'30.1%'):'');}).join('');}
function tileScene(kind){const O=[160,74],r=46,points=[[114,74],[160,28],[206,74]],circle='<circle cx="160" cy="74" r="46" fill="none" stroke="'+C.grey+'" stroke-width="1.5" stroke-dasharray="4 3"/>';let s=kind===2?circle:'<path d="M 114 74 A 46 46 0 0 1 206 74" fill="none" stroke="'+C.brown+'" stroke-width="3"/>';
 if(kind===1){s+='<polygon points="114,74 160,28 206,74" fill="none" stroke="'+C.blue+'" stroke-width="2"/>'+line(108,22,206,120,C.ok,1.6,'4 3')+line(212,22,114,120,C.ok,1.6,'4 3');[[137,51],[183,51]].forEach(([x,y])=>{s+=dot(x,y,3,C.ok);});s+=dot(...O,5,C.gold)+T(176,88,13,C.gold,'O');}
 if(kind===2)s+=dot(...O,5,C.gold)+line(160,74,206,74,C.gold,2)+T(183,68,13,C.gold,'r');
 return '<g data-circle-model="'+kind+'">'+s+points.map(([x,y],i)=>'<circle data-rim-point="'+i+'" cx="'+x+'" cy="'+y+'" r="4" fill="'+C.red+'"/>').join('')+'</g>';
}
function mobiusTrace(edge){const R=46,w=14,cx=160,cy=60;let d='';const steps=edge?120:60;for(let i=0;i<=steps;i++){const u=i*(edge?4:2)*Math.PI/steps,v=edge?w:0,r=R+v*Math.cos(u/2),x=cx+r*Math.cos(u),y=cy-(r*Math.sin(u)*.4+v*Math.sin(u/2)*.92);d+=(i?' L ':'M ')+x.toFixed(2)+' '+y.toFixed(2);}return mobiusArt(cx,cy,R,w,40)+'<path data-mobius-trace="'+(edge?'edge':'centre')+'" d="'+d+'" fill="none" stroke="'+C.red+'" stroke-width="2"/>'+T(160,119,14,C.red,'1');}

window.NM_MAGAZINE = {
  name:{ ko:'수의 마법 매거진', en:'Numbers of Magic Magazine', zh:'数的魔法杂志' },
  tagline:{ ko:'수학자와 함께 묻고, 그림으로 발견하는 수학',
            en:'Ask, picture and discover mathematics',
            zh:'提问、画图，发现数学' },
  articles:[

{
  "id": "mz-average",
  "no": 1,
  "kicker": {
    "ko": "통계",
    "en": "Statistics",
    "zh": "统计"
  },
  "title": {
    "ko": "평균만 믿고 강을 건너면",
    "en": "Crossing a River on an Average",
    "zh": "只信平均数就过河"
  },
  "lede": {
    "ko": "같은 간격으로 잰 세 곳의 수심은 60, 140, 220 cm예요. 평균이 140 cm면 어디나 그만큼 얕을까요?",
    "en": "At three equally spaced sampling points the depths are 60, 140 and 220 cm. Does an average of 140 cm mean every point is that shallow?",
    "zh": "等间距取样的三处水深是60、140、220厘米。平均140厘米，是否每处都这么浅？"
  },
  "art": head(riverScene()+T(160,157,16,C.ink,"(60 + 140 + 220) ÷ 3 = 140")),
  "body": [
    {
      "h": {
        "ko": "같은 평균, 다른 모습",
        "en": "Same mean, different distributions",
        "zh": "平均相同，分布不同"
      },
      "p": {
        "ko": "A는 40, 40, 40, 40이고 B는 10, 10, 10, 130이에요. 합은 둘 다 160이고 자료는 네 개라 평균은 40입니다. 하지만 B에만 아주 큰 값이 있어요. <b>평균이 같아도 값들이 퍼진 모습은 다릅니다.</b>",
        "en": "A has 40, 40, 40, 40; B has 10, 10, 10, 130. Both totals are 160 across four values, so both means are 40. Only B has a very large value. <b>Equal means do not imply equal distributions.</b>",
        "zh": "A是40、40、40、40，B是10、10、10、130。两组合计160，各有四个值，平均都是40。但B中有一个很大的值。<b>平均相同，不代表分布相同。</b>"
      },
      "art": fig(meanBars())
    },
    {
      "h": {
        "ko": "평균은 가장 깊은 곳이 아니에요",
        "en": "The mean is not the maximum",
        "zh": "平均不是最深处"
      },
      "p": {
        "ko": "위 그림은 실제 강이 아닌 수심 표본 모형이에요. 세 값의 평균은 140 cm지만 가장 깊은 표본은 220 cm입니다. 키가 165 cm라면 220 cm 깊이에서 서도 머리가 물 아래에 있어요. <b>평균만으로 건너도 된다고 판단할 수 없습니다.</b>",
        "en": "This is a depth-sampling model, not a measured river. The three readings average 140 cm, yet the deepest is 220 cm. A person 165 cm tall would be under water even while standing there. <b>The mean alone cannot justify wading across.</b>",
        "zh": "图中是水深取样模型，并非实测河流。三个读数平均140厘米，最深却有220厘米。身高165厘米的人站在那里，头也会没入水下。<b>不能只凭平均判断能否涉水。</b>"
      },
      "art": fig(riverScene())
    },
    {
      "h": {
        "ko": "평균과 함께 범위도 살펴요",
        "en": "Look at the range as well",
        "zh": "也看看范围"
      },
      "p": {
        "ko": "A의 가장 작은 값과 큰 값은 모두 40이에요. B는 가장 작은 값이 10, 가장 큰 값이 130입니다. 평균 옆에 이 두 값도 적으면 차이가 드러나요. 흩어진 모습을 더 보려면 그래프나 다른 통계량도 함께 확인합니다.",
        "en": "A has minimum and maximum both 40. B ranges from 10 to 130. Listing the minimum and maximum beside the mean reveals that difference. A graph or other statistics can show more about the spread.",
        "zh": "A的最小值、最大值都是40，B却从10到130。在平均旁写上最小值和最大值，差别就清楚了。图表和其他统计量还能说明分散的情况。"
      },
      "art": fig(T(160,30,17,C.ink,"A: 40, 40, 40")+T(160,70,17,C.ink,"B: 10, 40, 130")+T(160,111,14,C.sub,"min  /  mean  /  max"))
    }
  ],
  "close": {
    "ko": "평균을 구한 다음에는, 그 평균이 어떤 자료에서 나왔는지도 살펴보세요.",
    "en": "After finding the mean, look at the data behind it.",
    "zh": "求出平均之后，也看看它来自什么数据。"
  },
  "source": {
    "ko": "자료와 수심은 창작한 교육 모형입니다. 140 cm는 세 표본의 산술평균이며 강 전체의 평균을 뜻하지 않습니다.",
    "en": "Original teaching data and depth samples. The 140 cm mean describes three readings, not the whole river.",
    "zh": "数据和水深图均为自制教学模型。140厘米是三个取样值的算术平均，不是整条河的平均。"
  },
  "fit": {
    "units": [

    ],
    "threads": [

    ]
  },
  "age": [
    "senior"
  ],
  "references": [
    {
      "label": "OpenStax · Mean",
      "url": "https://openstax.org/books/introductory-statistics-2e/pages/2-5-measures-of-the-center-of-the-data"
    }
  ]
},

{
  "id": "mz-soccer",
  "no": 2,
  "kicker": {
    "ko": "도형",
    "en": "Shapes",
    "zh": "图形"
  },
  "title": {
    "ko": "축구공은 정이십면체에서 태어났다",
    "en": "A Football Is a Cut-Down Icosahedron",
    "zh": "足球是被削角的正二十面体"
  },
  "lede": {
    "ko": "정오각형 12개와 정육각형 20개로 된 전통적인 축구공 무늬를 보았나요? 그 바탕이 되는 다면체를 만들어요.",
    "en": "Have you seen the traditional pattern of 12 pentagons and 20 hexagons on a football? Let us build its polyhedral model.",
    "zh": "你见过由12个五边形和20个六边形组成的传统足球图案吗？来做它的多面体模型。"
  },
  "art": head(ballArt(160,76,61)+poly(Array.from({length:5},(_,i)=>[58+9*Math.cos(i*2*Math.PI/5-Math.PI/2),153+9*Math.sin(i*2*Math.PI/5-Math.PI/2)]),C.ink,C.ink,1)+T(95,158,15,C.ink,"×12")+poly(Array.from({length:6},(_,i)=>[228+9*Math.cos(i*2*Math.PI/6),153+9*Math.sin(i*2*Math.PI/6)]),C.paper,C.ink,1)+T(270,158,15,C.gold,"×20")),
  "body": [
    {
      "h": {
        "ko": "출발은 삼각형 스무 개",
        "en": "It starts with twenty triangles",
        "zh": "起点是二十个三角形"
      },
      "p": {
        "ko": "정이십면체는 정삼각형 20개로 이루어진 입체예요. 꼭짓점은 12개, 모서리는 30개. 정다면체 중에서 면이 가장 많은 도형이랍니다.",
        "en": "An icosahedron is built from twenty equilateral triangles. It has twelve vertices and thirty edges — the regular solid with the most faces.",
        "zh": "正二十面体由二十个正三角形组成，有十二个顶点、三十条棱——是面数最多的正多面体。"
      },
      "art": fig(icoArt(160,57,56)+T(160,124,17,C.blue,"20"))
    },
    {
      "h": {
        "ko": "꼭짓점 열두 개를 잘라 낸다",
        "en": "Slice off the twelve corners",
        "zh": "把十二个角削掉"
      },
      "p": {
        "ko": "각 모서리를 같은 길이로 셋으로 나누는 지점까지 꼭짓점을 잘라요. 잘린 12곳에 정오각형이 생기고, 삼각형 20개는 정육각형이 됩니다. <b>아무 위치나 자르는 것이 아니라 이 비율로 잘라야</b> 두 종류 면의 변 길이가 같아요.",
        "en": "Cut each corner at points one third of the way along its edges. The 12 corners become regular pentagons and the 20 triangles become regular hexagons. <b>This particular cut</b> makes the edge lengths of both face types equal.",
        "zh": "在每条棱的三等分点处切去顶角。12个角变成正五边形，20个三角形变成正六边形。<b>要按这个比例切</b>，两种面的边长才相同。"
      },
      "art": fig(icoArt(74,58,42,0)+arrow(140,58,184,58,C.gold,3)+ballArt(246,58,44,0)+T(74,120,14,C.red,"1")+T(246,120,14,C.red,"5"))
    },
    {
      "h": {
        "ko": "세어 보면 딱 맞는다",
        "en": "Count them and it works out",
        "zh": "数一数正好对上"
      },
      "p": {
        "ko": "면은 12 + 20 = 32개, 꼭짓점은 60개, 모서리는 90개예요. 이 모형처럼 <b>볼록한 다면체</b>에는 꼭짓점 수 − 모서리 수 + 면 수 = 2가 성립해요. 60 − 90 + 32 = 2로 확인할 수 있습니다. 모든 입체에 적용되는 식은 아니에요.",
        "en": "It has 32 faces, 60 vertices and 90 edges. For a <b>convex polyhedron</b> such as this one, vertices − edges + faces = 2. Check: 60 − 90 + 32 = 2. This is not a rule for every possible solid.",
        "zh": "它有32个面、60个顶点、90条棱。像这样的<b>凸多面体</b>满足顶点数−棱数+面数=2。检验：60−90+32=2。这不是所有立体都适用的规律。"
      },
      "art": fig(T(160,42,19,C.ink,"60 − 90 + 32 = 2")+T(160,93,17,C.sub,"V − E + F = 2"))
    }
  ],
  "close": {
    "ko": "실제 축구공은 바람을 넣으면 면이 휘어요. 여기서는 전통 무늬의 구조를 평평한 면의 다면체로 살펴봤습니다.",
    "en": "Inflation curves the panels of a real ball. Here we studied the traditional pattern using a flat-faced polyhedron.",
    "zh": "充气后真实足球的面会弯曲。这里用平面的多面体研究传统图案的结构。"
  },
  "source": {
    "ko": "이 모형은 깎은 정이십면체로, 준정다면체의 하나입니다. 꼭짓점마다 정오각형 하나와 정육각형 두 개가 같은 방식으로 만납니다.",
    "en": "The model is a truncated icosahedron, an Archimedean solid with one regular pentagon and two regular hexagons meeting alike at every vertex.",
    "zh": "这个模型叫截角二十面体，属于阿基米德多面体。每个顶点都以相同方式连接一个正五边形和两个正六边形。"
  },
  "fit": {
    "units": [

    ],
    "threads": [

    ]
  },
  "age": [
    "mid",
    "senior"
  ],
  "references": [
    {
      "label": "Wolfram · Archimedean solids",
      "url": "https://mathworld.wolfram.com/ArchimedeanSolid.html"
    }
  ]
},

{
  "id": "mz-tripod",
  "no": 3,
  "kicker": {
    "ko": "도형",
    "en": "Shapes",
    "zh": "图形"
  },
  "title": {
    "ko": "세 다리 받침대는 왜 덜 흔들릴까?",
    "en": "Why does a three-legged stand rock less?",
    "zh": "三脚架为什么不容易晃？"
  },
  "lede": {
    "ko": "세 발끝이 삼각형을 이루고 몸체가 단단한 받침대를 생각해요. 다리가 넷인 탁자와 무엇이 다를까요?",
    "en": "Imagine a rigid stand whose three feet form a triangle. How is it different from a four-legged table?",
    "zh": "想象一个结构坚固、三只脚围成三角形的架子。它与四脚桌有什么不同？"
  },
  "art": "<svg viewBox=\"0 0 320 170\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><line x1=\"16\" y1=\"132\" x2=\"304\" y2=\"132\" stroke=\"#8a6d46\" stroke-width=\"3\" stroke-linecap=\"round\"/><rect x=\"44\" y=\"40\" width=\"100\" height=\"9\" rx=\"3\" fill=\"#C9A063\"/><line x1=\"56\" y1=\"49\" x2=\"64\" y2=\"132\" stroke=\"#8a6d46\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"132\" y1=\"49\" x2=\"124\" y2=\"132\" stroke=\"#8a6d46\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"98\" y1=\"49\" x2=\"96\" y2=\"132\" stroke=\"#8a6d46\" stroke-width=\"3\" stroke-linecap=\"round\"/><text x=\"94\" y=\"28\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#2E9E6B\">3</text><rect x=\"176\" y=\"40\" width=\"100\" height=\"9\" rx=\"3\" fill=\"#C9A063\" transform=\"rotate(-4 226 44)\"/><line x1=\"186\" y1=\"52\" x2=\"194\" y2=\"132\" stroke=\"#8a6d46\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"266\" y1=\"46\" x2=\"258\" y2=\"132\" stroke=\"#8a6d46\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"212\" y1=\"50\" x2=\"216\" y2=\"132\" stroke=\"#8a6d46\" stroke-width=\"3\" stroke-linecap=\"round\"/><line x1=\"240\" y1=\"47\" x2=\"236\" y2=\"124\" stroke=\"#8a6d46\" stroke-width=\"3\" stroke-linecap=\"round\"/><text x=\"226\" y=\"28\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#D9534F\">4</text><text x=\"252\" y=\"120\" text-anchor=\"middle\" font-size=\"17\" font-weight=\"700\" fill=\"#D9534F\">!</text></svg>",
  "body": [
    {
      "h": {
        "ko": "일직선이 아닌 세 점이 평면을 정해요",
        "en": "Three non-collinear points determine a plane",
        "zh": "不共线的三点确定一个平面"
      },
      "p": {
        "ko": "세 점이 <b>한 직선 위에 있지 않으면</b> 그 점들을 지나는 평면은 하나예요. 삼각형 모양으로 벌어진 세 발끝이 바닥에 닿으면 네 번째 발의 높이를 맞출 필요가 없어요. 다만 바닥이 무너지거나 무게가 한쪽으로 쏠리면 넘어질 수 있습니다.",
        "en": "Three points <b>not on one straight line</b> determine one plane. With three spread-out feet touching the ground, there is no fourth foot to level. A stand can still tip if the ground gives way or its weight shifts too far to one side.",
        "zh": "<b>不在同一直线上的三点</b>确定一个平面。三只分开的脚着地后，就不用再调整第四只脚的高度。但地面塌陷或重心偏到一边，架子仍会倒。"
      },
      "art": "<svg viewBox=\"0 0 320 130\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><path d=\"M 40 96 L 150 62 L 280 84 L 170 118 Z\" fill=\"#f1f0ec\" stroke=\"#16417C\" stroke-width=\"2.5\"/><circle cx=\"40\" cy=\"96\" r=\"6\" fill=\"#D9534F\"/><circle cx=\"150\" cy=\"62\" r=\"6\" fill=\"#D9534F\"/><circle cx=\"280\" cy=\"84\" r=\"6\" fill=\"#D9534F\"/><text x=\"160\" y=\"30\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#16417C\">3</text></svg>"
    },
    {
      "h": {
        "ko": "네 번째 다리가 문제를 만든다",
        "en": "The fourth leg is the troublemaker",
        "zh": "第四条腿才是麻烦"
      },
      "p": {
        "ko": "네 발끝이 같은 평면에 있지 않으면 한 발이 바닥에서 뜰 수 있어요. 탁자를 누르면 바닥에 닿는 발의 조합이 바뀌며 덜거덕거립니다. <b>네 발끝의 높이를 함께 맞추기 어려운 것</b>이 세 다리 받침대와 다른 점이에요.",
        "en": "If four foot tips do not lie in one plane, one may hover above the floor. Pressing the table changes which feet support it, causing rocking. <b>Getting all four foot tips to match the ground</b> is the extra challenge compared with three legs.",
        "zh": "四只脚的末端若不共面，一只就可能悬空。按压桌面时，支撑的脚组合发生变化，桌子就晃动。比起三脚架，额外的困难是<b>让四只脚末端都适应地面</b>。"
      },
      "art": "<svg viewBox=\"0 0 320 130\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><path d=\"M 36 92 L 150 60 L 284 80 L 168 114 Z\" fill=\"#f1f0ec\" stroke=\"#16417C\" stroke-width=\"2.5\"/><circle cx=\"36\" cy=\"92\" r=\"6\" fill=\"#2E9E6B\"/><circle cx=\"150\" cy=\"60\" r=\"6\" fill=\"#2E9E6B\"/><circle cx=\"284\" cy=\"80\" r=\"6\" fill=\"#2E9E6B\"/><circle cx=\"168\" cy=\"92\" r=\"6\" fill=\"#D9534F\"/><line x1=\"168\" y1=\"92\" x2=\"168\" y2=\"114\" stroke=\"#D9534F\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-dasharray=\"4 3\"/><text x=\"206\" y=\"110\" text-anchor=\"middle\" font-size=\"13\" font-weight=\"700\" fill=\"#D9534F\">?</text></svg>"
    },
    {
      "h": {
        "ko": "종이 받침대로 확인해요",
        "en": "Try a small model",
        "zh": "用小模型验证"
      },
      "p": {
        "ko": "단단한 종이에 세 다리를 삼각형으로 붙인 모형을 만들어요. 같은 바닥에서 네 다리 모형과 비교해 보세요. 탁자를 돌리는 방법도 있지만, <b>같은 길이의 다리·바닥의 모양 등 조건</b>이 필요해요. 모든 탁자에서 반드시 되는 것은 아닙니다.",
        "en": "Compare rigid card models with three feet in a triangle and with four feet. Rotation can help a suitable four-legged table, but <b>leg lengths and ground shape matter</b>. It is not guaranteed for every table.",
        "zh": "用硬纸做三角形三脚模型，与同一地面上的四脚模型比较。转桌子有时有用，但<b>腿长、地面形状等条件</b>很重要，并非每张桌子都能靠转动变稳。"
      },
      "art": fig(T(160,26,15,C.sub,"3 ≠ 4")+poly([[70,95],[160,40],[250,95]],C.mist,C.sub,2)+dot(70,95,6,C.ok)+dot(160,40,6,C.ok)+dot(250,95,6,C.ok))
    }
  ],
  "close": {
    "ko": "「덜거덕거리지 않음」과 「절대 넘어지지 않음」은 달라요. 설명에 필요한 조건도 함께 보세요.",
    "en": "Not rocking is different from never tipping. Check the conditions behind a claim.",
    "zh": "不晃动与绝不翻倒不是一回事。也要检查结论的条件。"
  },
  "source": {
    "ko": "한 직선 위에 있지 않은 세 점의 평면 성질을 설명한 모형입니다. 실제 받침대의 안전성을 보장하는 실험은 아닙니다.",
    "en": "A model of the plane through three non-collinear points; not a test certifying a real stand as safe.",
    "zh": "这是不共线三点确定平面的模型，不是实际支架安全认证实验。"
  },
  "fit": {
    "units": [

    ],
    "threads": [

    ]
  },
  "age": [
    "mid",
    "senior"
  ],
  "references": [
    {
      "label": "Oxford · Three non-collinear points",
      "url": "https://people.maths.ox.ac.uk/earl/vam/0903.pdf"
    },
    {
      "label": "Martin · Square table conditions",
      "url": "https://doi.org/10.1016/j.physleta.2006.08.053"
    }
  ]
},

{
  "id": "mz-faked",
  "no": 4,
  "kicker": {
    "ko": "확률",
    "en": "Chance",
    "zh": "概率"
  },
  "title": {
    "ko": "지어낸 기록에는 어떤 단서가 있을까?",
    "en": "What clues can a made-up record leave?",
    "zh": "编造的记录会留下什么线索？"
  },
  "lede": {
    "ko": "동전을 200번 던진 기록과 상상으로 만든 기록을 비교해요. 같은 면이 길게 이어진 것만으로 가짜라고 할 수 있을까요?",
    "en": "Compare a record of 200 coin tosses with an invented one. Does a long run of the same side prove a record is fake?",
    "zh": "比较抛硬币200次的记录与编造的记录。连续多次同一面，能证明记录是假的吗？"
  },
  "art": head(T(160,22,13,C.sub,"H: heads · T: tails")+T(160,66,17,C.ink,"H H H H H H T H T T")+T(160,105,17,C.ink,"H T H T H T H T H T")+T(160,149,14,C.sub,"?")),
  "body": [
    {
      "h": {
        "ko": "사람은 긴 줄을 무서워한다",
        "en": "People are afraid of long runs",
        "zh": "人害怕长串"
      },
      "p": {
        "ko": "그림에서 H는 앞면, T는 뒷면이에요. 사람이 기록을 만들 때는 「너무 규칙적이면 이상해 보이겠지」 하고 같은 면의 긴 줄을 피하기도 해요. 진짜 무작위 기록에는 뜻밖의 긴 줄도 나타납니다. <b>하지만 짧은 기록의 모양만으로 진짜와 가짜를 확정할 수는 없어요.</b>",
        "en": "H means heads and T means tails. When inventing a record, people sometimes avoid long runs because they look suspicious. Real randomness can produce surprising runs. <b>A short pattern alone cannot establish whether a record is genuine.</b>",
        "zh": "图中H为正面，T为反面。人编记录时，有时会因觉得可疑而避开长连串。真正随机的记录也会出现意外的长串。<b>只看一小段形状，不能确定记录真假。</b>"
      },
      "art": fig(T(160,34,14,C.sub,"H: heads · T: tails")+T(160,73,19,C.ink,"H T H T H T H T")+T(160,112,16,C.sub,"?"))
    },
    {
      "h": {
        "ko": "200번 묶음에서 긴 줄이 생길 확률",
        "en": "A run somewhere in 200 tosses",
        "zh": "200次中某处出现长串的概率"
      },
      "p": {
        "ko": "공정한 동전을 서로 독립적으로 200번 던지면, 앞면 또는 뒷면이 <b>어딘가에서 6번 이상 연속</b> 나올 확률은 약 96.5%예요. 특정한 여섯 번이 모두 앞면일 확률과는 달라요. 「6번 이상이 없었다」도 드물지만 가능한 결과입니다.",
        "en": "For 200 independent fair tosses, the chance of <b>at least six heads or six tails in a row somewhere</b> is about 96.5%. That differs from six specified tosses all being heads. No such run is unusual, but possible.",
        "zh": "独立抛公平硬币200次，<b>某处连续至少六次正面或反面</b>的概率约96.5%。这与指定六次全为正面不同。没有这样的连串较少见，但仍可能发生。"
      },
      "art": fig(T(160,31,14,C.sub,"H H H H H H")+T(160,67,23,C.ok,"≈ 96.5%")+T(160,110,14,C.sub,"200"))
    },
    {
      "h": {
        "ko": "첫 자리 숫자의 규칙에도 조건이 있어요",
        "en": "First-digit patterns have conditions",
        "zh": "首位数字规律也有条件"
      },
      "p": {
        "ko": "여러 자릿수 규모에 걸쳐 생긴 일부 자료는 첫 숫자가 1일 때가 약 30.1%인 벤퍼드 법칙을 따릅니다. 전화번호나 일정한 범위의 점수에는 그대로 적용할 수 없어요. 그래프는 <b>법칙의 이론값</b>이며, 어긋났다고 조작의 증거가 되는 것은 아닙니다.",
        "en": "Some data spanning several orders of magnitude follow Benford’s law: about 30.1% begin with 1. It does not directly apply to phone numbers or tightly bounded scores. The chart shows <b>theoretical values</b>; a mismatch does not prove fabrication.",
        "zh": "一些跨越多个数量级的数据符合本福特定律，首位为1的比例约30.1%。不能直接用于电话号码或范围很窄的分数。图示<b>理论值</b>；不符合并不能证明造假。"
      },
      "art": fig(benfordBars())
    }
  ],
  "close": {
    "ko": "숫자의 규칙은 더 살펴볼 단서예요. 판정하기 전에 자료의 성격과 다른 근거를 확인합니다.",
    "en": "A pattern is a clue for further checking. Examine the data and other evidence before judging.",
    "zh": "数字规律是进一步核查的线索。判断前要检查数据性质与其他证据。"
  },
  "source": {
    "ko": "약96.5%는 연속 길이1~5를 추적해 직접 계산했습니다. 독립·공정한 동전 모형이며 벤퍼드 그래프는 이론 분포입니다.",
    "en": "The 96.5% was computed by tracking run lengths 1–5 for independent fair tosses. Benford bars show the theoretical distribution.",
    "zh": "96.5%通过跟踪独立公平抛掷的连续长度1～5计算。本福特柱形图表示理论分布。"
  },
  "fit": {
    "units": [

    ],
    "threads": [

    ]
  },
  "age": [
    "senior"
  ],
  "references": [
    {
      "label": "NIST · Benford distribution",
      "url": "https://xlinux.nist.gov/dads/HTML/benfordslaw.html"
    },
    {
      "label": "BLS · Benford analysis",
      "url": "https://www.bls.gov/osmr/research-papers/2003/pdf/st030020.pdf"
    }
  ]
},

{
  "id": "mz-birthday",
  "no": 5,
  "kicker": {
    "ko": "확률",
    "en": "Chance",
    "zh": "概率"
  },
  "title": {
    "ko": "25명이면 생일이 같을 확률은?",
    "en": "Could two of 25 people share a birthday?",
    "zh": "25人中有人生日相同的概率？"
  },
  "lede": {
    "ko": "선수 22명에 심판 3명, 모두 25명. 이 중에 생일이 같은 사람이 있을 확률은 얼마일까요?",
    "en": "Twenty-two players and three officials — twenty-five people. What are the chances two of them share a birthday?",
    "zh": "22名球员加3名裁判，一共25人。其中有两人生日相同的概率是多少？"
  },
  "art": head(birthdayPeople()),
  "body": [
    {
      "h": {
        "ko": "거꾸로 세는 것이 쉽다",
        "en": "Counting backwards is easier",
        "zh": "反着数更容易"
      },
      "p": {
        "ko": "윤일을 빼고 365일이 똑같이 가능하며, 사람들의 생일이 서로 독립이라고 가정해요. 모두 다르려면 첫 사람은 아무 날, 둘째는 364/365, 셋째는 363/365의 비율로 앞사람들과 달라야 해요. 모두 다른 확률을 D라고 할 때, <b>곱한 전체 D를 1에서 빼면</b> 적어도 한 쌍이 같은 확률입니다.",
        "en": "Assume 365 equally likely dates, no leap day, and independent birthdays. For everyone to differ, the first date is unrestricted, the second has probability 364/365 and the third 363/365 of avoiding earlier dates. Call the probability of all different birthdays D. <b>Subtract the whole product D from 1.</b>",
        "zh": "假设不计闰日，365天等可能，各人生日日期独立。全不相同时，首人日期不限，第二人避开前人的概率为364/365，第三人为363/365。把全不相同的概率记作D，<b>用1减去整个乘积D</b>，才是至少有一对相同的概率。"
      },
      "art": fig(T(160,22,15,C.sub,"D")+T(160,66,21,C.ink,"364/365 × 363/365 × ⋯ × 341/365")+T(160,119,20,C.ok,"1 − D ≈ 0.5687"))
    },
    {
      "h": {
        "ko": "23명부터 절반을 넘어요",
        "en": "It exceeds half from 23 people",
        "zh": "从23人起超过一半"
      },
      "p": {
        "ko": "이 가정에서 23명이면 약50.7%, 25명이면 약56.9%, 30명이면 약70.6%예요. 그래프의 높이도 같은 비율을 나타냅니다. <b>반을 넘는다는 것이 반드시 생일이 같다는 뜻은 아니에요.</b> 실제 생일 분포는 이 모형과 조금 다를 수 있습니다.",
        "en": "In this model the chances are about 50.7% for 23 people, 56.9% for 25 and 70.6% for 30. Bar heights use the same scale. <b>More than half is not a guarantee of a match.</b> Real birthday distributions can differ from this model.",
        "zh": "该模型中，23人约50.7%，25人约56.9%，30人约70.6%。柱形高度使用相同比例尺。<b>超过一半并不保证一定有同生日的人。</b>真实生日分布可能与模型稍有不同。"
      },
      "art": fig(probabilityChart())
    },
    {
      "h": {
        "ko": "왜 그렇게 높을까",
        "en": "Why so high?",
        "zh": "为什么这么高？"
      },
      "p": {
        "ko": "그림의 다섯 사람은 서로 10쌍을 만들어요. 25명이라면 각자 24명과 짝지어 25 × 24를 센 뒤, 같은 두 사람을 두 번 세었으므로 2로 나눕니다. <b>25 × 24 ÷ 2 = 300쌍</b>이에요. 이 비교들이 모두 독립이라는 뜻은 아닙니다.",
        "en": "The five people in the diagram make 10 pairs. With 25 people, each has 24 partners; divide 25 × 24 by 2 because every pair was counted twice. That gives <b>300 pairs</b>. These comparisons are not all mutually independent.",
        "zh": "图中五人可以组成10对。25人各有24个搭档，25 × 24把每对数了两次，所以除以2，得到<b>300对</b>。这些比较并不是全部相互独立的。"
      },
      "art": fig(pairCount())
    }
  ],
  "close": {
    "ko": "우연은 우리가 생각하는 것보다 훨씬 자주 일어나요. 세는 방법을 알면 그 놀라움이 계산이 됩니다.",
    "en": "Coincidence happens far more often than we expect. Learn how to count it and the surprise becomes arithmetic.",
    "zh": "巧合发生的频率远超我们的想象。学会怎么数，惊讶就变成了算术。"
  },
  "source": {
    "ko": "365일 등가능·생일 독립·윤일 제외 모형에서 직접 계산했습니다. 「같은 생일」은 출생연도를 빼고 월·일만 비교합니다.",
    "en": "Computed under the independent, uniform 365-day model, excluding leap day. A matching birthday means month and day, not year.",
    "zh": "按独立、等可能365天且不计闰日的模型计算。「同生日」只比较月日，不比较年份。"
  },
  "fit": {
    "units": [

    ],
    "threads": [

    ]
  },
  "age": [
    "senior"
  ],
  "references": [
    {
      "label": "UNCG · Birthday model",
      "url": "https://home.uncg.edu/cmp/faculty/srtate/481.s24/rand_randomness.html"
    }
  ]
},

{
  "id": "mz-mobius",
  "no": 6,
  "kicker": {
    "ko": "도형",
    "en": "Shapes",
    "zh": "图形"
  },
  "title": {
    "ko": "안과 밖이 없는 종이",
    "en": "The Paper With No Inside or Outside",
    "zh": "没有正反面的纸"
  },
  "lede": {
    "ko": "종이띠 한쪽 끝을 반 바퀴 비틀어 붙여요. 종이의 두께를 무시한 수학 모형에서는 면이 하나로 이어집니다.",
    "en": "Give one end of a strip a half-turn before joining it. In the mathematical model, ignoring paper thickness, the surface has one side.",
    "zh": "把纸带的一端扭转半圈后接好。在忽略纸厚的数学模型里，它的面连成一侧。"
  },
  "art": head(mobiusArt(160,80,62,20,44)+T(160,160,13,C.ink,"180°")),
  "body": [
    {
      "h": {
        "ko": "만드는 법은 아주 쉽다",
        "en": "Making one is easy",
        "zh": "做起来非常简单"
      },
      "p": {
        "ko": "긴 종이띠를 하나 자르세요. 한쪽 끝을 반 바퀴만 비틀고, 그대로 양 끝을 붙입니다. 비틀지 않고 붙이면 그냥 고리지만, 한 번 비틀면 전혀 다른 것이 됩니다.",
        "en": "Cut a long strip of paper. Give one end a half turn, then join the two ends. Join it without the twist and you get an ordinary ring; add the twist and you get something else entirely.",
        "zh": "剪一条长纸带。把一端扭转半圈，再把两端粘起来。不扭就是普通的圆环，扭了一下就完全不同了。"
      },
      "art": fig(box(30,43,74,20,C.goldbright,C.brown)+arrow(112,53,150,53,C.gold,2)+mobiusArt(230,56,42,13,30)+T(70,105,14,C.sub,"180°"))
    },
    {
      "h": {
        "ko": "가운데를 따라 선을 그어 보세요",
        "en": "Draw a line down the middle",
        "zh": "沿着中间画一条线"
      },
      "p": {
        "ko": "띠 가운데를 따라 펜을 떼지 않고 그어 보세요. 처음 종이에서 반대쪽이던 곳까지 길이 이어집니다. <b>면이 사라진 게 아니라 앞·뒤가 하나로 연결된 것</b>이에요. 종이를 찢거나 건너뛰지 않고 길을 계속 따라가는 것이 중요합니다.",
        "en": "Trace the middle without lifting your pen. The path continues onto what was the reverse of the original strip. <b>The surface has not vanished: the two former sides are connected.</b> Follow the surface without tearing or jumping across it.",
        "zh": "沿带子中间不抬笔地画，路径会通到原纸带的另一侧。<b>面没有消失，而是原来的正反面连在一起了。</b>要沿面前进，不能撕开或跳过去。"
      },
      "art": fig(mobiusTrace(false))
    },
    {
      "h": {
        "ko": "가장자리도 하나로 이어져요",
        "en": "The boundary is connected too",
        "zh": "边界也连成一条"
      },
      "p": {
        "ko": "이번에는 종이의 가장자리를 손가락으로 따라가요. 뫼비우스 띠는 가장자리를 따라가면 <b>하나의 닫힌 길</b>로 모두 이어집니다. 비틀지 않고 붙인 고리는 가장자리 길이 두 개예요. 면의 수와 가장자리의 수를 따로 확인해 보세요.",
        "en": "Now trace an edge with your finger. A Möbius strip has <b>one connected closed boundary</b>. An untwisted band has two separate boundary loops. Check the number of sides and the number of boundary components separately.",
        "zh": "这次用手指沿边走。莫比乌斯带的边界是<b>一条相连的闭合路径</b>，不扭转的环带却有两条分开的边界。分别检查面的数量与边界的数量。"
      },
      "art": fig(mobiusTrace(true))
    }
  ],
  "close": {
    "ko": "당연해 보이는 것을 한 번 비틀어 보는 것 — 수학은 거기서 자랍니다.",
    "en": "Taking the obvious and giving it one twist — that is where mathematics grows.",
    "zh": "把理所当然的东西扭一下看看——数学就是从这里长出来的。"
  },
  "source": {
    "ko": "뫼비우스와 리스팅이 1858년 각각 연구한 한쪽 면의 곡면입니다. 그림의 빨간 길은 경로 설명을 위해 겹쳐 보이게 그렸습니다.",
    "en": "Möbius and Listing studied the one-sided surface independently in 1858. Red traces are overlaid to show the path.",
    "zh": "莫比乌斯与利斯廷在1858年分别研究了这种单侧曲面。红线叠画于图上，用于说明路径。"
  },
  "fit": {
    "units": [

    ],
    "threads": [

    ]
  },
  "age": [
    "mid",
    "senior"
  ],
  "references": [
    {
      "label": "MacTutor · Möbius and Listing",
      "url": "https://mathshistory.st-andrews.ac.uk/Biographies/Mobius/"
    }
  ]
},

{
  "id": "mz-billiard",
  "no": 7,
  "kicker": {
    "ko": "도형",
    "en": "Shapes",
    "zh": "图形"
  },
  "title": {
    "ko": "벽을 맞히고 싶으면 벽 너머를 겨눠라",
    "en": "To Hit Off the Cushion, Aim Through It",
    "zh": "想打库边，就瞄准库边的那一侧"
  },
  "lede": {
    "ko": "회전·마찰을 무시하고 공을 점으로 보는 수학 모형이에요. 벽에 한 번 반사된 뒤 목표에 닿는 길을 그려 봐요.",
    "en": "Use an ideal point-ball model, ignoring spin and friction. Draw a path that reflects once from a cushion and reaches the target.",
    "zh": "把球看成点，并忽略旋转与摩擦。画出经过一次反射后到达目标的路线。"
  },
  "art": head("<rect x=\"24\" y=\"24\" width=\"272\" height=\"122\" rx=\"8\" fill=\""+C.felt+"\" stroke=\""+C.brown+"\" stroke-width=\"4\"/>"+dot(84,62,8,C.paper)+dot(232,74,8,C.red)+line(84,62,164.1666666667,140,C.blue,2.5)+line(164.1666666667,140,232,74,C.blue,2.5)+T(164,128,14,C.gold,"P")),
  "body": [
    {
      "h": {
        "ko": "공은 거울처럼 튕긴다",
        "en": "A ball bounces like a mirror",
        "zh": "球像镜子一样反弹"
      },
      "p": {
        "ko": "이 수학 모형에서는 벽에 수직인 선을 기준으로 잰 <b>들어가는 각과 나오는 각이 같습니다.</b> 실제 당구공은 회전이나 벽의 탄성 때문에 달라질 수 있어요. 여기서는 같은 각으로 반사되는 이상적인 경로를 작도합니다.",
        "en": "In this model the <b>incoming and outgoing angles, measured from the normal to the wall, are equal</b>. Spin and cushion elasticity can change a real shot. Here we construct the ideal equal-angle path.",
        "zh": "在此模型中，以墙面法线为基准量出的<b>入射角与反射角相等</b>。真实击球会受旋转和库边弹性影响，这里只作理想的等角反射路径。"
      },
      "art": "<svg viewBox=\"0 0 320 130\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><line x1=\"24\" y1=\"96\" x2=\"296\" y2=\"96\" stroke=\"#8a6d46\" stroke-width=\"4\" stroke-linecap=\"round\"/><line x1=\"96\" y1=\"30\" x2=\"160\" y2=\"96\" stroke=\"#16417C\" stroke-width=\"2.5\" stroke-linecap=\"round\"/><line x1=\"160\" y1=\"96\" x2=\"224\" y2=\"30\" stroke=\"#16417C\" stroke-width=\"2.5\" stroke-linecap=\"round\"/><line x1=\"160\" y1=\"96\" x2=\"160\" y2=\"44\" stroke=\"#b0b7c3\" stroke-width=\"1.6\" stroke-linecap=\"round\" stroke-dasharray=\"4 3\"/><path d=\"M 160 74 A 22 22 0 0 0 145 82\" fill=\"none\" stroke=\"#D9534F\" stroke-width=\"2\"/><path d=\"M 175 82 A 22 22 0 0 0 160 74\" fill=\"none\" stroke=\"#D9534F\" stroke-width=\"2\"/><text x=\"132\" y=\"66\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"700\" fill=\"#D9534F\">=</text><text x=\"190\" y=\"66\" text-anchor=\"middle\" font-size=\"14\" font-weight=\"700\" fill=\"#D9534F\">=</text></svg>"
    },
    {
      "h": {
        "ko": "벽 너머에 가짜 공을 놓는다",
        "en": "Put a phantom ball beyond the cushion",
        "zh": "在库边的另一侧放一个假球"
      },
      "p": {
        "ko": "흰 공을 벽에 대고 접었을 때 겹치는 자리에 점을 하나 찍습니다. 벽을 거울이라고 보면 거기 비치는 <b>거울 속 공</b>이에요. 벽에서 같은 거리, 반대쪽입니다.",
        "en": "Fold the white ball across the cushion and mark where it lands. Treat the cushion as a mirror and that dot is the <b>ball in the mirror</b> — the same distance from the cushion, on the other side.",
        "zh": "把白球以库边为轴翻折过去，在落点画一个点。把库边看成镜子，那就是<b>镜中的球</b>——离库边同样远，在另一侧。"
      },
      "art": fig(line(24,70,296,70,C.brown,3)+dot(78,38,7,C.paper)+"<circle cx=\"78\" cy=\"38\" r=\"7\" fill=\"none\" stroke=\""+C.ink+"\"/>"+line(78,38,78,102,C.grey,1.5,"4 3")+"<circle cx=\"78\" cy=\"102\" r=\"7\" fill=\"none\" stroke=\""+C.red+"\" stroke-dasharray=\"4 3\"/>"+T(99,40,13,C.ink,"A")+T(101,108,13,C.red,"A′")+T(145,52,13,C.sub,"d")+T(145,96,13,C.sub,"d"))
    },
    {
      "h": {
        "ko": "가짜 공과 목표를 직선으로 잇는다",
        "en": "Join the phantom to the target",
        "zh": "把假球和目标连成直线"
      },
      "p": {
        "ko": "거울 속 공과 빨간 공을 자로 곧게 잇습니다. 그 직선이 벽과 만나는 자리가 바로 <b>겨눌 점</b>이에요. 거기를 맞히면 튕긴 공이 빨간 공으로 정확히 갑니다.",
        "en": "Draw a straight line from the mirrored ball to the red ball. Where that line crosses the cushion is <b>the point to aim at</b>. Hit it and the rebound runs straight to the red ball.",
        "zh": "用尺把镜中的球和红球连成一条直线。这条线与库边的交点，就是<b>要瞄准的点</b>。打中那里，反弹的球正好撞上红球。"
      },
      "art": "<svg viewBox=\"0 0 320 130\" xmlns=\"http://www.w3.org/2000/svg\" role=\"img\" aria-hidden=\"true\"><line x1=\"24\" y1=\"70\" x2=\"296\" y2=\"70\" stroke=\"#8a6d46\" stroke-width=\"4\" stroke-linecap=\"round\"/><circle cx=\"78\" cy=\"38\" r=\"9\" fill=\"#fff\"/><circle cx=\"78\" cy=\"38\" r=\"9\" fill=\"none\" stroke=\"#1A2233\" stroke-width=\"2\"/><circle cx=\"78\" cy=\"102\" r=\"9\" fill=\"none\" stroke=\"#D9534F\" stroke-width=\"2\" stroke-dasharray=\"4 3\"/><circle cx=\"248\" cy=\"38\" r=\"9\" fill=\"#D9534F\"/><line x1=\"78\" y1=\"102\" x2=\"248\" y2=\"38\" stroke=\"#b0b7c3\" stroke-width=\"1.8\" stroke-linecap=\"round\" stroke-dasharray=\"5 4\"/><line x1=\"78\" y1=\"38\" x2=\"163\" y2=\"70\" stroke=\"#16417C\" stroke-width=\"2.5\" stroke-linecap=\"round\"/><line x1=\"163\" y1=\"70\" x2=\"248\" y2=\"38\" stroke=\"#16417C\" stroke-width=\"2.5\" stroke-linecap=\"round\"/><circle cx=\"163\" cy=\"70\" r=\"5\" fill=\"#C9A063\"/><text x=\"163\" y=\"92\" text-anchor=\"middle\" font-size=\"15\" font-weight=\"700\" fill=\"#C9A063\">P</text></svg>"
    }
  ],
  "close": {
    "ko": "어려운 길을 한 번 접으면 곧은 길이 됩니다. 수학이 자주 쓰는 꾀예요.",
    "en": "Fold the awkward path once and it becomes a straight one. Mathematics uses that trick again and again.",
    "zh": "把绕远的路折一次，就变成了直路。这是数学常用的巧劲。"
  },
  "source": {
    "ko": "수학적 당구의 이상적 반사 모형입니다. 실제 공의 회전·마찰·크기를 반영한 조준 안내가 아닙니다.",
    "en": "An ideal mathematical billiard reflection, not aiming advice accounting for real spin, friction or ball size.",
    "zh": "这是数学台球的理想反射模型，不是考虑真实旋转、摩擦、球体大小的瞄准指导。"
  },
  "fit": {
    "units": [

    ],
    "threads": [

    ]
  },
  "age": [
    "mid",
    "senior"
  ],
  "references": [
    {
      "label": "Wolfram · Ideal billiards",
      "url": "https://mathworld.wolfram.com/Billiards.html"
    }
  ]
},

{
  "id": "mz-tile",
  "no": 8,
  "kicker": {
    "ko": "도형",
    "en": "Shapes",
    "zh": "图形"
  },
  "title": {
    "ko": "깨진 기와에서 원을 되찾는 법",
    "en": "Finding the Circle in a Broken Roof Tile",
    "zh": "从破瓦片里找回圆"
  },
  "lede": {
    "ko": "둥근 기와의 일부만 남았다면 원래 원을 어떻게 찾을까요? 남은 테두리가 정확한 원의 일부라고 가정해요.",
    "en": "If only part of a round tile remains, how can we recover its circle? Assume the surviving rim is part of an exact circle.",
    "zh": "如果圆瓦只剩一块，怎样找回原来的圆？假设剩余边缘是一个精确圆的一部分。"
  },
  "art": head("<circle cx=\"160\" cy=\"80\" r=\"60\" fill=\"none\" stroke=\""+C.grey+"\" stroke-dasharray=\"5 4\"/>"+"<path d=\"M 100 80 A 60 60 0 0 1 220 80 L 192 80 A 32 32 0 0 0 128 80 Z\" fill=\""+C.goldbright+"\" stroke=\""+C.brown+"\" stroke-width=\"2\"/>"+dot(100,80,5,C.red)+dot(160,20,5,C.red)+dot(220,80,5,C.red)+T(160,160,14,C.ink,"3")),
  "body": [
    {
      "h": {
        "ko": "테두리에 점 세 개를 찍는다",
        "en": "Mark three points on the rim",
        "zh": "在边缘上点三个点"
      },
      "p": {
        "ko": "남은 둥근 테두리에서 <b>서로 다른 세 점</b>을 골라요. 세 점이 한 직선 위에 있지 않으면 세 점을 지나는 원은 하나뿐입니다. 원의 일부라는 가정 덕분에 이 성질을 쓸 수 있어요.",
        "en": "Choose <b>three distinct points</b> on the remaining curved rim. If they are not collinear, exactly one circle passes through them. The assumption that this rim is circular makes that fact useful.",
        "zh": "在剩余弧边上取<b>互不相同的三点</b>。只要三点不共线，经过它们的圆就唯一。圆弧假设使我们能使用这条性质。"
      },
      "art": fig(tileScene(0))
    },
    {
      "h": {
        "ko": "두 현의 수직이등분선을 긋는다",
        "en": "Bisect two chords at right angles",
        "zh": "作两条弦的垂直平分线"
      },
      "p": {
        "ko": "세 점을 이어 삼각형을 만들어요. 두 변의 한가운데를 지나며 각 변에 <b>수직인 직선</b>을 그어요. 두 선의 교점 O는 세 꼭짓점에서 같은 거리에 있어 원의 중심이 됩니다. 이 점이 삼각형의 <b>외심</b>이에요.",
        "en": "Join the three points into a triangle. Draw a line through the midpoint of each of two sides, <b>perpendicular to that side</b>. Their intersection O is equally distant from all three vertices: the circle’s centre, or <b>circumcentre</b>.",
        "zh": "连接三点成三角形，过两边中点分别作<b>垂直于该边的直线</b>。交点O到三个顶点等距，所以是圆心，即三角形的<b>外心</b>。"
      },
      "art": fig(tileScene(1))
    },
    {
      "h": {
        "ko": "그 중심에서 원을 그린다",
        "en": "Draw the circle from that centre",
        "zh": "以那个圆心画圆"
      },
      "p": {
        "ko": "O에서 표시한 점까지의 거리를 반지름으로 원을 그리면 세 점을 모두 지납니다. 이 모형에서는 점들이 정확한 원 위에 있어서 원을 되찾을 수 있어요. 실제 유물은 닳거나 변형되므로 여러 점을 재어 오차도 확인해야 합니다.",
        "en": "Draw a circle centred at O with radius reaching a marked point: it passes through all three. The model works exactly because the points lie on a true circle. Worn or distorted artefacts need more measurements and error checks.",
        "zh": "以O为圆心，到一个标记点的距离为半径作圆，就会经过三点。模型中三点都在精确的圆上，因此可以准确还原。真实文物会磨损变形，需要更多测量与误差检查。"
      },
      "art": fig(tileScene(2))
    }
  ],
  "close": {
    "ko": "사라진 부분을 지어내지 않고, 남은 부분이 말해 주는 것만으로 되찾는 것 — 그게 수학의 복원입니다.",
    "en": "Recovering what is gone without inventing it, using only what the surviving part can tell you — that is restoration by mathematics.",
    "zh": "不去臆造缺失的部分，只凭残存部分给出的信息把它找回来——这就是数学的修复。"
  },
  "source": {
    "ko": "원의 일부를 복원하는 창작 기하 모형입니다. 특정 수막새의 실제 복원 기록이나 실측값을 재현한 것은 아닙니다.",
    "en": "Original geometric model of a circular fragment, not a reconstruction record or measured drawing of a specific artefact.",
    "zh": "这是还原圆形残片的原创几何模型，不是某件文物的实际修复记录或测量图。"
  },
  "fit": {
    "units": [

    ],
    "threads": [

    ]
  },
  "age": [
    "senior"
  ],
  "references": [
    {
      "label": "Wolfram · Circumcircle",
      "url": "https://mathworld.wolfram.com/Circumcircle.html"
    }
  ]
}

]};
/* Original illustrated articles: see docs/math-story-sources-20261025.md. */
const l3=(ko,en,zh)=>({ko,en,zh});
const ref=(label,url)=>({label,url});
const section=(h,p,art)=>({h,p,art});
const strip=(x,y,w,h,n,k,colors)=>Array.from({length:n},(_,i)=>box(x+i*w/n,y,w/n,h,i<k?(colors?.[i]||C.ok):C.mist,C.sub)).join('');
const cup=(x,y,amount)=>'<path d="M '+x+' '+y+' l 8 38 h 26 l 8 -38 Z" fill="'+C.cream+'" stroke="'+C.sub+'" stroke-width="2"/>'+'<path d="M '+(x+4)+' '+(y+15)+' l 5 21 h 24 l 5 -21 Z" fill="'+C.ok+'"/>'+T(x+21,y+61,16,C.ink,amount);
const bun=(x,y)=>'<path d="M '+x+' '+(y+30)+' V '+(y+10)+' C '+(x-5)+' '+(y-3)+' '+(x+27)+' '+(y-3)+' '+(x+22)+' '+(y+10)+' V '+(y+30)+' Z" fill="'+C.goldbright+'" stroke="'+C.brown+'" stroke-width="2"/>'+line(x+6,y+8,x+10,y+4,C.brown,1.5)+line(x+12,y+10,x+16,y+6,C.brown,1.5);
const turtle=(x,y)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="18" ry="12" fill="'+C.ok+'" stroke="'+C.ink+'" stroke-width="2"/>'+dot(x+22,y-2,7,C.ok)+line(x-10,y+10,x-13,y+16,C.ink,3)+line(x+10,y+10,x+13,y+16,C.ink,3);
/* Reuse the approved character asset in SVG diagrams, including subpath deployments. */
const characterImage=(x,y,w,h)=>{
  let base='/number_magic/assets/characters/';
  if(typeof document!=='undefined'){
    const script=document.querySelector('script[src*="data/magazine.js"]');
    if(script)base=new URL('../assets/characters/',script.src).href;
  }
  return '<image data-nm-character="kid-boy" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" href="'+safeText(base+'kid-boy.png')+'" preserveAspectRatio="xMidYMax meet"/>';
};

/* Teaching models: each mark carries a quantity, a unit, or a position. */
const tickBar=(x,y,w,h,n,k,colors,labels)=>strip(x,y,w,h,n,k,colors)+(labels||[]).map((v,i)=>T(x+(i+.5)*w/n,y+h*.7,15,C.ink,v)).join('');
const portionCup=(x,y,letter)=>'<path d="M '+x+' '+y+' l 8 38 h 26 l 8 -38 Z" fill="'+C.felt+'" stroke="'+C.sub+'" stroke-width="2"/>'+'<path d="M '+(x+2)+' '+(y+3)+' l 7 33 h 24 l 7 -33 Z" fill="'+C.ok+'"/>'+T(x+21,y+61,15,C.ink,letter?letter+': 1/4 L':'1/4 L');
function jug(x,y){return box(x,y,48,96,C.cream,C.sub)+'<rect x="'+(x+2)+'" y="'+(y+25)+'" width="44" height="69" fill="'+C.felt+'"/>'+[0,1,2,3,4].map(i=>line(x+40,y+96-i*24,x+51,y+96-i*24,C.ink,1.5)+T(x+73,y+101-i*24,12,C.ink,['0','1/4','1/2','3/4','1 L'][i])).join('');}
function sumRectangle(){const x=45,y=12,w=22,h=9;return Array.from({length:10},(_,i)=>'<rect x="'+x+'" y="'+(y+i*h)+'" width="'+((i+1)*w)+'" height="'+h+'" fill="'+C.felt+'"/>'+'<rect x="'+(x+(i+1)*w)+'" y="'+(y+i*h)+'" width="'+((10-i)*w)+'" height="'+h+'" fill="'+C.goldbright+'"/>').join('')+Array.from({length:12},(_,i)=>line(x+i*w,y,x+i*w,y+10*h,C.sub,1)).join('')+Array.from({length:11},(_,i)=>line(x,y+i*h,x+11*w,y+i*h,C.sub,1)).join('')+T(17,62,15,C.ink,'10')+T(166,14,12,C.ink,'11')+T(160,124,19,C.ink,'55 + 55 = 110');}
function chaseTable(){const xs=[35,118,200,280],ys=[25,61,96];return ys.map(y=>line(16,y+10,304,y+10,C.grey,1)).join('')+['t (s)','A (m)','T (m)'].map((v,i)=>T(xs[0],ys[i],16,C.ink,v)).join('')+[['1/2','1','1.5'],['3/4','1.5','1.75'],['1','2','2']].map((col,j)=>col.map((v,i)=>T(xs[j+1],ys[i],17,C.ink,v)).join('')).join('');}

const articles=[
{ id:'mz-sharing-fractions',no:9,age:['mid','senior'],fit:{units:[],threads:['FR1','FR2','FR3','FR9','FR8']},
 kicker:l3('분수의 시작','Discovering fractions','认识分数'),
 title:l3('분수가 먼저일까, 나눗셈이 먼저일까?','Fractions or division: which comes first?','先有分数，还是先有除法？'),
 lede:l3('똑같이 나누다 보니 한 개보다 작은 양이 생겼어요. 그 양에도 이름을 붙일 수 있을까요?','Sharing equally can give us less than one whole. How can we give that amount a number?','平均分以后，每份可能不到一个。怎样给这个量起一个数字名字呢？'),
 art:head(tickBar(26,35,96,32,3,3,[C.ok,C.gold,C.purple],['A','B','C'])+tickBar(26,94,96,32,3,3,[C.ok,C.gold,C.purple],['A','B','C'])+T(14,58,15,C.ink,'1')+T(14,117,15,C.ink,'1')+arrow(138,81,184,81,C.sub)+T(248,45,18,C.ink,'A')+tickBar(200,62,96,32,3,2,[C.ok,C.ok])+T(248,120,24,C.ink,'2/3')+T(160,157,21,C.ink,'2 ÷ 3 = 2/3')),
 spark:l3('빵 두 개를 셋이 나눴더니 여섯 조각. 친구가 “한 조각은 ⅙개야!”라고 말했어요. 무엇을 한 개로 보았는지 먼저 물어볼까요?','Two buns make six pieces. A friend says, “Each piece is 1/6 of a bun!” What did the friend choose as one whole?','两个面包切成六块，朋友说：“每块是1/6个面包！”先问一问：他把什么当成一个整体？'),
 body:[
 section(l3('한 개의 기준부터 정해요','Choose the whole first','先确定一个整体'),l3('여기서는 <b>같은 크기의 빵 한 개</b>가 기준 1이에요. 한 개를 똑같이 셋으로 나눈 한 조각이 ⅓입니다. 두 개의 빵을 셋으로 나누면 여섯 조각이 생겨도, 한 조각을 ⅙개라고 부르지 않아요. 기준인 빵 한 개에는 세 조각이 들어가니까요.','Our unit 1 is <b>one bun of a fixed size</b>. One of its three equal pieces is 1/3. Cutting two buns into thirds makes six pieces, but each is not 1/6 of a bun: three pieces, not six, make the chosen whole.','这里把<b>一个固定大小的面包</b>作为单位1。平均分成三份，每份是1/3。两个面包切出六块，并不说明每块是1/6个，因为作为单位的一个面包包含三块。'),fig(tickBar(25,30,270,46,3,3,[C.ok,C.gold,C.purple])+line(25,18,295,18,C.ink,2)+T(160,14,15,C.ink,'1')+T(160,115,24,C.ink,'1/3 + 1/3 + 1/3 = 1'))),
 section(l3('한 조각씩 두 번 받으면','One share from each bun','从每个面包各拿一份'),l3('A, B, C가 각 빵에서 한 조각씩 받아요. A의 초록 조각 두 개를 <b>기준 빵 한 개의 틀</b>에 옮겨 보세요. 세 칸 중 두 칸이 찹니다. A는 ⅓ + ⅓ = ⅔개를 받은 거예요. 색뿐 아니라 A·B·C 표식으로도 몫을 구별해 보세요.','A, B and C each take one piece from each bun. Move A’s two green pieces into <b>a frame the size of one whole bun</b>. They fill two of its three spaces: 1/3 + 1/3 = 2/3. The letters identify the shares as well as the colours.','A、B、C从每个面包各拿一块。把A的两块绿色面包放入<b>一个完整面包大小的框</b>，三格填满两格，所以1/3 + 1/3 = 2/3。除了颜色，也用A、B、C标明各人的份额。'),fig(tickBar(25,24,270,42,3,2,[C.ok,C.ok],['A','A',''])+T(160,109,24,C.ink,'1/3 + 1/3 = 2/3'))),
 section(l3('나눗셈식이 분수와 만나요','Connect the division and the fraction','除法和分数连起来'),l3('<b>전체 양 2개 ÷ 사람 수 3 = 한 명의 양 ⅔개</b>입니다. 세 명의 몫을 다시 모으면 ⅔ + ⅔ + ⅔ = 2개로 돌아와요. 똑같이 나눴는지, 남거나 모자란 양은 없는지 이 두 가지를 확인하면 나눗셈의 뜻을 설명할 수 있어요.','<b>Two buns ÷ three people = 2/3 of a bun each.</b> Recombine the shares: 2/3 + 2/3 + 2/3 = 2. Check both equal shares and conservation of the total. Those two checks explain why the division makes sense.','<b>2个面包 ÷ 3个人 = 每人2/3个。</b>把三人的份额合起来，2/3 + 2/3 + 2/3 = 2。既要每份相等，也要总量不变，这两点能帮助我们解释除法。'),fig([0,1,2].map(i=>T(55+i*105,18,16,C.ink,['A','B','C'][i])+T(55+i*105,58,23,C.ok,'2/3')).join('')+T(160,119,22,C.ink,'2/3 + 2/3 + 2/3 = 2')))
 ],close:l3('해 보기 · 같은 크기의 종이 빵 3개를 4명에게 나눠 보세요. 한 명의 몫은 빵 한 개의 얼마일까요?','Try it · Share three equal paper buns among four people. What fraction of one bun does each person get?','动手试试 · 把三个同样大的纸面包平均分给四个人，每人的份额是一个面包的几分之几？'),
 challenge:{prompt:l3('같은 빵 3개를 4명이 똑같이 나눠요. 한 명의 몫을 구하고, 잘라 낸 한 조각을 1/12개라고 불러도 되는지 설명해요.','Share three identical buns equally among four people. Find each share and explain why one cut piece is not 1/12 of a bun.','三个同样大的面包平均分给四个人。求每人的份额，并解释为什么切出的一小块不是1/12个面包。'),hint:l3('각 빵을 똑같이 네 조각으로 나누고, 한 명이 각 빵에서 한 조각씩 받게 해 보세요.','Quarter each bun. Let each person take one quarter from each of the three buns.','把每个面包平均切成四份，每人从三个面包中各拿一份。'),reason:l3('기준은 빵 한 개입니다. 한 조각은 ¼개이고 한 명은 세 조각, 곧 ¾개를 받아요. 네 명의 몫 ¾개씩을 합치면 3개가 됩니다. 열두 조각은 빵 세 개 전체를 센 수예요.','The whole is one bun. Each cut piece is 1/4, so three pieces give each person 3/4. Four shares of 3/4 total three buns. Twelve counts pieces across all three buns, not pieces in one bun.','单位是一个面包。每小块是1/4个，每人拿三块，共3/4个。四份3/4合起来是三个面包。十二块是三个面包的总块数，不是一个面包的块数。')},
  source:l3('창작 나눠 먹기 활동입니다. 학습을 이해하는 순서이며, 분수와 나눗셈의 역사적 선후를 단정하지 않습니다.','An original sharing activity. This is a learning sequence, not a claim about which idea appeared first in history.','这是原创分享活动，说明学习上的联系，不断言分数和除法在历史上的先后。'),
 references:[ref('EBS · 분수와 소수','https://livedown2.ebs.co.kr/ebsvod/elmt/live/%EC%B4%88%EB%93%B1%EB%A7%8C%EC%A0%90%EC%99%95_%EC%88%98%ED%95%993-1_4%EC%A3%BC%EC%B0%A8.pdf')]
},
{ id:'mz-two-divisions',no:10,age:['senior'],fit:{units:[],threads:['FR7','FR11','FR12']},
 kicker:l3('나눗셈의 두 뜻','Two meanings of division','除法的两种含义'),
 title:l3('얼마씩 나눌까, 몇 컵이 될까?','How much each, or how many cups?','每份多少，还是能装几杯？'),
 lede:l3('같은 주스 ¾L로 다른 질문을 해 볼까요? 나눗셈식의 답이 무엇을 뜻하는지 그림에서 찾아보세요.','Ask two different questions about the same 3/4 litre of juice. Use the pictures to explain what each quotient means.','同样是3/4升果汁，可以提出两种问题。看看图，解释每个除法算式的商表示什么。'),
 art:head(jug(28,24)+arrow(133,80,164,80,C.sub)+[0,1,2].map(i=>portionCup(169+i*49,53,'')).join('')),
 spark:l3('주스가 ¾L뿐인데 나눗셈의 답이 3이 되었어요. ‘나눴더니 주스가 더 많아졌다’는 설명이 맞을까요?','There is only 3/4 L of juice, yet a division gives 3. Has dividing made more juice?','果汁只有3/4升，除法的结果却是3。是除法让果汁变多了吗？'),
 body:[
 section(l3('등분제: 전체를 세 몫으로','Equal sharing: split into three shares','平均分：分成三份'),l3('1L 눈금통의 ¾L를 3명에게 똑같이 나눠요. <b>전체 양과 몫의 수</b>를 알므로 한 몫의 양을 구합니다. ¾ ÷ 3 = ¼, 한 명당 ¼L예요. 검산은 ¼L × 3 = ¾L. 컵의 크기가 아니라 실제 담은 양을 비교해요.','Split the marked 3/4 L equally among three people. We know <b>the total and the number of shares</b>, so find the amount in each: 3/4 ÷ 3 = 1/4 L per person. Check: 1/4 L × 3 = 3/4 L. Compare liquid amounts, not cup shapes.','把量杯里的3/4升平均分给三个人。已知<b>总量和份数</b>，求每份的量：3/4 ÷ 3 = 1/4升。验算：1/4升 × 3 = 3/4升。比较实际液量，不是杯子的外形。'),fig([0,1,2].map(i=>portionCup(32+i*105,12,['A','B','C'][i])).join('')+T(160,119,21,C.ink,'3/4 L ÷ 3 = 1/4 L'))),
 section(l3('포함제: 기준량이 몇 번 들어갈까','Measuring: how many portions fit?','按份分：包含几个单位量？'),l3('이번에는 한 컵에 ¼L씩 담아요. <b>전체 양과 한 몫의 양</b>을 아니까 몫의 수를 구합니다. ¾L에 ¼L가 세 번 들어가므로 답은 3컵. ¼L씩 세 몫을 합치면 ¾L로 돌아옵니다. 주스가 늘어난 것은 아닙니다.','Now use 1/4 L per cup. We know <b>the total and the amount per portion</b>, so count portions. Three quarters contain three 1/4-L portions: three cups. Recombine the three portions to recover 3/4 L. No extra juice has appeared.','这次每杯装1/4升。已知<b>总量和每份量</b>，求份数。3/4升包含三份1/4升，所以是三杯。再把三份合起来，仍是3/4升，果汁并没有变多。'),fig(strip(25,20,270,36,4,3)+[0,1,2].map(i=>T(59+i*67.5,87,20,C.ink,String(i+1))).join('')+T(160,120,22,C.ink,'(3/4 L) ÷ (1/4 L) = 3'))),
 section(l3('같은 주스, 다른 답의 역할','The answer has a different job','数字相同，意义也可能不同'),l3('‘3명에게’는 <b>사람 수</b>, ‘¼L씩’은 <b>한 몫의 양</b>이에요. 식을 쓰기 전에 답을 ‘한 명당 몇 L’ 또는 ‘몇 컵’으로 말해 보세요. 같은 ¾L에서 시작했어도 묻는 양이 달라 답의 단위도 달라집니다.','“Three people” gives <b>the number of shares</b>; “1/4 L each” gives <b>the amount per share</b>. Say the answer’s job before calculating: litres per person, or cups. The same starting volume can support different questions and answer units.','“三个人”给出<b>份数</b>，“每份1/4升”给出<b>每份量</b>。计算前先说清要找每人多少升，还是多少杯。同样从3/4升出发，问题和答案的单位都可能不同。'),fig(T(160,35,22,C.ink,'3/4 L ÷ 3 = 1/4 L')+line(20,59,300,59,C.grey,1.5)+T(160,99,22,C.ink,'(3/4 L) ÷ (1/4 L) = 3')))
 ],close:l3('해 보기 · 주스 ½L를 한 컵에 ¼L씩 담으면 몇 컵일까요? 종이띠에 1L를 정하고 ¼L 눈금을 그려 설명해 보세요.','Try it · How many 1/4-L cups can you fill with 1/2 L? Draw a strip for 1 L and mark the quarters to explain.','动手试试 · 半升果汁，每杯装1/4升，能装几杯？用一条纸带表示1升，画出每1/4升的刻度来说明。'),
 challenge:{prompt:l3('주스 ½L로 두 문제를 만드세요. ① 두 명에게 똑같이 나누기 ② ¼L씩 컵에 담기. 각 식과 답의 단위를 설명해 보세요.','Make two questions about 1/2 L: share equally between two people, and fill cups with 1/4 L each. Write both divisions and explain the answer units.','用1/2升果汁提出两个问题：①平均分给两个人；②每杯装1/4升。写出两个除法算式，并说明答案的单位。'),hint:l3('첫 물음은 한 명의 양을, 둘째 물음은 컵 수를 찾아요.','The first seeks the amount per person; the second seeks the cup count.','第一个问题求每人的量，第二个求杯数。'),reason:l3('① ½L ÷ 2 = ¼L, 한 명당 ¼L예요. ② ½L ÷ ¼L = 2, 두 컵이에요. 양은 둘 다 ½L 그대로이고, 모르는 것이 한 몫의 양인지 몫 수인지가 다릅니다.','First, 1/2 L ÷ 2 = 1/4 L per person. Second, (1/2 L) ÷ (1/4 L) = 2 cups. The total stays 1/2 L; the unknown is either the size of a share or the number of shares.','①1/2升 ÷ 2 = 1/4升，即每人1/4升。②(1/2升) ÷ (1/4升) = 2，即两杯。总量一直是1/2升，不同的是要求每份量还是份数。')},
  source:l3('등분제는 분할 모델, 포함제는 측정 모델로 설명할 수 있습니다. 주스 그림과 수치는 이해를 위한 창작 예입니다.','Equal sharing is a partition model; counting equal portions is a measurement model. The juice examples and illustrations are original teaching models.','平均分可用分割模型解释，按每份量求份数可用测量模型解释。果汁的图和数值为原创教学示例。'),references:[ref('KERIS · 초등 수학 내용 전문성 향상','https://contents2.kocw.or.kr/KOCW/data/keris/2020/keris1/keris2/7.pdf')]
},
{ id:'mz-gauss-pairs',no:11,age:['mid','senior'],fit:{units:[],threads:['AD7','MD40','MD42','MD149','MD150']},
 kicker:l3('가우스와 수열','Gauss and sums','高斯与求和'),
 title:l3('앞과 뒤를 짝지으면 왜 빨라질까?','Why pair the first and last?','首尾配对，为什么算得快？'),
 lede:l3('1부터 10까지 더해 보세요. 순서대로 더하는 대신, 양쪽 끝의 수를 만나게 하면 어떤 일이 생길까요?','Add the numbers from 1 to 10. What happens if you pair numbers from opposite ends instead of adding in order?','把1到10的数加起来。不按顺序加，而把两端的数配对，会发现什么？'),
 art:head(T(160,21,17,C.ink,'1 + 2 + 3 + … + 10')+Array.from({length:5},(_,i)=>T(48+i*56,64,21,C.ink,String(i+1))+T(48+i*56,126,21,C.ink,String(10-i))+line(48+i*56,75,48+i*56,104,C.ok,2)).join('')+T(160,155,18,C.ink,'11 × 5 = 55')),
 spark:l3('가우스의 어린 시절 계산 일화로 유명한 짝짓기예요. ‘천재니까 빠르다’ 대신, 누구나 확인할 수 있는 계산의 구조를 찾아볼까요?','Pairing is famous through stories of the young Gauss. Rather than saying “a genius is fast”, can we find a structure anyone can check?','配对求和因高斯童年的故事而出名。与其说“天才算得快”，不如找出人人都能检验的结构。'),
 body:[
 section(l3('한쪽이 커진 만큼 다른 쪽이 작아져요','One rises as the other falls','一边增大，另一边减小'),l3('1과 10을 더하면 11이에요. 2와 9에서는 첫째 수가 1 커지고 둘째 수가 1 작아져 합은 그대로죠. <b>숫자를 외운 것이 아니라 변하지 않는 합을 찾은 것</b>입니다. 다섯 짝이 수 열 개를 빠짐없이 쓰는지도 확인해요.','The pair 1 and 10 sums to 11. In 2 and 9, one term rises by one while the other falls by one, preserving the sum. <b>The method finds an invariant sum, not a memorised answer.</b> Check that the five pairs use all ten numbers once.','1和10相加是11；换成2和9，一个加1，另一个减1，和保持不变。<b>关键不是记住答案，而是找到不变的和。</b>还要检查五对是否把十个数各用了一次。'),fig(T(160,30,23,C.ink,'1 + 10 = 11')+arrow(72,43,72,73,C.ok,2)+arrow(165,43,165,73,C.gold,2)+T(160,104,23,C.ink,'2 + 9 = 11'))),
 section(l3('같은 계단을 뒤집어 붙여요','Turn a second staircase around','把另一组阶梯倒过来拼'),l3('1칸부터 10칸까지 늘어나는 초록 계단을 만들어요. 같은 계단 한 벌을 뒤집어 금색으로 붙이면 <b>가로 11칸, 세로 10줄</b>의 직사각형이 됩니다. 전체 110칸은 같은 두 벌의 합이므로 한 벌은 55칸이에요.','Build the green staircase with rows of 1 to 10 cells. Turn an identical copy around and add it in gold: <b>11 columns and 10 rows</b> form a rectangle. Its 110 cells are two equal copies, so one staircase has 55.','绿色阶梯各行有1到10格。把同样的一组倒过来，用金色拼上，就组成<b>11列、10行</b>的长方形。110格是相同两组的总数，所以一组是55格。'),fig(sumRectangle())),
 section(l3('수의 개수가 홀수여도 될까요','Does an odd number of terms break it?','有奇数个数还能配对吗？'),l3('1부터 9까지는 합이 10인 짝 네 개와 가운데 5가 남아요. 그래서 10 × 4 + 5 = 45예요. 또는 같은 계단 두 벌로 9 × 10 = 90칸을 만들고 반으로 나눠도 됩니다. <b>두 설명이 같은 답으로 만나요.</b>','For 1 to 9, four pairs sum to 10 and the middle 5 remains: 4 × 10 + 5 = 45. Alternatively, two staircases form 9 × 10 = 90 cells; take half. <b>The two explanations agree.</b>','把1到9配对，得到四对和为10的数，中间剩5，所以4 × 10 + 5 = 45。也可以用两组阶梯拼成9 × 10 = 90格，再取一半。<b>两种解释得到同一答案。</b>'),fig(T(160,32,23,C.ink,'4 × 10 + 5 = 45')+line(20,58,300,58,C.grey,1.5)+T(160,103,23,C.ink,'(9 × 10) ÷ 2 = 45')))
 ],close:l3('해 보기 · 1부터 20까지의 합을 짝짓기로 구해 보세요. 한 짝의 합과 짝의 개수를 먼저 말해 보세요.','Try it · Pair the numbers from 1 to 20. First explain the sum of each pair and how many pairs there are.','动手试试 · 用首尾配对求1到20的和。先说每对的和是多少，一共有几对。'),
 challenge:{prompt:l3('1부터 20까지 더한 뒤, 1부터 21까지도 구해 보세요. 짝짓기에서 남는 수가 있는지 설명하고 두 답의 차이도 확인해요.','Find the sums from 1 to 20 and from 1 to 21. Explain whether pairing leaves a middle term, then check the difference between the sums.','分别求1到20与1到21的和。解释配对后有没有剩下中间的数，再检查两次结果的差。'),hint:l3('1~20은 합이 21인 짝이 열 개예요. 1~21은 합이 22인 짝 열 개와 가운데 수가 남아요.','For 1–20 there are ten pairs of 21. For 1–21 there are ten pairs of 22 and a middle term.','1到20可配成十对，每对和为21；1到21可配成十对，每对和为22，中间还剩一个数。'),reason:l3('1~20은 21 × 10 = 210입니다. 1~21은 22 × 10 + 11 = 231이에요. 차이는 새로 더한 21이므로, 원래 합에 마지막 수를 더한 결과와도 일치합니다.','The first sum is 21 × 10 = 210. The second is 22 × 10 + 11 = 231. Their difference is the new term 21, agreeing with adding 21 to the first sum.','第一个和是21 × 10 = 210；第二个是22 × 10 + 11 = 231。差是新加的21，也与在第一个和上加21的结果相同。')},
  source:l3('가우스와 관련해 널리 소개되는 수열의 합 주제를 창작 예로 풀었습니다. 어린 시절 일화의 대사나 세부 상황을 역사적 사실로 재현하지 않았습니다.','An original pairing activity on sums associated with Gauss. It does not reconstruct dialogue or details of the childhood anecdote as historical fact.','本篇以常与高斯联系的求和主题设计原创配对活动，不把童年轶事的对白或细节当作史实重现。'),references:[ref('MacTutor · Gauss','https://mathshistory.st-andrews.ac.uk/Biographies/Gauss/'),ref('자음과모음 · 가우스와 수열의 합','https://www.jamomall.com/goods/goods_view.php?goodsNo=4002')]
},
{ id:'mz-leibniz-binary',no:12,age:['mid','senior'],fit:{units:[],threads:['NS1','NS5','MD10','MD36']},
 kicker:l3('라이프니츠와 수 표현','Leibniz and numerals','莱布尼茨与记数'),
 title:l3('0과 1만으로 13을 쓸 수 있을까?','Can just 0 and 1 write thirteen?','只用0和1，能写出十三吗？'),
 lede:l3('우리는 0부터 9까지 열 가지 숫자를 써요. 숫자 두 가지만 쓰는 세계에서는 13을 어떻게 나타낼까요?','We use ten digits, 0 to 9. How could a number system with only two digits represent thirteen?','我们用0到9这十个数字。如果一种记数方法只用两个数字，会怎样表示十三呢？'),
 art:head([8,4,2,1].map((v,i)=>box(20+i*75,25,60,62,[0,1,3].includes(i)?C.felt:C.mist,C.sub)+T(50+i*75,63,28,C.ink,String(v))+T(50+i*75,128,29,C.ink,[1,1,0,1][i])).join('')),
 spark:l3('숫자 0과 1만 쓰면 큰 수를 못 쓸까요? 11이 언제나 ‘십일’인지, 숫자 카드의 자리부터 살펴보세요.','Can only two digit symbols describe large numbers? Before reading 11 as eleven, check the values of its places.','只用0和1，就不能写大数吗？先看看位值，再判断11是否总是十一。'),
 body:[
 section(l3('숫자 모양과 나타내는 양을 구별해요','Separate a digit from its value','分清数字符号与它表示的量'),l3('십진법에서 11은 10 하나와 1 하나예요. 이진법의 11은 <b>2 하나와 1 하나</b>라서 십진법으로 3입니다. 같은 글자 ‘11’도 자리가 커지는 규칙을 알아야 읽을 수 있어요. 이진법의 자리는 오른쪽부터 1, 2, 4, 8이에요.','Decimal 11 means one ten and one one. Binary 11 means <b>one two and one one</b>, or decimal 3. The same written digits need a place-value rule to be read. Binary places, from the right, are 1, 2, 4 and 8.','十进制的11表示一个十和一个一；二进制的11表示<b>一个二和一个一</b>，也就是十进制的3。同样写成“11”，必须知道位值规则才能读懂。二进制从右起各位是1、2、4、8。'),fig(T(160,35,24,C.ink,'11₁₀ = 10 + 1')+line(25,60,295,60,C.grey,1.5)+T(160,103,24,C.ink,'11₂ = 2 + 1 = 3₁₀'))),
 section(l3('고른 자리만 더해서 검산해요','Add the chosen places to check','把选中的位值相加验算'),l3('13을 만들려면 8, 4, 1을 골라요. <b>고른 자리에는 1, 쓰지 않은 자리에는 0</b>을 적으면 1101₂가 됩니다. 0을 빼고 111로 줄이면 안 돼요. 111₂는 4 + 2 + 1 = 7이라 자리의 뜻이 바뀌니까요.','Choose 8, 4 and 1 for thirteen. Put <b>1 in chosen places and 0 in the unused place</b>: 1101₂. Do not drop the zero to make 111: that binary number means 4 + 2 + 1 = 7, because the places have shifted.','选8、4、1组成十三。<b>选中的位写1，未选中的位写0</b>，得到1101₂。不能省略0写成111，因为111₂是4 + 2 + 1 = 7，位值已经改变。'),fig(T(160,32,23,C.ink,'1101₂ = 8 + 4 + 0 + 1')+T(160,70,23,C.ok,'= 13₁₀')+T(160,113,20,C.ink,'111₂ = 4 + 2 + 1 = 7₁₀'))),
 section(l3('네 장으로 어디까지 만들까요','What is the largest four-card value?','四张卡最多能表示多少？'),l3('라이프니츠는 0과 1로 계산하는 방법을 1703년 글에서 설명했어요. 네 장을 모두 고르면 8 + 4 + 2 + 1 = 15입니다. <b>16은 새 자리 하나가 필요</b>해요. 숫자를 적게 쓴다는 것은 나타낼 수 있는 양도 적다는 뜻은 아닙니다.','Leibniz explained arithmetic using 0 and 1 in a text dated 1703. All four cards total 8 + 4 + 2 + 1 = 15. <b>Sixteen needs a new place</b>. Having fewer digit symbols does not mean the system can express fewer amounts.','莱布尼茨在1703年的文章中解释只用0和1的计算方法。四张卡全选，得到8 + 4 + 2 + 1 = 15。<b>表示十六需要新增一位</b>。数字符号少，并不意味着能表示的量少。'),fig(T(160,35,24,C.ink,'1111₂ = 15₁₀')+arrow(160,49,160,78,C.ok)+T(160,113,24,C.ink,'10000₂ = 16₁₀')))
 ],close:l3('해 보기 · 같은 네 장의 카드로 10과 15를 만들어 보세요. 고른 카드 아래에 1, 나머지에는 0을 써 보세요.','Try it · Use the same four cards to make ten and fifteen. Write 1 below chosen cards and 0 below the others.','动手试试 · 用同样四张卡表示十和十五。选中的卡下写1，其余写0。'),
 challenge:{prompt:l3('십진법의 10과 16을 이진법으로 쓰세요. 10의 표기 중 0을 하나 지우면 왜 같은 수가 아닌지도 설명해요.','Write decimal ten and sixteen in binary. Explain why removing a zero from the representation of ten changes its value.','把十进制的十和十六写成二进制，并解释为什么删去十的表示中的一个0就不是同一个数。'),hint:l3('10은 8 + 2예요. 16은 네 장의 합 15보다 1 커서 다섯 번째 자리가 필요해요.','Ten is 8 + 2. Sixteen is one above the four-card maximum, so it needs a fifth place.','十等于8 + 2；十六比四张卡的最大和15多一，需要第五位。'),reason:l3('10은 1010₂, 16은 10000₂입니다. 1010에서 0을 지우면 110₂(6) 또는 101₂(5)가 돼요. 0도 자리를 지켜 양을 구별하는 역할을 합니다.','Ten is 1010₂; sixteen is 10000₂. Removing a zero from 1010 gives 110₂ (six) or 101₂ (five). Zero preserves place value even when that place is unused.','十是1010₂，十六是10000₂。从1010删去一个0，会变成110₂（六）或101₂（五）。0虽然表示该位未选，也起着保持位值的作用。')},
  source:l3('1703년 글의 존재는 MIT Press의 라이프니츠 원문 번역 목록으로 대조했습니다. 카드와 예시는 자체 제작했습니다.','The 1703 publication is documented in MIT Press’s collection of translated Leibniz texts. The cards and examples are original.','1703年的文章见于MIT Press收录的莱布尼茨原文译作目录。卡片和例子为原创。'),references:[ref('MIT Press · Leibniz on Binary','https://direct.mit.edu/books/monograph/5492/Leibniz-on-BinaryThe-Invention-of-Computer')]
},
{ id:'mz-napier-log',no:13,age:['senior'],fit:{units:[],threads:['MD37','MD38','MD135','MD138','MD139']},
 kicker:l3('네이피어와 로그','Napier and logarithms','纳皮尔与对数'),
 title:l3('곱셈을 덧셈으로 바꾸는 비밀','The secret of turning products into sums','把乘法变成加法的秘密'),
 lede:l3('큰 수의 곱셈을 매번 손으로 해야 한다면 어떨까요? 수학자들은 계산을 줄이는 방법을 찾았어요.','Imagine doing every large multiplication by hand. Mathematicians looked for ways to make those calculations shorter.','如果每一道大数乘法都要手算，会怎样呢？数学家一直在寻找简化计算的方法。'),
 art:head(T(160,35,26,C.ink,'100 × 1000 = 100000')+arrow(160,51,160,93,C.ok)+T(160,130,27,C.ink,'2 + 3 = 5')),
 spark:l3('로그를 더해 5가 나왔다면, 원래 두 수의 곱도 5일까요? 계산을 바꾼 뒤 원래 수의 세계로 돌아오는 길을 찾아보세요.','If two logarithms add to five, is the original product also five? Follow the route back from exponents to values.','两个对数相加得到5，原来两数的乘积也是5吗？找出从指数还原到数值的路径。'),
 body:[
 section(l3('쌓인 10의 개수를 세어 봐요','Count factors of ten','数一数相乘的十'),l3('100 × 1000은 (10 × 10) × (10 × 10 × 10)이에요. 모두 다섯 개의 10을 곱하므로 10⁵이 됩니다. <b>곱셈을 했는데 지수에서는 덧셈</b>이 일어나요. 이 관계가 로그의 성질을 이해하는 출발점이에요.','Expand 100 × 1000 as (10 × 10) × (10 × 10 × 10). There are five factors of ten, giving 10⁵. <b>Multiplying the values adds their exponents</b>. This relationship motivates the logarithm rule.','把100 × 1000展开成(10 × 10) × (10 × 10 × 10)，共有五个10相乘，得到10⁵。<b>数值相乘，指数相加</b>，这正是理解对数性质的起点。'),fig(T(160,32,23,C.ink,'10² × 10³ = 10⁵')+T(160,75,23,C.ok,'2 + 3 = 5')+T(160,115,17,C.sub,'100 × 1000 = 100000'))),
 section(l3('바꿔 계산하고, 다시 돌아와요','Transform, add, then return','先转换，相加，再还原'),l3('log₁₀A는 ‘10을 몇 제곱하면 A일까?’를 묻습니다. 양수 A, B의 곱을 구할 때 두 로그를 더한 값은 <b>곱의 로그</b>예요. 그것이 곱 자체는 아닙니다. 2 + 3 = 5를 얻었다면 다시 10⁵으로 돌아와야 해요.','log₁₀A asks for the power of ten that gives A. For positive A and B, adding their logs gives <b>the logarithm of the product</b>, not the product itself. If the sum is five, return to 10⁵ to obtain the product.','log₁₀A是在问：10的几次方等于A？对正数A、B，两数的对数之和是<b>乘积的对数</b>，不是乘积本身。得到5以后，还要还原成10⁵。'),fig(T(160,27,21,C.ink,'100, 1000')+arrow(160,39,160,58,C.ok,2)+T(160,84,23,C.ink,'2 + 3 = 5')+T(160,121,21,C.ok,'10⁵ = 100000'))),
 section(l3('왜 계산표를 만들었을까요','Why make tables at all?','为什么要编制计算表？'),l3('항해와 천문 관측에는 긴 계산이 필요했어요. 네이피어는 1614년 로그표를 발표해 계산을 줄이는 길을 열었습니다. <b>그의 원래 정의는 현대 상용로그와 달라요.</b> 이 지면은 현대식으로 원리를 설명하며, 표에서 읽은 근삿값은 정확한 값과 구별합니다.','Navigation and astronomy demanded lengthy calculations. Napier’s 1614 tables helped shorten them. <b>His original definition differed from today’s common logarithms.</b> This page uses the modern version to explain the principle; rounded table entries must be distinguished from exact values.','航海与天文观测需要繁长的计算。纳皮尔1614年的对数表帮助简化了这些工作。<b>他的原始定义与现代常用对数不同。</b>本页用现代形式说明原理，并把表中近似值与精确值区分开。'),fig(T(160,28,22,C.ink,'log₁₀ 2 ≈ 0.3010')+T(160,67,22,C.ink,'log₁₀ 5 ≈ 0.6990')+T(160,109,22,C.ok,'log₁₀ 10 = 1')))
 ],close:l3('해 보기 · 1000 × 1000을 10의 거듭제곱과 지수의 덧셈으로 각각 설명해 보세요.','Try it · Explain 1000 × 1000 using powers of ten and then the addition of their exponents.','动手试试 · 用10的幂以及指数相加，分别解释1000 × 1000。'),
 challenge:{prompt:l3('1000 × 1000의 값을 로그의 관점에서 설명하세요. ‘3 + 3 = 6이니 답은 6’이라는 말을 어떻게 고칠까요?','Explain 1000 × 1000 using logarithms. Correct the claim: “3 + 3 = 6, so the product is six.”','用对数解释1000 × 1000，并纠正“3 + 3 = 6，所以乘积是6”的说法。'),hint:l3('더한 결과는 곱의 로그예요. 10을 그만큼 거듭제곱하면 원래 곱으로 돌아와요.','The sum is the logarithm of the product. Raise ten to that power to return to the product.','相加得到的是乘积的对数，还需要求10的这个次方。'),reason:l3('log₁₀1000 = 3이므로 곱의 로그는 6입니다. 따라서 곱은 10⁶ = 1000000이에요. 로그 6과 원래 수 1000000은 서로 다른 역할의 값입니다.','Each log is three, so the product’s logarithm is six. The product is therefore 10⁶ = 1000000. The logarithm six and the original value one million play different roles.','log₁₀1000 = 3，所以乘积的对数是6。乘积应为10⁶ = 1000000。对数6与原数1000000代表不同层次的量。')},
  source:l3('Open University의 네이피어 해설로 연도와 정의의 차이를 확인했습니다. 수치·그림은 현대 로그를 설명하는 창작 예입니다.','The Open University account documents the date and the difference in definitions. The numerical illustrations are original examples of modern logarithms.','年份及定义差异参照英国开放大学的纳皮尔专题。数值和图是用于解释现代对数的原创例子。'),references:[ref('Open University · John Napier','https://www.open.edu/openlearn/science-maths-technology/mathematics-statistics/john-napier/content-section-5/?printable=1')]
},
{ id:'mz-zeno',no:14,age:['senior'],fit:{units:[],threads:['MD41','MD43','MD149','MD151','MD152']},
 kicker:l3('제논의 역설','Zeno’s paradox','芝诺悖论'),
 title:l3('거북이를 정말 따라잡을 수 없을까?','Can Achilles ever catch the tortoise?','阿基里斯能追上乌龟吗？'),
 lede:l3('빠른 아킬레우스와 느린 거북이가 달려요. 거북이에게 먼저 출발할 자리를 주면, 빠른 쪽도 영원히 못 따라잡을까요?','Fast Achilles races a slow tortoise. If the tortoise starts ahead, could even the faster runner fail to catch it forever?','跑得快的阿基里斯追赶慢乌龟。让乌龟先站在前面，快的一方就永远追不上了吗？'),
 art:head(line(24,125,296,125,C.ink,3)+characterImage(4,43,62,82)+turtle(155,107)+arrow(67,96,127,96,C.gold)+arrow(184,96,214,96,C.ok)+T(43,35,18,C.ink,'2 m/s')+T(157,67,18,C.ink,'1 m/s')+T(35,156,17,C.sub,'0')+T(155,156,17,C.sub,'1 m')+T(275,156,17,C.sub,'2 m')),
 spark:l3('“앞선 자리까지 가도 거북이는 또 앞으로 가니, 영원히 못 잡아.” 이 말에서 ‘앞선 순간들’과 ‘만나는 순간’이 뒤섞이지 않았을까요?','“Each time I reach its old position, it has moved again, so I never catch it.” Does this confuse earlier moments with the meeting itself?','“每次到达乌龟原来的位置，它又前进了，所以永远追不上。”这是否把早先的时刻与相遇时刻混在了一起？'),
 body:[
 section(l3('아직 만나기 전의 순간들','A sequence of earlier moments','一系列相遇之前的时刻'),l3('거북이는 1m 앞에서 초당 1m, 아킬레우스는 초당 2m로 가는 모형이에요. A는 아킬레우스, T는 거북이입니다. <b>같은 시각의 두 위치</b>를 표에서 비교해 보세요. ‘거북이의 옛 위치에 도착했다’와 ‘지금 거북이를 만났다’는 다른 말이에요.','Our model gives a 1 m head start and speeds of 2 m/s for Achilles (A) and 1 m/s for the tortoise (T). Compare <b>both positions at the same time</b> in the table. Reaching a past position is different from meeting the tortoise now.','模型中乌龟领先1米，A（阿基里斯）每秒跑2米，T（乌龟）每秒走1米。在表中比较<b>同一时刻的两个位置</b>。到达乌龟过去的位置，与此刻追上它，并不是一回事。'),fig(chaseTable())),
 section(l3('끝없는 합은 모두 같을까요','Are all infinite sums alike?','无限项相加都一样吗？'),l3('추격 단계의 시간은 ½, ¼, ⅛초로 줄어듭니다. 네 단계 합은 15/16초이고, 남은 시간은 1/16초예요. 반면 매번 ½초씩 더하면 네 단계만으로도 2초입니다. <b>단계가 몇 개인지뿐 아니라, 각 단계의 크기가 어떻게 변하는지</b>를 봐야 해요.','The chase stages take 1/2, 1/4, 1/8 s and keep shrinking. Four total 15/16 s, leaving 1/16 s to the meeting. By contrast, four equal half-seconds already total two seconds. Check <b>how term sizes change</b>, not just how many there are.','追赶的各段时间是1/2、1/4、1/8秒，逐段缩短。四段合计15/16秒，距离相遇还差1/16秒。若每段都是1/2秒，四段已经是2秒。<b>不只看项数，还要看每项的大小如何变化。</b>'),fig(strip(20,12,280,24,16,15,Array(8).fill(C.ok).concat(Array(4).fill(C.gold),Array(2).fill(C.purple),C.red))+T(160,60,18,C.ink,'1/2 + 1/4 + 1/8 + 1/16 = 15/16')+T(160,107,20,C.ink,'1/2 + 1/2 + 1/2 + 1/2 = 2'))),
 section(l3('꼭 마지막 단계가 있어야 만날까요','Must there be a last listed stage?','一定要有最后一段才能相遇吗？'),l3('아킬레우스는 1초에 거북이보다 1m 더 가므로, 1m 간격은 1초에 닫혀요. 식으로도 2t = 1 + t, t = 1입니다. <b>나열한 시각에 마지막 항이 없다는 것과 만나는 시각이 없다는 것은 다릅니다.</b> 극한인 1초에 둘은 2m에서 만나요.','Achilles closes the gap by 1 m each second, so a 1 m lead closes in one second. Algebra agrees: 2t = 1 + t gives t = 1. <b>No last term in the earlier-time sequence does not mean no meeting time.</b> At its limit, one second, both are at 2 m.','阿基里斯每秒比乌龟多走1米，所以1米的间距一秒就能缩小。方程2t = 1 + t也给出t = 1。<b>早先时刻的数列没有最后一项，不等于不存在相遇时刻。</b>在其极限1秒时，两者都在2米处。'),fig(T(160,28,23,C.ink,'x(A) = 2t')+T(160,65,23,C.ink,'x(T) = 1 + t')+T(160,108,21,C.ok,'t = 1 s  →  x(A) = x(T) = 2 m')))
 ],close:l3('해 보기 · 종이띠를 반씩 네 번 나누어 색칠해 보세요. 칠한 부분은 15/16, 남은 부분은 1/16이에요. 유한한 네 단계의 합과 극한 1은 어떻게 다른가요?','Try it · Shade half the remaining paper strip four times. The shaded amount is 15/16 and the remainder 1/16. How does that finite sum differ from its limit, 1?','动手试试 · 每次把剩余纸带的一半涂色，共涂四次。涂色部分为15/16，剩1/16。这有限四步的和与极限1有什么不同？'),
 challenge:{prompt:l3('거북이의 처음 앞선 거리를 2m로 바꾸고 속도는 그대로 두세요. 언제 어디서 만날까요? ‘무한히 많은 단계’라는 이유만으로 답을 정할 수 있을까요?','Double the head start to 2 m while keeping both speeds. When and where do they meet? Is counting infinitely many stages enough to decide?','把乌龟的领先距离改为2米，速度不变。何时、何处相遇？只凭“步骤无限多”能决定答案吗？'),hint:l3('두 위치를 2t와 2 + t로 쓰고 같아지는 시간을 찾아보세요.','Compare 2t with 2 + t and find when they are equal.','把位置写成2t与2 + t，求它们相等的时刻。'),reason:l3('2t = 2 + t이므로 t = 2초, 위치는 4m예요. 초당 간격이 1m씩 줄어 2m를 좁히는 데 2초가 걸립니다. 단계가 끝없이 나뉘어도, 이 모형의 시간 합은 유한합니다.','From 2t = 2 + t, t = 2 s and the meeting position is 4 m. The gap closes at 1 m/s, so closing 2 m takes 2 s. Infinitely subdividing that motion does not make its total time infinite.','由2t = 2 + t得t = 2秒，相遇位置为4米。每秒缩小1米的间距，缩小2米需2秒。即使过程被无限细分，这个模型中的总时间仍有限。')},
  source:l3('제논의 아킬레우스 역설을 바탕으로 만든 수치 모형입니다. 극한에 의한 수학적 설명을 다루며, 운동과 무한에 관한 철학적 논의 전체가 끝났다는 뜻은 아닙니다.','An original numerical model of Zeno’s Achilles paradox. It illustrates a mathematical account using limits, not a resolution of every philosophical issue about motion and infinity.','这是根据芝诺追龟悖论设计的数值模型，说明极限的数学解释，不意味着运动与无限的所有哲学问题都已解决。'),references:[ref('Stanford · Zeno’s Paradoxes','https://plato.stanford.edu/entries/paradox-zeno/'),ref('Open University · Achilles and the Tortoise','https://www.open.edu/openlearn/mod/oucontent/view.php?id=135657&section=5.1')]
}
];
window.NM_MAGAZINE.rich = magazineRich;
window.NM_MAGAZINE.articles.push(...articles);

})();
