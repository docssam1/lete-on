// 황소 6-2 5단원 개념탐구 1 (원주와 호의 길이) 원문 구조 유형. 각 문항은 같은 구조·다른 수의 검증된 3문항 풀입니다.
(function(root){'use strict';
const GROUP='6-2-u5-e1';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;

// ---------- 그림 도우미 ----------
const S='stroke:#222;stroke-width:1.4px';
const DIM='fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3';
const f=v=>{const s=(Math.round(v*10)/10).toFixed(1);return s.endsWith('.0')?s.slice(0,-2):s;};
const svg=(w,h,label,body)=>`<svg viewBox="0 0 ${w} ${h}" style="width:100%;max-width:360px;height:auto;display:block;margin:8px auto;font-family:inherit" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const T=(x,y,t,a,sz)=>`<text x="${f(x)}" y="${f(y)}" text-anchor="${a||'middle'}" font-size="${sz||13}" fill="#222" style="font-family:inherit">${t}</text>`;
const line=(x1,y1,x2,y2,st)=>`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" style="${st||S}"/>`;
const dot=(x,y)=>`<circle cx="${f(x)}" cy="${f(y)}" r="2.6" style="fill:#222"/>`;
const circ=(x,y,r,st)=>`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" style="${st}"/>`;
const hdim=(x1,x2,y)=>line(x1,y,x2,y,DIM)+line(x1,y-4,x1,y+4,'stroke:#55524d;stroke-width:1px')+line(x2,y-4,x2,y+4,'stroke:#55524d;stroke-width:1px');
const stad=(x1,x2,cy,R,st)=>`<path d="M${f(x1)} ${f(cy-R)}L${f(x2)} ${f(cy-R)}A${f(R)} ${f(R)} 0 0 1 ${f(x2)} ${f(cy+R)}L${f(x1)} ${f(cy+R)}A${f(R)} ${f(R)} 0 0 1 ${f(x1)} ${f(cy-R)}Z" style="${st}"/>`;
// 화면에서 시계 방향으로 놓인 중심점들을 반지름 r만큼 바깥으로 감싼 끈 모양
function hull(pts,r){const n=pts.length,N=[];
 for(let i=0;i<n;i++){const [x1,y1]=pts[i],[x2,y2]=pts[(i+1)%n],L=Math.hypot(x2-x1,y2-y1);N.push([(y2-y1)/L,-(x2-x1)/L]);}
 let d='';for(let i=0;i<n;i++){const P=pts[i],Q=pts[(i+1)%n],m=N[i],m2=N[(i+1)%n];
  d+=(i?'L':'M')+f(P[0]+r*m[0])+' '+f(P[1]+r*m[1])+'L'+f(Q[0]+r*m[0])+' '+f(Q[1]+r*m[1])+'A'+f(r)+' '+f(r)+' 0 0 1 '+f(Q[0]+r*m2[0])+' '+f(Q[1]+r*m2[1]);}
 return d+'Z';}

function sectorSvg(th){const R=130,cx=180,cy=20,rad=d=>d*Math.PI/180,a1=rad(90-th/2),a2=rad(90+th/2);
 const p=(r,a)=>[cx+r*Math.cos(a),cy+r*Math.sin(a)];const [x1,y1]=p(R,a1),[x2,y2]=p(R,a2),[u1,v1]=p(18,a1),[u2,v2]=p(18,a2);
 return svg(360,cy+R+12,`중심각이 ${th}도인 부채꼴`,
  `<path d="M${cx} ${cy}L${f(x1)} ${f(y1)}A${R} ${R} 0 0 1 ${f(x2)} ${f(y2)}Z" style="fill:#fff;${S}"/>`+
  `<path d="M${f(u1)} ${f(v1)}A18 18 0 0 1 ${f(u2)} ${f(v2)}" style="fill:none;stroke:#222;stroke-width:1px"/>`+T(cx,cy+40,th+'°','middle',14));}

function holesSvg(fr){const R=130,cx=180,cy=142;let x=cx-R,b=circ(cx,cy,R,'fill:#d9d9d9;'+S);
 fr.forEach(q=>{const r=R*q;b+=circ(x+r,cy,r,'fill:#fff;'+S);x+=2*r;});
 b+=line(cx-R,cy,cx+R,cy,'stroke:#222;stroke-width:1px;stroke-dasharray:5 3');
 return svg(360,284,'큰 원의 지름 위에 중심이 있는 원 구멍 다섯 개가 뚫린 그림',b);}

function sevenSvg(){const r=36,cx=180,cy=118,c=[[cx,cy]],o=[];
 for(let k=0;k<6;k++){const a=k*Math.PI/3;o.push([cx+2*r*Math.cos(a),cy+2*r*Math.sin(a)]);}
 let b=`<path d="${hull(o,r)}" style="fill:none;${S}"/>`;
 c.concat(o).forEach(([x,y])=>{b+=circ(x,y,r,'fill:#e3e3e3;stroke:#222;stroke-width:1.2px');});
 return svg(360,236,'크기가 같은 원 일곱 개를 끈으로 둘러 묶은 그림',b);}

function cansSvg(d){const r=40,y0=172,h=r*Math.sqrt(3),T1=[140,y0-h],T2=[220,y0-h],B3=[260,y0],B2=[180,y0],B1=[100,y0];
 let b=`<path d="${hull([T1,T2,B3,B1],r)}" style="fill:none;${S}"/>`;
 [T1,T2,B1,B2,B3].forEach(([x,y])=>{b+=circ(x,y,r,'fill:#d9d9d9;stroke:#222;stroke-width:1.2px');});
 const [x,y]=T1;b+=line(x-r,y,x+r,y,'stroke:#222;stroke-width:1.2px')+dot(x,y)+`<path d="M${f(x-r+2)} ${f(y+2)}Q${f(x)} ${f(y+24)} ${f(x+r-2)} ${f(y+2)}" style="${DIM}"/>`+T(x,y+29,d+' cm');
 return svg(360,226,`지름이 ${d} cm인 원 모양 캔 다섯 개를 끈으로 묶은 그림`,b);}

function nestedSvg(){const R=120,cx=180,cy=130;let b=circ(cx,cy,R,'fill:none;'+S);
 b+=circ(cx,cy-R/2,R/2,'fill:none;'+S)+circ(cx,cy+R/2,R/2,'fill:none;'+S)+circ(cx,cy+R/4,R/4,'fill:none;'+S)+circ(cx,cy+3*R/4,R/4,'fill:none;'+S);
 b+=line(cx,cy-R,cx,cy+R,'stroke:#222;stroke-width:1px');[cy-R/2,cy,cy+R/4,cy+R/2,cy+3*R/4].forEach(y=>{b+=dot(cx,y);});
 return svg(360,262,'큰 원 안에 중간 원 두 개와 작은 원 두 개가 세로로 맞닿아 있는 그림',b);}

function treesSvg(n1,s1,n2){const R=75,cy=112;
 const tree=(cx,n)=>{let b=circ(cx,cy,R,'fill:#d6d6d6;'+S)+circ(cx,cy,R*(n-1)/n,'fill:#fff;stroke:#222;stroke-width:1.1px');
  for(let k=1;k<=n-2;k++)b+=circ(cx,cy,R*k/n,'fill:none;stroke:#222;stroke-width:1.1px');return b+dot(cx,cy);};
 const cx=90,rr=R/n1;let b=tree(cx,n1)+tree(270,n2);
 b+=line(cx,cy,cx+rr,cy,'stroke:#222;stroke-width:1.2px');
 const my=cy-rr/2-7;b+=`<path d="M${f(cx)} ${f(cy-2)}Q${f(cx+rr/2)} ${f(cy-rr-12)} ${f(cx+rr)} ${f(cy-2)}" style="${DIM}"/>`;
 b+=`<path d="M${f(cx+rr/2)} ${f(my)}Q${f(cx+rr/2+8)} ${f(cy-R*0.8)} ${f(cx+R*0.72)} ${f(cy-R-12)}" style="fill:none;stroke:#222;stroke-width:0.9px"/>`+T(cx+R*0.72+3,cy-R-8,s1+' cm','start');
 b+=T(cx,cy+R+22,n1+'년 된 나무')+T(270,cy+R+22,n2+'년 된 나무');
 return svg(360,218,`굵기가 같은 ${n1}년 된 나무와 ${n2}년 된 나무의 나이테 그림`,b);}

// 스피드 스케이팅: 직선 L, 인코스 안쪽 선의 반원 지름 D, 코스 폭 w, 경주 거리 200, 원주율 3.1
function skateSvg(L,D,w){const s=340/(L+D+4*w),R0=D/2*s,R1=(D/2+w)*s,R2=(D/2+2*w)*s,cx1=10+R2,cx2=cx1+L*s,cy=28+R2,pi=3.1;
 const aIn=200-pi*D/2-L/2,aOut=200-pi*(D/2+w)-L/2,xIn=cx2-aIn*s,xOut=cx2-aOut*s,xm=(cx1+cx2)/2,bot=cy+R2;
 let b=stad(cx1,cx2,cy,R2,'fill:#fff;'+S)+stad(cx1,cx2,cy,R1,'fill:none;'+S)+stad(cx1,cx2,cy,R0,'fill:#fff;'+S);
 b+=line(cx1,cy-R0,cx1,cy+R0,DIM)+line(cx2,cy-R0,cx2,cy+R0,DIM)+dot(cx1,cy)+dot(cx2,cy);
 b+=hdim(cx1,cx2,cy-R0+11)+T(xm,cy-R0+27,L+' m')+T(cx2-7,cy+5,D+' m','end');
 b+=line(xm,cy-R2-5,xm,cy-R0,'stroke:#222;stroke-width:2px')+T(xm,cy-R2-9,'도착');
 b+=line(xIn,cy+R0,xIn,cy+R1,'stroke:#222;stroke-width:2.2px')+line(xOut,cy+R1,xOut,cy+R2,'stroke:#222;stroke-width:2.2px');
 const yO=cy+R0-27,yI=cy+R0-9;
 b+=T(cx1+4,yO,'아웃코스 출발선','start')+line(cx1+100,yO-4,xOut,cy+(R1+R2)/2,'stroke:#222;stroke-width:0.9px');
 b+=T(cx1+4,yI,'인코스 출발선','start')+line(cx1+88,yI-4,xIn,cy+(R0+R1)/2,'stroke:#222;stroke-width:0.9px');
 b+=T(xOut+4,bot+17,'출발 →','start');
 return svg(360,f(bot+24),`직선 ${L} m, 반원 지름 ${D} m인 스피드 스케이팅 트랙 그림`,b);}

// 육상 트랙: 직선 L, 1번 레인 안쪽 선의 반원 지름 D, 레인 폭 w, 3개 레인, 도착선은 위쪽 직선에서 오른쪽 끝으로부터 fb m
function trackSvg(L,D,w,fb){const wp=8,s=(340-6*wp)/(L+D),R0=D/2*s,Rk=k=>R0+k*wp,cx1=10+Rk(3),cx2=cx1+L*s,cy=34+Rk(3),pi=3.1,bot=cy+Rk(3);
 const a1=200-pi*D/2-fb,xs=k=>cx2-(a1-(k-1)*pi*w)*s,xf=cx2-fb*s;
 let b=stad(cx1,cx2,cy,Rk(3),'fill:#fff;'+S)+stad(cx1,cx2,cy,Rk(2),'fill:none;stroke:#222;stroke-width:1px')+stad(cx1,cx2,cy,Rk(1),'fill:none;stroke:#222;stroke-width:1px')+stad(cx1,cx2,cy,R0,'fill:#d9d9d9;'+S);
 b+=line(cx1,cy-Rk(3)-18,cx1,cy-Rk(3)-2,'stroke:#55524d;stroke-width:0.8px')+line(cx2,cy-Rk(3)-18,cx2,cy-Rk(3)-2,'stroke:#55524d;stroke-width:0.8px');
 b+=hdim(cx1,cx2,cy-Rk(3)-12)+`<rect x="${f((cx1+cx2)/2-20)}" y="${f(cy-Rk(3)-26)}" width="40" height="15" style="fill:#fff"/>`+T((cx1+cx2)/2,cy-Rk(3)-14,L+' m');
 b+=line(cx1,cy-R0,cx1,cy+R0,DIM)+line(cx2,cy-R0,cx2,cy+R0,DIM)+dot(cx1,cy)+dot(cx2,cy)+T(cx2-7,cy+5,D+' m','end');
 b+=line(xf,cy-Rk(3),xf,cy-R0,'stroke:#222;stroke-width:2px')+T(xf,cy-R0+17,'도착');
 for(let k=1;k<=3;k++)b+=line(xs(k),cy+Rk(k-1),xs(k),cy+Rk(k),'stroke:#222;stroke-width:2.2px');
 b+=T(xs(3)+6,bot+17,'출발 →','start');
 for(let k=1;k<=3;k++){const y=bot+16*k;b+=T(14,y,k+'번 레인','start')+line(68,y-4,cx1+8+6*k,cy+Rk(k-1)+wp/2,'stroke:#222;stroke-width:0.8px');}
 return svg(360,f(bot+56),`직선 ${L} m, 반원 지름 ${D} m인 세 레인 육상 트랙 그림`,b);}

// 개념탐구 모범 답 그림: 원 + 원 안에 꼭 맞는 정육각형 + 원 밖에 꼭 맞는 정사각형
function piBoundSvg(dLabel){const R=110,cx=180,cy=132;let b=`<rect x="${cx-R}" y="${cy-R}" width="${2*R}" height="${2*R}" style="fill:none;${S}"/>`+circ(cx,cy,R,'fill:none;'+S);
 const hv=[];for(let k=0;k<6;k++){const a=k*Math.PI/3;hv.push([cx+R*Math.cos(a),cy+R*Math.sin(a)]);}
 b+=`<path d="M${hv.map(([x,y])=>f(x)+' '+f(y)).join('L')}Z" style="fill:none;${S}"/>`;
 hv.forEach(([x,y])=>{b+=line(cx,cy,x,y,'stroke:#222;stroke-width:0.8px');});b+=dot(cx,cy);
 b+=line(cx-R,cy+R+4,cx-R,cy+R+24,'stroke:#55524d;stroke-width:0.8px')+line(cx+R,cy+R+4,cx+R,cy+R+24,'stroke:#55524d;stroke-width:0.8px')+hdim(cx-R,cx+R,cy+R+16)+T(cx,cy+R+34,dLabel);
 return svg(360,f(cy+R+42),'원 안에 꼭 맞는 정육각형과 원 밖에 꼭 맞는 정사각형을 그린 그림',b);}

const ol=a=>'<ol>'+a.map(x=>'<li>'+x+'</li>').join('')+'</ol>';
const P=a=>a.map(x=>x.startsWith('<')?x:'<p>'+x+'</p>').join('');

// ---------- 문항 ----------
function sectorItem(key,v){return {key,resultContract:'single-value',answerVisualRequired:false,pool:v.map(([th,arc,num,den,circ,dia,r])=>({
 prompt:P([`다음 부채꼴에서 호의 길이는 ${arc} cm입니다. 이 부채꼴의 반지름은 몇 cm인지 구하세요. (원주율: 3.14)`,sectorSvg(th)]),
 answer:r+' cm',
 solution:ol([`중심각이 ${th}°이므로 호의 길이는 원주의 ${ff(th,360)} = ${ff(num,den)}입니다.`,
  `원주는 ${arc} ÷ ${ff(num,den)} = ${arc} × ${ff(den,num)} = ${circ} (cm)입니다.`,
  `지름은 ${circ} ÷ 3.14 = ${dia} (cm)이므로 반지름은 ${dia} ÷ 2 = ${r} (cm)입니다.`])}))};}

const ITEMS={
 '6-2-u5-e1-exploration':{key:'source62U5E1Exploration1',resultContract:'explanation',answerVisualRequired:true,pool:[[null],[10],[8]].map(([d])=>{
   const dl=d?`지름 ${d} cm`:'지름',hx=d?`${d} × 3 = ${d*3} (cm)`:'지름 × 3',sq=d?`${d} × 4 = ${d*4} (cm)`:'지름 × 4',lo=d?`${d*3} cm`:'지름×3',hi=d?`${d*4} cm`:'지름×4';
   return {
   prompt:P([`원주율의 크기가 3보다 큰 까닭을 그림을 그려 설명해 보세요. 또, 4보다 작은 까닭도 설명해 보세요.`+(d?` (지름이 ${d} cm인 원을 그려 설명해 보세요.)`:'')]),
   answer:`정육각형의 둘레(${lo}) < 원주 < 정사각형의 둘레(${hi})이므로 3 < 원주율 < 4`,
   answerVisual:piBoundSvg(dl),
   solution:ol([`${d?`지름이 ${d} cm인 원`:'원'}을 그리고, 원 안에 꼭짓점이 모두 원 위에 있는 정육각형을, 원 밖에 원에 꼭 맞는 정사각형을 그립니다.`,
    `정육각형은 원의 중심과 이으면 한 변이 반지름인 정삼각형 6개로 나뉘므로, 둘레는 반지름의 6배, 곧 ${hx}입니다.`,
    `원의 둘레는 정육각형의 둘레보다 바깥으로 돌아가므로 원주는 ${hx}보다 깁니다. 따라서 원주 ÷ 지름인 원주율은 3보다 큽니다.`,
    `정사각형의 한 변은 원의 지름과 같으므로 둘레는 ${sq}이고, 원은 정사각형 안에 들어가므로 원주는 이보다 짧습니다. 따라서 원주율은 4보다 작습니다.`])};})},
 '6-2-u5-e1-example-1':sectorItem('source62U5E1Example1',[[144,'21.98',2,5,'54.95','17.5','8.75'],[160,'12.56',4,9,'28.26','9','4.5'],[120,'15.7',1,3,'47.1','15','7.5']]),
 '6-2-u5-e1-example-2':{key:'source62U5E1Example2',resultContract:'single-value',answerVisualRequired:false,pool:[
   [20,60,120,[0.21,0.09,0.13,0.33,0.24]],[30,90,180,[0.18,0.12,0.3,0.1,0.3]],[16,48,96,[0.25,0.15,0.08,0.22,0.3]]].map(([D,c,t,fr])=>({
   prompt:P([`다음 그림과 같이 지름이 ${D} cm인 원판에, 큰 원의 지름 위에 중심이 있는 원 모양의 구멍들이 뚫려 있습니다. 구멍들은 큰 원의 지름을 따라 빈틈없이 이어져 있습니다. 색칠한 부분의 둘레는 몇 cm인가요? (원주율: 3)`,holesSvg(fr)]),
   answer:t+' cm',
   solution:ol([`색칠한 부분의 둘레는 큰 원의 원주와 구멍 다섯 개의 원주를 모두 더한 길이입니다.`,
    `구멍들의 지름을 모두 더하면 큰 원의 지름과 같은 ${D} cm입니다.`,
    `구멍들의 원주의 합은 (지름의 합) × 3 = ${D} × 3 = ${c} (cm)입니다.`,
    `큰 원의 원주는 ${D} × 3 = ${c} (cm)이므로 둘레는 ${c} + ${c} = ${t} (cm)입니다.`])}))},
 '6-2-u5-e1-example-3':{key:'source62U5E1Example3',resultContract:'single-value',answerVisualRequired:false,pool:[
   [1,2,12,'6.28','18.28'],[2,4,24,'12.56','36.56'],[3,6,36,'18.84','54.84']].map(([r,d,st,arc,t])=>({
   prompt:P([`다음 그림은 반지름이 ${r} cm인 원 7개를 끈으로 둘러 묶어 놓은 것입니다. 묶은 끈의 길이는 몇 cm인지 구하세요. (단, 매듭의 길이는 생각하지 않습니다. 원주율: 3.14)`,sevenSvg()]),
   answer:t+' cm',
   solution:ol([`끈은 곧은 부분 6개와 원에 붙어 굽은 부분 6개로 이루어져 있습니다.`,
    `곧은 부분 한 개의 길이는 맞닿은 두 원의 중심 사이의 거리, 곧 지름 ${d} cm와 같으므로 곧은 부분의 합은 ${d} × 6 = ${st} (cm)입니다.`,
    `굽은 부분 6개의 중심각을 모두 더하면 360°이므로, 굽은 부분의 합은 원 한 개의 원주 ${d} × 3.14 = ${arc} (cm)입니다.`,
    `끈의 길이는 ${st} + ${arc} = ${t} (cm)입니다.`])}))},
 '6-2-u5-e1-example-4':{key:'source62U5E1Example4',resultContract:'single-value',answerVisualRequired:false,pool:[
   [112,52,4,60,'80.6','93','12.4'],[100,50,3,56,'77.5','86.8','9.3'],[110,48,5,58,'74.4','89.9','15.5']].map(([L,D,w,D2,c1,c2,t])=>({
   prompt:P([`스피드 스케이팅 트랙은 직선 구간과 반원 모양의 곡선 구간으로 되어 있습니다. 지형이와 세정이가 200 m를 도는 스피드 스케이팅 경기를 하는데, 지형이는 인코스를, 세정이는 아웃코스를 돕니다. 인코스와 아웃코스의 폭이 각각 ${w} m일 때, 공정한 경기를 하려면 세정이는 지형이보다 몇 m 앞에서 출발해야 하나요? (단, 출발선의 위치는 각 코스의 안쪽 선을 기준으로 계산하고, 원주율은 3.1로 계산합니다.)`,skateSvg(L,D,w)]),
   answer:t+' m',
   solution:ol([`그림에서 두 사람은 출발하여 반원 모양의 곡선 구간을 한 번 지난 뒤 도착선에 닿습니다. 직선 구간의 길이 차이는 출발선 위치로 맞추므로, 곡선 구간의 길이 차이만큼 앞에서 출발하면 됩니다.`,
    `인코스 안쪽 선의 반원 지름은 ${D} m이고, 아웃코스 안쪽 선은 양쪽으로 ${w} m씩 바깥에 있으므로 지름이 ${D} + ${w} × 2 = ${D2} (m)입니다.`,
    `반원의 길이는 인코스 ${D} × 3.1 ÷ 2 = ${c1} (m), 아웃코스 ${D2} × 3.1 ÷ 2 = ${c2} (m)입니다.`,
    `따라서 세정이는 ${c2} − ${c1} = ${t} (m) 앞에서 출발해야 합니다.`])}))},
 '6-2-u5-e1-mission-1':{key:'source62U5E1Mission1',resultContract:'single-value',answerVisualRequired:false,pool:[
   [50,8,60,'21.98','2198','157','1256','942','188.4',5],[40,10,50,'25.12','2512','125.6','1256','1256','157',8],[45,8,60,'28.26','2826','141.3','1130.4','1695.6','188.4',9]]
   .map(([d1,n1,d2,m,cm,c1,l1,rest,c2,n2])=>({
   prompt:P([`희서와 은숙이가 굴렁쇠 굴리기를 하고 있습니다. 먼저 희서가 지름이 ${d1} cm인 굴렁쇠를 ${n1}바퀴 굴리고, 이어서 은숙이가 지름이 ${d2} cm인 굴렁쇠를 굴렸더니 출발점에서 ${m} m 떨어진 곳에 닿았습니다. 은숙이는 굴렁쇠를 몇 바퀴 굴렸나요? (원주율: 3.14)`]),
   answer:n2+'바퀴',
   solution:ol([`${m} m = ${cm} cm입니다.`,
    `희서의 굴렁쇠가 한 바퀴에 가는 거리는 ${d1} × 3.14 = ${c1} (cm)이므로 ${n1}바퀴에 ${c1} × ${n1} = ${l1} (cm)를 갔습니다.`,
    `은숙이가 굴린 거리는 ${cm} − ${l1} = ${rest} (cm)입니다.`,
    `은숙이의 굴렁쇠는 한 바퀴에 ${d2} × 3.14 = ${c2} (cm)를 가므로 ${rest} ÷ ${c2} = ${n2}(바퀴) 굴렸습니다.`])}))},
 '6-2-u5-e1-mission-2':{key:'source62U5E1Mission2',resultContract:'single-value',answerVisualRequired:false,pool:[
   ['15.5','5','20','62'],['18.6','6','24','74.4'],['12.4','4','16','49.6']].map(([c,d,D,t])=>({
   prompt:P([`다음 그림에서 가장 작은 원 한 개의 원주가 ${c} cm일 때, 가장 큰 원의 원주는 몇 cm인가요? (원주율: 3.1)`,nestedSvg()]),
   answer:t+' cm',
   solution:ol([`가장 작은 원의 지름은 ${c} ÷ 3.1 = ${d} (cm)입니다.`,
    `아래쪽 중간 원의 지름은 가장 작은 원 2개의 지름과 같고, 위쪽 중간 원도 아래쪽 중간 원과 크기가 같습니다. 가장 큰 원의 지름은 중간 원 2개의 지름의 합이므로 가장 작은 원 지름의 4배인 ${d} × 4 = ${D} (cm)입니다.`,
    `가장 큰 원의 원주는 ${D} × 3.1 = ${t} (cm)입니다.`])}))},
 '6-2-u5-e1-mission-3':{key:'source62U5E1Mission3',resultContract:'single-value',answerVisualRequired:false,answerAssumption:'n년 된 나무는 중심에서 나무 둘레까지가 같은 간격으로 n칸으로 나뉘고, 가장 바깥 원은 나무 둘레임',pool:[
   [6,3,9,18,2,'2, 4, 6, …, 16',8,72,'452.16'],[4,6,8,24,3,'3, 6, 9, …, 21',7,84,'527.52'],[5,4,10,20,2,'2, 4, 6, …, 18',9,90,'565.2']]
   .map(([n1,s1,n2,R,s2,list,cnt,sum,t])=>({
   prompt:P([`나이테는 1년에 한 번씩 생기므로 나이테의 수를 세어 보면 나무의 나이를 알 수 있습니다. 다음은 굵기가 같은 ${n1}년 된 나무와 ${n2}년 된 나무를 자른 면입니다. 각 나무에서 나이테 사이의 간격이 일정하다면 ${n2}년 된 나무의 나이테의 길이의 합은 모두 몇 cm인가요? (단, 나무의 둘레는 나이테의 길이에 넣지 않습니다. 원주율: 3.14)`,treesSvg(n1,s1,n2),
    `<p>※ 조건 보충: 그림처럼 ${n1}년 된 나무는 중심에서 나무 둘레까지가 같은 간격으로 ${n1}칸, ${n2}년 된 나무는 ${n2}칸으로 나뉘어 있고, 가장 바깥 원이 나무의 둘레입니다.</p>`]),
   answer:t+' cm',
   solution:ol([`${n1}년 된 나무는 중심에서 둘레까지 ${s1} cm 간격으로 ${n1}칸이므로 반지름이 ${s1} × ${n1} = ${R} (cm)입니다.`,
    `${n2}년 된 나무도 굵기가 같아 반지름이 ${R} cm이고, ${n2}칸으로 나뉘므로 간격은 ${R} ÷ ${n2} = ${s2} (cm)입니다.`,
    `나무의 둘레를 빼면 나이테는 반지름이 ${list} cm인 ${cnt}개이고, 반지름의 합은 ${sum} cm입니다.`,
    `나이테의 길이의 합은 ${sum} × 2 × 3.14 = ${t} (cm)입니다.`])}))},
 '6-2-u5-e1-mission-4':{key:'source62U5E1Mission4',resultContract:'single-value',answerVisualRequired:false,answerAssumption:'매듭에 사용한 끈은 두 바퀴 전체에서 한 번만 더함',pool:[
   [18,20,36,90,'56.52','146.52','293.04','313.04'],[16,15,32,80,'50.24','130.24','260.48','275.48'],[20,25,40,100,'62.8','162.8','325.6','350.6']]
   .map(([d,k,d2,st,arc,one,two,t])=>({
   prompt:P([`다음 그림과 같이 지름이 ${d} cm인 원 모양의 음료수 캔 5개를 끈으로 두 번 감아 묶었습니다. 매듭을 짓는 데 ${k} cm를 사용했다면 사용한 끈의 길이는 적어도 몇 cm인가요? (단, 원주율은 3.14이고 끈의 두께는 생각하지 않습니다.)`,cansSvg(d),
    `<p>※ 조건 보충: 끈은 그림의 모양대로 캔 둘레를 두 바퀴 감았고, 매듭에 쓴 ${k} cm는 전체에서 한 번만 더합니다.</p>`]),
   answer:t+' cm',
   solution:ol([`맞닿은 두 캔의 중심 사이의 거리는 지름 ${d} cm와 같습니다. 끈의 곧은 부분은 아래쪽 ${d2} cm, 위쪽 ${d} cm, 양옆 ${d} cm씩이므로 합이 ${d2} + ${d} + ${d} + ${d} = ${st} (cm)입니다.`,
    `굽은 부분 4개의 중심각을 모두 더하면 360°이므로 굽은 부분의 합은 캔 한 개의 원주 ${d} × 3.14 = ${arc} (cm)입니다.`,
    `한 바퀴 감는 데 ${st} + ${arc} = ${one} (cm)이므로 두 바퀴는 ${one} × 2 = ${two} (cm)입니다.`,
    `매듭에 쓴 ${k} cm를 더하면 ${two} + ${k} = ${t} (cm)입니다.`])}))},
 '6-2-u5-e1-mission-5':sectorItem('source62U5E1Mission5',[[108,'9.42',3,10,'31.4','10','5'],[135,'9.42',3,8,'25.12','8','4'],[80,'12.56',2,9,'56.52','18','9']]),
 '6-2-u5-e1-mission-6':{key:'source62U5E1Mission6',resultContract:'single-value',answerVisualRequired:false,pool:[
   [90,50,'1','2',54,'77.5','83.7','6.2',72],[80,60,'1.2','2.4',64.8,'93','100.44','7.44',64],[100,40,'1.5','3',46,'62','71.3','9.3',80]]
   .map(([L,D,w,w2,D3,c1,c3,t,fb])=>({
   prompt:P([`육상 경기장의 트랙은 직선 구간과 곡선 구간으로 이루어져 있습니다. 레인마다 곡선 구간의 거리가 다르기 때문에 공정한 경기를 하려면 출발선의 위치를 다르게 해야 합니다. 다음 트랙에서 200 m 달리기 경기를 하려고 합니다. 각 레인의 폭이 ${w} m일 때, 3번 레인의 출발선은 1번 레인의 출발선보다 몇 m 앞에 있어야 하는지 구하세요. (단, 출발선의 위치는 레인의 안쪽 선을 기준으로 생각합니다. 원주율: 3.1)`,trackSvg(L,D,+w,fb)]),
   answer:t+' m',
   solution:ol([`그림에서 선수들은 출발하여 반원 모양의 곡선 구간을 한 번 지난 뒤 도착선에 닿으므로, 곡선 구간의 길이 차이만큼 출발선을 앞에 두어야 합니다.`,
    `1번 레인 안쪽 선의 반원 지름은 ${D} m입니다. 3번 레인 안쪽 선은 1번 레인 안쪽 선보다 레인 2개만큼, 곧 ${w} × 2 = ${w2} (m) 바깥에 있으므로 지름이 ${D} + ${w2} × 2 = ${f(D3)} (m)입니다.`,
    `반원의 길이는 1번 레인 ${D} × 3.1 ÷ 2 = ${c1} (m), 3번 레인 ${f(D3)} × 3.1 ÷ 2 = ${c3} (m)입니다.`,
    `따라서 3번 레인의 출발선은 ${c3} − ${c1} = ${t} (m) 앞에 있어야 합니다.`])}))},
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
