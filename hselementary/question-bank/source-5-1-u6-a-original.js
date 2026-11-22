// 황소 5-1 6단원 다각형의 둘레와 넓이: 개념탐구 1 Mission 6, 개념탐구 2(탐구·예제 2-2~2-4·Mission 1~6), 개념탐구 3(탐구 (1)(2)·예제 3-2·3-3) 잠금 원문 유형.
// 원문 수치를 보존한 변형 0과 수만 바꾼 변형 1·2를 고정 검증 풀(fixed-verified-pool)로 제공합니다. ITEMS의 키는 앱 유형 id, sourceItemId는 원장 id입니다.
(function(root){'use strict';
const GROUP='5-1-u6-a';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;
const ol=s=>'<ol>'+s.map(x=>`<li>${x}</li>`).join('')+'</ol>';
const fm=v=>String(Math.round(v*1000)/1000); // 소수 표시(최대 셋째 자리)
const r1=v=>Math.round(v*10)/10;
const eun=n=>[0,1,3,6,7,8].includes(n%10)?'은':'는'; // 수 읽기의 받침에 맞춘 조사
const SV=(w,h,body,label,mw)=>`<svg viewBox="0 0 ${r1(w)} ${r1(h)}" role="img" aria-label="${label}" style="width:100%;max-width:${mw||360}px;height:auto;display:block;margin:6px auto;font-family:inherit">${body}</svg>`;
const TX=(x,y,s,fs,anc)=>`<text x="${r1(x)}" y="${r1(y)}" font-size="${fs||13}" text-anchor="${anc||'middle'}" dominant-baseline="central" fill="#222">${s}</text>`;
// 기본 속성에 덧붙일 속성(ex)을 합쳐 같은 속성이 두 번 쓰이지 않게 함
const AT=(def,ex)=>{const m={};(def+' '+(ex||'')).replace(/([a-z-]+)="([^"]*)"/g,(_,k,v)=>{m[k]=v;return '';});return Object.keys(m).map(k=>` ${k}="${m[k]}"`).join('');};
const LN=(x1,y1,x2,y2,ex)=>`<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}"${AT('stroke="#222" stroke-width="1.4"',ex)}/>`;
const DL=(x1,y1,x2,y2)=>LN(x1,y1,x2,y2,' stroke-dasharray="5 3" stroke-width="1.2"'); // 그림 안의 점선
const PG=(pts,fill,ex)=>`<polygon points="${pts.map(p=>r1(p[0])+','+r1(p[1])).join(' ')}"${AT(`fill="${fill||'none'}" stroke="#222" stroke-width="1.4" stroke-linejoin="round"`,ex)}/>`;
const RC=(x,y,w,h,fill,ex)=>`<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}"${AT(`fill="${fill||'none'}" stroke="#222" stroke-width="1.4"`,ex)}/>`;
const DIMS='fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3';
// 치수 호: 선분 (x1,y1)-(x2,y2)를 잇는 점선 호. bulge>0이면 진행 방향의 오른쪽(화면 기준 법선 (-dy,dx))으로 볼록.
function DM(x1,y1,x2,y2,label,bulge,off,fs){const mx_=(x1+x2)/2,my=(y1+y2)/2,dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L;
 const o=off===undefined?(bulge>=0?11:-11):off;
 return `<path d="M${r1(x1)} ${r1(y1)} Q${r1(mx_+2*bulge*nx)} ${r1(my+2*bulge*ny)} ${r1(x2)} ${r1(y2)}" style="${DIMS}"/>`+TX(mx_+(bulge+o)*nx,my+(bulge+o)*ny,label,fs);}
// 직각 표시
function RA(x,y,ux,uy,vx,vy,s){s=s||7;const a=Math.hypot(ux,uy),b=Math.hypot(vx,vy);ux/=a;uy/=a;vx/=b;vy/=b;
 return `<path d="M${r1(x+ux*s)} ${r1(y+uy*s)} L${r1(x+ux*s+vx*s)} ${r1(y+uy*s+vy*s)} L${r1(x+vx*s)} ${r1(y+vy*s)}" fill="none" stroke="#222" stroke-width="1"/>`;}
// 화살표 지시선
function AR(x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,s=6;
 return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2-ux*3)}" y2="${r1(y2-uy*3)}" stroke="#222" stroke-width="1"/>`+
  `<path d="M${r1(x2)} ${r1(y2)} L${r1(x2-ux*s-uy*s*0.45)} ${r1(y2-uy*s+ux*s*0.45)} L${r1(x2-ux*s+uy*s*0.45)} ${r1(y2-uy*s-ux*s*0.45)} Z" fill="#222"/>`;}
const SH='#e6e2da', SH2='#bdb8ae';

// ── 개념탐구 1 Mission 6: 다섯 조각의 둘레로 가운데 조각의 둘레 구하기
// g=[a,b,p,q]: 가의 오른쪽 끝 a, 라의 오른쪽 끝 b, 가의 아래 p, 나의 아래 q (그림용 실제 배치)
function e1m6(d){const [G,N,R,M]=d.P,[a,b,p,q]=d.g,W=N/2+a-q,H=R/2+p-b;
 const X2=(N/2+R/2+G/2-M/2),X=X2/2,half=G/2-X,D=half*2;
 const sc=290/W,ox=34,oy=26,x=v=>ox+v*sc,y=v=>oy+v*sc;
 let s=RC(x(0),y(0),W*sc,H*sc,SH)+LN(x(0),y(p),x(a),y(p))+LN(x(b),y(q),x(b),y(H))+LN(x(b),y(q),x(W),y(q))+LN(x(a),y(0),x(a),y(p));
 s+=TX(x(b/2),y(p/2),'가',15)+TX(x((a+W)/2),y(q/2),'나',15)+TX(x((a+b)/2),y((q+p)/2),'다',15)+TX(x(b/2),y((p+H)/2),'라',15)+TX(x((a+W)/2),y((q+H)/2),'마',15);
 s+=TX(x(0)-12,y(0)-10,'ㄱ')+TX(x(W)+12,y(0)-10,'ㄹ')+TX(x(0)-12,y(H)+10,'ㄴ')+TX(x(W)+12,y(H)+10,'ㄷ');
 const svg=SV(ox*2+W*sc,oy*2+H*sc,s,'직사각형 ㄱㄴㄷㄹ을 가, 나, 다, 라, 마 다섯 조각으로 나눈 그림');
 return {prompt:`<p>직사각형 ㄱㄴㄷㄹ을 그림과 같이 가, 나, 다, 라, 마 다섯 조각으로 나누었습니다. 다섯 조각 가, 나, 다, 라, 마의 둘레가 차례로 ${G} cm, ${N} cm, □ cm, ${R} cm, ${M} cm일 때, □ 안에 알맞은 수를 구하세요.</p>${svg}<p>※ 조건 보충: 가와 마는 그림처럼 다가 한 귀퉁이를 차지하여 꺾인 모양이고, 각 조각의 둘레는 그 조각을 둘러싼 테두리 전체의 길이입니다.</p>`,
  answer:`${D}`,
  solution:ol([`가와 마는 한 귀퉁이가 안으로 들어간 모양이지만, 들어간 두 변을 바깥쪽으로 옮겨 보면 둘레가 그 조각을 둘러싼 직사각형의 둘레와 같습니다. 따라서 네 조각 모두 (가로)+(세로)는 둘레의 절반입니다. 가는 ${G}÷2=${G/2}, 나는 ${N}÷2=${N/2}, 라는 ${R}÷2=${R/2}, 마는 ${M}÷2=${M/2}(cm)입니다.`,
   `라의 가로와 나의 세로의 합을 △라고 합니다. 다의 가로는 (가의 가로)−(라의 가로), 다의 세로는 (가의 세로)−(나의 세로)이므로 (다의 가로)+(다의 세로)=${G/2}−△입니다.`,
   `(나의 가로)+(가의 가로)는 큰 직사각형의 가로, (라의 세로)+(가의 세로)는 큰 직사각형의 세로입니다. 그래서 나와 라의 (가로)+(세로)를 더한 ${N/2}+${R/2}=${N/2+R/2}${eun(N/2+R/2)} (큰 가로)+(큰 세로)−${G/2}+△와 같고, (큰 가로)+(큰 세로)=${N/2+R/2+G/2}−△입니다.`,
   `마의 가로는 (큰 가로)−(라의 가로), 마의 세로는 (큰 세로)−(나의 세로)이므로 (큰 가로)+(큰 세로)−△=${M/2}입니다.`,
   `${N/2+R/2+G/2}−△−△=${M/2}이므로 △+△=${X2}, △=${X}입니다.`,
   `(다의 가로)+(다의 세로)=${G/2}−${X}=${half}(cm)이므로 다의 둘레는 ${half}×2=${D}(cm)이고, □=${D}입니다.`])};
}

