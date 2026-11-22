// 황소 6-2 5단원 개념탐구 2(원과 부채꼴의 넓이) 원문 구조 유형. 문항마다 같은 구조의 검증된 3문항 풀.
(function(root){'use strict';
const GROUP='6-2-u5-e2';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;
const PI227=mx(3,1,7);

// ── 수 표기 도우미 ──
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;};
// 백분의 일 단위 정수 h → 소수 문자열
const H=h=>{const i=Math.floor(h/100),f=h%100;return String(i)+(f?'.'+String(f).padStart(2,'0').replace(/0+$/,''):'');};
// 유한소수 n/d → 소수 문자열
const DEC=(n,d)=>{let i=Math.floor(n/d),r=n%d,t='';for(let k=0;k<8&&r;k++){r*=10;t+=Math.floor(r/d);r%=d;}return String(i)+(t?'.'+t:'');};
// 분수 n/d → 자연수 또는 기약 대분수/진분수 HTML
const FR=(n,d)=>{const g=gcd(n,d);n/=g;d/=g;if(d===1)return String(n);const w=Math.floor(n/d),r=n%d;return w?mx(w,r,d):ff(r,d);};

// ── SVG 도우미 ──
const rd=v=>Math.round(v*10)/10;
const pt=(c,r,deg)=>[rd(c[0]+r*Math.cos(deg*Math.PI/180)),rd(c[1]-r*Math.sin(deg*Math.PI/180))];
const ST='stroke:#222;stroke-width:1.4px';
const SVG=(w,h,body,label)=>`<svg viewBox="0 0 ${w} ${h}" width="100%" style="max-width:360px;height:auto;display:block;margin:8px auto" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const LN=(a,b,st)=>`<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" style="${st||ST}"/>`;
const POLY=(ps,st)=>`<polygon points="${ps.map(p=>p.join(',')).join(' ')}" style="${st}"/>`;
const CIR=(c,r,st)=>`<circle cx="${c[0]}" cy="${c[1]}" r="${rd(r)}" style="${st}"/>`;
const DOT=c=>`<circle cx="${c[0]}" cy="${c[1]}" r="2.6" style="fill:#222"/>`;
const TX=(p,t,sz)=>`<text x="${rd(p[0])}" y="${rd(p[1])}" font-size="${sz||14}" text-anchor="middle" dominant-baseline="central" style="font-family:inherit;fill:#222">${t}</text>`;
const DIMST='fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3';
// 점선 치수 호: a→b 선분 옆으로 bulge만큼 휜 곡선, 글자는 호의 꼭대기 바깥쪽
function DIM(a,b,bulge,label,off){const m=[(a[0]+b[0])/2,(a[1]+b[1])/2],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),n=[dy/L,-dx/L];
 const cp=[rd(m[0]+n[0]*bulge*2),rd(m[1]+n[1]*bulge*2)],lp=[m[0]+n[0]*(bulge+(off||12)*Math.sign(bulge)),m[1]+n[1]*(bulge+(off||12)*Math.sign(bulge))];
 return `<path d="M${a[0]},${a[1]} Q${cp[0]},${cp[1]} ${b[0]},${b[1]}" style="${DIMST}"/>`+TX(lp,label,13);}
// 각호: 꼭짓점 c, 수학 방향(반시계) a1→a2
const ARC=(c,r,a1,a2)=>{const p=pt(c,r,a1),q=pt(c,r,a2);return `<path d="M${p[0]},${p[1]} A${r},${r} 0 ${a2-a1>180?1:0} 0 ${q[0]},${q[1]}" style="fill:none;stroke:#222;stroke-width:1px"/>`;};
// 부채꼴 경로(반시계 a1→a2)
const SECT=(c,r,a1,a2,st)=>{const p=pt(c,r,a1),q=pt(c,r,a2);return `<path d="M${c[0]},${c[1]} L${p[0]},${p[1]} A${rd(r)},${rd(r)} 0 ${a2-a1>180?1:0} 0 ${q[0]},${q[1]} Z" style="${st}"/>`;};
const RIGHT=(c,a1,a2,k)=>{const u=pt([0,0],k,a1),v=pt([0,0],k,a2);return `<polyline points="${rd(c[0]+u[0])},${rd(c[1]+u[1])} ${rd(c[0]+u[0]+v[0])},${rd(c[1]+u[1]+v[1])} ${rd(c[0]+v[0])},${rd(c[1]+v[1])}" style="fill:none;stroke:#222;stroke-width:1px"/>`;};
const GRAY='fill:#cfcfcf;stroke:none';

