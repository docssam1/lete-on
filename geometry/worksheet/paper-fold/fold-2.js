// 독립 재검산: 펼친 조각들을 격자에 구멍으로 새기고, 덩어리를 세어
// 종이 가장자리에 닿은 것은 반원, 안쪽 것은 원으로 분류한다.
function countPunchRaster(pieces, M){
  const hole=new Uint8Array(M*M);
  for(let j=0;j<M;j++) for(let i=0;i<M;i++){
    const x=(i+0.5)/M, y=(j+0.5)/M;
    for(const q of pieces){
      if(Math.hypot(x-q.cx,y-q.cy)>=q.r) continue;
      if(q.type==='half' && ((x-q.cx)*q.nx+(y-q.cy)*q.ny)>0) continue;  // 법선 쪽 반은 종이 밖
      hole[j*M+i]=1; break;
    }
  }
  const seen=new Uint8Array(M*M); let circles=0, semis=0;
  for(let s0=0;s0<M*M;s0++){
    if(!hole[s0]||seen[s0]) continue;
    let touches=false; const stack=[s0]; seen[s0]=1;
    while(stack.length){
      const v=stack.pop(), vi=v%M, vj=(v/M)|0;
      if(vi===0||vj===0||vi===M-1||vj===M-1) touches=true;
      for(const wv of [v-1,v+1,v-M,v+M]){
        if(wv<0||wv>=M*M) continue;
        const wi=wv%M;
        if(Math.abs(wi-vi)>1) continue;
        if(hole[wv]&&!seen[wv]){seen[wv]=1; stack.push(wv);}
      }
    }
    if(touches) semis++; else circles++;
  }
  return {circles, semis};
}

function renderPunch(ctx,d){
  header(ctx, d.text);
  const n=d.stages.length, size=170, gap=52, baseY=150;
  let x=50;
  d.stages.forEach((stage,i)=>{
    drawPoly(ctx, stage.poly, x, baseY, size);
    if(stage.fold){
      drawCrease(ctx, foldSegment(stage.poly, stage.fold), x, baseY, size);
      drawFoldArrow(ctx, stage.poly, stage.fold, x, baseY, size);
    } else {
      for(const q of d.punches){
        ctx.fillStyle='#fff'; ctx.strokeStyle='#8a8a94'; ctx.lineWidth=1.8;
        if(q.type==='full'){
          ctx.beginPath(); ctx.arc(x+q.cx*size, baseY+q.cy*size, q.r*size, 0, Math.PI*2);
          ctx.fill(); ctx.stroke();
        } else {
          // 평평한 면이 가장자리에 붙은 반원 물림 — 안쪽 반만 그린다
          const a0=Math.atan2(q.ny,q.nx);
          ctx.beginPath();
          ctx.arc(x+q.cx*size, baseY+q.cy*size, q.r*size, a0+Math.PI/2, a0+Math.PI*1.5);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x+q.cx*size, baseY+q.cy*size, q.r*size, a0+Math.PI/2, a0+Math.PI*1.5);
          ctx.stroke();
        }
      }
    }
    x+=size+14;
    if(i<n-1){ drawStepArrow(ctx, x, baseY+size/2); x+=gap; }
  });
}

/* ===== 유형 9: 목표 합이 되게 색칠하기 (역방향) =====
   수가 보이도록 "뒤로" 두 번 접은 2x2에서, 잘라낸 수의 합이 목표가 되도록
   색칠할 칸을 학생이 고른다. 접은 칸 하나의 구도(거울 네 칸) 합을 S라 하면
   목표는 고른 칸들의 S 합 — 15가지 부분집합 중 목표를 만드는 답이 하나뿐일 때만 낸다. */
