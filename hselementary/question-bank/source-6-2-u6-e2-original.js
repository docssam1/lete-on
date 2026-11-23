// 황소 6-2 6단원 개념탐구 2 (원뿔) 원문 구조 유형. 고정 검증 풀 3개씩.
(function(root){'use strict';
const GROUP='6-2-u6-e2';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;

// ---------- 공통 도구 ----------
const F=x=>Math.round(x*10000)/10000;
const N=x=>String(F(x));
const p1=x=>String(Math.round(x*10)/10);
const ST='stroke:#222;stroke-width:1.4px';
const THIN='stroke:#222;stroke-width:1px';
const HID='fill:none;stroke:#222;stroke-width:1.1px;stroke-dasharray:4 3';
const DIM='fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3';
const SHADE='#e8e4dc',DARK='#c9c2b6';
const svg=(w,h,body,label,mw)=>`<svg viewBox="0 0 ${Math.round(w)} ${Math.round(h)}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${mw||360}px;height:auto;display:block;margin:8px auto;font-family:inherit">${body}</svg>`;
const ln=(x1,y1,x2,y2,st)=>`<line x1="${p1(x1)}" y1="${p1(y1)}" x2="${p1(x2)}" y2="${p1(y2)}" style="${st||ST}"/>`;
const ci=(cx,cy,r,fill,st)=>`<circle cx="${p1(cx)}" cy="${p1(cy)}" r="${p1(r)}" style="fill:${fill||'none'};${st||ST}"/>`;
const dot=(x,y)=>`<circle cx="${p1(x)}" cy="${p1(y)}" r="2.6" style="fill:#222"/>`;
const tx=(x,y,s,a,sz)=>`<text x="${p1(x)}" y="${p1(y)}" text-anchor="${a||'middle'}" dominant-baseline="middle" style="font-size:${sz||13}px;fill:#222">${s}</text>`;
const tw=s=>String(s).replace(/<[^>]+>/g,'').length*7.4;
const poly=(pts,st)=>`<polyline points="${pts.map(p=>p1(p[0])+','+p1(p[1])).join(' ')}" style="${st}"/>`;
const pg=(pts,fill)=>`<polygon points="${pts.map(p=>p1(p[0])+','+p1(p[1])).join(' ')}" style="fill:${fill};stroke:none"/>`;
// 선분에 걸친 점선 치수 호와 길이 글자. side=1이면 진행 방향 왼쪽(화면 기준), -1이면 오른쪽.
function dim(x1,y1,x2,y2,lab,side,off){off=off||11;const mx_=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);
 let nx=dy/len,ny=-dx/len;if(side<0){nx=-nx;ny=-ny;}
 const cx=mx_+nx*off*2,cy=my+ny*off*2,ex=8+Math.abs(nx)*tw(lab)/2+Math.abs(ny)*4;
 return `<path d="M${p1(x1)} ${p1(y1)} Q${p1(cx)} ${p1(cy)} ${p1(x2)} ${p1(y2)}" style="${DIM}"/>`+tx(mx_+nx*(off+ex),my+ny*(off+ex),lab);}
function rmark(vx,vy,u,v,s){s=s||7;const a=[vx+u[0]*s,vy+u[1]*s],b=[vx+u[0]*s+v[0]*s,vy+u[1]*s+v[1]*s],c=[vx+v[0]*s,vy+v[1]*s];
 return `<polyline points="${p1(a[0])},${p1(a[1])} ${p1(b[0])},${p1(b[1])} ${p1(c[0])},${p1(c[1])}" style="fill:none;stroke:#222;stroke-width:1px"/>`;}
function arrowHead(x,y,ang){const a=ang*Math.PI/180,l=8,w=4;const bx=x-l*Math.cos(a),by=y-l*Math.sin(a);
 return `<polygon points="${p1(x)},${p1(y)} ${p1(bx-w*Math.sin(a))},${p1(by+w*Math.cos(a))} ${p1(bx+w*Math.sin(a))},${p1(by-w*Math.cos(a))}" style="fill:#222"/>`;}
// 타원 위의 점: 중심 B, 긴 반지름 벡터 a, 앞쪽(보는 쪽) 반지름 벡터 b
const eP=(B,a,b,t)=>[B[0]+a[0]*Math.cos(t)+b[0]*Math.sin(t),B[1]+a[1]*Math.cos(t)+b[1]*Math.sin(t)];
const eArc=(B,a,b,t0,t1,n)=>{const r=[];n=n||40;for(let i=0;i<=n;i++)r.push(eP(B,a,b,t0+(t1-t0)*i/n));return r;};
// 원뿔: 꼭짓점 A, 밑면 중심 B, 밑면 긴 반지름 벡터 a, 앞쪽 벡터 b(꼭짓점에서 먼 쪽이 앞). 뒤쪽 밑면 둘레는 점선.
function cone(A,B,a,b,fill,opt){opt=opt||{};const L=[B[0]-a[0],B[1]-a[1]],R=[B[0]+a[0],B[1]+a[1]];
 const front=eArc(B,a,b,0,Math.PI),back=eArc(B,a,b,Math.PI,2*Math.PI);
 return (fill?pg([A,...front],fill)+pg(eArc(B,a,b,0,2*Math.PI,60),fill):'')
  +poly(front,'fill:none;'+ST)+poly(back,opt.backSolid?'fill:none;'+ST:HID)+ln(A[0],A[1],L[0],L[1])+ln(A[0],A[1],R[0],R[1]);}
// 똑바로 선 원뿔(높이 h px, 반지름 r px)
function upCone(cx,by,h,r,fill,k,opt){k=k||0.28;return cone([cx,by-h],[cx,by],[r,0],[0,r*k],fill,opt);}

// ---------- 개념탐구: 철사로 만든 원뿔 (모선 구하기) ----------
// 원본 수치처럼 모선이 반지름보다 길지 않으면(실제 원뿔이 되지 않음) 그림은 책처럼 낮은 원뿔로 그린다.
function wireFig(r,l,lab,showRadius){const h=l>r*1.15?Math.sqrt(l*l-r*r):r*0.6,s=125/r,rx=r*s,ry=rx*0.33,H=h*s,cx=150,by=H+40;const B=[cx,by],a=[rx,0],b=[0,ry];
 const A=[cx,by-H];const pts={ㄴ:Math.PI,ㄷ:125*Math.PI/180,ㄹ:100*Math.PI/180,ㅂ:290*Math.PI/180,ㅁ:0};
 let body=poly(eArc(B,a,b,0,2*Math.PI,80),'fill:none;'+ST);
 Object.keys(pts).forEach(k=>{const P=eP(B,a,b,pts[k]);body+=ln(A[0],A[1],P[0],P[1]);});
 if(showRadius){body+=dot(cx,by)+ln(cx,by,cx+rx,by,DIM)+dim(cx,by,cx+rx,by,lab,-1,7);
  const lp={ㄱ:[A[0],A[1]-12],ㄴ:[cx-rx-12,by],ㄷ:[eP(B,a,b,pts.ㄷ)[0]-8,eP(B,a,b,pts.ㄷ)[1]+13],ㄹ:[eP(B,a,b,pts.ㄹ)[0]+2,eP(B,a,b,pts.ㄹ)[1]+14],ㅂ:[eP(B,a,b,pts.ㅂ)[0]+11,eP(B,a,b,pts.ㅂ)[1]-10],ㅁ:[cx+rx+12,by]};
  Object.keys(lp).forEach(k=>{body+=tx(lp[k][0],lp[k][1],k);});}
 else body+=dim(A[0],A[1],cx+rx,by,lab,1,9);
 return svg(300,by+ry+22,body,'철사로 만든 원뿔 모양');}
function itemExplore(P){const {r,l}=P,C=F(r*2*3.14),W=F(C+5*l);
 return {prompt:`<p>철사 ${N(W)} cm를 겹치지 않게 모두 사용하여 다음과 같은 원뿔 모양을 만들었습니다. 선분 ㄱㅁ의 길이는 몇 cm인지 구하세요. (원주율: 3.14)</p>`+wireFig(r,l,r+' cm',true),
  answer:`${l} cm`,
  solution:`<ol><li>풀이 기준: 밑면의 반지름을 나타낸 점선은 철사가 아닌 것으로 봅니다.</li><li>철사는 밑면의 둘레와 선분 ㄱㄴ, ㄱㄷ, ㄱㄹ, ㄱㅂ, ㄱㅁ의 5개 모선에 쓰였습니다.</li>`
  +`<li>밑면의 둘레는 ${r}×2×3.14=${N(C)} (cm)입니다.</li>`
  +`<li>모선 5개의 길이의 합은 ${N(W)}−${N(C)}=${5*l} (cm)입니다.</li>`
  +`<li>원뿔의 모선은 길이가 모두 같으므로 선분 ㄱㅁ의 길이는 ${5*l}÷5=${l} (cm)입니다.</li>`
  +(l>r?'':`<li>참고: 원본 수치대로 계산하면 모선이 밑면의 반지름과 같은 ${l} cm가 되어, 실제로는 높이가 없는 납작한 모양이 됩니다.</li>`)+`</ol>`};}

// ---------- 예제 2-1 / Mission 3: 전개도의 중심각 ----------
function itemAngle(P){const {l,r,fn,fd}=P,ang=360*fn/fd;
 return {prompt:`<p>모선의 길이가 ${l} cm, 밑면의 반지름이 ${r} cm인 원뿔이 있습니다. 이 원뿔의 옆면을 전개도로 나타내면 부채꼴이 됩니다. 이 부채꼴의 중심각은 몇 도인지 구하세요.</p>`,
  answer:`${ang}°`,
  solution:`<ol><li>옆면을 펼친 부채꼴의 반지름은 모선의 길이 ${l} cm와 같고, 부채꼴의 호의 길이는 밑면의 둘레 (${r}×2×원주율)와 같습니다.</li>`
  +`<li>반지름이 ${l} cm인 원의 둘레는 (${l}×2×원주율)이므로 부채꼴의 호는 이 원 둘레의 ${r}÷${l}=${ff(fn,fd)}입니다.</li>`
  +`<li>중심각도 360°의 ${ff(fn,fd)}이므로 360°×${ff(fn,fd)}=${ang}°입니다.</li></ol>`};}
function figNet(l,rc,ang){const s=150/l,L=l*s,R=rc*s,O=[150,22],mid=102,a0=(mid-ang/2)*Math.PI/180,a1=(mid+ang/2)*Math.PI/180;
 const E0=[O[0]+L*Math.cos(a0),O[1]+L*Math.sin(a0)],E1=[O[0]+L*Math.cos(a1),O[1]+L*Math.sin(a1)];
 const arc=[];for(let i=0;i<=60;i++){const t=a0+(a1-a0)*i/60;arc.push([O[0]+L*Math.cos(t),O[1]+L*Math.sin(t)]);}
 const tt=a0+(a1-a0)*0.14,C=[O[0]+(L+R)*Math.cos(tt),O[1]+(L+R)*Math.sin(tt)];
 const pts=[O,...arc];const xs=pts.map(p=>p[0]).concat([C[0]+R+50,C[0]-R]),ys=pts.map(p=>p[1]).concat([C[1]+R+14]);
 const minx=Math.min(...xs)-14,maxx=Math.max(...xs),maxy=Math.max(...ys);
 const sh=x=>x-minx;
 const S=p=>[sh(p[0]),p[1]];
 let body=`<polygon points="${pts.map(p=>p1(sh(p[0]))+','+p1(p[1])).join(' ')}" style="fill:${SHADE};${ST}"/>`
  +ci(sh(C[0]),C[1],R,SHADE)+dot(sh(C[0]),C[1])+ln(sh(C[0]),C[1],sh(C[0])+R,C[1],DIM)
  +dim(S(O)[0],O[1],S(E0)[0],E0[1],l+' cm',1,9)+`<path d="M${p1(sh(C[0]))} ${p1(C[1])} Q${p1(sh(C[0])+R/2)} ${p1(C[1]+R*0.45)} ${p1(sh(C[0])+R)} ${p1(C[1])}" style="${DIM}"/>`+tx(sh(C[0])+R+6,C[1]+11,rc+' cm','start');
 return svg(maxx-minx+10,maxy+6,body,'원뿔의 전개도');}
function itemNet(P){const {l,r,fn,fd}=P,ang=360*fn/fd,it=itemAngle(P);
 return {prompt:`<p>그림은 원뿔의 전개도입니다. 옆면인 부채꼴의 중심각의 크기를 구하세요. (원주율: 3.14)</p>`+figNet(l,r,ang),
  answer:it.answer,
  solution:`<ol><li>부채꼴의 호의 길이는 밑면인 원의 둘레와 같으므로 ${r}×2×3.14=${N(r*2*3.14)} (cm)입니다.</li>`
  +`<li>반지름이 ${l} cm인 원의 둘레는 ${l}×2×3.14=${N(l*2*3.14)} (cm)이므로 부채꼴의 호는 이 원 둘레의 ${N(r*2*3.14)}÷${N(l*2*3.14)}=${ff(fn,fd)}입니다.</li>`
  +`<li>중심각은 360°×${ff(fn,fd)}=${ang}°입니다.</li></ol>`};}

// ---------- 예제 2-2: 꼭짓점을 중심으로 굴린 원뿔의 옆면이 지나간 넓이 ----------
function figLying(r,l){const h=Math.sqrt(l*l-r*r),s=170/l,ang=-58*Math.PI/180,u=[Math.cos(ang),Math.sin(ang)],v=[-u[1],u[0]];
 const A=[40,210],B=[A[0]+u[0]*h*s,A[1]+u[1]*h*s],a=[v[0]*r*s,v[1]*r*s],b=[u[0]*r*s*0.3,u[1]*r*s*0.3];
 const tip=[B[0]+a[0]*1.0+u[0]*22,B[1]+a[1]*1.0+u[1]*22];
 const curve=`<path d="M${p1(B[0]-a[0]+u[0]*16)} ${p1(B[1]-a[1]+u[1]*16)} Q${p1(B[0]+u[0]*44)} ${p1(B[1]+u[1]*44)} ${p1(tip[0])} ${p1(tip[1])}" style="fill:none;stroke:#222;stroke-width:1px"/>`;
 const dir=Math.atan2(tip[1]-(B[1]+u[1]*44),tip[0]-(B[0]+u[0]*44))*180/Math.PI;
 return svg(260,235,cone(A,B,a,b,SHADE)+dot(A[0],A[1])+tx(A[0]-12,A[1]+4,'ㄱ')+curve+arrowHead(tip[0],tip[1],dir),'바닥에 눕혀 놓은 원뿔');}
function itemRoll(P){const {r,l,n,fn,fd}=P,arc=F(r*2*3.14*n),circ=F(l*2*3.14),big=F(l*l*3.14),area=F(big*fn/fd);
 return {prompt:`<p>밑면의 반지름이 ${r} cm, 모선의 길이가 ${l} cm인 원뿔을 그림과 같이 바닥에 눕혀 놓았습니다. 꼭짓점 ㄱ을 중심으로 원뿔이 ${n}바퀴 돌 때까지 굴렸을 때, 원뿔의 옆면이 바닥을 지나간 부분의 넓이를 구하세요. (원주율: 3.14)</p>`+figLying(r,l),
  answer:`${N(area)} cm²`,
  solution:`<ol><li>원뿔이 꼭짓점 ㄱ을 중심으로 구르면 옆면이 지나간 부분은 반지름이 모선의 길이 ${l} cm인 부채꼴 모양이 되고, 그 호의 길이는 원뿔이 구른 밑면 둘레의 길이와 같습니다.</li>`
  +`<li>${n}바퀴 동안 밑면 둘레가 굴러간 길이는 ${r}×2×3.14×${n}=${N(arc)} (cm)입니다. 반지름이 ${l} cm인 원의 둘레 ${l}×2×3.14=${N(circ)} (cm)보다 짧으므로 지나간 부분은 겹치지 않습니다.</li>`
  +`<li>지나간 부분은 반지름이 ${l} cm인 원의 ${N(arc)}÷${N(circ)}=${ff(fn,fd)}입니다.</li>`
  +`<li>넓이는 ${l}×${l}×3.14×${ff(fn,fd)}=${N(big)}×${ff(fn,fd)}=${N(area)} (cm²)입니다.</li></ol>`};}

// ---------- 예제 2-3: 모선 위의 점을 지나 한 바퀴 도는 가장 짧은 길 ----------
function figShort(l,d){const r=d/2,h=Math.sqrt(l*l-r*r),s=170/l,H=h*s,rx=r*s,cx=120,by=H+30,ry=rx*0.3;
 return svg(240,by+ry+60,upCone(cx,by,H,rx,SHADE,0.3)+tx(cx,by-H-13,'A')+tx(cx-rx-12,by-8,'B')+tx(cx+rx+12,by-8,'C')
  +dim(cx,by-H,cx-rx,by,l+' cm',-1,10)+ln(cx-rx,by+4,cx-rx,by+ry+22,THIN)+ln(cx+rx,by+4,cx+rx,by+ry+22,THIN)
  +dim(cx-rx,by+ry+18,cx+rx,by+ry+18,d+' cm',-1,5),'원뿔 ABC');}
function itemShort(P){const {l,d}=P,r=d/2,ad=l/2;
 return {prompt:`<p>그림의 원뿔에서 점 B를 출발하여 모선 AC 위의 점 D를 지나 점 B까지 옆면을 따라 가장 짧은 거리로 한 바퀴 움직였습니다. 점 D는 점 A에서 몇 cm 떨어진 점인지 구하세요.</p>`+figShort(l,d),
  answer:`${N(ad)} cm`,
  solution:`<ol><li>옆면을 모선 AB를 따라 잘라 펼치면 반지름이 ${l} cm인 부채꼴이 됩니다. 펼친 그림에서 점 B는 부채꼴의 양 끝 두 곳에 나타나므로 이를 B, B′라고 하겠습니다.</li>`
  +`<li>부채꼴의 호의 길이는 밑면의 둘레와 같으므로 반지름이 ${l} cm인 원 둘레의 ${N(r)}÷${l}=${ff(1,3)}이고, 중심각은 360°×${ff(1,3)}=120°입니다.</li>`
  +`<li>점 C는 호의 한가운데에 있으므로 모선 AC는 중심각을 60°씩 둘로 나눕니다. 가장 짧은 길은 펼친 그림에서 점 B와 점 B′를 잇는 선분이고, 이 선분과 AC가 만나는 점이 D입니다.</li>`
  +`<li>삼각형 ABB′는 AB와 AB′의 길이가 같은 이등변삼각형이고 AD가 꼭지각을 반으로 나누므로, AD는 선분 BB′와 수직입니다. 삼각형 ABD에서 각 BAD는 60°, 각 ADB는 90°, 각 ABD는 30°이므로 삼각형 ABD는 한 변이 ${l} cm인 정삼각형을 반으로 나눈 모양입니다.</li>`
  +`<li>따라서 AD는 ${l}÷2=${N(ad)} (cm)입니다.</li></ol>`};}

// ---------- 예제 2-4: 고깔 3개 포개기 ----------
const HN=['㉮','㉯','㉰'];
function stackTop(order){const placed=[];
 for(const c of order){const h=c.h,r=c.r;
  const ok=t=>{if(t<0)return false;for(const p of placed){if(p.t+p.h>t+h+1e-9)return false;const lo=Math.max(t,p.t),hi=p.t+p.h;
    for(const z of [lo,hi]){if(r*(1-(z-t)/h)<p.r*(1-(z-p.t)/p.h)-1e-9)return false;}}return true;};
  const cands=[0];placed.forEach(p=>{cands.push(p.t+p.h*(1-r/p.r),p.t+p.h-h,p.t-h*(1-p.r/r));});
  const t=Math.min(...cands.filter(ok));placed.push({t,h,r});}
 return Math.max(...placed.map(p=>p.t+p.h));}
function perms(a){return a.length<2?[a]:a.flatMap((x,i)=>perms(a.filter((_,j)=>j!==i)).map(p=>[x,...p]));}
function figHats(hs){const maxH=Math.max(...hs.map(c=>c.h)),s=96/maxH,top=34,by=top+96;let x=14,body='';
 hs.forEach((c,i)=>{const rx=c.r*s,H=c.h*s,cx=x+rx;
  const xd=cx+rx+12;
  body+=upCone(cx,by,H,rx,SHADE,0.28)+ln(cx,by-H,cx,by,DIM)+ln(cx,by,cx+rx,by,DIM)+rmark(cx,by,[0,-1],[1,0],6)
   +ln(cx+3,by-H,xd+4,by-H,'stroke:#8a857c;stroke-width:0.8px')+ln(cx+rx+3,by,xd+4,by,'stroke:#8a857c;stroke-width:0.8px')
   +dim(xd,by-H,xd,by,c.h+' cm',1,6)+dim(cx,by,cx+rx,by,c.r+' cm',-1,13)+tx(x+2,by-H-14,HN[i],'start',14);
  x+=2*rx+66;});
 return svg(x+6,by+52,body,'원뿔 모양의 고깔 세 개',420);}
function hatsData(hs){const all=perms([0,1,2]).map(o=>({o,top:stackTop(o.map(i=>hs[i]))}));
 const mn=Math.min(...all.map(x=>x.top)),mxv=Math.max(...all.map(x=>x.top));
 const lo=all.filter(x=>x.top===mn),hi=all.filter(x=>x.top===mxv);
 if(lo.length!==1||hi.length!==1)throw new Error('hats not unique');
 const ratio=hs.map(c=>c.h/c.r);const S=ratio.indexOf(Math.max(...ratio)),Fl=ratio.indexOf(Math.min(...ratio)),M=3-S-Fl;
 return {all,lo:lo[0],hi:hi[0],S,Fl,M,ratio};}
function hatsPrompt(hs,which){
 return `<p>다음과 같은 원뿔 모양의 고깔이 3개 있습니다. 고깔 위에 고깔을 포개고 또 포개어 3개의 고깔을 모두 포갤 때, 물음에 답하세요. (단, 고깔의 두께는 생각하지 않습니다.)</p>`+figHats(hs)
  +`<p>3개의 고깔을 포갰을 때, 높이를 가장 ${which==='lo'?'낮게':'높게'} 하려면 어떤 순서로 포개야 하나요? 맨 아래 고깔부터 차례로 기호를 쓰세요.</p>`;}
function hatsBasis(hs){return `<li>풀이 기준: 그림의 수는 ${hs.map((c,i)=>`${HN[i]}는 높이 ${c.h} cm, 밑면의 반지름 ${c.r} cm`).join(', ')}로 봅니다.</li>`;}
function listAll(D){return D.all.map(x=>x.o.map(i=>HN[i]).join('→')+' '+N(x.top)+' cm').join(', ');}
function itemHats(hs,which){const D=hatsData(hs),{S,Fl,M}=D,ans=(which==='lo'?D.lo:D.hi).o.map(i=>HN[i]).join(', ');
 const rs=`${HN[S]} ${N(D.ratio[S])}, ${HN[M]} ${N(D.ratio[M])}, ${HN[Fl]} ${N(D.ratio[Fl])}`;
 const st1=`<li>높이를 밑면의 반지름으로 나누면 ${rs}이므로 ${HN[S]}가 가장 뾰족하고 ${HN[Fl]}가 가장 납작합니다.</li>`;
 const st2=`<li>뾰족한 고깔 위에 더 납작한 고깔을 씌우면 위 고깔이 아래 고깔을 덮어 꼭짓점끼리 맞닿거나 바닥에 닿으므로 높이가 거의 늘지 않습니다. 반대로 납작한 고깔 위에 더 뾰족한 고깔을 씌우면 위 고깔의 밑면 테두리가 아래 고깔의 옆면에 걸려 떠오릅니다.</li>`;
 let body;
 if(which==='lo'){const s=hs[S],m=hs[M],f=hs[Fl];
  body=st1+st2+`<li>포갠 높이는 가장 높은 고깔의 높이 ${Math.max(s.h,m.h,f.h)} cm보다 낮아질 수 없습니다.</li>`
  +`<li>${HN[S]} 위에 ${HN[M]}를 씌우면 ${HN[M]}는 ${HN[S]}와 높이가 같고 밑면이 더 넓으므로 ${HN[S]}를 완전히 덮고 바닥에 닿습니다. 높이는 ${m.h} cm입니다.</li>`
  +`<li>그 위에 가장 납작한 ${HN[Fl]}를 씌우면 ${HN[Fl]}의 꼭짓점이 ${HN[M]}의 꼭짓점에 닿아 ${HN[Fl]}의 밑면은 바닥에서 ${m.h}−${f.h}=${m.h-f.h} (cm) 높이에 뜨고, 전체 높이는 ${m.h} cm 그대로입니다.</li>`
  +`<li>여섯 가지 순서의 전체 높이를 모두 구하면 ${listAll(D)}이므로 가장 낮게 하려면 ${ans} 순서로 포갭니다.</li>`;}
 else{const s=hs[S],m=hs[M],f=hs[Fl],t1=m.h-f.h,up=f.h*(f.r-s.r)/f.r,t2=t1+up;
  body=st1+st2+`<li>${HN[M]}를 맨 아래에 놓으면 높이는 ${m.h} cm입니다. 그 위에 더 납작한 ${HN[Fl]}를 씌우면 꼭짓점끼리 맞닿아 ${HN[Fl]}의 밑면은 바닥에서 ${m.h}−${f.h}=${t1} (cm) 높이에 있습니다.</li>`
  +`<li>맨 위에 가장 뾰족한 ${HN[S]}를 씌우면 ${HN[S]}의 밑면 테두리(반지름 ${s.r} cm)가 ${HN[Fl]}의 옆면에 걸립니다. ${HN[Fl]}는 높이 ${f.h} cm를 올라가는 동안 반지름이 ${f.r} cm 줄어들므로 반지름이 ${s.r} cm인 곳은 ${HN[Fl]}의 밑면에서 ${f.h}×(${f.r}−${s.r})÷${f.r}=${N(up)} (cm) 위, 바닥에서 ${t1}+${N(up)}=${N(t2)} (cm) 높이입니다.</li>`
  +`<li>전체 높이는 ${N(t2)}+${s.h}=${N(t2+s.h)} (cm)입니다.</li>`
  +`<li>여섯 가지 순서의 전체 높이를 모두 구하면 ${listAll(D)}이므로 가장 높게 하려면 ${ans} 순서로 포갭니다.</li>`;}
 return {prompt:hatsPrompt(hs,which),answer:ans,solution:`<ol>${hatsBasis(hs)}${body}</ol>`};}

// ---------- Mission 1: 물감 묻힌 원뿔 굴리기 ----------
function figPaint(r,l){const h=Math.sqrt(l*l-r*r),s=110/l,O=[150,130],R=l*s;
 const B=[O[0]-h*s,O[1]],a=[0,-r*s],b=[-r*s*0.3,0];
 return svg(300,262,ci(O[0],O[1],R,'none','fill:none;stroke:#55524d;stroke-width:1.2px;stroke-dasharray:2 3')
  +cone(O,B,a,b,DARK,{backSolid:true})+`<circle cx="${p1(O[0]+5)}" cy="${p1(O[1])}" r="3.5" style="fill:#fff;${THIN}"/>`+tx(O[0]+16,O[1]-10,'ㅇ'),'바닥에 눕힌 원뿔과 원뿔이 굴러간 자리');}
function itemPaint(P){const {c,n}=P,r=F(c/(2*3.14)),tot=F(c*n),l=F(tot/(2*3.14));
 return {prompt:`<p>밑면의 둘레가 ${N(c)} cm인 원뿔의 옆면에 물감을 묻혀 바닥에 눕혀 놓고, 꼭짓점 ㅇ을 중심으로 그림과 같이 굴렸습니다. 원뿔이 ${n}바퀴 돌았을 때 처음 굴리기 시작한 자리로 다시 돌아왔습니다. 원뿔의 모선은 몇 cm인지 구하세요. (단, 원뿔이 지나간 부분에는 모두 물감이 묻고, 원주율은 3.14로 계산합니다.)</p>`+figPaint(r,l),
  answer:`${N(l)} cm`,
  solution:`<ol><li>원뿔이 꼭짓점 ㅇ을 중심으로 한 바퀴 돌아 처음 자리로 오면, 물감이 묻은 부분은 모선의 길이를 반지름으로 하는 원이 됩니다.</li>`
  +`<li>이 원의 둘레는 원뿔의 밑면 둘레의 ${n}배이므로 ${N(c)}×${n}=${N(tot)} (cm)입니다.</li>`
  +`<li>(모선)×2×3.14=${N(tot)}이므로 모선은 ${N(tot)}÷6.28=${N(l)} (cm)입니다.</li></ol>`};}

// ---------- Mission 2: 철사 원뿔의 밑면 반지름 ----------
function itemWire2(P){const {r,l}=P,C=r*2*3,W=C+5*l;
 return {prompt:`<p>길이가 ${W} cm인 철사를 모두 사용하여 다음과 같은 원뿔 모양의 구조물을 만들었습니다. 밑면의 반지름의 길이는 몇 cm인가요? (단, 철사를 이은 부분의 길이는 생각하지 않으며, 원주율은 3으로 계산합니다.)</p>`+wireFig(r,l,l+' cm',false),
  answer:`${r} cm`,
  solution:`<ol><li>철사는 밑면의 둘레와 꼭짓점에서 밑면까지 이은 모선 5개에 쓰였고, 원뿔의 모선은 길이가 모두 ${l} cm입니다.</li>`
  +`<li>모선 5개의 길이의 합은 ${l}×5=${5*l} (cm)이므로 밑면의 둘레는 ${W}−${5*l}=${C} (cm)입니다.</li>`
  +`<li>(반지름)×2×3=${C}이므로 반지름은 ${C}÷6=${r} (cm)입니다.</li>`
  +(l>r?'':`<li>참고: 원본 수치대로 계산하면 반지름(${r} cm)이 모선(${l} cm)보다 길어, 실제로는 이런 원뿔을 만들 수 없습니다.</li>`)+`</ol>`};}

// ---------- Mission 4: 원을 네 부분으로 나누어 만든 원뿔 4개 ----------
function figCut(R){const s=78/R,Rp=R*s,C=[150,150],cuts=[0,90,150,210,360],fills=[DARK,SHADE,DARK,SHADE];let body='';
 for(let i=0;i<4;i++){const a0=cuts[i],a1=cuts[i+1],pts=[C];for(let k=0;k<=30;k++){const t=-(a0+(a1-a0)*k/30)*Math.PI/180;pts.push([C[0]+Rp*Math.cos(t),C[1]+Rp*Math.sin(t)]);}
  body+=pg(pts,fills[i]);
  const m=-((a0+a1)/2)*Math.PI/180,rr=Rp*(a1-a0)/360;body+=ci(C[0]+(Rp+rr+1)*Math.cos(m),C[1]+(Rp+rr+1)*Math.sin(m),rr,fills[i]);}
 body+=ci(C[0],C[1],Rp,'none');
 [90,150,210].forEach(a=>{const t=-a*Math.PI/180;body+=ln(C[0],C[1],C[0]+Rp*Math.cos(t),C[1]+Rp*Math.sin(t),THIN);});
 body+=ln(C[0],C[1],C[0]+Rp,C[1],THIN)+dot(C[0],C[1])+dim(C[0],C[1],C[0]+Rp,C[1],R+' cm',-1,7);
 return svg(300,300,body,'네 부분으로 자른 원과 원뿔 4개의 밑면');}
function itemCut(P){const {R}=P,c=F(R*2*3.14);
 return {prompt:`<p>반지름이 ${R} cm인 원을 그림과 같이 네 부분으로 잘라 크고 작은 원뿔 4개의 옆면으로 사용하였더니 꼭 맞았습니다. 원의 둘레를 (지름)×3.14로 계산할 때, 만든 원뿔 4개의 밑면의 둘레의 합은 몇 cm인지 구하세요.</p>`+figCut(R),
  answer:`${N(c)} cm`,
  solution:`<ol><li>원뿔의 옆면을 펼친 부채꼴의 호의 길이는 그 원뿔의 밑면의 둘레와 같습니다.</li>`
  +`<li>네 부채꼴의 호를 모두 이으면 처음 원의 둘레가 되므로, 원뿔 4개의 밑면의 둘레의 합은 반지름이 ${R} cm인 원의 둘레와 같습니다.</li>`
  +`<li>따라서 ${R*2}×3.14=${N(c)} (cm)입니다.</li></ol>`};}

// ---------- Mission 5: 원뿔에 감은 실 아래쪽 옆면의 넓이 ----------
function figThread(l,r){const h=Math.sqrt(l*l-r*r),s=190/l,H=h*s,rx=r*s,k=0.32,cx=130,by=H+22;const B=[cx,by];
 const al=2*Math.PI*r/l,pts=[],vis=[];
 for(let i=0;i<=120;i++){const ph=al*i/120,rho=l*Math.cos(al/2)/Math.cos(ph-al/2),psi=Math.PI-2*Math.PI*i/120;
  const rad=rho/l*rx,z=(l-rho)/l*H;pts.push([cx+rad*Math.cos(psi),by-z+rad*k*Math.sin(-psi)*-1]);vis.push(Math.sin(-psi)*-1>=0);}
 // psi: 밑면에서의 방향 (ㄱ=왼쪽에서 출발해 앞쪽으로 돈다)
 let seg='',cur=[],cv=vis[0];const flush=()=>{if(cur.length>1)seg+=poly(cur,cv?'fill:none;stroke:#222;stroke-width:1.6px':HID);};
 pts.forEach((p,i)=>{if(vis[i]!==cv){cur.push(p);flush();cur=[p];cv=vis[i];}else cur.push(p);});flush();
 return svg(270,by+rx*k+44,upCone(cx,by,H,rx,SHADE,k)+seg+dot(cx,by)+ln(cx,by,cx+rx,by,DIM)+dim(cx,by,cx+rx,by,r+' cm',-1,6)
  +dim(cx,by-H,cx-rx,by,l+' cm',-1,10)+tx(cx-rx-12,by,'ㄱ')+tx(cx+rx+12,by,'ㄴ'),'실을 감은 원뿔');}
function itemThread(P){const {l,r}=P,sec=F(l*l*3.1/4),tri=l*l/2,ar=F(sec-tri);
 return {prompt:`<p>그림과 같이 원뿔의 밑면의 한 점 ㄱ에서부터 옆면을 지나 가장 짧은 거리로 실을 한 바퀴 감았습니다. 원뿔의 옆면 중 실의 아랫부분(실과 밑면 사이)의 넓이를 구하세요. (원주율: 3.1)</p>`+figThread(l,r),
  answer:`${N(ar)} cm²`,
  solution:`<ol><li>점 ㄱ을 지나는 모선을 따라 옆면을 잘라 펼치면 반지름이 ${l} cm인 부채꼴이 되고, 점 ㄱ은 부채꼴의 양 끝 두 곳에 나타납니다.</li>`
  +`<li>부채꼴의 호의 길이는 밑면의 둘레와 같으므로 반지름이 ${l} cm인 원 둘레의 ${r}÷${l}=${ff(1,4)}이고, 중심각은 360°×${ff(1,4)}=90°입니다.</li>`
  +`<li>가장 짧은 실은 펼친 그림에서 양 끝의 두 점 ㄱ을 잇는 선분이므로, 실의 아랫부분은 부채꼴에서 두 변이 ${l} cm인 직각삼각형을 뺀 부분입니다.</li>`
  +`<li>부채꼴의 넓이는 ${l}×${l}×3.1×${ff(1,4)}=${N(sec)} (cm²), 직각삼각형의 넓이는 ${l}×${l}÷2=${tri} (cm²)입니다.</li>`
  +`<li>실의 아랫부분의 넓이는 ${N(sec)}−${tri}=${N(ar)} (cm²)입니다.</li></ol>`};}

// ---------- Mission 6: 높이가 같은 두 모자 겹쳐 쓰기 ----------
function figCaps(H,R,r){const t=H*(R-r)/R,s=165/(H+t),Hp=H*s,k=0.26,base=Hp+(t*s)+24;
 const yb=base,x1=14+R*s,x2=x1+R*s+30+r*s,dx=x2+r*s+50;
 let body=`<line x1="6" y1="${p1(yb-Hp)}" x2="${p1(dx+6)}" y2="${p1(yb-Hp)}" style="${DIM}"/><line x1="6" y1="${p1(yb)}" x2="${p1(dx+6)}" y2="${p1(yb)}" style="${DIM}"/>`
  +upCone(x1,yb,Hp,R*s,null,k)+upCone(x2,yb,Hp,r*s,null,k)
  +ln(x1,yb,x1+R*s,yb,DIM)+dot(x1,yb)+dim(x1,yb,x1+R*s,yb,R+' cm',-1,7)+ln(x2,yb,x2+r*s,yb,DIM)+dot(x2,yb)+dim(x2,yb,x2+r*s,yb,r+' cm',-1,7)
  +tx(x1,yb-Hp*0.45,'가',null,14)+tx(x2,yb-Hp*0.45,'나',null,14)+dim(dx,yb-Hp,dx,yb,H+' cm',-1,8);
 // 겹쳐 쓴 모습
 const x3=dx+56+R*s,ts=t*s,Rx=R*s,rx=r*s;
 const gA=[x3,yb-Hp],gL=[x3-Rx,yb],gR=[x3+Rx,yb],cL=[x3-rx,yb-ts],cR=[x3+rx,yb-ts];
 body+=poly(eArc([x3,yb],[Rx,0],[0,Rx*k],0,Math.PI),'fill:none;'+ST)+poly(eArc([x3,yb],[Rx,0],[0,Rx*k],Math.PI,2*Math.PI),HID)
  +ln(gL[0],gL[1],cL[0],cL[1])+ln(gR[0],gR[1],cR[0],cR[1])+ln(cL[0],cL[1],gA[0],gA[1],HID)+ln(cR[0],cR[1],gA[0],gA[1],HID)
  +upCone(x3,yb-ts,Hp,rx,null,k);
 return svg(x3+Rx+12,yb+R*s*k+40,body,'높이가 같은 두 모자와 겹쳐 쓴 모습');}
function itemCaps(P){const {H,R,r}=P,step=H/R,t=(R-r)*step;
 return {prompt:`<p>그림의 왼쪽과 같이 높이는 ${H} cm로 같고 밑면의 반지름이 ${R} cm, ${r} cm로 다른 원뿔 모양의 종이 모자 가, 나를 만들었습니다. 오른쪽 그림과 같이 가 모자 위에 나 모자를 씌웠을 때 전체 높이는 몇 cm인지 구하세요. (단, 종이의 두께는 생각하지 않습니다.)</p>`+figCaps(H,R,r),
  answer:`${N(t+H)} cm`,
  solution:`<ol><li>나 모자는 가 모자보다 밑면이 좁으므로, 나 모자의 밑면 테두리가 가 모자의 옆면에 걸립니다. 그곳에서 가 모자의 반지름은 ${r} cm입니다.</li>`
  +`<li>가 모자는 높이 ${H} cm를 올라가는 동안 반지름이 ${R} cm 줄어들므로, ${N(step)} cm 올라갈 때마다 반지름이 1 cm씩 줄어듭니다.</li>`
  +`<li>반지름이 ${R} cm에서 ${r} cm로 ${R-r} cm 줄어드는 곳의 높이는 ${N(step)}×${R-r}=${N(t)} (cm)이므로 나 모자의 밑면은 바닥에서 ${N(t)} cm 높이에 있습니다.</li>`
  +`<li>전체 높이는 ${N(t)}+${H}=${N(t+H)} (cm)입니다.</li></ol>`};}

// ---------- 풀 ----------
const HATS=[[{h:60,r:20},{h:40,r:40},{h:60,r:30}],[{h:32,r:32},{h:48,r:16},{h:48,r:24}],[{h:54,r:27},{h:54,r:18},{h:36,r:36}]];
const POOLS={
 '6-2-u6-e2-exploration-1':{key:'source62U6E2Exploration1',f:itemExplore,answerAssumption:'밑면의 반지름을 나타낸 점선은 철사가 아니다.',ps:[{r:8,l:8},{r:5,l:13},{r:9,l:15}]},
 '6-2-u6-e2-example-1':{key:'source62U6E2Example1',f:itemAngle,ps:[{l:10,r:2.5,fn:1,fd:4},{l:12,r:4,fn:1,fd:3},{l:15,r:2.5,fn:1,fd:6}]},
 '6-2-u6-e2-example-2':{key:'source62U6E2Example2',f:itemRoll,ps:[{r:3,l:10,n:3,fn:9,fd:10},{r:2,l:7,n:3,fn:6,fd:7},{r:4,l:13,n:3,fn:12,fd:13}]},
 '6-2-u6-e2-example-3':{key:'source62U6E2Example3',f:itemShort,ps:[{l:6,d:4},{l:9,d:6},{l:12,d:8}]},
 '6-2-u6-e2-example-4-1':{key:'source62U6E2Example41',f:hs=>itemHats(hs,'lo'),ps:HATS},
 '6-2-u6-e2-example-4-2':{key:'source62U6E2Example42',f:hs=>itemHats(hs,'hi'),ps:HATS},
 '6-2-u6-e2-mission-1':{key:'source62U6E2Mission1',f:itemPaint,ps:[{c:62.8,n:3},{c:31.4,n:4},{c:37.68,n:3}]},
 '6-2-u6-e2-mission-2':{key:'source62U6E2Mission2',f:itemWire2,ps:[{r:11,l:9},{r:8,l:10},{r:5,l:13}]},
 '6-2-u6-e2-mission-3':{key:'source62U6E2Mission3',f:itemNet,ps:[{l:8,r:2,fn:1,fd:4},{l:9,r:3,fn:1,fd:3},{l:10,r:4,fn:2,fd:5}]},
 '6-2-u6-e2-mission-4':{key:'source62U6E2Mission4',f:itemCut,ps:[{R:8},{R:6},{R:10}]},
 '6-2-u6-e2-mission-5':{key:'source62U6E2Mission5',f:itemThread,ps:[{l:12,r:3},{l:8,r:2},{l:16,r:4}]},
 '6-2-u6-e2-mission-6':{key:'source62U6E2Mission6',f:itemCaps,ps:[{H:15,R:5,r:3},{H:12,R:6,r:4},{H:20,R:5,r:3}]},
};
const ITEMS={};
Object.keys(POOLS).forEach(id=>{const P=POOLS[id];ITEMS[id]={key:P.key,resultContract:P.resultContract||'single-value',answerVisualRequired:false,
 ...(P.answerAssumption?{answerAssumption:P.answerAssumption}:{}),pool:P.ps.map(p=>P.f(p))};});

function build(id,variant){const it=ITEMS[id],i=((variant|0)%it.pool.length+it.pool.length)%it.pool.length,p=it.pool[i];
 return {prompt:wrap(id,i,p.prompt),answer:p.answer,solution:wrap(id,i,p.solution),...(p.answerVisual?{answerVisual:p.answerVisual,answerKeyVisual:true}:{}),
  automaticGrading:false,resultContract:it.resultContract||'single-value',sourceItemId:id,generator:it.key,generationMode:'fixed-verified-pool',
  verifiedPoolIndex:i,variant:i,verifiedVariantCount:it.pool.length,verifiedVariantTarget:3,sourceStructurePreserved:true,sourceExact:false,
  publisherAnswerVerified:false,officialAnswerVerified:false,answerVisualRequired:!!it.answerVisualRequired,...(it.answerAssumption?{answerAssumption:it.answerAssumption}:{})};}
function install(target){const api=target&&target.HSE_GENERATORS;if(!api||typeof api.generatorKey!=='function'||typeof api.generate!=='function')return false;
 const flag='__orig_'+GROUP.replace(/-/g,'_');if(api[flag])return true;
 const pk=api.generatorKey.bind(api),pg_=api.generate.bind(api),keys=new Set(Object.values(ITEMS).map(x=>x.key));
 const owns=t=>t&&(ITEMS[t.sourceItemId]||keys.has(t.generatorKey));
 const ok=t=>{const it=t&&ITEMS[t.sourceItemId];return !!it&&t.id===t.sourceItemId&&t.generatorKey===it.key&&t.reviewLocked===false&&t.sourceVerified===true;};
 api.generatorKey=function(t){return owns(t)?(ok(t)?ITEMS[t.sourceItemId].key:''):pk(t);};
 api.generate=function(t,rank,difficulty,seed,variant){return owns(t)?(ok(t)?build(t.sourceItemId,variant===undefined?0:variant):null):pg_(t,rank,difficulty,seed,variant);};
 if(Array.isArray(api.names))keys.forEach(k=>{if(!api.names.includes(k))api.names.push(k);});
 Object.defineProperty(api,flag,{value:true});return true;}
const exported=Object.freeze({GROUP,ITEMS,build,install});
root['HSE_ORIG_'+GROUP.replace(/-/g,'_')]=exported;install(root);
})(typeof window!=='undefined'?window:globalThis);