// 개념탐구(1): 원 안의 정십이각형, 원 밖의 정사각형
function figExp1(){const c1=[92,94],c2=[270,94],R=72;
 const dod=[...Array(12)].map((_,k)=>pt(c1,R,90+30*k));
 return SVG(360,188,CIR(c1,R,'fill:none;'+ST)+POLY(dod,'fill:none;'+ST)+DOT(c1)+
  `<rect x="${c2[0]-R}" y="${c2[1]-R}" width="${2*R}" height="${2*R}" style="fill:none;${ST}"/>`+CIR(c2,R,'fill:none;'+ST)+DOT(c2),'원 안에 꼭 맞는 정십이각형과 원 밖에 꼭 맞는 정사각형');}
// 개념탐구(2): 16등분한 원 조각을 붙인 모양
function figExp2(r){const c=[66,84],R=52,body=[];
 body.push(`<path d="M${c[0]-R},${c[1]} A${R},${R} 0 0 1 ${c[0]+R},${c[1]} Z" style="${GRAY}"/>`);
 for(let k=0;k<16;k++)body.push(LN(c,pt(c,R,22.5*k),'stroke:#222;stroke-width:1px;stroke-dasharray:3 2'));
 body.push(LN([c[0]-R,c[1]],[c[0]+R,c[1]]),CIR(c,R,'fill:none;'+ST),DOT(c));
 body.push(DIM(c,pt(c,R,-11.25),-5,'',0),TX(pt(c,R+20,-14),`${r} cm`,13));
 body.push(TX([168,84],'⇨',20));
 const ch=2*R*Math.sin(Math.PI/16),hh=R*Math.cos(Math.PI/16),top=58,bot=rd(top+hh),x0=192+ch/2;
 for(let j=0;j<8;j++){const ax=x0+j*ch; // 흰 조각(꼭짓점 위)
  body.push(`<path d="M${rd(ax)},${top} L${rd(ax-ch/2)},${bot} A${R},${R} 0 0 0 ${rd(ax+ch/2)},${bot} Z" style="fill:#fff;${ST};stroke-width:1.1px"/>`);}
 for(let i=0;i<8;i++){const ax=x0+i*ch+ch/2; // 색칠 조각(꼭짓점 아래)
  body.push(`<path d="M${rd(ax)},${bot} L${rd(ax-ch/2)},${top} A${R},${R} 0 0 1 ${rd(ax+ch/2)},${top} Z" style="fill:#cfcfcf;${ST};stroke-width:1.1px"/>`);}
 const bl=[rd(x0-ch/2),rd(bot+2)],br=[rd(x0+7.5*ch),rd(bot+2)],tr=[rd(x0+8*ch),top];
 body.push(DIM(br,bl,9,'㉠',12),DIM([br[0]+3,bot],[tr[0]+3,top],-9,'㉡',12));
 return SVG(390,150,body.join(''),'반지름 '+r+'cm인 원을 16등분하여 잘라 붙인 모양');}
// 예제1·Mission1: 원 안과 원 밖의 정육각형
function figHex(mode){const O=[180,128],R=88,Ro=R/Math.cos(Math.PI/6),b=[];
 const inn=[...Array(6)].map((_,k)=>pt(O,R,90+60*k)),out=[...Array(6)].map((_,k)=>pt(O,Ro,60*k));
 if(mode==='shade'){b.push(CIR(O,R,'fill:#cfcfcf;stroke:none'),POLY(inn,'fill:#fff;stroke:none'));
  for(const p of inn.concat(out))b.push(LN(O,p,'stroke:#222;stroke-width:1px;stroke-dasharray:4 3'));}
 else for(const a of [120,60])b.push(LN(O,pt(O,Ro,a),'stroke:#222;stroke-width:1px;stroke-dasharray:4 3'));
 if(mode!=='shade')for(const a of [30,-30])b.push(LN(O,pt(O,R,a),'stroke:#222;stroke-width:1px;stroke-dasharray:4 3'));
 b.push(POLY(out,'fill:none;'+ST),CIR(O,R,'fill:none;'+ST),POLY(inn,'fill:none;'+ST),DOT(O));
 const L=[['ㄱ',pt(O,Ro,120),[-4,-14]],['ㄴ',pt(O,R,90),[0,-14]],['ㄷ',pt(O,Ro,60),[4,-14]],['ㄹ',pt(O,R,30),[14,-8]],['ㅇ',O,[12,10]]];
 if(mode!=='shade')L.push(['ㅁ',pt(O,Ro,0),[13,0]],['ㅂ',pt(O,R,-30),[14,8]]);
 for(const [t,p,d] of L)b.push(TX([p[0]+d[0],p[1]+d[1]],t,14));
 return SVG(360,256,b.join(''),'원 안의 정육각형과 원 밖의 정육각형');}
