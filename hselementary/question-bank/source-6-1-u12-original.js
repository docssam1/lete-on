// 황소 6-1 1단원(분수의 나눗셈 개념탐구)·2단원(각기둥과 각뿔) 잠금 원문 구조 유형. 각 문항은 같은 구조·다른 수의 검증된 3문항 풀입니다.
(function(root){'use strict';
const GROUP='6-1-u12';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;
const P_=a=>a.map(t=>`<p>${t}</p>`).join('');
const ol=a=>`<ol>${a.map(t=>`<li>${t}</li>`).join('')}</ol>`;
const BASIS=t=>`<p>풀이 기준: ${t}</p>`; // 원문에 없는 해석은 문제 대신 풀이 앞에 둠
// 수 뒤의 조사: 끝자리 읽기(영·일·삼·육·칠·팔은 받침 있음, 일·칠·팔은 ㄹ받침)
const last=n=>String(n).slice(-1);
const eul=n=>`${n}${'013678'.includes(last(n))?'을':'를'}`;
const eun=n=>`${n}${'013678'.includes(last(n))?'은':'는'}`;
const ro=n=>`${n}${'036'.includes(last(n))?'으로':'로'}`;
// 분수는 분자를 마지막에 읽으므로 분자로 조사를 정함
const fEul=(n,d)=>`${ff(n,d)}${'013678'.includes(last(n))?'을':'를'}`;
const fEun=(n,d)=>`${ff(n,d)}${'013678'.includes(last(n))?'은':'는'}`;
// ---------- 벡터 ----------
const sub=(a,b)=>a.map((x,i)=>x-b[i]),add=(a,b)=>a.map((x,i)=>x+b[i]),mul=(a,k)=>a.map(x=>x*k),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],len=a=>Math.sqrt(dot(a,a)),unit=a=>mul(a,1/len(a));
const avg=ps=>mul(ps.reduce((s,p)=>add(s,p),ps[0].map(()=>0)),1/ps.length);
const lerp=(a,b,t)=>add(a,mul(sub(b,a),t));
function outN(P,f,C){const n=unit(cross(sub(P[f[1]],P[f[0]]),sub(P[f[2]],P[f[0]])));const g=avg(f.map(i=>P[i]));return dot(n,sub(g,C))<0?mul(n,-1):n;}

// ---------- 그림 도우미 (그린 범위를 따라 viewBox를 정함) ----------
const S='stroke:#222;stroke-width:1.4px';
const DIM='fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3';
const HID='stroke:#222;stroke-width:1px;stroke-dasharray:4 3';
const FOLD='stroke:#555;stroke-width:1px;stroke-dasharray:4 3';
const PEN='stroke:#222;stroke-width:2px;stroke-linecap:round';
const PENH='stroke:#222;stroke-width:1.8px;stroke-dasharray:5 3;stroke-linecap:round';
const ANS='stroke:#1d4ed8;stroke-width:2.4px;stroke-linecap:round';
const f=v=>{const s=(Math.round(v*10)/10).toFixed(1);return s.endsWith('.0')?s.slice(0,-2):s;};
function canvas(){const B=[1e9,1e9,-1e9,-1e9],out=[];
 const ext=(x,y)=>{B[0]=Math.min(B[0],x);B[1]=Math.min(B[1],y);B[2]=Math.max(B[2],x);B[3]=Math.max(B[3],y);};
 const tw=t=>[...String(t)].reduce((s,c)=>s+(/[ㄱ-힣]/.test(c)?13:7.4),0);
 return {
  line(a,b,st){ext(a[0],a[1]);ext(b[0],b[1]);out.push(`<line x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}" style="${st||S}"/>`);},
  poly(ps,st){ps.forEach(p=>ext(p[0],p[1]));out.push(`<polygon points="${ps.map(p=>f(p[0])+','+f(p[1])).join(' ')}" style="${st}"/>`);},
  path(d,st,pts){(pts||[]).forEach(p=>ext(p[0],p[1]));out.push(`<path d="${d}" style="${st}"/>`);},
  dot(p,r){ext(p[0]-4,p[1]-4);ext(p[0]+4,p[1]+4);out.push(`<circle cx="${f(p[0])}" cy="${f(p[1])}" r="${r||2.8}" style="fill:#222"/>`);},
  text(p,t,sz,anchor){sz=sz||13;const w=tw(t)*sz/13,a=anchor||'middle',x0=a==='middle'?p[0]-w/2:a==='end'?p[0]-w:p[0];
   ext(x0,p[1]-sz*0.9);ext(x0+w,p[1]+sz*0.3);out.push(`<text x="${f(p[0])}" y="${f(p[1])}" text-anchor="${a}" font-size="${sz}" fill="#222" style="font-family:inherit">${t}</text>`);},
  arrow(a,b){this.line(a,b,'stroke:#222;stroke-width:1.6px');const d=unit(sub(b,a)),n=[-d[1],d[0]];
   this.poly([b,add(sub(b,mul(d,8)),mul(n,4)),sub(sub(b,mul(d,8)),mul(n,4))],'fill:#222');},
  svg(label,maxw){const m=6,x=B[0]-m,y=B[1]-m,w=B[2]-B[0]+2*m,h=B[3]-B[1]+2*m;
   return `<svg viewBox="${f(x)} ${f(y)} ${f(w)} ${f(h)}" style="width:100%;max-width:${maxw||360}px;height:auto;display:block;margin:8px auto;font-family:inherit" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${out.join('')}</svg>`;}
 };}
function fitter(pts,W,H){const xs=pts.map(p=>p[0]),ys=pts.map(p=>p[1]);const x0=Math.min(...xs),x1=Math.max(...xs),y0=Math.min(...ys),y1=Math.max(...ys);
 const s=Math.min(W/Math.max(x1-x0,1e-9),H/Math.max(y1-y0,1e-9));return p=>[(p[0]-x0)*s,(p[1]-y0)*s];}
// 치수 호: 두 점 a,b 사이 바깥쪽(g에서 먼 쪽)으로 휜 점선 호와 글자
function dimArc(cv,a,b,g,t,o){o=o||{};const m=mul(add(a,b),0.5),d=sub(b,a),L=len(d);let n=[-d[1]/L,d[0]/L];if(dot(n,sub(m,g))<0)n=mul(n,-1);if(o.flip)n=mul(n,-1);
 const bul=o.bulge!==undefined?o.bulge:Math.min(0.2*L,18),c=add(m,mul(n,2*bul));
 cv.path(`M${f(a[0])} ${f(a[1])}Q${f(c[0])} ${f(c[1])} ${f(b[0])} ${f(b[1])}`,DIM,[a,b,add(m,mul(n,bul))]);
 const lt=o.lt===undefined?0.5:o.lt,bz=add(add(mul(a,(1-lt)*(1-lt)),mul(c,2*lt*(1-lt))),mul(b,lt*lt)),tp=add(bz,mul(n,(o.gap||10)));const ax=Math.abs(n[0])>0.6?(n[0]>0?'start':'end'):'middle';cv.text([tp[0],tp[1]+(n[1]>0.6?8:n[1]<-0.6?0:4)],t,13,ax);}

// ---------- 입체 그림 (정사영, 볼록 입체) ----------
// o: az(방위), el(올려본 각), W,H(그림 크기), fill(k), segs[{a,b,face|vis,st}], polys[{pts,st}], labels[{p,t,d}], dims[{a,b,t,flip}], dots[p]
function solid(cv,P,F,o){const az=o.az||0,el=o.el===undefined?0.35:o.el,ca=Math.cos(az),sa=Math.sin(az),ce=Math.cos(el),se=Math.sin(el);
 const rot=p=>[p[0]*ca+p[1]*sa,-p[0]*sa+p[1]*ca,p[2]];const pr0=p=>{const r=rot(p);return [r[0],-(r[2]*ce+r[1]*se)];};
 const C=avg(P),t=[0,-ce,se],vis=F.map(f=>dot(rot(outN(P,f,C)),t)>1e-9);
 const fit=fitter(P.map(pr0),o.W||220,o.H||220),pr=p=>add(fit(pr0(p)),o.off||[0,0]);
 const E={};F.forEach((fc,k)=>fc.forEach((a,i)=>{const b=fc[(i+1)%fc.length],key=Math.min(a,b)+'-'+Math.max(a,b);(E[key]=E[key]||{a,b,fs:[]}).fs.push(k);}));
 F.forEach((fc,k)=>{if(vis[k])cv.poly(fc.map(i=>pr(P[i])),`fill:${o.fill?o.fill(k):'#f4f4f4'};stroke:none`);});
 (o.polys||[]).forEach(q=>cv.poly(q.pts.map(pr),q.st));
 const ev=Object.values(E);ev.filter(e=>!e.fs.some(k=>vis[k])).forEach(e=>cv.line(pr(P[e.a]),pr(P[e.b]),HID));
 (o.segs||[]).forEach(s=>{const v=s.vis!==undefined?s.vis:vis[s.face];cv.line(pr(s.a),pr(s.b),s.st||(v?PEN:PENH));});
 ev.filter(e=>e.fs.some(k=>vis[k])).forEach(e=>cv.line(pr(P[e.a]),pr(P[e.b]),S));
 const g=pr(C);
 (o.dims||[]).forEach(d=>dimArc(cv,pr(d.a),pr(d.b),g,d.t,d));
 (o.dots||[]).forEach(p=>cv.dot(pr(p)));
 (o.labels||[]).forEach(l=>{const q=pr(l.p),dd=l.d||mul(unit(sub(q,g)),13);cv.text([q[0]+dd[0],q[1]+dd[1]+4],l.t,14);});
 return {pr,vis};}

// ---------- 전개도 (겉면이 보이도록 펼침) ----------
function unfold(P,F,root,tree){const C=avg(P),pos={};const f0=F[root],n=outN(P,f0,C),a=P[f0[0]],u=unit(sub(P[f0[1]],a)),v=cross(n,u);
 pos[root]={};f0.forEach(i=>{const d=sub(P[i],a);pos[root][i]=[dot(d,u),-dot(d,v)];});
 for(const [p,c] of tree){const [i,j]=F[c].filter(k=>F[p].includes(k));const A=pos[p][i],B=pos[p][j];
  const gp=avg(F[p].map(k=>pos[p][k])),ab=sub(B,A),L=len(ab);let w=[-ab[1]/L,ab[0]/L];if(dot(w,sub(gp,A))>0)w=mul(w,-1);
  const e=sub(P[j],P[i]),E2=dot(e,e);pos[c]={};
  F[c].forEach(k=>{const d=sub(P[k],P[i]),tt=dot(d,e)/E2,h=len(sub(d,mul(e,tt)));pos[c][k]=add(add(A,mul(ab,tt)),mul(w,h));});}
 return pos;}
function to2(P,F,pos,c,p){const fc=F[c],a=P[fc[0]],e1=sub(P[fc[1]],a),e2=sub(P[fc[2]],a),d=sub(p,a);
 const g11=dot(e1,e1),g12=dot(e1,e2),g22=dot(e2,e2),r1=dot(d,e1),r2=dot(d,e2),det=g11*g22-g12*g12,s=(r1*g22-r2*g12)/det,t=(r2*g11-r1*g12)/det;
 const A=pos[c][fc[0]],B=pos[c][fc[1]],Qq=pos[c][fc[2]];return add(add(A,mul(sub(B,A),s)),mul(sub(Qq,A),t));}
// o: align[face,i,j] (i→j를 오른쪽으로), W,H, fill(k), shades[{face,pts,fill}], segs[{face,a,b,st}], labels[{face,v|p,t}], dims[{face,i,j,t}], off
function net(cv,P,F,root,tree,o){o=o||{};const pos=unfold(P,F,root,tree);
 if(o.align){const [fc,i,j]=o.align,a=pos[fc][i],b=pos[fc][j],ang=-Math.atan2(b[1]-a[1],b[0]-a[0])+(o.turn||0),c=Math.cos(ang),s=Math.sin(ang);
  for(const k in pos)for(const v in pos[k]){const p=pos[k][v];pos[k][v]=[p[0]*c-p[1]*s,p[0]*s+p[1]*c];}}
 const faces=Object.keys(pos).map(Number),all=[];faces.forEach(k=>Object.values(pos[k]).forEach(p=>all.push(p)));
 const fit=fitter(all,o.W||300,o.H||240),X=p=>add(fit(p),o.off||[0,0]);
 const XY=(k,i)=>X(pos[k][i]),cen=k=>avg(F[k].map(i=>XY(k,i)));
 const fold=new Set();tree.forEach(([p,c])=>{const sh=F[c].filter(k=>F[p].includes(k)).sort((x,y)=>x-y).join('-');fold.add(p+':'+sh);fold.add(c+':'+sh);});
 faces.forEach(k=>cv.poly(F[k].map(i=>XY(k,i)),`fill:${o.fill?o.fill(k):'#ececec'};stroke:none`));
 (o.shades||[]).forEach(s=>cv.poly(s.pts.map(p=>X(to2(P,F,pos,s.face,p))),`fill:${s.fill||'#8a8a8a'};stroke:none`));
 const drawn=new Set();
 faces.forEach(k=>F[k].forEach((a,i)=>{const b=F[k][(i+1)%F[k].length],sh=[a,b].sort((x,y)=>x-y).join('-');
  if(fold.has(k+':'+sh)){const tk=[...fold].filter(x=>x.endsWith(':'+sh)).map(x=>x.split(':')[0]).sort().join(',')+sh;if(drawn.has(tk))return;drawn.add(tk);cv.line(XY(k,a),XY(k,b),FOLD);}
  else cv.line(XY(k,a),XY(k,b),S);}));
 (o.segs||[]).forEach(s=>cv.line(X(to2(P,F,pos,s.face,s.a)),X(to2(P,F,pos,s.face,s.b)),s.st||ANS));
 const G=avg(all.map(X));
 (o.dims||[]).forEach(d=>dimArc(cv,XY(d.face,d.i),XY(d.face,d.j),cen(d.face),d.t,d));
 (o.dots||[]).forEach(d=>cv.dot(X(to2(P,F,pos,d.face,d.p))));
 (o.labels||[]).forEach(l=>{const q=l.v!==undefined?XY(l.face,l.v):X(to2(P,F,pos,l.face,l.p));
  // 그 점에 모인 면들의 중심에서 먼 쪽에 글자를 둠
  const near=faces.filter(k=>F[k].some(i=>len(sub(XY(k,i),q))<0.5));const g=near.length?avg(near.map(cen)):G;
  const dd=l.d||mul(unit(sub(q,g)),13);cv.text([q[0]+dd[0],q[1]+dd[1]+4],l.t,14);});
 return {pos,X};}

// ---------- 입체 만들기 ----------
function prism(base,h){const n=base.length,P=base.map(p=>[p[0],p[1],h]).concat(base.map(p=>[p[0],p[1],0]));
 const F=[[...Array(n).keys()],[...Array(n).keys()].map(i=>n+i)];for(let i=0;i<n;i++){const j=(i+1)%n;F.push([i,j,n+j,n+i]);}return {P,F};}
function pyramid(base,apex){const n=base.length,P=base.map(p=>[p[0],p[1],0]).concat([apex]);
 const F=[[...Array(n).keys()]];for(let i=0;i<n;i++)F.push([i,(i+1)%n,n]);return {P,F};}
// 정n각형: 한 변 s, 첫 꼭짓점 각 a0(도), 시계 방향(위에서 볼 때 뒤→오른쪽→앞)으로 차례
function regular(n,s,a0){const R=s/(2*Math.sin(Math.PI/n));return [...Array(n).keys()].map(k=>{const a=(a0-360*k/n)*Math.PI/180;return [R*Math.cos(a),R*Math.sin(a)];});}

// ======================================================================
// 1단원 개념탐구 1 (1): a ÷ b = a/b 인 까닭
function exp11(a,b){return {
 prompt:P_([`${a} ÷ ${b} = ${ff(a,b)}인 까닭을 여러 가지 방법으로 설명해 보세요.`]),
 answer:`${ff(a,b)}: 1 ÷ ${b} = ${ff(1,b)}이고, ${a} ÷ ${b}의 몫은 ${ff(1,b)}이 ${a}개이므로 ${ff(a,b)}입니다.`,
 solution:ol([`(똑같이 나누기) 1을 똑같이 ${ro(b)} 나눈 것 중 하나는 ${ff(1,b)}입니다. ${eun(a)} 1이 ${a}개이므로, ${eul(a)} 똑같이 ${ro(b)} 나눈 것 중 하나는 ${ff(1,b)}이 ${a}개인 ${ff(a,b)}입니다.`,
  `(상황으로 생각하기) 빵 ${a}개를 ${b}명이 똑같이 나누어 먹을 때, 빵 한 개를 각각 ${b}조각으로 자르면 한 사람은 ${ff(1,b)}개짜리 조각을 ${a}개 받으므로 ${ff(a,b)}개를 먹습니다.`,
  `(곱셈으로 확인하기) ${ff(a,b)} × ${b} = ${a}이므로 ${eul(a)} ${ro(b)} 나눈 몫은 ${ff(a,b)}입니다.`])};}
// 1단원 개념탐구 1 (2): n/d ÷ k = n/d × 1/k 인 까닭
function exp12(n,d,k){const N=n*k,D=d*k;return {
 prompt:P_([`${ff(n,d)} ÷ ${k} = ${ff(n,d)} × ${ff(1,k)}인 까닭을 여러 가지 방법으로 설명해 보세요.`]),
 answer:`${fEul(n,d)} 똑같이 ${ro(k)} 나눈 것 중 하나는 ${ff(n,d)}의 ${ff(1,k)}이므로 ${ff(n,d)} ÷ ${k} = ${ff(n,d)} × ${ff(1,k)} = ${ff(n,D)}입니다.`,
 solution:ol([`(똑같이 나누기) ${fEul(n,d)} 똑같이 ${k}부분으로 나눈 것 중 한 부분은 ${ff(n,d)}의 ${ff(1,k)}입니다. '~의 ${ff(1,k)}'은 ${ff(1,k)}을 곱하는 것이므로 ${ff(n,d)} ÷ ${k} = ${ff(n,d)} × ${ff(1,k)}입니다.`,
  `(분자를 나누기) ${ff(n,d)}의 분모와 분자에 각각 ${eul(k)} 곱하면 ${ff(n,d)} = ${ff(N,D)}입니다. ${fEun(N,D)} ${ff(1,D)}이 ${N}개이므로 ${ro(k)} 나누면 ${ff(1,D)}이 ${n}개, 곧 ${ff(n,D)}입니다. ${ff(n,d)} × ${ff(1,k)}도 ${ff(n,D)}이므로 두 식의 값이 같습니다.`,
  `(곱셈으로 확인하기) ${ff(n,d)} × ${ff(1,k)} × ${k} = ${ff(n,d)}이므로, ${fEul(n,d)} ${ro(k)} 나눈 몫은 ${ff(n,d)} × ${ff(1,k)}입니다.`])};}

// ======================================================================
// 2단원 예제 1-2: 사각기둥을 윗면 대각선으로 세로로 자르고, 조각에 그은 가로선을 따라 자르기
function cutBox(dk,lt){const w=3,dp=2.4,h=7,B=prism([[0,dp],[w,dp],[w,0],[0,0]],h);// 0:뒤왼 1:뒤오 2:앞오 3:앞왼 (윗면), 4~7 아랫면
 const P=B.P,F=B.F,FL=z=>[0,0,z],FR=z=>[w,0,z],BR=z=>[w,dp,z],BL=z=>[0,dp,z];
 const segs=[{a:FL(h),b:BR(h),vis:true},{a:FL(0),b:BR(0),vis:false}];
 dk.forEach(z=>{z*=h;segs.push({a:FL(z),b:FR(z),vis:true},{a:FR(z),b:BR(z),vis:false},{a:BR(z),b:FL(z),vis:false});});
 lt.forEach(z=>{z*=h;segs.push({a:FL(z),b:BL(z),vis:true},{a:BL(z),b:BR(z),vis:false},{a:BR(z),b:FL(z),vis:false});});
 const cv=canvas();
 // 앞면(진한 조각)과 왼쪽 면(옅은 조각) 칠하기
 solid(cv,P,F,{az:-0.62,el:0.42,W:150,H:250,fill:k=>{const fc=F[k];const ys=fc.map(i=>P[i][1]),xs=fc.map(i=>P[i][0]);
   if(ys.every(y=>y===0))return '#9c9c9c';if(xs.every(x=>x===0))return '#dcdcdc';return '#ffffff';},segs:segs.map(s=>Object.assign({st:s.vis?'stroke:#111;stroke-width:1.8px':'stroke:#111;stroke-width:1.6px;stroke-dasharray:5 3'},s))});
 return cv.svg('윗면에 대각선을 긋고 옆면에 가로선을 그은 사각기둥 모양 나무 도막',240);}
function ex12(dk,lt){const n=2+dk.length+lt.length;return {
 prompt:P_([`그림과 같이 사각기둥 모양의 나무 도막에 선을 긋고, 그은 선을 따라 잘랐습니다. 잘라서 생긴 입체도형들의 면의 수, 모서리의 수, 꼭짓점의 수를 모두 더하면 몇 개입니까?`])+cutBox(dk,lt),
 answer:`${20*n}개`,
 solution:BASIS('먼저 윗면의 대각선을 따라 바닥까지 세로로 자르고, 옆면에 그은 가로선은 그 선이 그어진 조각만 밑면과 나란하게 자릅니다.')+ol([`윗면의 대각선을 따라 세로로 자르면 밑면이 삼각형인 삼각기둥 2개가 생깁니다.`,
  `진하게 칠한 조각은 가로선 ${dk.length}개를 따라 잘리므로 ${dk.length+1}개가 되고${lt.length?`, 옅게 칠한 조각은 가로선 ${lt.length}개를 따라 잘리므로 ${lt.length+1}개가 됩니다`:`, 옅게 칠한 조각은 그대로 1개입니다`}. 잘린 조각도 모두 삼각기둥이므로 삼각기둥은 모두 ${n}개입니다.`,
  `삼각기둥 한 개는 면 5개, 모서리 9개, 꼭짓점 6개이므로 합은 5 + 9 + 6 = 20(개)입니다.`,
  `따라서 모두 더하면 20 × ${n} = ${20*n}(개)입니다.`])};}

// 2단원 예제 1-3: 정오각기둥 전개도 둘레의 가장 큰 값과 가장 작은 값의 차
function pentPrismSvg(a,h){const base=regular(5,a,90),B=prism(base,h),P=B.P,F=B.F,cv=canvas();
 solid(cv,P,F,{az:0.12,el:0.42,W:150,H:200,fill:k=>k===0?'#d6d6d6':k>=2?['#8f8f8f','#6f6f6f','#7d7d7d','#9a9a9a','#a7a7a7'][k-2]:'#eee',
  dims:[{a:P[0],b:P[1],t:`${a} cm`},{a:P[1],b:P[6],t:`${h} cm`}]});
 return cv.svg(`밑면의 한 변이 ${a} cm, 높이가 ${h} cm인 오각기둥`,230);}
function ex13(a,h){const tot=2*5*a+5*2*(a+h),mx_=4*h+2*a,mn_=6*a;return {
 prompt:P_([`그림의 오각기둥에서 밑면은 한 변이 ${a} cm인 정오각형이고, 높이는 ${h} cm입니다. 이 오각기둥의 전개도를 여러 가지 방법으로 그릴 때, 전개도의 둘레가 가장 긴 것과 가장 짧은 것의 차는 몇 cm입니까?`])+pentPrismSvg(a,h),
 answer:`${2*(mx_-mn_)} cm`,
 solution:ol([`전개도의 둘레는 모든 면의 둘레를 더한 길이에서, 서로 붙어 있는 변의 길이를 두 번씩 뺀 길이입니다.`,
  `모든 면의 둘레의 합은 밑면 2개 ${a} × 5 × 2 = ${10*a}(cm)와 옆면 5개 (${a} + ${h}) × 2 × 5 = ${10*(a+h)}(cm)를 더한 ${tot} cm입니다.`,
  `면이 7개이므로 전개도에서 붙어 있는 변은 6군데입니다.`,
  `둘레가 가장 짧으려면 긴 변(${h} cm)을 많이 붙여야 합니다. 옆면 5개를 한 줄로 이으면 ${h} cm 변 4군데가 붙고, 두 밑면은 ${a} cm 변으로 한 군데씩 붙습니다. 붙은 길이는 ${h} × 4 + ${a} × 2 = ${mx_}(cm)이므로 둘레는 ${tot} − ${mx_} × 2 = ${tot-2*mx_}(cm)입니다.`,
  `둘레가 가장 길게 되려면 짧은 변(${a} cm)만 붙여야 합니다. 한 밑면의 다섯 변에 옆면 5개를 모두 붙이고 다른 밑면을 옆면 하나에 붙이면 붙은 길이는 ${a} × 6 = ${mn_}(cm)이므로 둘레는 ${tot} − ${mn_} × 2 = ${tot-2*mn_}(cm)입니다.`,
  `따라서 차는 ${tot-2*mn_} − ${tot-2*mx_} = ${2*(mx_-mn_)}(cm)입니다.`])};}

// 2단원 Mission 3: 옆면이 같은 직사각형 6개인 각기둥 전개도 둘레의 차
function rectSvg(a,h){const cv=canvas(),s=150/Math.max(a,h)*0.9,W=a*s,H=h*s,A=[0,0],B=[W,0],C=[W,H],D=[0,H];
 cv.poly([A,B,C,D],'fill:#dcdcdc;'+S);dimArc(cv,B,C,[W/2,H/2],`${h} cm`);dimArc(cv,D,C,[W/2,H/2],`${a} cm`);return cv.svg(`가로 ${a} cm, 세로 ${h} cm인 직사각형`,200);}
function m13(a,h){const tot=2*6*a+6*2*(a+h),big=5*h+2*a,small=7*a;return {
 prompt:P_([`옆면의 모양이 모두 그림과 같은 직사각형 6개로 이루어진 각기둥이 있습니다. 이 각기둥의 전개도를 여러 가지 방법으로 그릴 때, 전개도의 둘레가 가장 긴 것과 가장 짧은 것의 차는 몇 cm입니까?`])+rectSvg(a,h),
 answer:`${2*(big-small)} cm`,
 solution:ol([`옆면이 6개이므로 육각기둥이고, 밑면은 한 변이 ${a} cm인 육각형입니다.`,
  `모든 면의 둘레의 합은 밑면 2개 ${a} × 6 × 2 = ${12*a}(cm)와 옆면 6개 (${a} + ${h}) × 2 × 6 = ${12*(a+h)}(cm)를 더한 ${tot} cm이고, 면이 8개이므로 전개도에서 붙어 있는 변은 7군데입니다.`,
  `둘레가 가장 짧은 전개도는 옆면 6개를 한 줄로 이어 ${h} cm 변 5군데를 붙이고, 두 밑면을 ${a} cm 변으로 한 군데씩 붙인 것입니다. 붙은 길이는 ${h} × 5 + ${a} × 2 = ${big}(cm)이므로 둘레는 ${tot} − ${big} × 2 = ${tot-2*big}(cm)입니다.`,
  `둘레가 가장 긴 전개도는 ${a} cm 변만 7군데 붙인 것(한 밑면에 옆면 6개를 모두 붙이고 다른 밑면을 옆면 하나에 붙임)입니다. 붙은 길이는 ${a} × 7 = ${small}(cm)이므로 둘레는 ${tot} − ${small} × 2 = ${tot-2*small}(cm)입니다.`,
  `따라서 차는 ${tot-2*small} − ${tot-2*big} = ${2*(big-small)}(cm)입니다.`])};}

// 2단원 Mission 4: 각기둥을 색칠한 면을 따라 자른 두 입체
const KN={3:'삼',4:'사',5:'오',6:'육',7:'칠',8:'팔'};
const PNAME={3:'삼각기둥',4:'사각기둥',5:'오각기둥',6:'육각기둥',7:'칠각기둥',8:'팔각기둥'};
function cutPrismSvg(n,a0,i,j){const base=regular(n,1,a0),B=prism(base,1.7),P=B.P,F=B.F,cv=canvas();
 solid(cv,P,F,{az:0.08,el:0.5,W:170,H:190,fill:k=>k===0?'#ffffff':'#fbfbfb',
  polys:[{pts:[P[i],P[j],P[n+j],P[n+i]],st:'fill:#9a9a9a;fill-opacity:0.55;stroke:none'}],
  segs:[{a:P[i],b:P[j],vis:true,st:'stroke:#222;stroke-width:1.6px'},{a:P[n+i],b:P[n+j],vis:false,st:HID}]});
 return cv.svg(`${PNAME[n]}과 자르는 면`,240);}
function m14(n,a0,i,j){const a=j-i+1,b=n-(j-i)+1,s=m=>(m+2)+3*m+2*m;return {
 prompt:P_([`각기둥을 그림과 같이 색칠한 면을 따라 잘랐을 때, 만들어진 두 입체도형의 면의 수, 모서리의 수, 꼭짓점의 수를 모두 더하면 몇 개입니까?`])+cutPrismSvg(n,a0,i,j),
 answer:`${s(a)+s(b)}개`,
 solution:ol([`그림의 입체도형은 밑면이 ${KN[n]}각형인 ${PNAME[n]}입니다. 색칠한 면은 밑면의 두 꼭짓점을 이은 선을 따라 세로로 자르는 면입니다.`,
  `밑면의 ${KN[n]}각형이 ${KN[a]}각형과 ${KN[b]}각형으로 나뉘므로 ${PNAME[a]}과 ${PNAME[b]}이 생깁니다.`,
  `${PNAME[a]}은 면 ${a+2}개, 모서리 ${3*a}개, 꼭짓점 ${2*a}개이므로 합은 ${s(a)}개이고, ${PNAME[b]}은 면 ${b+2}개, 모서리 ${3*b}개, 꼭짓점 ${2*b}개이므로 합은 ${s(b)}개입니다.`,
  `따라서 모두 더하면 ${s(a)} + ${s(b)} = ${s(a)+s(b)}(개)입니다.`])};}

// ======================================================================
// 2단원 개념탐구 2: 육각기둥 위의 선을 전개도에 옮기기
const HX=(()=>{const base=regular(6,1,120),B=prism(base,2.6);return B;})(); // 0:ㄱ(뒤왼) 1:ㄴ(뒤오) 2:오른 3:앞오 4:앞왼 5:왼, 6~11 아래
function hexPath(){const P=HX.P,H=2.6,T=i=>P[i],Bt=i=>P[6+i];const X1=[P[1][0],P[1][1],H*2/3],X2=[P[0][0],P[0][1],H/3];
 // [면 번호, 시작점, 끝점]: F[0] 윗면, F[1] 아랫면, F[2+i]는 꼭짓점 i와 i+1 사이 옆면
 return [[0,T(0),T(2)],[3,T(2),X1],[2,X1,X2],[7,X2,Bt(5)],[1,Bt(5),Bt(3)],[5,Bt(3),T(4)],[0,T(4),T(1)]];}
function hexSolidSvg(){const P=HX.P,F=HX.F,cv=canvas(),segs=hexPath().map(([k,a,b])=>({face:k,a,b}));
 solid(cv,P,F,{az:0.2,el:0.34,W:120,H:200,fill:k=>k===6?'#cfcfcf':k===0?'#f1f1f1':'#e4e4e4',segs,dots:[hexPath()[1][2],hexPath()[2][2]],
  labels:[{p:P[0],t:'ㄱ',d:[-4,-12]},{p:P[1],t:'ㄴ',d:[4,-12]}]});
 return cv.svg('꼭짓점 ㄱ에서 꼭짓점 ㄴ까지 선을 그은 육각기둥',200);}
// 전개도: 옆면 줄 순서(strip), 윗면을 붙일 옆면, 아랫면을 붙일 옆면
function hexNet(order,topAt,botAt,withPath){const P=HX.P,F=HX.F,cv=canvas(),tree=[];
 for(let k=1;k<order.length;k++)tree.push([2+order[k-1],2+order[k]]);tree.push([2+topAt,0],[2+botAt,1]);
 const r=2+order[0],fc=F[r];
 net(cv,P,F,r,tree,{align:[r,fc[1],fc[0]],W:330,H:300,segs:withPath?hexPath().map(([k,a,b])=>({face:k,a,b})):[],labels:[{face:0,v:0,t:'ㄱ'},{face:0,v:1,t:'ㄴ'}]});
 return cv;}
function e2exp(order,topAt,botAt){return {
 prompt:P_([`그림과 같이 육각기둥의 꼭짓점 ㄱ에서 시작하여 꼭짓점 ㄴ까지 이어지는 선을 그렸습니다. 육각기둥에 그려진 선을 아래 전개도 위에 그려 보시오.`])+hexSolidSvg()+hexNet(order,topAt,botAt,false).svg('선을 옮겨 그릴 육각기둥의 전개도',340),
 answer:'전개도의 윗면에 선분 2개, 앞 옆면에 선분 1개, 뒤쪽 옆면 3개에 걸친 곧은 선, 아랫면에 선분 1개',
 answerVisual:hexNet(order,topAt,botAt,true).svg('선을 옮겨 그린 육각기둥의 전개도',340),
 solution:BASIS('뒤쪽 옆면 세 개를 지나는 선은 두 세로 모서리를 각각 3등분한 점(점으로 표시)을 지나며, 세 옆면을 펼치면 한 직선이 됩니다.')+ol([`꼭짓점 ㄱ, ㄴ의 위치로 전개도의 윗면과 각 옆면이 입체의 어느 면인지 정합니다. 윗면과 맞닿은 옆면이 ㄱ, ㄴ과 마주 보는 앞 옆면입니다.`,
  `윗면에는 ㄱ에서 ㄱ과 한 칸 건너 있는 오른쪽 꼭짓점까지의 선분, 그리고 ㄴ에서 맞은편(앞 왼쪽) 꼭짓점까지의 선분을 긋습니다.`,
  `오른쪽 꼭짓점에서 뒤쪽 옆면 세 개를 지나 왼쪽 아래 꼭짓점까지 가는 선은, 세 옆면을 이어 붙인 전개도에서 곧은 선이 되므로 세로 모서리를 3등분한 점을 지납니다.`,
  `아랫면에는 왼쪽 꼭짓점에서 한 칸 건너 있는 앞 오른쪽 꼭짓점까지 선분을 긋고, 앞 옆면에는 앞 오른쪽 아래 꼭짓점에서 앞 왼쪽 위 꼭짓점까지 대각선을 긋습니다.`,
  `각 선분의 끝점이 입체에서 같은 점이 되는지 확인하면 정답 그림과 같습니다.`])};}

// 2단원 Mission 3(개념탐구 2): 사다리꼴 밑면 사각기둥 위의 선을 전개도에 옮기기
function trapPrism(t,b,h,L){// 앞 밑면 y=0, 뒤 밑면 y=L. 0:ㄴ(앞 위왼) 1:ㄷ(앞 위오) 2:앞 아래오 3:앞 아래왼 4:ㄱ 5:ㄹ 6:뒤 아래오 7:뒤 아래왼
 const P=[[0,0,h],[t,0,h],[b,0,0],[0,0,0],[0,L,h],[t,L,h],[b,L,0],[0,L,0]];
 const F=[[0,1,5,4],[0,1,2,3],[4,5,6,7],[1,2,6,5],[0,3,7,4],[3,2,6,7]];// 0 윗면,1 앞 밑면,2 뒤 밑면,3 기운 옆면,4 왼쪽 옆면,5 바닥 옆면
 return {P,F};}
function trapSolidSvg(t,b,h,L,sl){const {P,F}=trapPrism(t,b,h,L),cv=canvas();
 solid(cv,P,F,{az:0.55,el:0.3,W:200,H:170,fill:k=>k===1?'#bdbdbd':k===3?'#8d8d8d':'#e3e3e3',
  segs:[{face:0,a:P[0],b:P[5]},{face:2,a:P[5],b:P[7]},{face:4,a:P[7],b:P[0]}],
  labels:[{p:P[4],t:'ㄱ',d:[-10,-8]},{p:P[0],t:'ㄴ',d:[-14,0]},{p:P[1],t:'ㄷ',d:[9,15]},{p:P[5],t:'ㄹ',d:[8,-10]}],
  dims:[{a:P[0],b:P[4],t:`${L} cm`},{a:P[4],b:P[5],t:`${t} cm`},{a:P[5],b:P[6],t:`${sl} cm`},{a:P[3],b:P[0],t:`${h} cm`},{a:P[3],b:P[2],t:`${b} cm`}]});
 return cv.svg('선을 그은 사다리꼴 밑면의 사각기둥',300);}
function trapNet(t,b,h,L,ans){const {P,F}=trapPrism(t,b,h,L),cv=canvas();
 const tree=[[0,2],[0,3],[2,4],[4,5],[5,1]];
 net(cv,P,F,0,tree,{W:300,H:280,fill:()=>'#dedede',segs:[{face:0,a:P[0],b:P[5],st:PEN}].concat(ans?[{face:2,a:P[5],b:P[7]},{face:4,a:P[7],b:P[0]}]:[]),
  labels:[{face:0,v:4,t:'ㄱ',d:[-12,-6]},{face:0,v:5,t:'ㄹ',d:[10,-6]},{face:0,v:0,t:'ㄴ',d:[-12,8]},{face:0,v:1,t:'ㄷ',d:[10,10]}]});
 return cv;}
function e2m3(t,b,h,L,sl){return {
 prompt:P_([`첫째 그림과 같은 사각기둥의 면 위에 선을 그었습니다. 이 사각기둥의 전개도가 둘째 그림과 같을 때, 전개도에 선이 지나간 자리를 그려 보시오.`])+trapSolidSvg(t,b,h,L,sl)+trapNet(t,b,h,L,false).svg('선분 ㄴㄹ이 그려진 사각기둥의 전개도',320),
 answer:'뒤쪽 밑면에 ㄹ에서 ㄱ 아래 꼭짓점까지의 선분, 왼쪽 옆면에 그 꼭짓점에서 ㄴ까지의 선분',
 answerVisual:trapNet(t,b,h,L,true).svg('선이 지나간 자리를 그린 전개도',320),
 solution:ol([`입체에 그은 선은 윗면의 ㄴ에서 ㄹ까지, 뒤쪽 밑면의 ㄹ에서 ㄱ 바로 아래 꼭짓점까지, 왼쪽 옆면의 그 꼭짓점에서 ㄴ까지 이어진 세 선분입니다.`,
  `전개도에서 ㄱ, ㄴ, ㄷ, ㄹ이 있는 가늘고 긴 직사각형이 윗면입니다. 변 ㄱㄹ에 붙은 사다리꼴이 뒤쪽 밑면이고, 이 사다리꼴에서 ㄱ과 이어진 ${h} cm 변이 ㄱ에서 아래로 내려간 모서리입니다.`,
  `뒤쪽 밑면에서 ㄹ과 ㄱ 아래 꼭짓점을 잇는 선분을 긋습니다.`,
  `그 ${h} cm 변에 붙은 ${h} cm × ${L} cm 직사각형이 왼쪽 옆면이고, 이 면에서 ㄱ 아래 꼭짓점과 맞은편 꼭짓점이 ㄴ입니다. 두 점을 잇는 선분을 긋습니다.`])};}

// ======================================================================
// 2단원 개념탐구 3: 모든 모서리가 같은 각뿔의 전개도 가짓수
function eqPyr(n){const base=regular(n,1,90+180/n),R=1/(2*Math.sin(Math.PI/n)),hh=Math.sqrt(1-R*R);return pyramid(base,[0,0,hh]);}
const PYR={3:'삼각뿔',4:'사각뿔',5:'오각뿔',6:'육각뿔'};
function eqPyrSvg(n){const {P,F}=eqPyr(n),cv=canvas();solid(cv,P,F,{az:0.3,el:0.5,W:190,H:150,fill:k=>['#f2f2f2','#c8c8c8','#a6a6a6','#b8b8b8','#d4d4d4','#bdbdbd','#c4c4c4'][k%7]});return cv.svg(`모든 모서리의 길이가 같은 ${PYR[n]}`,230);}
const NETWHY={3:['삼각뿔은 정삼각형 4개로 이루어져 있고, 전개도에서 붙어 있는 변은 3군데입니다.','한 정삼각형의 세 변에 나머지 3개를 모두 붙이면 큰 정삼각형 모양이 됩니다. (1가지)','정삼각형 4개를 한 줄로 이어 붙이면 평행사변형 모양이 됩니다. (1가지)','다른 방법으로 붙여도 돌리거나 뒤집으면 이 두 모양 중 하나와 같으므로 모두 2가지입니다.'],
 4:['사각뿔은 정사각형 1개와 정삼각형 4개로 이루어져 있고, 정사각형에 바로 붙은 삼각형의 수로 나누어 셉니다.','정사각형의 네 변에 삼각형이 모두 붙은 경우: 1가지','정사각형에 삼각형 3개가 붙고, 남은 1개가 옆 삼각형에 붙은 경우: 1가지','정사각형에 삼각형 2개가 붙은 경우: 두 삼각형이 이웃한 변에 붙으면 2가지, 마주 보는 변에 붙으면 2가지로 4가지','정사각형에 삼각형 1개가 붙은 경우: 삼각형 4개를 한 줄로 이은 뒤 정사각형을 끝 삼각형에 붙이는지, 안쪽 삼각형에 붙이는지에 따라 2가지','따라서 1 + 1 + 4 + 2 = 8(가지)입니다.'],
 5:['오각뿔은 정오각형 1개와 정삼각형 5개로 이루어져 있고, 정오각형에 바로 붙은 삼각형의 수로 나누어 셉니다.','정오각형의 다섯 변에 삼각형이 모두 붙은 경우: 1가지','삼각형 4개가 붙은 경우: 남은 1개는 옆 삼각형에 붙으므로 1가지','삼각형 3개가 붙은 경우: 붙은 세 변이 잇달아 있으면 2가지, 한 변이 떨어져 있으면 3가지로 5가지','삼각형 2개가 붙은 경우: 이웃한 두 변이면 2가지, 떨어진 두 변이면 3가지로 5가지','삼각형 1개가 붙은 경우: 삼각형 5개를 한 줄로 이은 뒤 정오각형을 붙이는 삼각형의 자리(끝, 끝에서 둘째, 가운데)에 따라 3가지','따라서 1 + 1 + 5 + 5 + 3 = 15(가지)입니다.']};
function e3exp(n,cnt,why){return {
 prompt:P_([`모든 모서리의 길이가 같은 ${PYR[n]}이 있습니다. 이 ${PYR[n]}의 전개도를 그리는 방법은 모두 몇 가지입니까? (단, 돌리거나 뒤집었을 때 같은 모양은 한 가지로 봅니다.)`])+eqPyrSvg(n),
 answer:`${cnt}가지`,solution:ol(why)};}

// 2단원 예제 3-2: 각뿔 전개도의 일부에 삼각형 한 개를 붙일 수 있는 변
const KO='ㄱㄴㄷㄹㅁㅂㅅㅇㅈㅊㅋㅌㅍㅎ';
function partPyr(n,L){const base=regular(n,1,90),R=1/(2*Math.sin(Math.PI/n)),hh=Math.sqrt(L*L-R*R);return pyramid(base,[0,0,hh]);}
// tree: 붙인 면 연결(면 0은 밑면, 면 1+i는 밑변 i~i+1의 옆면), miss: 빠진 옆면
function partNet(n,L,tree,lab,ans){const {P,F}=partPyr(n,L),cv=canvas();
 const r=net(cv,P,F,0,tree,{align:[0,lab.al[0],lab.al[1]],turn:lab.turn||0,W:280,H:220,fill:()=>'#f4f4f4',
  labels:lab.pts.map(([k,v,t])=>({face:k,v,t})),segs:ans?ans.map(([k,i,j])=>({face:k,a:P[i],b:P[j]})):[]});
 return cv;}
const PART=[
 [5,1.6,[[0,1],[0,4],[4,5],[4,3]],{al:[0,0,1],turn:Math.PI/2,baseName:'ㄴㄷ',pts:[[1,5,'ㄱ'],[0,1,'ㄴ'],[0,2,'ㄷ'],[0,3,'ㄹ'],[3,2,'ㅁ'],[4,5,'ㅂ'],[5,0,'ㅅ'],[0,4,'ㅇ'],[0,0,'ㅈ']]},null,['ㄱㄴ','ㄴㄷ','ㅁㅂ']],
 [4,1.6,[[0,1],[0,3],[3,4]],{al:[0,0,1],turn:Math.PI/2,baseName:'ㄴㄷ',pts:[[1,4,'ㄱ'],[0,1,'ㄴ'],[0,2,'ㄷ'],[3,4,'ㄹ'],[4,0,'ㅁ'],[0,3,'ㅂ'],[0,0,'ㅅ']]},null,['ㄱㄴ','ㄴㄷ','ㄷㄹ']],
 [6,1.6,[[0,2],[0,5],[5,4],[4,3],[5,6]],{al:[0,1,2],turn:Math.PI/2,baseName:'ㅊㅋ',pts:[[2,6,'ㄱ'],[0,2,'ㄴ'],[0,3,'ㄷ'],[0,4,'ㄹ'],[4,3,'ㅁ'],[3,2,'ㅂ'],[5,6,'ㅅ'],[6,0,'ㅇ'],[0,5,'ㅈ'],[0,0,'ㅊ'],[0,1,'ㅋ']]},null,['ㄱㅋ','ㅅㅇ','ㅊㅋ']]];
function e3x32(n,L,tree,lab,ansEdges,names){return {
 prompt:P_([`그림은 ${PYR[n]}의 전개도의 일부분입니다. 이 전개도에 한 개의 삼각형을 더 그려 넣어 전개도를 완성하려고 합니다. 한 개의 삼각형을 붙일 수 있는 변을 모두 찾아 쓰시오.`])+partNet(n,L,tree,lab,null).svg(`${PYR[n]} 전개도의 일부분`,300),
 answer:names.map(x=>'선분 '+x).join(', '),
 solution:ol([`${PYR[n]}은 밑면 1개와 옆면 ${n}개로 이루어지는데, 그림에는 옆면이 ${n-1}개뿐이므로 빠진 옆면 1개를 찾습니다.`,
  `밑면의 변 중 옆면이 붙지 않은 변을 접어 보면, 이웃한 옆면의 밑변과 만나는 변은 이미 옆면이 있는 자리이고, 어느 옆면과도 만나지 않는 변 선분 ${lab.baseName}이 빠진 옆면의 밑변입니다.`,
  `빠진 옆면은 접었을 때 밑면과 붙는 변 1개, 양옆의 옆면과 붙는 옆모서리 2개와 만납니다. 전개도에서 이 세 자리에 해당하는 변은 ${names.map(x=>'선분 '+x).join(', ')}입니다.`,
  `이 세 변 중 어디에 붙여도 다른 면과 겹치지 않으므로, 삼각형을 붙일 수 있는 변은 ${names.map(x=>'선분 '+x).join(', ')}입니다.`])};}

// 2단원 예제 3-3: 직사각형 밑면 사각뿔 전개도 둘레의 차
function rectPyrSvg(a,b,L){const hh=Math.sqrt(L*L-(a*a+b*b)/4),{P,F}=pyramid([[-b/2,a/2],[b/2,a/2],[b/2,-a/2],[-b/2,-a/2]],[0,0,hh]),cv=canvas();
 solid(cv,P,F,{az:0.75,el:0.3,W:200,H:140,fill:k=>['#eee','#d4d4d4','#8c8c8c','#a9a9a9','#c4c4c4'][k],dims:[{a:P[3],b:P[2],t:`${a} cm`},{a:P[2],b:P[1],t:`${b} cm`},{a:P[1],b:P[4],t:`${L} cm`}]});
 return cv.svg(`밑면이 ${a} cm, ${b} cm인 직사각형이고 옆모서리가 ${L} cm인 사각뿔`,250);}
function e3x33(a,b,L){const tot=2*(a+b)+2*(a+2*L)+2*(b+2*L),big=3*L+Math.max(a,b),small=2*a+2*b;return {
 prompt:P_([`그림의 사각뿔에서 밑면은 두 변이 ${a} cm, ${b} cm인 직사각형이고, 옆면의 모서리의 길이는 모두 ${L} cm입니다. 이 도형의 전개도를 여러 가지 방법으로 그릴 때, 전개도의 둘레가 가장 긴 것과 가장 짧은 것의 차는 몇 cm입니까?`])+rectPyrSvg(a,b,L),
 answer:`${2*(big-small)} cm`,
 solution:ol([`전개도의 둘레는 모든 면의 둘레의 합에서 붙어 있는 변의 길이를 두 번씩 뺀 길이이고, 면이 5개이므로 붙어 있는 변은 4군데입니다.`,
  `모든 면의 둘레의 합은 밑면 (${a} + ${b}) × 2 = ${2*(a+b)}(cm), 옆면 (${a} + ${L} + ${L}) × 2 + (${b} + ${L} + ${L}) × 2 = ${2*(a+2*L)+2*(b+2*L)}(cm)이므로 ${tot} cm입니다.`,
  `둘레가 가장 짧으려면 가장 긴 옆모서리(${L} cm)를 많이 붙입니다. 옆면 4개를 부채꼴 모양으로 이으면 ${L} cm가 3군데 붙고, 밑면은 긴 변 ${Math.max(a,b)} cm로 붙입니다. 붙은 길이는 ${L} × 3 + ${Math.max(a,b)} = ${big}(cm)이므로 둘레는 ${tot} − ${big} × 2 = ${tot-2*big}(cm)입니다.`,
  `둘레가 가장 길게 되려면 밑면의 네 변에 옆면 4개를 모두 붙입니다. 붙은 길이는 ${a} + ${b} + ${a} + ${b} = ${small}(cm)이므로 둘레는 ${tot} − ${small} × 2 = ${tot-2*small}(cm)입니다.`,
  `따라서 차는 ${tot-2*small} − ${tot-2*big} = ${2*(big-small)}(cm)입니다.`])};}

// 2단원 예제 3-4 / 같은 구조: 옆면 이등변삼각형, 모서리 합으로 각기둥 높이
function isoSvg(L,b){const cv=canvas(),s=150/L,hh=Math.sqrt(L*L-b*b/4)*s,A=[0,0],B=[-b*s/2,hh],C=[b*s/2,hh],g=[0,hh*0.66];
 cv.poly([A,B,C],'fill:#f4f4f4;'+S);dimArc(cv,A,B,g,`${L} cm`);dimArc(cv,A,C,g,`${L} cm`);dimArc(cv,B,C,g,`${b} cm`);return cv.svg(`두 변이 ${L} cm, 한 변이 ${b} cm인 이등변삼각형`,200);}
function e3x34(L,b,tot){const n=tot/(L+b),h=(tot-2*n*b)/n;return {
 prompt:P_([`그림과 같은 옆면으로 이루어진 각뿔의 모든 모서리의 길이의 합이 ${tot} cm입니다. 이 각뿔과 밑면의 크기와 모양이 같은 각기둥의 모든 모서리의 길이의 합이 각뿔의 모든 모서리의 길이의 합과 같을 때, 각기둥의 높이를 구하시오.`])+isoSvg(L,b),
 answer:`${h} cm`,
 solution:ol([`밑면이 □각형이면 각뿔의 옆모서리 □개는 ${L} cm, 밑면의 변 □개는 ${b} cm이므로 모서리의 합은 (${L} + ${b}) × □ = ${L+b} × □입니다.`,
  `${L+b} × □ = ${tot}이므로 □ = ${n}이고, 밑면은 한 변이 ${b} cm인 ${n}각형입니다.`,
  `각기둥의 두 밑면의 모서리 합은 ${b} × ${n} × 2 = ${2*n*b}(cm)이므로 높이 방향의 모서리 ${n}개의 합은 ${tot} − ${2*n*b} = ${tot-2*n*b}(cm)입니다.`,
  `따라서 각기둥의 높이는 ${tot-2*n*b} ÷ ${n} = ${h}(cm)입니다.`])};}

// 2단원 Mission 2(개념탐구 3): 육각뿔 전개도 둘레의 차
function hexPyrSvg(a,L){const base=regular(6,a,0),R=a,hh=Math.sqrt(L*L-R*R),{P,F}=pyramid(base,[0,0,hh]),cv=canvas();
 solid(cv,P,F,{az:0.1,el:0.22,W:190,H:170,fill:k=>k===4?'#cfcfcf':'#f6f6f6',dims:[{a:P[2],b:P[1],t:`${a} cm`},{a:P[6],b:P[0],t:`${L} cm`}]});
 return cv.svg(`밑면의 한 변이 ${a} cm, 옆모서리가 ${L} cm인 육각뿔`,240);}
function e3m2(a,L){const tot=6*a+6*(a+2*L),big=5*L+a,small=6*a;return {
 prompt:P_([`다음 그림과 같은 육각뿔이 있습니다. 이 도형의 전개도를 여러 가지 방법으로 그릴 때, 전개도의 둘레가 가장 긴 것과 가장 짧은 것의 차는 몇 cm입니까? (단, 밑면은 정육각형이고 옆면은 모두 이등변삼각형입니다.)`])+hexPyrSvg(a,L),
 answer:`${2*(big-small)} cm`,
 solution:ol([`면이 7개이므로 전개도에서 붙어 있는 변은 6군데이고, 모든 면의 둘레의 합은 밑면 ${a} × 6 = ${6*a}(cm)와 옆면 (${a} + ${L} + ${L}) × 6 = ${6*(a+2*L)}(cm)를 더한 ${tot} cm입니다.`,
  `둘레가 가장 짧으려면 옆면 6개를 부채꼴 모양으로 이어 ${L} cm 변 5군데를 붙이고 밑면을 ${a} cm 변 한 군데로 붙입니다. 붙은 길이는 ${L} × 5 + ${a} = ${big}(cm)이므로 둘레는 ${tot} − ${big} × 2 = ${tot-2*big}(cm)입니다.`,
  `둘레가 가장 길게 되려면 밑면의 여섯 변에 옆면을 모두 붙여 ${a} cm 변 6군데만 붙입니다. 붙은 길이는 ${a} × 6 = ${small}(cm)이므로 둘레는 ${tot} − ${small} × 2 = ${tot-2*small}(cm)입니다.`,
  `따라서 차는 ${tot-2*small} − ${tot-2*big} = ${2*(big-small)}(cm)입니다.`])};}

// 2단원 Mission 4(개념탐구 3): 두 전개도로 만든 입체의 구성 요소
function twoNets(n,flipA,flipB){const cv=canvas(),m=Math.floor(n/2),hgt=n===4?1.5:1;
 const pb=prism(regular(n,1,90),hgt),treeP=[];for(let i=0;i<n;i++)treeP.push([0,2+i]);treeP.push([2+m,1]);
 const a=net(cv,pb.P,pb.F,0,treeP,{W:150,H:210,align:flipA?[0,(m+1)%n,m]:[0,m,(m+1)%n]});
 cv.text([-6,10],'가',15,'end');
 const yb=eqPyrN(n),k=Math.floor((n-1)/2),treeY=[];for(let i=1;i<n;i++)treeY.push([i,1+i]);treeY.push([1+k,0]);
 net(cv,yb.P,yb.F,1,treeY,{W:150,H:210,off:[200,0],align:flipB?[1+k,(k+1)%n,k]:[1+k,k,(k+1)%n]});
 cv.text([194,10],'나',15,'end');
 return cv.svg('전개도 가와 나',360);}
function eqPyrN(n){const base=regular(n,1,90),R=1/(2*Math.sin(Math.PI/n));return pyramid(base,[0,0,Math.sqrt(1.6*1.6-R*R)]);}
function gcd(a,b){return b?gcd(b,a%b):a;}
const FL={4:[1,1],5:[1,1],6:[1,1]};
function e3m4(n){const v1=2*n,f1=n+2,e1=3*n,v2=n+1,f2=n+1,e2=2*n;const N1=f1+e1,N2=f2+e2;let num=N1*v2+N2*v1,den=v1*v2;const g=gcd(num,den);num/=g;den/=g;
 const w=Math.floor(num/den),r=num%den;const PN={3:'삼각',4:'사각',5:'오각',6:'육각'}[n];
 const fr=(a,b)=>{const g2=gcd(a,b);return ff(a/g2,b/g2);};
 return {
 prompt:P_([`다음 두 전개도를 접어서 입체도형을 만들었습니다. 가를 접어 만든 입체도형의 꼭짓점의 수를 ㉠개, 면의 수를 ㉡개, 모서리의 수를 ㉢개라 하고, 나를 접어 만든 입체도형의 꼭짓점의 수를 ㉣개, 면의 수를 ㉤개, 모서리의 수를 ㉥개라고 할 때, ${ff('㉡ + ㉢','㉠')} + ${ff('㉤ + ㉥','㉣')}의 값을 구하시오.`])+twoNets(n,FL[n][0],FL[n][1]),
 answer:r?mx(w,r,den):String(w),
 solution:ol([`가는 ${KN[n]}각형 2개와 직사각형 ${n}개로 이루어져 있으므로 ${PN}기둥입니다. ㉠ = ${v1}, ㉡ = ${f1}, ㉢ = ${e1}입니다.`,
  `나는 ${KN[n]}각형 1개와 삼각형 ${n}개로 이루어져 있으므로 ${PN}뿔입니다. ㉣ = ${v2}, ㉤ = ${f2}, ㉥ = ${e2}입니다.`,
  `(㉡ + ㉢) ÷ ㉠ = ${N1} ÷ ${v1} = ${fr(N1,v1)}, (㉤ + ㉥) ÷ ㉣ = ${N2} ÷ ${v2} = ${fr(N2,v2)}입니다.`,
  `두 값을 더하면 ${r?mx(w,r,den):w}입니다.`])};}

// ======================================================================
// 2단원 개념탐구 4: 정팔면체(사각뿔 2개)에서 꼭짓점 ㄴ 둘레의 색칠한 부분을 전개도에
const OC=(()=>{const P=[[0,0,1],[0,-1,0],[1,0,0],[0,1,0],[-1,0,0],[0,0,-1]];// 0:ㄱ(위) 1:ㄴ(앞) 2:오른 3:뒤 4:왼 5:아래
 const F=[[0,1,2],[0,2,3],[0,3,4],[0,4,1],[5,2,1],[5,3,2],[5,4,3],[5,1,4]];return {P,F};})();
function ocShades(){const P=OC.P,F=OC.F,out=[];F.forEach((fc,k)=>{if(!fc.includes(1))return;const o=fc.filter(i=>i!==1);out.push({face:k,pts:[P[1],lerp(P[1],P[o[0]],0.5),lerp(P[1],P[o[1]],0.5)],fill:'#8f8f8f'});});return out;}
function ocSolidSvg(){const P=OC.P,F=OC.F,cv=canvas(),m=i=>lerp(P[1],P[i],0.5);
 solid(cv,P,F,{az:0.42,el:0.32,W:200,H:200,fill:()=>'#fafafa',polys:ocShades().map(s=>({pts:s.pts,st:'fill:#a9a9a9;stroke:none'})),
  segs:[{a:m(0),b:m(2),vis:true,st:S},{a:m(2),b:m(5),vis:true,st:S},{a:m(5),b:m(4),vis:true,st:S},{a:m(4),b:m(0),vis:true,st:S}],
  labels:[{p:P[0],t:'ㄱ',d:[0,-12]},{p:P[1],t:'ㄴ',d:[-14,4]},{p:m(0),t:'ㄷ',d:[-12,-4]},{p:m(4),t:'ㄹ',d:[-8,-10]},{p:m(5),t:'ㅁ',d:[-14,6]},{p:m(2),t:'ㅂ',d:[12,-6]}]});
 return cv.svg('모든 모서리의 길이가 같은 사각뿔 2개를 밑면끼리 붙인 입체도형과 색칠한 부분',240);}
function ocNet(tree,root,al,ans){const P=OC.P,F=OC.F,cv=canvas();
 net(cv,P,F,root,tree,{align:al,W:320,H:230,fill:()=>'#f6f6f6',shades:ans?ocShades():[],labels:[{face:root,v:0,t:'ㄱ'},{face:root,v:1,t:'ㄴ'}]});
 return cv;}
const OCNETS=[[[[0,4],[4,5],[5,6],[6,2],[2,3],[0,1],[3,7]],0,[0,0,2],2],[[[0,1],[1,2],[2,3],[0,4],[1,5],[5,6],[3,7]],0,[0,0,2],2],[[[0,4],[4,5],[5,1],[1,2],[2,6],[6,7],[7,3]],0,[0,0,2],2]];
function e4exp(tree,root,al,k){return {
 prompt:P_([`첫째 그림의 입체도형은 모든 모서리의 길이가 같은 사각뿔 2개를 밑면이 맞붙도록 붙인 것입니다. 이 입체도형으로 둘째 그림의 전개도를 만들 때, 색칠한 부분을 전개도에 나타내어 보시오. (단, 네 점 ㄷ, ㄹ, ㅁ, ㅂ은 모서리의 한가운데 점입니다.)`])+ocSolidSvg()+ocNet(tree,root,al,false).svg('색칠한 부분을 나타낼 전개도',340),
 answer:`전개도에서 점 ㄴ이 되는 꼭짓점 ${k}곳에서, 그 점에 모인 정삼각형마다 ㄴ과 두 모서리의 가운데 점을 이은 작은 삼각형 4개를 색칠`,
 answerVisual:ocNet(tree,root,al,true).svg('색칠한 부분을 나타낸 전개도',340),
 solution:ol([`색칠한 부분은 꼭짓점 ㄴ에 모인 면 4개에서, ㄴ과 ㄴ에서 나간 두 모서리의 한가운데 점을 이은 작은 삼각형 4개입니다.`,
  `전개도에서 ㄱ과 ㄴ이 표시된 정삼각형부터 시작하여, 이웃한 삼각형으로 건너갈 때마다 공통 모서리의 두 끝점이 같다는 것을 이용해 모든 꼭짓점이 입체의 어느 점인지 찾습니다.`,
  `입체에서 ㄴ이 되는 전개도의 꼭짓점은 ${k}곳이고, 그 점에 붙은 정삼각형은 모두 4개입니다.`,
  `이 4개의 정삼각형마다 ㄴ이 되는 꼭짓점과, 그 꼭짓점에서 나간 두 변의 한가운데 점을 이은 작은 삼각형을 색칠합니다.`])};}

// 2단원 Mission 2(개념탐구 4): 삼각뿔의 선을 전개도에 옮기기
function tetra(L,s,base){// 0:ㄱ 1:ㄴ 2:ㄷ 3:ㄹ, ㄴㄷ=ㄷㄹ=s, ㄴㄹ=base, 옆모서리 L
 const yb=-Math.sqrt(s*s-base*base/4),c=(base*base/4-yb*yb)/(2*(-yb))*-1; // 외심 y좌표
 const cy=(yb*yb-base*base/4)/(2*yb),R2=base*base/4+cy*cy,hh=Math.sqrt(L*L-R2);
 const P=[[0,cy,hh],[-base/2,0,0],[0,yb,0],[base/2,0,0]];const F=[[1,2,3],[0,2,3],[0,1,2],[0,1,3]];return {P,F};}// 0 밑면,1 ㄱㄷㄹ,2 ㄱㄴㄷ,3 ㄱㄴㄹ
function tetSolidSvg(L,s,base){const {P,F}=tetra(L,s,base),cv=canvas(),M1=lerp(P[0],P[2],0.5),M2=lerp(P[0],P[3],0.5);
 solid(cv,P,F,{az:0.05,el:0.3,W:170,H:180,fill:k=>k===2?'#d8d8d8':'#f6f6f6',segs:[{face:1,a:P[3],b:M1},{face:1,a:M1,b:M2},{face:3,a:M2,b:P[1]}],
  labels:[{p:P[0],t:'ㄱ',d:[0,-12]},{p:P[1],t:'ㄴ',d:[-14,0]},{p:P[2],t:'ㄷ',d:[0,16]},{p:P[3],t:'ㄹ',d:[13,0]}],
  dims:[{a:P[0],b:P[3],t:`${L} cm`},{a:P[1],b:P[2],t:`${s} cm`},{a:P[2],b:P[3],t:`${s} cm`},{a:P[1],b:P[3],t:`${base} cm`,flip:true,bulge:6,gap:9,lt:0.66}]});
 return cv.svg('선을 그은 삼각뿔',230);}
function tetNet(L,s,base,ans){const {P,F}=tetra(L,s,base),cv=canvas(),M1=lerp(P[0],P[2],0.5),M2=lerp(P[0],P[3],0.5);
 net(cv,P,F,0,[[0,1],[0,2],[2,3]],{align:[0,3,1],W:300,H:200,fill:()=>'#f6f6f6',dims:[{face:0,i:3,j:1,t:`${base} cm`},{face:1,i:0,j:2,t:`${L} cm`}],
  segs:ans?[{face:1,a:P[3],b:M1},{face:1,a:M1,b:M2},{face:3,a:M2,b:P[1]}]:[]});
 return cv;}
function e4m2(L,s,base){return {
 prompt:P_([`그림과 같이 삼각뿔의 꼭짓점 ㄹ에서 꼭짓점 ㄴ까지, 모서리 ㄱㄷ의 가운뎃점과 모서리 ㄱㄹ의 가운뎃점을 지나는 선을 그렸습니다. 아래 전개도 위에 이 선을 그려 보시오.`])+tetSolidSvg(L,s,base)+tetNet(L,s,base,false).svg('삼각뿔의 전개도',320),
 answer:'옆면 ㄱㄷㄹ에 선분 2개(ㄹ에서 ㄱㄷ의 가운뎃점, 그 점에서 ㄱㄹ의 가운뎃점), 옆면 ㄱㄴㄹ에 선분 1개(ㄱㄹ의 가운뎃점에서 ㄴ)',
 answerVisual:tetNet(L,s,base,true).svg('선을 그린 삼각뿔의 전개도',320),
 solution:BASIS(`옆모서리 ㄱㄴ, ㄱㄷ, ㄱㄹ의 길이는 모두 ${L} cm이고, 전개도는 삼각뿔의 겉면이 보이도록 펼친 것입니다.`)+ol([`${base} cm인 변은 밑면의 변 ㄴㄹ뿐이므로, ${base} cm 변이 있는 삼각형이 밑면 ㄴㄷㄹ이고 나머지 꼭짓점이 ㄷ입니다.`,
  `겉면이 보이도록 펼쳤으므로 밑면을 바깥에서 볼 때의 순서로 ㄴ, ㄹ의 자리를 정하면, ${L} cm 변 ㄱㄷ이 표시된 삼각형이 옆면 ㄱㄷㄹ이고 그 끝 꼭짓점이 ㄱ입니다.`,
  `옆면 ㄱㄷㄹ에 ㄹ에서 ㄱㄷ의 가운뎃점까지, 다시 ㄱㄹ의 가운뎃점까지 선분 2개를 긋습니다.`,
  `ㄱㄹ의 가운뎃점에서 ㄴ까지의 선은 옆면 ㄱㄴㄹ 위에 있습니다. 전개도에서 옆면 ㄱㄴㄹ은 옆면 ㄱㄴㄷ의 변 ㄱㄴ에 붙은 삼각형이므로, 그 삼각형에서 ㄱㄹ의 가운뎃점과 ㄴ을 잇습니다.`])};}

// 2단원 Mission 3(개념탐구 4): 사각뿔 겉면의 가장 짧은 선을 전개도에
const SQ=(()=>{const a=2,hh=Math.sqrt(36-8);return pyramid([[-a,-a],[a,-a],[a,a],[-a,a]],[0,0,hh]);})();// 0:ㄴ 1:ㄷ 2:ㄹ 3:ㅁ 4:ㄱ, 면 1 ㄱㄴㄷ 2 ㄱㄷㄹ 3 ㄱㄹㅁ 4 ㄱㅁㄴ
function sqPath(){const P=SQ.P,B=lerp(P[4],P[0],0.5),Sx=lerp(P[0],P[3],0.5);
 // 펼친 그림(면 1→2→밑면)에서 ㅂ과 ㅅ을 곧게 잇고 모서리 ㄱㄷ, ㄷㄹ과 만나는 점을 구함
 const F=SQ.F,pos=unfold(P,F,1,[[1,2],[2,0]]);const b2=to2(P,F,pos,1,B),s2=to2(P,F,pos,0,Sx);
 const hit=(k,i,j)=>{const A=pos[k][i],C=pos[k][j],d=sub(s2,b2),e=sub(C,A),den=d[0]*e[1]-d[1]*e[0],t=((A[0]-b2[0])*e[1]-(A[1]-b2[1])*e[0])/den,u=((A[0]-b2[0])*d[1]-(A[1]-b2[1])*d[0])/den;return lerp(P[i],P[j],u);};
 const X=hit(1,4,1),Y=hit(2,1,2);return {B,Sx,X,Y,segs:[[1,B,X],[2,X,Y],[0,Y,Sx]]};}
function sqSolidSvg(){const P=SQ.P,F=SQ.F,cv=canvas(),pt=sqPath();
 solid(cv,P,F,{az:0.55,el:0.3,W:150,H:200,fill:k=>k===2?'#a9a9a9':'#dadada',segs:pt.segs.map(([k,a,b])=>({face:k,a,b})),dots:[pt.B,pt.Sx],
  labels:[{p:P[4],t:'ㄱ',d:[0,-12]},{p:P[0],t:'ㄴ',d:[-14,4]},{p:P[1],t:'ㄷ',d:[0,16]},{p:P[2],t:'ㄹ',d:[14,2]},{p:P[3],t:'ㅁ',d:[-4,-10]},{p:pt.B,t:'ㅂ',d:[-14,-2]},{p:pt.Sx,t:'ㅅ',d:[4,14]}]});
 return cv.svg('점 ㅂ에서 모서리 ㄷㄹ을 지나 점 ㅅ까지 그은 선이 있는 사각뿔',220);}
function sqNet(tree,ans){const P=SQ.P,F=SQ.F,cv=canvas(),pt=sqPath();
 net(cv,P,F,0,tree,{align:[0,3,0],turn:-Math.PI/2,W:320,H:240,fill:()=>'#e2e2e2',segs:ans?pt.segs.map(([k,a,b])=>({face:k,a,b})):[],
  labels:[{face:0,v:0,t:'ㄴ'},{face:0,v:1,t:'ㄷ'}]});
 return cv;}
function e4m3(tree){return {
 prompt:P_([`첫째 그림과 같은 사각뿔에서 두 점 ㅂ과 ㅅ은 각각 모서리 ㄱㄴ, ㄴㅁ의 한가운데에 있는 점입니다. 이 사각뿔의 겉면을 따라 점 ㅂ에서 점 ㅅ까지 모서리 ㄷㄹ을 지나는 가장 짧은 선을 그었습니다. 둘째 그림의 전개도에 이 선이 지나는 길을 그려 보시오.`])+sqSolidSvg()+sqNet(tree,false).svg('사각뿔의 전개도',340),
 answer:'옆면 ㄱㄴㄷ의 ㅂ(ㄱㄴ의 가운데 점)에서 옆면 ㄱㄷㄹ을 지나 밑면의 ㅅ(ㄴㅁ의 가운데 점)까지 곧게 이은 선',
 answerVisual:sqNet(tree,true).svg('가장 짧은 선을 그린 전개도',340),
 solution:ol([`선은 옆면 ㄱㄴㄷ에서 출발하여 모서리 ㄱㄷ을 건너 옆면 ㄱㄷㄹ로, 모서리 ㄷㄹ을 건너 밑면으로 가서 ㅅ에 닿습니다.`,
  `전개도에서 이 세 면(옆면 ㄱㄴㄷ, 옆면 ㄱㄷㄹ, 밑면)이 차례로 붙어 있으면, 겉면을 따라 가장 짧은 선은 펼친 그림에서 ㅂ과 ㅅ을 곧게 이은 선분입니다.`,
  `전개도에서 밑면의 ㄴ, ㄷ으로 각 꼭짓점을 찾고, 옆면 ㄱㄴㄷ에서 모서리 ㄱㄴ의 가운데 점 ㅂ, 밑면에서 변 ㄴㅁ의 가운데 점 ㅅ을 찾습니다.`,
  `ㅂ과 ㅅ을 잇는 곧은 선이 모서리 ㄱㄷ, ㄷㄹ과 만나는 점을 따라 각 면 위에 선분을 그립니다.`])};}

// 2단원 Mission 6(개념탐구 4): 정사면체에서 점 ㄱ을 지나 네 면을 모두 지나는 가장 짧은 선
function tetLoop(a,u){const R=a/Math.sqrt(3),hh=Math.sqrt(a*a-R*R);const P=[[0,0,hh]].concat([[ -150],[-30],[90]].map(([d])=>[R*Math.cos(d*Math.PI/180),R*Math.sin(d*Math.PI/180),0]));
 // 0 위 꼭짓점 T, 1 왼 Lv, 2 오른 앞 Fv, 3 뒤 Rv  → 그림의 배치에 맞춤
 const F=[[0,1,2],[0,2,3],[1,2,3],[0,1,3]];// 0 앞, 1 오른, 2 밑면, 3 뒤
 const G=lerp(P[0],P[1],u/a);// ㄱ: T에서 u cm
 const seq=[0,1,2,3],tree=[[0,1],[1,2],[2,3]],pos=unfold(P,F,0,tree),g0=to2(P,F,pos,0,G),g3=to2(P,F,pos,3,G);
 const cut=(k,i,j)=>{const A=pos[k][i],C=pos[k][j],d=sub(g3,g0),e=sub(C,A),den=d[0]*e[1]-d[1]*e[0],uu=((A[0]-g0[0])*d[1]-(A[1]-g0[1])*d[0])/den;return lerp(P[i],P[j],uu);};
 const X=cut(0,0,2),Y=cut(1,2,3),Z=cut(2,1,3);return {P,F,G,segs:[[0,G,X],[1,X,Y],[2,Y,Z],[3,Z,G]],L:len(sub(g3,g0))};}
function tetLoopSvg(a,u){const t=tetLoop(a,u),cv=canvas();
 solid(cv,t.P,t.F,{az:0.62,el:0.3,W:190,H:170,fill:()=>'#fbfbfb',segs:t.segs.map(([k,p,q])=>({face:k,a:p,b:q})),dots:[t.G],
  labels:[{p:t.G,t:'ㄱ',d:[-14,-4]}],dims:[{a:t.P[0],b:t.G,t:`${u} cm`},{a:t.G,b:t.P[1],t:`${a-u} cm`}]});
 return cv.svg(`한 변이 ${a} cm인 정삼각형 4개로 만든 삼각뿔과 점 ㄱ에서 그은 선`,240);}
function e4m6(a,u){return {
 prompt:P_([`다음 그림은 한 변이 ${a} cm인 정삼각형 4개를 사용하여 삼각뿔을 만든 것입니다. 점 ㄱ에서 시작하여 모든 면을 지나는 가장 짧은 선을 그으려고 할 때, 지나간 선의 길이의 합은 몇 cm입니까?`])+tetLoopSvg(a,u),
 answer:`${2*a} cm`,
 solution:BASIS('선은 그림과 같이 네 면을 차례로 한 번씩 지난 뒤 다시 점 ㄱ으로 돌아옵니다.')+ol([`선이 지나는 네 면을 지나는 차례대로 펼치면, 정삼각형 4개가 한 줄로 이어진 평행사변형이 됩니다. 이 평행사변형의 긴 변은 ${a} × 2 = ${2*a}(cm)입니다.`,
  `점 ㄱ이 있는 모서리는 펼친 그림의 양 끝(짧은 두 변)에 한 번씩 나타나고, 두 곳 모두 위 꼭짓점에서 ${u} cm 떨어진 자리에 점 ㄱ이 있습니다.`,
  `겉면을 따라 가장 짧은 선은 펼친 그림에서 두 점 ㄱ을 곧게 이은 선분이고, 이 선분은 평행사변형의 긴 변과 나란하므로 길이가 긴 변과 같습니다.`,
  `따라서 선의 길이의 합은 ${2*a} cm입니다. (점 ㄱ의 위치와 상관없이 같습니다.)`])};}

// ======================================================================
const AS_CUT='윗면의 대각선을 따라 세로로 끝까지 자르고, 옆면의 가로선은 그 선이 그어진 조각만 밑면과 나란하게 자름';
const ITEMS={
 '6-1-u1-e1-exploration-1-1':{key:'source61U1E1Exploration1',resultContract:'explanation',answerVisualRequired:false,pool:[exp11(3,7),exp11(2,5),exp11(5,8)]},
 '6-1-u1-e1-exploration-1-2':{key:'source61U1E1Exploration2',resultContract:'explanation',answerVisualRequired:false,pool:[exp12(2,7,3),exp12(3,5,4),exp12(4,9,5)]},
 '6-1-u2-e1-example-1-2':{key:'source61U2E1Example2',resultContract:'single-value',answerVisualRequired:false,answerAssumption:AS_CUT,pool:[ex12([0.5],[]),ex12([1/3,2/3],[]),ex12([1/3,2/3],[0.5])]},
 '6-1-u2-e1-example-1-3':{key:'source61U2E1Example3',resultContract:'single-value',answerVisualRequired:false,pool:[ex13(4,11),ex13(5,13),ex13(3,12)]},
 '6-1-u2-e1-mission-3':{key:'source61U2E1Mission3',resultContract:'single-value',answerVisualRequired:false,pool:[m13(4,7),m13(3,8),m13(5,9)]},
 '6-1-u2-e1-mission-4':{key:'source61U2E1Mission4',resultContract:'single-value',answerVisualRequired:false,pool:[m14(6,120,0,2),m14(5,126,0,2),m14(8,112.5,0,3)]},
 '6-1-u2-e2-exploration-1':{key:'source61U2E2Exploration1',resultContract:'drawing',answerVisualRequired:true,answerAssumption:'뒤쪽 옆면 세 개를 지나는 선은 세로 모서리를 3등분한 점을 지나며 펼치면 한 직선임',
   pool:[e2exp([4,3,2,1,0,5],3,1),e2exp([1,0,5,4,3,2],0,3),e2exp([0,5,4,3,2,1],4,2)]},
 '6-1-u2-e2-mission-3':{key:'source61U2E2Mission3',resultContract:'drawing',answerVisualRequired:true,pool:[e2m3(3,9,8,12,10),e2m3(2,8,8,11,10),e2m3(4,9,12,10,13)]},
 '6-1-u2-e3-exploration-1':{key:'source61U2E3Exploration1',resultContract:'single-value',answerVisualRequired:false,pool:[e3exp(4,8,NETWHY[4]),e3exp(3,2,NETWHY[3]),e3exp(5,15,NETWHY[5])]},
 '6-1-u2-e3-example-3-2':{key:'source61U2E3Example2',resultContract:'multi-value',answerVisualRequired:false,pool:PART.map(x=>e3x32(...x))},
 '6-1-u2-e3-example-3-3':{key:'source61U2E3Example3',resultContract:'single-value',answerVisualRequired:false,pool:[e3x33(8,10,12),e3x33(6,9,10),e3x33(7,10,13)]},
 '6-1-u2-e3-example-3-4':{key:'source61U2E3Example4',resultContract:'single-value',answerVisualRequired:false,pool:[e3x34(8,3,187),e3x34(9,2,165),e3x34(10,4,182)]},
 '6-1-u2-e3-mission-2':{key:'source61U2E3Mission2',resultContract:'single-value',answerVisualRequired:false,pool:[e3m2(9,15),e3m2(8,12),e3m2(6,11)]},
 '6-1-u2-e3-mission-4':{key:'source61U2E3Mission4',resultContract:'single-value',answerVisualRequired:false,pool:[e3m4(5),e3m4(6),e3m4(4)]},
 '6-1-u2-e4-exploration-1':{key:'source61U2E4Exploration1',resultContract:'drawing',answerVisualRequired:true,pool:OCNETS.map(x=>e4exp(...x))},
 '6-1-u2-e4-mission-2':{key:'source61U2E4Mission2',resultContract:'drawing',answerVisualRequired:true,answerAssumption:'옆모서리 세 개의 길이가 같고, 전개도는 겉면이 보이도록 펼친 것임',pool:[e4m2(5,3,4),e4m2(7,4,6),e4m2(8,5,6)]},
 '6-1-u2-e4-mission-3':{key:'source61U2E4Mission3',resultContract:'drawing',answerVisualRequired:true,pool:[e4m3([[0,2],[2,1],[0,4],[0,3]]),e4m3([[0,2],[2,1],[0,3],[3,4]]),e4m3([[0,2],[2,1],[1,4],[0,3]])]},
 '6-1-u2-e4-mission-6':{key:'source61U2E4Mission6',resultContract:'single-value',answerVisualRequired:false,answerAssumption:'선은 네 면을 차례로 한 번씩 지난 뒤 다시 점 ㄱ으로 돌아옴',pool:[e4m6(3,1),e4m6(4,1),e4m6(5,2)]},
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
