// Frozen compatibility reference from the pre-extraction GFIELD worksheet
// (94a69f4b, fold-1.js). Test-only; no Git history or browser is needed.
const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=(list)=>list[R(0,list.length-1)];

function genNumber(askCut, preset, difficulty='mid'){
  const N=4;
  const numberMax=difficulty==='easy'?4:difficulty==='hard'?9:6;
  const grid = preset ? preset.grid.map(row=>[...row])
                      : Array.from({length:N},()=>Array.from({length:N},()=>R(1,numberMax)));
  const hDir = preset ? preset.hDir : pick(['up','down']);     // up: 아래가 위로 / down: 위가 아래로
  const vDir = preset ? preset.vDir : pick(['left','right']);  // left: 오른쪽이 왼쪽으로 / right: 왼쪽이 오른쪽으로
  const packetRow = hDir==='up' ? 0 : 2;                       // 접힌 묶음이 놓이는 사분면
  const packetCol = vDir==='left' ? 0 : 2;

  const cutCount = preset ? 1 : difficulty==='easy'?1:difficulty==='hard'?2:R(1,2);
  const cells=[];                                              // 묶음 안 좌표 (0~1, 0~1)
  if(preset){ cells.push({...preset.cell}); }
  else while(cells.length<cutCount){
    const c={r:R(0,1), c:R(0,1)};
    if(!cells.some(o=>o.r===c.r&&o.c===c.c)) cells.push(c);
  }

  const removed=new Set();
  for(const cell of cells){
    const gr=packetRow+cell.r, gc=packetCol+cell.c;            // 색칠 칸의 원본 좌표
    for(const r of [gr, N-1-gr]) for(const c of [gc, N-1-gc]) removed.add(r*N+c);
  }

  let total=0, cut=0;
  for(let r=0;r<N;r++) for(let c=0;c<N;c++){
    total+=grid[r][c];
    if(removed.has(r*N+c)) cut+=grid[r][c];
  }
  const remain=total-cut;
  if(remain<=0) return genNumber(askCut,null,difficulty);

  return {
    kind:'number', grid, hDir, vDir, packetRow, packetCol, cells, removed, total, cut, remain,
    answer: askCut ? cut : remain,
    text:[`다음과 같이 수가 쓰인 색종이를 접어서 색칠된 부분을 자른 후 펼쳤을 때,`,
          askCut ? '잘려나간 수들의 합을 구하시오.' : '남아 있는 수들의 합을 구하시오.'],
    info:`가로 ${hDir==='up'?'위로':'아래로'} → 세로 ${vDir==='left'?'왼쪽으로':'오른쪽으로'} · 색칠 ${cells.length}칸 · 잘린 칸 ${removed.size}개(합 ${cut}) · 전체 ${total} · 남은 합 ${remain}`,
    src:''
  };
}

