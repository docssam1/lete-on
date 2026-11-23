// 황소 6-2 5단원 개념탐구 5 (자취의 길이와 넓이) 원문 구조 유형. 고정 검증 풀 3개씩.
(function(root){'use strict';
const GROUP='6-2-u5-e5';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;

// ---------- 공통 도구 ----------
const F=x=>Math.round(x*10000)/10000;           // 소수 정리
const N=x=>String(F(x));                       // 수 → 글자
const p1=x=>String(Math.round(x*10)/10);         // 그림 좌표
const ST='stroke:#222;stroke-width:1.4px';
const DIM='fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3';
const SHADE='#e8e4dc';
const svg=(w,h,body,label)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:360px;height:auto;display:block;margin:8px auto;font-family:inherit">${body}</svg>`;
const ln=(x1,y1,x2,y2,st)=>`<line x1="${p1(x1)}" y1="${p1(y1)}" x2="${p1(x2)}" y2="${p1(y2)}" style="${st||ST}"/>`;
const pl=(pts,fill,st)=>`<polygon points="${pts.map(p=>p1(p[0])+','+p1(p[1])).join(' ')}" style="fill:${fill||'none'};${st||ST}"/>`;
const ci=(cx,cy,r,fill,st)=>`<circle cx="${p1(cx)}" cy="${p1(cy)}" r="${p1(r)}" style="fill:${fill||'none'};${st||ST}"/>`;
const dot=(x,y)=>`<circle cx="${p1(x)}" cy="${p1(y)}" r="2.6" style="fill:#222"/>`;
const tx=(x,y,s,a,sz)=>`<text x="${p1(x)}" y="${p1(y)}" text-anchor="${a||'middle'}" dominant-baseline="middle" style="font-size:${sz||13}px;fill:#222">${s}</text>`;
const tw=s=>String(s).replace(/<[^>]+>/g,'').length*7.4;
// 선분 (x1,y1)-(x2,y2)에 걸친 점선 치수 호와 길이 글자. side=1이면 진행 방향의 왼쪽(화면 기준), -1이면 오른쪽.
function dim(x1,y1,x2,y2,lab,side,off){off=off||11;const mx_=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);
 let nx=dy/len,ny=-dx/len;if(side<0){nx=-nx;ny=-ny;}
 const cx=mx_+nx*off*2,cy=my+ny*off*2,ex=8+Math.abs(nx)*tw(lab)/2+Math.abs(ny)*4;
 return `<path d="M${p1(x1)} ${p1(y1)} Q${p1(cx)} ${p1(cy)} ${p1(x2)} ${p1(y2)}" style="${DIM}"/>`+tx(mx_+nx*(off+ex),my+ny*(off+ex),lab);}
// 꼭짓점 (vx,vy)에서 화면 각도 a1→a2(도, 반시계 = 위쪽) 사이의 각호
function arcAt(vx,vy,a1,a2,r){const q=d=>[vx+r*Math.cos(d*Math.PI/180),vy-r*Math.sin(d*Math.PI/180)];const s=q(a1),e=q(a2);
 return `<path d="M${p1(s[0])} ${p1(s[1])} A${r} ${r} 0 0 0 ${p1(e[0])} ${p1(e[1])}" style="fill:none;stroke:#222;stroke-width:1px"/>`;}
// 직각 표시: 꼭짓점과 두 방향(단위벡터)
function rmark(vx,vy,u,v,s){s=s||8;const a=[vx+u[0]*s,vy+u[1]*s],b=[vx+u[0]*s+v[0]*s,vy+u[1]*s+v[1]*s],c=[vx+v[0]*s,vy+v[1]*s];
 return `<polyline points="${p1(a[0])},${p1(a[1])} ${p1(b[0])},${p1(b[1])} ${p1(c[0])},${p1(c[1])}" style="fill:none;stroke:#222;stroke-width:1px"/>`;}
function arrowHead(x,y,ang){const a=ang*Math.PI/180,l=8,w=4;const bx=x-l*Math.cos(a),by=y-l*Math.sin(a);
 return `<polygon points="${p1(x)},${p1(y)} ${p1(bx-w*Math.sin(a))},${p1(by+w*Math.cos(a))} ${p1(bx+w*Math.sin(a))},${p1(by-w*Math.cos(a))}" style="fill:#222"/>`;}
function wavy(x1,y1,x2,y2,n){const pts=[];const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy),nx=-dy/len,ny=dx/len;
 for(let i=0;i<=n*8;i++){const t=i/(n*8),s=Math.sin(t*n*2*Math.PI)*5;pts.push(p1(x1+dx*t+nx*s)+','+p1(y1+dy*t+ny*s));}
 return `<polyline points="${pts.join(' ')}" style="fill:none;stroke:#222;stroke-width:1.2px"/>`;}

