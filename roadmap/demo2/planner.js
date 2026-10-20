/* ============================================================
   학부모가 조정하는 로드맵 (원장님 2026-10-20)
   - 데이터 한 벌(build)로 상세 표 · 간단 보기 · 3D(보여주기용)를 함께 그린다.
   - 조정 항목: 지금 진도(교과·사고력·연산 + 남은 개월), 교과 속도, 황소 선택, 영재원 선택.
   - 규칙은 예시 로드맵(원장님 손그림)과 같다:
     교과 디딤돌 응용 학기당 S개월 → 6-2 다음 계통(5·6학년·중1) 대수 정리 4개월 → 중등 원리해설 3개월씩.
     교과 심화는 한 학년 아래 최상위 S를 1개월 늦게 같은 속도로, 중등 시작 2개월 뒤부터 중등 심화(A급) 4개월씩,
     그 사이는 '황소 대비 고려에 따라 고민 + 중등 쎈'.
     연산은 지금 권부터 S개월씩, 기적 12권 다음 기적의 중학연산 1AB → 도형 1권 → 2AB → 도형 2권 → 3AB → 도형 3권(S1 표 기간).
     과학은 중2-1 중등 심화가 끝난 다음 달 중등과학, 그 앞 6개월 초5·6 과학, 그 앞 12개월 실험과학.
   - 월 값 m: 5세 1월=0 … 초1(8세) 1월=36. 학년은 3월에 바뀐다(1·2월은 앞 학년).
   ============================================================ */
