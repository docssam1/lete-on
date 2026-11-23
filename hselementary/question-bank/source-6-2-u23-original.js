// 황소 6-2 2단원(소수의 나눗셈)·3단원(공간과 입체) 잠금 원문 유형 묶음.
// 원문 수치를 보존한 변형 0과 수만 바꾼 변형 1·2를 고정 검증 풀(fixed-verified-pool)로 제공합니다.
(function(root){'use strict';
const GROUP='6-2-u23';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;
const ol=steps=>'<ol>'+steps.map(s=>`<li>${s}</li>`).join('')+'</ol>';
const n=x=>String(Math.round(x*1e6)/1e6); // 유한소수 표시
const ro=d=>'036'.includes(String(d).slice(-1))?'으로':'로'; // 조사
const C=s=>`<p style="text-align:center">${s}</p>`;

// ---------- SVG 도우미 (화면 좌표: y 아래쪽) ----------
const r2=x=>Math.round(x*100)/100;
const P=p=>`${r2(p[0])},${r2(p[1])}`;
const ST='stroke="#222" stroke-width="1.4" fill="none" stroke-linejoin="round"';
const DIM='style="fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3"';
const svg=(w,h,body,label,mw)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" style="width:100%;max-width:${mw||360}px;height:auto;display:block;margin:8px auto" xmlns="http://www.w3.org/2000/svg" font-family="inherit">${body}</svg>`;
const T=(p,s,a,fs)=>`<text x="${r2(p[0])}" y="${r2(p[1])}" text-anchor="${a||'middle'}" dominant-baseline="middle" font-size="${fs||14}" fill="#222">${s}</text>`;
const line=(A,B)=>`<path d="M${P(A)} L${P(B)}" ${ST}/>`;
const dashLine=(A,B)=>`<path d="M${P(A)} L${P(B)}" stroke="#222" stroke-width="1.2" fill="none" stroke-dasharray="4 3"/>`;
const poly=(pts,fill)=>`<path d="M${pts.map(P).join(' L')} Z" fill="${fill}" stroke="none"/>`;
// 점선 치수 호와 길이 글자
function dim(A,B,off,label,lo){const dx=B[0]-A[0],dy=B[1]-A[1],L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L,m=[(A[0]+B[0])/2,(A[1]+B[1])/2];
 const c=[m[0]+nx*off*2,m[1]+ny*off*2],t=[m[0]+nx*(off+(off>0?lo:-lo)),m[1]+ny*(off+(off>0?lo:-lo))];
 return `<path d="M${P(A)} Q${P(c)} ${P(B)}" ${DIM}/>`+`<rect x="${r2(t[0]-26)}" y="${r2(t[1]-9)}" width="52" height="18" fill="#fff" stroke="none"/>`+T(t,label);}
const rmark=(V,u,v,z)=>`<path d="M${P([V[0]+u[0]*z,V[1]+u[1]*z])} L${P([V[0]+(u[0]+v[0])*z,V[1]+(u[1]+v[1])*z])} L${P([V[0]+v[0]*z,V[1]+v[1]*z])}" fill="none" stroke="#222" stroke-width="1"/>`;

// ---------- 2단원 그림 ----------
// 예제 2-4: 직각사다리꼴 ㄱㄴㄷㄹ (ㄱ·ㄴ 직각), ㅁ은 ㄴㄹ의 가운데 점, 삼각형 ㄱㅁㄷ 색칠
function figTrap(a,b,h){const k=220/a,x0=40,y0=42,H=h*k;
 const G=[x0,y0],R=[x0+a*k,y0],N=[x0,y0+H],D=[x0+b*k,y0+H],M=[(N[0]+R[0])/2,(N[1]+R[1])/2];
 let s=poly([G,M,D],'#cfcfcf');
 s+=`<path d="M${P(G)} L${P(R)} L${P(D)} L${P(N)} Z" ${ST}/>`+line(G,D)+line(N,R)+line(G,M)+line(M,D);
 s+=rmark(G,[1,0],[0,1],10)+rmark(N,[1,0],[0,-1],10);
 s+=dim(G,R,-11,`${a} cm`,12)+dim(N,D,11,`${b} cm`,12);
 s+=T([G[0]-13,G[1]],'ㄱ')+T([R[0]+13,R[1]],'ㄹ')+T([N[0]-13,N[1]],'ㄴ')+T([D[0]+13,D[1]],'ㄷ')+T([M[0]+13,M[1]+2],'ㅁ');
 return svg(R[0]+40,N[1]+48,s,'사다리꼴 ㄱㄴㄷㄹ과 색칠한 삼각형 ㄱㅁㄷ');}
// Mission 3: 네 각이 직각인 사각형 ㄱㄴㄷㄹ, ㅁ은 ㄴㄷ 위의 점
function figRect(h,base,x){const k=200/base,x0=78,y0=34,W=base*k,H=h*k;
 const G=[x0,y0],R=[x0+W,y0],N=[x0,y0+H],D=[x0+W,y0+H],M=[x0+x*k,y0+H];
 let s=dashLine(G,R)+line(G,N)+line(N,D)+line(D,R)+line(G,D)+line(R,M);
 s+=rmark(N,[1,0],[0,-1],10)+rmark(D,[-1,0],[0,-1],10)+rmark(R,[-1,0],[0,1],10);
 s+=dim(G,N,11,`${h} cm`,30);
 s+=T([G[0],G[1]-14],'ㄱ')+T([R[0],R[1]-14],'ㄹ')+T([N[0],N[1]+16],'ㄴ')+T([D[0],D[1]+16],'ㄷ')+T([M[0],M[1]+16],'ㅁ');
 return svg(R[0]+30,N[1]+34,s,'사각형 ㄱㄴㄷㄹ 안의 삼각형 ㄱㄴㄷ과 삼각형 ㄹㅁㄷ');}

// ---------- 3단원 도우미 ----------
const K=(r,c,z)=>r+','+c+','+z;
function solid(hm){const S=new Set();hm.forEach((row,r)=>row.forEach((h,c)=>{for(let z=0;z<h;z++)S.add(K(r,c,z));}));return S;}
const DIRS=[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]];
function paint(hm){const S=solid(hm),top=Math.max(...hm.flat()),layers=[];const all=[0,0,0,0,0,0,0];
 for(let z=0;z<top;z++){const L=[0,0,0,0,0,0,0];hm.forEach((row,r)=>row.forEach((h,c)=>{if(z<h){let k=0;DIRS.forEach(d=>{if(!S.has(K(r+d[0],c+d[1],z+d[2])))k++;});L[k]++;all[k]++;}}));layers.push(L);}
 if(all[6])throw new Error('6면 쌓기나무');return {S,layers,all,N:S.size};}
const histText=a=>[0,1,2,3,4,5].map(i=>`${i}면 ${a[i]}개`).join(', ');
const layerText=L=>[0,1,2,3,4,5].filter(i=>L[i]).map(i=>`${i}면 ${L[i]}개`).join(', ');
function contacts(hm){let v=0,s=0;hm.forEach((row,r)=>row.forEach((h,c)=>{if(h)v+=h-1;if(c+1<row.length)s+=Math.min(h,row[c+1]);if(r+1<hm.length)s+=Math.min(h,hm[r+1][c]);}));return {v,s};}
// 빈 표(원문 표와 같은 0~5칸)
const answerTable=()=>`<table class="source6-answer-table" style="border-collapse:collapse;margin:8px auto;text-align:center"><tr>${[0,1,2,3,4,5].map(i=>`<td style="border:1px solid #222;width:40px;padding:4px">${i}</td>`).join('')}</tr><tr>${[0,1,2,3,4,5].map(()=>`<td style="border:1px solid #222;height:26px"></td>`).join('')}</tr></table>`;
// 위에서 본 모양에 쌓은 수를 쓴 그림
function hgrid(hm,opt){opt=opt||{};const c=34,x0=opt.x0||14,y0=opt.y0||14,rows=hm.length,cols=hm[0].length;let s='';
 hm.forEach((row,r)=>row.forEach((h,j)=>{if(!h)return;const x=x0+j*c,y=y0+r*c;s+=`<rect x="${x}" y="${y}" width="${c}" height="${c}" fill="#dcdcdc" stroke="#222" stroke-width="1.4"/>`+T([x+c/2,y+c/2+1],h,'middle',17);}));
 let w=x0+cols*c+14,hh=y0+rows*c+14;
 if(opt.dirs){const gx=x0+cols*c,gy=y0+rows*c,ry=y0+1.5*c,cx=x0+1.5*c;
  s+=`<rect x="${x0+c/2+2}" y="${y0-30}" width="${2*c-4}" height="22" fill="#e6e6e6" stroke="none"/>`+T([x0+c+0,y0-19],'위');
  s+=`<path d="M${gx+44},${ry} L${gx+8},${ry}" stroke="#222" stroke-width="1.3" fill="none"/><path d="M${gx+6},${ry} L${gx+14},${ry-4} L${gx+14},${ry+4} Z" fill="#222"/>`+T([gx+58,ry],'옆');
  s+=`<path d="M${cx},${gy+34} L${cx},${gy+8}" stroke="#222" stroke-width="1.3" fill="none"/><path d="M${cx},${gy+6} L${cx-4},${gy+14} L${cx+4},${gy+14} Z" fill="#222"/>`+T([cx,gy+48],'앞');
  w=gx+72;hh=gy+60;}
 return svg(w,hh,s,opt.label||'위에서 본 모양과 각 자리에 쌓은 쌓기나무 수',opt.mw||220);}
// 비스듬히 본 입체 그림(앞면·오른쪽 면·윗면이 보임). hm[d][x]: d=0이 앞줄
function iso(hm){const s0=40,dx=20,dy=17,ox=14,D=hm.length,X=hm[0].length,top=Math.max(...hm.flat()),base=top*s0+D*dy+14;
 const S=solid(hm),has=(d,x,z)=>S.has(K(d,x,z)),Pt=(x,d,z)=>[ox+x*s0+d*dx,base-z*s0-d*dy];
 const face=(pts,fill)=>`<path d="M${pts.map(P).join(' L')} Z" fill="${fill}" stroke="#222" stroke-width="1.2" stroke-linejoin="round"/>`;
 let s='';
 for(let d=D-1;d>=0;d--)for(let x=0;x<X;x++)for(let z=0;z<hm[d][x];z++){
  if(!has(d-1,x,z))s+=face([Pt(x,d,z),Pt(x+1,d,z),Pt(x+1,d,z+1),Pt(x,d,z+1)],'#fff');
  if(!has(d,x+1,z))s+=face([Pt(x+1,d,z),Pt(x+1,d+1,z),Pt(x+1,d+1,z+1),Pt(x+1,d,z+1)],'#e4e4e4');
  if(!has(d,x,z+1))s+=face([Pt(x,d,z+1),Pt(x+1,d,z+1),Pt(x+1,d+1,z+1),Pt(x,d+1,z+1)],'#f3f3f3');}
 return svg(ox+X*s0+D*dx+14,base+14,s,'쌓기나무를 쌓은 입체 모양',260);}
// 한 층 도형 (1)(2)(3) 그림
function borderGrid(k){const n=2*k+1;return Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>(i===0||j===0||i===n-1||j===n-1)?1:((i+j)%2)));}
function figBorder(){const c=19,gap=20,tops=[3,5,7];let x=8,s='';const H=7*c,y0=8;
 tops.forEach((m,idx)=>{const g=borderGrid(idx+1),yy=y0+(H-m*c)/2;
  g.forEach((row,i)=>row.forEach((v,j)=>{s+=`<rect x="${x+j*c}" y="${yy+i*c}" width="${c}" height="${c}" fill="#fff" stroke="#222" stroke-width="1"/>`+T([x+j*c+c/2,yy+i*c+c/2+1],v,'middle',13);}));
  s+=T([x+m*c/2,y0+H+18],`(${idx+1})`,'middle',13);x+=m*c+gap;});
 s+=T([x+6,y0+H/2],'…','middle',16);
 return svg(x+22,y0+H+30,s,'규칙에 따라 만든 도형 (1), (2), (3)을 위에서 본 모양',380);}