// ---------- 개념탐구: ㄱ자 상자 둘레를 도는 원 ----------
function figExplore(P){const {r,a,b,c,d}=P,w=a-c,s=200/Math.max(a,b),x0=78,y0=34+b*s;
 const X=x=>x0+x*s,Y=y=>y0-y*s;
 const pts=[[0,0],[a,0],[a,b],[w,b],[w,d],[0,d]].map(p=>[X(p[0]),Y(p[1])]);
 const cx=X(a+r),cy=Y(b-r),R=r*s;
 return svg(Math.round(X(a)+2*R+62),Math.round(y0+44),
  pl(pts,SHADE)+ci(cx,cy,R,SHADE)+dot(cx,cy)+ln(cx,cy,cx+R,cy,'stroke:#222;stroke-width:1px')
  +`<path d="M${p1(cx)} ${p1(cy)} Q${p1(cx+R/2)} ${p1(cy-R*0.9)} ${p1(cx+R)} ${p1(cy)}" style="${DIM}"/>`+tx(cx+R+6,cy-R*0.75,r+' cm','start')
  +dim(X(w),Y(b),X(a),Y(b),c+' cm',1)+dim(X(a),Y(0),X(a),Y(b),b+' cm',1)+dim(X(0),Y(0),X(a),Y(0),a+' cm',-1)+dim(X(0),Y(0),X(0),Y(d),d+' cm',1),
  '상자 모양과 원 모양 로봇');}
function itemExplore(P){const {r,a,b,c,d}=P,w=a-c,per=2*a+2*b,arc=F(2*r*3/4),len=F(per-2*r+5*arc);
 const strip=(a+b+c+d)*2*r,q=F(2*r*2*r*3/4),pocket=F(r*r-r*r*3/4),sq=F(4*r*r-pocket),area=F(strip+5*q+sq);
 return {prompt:`<p>바닥면이 반지름 ${r} cm인 원 모양 로봇이 있습니다. 이 로봇이 그림과 같은 상자의 바깥쪽 둘레를 따라 한 바퀴 돌았을 때, 원의 중심이 움직인 거리를 구하세요. 또, 원이 지나간 부분의 넓이도 구하세요. (단, 도형의 이웃한 변은 모두 서로 수직이고, 원주율은 3으로 계산합니다.)</p>`+figExplore(P),
  answer:`${N(len)} cm, ${N(area)} cm²`,
  solution:`<ol><li>들어간 부분의 가로는 ${a}−${c}=${w} (cm), 세로는 ${b}−${d}=${b-d} (cm)이고, 상자의 둘레는 ${a}+${b}+${c}+${w}+${b-d}+${d}=${per} (cm)입니다.</li>`
  +`<li>원의 중심은 변에서 ${r} cm 떨어져 움직입니다. 바깥으로 튀어나온 꼭짓점 5곳에서는 반지름 ${r} cm인 원의 ${ff(1,4)}만큼 돌고, 안으로 들어간 꼭짓점 1곳에서는 그 꼭짓점에 닿은 두 변에서 ${r} cm씩 덜 움직입니다.</li>`
  +`<li>곧게 움직인 거리는 ${per}−${r}−${r}=${per-2*r} (cm), 꼭짓점에서 돈 거리는 ${2*r}×3×${ff(1,4)}×5=${N(5*arc)} (cm)이므로 중심이 움직인 거리는 ${per-2*r}+${N(5*arc)}=${N(len)} (cm)입니다.</li>`
  +`<li>원이 지나간 부분은 폭이 지름 ${2*r} cm인 띠입니다. 길이가 ${a} cm, ${b} cm, ${c} cm, ${d} cm인 변을 따라 생긴 직사각형 넓이는 (${a}+${b}+${c}+${d})×${2*r}=${strip} (cm²)이고, 튀어나온 꼭짓점 5곳에 생긴 반지름 ${2*r} cm인 원의 ${ff(1,4)}의 넓이는 ${2*r}×${2*r}×3×${ff(1,4)}×5=${N(5*q)} (cm²)입니다.</li>`
  +`<li>들어간 부분(한 변이 ${2*r} cm인 정사각형)에서는 안쪽 구석을 원이 닿지 못합니다. 닿지 못하는 부분은 한 변이 ${r} cm인 정사각형에서 반지름 ${r} cm인 원의 ${ff(1,4)}을 뺀 ${r*r}−${N(r*r*3/4)}=${N(pocket)} (cm²)이므로 이 정사각형에서 지나간 넓이는 ${4*r*r}−${N(pocket)}=${N(sq)} (cm²)입니다.</li>`
  +`<li>원이 지나간 부분의 넓이는 ${strip}+${N(5*q)}+${N(sq)}=${N(area)} (cm²)입니다.</li></ol>`};}

// ---------- 예제 5-1: 움푹 들어간 길을 따라 굴린 원 ----------
function figEx1(P){const {r,l1,h,m,l2}=P,tot=l1+m+l2,s=290/(tot+2*r),x0=34+r*s,y0=20+2*r*s+8;const X=x=>x0+x*s,Y=y=>y0+y*s,R=r*s;
 const path=`<polyline points="${[[0,0],[l1,0],[l1,h],[l1+m,h],[l1+m,0],[tot,0]].map(p=>p1(X(p[0]))+','+p1(Y(p[1]))).join(' ')}" style="fill:none;${ST}"/>`;
 return svg(Math.round(X(tot)+R+22),Math.round(Y(h)+40),
  path+ci(X(0),Y(-r),R,SHADE)+ci(X(tot),Y(-r),R,SHADE)+dot(X(0),Y(-r))+ln(X(0),Y(-r),X(0)+R,Y(-r),'stroke:#222;stroke-width:1px')
  +`<path d="M${p1(X(0))} ${p1(Y(-r))} Q${p1(X(0)+R/2)} ${p1(Y(-r)-R*0.9)} ${p1(X(0)+R)} ${p1(Y(-r))}" style="${DIM}"/>`+tx(X(0)+R+5,Y(-r)-R*0.75,r+' cm','start')
  +dim(X(0),Y(0),X(l1),Y(0),l1+' cm',-1,8)+dim(X(l1),Y(0),X(l1),Y(h),h+' cm',1,8)+dim(X(l1),Y(h),X(l1+m),Y(h),m+' cm',-1,8)
  +dim(X(l1+m),Y(h),X(l1+m),Y(0),h+' cm',1,8)+dim(X(l1+m),Y(0),X(tot),Y(0),l2+' cm',-1,8),'움푹 들어간 길과 원');}