// 예제3: 정육각형 꼭짓점에 반지름이 다른 원을 번갈아 그린 모양
function figEx3(s,a,bR,idx){const u=150/(s+bR),C=[175,175],b=[],cid='u5e2ex3clip'+idx;
 const V=[...Array(6)].map((_,k)=>pt(C,s*u,90+60*k)),rad=k=>(k%2?a:bR)*u;
 b.push(`<defs><clipPath id="${cid}"><polygon points="${V.map(p=>p.join(',')).join(' ')}"/></clipPath></defs>`);
 V.forEach((p,k)=>b.push(CIR(p,rad(k),'fill:#bdbdbd;stroke:#222;stroke-width:1.2px')));
 b.push(POLY(V,'fill:#fff;'+ST));
 V.forEach((p,k)=>b.push(`<circle cx="${p[0]}" cy="${p[1]}" r="${rd(rad(k))}" clip-path="url(#${cid})" style="fill:none;stroke:#555;stroke-width:1px;stroke-dasharray:2 2"/>`));
 V.forEach(p=>b.push(DOT(p)));
 return SVG(350,350,b.join(''),'정육각형의 꼭짓점을 중심으로 그린 원');}
// Mission2: 띠 모양 부채꼴
function figM2(o,i){const u=150/o,C=[180,196],Ro=o*u,Ri=i*u,b=[];
 const p1=pt(C,Ro,30),p2=pt(C,Ro,150),q1=pt(C,Ri,30),q2=pt(C,Ri,150);
 b.push(`<path d="M${p1[0]},${p1[1]} A${rd(Ro)},${rd(Ro)} 0 0 0 ${p2[0]},${p2[1]} L${q2[0]},${q2[1]} A${rd(Ri)},${rd(Ri)} 0 0 1 ${q1[0]},${q1[1]} Z" style="fill:#cfcfcf;${ST}"/>`);
 b.push(LN(C,q1),LN(C,q2),ARC(C,14,30,150),TX([C[0],C[1]-28],'120°',13));
 b.push(DIM(p2,C,-12,`${o} cm`,13),DIM(C,q1,-10,`${i} cm`,13));
 return SVG(360,262,b.join(''),'중심각 120°인 띠 모양 부채꼴');}
// Mission3: 원의 중심에 정육각형과 정사각형의 꼭짓점
function figM3(r){const C=[176,130],R=66,hs=78,sq=96,b=[],hc=[C[0]-hs,C[1]];
 const hex=[...Array(6)].map((_,k)=>pt(hc,hs,60*k)),u=pt([0,0],sq,65),v=pt([0,0],sq,-25);
 const sqr=[C,[rd(C[0]+u[0]),rd(C[1]+u[1])],[rd(C[0]+u[0]+v[0]),rd(C[1]+u[1]+v[1])],[rd(C[0]+v[0]),rd(C[1]+v[1])]];
 b.push(CIR(C,R,'fill:#fff;stroke:none'),SECT(C,R,120,240,GRAY),SECT(C,R,-25,65,GRAY),CIR(C,R,'fill:none;'+ST));
 b.push(POLY(hex,'fill:none;'+ST),POLY(sqr,'fill:none;'+ST),RIGHT(C,-25,65,11),DOT(C));
 b.push(DIM(C,pt(C,R,92),6,'',0).replace(/<text[\s\S]*<\/text>/,''),TX([C[0]-2,C[1]-R-13],`${r} cm`,13),TX([C[0]+3,C[1]+17],'ㄱ',14));
 return SVG(340,222,b.join(''),'원의 중심에 꼭짓점을 맞춘 정육각형과 정사각형');}
