/* ===== 정답지 그림 =====
   정답지는 한 쪽에 두 칸씩 작게 찍힌다(그림 1300x520이 폭 약 7.7cm, 1px ≈ 0.17pt).
   문제 그림을 그대로 줄이면 그림 속 글자가 3~4pt로 읽히지 않으므로, 정답지에는 유형마다
   답을 보여 주는 그림 하나만 크게 다시 그린다. 문제 문장은 문제지와 카드에 있으니 넣지 않는다.
   글자는 모두 36px(약 6pt) 이상이다(검사: fold-answers.browsercheck.mjs).
   레벨 3 게임 연계(game-reverse)는 fold-3.js의 renderReverseGame(ctx,d,true)이 그린다. */
const ANSWER_PX={min:36,label:40,value:52};
const ANSWER_INK='#17345f', ANSWER_GREEN='#1f6d43', ANSWER_MARK='#c95f7a';

function answerFont(px,weight=800){ return `${weight} ${px}px sans-serif`; }
/* 폭에 맞게 글자 크기를 줄이되 36px 밑으로는 줄이지 않는다. 그래도 넘치면 '+'나 빈칸에서 줄을 나눈다. */
function answerWrap(ctx,text,maxWidth,px){
  ctx.font=answerFont(px);
  let size=px;
  while(size>ANSWER_PX.min && ctx.measureText(text).width>maxWidth){ size-=2; ctx.font=answerFont(size); }
  if(ctx.measureText(text).width<=maxWidth) return [{text,px:size}];
  const tokens=text.split(/(?<=[+ ])/);
  const lines=[]; let line='';
  for(const token of tokens){
    if(line && ctx.measureText(line+token).width>maxWidth){ lines.push(line.trimEnd()); line=token.trimStart(); }
    else line+=token;
  }
  if(line) lines.push(line);
  return lines.map(item=>({text:item,px:size}));
}
/* 글줄 묶음을 세로 가운데(cy)에 맞춰 x에서 왼쪽 정렬로 쓴다. items: {text,px,color} */
function answerColumn(ctx,items,x,cy,maxWidth){
  const lines=items.flatMap(item=>answerWrap(ctx,item.text,maxWidth,item.px||ANSWER_PX.label).map(line=>({...line,color:item.color||ANSWER_INK,gap:item.gap||0})));
  const heights=lines.map(line=>line.px*1.35+line.gap);
  let y=cy-heights.reduce((sum,h)=>sum+h,0)/2;
  ctx.save(); ctx.textAlign='left'; ctx.textBaseline='middle';
  lines.forEach((line,index)=>{
    y+=line.gap;
    ctx.font=answerFont(line.px); ctx.fillStyle=line.color;
    ctx.fillText(line.text,x,y+line.px*0.675);
    y+=heights[index]-line.gap;
  });
  ctx.restore();
}
function answerCaption(ctx,text,x,y,px=ANSWER_PX.label,color=ANSWER_INK){
  ctx.save(); ctx.font=answerFont(px); ctx.fillStyle=color; ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillText(text,x,y); ctx.restore();
}
function answerArrow(ctx,x,y,length=64){
  ctx.save(); ctx.strokeStyle='#8a9a9b'; ctx.fillStyle='#8a9a9b'; ctx.lineWidth=7; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+length-14,y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+length,y); ctx.lineTo(x+length-22,y-14); ctx.lineTo(x+length-22,y+14); ctx.closePath(); ctx.fill();
  ctx.restore();
}
/* 수 격자. marked(칸 번호 r*cols+c)는 진하게 칠하고 수는 흰 글자로 남긴다. */
function answerGrid(ctx,grid,ox,oy,cell,{marked=new Set(),creases=[]}={}){
  const rows=grid.length, cols=grid[0].length;
  ctx.save();
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
    ctx.fillStyle=marked.has(r*cols+c)?ANSWER_MARK:PAPER; ctx.fillRect(ox+c*cell,oy+r*cell,cell,cell);
  }
  ctx.strokeStyle='#e0aaa4'; ctx.lineWidth=1.5;
  for(let k=1;k<cols;k++){ ctx.beginPath(); ctx.moveTo(ox+k*cell,oy); ctx.lineTo(ox+k*cell,oy+rows*cell); ctx.stroke(); }
  for(let k=1;k<rows;k++){ ctx.beginPath(); ctx.moveTo(ox,oy+k*cell); ctx.lineTo(ox+cols*cell,oy+k*cell); ctx.stroke(); }
  ctx.setLineDash([10,8]); ctx.strokeStyle=CREASE; ctx.lineWidth=2.4;
  for(const [a,b] of creases){ ctx.beginPath(); ctx.moveTo(ox+a.x*cols*cell,oy+a.y*rows*cell); ctx.lineTo(ox+b.x*cols*cell,oy+b.y*rows*cell); ctx.stroke(); }
  ctx.setLineDash([]);
  ctx.strokeStyle=PAPER_EDGE; ctx.lineWidth=3; ctx.strokeRect(ox,oy,cols*cell,rows*cell);
  ctx.font=answerFont(Math.round(cell*0.46),700); ctx.textAlign='center'; ctx.textBaseline='middle';
  for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){
    ctx.fillStyle=marked.has(r*cols+c)?'#fff':'#333';
    ctx.fillText(String(grid[r][c]),ox+(c+.5)*cell,oy+(r+.5)*cell+2);
  }
  ctx.restore();
}
function answerSquare(ctx,x,y,size,dirs=[]){
  drawPoly(ctx,[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}],x,y,size);
  ctx.save(); ctx.setLineDash([10,8]); ctx.strokeStyle=CREASE; ctx.lineWidth=2.4;
  for(const dir of dirs){
    const seg=foldSegment([{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}],dir);
    if(!seg) continue;
    ctx.beginPath(); ctx.moveTo(x+seg[0].x*size,y+seg[0].y*size); ctx.lineTo(x+seg[1].x*size,y+seg[1].y*size); ctx.stroke();
  }
  ctx.restore();
}