function itemEx1(P){const {r,l1,h,m,l2}=P,st=l1+(h-r)+(m-2*r)+(h-r)+l2,arc=F(2*r*3.14/4),len=F(st+2*arc);
 return {prompt:`<p>반지름이 ${r} cm인 원을 그림과 같은 길을 따라 왼쪽 끝에서 오른쪽 끝까지 굴렸습니다. 원의 중심이 지나간 거리는 몇 cm인지 구하세요. (원주율: 3.14)</p>`+figEx1(P),
  answer:`${N(len)} cm`,
  solution:`<ol><li>원의 중심은 길에서 항상 ${r} cm 떨어져 움직입니다.</li>`
  +`<li>움푹 들어간 곳의 위쪽 두 모서리에서는 중심이 반지름 ${r} cm인 원의 ${ff(1,4)}만큼 돌아서 내려가거나 올라옵니다. 이 거리는 2×${r}×3.14×${ff(1,4)}×2=${N(2*arc)} (cm)입니다.</li>`
  +`<li>움푹 들어간 바닥의 두 구석에서는 원이 벽과 바닥에 동시에 닿으므로 중심은 벽을 따라 ${h}−${r}=${h-r} (cm)씩, 바닥을 따라 ${m}−${r}−${r}=${m-2*r} (cm)만 움직입니다.</li>`
  +`<li>곧게 움직인 거리는 ${l1}+${h-r}+${m-2*r}+${h-r}+${l2}=${st} (cm)입니다.</li>`
  +`<li>원의 중심이 지나간 거리는 ${st}+${N(2*arc)}=${N(len)} (cm)입니다.</li></ol>`};}

// ---------- 예제 5-2: 고정된 두 원 둘레를 도는 원 ----------
function figEx2(){const R=32,c=[[52,128],[52+2*R,128]],g=[c[1][0]+2*R*Math.cos(50*Math.PI/180),c[1][1]-2*R*Math.sin(50*Math.PI/180)];
 return svg(Math.round(g[0]+R+16),Math.round(c[0][1]+R+14),
  ci(c[0][0],c[0][1],R)+ci(c[1][0],c[1][1],R)+ci(g[0],g[1],R)+dot(c[0][0],c[0][1])+dot(c[1][0],c[1][1])+dot(g[0],g[1])
  +tx(c[0][0]-12,c[0][1]-10,'ㄷ',null,14)+tx(c[1][0]-12,c[1][1]-10,'ㄴ',null,14)+tx(g[0]+12,g[1]-10,'ㄱ',null,14),'서로 닿아 있는 세 원 ㄱ, ㄴ, ㄷ');}
function itemEx2(P){const {r}=P;const num=248*r,den=15,g=(x,y)=>y?g(y,x%y):x,k=g(num,den),n=num/k,d=den/k,W=Math.floor(n/d),one=2*2*r*3.1;
 const half=(()=>{const nn=124*r,dd=15,kk=g(nn,dd),a=nn/kk,b=dd/kk;return b===1?String(a):mx(Math.floor(a/b),a%b,b);})();
 return {prompt:`<p>그림과 같이 반지름이 각각 ${r} cm인 세 원 ㄱ, ㄴ, ㄷ이 서로 닿아 있습니다. 원 ㄴ과 원 ㄷ은 움직이지 않게 고정하고, 원 ㄱ이 원 ㄴ과 원 ㄷ의 둘레를 따라 한 바퀴 돌았을 때, 원 ㄱ의 중심이 움직인 거리는 몇 cm인지 구하세요. (원주율: 3.1)</p>`+figEx2(),
  answer:`${mx(W,n%d,d)} cm`,
  solution:`<ol><li>원 ㄱ의 중심은 원 ㄴ, 원 ㄷ의 중심에서 반지름의 2배인 ${2*r} cm 떨어진 곳을 지나므로, 원 ㄴ과 원 ㄷ의 중심을 각각 중심으로 하는 반지름 ${2*r} cm인 원의 일부를 그립니다.</li>`
  +`<li>원 ㄱ이 원 ㄴ과 원 ㄷ에 동시에 닿을 때 세 원의 중심을 이으면 세 변이 모두 ${2*r} cm인 정삼각형이 되므로 한 각은 60°입니다.</li>`
  +`<li>그래서 원 ㄱ의 중심은 원 ㄴ, 원 ㄷ의 중심을 중심으로 각각 360°−60°−60°=240°씩 돕니다.</li>`
  +`<li>한 쪽에서 움직인 거리는 2×${2*r}×3.1×${ff(240,360)}=${N(one)}×${ff(2,3)}=${half} (cm)입니다.</li>`
  +`<li>원 ㄱ의 중심이 움직인 거리는 ${half}×2=${mx(W,n%d,d)} (cm)입니다.</li></ol>`};}

