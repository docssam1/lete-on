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
    tex:`${a} + ${b} = ${a} + ${need} + ${rest} = 10 + ${rest} = ${ans}`,
    steps:[`${a} + ${b}`,`${a} + ${need} + ${rest}`,`10 + ${rest}`,`${ans}`],
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
    tex:`${base} + ${add} = ${base} + 10 - ${diff} = ${base+10} - ${diff} = ${ans}`,
    steps:[`${base} + ${add}`,`${base} + 10 - ${diff}`,`${base+10} - ${diff}`,`${ans}`],
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
  // 계단 누적 스텝 생성 (첫 수 기준, 이후 각 수를 십→일로)
  let acc=nums[0];
  const stair=[`${nums[0]}`];
  const parts=[`${nums[0]}`];
  for(let i=1;i<count;i++){
    const t=Math.floor(nums[i]/10)*10, o=nums[i]%10;
    parts.push(`${t} + ${o}`);
    acc+=t; stair.push(`${acc}`);
    acc+=o; stair.push(`${acc}`);
  }
  const ans=nums.reduce((s,n)=>s+n,0);
  return {
    gen:'stairAdd', mode:'main',
    nums, answer:ans, stair,
    prompt:{ ko:'십의 자리 먼저, 일의 자리 나중에 계단처럼 더해요', en:'Add the tens first, then the ones — like climbing stairs', zh:'先加十位，再加个位——像爬楼梯一样' },
    tex:`${nums.join(' + ')} = ${parts.join(' + ')} = ${ans}`,
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

window.NM_GEN = { pair10, move10, add10sub, stairAdd, splitNum, _util:{R,pick,shuffle} };

/* CommonJS(테스트용) */
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_GEN;
})();
