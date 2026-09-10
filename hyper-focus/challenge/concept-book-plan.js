(function(root){
 'use strict';
 // 40 behavior slots per volume. Each slot has easy / same / same applications.
 const chapters=[
  ['조건을 읽고 수 찾기',[15,22,24,46,70]],
  ['수 카드와 여러 가지 방법',[6,38,42,50,60]],
  ['수를 가르고 식 만들기',[4,20,61,62,73]],
  ['이야기 속 수의 관계',[7,8,17,26,27]],
  ['차례와 자리 찾기',[5,9,13,23,28]],
  ['보기에서 수의 규칙 찾기',[18,3,11,19,35]],
  ['모양과 색의 규칙',[14,25,29,40,44]],
  ['달라지는 배열과 묶음',[10,30,33,63,64]],
  ['도형을 세고 조각 맞추기',[2,12,43,58,72]],
  ['뒤집고 접고 나누기',[34,'congruent-marked-partition',41,48,71]],
  ['쌓은 모양과 숨은 블록',['checker-stack-count',47,59,'stack-box-fill','stack-minimum-visible']],
  ['전개도와 주사위 방향 찾기',['net-colors-pair','net-pips-pair','dice-target-bottom','tetra-cube-hole-count']],
  ['전개도와 길이를 비교하기',['net-perspective','object-length-equivalence',66,'rod-subset-lengths','block-build-count']],
  ['선을 따라 길과 조건 찾기',['simple-path-network',31,56,57,'shortest-path-grid']],
  ['비교와 자리의 논리',[21,'balance-substitution-pictures',37,69,74]],
  ['여러 표현에서 관계 찾기',[32,36,45,67,68]]
 ];
 const positionChapter=chapters[4];chapters[4]=chapters[15];chapters[15]=positionChapter;
 const copy=value=>JSON.parse(JSON.stringify(value));
 function model(value){
  if(Array.isArray(value))return value.map(model);
  if(value&&typeof value==='object')return Object.fromEntries(Object.keys(value).sort().filter(key=>!['seed','difficulty','answer','answerCandidates','ways'].includes(key)).map(key=>[key,model(value[key])]));
  return value;
 }
 function loadEvidence(q){
  const p=q.payload,k=p.kind||p.typeId;let metric,value;
  const set=(name,n)=>{metric=name;value=n;};
  switch(k){
   case 'geo-cubes':case 'geo-stack':set('가장 높은 층',Math.max(...p.heights.flat()));break;
   case 'geo-bricks':set('세운 모양을 직접 구별하는 단계',p.orientationExample?0:1);break;
   case 'rectangle-count':set('끊긴 단위 선분',p.cols*(p.rows+1)+p.rows*(p.cols+1)-p.edges.length);break;
   case 'core-code':set('칸 값 추론 단계',0);break;
   case 'four-cell-code':set('칸 값 추론 단계',1);break;
   case 'split-merge-chain':set('채울 빈칸',p.panels.reduce((n,x)=>n+x.blankKeys.length,0));break;
   case 'animal-race-order':set('붙은 순서가 아닌 앞뒤 비교',p.relations.filter(x=>x.type==='before').length);break;
   case 'card-sum-count':set('만들어야 할 합',p.target);break;
   case 'total-difference':set('전체 수의 범위 단계',Math.floor(p.total/10));break;
   case 'family-comparison':set('비교 수의 범위 단계',p.dadAboveSibling<=6?1:2);break;
   case 'line-position-total':set('줄 전체 인원 범위 단계',p.before+p.after+1<7?1:2);break;
   case 'inverse-story-problem':set('거꾸로 계산할 수의 범위 단계',Math.max(...Object.values(p.values))<=20?1:2);break;
   case 'symbol-equation':set('식에 나온 수의 범위 단계',Math.max(p.sum1,p.sum2)<=8?1:2);break;
   case 'mountain-digit-count':set('살펴볼 배열 단계',p.figure);break;
   case 'core-triangle':set('규칙 관계가 직접 주어지지 않은 단계',0);break;
   case 'triangle-number-rule':set('규칙 관계가 직접 주어지지 않은 단계',1);break;
   case 'core-rotation':case 'rotated-grid-pair':set('비교할 보기',p.options.length);break;
   case 'core-apartment':set('자리가 정해지지 않은 사람',p.people.length-p.clues.filter(x=>x.kind==='at').length);break;
   case 'apartment-floor-order':set('자리가 정해지지 않은 사람',p.people.length-1);break;
   case 'cyclic-picture-pattern':set('찾는 위치의 범위 단계',Math.floor(p.position/5));break;
   case 'number-property-filter':set('조건을 검사할 후보',p.options.length);break;
   case 'core-balance':set('교환을 연결할 단계',1);break;
   case 'balance-weight-order':set('교환을 연결할 단계',2);break;
   case 'variant-arrow':set('따라갈 화살표',p.moves.length);break;
   case 'core-pyramid':case 'minimum-sum-pyramid':set('자리를 골라야 하는 카드',p.cards.length-(p.fixed?1:0));break;
   case 'numeric-balance':set('한 저울에서 비교할 과일 수',Math.max(...p.pans.map(x=>x.left.length+x.right.length)));break;
   case 'numeric-digit-select':set('자리 비교 조건',p.compare?1:0);break;
   case 'numeric-house':set('직접 자리 단서 없이 관계로 찾기',p.relations.some(x=>x.kind==='place')?0:1);break;
   case 'variant-count-conditions':set('범위 안 짝수 후보',(p.upper-p.lower)/2-1);break;
   case 'geo-cycle':set('반복 묶음의 길이',p.sequence.length-1);break;
   case 'variant-paper-remainder':set('먼저 빼야 하는 종류',p.known.length);break;
   case 'variant-age-chain':case 'numeric-queue':case 'numeric-circle':set('관계를 이어 볼 사람',(p.names||p.people).length);break;
   case 'geo-matrix':case 'geo-analogy':case 'geo-tiles':set('비교할 보기',p.options.length);break;
   case 'geo-stars':set('살펴볼 자리',p.slots);break;
   case 'numeric-magic':set('채울 빈 원',p.values.length-Object.keys(p.givens).length);break;
   case 'numeric-cancel':set('짝지을 과일 종류',p.kinds.length);break;
   case 'geo-rotation':set('반복 묶음을 넘기는 횟수',Math.floor((p.targetPosition-1)/4));break;
   case 'variant-mirror':set('옮길 꼭짓점',p.vertices.length);break;
   case 'numeric-machines':set('거꾸로 찾아야 하는 입력',p.groups.filter(x=>x.query[0]===null).length);break;
   case 'numeric-domino-sums':set('채울 빈칸',4-Object.keys(p.given).length);break;
   case 'numeric-digit':set('직접 주어지지 않은 자리 숫자',p.givenTens===null?2:1);break;
   case 'geo-partition':set('경계를 찾아야 하는 부분',p.givenRegion.length?3:4);break;
   case 'geo-digital':set('계산 수의 범위 단계',Math.max(...p.equations.flat().filter(x=>typeof x==='number'))<20?1:2);break;
   case 'numeric-card-pairs':case 'numeric-card-rank':set('골라 배치할 카드',p.cards.length);break;
   case 'geo-quadrilaterals':set('연결할 가로선',p.horizontalLevels.length);break;
   case 'numeric-period':set('함께 보는 모양과 색의 종류',p.shapes.length+p.colors.length+(p.counts?.length||0));break;
   case 'numeric-code':set('규칙을 비교하고 결합할 단계',p.examples.length+(p.stacked?1:0));break;
   case 'numeric-maximum':set('범위 조건',p.lower.length+p.upper.length);break;
   case 'geo-top':set('위치를 읽을 기둥',p.heights.flat().filter(Boolean).length);break;
   case 'geo-fold':set('펼칠 접기의 방향 난도',p.folds.length+p.folds.filter(fold=>/diag/.test(fold)).length);break;
   case 'geo-route-count':set('피해야 하는 막힌 길',p.blocked.length);break;
   case 'numeric-length':set('클립을 모을 양쪽',Math.max(...p.rows.map(x=>x.clips.filter(Boolean).length)));break;
   case 'net':set('채울 면',p.query.length);break;
   case 'roll':set('스스로 추적할 굴리기',p.moves.length);break;
   case 'geo-opposite':set('공통 면을 직접 찾아야 하는 단계',q.prompt.includes('두 그림의 앞면에는 모두')?0:1);break;
   case 'geo-links':case 'geo-walk':set('길을 생각할 칸',p.w*p.h);break;
   case 'triples':set('선택할 수의 후보',p.max);break;
   case 'numeric-tree':set('나누는 단계',p.known.length);break;
   case 'core-group':case 'group':case 'runs':set('찾는 번째의 범위 단계',Math.floor(p.position/10));break;
   case 'variant-routes':set('비교할 경로',p.paths.length);break;
   case 'unknowns':set('계산할 빈칸',p.equations.length);break;
   case 'operators':set('찾을 기호',3-Object.keys(p.given).length);break;
   case 'numeric-domino-one':set('변화량을 직접 찾아야 하는 단계',/왼쪽은 .*씩/.test(q.prompt)?0:1);break;
   case 'numeric-preference':set('조건으로 채울 표의 칸',16-p.facts.length);break;
   default:if(q.difficultyEvidence){metric=q.difficultyEvidence.metric;value=q.difficultyEvidence.value;}
  }
  if(!metric||!Number.isFinite(value))throw Error('실제 난도 지표가 없는 풀이 행동: '+k);
  return {metric,value};
 }
 function varyMirrorPosition(q,seed){
  if(q.payload.kind!=='variant-mirror'||seed%2===0)return;
  const p=q.payload;p.vertices=p.vertices.map(([x,y])=>[x-1,y]);
  if(p.vertices.some(([x,y])=>x<0||x>=p.mirrorX||y<0||y>6))throw Error('거울상 변형이 모눈 밖으로 나갔습니다.');
  q.answer=p.vertices.map(([x,y])=>[2*p.mirrorX-x,y]);q.answerCandidates=[copy(q.answer)];
  const points=vertices=>vertices.map(([x,y])=>`${60+x*43},${20+y*43}`).join(' ');
  q.problemHtml=q.problemHtml.replace(/(<polygon points=")[^"]+("[^>]*>)/,`$1${points(p.vertices)}$2`);
  let polygon=0;q.solutionDiagram=q.solutionDiagram.replace(/(<polygon points=")[^"]+("[^>]*>)/g,(_,a,b)=>a+points(polygon++===0?p.vertices:q.answer)+b);
 }
 function reviseSplitMergeBasic(question,bank){
  const p=question.payload,type=bank.types['split-merge-chain'];
  const pairIndex=p.panels.findIndex(panel=>panel.kind==='pair');
  if(pairIndex<0)throw Error('대표 (1)에 사용할 두 수 가르기 그림이 없습니다.');
  const previous=p.panels[pairIndex];
  p.panels[pairIndex]={...previous,kind:'pair',parts:[9,8],nodes:{a:9,b:8,total:17},givenKeys:['total','a'],blankKeys:['b'],difficulty:'easy'};
  if(pairIndex!==0)[p.panels[0],p.panels[pairIndex]]=[p.panels[pairIndex],p.panels[0]];
  p.panels.forEach((panel,index)=>{panel.id=`panel-${index+1}`;});
  p.answer=p.panels.map(panel=>panel.blankKeys.map(key=>panel.nodes[key]));
  const candidates=type.enumerate(p);
  if(!type.validate(p)||candidates.length!==1)throw Error('17−9 대표 가르기 문제의 답이 하나가 아닙니다.');
  question.answer=copy(p.answer);
  question.answerCandidates=copy(candidates);
  question.answerHtml=type.renderAnswer(p);
  question.problemHtml=type.renderProblem(p);
 }
 function reviseAgeBorrowing(question,phase){
  const p=question.payload,names=p.names;
  const settings=phase==='basic'?{base:24,gaps:[-8]}:phase==='guided'?{base:27,gaps:[-9,4]}:{base:26,gaps:[-9,5]};
  const gaps=settings.gaps.slice(0,names.length-1);
  while(gaps.length<names.length-1)gaps.push(2);
  const ages=[settings.base];gaps.forEach(gap=>ages.push(ages.at(-1)+gap));
  const years=p.years,query=p.query,future=query.map(index=>ages[index]+years),total=future.reduce((sum,value)=>sum+value,0);
  p.baseAge=settings.base;p.gaps=gaps;p.borrowingSubtraction={minuend:settings.base,subtrahend:Math.abs(gaps[0]),difference:ages[1]};
  question.prompt=[`${names[0]}이는 ${settings.base}살입니다.`,`${names[1]}이는 ${names[0]}이보다 ${Math.abs(gaps[0])}살 어립니다.`,...gaps.slice(1).map((gap,index)=>`${names[index+2]}이는 ${names[index+1]}이보다 ${Math.abs(gap)}살 ${gap<0?'어립니다.':'많습니다.'}`)].join(' ')+' (1) 지금 나이를 표에 쓰세요. '+`(2) ${years}년 뒤 ${names[query[0]]}이와 ${names[query[1]]}이의 나이의 합을 쓰세요.`;
  question.answer=[ages,total];question.answerCandidates=[[ages,total]];
  question.answerHtml=`(1) ${names.map((name,index)=>name+' '+ages[index]+'살').join(' · ')}  (2) ${total}살`;
  const chain=[`${settings.base}−${Math.abs(gaps[0])}=${ages[1]}`,...gaps.slice(1).map((gap,index)=>`${ages[index+1]}${gap<0?'−':'+'}${Math.abs(gap)}=${ages[index+2]}`)];
  question.solution=`${names[1]}이의 나이는 ${chain[0]}살입니다.${chain.length>1?' '+names.slice(2).map((name,index)=>`${name}이의 나이는 ${chain[index+1]}살입니다.`).join(' '):''} ${years}년 뒤 두 나이는 ${query.map(index=>`${ages[index]}+${years}=${ages[index]+years}`).join(', ')}이므로 합은 ${future.join('+')}=${total}살입니다.`;
 }
 function reviseGroupCumulative(question,phase){
  const p=question.payload;
  if(p.kind!=='group'||p.mode!=='group')throw Error('누적 구슬 문제의 묶음 규칙이 다릅니다.');
  p.position=22;
  if(phase==='review'){
   p.colors=p.colors.slice().reverse();
   question.problemHtml=(question.problemHtml||'').replace(/#498fb4/g,'#COLOR_SWAP#').replace(/#e6bd4b/g,'#498fb4').replace(/#COLOR_SWAP#/g,'#e6bd4b');
  }
  const totals=p.colors.map((_,colorIndex)=>{
   let total=0;
   for(let position=1;position<=p.position;position++)if((position-1)%p.colors.length===colorIndex)total+=position;
   return total;
  });
  const winner=Math.max(...totals),loser=Math.min(...totals),winnerIndex=totals.indexOf(winner),difference=winner-loser;
  p.query='cumulative-color-difference';p.colorTotals=totals;
  question.prompt=`1번째부터 ${p.position}번째 묶음까지 모두 모았습니다. ${p.colors.join('과 ')} 구슬 중 어느 색 구슬이 몇 개 더 많습니까?`;
  question.answer=`${p.colors[winnerIndex]} 구슬이 ${difference}개 더 많습니다.`;
  question.answerHtml=question.answer;question.answerCandidates=[question.answer];
  const positions=colorIndex=>Array.from({length:p.position},(_,index)=>index+1).filter(position=>(position-1)%p.colors.length===colorIndex);
  question.solution=p.colors.map((color,index)=>`${color} 구슬은 ${positions(index).join('+')}=${totals[index]}개입니다.`).join(' ')+` ${winner}−${loser}=${difference}이므로 ${p.colors[winnerIndex]} 구슬이 ${difference}개 더 많습니다.`;
 }
 function generationDifficulty(expectedTypeId,phase,fallback){
  const promote=new Set(['extra-general-quadrilateral-count','priority-cube-top-view','priority-fold-holes','replace-missing-star-combination','replace-student-queue','r3-main-13','r4-main-15']);
  if(expectedTypeId==='r4-main-5'||promote.has(expectedTypeId))return phase==='basic'?'same':'hard';
  return fallback;
 }
 function build(seed=73109){
  if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('개념 교재 seed는 0부터 4294967295까지의 정수여야 합니다.');
  const catalog=root.HFConceptCatalog||(typeof require==='function'?require('./concept-catalog.js'):null);
  if(!catalog)throw Error('개념 목록을 불러오지 못했습니다.');
  const lessons=catalog.build(seed),bank=root.HFChallengeBank,variants=root.HFChallengeVariants||(typeof require==='function'?require('./variant-provider.js'):null);
  if(!bank||!variants)throw Error('개념 문항 생성기를 불러오지 못했습니다.');
  const sourceRows=variants.list();
  const volumes=[1,2].map(round=>{
   const review=[],used=new Map();let number=0;
   const item=key=>{
    const keyText=String(key),numericKey=/^\d+p?$/.test(keyText),practice=numericKey&&keyText.endsWith('p');
    const lesson=numericKey?lessons[parseInt(keyText,10)-1]:lessons.find(candidate=>candidate.id===keyText),unit=lesson?.number,origin=lesson?.generation;
    if(!lesson||!origin)throw Error(`개념 ${round}권 ${key}: 생성 경로가 없습니다.`);
    const typeNumber=++number,slotKey=`v${round}-type-${String(typeNumber).padStart(2,'0')}`;
    const source=origin.kind==='source'?(practice&&origin.practiceSource?origin.practiceSource:origin.source):origin.source||(origin.kind==='core'?sourceRows.find(row=>row.typeId===origin.typeId):null);
    const expectedTypeId=source?variants.describe(source).typeId:origin.kind==='core'?origin.typeId:origin.questions?.[0]?.typeId;
    if(!expectedTypeId||expectedTypeId==='concept-check')throw Error(`${slotKey}: 풀이 행동 유형이 없습니다.`);
    if(origin.kind==='special'&&origin.questions.length!==3)throw Error(`${slotKey} (${lesson.id}): 기본·유제·복습 세 문항이 필요합니다.`);
    const seen=used.get(expectedTypeId)||[];used.set(expectedTypeId,seen);
    const evidence={};
    const make=(phase,difficulty,index)=>{
     let question,lastReason='서로 다른 문항을 찾지 못했습니다.';
     for(let attempt=0;attempt<(origin.kind==='special'?1:512);attempt++){
      const questionSeed=(seed+round*1000003+typeNumber*10007+index*1009+attempt*7919)>>>0;
      try{
       if(source){
         const selectedDifficulty=generationDifficulty(expectedTypeId,phase,difficulty);
         const result=variants.generate({...source,difficulty:selectedDifficulty,seed:questionSeed});
        if(result.status!=='verified')throw Error(result.reason||'생성 검수가 보류되었습니다.');
        question=copy(result.question);
       }else if(origin.kind==='core'){
        // These legacy easy schemas ask a different action. Keep the same schema,
        // then reduce the basic task's candidates or provide one intermediate clue.
        const preserveAction=['line-position-total','inverse-story-problem','number-property-filter'].includes(origin.typeId);
        question=bank.createQuestion(origin.typeId,preserveAction?'same':difficulty,questionSeed);
        if(origin.typeId==='number-property-filter'&&phase==='basic'){
         const p=question.payload,t=bank.types[origin.typeId];p.options=p.options.slice(0,4);
         const candidates=t.enumerate(p);if(candidates.length!==1||!candidates[0].length)throw Error('네 후보의 유일한 답을 찾지 못했습니다.');
         p.answer=copy(candidates[0]);question.answer=copy(p.answer);question.answerCandidates=copy(candidates);question.answerHtml=t.renderAnswer(p);question.problemHtml=t.renderProblem(p);
        }
        question.solution=variants.explainQuestion(question);
       }else if(origin.kind==='special')question=copy(origin.questions[index]);
       else throw Error('등록되지 않은 생성 경로입니다.');
        if(origin.typeId==='split-merge-chain'&&phase==='basic'){
         reviseSplitMergeBasic(question,bank);
         question.solution=variants.explainQuestion(question);
        }
        if(question.typeId!==expectedTypeId)throw Error('원래 풀이 행동과 다른 유형이 생성되었습니다.');
        if(expectedTypeId==='replace-age-chain')reviseAgeBorrowing(question,phase);
        if(expectedTypeId==='r3-main-3'&&phase!=='basic')reviseGroupCumulative(question,phase);
       varyMirrorPosition(question,questionSeed);
       if(expectedTypeId==='minimum-sum-pyramid'&&question.payload.operation!==(source?variants.getSource(source).payload.operation:lesson[practice?'practice':'example'].payload.operation)){
        lastReason='피라미드에서 묻는 합·차의 풀이 행동을 맞추지 못했습니다.';continue;
       }
       if(expectedTypeId==='minimum-sum-pyramid'&&phase==='basic'&&question.payload.cards.includes(0)){
        lastReason='14쪽 대표 숫자 카드에는 0을 쓰지 않습니다.';continue;
       }
       if(expectedTypeId==='r4-main-5'){
        const requiredDepth=phase==='basic'?2:3,minimumTotal=phase==='basic'?17:20;
        if(question.payload.known.length!==requiredDepth||question.payload.total<minimumTotal){lastReason='연쇄 가르기의 단계 또는 수 범위가 작습니다.';continue;}
       }
       if(expectedTypeId==='arrow-number-move'&&question.payload.verticalStep!==(phase==='basic'?10:8)){
        lastReason='화살표의 ±10 / ±8 조건을 찾지 못했습니다.';continue;
       }
       question.difficulty=difficulty;
       question.difficultyLabel=difficulty==='easy'?'쉽게':'같게';
       const measured=loadEvidence(question);
       const fixedBasic={'card-sum-count':6,'total-difference':1,'family-comparison':1,'mountain-digit-count':5,'cyclic-picture-pattern':2,'line-position-total':1,'inverse-story-problem':1,'symbol-equation':1,'extra-circle-bar-code':4};
       const fixedSame={'card-sum-count':9,'total-difference':2,'family-comparison':2,'mountain-digit-count':8,'cyclic-picture-pattern':4,'line-position-total':2,'inverse-story-problem':2,'symbol-equation':2,'extra-circle-bar-code':5};
       const required=(phase==='basic'?fixedBasic:fixedSame)[expectedTypeId];
       if(required!==undefined&&measured.value!==required){lastReason='지정한 수 범위의 난도 단계가 아닙니다.';continue;}
       if(phase!=='basic'&&(measured.metric!==evidence.basic.metric||measured.value<=evidence.basic.value)){
        lastReason='기본보다 실제 추론 부담이 높지 않습니다.';continue;
       }
       if(phase==='review'&&measured.value!==evidence.guided.value){lastReason='복습과 유제의 실제 난도 단계가 다릅니다.';continue;}
       question=catalog.removePictureDescriptions(question);
       const signature=JSON.stringify(model(question.payload)),visible=JSON.stringify([question.prompt,question.problemHtml||'']);
       if(seen.some(previous=>previous.signature===signature||previous.visible===visible)){
        lastReason='앞 문항과 같은 조건 또는 같은 문제 화면입니다.';continue;
       }
       if(!question.prompt||question.answer===undefined||!question.solution)throw Error('문제·정답·풀이 중 빠진 내용이 있습니다.');
       seen.push({signature,visible});
       evidence[phase]=measured;
       return {key:`${slotKey}-${phase}`,slotKey,number:typeNumber,typeNumber,unit,subtype:lesson.id,typeId:expectedTypeId,title:lesson.title,rule:lesson.rule,phase,difficulty,difficultyEvidence:measured,...(source?{source:copy(source)}:{}),question,asset:`assets/concepts/${slotKey}-${phase}`};
      }catch(error){lastReason=error.message;}
     }
     throw Error(`${slotKey} (${lesson.id}) ${phase}/${difficulty}: ${lastReason} 다른 유형으로 대체하지 않습니다.`);
    };
    const basic=make('basic','easy',0),guided=make('guided','same',1),reviewItem=make('review','same',2);
    review.push(reviewItem);
    // question / asset aliases keep older consumers readable while rendering migrates.
    return {...basic,key:slotKey,basic,guided,review:reviewItem,difficultyEvidence:copy(evidence)};
   };
   const volumeChapters=chapters.slice((round-1)*8,round*8).map(([title,keys],i)=>({number:i+1,area:round===1?(i<4?'수와 연산':'규칙'):(i<6?'도형과 측정':'논리추리'),title,items:keys.map(item)}));
    const requiredCount=round===1?40:39;
    if(number!==requiredCount||review.length!==requiredCount)throw Error(`개념 ${round}권은 ${requiredCount}개 유형과 ${requiredCount}개 복습이 필요합니다.`);
   return {round,area:round===1?'수와 연산 · 규칙':'도형과 측정 · 논리추리',chapters:volumeChapters,review};
  });
  return {lessons,volumes};
 }
 const api={build};root.HFConceptBookPlan=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
