// 황소 6-2 6단원 개념탐구 3 (여러 가지 회전체) 원문 구조 유형. 각 문항은 같은 구조·다른 수의 검증된 3문항 풀입니다.
(function(root){'use strict';
const GROUP='6-2-u6-e3';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;
void mx;void ff;

// ---------- 그림 도우미 ----------
const S='stroke:#222;stroke-width:1.4px';
const HID='stroke:#222;stroke-width:1px;stroke-dasharray:3 3';
const DIM='fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3';
const SHADE='fill:#e4e4e4';
const f=v=>{const s=(Math.round(v*10)/10).toFixed(1);return s.endsWith('.0')?s.slice(0,-2):s;};
const svg=(w,h,label,body,mw)=>`<svg viewBox="0 0 ${w} ${h}" style="width:100%;max-width:${mw||360}px;height:auto;display:block;margin:8px auto;font-family:inherit" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const T=(x,y,t,a,sz)=>`<text x="${f(x)}" y="${f(y)}" text-anchor="${a||'middle'}" font-size="${sz||13}" fill="#222" style="font-family:inherit">${t}</text>`;
const line=(x1,y1,x2,y2,st)=>`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" style="${st||S}"/>`;
const poly=(pts,st)=>`<polygon points="${pts.map(p=>f(p[0])+','+f(p[1])).join(' ')}" style="${st}"/>`;
const pline=(pts,st)=>`<polyline points="${pts.map(p=>f(p[0])+','+f(p[1])).join(' ')}" style="fill:none;${st||S}"/>`;
// 점선 치수 호: (x1,y1)~(x2,y2), b>0 이면 진행 방향의 왼쪽(화면 기준)으로 볼록. 글자는 호 바깥에 놓습니다.
function darc(x1,y1,x2,y2,b,label,dx,dy){const mxp=(x1+x2)/2,myp=(y1+y2)/2,L=Math.hypot(x2-x1,y2-y1),nx=(y2-y1)/L,ny=-(x2-x1)/L;
 const cxp=mxp+nx*b*2,cyp=myp+ny*b*2,s=b>0?1:-1,lx=mxp+nx*(b+s*13)+(dx||0),ly=myp+ny*(b+s*13)+4+(dy||0);
 return `<path d="M${f(x1)} ${f(y1)}Q${f(cxp)} ${f(cyp)} ${f(x2)} ${f(y2)}" style="${DIM}"/>`+(label?T(lx,ly,label):'');}
// 직각 표시: 꼭짓점 (x,y)에서 두 단위 방향
const ra=(x,y,a,b,c,d,s)=>{s=s||7;return `<path d="M${f(x+a*s)} ${f(y+b*s)}L${f(x+a*s+c*s)} ${f(y+b*s+d*s)}L${f(x+c*s)} ${f(y+d*s)}" style="fill:none;stroke:#222;stroke-width:1px"/>`;};
// 회전축과 회전 화살표
function axis(x,y1,y2,name){return line(x,y1,x,y2,'stroke:#222;stroke-width:1.2px')+
 `<path d="M${f(x+6)} ${f(y1+6)}A9 4 0 1 1 ${f(x+9)} ${f(y1+11)}" style="fill:none;stroke:#222;stroke-width:1px"/>`+
 `<path d="M${f(x+4)} ${f(y1+9)}L${f(x+9)} ${f(y1+11)}L${f(x+5)} ${f(y1+14)}" style="fill:none;stroke:#222;stroke-width:1px"/>`+(name?T(x,y1-4,name):'');}
// 타원(회전체의 원): full=모두 실선, front=앞쪽 실선·뒤쪽 숨은선, hid=모두 숨은선
const K=0.3;
function ell(cx,cy,rx,mode){const ry=rx*K,L=f(cx-rx),R=f(cx+rx),Y=f(cy);if(rx<=0)return '';
 if(mode==='full')return `<ellipse cx="${f(cx)}" cy="${Y}" rx="${f(rx)}" ry="${f(ry)}" style="fill:none;${S}"/>`;
 const fr=st=>`<path d="M${L} ${Y}A${f(rx)} ${f(ry)} 0 0 0 ${R} ${Y}" style="fill:none;${st}"/>`,bk=`<path d="M${L} ${Y}A${f(rx)} ${f(ry)} 0 0 1 ${R} ${Y}" style="fill:none;${HID}"/>`;
 if(mode==='fo')return fr(S);
 return (mode==='hid'?fr(HID):fr(S))+bk;}
// 회전체 겨냥도: outer=[[반지름,높이],...] 아래→위, rings=[[높이,반지름,mode]], hid/seg=[[r1,y1,r2,y2]] (좌우 대칭으로 그림)
function solid(cx,by,u,sp){const P=(r,y)=>[cx+r*u,by-y*u];let o='';
 if(sp.outer){o+=pline(sp.outer.map(([r,y])=>P(-r,y)))+pline(sp.outer.map(([r,y])=>P(r,y)));}
 (sp.rings||[]).forEach(([y,r,m])=>{o+=ell(cx,by-y*u,r*u,m);});
 (sp.hid||[]).forEach(([r1,y1,r2,y2])=>{const a=P(r1,y1),b=P(r2,y2),c=P(-r1,y1),d=P(-r2,y2);o+=line(a[0],a[1],b[0],b[1],HID)+line(c[0],c[1],d[0],d[1],HID);});
 (sp.seg||[]).forEach(([r1,y1,r2,y2])=>{const a=P(r1,y1),b=P(r2,y2),c=P(-r1,y1),d=P(-r2,y2);o+=line(a[0],a[1],b[0],b[1])+line(c[0],c[1],d[0],d[1]);});
 return o;}

// ---------- 개념탐구: 다섯 회전체 ----------
// 꽃병 옆모양(반지름, 높이) 조절점 → 부드럽게 이은 점들
const VASE=[[1.1,0],[1.55,0.7],[1.95,1.9],[1.75,3.2],[1.0,4.2],[0.95,4.7],[1.3,5.2]];
function smooth(c){const o=[];for(let i=0;i<c.length-1;i++){const p0=c[Math.max(0,i-1)],p1=c[i],p2=c[i+1],p3=c[Math.min(c.length-1,i+2)];
 for(let k=0;k<8;k++){const t=k/8,t2=t*t,t3=t2*t;o.push([0,1].map(j=>0.5*((2*p1[j])+(-p0[j]+p2[j])*t+(2*p0[j]-5*p1[j]+4*p2[j]-p3[j])*t2+(-p0[j]+3*p1[j]-3*p2[j]+p3[j])*t3)));}}
 o.push(c[c.length-1]);return o;}
const VS=smooth(VASE);
const BOT={R:1.9,h1:3,h2:4.1,rn:0.7,h3:5.3};
const BOTTLE=[[BOT.R,0],[BOT.R,BOT.h1],[BOT.rn,BOT.h2],[BOT.rn,BOT.h3]];
const EXD=[{cyl:[2.1,4.4],cone:[2.1,4.4],sph:2.2,txt:false},{cyl:[2,5],cone:[3,4],sph:2,txt:true},{cyl:[3,5],cone:[2,5],sph:2.5,txt:true}];
const U=13,ROW1=100,ROW2=218,CX1=[62,180,298],CX2=[120,240],LAB=['㉮','㉯','㉰','㉱','㉲'];
function exSolids(d){const [cr,ch]=d.cyl,[kr,kh]=d.cone,sr=d.sph;let o='';
 const lab=(cx,top,i)=>T(cx-44,top,LAB[i],'middle',14);
 o+=lab(CX1[0],18,0)+solid(CX1[0],ROW1,U,{outer:[[cr,0],[cr,ch]],rings:[[0,cr,'front'],[ch,cr,'full']]});
 o+=lab(CX1[1],18,1)+solid(CX1[1],ROW1,U,{outer:BOTTLE,rings:[[0,BOT.R,'front'],[BOT.h1,BOT.R,'front'],[BOT.h2,BOT.rn,'front'],[BOT.h3,BOT.rn,'full']]});
 o+=lab(CX1[2],18,2)+solid(CX1[2],ROW1,U,{outer:[[kr,0],[0,kh]],rings:[[0,kr,'front']]});
 const sy=ROW2-sr*U;o+=lab(CX2[0],138,3)+`<circle cx="${CX2[0]}" cy="${f(sy)}" r="${f(sr*U)}" style="fill:none;${S}"/>`+ell(CX2[0],sy,sr*U,'front');
 o+=lab(CX2[1],138,4)+solid(CX2[1],ROW2,U,{outer:VS,rings:[[0,VASE[0][0],'front'],[5.2,1.3,'full']]});
 return svg(360,236,'원기둥, 병, 원뿔, 구, 꽃병 모양의 회전체 ㉮부터 ㉲까지',o);}
const dashdot='stroke:#222;stroke-width:1px;stroke-dasharray:8 3 2 3';
// 회전시킨 평면도형(반쪽) 또는 축을 품은 단면(전체)
function exPlanes(d,full){const [cr,ch]=d.cyl,[kr,kh]=d.cone,sr=d.sph;let o='';
 const lab=(cx,top,i)=>T(cx-44,top,LAB[i],'middle',14);
 const fig=(cx,by,prof,top)=>{const R=prof.map(([r,y])=>[cx+r*U,by-y*U]),Lf=prof.slice().reverse().map(([r,y])=>[cx-r*U,by-y*U]);
  const pts=full?R.concat(Lf):[[cx,by]].concat(R).concat([[cx,by-top*U]]);return poly(pts,SHADE+';'+S)+line(cx,by+8,cx,by-top*U-8,dashdot);};
 o+=lab(CX1[0],18,0)+fig(CX1[0],ROW1,[[cr,0],[cr,ch]],ch);
 o+=lab(CX1[1],18,1)+fig(CX1[1],ROW1,BOTTLE,BOT.h3);
 o+=lab(CX1[2],18,2)+fig(CX1[2],ROW1,[[kr,0],[0,kh]],kh);
 const sy=ROW2-sr*U,R=sr*U;
 o+=lab(CX2[0],138,3)+(full?`<circle cx="${CX2[0]}" cy="${f(sy)}" r="${f(R)}" style="${SHADE};${S}"/>`:`<path d="M${CX2[0]} ${f(sy-R)}A${f(R)} ${f(R)} 0 0 1 ${CX2[0]} ${f(sy+R)}Z" style="${SHADE};${S}"/>`)+line(CX2[0],sy-R-8,CX2[0],sy+R+8,dashdot);
 o+=lab(CX2[1],138,4)+fig(CX2[1],ROW2,VS,5.2);
 return svg(360,236,full?'회전축을 품은 평면으로 자른 단면 다섯 개':'회전시킨 평면도형 다섯 개',o);}
function exCircles(d){const rs=[d.cyl[0],BOT.R,d.cone[0]*0.6,d.sph*0.8,1.6];let o='';
 const pos=[[CX1[0],60],[CX1[1],60],[CX1[2],60],[CX2[0],170],[CX2[1],170]];
 pos.forEach(([cx,cy],i)=>{o+=T(cx-44,i<3?18:128,LAB[i],'middle',14)+`<circle cx="${cx}" cy="${cy}" r="${f(rs[i]*U)}" style="${SHADE};${S}"/>`;});
 return svg(360,216,'회전축에 수직인 평면으로 자른 단면은 모두 원',o);}
const exIntro=d=>`<p>다음은 어떤 평면도형의 한 직선을 회전축으로 하여 한 바퀴 돌려 만든 회전체입니다. 회전체를 회전축을 품은 평면으로 자른 단면과 회전축에 수직인 평면으로 자른 단면의 모양을 비교하려고 합니다.</p>`+exSolids(d)+
 (d.txt?`<p>(㉮는 밑면의 반지름이 ${d.cyl[0]} cm, 높이가 ${d.cyl[1]} cm인 원기둥, ㉰는 밑면의 반지름이 ${d.cone[0]} cm, 높이가 ${d.cone[1]} cm인 원뿔, ㉱는 반지름이 ${d.sph} cm인 구입니다.)</p>`:'');
const ol=a=>'<ol>'+a.map(x=>'<li>'+x+'</li>').join('')+'</ol>';
const P=a=>a.map(x=>x.startsWith('<')?x:'<p>'+x+'</p>').join('');

// ---------- 예제 3-1: 평행사변형 ----------
function ex1Fig(a,h,lab){const u=lab?Math.min(20,110/h):20,Ax=150,Tp=56,W=a*u,H=h*u;
 let o=poly([[Ax,Tp],[Ax+W,Tp],[Ax,Tp+H],[Ax-W,Tp+H]],SHADE+';'+S)+axis(Ax,Tp-46,Tp+H+20);
 if(lab){o+=darc(Ax,Tp,Ax+W,Tp,9,`${a} cm`)+line(Ax+W+16,Tp,Ax+W+16,Tp+H,DIM)+line(Ax+W+11,Tp,Ax+W+21,Tp,'stroke:#55524d;stroke-width:1px')+line(Ax+W+11,Tp+H,Ax+W+21,Tp+H,'stroke:#55524d;stroke-width:1px')+T(Ax+W+24,Tp+H/2+4,`${h} cm`,'start');}
 return svg(300,Tp+H+30,'회전축이 지나는 평행사변형',o,300);}
function hourglass(a,h){const u=Math.min(22,120/h,60/a);return svg(300,h*u+50,'모래시계 모양 회전체의 겨냥도',solid(150,h*u+25,u,{outer:[[a,0],[a/2,h/2],[a,h]],rings:[[0,a,'front'],[h/2,a/2,'front'],[h,a,'full']]}),300);}
// ---------- 예제 3-2: 컵 모양 ----------
function ex2Shape(c){return [[c.R,0],[c.q,0],[c.q,c.H3],[0,c.H3],[0,c.H3+c.H2+c.H1],[c.p,c.H3+c.H2+c.H1],[c.R,c.H3+c.H2]];}
function ex2Fig(c,lab){const u=14,Ax=190,Tp=36,pts=ex2Shape(c).map(([r,y])=>[Ax-r*u,Tp+y*u]),B=Tp+(c.H3+c.H2+c.H1)*u;
 let o=poly(pts,SHADE+';'+S)+axis(Ax,Tp-26,B+16);
 if(lab){o+=line(Ax-c.R*u,Tp-12,Ax,Tp-12,DIM)+line(Ax-c.R*u,Tp-16,Ax-c.R*u,Tp-8,'stroke:#55524d;stroke-width:1px')+line(Ax,Tp-16,Ax,Tp-8,'stroke:#55524d;stroke-width:1px')+T(Ax-c.R*u/2,Tp-17,`${c.R} cm`);
  const yq=Tp+c.H3*u*0.55;o+=line(Ax-c.q*u,yq,Ax,yq,DIM)+line(Ax-c.q*u,yq-4,Ax-c.q*u,yq+4,'stroke:#55524d;stroke-width:1px')+T(Ax-c.q*u/2,yq-5,`${c.q} cm`,'middle',12);
  o+=line(Ax-c.p*u,B+12,Ax,B+12,DIM)+line(Ax-c.p*u,B+8,Ax-c.p*u,B+16,'stroke:#55524d;stroke-width:1px')+line(Ax,B+8,Ax,B+16,'stroke:#55524d;stroke-width:1px')+T(Ax-c.p*u/2,B+28,`${c.p} cm`);}
 return svg(300,B+(lab?36:24),'회전축에 한 변이 붙은 오목한 도형',o,300);}
function cupSketch(c){const u=14,Ht=c.H1+c.H2+c.H3,by=Ht*u+28;
 return svg(300,by+16,'위쪽에 원기둥 모양 구멍이 있는 컵 모양 회전체의 겨냥도',solid(150,by,u,{outer:[[c.p,0],[c.R,c.H1],[c.R,Ht]],rings:[[0,c.p,'front'],[c.H1,c.R,'front'],[Ht,c.R,'full'],[Ht,c.q,'full'],[c.H1+c.H2,c.q,'hid']],hid:[[c.q,Ht,c.q,c.H1+c.H2]]}),300);}
// ---------- 예제 3-3 / Mission 2: 선대칭 도형 ----------
function ex3Fig(a,r,h){const u=13,Ax=210,Tp=46,M=Tp+h*u,B=Tp+2*h*u;
 let o=poly([[Ax,Tp],[Ax-a*u,Tp],[Ax-r*u,M],[Ax-a*u,B],[Ax,B]],SHADE+';'+S)+axis(Ax,Tp-26,B+18,'가')+line(Ax-r*u,M,Ax,M,'stroke:#222;stroke-width:1px;stroke-dasharray:2 2');
 o+=ra(Ax,Tp,-1,0,0,1)+ra(Ax,M,-1,0,0,-1)+T(Ax-r*u-6,M+5,'ㄱ','end')+T(Ax+5,M+15,'ㄴ','start');
 o+=darc(Ax-a*u,Tp,Ax,Tp,10,`${a} cm`)+darc(Ax,Tp,Ax,M,12,'',0,0)+T(Ax+20,(Tp+M)/2+4,`${h} cm`,'start');
 return svg(300,B+28,'선분 ㄱㄴ에 대하여 선대칭인 도형과 회전축 가',o,300);}
function m2Fig(d,t,L,h){const u=Math.min(16,128/L),Ax=200,Tp=40,M=Tp+L/2*u,B=Tp+L*u,xl=Ax-d*u,xs=Ax-(d-t)*u;
 let o=poly([[Ax,Tp],[xs,M-h*u],[xl,M-h*u],[xl,M+h*u],[xs,M+h*u],[Ax,B]],SHADE+';'+S)+axis(Ax,Tp-24,B+14,'가')+line(xl,M,Ax,M,'stroke:#222;stroke-width:1px;stroke-dasharray:2 2');
 o+=ra(xl,M-h*u,1,0,0,1)+ra(xl,M+h*u,1,0,0,-1)+T(xl-6,M-h*u+4,'ㅇ','end')+T(xl-6,M+5,'ㄱ','end')+T(Ax-4,M+15,'ㄴ','end');
 o+=darc(xl,M-h*u,xs,M-h*u,8,`${t} cm`)+darc(Ax,Tp,Ax,B,16,'')+T(Ax+22,M+5,`${L} cm`,'start');
 return svg(300,B+24,'선분 ㄱㄴ에 대하여 선대칭인 도형과 회전축 가',o,300);}
// ---------- 예제 3-4: 삼각형 ----------
function ex4Fig(l1,l2,h){const a=Math.sqrt(l1*l1-h*h),b=Math.sqrt(l2*l2-h*h),u=Math.min(22,210/(a+b)),x0=50,yb=40+h*u,G=[x0+a*u,40],N=[x0,yb],D=[x0+(a+b)*u,yb],F=[x0+a*u,yb];
 let o=poly([G,N,D],'fill:#fff;'+S)+line(G[0],G[1],F[0],F[1],'stroke:#222;stroke-width:1px;stroke-dasharray:3 3')+ra(F[0],F[1],-1,0,0,-1);
 o+=darc(N[0],N[1],G[0],G[1],16,`${l1}cm`,-6,0)+darc(G[0],G[1],D[0],D[1],14,`${l2}cm`,12,0)+darc(F[0],F[1],G[0],G[1],10,'')+T(F[0]-20,(G[1]+F[1])/2+8,`${h}cm`,'end');
 o+=T(G[0],G[1]-8,'ㄱ')+T(N[0]-6,N[1]+12,'ㄴ','end')+T(D[0]+6,D[1]+12,'ㄷ','start');
 return svg(x0+(a+b)*u+70,yb+22,'변 ㄱㄴ, 변 ㄱㄷ과 높이가 표시된 삼각형 ㄱㄴㄷ',o,320);}
// ---------- Mission 1 ----------
function m1Fig(a,b,H,lab){const u=Math.min(20,100/a),Ax=200,Tp=40,Q=[Ax-b*u,Tp+H*u];
 let o=poly([[Ax-a*u,Tp],[Ax,Tp],Q],SHADE+';'+S)+axis(Ax,Tp-26,Q[1]+30);
 if(lab)o+=darc(Ax-a*u,Tp,Ax,Tp,9,`${a} cm`)+darc(Q[0],Q[1],Ax,Q[1],-9,`${b} cm`)+line(Q[0],Q[1],Ax,Q[1],'stroke:#55524d;stroke-width:0.8px;stroke-dasharray:1 2');
 return svg(300,Q[1]+(lab?44:38),'한 꼭짓점이 회전축 위에 있는 삼각형',o,300);}
function m1Sketch(a,b,H){const u=Math.min(20,100/a);return svg(300,H*u+56,'아래에서 원뿔 모양으로 파인 회전체의 겨냥도',solid(150,H*u+32,u,{outer:[[b,0],[a,H]],rings:[[0,b,'front'],[H,a,'full']],hid:[[b,0,0,H]]}),300);}
// ---------- Mission 3 ----------
function m3Fig(){const c=16;let o='';
 const sq=(x,y)=>`<rect x="${f(x)}" y="${f(y)}" width="${c}" height="${c}" style="${SHADE};${S}"/>`,arrow=(x,y)=>`<path d="M${x} ${y-4}L${x+10} ${y-4}L${x+10} ${y-8}L${x+18} ${y}L${x+10} ${y+8}L${x+10} ${y+4}L${x} ${y+4}Z" style="fill:#222"/>`;
 const ax=(x,y1,y2)=>axis(x,y1,y2);
 // 1) 세로 2칸, 오른쪽 변이 축 → 반지름 1칸, 높이 2칸
 o+=sq(10,34)+sq(10,50)+ax(26,16,76)+arrow(36,50)+solid(76,66,c,{outer:[[1,0],[1,2]],rings:[[0,1,'front'],[2,1,'full']]});
 // 2) 가로 2칸, 가운데 변이 축 → 반지름 1칸, 높이 1칸
 o+=sq(112,42)+sq(128,42)+ax(128,16,76)+arrow(150,50)+solid(194,58,c,{outer:[[1,0],[1,1]],rings:[[0,1,'front'],[1,1,'full']]});
 // 3) 가로 2칸, 오른쪽 끝 변이 축 → 반지름 2칸, 높이 1칸
 o+=sq(234,42)+sq(250,42)+ax(266,16,76)+arrow(272,50)+solid(328,58,c*0.75,{outer:[[2,0],[2,1.333]],rings:[[0,2,'front'],[1.333,2,'full']]});
 return svg(360,86,'정사각형 2장으로 만든 세 가지 입체도형',o);}
// ---------- Mission 4 ----------
function m4Fig(R,a,b){const u=Math.min(9,144/(a+b)),Ax=160,Tp=36,A=[Ax,Tp],F=[Ax,Tp+a*u],B=[Ax,Tp+(a+b)*u],L=[Ax-R*u,F[1]];
 let o=poly([A,L,B],SHADE+';'+S)+axis(Ax,Tp-26,B[1]+16)+line(L[0],L[1],F[0],F[1],'stroke:#222;stroke-width:1px;stroke-dasharray:3 3')+ra(F[0],F[1],-1,0,0,-1);
 o+=darc(A[0],A[1],F[0],F[1],10,'')+T(Ax+24,(A[1]+F[1])/2+5,'㉠','start',14)+darc(F[0],F[1],B[0],B[1],12,'')+T(Ax+26,(F[1]+B[1])/2+5,'㉡','start',14);
 o+=line(L[0],B[1]+14,Ax,B[1]+14,DIM)+line(L[0],B[1]+10,L[0],B[1]+18,'stroke:#55524d;stroke-width:1px')+line(Ax,B[1]+10,Ax,B[1]+18,'stroke:#55524d;stroke-width:1px')+line(L[0],L[1],L[0],B[1]+10,'stroke:#55524d;stroke-width:0.8px;stroke-dasharray:1 2')+T((L[0]+Ax)/2,B[1]+32,`${R} cm`);
 return svg(300,B[1]+40,'한 변이 회전축 위에 있는 삼각형',o,300);}
// ---------- Mission 5 ----------
function m5Fig(){const Ax=200,Tp=40;let o=poly([[Ax-70,Tp],[Ax,Tp],[Ax,Tp+120],[Ax-70,Tp+120]],SHADE+';'+S)+line(Ax,Tp-30,Ax,Tp+150,'stroke:#222;stroke-width:1.2px')+
 `<path d="M${Ax+6} ${Tp-14}A9 4 0 1 1 ${Ax+9} ${Tp-9}" style="fill:none;stroke:#222;stroke-width:1px"/><path d="M${Ax+4} ${Tp-11}L${Ax+9} ${Tp-9}L${Ax+5} ${Tp-6}" style="fill:none;stroke:#222;stroke-width:1px"/>`+T(Ax-14,Tp-14,'ㄱ','middle',15)+T(Ax-14,Tp+146,'ㄴ','middle',15);
 return svg(300,Tp+170,'한 변이 선분 ㄱㄴ 위에 있는 직사각형',o,300);}
function sectorSvg(th){const R=70,cx=150,cy=92,rad=d=>d*Math.PI/180,a1=rad(-90),a2=rad(-90+th),p=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];
 const [x1,y1]=p(R,a1),[x2,y2]=p(R,a2),[u1,v1]=p(18,a1),[u2,v2]=p(18,a2),lg=th>180?1:0,mid=rad(-90+th/2),[lx,ly]=p(34,mid);
 return svg(300,cy+R+14,`중심각이 ${th}도인 부채꼴`,`<path d="M${cx} ${cy}L${f(x1)} ${f(y1)}A${R} ${R} 0 ${lg} 1 ${f(x2)} ${f(y2)}Z" style="${SHADE};${S}"/>`+
  `<path d="M${f(u1)} ${f(v1)}A18 18 0 ${lg} 1 ${f(u2)} ${f(v2)}" style="fill:none;stroke:#222;stroke-width:1px"/>`+T(lx,ly+5,th+'°','middle',14),300);}
// ---------- Mission 6: 두 정육각형 ----------
const r3=Math.sqrt(3);
function hexFig(){const s=34,cx=180,cy=46,h=s*r3/2;let o='';
 [[cx-h],[cx+h]].forEach(([x])=>{o+=poly([[x,cy-s],[x+h,cy-s/2],[x+h,cy+s/2],[x,cy+s],[x-h,cy+s/2],[x-h,cy-s/2]],'fill:#bdbdbd;'+S);});
 return svg(360,cy+s+10,'한 변을 맞대어 붙인 정육각형 2개',o);}
// 선택지 입체 (u: 정육각형 한 변의 화면 길이)
const OPT={
 A:u=>({w:2*u,h:2*r3*u,sp:{outer:[[0.5,0],[1,r3/2],[0.5,r3],[1,1.5*r3],[0.5,2*r3]],rings:[[0,0.5,'front'],[r3/2,1,'front'],[r3,0.5,'front'],[1.5*r3,1,'front'],[2*r3,0.5,'full']]}}),
 B:u=>({w:4*u,h:2*r3*u,sp:{outer:[[1.5,0],[2,r3/2],[1.5,r3],[2,1.5*r3],[1.5,2*r3]],rings:[[0,1.5,'front'],[0,0.5,'hid'],[r3/2,2,'front'],[r3,1.5,'front'],[r3,0.5,'hid'],[1.5*r3,2,'front'],[2*r3,1.5,'full'],[2*r3,0.5,'full']],hid:[[0.5,0,0,r3/2],[0,r3/2,0.5,r3],[0.5,r3,0,1.5*r3],[0,1.5*r3,0.5,2*r3]]}}),
 F:u=>({w:4*u,h:r3*u,sp:{outer:[[1.5,0],[2,r3/2],[1.5,r3]],rings:[[0,1.5,'front'],[0,0.5,'hid'],[r3/2,2,'front'],[r3,1.5,'full'],[r3,0.5,'full']],hid:[[0.5,0,0,r3/2],[0,r3/2,0.5,r3]]}}),
 C:u=>({w:2*r3*u,h:2*u,sp:{outer:[[r3/2,0],[r3,0.5],[r3,1.5],[r3/2,2]],rings:[[0,r3/2,'front'],[0.5,r3,'fo'],[1.5,r3,'fo'],[2,r3/2,'full']],hid:[[r3/2,2,0,1.5],[r3/2,0,0,0.5]]}}),
 D:u=>({w:3*r3*u,h:2*u,sp:{outer:[[r3,0],[1.5*r3,0.5],[1.5*r3,1.5],[r3,2]],rings:[[0,r3,'front'],[0.5,1.5*r3,'fo'],[1.5,1.5*r3,'fo'],[2,r3,'full'],[1.5,r3/2,'hid'],[0.5,r3/2,'hid']],hid:[[r3,2,r3/2,1.5],[r3,0,r3/2,0.5],[r3/2,0.5,0,0]],seg:[[r3/2,1.5,0,2]]}})};
const NUM=['①','②','③','④','⑤'];
function optsFig(order){const u=21;let o='';const pos=[[62,96],[180,96],[298,96],[110,214],[250,214]];
 order.forEach((k,i)=>{const g=OPT[k](u),[cx,by]=pos[i];o+=T(cx-58,by-78,NUM[i],'middle',14)+solid(cx,by-(70-g.h)/2,u,g.sp);});
 return svg(360,236,'보기 ①부터 ⑤까지의 회전체',o);}

// ---------- 문항 ----------
const EXP=[0,1,2].map(i=>EXD[i]);
const ITEMS={
 '6-2-u6-e3-exploration-1':{key:'source62U6E3Exploration1',resultContract:'multi-value',answerVisualRequired:true,pool:EXP.map(d=>({
   prompt:exIntro(d)+P(['(1) 각 회전체는 어떤 평면도형을 회전축을 중심으로 한 바퀴 돌린 것인지 써 보세요.']),
   answer:d.txt?`㉮ 가로 ${d.cyl[0]} cm, 세로 ${d.cyl[1]} cm인 직사각형, ㉯ 병 모양의 반쪽(육각형), ㉰ 밑변 ${d.cone[0]} cm, 높이 ${d.cone[1]} cm인 직각삼각형, ㉱ 반지름 ${d.sph} cm인 반원, ㉲ 꽃병 모양의 반쪽`:'㉮ 직사각형, ㉯ 병 모양의 반쪽(육각형), ㉰ 직각삼각형, ㉱ 반원, ㉲ 꽃병 모양의 반쪽',
   answerVisual:exPlanes(d,false),
   solution:ol(['회전체를 회전축을 품은 평면으로 자르면 회전축 양쪽에 똑같은 모양이 생기고, 그중 한쪽이 돌리기 전의 평면도형입니다.',
    d.txt?`㉮ 원기둥은 한 변이 회전축 위에 있는 직사각형을 돌린 것입니다. 회전축에 붙은 변이 높이 ${d.cyl[1]} cm, 다른 변이 밑면의 반지름 ${d.cyl[0]} cm입니다.`:'㉮ 원기둥은 한 변이 회전축 위에 있는 직사각형을 돌린 것입니다.',
    '㉯ 병은 몸통·어깨·목의 바깥 선과 회전축으로 둘러싸인 반쪽 도형(육각형)을 돌린 것입니다.',
    d.txt?`㉰ 원뿔은 높이 ${d.cone[1]} cm인 변이 회전축 위에 있고 밑변이 ${d.cone[0]} cm인 직각삼각형을 돌린 것입니다.`:'㉰ 원뿔은 직각을 낀 한 변이 회전축 위에 있는 직각삼각형을 돌린 것입니다.',
    d.txt?`㉱ 구는 지름이 회전축 위에 있는 반지름 ${d.sph} cm인 반원을 돌린 것이고, ㉲ 꽃병은 꽃병의 바깥 곡선과 회전축으로 둘러싸인 반쪽 도형을 돌린 것입니다.`:'㉱ 구는 지름이 회전축 위에 있는 반원을 돌린 것이고, ㉲ 꽃병은 꽃병의 바깥 곡선과 회전축으로 둘러싸인 반쪽 도형을 돌린 것입니다.'])}))},
 '6-2-u6-e3-exploration-2':{key:'source62U6E3Exploration2',resultContract:'drawing',answerVisualRequired:true,pool:EXP.map(d=>({
   prompt:exIntro(d)+P(['(2) 각 회전체를 회전축을 품은 평면으로 잘랐을 때 생기는 단면을 그려 보세요.']),
   answer:d.txt?`㉮ 가로 ${2*d.cyl[0]} cm, 세로 ${d.cyl[1]} cm인 직사각형, ㉯ 병 모양, ㉰ 밑변 ${2*d.cone[0]} cm, 높이 ${d.cone[1]} cm인 이등변삼각형, ㉱ 반지름 ${d.sph} cm인 원, ㉲ 꽃병 모양`:'㉮ 직사각형, ㉯ 병 모양, ㉰ 이등변삼각형, ㉱ 원, ㉲ 꽃병 모양',
   answerVisual:exPlanes(d,true),
   solution:ol(['회전축을 품은 평면으로 자른 단면은 돌리기 전의 평면도형과, 그 도형을 회전축을 기준으로 뒤집은 도형을 붙인 모양입니다.',
    d.txt?`㉮ 직사각형의 가로는 밑면의 지름 ${d.cyl[0]} × 2 = ${2*d.cyl[0]} (cm), 세로는 높이 ${d.cyl[1]} cm입니다.`:'㉮는 직사각형, ㉰는 두 직각삼각형을 붙인 이등변삼각형이 됩니다.',
    d.txt?`㉰ 이등변삼각형의 밑변은 ${d.cone[0]} × 2 = ${2*d.cone[0]} (cm), 높이는 ${d.cone[1]} cm이고, ㉱는 반지름 ${d.sph} cm인 원입니다.`:'㉱는 반원 두 개를 붙인 원이 됩니다.',
    '㉯와 ㉲는 병과 꽃병의 겉모양과 같은 모양이 되며, 다섯 단면 모두 회전축을 대칭축으로 하는 선대칭도형입니다.'])}))},
 '6-2-u6-e3-exploration-3':{key:'source62U6E3Exploration3',resultContract:'drawing',answerVisualRequired:true,pool:EXP.map(d=>({
   prompt:exIntro(d)+P(['(3) 각 회전체를 회전축에 수직인 평면으로 잘랐을 때 생기는 단면을 그려 보세요.']),
   answer:d.txt?`모두 원 (㉮는 반지름 ${d.cyl[0]} cm인 원, ㉰는 반지름이 ${d.cone[0]} cm보다 작은 원, ㉱는 반지름이 ${d.sph} cm보다 크지 않은 원)`:'모두 원',
   answerVisual:exCircles(d),
   solution:ol(['회전체의 한 점은 회전축을 중심으로 돌면서 원을 그리므로, 회전축에 수직인 평면으로 자른 단면은 항상 원입니다.',
    d.txt?`㉮ 원기둥은 어느 높이에서 잘라도 밑면과 같은 반지름 ${d.cyl[0]} cm인 원이 됩니다.`:'㉮ 원기둥은 어느 높이에서 잘라도 밑면과 같은 크기의 원이 됩니다.',
    d.txt?`㉰ 원뿔은 꼭짓점에 가까울수록 작아져 반지름이 ${d.cone[0]} cm보다 작은 원이 되고, ㉱ 구는 중심을 지날 때 가장 큰 반지름 ${d.sph} cm인 원이 됩니다.`:'㉯, ㉰, ㉱, ㉲는 자르는 높이에 따라 원의 크기만 달라집니다.'])}))},
 '6-2-u6-e3-exploration-4':{key:'source62U6E3Exploration4',resultContract:'explanation',answerVisualRequired:false,pool:EXP.map(d=>({
   prompt:exIntro(d)+P(['(4) 회전체를 회전축을 품은 평면으로 자른 단면과 회전축에 수직인 평면으로 자른 단면의 모양을 비교해 보세요.']),
   answer:'회전축을 품은 평면으로 자른 단면은 돌리기 전의 평면도형을 회전축을 대칭축으로 하여 붙인 선대칭도형이라 회전체마다 모양이 다르고, 회전축에 수직인 평면으로 자른 단면은 항상 원이다.'+(d.txt?` (예: ㉮는 가로 ${2*d.cyl[0]} cm, 세로 ${d.cyl[1]} cm인 직사각형과 반지름 ${d.cyl[0]} cm인 원)`:''),
   solution:ol(['회전축을 품은 평면으로 자르면 직사각형, 병 모양, 이등변삼각형, 원, 꽃병 모양처럼 회전체마다 다른 모양이 나옵니다. 모두 회전축을 대칭축으로 하는 선대칭도형입니다.',
    '회전축에 수직인 평면으로 자르면 어느 회전체든 단면이 원이고, 자르는 높이에 따라 크기만 달라집니다.',
    d.txt?`예를 들어 ㉮ 원기둥은 회전축을 품은 단면이 가로 ${2*d.cyl[0]} cm, 세로 ${d.cyl[1]} cm인 직사각형이고, 회전축에 수직인 단면은 반지름 ${d.cyl[0]} cm인 원입니다.`:'따라서 회전축을 품은 단면을 보면 어떤 회전체인지 구별할 수 있지만, 회전축에 수직인 단면은 모두 원이라 모양만으로는 구별하기 어렵습니다.'])}))},
 '6-2-u6-e3-example-1':{key:'source62U6E3Example1',resultContract:'drawing',answerVisualRequired:true,pool:[[3,5.3,false],[3,6,true],[4,5,true]].map(([a,h,lab])=>({
   prompt:P(['오른쪽 평행사변형을 회전축을 중심으로 한 바퀴 돌렸을 때 만들어지는 입체도형의 겨냥도를 그려 보세요.'+(lab?` (평행사변형의 윗변은 ${a} cm, 높이는 ${h} cm입니다.)`:'')])+ex1Fig(a,h,lab),
   answer:lab?`위와 아래 밑면이 반지름 ${a} cm인 원이고, 높이 ${h} cm의 한가운데가 반지름 ${String(a/2)} cm인 원으로 가장 잘록한 모래시계 모양`:'위와 아래 밑면이 같은 크기의 원이고 한가운데가 가장 잘록한 모래시계 모양',
   answerVisual:hourglass(a,h),
   solution:ol(['회전축은 평행사변형을 두 삼각형으로 나눕니다. 왼쪽 삼각형을 돌리면 꼭짓점이 위에 있는 원뿔, 오른쪽 삼각형을 돌리면 꼭짓점이 아래에 있는 원뿔이 됩니다.',
    '두 원뿔이 겹치면 각 높이에서 회전축에서 더 먼 쪽까지 채워지므로, 위와 아래 밑면은 윗변(밑변)을 반지름으로 하는 같은 크기의 원이 됩니다.',
    lab?`한가운데 높이(${String(h/2)} cm)에서는 두 빗변이 회전축에서 ${a} ÷ 2 = ${String(a/2)} (cm)씩 떨어져 있으므로 이곳이 가장 잘록한 원이 됩니다. 따라서 모래시계 모양의 겨냥도를 그립니다.`:'한가운데 높이에서는 두 빗변이 회전축에서 윗변의 절반만큼 떨어져 있으므로 이곳이 가장 잘록합니다. 따라서 모래시계 모양의 겨냥도를 그립니다.'])}))},
 '6-2-u6-e3-example-2':{key:'source62U6E3Example2',resultContract:'drawing',answerVisualRequired:true,pool:[{R:4,q:2.3,p:2.4,H3:3.5,H2:2.8,H1:3.2,lab:false},{R:4,q:2,p:2.5,H3:3,H2:2.5,H1:3,lab:true},{R:5,q:3,p:3,H3:3.5,H2:2,H1:3,lab:true}].map(c=>({
   prompt:P(['오른쪽 평면도형을 회전축을 중심으로 한 바퀴 돌렸을 때 만들어지는 입체도형의 겨냥도를 그려 보세요.'])+ex2Fig(c,c.lab),
   answer:c.lab?`바깥 반지름이 ${c.R} cm이고 아래쪽이 비스듬히 좁아져 아랫면이 반지름 ${c.p} cm인 원이며, 위쪽 가운데에 반지름 ${c.q} cm인 원기둥 모양 구멍이 파인 컵 모양`:'아래쪽이 비스듬히 좁아지고, 위쪽 가운데에 원기둥 모양 구멍이 파인 컵 모양',
   answerVisual:cupSketch(c),
   solution:ol(['아래쪽 부분은 회전축에 붙어 있으므로 돌리면 속이 꽉 찬 입체가 됩니다. 세로 변은 원기둥의 옆면, 비스듬한 변은 아래로 갈수록 좁아지는 옆면이 됩니다.',
    c.lab?`위쪽 세로 부분은 회전축에서 ${c.q} cm 떨어져 있으므로 돌리면 가운데에 반지름 ${c.q} cm인 원기둥 모양 빈 곳이 생깁니다.`:'위쪽 세로 부분은 회전축에서 떨어져 있으므로 돌리면 가운데에 원기둥 모양 빈 곳(구멍)이 생깁니다.',
    c.lab?`따라서 바깥 반지름 ${c.R} cm, 아랫면 반지름 ${c.p} cm이고 위쪽에 구멍이 파인 컵 모양의 겨냥도를 그립니다.`:'따라서 위쪽에 구멍이 파인 컵 모양의 겨냥도를 그립니다.'])}))},
 '6-2-u6-e3-example-3':{key:'source62U6E3Example3',resultContract:'single-value',answerVisualRequired:false,pool:[[9,4,'28.26',3,'9',96],[10,5,'50.24',4,'16',140],[8,3,'12.56',2,'4',60]].map(([a,h,sm,r,r2,ans])=>({
   prompt:P(['오른쪽 평면도형은 선분 ㄱㄴ에 대하여 선대칭도형입니다. 이 도형을 직선 가를 회전축으로 하여 한 바퀴 돌려서 회전체를 만들었습니다.'])+ex3Fig(a,r,h)+
    P([`이 회전체를 회전축에 수직인 평면으로 잘랐을 때 생기는 가장 작은 단면의 넓이는 ${sm} cm²입니다. 이 회전체를 회전축을 품은 평면으로 잘랐을 때 생기는 단면의 넓이는 몇 cm²인지 구해 보세요. (원주율: 3.14)`]),
   answer:`${ans} cm²`,
   solution:ol([`가장 작은 단면은 점 ㄱ이 돌아 생기는 원이고, 반지름은 선분 ㄱㄴ입니다. (반지름) × (반지름) = ${sm} ÷ 3.14 = ${r2}이므로 선분 ㄱㄴ은 ${r} cm입니다.`,
    `선분 ㄱㄴ 위쪽 도형은 윗변 ${a} cm, 아랫변 ${r} cm, 높이 ${h} cm인 사다리꼴이므로 넓이는 (${a} + ${r}) × ${h} ÷ 2 = ${(a+r)*h/2} (cm²)이고, 처음 도형의 넓이는 ${(a+r)*h/2} × 2 = ${(a+r)*h} (cm²)입니다.`,
    `회전축을 품은 단면은 처음 도형과 그 도형을 회전축에 대해 뒤집은 도형을 붙인 것이므로 넓이는 ${(a+r)*h} × 2 = ${ans} (cm²)입니다.`])}))},
 '6-2-u6-e3-example-4':{key:'source62U6E3Example4',resultContract:'single-value',answerVisualRequired:false,pool:[[8,6.5,5.5,'34.54','69.08','98.08'],[10,7.5,6,'37.68','75.36','110.36'],[8.5,5,4,'25.12','50.24','77.24']].map(([l1,l2,h,c,c2,ans])=>({
   prompt:P(['오른쪽 삼각형 ㄱㄴㄷ을 변 ㄴㄷ을 회전축으로 하여 한 바퀴 돌렸을 때 생기는 입체도형의 전개도에서 둘레의 길이는 몇 cm인지 구해 보세요. (원주율: 3.14)'])+ex4Fig(l1,l2,h),
   answer:`${ans} cm`,
   solution:ol([`변 ㄴㄷ을 회전축으로 돌리면 밑면이 반지름 ${h} cm인 원으로 같은 원뿔 두 개가 밑면끼리 붙은 입체가 됩니다. 두 원뿔의 모선은 각각 ${l1} cm, ${l2} cm입니다.`,
    `전개도는 두 원뿔의 옆면(부채꼴) 2개이고, 각 부채꼴의 둘레는 모선 2개와 곡선 부분으로 이루어집니다. 곡선 부분의 길이는 밑면의 둘레 ${h} × 2 × 3.14 = ${c} (cm)입니다.`,
    `따라서 둘레의 합은 ${l1} × 2 + ${l2} × 2 + ${c} × 2 = ${l1*2+l2*2} + ${c2} = ${ans} (cm)입니다.`])}))},
 '6-2-u6-e3-mission-1':{key:'source62U6E3Mission1',resultContract:'drawing',answerVisualRequired:true,pool:[[4,2,4.9,false],[6,3,7,true],[4,3,4.8,true]].map(([a,b,H,lab])=>({
   prompt:P(['오른쪽 삼각형을 회전축을 중심으로 한 바퀴 돌렸을 때 만들어지는 입체도형의 겨냥도를 그려 보세요.'])+m1Fig(a,b,H,lab),
   answer:lab?`윗면은 반지름 ${a} cm인 원, 아래 가장자리는 반지름 ${b} cm인 원이고, 아래쪽에서 윗면의 중심까지 원뿔 모양으로 파인 입체`:'윗면은 큰 원, 아래 가장자리는 작은 원이고, 아래쪽에서 윗면의 중심까지 원뿔 모양으로 파인 입체',
   answerVisual:m1Sketch(a,b,H),
   solution:ol([lab?`윗변은 회전축에 붙어 있으므로 돌리면 반지름 ${a} cm인 원(윗면)이 됩니다.`:'윗변은 회전축에 붙어 있으므로 돌리면 큰 원(윗면)이 됩니다.',
    lab?`아래 꼭짓점은 회전축에서 ${b} cm 떨어져 있으므로 돌리면 반지름 ${b} cm인 원(아래 가장자리)을 그리고, 왼쪽 변은 위가 넓고 아래가 좁은 바깥 옆면이 됩니다.`:'아래 꼭짓점은 회전축에서 떨어져 있으므로 돌리면 작은 원(아래 가장자리)을 그리고, 왼쪽 변은 위가 넓고 아래가 좁은 바깥 옆면이 됩니다.',
    '오른쪽 변은 회전축 위의 점에서 아래 꼭짓점까지 이어지므로 돌리면 안쪽에 원뿔 모양의 빈 곳이 생깁니다. 따라서 아래쪽에서 원뿔 모양으로 파인 입체의 겨냥도를 그립니다.'])}))},
 '6-2-u6-e3-mission-2':{key:'source62U6E3Mission2',resultContract:'single-value',answerVisualRequired:false,pool:[[5,3,8,'78.5','25',48,'2'],[6,4,12,'113.04','36',84,'3'],[4,2,7,'50.24','16',32,'1.5']].map(([d,t,L,big,d2,ax,h])=>{const area=ax/2,trap=d-t;return {
   prompt:P(['오른쪽 평면도형은 선분 ㄱㄴ에 대하여 선대칭도형입니다. 이 도형을 직선 가를 회전축으로 하여 한 바퀴 돌려 회전체를 만들었습니다.'])+m2Fig(d,t,L,Number(h))+
    P([`이 회전체를 회전축에 수직인 평면으로 잘랐을 때 생기는 가장 큰 단면의 넓이는 ${big} cm²이고, 회전축을 품은 평면으로 잘랐을 때 생기는 단면의 넓이는 ${ax} cm²입니다. 선분 ㅇㄱ의 길이는 몇 cm인지 구해 보세요. (원주율: 3.14)`]),
   answer:`${h} cm`,
   solution:ol([`가장 큰 단면은 선분 ㅇㄱ이 있는 왼쪽 변이 돌아 생기는 원이고, 반지름은 선분 ㄱㄴ입니다. (반지름) × (반지름) = ${big} ÷ 3.14 = ${d2}이므로 선분 ㄱㄴ은 ${d} cm입니다.`,
    `회전축을 품은 단면은 처음 도형 2개를 붙인 것이므로 처음 도형의 넓이는 ${ax} ÷ 2 = ${area} (cm²)입니다.`,
    `선분 ㅇㄱ을 □ cm라 하면 왼쪽 직사각형은 가로 ${t} cm, 세로 (□ × 2) cm이고, 오른쪽 사다리꼴은 높이 ${d} − ${t} = ${trap} (cm), 평행한 두 변이 (□ × 2) cm와 ${L} cm입니다.`,
    `${t} × □ × 2 + (□ × 2 + ${L}) × ${trap} ÷ 2 = ${area}에서 □ × ${t*2+trap} + ${L*trap/2} = ${area}, □ × ${t*2+trap} = ${area-L*trap/2}이므로 □ = ${h}입니다. 따라서 선분 ㅇㄱ은 ${h} cm입니다.`])};})},
 '6-2-u6-e3-mission-3':{key:'source62U6E3Mission3',resultContract:'single-value',answerVisualRequired:false,pool:[3,4,3].map((n,i)=>({
   prompt:P([`똑같은 정사각형 모양의 종이 2장을 변끼리 이어 붙여서 만든 평면도형을 한 바퀴 돌려 얻을 수 있는 입체도형은 다음과 같이 모두 3가지입니다. 같은 방법으로 똑같은 ${i===2?'한 변이 2 cm인 정사각형 모양의 ':''}종이 ${n}장을 붙인 후 한 바퀴 돌려 얻을 수 있는 입체도형은 모두 몇 가지인지 구해 보세요. (단, 회전축은 종이의 한 변에는 붙어 있어야 하고, 뒤집었을 때 같은 모양의 입체도형은 한 가지로 생각합니다.)`])+m3Fig(),
   answer:n===3?'6가지':'18가지',
   solution:n===3?ol(['종이 3장을 변끼리 붙인 모양은 일자 모양과 ㄱ자 모양 2가지입니다. (정사각형 한 변을 1칸이라 합니다.)',
    '일자 모양: 끝의 변을 축으로 하면 반지름 3칸·높이 1칸인 원기둥, 둘째 변을 축으로 하면 반지름 2칸·높이 1칸인 원기둥, 긴 변을 축으로 하면 반지름 1칸·높이 3칸인 원기둥으로 3가지입니다.',
    'ㄱ자 모양: 반지름 2칸인 원기둥 위에 반지름 1칸인 원기둥을 얹은 모양, 반지름 1칸·높이 2칸인 원기둥, 반지름 2칸인 원기둥 위에 가운데가 빈 원기둥(반지름 2칸, 구멍 반지름 1칸)을 얹은 모양으로 3가지이며, 일자 모양에서 나온 것과 겹치지 않습니다.',
    '따라서 모두 3 + 3 = 6(가지)입니다.']):ol(['종이 4장을 변끼리 붙인 모양은 일자 모양, ㄴ자 모양, ㅗ자 모양, 계단 모양, 정사각형 모양의 5가지입니다. (정사각형 한 변을 1칸이라 합니다.)',
    '일자 모양에서는 반지름 4칸·3칸·2칸인 높이 1칸 원기둥과 반지름 1칸·높이 4칸인 원기둥의 4가지가 나옵니다.',
    'ㄴ자 모양에서는 회전축을 놓는 위치에 따라 서로 다른 7가지가 나옵니다.',
    'ㅗ자 모양에서는 5가지가 나오지만 그중 2가지는 앞에서 나온 것과 같아 새로운 것은 3가지이고, 계단 모양에서는 4가지 중 새로운 것이 2가지입니다.',
    '정사각형 모양에서는 반지름 1칸·높이 2칸인 원기둥과 반지름 2칸·높이 2칸인 원기둥이 나오고, 두 가지 모두 앞에서 나오지 않은 새 모양입니다.',
    '따라서 모두 4 + 7 + 3 + 2 + 2 = 18(가지)입니다.'])}))},
 '6-2-u6-e3-mission-4':{key:'source62U6E3Mission4',resultContract:'multi-value',answerVisualRequired:false,pool:[[7,3,5,112],[6,2,3,120],[8,1,2,144]].map(([R,p,q,A])=>{const s=A/R,k=s/(p+q);return {
   prompt:P([`오른쪽 삼각형에서 ㉠과 ㉡의 길이의 비는 ${p} : ${q}입니다. 이 삼각형을 회전축 위에 있는 한 변을 기준으로 한 바퀴 돌려 만든 입체도형을 앞에서 본 모양의 넓이가 ${A} cm²일 때, ㉠과 ㉡의 길이는 각각 몇 cm인지 구해 보세요.`])+m4Fig(R,p*k,q*k),
   answer:`㉠ ${p*k} cm, ㉡ ${q*k} cm`,
   solution:ol([`돌려 만든 입체도형은 밑면의 반지름이 ${R} cm인 원뿔 두 개를 밑면끼리 붙인 모양입니다. 앞에서 본 모양은 처음 삼각형과 그 삼각형을 회전축에 대해 뒤집은 삼각형을 붙인 모양이므로 넓이는 처음 삼각형 넓이의 2배입니다.`,
    `처음 삼각형은 밑변이 (㉠ + ㉡) cm, 높이가 ${R} cm이므로 (㉠ + ㉡) × ${R} ÷ 2 × 2 = ${A}, ㉠ + ㉡ = ${A} ÷ ${R} = ${s} (cm)입니다.`,
    `㉠ = ${s} × ${p}/${p+q} = ${p*k} (cm), ㉡ = ${s} × ${q}/${p+q} = ${q*k} (cm)입니다.`.replace(`${p}/${p+q}`,ff(p,p+q)).replace(`${q}/${p+q}`,ff(q,p+q))])};})},
 '6-2-u6-e3-mission-5':{key:'source62U6E3Mission5',resultContract:'drawing',answerVisualRequired:true,pool:[[32,24],[36,24],[45,15]].map(([full,t])=>{const th=360*t/full;return {
   prompt:P([`직사각형 모양의 종이를 선분 ㄱㄴ을 축으로 하여 한 바퀴 돌리는 데 ${full}초가 걸립니다. 같은 빠르기로 이 종이를 ${t}초 동안 돌렸을 때 생기는 입체도형의 밑면의 모양을 그리고, 중심각의 크기를 나타내어 보세요.`])+m5Fig(),
   answer:`중심각이 ${th}°인 부채꼴`,
   answerVisual:sectorSvg(th),
   solution:ol([`${full}초 동안 360°를 돌므로 ${t}초 동안 돈 각도는 360° × ${t} ÷ ${full} = ${th}°입니다.`,
    `직사각형의 아래 변이 회전축을 중심으로 ${th}°만큼 돌며 지나간 자리가 밑면이 되므로, 밑면은 반지름이 직사각형의 가로이고 중심각이 ${th}°인 부채꼴입니다.`])};})},
 '6-2-u6-e3-mission-6':{key:'source62U6E3Mission6',resultContract:'single-value',answerVisualRequired:false,pool:[['A','F','B','C','D'],['C','A','B','F','D'],['F','B','D','A','C']].map(ord=>{const n=k=>NUM[ord.indexOf(k)];return {
   prompt:P(['오른쪽처럼 정육각형 2개를 한 변끼리 붙인 평면도형을 한 직선을 회전축으로 하여 한 바퀴 돌렸을 때 얻는 회전체가 아닌 것은 어느 것인가요?'])+hexFig()+optsFig(ord),
   answer:n('F'),
   solution:ol([`두 정육각형의 가운데를 지나는 직선을 회전축으로 하면 정육각형 2개 길이만큼 긴 입체가 되고 구멍이 없는 입체는 ${n('A')}입니다. 두 정육각형의 위쪽 꼭짓점을 잇는 직선을 회전축으로 하면 같은 길이에 위아래로 구멍이 뚫린 입체가 되며, 이것은 ${n('B')}입니다.`,
    `붙인 변을 지나는 세로 직선을 회전축으로 하면 가운데 옆면이 곧고 위아래가 오목하게 파인 입체(${n('C')})가 되고, 한 정육각형의 위아래 꼭짓점을 지나는 직선을 회전축으로 하면 폭이 가장 넓고 가운데가 뾰족하게 솟은 입체(${n('D')})가 됩니다.`,
    `${n('F')}의 입체는 정육각형 1개 길이만큼만 길고, 가로 방향 회전축이면 정육각형 2개 길이가 되어야 하며 세로 방향 회전축이면 가운데 옆면이 곧아야 하므로 두 정육각형을 함께 돌려서는 만들 수 없습니다. 따라서 답은 ${n('F')}입니다.`])};})},
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