/* 구멍 개수: 마지막 접힌 조각부터 한 단계씩 펼친 그림과 그때의 구멍 수. */
function answerHole(ctx,d){
  let points=d.holes.map(p=>({...p}));
  const panels=[{poly:d.stages[d.stages.length-1].poly,points:points.map(p=>({...p}))}];
  for(let i=d.dirs.length-1;i>=0;i--){
    points=uniqueHolePoints(points.concat(points.map(p=>FOLDS[d.dirs[i]].mirror(p))));
    panels.push({poly:d.stages[i].poly,points:points.map(p=>({...p}))});
  }
  const n=panels.length, gap=84, size=Math.min(390,(1240-gap*(n-1))/n);
  const top=Math.round((520-size-70)/2);
  let x=Math.round((1300-(n*size+(n-1)*gap))/2);
  panels.forEach((panel,i)=>{
    drawPoly(ctx,panel.poly,x,top,size);
    drawHoles(ctx,panel.points,x,top,size,Math.max(11,size*0.05));
    answerCaption(ctx,`${panel.points.length}개`,x+size/2,top+size+44,ANSWER_PX.label,i===n-1?ANSWER_GREEN:ANSWER_INK);
    x+=size;
    if(i<n-1){ answerArrow(ctx,x+10,top+size/2,gap-20); x+=gap; }
  });
}

/* 수가 쓰인 색종이(가로·세로 두 번, 대각선 한 번): 펼친 판에서 잘린 칸과 그 합. */
function answerNumberGrid(ctx,d){
  const cell=104, size=cell*4, ox=50, oy=Math.round((520-size)/2);
  const creases=d.kind==='diag-number'?[[{x:0,y:0},{x:1,y:1}]]:[[{x:.5,y:0},{x:.5,y:1}],[{x:0,y:.5},{x:1,y:.5}]];
  answerGrid(ctx,d.grid,ox,oy,cell,{marked:d.removed,creases});
  const values=[...d.removed].sort((a,b)=>a-b).map(index=>d.grid[Math.floor(index/4)][index%4]);
  const askCut=d.text[1].includes('잘려');
  const items=[{text:'잘린 칸의 수',px:ANSWER_PX.label},{text:`${values.join('+')} = ${d.cut}`,px:ANSWER_PX.value,color:askCut?ANSWER_GREEN:ANSWER_INK}];
  if(!askCut) items.push({text:'남은 수의 합',px:ANSWER_PX.label,gap:18},{text:`${d.total} − ${d.cut} = ${d.remain}`,px:ANSWER_PX.value,color:ANSWER_GREEN});
  answerColumn(ctx,items,ox+size+60,260,1260-(ox+size+60));
}