// Mission4: 정사각형 안에 꼭 맞는 원
function figM4(){return SVG(360,232,`<rect x="74" y="12" width="208" height="208" style="fill:#bdbdbd;${ST}"/>`+CIR([178,116],104,'fill:#fff;'+ST),'정사각형 안에 꼭 맞게 그린 원');}
// Mission5: 정육각형에 붙은 부채꼴 3개
function figM5(s){const u=72,C=[78,232],b=[],P=a=>pt(C,u,a);
 const T=P(90),UR=P(30),LR=P(-30),UL=P(150);
 const hex=[90,150,210,270,330,30].map(P);
 b.push(SECT(T,3*u,-30,30,'fill:#cfcfcf;'+ST),SECT(UR,2*u,270,330,'fill:#cfcfcf;'+ST),SECT(LR,u,210,270,'fill:#cfcfcf;'+ST));
 b.push(POLY(hex,'fill:#fff;'+ST),ARC(T,12,-30,30),ARC(UR,12,270,330),ARC(LR,12,210,270));
 b.push(DIM(UL,T,-8,`${s} cm`,18));
 return SVG(340,372,b.join(''),'정육각형에 붙은 부채꼴 3개');}
// Mission6: 시계
function figM6(h,m){const C=[180,130],R=112,b=[];
 b.push(CIR(C,R,'fill:#fff;'+ST));
 for(let k=0;k<60;k++){const big=k%5===0;b.push(LN(pt(C,R,90-6*k),pt(C,R-(big?9:4),90-6*k),'stroke:#222;stroke-width:'+(big?1.6:0.8)+'px'));}
 for(let k=1;k<=12;k++)b.push(TX(pt(C,R-22,90-30*k),String(k),14));
 b.push(LN(C,pt(C,52,90-30*h-m/2),'stroke:#222;stroke-width:4px;stroke-linecap:round'),LN(C,pt(C,74,90-6*m),'stroke:#222;stroke-width:2.4px;stroke-linecap:round'),DOT(C));
 return SVG(360,260,b.join(''),`${h}시 ${m}분을 가리키는 시계`);}

// ── 문항별 풀 ──
const exp1=r=>{const h2=r*r; // 정십이각형 넓이 = 3r², 정사각형 = 4r²
 const hTxt=FR(r,2),tri=FR(r*r,4);
 return {prompt:`<p>아래 왼쪽은 반지름이 ${r} cm인 원의 안쪽에 꼭 맞게 정십이각형을 그린 것이고, 오른쪽은 같은 원의 바깥쪽에 꼭 맞게 정사각형을 그린 것입니다. 그림을 보고 반지름이 ${r} cm인 원의 넓이가 ${3*h2} cm²보다 크고 ${4*h2} cm²보다 작은 까닭을 설명하시오.</p>`+figExp1(),
 answer:`원 안의 정십이각형 넓이(${3*h2} cm²)보다 크고 원 밖의 정사각형 넓이(${4*h2} cm²)보다 작기 때문`,
 solution:`<ol><li>원의 중심과 정십이각형의 꼭짓점을 이으면 똑같은 삼각형 12개가 생깁니다. 각 삼각형은 두 변이 반지름 ${r} cm이고, 그 사이의 각이 360°÷12=30°입니다.</li>`+
 `<li>삼각형 하나를 한 반지름(밑변)을 접는 선으로 하여 뒤집어 붙이면, 원의 중심과 두 바깥 꼭짓점을 이은 삼각형은 두 변이 ${r} cm이고 사이의 각이 30°+30°=60°이므로 한 변이 ${r} cm인 정삼각형입니다. 밑변으로 잡은 반지름에 대한 높이는 이 정삼각형의 한 변을 반으로 나눈 길이이므로 ${r}÷2=${hTxt} (cm)입니다.</li>`+
 `<li>삼각형 한 개의 넓이는 ${r}×${hTxt}÷2=${tri} (cm²)이고, 정십이각형의 넓이는 ${tri}×12=${3*h2} (cm²)입니다.</li>`+
 `<li>원 밖의 정사각형은 한 변이 원의 지름 ${2*r} cm이므로 넓이는 ${2*r}×${2*r}=${4*h2} (cm²)입니다.</li>`+
 `<li>원은 정십이각형을 품고 있고 정사각형 안에 들어 있으므로, 원의 넓이는 ${3*h2} cm²보다 크고 ${4*h2} cm²보다 작습니다.</li></ol>`};};
const exp2=r=>{const a=H(r*314); // 원주의 절반 = r×3.14 (백분의 일 단위: r×314)
 return {prompt:`<p>다음 그림은 반지름이 ${r} cm인 원을 똑같이 16조각으로 잘라 이어 붙인 것입니다. ㉠과 ㉡의 길이를 각각 구하시오. (원주율: 3.14)</p>`+figExp2(r),
 answer:`㉠ ${a} cm, ㉡ ${r} cm`,
 solution:`<ol><li>㉠은 16조각 중 8조각의 곡선 부분을 이은 길이이므로 원주의 절반입니다.</li><li>㉠=${r}×2×3.14÷2=${a} (cm)입니다.</li><li>㉡은 한 조각의 곧은 변이므로 원의 반지름과 같은 ${r} cm입니다.</li></ol>`};};