// ── 개념탐구 2 탐구 (1)~(5): 점판에서 넓이가 정해진 정사각형 그리기
function board(cols,rows,sq){const sp=26,o=16;let s='';
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++)s+=`<circle cx="${o+i*sp}" cy="${o+j*sp}" r="2.4" fill="#222"/>`;
 if(sq){s=PG(sq.map(p=>[o+p[0]*sp,o+p[1]*sp]),'rgba(120,150,200,0.22)',' stroke-width="2"')+s;}
 return SV(o*2+(cols-1)*sp,o*2+(rows-1)*sp,s,sq?'점판 위에 그린 정사각형 정답 예시':'가로, 세로 간격이 1 cm인 점판',400);}
function e2x(a,b){const N=a*a+b*b,cols=12,rows=Math.max(6,a+b+1),x0=Math.floor((cols-1-(a+b))/2),y0=Math.floor((rows-1-(a+b))/2);
 const sq=[[x0+b,y0],[x0+a+b,y0+b],[x0+a,y0+a+b],[x0,y0+a]];
 const answer=b===0?`한 변이 ${a} cm인 정사각형 (그림은 한 예)`:`한 변이 가로 ${a}칸, 세로 ${b}칸을 비스듬히 잇는 정사각형 (그림은 한 예)`;
 const sol=b===0?[`넓이가 ${N} cm²인 정사각형은 ${a}×${a}=${N}이므로 한 변이 ${a} cm입니다.`,`이웃한 점 사이가 1 cm이므로 가로로 ${a}칸, 세로로 ${a}칸을 잇는 정사각형을 그리면 됩니다.`,`네 꼭짓점이 모두 점 위에 있으면 위치는 어디든 정답입니다.`]
  :[`${N}은 같은 수를 두 번 곱한 수가 아니므로 가로·세로 줄을 따라 그린 정사각형으로는 넓이 ${N} cm²를 만들 수 없습니다. 그래서 변을 비스듬히 그립니다.`,
   `가로로 ${a}칸, 세로로 ${b}칸 떨어진 두 점을 이은 선분을 한 변으로 하고, 같은 방법으로 방향을 직각으로 돌려 가며 네 변을 그립니다.`,
   `이 정사각형을 둘러싼 한 변이 ${a+b} cm인 정사각형의 넓이는 ${a+b}×${a+b}=${(a+b)*(a+b)}(cm²)입니다.`,
   `네 귀퉁이의 직각삼각형 4개는 두 개씩 붙이면 가로 ${a} cm, 세로 ${b} cm인 직사각형 2개가 되므로 넓이는 ${a}×${b}×2=${2*a*b}(cm²)입니다.`,
   `그린 정사각형의 넓이는 ${(a+b)*(a+b)}−${2*a*b}=${N}(cm²)입니다.`];
 return {prompt:`<p>그림에서 가로, 세로로 이웃한 점 사이의 간격은 모두 1 cm입니다. 이 점들 중 4개를 꼭짓점으로 하여 넓이가 ${N} cm²인 정사각형을 그려 보세요.</p>${board(cols,rows)}<p>※ 조건 보충: 정사각형의 위치와 방향은 자유이며, 네 꼭짓점이 점 위에 있고 넓이가 ${N} cm²인 정사각형을 하나 그리면 됩니다.</p>`,
  answer,solution:ol(sol),answerVisual:board(cols,rows,sq)};
}

// ── 예제 2-2: 겹친 세 정사각형 색종이 ㉠, ㉡의 차
function e22(B,s_,m,i){const sx=0.3*B,sy=0.4*B,P0=[sx+s_/2,sy+s_/2],u=[m*24/25,-m*7/25],v=[m*7/25,m*24/25];
 const P1=[P0[0]+u[0],P0[1]+u[1]],P2=[P1[0]+v[0],P1[1]+v[1]],P3=[P0[0]+v[0],P0[1]+v[1]];
 const maxX=P2[0],maxY=P3[1],sc=280/maxX,ox=34,oy=34,X=t=>ox+t*sc,Y=t=>oy+t*sc,id=`c51u6e22v${i}`;
 const med=[P0,P1,P2,P3].map(p=>[X(p[0]),Y(p[1])]),mp=med.map(p=>r1(p[0])+','+r1(p[1])).join(' ');
 let s=`<defs><clipPath id="${id}"><polygon points="${mp}"/></clipPath></defs>`;
 s+=RC(X(0),Y(0),B*sc,B*sc,'#fff')+RC(X(sx),Y(sy),s_*sc,s_*sc,'#fff');
 s+=`<polygon points="${mp}" fill="${SH2}"/>`;
 s+=`<g clip-path="url(#${id})"><rect x="${r1(X(0))}" y="${r1(Y(0))}" width="${r1(B*sc)}" height="${r1(B*sc)}" fill="#fff"/><rect x="${r1(X(sx))}" y="${r1(Y(sy))}" width="${r1(s_*sc)}" height="${r1(s_*sc)}" fill="#8f8a80"/>`+
  `<rect x="${r1(X(0))}" y="${r1(Y(0))}" width="${r1(B*sc)}" height="${r1(B*sc)}" fill="none" stroke="#222" stroke-width="1.1" stroke-dasharray="3 3"/></g>`;
 s+=`<polygon points="${mp}" fill="none" stroke="#222" stroke-width="1.4"/>`+RC(X(sx),Y(sy),s_*sc,s_*sc,'none');
 s+=DM(X(0),Y(0),X(B),Y(0),`${B} cm`,-12)+DM(X(sx),Y(sy),X(sx+s_),Y(sy),`${s_} cm`,-8,-9);
 s+=DM(med[1][0],med[1][1],med[2][0],med[2][1],`${m} cm`,-14,-24);
 s+=TX(X(B*0.13),Y(B*0.14),'㉠',15);
 const q1=[P0[0]+(u[0]+v[0])/8,P0[1]+(u[1]+v[1])/8],q2=[P0[0]+u[0]*0.3+v[0]*0.78,P0[1]+u[1]*0.3+v[1]*0.78],L=[X(sx-0.05*B),Y(maxY)+4];
 s+=TX(L[0],L[1]+12,'㉡',15)+AR(L[0]+4,L[1],X(q1[0]),Y(q1[1]))+AR(L[0]+9,L[1]+8,X(q2[0]),Y(q2[1]));
 const svg=SV(ox+maxX*sc+50,oy+maxY*sc+40,s,'크기가 다른 정사각형 색종이 세 장을 겹쳐 놓은 그림');
 const A=B*B-s_*s_-m*m;
 return {prompt:`<p>한 변의 길이가 각각 ${s_} cm, ${m} cm, ${B} cm인 정사각형 모양의 색종이 3장을 그림과 같이 겹쳐 놓았습니다. 가장 큰 색종이에서 겹쳐지지 않은 부분의 넓이를 ㉠ cm², 중간 크기의 색종이에서 색칠된 부분의 넓이의 합을 ㉡ cm²라고 할 때, ㉠과 ㉡의 차는 얼마일까요?</p>${svg}<p>※ 조건 보충: 가장 작은 색종이는 가장 큰 색종이 안에 완전히 놓여 있고, ㉡은 중간 크기의 색종이 중 가장 작은 색종이와 겹친 부분과 가장 큰 색종이 밖으로 나온 부분의 넓이의 합입니다.</p>`,
  answer:`${A}`,
  solution:ol([`중간 크기의 색종이 중 가장 큰 색종이와 겹친 부분의 넓이를 ★, 그중 가장 작은 색종이와도 겹친 부분의 넓이를 ◆라고 합니다.`,
   `가장 큰 색종이에서 가려진 부분은 가장 작은 색종이(${s_}×${s_}=${s_*s_} cm²)와 ★인데, ◆는 두 번 들어 있으므로 ㉠=${B*B}−${s_*s_}−★+◆입니다.`,
   `중간 크기의 색종이(${m}×${m}=${m*m} cm²)에서 색칠된 부분은 ◆와, 가장 큰 색종이 밖으로 나온 부분(${m*m}−★)이므로 ㉡=◆+${m*m}−★입니다.`,
   `두 식에서 −★와 +◆가 똑같이 들어 있으므로 ㉠−㉡=${B*B}−${s_*s_}−${m*m}=${A}입니다.`])};
}

