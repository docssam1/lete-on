// 황소 6-2 4단원 개념탐구 6 (비례배분의 활용) 원문 구조 유형. 원문과 같은 구조·같은 물음, 수만 바꾼 검증 변형 3개씩.
(function(root){'use strict';
const GROUP='6-2-u4-e6';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;};
const lcm=(a,b)=>a/gcd(a,b)*b;
const fr=(n,d)=>{const g=gcd(n,d);n/=g;d/=g;return d===1?String(n):ff(n,d);};
// 수 뒤 조사: 마지막으로 읽는 자리의 받침 (0 없음, 1 ㄹ, 2 그 밖의 받침)
const bat=n=>{n=Math.round(Number(n));const d=n%10;if(d)return [0,1,0,2,0,0,2,1,1,0][d];if(n%100)return 2;if(n%1000)return 2;return 2;};
const jo=(n,a,b)=>String(n)+(bat(n)?a:b); // 이/가, 을/를, 과/와, 이었/였
const ro=n=>String(n)+(bat(n)===2?'으로':'로');
const ol=steps=>'<ol>'+steps.map(s=>`<li>${s}</li>`).join('')+'</ol>';
const K=['㉮','㉯','㉰','㉱'];
const dec10=t=>(t%10===0?String(t/10):(Math.floor(t/10)+'.'+(t%10))); // 10배 정수 → 소수 한 자리
const m100=c=>{const w=Math.floor(c/100),r=c%100;return r===0?String(w):(w+'.'+(r%10===0?String(r/10):String(r).padStart(2,'0')));}; // cm → m

// 막대(물 위 부분 분수)로 물 깊이 구하기: 공통 단계
function rodSteps(above,unit){ // above: [[n,d],...]
 const sub=above.map(([n,d])=>{const g=gcd(d-n,d);return [(d-n)/g,d/g];});
 const W=sub.reduce((a,[m])=>lcm(a,m),1);
 const rods=sub.map(([m,d])=>W/m*d);
 return {sub,W,rods,sum:rods.reduce((a,b)=>a+b,0)};
}

// 개념탐구 (1)(2)
function exploration(p){
 const {above,totalCm,P,r1,r2}=p; const R=rodSteps(above); const u=totalCm/R.sum, h=R.W*u;
 const S1=r1[0]+r1[1],S2=r2[0]+r2[1],M=lcm(S1,S2),a1=r1[0]*M/S1,b1=r1[1]*M/S1,a2=r2[0]*M/S2,b2=r2[1]*M/S2,d=a2-a1,uu=P/d,ans2=a1*uu;
 const names=K.slice(0,3);
 const prompt=`<p>(1) 길이가 서로 다른 막대 ${names.join(', ')} 3개를 수조에 넣어 물의 높이를 재었더니, 물 위로 나온 부분의 길이가 각각 막대 길이의 ${above.map(([n,d])=>ff(n,d)).join(', ')}${bat(above[above.length-1][0])?'이었':'였'}습니다. 세 막대의 길이를 모두 더하면 ${m100(totalCm)} m일 때, 수조에 든 물의 높이는 몇 cm인가요?</p>`
  +`<p>※ 조건 보충: 세 막대는 모두 수조 바닥에 닿도록 수직으로 세웠습니다.</p>`
  +`<p>(2) ${P}원짜리 과자를 은정이가 사면 은정이와 지연이에게 남은 돈의 비가 ${r1[0]}:${jo(r1[1],'이','가')} 되고, 지연이가 사면 은정이와 지연이에게 남은 돈의 비가 ${r2[0]}:${jo(r2[1],'이','가')} 됩니다. 은정이가 과자를 산다면 은정이에게 남는 돈은 얼마인가요?</p>`;
 const sol=ol([
  `(1) 물 위로 나온 부분을 빼면 물에 잠긴 부분은 각각 막대 길이의 ${above.map(([n,d],i)=>`1 − ${ff(n,d)} = ${fr(R.sub[i][0],R.sub[i][1])}`).join(', ')}입니다. 잠긴 부분의 길이는 모두 물의 높이와 같습니다.`,
  `(1) 물의 높이를 ${R.W}칸이라 하면 ${names.map((k,i)=>`막대 ${k}는 ${R.W} ÷ ${fr(R.sub[i][0],R.sub[i][1])} = ${R.rods[i]}칸`).join(', ')}입니다.`,
  `(1) ${m100(totalCm)} m = ${totalCm} cm가 ${R.rods.join(' + ')} = ${R.sum}칸이므로 1칸은 ${totalCm} ÷ ${R.sum} = ${u} cm이고, 물의 높이는 ${R.W} × ${u} = ${h} cm입니다.`,
  `(2) 누가 과자를 사도 두 사람에게 남은 돈의 합은 처음 돈의 합보다 ${P}원 적으므로 두 경우의 남은 돈의 합은 같습니다.`,
  `(2) 비의 합 ${jo(S1,'과','와')} ${jo(S2,'을','를')} ${ro(M)} 맞추면 ${r1[0]}:${r1[1]} = ${a1}:${b1}, ${r2[0]}:${r2[1]} = ${a2}:${b2}입니다.`,
  `(2) 은정이의 처음 돈은 ${a1}칸 + ${P}원이고, 또 ${a2}칸이므로 ${d}칸이 ${P}원입니다. 1칸은 ${P} ÷ ${d} = ${uu}원입니다.`,
  `(2) 은정이가 과자를 사면 남는 돈은 ${a1} × ${uu} = ${ans2}원입니다.`]);
 return {prompt,answer:`(1) ${h} cm, (2) ${ans2}원`,solution:sol};
}

// 예제 6-1
function ex1(p){
 const {A,w,n,d,Bret}=p; const B=A*(w*d+n)/d; const g=gcd(A,B),ra=A/g,rb=B/g; const ans=Bret*ra/rb;
 const prompt=`<p>신제품을 개발하려고 ㉮ 회사는 ${A}만 원을 투자하였고, ㉯ 회사는 ㉮ 회사가 투자한 금액의 ${mx(w,n,d)}배를 투자하였습니다. 개발로 얻은 이익금은 두 회사가 투자한 금액의 비로 나누어, 각 회사가 투자한 금액과 함께 돌려받기로 하였습니다. ㉯ 회사가 돌려받을 금액이 ${Bret}만 원일 때, ㉮ 회사가 돌려받을 금액은 얼마인가요?</p>`;
 const sol=ol([
  `㉯ 회사가 투자한 금액은 ${A} × ${mx(w,n,d)} = ${B}(만 원)입니다.`,
  `투자한 금액의 비는 ㉮ : ㉯ = ${A} : ${B} = ${ra} : ${rb}입니다.`,
  `이익금도 ${ra} : ${ro(rb)} 나누므로, 투자금과 이익금을 합한 돌려받는 금액의 비도 ${ra} : ${rb}입니다.`,
  `㉮ 회사가 돌려받을 금액은 ${Bret} × ${fr(ra,rb)} = ${ans}(만 원)입니다.`]);
 return {prompt,answer:`${ans}만 원`,solution:sol};
}

// 예제 6-2
function ex2(p){
 const {r1,r2,T}=p; const boys=T*r2[0]/(r2[0]+r2[1]),girls=T-boys,og=boys*r1[1]/r1[0],ans=og-girls;
 const prompt=`<p>인혜네 학교 6학년의 남학생 수와 여학생 수의 비는 ${r1[0]}:${jo(r1[1],'이었','였')}습니다. 이번 달에 여학생 몇 명이 전학을 가서 남학생 수와 여학생 수의 비가 ${r2[0]}:${jo(r2[1],'이','가')} 되었고, 전체 학생 수는 ${T}명이 되었습니다. 이번 달에 전학 간 여학생은 몇 명인가요?</p>`;
 const sol=ol([
  `전학 간 학생은 여학생뿐이므로 남학생 수는 변하지 않았습니다.`,
  `이번 달 남학생은 ${T} × ${fr(r2[0],r2[0]+r2[1])} = ${boys}명, 여학생은 ${T} − ${boys} = ${girls}명입니다.`,
  `처음 남학생과 여학생의 비가 ${r1[0]}:${r1[1]}이므로 처음 여학생은 ${boys} × ${fr(r1[1],r1[0])} = ${og}명입니다.`,
  `전학 간 여학생은 ${og} − ${girls} = ${ans}명입니다.`]);
 return {prompt,answer:`${ans}명`,solution:sol};
}

// 예제 6-3
function ex3(p){
 const {T,a,b,p1,p2}=p; const L=p1*b,Rr=p2*a,g=gcd(L,Rr),sa=Rr/g,sb=L/g,ans=T*sa/(sa+sb);
 const prompt=`<p>세빈이와 윤건이가 가진 돈을 합하면 ${T}원입니다. 어머니의 생신 선물을 사려고 세빈이와 윤건이는 ${a}:${b}의 비로 돈을 내기로 하였고, 세빈이는 가진 돈의 ${p1}%를, 윤건이는 가진 돈의 ${p2}%를 냈습니다. 세빈이가 처음에 가지고 있던 돈은 얼마인가요?</p>`;
 const sol=ol([
  `세빈이가 낸 돈은 (세빈이의 돈) × ${fr(p1,100)}, 윤건이가 낸 돈은 (윤건이의 돈) × ${fr(p2,100)}입니다.`,
  `(세빈이의 돈) × ${p1} : (윤건이의 돈) × ${p2} = ${a} : ${b}이므로 외항의 곱과 내항의 곱이 같아 (세빈이의 돈) × ${p1*b} = (윤건이의 돈) × ${p2*a}입니다.`,
  `따라서 세빈이의 돈 : 윤건이의 돈 = ${p2*a} : ${p1*b} = ${sa} : ${sb}입니다.`,
  `세빈이가 처음에 가진 돈은 ${T} × ${fr(sa,sa+sb)} = ${ans}원입니다.`]);
 return {prompt,answer:`${ans}원`,solution:sol};
}

// 예제 6-4
function ex4(p){
 const {g,A,B,D}=p; const gg=gcd(g[0],g[1]),g1=g[0]/gg,g2=g[1]/gg,sA=A[0]+A[1],sB=B[0]+B[1];
 const m=lcm(sA/gcd(g1,sA),sB/gcd(g2,sB)); const X=g1*m,Y=g2*m;
 const aw=X*A[0]/sA,ab=X*A[1]/sA,bw=Y*B[0]/sB,bb=Y*B[1]/sB,W=aw+bw,Bk=ab+bb,diff=W-Bk,u=D/diff,ans=X*u;
 const prompt=`<p>㉮ 상자와 ㉯ 상자에 흰 구슬과 검은 구슬이 섞여 있습니다. ㉮ 상자와 ㉯ 상자의 구슬 전체의 비는 ${g[0]}:${g[1]}이고, 흰 구슬과 검은 구슬의 비는 ㉮ 상자가 ${A[0]}:${A[1]}, ㉯ 상자가 ${B[0]}:${B[1]}입니다. 두 상자의 구슬을 모두 합치면 흰 구슬이 검은 구슬보다 ${D}개 많습니다. ㉮ 상자의 구슬은 모두 몇 개인가요?</p>`;
 const sol=ol([
  `${gg>1?`${g[0]}:${g[1]} = ${g1}:${g2}이고, `:''}㉮ 상자는 ${ro(sA)}, ㉯ 상자는 ${ro(sB)} 나누어떨어지게 ㉮ 상자의 구슬을 ${X}칸, ㉯ 상자의 구슬을 ${Y}칸이라 합니다.`,
  `㉮ 상자의 흰 구슬은 ${X} × ${fr(A[0],sA)} = ${aw}칸, 검은 구슬은 ${ab}칸이고, ㉯ 상자의 흰 구슬은 ${Y} × ${fr(B[0],sB)} = ${bw}칸, 검은 구슬은 ${bb}칸입니다.`,
  `합치면 흰 구슬은 ${W}칸, 검은 구슬은 ${Bk}칸이므로 ${diff}칸이 ${D}개입니다. 1칸은 ${D} ÷ ${diff} = ${u}개입니다.`,
  `㉮ 상자의 구슬은 ${X} × ${u} = ${ans}개입니다.`]);
 return {prompt,answer:`${ans}개`,solution:sol};
}

// Mission 1
function mi1(p){
 const {a,b,pr,t}=p; const g=gcd(a,b),ra=a/g,rb=b/g,bp=pr*rb/(ra+rb),ans=b*t/bp;
 const prompt=`<p>갑이 ${a}만 원, 을이 ${b}만 원을 투자하여 이익금 ${pr}만 원을 받았습니다. 이 이익금을 투자한 금액의 비로 갑과 을에게 나누어 주려고 합니다. 갑과 을이 같은 비율로 다시 투자할 때 을이 받는 이익금이 ${t}만 원이 되려면 을은 얼마를 투자해야 하나요? (단, 투자한 금액에 대한 이익금의 비율은 늘 같습니다.)</p>`;
 const sol=ol([
  `투자한 금액의 비는 갑 : 을 = ${a} : ${b} = ${ra} : ${rb}입니다.`,
  `을이 받은 이익금은 ${pr} × ${fr(rb,ra+rb)} = ${bp}(만 원)입니다.`,
  `을은 ${b}만 원을 투자하여 ${bp}만 원을 받았으므로 다시 투자할 금액을 □만 원이라 하면 ${b} : ${bp} = □ : ${t}입니다.`,
  `${bp} × □ = ${b} × ${t} = ${b*t}이므로 □ = ${ans}, 을은 ${ans}만 원을 투자해야 합니다.`]);
 return {prompt,answer:`${ans}만 원`,solution:sol};
}

// Mission 2
function mi2(p){
 const {above,totalCm}=p; const R=rodSteps(above); const u=totalCm/R.sum,h=R.W*u;
 const names=K.slice(0,2);
 const prompt=`<p>길이가 서로 다른 막대 2개를 바닥이 평평한 연못의 같은 곳에 수직으로 세웠더니, 물 위로 나온 막대의 길이가 각각 막대 길이의 ${above.map(([n,d])=>ff(n,d)).join(', ')}${bat(above[above.length-1][0])?'이었':'였'}습니다. 두 막대의 길이의 합이 ${m100(totalCm)} m라면 막대를 세운 곳의 연못의 깊이는 몇 m인가요?</p>`;
 const sol=ol([
  `물에 잠긴 부분은 각각 막대 길이의 ${above.map(([n,d],i)=>`1 − ${ff(n,d)} = ${fr(R.sub[i][0],R.sub[i][1])}`).join(', ')}입니다. 잠긴 부분의 길이는 모두 연못의 깊이와 같습니다.`,
  `연못의 깊이를 ${R.W}칸이라 하면 ${names.map((k,i)=>`막대 ${k}는 ${R.W} ÷ ${fr(R.sub[i][0],R.sub[i][1])} = ${R.rods[i]}칸`).join(', ')}입니다.`,
  `${m100(totalCm)} m = ${totalCm} cm가 ${R.rods.join(' + ')} = ${R.sum}칸이므로 1칸은 ${totalCm} ÷ ${R.sum} = ${u} cm입니다.`,
  `연못의 깊이는 ${R.W} × ${u} = ${h} cm = ${m100(h)} m입니다.`]);
 return {prompt,answer:`${m100(h)} m`,solution:sol};
}

// Mission 3
function mi3(p){
 const {r1,r2,gain}=p; const S1=r1.reduce((a,b)=>a+b),S2=r2.reduce((a,b)=>a+b),M=lcm(S1,S2);
 const s1=r1.map(x=>x*M/S1),s2=r2.map(x=>x*M/S2),d=s2[0]-s1[0],u=gain/d,ans=M*u;
 const prompt=`<p>현수, 병민, 성훈이가 가진 구슬 수의 연비는 ${r1.slice(0,-1).join(':')}:${jo(r1[r1.length-1],'이었','였')}습니다. 세 사람이 구슬치기를 한 뒤 구슬 수를 연비로 나타내었더니 ${r2.slice(0,-1).join(':')}:${jo(r2[r2.length-1],'이','가')} 되었습니다. 현수가 딴 구슬이 ${gain}개라면, 세 사람이 가지고 있는 구슬은 모두 몇 개인가요?</p>`
  +`<p>※ 조건 보충: 구슬치기는 세 사람끼리만 하여 세 사람의 구슬 수의 합은 변하지 않았습니다.</p>`;
 const sol=ol([
  `세 사람의 구슬 수의 합은 변하지 않으므로 연비의 합 ${jo(S1,'과','와')} ${jo(S2,'을','를')} ${ro(M)} 맞춥니다.`,
  `${r1.join(':')} = ${s1.join(':')}, ${r2.join(':')} = ${s2.join(':')}입니다.`,
  `현수의 구슬은 ${s1[0]}칸에서 ${s2[0]}칸으로 ${d}칸 늘었고, 이것이 ${gain}개이므로 1칸은 ${gain} ÷ ${d} = ${u}개입니다.`,
  `세 사람의 구슬은 모두 ${M} × ${u} = ${ans}개입니다.`]);
 return {prompt,answer:`${ans}개`,solution:sol};
}

// Mission 4
function mi4(p){
 const {r1,r2}=p; const S1=r1[0]+r1[1],S2=r2[0]+r2[1],M=lcm(S1,S2);
 const a1=r1[0]*M/S1,b1=r1[1]*M/S1,a2=r2[0]*M/S2,b2=r2[1]*M/S2,pc=a2-a1,g=gcd(a2,b1),A=a2/g,B=b1/g;
 const prompt=`<p>어떤 물건을 갑이 사면 갑과 을에게 남은 돈의 비가 ${r1[0]}:${jo(r1[1],'이','가')} 되고, 을이 사면 갑과 을에게 남은 돈의 비가 ${r2[0]}:${jo(r2[1],'이','가')} 됩니다. 갑과 을이 처음 가지고 있는 돈의 비를 가장 간단한 자연수의 비로 나타내세요.</p>`;
 const sol=ol([
  `누가 물건을 사도 두 사람에게 남은 돈의 합은 같으므로 비의 합 ${jo(S1,'과','와')} ${jo(S2,'을','를')} ${ro(M)} 맞춥니다.`,
  `갑이 사면 ${r1[0]}:${r1[1]}${M!==S1?` = ${a1}:${b1}`:''}, 을이 사면 ${r2[0]}:${r2[1]}${M!==S2?` = ${a2}:${b2}`:''}입니다.`,
  `갑의 처음 돈은 ${a1}칸 + (물건값)이고 또 ${a2}칸이므로 물건값은 ${pc}칸입니다.`,
  `을의 처음 돈은 ${b1}칸이고, ${b2}칸 + ${pc}칸 = ${b2+pc}칸으로도 맞습니다.`,
  `갑 : 을 = ${a2} : ${b1}${g>1?` = ${A} : ${B}`:''}입니다.`]);
 return {prompt,answer:`${A}:${B}`,solution:sol};
}

// Mission 5
function mi5(p){
 const {fa,fb,w,fc,cd,T}=p; // fa,fb,fc: [n,d], w: [가물,나물], cd: 다:라 의 다 (10배 정수)
 const ca=w[0]*fa[1]/fa[0],cb=w[1]*fb[1]/fb[0],ws=w[0]+w[1],cc=ws*fc[1]/fc[0],cdd=cc*10/cd,sum=ca+cb+cc+cdd,u=T/sum,ans=cdd*u;
 const prompt=`<p>㉮ 컵에는 전체의 ${ff(fa[0],fa[1])}만큼, ㉯ 컵에는 전체의 ${ff(fb[0],fb[1])}만큼 물이 들어 있고, 그 물의 양의 비는 ${w[0]}:${w[1]}입니다. ㉮ 컵과 ㉯ 컵의 물을 합하여 ㉰ 컵에 담으면 ㉰ 컵의 ${ff(fc[0],fc[1])}만큼 채워집니다. ㉰ 컵과 ㉱ 컵의 들이의 비는 ${dec10(cd)}:1이고, ㉮, ㉯, ㉰, ㉱ 컵의 들이를 모두 더하면 ${T} mL일 때, ㉱ 컵의 들이는 몇 mL인가요?</p>`;
 const sol=ol([
  `㉮ 컵의 물을 ${w[0]}칸, ㉯ 컵의 물을 ${w[1]}칸이라 하면 ㉮ 컵의 들이는 ${w[0]} ÷ ${ff(fa[0],fa[1])} = ${ca}칸, ㉯ 컵의 들이는 ${w[1]} ÷ ${ff(fb[0],fb[1])} = ${cb}칸입니다.`,
  `두 컵의 물 ${ws}칸이 ㉰ 컵의 ${ff(fc[0],fc[1])}이므로 ㉰ 컵의 들이는 ${ws} ÷ ${ff(fc[0],fc[1])} = ${cc}칸입니다.`,
  `㉰ : ㉱ = ${dec10(cd)} : 1이므로 ㉱ 컵의 들이는 ${cc} ÷ ${dec10(cd)} = ${cdd}칸입니다.`,
  `네 컵의 들이의 합은 ${ca} + ${cb} + ${cc} + ${cdd} = ${sum}칸이고 이것이 ${T} mL이므로 1칸은 ${T} ÷ ${sum} = ${u} mL입니다.`,
  `㉱ 컵의 들이는 ${cdd} × ${u} = ${ans} mL입니다.`]);
 return {prompt,answer:`${ans} mL`,solution:sol};
}

// Mission 6
function mi6(p){
 const {r1,r2,T}=p; const S2=r2.reduce((a,b)=>a+b),u2=T/S2,n2=r2.map(x=>x*u2),u1=n2[0]/r1[0],n1=r1.map(x=>x*u1),ans=n2[1]-n1[1];
 const prompt=`<p>통 속에 들어 있는 빨간 구슬, 파란 구슬, 노란 구슬의 연비는 ${r1.join(':')}입니다. 여기에 파란 구슬과 노란 구슬을 더 넣었더니 세 가지 구슬의 연비가 ${r2.slice(0,-1).join(':')}:${ro(r2[r2.length-1])} 바뀌었고, 구슬은 모두 ${T}개가 되었습니다. 파란 구슬을 몇 개 더 넣었나요?</p>`;
 const sol=ol([
  `바뀐 뒤 연비의 합은 ${r2.join(' + ')} = ${S2}이므로 1칸은 ${T} ÷ ${S2} = ${u2}개이고, 빨간 구슬 ${n2[0]}개, 파란 구슬 ${n2[1]}개, 노란 구슬 ${n2[2]}개입니다.`,
  `빨간 구슬은 더 넣지 않았으므로 처음에도 ${n2[0]}개입니다. 처음 연비 ${r1.join(':')}에서 빨간 구슬 ${r1[0]}칸이 ${n2[0]}개${r1[0]>1?`이므로 1칸은 ${n2[0]} ÷ ${r1[0]} = ${u1}개`:''}입니다.`,
  `처음 파란 구슬은 ${r1[1]} × ${u1} = ${n1[1]}개입니다.`,
  `더 넣은 파란 구슬은 ${n2[1]} − ${n1[1]} = ${ans}개입니다.`]);
 return {prompt,answer:`${ans}개`,solution:sol};
}

const mk=(f,ps)=>ps.map(f);
const ITEMS={
 '6-2-u4-e6-exploration':{key:'source62U4E6Exploration1',resultContract:'multi-value',answerVisualRequired:false,
  answerAssumption:'세 막대는 모두 수조 바닥에 닿도록 수직으로 세웠다.',
  pool:mk(exploration,[
   {above:[[1,4],[1,10],[2,5]],totalCm:222,P:680,r1:[2,3],r2:[9,5]},
   {above:[[1,3],[1,6],[2,5]],totalCm:262,P:900,r1:[3,5],r2:[7,5]},
   {above:[[1,5],[1,4],[1,2]],totalCm:165,P:750,r1:[1,2],r2:[4,3]}])},
 '6-2-u4-e6-example-1':{key:'source62U4E6Example1',resultContract:'single-value',answerVisualRequired:false,
  pool:mk(ex1,[{A:3500,w:1,n:1,d:5,Bret:4800},{A:2400,w:1,n:1,d:4,Bret:3500},{A:3600,w:1,n:1,d:3,Bret:5600}])},
 '6-2-u4-e6-example-2':{key:'source62U4E6Example2',resultContract:'single-value',answerVisualRequired:false,
  pool:mk(ex2,[{r1:[10,7],r2:[5,3],T:192},{r1:[9,8],r2:[3,2],T:180},{r1:[8,7],r2:[4,3],T:210}])},
 '6-2-u4-e6-example-3':{key:'source62U4E6Example3',resultContract:'single-value',answerVisualRequired:false,
  pool:mk(ex3,[{T:22800,a:5,b:3,p1:15,p2:10},{T:25000,a:3,b:4,p1:10,p2:20},{T:28000,a:3,b:2,p1:25,p2:10}])},
 '6-2-u4-e6-example-4':{key:'source62U4E6Example4',resultContract:'single-value',answerVisualRequired:false,
  pool:mk(ex4,[{g:[15,9],A:[8,7],B:[3,2],D:700},{g:[4,5],A:[5,3],B:[3,2],D:400},{g:[7,5],A:[4,3],B:[3,2],D:600}])},
 '6-2-u4-e6-mission-1':{key:'source62U4E6Mission1',resultContract:'single-value',answerVisualRequired:false,
  pool:mk(mi1,[{a:180,b:120,pr:80,t:160},{a:200,b:150,pr:70,t:90},{a:250,b:150,pr:120,t:210}])},
 '6-2-u4-e6-mission-2':{key:'source62U4E6Mission2',resultContract:'single-value',answerVisualRequired:false,
  pool:mk(mi2,[{above:[[1,3],[1,4]],totalCm:340},{above:[[1,2],[1,3]],totalCm:280},{above:[[1,4],[2,5]],totalCm:450}])},
 '6-2-u4-e6-mission-3':{key:'source62U4E6Mission3',resultContract:'single-value',answerVisualRequired:false,
  answerAssumption:'구슬치기는 세 사람끼리만 하여 세 사람의 구슬 수의 합은 변하지 않았다.',
  pool:mk(mi3,[{r1:[4,7,5],r2:[6,7,8],gain:12},{r1:[3,5,4],r2:[5,4,6],gain:15},{r1:[2,5,3],r2:[3,4,5],gain:12}])},
 '6-2-u4-e6-mission-4':{key:'source62U4E6Mission4',resultContract:'single-value',answerVisualRequired:false,
  pool:mk(mi4,[{r1:[3,5],r2:[4,3]},{r1:[1,2],r2:[5,4]},{r1:[2,5],r2:[3,2]}])},
 '6-2-u4-e6-mission-5':{key:'source62U4E6Mission5',resultContract:'single-value',answerVisualRequired:false,
  pool:mk(mi5,[{fa:[1,2],fb:[1,5],w:[3,4],fc:[1,2],cd:28,T:360},{fa:[1,3],fb:[1,4],w:[2,3],fc:[1,2],cd:25,T:480},{fa:[1,4],fb:[2,5],w:[1,2],fc:[1,3],cd:15,T:600}])},
 '6-2-u4-e6-mission-6':{key:'source62U4E6Mission6',resultContract:'single-value',answerVisualRequired:false,
  pool:mk(mi6,[{r1:[3,4,6],r2:[6,9,14],T:145},{r1:[2,3,4],r2:[4,7,9],T:200},{r1:[1,2,3],r2:[3,7,10],T:160}])},
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