const ex1=(tin,tout)=>({prompt:`<p>그림에서 삼각형 ㄴㅇㄹ의 넓이는 ${tin} cm²이고, 삼각형 ㄱㅇㄷ의 넓이는 ${tout} cm²입니다. 원 안에 있는 정육각형과 원 밖에 있는 정육각형의 넓이를 각각 구하여, 원의 넓이가 몇 cm² 초과 몇 cm² 미만인지 나타내시오.</p>`+figHex('shade'),
 answer:`${tin*6} cm² 초과 ${tout*6} cm² 미만`,
 solution:`<ol><li>원 안의 정육각형은 삼각형 ㄴㅇㄹ과 똑같은 삼각형 6개로 나뉘므로 넓이는 ${tin}×6=${tin*6} (cm²)입니다.</li><li>원 밖의 정육각형은 삼각형 ㄱㅇㄷ과 똑같은 삼각형 6개로 나뉘므로 넓이는 ${tout}×6=${tout*6} (cm²)입니다.</li><li>원의 넓이는 원 안의 정육각형보다 크고 원 밖의 정육각형보다 작으므로 ${tin*6} cm² 초과 ${tout*6} cm² 미만입니다.</li></ol>`});
const ex2=(A,B)=>{const d=A-B,T=A*A-B*B,first=(d+1)*(d+1)-1;
 return {prompt:`<p>중심이 같고 반지름이 각각 ㉠ cm, ㉡ cm인 두 원이 있습니다. 두 원의 둘레의 차는 ${H(d*628)} cm이고, 넓이의 차는 ${H(T*314)} cm²입니다. ㉠과 ㉡이 자연수일 때, ㉠×㉡의 값을 구하시오. (원주율: 3.14)</p>`,
 answer:String(A*B),
 solution:`<ol><li>둘레의 차는 (지름의 차)×3.14이므로 지름의 차는 ${H(d*628)}÷3.14=${2*d} (cm), 반지름의 차는 ${d} cm입니다.</li>`+
 `<li>넓이의 차는 (큰 반지름×큰 반지름−작은 반지름×작은 반지름)×3.14이므로 괄호 안의 값은 ${H(T*314)}÷3.14=${T}입니다.</li>`+
 `<li>반지름의 차가 ${d}인 두 자연수에서 작은 반지름을 1, 2, 3, …으로 늘려 보면 괄호 안의 값은 ${first}부터 ${2*d}씩 커집니다. 이 값이 ${T}가 되는 것은 작은 반지름이 ${B} cm, 큰 반지름이 ${A} cm일 때뿐입니다. (${A}×${A}−${B}×${B}=${T})</li>`+
 `<li>따라서 ㉠×㉡=${A}×${B}=${A*B}입니다.</li></ol>`};};
const ex3=(s,a,b,idx)=>{const k=2*(a*a+b*b); // 각 원에서 240° 부채꼴 3개씩
 return {prompt:`<p>그림은 한 변이 ${s} cm인 정육각형의 각 꼭짓점을 중심으로 하여 반지름이 ${a} cm인 원과 ${b} cm인 원을 번갈아 그린 것입니다. 색칠한 부분의 넓이를 ㉠×3.14 (cm²)라고 할 때, ㉠은 얼마입니까? (원주율: 3.14)</p>`+figEx3(s,a,b,idx),
 answer:String(k),
 solution:`<ol><li>정육각형의 한 각은 120°이므로 색칠한 부분은 각 원에서 중심각이 360°−120°=240°인 부채꼴입니다.</li>`+
 `<li>반지름이 ${a} cm인 부채꼴 3개의 넓이는 ${a}×${a}×3.14×${ff(2,3)}×3=${2*a*a}×3.14 (cm²)입니다.</li>`+
 `<li>반지름이 ${b} cm인 부채꼴 3개의 넓이는 ${b}×${b}×3.14×${ff(2,3)}×3=${2*b*b}×3.14 (cm²)입니다.</li>`+
 `<li>색칠한 부분의 넓이는 (${2*a*a}+${2*b*b})×3.14=${k}×3.14 (cm²)이므로 ㉠은 ${k}입니다.</li></ol>`};};