// ── 예제 2-3: 직사각형의 네 변을 늘여 만든 평행사변형
function e23(A,k){const a=4.6,b=3.5,m=(k-1),pts={ㄱ:[0,0],ㄴ:[0,b],ㄷ:[a,b],ㄹ:[a,0],ㅁ:[0,-m*b],ㅇ:[k*a,0],ㅅ:[a,k*b],ㅂ:[-m*a,b]};
 const minX=-m*a,maxX=k*a,minY=-m*b,maxY=k*b,sc=270/(maxX-minX),ox=28,oy=24,X=t=>ox+(t-minX)*sc,Y=t=>oy+(t-minY)*sc,P=n=>[X(pts[n][0]),Y(pts[n][1])];
 let s=PG([P('ㅁ'),P('ㅇ'),P('ㅅ'),P('ㅂ')])+PG([P('ㄱ'),P('ㄴ'),P('ㄷ'),P('ㄹ')]);
 s+=LN(...P('ㄱ'),...P('ㅁ'))+LN(...P('ㄹ'),...P('ㅇ'))+LN(...P('ㄷ'),...P('ㅅ'))+LN(...P('ㄴ'),...P('ㅂ'));
 const off={ㄱ:[-10,-9],ㄴ:[-9,10],ㄷ:[10,9],ㄹ:[9,-10],ㅁ:[0,-11],ㅇ:[12,0],ㅅ:[0,12],ㅂ:[-12,0]};
 for(const n in off)s+=TX(P(n)[0]+off[n][0],P(n)[1]+off[n][1],n);
 const svg=SV(ox*2+(maxX-minX)*sc,oy*2+(maxY-minY)*sc,s,'직사각형 ㄱㄴㄷㄹ의 네 변을 늘여 만든 평행사변형 ㅁㅇㅅㅂ');
 const kt=k===2?'2':'1.5',ans=k===2?A*5:A+A/4*6;
 const sol=k===2?[`각 변을 처음 길이의 2배가 되게 늘였으므로 늘인 부분의 길이는 처음 변의 길이와 같습니다. 곧 ㄱㅁ=ㄴㄱ, ㄹㅇ=ㄱㄹ, ㄷㅅ=ㄹㄷ, ㄴㅂ=ㄷㄴ입니다.`,
   `삼각형 ㅁㄱㅇ은 ㄱ에서 직각이고, ㄱㅁ은 직사각형의 세로와 같고 ㄱㅇ은 직사각형의 가로의 2배입니다. 그래서 직사각형 2개를 이어 붙인 직사각형의 절반이므로 넓이는 직사각형 1개의 넓이 ${A} cm²와 같습니다.`,
   `나머지 세 삼각형 ㅇㄹㅅ, ㅅㄷㅂ, ㅂㄴㅁ도 같은 방법으로 넓이가 각각 ${A} cm²입니다.`,
   `평행사변형의 넓이는 ${A}+${A}×4=${ans}(cm²)입니다.`]
  :[`각 변을 처음 길이의 1.5배가 되게 늘였으므로 늘인 부분은 처음 변의 절반입니다. 곧 ㄱㅁ은 ㄴㄱ의 절반, ㄹㅇ은 ㄱㄹ의 절반, ㄷㅅ은 ㄹㄷ의 절반, ㄴㅂ은 ㄷㄴ의 절반입니다.`,
   `직사각형 ㄱㄴㄷㄹ의 가로와 세로를 각각 반으로 나누면 똑같은 작은 직사각형 4개가 되고, 하나의 넓이는 ${A}÷4=${A/4}(cm²)입니다.`,
   `삼각형 ㅁㄱㅇ은 ㄱ에서 직각이고, ㄱㅁ은 작은 직사각형의 세로 1개, ㄱㅇ은 작은 직사각형의 가로 3개와 같습니다. 그래서 작은 직사각형 3개를 이어 붙인 직사각형의 절반입니다. 나머지 세 삼각형도 같은 방법으로 넓이가 같습니다.`,
   `삼각형 4개를 두 개씩 붙이면 작은 직사각형 3개짜리 직사각형 2개가 되므로 넓이는 ${A/4}×3×2=${A/4*6}(cm²)입니다.`,
   `평행사변형의 넓이는 ${A}+${A/4*6}=${ans}(cm²)입니다.`];
 return {prompt:`<p>직사각형 ㄱㄴㄷㄹ의 각 변을 그림과 같이 한쪽 방향으로 늘여 처음 길이의 ${kt}배가 되게 하고, 늘인 끝점을 이어 평행사변형 ㅁㅇㅅㅂ을 만들었습니다. 직사각형 ㄱㄴㄷㄹ의 넓이가 ${A} cm²일 때, 평행사변형의 넓이는 몇 cm²일까요?</p>${svg}`,
  answer:`${ans} cm²`,solution:ol(sol)};
}

// ── 예제 2-4: 두 선분으로 나눈 직사각형에서 ㉠의 넓이
function e24(w1,w2,h1,h2){const TL=w1*h1,TR=w2*h1,BR=w2*h2,BL=w1*h2,W=w1+w2,H=h1+h2,sc=Math.min(200/W,280/H),ox=78,oy=16,X=t=>ox+t*sc,Y=t=>oy+t*sc;
 let s=RC(X(0),Y(0),W*sc,H*sc,SH)+DL(X(w1),Y(0),X(w1),Y(H))+DL(X(0),Y(h1),X(W),Y(h1));
 s+=TX(X(0)-42,Y(0)+6,`${TL} cm²`)+AR(X(0)-26,Y(0)+16,X(w1/2),Y(h1/2));
 s+=TX(X(w1+w2/2),Y(h1/2),`${TR} cm²`)+TX(X(w1+w2/2),Y(h1+h2/2),`${BR} cm²`)+TX(X(w1/2),Y(h1+h2/2),'㉠',15);
 const svg=SV(ox+W*sc+20,oy*2+H*sc,s,'두 선분으로 네 부분으로 나눈 직사각형');
 return {prompt:`<p>직사각형을 각 변에 평행한 두 선분으로 나누었더니 나누어진 부분의 넓이가 그림과 같았습니다. ㉠의 넓이는 몇 cm²일까요?</p>${svg}`,
  answer:`${BL} cm²`,
  solution:ol([`왼쪽 부분의 가로를 ●, 오른쪽 부분의 가로를 ◆, 위쪽 부분의 세로를 ▲, 아래쪽 부분의 세로를 ■라고 하면 ${TL}=●×▲, ${TR}=◆×▲, ${BR}=◆×■, ㉠=●×■입니다.`,
   `㉠×${TR}=●×■×◆×▲이고, ${TL}×${BR}=●×▲×◆×■이므로 두 값은 같습니다.`,
   `㉠×${TR}=${TL}×${BR}=${TL*BR}이므로 ㉠=${TL*BR}÷${TR}=${BL}(cm²)입니다.`])};
}

