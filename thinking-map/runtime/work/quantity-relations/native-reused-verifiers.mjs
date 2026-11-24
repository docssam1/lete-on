const number=v=>Number(String(v).match(/-?\d+/)?.[0]);
const numbers=t=>[...String(t).matchAll(/\d+/g)].map(m=>Number(m[0]));
const nums=s=>[...String(s).matchAll(/-?\d+/g)].map(m=>Number(m[0]));
const sum=xs=>xs.reduce((a,b)=>a+b,0);
export function solveQuantity(id, p, difficulty) {
  const n = numbers(p.prompt);
  const v = p.visual || {};
  const solutions = [];
  let explanation;
  if (id === 'equalize-transfer' || id === 'equalize-transfer-b8') {
    let a, b;
    if (id === 'equalize-transfer') { a = v.higher; b = v.lower; }
    else if (difficulty === 3) { a = n[1]; b = n[0] - a; }
    else { a = v.bars[0].value; b = v.bars[1].value; }
    for (let moved = 0; moved <= a; moved++) if (a - moved === b + moved) solutions.push(moved);
    explanation = `처음 차는 ${a}−${b}=${a-b}개입니다. 한 개를 옮길 때 차는 두 개 줄어듭니다. ${a-b}÷2=${solutions[0]}개를 옮기면 두 양이 같습니다.`;
  } else if (id === 'reverse-transfer-total') {
    for (let a = 1; a <= 300; a++) for (let b = 1; b <= 150; b++) {
      const afterA = a-b, afterB = 2*b;
      const given = difficulty === 1 ? b === n[0] : difficulty === 2 ? afterA === n[0] : a+b === n[0];
      if (given && afterA === afterB) solutions.push(a);
    }
    const before = solutions[0] / 3;
    explanation = `받은 사람은 처음 가진 ${before}개만큼 더 받아 ${before*2}개가 됩니다. 준 사람도 마지막에 ${before*2}개이므로, 처음에는 ${before*2}+${before}=${solutions[0]}개였습니다.`;
  } else if (['total-difference','total-difference-candy','total-difference-bars-b8','table-total-difference-b8'].includes(id)) {
    let total, difference, targetLarge = true, moved = 0, remaining, known = 0;
    if (id === 'table-total-difference-b8') {
      known = Number(v.rows[0][2]); total = Number(v.rows[0][3]) - known; difference = numbers(v.notes[0])[0];
    } else {
      total = n[0]; difference = n[1];
      if (id === 'total-difference-bars-b8') targetLarge = p.prompt.includes('큰 수를');
      if (id === 'total-difference-candy' && difficulty === 3) { moved = n[1]; remaining = n[2]; difference = remaining + 2*moved; }
    }
    for (let small = 1; small < total; small++) {
      const large = total-small;
      if (large >= small && large-small === difference) solutions.push(targetLarge ? large : small);
    }
    const small = (total-difference)/2;
    explanation = `${known ? `두 빈칸의 합은 ${Number(v.rows[0][3])}−${known}=${total}입니다. ` : ''}${moved ? `${moved}개를 주면 차는 ${moved*2}개 줄어드므로 처음 차는 ${remaining}+${moved*2}=${difference}개입니다. ` : ''}합에서 차를 빼면 작은 수 두 개가 남습니다. (${total}−${difference})÷2=${small}이고 ${targetLarge ? `큰 수는 ${small}+${difference}=${small+difference}` : `작은 수는 ${small}`}입니다.`;
  } else if (id === 'chained-equalize-transfer-b8') {
    const first = numbers(v.steps[0])[0], second = numbers(v.steps[1])[0];
    const a = Number(v.people[0].value), c = Number(v.people[2].value), final = v.final;
    for (let b = 1; b <= 300; b++) if (a-first === final && b+first-second === final && c+second === final) solutions.push(b);
    explanation = `나는 마지막에 ${final}개입니다. 마지막에 준 ${second}개를 더하고, 앞서 받은 ${first}개를 빼면 ${final}+${second}−${first}=${solutions[0]}개입니다.`;
  } else if (id === 'reverse-transfer-three-b8') {
    const first = numbers(v.steps[0])[0], second = numbers(v.steps[1])[0], final = Number(v.people[1].value);
    for (let b = 1; b <= final; b++) if (b+first+second === final) solutions.push(b);
    explanation = `나는 마지막에 ${final}개이고, ${first}개와 ${second}개를 받았습니다. 받은 양을 빼면 처음 수는 ${final}−${first}−${second}=${solutions[0]}개입니다.`;
  }
  if (solutions.length !== 1 || solutions[0] !== number(p.answer)) throw Error(`Independent solve failed: ${id} / ${difficulty}: ${JSON.stringify({solutions,answer:p.answer,prompt:p.prompt,visual:p.visual})}`);
  return { uniqueAnswer: solutions[0], explanation, method: 'integer constraints from student-visible givens' };
}

