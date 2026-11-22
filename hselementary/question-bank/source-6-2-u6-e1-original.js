// 황소 6-2 6단원 개념탐구 1 (원기둥) 원문 구조 유형. 각 문항은 같은 구조·다른 수의 검증된 3문항 풀입니다.
(function(root){'use strict';
const GROUP='6-2-u6-e1';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;

// ---------- 수 표기 ----------
const n=v=>String(Math.round(v*10000)/10000); // 소수 오차 없이 표기
const cut1=v=>{const t=Math.floor(v*10+1e-9)/10;return t.toFixed(1);}; // 몫을 소수 첫째 자리까지 버림

// ---------- 그림 도우미 ----------
const S='stroke:#222;stroke-width:1.4px';
const DIM='fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3';
const FOLD='stroke:#222;stroke-width:1px;stroke-dasharray:3 3';
const f=v=>{const s=(Math.round(v*10)/10).toFixed(1);return s.endsWith('.0')?s.slice(0,-2):s;};
const svg=(w,h,label,body,mw)=>`<svg viewBox="0 0 ${w} ${h}" style="width:100%;max-width:${mw||360}px;height:auto;display:block;margin:8px auto;font-family:inherit" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const T=(x,y,t,a,sz)=>`<text x="${f(x)}" y="${f(y)}" text-anchor="${a||'middle'}" font-size="${sz||13}" fill="#222" style="font-family:inherit">${t}</text>`;
const line=(x1,y1,x2,y2,st)=>`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" style="${st||S}"/>`;
const dot=(x,y,r)=>`<circle cx="${f(x)}" cy="${f(y)}" r="${r||2.6}" style="fill:#222"/>`;
const circ=(x,y,r,st)=>`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" style="${st}"/>`;
const ell=(x,y,a,b,st)=>`<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(a)}" ry="${f(b)}" style="${st}"/>`;
// 타원의 앞쪽(아래) 반, 뒤쪽(위) 반
const ellFront=(cx,cy,a,b,st)=>`<path d="M${f(cx-a)} ${f(cy)}A${f(a)} ${f(b)} 0 0 0 ${f(cx+a)} ${f(cy)}" style="fill:none;${st}"/>`;
const ellBack=(cx,cy,a,b,st)=>`<path d="M${f(cx-a)} ${f(cy)}A${f(a)} ${f(b)} 0 0 1 ${f(cx+a)} ${f(cy)}" style="fill:none;${st}"/>`;
// 선분 (x1,y1)-(x2,y2)에 걸친 점선 치수 호. b>0이면 진행 방향의 왼쪽(화면 기준 (-dy,dx))으로 부풂.
function dim(x1,y1,x2,y2,b,label,gap){gap=gap===undefined?5:gap;const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L,mx_=(x1+x2)/2,my=(y1+y2)/2;
 const cx=mx_+nx*2*b,cy=my+ny*2*b,sg=b<0?-1:1,ux=nx*sg,uy=ny*sg,px=mx_+nx*b+ux*gap,py=my+ny*b+uy*gap;
 const anchor=ux>0.5?'start':ux<-0.5?'end':'middle',ty=uy>0.5?py+11:uy<-0.5?py-2:py+4.5;
 return `<path d="M${f(x1)} ${f(y1)}Q${f(cx)} ${f(cy)} ${f(x2)} ${f(y2)}" style="${DIM}"/>`+(label?T(px,ty,label,anchor):'');}
const arrow=(x,y)=>`<path d="M${f(x)} ${f(y-5)}L${f(x+14)} ${f(y-5)}L${f(x+14)} ${f(y-10)}L${f(x+24)} ${f(y)}L${f(x+14)} ${f(y+10)}L${f(x+14)} ${f(y+5)}L${f(x)} ${f(y+5)}Z" style="fill:#fff;stroke:#222;stroke-width:1.2px"/>`;

// 개념탐구: 원 4개 + 세로 철사 8개로 만든 원기둥 틀
function cageSvg(r,H){const a=70,b=18,cx=95,top=30,hp=a*H/r,rings=[0,1,2,3].map(j=>top+hp*j/3);
 let back='',front='';
 rings.forEach(y=>{back+=ellBack(cx,y,a,b,'stroke:#666;stroke-width:1.3px');front+=ellFront(cx,y,a,b,'stroke:#222;stroke-width:1.6px');});
 for(let k=0;k<8;k++){const t=(15+45*k)*Math.PI/180,x=cx+a*Math.cos(t),dy=b*Math.sin(t);
  if(Math.sin(t)>0)front+=line(x,top+dy,x,top+hp+dy,'stroke:#222;stroke-width:1.6px');else back+=line(x,top+dy,x,top+hp+dy,'stroke:#666;stroke-width:1.3px');}
 const body=back+front+dim(cx+a,top,cx+a,top+hp,-22,H+' cm');
 return svg(270,f(top+hp+b+12),`원 모양 철사 4개와 세로 철사 8개로 만든 높이 ${H} cm인 원기둥 모양 틀`,body,300);}

// 정사각형 안에 꼭 맞게 그린 원기둥 전개도 (위 밑면, 옆면, 아래 밑면)
function squareNetSvg(s,r,side,slot){const P=210,k=P/s,x0=slot?20:20,y0=14,d=2*r*k,h=P-2*d;
 let b=`<rect x="${x0}" y="${y0}" width="${P}" height="${P}" style="fill:#fff;${S}"/>`;
 b+=`<rect x="${x0}" y="${f(y0+d)}" width="${P}" height="${f(h)}" style="fill:#e4e4e4;${S}"/>`;
 b+=circ(x0+0.27*P,y0+d/2,d/2,'fill:#e4e4e4;'+S)+circ(x0+0.73*P,y0+P-d/2,d/2,'fill:#e4e4e4;'+S);
 if(slot)b+=`<rect x="${f(x0+0.27*P-d*0.22)}" y="${f(y0+d/2-4)}" width="${f(d*0.44)}" height="8" rx="2" style="fill:#fff;stroke:#222;stroke-width:1.1px"/>`;
 if(side==='right'){b+=dim(x0+P,y0,x0+P,y0+P,-22,n(s)+' cm');return svg(330,P+2*y0,`한 변이 ${n(s)} cm인 정사각형 안에 꼭 맞게 그린 원기둥의 전개도`,b);}
 b+=dim(x0,y0+P,x0+P,y0+P,18,n(s)+' cm');return svg(250,P+y0+48,`한 변이 ${n(s)} cm인 정사각형 모양의 원기둥 전개도`,b,280);}

// 롤러 (가로로 누운 원기둥)와 손잡이
function rollerSvg(len,r){const Lp=200,Dp=Lp*2*r/len,R=Dp/2,e=R*0.32,xl=70,xr=xl+Lp,cy=40+R;
 let b=`<path d="M${f(xl)} ${f(cy-R)}L${f(xr)} ${f(cy-R)}A${f(e)} ${f(R)} 0 0 1 ${f(xr)} ${f(cy+R)}L${f(xl)} ${f(cy+R)}Z" style="fill:#c9c9c9;${S}"/>`;
 b+=ell(xl,cy,e,R,'fill:#efefef;'+S);
 const hy=cy+R+34;
 b+=`<path d="M${f(xl)} ${f(cy)}L${f(xl-34)} ${f(cy)}L${f(xl-34)} ${f(hy)}L${f(xl+40)} ${f(hy)}L${f(xl+40)} ${f(hy+14)}" style="fill:none;stroke:#222;stroke-width:3px;stroke-linejoin:round"/>`;
 b+=`<rect x="${f(xl+31)}" y="${f(hy+14)}" width="18" height="46" rx="5" style="fill:#555;stroke:#222;stroke-width:1.2px"/>`;
 b+=dot(xl,cy,2.2)+dim(xl,cy-R,xr,cy-R,-16,n(len)+' cm');
 return svg(300,f(hy+68),`길이가 ${n(len)} cm인 원기둥 모양 롤러`,b,320);}

// 원기둥을 4등분한 입체의 전개도. pi: 원주율, letters: 꼭짓점 이름 표시 여부
function quarterNet(ox,oy,k,r,H,pi,o){const R=r*k,W=(2*r+pi*r/2)*k,Hp=H*k,X=v=>ox+v,Y=v=>oy+v;
 let b=`<path d="M${f(X(0))} ${f(Y(0))}L${f(X(R))} ${f(Y(0))}L${f(X(R))} ${f(Y(-R))}A${f(R)} ${f(R)} 0 0 1 ${f(X(2*R))} ${f(Y(0))}L${f(X(W))} ${f(Y(0))}L${f(X(W))} ${f(Y(Hp))}L${f(X(2*R))} ${f(Y(Hp))}A${f(R)} ${f(R)} 0 0 1 ${f(X(R))} ${f(Y(Hp+R))}L${f(X(R))} ${f(Y(Hp))}L${f(X(0))} ${f(Y(Hp))}Z" style="fill:${o.fill||'#fff'};${S}"/>`;
 b+=line(X(R),Y(0),X(R),Y(Hp),FOLD)+line(X(2*R),Y(0),X(2*R),Y(Hp),FOLD)+line(X(R),Y(0),X(2*R),Y(0),FOLD)+line(X(R),Y(Hp),X(2*R),Y(Hp),FOLD);
 if(o.letters){const L=(x,y,t,a)=>T(x,y,t,a||'middle',13);
  b+=L(X(-6),Y(-5),'ㄱ')+L(X(R-17),Y(-4),'ㅊ')+L(X(R),Y(-R-6),'ㅈ')+L(X(2*R+8),Y(-5),'ㅇ')+L(X(W+8),Y(-5),'ㅅ');
  b+=L(X(-6),Y(Hp+15),'ㄴ')+L(X(R-9),Y(Hp+15),'ㄷ')+L(X(R-9),Y(Hp+R+4),'ㄹ')+L(X(2*R+9),Y(Hp+15),'ㅁ')+L(X(W+8),Y(Hp+15),'ㅂ');}
 // 치수: ㄱㄴ(높이), ㅈㅊ(반지름), ㅊㅇ(반지름), ㅅㅇ(굽은 옆면의 가로)
 if(o.hLabel)b+=dim(X(0),Y(0),X(0),Y(Hp),14,o.hLabel);
 if(o.zcLabel)b+=o.zcInside?dim(X(R),Y(0),X(R),Y(-R),-9,o.zcLabel,4):dim(X(R),Y(0),X(R),Y(-R),-12,o.zcLabel,4);
 if(o.coLabel)b+=dim(X(R),Y(0),X(2*R),Y(0),9,o.coLabel,3);
 if(o.soLabel)b+=dim(X(2*R),Y(0),X(W),Y(0),9,o.soLabel,3);
 return b;}
function ex3Svg(r,H){const pi=3.14,Wc=2*r+pi*r/2,Hc=H+2*r,k=Math.min(240/Wc,250/Hc),R=r*k;
 const ox=60,oy=R+30,b=quarterNet(ox,oy,k,r,H,pi,{letters:true,hLabel:n(H)+' cm',zcLabel:n(r)+' cm',zcInside:true,coLabel:n(r)+' cm',soLabel:n(pi*r/2)+' cm'});
 return svg(f(ox+Wc*k+30),f(oy+H*k+R+24),`변 ㄱㄴ이 ${n(H)} cm, 변 ㅈㅊ과 변 ㅇㅊ이 ${n(r)} cm, 변 ㅅㅇ이 ${n(pi*r/2)} cm인 입체도형의 전개도`,b);}
function m3Svg(r,H){const a=34,eb=11,hp=a*H/r,cx=90,top=38,bot=top+hp;
 let b=`<path d="M${f(cx-a)} ${f(top)}L${f(cx-a)} ${f(bot)}A${a} ${eb} 0 0 0 ${f(cx+a)} ${f(bot)}L${f(cx+a)} ${f(top)}Z" style="fill:#e2e2e2;${S}"/>`;
 b+=ellBack(cx,bot,a,eb,'stroke:#222;stroke-width:1px;stroke-dasharray:3 3');
 b+=ell(cx,top,a,eb,'fill:#f4f4f4;'+S)+line(cx-a,top,cx+a,top,'stroke:#222;stroke-width:1.2px')+line(cx,top-eb,cx,top+eb,'stroke:#222;stroke-width:1.2px');
 b+=line(cx,top+eb,cx,bot+eb,'stroke:#222;stroke-width:1.2px');
 b+=dim(cx-a,top,cx,top,-(eb+8),n(r)+' cm',3)+dim(cx-a,top,cx-a,bot,16,n(H)+' cm');
 b+=arrow(cx+a+14,top+hp/2);
 const pi=3,Wc=2*r+pi*r/2,Hc=H+2*r,k=Math.min(160/Wc,200/Hc),R=r*k,ox=230,oy=R+20;
 b+=quarterNet(ox,oy,k,r,H,pi,{fill:'#e2e2e2',zcLabel:n(r)+' cm',coLabel:n(r)+' cm'});
 const hh=Math.max(oy+H*k+R+14,bot+eb+12);
 return svg(f(ox+Wc*k+16),f(hh),`밑면의 반지름이 ${n(r)} cm, 높이가 ${n(H)} cm인 원기둥을 4등분한 그림과 그중 한 입체도형의 전개도`,b,380);}

// 실(길)이 옆면을 N바퀴 감은 원기둥. 점 ㄱ은 윗면 왼쪽, 점 ㄴ은 아랫면 왼쪽.
function helixCyl(cx,top,a,eb,hp,N,o){const bot=top+hp;
 let b=`<path d="M${f(cx-a)} ${f(top)}L${f(cx-a)} ${f(bot)}A${f(a)} ${f(eb)} 0 0 0 ${f(cx+a)} ${f(bot)}L${f(cx+a)} ${f(top)}Z" style="fill:#e6e6e6;${S}"/>`;
 b+=ellBack(cx,bot,a,eb,'stroke:#222;stroke-width:1px;stroke-dasharray:3 3')+ell(cx,top,a,eb,'fill:#f6f6f6;'+S);
 const steps=72*N,pts=[];for(let i=0;i<=steps;i++){const p=i/steps*2*Math.PI*N;pts.push([cx-a*Math.cos(p),top+hp*i/steps+eb*Math.sin(p),Math.sin(p)>=-1e-9]);}
 let run=[pts[0]],cur=pts[1][2];const flush=(fr)=>{if(run.length>1)b+=`<polyline points="${run.map(q=>f(q[0])+','+f(q[1])).join(' ')}" style="fill:none;stroke:#222;stroke-width:${fr?1.8:1.1}px;${fr?'':'stroke-dasharray:3 3;'}"/>`;};
 for(let i=1;i<pts.length;i++){if(pts[i][2]!==cur&&i<pts.length-1){run.push(pts[i]);flush(cur);run=[pts[i]];cur=pts[i][2];}else run.push(pts[i]);}
 flush(cur);
 b+=dot(cx-a,top)+dot(cx-a,bot)+T(cx-a-8,top+4,'ㄱ','end')+T(cx-a-8,bot+4,'ㄴ','end');
 if(o.hLabel)b+=dim(cx+a,top,cx+a,bot,-18,o.hLabel);
 if(o.rLabel)b+=line(cx,bot,cx+a,bot,'stroke:#222;stroke-width:1.1px')+dot(cx,bot,2.2)+dim(cx,bot,cx+a,bot,eb+7,o.rLabel,3);
 return b;}
function ex4Svg(R){const a=30,hp=a*2*3.14,top=24;return svg(200,f(top+hp+64),`밑면의 반지름이 ${n(R)} cm인 원기둥과 점 ㄴ에서 점 ㄱ까지 옆면을 한 바퀴 도는 벌레의 길`,helixCyl(90,top,a,10,hp,1,{rLabel:n(R)+' cm'}),220);}
function m4Svg(r,H){const a=40,hp=a*H/r,top=24;return svg(230,f(top+hp+66),`밑면의 반지름이 ${n(r)} cm, 높이가 ${n(H)} cm인 원기둥에 점 ㄱ에서 점 ㄴ까지 한 바퀴 감은 실`,helixCyl(90,top,a,12,hp,1,{rLabel:n(r)+' cm',hLabel:n(H)+' cm'}),250);}

// 원기둥 6개를 한 줄로 붙인 묶음
function bundleSvg(r,h,cnt){const a=26,k=a/r,eb=a*0.38,hp=h*k,x1=22+a,cy=42,xs=[];for(let i=0;i<cnt;i++)xs.push(x1+2*a*i);const xn=xs[cnt-1];
 let b=`<path d="M${f(x1-a)} ${f(cy)}L${f(x1-a)} ${f(cy+hp)}A${f(a)} ${f(eb)} 0 0 0 ${f(x1)} ${f(cy+hp+eb)}L${f(xn)} ${f(cy+hp+eb)}A${f(a)} ${f(eb)} 0 0 0 ${f(xn+a)} ${f(cy+hp)}L${f(xn+a)} ${f(cy)}Z" style="fill:#cfcfcf;${S}"/>`;
 b+=`<path d="M${f(x1)} ${f(cy-eb)}L${f(xn)} ${f(cy-eb)}A${f(a)} ${f(eb)} 0 0 1 ${f(xn)} ${f(cy+eb)}L${f(x1)} ${f(cy+eb)}A${f(a)} ${f(eb)} 0 0 1 ${f(x1)} ${f(cy-eb)}Z" style="fill:#bdbdbd;${S}"/>`;
 xs.forEach(x=>{b+=ell(x,cy,a,eb,'fill:#f6f6f6;stroke:#222;stroke-width:1.2px');});
 const xc=xs[3];b+=line(xc,cy,xc+a,cy,'stroke:#222;stroke-width:1.1px')+dot(xc,cy,2.2)+dim(xc,cy,xc+a,cy,-(eb+7),n(r)+' cm',3);
 b+=dim(xn+a,cy,xn+a,cy+hp,-18,n(h)+' cm');
 return svg(f(xn+a+70),f(cy+hp+eb+14),`밑면의 반지름이 ${n(r)} cm, 높이가 ${n(h)} cm인 원기둥 ${cnt}개를 한 줄로 맞닿게 붙인 그림`,b,380);}

// Mission 6: 원기둥 전개도 (옆면 + 위·아래 밑면), 실 선분 선택
function m6Net(ox,oy,N,withPath){const rr=26,W=2*Math.PI*rr,Hp=74,cxC=ox+W*0.55;
 let b=circ(cxC,oy+rr,rr,'fill:#ececec;'+S)+`<rect x="${f(ox)}" y="${f(oy+2*rr)}" width="${f(W)}" height="${Hp}" style="fill:#ececec;${S}"/>`+circ(cxC,oy+2*rr+Hp+rr,rr,'fill:#ececec;'+S);
 const y0=oy+2*rr;
 if(withPath)for(let k=0;k<N;k++)b+=line(ox,y0+Hp*k/N,ox+W,y0+Hp*(k+1)/N,'stroke:#1d4ed8;stroke-width:2.2px');
 if(withPath)for(let k=1;k<N;k++)b+=dot(ox,y0+Hp*k/N,2.2)+dot(ox+W,y0+Hp*k/N,2.2);
 b+=dot(ox,y0)+dot(ox+W,y0+Hp)+T(ox-6,y0+4,'ㄱ','end')+T(ox+W+6,y0+Hp+4,'ㄴ','start');
 return b;}
function m6Svg(N){const b=helixCyl(52,40,30,10,96,N,{})+arrow(98,40+48)+m6Net(150,8,N,false);
 return svg(340,190,`점 ㄱ에서 점 ㄴ까지 옆면을 ${N}바퀴 감은 실이 있는 원기둥과 그 전개도`,b,380);}
function m6Ans(N){return svg(210,190,`옆면에 평행한 선분 ${N}개로 그린 실의 위치`,m6Net(22,8,N,true),260);}

// ---------- 문항 ----------
const UNIT='cm²';
function exp1(H,L){const r=(L-8*H)/24,c=2*3*r;return{
 prompt:`<p>길이가 ${L} cm인 철사를 남김없이 모두 사용하여 그림과 같은 원기둥 모양의 틀을 만들었습니다. 이 원기둥의 밑면의 반지름은 몇 cm입니까? (단, 철사를 이은 부분의 길이는 생각하지 않습니다.) (원주율: 3)</p>`+cageSvg(r,H),
 answer:`${n(r)} cm`,
 solution:`<ol><li>그림에서 높이 방향으로 세운 철사는 8개이고, 원 모양으로 구부린 철사는 4개입니다.</li><li>세운 철사의 길이의 합은 ${H} × 8 = ${8*H} (cm)입니다.</li><li>원 4개의 둘레의 합은 ${L} − ${8*H} = ${L-8*H} (cm)이므로, 원 한 개의 둘레는 ${L-8*H} ÷ 4 = ${n(c)} (cm)입니다.</li><li>밑면의 지름은 ${n(c)} ÷ 3 = ${n(2*r)} (cm)이므로, 반지름은 ${n(2*r)} ÷ 2 = ${n(r)} (cm)입니다.</li></ol>`};}
function ex1(r){const s=6.2*r,h=s-4*r,ans=4*s+2*h;return{
 prompt:`<p>그림과 같이 정사각형 안에 들어갈 수 있는 가장 큰 원기둥의 전개도를 그렸습니다. 이 원기둥의 전개도의 둘레는 몇 cm입니까? (원주율: 3.1)</p>`+squareNetSvg(s,r,'right',false),
 answer:`${n(ans)} cm`,
 solution:`<ol><li>옆면의 가로는 정사각형의 한 변과 같고, 옆면의 가로는 밑면의 둘레와 같으므로 밑면의 둘레는 ${n(s)} cm입니다.</li><li>밑면의 지름은 ${n(s)} ÷ 3.1 = ${n(2*r)} (cm)입니다.</li><li>정사각형의 세로는 두 밑면의 지름과 원기둥의 높이를 더한 길이이므로, 높이는 ${n(s)} − ${n(2*r)} × 2 = ${n(h)} (cm)입니다.</li><li>전개도의 둘레는 두 밑면의 둘레와 옆면의 둘레를 더한 것이므로 ${n(s)} × 2 + (${n(s)} + ${n(h)}) × 2 = ${n(2*s)} + ${n(2*(s+h))} = ${n(ans)} (cm)입니다.</li></ol>`};}
function ex2(len,turns,r){const c=6.2*r,A=c*len*turns,one=c*len,ans=4*c+2*len;return{
 prompt:`<p>그림과 같은 원기둥 모양의 롤러에 페인트를 묻힌 후 벽에 일직선으로 ${turns}바퀴 굴렸더니 페인트가 칠해진 부분의 넓이가 ${n(A)} ${UNIT}였습니다. 이 롤러와 똑같은 원기둥의 전개도를 그렸을 때, 전개도의 둘레는 몇 cm입니까? (원주율: 3.1)</p>`+rollerSvg(len,r),
 answer:`${n(ans)} cm`,
 solution:`<ol><li>롤러를 한 바퀴 굴리면 옆면의 넓이만큼 칠해지므로, 옆면의 넓이는 ${n(A)} ÷ ${turns} = ${n(one)} (${UNIT})입니다.</li><li>옆면의 세로는 롤러의 길이 ${len} cm이므로, 옆면의 가로(밑면의 둘레)는 ${n(one)} ÷ ${len} = ${n(c)} (cm)입니다.</li><li>전개도의 둘레는 두 밑면의 둘레와 옆면의 둘레를 더한 것이므로 ${n(c)} × 2 + (${n(c)} + ${len}) × 2 = ${n(2*c)} + ${n(2*(c+len))} = ${n(ans)} (cm)입니다.</li></ol>`};}
function ex3(r,H){const q=3.14*r/2,ans=2*H+4*r+4*q;return{
 prompt:`<p>그림은 어떤 입체도형의 전개도입니다. 변 ㄱㄴ의 길이는 ${H} cm이고, 변 ㅈㅊ과 변 ㅇㅊ의 길이는 ${r} cm로 같으며, 변 ㅅㅇ의 길이는 ${n(q)} cm입니다. 이 전개도의 둘레는 몇 cm입니까? (원주율: 3.14)</p>`+ex3Svg(r,H),
 answer:`${n(ans)} cm`,
 solution:`<ol><li>곡선 ㅈㅇ은 중심이 점 ㅊ이고 반지름이 ${r} cm인 원의 ${ff(1,4)}이므로, 이 입체도형은 원기둥을 똑같이 4등분한 것 중 하나입니다.</li><li>곡선 ㅈㅇ과 곡선 ㄹㅁ의 길이는 각각 ${r} × 2 × 3.14 ÷ 4 = ${n(q)} (cm)로, 변 ㅅㅇ의 길이와 같습니다.</li><li>변 ㄱㅊ은 밑면의 다른 반지름과 맞닿으므로 ${r} cm이고, 변 ㄴㄷ과 변 ㄷㄹ도 ${r} cm, 변 ㅁㅂ은 ${n(q)} cm, 변 ㅂㅅ은 ${H} cm입니다.</li><li>둘레는 ${H} × 2 + ${r} × 4 + ${n(q)} × 4 = ${2*H} + ${4*r} + ${n(4*q)} = ${n(ans)} (cm)입니다.</li></ol>`};}
function ex4(R){const c=2*R*3.14;return{
 prompt:`<p>밑면의 반지름이 ${R} cm인 원기둥의 점 ㄴ에 벌레가 있습니다. 이 벌레가 원기둥의 옆면을 따라 45°의 각도를 유지하면서 일직선으로 기어 올라가 점 ㄱ에 도착하였더니 옆면을 정확히 한 바퀴 돌았습니다. 원기둥의 높이는 몇 cm입니까? (원주율: 3.14)</p>`+ex4Svg(R),
 answer:`${n(c)} cm`,
 solution:`<ol><li>원기둥의 옆면을 펼치면 가로가 밑면의 둘레, 세로가 높이인 직사각형이 되고, 한 바퀴를 돈 벌레의 길은 이 직사각형의 대각선이 됩니다.</li><li>밑면의 둘레는 ${R} × 2 × 3.14 = ${n(c)} (cm)입니다.</li><li>대각선이 가로와 45°를 이루므로 대각선으로 나뉜 삼각형은 직각이등변삼각형이고, 원기둥의 높이는 가로와 같은 ${n(c)} cm입니다.</li></ol>`};}
function m1(r){const s=6.28*r,h=s-4*r;return{
 prompt:`<p>밑면의 반지름이 ${r} cm인 원기둥 모양의 저금통을 만들려고 그림과 같이 한 변이 ${n(s)} cm인 정사각형 모양의 전개도를 그렸습니다. 저금통의 높이와 한 밑면의 둘레를 각각 구하시오. (원주율: 3.14)</p>`+squareNetSvg(s,r,'bottom',true),
 answer:`높이 ${n(h)} cm, 밑면의 둘레 ${n(s)} cm`,
 solution:`<ol><li>한 밑면의 둘레는 ${r} × 2 × 3.14 = ${n(s)} (cm)이고, 이것은 옆면의 가로이자 정사각형의 한 변과 같습니다.</li><li>정사각형의 세로는 두 밑면의 지름과 높이를 더한 길이입니다.</li><li>밑면의 지름은 ${2*r} cm이므로 저금통의 높이는 ${n(s)} − ${2*r} × 2 = ${n(h)} (cm)입니다.</li></ol>`};}
function m2(c,h){const A=21*29.7,one=c*h,need=Math.ceil(A/one-1e-9);
 // 실제로 칠할 수 있는 방법: 폭 h인 줄로 나누어 굴리기
 const opt=[[21,29.7],[29.7,21]].map(([w,l])=>({w,l,k:Math.ceil(w/h-1e-9),t:Math.ceil(Math.ceil(w/h-1e-9)*l/c-1e-9)})).find(o=>o.t===need);
 return{
 prompt:`<p>한 밑면의 둘레가 ${n(c)} cm이고 높이가 ${h} cm인 원기둥 모양의 롤러가 있습니다. 이 롤러에 물감을 묻혀 가로가 210 mm, 세로가 297 mm인 A4 용지를 빈틈없이 모두 칠하려고 합니다. 롤러를 적어도 몇 바퀴 굴려야 하는지 자연수로 나타내시오. (원주율: 3.14)</p>`,
 answer:`${need}바퀴`,
 solution:`<ol><li>210 mm = 21 cm, 297 mm = 29.7 cm이므로 A4 용지의 넓이는 21 × 29.7 = 623.7 (${UNIT})입니다.</li><li>롤러를 한 바퀴 굴리면 옆면의 넓이만큼 칠해지므로 한 바퀴에 ${n(c)} × ${h} = ${n(one)} (${UNIT})를 칠합니다.</li><li>623.7 ÷ ${n(one)} = ${cut1(A/one)}…이므로 ${need-1}바퀴로는 모자라고, 적어도 ${need}바퀴를 굴려야 합니다.</li><li>실제로 ${n(opt.w)} cm인 쪽을 롤러 폭 ${h} cm로 ${opt.k}줄로 나누어 칠하면 굴리는 길이가 ${n(opt.l)} × ${opt.k} = ${n(opt.l*opt.k)} (cm)이고, ${n(opt.l*opt.k)} ÷ ${n(c)} = ${cut1(opt.l*opt.k/c)}…이므로 ${need}바퀴 안에 모두 칠할 수 있습니다.</li></ol>`};}
function m3(r,H){const q=3*r/2,ans=2*H+4*r+4*q;return{
 prompt:`<p>밑면의 반지름이 ${r} cm이고 높이가 ${H} cm인 원기둥을 왼쪽 그림과 같이 똑같이 4등분했을 때, 그중 한 입체도형의 전개도는 오른쪽과 같습니다. 이 전개도의 둘레는 몇 cm입니까? (원주율: 3)</p>`+m3Svg(r,H),
 answer:`${n(ans)} cm`,
 solution:`<ol><li>4등분한 입체도형의 밑면은 반지름이 ${r} cm인 원의 ${ff(1,4)}이고, 굽은 옆면의 가로는 밑면의 곡선 길이와 같습니다.</li><li>밑면의 곡선 부분의 길이는 ${r} × 2 × 3 ÷ 4 = ${n(q)} (cm)입니다.</li><li>전개도의 둘레에는 높이 ${H} cm인 변이 2개, 반지름 ${r} cm인 변이 4개, 길이가 ${n(q)} cm인 곡선과 변이 4개 있습니다.</li><li>둘레는 ${H} × 2 + ${r} × 4 + ${n(q)} × 4 = ${2*H} + ${4*r} + ${n(4*q)} = ${n(ans)} (cm)입니다.</li></ol>`};}
function m4(r,H){const c=2*r*3.1,ans=c*H/2;return{
 prompt:`<p>그림과 같이 원기둥의 점 ㄱ에서 점 ㄴ까지 옆면을 한 바퀴 돌도록 실을 팽팽하게 감았습니다. 이 원기둥의 전개도를 그렸을 때, 옆면에서 실을 감은 선의 아래쪽 부분의 넓이는 몇 ${UNIT}입니까? (원주율: 3.1)</p>`+m4Svg(r,H),
 answer:`${n(ans)} ${UNIT}`,
 solution:`<ol><li>옆면을 펼치면 가로가 밑면의 둘레, 세로가 높이인 직사각형이 되고, 한 바퀴 팽팽하게 감은 실은 이 직사각형의 대각선이 됩니다.</li><li>옆면의 가로는 ${r} × 2 × 3.1 = ${n(c)} (cm)입니다.</li><li>대각선은 직사각형을 넓이가 같은 두 삼각형으로 나누므로, 실 아래쪽 부분의 넓이는 ${n(c)} × ${H} ÷ 2 = ${n(ans)} (${UNIT})입니다.</li></ol>`};}
function m5(r,h){const cnt=6,st=2*(cnt-1)*2*r,cv=2*r*3.14,len=st+cv,ans=len*h;return{
 prompt:`<p>밑면의 반지름이 ${r} cm이고 높이가 ${h} cm인 원기둥 ${cnt}개가 있습니다. 이 원기둥 ${cnt}개를 그림과 같이 한 줄로 맞닿게 붙여 놓고 옆면을 포장지로 둘러 감싸려고 합니다. 필요한 포장지의 넓이는 몇 ${UNIT}입니까? (단, 겹쳐서 붙이는 부분은 생각하지 않으며, 원주율은 3.14로 계산합니다.)</p>`+bundleSvg(r,h,cnt),
 answer:`${n(ans)} ${UNIT}`,
 solution:`<ol><li>위에서 보면 포장지는 곧은 부분 2개와 양 끝의 굽은 부분으로 이루어져 있습니다.</li><li>곧은 부분 한 개의 길이는 양 끝 원기둥의 밑면의 중심 사이의 거리와 같으므로 ${2*r} × ${cnt-1} = ${2*r*(cnt-1)} (cm)이고, 2개이면 ${st} cm입니다.</li><li>양 끝의 굽은 부분을 합치면 원 한 개의 둘레가 되므로 ${2*r} × 3.14 = ${n(cv)} (cm)입니다.</li><li>포장지의 가로는 ${st} + ${n(cv)} = ${n(len)} (cm)이고, 세로는 원기둥의 높이 ${h} cm이므로 넓이는 ${n(len)} × ${h} = ${n(ans)} (${UNIT})입니다.</li></ol>`};}
function m6(N){const pts=[];for(let k=1;k<N;k++)pts.push(`위에서 세로의 ${ff(k,N)}만큼 내려온 점`);
 return{
 prompt:`<p>그림과 같이 원기둥의 한 밑면 위의 점 ㄱ에서 출발하여 원기둥의 옆면을 가장 짧게 ${N}바퀴 돌아서 점 ㄴ에 도착하도록 실을 감았습니다. 이때 실의 위치를 원기둥의 전개도에 그려 보시오.</p>`+m6Svg(N),
 answer:`옆면의 세로를 ${N}등분한 점을 차례로 잇는 평행한 선분 ${N}개`,
 answerVisual:m6Ans(N),
 solution:`<ol><li>옆면 전개도 ${N}장을 옆으로 이어 붙였다고 생각하면, 가장 짧게 감은 실은 첫째 장의 점 ㄱ에서 마지막 장의 점 ㄴ까지 곧게 이은 선분이 됩니다.</li><li>이 선분은 옆면 한 장을 지날 때마다 높이의 ${ff(1,N)}만큼 내려가므로, 왼쪽 변과 오른쪽 변을 모두 세로로 ${N}등분한 점에서 만납니다.</li><li>따라서 전개도의 옆면에는 점 ㄱ에서 오른쪽 변의 ${pts[0]}까지 그은 선분부터 왼쪽 변의 ${pts[N-2]}에서 점 ㄴ까지 그은 선분까지, 서로 평행한 선분 ${N}개를 그립니다.</li></ol>`};}

const ITEMS={
 '6-2-u6-e1-exploration-1':{key:'source62U6E1Exploration1',resultContract:'single-value',answerVisualRequired:false,pool:[exp1(15,264),exp1(12,216),exp1(20,328)]},
 '6-2-u6-e1-example-1':{key:'source62U6E1Example1',resultContract:'single-value',answerVisualRequired:false,pool:[ex1(14),ex1(10),ex1(12)]},
 '6-2-u6-e1-example-2':{key:'source62U6E1Example2',resultContract:'single-value',answerVisualRequired:false,pool:[ex2(15,4,2),ex2(20,5,3),ex2(18,3,2.5)]},
 '6-2-u6-e1-example-3':{key:'source62U6E1Example3',resultContract:'single-value',answerVisualRequired:false,pool:[ex3(1,3),ex3(2,5),ex3(3,8)]},
 '6-2-u6-e1-example-4':{key:'source62U6E1Example4',resultContract:'single-value',answerVisualRequired:false,pool:[ex4(40),ex4(25),ex4(15)]},
 '6-2-u6-e1-mission-1':{key:'source62U6E1Mission1',resultContract:'multi-value',answerVisualRequired:false,pool:[m1(5),m1(10),m1(15)]},
 '6-2-u6-e1-mission-2':{key:'source62U6E1Mission2',resultContract:'single-value',answerVisualRequired:false,pool:[m2(15.7,11),m2(18.84,15),m2(9.42,7)]},
 '6-2-u6-e1-mission-3':{key:'source62U6E1Mission3',resultContract:'single-value',answerVisualRequired:false,pool:[m3(1,3),m3(2,5),m3(3,7)]},
 '6-2-u6-e1-mission-4':{key:'source62U6E1Mission4',resultContract:'single-value',answerVisualRequired:false,pool:[m4(8,30),m4(5,20),m4(6,25)]},
 '6-2-u6-e1-mission-5':{key:'source62U6E1Mission5',resultContract:'single-value',answerVisualRequired:false,pool:[m5(3,8),m5(2,10),m5(5,7)]},
 '6-2-u6-e1-mission-6':{key:'source62U6E1Mission6',resultContract:'drawing',answerVisualRequired:true,pool:[m6(2),m6(3),m6(4)]},
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
