/* Parent-facing study advice distilled from a supplied consultation deck.
 * Private editorial evidence (never rendered):
 * 2028_대입_상위권합격로드맵_1부2부완전정리.pptx, 2026.09, 17 slides,
 * attributed in the deck to IDA 입시연구소 / 장문성의 입시 팩토리.
 * All slide text and 12 embedded tables/images inspected 2026-10-26; no notes.
 * Slides 3, 5-9, 12-15: compare each route's evaluation, minimum score and
 * applicant conditions. Slides 10, 16: review school/exam evidence in high 2.
 * Grade-specific study actions below are GFIELD editorial adaptations, not
 * admissions requirements, forecasts, or a compulsory date to fix a route.
 * Excluded: slide 7 says 34%, while its table says 73.5% (4345/5910);
 * slides 6/15 say 20→40%, while slide 6's table says 10→40%; slide 13's
 * claim about grade 1 omits the achievement-level conditions in its table.
 * Slides 10/11/16 rank/score cutoffs, grade conversion, guaranteed advantages,
 * and slide 4's causal explanation are not used as rules.
 * Official cross-checks, 2026-10-26:
 * MOE 2023-12-27 confirms the 2028 framework only, not university eligibility:
 * https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=97551&lev=0&m=020402&opType=N&s=moe&statusYN=W
 * Hanyang 2028 plan, PDF pp.8/13 (printed pp.5/10), confirms 90+10→60+40,
 * and shows applicant restrictions and different minimum-score conditions.
 * https://go.hanyang.ac.kr/web/notice/notice_view.do?bn=20977
 * No university-specific eligibility/percentage is exposed by this module.
 */