// ---------- 문항 ----------
const ITEMS={};

// 6-2-u2-e2-example-4
ITEMS['6-2-u2-e2-example-4']={key:'source62U2E2Example4',resultContract:'single-value',pool:[[13.2,9.6,131.1],[12.6,8.2,109.2],[14.4,10.2,152.52]].map(([a,b,S])=>{
 const h=S*2/(a+b),A1=a*h/2,A2=b*h/2,ans=A1/2+A2/2-A2;
 return {prompt:`<p>사다리꼴 ㄱㄴㄷㄹ의 넓이는 ${S} cm²입니다. 선분 ㄹㅁ과 선분 ㅁㄴ의 길이가 같을 때, 색칠한 부분의 넓이는 몇 cm²인지 구해 보세요.</p>`+figTrap(a,b,h),
  answer:`${n(ans)} cm²`,
  solution:ol([`(윗변)+(아랫변)=${a}+${b}=${n(a+b)}(cm)이므로 사다리꼴의 높이 ㄱㄴ은 ${S}×2÷${n(a+b)}=${n(h)}(cm)입니다.`,
   `삼각형 ㄱㄴㄹ의 넓이는 ${a}×${n(h)}÷2=${n(A1)}(cm²)입니다. ㅁ은 선분 ㄴㄹ의 가운데 점이므로 삼각형 ㄱㄴㅁ의 넓이는 그 절반인 ${n(A1/2)} cm²입니다.`,
   `삼각형 ㄴㄷㄹ의 넓이는 ${b}×${n(h)}÷2=${n(A2)}(cm²)이므로 삼각형 ㅁㄴㄷ의 넓이는 그 절반인 ${n(A2/2)} cm²입니다.`,
   `사각형 ㄱㄴㄷㅁ의 넓이는 ${n(A1/2)}+${n(A2/2)}=${n(A1/2+A2/2)}(cm²)이고, 여기에서 삼각형 ㄱㄴㄷ의 넓이 ${b}×${n(h)}÷2=${n(A2)}(cm²)를 빼면 색칠한 삼각형 ㄱㅁㄷ의 넓이가 됩니다.`,
   `따라서 색칠한 부분의 넓이는 ${n(A1/2+A2/2)}−${n(A2)}=${n(ans)}(cm²)입니다.`])};})};