// ---------- 예제 5-3: 직각삼각형을 굴릴 때 꼭짓점 ㄴ ----------
function figEx3(P){const {a}=P,u=60,L=[60,170],D=[60+u,170],G=[60+u,170-u*Math.sqrt(3)];
 return svg(330,215,
  ln(18,170,312,170)+pl([L,D,G])+arcAt(L[0],L[1],0,60,16)+tx(L[0]+27,L[1]-11,'60°',null,12)+rmark(D[0],D[1],[-1,0],[0,-1],8)
  +dim(L[0],L[1],D[0],D[1],a+' cm',-1,8)+dim(L[0],L[1],G[0],G[1],2*a+' cm',1,10)
  +tx(G[0],G[1]-12,'ㄱ',null,14)+tx(L[0]-12,L[1]+12,'ㄴ',null,14)+tx(D[0]+12,D[1]+12,'ㄷ',null,14)
  +`<path d="M150 64 Q190 52 214 82" style="fill:none;stroke:#222;stroke-width:1.2px"/>`+arrowHead(214,82,55),'직선 위의 삼각형 ㄱㄴㄷ');}
function itemEx3(P){const {a}=P,s1=F(2*a*3/4),s2=F(2*2*a*3*150/360),len=F(s1+s2);
 return {prompt:`<p>그림과 같이 ∠ㄴ=60°, ∠ㄷ=90°인 삼각형 ㄱㄴㄷ이 있습니다. 이 삼각형을 직선 위에서 화살표 방향으로 한 바퀴 굴렸을 때, 점 ㄴ이 움직인 거리는 몇 cm인지 구하세요. (원주율: 3)</p>`+figEx3(P),
  answer:`${N(len)} cm`,
  solution:`<ol><li>삼각형의 세 각의 합은 180°이므로 ∠ㄱ=180°−90°−60°=30°입니다.</li>`
  +`<li>먼저 점 ㄷ을 중심으로 180°−90°=90°만큼 돕니다. 이때 점 ㄴ은 반지름 ${a} cm인 원의 일부를 그리므로 2×${a}×3×${ff(90,360)}=${N(s1)} (cm) 움직입니다.</li>`
  +`<li>다음에 점 ㄱ을 중심으로 180°−30°=150°만큼 돕니다. 이때 점 ㄴ은 반지름 ${2*a} cm인 원의 일부를 그리므로 2×${2*a}×3×${ff(150,360)}=${N(s2)} (cm) 움직입니다.</li>`
  +`<li>마지막으로 점 ㄴ을 중심으로 돌 때는 점 ㄴ이 움직이지 않습니다.</li>`
  +`<li>점 ㄴ이 움직인 거리는 ${N(s1)}+${N(s2)}=${N(len)} (cm)입니다.</li></ol>`};}

// ---------- 예제 5-4 / Mission 6: 울타리 꼭짓점에 묶인 동물 ----------
function figTie(P,animal,topDim){const {L,w,h}=P,s=150/Math.max(w,h*1.4),x0=130,y0=46+h*s;const X=x=>x0+x*s,Y=y=>y0-y*s;
 const W=Math.round(X(w)+70),H=Math.round(y0+80);
 return svg(W,H,pl([[X(0),Y(0)],[X(w),Y(0)],[X(w),Y(h)],[X(0),Y(h)]],SHADE,'stroke:#222;stroke-width:1.8px')+dot(X(0),Y(0))
  +wavy(X(0),Y(0),X(0)-44,Y(0)+58,3)+tx(X(0)-58,Y(0)+66,animal,null,14)
  +(topDim?dim(X(0),Y(h),X(w),Y(h),w+' m',1):dim(X(0),Y(0),X(w),Y(0),w+' m',-1))+dim(X(w),Y(0),X(w),Y(h),h+' m',-1),'직사각형 울타리와 끈에 묶인 '+animal);}
function itemTie(P,ex){const {L,w,h,pi}=P,big=F(L*L*pi*3/4),a1=L-w,a2=L-h,s1=F(a1*a1*pi/4),s2=F(a2*a2*pi/4),tot=F(big+s1+s2);
 const an=ex?'양':'소',eun=ex?'양은':'소는',rope=ex?'끈':'줄',pis=String(pi);
 const prompt=ex?`<p>그림과 같이 직사각형 모양 울타리의 한 꼭짓점에 양 한 마리를 길이가 ${L} m인 끈으로 묶어 놓았습니다. 이 양이 움직일 수 있는 범위의 넓이는 몇 m²인지 구하세요. (단, 양은 울타리 안으로 들어갈 수 없고 양의 크기는 생각하지 않으며, 원주율은 3으로 계산합니다.)</p>`
  :`<p>풀밭에 다음 그림과 같이 가로가 ${w} m, 세로가 ${h} m인 직사각형 모양으로 울타리를 치고 울타리의 한 귀퉁이에 길이가 ${L} m인 줄로 소를 묶어 두었습니다. 이 소가 풀을 뜯을 수 있는 풀밭의 넓이는 최대한 몇 m²인가요? (원주율: 3.1)</p>`;
 return {prompt:prompt+figTie(P,an,!ex),answer:`${N(tot)} m²`,
  solution:`<ol>${ex?'':'<li>풀이 기준: 소는 울타리 안으로 들어갈 수 없고, 소의 크기는 생각하지 않습니다.</li>'}<li>${eun} 울타리 안으로 들어갈 수 없으므로 묶인 꼭짓점을 중심으로 반지름 ${L} m인 원의 ${ff(3,4)}만큼 움직일 수 있습니다. 넓이는 ${L}×${L}×${pis}×${ff(3,4)}=${N(big)} (m²)입니다.</li>`
  +`<li>길이 ${w} m인 변을 따라 ${rope}을 감으면 ${rope}이 ${L}−${w}=${a1} (m) 남으므로, 그 끝 꼭짓점을 중심으로 반지름 ${a1} m인 원의 ${ff(1,4)}만큼 더 움직입니다. 넓이는 ${a1}×${a1}×${pis}×${ff(1,4)}=${N(s1)} (m²)입니다.</li>`
  +`<li>길이 ${h} m인 변을 따라 ${rope}을 감으면 ${rope}이 ${L}−${h}=${a2} (m) 남으므로, 반지름 ${a2} m인 원의 ${ff(1,4)}만큼 더 움직입니다. 넓이는 ${a2}×${a2}×${pis}×${ff(1,4)}=${N(s2)} (m²)입니다.</li>`
  +`<li>세 부분은 서로 겹치지 않으므로 움직일 수 있는 넓이는 ${N(big)}+${N(s1)}+${N(s2)}=${N(tot)} (m²)입니다.</li></ol>`};}