(function(g){
'use strict';
const own=(o,k)=>Object.hasOwn(o||{},k);
const row=(id,title,text)=>({id,title,text});
const question=(id,q,a)=>({id,question:q,answer:a});
const TITLES={primary:'지금의 공부에서 이어갈 준비',middle:'고교 공부로 이어갈 준비',high1:'고1 · 학교 공부와 과목 선택',high2:'고2 · 내신과 학평을 함께 점검',high3:'고3 · 전형별 조건과 준비 확인',unknown:'현재 학교와 공부부터 확인'};
const COMMENTS={
 primary:[
  ['understanding','개념을 설명하고 다시 풀기','지금 배우는 교과에서 풀이의 이유를 설명하고, 며칠 뒤 비슷한 문제에 다시 적용해 보세요. 진도와 함께 혼자 해결한 부분을 살펴봅니다.'],
  ['reading','읽고 자기 말로 정리하기','관심 있는 글을 읽고 핵심과 자신의 생각을 짧게 말하거나 써 봅니다. 수학·과학에서도 문제의 조건과 답의 근거를 설명하는 습관으로 이어갑니다.'],
  ['routine','현재 공부를 꾸준히 이어가기','학교 과제와 현재 교재를 마칠 시간, 쉬는 시간을 함께 살펴보세요. 아이의 관심과 부담이 달라지면 다음 공부의 분량을 조정합니다.']
 ],
 middle:[
  ['school','학교 시험과 낯선 문제를 함께 보기','학교 수업·내신을 챙기면서 비시험 기간에는 배운 범위의 낯선 문제를 풀어 봅니다. 개념·조건 읽기·계산 중 반복되는 오류를 나누어 보완하세요.'],
  ['curriculum','고교의 실제 수업 비교하기','고교 후보가 생기면 교육과정 편성표와 평가 계획을 비교하세요. 수학·과학 선택과목의 배치와 국어·영어 공부, 통학·기숙 생활을 함께 살펴봅니다.'],
  ['explanation','관심과 탐구 과정 설명하기','궁금한 질문에서 무엇을 읽고 시도했는지, 생각이 어떻게 바뀌었는지 짧게 기록해 보세요. 활동을 더하기 전에 기존 공부를 본인 말로 설명하는지 확인합니다.']
 ],
 high1:[
  ['adapt','첫 학기의 수업·과제·평가에 적응하기','수업 복습과 수행평가 마감을 시간표에 먼저 넣어 보세요. 시험 뒤에는 내신과 학평에서 막힌 부분을 따로 짚고 다음 공부에 반영합니다.'],
  ['subjects','다음 학기 과목을 실제 수업과 연결하기','학교 개설 과목과 선수학습, 관심 분야를 함께 비교합니다. 대학의 필수·권장 과목과 수능 출제범위는 각각 확인하고 과목 선택은 학교 상담에서 점검하세요.'],
  ['record','한 학기의 공부 모습을 남기기','과목별로 잘 이해한 내용과 반복되는 오류, 직접 한 탐구를 정리해 보세요. 다음 학기에는 성적 추이와 과제 부담을 함께 살펴 공부 비중을 조정합니다.']
 ],
 high2:[
  ['review','1학기 내신과 학평을 나란히 보기','고2 1학기 성적과 3·6월 학평에서 과목별 강점·약점을 함께 살펴보세요. 최근 시험도 이어서 비교하고, 부족한 개념과 시간 안배를 다음 학기 공부에 반영합니다.'],
  ['routes','전형을 모집단위별로 비교하기','관심 대학·모집단위에서 학생부교과·종합·논술·수능 전형의 평가 요소를 비교하세요. 서류·면접·수능 최저와 학교생활기록부 반영 여부를 따로 적어 봅니다.'],
  ['revisit','다음 학기에도 방향을 다시 점검하기','학교 성적과 학평의 변화, 현재 과목 이수와 준비 부담을 보고 공부 비중을 조정합니다. 한 번의 점수나 평균등급으로 대학·전형을 확정하지 않습니다.']
 ],
 high3:[
  ['requirements','지원할 전형의 조건을 한 줄씩 확인하기','대학·모집단위·입학연도를 맞춰 지원자격, 학교장 추천, 반영 학기·과목과 평가 방식을 확인하세요. 시행계획 뒤에 나온 최종 모집요강과 변경 공지도 함께 살펴봅니다.'],
  ['minimum','수능 최저와 별도 평가를 함께 준비하기','최저가 있는 전형은 필수 응시 영역과 등급 조건을 확인하고 최근 성적과 비교합니다. 논술·면접·서류의 평가 내용과 준비 시간도 따로 챙기세요.'],
  ['schedule','학교 공부와 제출 일정을 함께 관리하기','현재 학교 수업과 평가를 이어가며 추천 신청, 서류 제출, 논술·면접 일정을 학교와 확인합니다. 준비한 일, 실제 제출한 일, 대학의 결과 통지를 구분해 기록하세요.']
 ],
 unknown:[
  ['school','현재 학교의 학년 체계 확인하기','학교의 학년 명칭과 교육과정, 배우는 과목을 먼저 확인합니다. Grade·Year는 국내 학년과 자동으로 대응시키지 않습니다.'],
  ['study','지금의 교재와 풀이 살펴보기','현재 교재에서 혼자 설명하고 적용할 수 있는 범위를 살펴보세요. 필요한 개념을 보완하면서 학교 과제와 관심 활동을 이어갑니다.'],
  ['route','국내 진학에 필요한 학교 상담 준비하기','국내 진학을 생각한다면 학교의 성적표·수강 과목 기록과 지원자 구분을 확인하세요. 대학·과정·입학연도가 정해지면 해당 공식 안내를 비교합니다.']
 ]
};
const GOALS={
 private:{title:'자사고 목표와 연결',early:'후보 학교의 수업·평가와 생활 시간을 비교하며 수학·과학 공부와 국어·영어·학교 과제를 함께 이어갈 수 있는지 살펴봅니다.',high:'대학 준비는 실제 재학 학교의 개설 과목과 평가 방식에 맞춥니다. 심화 공부를 더할 때 국어·영어와 다른 교과 과제를 함께 감당할 시간도 살펴봅니다.'},
 giftedSchool:{title:'영재학교 목표와 연결',early:'수학·과학의 낯선 문제와 탐구에서 시도한 방법, 막힌 이유, 바꾼 생각을 설명해 보세요. 읽기·쓰기와 다른 교과 공부도 함께 이어갑니다.',high:'심화·탐구의 본인 역할과 과정을 설명하며 실제 이수 과목과 학교 성적 기록을 함께 살펴봅니다. 대학별 지원자격에서 학교 유형과 교육과정 조건도 확인하세요.'},
 scienceHigh:{title:'과학고 목표와 연결',early:'학교 수학·과학의 개념과 탐구 결과를 근거와 함께 설명해 보세요. 심화를 병행하더라도 학교 공부에서 반복되는 오류를 먼저 짚습니다.',high:'수학·과학 탐구와 과목 이수를 이어가며 읽기·표현과 다른 교과도 챙깁니다. 실제 졸업·이수 일정과 대학별 지원자격은 학교 상담에서 함께 확인하세요.'},
 general:{title:'일반고 목표와 연결',early:'학교 수업을 중심에 두고 배운 범위의 심화와 낯선 문제를 함께 다룹니다. 고교 후보가 생기면 개설 과목과 평가 계획을 비교해 보세요.',high:'학교 수업·수행평가를 중심에 두고 비시험 기간에는 학평에서 드러난 약점을 보완합니다. 학교에서 가능한 선택과목과 탐구 기회를 실제로 확인하세요.'}
};
function stage(context={}){
 const f=context.fields||{},school=context.school||f.schoolContext;
 let n;
 if(school){if(school.format!=='kr')return 'unknown';n=Number(school.level);}
 else{if(f.internationalCalendar||context.foreignCalendar)return 'unknown';n=Number(own(context,'grade')?context.grade:f.grade);}
 if(!Number.isInteger(n)||n<1||n>12)return 'unknown';
 return n<=6?'primary':n<=9?'middle':'high'+(n-9);
}
function model(context={}){
 const visible=(context.country??context.active)==='kr',key=stage(context),high=key.startsWith('high');
 const comments=visible?COMMENTS[key].map(x=>row(...x)):[];
 const goal=own(GOALS,context.schoolGoal)?GOALS[context.schoolGoal]:null;
 if(visible&&goal&&key!=='unknown')comments.push(row('goal',goal.title,goal[high?'high':'early']));
 return {visible,stage:key,title:TITLES[key],comments};
}
function questions(context={}){
 const m=model(context);if(!m.visible)return [];
 if(m.stage==='primary'||m.stage==='middle')return [
  question('longRange','지금부터 대학 전형을 정해야 하나요?','현재 교과를 이해하고 읽고 설명하는 공부를 꾸준히 이어가세요. 관심과 학교 공부가 달라질 때 방향을 다시 살펴보고, 실제 지원 시기의 공식 안내로 전형을 비교합니다.'),
  question('advance','선행 진도가 빠르면 대입 준비도 앞선 건가요?','선행 범위와 함께 처음 보는 문제에 적용하는지, 풀이의 이유를 설명하는지 살펴봅니다. 학교 과제와 다른 교과 공부를 꾸준히 이어갈 수 있는지도 확인하세요.'),
  question('nextCheck','다음 상담에는 무엇을 가져가면 좋을까요?','현재 교재의 최근 풀이와 오답, 학교 과제, 아이가 오래 궁금해한 질문을 함께 살펴보면 좋습니다. 잘한 부분과 도움이 필요했던 부분을 구분해 다음 공부를 고릅니다.')
 ];
 if(m.stage==='unknown')return [
  question('schoolFormat','국내 학년으로 바꿔서 계획해야 하나요?','현재 학교의 학년 명칭과 과목 안내를 그대로 사용합니다. 학교 교육과정과 실제 수강 기록을 확인한 뒤 국내 진학에서 필요한 요건을 비교하세요.'),
  question('applicant','국내 대학 지원자 구분은 어떻게 확인하나요?','재학·졸업 학교와 교육과정, 실제 이수 이력을 바탕으로 대학별 공식 안내와 학교 상담에서 확인합니다. 학교 이름이나 수업 언어만으로 지원자격을 판단하지 않습니다.'),
  question('materials','먼저 확인할 자료는 무엇인가요?','학교의 교육과정 편성표, 성적표와 수강 과목 기록부터 살펴봅니다. 대학·모집단위·입학연도가 정해지면 해당 전형의 최종 안내를 이어서 확인하세요.')
 ];
 const focus=m.stage==='high1'?
  question('timing','고1에는 전형을 언제 정하면 좋을까요?','첫 학기에는 학교 수업·과제·평가에 적응하고 과목별 공부 모습을 살펴보세요. 다음 과목을 선택할 때 관심 분야와 학교 개설 과목을 비교하고, 성적과 학평 추이가 쌓이면 학교 상담에서 전형별 준비를 다시 점검합니다.'):
  m.stage==='high2'?
  question('timing','고2에는 어떤 자료로 방향을 점검할까요?','1학기 내신과 3·6월 학평, 최근 시험의 과목별 강점·약점을 함께 보세요. 관심 전형의 평가 요소와 실제 준비 부담을 비교하고 다음 학기 성적이 나오면 다시 조정합니다.'):
  question('timing','고3 지원 전 마지막으로 무엇을 확인하나요?','대학·모집단위·입학연도를 맞춰 최종 모집요강과 변경 공지를 확인합니다. 지원자격, 추천, 수능 최저, 서류·면접·논술과 마감일을 학교 상담에서 한 번 더 점검하세요.');
 return [focus,
  question('schoolAndExam','수능 중심으로 준비해도 학교 공부를 챙겨야 하나요?','현재 학교 수업과 평가를 이어가면서 지원할 정시 전형의 학생부·출결 반영 여부를 확인하세요. 반영 학기·과목과 평가 방식은 대학·전형별로 비교합니다.'),
  question('minimum','수능 최저를 맞추면 합격이 결정되나요?','수능 최저는 해당 전형에서 따로 확인할 조건입니다. 학생부·서류·논술·면접 등 평가 내용도 함께 살펴보고 각각 필요한 공부와 준비 시간을 정하세요.')
 ];
}
g.PlannerAdmissionsEvidence=Object.freeze({model,questions});
})(window);
