/* Publicly published first-person study histories. Anonymous reference cases,
 * separate from our counselling cases. Missing books/months are not completions.
 * A planning anchor may choose a month, but must label that month as assumed. */
(function(g){
'use strict';
const step=(id,dateLabel,title,school,thinking,question,answer,extra={})=>({id,dateLabel,title,school,thinking,calc:'',gifted:'',inquiry:'',question,answer,...extra});
const cases={
 publicMiddle:{
  group:'public',title:'과학고 합격에서 공학계열 대학 진학으로',short:'과학고·공학계열 진학',outcome:'과학고 진학 후 서울대·KAIST·POSTECH 합격 수기',
  route:'초6 중등수학 마무리 → 중1 정석 반복 → 과학고 → 공학계열 대학',thinkingRoute:'정석 반복 → 마플 심화 → 과학고 학교 과정',standardBackcast:true,
  intro:'중등수학을 마무리한 시점에서 초등 과정을 역산하고, 이후 교과·심화와 과학을 연결해 보는 공개 사례입니다.',gifted:'',
  source:{label:'과학고 진학·공학계열 합격 Q&A',url:'https://hjm-edu1.hajimin.com/hjm-column-eng'},
  start:{grade:6,month:12},sequenceOnly:true,horizon:4,
  compareAnchor:{at:0,course:'중3-2',position:'end',label:'중등수학 마무리',stage:0,assumedMonth:true,planningLabel:'초6 12월 · 비교를 위한 설계 기준'},
  reverseAnchors:[{axis:'school',at:0,course:'중3-2',position:'end',label:'초6 중등수학 마무리 · 12월은 설계 가정'}],
  stages:[
   step('middle','초6','중등수학 마무리','초6에 중등수학 과정을 마무리했습니다. 완료 월과 초등 교재는 적혀 있지 않습니다.','','이 사례를 기준으로 초등 과정도 그려볼 수 있나요?','중등수학 마무리를 기준으로 우리 표준 과정과 기간을 거꾸로 적용할 수 있습니다. 초6 12월은 비교용 기준이며, 앞선 책과 월은 실제 이력이 아닌 설계 예시입니다.',{study:{school:'중등수학 과정 마무리',deep:'',thinking:'',calc:''}}),
   step('high','중1','고1 수학을 반복하며 심화','고1 수학을 기본정석·실력정석으로 여러 차례 반복했습니다. 당시 교재명은 수학 상·하입니다.','','앞선 진도와 심화는 어떻게 함께 봐야 하나요?','새 교과의 시작과 기본·심화 반복을 따로 봅니다. 이 사례도 고등 진입 뒤 같은 범위를 반복하며 다졌습니다.',{study:{school:'고1 수학',deep:'기본정석·실력정석 반복',thinking:'',calc:''}}),
   step('science','중1 → 중2','중등에서 고등 하이탑으로','','','수학이 앞서면 과학도 같은 속도로 올리나요?','수학과 과학의 출발점은 따로 봅니다. 이 사례의 과학 진입 시점은 참고하되, 실제 이해와 남은 일정을 확인해 병행합니다.',{science:'중1 중등 하이탑 → 중2 고등 하이탑 Ⅰ·Ⅱ'}),
   step('deepen','이후 → 과학고','심화와 학교 과정 연결','수학Ⅰ·수학Ⅱ·미적분은 마플을 활용했습니다. 확률과 통계·기하는 과학고 진학 후 학교 수업과 학원 자료를 병행했습니다.','','모든 고등 과정을 입학 전에 끝낸 사례인가요?','그렇지 않습니다. 진학 전에 다룬 범위와 진학 후 학교에서 이어간 범위를 나눠 봅니다.',{study:{school:'수학Ⅰ·수학Ⅱ·미적분',deep:'마플 · 이후 확률과 통계·기하',thinking:'',calc:''}})
  ]
 },
 publicKsa:{
  group:'public',title:'중2 자습에서 한국과학영재학교 합격으로',short:'중2 자습·한국과학영재학교',outcome:'한국과학영재학교 합격 후기',
  route:'고1 수학 자습 → 물리Ⅰ → 창의수학 → 수학·과학 입시 대비',thinkingRoute:'중2 11월 창의수학 → 겨울 창의수학 기본·심화',
  intro:'초등 선행 이력이 없는 구간을 채우기보다, 중2에 확인되는 교과와 과학의 출발점부터 살펴보는 공개 사례입니다.',gifted:'',
  source:{label:'한과영 합격 후기 (2025년)',url:'https://pnote.tistory.com/49'},start:{grade:8,month:8},sequenceOnly:true,horizon:4,
  stages:[
   step('self','중2','고1 수학 자습','중2에 고1 수학을 혼자 공부하고 있었습니다. 당시 교재명은 수학 상·하이며, 공부 중인 범위입니다.','','초등 때부터 매우 빠른 진도가 있어야만 하나요?','이 사례는 중2의 실제 공부 범위에서 준비를 이어갔습니다. 알려지지 않은 초등 진도를 필수 이력으로 만들어 넣지 않습니다.',{study:{school:'고1 수학 자습',deep:'',thinking:'',calc:''}}),
   step('physics','중2 8월','물리Ⅰ 수업 경험','','','과학을 추가할 때 무엇부터 확인할까요?','현재 수학과 과학의 개념, 수업을 듣고 복습할 여력을 각각 확인합니다.',{science:'물리Ⅰ'}),
   step('creative','중2 11월','창의수학 추가','현재 교과와 함께 창의수학 단과 수업을 시작했습니다.','창의수학 단과','입시 대비를 더하면 교과 진도를 줄여야 하나요?','기존 공부와 새 대비를 각각 일정에 놓고 봅니다. 이동·과제·복습까지 포함해 병행 가능한 방식을 고릅니다.',{study:{school:'',deep:'',thinking:'창의수학 단과',calc:''}}),
   step('winter','다음 1월 겨울방학','수학·과학 대비와 복습','창의수학 기본·심화와 과학 네 영역을 공부하며 과제와 복습을 반복했습니다.','창의수학 기본·심화 · 모의고사','다른 아이의 집중 대비 시간을 그대로 적용하나요?','이 사례의 전환 시점을 기준으로 필요한 과정을 비교하되, 회차와 시간을 그대로 복제하지 않습니다. 현재 공부와 체력에 맞춰 조정합니다.',{science:'창의 물리·화학·생명·지구과학',study:{school:'',deep:'',thinking:'창의수학 기본·심화 · 모의고사',calc:''}})
  ]
 },
 publicDaegu:{
  group:'public',title:'초6 과학 시작에서 대구과학고 합격으로',short:'초6 하이탑·대구과학고',outcome:'대구과학고(영재학교) 합격 후기',
  route:'초6 중등 하이탑 → 중등 과학 심화 → 고등 과학 병행 → 영재학교 대비',thinkingRoute:'중등수학 자습 · 고등수학 방학특강 · 이후 창의수학',
  intro:'과학 교재와 학년별 병행이 구체적으로 나오는 공개 사례입니다. 수학은 중등 자습·인터넷 강의와 고등 방학특강을 활용했지만 시작 월은 적혀 있지 않습니다. 과학 여러 과목이 한 시기에 몰렸던 부담도 함께 살펴봅니다.',gifted:'',
  source:{label:'대구영재고 합격 후기 (2025년)',url:'https://pnote.tistory.com/48?category=1098720'},start:{grade:6,month:3},sequenceOnly:true,horizon:4,
  stages:[
   step('hitop','초6','중등 하이탑으로 시작','','','수학과 과학을 같은 기관에서 해야 하나요?','이 사례는 수학과 과학의 학습 방식을 다르게 선택했습니다. 기관보다 현재 범위와 실제 복습을 함께 봅니다.',{science:'중등 하이탑 인터넷 강의'}),
   step('middlePhysics','중1 무렵부터','중등 물리 심화와 다음 과학','','','순서대로 한 과목씩만 공부해야 하나요?','학교 진도와 남은 기간, 개념 이해를 확인해 필요한 병행을 설계합니다. 실제 수업의 시작·완료 월은 적혀 있지 않습니다.',{science:'중등 물리 심화 → 다음 과학 과정'}),
   step('parallel','중2 2학기','고등 과학 네 과목 병행','','','네 과목 동시 병행을 표준으로 잡아도 되나요?','이 사례도 이 시기의 부담이 가장 컸다고 돌아봅니다. 입시 시점에서 역산하되 앞선 학기에 분산하는 설계를 비교할 수 있습니다.',{science:'물리Ⅰ·화학Ⅰ·생명과학Ⅰ·지구과학Ⅰ',concern:'과학 네 과목이 동시에 몰린 시기가 힘들었다고 돌아보며, 한 학기 먼저 시작했으면 부담을 나눌 수 있었을지 고민했습니다.'}),
   step('admission','이후','창의수학·과학 입시 대비','창의수학에서는 어려움을 겪었고 과학의 자신감을 바탕으로 입시 준비를 이어갔습니다.','창의수학·과학 대비','합격 사례에도 과목별 약점이 있나요?','이 사례도 수학과 과학의 강점이 같지는 않았습니다. 최종 결과와 별도로 약점·복습·병행 부담을 함께 봅니다.',{science:'창의과학 입시 대비',study:{school:'',deep:'',thinking:'창의수학·과학 대비',calc:''}})
  ]
 },
 publicGyeonggi:{
  group:'public',title:'초3 사고력에서 경기과학고 합격으로',short:'초3 사고력·경기과학고',outcome:'경기과학고 중2 합격 학부모 수기',
  route:'초3 1031·교육청 영재원 → 초6 여름 입시 준비 → 중2 합격',thinkingRoute:'초3 1031 시리즈 → 창의사고력 → 수학·과학 입시 준비',
  intro:'교과 학기보다 사고력과 영재원, 본격 입시 준비를 시작한 학년이 분명한 공개 사례입니다.',gifted:'초3 무렵 교육청 영재원 합격.',
  source:{label:'2016학년도 경기과학고 합격 학부모 수기',url:'https://www.mbest.co.kr/Pub_parentsInfo/edu/PeassyT.asp?seq=343'},start:{grade:3,month:3},sequenceOnly:true,horizon:3,
  stages:[
   step('thinking','초3','1031과 교육청 영재원','','1031 시리즈로 사고력 공부를 이어갔습니다. 입문·초급·중급의 구체 과정은 적혀 있지 않습니다.','1031을 했다는 말만으로 우리 레벨과 맞출 수 있나요?','시리즈 이름만으로 과정이나 완료 수준을 정할 수 없습니다. 이 사례는 사고력을 시작한 학년과 영재원 전환의 참고 기준으로 봅니다.',{gifted:'교육청 영재원 합격',study:{school:'',deep:'',thinking:'1031 시리즈',calc:''}}),
   step('prepare','초6 여름방학','본격 수학·과학 입시 준비','수학·과학 공부량과 난도가 높아지며 혼자 해결하기 어려운 문제를 만났습니다.','창의사고력·입시 대비','공부량을 늘린 뒤 어려워하면 어떻게 하나요?','이 사례도 늘어난 난도에 부담을 겪었습니다. 교과의 현재 이해와 독립 풀이를 보며 대비 범위와 복습을 함께 조정합니다.'),
   step('result','중2','경기과학고 합격','학교 공부와 수학·과학 준비를 함께 이어갔습니다.','','같은 학년까지 같은 양을 해야 하나요?','합격한 학년은 참고 사례의 결과입니다. 우리 아이에게 필요한 책·기간·학습량은 현재 공부에서 별도로 설계합니다.')
  ]
 }
};
for(const c of Object.values(cases))c.stages.forEach((s,i)=>{s.at=i;s.study??={school:s.school,deep:'',thinking:s.thinking,calc:s.calc};});
g.PlannerPublicCases=cases;
})(window);
