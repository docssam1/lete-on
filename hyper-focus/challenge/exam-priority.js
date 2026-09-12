(function(root){
  'use strict';
  // Authored replacements for the two challenge exams only. Sources stay read-only.
  const art=(name,alt,solution=false)=>`<img class="priority-art${solution?' priority-solution':''}" src="assets/priority/${name}.png" alt="${alt}" width="1320" height="440">`;
  const replacementSpecials=root.HFConceptReplacementSpecials||(typeof require==='function'?require('./concept-replacement-specials.js'):null);
  const make=(number,id,domain,prompt,answer,answerHtml,solution,payload,diagram=false)=>({number,typeId:'priority-'+id,domain,prompt,problemHtml:art(id,payload.alt),answer,answerHtml,solution,solutionDiagram:diagram?art(id+'-answer','정답 풀이 그림',true):'',payload:{typeId:'priority-'+id,kind:'priority-'+id,...payload},priorityReplacement:true});
  function entries(){
    return {
      main:{
        1:{14:make(14,'length-units','수',
          '같은 종류의 클립은 길이가 같습니다. 연필과 크레파스의 양쪽에 클립을 빈틈없이 이어 놓고 두 줄의 양 끝을 맞췄습니다. 연필은 크레파스보다 클립 몇 개만큼 더 깁니까?',
          3,'클립 3개만큼',
          '연필의 양쪽에는 클립이 모두 2개, 크레파스의 양쪽에는 모두 5개 있습니다. 두 줄의 전체 길이가 같으므로 클립이 적게 놓인 쪽의 물건이 더 깁니다. 따라서 연필이 크레파스보다 클립 5−2=3개만큼 더 깁니다.',
          {topLeft:1,topRight:1,bottomLeft:2,bottomRight:3,pencilUnits:6,crayonUnits:3,alt:'연필과 클립 두 개의 줄, 크레파스와 클립 다섯 개의 줄이 양 끝을 맞춘 그림'})},
        2:{
          12:make(12,'route-count','논리추리',
            '출발점에서 도착점까지 그림의 길을 따라 가려고 합니다. 오른쪽이나 위쪽으로만 움직이고, 별이 있는 곳을 꼭 지나야 합니다. ×로 막힌 길은 지나갈 수 없을 때, 갈 수 있는 방법은 모두 몇 가지입니까?',
            4,'4가지','출발점에서 별까지는 오른쪽으로 간 뒤 위로 가거나, 위로 간 뒤 오른쪽으로 가는 두 가지입니다. 별에서 도착점까지는 위·오른쪽·오른쪽 또는 오른쪽·위·오른쪽의 두 가지입니다. 별까지 가는 각각의 방법에 뒤의 두 방법을 이어 붙이면 모두 4가지입니다.',
            {columns:3,rows:2,start:[0,0],end:[3,2],via:[1,1],blocked:[[[2,1],[3,1]]],alt:'오른쪽과 위쪽 길로 연결된 출발점, 별, 도착점과 막힌 길'}),
          18:make(18,'diagonal-length','도형',
            '같은 크기의 모눈에 색이 있는 선 세 개를 그렸습니다. 모눈 한 칸의 가로 길이를 1로 보고, 굽어진 부분까지 따라가며 선의 전체 길이를 비교하세요. (1) 짧은 것부터 기호를 쓰세요. (2) 가장 긴 선과 가장 짧은 선의 길이 차는 얼마입니까?',
            [['나','가','다'],2],'(1) 나 → 가 → 다  (2) 2',
            '세 선에는 같은 크기의 모눈을 가로지르는 대각선이 각각 두 개씩 있습니다. 이 부분의 길이는 서로 같습니다. 나머지 가로 부분은 가 5, 나 4, 다 6이므로 나 → 가 → 다 순서입니다. 가장 긴 다와 가장 짧은 나의 차는 6−4=2입니다. 대각선 한 칸을 가로 한 칸과 같은 길이로 세면 안 됩니다.',
            {columns:8,rows:4,labels:['가','나','다'],paths:[[[0,1],[2,1],[3,2],[1,2],[2,3],[3,3]],[[0,1],[1,1],[2,2],[4,2],[5,3],[6,3]],[[0,1],[3,1],[4,2],[2,2],[3,3],[4,3]]],alt:'가 나 다 세 모눈 위의 가로와 대각선으로 이루어진 색 선'})
        }
      },
      extra:{
        1:{
          2:make(2,'cube-top-view','도형',
            '같은 크기의 쌓기나무를 그림처럼 쌓았습니다. 위에서 똑바로 내려다본 모양을 보기에서 찾아 번호에 동그라미 하세요. 그림과 보기의 ‘앞’ 방향을 맞추어 생각합니다.',
            3,'③','위에서 보면 쌓기나무가 놓인 자리만 보이고, 같은 자리에 두 개를 쌓아도 한 칸으로 보입니다. 앞에서부터 세 칸, 왼쪽 한 칸, 뒤쪽 왼쪽 두 칸이 보이는 ③입니다. 앞 방향을 바꾸거나 옆면까지 칸으로 세지 않습니다.',
            {heights:[[2,1,0],[1,0,0],[1,1,1]],options:[[0,1,2,3,6,7],[0,1,3,4,6,7],[0,1,3,6,7,8],[0,1,2,5,7,8]],alt:'앞 방향이 표시된 쌓기나무와 위에서 본 모양 보기 네 개'},true),
          3:make(3,'fold-holes','도형',
            '종이의 왼쪽 절반을 오른쪽으로 접고, 다시 위쪽 절반을 아래쪽으로 접었습니다. 접힌 종이에 그림처럼 구멍 하나를 끝까지 뚫었습니다. 종이를 모두 펼쳤을 때 구멍이 생기는 칸을 오른쪽 빈 모눈에 모두 동그라미 하세요.',
            [1,2,13,14],'맨 윗줄의 둘째·셋째 칸, 맨 아랫줄의 둘째·셋째 칸',
            '아래쪽으로 접은 것을 먼저 펼치면 구멍은 같은 세로줄의 맨 위와 맨 아래에 생깁니다. 오른쪽으로 접은 것도 펼치면 각각 왼쪽에도 생깁니다. 따라서 맨 윗줄과 맨 아랫줄의 둘째·셋째 칸, 모두 네 칸에 동그라미 합니다.',
            {size:4,folds:['left-to-right','top-to-bottom'],hole:[2,3],alt:'왼쪽에서 오른쪽, 위에서 아래로 접는 두 단계와 구멍 위치, 펼칠 빈 모눈'},true)
        },
        2:{2:make(2,'card-rank','수',
          '숫자 카드 네 장 중 두 장을 골라 두 자리 수를 만듭니다. 한 수를 만들 때 같은 카드를 두 번 쓸 수 없습니다. 만들 수 있는 수 중 두 번째로 큰 수와 세 번째로 작은 수의 차를 구하세요.',
          45,'45','만들 수 있는 두 자리 수를 작은 것부터 쓰면 20, 24, 27, 40, 42, 47, 70, 72, 74입니다. 두 번째로 큰 수는 72, 세 번째로 작은 수는 27이므로 차는 72−27=45입니다. 0은 십의 자리에 놓을 수 없습니다.',
          {cards:[4,0,7,2],digits:2,largestRank:2,smallestRank:3,alt:'순서가 섞인 숫자 카드 4 0 7 2'})}
      }
    };
  }
  const mainOrders={
    1:[3,2,10,4,5,6,7,8,9,1,11,12,13,14,15,16,17,18,19,20],
    2:[15,2,3,4,5,6,7,8,9,10,11,12,13,14,1,16,17,18,19,20]
  };
  function special(kind,index,number,domain,sourceNumber){
    if(!replacementSpecials)throw new Error('개념 교재 반영 문항을 불러오지 못했습니다.');
    const question=JSON.parse(JSON.stringify(replacementSpecials.get()[kind][index]));
    const typeId='mock-'+kind;
    return {...question,number,sourceNumber,domain,typeId,payload:{...question.payload,typeId},mockConceptRevision:true};
  }
  function visibleDiceSpecial(index,number,domain,sourceNumber){
    if(!replacementSpecials||typeof replacementSpecials.cloneDiceFinishVisibleFaces!=='function')throw new Error('공통 주사위 움직이기 문항을 불러오지 못했습니다.');
    const question=replacementSpecials.cloneDiceFinishVisibleFaces()[index],typeId='mock-dice-target-bottom';
    if(!question)throw new Error('공통 주사위 움직이기 문항 번호가 올바르지 않습니다.');
    return {...question,number,sourceNumber,domain,typeId,payload:{...question.payload,kind:'dice-visible-faces',typeId},mockConceptRevision:true};
  }
  function apply(exam,section='main'){
    const changes=entries()[section][exam.round]||{};
    const authored=exam.questions.map(q=>changes[q.number]||q);
    const questions=section==='main'?mainOrders[exam.round].map((n,i)=>({...authored.find(q=>q.number===n),sourceNumber:n,number:i+1})):authored;
    if(section==='main'&&exam.round===1){
      questions[2]=special('balance-substitution-pictures',2,3,'논리추리',questions[2].sourceNumber);
      questions[2].prompt='앞의 양팔저울은 모두 평형을 이루고 있습니다. 앞의 관계를 이용하여 마지막 저울이 평형을 이루도록 오른쪽 접시에 하트를 몇 개 놓아야 할까요?';
      questions[11]=visibleDiceSpecial(0,12,'도형',questions[11].sourceNumber);
      questions[13]=special('object-length-equivalence',2,14,'수',questions[13].sourceNumber);
      questions[13].solution='둘째 관계에서 지우개 1개는 클립 4개와 같습니다. 첫째 관계의 양끝을 맞추어 비교하면 연필 1개는 클립 9개와 같은 길이입니다.';
    }
    return {...exam,editionId:(exam.editionId||'extra')+'-priority-v1'+(section==='main'?'-gentle-start-v1':''),questions};
  }
  const api=Object.freeze({entries,apply,mainOrders});root.HFChallengePriority=api;
  if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
