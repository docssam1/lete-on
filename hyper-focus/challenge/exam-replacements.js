(function(root){
  'use strict';
  // Only the two challenge exams consume these additions; source images remain private references.
  const ink='#234660',blue='#2788c4',orange='#ef9e35',green='#63a867',purple='#8865ba';
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text=(x,y,s,size=20)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${ink}" text-anchor="middle" dominant-baseline="middle" stroke="none">${escape(s)}</text>`;
  const path=(d,color=blue,fill='none',width=1.8)=>`<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/>`;
  const rect=(x,y,w,h,fill='#fff',stroke=blue)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
  const svg=(body,w=660,h=220)=>`<svg class="challenge-visual replacement-visual" viewBox="0 0 ${w} ${h}" role="img" aria-label="컬러 수학 문제 그림">${body}</svg>`;
  const conditions=lines=>`<div class="edition-conditions replacement-conditions">${lines.map(l=>`<p>${escape(l)}</p>`).join('')}</div>`;
  const cells=names=>`<table class="edition-table replacement-table"><thead><tr>${names.map(n=>`<th>${escape(n)}</th>`).join('')}</tr></thead><tbody><tr>${names.map(()=>'<td></td>').join('')}</tr></tbody></table>`;
  const numberedBoxes=()=>svg([0,1,2,3,4].map(i=>rect(32+i*123,15,108,43,'#f1f8fc')).join(''),660,76);
  function make(number,typeId,domain,prompt,problemHtml,answer,answerHtml,solution,payload,solutionDiagram=''){
    return {number,typeId,domain,prompt,problemHtml,answer,answerHtml,solution,solutionDiagram,payload:{typeId,...payload},answerCandidates:[answer],replacement:true};
  }
  const triangles=[[[0,0],[1,0],[0,1]],[[1,0],[1,1],[0,1]],[[1,0],[2,1],[1,1]],[[1,0],[2,0],[2,1]],[[2,1],[2,2],[1,2]],[[1,1],[2,1],[1,2]],[[0,1],[1,1],[1,2]],[[0,1],[1,2],[0,2]]];
  function dividedSquare(x,y,s,filled,label=''){
    return triangles.map((t,i)=>`<polygon points="${t.map(([u,v])=>`${x+u*s/2},${y+v*s/2}`).join(' ')}" fill="${filled.includes(i)?blue:'#fff'}" stroke="#6296b6" stroke-width="1"/>`).join('')+(label?text(x+s/2,y+s+20,label,16):'');
  }
  const compound=(x,y,outer,inner,r=33)=>{
    const shape=(kind,radius,color)=>kind==='circle'?`<circle cx="${x}" cy="${y}" r="${radius}" fill="none" stroke="${color}" stroke-width="2.3"/>`:kind==='square'?rect(x-radius/1.414,y-radius/1.414,radius*1.414,radius*1.414,'none',color):path(`M${x} ${y-radius}L${x+radius*.866} ${y+radius/2}H${x-radius*.866}Z`,color);
    return shape(outer,r,blue)+shape(inner,r*(outer==='triangle'?.40:outer==='square'?.59:.70),orange);
  };
  function star(x,y,filled,r=9){
    const points=Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,rr=i%2?r*.44:r;return [x+Math.cos(a)*rr,y+Math.sin(a)*rr];});
    return `<polygon points="${points.map(p=>p.join(',')).join(' ')}" fill="${filled?orange:'#fff'}" stroke="${filled?'#c27821':'#6690ab'}" stroke-width="1.3"/>`;
  }
  function starTile(x,y,filled,label){
    return path(`M${x} ${y-43}L${x+43} ${y}L${x} ${y+43}L${x-43} ${y}Z`,blue,'#f6fbfe')+[[-14,-14],[14,-14],[-14,14],[14,14]].map(([a,b],i)=>star(x+a,y+b,filled.includes(i))).join('')+text(x,y-56,label,17);
  }
  const lineCoords=[[0,0],[2,0],[2,1],[1,1],[1,2],[0,2]];
  const rotate=points=>points.map(([x,y])=>[2-y,x]);
  const reflected=points=>points.map(([x,y])=>[2-x,y]);
  const drawLine=(x,y,points,s=25)=>path('M'+points.map(([a,b])=>`${x+a*s} ${y+b*s}`).join('L'),blue,'none',3);
  function replacements(){
    const r1={},r2={};
    r1[1]=make(1,'replace-house-between','지문이해','다섯 채의 집이 한 줄로 나란히 서 있습니다. 아래 설명을 모두 읽고, 다섯 집 중 한가운데에 있는 집은 누구네 집인지 쓰세요.',
      conditions(['하람이네 집은 유나네 집과 도윤이네 집 사이에 있습니다.','서아네 집은 하람이네 집과 도윤이네 집 사이에 있습니다.','지민이네 집은 유나네 집과 하람이네 집 사이에 있습니다.'])+numberedBoxes(),'하람','하람이네 집',
      '유나네 집부터 놓으면 유나 → 지민 → 하람 → 서아 → 도윤입니다. 반대쪽부터 놓아도 한가운데는 하람이네 집입니다.',
      {people:['하람','유나','도윤','서아','지민'],between:[['하람','유나','도윤'],['서아','하람','도윤'],['지민','유나','하람']]});
    r1[3]=make(3,'replace-count-constraints','수','숲속에서 다람쥐들이 먹이를 모으고 있습니다. 상자에 적힌 설명을 모두 읽고, 다람쥐의 마릿수를 쓰세요.',
      conditions(['다람쥐의 마릿수는 짝수입니다.','8마리보다 많고, 16마리보다 적습니다.','10마리도 아니고, 14마리도 아닙니다.']),12,'12마리',
      '8보다 크고 16보다 작은 짝수는 10, 12, 14입니다. 10과 14는 아니라고 했으므로 다람쥐는 12마리입니다.',{lower:8,upper:16,excluded:[10,14],responseMode:'written'});
    const sequence=[[3,7],[2,6],[0,4],[1,5],[3,7]],answers=[[2,6],[0,4]];
    r1[5]=make(5,'replace-divided-square-cycle','도형','정사각형을 같은 모양의 작은 삼각형 여덟 개로 나누어 색칠하였습니다. 색칠한 부분이 바뀌는 규칙을 찾아, (1)과 (2)의 빈 그림에도 같은 색으로 색칠하세요.',
      svg(sequence.map((s,i)=>dividedSquare(18+i*87,60,64,s)).join('')+dividedSquare(453,60,64,[],'(1)')+dividedSquare(554,60,64,[],'(2)'),660,190),answers,'(1), (2) 색칠은 오른쪽 그림 참고',
      '색칠한 모양 네 개가 한 묶음으로 반복됩니다. (1)은 둘째 그림, (2)는 셋째 그림과 같은 부분을 파란색으로 칠합니다.',{sequence,missingCount:2},svg(dividedSquare(6,5,60,answers[0],'(1)')+dividedSquare(92,5,60,answers[1],'(2)'),165,90));
    r1[16]=make(16,'replace-paper-remainder','지문이해','색종이 22장 중 노란색은 7장이고 파란색은 5장입니다. 나머지는 빨간색과 녹색이며 두 색의 장수가 같습니다. 녹색 색종이 2장을 작품을 만드는 데 썼다면, 녹색 색종이는 몇 장 남습니까?',
      svg([['노란색','#f4c74e'],['파란색',blue],['빨간색','#e56a62'],['녹색',green]].map(([name,c],i)=>rect(65+i*146,35,82,70,c,c)+text(106+i*146,132,name,20)).join('')),3,'3장',
      '빨간색과 녹색은 합해서 22-7-5=10장입니다. 장수가 같으므로 녹색은 5장입니다. 2장을 썼으므로 5-2=3장이 남습니다.',{total:22,known:[7,5],equalColors:2,used:2});
    r1[17]=make(17,'replace-age-chain','지문이해','세 친구의 나이에 대한 설명입니다. 설명을 차례로 연결하여 세 친구의 나이를 알아보고, 다음 두 물음에 답하세요.',
      conditions(['유진이는 5살입니다.','준서는 유진이보다 3살 더 많습니다.','서하는 준서보다 2살 더 많습니다.'])+`<p class="replacement-ask">(1) 세 친구의 지금 나이를 표에 쓰세요.</p>`+cells(['유진','준서','서하'])+`<p class="replacement-ask">(2) 2년 뒤 준서와 서하의 나이의 합은 얼마일까요?</p>`,[[5,8,10],22],'(1) 유진 5살 · 준서 8살 · 서하 10살  (2) 22살',
      '유진은 5살, 준서는 5+3=8살, 서하는 8+2=10살입니다. 2년 뒤에는 준서가 10살, 서하가 12살이므로 합은 22살입니다.',{names:['유진','준서','서하'],baseAge:5,gaps:[3,2],years:2,sumPeople:[1,2]});
    r2[4]=make(4,'replace-student-queue','논리추리','민재, 지안, 도현, 예린 네 친구가 한 줄로 서 있습니다. 아래 설명을 모두 만족하는 순서를 찾아, 가장 앞에 있는 친구부터 왼쪽 칸에 이름을 차례대로 쓰세요.',
      conditions(['지안이는 민재와 도현 사이에 서 있습니다.','예린이는 도현의 바로 뒤에 서 있습니다.','예린이는 가장 뒤에 서 있지 않습니다.'])+`<div class="table-direction">앞 ${cells(['','','',''])} 뒤</div>`,['도현','예린','지안','민재'],'앞부터 도현 → 예린 → 지안 → 민재',
      '민재가 앞에 있으면 민재 → 지안 → 도현 → 예린이 되어 예린이 가장 뒤에 서게 됩니다. 따라서 도현 → 예린 → 지안 → 민재로 서야 합니다.',{people:['민재','지안','도현','예린'],between:['지안','민재','도현'],immediatelyBehind:['예린','도현'],notLast:'예린'});
    const pairs=[['circle','triangle'],['square','circle'],['triangle','square']],matrix=[[0,2,1],[2,1,0],[1,0,null]],options=[['circle','square'],['triangle','circle'],['triangle','square'],['square','circle']];
    r2[8]=make(8,'replace-compound-matrix','도형','큰 상자 안에 도형을 일정한 규칙으로 놓았습니다. 가로줄과 세로줄을 모두 살펴보고, 물음표 자리에 들어갈 그림을 오른쪽 보기에서 찾아 번호에 동그라미 하세요.',
      svg(rect(35,5,252,224,'#fbfdff','#8cacc2')+matrix.map((row,r)=>row.map((p,c)=>p===null?text(77+c*84,44+r*73,'?',32):compound(77+c*84,44+r*73,...pairs[p],34)).join('')).join('')+text(471,18,'보기',18)+options.map((p,i)=>compound(382+i%2*161,80+Math.floor(i/2)*110,...p,35)+text(382+i%2*161,126+Math.floor(i/2)*110,['①','②','③','④'][i],18)).join(''),660,252),3,'③',
      '각 가로줄과 세로줄에 세 종류의 그림이 한 번씩 나옵니다. 마지막 줄과 마지막 세로줄에 빠진 것은 삼각형 안에 정사각형이 있는 그림이므로 ③입니다.',{pairs,matrix,options},svg(compound(44,47,'triangle','square',41),90,92));
    const starCombinations=[[0,3],[0,1],[2,3],[1,3],[0,2]],missingStars=[1,2];
    r2[5]=make(5,'replace-missing-star-combination','도형','별 네 개 중 두 개에 색칠하여 만들 수 있는 서로 다른 그림을 모두 모으려고 합니다. 색칠한 별의 위치가 다르면 다른 그림입니다. 아래 다섯 그림에 없는 한 가지를 찾아, 마지막 빈 틀에 별 네 개를 그리고 알맞게 색칠하세요.',
      svg(starCombinations.map((s,i)=>starTile(60+i*108,105,s,'')).join('')+path('M600 62L643 105L600 148L557 105Z',orange,'#fff'),660,190),missingStars,'오른쪽 위 별과 왼쪽 아래 별에 색칠',
      '두 별을 고르면 위쪽, 아래쪽, 왼쪽, 오른쪽, 두 대각선의 여섯 가지가 나옵니다. 제시된 다섯 그림에는 오른쪽 위 별과 왼쪽 아래 별을 함께 색칠한 그림이 없으므로 마지막 틀에 그립니다.',{slots:4,choose:2,shown:starCombinations},svg(starTile(54,54,missingStars,''),108,108));
    const magicValues=[2,3,4,5,6,7,8],magicPoints=[[330,25],[246,124],[330,124],[414,124],[162,223],[330,223],[498,223]],magicLines=[[0,1,4],[0,3,6],[0,2,5],[1,2,3],[4,5,6]],givens={1:2,2:6};
    r2[10]=make(10,'replace-magic-triangle','수','2부터 8까지의 수를 한 번씩 써서 일곱 원을 채우려고 합니다. 한 직선으로 연결된 세 원의 수의 합이 모두 15가 되도록 빈 원에 수를 쓰세요. 이미 적힌 2와 6은 바꿀 수 없습니다.',
      svg(magicLines.map(ids=>path('M'+ids.map(i=>magicPoints[i].join(' ')).join('L'),'#75a0bb')).join('')+magicPoints.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="23" fill="${givens[i]?'#e6f3fa':'#fff'}" stroke="${givens[i]?blue:orange}" stroke-width="2"/>${givens[i]?text(x,y,givens[i],25):''}`).join(''),660,253),[5,2,6,7,8,4,3],'위 5 / 가운데 줄 2, 6, 7 / 아래 줄 8, 4, 3',
      '가운데 가로줄에서 오른쪽 원은 15-2-6=7입니다. 남은 3, 4, 5, 8을 넣어 다른 네 줄도 합이 15가 되게 하면 위는 5, 아래는 왼쪽부터 8, 4, 3입니다. 다섯 줄의 합을 각각 확인합니다.',{values:magicValues,points:magicPoints,lines:magicLines,target:15,givens});
    const fruitKinds=['apple','pear','berry','orange'];
    const fruitOrder=[0,1,2,3,1,2,0,3,1,2,3,1,0,2,1,0,2,3,0,1];
    const fruits=fruitOrder.map((k,i)=>`<svg x="${46+i%5*121}" y="${Math.floor(i/5)*55}" width="57" height="57" viewBox="${k===3?0:k*512} ${k===3?512:0} 512 512" overflow="hidden"><image href="assets/exam-objects-illustration.png" width="1536" height="1024"/></svg>`).join('');
    r2[11]=make(11,'replace-fruit-pair-cancel','논리추리','과일 20개가 놓여 있습니다. 같은 종류의 과일을 두 개씩 짝지어 지우려고 합니다. 더 이상 짝을 지을 수 없을 때 남는 과일은 두 개입니다. 남는 과일의 이름 두 가지를 쓰세요.',
      svg(fruits,660,227),['사과','딸기'],'사과, 딸기',
      '사과는 5개, 배는 6개, 딸기는 5개, 귤은 4개입니다. 두 개씩 지우면 사과와 딸기가 각각 한 개씩 남고, 배와 귤은 모두 없어집니다.',{kinds:fruitKinds,order:fruitOrder});
    const orientations=[lineCoords];for(let i=1;i<4;i++)orientations.push(rotate(orientations[i-1]));
    const lineOptions=[reflected(lineCoords),orientations[2],orientations[1],lineCoords],lineExamples=Array.from({length:9},(_,i)=>orientations[i%4]);
    r2[14]=make(14,'replace-line-rotation-series','도형','선으로 만든 도형을 일정한 규칙에 따라 늘어놓았습니다. 같은 규칙으로 계속 늘어놓을 때, 18번째에 올 도형을 보기에서 찾아 번호에 동그라미 하세요.',
      svg(lineExamples.map((p,i)=>drawLine(20+i*67,20,p,20)+text(40+i*67,81,i+1,16)).join('')+text(634,44,'…',27)+text(330,113,'보기',18)+lineOptions.map((p,i)=>drawLine(76+i*155,147,p,24)+text(100+i*155,222,['①','②','③','④'][i],20)).join(''),660,241),3,'③',
      '도형은 오른쪽으로 한 번씩 돌아가며 네 가지 모양이 반복됩니다. 1~4번째와 같은 묶음이 5~8번째, 9~12번째, 13~16번째에 나옵니다. 18번째는 다음 묶음의 둘째이므로 처음의 둘째 모양인 ③입니다.',{examples:lineExamples,options:lineOptions,targetPosition:18},svg(drawLine(15,10,orientations[1],27),85,80));
    return {1:r1,2:r2};
  }
  function apply(exam){
    const edits=replacements()[exam.round];
    return {...exam,editionId:exam.editionId+'-color-intake-v1',questions:exam.questions.map(q=>edits[q.number]||q),replacementNumbers:Object.keys(edits).map(Number)};
  }
  const api=Object.freeze({apply});root.HFChallengeReplacements=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