// 6-2-u2-e2-mission-3
ITEMS['6-2-u2-e2-mission-3']={key:'source62U2E2Mission3',resultContract:'single-value',pool:[[3.9,1.25,9.36],[4.2,1.25,11.76],[3.4,1.6,8.84]].map(([h,r,S])=>{
 const base=S*2/h,Tr=S/r,md=Tr*2/h,ans=base-md;
 return {prompt:`<p>다음 그림에서 삼각형 ㄱㄴㄷ의 넓이는 삼각형 ㄹㅁㄷ의 넓이의 ${r}배입니다. 삼각형 ㄱㄴㄷ의 넓이가 ${S} cm²일 때, 선분 ㄴㅁ의 길이는 몇 cm인지 구해 보세요.</p>`+figRect(h,base,ans),
  answer:`${n(ans)} cm`,
  solution:ol([`삼각형 ㄱㄴㄷ의 밑변을 ㄴㄷ으로 보면 높이는 ㄱㄴ=${h} cm이므로 ㄴㄷ=${S}×2÷${h}=${n(base)}(cm)입니다.`,
   `삼각형 ㄹㅁㄷ의 넓이는 ${S}÷${r}=${n(Tr)}(cm²)입니다.`,
   `사각형 ㄱㄴㄷㄹ은 네 각이 모두 직각이므로 ㄹㄷ=ㄱㄴ=${h} cm이고, 삼각형 ㄹㅁㄷ의 밑변 ㅁㄷ=${n(Tr)}×2÷${h}=${n(md)}(cm)입니다.`,
   `따라서 ㄴㅁ=ㄴㄷ−ㅁㄷ=${n(base)}−${n(md)}=${n(ans)}(cm)입니다.`])};})};

