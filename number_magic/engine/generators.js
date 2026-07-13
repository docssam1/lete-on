/* ============================================================
   Numbers of Magic — 연산 Generator 엔진 (A권)
   초급 A 교재 실제 개념 기반.
   각 generator(opts) → 문제 객체. opts.level로 수 범위 조절
   (practice=작은 수 축소판 / main=교재 수준).
   수식은 LaTeX 문자열(tex)로 반환 → KaTeX 렌더.
   ============================================================ */
(function(){
'use strict';

const R = (a,b)=>Math.floor(Math.random()*(b-a+1))+a;      // a~b 정수
const pick = arr=>arr[Math.floor(Math.random()*arr.length)];
const shuffle = a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};

/* ---------- A-01 : 더해서 10이 되는 수를 찾아라 ----------
   개념: 여러 수 중 합이 10인 짝을 찾아 먼저 묶는다.
   교재처럼 "짝 + 남는 수"가 섞여 답이 다양해야 한다.
   3+6+7+4=20 / 1+5+8+5=19 (남는 수 때문에 20이 아님)
   level: 'practice' = 10의 짝 즉답(한 짝) / 'main' = 여러 항 묶기 */
function pair10(opts){
  opts=opts||{};
  const lv = opts.level||'main';
  if(lv==='practice'){
    // 누미가 한 수를 부르면 10의 짝꿍을 답한다
    const a = opts.fixed!=null ? opts.fixed : R(1,9);
    return {
      gen:'pair10', mode:'practice',
      ask:a, answer:10-a,
      prompt:{ ko:`내가 ${a} 하면, 짝꿍은?`, en:`I say ${a} — what's its partner?`, zh:`我说${a}，配对是几？` },
      tex:`${a} + \\square = 10`,
      answerType:'number'   // 숫자패드
    };
  }
  // main: 10의 짝 1~2개 + 짝이 안 되는 "남는 수" 1~2개 → 답 다양(교재식)
  const pairCount = opts.pairs || R(1,2);
  let orphan = opts.orphans!=null?opts.orphans:R(1,2);
  let nums=[];
  for(let i=0;i<pairCount;i++){const a=R(1,9);nums.push(a,10-a);}
  // 남는 수: 이미 있는 수와 10을 만들지 않도록 골라 넣음 → 의도한 짝만 존재
  let tries=0;
  while(orphan>0 && tries<80){
    tries++;
    const o=R(1,9);
    if(!nums.includes(10-o)){ nums.push(o); orphan--; }
  }
  nums=shuffle(nums);
  const sum=nums.reduce((s,n)=>s+n,0);
  return {
    gen:'pair10', mode:'main',
    nums, sum, pairCount,
    prompt:{ ko:'짝꿍이 되는 두 수(합이 10)를 골라 묶어요', en:'Pick two numbers that pair up to make 10', zh:'选出凑成10的两个数' },
    tex:nums.join(' + '),
    answerType:'selectPairs', target:10, answer:sum
  };
}

/* ---------- A-02 : 수를 이사시켜요 ----------
   개념: 두 수 덧셈에서 큰 수를 10으로 만들기 위해
        다른 수에서 부족분을 "이사"시킨다.
   8+7 → 8+(2+5) → 10+5 = 15
   level: practice = 한 자리 가르기(10까지 부족분) / main = 받아올림 두 수 덧셈 */
function move10(opts){
  opts=opts||{};
  const lv=opts.level||'main';
  if(lv==='practice'){
    // "몇을 더하면 10이 될까?" (부족분 즉답) — 또는 가르기
    const a=opts.fixed!=null?opts.fixed:R(2,9);
    return {
      gen:'move10', mode:'practice',
      ask:a, answer:10-a,
      prompt:{ ko:`${a}는 10이 되려면 얼마가 더 필요해?`, en:`How much more does ${a} need to make 10?`, zh:`${a}要变成10还差多少？` },
      tex:`${a} + \\square = 10`,
      answerType:'number'
    };
  }
  // main: a+b, 받아올림 있는 한 자리 두 수 (a>=b, 합>10 되게)
  let a,b;
  do{ a=R(5,9); b=R(2,9); }while(a+b<=10||a+b>18);
  const need=10-a;            // a를 10으로 만들 부족분
  const rest=b-need;          // b에서 need 이사 후 남는 수
  const ans=a+b;
  return {
    gen:'move10', mode:'main',
    a,b, need, rest, answer:ans,
    prompt:{ ko:`${b}에서 ${need}을 이사보내 ${a}를 10으로 만들어요`, en:`Move ${need} from ${b} to make ${a} into 10`, zh:`从${b}里搬${need}过去，把${a}凑成10` },
    tex:`${a} + ${b} = \\square`,
    widget:'steps',
    steps:[
      {tex:`${a} + ${need} = \\square`, blank:10},
      {tex:`10 + ${rest} = \\square`, blank:ans}
    ],
    answerType:'number'
  };
}

/* ---------- A-03 : 우선 10을 더하기 ----------
   개념: 9,8,7 등을 더할 때 우선 10을 더하고, 더 준 만큼 뺀다.
   25+9 = 25+10-1 = 35-1 = 34   (9는 10보다 1 작음)
   level: practice = 10의 보수(9→1,8→2,7→3) 즉답 / main = (두자리)+(7~9) */
function add10sub(opts){
  opts=opts||{};
  const lv=opts.level||'main';
  if(lv==='practice'){
    // "9는 10보다 얼마 작아?" (보수)
    const a=opts.fixed!=null?opts.fixed:pick([9,8,7,6]);
    return {
      gen:'add10sub', mode:'practice',
      ask:a, answer:10-a,
      prompt:{ ko:`${a}는 10보다 얼마 작을까?`, en:`How much smaller than 10 is ${a}?`, zh:`${a}比10小多少？` },
      tex:`10 - ${a} = \\square`,
      answerType:'number'
    };
  }
  // main: (두자리 no-carry가 되도록 일의자리 작게) + (7~9)
  const tens=R(2,8);
  const ones=R(1,4);                 // 10 더해도 자리 안 헷갈리게
  const base=tens*10+ones;
  const add=pick([9,8,7]);
  const diff=10-add;                 // 더 준 만큼 뺄 값
  const ans=base+add;
  return {
    gen:'add10sub', mode:'main',
    base, add, diff, answer:ans,
    prompt:{ ko:`${add} 대신 10을 더하고, 더 준 ${diff}을 빼요`, en:`Add 10 instead of ${add}, then subtract the extra ${diff}`, zh:`不加${add}，先加10，再减去多给的${diff}` },
    tex:`${base} + ${add} = \\square`,
    widget:'steps',
    steps:[
      {tex:`${base} + 10 = \\square`, blank:base+10},
      {tex:`${base+10} - ${diff} = \\square`, blank:ans}
    ],
    answerType:'number'
  };
}

/* ---------- A-04 : 계단식 덧셈 ----------
   개념: 두 자리 수를 십/일로 쪼개, 십의 자리 먼저 더하고 일의 자리 더하기.
   24+13 → 24 +10 +3 → 34 → 37    (13=10+3)
   level: practice = 두자리 가르기(24=20+4) / main = 두 자리 여러 수 계단 누적 */
function stairAdd(opts){
  opts=opts||{};
  const lv=opts.level||'main';
  if(lv==='practice'){
    // "24는 20 하고 얼마?" (십/일 가르기)
    const t=R(2,9), o=R(1,9);
    const n=t*10+o;
    return {
      gen:'stairAdd', mode:'practice',
      ask:n, tens:t*10, ones:o, answer:o,
      prompt:{ ko:`${n}은 ${t*10} 하고 얼마?`, en:`${n} is ${t*10} and how much more?`, zh:`${n}是${t*10}加多少？` },
      tex:`${n} = ${t*10} + \\square`,
      answerType:'number'
    };
  }
  // main: 두 자리 수 count개 계단식
  const count=opts.count||R(2,3);
  const nums=[];
  for(let i=0;i<count;i++)nums.push(R(11,79));
  // 계단 누적: 각 다음 수를 십의 자리 먼저, 일의 자리 나중에 더하는 단계로
  let acc=nums[0];
  const fillSteps=[];
  for(let i=1;i<count;i++){
    const t=Math.floor(nums[i]/10)*10, o=nums[i]%10;
    fillSteps.push({tex:`${acc} + ${t} = \\square`, blank:acc+t}); acc+=t;
    fillSteps.push({tex:`${acc} + ${o} = \\square`, blank:acc+o}); acc+=o;
  }
  const ans=nums.reduce((s,n)=>s+n,0);
  return {
    gen:'stairAdd', mode:'main',
    nums, answer:ans,
    prompt:{ ko:'십의 자리 먼저, 일의 자리 나중에 계단처럼 더해요', en:'Add the tens first, then the ones — like climbing stairs', zh:'先加十位，再加个位——像爬楼梯一样' },
    tex:`${nums.join(' + ')} = \\square`,
    widget:'steps',
    steps:fillSteps,
    answerType:'number'
  };
}

/* ---------- A-02 프랙티스 워밍업: 수 가르기 ----------
   개념: move10의 "이사시키기"에 들어가기 전, 더 기본적인 전제부터
   —  한 수는 여러 가지 방식으로 두 부분으로 나뉠 수 있다 (7=1+6=2+5=3+4).
   10 만들기와 무관한 순수 분해 연습. level 구분 없이 항상 이 형태. */
function splitNum(opts){
  opts=opts||{};
  const n=opts.fixed!=null?opts.fixed:R(4,9);
  const p=R(1,n-1);
  const rest=n-p;
  return {
    gen:'splitNum', mode:opts.level||'main',
    n,p,rest, answer:rest,
    prompt:{ ko:`${n}을 가르면, ${p}이랑 얼마?`, en:`Split ${n} — ${p} and how much more?`, zh:`把${n}拆开，${p}和多少？` },
    tex:`${n} = ${p} + \\square`,
    answerType:'number'
  };
}

/* ---------- A-05 : 100의 보수 찾기 ----------
   개념: 더해서 100이 되는 짝을 찾아 먼저 묶는다.
   초급 B 챕터1 실제 내용. 35+65=100, 23+77=100
   level: practice = 100의 짝 즉답 / main = 4수 묶기 */
function comp100(opts){
  opts=opts||{};
  const lv=opts.level||'main';
  if(lv==='practice'){
    const choices=[10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90];
    const a=pick(choices);
    return {
      gen:'comp100', mode:'practice',
      ask:a, answer:100-a,
      prompt:{ko:`${a} + ? = 100`,en:`${a} + ? = 100`,zh:`${a} + ? = 100`},
      tex:`${a} + \\square = 100`,
      answerType:'number'
    };
  }
  // main: 4 numbers forming 2 pairs that each sum to 100
  const o1=R(1,9), t1=R(1,8); const a1=t1*10+o1; const b1=100-a1;
  const o2=R(1,9), t2=R(1,8); const a2=t2*10+o2; const b2=100-a2;
  const nums=shuffle([a1,b1,a2,b2]);
  const sum=nums.reduce((s,n)=>s+n,0);
  return {
    gen:'comp100', mode:'main', nums, sum, pairCount:2,
    prompt:{ko:'더해서 100이 되는 짝을 골라 묶어요',en:'Pick two numbers that pair up to make 100',zh:'选出凑成100的两个数'},
    tex:nums.join(' + '),
    answerType:'selectPairs', target:100, answer:sum
  };
}

/* ---------- A-06 : 더해서 10이 되는 수를 찾아라 2 ----------
   개념: 두 자리 수 덧셈에서 일의 자리끼리 합이 10이 되는 짝을 먼저.
   초급 B 챕터2 실제 내용. 13+86+67+24=190 → 일의자리 3+7=10, 6+4=10
   level: practice = 일의자리 짝꿍 즉답 / main = 4수 묶기(두자리) */
function pair10_2d(opts){
  opts=opts||{};
  const lv=opts.level||'main';
  if(lv==='practice'){
    const a=R(1,9);
    return {
      gen:'pair10_2d', mode:'practice',
      ask:a, answer:10-a,
      prompt:{ko:`일의 자리가 ${a}이면, 짝꿍 일의 자리는?`,en:`Ones is ${a} — what ones digit makes 10?`,zh:`个位是${a}，配对的个位是？`},
      tex:`${a} + \\square = 10`,
      answerType:'number'
    };
  }
  // main: 4 two-digit nums, 2 pairs with ones summing to 10
  const o1=R(1,9); const o2=10-o1;
  const o3=R(1,9); const o4=10-o3;
  const nums=shuffle([R(1,8)*10+o1, R(1,8)*10+o2, R(1,8)*10+o3, R(1,8)*10+o4]);
  const sum=nums.reduce((s,n)=>s+n,0);
  return {
    gen:'pair10_2d', mode:'main', nums, sum, pairCount:2,
    prompt:{ko:'일의 자리가 10이 되는 짝을 먼저 더해요',en:'Pair ones that make 10, add them first',zh:'个位凑成10的先相加'},
    tex:nums.join(' + '),
    answerType:'number', answer:sum
  };
}

/* ---------- A-07 : 끼리끼리 더해요 ----------
   개념: 십의 자리끼리, 일의 자리끼리 따로 더한 후 합산.
   초급 B 챕터3 실제 내용. 73+62+50+41 → 220+6 = 226
   level: practice = 두자리 십/일 가르기 / main = 3~4수 끼리끼리 */
function splitPlace(opts){
  opts=opts||{};
  const lv=opts.level||'main';
  if(lv==='practice'){
    const t=R(2,9), o=R(1,9), n=t*10+o;
    return {
      gen:'splitPlace', mode:'practice',
      ask:n, answer:t*10,
      prompt:{ko:`${n}에서 십의 자리 부분은?`,en:`What is the tens part of ${n}?`,zh:`${n}的十位部分是？`},
      tex:`${n} = \\square + ${o}`,
      answerType:'number'
    };
  }
  const count=opts.count||R(3,4);
  const nums=[];
  for(let i=0;i<count;i++) nums.push(R(21,87));
  const tensSum=nums.reduce((s,n)=>s+Math.floor(n/10)*10,0);
  const onesSum=nums.reduce((s,n)=>s+n%10,0);
  const total=tensSum+onesSum;
  return {
    gen:'splitPlace', mode:'main', nums, tensSum, onesSum, answer:total,
    prompt:{ko:'십의 자리끼리, 일의 자리끼리 따로 더해요',en:'Add tens together and ones together, then combine',zh:'十位加十位，个位加个位，再相加'},
    tex:`${nums.join(' + ')} = ${total}`,
    steps:[nums.join(' + '), `${tensSum} + ${onesSum}`, `${total}`],
    answerType:'number'
  };
}

/* ---------- A-08 : 수를 이사시켜요 2 (두 자리) ----------
   개념: 두 자리 덧셈에서 몇 십이 되도록 한 수에서 다른 수로 이사.
   초급 B 챕터4 실제 내용. 39+25 → 40+24 = 64
   level: practice = "다음 몇 십까지 얼마?" 즉답 / main = 두자리 이사 덧셈 */
function move10_2d(opts){
  opts=opts||{};
  const lv=opts.level||'main';
  if(lv==='practice'){
    const a=R(21,98);
    const need=a%10===0?0:(10-a%10);
    const target=need===0?a+10:a+need;
    return {
      gen:'move10_2d', mode:'practice',
      ask:a, answer:need||10,
      prompt:{ko:`${a}는 다음 몇 십이 되려면 얼마 더?`,en:`How much more does ${a} need to reach the next ten?`,zh:`${a}再加多少能到下一个整十？`},
      tex:`${a} + \\square = ${target}`,
      answerType:'number'
    };
  }
  const ones=pick([8,9]); const tens=R(2,8); const a=tens*10+ones;
  const need=10-ones;
  const b=R(need+2, 55);
  const rest=b-need;
  const nextTen=a+need;
  const ans=nextTen+rest;
  return {
    gen:'move10_2d', mode:'main',
    a,b,need,rest,nextTen, answer:ans,
    prompt:{ko:`${b}에서 ${need}을 이사보내 ${a}를 ${nextTen}으로 만들어요`,en:`Move ${need} from ${b} to round ${a} up to ${nextTen}`,zh:`从${b}里搬${need}过去，把${a}凑成${nextTen}`},
    tex:`${a}+${b} = ${a}+${need}+${rest} = ${nextTen}+${rest} = ${ans}`,
    steps:[`${a}+${b}`,`${nextTen}+${rest}`,`${ans}`],
    answerType:'number'
  };
}

/* ---------- A-09 : 새치기 덧셈 ----------
   개념: 덧셈의 교환법칙 — 더하기 쉬운 짝을 먼저 골라 새치기.
   초급 C 챕터1 실제 내용. 37+19+24+33 → (37+33)+(19+24)
   level: practice = 10의 짝꿍 즉답(교환법칙 예열) / main = 4수 새치기 */
function jumpAdd(opts){
  opts=opts||{};
  const lv=opts.level||'main';
  if(lv==='practice'){
    const a=R(1,9);
    return {
      gen:'jumpAdd', mode:'practice',
      ask:a, answer:10-a,
      prompt:{ko:`${a}와 합이 10이 되는 새치기 짝은?`,en:`Which number jumps the queue to make 10 with ${a}?`,zh:`哪个数和${a}凑成10可以"插队"？`},
      tex:`${a} + \\square = 10`,
      answerType:'number'
    };
  }
  // 4 numbers: one pair of ones that sum to 10, plus 2 other numbers
  const o1=R(1,9); const o2=10-o1;
  const a1=R(1,8)*10+o1, a2=R(2,8)*10+o2;
  const b1=R(11,79), b2=R(11,79);
  const nums=shuffle([a1,a2,b1,b2]);
  const sum=nums.reduce((s,n)=>s+n,0);
  return {
    gen:'jumpAdd', mode:'main', nums, sum,
    prompt:{ko:'더하기 쉬운 짝을 찾아 먼저 새치기해요',en:'Find easy pairs and let them jump the queue',zh:'找出好算的配对，让它们先"插队"'},
    tex:nums.join(' + '),
    answerType:'number', answer:sum
  };
}

/* ---------- A-10 : 단위별 따로따로 빼기 ----------
   개념: 두 자리(이상) 수 빼기에서 십의 자리를 먼저 빼고, 일의 자리를 뺀다.
   초급 C 챕터2 실제 내용. 80-47 → 80-40=40, 40-7=33
   level: practice = 몇십 빼기 즉답 / main = 십의자리→일의자리 순서 빼기 */
function subByPlace(opts){
  opts=opts||{};
  const lv=opts.level||'main';
  if(lv==='practice'){
    const tens=R(2,9), a=tens*10+R(1,9);
    const subTens=R(1,tens-1)*10;
    return {
      gen:'subByPlace', mode:'practice',
      ask:a, answer:a-subTens,
      prompt:{ko:`${a}에서 ${subTens}을 먼저 빼면?`,en:`First subtract ${subTens} from ${a} — what do you get?`,zh:`${a}先减${subTens}，得多少？`},
      tex:`${a} - ${subTens} = \\square`,
      answerType:'number'
    };
  }
  const big = (opts.level2||opts.range)==='big';
  const tensA=R(3,9), onesA=R(0,9), a=tensA*10+onesA;
  const tensB=R(1,tensA-1), onesB=R(1,9), b=tensB*10+onesB;
  const step1=a-tensB*10, ans=step1-onesB;
  return {
    gen:'subByPlace', mode:'main', a, b, step1, answer:ans,
    prompt:{ko:'십의 자리를 먼저 빼고, 일의 자리를 나중에 빼요',en:'Subtract the tens first, then the ones',zh:'先减十位，再减个位'},
    tex:`${a} - ${b} = \\square`,
    widget:'steps',
    steps:[
      {tex:`${a} - ${tensB*10} = \\square`, blank:step1},
      {tex:`${step1} - ${onesB} = \\square`, blank:ans}
    ],
    answerType:'number'
  };
}

/* ---------- A-11 : 쉬었다 빼기 ----------
   개념: 몇 십이 되도록 필요한 만큼만 먼저 빼고, 쉬었다가 남은 만큼 마저 뺀다.
   초급 C 챕터3 실제 내용. 43-8 → 43-3-5 = 40-5 = 35
   level: practice = 다음 몇 십까지 얼마 빼야하는지 즉답 / main = 쉬었다 빼기 전체 */
function restSubtract(opts){
  opts=opts||{};
  const lv=opts.level||'main';
  if(lv==='practice'){
    const a=R(21,98);
    const x=a%10; // 다음 몇십 아래로 가려면 뺄 양
    const target=a-x;
    return {
      gen:'restSubtract', mode:'practice',
      ask:a, answer:x,
      prompt:{ko:`${a}에서 얼마를 빼야 ${target}이 될까?`,en:`How much to subtract from ${a} to reach ${target}?`,zh:`${a}要减多少才能变成${target}？`},
      tex:`${a} - \\square = ${target}`,
      answerType:'number'
    };
  }
  const tens=R(2,9), ones=R(1,9), a=tens*10+ones;
  const x=ones;                 // 첫 걸음: 몇십으로 만들기 위해 빼는 양
  const bExtra=R(x+1,x+9);      // b는 x보다 커야 함(그래야 나머지가 남음)
  const b=bExtra;
  const y=b-x;
  const target=a-x;
  const ans=target-y;
  return {
    gen:'restSubtract', mode:'main', a, b, x, y, target, answer:ans,
    prompt:{ko:'몇 십이 되도록 먼저 빼고, 쉬었다가 나머지를 빼요',en:'Subtract just enough to reach a ten, then subtract the rest',zh:'先减到整十，歇一下再减剩下的'},
    tex:`${a} - ${b} = \\square`,
    widget:'steps',
    steps:[
      {tex:`${a} - ${x} = \\square`, blank:target},
      {tex:`${target} - ${y} = \\square`, blank:ans}
    ],
    answerType:'number'
  };
}

/* ---------- A-12 : 덧셈, 뺄셈 끼리끼리 1 ----------
   개념: 더하는 수끼리, 빼는 수끼리 각각 묶어 더한 뒤, (덧셈의 합)-(뺄셈의 합)으로 계산.
   초급 C 챕터4 실제 내용. 35-14+21-22 → (35+21)-(14+22) = 56-36 = 20
   level: practice = 두 수 더하기 즉답(묶기 준비) / main = 4수 덧뺄 끼리끼리 */
function addSubGroup(opts){
  opts=opts||{};
  const lv=opts.level||'main';
  if(lv==='practice'){
    const a=R(10,60), b=R(10,60);
    return {
      gen:'addSubGroup', mode:'practice',
      ask:[a,b], answer:a+b,
      prompt:{ko:`더하는 수끼리 먼저 더해요: ${a} + ${b} = ?`,en:`Add the plus-terms first: ${a} + ${b} = ?`,zh:`先把加数加起来：${a} + ${b} = ?`},
      tex:`${a} + ${b} = \\square`,
      answerType:'number'
    };
  }
  // a - b + c - d = (a+c) - (b+d), 양수 결과 보장
  const b=R(10,40), d=R(10,40);
  const a=R(b+5,b+50), c=R(d+5,d+50);
  const plusSum=a+c, minusSum=b+d, ans=plusSum-minusSum;
  return {
    gen:'addSubGroup', mode:'main', nums:[a,b,c,d], plusSum, minusSum, answer:ans,
    prompt:{ko:'더하는 수끼리, 빼는 수끼리 묶어서 계산해요',en:'Group the plus-terms and minus-terms separately',zh:'把加数和减数分别圈起来计算'},
    tex:`${a} - ${b} + ${c} - ${d} = \\square`,
    widget:'steps',
    steps:[
      {tex:`${a} + ${c} = \\square`, blank:plusSum},
      {tex:`${b} + ${d} = \\square`, blank:minusSum},
      {tex:`${plusSum} - ${minusSum} = \\square`, blank:ans}
    ],
    answerType:'number'
  };
}

/* ---------- A-13 : 백으로 쪼개서 빼기 ----------
   개념: 몇 백 - 두 자리 수. 100 하나를 따로 떼어 빼고, 남은 걸 더한다.
   초급 D 챕터1 실제 내용. 400-35 → 300+100-35 = 300+65 = 365
   level: practice = 몇백에서 100 떼어내기 즉답 / main = 전체 계산 */
function splitHundred(opts){
  opts=opts||{};
  const lv=opts.level||'main';
  if(lv==='practice'){
    const hund=R(2,9)*100;
    return {
      gen:'splitHundred', mode:'practice',
      ask:hund, answer:hund-100,
      prompt:{ko:`${hund}에서 100을 떼어내면?`,en:`Set aside 100 from ${hund} — what's left?`,zh:`从${hund}里拿出100，还剩多少？`},
      tex:`${hund} - 100 = \\square`,
      answerType:'number'
    };
  }
  const a=R(2,9)*100, b=R(11,99);
  const rest=a-100, comp=100-b, ans=rest+comp;
  return {
    gen:'splitHundred', mode:'main', a, b, rest, comp, answer:ans,
    prompt:{ko:'100 하나를 떼어 빼고, 남은 걸 더해요',en:'Set aside one hundred to subtract, then add the rest',zh:'拿出一个100来减，再加上剩下的'},
    tex:`${a} - ${b} = \\square`,
    widget:'steps',
    steps:[
      {tex:`100 - ${b} = \\square`, blank:comp},
      {tex:`${rest} + ${comp} = \\square`, blank:ans}
    ],
    answerType:'number'
  };
}

/* ---------- A-14 : 자릿수 이동 뺄셈 ----------
   개념: 세 자리 - 두 자리. 100 하나를 앞에서 이동시켜 계산한다.
   초급 D 챕터2 실제 내용. 123-85 → 23+100-85 = 23+15 = 38
   level: practice = 세 자리 수를 100과 나머지로 나누기 즉답 / main = 전체 계산 */
function digitShiftSub(opts){
  opts=opts||{};
  const lv=opts.level||'main';
  if(lv==='practice'){
    const rest=R(10,99), a=100+rest;
    return {
      gen:'digitShiftSub', mode:'practice',
      ask:a, answer:rest,
      prompt:{ko:`${a}를 100과 무엇으로 나눌 수 있나요?`,en:`Split ${a} into 100 and what?`,zh:`把${a}分成100和什么？`},
      tex:`${a} = 100 + \\square`,
      answerType:'number'
    };
  }
  const rest=R(10,99), a=R(1,8)*100+100+rest, b=R(11,99);
  const before=a-100, comp=100-b, ans=before+comp;
  return {
    gen:'digitShiftSub', mode:'main', a, b, before, comp, answer:ans,
    prompt:{ko:'100을 하나 이동시켜 남은 수끼리 먼저 빼요',en:'Move one hundred over, subtract from it first',zh:'挪一个100过去，先减它'},
    tex:`${a} - ${b} = \\square`,
    widget:'steps',
    steps:[
      {tex:`100 - ${b} = \\square`, blank:comp},
      {tex:`${before} + ${comp} = \\square`, blank:ans}
    ],
    answerType:'number'
  };
}

/* ---------- A-15 : 수를 풀어서 쓰기 ----------
   개념: 두 수를 모두 가까운 몇십으로 올림해 쓰고, 더 올린 만큼 보정한다.
   초급 D 챕터3 실제 내용. 87-59 = 90-3-60+1 = 30-3+1 = 28
   level: practice = 다음 몇십까지 얼마나 모자란지 즉답 / main = 전체 계산 */
function expandRewrite(opts){
  opts=opts||{};
  const lv=opts.level||'main';
  if(lv==='practice'){
    const a=R(21,98);
    const up=Math.ceil(a/10)*10;
    const d=up-a;
    if(d===0) return expandRewrite(opts);
    return {
      gen:'expandRewrite', mode:'practice',
      ask:a, answer:d,
      prompt:{ko:`${a}는 다음 몇십(${up})보다 얼마나 작을까?`,en:`How much less is ${a} than the next ten (${up})?`,zh:`${a}比下一个整十(${up})小多少？`},
      tex:`${up} - \\square = ${a}`,
      answerType:'number'
    };
  }
  let a,b,upA,upB,da,db;
  do{
    a=R(22,98); b=R(21,a-1);
    upA=Math.ceil(a/10)*10; da=upA-a;
    upB=Math.ceil(b/10)*10; db=upB-b;
  } while(da===0||db===0);
  const ans=(upA-upB)-da+db;
  return {
    gen:'expandRewrite', mode:'main', a, b, upA, upB, da, db, answer:ans,
    prompt:{ko:'두 수를 모두 몇십으로 올려 쓰고, 올린 만큼 보정해요',en:'Round both numbers up to a ten, then adjust',zh:'把两个数都凑成整十，再修正'},
    tex:`${a} - ${b} = \\square`,
    widget:'steps',
    steps:[
      {tex:`${upA} - ${upB} = \\square`, blank:upA-upB},
      {tex:`${upA-upB} - ${da} + ${db} = \\square`, blank:ans}
    ],
    answerType:'number'
  };
}

/* ---------- A-16 : 끊어서 더하기 1 ----------
   개념: 자리마다(일/십/백/천) 따로 더한 뒤, 그 부분합을 마지막에 다 더한다.
   초급 D 챕터4 실제 내용. 2347+9268 → 7+8, 40+60, 300+200, 2000+9000을 각각 더해 합산
   level: practice = 자릿값 부분 더하기 즉답 / main = 세 자리 수 끊어서 더하기 */
function splitAddByDigit(opts){
  opts=opts||{};
  const lv=opts.level||'main';
  if(lv==='practice'){
    const t1=R(1,9), t2=R(1,9);
    return {
      gen:'splitAddByDigit', mode:'practice',
      ask:[t1*10,t2*10], answer:t1*10+t2*10,
      prompt:{ko:`십의 자리끼리 먼저 더해요: ${t1*10} + ${t2*10} = ?`,en:`Add the tens places first: ${t1*10} + ${t2*10} = ?`,zh:`先加十位：${t1*10} + ${t2*10} = ?`},
      tex:`${t1*10} + ${t2*10} = \\square`,
      answerType:'number'
    };
  }
  const h1=R(1,9),t1=R(0,9),o1=R(1,9), a=h1*100+t1*10+o1;
  const h2=R(1,9),t2=R(0,9),o2=R(1,9), b=h2*100+t2*10+o2;
  const hSum=(h1+h2)*100, tSum=(t1+t2)*10, oSum=o1+o2;
  const ans=hSum+tSum+oSum;
  return {
    gen:'splitAddByDigit', mode:'main', a, b, hSum, tSum, oSum, answer:ans,
    prompt:{ko:'자리마다 따로 더한 뒤, 마지막에 다 더해요',en:'Add each place separately, then sum the partial totals',zh:'每一位分别相加，最后再全部加起来'},
    tex:`${a} + ${b} = \\square`,
    widget:'steps',
    steps:[
      {tex:`${hSum} + ${tSum} = \\square`, blank:hSum+tSum},
      {tex:`${hSum+tSum} + ${oSum} = \\square`, blank:ans}
    ],
    answerType:'number'
  };
}

window.NM_GEN = { pair10, move10, add10sub, stairAdd, splitNum, comp100, pair10_2d, splitPlace, move10_2d, jumpAdd, subByPlace, restSubtract, addSubGroup, splitHundred, digitShiftSub, expandRewrite, splitAddByDigit, _util:{R,pick,shuffle} };

/* CommonJS(테스트용) */
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_GEN;
})();