function numIga(n){ return [1,3,6,7,8,0].includes(n%10) ? '이' : '가'; }
function genNumInverse(){
  const N=4;
  const grid=Array.from({length:N},()=>Array.from({length:N},()=>R(1,3)));
  const pr=pick([0,2]), pc=pick([0,2]);          // 뒤로 접어 남는(보이는) 사분면
  const firstFold=pick(['h','v']);
  // 접은 칸 (r,c)의 구도 합
  const S=[[0,0],[0,0]];
  for(let r=0;r<2;r++) for(let c=0;c<2;c++){
    const gr=pr+r, gc=pc+c;
    S[r][c]=grid[gr][gc]+grid[gr][3-gc]+grid[3-gr][gc]+grid[3-gr][3-gc];
  }
  // 답 부분집합(1~2칸)을 고르고, 그 합을 만드는 부분집합이 유일한지 전수 확인
  const cells=[{r:0,c:0},{r:0,c:1},{r:1,c:0},{r:1,c:1}];
  const answerSet=shuffleArr(cells).slice(0, R(1,2));
  const target=answerSet.reduce((t,q)=>t+S[q.r][q.c],0);
  let matches=0;
  for(let mask=1; mask<16; mask++){
    let sum=0;
    cells.forEach((q,i)=>{ if(mask&(1<<i)) sum+=S[q.r][q.c]; });
    if(sum===target) matches++;
  }
  if(matches!==1) return genNumInverse();

  const posName=(q)=>`${q.r===0?'위':'아래'}쪽 ${q.c===0?'왼':'오른'}쪽`;
  return {
    kind:'num-inverse', grid, pr, pc, firstFold, S, answerSet, target,
    answer:`접은 모양의 ${answerSet.map(posName).join('과 ')} 칸`,
    text:[`다음과 같이 수가 쓰여 있는 색종이를 두 번 접은 후 접은 선을 따라 잘라냈습니다. 잘라낸 부분에 쓰인 수의`,
          `합이 ${target}${numIga(target)} 되려면 어떤 부분을 잘라야 하는지 두 번 접은 모양에 색칠하시오. (단, 수가 보이도록 뒤로 접습니다.)`],
    info:`사분면 (${pr},${pc}) · 구도 합 ${S.flat().join('·')} · 목표 ${target} · 답 ${answerSet.map(posName).join(', ')}`,
    src:''
  };
}
// 직사각형 숫자 격자 (중간 단계가 2x4라 정사각 전용 drawNumberGrid를 못 쓴다)
function drawCellsRect(ctx, rows, ox, oy, cell){
  const H=rows.length, W=rows[0].length;
  ctx.fillStyle=PAPER; ctx.fillRect(ox,oy,W*cell,H*cell);
  ctx.strokeStyle='#e0aaa4'; ctx.lineWidth=1; ctx.setLineDash([4,3]);
  for(let k=1;k<W;k++){ctx.beginPath();ctx.moveTo(ox+k*cell,oy);ctx.lineTo(ox+k*cell,oy+H*cell);ctx.stroke();}
  for(let k=1;k<H;k++){ctx.beginPath();ctx.moveTo(ox,oy+k*cell);ctx.lineTo(ox+W*cell,oy+k*cell);ctx.stroke();}
  ctx.setLineDash([]);
  ctx.font='600 '+Math.round(cell*0.5)+'px sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#333';
  for(let r=0;r<H;r++) for(let c=0;c<W;c++) ctx.fillText(String(rows[r][c]), ox+c*cell+cell/2, oy+r*cell+cell/2+1);
  ctx.strokeStyle=PAPER_EDGE; ctx.lineWidth=2.4; ctx.strokeRect(ox,oy,W*cell,H*cell);
  ctx.textAlign='left'; ctx.textBaseline='alphabetic';
}
function renderNumInverse(ctx,d){
  header(ctx, d.text);
  const cell=46, baseY=150;
  let x=56;
  // 1) 원본 4x4 + 접는선
  drawCellsRect(ctx, d.grid, x, baseY, cell);
  ctx.setLineDash([7,5]); ctx.strokeStyle=CREASE; ctx.lineWidth=1.8;
  ctx.beginPath(); ctx.moveTo(x+2*cell,baseY); ctx.lineTo(x+2*cell,baseY+4*cell); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x,baseY+2*cell); ctx.lineTo(x+4*cell,baseY+2*cell); ctx.stroke();
  ctx.setLineDash([]);
  // 첫 접기 말림 화살표 — 접혀 나가는 반쪽에서 남는 반쪽으로
  if(d.firstFold==='h'){
    const fromY = d.pr===0 ? baseY+3*cell : baseY+cell;
    const toY   = d.pr===0 ? baseY+cell   : baseY+3*cell;
    edgeCurl(ctx, x-12, fromY, x-12, toY, x-28, baseY+2*cell);
  } else {
    const fromX = d.pc===0 ? x+3*cell : x+cell;
    const toX   = d.pc===0 ? x+cell   : x+3*cell;
    edgeCurl(ctx, fromX, baseY-12, toX, baseY-12, x+2*cell, baseY-28);
  }
  x+=4*cell+22; drawStepArrow(ctx, x, baseY+2*cell); x+=58;
  // 2) 한 번 접은 중간 — 뒤로 접어 수가 보인다
  let mid;
  if(d.firstFold==='h') mid=[d.grid[d.pr], d.grid[d.pr+1]];
  else mid=d.grid.map(row=>[row[d.pc], row[d.pc+1]]);
  const midY = d.firstFold==='h' ? baseY+cell : baseY;
  drawCellsRect(ctx, mid, x, midY, cell);
  // 둘째 접기 말림 화살표
  if(d.firstFold==='h'){
    const fromX = d.pc===0 ? x+3*cell : x+cell;
    const toX   = d.pc===0 ? x+cell   : x+3*cell;
    edgeCurl(ctx, fromX, midY-12, toX, midY-12, x+2*cell, midY-28);
  } else {
    const fromY = d.pr===0 ? baseY+3*cell : baseY+cell;
    const toY   = d.pr===0 ? baseY+cell   : baseY+3*cell;
    edgeCurl(ctx, x-12, fromY, x-12, toY, x-28, baseY+2*cell);
  }
  x+=(d.firstFold==='h'?4:2)*cell+22; drawStepArrow(ctx, x, baseY+2*cell); x+=58;
  // 3) 두 번 접은 2x2 — 학생이 색칠할 판. 답은 표시하지 않는다.
  const packet=[[d.grid[d.pr][d.pc], d.grid[d.pr][d.pc+1]],[d.grid[d.pr+1][d.pc], d.grid[d.pr+1][d.pc+1]]];
  drawCellsRect(ctx, packet, x, baseY+cell, cell+8);
}

