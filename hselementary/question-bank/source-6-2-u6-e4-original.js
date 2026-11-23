// 황소 6-2 6단원 개념탐구 4 (원기둥과 원뿔의 겉넓이) 원문 구조 유형. 각 문항은 같은 구조·다른 수의 검증된 3문항 풀입니다.
(function(root){'use strict';
const GROUP='6-2-u6-e4';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;
const ol=a=>'<ol>'+a.map(x=>'<li>'+x+'</li>').join('')+'</ol>';
const P=a=>a.map(x=>x.startsWith('<')?x:'<p>'+x+'</p>').join('');
const n2=v=>String(Math.round(v*100)/100); // 계산값 표기 (소수 둘째 자리까지 정확한 값만 사용)
const gcd=(a,b)=>b?gcd(b,a%b):a;
const fr=(a,b)=>{const g=gcd(a,b);return ff(a/g,b/g);};

// ---------- 그림 도우미 ----------
const S='stroke:#222;stroke-width:1.4px';
const THIN='stroke:#222;stroke-width:1.1px';
const HID='fill:none;stroke:#222;stroke-width:1px;stroke-dasharray:4 3';
const DIM='fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3';
const C1='#f1f1f1',C2='#dcdcdc',C3='#c4c4c4',C4='#8f8f8f';
const f=v=>{const s=(Math.round(v*10)/10).toFixed(1);return s.endsWith('.0')?s.slice(0,-2):s;};
const svg=(w,h,label,body)=>`<svg viewBox="0 0 ${w} ${f(h)}" style="width:100%;max-width:360px;height:auto;display:block;margin:8px auto;font-family:inherit" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const T=(x,y,t,a,sz)=>`<text x="${f(x)}" y="${f(y)}" text-anchor="${a||'middle'}" font-size="${sz||13}" fill="#222" style="font-family:inherit">${t}</text>`;
const line=(x1,y1,x2,y2,st)=>`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" style="${st||S}"/>`;
const dot=(x,y)=>`<circle cx="${f(x)}" cy="${f(y)}" r="2.4" style="fill:#222"/>`;
const rad=d=>d*Math.PI/180;
// 타원 위의 점: 각 a(도)에서 sin이 양수이면 화면 아래(앞쪽)
const E=(cx,cy,rx,ry,a)=>[cx+rx*Math.cos(rad(a)),cy+ry*Math.sin(rad(a))];
function arcPts(cx,cy,rx,ry,a0,a1){const n=Math.max(2,Math.ceil(Math.abs(a1-a0)/3)),o=[];for(let i=0;i<=n;i++)o.push(E(cx,cy,rx,ry,a0+(a1-a0)*i/n));return o;}
const seg=(pts,mv)=>pts.map((p,i)=>(i===0&&mv?'M':'L')+f(p[0])+' '+f(p[1])).join('');
const arcPath=(cx,cy,rx,ry,a0,a1,st)=>`<path d="${seg(arcPts(cx,cy,rx,ry,a0,a1),true)}" style="${st}"/>`;
const ell=(cx,cy,rx,ry,st)=>`<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" style="${st}"/>`;
const poly=(ps,st)=>`<polygon points="${ps.map(p=>f(p[0])+','+f(p[1])).join(' ')}" style="${st}"/>`;
// 점선 치수 호: (x1,y1)-(x2,y2) 선분 옆으로 b만큼 휘게, 글자는 휜 쪽 바깥에
function dim(x1,y1,x2,y2,b,t,lab){const mx=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L;
 const qx=mx+nx*b*2,qy=my+ny*b*2,sg=b<0?-1:1,sx=nx*sg,sy=ny*sg,o=Math.abs(b)+((lab&&lab.off)||5);
 const lx=(lab&&lab.x!==undefined)?lab.x:mx+sx*o,ly=(lab&&lab.y!==undefined)?lab.y:my+sy*o;
 const anc=(lab&&lab.a)||(sx>0.45?'start':sx<-0.45?'end':'middle');const ty=(lab&&lab.y!==undefined)?ly:ly+(sy>0.45?10:sy<-0.45?-2:4.5);
 return `<path d="M${f(x1)} ${f(y1)}Q${f(qx)} ${f(qy)} ${f(x2)} ${f(y2)}" style="${DIM}"/>`+T(lx,ty,t,anc);}
function rmark(V,A,B,s){const u=[(A[0]-V[0]),(A[1]-V[1])],v=[(B[0]-V[0]),(B[1]-V[1])],lu=Math.hypot(...u),lv=Math.hypot(...v);
 const p1=[V[0]+u[0]/lu*s,V[1]+u[1]/lu*s],p3=[V[0]+v[0]/lv*s,V[1]+v[1]/lv*s],p2=[p1[0]+v[0]/lv*s,p1[1]+v[1]/lv*s];
 return `<path d="M${f(p1[0])} ${f(p1[1])}L${f(p2[0])} ${f(p2[1])}L${f(p3[0])} ${f(p3[1])}" style="fill:none;stroke:#222;stroke-width:1px"/>`;}
// 세운 원기둥 몸통(옆면 + 앞쪽 아래 테두리)
const body=(cx,yt,yb,rx,ry,fill)=>`<path d="M${f(cx-rx)} ${f(yt)}L${f(cx-rx)} ${f(yb)}${seg(arcPts(cx,yb,rx,ry,180,0),false)}L${f(cx+rx)} ${f(yt)}${seg(arcPts(cx,yt,rx,ry,0,180),false)}Z" style="fill:${fill};${S}"/>`;

// 개념탐구: 원기둥에 꼭 맞는 구
function sphereSvg(r){const cx=180,R=70,ry=20,yt=24,yb=164,cy=94;
 let b=body(cx,yt,yb,R,ry,C1)+arcPath(cx,yb,R,ry,180,360,HID);
 b+=`<circle cx="${cx}" cy="${cy}" r="${R}" style="fill:#cfcfcf;fill-opacity:.75;${THIN}"/>`;
 b+=arcPath(cx,cy,R,ry,0,180,HID)+arcPath(cx,cy,R,ry,180,360,HID);
 b+=ell(cx,yt,R,ry,'fill:#f7f7f7;fill-opacity:.55;'+S);
 b+=line(cx,cy,cx+R,cy,THIN)+dot(cx,cy)+dim(cx,cy,cx+R,cy,-11,r+' cm',{off:9});
 return svg(360,yb+ry+8,`반지름이 ${r} cm인 구가 원기둥에 꼭 맞게 들어 있는 그림`,b);}

// 예제 1: 원기둥 3개 쌓기
function stackSvg(ds,h){const s=Math.min(220/ds[2],210/(3*h)),hp=h*s,cx=180,k=0.3;const rs=ds.map(d=>d*s/2);
 const y0=10+rs[0]*k;let b='',hid='';
 for(let i=2;i>=0;i--){const rx=rs[i],ry=rx*k,yt=y0+i*hp,yb=yt+hp;
  b+=body(cx,yt,yb,rx,ry,[C1,C2,C3][i])+ell(cx,yt,rx,ry,'fill:#f7f7f7;'+S);
  hid+=arcPath(cx,yb,rx,ry,180,360,HID);}
 const yb=y0+3*hp;return svg(360,yb+rs[2]*k+10,`밑면의 지름이 ${ds.join(' cm, ')} cm인 원기둥 3개를 큰 것부터 쌓은 그림`,b+hid);}

// 예제 2: 직각삼각형을 θ°만큼 돌린 입체
function coneSvg(r,a,l,th){const s=Math.min(190/a,120/r),cx=180,R=r*s,ry=R*0.32,Ay=22,By=Ay+a*s;
 const Pb=ph=>[cx+R*Math.cos(rad(ph)),By-ry*Math.sin(rad(ph))];const D=Pb(90-th/2),L=Pb(90+th/2),A=[cx,Ay],B=[cx,By];
 const back=[];const n=40;for(let i=0;i<=n;i++)back.push(Pb(90-th/2+th*i/n));
 let b=`<path d="M${f(cx)} ${f(Ay)}${seg(back,false)}Z" style="fill:${C1};stroke:none"/>`;
 b+=poly([A,B,D],`fill:${C2};${S}`)+poly([A,B,L],`fill:${C3};${S}`);
 b+=`<path d="${seg(back,true)}" style="${HID}"/>`+rmark(B,A,D,9);
 b+=T(cx,Ay-6,'ㄱ','middle',15)+T(cx,By+19,'ㄴ','middle',15)+T(D[0]+8,D[1]+5,'ㄷ','start',15)+T(L[0]-8,L[1]+5,'ㄹ','end',15);
 b+=dim(A[0],A[1],D[0],D[1],-14,l+' cm');
 b+=dim(B[0],B[1],D[0],D[1],8,r+' cm',{off:4});
 const ly=Ay+0.66*(By-Ay);b+=`<path d="M${f(cx)} ${f(Ay)}Q${f(cx-14)} ${f((Ay+By)/2)} ${f(cx)} ${f(By)}" style="${DIM}"/>`+T(cx-10,ly,a+' cm','end');
 return svg(360,By+28,`직각삼각형 ㄱㄴㄷ을 변 ㄱㄴ을 축으로 ${th}도 돌린 입체도형`,b);}

// 예제 3: 구멍 하나는 뚫고 하나는 판 원기둥
// 글자 뒤에 흰 테두리를 둘러 점선 위에서도 읽히게 한다.
const TL=(x,y,t,a,sz)=>`<text x="${f(x)}" y="${f(y)}" text-anchor="${a||'middle'}" font-size="${sz||12}" fill="#222" style="font-family:inherit;paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round">${t}</text>`;
function holesSvg(R,H,r1,r2,d){const s=Math.min(170/H,150/(2*R)),cx=180,k=0.3,rx=R*s,ry=rx*k,yt=34+ry,yb=yt+H*s;
 const x1=cx-(R-r1-1)*s,x2=cx+(R-r2-1)*s,a1=r1*s,a2=r2*s,yd=yt+d*s;
 let b=body(cx,yt,yb,rx,ry,C2)+ell(cx,yt,rx,ry,'fill:#f4f4f4;'+S);
 b+=ell(x1,yt,a1,a1*k,`fill:${C4};${S}`)+ell(x2,yt,a2,a2*k,`fill:${C3};${S}`);
 b+=line(x1-a1,yt,x1-a1,yb,HID)+line(x1+a1,yt,x1+a1,yb,HID)+ell(x1,yb,a1,a1*k,HID);
 b+=line(x2-a2,yt,x2-a2,yd,HID)+line(x2+a2,yt,x2+a2,yd,HID)+ell(x2,yd,a2,a2*k,HID);
 b+=arcPath(cx,yb,rx,ry,180,360,HID);
 b+=dim(cx-rx,yt,cx-rx,yb,14,H+' cm');
 b+=line(x2+a2,yd,cx+rx+16,yd,'stroke:#55524d;stroke-width:1px;stroke-dasharray:2 3')+line(cx+rx,yt,cx+rx+16,yt,'stroke:#55524d;stroke-width:1px;stroke-dasharray:2 3');
 b+=dim(cx+rx+12,yt,cx+rx+12,yd,-10,d+' cm');
 // 원본 그림처럼 두 구멍과 큰 원기둥의 반지름을 그림에 적는다.
 const LEAD='stroke:#55524d;stroke-width:0.9px';
 b+=line(x1,yt,x1+a1,yt,THIN)+dot(x1,yt)+line(x1+a1/2,yt,x1-a1-4,yt-ry-6,LEAD)+TL(x1-a1-6,yt-ry-9,r1+' cm','end');
 b+=line(x2,yt,x2+a2,yt,THIN)+dot(x2,yt)+line(x2+a2/2,yt,cx+rx+2,yt-ry-6,LEAD)+TL(cx+rx+4,yt-ry-9,r2+' cm','start');
 b+=line(cx,yb,cx+rx,yb,THIN)+dot(cx,yb)+TL(cx+rx/2,yb-6,R+' cm');
 return svg(360,yb+ry+10,'큰 원기둥에 작은 원기둥 구멍 두 개가 있는 그림',b);}

// 예제 4: 통나무를 n번 자르기
function logSvg(r,n){const h=(n-1)*r,s=Math.min(250/h,70/r),R=r*s,ex=R*0.3,x0=80,x1=x0+h*s,cy=14+R;
 let b=`<path d="M${f(x0)} ${f(cy-R)}L${f(x1)} ${f(cy-R)}${seg(arcPts(x1,cy,ex,R,-90,90),false)}L${f(x0)} ${f(cy+R)}Z" style="fill:${C3};${S}"/>`;
 for(let i=1;i<=n;i++){const xi=x0+h*s*i/(n+1);b+=arcPath(xi,cy,ex,R,-90,90,'fill:none;stroke:#222;stroke-width:1px;stroke-dasharray:5 3');}
 b+=ell(x0,cy,ex,R,'fill:#eeeeee;'+S)+line(x0,cy,x0,cy-R,THIN)+dot(x0,cy);
 b+=dim(x0,cy,x0,cy-R,-(ex+12),r+' cm');
 return svg(360,cy+R+12,`밑면의 반지름이 ${r} cm인 통나무와 자를 자리 ${n}곳`,b);}

// Mission 1: 직사각형
function rectSvg(w,t){const s=Math.min(190/w,170/t),W=w*s,Hh=t*s,x0=(360-W)/2-14,y0=12;
 let b=`<rect x="${f(x0)}" y="${f(y0)}" width="${f(W)}" height="${f(Hh)}" style="fill:${C2};${S}"/>`;
 b+=dim(x0+W,y0,x0+W,y0+Hh,-14,t+' cm')+dim(x0,y0+Hh,x0+W,y0+Hh,12,w+' cm');
 return svg(360,y0+Hh+40,`가로 ${w} cm, 세로 ${t} cm인 직사각형`,b);}

// Mission 2: 원기둥의 1/3을 잘라 낸 입체
function wedgeSvg(R,H){const s=Math.min(110/R,150/H),cx=180,rx=R*s,ry=rx*0.38,yt=16+ry,yb=yt+H*s,Ct=[cx,yt],Cb=[cx,yb];
 const Pt=a=>E(cx,yt,rx,ry,a),Pb=a=>E(cx,yb,rx,ry,a);
 let b=arcPath(cx,yb,rx,ry,180,360,HID);
 b+=`<path d="${seg(arcPts(cx,yt,rx,ry,0,30),true)}${seg(arcPts(cx,yb,rx,ry,30,0),false)}Z" style="fill:${C2};${S}"/>`;
 b+=`<path d="${seg(arcPts(cx,yt,rx,ry,150,180),true)}${seg(arcPts(cx,yb,rx,ry,180,150),false)}Z" style="fill:${C2};${S}"/>`;
 b+=poly([Ct,Pt(30),Pb(30),Cb],`fill:${C3};${S}`)+poly([Ct,Pt(150),Pb(150),Cb],`fill:${C4};${S}`);
 b+=`<path d="M${f(cx)} ${f(yt)}${seg(arcPts(cx,yt,rx,ry,150,390),false)}Z" style="fill:#f2f2f2;${S}"/>`;
 const Q=Pt(200);b+=line(cx,yt,Q[0],Q[1],THIN)+dot(cx,yt)+dim(cx,yt,Q[0],Q[1],9,R+' cm',{off:3});
 b+=dim(cx+rx,yt,cx+rx,yb,-14,H+' cm');
 b+=`<path d="${seg(arcPts(cx,yb,30,30*0.38,30,150),true)}" style="fill:none;stroke:#222;stroke-width:1px"/>`+T(cx,yb+30*0.38+17,'120°');
 return svg(360,yb+ry+12,'원기둥에서 중심각 120도만큼을 잘라 낸 입체도형',b);}

// Mission 3: 반원기둥에 반원기둥 홈 4개
function grooveSvg(R,Lh,dd){const s=200/(2*R),Rs=R*s,rho=dd*s/2,x0=30,dx=Lh*s*0.5,dy=-Lh*s*0.32,yb=12+Rs-dy,cxf=x0+Rs;
 const dl=Math.hypot(dx,dy),nx=dy/dl,ny=-dx/dl; // 왼쪽 위 접점 방향
 let aT=Math.atan2(ny,nx)*180/Math.PI;if(aT<180)aT+=360;
 const frontArc=(a0,a1,ox,oy)=>arcPts(cxf+ox,yb+oy,Rs,Rs,a0,a1);
 let b=`<path d="${seg(frontArc(aT,360,0,0),true)}${seg(frontArc(360,aT,dx,dy),false)}Z" style="fill:${C2};${S}"/>`;
 let hid=`<path d="${seg(frontArc(180,aT,dx,dy),true)}" style="${HID}"/>`;
 for(let k=0;k<4;k++){const c=x0+(2*k+1)*rho;hid+=arcPath(c+dx,yb+dy,rho,rho,180,360,HID)+line(c,yb-rho,c+dx,yb-rho+dy,HID);}
 let fp=`M${f(x0)} ${f(yb)}${seg(frontArc(180,360,0,0),false)}`;
 for(let k=3;k>=0;k--){const c=x0+(2*k+1)*rho;fp+=seg(arcPts(c,yb,rho,rho,360,180),false);}
 b+=hid+`<path d="${fp}Z" style="fill:${C1};${S}"/>`+line(x0+2*Rs,yb,x0+2*Rs+dx,yb+dy,S);
 for(let k=0;k<4;k++)b+=dim(x0+2*k*rho,yb,x0+2*(k+1)*rho,yb,9,dd+' cm');
 b+=dim(x0+2*Rs,yb,x0+2*Rs+dx,yb+dy,12,Lh+' cm');
 return svg(360,yb+34,`반지름 ${R} cm인 반원기둥에서 지름 ${dd} cm인 반원기둥 4개를 잘라 낸 입체도형`,b);}

// Mission 4: 밑면에 수직인 평면으로 자른 원기둥
function chordSvg(R,H,c,h2){const s=Math.min(125/R,95/H),cx=170,rx=R*s,ry=rx*0.5,yt=14+ry,yb=yt+H*s;
 const Pt=a=>E(cx,yt,rx,ry,a),Pb=a=>E(cx,yb,rx,ry,a),M=[cx,yt+ry/2];
 let b=arcPath(cx,yb,rx,ry,180,360,HID);
 b+=`<path d="${seg(arcPts(cx,yt,rx,ry,0,30),true)}${seg(arcPts(cx,yb,rx,ry,30,0),false)}Z" style="fill:${C2};${S}"/>`;
 b+=`<path d="${seg(arcPts(cx,yt,rx,ry,150,180),true)}${seg(arcPts(cx,yb,rx,ry,180,150),false)}Z" style="fill:${C2};${S}"/>`;
 b+=poly([Pt(30),Pt(150),Pb(150),Pb(30)],`fill:${C3};${S}`);
 b+=`<path d="${seg(arcPts(cx,yt,rx,ry,150,390),true)}Z" style="fill:#f2f2f2;${S}"/>`;
 const A=Pt(30);b+=line(cx,yt,A[0],A[1],THIN)+line(cx,yt,M[0],M[1],THIN)+dot(cx,yt)+rmark(M,[cx,yt],A,7);
 b+=dim(cx,yt,A[0],A[1],-10,R+' cm',{off:2});
 b+=dim(cx,yt,M[0],M[1],13,h2+' cm',{off:3});
 const aa=Math.atan2(A[1]-yt,A[0]-cx)*180/Math.PI;b+=arcPath(cx,yt,15,15,aa,90,'fill:none;stroke:#222;stroke-width:1px');
 const bis=rad((aa+90)/2);b+=T(cx+27*Math.cos(bis)+2,yt+27*Math.sin(bis)+5,'60°','start',12);
 const B1=Pb(150),B2=Pb(30);b+=dim(B1[0],B1[1],B2[0],B2[1],10,c+' cm');
 b+=dim(cx+rx,yt,cx+rx,yb,-12,H+' cm');
 return svg(360,yb+ry+12,`밑면의 반지름이 ${R} cm인 원기둥을 밑면에 수직으로 자른 입체도형`,b);}

// Mission 5: 원기둥 3개를 차례로 파낸 입체
function digSvg(D,H,L){const s=Math.min(200/D,160/H),cx=180,k=0.3,rx=D*s/2,ry=rx*k,yt=14+ry,yb=yt+H*s;
 let b=body(cx,yt,yb,rx,ry,C2)+ell(cx,yt,rx,ry,'fill:#f4f4f4;'+S)+arcPath(cx,yb,rx,ry,180,360,HID);
 b+=ell(cx,yt,L[0][0]*s/2,L[0][0]*s/2*k,`fill:${C4};${S}`);let y=yt;
 L.forEach(([d,h],i)=>{const a=d*s/2,y2=y+h*s;if(i>0)b+=ell(cx,y,a,a*k,HID);b+=line(cx-a,y,cx-a,y2,HID)+line(cx+a,y,cx+a,y2,HID)+ell(cx,y2,a,a*k,HID);y=y2;});
 // 원본 그림처럼 파낸 원기둥마다 밑면의 지름(왼쪽)과 높이(오른쪽)를 적는다.
 y=yt;L.forEach(([d,h])=>{const a=d*s/2,y2=y+h*s;b+=line(cx-a,y,cx+a,y,'stroke:#222;stroke-width:0.9px;stroke-dasharray:2 2')+TL(cx-a-6,y+4,d+' cm','end',11)+TL(cx+a+6,(y+y2)/2+4,h+' cm','start',11);y=y2;});
 b+=dim(cx+rx,yt,cx+rx,yb,-14,H+' cm');
 return svg(360,yb+ry+10,'원기둥 가운데를 지름이 점점 작은 원기둥 3개로 차례로 파낸 그림',b);}

// Mission 6: 원기둥
function cylSvg(r,h){const s=Math.min(170/h,60/r),cx=170,rx=r*s,ry=rx*0.3,yt=34,yb=yt+h*s;
 let b=body(cx,yt,yb,rx,ry,C3)+ell(cx,yt,rx,ry,'fill:#efefef;'+S)+arcPath(cx,yb,rx,ry,180,360,HID);
 b+=line(cx,yt,cx+rx,yt,THIN)+dot(cx,yt)+dim(cx,yt,cx+rx,yt,-Math.max(6,rx*0.22),r+' cm',{a:'start',x:cx+rx+6,y:yt-12});
 b+=dim(cx+rx,yt,cx+rx,yb,-14,h+' cm');
 return svg(360,yb+ry+10,`밑면의 반지름이 ${r} cm, 높이가 ${h} cm인 원기둥`,b);}

// ---------- 문항 ----------
const ITEMS={
 '6-2-u6-e4-exploration-1':{key:'source62U6E4Exploration1',resultContract:'single-value',answerVisualRequired:false,pool:[4,5,6].map(r=>{
   const A=r*r*3.1,C=2*r*3.1,L=C*2*r,t=2*A+L;return {
   prompt:P([`그림은 원기둥에 구를 꼭 맞게 넣은 것입니다. 구의 반지름이 ${r} cm라면 원기둥의 전개도의 넓이는 몇 cm²인지 구하세요. (원주율: 3.1)`,sphereSvg(r)]),
   answer:n2(t)+' cm²',
   solution:ol([`구가 꼭 맞게 들어가므로 원기둥의 밑면의 반지름은 구의 반지름과 같은 ${r} cm이고, 원기둥의 높이는 구의 지름과 같은 ${r} × 2 = ${2*r} (cm)입니다.`,
    `밑면 한 개의 넓이는 ${r} × ${r} × 3.1 = ${n2(A)} (cm²)이므로 두 밑면의 넓이는 ${n2(A)} × 2 = ${n2(2*A)} (cm²)입니다.`,
    `옆면은 가로가 밑면의 둘레 ${r} × 2 × 3.1 = ${n2(C)} (cm), 세로가 ${2*r} cm인 직사각형이므로 넓이는 ${n2(C)} × ${2*r} = ${n2(L)} (cm²)입니다.`,
    `전개도의 넓이는 ${n2(2*A)} + ${n2(L)} = ${n2(t)} (cm²)입니다.`])};})},
 '6-2-u6-e4-example-1':{key:'source62U6E4Example1',resultContract:'single-value',answerVisualRequired:false,pool:[[[2,4,6],4],[[4,6,10],5],[[2,6,8],3]].map(([ds,h])=>{
   const rB=ds[2]/2,top=rB*rB*3.1*2,sides=ds.map(d=>d*3.1*h),side=sides.reduce((x,y)=>x+y,0),t=top+side;return {
   prompt:P([`그림은 밑면의 지름이 각각 ${ds[0]} cm, ${ds[1]} cm, ${ds[2]} cm이고 높이가 모두 ${h} cm인 원기둥 3개를 쌓아 올린 입체도형입니다. 이 입체도형의 겉넓이를 구하세요. (원주율: 3.1)`,stackSvg(ds,h)]),
   answer:n2(t)+' cm²',
   solution:ol([`위에서 내려다보면 각 원기둥의 윗면 중 보이는 부분을 모두 모은 넓이가 가장 큰 원기둥의 밑면 넓이와 같고, 아래에서 보면 가장 큰 원기둥의 밑면이 보입니다.`,
    `그래서 위아래 면의 넓이의 합은 반지름이 ${rB} cm인 원 2개의 넓이로 ${rB} × ${rB} × 3.1 × 2 = ${n2(top)} (cm²)입니다.`,
    `옆면의 넓이는 각각 ${ds[0]} × 3.1 × ${h} = ${n2(sides[0])} (cm²), ${ds[1]} × 3.1 × ${h} = ${n2(sides[1])} (cm²), ${ds[2]} × 3.1 × ${h} = ${n2(sides[2])} (cm²)이므로 합은 ${n2(side)} cm²입니다.`,
    `겉넓이는 ${n2(top)} + ${n2(side)} = ${n2(t)} (cm²)입니다.`])};})},
 '6-2-u6-e4-example-2':{key:'source62U6E4Example2',resultContract:'single-value',answerVisualRequired:false,pool:[[5,12,13,168],[6,8,10,150],[8,15,17,135]].map(([r,a,l,th])=>{
   const base=r*r*3*th/360,whole=r*l*3,lat=whole*th/360,tri=a*r/2,t=base+lat+2*tri;return {
   prompt:P([`그림은 직각삼각형 ㄱㄴㄷ을 변 ㄱㄴ을 회전축으로 하여 ${th}°만큼 돌려서 만든 입체도형입니다. 이 입체도형의 겉넓이를 구하세요. (원주율: 3)`,coneSvg(r,a,l,th)]),
   answer:n2(t)+' cm²',
   solution:ol([`이 입체도형의 겉면은 밑면(중심각이 ${th}°인 부채꼴), 굽은 옆면, 삼각형 ㄱㄴㄷ과 삼각형 ㄱㄴㄹ로 이루어져 있습니다. 돌린 각도는 한 바퀴의 ${fr(th,360)}입니다.`,
    `밑면의 넓이는 ${r} × ${r} × 3 × ${fr(th,360)} = ${n2(base)} (cm²)입니다.`,
    `한 바퀴 돌린 원뿔의 옆면을 펼치면 반지름이 ${l} cm인 원의 일부이고, 그 호의 길이(밑면의 둘레)는 반지름 ${l} cm인 원의 둘레의 ${fr(r,l)}입니다. 그래서 원뿔 전체의 옆면 넓이는 ${l} × ${l} × 3 × ${fr(r,l)} = ${n2(whole)} (cm²)입니다.`,
    `굽은 옆면은 그중 ${fr(th,360)}이므로 ${n2(whole)} × ${fr(th,360)} = ${n2(lat)} (cm²)입니다.`,
    `삼각형 두 개의 넓이는 ${r} × ${a} ÷ 2 × 2 = ${n2(2*tri)} (cm²)입니다.`,
    `겉넓이는 ${n2(base)} + ${n2(lat)} + ${n2(2*tri)} = ${n2(t)} (cm²)입니다.`])};})},
 '6-2-u6-e4-example-3':{key:'source62U6E4Example3',resultContract:'single-value',answerVisualRequired:false,pool:[[9,25,2,4,17],[10,20,3,4,12],[8,15,2,3,10]].map(([R,H,r1,r2,d])=>{
   const bases=(R*R*3.1-r1*r1*3.1)*2,s1=R*2*3.1*H,s2=r1*2*3.1*H,s3=r2*2*3.1*d,t=bases+s1+s2+s3;return {
   prompt:P([`다음 입체도형은 큰 원기둥에서 작은 원기둥 2개를 뺀 것입니다. 이 입체도형의 겉넓이를 구하세요. (원주율: 3.1)`,holesSvg(R,H,r1,r2,d)]),
   answer:n2(t)+' cm²',
   solution:ol([`풀이 기준: 그림의 수는 큰 원기둥의 밑면의 반지름 ${R} cm, 높이 ${H} cm이고, 밑면의 반지름이 ${r1} cm인 원기둥은 위에서 아래까지 뚫어 냈고 밑면의 반지름이 ${r2} cm인 원기둥은 위에서부터 ${d} cm 깊이만큼 파낸 것으로 봅니다.`,`반지름이 ${r2} cm인 구멍은 윗면에서 빠진 원과 같은 크기의 원이 구멍의 바닥에 생기므로 위아래 면의 넓이는 변하지 않습니다. 반지름이 ${r1} cm인 구멍은 윗면과 아랫면에서 원이 하나씩 빠집니다.`,
    `위아래 면의 넓이는 (${R} × ${R} × 3.1 − ${r1} × ${r1} × 3.1) × 2 = ${n2(bases)} (cm²)입니다.`,
    `큰 원기둥의 옆면의 넓이는 ${R} × 2 × 3.1 × ${H} = ${n2(s1)} (cm²)입니다.`,
    `뚫어 낸 구멍 안쪽의 옆면의 넓이는 ${r1} × 2 × 3.1 × ${H} = ${n2(s2)} (cm²)입니다.`,
    `파낸 구멍 안쪽의 옆면의 넓이는 ${r2} × 2 × 3.1 × ${d} = ${n2(s3)} (cm²)입니다.`,
    `겉넓이는 ${n2(bases)} + ${n2(s1)} + ${n2(s2)} + ${n2(s3)} = ${n2(t)} (cm²)입니다.`])};})},
 '6-2-u6-e4-example-4':{key:'source62U6E4Example4',resultContract:'single-value',answerVisualRequired:false,pool:[[21,5],[14,3],[28,6]].map(([r,n])=>{
   const A=r*r*22/7,N=2*n*A,L=N-2*A,C=r*2*22/7,h=L/C,p=h/(n+1);return {
   prompt:P([`그림과 같이 밑면의 반지름이 ${r} cm인 원기둥 모양의 통나무를 일정한 간격으로 ${n}번 잘랐습니다. 자른 나무 도막 전체의 겉넓이의 합이 처음 통나무의 겉넓이의 2배일 때, 자른 나무 도막 한 개의 높이는 몇 cm인가요? (원주율: ${ff(22,7)})`,logSvg(r,n)]),
   answer:n2(p)+' cm',
   solution:ol([`${n}번 자르면 나무 도막은 ${n+1}개가 되고, 한 번 자를 때마다 밑면과 같은 원이 2개씩 새로 생기므로 새로 생긴 원은 ${n} × 2 = ${2*n}(개)입니다.`,
    `원 한 개의 넓이는 ${r} × ${r} × ${ff(22,7)} = ${n2(A)} (cm²)이므로 새로 생긴 넓이는 ${n2(A)} × ${2*n} = ${n2(N)} (cm²)입니다.`,
    `겉넓이의 합이 처음의 2배가 되었으므로 새로 생긴 넓이 ${n2(N)} cm²는 처음 통나무의 겉넓이와 같습니다. 따라서 처음 통나무의 옆면의 넓이는 ${n2(N)} − ${n2(A)} × 2 = ${n2(L)} (cm²)입니다.`,
    `밑면의 둘레는 ${r} × 2 × ${ff(22,7)} = ${n2(C)} (cm)이므로 통나무의 길이는 ${n2(L)} ÷ ${n2(C)} = ${n2(h)} (cm)입니다.`,
    `나무 도막 한 개의 높이는 ${n2(h)} ÷ ${n+1} = ${n2(p)} (cm)입니다.`])};})},
 '6-2-u6-e4-mission-1':{key:'source62U6E4Mission1',resultContract:'single-value',answerVisualRequired:false,pool:[[11,13],[8,12],[14,17]].map(([w,t])=>{
   const c1=t*2*3,p1=(c1+w)*2,c2=w*2*3,p2=(c2+t)*2,dd=Math.abs(p1-p2);return {
   prompt:P([`그림의 직사각형을 가로를 회전축으로 하여 한 바퀴 돌려 만든 입체도형과, 세로를 회전축으로 하여 한 바퀴 돌려 만든 입체도형이 있습니다. 두 입체도형의 전개도에서 옆면의 둘레의 차는 몇 cm인지 구하세요. (원주율: 3)`,rectSvg(w,t)]),
   answer:n2(dd)+' cm',
   solution:ol([`가로(${w} cm)를 회전축으로 돌리면 밑면의 반지름이 ${t} cm, 높이가 ${w} cm인 원기둥이 됩니다. 옆면은 가로가 ${t} × 2 × 3 = ${c1} (cm), 세로가 ${w} cm인 직사각형이므로 둘레는 (${c1} + ${w}) × 2 = ${p1} (cm)입니다.`,
    `세로(${t} cm)를 회전축으로 돌리면 밑면의 반지름이 ${w} cm, 높이가 ${t} cm인 원기둥이 됩니다. 옆면은 가로가 ${w} × 2 × 3 = ${c2} (cm), 세로가 ${t} cm인 직사각형이므로 둘레는 (${c2} + ${t}) × 2 = ${p2} (cm)입니다.`,
    `두 옆면의 둘레의 차는 ${Math.max(p1,p2)} − ${Math.min(p1,p2)} = ${dd} (cm)입니다.`])};})},
 '6-2-u6-e4-mission-2':{key:'source62U6E4Mission2',resultContract:'single-value',answerVisualRequired:false,pool:[[9,14],[6,10],[10,8]].map(([R,H])=>{
   const B=R*R*3*2/3*2,Sd=R*2*3*H*2/3,Q=R*H*2,t=B+Sd+Q;return {
   prompt:P([`그림의 입체도형은 원기둥의 ${ff(1,3)}만큼을 잘라 내고 남은 것입니다. 이 입체도형의 겉면에 색종이를 겹치지 않게 빈틈없이 붙이려고 합니다. 필요한 색종이의 넓이는 몇 cm²인지 구하세요. (원주율: 3)`,wedgeSvg(R,H)]),
   answer:n2(t)+' cm²',
   solution:ol([`남은 입체도형은 원기둥의 ${ff(2,3)}이므로 위아래 면은 원의 ${ff(2,3)}만큼인 모양 2개입니다. 넓이는 ${R} × ${R} × 3 × ${ff(2,3)} × 2 = ${n2(B)} (cm²)입니다.`,
    `굽은 옆면은 원기둥 옆면의 ${ff(2,3)}이므로 ${R} × 2 × 3 × ${H} × ${ff(2,3)} = ${n2(Sd)} (cm²)입니다.`,
    `잘라 낸 자리에 생긴 면은 가로 ${R} cm, 세로 ${H} cm인 직사각형 2개이므로 ${R} × ${H} × 2 = ${n2(Q)} (cm²)입니다.`,
    `필요한 색종이의 넓이는 ${n2(B)} + ${n2(Sd)} + ${n2(Q)} = ${n2(t)} (cm²)입니다.`])};})},
 '6-2-u6-e4-mission-3':{key:'source62U6E4Mission3',resultContract:'single-value',answerVisualRequired:false,pool:[[16,25],[12,20],[20,30]].map(([R,L])=>{
   const dd=R/2,r=dd/2,X=R*R*3/2,y=r*r*3/2,Y=y*4,ends=(X-Y)*2,big=R*2*3*L/2,gr=r*2*3*L/2*4,t=ends+big+gr;return {
   prompt:P([`다음 입체도형은 밑면의 반지름이 ${R} cm이고 높이가 ${L} cm인 원기둥의 반에서, 밑면의 지름이 ${dd} cm이고 높이가 ${L} cm인 원기둥의 반을 4번 잘라 낸 것입니다. 이 입체도형의 겉넓이를 구하세요. (원주율: 3)`,grooveSvg(R,L,dd)]),
   answer:n2(t)+' cm²',
   solution:ol([`잘라 낸 작은 반원 4개의 지름의 합은 ${dd} × 4 = ${4*dd} (cm)로 큰 반원의 지름과 같으므로, 바닥에는 평평한 면이 남지 않습니다.`,
    `앞뒤 면 한 개의 넓이는 큰 반원 ${R} × ${R} × 3 ÷ 2 = ${n2(X)} (cm²)에서 작은 반원 4개 ${r} × ${r} × 3 ÷ 2 × 4 = ${n2(Y)} (cm²)를 뺀 ${n2(X-Y)} cm²이므로, 앞뒤 면의 넓이는 ${n2(X-Y)} × 2 = ${n2(ends)} (cm²)입니다.`,
    `큰 반원기둥의 굽은 면의 넓이는 ${R} × 2 × 3 × ${L} ÷ 2 = ${n2(big)} (cm²)입니다.`,
    `잘라 낸 자리에 생긴 작은 반원기둥 4개의 굽은 면의 넓이는 ${r} × 2 × 3 × ${L} ÷ 2 × 4 = ${n2(gr)} (cm²)입니다.`,
    `겉넓이는 ${n2(ends)} + ${n2(big)} + ${n2(gr)} = ${n2(t)} (cm²)입니다.`])};})},
 '6-2-u6-e4-mission-4':{key:'source62U6E4Mission4',resultContract:'single-value',answerVisualRequired:false,pool:[[9,3,'15.6','4.5'],[6,4,'10.4','3'],[12,5,'20.8','6']].map(([R,H,c,h2])=>{
   const Sx=R*R*3.14*2/3,Tr=(+c)*(+h2)/2,B=Sx+Tr,arc=R*2*3.14*2/3,cur=arc*H,rect=(+c)*H,t=2*B+cur+rect;return {
   prompt:P([`그림과 같이 밑면의 반지름이 ${R} cm인 원기둥을 밑면에 수직인 평면으로 잘랐습니다. 남은 입체도형의 겉넓이를 구하세요. (원주율: 3.14)`,chordSvg(R,H,c,h2)]),
   answer:n2(t)+' cm²',
   solution:ol([`밑면의 중심에서 자른 선에 수직으로 그은 선분과 반지름이 이루는 각이 60°이므로, 자른 선의 양 끝과 중심을 이어 만든 각은 60° × 2 = 120°입니다. 따라서 남은 밑면은 중심각이 360° − 120° = 240°인 부채꼴과, 밑변이 ${c} cm이고 높이가 ${h2} cm인 삼각형으로 나뉩니다.`,
    `밑면 한 개의 넓이는 ${R} × ${R} × 3.14 × ${ff(2,3)} + ${c} × ${h2} ÷ 2 = ${n2(Sx)} + ${n2(Tr)} = ${n2(B)} (cm²)이므로 두 밑면의 넓이는 ${n2(B)} × 2 = ${n2(2*B)} (cm²)입니다.`,
    `굽은 옆면은 가로가 ${R} × 2 × 3.14 × ${ff(2,3)} = ${n2(arc)} (cm), 세로가 ${H} cm인 직사각형과 같으므로 넓이는 ${n2(arc)} × ${H} = ${n2(cur)} (cm²)입니다.`,
    `자른 면은 가로 ${c} cm, 세로 ${H} cm인 직사각형이므로 넓이는 ${c} × ${H} = ${n2(rect)} (cm²)입니다.`,
    `겉넓이는 ${n2(2*B)} + ${n2(cur)} + ${n2(rect)} = ${n2(t)} (cm²)입니다.`])};})},
 '6-2-u6-e4-mission-5':{key:'source62U6E4Mission5',resultContract:'single-value',answerVisualRequired:false,pool:[[20,16,[[8,6],[4,4],[2,2]]],[16,12,[[6,5],[4,3],[2,2]]],[24,18,[[10,6],[6,5],[2,3]]]].map(([D,H,L])=>{
   const R=D/2,bases=R*R*3.1*2,side=D*3.1*H,ins=L.map(([d,h])=>d*3.1*h),inS=ins.reduce((x,y)=>x+y,0),t=bases+side+inS;return {
   prompt:P([`밑면의 지름이 ${D} cm, 높이가 ${H} cm인 원기둥에서 밑면의 지름과 높이가 다음 그림과 같은 원기둥 3개를 차례로 이어서 파냈습니다. 이 입체도형의 겉넓이를 구하세요. (원주율: 3.1)`,digSvg(D,H,L)]),
   answer:n2(t)+' cm²',
   solution:ol([`풀이 기준: 그림의 수는 파낸 원기둥이 위에서부터 차례로 밑면의 지름 ${L[0][0]} cm·높이 ${L[0][1]} cm, 지름 ${L[1][0]} cm·높이 ${L[1][1]} cm, 지름 ${L[2][0]} cm·높이 ${L[2][1]} cm인 것으로 봅니다.`,`위에서 내려다보면 파낸 구멍의 바닥과 층계 모양의 면들이 윗면에서 빠진 원을 꼭 채우므로, 위아래로 보이는 면의 넓이는 처음 원기둥의 두 밑면의 넓이와 같습니다.`,
    `두 밑면의 넓이는 ${R} × ${R} × 3.1 × 2 = ${n2(bases)} (cm²)이고, 처음 원기둥의 옆면의 넓이는 ${D} × 3.1 × ${H} = ${n2(side)} (cm²)입니다.`,
    `파낸 원기둥 3개의 옆면의 넓이는 ${L.map(([d,h])=>`${d} × 3.1 × ${h}`).join(' + ')} = ${ins.map(n2).join(' + ')} = ${n2(inS)} (cm²)입니다.`,
    `겉넓이는 ${n2(bases)} + ${n2(side)} + ${n2(inS)} = ${n2(t)} (cm²)입니다.`])};})},
 '6-2-u6-e4-mission-6':{key:'source62U6E4Mission6',resultContract:'single-value',answerVisualRequired:false,pool:[[3,12],[2,10],[4,24]].map(([r,h])=>{
   const red=r*2*3.14*h,A=r*r*3.14,m=Math.round(red/A),pcs=m/2,cut=pcs-1;return {
   prompt:P([`그림의 원기둥을 회전축에 수직인 평면으로 몇 번 잘랐습니다. 자른 입체도형들의 옆면에는 모두 빨간색을 칠하고, 두 밑면에는 모두 파란색을 칠했더니 빨간색으로 칠한 넓이의 합과 파란색으로 칠한 넓이의 합이 같았습니다. 원기둥을 자른 횟수는 몇 번인가요? (원주율: 3.14)`,cylSvg(r,h)]),
   answer:cut+'번',
   solution:ol([`회전축에 수직으로 자르면 도막들의 옆면을 모두 이어 붙인 넓이는 처음 원기둥의 옆면의 넓이와 같으므로, 빨간색으로 칠한 넓이는 ${r} × 2 × 3.14 × ${h} = ${n2(red)} (cm²)입니다.`,
    `밑면 한 개의 넓이는 ${r} × ${r} × 3.14 = ${n2(A)} (cm²)이고, 파란색으로 칠한 넓이도 ${n2(red)} cm²이므로 밑면은 모두 ${n2(red)} ÷ ${n2(A)} = ${m}(개)입니다.`,
    `도막 한 개에 밑면이 2개씩 있으므로 도막은 ${m} ÷ 2 = ${pcs}(개)입니다.`,
    `도막이 ${pcs}개가 되려면 ${pcs} − 1 = ${cut}(번) 잘라야 합니다.`])};})},
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