// ── Mission 1: 가로를 줄이고 세로를 늘여 만든 정사각형
function m1(d,den){const R=d*d*den,Sq=R+d*d,s_=Math.sqrt(Sq),A=s_+d,B=s_-d,sc=200/A,ox=62,oy=30,X=t=>ox+t*sc,Y=t=>oy+t*sc;
 let s=`<rect x="${r1(X(A-2*d))}" y="${r1(Y(B))}" width="${r1(d*sc)}" height="${r1(d*sc)}" fill="${SH2}"/>`;
 s+=RC(X(0),Y(0),A*sc,B*sc,'none')+DL(X(A-d),Y(0),X(A-d),Y(B+d))+DL(X(0),Y(B+d),X(A-d),Y(B+d))+DL(X(0),Y(B),X(0),Y(B+d));
 s+=TX(X((A-d)/2),Y(B/2),'처음 직사각형',13);
 s+=DM(X(A-d),Y(0),X(A),Y(0),`${d} cm`,-7,-8)+DM(X(0),Y(B),X(0),Y(B+d),`${d} cm`,7,20)+DM(X(A-2*d),Y(B+d),X(A-d),Y(B+d),`${d} cm`,7,9);
 s+=TX(X(A)+6,Y(B+d/2),`${d*d} cm²`,13,'start')+AR(X(A)+3,Y(B+d/2),X(A-1.5*d)+2,Y(B+d/2));
 const svg=SV(ox+A*sc+62,oy+(B+d)*sc+34,s,'직사각형의 가로를 줄이고 세로를 늘여 정사각형을 만드는 그림');
 return {prompt:`<p>그림과 같이 한 직사각형의 가로를 ${d} cm 줄이고 세로를 ${d} cm 늘였더니 정사각형이 되었습니다. 정사각형의 넓이는 처음 직사각형보다 ${d*d} cm² 더 넓어졌고, 이 ${d*d} cm²는 처음 직사각형 넓이의 ${ff(1,den)}입니다. 정사각형의 넓이를 구하세요.</p>${svg}`,
  answer:`${Sq} cm²`,
  solution:ol([`그림에서 오른쪽에서 떼어 낸 부분과 아래쪽에 붙인 부분의 넓이 차는 색칠한 한 변이 ${d} cm인 정사각형의 넓이 ${d}×${d}=${d*d}(cm²)입니다.`,
   `늘어난 넓이 ${d*d} cm²가 처음 직사각형 넓이의 ${ff(1,den)}이므로 처음 직사각형의 넓이는 ${d*d}×${den}=${R}(cm²)입니다.`,
   `정사각형의 넓이는 처음 직사각형보다 ${d*d} cm² 넓으므로 ${R}+${d*d}=${Sq}(cm²)입니다.`])};
}

// ── Mission 2: 블록 바닥 위 지갑의 넓이
function m2(bw,bh){const dg=Math.hypot(bw,bh),wd=bw*bh/dg,n=[bh/dg,bw/dg],P=[2.5*bw,2*bh],Q=[3.5*bw,bh],C=[3.5*bw,2*bh],Rr=[Q[0]+wd*n[0],Q[1]+wd*n[1]],S=[P[0]+wd*n[0],P[1]+wd*n[1]];
 const sc=320/(5*bw),ox=14,oy=14,X=t=>ox+t*sc,Y=t=>oy+t*sc;let s=RC(X(0),Y(0),5*bw*sc,4*bh*sc,'#fff');
 for(let r=1;r<4;r++)s+=LN(X(0),Y(r*bh),X(5*bw),Y(r*bh),' stroke-width="1"');
 for(let r=0;r<4;r++){const off=r%2?bw/2:0;for(let j=0;j<=5;j++){const xv=off+j*bw;if(xv>0&&xv<5*bw)s+=LN(X(xv),Y(r*bh),X(xv),Y((r+1)*bh),' stroke-width="1"');}}
 s+=PG([P,Q,Rr,S].map(p=>[X(p[0]),Y(p[1])]),SH2,' fill-opacity="0.85"')+DL(X(P[0]),Y(P[1]),X(C[0]),Y(C[1]))+DL(X(Q[0]),Y(Q[1]),X(C[0]),Y(C[1]));
 const svg=SV(ox*2+5*bw*sc,oy*2+4*bh*sc,s,'직사각형 블록 바닥 위에 비스듬히 놓인 지갑');
 const A=bw*bh;
 return {prompt:`<p>가로 ${bw} cm, 세로 ${bh} cm인 직사각형 블록으로 이루어진 바닥에 그림과 같이 직사각형 모양의 지갑이 떨어져 있습니다. 색칠된 지갑의 넓이를 구하세요.</p>${svg}<p>※ 조건 보충: 지갑의 한 긴 변은 블록 한 개의 대각선과 꼭 맞고, 그 맞은편 변은 그 블록의 한 꼭짓점을 지납니다(그림의 점선).</p>`,
  answer:`${A} cm²`,
  solution:ol([`점선은 블록 한 개를 대각선으로 나눈 직각삼각형의 두 변입니다. 이 직각삼각형의 넓이는 ${bw}×${bh}÷2=${A/2}(cm²)입니다.`,
   `이 삼각형에서 지갑의 긴 변을 밑변으로 보면, 마주 보는 꼭짓점이 지갑의 맞은편 변 위에 있으므로 높이는 지갑의 짧은 변의 길이와 같습니다.`,
   `그래서 삼각형의 넓이는 (지갑의 긴 변)×(지갑의 짧은 변)÷2, 곧 지갑 넓이의 절반입니다.`,
   `지갑의 넓이는 ${A/2}×2=${A}(cm²)입니다.`])};
}