// 6-2-u2-e3-exploration-3
ITEMS['6-2-u2-e3-exploration-3']={key:'source62U2E3Exploration3',resultContract:'single-value',pool:[
 ['27.72','30.7','277.2','307','0.902','2','버림','0.90'],['18.43','24.6','184.3','246','0.749','9','올림','0.75'],['31.25','37.4','312.5','374','0.835','5','올림','0.84']].map(([a,b,a2,b2,q3,d3,way,ans])=>({
 prompt:`<p>다음 나눗셈의 몫을 반올림하여 소수 둘째 자리까지 나타내어 보세요.</p>`+C(`${a} ÷ ${b}`),
 answer:ans,
 solution:ol([`나누는 수가 자연수가 되도록 두 수의 소수점을 똑같이 오른쪽으로 한 자리씩 옮기면 ${a2}÷${b2}입니다.`,
  `몫을 소수 셋째 자리까지 구하면 ${q3}…입니다. 나누어지는 수가 나누는 수보다 작으므로 몫은 1보다 작습니다.`,
  `소수 셋째 자리 숫자가 ${d3}이므로 ${way}하여 소수 둘째 자리까지 나타내면 ${ans}입니다. 소수 둘째 자리까지 나타내므로 끝의 숫자도 씁니다.`])}))};