// ---------- Mission 1: 사각형 둘레를 도는 원 ----------
function quadPts(P){const {bt,rt,tp,lf}=P,th=67*Math.PI/180,A=[0,0],B=[bt,0],D=[lf*Math.cos(th),lf*Math.sin(th)];
 const dx=B[0]-D[0],dy=B[1]-D[1],dd=Math.hypot(dx,dy),aa=(tp*tp-rt*rt+dd*dd)/(2*dd),hh=Math.sqrt(tp*tp-aa*aa),mx_=D[0]+aa*dx/dd,my=D[1]+aa*dy/dd;
 const C=[mx_-hh*dy/dd,my+hh*dx/dd];return [A,B,C,D];}
function figM1(P){const q=quadPts(P),s=250/P.bt,X=p=>[p[0]*s,-p[1]*s];
 const [A,B,C,D]=q.map(X),R=P.r*s,ux=(C[0]-D[0]),uy=(C[1]-D[1]),ul=Math.hypot(ux,uy),ex=ux/ul,ey=uy/ul,nx=ey,ny=-ex; // 바깥쪽 법선
 const T=[D[0]+ux*0.2,D[1]+uy*0.2],O=[T[0]+nx*R,T[1]+ny*R],cen=[(A[0]+B[0]+C[0]+D[0])/4,(A[1]+B[1]+C[1]+D[1])/4];
 const side=(p,q2)=>{const dx=q2[0]-p[0],dy=q2[1]-p[1],mxx=(p[0]+q2[0])/2,myy=(p[1]+q2[1])/2;return ((dy)*(cen[0]-mxx)+(-dx)*(cen[1]-myy))>0?1:-1;};
 const aS=[O[0]+ex*(R+8),O[1]+ey*(R+8)],aE=[aS[0]+ex*44,aS[1]+ey*44];
 const xs=[A[0],B[0],C[0],D[0],O[0]-R,O[0]+R,aE[0]],ys=[A[1],B[1],C[1],D[1],O[1]-R,O[1]+R,aE[1]];
 const mnx=Math.min(...xs)-16,mny=Math.min(...ys)-16,W=Math.max(...xs)-mnx+16,H=Math.max(...ys)-mny+16;
 return svg(Math.round(W),Math.round(H),`<g transform="translate(${p1(-mnx)},${p1(-mny)})">`
  +pl([A,B,C,D],SHADE)+ci(O[0],O[1],R,'#d4cfc4')+dot(O[0],O[1])+ln(aS[0],aS[1],aE[0],aE[1],'stroke:#222;stroke-width:1.2px')+arrowHead(aE[0],aE[1],Math.atan2(uy,ux)*180/Math.PI)
  +dim(A[0],A[1],B[0],B[1],P.bt+' cm',side(A,B))+dim(B[0],B[1],C[0],C[1],P.rt+' cm',side(B,C))+dim(C[0],C[1],D[0],D[1],P.tp+' cm',side(C,D))+dim(D[0],D[1],A[0],A[1],P.lf+' cm',side(D,A))+'</g>','사각형과 변을 따라 도는 원');}
function itemM1(P){const per=P.bt+P.rt+P.tp+P.lf,c=F(2*P.r*3.14),len=F(per+c);
 return {prompt:`<p>그림과 같은 사각형의 변을 따라 반지름이 ${P.r} cm인 원이 사각형의 바깥쪽을 한 바퀴 돌았을 때, 원의 중심이 움직인 거리는 몇 cm인지 구하세요. (원주율: 3.14)</p>`+figM1(P),
  answer:`${N(len)} cm`,
  solution:`<ol><li>원의 중심이 변을 따라 곧게 움직인 거리의 합은 사각형의 둘레와 같으므로 ${P.lf}+${P.tp}+${P.rt}+${P.bt}=${per} (cm)입니다.</li>`
  +`<li>네 꼭짓점에서 원의 중심이 돈 부분은 모두 반지름 ${P.r} cm인 원의 일부이고, 돈 각을 모두 더하면 360°이므로 합하면 반지름 ${P.r} cm인 원 한 개의 둘레가 됩니다. 그 길이는 2×${P.r}×3.14=${N(c)} (cm)입니다.</li>`
  +`<li>원의 중심이 움직인 거리는 ${per}+${N(c)}=${N(len)} (cm)입니다.</li></ol>`};}