const ex4=(sh,lo)=>{const Lh=lo*lo*2200/7,Sh=sh*sh*2200/84; // 백분의 일 단위
 return {prompt:`<p>지석이네 학교에 있는 대형 시계의 짧은바늘은 길이가 ${sh} cm이고, 긴바늘은 길이가 ${lo} cm입니다. 긴바늘이 한 바퀴 도는 동안 짧은바늘이 지나간 부분의 넓이와 긴바늘이 지나간 부분의 넓이의 차를 구하시오. (단, 시계 중심의 크기는 생각하지 않고, 원주율은 ${PI227}로 계산합니다.)</p>`,
 answer:`${H(Lh-Sh)} cm²`,
 solution:`<ol><li>긴바늘이 한 바퀴 도는 데 1시간이 걸리고, 그동안 짧은바늘은 숫자 한 칸, 곧 360°의 ${ff(1,12)}인 30°만큼 움직입니다.</li>`+
 `<li>긴바늘이 지나간 넓이는 ${lo}×${lo}×${ff(22,7)}=${H(Lh)} (cm²)입니다.</li>`+
 `<li>짧은바늘이 지나간 넓이는 ${sh}×${sh}×${ff(22,7)}×${ff(1,12)}=${H(Sh)} (cm²)입니다.</li>`+
 `<li>두 넓이의 차는 ${H(Lh)}−${H(Sh)}=${H(Lh-Sh)} (cm²)입니다.</li></ol>`};};
const m1=(tout,tin)=>({prompt:`<p>그림에서 원 안의 정육각형과 원 밖의 정육각형의 넓이를 이용하여 원의 넓이를 어림하려고 합니다. 삼각형 ㄱㅇㄷ의 넓이가 ${tout} cm²이고 삼각형 ㄹㅇㅂ의 넓이가 ${tin} cm²라면, 원의 넓이는 몇 cm² 초과 몇 cm² 미만입니까?</p>`+figHex('plain'),
 answer:`${tin*6} cm² 초과 ${tout*6} cm² 미만`,
 solution:`<ol><li>원 안의 정육각형은 삼각형 ㄹㅇㅂ과 똑같은 삼각형 6개로 나뉘므로 넓이는 ${tin}×6=${tin*6} (cm²)입니다.</li><li>원 밖의 정육각형은 삼각형 ㄱㅇㄷ과 똑같은 삼각형 6개로 나뉘므로 넓이는 ${tout}×6=${tout*6} (cm²)입니다.</li><li>원의 넓이는 두 정육각형의 넓이 사이에 있으므로 ${tin*6} cm² 초과 ${tout*6} cm² 미만입니다.</li></ol>`});
const m2=(o,i)=>{const big=o*o*314/3,sm=i*i*314/3;
 return {prompt:`<p>다음 그림에서 색칠한 부분의 넓이를 구하시오. (원주율: 3.14)</p>`+figM2(o,i),
 answer:`${H(big-sm)} cm²`,
 solution:`<ol><li>색칠한 부분은 반지름이 ${o} cm이고 중심각이 120°인 부채꼴에서 반지름이 ${i} cm이고 중심각이 120°인 부채꼴을 뺀 것입니다.</li>`+
 `<li>큰 부채꼴의 넓이는 ${o}×${o}×3.14×${ff(120,360)}=${H(big)} (cm²)입니다.</li>`+
 `<li>작은 부채꼴의 넓이는 ${i}×${i}×3.14×${ff(120,360)}=${H(sm)} (cm²)입니다.</li>`+
 `<li>색칠한 부분의 넓이는 ${H(big)}−${H(sm)}=${H(big-sm)} (cm²)입니다.</li></ol>`};};
const m3=r=>{
 return {prompt:`<p>그림과 같이 반지름이 ${r} cm인 원의 중심 ㄱ에 한 꼭짓점이 오도록 정육각형과 정사각형을 놓았습니다. 색칠한 두 부채꼴의 넓이의 합을 구하시오. (원주율: ${PI227})</p>`+figM3(r),
 answer:`${FR(r*r*11,6)} cm²`,
 solution:`<ol><li>정육각형의 한 각은 120°, 정사각형의 한 각은 90°이므로 두 부채꼴의 중심각의 합은 120°+90°=210°입니다.</li>`+
 `<li>두 부채꼴의 넓이의 합은 ${r}×${r}×${ff(22,7)}×${ff(210,360)}=${FR(r*r*11,6)} (cm²)입니다.</li></ol>`};};