// 6-2-u2-e3-example-3
ITEMS['6-2-u2-e3-example-3']={key:'source62U2E3Example3',resultContract:'single-value',answerAssumption:'□는 0이 아닌 같은 수로 봅니다.',pool:[
 [['3.2','5.6','1.76'],'5.6','1.76','9.856','3.181','1','버림','3.18'],[['2.8','6.3','1.32'],'6.3','1.32','8.316','4.772','2','버림','4.77'],[['4.5','7.4','2.6'],'7.4','2.6','19.24','2.846','6','올림','2.85']].map(([ds,big,small,prod,q3,d3,way,ans])=>({
 prompt:`<p>다음에서 □는 모두 같은 수일 때, 가장 큰 몫은 가장 작은 몫의 약 몇 배인지 반올림하여 소수 둘째 자리까지 나타내어 보세요.</p>`+C(ds.map(d=>`□ ÷ ${d}`).join(',&nbsp;&nbsp; '))+`<p>※ 조건 보충: □는 0이 아닌 수입니다.</p>`,
 answer:`${ans}배`,
 solution:ol([`같은 수를 나눌 때에는 나누는 수가 작을수록 몫이 큽니다. 가장 큰 몫은 □÷${small}, 가장 작은 몫은 □÷${big}입니다.`,
  `예를 들어 □에 ${big}×${small}=${prod}를 넣으면 가장 큰 몫은 ${prod}÷${small}=${big}, 가장 작은 몫은 ${prod}÷${big}=${small}입니다. □가 0이 아닌 다른 수여도 두 몫은 같은 배수만큼 함께 커지거나 작아지므로 몇 배인지는 변하지 않습니다.`,
  `${big}÷${small}=${q3}…이고 소수 셋째 자리 숫자가 ${d3}이므로 ${way}하면 약 ${ans}배입니다.`])}))};

// 6-2-u2-e3-mission-5
ITEMS['6-2-u2-e3-mission-5']={key:'source62U2E3Mission5',resultContract:'single-value',answerAssumption:'소수 두 자리 수는 소수 둘째 자리 숫자가 0이 아닌 수로 봅니다(끝자리가 0인 수는 소수 한 자리 수).',pool:[
 ['48.21','6.4','6.3','7.532','7.652','7.54','7.65','7.53','6.402','6.5','6.393','6.301','7.66','6.293',12,'7.60','7.6',11],
 ['37.45','5.2','5.1','7.201','7.343','7.21','7.34','7.2','5.201','5.3','5.194','5.102','7.35','5.095',14,'7.30','7.3',13],
 ['52.68','8.3','8.2','6.346','6.424','6.35','6.42','6.34','8.309','8.4','8.296','8.205','6.43','8.192',8,'6.40','6.4',7]].map(([a,t,t1,lo,hi,f,l,fm,qfm,cfm,qf,ql,lp,qlp,all,z0,z1,ans])=>({
 prompt:`<p>${a}÷㉠의 몫을 올림하여 소수 첫째 자리까지 나타낸 수는 ${t}입니다. ㉠이 소수 두 자리 수일 때, ㉠이 될 수 있는 수는 모두 몇 개인가요?</p><p>※ 조건 보충: 소수 두 자리 수는 소수 둘째 자리 숫자가 0이 아닌 수로 봅니다. (${z0}=${z1}이므로 소수 한 자리 수로 봅니다.)</p>`,
 answer:`${ans}개`,
 solution:ol([`올림하여 소수 첫째 자리까지 나타낸 수가 ${t}일 때 몫은 ${t1}보다 크고 ${t}보다 작거나 같아야 합니다.`,
  `몫이 ${t}일 때 ㉠=${a}÷${t}=${lo}…, 몫이 ${t1}일 때 ㉠=${a}÷${t1}=${hi}…입니다. 나누는 수가 클수록 몫이 작으므로 ㉠은 ${lo}…보다 크거나 같고 ${hi}…보다 작아야 합니다.`,
  `이 범위에 드는 소수 두 자리 수는 ${f}부터 ${l}까지입니다. 확인하면 ${a}÷${fm}=${qfm}…(올림하면 ${cfm}), ${a}÷${f}=${qf}…(올림하면 ${t}), ${a}÷${l}=${ql}…(올림하면 ${t}), ${a}÷${lp}=${qlp}…(올림하면 ${t1})입니다.`,
  `${f}부터 ${l}까지 0.01 간격의 수는 ${all}개이고, 이 중 ${z0}은 소수 한 자리 수 ${z1}이므로 빼면 ${ans}개입니다.`])}))};

