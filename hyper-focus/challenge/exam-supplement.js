(function(root){
  'use strict';
  const blue='#2788c4',ink='#234660',orange='#e99a31',green='#61a56a';
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const text=(x,y,s,size=20)=>`<text x="${x}" y="${y}" fill="${ink}" font-size="${size}" text-anchor="middle" dominant-baseline="middle" stroke="none">${esc(s)}</text>`;
  const rect=(x,y,w,h,fill='white')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="${blue}" stroke-width="1.5"/>`;
  const line=(x,y,u,v,color=ink,width=1.8)=>`<path d="M${x} ${y}L${u} ${v}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"/>`;
  const svg=(body,w=660,h=220)=>`<svg class="challenge-visual supplement-visual" viewBox="0 0 ${w} ${h}" role="img" aria-label="추가 연습 컬러 문제 그림">${body}</svg>`;
  const sprite=(kind,x,y,size=38)=>{const k={apple:0,pear:1,berry:2,orange:3}[kind];return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${k%3*512} ${Math.floor(k/3)*512} 512 512" overflow="hidden"><image href="assets/exam-objects-illustration.png" width="1536" height="1024"/></svg>`;};
  const conditions=items=>`<div class="edition-conditions supplement-conditions">${items.map(s=>`<p>${esc(s)}</p>`).join('')}</div>`;
  const make=(number,id,domain,prompt,problemHtml,answer,answerHtml,solution,payload,solutionDiagram='')=>({number,typeId:'extra-'+id,domain,prompt,problemHtml,answer,answerHtml,solution,solutionDiagram,payload:{kind:id,...payload}});
  function shape(x,y,kind,r,color=blue){
    if(kind==='circle')return `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${color}" stroke-width="2.4"/>`;
    if(kind==='square')return rect(x-r*.72,y-r*.72,r*1.44,r*1.44).replace(`stroke="${blue}"`,`stroke="${color}"`).replace('fill="white"','fill="none"');
    return `<path d="M${x} ${y-r}L${x+r*.87} ${y+r*.5}H${x-r*.87}Z" fill="none" stroke="${color}" stroke-width="2.4"/>`;
  }
  const nested=(x,y,outer,inner,r=32)=>shape(x,y,outer,r)+shape(x,y,inner,outer==='triangle'?r*.38:r*.55,orange);
  const arrow=(x,y)=>`<path d="M${x} ${y-3}h29v-5l12 8-12 8v-5h-29Z" fill="white" stroke="${ink}" stroke-width="1.5"/>`;
  function orchard(apples,berries,regions){
    let art='';const ox=229,oy=10,s=47;
    for(let i=0;i<16;i++){
      const x=ox+i%4*s,y=oy+Math.floor(i/4)*s;
      const group=regions?.findIndex(r=>r.includes(i));
      art+=rect(x,y,s,s,regions?['#d5ebfb','#fce5bd','#dfeeda','#e8ddf5'][group]:'white');
      if(apples.includes(i))art+=sprite('apple',x+5,y+5,s-10);
      if(berries.includes(i))art+=sprite('berry',x+5,y+5,s-10);
    }
    if(regions)for(let y=0;y<4;y++)for(let x=0;x<4;x++){
      const i=y*4+x,g=regions.findIndex(r=>r.includes(i));
      if(x<3&&regions.findIndex(r=>r.includes(i+1))!==g)art+=line(ox+(x+1)*s,oy+y*s,ox+(x+1)*s,oy+(y+1)*s,ink,3);
      if(y<3&&regions.findIndex(r=>r.includes(i+4))!==g)art+=line(ox+x*s,oy+(y+1)*s,ox+(x+1)*s,oy+(y+1)*s,ink,3);
    }
    const result=svg(art,660,208);
    return regions?result.replace('viewBox="0 0 660 208"','viewBox="218 0 210 208"'):result;
  }
  const segmentCoordinates={a:[0,0,22,0],b:[22,0,22,26],c:[22,26,22,52],d:[0,52,22,52],e:[0,26,0,52],f:[0,0,0,26],g:[0,26,22,26]};
  const digitSegments=['ab cdef'.replace(/ /g,''),'bc','abged','abgcd','fgbc','afgcd','afgecd','abc','abcdefg','abfgcd'];
  function digitalToken(token,x,y){
    if(token==='blank')return rect(x,y-7,68,68);
    if(token==='+'||token==='=')return line(x,y+23, x+28,y+23,ink,3)+(token==='+'?line(x+14,y+9,x+14,y+37,ink,3):line(x,y+34,x+28,y+34,ink,3));
    return String(token).split('').map((d,i)=>`<g transform="translate(${x+i*34} ${y})">${[...digitSegments[Number(d)]].map(k=>line(...segmentCoordinates[k],blue,4)).join('')}</g>`).join('');
  }
  function digitalEquation(tokens,y){
    const widths=tokens.map(t=>t==='blank'?68:t==='+'||t==='='?28:String(t).length*34-12),total=widths.reduce((s,n)=>s+n,0)+24*(tokens.length-1);
    let x=(660-total)/2;
    return `<g class="reflected-equation" transform="translate(660 0) scale(-1 1)">${tokens.map((t,i)=>{const part=digitalToken(t,x,y);x+=widths[i]+24;return part;}).join('')}</g>`;
  }
  function balance(x,left,right,tilt){
    const renderer=root.HFChallengeBalance||(typeof require==='function'?require('./balance-diagram.js'):null);
    return renderer.render(x+4,210,[left],right,tilt);
  }
  function patternShape(x,y,kind,color){
    if(kind==='star'){const pts=Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,r=i%2?10:23;return [x+Math.cos(a)*r,y+Math.sin(a)*r].join(',');});return `<polygon points="${pts.join(' ')}" fill="${color}"/>`;}
    return shape(x,y,kind,23,color).replace('fill="none"',`fill="${color}"`);
  }
  function codeTile(n,x,y,label){
    let art=`<circle cx="${x+32}" cy="${y+12}" r="11" stroke="${blue}" stroke-width="1.4" fill="${n>=5?blue:'white'}"/>`;
    for(let i=0;i<4;i++)art+=rect(x+i*16,y+30,16,19,i<n%5?blue:'white').replace(`stroke="${blue}"`,'stroke="#536c7e"');
    return art+(label===undefined?'':text(x+32,y+67,label,17));
  }
  function get(round){
    const q=[];
    if(round===1){
      const options=[124,82,28,64,46,57,68,93];
      q.push(make(1,'digit-multiselect','수','수 카드에 여러 수가 적혀 있습니다. 상자에 적힌 설명을 모두 만족하는 수를 빠짐없이 찾아, 해당하는 카드에 모두 동그라미 하세요.',conditions(['두 자리 수입니다.','짝수입니다.','일의 자리 숫자가 십의 자리 숫자보다 큽니다.'])+svg(options.map((n,i)=>rect(18+i*80,10,66,43,'#f1f8fc')+text(51+i*80,33,n,24)).join(''),660,64),[28,46,68],'28, 46, 68','124는 세 자리 수이고 57, 93은 홀수입니다. 남은 짝수 중 28, 46, 68만 일의 자리 숫자가 십의 자리 숫자보다 큽니다.',{options}));
      q.push(make(2,'difference-equation-count','수','1부터 9까지의 수 카드 중 서로 다른 두 장을 골라 한 자리 수의 뺄셈식을 만들려고 합니다. 다음 조건에 맞는 뺄셈식은 각각 모두 몇 개 만들 수 있는지 구하세요.',svg(Array.from({length:9},(_,i)=>rect(29+i*68,12,52,46)+text(55+i*68,36,i+1,25)).join('')+text(330,104,'(1) 두 수의 차가 3인 뺄셈식',20)+text(330,165,'(2) 두 수의 차가 5인 뺄셈식',20),660,193),[6,4],'(1) 6개  (2) 4개','(1) 4−1, 5−2, 6−3, 7−4, 8−5, 9−6의 6개입니다. (2) 6−1, 7−2, 8−3, 9−4의 4개입니다. 두 수의 자리를 바꾸면 양의 차가 되지 않으므로 더 세지 않습니다.',{cards:[1,2,3,4,5,6,7,8,9],differences:[3,5]}));
      q.push(make(3,'weight-order','논리추리','같은 종류의 과일은 무게가 서로 같습니다. 아래 세 저울을 모두 살펴보고, 사과·배·딸기·귤 중 가장 무거운 과일과 가장 가벼운 과일의 이름을 각각 쓰세요.',svg(balance(0,'apple',['pear'],12)+balance(220,'pear',['berry','berry'],0)+balance(440,'orange',['apple'],12)+text(210,203,'(1) 가장 무거운 과일',19)+text(481,203,'(2) 가장 가벼운 과일',19),660,231),['귤','딸기'],'(1) 귤  (2) 딸기','내려간 쪽이 더 무겁습니다. 사과는 배보다, 귤은 사과보다 무겁습니다. 배 한 개는 딸기 두 개와 같으므로 딸기 한 개보다 무겁습니다. 무거운 순서는 귤 → 사과 → 배 → 딸기입니다.',{relations:[['apple','>', 'pear'],['pear','=',2,'berry'],['orange','>','apple']]}));
      const apples=[0,6,8,14],berries=[2,5,10,11],parts=[[0,1,2,4],[3,5,6,7],[8,9,10,12],[11,13,14,15]];
      q.push(make(4,'congruent-partition','도형','과일 그림이 있는 정사각형을 같은 모양의 네 부분으로 나누려고 합니다. 각 부분에 사과와 딸기가 하나씩 들어가도록 칸의 선을 따라 굵은 선을 그으세요. 나눈 모양은 돌리거나 뒤집어서 겹쳐도 됩니다.',orchard(apples,berries),parts,'오른쪽 그림과 같이 네 부분으로 나누기','각 부분은 작은 정사각형 4칸으로 이루어지며, 세 칸이 나란하고 끝에 한 칸이 붙은 같은 모양입니다. 네 부분을 돌리거나 뒤집으면 겹칩니다. 각 부분의 사과와 딸기는 하나씩입니다.',{size:4,apples,berries},orchard(apples,berries,parts)));
      const analogyOptions=[['triangle','square'],['square','circle'],['square','triangle'],['circle','triangle']];
      q.push(make(5,'inside-outside-analogy','도형','왼쪽 도형이 오른쪽 도형으로 바뀌고 있습니다. 위의 두 예에서 같은 변화를 찾아, 아래 물음표 자리에 들어갈 그림을 보기에서 고르고 번호에 동그라미 하세요.',svg(nested(80,48,'circle','triangle')+arrow(130,48)+nested(216,48,'triangle','circle')+nested(410,48,'square','circle')+arrow(460,48)+nested(546,48,'circle','square')+nested(80,151,'triangle','square')+arrow(130,151)+text(215,151,'?',37)+analogyOptions.map(([a,b],i)=>nested(331+i*84,143,a,b,29)+text(331+i*84,191,['①','②','③','④'][i],17)).join(''),660,220),3,'③','바깥 도형과 안쪽 도형의 자리를 서로 바꿉니다. 바깥의 삼각형이 안으로 들어가고 안쪽의 정사각형이 밖으로 나오므로 ③입니다.',{outer:'triangle',inner:'square',options:analogyOptions}));
      const equations=[[13,'+','blank','=',42],[25,'+',12,'=','blank']];
      q.push(make(6,'digital-mirror','도형','디지털 숫자로 쓴 두 식을 오른쪽에서 거울에 비추어 본 모습입니다. 거울에 비치기 전의 식을 생각하여 두 빈칸에 들어갈 원래 수를 구하고, 그 두 수의 합을 쓰세요.',svg(equations.map((tokens,i)=>digitalEquation(tokens,20+i*105)).join(''),660,205),66,'66','거울에 비치기 전의 식은 13+□=42와 25+12=□입니다. 첫째 빈칸은 42−13=29, 둘째 빈칸은 25+12=37입니다. 두 수의 합은 29+37=66입니다.',{equations,missing:[29,37]}));
    }else if(round===2){
      q.push(make(1,'maximum-under-conditions','수','숫자 카드에 적힌 수를 세 문장으로 설명했습니다. 설명을 모두 만족하는 수가 여러 개일 때, 그중 가장 큰 수를 쓰세요.',conditions(['27보다 크고 48보다 작습니다.','35보다 크고 44보다 작습니다.','짝수입니다.']),42,'42','두 범위를 모두 만족하는 짝수는 36, 38, 40, 42입니다. 이 중 가장 큰 수는 42입니다.',{lower:[27,35],upper:[48,44],parity:0}));
      const equations=[['blank','+',8,25],[32,'-','blank',18],['blank','-',7,12],[9,'+','blank',25],[28,'-','blank',13]];
      q.push(make(2,'smallest-equation-blank','수','다섯 식의 빈칸에는 각각 알맞은 수가 들어갑니다. 빈칸에 들어갈 수를 비교하여 가장 작은 수가 들어가는 식을 찾고, 그 번호에 동그라미 하세요.',svg(equations.map((e,i)=>{const x=i<3?24+i*221:135+(i-3)*255,y=i<3?35:135;return text(x+9,y,['①','②','③','④','⑤'][i],19)+text(x+114,y,e.slice(0,3).map(s=>s==='blank'?'□':s==='-'?'−':s).join(' ')+' = '+e[3],23);}).join(''),660,195),2,'②','① 17, ② 14, ③ 19, ④ 16, ⑤ 15입니다. 이 중 가장 작은 수는 14이므로 ②입니다.',{equations}));
      const targets=[4,7,11,14],pairs=[[1,3],[2,5],[4,7],[6,8]];
      q.push(make(3,'card-distribution','논리추리','1부터 8까지의 수 카드 여덟 장을 네 상자에 두 장씩 나누어 넣으려고 합니다. 각 상자에 들어간 두 수의 합이 상자 위에 적힌 수가 되도록 빈칸에 수를 쓰세요. 카드는 한 번씩만 사용합니다.',svg(Array.from({length:8},(_,i)=>rect(35+i*75,6,52,43)+text(61+i*75,29,i+1,23)).join('')+targets.map((t,i)=>text(89+i*163,92,'합 '+t,20)+rect(22+i*163,113,134,71,'#f1f8fc')+rect(35+i*163,127,46,42)+rect(97+i*163,127,46,42)).join(''),660,201),pairs,'합 4: 1·3 / 합 7: 2·5 / 합 11: 4·7 / 합 14: 6·8','합이 4인 서로 다른 두 수는 1과 3, 합이 14인 두 수는 6과 8입니다. 남은 2, 4, 5, 7 중 합이 7인 것은 2와 5이며, 4와 7은 합이 11입니다. 같은 상자 안에서 두 수의 순서를 바꾸어 써도 맞습니다.',{cards:[1,2,3,4,5,6,7,8],targets}));
      const points=[[1,2],[3,2],[4,0],[0,0],[2,0],[.5,1],[1.5,1],[2.5,1],[3.5,1]],edges=[[0,1],[1,2],[2,3],[3,0],[0,4],[1,4],[5,8]];
      q.push(make(4,'general-quadrilateral-count','도형','종이에 사다리꼴을 그리고 그 안에 선을 더 그었습니다. 그림에 그어진 선만 따라 만들 수 있는 크고 작은 사각형은 모두 몇 개인지 구하세요. 여러 부분을 합쳐서 만든 사각형도 셉니다.',svg(edges.map(([a,b])=>line(178+points[a][0]*77,190-points[a][1]*80,178+points[b][0]*77,190-points[b][1]*80,blue,2.3)).join(''),660,210),12,'12개','맨 위 가로선과 가운데 가로선 사이에 4개, 가운데 가로선과 맨 아래 가로선 사이에 5개, 맨 위 가로선과 맨 아래 가로선 사이에 3개입니다. 모두 4+5+3=12개입니다.',{points,segments:edges.map(([a,b])=>[points[a],points[b]])}));
      const shapes=['star','circle','triangle','square'],colors=[orange,blue,green];
      q.push(make(5,'independent-color-shape-period','논리추리','모양과 색이 각각 일정한 규칙으로 바뀌며 그림이 이어집니다. 아래 순서가 계속된다고 할 때, 다음 두 물음에 답하세요.',svg(Array.from({length:12},(_,i)=>patternShape(28+i*54,43,shapes[i%4],colors[i%3])).join('')+text(330,108,'(1) 20번째 그림의 색과 모양을 쓰세요.',20)+text(330,166,'(2) 28번째까지 초록색 삼각형은 모두 몇 개일까요?',20),660,201),['파란색 정사각형',3],'(1) 파란색 정사각형  (2) 3개','모양은 별·원·삼각형·정사각형이 4개씩, 색은 주황·파랑·초록이 3개씩 반복됩니다. 20번째는 파란색 정사각형입니다. 초록색 삼각형은 3, 15, 27번째에 있으므로 28번째까지 3개입니다.',{shapes,colors:['주황색','파란색','초록색'],position:20,through:28,targetShape:'triangle',targetColor:2}));
      q.push(make(6,'circle-bar-code','수','원과 네 칸의 색칠을 이용하여 수를 나타냈습니다. 위쪽 그림에서 수를 나타내는 규칙을 찾고, 아래 ㉠과 ㉡이 나타내는 두 수의 합을 쓰세요.',svg(Array.from({length:8},(_,n)=>codeTile(n,13+n*81,0,n)).join('')+codeTile(8,195,117,'㉠')+codeTile(9,399,117,'㉡'),660,201),17,'17','색칠한 원은 5, 색칠한 막대 한 칸은 1을 나타냅니다. ㉠은 5+3=8, ㉡은 5+4=9입니다. 두 수의 합은 8+9=17입니다.',{examples:Array.from({length:8},(_,n)=>({circle:Number(n>=5),bars:n%5,value:n})),shown:[{circle:1,bars:3},{circle:1,bars:4}]}));
    }else throw new Error('지원하지 않는 회차');
    return {round,title:'추가 연습',questions:q};
  }
  const priority=root.HFChallengePriority||(typeof require==='function'?require('./exam-priority.js'):null);
  const api=Object.freeze({get:round=>{if([3,4].includes(Number(round))){const more=root.HFChallengeMore||(typeof require==='function'?require('./exam-more.js'):null);if(!more)throw new Error('추가 연습을 불러오지 못했습니다.');return more.get(Number(round),'extra');}if(!priority)throw new Error('우선 보완 문항을 불러오지 못했습니다.');return priority.apply(get(round),'extra');},getPrevious:get});root.HFChallengeSupplement=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
