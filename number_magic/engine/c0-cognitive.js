/* C0-only presentation/generation contract. Other courses use their exact old generators. */
(function(W){
'use strict';
const T=(ko,en,zh)=>({ko,en,zh}), animals=/병아리|거북이|물고기|나비|토끼|곰|여우|사슴|강아지|고양이/;
function batchim(word){
  const s=String(word),last=s.slice(-1);
  if(/\d/.test(last))return /[013678]/.test(last);
  const c=last.charCodeAt(0);return c>=0xac00&&c<=0xd7a3&&(c-0xac00)%28!==0;
}
const particle=(word,a,b)=>word+(batchim(word)?a:b);
function korean(text){
  return String(text||'')
    .replace(/([가-힣\d]+)(이\(가\)|은\(는\)|을\(를\)|과\(와\))/g,(_,s,p)=>{const pair={'이(가)':['이','가'],'은(는)':['은','는'],'을(를)':['을','를'],'과(와)':['과','와']}[p];return particle(s,...pair);})
    .replace(/(\d+)(은|는|이|가|을|를|와|과)(?=[\s,.!?]|$)/g,(_,n,p)=>particle(n,...(/은|는/.test(p)?['은','는']:/이|가/.test(p)?['이','가']:/을|를/.test(p)?['을','를']:['과','와'])))
    .replace(/(사과|병아리|별|풍선|물고기|나비|꽃|딸기|거북이|쿠키|농구공|축구공)(이|가|은|는|을|를|와|과)(?=\s)/g,(_,w,p)=>particle(w,...(/은|는/.test(p)?['은','는']:/이|가/.test(p)?['이','가']:/을|를/.test(p)?['을','를']:['과','와'])))
    .replace(/(농구공|풍선|꽃|공|별)\s*가(?=\s)/g,'$1이').replace(/(꽃|풍선)\s*를(?=\s)/g,'$1을').replace(/개을/g,'개를')
    .replace(/쓰시오/g,'써 보세요').replace(/고르시오/g,'골라 보세요').replace(/세시오/g,'세어 보세요').replace(/하시오/g,'해 보세요').replace(/보시오/g,'보세요').replace(/넣으시오/g,'넣어 보세요').replace(/그리시오/g,'그려 보세요');
}
function cleanProblem(p){
  if(p.prompt?.ko){
    p.prompt={...p.prompt,ko:korean(p.prompt.ko)};
    if(animals.test(p.prompt.ko))p.prompt.ko=p.prompt.ko.replace(/몇 개/g,'몇 마리').replace(/(\d+)개/g,'$1마리');
  }
  p.orient='h';
  return p;
}
function sequence(profile,rng,thread,level){
  const {R,pick}=W.NM_RNG,max=profile.max,step=profile.block==='A'?1:level===2?pick(rng,[-1,1,2]):1;
  const len=R(rng,2,Math.min(5,Math.floor(max/Math.abs(step))+1)),lo=step<0?Math.abs(step)*(len-1):0,hi=step>0?max-step*(len-1):max;
  const start=R(rng,Math.max(profile.block==='A'?1:0,lo),hi),seq=Array.from({length:len},(_,i)=>start+i*step),blank=R(rng,0,len-1),answer=seq[blank];
  return {widget:'seqFill',seq,blank,answer,answerType:'number',prompt:T(step<0?'거꾸로 세어 빈칸을 채워요.':step===2?'2씩 뛰어 세어 빈칸을 채워요.':'차례로 세어 빈칸을 채워요.',step<0?'Count backwards and fill the blank.':step===2?'Count by twos and fill the blank.':'Count in order and fill the blank.','按顺序数一数，填空。')};
}
function dots(profile,rng){
  const {R,pick}=W.NM_RNG,n=R(rng,5,Math.min(10,profile.max)),pts=[],used=new Set();
  let x=R(rng,0,3),y=R(rng,0,3);pts.push([15+x*23,15+y*23]);used.add(x+','+y);
  while(pts.length<n){const choices=[[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([a,b])=>a>=0&&a<4&&b>=0&&b<4&&!used.has(a+','+b));if(!choices.length)return dots(profile,rng);[x,y]=pick(rng,choices);used.add(x+','+y);pts.push([15+x*23,15+y*23]);}
  return {widget:'dotToDot',pts,close:false,answer:n,answerType:'number',prompt:T('1부터 차례대로 점을 이어요. 어떤 모양일지 상상해 보세요! 점은 모두 몇 개일까요?','Join the dots in order from 1. Imagine the shape! How many dots are there?','从1开始按顺序连点，想象会是什么形状！一共有几个点？')};
}
function shapeCount(profile,rng){
  const {R,pick,shuffle}=W.NM_RNG,all=['shape:circle','shape:square','shape:triangle'],k=R(rng,1,3),used=shuffle(rng,all).slice(0,k),items=[];
  const n=R(rng,k,profile.max);for(let i=0;i<n;i++)items.push({e:i<k?used[i]:pick(rng,used),t:false,x:12+(i%4)*24,y:20+Math.floor(i/4)*30,s:1,r:0});
  return {widget:'g13Count',ask:'kinds',layout:'scatter',items:shuffle(rng,items),choices:[1,2,3],unit:T('가지','','种'),answer:k,answerType:'number',prompt:T('동그라미·세모·네모를 살펴봐요. 서로 다른 모양은 몇 가지인가요?','Look at the circles, triangles and squares. How many kinds of shapes are there?','看看圆形、三角形、正方形，一共有几种不同的形状？'),keyFields:['items','ask']};
}
function valuesInRange(p,max){
  // Encoded answers (several filled boxes/matching permutations) are identifiers,
  // not a large quantity. Check their visible individual values instead.
  const encoded=Array.isArray(p.blanks)||Array.isArray(p.ask)||p.keyFields?.length||/Match|Rep|grid|Grid|Pair|Order|order|sort|Sort|Seat|seat|shapeNum|ShapeNum|puzzle/i.test(p.widget||'');
  if(!encoded&&Number.isFinite(p.answer)&&(p.answer<0||p.answer>max))return false;
  for(const key of ['n','target','whole','input','output','a','b','c'])if(Number.isFinite(p[key])&&(p[key]<0||p[key]>max))return false;
  for(const key of ['seq','left','right','rows','nums','cards','examples','vals','corners','sides','choices','grid','solution','sol','T']){
    const visit=x=>Array.isArray(x)?x.every(visit):typeof x==='number'?x>=0&&x<=max:x&&typeof x==='object'?Object.values(x).every(visit):true;
    if(p[key]!=null&&!visit(p[key]))return false;
  }
  const prompt=(p.prompt?.ko||'').replace(/10칸/g,'');
  if([...prompt.matchAll(/\d+/g)].some(m=>+m[0]>max))return false;
  return true;
}
function generate(thread,level,params,rng,original){
  const profile=params.c0;if(!profile)return original(params,rng);
  if((thread==='NL4'&&level<=2)||(thread==='NL7'&&level<=2))return sequence(profile,rng,thread,level);
  if((thread==='NL12'&&level===1)||(thread==='NL4'&&level===3))return dots(profile,rng);
  if(thread==='NL18'&&level===1)return shapeCount(profile,rng);
  for(let i=0;i<512;i++){
    const p=original(params,rng);
    if(!p||!valuesInRange(p,profile.max))continue;
    // Early number matches use dots/digits/native names, before Sino-Korean names.
    if(profile.block==='A'&&['sino'].includes(p.leftType)||profile.block==='A'&&p.rightType==='sino')continue;
    return cleanProblem(p);
  }
  throw Error('C0 range could not be generated: '+thread+'@'+level+' max '+profile.max);
}
function copy(thread,level){
  const th=W.NM_THREADS?.[thread]||{},lv=th.levels?.find(x=>x.id===level)||{};
  let title=lv.label||th.name,concept=lv.concept||th.concept;
  const generic=T('그림을 보고 물음에 맞게 풀어 보세요.','Look at the picture and answer the question.','看图，按题意完成。');
  let instr=generic;
  if(thread==='AD1'&&level===1){title=T('구슬을 모아 더해요','Join beads and add','合起珠子做加法');concept=T('두 묶음의 구슬을 모두 세어 봐요. +는 더한다는 뜻이고, =는 양쪽의 수가 같다는 뜻이에요.','Count all the beads in the two groups. + means add, and = means both sides have the same value.','数一数两组珠子一共有多少。+表示相加，=表示两边的数值相同。');}
  if(thread==='AD1')instr=T('두 수를 더하면 모두 얼마인지 써 보세요.','Add the two numbers and write the total.','把两个数相加，写出总数。');
  if(thread==='SB1'&&level!==2)instr=T('앞의 수에서 뒤의 수를 빼면 얼마가 남는지 써 보세요.','Subtract the second number from the first and write how many remain.','从前面的数中减去后面的数，写出还剩多少。');
  if(thread==='SB1'&&level===2)instr=T('식의 +와 −를 보고, 더하거나 빼서 빈칸에 써 보세요.','Look at + or −, then add or subtract to fill the blank.','看算式中的+或−，做加法或减法，把答案写在空格里。');
  if(thread==='NL27'&&level===1)concept=T('두 개씩 짝지어 봐요. 남지 않으면 짝수, 한 개가 남으면 홀수예요.','Make pairs. If none are left, the number is even; if one is left, it is odd.','两个两个配对，没有剩下的是偶数，剩下一个的是奇数。');
  if(thread==='NL10')instr=T('물음에 맞는 쪽 접시에 동그라미 해요.','Circle the pan named in the question.','按题目要求圈出相应的盘子。');
  if(thread==='NL7'&&level<3)concept=T('수를 차례로 세어 빈칸에 알맞은 수를 찾아요.','Count in order to find the missing number.','按顺序数，找出空缺的数。');
  if(thread==='NL7'&&level===3)instr=T('숫자와 같은 개수의 점 그림을 이어요.','Match each numeral to the same number of dots.','把数字与相同数量的点图连起来。');
  if(thread==='NL12'&&level===1){title=T('점 잇기','Join the dots','连点');concept=T('1부터 차례로 점을 이어 봐요. 점을 하나씩 세어 모두 몇 개인지 알아봐요.','Connect the dots from 1, then count them all.','从1开始连点，再数出点的总数。');}
  if(thread==='NL18'&&level===1){title=T('평면 모양의 종류 세기','Kinds of flat shapes','数平面图形的种类');concept=T('동그라미·세모·네모는 서로 다른 모양이에요. 같은 모양끼리 모아 몇 가지인지 세어요.','Circles, triangles and squares are different shapes. Group matching shapes and count the kinds.','圆形、三角形和正方形不同。把同类图形放一起，数数有几类。');}
  return {title,instr,concept};
}
W.NM_C0={generate,copy,korean,particle,batchim,valuesInRange};
})(window);