// 6-2-u2-e4-example-4
ITEMS['6-2-u2-e4-example-4']={key:'source62U2E4Example4',resultContract:'single-value',pool:[[2.93,3.7,0.16,3.75],[3.84,2.6,0.27,2.67],[1.67,4.2,0.11,4.26]].map(([d,q,r,q2])=>{
 const num=d*q+r,ans=num-d*q2;
 return {prompt:`<p>어떤 소수를 ${d}${ro(d)} 나누었더니 몫이 ${q}이고 나머지가 ${r}이었습니다. 이 소수를 ${d}${ro(d)} 계속 나누어 그 몫을 소수 둘째 자리까지 구하였을 때의 나머지는 얼마인가요?</p>`,
  answer:n(ans),
  solution:ol([`어떤 소수는 ${d}×${q}+${r}=${n(d*q)}+${r}=${n(num)}입니다.`,
   `${n(num)}÷${d}의 몫을 소수 둘째 자리까지 구하면 ${q2}입니다. ${d}×${q2}=${n(d*q2)}이고 ${d}×${n(q2+0.01)}=${n(d*(q2+0.01))}로 ${n(num)}보다 크기 때문입니다.`,
   `따라서 나머지는 ${n(num)}−${n(d*q2)}=${n(ans)}입니다.`])};})};

// 6-2-u3-e2-mission-3
ITEMS['6-2-u3-e2-mission-3']={key:'source62U3E2Mission3',resultContract:'single-value',answerAssumption:'테두리 칸은 모두 1, 안쪽은 1과 0이 번갈아 놓이고 안쪽 네 귀퉁이는 0이며, 빈 칸을 둘러싼 옆면도 보이는 면에 넣습니다.',pool:[10,8,12].map(k=>{
 const nn=2*k+1,bd=4*(nn-1),m=2*k-1,ones=(m*m-1)/2,zeros=(m*m+1)/2,cubes=bd+ones,edge=k-1,cont=bd+4*edge,sides=4*cubes-2*cont,vis=cubes+sides;
 return {prompt:`<p>한 모서리가 1 cm인 쌓기나무를 어떤 규칙에 따라 쌓아서 도형을 만듭니다. 다음 그림은 이 규칙에 따라 만든 도형을 위에서 본 그림에서 각각의 위치에 놓인 쌓기나무의 개수를 나타낸 것입니다. 도형 (${k})에 있는 쌓기나무의 수를 ㉠개, 도형 (${k})에서 보이는 면의 넓이를 ㉡ cm²라고 할 때, ㉡−㉠의 값을 구하시오. (단, 밑면은 보이지 않습니다.)</p>`+figBorder(),
  answer:String(vis-cubes),
  solution:ol([`풀이 기준: 그림 (1), (2), (3)에서 찾은 규칙은 도형의 번호가 1씩 커질 때마다 가로와 세로가 2칸씩 늘어나고, 가장 바깥 테두리 칸은 모두 1, 그 안쪽은 1과 0이 번갈아 놓이며 안쪽 네 귀퉁이 칸은 0인 것입니다. 0인 칸(빈 곳)을 둘러싼 쌓기나무의 옆면도 보이는 면에 넣습니다.`,
   `도형 (${k})의 가로와 세로는 각각 ${nn}칸입니다. 테두리에 놓인 쌓기나무는 ${nn}×4−4=${bd}개입니다.`,
   `테두리 안쪽은 가로와 세로가 ${m}칸이므로 ${m}×${m}=${m*m}칸이고, 귀퉁이가 0이므로 0인 칸이 1인 칸보다 1개 많습니다. 1인 칸은 (${m*m}−1)÷2=${ones}개, 0인 칸은 ${zeros}개입니다.`,
   `따라서 ㉠=${bd}+${ones}=${cubes}이고, 위에서 보이는 윗면의 넓이는 ${cubes} cm²입니다.`,
   `쌓기나무 한 개의 옆면은 4개이므로 옆면은 모두 ${cubes}×4=${cubes*4}개입니다. 테두리끼리 맞닿은 곳은 ${bd}군데이고, 안쪽의 1인 칸끼리는 서로 맞닿지 않으며, 안쪽의 1인 칸이 테두리와 맞닿은 곳은 한 변마다 ${edge}군데씩 ${4*edge}군데입니다.`,
   `맞닿은 곳은 모두 ${bd}+${4*edge}=${cont}군데이고 한 곳마다 옆면이 2개씩 가려지므로 보이는 옆면은 ${cubes*4}−${cont}×2=${sides}개, 넓이는 ${sides} cm²입니다.`,
   `㉡=${cubes}+${sides}=${vis}이므로 ㉡−㉠=${vis}−${cubes}=${vis-cubes}입니다.`])};})};

