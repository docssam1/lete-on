// 황소 6-2 4단원 개념탐구 5 (비례배분) 원문 구조 유형. 각 문항은 원문과 같은 구조로 수만 바꾼 검증 변형 3개를 가집니다.
(function(root){'use strict';
const GROUP='6-2-u4-e5';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;
const gcd=(a,b)=>b?gcd(b,a%b):a;
const lcm=(a,b)=>a/gcd(a,b)*b;
const rt=(...a)=>a.join(' : ');
const eq2=(a,b,c,d)=>(a===c&&b===d)?`${a} : ${b}`:`${a} : ${b}＝${c} : ${d}`; // 같은 비면 한 번만 씀
const ol=steps=>'<ol>'+steps.map(s=>`<li>${s}</li>`).join('')+'</ol>';
const svgOpen=(w,h,label)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" style="width:100%;max-width:360px;height:auto;display:block;margin:8px auto;font-family:inherit">`;

// ---------- 개념탐구 (1) 투자 이익금 + (2) 선분의 비 ----------
function lineFig(pos){ // pos: ㄱ,ㄴ,ㄷ,ㄹ,ㅁ,ㅂ 위치(0~1)
  const names=['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ'],x0=20,x1=330,y=22;
  let s=svgOpen(350,52,'선분 위의 점 ㄱ, ㄴ, ㄷ, ㄹ, ㅁ, ㅂ');
  s+=`<line x1="${x0}" y1="${y}" x2="${x1}" y2="${y}" style="stroke:#222;stroke-width:1.4px"/>`;
  pos.forEach((p,i)=>{const x=(x0+(x1-x0)*p).toFixed(1);
    s+=`<line x1="${x}" y1="${y-7}" x2="${x}" y2="${y+7}" style="stroke:#222;stroke-width:1.4px"/>`;
    s+=`<text x="${x}" y="${y+24}" text-anchor="middle" style="font-size:14px;fill:#222">${names[i]}</text>`;});
  return s+'</svg>';
}
function exploration(P){
  const {T,Pr,A,r1,r2}=P;
  const B=Pr-A,g=gcd(A,B),ra=A/g,rb=B/g,ans1=T*rb/(ra+rb);
  const s1=r1.reduce((a,b)=>a+b),s2=r2.reduce((a,b)=>a+b),L=lcm(s1,s2),k1=L/s1,k2=L/s2;
  const C=r1[0]*k1,M=(r1[0]+r1[1])*k1,N=r2[0]*k2,R=(r2[0]+r2[1])*k2;
  const nd=C-N,rm=M-R,g2=gcd(nd,rm),ga=nd/g2,na=rm/g2;
  const fig=lineFig([0,N/L,C/L,R/L,M/L,1]);
  const prompt=`<p>(1) 갑과 을이 함께 ${T}만 원을 투자하여 ${Pr}만 원의 이익금을 얻었습니다. 이익금을 두 사람이 투자한 금액의 비로 비례배분하였더니 갑이 받은 이익금이 ${A}만 원이었습니다. 을이 투자한 금액은 얼마입니까?</p>`+
    `<p>(2) 다음 그림에서 선분의 길이는 아래 두 식을 모두 만족합니다. 선분 ㄴㄷ과 선분 ㄹㅁ의 길이의 비를 간단한 자연수의 비 가 : 나로 나타낼 때, 가＋나의 값은 얼마입니까?</p>`+fig+
    `<p>㉠ (선분 ㄱㄷ) : (선분 ㄷㅁ) : (선분 ㅁㅂ) = ${rt(...r1)}</p><p>㉡ (선분 ㄱㄴ) : (선분 ㄴㄹ) : (선분 ㄹㅂ) = ${rt(...r2)}</p>`;
  const answer=`(1) ${ans1}만 원, (2) ${ga+na}`;
  const solution=`<p>(1)</p>`+ol([
    `을이 받은 이익금은 ${Pr}－${A}＝${B}(만 원)입니다.`,
    `이익금의 비가 갑 : 을＝${eq2(A,B,ra,rb)}이므로 투자한 금액의 비도 ${ra} : ${rb}입니다.`,
    `을이 투자한 금액은 ${T}×${ff(rb,ra+rb)}＝${ans1}(만 원)입니다.`])+
    `<p>(2)</p>`+ol([
    `㉠의 비의 합은 ${s1}, ㉡의 비의 합은 ${s2}이므로 선분 ㄱㅂ의 길이를 ${s1}, ${s2}의 최소공배수인 ${L}로 놓습니다.`,
    `㉠에서 선분 ㄱㄷ＝${C}, 선분 ㄷㅁ＝${r1[1]*k1}, 선분 ㅁㅂ＝${r1[2]*k1}입니다.`,
    `㉡에서 선분 ㄱㄴ＝${N}, 선분 ㄴㄹ＝${r2[1]*k2}, 선분 ㄹㅂ＝${r2[2]*k2}입니다.`,
    `선분 ㄴㄷ＝${C}－${N}＝${nd}, 선분 ㄹㅁ＝${r2[2]*k2}－${r1[2]*k1}＝${rm}입니다.`,
    `선분 ㄴㄷ : 선분 ㄹㅁ＝${eq2(nd,rm,ga,na)}이므로 가＋나＝${ga}＋${na}＝${ga+na}입니다.`]);
  return {prompt,answer,solution};
}

// ---------- 예제 1 ----------
function ex1(P){const {N,a,b,m}=P,c=b*m,s=a+b+c,ans=N*c/s;
  return {prompt:`<p>구슬 ${N}개를 민우, 호준, 승주 세 사람이 나누어 가졌습니다. 민우와 호준이가 가진 구슬 수의 비는 ${a} : ${b}이고, 승주가 가진 구슬은 호준이가 가진 구슬의 ${m}배입니다. 승주가 가진 구슬은 몇 개입니까?</p>`,
  answer:`${ans}개`,
  solution:ol([`승주의 구슬은 호준이의 ${m}배이므로 호준 : 승주＝${b} : ${c}입니다.`,
    `민우 : 호준 : 승주＝${a} : ${b} : ${c}이고, 비의 합은 ${s}입니다.`,
    `승주가 가진 구슬은 ${N}×${ff(c,s)}＝${ans}(개)입니다.`])};}

// ---------- 예제 2 ----------
function ex2(P){const {N,M,p,q,r,s}=P,na=N*p/(p+q),nb=N*q/(p+q),u=na*r+nb*s,k=M/u,ans=r*k;
  return {prompt:`<p>은지는 사과와 배를 합하여 ${N}개를 사고 ${M}원을 냈습니다. 산 사과와 배의 개수의 비는 ${p} : ${q}이고, 사과와 배 한 개의 값의 비는 ${r} : ${s}입니다. 사과 한 개의 값은 얼마입니까?</p>`,
  answer:`${ans}원`,
  solution:ol([`사과는 ${N}×${ff(p,p+q)}＝${na}(개), 배는 ${N}×${ff(q,p+q)}＝${nb}(개)입니다.`,
    `사과 한 개의 값을 ${r}×□원, 배 한 개의 값을 ${s}×□원이라 하면 ${na}×${r}×□＋${nb}×${s}×□＝${na*r}×□＋${nb*s}×□＝${u}×□입니다.`,
    `${u}×□＝${M}이므로 □＝${M}÷${u}＝${k}입니다.`,
    `사과 한 개의 값은 ${r}×${k}＝${ans}(원)입니다.`])};}

// ---------- 예제 3 ----------
function ex3(P){const {a,b,p,q,H}=P,h=a+b,u=h/(p+q),w=p*u,l=q*u,A=a*b,B=w*l,t=H*60*A/B,hh=Math.floor(t/60),mm=t%60;
  return {prompt:`<p>둘레가 같은 직사각형 모양의 참외밭 ㉮와 ㉯가 있습니다. 참외밭 ㉮의 가로는 ${a} m, 세로는 ${b} m이고, 참외밭 ㉯의 가로와 세로의 비는 ${p} : ${q}입니다. 마을 청년들이 일정한 빠르기로 참외밭 ㉯ 전체를 일구는 데 ${H}시간이 걸렸다면, 같은 빠르기로 참외밭 ㉮ 전체를 일구는 데는 몇 시간 몇 분이 걸리겠습니까?</p>`,
  answer:`${hh}시간 ${mm}분`,
  solution:ol([`참외밭 ㉮의 둘레는 (${a}＋${b})×2＝${2*h}(m)이므로 참외밭 ㉯의 가로와 세로의 합은 ${h} m입니다.`,
    `참외밭 ㉯의 가로는 ${h}×${ff(p,p+q)}＝${w}(m), 세로는 ${h}×${ff(q,p+q)}＝${l}(m)이므로 넓이는 ${w}×${l}＝${B}(m²)입니다.`,
    `참외밭 ㉮의 넓이는 ${a}×${b}＝${A}(m²)입니다.`,
    `빠르기가 일정하므로 걸리는 시간은 넓이에 비례합니다. ${H}시간＝${H*60}분이므로 ㉮를 일구는 데 걸리는 시간은 ${H*60}×${A}÷${B}＝${t}(분)입니다.`,
    `${t}분＝${hh}시간 ${mm}분입니다.`])};}

// ---------- 예제 4 ----------
function triFig(r1,r2){ // r1=ㄱㄹ/ㄱㄷ, r2=ㄴㅁ/ㄴㄷ
  const G=[270,24],N=[22,150],D=[330,150];
  const R=[G[0]+(D[0]-G[0])*r1,G[1]+(D[1]-G[1])*r1],M=[N[0]+(D[0]-N[0])*r2,150];
  const f=v=>v.toFixed(1),cen=(...p)=>[p.reduce((s,q)=>s+q[0],0)/p.length,p.reduce((s,q)=>s+q[1],0)/p.length];
  const st='style="fill:none;stroke:#222;stroke-width:1.4px"';
  let s=svgOpen(350,176,'삼각형 ㄱㄴㄷ을 세 삼각형 ㉮, ㉯, ㉰로 나눈 그림');
  s+=`<polygon points="${G.map(f)} ${N.map(f)} ${D.map(f)}" ${st}/>`;
  s+=`<line x1="${f(G[0])}" y1="${f(G[1])}" x2="${f(M[0])}" y2="${f(M[1])}" ${st}/>`;
  s+=`<line x1="${f(R[0])}" y1="${f(R[1])}" x2="${f(M[0])}" y2="${f(M[1])}" ${st}/>`;
  const t=(x,y,c,a)=>`<text x="${f(x)}" y="${f(y)}" text-anchor="${a||'middle'}" style="font-size:14px;fill:#222">${c}</text>`;
  s+=t(G[0],G[1]-8,'ㄱ')+t(N[0]-4,N[1]+18,'ㄴ')+t(D[0]+4,D[1]+18,'ㄷ')+t(R[0]+8,R[1]+2,'ㄹ','start')+t(M[0],M[1]+19,'ㅁ');
  const c1=cen(G,N,M),c2=cen(G,M,R),c3=cen(R,M,D);
  s+=t(c1[0],c1[1]+5,'㉮')+t(c2[0],c2[1]+5,'㉯')+t(c3[0],c3[1]+5,'㉰');
  return s+'</svg>';
}
function ex4(P){const {S,a,bTxt,b2,m,n}=P; // ㄱㄹ:ㄹㄷ = a : bTxt (b2 = 2×bTxt), ㄴㅁ:ㅁㄷ = 1/m : 1/n = n : m
  const g=gcd(2*a,b2),A1=2*a/g,A2=b2/g,ga=S*n/(n+m),rest=S-ga,gb=rest*A1/(A1+A2),gc=rest-gb;
  return {prompt:`<p>아래 그림은 삼각형 ㄱㄴㄷ을 ㉮, ㉯, ㉰ 3개의 삼각형으로 나눈 것입니다. 선분 ㄱㄹ과 선분 ㄹㄷ의 길이의 비는 ${a} : ${bTxt}이고, 선분 ㄴㅁ과 선분 ㅁㄷ의 길이의 비는 ${ff(1,m)} : ${ff(1,n)}입니다. 삼각형 ㄱㄴㄷ의 넓이가 ${S} cm²일 때, 삼각형 ㉮, ㉯, ㉰의 넓이를 각각 구하시오.</p>`+triFig(A1/(A1+A2),n/(n+m)),
  answer:`㉮ ${ga} cm², ㉯ ${gb} cm², ㉰ ${gc} cm²`,
  solution:ol([`선분 ㄴㅁ : 선분 ㅁㄷ＝${ff(1,m)} : ${ff(1,n)}＝(${ff(1,m)}×${m*n}) : (${ff(1,n)}×${m*n})＝${n} : ${m}입니다.`,
    `삼각형 ㉮와 삼각형 ㄱㅁㄷ은 높이가 같으므로 넓이의 비는 밑변의 비 ${n} : ${m}입니다. ㉮의 넓이는 ${S}×${ff(n,n+m)}＝${ga}(cm²), 삼각형 ㄱㅁㄷ의 넓이는 ${S}－${ga}＝${rest}(cm²)입니다.`,
    `선분 ㄱㄹ : 선분 ㄹㄷ＝${a} : ${bTxt}＝${A1} : ${A2}이고, 삼각형 ㉯와 ㉰는 높이가 같으므로 넓이의 비도 ${A1} : ${A2}입니다.`,
    `㉯의 넓이는 ${rest}×${ff(A1,A1+A2)}＝${gb}(cm²), ㉰의 넓이는 ${rest}－${gb}＝${gc}(cm²)입니다.`])};}

// ---------- Mission 1 ----------
function m1(P){const {S,fr}=P,L=fr.reduce((x,[n,d])=>lcm(x,d),1),pts=fr.map(([n,d])=>n*L/d),s=pts.reduce((x,y)=>x+y),mn=Math.min(...pts),ans=S*mn/s;
  return {prompt:`<p>세 변의 길이의 합이 ${S} cm인 삼각형이 있습니다. 이 삼각형의 세 변의 길이의 비는 ${fr.map(([n,d])=>ff(n,d)).join(' : ')}입니다. 가장 짧은 변의 길이는 몇 cm입니까?</p>`,
  answer:`${ans} cm`,
  solution:ol([`분모 ${fr.map(([n,d])=>d).join(', ')}의 최소공배수는 ${L}이므로 비의 각 항에 ${L}씩 곱하면 ${rt(...pts)}입니다.`,
    `비의 합은 ${s}이고 가장 짧은 변은 비의 ${mn}에 해당합니다.`,
    `가장 짧은 변의 길이는 ${S}×${ff(mn,s)}＝${ans}(cm)입니다.`])};}

// ---------- Mission 2 ----------
function m2(P){const {p,q,an,ad,bn,bd,avg,avgTxt,totTxt,unitTxt,ans}=P; // 가:나=p:q, 나×(an/ad)=다×(bn/bd)
  // 나 : 다 = bn/bd : an/ad
  const xn=bn*ad,xd=an*bd,g=gcd(xn,xd),nb=xn/g,nc=xd/g,L=lcm(q,nb),A=p*L/q,B=L,C=nc*L/nb,s=A+B+C;
  return {prompt:`<p>세 수 가, 나, 다가 있습니다. 가 : 나＝${p} : ${q}이고, 나×${ff(an,ad)}＝다×${ff(bn,bd)}입니다. 세 수 가, 나, 다의 평균이 ${avgTxt}일 때, 나의 값을 구하시오.</p>`,
  answer:`${ans}`,
  solution:ol([`나×${ff(an,ad)}＝다×${ff(bn,bd)}이므로 나 : 다＝${ff(bn,bd)} : ${ff(an,ad)}＝${nb} : ${nc}입니다.`,
    `가 : 나＝${eq2(p,q,A,B)}, 나 : 다＝${eq2(nb,nc,B,C)}이므로 가 : 나 : 다＝${A} : ${B} : ${C}입니다.`,
    `세 수의 합은 ${avgTxt}×3＝${totTxt}이고, 비의 합은 ${s}입니다.`,
    `나＝${totTxt}÷${s}×${B}＝${unitTxt}×${B}＝${ans}입니다.`])};}

// ---------- Mission 3 ----------
function m3(P){const {a,b,c,d,E,sumTxt,unitTxt,ans}=P; // 가로:세로=a:b, 가로:높이=c:d
  const L=lcm(a,c),W=L,D=b*L/a,H=d*L/c,s=W+D+H;
  return {prompt:`<p>어떤 직육면체에서 밑면의 가로와 세로의 길이의 비는 ${a} : ${b}이고, 직육면체의 가로와 높이의 비는 ${c} : ${d}입니다. 이 직육면체의 모든 모서리의 길이의 합이 ${E} cm일 때, 높이는 몇 cm입니까?</p>`,
  answer:`${ans} cm`,
  solution:ol([`가로 : 세로＝${eq2(a,b,W,D)}, 가로 : 높이＝${eq2(c,d,W,H)}이므로 가로 : 세로 : 높이＝${W} : ${D} : ${H}입니다.`,
    `직육면체에는 가로, 세로, 높이와 길이가 같은 모서리가 각각 4개씩 있으므로 가로, 세로, 높이의 합은 ${E}÷4＝${sumTxt}(cm)입니다.`,
    `비의 합은 ${s}이므로 높이는 ${sumTxt}÷${s}×${H}＝${unitTxt}×${H}＝${ans}(cm)입니다.`])};}

// ---------- Mission 4 ----------
function m4(P){const {N,M,p,q,x,y}=P; // 사탕 x개 값 = 초콜릿 y개 값 → 사탕 : 초콜릿 한 개 값 = y : x
  const nc=N*p/(p+q),nd=N*q/(p+q),u=nc*y+nd*x,k=M/u,ans=y*k;
  return {prompt:`<p>사탕과 초콜릿을 합하여 ${N}개를 사고 ${M}원을 지불했습니다. 산 사탕 수와 초콜릿 수의 비는 ${p} : ${q}이고, 사탕 ${x}개의 가격과 초콜릿 ${y}개의 가격이 같았습니다. 사탕 한 개의 가격은 얼마인지 구하시오.</p>`,
  answer:`${ans}원`,
  solution:ol([`사탕은 ${N}×${ff(p,p+q)}＝${nc}(개), 초콜릿은 ${N}×${ff(q,p+q)}＝${nd}(개)입니다.`,
    `사탕 ${x}개의 가격과 초콜릿 ${y}개의 가격이 같으므로 사탕 한 개와 초콜릿 한 개의 가격의 비는 ${y} : ${x}입니다.`,
    `사탕 한 개의 가격을 ${y}×□원, 초콜릿 한 개의 가격을 ${x}×□원이라 하면 ${nc}×${y}×□＋${nd}×${x}×□＝${u}×□＝${M}이므로 □＝${M}÷${u}＝${k}입니다.`,
    `사탕 한 개의 가격은 ${y}×${k}＝${ans}(원)입니다.`])};}

// ---------- Mission 5 ----------
function m5(P){const {td,rn,rd,S}=P; // 튤립 = 전체의 1/td, 장미 = 나머지의 rn/rd
  // 장미 = (td-1)/td × rn/rd
  const pn=(td-1)*rn,pd=td*rd,g=gcd(pn,pd),qn=pn/g,qd=pd/g;
  const L=lcm(td,qd),tu=L/td,ro=qn*L/qd,s=tu+ro,T=S*tu/s,R=S*ro/s,big=R>T?'장미':'튤립',diff=Math.abs(R-T);
  return {prompt:`<p>꽃밭에 여러 종류의 꽃을 심었습니다. 꽃밭 전체의 ${ff(1,td)}에는 튤립을 심었고, 나머지의 ${ff(rn,rd)}에는 장미를 심었습니다. 튤립을 심은 부분과 장미를 심은 부분의 넓이의 합이 ${S} m²일 때, 튤립과 장미 중 어떤 꽃을 심은 부분이 몇 m² 더 넓습니까?</p>`,
  answer:`${big}, ${diff} m²`,
  solution:ol([`튤립을 심고 남은 부분은 전체의 ${ff(td-1,td)}이므로 장미를 심은 부분은 전체의 ${ff(td-1,td)}×${ff(rn,rd)}＝${ff(qn,qd)}입니다.`,
    `튤립 : 장미＝${ff(1,td)} : ${ff(qn,qd)}＝${tu} : ${ro}입니다.`,
    `튤립을 심은 부분은 ${S}×${ff(tu,s)}＝${T}(m²), 장미를 심은 부분은 ${S}×${ff(ro,s)}＝${R}(m²)입니다.`,
    `${big==='장미'?'장미를':'튤립을'} 심은 부분이 ${Math.max(R,T)}－${Math.min(R,T)}＝${diff}(m²) 더 넓습니다.`])};}

// ---------- Mission 6 ----------
function m6(P){const {a,b,c,d,x,y,z,T}=P; // 원숭이:고릴라=a:b, 고릴라:침팬지=c:d
  const L=lcm(b,c),A=a*L/b,B=L,C=d*L/c,s=A+B+C,add=x+y+z,k=(T-add)/s;
  const f1=A*k+x,f2=B*k+y,f3=C*k+z,g=gcd(gcd(f1,f2),f3);
  return {prompt:`<p>어느 동물원에서 기르는 원숭이와 고릴라 수의 비는 ${a} : ${b}, 고릴라와 침팬지 수의 비는 ${c} : ${d}입니다. 원숭이 ${x}마리, 고릴라 ${y}마리, 침팬지 ${z}마리가 새로 들어와서 이 세 가지 동물은 모두 ${T}마리가 되었습니다. 동물들이 새로 들어온 후의 원숭이, 고릴라, 침팬지의 수를 간단한 자연수의 연비로 나타내시오.</p>`,
  answer:`${f1/g}:${f2/g}:${f3/g}`,
  solution:ol([`원숭이 : 고릴라＝${eq2(a,b,A,B)}, 고릴라 : 침팬지＝${eq2(c,d,B,C)}이므로 원숭이 : 고릴라 : 침팬지＝${A} : ${B} : ${C}입니다.`,
    `처음 수를 원숭이 ${A}×□마리, 고릴라 ${B}×□마리, 침팬지 ${C}×□마리라 하면 처음 수의 합은 ${s}×□마리입니다.`,
    `새로 들어온 동물은 ${x}＋${y}＋${z}＝${add}(마리)이므로 ${s}×□＝${T}－${add}＝${T-add}, □＝${k}입니다.`,
    `처음 수는 원숭이 ${A*k}마리, 고릴라 ${B*k}마리, 침팬지 ${C*k}마리이고, 들어온 후에는 ${f1}마리, ${f2}마리, ${f3}마리입니다.`,
    `${f1}, ${f2}, ${f3}의 최대공약수는 ${g}이므로 간단한 자연수의 비로 나타내면 ${f1} : ${f2} : ${f3}＝${f1/g} : ${f2/g} : ${f3/g}입니다.`])};}

const ITEMS={
 '6-2-u4-e5-exploration':{key:'source62U4E5Exploration1',resultContract:'multi-value',pool:[
   exploration({T:1200,Pr:150,A:90,r1:[3,2,1],r2:[3,4,5]}),
   exploration({T:1500,Pr:180,A:108,r1:[3,2,1],r2:[4,5,3]}),
   exploration({T:1600,Pr:200,A:130,r1:[2,2,1],r2:[4,5,6]})]},
 '6-2-u4-e5-example-1':{key:'source62U4E5Example1',pool:[
   ex1({N:88,a:2,b:3,m:2}),ex1({N:105,a:3,b:4,m:2}),ex1({N:120,a:4,b:5,m:3})]},
 '6-2-u4-e5-example-2':{key:'source62U4E5Example2',pool:[
   ex2({N:128,M:12840,p:7,q:9,r:5,s:8}),ex2({N:96,M:6880,p:5,q:7,r:3,s:4}),ex2({N:117,M:9490,p:4,q:5,r:7,s:9})]},
 '6-2-u4-e5-example-3':{key:'source62U4E5Example3',pool:[
   ex3({a:14,b:18,p:5,q:3,H:2}),ex3({a:12,b:16,p:5,q:2,H:2}),ex3({a:14,b:26,p:7,q:3,H:3})]},
 '6-2-u4-e5-example-4':{key:'source62U4E5Example4',resultContract:'multi-value',pool:[
   ex4({S:195,a:2,bTxt:'2.5',b2:5,m:6,n:7}),ex4({S:180,a:3,bTxt:'4.5',b2:9,m:5,n:4}),ex4({S:176,a:4,bTxt:'1.5',b2:3,m:3,n:5})]},
 '6-2-u4-e5-mission-1':{key:'source62U4E5Mission1',pool:[
   m1({S:165,fr:[[2,5],[1,2],[3,4]]}),m1({S:152,fr:[[1,3],[1,2],[3,4]]}),m1({S:162,fr:[[2,3],[3,4],[5,6]]})]},
 '6-2-u4-e5-mission-2':{key:'source62U4E5Mission2',pool:[
   m2({p:3,q:2,an:1,ad:4,bn:3,bd:5,avgTxt:'262.5',totTxt:'787.5',unitTxt:'22.5',ans:270}),
   m2({p:4,q:3,an:1,ad:3,bn:2,bd:5,avgTxt:'85.5',totTxt:'256.5',unitTxt:'13.5',ans:81}),
   m2({p:5,q:4,an:1,ad:2,bn:5,bd:6,avgTxt:'199.5',totTxt:'598.5',unitTxt:'10.5',ans:210})]},
 '6-2-u4-e5-mission-3':{key:'source62U4E5Mission3',pool:[
   m3({a:5,b:3,c:4,d:3,E:141,sumTxt:'35.25',unitTxt:'0.75',ans:'11.25'}),
   m3({a:3,b:2,c:4,d:3,E:203,sumTxt:'50.75',unitTxt:'1.75',ans:'15.75'}),
   m3({a:5,b:4,c:3,d:2,E:111,sumTxt:'27.75',unitTxt:'0.75',ans:'7.5'})]},
 '6-2-u4-e5-mission-4':{key:'source62U4E5Mission4',pool:[
   m4({N:63,M:13500,p:5,q:2,x:5,y:4}),m4({N:56,M:20400,p:4,q:3,x:3,y:2}),m4({N:81,M:13050,p:7,q:2,x:4,y:3})]},
 '6-2-u4-e5-mission-5':{key:'source62U4E5Mission5',resultContract:'multi-value',pool:[
   m5({td:4,rn:8,rd:9,S:165}),m5({td:3,rn:3,rd:4,S:150}),m5({td:2,rn:2,rd:5,S:140})]},
 '6-2-u4-e5-mission-6':{key:'source62U4E5Mission6',pool:[
   m6({a:10,b:7,c:2,d:3,x:20,y:32,z:30,T:522}),m6({a:3,b:4,c:2,d:5,x:12,y:16,z:15,T:145}),m6({a:5,b:3,c:4,d:5,x:10,y:12,z:30,T:240})]},
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