// ---------- Mission 2: 직사각형 변 위를 지나는 원, 안쪽 넓이 ----------
function figM2(P){const {d,W,H}=P,s=220/W,x0=84,y0=48;const X=x=>x0+x*s,Y=y=>y0+y*s,R=d/2*s;
 return svg(Math.round(X(W)+62),Math.round(Y(H)+46),
  pl([[X(0),Y(0)],[X(W),Y(0)],[X(W),Y(H)],[X(0),Y(H)]])+ci(X(0),Y(0),R)+dot(X(0),Y(0))
  +ln(X(0),Y(0),X(0)-R,Y(0),'stroke:#222;stroke-width:1px')+`<path d="M${p1(X(0))} ${p1(Y(0))} Q${p1(X(0)-R/2)} ${p1(Y(0)-R*0.9)} ${p1(X(0)-R)} ${p1(Y(0))}" style="${DIM}"/>`+tx(X(0)-R-5,Y(0)-R*0.75,(d/2)+' cm','end')
  +ln(X(0)-R-10,Y(0)+R+6,X(0)-R-10,Y(0)+R+36,'stroke:#222;stroke-width:1.2px')+arrowHead(X(0)-R-10,Y(0)+R+36,90)
  +dim(X(0),Y(H),X(W),Y(H),W+' cm',-1)+dim(X(W),Y(0),X(W),Y(H),H+' cm',-1),'직사각형과 꼭짓점 위의 원');}
function itemM2(P){const {d,W,H}=P,in1=W-d,in2=H-d,area=W*H-in1*in2;
 return {prompt:`<p>지름이 ${d} cm인 원의 중심이 직사각형의 변 위를 따라 움직이고 있습니다. 이 원이 직사각형의 둘레를 한 바퀴 돌았을 때, 직사각형의 안쪽에서 원이 지나간 부분의 넓이를 구하세요. (원주율: 3)</p>`+figM2(P),
  answer:`${area} cm²`,
  solution:`<ol><li>원의 반지름은 ${d}÷2=${d/2} (cm)이므로 원은 직사각형의 안쪽으로 변에서 ${d/2} cm까지 지나갑니다. 꼭짓점에서도 원의 중심이 꼭짓점 위에 있으므로 안쪽 구석까지 모두 지나갑니다.</li>`
  +`<li>원이 지나가지 않은 안쪽 직사각형은 가로가 ${W}−${d/2}−${d/2}=${in1} (cm), 세로가 ${H}−${d/2}−${d/2}=${in2} (cm)입니다.</li>`
  +`<li>원이 지나간 부분의 넓이는 ${W}×${H}−${in1}×${in2}=${W*H}−${in1*in2}=${area} (cm²)입니다.</li></ol>`};}

// ---------- Mission 3: 직사각형을 굴릴 때 꼭짓점 ㄱ ----------
function figM3(P){const {a,b,c}=P,s=Math.min(200/a,110/b),x0=70,y0=36+b*s+20;const X=x=>x0+x*s,Y=y=>y0-y*s;
 const G=[X(0),Y(0)],Rr=[X(a),Y(0)],D=[X(a),Y(b)],Nn=[X(0),Y(b)];
 return svg(340,Math.round(y0+44),
  ln(30,y0,316,y0)+tx(326,y0,'가','middle',14)+pl([G,Rr,D,Nn])+ln(G[0],G[1],D[0],D[1])
  +dim(G[0],G[1],Rr[0],Rr[1],a+' cm',-1,8)+dim(Rr[0],Rr[1],D[0],D[1],b+' cm',1,8)+dim(G[0],G[1],D[0],D[1],c+' cm',1,9)
  +tx(G[0]-10,G[1]+12,'ㄱ',null,14)+tx(Rr[0]+10,Rr[1]+12,'ㄹ',null,14)+tx(D[0]+4,D[1]-12,'ㄷ',null,14)+tx(Nn[0]-4,Nn[1]-12,'ㄴ',null,14)
  +`<path d="M${p1(Nn[0]-30)} ${p1(Nn[1]+6)} Q${p1(Nn[0]-26)} ${p1(Nn[1]-26)} ${p1(Nn[0]-2)} ${p1(Nn[1]-30)}" style="fill:none;stroke:#222;stroke-width:1.2px"/>`+arrowHead(Nn[0]-2,Nn[1]-30,-8),'직선 가 위의 직사각형 ㄱㄴㄷㄹ');}