/* ===== 유형 10: 접어 자르고 펼친 모양 (교재 37~38쪽) =====
   두 번 접은 2x2 조각의 모서리 삼각형을 잘라내고 펼친 모양을 고른다.
   답은 잘린 조각을 거울로 펼친 것. 오답은 실제 오개념으로 만든다:
   ①반사를 하나 빠뜨림 ②거울 대신 평행이동(같은 방향 네 개) ③접힌 조각 안에서 위치가 어긋남.
   정답 판정은 거울 펼치기와 별개로 "점을 접어 넣어 잘린 삼각형에 드는지"로 재검산한다. */
function mirrorPoly(poly, dir){ const m=FOLDS[dir].mirror; return poly.map(pt=>m(pt)); }
function shiftPoly(poly, dx, dy){ return poly.map(pt=>({x:pt.x+dx, y:pt.y+dy})); }

// 점 p를 접기 순서대로 접어 넣는다(남는 쪽으로 반사). 펼친 뒤 어디가 잘렸는지 독립 판정용.
function foldPointIn(p, dirs){
  let q={...p};
  for(const d of dirs){ if(FOLDS[d].keep(q) < 0) q=FOLDS[d].mirror(q); }
  return q;
}
function rasterMask(polys, M){
  const mask=new Uint8Array(M*M);
  for(let j=0;j<M;j++) for(let i=0;i<M;i++){
    const pt={x:(i+0.5)/M, y:(j+0.5)/M};
    for(const poly of polys) if(inPoly(poly,pt)){ mask[j*M+i]=1; break; }
  }
  return mask;
}
function maskDiff(a,b){ let n=0; for(let i=0;i<a.length;i++) if(a[i]!==b[i]) n++; return n; }