const m4=(pi100)=>{const pi=DEC(pi100,100),ratio=DEC(pi100,400),cp=DEC(pi100,4),sp=DEC(10000-25*pi100,100),ans=(10000-25*pi100)/10;
 return {prompt:`<p>그림은 한 변이 ㉠ cm인 정사각형 안에 꼭 맞게 원을 그린 것입니다. 색칠한 부분의 넓이가 정사각형의 넓이의 □%일 때, □×10의 값을 구하시오. (원주율: ${pi})</p>`+figM4(),
 answer:String(ans),
 solution:`<ol><li>원의 지름은 정사각형의 한 변 ㉠ cm와 같으므로 원의 반지름은 (㉠÷2) cm입니다.</li>`+
 `<li>원의 넓이는 (㉠÷2)×(㉠÷2)×${pi}=㉠×㉠×${pi}÷4이고 정사각형의 넓이는 ㉠×㉠이므로, 원의 넓이는 정사각형 넓이의 ${pi}÷4=${ratio}배, 곧 ${cp}%입니다.</li>`+
 `<li>색칠한 부분은 정사각형에서 원을 뺀 부분이므로 100−${cp}=${sp}(%)입니다.</li>`+
 `<li>□=${sp}이므로 □×10=${ans}입니다.</li></ol>`};};
const m5=s=>{const a1=s*s*310/6,a2=4*s*s*310/6,a3=9*s*s*310/6;
 return {prompt:`<p>그림은 한 변의 길이가 ${s} cm인 정육각형에 서로 다른 부채꼴 3개가 붙어 있는 모양입니다. 색칠한 부분의 넓이를 구하시오. (원주율: 3.1)</p>`+figM5(s),
 answer:`${H(a1+a2+a3)} cm²`,
 solution:`<ol><li>정육각형의 한 각은 120°이므로 각 부채꼴의 중심각은 180°−120°=60°입니다.</li>`+
 `<li>가장 작은 부채꼴의 반지름은 정육각형의 한 변인 ${s} cm이고, 다음 부채꼴의 반지름은 ${s}+${s}=${2*s} (cm), 가장 큰 부채꼴의 반지름은 ${2*s}+${s}=${3*s} (cm)입니다.</li>`+
 `<li>세 부채꼴의 넓이는 ${s}×${s}×3.1×${ff(1,6)}=${H(a1)} (cm²), ${2*s}×${2*s}×3.1×${ff(1,6)}=${H(a2)} (cm²), ${3*s}×${3*s}×3.1×${ff(1,6)}=${H(a3)} (cm²)입니다.</li>`+
 `<li>색칠한 부분의 넓이는 ${H(a1)}+${H(a2)}+${H(a3)}=${H(a1+a2+a3)} (cm²)입니다.</li></ol>`};};
const m6=(d,h,m)=>{const r=d/2,hr=30*h+m/2,mn=6*m,big=Math.abs(hr-mn),ang=Math.min(big,360-big);
 const hrTxt=DEC(60*h+m,2);
 return {prompt:`<p>그림은 지름이 ${d} cm인 시계가 ${h}시 ${m}분을 가리키고 있는 모습입니다. 시침과 분침을 시계의 테두리까지 늘여 만든 두 부채꼴 중 작은 부채꼴의 넓이를 구하시오. (원주율: 3)</p>`+figM6(h,m),
 answer:`${FR(ang*r*r*3,360)} cm²`,
 solution:`<ol><li>분침은 1분에 6°씩 움직이므로 12를 가리킬 때부터 ${6}×${m}=${mn}°만큼 돌아가 있습니다.</li>`+
 `<li>시침은 1시간에 30°, 1분에 0.5°씩 움직이므로 12를 가리킬 때부터 30×${h}+0.5×${m}=${hrTxt}°만큼 돌아가 있습니다.</li>`+
 `<li>두 바늘 사이의 작은 각은 ${ang}°이고, 시계의 반지름은 ${d}÷2=${r} (cm)입니다.</li>`+
 `<li>작은 부채꼴의 넓이는 ${r}×${r}×3×${ff(ang,360)}=${FR(ang*r*r*3,360)} (cm²)입니다.</li></ol>`};};