function itemM3(P){const {a,b,c}=P,s1=F(2*a*3/4),s2=F(2*c*3/4),s3=F(2*b*3/4),len=F(s1+s2+s3);
 return {prompt:`<p>그림과 같이 가로가 ${a} cm, 세로가 ${b} cm, 대각선이 ${c} cm인 직사각형 ㄱㄴㄷㄹ이 있습니다. 이 직사각형을 직선 가 위에서 화살표 방향으로 한 바퀴 굴렸을 때, 점 ㄱ이 움직인 거리는 몇 cm인지 구하세요. (원주율: 3)</p>`+figM3(P),
  answer:`${N(len)} cm`,
  solution:`<ol><li>직사각형이 한 바퀴 구르는 동안 점 ㄹ, 점 ㄷ, 점 ㄴ, 점 ㄱ을 차례로 중심으로 하여 90°씩 4번 돕니다.</li>`
  +`<li>점 ㄹ을 중심으로 돌 때 점 ㄱ은 반지름 ${a} cm인 원의 ${ff(1,4)}을 그립니다: 2×${a}×3×${ff(1,4)}=${N(s1)} (cm).</li>`
  +`<li>점 ㄷ을 중심으로 돌 때 점 ㄱ은 반지름이 대각선 ${c} cm인 원의 ${ff(1,4)}을 그립니다: 2×${c}×3×${ff(1,4)}=${N(s2)} (cm).</li>`
  +`<li>점 ㄴ을 중심으로 돌 때 점 ㄱ은 반지름 ${b} cm인 원의 ${ff(1,4)}을 그립니다: 2×${b}×3×${ff(1,4)}=${N(s3)} (cm). 점 ㄱ을 중심으로 돌 때는 점 ㄱ이 움직이지 않습니다.</li>`
  +`<li>점 ㄱ이 움직인 거리는 ${N(s1)}+${N(s2)}+${N(s3)}=${N(len)} (cm)입니다.</li></ol>`};}

// ---------- Mission 4: 직각으로 굽은 선을 따라 굴린 원 ----------
function figM4(P){const {r,a,h,t,b}=P,tot=a+t+b,s=250/(tot+r),x0=44+r*s,y0=30+Math.max(h,2*r)*s+14;const X=x=>x0+x*s,Y=y=>y0-y*s,R=r*s;
 const path=`<polyline points="${[[0,0],[a,0],[a,h],[a+t,h],[a+t,0]].map(p=>p1(X(p[0]))+','+p1(Y(p[1]))).join(' ')}" style="fill:none;${ST}"/>`;
 return svg(Math.round(X(tot)+40),Math.round(y0+44),
  ln(X(0)-R-14,y0,X(tot)+24,y0)+path+ci(X(0),Y(r),R)+dot(X(0),Y(r))+ln(X(0),Y(r),X(0),Y(0),'stroke:#222;stroke-width:1px')+`<path d="M${p1(X(0))} ${p1(Y(r))} Q${p1(X(0)-R*0.9)} ${p1(Y(r/2))} ${p1(X(0))} ${p1(Y(0))}" style="${DIM}"/>`+tx(X(0)-R-4,Y(r/2)+4,r+' cm','end')
  +dot(X(tot),Y(0))+tx(X(0)-12,Y(r)-10,'ㄷ',null,14)+tx(X(0),y0+30,'ㄱ',null,14)+tx(X(tot),y0+30,'ㄴ',null,14)
  +rmark(X(a),Y(0),[-1,0],[0,-1],7)+rmark(X(a+t),Y(0),[1,0],[0,-1],7)+rmark(X(a),Y(h),[1,0],[0,1],7)+rmark(X(a+t),Y(h),[-1,0],[0,1],7)
  +dim(X(0),Y(0),X(a),Y(0),a+' cm',-1,8)+dim(X(a),Y(0),X(a),Y(h),h+' cm',-1,6)+dim(X(a),Y(h),X(a+t),Y(h),t+' cm',1,8)
  +dim(X(a+t),Y(0),X(a+t),Y(h),h+' cm',-1,6)+dim(X(a+t),Y(0),X(tot),Y(0),b+' cm',-1,8),'직각으로 굽은 선과 원');}
function itemM4(P){const {r,a,h,t,b}=P,st=(a-r)+(h-r)+t+(h-r)+(b-r),arc=F(2*r*3.14/4),len=F(st+2*arc);
 return {prompt:`<p>반지름이 ${r} cm인 원이 그림과 같이 직각으로 굽은 선을 따라 미끄러지지 않고 굴러서 점 ㄱ에서 점 ㄴ까지 움직입니다. 이때 원의 중심 ㄷ이 움직인 거리를 구하세요. (원주율: 3.14)</p>`+figM4(P),
  answer:`${N(len)} cm`,
  solution:`<ol><li>원의 중심은 선에서 항상 ${r} cm 떨어져 움직입니다.</li>`
  +`<li>벽 아래의 두 구석에서는 원이 바닥과 벽에 동시에 닿으므로 중심은 첫 바닥에서 ${a}−${r}=${a-r} (cm), 마지막 바닥에서 ${b}−${r}=${b-r} (cm), 두 벽에서 각각 ${h}−${r}=${h-r} (cm)만 곧게 움직입니다.</li>`
  +`<li>위쪽 두 모서리에서는 중심이 반지름 ${r} cm인 원의 ${ff(1,4)}만큼 돌고, 그 사이 윗면에서는 ${t} cm 움직입니다. 모서리에서 돈 거리는 2×${r}×3.14×${ff(1,4)}×2=${N(2*arc)} (cm)입니다.</li>`
  +`<li>곧게 움직인 거리는 ${a-r}+${h-r}+${t}+${h-r}+${b-r}=${st} (cm)이므로 중심 ㄷ이 움직인 거리는 ${st}+${N(2*arc)}=${N(len)} (cm)입니다.</li></ol>`};}

