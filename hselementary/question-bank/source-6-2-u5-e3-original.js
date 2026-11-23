// 황소 6-2 5단원 개념탐구 3 (복잡한 도형의 넓이 ①) 원문 구조 유형. 원문과 같은 구조·같은 물음, 수만 바꾼 검증 변형 3개씩.
(function(root){'use strict';
const GROUP='6-2-u5-e3';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;};
const ol=steps=>'<ol>'+steps.map(s=>`<li>${s}</li>`).join('')+'</ol>';

// ---- 유리수(정확한 계산) ----
const Q=(n,d)=>{d=d===undefined?1:d;if(d<0){n=-n;d=-d;}const g=gcd(n,d)||1;return {n:n/g,d:d/g};};
const add=(a,b)=>Q(a.n*b.d+b.n*a.d,a.d*b.d);
const sub=(a,b)=>Q(a.n*b.d-b.n*a.d,a.d*b.d);
const mul=(...xs)=>xs.reduce((a,b)=>Q(a.n*b.n,a.d*b.d),Q(1));
const dv=(a,b)=>Q(a.n*b.d,a.d*b.n);
const isDec=d=>{while(d%2===0)d/=2;while(d%5===0)d/=5;return d===1;};
// 소수로 끝나는 수는 소수, 아니면 대분수/진분수(기약분수)
const S=q=>{if(q.d===1)return String(q.n);
 if(isDec(q.d)){let p=0,t=1;while(t%q.d!==0){t*=10;p++;}const v=String(q.n*(t/q.d)).padStart(p+1,'0');const fr=v.slice(-p).replace(/0+$/,'');return v.slice(0,-p)+(fr?'.'+fr:'');}
 const w=Math.floor(q.n/q.d),r=q.n%q.d;return w?mx(w,r,q.d):ff(r,q.d);};
const PI={'3':{q:Q(3),t:'3'},'3.1':{q:Q(31,10),t:'3.1'},'3.14':{q:Q(157,50),t:'3.14'},'22/7':{q:Q(22,7),t:mx(3,1,7)}};

// ---- 그림 도구 (모델 좌표: y 위쪽) ----
const LINE='fill:none;stroke:#222;stroke-width:1.4px;stroke-linejoin:round;stroke-linecap:round';
const DLINE='fill:none;stroke:#222;stroke-width:1.4px;stroke-dasharray:4 3';
const DIM='fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3';
const SHADE='fill:#cfcfcf;stroke:none';
const WHITE='fill:#fff;stroke:#222;stroke-width:1.4px';
const r1=v=>Math.round(v*10)/10;
const rad=a=>a*Math.PI/180;
const arc=(c,r,a0,a1)=>{const n=Math.max(8,Math.ceil(Math.abs(a1-a0)/3));const o=[];for(let i=0;i<=n;i++){const a=rad(a0+(a1-a0)*i/n);o.push([c[0]+r*Math.cos(a),c[1]+r*Math.sin(a)]);}return o;};
const ang=(c,p)=>Math.atan2(p[1]-c[1],p[0]-c[0])*180/Math.PI;
// 선분 PQ를 지름으로 하는 반원 호(점 away 반대쪽), P에서 Q로
const semiArc=(P,Q2,away)=>{const c=[(P[0]+Q2[0])/2,(P[1]+Q2[1])/2],r=Math.hypot(Q2[0]-P[0],Q2[1]-P[1])/2,a=ang(c,P);
 const m1=[c[0]+r*Math.cos(rad(a+90)),c[1]+r*Math.sin(rad(a+90))],m2=[c[0]+r*Math.cos(rad(a-90)),c[1]+r*Math.sin(rad(a-90))];
 const d=m=>Math.hypot(m[0]-away[0],m[1]-away[1]);return d(m1)>d(m2)?arc(c,r,a,a+180):arc(c,r,a,a-180);};
function Fig(k){
 const els=[],bb=[];const T=p=>[p[0]*k,-p[1]*k];
 const ds=(P,close)=>'M'+P.map(p=>r1(p[0])+' '+r1(p[1])).join(' L')+(close?' Z':'');
 const tw=s=>{let w=0;for(const ch of s)w+=/[ㄱ-힣]/.test(ch)?14:(ch===' '?4:(ch==="'"?4:7.6));return w;};
 const f={
  path(pts,style,close){const P=pts.map(T);P.forEach(q=>bb.push(q));els.push(`<path d="${ds(P,close)}" style="${style}"/>`);return f;},
  text(p,s,dx,dy){const q=T(p),x=q[0]+(dx||0),y=q[1]+(dy||0),w=tw(s);bb.push([x-w/2,y-9],[x+w/2,y+9]);
   els.push(`<text x="${r1(x)}" y="${r1(y)}" text-anchor="middle" dominant-baseline="central" style="font-size:14px;fill:#222">${s}</text>`);return f;},
  dot(p){const q=T(p);els.push(`<circle cx="${r1(q[0])}" cy="${r1(q[1])}" r="2.6" style="fill:#222"/>`);return f;},
  dim(A,B,side,label,off,t){off=off||11;t=t===undefined?0.5:t;const a=T(A),b=T(B),L=Math.hypot(b[0]-a[0],b[1]-a[1]);
   const n=[(b[1]-a[1])/L*side,-(b[0]-a[0])/L*side]; // 화면 좌표 법선
   const m=[(a[0]+b[0])/2,(a[1]+b[1])/2],c=[m[0]+n[0]*off*2,m[1]+n[1]*off*2];
   bb.push(a,b,[m[0]+n[0]*off,m[1]+n[1]*off]);
   els.push(`<path d="M${r1(a[0])} ${r1(a[1])} Q${r1(c[0])} ${r1(c[1])} ${r1(b[0])} ${r1(b[1])}" style="${DIM}"/>`);
   const u=1-t,pt=[u*u*a[0]+2*t*u*c[0]+t*t*b[0],u*u*a[1]+2*t*u*c[1]+t*t*b[1]]; // 치수 호 위의 점
   const w=tw(label),g=9+Math.abs(n[0])*w/2;const x=pt[0]+n[0]*g,y=pt[1]+n[1]*g;bb.push([x-w/2,y-9],[x+w/2,y+9]);
   els.push(`<text x="${r1(x)}" y="${r1(y)}" text-anchor="middle" dominant-baseline="central" style="font-size:13px;fill:#222">${label}</text>`);return f;},
  right(V,u1,u2,s){s=s||9;const q=T(V),d1=[u1[0],-u1[1]],d2=[u2[0],-u2[1]];
   const P=[[q[0]+d1[0]*s,q[1]+d1[1]*s],[q[0]+(d1[0]+d2[0])*s,q[1]+(d1[1]+d2[1])*s],[q[0]+d2[0]*s,q[1]+d2[1]*s]];
   els.push(`<path d="${ds(P,false)}" style="fill:none;stroke:#222;stroke-width:1px"/>`);return f;},
  angle(V,a0,a1,rp,label){const q=T(V),P=[];for(let i=0;i<=16;i++){const a=rad(a0+(a1-a0)*i/16);P.push([q[0]+rp*Math.cos(a),q[1]-rp*Math.sin(a)]);}
   els.push(`<path d="${ds(P,false)}" style="fill:none;stroke:#222;stroke-width:1px"/>`);
   const am=rad((a0+a1)/2),x=q[0]+(rp+15)*Math.cos(am),y=q[1]-(rp+15)*Math.sin(am);bb.push([x-14,y-9],[x+14,y+9]);
   els.push(`<text x="${r1(x)}" y="${r1(y)}" text-anchor="middle" dominant-baseline="central" style="font-size:13px;fill:#222">${label}</text>`);return f;},
  render(aria){const xs=bb.map(p=>p[0]),ys=bb.map(p=>p[1]);const x0=Math.min(...xs)-6,y0=Math.min(...ys)-6,w=Math.max(...xs)+6-x0,h=Math.max(...ys)+6-y0;
   return `<svg viewBox="${r1(x0)} ${r1(y0)} ${r1(w)} ${r1(h)}" role="img" aria-label="${aria}" style="width:100%;max-width:360px;height:auto;display:block;margin:8px auto;font-family:inherit">${els.join('')}</svg>`;}};
 return f;}
const cm2=q=>`${S(q)} cm²`;

// ---- 개념탐구: 정사각형 + 반원, 선분 ㄴㅁ·ㄴㄹ ----
function exploration(s){
 const h=s/2,N=[0,0],D=[s,0],R=[s,s],G=[0,s],O=[h,s],M=[h,s+h];
 const f=Fig(230/(1.5*s));
 f.path([N,M,...arc(O,h,90,0)],SHADE,true)
  .path([G,N,D,R],LINE,true).path(arc(O,h,0,180),LINE).path([N,M],LINE).path([N,R],LINE)
  .dot(M).dot(O)
  .text(G,'ㄱ',-12,0).text(N,'ㄴ',-10,10).text(D,'ㄷ',10,10).text(R,'ㄹ',12,0).text(M,'ㅁ',0,-12).text(O,'ㅇ',-3,14)
  .dim(N,D,-1,`${s} cm`);
 const pi=PI['3.1'],t1=Q(h*s,2),t2=Q(h*h,2),sec=dv(mul(Q(h*h),pi.q),Q(4)),tot=add(add(t1,t2),sec);
 const prompt=`<p>다음 그림은 정사각형과 반원을 붙여서 만든 도형입니다. 점 ㅁ이 호 ㄱㄹ의 길이를 반으로 나누는 점이고, 점 ㅇ이 반원의 중심일 때, 색칠한 부분의 넓이를 구하세요. (원주율: ${pi.t})</p>`
  +f.render('정사각형 위에 반원을 붙이고 점 ㄴ과 점 ㅁ, 점 ㄴ과 점 ㄹ을 이은 도형');
 const sol=ol([
  `풀이 기준: 그림처럼 반원은 정사각형 ㄱㄴㄷㄹ의 변 ㄱㄹ 위에 붙어 있고, 색칠한 부분은 선분 ㄴㅁ, 곡선 ㅁㄹ, 선분 ㄹㄴ으로 둘러싸인 부분으로 봅니다.`,
  `반원의 반지름은 ${s} ÷ 2 = ${h} cm입니다. 점 ㅁ은 호 ㄱㄹ의 한가운데 점이므로 선분 ㅇㅁ은 선분 ㄱㄹ과 수직이고 각 ㅁㅇㄹ은 90°입니다.`,
  `색칠한 부분을 삼각형 ㄴㅇㄹ, 삼각형 ㄴㅁㅇ, 부채꼴 ㅁㅇㄹ로 나누어 넓이를 구합니다.`,
  `삼각형 ㄴㅇㄹ은 밑변 ㅇㄹ이 ${h} cm, 높이가 ${s} cm이므로 넓이는 ${h} × ${s} ÷ 2 = ${S(t1)} cm²입니다.`,
  `삼각형 ㄴㅁㅇ은 밑변 ㅇㅁ이 ${h} cm이고, 높이는 점 ㄴ에서 선분 ㅇㅁ을 늘인 직선까지의 거리인 ${h} cm이므로 넓이는 ${h} × ${h} ÷ 2 = ${S(t2)} cm²입니다.`,
  `부채꼴 ㅁㅇㄹ은 반지름이 ${h} cm, 중심각이 90°이므로 넓이는 ${h} × ${h} × ${pi.t} ÷ 4 = ${S(sec)} cm²입니다.`,
  `색칠한 부분의 넓이는 ${S(t1)} + ${S(t2)} + ${S(sec)} = ${S(tot)} cm²입니다.`]);
 return {prompt,answer:cm2(tot),solution:sol};
}

// ---- 직각삼각형 세 변의 반원 (예제 1: 초승달 모양만, Mission 2: 삼각형도 색칠) ----
function lunes(a,b,c,piKey,triShaded){
 const N=[0,0],D=[c,0],G=[a*a/c,a*b/c],O=[c/2,0];
 const f=Fig(250/c);
 const big=(p,q)=>arc(O,c/2,ang(O,p),ang(O,q));
 const l1=[...semiArc(N,G,D),...big(G,N)], l2=[...semiArc(G,D,N),...arc(O,c/2,0,ang(O,G))];
 f.path(l1,SHADE,true).path(l2,SHADE,true);
 if(triShaded)f.path([N,D,G],SHADE,true);
 f.path(arc(O,c/2,0,180),LINE).path([N,D],LINE).path(semiArc(N,G,D),LINE).path(semiArc(G,D,N),LINE).path([N,G,D],LINE);
 const u=p=>{const L=Math.hypot(p[0]-G[0],p[1]-G[1]);return [(p[0]-G[0])/L,(p[1]-G[1])/L];};
 f.right(G,u(N),u(D));
 if(!triShaded)f.dot([G[0]/2,G[1]/2]).dot([(G[0]+c)/2,G[1]/2]).dot(O); // 예제 1 원문에만 중심 점 표시
 f.text(G,'ㄱ',-2,-14).text(N,'ㄴ',-12,8).text(D,'ㄷ',12,8)
  .dim(N,G,-1,`${a} cm`).dim(G,D,-1,`${b} cm`).dim(N,D,-1,`${c} cm`,13);
 const pi=PI[piKey],semi=r2=>dv(mul(r2,pi.q),Q(2)); // r2 = (지름÷2)²
 const ra=Q(a,2),rb=Q(b,2),rc=Q(c,2),sa=semi(mul(ra,ra)),sb=semi(mul(rb,rb)),sc=semi(mul(rc,rc)),sum=add(sa,sb),tri=Q(a*b,2);
 const st=(r,v)=>`${S(r)} × ${S(r)} × ${pi.t} ÷ 2 = ${S(v)}`;
 const q=triShaded?'색칠한 부분의 넓이를 구하세요.':'색칠한 부분의 넓이는 몇 cm²인가요?';
 const prompt=`<p>다음 그림은 삼각형 ㄱㄴㄷ의 세 변을 각각 지름으로 하는 반원을 그린 것입니다. ${q} (원주율: ${pi.t})</p>`
  +f.render('직각삼각형 ㄱㄴㄷ의 세 변을 지름으로 하는 반원을 그린 그림');
 const common=[
  `변 ㄱㄴ, 변 ㄱㄷ을 지름으로 하는 두 반원의 넓이는 각각 ${st(ra,sa)} (cm²), ${st(rb,sb)} (cm²)이고, 합은 ${S(sa)} + ${S(sb)} = ${S(sum)} cm²입니다.`,
  `변 ㄴㄷ을 지름으로 하는 큰 반원의 넓이는 ${st(rc,sc)} (cm²)이므로, 두 작은 반원의 넓이의 합과 같습니다.`];
 let sol,ans;
 if(!triShaded){ans=tri;sol=ol([
  `색칠한 부분의 넓이는 (삼각형 ㄱㄴㄷ의 넓이) + (두 작은 반원의 넓이) − (큰 반원의 넓이)입니다.`,...common,
  `따라서 색칠한 부분의 넓이는 삼각형 ㄱㄴㄷ의 넓이와 같으므로 ${a} × ${b} ÷ 2 = ${S(tri)} cm²입니다.`]);}
 else{ans=mul(tri,Q(2));sol=ol([
  `전체 도형은 삼각형 ㄱㄴㄷ과 두 작은 반원으로 이루어져 있고, 색칠하지 않은 부분은 큰 반원에서 삼각형 ㄱㄴㄷ을 뺀 부분입니다.`,...common,
  `삼각형 ㄱㄴㄷ의 넓이는 ${a} × ${b} ÷ 2 = ${S(tri)} cm²입니다.`,
  `색칠한 부분의 넓이는 (${S(tri)} + ${S(sum)}) − (${S(sc)} − ${S(tri)}) = ${S(ans)} cm²입니다.`]);}
 return {prompt,answer:cm2(ans),solution:sol};
}

// ---- 예제 2: 정사각형 안의 원·반원·사분원 ----
function square4(s){
 const r=s/4,f=Fig(230/s);
 const star=(x,y)=>[...arc([x+r,y+r],r,180,270),...arc([x+r,y-r],r,90,180),...arc([x-r,y-r],r,0,90),...arc([x-r,y+r],r,270,360)];
 [[r,3*r],[3*r,3*r],[r,r],[3*r,r]].forEach(([x,y])=>f.path(star(x,y),SHADE,true));
 f.path([[0,0],[s,0],[s,s],[0,s]],LINE,true);
 [r,2*r,3*r].forEach(y=>f.path([[0,y],[s,y]],LINE));f.path([[2*r,0],[2*r,s]],LINE);
 f.path(arc([2*r,2*r],r,0,360),LINE).path(arc([2*r,s],r,180,360),LINE).path(arc([2*r,0],r,0,180),LINE)
  .path(arc([0,2*r],r,-90,90),LINE).path(arc([s,2*r],r,90,270),LINE)
  .path(arc([0,0],r,0,90),LINE).path(arc([s,0],r,90,180),LINE).path(arc([s,s],r,180,270),LINE).path(arc([0,s],r,270,360),LINE)
  .dim([0,s],[s,s],1,`${s} cm`).dim([0,0],[0,s],1,`${s} cm`);
 const pi=PI['22/7'],sq=Q(4*r*r),c=mul(Q(r*r),pi.q),one=sub(sq,c),tot=mul(one,Q(4));
 const prompt=`<p>다음 그림은 한 변의 길이가 ${s} cm인 정사각형의 안쪽에 원, 반원, 사분원을 그린 것입니다. 색칠한 부분의 넓이를 구하세요. (원주율: ${pi.t})</p>`
  +f.render('정사각형 안에 원, 반원, 사분원을 그리고 그 사이 네 곳을 색칠한 그림');
 const sol=ol([
  `풀이 기준: 그림의 원, 반원, 사분원의 반지름은 모두 같다고 봅니다.`,
  `정사각형의 한 변 ${s} cm에 원의 반지름이 4개 들어가므로 반지름은 ${s} ÷ 4 = ${r} cm입니다.`,
  `색칠한 부분 한 개는 한 변이 ${2*r} cm인 정사각형에서 반지름이 ${r} cm인 사분원 4개, 곧 원 1개를 뺀 것입니다.`,
  `색칠한 부분 한 개의 넓이는 ${2*r} × ${2*r} − ${r} × ${r} × ${pi.t} = ${S(sq)} − ${S(c)} = ${S(one)} cm²입니다.`,
  `색칠한 부분은 4개이므로 넓이는 ${S(one)} × 4 = ${S(tot)} cm²입니다.`]);
 return {prompt,answer:cm2(tot),solution:sol};
}

// ---- 예제 3: 직각삼각형을 꼭짓점 ㄷ을 중심으로 돌리기 ----
function rotateTri(a,b,c,th){
 const N=[0,0],D=[b,0],G=[0,a];
 const rot=p=>{const t=rad(-th),x=p[0]-D[0],y=p[1]-D[1];return [D[0]+x*Math.cos(t)-y*Math.sin(t),D[1]+x*Math.sin(t)+y*Math.cos(t)];};
 const G2=rot(G),N2=rot(N),aG=ang(D,G);
 const f=Fig(220/c);
 f.path([G,...arc(D,c,aG,aG-th),N2,...arc(D,b,180-th,180)],SHADE,true)
  .path([G,N,D],LINE,true).path([G2,N2,D],LINE,true).path(arc(D,c,aG,aG-th),LINE).path(arc(D,b,180-th,180),LINE)
  .right(N,[0,1],[1,0]);
 const u=(p,q)=>{const L=Math.hypot(q[0]-p[0],q[1]-p[1]);return [(q[0]-p[0])/L,(q[1]-p[1])/L];};
 f.right(N2,u(N2,G2),u(N2,D))
  .text(G,'ㄱ',-12,-6).text(N,'ㄴ',-10,10).text(D,'ㄷ',12,8)
  .dim(N,G,1,`${a} cm`).dim(N,D,-1,`${b} cm`).dim(G,D,-1,`${c} cm`,10,0.72);
 const pi=PI['3'],big=mul(Q(c*c),pi.q,Q(th,360)),sm=mul(Q(b*b),pi.q,Q(th,360)),ans=sub(big,sm);
 const prompt=`<p>다음 그림은 삼각형 ㄱㄴㄷ을 점 ㄷ을 중심으로 하여 시계 방향으로 ${th}°만큼 돌린 것입니다. 색칠한 부분의 넓이를 구하세요. (원주율: ${pi.t})</p>`
  +f.render(`직각삼각형 ㄱㄴㄷ을 점 ㄷ을 중심으로 ${th}도 돌린 그림`);
 const sol=ol([
  `점 ㄱ, 점 ㄴ이 옮겨 간 점을 각각 ㄱ', ㄴ'이라고 하면 색칠한 부분의 넓이는 (부채꼴 ㄱㄷㄱ'의 넓이) + (삼각형 ㄱ'ㄴ'ㄷ의 넓이) − (삼각형 ㄱㄴㄷ의 넓이) − (부채꼴 ㄴㄷㄴ'의 넓이)입니다.`,
  `삼각형 ㄱ'ㄴ'ㄷ은 삼각형 ㄱㄴㄷ을 돌린 것이므로 두 삼각형의 넓이는 같습니다. 따라서 색칠한 부분의 넓이는 (부채꼴 ㄱㄷㄱ'의 넓이) − (부채꼴 ㄴㄷㄴ'의 넓이)입니다.`,
  `부채꼴 ㄱㄷㄱ'은 반지름이 ${c} cm, 중심각이 ${th}°이므로 넓이는 ${c} × ${c} × ${pi.t} × ${ff(th,360)} = ${S(big)} cm²입니다.`,
  `부채꼴 ㄴㄷㄴ'은 반지름이 ${b} cm, 중심각이 ${th}°이므로 넓이는 ${b} × ${b} × ${pi.t} × ${ff(th,360)} = ${S(sm)} cm²입니다.`,
  `색칠한 부분의 넓이는 ${S(big)} − ${S(sm)} = ${S(ans)} cm²입니다.`]);
 return {prompt,answer:cm2(ans),solution:sol};
}

// ---- 예제 4: 직사각형과 두 사분원(부채꼴) ----
function twoSectors(w,h){
 const A=[0,0],B=[w,0],C=[w,h],D=[0,h],y2=h-Math.sqrt(h*h-w*w),phi=360-Math.acos(w/h)*180/Math.PI;
 const f=Fig(240/h);
 f.path([...arc(D,h,270,phi),[w,w],...arc(B,w,90,180)],SHADE,true)
  .path([...arc(D,h,phi,360),[w,h]],SHADE,true)
  .path([A,D,[h,h]],LINE).path([B,A],LINE).path([B,[w,y2]],LINE).path([[w,y2],[w,w]],DLINE).path([[w,w],C],LINE)
  .path(arc(D,h,270,360),LINE).path(arc(B,w,90,180),LINE)
  .right(A,[1,0],[0,1]).right(B,[-1,0],[0,1]).right(C,[-1,0],[0,-1]).right(D,[1,0],[0,-1])
  .dim(A,D,1,`${h} cm`).dim(A,B,-1,`${w} cm`);
 const pi=PI['3.14'],sh=dv(mul(Q(h*h),pi.q),Q(4)),sw=dv(mul(Q(w*w),pi.q),Q(4)),rect=Q(w*h),ans=sub(add(sh,sw),rect);
 const prompt=`<p>다음 그림은 두 부채꼴과 직사각형을 겹쳐 놓은 것입니다. 색칠한 부분의 넓이를 구하세요. (원주율: ${pi.t})</p>`
  +f.render('직사각형과 두 부채꼴을 겹쳐 놓은 그림');
 const sol=ol([
  `두 부채꼴의 넓이를 더하면 직사각형 안의 색칠하지 않은 부분은 한 번, 두 부채꼴이 겹친 부분은 두 번, 직사각형 밖으로 나간 부분은 한 번 들어갑니다. 여기서 직사각형의 넓이를 빼면 색칠한 부분만 남습니다.`,
  `큰 부채꼴은 반지름이 ${h} cm, 중심각이 90°이므로 넓이는 ${h} × ${h} × ${pi.t} ÷ 4 = ${S(sh)} cm²입니다.`,
  `작은 부채꼴은 반지름이 ${w} cm, 중심각이 90°이므로 넓이는 ${w} × ${w} × ${pi.t} ÷ 4 = ${S(sw)} cm²입니다.`,
  `직사각형의 넓이는 ${w} × ${h} = ${S(rect)} cm²입니다.`,
  `색칠한 부분의 넓이는 ${S(sh)} + ${S(sw)} − ${S(rect)} = ${S(ans)} cm²입니다.`]);
 return {prompt,answer:cm2(ans),solution:sol};
}

// ---- Mission 1: 사다리꼴 안의 두 부채꼴 ----
function trapezoid(r){
 const N=[0,0],D=[2*r,0],R=[2*r,r],G=[r,r],M=[r,0];
 const f=Fig(260/(2*r));
 f.path([G,R,...arc(D,r,90,180),...arc(N,r,0,45)],SHADE,true)
  .path([G,N,D,R],LINE,true).path(arc(D,r,90,180),LINE).path(arc(N,r,0,45),LINE).path([G,M],DLINE)
  .right(D,[-1,0],[0,1]).right(R,[-1,0],[0,-1])
  .text(G,'ㄱ',-8,-12).text(N,'ㄴ',-10,8).text(D,'ㄷ',12,8).text(R,'ㄹ',12,-8)
  .dim(G,R,1,`${r} cm`).dim(D,R,-1,`${r} cm`).dim(N,M,-1,`${r} cm`).dim(M,D,-1,`${r} cm`);
 const pi=PI['22/7'],trap=Q((r+2*r)*r,2),s45=mul(Q(r*r),pi.q,Q(45,360)),s90=dv(mul(Q(r*r),pi.q),Q(4)),ans=sub(sub(trap,s45),s90);
 const prompt=`<p>다음 그림과 같이 사다리꼴 ㄱㄴㄷㄹ 안에 반지름이 ${r} cm인 부채꼴을 그렸습니다. 색칠한 부분의 넓이를 구하세요. (원주율: ${pi.t})</p>`
  +f.render('사다리꼴 ㄱㄴㄷㄹ 안에 점 ㄴ과 점 ㄷ을 중심으로 하는 부채꼴을 그린 그림');
 const sol=ol([
  `사다리꼴 ㄱㄴㄷㄹ의 넓이는 (${r} + ${2*r}) × ${r} ÷ 2 = ${S(trap)} cm²입니다.`,
  `점 ㄱ에서 변 ㄴㄷ에 수직인 선분을 그으면 길이는 변 ㄹㄷ과 같은 ${r} cm이고, 변 ㄴㄷ과 만나는 점은 점 ㄴ에서 ${2*r} − ${r} = ${r} cm 떨어져 있습니다. 직각을 낀 두 변의 길이가 같은 직각삼각형이 생기므로 각 ㄱㄴㄷ은 45°입니다.`,
  `점 ㄴ을 중심으로 하는 부채꼴은 반지름이 ${r} cm, 중심각이 45°이므로 넓이는 ${r} × ${r} × ${pi.t} × ${ff(45,360)} = ${S(s45)} cm²입니다.`,
  `점 ㄷ을 중심으로 하는 부채꼴은 반지름이 ${r} cm, 중심각이 90°이므로 넓이는 ${r} × ${r} × ${pi.t} ÷ 4 = ${S(s90)} cm²입니다.`,
  `색칠한 부분의 넓이는 ${S(trap)} − ${S(s45)} − ${S(s90)} = ${S(ans)} cm²입니다.`]);
 return {prompt,answer:cm2(ans),solution:sol};
}

// ---- Mission 3: 원 3개가 꼭 맞게 들어간 직사각형 ----
function threeCircles(P){
 const d=P/8,r=d/2,f=Fig(300/(3*d));
 f.path([[0,0],[3*d,0],[3*d,d],[0,d]],SHADE,true).path([[0,0],[3*d,0],[3*d,d],[0,d]],LINE,true);
 [r,3*r,5*r].forEach(x=>f.path(arc([x,r],r,0,360),WHITE,true));
 const pi=PI['22/7'],rect=Q(3*d*d),circ=mul(Q(r*r),pi.q,Q(3)),ans=sub(rect,circ);
 const prompt=`<p>다음 그림에서 직사각형의 둘레가 ${P} cm일 때, 색칠한 부분의 넓이는 몇 cm²인가요? (원주율: ${ff(22,7)})</p>`
  +f.render('직사각형 안에 원 3개가 나란히 들어 있고 원 바깥을 색칠한 그림');
 const sol=ol([
  `풀이 기준: 그림처럼 크기가 같은 원 3개가 서로 맞닿고, 직사각형의 변에 꼭 맞게 들어 있다고 봅니다.`,
  `직사각형의 가로는 원의 지름의 3배, 세로는 원의 지름과 같으므로 둘레는 원의 지름의 (3 + 1) × 2 = 8배입니다.`,
  `원의 지름은 ${P} ÷ 8 = ${d} cm이고, 반지름은 ${d} ÷ 2 = ${r} cm입니다.`,
  `직사각형의 넓이는 ${3*d} × ${d} = ${S(rect)} cm²입니다.`,
  `원 3개의 넓이는 ${r} × ${r} × ${ff(22,7)} × 3 = ${S(circ)} cm²입니다.`,
  `색칠한 부분의 넓이는 ${S(rect)} − ${S(circ)} = ${S(ans)} cm²입니다.`]);
 return {prompt,answer:cm2(ans),solution:sol};
}

// ---- Mission 4: 정사각형 + 반원, 선분 ㄱㅁ·ㅂㅁ ----
function squareSemi(s){
 const h=s/2,G=[0,s],N=[0,0],D=[s,0],R=[s,s],O=[s,h],M=[s+h,h],B=[h,0];
 const f=Fig(250/(1.5*s));
 f.path([G,R,...arc(O,h,90,0)],SHADE,true).path([B,D,...arc(O,h,270,360)],SHADE,true)
  .path([R,G,N,D],LINE).path([R,D],LINE).path(arc(O,h,90,-90),LINE).path([G,M],LINE).path([B,M],LINE)
  .text(G,'ㄱ',-10,-8).text(N,'ㄴ',-10,8).text(D,'ㄷ',0,13).text(R,'ㄹ',0,-13).text(M,'ㅁ',13,0).text(B,'ㅂ',0,13)
  .dim(N,G,1,`${s} cm`);
 const pi=PI['3.1'],q=dv(mul(Q(h*h),pi.q),Q(4)),rt=Q(h*h,2),seg=sub(q,rt),t1=Q(s*h,2),t2=Q(h*h,2),ans=add(add(t1,t2),mul(seg,Q(2)));
 const prompt=`<p>다음 그림은 정사각형과 반원을 이어 붙여서 만든 도형입니다. 곡선 ㄹㅁ과 곡선 ㅁㄷ의 길이가 같고, 선분 ㄴㅂ과 선분 ㅂㄷ의 길이가 같을 때 색칠한 부분의 넓이를 구하세요. (원주율: ${pi.t})</p>`
  +f.render('정사각형 ㄱㄴㄷㄹ의 변 ㄹㄷ에 반원을 붙이고 선분 ㄱㅁ, 선분 ㅂㅁ을 그은 그림');
 const sol=ol([
  `반원의 반지름은 ${s} ÷ 2 = ${h} cm이고, 점 ㅁ은 반원의 호의 한가운데 점이므로 점 ㅁ은 선분 ㄹㄷ에서 ${h} cm 떨어져 있고, 선 ㄱㄹ과 선 ㄴㄷ에서 각각 ${h} cm 떨어져 있습니다.`,
  `선분 ㄹㅁ과 곡선 ㄹㅁ 사이의 넓이는 반지름이 ${h} cm인 사분원에서 직각을 낀 두 변이 ${h} cm인 삼각형을 뺀 것이므로 ${h} × ${h} × ${pi.t} ÷ 4 − ${h} × ${h} ÷ 2 = ${S(q)} − ${S(rt)} = ${S(seg)} cm²입니다. 선분 ㅁㄷ과 곡선 ㅁㄷ 사이의 넓이도 ${S(seg)} cm²입니다.`,
  `삼각형 ㄱㄹㅁ은 밑변 ㄱㄹ이 ${s} cm, 높이가 ${h} cm이므로 넓이는 ${s} × ${h} ÷ 2 = ${S(t1)} cm²입니다.`,
  `선분 ㅂㄷ은 ${s} ÷ 2 = ${h} cm이므로 삼각형 ㅂㄷㅁ의 넓이는 ${h} × ${h} ÷ 2 = ${S(t2)} cm²입니다.`,
  `색칠한 부분의 넓이는 ${S(t1)} + ${S(seg)} + ${S(t2)} + ${S(seg)} = ${S(ans)} cm²입니다.`]);
 return {prompt,answer:cm2(ans),solution:sol};
}

// ---- Mission 5: 직사각형을 점 ㄷ을 중심으로 90° 돌리기 ----
function rotateRect(a,b,c){
 const N=[0,0],D=[a,0],R=[a,b],G=[0,b],G2=[a+b,a],N2=[a,a],R2=[a+b,0];
 const f=Fig(240/Math.max(a+b,c));
 f.path([G,...arc(D,c,ang(D,G),ang(D,G2)),R2,...arc(D,b,0,90)],SHADE,true)
  .path([G,N,D,R],LINE,true).path([N2,G2,R2,D],LINE,true).path([G,D],LINE)
  .path(arc(D,c,ang(D,G),ang(D,G2)),LINE).path(arc(D,b,0,90),LINE)
  .text(G,'ㄱ',-10,-10).text(N,'ㄴ',-10,8).text(D,'ㄷ',0,14).text(R,'ㄹ',0,-14).text(G2,"ㄱ'",14,-4).text(N2,"ㄴ'",-10,10).text(R2,"ㄹ'",10,12)
  .dim(N,G,1,`${b} cm`).dim(N,D,-1,`${a} cm`).dim(G,D,-1,`${c} cm`,8);
 const pi=PI['3.1'],big=dv(mul(Q(c*c),pi.q),Q(4)),sm=dv(mul(Q(b*b),pi.q),Q(4)),ans=sub(big,sm);
 const prompt=`<p>다음 그림과 같이 직사각형 ㄱㄴㄷㄹ을 점 ㄷ을 중심으로 하여 시계 방향으로 90°만큼 돌렸습니다. 색칠한 부분의 넓이를 구하세요. (원주율: ${pi.t})</p>`
  +f.render('직사각형 ㄱㄴㄷㄹ을 점 ㄷ을 중심으로 90도 돌린 그림');
 const sol=ol([
  `색칠한 부분의 넓이는 (부채꼴 ㄱㄷㄱ'의 넓이) + (삼각형 ㄱ'ㄹ'ㄷ의 넓이) − (삼각형 ㄱㄹㄷ의 넓이) − (부채꼴 ㄹㄷㄹ'의 넓이)입니다.`,
  `삼각형 ㄱ'ㄹ'ㄷ은 삼각형 ㄱㄹㄷ을 돌린 것이므로 두 삼각형의 넓이는 같습니다. 따라서 색칠한 부분의 넓이는 (부채꼴 ㄱㄷㄱ'의 넓이) − (부채꼴 ㄹㄷㄹ'의 넓이)입니다.`,
  `부채꼴 ㄱㄷㄱ'은 반지름이 선분 ㄱㄷ의 길이인 ${c} cm, 중심각이 90°이므로 넓이는 ${c} × ${c} × ${pi.t} ÷ 4 = ${S(big)} cm²입니다.`,
  `선분 ㄹㄷ의 길이는 선분 ㄱㄴ과 같은 ${b} cm이므로 부채꼴 ㄹㄷㄹ'의 넓이는 ${b} × ${b} × ${pi.t} ÷ 4 = ${S(sm)} cm²입니다.`,
  `색칠한 부분의 넓이는 ${S(big)} − ${S(sm)} = ${S(ans)} cm²입니다.`]);
 return {prompt,answer:cm2(ans),solution:sol};
}

// ---- Mission 6: 직각이등변삼각형 + 반원 + 45° 부채꼴 ----
function triSemiSector(L){
 const h=L/2,A=[0,0],B=[L,0],C=[L,L],O=[L,h],Qp=[h,h],P=[L/Math.SQRT2,L/Math.SQRT2];
 const f=Fig(220/L);
 f.path(arc(O,h,90,180),SHADE,true).path([...arc(O,h,180,270),...arc(A,L,0,45)],SHADE,true)
  .path([A,B,C],LINE,true).path(arc(O,h,90,180),LINE).path(arc(O,h,180,270),DLINE).path(arc(A,L,0,45),LINE)
  .right(B,[-1,0],[0,1]).angle(A,0,45,24,'45°')
  .dim(A,B,-1,`${L} cm`).dim(A,P,1,`${L} cm`);
 const pi=PI['22/7'],semi=dv(mul(Q(h*h),pi.q),Q(2)),sec=mul(Q(L*L),pi.q,Q(45,360)),tri=Q(L*L,2),ans=sub(add(semi,sec),tri);
 const prompt=`<p>다음 도형은 직각삼각형, 반원, 부채꼴을 겹쳐 놓은 것입니다. 색칠한 부분의 넓이를 구하세요. (원주율: ${pi.t})</p>`
  +f.render('한 각이 45도인 직각삼각형에 반원과 부채꼴을 겹쳐 놓은 그림');
 const sol=ol([
  `직각삼각형의 한 각이 45°이므로 나머지 한 각도 45°이고, 직각을 낀 두 변의 길이는 ${L} cm로 같습니다. 그래서 반원의 지름은 ${L} cm, 반지름은 ${L} ÷ 2 = ${h} cm입니다.`,
  `반원과 부채꼴을 합치면 직각삼각형이 빈틈없이 덮이고, 두 도형이 겹친 부분은 두 번 들어갑니다. 그래서 (반원의 넓이) + (부채꼴의 넓이) − (직각삼각형의 넓이)는 두 도형이 겹친 부분과 반원 중 삼각형 밖으로 나간 부분, 곧 색칠한 부분의 넓이입니다.`,
  `반원의 넓이는 ${h} × ${h} × ${pi.t} ÷ 2 = ${S(semi)} cm²입니다.`,
  `부채꼴은 반지름이 ${L} cm, 중심각이 45°이므로 넓이는 ${L} × ${L} × ${pi.t} × ${ff(45,360)} = ${S(sec)} cm²입니다.`,
  `직각삼각형의 넓이는 ${L} × ${L} ÷ 2 = ${S(tri)} cm²입니다.`,
  `색칠한 부분의 넓이는 ${S(semi)} + ${S(sec)} − ${S(tri)} = ${S(ans)} cm²입니다.`]);
 return {prompt,answer:cm2(ans),solution:sol};
}

const SQ='정사각형의 원·반원·사분원 반지름이 모두 같다고 봅니다.';
const ITEMS={
 '6-2-u5-e3-exploration':{key:'source62U5E3Exploration1',answerAssumption:'색칠한 부분은 선분 ㄴㅁ, 곡선 ㅁㄹ, 선분 ㄹㄴ으로 둘러싸인 부분으로 봅니다.',pool:[exploration(16),exploration(12),exploration(20)]},
 '6-2-u5-e3-example-1':{key:'source62U5E3Example1',pool:[lunes(12,16,20,'3.14',false),lunes(18,24,30,'3.14',false),lunes(10,24,26,'3.14',false)]},
 '6-2-u5-e3-example-2':{key:'source62U5E3Example2',answerAssumption:SQ,pool:[square4(8),square4(12),square4(16)]},
 '6-2-u5-e3-example-3':{key:'source62U5E3Example3',pool:[rotateTri(20,15,25,72),rotateTri(16,12,20,75),rotateTri(24,18,30,80)]},
 '6-2-u5-e3-example-4':{key:'source62U5E3Example4',pool:[twoSectors(14,18),twoSectors(12,14),twoSectors(16,18)]},
 '6-2-u5-e3-mission-1':{key:'source62U5E3Mission1',pool:[trapezoid(14),trapezoid(28),trapezoid(42)]},
 '6-2-u5-e3-mission-2':{key:'source62U5E3Mission2',pool:[lunes(12,9,15,'3',true),lunes(16,12,20,'3',true),lunes(8,6,10,'3',true)]},
 '6-2-u5-e3-mission-3':{key:'source62U5E3Mission3',answerAssumption:'크기가 같은 원 3개가 서로 맞닿고 직사각형의 변에 꼭 맞게 들어 있다고 봅니다.',pool:[threeCircles(64),threeCircles(48),threeCircles(80)]},
 '6-2-u5-e3-mission-4':{key:'source62U5E3Mission4',pool:[squareSemi(16),squareSemi(12),squareSemi(24)]},
 '6-2-u5-e3-mission-5':{key:'source62U5E3Mission5',pool:[rotateRect(6,8,10),rotateRect(12,16,20),rotateRect(18,24,30)]},
 '6-2-u5-e3-mission-6':{key:'source62U5E3Mission6',pool:[triSemiSector(14),triSemiSector(28),triSemiSector(42)]},
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