function genUnfoldShape(){
  const dirs = pick([['h','v'],['v','h']]);         // 남는 조각은 늘 왼쪽 위 [0,.5]x[0,.5]
  const W=0.5;
  const L=0.2+Math.random()*0.14;                   // 삼각형 다리 길이
  // 접힌 조각의 네 모서리 중 하나에서 직각삼각형을 잘라낸다
  const corner=pick(['tl','tr','bl','br']);
  const cut = corner==='tl' ? [{x:0,y:0},{x:L,y:0},{x:0,y:L}]
            : corner==='tr' ? [{x:W,y:0},{x:W,y:L},{x:W-L,y:0}]
            : corner==='bl' ? [{x:0,y:W},{x:L,y:W},{x:0,y:W-L}]
            :                 [{x:W,y:W},{x:W-L,y:W},{x:W,y:W-L}];

  // 정답: 거울로 펼치기
  const unfold=(polys)=>{
    let cur=polys;
    for(let i=dirs.length-1;i>=0;i--) cur=cur.concat(cur.map(pl=>mirrorPoly(pl, dirs[i])));
    return cur;
  };
  const correct=unfold([cut]);

  // 오답 후보
  const wrongOnlyOne=[cut, mirrorPoly(cut, dirs[1])];                       // 반사 하나 빠뜨림
  const wrongShift=[cut, shiftPoly(cut,W,0), shiftPoly(cut,0,W), shiftPoly(cut,W,W)]; // 평행이동
  const other=pick(['tl','tr','bl','br'].filter(k=>k!==corner));
  const cut2 = other==='tl' ? [{x:0,y:0},{x:L,y:0},{x:0,y:L}]
             : other==='tr' ? [{x:W,y:0},{x:W,y:L},{x:W-L,y:0}]
             : other==='bl' ? [{x:0,y:W},{x:L,y:W},{x:0,y:W-L}]
             :                [{x:W,y:W},{x:W-L,y:W},{x:W,y:W-L}];
  const wrongCorner=unfold([cut2]);                                          // 다른 모서리를 자른 모양

  const M=181;
  const mCorrect=rasterMask(correct,M);
  const cands=[wrongOnlyOne, wrongShift, wrongCorner]
    .filter(w=>maskDiff(rasterMask(w,M), mCorrect) > M*M*0.01);              // 눈에 띄게 달라야 오답이다
  if(cands.length<3) return genUnfoldShape();

  // 독립 재검산: 점을 접어 넣어 삼각형에 드는지로 정답 마스크를 다시 만든다
  const mFold=new Uint8Array(M*M);
  for(let j=0;j<M;j++) for(let i=0;i<M;i++){
    const q=foldPointIn({x:(i+0.5)/M, y:(j+0.5)/M}, dirs);
    if(inPoly(cut,q)) mFold[j*M+i]=1;
  }
  if(maskDiff(mFold, mCorrect) > M*M*0.004) return genUnfoldShape();          // 경계 픽셀 오차만 허용

  const options=shuffleArr([{polys:correct,ok:true},...cands.map(w=>({polys:w,ok:false}))]);
  return {
    kind:'unfold-shape', dirs, cut, corner, options,
    answer:`${'①②③④'[options.findIndex(o=>o.ok)]}`,
    text:['색종이를 두 번 접은 후 칠해진 부분을 잘라내었습니다.',
          '남은 부분을 펼쳤을 때의 그림으로 알맞은 것을 고르시오.'],
    info:`접기 ${dirs.join(' → ')} · ${corner} 모서리 삼각형 · 정답 ${'①②③④'[options.findIndex(o=>o.ok)]}`,
    src:''
  };
}

