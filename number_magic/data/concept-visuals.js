/* Small, exact worked illustrations shared by the lesson and A4 worksheet.
   These are examples, never the answers to a generated practice question. */
(function(root){
'use strict';
const T=(ko,en,zh)=>({ko,en,zh});
const MODELS={
 'DC1:5':{kind:'decimal',a:287,b:156,places:1,op:'+',answer:443},
 'DC1:6':{kind:'decimal',a:523,b:189,places:1,op:'−',answer:334},
 'DC1:7':{kind:'decimal',a:12645,b:7838,places:2,op:'+',answer:20483},
 'DC1:8':{kind:'decimal',a:30520,b:12746,places:2,op:'−',answer:17774},
 'FR3:3':{kind:'carry',whole:[28,15],parts:[4,5],den:6,resultWhole:44,resultPart:3},
 'FR3:4':{kind:'borrow',whole:[52,18],parts:[2,5],den:8,resultWhole:33,resultPart:5},
 'FR4:3':{kind:'split',left:2,right:3,numerator:1},
 'FR4:4':{kind:'chain',end:4},
 'ML11:6':{kind:'factorial',n:4,answer:24},
 'MD111:4':{kind:'factorial-deep',n:7,k:4,answer:210}
};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pick=(v,l)=>typeof v==='string'?v:v[l]||v.ko;
const ink='#1A2233',blue='#16417C',gold='#C9A063',green='#2E9E6B';
function text(x,y,s,size=22,col=ink,anchor='middle'){
 return `<text x="${x}" y="${y}" font-size="${size}" fill="${col}" text-anchor="${anchor}" font-weight="700">${esc(s)}</text>`;
}
function arrow(x,y){return `<path d="M${x-14} ${y}h28m-9-7 9 7-9 7" fill="none" stroke="${gold}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;}
function fraction(x,y,n,d,col=ink){
 return text(x,y-8,n,20,col)+`<path d="M${x-22} ${y}h44" stroke="${col}" stroke-width="2"/>`+text(x,y+23,d,20,col);
}
function bar(x,y,den,count,col=blue){
 let out='';
 for(let i=0;i<den;i++) out+=`<rect x="${x+i*22}" y="${y}" width="20" height="25" rx="3" fill="${i<count?col:'#fff'}" stroke="${ink}" stroke-width="1.2"/>`;
 return out;
}
function decimal(m,l){
 const scale=10**m.places,fmt=n=>(n/scale).toFixed(m.places);
 const rows=[fmt(m.a),fmt(m.b),fmt(m.answer)],digits=rows.map(s=>s.split('.')[0].length),max=Math.max(...digits);
 let out=text(154,22,pick(T('같은 자리끼리','Line up the places','对齐数位'),l),17);
 // A fixed grid keeps the decimal points in one column, including 305.20.
 rows.forEach((s,r)=>{
   const chars=s.padStart(max+1+m.places,' ').split('');
   chars.forEach((c,i)=>{if(c!==' ') out+=text(48+i*27,53+r*35,c,25,c==='.'?green:ink);});
 });
 out+=text(21,88,m.op,25)+`<path d="M26 100h235" stroke="${blue}" stroke-width="2"/>`;
 out+=arrow(303,78)+text(303,47,'×'+scale,16,blue);
 out+=text(469,35,`${m.a} ${m.op} ${m.b}`,23)+text(469,78,'= '+m.answer,25,blue);
 out+=text(469,125,`÷ ${scale} = ${fmt(m.answer)}`,23,green);
 return out;
}
function mixed(m,l){
 const carry=m.kind==='carry',den=m.den,total=carry?m.parts[0]+m.parts[1]:m.parts[0]+den;
 let out=text(120,22,pick(carry?T('분수끼리 더해요','Add the fractions','分数相加'):T('1을 같은 조각으로 바꿔요','Trade 1 for equal parts','把1换成等份'),l),16);
 out+=bar(20,39,den,carry?m.parts[0]:den,blue);
 out+=text(20+den*22+20,60,carry?'+':'+',20);
 out+=bar(20,80,den,carry?m.parts[1]:m.parts[0],green);
 out+=arrow(264,76);
 out+=bar(303,39,den,den,blue)+bar(303,80,den,carry?total-den:m.parts[0],green);
 if(!carry) for(let i=0;i<m.parts[1];i++) out+=`<path d="M${305+i*22} 42l16 19m0-19-16 19" stroke="#D9534F" stroke-width="2.5"/>`;
 out+=text(560,60,carry?'1':`− ${m.parts[1]}/${den}`,19);
 out+=text(560,101,`${m.resultPart}/${den}`,21,green);
 out+=text(310,139,carry?`${m.whole[0]} + ${m.whole[1]} + 1 = ${m.resultWhole}`:`${m.whole[0]} − 1 − ${m.whole[1]} = ${m.resultWhole}`,22);
 return out;
}
function split(m,l){
 let out=text(320,23,pick(T('같은 크기로 나누면 차이가 보여요','Use equal parts to see the difference','分成同样大小就能看出差'),l),17);
 // Both bars use SIX equal cells: 1/2=3/6, 1/3=2/6. The remaining cell is 1/6.
 out+=bar(24,45,6,3,blue)+fraction(187,62,1,2)+text(231,65,'−');
 out+=bar(263,45,6,2,green)+fraction(425,62,1,3)+text(464,65,'=');
 out+=bar(496,45,6,1,gold);
 out+=fraction(144,122,1,'2 × 3')+text(207,129,'=')+fraction(273,122,1,2)+text(327,129,'−')+fraction(381,122,1,3)+text(436,129,'=')+fraction(492,122,1,6);
 return out;
}
function chain(m,l){
 let out=text(320,23,pick(T('같은 분수가 더해졌다가 빠져요','Matching fractions cancel','相同分数加上又减去'),l),17);
 const xs=[55,146,229,320,403,494];
 out+=text(xs[0],74,'1',24)+text(97,74,'−')+fraction(xs[1],66,1,2,blue);
 out+=text(189,74,'+')+fraction(xs[2],66,1,2,blue)+text(273,74,'−')+fraction(xs[3],66,1,3,green);
 out+=text(362,74,'+')+fraction(xs[4],66,1,3,green)+text(447,74,'−')+fraction(xs[5],66,1,4);
 for(const x of [146,229,320,403]) out+=`<path d="M${x-24} 93l48-51" stroke="${gold}" stroke-width="2"/>`;
 out+=text(320,140,'1 − 1/4 = 3/4',24,blue);
 return out;
}
function factorial(m,l){
 let out=text(320,23,pick(T('한 자리씩 선택지가 줄어요','One fewer choice at each place','每选一个，选择少一个'),l),17);
 for(let i=0;i<m.n;i++){
   const x=72+i*135,n=m.n-i;
   out+=`<rect x="${x-43}" y="39" width="86" height="54" rx="8" fill="#fdf6e3" stroke="${gold}"/>`;
   out+=text(x,74,n,28,blue);
   if(i<m.n-1) out+=text(x+67,74,'×',24);
 }
 out+=text(320,139,`${m.n}! = ${Array.from({length:m.n},(_,i)=>i+1).join(' × ')} = ${m.answer}`,23);
 return out;
}
function factorialDeep(m,l){
 let out=text(320,23,pick(T('겹치는 곱을 먼저 약분합니다','Cancel the common product first','先约去共同的乘积'),l),17);
 out+=fraction(57,78,'7!','4!')+text(101,84,'=');
 out+=text(336,66,'7 × 6 × 5 × 4 × 3 × 2 × 1',23);
 out+=`<path d="M156 78h361" stroke="${ink}" stroke-width="2"/>`+text(431,108,'4 × 3 × 2 × 1',23);
 out+=`<path d="M348 45l165 27 M348 92l165 25" stroke="${gold}" stroke-width="2"/>`;
 out+=text(320,147,'7 × 6 × 5 = 210',23,blue);
 return out;
}
const DRAW={decimal,mixed,split,chain,factorial,'factorial-deep':factorialDeep,carry:mixed,borrow:mixed};
const TITLES={decimal:T('소수점이 기준이에요','The decimal point is the anchor','以小数点为准'),carry:T('한 묶음은 자연수 1','One full group makes 1','完整一组就是1'),borrow:T('자연수 1을 분수로','Trade 1 whole for fractions','把整数1换成分数'),split:T('통분을 거꾸로','Common denominators, backwards','把通分倒过来'),chain:T('끝의 두 분수만 남아요','Only the ends remain','只剩两端'),factorial:T('팩토리얼을 펼쳐요','Unfold a factorial','展开阶乘'),'factorial-deep':T('팩토리얼의 약분','Cancel factorials','阶乘约分')};
function html(thread,level,lang='ko'){
 const key=thread+':'+level,m=MODELS[key];if(!m)return '';
 const title=pick(TITLES[m.kind],lang);
 return `<figure class="nm-concept-visual" data-concept-visual="${esc(key)}"><figcaption>${esc(title)}</figcaption><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 164" role="img" aria-label="${esc(title)}" preserveAspectRatio="xMidYMid meet" font-family="sans-serif">${DRAW[m.kind](m,lang)}</svg></figure>`;
}
root.NM_CONCEPT_VISUALS={models:MODELS,html};
if(typeof module!=='undefined'&&module.exports)module.exports=root.NM_CONCEPT_VISUALS;
})(typeof window==='undefined'?globalThis:window);