const ITEMS={
 '6-2-u5-e2-exploration-1':{key:'source62U5E2Exploration1',resultContract:'strategy-explanation',answerVisualRequired:false,pool:[exp1(1),exp1(2),exp1(3)]},
 '6-2-u5-e2-exploration-2':{key:'source62U5E2Exploration2',resultContract:'two-lengths',answerVisualRequired:false,pool:[exp2(8),exp2(6),exp2(10)]},
 '6-2-u5-e2-example-1':{key:'source62U5E2Example1',resultContract:'open-range',answerVisualRequired:false,pool:[ex1(24,32),ex1(18,24),ex1(27,36)]},
 '6-2-u5-e2-example-2':{key:'source62U5E2Example2',resultContract:'single-value',answerVisualRequired:false,pool:[ex2(15,10),ex2(11,7),ex2(12,9)]},
 '6-2-u5-e2-example-3':{key:'source62U5E2Example3',resultContract:'single-value',answerVisualRequired:false,pool:[ex3(3,1,2,0),ex3(4,1,3,1),ex3(5,2,3,2)]},
 '6-2-u5-e2-example-4':{key:'source62U5E2Example4',resultContract:'single-value',answerVisualRequired:false,pool:[ex4(21,35),ex4(21,28),ex4(42,49)]},
 '6-2-u5-e2-mission-1':{key:'source62U5E2Mission1',resultContract:'open-range',answerVisualRequired:false,pool:[m1(40,30),m1(48,36),m1(20,15)]},
 '6-2-u5-e2-mission-2':{key:'source62U5E2Mission2',resultContract:'single-value',answerVisualRequired:false,pool:[m2(6,3),m2(9,6),m2(12,3)]},
 '6-2-u5-e2-mission-3':{key:'source62U5E2Mission3',resultContract:'single-value',answerVisualRequired:false,pool:[m3(6),m3(12),m3(18)]},
 '6-2-u5-e2-mission-4':{key:'source62U5E2Mission4',resultContract:'single-value',answerVisualRequired:false,pool:[m4(314),m4(310),m4(300)]},
 '6-2-u5-e2-mission-5':{key:'source62U5E2Mission5',resultContract:'single-value',answerVisualRequired:false,pool:[m5(6),m5(9),m5(12)]},
 '6-2-u5-e2-mission-6':{key:'source62U5E2Mission6',resultContract:'single-value',answerVisualRequired:false,pool:[m6(20,7,20),m6(12,4,10),m6(16,2,50)]},
};
function build(id,variant){const it=ITEMS[id],i=((variant|0)%it.pool.length+it.pool.length)%it.pool.length,p=it.pool[i];
 return {prompt:wrap(id,i,p.prompt),answer:p.answer,solution:wrap(id,i,p.solution),...(p.answerVisual?{answerVisual:p.answerVisual,answerKeyVisual:true}:{}),
  automaticGrading:false,resultContract:it.resultContract||'single-value',sourceItemId:id,generator:it.key,generationMode:'fixed-verified-pool',
  verifiedPoolIndex:i,variant:i,verifiedVariantCount:it.pool.length,verifiedVariantTarget:3,sourceStructurePreserved:true,sourceExact:false,
  publisherAnswerVerified:false,officialAnswerVerified:false,answerVisualRequired:!!it.answerVisualRequired,...(it.answerAssumption?{answerAssumption:it.answerAssumption}:{})};}
function install(target){const api=target&&target.HSE_GENERATORS;if(!api||typeof api.generatorKey!=='function'||typeof api.generate!=='function')return false;
 const flag='__orig_'+GROUP.replace(/-/g,'_');if(api[flag])return true;
 const pk=api.generatorKey.bind(api),pg=api.generate.bind(api),keys=new Set(Object.values(ITEMS).map(x=>x.key));
 const owns=t=>t&&(ITEMS[t.sourceItemId]||keys.has(t.generatorKey));
 const ok=t=>{const it=t&&ITEMS[t.sourceItemId];return !!it&&t.id===t.sourceItemId&&t.generatorKey===it.key&&t.reviewLocked===false&&t.sourceVerified===true;};
 api.generatorKey=function(t){return owns(t)?(ok(t)?ITEMS[t.sourceItemId].key:''):pk(t);};
 api.generate=function(t,rank,difficulty,seed,variant){return owns(t)?(ok(t)?build(t.sourceItemId,variant===undefined?0:variant):null):pg(t,rank,difficulty,seed,variant);};
 if(Array.isArray(api.names))keys.forEach(k=>{if(!api.names.includes(k))api.names.push(k);});
 Object.defineProperty(api,flag,{value:true});return true;}
const exported=Object.freeze({GROUP,ITEMS,build,install});
root['HSE_ORIG_'+GROUP.replace(/-/g,'_')]=exported;install(root);
})(typeof window!=='undefined'?window:globalThis);
