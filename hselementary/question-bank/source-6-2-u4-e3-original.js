// 황소 6-2 4단원 비례식과 비례배분, 개념탐구 3(비례식을 세워 풀기) 원문 구조 유형.
// 원문 수치를 보존한 변형 0과 수만 바꾼 변형 1·2를 고정 검증 풀(fixed-verified-pool)로 제공합니다.
(function(root){'use strict';
const GROUP='6-2-u4-e3';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;};
const ol=steps=>'<ol>'+steps.map(s=>`<li>${s}</li>`).join('')+'</ol>';
const hm=m=>{const h=Math.floor(m/60),r=m%60;return r?(h?`${h}시간 ${r}분`:`${r}분`):`${h}시간`;};
const clock=m=>`${Math.floor(m/60)}시 ${m%60}분`;
const secText=s=>{const m=Math.floor(s/60),r=s%60;return r?(m?`${m}분 ${r}초`:`${r}초`):`${m}분`;};
const bat=n=>{const d=n%10;return d===0||d===1||d===3||d===6||d===7||d===8;}; // 숫자 읽기의 받침 여부
const ga=n=>bat(n)?'이':'가', yeot=n=>bat(n)?'이었':'였', eul=n=>bat(n)?'을':'를';
const kb=L=>L===1?'□':`${L}×□`;
const pct=k=>k%10?`0.${k}`:`0.${k/10}`;
const d10=x=>x%10?`${Math.floor(x/10)}.${x%10}`:`${x/10}`; // 10배 정수를 소수로

// 개념탐구: 늦어지는 시계 ㉮와 빨라지는 시계 ㉯
function exploration(r,shown){
 const slow=3600-r,fast=3600+r,g1=gcd(3600,slow),g2=gcd(3600,fast);
 const A=3600/g1,B=slow/g1,C=3600/g2,D=fast/g2,real=shown*A/B,bm=real*D/C;
 return {prompt:`<p>1시간에 ${secText(r)}씩 늦어지는 시계 ㉮와 1시간에 ${secText(r)}씩 빨라지는 시계 ㉯가 있습니다. 어느 날 정오에 두 시계 ㉮, ㉯를 모두 정확히 12시에 맞추어 놓았습니다. 시계 ㉮가 처음으로 ${clock(shown)}을 가리킬 때, 시계 ㉯는 몇 시 몇 분을 가리키고 있을까요?</p>`,
  answer:clock(bm),
  solution:ol([`실제로 1시간(3600초)이 지나는 동안 시계 ㉮는 ${slow}초, 시계 ㉯는 ${fast}초만큼 갑니다.`,
   `(실제로 흐른 시간):(시계 ㉮가 간 시간)=3600:${slow}=${A}:${B}이고, (실제로 흐른 시간):(시계 ㉯가 간 시간)=3600:${fast}=${C}:${D}입니다.`,
   `시계 ㉮가 12시부터 ${clock(shown)}까지 ${hm(shown)}=${shown}분을 갔으므로, 실제로 흐른 시간을 □분이라 하면 □:${shown}=${A}:${B}, □×${B}=${shown}×${A}, □=${real}입니다.`,
   `그동안 시계 ㉯가 간 시간을 △분이라 하면 ${real}:△=${C}:${D}, △×${C}=${real}×${D}, △=${bm}입니다.`,
   `${bm}분은 ${hm(bm)}이므로 시계 ㉯는 ${clock(bm)}을 가리킵니다.`])};
}

// 예제 1: 같은 양을 마신 뒤의 비
function example1(a,b,d,c,e){
 const L=b*c-a*e,R=d*c-d*e,k=R/L,diff=(a-b)*k;
 return {prompt:`<p>㉮와 ㉯ 두 종류의 음료수의 양을 비교하였더니 ${a}:${b}${yeot(b)}습니다. 두 음료수를 각각 ${d} mL씩 마신 다음 남은 양을 비교하였더니 ${c}:${e}${ga(e)} 되었습니다. 처음에 있던 ㉮와 ㉯ 두 음료수의 양의 차는 몇 mL일까요?</p>`,
  answer:`${diff} mL`,
  solution:ol([`처음 ㉮의 양을 ${a}×□ mL, ㉯의 양을 ${b}×□ mL라고 합니다.`,
   `${d} mL씩 마신 뒤 (${a}×□−${d}):(${b}×□−${d})=${c}:${e}이므로 외항의 곱과 내항의 곱이 같아 (${a}×□−${d})×${e}=(${b}×□−${d})×${c}입니다.`,
   `곧 ${a*e}×□−${d*e}=${b*c}×□−${d*c}이므로 ${b*c}×□와 ${a*e}×□의 차인 ${kb(L)}는 ${d*c}−${d*e}=${R}입니다.`,
   `${L===1?`□=${k}`:`□=${R}÷${L}=${k}`}이므로 처음 ㉮는 ${a*k} mL, ㉯는 ${b*k} mL입니다.`,
   `두 음료수의 처음 양의 차는 ${a*k}−${b*k}=${diff}(mL)입니다.`])};
}

// 예제 2: 한쪽은 받고 한쪽은 쓴 뒤의 비
function example2(a,b,P,M,c,e){
 const L=b*c-a*e,R=P*e+M*c,k=R/L,now=b*k-M;
 return {prompt:`<p>철호와 병식이가 지난주에 가지고 있던 용돈의 비는 ${a}:${b}${yeot(b)}습니다. 이번 주에 철호는 ${P}원을 더 받았고, 병식이는 ${M}원을 사용하여 철호와 병식이가 가지고 있는 용돈의 비가 ${c}:${e}${ga(e)} 되었습니다. 현재 병식이가 가지고 있는 용돈은 얼마일까요?</p>`,
  answer:`${now}원`,
  solution:ol([`지난주 철호의 용돈을 ${a}×□원, 병식이의 용돈을 ${b}×□원이라고 합니다.`,
   `이번 주에는 (${a}×□+${P}):(${b}×□−${M})=${c}:${e}이므로 (${a}×□+${P})×${e}=(${b}×□−${M})×${c}입니다.`,
   `곧 ${a*e}×□+${P*e}=${b*c}×□−${M*c}이므로 ${b*c}×□와 ${a*e}×□의 차인 ${kb(L)}는 ${P*e}+${M*c}=${R}입니다.`,
   `${L===1?`□=${k}`:`□=${R}÷${L}=${k}`}이므로 지난주 병식이의 용돈은 ${b}×${k}=${b*k}(원)입니다.`,
   `현재 병식이의 용돈은 ${b*k}−${M}=${now}(원)입니다.`])};
}

// 예제 3: 사과와 배를 같은 개수만큼 바꾸기
function example3(a,b,n,c,e){
 const L=b*c-a*e,R=n*(c+e),k=R/L;
 return {prompt:`<p>사과와 배가 있는데, 사과와 배의 개수의 비는 ${a}:${b}입니다. 이 중에서 배 ${n}개를 사과 ${n}개로 바꾸었더니 사과와 배의 개수의 비가 ${c}:${e}${ga(e)} 되었습니다. 처음에 있었던 사과는 몇 개일까요?</p>`,
  answer:`${a*k}개`,
  solution:ol([`처음 사과를 ${a}×□개, 배를 ${b}×□개라고 합니다.`,
   `배 ${n}개를 사과 ${n}개로 바꾸면 사과는 ${n}개 늘고 배는 ${n}개 줄어 (${a}×□+${n}):(${b}×□−${n})=${c}:${e}입니다.`,
   `외항의 곱과 내항의 곱이 같으므로 (${a}×□+${n})×${e}=(${b}×□−${n})×${c}, 곧 ${a*e}×□+${n*e}=${b*c}×□−${n*c}입니다.`,
   `${b*c}×□와 ${a*e}×□의 차인 ${kb(L)}는 ${n*e}+${n*c}=${R}이므로 ${L===1?`□=${k}`:`□=${R}÷${L}=${k}`}입니다.`,
   `처음에 있었던 사과는 ${a}×${k}=${a*k}(개)입니다.`])};
}

// 예제 4: 동전 금액의 비가 바뀐 뒤 전체 동전 수
function example4(a,b,n,p,c,e){
 const keep=100-p,coef10=b*keep/10,lhs=10*a*e,rhs=coef10*c,diff10=rhs-lhs,add=500*n;
 const k=add*e*10/diff10;
 const n5=a*k/500,n1=b*k/100,n5now=n5+n,n1now=n1*keep/100,total=n5now+n1now;
 return {prompt:`<p>우석이의 저금통에는 500원짜리와 100원짜리 동전만 들어 있고, 두 동전의 금액의 비는 ${a}:${b}${yeot(b)}습니다. 우석이가 500원짜리 동전 ${n}개를 더 넣고, 100원짜리 동전의 ${p}%를 꺼내 썼더니 두 동전의 금액의 비가 ${c}:${e}${ga(e)} 되었습니다. 지금 우석이의 저금통에는 동전이 모두 몇 개 들어 있을까요?</p>`,
  answer:`${total}개`,
  solution:ol([`처음 500원짜리 동전의 금액을 ${kb(a)}원, 100원짜리 동전의 금액을 ${b}×□원이라고 합니다.`,
   `500원짜리 동전 ${n}개를 넣으면 500원짜리 금액은 ${kb(a)}+${add}(원)이 되고, 100원짜리 동전의 ${p}%를 꺼내면 100원짜리 금액은 처음의 ${keep}%인 ${b}×□×${pct(keep)}=${d10(coef10)}×□(원)이 됩니다.`,
   `(${kb(a)}+${add}):(${d10(coef10)}×□)=${c}:${e}이므로 (${kb(a)}+${add})×${e}=${d10(coef10)}×□×${c}, 곧 ${a*e}×□+${add*e}=${d10(rhs)}×□입니다.`,
   `${d10(rhs)}×□와 ${a*e}×□의 차인 ${d10(diff10)}×□가 ${add*e}이므로 □=${add*e}÷${d10(diff10)}=${k}입니다.`,
   `처음 500원짜리는 ${a*k}÷500=${n5}(개), 100원짜리는 ${b*k}÷100=${n1}(개)입니다.`,
   `지금 500원짜리는 ${n5}+${n}=${n5now}(개), 100원짜리는 ${n1}×${pct(keep)}=${n1now}(개)이므로 모두 ${n5now}+${n1now}=${total}(개)입니다.`])};
}

// Mission 1: 빨리 가는 시계가 나중에 정확해진 시각
function mission1(r,shownStart,correctHour){
 const end=correctHour*60,shownDiff=end-shownStart,g=gcd(60,60+r),A=60/g,B=(60+r)/g,real=shownDiff*A/B,start=end-real;
 const h=Math.floor(start/60),m=start%60;
 return {prompt:`<p>1시간에 ${r}분씩 빨리 가는 시계가 있습니다. 이 시계는 오후 ㉮시 ㉯분에 ${clock(shownStart)}을 가리키고 있었고, 그날 오후 ${correctHour}시에는 정확한 시각을 가리키고 있었습니다. ㉮+㉯의 값을 구하세요.</p>`,
  answer:`${h+m}`,
  solution:ol([`이 시계는 실제로 60분이 지나는 동안 ${60+r}분을 가므로 (실제로 흐른 시간):(시계가 간 시간)=60:${60+r}=${A}:${B}입니다.`,
   `시계는 ${clock(shownStart)}에서 ${correctHour}시까지 ${hm(shownDiff)}=${shownDiff}분을 갔습니다.`,
   `그동안 실제로 흐른 시간을 □분이라 하면 □:${shownDiff}=${A}:${B}, □×${B}=${shownDiff}×${A}, □=${real}이므로 ${hm(real)}입니다.`,
   `오후 ${correctHour}시보다 ${hm(real)} 전은 오후 ${h}시 ${m}분이므로 ㉮=${h}, ㉯=${m}입니다.`,
   `㉮+㉯=${h}+${m}=${h+m}입니다.`])};
}

// Mission 2: 똑같이 자란 두 묘목
function mission2(a,b,g,c,e){
 const L=a*e-b*c,R=g*(c-e),k=R/L;
 return {prompt:`<p>지훈이는 마당에 묘목 두 그루를 심었습니다. 처음에는 두 묘목의 길이의 비가 ${a}:${b}${yeot(b)}고, 한 달 후에는 두 묘목이 똑같이 ${g} cm씩 자라서 길이의 비가 ${c}:${e}${ga(e)} 되었습니다. 두 묘목의 처음 길이는 각각 몇 cm일까요?</p>`,
  answer:`${a*k} cm, ${b*k} cm`,
  solution:ol([`처음 두 묘목의 길이를 ${a}×□ cm, ${b}×□ cm라고 합니다.`,
   `${g} cm씩 자란 뒤 (${a}×□+${g}):(${b}×□+${g})=${c}:${e}이므로 (${a}×□+${g})×${e}=(${b}×□+${g})×${c}입니다.`,
   `곧 ${a*e}×□+${g*e}=${b*c}×□+${g*c}이므로 ${a*e}×□와 ${b*c}×□의 차인 ${kb(L)}는 ${g*c}−${g*e}=${R}입니다.`,
   `${L===1?`□=${k}`:`□=${R}÷${L}=${k}`}입니다.`,
   `두 묘목의 처음 길이는 ${a}×${k}=${a*k}(cm), ${b}×${k}=${b*k}(cm)입니다.`])};
}

// Mission 3: 찾고 저금한 뒤 통장 금액의 비
function mission3(a,b,W,D,c,e){
 const L=a*e-b*c,R=W*e+D*c,k=R/L,now=a*k-W;
 return {prompt:`<p>어제까지 언니와 동생의 통장에 예금된 금액의 비는 ${a}:${b}${yeot(b)}습니다. 오늘 언니가 ${W}원을 찾고 동생은 ${D}원을 저금하여 통장에 예금된 금액의 비가 ${c}:${e}${ga(e)} 되었습니다. 현재 언니의 통장에는 얼마가 남아 있을까요?</p>`,
  answer:`${now}원`,
  solution:ol([`어제까지 언니의 예금을 ${a}×□원, 동생의 예금을 ${b}×□원이라고 합니다.`,
   `오늘은 (${a}×□−${W}):(${b}×□+${D})=${c}:${e}이므로 (${a}×□−${W})×${e}=(${b}×□+${D})×${c}입니다.`,
   `곧 ${a*e}×□−${W*e}=${b*c}×□+${D*c}이므로 ${a*e}×□와 ${b*c}×□의 차인 ${kb(L)}는 ${W*e}+${D*c}=${R}입니다.`,
   `${L===1?`□=${k}`:`□=${R}÷${L}=${k}`}이므로 어제까지 언니의 예금은 ${a}×${k}=${a*k}(원)입니다.`,
   `현재 언니의 통장에 남은 돈은 ${a*k}−${W}=${now}(원)입니다.`])};
}

// Mission 4: 연속하는 홀수 중 배수의 개수
function mission4(n,r,m){
 const gap=2*(n-1),s=gap/(r-1),big=s*r,list=[];
 for(let x=s;x<=big;x+=2)if(x%m===0)list.push(x);
 return {prompt:`<p>연속하는 ${n}개의 홀수가 있습니다. 이 중 가장 작은 수와 가장 큰 수의 비는 1:${r}입니다. 이 ${n}개의 홀수 중 ${m}의 배수는 모두 몇 개일까요?</p>`,
  answer:`${list.length}개`,
  solution:ol([`연속하는 홀수는 2씩 커지므로 가장 큰 수는 가장 작은 수보다 2×${n-1}=${gap} 큽니다.`,
   `가장 작은 수를 □라 하면 가장 큰 수는 ${r}×□이므로 ${r}×□와 □의 차인 ${r-1}×□가 ${gap}입니다.`,
   `□=${gap}÷${r-1}=${s}이므로 홀수는 ${s}부터 ${big}까지입니다.`,
   `${m}의 배수 중 홀수인 수는 ${m}에 홀수를 곱한 수이고, 이 중 ${s}부터 ${big}까지의 수는 ${list.join(', ')}입니다.`,
   `따라서 ${m}의 배수는 모두 ${list.length}개입니다.`])};
}

// Mission 5: 동생만 떡을 더 받은 뒤의 비
function mission5(a,b,g,c,e){
 const L=a*e-b*c,R=g*c,k=R/L;
 return {prompt:`<p>다연이와 동생이 가지고 있던 떡의 수의 비는 ${a}:${b}${yeot(b)}습니다. 어머니가 동생에게 떡을 ${g}개 더 주었더니 다연이와 동생이 가지고 있는 떡의 수의 비는 ${c}:${e}${ga(e)} 되었습니다. 다연이가 가지고 있던 떡은 몇 개일까요?</p>`,
  answer:`${a*k}개`,
  solution:ol([`다연이의 떡을 ${a}×□개, 동생의 떡을 ${b}×□개라고 합니다.`,
   `동생이 ${g}개를 더 받은 뒤 ${a}×□:(${b}×□+${g})=${c}:${e}이므로 ${a}×□×${e}=(${b}×□+${g})×${c}입니다.`,
   `곧 ${a*e}×□=${b*c}×□+${g*c}이므로 ${a*e}×□와 ${b*c}×□의 차인 ${kb(L)}는 ${R}입니다.`,
   `${L===1?`□=${k}`:`□=${R}÷${L}=${k}`}입니다.`,
   `다연이가 가지고 있던 떡은 ${a}×${k}=${a*k}(개)입니다.`])};
}

// Mission 6: 사다리꼴을 나눈 두 도형의 넓이의 비
function trapSvg(top,bottom,p,q){
 const W=250,bx0=45,by=200,ty=40,bx1=bx0+W,tx1=bx1-14,tx0=tx1-W*top/bottom;
 const mxp=tx1+(bx1-tx1)*p/(p+q),myp=ty+(by-ty)*p/(p+q);
 const f=v=>Math.round(v*10)/10;
 const qa=[(tx0+bx0+mxp+tx1)/4,(ty+by+myp+ty)/4],qb=[(bx0+bx1+mxp)/3+6,(by+by+myp)/3+3];
 const T=(x,y,s,anchor)=>`<text x="${f(x)}" y="${f(y)}" text-anchor="${anchor||'middle'}" style="font-size:14px;font-family:inherit;fill:#222">${s}</text>`;
 return `<svg viewBox="0 0 340 235" style="width:100%;max-width:340px;display:block;margin:8px auto" role="img" aria-label="사다리꼴 ㄱㄴㄷㄹ과 점 ㅁ, 선분 ㄴㅁ으로 나뉜 도형 ㉮와 ㉯">`+
  `<polygon points="${f(tx0)},${ty} ${f(tx1)},${ty} ${bx1},${by} ${bx0},${by}" style="fill:#e4e4e4;stroke:#222;stroke-width:1.4px;stroke-linejoin:round"/>`+
  `<line x1="${bx0}" y1="${by}" x2="${f(mxp)}" y2="${f(myp)}" style="stroke:#222;stroke-width:1.4px"/>`+
  T(tx0-6,ty-8,'ㄱ')+T(tx1+8,ty-8,'ㄹ')+T(bx0-10,by+18,'ㄴ')+T(bx1+10,by+18,'ㄷ')+T(mxp+8,myp+5,'ㅁ','start')+
  T(qa[0],qa[1]+5,'㉮')+T(qb[0],qb[1]+5,'㉯')+`</svg>`;
}
function mission6(p,q,m,n){
 const S1=p+q,S2=m+n,mul=S1*S2,lc=q*S2,rc=n*S1,top=lc-rc,g=gcd(top,rc),A=top/g,B=rc/g;
 return {prompt:`<p>다음 그림과 같은 사다리꼴 ㄱㄴㄷㄹ이 있습니다. 변 ㄹㄷ 위에 (선분 ㄹㅁ):(선분 ㅁㄷ)=${p}:${q}${ga(q)} 되도록 점 ㅁ을 잡고 점 ㅁ과 점 ㄴ을 이었더니, 생긴 도형 ㉮와 ㉯의 넓이의 비가 ${m}:${n}${ga(n)} 되었습니다. 선분 ㄱㄹ과 선분 ㄴㄷ의 길이의 비를 가장 간단한 자연수의 비로 나타내세요.</p>`+trapSvg(A,B,p,q),
  answer:`${A}:${B}`,
  solution:ol([`변 ㄱㄹ과 변 ㄴㄷ은 평행하고, (선분 ㄹㅁ):(선분 ㅁㄷ)=${p}:${q}이므로 점 ㅁ에서 변 ㄴㄷ까지의 거리는 사다리꼴의 높이의 ${ff(q,S1)}입니다.`,
   `㉯는 밑변이 선분 ㄴㄷ인 삼각형이므로 ㉯의 넓이는 (선분 ㄴㄷ)×(높이)÷2×${ff(q,S1)}입니다.`,
   `㉮:㉯=${m}:${n}이므로 ㉯의 넓이는 사다리꼴 전체 넓이 ((선분 ㄱㄹ)+(선분 ㄴㄷ))×(높이)÷2의 ${ff(n,S2)}입니다.`,
   `따라서 (선분 ㄴㄷ)×${ff(q,S1)}=((선분 ㄱㄹ)+(선분 ㄴㄷ))×${ff(n,S2)}이고, 양쪽에 ${mul}${eul(mul)} 곱하면 (선분 ㄴㄷ)×${lc}=((선분 ㄱㄹ)+(선분 ㄴㄷ))×${rc}입니다.`,
   `곧 (선분 ㄴㄷ)×${top}=(선분 ㄱㄹ)×${rc}이므로 (선분 ㄱㄹ):(선분 ㄴㄷ)=${top}:${rc}${g>1?`=${A}:${B}`:''}입니다.`])};
}

const ITEMS={
 '6-2-u4-e3-exploration':{key:'source62U4E3Exploration',resultContract:'single-value',answerVisualRequired:false,pool:[exploration(90,390),exploration(120,290),exploration(150,345)]},
 '6-2-u4-e3-example-1':{key:'source62U4E3Example1',resultContract:'single-value',answerVisualRequired:false,pool:[example1(3,2,200,2,1),example1(7,4,100,5,2),example1(5,4,120,3,2)]},
 '6-2-u4-e3-example-2':{key:'source62U4E3Example2',resultContract:'single-value',answerVisualRequired:false,pool:[example2(3,2,900,500,5,3),example2(4,3,600,400,2,1),example2(5,4,1000,800,3,2)]},
 '6-2-u4-e3-example-3':{key:'source62U4E3Example3',resultContract:'single-value',answerVisualRequired:false,pool:[example3(3,4,5,4,3),example3(2,3,6,3,2),example3(4,5,7,5,4)]},
 '6-2-u4-e3-example-4':{key:'source62U4E3Example4',resultContract:'single-value',answerVisualRequired:false,pool:[example4(2,3,3,20,13,12),example4(3,2,4,25,8,3),example4(1,2,2,10,20,27)]},
 '6-2-u4-e3-mission-1':{key:'source62U4E3Mission1',resultContract:'single-value',answerVisualRequired:false,pool:[mission1(3,90,5),mission1(2,143,6),mission1(4,244,7)]},
 '6-2-u4-e3-mission-2':{key:'source62U4E3Mission2',resultContract:'multi-value',answerVisualRequired:false,pool:[mission2(13,9,20,9,7),mission2(5,3,12,3,2),mission2(7,4,10,3,2)]},
 '6-2-u4-e3-mission-3':{key:'source62U4E3Mission3',resultContract:'single-value',answerVisualRequired:false,pool:[mission3(5,3,75000,10000,3,4),mission3(5,4,40000,10000,2,3),mission3(3,2,50000,25000,2,3)]},
 '6-2-u4-e3-mission-4':{key:'source62U4E3Mission4',resultContract:'single-value',answerVisualRequired:false,pool:[mission4(29,9,15),mission4(31,5,9),mission4(25,17,7)]},
 '6-2-u4-e3-mission-5':{key:'source62U4E3Mission5',resultContract:'single-value',answerVisualRequired:false,pool:[mission5(3,2,12,1,2),mission5(4,3,14,4,5),mission5(5,4,18,5,7)]},
 '6-2-u4-e3-mission-6':{key:'source62U4E3Mission6',resultContract:'single-value',answerVisualRequired:false,pool:[mission6(5,4,8,3),mission6(3,2,5,2),mission6(4,3,3,1)]},
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
