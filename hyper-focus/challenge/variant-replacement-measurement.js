(function(root){
  'use strict';

  const VERSION='replacement-measurement-20260911-v1';
  const STAGE='6세 / 유치원';
  const LEVELS=Object.freeze(['easy','same','hard']);
  const KINDS=Object.freeze(['balance-substitution-pictures','object-length-equivalence']);
  const NOTES=Object.freeze({
    'balance-substitution-pictures':Object.freeze([
      '모양 하나를 하트로 한 번 바꾸어 마지막 저울 완성',
      '두 모양의 관계를 차례로 하트로 바꾸어 마지막 저울 완성',
      '세 모양의 관계를 차례로 연결하고 묶음을 더해 마지막 저울 완성'
    ]),
    'object-length-equivalence':Object.freeze([
      '지우개를 클립으로 한 번 바꾸어 연필 길이 찾기',
      '지우개 두 개를 클립으로 바꾸고 양쪽의 같은 클립 정리',
      '지우개 세 개를 클립으로 바꾸고 연필 두 자루의 길이를 반으로 나누기'
    ])
  });

  const clone=value=>JSON.parse(JSON.stringify(value));
  const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  const freeze=value=>{if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
  function rng(seed){let state=seed>>>0;return(lo,hi)=>{state+=0x6d2b79f5;let value=state;value=Math.imul(value^(value>>>15),value|1);value^=value+Math.imul(value^(value>>>7),value|61);return lo+Math.floor(((value^(value>>>14))>>>0)/4294967296*(hi-lo+1));};}
  function shuffled(values,random){const copy=values.slice();for(let index=copy.length-1;index>0;index--){const other=random(0,index);[copy[index],copy[other]]=[copy[other],copy[index]];}return copy;}
  const svg=(body,height,label)=>`<svg class="challenge-visual variant-visual replacement-measurement-visual" data-measurement-visual="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 ${height}" role="img" aria-label="${esc(label)}" style="width:100%;height:auto;max-height:none;font-family:'Malgun Gothic',sans-serif"><title>${esc(label)}</title>${body}</svg>`;
  const text=(x,y,value,size=17,color='#203b54',weight=600)=>`<text x="${x}" y="${y}" fill="${color}" text-anchor="middle" dominant-baseline="middle" font-size="${size}" font-weight="${weight}">${esc(value)}</text>`;
  const line=(x1,y1,x2,y2,color='#5c7484',width=1.8,dash='')=>`<path d="M${x1} ${y1}L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;
  const rect=(x,y,width,height,fill='#fff',stroke='#77909e',radius=8)=>`<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="1.3"/>`;
  const positiveEntries=terms=>Object.entries(terms).filter(([,count])=>Number.isInteger(count)&&count>0);
  const termTotal=(terms,values)=>positiveEntries(terms).reduce((total,[key,count])=>total+values[key]*count,0);

  function supports(source){return !!source&&!!source.payload&&KINDS.includes(source.payload.kind);}
  function levels(source){const supported=supports(source);return {easy:supported,same:supported,hard:supported};}
  function notes(source){const list=NOTES[source?.payload?.kind];return list?list.slice():[];}

  const BALANCE_POOLS={easy:[],same:[],hard:[]};
  for(let a=2;a<=5;a++)for(let aCount=1;aCount<=2;aCount++)for(let extra=1;extra<=4;extra++){
    BALANCE_POOLS.easy.push({a,aCount,extra});
  }
  for(let a=2;a<=5;a++)for(let multiple=2;multiple<=3;multiple++)for(let aCount=1;aCount<=2;aCount++)for(let extra=0;extra<=2;extra++){
    BALANCE_POOLS.same.push({a,multiple,aCount,extra});
  }
  for(let a=2;a<=4;a++)for(let multiple=2;multiple<=3;multiple++)for(let offset=1;offset<=2;offset++)for(let extra=0;extra<=2;extra++){
    BALANCE_POOLS.hard.push({a,multiple,offset,extra});
  }

  const LENGTH_POOLS={easy:[],same:[],hard:[]};
  for(let eraser=2;eraser<=5;eraser++)for(let common=0;common<=2;common++)for(let difference=1;difference<=4;difference++){
    LENGTH_POOLS.easy.push({eraser,common,difference});
  }
  for(let eraser=2;eraser<=5;eraser++)for(let common=0;common<=2;common++)for(let difference=1;difference<=3;difference++){
    LENGTH_POOLS.same.push({eraser,common,difference});
  }
  for(let eraser=2;eraser<=5;eraser++)for(let common=0;common<=3;common++)for(let difference=0;difference<=5;difference++){
    if((3*eraser+difference)%2===0)LENGTH_POOLS.hard.push({eraser,common,difference});
  }

  const SHAPE_STYLES=Object.freeze([
    Object.freeze({kind:'circle',label:'파란 동그라미',color:'#62a9c6'}),
    Object.freeze({kind:'square',label:'노란 네모',color:'#e5bd59'}),
    Object.freeze({kind:'diamond',label:'초록 마름모',color:'#76aa79'}),
    Object.freeze({kind:'star',label:'보라 별',color:'#9a7bb5'})
  ]);
  const HEART=Object.freeze({key:'H',kind:'heart',label:'하트',color:'#e999aa'});

  function balanceObjects(count,random){
    return [HEART,...shuffled(SHAPE_STYLES,random).slice(0,count).map((style,index)=>({...style,key:['A','B','C'][index]}))];
  }

  function balanceModel(difficulty,seed){
    const spec=BALANCE_POOLS[difficulty][seed%BALANCE_POOLS[difficulty].length];
    const random=rng((seed^0x9e3779b9)>>>0);
    let values,equations,query,reasoningSteps;
    if(difficulty==='easy'){
      values={H:1,A:spec.a};
      equations=[{left:{A:1},right:{H:spec.a}}];
      query={left:{A:spec.aCount,H:spec.extra},targetKey:'H'};
      reasoningSteps=1;
    }else if(difficulty==='same'){
      values={H:1,A:spec.a,B:spec.a*spec.multiple};
      equations=[{left:{A:1},right:{H:spec.a}},{left:{B:1},right:{A:spec.multiple}}];
      query={left:{B:1,A:spec.aCount,H:spec.extra},targetKey:'H'};
      reasoningSteps=2;
    }else{
      values={H:1,A:spec.a,B:spec.a*spec.multiple+spec.offset};
      values.C=values.B+values.A;
      equations=[
        {left:{A:1},right:{H:spec.a}},
        {left:{B:1},right:{A:spec.multiple,H:spec.offset}},
        {left:{C:1},right:{B:1,A:1}}
      ];
      query={left:{C:1,B:1,H:spec.extra},targetKey:'H'};
      reasoningSteps=3;
    }
    const answer=termTotal(query.left,values);
    return {objects:balanceObjects(Object.keys(values).length-1,random),equations,query,values,answer,reasoningSteps};
  }

  function tokenShape(object,cx,cy,size=9){
    const common=`fill="${object.color}" stroke="#657681" stroke-width="1.1"`;
    if(object.kind==='heart')return `<path d="M${cx} ${cy+size*.72}C${cx-size*1.38} ${cy-size*.18} ${cx-size*1.22} ${cy-size*1.35} ${cx} ${cy-size*.66}C${cx+size*1.22} ${cy-size*1.35} ${cx+size*1.38} ${cy-size*.18} ${cx} ${cy+size*.72}Z" ${common}/>`;
    if(object.kind==='square')return `<rect x="${cx-size}" y="${cy-size}" width="${size*2}" height="${size*2}" rx="2" ${common}/>`;
    if(object.kind==='diamond')return `<polygon points="${cx},${cy-size*1.25} ${cx+size*1.12},${cy} ${cx},${cy+size*1.25} ${cx-size*1.12},${cy}" ${common}/>`;
    if(object.kind==='star'){
      const points=Array.from({length:10},(_,index)=>{const angle=index*Math.PI/5-Math.PI/2,radius=index%2?size*.48:size*1.2;return `${cx+Math.cos(angle)*radius},${cy+Math.sin(angle)*radius}`;}).join(' ');
      return `<polygon points="${points}" ${common}/>`;
    }
    return `<circle cx="${cx}" cy="${cy}" r="${size}" ${common}/>`;
  }

  function balanceSide(terms,cx,cy,objectByKey,unknown){
    if(unknown){
      const heart=objectByKey.H;
      return `<g class="balance-query-hearts" aria-label="하트를 몇 개 놓을지 묻는 접시">${tokenShape(heart,cx-16,cy,10)}${text(cx+17,cy+1,'?개',17,'#9b4d61',800)}</g>`;
    }
    const groups=positiveEntries(terms).map(([key,count])=>({key,count,width:count<=5?count*18:48}));
    const width=groups.reduce((total,group)=>total+group.width,0)+Math.max(0,groups.length-1)*7;
    let x=cx-width/2;
    return groups.map(group=>{
      const object=objectByKey[group.key],body=[];
      if(group.count<=5){for(let index=0;index<group.count;index++)body.push(tokenShape(object,x+9+index*18,cy,8.5));}
      else{body.push(tokenShape(object,x+10,cy,9),text(x+32,cy+1,'×'+group.count,13,'#344f62',700));}
      const result=`<g class="balance-object-group" data-object-key="${esc(group.key)}" data-count="${group.count}" aria-label="${esc(object.label)} ${group.count}개">${body.join('')}</g>`;
      x+=group.width+7;
      return result;
    }).join('');
  }

  function balanceScale(equation,index,cx,top,objectByKey,solution,answer){
    const query=!!equation.query,beamY=top+76,leftX=cx-78,rightX=cx+78,panY=top+55;
    const rightTerms=query?(solution?{H:answer}:{}):equation.right;
    let body=`<g class="measurement-balance${query?' final-balance':''}" data-balance-index="${index+1}" data-query="${query?'true':'false'}" aria-label="${query?'마지막 하트 저울':'수평 저울 '+(index+1)}">`;
    body+=rect(cx-148,top,296,126,query?'#fff8f5':'#f8fbfc',query?'#d89aa5':'#c8d7de',10);
    body+=text(cx,top+15,query?'마지막 저울':'저울 '+(index+1),13,query?'#9b4d61':'#526c7a',800);
    body+=line(cx-108,beamY,cx+108,beamY,'#617985',2.4)+line(leftX,beamY,leftX,panY+11,'#617985',1.4)+line(rightX,beamY,rightX,panY+11,'#617985',1.4);
    body+=line(leftX-49,panY+11,leftX+49,panY+11,'#617985',2)+line(rightX-49,panY+11,rightX+49,panY+11,'#617985',2);
    body+=`<polygon points="${cx},${beamY+1} ${cx-11},${top+111} ${cx+11},${top+111}" fill="#dfe8ec" stroke="#617985" stroke-width="1.3"/>`+line(cx-31,top+112,cx+31,top+112,'#617985',2);
    body+=balanceSide(equation.left,leftX,top+45,objectByKey,false);
    body+=balanceSide(rightTerms,rightX,top+45,objectByKey,query&&!solution);
    if(query&&solution)body+=text(rightX,top+24,'하트 '+answer+'개',12,'#1f625e',800);
    return body+'</g>';
  }

  function balanceSvg(model,solution){
    const equations=[...model.equations,{left:model.query.left,right:{},query:true}];
    const objectByKey=Object.fromEntries(model.objects.map(object=>[object.key,object]));
    const positions=equations.length===2?[[170,12],[490,12]]:equations.length===3?[[170,10],[490,10],[330,150]]:[[170,10],[490,10],[170,150],[490,150]];
    const height=equations.length===2?150:286;
    const body=equations.map((equation,index)=>balanceScale(equation,index,positions[index][0],positions[index][1],objectByKey,solution,model.answer)).join('');
    return svg(body,height,solution?'앞 저울의 관계로 마지막 접시에 하트를 놓은 풀이':'여러 수평 저울의 관계를 보고 마지막 접시에 놓을 하트 수를 찾는 그림');
  }

  function balanceSolution(model){
    const label=Object.fromEntries(model.objects.map(object=>[object.key,object.label]));
    const parts=[];
    const values={H:1};
    for(const equation of model.equations){
      const unknown=positiveEntries(equation.left).find(([key])=>values[key]===undefined)?.[0];
      const rightTerms=positiveEntries(equation.right);
      const right=termTotal(equation.right,model.values);
      const knownLeft=positiveEntries(equation.left).filter(([key])=>key!==unknown).reduce((total,[key,count])=>total+model.values[key]*count,0);
      const count=equation.left[unknown];
      values[unknown]=(right-knownLeft)/count;
      if(rightTerms.length===1&&rightTerms[0][0]==='H')parts.push(`${label[unknown]} ${count}개는 하트 ${right}개와 같습니다.`);
      else{
        const shown=rightTerms.map(([key,itemCount])=>`${label[key]} ${itemCount}개`).join('와 ');
        const converted=rightTerms.map(([key,itemCount])=>model.values[key]*itemCount);
        parts.push(`${label[unknown]} ${count}개는 ${shown}와 같습니다. 앞에서 찾은 하트 수로 바꾸면 ${converted.join('+')}=${right}개이므로 ${label[unknown]} 1개는 하트 ${values[unknown]}개와 같습니다.`);
      }
    }
    const additions=positiveEntries(model.query.left).map(([key,count])=>model.values[key]*count);
    parts.push(`마지막 왼쪽 접시를 하트로 바꾸면 ${additions.join('+')}=${model.answer}개입니다. 따라서 오른쪽 접시에 하트 ${model.answer}개를 놓습니다.`);
    return parts.join(' ');
  }

  function makeBalanceQuestion(source,difficulty,seed){
    const model=balanceModel(difficulty,seed);
    return {
      prompt:'앞의 양팔저울은 모두 수평입니다. 앞의 관계를 차례로 바꾸어 마지막 저울의 오른쪽 접시에 하트를 몇 개 놓아야 하는지 쓰세요.',
      problemHtml:balanceSvg(model,false),
      solutionDiagram:balanceSvg(model,true),
      answer:model.answer,
      answerHtml:model.answer+'개',
      solution:balanceSolution(model),
      payload:{
        kind:'balance-substitution-pictures',
        objects:clone(model.objects),
        equations:clone(model.equations),
        query:clone(model.query),
        reasoningSteps:model.reasoningSteps,
        responseMode:'heart-count'
      }
    };
  }

  function lengthModel(difficulty,seed){
    const spec=LENGTH_POOLS[difficulty][seed%LENGTH_POOLS[difficulty].length];
    let pencil,eraserCount,relationships,reasoningSteps;
    if(difficulty==='easy'){
      pencil=spec.eraser+spec.difference;eraserCount=1;reasoningSteps=2;
      relationships=[
        {left:{E:1},right:{C:spec.eraser}},
        {left:{P:1,C:spec.common},right:{E:1,C:spec.common+spec.difference}}
      ];
    }else if(difficulty==='same'){
      pencil=2*spec.eraser+spec.difference;eraserCount=2;reasoningSteps=3;
      relationships=[
        {left:{E:1},right:{C:spec.eraser}},
        {left:{P:1,C:spec.common},right:{E:2,C:spec.common+spec.difference}}
      ];
    }else{
      pencil=(3*spec.eraser+spec.difference)/2;eraserCount=3;reasoningSteps=4;
      relationships=[
        {left:{E:1},right:{C:spec.eraser}},
        {left:{P:2,C:spec.common},right:{E:3,C:spec.common+spec.difference}}
      ];
    }
    const objects=[
      {key:'P',kind:'pencil',label:'연필',color:'#58a1be'},
      {key:'E',kind:'eraser',label:'지우개',color:'#ed9cad'},
      {key:'C',kind:'clip',label:'클립',color:'#497d98'}
    ];
    const values={P:pencil,E:spec.eraser,C:1};
    for(const relation of relationships){if(termTotal(relation.left,values)!==termTotal(relation.right,values))throw Error('길이 관계 생성 검산에 실패했습니다.');}
    return {objects,relationships,query:{objectKey:'P',unitKey:'C',objectCount:1},values,answer:pencil,eraserCount,common:spec.common,difference:spec.difference,reasoningSteps};
  }

  function pencilBody(x,y,width,color){
    const tip=Math.min(20,width*.24),bodyWidth=width-tip;
    return `<g class="length-object pencil" aria-label="연필"><rect x="${x}" y="${y}" width="${bodyWidth}" height="24" rx="5" fill="${color}" stroke="#315e78" stroke-width="1.4"/><polygon points="${x+bodyWidth},${y} ${x+width},${y+12} ${x+bodyWidth},${y+24}" fill="#f0c68e" stroke="#315e78" stroke-width="1.4"/><path d="M${x+width-5} ${y+9}L${x+width} ${y+12} ${x+width-5} ${y+15}Z" fill="#47555e"/></g>`;
  }
  function eraserBody(x,y,width,color){return `<g class="length-object eraser" aria-label="지우개"><rect x="${x}" y="${y}" width="${width}" height="24" rx="6" fill="${color}" stroke="#925165" stroke-width="1.4"/><rect x="${x+width*.28}" y="${y+1}" width="${width*.44}" height="22" fill="#fff3dc" stroke="#b46b76" stroke-width=".9"/></g>`;}
  function clipBody(x,y,width,color){return `<g class="length-object clip" aria-label="클립"><path d="M${x+width*.18} ${y+4}H${x+width*.72}C${x+width*.94} ${y+4} ${x+width*.94} ${y+21} ${x+width*.72} ${y+21}H${x+width*.19}C${x+width*.03} ${y+21} ${x+width*.03} ${y+9} ${x+width*.19} ${y+9}H${x+width*.65}" fill="none" stroke="${color}" stroke-width="2.1" stroke-linecap="round"/></g>`;}

  function lengthRow(terms,y,start,unit,values,objectByKey,relationIndex,side,solution){
    let x=start,body='';
    for(const key of ['P','E','C']){
      const count=terms[key]||0,object=objectByKey[key],width=values[key]*unit;
      for(let index=0;index<count;index++){
        body+=key==='P'?pencilBody(x,y,width,object.color):key==='E'?eraserBody(x,y,width,object.color):clipBody(x,y,width,object.color);
        x+=width;
      }
    }
    body+=line(start-7,y-5,start-7,y+29,'#687f8d',1.4)+line(x+7,y-5,x+7,y+29,'#687f8d',1.4);
    if(solution)body+=text(590,y+12,(x-start)/unit+'칸',13,'#1f625e',800);
    return `<g class="length-row" data-relation="${relationIndex+1}" data-side="${side}" aria-label="${relationIndex+1}번 ${side==='left'?'위':'아래'} 길이">${body}</g>`;
  }

  function objectLengthSvg(model,solution){
    const objectByKey=Object.fromEntries(model.objects.map(object=>[object.key,object]));
    const totals=model.relationships.flatMap(relation=>[termTotal(relation.left,model.values),termTotal(relation.right,model.values)]);
    const unit=Math.min(22,430/Math.max(...totals));
    let body=text(330,17,'연필 · 지우개 · 클립의 양끝을 맞춘 그림',14,'#3f5f70',800);
    model.relationships.forEach((relation,index)=>{
      const top=42+index*99;
      body+=text(43,top+31,'('+(index+1)+')',15,'#526c7a',800);
      body+=lengthRow(relation.left,top,98,unit,model.values,objectByKey,index,'left',solution);
      body+=text(70,top+49,'같은 길이',11,'#718793',700)+line(58,top+41,82,top+41,'#8ca0aa',1.2,'3 3');
      body+=lengthRow(relation.right,top+42,98,unit,model.values,objectByKey,index,'right',solution);
      if(index===0)body+=line(34,top+91,626,top+91,'#d9e3e7',1);
    });
    return svg(body,244,solution?'연필 지우개 클립의 같은 길이를 클립 단위로 확인한 풀이':'연필 지우개 클립을 이어 양끝을 맞춘 두 길이 관계 그림');
  }

  function lengthSolution(model,difficulty){
    const eraser=model.values.E,common=model.common,difference=model.difference,pencilCount=difficulty==='hard'?2:1;
    const rightE=model.eraserCount*eraser;
    const cancel=common?`둘째 그림의 양쪽에서 클립 ${common}개 길이를 똑같이 빼면 `:'둘째 그림을 보면 ';
    if(difficulty==='easy')return `첫째 그림에서 지우개 1개는 클립 ${eraser}개 길이입니다. ${cancel}연필 1개는 지우개 1개와 클립 ${difference}개의 길이와 같습니다. ${eraser}+${difference}=${model.answer}이므로 연필 1개는 클립 ${model.answer}개 길이입니다.`;
    if(difficulty==='same')return `첫째 그림에서 지우개 1개는 클립 ${eraser}개 길이이므로 지우개 2개는 ${eraser}+${eraser}=${rightE}개 길이입니다. ${cancel}연필 1개는 클립 ${rightE}+${difference}=${model.answer}개 길이입니다.`;
    const both=rightE+difference;
    return `첫째 그림에서 지우개 1개는 클립 ${eraser}개 길이이므로 지우개 3개는 ${eraser}+${eraser}+${eraser}=${rightE}개 길이입니다. ${cancel}연필 ${pencilCount}자루는 클립 ${rightE}+${difference}=${both}개 길이입니다. ${both}÷2=${model.answer}이므로 연필 1자루는 클립 ${model.answer}개 길이입니다.`;
  }

  function makeLengthQuestion(source,difficulty,seed){
    const model=lengthModel(difficulty,seed);
    return {
      prompt:'같은 연필, 같은 지우개, 같은 클립은 각각 길이가 같습니다. 두 그림의 양끝을 맞추었습니다. 연필 1자루의 길이는 클립 몇 개의 길이와 같은지 쓰세요.',
      problemHtml:objectLengthSvg(model,false),
      solutionDiagram:objectLengthSvg(model,true),
      answer:model.answer,
      answerHtml:model.answer+'개',
      solution:lengthSolution(model,difficulty),
      payload:{
        kind:'object-length-equivalence',
        objects:clone(model.objects),
        relationships:clone(model.relationships),
        query:clone(model.query),
        reasoningSteps:model.reasoningSteps,
        responseMode:'clip-count'
      }
    };
  }

  function generate(source,difficulty,seed){
    if(!supports(source))throw Error('지원하지 않는 측정 세부 유형입니다.');
    if(!LEVELS.includes(difficulty))throw Error('easy, same, hard 난이도 중 하나가 필요합니다.');
    if(!Number.isSafeInteger(seed)||seed<0||seed>4294967295)throw Error('seed는 0부터 4294967295까지의 정수여야 합니다.');
    const kind=source.payload.kind;
    const question=kind==='balance-substitution-pictures'?makeBalanceQuestion(source,difficulty,seed):makeLengthQuestion(source,difficulty,seed);
    const output={
      ...question,
      id:`replacement-measurement-${source.typeId||kind}-${difficulty}-${seed}`,
      typeId:source.typeId||kind,
      domain:source.domain||'측정',
      number:source.number,
      difficulty,
      seed,
      answerCandidates:[question.answer],
      resultContract:'single-value',
      variant:{family:'replacement-measurement',measurementFamily:kind,difficulty,seed,version:VERSION},
      learnerFit:{
        gate:'learner-fit',
        learner_stage:STAGE,
        language:'짧은 한국어 지시문과 그림 속 물건 이름',
        representations:kind==='balance-substitution-pictures'?'수평 양팔저울과 모양의 등가 관계':'양끝을 맞춘 연필·지우개·클립 길이 관계',
        prerequisites:'그림의 같은 양을 바꾸기, 수 세기, 덧셈과 뺄셈',
        reasoningLoad:NOTES[kind][LEVELS.indexOf(difficulty)],
        responseMode:'한 칸에 자연수 하나 쓰기',
        status:'candidate'
      },
      evidence:{owner:'challenge_studio',reviewer:'parent-pending',release:'locked',gate:'learner-fit',sourceLocator:source.typeId||kind}
    };
    output.payload.sourceTypeId=source.typeId||kind;
    if(!output.prompt||!Number.isInteger(output.answer)||output.answer<=0||/undefined|NaN/.test(output.problemHtml||''))throw Error('측정 문항 표현 검증에 실패했습니다.');
    return freeze(output);
  }

  const api=Object.freeze({VERSION,STAGE,supports,levels,notes,generate});
  root.HFChallengeReplacementMeasurement=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