/* 목표 합이 되게 색칠하기: 두 번 접은 판에 칠할 칸, 펼친 판에 잘리는 칸, 그 합. */
function answerNumInverse(ctx,d){
  const packet=[[d.grid[d.pr][d.pc],d.grid[d.pr][d.pc+1]],[d.grid[d.pr+1][d.pc],d.grid[d.pr+1][d.pc+1]]];
  const packetCell=118, gridCell=88;
  const packetMarked=new Set(d.answerSet.map(q=>q.r*2+q.c));
  const gridMarked=new Set();
  for(const q of d.answerSet){
    const gr=d.pr+q.r, gc=d.pc+q.c;
    for(const r of [gr,3-gr]) for(const c of [gc,3-gc]) gridMarked.add(r*4+c);
  }
  const packetY=Math.round((520-packetCell*2)/2), gridY=Math.round((520-gridCell*4)/2);
  answerGrid(ctx,packet,40,packetY,packetCell,{marked:packetMarked});
  answerArrow(ctx,40+packetCell*2+24,260,70);
  const gx=40+packetCell*2+118;
  answerGrid(ctx,d.grid,gx,gridY,gridCell,{marked:gridMarked,creases:[[{x:.5,y:0},{x:.5,y:1}],[{x:0,y:.5},{x:1,y:.5}]]});
  const values=[...gridMarked].sort((a,b)=>a-b).map(index=>d.grid[Math.floor(index/4)][index%4]);
  const tx=gx+gridCell*4+50;
  answerColumn(ctx,[{text:'잘린 수의 합',px:ANSWER_PX.label},{text:`${values.join('+')} = ${d.target}`,px:ANSWER_PX.value,color:ANSWER_GREEN}],tx,260,1270-tx);
}

/* 여러 번 접기: 마지막에 맨 위에 오는 칸. */
function answerFoldTop(ctx,d){
  const rows=d.grid.length, cols=d.grid[0].length;
  const cell=Math.floor(Math.min(108,440/rows,720/cols));
  const ox=50, oy=Math.round((520-rows*cell)/2);
  answerGrid(ctx,d.grid,ox,oy,cell,{marked:new Set(d.top?[d.top.r*cols+d.top.c]:[])});
  const tx=ox+cols*cell+60;
  answerColumn(ctx,[{text:'가장 위의 수',px:ANSWER_PX.label},{text:String(d.answer),px:72,color:ANSWER_GREEN}],tx,260,1270-tx);
}

/* 접고 선 따라 자르기: 펼친 종이의 모든 자른 선과 조각 수. */
function answerPieces(ctx,d){
  const size=440, x=60, y=40;
  answerSquare(ctx,x,y,size,d.dirs);
  ctx.save(); ctx.strokeStyle=CUT; ctx.lineWidth=6; ctx.lineCap='round';
  for(const [a,b] of d.unfolded){ ctx.beginPath(); ctx.moveTo(x+a.x*size,y+a.y*size); ctx.lineTo(x+b.x*size,y+b.y*size); ctx.stroke(); }
  ctx.restore();
  answerColumn(ctx,[{text:'펼치면',px:ANSWER_PX.label},{text:`${d.answer}조각`,px:72,color:ANSWER_GREEN}],x+size+80,260,1260-(x+size+80));
}

/* 반원·원 펀치: 펼친 종이의 구멍과 모양별 개수. */
function answerPunch(ctx,d){
  const size=440, x=60, y=40;
  answerSquare(ctx,x,y,size,d.dirs);
  ctx.save(); ctx.fillStyle='#fff'; ctx.strokeStyle=CUT; ctx.lineWidth=3.5;
  for(const m of d.merged){
    ctx.beginPath();
    if(m.kind==='circle') ctx.arc(x+m.cx*size,y+m.cy*size,m.r*size,0,Math.PI*2);
    else { const a0=Math.atan2(m.ny,m.nx); ctx.arc(x+m.cx*size,y+m.cy*size,m.r*size,a0+Math.PI/2,a0+Math.PI*1.5); ctx.closePath(); }
    ctx.fill(); ctx.stroke();
  }
  ctx.restore();
  answerColumn(ctx,[{text:`반원 ${d.semis}개`,px:ANSWER_PX.value,color:ANSWER_GREEN},{text:`원 ${d.circles}개`,px:ANSWER_PX.value,color:ANSWER_GREEN,gap:12}],x+size+80,260,1260-(x+size+80));
}