// ---------- Mission 5: 한 줄로 놓인 세 원 둘레를 도는 원 ----------
function figM5(){const R=26,y=150,c=[[62,y],[62+2*R,y],[62+4*R,y]],O=[62+R,y-2*R*Math.sin(Math.PI/3)];
 return svg(Math.round(c[2][0]+R+24),Math.round(y+R+14),
  c.map(p=>ci(p[0],p[1],R)).join('')+ci(O[0],O[1],R,SHADE)+dot(O[0],O[1])+tx(O[0]-11,O[1]+1,'O',null,14)
  +`<path d="M${p1(O[0]+4)} ${p1(O[1]-R-8)} Q${p1(O[0]+30)} ${p1(O[1]-R-24)} ${p1(O[0]+52)} ${p1(O[1]-R-6)}" style="fill:none;stroke:#222;stroke-width:1.2px;stroke-dasharray:4 3"/>`+arrowHead(O[0]+52,O[1]-R-6,40),'고정된 세 원과 원 O');}
function itemM5(P){const {R}=P,g=(x,y)=>y?g(y,x%y):x,num=62*R,den=3,k=g(num,den),n=num/k,d=den/k,c=F(2*2*R*3.1);
 const ans=d===1?String(n):mx(Math.floor(n/d),n%d,d);
 return {prompt:`<p>그림과 같이 반지름의 길이가 ${R} cm인 세 원이 한 줄로 서로 닿아 있으면서 고정되어 있습니다. 반지름이 ${R} cm이고 중심이 O인 원이 세 원의 둘레를 따라 한 바퀴 돌 때, 원의 중심 O가 움직인 거리를 구하세요. (원주율: 3.1)</p>`+figM5(),
  answer:`${ans} cm`,
  solution:`<ol><li>원의 중심 O는 고정된 원의 중심에서 ${R}+${R}=${2*R} (cm) 떨어진 곳을 지나므로, 고정된 세 원의 중심을 각각 중심으로 하는 반지름 ${2*R} cm인 원의 일부를 그립니다.</li>`
  +`<li>원 O가 이웃한 두 원에 동시에 닿을 때 세 중심을 이으면 세 변이 ${2*R} cm인 정삼각형이 되므로 한 각은 60°입니다.</li>`
  +`<li>양 끝의 원 둘레에서는 각각 360°−60°−60°=240°씩 돌고, 가운데 원 둘레에서는 위쪽과 아래쪽에서 각각 180°−60°−60°=60°씩 돕니다. 돈 각을 모두 더하면 240°+240°+60°+60°=600°입니다.</li>`
  +`<li>반지름 ${2*R} cm인 원의 둘레는 2×${2*R}×3.1=${N(c)} (cm)이므로 중심 O가 움직인 거리는 ${N(c)}×${ff(600,360)}=${N(c)}×${ff(5,3)}=${ans} (cm)입니다.</li></ol>`};}

// ---------- 문항 풀 ----------
const POOLS={
 '6-2-u5-e5-exploration':{key:'source62U5E5Exploration1',resultContract:'multi-value',f:itemExplore,ps:[{r:5,a:40,b:40,c:30,d:30},{r:4,a:36,b:32,c:28,d:24},{r:3,a:30,b:24,c:24,d:18}]},
 '6-2-u5-e5-example-1':{key:'source62U5E5Example1',f:itemEx1,ps:[{r:4,l1:10,h:8,m:20,l2:10},{r:3,l1:12,h:7,m:18,l2:12},{r:5,l1:8,h:10,m:25,l2:8}]},
 '6-2-u5-e5-example-2':{key:'source62U5E5Example2',f:itemEx2,ps:[{r:5},{r:10},{r:4}]},
 '6-2-u5-e5-example-3':{key:'source62U5E5Example3',f:itemEx3,ps:[{a:3},{a:4},{a:5}]},
 '6-2-u5-e5-example-4':{key:'source62U5E5Example4',f:p=>itemTie(p,true),ps:[{L:10,w:8,h:5,pi:3},{L:12,w:9,h:6,pi:3},{L:8,w:7,h:5,pi:3}]},
 '6-2-u5-e5-mission-1':{key:'source62U5E5Mission1',f:itemM1,ps:[{r:1,bt:10,rt:8,tp:6,lf:4},{r:2,bt:12,rt:9,tp:7,lf:5},{r:1,bt:11,rt:9,tp:5,lf:6}]},
 '6-2-u5-e5-mission-2':{key:'source62U5E5Mission2',f:itemM2,ps:[{d:4,W:20,H:15},{d:6,W:24,H:18},{d:2,W:16,H:10}]},
 '6-2-u5-e5-mission-3':{key:'source62U5E5Mission3',f:itemM3,ps:[{a:4,b:3,c:5},{a:8,b:6,c:10},{a:12,b:5,c:13}]},
 '6-2-u5-e5-mission-4':{key:'source62U5E5Mission4',f:itemM4,ps:[{r:1,a:2,h:2,t:4,b:2},{r:2,a:5,h:4,t:6,b:4},{r:1,a:3,h:3,t:5,b:3}]},
 '6-2-u5-e5-mission-5':{key:'source62U5E5Mission5',f:itemM5,ps:[{R:10},{R:5},{R:7}]},
 '6-2-u5-e5-mission-6':{key:'source62U5E5Mission6',f:p=>itemTie(p,false),answerAssumption:'소는 울타리 안으로 들어갈 수 없고 소의 크기는 생각하지 않는다.',ps:[{L:8,w:6,h:4,pi:3.1},{L:12,w:8,h:6,pi:3.1},{L:10,w:8,h:6,pi:3.1}]},
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