(function(){
'use strict';
const SEM=k=>`${Math.ceil(k/2)}-${k%2?1:2}`;
const MID=['중1-1','중1-2','중2-1','중2-2','중3-1','중3-2'];
const CALC=[...Array.from({length:12},(_,i)=>[`기적의 계산법 ${i+1}`,0]),
  ['기적의 중학연산 1AB',5],['기적의 중학도형 1권',2],['기적의 중학연산 2AB',4],['기적의 중학도형 2권',2],['기적의 중학연산 3AB',6],['기적의 중학도형 3권',2]];
// 1031 중급은 예시 로드맵에서 지웠다(원장님 2026-10-20). 지금 중급을 하고 있는 레벨만 거친다(skip).
const COMP=[['초등팩토 1 (PRE 1031 기본)',5],['필즈 베이직 (PRE 1031 심화)',5],['1031 입문 + workbook',4],['TOT 2단계',3],['1031 초급',7],['1031 중급',7,'skip'],['3% 1과정',4],['왕수학 응용 4',3,'skip']];
const GRADES=['5세','6세','7세','초1','초2','초3','초4','초5','초6','중1','중2','중3','고1'];

// 학년(1~6)·월 → m, m → 학년·월·연도
function mOf(grade,mon){ return 36+12*(grade-1)+(mon>=3?mon-1:mon-1+12); }
function schoolYear(m){ const y=Math.floor(m/12); return (y>=3&&m%12<2)?y-1:y; }
function label(m){ return GRADES[schoolYear(m)]+' '+(m%12+1)+'월'; }

function seq(start,items){ const out=[]; let t=start; items.forEach(([txt,n])=>{ out.push([txt,t,t+n-1]); t+=n; }); return out; }

/* o = {grade, mon, year, school, schoolLeft, comp, compLeft, calc, calcLeft, speed, hw, hwDeep, hwMid, gifted} */
/* 표준(원장님 2026-10-20 "표준화 시켜"): 속도에 따라 세 묶음.
   A 선행형(L0~L3): 계통 없이 바로 중등. 원리해설 4개월/학기, 중등 심화(A급) 같이. 사고력 초급→중급→3%1→왕수학 응용 4. 황소 초2 11월.
   B 예시형(L4~L9): 6-2 뒤 계통 4개월 → 원리해설 3개월/학기, 2개월 뒤 A급. 사고력 초급→3%1(중급 생략). 황소는 선택.
   C 천천히형(L10~L13): 초등은 응용 3개월+심화(최상위) 2개월, 연산 5개월. 중등은 개념원리(개념)+RPM(응용) 4개월/학기, 2년. A급 없음.
     사고력은 1031 초급으로 끝("이제 사고력 끝"). 황소 없음. */
const BAND={
  A:{name:'선행형',elemS:null,topDown:1,sys:false,midLen:4,midBook:'원리해설',deep:'A급',deepLag:0,compStop:null,hw:true},
  B:{name:'예시형',elemS:null,topDown:1,sys:true, midLen:3,midBook:'원리해설',deep:'A급',deepLag:2,compStop:null,hw:true},
  C:{name:'천천히형',elemS:5,topDown:0,sys:true, midLen:4,midBook:'개념원리',deep:'RPM',deepLag:0,compStop:'1031 초급',hw:false},
  D:{name:'영과고형',elemS:null,topDown:1,sys:false,midLen:3,midBook:'개념응용 · 최상위라이트',deep:'에이급',deepLag:0,compStop:null,hw:true,fixed:true}
};
/* D 영과고형 "최소 대비"(원장님 2026-10-20, 스타워즈 TOP CLASS·CMS 영재학교/과학고 로드맵·타우루스·수학 학습 로드맵 책):
   초3 6월부터 초등 개념응용·최상위 학기당 3개월(4-1 → 6-2, 9개월) → 초4 3월 중1-1 개념응용·최상위라이트 (15개월, 에이급 병행)
   → 초5 6월 중3-2 에이급 + 수학(상) 기본정석 → 초5 12월 수학(상) 실력정석·수학(하) 기본정석 → 초6 3월 KMO 입문
   → 초6~중1 고등 수Ⅰ·Ⅱ + KMO 1차 집중 → 중2 5월까지 예비과정, 중2 6월~ 영재학교 실전과정 → 중3 7~8월 영재학교 전형 / 9~11월 과학고 전형
   과학: 초3~5 초등 과학 심화 정리 + 영재원 대비, 중등 물화생지 1회독 → 초6 물·화 심화(하이탑) → 중1 물1·화1 정리 → 중2 물1·화1 심화·통합과학
   경시: 3% 1과정(초3 12월~) → 3% 2과정(초4 6월~) → 기초경시 → 경시입문 → KMO 입문(초6 3월) → KMO 1차 → KMO 2차
   비교과(전국 대회, 경험 계획표): 초5~ 대한민국학생발명전시회·전국학생창의력챔피언대회·발명창의력10종경기·청소년과학탐구대회, 중1~ YIP·학생과학탐구올림픽
   영재원: 초3~5 서울교대 → 초6~중1 연세대·서울대 */

/* 과학 트랙(MSG 초등 과학 연계 커리: 영재고·과고 S / 영재고·과고 A / 자사·이과 상위). 순서는 한과연(물리→화학→지학→생명, 심화 브릿지, 올림피아드), 교재는 시중 교재.
   S: 초3 과학동아·실험 → 초4 초등 4-1~6-2(2개월/학기) → 초5 중등 생물·지학·물리·화학 → 초6 화학·물리 심화 → 7월 갈림길(물리올림 대비반 / 프리올림) → 중1·2 올림피아드 대비 → 중2 8월~ 영재고 실전
   A: S 를 한 해 늦춤 — 초4 줄기과학 → 초5 중등 생물·지학 → 초6 중등 물리·화학 → 중1 프리올림 물리·화학반 → 중2 올림피아드 대비 → 중3 영재고 실전
   J(자사·이과 상위): 초5 중등 생물·지학 → 초6 중등 물리·화학 → 중1 물리·화학 심화반 → 중2 화학1·물리1 기초 → 중3 물리올림 또는 화학올림(선택) · 내신
   물리인증(9→5급)·과탐토·과학 실험대회·물리/화학 올림 달은 원장님 표. 물리인증·pre KJSO 는 2026 공식 일정 미확인(확인 필요). */
const SCI_BOOK={elem:'최상위 줄기과학 · 과학 100제',mid:'오투 · 최상위 줄기과학 중등',deep:'하이탑',hi:'완자 · 하이탑 고등',olym:'올림피아드 기본서'};
function sciTrack(track, M, kmo){
  const sci=[], sciIssue=[];
  const push=(t,a,b,bk)=>sci.push([bk?`${t}<br><small>${bk}</small>`:t,a,b]);
  const midSet=(g,order)=>{ const names={bio:'중등 생물',geo:'중등 지학',phy:'중등 물리',chem:'중등 화학'}, q=[[1,3],[4,6],[7,9],[10,12]]; order.forEach((k,i)=>push(names[k],M(g,q[i][0]),M(g,q[i][1]),SCI_BOOK.mid)); };
  if(track==='S'){
    push('어린이 과학동아 · 실험으로 과학 접근',M(3,3),M(3,12));
    [['4-1',1],['4-2',3],['5-1',5],['5-2',7],['6-1',9],['6-2',11]].forEach(([sm,mo])=>push(`초등 과학 ${sm}`,M(4,mo),M(4,mo+1),SCI_BOOK.elem));
    midSet(5,['bio','geo','phy','chem']);
    push('화학 심화',M(6,1),M(6,2),SCI_BOOK.deep); push('물리 심화',M(6,3),M(6,6),SCI_BOOK.deep);
    push(kmo?'물리올림피아드 대비반':'프리올림 화학 또는 물리반',M(6,7),M(6,12),SCI_BOOK.olym);
    push(kmo?'물리올림피아드 대비 · 화1,2 기초':'화1,2 기초 · 물리 정리',M(7,1),M(7,7),SCI_BOOK.hi); push('화학올림피아드 대비 · 물리올림피아드 대비',M(7,8),M(8,7),SCI_BOOK.olym);
    push('영재고 실전 과학반',M(8,8),M(9,7)); push('기출 적중 · 캠프 대비(실험·글쓰기·토론·면접)',M(9,8),M(9,8));
    [[4,8,'물리인증 9급 (일정 확인 필요)'],[4,11,'물리인증 8급'],[5,2,'물리인증 7급'],[5,11,'물리인증 6급'],[6,2,'물리인증 5급'],[5,4,'과탐토'],[5,5,'과학 실험대회'],[6,4,'과탐토'],[6,5,'과학 실험대회'],[7,7,'물리 올림피아드'],[8,7,'물리 올림피아드'],[8,8,'화학 올림피아드']].forEach(([g,mo,t])=>sciIssue.push([t,M(g,mo),M(g,mo)]));
  } else if(track==='A'){
    push('어린이 과학동아 · 실험으로 과학 접근',M(3,3),M(4,2));
    [['4-1',3],['4-2',5],['5-1',7],['5-2',9],['6-1',11]].forEach(([sm,mo])=>push(`초등 과학 ${sm}`,M(4,mo),M(4,mo+1),SCI_BOOK.elem)); push('초등 과학 6-2',M(5,1),M(5,2),SCI_BOOK.elem);
    push('중등 생물',M(5,3),M(5,7),SCI_BOOK.mid); push('중등 지학',M(5,8),M(5,12),SCI_BOOK.mid);
    push('중등 물리',M(6,1),M(6,6),SCI_BOOK.mid); push('중등 화학',M(6,7),M(6,12),SCI_BOOK.mid);
    push('프리올림 물리·화학반 · 물리 심화',M(7,1),M(7,12),SCI_BOOK.deep);
    push('물리올림피아드 또는 화학올림피아드 대비',M(8,1),M(8,12),SCI_BOOK.olym);
    push('영재고 실전 과학반',M(9,1),M(9,7)); push('기출 적중 · 캠프 대비',M(9,8),M(9,8));
    [[5,8,'물리인증 9급 (일정 확인 필요)'],[5,11,'물리인증 8급'],[6,2,'물리인증 7급'],[6,4,'과탐토'],[6,5,'과학 실험대회'],[6,11,'물리인증 6급'],[7,2,'물리인증 5급'],[7,4,'과탐토'],[7,5,'과학 실험대회'],[8,7,'물리 올림피아드'],[8,8,'화학 올림피아드']].forEach(([g,mo,t])=>sciIssue.push([t,M(g,mo),M(g,mo)]));
  } else {
    push('실험과학 · 과학 동아리',M(3,3),M(4,12),'팩토사이언스');
    push('중등 생물',M(5,1),M(5,6),SCI_BOOK.mid); push('중등 지학',M(5,7),M(5,12),SCI_BOOK.mid);
    push('중등 물리',M(6,1),M(6,6),SCI_BOOK.mid); push('중등 화학',M(6,7),M(6,12),SCI_BOOK.mid);
    push('중등 물리·화학 심화반',M(7,1),M(7,12),SCI_BOOK.deep);
    push('화학1 · 물리1 기초',M(8,1),M(8,12),SCI_BOOK.hi);
    push('물리올림피아드 또는 화학올림피아드 (선택) · 내신',M(9,1),M(9,12),SCI_BOOK.olym);
    [[6,2,'물리인증 7급'],[7,2,'물리인증 6급'],[9,7,'물리 올림피아드 (선택)'],[9,8,'화학 올림피아드 (선택)']].forEach(([g,mo,t])=>sciIssue.push([t,M(g,mo),M(g,mo)]));
  }
  return {sci,sciIssue};
}

function buildD(o){
  const now=mOf(o.grade,o.mon), A0=mOf(o.grade,3), A1=mOf(9,12), warn=[], yearOf=m=>o.year+(Math.floor(m/12)-Math.floor(now/12));
  const M=(g,mon)=>mOf(g,mon); // g: 1~6 초, 7~9 중
  const school=[], school2=[], comp=[], calc=[], hw=[], giftA=[], giftB=[], giftP=[], exam=[], contest=[];
  // ---- 수학 교과(스타워즈 TOP CLASS)
  const elem=[['4-1',M(3,6)],['5-1',M(3,9)],['6-1',M(3,12)]];
  elem.forEach(([sm,t],i)=>{ const g=sm[0]; school.push([`${g}-1 개념응용 · 최상위`,t,t+2]); school2.push([`${g}-2 개념응용 · 최상위`,t,t+2]); });
  const mids=[['중1-1',M(4,3)],['중1-2',M(4,6)],['중2-1',M(4,9)],['중2-2',M(4,12)],['중3-1',M(5,3)],['중3-2',M(5,6)]];
  mids.forEach(([sm,t],i)=>{ school.push([`${sm} 개념응용 · 최상위라이트`,t,t+2]); if(i>0) school2.push([`${mids[i-1][0]} 에이급`,t,t+2]); });
  school2.push(['중3-2 에이급',M(5,6),M(5,11)]);
  school.push(['수학(상) 기본정석',M(5,6),M(5,11)],['수학(상) 실력정석 · 수학(하) 기본정석',M(5,12),M(6,2)],['고등 수Ⅰ·Ⅱ 기본·응용 · 확률과 통계',M(6,3),M(7,2)]);
  if(o.kmo==='go') school.push(['고등 수Ⅰ·Ⅱ 심화 (KMO 병행)',M(7,3),M(8,2)],['미적분 1회독 · 중등 심화(내신)',M(8,3),M(9,6)],['영재고 입학 전 미적분 완성',M(9,7),M(9,12)]);
  else school.push(['고등 수Ⅰ·Ⅱ 심화 → 중1 겨울 미적분 선행',M(7,3),M(8,2)],['미적분 완성 · 기하 · 확통 (과학고 로드맵)',M(8,3),M(9,6)],['중등 심화(내신) · 고등 대비',M(9,7),M(9,12)]);
  // ---- 경시
  // KB T3: KMO 는 초5 겨울~초6 3월 시작, 선수 = 공통수학 심화·수Ⅰ·순열조합. 중1 1차 경험 뒤 갈림길(원장님 2026-10-20 "KMO 중등 1차 상 한번 타보고 고등 선행에 집중하는 아이들도")
  comp.push(['3% 1과정',M(3,12),M(4,5)],['3% 2과정',M(4,6),M(4,11)],['기초경시',M(4,12),M(5,5)],['경시입문',M(5,6),M(5,11)],['KMO 입문<br><small>선수: 공통수학 심화 · 수Ⅰ · 순열조합</small>',M(6,3),M(6,8)],['KMO 1차 집중',M(6,9),M(7,5)]);
  if(o.kmo==='go'){ comp.push(['중등 KMO 1차 (중1)',M(7,6),M(7,6)],['KMO 2차 · 영역별 심화 (대수+조합 또는 대수+기하)',M(7,7),M(8,5)],['고등 KMO 1차 (중2)',M(8,6),M(8,6)]); }
  else { comp.push(['중등 KMO 1차 (중1) · 상 받고 전환',M(7,6),M(7,6)],['영재고 대비 영역별 심화 2개 (대수+조합 / 대수+기하)',M(7,7),M(8,5)]); }
  // ---- 연산(중등 전까지 교과와 같이)
  calc.push(['기적의 계산법 7~12 (초4~6 연산)',M(3,6),M(4,2)],['중1 연산 익숙하게',M(4,3),M(4,8)],['중2·3 연산 완성',M(4,9),M(5,5)]);
  // ---- 과학
  const {sci,sciIssue}=sciTrack('S',M,o.kmo==='go');
  // ---- 입시(CMS 영재학교·과학고 로드맵)
  exam.push(['영재학교 예비과정<br><small>중등수학 → KJMO · 고등입문 → KMO · 중등과학</small>',M(6,3),M(8,5)],['영재기본이론 · 고등수학이론 · 영재과학이론',M(8,6),M(8,8)],['기출분석 · 영재수학/과학 문풀 · 고등 물화생지',M(8,9),M(8,12)],
    ['기출변형 · 창의수학/과학 · 자소서',M(9,1),M(9,4)],['적중예상 · Final · 학교별 모의고사',M(9,5),M(9,6)],['영재학교 전형 · 캠프 대비',M(9,7),M(9,8)],['과학고 전형 · 면접',M(9,9),M(9,11)],['내신 대비 or 자사고·의대 트랙',M(9,12),M(9,12)]);
  // ---- 영재원(교대 초3~5, 연·서울대 초6~중1) + 대비 3개월
  giftB.push(['서울교대 과학영재교육원 지원·선발',M(3,7),M(3,9)],['교대 영재원 (합격 시)',M(4,3),M(4,12)]);
  giftA.push(['연세대·서울대 영재교육원 (공동 온라인 선교육 6월 → 지원 9~12월)',M(6,6),M(6,12)],['대학부설 영재원 (합격 시)',M(7,3),M(7,12)]);
  giftP.push(['영재원 대비 3개월 (교대)<br><small>안쌤 수학 100제 3 · 단원별·유형별 · 맛있는 영재 수학 3 · 파이널</small>',M(3,4),M(3,6)],['영재원 대비 3개월 (대학부설)<br><small>안쌤 수학 100제 6 · 단원별·유형별 · 맛있는 영재 수학 6 · 파이널</small>',M(6,3),M(6,5)]);
  // ---- 황소(초2 11월 시험은 이 표 전)
  // ---- 비교과 전국 대회(경험 계획표, 전국만)
  // 비교과 대회(샤인쌤 '영재원 준비를 위한 대회' 2025-03-28 + 경험 계획표 전국 대회). 달은 2025 기준, 해마다 바뀜
  const CT=[];
  for(let g=3;g<=6;g++){ CT.push([g,4,4,'성대경시 (4월)'],[g,10,10,'성대경시 (10월)'],[g,4,4,'서울교대 초등수학 창의사고력대회'],[g,6,6,'AI·SW 사고력 올림피아드'],[g,7,7,'서울교대 초등과학 창의사고력대회']); }
  for(let g=4;g<=6;g++) CT.push([g,5,7,'청소년과학탐구대회 (산출물)']);
  for(let g=5;g<=6;g++) CT.push([g,6,9,'자연관찰탐구대회 (예선)'],[g,4,4,'대한민국 과학축제'],[g,11,11,'과학 싹 큰 잔치']);
  CT.push([5,4,4,'KAIST 사이버영재 접수'],[6,4,4,'KAIST 사이버영재 접수'],[6,6,6,'대학부설 공동 온라인 선교육 접수'],[5,6,6,'pre KJSO 접수(4월 말)·6월~익년 1월 (2026 확인 필요)']);
  CT.push([7,4,5,'YIP청소년발명가 · 학생과학탐구올림픽'],[7,9,10,'창의력챔피언대회 · 코딩프로젝트챌린지'],[7,6,8,'KJSO 1단계'],[8,4,5,'학생과학탐구올림픽 · 발명전시회'],[8,9,10,'에너지환경탐구대회 · 코딩챌린지'],[9,4,5,'학생과학탐구올림픽 (중3)']);
  CT.forEach(([g,a,b,t])=>contest.push([t,M(g,a),M(g,b)]));
  const flags=[[M(6,3),'KMO 입문'],[M(6,7),o.kmo==='go'?'물리올림 대비반':'프리올림 화학/물리'],[M(7,6),o.kmo==='go'?'KMO 계속':'KMO 1차 → 고등 선행'],[M(9,7),'영재학교 전형'],[M(9,9),'과학고 전형']];
  const bubbles=[[M(5,6),`${label(M(5,6))} 돌파 · 생크 · 이든 응시 고려`]];
  const rows=[
    {key:'school',label:'수학 교과',blocks:school,color:'#dbeafe',lane:'수학'},
    {key:'school2',label:'수학 심화',blocks:school2,color:'#e0f2fe',lane:'수학'},
    {key:'comp',label:'경시',blocks:comp,color:'#ede9fe',lane:'수학'},
    {key:'calc',label:'연산',blocks:calc,color:'#dcfce7',lane:'수학'},
    {key:'sci',label:'과학',blocks:sci,color:'#ecfccb',lane:'과학'},
    {key:'sciIssue',label:'과학 자격·대회',blocks:sciIssue,color:'#fef3c7',lane:'과학'},
    {key:'exam',label:'영과고 입시',blocks:exam,color:'#ffe4e6',lane:'입시'},
    {key:'contest',label:'비교과 대회(전국)',blocks:contest,color:'#fef9c3',lane:'입시'},
    {key:'giftP',label:'영재원 대비',blocks:giftP,color:'#fdf2e0',lane:'영재원'},
    {key:'giftB',label:'영재원 · 교대',blocks:giftB,color:'#fae8ff',lane:'영재원'},
    {key:'giftA',label:'영재원 · 대학부설',blocks:giftA,color:'#fce7f3',lane:'영재원'}
  ];
  if(!o.gifted){ rows.splice(rows.findIndex(r=>r.key==='giftP'),3); }
  rows.forEach(r=>{ r.blocks=r.blocks.map(([x,s,e])=>[x,Math.max(s,A0),Math.min(e,A1),e-s+1]).filter(b=>b[1]<=b[2]); });
  if(now>M(3,6)) warn.push(`영과고형은 초3 6월 4-1부터 시작하는 최소 대비 기준이에요. 지금(${label(now)}) 앞 칸은 이미 지났다고 보고, 남은 칸부터 맞춰 보세요.`);
  return {now,A0,A1,mid:M(4,3),rows,flags,bubbles,warn,label,yearOf,band:'D',bandName:'영과고형',kmo:o.kmo};
}
function bandOf(id){ const k=+String(id).replace(/\D/g,''); return id==='ex'?'B':k<=3?'A':k<=9?'B':'C'; } // D 영과고형은 묶음에서 직접 고른다

function build(o){
  if(o.band==='D') return buildD(o);
  const B=BAND[o.band]||BAND.B;
  const now=mOf(o.grade,o.mon), A0=mOf(o.grade,3), A1=A0+45, S=B.elemS||o.speed, warn=[]; // A1: 초5 12월까지(원장님 2026-10-20 "늘리자")
  const yearOf=m=>o.year+(Math.floor(m/12)-Math.floor(now/12));
  // ---- 교과
  const school=[], school2=[];
  let mid;
  if(o.school<=12){
    const appLen=B.elemS?3:S;
    let t=now-(appLen-Math.min(o.schoolLeft,appLen));
    for(let k=o.school;k<=12;k++){
      if(B.elemS){ // C: 응용 3개월 → 같은 학기 심화 2개월
        school.push([`${SEM(k)} 디딤돌 ${k<=4?'기본+응용':'응용'}`,t,t+2]);
        school2.push([`${SEM(k)} 최상위 S`,t+3,t+4]);
      } else {
        school.push([`${SEM(k)} 디딤돌 ${k<=4?'기본+응용':'응용'}`,t,t+S-1]);
        if(k-2>=1) school2.push([`${SEM(k-2)} 최상위 S`,t+1,t+S]);
      }
      t+=S;
    }
    if(B.sys){ school.push(['계통 (5·6학년·중1) · 대수 정리',t,t+3]); mid=t+4; }
    else { school.push(['여유 · 초등 대수 심화',t,t]); mid=t+1; }
  } else if(o.school===13){ school.push(['계통 (5·6학년·중1) · 대수 정리',now-(4-o.schoolLeft),now+o.schoolLeft-1]); mid=now+o.schoolLeft; }
  else { mid=now-(o.school-14)*B.midLen-(B.midLen-o.schoolLeft); }
  seq(mid, MID.map(x=>[x+' '+B.midBook,B.midLen])).forEach(b=>school.push(b));
  const s2end=school2.length?school2[school2.length-1][2]:now-1;
  if(B.deepLag>0&&mid+B.deepLag-1>=s2end+1) school2.push(['황소 대비 고려에 따라 고민 + 중등 쎈',Math.max(s2end+1,now),mid+B.deepLag-1]);
  const deepName=B.deep==='A급'?x=>x+' 중등 심화(A급)':x=>x+' RPM (응용)';
  const mid2=seq(mid+B.deepLag, MID.map(x=>[deepName(x),B.midLen])); mid2.forEach(b=>school2.push(b));
  // ---- 사고력
  const ci=o.comp, comp=[];
  let t=now; comp.push([COMP[ci][0],t-(COMP[ci][1]-o.compLeft),t+o.compLeft-1]); t+=o.compLeft;
  const stopAt=B.compStop?COMP.findIndex(c=>c[0]===B.compStop):COMP.length-1;
  for(let i=ci+1;i<COMP.length&&i<=stopAt;i++){ if(COMP[i][2]==='skip'&&o.band!=='A') continue; comp.push([COMP[i][0],t,t+COMP[i][1]-1]); t+=COMP[i][1]; }
  // ---- 연산
  const calc=[]; t=now;
  for(let i=o.calc;i<CALC.length;i++){ const n=CALC[i][1]||S, left=i===o.calc?Math.min(o.calcLeft,n):n; calc.push([CALC[i][0],t-(i===o.calc?n-left:0),t+left-1]); t+=left; }
  // ---- 과학: 중2-1 중등 심화 끝 다음 달
  const sciStart=mid2[2][2]+1; // 중2-1 심화(A급 또는 RPM) 끝 다음 달
  // 과학 교재(안쌤 과학 학습 로드맵, 원장님 2026-10-20 "넣어도 될 것 같아"). 시기는 그대로, 블록이 걸치는 학년의 책을 적는다.
  const gradeOf=m=>Math.max(1,Math.min(6,Math.floor((m-36)/12)+1+(m%12<2?-1:0)));
  const expBook=(a,b)=>{ const gs=[...new Set([gradeOf(a),gradeOf(b)])]; const nm=g=>g<=2?'팩토사이언스 노벨·에디슨':g<=4?'팩토사이언스 퀴리·뉴턴':'팩토사이언스 아인슈타인'; return [...new Set(gs.map(nm))].join(' → '); };
  const Mg=(g,mo)=>mOf(g,mo), tr=sciTrack(o.band==='A'?'A':'J',Mg,false), sciIssue=tr.sciIssue;
  const sci0=[[`실험과학<br><small>${expBook(sciStart-18,sciStart-7)}</small>`,sciStart-18,sciStart-7],
    ['초5·6 과학<br><small>최상위 줄기과학 5·6 · 안쌤 과학 100제 · 맛있는 영재 과학</small>',sciStart-6,sciStart-1],
    ['중등 과학<br><small>오투 과학 수준 · 최상위 줄기과학 중등</small>',sciStart,sciStart+11],
    ['물·화 심화<br><small>하이탑 + 융합과학</small>',sciStart+12,sciStart+23]];
  // 초3 3월부터는 과학 트랙(MSG)으로, 그 앞은 역산 그대로(원장님 2026-10-20 '시중 교재로')
  const sci=sci0.filter(b=>b[2]<Mg(3,3)).map(b=>[b[0],b[1],Math.min(b[2],Mg(3,3)-1)]).concat(tr.sci);
  // ---- 황소
  const hw=[], flags=[];
  const compEnd=(re)=>{ const b=comp.find(x=>re.test(x[0])); return b?b[2]:null; };
  if(o.hw!=='none'&&B.hw){
    const E=+o.hw, feb=(E%12)===1;
    if(feb){ hw.push(['황소 공부 (편입 위주)',E-2,E-1]); }
    else { hw.push(['황소 개념 3개월',E-5,E-3],['황소 모의고사 2개월',E-2,E-1]);
      const ce=compEnd(/1031 초급/); if(ce!=null&&ce>=E-5) warn.push(`1031 초급이 ${label(ce)}에 끝나 황소 대비(${label(E-5)}) 전에 끝나지 않습니다. 원장님 기준: 황소 대비는 1031 초급을 마친 다음 달부터.`); }
    hw.push(['황소 시험',E,E],[feb?'황소 편입 (합격 시)':'황소 입학 (합격 시)',E+1,E+1]);
    flags.push([E,'황소 시험']);
    if(o.hwDeep){ let N=E+1; while(N%12!==10) N++; if(N-5<=E+1) N+=12;
      hw.push(['심화 개념 3개월 (심화 고려 시)',N-5,N-3],['심화 모의고사 2개월',N-2,N-1],['합격 후 고민 (중등 라인은 계속)',N,N]); }
  }
  if(o.hwMid&&B.hw){ const N=mOf(4,11); hw.push(['황소 중등 시험 대비 3개월',N-3,N-1],['황소 중등 시험 (고려)',N,N]); flags.push([N,'황소 중등 시험']); }
  // ---- 영재원 (2026-10-20 모집요강 기준). 초3 11월이 지났으면 초4 기준(수학·과학 초4 지원 → 초5)
  const gy=now<=mOf(3,11)?3:4, d=12*(gy-3);
  const giftA=[], giftB=[], giftP=[], contest=[];
  const GBOOK=g=>g<=2?`안쌤 수학 100제 ${g}`:`안쌤 수학 100제 ${g} · 영재 사고력 수학 단원별·유형별 · 맛있는 영재 수학 ${g} · 파이널 50제 (초${g<=4?'3~4':'5~6'})`;
  if(o.gifted){
    // 시험 전 3개월만 공부: 교대(7~9월 선발) → 4~6월, 교육청(11월 지원·12월 평가) → 8~10월
    giftP.push([`영재원 대비 3개월 (교대)<br><small>${GBOOK(gy)}</small>`,63+d,65+d],[`영재원 대비 3개월 (교육청)<br><small>${GBOOK(gy)}</small>`,67+d,69+d]); // 영재원은 고려 / 안 고려 하나로(원장님 2026-10-20)
    giftA.push([`가천대 브릿지 접수 · 온라인 과제 (초${gy} 대상)`,61+d,63+d],['가천대 브릿지 관찰수업 (5월 면접 · 5~9월 토)',64+d,68+d],
      [gy===3?'강남서초 영재원 수·과융합 (11월 지원 · 12/5 평가)':'강남서초 영재원 수학·과학 (11월 지원 · 12월 평가)',70+d,71+d],['최종 발표',73+d,73+d],
      [`초${gy+1} 영재원 수업 (합격 시)`,74+d,83+d]);
    flags.push([73+d,'영재원 발표']);
    // 대회·행사(샤인쌤 2025-03-28): 성대경시 4·10월(초1~), 서울교대 수학 4월·과학 7월(초3~), SW 사고력 올림피아드 6월(초3~), HME 는 필요할 때
    for(let g=1;g<=6;g++){ const Mg=(mo)=>mOf(g,mo); contest.push(['성대경시',Mg(4),Mg(4)],['성대경시',Mg(10),Mg(10)]); if(g>=3) contest.push(['서울교대 초등수학 창의사고력대회',Mg(4),Mg(4)],['AI·SW 사고력 올림피아드',Mg(6),Mg(6)],['서울교대 초등과학 창의사고력대회',Mg(7),Mg(7)]); }
  }
  if(o.gifted){
    giftB.push(['서울교대 과학영재교육원 지원·선발 (7~9월)',66+d,68+d],[`교대 영재원 수업 (합격 시, 초${gy+1}) · 합격하면 서울 교육청 영재원 지원 불가`,74+d,83+d]);
  }
  // ---- 말풍선: 중3-1 원리해설 시작 달에 중등 학원 응시 고려
  const bubbles=[]; const m31=mid+12; if(m31>=A0&&m31<=A1) bubbles.push([m31,`${label(m31)} 돌파 · 생크 · 이든 1-1 응시 고려`]);
  const rows=[
    {key:'school',label:'교과',blocks:school,color:'#dbeafe',lane:'수학'},
    {key:'school2',label:'교과 심화',blocks:school2,color:'#e0f2fe',lane:'수학'},
    {key:'comp',label:'사고력·경시',blocks:comp,color:'#ede9fe',lane:'수학'},
    {key:'calc',label:'연산',blocks:calc,color:'#dcfce7',lane:'수학'},
    {key:'sci',label:'과학',blocks:sci,color:'#ecfccb',lane:'과학'},
    {key:'sciIssue',label:'과학 자격·대회',blocks:sciIssue,color:'#fef3c7',lane:'과학'},
    {key:'hw',label:'황소 · 선택',blocks:hw,color:'#fde68a',lane:'황소'},
    {key:'giftP',label:'영재원 대비',blocks:giftP,color:'#fdf2e0',lane:'영재원'},
    {key:'contest',label:'대회·행사',blocks:contest,color:'#fef9c3',lane:'영재원'},
    {key:'giftA',label:'영재원 · 가천대·교육청',blocks:giftA,color:'#fce7f3',lane:'영재원'},
    {key:'giftB',label:'영재원 · 교대',blocks:giftB,color:'#fae8ff',lane:'영재원'}
  ].filter(r=>r.blocks.length||['school','school2','comp','calc','sci'].includes(r.key));
  rows.forEach(r=>{ r.blocks=r.blocks.map(([x,s,e])=>[x,Math.max(s,A0),Math.min(e,A1),e-s+1]).filter(b=>b[1]<=b[2]); });
  return {now,A0,A1,mid,rows,flags,bubbles,warn,label,yearOf,band:o.band,bandName:B.name};
}

/* ---------- 상세 표 ---------- */
function renderTable(P){
  const n=P.A1-P.A0+1; let h='<table class="pl-table"><thead><tr><th class="pl-corner">학년</th>';
  for(let m=P.A0;m<=P.A1;){ const y=schoolYear(m); let k=0; while(m+k<=P.A1&&schoolYear(m+k)===y) k++; h+=`<th colspan="${k}" class="pl-year">${GRADES[y]} · ${P.yearOf(m)}년 3월~</th>`; m+=k; }
  h+='</tr><tr><th class="pl-corner">월</th>';
  for(let m=P.A0;m<=P.A1;m++) h+=`<th class="pl-mon${m===P.now?' pl-now':''}" title="${P.yearOf(m)}년 ${m%12+1}월">${m%12+1}</th>`;
  h+='</tr></thead><tbody>';
  if(P.bubbles.length){ h+='<tr class="pl-bubble-row"><th></th>'; let m=P.A0; P.bubbles.forEach(([bm,txt])=>{ const s=Math.max(P.A0,bm-5); for(;m<s;m++) h+='<td></td>'; h+=`<td colspan="${bm-s+1}" class="pl-bubble-cell"><span class="pl-bubble">${txt}</span></td>`; m=bm+1; }); for(;m<=P.A1;m++) h+='<td></td>'; h+='</tr>'; }
  P.rows.forEach(r=>{
    h+=`<tr><th>${r.label}</th>`; let m=P.A0;
    r.blocks.slice().sort((a,b)=>a[1]-b[1]).forEach(([t,s,e])=>{ if(s<m) return; for(;m<s;m++) h+=`<td class="pl-empty${m===P.now?' pl-now':''}"></td>`; h+=`<td colspan="${e-s+1}" style="background:${r.color}" title="${label(s)}${s===e?'':' ~ '+label(e)}: ${t}">${t}</td>`; m=e+1; });
    for(;m<=P.A1;m++) h+=`<td class="pl-empty${m===P.now?' pl-now':''}"></td>`;
    h+='</tr>';
  });
  return h+'</tbody></table>';
}

/* ---------- 간단 보기: 수학 · 과학 · 영재원 세 줄 + 깃발 ---------- */
function simpleRows(P){
  const R=k=>(P.rows.find(r=>r.key===k)||{blocks:[]}).blocks;
  const sch=R('school'), elem=sch.filter(b=>/디딤돌/.test(b[0])), sys=sch.find(b=>/계통/.test(b[0])), mids=sch.filter(b=>/원리해설/.test(b[0]));
  const math=[];
  if(elem.length) math.push([`초등 교과 ${elem[0][0].split(' ')[0]} → ${elem[elem.length-1][0].split(' ')[0]}`,elem[0][1],elem[elem.length-1][2]]);
  if(sys) math.push(['계통 · 대수 정리',sys[1],sys[2]]);
  if(mids.length) math.push([`중등 ${mids[0][0].split(' ')[0]} → ${mids[mids.length-1][0].split(' ')[0]}`,mids[0][1],mids[mids.length-1][2]]);
  const think=R('comp').map(b=>[b[0].replace(/\s*\(.*\)/,''),b[1],b[2]]);
  const short=b=>[b[0].replace(/<br>.*$/,'').replace(/\s*\(.*\)/,'').replace(/ · .*/,''),b[1],b[2]];
  const giftA=R('giftP').concat(R('giftA')).sort((p,q)=>p[1]-q[1]).map(short), giftB=R('giftB').map(short);
  return [
    {label:'수학',sub:'교과',blocks:math,color:'#bfdbfe'},
    {label:'수학',sub:'사고력',blocks:think,color:'#ddd6fe'},
    {label:'과학',sub:'',blocks:R('sci').map(b=>[b[0].replace(/<br>.*$/,''),b[1],b[2]]),color:'#d9f99d'}
  ].concat(giftA.length?[{label:'영재원',sub:'가천대·교육청',blocks:giftA,color:'#fbcfe8'}]:[],giftB.length?[{label:'영재원',sub:'교대',blocks:giftB,color:'#f5d0fe'}]:[]);
}
function renderSimple(P){
  const rows=simpleRows(P), n=P.A1-P.A0+1, pct=m=>((m-P.A0)/n*100).toFixed(3)+'%';
  let h='<div class="sp-wrap"><div class="sp-axis">';
  for(let m=P.A0;m<=P.A1;m++) if(m%12===2) h+=`<span style="left:${pct(m)}">${GRADES[schoolYear(m)]} 3월</span>`;
  h+=`<i class="sp-now" style="left:${pct(P.now)}"><b>지금</b></i></div>`;
  h+='<div class="sp-flags">'+P.flags.filter(f=>f[0]>=P.A0&&f[0]<=P.A1).map(([m,t])=>`<span style="left:${pct(m)}">⚑ ${t}<small>${label(m)}</small></span>`).join('')+'</div>';
  rows.forEach(r=>{ h+=`<div class="sp-row"><div class="sp-label">${r.label}${r.sub?`<small>${r.sub}</small>`:''}</div><div class="sp-track">`;
    r.blocks.forEach(([t,s,e])=>{ h+=`<span class="sp-bar" style="left:${pct(s)};width:calc(${pct(e+1)} - ${pct(s)});background:${r.color}" title="${label(s)} ~ ${label(e)}">${t}</span>`; });
    h+='</div></div>'; });
  return h+'</div>';
}

/* ---------- 3D (보여주기용, CSS 3D) ---------- */
function render3D(P){
  const lanes=P.rows, CW=34, LH=58, G=150, W=G+(P.A1-P.A0+1)*CW, H=lanes.length*LH;
  const x=m=>G+(m-P.A0)*CW;
  let h=`<div class="d3-stage"><div class="d3-board" style="width:${W}px;height:${H}px">`;
  lanes.forEach((r,i)=>{
    h+=`<div class="d3-lane" style="top:${i*LH}px;height:${LH}px;width:${W}px"><span class="d3-lname" style="width:${G-12}px">${r.label}</span></div>`;
    r.blocks.forEach(([t,s,e])=>{ const z=r.key==='school'?18:r.key==='hw'?14:9;
      h+=`<div class="d3-box" style="left:${x(s)+2}px;top:${i*LH+8}px;width:${x(e+1)-x(s)-4}px;height:${LH-16}px;--z:${z}px;--c:${r.color}" title="${label(s)} ~ ${label(e)}: ${t}"><div class="d3-top">${t}</div><div class="d3-front"></div><div class="d3-side"></div></div>`; });
  });
  for(let m=P.A0;m<=P.A1;m++) if(m%12===2) h+=`<div class="d3-tick" style="left:${x(m)}px;height:${H}px"><span>${GRADES[schoolYear(m)]}</span></div>`;
  h+=`<div class="d3-nowline" style="left:${x(P.now)}px;width:${CW}px;height:${H}px"></div>`;
  P.flags.concat(P.bubbles).filter(f=>f[0]>=P.A0&&f[0]<=P.A1).forEach(([m,t])=>{ h+=`<div class="d3-flag" style="left:${x(m)+CW/2}px;top:${-6}px"><div class="d3-pole"><span>${t}</span></div></div>`; });
  return h+'</div></div>';
}
function bind3D(box){
  const st=box.querySelector('.d3-stage'), bd=box.querySelector('.d3-board'); if(!bd) return;
  let rx=52, rz=-16, drag=null;
  const fit=()=>{ const s=Math.min(1,(st.clientWidth-20)/bd.offsetWidth*1.15); bd.style.transform=`translate(-50%,-50%) scale(${s}) rotateX(${rx}deg) rotateZ(${rz}deg)`; };
  st.addEventListener('pointerdown',e=>{ drag=[e.clientX,e.clientY,rx,rz]; st.setPointerCapture(e.pointerId); });
  st.addEventListener('pointermove',e=>{ if(!drag) return; rz=Math.max(-60,Math.min(20,drag[3]+(e.clientX-drag[0])*0.25)); rx=Math.max(20,Math.min(75,drag[2]-(e.clientY-drag[1])*0.25)); fit(); });
  st.addEventListener('pointerup',()=>{ drag=null; });
  window.addEventListener('resize',fit); fit();
}


/* ---------- 3D 맵(시안 UX): 큰 이정표를 섬으로, 보라 점선 길로 잇는다. 보여주기용 ---------- */
function milestones(P){
  const R=k=>(P.rows.find(r=>r.key===k)||{blocks:[]}).blocks;
  const at=(k,m)=>{ const b=R(k).find(x=>x[1]<=m&&x[2]>=m); return b?b[0]:''; };
  const short=t=>t.replace(/ 디딤돌.*| 원리해설| \(.*\)/g,'');
  const sch=R('school'), elem=sch.filter(b=>/디딤돌|개념응용 · 최상위$/.test(b[0])), sys=sch.find(b=>/계통/.test(b[0])), mids=sch.filter(b=>/원리해설|개념원리|^중1-1 개념응용/.test(b[0]));
  const out=[{m:P.now,kind:'now',title:'현재 · '+label(P.now),sub:[short(at('school',P.now)),at('comp',P.now).replace(/\s*\(.*\)/,'')].filter(Boolean).join(' · '),icon:'📍'}];
  if(elem.length&&elem[elem.length-1][2]>P.now) out.push({m:elem[elem.length-1][2],kind:'step',title:'초등 교과 완료',sub:(P.band==='D'?'6-2 개념응용·최상위':'디딤돌 6-2')+' · '+label(elem[elem.length-1][2]),icon:'📘'});
  if(sys&&sys[1]>P.now){ const c=at('comp',sys[1]); out.push({m:sys[1],kind:'step',title:'계통 · 대수 정리',sub:(/3%/.test(c)?'3% 1과정 함께 · ':'')+label(sys[1]),icon:'🧮'}); }
  if(mids.length&&mids[0][1]>P.now) out.push({m:mids[0][1],kind:'step',title:'중등 시작',sub:mids[0][0].replace(/<br>.*$/,'').replace(/^중1-1 /,'중1-1 ')+' · '+label(mids[0][1]),icon:'🏫'});
  if(P.band==='D'){ const ex=R('exam').find(b=>/영재학교 전형/.test(b[0])); if(ex) out.push({m:ex[1],kind:'step',title:'영재학교 전형',sub:label(ex[1])+' · 캠프 대비',icon:'🏆'}); const k=R('comp').find(b=>/KMO 입문/.test(b[0])); if(k&&k[1]>P.now) out.push({m:k[1],kind:'step',title:'KMO 입문',sub:label(k[1]),icon:'🥇'}); }
  const g=R('giftA').find(b=>/영재원 수업/.test(b[0])); if(g) out.push({m:g[1],kind:'gift',title:'영재원 (합격 시)',sub:label(g[1])+' 수업 시작',icon:'🔭'});
  P.bubbles.forEach(([m,t])=>out.push({m,kind:'step',title:'중등 학원 응시 고려',sub:t.replace(/ 응시 고려$/,'').replace(/^\S+ \S+ /,'')+' · '+label(m),icon:'🎯'}));
  const s=R('sci').find(b=>/중등 과학/.test(b[0])); if(s&&s[1]<=P.A1) out.push({m:s[1],kind:'sci',title:'중등 과학',sub:label(s[1])+' · 오투 · 최상위 줄기과학',icon:'🧪'});
  out.sort((a,b)=>a.m-b.m);
  const hw=R('hw').filter(b=>/시험/.test(b[0])&&!/대비/.test(b[0])).map(b=>({m:b[1],kind:'branch',title:b[0].replace(/\s*\(.*\)/,''),sub:label(b[1])+' · 선택',icon:'🐂'}));
  return {main:out,branch:hw};
}
function render3DMap(P){
  const {main,branch}=milestones(P), W=1500, H=820;
  // 섬 자리: 왼쪽 아래(현재)에서 오른쪽 위(중등 이후)로 굽이치는 길
  const pts=main.map((x,i)=>{ const t=main.length>1?i/(main.length-1):0; return {x:160+t*(W-360),y:H-170-t*(H-400)+Math.sin(t*Math.PI*2.2)*80}; });
  // 갈래 섬: 해당 구간 가운데에서 길과 직각으로 오른쪽 아래로 비켜 둔다
  const bpts=branch.map((x,i)=>{ const k=main.findIndex(mm=>mm.m>=x.m), j=Math.max(1,k<0?main.length-1:k), a=pts[j-1], b=pts[j]||a;
    let dx=b.x-a.x, dy=b.y-a.y, L=Math.hypot(dx,dy)||1; const px=-dy/L, py=dx/L, sgn=(px+py)>0?1:-1;
    return {x:(a.x+b.x)/2+sgn*px*210,y:(a.y+b.y)/2+sgn*py*210}; });
  let path=''; pts.forEach((p,i)=>{ if(i){ const q=pts[i-1], cx=(q.x+p.x)/2; path+=` C ${cx} ${q.y}, ${cx} ${p.y}, ${p.x} ${p.y}`; } else path='M '+p.x+' '+p.y; });
  let bpath=bpts.map((b,i)=>{ const k=main.findIndex(mm=>mm.m>=branch[i].m), j=Math.max(1,k<0?main.length-1:k), a=pts[j-1], c=pts[j]||a, mx=(a.x+c.x)/2, my=(a.y+c.y)/2; return `<path d="M ${mx} ${my} Q ${(mx+b.x)/2+30} ${(my+b.y)/2-30}, ${b.x} ${b.y}" class="m3-bpath"/>`; }).join('');
  let h=`<div class="m3-stage"><div class="m3-plane" style="width:${W}px;height:${H}px">`;
  h+=`<svg class="m3-svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"><path d="${path}" class="m3-path-glow"/><path d="${path}" class="m3-path"/>${bpath}</svg>`;
  // 나무
  for(let i=0;i<46;i++){ const x=(i*317)%W, y=(i*191)%H; if(pts.concat(bpts).some(p=>Math.hypot(p.x-x,p.y-y)<120)) continue; h+=`<div class="m3-tree" style="left:${x}px;top:${y}px;--s:${0.7+((i*7)%5)/10}"><i></i></div>`; }
  const island=(p,m,cls)=>`<div class="m3-island ${cls}" style="left:${p.x}px;top:${p.y}px"><div class="m3-rock"></div><div class="m3-top"></div><div class="m3-card"><span class="m3-ico">${m.icon}</span><b>${m.title}</b><small>${m.sub}</small></div>${m.kind==='now'?'<div class="m3-pin"></div>':''}</div>`;
  main.forEach((m,i)=>{ h+=island(pts[i],m,'k-'+m.kind); });
  branch.forEach((m,i)=>{ h+=island(bpts[i],m,'k-branch'); });
  return h+'</div></div>';
}
function bindMap(box){
  const st=box.querySelector('.m3-stage'), pl=box.querySelector('.m3-plane'); if(!pl) return;
  let rx=50, rz=-24, drag=null;
  const fit=()=>{ const s=Math.min(0.95,st.clientWidth/1500*0.92); pl.style.transform=`translate(-50%,-50%) scale(${s}) rotateX(${rx}deg) rotateZ(${rz}deg)`; pl.style.setProperty('--bx',`rotateZ(${-rz}deg) rotateX(${-rx}deg)`); };
  st.onpointerdown=e=>{ drag=[e.clientX,e.clientY,rx,rz]; st.setPointerCapture(e.pointerId); };
  st.onpointermove=e=>{ if(!drag) return; rz=Math.max(-50,Math.min(10,drag[3]+(e.clientX-drag[0])*0.2)); rx=Math.max(25,Math.min(65,drag[2]-(e.clientY-drag[1])*0.2)); fit(); };
  st.onpointerup=()=>{ drag=null; };
  window.addEventListener('resize',fit); fit();
}


/* ---------- 분석지: 학년마다 서술(몇 개월 주기로, 언제 무엇을 시작·완료) ---------- */
function narrative(P){
  if(P.band==='D') return narrativeD(P);
  /* 학년마다: 월별 줄(3월~2월)에 시작·이슈를 찍고, 교과·사고력·심화·연산 항목별로 코멘트를 쓴다(원장님 2026-10-20). */
  const R=k=>(P.rows.find(r=>r.key===k)||{blocks:[]}).blocks;
  const mon=m=>(m%12+1)+'월', nm=t=>t.replace(/<br>.*$/,'').replace(/\s*\(.*\)/,'').trim(), len=b=>b[3]||(b[2]-b[1]+1);
  const jo=(w,a,b)=>{ const c=w.replace(/[^가-힣0-9A-Za-z]+$/,'').slice(-1), code=c.charCodeAt(0); let has; if(/[가-힣]/.test(c)) has=(code-0xAC00)%28>0; else if(/[0-9]/.test(c)) has=/[013678]/.test(c); else has=/[lmnr]/i.test(c); return w+(has?a:b); };
  const sem=t=>t.split(' ')[0];
  const years=[]; for(let a=P.A0;a<=P.A1;a+=12) years.push([a,Math.min(a+11,P.A1)]);
  return years.map(([a,b])=>{
    const g=label(a).split(' ')[0], lo=Math.max(a,P.now);
    const inY=bs=>bs.filter(x=>x[2]>=lo&&x[1]<=b).sort((p,q)=>p[1]-q[1]);
    const last=bs=>bs[bs.length-1];
    // ---- 월별 줄: 시작·이슈
    const months=[]; for(let m=a;m<=b;m++) months.push({m,mon:mon(m),now:m===P.now,past:m<P.now,starts:[],issues:[]});
    const put=(m,text,kind)=>{ const c=months.find(x=>x.m===m); if(c) c[kind].push(text); };
    const sch=inY(R('school')), comp=inY(R('comp')), s2=inY(R('school2')), calc=inY(R('calc'));
    sch.forEach(x=>{ if(x[1]>=lo){ const t=x[0]; put(x[1],/디딤돌/.test(t)?sem(t):/계통/.test(t)?'계통·대수 정리':/원리해설/.test(t)?sem(t)+' 원리해설':nm(t),'starts'); } });
    comp.forEach(x=>{ if(x[1]>=lo) put(x[1],nm(x[0]).replace(' + workbook',''),'starts'); });
    inY(R('hw')).forEach(x=>{ put(x[1],nm(x[0]),'issues'); });
    inY(R('giftA').concat(R('giftB'))).forEach(x=>{ put(x[1],nm(x[0]).replace(/ · .*/,''),'issues'); });
    inY(R('giftP')).forEach(x=>{ put(x[1],'영재원 대비 시작','issues'); });
    inY(R('contest')).forEach(x=>{ if(x[1]>=lo) put(x[1],nm(x[0]),'issues'); });
    inY(R('sciIssue')).forEach(x=>{ if(x[1]>=lo) put(x[1],nm(x[0]),'issues'); });
    inY(R('exam')).forEach(x=>{ if(x[1]>=lo) put(x[1],nm(x[0]),'issues'); });
    inY(R('contest')).forEach(x=>{ if(x[1]>=lo) put(x[1],'대회: '+nm(x[0]).split(' · ')[0],'issues'); });
    inY(R('sci')).forEach(x=>{ if(x[1]>=lo) put(x[1],nm(x[0])+' 시작','issues'); });
    P.bubbles.forEach(([m,t])=>{ if(m>=a&&m<=b) put(m,t.replace(/^\S+ \S+ /,'').replace(/ 고려$/,''),'issues'); });
    // ---- 항목별 코멘트
    const items=[];
    { const dd=sch.filter(x=>/디딤돌/.test(x[0])), sys=sch.find(x=>/계통/.test(x[0])), md=sch.filter(x=>/원리해설|개념원리/.test(x[0])), out=[]; const mbook=md.length&&/개념원리/.test(md[0][0])?'개념원리':'원리해설';
      if(dd.length){ const pace=len(dd[dd.length>1?1:0]), done=last(dd);
        out.push(dd.length>1?(P.band==='C'?`${mon(Math.max(dd[0][1],lo))}부터 ${sem(dd[0][0])}에서 ${sem(done[0])}까지 디딤돌 응용으로 나가요. 응용 3개월에 같은 학기 심화 2개월을 붙여 한 학기 5개월이에요.`:`${mon(Math.max(dd[0][1],lo))}부터 한 학기를 ${pace}개월씩, ${sem(dd[0][0])}에서 ${sem(done[0])}까지 디딤돌 응용으로 나가요.`):`${mon(Math.max(dd[0][1],lo))}~${mon(dd[0][2])} ${jo(sem(dd[0][0])+' 디딤돌 응용','을','를')} 마무리해요.`);
        if(done[2]<=b) out.push(`${mon(done[2])}이면 초등 교과가 ${sem(done[0])}까지 끝나요.`); }
      if(sys) out.push(`${mon(Math.max(sys[1],lo))}부터 ${len(sys)}개월은 5·6학년과 중1을 계통으로 묶어 대수를 정리해요. 중등에 들어가기 전에 빈 곳을 메우는 시간이에요.`);
      if(md.length){ const f=md[0], l=last(md), end=l[2]<=b?mon(l[2]):label(l[2]);
        out.push(f[1]>=lo&&/^중1-1/.test(f[0])?`${mon(f[1])}에 ${sem(f[0])} ${mbook}로 중등을 시작해요. 한 학기 ${len(f)}개월씩 ${end}까지 ${sem(l[0])}까지 가요.${P.band==='C'?' 개념서는 개념원리, 응용서는 RPM으로 2년에 걸쳐 가요.':P.band==='A'?' 계통 없이 바로 들어가요.':''}`:`중등 ${mbook}를 ${sem(f[0])}부터 이어서 ${len(f)}개월씩, ${end}까지 ${jo(sem(l[0]),'을','를')} 봐요.`); }
      if(out.length) items.push({label:'교과',text:out.join(' ')}); }
    { const out=[]; comp.forEach(x=>{ const w=nm(x[0]).replace(' + workbook',''), en=x[2]<=b, st=x[1]>=lo;
        if(st&&en) out.push(`${mon(x[1])}에 ${jo(w,'을','를')} 시작해 ${mon(x[2])}까지 ${len(x)}개월에 끝내요.`);
        else if(st) out.push(`${mon(x[1])}에 ${jo(w,'을','를')} 시작해요. ${label(x[2])}까지 ${len(x)}개월 과정이에요.`);
        else if(en) out.push(`하던 ${jo(w,'은','는')} ${mon(x[2])}까지 완료해요.`);
        else out.push(`${jo(w,'은','는')} ${label(x[2])}까지 쭉 이어 가요.`); });
      const cEnd=last(comp); if(P.band==='C'&&cEnd&&/1031 초급/.test(cEnd[0])&&cEnd[2]<=b) out.push('1031 초급까지 하면 사고력은 여기서 끝이에요. 그다음은 교과 심화로 넘어가요.');
      if(P.band==='D'&&comp.some(x=>/KMO 입문/.test(x[0]))) out.push('KMO는 공통수학 심화와 수Ⅰ, 순열·조합을 끝낸 뒤 시작해요. 영재학교 입시에 KMO가 필수는 아니라서, 중1 1차를 본 뒤 계속 갈지 고등 선행으로 돌릴지 정해요.');
      if(P.band==='D'&&comp.some(x=>/상 받고 전환/.test(x[0]))) out.push('이 길은 중1 KMO 1차에서 상을 한 번 받고 고등 선행에 집중하는 쪽이에요. 영재고 대비는 영역 두 개만 깊게 가요.');
      const c3=comp.find(x=>/3%/.test(x[0])); if(c3&&c3[2]<=b&&last(comp)===c3){ const hw=R('hw').find(x=>/시험$/.test(nm(x[0]))&&x[1]>c3[2]&&x[1]<=b); out.push(hw?`3% 1과정은 ${label(hw[1])} 황소 시험 전에 마치는 게 목표예요.`:`3% 1과정까지 하면 사고력 라인은 일단 마무리예요.`); }
      if(out.length) items.push({label:'사고력',text:out.join(' ')}); }
    { const sAll=s2.filter(x=>/최상위 S/.test(x[0])), sS=P.band==='C'?[]:sAll, sC=P.band==='C'?sAll:[], gap=s2.find(x=>/고민/.test(x[0])), sA=s2.filter(x=>/A급/.test(x[0])), sR=s2.filter(x=>/RPM/.test(x[0])), out=[];
      if(sC.length) out.push(`응용을 마친 학기마다 바로 최상위 S를 2개월씩 해요. ${sC.length>1?`${sem(sC[0][0])}에서 ${sem(last(sC)[0])}까지예요.`:`이번엔 ${jo(sem(sC[0][0]),'이에요','예요')}.`}`);
      if(sR.length){ const f=sR[0], l=last(sR); out.push(`중등은 A급 대신 RPM을 응용서로 ${len(f)}개월씩, ${l[2]<=b?mon(l[2]):label(l[2])}까지 ${jo(sem(l[0]),'을','를')} 풀어요.`); }
      if(sS.length){ const f=sS[0], l=last(sS); out.push(`교과보다 한 학년 아래 최상위 S를 ${mon(Math.max(f[1],lo))}부터 ${len(f)}개월씩 ${sem(f[0])}에서 ${sem(l[0])}까지, 교과보다 한 달 늦게 따라가요.`); }
      if(gap) out.push(`${mon(Math.max(gap[1],lo))}~${mon(gap[2])}은 황소를 볼지에 따라 달라요. 이 사이에는 중등 쎈으로 기본을 다져요.`);
      if(sA.length){ const f=sA[0], l=last(sA), end=l[2]<=b?mon(l[2]):label(l[2]);
        out.push(f[1]>=lo&&/^중1-1/.test(f[0])?`${mon(f[1])}부터 중등 심화(A급)를 ${len(f)}개월씩 시작해 ${end}까지 ${jo(sem(l[0]),'을','를')} 해요. 원리해설보다 두 달 뒤에 따라가는 거예요.`:`중등 심화(A급)는 ${sem(f[0])}부터 ${len(f)}개월씩, ${end}까지 ${jo(sem(l[0]),'을','를')} 해요.`); }
      if(out.length) items.push({label:'심화',text:out.join(' ')}); }
    { const gj=calc.filter(x=>/계산법/.test(x[0])), mj=calc.filter(x=>/중학/.test(x[0])), out=[];
      if(gj.length){ const f=gj[0], l=last(gj); out.push(gj.length>1?`기적의 계산법 ${f[0].match(/\d+/)[0]}권에서 ${l[0].match(/\d+/)[0]}권까지 ${len(gj[1])}개월에 한 권씩 해요. ${P.band==='C'?'교과와 같은 학기를 한 권으로, 겹치지 않게 가요.':'교과보다 한 학기 앞서 가는 속도예요.'}`:`기적의 계산법 ${f[0].match(/\d+/)[0]}권을 ${mon(f[2])}까지 끝내요.`); }
      if(mj.length){ const f=mj[0]; out.push(`${f[1]>=lo?mon(f[1])+'부터':'이어서'} ${mj.map(x=>x[0].replace('기적의 ','')).join(' → ')} 순서로 중학 연산을 해요.`); if(f[1]>=lo&&/1AB/.test(f[0])) out.push('초등 계산이 끝나면 바로 중학연산 1AB부터 들어가요.'); }
      if(out.length) items.push({label:'연산',text:out.join(' ')}); }
    { const sc=inY(R('sci')).filter(x=>x[1]>=lo); const head=t=>t.replace(/<br>.*$/,''), book=t=>(t.match(/<small>(.*?)<\/small>/)||[,''])[1];
      const si=inY(R('sciIssue')).filter(x=>x[1]>=lo);
      if(sc.length||si.length) items.push({label:'과학',text:(sc.length?sc.map((x,i)=>`${mon(x[1])}부터 ${i<sc.length-1?head(x[0]):jo(head(x[0]),'을','를')}`).join(', ')+' 시작해요.'+(sc.some(x=>/중등 과학$/.test(head(x[0])))?' 중2-1 심화가 끝난 다음 달이에요.':'')+(sc.map(x=>book(x[0])).filter(Boolean).length?' 교재는 '+[...new Set(sc.map(x=>book(x[0])).filter(Boolean))].join(' / ')+'.':''):'')+(si.length?' 자격·대회: '+si.map(x=>`${mon(x[1])} ${head(x[0])}`).join(', ')+'.':'')}); }
    { const ex=inY(R('exam')); if(ex.length) items.push({label:'영과고 입시',text:ex.map(x=>`${mon(x[1])}${x[2]>x[1]&&x[2]<=b?'~'+mon(x[2]):''} ${nm(x[0])}`).join(', ')+'.'});
      const ct=inY(R('contest')); if(ct.length) items.push({label:'대회',text:ct.map(x=>`${mon(x[1])} ${nm(x[0])}`).join(', ')+'. 성대경시는 황소·영재원·사고력 대비가 되고, 저학년은 준비해서 봐요. 달은 해마다 바뀌니 당해 공고를 확인해요.'}); }
    { const ev=inY(R('hw')); if(ev.length) items.push({label:'황소',text:ev.map(x=>`${mon(x[1])}${x[2]>x[1]?'~'+mon(x[2]):''} ${nm(x[0])}`).join(', ')+'.'+(ev.some(x=>/시험$/.test(nm(x[0])))?' 시험 결과를 보고 다음을 정해요.':'')});
      const gv=inY(R('giftA').concat(R('giftB'))), gp=inY(R('giftP'));
      if(gv.length||gp.length){ let t=gv.map(x=>`${mon(x[1])}${x[2]>x[1]&&x[2]<=b?'~'+mon(x[2]):''} ${nm(x[0]).replace(/ · .*/,'')}`).join(', ')+'.';
        if(gp.length){ const bk=gp[0][0].replace(/<[^>]+>/g,' ').replace(/.*3개월 \(.*?\)\s*/,'').trim(); t+=` 영재원은 시험 전 3개월만 따로 공부해요(${gp.map(x=>mon(x[1])+'~'+mon(x[2])).join(', ')}). 교재는 ${bk}.`; }
        items.push({label:'영재원',text:t}); } }
    return {title:g,months,items};
  }).filter(y=>y.items.length);
}

/* ---------- D 영과고형 서술(학년마다 월별 줄 + 항목별 코멘트). 공용 narrative 는 디딤돌·원리해설 기준이라 따로 쓴다. ---------- */
function narrativeD(P){
  const R=k=>(P.rows.find(r=>r.key===k)||{blocks:[]}).blocks;
  const mon=m=>(m%12+1)+'월', head=t=>t.replace(/<br>.*$/,'').replace(/\s*\((?!상|하)[^)]*\)/g,'').trim(), book=t=>(t.match(/<small>(.*?)<\/small>/)||[,''])[1], len=b=>b[3]||(b[2]-b[1]+1);
  const jo=(w,a,b)=>{ const c=w.replace(/[^가-힣0-9A-Za-z]+$/,'').slice(-1), code=c.charCodeAt(0); let has; if(/[가-힣]/.test(c)) has=(code-0xAC00)%28>0; else if(/[0-9]/.test(c)) has=/[013678]/.test(c); else has=/[lmnr]/i.test(c); return w+(has?a:b); };
  const span=(x,b)=>`${mon(x[1])}${x[2]>x[1]?'~'+(x[2]<=b?mon(x[2]):label(x[2])):''}`;
  const years=[]; for(let a=P.A0;a<=P.A1;a+=12) years.push([a,Math.min(a+11,P.A1)]);
  return years.map(([a,b])=>{
    const g=label(a).split(' ')[0], lo=Math.max(a,P.now);
    const inY=bs=>bs.filter(x=>x[2]>=lo&&x[1]<=b).sort((p,q)=>p[1]-q[1]), st=x=>x[1]>=lo;
    const months=[]; for(let m=a;m<=b;m++) months.push({m,mon:mon(m),now:m===P.now,past:m<P.now,starts:[],issues:[]});
    const put=(m,text,kind)=>{ const c=months.find(x=>x.m===m); if(c) c[kind].push(text); };
    inY(R('school')).forEach(x=>{ if(st(x)) put(x[1],head(x[0]).replace(/ 개념응용.*$/,'').replace(' 기본·응용 · 확률과 통계',''),'starts'); });
    inY(R('comp')).forEach(x=>{ if(st(x)) put(x[1],head(x[0]),'starts'); });
    inY(R('exam')).forEach(x=>{ if(st(x)) put(x[1],head(x[0]).split(' · ')[0],'issues'); });
    inY(R('contest')).forEach(x=>{ if(st(x)) put(x[1],'대회: '+head(x[0]).split(' · ')[0],'issues'); });
    inY(R('giftP')).forEach(x=>{ if(st(x)) put(x[1],'영재원 대비 시작','issues'); });
    inY(R('giftA').concat(R('giftB'))).forEach(x=>{ if(st(x)) put(x[1],head(x[0]).replace(/ \(합격 시\)/,''),'issues'); });
    inY(R('sci')).forEach(x=>{ if(st(x)) put(x[1],head(x[0]).replace(/ 시작$/,'')+' 시작','issues'); });
    inY(R('sciIssue')).forEach(x=>{ if(st(x)) put(x[1],head(x[0]),'issues'); });
    P.flags.forEach(([m,t])=>{ if(m>=lo&&m<=b&&!/KMO 입문/.test(t)) put(m,t,'issues'); });
    const items=[], S=(label,arr)=>{ if(arr.length) items.push({label,text:arr.join(' ')}); };
    // 수학 교과
    { const sc=inY(R('school')), el=sc.filter(x=>/개념응용 · 최상위$/.test(x[0])), md=sc.filter(x=>/최상위라이트/.test(x[0])), hi=sc.filter(x=>/정석|고등|미적분|기하/.test(x[0])), out=[];
      if(el.length) out.push(`${mon(Math.max(el[0][1],lo))}부터 ${el[0][0].split(' ')[0]}에서 ${el[el.length-1][0].split(' ')[0]}까지 한 학기 3개월씩, 개념응용과 최상위를 같이 해요. 초등 교과는 1학기 줄, 2학기는 심화 줄에서 같은 속도로 나가요.`);
      if(md.length){ const f=md[0], l=md[md.length-1]; out.push(f[1]>=lo&&/중1-1/.test(f[0])?`${mon(f[1])}에 중1-1로 중등을 시작해요. 개념응용과 최상위라이트를 한 학기 3개월씩, ${l[2]<=b?mon(l[2]):label(l[2])}까지 ${l[0].split(' ')[0]}까지 가요. 15개월 속진이라 에이급을 한 학기 뒤에서 따라붙여요.`:`중등은 ${f[0].split(' ')[0]}부터 이어서 3개월씩, ${l[2]<=b?mon(l[2]):label(l[2])}까지 ${l[0].split(' ')[0]}을 해요.`); }
      hi.forEach(x=>{ out.push(`${st(x)?mon(x[1])+'부터':'이어서'} ${jo(head(x[0]),'을','를')} ${x[2]<=b?mon(x[2])+'까지':label(x[2])+'까지'} 해요.`); });
      S('수학 교과',out); }
    // 수학 심화
    { const s2=inY(R('school2')), el=s2.filter(x=>/개념응용 · 최상위$/.test(x[0])), eg=s2.filter(x=>/에이급/.test(x[0])), out=[];
      if(el.length) out.push(`2학기(${el[0][0].split(' ')[0]}~${el[el.length-1][0].split(' ')[0]})는 같은 3개월 안에 심화 줄로 같이 가요.`);
      if(eg.length){ const f=eg[0], l=eg[eg.length-1]; out.push(`에이급은 ${mon(Math.max(f[1],lo))}부터 ${f[0].split(' ')[0]}에서 ${l[0].split(' ')[0]}까지, 교과보다 한 학기 뒤에서 따라가요.${/중3-2/.test(l[0])&&l[2]<=b?' 중3-2 에이급은 6개월을 두고 고등 정석과 겹쳐 가요.':''}`); }
      S('수학 심화',out); }
    // 경시
    { const cp=inY(R('comp')), out=[];
      cp.forEach(x=>{ const w=head(x[0]); if(/KMO 1차$|KMO 1차 · 상|고등 KMO 1차/.test(w)){ out.push(`${mon(x[1])}에 ${w.replace(/ · 상 받고 전환/,'')}를 봐요.`); return; }
        if(st(x)) out.push(`${mon(x[1])}에 ${jo(w,'을','를')} 시작해 ${x[2]<=b?mon(x[2])+'까지 '+len(x)+'개월':label(x[2])+'까지'}${x[2]<=b?'에 끝내요.':' 가요.'}`); else out.push(`하던 ${jo(w,'은','는')} ${x[2]<=b?mon(x[2])+'까지 완료해요.':label(x[2])+'까지 이어 가요.'}`); });
      if(cp.some(x=>/KMO 입문/.test(x[0])&&st(x))) out.push('KMO는 공통수학 심화와 수Ⅰ, 순열·조합을 끝낸 뒤 시작해요. 영재학교 입시에 KMO가 필수는 아니라서, 중1 1차를 본 뒤 계속 갈지 고등 선행으로 돌릴지 정해요.');
      if(cp.some(x=>/상 받고 전환/.test(x[0]))) out.push('이 길은 중1 KMO 1차에서 상을 한 번 받고 고등 선행에 집중하는 쪽이에요. 영재고 대비는 영역 두 개만 깊게 가요.');
      if(cp.some(x=>/KMO 2차/.test(x[0]))) out.push('이 길은 KMO를 계속 가는 쪽이에요. 2차와 영역별 심화를 하면서 영재고 입학 전까지 미적분 1회독을 맞춰요.');
      S('경시',out); }
    // 연산
    { const out=inY(R('calc')).map(x=>`${st(x)?mon(x[1])+'부터':'이어서'} ${jo(head(x[0]),'을','를')} ${x[2]<=b?mon(x[2]):label(x[2])}까지 해요.`); S('연산',out); }
    // 과학
    { const sc0=inY(R('sci')), el=sc0.filter(x=>/^초등 과학 \d/.test(x[0])), sc=sc0.filter(x=>!/^초등 과학 \d/.test(x[0]));
      const out=[]; if(el.length){ const byS=el.slice().sort((p,q)=>p[1]-q[1]); out.push(`${mon(Math.max(byS[0][1],lo))}부터 초등 과학을 ${byS[0][0].match(/\d-\d/)[0]}에서 ${byS[byS.length-1][0].match(/\d-\d/)[0]}까지 한 학기 2개월씩 빠르게 봐요. 교재는 ${book(el[0][0])}.`); }
      sc.forEach(x=>{ const bk=book(x[0]); out.push(`${st(x)?mon(x[1])+'부터':'이어서'} ${jo(head(x[0]),'을','를')} ${x[2]<=b?mon(x[2]):label(x[2])}까지 해요.${bk?' 교재는 '+bk+'.':''}`); });
      if(sc.some(x=>/물리올림피아드 대비반|프리올림/.test(x[0])&&st(x))) out.push('초6 7월부터는 갈림길이에요. 수학이 좋은 아이는 물리올림피아드 대비반으로, 아니면 프리올림 화학이나 물리반으로 가요.');
      const si=inY(R('sciIssue')); if(si.length) out.push('자격·대회: '+si.map(x=>`${mon(x[1])} ${head(x[0])}`).join(', ')+'.');
      S('과학',out); }
    // 입시
    { const ex=inY(R('exam')), out=[];
      ex.forEach(x=>{ const w=head(x[0]); if(/예비과정/.test(w)){ if(st(x)) out.push(`${mon(x[1])}부터 ${label(x[2])}까지 영재학교 예비과정이에요. 중등수학에서 KJMO, 고등 입문·심화에서 KMO, 중등과학 순으로 깊이를 쌓아요.`); return; }
        out.push(`${span(x,b)} ${w}.`); });
      if(ex.some(x=>/영재학교 전형/.test(x[0]))) out.push('영재학교 전형은 7~8월, 과학고는 9~11월이에요(학교별로 다르니 당해 요강 확인). 떨어지면 12월부터 내신 대비나 자사고·의대 트랙으로 갈아타요.');
      S('영과고 입시',out); }
    // 비교과·영재원
    { const ct=inY(R('contest')); if(ct.length) items.push({label:'비교과',text:'대회·행사: '+ct.map(x=>`${mon(x[1])}${x[2]>x[1]?'~'+mon(x[2]):''} ${head(x[0])}`).join(', ')+'. 달은 해마다 조금씩 바뀌니 당해 공고를 봐요. 아무 대회나 나가지 말고 주최·도움·우선순위·아이 상태를 먼저 확인해요.'});
      const gv=inY(R('giftA').concat(R('giftB'))), gp=inY(R('giftP'));
      if(gv.length||gp.length){ let t=gv.map(x=>`${span(x,b)} ${head(x[0])}`).join(', ')+'.'; if(gp.length){ t+=` 영재원은 시험 전 3개월만 따로 공부해요(${gp.map(x=>mon(x[1])+'~'+mon(x[2])).join(', ')}). 교재는 ${book(gp[0][0])}.`; } items.push({label:'영재원',text:t}); } }
    return {title:g,months,items};
  }).filter(y=>y.items.length);
}

window.Planner={narrativeD,narrative,build,BAND,bandOf,renderTable,renderSimple,render3D,bind3D,render3DMap,bindMap,milestones,mOf,label,SEM,CALC,COMP,MID};
})();