// ── Mission 3: 모눈 위 두 정사각형 사이의 색칠한 넓이
function m3(N,a,b,c,d){const out=[[b,0],[N,b],[N-b,N],[0,N-b]],C=N/2,x=(d-c)/2,y=-(c+d)/2,inn=[[C+x,C+y],[C-y,C+x],[C-x,C-y],[C+y,C-x]];
 const sp=Math.min(44,230/N),o=16,X=t=>o+t*sp;let s='';
 s+=PG(out.map(p=>[X(p[0]),X(p[1])]),SH2,' stroke="none"')+PG(inn.map(p=>[X(p[0]),X(p[1])]),'#fff',' stroke="none"');
 for(let i=0;i<=N;i++)s+=`<line x1="${r1(X(i))}" y1="${r1(X(0))}" x2="${r1(X(i))}" y2="${r1(X(N))}" stroke="#9b968c" stroke-width="0.8"/><line x1="${r1(X(0))}" y1="${r1(X(i))}" x2="${r1(X(N))}" y2="${r1(X(i))}" stroke="#9b968c" stroke-width="0.8"/>`;
 s+=PG(out.map(p=>[X(p[0]),X(p[1])]))+PG(inn.map(p=>[X(p[0]),X(p[1])]));
 const svg=SV(o*2+N*sp,o*2+N*sp,s,'모눈 위에 그린 두 정사각형과 그 사이의 색칠한 부분',300);
 const O=a*a+b*b,I=c*c+d*d;
 return {prompt:`<p>그림과 같이 모눈 한 칸의 넓이를 1 cm²라고 할 때, 색칠된 부분의 넓이를 구하세요.</p>${svg}`,
  answer:`${O-I} cm²`,
  solution:ol([`바깥 사각형은 모눈 ${N}칸×${N}칸 전체(${N}×${N}=${N*N} cm²)에서 네 귀퉁이의 직각삼각형 4개를 뺀 것입니다. 직각삼각형은 두 변이 ${a} cm, ${b} cm이고 두 개씩 붙이면 ${a}×${b} 직사각형 2개가 되므로 4개의 넓이는 ${a}×${b}×2=${2*a*b}(cm²)입니다. 바깥 사각형의 넓이는 ${N*N}−${2*a*b}=${O}(cm²)입니다.`,
   `안쪽 사각형은 모눈 ${c+d}칸×${c+d}칸(${(c+d)*(c+d)} cm²)에서 두 변이 ${c} cm, ${d} cm인 직각삼각형 4개(${c}×${d}×2=${2*c*d} cm²)를 뺀 것이므로 넓이는 ${(c+d)*(c+d)}−${2*c*d}=${I}(cm²)입니다.`,
   `색칠된 부분의 넓이는 ${O}−${I}=${O-I}(cm²)입니다.`])};
}

// ── Mission 4: 넓이가 같은 직사각형 3개를 겹친 그림의 ㉠, ㉡, ㉢
function m4lay(S,pa,pb,pc,T,w1,h3,t){const tot=(3*S-pa-pb-pc-3*T)/2,g1=tot-(S-pc-T),g2=tot-(S-pb-T),g3=tot-(S-pa-T);
 const h2=T/w1,h1=g1/w1,w2=g3/h2,w0=(g2+T)/(h2+h3)-w1,Ah=h1+h2+h3,Aw=S/Ah,Bh=t+h1+h2,Bw=S/Bh,Cw=w0+w1+w2,Ch=S/Cw;
 return {g:[g1,g2,g3],tot,A:[w1-Aw,0,w1,Ah],B:[0,-t,Bw,h1+h2],C:[-w0,h1,w1+w2,h1+Ch],w0,w1,w2,h1,h2,h3};}
function m4(S,pa,pb,pc,T,w1,h3,t){const L=m4lay(S,pa,pb,pc,T,w1,h3,t),[g1,g2,g3]=L.g,A=L.A,B=L.B,C=L.C;
 const x0=A[0],x1=B[2],y0=B[1],y1=C[3],sc=250/(x1-x0),ox=40,oy=30,X=v=>ox+(v-x0)*sc,Y=v=>oy+(v-y0)*sc;
 const R=(r,f)=>`<rect x="${r1(X(r[0]))}" y="${r1(Y(r[1]))}" width="${r1((r[2]-r[0])*sc)}" height="${r1((r[3]-r[1])*sc)}" fill="${f}" stroke="none"/>`;
 const I=(p,q)=>[Math.max(p[0],q[0]),Math.max(p[1],q[1]),Math.min(p[2],q[2]),Math.min(p[3],q[3])],AB=I(A,B),AC=I(A,C),BC=I(B,C),ABC=I(AB,C);
 let s=R(AB,SH2)+R(AC,SH2)+R(BC,SH2)+R(ABC,'#fff');
 for(const r of [A,B,C])s+=`<rect x="${r1(X(r[0]))}" y="${r1(Y(r[1]))}" width="${r1((r[2]-r[0])*sc)}" height="${r1((r[3]-r[1])*sc)}" fill="none" stroke="#222" stroke-width="1.3"/>`;
 const cx=r=>X((r[0]+r[2])/2),cy=r=>Y((r[1]+r[3])/2);
 s+=TX(cx([AB[0],AB[1],AB[2],C[1]]),cy([AB[0],AB[1],AB[2],C[1]]),'㉠',14);
 const lowStrip=[AC[0],B[3],AC[2],AC[3]],leftStrip=[AC[0],AC[1],B[0],AC[3]],ms=r=>Math.min(r[2]-r[0],r[3]-r[1]),g2r=ms(lowStrip)>=ms(leftStrip)?lowStrip:leftStrip;
 s+=TX(cx(g2r),cy(g2r),'㉡',14)+TX(cx([A[2],C[1],C[2],B[3]]),cy([A[2],C[1],C[2],B[3]]),'㉢',14);
 s+=TX(X(A[0])+8,Y(y0)-12,`${pa} cm²`,13,'start')+AR(X(A[0])+22,Y(y0)-2,X((A[0]+C[0])/2),Y((A[1]+C[1])/2+(A[3]-A[1])*0.12));
 s+=TX(X((B[0]+B[2])/2),Y((B[1]+A[1])/2),`${pb} cm²`)+TX(X((C[0]+C[2])/2),Y((A[3]+C[3])/2),`${pc} cm²`);
 s+=TX(X(C[2])+6,Y(B[3])+30,`${T} cm²`,13,'start')+AR(X(C[2])+8,Y(B[3])+22,cx(ABC)+4,cy(ABC)+4);
 const svg=SV(ox*2+(x1-x0)*sc,oy+(y1-y0)*sc+16,s,'넓이가 같은 직사각형 세 개를 겹쳐 놓은 그림',380);
 return {prompt:`<p>그림과 같이 넓이가 ${S} cm²인 직사각형 3개를 겹쳐 놓았습니다. 색칠한 부분 ㉠, ㉡, ㉢의 넓이는 각각 몇 cm²일까요?</p>${svg}<p>※ 조건 보충: ${pa} cm², ${pb} cm², ${pc} cm²는 각 직사각형에서 다른 직사각형과 겹치지 않은 부분의 넓이이고, ${T} cm²는 세 직사각형이 모두 겹친 가운데 부분의 넓이입니다.</p>`,
  answer:`㉠ ${g1} cm², ㉡ ${g2} cm², ㉢ ${g3} cm²`,
  solution:ol([`왼쪽 직사각형은 ${pa} cm², ㉠, ㉡, ${T} cm²로 이루어져 있으므로 ㉠+㉡=${S}−${pa}−${T}=${S-pa-T}입니다.`,
   `오른쪽 위 직사각형은 ${pb} cm², ㉠, ㉢, ${T} cm²로 이루어져 있으므로 ㉠+㉢=${S}−${pb}−${T}=${S-pb-T}입니다.`,
   `아래쪽 직사각형은 ${pc} cm², ㉡, ㉢, ${T} cm²로 이루어져 있으므로 ㉡+㉢=${S}−${pc}−${T}=${S-pc-T}입니다.`,
   `세 식을 모두 더하면 ㉠, ㉡, ㉢이 두 번씩 더해지므로 ㉠+㉡+㉢=(${S-pa-T}+${S-pb-T}+${S-pc-T})÷2=${L.tot}입니다.`,
   `㉠=${L.tot}−${S-pc-T}=${g1}, ㉡=${L.tot}−${S-pb-T}=${g2}, ㉢=${L.tot}−${S-pa-T}=${g3}(cm²)입니다.`])};
}

