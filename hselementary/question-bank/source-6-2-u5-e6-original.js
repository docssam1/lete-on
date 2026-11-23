// 황소 6-2 5단원 개념탐구 6 (여러 가지 문제: 원 위의 각, 겹친 넓이) 원문 구조 유형. 고정 검증 풀 3개씩.
(function(root){'use strict';
const GROUP='6-2-u5-e6';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;

// ---------- 공통 도구 ----------
const F=x=>Math.round(x*10000)/10000;
const N=x=>String(F(x));
const p1=x=>String(Math.round(x*10)/10);
const ST='stroke:#222;stroke-width:1.4px';
const THIN='stroke:#222;stroke-width:1px';
const DASH='stroke:#222;stroke-width:1.1px;stroke-dasharray:5 4';
const DIM='fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3';
const SHADE='#e8e4dc';
const D2R=Math.PI/180;
const svg=(w,h,body,label)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:340px;height:auto;display:block;margin:8px auto;font-family:inherit">${body}</svg>`;
const ln=(a,b,st)=>`<line x1="${p1(a[0])}" y1="${p1(a[1])}" x2="${p1(b[0])}" y2="${p1(b[1])}" style="${st||ST}"/>`;
const pl=(pts,fill,st)=>`<polygon points="${pts.map(p=>p1(p[0])+','+p1(p[1])).join(' ')}" style="fill:${fill||'none'};${st||ST}"/>`;
const ci=(cx,cy,r,fill,st)=>`<circle cx="${p1(cx)}" cy="${p1(cy)}" r="${p1(r)}" style="fill:${fill||'none'};${st||ST}"/>`;
const dot=(p,r)=>`<circle cx="${p1(p[0])}" cy="${p1(p[1])}" r="${r||2.6}" style="fill:#222"/>`;
const tx=(x,y,s,a,sz)=>`<text x="${p1(x)}" y="${p1(y)}" text-anchor="${a||'middle'}" dominant-baseline="middle" style="font-size:${sz||14}px;fill:#222">${s}</text>`;
const tw=s=>String(s).replace(/<[^>]+>/g,'').length*7.4;
// 원 위의 점: t는 맨 위에서 시계 반대 방향(왼쪽으로)으로 잰 각
const onC=(c,R,t)=>[c[0]-R*Math.sin(t*D2R),c[1]-R*Math.cos(t*D2R)];
function inter(a,b,c,d){const den=(b[0]-a[0])*(d[1]-c[1])-(b[1]-a[1])*(d[0]-c[0]);const t=((c[0]-a[0])*(d[1]-c[1])-(c[1]-a[1])*(d[0]-c[0]))/den;return [a[0]+t*(b[0]-a[0]),a[1]+t*(b[1]-a[1])];}
// 꼭짓점 V에서 A쪽과 B쪽 사이의 각호(작은 쪽), lab이 있으면 이등분선 위에 글자
function ang(V,A,B,r,lab,off){const a1=Math.atan2(A[1]-V[1],A[0]-V[0]),a2=Math.atan2(B[1]-V[1],B[0]-V[0]);
 const s=[V[0]+r*Math.cos(a1),V[1]+r*Math.sin(a1)],e=[V[0]+r*Math.cos(a2),V[1]+r*Math.sin(a2)];
 const cr=Math.cos(a1)*Math.sin(a2)-Math.sin(a1)*Math.cos(a2);
 let o=`<path d="M${p1(s[0])} ${p1(s[1])} A${r} ${r} 0 0 ${cr>0?1:0} ${p1(e[0])} ${p1(e[1])}" style="fill:none;stroke:#222;stroke-width:1px"/>`;
 if(lab){let bx=Math.cos(a1)+Math.cos(a2),by=Math.sin(a1)+Math.sin(a2);const l=Math.hypot(bx,by);bx/=l;by/=l;const d=r+(off||12);o+=tx(V[0]+bx*d,V[1]+by*d,lab);}
 return o;}
function dim(a,b,lab,side,off){off=off||10;const mx_=(a[0]+b[0])/2,my=(a[1]+b[1])/2,dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy);
 let nx=dy/len,ny=-dx/len;if(side<0){nx=-nx;ny=-ny;}
 const cx=mx_+nx*off*2,cy=my+ny*off*2,ex=8+Math.abs(nx)*tw(lab)/2+Math.abs(ny)*4;
 return `<path d="M${p1(a[0])} ${p1(a[1])} Q${p1(cx)} ${p1(cy)} ${p1(b[0])} ${p1(b[1])}" style="${DIM}"/>`+tx(mx_+nx*(off+ex),my+ny*(off+ex),lab,'middle',13);}
function rmark(V,u,v,s){s=s||9;const a=[V[0]+u[0]*s,V[1]+u[1]*s],b=[V[0]+u[0]*s+v[0]*s,V[1]+u[1]*s+v[1]*s],c=[V[0]+v[0]*s,V[1]+v[1]*s];
 return `<polyline points="${p1(a[0])},${p1(a[1])} ${p1(b[0])},${p1(b[1])} ${p1(c[0])},${p1(c[1])}" style="fill:none;stroke:#222;stroke-width:1px"/>`;}
function arrowHead(p,dir){const a=Math.atan2(dir[1],dir[0]),l=8,w=4;const bx=p[0]-l*Math.cos(a),by=p[1]-l*Math.sin(a);
 return `<polygon points="${p1(p[0])},${p1(p[1])} ${p1(bx-w*Math.sin(a))},${p1(by+w*Math.cos(a))} ${p1(bx+w*Math.sin(a))},${p1(by-w*Math.cos(a))}" style="fill:#222"/>`;}
const PNAME={3:'정삼각형',4:'정사각형',5:'정오각형',6:'정육각형',8:'정팔각형'};
const C0=[150,152],R0=112;
const circleDots=(n)=>{let o='';for(let k=0;k<n;k++)o+=dot(onC(C0,R0,360*k/n));return o;};
const lbl=(t,s,extra)=>{const p=onC(C0,R0+(extra||16),t);return tx(p[0],p[1],s);};

// ---------- 개념탐구: N등분 점 4개로 만든 사각형의 두 대각선이 이루는 작은 각 ----------
function itemExplore(P){const {n,q}=P,[a,b,c,d]=q,h=360/n/2;
 const V=q.map(k=>onC(C0,R0,360*k/n)),X=inter(V[0],V[2],V[1],V[3]);
 const s1=(b-a)+(d-c),s2=(c-b)+(n-d+a),small=Math.min(s1,s2)*h,big=Math.max(s1,s2)*h;
 const fig=svg(300,304,ci(C0[0],C0[1],R0)+circleDots(n)+dot(C0,2.4)
  +pl(V)+ln(V[0],V[2],DASH)+ln(V[1],V[3],DASH)+ang(X,V[2],V[3],16),'원 위의 점과 내접 사각형');
 const arcs=[b-a,c-b,d-c,n-d+a];
 return {prompt:`<p>그림과 같이 원의 둘레를 ${n}등분하는 점 ${n}개가 있습니다. 이 가운데 4개의 점을 이어 원에 꼭 맞게 들어가는 사각형을 만들었습니다. 이 사각형의 두 대각선이 만나서 생기는 각 중 작은 각의 크기를 구하세요.</p>`+fig,
  answer:`${N(small)}°`,
  solution:`<ol><li>둘레를 ${n}등분했으므로 이웃한 두 점과 원의 중심이 이루는 각은 360÷${n}=${360/n}°입니다. 원 위의 한 점에서 한 칸의 호를 바라보는 각은 그 절반인 ${N(h)}°입니다. (중심과 이어 생기는 이등변삼각형으로 확인할 수 있습니다.)</li>`
  +`<li>사각형의 네 변이 자르는 호는 맨 위 꼭짓점부터 차례로 ${arcs.join('칸, ')}칸입니다.</li>`
  +`<li>두 대각선이 만나는 점과 사각형의 한 변으로 삼각형을 만들면, 만나는 점에서의 바깥각은 나머지 두 각의 합입니다. 그 두 각은 원 위에서 서로 마주 보는 두 변의 호를 바라보는 각이므로, 두 대각선이 이루는 각은 마주 보는 두 호의 칸 수의 합에 ${N(h)}°를 곱한 것과 같습니다.</li>`
  +`<li>(${arcs[0]}+${arcs[2]})×${N(h)}=${N(s1*h)}°, (${arcs[1]}+${arcs[3]})×${N(h)}=${N(s2*h)}°이고, 두 각의 합은 180°입니다.</li>`
  +`<li>따라서 작은 각의 크기는 ${N(small)}°입니다.</li></ol>`};}

// ---------- 예제 1: 원 안의 두 정다각형, 반지름과 변이 만나 생기는 각 ㉮ ----------
// n: 변이 ㉮를 이루는 정다각형, m: 반지름이 이어진 정다각형(맨 위 꼭짓점 공유), k: m각형의 k번째 꼭짓점, j: n각형의 j번째와 j+1번째 꼭짓점 사이 변
function itemEx1(P){const {n,m,k,j}=P,cn=360/n,cm=360/m,tH=k*cm,tV=(j+1)*cn,diff=tV-tH,base=(180-cn)/2,ans=180-diff-base;
 const A=[...Array(n)].map((_,i)=>onC(C0,R0,cn*i)),B=[...Array(m)].map((_,i)=>onC(C0,R0,cm*i));
 const H=onC(C0,R0,tH),V1=onC(C0,R0,j*cn),V2=onC(C0,R0,tV),X=inter(C0,H,V1,V2);
 const fig=svg(300,304,ci(C0[0],C0[1],R0)+pl(A)+pl(B)+ln(C0,H)+dot(C0)+tx(C0[0]+4,C0[1]+14,'ㅇ','start')+ang(X,C0,V2,15,'㉮',10),'원 안의 두 정다각형');
 return {prompt:`<p>다음 그림은 원 안에 ${PNAME[n]}과 ${PNAME[m]}을 그린 것입니다. 점 ㅇ이 원의 중심일 때, 각 ㉮의 크기를 구하세요.</p>`+fig,
  answer:`${N(ans)}°`,
  solution:`<ol><li>풀이 기준: 그림처럼 ${PNAME[n]}과 ${PNAME[m]}은 원 안에 꼭 맞게 그려져 있고, 두 도형은 맨 위의 꼭짓점을 함께 씁니다.</li><li>원의 중심 ㅇ에서 보면 ${PNAME[m]}의 이웃한 꼭짓점 사이의 각은 360÷${m}=${cm}°, ${PNAME[n]}의 이웃한 꼭짓점 사이의 각은 360÷${n}=${cn}°입니다.</li>`
  +`<li>맨 위 꼭짓점에서 왼쪽으로 돌며 재면, 점 ㅇ과 이은 ${PNAME[m]}의 꼭짓점까지는 ${cm}×${k}=${tH}°, ㉮를 이루는 ${PNAME[n]}의 변의 아래쪽 끝 꼭짓점까지는 ${cn}×${j+1}=${tV}°입니다. 그래서 점 ㅇ에서 두 꼭짓점을 바라보는 각은 ${tV}−${tH}=${diff}°입니다.</li>`
  +`<li>점 ㅇ과 ${PNAME[n]}의 이웃한 두 꼭짓점을 이은 삼각형은 두 변이 반지름인 이등변삼각형이므로, 밑각은 (180−${cn})÷2=${N(base)}°입니다.</li>`
  +`<li>점 ㅇ, 두 선이 만나는 점, 아래쪽 끝 꼭짓점으로 이루어진 삼각형에서 ㉮=180−${diff}−${N(base)}=${N(ans)}°입니다.</li></ol>`};}

// ---------- 예제 2: 원의 일부, 중심각으로 각 ㄱㄴㄷ ----------
function itemEx2(P){const {c}=P,ans=(360-c)/2;
 const O=[44,196],R=158,mid=22,pt=a=>[O[0]+R*Math.cos(a*D2R),O[1]-R*Math.sin(a*D2R)];
 const G=pt(mid+c/2),L=pt(mid+c/2-c*0.32),D=pt(mid-c/2),s=pt(mid+c/2+14),e=pt(mid-c/2-16);
 const arc=`<path d="M${p1(s[0])} ${p1(s[1])} A${R} ${R} 0 0 1 ${p1(e[0])} ${p1(e[1])}" style="fill:none;${ST}"/>`;
 const out=(p,s_)=>{const dx=p[0]-O[0],dy=p[1]-O[1],l=Math.hypot(dx,dy);return tx(p[0]+dx/l*15,p[1]+dy/l*15,s_);};
 const fig=svg(240,330,arc+ln(O,G)+ln(O,D)+ln(G,L)+ln(L,D)+dot(O)+tx(O[0]-6,O[1]+14,'ㅇ','end')
  +ang(O,G,D,22,c+'°',18)+ang(L,G,D,13)+out(G,'ㄱ')+out(L,'ㄴ')+out(D,'ㄷ'),'원의 일부와 사각형 ㅇㄱㄴㄷ');
 return {prompt:`<p>그림은 점 ㅇ을 중심으로 하는 원의 일부를 그린 것입니다. 각 ㄱㅇㄷ의 크기가 ${c}°일 때, 각 ㄱㄴㄷ의 크기를 구하세요.</p>`+fig,
  answer:`${N(ans)}°`,
  solution:`<ol><li>점 ㅇ과 점 ㄴ을 이으면 선분 ㅇㄱ, ㅇㄴ, ㅇㄷ은 모두 반지름이므로 삼각형 ㅇㄱㄴ과 삼각형 ㅇㄴㄷ은 이등변삼각형입니다.</li>`
  +`<li>각 ㅇㄱㄴ=각 ㅇㄴㄱ=●, 각 ㅇㄴㄷ=각 ㅇㄷㄴ=▲라고 하면 각 ㄱㄴㄷ=●+▲입니다.</li>`
  +`<li>사각형 ㅇㄱㄴㄷ의 네 각의 합은 360°이므로 ${c}+●+(●+▲)+▲=360, 즉 (●+▲)×2=360−${c}=${360-c}입니다.</li>`
  +`<li>따라서 각 ㄱㄴㄷ=●+▲=${360-c}÷2=${N(ans)}°입니다.</li></ol>`};}

// ---------- 예제 3: 겹쳐 놓은 두 원, ㉮=㉯일 때 두 중심 사이의 거리 ----------
function itemEx3(P){const {dia}=P,r=dia/2,q=r*r*3.1/4,rect=2*q,d=rect/r;
 const R=72,dp=d/r*R,cx1=30+R,cx2=cx1+dp,cy=24+R,top=cy-R,hx=dp/2,iy=cy-Math.sqrt(R*R-hx*hx),mid=cx1+hx;
 const shade=`<path d="M${p1(cx1)} ${p1(top)} A${R} ${R} 0 0 1 ${p1(mid)} ${p1(iy)} A${R} ${R} 0 0 1 ${p1(cx2)} ${p1(top)} Z" style="fill:${SHADE};stroke:none"/>`;
 const fig=svg(Math.round(cx2+R+30),Math.round(cy+R+20),shade+ci(cx1,cy,R)+ci(cx2,cy,R)+ln([cx1,top],[cx2,top])+ln([cx1,top],[cx1,cy])+ln([cx2,top],[cx2,cy])+ln([cx1,cy],[cx2,cy])
  +dot([cx1,cy])+dot([cx2,cy])+tx(cx1-8,cy,'ㄱ','end')+tx(cx2+8,cy,'ㄴ','start')+tx(mid,cy-(cy-iy)*0.45,'㉮')+tx(mid,(top+iy)/2+2,'㉯',undefined,12),'겹쳐 놓은 두 원');
 return {prompt:`<p>지름이 ${dia} cm인 원 두 개를 그림과 같이 겹쳐 놓았습니다. ㉮와 ㉯의 넓이가 서로 같을 때, 선분 ㄱㄴ의 길이를 구하세요. (단, 두 점 ㄱ, ㄴ은 각각 두 원의 중심이고, 원주율은 3.1로 계산합니다.)</p>`+fig,
  answer:`${N(d)} cm`,
  solution:`<ol><li>원의 반지름은 ${dia}÷2=${N(r)} (cm)이고, 그림의 직사각형은 가로가 선분 ㄱㄴ, 세로가 ${N(r)} cm입니다.</li>`
  +`<li>직사각형은 두 원에서 각각 ${ff(1,4)}만큼씩을 합한 것에서 두 번 겹친 ㉮를 한 번 빼고, 빈 곳 ㉯를 더한 것과 같습니다. ㉮와 ㉯의 넓이가 같으므로 직사각형의 넓이는 원의 ${ff(1,4)} 두 개의 넓이와 같습니다.</li>`
  +`<li>원의 ${ff(1,4)} 두 개의 넓이는 ${N(r)}×${N(r)}×3.1×${ff(1,4)}×2=${N(rect)} (cm²)입니다.</li>`
  +`<li>선분 ㄱㄴ의 길이는 ${N(rect)}÷${N(r)}=${N(d)} (cm)입니다.</li></ol>`};}

// ---------- 예제 4: 겹친 넓이로 삼각형과 원의 넓이 비 ----------
const gcd=(a,b)=>b?gcd(b,a%b):a;
function figTriCircle(){const c=[214,104],R=66;
 return svg(300,206,pl([[20,22],[20,186],[204,104]])+ci(c[0],c[1],R)+dot([c[0]+6,c[1]]),'겹쳐진 삼각형과 원');}
function itemEx4(P){const {a,b,c}=P;// 삼각형의 1/a, 원의 b/c
 const g=gcd(a*b,c),x=a*b/g,y=c/g;
 return {prompt:`<p>그림과 같이 삼각형과 원이 겹쳐져 있습니다. 겹쳐진 부분의 넓이는 삼각형 넓이의 ${ff(1,a)}이고, 원 넓이의 ${ff(b,c)}일 때, (삼각형의 넓이) : (원의 넓이)를 가장 간단한 자연수의 비로 나타내세요. (원주율: 3.14)</p>`+figTriCircle(),
  answer:`${x} : ${y}`,
  solution:`<ol><li>겹쳐진 부분의 넓이를 □라고 하면 삼각형의 넓이는 □×${a}입니다.</li>`
  +`<li>□는 원 넓이의 ${ff(b,c)}이므로 원의 넓이는 □÷${b}×${c}=□×${b===1?c:ff(c,b)}입니다.</li>`
  +`<li>(삼각형의 넓이) : (원의 넓이)=${a} : ${b===1?c:ff(c,b)}이고, 각 항에 ${b}를 곱하면 ${a*b} : ${c}입니다.</li>`
  +(g>1?`<li>각 항을 ${g}로 나누면 ${x} : ${y}입니다.</li>`:'')
  +`<li>따라서 가장 간단한 자연수의 비는 ${x} : ${y}입니다. (원주율은 쓰이지 않습니다.)</li></ol>`};}

// ---------- Mission 1: 12등분한 원 위의 사각형 ㄱㄴㄷㄹ의 각 ㄱ, 각 ㄴ ----------
function itemM1(P){const {q}=P,n=12,names=['ㄱ','ㄴ','ㄷ','ㄹ'];
 const V=q.map(k=>onC(C0,R0,30*k));
 const arcs=[q[1]-q[0],q[2]-q[1],q[3]-q[2],n-q[3]+q[0]];// ㄱㄴ, ㄴㄷ, ㄷㄹ, ㄹㄱ
 const cen=arcs.map(x=>30*x),base=cen.map(x=>(180-x)/2);
 const aG=base[3]+base[0],aN=base[0]+base[1];
 const fig=svg(300,304,ci(C0[0],C0[1],R0)+circleDots(n)+pl(V)+ang(V[0],V[3],V[1],18)+ang(V[1],V[0],V[2],18)+q.map((k,i)=>lbl(30*k,names[i],18)).join(''),'12등분한 원 위의 사각형');
 const pair=['ㄱㄴ','ㄴㄷ','ㄷㄹ','ㄹㄱ'];
 return {prompt:`<p>그림에서 원 위에 있는 12개의 점은 원의 둘레를 12등분합니다. 각 ㄱ과 각 ㄴ의 크기를 각각 구하세요.</p>`+fig,
  answer:`각 ㄱ ${N(aG)}°, 각 ㄴ ${N(aN)}°`,
  solution:`<ol><li>원의 중심을 ㅇ이라 하고 ㅇ과 네 꼭짓점을 이으면, 두 변이 반지름인 이등변삼각형 4개가 생깁니다. 12등분이므로 한 칸에 대한 중심각은 360÷12=30°입니다.</li>`
  +`<li>`+pair.map((p,i)=>`변 ${p}은 ${arcs[i]}칸이므로 중심각 ${cen[i]}°, 밑각 (180−${cen[i]})÷2=${N(base[i])}°`).join('; ')+`입니다.</li>`
  +`<li>각 ㄱ은 삼각형 ㅇㄹㄱ과 ㅇㄱㄴ의 밑각을 더한 것이므로 ${N(base[3])}+${N(base[0])}=${N(aG)}°입니다.</li>`
  +`<li>각 ㄴ은 삼각형 ㅇㄱㄴ과 ㅇㄴㄷ의 밑각을 더한 것이므로 ${N(base[0])}+${N(base[1])}=${N(aN)}°입니다.</li></ol>`};}

// ---------- Mission 2: N등분한 원에서 두 각 ㉮, ㉯ ----------
// T: 위 점, L: 왼쪽 점, R: 오른쪽 점, A: ㉮의 꼭짓점 (모두 맨 위에서 시계 반대 방향 칸 번호)
function itemM2(P){const {n,T,L,R,A}=P,h=180/n,c1=L-T,c2=R-A,a=c1*h,b=(c1+c2)*h;
 const pT=onC(C0,R0,360*T/n),pL=onC(C0,R0,360*L/n),pR=onC(C0,R0,360*R/n),pA=onC(C0,R0,360*A/n),X=inter(pT,pA,pL,pR);
 const fig=svg(300,304,ci(C0[0],C0[1],R0)+circleDots(n)+ln(pT,pA)+ln(pL,pR)+ln(pL,pA)+ang(pA,pT,pL,24,'㉮',12)+ang(X,pT,pL,18,'㉯',12),'원 위의 점을 이은 선분');
 return {prompt:`<p>그림에서 원 위에 있는 ${n}개의 점은 원의 둘레를 ${n}등분하는 점들입니다. 각 ㉮와 각 ㉯의 크기를 각각 구하세요.</p>`+fig,
  answer:`㉮ ${N(a)}°, ㉯ ${N(b)}°`,
  solution:`<ol><li>둘레를 ${n}등분했으므로 한 칸에 대한 중심각은 360÷${n}=${360/n}°이고, 원 위의 한 점에서 한 칸의 호를 바라보는 각은 그 절반인 ${N(h)}°입니다. (중심과 이어 생기는 이등변삼각형으로 확인할 수 있습니다.)</li>`
  +`<li>㉮는 원 위의 점에서 맨 위 점과 왼쪽 점 사이의 호 ${c1}칸을 바라보는 각이므로 ㉮=${N(h)}×${c1}=${N(a)}°입니다.</li>`
  +`<li>왼쪽 점에서 ㉮의 꼭짓점과 오른쪽 점 사이의 호 ${c2}칸을 바라보는 각은 ${N(h)}×${c2}=${N(c2*h)}°입니다.</li>`
  +`<li>㉯는 왼쪽 점, ㉮의 꼭짓점, 두 선분이 만나는 점으로 이루어진 삼각형의 바깥각이므로 나머지 두 각의 합과 같습니다. ㉯=${N(a)}+${N(c2*h)}=${N(b)}°입니다.</li></ol>`};}

// ---------- Mission 3: 원 안의 두 정다각형, 두 변이 만나 생기는 각 ㉠ ----------
// m: 꼭짓점 ㄱ에서 시작하는 변(ㄱ과 다음 꼭짓점)을 가진 정다각형, n: 그 변과 만나는 변을 가진 정다각형(1번째와 2번째 꼭짓점)
function itemM3(P){const {m,n,la,lb}=P,cm=360/m,cn=360/n,inA=180*(n-2)/n,bm=(180-cm)/2,bn=(180-cn)/2,d=bn-bm,inner=180-inA-d,ans=180-inner;
 const A=[...Array(m)].map((_,i)=>onC(C0,R0,cm*i)),B=[...Array(n)].map((_,i)=>onC(C0,R0,cn*i)),X=inter(A[0],A[1],B[1],B[2]);
 let labs=lbl(0,'ㄱ',14);for(let i=1;i<m;i++)labs+=lbl(cm*i,la[i-1],16);for(let i=1;i<n;i++)labs+=lbl(cn*i,lb[i-1],16);
 const fig=svg(300,310,ci(C0[0],C0[1],R0)+pl(A)+pl(B)+ang(X,A[0],B[2],16,'㉠',11)+labs,'원 안의 두 정다각형');
 const nmA='ㄱ'+la.join(''),nmB='ㄱ'+lb.join('');
 return {prompt:`<p>그림은 원 안에 ${PNAME[m]} ${nmA}과 ${PNAME[n]} ${nmB}을 꼭 맞게 그린 것입니다. 각 ㉠의 크기를 구하세요.</p>`+fig,
  answer:`${N(ans)}°`,
  solution:`<ol><li>${PNAME[n]}의 한 각의 크기는 180×(${n}−2)÷${n}=${N(inA)}°이므로 각 ㄱ${lb[0]}${lb[1]}=${N(inA)}°입니다.</li>`
  +`<li>원의 중심과 꼭짓점들을 이으면 ${PNAME[m]}의 중심각은 360÷${m}=${cm}°, ${PNAME[n]}의 중심각은 360÷${n}=${cn}°입니다. 이등변삼각형의 밑각은 각각 (180−${cm})÷2=${N(bm)}°, (180−${cn})÷2=${N(bn)}°입니다.</li>`
  +`<li>꼭짓점 ㄱ에서 원의 중심 쪽 선과 변 ㄱ${lb[0]}, 변 ㄱ${la[0]}이 이루는 각이 각각 ${N(bn)}°, ${N(bm)}°이므로 각 ${lb[0]}ㄱ${la[0]}=${N(bn)}−${N(bm)}=${N(d)}°입니다.</li>`
  +`<li>변 ㄱ${la[0]}과 변 ${lb[0]}${lb[1]}이 만나는 점을 생각하면, 꼭짓점 ㄱ, ${lb[0]}과 이 점으로 이루어진 삼각형에서 만나는 점의 각은 180−${N(inA)}−${N(d)}=${N(inner)}°입니다.</li>`
  +`<li>㉠은 이 각과 한 직선 위에서 이웃하므로 ㉠=180−${N(inner)}=${N(ans)}°입니다.</li></ol>`};}

// ---------- Mission 4: 직사각형과 반원, (가)=(나)일 때 변 ㄴㄷ ----------
function itemM4(P){const {r}=P,semi=r*r*3.14/2,h=semi/(2*r);
 const Rp=104,s=Rp/r,o=[40+Rp,40+Rp],hp=h*s,G=[o[0]-Rp,o[1]],Nn=[o[0]+Rp,o[1]],Dd=[o[0]+Rp,o[1]-hp],Rr=[o[0]-Rp,o[1]-hp];
 const xi=Math.sqrt(Rp*Rp-hp*hp);
 const shGa=`<path d="M${p1(o[0]-xi)} ${p1(o[1]-hp)} A${Rp} ${Rp} 0 0 1 ${p1(o[0]+xi)} ${p1(o[1]-hp)} Z" style="fill:${SHADE};stroke:none"/>`;
 const shNa=`<path d="M${p1(G[0])} ${p1(G[1])} L${p1(Rr[0])} ${p1(Rr[1])} L${p1(o[0]-xi)} ${p1(o[1]-hp)} A${Rp} ${Rp} 0 0 0 ${p1(G[0])} ${p1(G[1])} Z" style="fill:${SHADE};stroke:none"/>`
  +`<path d="M${p1(Nn[0])} ${p1(Nn[1])} L${p1(Dd[0])} ${p1(Dd[1])} L${p1(o[0]+xi)} ${p1(o[1]-hp)} A${Rp} ${Rp} 0 0 1 ${p1(Nn[0])} ${p1(Nn[1])} Z" style="fill:${SHADE};stroke:none"/>`;
 const semiP=`<path d="M${p1(G[0])} ${p1(G[1])} A${Rp} ${Rp} 0 0 1 ${p1(Nn[0])} ${p1(Nn[1])}" style="fill:none;${ST}"/>`;
 const ly=o[1]-hp*0.55,lc=[Rr[0]+12,o[1]-hp*0.78],rc=[Dd[0]-12,o[1]-hp*0.78];
 const arrows=`<path d="M${p1(o[0]-22)} ${p1(ly)} Q${p1(o[0]-60)} ${p1(ly-6)} ${p1(lc[0]+6)} ${p1(lc[1])}" style="fill:none;${THIN}"/>`+arrowHead(lc,[-1,-0.25])
  +`<path d="M${p1(o[0]+22)} ${p1(ly)} Q${p1(o[0]+60)} ${p1(ly-6)} ${p1(rc[0]-6)} ${p1(rc[1])}" style="fill:none;${THIN}"/>`+arrowHead(rc,[1,-0.25]);
 const fig=svg(Math.round(2*Rp+80),Math.round(o[1]+48),shGa+shNa+pl([G,Nn,Dd,Rr])+semiP+dot(o)
  +tx(o[0],(o[1]-Rp+o[1]-hp)/2+1,'(가)',undefined,13)+tx(o[0],ly,'(나)',undefined,13)+arrows
  +tx(G[0]-8,G[1]+2,'ㄱ','end')+tx(Nn[0]+8,Nn[1]+2,'ㄴ','start')+tx(Dd[0]+8,Dd[1],'ㄷ','start')+tx(Rr[0]-8,Rr[1],'ㄹ','end')+tx(o[0],o[1]+30,'ㅇ')
  +dim(G,o,r+' cm',-1,7)+dim(o,Nn,r+' cm',-1,7),'직사각형과 반원');
 return {prompt:`<p>그림과 같이 직사각형과 반원이 있습니다. 색칠한 (가)의 넓이와 (나)의 넓이가 같을 때, 변 ㄴㄷ의 길이를 구하세요. (원주율: 3.14)</p>`+fig,
  answer:`${N(h)} cm`,
  solution:`<ol><li>(가)와 (나)에 반원과 직사각형이 겹친 부분을 각각 더하면, (가)쪽은 반원이 되고 (나)쪽은 직사각형이 됩니다. (가)와 (나)의 넓이가 같으므로 반원과 직사각형의 넓이가 같습니다.</li>`
  +`<li>반원의 넓이는 ${r}×${r}×3.14÷2=${N(semi)} (cm²)입니다.</li>`
  +`<li>직사각형의 가로는 ${r}+${r}=${2*r} (cm)이므로 변 ㄴㄷ의 길이는 ${N(semi)}÷${2*r}=${N(h)} (cm)입니다.</li></ol>`};}

// ---------- Mission 5: 사분원에서 ㉮=㉯일 때 각 ㉠ ----------
function itemM5(P){const {r}=P,tri=r*r/2,phi=360*tri/(r*r*3),ans=90-phi;
 const R=212,O=[92,262],A=[O[0],O[1]-R],B=[O[0]+R,O[1]],Q=[O[0]+R*Math.sin(ans*D2R),O[1]-R*Math.cos(ans*D2R)],X=inter(O,Q,A,B);
 const sh1=pl([O,A,X],SHADE,'stroke:none');
 const sh2=`<path d="M${p1(X[0])} ${p1(X[1])} L${p1(Q[0])} ${p1(Q[1])} A${R} ${R} 0 0 1 ${p1(B[0])} ${p1(B[1])} Z" style="fill:${SHADE};stroke:none"/>`;
 const sector=`<path d="M${p1(A[0])} ${p1(A[1])} A${R} ${R} 0 0 1 ${p1(B[0])} ${p1(B[1])}" style="fill:none;${ST}"/>`;
 const cA=[(O[0]+A[0]+X[0])/3,(O[1]+A[1]+X[1])/3],cB=[(X[0]+Q[0]+B[0])/3*0.5+(Q[0]+B[0])/2*0.5,(X[1]+Q[1]+B[1])/3*0.5+(Q[1]+B[1])/2*0.5];
 const fig=svg(Math.round(B[0]+30),Math.round(O[1]+44),sh1+sh2+sector+ln(O,A)+ln(O,B)+ln(A,B)+ln(O,Q)+rmark(O,[0,-1],[1,0])
  +ang(O,A,Q,30,'㉠',11)+tx(cA[0]+2,cA[1]-14,'㉮')+tx(cB[0],cB[1],'㉯')+dim(A,O,r+' cm',-1,12)+dim(O,B,r+' cm',-1,10),'사분원과 두 색칠한 부분');
 return {prompt:`<p>다음 그림에서 ㉮ 부분과 ㉯ 부분의 넓이가 같을 때, 각 ㉠의 크기를 구하세요. (원주율: 3)</p>`+fig,
  answer:`${N(ans)}°`,
  solution:`<ol><li>풀이 기준: 그림은 반지름이 ${r} cm인 원의 ${ff(1,4)}이고, ㉮와 ㉯는 색칠한 두 부분입니다.</li><li>㉮와 ㉯에 아래쪽의 흰 삼각형을 각각 더하면, ㉮쪽은 두 반지름과 현으로 이루어진 직각삼각형이 되고, ㉯쪽은 ㉠을 뺀 나머지 각을 중심각으로 하는 부채꼴이 됩니다.</li>`
  +`<li>㉮와 ㉯의 넓이가 같으므로 직각삼각형과 부채꼴의 넓이가 같습니다. 직각삼각형의 넓이는 ${r}×${r}÷2=${N(tri)} (cm²)입니다.</li>`
  +`<li>반지름 ${r} cm인 원의 넓이는 ${r}×${r}×3=${N(r*r*3)} (cm²)이므로, 부채꼴은 원의 ${N(tri)}÷${N(r*r*3)}=${ff(1,6)}이고 중심각은 360×${ff(1,6)}=${N(phi)}°입니다.</li>`
  +`<li>따라서 ㉠=90−${N(phi)}=${N(ans)}°입니다.</li></ol>`};}

// ---------- Mission 6: 겹친 넓이로 원 ㉡의 넓이 ----------
function itemM6(P){const {a,b,c,d,S}=P;// 겹친 부분 = ㉠의 a/b = ㉡의 c/d, ㉠ = S
 const ov=S*a/b,T=ov/c*d;
 const R1=88,R2=R1*Math.sqrt(T/S),c1=[24+R1,26+R1],c2=[c1[0]+R1*0.62+R2*0.55,c1[1]+R1*0.12];
 const k1=onC(c1,R1,0),k2=[c2[0]+R2*Math.cos(50*D2R),c2[1]-R2*Math.sin(50*D2R)];
 const fig=svg(Math.round(c2[0]+R2+30),Math.round(Math.max(c1[1]+R1,c2[1]+R2)+16),ci(c1[0],c1[1],R1)+ci(c2[0],c2[1],R2)
  +`<circle cx="${p1(k1[0])}" cy="${p1(k1[1])}" r="9" style="fill:#fff;stroke:none"/>`+tx(k1[0],k1[1]+1,'㉠')
  +`<circle cx="${p1(k2[0])}" cy="${p1(k2[1])}" r="9" style="fill:#fff;stroke:none"/>`+tx(k2[0],k2[1]+1,'㉡'),'겹쳐진 두 원');
 return {prompt:`<p>그림과 같이 원 ㉠과 원 ㉡이 겹쳐져 있습니다. 겹친 부분의 넓이는 원 ㉠ 넓이의 ${ff(a,b)}이고, 원 ㉡ 넓이의 ${ff(c,d)}입니다. 원 ㉠의 넓이가 ${S} cm²라면 원 ㉡의 넓이는 몇 cm²인가요? (원주율: 3.14)</p>`+fig,
  answer:`${N(T)} cm²`,
  solution:`<ol><li>겹친 부분의 넓이는 원 ㉠ 넓이의 ${ff(a,b)}이므로 ${S}×${ff(a,b)}=${N(ov)} (cm²)입니다.</li>`
  +`<li>${N(ov)} cm²가 원 ㉡ 넓이의 ${ff(c,d)}이므로, 원 ㉡ 넓이의 ${ff(1,d)}은 ${N(ov)}÷${c}=${N(ov/c)} (cm²)입니다.</li>`
  +`<li>원 ㉡의 넓이는 ${N(ov/c)}×${d}=${N(T)} (cm²)입니다. (원주율은 쓰이지 않습니다.)</li></ol>`};}

const POOLS={
 '6-2-u5-e6-exploration':{key:'source62U5E6Exploration1',f:itemExplore,ps:[{n:12,q:[1,2,3,6]},{n:12,q:[1,2,4,8]},{n:10,q:[1,2,3,6]}]},
 '6-2-u5-e6-example-1':{key:'source62U5E6Example1',f:itemEx1,ps:[{n:5,m:6,k:2,j:1},{n:4,m:5,k:2,j:1},{n:6,m:5,k:2,j:2}]},
 '6-2-u5-e6-example-2':{key:'source62U5E6Example2',f:itemEx2,ps:[{c:86},{c:74},{c:98}]},
 '6-2-u5-e6-example-3':{key:'source62U5E6Example3',f:itemEx3,ps:[{dia:10},{dia:12},{dia:20}]},
 '6-2-u5-e6-example-4':{key:'source62U5E6Example4',f:itemEx4,ps:[{a:6,b:3,c:11},{a:4,b:2,c:9},{a:5,b:3,c:7}]},
 '6-2-u5-e6-mission-1':{key:'source62U5E6Mission1',resultContract:'multi-value',f:itemM1,ps:[{q:[2,5,7,9]},{q:[1,5,7,10]},{q:[2,4,7,10]}]},
 '6-2-u5-e6-mission-2':{key:'source62U5E6Mission2',resultContract:'multi-value',f:itemM2,ps:[{n:6,T:0,L:1,R:5,A:4},{n:10,T:0,L:2,R:8,A:7},{n:12,T:0,L:3,R:9,A:8}]},
 '6-2-u5-e6-mission-3':{key:'source62U5E6Mission3',f:itemM3,ps:[{m:4,n:5,la:['ㄴ','ㄷ','ㄹ'],lb:['ㅁ','ㅂ','ㅅ','ㅇ']},{m:5,n:6,la:['ㄴ','ㄷ','ㄹ','ㅁ'],lb:['ㅂ','ㅅ','ㅇ','ㅈ','ㅊ']},{m:3,n:4,la:['ㄴ','ㄷ'],lb:['ㄹ','ㅁ','ㅂ']}]},
 '6-2-u5-e6-mission-4':{key:'source62U5E6Mission4',f:itemM4,ps:[{r:2},{r:4},{r:6}]},
 '6-2-u5-e6-mission-5':{key:'source62U5E6Mission5',f:itemM5,ps:[{r:20},{r:10},{r:30}]},
 '6-2-u5-e6-mission-6':{key:'source62U5E6Mission6',f:itemM6,ps:[{a:3,b:8,c:2,d:3,S:64},{a:5,b:12,c:2,d:3,S:72},{a:2,b:9,c:3,d:5,S:81}]},
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