function renderUnfoldShape(ctx,d){
  header(ctx, d.text);
  const size=104, baseY=132;
  let x=48;
  // 1) 원본 + 첫 접기
  drawPoly(ctx, [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}], x, baseY, size);
  const sq=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}];
  drawCrease(ctx, foldSegment(sq, d.dirs[0]), x, baseY, size);
  drawFoldArrow(ctx, sq, d.dirs[0], x, baseY, size);
  x+=size+10; drawStepArrow(ctx, x, baseY+size/2); x+=48;
  // 2) 한 번 접힌 조각 + 둘째 접기
  const half=clipHalfPlane(sq, FOLDS[d.dirs[0]].keep);
  drawPoly(ctx, half, x, baseY, size);
  drawCrease(ctx, foldSegment(half, d.dirs[1]), x, baseY, size);
  drawFoldArrow(ctx, half, d.dirs[1], x, baseY, size);
  x+=size+10; drawStepArrow(ctx, x, baseY+size/2); x+=48;
  // 3) 두 번 접힌 2x2 + 잘라낼 삼각형 색칠
  const quad=clipHalfPlane(half, FOLDS[d.dirs[1]].keep);
  drawPoly(ctx, quad, x, baseY, size);
  ctx.beginPath();
  d.cut.forEach((pt,i)=>{const X=x+pt.x*size, Y=baseY+pt.y*size; i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);});
  ctx.closePath(); ctx.fillStyle=CUT; ctx.fill();

  // 4) 보기 네 개 — 잘린 부분은 흰색으로 파낸다
  ctx.fillStyle='#333'; ctx.font='600 15px sans-serif';
  ctx.fillText('알맞은 것은?', 48, baseY+size+42);
  let ox=210;
  d.options.forEach((opt,k)=>{
    const oy=baseY+size+22;
    drawPoly(ctx, sq, ox, oy, size);
    ctx.setLineDash([5,4]); ctx.strokeStyle=CREASE; ctx.lineWidth=1.4;
    ctx.beginPath(); ctx.moveTo(ox+size/2,oy); ctx.lineTo(ox+size/2,oy+size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox,oy+size/2); ctx.lineTo(ox+size,oy+size/2); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='#fff';
    for(const poly of opt.polys){
      ctx.beginPath();
      poly.forEach((pt,i)=>{const X=ox+pt.x*size, Y=oy+pt.y*size; i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);});
      ctx.closePath(); ctx.fill();
    }
    ctx.strokeStyle=PAPER_EDGE; ctx.lineWidth=2.2;
    ctx.strokeRect(ox,oy,size,size);
    ctx.fillStyle='#16417C'; ctx.font='700 17px sans-serif';
    ctx.fillText('①②③④'[k], ox+size/2-8, oy+size+22);
    ox+=size+58;
  });
}

/* ===== 유형 5: 겹친 색종이 순서 (교재 35~36·44~46쪽) =====
   같은 크기 정사각형 8장을 3x3 자리에 겹쳐 놓는다(가장자리 중앙 한 자리는 비움 — 교재 문법).
   답이 유일하려면 "맨 위를 걷어내면 남은 것 중 온전히 보이는 종이가 늘 하나뿐"이어야 한다.
   즉 맨 위를 뺀 모든 종이가 자기보다 위 종이 중 하나와 겹쳐야 한다. */