// ── Mission 5: 작은 직사각형 9개로 이루어진 큰 직사각형
function m5(c,r){const [c1,c2,c3]=c,[r1_,r2,r3]=r,a1=c3*r1_,a2=c2*r1_,a3=c3*r3,a4=c2*r2,a5=c1*r2,a6=c1*r3,W=c1+c2+c3,H=r1_+r2+r3,sc=Math.min(230/W,240/H),o=16,X=t=>o+t*sc,Y=t=>o+t*sc;
 let s=RC(X(0),Y(0),W*sc,H*sc,'none')+LN(X(c1),Y(0),X(c1),Y(H))+LN(X(c1+c2),Y(0),X(c1+c2),Y(H))+LN(X(0),Y(r1_),X(W),Y(r1_))+LN(X(0),Y(r1_+r2),X(W),Y(r1_+r2));
 const cxs=[c1/2,c1+c2/2,c1+c2+c3/2],cys=[r1_/2,r1_+r2/2,r1_+r2+r3/2],at=(i,j,t)=>TX(X(cxs[i]),Y(cys[j]),t,15);
 s+=at(2,0,'①')+at(1,0,'②')+at(2,2,'③')+at(1,1,'④')+at(0,1,'⑤')+at(0,2,'⑥');
 const svg=SV(o*2+W*sc,o*2+H*sc,s,'작은 직사각형 9개로 이루어진 큰 직사각형',300);
 const k1=a4/a2,top=a5/k1,k3=a3/a1;
 return {prompt:`<p>그림과 같이 큰 직사각형은 작은 직사각형 9개로 이루어져 있습니다. 직사각형 ①의 넓이는 ${a1} cm², ②는 ${a2} cm², ③은 ${a3} cm², ④는 ${a4} cm², ⑤는 ${a5} cm²일 때, ⑥의 넓이는 몇 cm²일까요?</p>${svg}`,
  answer:`${a6} cm²`,
  solution:ol([`②와 ④는 가로가 같고 ④는 ②의 ${a4}÷${a2}=${k1}배이므로, 가운데 줄의 세로는 맨 위 줄의 세로의 ${k1}배입니다.`,
   `⑤와 같은 열에 있는 맨 위 칸(왼쪽 위 칸)은 ⑤와 가로가 같고 세로가 ${ff(1,k1)}이므로 넓이는 ${a5}÷${k1}=${top}(cm²)입니다.`,
   `①과 ③은 가로가 같고 ③은 ①의 ${a3}÷${a1}=${k3}배이므로, 맨 아래 줄의 세로는 맨 위 줄의 세로의 ${k3}배입니다.`,
   `⑥은 왼쪽 위 칸과 가로가 같고 세로가 ${k3}배이므로 넓이는 ${top}×${k3}=${a6}(cm²)입니다.`])};
}

// ── Mission 6: 밭과 논에 낸 길의 넓이
function m6(Lx,Ly){const w=50,tot=Lx*Ly,road1=w*(Lx+Ly)-w*w,rem=tot-road1,road3=3*w*(Lx+Ly)-9*w*w,m2v=road3/10000;
 const sc=150/Lx,gw=w*sc,fw=Lx*sc,fh=Ly*sc,ox1=30,ox2=ox1+fw+50,oy=12;
 // ws, hs: 밭 조각의 가로·세로 길이 목록(조각 사이는 길 폭 gw)
 const plots=(ox,ws,hs)=>{let s='',x=0;for(const w_ of ws){let y=0;for(const h_ of hs){s+=RC(ox+x,oy+y,w_,h_,SH2,' stroke-width="1.2"');y+=h_+gw;}x+=w_+gw;}return s;};
 const pw=(fw-3*gw)/4,ph=(fh-3*gw)/4;
 let s=TX(ox1-16,oy+10,'가',15)+plots(ox1,[(fw-gw)*0.32,(fw-gw)*0.68],[(fh-gw)*0.42,(fh-gw)*0.58])+TX(ox2-16,oy+10,'나',15)+plots(ox2,[pw,pw,pw,pw],[ph,ph,ph,ph]);
 const svg=SV(ox2+fw+12,oy*2+fh,s,'길을 낸 밭 가와 논 나의 모양',380);
 return {prompt:`<p>넓이가 ${tot} cm²인 직사각형 모양의 밭에 그림 가와 같이 폭이 50 cm인 길을 내었더니 남은 밭의 넓이가 ${rem} cm²가 되었습니다. 넓이가 같은 논에 그림 나와 같이 폭이 50 cm인 길을 내면 길의 넓이는 몇 m²가 될까요?</p>${svg}<p>※ 조건 보충: 논은 밭과 가로, 세로의 길이가 각각 같고, 길은 모두 변에 평행하게 한쪽 끝에서 반대쪽 끝까지 곧게 나 있습니다.</p>`,
  answer:`${fm(m2v)} m²`,
  solution:ol([`가에서 길의 넓이는 ${tot}−${rem}=${road1}(cm²)입니다.`,
   `가로로 난 길의 넓이는 (밭의 가로)×50, 세로로 난 길의 넓이는 (밭의 세로)×50인데, 두 길이 겹치는 한 변이 50 cm인 정사각형(50×50=2500 cm²)은 두 번 세었습니다. 그래서 {(가로)+(세로)}×50−2500=${road1}, {(가로)+(세로)}×50=${road1+2500}이고 (가로)+(세로)=${Lx+Ly}(cm)입니다.`,
   `나에는 가로로 3개, 세로로 3개의 길이 있고, 길이 겹치는 정사각형은 3×3=9(개)입니다. 길의 넓이는 ${Lx+Ly}×50×3−2500×9=${3*w*(Lx+Ly)}−${9*w*w}=${road3}(cm²)입니다.`,
   `1 m²=10000 cm²이므로 ${road3} cm²=${fm(m2v)} m²입니다.`])};
}

// ── 개념탐구 3 탐구 (1)(2): 모눈 위 평행사변형의 넓이
function e3x(b,h,sft){const x0=1,cols=x0+b+sft+1,rows=h+2,sp=Math.min(30,260/Math.max(cols,rows)),ox=50,oy=14,X=t=>ox+t*sp,Y=t=>oy+t*sp;
 let s=RC(X(0),Y(0),cols*sp,rows*sp,'none',' stroke="#7d786f" stroke-width="1"');
 for(let i=1;i<cols;i++)s+=`<line x1="${r1(X(i))}" y1="${r1(Y(0))}" x2="${r1(X(i))}" y2="${r1(Y(rows))}" stroke="#b4afa5" stroke-width="0.8" stroke-dasharray="2 2"/>`;
 for(let j=1;j<rows;j++)s+=`<line x1="${r1(X(0))}" y1="${r1(Y(j))}" x2="${r1(X(cols))}" y2="${r1(Y(j))}" stroke="#b4afa5" stroke-width="0.8" stroke-dasharray="2 2"/>`;
 s+=PG([[X(x0),Y(rows-1)],[X(x0+b),Y(rows-1)],[X(x0+b+sft),Y(1)],[X(x0+sft),Y(1)]],'none',' stroke-width="1.8"');
 s+=TX(X(x0+b/2),Y(rows-0.5),'밑변',12);
 s+=DM(X(0),Y(rows),X(1),Y(rows),'1 cm',6,8,12)+DM(X(0),Y(rows-1),X(0),Y(rows),'1 cm',-6,-20,12);
 const svg=SV(ox+cols*sp+16,oy+rows*sp+34,s,'모눈 위에 그린 평행사변형',300);
 return {prompt:`<p>모눈 한 칸은 가로, 세로가 각각 1 cm인 정사각형입니다. 그림에서 평행사변형의 넓이를 구하세요.</p>${svg}`,
  answer:`${b*h} cm²`,
  solution:ol([`평행사변형의 밑변은 모눈 ${b}칸이므로 ${b} cm입니다.`,
   `높이는 밑변과 마주 보는 변 사이의 거리이므로 모눈 세로 ${h}칸, 곧 ${h} cm입니다.`,
   `평행사변형의 한쪽 삼각형을 잘라 반대쪽에 붙이면 가로 ${b} cm, 세로 ${h} cm인 직사각형이 되므로 넓이는 ${b}×${h}=${b*h}(cm²)입니다.`])};
}

