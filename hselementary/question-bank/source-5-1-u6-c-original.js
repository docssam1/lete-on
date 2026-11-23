// 황소 5-1 6단원 다각형의 둘레와 넓이(개념탐구 5 Mission 2~6, 개념탐구 6 전체) 잠금 원문 유형.
// ITEMS의 키는 앱 유형 id, sourceItemId는 원장 id입니다. 변형 0은 원문 수치, 변형 1·2는 같은 구조에서 수만 바꾼 고정 검증 풀입니다.
(function(root){'use strict';
const GROUP='5-1-u6-c';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;
const ol=steps=>'<ol>'+steps.map(s=>`<li>${s}</li>`).join('')+'</ol>';
const P=s=>`<p>${s}</p>`;
// ---------- SVG 도우미 ----------
const SVGS='width:100%;height:auto;display:block;margin:6px auto;font-family:inherit';
const r1=v=>Math.round(v*10)/10;
const pt=p=>`${r1(p[0])},${r1(p[1])}`;
const ST='stroke:#222;stroke-width:1.4px';
const svg=(w,h,body,label,mw=360)=>`<svg viewBox="0 0 ${r1(w)} ${r1(h)}" role="img" aria-label="${label}" style="${SVGS};max-width:${mw}px">${body}</svg>`;
const poly=(pts,fill)=>`<polygon points="${pts.map(pt).join(' ')}" style="fill:${fill||'none'};${ST};stroke-linejoin:round"/>`;
const area=(pts,fill)=>`<polygon points="${pts.map(pt).join(' ')}" style="fill:${fill};stroke:none"/>`;
const ln=(a,b)=>`<line x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}" style="${ST}"/>`;
const dl=(a,b)=>`<line x1="${r1(a[0])}" y1="${r1(a[1])}" x2="${r1(b[0])}" y2="${r1(b[1])}" style="stroke:#222;stroke-width:1px;stroke-dasharray:3 3"/>`;
const tx=(p,s,anc,size)=>{size=size||14;return `<text x="${r1(p[0])}" y="${r1(p[1]+size*0.36)}" text-anchor="${anc||'middle'}" style="font-size:${size}px;fill:#222">${s}</text>`;};
const tw=s=>[...String(s)].reduce((t,c)=>t+(/[ㄱ-힝]/.test(c)?13:c===' '?3.5:7.4),0);
// 치수선(점선 호): a,b 화면 좌표, dir 바깥쪽 대략 방향
function dim(a,b,label,dir,k,extra){k=k||9;const dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy);let nx=-dy/L,ny=dx/L;if(nx*dir[0]+ny*dir[1]<0){nx=-nx;ny=-ny;}
 const m=[(a[0]+b[0])/2,(a[1]+b[1])/2],c=[m[0]+nx*k*2,m[1]+ny*k*2],w=tw(label);
 const off=k+7+Math.abs(nx)*w/2+Math.abs(ny)*5+(extra||0);
 return `<path d="M${pt(a)} Q${pt(c)} ${pt(b)}" style="fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3"/>`+tx([m[0]+nx*off,m[1]+ny*off],label,'middle',13);}
// 직각 표시: 꼭짓점 v, 두 변 방향(화면 단위벡터)
const ra=(v,u,w,s)=>{s=s||7;return `<polyline points="${pt([v[0]+u[0]*s,v[1]+u[1]*s])} ${pt([v[0]+u[0]*s+w[0]*s,v[1]+u[1]*s+w[1]*s])} ${pt([v[0]+w[0]*s,v[1]+w[1]*s])}" style="fill:none;stroke:#222;stroke-width:1px"/>`;};
// 각호: 꼭짓점 v, 두 방향 단위벡터, 반지름 r
function aarc(v,d1,d2,r,label){const a=[v[0]+d1[0]*r,v[1]+d1[1]*r],b=[v[0]+d2[0]*r,v[1]+d2[1]*r],sw=(d1[0]*d2[1]-d1[1]*d2[0])>0?1:0;
 let bx=d1[0]+d2[0],by=d1[1]+d2[1];const bl=Math.hypot(bx,by);bx/=bl;by/=bl;
 return `<path d="M${pt(a)} A${r} ${r} 0 0 ${sw} ${pt(b)}" style="fill:none;stroke:#222;stroke-width:1px"/>`+(label?tx([v[0]+bx*(r+13),v[1]+by*(r+13)],label,'middle',12):'');}
const S2=Math.SQRT1_2;
const GRAY='#d6d6d6',DARK='#b5b5b5';

// ---------- 개념탐구 5 Mission 2: 크기가 다른 네 정사각형과 대각선 ----------
function stairs(p){const s=p.s,S=s.reduce((a,b)=>a+b,0),sc=Math.min(300/S,140/s[0]),ox=30,oy=20+s[0]*sc,M=q=>[ox+q[0]*sc,oy-q[1]*sc];
 let x=0;const top=[[0,s[0]]];s.forEach((v,i)=>{if(i>0)top.push([x,v]);top.push([x+v,v]);x+=v;});top.push([S,0]);
 let b=area(top.map(M),GRAY);x=0;s.forEach(v=>{b+=poly([[x,0],[x+v,0],[x+v,v],[x,v]].map(M));x+=v;});
 b+=ln(M([0,s[0]]),M([S,0]));x=0;s.forEach(v=>{b+=dim(M([x,0]),M([x+v,0]),v+' cm',[0,1],7);x+=v;});
 const tot=s.reduce((a,v)=>a+v*v,0),tri=S*s[0]/2,ans=tot-tri;
 return {prompt:P(`한 변의 길이가 각각 ${s.join(' cm, ')} cm인 정사각형 4개를 밑변을 맞추어 그림과 같이 이어 붙이고, 가장 큰 정사각형의 왼쪽 위 꼭짓점과 가장 작은 정사각형의 오른쪽 아래 꼭짓점을 선으로 이었습니다. 색칠한 부분의 넓이는 몇 cm²인가요?`)+svg(ox+S*sc+30,oy+45,b,'네 정사각형과 대각선, 색칠한 부분'),
 answer:`${ans} cm²`,
 solution:ol([`네 정사각형의 넓이의 합은 ${s.map(v=>v+'×'+v).join(' + ')} = ${tot} (cm²)입니다.`,
  `선의 아래쪽 흰 부분은 밑변이 ${s.join(' + ')} = ${S} (cm), 높이가 ${s[0]} cm인 직각삼각형이므로 넓이는 ${S}×${s[0]}÷2 = ${tri} (cm²)입니다.`,
  `색칠한 부분의 넓이는 ${tot} − ${tri} = ${ans} (cm²)입니다.`])};}

// ---------- 개념탐구 5 Mission 3: 정사각형 종이 위의 색종이 (나, 다) ----------
function m3fig(O,I){const k=125/O,cx=170,by=272,M=q=>[cx+(q[0]-q[1])*k,by-(q[0]+q[1])*k];
 const B=[0,0],R=[I,0],T=[I,I],L=[0,I],Pp=[O,O],Q=[O,0],L2=[0,O],X=[I,O-I];
 let b=area([L,L2,Pp,T].map(M),DARK)+area([T,Pp,Q,X].map(M),DARK)+area([R,Q,X].map(M),'#6f6f6f');
 b+=poly([B,Q,Pp,L2].map(M))+poly([B,R,T,L].map(M))+ln(M(Pp),M(T))+ln(M(X),M(Q));
 b+=tx(M([I/2,I/2]),'가')+tx(M([I/2,(I+O)/2]),'나')+tx(M([(I+O)/2,I/2+1]),'다');
 const cg=M([(2*I+O)/3,(O-I)/3]),lp=[cg[0]+34,cg[1]+26];b+=`<path d="M${pt(cg)} Q${pt([cg[0]+10,cg[1]+24])} ${pt([lp[0]-9,lp[1]])}" style="fill:none;stroke:#222;stroke-width:1px"/>`+tx(lp,'라','start');
 b+=dim(M(Pp),M(Q),O+' cm',[1,-1],10)+dim(M(B),M(R),I+' cm',[1,1],10);
 return svg(360,300,b,'정사각형 종이 위에 붙인 색종이 가, 나, 다, 라');}
function m3(p,which){const O=p.O,I=p.I,w=O-I,strip=I*w,half=w*w/2,na=strip+half,ra_=w*w/2,da=strip+half-ra_;
 const pr=P(`정사각형 모양의 종이 위에 여러 가지 색종이 조각을 그림과 같이 붙였습니다. 가는 정사각형이고, 라는 이등변삼각형입니다. ${which}의 넓이는 몇 cm²인가요?`)+m3fig(O,I);
 const s1=`바깥 종이는 한 변이 ${O} cm인 정사각형이고 가는 한 변이 ${I} cm인 정사각형이므로, 가의 바깥쪽 띠의 폭은 ${O} − ${I} = ${w} (cm)입니다.`;
 const s2=`띠의 맨 위 모서리에는 한 변이 ${w} cm인 정사각형이 있고, 그림의 세로선은 이 정사각형의 대각선이므로 정사각형을 넓이가 ${w}×${w}÷2 = ${half} (cm²)인 두 부분으로 똑같이 나눕니다.`;
 if(which==='나')return {prompt:pr,answer:`${na} cm²`,solution:ol([s1,s2,`나는 가로 ${I} cm, 세로 ${w} cm인 직사각형과 모서리 정사각형의 반쪽으로 이루어지므로 넓이는 ${I}×${w} + ${half} = ${strip} + ${half} = ${na} (cm²)입니다.`])};
 return {prompt:pr,answer:`${da} cm²`,solution:ol([s1,s2,`다와 라를 합한 부분은 가로 ${I} cm, 세로 ${w} cm인 직사각형과 모서리 정사각형의 반쪽이므로 넓이는 ${I}×${w} + ${half} = ${strip+half} (cm²)입니다.`,
  `라는 가의 한 꼭짓점에서 두 변이 직각으로 만나는 이등변삼각형입니다. 한 변은 바깥 종이의 변에서 가의 변을 뺀 ${w} cm이므로 다른 한 변도 ${w} cm이고, 넓이는 ${w}×${w}÷2 = ${ra_} (cm²)입니다.`,
  `다의 넓이는 ${strip+half} − ${ra_} = ${da} (cm²)입니다.`])};}

// ---------- 개념탐구 5 Mission 4: 평행사변형과 마름모 ----------
function m4(p){const a=p.a,h=p.h,R=p.R,D=R/h,H=D/2,sc=Math.min(280/(a+2*h),200/(2*H)),ox=40+a*sc,oy=42+H*sc,M=q=>[ox+q[0]*sc,oy-q[1]*sc];
 const di=[0,0],ni=[-a,0],ri=[h,H],gi=[h-a,H],bi=[2*h,0],mi=[h,-H],O=[h,0];
 let b=area([gi,ni,mi,bi,ri].map(M),GRAY)+poly([gi,ni,mi,bi,ri].map(M))+ln(M(ri),M(di))+ln(M(di),M(mi))+ln(M(ni),M(di));
 b+=dl(M(di),M(bi))+dl(M(ri),M(mi))+ra(M(O),[-1,0],[0,-1]);
 b+=dim(M(gi),M(ri),a+' cm',[0,-1],9);
 const oo=M(O),bb=M(bi);b+=`<path d="M${pt([oo[0],oo[1]+1])} Q${pt([(oo[0]+bb[0])/2,oo[1]+12])} ${pt([bb[0],bb[1]+1])}" style="fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3"/>`;
 const lp=[bb[0]+16,bb[1]+30];b+=`<path d="M${pt([(oo[0]+bb[0])/2+4,oo[1]+7])} L${pt([lp[0]-2,lp[1]-9])}" style="fill:none;stroke:#222;stroke-width:1px"/>`+tx([lp[0]+2,lp[1]],h+' cm','start',13);
 b+=tx([M(gi)[0]-8,M(gi)[1]-10],'ㄱ')+tx([M(ni)[0]-12,M(ni)[1]+2],'ㄴ')+tx([M(di)[0]-8,M(di)[1]+14],'ㄷ')+tx([M(ri)[0]+10,M(ri)[1]-10],'ㄹ')+tx([M(mi)[0],M(mi)[1]+15],'ㅁ')+tx([M(bi)[0]+12,M(bi)[1]-4],'ㅂ');
 const par=a*H,tri=a*H/2,ans=par+tri+R;
 return {prompt:P(`사각형 ㄱㄴㄷㄹ은 평행사변형이고, 사각형 ㄹㄷㅁㅂ은 넓이가 ${R} cm²인 마름모입니다. 오각형 ㄱㄴㅁㅂㄹ의 넓이는 몇 cm²인가요?`)+svg(ox+2*h*sc+75,oy+H*sc+30,b,'평행사변형 ㄱㄴㄷㄹ과 마름모 ㄹㄷㅁㅂ')+P(`※ 조건 보충: 세 점 ㄴ, ㄷ, ㅂ은 한 직선 위에 있고, ${h} cm는 마름모의 두 대각선이 만나는 점에서 점 ㅂ까지의 길이입니다.`),
 answer:`${ans} cm²`,
 solution:ol([`마름모의 두 대각선은 서로를 똑같이 둘로 나누므로 대각선 ㄷㅂ의 길이는 ${h}×2 = ${2*h} (cm)입니다.`,
  `마름모의 넓이는 (대각선 ㄹㅁ)×${2*h}÷2 = ${R}이므로 대각선 ㄹㅁ의 길이는 ${R}×2÷${2*h} = ${D} (cm)입니다.`,
  `대각선 ㄹㅁ은 직선 ㄴㅂ과 수직으로 만나고 반으로 나뉘므로, 점 ㄹ과 점 ㅁ에서 직선 ㄴㅂ까지의 거리는 각각 ${D}÷2 = ${H} (cm)입니다.`,
  `평행사변형 ㄱㄴㄷㄹ의 넓이는 (밑변 ㄴㄷ)×(높이) = ${a}×${H} = ${par} (cm²)이고, 삼각형 ㄴㄷㅁ의 넓이는 ${a}×${H}÷2 = ${tri} (cm²)입니다.`,
  `오각형의 넓이는 평행사변형, 삼각형 ㄴㄷㅁ, 마름모의 넓이의 합이므로 ${par} + ${tri} + ${R} = ${ans} (cm²)입니다.`])};}

// ---------- 개념탐구 5 Mission 5: 같은 간격의 점과 두 선 사이 사다리꼴 ----------
function m5(p){const A=p.A,W=240,H=165,ox=60,oy=32,c=W/4,X=t=>ox+t,Y=t=>oy+H-t;
 const sA=[X(0),Y(0)],pts=[0,1,2,3,4].map(i=>[X(i*c),Y(H)]),bR=[X(W),Y(0)];
 const q=[[X(2*c),Y(H*2/3)],[X(3*c),Y(H)],[X(3*c),Y(H*3/4)],[X(2*c),Y(H/2)]];
 let b=area(q,DARK)+poly([pts[0],pts[4],bR,sA]);[1,2,3].forEach(i=>{b+=ln(pts[i],[X(i*c),Y(0)]);});b+=ln(sA,pts[3])+ln(sA,pts[4]);
 'ㄱㄴㄷㄹㅁ'.split('').forEach((n,i)=>{b+=tx([pts[i][0],pts[i][1]-13],n);});b+=tx([sA[0],sA[1]+15],'ㅅ')+tx([bR[0],bR[1]+15],'ㅂ');
 b+=tx([(q[0][0]+q[1][0]+q[2][0]+q[3][0])/4+2,(q[0][1]+q[1][1]+q[2][1]+q[3][1])/4],'㉮','middle',13);
 const col=A/4,part=col/12,ans=5*part/2;
 return {prompt:P(`직사각형 ㄱㅁㅂㅅ에서 ㄱ, ㄴ, ㄷ, ㄹ, ㅁ은 같은 간격으로 있는 점입니다. 직사각형 ㄱㅁㅂㅅ의 넓이가 ${A} cm²일 때, 색칠한 사다리꼴 ㉮의 넓이는 몇 cm²인가요?`)+svg(360,235,b,'직사각형 ㄱㅁㅂㅅ과 두 선분, 사다리꼴 ㉮'),
 answer:`${ans} cm²`,
 solution:ol([`세로선으로 나뉜 네 칸은 넓이가 같으므로 한 칸의 넓이는 ${A}÷4 = ${col} (cm²)입니다.`,
  `직사각형의 세로를 똑같이 12부분으로 나누어 생각합니다. 선분 ㅅㅁ은 네 칸 동안 12부분을 올라가므로 한 칸마다 3부분씩, 선분 ㅅㄹ은 세 칸 동안 12부분을 올라가므로 한 칸마다 4부분씩 올라갑니다.`,
  `㉮가 있는 셋째 칸의 왼쪽 세로선에서 선분 ㅅㄹ은 8부분, 선분 ㅅㅁ은 6부분 높이를 지나므로 ㉮의 왼쪽 변은 2부분입니다. 오른쪽 세로선(ㄹ을 지나는 선)에서는 12부분과 9부분 높이를 지나므로 ㉮의 오른쪽 변은 3부분입니다.`,
  `한 칸을 세로로 12부분 나눈 작은 직사각형 하나의 넓이는 ${col}÷12 = ${part} (cm²)입니다.`,
  `㉮는 평행한 두 변이 2부분, 3부분이고 높이가 한 칸의 가로인 사다리꼴이므로 넓이는 (2 + 3)×${part}÷2 = ${ans} (cm²)입니다.`])};}

// ---------- 개념탐구 5 Mission 6: 정사각형의 연장선과 두 삼각형 ----------
function m6s(p){const a=p.a,s=p.s,sc=Math.min(250/(s+a),200/a),ox=72,oy=24+a*sc,M=q=>[ox+q[0]*sc,oy-q[1]*sc];
 const n0=[0,0],d0=[s,0],r0=[s,s],g0=[0,s],S0=[0,a],O0=[s+a,s],J=[(s+a)/2,(s+a)/2];
 let b=area([S0,O0,r0,d0,n0].map(M),GRAY)+poly([S0,O0,r0,d0,n0].map(M))+ln(M(g0),M(r0))+ln(M(n0),M(J));
 b+=dim(M(S0),M(n0),a+' cm',[-1,0],12)+dim(M(r0),M(O0),a+' cm',[0,1],8);
 b+=tx([M(S0)[0],M(S0)[1]-12],'ㅅ')+tx([M(g0)[0]+9,M(g0)[1]+12],'ㄱ')+tx([M(r0)[0]-10,M(r0)[1]+13],'ㄹ')+tx([M(n0)[0]-4,M(n0)[1]+15],'ㄴ')+tx([M(d0)[0]+4,M(d0)[1]+15],'ㄷ')+tx([M(J)[0]+6,M(J)[1]-12],'ㅈ')+tx([M(O0)[0]+12,M(O0)[1]],'ㅇ');
 const ans=a*a/2;
 return {prompt:P(`정사각형 ㄱㄴㄷㄹ에서 변 ㄴㄱ과 변 ㄱㄹ을 늘여 점 ㅅ과 점 ㅇ을 잡고 선분 ㅅㅇ을 그었습니다. 선분 ㄴㄹ을 늘여 선분 ㅅㅇ과 만나는 점을 ㅈ이라 할 때, 삼각형 ㄴㅅㅈ과 삼각형 ㅇㅈㄹ의 넓이의 합은 몇 cm²인가요?`)+svg(ox+(s+a)*sc+40,oy+40,b,'정사각형 ㄱㄴㄷㄹ과 연장선으로 만든 삼각형'),
 answer:`${ans} cm²`,
 solution:ol([`삼각형 ㄴㅅㅇ은 밑변이 ㄴㅅ = ${a} cm이고 높이가 ㄱㅇ이므로 넓이는 ${a}×(ㄱㅇ)÷2입니다.`,
  `삼각형 ㄴㄹㅇ은 밑변이 ㄹㅇ = ${a} cm이고 높이가 ㄱㄴ이므로 넓이는 ${a}×(ㄱㄴ)÷2입니다.`,
  `삼각형 ㄴㅅㅇ은 삼각형 ㄴㅅㅈ과 삼각형 ㄴㅈㅇ으로 나뉘고, 삼각형 ㄴㅈㅇ은 삼각형 ㄴㄹㅇ과 삼각형 ㅇㅈㄹ로 나뉩니다. 그러므로 구하는 넓이의 합은 (삼각형 ㄴㅅㅇ) − (삼각형 ㄴㄹㅇ) = ${a}×(ㄱㅇ − ㄱㄴ)÷2입니다.`,
  `ㄱㄴ = ㄱㄹ(정사각형의 변)이므로 ㄱㅇ − ㄱㄴ = ㄱㅇ − ㄱㄹ = ㄹㅇ = ${a} (cm)입니다.`,
  `따라서 넓이의 합은 ${a}×${a}÷2 = ${ans} (cm²)입니다.`])};}

// ---------- 개념탐구 6 본문: 폭이 일정한 길을 잘라 낸 종이 ----------
function e6x(p){const W=p.W,H=p.H,w=3,t=4,sc=Math.min(290/W,240/H),ox=54,oy=34,M=q=>[ox+q[0]*sc,oy+q[1]*sc];
 const pp=p.p,c=p.c,m=p.m,q=p.q;
 const A=[[0,0],[pp,0],[pp,t],[0,t]],B=[[pp+w,0],[W,0],[W,m],[c+w,m],[c+w,t],[pp+w,t]],C=[[0,t+w],[c,t+w],[c,m+w],[q,m+w],[q,H],[0,H]],D=[[q+w,m+w],[W,m+w],[W,H],[q+w,H]];
 let b='';[A,B,C,D].forEach(g=>{b+=poly(g.map(M),DARK);});
 b+=ra(M([pp,t]),[-1,0],[0,-1])+ra(M([pp+w,t]),[1,0],[0,-1])+ra(M([c+w,m]),[1,0],[0,-1])+ra(M([c,t+w]),[-1,0],[0,1])+ra(M([q,m+w]),[-1,0],[0,1])+ra(M([q+w,m+w]),[1,0],[0,1]);
 b+=dim(M([pp,0]),M([pp+w,0]),'3 cm',[0,-1],6)+dim(M([0,0]),M([0,t]),'4 cm',[-1,0],6)+dim(M([W,0]),M([W,H]),H+' cm',[1,0],12);
 const A2=3*W+3*H-9,ans=W*H-A2;
 return {prompt:P(`직사각형 모양의 종이에서 그림과 같이 폭이 모두 3 cm로 일정한 길 모양을 잘라 냈습니다. 잘라 낸 부분의 넓이가 ${A2} cm²일 때, 잘라 내고 남은 종이의 넓이는 몇 cm²인가요?`)+svg(ox+W*sc+70,oy+H*sc+20,b,'폭이 3 cm인 길을 잘라 낸 직사각형 종이'),
 answer:`${ans} cm²`,
 solution:ol([`잘라 낸 부분을 세로로 놓인 부분과 가로로 놓인 부분으로 나눕니다. 세로로 놓인 부분(위쪽 짧은 길, 가운데 세로 길, 아래쪽 짧은 길)을 위아래로 이으면 길이가 종이의 세로와 같은 ${H} cm, 폭이 3 cm인 띠가 되므로 넓이는 ${H}×3 = ${3*H} (cm²)입니다.`,
  `나머지 가로로 놓인 두 부분의 넓이는 ${A2} − ${3*H} = ${A2-3*H} (cm²)이고 폭이 3 cm이므로 길이의 합은 ${A2-3*H}÷3 = ${W-3} (cm)입니다.`,
  `가로로 놓인 두 부분의 길이의 합은 종이의 가로에서 가운데 세로 길의 폭 3 cm를 뺀 것과 같으므로 종이의 가로는 ${W-3} + 3 = ${W} (cm)입니다.`,
  `처음 종이의 넓이는 ${W}×${H} = ${W*H} (cm²)이므로 남은 종이의 넓이는 ${W*H} − ${A2} = ${ans} (cm²)입니다.`])};}

// ---------- 예제 6-1: 넓이가 같은 두 색칠 부분 ----------
function e61(p){const a=p.a,u=p.u,d=p.d,Hh=u+d,W=a*Hh/d,sc=Math.min(270/W,200/Hh),ox=62,oy=34,M=q=>[ox+q[0]*sc,oy+(Hh-q[1])*sc];
 const n0=[0,0],d0=[W,0],r0=[W,Hh],g0=[0,Hh],Pp=[0,d],Q=[a,Hh];
 const X=inter(Pp,d0,n0,Q);
 let b=area([g0,Q,X,Pp].map(M),DARK)+area([n0,X,d0].map(M),DARK)+poly([g0,n0,d0,r0].map(M))+ln(M(Pp),M(d0))+ln(M(n0),M(Q));
 b+=dim(M(g0),M(Q),a+' cm',[0,-1],8)+dim(M(g0),M(Pp),u+' cm',[-1,0],8)+dim(M(Pp),M(n0),d+' cm',[-1,0],8);
 b+=tx([M(g0)[0]-6,M(g0)[1]-12],'ㄱ')+tx([M(n0)[0]-6,M(n0)[1]+14],'ㄴ')+tx([M(d0)[0]+8,M(d0)[1]+12],'ㄷ')+tx([M(r0)[0]+10,M(r0)[1]-8],'ㄹ');
 const big=a*Hh/2;
 return {prompt:P(`직사각형 ㄱㄴㄷㄹ에서 색칠한 두 부분의 넓이가 같을 때, 변 ㄴㄷ의 길이는 몇 cm인가요?`)+svg(ox+W*sc+30,oy+Hh*sc+30,b,'직사각형 ㄱㄴㄷㄹ과 넓이가 같은 두 색칠 부분'),
 answer:`${W} cm`,
 solution:ol([`넓이가 같은 두 색칠 부분에 왼쪽 변에 붙은 흰 삼각형을 각각 더해도 두 넓이는 같습니다.`,
  `위의 색칠 부분과 흰 삼각형을 합하면 꼭짓점 ㄱ, ㄴ과 위쪽 변 위의 점을 꼭짓점으로 하는 삼각형이 되고, 밑변 ${a} cm, 높이 ${u} + ${d} = ${Hh} (cm)이므로 넓이는 ${a}×${Hh}÷2 = ${big} (cm²)입니다.`,
  `아래의 색칠 부분과 흰 삼각형을 합하면 밑변이 ㄴㄷ, 높이가 ${d} cm인 삼각형이므로 넓이는 ㄴㄷ×${d}÷2입니다.`,
  `ㄴㄷ×${d}÷2 = ${big}이므로 ㄴㄷ = ${big}×2÷${d} = ${W} (cm)입니다.`])};}

// ---------- 예제 6-2: 45°로 자른 색종이의 가운데 정사각형 ----------
function e62(p){const a=p.a,S=3*a,sc=230/S,ox=58,oy=34,M=q=>[ox+q[0]*sc,oy+(S-q[1])*sc];
 const T=[S-a,S],L=[0,S-a],Bm=[a,0],R=[S,a],VT=[S/2,S/2+a],VL=[S/2-a,S/2],VB=[S/2,S/2-a],VR=[S/2+a,S/2];
 let b=area([VT,VR,VB,VL].map(M),GRAY)+poly([[0,0],[S,0],[S,S],[0,S]].map(M))+ln(M(T),M(VL))+ln(M(L),M(VB))+ln(M(Bm),M(VR))+ln(M(R),M(VT))+poly([VT,VR,VB,VL].map(M));
 b+=aarc(M(T),[-1,0],[-S2,S2],16,'45°')+aarc(M(L),[0,1],[S2,S2],16,'45°')+aarc(M(Bm),[1,0],[S2,-S2],16,'45°')+aarc(M(R),[0,-1],[-S2,-S2],16,'45°');
 b+=dim(M(T),M([S,S]),a+' cm',[0,-1],7)+dim(M([0,S]),M(L),a+' cm',[-1,0],7)+dim(M(R),M([S,0]),a+' cm',[1,0],7)+dim(M([0,0]),M(Bm),a+' cm',[0,1],7);
 const dg=2*a,ans=dg*dg/2;
 return {prompt:P(`정사각형 모양의 색종이를 그림과 같이 5조각으로 잘랐습니다. 이때 만들어진 가운데 작은 정사각형의 넓이는 몇 cm²인가요?`)+svg(360,310,b,'45°로 잘라 5조각이 된 정사각형 색종이'),
 answer:`${ans} cm²`,
 solution:ol([`자른 선은 모두 변과 45°를 이루므로, 선을 따라 가로로 간 길이와 세로로 간 길이가 같습니다. 그래서 가운데 정사각형의 변도 45°로 기울어져 있고, 두 대각선은 가로와 세로 방향입니다.`,
  `위쪽 변의 점에서 내려오는 선을 늘이면, 가로로 (한 변 − ${a}) cm를 가는 동안 같은 길이만큼 내려가므로 왼쪽 변에서 아래 꼭짓점으로부터 ${a} cm 높이를 지납니다. 아래쪽 변의 점에서 올라가는 선은 같은 ${a} cm 높이에서 왼쪽 변으로부터 ${a} + ${a} = ${dg} (cm) 떨어진 곳을 지납니다.`,
  `이 두 선은 서로 평행하므로 어느 높이에서나 가로로 ${dg} cm 떨어져 있습니다. 가운데 정사각형의 왼쪽 꼭짓점과 오른쪽 꼭짓점은 각각 이 두 선 위에 같은 높이로 있으므로 가로 대각선의 길이는 ${dg} cm입니다. 같은 방법으로 세로 대각선도 ${dg} cm입니다.`,
  `정사각형은 마름모이기도 하므로 넓이는 ${dg}×${dg}÷2 = ${ans} (cm²)입니다.`])};}

// ---------- 예제 6-3: 꼭짓점과 이등분점을 이은 가운데 정사각형 ----------
function e63(p){const n=p.n,sc=230/n,ox=65,oy=25,M=q=>[ox+q[0]*sc,oy+(n-q[1])*sc];
 const c=[[0.4,0.8],[0.8,0.6],[0.6,0.2],[0.2,0.4]].map(v=>[v[0]*n,v[1]*n]);
 let b=area(c.map(M),GRAY)+poly([[0,0],[n,0],[n,n],[0,n]].map(M))+ln(M([0,n]),M([n,n/2]))+ln(M([0,n/2]),M([n,0]))+ln(M([0,0]),M([n/2,n]))+ln(M([n/2,0]),M([n,n]))+poly(c.map(M));
 const ans=n*n/5;
 return {prompt:P(`한 변의 길이가 ${n} cm인 정사각형의 각 꼭짓점과 각 변의 이등분점을 그림과 같이 이었습니다. 색칠한 정사각형의 넓이는 몇 cm²인가요?`)+svg(360,280,b,'꼭짓점과 이등분점을 이은 정사각형과 가운데 색칠한 정사각형'),
 answer:`${ans} cm²`,
 solution:ol([`선으로 나뉜 조각 가운데 각 변의 이등분점에 붙은 작은 직각삼각형이 4개 있습니다.`,
  `이 직각삼각형을 그 이등분점을 중심으로 반 바퀴 돌리면, 바로 옆의 사다리꼴 조각과 맞붙어 색칠한 정사각형과 크기가 같은 정사각형이 됩니다.`,
  `따라서 바깥 정사각형의 넓이는 색칠한 정사각형 5개의 넓이와 같습니다.`,
  `색칠한 정사각형의 넓이는 ${n}×${n}÷5 = ${ans} (cm²)입니다.`])};}

// ---------- 예제 6-4 / Mission 6: 직사각형 안 두 삼각형의 겹친 부분 ----------
function inter(p1,p2,p3,p4){const d=(p1[0]-p2[0])*(p3[1]-p4[1])-(p1[1]-p2[1])*(p3[0]-p4[0]),t=((p1[0]-p3[0])*(p3[1]-p4[1])-(p1[1]-p3[1])*(p3[0]-p4[0]))/d;return [p1[0]+t*(p2[0]-p1[0]),p1[1]+t*(p2[1]-p1[1])];}
function e64(p){const W=p.W,H=p.H,sc=Math.min(270/W,170/H),ox=40,oy=44,M=q=>[ox+q[0]*sc,oy+(H-q[1])*sc];
 const n0=[0,0],d0=[W,0],r0=[W,H],g0=[0,H],E=[0,p.e],F=[p.f,H],m0=inter(E,r0,n0,F),b0=inter(E,d0,n0,F),s0=inter(E,r0,F,d0);
 let b=area([g0,F,m0,E].map(M),DARK)+area([F,r0,s0].map(M),DARK)+area([E,b0,n0].map(M),DARK)+poly([g0,n0,d0,r0].map(M))+ln(M(E),M(r0))+ln(M(E),M(d0))+ln(M(n0),M(F))+ln(M(F),M(d0));
 const cA=M([(g0[0]+F[0]+m0[0]+E[0])/4,(g0[1]+F[1]+m0[1]+E[1])/4]),cC=M([(E[0]+b0[0]+n0[0])/3,(E[1]+b0[1]+n0[1])/3]),cB=M([(F[0]+r0[0]+s0[0])/3,(F[1]+r0[1]+s0[1])/3]);
 b+=tx([cA[0]-10,cA[1]],p.tl+' cm²','middle',13)+tx([cC[0]-2,cC[1]],p.left+' cm²','middle',13);
 const lb=[M(r0)[0]-26,oy-26];b+=`<path d="M${pt([lb[0]-30,lb[1]+5])} Q${pt([cB[0],lb[1]+4])} ${pt([cB[0],cB[1]-2])}" style="fill:none;stroke:#222;stroke-width:1px"/>`+tx(lb,p.top+' cm²','middle',13);
 b+=tx([M(g0)[0]-10,M(g0)[1]-8],'ㄱ')+tx([M(n0)[0]-10,M(n0)[1]+10],'ㄴ')+tx([M(d0)[0]+10,M(d0)[1]+10],'ㄷ')+tx([M(r0)[0]+12,M(r0)[1]-4],'ㄹ')+tx([M(m0)[0]+2,M(m0)[1]+15],'ㅁ')+tx([M(b0)[0]+9,M(b0)[1]+14],'ㅂ')+tx([M(s0)[0]-13,M(s0)[1]+14],'ㅅ');
 const ans=p.tl+p.top+p.left;
 return {prompt:P(`직사각형 ㄱㄴㄷㄹ에 그림과 같이 몇 개의 선분을 그었습니다. 색칠한 부분의 넓이가 그림과 같을 때, 사각형 ㅁㅂㄷㅅ의 넓이는 몇 cm²인가요?`)+svg(ox+W*sc+40,oy+H*sc+28,b,'직사각형 ㄱㄴㄷㄹ 안의 선분과 색칠한 세 부분'),
 answer:`${ans} cm²`,
 solution:ol([`위쪽 변 위의 점과 꼭짓점 ㄴ, ㄷ을 이은 삼각형은 밑변이 ㄴㄷ이고 높이가 직사각형의 세로와 같으므로 넓이가 직사각형의 반입니다.`,
  `왼쪽 변 위의 점과 꼭짓점 ㄹ, ㄷ을 이은 삼각형은 밑변이 ㄹㄷ이고 높이가 직사각형의 가로와 같으므로 넓이가 직사각형의 반입니다.`,
  `두 삼각형의 넓이의 합은 직사각형의 넓이와 같습니다. 두 삼각형은 사각형 ㅁㅂㄷㅅ에서 겹치고, 색칠한 세 부분은 어느 삼각형에도 들어가지 않습니다.`,
  `그러므로 겹친 부분의 넓이는 두 삼각형이 덮지 못한 부분의 넓이와 같아서 사각형 ㅁㅂㄷㅅ의 넓이는 ${p.tl} + ${p.left} + ${p.top} = ${ans} (cm²)입니다.`])};}
function n6(p){const W=p.W,H=p.H,sc=Math.min(270/W,170/H),ox=92,oy=46,M=q=>[ox+q[0]*sc,oy+(H-q[1])*sc];
 const Bq=[0,0],Cq=[W,0],Dq=[W,H],Aq=[0,H],Fq=[0,p.f],Eq=[p.e,H],X=inter(Bq,Eq,Fq,Dq),Y=inter(Eq,Cq,Fq,Dq),Z=inter(Bq,Eq,Fq,Cq);
 let b=area([X,Y,Cq,Z].map(M),DARK)+poly([Aq,Bq,Cq,Dq].map(M))+ln(M(Bq),M(Eq))+ln(M(Eq),M(Cq))+ln(M(Fq),M(Dq))+ln(M(Fq),M(Cq));
 const cA=M([(Aq[0]+Eq[0]+X[0]+Fq[0])/4,(Aq[1]+Eq[1]+X[1]+Fq[1])/4]),cT=M([(Eq[0]+Dq[0]+Y[0])/3,(Eq[1]+Dq[1]+Y[1])/3]),cL=M([(Fq[0]+Bq[0]+Z[0])/3,(Fq[1]+Bq[1]+Z[1])/3]);
 b+=tx([cA[0]-4,cA[1]],p.a47+' cm²','middle',13);const lt=[cT[0]+46,oy-24];b+=tx(lt,p.a34+' cm²','middle',13)+`<path d="M${pt([lt[0]-24,lt[1]+4])} Q${pt([cT[0],lt[1]+2])} ${pt([cT[0],cT[1]+1])}" style="fill:none;stroke:#222;stroke-width:1px"/>`;
 const lp=[ox-50,cL[1]+20];b+=tx(lp,p.a15+' cm²','middle',13)+`<path d="M${pt([lp[0]+26,lp[1]-4])} L${pt([cL[0]-1,cL[1]+1])}" style="fill:none;stroke:#222;stroke-width:1px"/>`;
 b+=tx([M(Aq)[0]-8,M(Aq)[1]-9],'A')+tx([M(Bq)[0]-9,M(Bq)[1]+11],'B')+tx([M(Cq)[0]+9,M(Cq)[1]+10],'C')+tx([M(Dq)[0]+10,M(Dq)[1]-8],'D')+tx([M(Eq)[0],M(Eq)[1]-11],'E')+tx([M(Fq)[0]-10,M(Fq)[1]-3],'F');
 const ans=p.a47+p.a34+p.a15;
 return {prompt:P(`직사각형 ABCD 안에 그림과 같이 몇 개의 직선을 그었더니 넓이가 각각 ${p.a15} cm², ${p.a34} cm², ${p.a47} cm²인 도형이 만들어졌습니다. 색칠한 부분의 넓이는 몇 cm²인가요?`)+svg(ox+W*sc+40,oy+H*sc+28,b,'직사각형 ABCD 안의 직선과 색칠한 사각형'),
 answer:`${ans} cm²`,
 solution:ol([`삼각형 EBC는 밑변이 BC이고 높이가 직사각형의 세로와 같으므로 넓이가 직사각형의 반입니다.`,
  `삼각형 FCD는 밑변이 CD이고 높이가 직사각형의 가로와 같으므로 넓이가 직사각형의 반입니다.`,
  `두 삼각형의 넓이의 합은 직사각형의 넓이와 같습니다. 두 삼각형은 색칠한 사각형에서 겹치고, 넓이가 ${p.a15} cm², ${p.a34} cm², ${p.a47} cm²인 세 도형은 어느 삼각형에도 들어가지 않습니다.`,
  `그러므로 겹친 부분(색칠한 부분)의 넓이는 덮이지 않은 세 도형의 넓이의 합과 같아서 ${p.a15} + ${p.a34} + ${p.a47} = ${ans} (cm²)입니다.`])};}

// ---------- 개념탐구 6 Mission 1: 공원의 잔디 ----------
function n1(p){const Pk=p.P,w=p.w,m=p.m,c1=(Pk-w)/2,c2=(Pk+w)/2,k=c1-m,sc=240/Pk,ox=50,oy=40,M=q=>[ox+q[0]*sc,oy+(Pk-q[1])*sc];
 const wt=[[[m,c2],[m,c2+k],[m+k,c2+k]],[[c2,c2+k],[c2+k,c2+k],[c2+k,c2]],[[m,c1],[m,m],[m+k,m]],[[c2,m],[c2+k,m],[c2+k,c1]]];
 let b=area([[0,0],[Pk,0],[Pk,Pk],[0,Pk]].map(M),GRAY)+area([[c1,0],[c2,0],[c2,Pk],[c1,Pk]].map(M),'#fff')+area([[0,c1],[Pk,c1],[Pk,c2],[0,c2]].map(M),'#fff');
 wt.forEach(t=>{b+=area(t.map(M),'#fff');});
 [[0,0],[c2,0],[0,c2],[c2,c2]].forEach(o=>{b+=poly([[o[0],o[1]],[o[0]+c1,o[1]],[o[0]+c1,o[1]+c1],[o[0],o[1]+c1]].map(M));});
 [[m,c2],[c2,c2],[m,m],[c2,m]].forEach(o=>{b+=poly([[o[0],o[1]],[o[0]+k,o[1]],[o[0]+k,o[1]+k],[o[0],o[1]+k]].map(M));});
 b+=ln(M([m,c2]),M([c1,c2+k]))+ln(M([c2,c2+k]),M([c2+k,c2]))+ln(M([m,c1]),M([c1,m]))+ln(M([c2,m]),M([c2+k,c1]));
 b+=dl(M([c1,c2+k]),M([c2,c2+k]))+dl(M([c1,m]),M([c2,m]))+dl(M([m,c1]),M([m,c2]))+dl(M([c2+k,c1]),M([c2+k,c2]));
 b+=dim(M([c1,Pk]),M([c2,Pk]),w+' m',[0,-1],6)+dim(M([0,c1]),M([0,c2]),w+' m',[-1,0],6)+dim(M([Pk,Pk]),M([Pk,0]),Pk+' m',[1,0],12)+dim(M([0,0]),M([Pk,0]),Pk+' m',[0,1],10);
 b+=dim(M([c2,Pk]),M([c2,c2+k]),m+' m',[1,0],4)+dim(M([0,c1]),M([m,c1]),m+' m',[0,1],4)+dim(M([Pk-m,c1]),M([Pk,c1]),m+' m',[0,1],4)+dim(M([c2,0]),M([c2,m]),m+' m',[1,0],4);
 const big=(Pk-w)*(Pk-w),sq=k*k,ans=big-2*sq;
 return {prompt:P(`어느 공원에 색칠한 부분과 같이 잔디를 깔고, 일정한 폭으로 길을 만들었습니다. 잔디를 깐 부분의 넓이의 합은 몇 m²인가요?`)+svg(ox+Pk*sc+70,oy+Pk*sc+40,b,'정사각형 공원과 길, 잔디를 깐 부분')+P(`※ 조건 보충: 가운데 네 작은 사각형은 모두 길에 붙어 있는 정사각형이고, 그 안의 흰 삼각형은 정사각형을 대각선으로 똑같이 둘로 나눈 것입니다.`),
 answer:`${ans} m²`,
 solution:ol([`가로 길과 세로 길을 빼고 남은 네 부분을 길이 없어지도록 모으면 한 변이 ${Pk} − ${w} = ${Pk-w} (m)인 정사각형이 되므로 넓이는 ${Pk-w}×${Pk-w} = ${big} (m²)입니다.`,
  `길 한쪽의 공원 폭은 (${Pk} − ${w})÷2 = ${c1} (m)이므로 작은 정사각형의 한 변은 ${c1} − ${m} = ${k} (m)입니다.`,
  `흰 삼각형은 작은 정사각형의 반이므로 흰 삼각형 2개는 작은 정사각형 1개와 넓이가 같습니다. 흰 삼각형 4개의 넓이는 작은 정사각형 2개의 넓이인 ${k}×${k}×2 = ${2*sq} (m²)입니다.`,
  `잔디를 깐 부분의 넓이는 ${big} − ${2*sq} = ${ans} (m²)입니다.`])};}

// ---------- 개념탐구 6 Mission 2: 폭 2 m인 길이 있는 정원 ----------
function n2(p){const W=p.W,H=p.H,s=p.s,L=p.L,t=p.t,a=p.a,c=p.c,tau=p.tau,g=p.g,w=2,sc=Math.min(320/W,230/H),ox=46,oy=36,M=q=>[ox+q[0]*sc,oy+q[1]*sc];
 const P1=[[0,0],[a,0],[a,t],[0,t]],P2=[[a+w,0],[g,0],[g,s],[c+w+tau,s],[c+w+tau,s+L],[c+w,s+L],[c+w,t],[a+w,t]],P3=[[g+w,0],[W,0],[W,s],[g+w,s]],
  P4=[[0,t+w],[c,t+w],[c,s+L+w],[c+w+tau,s+L+w],[c+w+tau,H],[0,H]],P5=[[c+2*w+tau,s+w],[W,s+w],[W,H],[c+2*w+tau,H]];
 let b='';[P1,P2,P3,P4,P5].forEach(g_=>{b+=poly(g_.map(M),GRAY);});
 b+=dim(M([a,0]),M([a+w,0]),'2 m',[0,-1],6)+dim(M([g,0]),M([g+w,0]),'2 m',[0,-1],6)+dim(M([0,t]),M([0,t+w]),'2 m',[-1,0],6);
 b+=dim(M([g,0]),M([g,s]),s+' m',[-1,0],5)+(()=>{const A_=M([c+w+tau,s]),B_=M([c+w+tau,s+L]),my=(A_[1]+B_[1])/2,lp=[A_[0]+26,A_[1]-11];return `<path d="M${pt(A_)} Q${pt([A_[0]+11,my])} ${pt(B_)}" style="fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3"/>`+`<path d="M${pt([A_[0]+6,my])} Q${pt([lp[0]-6,my-4])} ${pt([lp[0]-4,lp[1]+6])}" style="fill:none;stroke:#222;stroke-width:1px"/>`+tx([lp[0]+8,lp[1]],L+' m','middle',13);})()+dim(M([W,0]),M([W,H]),H+' m',[1,0],12);
 const path=w*(W-2*w)+w*(H+s+L+w),ans=W*H-path,vert=H+s+L+w;
 return {prompt:P(`직사각형 모양의 정원에 그림과 같이 폭이 2 m인 길을 만들었습니다. 이 길의 넓이가 ${path} m²일 때, 정원에서 길을 뺀 부분(색칠한 부분)의 넓이는 몇 m²인가요?`)+svg(ox+W*sc+70,oy+H*sc+22,b,'폭 2 m인 길이 있는 직사각형 정원',400),
 answer:`${ans} m²`,
 solution:ol([`길을 세로로 놓인 부분과 가로로 놓인 부분으로 나눕니다.`,
  `세로로 놓인 부분: 왼쪽 위의 짧은 길과 그 아래 꼬리 모양 왼쪽의 길을 합하면 맨 위에서 꼬리 아래쪽 길의 아랫변까지의 길이와 같아 ${s} + ${L} + 2 = ${s+L+2} (m)입니다. 가운데 긴 세로 길은 ${H} − ${s} = ${H-s} (m), 오른쪽 위의 짧은 길은 ${s} m입니다. 길이의 합은 ${vert} m이므로 넓이는 ${vert}×2 = ${2*vert} (m²)입니다.`,
  `가로로 놓인 부분의 넓이는 ${path} − ${2*vert} = ${path-2*vert} (m²)이므로 길이의 합은 ${path-2*vert}÷2 = ${W-4} (m)입니다.`,
  `가로로 놓인 부분의 길이의 합은 정원의 가로에서 세로 길 두 개의 폭 2 m + 2 m를 뺀 것과 같으므로 정원의 가로는 ${W-4} + 4 = ${W} (m)입니다.`,
  `정원의 넓이는 ${W}×${H} = ${W*H} (m²)이므로 길을 뺀 부분의 넓이는 ${W*H} − ${path} = ${ans} (m²)입니다.`])};}

// ---------- 개념탐구 6 Mission 3: 네 변의 가운데를 잘라 낸 정사각형 ----------
const dec=v=>String(Math.round(v*10)/10);
function n3(p){const k=p.k,n=4*k,d=k/2,sc=240/n,ox=60,oy=50,M=q=>[ox+q[0]*sc,oy+q[1]*sc];
 const pts=[[0,0],[k,0],[1.5*k,d],[2.5*k,d],[3*k,0],[n,0],[n,k],[n-d,1.5*k],[n-d,2.5*k],[n,3*k],[n,n],[3*k,n],[2.5*k,n-d],[1.5*k,n-d],[k,n],[0,n],[0,3*k],[d,2.5*k],[d,1.5*k],[0,k]];
 let b=poly(pts.map(M),GRAY);
 b+=dim(M([0,0]),M([k,0]),k+' cm',[0,-1],7)+dim(M([3*k,0]),M([n,0]),k+' cm',[0,-1],7)+dim(M([0,n]),M([k,n]),k+' cm',[0,1],7)+dim(M([3*k,n]),M([n,n]),k+' cm',[0,1],7);
 b+=dim(M([0,0]),M([0,k]),k+' cm',[-1,0],7)+dim(M([0,3*k]),M([0,n]),k+' cm',[-1,0],7)+dim(M([n,0]),M([n,k]),k+' cm',[1,0],7)+dim(M([n,3*k]),M([n,n]),k+' cm',[1,0],7);
 b+=dim(M([1.5*k,d]),M([2.5*k,d]),k+' cm',[0,1],5)+dim(M([1.5*k,n-d]),M([2.5*k,n-d]),k+' cm',[0,-1],5)+dim(M([d,1.5*k]),M([d,2.5*k]),k+' cm',[1,0],5)+dim(M([n-d,1.5*k]),M([n-d,2.5*k]),k+' cm',[-1,0],5);
 const op=n-2*k,cut=(op+k)*(2*d),ans=n*n-cut;
 return {prompt:P(`그림과 같이 한 변의 길이가 ${n} cm인 정사각형의 네 변에서 같은 모양으로 잘라 냈습니다. 색칠한 부분의 넓이는 몇 cm²인가요?`)+svg(360,360,b,'네 변의 가운데를 잘라 낸 정사각형')+P(`※ 조건 보충: 잘라 낸 네 부분은 모양과 크기가 모두 같고, 비스듬한 선은 정사각형의 변과 45°를 이룹니다.`),
 answer:`${ans} cm²`,
 solution:ol([`한 변 ${n} cm에서 양 끝의 ${k} cm씩을 빼면 잘라 낸 부분의 입구는 ${n} − ${k} − ${k} = ${op} (cm)입니다.`,
  `안쪽 변이 ${k} cm이므로 비스듬한 선 하나가 가로로 차지하는 길이는 (${op} − ${k})÷2 = ${dec((op-k)/2)} (cm)입니다. 비스듬한 선이 변과 45°를 이루어 직각이등변삼각형이 생기므로 잘라 낸 깊이도 ${dec(d)} cm입니다.`,
  `잘라 낸 부분 하나는 윗변 ${op} cm, 아랫변 ${k} cm, 높이 ${dec(d)} cm인 사다리꼴입니다. 두 개를 거꾸로 맞붙이면 밑변 ${op} + ${k} = ${op+k} (cm), 높이 ${dec(d)} cm인 평행사변형이 되고, 이런 평행사변형 두 개를 이어 붙이면 밑변 ${op+k} cm, 높이 ${dec(d)} + ${dec(d)} = ${2*d} (cm)인 평행사변형이 됩니다.`,
  `잘라 낸 네 부분의 넓이는 ${op+k}×${2*d} = ${cut} (cm²)이므로 색칠한 부분의 넓이는 ${n}×${n} − ${cut} = ${ans} (cm²)입니다.`])};}

// ---------- 개념탐구 6 Mission 4: X 모양 ----------
function n4(p){const n=p.n,m=p.m,h=n-2*m,sc=230/n,ox=62,oy=48,M=q=>[ox+q[0]*sc,oy+q[1]*sc];
 const tri=[[[m,0],[n-m,0],[n/2,h/2]],[[n,m],[n,n-m],[n-h/2,n/2]],[[n-m,n],[m,n],[n/2,n-h/2]],[[0,n-m],[0,m],[h/2,n/2]]];
 let b=poly([[0,0],[n,0],[n,n],[0,n]].map(M),DARK);tri.forEach(t=>{b+=poly(t.map(M),'#fff');const ap=M(t[2]),u1=M(t[0]),u2=M(t[1]);const nv=q=>{const dx=q[0]-ap[0],dy=q[1]-ap[1],l=Math.hypot(dx,dy);return [dx/l,dy/l];};b+=ra(ap,nv(u1),nv(u2),8);});
 b+=dim(M([0,0]),M([m,0]),m+' cm',[0,-1],7)+dim(M([n-m,0]),M([n,0]),m+' cm',[0,-1],7)+dim(M([0,n]),M([m,n]),m+' cm',[0,1],7)+dim(M([n-m,n]),M([n,n]),m+' cm',[0,1],7);
 b+=dim(M([0,0]),M([0,m]),m+' cm',[-1,0],7)+dim(M([0,n-m]),M([0,n]),m+' cm',[-1,0],7)+dim(M([n,0]),M([n,m]),m+' cm',[1,0],7)+dim(M([n,n-m]),M([n,n]),m+' cm',[1,0],7);
 const ans=n*n-h*h;
 return {prompt:P(`그림과 같이 한 변이 ${n} cm인 정사각형에서 색칠한 부분의 넓이는 몇 cm²인가요?`)+svg(360,340,b,'정사각형 안의 X 모양 색칠한 부분'),
 answer:`${ans} cm²`,
 solution:ol([`흰 삼각형의 긴 변은 ${n} − ${m} − ${m} = ${h} (cm)입니다.`,
  `흰 삼각형은 양 끝이 똑같이 ${m} cm씩 떨어져 좌우가 같고 꼭짓점의 각이 직각이므로 직각이등변삼각형입니다.`,
  `흰 삼각형 4개를 직각인 꼭짓점이 한 점에 모이도록 붙이면 긴 변들이 둘레가 되어 한 변이 ${h} cm인 정사각형이 되므로, 흰 삼각형 4개의 넓이는 ${h}×${h} = ${h*h} (cm²)입니다.`,
  `색칠한 부분의 넓이는 ${n}×${n} − ${h*h} = ${ans} (cm²)입니다.`])};}

// ---------- 개념탐구 6 Mission 5: 정사각형 5개의 십자 모양 ----------
function n5(p){const L=p.L,u=78,ox=63,oy=34,M=q=>[ox+q[0]*u,oy+q[1]*u];
 let b=poly([[1,0],[2,0],[2,1],[3,1],[3,2],[2,2],[2,3],[1,3],[1,2],[0,2],[0,1],[1,1]].map(M),GRAY)+ln(M([1,1]),M([2,1]))+ln(M([1,2]),M([2,2]))+ln(M([1,1]),M([1,2]))+ln(M([2,1]),M([2,2]))+ln(M([1,0]),M([2,2]));
 b+=tx([M([1,0])[0]-10,M([1,0])[1]-10],'ㄱ')+tx([M([2,2])[0]+12,M([2,2])[1]+13],'ㄴ');
 const ans=L*L;
 return {prompt:P(`크기가 같은 정사각형 5개로 그림과 같은 도형을 만들었습니다. 선분 ㄱㄴ의 길이가 ${L} cm일 때, 도형의 넓이는 몇 cm²인가요?`)+svg(360,300,b,'정사각형 5개로 만든 십자 모양과 선분 ㄱㄴ'),
 answer:`${ans} cm²`,
 solution:ol([`선분 ㄱㄴ은 작은 정사각형 2개를 이어 붙인 직사각형의 대각선입니다.`,
  `선분 ㄱㄴ을 한 변으로 하는 정사각형을 그리면, 그 안은 작은 정사각형 2개짜리 직사각형을 반으로 나눈 직각삼각형 4개와 가운데 작은 정사각형 1개로 채워집니다.`,
  `직각삼각형 하나의 넓이는 작은 정사각형 1개와 같으므로, 선분 ㄱㄴ을 한 변으로 하는 정사각형의 넓이는 작은 정사각형 5개의 넓이, 곧 주어진 도형의 넓이와 같습니다.`,
  `따라서 도형의 넓이는 ${L}×${L} = ${ans} (cm²)입니다.`])};}

// ---------- 문항 표 ----------
const mk=(sid,key,fn,params,extra)=>Object.assign({sourceItemId:sid,key,resultContract:'single-value',answerVisualRequired:false,pool:params.map(fn)},extra||{});
const ITEMS={
 '5-1-u6-t5-7':mk('5-1-u6-e5-mission-2','orig51U6E5Mission2',stairs,[{s:[4,3,2,1]},{s:[5,4,3,2]},{s:[6,5,4,3]}]),
 '5-1-u6-t5-8':mk('5-1-u6-e5-mission-3-na','orig51U6E5Mission3Na',p=>m3(p,'나'),[{O:30,I:24},{O:26,I:20},{O:32,I:24}]),
 '5-1-u6-t5-9':mk('5-1-u6-e5-mission-3-da','orig51U6E5Mission3Da',p=>m3(p,'다'),[{O:30,I:24},{O:26,I:20},{O:32,I:24}]),
 '5-1-u6-t5-10':mk('5-1-u6-e5-mission-4','orig51U6E5Mission4',m4,[{a:12,h:3,R:36},{a:10,h:4,R:64},{a:16,h:4,R:48}],{answerAssumption:'세 점 ㄴ, ㄷ, ㅂ은 한 직선 위에 있고, 주어진 짧은 길이는 마름모의 두 대각선이 만나는 점에서 점 ㅂ까지의 길이입니다.'}),
 '5-1-u6-t5-11':mk('5-1-u6-e5-mission-5','orig51U6E5Mission5',m5,[{A:480},{A:384},{A:672}]),
 '5-1-u6-t5-12':mk('5-1-u6-e5-mission-6','orig51U6E5Mission6',m6s,[{a:24,s:10},{a:20,s:8},{a:18,s:8}]),
 '5-1-u6-t6':mk('5-1-u6-e6-exploration','orig51U6E6Exploration',e6x,[{W:40,H:35,p:10,c:17,m:17,q:29},{W:36,H:30,p:9,c:15,m:14,q:26},{W:45,H:40,p:11,c:19,m:19,q:33}]),
 '5-1-u6-t6-2':mk('5-1-u6-e6-example-6-1','orig51U6E6Example61',e61,[{a:20,u:12,d:15},{a:18,u:10,d:12},{a:24,u:14,d:16}]),
 '5-1-u6-t6-3':mk('5-1-u6-e6-example-6-2','orig51U6E6Example62',e62,[{a:12},{a:10},{a:14}]),
 '5-1-u6-t6-4':mk('5-1-u6-e6-example-6-3','orig51U6E6Example63',e63,[{n:10},{n:15},{n:20}]),
 '5-1-u6-t6-5':mk('5-1-u6-e6-example-6-4','orig51U6E6Example64',e64,[{tl:38,top:8,left:26,W:24.6568,H:11.7413,e:7.7354,f:14.0283},{tl:30,top:6,left:20,W:21.6422,H:10.3058,e:6.7391,f:12.5070},{tl:45,top:10,left:28,W:26.3792,H:12.5615,e:8.0510,f:14.7387}]),
 '5-1-u6-t6-6':mk('5-1-u6-e6-mission-1','orig51U6E6Mission1',n1,[{P:23,w:3,m:5},{P:26,w:2,m:6},{P:19,w:3,m:4}],{answerAssumption:'가운데 네 작은 사각형은 길에 붙어 있는 정사각형이고, 흰 삼각형은 그 정사각형을 대각선으로 똑같이 나눈 반쪽입니다.'}),
 '5-1-u6-t6-7':mk('5-1-u6-e6-mission-2','orig51U6E6Mission2',n2,[{W:36,H:20,s:5,L:4,t:2,a:3,c:10,tau:2,g:26},{W:30,H:18,s:4,L:3,t:2,a:3,c:8,tau:2,g:21},{W:40,H:24,s:6,L:4,t:2,a:4,c:11,tau:2,g:29}]),
 '5-1-u6-t6-8':mk('5-1-u6-e6-mission-3','orig51U6E6Mission3',n3,[{k:3},{k:4},{k:5}],{answerAssumption:'잘라 낸 네 부분은 모양과 크기가 같고, 비스듬한 선은 정사각형의 변과 45°를 이룹니다.'}),
 '5-1-u6-t6-9':mk('5-1-u6-e6-mission-4','orig51U6E6Mission4',n4,[{n:17,m:4},{n:20,m:5},{n:16,m:3}]),
 '5-1-u6-t6-10':mk('5-1-u6-e6-mission-5','orig51U6E6Mission5',n5,[{L:7},{L:9},{L:10}]),
 '5-1-u6-t6-11':mk('5-1-u6-e6-mission-6','orig51U6E6Mission6',n6,[{a15:15,a34:34,a47:47,W:29.3577,H:13.9798,f:7.1000,e:9.7186},{a15:12,a34:30,a47:40,W:27.0887,H:12.8994,f:6.3963,e:8.7836},{a15:18,a34:36,a47:52,W:30.9256,H:14.7265,f:7.7127,e:10.4964}]),
};
function build(id,variant){const it=ITEMS[id],sid=it.sourceItemId,i=((variant|0)%it.pool.length+it.pool.length)%it.pool.length,p=it.pool[i];
 return {prompt:wrap(sid,i,p.prompt),answer:p.answer,solution:wrap(sid,i,p.solution),...(p.answerVisual?{answerVisual:p.answerVisual,answerKeyVisual:true}:{}),
  automaticGrading:false,resultContract:it.resultContract||'single-value',sourceItemId:sid,typeId:id,generator:it.key,generationMode:'fixed-verified-pool',
  verifiedPoolIndex:i,variant:i,verifiedVariantCount:it.pool.length,verifiedVariantTarget:3,sourceStructurePreserved:true,sourceExact:false,
  publisherAnswerVerified:false,officialAnswerVerified:false,answerVisualRequired:!!it.answerVisualRequired,...(it.answerAssumption?{answerAssumption:it.answerAssumption}:{})};}
function install(target){const api=target&&target.HSE_GENERATORS;if(!api||typeof api.generatorKey!=='function'||typeof api.generate!=='function')return false;
 const flag='__orig45_'+GROUP.replace(/-/g,'_');if(api[flag])return true;
 const pk=api.generatorKey.bind(api),pg=api.generate.bind(api),keys=new Set(Object.values(ITEMS).map(x=>x.key));
 const owns=t=>t&&(ITEMS[t.id]||keys.has(t.generatorKey));
 const ok=t=>{const it=t&&ITEMS[t.id];return !!it&&t.sourceItemId===it.sourceItemId&&t.generatorKey===it.key&&t.reviewLocked===false&&t.sourceVerified===true;};
 api.generatorKey=function(t){return owns(t)?(ok(t)?ITEMS[t.id].key:''):pk(t);};
 api.generate=function(t,rank,difficulty,seed,variant){return owns(t)?(ok(t)?build(t.id,variant===undefined?0:variant):null):pg(t,rank,difficulty,seed,variant);};
 if(Array.isArray(api.names))keys.forEach(k=>{if(!api.names.includes(k))api.names.push(k);});
 Object.defineProperty(api,flag,{value:true});return true;}
const exported=Object.freeze({GROUP,ITEMS,build,install});
root['HSE_ORIG45_'+GROUP.replace(/-/g,'_')]=exported;install(root);
})(typeof window!=='undefined'?window:globalThis);
