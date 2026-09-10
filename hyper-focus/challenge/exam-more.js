(function(root){
  'use strict';
  // Separate authored editions. No competitor images or source pages are embedded.
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const img=(id,answer=false)=>`<img class="priority-art${answer?' more-answer':''}" src="assets/more/${id}${answer?'-answer':''}.png" alt="${answer?'정답':'문제'} 도형" width="1440" height="${answer?960:480}">`;
  const replacementSpecials=root.HFConceptReplacementSpecials||(typeof require==='function'?require('./concept-replacement-specials.js'):null);
  const all={3:{main:[],extra:[]},4:{main:[],extra:[]}};
  function add(r,s,domain,prompt,answer,solution,check,visual=null,lines=[]){
    const number=all[r][s].length+1,id=`r${r}-${s}-${number}`;
    all[r][s].push({number,sourceNumber:number,typeId:id,domain,prompt,answer,answerHtml:typeof answer==='string'?answer:Array.isArray(answer)?answer.join(', '):String(answer),solution,problemHtml:(lines.length?`<div class="edition-conditions more-conditions">${lines.map(t=>`<p>${esc(t)}</p>`).join('')}</div>`:'')+(visual?img(id):''),solutionDiagram:visual?.answer?img(id,true):'',payload:{kind:check.kind,...check},visual,id});
  }
  const A=(...args)=>add(3,'main',...args),B=(...args)=>add(4,'main',...args),X=(...args)=>add(3,'extra',...args),Y=(...args)=>add(4,'extra',...args);
  const cards=rows=>({kind:'cards',rows});
  const net=(labels,answer)=>({kind:'net',labels,answer});
  const grid=(w,h,labels,answer)=>({kind:'grid',w,h,labels,answer});
  A('수','세 식의 빈칸에 들어갈 수를 각각 구하세요. 빈칸에 가장 작은 수가 들어가는 식의 번호를 쓰세요.',2,'①은 5에 더하여 11이 되는 수이므로 11−5=6입니다. ②는 9에서 빼어 7이 되는 수이므로 9−7=2입니다. ③은 4를 빼기 전의 수이므로 5+4=9입니다. 작은 수부터 쓰면 2, 6, 9입니다. 따라서 가장 작은 수가 들어가는 식은 ②입니다.',{kind:'unknowns',equations:[[5,'+',11],[9,'-',7],[-4,'+',5]],select:'min'},cards([['①  5 + □ = 11','②  9 − □ = 7','③  □ − 4 = 5']]));
  A('지문이해','책꽂이에 그림책 18권이 있었습니다. 친구들에게 5권을 빌려준 뒤 새 그림책 9권을 꽂았습니다. 빌려준 책은 아직 돌아오지 않았습니다. 지금 책꽂이에 있는 그림책은 몇 권입니까?',22,'빌려준 5권을 먼저 빼면 13권입니다. 새 그림책 9권을 더하면 13+9=22권입니다.',{kind:'changes',start:18,changes:[-5,9]});
  A('논리추리','색 구슬을 묶음으로 놓았습니다. 묶음의 구슬 수와 색이 바뀌는 규칙을 찾아, 12번째 묶음의 색과 구슬 수를 쓰세요. 구슬 하나가 아니라 묶음의 순서를 묻는 문제입니다.','노란색 12개','묶음마다 구슬이 한 개씩 늘고, 파란색과 노란색이 번갈아 나옵니다. 짝수 번째인 12번째 묶음은 노란색 12개입니다.',{kind:'group',position:12,colors:['파란색','노란색'],mode:'group'}, {kind:'groups',counts:[1,2,3,4,5],colors:['#2788c4','#efba35']});
  A('도형','마주 보는 두 면의 색이 같은 주사위를 만들려고 합니다. 아래 종이를 선을 따라 접었을 때 조건에 맞도록 ㉠, ㉡, ㉢에 들어갈 색을 차례대로 쓰세요.','파란색, 빨간색, 노란색','가로로 네 면을 접으면 첫째와 셋째, 둘째와 넷째 면이 마주 봅니다. 위와 아래에 붙은 면도 서로 마주 보므로 파란색, 빨간색, 노란색입니다.',{kind:'net',values:['파란색','빨간색',null,null,'노란색',null],query:[2,3,5],rule:'same'},net(['파랑','빨강','㉠','㉡','노랑','㉢'],['파랑','빨강','파랑','빨강','노랑','노랑']));
  A('수','1부터 6까지의 수 중 서로 다른 세 수를 골라 합이 10이 되게 하려고 합니다. 고른 수가 같으면 순서만 바뀐 것은 같은 방법입니다. 고를 수 있는 방법은 모두 몇 가지입니까?',3,'작은 수부터 써 보면 1·3·6, 1·4·5, 2·3·5입니다. 같은 수를 두 번 쓰거나 순서만 바꾸어 다시 세지 않으므로 모두 3가지입니다.',{kind:'triples',max:6,total:10},cards([[1,2,3,4,5,6]]));
  A('도형','모눈 한 칸의 가로와 세로 길이는 같습니다. 색이 있는 선을 굽어진 곳까지 모두 따라갔을 때, 짧은 선부터 기호를 차례대로 쓰세요.','가, 나, 다','가의 길이는 8칸, 나는 10칸, 다는 12칸입니다. 시작점과 끝점 사이의 거리만 보지 말고 꺾인 선 전체를 세면 가, 나, 다 순서입니다.',{kind:'routes',paths:[[[0,0],[4,0],[4,4]],[[0,0],[2,0],[2,3],[1,3],[1,4],[4,4]],[[0,0],[4,0],[4,1],[1,1],[1,2],[4,2]]]}, {kind:'routes',paths:[[[0,0],[4,0],[4,4]],[[0,0],[2,0],[2,3],[1,3],[1,4],[4,4]],[[0,0],[4,0],[4,1],[1,1],[1,2],[4,2]]],size:4});
  A('지문이해','지민이는 지금 6살입니다. 수아는 지민이보다 2살 많고, 하린이는 수아보다 3살 어립니다. 두 해가 지난 뒤 하린이는 몇 살이 됩니까?',7,'수아는 6+2=8살이고 하린이는 8−3=5살입니다. 두 해 뒤 하린이는 5+2=7살입니다.',{kind:'changes',start:6,changes:[2,-3,2]});
  A('수','도미노의 왼쪽과 오른쪽 점이 각각 같은 규칙으로 늘어납니다. 마지막 도미노의 빈칸에는 점을 몇 개 그려야 합니까?',5,'왼쪽은 1, 2, 3, 4이고 오른쪽은 2, 3, 4, 5로 각각 한 개씩 늘어납니다. 따라서 빈칸에는 점 5개를 그립니다.',{kind:'sequence',values:[2,3,4],step:1}, {kind:'domino',pairs:[[1,2],[2,3],[3,4],[4,null]]});
  const pairs3=[[5,2],[3,7],[6,4]],links3=[[5,1,2],[3,7],[6,10,9,8,4]];
  A('논리추리','서로 다른 도형 세 종류가 두 개씩 있습니다. 같은 도형끼리 칸의 가운데를 지나도록 선으로 연결하세요. 가로나 세로로만 움직이며, 선끼리 만나거나 같은 칸을 함께 지날 수 없습니다. 도형이 있는 다른 칸을 통과할 수도 없습니다.','풀이 그림과 같이 연결','세모는 오른쪽 위아래로 바로 연결합니다. 동그라미는 위칸을 지나 연결하고, 네모는 아래쪽 세 칸을 돌아 연결하면 세 선이 만나지 않습니다.',{kind:'links',w:4,h:3,pairs:pairs3},grid(4,3,{'5':'●','2':'●','3':'▲','7':'▲','6':'■','4':'■'},links3));
  A('지문이해','유리, 민준, 서우, 다온이 차례로 발표합니다. 아래 설명을 모두 읽고, 두 번째로 발표하는 친구의 이름을 쓰세요.','유리','민준 바로 뒤가 유리이고, 유리 바로 뒤가 서우입니다. 서우보다 뒤에 다온이 있으므로 민준, 유리, 서우, 다온 순서이며 둘째는 유리입니다.',{kind:'order',names:['유리','민준','서우','다온'],before:[['서우','다온']],next:[['민준','유리'],['유리','서우']],query:1},null,['유리는 민준의 바로 뒤에 발표합니다.','서우는 유리의 바로 뒤에 발표합니다.','다온은 서우보다 뒤에 발표합니다.']);
  A('수','수 카드의 순서를 바꾸지 않고 세 빈칸에 +, −, =를 한 번씩 넣으려고 합니다. 숫자를 붙여 두 자리 수로 만들지 말고, 참인 식이 되도록 완성하세요.','9 + 2 − 3 = 8','9와 2를 더하면 11이고, 3을 빼면 8입니다. 따라서 9+2−3=8입니다. 세 기호를 한 번씩 사용하였는지 확인합니다.',{kind:'operators',numbers:[9,2,3,8],symbols:['+','-','=']},cards([['9  □  2  □  3  □  8']]));
  const tiles=[[0,0],[1,0],[2,0],[1,1],[2,1],[3,1],[3,2],[3,3]];
  A('도형','보기의 조각 중 서로 다른 두 조각을 골라 위의 모양을 빈틈없이 채우려고 합니다. 조각은 돌리거나 뒤집어도 되지만 겹칠 수 없습니다. 골라야 하는 두 조각의 번호를 쓰세요.','②, ⑤','네 칸으로 된 조각 두 개가 필요합니다. ⑤의 가운데 튀어나온 칸을 안쪽에 두고, 남은 꺾인 네 칸을 ②로 채우면 됩니다. 다른 두 조각의 조합으로는 채울 수 없습니다.',{kind:'tiles',target:tiles}, {kind:'tiles',target:tiles,answer:true});
  A('도형','마주 보는 두 면의 눈의 합이 7인 주사위입니다. 그림의 자리에서 오른쪽, 위쪽, 오른쪽으로 한 칸씩 굴립니다. 미끄러뜨리거나 제자리에서 돌리지 않을 때, 도착한 주사위의 윗면 눈은 몇 개입니까?',6,'처음에는 윗면 1, 앞면 2, 오른쪽 면 3입니다. 오른쪽으로 굴리면 윗면은 4, 위쪽으로 굴리면 윗면은 2가 됩니다. 마지막으로 오른쪽으로 굴리면 윗면은 6이므로 답은 6입니다.',{kind:'roll',top:1,front:2,right:3,moves:['R','U','R']},{kind:'die',top:1,front:2,right:3,moves:['R','U','R']});
  A('논리추리','하얀 구슬 한 개 뒤에 파란 구슬을 놓습니다. 파란 구슬은 묶음마다 한 개, 두 개, 세 개씩 늘어납니다. 이 규칙을 계속할 때, 처음부터 14번째 구슬은 무슨 색입니까?','파란색','하양 1개와 파랑 1개까지 2개, 다음 묶음까지 5개, 그다음까지 9개입니다. 다음은 하양 1개와 파랑 4개로 14개가 되므로 14번째는 파란색입니다.',{kind:'runs',position:14}, {kind:'beads',colors:['W','B','W','B','B','W','B','B','B','W','B','B'],ellipsis:true});
  A('수','세 상자에 들어갈 수를 각각 구한 뒤, 가장 큰 수와 가장 작은 수의 차를 구하세요. 상자의 모양이 같아도 이 문제에서는 서로 다른 수가 들어갈 수 있습니다.',7,'첫째 상자는 7에 더하여 11이 되는 수이므로 11−7=4입니다. 둘째 상자는 3을 빼기 전의 수이므로 8+3=11입니다. 셋째 상자는 12에서 빼어 5가 되는 수이므로 12−5=7입니다. 작은 수부터 쓰면 4, 7, 11입니다. 따라서 가장 큰 수와 가장 작은 수의 차는 11−4=7입니다.',{kind:'unknowns',equations:[[7,'+',11],[-3,'+',8],[12,'-',5]],select:'range'},cards([['7 + □ = 11','□ − 3 = 8','12 − □ = 5']]));
  A('지문이해','미술 시간에 종이 24장을 준비했습니다. 네 모둠에 4장씩 나누어 주고, 남은 종이 중 3장은 선생님이 사용했습니다. 아직 사용하지 않고 남겨 둔 종이는 몇 장입니까?',5,'네 모둠에 나누어 준 종이는 4+4+4+4=16장입니다. 24−16=8장 중 선생님이 3장을 사용했으므로 5장이 남습니다.',{kind:'distribute',total:24,groups:4,each:4,used:3});
  A('논리추리','세 친구는 서로 다른 색의 가방을 하나씩 골랐습니다. 설명을 읽고, 서진·하윤·도겸이 고른 가방의 색을 차례대로 쓰세요.','파랑, 노랑, 초록','하윤은 파랑도 초록도 아니므로 노랑입니다. 서진은 초록이 아니고 노랑은 이미 골랐으므로 파랑입니다. 남은 초록은 도겸입니다.',{kind:'assign',names:['서진','하윤','도겸'],items:['파랑','노랑','초록'],not:[[0,2],[1,0],[1,2]]},null,['서진이는 초록색 가방을 고르지 않았습니다.','하윤이는 파란색 가방도 초록색 가방도 고르지 않았습니다.','가방의 색은 파랑, 노랑, 초록입니다.']);
  A('도형','같은 상자를 두 방향에서 본 그림입니다. 각 면에는 서로 다른 도형이 하나씩 있습니다. 파란 동그라미가 그려진 면과 마주 보는 면에는 어떤 도형이 있습니까?','초록색 세모','두 그림에서 앞면의 별은 같고 윗면과 옆면이 바뀝니다. 빨간 네모를 기준으로 파란 동그라미와 초록색 세모가 서로 반대편에 있으므로 마주 보는 도형은 초록색 세모입니다.',{kind:'opposite',views:[['별','네모','동그라미'],['별','세모','네모']],query:'동그라미'}, {kind:'boxes',views:[['별','네모','동그라미'],['별','세모','네모']]});
  const walk=[0,1,2,3,7,6,5,4,8,9,10,11];
  A('논리추리','1부터 4까지 순서대로 연결하세요. 가로나 세로로 이웃한 칸으로만 움직이며 모든 칸을 한 번씩 지나야 합니다. 선은 각 칸의 가운데를 지나고, 지나간 칸을 다시 지날 수 없습니다.','풀이 그림과 같이 연결','1에서 윗줄을 따라 2로 간 뒤 오른쪽에서 내려옵니다. 가운데 줄을 왼쪽으로 지나 3에 도착하고, 아래 줄을 따라 4까지 가면 열두 칸을 한 번씩 지납니다.',{kind:'walk',w:4,h:3,checkpoints:[0,3,4,11]},grid(4,3,{'0':1,'3':2,'4':3,'11':4},[walk]));
  A('지문이해','연우가 가진 스티커보다 7장 적은 수는 15장입니다. 연우는 동생에게 4장을 주고 친구에게 3장을 받았습니다. 그 뒤 연우의 스티커는 몇 장입니까?',21,'처음에는 15+7=22장입니다. 4장을 주면 18장, 3장을 받으면 21장이 됩니다.',{kind:'changes',start:15,changes:[7,-4,3]});

  B('수','빈칸에 들어갈 수를 구하세요. 첫째 식에서 찾은 수를 둘째 식의 동그라미에도 똑같이 넣습니다. 마지막 네모 안에 들어갈 수는 얼마입니까?',8,'첫째 식에서 동그라미는 13−6=7입니다. 둘째 식은 7+9−□=8이므로 네모는 8입니다.',{kind:'chain',total:13,known:6,add:9,end:8},cards([['○ + 6 = 13'],['○ + 9 − □ = 8']]));
  B('지문이해','종이배 9개와 종이비행기 7개를 만들었습니다. 종이배 3개는 동생에게 주고, 종이비행기 4개는 새로 만들었습니다. 지금 남아 있는 종이배와 종이비행기는 모두 몇 개입니까?',17,'종이배는 9−3=6개, 종이비행기는 7+4=11개입니다. 모두 6+11=17개입니다.',{kind:'two-groups',groups:[[9,-3],[7,4]]});
  B('논리추리','파란 구슬 한 개, 노란 구슬 두 개, 파란 구슬 세 개처럼 묶음의 구슬 수를 한 개씩 늘려 놓았습니다. 묶음 사이에는 빈틈이 없습니다. 처음부터 18번째 구슬은 무슨 색입니까?','노란색','다섯째 묶음까지는 1+2+3+4+5=15개입니다. 16번째부터 21번째까지는 여섯째 묶음이며 노란색이므로 18번째도 노란색입니다.',{kind:'group',position:18,colors:['파란색','노란색'],mode:'flat'}, {kind:'groups',counts:[1,2,3,4,5],colors:['#2788c4','#efba35']});
  B('도형','아래 큰 모양을 빨간 조각 한 개, 파란 조각 한 개와 초록 조각으로 채우려고 합니다. 조각을 겹치거나 잘라서는 안 됩니다. 초록 조각은 몇 개 필요합니까?',1,'큰 모양은 작은 삼각형 여섯 칸입니다. 빨간 조각은 세 칸, 파란 조각은 두 칸을 채우므로 한 칸이 남습니다. 초록 조각 한 개로 그 칸을 채울 수 있습니다.',{kind:'pattern',cells:6,used:[3,2],unit:1},{kind:'pattern',mode:'hex'});
  B('수','아래 그림에서 연결된 두 수를 더하면 바로 위의 수가 됩니다. 이미 적힌 수를 바꾸지 말고, 모든 원 안의 수가 서로 다르도록 두 빈칸을 채우세요. ㉠, ㉡ 순서로 쓰세요.','8, 5','맨 위에서 15−7=8이므로 ㉠은 8입니다. 다음에는 8−3=5이므로 ㉡은 5입니다. 15, 7, 8, 3, 5가 모두 다릅니다.',{kind:'tree',total:15,left:7,leaf:3}, {kind:'tree',values:[15,7,'㉠',3,'㉡']});
  B('지문이해','다섯 명이 달리기를 했고 같은 등수는 없습니다. 지호는 앞에서 두 번째이고, 서윤은 뒤에서 두 번째입니다. 지호와 서윤 사이에는 몇 명이 있습니까?',1,'다섯 명 중 뒤에서 두 번째는 앞에서 네 번째입니다. 지호는 2등, 서윤은 4등이므로 두 사람 사이에는 3등 한 명이 있습니다.',{kind:'rank-gap',total:5,front:2,back:2});
  B('논리추리','도미노에 있는 점이 바뀌는 규칙을 찾아 마지막 두 빈칸에 들어갈 점의 수를 왼쪽, 오른쪽 순서로 쓰세요.','5, 2','왼쪽 점은 1, 2, 3, 4, 5로 하나씩 늘어납니다. 오른쪽 점은 6, 5, 4, 3, 2로 하나씩 줄어듭니다. 따라서 5, 2입니다.',{kind:'domino-pair',left:[1,2,3,4],right:[6,5,4,3]}, {kind:'domino',pairs:[[1,6],[2,5],[3,4],[4,3],[null,null]]});
  B('도형','마주 보는 두 면의 눈의 합이 7인 주사위를 만들려고 합니다. 종이를 접었을 때 조건에 맞도록 ㉠, ㉡, ㉢에 들어갈 눈의 수를 차례대로 쓰세요.','5, 3, 6','가로줄의 첫째 면은 셋째 면과 마주 보므로 7−2=5입니다. 둘째 면과 넷째 면은 7−4=3, 위아래 두 면은 7−1=6이 됩니다.',{kind:'net',values:[2,4,null,null,1,null],query:[2,3,5],rule:'seven'},net(['2','4','㉠','㉡','1','㉢'],['2','4','5','3','1','6']));
  B('수','숫자의 순서를 바꾸지 않고 세 빈칸에 +, −, =를 한 번씩 써서 참인 식을 완성하세요. 숫자 두 개를 붙여 두 자리 수로 만들 수는 없습니다.','7 + 4 − 2 = 9','7에 4를 더하면 11이고, 여기에서 2를 빼면 9입니다. 따라서 7+4−2=9로 완성합니다.',{kind:'operators',numbers:[7,4,2,9],symbols:['+','-','=']},cards([['7  □  4  □  2  □  9']]));
  B('지문이해','버스에 몇 명이 타고 있었습니다. 첫 정류장에서 4명이 내리고 7명이 탔습니다. 다음 정류장에서 5명이 내린 뒤 승객이 16명이 되었습니다. 처음 승객은 몇 명입니까?',18,'마지막에 내린 5명을 되돌리면 21명입니다. 앞에서 탄 7명을 빼면 14명이고, 처음 내린 4명을 더하면 18명입니다.',{kind:'reverse',end:16,changes:[-4,7,-5]});
  const pairs4=[[1,8],[0,4],[6,7]],links4=[[1,2,3,8],[0,5,10,11,12,13,14,9,4],[6,7]];
  B('논리추리','서로 다른 도형 세 종류가 두 개씩 있습니다. 같은 도형끼리 선으로 연결하세요. 가로 또는 세로로 이웃한 칸의 가운데로만 이동합니다. 서로 다른 선이 같은 칸을 지나거나 만나서는 안 되며, 다른 도형이 있는 칸도 지날 수 없습니다.','풀이 그림과 같이 연결','네모는 가운데에서 바로 연결합니다. 동그라미는 위쪽의 두 칸을 지나 연결하고, 세모는 왼쪽·아래쪽·오른쪽 가장자리를 길게 돌아 연결하면 세 선이 겹치지 않습니다.',{kind:'links',w:5,h:3,pairs:pairs4},grid(5,3,{'1':'●','8':'●','0':'▲','4':'▲','6':'■','7':'■'},links4));
  const stackBricks=[[0,0,0,1,1,2],[1,0,0,1,1,2],[3,0,0,1,1,2],[3,1,0,1,1,2],[0,2,0,2,1,1],[2,2,0,2,1,1],[0,1,0,2,1,1],[2,0,0,1,2,1],[0,1,1,2,1,1],[2,0,1,1,2,1],[0,0,2,1,2,1],[1,0,2,1,2,1]];
  const stackHeights=[[3,3,2,2],[3,3,2,2],[1,1,1,1]];
  B('도형','보기와 같은 길쭉한 블록을 눕히거나 세워 쌓았습니다. 모양의 안쪽과 바닥까지 빈 곳이 없으며 뒤에 가려진 블록도 있습니다. 사용한 길쭉한 블록은 모두 몇 개입니까?',12,'작은 정육면체 크기로 나누어 생각하면 맨 아래층은 12칸, 둘째 층은 8칸, 셋째 층은 4칸입니다. 모두 24칸이고 길쭉한 블록 하나가 두 칸을 차지하므로 12개입니다. 세운 블록은 두 층에 걸쳐 있으므로 층마다 블록 하나로 중복해서 세지 않습니다.',{kind:'bricks-stack',bricks:stackBricks,heights:stackHeights,solid:true},{kind:'bricks-stack',bricks:stackBricks,heights:stackHeights});
  B('수','1부터 7까지의 숫자 중 서로 다른 세 수를 고릅니다. 세 수의 합이 12가 되는 방법은 모두 몇 가지입니까? 고른 수가 같으면 순서만 바뀐 것은 같은 방법입니다.',5,'작은 수부터 쓰면 1·4·7, 1·5·6, 2·3·7, 2·4·6, 3·4·5입니다. 따라서 모두 5가지입니다.',{kind:'triples',max:7,total:12},cards([[1,2,3,4,5,6,7]]));
  B('논리추리','파란 구슬과 노란 구슬을 그림과 같이 묶음으로 놓습니다. 여덟 번째 묶음까지 놓았을 때, 노란 구슬은 모두 몇 개입니까?',20,'노란색은 2, 4, 6, 8번째 묶음입니다. 구슬 수는 각각 2, 4, 6, 8개이므로 2+4+6+8=20개입니다.',{kind:'group',position:8,colors:['파란색','노란색'],mode:'sumSecond'}, {kind:'groups',counts:[1,2,3,4,5],colors:['#2788c4','#efba35']});
  B('도형','마주 보는 두 면의 눈의 합이 7인 주사위입니다. 오른쪽으로 두 칸 굴린 뒤, 종이의 아래쪽으로 한 칸 굴립니다. 도착한 자리에서 바닥에 닿은 면의 눈은 몇 개입니까?',4,'오른쪽으로 두 번 굴려도 앞면 4는 바뀌지 않습니다. 아래쪽, 즉 보는 사람 쪽으로 굴리면 앞면 4가 바닥에 닿으므로 답은 4입니다.',{kind:'roll',top:2,front:4,right:1,moves:['R','R','D'],query:'bottom'},{kind:'die',top:2,front:4,right:1,moves:['R','R','D']});
  B('지문이해','은서와 도윤이는 구슬을 합하여 30개 가지고 있습니다. 은서가 도윤이에게 4개를 주어도 두 사람이 가진 구슬의 합은 바뀌지 않습니다. 준 뒤 도윤이가 17개를 가지고 있다면, 주기 전 은서는 몇 개를 가지고 있었습니까?',17,'구슬을 준 뒤 은서는 30−17=13개입니다. 은서가 준 4개를 되돌리면 주기 전에는 13+4=17개입니다.',{kind:'transfer',total:30,afterReceiver:17,moved:4});
  B('수','세 식의 빈칸에 들어갈 수를 구하세요. 가장 큰 빈칸의 수에서 가장 작은 빈칸의 수를 뺀 값은 얼마입니까?',8,'첫째 빈칸은 6에 더하여 15가 되는 수이므로 15−6=9입니다. 둘째 빈칸은 11에서 빼어 7이 되는 수이므로 11−7=4입니다. 셋째 빈칸은 5를 빼기 전의 수이므로 7+5=12입니다. 작은 수부터 쓰면 4, 9, 12입니다. 따라서 가장 큰 12에서 가장 작은 4를 빼면 12−4=8입니다.',{kind:'unknowns',equations:[[6,'+',15],[11,'-',7],[-5,'+',7]],select:'range'},cards([['6 + □ = 15','11 − □ = 7','□ − 5 = 7']]));
  const dp=[[[0,0],[2,2],[4,2]],[[0,0],[4,0],[4,2]],[[0,0],[1,1],[4,1],[4,2]]];
  B('도형','같은 크기의 모눈에 세 길을 그렸습니다. 대각선으로 간 길도 포함하여, 전체 길이가 긴 것부터 기호를 쓰세요. 대각선 한 칸과 가로 한 칸은 길이가 다릅니다.','나, 다, 가','가는 대각선 두 칸과 가로 두 칸, 나는 가로·세로 여섯 칸, 다는 대각선 한 칸과 가로·세로 네 칸입니다. 대각선 한 칸은 가로 한 칸보다 길지만 가로와 세로 한 칸을 합한 것보다 짧습니다. 따라서 나, 다, 가입니다.',{kind:'routes',paths:dp,descending:true},{kind:'routes',paths:dp,size:4});
  B('논리추리','네 친구는 서로 다른 간식을 하나씩 골랐습니다. 아래 조건을 읽고, 가람·나은·다빈·라희가 고른 간식을 차례대로 쓰세요.','빵, 떡, 과자, 요구르트','나은이는 떡, 다빈이는 과자를 골랐습니다. 가람이는 요구르트를 고르지 않았으므로 남은 빵입니다. 마지막 요구르트는 라희가 고릅니다.',{kind:'assign',names:['가람','나은','다빈','라희'],items:['빵','떡','과자','요구르트'],not:[[0,3]],fixed:[[1,1],[2,2]]},null,['간식은 빵, 떡, 과자, 요구르트입니다.','나은이는 떡을, 다빈이는 과자를 골랐습니다.','가람이는 요구르트를 고르지 않았습니다.']);
  B('지문이해','보물 상자의 수보다 8 큰 수는 31입니다. 보물 상자의 수를 먼저 찾은 뒤, 그 수보다 6 작은 수를 비밀번호로 정하려고 합니다. 비밀번호는 얼마입니까?',17,'보물 상자의 수는 31−8=23입니다. 비밀번호는 그 수보다 6 작으므로 23−6=17입니다.',{kind:'changes',start:31,changes:[-8,-6]});

  X('도형','큰 모양을 빨간 조각 한 개와 초록 조각으로만 채우려고 합니다. 겹치거나 빈 곳 없이 채우려면 초록 조각이 몇 개 필요합니까?',3,'큰 모양은 작은 삼각형 여섯 칸입니다. 빨간 조각이 세 칸을 채우고 남은 세 칸을 초록 조각 세 개로 채웁니다.',{kind:'pattern',cells:6,used:[3],unit:1},{kind:'pattern',mode:'red'});
  X('도형','그림의 전개도를 접어 마주 보는 면의 눈의 합이 7인 주사위를 만듭니다. ㉠과 ㉡에 들어갈 눈의 수의 합을 구하세요.',9,'㉠은 1과 마주 보므로 6입니다. ㉡은 4와 마주 보므로 3입니다. 따라서 두 수의 합은 6+3=9입니다.',{kind:'net',values:[1,4,null,null,2,5],query:[2,3],rule:'seven',sum:true},net(['1','4','㉠','㉡','2','5'],['1','4','6','3','2','5']));
  X('수','세 수를 모으면 14가 되고 세 수는 모두 다릅니다. 그중 하나가 8일 때, 나머지 두 수를 1부터 7 사이에서 고르는 방법은 모두 몇 가지입니까? 순서만 바뀐 것은 같은 방법입니다.',2,'나머지 두 수의 합은 14−8=6입니다. 서로 다른 두 수는 1과 5, 2와 4입니다. 3과 3은 같으므로 제외하여 2가지입니다.',{kind:'pair-sum',total:14,known:8,max:7},cards([['14'],['8','㉠','㉡']]));
  X('수','같은 종류의 막대와 클립은 길이가 같습니다. 물건을 빈틈없이 이어 놓고 두 줄의 양 끝을 맞췄습니다. 파란 막대는 빨간 막대보다 클립 몇 개만큼 더 깁니까?',3,'위에는 빨간 막대와 클립 다섯 개, 아래에는 파란 막대와 클립 두 개가 있습니다. 두 줄의 전체 길이가 같으므로 파란 막대가 클립 5−2=3개만큼 더 깁니다.',{kind:'length-difference',topUnits:5,bottomUnits:2},{kind:'length',topLeft:2,topRight:3,bottomLeft:1,bottomRight:1});
  X('수','연결된 아래 두 수를 더하면 위의 수가 됩니다. 빈칸에 들어갈 수를 모두 구하여 ㉠, ㉡ 순서로 쓰세요. 모든 원의 수는 서로 달라야 합니다.','9, 7','17−8=9이므로 ㉠은 9입니다. 9−2=7이므로 ㉡은 7입니다. 모든 원의 수가 서로 다른지도 확인합니다.',{kind:'tree',total:17,left:8,leaf:2},{kind:'tree',values:[17,8,'㉠',2,'㉡']});
  X('도형','그림은 같은 길쭉한 블록으로 만든 모양입니다. 한 블록의 크기는 작은 정육면체 두 개를 붙인 것과 같고, 뒤에 가려진 블록은 없습니다. 사용한 블록은 모두 몇 개입니까?',4,'바닥에 가로로 놓인 블록 두 개, 그 위 양쪽에 세운 블록 두 개가 있습니다. 따라서 길쭉한 블록은 모두 4개입니다.',{kind:'bricks',bricks:[[0,0,0,2,1,1],[2,0,0,2,1,1],[0,0,1,1,1,2],[3,0,1,1,1,2]]},{kind:'bricks',bricks:[[0,0,0,2,1,1],[2,0,0,2,1,1],[0,0,1,1,1,2],[3,0,1,1,1,2]]});
  Y('논리추리','흰 구슬 한 개 뒤의 파란 구슬 수가 묶음마다 한 개씩 늘어납니다. 이 규칙대로 놓을 때, 처음부터 20번째 구슬의 색을 쓰세요.','파란색','첫 네 묶음까지 2+3+4+5=14개입니다. 다음 묶음은 흰 구슬 한 개와 파란 구슬 다섯 개로 20개까지 이어집니다. 따라서 20번째는 파란색입니다.',{kind:'runs',position:20},{kind:'beads',colors:['W','B','W','B','B','W','B','B','B','W','B','B'],ellipsis:true});
  Y('도형','같은 상자를 두 방향에서 보았습니다. 각 면의 도형은 모두 다릅니다. 빨간 네모가 있는 면과 마주 보는 면의 도형을 쓰세요.','초록색 세모','앞면의 동그라미를 고정하여 두 모습을 비교합니다. 별 옆에서 서로 반대편에 있는 빨간 네모와 초록색 세모가 마주 보는 면입니다.',{kind:'opposite',views:[['동그라미','별','네모'],['동그라미','세모','별']],query:'네모'},{kind:'boxes',views:[['동그라미','별','네모'],['동그라미','세모','별']]});
  Y('논리추리','1부터 4까지 순서대로 선으로 연결하며 모든 칸을 한 번씩 지나세요. 선은 가로나 세로로 이웃한 칸의 가운데를 지나야 하며, 지나간 칸으로 되돌아갈 수 없습니다.','풀이 그림과 같이 연결','오른쪽 위에서 왼쪽으로 2까지 간 다음, 가운데 줄을 오른쪽으로 지나 3에 갑니다. 마지막으로 아래 줄을 왼쪽으로 지나 4에 도착합니다.',{kind:'walk',w:4,h:3,checkpoints:[3,0,7,8]},grid(4,3,{'3':1,'0':2,'7':3,'8':4},[walk.map(n=>Math.floor(n/4)*4+3-n%4)]));
  Y('수','숫자 카드를 순서대로 놓았습니다. 세 빈칸에 +, −, =를 한 번씩 넣어 참인 식을 완성하세요. 숫자를 붙여 두 자리 수로 만들 수는 없습니다.','6 + 3 − 4 = 5','6+3=9이고 9−4=5이므로 6+3−4=5입니다. 카드 순서를 바꾸지 않고 세 기호를 한 번씩 썼는지 확인합니다.',{kind:'operators',numbers:[6,3,4,5],symbols:['+','-','=']},cards([['6  □  3  □  4  □  5']]));
  Y('도형','그림의 모양을 보기의 서로 다른 두 조각으로 채우세요. 돌리거나 뒤집어도 되지만 겹치거나 빈 곳이 생겨서는 안 됩니다. 두 조각의 번호를 쓰세요.','②, ⑤','윗부분의 튀어나온 네 칸을 ⑤로 채우면 꺾인 네 칸이 남습니다. 남은 부분은 ②를 돌려서 채울 수 있습니다.',{kind:'tiles',target:tiles.map(([x,y])=>[3-x,y])},{kind:'tiles',target:tiles.map(([x,y])=>[3-x,y]),answer:true});
  Y('도형','정육면체를 오른쪽으로 한 칸 굴린 뒤 다시 왼쪽으로 한 칸 굴립니다. 처음 윗면에 파란 동그라미가 있었다면 마지막 윗면의 도형과 색은 무엇입니까?','파란 동그라미','오른쪽으로 한 번 굴린 움직임을 왼쪽으로 한 번 되돌리므로 처음 모습으로 돌아옵니다. 마지막 윗면도 파란 동그라미입니다.',{kind:'roll',top:1,front:2,right:3,moves:['R','L'],label:true},{kind:'die',top:'●',front:'▲',right:'★',moves:['R','L']});
  // Spatial items keep the same learned action while adding one small tracking step.
  Object.assign(all[3].main[17],{
    prompt:'같은 상자를 두 방향에서 본 그림입니다. 각 면에는 서로 다른 도형이 하나씩 있습니다. 파란 동그라미가 그려진 면과 마주 보는 면에는 어떤 도형이 있습니까?',
    answer:'빨간 네모',answerHtml:'빨간 네모',
    solution:'두 그림에서 앞면의 노란 별은 같습니다. 첫 그림의 윗면인 초록 세모가 둘째 그림에서는 오른쪽 면으로 옮겨졌습니다. 이때 첫 그림의 오른쪽 면인 파란 동그라미와 둘째 그림의 윗면인 빨간 네모가 서로 마주 보므로 답은 빨간 네모입니다.',
    payload:{kind:'opposite',views:[['별','세모','동그라미'],['별','네모','세모']],query:'동그라미'},
    visual:{kind:'boxes',views:[['별','세모','동그라미'],['별','네모','세모']]}
  });
  Object.assign(all[4].main[14],{
    prompt:'마주 보는 두 면의 눈의 합이 7인 주사위입니다. 오른쪽으로 두 칸, 종이의 아래쪽으로 한 칸, 다시 오른쪽으로 한 칸 굴립니다. 도착한 자리에서 바닥에 닿은 면의 눈은 몇 개입니까?',
    answer:6,answerHtml:'6',
    solution:'처음에는 윗면 2, 앞면 4, 오른쪽 면 1입니다. 오른쪽으로 두 번 굴리면 윗면은 5가 됩니다. 아래쪽으로 굴리면 바닥에는 4가 오고, 마지막으로 오른쪽으로 굴리면 바닥에 6이 옵니다. 따라서 답은 6입니다.',
    payload:{kind:'roll',top:2,front:4,right:1,moves:['R','R','D','R'],query:'bottom'},
    visual:{kind:'die',top:2,front:4,right:1,moves:['R','R','D','R']}
  });
  Object.assign(all[4].extra[1],{
    prompt:'같은 상자를 두 방향에서 보았습니다. 각 면의 도형은 모두 다릅니다. 파란 동그라미가 있는 면과 마주 보는 면의 도형을 쓰세요.',
    answer:'노란 별',answerHtml:'노란 별',
    solution:'두 그림에서 앞면의 빨간 네모는 같습니다. 첫 그림의 윗면인 초록 세모가 둘째 그림에서는 오른쪽 면으로 옮겨졌습니다. 이때 첫 그림의 오른쪽 면인 파란 동그라미와 둘째 그림의 윗면인 노란 별이 서로 마주 보므로 답은 노란 별입니다.',
    payload:{kind:'opposite',views:[['네모','세모','동그라미'],['네모','별','세모']],query:'동그라미'},
    visual:{kind:'boxes',views:[['네모','세모','동그라미'],['네모','별','세모']]}
  });
  Object.assign(all[4].extra[5],{
    prompt:'정육면체의 윗면에는 파란 동그라미, 앞면에는 초록 세모, 오른쪽 면에는 노란 별이 있습니다. 오른쪽으로 두 칸 굴린 뒤 종이의 위쪽으로 한 칸 굴릴 때, 마지막 윗면의 도형과 색은 무엇입니까?',
    answer:'초록 세모',answerHtml:'초록 세모',
    solution:'오른쪽으로 한 번 굴리면 윗면은 처음 왼쪽 면이 되고, 두 번 굴리면 윗면은 처음 아랫면이 됩니다. 이때 앞면의 초록 세모는 그대로입니다. 마지막에 위쪽으로 굴리면 앞면의 초록 세모가 윗면으로 올라와 답은 초록 세모입니다.',
    payload:{kind:'roll',top:1,front:2,right:3,moves:['R','R','U'],label:true},
    visual:{kind:'die',top:'●',front:'▲',right:'★',moves:['R','R','U']}
  });
  // Whole-round revision: keep accessible starters; remove repeated/answer-obvious mid-late tasks.
  const tile4=[[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[0,2],[1,2]];
  Object.assign(all[4].main[3],{
    prompt:'보기에서 서로 다른 두 조각을 골라 위의 모양을 채우세요. 조각은 돌리거나 뒤집어도 되지만 겹치거나 빈 곳이 생겨서는 안 됩니다. 두 조각의 번호를 쓰세요.',
    answer:'①, ③',answerHtml:'①, ③',
    solution:'윗줄의 네 칸은 ①로 채웁니다. 아래에 남은 두 줄의 네 칸은 ③으로 채울 수 있습니다. 다른 두 조각의 조합으로는 전체 모양을 채울 수 없습니다.',
    payload:{kind:'tiles',target:tile4},visual:{kind:'tiles',target:tile4,answer:true},solutionDiagram:img('r4-main-4',true)
  });
  const boxGroups=[[1,5,6],[2,3,7],[4,8]],boxAnswer='가: 1, 5, 6 / 나: 2, 3, 7 / 다: 4, 8';
  Object.assign(all[4].main[13],{
    prompt:'1부터 8까지의 수 카드를 한 번씩 사용하여 가, 나, 다 상자에 나누어 넣으세요. 각 상자의 수의 합이 모두 12가 되어야 합니다. 이미 놓인 카드는 바꾸지 말고 빈칸을 채우세요.',
    answer:boxAnswer,answerHtml:boxAnswer,
    solution:'다 상자의 빈칸은 12−8=4입니다. 가 상자의 남은 두 수의 합은 7이고 4는 이미 썼으므로 1과 6을 넣습니다. 나에는 남은 2와 3을 넣으면 2+3+7=12가 됩니다.',
    payload:{kind:'card-boxes',cards:[1,2,3,4,5,6,7,8],totals:[12,12,12],counts:[3,3,2],anchors:[[5],[7],[8]]},
    visual:{kind:'card-boxes',cards:[1,2,3,4,5,6,7,8],totals:[12,12,12],anchors:[[5,null,null],[7,null,null],[8,null]],answer:boxGroups},solutionDiagram:img('r4-main-14',true)
  });
  const snackNames=['가람','나은','다빈','라희'],snackItems=['빵','떡','과자','요구르트'],snackAnswer='가람: 빵·떡 / 나은: 떡·요구르트 / 다빈: 빵·과자 / 라희: 떡·요구르트';
  const snackConditions=['가람이는 빵과 떡을 좋아합니다.','나은이는 요구르트를 좋아합니다.','다빈이는 떡을 좋아하지 않습니다.','라희는 빵과 과자를 좋아하지 않습니다.','빵을 좋아하는 친구는 2명, 떡은 3명, 과자는 1명, 요구르트는 2명입니다.'];
  Object.assign(all[4].main[18],{
    prompt:'네 친구는 빵·떡·과자·요구르트 중 각각 두 가지를 좋아합니다. 설명을 읽고 좋아하면 ○, 좋아하지 않으면 ×를 표시하여 표를 완성하세요.\n'+snackConditions.join('\n'),
    answer:snackAnswer,answerHtml:snackAnswer,
    solution:'라희는 빵과 과자가 아니므로 떡과 요구르트를 좋아합니다. 요구르트를 좋아하는 두 명은 나은과 라희입니다. 다빈이는 떡과 요구르트를 좋아하지 않으므로 빵과 과자입니다. 떡을 좋아하는 세 명을 채우면 나은이도 떡을 좋아합니다.',
    payload:{kind:'preference-table',names:snackNames,items:snackItems,each:2,totals:[2,3,1,2],yes:[[0,0],[0,1],[1,3]],no:[[2,1],[3,0],[3,2]]},visual:null,solutionDiagram:'',
    problemHtml:'<table class="edition-table preference-table"><thead><tr><th></th>'+snackItems.map(s=>'<th>'+s+'</th>').join('')+'</tr></thead><tbody>'+snackNames.map(n=>'<tr><th>'+n+'</th>'+snackItems.map(()=>'<td></td>').join('')+'</tr>').join('')+'</tbody></table>'
  });
  Object.assign(all[4].main[19],{
    prompt:'스티커를 세 친구에게 똑같이 나누어 주었더니 5장이 남았습니다. 세 친구가 받은 스티커를 각각 2장씩 쓴 뒤, 각자 4장씩 가지고 있습니다. 처음 스티커는 모두 몇 장이었습니까?',
    answer:23,answerHtml:'23장',solution:'친구 한 명이 처음 받은 스티커는 4+2=6장입니다. 세 친구에게 6+6+6=18장을 나누어 주고 5장이 남았으므로 처음에는 18+5=23장이 있었습니다.',
    payload:{kind:'reverse-distribution',groups:3,afterEach:4,usedEach:2,remainder:5}
  });
  all[3].main[2].prompt=all[3].main[2].prompt.replace(' 구슬 하나가 아니라 묶음의 순서를 묻는 문제입니다.','');
  all[4].main[15].prompt='은서와 도윤이는 구슬을 합하여 30개 가지고 있습니다. 은서가 도윤이에게 구슬 4개를 주었더니 도윤이의 구슬이 17개가 되었습니다. 주기 전 은서의 구슬은 몇 개였습니까?';
  function replaceWithSpecial(target,kind,index,domain){
    if(!replacementSpecials)throw new Error('개념 교재 반영 문항을 불러오지 못했습니다.');
    const question=JSON.parse(JSON.stringify(replacementSpecials.get()[kind][index])),number=target.number,id=target.id,sourceNumber=target.sourceNumber;
    Object.assign(target,question,{number,id,sourceNumber,domain,typeId:id+'-'+kind,payload:{...question.payload},visual:null,mockConceptRevision:true});
  }
  function removePictureSentence(html,sentence){
    const escaped=sentence.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
    return String(html||'').replace(new RegExp('<text[^>]*>'+escaped+'</text>'),'');
  }
  function compactShortestPathSvg(solution){
    const cols=4,rows=3,left=110,top=32,dx=110,dy=58,blocked='2,1',ways=Array.from({length:rows+1},()=>Array(cols+1).fill(0));
    ways[rows][0]=1;
    for(let y=rows;y>=0;y--)for(let x=0;x<=cols;x++)if(!(x===0&&y===rows)&&`${x},${y}`!==blocked)ways[y][x]=(x?ways[y][x-1]:0)+(y<rows?ways[y+1][x]:0);
    let body='';
    for(let y=0;y<=rows;y++)for(let x=0;x<cols;x++)body+=`<line x1="${left+x*dx}" y1="${top+y*dy}" x2="${left+(x+1)*dx}" y2="${top+y*dy}" stroke="#8195a2" stroke-width="2.2"/>`;
    for(let x=0;x<=cols;x++)for(let y=0;y<rows;y++)body+=`<line x1="${left+x*dx}" y1="${top+y*dy}" x2="${left+x*dx}" y2="${top+(y+1)*dy}" stroke="#8195a2" stroke-width="2.2"/>`;
    for(let y=0;y<=rows;y++)for(let x=0;x<=cols;x++){
      const cx=left+x*dx,cy=top+y*dy,isBlocked=`${x},${y}`===blocked;
      body+=isBlocked?`<rect x="${cx-9}" y="${cy-9}" width="18" height="18" rx="3" fill="#263641"/>`:`<circle cx="${cx}" cy="${cy}" r="4" fill="#fff" stroke="#4f7488" stroke-width="1.5"/>`;
      if(solution&&!isBlocked)body+=`<text x="${cx}" y="${cy-14}" text-anchor="middle" font-size="11" font-weight="800" fill="#1f625e">${ways[y][x]}</text>`;
    }
    body+=`<text x="${left}" y="${top+rows*dy+25}" text-anchor="middle" font-size="14" font-weight="800" fill="#203b54">출발</text><text x="${left+cols*dx}" y="${top-17}" text-anchor="middle" font-size="14" font-weight="800" fill="#203b54">도착</text>`;
    return `<svg class="challenge-visual concept-replacement-visual" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 245" role="img" aria-label="검은 지점 한 곳을 피하는 작은 최단거리 모눈" style="width:100%;height:auto;font-family:'Malgun Gothic',sans-serif">${body}</svg>`;
  }

  Object.assign(all[3].main[0],{
    domain:'수',prompt:'버스에 몇 명이 타고 있었습니다. 첫 번째 정류장에서 9명이 내리고, 다음 정류장에서 8명이 탔더니 버스에 17명이 되었습니다. 처음 버스에 타고 있던 사람은 몇 명입니까?',
    answer:18,answerHtml:'18명',solution:'마지막 17명에서 거꾸로 생각합니다. 다음 정류장에서 타기 전에는 17−8=9명입니다. 첫 번째 정류장에서 내리기 전에는 9+9=18명이므로 처음에는 18명이 타고 있었습니다.',
    problemHtml:'',solutionDiagram:'',payload:{kind:'reverse',end:17,changes:[-9,8]},visual:null,
    conceptSourcePayload:{kind:'unknowns',select:'range',equations:[[14,'-',8],[7,'+',12]]}
  });
  const diagonalPaths=[[[0,0],[3,0],[4,1],[4,3]],[[0,0],[2,2],[5,2]],[[0,0],[0,4],[3,4]]];
  Object.assign(all[3].main[5],{prompt:'같은 크기의 모눈에 세 길을 그렸습니다. 대각선으로 간 길도 포함하여 전체 길이가 짧은 것부터 기호를 쓰세요. 대각선 한 칸과 가로 한 칸은 길이가 다릅니다.',answer:'나, 가, 다',answerHtml:'나, 가, 다',solution:'나는 대각선 두 칸과 가로 세 칸, 가는 가로·세로 다섯 칸과 대각선 한 칸, 다는 가로·세로 일곱 칸입니다. 대각선 한 칸은 가로 한 칸보다 길고 두 칸보다 짧으므로 나, 가, 다 순서입니다.',payload:{kind:'routes',paths:diagonalPaths},visual:{kind:'routes',paths:diagonalPaths,size:5},problemHtml:img('r3-main-6')});
  all[3].main[6].prompt=all[3].main[6].prompt.replace('두 해가 지난 뒤','2년이 지난 후');
  all[3].main[6].solution=all[3].main[6].solution.replace('두 해 뒤','2년이 지난 후');
  replaceWithSpecial(all[3].main[8],'shortest-path-grid',2,'논리추리');
  replaceWithSpecial(all[3].main[14],'checker-stack-count',2,'수');
  replaceWithSpecial(all[3].main[17],'tetra-cube-hole-count',1,'도형');
  for(const field of ['problemHtml','solutionDiagram'])all[3].main[17][field]=removePictureSentence(all[3].main[17][field],'같은 색의 쌓기나무 4개가 테트라큐브 1개입니다.');
  const longWalk=[0,1,6,5,10,15,16,11,12,17,18,19,14,13,8,9,4,3,2,7],longCheckpoints=[0,6,15,12,19,8,3,7];
  Object.assign(all[3].main[18],{prompt:'1부터 8까지 순서대로 연결하세요. 가로나 세로로 이웃한 칸으로만 움직이며 5×4의 모든 칸을 한 번씩 지나야 합니다. 지나간 칸은 다시 지날 수 없습니다.',answer:'풀이 그림과 같이 연결',answerHtml:'풀이 그림과 같이 연결',solution:'1에서 윗줄을 지나 2로 간 뒤 줄마다 방향을 바꾸어 지그재그로 이동합니다. 5×4의 스무 칸을 모두 한 번씩 지나 8에 도착합니다.',payload:{kind:'walk',w:5,h:4,checkpoints:longCheckpoints},visual:grid(5,4,Object.fromEntries(longCheckpoints.map((cell,index)=>[String(cell),index+1])),[longWalk]),problemHtml:img('r3-main-19'),solutionDiagram:img('r3-main-19',true)});
  replaceWithSpecial(all[3].extra[0],'congruent-marked-partition',2,'도형');
  replaceWithSpecial(all[3].extra[2],'block-build-count',1,'도형');
  replaceWithSpecial(all[3].extra[3],'object-length-equivalence',2,'수');
  replaceWithSpecial(all[3].extra[5],'stack-box-fill',2,'도형');
  Object.assign(all[3].extra[5],{prompt:'점선 상자 안에 쌓인 쌓기나무는 모두 몇 개입니까? 또, 상자를 빈틈없이 가득 채우려면 몇 개를 더 쌓아야 합니까?',answer:[all[3].extra[5].payload.placed,all[3].extra[5].payload.need],answerHtml:'(1) '+all[3].extra[5].payload.placed+'개  (2) '+all[3].extra[5].payload.need+'개',solution:'현재 쌓인 수는 각 기둥 높이의 합인 '+all[3].extra[5].payload.placed+'개입니다. 상자 전체는 '+all[3].extra[5].payload.full+'개이므로 '+all[3].extra[5].payload.full+'−'+all[3].extra[5].payload.placed+'='+all[3].extra[5].payload.need+'개를 더 쌓아야 합니다.',payload:{...all[3].extra[5].payload,kind:'cube-count-fill-custom'}});

  const hardTile=[[2,1],[2,2],[2,3],[3,3],[0,0],[1,0],[0,1],[1,1]];
  Object.assign(all[4].main[3],{prompt:'보기의 서로 다른 두 조각을 골라 계단처럼 꺾인 모양을 빈틈없이 채우세요. 조각은 돌리거나 뒤집어도 되지만 겹칠 수 없습니다.',answer:'②, ③',answerHtml:'②, ③',solution:'왼쪽 위의 네 칸은 ③ 정사각형 조각으로 채우고, 오른쪽으로 꺾여 내려가는 네 칸은 ② 조각을 돌려 채웁니다. 가능한 서로 다른 조각의 짝은 ②와 ③뿐입니다.',payload:{kind:'tiles',target:hardTile},visual:{kind:'tiles',target:hardTile,answer:true},problemHtml:img('r4-main-4'),solutionDiagram:img('r4-main-4',true)});
  const farPairs=[[9,1],[11,7],[12,3]],farLinks=[[9,14,19,18,17,16,15,10,5,0,1],[11,6,7],[12,13,8,3]],farLabels={'9':'●','1':'●','11':'▲','7':'▲','12':'■','3':'■'};
  Object.assign(all[4].main[10],{prompt:'서로 옆에 있지 않은 같은 도형끼리 선으로 연결하세요. 가로나 세로로 이웃한 칸의 가운데로만 움직이며, 선끼리 만나거나 같은 칸을 함께 지날 수 없습니다.',answer:'풀이 그림과 같이 연결',answerHtml:'풀이 그림과 같이 연결',solution:'동그라미는 왼쪽 가장자리를 크게 돌아 연결하고, 세모는 가운데에서 꺾어 연결하며, 네모는 오른쪽 두 칸을 지나 연결합니다. 세 선은 서로 만나지 않습니다.',payload:{kind:'links',w:5,h:4,pairs:farPairs},visual:grid(5,4,farLabels,farLinks),problemHtml:img('r4-main-11'),solutionDiagram:img('r4-main-11',true)});
  replaceWithSpecial(all[4].main[11],'block-build-count',2,'도형');
  all[4].main[11].conceptSourceTypeId='r4-main-12';
  all[4].main[11].conceptSourcePayload={kind:'geo-stack',heights:[[2,2,1],[2,1,1]],solid:true};
  all[4].main[11].conceptSourcePrompt='같은 길쪽한 블록으로 만든 모양입니다. 누워 놓은 블록과 세워 놓은 블록을 구별하여 사용한 블록은 모두 몇 개인지 구하세요.';
  replaceWithSpecial(all[4].main[16],'balance-substitution-pictures',2,'수');
  all[4].main[16].conceptSourceTypeId='r4-main-17';
  all[4].main[16].conceptSourcePayload={kind:'unknowns',select:'minimum-index',equations:[[12,'-',7],[6,'+',15],[18,'-',9],[8,'+',14]]};
  replaceWithSpecial(all[4].main[17],'congruent-marked-partition',2,'도형');

  replaceWithSpecial(all[4].extra[0],'object-length-equivalence',1,'수');
  replaceWithSpecial(all[4].extra[1],'checker-stack-count',1,'도형');
  replaceWithSpecial(all[4].extra[2],'tetra-cube-hole-count',1,'도형');
  replaceWithSpecial(all[4].extra[3],'shortest-path-grid',1,'도형');
  Object.assign(all[4].extra[3],{
    prompt:'출발점에서 도착점까지 오른쪽 또는 위쪽으로만 최단거리로 가려고 합니다. 검은 지점 1개를 지나지 않는 길은 모두 몇 가지일까요?',
    answer:17,answerHtml:'17가지',solution:'각 지점까지 오는 길의 수를 아래와 왼쪽에서 오는 수의 합으로 적습니다. 검은 지점은 0으로 두면 도착점의 수는 17이므로 모두 17가지입니다.',
    problemHtml:compactShortestPathSvg(false),solutionDiagram:compactShortestPathSvg(true),payload:{kind:'shortest-path-grid',cols:4,rows:3,blocked:[[2,1]],directions:['E','N'],responseMode:'shortest-path-count'}
  });
  replaceWithSpecial(all[4].extra[4],'stack-box-fill',1,'도형');
  replaceWithSpecial(all[4].extra[5],'simple-path-network',1,'논리추리');
  for(const field of ['problemHtml','solutionDiagram']){
    all[4].extra[0][field]=removePictureSentence(all[4].extra[0][field],'같은 연필·지우개·클립은 각각 길이가 같습니다.');
    all[4].extra[1][field]=removePictureSentence(all[4].extra[1][field],'맞닿은 쌓기나무는 검은색과 흰색이 번갈아 놓입니다.');
    all[4].extra[1][field]=removePictureSentence(all[4].extra[1][field],'검은색과 흰색 쌓기나무를 각각 세어 보세요.');
  }
  function get(round,section='main'){
    if(!all[round])throw new Error('지원하지 않는 회차');
    return {round,title:section==='main'?'6세 챌린지 시험':'추가 연습',editionId:`challenge-authored-${round}`,generationPolicy:'fixed-authored',questions:all[round][section]};
  }
  const api={get,all};root.HFChallengeMore=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
