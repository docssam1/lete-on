// 황소 6-2 4단원 비례식과 비례배분, 개념탐구 4(연비) 원문 구조 유형. 각 문항은 같은 구조·다른 수의 검증된 3개 풀을 가집니다.
(function(root){'use strict';
const GROUP='6-2-u4-e4';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;
// ---- 계산·표기 도우미 ----
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const lcm=(a,b)=>a/gcd(a,b)*b;
const lcmA=a=>a.reduce(lcm);
const red=a=>{const k=a.reduce(gcd);return a.map(x=>x/k);};
const R=a=>a.join(' : ');
const fr=(n,d)=>{const k=gcd(n,d);return [n/k,d/k];};
const fs=([n,d])=>d===1?String(n):(n>d?mx(Math.floor(n/d),n%d,d):ff(n,d)); // 기약분수·대분수 표기
const bat=n=>!/[2459]$/.test(String(n)); // 숫자 끝 받침 여부
const eul=n=>n+(bat(n)?'을':'를');
const iga=n=>n+(bat(n)?'이':'가');
const ol=s=>'<ol>'+s.map(x=>`<li>${x}</li>`).join('')+'</ol>';
// "a : b" 를 간단히 한 결과 문장 조각
const simpTxt=(a,b)=>{const r=red([a,b]);return {r,txt:(r[0]===a?R([a,b]):`${R([a,b])} = ${R(r)}`)};};
// 소수 문자열 → [분자, 분모]
const dec=s=>{const [i,f='']=s.split('.');const d=Math.pow(10,f.length);return fr(parseInt(i+f,10),d);};
// [n,d] 두 수의 비 → 각 항에 곱할 수와 자연수의 비
const fracRatio=(x,y,xs,ys)=>{const m=lcm(x[1],y[1]);const a=x[0]*m/x[1],b=y[0]*m/y[1];const s=simpTxt(a,b);
 return {r:s.r,txt:(m===1?`${xs} : ${ys} = ${s.txt}`:`${xs} : ${ys}의 각 항에 ${eul(m)} 곱하면 ${s.txt}`)};};
const wa=n=>n+(bat(n)?'과':'와');
const ro=n=>n+(/[036]$/.test(String(n))?'으로':'로'); // 끝자리 1·7·8은 ㄹ받침이라 '로'
const t0=j=>j.r[0];
const ira=n=>n+(bat(n)?'이라고':'라고');
// 첫째 항이 공통인 두 비 (가:나=p:q, 가:다=r:s) 연결
const lead=(x,y,m,nm,head)=>x===y?`두 비에서 ${nm}의 값이 ${ro(x)} 같으므로`:`${head||nm+'의 값을'} ${wa(x)} ${y}의 최소공배수인 ${ro(m)} 맞추면`;
const joinFirst=(p,q,r,s,n1,n2,n3,head,eq,nm)=>{const m=lcm(p,r);const t=red([m,q*m/p,s*m/r]);
 return {r:t,txt:`${lead(p,r,m,nm||n1,head)} ${eq||n1+' : '+n2+' : '+n3+' ='} ${R(t)}입니다.`};};
// 가운데 항이 공통인 두 비 (가:나=a:b, 나:다=c:d) 연결
const joinMid=(a,b,c,d,n1,n2,n3,head,eq,nm)=>{const m=lcm(b,c);const t=red([a*m/b,m,d*m/c]);
 return {r:t,txt:`${lead(b,c,m,nm||n2,head)} ${eq||n1+' : '+n2+' : '+n3+' ='} ${R(t)}입니다.`};};

// ---- 개념탐구 본문: 이어진 비 + 최소공배수 → 세 수의 합 ----
function poolE(){return [
  {a:7,b:[3,5],c:'0.9',e:[1,2],L:1260},
  {a:5,b:[2,3],c:'0.6',e:[1,4],L:540},
  {a:3,b:[4,5],c:'0.7',e:[1,2],L:1680}].map(P=>{
  const s1=fracRatio([P.a,1],P.b,String(P.a),ff(P.b[0],P.b[1]));
  const s2=fracRatio(dec(P.c),P.e,P.c,ff(P.e[0],P.e[1]));
  const j=joinFirst(s1.r[0],s1.r[1],s2.r[1],s2.r[0],'㉮','㉯','㉰');
  const l=lcmA(j.r),k=P.L/l,v=j.r.map(x=>x*k),sum=v[0]+v[1]+v[2];
  return {prompt:`<p>자연수 ㉮, ㉯, ㉰에 대하여 ㉮ : ㉯ = ${P.a} : ${ff(P.b[0],P.b[1])}, ㉰ : ㉮ = ${P.c} : ${ff(P.e[0],P.e[1])}입니다. 세 수의 최소공배수가 ${P.L}일 때, ㉮, ㉯, ㉰의 합을 구하세요.</p>`,
   answer:String(sum),
   solution:ol([`${s1.txt}이므로 ㉮ : ㉯ = ${R(s1.r)}입니다.`,
    `${s2.txt}이므로 ㉰ : ㉮ = ${R(s2.r)}, 곧 ㉮ : ㉰ = ${R([s2.r[1],s2.r[0]])}입니다.`,
    j.txt,
    `세 수를 ${j.r[0]}×□, ${j.r[1]}×□, ${j.r[2]}×□라고 하면 ${j.r.join(', ')}의 최소공배수가 ${l}이므로 세 수의 최소공배수는 ${l}×□입니다.`,
    `${l}×□ = ${P.L}이므로 □ = ${k}입니다.`,
    `세 수는 ${v.join(', ')}이므로 합은 ${v.join(' + ')} = ${sum}입니다.`])};});}

// ---- 예제 4-1: 분수 꼴 비 두 개 → ㉠:㉡:㉢ ----
function poolX1(){return [
  {a:2,b:3,c:3,u:[3,1,5],v:[7,1,5]},
  {a:3,b:5,c:4,u:[2,1,3],v:[4,2,3]},
  {a:4,b:5,c:3,u:[1,2,7],v:[2,4,7]}].map(P=>{
  const un=P.u[0]*P.u[2]+P.u[1],vn=P.v[0]*P.v[2]+P.v[1];
  const uv=simpTxt(un,vn); // 같은 분모
  const ga=simpTxt(P.c*uv.r[0],uv.r[1]);
  const j=joinFirst(ga.r[0],ga.r[1],P.b,P.a,'㉠','㉡','㉢');
  return {prompt:`<p>${ff(1,'㉠')} : ${ff(1,'㉢')} = ${P.a} : ${P.b}이고, ${ff('㉠',P.c)} : ㉡ = ${mx(...P.u)} : ${mx(...P.v)}입니다. ㉠ : ㉡ : ㉢을 가장 간단한 자연수의 비로 나타내세요.</p>`,
   answer:R(j.r),
   solution:ol([`${ff(1,'㉠')} : ${ff(1,'㉢')} = ${P.a} : ${P.b}에서 외항의 곱과 내항의 곱이 같으므로 ${P.b} ÷ ㉠ = ${P.a} ÷ ㉢입니다. 나눈 결과가 같으므로 ㉠ : ㉢ = ${P.b} : ${P.a}입니다.`,
    `${mx(...P.u)} : ${mx(...P.v)} = ${ff(un,P.u[2])} : ${ff(vn,P.v[2])} = ${uv.txt}입니다.`,
    `${ff('㉠',P.c)} : ㉡ = ${R(uv.r)}이므로 ${ff('㉠',P.c)} = ${uv.r[0]}×□, ㉡ = ${uv.r[1]}×□라고 하면 ㉠ = ${P.c*uv.r[0]}×□입니다. 따라서 ㉠ : ㉡ = ${ga.txt}입니다.`,
    j.txt])};});}

// ---- 예제 4-2: 물병의 일부·채움 → 세 들이의 비 ----
function poolX2(){return [
  {f1:[1,2],f2:[3,5],w:[5,4],f3:[3,4]},
  {f1:[2,3],f2:[3,4],w:[4,3],f3:[5,6]},
  {f1:[1,4],f2:[3,5],w:[3,4],f3:[7,10]}].map(P=>{
  const ca=fr(P.w[0]*P.f1[1],P.f1[0]),cb=fr(P.w[1]*P.f2[1],P.f2[0]),t=P.w[0]+P.w[1],cc=fr(t*P.f3[1],P.f3[0]);
  const m=lcmA([ca[1],cb[1],cc[1]]),raw=[ca,cb,cc].map(x=>x[0]*m/x[1]),r=red(raw);
  const F=x=>ff(x[0],x[1]);
  return {prompt:`<p>물병 가, 나, 다가 있습니다. 가에는 들이의 ${F(P.f1)}만큼, 나에는 들이의 ${F(P.f2)}만큼 물이 들어 있고, 가와 나에 든 물의 양의 비는 ${R(P.w)}입니다. 가와 나의 물을 모두 비어 있는 물병 다에 부었더니 다의 ${F(P.f3)}만큼 찼습니다. 가, 나, 다의 들이의 비를 가장 간단한 자연수의 비로 나타내세요.</p>`,
   answer:R(r),
   solution:ol([`가에 든 물의 양을 ${P.w[0]}, 나에 든 물의 양을 ${ira(P.w[1])} 생각합니다.`,
    `가의 들이는 ${P.w[0]} ÷ ${F(P.f1)} = ${fs(ca)}입니다.`,
    `나의 들이는 ${P.w[1]} ÷ ${F(P.f2)} = ${fs(cb)}입니다.`,
    `다에 부은 물은 ${P.w[0]} + ${P.w[1]} = ${t}이고, 이것이 다의 들이의 ${F(P.f3)}이므로 다의 들이는 ${t} ÷ ${F(P.f3)} = ${fs(cc)}입니다.`,
    `가 : 나 : 다 = ${R([ca,cb,cc].map(fs))}${m===1?'':`의 각 항에 ${eul(m)} 곱하면 ${R(raw)}`}이고, 간단히 하면 ${R(r)}입니다.`])};});}

// ---- 예제 4-3: 기어 톱니 수의 비 → 같은 페달 회전의 거리 ----
function poolX3(){return [
  {a:[3,2],b:[5,4],D:200},
  {a:[5,4],b:[6,5],D:240},
  {a:[4,3],b:[6,5],D:250}].map(P=>{
  const j=joinMid(P.a[0],P.a[1],P.b[0],P.b[1],'1단','2단','3단','2단의 톱니 수를','1단 : 2단 : 3단의 톱니 수의 비는','2단의 톱니 수');const N=lcm(t0(j),j.r[2]),r1=N/j.r[0],r3=N/j.r[2],per=P.D/r1;const t=j.r,ans=P.D*t[0]/t[2];
  return {prompt:`<p>민지의 자전거 뒷바퀴에는 1단, 2단, 3단 기어의 톱니바퀴가 달려 있습니다. 톱니 수를 세어 보니 1단과 2단 기어의 톱니 수의 비는 ${R(P.a)}, 2단과 3단 기어의 톱니 수의 비는 ${R(P.b)}였습니다. 1단 기어에서 페달을 돌려 ${P.D} m를 달렸다면, 3단 기어에서 페달을 똑같은 횟수만큼 돌릴 때 몇 m를 가는지 구하세요.</p>`,
   answer:ans+' m',
   solution:ol([j.txt,
    `페달을 같은 횟수만큼 돌리면 체인이 지나가는 톱니 수는 1단과 3단에서 같습니다. 그 톱니 수를 ${wa(t[0])} ${t[2]}의 최소공배수인 ${ira(N)} 하면 뒷바퀴는 1단에서 ${N} ÷ ${t[0]} = ${r1}(바퀴), 3단에서 ${N} ÷ ${t[2]} = ${r3}(바퀴) 돕니다.`,
    `1단에서 뒷바퀴가 ${r1}바퀴 돌 때 ${P.D} m를 가므로 뒷바퀴가 1바퀴 돌 때 ${P.D} ÷ ${r1} = ${per} (m)를 갑니다.`,
    `따라서 3단 기어에서는 ${per} × ${r3} = ${ans} (m)를 갑니다.`])};});}

// ---- 예제 4-4: 네 마을 학생 수 ----
function poolX4(){return [
  {T:313,an:[3,4],ad:[2,5],d:7},
  {T:196,an:[2,3],ad:[3,4],d:6},
  {T:201,an:[4,5],ad:[3,2],d:9}].map(P=>{
  const s1=fracRatio([1,P.an[0]],[1,P.an[1]],ff(1,P.an[0]),ff(1,P.an[1]));
  const s2=fracRatio([1,P.ad[0]],[1,P.ad[1]],ff(1,P.ad[0]),ff(1,P.ad[1]));
  const j=joinFirst(s1.r[0],s1.r[1],s2.r[0],s2.r[1],'(가)','(나)','(다)');const t=j.r,S=t[0]+t[1]+2*t[2],k=(P.T-P.d)/S,ans=t[2]*k+P.d;
  return {prompt:`<p>윤서네 학교 학생 ${P.T}명은 모두 (가), (나), (다), (라) 네 마을에 삽니다. (가)와 (나) 마을에 사는 학생 수의 비는 ${ff(1,P.an[0])} : ${ff(1,P.an[1])}, (가)와 (다) 마을에 사는 학생 수의 비는 ${ff(1,P.ad[0])} : ${ff(1,P.ad[1])}입니다. (라) 마을에 사는 학생이 (다) 마을에 사는 학생보다 ${P.d}명 더 많을 때, (라) 마을에 사는 학생은 몇 명인지 구하세요.</p>`,
   answer:ans+'명',
   solution:ol([`${s1.txt}이므로 (가) : (나) = ${R(s1.r)}입니다.`,
    `${s2.txt}이므로 (가) : (다) = ${R(s2.r)}입니다.`,
    j.txt,
    `(가), (나), (다) 마을의 학생 수를 ${t[0]}×□, ${t[1]}×□, ${t[2]}×□라고 하면 (라) 마을의 학생 수는 ${t[2]}×□ + ${P.d}입니다.`,
    `모두 더하면 ${S}×□ + ${P.d} = ${P.T}이므로 ${S}×□ = ${P.T-P.d}, □ = ${k}입니다.`,
    `(라) 마을에 사는 학생은 ${t[2]} × ${k} + ${P.d} = ${ans}(명)입니다.`])};});}

// ---- Mission 1: 나눗셈식 → 연비 ----
function poolM1(){return [
  {a:3,b:[2,1,4],c:6,d:'2.5'},
  {a:4,b:[1,1,3],c:5,d:'1.5'},
  {a:2,b:[3,1,2],c:8,d:'3.6'}].map(P=>{
  const bn=fr(P.b[0]*P.b[2]+P.b[1],P.b[2]);
  const s1=fracRatio([P.a,1],bn,String(P.a),mx(...P.b));
  const s2=fracRatio([P.c,1],dec(P.d),String(P.c),P.d);
  const j=joinFirst(s1.r[0],s1.r[1],s2.r[0],s2.r[1],'가','나','다');
  return {prompt:`<p>다음 식을 보고 가 : 나 : 다를 가장 간단한 자연수의 비로 나타내세요.</p><p style="text-align:center">가 ÷ ${P.a} = 나 ÷ ${mx(...P.b)}, &nbsp; 가 ÷ ${P.c} = 다 ÷ ${P.d}</p>`,
   answer:R(j.r),
   solution:ol([`가 ÷ ${P.a} = 나 ÷ ${mx(...P.b)}의 값을 □라고 하면 가 = ${P.a}×□, 나 = ${mx(...P.b)}×□이므로 가 : 나 = ${P.a} : ${mx(...P.b)}입니다.`,
    `${s1.txt}입니다.`,
    `같은 방법으로 가 : 다 = ${P.c} : ${P.d}이고, ${s2.txt}입니다.`,
    j.txt])};});}

// ---- Mission 2: 세 사람의 사탕 ----
function poolM2(){return [
  {a:[3,5],b:[2,1],n:6},
  {a:[4,3],b:[5,2],n:28},
  {a:[2,3],b:[4,1],n:20}].map(P=>{
  const j=joinMid(P.a[0],P.a[1],P.b[0],P.b[1],'재용','태원','지연','태원이의 사탕 수를','재용 : 태원 : 지연의 사탕 수의 비는','태원이의 사탕 수');const t=j.r,df=t[0]-t[2],u=P.n/df,S=t[0]+t[1]+t[2];
  return {prompt:`<p>재용이와 태원이가 가진 사탕 수의 비는 ${R(P.a)}이고, 태원이와 지연이가 가진 사탕 수의 비는 ${R(P.b)}입니다. 재용이가 지연이보다 사탕을 ${P.n}개 더 많이 가지고 있다면, 세 사람이 가진 사탕은 모두 몇 개인지 구하세요.</p>`,
   answer:(u*S)+'개',
   solution:ol([j.txt,
    `재용이는 지연이보다 ${t[0]} − ${t[2]} = ${df}칸 더 많고, 이것이 ${P.n}개이므로 1칸은 ${P.n} ÷ ${df} = ${u}(개)입니다.`,
    `세 사람의 사탕은 모두 ${t[0]} + ${t[1]} + ${t[2]} = ${S}칸이므로 ${S} × ${u} = ${u*S}(개)입니다.`])};});}

// ---- Mission 3: 세 원의 공통 부분 → 넓이의 비 ----
function poolM3(){return [
  {f:[[3,10],[5,8],[4,5]]},
  {f:[[2,7],[4,9],[2,3]]},
  {f:[[3,8],[3,5],[6,7]]}].map(P=>{
  const v=P.f.map(x=>fr(x[1],x[0])),m=lcmA(v.map(x=>x[1])),raw=v.map(x=>x[0]*m/x[1]),r=red(raw);
  const F=x=>ff(x[0],x[1]),N=['㉮','㉯','㉰'];
  return {prompt:`<p>세 원 ㉮, ㉯, ㉰가 서로 겹쳐 있습니다. 세 원이 모두 겹쳐진 부분의 넓이는 원 ㉮의 넓이의 ${F(P.f[0])}, 원 ㉯의 넓이의 ${F(P.f[1])}, 원 ㉰의 넓이의 ${F(P.f[2])}입니다. 원 ㉮, ㉯, ㉰의 넓이의 비를 가장 간단한 자연수의 비로 나타내세요.</p>`,
   answer:R(r),
   solution:ol([`(원 ㉮의 넓이) × ${F(P.f[0])} = (원 ㉯의 넓이) × ${F(P.f[1])} = (원 ㉰의 넓이) × ${F(P.f[2])}입니다.`,
    `세 원이 모두 겹쳐진 부분의 넓이를 1로 보면 ${N.map((n,i)=>`원 ${n}의 넓이는 1 ÷ ${F(P.f[i])} = ${fs(v[i])}`).join(', ')}입니다.`,
    `${R(v.map(fs))}의 각 항에 ${eul(m)} 곱하면 ${R(raw)}${R(raw)===R(r)?'':`이고, 간단히 하면 ${R(r)}`}입니다.`,
    `따라서 원 ㉮, ㉯, ㉰의 넓이의 비는 ${R(r)}입니다.`])};});}

// ---- Mission 4: 맞닿아 도는 세 바퀴의 회전수 ----
function poolM4(){return [
  {a:[15,16],b:[25,18]},
  {a:[4,5],b:[3,2]},
  {a:[9,10],b:[6,5]}].map(P=>{
  const m=lcm(P.a[1],P.b[1]),c=[P.a[0]*m/P.a[1],P.b[0]*m/P.b[1],m],L=lcmA(c),n=c.map(x=>L/x),r=red(n);
  return {prompt:`<p>원 모양의 바퀴 가, 나, 다가 서로 맞닿아 돌고 있습니다. 가와 다의 둘레의 길이의 비는 ${R(P.a)}이고, 나와 다의 둘레의 길이의 비는 ${R(P.b)}입니다. 같은 시간 동안 가, 나, 다 세 바퀴가 도는 횟수(회전수)의 비를 가장 간단한 자연수의 비로 나타내세요.</p>`,
   answer:R(r),
   solution:ol([`다의 둘레를 ${wa(P.a[1])} ${P.b[1]}의 최소공배수인 ${ro(m)} 맞추면 가 : 나 : 다의 둘레의 길이의 비는 ${R(c)}입니다.`,
    `맞닿아 도는 바퀴는 같은 시간 동안 둘레를 따라 움직인 길이가 같으므로 (둘레) × (회전수)가 세 바퀴 모두 같습니다.`,
    `그 길이를 ${c.join(', ')}의 최소공배수인 ${ro(L)} 보면 회전수는 ${c.map((x,i)=>`${L} ÷ ${x} = ${n[i]}`).join(', ')}입니다.`,
    `따라서 가 : 나 : 다의 회전수의 비는 ${R(n)}${R(n)===R(r)?'':` = ${R(r)}`}입니다.`])};});}

// ---- Mission 5: 세 컵의 물 ----
function poolM5(){return [
  {a:[3,4],b:'2.5',n:45},
  {a:[2,5],b:'3.5',n:40},
  {a:[4,6],b:'2.5',n:36}].map(P=>{
  const s1=fracRatio([1,P.a[0]],[1,P.a[1]],ff(1,P.a[0]),ff(1,P.a[1]));
  const s2=fracRatio([1,1],dec(P.b),'1',P.b);
  const j=joinMid(s1.r[0],s1.r[1],s2.r[0],s2.r[1],'㉮','㉯','㉰');const t=j.r,df=t[2]-t[1],u=P.n/df,v=t.map(x=>x*u);
  return {prompt:`<p>컵 ㉮, ㉯, ㉰에 물이 들어 있습니다. ㉮와 ㉯ 컵에 든 물의 양의 비는 ${ff(1,P.a[0])} : ${ff(1,P.a[1])}이고, ㉯와 ㉰ 컵에 든 물의 양의 비는 1 : ${P.b}입니다. ㉮와 ㉰ 컵의 물의 양의 합이 ㉮와 ㉯ 컵의 물의 양의 합보다 ${P.n} mL 더 많을 때, 세 컵에 든 물의 양을 각각 구하세요.</p>`,
   answer:`㉮ ${v[0]} mL, ㉯ ${v[1]} mL, ㉰ ${v[2]} mL`,
   solution:ol([`${s1.txt}이므로 ㉮ : ㉯ = ${R(s1.r)}입니다.`,
    `${s2.txt}이므로 ㉯ : ㉰ = ${R(s2.r)}입니다.`,
    j.txt,
    `두 합에 모두 ㉮가 들어 있으므로 ㉰가 ㉯보다 ${P.n} mL 더 많습니다. ${t[2]} − ${t[1]} = ${df}칸이 ${P.n} mL이므로 1칸은 ${P.n} ÷ ${df} = ${u} (mL)입니다.`,
    `㉮ = ${t[0]} × ${u} = ${v[0]} (mL), ㉯ = ${t[1]} × ${u} = ${v[1]} (mL), ㉰ = ${t[2]} × ${u} = ${v[2]} (mL)입니다.`])};});}

// ---- Mission 6: 과수원 나무 수 ----
function poolM6(){return [
  {T:520,p:50,k:[4,1,2],d:56},
  {T:300,p:75,k:[2,2,3],d:45},
  {T:360,p:40,k:[3,1,2],d:60}].map(P=>{
  const s1=simpTxt(100,P.p);const kn=fr(P.k[0]*P.k[2]+P.k[1],P.k[2]);
  const s2=fracRatio([1,1],kn,'1',mx(...P.k));
  const j=joinMid(s1.r[0],s1.r[1],s2.r[0],s2.r[1],'사과나무','배나무','감나무');const t=j.r,S=t[0]+t[1]+2*t[2],u=(P.T+P.d)/S;
  return {prompt:`<p>정인이네 과수원에는 사과나무, 배나무, 감나무, 포도나무가 모두 ${P.T}그루 있습니다. 배나무 수는 사과나무 수의 ${P.p}%이고, 감나무 수는 배나무 수의 ${mx(...P.k)}배입니다. 포도나무가 감나무보다 ${P.d}그루 더 적을 때, 사과나무는 몇 그루인지 구하세요.</p>`,
   answer:(t[0]*u)+'그루',
   solution:ol([`배나무는 사과나무의 ${P.p}%이므로 사과나무 : 배나무 = ${s1.txt}입니다.`,
    `감나무는 배나무의 ${mx(...P.k)}배이므로 배나무 : 감나무 = 1 : ${mx(...P.k)}이고, ${s2.txt}입니다.`,
    j.txt,
    `사과나무, 배나무, 감나무를 ${t[0]}×□, ${t[1]}×□, ${t[2]}×□라고 하면 포도나무는 ${t[2]}×□ − ${P.d}입니다.`,
    `모두 더하면 ${S}×□ − ${P.d} = ${P.T}이므로 ${S}×□ = ${P.T+P.d}, □ = ${u}입니다.`,
    `사과나무는 ${t[0]} × ${u} = ${t[0]*u}(그루)입니다.`])};});}

const ITEMS={
 '6-2-u4-e4-exploration':{key:'source62U4E4Exploration1',resultContract:'single-value',answerVisualRequired:false,pool:poolE()},
 '6-2-u4-e4-example-1':{key:'source62U4E4Example1',resultContract:'single-value',answerVisualRequired:false,pool:poolX1()},
 '6-2-u4-e4-example-2':{key:'source62U4E4Example2',resultContract:'single-value',answerVisualRequired:false,pool:poolX2()},
 '6-2-u4-e4-example-3':{key:'source62U4E4Example3',resultContract:'single-value',answerVisualRequired:false,pool:poolX3()},
 '6-2-u4-e4-example-4':{key:'source62U4E4Example4',resultContract:'single-value',answerVisualRequired:false,pool:poolX4()},
 '6-2-u4-e4-mission-1':{key:'source62U4E4Mission1',resultContract:'single-value',answerVisualRequired:false,pool:poolM1()},
 '6-2-u4-e4-mission-2':{key:'source62U4E4Mission2',resultContract:'single-value',answerVisualRequired:false,pool:poolM2()},
 '6-2-u4-e4-mission-3':{key:'source62U4E4Mission3',resultContract:'single-value',answerVisualRequired:false,pool:poolM3()},
 '6-2-u4-e4-mission-4':{key:'source62U4E4Mission4',resultContract:'single-value',answerVisualRequired:false,pool:poolM4()},
 '6-2-u4-e4-mission-5':{key:'source62U4E4Mission5',resultContract:'multi-value',answerVisualRequired:false,pool:poolM5()},
 '6-2-u4-e4-mission-6':{key:'source62U4E4Mission6',resultContract:'single-value',answerVisualRequired:false,pool:poolM6()},
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
