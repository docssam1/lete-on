// 황소 6-1 4단원(비와 비율)·5단원(여러 가지 그래프)·6단원(직육면체의 부피와 겉넓이) 잠금 원문 구조 유형.
// 각 문항은 같은 구조·다른 수의 검증된 3문항 풀입니다. 0번 풀은 원문 수와 조건을 그대로 씁니다.
(function(root){'use strict';
const GROUP='6-1-u456';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;

// ---------- 공통 도우미 ----------
const S='stroke:#222;stroke-width:1.4px';
const DIM='fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3';
const TICK='stroke:#55524d;stroke-width:1px';
const f=v=>{const s=(Math.round(v*10)/10).toFixed(1);return s.endsWith('.0')?s.slice(0,-2):s;};
const svg=(w,h,label,body)=>`<svg viewBox="0 0 ${w} ${h}" style="width:100%;max-width:360px;height:auto;display:block;margin:8px auto;font-family:inherit" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const T=(x,y,t,a,sz,extra)=>`<text x="${f(x)}" y="${f(y)}" text-anchor="${a||'middle'}" font-size="${sz||13}" fill="#222" style="font-family:inherit"${extra||''}>${t}</text>`;
const line=(x1,y1,x2,y2,st)=>`<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" style="${st||S}"/>`;
const poly=(pts,fill,st)=>`<polygon points="${pts.map(p=>f(p[0])+','+f(p[1])).join(' ')}" style="fill:${fill};${st||'stroke:#222;stroke-width:1.2px;stroke-linejoin:round'}"/>`;
const rect=(x,y,w,h,st)=>`<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" style="${st}"/>`;
const circ=(x,y,r,st)=>`<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" style="${st}"/>`;
// 두 점 사이 점선 치수선(끝 눈금 포함)
function dim(x1,y1,x2,y2){const L=Math.hypot(x2-x1,y2-y1),nx=-(y2-y1)/L*4,ny=(x2-x1)/L*4;
 return line(x1,y1,x2,y2,DIM)+line(x1-nx,y1-ny,x1+nx,y1+ny,TICK)+line(x2-nx,y2-ny,x2+nx,y2+ny,TICK);}
const labelBg=(x,y,t,a,sz)=>{const w=t.length*(sz||13)*0.62+6,x0=a==='end'?x-w+3:a==='start'?x-3:x-w/2;return rect(x0,y-(sz||13)+1,w,(sz||13)+5,'fill:#fff;stroke:none')+T(x,y,t,a,sz);};
const ga=nm=>{const c=nm.charCodeAt(nm.length-1)-0xAC00;return nm+(c>=0&&c%28?'이가':'가');};
const P=a=>a.map(x=>x.startsWith('<')?x:'<p>'+x+'</p>').join('');
const ol=a=>'<ol>'+a.map(x=>'<li>'+x+'</li>').join('')+'</ol>';
const TB='border-collapse:collapse;margin:8px auto;font-size:14px;text-align:center';
const TD='border:1px solid #888;padding:4px 8px';
function table(rows,headCols){return `<table style="${TB}">`+rows.map((r,ri)=>'<tr>'+r.map((c,ci)=>{const h=(ri===0&&headCols==='row')||(ci===0&&headCols==='col')||(headCols==='both'&&(ri===0||ci===0));return h?`<th style="${TD};background:#f1efe9;font-weight:600">${c}</th>`:`<td style="${TD}">${c}</td>`;}).join('')+'</tr>').join('')+'</table>';}

// ================= 4단원 개념탐구 1 =================
function jegiItem(){return {key:'source61U4E1Exploration1',resultContract:'explanation',answerVisualRequired:false,pool:[
  [16,10,'6','1.6'],[18,12,'6','1.5'],[15,12,'3','1.25']].map(([a,b,dif,times])=>({
  prompt:P([`형규와 동빈이가 제기차기를 했습니다. 형규는 ${a}번, 동빈이는 ${b}번을 찼습니다. 두 사람의 제기차기 횟수를 여러 가지 방법으로 비교해 보세요.`]),
  answer:`뺄셈: 형규가 ${a} − ${b} = ${dif}(번) 더 많이 찼습니다. 나눗셈: 형규는 동빈이의 ${a} ÷ ${b} = ${times}(배)만큼 찼습니다. 비: 형규와 동빈이의 횟수의 비는 ${a} : ${b}입니다.`,
  solution:ol([`뺄셈으로 비교하면 ${a} − ${b} = ${dif}이므로 형규가 동빈이보다 ${dif}번 더 많이 찼습니다.`,
   `나눗셈으로 비교하면 ${a} ÷ ${b} = ${times}이므로 형규는 동빈이가 찬 횟수의 ${times}배만큼 찼습니다.`,
   `동빈이의 횟수를 기준으로 하여 비로 나타내면 (형규의 횟수) : (동빈이의 횟수) = ${a} : ${b}이고, 비율은 ${ff(a,b)} = ${times}입니다.`,
   `뺄셈은 두 수의 차이를, 나눗셈과 비는 한 양이 다른 양의 몇 배인지를 알려 줍니다. 어느 방법으로 비교해도 형규가 더 많이 찼습니다.`])}))};}

function saltItem(){return {key:'source61U4E1Exploration2',resultContract:'explanation',answerVisualRequired:false,pool:[
  // [동수 물, 동수 소금, 철수 물, 철수 소금, 동수 기약(분자,분모), 철수 기약, 통분 분모, 통분 분자들, 더 짠 사람]
  [350,20,416,24,[2,35],[3,52],1820,[104,105],'철수'],
  [300,25,380,30,[1,12],[3,38],228,[19,18],'동수'],
  [240,18,330,26,[3,40],[13,165],1320,[99,104],'철수']].map(([w1,s1,w2,s2,r1,r2,L,nn,who])=>{
  return {
  prompt:P([`동수는 물 ${w1} g에 소금 ${s1} g을 넣어 소금물을 만들었고, 철수는 물 ${w2} g에 소금 ${s2} g을 넣어 소금물을 만들었습니다. 누가 만든 소금물이 더 짠지 비교하는 방법을 찾아 설명해 보세요.`]),
  answer:`물의 양에 대한 소금의 양의 비율로 비교합니다. 동수는 ${ff(s1,w1)} = ${ff(r1[0],r1[1])}, 철수는 ${ff(s2,w2)} = ${ff(r2[0],r2[1])}이고, 통분하여 비교하면 ${who}의 비율이 더 크므로 ${who}가 만든 소금물이 더 짭니다.`,
  solution:ol([`물과 소금의 양이 모두 다르므로 소금의 양만 보고 비교할 수 없습니다. 물의 양을 기준량, 소금의 양을 비교하는 양으로 하는 비율을 구해 비교합니다.`,
   `동수: (소금의 양) : (물의 양) = ${s1} : ${w1}이므로 비율은 ${ff(s1,w1)} = ${ff(r1[0],r1[1])}입니다.`,
   `철수: (소금의 양) : (물의 양) = ${s2} : ${w2}이므로 비율은 ${ff(s2,w2)} = ${ff(r2[0],r2[1])}입니다.`,
   `두 분수를 분모 ${L}로 통분하면 동수는 ${ff(nn[0],L)}, 철수는 ${ff(nn[1],L)}이므로 ${who}의 비율이 더 큽니다.`,
   `같은 양의 물에 소금이 더 많이 녹아 있는 셈이므로 ${who}가 만든 소금물이 더 짭니다. (소금물 전체의 양에 대한 소금의 양의 비율 ${ff(s1,w1+s1)}, ${ff(s2,w2+s2)}로 비교해도 결과는 같습니다.)`])};})};}

// ================= 5단원 개념탐구 1 (그림그래프) =================
const REGIONS=['서울·인천·경기','대전·세종·충청','광주·전라','강원','대구·부산·울산·경상','제주'];
const ball=(x,y,r)=>circ(x,y,r,'fill:#fff;stroke:#222;stroke-width:1.2px')+`<path d="M${f(x-r*0.35)} ${f(y-r*0.85)}Q${f(x+r*0.15)} ${f(y)} ${f(x-r*0.35)} ${f(y+r*0.85)}M${f(x+r*0.35)} ${f(y-r*0.85)}Q${f(x-r*0.15)} ${f(y)} ${f(x+r*0.35)} ${f(y+r*0.85)}" style="fill:none;stroke:#b33;stroke-width:0.9px"/>`;
// 권역별 그림그래프: 지도 위치처럼 2열로 배치(왼쪽: 서울·충청·전라, 오른쪽: 강원·경상·제주)
function clubGraphSvg(icons){const cells=[[0,0,0],[1,0,1],[2,0,2],[3,1,0],[4,1,1],[5,1,2]];let b=T(180,16,'권역별 야구 동호회 수','middle',13);
 for(const [k,c,r] of cells){const x=8+c*174,y=26+r*62;b+=rect(x,y,170,58,'fill:#fafaf7;stroke:#888;stroke-width:1px')+T(x+6,y+16,REGIONS[k],'start',12);
  let cx=x+16;const [big,small]=icons[k];for(let i=0;i<big;i++){b+=ball(cx,y+38,11);cx+=25;}for(let i=0;i<small;i++){b+=ball(cx-4,y+40,6.5);cx+=16;}}
 b+=ball(236,224,11)+T(252,229,'1000개','start',12)+ball(306,224,6.5)+T(317,229,'100개','start',12);
 return svg(360,240,'권역별 야구 동호회 수 그림그래프',b);}
const clubTable=v=>table([['권역','수(개)'],...REGIONS.map((r,i)=>[r,String(v[i])])],'row');
const up100=n=>Math.ceil(n/100)*100, rnd100=n=>Math.round(n/100)*100;
const CLUB=[[3130,481,594,289,776,75],[2240,615,532,307,1048,92],[2530,356,712,248,663,41]];
const iconsOf=v=>v.map(n=>[Math.floor(up100(n)/1000),(up100(n)%1000)/100]);
function clubExplainItem(){return {key:'source61U5E1Exploration1',resultContract:'explanation',answerVisualRequired:false,pool:CLUB.map(v=>{
  const k=v.findIndex(n=>up100(n)!==rnd100(n)),ic=iconsOf(v);
  return {
  prompt:P([`다음은 우리나라 권역별 야구 동호회 수를 표와 그림그래프로 나타낸 것입니다. 권역별 야구 동호회 수를 그림그래프로 나타낼 때, 백의 자리까지 나타내기 위해 어떻게 했는지 써 보세요.`,clubTable(v),clubGraphSvg(ic)]),
  answer:`백의 자리 아래 수를 올림하여 백의 자리까지 나타냈습니다. 예를 들어 ${REGIONS[k]}의 ${v[k]}개를 ${up100(v[k])}개로 나타냈습니다.`,
  solution:ol([`그림그래프에서 큰 그림은 1000개, 작은 그림은 100개를 나타냅니다. 그림을 세어 권역별 수를 읽으면 ${REGIONS.map((r,i)=>`${r} ${up100(v[i])}개`).join(', ')}입니다.`,
   `표의 수와 비교해 보면 ${REGIONS[k]}는 ${v[k]}개인데 그림그래프에는 ${up100(v[k])}개로 나타나 있습니다. 반올림했다면 ${rnd100(v[k])}개가 되어야 하므로 반올림한 것이 아닙니다.`,
   `다른 권역도 ${v.map((n,i)=>`${n} → ${up100(n)}`).join(', ')}처럼 모두 백의 자리 아래 수를 올림한 수와 같습니다.`,
   `따라서 백의 자리 아래 수를 올림하여 백의 자리까지 나타낸 뒤, 천의 자리 수만큼 큰 그림을, 백의 자리 수만큼 작은 그림을 그렸습니다.`])};})};}
function clubCompareItem(){return {key:'source61U5E1Exploration2',resultContract:'explanation',answerVisualRequired:false,pool:CLUB.map(v=>{
  const ic=iconsOf(v);
  return {
  prompt:P([`다음은 우리나라 권역별 야구 동호회 수를 표와 그림그래프로 나타낸 것입니다. 자료를 표로 나타냈을 때와 그림그래프로 나타냈을 때 어떤 차이점이 있는지 써 보세요.`,clubTable(v),clubGraphSvg(ic)]),
  answer:`표는 ${v[0]}개처럼 정확한 수를 알 수 있고, 그림그래프는 그림의 크기와 개수로 권역별 많고 적음을 한눈에 비교할 수 있지만 ${up100(v[0])}개처럼 어림한 수만 알 수 있습니다.`,
  solution:ol([`표에는 권역별 동호회 수가 ${REGIONS[0]} ${v[0]}개처럼 정확한 수로 적혀 있어 정확한 수를 바로 알 수 있습니다.`,
   `그림그래프에서는 ${REGIONS[0]}의 수를 큰 그림 ${ic[0][0]}개, 작은 그림 ${ic[0][1]}개, 곧 ${up100(v[0])}개로 읽을 수 있어 어림한 수만 알 수 있습니다.`,
   `대신 그림그래프는 그림의 크기와 개수를 보고 어느 권역에 동호회가 많은지, 적은지를 한눈에 비교할 수 있고, 지역의 위치와 함께 나타낼 수 있습니다.`])};})};}

const AGES=['10대','20대','30대','40대','50대'];
const MOVIE=[[178540,429158,582175,216530,15068],[263480,357920,491305,128640,46215],[145730,512860,384120,297450,23980]];
const r10k=n=>Math.round(n/10000)*10000;
const person=(x,y,r)=>circ(x,y-r*0.45,r*0.42,'fill:#fff;stroke:#222;stroke-width:1.1px')+`<path d="M${f(x-r*0.8)} ${f(y+r*0.9)}Q${f(x-r*0.8)} ${f(y+r*0.05)} ${f(x)} ${f(y+r*0.05)}Q${f(x+r*0.8)} ${f(y+r*0.05)} ${f(x+r*0.8)} ${f(y+r*0.9)}Z" style="fill:#fff;stroke:#222;stroke-width:1.1px"/>`;
function movieGraphSvg(v){let b=T(180,16,'연령대별 관객 수','middle',13);const top=24,rh=34;
 b+=rect(6,top,348,22,'fill:#f1efe9;stroke:#888;stroke-width:1px')+line(64,top,64,top+22+rh*5,'stroke:#888;stroke-width:1px')+T(35,top+16,'연령대','middle',12)+T(209,top+16,'관객 수','middle',12);
 v.forEach((n,i)=>{const y=top+22+i*rh,r=r10k(n),big=Math.floor(r/100000),small=(r%100000)/10000;b+=rect(6,y,348,rh,'fill:none;stroke:#888;stroke-width:1px')+T(35,y+22,AGES[i],'middle',12);
  let x=78;for(let k=0;k<big;k++){b+=person(x,y+16,13);x+=24;}for(let k=0;k<small;k++){b+=person(x-3,y+19,8);x+=16;}});
 const ly=top+22+rh*5+20;b+=person(200,ly-2,13)+T(216,ly+4,'10만 명','start',12)+person(276,ly+1,8)+T(288,ly+4,'1만 명','start',12);
 return svg(360,ly+14,'연령대별 관객 수 그림그래프',b);}
function movieItem(){const asm='천의 자리에서 반올림하여 만의 자리까지 나타내고, 큰 그림은 10만 명, 작은 그림은 1만 명을 나타내도록 그립니다.';
 return {key:'source61U5E1Exploration3',resultContract:'drawing',answerVisualRequired:true,answerAssumption:asm,pool:MOVIE.map(v=>({
  prompt:P([`다음 표는 어느 영화의 연령대별 관객 수를 조사하여 나타낸 것입니다. 적당한 자리에서 관객 수를 반올림한 뒤 그림그래프를 그려 보세요.`,
   table([['연령대',...AGES],['관객 수(명)',...v.map(String)],['반올림한 수','','','','','']],'both')]),
  answer:AGES.map((a,i)=>`${a} ${r10k(v[i])}명`).join(', '),
  answerVisual:movieGraphSvg(v),
  solution:`<p>풀이 기준: ${asm}</p>`+ol([`관객 수가 십만 단위이므로 천의 자리에서 반올림하여 만의 자리까지 나타냅니다.`,
   `${AGES.map((a,i)=>`${a}: ${v[i]} → ${r10k(v[i])}`).join(', ')}입니다.`,
   `큰 그림 1개는 10만 명, 작은 그림 1개는 1만 명이므로 ${AGES.map((a,i)=>{const r=r10k(v[i]);return `${a}는 큰 그림 ${Math.floor(r/100000)}개, 작은 그림 ${(r%100000)/10000}개`;}).join(', ')}를 그립니다.`,
   `그림그래프의 제목, 연령대, 그림의 단위(10만 명, 1만 명)를 함께 써 넣습니다.`])}))};}

// ================= 5단원 개념탐구 4 (띠그래프와 원그래프) =================
// 원그래프: 12시 방향부터 시계 방향으로 segs=[[이름,%,채움,보조글]]
function pieSvgPart(cx,cy,r,segs){let a=-90,b='';const rad=d=>d*Math.PI/180;
 for(const [nm,p,fill,sub] of segs){const a2=a+p*3.6,x1=cx+r*Math.cos(rad(a)),y1=cy+r*Math.sin(rad(a)),x2=cx+r*Math.cos(rad(a2)),y2=cy+r*Math.sin(rad(a2));
  b+=`<path d="M${f(cx)} ${f(cy)}L${f(x1)} ${f(y1)}A${r} ${r} 0 ${p>50?1:0} 1 ${f(x2)} ${f(y2)}Z" style="fill:${fill};stroke:#222;stroke-width:1.2px"/>`;
  const m=rad((a+a2)/2),lx=cx+r*0.55*Math.cos(m),ly=cy+r*0.55*Math.sin(m);b+=T(lx,ly+(sub?-2:4),nm,'middle',12)+(sub?T(lx,ly+13,sub,'middle',11):'');a=a2;}
 return b;}
// 띠그래프: rows=[[이름,칸 수,왼쪽 칸 수]], 왼쪽/오른쪽 글자
function barsSvgPart(x0,y0,w,rows,lt,rt){let b='';rows.forEach(([nm,n,k],i)=>{const y=y0+i*58,h=24,xd=x0+w*k/n;
 b+=T(x0,y-5,'0','middle',11)+T(x0+w,y-5,'100(%)','middle',11)+T(x0-6,y+17,nm,'end',13);
 b+=rect(x0,y,w*k/n,h,'fill:#e4e4e4;stroke:none')+rect(xd,y,w*(n-k)/n,h,'fill:#fff;stroke:none');
 for(let t=1;t<n;t++){const x=x0+w*t/n;b+=line(x,y,x,y+6,'stroke:#222;stroke-width:1px');}
 b+=rect(x0,y,w,h,'fill:none;stroke:#222;stroke-width:1.2px')+line(xd,y,xd,y+h,'stroke:#222;stroke-width:1.2px');
 const fs=w*Math.min(k,n-k)/n<44?10.5:12;b+=T(x0+w*k/n/2,y+18,lt,'middle',fs)+T(xd+w*(n-k)/n/2,y+18,rt,'middle',fs);});return b;}
function electionSvg(pieTitle,barTitle,segs,rows,lt,rt){return svg(380,200,pieTitle+' 원그래프와 '+barTitle+' 띠그래프',
 T(72,50,pieTitle,'middle',12)+pieSvgPart(72,124,58,segs)+T(265,14,barTitle,'middle',12)+barsSvgPart(180,40,170,rows,lt,rt));}

// 예제 4-3: 정호·은경·경민, 남/여. 원그래프는 여학생 표(경민→은경→정호, 은경만 % 표시)
const EX3=[
 {n:[13,8,11],m:[7,5,3],p:[22,30,48],B2:600,B3:216},
 {n:[9,7,12],m:[4,4,5],p:[40,25,35],B2:500,B3:375},
 {n:[10,12,7],m:[3,7,2],p:[35,20,45],B2:560,B3:360}];
function exampleElection(){const NM=['정호','은경','경민'];return {key:'source61U5E4Example3',resultContract:'multi-value',answerVisualRequired:false,pool:EX3.map(({n,m,p,B2,B3})=>{
  const u2=B2/m[1],T2=u2*n[1],G2=T2-B2,Gt=G2/p[1]*100,u3=B3/m[2],T3=u3*n[2],G3=T3-B3,G1=Gt-G2-G3,u1=G1/(n[0]-m[0]),T1=u1*n[0];
  const Ts=[T1,T2,T3],w=Ts.indexOf(Math.max(...Ts));
  return {
  prompt:P([`어느 초등학교에서 정호, 은경, 경민 3명의 후보 중에서 학생 회장을 뽑았습니다. 투표는 남학생과 여학생으로 나누어서 했고, 각 후보가 여학생에게 얻은 표의 비율은 아래 원그래프와 같습니다. 또, 그 옆의 띠그래프는 각 후보가 남학생과 여학생에게 얻은 표의 비율을 나타낸 것입니다. 남학생에게 얻은 표는 은경이가 ${B2}표, 경민이가 ${B3}표입니다. 가장 많은 표를 얻은 후보가 학생 회장이 될 때, 당선된 사람은 누구이고 몇 표를 얻었는지 구하세요.`,
   electionSvg('〈여학생에게 얻은 표〉','〈각 후보자가 얻은 표〉',[['경민',p[2],'#ececec',''],['은경',p[1],'#fff',`(${p[1]} %)`],['정호',p[0],'#d9d9d9','']],NM.map((x,i)=>[x,n[i],m[i]]),'남학생','여학생')]),
  answer:`${NM[w]}, ${Ts[w]}표`,
  solution:ol([`띠그래프의 눈금은 띠를 똑같이 나눈 칸입니다. 칸을 세면 정호는 ${n[0]}칸 중 남학생 ${m[0]}칸·여학생 ${n[0]-m[0]}칸, 은경은 ${n[1]}칸 중 남학생 ${m[1]}칸·여학생 ${n[1]-m[1]}칸, 경민은 ${n[2]}칸 중 남학생 ${m[2]}칸·여학생 ${n[2]-m[2]}칸입니다.`,
   `은경: 남학생 표 ${B2}표가 ${m[1]}칸이므로 한 칸은 ${B2} ÷ ${m[1]} = ${u2}(표)입니다. 은경이가 얻은 표는 ${u2} × ${n[1]} = ${T2}(표), 여학생 표는 ${u2} × ${n[1]-m[1]} = ${G2}(표)입니다.`,
   `은경이의 여학생 표 ${G2}표가 여학생 전체 표의 ${p[1]} %이므로 여학생 전체 표는 ${G2} ÷ ${p[1]} × 100 = ${Gt}(표)입니다.`,
   `경민: 한 칸은 ${B3} ÷ ${m[2]} = ${u3}(표)이므로 얻은 표는 ${u3} × ${n[2]} = ${T3}(표), 여학생 표는 ${u3} × ${n[2]-m[2]} = ${G3}(표)입니다.`,
   `정호의 여학생 표는 ${Gt} − ${G2} − ${G3} = ${G1}(표)이고 ${n[0]-m[0]}칸이므로 한 칸은 ${u1}표, 정호가 얻은 표는 ${u1} × ${n[0]} = ${T1}(표)입니다.`,
   `${T1}표, ${T2}표, ${T3}표 중 가장 많은 것은 ${Ts[w]}표이므로 ${ga(NM[w])} ${Ts[w]}표로 당선되었습니다.`])};})};}

// Mission 3: 영수·지혜·동민, ㉮/㉯ 모둠. 원그래프는 ㉮ 모둠 득표율(영수→지혜→동민, 지혜만 % 표시)
const MI3=[
 {n:[13,8,11],m:[6,3,7],p:[40,25,35],B2:200,B3:96},
 {n:[11,9,10],m:[5,4,7],p:[45,20,35],B2:250,B3:150},
 {n:[12,8,13],m:[5,3,8],p:[30,30,40],B2:400,B3:200}];
function missionElection(){const NM=['영수','지혜','동민'];return {key:'source61U5E4Mission3',resultContract:'multi-value',answerVisualRequired:false,pool:MI3.map(({n,m,p,B2,B3})=>{
  const u2=B2/(n[1]-m[1]),T2=u2*n[1],A2=u2*m[1],At=A2/p[1]*100,u3=B3/(n[2]-m[2]),T3=u3*n[2],A3=u3*m[2],A1=At-A2-A3,u1=A1/m[0],T1=u1*n[0];
  const Ts=[T1,T2,T3],w=Ts.indexOf(Math.max(...Ts));
  return {
  prompt:P([`영수, 지혜, 동민 3명의 후보 중에서 학생 회장을 뽑았습니다. 투표는 ㉮, ㉯ 두 모둠으로 나누어서 했고, ㉮ 모둠에서 각 후보가 얻은 표의 비율은 아래 원그래프와 같습니다. 또, 띠그래프는 각 후보별로 ㉮, ㉯ 두 모둠에서 얻은 표의 비율을 나타낸 것입니다. ㉯ 모둠에서 얻은 표는 지혜가 ${B2}표, 동민이가 ${B3}표입니다. 가장 많은 표를 얻은 후보를 학생 회장으로 뽑을 때, 당선된 사람은 누구이고 몇 표를 얻었는지 구하세요. (단, 무효표는 없습니다.)`,
   electionSvg('㉮ 모둠에서의 득표율','후보자별 모둠 득표율',[['영수',p[0],'#d9d9d9',''],['지혜',p[1],'#fff',`(${p[1]} %)`],['동민',p[2],'#ececec','']],NM.map((x,i)=>[x,n[i],m[i]]),'㉮ 모둠','㉯ 모둠')]),
  answer:`${NM[w]}, ${Ts[w]}표`,
  solution:ol([`띠그래프의 눈금은 띠를 똑같이 나눈 칸입니다. 칸을 세면 영수는 ${n[0]}칸 중 ㉮ ${m[0]}칸·㉯ ${n[0]-m[0]}칸, 지혜는 ${n[1]}칸 중 ㉮ ${m[1]}칸·㉯ ${n[1]-m[1]}칸, 동민은 ${n[2]}칸 중 ㉮ ${m[2]}칸·㉯ ${n[2]-m[2]}칸입니다.`,
   `지혜: ㉯ 모둠 표 ${B2}표가 ${n[1]-m[1]}칸이므로 한 칸은 ${B2} ÷ ${n[1]-m[1]} = ${u2}(표)입니다. 지혜가 얻은 표는 ${u2} × ${n[1]} = ${T2}(표), ㉮ 모둠 표는 ${u2} × ${m[1]} = ${A2}(표)입니다.`,
   `지혜의 ㉮ 모둠 표 ${A2}표가 ㉮ 모둠 전체의 ${p[1]} %이므로 ㉮ 모둠 전체 표는 ${A2} ÷ ${p[1]} × 100 = ${At}(표)입니다.`,
   `동민: 한 칸은 ${B3} ÷ ${n[2]-m[2]} = ${u3}(표)이므로 얻은 표는 ${u3} × ${n[2]} = ${T3}(표), ㉮ 모둠 표는 ${u3} × ${m[2]} = ${A3}(표)입니다.`,
   `영수의 ㉮ 모둠 표는 ${At} − ${A2} − ${A3} = ${A1}(표)이고 ${m[0]}칸이므로 한 칸은 ${u1}표, 영수가 얻은 표는 ${u1} × ${n[0]} = ${T1}(표)입니다.`,
   `${T1}표, ${T2}표, ${T3}표 중 가장 많은 것은 ${Ts[w]}표이므로 ${ga(NM[w])} ${Ts[w]}표로 당선되었습니다.`])};})};}

// ================= 6단원 =================
// 사투상(앞면 그대로, 깊이는 오른쪽 위로) 좌표
const obl=(ox,oy,k)=>(x,y,z)=>[ox+k*(x+0.5*y),oy-k*(z+0.42*y)];

// Mission 4: 정육면체(a)에서 앞면 가운데 세로 홈(가로 w, 깊이 d, 높이 a)과 뒤쪽 아래 모서리 홈(깊이 p, 높이 q, 길이 a)을 잘라 냄
function cutCubeSvg(a,s0,w,d,p,q){const k=150/a,Pt=obl(70,236,k),F=pts=>pts.map(t=>Pt(...t));let b='';
 b+=poly(F([[s0,d,0],[s0+w,d,0],[s0+w,d,a],[s0,d,a]]),'#b9b9b9');               // 홈 안쪽 벽
 b+=poly(F([[s0,0,0],[s0,d,0],[s0,d,a],[s0,0,a]]),'#cfcfcf');                      // 홈 옆벽
 b+=poly(F([[0,0,a],[s0,0,a],[s0,d,a],[s0+w,d,a],[s0+w,0,a],[a,0,a],[a,a,a],[0,a,a]]),'#f3f3f3'); // 윗면
 b+=poly(F([[a,0,0],[a,a-p,0],[a,a-p,q],[a,a,q],[a,a,a],[a,0,a]]),'#bdbdbd');      // 오른쪽 면
 b+=poly(F([[0,0,0],[s0,0,0],[s0,0,a],[0,0,a]]),'#dedede')+poly(F([[s0+w,0,0],[a,0,0],[a,0,a],[s0+w,0,a]]),'#dedede'); // 앞면
 const off=(pt,dx,dy)=>[pt[0]+dx,pt[1]+dy];
 // 치수: 위쪽 뒤 모서리 a, 왼쪽 앞 모서리 a, 홈 가로 w, 홈 깊이 d, 아래 홈 깊이 p·높이 q
 let A1=off(Pt(0,a,a),-4,-9),A2=off(Pt(a,a,a),-4,-9);b+=dim(...A1,...A2)+T((A1[0]+A2[0])/2,A1[1]-5,a+' cm','middle',13);
 A1=off(Pt(0,0,0),-10,0);A2=off(Pt(0,0,a),-10,0);b+=dim(...A1,...A2)+T(A1[0]-5,(A1[1]+A2[1])/2+4,a+' cm','end',13);
 A1=off(Pt(s0,d,a),0,-7);A2=off(Pt(s0+w,d,a),0,-7);b+=dim(...A1,...A2)+T((A1[0]+A2[0])/2,A1[1]-5,w+' cm','middle',12);
 A1=off(Pt(s0+w,0,a),7,0);A2=off(Pt(s0+w,d,a),7,0);b+=dim(...A1,...A2)+T((A1[0]+A2[0])/2+5,(A1[1]+A2[1])/2+5,d+' cm','start',12);
 A1=off(Pt(a,a-p,q),9,4);A2=off(Pt(a,a,q),9,4);b+=dim(...A1,...A2)+T(A2[0]+4,A2[1]+8,p+' cm','start',13);
 A1=off(Pt(a,a-p,0),12,0);A2=off(Pt(a,a-p,q),12,0);b+=dim(...A1,...A2)+T(A1[0]+6,(A1[1]+A2[1])/2+5,q+' cm','start',13);
 return svg(360,256,'직육면체 모양 두 개를 잘라 낸 정육면체',b);}
function cutCubeItem(){return {key:'source61U6E1Mission4',resultContract:'single-value',answerVisualRequired:false,pool:[
  // [a, 홈 시작 s0, 가로 w, 세로(깊이) d, 아래 홈 깊이 p, 아래 홈 높이 q]
  [12,4,4,4,4,4],[10,3,4,3,3,4],[15,5,5,5,5,5]].map(([a,s0,w,d,p,q])=>{
  const base=a*a*6,plus=2*d*a-2*w*d,minus=2*p*q,ans=base+plus-minus;
  return {
  prompt:P([`다음 입체도형은 한 모서리의 길이가 ${a} cm인 정육면체 모양에서 가로 ${w} cm, ${w===d?'':`세로 ${d} cm, `}높이 ${a} cm인 직육면체 모양 2개를 잘라 낸 것입니다. 이 입체도형의 겉넓이를 구하세요.`,cutCubeSvg(a,s0,w,d,p,q)]),
  answer:ans+' cm²',
  solution:ol([`처음 정육면체의 겉넓이는 ${a} × ${a} × 6 = ${base} (cm²)입니다.`,
   `앞쪽 세로 홈: 앞면에서 ${w} × ${a}만큼 없어지지만 안쪽 벽 ${w} × ${a}가 새로 생기고, 양옆 벽 ${d} × ${a} × 2 = ${2*d*a} (cm²)가 늘어납니다. 윗면과 아랫면에서는 ${w} × ${d} × 2 = ${2*w*d} (cm²)가 줄어듭니다.`,
   `따라서 앞쪽 홈 때문에 겉넓이는 ${2*d*a} − ${2*w*d} = ${plus} (cm²) 늘어납니다.`,
   `뒤쪽 아래 모서리의 홈: 뒷면과 밑면에서 없어진 넓이만큼 새 면이 생기므로 그대로이고, 오른쪽 면과 왼쪽 면에서 ${p} × ${q} × 2 = ${minus} (cm²)가 줄어듭니다.`,
   `입체도형의 겉넓이는 ${base} + ${plus} − ${minus} = ${ans} (cm²)입니다.`])};})};}

// Mission 5: 4×4×4 쌓기나무 정육면체에서 색칠한 8개를 뺌(원문 그림 위치)
const REMOVED=[[0,0,2],[0,0,3],[1,0,3],[1,1,3],[1,2,3],[2,0,1],[2,0,2],[2,0,3]];
function isoCube(ox,oy,removedSet,colorSet){const sx=17,sb=9.8,sh=19.6,Pt=(x,y,z)=>[ox+(x-y)*sx,oy-z*sh-(x+y)*sb];const has=(i,j,k)=>i>=0&&j>=0&&k>=0&&i<4&&j<4&&k<4&&!removedSet.has(i+','+j+','+k);
 const cells=[];for(let i=0;i<4;i++)for(let j=0;j<4;j++)for(let k=0;k<4;k++)if(has(i,j,k))cells.push([i,j,k]);
 cells.sort((A,B)=>(B[0]+B[1])-(A[0]+A[1])||A[2]-B[2]);let b='';
 for(const [i,j,k] of cells){const c=colorSet.has(i+','+j+','+k),st='stroke:#222;stroke-width:1px;stroke-linejoin:round';
  if(!has(i,j,k+1))b+=poly([Pt(i,j,k+1),Pt(i+1,j,k+1),Pt(i+1,j+1,k+1),Pt(i,j+1,k+1)],c?'#f6c784':'#f4f4f4',st);
  if(!has(i-1,j,k))b+=poly([Pt(i,j,k),Pt(i,j+1,k),Pt(i,j+1,k+1),Pt(i,j,k+1)],c?'#e9a956':'#d4d4d4',st);
  if(!has(i,j-1,k))b+=poly([Pt(i,j,k),Pt(i+1,j,k),Pt(i+1,j,k+1),Pt(i,j,k+1)],c?'#d48f38':'#b5b5b5',st);}
 return b;}
function blocksSvg(){const R=new Set(REMOVED.map(x=>x.join(',')));
 return svg(360,190,'쌓기나무 정육면체와 색칠한 쌓기나무 8개를 뺀 입체도형',isoCube(80,182,new Set(),R)+isoCube(282,182,R,new Set())+
  `<path d="M163 98h22v-7l14 13l-14 13v-7h-22z" style="fill:#fff;stroke:#222;stroke-width:1.2px"/>`);}
function blocksItem(){return {key:'source61U6E1Mission5',resultContract:'single-value',answerVisualRequired:false,pool:[2,3,4].map(e=>{
  const sq=e*e,faces=104;
  return {
  prompt:P([`한 모서리의 길이가 ${e} cm인 정육면체 모양의 쌓기나무를 다음 그림과 같이 정육면체 모양으로 쌓았다가 색칠한 쌓기나무 8개를 빼냈습니다. 남은 입체도형의 겉넓이를 구하세요.`,blocksSvg()]),
  answer:faces*sq+' cm²',
  solution:ol([`쌓기나무 한 면의 넓이는 ${e} × ${e} = ${sq} (cm²)입니다. 처음 정육면체는 한 면에 쌓기나무 면이 4 × 4 = 16개씩 보이므로 겉면은 16 × 6 = 96개입니다.`,
   `위·아래, 앞·뒤, 왼쪽·오른쪽 여섯 방향에서 바라보면 각 방향에서 보이는 쌓기나무 면은 빼낸 뒤에도 16개씩입니다. 움푹 들어간 곳도 그 방향에서 보면 면이 하나씩 보이기 때문입니다. 이 면들만 세면 96개입니다.`,
   `그런데 왼쪽 앞면에서 오른쪽 뒷면 쪽으로 이어진 줄 가운데, 쌓기나무가 빠져 중간이 끊어진 줄이 4줄 있습니다(오른쪽 앞면에 붙은 맨 앞 줄의 둘째 층과 셋째 층, 맨 위층의 앞에서 둘째 줄과 셋째 줄). 끊어진 곳마다 서로 마주 보는 면 2개가 새로 생기므로 겉면은 4 × 2 = 8개 늘어납니다.`,
   `남은 입체도형의 겉면은 96 + 8 = 104개이므로 겉넓이는 104 × ${sq} = ${faces*sq} (cm²)입니다.`])};})};}

// e3 Mission 1: 앞면 모양이 같은 4개의 직육면체를 이어 붙인 입체(가로 W, 깊이 D, 높이 H, 홈 깊이 g)
function stepSvg(W,D,H,dd,xs,hs){const k=Math.min(270/(W+0.5*D),205/(H+0.42*D)),Pt=obl(62,230,k);let b='';
 for(let i=0;i<hs.length;i++){const x1=xs[i],x2=xs[i+1],h=hs[i],hn=i+1<hs.length?hs[i+1]:0;
  b+=poly([Pt(x1,0,h),Pt(x2,0,h),Pt(x2,D,h),Pt(x1,D,h)],'#ececec');
  if(hn<h)b+=poly([Pt(x2,0,hn),Pt(x2,D,hn),Pt(x2,D,h),Pt(x2,0,h)],'#a3a3a3');}
 const front=[[0,0]];hs.forEach((h,i)=>{front.push([xs[i],h],[xs[i+1],h]);});front.push([W,0]);
 b+=poly(front.map(([x,z])=>Pt(x,0,z)),'#c9c9c9');
 let A1=[Pt(0,0,0)[0],Pt(0,0,0)[1]+12],A2=[Pt(W,0,0)[0],Pt(W,0,0)[1]+12];b+=dim(...A1,...A2)+T((A1[0]+A2[0])/2,A1[1]+16,W+' cm','middle',13);
 A1=[Pt(0,0,0)[0]-10,Pt(0,0,0)[1]];A2=[Pt(0,0,H)[0]-10,Pt(0,0,H)[1]];b+=dim(...A1,...A2)+T(A1[0]-5,(A1[1]+A2[1])/2+4,H+' cm','end',13);
 A1=[Pt(0,0,H)[0]-7,Pt(0,0,H)[1]-7];A2=[Pt(0,D,H)[0]-7,Pt(0,D,H)[1]-7];b+=dim(...A1,...A2)+T((A1[0]+A2[0])/2-8,(A1[1]+A2[1])/2-6,D+' cm','end',13);
 const xg=xs[2],hg=hs[1],hm=hs[2];A1=[Pt(xg,0,hg)[0]+6,Pt(xg,0,hg)[1]];A2=[Pt(xg,0,hm)[0]+6,Pt(xg,0,hm)[1]];
 b+=dim(...A1,...A2)+T(A1[0]+6,(A1[1]+A2[1])/2+5,dd+' cm','start',13);
 return svg(360,262,'직육면체 4개를 이어 붙인 입체도형',b);}
function stepItem(){return {key:'source61U6E3Mission1',resultContract:'single-value',answerVisualRequired:false,pool:[
  // [가로 W, 깊이 D, 높이 H, 가운데 기둥 왼쪽 면 높이 dd, 앞면 가로 나눔 xs, 각 부분 높이 hs]
  [42,32,28,14,[0,8,18,30,42],[28,6,20,14]],[40,30,24,12,[0,8,18,30,40],[24,5,17,10]],[36,25,30,15,[0,7,15,26,36],[30,6,21,12]]].map(([W,D,H,dd,xs,hs])=>{
  let A=0;for(let i=0;i<hs.length;i++)A+=(xs[i+1]-xs[i])*hs[i];
  const Pm=2*W+2*H+2*dd,side=Pm*D,Ssurf=2*A+side,V=A*D;
  return {
  prompt:P([`4개의 직육면체를 이어 붙여서 다음 그림과 같은 입체도형을 만들었습니다. 이 입체도형의 겉넓이가 ${Ssurf} cm²일 때, 입체도형의 부피를 구하세요.`,stepSvg(W,D,H,dd,xs,hs)]),
  answer:V+' cm³',
  solution:ol([`이 입체도형은 앞면과 뒷면의 모양이 같고, 나머지 면들은 모두 길이가 ${D} cm인 직사각형입니다. 따라서 겉넓이는 (앞면의 넓이) × 2 + (앞면의 둘레) × ${D}입니다.`,
   `앞면의 둘레에서 위쪽 가로 선분들을 아래로 옮기면 가로는 ${W} × 2 = ${2*W} (cm)입니다. 세로 선분들을 옮기면 높이 ${H} cm의 2배에 가운데 기둥 왼쪽의 ${dd} cm가 2번 더해지므로 ${H} × 2 + ${dd} × 2 = ${2*H+2*dd} (cm)입니다.`,
   `앞면의 둘레는 ${2*W} + ${2*H+2*dd} = ${Pm} (cm)이므로 옆면들의 넓이의 합은 ${Pm} × ${D} = ${side} (cm²)입니다.`,
   `앞면과 뒷면의 넓이의 합은 ${Ssurf} − ${side} = ${2*A} (cm²)이므로 앞면의 넓이는 ${2*A} ÷ 2 = ${A} (cm²)입니다.`,
   `부피는 (앞면의 넓이) × (깊이) = ${A} × ${D} = ${V} (cm³)입니다.`])};})};}

const ITEMS={
 '6-1-u4-e1-exploration-1-1':jegiItem(),
 '6-1-u4-e1-exploration-1-2':saltItem(),
 '6-1-u5-e1-exploration-1-1':clubExplainItem(),
 '6-1-u5-e1-exploration-1-2':clubCompareItem(),
 '6-1-u5-e1-exploration-2':movieItem(),
 '6-1-u5-e4-example-3':exampleElection(),
 '6-1-u5-e4-mission-3':missionElection(),
 '6-1-u6-e1-mission-4':cutCubeItem(),
 '6-1-u6-e1-mission-5':blocksItem(),
 '6-1-u6-e3-mission-1':stepItem(),
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
