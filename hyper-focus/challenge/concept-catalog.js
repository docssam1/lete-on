(function(root){
 'use strict';
 const ref=(r,s,n)=>({r,s,n});
 // Each row is a separately taught subtype, not just a word match in the bank.
 const definitions=[
 ['balance-order','기울어진 양팔저울의 무게 순서','아래로 내려간 접시 쪽이 더 무거워요. 여러 저울에서 얻은 비교를 연결해 가장 무거운 것과 가벼운 것을 찾아요.',ref(2,'main',17),'서로 다른 과일을 한 개씩 올렸을 때 아래로 내려간 접시의 과일이 더 가볍습니다.','틀림'],
 ['digit-all-select','자리 숫자 조건에 맞는 수 모두 고르기','짝수인지, 두 자리 수인지, 어느 자리 숫자가 더 큰지를 각각 확인해요. 답이 여러 개이면 모두 골라야 해요.',ref(1,'extra',1),'짝수이고 두 자리 수이며 일의 자리가 더 큰 수를 고를 때 46은 조건에 맞습니다.','맞음'],
 ['house-between','집의 사이 관계','두 집 사이에 있다는 조건은 왼쪽·오른쪽 순서를 정하지 않을 수도 있어요. 모든 조건에 공통인 가운데 집을 찾아요.',ref(1,'main',10),'집의 줄을 통째로 좌우로 뒤집어도 한가운데 집은 바뀌지 않습니다.','맞음'],
 ['count-exclusion','짝수·범위·제외 조건','범위에 드는 수를 먼저 찾고 짝수인지 확인한 뒤, 아니라고 한 수를 제외해요.',ref(1,'main',1),'짝수이고 6보다 크며 12보다 작은 수 중 8이 아니라면 그 수는 10입니다.','맞음'],
 ['shade-cycle','나뉜 도형의 색칠 규칙','색칠된 조각의 위치를 순서대로 비교해요. 돌아오는 묶음을 찾고 빈 그림에도 같은 위치를 색칠해요.',ref(1,'main',5),'색칠된 조각 수가 같으면 위치가 달라도 같은 그림입니다.','틀림'],
 ['paper-remainder','남은 두 종류를 똑같이 나누기','전체에서 이미 알고 있는 종류를 빼요. 나머지를 두 종류가 똑같이 나누어 가진다는 조건을 사용해요.',ref(1,'main',16),'20장 중 6장과 4장을 빼고 남은 것을 두 색이 똑같이 나누면 한 색은 5장입니다.','맞음'],
 ['age-chain','나이 관계와 몇 년 뒤','누구보다 몇 살 많고 적은지 이어서 계산해요. 몇 년 뒤를 묻는지 마지막에 확인해요.',ref(1,'main',17),ref(3,'main',7)],
 ['queue-between','조건에 맞게 줄세우기','앞에서부터 자리를 정하고, 사이·바로 뒤·맨 뒤가 아니라는 조건을 하나씩 연결해 모든 사람의 순서를 찾아요.',ref(2,'main',4),ref(3,'main',10)],
 ['nested-matrix','안팎 도형의 가로·세로 배열','바깥 도형과 안쪽 도형을 한 쌍으로 보아요. 가로줄과 세로줄에 나타나는 순서를 함께 살펴요.',ref(2,'main',8),'바깥 도형만 같으면 안쪽 도형이 달라도 같은 그림입니다.','틀림'],
 ['missing-combination','빠진 색칠 조합','색칠할 자리의 수를 지켜 모든 조합을 만들어요. 위치가 같은 그림을 중복해서 세지 않아요.',ref(2,'main',5),'네 자리 중 두 자리를 고르는 방법은 순서를 구별하지 않을 때 여섯 가지입니다.','맞음'],
 ['magic-lines','직선 위의 수의 합','각 직선에 속한 원을 정확히 찾아요. 여러 직선이 만나는 원은 각각의 합 계산에 모두 들어가요.',ref(2,'main',10),'두 직선이 만나는 원의 수는 두 직선의 합을 계산할 때 각각 사용합니다.','맞음'],
 ['fruit-pairs','같은 종류 두 개씩 지우기','같은 종류를 두 개씩 묶어 없애요. 짝을 모두 만든 뒤 남은 종류를 찾아요.',ref(2,'main',11),'한 종류의 과일이 다섯 개라면 두 개씩 지운 뒤 한 개가 남습니다.','맞음'],
 ['line-rotation','선 도형이 변하는 규칙','선이 꺾인 위치를 기준으로 비교해요. 회전인지 뒤집기인지 구별하고 반복되는 묶음을 찾아요.',ref(2,'main',14),'네 그림이 반복될 때 18번째 그림은 묶음의 둘째 그림입니다.','맞음'],
 ['grid-mirror','모눈의 거울상 다각형','거울 선에서 같은 거리만큼 반대편에 점을 찍어요. 꼭짓점을 같은 순서로 연결해요.',ref(2,'main',3),'거울 선 왼쪽 두 칸에 있는 점은 거울상에서 오른쪽 두 칸에 있습니다.','맞음'],
 ['number-machine','수 상자의 규칙과 역산','들어간 수와 나온 수를 비교해 규칙을 찾아요. 들어간 수가 없으면 바뀐 과정을 거꾸로 계산해요.',ref(2,'main',2),'6을 더하는 상자에서 19가 나왔다면 넣은 수는 13입니다.','맞음'],
 ['domino-side-sums','도미노로 만든 테두리의 합','한 변에 닿아 있는 점을 빠짐없이 더해요. 모서리의 점은 두 변을 확인할 때 각각 포함돼요.',ref(2,'main',13),'한 변의 목표 합이 12이고 보이는 두 수가 3과 5라면 나머지 수는 4입니다.','맞음'],
 ['circular-order','원탁의 시계 방향·이웃','기준 자리를 고정해요. 시계 방향과 이웃한 자리를 구별하여 한 사람씩 배치해요.',ref(2,'main',9),'원탁에서도 맨 왼쪽 사람부터만 세어야 합니다.','틀림'],
 ['digit-sum-difference','자리 숫자의 합과 차','십의 자리와 일의 자리를 따로 생각해요. 두 숫자의 합과 차를 모두 확인한 뒤 마지막 물음을 계산해요.',ref(2,'main',7),'십의 자리가 6, 일의 자리가 4인 수의 자리 숫자 합은 10입니다.','맞음'],
 ['congruent-conditions','같은 모양으로 나누며 그림 하나씩','칸 수만 같은 것으로는 부족해요. 돌리거나 뒤집어 겹치는지와 각 부분에 필요한 그림이 들어가는지 확인해요.',ref(1,'extra',4),'네 부분의 칸 수만 같으면 각 부분의 모양은 달라도 됩니다.','틀림'],
 ['inside-outside','안팎 도형의 자리 교환','바깥 도형과 안쪽 도형을 각각 확인해요. 바뀐 그림에서 두 도형의 자리가 서로 교환되었는지 살펴요.',ref(1,'extra',5),'원 안에 세모가 있던 그림에서 안팎을 바꾸면 세모 안에 원이 들어갑니다.','맞음'],
 ['digital-mirror','거울에 비친 디지털 식','거울은 숫자의 모양뿐 아니라 식 전체의 좌우 순서도 바꿔요. 원래 식을 복원한 뒤 계산해요.',ref(1,'extra',6),'거울 속 숫자만 고치고 식의 좌우 순서를 그대로 두면 언제나 원래 식이 됩니다.','틀림'],
 ['card-distribution','모든 카드를 한 번씩 나누기','상자별 목표 합을 확인해요. 한 상자를 채운 뒤 사용한 카드를 다시 쓰지 않도록 표시해요.',ref(2,'extra',3),'한 상자에서 쓴 카드도 다른 상자에 다시 넣을 수 있습니다.','틀림'],
 ['general-quadrilaterals','기울어진 선을 포함한 사각형','모양의 둘레가 네 개의 곧은 변으로 닫히는지 확인해요. 작은 부분을 합친 큰 사각형도 찾아요.',ref(2,'extra',4),'직각이 없더라도 네 개의 곧은 변으로 닫힌 모양은 사각형일 수 있습니다.','맞음'],
 ['independent-periods','색과 모양의 서로 다른 주기','모양의 묶음과 색의 묶음을 따로 찾아요. 같은 번째의 모양과 색을 마지막에 합쳐요.',ref(2,'extra',5),'모양이 네 개씩 반복되고 색이 세 개씩 반복되면 두 규칙은 항상 같은 순간에 처음으로 돌아갑니다.','틀림'],
 ['circle-bar-code','원과 막대로 나타낸 수','원과 막대가 각각 얼마를 나타내는지 보기에서 알아내요. 두 표시가 함께 있으면 값을 더해요.',ref(2,'extra',6),'원이 5, 막대 한 칸이 1이라면 원 하나와 막대 세 칸은 8입니다.','맞음'],
 ['maximum-conditions','조건에 맞는 수 중 최댓값','모든 조건에 맞는 수들을 먼저 찾아요. 그 뒤 가장 큰 수를 고르는 마지막 지시까지 읽어요.',ref(2,'extra',1),'20보다 크고 28보다 작은 짝수 중 가장 큰 수는 26입니다.','맞음'],
 ['top-view','쌓기나무를 위에서 보기','위에서 보면 쌓인 높이가 아니라 놓인 자리가 보여요. 그림과 보기의 앞 방향을 맞추어요.',ref(1,'extra',2),'같은 자리에 쌓기나무 세 개를 쌓으면 위에서 본 모양에서도 세 칸으로 보입니다.','틀림'],
 ['fold-holes','접은 종이의 구멍 펼치기','접은 선을 기준으로 구멍을 반대편 같은 위치에 옮겨요. 마지막에 접은 것부터 거꾸로 펼쳐요.',ref(1,'extra',3),'두 번 접었다면 처음 접은 것부터 먼저 펼쳐야 마지막 구멍 위치를 찾을 수 있습니다.','틀림'],
 ['route-count','경유점·막힌 길과 경로 수','지나야 하는 곳과 지나면 안 되는 길을 구별해요. 조건을 지킨 이동만 세고 같은 경로를 중복하지 않아요.',ref(2,'main',12),'막힌 길을 지난 경로도 도착점에 가기만 하면 셉니다.','틀림'],
 ['rank-number-cards','수 카드로 만든 수의 순위','0은 십의 자리에 놓을 수 없어요. 만들 수 있는 수를 작은 것부터 정리하고 요구한 순위를 찾아요.',ref(2,'extra',2),'0, 2, 5 카드 중 두 장으로 만드는 두 자리 수 중 가장 작은 수는 20입니다.','맞음'],
 ['length-substitution','물건과 단위 물건의 길이','양 끝이 맞는 줄의 전체 길이는 같아요. 공통 부분을 빼거나 단위 물건으로 바꾸어 길이 차를 비교해요.',ref(1,'main',14),ref(3,'extra',4)],
 ['net-colors','마주 보는 색과 전개도','전개도에서 이웃한 면과 접었을 때 마주 보는 면은 달라요. 한 면을 기준으로 접어 반대편을 찾아요.',ref(3,'main',4),'전개도에서 바로 붙어 있는 두 면은 접으면 마주 보는 면이 됩니다.','틀림'],
 ['net-pips','눈의 합이 7인 주사위 전개도','마주 보는 두 면을 찾은 뒤 7에서 보이는 눈의 수를 빼요. 전개도의 모든 면을 확인해요.',ref(4,'main',8),ref(3,'extra',2)],
 ['dice-roll','주사위 굴리기','한 칸 굴릴 때 윗면·아랫면·앞면·옆면의 자리가 바뀌어요. 이동 방향을 한 번씩 따라가고 묻는 면을 확인해요.',ref(3,'main',13),ref(4,'main',15)],
 ['opposite-faces','직육면체의 마주 보는 도형','두 모습에서 공통으로 보이는 면을 기준으로 맞춰요. 그 면 둘레의 도형 관계로 반대편 면을 찾아요.',ref(3,'main',18),ref(4,'extra',2)],
 ['noncrossing-links','교차하지 않는 도형 연결','도형이 있는 칸을 먼저 확인해요. 다른 선이나 다른 도형을 통과하지 않도록 돌아가는 길도 살펴요.',ref(4,'main',11),ref(4,'main',11)],
 ['number-walk','번호 순서대로 모든 칸 지나기','번호는 순서대로 만나고 빈칸도 모두 한 번씩 지나야 해요. 먼저 지나간 칸으로 돌아갈 수 없어요.',ref(3,'main',19),ref(4,'extra',3)],
 ['tetromino','두 조각으로 목표 모양 만들기','작은 칸 네 개로 된 조각을 돌리고 뒤집어 보아요. 빈 곳과 겹친 곳 없이 목표 모양을 채워요.',ref(3,'main',12),ref(4,'extra',5)],
 ['long-bricks','길쭉한 블록의 개수','기준 블록 하나의 크기를 먼저 확인해요. 가로로 놓든 세로로 놓든 같은 블록 한 개예요.',ref(4,'main',12),ref(3,'extra',6)],
 ['distinct-triples','서로 다른 세 수의 조합 수','가장 작은 수부터 고정해서 조사해요. 같은 수를 두 번 고르거나 순서만 바꾼 경우는 제외해요.',ref(3,'main',5),ref(4,'main',13)],
 ['distinct-tree','모든 수가 다른 연쇄 가르기','위 수에서 알고 있는 아래 수를 빼요. 빈칸을 채운 뒤 이미 나온 수와 겹치지 않는지 검사해요.',ref(4,'main',5),ref(3,'extra',5)],
 ['operator-insertion','연산 기호와 등호 넣기','숫자의 순서는 그대로 두고 기호의 자리를 바꾸어요. 등호 양쪽의 계산 결과가 같아야 해요.',ref(3,'main',11),ref(4,'main',9)],
 ['growing-groups','묶음의 개수 증가와 색 변화','몇 번째 묶음인지와 몇 번째 구슬인지를 구별해요. 묶음마다 늘어나는 수와 바뀌는 색을 함께 봐요.',ref(3,'main',3),ref(4,'main',3)],
 ['growing-runs','같은 색이 이어지는 길이 증가','같은 색이 몇 개씩 이어지는지 묶어서 보아요. 묶음의 길이가 늘어나므로 일정한 주기로 나누면 안 돼요.',ref(3,'main',14),ref(4,'extra',1)],
 ['orthogonal-length','꺾인 선의 단위 길이','가로와 세로의 작은 길이를 하나씩 세어요. 출발점과 도착점 사이가 아니라 선 전체를 따라가요.',ref(3,'main',6),'가로 네 칸과 세로 세 칸을 이어 간 길이는 모두 일곱 칸 길이입니다.','맞음'],
 ['diagonal-length','대각선이 있는 경로 비교','같은 크기의 모눈 대각선끼리는 길이가 같아요. 가로와 대각선을 같은 한 칸으로 세지 않고 비교해요.',ref(2,'main',18),ref(4,'main',18)],
 ['blank-comparison','빈칸 수를 구한 뒤 비교','각 식에서 빈칸의 수를 먼저 구해요. 식에 보이는 수의 크기가 아니라 빈칸에 들어간 수를 비교해요.',ref(3,'main',1),ref(4,'main',17)],
 ['domino-pattern','도미노 점의 변화 규칙','양쪽 점의 수를 따로 기록해요. 늘어나는 쪽과 줄어드는 쪽을 구별해서 다음 도미노를 완성해요.',ref(3,'main',8),ref(4,'main',7)],
 ['logic-table','표로 정리하는 선택 조건','확실한 칸부터 표시하고 각 사람과 각 종류의 개수 조건을 함께 확인해요. 빈칸을 추측으로 채우지 않아요.',ref(2,'main',20),ref(4,'main',19)]
 ];
 // Concept-only presentation: shared mock-exam content is left untouched.
 function removePictureDescriptions(q){
  const result=JSON.parse(JSON.stringify(q)),moved=[],removed=[];
  const plain=s=>s.replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').trim();
  let html=result.problemHtml||'';
  if(result.typeId==='r2-fruit-logic-table'){
   const conditions=[...html.matchAll(/<p>([\s\S]*?)<\/p>/g)].map(m=>plain(m[1]));
   result.prompt+='\n'+conditions.join('\n');
   html=html.match(/<table\b[\s\S]*?<\/table>/)[0];
  }
  html=html.replace(/<div class="spatial-asks">([\s\S]*?)<\/div>/g,(_,body)=>{
   for(const m of body.matchAll(/<p>([\s\S]*?)<\/p>/g))moved.push(plain(m[1]));
   return '';
  });
  html=html.replace(/<text\b([^>]*)>([\s\S]*?)<\/text>/g,(tag,attrs,body)=>{
   const value=plain(body);
   if(/^\([12]\)\s/.test(value)&&/[가-힣]/.test(value)){
    moved.push(value);
    return result.typeId==='four-cell-code'?'<text'+attrs+'>'+value.slice(0,3)+'</text>':'';
   }
   if(/class="[^"]*logic-label[^"]*logic-small/.test(attrs)&&
     (/^합이 .*카드를 골라 보세요\.$/.test(value)||/^사탕 .*두 접시에 .*담습니다\.$/.test(value)||
      value==='아빠는 나보다 몇 개 더 많을까요?'||/번째 모양에서$/.test(value)||/은 몇 개일까요\?$/.test(value))){
    removed.push(value);return '';
   }
   return tag;
  });
  result.problemHtml=html;
  if(moved.length)result.prompt+='\n'+moved.join('\n');
  result.presentationCleanup={removed,moved};
  return result;
 }
 function build(seed=73109){
  const bank=root.HFChallengeBank||(typeof require==='function'?(require('./challenge-bank.js'),globalThis.HFChallengeBank):null);
  const extra=root.HFChallengeSupplement||(typeof require==='function'?require('./exam-supplement.js'):null);
  const specials=root.HFConceptSpecials||(typeof require==='function'?require('./concept-specials.js'):null);
  const replacements=root.HFConceptReplacementSpecials||(typeof require==='function'?require('./concept-replacement-specials.js'):null);
  if(!bank||!extra||!specials||!replacements)throw Error('개념 단원을 불러오지 못했습니다.');
  const copy=q=>JSON.parse(JSON.stringify(q));
  const fetch=a=>copy((a.s==='main'?bank.createMockExam(a.r,62001):extra.get(a.r)).questions.find(q=>q.number===a.n));
  const lessons=bank.listTypes().map((t,i)=>{
   const a=bank.createConceptLesson(t.id,seed+i*2003);let rule=({'cube-count-fill':'한 기둥씩 높이를 세어 더해요. 더 쌓을 개수는 채운 뒤의 전체 개수에서 지금 개수를 빼서 구해요.','rectangle-count':'네 변이 모두 이어진 사각형을 찾아요. 작은 사각형을 합쳐 만든 큰 사각형도 세어요.','four-cell-code':'보기의 색칠한 칸과 수를 비교해 각 칸이 나타내는 수를 찾아요. 여러 칸을 칠하면 그 수들을 더해요.','total-difference':'전체에서 두 수의 차를 뺀 뒤 반으로 나누면 작은 수예요. 작은 수에 차를 더하면 큰 수예요.'})[t.id]||t.concept.rule;
   const explanations=root.HFChallengeVariants||(typeof require==='function'?require('./variant-provider.js'):null);
   for(const q of [a.example,a.practice])q.solution=explanations.explainQuestion(q);
   if(t.id==='arrow-number-move'){
    rule='보기의 수를 비교해 방향마다 얼마나 커지거나 작아지는지 찾아요. 위아래로 10씩 바뀌는 경우도, 8씩 바뀌는 경우도 있어요.';
    const renderer=root.HFChallengeEditions||(typeof require==='function'?require('./exam-editions.js'):null);
    for(const [phase,verticalStep,points] of [
     ['example',10,[[0,0],[1,0],[1,1],[2,1],[3,1],[3,2],[2,2],[2,3]]],
     ['practice',8,[[0,0],[0,1],[1,1],[1,2],[2,2],[2,1],[3,1]]]
    ]){
     const q=a[phase],p=q.payload;p.verticalStep=verticalStep;p.points=points;p.start=phase==='example'?67:54;p.missing='end';
     p.moves=points.slice(1).map(([x,y],j)=>x>points[j][0]?'R':x<points[j][0]?'L':y>points[j][1]?'U':'D');
     let n=p.start;const steps=p.moves.map(m=>(n+=({R:1,L:-1,U:-verticalStep,D:verticalStep})[m]));
     p.end=n;p.answer=n;q.answer=n;q.answerHtml=String(n);q.answerCandidates=[n];
     q.prompt='보기에서 수가 바뀌는 규칙을 찾아보세요. 오른쪽 그림의 출발하는 수부터 화살표를 따라 빈칸을 채우고, 마지막 ㉠에 알맞은 수를 쓰세요.';
     q.problemHtml=renderer.arrowPath(p);
     q.solution=`오른쪽은 1을 더하고 왼쪽은 1을 뺍니다. 위쪽은 ${verticalStep}을 빼고 아래쪽은 ${verticalStep}을 더합니다. ${p.start} → ${steps.join(' → ')}이므로 ㉠은 ${n}입니다.`;
    }
   }
   return {id:'core-'+t.id,title:t.id==='cube-count-fill'?'점선 상자 속 쌓기나무 세기':t.label,rule:t.id==='cube-count-fill'?'아래층부터 쌓기나무를 빠짐없이 세어요.':rule,example:a.example,practice:a.practice,review:t.concept.review,coverage:['core:'+t.id],practiceMode:'application',generation:{kind:'core',typeId:t.id,...(t.id==='arrow-number-move'?{source:{round:1,section:'main',number:13}}:{})}};
  });
  for(const [id,title,rule,a,b,answer] of definitions){
   const example=fetch(a),application=typeof b==='object';
   const practice=application?fetch(b):{id:'check-'+id,typeId:'concept-check',prompt:`다음 설명이 맞으면 ○, 틀리면 ×를 쓰세요.\n${b}`,answer,answerHtml:answer==='맞음'?'○':'×',solution:`${rule} 따라서 이 설명은 ${answer==='맞음'?'맞습니다.':'틀립니다.'}`,problemHtml:'',payload:{kind:'concept-check',statement:b}};
   lessons.push({id,title,rule,example,practice,review:'풀이를 마친 뒤 문제의 조건과 마지막 물음을 다시 확인해요.',coverage:[id],practiceMode:application?'application':'concept-check',generation:{kind:'source',source:{round:a.r,section:a.s,number:a.n},...(application?{practiceSource:{round:b.r,section:b.s,number:b.n}}:{})}});
  }
  const names={'partition-three':['불규칙한 모양을 같은 세 부분으로 나누기','전체 칸 수를 세 부분으로 나누어요. 각 부분이 연결되고 돌리거나 뒤집어 같은 모양이 되는지 확인해요.'],'pattern-piece-count':['선에 따른 크고 작은 삼각형 세기','맨 위 꼭짓점에서 내려오는 선 두 개를 고르고, 어느 가로선을 밑변으로 쓰는지 나누어 빠짐없이 세어요.'],'split-three-all':['서로 다른 세 수로 가르는 모든 방법','가장 작은 수를 정한 뒤 나머지 두 수를 찾아요. 순서가 다른 같은 방법을 다시 쓰지 않아요.'],'circle-not-adjacent':['원탁의 옆이 아닌 자리','기준 친구의 양옆을 먼저 제외해요. 시계 방향 조건과 함께 빈자리를 채워요.'],'net-perspective':['전개도를 접어 겨냥도 찾기','전개도의 한 면을 기준으로 차례로 접고, 겨냥도에서 위·왼쪽·오른쪽 면의 표시와 순서를 모두 확인해요.'],'checker-stack-count':['검은색과 흰색이 번갈아 놓인 쌓기나무','맞닿는 쌓기나무의 색이 번갈아 바뀌는 것을 이용해 두 색의 개수를 각각 세어요.'],'congruent-marked-partition':['같은 모양으로 나누며 그림 하나씩','각 부분에 그림이 하나씩 들어가도록 나눈 뒤 돌리거나 뒤집어 같은 모양인지 확인해요.'],'stack-box-fill':['점선 상자에 쌓기나무 채우기','상자를 가득 채운 전체 개수에서 지금 쌓인 개수를 빼서 더 필요한 개수를 구해요.'],'stack-minimum-visible':['쌓기나무의 개수','아래층부터 쌓기나무를 하나씩 빠짐없이 세어요.'],'dice-target-bottom':['주사위 움직이기','4×4 격자의 시작 칸에서 화살표를 따라 한 칸씩 굴리고, 도착 칸에서 묻는 면을 확인해요.'],'tetra-cube-hole-count':['구멍이 있는 쌓기나무의 테트라큐브 개수','위에서 본 바탕그림에서 빈 칸을 먼저 확인한 뒤 쌓기나무를 모두 세어요. 테트라큐브 한 개는 쌓기나무 4개입니다.'],'object-length-equivalence':['연필·지우개·클립으로 길이 비교','양끝이 맞는 줄의 연필·지우개·클립을 서로 바꾸어 같은 길이를 찾아요.'],'block-build-count':['A 블록과 B 블록으로 만든 모양','한 칸 블록과 두 칸 블록이 차지한 칸을 세어 각각 몇 개 사용했는지 구해요.'],'simple-path-network':['지나간 지점을 다시 지나지 않는 길','출발점에서 갈림길을 하나씩 고릅니다. 이미 지나간 지점으로 돌아가는 길은 제외하고 첫 갈림을 기준으로 나누어 빠짐없이 세어요.'],'rod-subset-lengths':['막대를 골라 만들 수 있는 길이','사용할 막대의 조합을 정하고 길이를 더해요. 같은 길이가 여러 방법으로 만들어져도 한 번만 셉니다.'],'shortest-path-grid':['검은 지점을 피하는 최단거리','오른쪽과 위쪽으로만 가며 검은 지점을 피하는 최단 경로 수를 차례로 더해요.'],'balance-substitution-pictures':['여러 저울의 무게 관계','앞 저울에서 같은 무게인 모양을 차례로 바꾸어 마지막 접시에 필요한 개수를 구해요.']};
  names['net-colors-pair']=['서로 다른 전개도에서 마주 보는 색','서로 다른 전개도를 하나씩 접어 기준 색의 맞은편을 찾아요. 두 소문제를 섞지 않고 각각 확인해요.'];
  names['net-pips-pair']=['서로 다른 전개도에서 마주 보는 눈','서로 다른 전개도에서 마주 보는 면을 찾은 뒤, 눈의 합이 7이 되도록 빈 면을 채워요.'];
  names['equal-digits']=['같은 자리 숫자와 범위 조건','두 자리 숫자가 같은 수를 모은 뒤 크기와 짝수·홀수 조건을 차례로 확인해요.'];
  for(const collection of [specials.get(),replacements.get()])for(const [id,questions] of Object.entries(collection)){const [example,practice]=questions;if(!names[id])throw Error(`${id}: 개념 이름과 풀이 규칙이 없습니다.`);lessons.push({id,title:names[id][0],rule:names[id][1],example,practice,coverage:[id],review:'각 부분과 모든 조건을 빠짐없이 확인해요.',practiceMode:'application',generation:{kind:'special',questions:questions.map(removePictureDescriptions)}});}
  const sourceAliases=[];
  const variantProvider=root.HFChallengeVariants||(typeof require==='function'?require('./variant-provider.js'):null);
  for(const [aliasIndex,alias] of sourceAliases.entries()){
   const questions=alias.levels.map((difficulty,index)=>{
    const result=variantProvider.generate({...alias.source,difficulty,seed:(seed+810013+aliasIndex*20011+index*7001)>>>0});
    if(result.status!=='verified')throw Error(`${alias.id}: ${difficulty} 문항을 만들지 못했습니다.`);
    return copy(result.question);
   });
   lessons.push({id:alias.id,title:alias.title,rule:alias.rule,example:questions[0],practice:questions[1],review:'이동이나 선분을 한 단계씩 표시한 뒤 마지막 물음을 다시 확인해요.',coverage:[alias.id],practiceMode:'application',generation:{kind:'source',source:alias.source}});
  }
  return lessons.map((a,i)=>({...a,number:i+1,example:removePictureDescriptions(a.example),practice:removePictureDescriptions(a.practice)}));
 }
 const api={build,definitions,removePictureDescriptions};root.HFConceptCatalog=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
