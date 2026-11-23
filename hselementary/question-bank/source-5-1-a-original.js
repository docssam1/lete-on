// 황소 5-1 1~5단원 잠금 원문 유형 (5-1-a). 원문과 같은 구조·같은 물음, 수만 바꾼 검증 변형 3개씩.
// ITEMS의 키는 앱 유형 id(type id), sourceItemId는 원장 id입니다.
(function(root){'use strict';
const GROUP='5-1-a';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;
const gcd=(a,b)=>{a=Math.abs(a);b=Math.abs(b);while(b){[a,b]=[b,a%b];}return a;};
const lcm=(a,b)=>a/gcd(a,b)*b;
const lcmAll=a=>a.reduce((x,y)=>lcm(x,y),1);
// 수 뒤 조사: 마지막으로 읽는 자리의 받침 (0 없음, 1 ㄹ, 2 그 밖의 받침)
const bat=n=>{n=Math.round(Number(n));const d=n%10;if(d)return [0,1,0,2,0,0,2,1,1,0][d];return 2;};
const jo=(n,a,b)=>String(n)+(bat(n)?a:b); // 이/가, 을/를, 과/와, 은/는
const ro=n=>String(n)+(bat(n)===2?'으로':'로');
const ol=steps=>'<ol>'+steps.map(s=>`<li>${s}</li>`).join('')+'</ol>';
const note=s=>`<p>※ 조건 보충: ${s}</p>`;
const mk=(fn,ps)=>ps.map(fn);
const SV=(w,h,label,body,mw)=>`<svg viewBox="0 0 ${w} ${h}" style="width:100%;max-width:${mw||360}px;height:auto;display:block;margin:8px auto;font-family:inherit" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const LN='fill:none;stroke:#222;stroke-width:1.4px;stroke-linejoin:round;stroke-linecap:round';
const T=(x,y,s,sz,anchor)=>`<text x="${x}" y="${y}" style="font-size:${sz||13}px;fill:#222;text-anchor:${anchor||'middle'}">${s}</text>`;
const pl=(pts,st)=>`<polyline points="${pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}" style="${st||LN}"/>`;
const ln=(x1,y1,x2,y2,st)=>`<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" style="${st||LN}"/>`;
const arrow=(x,y)=>`<polygon points="${x},${y-4} ${x+8},${y} ${x},${y+4}" style="fill:#555"/>`+ln(x-6,y,x+1,y,'stroke:#555;stroke-width:2px');
const TS='border-collapse:collapse;margin:8px auto;text-align:center';
const TC='border:1px solid #444;padding:4px 8px;min-width:30px';
const TH='border:1px solid #444;padding:4px 8px;background:#eee;font-weight:normal';

/* ---------- 1단원 Mission 3: 처음 돈 구하기 ---------- */
function u1m3(p){
 const {sk,nb,nc,dr,left}=p; const half=left+dr+sk+nb*nc, ans=half*2;
 const expr=`(${left} + ${dr} + ${sk} + ${nb} × ${nc}) × 2 = ${ans}`;
 const prompt=`<p>명균이는 가지고 있던 돈의 반으로 ${sk}원짜리 스케치북 1권과 ${nb}원짜리 공책 ${nc}권을 샀습니다. 잠시 뒤 다시 가게에 가서 ${dr}원짜리 음료수를 샀더니 ${left}원이 남았습니다. 명균이가 처음에 가지고 있던 돈은 얼마인지 하나의 식으로 나타내고 답을 구하세요.</p>`
  +note(`스케치북, 공책, 음료수는 모두 처음 돈의 반으로 샀고(나머지 반은 쓰지 않았습니다), 남은 ${left}원은 그 반에서 남은 돈입니다.`);
 const sol=ol([
  `음료수를 사고 남은 ${left}원에 음료수값 ${dr}원을 더하면 음료수를 사기 전에 남아 있던 돈입니다.`,
  `여기에 스케치북값 ${sk}원과 공책값 ${nb} × ${nc} = ${nb*nc}(원)을 더하면 처음 돈의 반이 됩니다. ${left} + ${dr} + ${sk} + ${nb} × ${nc} = ${half}(원)입니다.`,
  `처음 돈은 반의 2배이므로 하나의 식으로 나타내면 ${expr}입니다.`,
  `따라서 명균이가 처음에 가지고 있던 돈은 ${ans}원입니다.`]);
 return {prompt,answer:`식: ${expr}, 답: ${ans}원`,solution:sol};
}

/* ---------- 2단원 예제 5-4: 두 수씩의 최대공약수로 최소공배수 ---------- */
function u2e54(p){
 const {pq,qr,pr}=p; // ㉮㉯, ㉯㉰, ㉮㉰ 의 최대공약수
 const A=lcm(pq,pr),B=lcm(pq,qr),C=lcm(qr,pr),L=lcmAll([A,B,C]);
 const prompt=`<p>세 자연수 ㉮, ㉯, ㉰가 있습니다. ㉮와 ㉯의 최대공약수는 ${pq}, ㉯와 ㉰의 최대공약수는 ${qr}, ㉮와 ㉰의 최대공약수는 ${pr}입니다. ㉮, ㉯, ㉰의 최소공배수를 구하세요.</p>`
  +note('㉮, ㉯, ㉰의 최소공배수가 될 수 있는 수 중에서 가장 작은 수를 구합니다.');
 const sol=ol([
  `㉮는 ${jo(pq,'과','와')} ${ro(pr)} 모두 나누어떨어지므로 ${jo(pq,'과','와')} ${pr}의 최소공배수 ${A}의 배수입니다.`,
  `같은 방법으로 ㉯는 ${jo(pq,'과','와')} ${qr}의 최소공배수 ${B}의 배수이고, ㉰는 ${jo(qr,'과','와')} ${pr}의 최소공배수 ${C}의 배수입니다.`,
  `그러므로 ㉮, ㉯, ㉰의 최소공배수는 ${A}, ${B}, ${C}의 공배수이고, ${A}, ${B}, ${C}의 최소공배수 ${L}보다 작을 수 없습니다.`,
  `㉮ = ${A}, ㉯ = ${B}, ㉰ = ${C}이면 두 수씩의 최대공약수가 ${pq}, ${qr}, ${ro(pr)} 조건에 맞고, 세 수의 최소공배수는 ${L}입니다.`,
  `따라서 구하는 최소공배수는 ${L}입니다.`]);
 return {prompt,answer:String(L),solution:sol};
}

/* ---------- 2단원 Mission 6: 몫과 최소공배수로 세 수 ---------- */
function u2m6(p){
 const {q}=p; const L=lcmAll(q), k=L, nums=q.map(x=>x*k);
 const prompt=`<p>세 자연수를 ㉮로 나누면 모두 나누어떨어지고, 몫은 각각 ${q.join(', ')}입니다. 이 세 수의 최소공배수가 ㉮ × ㉮일 때, 세 자연수를 구하세요.</p>`;
 const sol=ol([
  `세 수는 ㉮ × ${q[0]}, ㉮ × ${q[1]}, ㉮ × ${q[2]}입니다.`,
  `${q.join(', ')}의 최소공배수는 ${L}이므로 세 수의 최소공배수는 ㉮ × ${L}입니다.`,
  `㉮ × ${L} = ㉮ × ㉮이므로 ㉮ = ${L}입니다.`,
  `따라서 세 자연수는 ${L} × ${q[0]} = ${nums[0]}, ${L} × ${q[1]} = ${nums[1]}, ${L} × ${q[2]} = ${nums[2]}입니다.`]);
 return {prompt,answer:nums.join(', '),solution:sol};
}

/* ---------- 2단원 예제 7-1: 남는 개수로 학생 수 (모두) ---------- */
const divs=n=>{const r=[];for(let i=1;i<=n;i++)if(n%i===0)r.push(i);return r;};
function u2e71(p){
 const {it}=p; // [[이름,개수,남은수],...]
 const used=it.map(x=>x[1]-x[2]); const g=used.reduce(gcd); const mr=Math.max(...it.map(x=>x[2]));
 const ok=divs(g).filter(d=>d>mr);
 const prompt=`<p>${it.map(x=>`${x[0]} ${x[1]}개`).join(', ')}를 학생들에게 똑같이 나누어 주었더니 ${it.map((x,i)=>`${x[0]}${i?'은':'는'} ${x[2]}개`).join(', ')}가 남았습니다. 나누어 줄 수 있는 학생 수를 구하세요.</p>`
  +note('조건에 맞는 학생 수를 모두 구합니다.');
 const sol=ol([
  `나누어 준 개수는 ${it.map((x,i)=>`${x[0]} ${x[1]} − ${x[2]} = ${used[i]}(개)`).join(', ')}이므로 학생 수는 ${used.join(', ')}의 공약수입니다.`,
  `${used.join(', ')}의 최대공약수는 ${g}이므로 공약수는 ${divs(g).join(', ')}입니다.`,
  `남은 개수는 학생 수보다 적어야 하므로 학생 수는 가장 많이 남은 ${mr}개보다 많아야 합니다.`,
  `따라서 나누어 줄 수 있는 학생 수는 ${ok.map(x=>x+'명').join(', ')}입니다.`]);
 return {prompt,answer:ok.map(x=>x+'명').join(', '),solution:sol};
}

/* ---------- 2단원 Mission 3: 남거나 모자라는 개수로 학생 수 ---------- */
function u2m3(p){
 const {it}=p; // [[이름,개수,'부족'|'남음',수]]
 const fix=it.map(x=>x[2]==='부족'?x[1]+x[3]:x[1]-x[3]); const g=fix.reduce(gcd); const mr=Math.max(...it.map(x=>x[3]));
 const ok=divs(g).filter(d=>d>mr); const ans=ok[0];
 const st=x=>x[2]==='부족'?`${x[3]}개가 모자라`:`${x[3]}개가 남`;
 const prompt=`<p>${it[0][0]} ${it[0][1]}개, ${it[1][0]} ${it[1][1]}개, ${it[2][0]} ${it[2][1]}개를 학생들에게 똑같이 나누어 주려고 하였더니 ${it[0][0]}은 ${st(it[0])}고, ${it[1][0]}은 ${st(it[1])}고, ${it[2][0]}는 ${it[2][2]==='부족'?it[2][3]+'개가 모자랐':it[2][3]+'개가 남았'}습니다. 학생 몇 명에게 나누어 주려고 하였나요?</p>`
  +note('남거나 모자라는 개수는 학생 수보다 적습니다.');
 const sol=ol([
  `모자라는 만큼 더하고 남는 만큼 빼면 똑같이 나누어지는 개수가 됩니다. ${it.map((x,i)=>`${x[0]} ${x[1]} ${x[2]==='부족'?'+':'−'} ${x[3]} = ${fix[i]}`).join(', ')}입니다.`,
  `학생 수는 ${fix.join(', ')}의 공약수입니다. 최대공약수가 ${g}이므로 학생 수는 ${divs(g).join(', ')} 중 하나입니다.`,
  `남거나 모자라는 개수는 학생 수보다 적어야 하므로 학생 수는 가장 큰 ${mr}보다 커야 합니다.`,
  `따라서 학생은 ${ans}명입니다.`]);
 return {prompt,answer:ans+'명',solution:sol};
}

/* ---------- 2단원 개념탐구 8 Mission 6: 곱과 최대공약수·최소공배수로 세 수 ---------- */
function u2e8m6(p){
 const {P,g,L}=p; const m=L/g; const pairs=[];
 for(let a=1;a<=m;a++) if(m%a===0&&gcd(a,m/a)===1) pairs.push([a,m/a]);
 const BC=pairs.map(([a,b])=>[g*a,g*b]); const sols=BC.filter(([B])=>P%B===0).map(([B,C])=>[P/B,B,C]).sort((x,y)=>x[0]-y[0]);
 const fmt=s=>`(${s.join(', ')})`;
 const prompt=`<p>세 자연수 ㉮, ㉯, ㉰가 있습니다. ㉮와 ㉯의 곱은 ${P}이고, ㉯와 ㉰의 최대공약수는 ${g}, 최소공배수는 ${L}입니다. 이때 세 수를 모두 구하세요.</p>`
  +note('조건에 맞는 (㉮, ㉯, ㉰)를 모두 구합니다.');
 const sol=ol([
  `㉯와 ㉰는 모두 ${g}의 배수입니다. ㉯ ÷ ${jo(g,'과','와')} ㉰ ÷ ${jo(g,'은','는')} 1 말고는 공약수가 없고, 두 수의 곱은 ${L} ÷ ${g} = ${m}입니다.`,
  `곱이 ${m}이고 1 말고는 공약수가 없는 두 수는 ${pairs.map(x=>fmt(x)).join(', ')}이므로 (㉯, ㉰)는 ${BC.map(x=>fmt(x)).join(', ')}입니다.`,
  `㉮ × ㉯ = ${P}이므로 ㉯는 ${P}의 약수여야 합니다. 따라서 ㉯는 ${sols.map(s=>s[1]).sort((a,b)=>a-b).join(' 또는 ')}입니다.`,
  ...sols.map(s=>`㉯ = ${s[1]}이면 ㉮ = ${P} ÷ ${s[1]} = ${s[0]}, ㉰ = ${s[2]}입니다.`),
  `따라서 (㉮, ㉯, ㉰)는 ${sols.map(fmt).join(', ')}입니다.`]);
 return {prompt,answer:`(㉮, ㉯, ㉰) = ${sols.map(fmt).join(', ')}`,solution:sol};
}

/* ---------- 3단원 기호 암호 공통 ---------- */
const SYM_A={ // 예제 1-3 (모서리 삼각형이 있는 칸, 6갈래 기호)
 '1':[[[0,20],[20,20],[20,0],[0,20]]],'2':[[[0,0],[0,20],[20,20],[20,0]]],'3':[[[0,0],[0,20],[20,20],[0,0]]],
 '4':[[[0,0],[20,0],[20,20],[0,20]]],'5':[[[0,0],[20,0],[20,20],[0,20],[0,0]]],'6':[[[20,0],[0,0],[0,20],[20,20]]],
 '7':[[[0,0],[20,0],[20,20],[0,0]]],'8':[[[0,20],[0,0],[20,0],[20,20]]],'9':[[[20,0],[0,0],[0,20],[20,0]]],
 '+':[[[0,20],[20,20],[8.5,0]]],'(':[[[20,20],[0,20],[11.5,0]]],')':[[[-1.5,0],[10,20],[21.5,0]]],
 '×':[[[-1.5,20],[10,0],[21.5,20]]],'−':[[[0,0],[20,0],[8.5,20]]],'÷':[[[20,0],[0,0],[11.5,20]]]};
const SYM_B={ // Mission 3 (선만 있는 칸, 마름모 기호)
 '1':[[[20,0],[20,20],[0,20]]],'2':SYM_A['2'],'3':[[[0,0],[0,20],[20,20]]],'4':SYM_A['4'],'5':SYM_A['5'],'6':SYM_A['6'],
 '7':[[[0,0],[20,0],[20,20]]],'8':SYM_A['8'],'9':[[[20,0],[0,0],[0,20]]],
 '+':[[[0,20],[20,20],[20,0],[0,20]]],'−':[[[0,0],[0,20],[20,20],[0,0]]],'×':[[[0,0],[20,0],[20,20],[0,0]]],'÷':[[[20,0],[0,0],[0,20],[20,0]]]};
function codeSvg(tokens,S,label){
 const w=26*tokens.length+8; let b='';
 tokens.forEach((t,i)=>{const x=6+26*i,y=6;S[t].forEach(poly=>{b+=pl(poly.map(([a,c])=>[x+a,y+c]));});});
 return SV(w,32,label,b,Math.min(360,w*1.1));
}
function keyA(){
 let b=`<rect x="4" y="4" width="252" height="104" rx="8" style="fill:none;stroke:#888;stroke-width:1px;stroke-dasharray:3 3"/>`;
 const x0=30,y0=14,c=28;
 b+=ln(x0+c,y0,x0+c,y0+3*c)+ln(x0+2*c,y0,x0+2*c,y0+3*c)+ln(x0,y0+c,x0+3*c,y0+c)+ln(x0,y0+2*c,x0+3*c,y0+2*c);
 b+=ln(x0,y0+c,x0+c,y0)+ln(x0+2*c,y0,x0+3*c,y0+c)+ln(x0,y0+2*c,x0+c,y0+3*c)+ln(x0+2*c,y0+3*c,x0+3*c,y0+2*c);
 const off={1:[5,5],3:[-5,5],7:[5,-5],9:[-5,-5]};
 for(let k=1;k<=9;k++){const i=(k-1)%3,j=Math.floor((k-1)/3),o=off[k]||[0,0];b+=T(x0+c*i+c/2+o[0],y0+c*j+c/2+5+o[1],k,12);}
 const cx=196,cy=56,r=40,dx=r*0.5,dy=r*0.866;
 b+=ln(cx-r,cy,cx+r,cy)+ln(cx-dx,cy+dy,cx+dx,cy-dy)+ln(cx-dx,cy-dy,cx+dx,cy+dy);
 const lab=[[90,')'],[30,'('],[150,'+'],[210,'−'],[270,'×'],[330,'÷']];
 lab.forEach(([a,s])=>{const t=a*Math.PI/180;b+=T((cx+26*Math.cos(t)).toFixed(1),(cy-26*Math.sin(t)+5).toFixed(1),s,14);});
 return SV(260,112,'숫자 1부터 9까지를 넣은 칸 그림과 계산 기호 6개를 넣은 갈래 그림',b,300);
}
function keyB(){
 let b=`<rect x="4" y="4" width="252" height="104" rx="8" style="fill:none;stroke:#888;stroke-width:1px;stroke-dasharray:3 3"/>`;
 const x0=30,y0=14,c=28;
 b+=ln(x0+c,y0,x0+c,y0+3*c)+ln(x0+2*c,y0,x0+2*c,y0+3*c)+ln(x0,y0+c,x0+3*c,y0+c)+ln(x0,y0+2*c,x0+3*c,y0+2*c);
 for(let k=1;k<=9;k++){const i=(k-1)%3,j=Math.floor((k-1)/3);b+=T(x0+c*i+c/2,y0+c*j+c/2+5,k,12);}
 const cx=196,cy=56,h=38;
 b+=pl([[cx-h,cy],[cx,cy-h],[cx+h,cy],[cx,cy+h],[cx-h,cy]])+ln(cx-h,cy,cx+h,cy)+ln(cx,cy-h,cx,cy+h);
 b+=T(cx-11,cy-7,'+',14)+T(cx+11,cy-7,'−',14)+T(cx-11,cy+17,'×',14)+T(cx+11,cy+17,'÷',14);
 return SV(260,112,'숫자 1부터 9까지를 넣은 칸 그림과 계산 기호 4개를 넣은 마름모 그림',b,300);
}
const tokenize=s=>s.replace(/\s+/g,'').split('');
const show=s=>tokenize(s).join(' ').replace(/\( /g,'(').replace(/ \)/g,')');
function u3e13(p){
 const {expr,steps,ans}=p; const tk=tokenize(expr);
 const prompt=`<p>다음 그림의 약속에 따라 숫자와 계산 기호를 나타내었습니다. 그림을 보고 아래 문제의 계산 결과를 구하세요.</p>`+keyA()+codeSvg(tk,SYM_A,'약속에 따라 기호로 쓴 계산 문제');
 const sol=ol([
  `그림에서 각 숫자와 기호는 자신이 들어 있는 칸을 둘러싼 선의 모양으로 나타냅니다. 예를 들어 네 변이 모두 막힌 모양은 가운데 칸의 5입니다.`,
  `문제의 모양을 왼쪽부터 차례로 읽으면 ${show(expr)}입니다.`,
  `괄호 안을 먼저 계산하고, 곱셈과 나눗셈을 덧셈과 뺄셈보다 먼저 계산하면 ${steps} = ${ans}입니다.`,
  `따라서 계산 결과는 ${ans}입니다.`]);
 return {prompt,answer:String(ans),solution:sol};
}
function u3m3(p){
 const {expr,steps,ans}=p; const tk=tokenize(expr);
 const prompt=`<p>다음 그림의 약속에 따라 숫자와 계산 기호를 나타내었습니다. 그림을 보고 아래 문제의 계산 결과를 구하세요.</p>`+keyB()+codeSvg(tk,SYM_B,'약속에 따라 기호로 쓴 계산 문제');
 const sol=ol([
  `그림에서 각 숫자와 기호는 자신이 들어 있는 칸을 둘러싼 선의 모양으로 나타냅니다. 예를 들어 네 변이 모두 막힌 모양은 5이고, 마름모 안의 직각삼각형 모양은 계산 기호입니다.`,
  `문제의 모양을 왼쪽부터 차례로 읽으면 ${show(expr)}입니다.`,
  `곱셈과 나눗셈을 먼저 하고, 나머지는 앞에서부터 차례로 계산하면 ${steps} = ${ans}입니다.`,
  `따라서 계산 결과는 ${ans}입니다.`]);
 return {prompt,answer:String(ans),solution:sol};
}

/* ---------- 3단원 예제 1-4: 모스부호 생일 ---------- */
const MORSE=d=>d===0?'−−−−−':d<=5?'•'.repeat(d)+'−'.repeat(5-d):'−'.repeat(d-5)+'•'.repeat(10-d);
const SOUND=d=>MORSE(d).split('').map(c=>c==='•'?'뚜':'뚜~~').join('');
function u3e14(p){
 const {m,d}=p;
 const rows=[0,1,2,3,4].map(k=>`<tr><td style="${TC}">${k}</td><td style="${TC}">${MORSE(k)}</td><td style="${TC}">${k+5}</td><td style="${TC}">${MORSE(k+5)}</td></tr>`).join('');
 const table=`<table style="${TS}" aria-label="모스부호 기호"><thead><tr><th scope="col" style="${TH}">숫자</th><th scope="col" style="${TH}">모스부호</th><th scope="col" style="${TH}">숫자</th><th scope="col" style="${TH}">모스부호</th></tr></thead><tbody>${rows}</tbody></table>`;
 const prompt=`<p>모스부호는 점(•)과 선(−)을 이용하여 다음과 같은 규칙으로 만든 부호입니다. 모스부호를 소리로 낼 때 점(•)은 “뚜”, 선(−)은 점의 3배 길이로 “뚜~~” 소리를 냅니다. 예를 들어 1을 모스부호의 소리로 내면 “뚜 뚜~~뚜~~뚜~~뚜~~”입니다.</p>${table}<p>서준이가 “내가 태어난 달은 ‘${SOUND(m)}’이고, 태어난 날은 ‘${SOUND(d)}’야.”라고 말했습니다. 서준이의 생일은 몇 월 며칠인가요?</p>`;
 const sol=ol([
  `표를 보면 숫자 하나는 점과 선을 합하여 기호 5개로 나타냅니다.`,
  `태어난 달 “${SOUND(m)}”를 기호로 바꾸면 ${MORSE(m)}로 기호가 5개이므로 숫자 하나이고, 표에서 ${m}입니다.`,
  `태어난 날 “${SOUND(d)}”를 기호로 바꾸면 ${MORSE(d)}로 기호가 5개이므로 숫자 하나이고, 표에서 ${d}입니다.`,
  `따라서 서준이의 생일은 ${m}월 ${d}일입니다.`]);
 return {prompt,answer:`${m}월 ${d}일`,solution:sol};
}

/* ---------- 3단원 Mission 6: 색칠한 모눈으로 나타낸 수 ---------- */
const EX6=[[1,[1,0,0,0]],[2,[2,0,0,0]],[5,[0,1,0,0]],[10,[0,2,0,0]],[31,[1,1,1,0]],[51,[1,0,2,0]]];
function grid4(x,y,c,h,lw){let b='';for(let col=0;col<4;col++)for(let r=0;r<4;r++){const sh=(3-r)<h[col];b+=`<rect x="${x+col*c}" y="${y+r*c}" width="${c}" height="${c}" style="fill:${sh?'#9a9a9a':'#fff'};stroke:#222;stroke-width:${lw}px"/>`;}return b;}
function u3m6(p){
 const {h}=p; const val=h[0]*1+h[1]*5+h[2]*25+h[3]*125;
 let b=`<rect x="4" y="4" width="342" height="66" rx="8" style="fill:none;stroke:#888;stroke-width:1px"/>`;
 EX6.forEach(([n,hh],i)=>{const x=14+i*56;b+=grid4(x,10,10,hh,0.8)+T(x+20,64,n,11);});
 b+=grid4(131,84,22,h,1.4);
 const prompt=`<p>다음은 규칙에 따라 모눈에 색칠하여 수를 나타낸 것입니다. 아래쪽 그림이 나타내는 수를 구하세요.</p>`+SV(350,178,'색칠한 모눈으로 1, 2, 5, 10, 31, 51을 나타낸 그림과 구할 모눈 그림',b,360);
 const sol=ol([
  `1과 2를 보면 왼쪽 첫째 세로줄에 아래에서부터 색칠한 칸 1개는 1, 2개는 2를 나타내므로 첫째 줄의 한 칸은 1입니다.`,
  `5와 10을 보면 둘째 세로줄의 한 칸은 5를 나타냅니다.`,
  `31은 첫째, 둘째, 셋째 줄에 한 칸씩이므로 셋째 줄의 한 칸은 31 − 1 − 5 = 25입니다. 51 = 1 + 25 × 2로 이 규칙이 맞는지 확인할 수 있습니다.`,
  `아래쪽 그림은 첫째 줄 ${h[0]}칸, 둘째 줄 ${h[1]}칸, 셋째 줄 ${h[2]}칸이 색칠되어 있으므로 ${h[0]} × 1 + ${h[1]} × 5 + ${h[2]} × 25 = ${val}입니다.`,
  `따라서 그림이 나타내는 수는 ${val}입니다.`]);
 return {prompt,answer:String(val),solution:sol};
}

/* ---------- 3단원 개념탐구 2: 두 수직선의 연결 ---------- */
function u3x2(p){
 const {c,ask}=p; const f=n=>n*(n+1)/2+c; const B=f(4)+1;
 const u=20,x0=16,yt=30,yb=128; let b='';
 b+=ln(x0,yt,x0+u*5.8,yt)+T(x0+u*6.6,yt+4,'…',12);
 for(let k=0;k<=5;k++)b+=ln(x0+u*k,yt-5,x0+u*k,yt+5)+T(x0+u*k,yt-9,k,12);
 b+=ln(x0,yb,x0+u*(B+0.6),yb)+T(x0+u*(B+1.4),yb+4,'…',12);
 for(let k=0;k<=B;k++)b+=ln(x0+u*k,yb-5,x0+u*k,yb+5)+T(x0+u*k,yb+20,k,12);
 for(let k=1;k<=4;k++)b+=ln(x0+u*k,yt,x0+u*f(k),yb);
 const t=0.72;b+=ln(x0+u*5,yt,x0+u*(5+t*(f(5)-5)),yt+t*(yb-yt));
 const W=x0+u*(B+2.2);
 const fig=SV(W,156,'위쪽 수직선의 1, 2, 3, 4, 5가 아래쪽 수직선의 수와 선으로 이어진 그림',b,360);
 const table=`<table style="${TS}" aria-label="□와 △의 대응표"><tbody><tr><th scope="row" style="${TH}">□</th>${[1,2,3,4,5,6,7].map(k=>`<td style="${TC}">${k}</td>`).join('')}<td style="${TC}">…</td></tr><tr><th scope="row" style="${TH}">△</th>${[1,2,3,4,5,6,7].map(()=>`<td style="${TC}"></td>`).join('')}<td style="${TC}">…</td></tr></tbody></table>`;
 const prompt=`<p>지은이가 만든 코드를 실행하였더니 다음 그림과 같이 선이 연결되었습니다. 위쪽에 있는 수를 □, 아래쪽에 있는 수를 △라 할 때, 물음에 답하세요.</p>${fig}<p>(1) 빈칸에 알맞은 수를 써넣으세요.</p>${table}<p>(2) □와 △의 대응 관계를 식으로 나타내세요.</p><p>(3) □ = ${ask}일 때, △의 값을 구하세요.</p>`;
 const vals=[1,2,3,4,5,6,7].map(f); const a3=f(ask);
 const sol=ol([
  `(1) 그림에서 □가 1, 2, 3, 4일 때 △는 ${vals.slice(0,4).join(', ')}이고, △는 2, 3, 4씩 커져 늘어나는 수가 1씩 커집니다.`,
  `(1) 같은 규칙으로 □가 5, 6, 7일 때 △는 ${vals[3]} + 5 = ${vals[4]}, ${vals[4]} + 6 = ${vals[5]}, ${vals[5]} + 7 = ${vals[6]}입니다.`,
  `(2) △는 ${c}에 1, 2, 3, …, □를 차례로 더한 수이므로 △ = ${c} + (1 + 2 + … + □)입니다. 1부터 □까지의 합은 거꾸로 더한 합과 짝지으면 (□ + 1)이 □번이므로 □ × (□ + 1) ÷ 2입니다. 따라서 △ = □ × (□ + 1) ÷ 2 + ${c}입니다.`,
  `(3) □ = ${ask}이면 △ = ${ask} × ${ask+1} ÷ 2 + ${c} = ${a3}입니다.`]);
 return {prompt,answer:`(1) ${vals.join(', ')} (2) △ = □ × (□ + 1) ÷ 2 + ${c} (3) ${a3}`,solution:sol};
}

/* ---------- 3단원 개념탐구 2 Mission 5: 날짜와 줄넘기 횟수 ---------- */
function u3e2m5(p){
 const {s,d}=p; const v=[2,3,4,5].map(k=>s+(k-1)*d); const c0=s-d;
 const table=`<table style="${TS}" aria-label="날짜와 줄넘기 횟수"><tbody><tr><th scope="row" style="${TH}">날짜(일)</th>${[1,2,3,4,5].map(k=>`<td style="${TC}">${k}</td>`).join('')}</tr><tr><th scope="row" style="${TH}">횟수(번)</th><td style="${TC}">${s}</td>${[2,3,4,5].map(()=>`<td style="${TC}"></td>`).join('')}</tr></tbody></table>`;
 const prompt=`<p>태주는 어느 달 한 달 동안 줄넘기를 매일 하려고 합니다. 어느 날의 줄넘기 횟수는 그 전날보다 ${d}번 더 한다고 할 때, 물음에 답하세요.</p><p>(1) 줄넘기를 한 날짜와 줄넘기를 한 횟수 사이의 대응 관계를 찾아 표를 완성하세요.</p>${table}<p>(2) 줄넘기를 한 날짜를 □, 줄넘기를 한 횟수를 △라고 할 때 두 양 사이의 대응 관계를 식으로 나타내세요.</p>`;
 const sol=ol([
  `(1) 하루가 지날 때마다 ${d}번씩 늘어나므로 2일부터 5일까지의 횟수는 ${v.join(', ')}번입니다.`,
  `(2) □일에는 1일보다 ${d}번씩 (□ − 1)번 더 하므로 △ = ${s} + (□ − 1) × ${d}입니다.`,
  `(2) 이것을 간단히 하면 △ = □ × ${d} + ${c0}입니다. (□ = 1일 때 ${d} + ${c0} = ${s}로 맞습니다.)`]);
 return {prompt,answer:`(1) ${v.join(', ')} (2) △ = □ × ${d} + ${c0}`,solution:sol};
}

/* ---------- 3단원 예제 3-1: 겹쳐 그린 사각형과 삼각형 ---------- */
function nestSvg(){
 let b=''; const S=70;
 for(let st=1;st<=3;st++){const x=6+(st-1)*(S+34),y=6;
  b+=`<rect x="${x}" y="${y}" width="${S}" height="${S}" style="fill:#e4e4e4;stroke:#777;stroke-width:1px"/>`;
  let sq=[[x,y],[x+S,y],[x+S,y+S],[x,y+S]];
  for(let k=0;k<st;k++){sq=sq.map((p,i)=>[(p[0]+sq[(i+1)%4][0])/2,(p[1]+sq[(i+1)%4][1])/2]);b+=pl([...sq,sq[0]]);}
  if(st<3)b+=arrow(x+S+13,y+S/2);}
 b+=T(6+2*(S+34)+S+22,6+S/2+4,'……',12);
 return SV(330,84,'색종이 위에 정사각형을 하나, 둘, 셋 차례로 겹쳐 그린 그림',b,360);
}
function u3e31(p){
 const {ask}=p; const a=ask*4;
 const prompt=`<p>수아는 색종이에 다음과 같은 규칙으로 사각형을 계속해서 그리고 있습니다. 그린 사각형의 수를 □, 찾을 수 있는 삼각형의 수를 △라 할 때, □와 △의 대응 관계를 식으로 나타내세요. 또, □ = ${ask}일 때, △의 값을 구하세요.</p>${nestSvg()}`
  +note('색종이의 테두리는 그린 사각형으로 세지 않고, 삼각형은 크기에 관계없이 모두 셉니다.');
 const sol=ol([
  `첫째 그림은 사각형을 1개 그렸고, 색종이의 네 귀퉁이에 삼각형이 4개 생깁니다.`,
  `사각형을 하나 더 그릴 때마다 바로 바깥 사각형의 네 귀퉁이에 삼각형이 4개씩 새로 생기고, 이 삼각형들을 합쳐서 만들어지는 더 큰 삼각형은 없습니다.`,
  `그래서 □가 1, 2, 3일 때 △는 4, 8, 12이고, △ = □ × 4입니다.`,
  `□ = ${ask}일 때 △ = ${ask} × 4 = ${a}입니다.`]);
 return {prompt,answer:`△ = □ × 4, ${a}`,solution:sol};
}

/* ---------- 3단원 예제 3-2: 바둑돌 차 ---------- */
function stoneSvg(){
 let b=''; const c=13; let x=6;
 for(let n=1;n<=3;n++){const N=n+2,y=6+(5-N)*c;
  for(let r=0;r<N;r++)for(let q=0;q<N;q++){const blk=(r===0&&q===0)||(r>0&&(q===r-1||q===r));
   b+=`<circle cx="${x+q*c+c/2}" cy="${y+r*c+c/2}" r="5" style="fill:${blk?'#222':'#fff'};stroke:${blk?'#222':'#888'};stroke-width:1px"/>`;}
  x+=N*c+16;}
 b+=T(x+8,6+5*c-c/2+4,'……',12);
 return SV(x+30,6+5*c+6,'검은 바둑돌과 흰 바둑돌을 정사각형 모양으로 놓은 첫째, 둘째, 셋째 배열',b,300);
}
function u3e32(p){
 const {ask}=p; const N=ask+2,bl=ask*2+3,wh=N*N-bl,a=wh-bl;
 const prompt=`<p>바둑돌로 다음 그림과 같은 모양을 만들었습니다. 배열 순서를 □, 검은 바둑돌과 흰 바둑돌 수의 차를 △라 할 때, 흰 돌의 개수가 검은 돌의 개수보다 많은 경우 □와 △ 사이의 대응 관계를 식으로 나타내고, ${ask}번째에 놓을 검은 바둑돌과 흰 바둑돌 수의 차는 몇 개인지 구하세요.</p>${stoneSvg()}`;
 const sol=ol([
  `□번째 모양은 가로, 세로로 (□ + 2)개씩 놓여 있습니다. 검은 돌은 맨 윗줄에 1개, 그 아래 (□ + 1)줄에 2개씩이므로 □ × 2 + 3개입니다.`,
  `흰 돌은 (□ + 2) × (□ + 2) − (□ × 2 + 3)개입니다. □ = 1이면 흰 돌 4개, 검은 돌 5개로 흰 돌이 더 적습니다.`,
  `□ = 2, 3, 4이면 흰 돌은 9, 16, 25개, 검은 돌은 7, 9, 11개이므로 차는 2, 7, 14입니다. 이것은 2 × 2 − 2, 3 × 3 − 2, 4 × 4 − 2이므로 △ = □ × □ − 2입니다.`,
  `${ask}번째에는 △ = ${ask} × ${ask} − 2 = ${a}입니다. (흰 돌 ${wh}개, 검은 돌 ${bl}개로 확인할 수 있습니다.)`]);
 return {prompt,answer:`△ = □ × □ − 2, ${a}개`,solution:sol};
}

/* ---------- 3단원 예제 3-3: 종이와 누름못 ---------- */
function pinStage(x,y,r,c){
 let b='';const P=24,st=20;
 for(let i=0;i<r;i++)for(let j=0;j<c;j++)b+=`<rect x="${x+j*st}" y="${y+i*st}" width="${P}" height="${P}" style="fill:#e4e4e4;stroke:#222;stroke-width:1.2px"/>`;
 for(let i=0;i<r;i++)for(let j=0;j<c;j++)b+=`<rect x="${x+j*st}" y="${y+i*st}" width="${P}" height="${P}" style="fill:none;stroke:#555;stroke-width:0.8px;stroke-dasharray:2 2"/>`;
 const px=k=>k===0?4:k===c?c*st:k*st+2, py=k=>k===0?4:k===r?r*st:k*st+2;
 for(let i=0;i<=r;i++)for(let j=0;j<=c;j++)b+=`<circle cx="${x+px(j)}" cy="${y+py(i)}" r="1.8" style="fill:#111"/>`;
 return b;
}
function pinSvg(){
 const st=[[1,1],[1,2],[2,2],[2,3],[3,3],[3,4]]; let b='';
 let x=8; const y1=10;
 for(let k=0;k<4;k++){const [r,c]=st[k];b+=pinStage(x,y1+(2-r)*10,r,c);x+=c*20+4;b+=arrow(x+8,y1+22);x+=22;}
 let x2=40; const y2=72;
 b+=arrow(x2-14,y2+34);
 for(let k=4;k<6;k++){const [r,c]=st[k];b+=pinStage(x2,y2,r,c);x2+=c*20+4;b+=arrow(x2+8,y2+34);x2+=22;}
 b+=T(x2+4,y2+38,'…',12);
 return SV(300,142,'정사각형 종이를 겹쳐 누름못으로 붙인 여섯 단계 그림',b,360);
}
function u3e33(p){
 const {n}=p; const prod=n*(n+1), a=(n+1)*(n+2);
 const prompt=`<p>다음 그림과 같은 방법으로 정사각형 모양의 종이를 누름못으로 붙이고 있습니다. 붙인 종이 수를 □ × ○, 사용된 누름못의 수를 △라 할 때, □ × ○와 △의 관계를 식으로 나타내세요. 또, □ × ○ = ${prod}일 때, △의 값을 구하세요.</p>${pinSvg()}`
  +note('□는 세로로 놓인 종이 수, ○는 가로로 놓인 종이 수이고, 종이는 그림의 순서대로 계속 붙여 나갑니다.');
 const sol=ol([
  `종이를 겹쳐 붙인 곳에서는 누름못을 함께 쓰므로, 종이가 세로로 □장, 가로로 ○장이면 누름못은 세로로 (□ + 1)줄, 가로로 (○ + 1)줄 놓입니다.`,
  `그래서 △ = (□ + 1) × (○ + 1)입니다. 그림에서 1 × 1일 때 4개, 1 × 2일 때 6개, 2 × 2일 때 9개, 2 × 3일 때 12개로 맞습니다.`,
  `그림의 순서대로 붙이면 종이 수는 1 × 1, 1 × 2, 2 × 2, 2 × 3, 3 × 3, …이고, ${prod} = ${n} × ${n+1}이므로 □ = ${n}, ○ = ${n+1}입니다.`,
  `따라서 △ = ${n+1} × ${n+2} = ${a}입니다.`]);
 return {prompt,answer:`△ = (□ + 1) × (○ + 1), ${a}개`,solution:sol};
}

/* ---------- 3단원 Mission 5: 지그재그 선과 삼각형 ---------- */
function zigSvg(){
 let b=''; const w=22,h=44; let x=24; const y=8; const names=['첫 번째','두 번째','세 번째'];
 for(let n=1;n<=3;n++){
  b+=`<rect x="${x}" y="${y}" width="${w*n}" height="${h}" style="fill:#dcdcdc;stroke:#222;stroke-width:1.4px"/>`;
  b+=ln(x,y+h/2,x+w*n,y+h/2);
  for(let i=1;i<n;i++)b+=ln(x+w*i,y,x+w*i,y+h);
  const pts=[];for(let i=0;i<=n;i++)pts.push([x+w*i,i%2===0?y:y+h]);b+=pl(pts);
  b+=T(x+w*n/2,y+h+18,names[n-1],12);
  x+=w*n; if(n<3){b+=arrow(x+12,y+h/2);x+=30;}}
 b+=T(x+20,y+h/2+4,'…',12);
 return SV(x+34,y+h+26,'직사각형 안에 지그재그 선을 그은 첫 번째, 두 번째, 세 번째 그림',b,320);
}
function u3m5t(p){
 const {ask}=p; const a=ask*6-2;
 const prompt=`<p>다음과 같은 규칙에 따라 □번째 그림에서 만들어지는 크고 작은 삼각형의 개수를 △개라고 할 때, □와 △의 대응 관계를 식으로 나타내세요. 또, □ = ${ask}일 때, △의 값을 구하세요.</p>${zigSvg()}`;
 const sol=ol([
  `첫 번째 그림에는 작은 삼각형 2개와 큰 삼각형 2개가 있어 삼각형이 4개입니다.`,
  `한 칸을 더 붙일 때마다 새 칸 안에서 작은 삼각형 2개와 큰 삼각형 2개, 바로 앞 칸과 함께 만들어지는 삼각형 2개(큰 것 1개, 작은 것 1개)가 새로 생겨 6개씩 늘어납니다.`,
  `그래서 □가 1, 2, 3일 때 △는 4, 10, 16이고, △ = 4 + (□ − 1) × 6 = □ × 6 − 2입니다.`,
  `□ = ${ask}일 때 △ = ${ask} × 6 − 2 = ${a}입니다.`]);
 return {prompt,answer:`△ = □ × 6 − 2, ${a}개`,solution:sol};
}

/* ---------- 3단원 Mission 6: 흰색·검은색 타일 ---------- */
function tileSvg(){
 let b=''; const c=10; let x=6; const H=5*c, y0=6;
 for(let n=1;n<=5;n++){const y=y0+H-n*c;
  for(let r=0;r<n;r++)for(let q=0;q<n;q++){const k=n-Math.min(r,q);const blk=k%2===0;
   b+=`<rect x="${x+q*c}" y="${y+r*c}" width="${c}" height="${c}" style="fill:${blk?'#333':'#fff'};stroke:#222;stroke-width:1px"/>`;}
  x+=n*c+14;}
 b+=T(x+6,y0+H-4,'……',12);
 return SV(x+26,H+12,'흰색과 검은색 타일을 정사각형 모양으로 놓아 간 다섯 단계 그림',b,320);
}
function u3m6t(p){
 const {s,per}=p; const n=per/4/s;
 const odd=[],even=[];for(let k=1;k<=n;k++)(k%2?odd:even).push(2*k-1);
 const W=odd.reduce((a,b)=>a+b,0),B=even.reduce((a,b)=>a+b,0),a=Math.abs(W-B);
 const prompt=`<p>한 변의 길이가 ${s} cm인 정사각형 모양의 흰색 타일과 검은색 타일을 다음 그림과 같이 놓아 가고 있습니다. 바깥쪽 네 변의 길이의 합이 ${per} cm일 때, 흰색 타일과 검은색 타일의 개수의 차는 몇 개인가요?</p>${tileSvg()}`;
 const more=W>B?'흰색':'검은색';
 const sol=ol([
  `바깥쪽 한 변의 길이는 ${per} ÷ 4 = ${per/4}(cm)이고, 한 변에 타일이 ${per/4} ÷ ${s} = ${n}(개) 놓이므로 ${n}번째 모양입니다.`,
  `모양은 한 단계마다 바깥쪽의 위쪽 한 줄과 왼쪽 한 줄에 타일을 붙여 커지고, □번째에 붙이는 타일은 □ × 2 − 1개입니다. 홀수 번째에는 흰색, 짝수 번째에는 검은색을 붙입니다.`,
  `${n}번째 모양에서 흰색은 ${odd.join(' + ')} = ${W}(개), 검은색은 ${even.join(' + ')} = ${B}(개)입니다.`,
  `따라서 ${more} 타일이 ${W>B?W:B} − ${W>B?B:W} = ${a}(개) 더 많아 개수의 차는 ${a}개입니다.`]);
 return {prompt,answer:`${a}개`,solution:sol};
}

/* ---------- 4단원 Mission 6: 같은 수를 빼서 크기가 같은 분수 ---------- */
function u4m6(p){
 const {a,b,c,d}=p; // a/b 와 같은 분수에서 빼서 c/d
 let best=null; for(let k=1;k<200&&!best;k++){const diff=(b-a)*k;if(diff%(d-c))continue;const t=diff/(d-c);const x=a*k-c*t;if(x>=10&&x<=99&&b*k-x===d*t&&c*t>0)best={k,t,x};}
 const {k,t,x}=best; const m=(a*1-c*((b-a)/(d-c))); // ㉠ = m × □
 const wa=bat(a)?'과':'와',wc=bat(c)?'과':'와';
 const prompt=`<p>${ff(a,b)}${wa} 크기가 같은 분수의 분모와 분자에서 각각 두 자리 수 ㉠을 뺐더니 ${ff(c,d)}${wc} 크기가 같은 분수가 되었습니다. ㉠이 가장 작을 때의 값을 구하세요.</p>`;
 const sol=ol([
  `분모와 분자에서 같은 수를 빼도 분모와 분자의 차는 변하지 않습니다.`,
  `${ff(a,b)}${wa} 크기가 같은 분수를 ${ff(a+' × □',b+' × □')}라 하면 분모와 분자의 차는 ${b-a} × □입니다. ${ff(c,d)}${wc} 크기가 같은 분수 중에서 분모와 분자의 차가 ${b-a} × □인 것은 ${ff(c===1?'□':c+' × □',d+' × □')}입니다.`,
  `그러므로 분자에서 ${a} × □ − ㉠ = ${c===1?'□':c+' × □'}이고, ㉠ = ${m} × □입니다.`,
  `㉠은 두 자리 수이므로 가장 작은 경우는 □ = ${k}일 때 ㉠ = ${m} × ${k} = ${x}입니다. (${ff(a*k,b*k)}에서 ${jo(x,'을','를')} 빼면 ${ff(a*k-x,b*k-x)}이고, 이것은 ${ff(c,d)}${wc} 크기가 같습니다.)`]);
 return {prompt,answer:String(x),solution:sol};
}

/* ---------- 5단원: 서로 다른 세 단위분수의 합 ---------- */
function uf(p){
 const {n,d,reps,pick}=p; const [x,y,z]=pick; const L=lcmAll([x,y,z]), N=n*L/d;
 const show3=r=>r.map(v=>ff(1,v)).join(' + ');
 const prompt=`<p>${ff(n,d)}${bat(n)?'을':'를'} 서로 다른 세 단위분수의 합으로 나타내세요.</p>`
  +note('나타내는 방법이 여러 가지이므로, 세 분모 중 가장 큰 분모가 가장 작은 것을 답합니다.');
 const sol=ol([
  `분모를 작은 것부터 차례로 정하며 빠짐없이 찾으면, 서로 다른 세 단위분수의 합으로 나타내는 방법은 ${reps.map(show3).join(', ')}의 ${reps.length}가지입니다.`,
  `이 중에서 가장 큰 분모가 가장 작은 것은 가장 큰 분모가 ${z}인 ${show3(pick)}입니다.`,
  `확인: 분모를 ${L}로 통분하면 ${ff(n,d)} = ${ff(N,L)}이고, ${N} = ${L/x} + ${L/y} + ${L/z}이므로 ${ff(N,L)} = ${ff(L/x,L)} + ${ff(L/y,L)} + ${ff(L/z,L)} = ${show3(pick)}입니다.`]);
 return {prompt,answer:show3(pick),solution:sol};
}

const ITEMS={
 '5-1-u1-t2-8':{sourceItemId:'5-1-u1-e2-mission-3',key:'orig51U1E2Mission3',resultContract:'single-value',answerVisualRequired:false,
  answerAssumption:'스케치북·공책·음료수는 모두 처음 돈의 반으로 샀고, 남은 돈은 그 반에서 남은 돈이다.',
  pool:mk(u1m3,[{sk:1000,nb:500,nc:4,dr:600,left:3400},{sk:1200,nb:400,nc:5,dr:700,left:2100},{sk:1500,nb:600,nc:3,dr:800,left:2400}])},
 '5-1-u2-t5-6':{sourceItemId:'5-1-u2-e5-example-5-4',key:'orig51U2E5Example54',resultContract:'single-value',answerVisualRequired:false,
  answerAssumption:'세 수의 최소공배수가 될 수 있는 수 중 가장 작은 수를 구한다.',
  pool:mk(u2e54,[{pq:18,qr:12,pr:30},{pq:10,qr:15,pr:35},{pq:20,qr:12,pr:28}])},
 '5-1-u2-t5-14':{sourceItemId:'5-1-u2-e5-mission-6',key:'orig51U2E5Mission6',resultContract:'multi-value',answerVisualRequired:false,
  pool:mk(u2m6,[{q:[2,3,5]},{q:[2,3,7]},{q:[3,4,5]}])},
 '5-1-u2-t7-2':{sourceItemId:'5-1-u2-e7-example-7-1',key:'orig51U2E7Example71',resultContract:'multi-value',answerVisualRequired:false,
  answerAssumption:'조건에 맞는 학생 수를 모두 구한다.',
  pool:mk(u2e71,[{it:[['사과',60,4],['귤',131,5],['감',100,2]]},{it:[['사과',51,3],['귤',86,6],['감',113,1]]},{it:[['사과',58,4],['귤',97,7],['감',128,2]]}])},
 '5-1-u2-t7-8':{sourceItemId:'5-1-u2-e7-mission-3',key:'orig51U2E7Mission3',resultContract:'single-value',answerVisualRequired:false,
  answerAssumption:'남거나 모자라는 개수는 학생 수보다 적다.',
  pool:mk(u2m3,[{it:[['사탕',28,'부족',2],['초콜릿',48,'남음',3],['과자',69,'부족',6]]},{it:[['사탕',37,'부족',5],['초콜릿',58,'남음',2],['과자',76,'부족',8]]},{it:[['사탕',38,'부족',4],['초콜릿',68,'남음',5],['과자',75,'부족',9]]}])},
 '5-1-u2-t8-11':{sourceItemId:'5-1-u2-e8-mission-6',key:'orig51U2E8Mission6',resultContract:'multi-value',answerVisualRequired:false,
  answerAssumption:'조건에 맞는 (㉮, ㉯, ㉰)를 모두 구한다.',
  pool:mk(u2e8m6,[{P:210,g:10,L:150},{P:60,g:4,L:84},{P:126,g:6,L:210}])},
 '5-1-u3-t1-4':{sourceItemId:'5-1-u3-e1-example-1-3',key:'orig51U3E1Example13',resultContract:'single-value',answerVisualRequired:false,
  pool:mk(u3e13,[{expr:'1+(7+2)×3−(6+4)÷5',steps:'1 + 9 × 3 − 10 ÷ 5 = 1 + 27 − 2',ans:26},
   {expr:'9+(4+3)×8−(1+7)÷2',steps:'9 + 7 × 8 − 8 ÷ 2 = 9 + 56 − 4',ans:61},
   {expr:'2+(5+1)×6−(8+7)÷3',steps:'2 + 6 × 6 − 15 ÷ 3 = 2 + 36 − 5',ans:33}])},
 '5-1-u3-t1-5':{sourceItemId:'5-1-u3-e1-example-1-4',key:'orig51U3E1Example14',resultContract:'single-value',answerVisualRequired:false,
  pool:mk(u3e14,[{m:3,d:5},{m:7,d:8},{m:4,d:9}])},
 '5-1-u3-t1-8':{sourceItemId:'5-1-u3-e1-mission-3',key:'orig51U3E1Mission3',resultContract:'single-value',answerVisualRequired:false,
  pool:mk(u3m3,[{expr:'3+4+5−8',steps:'3 + 4 + 5 − 8',ans:4},{expr:'9−2+6×3',steps:'9 − 2 + 18',ans:25},{expr:'7×8÷4−1',steps:'56 ÷ 4 − 1 = 14 − 1',ans:13}])},
 '5-1-u3-t1-11':{sourceItemId:'5-1-u3-e1-mission-6',key:'orig51U3E1Mission6',resultContract:'single-value',answerVisualRequired:false,
  pool:mk(u3m6,[{h:[3,1,3,0]},{h:[2,3,1,0]},{h:[1,4,2,0]}])},
 '5-1-u3-t2':{sourceItemId:'5-1-u3-e2-exploration',key:'orig51U3E2Exploration',resultContract:'multi-value',answerVisualRequired:false,
  pool:mk(u3x2,[{c:1,ask:12},{c:3,ask:10},{c:2,ask:14}])},
 '5-1-u3-t2-9':{sourceItemId:'5-1-u3-e2-mission-5',key:'orig51U3E2Mission5',resultContract:'multi-value',answerVisualRequired:false,
  pool:mk(u3e2m5,[{s:200,d:10},{s:150,d:15},{s:120,d:20}])},
 '5-1-u3-t3-2':{sourceItemId:'5-1-u3-e3-example-3-1',key:'orig51U3E3Example31',resultContract:'multi-value',answerVisualRequired:false,
  answerAssumption:'색종이의 테두리는 그린 사각형으로 세지 않고, 삼각형은 크기에 관계없이 모두 센다.',
  pool:mk(u3e31,[{ask:6},{ask:9},{ask:13}])},
 '5-1-u3-t3-3':{sourceItemId:'5-1-u3-e3-example-3-2',key:'orig51U3E3Example32',resultContract:'multi-value',answerVisualRequired:false,
  pool:mk(u3e32,[{ask:10},{ask:12},{ask:15}])},
 '5-1-u3-t3-4':{sourceItemId:'5-1-u3-e3-example-3-3',key:'orig51U3E3Example33',resultContract:'multi-value',answerVisualRequired:false,
  answerAssumption:'□는 세로로 놓인 종이 수, ○는 가로로 놓인 종이 수이고 종이는 그림의 순서대로 붙여 나간다.',
  pool:mk(u3e33,[{n:9},{n:7},{n:11}])},
 '5-1-u3-t3-9':{sourceItemId:'5-1-u3-e3-mission-5',key:'orig51U3E3Mission5',resultContract:'multi-value',answerVisualRequired:false,
  pool:mk(u3m5t,[{ask:8},{ask:11},{ask:15}])},
 '5-1-u3-t3-10':{sourceItemId:'5-1-u3-e3-mission-6',key:'orig51U3E3Mission6',resultContract:'single-value',answerVisualRequired:false,
  pool:mk(u3m6t,[{s:3,per:204},{s:3,per:240},{s:4,per:368}])},
 '5-1-u4-t1-11':{sourceItemId:'5-1-u4-e1-mission-6',key:'orig51U4E1Mission6',resultContract:'single-value',answerVisualRequired:false,
  pool:mk(u4m6,[{a:4,b:7,c:1,d:4},{a:9,b:11,c:1,d:3},{a:8,b:9,c:1,d:2}])},
 '5-1-u5-t4':{sourceItemId:'5-1-u5-e4-exploration-1',key:'orig51U5E4Exploration1',resultContract:'single-value',answerVisualRequired:false,
  answerAssumption:'여러 표현 중 세 분모 중 가장 큰 분모가 가장 작은 것을 답한다.',
  pool:mk(uf,[{n:3,d:7,reps:[[3,11,231],[3,12,84],[3,14,42],[3,15,35],[4,6,84],[4,7,28]],pick:[4,7,28]},
   {n:4,d:7,reps:[[2,15,210],[2,16,112],[2,18,63],[2,21,42],[3,6,14]],pick:[3,6,14]},
   {n:5,d:11,reps:[[3,9,99],[3,11,33],[4,5,220]],pick:[3,11,33]}])},
 '5-1-u5-t4-11':{sourceItemId:'5-1-u5-e4-mission-5',key:'orig51U5E4Mission5',resultContract:'single-value',answerVisualRequired:false,
  answerAssumption:'여러 표현 중 세 분모 중 가장 큰 분모가 가장 작은 것을 답한다.',
  pool:mk(uf,[{n:7,d:9,reps:[[2,4,36],[2,6,9]],pick:[2,6,9]},
   {n:7,d:11,reps:[[2,8,88],[2,11,22]],pick:[2,11,22]},
   {n:11,d:15,reps:[[2,5,30],[2,6,15]],pick:[2,6,15]}])},
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