/* 접어 자르고 펼친 모양: 두 번 접은 조각의 자른 곳과 알맞은 보기. */
function answerUnfoldShape(ctx,d){
  const sq=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}];
  const quad=clipHalfPlane(clipHalfPlane(sq,FOLDS[d.dirs[0]].keep),FOLDS[d.dirs[1]].keep);
  const qy=Math.round((520-240)/2);
  drawPoly(ctx,quad,40,qy,480);
  ctx.beginPath(); d.cut.forEach((pt,i)=>{ const X=40+pt.x*480, Y=qy+pt.y*480; i?ctx.lineTo(X,Y):ctx.moveTo(X,Y); }); ctx.closePath(); ctx.fillStyle=CUT; ctx.fill();
  answerArrow(ctx,310,260,80);
  const size=420, ox=430, oy=50, option=d.options.find(item=>item.ok);
  answerSquare(ctx,ox,oy,size,['v','h']);
  ctx.fillStyle='#fff';
  for(const poly of option.polys){ ctx.beginPath(); poly.forEach((pt,i)=>{ const X=ox+pt.x*size, Y=oy+pt.y*size; i?ctx.lineTo(X,Y):ctx.moveTo(X,Y); }); ctx.closePath(); ctx.fill(); }
  ctx.strokeStyle=ANSWER_GREEN; ctx.lineWidth=6; ctx.strokeRect(ox,oy,size,size);
  answerColumn(ctx,[{text:'펼친 모양',px:ANSWER_PX.label},{text:`정답 ${d.answer}`,px:ANSWER_PX.value,color:ANSWER_GREEN}],ox+size+50,260,1270-(ox+size+50));
}

/* 겹친 색종이: 같은 그림을 크게, 답이 되는 종이는 초록 테두리. */
function answerStack(ctx,d){
  const u=118, ox=40, oy=24;
  for(let k=7;k>=0;k--){
    const p=d.pos[d.z[k]];
    ctx.fillStyle='#fff'; ctx.fillRect(ox+p.c*u,oy+p.r*u,2*u,2*u);
    ctx.strokeStyle='#3f7f9e'; ctx.lineWidth=3; ctx.strokeRect(ox+p.c*u,oy+p.r*u,2*u,2*u);
  }
  if(!d.askOrder){
    const p=d.pos[d.z[d.wantTop?0:7]];
    ctx.strokeStyle=ANSWER_GREEN; ctx.lineWidth=8; ctx.setLineDash([18,10]); ctx.strokeRect(ox+p.c*u+4,oy+p.r*u+4,2*u-8,2*u-8); ctx.setLineDash([]);
  }
  ctx.save(); ctx.font=answerFont(44); ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#333';
  d.order.forEach((label,k)=>{ const sp=d.spots[k]; ctx.fillText(label,ox+sp.x*u,oy+sp.y*u); });
  ctx.restore();
  const tx=ox+4*u+70;
  if(d.askOrder) answerColumn(ctx,[{text:'위에서부터',px:ANSWER_PX.label},{text:d.order.slice(0,4).join(' → ')+' →',px:ANSWER_PX.value,color:ANSWER_GREEN},{text:d.order.slice(4).join(' → '),px:ANSWER_PX.value,color:ANSWER_GREEN}],tx,260,1270-tx);
  else answerColumn(ctx,[{text:d.wantTop?'가장 위':'가장 밑',px:ANSWER_PX.label},{text:String(d.answer),px:72,color:ANSWER_GREEN}],tx,260,1270-tx);
}

/* 접고 돌리고 뒤집기: 시작 모양, 동작 기호, 정답 모양. 동작 이름은 카드 풀이에 글로 있다. */
function answerTurn(ctx,d){
  const p=d.source, size=300, top=50;
  drawTurnMatrix(ctx,p.start,40,top,size);
  answerCaption(ctx,'시작',40+size/2,top+size+48);
  let x=40+size+40;
  p.operations.forEach((operation)=>{
    const meta=turnOperations[operation]||{};
    ctx.fillStyle='#e8f4ef'; ctx.beginPath(); ctx.arc(x+50,top+size/2,50,0,Math.PI*2); ctx.fill();
    answerCaption(ctx,meta.symbol||'→',x+50,top+size/2+2,64,'#17676c');
    x+=120;
  });
  answerArrow(ctx,x+4,top+size/2,72);
  x+=110;
  drawTurnMatrix(ctx,p.choices[p.answer],x,top,size,{highlight:true});
  ctx.strokeStyle=ANSWER_GREEN; ctx.lineWidth=7; ctx.strokeRect(x-6,top-6,size+12,size+12);
  answerCaption(ctx,`정답 ${p.answer+1}번`,x+size/2,top+size+48,ANSWER_PX.label,ANSWER_GREEN);
}