function shuffleArr(list){
  const a=[...list];
  for(let i=a.length-1;i>0;i--){const j=R(0,i); [a[i],a[j]]=[a[j],a[i]];}
  return a;
}
function genStack(askOrder){
  const anchors=[];
  for(let r=0;r<3;r++) for(let c=0;c<3;c++) anchors.push({r,c});
  const dropEdge=[1,3,5,7][R(0,3)];                 // 가장자리 중앙 네 자리 중 하나를 비운다
  const pos=anchors.filter((_,i)=>i!==dropEdge);    // 8자리, 종이 한 변=2, 판 전체=4x4
  const labels=shuffleArr(['가','나','다','라','마','바','사','아']);
  const over=(a,b)=>Math.abs(pos[a].r-pos[b].r)<2 && Math.abs(pos[a].c-pos[b].c)<2;

  for(let attempt=0;attempt<800;attempt++){
    const z=shuffleArr(pos.map((_,i)=>i));          // z[k] = 위에서 k번째 종이의 자리 번호
    // 걷어내기 유일성: 바로 위 종이와 겹쳐야 한다. "위 종이 중 아무나"로는 부족하다 —
    // 그 종이가 먼저 걷혀 나가면 중간 종이가 조기에 온전히 드러나 답이 두 갈래가 된다.
    let ok=true;
    for(let k=1;k<8;k++) if(!over(z[k], z[k-1])){ok=false;break;}
    if(!ok) continue;
    // 모든 종이에 라벨 놓을 보이는 지점이 있어야 한다 (내부 표본점 중 위 종이에 안 덮이고 가장 여유로운 곳)
    const spots=[];
    for(let k=0;k<8 && ok;k++){
      const pp=pos[z[k]]; let best=null, bd=-1;
      for(let i=1;i<=8;i++) for(let j=1;j<=8;j++){
        const x=pp.c+i*2/9, y=pp.r+j*2/9;
        let covered=false, clear=Infinity;
        for(let m=0;m<k;m++){
          const q=pos[z[m]];
          if(x>q.c && x<q.c+2 && y>q.r && y<q.r+2){covered=true;break;}
          const dx=Math.max(q.c-x, x-(q.c+2), 0), dy=Math.max(q.r-y, y-(q.r+2), 0);
          clear=Math.min(clear, Math.hypot(dx,dy));
        }
        if(covered) continue;
        const d=Math.min(clear, x-pp.c, pp.c+2-x, y-pp.r, pp.r+2-y);
        if(d>bd){bd=d; best={x,y};}
      }
      if(!best || bd<0.12){ok=false;break;}         // 너무 비좁은 자리는 라벨이 안 읽힌다
      spots.push(best);
    }
    if(!ok) continue;

    const order=z.map(i=>labels[i]);                // 위 → 아래
    const wantTop=Math.random()<0.3;                // 교재는 주로 '가장 밑'을 묻는다
    return {
      kind:'stack', pos, z, labels, spots, order, askOrder, wantTop,
      answer: askOrder ? order.join(' → ') : (wantTop ? order[0] : order[7]),
      text:['다음은 크기가 모두 같은 정사각형 모양의 색종이 8장을 겹쳐 놓은 것입니다.',
            askOrder ? '가장 위에 있는 색종이부터 순서대로 쓰시오.'
                     : (wantTop ? '가장 위에 놓인 색종이는 어느 것입니까?' : '가장 밑에 있는 색종이는 어느 것입니까?')],
      info:`위에서부터 ${order.join(' ')}`,
      src:''
    };
  }
  return genStack(askOrder);                        // 이 배치에서 못 찾으면 자리부터 다시
}

function renderStack(ctx,d){
  header(ctx, d.text);
  const u=62, ox=470, oy=136;
  // 아래 종이부터 그린다 — 위 종이의 흰 채움이 아래 경계를 지워 실제 가림과 같아진다
  for(let k=7;k>=0;k--){
    const p=d.pos[d.z[k]];
    ctx.fillStyle='#fff';
    ctx.fillRect(ox+p.c*u, oy+p.r*u, 2*u, 2*u);
    ctx.strokeStyle='#3f7f9e'; ctx.lineWidth=2;
    ctx.strokeRect(ox+p.c*u, oy+p.r*u, 2*u, 2*u);
  }
  ctx.font='700 21px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillStyle='#333';
  for(let k=0;k<8;k++){
    const sp=d.spots[k];
    ctx.fillText(d.order[k], ox+sp.x*u, oy+sp.y*u);
  }
  ctx.textAlign='left'; ctx.textBaseline='alphabetic';
}