// 칠한 면 수 표 문항 공통 풀이
function histSolution(hm,first){const p=paint(hm);
 return {p,sol:ol([first,`바닥면까지 모든 겉면을 칠했으므로 쌓기나무마다 다른 쌓기나무와 맞닿지 않은 면이 색칠됩니다. 아래층부터 층별로 세어 봅니다.`,
  ...p.layers.map((L,z)=>`${z+1}층 쌓기나무 ${L.reduce((a,b)=>a+b,0)}개: ${layerText(L)}`),
  `색칠된 면의 수가 같은 것끼리 모으면 ${histText(p.all)}이고, 모두 더하면 ${p.N}개로 전체 쌓기나무 수와 같습니다.`])};}
const sumExpr=hm=>hm.flat().filter(h=>h).join('+');

// 6-2-u3-e3-exploration
ITEMS['6-2-u3-e3-exploration']={key:'source62U3E3Exploration',resultContract:'multi-value',answerAssumption:'쌓기나무는 바닥부터 빈틈없이 쌓였고, 보이지 않는 곳에 숨은 쌓기나무나 빈 곳은 없습니다.',pool:[
 [[4,3,0,0],[4,3,2,1],[4,3,2,2],[4,4,4,4]],[[4,3,0,0],[4,3,2,1],[4,3,3,2],[4,4,4,4]],[[4,2,0,0],[4,3,2,1],[4,3,2,2],[4,4,4,3]]].map(hm=>{
 const rows=['앞줄','둘째 줄','셋째 줄','뒷줄'],tot=hm.flat().reduce((a,b)=>a+b,0);
 const {p,sol}=histSolution(hm,`풀이 기준: 쌓기나무는 바닥부터 빈틈없이 쌓았고, 그림에서 보이지 않는 곳에 숨은 쌓기나무나 빈 곳은 없으며, 각 자리의 높이는 그림에 보이는 윗면의 높이와 같다고 봅니다. 그림에서 각 자리의 높이를 왼쪽부터 읽으면 ${hm.map((r,i)=>`${rows[i]}은 ${r.join(', ')}`).join(', ')}입니다. 쌓기나무는 모두 ${tot}개입니다.`);
 return {prompt:`<p>쌓기나무를 다음 그림과 같이 쌓은 후, 바닥면을 포함한 모든 겉면에 색칠을 하였습니다. 색칠된 면의 수가 같은 쌓기나무들은 각각 몇 개인지 다음 표의 각 칸에 알맞은 수를 써넣으세요.</p>`+iso(hm)+answerTable(),
  answer:histText(p.all),solution:sol};})};

// 6-2-u3-e3-example-1
ITEMS['6-2-u3-e3-example-1']={key:'source62U3E3Example1',resultContract:'multi-value',pool:[
 [[0,5,0,0],[0,3,0,0],[3,3,3,3],[0,2,2,2],[0,2,0,2]],[[0,4,0,0],[0,3,0,0],[3,2,3,2],[0,2,2,2],[0,2,0,2]],[[0,5,0,0],[0,4,0,0],[2,3,3,3],[0,2,2,2],[0,3,0,2]]].map(hm=>{
 const {p,sol}=histSolution(hm,`위에서 본 모양의 수를 모두 더하면 ${sumExpr(hm)}=${hm.flat().reduce((a,b)=>a+b,0)}(개)입니다.`);
 return {prompt:`<p>다음 그림은 쌓기나무로 쌓은 모양을 위에서 본 모양이고, □ 안의 수는 그곳에 쌓아 올린 쌓기나무의 수입니다. 이 쌓기나무 모양의 바닥면을 포함한 모든 겉면에 페인트를 칠했을 때, 색칠된 면의 수가 같은 쌓기나무들은 각각 몇 개인지 다음 표의 각 칸에 알맞은 수를 써넣으세요.</p>`+hgrid(hm,{mw:180})+answerTable(),
  answer:histText(p.all),solution:sol};})};

