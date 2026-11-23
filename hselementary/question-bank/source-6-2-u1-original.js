// 황소 6-2 1단원 (분수의 나눗셈) 개념탐구 1·3·5·6 원문 구조 유형. 각 문항은 같은 구조·다른 수의 검증된 3문항 풀입니다.
(function(root){'use strict';
const GROUP='6-2-u1';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;
// 번분수(분자·분모에 식이 들어가는 분수): 읽기 이름은 글자로만 둡니다.
const cfr=(num,den,label)=>`<span class="math-fraction" role="img" aria-label="${label}"><span>${num}</span><span>${den}</span></span>`;

// ---------- 분수 계산 도우미 (정확한 분수) ----------
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const Q=(n,d)=>{d=d===undefined?1:d;if(d<0){n=-n;d=-d;}const k=gcd(n,d)||1;return [n/k,d/k];};
const add=(a,b)=>Q(a[0]*b[1]+b[0]*a[1],a[1]*b[1]);
const sub=(a,b)=>Q(a[0]*b[1]-b[0]*a[1],a[1]*b[1]);
const mul=(a,b)=>Q(a[0]*b[0],a[1]*b[1]);
const div=(a,b)=>Q(a[0]*b[1],a[1]*b[0]);
const inv=a=>Q(a[1],a[0]);
const M=(w,n,d)=>Q(w*d+n,d); // 대분수 값
const D=s=>{const [i,f]=String(s).split('.');const k=f?f.length:0;return Q(Number(i+(f||'')),Math.pow(10,k));}; // 소수 값
const lt=(a,b)=>a[0]*b[1]<b[0]*a[1];
// 대분수/진분수/자연수로 보이기
const sh=q=>q[1]===1?String(q[0]):(q[0]<q[1]?ff(q[0],q[1]):mx(Math.floor(q[0]/q[1]),q[0]%q[1],q[1]));
// 가분수 그대로 보이기
const im=q=>q[1]===1?String(q[0]):ff(q[0],q[1]);
const ol=a=>'<ol>'+a.map(x=>'<li>'+x+'</li>').join('')+'</ol>';
const P=a=>a.map(x=>x.startsWith('<')?x:'<p>'+x+'</p>').join('');

// ---------- 그림 도우미 ----------
const S='stroke:#222;stroke-width:1.4px';
const DIM='fill:none;stroke:#55524d;stroke-width:1px;stroke-dasharray:4 3';
const f1=v=>{const s=(Math.round(v*10)/10).toFixed(1);return s.endsWith('.0')?s.slice(0,-2):s;};
const svg=(w,h,label,body)=>`<svg viewBox="0 0 ${w} ${h}" style="width:100%;max-width:360px;height:auto;display:block;margin:8px auto;font-family:inherit" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const T=(x,y,t,a,sz)=>`<text x="${f1(x)}" y="${f1(y)}" text-anchor="${a||'middle'}" font-size="${sz||13}" fill="#222" style="font-family:inherit">${t}</text>`;
// 그림 안의 대분수 글자 (자연수 + 세로 분수 + 단위), (x,y)는 가운데 기준선
function svgMix(x,y,w,n,d,unit){const ws=String(w).length*7.6,fw=String(d).length>1?16:10,tw=ws+fw+4+unit.length*8,x0=x-tw/2;
 const fx=x0+ws+2+fw/2;
 return T(x0,y+5,w,'start',14)+T(fx,y-3,n,'middle',12)+`<line x1="${f1(fx-fw/2)}" y1="${f1(y)}" x2="${f1(fx+fw/2)}" y2="${f1(y)}" style="stroke:#222;stroke-width:1px"/>`+T(fx,y+12,d,'middle',12)+T(fx+fw/2+3,y+5,unit,'start',14);}
function rectSvg(W,Wl,Hv){ // W: [w,n,d] 가로(대분수), Hv: 세로(소수 문자열)
 const wv=W[0]+W[1]/W[2],hv=Number(Hv),PW=220,PH=PW*hv/wv,x0=40,y0=14,x1=x0+PW,y1=y0+PH;
 const arcB=`<path d="M${x0} ${f1(y1+4)}Q${f1((x0+x1)/2)} ${f1(y1+30)} ${x1} ${f1(y1+4)}" style="${DIM}"/>`;
 const arcR=`<path d="M${f1(x1+4)} ${y0}Q${f1(x1+30)} ${f1((y0+y1)/2)} ${f1(x1+4)} ${f1(y1)}" style="${DIM}"/>`;
 return svg(360,y1+48,`가로 ${Wl} cm, 세로 ${Hv} cm인 직사각형`,
  `<rect x="${x0}" y="${y0}" width="${f1(PW)}" height="${f1(PH)}" style="fill:#f1f1f1;${S}"/>`+arcB+arcR+
  svgMix((x0+x1)/2,y1+34,W[0],W[1],W[2],'cm')+T(x1+22,(y0+y1)/2+5,Hv+' cm','start',14));}

// ---------- 개념탐구 1: 분수 나눗셈의 이해 ----------
function e1(a,b,c,d,p,q,r,s,t){
 const A=Q(a,b),C=Q(c,d),R=div(A,C),x=sub(p,q),y=div(div(r,s),t),ans=div(x,y);
 const fa=ff(a,b),fc=ff(c,d);
 return {
  prompt:P([`(1) ${fa} ÷ ${fc} = ${fa} × ${ff(d,c)}인 까닭을 설명해 보세요.`,
   `(2) ${fa} ÷ ${fc} = ${im(R)}임을 이용하여 짧은 이야기 문제를 만들어 보세요.`,
   `(3) (${im(p)} − ${im(q)}) ÷ (${im(r)} ÷ ${im(s)} ÷ ${im(t)})를 계산해 보세요.`]),
  answer:`(1) 페인트 ${fc} L로 벽 ${fa} m²를 칠한다고 하면, 페인트 ${ff(1,d)} L로는 ${fa} ÷ ${c} (m²)를 칠하고, 페인트 1 L로는 그 ${d}배를 칠합니다. 따라서 ${fa} ÷ ${fc} = ${fa} × ${ff(1,c)} × ${d} = ${fa} × ${ff(d,c)}입니다. `+
   `(2) 예: 페인트 ${fc} L로 벽 ${fa} m²를 칠할 수 있을 때, 페인트 1 L로 칠할 수 있는 벽의 넓이는 ${fa} ÷ ${fc} = ${im(R)} (m²)입니다. (3) ${sh(ans)}`,
  solution:ol([`(1) ${fc}는 ${ff(1,d)}이 ${c}개인 수입니다. 페인트 ${fc} L로 벽 ${fa} m²를 칠한다고 생각하면, 페인트 ${ff(1,d)} L로 칠하는 넓이는 ${fa} ÷ ${c} = ${fa} × ${ff(1,c)} (m²)입니다.`,
   `페인트 1 L는 ${ff(1,d)} L의 ${d}배이므로 칠하는 넓이는 ${fa} × ${ff(1,c)} × ${d} = ${fa} × ${ff(d,c)} (m²)입니다. 이것이 ${fa} ÷ ${fc}의 값이므로 나누는 분수의 분모와 분자를 바꾸어 곱한 것과 같습니다.`,
   `(2) 나눗셈 ${fa} ÷ ${fc}는 '${fc}만큼에 ${fa}만큼일 때 1만큼에는 얼마인가'를 구하는 식으로 쓸 수 있습니다. 예를 들어 "페인트 ${fc} L로 벽 ${fa} m²를 칠할 수 있을 때, 페인트 1 L로 칠할 수 있는 벽의 넓이는 몇 m²인가요?"라는 이야기를 만들 수 있고, 답은 ${im(R)} m²입니다.`,
   `(3) 앞의 괄호: ${im(p)} − ${im(q)} = ${im(x)}입니다.`,
   `뒤의 괄호: ${im(r)} ÷ ${im(s)} ÷ ${im(t)} = ${im(r)} × ${im(inv(s))} × ${im(inv(t))} = ${im(y)}입니다.`,
   `따라서 ${im(x)} ÷ ${im(y)} = ${im(x)} × ${im(inv(y))} = ${sh(ans)}입니다.`])};}

// ---------- 개념탐구 3: 번분수, 수 카드로 만든 (대분수)÷(대분수) ----------
function e3(p,q,r,s,cards){
 const fr=Q(r,s),inA=add(Q(q),fr),inB=sub(Q(q),fr),tA=div(Q(p),inA),tB=div(Q(p),inB),top=sub(Q(2),tA),bot=add(Q(2),tB),v1=div(top,bot);
 const fs=ff(r,s);
 const lab=`(2 − ${p} ÷ (${q} + ${s}분의 ${r})) ÷ (2 + ${p} ÷ (${q} − ${s}분의 ${r}))`;
 const big=cfr(`2 − ${cfr(p,`${q} + ${fs}`,`${q}과 ${s}분의 ${r}의 합분의 ${p}`)}`,`2 + ${cfr(p,`${q} − ${fs}`,`${q}과 ${s}분의 ${r}의 차분의 ${p}`)}`,lab);
 // 수 카드: 자연수 부분은 가장 큰 수 ÷ 가장 작은 수, 남은 네 장 중 가장 작은 수를 나누는 수의 분자로 둡니다.
 const cs=cards.slice().sort((a,b)=>a-b),hi=cs[5],lo=cs[0],rest=cs.slice(1,5),nm=rest[0],others=rest.slice(1);
 const cases=others.map(den=>{const o=others.filter(x=>x!==den);const dv=M(lo,nm,den),dd=M(hi,o[0],o[1]);return {den,o,dv,dd,qv:div(dd,dv)};});
 let best=cases[0];cases.forEach(c=>{if(lt(best.qv,c.qv))best=c;});
 const v2=best.qv;
 const cardHtml=cards.map(c=>`<span style="display:inline-block;min-width:1.4em;padding:0 .2em;border:1px solid #222;text-align:center;margin:0 .1em">${c}</span>`).join(' ');
 return {
  prompt:P([`(1) 다음을 계산하여 기약분수로 나타내어 보세요.`,`<p style="text-align:center;font-size:1.15em">${big}</p>`,
   `(2) 수 카드 ${cardHtml}를 한 번씩만 사용하여 (대분수) ÷ (대분수)를 만들려고 합니다. 나눗셈의 몫이 가장 클 때의 몫을 구해 보세요.`]),
  answer:`(1) ${sh(v1)} (2) ${sh(v2)}`,
  solution:ol([`(1) 분자와 분모 안에 있는 작은 분수식부터 계산합니다. ${q} + ${fs} = ${im(inA)}이므로 ${p} ÷ ${im(inA)} = ${im(tA)}이고, 분자는 2 − ${im(tA)} = ${im(top)}입니다.`,
   `${q} − ${fs} = ${im(inB)}이므로 ${p} ÷ ${im(inB)} = ${im(tB)}이고, 분모는 2 + ${im(tB)} = ${im(bot)}입니다.`,
   `따라서 ${im(top)} ÷ ${im(bot)} = ${im(top)} × ${im(inv(bot))} = ${sh(v1)}입니다.`,
   `(2) 몫이 가장 크려면 나누어지는 수는 크게, 나누는 수는 작게 만들어야 합니다. 자연수 부분에 가장 큰 수 ${hi}을(를) 나누어지는 수에, 가장 작은 수 ${lo}을(를) 나누는 수에 놓습니다.`,
   `나누는 수의 분수 부분은 작아야 하므로 남은 수 ${rest.join(', ')} 중 가장 작은 ${nm}을(를) 분자로 놓고, 분모를 바꾸어 가며 비교합니다. `+
    cases.map(c=>`${mx(hi,c.o[0],c.o[1])} ÷ ${mx(lo,nm,c.den)} = ${sh(c.qv)}`).join(', ')+'입니다.',
   `이 중 가장 큰 몫은 ${mx(hi,best.o[0],best.o[1])} ÷ ${mx(lo,nm,best.den)} = ${im(best.dd)} × ${im(inv(best.dv))} = ${sh(v2)}입니다.`])};}

// ---------- 개념탐구 5 Mission ----------
function m52(a,b,avg){ // 국어 = 수학×a, 과학 = 국어×b
 const c=mul(a,b),sum=add(add(Q(1),a),c),tot=avg*3,ans=div(Q(tot),sum);
 return {prompt:P([`다음은 민아의 국어, 수학, 과학 점수에 대한 설명입니다. 세 과목 점수의 평균이 ${avg}점일 때 수학 점수는 몇 점인지 구해 보세요.`,
   `<ul><li>국어 점수는 수학 점수의 ${sh(a)}배입니다.</li><li>과학 점수는 국어 점수의 ${sh(b)}배입니다.</li></ul>`]),
  answer:sh(ans)+'점',
  solution:ol([`세 과목 점수의 합은 ${avg} × 3 = ${tot}(점)입니다.`,
   `수학 점수를 □점이라 하면 국어 점수는 □ × ${sh(a)}, 과학 점수는 □ × ${sh(a)} × ${sh(b)} = □ × ${im(c)}입니다.`,
   `세 점수의 합은 □ × (1 + ${im(a)} + ${im(c)}) = □ × ${im(sum)}이므로 □ × ${im(sum)} = ${tot}입니다.`,
   `□ = ${tot} ÷ ${im(sum)} = ${tot} × ${im(inv(sum))} = ${sh(ans)}이므로 수학 점수는 ${sh(ans)}점입니다.`])};}
function m53(r,s1,w,s2,T){ // 장미 = 카네이션×r
 const cl=mul(sub(Q(1),s1),sub(Q(1),w)),rl=mul(r,sub(Q(1),s2)),k=add(cl,rl),C=div(Q(T),k),R=mul(C,r),tot=add(C,R);
 return {prompt:P([`어느 꽃집에 있는 장미 수는 카네이션 수의 ${sh(r)}배입니다. 카네이션의 ${sh(s1)}은(는) 팔았고 나머지의 ${sh(w)}은(는) 시들어서 버렸습니다. 장미의 ${sh(s2)}을(를) 팔고 남은 카네이션과 장미의 수를 세어 보았더니 모두 ${T}송이였습니다. 이 꽃집에 처음 있던 장미와 카네이션은 모두 몇 송이인가요?`]),
  answer:sh(tot)+'송이',
  solution:ol([`처음 카네이션 수를 □송이라 하면 장미는 □ × ${sh(r)}송이입니다.`,
   `남은 카네이션은 □ × (1 − ${im(s1)}) × (1 − ${im(w)}) = □ × ${im(cl)}입니다.`,
   `남은 장미는 □ × ${im(r)} × (1 − ${im(s2)}) = □ × ${im(rl)}입니다.`,
   `남은 꽃은 □ × (${im(cl)} + ${im(rl)}) = □ × ${im(k)} = ${T}이므로 □ = ${T} ÷ ${im(k)} = ${sh(C)}입니다.`,
   `장미는 ${sh(C)} × ${sh(r)} = ${sh(R)}(송이)이므로 처음 있던 꽃은 모두 ${sh(C)} + ${sh(R)} = ${sh(tot)}(송이)입니다.`])};}
function m54(a,b,A,c,d){
 const k1=mul(a,b),O=div(Q(A),k1),k2=mul(c,d),ans=mul(O,k2);
 return {prompt:P([`직사각형 모양의 땅이 있습니다. 이 땅의 가로를 ${sh(a)}배로 줄이고 세로를 ${sh(b)}배로 늘이면 넓이가 ${A} m²가 됩니다. 처음 땅의 가로를 ${sh(c)}배로 줄이고 세로를 ${sh(d)}배로 늘이면 넓이는 몇 m²인가요?`]),
  answer:sh(ans)+' m²',
  solution:ol([`가로를 ${sh(a)}배, 세로를 ${sh(b)}배 하면 넓이는 ${im(a)} × ${im(b)} = ${im(k1)}(배)가 됩니다.`,
   `처음 땅의 넓이는 ${A} ÷ ${im(k1)} = ${A} × ${im(inv(k1))} = ${sh(O)} (m²)입니다.`,
   `가로를 ${sh(c)}배, 세로를 ${sh(d)}배 하면 넓이는 ${im(c)} × ${im(d)} = ${im(k2)}(배)가 됩니다.`,
   `따라서 넓이는 ${sh(O)} × ${im(k2)} = ${sh(ans)} (m²)입니다.`])};}
function m55(h,m,dist,late,total){
 const t=add(Q(h),Q(m,60)),v=div(dist,t),ans=mul(v,Q(late,60));
 return {prompt:P([`어느 자동차가 ${h}시간 ${m}분 동안 ${sh(dist)} km를 가는 빠르기로 일정하게 가다가, 중간에 빠르기를 반으로 줄였더니 줄이기 전 빠르기로 갔을 때 도착해야 할 시각보다 ${late}분 늦게 도착했습니다. 간 거리가 모두 ${total} km일 때, 중간에 반으로 줄인 빠르기로 간 거리는 몇 km인가요?`]),
  answer:sh(ans)+' km',
  solution:ol([`${h}시간 ${m}분은 ${sh(t)}시간이므로 처음 빠르기는 한 시간에 ${sh(dist)} ÷ ${sh(t)} = ${im(dist)} × ${im(inv(t))} = ${sh(v)} (km)입니다.`,
   `빠르기를 반으로 줄이면 같은 거리를 가는 데 걸리는 시간이 2배가 됩니다. 따라서 늦어진 ${late}분은 줄인 빠르기로 간 거리를 처음 빠르기로 갈 때 걸리는 시간과 같습니다.`,
   `${late}분은 ${im(Q(late,60))}시간이므로 줄인 빠르기로 간 거리는 ${sh(v)} × ${im(Q(late,60))} = ${sh(ans)} (km)입니다.`,
   `${sh(ans)} km는 전체 ${total} km보다 짧으므로 조건에 맞습니다.`])};}
function m56(p,q,g){
 const a=mul(p,p),b=mul(q,q),k=sub(a,b),H=div(g,k);
 return {prompt:P([`두 개의 공 ㉮, ㉯를 같은 높이에서 수직으로 바닥에 떨어뜨렸습니다. ㉮는 떨어진 높이의 ${sh(p)}만큼 튀어 오르고, ㉯는 떨어진 높이의 ${sh(q)}만큼 튀어 오릅니다. 두 공 ㉮, ㉯가 두 번째로 튀어 오른 높이의 차가 ${sh(g)} m일 때, 처음 공을 떨어뜨린 높이는 몇 m인지 기약분수로 나타내어 보세요.`]),
  answer:sh(H)+' m',
  solution:ol([`처음 높이를 □ m라 하면 ㉮가 두 번째로 튀어 오른 높이는 □ × ${im(p)} × ${im(p)} = □ × ${im(a)}입니다.`,
   `㉯가 두 번째로 튀어 오른 높이는 □ × ${im(q)} × ${im(q)} = □ × ${im(b)}입니다.`,
   `높이의 차는 □ × (${im(a)} − ${im(b)}) = □ × ${im(k)}이고 이것이 ${sh(g)} m입니다.`,
   `□ = ${sh(g)} ÷ ${im(k)} = ${im(g)} × ${im(inv(k))} = ${sh(H)}이므로 처음 높이는 ${sh(H)} m입니다.`])};}

// ---------- 개념탐구 6: 분수와 소수의 혼합 계산 ----------
function e6x(n,T,w,W){
 const per=div(T,Q(n)),bags=div(D(W),w),ans=mul(per,bags);
 return {prompt:P([`어느 밀가루 공장에서 밀가루 ${n}포대를 생산하는 데 ${sh(T)}시간이 걸립니다. 한 포대에 들어 있는 밀가루의 무게는 ${sh(w)} kg입니다. 어느 제빵 회사에서 빵을 만드는 데 밀가루 ${W} kg이 필요해서 이 공장에 주문하였습니다. 이 공장에서 제빵 회사에 필요한 밀가루를 생산하는 데 걸리는 시간은 모두 몇 시간인가요?`]),
  answer:sh(ans)+'시간',
  solution:ol([`필요한 포대 수는 ${W} ÷ ${sh(w)} = ${im(D(W))} × ${im(inv(w))} = ${sh(bags)}(포대)입니다.`,
   `한 포대를 생산하는 데 걸리는 시간은 ${sh(T)} ÷ ${n} = ${im(T)} × ${ff(1,n)} = ${sh(per)}(시간)입니다.`,
   `따라서 걸리는 시간은 ${sh(per)} × ${sh(bags)} = ${sh(ans)}(시간)입니다.`])};}
function e6e1(a,b){
 const ans=div(D(a),b);
 return {prompt:P([`㉠을 ㉡으로 나눈 몫은 ${a}이고, ㉠을 ㉢으로 나눈 몫은 ${sh(b)}입니다. 이때 ㉢을 ㉡으로 나눈 몫을 구해 보세요.`]),
  answer:sh(ans),
  solution:ol([`㉠ ÷ ㉡ = ${a}이므로 ㉠ = ㉡ × ${a}이고, ㉠ ÷ ㉢ = ${sh(b)}이므로 ㉠ = ㉢ × ${sh(b)}입니다.`,
   `따라서 ㉡ × ${a} = ㉢ × ${sh(b)}입니다.`,
   `양쪽을 ㉡으로 나누고 ${sh(b)}로 나누면 ㉢ ÷ ㉡ = ${a} ÷ ${sh(b)} = ${im(D(a))} × ${im(inv(b))} = ${sh(ans)}입니다.`])};}
function e6e2(a,b,c,e){
 const add2=mul(sub(Q(1),a),b),fill=add(a,add2),emp=sub(Q(1),fill),part=sub(emp,e),cap=div(D(c),part);
 return {prompt:P([`물통에 물이 ${sh(a)}만큼 들어 있습니다. 이 물통에 나머지의 ${sh(b)}만큼 물을 채운 다음, ${c} L의 물을 더 넣었더니 남은 부분이 전체의 ${sh(e)}이(가) 되었습니다. 이 물통의 들이는 몇 L인가요?`]),
  answer:sh(cap)+' L',
  solution:ol([`처음 비어 있던 부분은 전체의 1 − ${im(a)} = ${im(sub(Q(1),a))}이고, 그중 ${im(b)}을(를) 채웠으므로 더 채운 물은 전체의 ${im(sub(Q(1),a))} × ${im(b)} = ${im(add2)}입니다.`,
   `이때까지 채워진 물은 전체의 ${im(a)} + ${im(add2)} = ${im(fill)}이므로 비어 있는 부분은 전체의 ${im(emp)}입니다.`,
   `${c} L를 넣었더니 비어 있는 부분이 ${im(e)}이(가) 되었으므로 ${c} L는 전체의 ${im(emp)} − ${im(e)} = ${im(part)}입니다.`,
   `물통의 들이는 ${c} ÷ ${im(part)} = ${sh(cap)} (L)입니다.`])};}
function e6e3(k,pb,pg,N){
 const cb=mul(k,Q(100+pb,100)),cg=Q(100+pg,100),sum=add(cb,cg),G=div(Q(N),sum),B=mul(G,k),Bn=mul(B,Q(100+pb,100));
 return {prompt:P([`작년에 민호네 학교의 6학년 남학생 수는 여학생 수의 ${sh(k)}이었습니다. 올해에는 6학년 남학생이 ${pb}%, 여학생이 ${pg}% 늘어서 전체 6학년 학생 수가 ${N}명이 되었습니다. 올해 6학년 남학생 수를 구해 보세요.`]),
  answer:sh(Bn)+'명',
  solution:ol([`작년 여학생 수를 □명이라 하면 작년 남학생 수는 □ × ${im(k)}입니다.`,
   `올해 남학생 수는 □ × ${im(k)} × ${(100+pb)/100} = □ × ${im(cb)}, 올해 여학생 수는 □ × ${(100+pg)/100} = □ × ${im(cg)}입니다.`,
   `□ × (${im(cb)} + ${im(cg)}) = □ × ${im(sum)} = ${N}이므로 □ = ${N} ÷ ${im(sum)} = ${sh(G)}입니다.`,
   `작년 남학생은 ${sh(G)} × ${im(k)} = ${sh(B)}(명)이므로 올해 남학생은 ${sh(B)} × ${(100+pb)/100} = ${sh(Bn)}(명)입니다.`])};}
// ops: [['×'|'÷', 표시문자열, 값], ...]
function e6e4(exprs){
 const sym=['㉠','㉡','㉢','㉣'];
 const coef=exprs.map(ops=>ops.reduce((acc,[o,,v])=>o==='×'?mul(acc,v):div(acc,v),Q(1)));
 const order=[0,1,2,3].sort((i,j)=>lt(coef[i],coef[j])?-1:1);
 const show=i=>sym[i]+exprs[i].map(([o,t])=>` ${o} ${t}`).join('');
 const conv=i=>sym[i]+exprs[i].map(([o,t,v])=>` × ${im(o==='×'?v:inv(v))}`).join('')+` = ${sym[i]} × ${im(coef[i])}`;
 return {prompt:P([`㉠, ㉡, ㉢, ㉣은 모두 0보다 큰 수이고, 다음 네 식의 계산 결과는 모두 같습니다. ㉠, ㉡, ㉢, ㉣을 비교하여 큰 수부터 차례로 기호를 써 보세요.`,
   `<p style="text-align:center">${[0,1,2,3].map(show).join(',&nbsp;&nbsp; ')}</p>`]),
  answer:order.map(i=>sym[i]).join(', '),
  solution:ol([`각 식을 곱셈 하나로 바꿉니다. 나눗셈은 나누는 수의 역수를 곱합니다.`,
   ...[0,1,2,3].map(conv).map(s=>s+'입니다.'),
   `계산 결과가 같으므로 곱하는 수가 작을수록 처음 수가 큽니다. 곱하는 수를 작은 것부터 늘어놓으면 ${order.map(i=>im(coef[i])).join(' &lt; ')}입니다.`,
   `따라서 큰 수부터 차례로 쓰면 ${order.map(i=>sym[i]).join(', ')}입니다.`])};}
function e6m1(A,B,C){
 // (1) a ÷ (b + c) × d − e
 const [a,b,c,d,e]=A,s1=add(b,D(c)),r1=sub(mul(div(D(a),s1),d),e);
 // (2) {1 − (f+g) × (h+i)} ÷ j
 const [f,g,h,i,j]=B,s2=add(f,g),s3=add(D(h),D(i)),p2=mul(s2,s3),in2=sub(Q(1),p2),r2=div(in2,j);
 // (3) k ÷ [m × {n ÷ (o × p) − q} − t]
 const [k,m,n,o,p,q,t]=C,op=mul(o,p),nd=div(n,op),mq=sub(nd,D(q)),mm=mul(m,mq),br=sub(mm,t),r3=div(D(k),br);
 return {prompt:P([`다음을 계산해 보세요.`,
   `(1) ${a} ÷ (${sh(b)} + ${c}) × ${sh(d)} − ${sh(e)}`,
   `(2) {1 − (${sh(f)} + ${sh(g)}) × (${h} + ${i})} ÷ ${sh(j)}`,
   `(3) ${k} ÷ [${sh(m)} × {${sh(n)} ÷ (${sh(o)} × ${sh(p)}) − ${q}} − ${sh(t)}]`]),
  answer:`(1) ${sh(r1)} (2) ${sh(r2)} (3) ${sh(r3)}`,
  solution:ol([`(1) ${sh(b)} + ${c} = ${im(b)} + ${im(D(c))} = ${im(s1)}이고, ${a} ÷ ${im(s1)} = ${im(div(D(a),s1))}입니다.`,
   `${im(div(D(a),s1))} × ${sh(d)} = ${sh(mul(div(D(a),s1),d))}이고, ${sh(mul(div(D(a),s1),d))} − ${sh(e)} = ${sh(r1)}입니다.`,
   `(2) ${sh(f)} + ${sh(g)} = ${im(s2)}, ${h} + ${i} = ${im(s3)}이므로 ${im(s2)} × ${im(s3)} = ${im(p2)}입니다.`,
   `1 − ${im(p2)} = ${im(in2)}이고, ${im(in2)} ÷ ${sh(j)} = ${im(in2)} × ${im(inv(j))} = ${sh(r2)}입니다.`,
   `(3) 가장 안쪽 괄호: ${sh(o)} × ${sh(p)} = ${im(o)} × ${im(p)} = ${im(op)}입니다.`,
   `중괄호: ${sh(n)} ÷ ${im(op)} = ${im(n)} × ${im(inv(op))} = ${im(nd)}이고, ${im(nd)} − ${q} = ${im(mq)}입니다.`,
   `대괄호: ${sh(m)} × ${im(mq)} = ${im(mm)}이고, ${im(mm)} − ${sh(t)} = ${im(br)}입니다.`,
   `따라서 ${k} ÷ ${im(br)} = ${im(D(k))} × ${im(inv(br))} = ${sh(r3)}입니다.`])};}
function e6m2(a,mi,se,dist,fuel,h){
 const t=add(Q(mi),Q(se,60)),vm=div(D(a),t),vh=mul(vm,Q(60)),go=mul(vh,h),pk=div(D(fuel),dist),ans=mul(go,pk);
 return {prompt:P([`${mi}분 ${se}초 동안 ${a} km를 달리는 자동차가 있습니다. 이 자동차가 ${sh(dist)} km를 달리는 데 ${fuel} L의 휘발유를 사용했다면, 같은 빠르기로 ${sh(h)}시간 동안 달리는 데 필요한 휘발유는 몇 L인가요?`]),
  answer:sh(ans)+' L',
  solution:ol([`${mi}분 ${se}초는 ${sh(t)}분이므로 1분 동안 달리는 거리는 ${a} ÷ ${sh(t)} = ${im(D(a))} × ${im(inv(t))} = ${sh(vm)} (km)입니다.`,
   `1시간(60분) 동안 ${sh(vm)} × 60 = ${sh(vh)} (km)를 달리므로 ${sh(h)}시간 동안 ${sh(vh)} × ${im(h)} = ${sh(go)} (km)를 달립니다.`,
   `1 km를 달리는 데 필요한 휘발유는 ${fuel} ÷ ${sh(dist)} = ${im(D(fuel))} × ${im(inv(dist))} = ${im(pk)} (L)입니다.`,
   `따라서 필요한 휘발유는 ${sh(go)} × ${im(pk)} = ${sh(ans)} (L)입니다.`])};}
function e6m3(a,b,c,d,e){
 const x=mul(D(a),b),y=div(c,d),dif=lt(x,y)?sub(y,x):sub(x,y),ans=add(dif,e);
 return {prompt:P([`${a}의 ${sh(b)}배와 ${sh(c)}를 ${sh(d)}로 나눈 몫의 차보다 ${sh(e)}만큼 큰 수는 얼마인가요?`]),
  answer:sh(ans),
  solution:ol([`${a}의 ${sh(b)}배는 ${a} × ${sh(b)} = ${im(D(a))} × ${im(b)} = ${sh(x)}입니다.`,
   `${sh(c)} ÷ ${sh(d)} = ${im(c)} × ${im(inv(d))} = ${sh(y)}입니다.`,
   dif[0]===0?`두 값이 같으므로 차는 0입니다.`:`두 값의 차는 ${lt(x,y)?`${sh(y)} − ${sh(x)}`:`${sh(x)} − ${sh(y)}`} = ${sh(dif)}입니다.`,
   `구하는 수는 ${sh(dif)} + ${sh(e)} = ${sh(ans)}입니다.`])};}
function e6m4(p,q,dec,d1){
 const k=mul(D(p),q),dk=sub(Q(1),k),A=div(D(dec),dk),d2=div(mul(A,Q(2)),d1);
 return {prompt:P([`어떤 마름모의 두 대각선의 길이를 각각 ${p}배, ${sh(q)}배 하였더니 넓이가 처음보다 ${dec} cm² 줄었습니다. 처음 마름모의 한 대각선의 길이가 ${sh(d1)} cm일 때, 다른 대각선의 길이를 구해 보세요.`]),
  answer:sh(d2)+' cm',
  solution:ol([`두 대각선을 ${p}배, ${sh(q)}배 하면 넓이는 ${im(D(p))} × ${im(q)} = ${im(k)}(배)가 됩니다.`,
   `넓이가 처음 넓이의 1 − ${im(k)} = ${im(dk)}만큼 줄었으므로 처음 넓이는 ${dec} ÷ ${im(dk)} = ${sh(A)} (cm²)입니다.`,
   `마름모의 넓이는 (한 대각선) × (다른 대각선) ÷ 2이므로 다른 대각선은 ${sh(A)} × 2 ÷ ${sh(d1)} = ${im(mul(A,Q(2)))} × ${im(inv(d1))} = ${sh(d2)} (cm)입니다.`])};}
function e6m5(W1,k,W2){
 const lost=sub(D(W1),W2),drink=mul(lost,Q(k)),bottle=sub(D(W1),drink),ans=div(drink,bottle);
 return {prompt:P([`음료수가 담긴 병의 무게를 재었더니 ${W1} kg이었고, 들어 있던 음료수의 ${ff(1,k)}을(를) 마시고 난 후 무게를 재었더니 ${sh(W2)} kg이었습니다. 처음 병에 들어 있던 음료수의 무게는 병의 무게의 몇 배인가요?`]),
  answer:sh(ans)+'배',
  solution:ol([`마신 음료수의 무게는 ${W1} − ${sh(W2)} = ${im(D(W1))} − ${im(W2)} = ${im(lost)} (kg)입니다.`,
   `이것이 음료수 전체의 ${ff(1,k)}이므로 처음 음료수의 무게는 ${im(lost)} × ${k} = ${sh(drink)} (kg)입니다.`,
   `병의 무게는 ${W1} − ${sh(drink)} = ${sh(bottle)} (kg)입니다.`,
   `따라서 ${sh(drink)} ÷ ${sh(bottle)} = ${im(drink)} × ${im(inv(bottle))} = ${sh(ans)}(배)입니다.`])};}
function e6m6(W,H,s){
 const wq=M(...W),sq=M(...s),hq=D(H),nw=Math.floor(wq[0]*sq[1]/(wq[1]*sq[0])),nh=Math.floor(hq[0]*sq[1]/(hq[1]*sq[0]));
 const Wl=`${W[0]}과 ${W[2]}분의 ${W[1]}`;
 return {prompt:P([`그림과 같은 직사각형 모양의 도화지를 잘라서 한 변의 길이가 ${mx(...s)} cm인 정사각형을 최대한 많이 만들려고 합니다. 정사각형은 모두 몇 개 만들 수 있나요?`,rectSvg(W,Wl,H)]),
  answer:(nw*nh)+'개',
  solution:ol([`가로 ${mx(...W)} cm에는 ${mx(...W)} ÷ ${mx(...s)} = ${im(wq)} × ${im(inv(sq))} = ${sh(div(wq,sq))}이므로 정사각형을 ${nw}개까지 놓을 수 있습니다.`,
   `세로 ${H} cm에는 ${H} ÷ ${mx(...s)} = ${im(hq)} × ${im(inv(sq))} = ${sh(div(hq,sq))}이므로 정사각형을 ${nh}개까지 놓을 수 있습니다.`,
   `따라서 정사각형은 모두 ${nw} × ${nh} = ${nw*nh}(개) 만들 수 있습니다.`])};}

// ---------- 문항 ----------
const pool=(key,rc,arr,extra)=>Object.assign({key,resultContract:rc,answerVisualRequired:false,pool:arr},extra||{});
const ITEMS={
 '6-2-u1-e1-exploration':pool('source62U1E1Exploration1','explanation',[
   e1(5,8,4,7,Q(3,4),Q(5,8),Q(1,63),Q(3,7),Q(4,81)),
   e1(3,5,2,9,Q(5,6),Q(3,4),Q(1,45),Q(2,9),Q(3,50)),
   e1(4,9,5,7,Q(2,3),Q(4,7),Q(1,56),Q(3,8),Q(5,42))]),
 '6-2-u1-e3-exploration':pool('source62U1E3Exploration1','multi-value',[
   e3(6,3,4,5,[1,3,4,7,8,9]),e3(4,3,1,2,[1,3,5,6,7,9]),e3(6,4,2,3,[1,2,4,5,7,8])]),
 '6-2-u1-e5-mission-2':pool('source62U1E5Mission2','single-value',[
   m52(Q(3,4),M(1,1,6),84),m52(Q(5,6),M(1,1,4),69),m52(Q(4,5),M(1,1,8),90)]),
 '6-2-u1-e5-mission-3':pool('source62U1E5Mission3','single-value',[
   m53(M(1,2,3),Q(1,3),Q(3,4),Q(3,5),45),m53(M(1,1,2),Q(1,5),Q(3,4),Q(2,3),56),m53(M(1,3,4),Q(1,3),Q(1,2),Q(5,7),60)]),
 '6-2-u1-e5-mission-4':pool('source62U1E5Mission4','single-value',[
   m54(Q(4,5),Q(6,5),120,Q(3,5),Q(7,5)),m54(Q(5,7),Q(7,6),100,Q(1,2),Q(3,2)),m54(Q(2,3),Q(9,8),180,Q(3,4),Q(7,6))]),
 '6-2-u1-e5-mission-5':pool('source62U1E5Mission5','single-value',[
   m55(1,25,M(70,5,6),30,75),m55(1,10,M(52,1,2),40,80),m55(1,20,M(74,2,3),15,70)]),
 '6-2-u1-e5-mission-6':pool('source62U1E5Mission6','single-value',[
   m56(Q(1,2),Q(1,5),M(1,2,5)),m56(Q(2,3),Q(1,4),M(2,4,9)),m56(Q(3,4),Q(1,3),M(2,1,6))]),
 '6-2-u1-e6-exploration':pool('source62U1E6Exploration1','single-value',[
   e6x(4,M(6,2,3),M(9,2,5),'1156.2'),e6x(3,M(4,1,2),M(12,4,5),'1100.8'),e6x(5,M(8,3,4),M(7,3,5),'1124.8')]),
 '6-2-u1-e6-example-1':pool('source62U1E6Example1','single-value',[e6e1('3.2',Q(4,5)),e6e1('4.5',Q(3,4)),e6e1('5.6',Q(4,5))]),
 '6-2-u1-e6-example-2':pool('source62U1E6Example2','single-value',[
   e6e2(Q(2,5),Q(3,4),'3.5',Q(1,10)),e6e2(Q(1,3),Q(1,2),'2.5',Q(1,4)),e6e2(Q(1,4),Q(2,3),'4.5',Q(1,8))]),
 '6-2-u1-e6-example-3':pool('source62U1E6Example3','single-value',[e6e3(Q(3,4),4,3,362),e6e3(Q(4,5),5,2,279),e6e3(Q(2,3),5,4,261)]),
 '6-2-u1-e6-example-4':pool('source62U1E6Example4','single-value',[
   e6e4([[['×',ff(3,5),Q(3,5)],['÷','1.6',D('1.6')]],[['÷','0.3',D('0.3')],['×',mx(1,7,8),M(1,7,8)]],[['×','0.25',D('0.25')],['×',mx(2,2,3),M(2,2,3)]],[['÷',ff(4,5),Q(4,5)],['÷','1.2',D('1.2')]]]),
   e6e4([[['×',ff(2,3),Q(2,3)],['÷','0.8',D('0.8')]],[['÷','0.4',D('0.4')],['×',mx(1,1,5),M(1,1,5)]],[['×','0.75',D('0.75')],['×',mx(1,1,2),M(1,1,2)]],[['÷',ff(5,6),Q(5,6)],['÷','1.5',D('1.5')]]]),
   e6e4([[['×',ff(5,8),Q(5,8)],['÷','0.5',D('0.5')]],[['÷','0.6',D('0.6')],['×',mx(1,1,2),M(1,1,2)]],[['×','0.4',D('0.4')],['×',mx(1,3,4),M(1,3,4)]],[['÷',ff(3,4),Q(3,4)],['÷','2.4',D('2.4')]]])]),
 '6-2-u1-e6-mission-1':pool('source62U1E6Mission1','multi-value',[
   e6m1(['0.75',Q(1,2),'0.125',M(6,1,4),M(3,1,2)],[Q(1,2),Q(1,3),'0.25','0.2',Q(1,6)],['0.64',M(2,8,21),M(4,1,3),M(1,6,7),M(3,1,3),'0.6',Q(3,14)]),
   e6m1(['0.6',Q(1,4),'0.15',M(3,1,3),M(2,1,2)],[Q(1,3),Q(1,4),'0.4','0.2',Q(1,5)],['1.35',M(1,7,8),M(4,1,5),M(1,2,5),M(2,1,2),'0.8',Q(2,3)]),
   e6m1(['0.9',Q(1,5),'0.25',M(4,1,2),M(5,1,3)],[Q(1,4),Q(1,6),'0.5','0.1',Q(1,3)],['0.36',M(2,2,5),M(5,1,4),M(2,1,4),M(1,1,3),'1.5',Q(4,7)])]),
 '6-2-u1-e6-mission-2':pool('source62U1E6Mission2','single-value',[
   e6m2('3.5',2,20,M(47,1,4),'5.4',Q(2,3)),e6m2('4.2',3,30,M(36,2,5),'4.2',Q(3,4)),e6m2('2.8',2,40,M(50,2,5),'4.5',Q(5,6))]),
 '6-2-u1-e6-mission-3':pool('source62U1E6Mission3','single-value',[
   e6m3('1.25',M(1,3,5),M(3,4,5),M(1,9,10),M(6,4,5)),e6m3('1.75',M(1,1,7),M(4,1,2),M(1,4,5),M(3,2,3)),e6m3('2.25',M(1,1,3),M(5,3,5),M(2,1,3),M(2,3,4))]),
 '6-2-u1-e6-mission-4':pool('source62U1E6Mission4','single-value',[
   e6m4('0.8',M(1,1,5),'5.3',M(10,3,5)),e6m4('0.75',M(1,1,4),'6.25',M(12,1,2)),e6m4('0.6',M(1,1,2),'6.3',M(8,2,5))]),
 '6-2-u1-e6-mission-5':pool('source62U1E6Mission5','single-value',[
   e6m5('1.6',8,M(1,37,80)),e6m5('2.1',6,M(1,17,20)),e6m5('1.8',5,M(1,27,50))]),
 '6-2-u1-e6-mission-6':pool('source62U1E6Mission6','single-value',[
   e6m6([48,3,5],'31.9',[5,9,10]),e6m6([35,1,5],'22.6',[3,7,10]),e6m6([52,1,2],'30.8',[6,1,4])]),
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
