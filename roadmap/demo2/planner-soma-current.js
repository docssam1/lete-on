/* Current five-year-old cohort. Dates belong to the supplied A3-3 class only. */
(function(g){
 'use strict';
 const source={caseId:'soma-age5-a33-2026',title:'2026년 5세 소마 A3-3반 운영 로드맵',file:'codex-clipboard-b3629515-09ae-465e-a6aa-e125a9f0a8f8.jpg',sha256:'cdbcf746992555b8df6221475ab110423b5f56bb37dabdac349b37ea2ad59990',verifiedOn:'2026-11-15',status:'user_provided_case'};
 const block=(label,start,end,note='')=>({label,start,end,note,kind:'period',sourceRow:source.caseId+' · '+label});
 const data={
  title:source.title,source,startYear:2026,start:10,end:32,cohort:'2026년 현재 5세 · A3-3 과정을 하는 반',
  paceNote:'현재 5세 진도는 작년과 비슷합니다. 시작 권수만으로 전체 진도가 빨라졌다고 보지 않습니다.',
  observation:{weeks:2,book:'Ray Kids A1-2',next:['A1-3','A2-3','A3-3']},
  confirmedEntry:'A3-3',
  tracks:[
   {title:'사고력 교재',blocks:[block('Ray Kids A단계',10,14,'2026년 11월~2027년 2월'),block('Ray B단계',14,22,'2027년 3~10월'),block('Premier 라이즈',22,32,'2027년 11월~2028년 8월 표시 구간. 8월에 완료한다는 뜻은 아닙니다.')]},
   {title:'사고력·교과 부교재',blocks:[block('키즈 팩토 기본 (A·B·C)',15,20,'2027년 4~8월 · 사고력 부교재 시작'),block('초등 팩토 LV.1 기본+응용 (A·B·C)',20,29,'2027년 9월~2028년 5월'),block('디딤돌 2-1',29,32,'2028년 6월 교과 부교재 시작 · 표의 끝을 완료월로 보지 않습니다.')]},
   {title:'연산',blocks:[block('소마셈 P1~P4',10,14),block('소마셈 P5~P8',14,18),block('소마셈 A1~A4',18,22),block('소마셈 A5~A8',22,26),block('소마셈 B5~B8',26,30,'원표 표기 그대로이며 B1~B4를 임의로 끼워 넣지 않습니다.'),block('소마연산 3학년',30,32,'교재 이름이며 학생의 학교 학년을 뜻하지 않습니다.')]},
   {title:'도형',blocks:[block('소마도형 P단계',10,27),block('소마도형 A단계',27,32)]}
  ],
  notes:['2주 관찰 수업은 정규 교재 한 권의 이수 속도가 아닙니다.','A1-3·A2-3반의 월별 운영표는 확인되지 않아 A3-3반 일정을 앞뒤로 이동해 만들지 않습니다.','Ray Kids A와 Ray B는 구분합니다. 이전 RAY B 목차를 A단계의 목차로 바꾸지 않습니다.','이 표는 해당 반의 운영 사례이며 모든 소마 지점·반의 공통 진도나 아이의 독립 해결 수행률이 아닙니다.']
 };
 function freeze(value){if(value&&typeof value==='object'){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
 g.PLANNER_SOMA_CURRENT=freeze(data);
})(window);
