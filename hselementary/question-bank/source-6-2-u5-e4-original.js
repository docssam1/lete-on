// 황소 6-2 5단원 원의 넓이, 개념탐구 4(복잡한 도형의 넓이 ②) 원문 구조 유형.
// 원문 수치를 보존한 변형 0과 수만 바꾼 변형 1·2를 고정 검증 풀(fixed-verified-pool)로 제공합니다.
(function(root){'use strict';
const GROUP='6-2-u5-e4';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;
const ol=steps=>'<ol>'+steps.map(s=>`<li>${s}</li>`).join('')+'</ol>';
const gcd=(a,b)=>{while(b){[a,b]=[b,a%b];}return a;};
const n=x=>String(Math.round(x*10000)/10000); // 계산 결과를 유한소수로 표시
const fr=(a,b)=>{const g=gcd(a,b);return ff(a/g,b/g);};

// ---------- SVG 도우미 (화면 좌표: y 아래쪽) ----------
const r2=x=>Math.round(x*100)/100;
const P=p=>`${r2(p[0])},${r2(p[1])}`;
const rad=d=>d*Math.PI/180;
const crs=(C,A,B)=>(A[0]-C[0])*(B[1]-C[1])-(A[1]-C[1])*(B[0]-C[0]);
const arc=(C,r,A,B)=>`A${r2(r)},${r2(r)} 0 0 ${crs(C,A,B)>0?1:0} ${P(B)}`; // 180°보다 작은 호
const ST='stroke="#222" stroke-width="1.4" fill="none" stroke-linejoin="round"';
const SH='fill="#cfcfcf" stroke="none"';
const DIM='style="fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3"';
const svg=(vb,body,label)=>`<svg viewBox="${vb}" role="img" aria-label="${label}" style="width:100%;max-width:360px;height:auto;display:block;margin:8px auto" xmlns="http://www.w3.org/2000/svg" font-family="inherit">${body}</svg>`;
const T=(p,s,a)=>`<text x="${r2(p[0])}" y="${r2(p[1])}" text-anchor="${a||'middle'}" dominant-baseline="middle" font-size="14" fill="#222">${s}</text>`;
const TB=(p,s)=>`<rect x="${r2(p[0]-8)}" y="${r2(p[1]-8)}" width="16" height="16" fill="#fff" stroke="none"/>`+T(p,s); // 점선 위 꼭짓점 이름
const dot=p=>`<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="2.8" fill="#222"/>`;
const line=(A,B)=>`<path d="M${P(A)} L${P(B)}" ${ST}/>`;
// 점선 치수 호: A→B 선분 바깥쪽(off의 부호로 방향)으로 휘어진 점선과 길이 글자
function dim(A,B,off,label,lo){const dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L,m=[(A[0]+B[0])/2,(A[1]+B[1])/2];
 const c=[m[0]+nx*off*2,m[1]+ny*off*2],t=[m[0]+nx*(off+(off>0?lo:-lo)),m[1]+ny*(off+(off>0?lo:-lo))];
 return `<path d="M${P(A)} Q${P(c)} ${P(B)}" ${DIM}/>`+`<rect x="${r2(t[0]-24)}" y="${r2(t[1]-9)}" width="48" height="18" fill="#fff" stroke="none"/>`+T(t,label);}
// 각호: 꼭짓점 V에서 수학 각도 t1→t2(반시계)로 그린 호와 각 글자(lp가 있으면 그 자리에 쓰고 지시선을 긋습니다)
function ang(V,t1,t2,r,label,lr,lp){const q=t=>[V[0]+r*Math.cos(rad(t)),V[1]-r*Math.sin(rad(t))],A=q(t1),B=q(t2),mid=(t1+t2)/2;
 let s=`<path d="M${P(A)} A${r},${r} 0 0 0 ${P(B)}" fill="none" stroke="#222" stroke-width="1"/>`;
 if(lp){const M=q(mid);s+=`<path d="M${P(lp[1])} L${P(M)}" fill="none" stroke="#55524d" stroke-width="0.9"/>`+T(lp[0],label);}
 else s+=T([V[0]+lr*Math.cos(rad(mid)),V[1]-lr*Math.sin(rad(mid))],label);
 return s;}
const rmark=(V,u,v,z)=>`<path d="M${P([V[0]+u[0]*z,V[1]+u[1]*z])} L${P([V[0]+(u[0]+v[0])*z,V[1]+(u[1]+v[1])*z])} L${P([V[0]+v[0]*z,V[1]+v[1]*z])}" fill="none" stroke="#222" stroke-width="1"/>`;

// ---------- 그림 ----------
function figExploration(){const a=20,b=260,c=140,Pq=[b-240/Math.SQRT2,b-240/Math.SQRT2];
 return svg('0 0 280 280',
  `<path d="M${a},${a} L${a},${b} A240,240 0 0 1 ${P(Pq)} Z" ${SH}/>`+
  `<path d="M${P(Pq)} A240,240 0 0 1 ${b},${a} A120,120 0 0 0 ${c},${c} Z" ${SH}/>`+
  `<path d="M${c},${c} A120,120 0 0 0 ${b},${b} Z" ${SH}/>`+
  `<path d="M${a},${a} H${b} V${b} H${a} Z" ${ST}/>`+
  `<path d="M${a},${b} A240,240 0 0 1 ${b},${a}" ${ST}/>`+
  `<path d="M${b},${a} A120,120 0 0 0 ${b},${b}" ${ST}/>`+line([a,a],[b,b]),'정사각형 안에 반원과 부채꼴을 그린 그림');}
function figEx1(){const r=60,s2=r*Math.SQRT2,h=r/Math.SQRT2,O=[72,100];
 const G=[O[0]-h,O[1]+h],N=[O[0]+h,O[1]+h],D=[O[0]+h,O[1]-h],L=[O[0]-h,O[1]-h];
 const Cb=[O[0],O[1]+s2],Cr=[O[0]+s2,O[1]],Ct=[O[0],O[1]-s2],Cl=[O[0]-s2,O[1]];
 const star=`M${P(G)} ${arc(Cb,r,G,N)} ${arc(Cr,r,N,D)} ${arc(Ct,r,D,L)} ${arc(Cl,r,L,G)} Z`;
 const circ=`<circle cx="${r2(Cr[0])}" cy="${r2(Cr[1])}" r="${r}"`;
 return svg('0 28 240 146',`<path d="${star}" ${SH}/>${circ} ${SH}/><path d="${star}" ${ST}/>${circ} ${ST}/>`+dot(Cr)+
  T([G[0]-9,G[1]+10],'ㄱ')+T([N[0]-2,N[1]+15],'ㄴ')+T([D[0]-2,D[1]-15],'ㄷ')+T([L[0]-9,L[1]-10],'ㄹ'),'같은 호로 둘러싸인 모양과 원');}
function figEx2(){const r=70,A=[140,92],B=[140-r/2,92+r*Math.sqrt(3)/2],C=[140+r/2,92+r*Math.sqrt(3)/2];
 const pet=(X,Y,Z)=>{const W=[X[0]+Y[0]-Z[0],X[1]+Y[1]-Z[1]];return `<path d="M${P(X)} ${arc(Y,r,X,W)} ${arc(X,r,W,Y)} ${arc(Z,r,Y,X)} Z" ${SH}/>`;};
 const cc=p=>`<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="${r}" ${ST}/>`;
 return svg('0 0 280 245',pet(A,B,C)+pet(A,C,B)+pet(B,C,A)+cc(A)+cc(B)+cc(C)+dot(A)+dot(B)+dot(C)+
  T([A[0],A[1]-13],'ㄱ')+T([B[0]-14,B[1]+3],'ㄴ')+T([C[0]+14,C[1]+3],'ㄷ'),'세 원을 겹쳐 그린 그림');}
function figEx3(R,r){const k=190/R,V=[250,250],q=(d,f)=>[V[0]-k*d*Math.cos(rad(f)),V[1]-k*d*Math.sin(rad(f))];
 const N=q(R,0),G=q(r,30),N2=q(R,60),G2=q(r,90),B0=q(r,0);
 return svg('0 70 320 222',`<path d="M${P(N)} ${arc(V,k*R,N,N2)} L${P(G2)} ${arc(V,k*r,G2,G)} Z" ${SH}/>`+
  `<path d="M${P(N)} ${arc(V,k*R,N,N2)}" ${ST}/><path d="M${P(B0)} ${arc(V,k*r,B0,G2)}" ${ST}/>`+
  line(N,V)+line(N,G)+line(G,V)+line(N2,G2)+line(N2,V)+line(G2,V)+
  ang(V,120,180,26,'60°',0,[[V[0]-58,V[1]-15],[V[0]-44,V[1]-12]])+T([G[0]+13,G[1]-4],'ㄱ')+T([N[0]-4,N[1]+16],'ㄴ')+T([V[0]+12,V[1]+14],'ㄷ')+
  dim(N,V,13,`${R} cm`,12)+dim(G2,V,-14,`${r} cm`,24),'삼각형을 돌린 그림');}
function figEx4(r,al,be){const V=[262,240],K=200,q=f=>[V[0]-K*Math.cos(rad(f)),V[1]-K*Math.sin(rad(f))];
 const D=q(0),N=q(al),G=q(al+be),Rr=[N[0],V[1]],M=[G[0],V[1]],t=(G[0]-V[0])/(N[0]-V[0]),Sx=[G[0],V[1]+t*(N[1]-V[1])];
 const lp=[[V[0]+30,V[1]-84],[V[0]+19,V[1]-79]];
 return svg('0 0 320 300',`<path d="M${P(N)} ${arc(V,K,N,G)} L${P(M)} L${P(Rr)} Z" ${SH}/>`+
  `<path d="M${P(D)} ${arc(V,K,D,G)}" ${ST}/>`+line(D,V)+line(G,V)+line(N,V)+line(N,Rr)+line(G,M)+
  rmark(M,[1,0],[0,-1],9)+rmark(Rr,[-1,0],[0,-1],9)+
  ang(V,180-al,180,34,`${al}°`,al<30?60:52)+ang(V,180-al-be,180-al,62,`${be}°`,100,be<30?lp:null)+dim(D,V,26,`${r} cm`,12)+dim(G,V,-16,`${r} cm`,22)+
  T([G[0],G[1]-13],'ㄱ')+T([N[0]-11,N[1]-7],'ㄴ')+T([D[0]-4,D[1]+15],'ㄷ')+TB([Rr[0],Rr[1]+13],'ㄹ')+TB([M[0],M[1]+13],'ㅁ')+T([V[0]+11,V[1]+10],'ㅂ')+T([Sx[0]-11,Sx[1]-11],'ㅅ'),'부채꼴 안에 수선을 그은 그림');}
function figM1(s){const a=30,b=250,c=140;
 const sh=`M${a},${a} A110,110 0 0 0 ${b},${a} Z M${a},${b} A110,110 0 0 1 ${b},${b} Z M${c},${a} L${b},${c} L${c},${b} L${a},${c} Z`;
 return svg('0 0 320 290',`<path d="${sh}" fill-rule="evenodd" fill="#cfcfcf" stroke="none"/>`+
  `<path d="M${a},${a} H${b} V${b} H${a} Z" ${ST}/><path d="M${a},${a} A110,110 0 0 0 ${b},${a}" ${ST}/><path d="M${a},${b} A110,110 0 0 1 ${b},${b}" ${ST}/>`+
  `<path d="M${c},${a} L${b},${c} L${c},${b} L${a},${c} Z" ${ST}/>`+dim([b,a],[b,b],-14,`${s} cm`,26)+dim([a,b],[b,b],13,`${s} cm`,12),'정사각형 안에 두 반원과 마름모를 그린 그림');}
function figM2(s){const a=30,b=250,c=140;
 return svg('0 0 320 270',`<path d="M${c},${c} L${c},${a} L${a},${c} Z" ${SH}/><path d="M${c},${c} L${b},${c} L${c},${b} Z" ${SH}/>`+
  `<path d="M${c},${a} A110,110 0 0 1 ${b},${c} Z" ${SH}/><path d="M${c},${b} A110,110 0 0 1 ${a},${c} Z" ${SH}/>`+
  `<path d="M${a},${a} H${b} V${b} H${a} Z" ${ST}/><circle cx="${c}" cy="${c}" r="110" ${ST}/>`+
  `<path d="M${c},${a} L${b},${c} L${c},${b} L${a},${c} Z" ${ST}/>`+line([c,a],[c,b])+line([a,c],[b,c])+dot([c,c])+
  dim([b,a],[b,b],-14,`${s} cm`,26),'정사각형 안에 원과 마름모를 그린 그림');}
function figM3(s){const l=80,t=20,rr=300,bt=240,H=[190,130],Q=[l+220/Math.SQRT2,bt-220/Math.SQRT2];
 return svg('0 0 320 260',`<path d="M${l},${bt} L${P(H)} A110,110 0 0 0 ${l},${t} Z" ${SH}/>`+
  `<path d="M${l},${t} A220,220 0 0 1 ${P(Q)} L${rr},${t} Z" ${SH}/>`+
  `<path d="M${l},${bt} A110,110 0 0 0 ${P(H)} L${P(Q)} A220,220 0 0 1 ${rr},${bt} Z" ${SH}/>`+
  `<path d="M${l},${t} H${rr} V${bt} H${l} Z" ${ST}/><path d="M${l},${t} A220,220 0 0 1 ${rr},${bt}" ${ST}/><path d="M${l},${t} A110,110 0 0 1 ${l},${bt}" ${ST}/>`+
  line([l,bt],[rr,t])+dot([l,bt])+dot([l,130])+dim([l,t],[l,bt],14,`${s} cm`,26),'정사각형 안에 원의 일부분을 그린 그림');}
function figM4(R){const a=60,t=20,m=90,bt=160,e=270;
 return svg('-24 8 324 192',`<path d="M${a},${m} A70,70 0 0 1 200,${m} L130,${m} A35,35 0 0 0 ${a},${m} Z" ${SH}/>`+
  `<path d="M130,${m} A70,70 0 0 0 ${e},${m} A35,35 0 0 1 200,${m} Z" ${SH}/>`+
  `<path d="M${a},${t} H${e} V${bt} H${a} Z" ${ST}/><path d="M${a},${m} H${e}" style="fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3"/>`+
  `<path d="M${a},${m} A70,70 0 0 1 200,${m}" ${ST}/><path d="M${a},${m} A35,35 0 0 1 130,${m}" ${ST}/>`+
  `<path d="M130,${m} A70,70 0 0 0 ${e},${m}" ${ST}/><path d="M200,${m} A35,35 0 0 0 ${e},${m}" ${ST}/>`+
  dim([a,t],[a,bt],14,`${2*R} cm`,28)+dim([a,bt],[e,bt],13,`${3*R} cm`,12),'직사각형 안에 크고 작은 반원을 그린 그림');}
function figM5(){const c=140,R=110,h=55,cp=(x,y,r)=>`M${x-r},${y} a${r},${r} 0 1,0 ${2*r},0 a${r},${r} 0 1,0 ${-2*r},0 Z`;
 const all=cp(c,c,R)+cp(c,c-h,h)+cp(c,c+h,h)+cp(c-h,c,h)+cp(c+h,c,h);
 return svg('0 0 280 280',`<path d="${all}" fill-rule="evenodd" fill="#cfcfcf" stroke="none"/><path d="${all}" ${ST}/>`+line([c,c-R],[c,c+R])+line([c-R,c],[c+R,c]),'큰 원 안에 작은 원 4개를 겹쳐 그린 그림');}
function figM6(r,be,ga){const V=[44,240],K=200,q=f=>[V[0]+K*Math.cos(rad(f)),V[1]-K*Math.sin(rad(f))];
 const D=q(0),Rr=q(90-ga),G=q(ga),M=[G[0],V[1]],B=[Rr[0],V[1]];
 const lp=[[V[0]-6,V[1]-92],[V[0]+4,V[1]-80]];
 return svg('0 20 300 268',`<path d="M${P(G)} ${arc(V,K,G,Rr)} L${P(B)} L${P(M)} Z" ${SH}/>`+
  `<path d="M${P(D)} ${arc(V,K,D,G)}" ${ST}/>`+line(V,D)+line(V,G)+line(V,Rr)+line(G,M)+line(Rr,B)+
  rmark(M,[1,0],[0,-1],9)+rmark(B,[1,0],[0,-1],9)+
  ang(V,90-ga,90-ga+be,52,`${be}°`,0,lp)+ang(Rr,270-ga,270,20,`${ga}°`,40)+dim(V,D,26,`${r} cm`,12)+
  T([G[0],G[1]-13],'ㄱ')+T([V[0]-11,V[1]+6],'ㄴ')+T([D[0]+11,D[1]+2],'ㄷ')+T([Rr[0]+10,Rr[1]-10],'ㄹ')+TB([M[0],M[1]+13],'ㅁ')+TB([B[0],B[1]+13],'ㅂ'),'두 부채꼴을 붙여 놓은 그림');}

// ---------- 문항 ----------
function exploration(s){const S8=s*s*3.14/8,Tt=s*s/2,A=Tt-S8,h=s/2,Q4=h*h*3.14/4,t=h*h/2,C=Q4-t,half=h*h*3.14/2,up=half-C,B=S8-up,tot=A+B+C;
 return {prompt:`<p>한 변의 길이가 ${s} cm인 정사각형 안에 정사각형의 한 변을 지름으로 하는 반원과, 정사각형의 한 변을 반지름으로 하는 부채꼴을 그렸습니다. 색칠한 부분의 넓이는 몇 cm²일까요? (원주율: 3.14)</p>`+figExploration(),
  answer:`${n(tot)} cm²`,
  solution:ol([`부채꼴의 중심은 정사각형의 오른쪽 아래 꼭짓점이고, 대각선이 이 점을 지나므로 부채꼴은 중심각이 45°인 부채꼴 2개로 나뉩니다. 그 하나의 넓이는 ${s}×${s}×3.14÷8=${n(S8)}(cm²)입니다.`,
   `왼쪽 색칠한 부분은 대각선 아래쪽 삼각형에서 45° 부채꼴을 뺀 것이므로 ${s}×${s}÷2−${n(S8)}=${n(Tt)}−${n(S8)}=${n(A)}(cm²)입니다.`,
   `반원의 반지름은 ${h} cm이고, 대각선은 반원 위의 점인 정사각형의 한가운데를 지납니다. 오른쪽 아래 색칠한 부분은 반지름 ${h} cm인 사분원에서 직각삼각형을 뺀 것이므로 ${h}×${h}×3.14÷4−${h}×${h}÷2=${n(Q4)}−${n(t)}=${n(C)}(cm²)입니다.`,
   `반원의 넓이는 ${h}×${h}×3.14÷2=${n(half)}(cm²)이므로 대각선 위쪽에 있는 반원 부분은 ${n(half)}−${n(C)}=${n(up)}(cm²)입니다. 가운데 색칠한 부분은 위쪽 45° 부채꼴에서 이것을 뺀 ${n(S8)}−${n(up)}=${n(B)}(cm²)입니다.`,
   `색칠한 부분의 넓이는 ${n(A)}+${n(B)}+${n(C)}=${n(tot)}(cm²)입니다.`])};}
function example1(r){const sq=4*r*r,c=r*r*3.1,st=sq-c;
 return {prompt:`<p>다음 그림에서 호 ㄱㄴ, 호 ㄴㄷ, 호 ㄷㄹ, 호 ㄹㄱ은 모두 반지름이 ${r} cm인 원의 둘레의 일부이고, 네 호의 길이는 모두 같습니다. 색칠한 부분의 넓이를 구하세요. (원주율: 3.1)</p><p>※ 조건 보충: 네 호는 각각 원의 둘레의 ${ff(1,4)}(중심각 90°)이고, 오른쪽 원은 호 ㄴㄷ을 둘레의 일부로 하는 원입니다.</p>`+figEx1(),
  answer:`${n(sq)} cm²`,
  solution:ol([`네 호는 반지름이 ${r} cm이고 중심각이 90°입니다. 이웃한 두 호는 점 ㄱ, ㄴ, ㄷ, ㄹ에서 만나므로 네 호의 중심을 이으면 한 변이 ${r}+${r}=${2*r}(cm)인 정사각형이 됩니다.`,
   `가운데 색칠한 모양은 이 정사각형에서 꼭짓점마다 반지름 ${r} cm인 사분원 4개를 뺀 것입니다. 사분원 4개의 넓이는 원 1개의 넓이와 같으므로 ${2*r}×${2*r}−${r}×${r}×3.1=${n(sq)}−${n(c)}=${n(st)}(cm²)입니다.`,
   `오른쪽 원의 넓이는 ${r}×${r}×3.1=${n(c)}(cm²)입니다.`,
   `색칠한 부분의 넓이는 ${n(st)}+${n(c)}=${n(sq)}(cm²)입니다.`]),
  assumption:'네 호는 각각 원의 둘레의 1/4이고, 오른쪽 원은 호 ㄴㄷ을 둘레의 일부로 하는 원으로 봅니다.'};}
function example2(r){const v=r*r*3.1/2;
 return {prompt:`<p>다음 도형은 반지름이 ${r} cm인 원 3개를 겹쳐서 그린 것입니다. 점 ㄱ, ㄴ, ㄷ이 각 원의 중심일 때, 색칠한 부분의 넓이를 구하세요. (원주율: 3.1)</p>`+figEx2(),
  answer:`${n(v)} cm²`,
  solution:ol([`각 원은 다른 두 원의 중심을 지나므로 선분 ㄱㄴ, ㄴㄷ, ㄷㄱ의 길이는 모두 반지름 ${r} cm이고, 이웃한 두 원이 만나는 점과 두 중심을 이은 삼각형도 모두 한 변이 ${r} cm인 정삼각형입니다.`,
   `색칠한 한 조각은 이런 정삼각형에 바깥쪽으로 볼록한 활꼴 2개를 붙이고 안쪽으로 오목한 활꼴 1개를 뺀 모양입니다. 세 활꼴은 모두 반지름 ${r} cm, 중심각 60°인 부채꼴에서 같은 정삼각형을 뺀 것이라 크기가 같습니다.`,
   `따라서 한 조각의 넓이는 정삼각형 1개와 활꼴 1개의 넓이의 합, 곧 반지름 ${r} cm이고 중심각이 60°인 부채꼴의 넓이와 같습니다.`,
   `색칠한 조각은 3개이므로 넓이의 합은 중심각이 60°×3=180°인 부채꼴, 곧 반원의 넓이와 같습니다. ${r}×${r}×3.1÷2=${n(v)}(cm²)입니다.`])};}
function example3(R,r){const a=R*R*3.1,b=r*r*3.1,v=(a-b)/6;
 return {prompt:`<p>다음 그림은 삼각형 ㄱㄴㄷ을 점 ㄷ을 중심으로 하여 60°만큼 돌린 것을 나타낸 것입니다. 색칠한 부분의 넓이를 구하세요. (원주율: 3.1)</p>`+figEx3(R,r),
  answer:`${n(v)} cm²`,
  solution:ol([`돌린 삼각형은 처음 삼각형 ㄱㄴㄷ과 모양과 크기가 같으므로 넓이가 같습니다.`,
   `색칠한 부분은 (반지름 ${R} cm, 중심각 60°인 부채꼴)+(돌린 삼각형)−(처음 삼각형 ㄱㄴㄷ)−(반지름 ${r} cm, 중심각 60°인 부채꼴)입니다.`,
   `두 삼각형의 넓이는 서로 없어지므로 색칠한 부분의 넓이는 두 부채꼴의 넓이의 차와 같습니다.`,
   `두 부채꼴은 모두 중심각이 60°로 원의 ${ff(1,6)}이므로 (${R}×${R}×3.1−${r}×${r}×3.1)÷6=(${n(a)}−${n(b)})÷6=${n(a-b)}÷6=${n(v)}(cm²)입니다.`])};}
function example4(r,al,be){const v=r*r*3*be/360;
 return {prompt:`<p>다음 그림에서 색칠한 부분의 넓이를 구하세요. (원주율: 3)</p><p>※ 조건 보충: 곡선 ㄷㄱ은 점 ㅂ을 중심으로 하는 원의 일부이고, 선분 ㄴㄹ과 선분 ㄱㅁ은 모두 선분 ㄷㅂ에 수직입니다.</p>`+figEx4(r,al,be),
  answer:`${n(v)} cm²`,
  solution:ol([`점 ㄴ과 점 ㄱ은 점 ㅂ을 중심으로 하는 원 위에 있으므로 선분 ㄴㅂ과 선분 ㄱㅂ의 길이는 모두 ${r} cm입니다.`,
   `삼각형 ㄴㄹㅂ에서 각 ㄴㅂㄹ은 ${al}°입니다. 삼각형 ㄱㅁㅂ에서 각 ㄱㅂㅁ은 ${al}°+${be}°=${al+be}°이므로 각 ㅂㄱㅁ은 180°−90°−${al+be}°=${90-al-be}°입니다.`,
   `두 직각삼각형 ㄴㄹㅂ과 ㅂㅁㄱ은 세 각의 크기가 같고 가장 긴 변의 길이가 ${r} cm로 같으므로 합동이고, 넓이가 같습니다.`,
   `색칠한 부분은 (삼각형 ㄴㄹㅂ)+(부채꼴 ㄴㅂㄱ)−(삼각형 ㄱㅁㅂ)이므로 부채꼴 ㄴㅂㄱ의 넓이와 같습니다.`,
   `부채꼴 ㄴㅂㄱ의 중심각은 ${be}°이므로 넓이는 ${r}×${r}×3×${fr(be,360)}=${n(v)}(cm²)입니다.`]),
  assumption:'곡선 ㄷㄱ은 점 ㅂ을 중심으로 하는 원의 일부이고, 선분 ㄴㄹ과 선분 ㄱㅁ은 모두 선분 ㄷㅂ에 수직인 것으로 봅니다.'};}
function mission1(s){const h=s/2,dia=s*s/2,semi=h*h*3.1/2,qu=h*h*3.1/4,out=2*(semi-qu),dout=dia-2*qu,tot=out+dout;
 return {prompt:`<p>다음 그림에서 색칠한 부분의 넓이를 구하세요. (원주율: 3.1)</p>`+figM1(s),
  answer:`${n(tot)} cm²`,
  solution:ol([`두 반원의 반지름은 ${s}÷2=${h}(cm)이고, 정사각형의 각 변의 가운데 점을 이은 마름모(정사각형)의 넓이는 ${s}×${s}÷2=${n(dia)}(cm²)입니다.`,
   `마름모의 위·아래 꼭짓점은 반원의 중심이고 그 각이 90°이므로, 반원 하나 중 마름모 안에 들어가는 부분은 반지름 ${h} cm인 사분원입니다. 사분원 하나의 넓이는 ${h}×${h}×3.1÷4=${n(qu)}(cm²)입니다.`,
   `반원 하나의 넓이는 ${h}×${h}×3.1÷2=${n(semi)}(cm²)이므로, 두 반원에서 마름모 밖에 있는 색칠한 부분은 (${n(semi)}−${n(qu)})×2=${n(out)}(cm²)입니다.`,
   `마름모에서 두 반원 밖에 있는 색칠한 부분은 ${n(dia)}−${n(qu)}×2=${n(dout)}(cm²)입니다.`,
   `색칠한 부분의 넓이는 ${n(out)}+${n(dout)}=${n(tot)}(cm²)입니다.`])};}
function mission2(s){const h=s/2,tri=h*h/2,c=h*h*3.1,dia=s*s/2,seg=(c-dia)/4,tot=2*tri+2*seg;
 return {prompt:`<p>다음 그림과 같이 한 변의 길이가 ${s} cm인 정사각형 안에 원과 마름모를 그렸습니다. 색칠한 부분의 넓이를 구하세요. (원주율: 3.1)</p>`+figM2(s),
  answer:`${n(tot)} cm²`,
  solution:ol([`원의 반지름은 ${s}÷2=${h}(cm)이고, 마름모의 두 대각선은 원의 지름(${s} cm)으로 원의 중심에서 수직으로 만납니다.`,
   `마름모는 두 대각선에 의해 넓이가 ${h}×${h}÷2=${n(tri)}(cm²)인 직각삼각형 4개로 나뉘므로, 색칠한 삼각형 2개의 넓이는 ${n(tri)}×2=${n(2*tri)}(cm²)입니다.`,
   `원에서 마름모를 뺀 부분은 크기가 같은 활꼴 4개입니다. 활꼴 하나의 넓이는 (${h}×${h}×3.1−${s}×${s}÷2)÷4=(${n(c)}−${n(dia)})÷4=${n(seg)}(cm²)입니다.`,
   `색칠한 활꼴 2개의 넓이는 ${n(seg)}×2=${n(2*seg)}(cm²)입니다.`,
   `색칠한 부분의 넓이는 ${n(2*tri)}+${n(2*seg)}=${n(tot)}(cm²)입니다.`])};}
function mission3(s){const h=s/2,S8=s*s*3.1/8,half=h*h*3.1/2,seg=h*h*3.1/4-h*h/2,w1=S8-(half-seg),rr=s*s/2-S8,white=seg+w1+rr,tot=s*s-white;
 return {prompt:`<p>다음은 정사각형 안에 원의 일부분을 그린 것입니다. 색칠한 부분의 넓이는 몇 cm²일까요? (원주율: 3.1)</p>`+figM3(s),
  answer:`${n(tot)} cm²`,
  solution:ol([`큰 부채꼴은 정사각형의 왼쪽 아래 꼭짓점을 중심으로 하고 반지름이 ${s} cm, 반원은 왼쪽 변을 지름으로 하고 반지름이 ${h} cm입니다.`,
   `대각선은 큰 부채꼴을 중심각이 45°인 부채꼴 2개로 나누고, 그 하나의 넓이는 ${s}×${s}×3.1÷8=${n(S8)}(cm²)입니다. 반원의 넓이도 ${h}×${h}×3.1÷2=${n(half)}(cm²)입니다.`,
   `대각선 아래쪽 반원 부분(색칠하지 않은 활꼴)은 반지름 ${h} cm인 사분원에서 직각삼각형을 뺀 것이므로 ${h}×${h}×3.1÷4−${h}×${h}÷2=${n(seg)}(cm²)입니다.`,
   `대각선 위쪽에서 반원과 큰 부채꼴 사이의 색칠하지 않은 부분은 ${n(S8)}−(${n(half)}−${n(seg)})=${n(w1)}(cm²)입니다.`,
   `대각선 아래쪽에서 큰 부채꼴 밖의 색칠하지 않은 부분은 ${s}×${s}÷2−${n(S8)}=${n(rr)}(cm²)입니다.`,
   `색칠하지 않은 부분은 모두 ${n(seg)}+${n(w1)}+${n(rr)}=${n(white)}(cm²)이므로, 색칠한 부분의 넓이는 ${s}×${s}−${n(white)}=${n(tot)}(cm²)입니다.`])};}
function mission4(R){const big=R*R*3.1/2,sm=(R/2)*(R/2)*3.1/2,one=big-sm,tot=2*one;
 return {prompt:`<p>다음 도형은 직사각형 안에 크고 작은 반원을 그려서 만든 도형입니다. 색칠한 부분의 넓이를 구하세요. (원주율: 3.1)</p>`+figM4(R),
  answer:`${n(tot)} cm²`,
  solution:ol([`큰 반원은 직사각형의 위 또는 아래 변에 닿으므로 반지름은 세로의 반인 ${2*R}÷2=${R}(cm)이고, 지름은 ${2*R} cm입니다.`,
   `위와 아래의 큰 반원은 가로로 ${3*R}−${2*R}=${R}(cm)만큼 어긋나 있고, 작은 반원의 지름이 이 길이와 같으므로 작은 반원의 반지름은 ${R}÷2=${n(R/2)}(cm)입니다.`,
   `위쪽 색칠한 부분은 큰 반원에서 작은 반원을 뺀 것이므로 ${R}×${R}×3.1÷2−${n(R/2)}×${n(R/2)}×3.1÷2=${n(big)}−${n(sm)}=${n(one)}(cm²)입니다.`,
   `아래쪽 색칠한 부분도 같은 모양이므로 색칠한 부분의 넓이는 ${n(one)}×2=${n(tot)}(cm²)입니다.`])};}
function mission5(R){const r=R/2,lens=(r*r*3.1/4-r*r/2)*2,l4=lens*4,big=R*R*3.1,smalls=r*r*3.1*4,cover=smalls-l4,outer=big-cover,tot=l4+outer;
 return {prompt:`<p>다음 그림에서 반지름이 ${R} cm인 큰 원 안에 합동인 작은 원 4개가 겹쳐 있습니다. 색칠한 부분의 넓이를 구하세요. (원주율: 3.1)</p>`+figM5(),
  answer:`${n(tot)} cm²`,
  solution:ol([`작은 원은 큰 원의 중심과 큰 원의 둘레를 지나므로 반지름은 ${R}÷2=${n(r)}(cm)입니다.`,
   `이웃한 두 작은 원이 겹친 부분 하나는 반지름 ${n(r)} cm인 사분원에서 직각삼각형을 뺀 것 2개이므로 (${n(r)}×${n(r)}×3.1÷4−${n(r)}×${n(r)}÷2)×2=${n(lens)}(cm²)이고, 4개는 ${n(lens)}×4=${n(l4)}(cm²)입니다.`,
   `작은 원 4개의 넓이의 합은 ${n(r)}×${n(r)}×3.1×4=${n(smalls)}(cm²)이고, 겹친 부분은 두 번 세었으므로 작은 원들이 덮는 넓이는 ${n(smalls)}−${n(l4)}=${n(cover)}(cm²)입니다.`,
   `큰 원의 넓이는 ${R}×${R}×3.1=${n(big)}(cm²)이므로, 작은 원 밖의 색칠한 부분은 ${n(big)}−${n(cover)}=${n(outer)}(cm²)입니다.`,
   `색칠한 부분의 넓이는 ${n(l4)}+${n(outer)}=${n(tot)}(cm²)입니다.`])};}
function mission6(r,be,ga){const v=r*r*3.1*be/360,a1=90-ga,a2=a1+be;
 return {prompt:`<p>다음 그림과 같이 반지름이 ${r} cm인 두 개의 부채꼴을 붙여 놓았습니다. 색칠한 부분의 넓이는 몇 cm²일까요? (원주율: 3.1)</p>`+figM6(r,be,ga),
  answer:`${n(v)} cm²`,
  solution:ol([`선분 ㄴㄱ과 선분 ㄴㄹ은 부채꼴의 반지름이므로 길이가 모두 ${r} cm입니다.`,
   `삼각형 ㄹㄴㅂ에서 각 ㄹㄴㅂ은 180°−90°−${ga}°=${a1}°이므로 각 ㄱㄴㅁ은 ${a1}°+${be}°=${a2}°이고, 삼각형 ㄱㄴㅁ에서 각 ㄴㄱㅁ은 180°−90°−${a2}°=${90-a2}°입니다.`,
   `두 직각삼각형 ㄴㄱㅁ과 ㄹㄴㅂ은 세 각의 크기가 같고 가장 긴 변의 길이가 ${r} cm로 같으므로 합동이고, 넓이가 같습니다.`,
   `색칠한 부분은 (삼각형 ㄹㄴㅂ)+(부채꼴 ㄱㄴㄹ)−(삼각형 ㄱㄴㅁ)이므로 부채꼴 ㄱㄴㄹ의 넓이와 같습니다.`,
   `부채꼴 ㄱㄴㄹ의 중심각은 ${be}°이므로 넓이는 ${r}×${r}×3.1×${fr(be,360)}=${n(v)}(cm²)입니다.`])};}

const mk=(fn,args)=>args.map(a=>fn(...a));
const ITEMS={
 '6-2-u5-e4-exploration':{key:'source62U5E4Exploration',pool:mk(exploration,[[12],[10],[16]])},
 '6-2-u5-e4-example-1':{key:'source62U5E4Example1',pool:mk(example1,[[10],[8],[12]]),answerAssumption:'네 호는 각각 원의 둘레의 1/4이고, 오른쪽 원은 호 ㄴㄷ을 둘레의 일부로 하는 원으로 봅니다.'},
 '6-2-u5-e4-example-2':{key:'source62U5E4Example2',pool:mk(example2,[[8],[6],[10]])},
 '6-2-u5-e4-example-3':{key:'source62U5E4Example3',pool:mk(example3,[[10,8],[14,10],[11,7]])},
 '6-2-u5-e4-example-4':{key:'source62U5E4Example4',pool:mk(example4,[[12,35,20],[10,30,30],[6,25,40]]),answerAssumption:'곡선 ㄷㄱ은 점 ㅂ을 중심으로 하는 원의 일부이고, 선분 ㄴㄹ과 선분 ㄱㅁ은 모두 선분 ㄷㅂ에 수직인 것으로 봅니다.'},
 '6-2-u5-e4-mission-1':{key:'source62U5E4Mission1',pool:mk(mission1,[[10],[12],[8]])},
 '6-2-u5-e4-mission-2':{key:'source62U5E4Mission2',pool:mk(mission2,[[10],[12],[8]])},
 '6-2-u5-e4-mission-3':{key:'source62U5E4Mission3',pool:mk(mission3,[[10],[12],[8]])},
 '6-2-u5-e4-mission-4':{key:'source62U5E4Mission4',pool:mk(mission4,[[10],[8],[12]])},
 '6-2-u5-e4-mission-5':{key:'source62U5E4Mission5',pool:mk(mission5,[[6],[10],[8]])},
 '6-2-u5-e4-mission-6':{key:'source62U5E4Mission6',pool:mk(mission6,[[10,18,54],[12,20,55],[10,36,63]])},
};
Object.values(ITEMS).forEach(it=>{it.resultContract='single-value';it.answerVisualRequired=false;});
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
