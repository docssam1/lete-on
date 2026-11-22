// 황소 6학년 마지막 잠금 원문 유형 묶음: 6-2 2단원 개념탐구 5 Mission 5(양초), 6-2 3단원 개념탐구 4 Mission 3 개수 부분, 6-1 4단원 개념탐구 1 예제 1-1.
// 원문 수치를 보존한 변형 0과 수만 바꾼 변형 1·2를 고정 검증 풀(fixed-verified-pool)로 제공합니다.
(function(root){'use strict';
const GROUP='6-last';
const ff=(n,d)=>`<span class="math-fraction" role="img" aria-label="${d}분의 ${n}"><span>${n}</span><span>${d}</span></span>`; // 분수
const mx=(w,n,d)=>`<span class="math-mixed-number" role="img" aria-label="${w}과 ${d}분의 ${n}"><span>${w}</span>${ff(n,d)}</span>`; // 대분수
const wrap=(id,i,body)=>`<div class="source6-original" data-source-item-id="${id}" data-pool-index="${i}">${body}</div>`;
const ol=steps=>'<ol>'+steps.map(s=>`<li>${s}</li>`).join('')+'</ol>';

// ---------- 6-2 2단원 Mission 5: 양초 ----------
// [처음 길이, 10분마다 타는 길이, 남은 길이]
function candle(L,r,R){
 const fx=x=>String(Math.round(x*100)/100);
 const burn=Math.round((L-R)*100)/100,k=Math.round(burn*100)/Math.round(r*100),min=k*10,h=Math.floor(min/60),m=min%60;
 const ans=`${h}시간 ${m}분`;
 return {prompt:`<p>길이가 ${fx(L)} cm인 양초가 한 개 있습니다. 이 양초에 불을 붙이면 10분에 ${fx(r)} cm씩 일정한 빠르기로 탑니다. 불을 붙인 뒤 몇 시간 몇 분이 지나면 양초가 ${fx(R)} cm 남겠습니까?</p>`,
  answer:ans,
  solution:ol([`탄 양초의 길이는 ${fx(L)}−${fx(R)}=${fx(burn)}(cm)입니다.`,
   `10분에 ${fx(r)} cm씩 타므로 ${fx(burn)}÷${fx(r)}=${k}에서 10분이 ${k}번 지나야 합니다.`,
   `걸린 시간은 10×${k}=${min}(분)이고, ${min}분=${h}시간 ${m}분입니다.`])};
}

// ---------- 6-2 3단원 Mission 3 (개수 부분): 정육면체 모서리 꼭짓점 자르기 ----------
const r2=x=>Math.round(x*100)/100;
const P=p=>`${r2(p[0])},${r2(p[1])}`;
const svg=(w,h,body,label)=>`<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${label}" style="width:100%;max-width:360px;height:auto;display:block;margin:8px auto" xmlns="http://www.w3.org/2000/svg" font-family="inherit">${body}</svg>`;
const T=(p,s)=>`<text x="${r2(p[0])}" y="${r2(p[1])}" text-anchor="middle" dominant-baseline="middle" font-size="14" fill="#222">${s}</text>`;
const seg=(a,b,w,c)=>`<path d="M${P(a)} L${P(b)}" stroke="${c||'#222'}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
function cubeFig(n){
 const W=180,DX=80,DY=60,c=W/n,ox=40,oy=272;
 // x: 왼→오, y: 앞→뒤, z: 아래→위
 const pr=(x,y,z)=>[ox+x*c+y*DX/n,oy-z*c-y*DY/n];
 let s='';
 const face=(pts,fill)=>`<path d="M${pts.map(P).join(' L')} Z" fill="${fill}" stroke="none"/>`;
 s+=face([pr(0,0,0),pr(n,0,0),pr(n,0,n),pr(0,0,n)],'#f4f4f2')+face([pr(0,0,n),pr(n,0,n),pr(n,n,n),pr(0,n,n)],'#ebebe8')+face([pr(n,0,0),pr(n,n,0),pr(n,n,n),pr(n,0,n)],'#e0e0dc');
 for(let i=1;i<n;i++){
  s+=seg(pr(i,0,0),pr(i,0,n),.9,'#555')+seg(pr(0,0,i),pr(n,0,i),.9,'#555'); // 앞면
  s+=seg(pr(i,0,n),pr(i,n,n),.9,'#555')+seg(pr(0,i,n),pr(n,i,n),.9,'#555'); // 윗면
  s+=seg(pr(n,i,0),pr(n,i,n),.9,'#555')+seg(pr(n,0,i),pr(n,n,i),.9,'#555'); // 오른쪽 옆면
 }
 s+=`<path d="M${P(pr(0,0,0))} L${P(pr(n,0,0))} L${P(pr(n,n,0))} L${P(pr(n,n,n))} L${P(pr(0,n,n))} L${P(pr(0,0,n))} Z" stroke="#222" stroke-width="1.4" fill="none" stroke-linejoin="round"/>`;
 s+=seg(pr(0,0,n),pr(n,0,n),1.4)+seg(pr(n,0,n),pr(n,0,0),1.4)+seg(pr(n,0,n),pr(n,n,n),1.4);
 const A=pr(n,n,n),B=pr(0,0,n),C=pr(n,0,0);
 s+=seg(B,A,2)+seg(B,C,2)+seg(A,C,2);
 s+=[A,B,C].map(p=>`<circle cx="${r2(p[0])}" cy="${r2(p[1])}" r="3" fill="#222"/>`).join('');
 s+=T([A[0]+12,A[1]-8],'A')+T([B[0]-13,B[1]],'B')+T([C[0],C[1]+16],'C');
 return svg(345,300,s,`쌓기나무 ${n*n*n}개로 만든 정육면체와 꼭짓점 A, B, C를 잇는 자른 면`);
}
function cubeCut(n){
 const layers=[];for(let k=1;k<=n;k++)layers.push({k,floor:n-k+1,top:n-k+1,bot:n-k,cnt:(n-k+1)+(n-k)});
 const total=layers.reduce((s,l)=>s+l.cnt,0);
 return {prompt:`<p>크기가 같은 쌓기나무 ${n*n*n}개로 정육면체를 만들었습니다. 이 정육면체를 그림과 같이 꼭짓점 A, B, C를 지나는 평면으로 잘랐을 때, 잘린 쌓기나무는 모두 몇 개입니까?</p>`+cubeFig(n)+
   `<p>※ 조건 보충: 자른 면이 꼭짓점에만 닿은 쌓기나무는 잘린 것으로 세지 않습니다.</p>`,
  answer:`${total}개`,
  solution:ol([`A, B, C와 모두 모서리로 이어진 꼭짓점(위·앞·오른쪽 꼭짓점)을 ㄱ이라 하면, 자른 면은 ㄱ에서 왼쪽으로 ${n}칸, 뒤로 ${n}칸, 아래로 ${n}칸 떨어진 세 점을 지납니다.`,
   `그래서 한 층을 위에서 보면, 자른 면은 그 층의 윗면과 아랫면에 ㄱ 쪽 모서리와 나란한 대각선 모양의 선을 하나씩 만들고, 아랫면의 선이 윗면의 선보다 ㄱ 쪽으로 한 칸 가깝습니다.`,
   `한 층을 위에서 볼 때 ㄱ 쪽 모서리에서 몇 칸 떨어진 대각선 선은 그 칸 수만큼의 쌓기나무 안쪽을 지나므로, 한 층에서 잘린 쌓기나무는 두 선이 지나는 쌓기나무 수의 합입니다.`,
   ...layers.map(l=>l.bot?`${l.floor}층: 윗면의 선은 ${l.top}칸, 아랫면의 선은 ${l.bot}칸 떨어져 있으므로 ${l.top}+${l.bot}=${l.cnt}(개)입니다.`:`${l.floor}층: 윗면의 선은 ${l.top}칸 떨어져 있고 아랫면에서는 꼭짓점 한 점에서만 만나므로 ${l.cnt}개입니다.`),
   `잘린 쌓기나무는 모두 ${layers.map(l=>l.cnt).join('+')}=${total}(개)입니다.`])};
}

// ---------- 6-1 4단원 예제 1-1: 두 비를 이어 비율 구하기 ----------
// [㉯에 대한 ㉮의 비율(소수), 분수 a/b, ㉰에 대한 ㉯의 비율(소수), 분수 c/d]
const gcd=(a,b)=>b?gcd(b,a%b):a,lcm=(a,b)=>a/gcd(a,b)*b;
function chain(r1,a,b,r2s,c,d){
 const L=lcm(b,c),p=a*L/b,q=L,r=d*L/c,g=gcd(p,r),N=p/g,D=r/g;
 return {prompt:`<p>㉯에 대한 ㉮의 비율이 ${r1}이고, ㉰에 대한 ㉯의 비율이 ${r2s}입니다. ㉰에 대한 ㉮의 비율을 기약분수로 나타내시오.</p>`,
  answer:ff(N,D),
  solution:ol([`㉯에 대한 ㉮의 비율이 ${r1}=${ff(a,b)}이므로 ㉮ : ㉯=${a} : ${b}입니다.`,
   `㉰에 대한 ㉯의 비율이 ${r2s}=${ff(c,d)}이므로 ㉯ : ㉰=${c} : ${d}입니다.`,
   `㉯를 ${b}와 ${c}의 최소공배수 ${L}로 맞추면 ㉮ : ㉯=${p} : ${q}, ㉯ : ㉰=${q} : ${r}입니다.`,
   `따라서 ㉮ : ㉰=${p} : ${r}이고, ㉰에 대한 ㉮의 비율은 ${ff(p,r)}=${ff(N,D)}입니다.`])};
}

const ITEMS={
 '6-2-u2-e5-mission-5':{key:'source62U2E5Mission5',resultContract:'single-value',answerVisualRequired:false,pool:[
   candle(21.7,0.24,9.7),candle(25.3,0.18,7.3),candle(19.6,0.32,6.8)]},
 '6-2-u3-e4-mission-3-2':{key:'source62U3E4Mission32',resultContract:'single-value',answerVisualRequired:false,
   answerAssumption:'자른 면이 꼭짓점에만 닿은 쌓기나무는 잘린 것으로 세지 않습니다.',pool:[cubeCut(4),cubeCut(5),cubeCut(6)]},
 '6-1-u4-e1-example-1-1':{key:'source61U4E1Example11',resultContract:'single-value',answerVisualRequired:false,
   answerAssumption:'원문에서 가려진 두 번째 비율과 묻는 비율을 읽을 수 있는 구조에 맞게 정했습니다.',pool:[
   chain('2.5',5,2,'0.88',22,25),chain('1.6',8,5,'0.45',9,20),chain('3.5',7,2,'0.36',9,25)]},
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