// ── 예제 3-2: 두 평행사변형과 수직인 두 선분, 둘레의 차
function e32(p,q,c,mb,area){const k=mb/c,S=[p*p/c,p*q/c],Bp=[S[0]*(1+k),S[1]*(1+k)],Mp=[c+(S[0]-c)*(1+k),S[1]*(1+k)],Np=[Mp[0]-c,Mp[1]],Dp=[Bp[0]+c,Bp[1]];
 const pts={ㄱ:[0,0],ㄹ:[c,0],ㅅ:S,ㅂ:Bp,ㅁ:Mp,ㄴ:Np,ㄷ:Dp},minX=Np[0],maxX=Dp[0],sc=320/(maxX-minX),ox=24,oy=34,P=n=>[ox+(pts[n][0]-minX)*sc,oy+pts[n][1]*sc];
 let s=PG([P('ㄱ'),P('ㄴ'),P('ㄷ'),P('ㄹ')])+LN(...P('ㄱ'),...P('ㅂ'))+LN(...P('ㄹ'),...P('ㅁ'));
 s+=RA(...P('ㅅ'),P('ㄱ')[0]-P('ㅅ')[0],P('ㄱ')[1]-P('ㅅ')[1],P('ㄹ')[0]-P('ㅅ')[0],P('ㄹ')[1]-P('ㅅ')[1],8);
 const off={ㄱ:[-8,-10],ㄹ:[8,-10],ㄴ:[-11,4],ㄷ:[11,4],ㅁ:[-4,13],ㅂ:[4,13],ㅅ:[0,15]};
 for(const n in off)s+=TX(P(n)[0]+off[n][0],P(n)[1]+off[n][1],n);
 s+=DM(...P('ㄱ'),...P('ㄹ'),`${fm(c)}cm`,-10,-9)+DM(...P('ㄱ'),...P('ㅅ'),`${fm(p)}cm`,9,17)+DM(...P('ㅅ'),...P('ㄹ'),`${fm(q)}cm`,9,17);
 s+=DM(...P('ㅁ'),...P('ㅂ'),`${fm(mb)}cm`,10,12);
 const svg=SV(ox*2+(maxX-minX)*sc,oy+Np[1]*sc+46,s,'평행사변형 두 개가 겹친 사다리꼴 ㄱㄴㄷㄹ',380);
 const base=c+mb+c,ans=p+q+3*c;
 return {prompt:`<p>그림에서 사각형 ㄱㄴㅁㄹ과 사각형 ㄱㅂㄷㄹ은 모두 평행사변형이고, 선분 ㄱㅂ과 선분 ㄹㅁ은 서로 수직입니다. 사각형 ㄱㄴㅁㄹ의 넓이가 ${area} cm²일 때, 사각형 ㄱㄴㄷㄹ의 둘레와 삼각형 ㅅㅁㅂ의 둘레의 차는 몇 cm일까요?</p>${svg}`,
  answer:`${fm(ans)} cm`,
  solution:ol([`사각형 ㄱㄴㅁㄹ은 평행사변형이므로 ㄴㅁ=ㄱㄹ=${fm(c)} cm이고, ㄱㄴ=ㄹㅁ=ㄹㅅ+ㅅㅁ=${fm(q)}+ㅅㅁ입니다.`,
   `사각형 ㄱㅂㄷㄹ도 평행사변형이므로 ㅂㄷ=ㄱㄹ=${fm(c)} cm이고, ㄹㄷ=ㄱㅂ=ㄱㅅ+ㅅㅂ=${fm(p)}+ㅅㅂ입니다.`,
   `ㄴㄷ=ㄴㅁ+ㅁㅂ+ㅂㄷ=${fm(c)}+${fm(mb)}+${fm(c)}=${fm(base)}(cm)입니다.`,
   `사각형 ㄱㄴㄷㄹ의 둘레는 ${fm(c)}+(${fm(q)}+ㅅㅁ)+${fm(base)}+(${fm(p)}+ㅅㅂ)=${fm(c+q+base+p)}+ㅅㅁ+ㅅㅂ입니다.`,
   `삼각형 ㅅㅁㅂ의 둘레는 ㅅㅁ+ㅅㅂ+${fm(mb)}입니다.`,
   `두 둘레에 ㅅㅁ+ㅅㅂ가 똑같이 들어 있으므로 차는 ${fm(c+q+base+p)}−${fm(mb)}=${fm(ans)}(cm)입니다. (넓이 ${area} cm²로 ㅅㅁ, ㅅㅂ를 각각 구하지 않아도 차를 구할 수 있습니다.)`])};
}

// ── 예제 3-3: 두 높이로 변의 길이를 구하고 둘레에서 빼기
function e33(b,h,dm,per,n1){const N=[0,h],D=[b,h],A=[n1,0],R=[n1,h],AN=Math.hypot(n1,h),u=[(N[0]-A[0])/AN,(N[1]-A[1])/AN],tt=(D[0]-A[0])*u[0]+(D[1]-A[1])*u[1],Mf=[A[0]+u[0]*tt,A[1]+u[1]*tt];
 const sc=300/b,ox=30,oy=26,P=p=>[ox+p[0]*sc,oy+p[1]*sc],Pa=P(A),Pn=P(N),Pd=P(D),Pr=P(R),Pm=P(Mf);
 let s=PG([Pa,Pn,Pd],SH)+DL(...Pa,...Pr)+DL(...Pd,...Pm)+RA(...Pr,Pa[0]-Pr[0],Pa[1]-Pr[1],Pn[0]-Pr[0],Pn[1]-Pr[1],7)+RA(...Pm,Pd[0]-Pm[0],Pd[1]-Pm[1],Pa[0]-Pm[0],Pa[1]-Pm[1],7);
 s+=TX(Pa[0],Pa[1]-12,'ㄱ')+TX(Pn[0]-11,Pn[1]+3,'ㄴ')+TX(Pd[0]+11,Pd[1]+3,'ㄷ')+TX(Pr[0]+10,Pr[1]-10,'ㄹ')+TX(Pm[0]-9,Pm[1]-11,'ㅁ');
 s+=DM(...Pn,...Pd,`${fm(b)} cm`,22,12)+DM(...Pa,...Pr,`${fm(h)} cm`,14,26)+DM(...Pd,...Pm,`${fm(dm)} cm`,-14,-14);
 s=s.replace(/<text /g,'<text stroke="#fff" stroke-width="3" paint-order="stroke" '); // 겹치는 선 위에서도 글자가 읽히도록 흰 테두리
 const svg=SV(ox*2+b*sc,oy+h*sc+50,s,'두 높이가 표시된 삼각형 ㄱㄴㄷ',380);
 const area=b*h/2,AB=area*2/dm,ans=Math.round((per-b-AB)*1000)/1000;
 return {prompt:`<p>그림의 삼각형 ㄱㄴㄷ은 둘레가 ${fm(per)} cm입니다. 변 ㄱㄷ의 길이를 구하세요.</p>${svg}`,
  answer:`${fm(ans)} cm`,
  solution:ol([`변 ㄴㄷ을 밑변으로 보면 높이는 ㄱㄹ=${fm(h)} cm이므로 삼각형의 넓이는 ${fm(b)}×${fm(h)}÷2=${fm(area)}(cm²)입니다.`,
   `변 ㄱㄴ을 밑변으로 보면 높이는 ㄷㅁ=${fm(dm)} cm이므로 (변 ㄱㄴ)×${fm(dm)}÷2=${fm(area)}입니다.`,
   `변 ㄱㄴ=${fm(area)}×2÷${fm(dm)}=${fm(area*2)}÷${fm(dm)}=${fm(AB)}(cm)입니다.`,
   `변 ㄱㄷ=${fm(per)}−${fm(b)}−${fm(AB)}=${fm(ans)}(cm)입니다.`])};
}

