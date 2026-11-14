(function(root){
 'use strict';
 const VERSION='self-check-comments/v1';
 const WORDING_LABELS={"wm-common1-basic-r01":{"15":{"old":"이차방정식과 대칭식","current":"이차방정식과 식의 값"},"47":{"old":"줄 세우기와 여사건","current":"줄 세우기와 반대 경우"}},"wm-common1-basic-r02":{"6":{"old":"전개식의 계수 비교","current":"식의 전개와 식의 값"},"20":{"old":"정의역과 이차함수의 최댓값","current":"x의 값의 범위와 이차함수의 최댓값"}},"wm-common1-basic-r03":{"13":{"old":"완전제곱식과 실근","current":"완전제곱식과 해"}},"wm-common1-basic-r04":{"17":{"old":"일차함수의 변화량과 함숫값","current":"일차함수의 변화량과 값"}},"wm-common1-basic-final":{"16":{"old":"일차함수의 식 비교","current":"일차함수의 값과 식"}},"sh-selection-r01":{"1":{"old":"시계 시간 오차 모델링","current":"두 시계의 시간 차와 처음 맞춘 시각"},"6":{"old":"시침·분침 상대각의 시간 역산","current":"시곗바늘 사이의 각과 시각"},"14":{"old":"최댓값·최솟값 경우 분기와 순서쌍","current":"경우 나누기와 최댓값·최솟값"},"15":{"old":"매개변수 해 조건","current":"문자의 값과 방정식의 해"},"16":{"old":"이자 관계식 모델링","current":"이자와 금액의 관계"},"22":{"old":"남은 승패열의 경우 계수","current":"남은 승패 순서의 경우의 수"},"33":{"old":"정수근 매개변수 조건","current":"해가 정수일 때 문자의 값"},"34":{"old":"매개변수와 고정점","current":"문자의 값과 항상 지나는 점"}},"sh-selection-r02":{"23":{"old":"대칭식과 제곱의 합","current":"두 수의 식과 제곱의 합"},"25":{"old":"주사위와 실근 조건의 확률","current":"주사위와 방정식의 해가 없는 경우"},"28":{"old":"삼각비의 보각 관계와 식의 값","current":"삼각비의 관계와 식의 값"}},"sh-selection-r03":{"39":{"old":"내접원·방접원과 삼각형의 변","current":"내접원과 변의 연장선에 접하는 원"}},"sh-selection-r05":{"38":{"old":"제곱근 두 수와 대칭식","current":"제곱근 두 수로 나타낸 식의 값"}},"dp-common1-v14-pilot":{"19":{"old":"두 원의 접선과 접현을 이용하여 각의 크기 구하기","current":"두 원의 접선과 현이 이루는 각"}},"dp-common1-r02":{"6":{"old":"켤레식 유리화로 세 수의 대소 비교","current":"분모의 유리화와 세 수의 대소 비교"},"22":{"old":"정사면체의 내접구 부피","current":"원뿔의 밑면과 옆면에 접하는 구의 부피"}},"wm-middle21-basic-mixed-r01":{"26":{"old":"구의 차원과 선·면의 교점, 두 평면의 교선을 설명하기","current":"구와 선·면의 관계"},"29":{"old":"일반 위치 직선 배열에서 유한영역 개수의 증가 규칙","current":"직선을 그어 둘러싸인 부분 세기"}},"wm-middle21-basic-mixed-r02":{"8":{"old":"계승의 소인수 지수 합 구하기","current":"연속한 자연수의 곱과 소인수의 지수"},"11":{"old":"등식의 성질로 얻은 식의 동치 여부 판별","current":"등식의 성질과 식의 변형"},"29":{"old":"삼각형 바깥을 구르는 원의 자취","current":"삼각형 둘레를 따라 움직이는 원"},"47":{"old":"시계바늘의 각도 → 시침·분침의 각속도 → 여러 시각의 작은 각","current":"시곗바늘이 일정한 시간 동안 움직인 각"}},"wm-middle21-basic-mixed-r03":{"8":{"old":"계승을 완전제곱수로 만들기","current":"연속한 자연수의 곱을 제곱수로 만들기"},"37":{"old":"외각의 이등분선의 교점(방심)의 각의 크기","current":"두 외각의 이등분선이 만나는 점의 각"}},"wm-middle21-basic-mixed-r04":{"8":{"old":"계승의 끝에 붙는 0의 개수","current":"연속한 자연수의 곱의 끝자리 0 세기"},"22":{"old":"반비례의 두 함수값으로 비례상수의 배수 구하기","current":"반비례식의 x, y 값과 비례상수"},"46":{"old":"오일러 관계와 꼭짓점·모서리·면의 비","current":"꼭짓점·모서리·면의 개수 관계"},"24":{"old":"규칙의 명시와 문자식의 합","current":"규칙에 따라 늘어놓은 수 중 짝수의 합"}},"ed-common1-basic-r01":{"18":{"old":"반복되는 연분수의 양수 값","current":"반복된 분수식과 양수 조건"}},"ed-common1-basic-r02":{"18":{"old":"반복되는 연분수의 양수 값","current":"반복된 분수식과 양수 조건"}},"sm-pre-middle-common1-r01":{"5":{"old":"정수근의 차와 매개변수 조건","current":"두 정수근의 차와 문자의 값"},"24":{"old":"두 세바선 교점과 안쪽 삼각형 넓이","current":"두 중선의 교점과 삼각형의 넓이"},"29":{"old":"직육면체의 밑면 대각선과 공간 대각선","current":"직육면체 안의 선분과 삼각비"},"30":{"old":"이등변삼각형을 둘로 나누어 반각의 삼각비 계산","current":"이등변삼각형을 나눈 직각삼각형의 삼각비"}},"sm-pre-middle-common1-r02":{"1":{"old":"켤레를 이용한 역수와 네제곱 계산","current":"분모의 유리화와 네제곱 계산"},"3":{"old":"켤레와 세제곱식을 연결한 여섯제곱 계산","current":"분모의 유리화와 여섯제곱 계산"},"4":{"old":"합과 곱을 이용한 높은 차수의 대칭식","current":"두 수의 합과 곱을 이용한 식의 값"},"5":{"old":"인수분해되는 이차방정식의 두 근 차로 매개변수 결정","current":"두 근의 차와 문자의 값"},"11":{"old":"일렬 배치에서 두 인접 조건의 포함배제","current":"이웃하는 조건과 이웃하지 않는 조건의 확률"},"29":{"old":"공간 대각선과 높이 방향 모서리 사이의 각","current":"직육면체 안의 선분과 모서리가 이루는 각"},"30":{"old":"이등변삼각형을 둘로 나누어 반각의 탄젠트 계산","current":"이등변삼각형을 나눈 직각삼각형의 삼각비"}},"dg-pre-high1-r01":{"6":{"old":"삼차방정식의 근과 계수의 관계","current":"삼차방정식의 근과 식의 전개"},"28":{"old":"제한된 구간의 이차함수 최대·최소와 매개변수","current":"범위가 주어진 이차함수의 최대·최소와 문자의 값"},"29":{"old":"원의 두 접선과 접점현·삼각형 넓이","current":"원에 그은 두 접선과 삼각형의 넓이"}},"dg-middle1-entry-r01":{"5":{"old":"새로 정의한 연산의 중첩","current":"기호로 정한 계산을 두 번 하기"},"16":{"old":"연속 세 수의 곱을 이용한 소거","current":"연속한 세 수의 곱을 분모로 하는 분수의 합"},"20":{"old":"인원과 작업 일수의 반비례","current":"일하는 사람 수와 걸리는 날수"},"21":{"old":"십진 시계와 하루 시간의 대응","current":"하루를 다르게 나눈 시계의 시각"},"25":{"old":"원 중심 격자의 비직사각형 평행사변형","current":"격자에서 조건에 맞는 평행사변형 세기"}},"dg-middle1-entry-r02":{"9":{"old":"분수식과 자연수 조건","current":"분수로 나타낸 수와 자연수 조건"},"30":{"old":"크기가 같은 두 반구의 비 합성","current":"크기가 같은 두 반구의 부피비"}},"ed-middle1-authored-r01":{"1":{"old":"카드 배치의 전수 비교","current":"조건에 맞게 수 카드 놓기"},"2":{"old":"도형 조건을 약수 쌍으로 역변환","current":"도형 조건에 맞는 약수 짝 찾기"},"4":{"old":"분자·분모 차로 원래 분수 복원","current":"분자와 분모의 차로 원래 분수 찾기"},"6":{"old":"마주 보는 삼각형 넓이 합의 불변성","current":"넓이가 같은 삼각형 이용하기"},"7":{"old":"두 어림 범위의 교집합","current":"두 어림 범위를 모두 만족하는 수"},"12":{"old":"평균 차로 인원 복원 후 기록 수정","current":"평균을 이용해 인원과 기록 구하기"},"13":{"old":"반반 조건과 엄격한 대소 경계","current":"절반보다 큰 경우와 작은 경우"},"16":{"old":"피제수 복원 후 다른 단위로 재분배","current":"나누어지는 수와 나누어 줄 수 구하기"},"18":{"old":"서로 다른 전체 기준의 통합","current":"서로 다른 기준량의 비교"},"23":{"old":"두 조립 입체를 비교하여 면 넓이 복원","current":"쌓은 두 입체의 겉넓이 비교"},"24":{"old":"대응 길이 복원 후 넓이 차감","current":"길이비를 이용한 넓이의 차"},"25":{"old":"투영 조건을 만족하는 최소·최대 실현","current":"위·앞·옆에서 본 모양과 쌓기나무 개수"},"27":{"old":"기부 비율의 공통 몫 발견","current":"기부한 금액의 비율과 전체 금액"},"28":{"old":"중심 경로를 역산하고 전체 자취와 구별","current":"원이 움직인 길과 지나간 부분"},"30":{"old":"후보 전수와 차·합 조건 필터","current":"합과 차 조건에 맞는 수 찾기"}}};
 function prepare(report){
  const changes=WORDING_LABELS[report?.exam?.id];if(!changes||!Array.isArray(report.items))return report;
  return {...report,items:report.items.map(row=>{const replacement=changes[row.number];return replacement?{...row,detailType:row.detailType===replacement.old?replacement.current:row.detailType,minorUnit:row.minorUnit===replacement.old?replacement.current:row.minorUnit}:row;})};
 }
 const clean=(value,fallback)=>typeof value==='string'&&value.trim()?value.trim().slice(0,160):fallback;
 const numbers=values=>values.join('·')+'번';
 function nextStep(group){
  const topic=[group.domain,group.majorUnit,group.detailType].join(' ');
  if(/확률|경우의 수|경로의 수/.test(topic))return '가능한 경우를 나누어 적고, 빠뜨리거나 두 번 센 경우가 없는지 확인하세요.';
  if(/함수|그래프|포물선/.test(topic))return '조건을 좌표와 식으로 옮기고, 그래프와 대입한 값이 맞는지 확인하세요.';
  if(/기하|도형|삼각|사각|원의|원주|닮음|각도|넓이|부피|길이/.test(topic))return '주어진 길이·각·평행 조건을 그림에 표시하고, 사용한 성질을 적으며 다시 푸세요.';
  if(/방정식|부등식/.test(topic))return '조건을 식으로 쓰고, 구한 값을 처음 조건에 대입해 확인하세요.';
  if(/소수|제곱근|유리수|분수|지수|식의 계산|인수분해/.test(topic))return '계산을 한 줄씩 정리하고, 약분·부호·계산 조건을 다시 확인하세요.';
  return '주어진 조건과 사용한 개념을 적고, 풀이 단계마다 근거를 확인하며 다시 푸세요.';
 }
 function build(report){
  report=prepare(report);
  if(report?.gradingMethod!=='self-reported')return null;
  const rows=report.items,total=report.total;
  if(!Array.isArray(rows)||!Number.isSafeInteger(total)||total<1||rows.length!==total)return null;
  const seen=new Set(),counts={correct:0,wrong:0,blank:0},groups=new Map(),wrongNumbers=[],blankNumbers=[],correctNumbers=[];
  for(const row of rows){
   if(!row||!Number.isSafeInteger(row.number)||row.number<1||row.number>total||seen.has(row.number)||!Object.hasOwn(counts,row.state))return null;
   seen.add(row.number);counts[row.state]++;
   ({correct:correctNumbers,wrong:wrongNumbers,blank:blankNumbers})[row.state].push(row.number);
   const domain=clean(row.domain,'통합'),semester=clean(row.semester,''),majorUnit=clean(row.majorUnit,'단원 확인'),detailType=clean(row.detailType,majorUnit),key=JSON.stringify([domain,semester,majorUnit,detailType]);
   if(!groups.has(key))groups.set(key,{domain,semester,majorUnit,detailType,correct:[],wrong:[],blank:[]});
   groups.get(key)[row.state].push(row.number);
  }
  if(report.correctCount!==counts.correct||report.wrongCount!==counts.wrong||report.blankCount!==counts.blank||Number(report.reviewCount||0)!==0)return null;
  for(const a of [wrongNumbers,blankNumbers,correctNumbers])a.sort((a,b)=>a-b);
  const checked=counts.correct+counts.wrong;
  const summary=checked?`전체 ${total}문항 중 ${checked}문항을 확인했습니다. O ${counts.correct}개, X ${counts.wrong}개${counts.blank?`, 미확인 ${counts.blank}개`:'입니다'}.`:`아직 O/X를 표시한 문항이 없습니다. ${total}문항이 미확인입니다.`;
  const priorities=[...groups.values()].filter(g=>g.wrong.length).sort((a,b)=>b.wrong.length-a.wrong.length||Math.min(...a.wrong)-Math.min(...b.wrong)).slice(0,3).map(g=>({
   label:[g.semester,g.detailType].filter(Boolean).join(' · '),
   action:nextStep(g),
   text:`${numbers(g.wrong.sort((a,b)=>a-b))}에 X를 표시했습니다.`,
   evidence:{itemNumbers:g.wrong.slice(),domain:g.domain,semester:g.semester,majorUnit:g.majorUnit,detailType:g.detailType,correct:g.correct.length,wrong:g.wrong.length,blank:g.blank.length}
  }));
  const next=counts.wrong?'X 문항을 풀이와 대조한 뒤, 답을 가리고 다시 풀어 보세요.':counts.blank?'미확인 문항을 풀이와 대조해 O/X를 표시해 주세요.':'모든 문항을 O로 표시했습니다. 답을 보지 않고 풀이의 근거를 설명해 보세요.';
  const confirmed=counts.correct?`O로 표시한 ${counts.correct}문항도 답을 보지 않고 풀이를 설명할 수 있는지 확인하세요.`:'';
  const parent=checked?`이번 회차는 ${total}문항 중 ${checked}문항을 확인했고, O ${counts.correct}개·X ${counts.wrong}개${counts.blank?`·미확인 ${counts.blank}개`:'로 기록했습니다'}. `+(priorities.length?`먼저 ${priorities[0].label}의 ${numbers(priorities[0].evidence.itemNumbers)}을 다시 풀고, 사용한 조건과 풀이 순서를 학생의 말로 설명하게 해 주세요.`:counts.blank?'남은 문항의 O/X 확인을 마친 뒤 결과를 함께 살펴봐 주세요.':'답을 가린 상태에서도 풀이를 설명할 수 있는지 함께 확인해 주세요.'):'아직 O/X 확인을 시작하지 않았습니다. 풀이와 대조해 표시한 뒤 결과를 함께 살펴봐 주세요.';
  return {version:VERSION,summary,next,confirmed,priorities,parent,source:'저장한 O/X 기록 기준',coverage:counts.blank?`미확인 ${counts.blank}문항은 재풀이 유형 선정에서 제외했습니다.`:'',evidence:{total,checked,correct:counts.correct,wrong:counts.wrong,blank:counts.blank,wrongNumbers,blankNumbers,correctNumbers}};
 }
 const api=Object.freeze({VERSION,build,prepare});root.HIGHSELECT_SELF_CHECK_COMMENTS=api;
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