/* 게임 연계 1·2단계. */
const ANSWER_SIDE_NAME={left:'왼쪽',right:'오른쪽',top:'위쪽',bottom:'아래쪽',upper:'대각선 위쪽',lower:'대각선 아래쪽'};
function answerUnfoldSteps(p){
  return (p.unfoldSteps||[]).map((step,index)=>({text:`${index+1}단계 ${ANSWER_SIDE_NAME[step.answer]||step.answer}`,px:ANSWER_PX.label}));
}
function answerShared(ctx,d){
  const p=d.source;
  if(p.interaction==='connect-match'){
    const item=140, gap=26, top=Math.round((520-(3*item+2*gap))/2), leftX=170, rightX=990;
    ctx.save(); ctx.strokeStyle=ANSWER_GREEN; ctx.lineWidth=7; ctx.lineCap='round';
    p.pairs.forEach((pair,leftIndex)=>{
      const rightIndex=p.results.findIndex(result=>result.key===pair.key);
      const y1=top+leftIndex*(item+gap)+item/2, y2=top+rightIndex*(item+gap)+item/2;
      ctx.beginPath(); ctx.moveTo(leftX+item+10,y1); ctx.bezierCurveTo(560,y1,600,y2,rightX-10,y2); ctx.stroke();
    });
    ctx.restore();
    p.pairs.forEach((pair,index)=>{ const y=top+index*(item+gap); drawSharedMatchItem(ctx,leftX,y,item,pair,'folded'); answerCaption(ctx,String(index+1),leftX-46,y+item/2); });
    p.results.forEach((result,index)=>{ const y=top+index*(item+gap); drawSharedMatchItem(ctx,rightX,y,item,result,'result',true); answerCaption(ctx,String.fromCharCode(65+index),rightX+item+46,y+item/2); });
    return;
  }
  const size=420, x=60, y=50;
  let value;
  if(p.completeOnUnfold){
    drawSharedPaper(ctx,x,y,size,{folds:p.folds,marks:p.markStages[p.markStages.length-1],answer:true});
    value='펼친 모양';
  }else if(p.interaction==='hole-result'){
    const index=p.choices.findIndex(choice=>choice.key===p.answer);
    drawSharedPaper(ctx,x,y,size,{folds:p.folds,holes:p.choices[index].points,answer:true});
    value=`정답 ${index+1}번`;
  }else{
    drawSharedPaper(ctx,x,y,size,{folds:p.folds,segments:p.unfoldedSegments||[],holes:p.unfoldedPoints||[],answer:true});
    value=p.interaction==='piece-count'?`${p.pieceCount}조각`:`구멍 ${p.unfoldedPoints.length}개`;
  }
  const steps=answerUnfoldSteps(p);
  answerColumn(ctx,[{text:value,px:ANSWER_PX.value,color:ANSWER_GREEN},...(steps.length?[{text:'새 표시가 생기는 쪽',px:ANSWER_PX.min,gap:22},...steps]:[])],x+size+70,260,1270-(x+size+70));
}

/* 정답지 그림을 그린다. 그린 유형이면 true. */
function renderAnswerPicture(ctx,d){
  if(d.kind==='game-reverse') renderReverseGame(ctx,d,true);
  else if(d.kind==='hole') answerHole(ctx,d);
  else if(d.kind==='number'||d.kind==='diag-number') answerNumberGrid(ctx,d);
  else if(d.kind==='num-inverse') answerNumInverse(ctx,d);
  else if(d.kind==='fold-top') answerFoldTop(ctx,d);
  else if(d.kind==='pieces') answerPieces(ctx,d);
  else if(d.kind==='punch') answerPunch(ctx,d);
  else if(d.kind==='unfold-shape') answerUnfoldShape(ctx,d);
  else if(d.kind==='stack') answerStack(ctx,d);
  else if(d.kind==='paper-turn') answerTurn(ctx,d);
  else if(d.kind==='game-level') answerShared(ctx,d);
  else return false;
  ctx.textAlign='left'; ctx.textBaseline='alphabetic';
  return true;
}