const pool=(arr)=>arr; // 가독성용
const ITEMS={
 '5-1-u6-t1-11':{sourceItemId:'5-1-u6-e1-mission-6',key:'orig51U6E1Mission6',resultContract:'single-value',
  answerAssumption:'가와 마는 그림처럼 다가 한 귀퉁이를 차지한 꺾인 모양이며, 각 조각의 둘레는 테두리 전체 길이로 봅니다.',
  pool:pool([e1m6({P:[32,22,16,34],g:[11,6,5,3]}),e1m6({P:[36,26,18,40],g:[12,7,6,3]}),e1m6({P:[30,24,20,38],g:[10,6,5,3]})])},
 '5-1-u6-t2':{sourceItemId:'5-1-u6-e2-exploration-1',key:'orig51U6E2Exploration1',resultContract:'drawing',answerVisualRequired:true,
  answerAssumption:'위치와 방향은 자유이며, 넓이가 맞는 정사각형이면 모두 정답입니다(정답 그림은 한 예).',pool:[e2x(1,0),e2x(2,0),e2x(3,0)]},
 '5-1-u6-t2-2':{sourceItemId:'5-1-u6-e2-exploration-2',key:'orig51U6E2Exploration2',resultContract:'drawing',answerVisualRequired:true,
  answerAssumption:'위치와 방향은 자유이며, 넓이가 맞는 정사각형이면 모두 정답입니다(정답 그림은 한 예).',pool:[e2x(1,1),e2x(3,3),e2x(4,4)]},
 '5-1-u6-t2-3':{sourceItemId:'5-1-u6-e2-exploration-3',key:'orig51U6E2Exploration3',resultContract:'drawing',answerVisualRequired:true,
  answerAssumption:'위치와 방향은 자유이며, 넓이가 맞는 정사각형이면 모두 정답입니다(정답 그림은 한 예).',pool:[e2x(2,1),e2x(3,2),e2x(4,1)]},
 '5-1-u6-t2-4':{sourceItemId:'5-1-u6-e2-exploration-4',key:'orig51U6E2Exploration4',resultContract:'drawing',answerVisualRequired:true,
  answerAssumption:'위치와 방향은 자유이며, 넓이가 맞는 정사각형이면 모두 정답입니다(정답 그림은 한 예).',pool:[e2x(2,2),e2x(4,2),e2x(5,1)]},
 '5-1-u6-t2-5':{sourceItemId:'5-1-u6-e2-exploration-5',key:'orig51U6E2Exploration5',resultContract:'drawing',answerVisualRequired:true,
  answerAssumption:'위치와 방향은 자유이며, 넓이가 맞는 정사각형이면 모두 정답입니다(정답 그림은 한 예).',pool:[e2x(3,1),e2x(5,2),e2x(5,3)]},
 '5-1-u6-t2-7':{sourceItemId:'5-1-u6-e2-example-2-2',key:'orig51U6E2Example22',resultContract:'single-value',
  answerAssumption:'가장 작은 색종이는 가장 큰 색종이 안에 완전히 놓이고, ㉡은 중간 색종이 중 가장 작은 색종이와 겹친 부분과 가장 큰 색종이 밖으로 나온 부분의 합입니다.',
  pool:[e22(10,4,8,0),e22(9,3,7,1),e22(11,5,8,2)]},
 '5-1-u6-t2-8':{sourceItemId:'5-1-u6-e2-example-2-3',key:'orig51U6E2Example23',resultContract:'single-value',pool:[e23(8,1.5),e23(12,1.5),e23(9,2)]},
 '5-1-u6-t2-9':{sourceItemId:'5-1-u6-e2-example-2-4',key:'orig51U6E2Example24',resultContract:'single-value',pool:[e24(2,5,4,9),e24(2,5,3,8),e24(3,5,4,7)]},
 '5-1-u6-t2-10':{sourceItemId:'5-1-u6-e2-mission-1',key:'orig51U6E2Mission1',resultContract:'single-value',pool:[m1(5,20),m1(4,25),m1(6,30)]},
 '5-1-u6-t2-11':{sourceItemId:'5-1-u6-e2-mission-2',key:'orig51U6E2Mission2',resultContract:'single-value',
  answerAssumption:'지갑의 한 긴 변은 블록 한 개의 대각선과 꼭 맞고, 그 맞은편 변은 그 블록의 한 꼭짓점을 지납니다.',pool:[m2(20,15),m2(24,18),m2(16,12)]},
 '5-1-u6-t2-12':{sourceItemId:'5-1-u6-e2-mission-3',key:'orig51U6E2Mission3',resultContract:'single-value',pool:[m3(5,4,1,1,2),m3(6,5,1,1,3),m3(7,5,2,1,2)]},
 '5-1-u6-t2-13':{sourceItemId:'5-1-u6-e2-mission-4',key:'orig51U6E2Mission4',resultContract:'multi-value',
  answerAssumption:'표시된 세 넓이는 각 직사각형에서 다른 직사각형과 겹치지 않은 부분이고, 나머지 한 넓이는 세 직사각형이 모두 겹친 부분입니다.',
  pool:[m4(320,189,200,181,48,8,3,6),m4(300,170,186,160,40,8,3,6),m4(360,210,220,200,54,9,3,6)]},
 '5-1-u6-t2-14':{sourceItemId:'5-1-u6-e2-mission-5',key:'orig51U6E2Mission5',resultContract:'single-value',pool:[m5([25,20,10],[10,20,30]),m5([21,18,6],[10,20,40]),m5([20,15,5],[10,20,40])]},
 '5-1-u6-t2-15':{sourceItemId:'5-1-u6-e2-mission-6',key:'orig51U6E2Mission6',resultContract:'single-value',
  answerAssumption:'논은 밭과 가로, 세로의 길이가 각각 같고, 길은 변에 평행하게 끝에서 끝까지 곧게 나 있습니다.',pool:[m6(720,360),m6(600,400),m6(500,400)]},
 '5-1-u6-t3':{sourceItemId:'5-1-u6-e3-exploration-1',key:'orig51U6E3Exploration1',resultContract:'single-value',pool:[e3x(4,5,1),e3x(3,6,1),e3x(5,5,2)]},
 '5-1-u6-t3-2':{sourceItemId:'5-1-u6-e3-exploration-2',key:'orig51U6E3Exploration2',resultContract:'single-value',pool:[e3x(3,7,4),e3x(2,6,3),e3x(3,5,4)]},
 '5-1-u6-t3-6':{sourceItemId:'5-1-u6-e3-example-3-2',key:'orig51U6E3Example32',resultContract:'single-value',pool:[e32(6,8,10,12.5,108),e32(9,12,15,22.5,270),e32(8,15,17,25.5,300)]},
 '5-1-u6-t3-7':{sourceItemId:'5-1-u6-e3-example-3-3',key:'orig51U6E3Example33',resultContract:'single-value',pool:[e33(54,32,36,139.3,Math.sqrt(48*48-32*32)),e33(75,56,60,210,42),e33(25,24,20,80,18)]},
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
