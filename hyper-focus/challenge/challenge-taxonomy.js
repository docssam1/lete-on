(function(root){
 'use strict';
 // Preserve Hyper Focus domain semantics and separate patterns; subtype IDs describe the task, not its position.
 const areas={space:'공간 지각',plane:'평면 지각',number:'수와 연산',rules:'규칙',logic:'논리 추리',count:'경우의 수',solve:'문제 해결',reading:'지문 이해'};
 const subareas={solid:['space','쌓기나무와 입체'],net:['space','전개도와 회전'],transform:['plane','대칭과 변환'],shape:['plane','도형의 구성과 개수'],calculation:['number','수와 식'],properties:['number','수의 조건'],pattern:['number','규칙 찾기'],order:['logic','순서와 위치'],matching:['logic','조건에 맞게 짝짓기'],selection:['count','빠짐없이 고르기'],path:['count','길과 배치'],measurement:['solve','길이와 무게'],quantity:['solve','전체와 부분'],story:['reading','변화와 관계 읽기']};
 subareas.pattern[0]='rules';
 const definitions={
  cube:['solid','쌓기나무 채우기','기둥별 높이를 적고 전체와 현재 개수를 구분해 다시 풀어 보세요.'],
  bricks:['solid','길쭉한 블록 세기','눕힌 블록과 세운 블록, 뒤에 가려진 블록을 층별로 나누어 확인하세요.'],
  view:['solid','위에서 본 모양','앞 방향을 맞춘 뒤 같은 바닥 자리에 겹치는 블록을 확인하세요.'],
  netColor:['net','전개도의 마주 보는 색','기준 면을 정하고 접었을 때 서로 맞닿지 않는 두 면을 찾아보세요.'],
  netPips:['net','전개도의 마주 보는 눈','마주 보는 면을 먼저 짝지은 뒤 눈의 합 조건을 확인하세요.'],
  roll:['net','주사위 굴리기','한 칸마다 윗면·앞면·옆면의 변화를 적어 보세요.'],
  opposite:['net','두 시점에서 마주 보는 면','두 그림에 함께 나온 면을 기준으로 나머지 면의 위치를 맞춰 보세요.'],
  rectangles:['shape','선을 따라 사각형 세기','작은 모양과 합친 큰 모양을 나누어 중복 없이 세어 보세요.'],
  triangles:['shape','선을 따라 삼각형 세기','밑변과 꼭짓점을 하나씩 정하고 선이 이어지는지 확인하세요.'],
  tiles:['shape','조각으로 모양 채우기','조각을 돌리고 뒤집어 빈 곳과 겹친 곳이 없는지 확인하세요.'],
  partition:['shape','조건에 맞게 같은 모양으로 나누기','칸 수뿐 아니라 모양과 각 부분의 그림 조건을 함께 확인하세요.'],
  patternBlocks:['shape','패턴블록으로 채우기','조각의 크기 관계와 사용할 조각 수를 함께 확인하세요.'],
  mirror:['transform','모눈의 거울상','거울 선에서 꼭짓점까지의 칸 수를 양쪽에서 맞춰 보세요.'],
  rotation:['transform','돌려서 같은 그림 찾기','기준 칸을 정해 돌리되 뒤집지 않았는지 확인하세요.'],
  fold:['transform','접은 종이의 구멍','마지막 접기부터 거꾸로 펼치며 접힌 선 양쪽에 위치를 표시하세요.'],
  digital:['transform','거울 속 디지털 식','숫자 모양과 식 전체의 순서를 함께 되돌려 보세요.'],
  analogy:['transform','안팎 도형의 변화','안쪽과 바깥쪽 도형이 각각 어떻게 바뀌는지 확인하세요.'],
  split:['calculation','수 가르기와 모으기','위의 수와 연결된 아래 두 수의 합을 하나씩 확인하세요.'],
  tree:['calculation','서로 다른 수로 가르기','합 조건을 푼 뒤 이미 쓴 수와 겹치지 않는지 확인하세요.'],
  unknown:['calculation','빈칸 수를 구해 비교하기','빈칸마다 수를 구한 뒤 마지막에 묻는 크기나 차를 확인하세요.'],
  symbols:['calculation','같은 기호의 수 찾기','같은 그림에 같은 수를 넣고 식을 차례로 확인하세요.'],
  operators:['calculation','기호를 넣어 참인 식 만들기','숫자 순서를 유지하고 등호 양쪽 값을 비교하세요.'],
  magic:['calculation','직선 위 수의 합','각 직선에 속한 원을 표시하고 모든 직선의 합을 검산하세요.'],
  dominoSum:['calculation','도미노 테두리의 합','모서리 점이 어느 변에 포함되는지 확인하며 변별로 더하세요.'],
  constraints:['properties','여러 수 조건을 함께 만족하기','범위·자리·짝홀 조건을 하나씩 확인하며 후보를 지워 보세요.'],
  digits:['properties','자리 숫자의 합과 차','십의 자리와 일의 자리를 구분하고 두 조건을 모두 확인하세요.'],
  cycle:['pattern','반복되는 그림 규칙','반복되는 한 묶음을 표시하고 묻는 번째를 찾아보세요.'],
  matrix:['pattern','가로·세로 도형 규칙','가로와 세로, 안팎 도형의 규칙을 따로 비교하세요.'],
  triangleRule:['pattern','삼각형 수의 규칙','빈칸 없는 모든 그림에서 같은 계산이 맞는지 확인하세요.'],
  mountain:['pattern','늘어나는 수 배열 세기','각 줄에서 필요한 숫자의 개수를 구해 더하세요.'],
  arrows:['pattern','방향에 따른 수 이동','보기에서 각 방향의 변화량을 찾고 한 칸씩 계산하세요.'],
  machine:['pattern','수 상자의 규칙과 역산','들어간 수와 나온 수의 규칙을 찾고 빈 입력은 거꾸로 계산하세요.'],
  code:['pattern','그림으로 나타낸 수','각 표시의 값을 찾고 함께 표시된 값들을 합쳐 보세요.'],
  domino:['pattern','도미노 점의 규칙','왼쪽 점과 오른쪽 점이 변하는 규칙을 따로 찾아보세요.'],
  groups:['pattern','늘어나는 묶음의 규칙','묶음의 순서인지 구슬 하나의 순서인지 구분해 누적 개수를 적어 보세요.'],
  runs:['pattern','늘어나는 색의 배열','색이 바뀌는 자리까지 개수를 차례로 더해 보세요.'],
  periods:['pattern','색과 모양의 다른 반복','색의 반복과 모양의 반복을 따로 찾고 같은 번째를 맞춰 보세요.'],
  order:['order','조건을 연결해 순서 찾기','붙어 있는 관계를 먼저 놓고 나머지 조건을 모두 확인하세요.'],
  between:['order','사이와 가운데 위치','가능한 순서를 놓아 보고 가운데가 정해지는지 확인하세요.'],
  rank:['order','앞뒤 순서와 사이의 수','전체 자리를 그려 앞과 뒤의 위치를 같은 기준으로 옮기세요.'],
  circle:['order','원탁의 방향과 이웃','기준 자리를 고정하고 시계 방향과 이웃 조건을 나누어 확인하세요.'],
  assignment:['matching','표를 그려 조건 추리','확실한 짝과 불가능한 짝을 표에 표시하고 남은 조건을 확인하세요.'],
  combinations:['selection','합이 되는 카드 고르기','작은 수부터 정해 같은 카드 조합을 두 번 세지 않도록 적어 보세요.'],
  triples:['selection','서로 다른 세 수 고르기','가장 작은 수를 고정한 뒤 나머지 두 수를 차례로 찾아보세요.'],
  missing:['selection','빠진 색칠 조합 찾기','가능한 위치 조합을 순서대로 그려 이미 있는 그림을 지우세요.'],
  distribution:['selection','카드를 한 번씩 나누기','한 상자에서 쓴 카드를 표시하며 나머지 상자의 합을 확인하세요.'],
  cardRank:['selection','카드로 수를 만들어 순서 정하기','만들 수 있는 수를 크기순으로 적고 원하는 순서를 찾아보세요.'],
  routeCount:['path','조건이 있는 길의 가짓수','필수 지점과 막힌 길을 먼저 표시하고 갈림길별로 나누어 세세요.'],
  links:['path','겹치지 않게 같은 도형 연결','다른 선이 지날 자리를 남기며 가로·세로로만 연결하세요.'],
  walk:['path','모든 칸을 한 번씩 지나기','숫자 순서를 지키고 남는 칸이나 두 번 지나는 칸이 없는지 확인하세요.'],
  length:['measurement','물건으로 길이 비교','양 끝이 같은 두 줄에서 공통 부분을 빼고 남은 단위를 비교하세요.'],
  orthogonal:['measurement','꺾인 선의 길이','가로와 세로의 한 칸 길이를 모두 세어 합하세요.'],
  diagonal:['measurement','대각선이 있는 길이 비교','가로·세로 칸 수와 대각선 수를 따로 적어 같은 부분끼리 비교하세요.'],
  balance:['measurement','수평 저울의 무게 바꾸기','같은 무게의 묶음을 다른 저울에 대신 넣어 비교하세요.'],
  balanceOrder:['measurement','기울어진 저울의 무게 순서','내려간 접시가 무겁다는 비교를 이어 전체 순서를 확인하세요.'],
  difference:['quantity','합과 차로 두 수 찾기','전체에서 차이를 제외하고 남은 양을 똑같이 나누세요.'],
  remainder:['quantity','남은 양을 나누기','이미 사용한 양을 먼저 빼고 남은 양의 분배 조건을 확인하세요.'],
  transfer:['quantity','옮겨도 같은 전체','옮기기 전후에 변하지 않는 전체와 한 사람의 변화를 구분하세요.'],
  pyramid:['quantity','카드 배치에 따른 합 비교','아래 카드의 위치를 바꾸어 위로 더할 때의 차이를 비교하세요.'],
  pairs:['quantity','같은 종류를 짝지어 없애기','종류마다 두 개씩 묶고 짝이 없는 것만 확인하세요.'],
  changes:['story','양이 바뀌는 이야기','늘어난 양과 줄어든 양을 이야기 순서대로 적어 보세요.'],
  reverse:['story','처음 수를 거꾸로 찾기','마지막 수에서 시작하여 이야기의 변화를 반대로 계산하세요.'],
  reverseGroups:['story','똑같이 나눈 뒤 처음 양 찾기','한 사람에게 남은 양을 먼저 찾고 사용한 양을 되돌린 뒤 전체를 구하세요.'],
  age:['story','나이 관계 연결하기','기준 나이에서 관계를 연결하고 몇 년 뒤인지 마지막에 확인하세요.'],
  family:['story','많고 적은 관계 연결하기','누구를 기준으로 많고 적은지 관계를 차례로 적어 보세요.']
 };
 const byType={};
 function bind(key,ids){ids.split(' ').forEach(id=>byType[id]=key);}
 bind('cube','cube-count-fill');bind('rectangles','rectangle-count extra-general-quadrilateral-count');bind('code','four-cell-code extra-circle-bar-code');bind('split','split-merge-chain');bind('order','animal-race-order apartment-floor-order replace-student-queue');bind('combinations','card-sum-count');bind('difference','total-difference');bind('family','family-comparison');bind('rank','line-position-total');bind('mountain','mountain-digit-count');bind('triangleRule','triangle-number-rule');bind('rotation','rotated-grid-pair');bind('cycle','cyclic-picture-pattern replace-divided-square-cycle replace-line-rotation-series');bind('constraints','number-property-filter replace-count-constraints extra-digit-multiselect extra-maximum-under-conditions');bind('balance','balance-weight-order');bind('reverse','inverse-story-problem r2-orange-reverse r2-bird-departure r2-number-reference-reading');bind('arrows','arrow-number-move');bind('symbols','symbol-equation r2-fruit-equations');bind('pyramid','minimum-sum-pyramid');bind('between','replace-house-between');bind('remainder','replace-paper-remainder');bind('age','replace-age-chain');bind('length','priority-length-units');bind('mirror','r2-grid-mirror-polygon');bind('missing','replace-missing-star-combination');bind('digits','r2-digit-constraint');bind('matrix','replace-compound-matrix');bind('circle','r2-circular-seating');bind('magic','replace-magic-triangle');bind('pairs','replace-fruit-pair-cancel');bind('routeCount','priority-route-count');bind('dominoSum','r2-domino-side-sums');bind('balanceOrder','r2-three-balance-order');bind('diagonal','priority-diagonal-length');bind('triangles','r2-triangle-enumeration');bind('assignment','r2-fruit-logic-table');bind('reverse','r2-number-machines');bind('view','priority-cube-top-view');bind('fold','priority-fold-holes');bind('partition','extra-congruent-partition');bind('analogy','extra-inside-outside-analogy');bind('digital','extra-digital-mirror');bind('cardRank','priority-card-rank');bind('distribution','extra-card-distribution');bind('periods','extra-independent-color-shape-period');
 byType['r2-number-machines']='machine';
 const positions={
  '3-main':['unknown','changes','groups','netColor','triples','orthogonal','age','domino','links','order','operators','tiles','roll','runs','unknown','remainder','assignment','opposite','walk','reverse'],
  '4-main':['symbols','changes','groups','tiles','tree','rank','domino','netPips','operators','reverse','links','bricks','triples','distribution','roll','transfer','unknown','diagonal','assignment','reverseGroups'],
  '3-extra':['patternBlocks','netPips','triples','length','tree','bricks'],
  '4-extra':['runs','opposite','walk','operators','tiles','roll']
 };
 Object.entries(positions).forEach(([prefix,list])=>list.forEach((key,i)=>byType['r'+prefix+'-'+(i+1)]=key));
 // The revised mock papers intentionally replace several position-based types.
 // Bind their authored IDs to the concept-book family that is actually shown.
 bind('balance','mock-balance-substitution-pictures r4-main-17-balance-substitution-pictures');
 bind('roll','mock-dice-target-bottom');
 bind('length','mock-object-length-equivalence r3-extra-4-object-length-equivalence r4-extra-1-object-length-equivalence');
 bind('diagonal','r3-main-6');
 bind('routeCount','r3-main-9-shortest-path-grid r4-extra-4-shortest-path-grid r4-extra-6-simple-path-network');
 bind('cube','r3-main-15-checker-stack-count r3-extra-6-stack-box-fill r4-extra-2-checker-stack-count r4-extra-5-stack-box-fill');
 bind('bricks','r3-main-18-tetra-cube-hole-count r3-extra-3-block-build-count r4-main-12-block-build-count r4-extra-3-tetra-cube-hole-count');
 bind('partition','r3-extra-1-congruent-marked-partition r4-main-18-congruent-marked-partition');
 bind('reverse','r3-main-1');
 function getTaxonomy(question,round,section='main'){
  const source=question.sourceQuestion||question;
  const sourceTypeId=source.typeId||question.typeId;
  const key=byType[sourceTypeId];
  if(!key)throw new Error('분류 확인 필요: '+sourceTypeId);
  const [subareaId,typeLabel,nextStep]=definitions[key];const [areaId,subareaLabel]=subareas[subareaId];
  return {areaId,areaLabel:areas[areaId],subareaId,subareaLabel,typeId:key,typeLabel,sourceTypeId,nextStep};
 }
 const api={version:'challenge-taxonomy-v1',areas,subareas,getTaxonomy};root.HFChallengeTaxonomy=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