export function solveFamily(t,p){
 const v=p.visual;
 if(t.id==='SQ01'){
  const result=v.rows.map(row=>{const known=row.items.map((value,i)=>[value,i]).filter(([x])=>x!==null);const step=(known[1][0]-known[0][0])/(known[1][1]-known[0][1]);return row.items.map((x,i)=>x===null?known[0][0]+step*(i-known[0][1]):null).filter(x=>x!==null);}).flat();
  if(JSON.stringify(nums(p.answer).filter((_,i)=>i%2===1))!==JSON.stringify(result))throw Error('Sequence answer mismatch');
  return '주어진 이웃 수에서 일정한 차를 구해 빈칸 위치까지 적용했다.';
 }
 if(t.id==='SQ02'){
  const items=v.rows[0].items, values=new Set();
  for(let period=1;period<=Math.floor(items.length/2);period++){
   const slots=new Map();let ok=true;
   items.forEach((x,i)=>{if(x!==null){if(slots.has(i%period)&&slots.get(i%period)!==x)ok=false;slots.set(i%period,x);}});
   if(ok){const gaps=items.map((x,i)=>x===null?slots.get(i%period):null).filter(x=>x!==null);if(gaps.every(x=>x!==undefined))values.add(gaps.join(','));}
  }
  if(values.size!==1||!values.has(nums(p.answer).join(',')))throw Error('Repeating rule ambiguity or answer mismatch');
  return '보이는 수와 맞는 짧은 반복마디들을 대조하여 빈칸의 수가 같음을 확인했다. 반복 규칙이라는 문제 조건을 유지한다.';
 }
 if(t.id==='SQ04'){
  const row=v.rows[0].items,strands=nums(p.prompt)[0],answers=[];
  for(let index=0;index<row.length;index++)if(row[index]===null){const same=row.map((x,i)=>[x,i]).filter(([x,i])=>x!==null&&i%strands===index%strands);const step=(same[1][0]-same[0][0])/(same[1][1]-same[0][1]);answers.push(same[0][0]+step*(index-same[0][1]));}
  if(JSON.stringify(nums(p.answer))!==JSON.stringify(answers))throw Error('Interleaved answer mismatch');
  return '차례를 두 부분 수열로 나눈 뒤 각각의 일정한 차를 주어진 항에서 계산했다.';
 }
 if(t.id==='SQ05'){
  const n=nums(p.prompt),answer=n[0]+n[1]*(n[2]-1);
  if(nums(p.answer)[0]!==answer)throw Error('Nth term mismatch');
  return `첫 수 ${n[0]}에서 ${n[1]}씩 ${n[2]-1}번 이동하므로 ${answer}이다.`;
 }
 if(t.id.startsWith('VN')){
  const a=v.leftTotal,b=v.rightTotal,o=v.overlap,total=v.total,out=v.neither;
  const answer=t.id==='VN02'?a+b-total:t.id==='VN03'?a+b-o:t.id==='VN04'?a+b-2*o:t.id==='VN05'?total-(a+b-o):a+b-(total-out);
  if(nums(p.answer)[0]!==answer)throw Error('Venn answer mismatch');
  return '학생에게 보이는 두 집합의 수·전체·공통 또는 바깥 수만으로 포함·배제 관계를 다시 계산했다. '+`계산 결과는 ${answer}명이다.`;
 }
 if(t.id.startsWith('MG')){
  const size=v.size,lines=[];
  for(let i=0;i<size;i++){lines.push(Array.from({length:size},(_,j)=>i*size+j));lines.push(Array.from({length:size},(_,j)=>j*size+i));}
  lines.push(Array.from({length:size},(_,i)=>i*(size+1)),Array.from({length:size},(_,i)=>(i+1)*(size-1)));
  if(t.id==='MG01'){
   const answer=nums(p.answer);
   if(answer.length!==size*size||new Set(answer).size!==answer.length||answer.some((x,i)=>typeof v.shown[i]==='number'&&x!==v.shown[i])||JSON.stringify([...answer].sort((a,b)=>a-b))!==JSON.stringify([...v.cards].sort((a,b)=>a-b))||lines.some(line=>sum(line.map(i=>answer[i]))!==v.lineSum))throw Error('Magic completion constraints mismatch');
   return '제시한 완성 배치가 카드 목록·주어진 칸·가로·세로·두 대각선의 같은 합을 모두 만족한다. 다른 올바른 배치도 허용하며 유일해를 주장하지 않는다.';
  }
  const work=[...v.shown],target=work.findIndex(x=>typeof x==='string');
  for(let pass=0;pass<size*size;pass++)for(let line of lines){const gaps=line.filter(i=>typeof work[i]!=='number');if(gaps.length===1)work[gaps[0]]=v.lineSum-sum(line.filter(i=>i!==gaps[0]).map(i=>work[i]));}
  if(typeof work[target]!=='number'||work[target]!==nums(p.answer)[0])throw Error('Magic target cannot be derived');
  return `주어진 칸과 한 줄 합에서 빈칸이 하나인 줄부터 연결해 목표 칸 ${work[target]}을 얻었다.`;
 }
 throw Error('Unsupported sample solver '+t.id);
}
