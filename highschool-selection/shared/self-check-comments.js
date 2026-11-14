(function(root){
 'use strict';
 const VERSION='self-check-comments/v1';
 const WORDING_LABELS={"wm-common1-basic-r01":{"15":{"old":"이차방정식과 대칭식","current":"이차방정식과 식의 값"},"47":{"old":"줄 세우기와 여사건","current":"줄 세우기와 반대 경우"}},"wm-common1-basic-r02":{"6":{"old":"전개식의 계수 비교","current":"식의 전개와 식의 값"},"20":{"old":"정의역과 이차함수의 최댓값","current":"x의 값의 범위와 이차함수의 최댓값"}},"wm-common1-basic-r03":{"13":{"old":"완전제곱식과 실근","current":"완전제곱식과 해"}},"wm-common1-basic-r04":{"17":{"old":"일차함수의 변화량과 함숫값","current":"일차함수의 변화량과 값"}},"wm-common1-basic-final":{"16":{"old":"일차함수의 식 비교","current":"일차함수의 값과 식"}}};
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