// 6-2-u3-e3-mission-1
ITEMS['6-2-u3-e3-mission-1']={key:'source62U3E3Mission1',resultContract:'single-value',pool:[4,5,6].map(e=>({
 prompt:`<p>쌓기나무 ${e*e*e}개로 정육면체 모양을 만든 후 바닥면을 포함한 모든 겉면에 파란색 페인트를 칠하였습니다. 이것을 다시 모두 떼어 놓았다면, 쌓기나무 중 어느 면에도 파란색 페인트가 칠해지지 않은 것은 모두 몇 개인가요?</p>`,
 answer:`${(e-2)**3}개`,
 solution:ol([`${e}×${e}×${e}=${e*e*e}이므로 한 모서리에 쌓기나무가 ${e}개씩 놓인 정육면체입니다.`,
  `바닥면까지 모든 겉면을 칠했으므로 겉에 드러난 쌓기나무는 모두 한 면 이상 칠해집니다.`,
  `칠해지지 않은 쌓기나무는 겉 한 겹을 뺀 안쪽의 정육면체로, 한 모서리에 ${e}−2=${e-2}개씩 놓여 있습니다.`,
  `따라서 ${e-2}×${e-2}×${e-2}=${(e-2)**3}(개)입니다.`])}))};

// 6-2-u3-e3-mission-2
ITEMS['6-2-u3-e3-mission-2']={key:'source62U3E3Mission2',resultContract:'multi-value',pool:[
 [[0,2,3],[1,2,1],[2,0,2]],[[0,3,2],[1,2,1],[2,0,3]],[[0,2,3],[2,1,2],[3,0,1]]].map(hm=>{
 const {p,sol}=histSolution(hm,`위에서 본 모양의 수를 모두 더하면 ${sumExpr(hm)}=${hm.flat().reduce((a,b)=>a+b,0)}(개)입니다.`);
 return {prompt:`<p>다음 그림은 쌓기나무를 쌓아 만든 모양을 위에서 본 모양으로, 각 칸의 숫자는 그 칸에 쌓아 올린 쌓기나무의 개수입니다. 이 쌓기나무 모양의 바닥면을 포함한 모든 겉면에 페인트를 칠했을 때, 색칠된 면의 수가 같은 쌓기나무들은 각각 몇 개인지 다음 표의 각 칸에 알맞은 수를 써넣으세요.</p>`+hgrid(hm,{mw:160})+answerTable(),
  answer:histText(p.all),solution:sol};})};

// 6-2-u3-e3-mission-4
ITEMS['6-2-u3-e3-mission-4']={key:'source62U3E3Mission4',resultContract:'single-value',pool:[
 [[[3,2,0],[2,1,0],[3,2,1]],3],[[[2,3,0],[1,2,0],[3,2,2]],2],[[[3,3,0],[2,1,0],[2,2,1]],4]].map(([hm,e])=>{
 const N=hm.flat().reduce((a,b)=>a+b,0),{v,s}=contacts(hm),faces=6*N-2*(v+s);
 return {prompt:`<p>쌓기나무로 쌓은 모양의 모든 겉면에 페인트를 칠했습니다. 다음은 쌓기나무로 쌓은 모양을 위에서 본 모양에 수를 쓴 것입니다. 쌓기나무의 한 모서리의 길이가 ${e} cm일 때 페인트를 칠한 면의 넓이는 모두 몇 cm²인지 구해 보세요. (단, 바닥에 닿는 면도 색칠합니다.)</p>`+hgrid(hm,{dirs:true,y0:42,mw:220}),
  answer:`${faces*e*e} cm²`,
  solution:ol([`위에서 본 모양의 수를 모두 더하면 쌓기나무는 ${sumExpr(hm)}=${N}(개)이고, 면은 모두 ${N}×6=${6*N}개입니다.`,
   `위아래로 맞닿은 곳은 각 자리에서 (쌓은 수−1)군데씩 모두 ${v}군데이고, 옆으로 이웃한 두 자리는 낮은 쪽 높이만큼 맞닿으므로 모두 ${s}군데입니다.`,
   `맞닿은 곳 ${v+s}군데마다 면이 2개씩 가려지므로 칠한 면은 ${6*N}−${v+s}×2=${faces}(개)입니다.`,
   `쌓기나무 한 면의 넓이는 ${e}×${e}=${e*e}(cm²)이므로 칠한 면의 넓이는 ${faces}×${e*e}=${faces*e*e}(cm²)입니다.`])};})};

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