/* ===== 여러 번 접기: 마지막에 가장 위에 놓이는 수 ===== */
function genFoldTop(difficulty){
  const dims = difficulty==='easy' ? [2,4] : difficulty==='mid' ? [4,4] : [4,8];
  const rows=dims[0], cols=dims[1];
  const grid=Array.from({length:rows},()=>Array.from({length:cols},()=>R(1,9)));
  let packets=grid.map((row,r)=>row.map((_,c)=>[{r,c}]));
  const steps=[];
  while(packets.length>1 || packets[0].length>1){
    const canH=packets.length>1, canV=packets[0].length>1;
    const axis=canH&&canV ? pick(['h','v']) : canH?'h':'v';
    const direction=axis==='h' ? pick(['up','down']) : pick(['left','right']);
    steps.push({rows:packets.length,cols:packets[0].length,direction});
    if(axis==='h'){
      const half=packets.length/2, next=[];
      for(let r=0;r<half;r++){
        const row=[];
        for(let c=0;c<packets[0].length;c++){
          const fixed=direction==='up'?packets[r][c]:packets[half+r][c];
          const moving=direction==='up'?packets[packets.length-1-r][c]:packets[half-1-r][c];
          row.push([...fixed,...moving.slice().reverse()]);
        }
        next.push(row);
      }
      packets=next;
    }else{
      const half=packets[0].length/2;
      packets=packets.map(row=>Array.from({length:half},(_,c)=>{
        const fixed=direction==='left'?row[c]:row[half+c];
        const moving=direction==='left'?row[row.length-1-c]:row[half-1-c];
        return [...fixed,...moving.slice().reverse()];
      }));
    }
  }
  const top=packets[0][0][packets[0][0].length-1];
  return {kind:'fold-top',grid,steps,answer:grid[top.r][top.c],
    text:[`앞면과 뒷면에 같은 수가 쓰인 종이를 그림의 순서대로 ${steps.length}번 접었습니다.`,
          '가장 위에 놓이는 수를 구하세요.'],
    info:`${rows}×${cols} 수 배열 · ${steps.length}번 접기 · 정답 ${grid[top.r][top.c]}`,src:''};
}

function renderFoldTop(ctx,d){
  header(ctx,d.text);
  const labels={up:'위로',down:'아래로',left:'왼쪽으로',right:'오른쪽으로'};
  let x=42;
  d.steps.forEach((step,i)=>{
    const scale=Math.min(78/step.cols,58/step.rows), w=step.cols*scale, h=step.rows*scale;
    const y=132+(62-h)/2;
    ctx.fillStyle='#fff7f5';ctx.fillRect(x,y,w,h);ctx.strokeStyle=PAPER_EDGE;ctx.lineWidth=1.6;ctx.strokeRect(x,y,w,h);
    ctx.setLineDash([4,3]);ctx.strokeStyle=CREASE;
    if(step.direction==='up'||step.direction==='down'){
      ctx.beginPath();ctx.moveTo(x,y+h/2);ctx.lineTo(x+w,y+h/2);ctx.stroke();
    }else{
      ctx.beginPath();ctx.moveTo(x+w/2,y);ctx.lineTo(x+w/2,y+h);ctx.stroke();
    }
    ctx.setLineDash([]);ctx.fillStyle=ARROW;ctx.font='700 12px sans-serif';ctx.textAlign='center';
    ctx.fillText(labels[step.direction],x+w/2,y+h+18);
    x+=w+34;if(i<d.steps.length-1)drawStepArrow(ctx,x-25,y+h/2);
  });
  ctx.fillStyle='#fff';ctx.strokeStyle='#8c9497';ctx.lineWidth=2;ctx.fillRect(x+8,140,44,44);ctx.strokeRect(x+8,140,44,44);
  ctx.fillStyle='#333';ctx.font='800 24px sans-serif';ctx.fillText('?',x+30,169);
  ctx.textAlign='left';
  const cell=Math.min(42,270/d.grid.length,650/d.grid[0].length), gw=d.grid[0].length*cell, gh=d.grid.length*cell;
  const gx=(1300-gw)/2, gy=255;
  ctx.font=`600 ${Math.max(14,Math.round(cell*.42))}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
  for(let r=0;r<d.grid.length;r++)for(let c=0;c<d.grid[0].length;c++){
    ctx.fillStyle='#fff';ctx.fillRect(gx+c*cell,gy+r*cell,cell,cell);ctx.strokeStyle='#69737a';ctx.lineWidth=1.2;ctx.strokeRect(gx+c*cell,gy+r*cell,cell,cell);
    ctx.fillStyle='#28323a';ctx.fillText(String(d.grid[r][c]),gx+(c+.5)*cell,gy+(r+.5)*cell);
  }
  ctx.textAlign='left';ctx.textBaseline='alphabetic';
}

