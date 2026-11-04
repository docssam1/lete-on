/* Source-backed school notes. Linked question papers stay on the publisher's site.
 * Numerical results retain the source's year and population; never an admission rate.
 */
(function(g){'use strict';
const link=(title,url)=>({title,url,checked:'2026-11-04'});
const gsCourse=link('경기과학고 교육과정 운영','https://gs-h.goesw.kr/gs-h/cm/cntnts/cntntsView.do?mi=1239&cntntsId=1039');
const gsResults=link('경기과학고 공식 University Matriculation','https://gs-h.goesw.kr/gs-h/cm/cntnts/cntntsView.do?mi=1372&cntntsId=1069');
const gsExam=link('경기과학고 2026 기출·해설 목록','https://gs-h.goesw.kr/gs-h/na/ntt/selectNttInfo.do?mi=1323&bbsId=1120&nttSn=541400');
const sshsExam=link('서울과학고 공식 기출 게시판','https://admission-sshs.info/24');
const minjokCourse=link('민사고 교육과정 원칙과 특징','https://www.minjok.hs.kr/sub02/sub05_1');
const minjokDomestic=link('민사고 2026 국내대학 등록 현황','https://www.minjok.hs.kr/sub05/sub05_1');
const minjokGlobal=link('민사고 2026 국제대학 등록 현황','https://www.minjok.hs.kr/sub05/sub05_2');
const hafsCourse=link('외대부고 2025~2027 입학생 교육과정 편제표','https://hafs.hs.kr/?act=board.read&code=1220&num=10&id=10');
const sangsanCourse=link('상산고 입학연도별 교육과정','https://school.jbedu.kr/sangsan/M010308/index.do');
const profiles={
 gs:{headline:'수학·과학·정보 심화와 연구를 함께 이수하는 영재학교',
  character:['무학년·학점제로 교과·연구·특별활동을 구성합니다. 일반교과와 수학·과학·정보 전문교과를 함께 이수합니다.','학교 안내의 2022학년도 이후 기준은 1~3학기 필수 중심, 4~6학기 선택 중심입니다. 대학 수준 공동 AP와 자율연구·현장연구·졸업논문연구가 포함됩니다.'],
  life:'연구 보고서·발표와 교과 과제가 겹칠 수 있습니다. 생활관 규정과 귀가일, 실제 개설 과목·선수과목을 입학연도 안내에서 대조하세요.',
  fit:['풀이를 답 없이 설명하고, 잘못된 시도를 고쳐 다시 쓸 수 있는가?','실험·정보 문제에서도 조건을 읽고 근거를 설명하는가?','대학 이름보다 연구와 이공계 공부 자체를 계속하고 싶은가?'],
  action:'현재 교과·심화를 유지하며 짧은 서술 풀이와 탐구 기록부터 점검합니다. 공개 영재성검사Ⅰ·Ⅱ를 영역별로 살핀 뒤, 필요한 부분을 보완하고 시간 연습으로 이어갑니다.',sources:[gsCourse],
  outcomes:[{year:'2023 졸업반',kind:'학교 공식 진학 현황',metrics:[['서울대',49],['KAIST',27],['연세대',17],['고려대',4]],note:'공식 영문 페이지의 Class of 2023 표에서 일부 대학을 발췌했습니다. 전체 졸업자 수와 재수생 포함 여부는 표에 명시되지 않아 진학률을 계산하지 않습니다.',source:gsResults},{year:'2024 졸업반',kind:'학교 공식 진학 현황',metrics:[['서울대',47],['KAIST',25],['연세대',17],['고려대',4]],note:'Class of 2024의 일부 대학입니다. 중복 합격 건수나 올해 예상 실적으로 바꾸지 않습니다.',source:gsResults},{year:'2025 졸업반',kind:'학교 공식 진학 현황',metrics:[['서울대',69],['KAIST',16],['연세대',13],['고려대',3]],note:'Class of 2025의 일부 대학입니다. 해외 대학 목록에는 개별 연도·인원이 없어 같은 해 실적으로 합산하지 않습니다.',source:gsResults}],
  papers:[{year:'2026학년도',kind:'공식 기출',stage:'2단계 · 영재성검사Ⅰ·Ⅱ',title:'과학·수학·추론·융합적 사고 문항 및 해설',source:gsExam,note:'게시일 2026.03.18. 첨부 문항은 학교 사이트에서 확인합니다. 3단계 캠프의 실제 면접 문항으로 표시하지 않습니다.'},{year:'2023~2025학년도',kind:'공식 기출',stage:'과거 입학전형',title:'연도별 기출·풀이 목록',source:link('경기과학고 공식 기출문항 게시판','https://gs-h.goesw.kr/gs-h/na/ntt/selectNttList.do?mi=1323&bbsId=1120'),note:'2024·2025 게시물에는 해설동영상 목록도 있습니다. 지원 연도와 문제의 학년도를 구분합니다.'},{year:'2026학년도',kind:'공식 해설',stage:'수학 · 영재성검사Ⅰ',title:'학교가 연결한 수학 해설동영상',source:link('경기과학고 수학 해설','https://youtu.be/DObgwgJUSes'),note:'먼저 스스로 풀이를 쓴 뒤 접근과 근거를 대조하세요.'}],
  practice:['풀이가 막힌 문제에서 확인한 조건, 시도한 방법, 바꾼 이유를 차례로 설명해 보세요.','실험 결과가 예상과 달랐다면 무엇을 먼저 확인하고 어떤 변인을 통제할지 말해 보세요.']},
 sshs:{headline:'이공계 진학을 전제로 서술·탐구 역량을 보는 영재학교',
  character:['2027 전형은 학생기록물, 영재성 평가, 창의·인성 평가로 이어집니다. 단순한 수학 선행량만으로 준비를 설명하기 어렵습니다.','제공 강의의 서울과고 지도 경험에서는 고등 수학 이후 대학 수준 미적분학·선형대수와 내신·탐구를 병행한다고 설명합니다. 이는 강사의 관찰이며 모든 학생의 동일 시간표나 공식 선수 조건은 아닙니다.'],
  life:'입학 후 교과·탐구·기숙 생활을 함께 감당할 준비를 봅니다. 학원 개수나 하루 공부 시간을 합격생 모두의 필수 규칙으로 적용하지 않습니다.',
  fit:['정답뿐 아니라 논리적 비약 없이 풀이를 쓰는가?','수학 외의 과학 탐구와 읽기·표현도 이어갈 수 있는가?','의약학 지원 제재와 이공계 진학 확약을 이해했는가?'],
  action:'공개 2단계 문제를 읽고 조건 정리→스스로 풀이→설명 보완 순으로 점검합니다. 합격 후에는 현재 배운 고등 범위의 빈틈과 서술 과정을 먼저 보완합니다.',
  sources:[link('서울과학고 공식 2027 전형 안내','https://admission-sshs.info/notification'),link('제공 강의 · 입학 이후 학습 관찰','https://www.youtube.com/watch?v=cXTsGu_Vvls')],
  outcomes:[],outcomeNote:'이번 확인에서 학교 전체의 최신 대학별 등록 인원을 확정하지 못했습니다. 공개 선배의 MIT 재학 사례 한 건을 전체 진학률이나 학교 순위로 사용하지 않습니다.',
  papers:[{year:'2026학년도',kind:'공식 기출',stage:'2단계 · 영재성 평가',title:'2026 입학전형 2단계 문제',source:link('서울과학고 2026 문제 게시물','https://admission-sshs.info/24/?bmode=view&idx=170539319'),note:'게시일 2026.03.25. 저작권은 학교에 있으며 공식 게시물에서 원문을 봅니다. 3단계 면접 기출이 아닙니다.'},{year:'2021~2025학년도',kind:'공식 기출',stage:'연도별 입학전형 · 2단계 풀이 포함',title:'과거 기출과 2024·2025 2단계 풀이',source:sshsExam,note:'공식 목록에서 해당 연도 제목과 평가 단계를 확인하세요.'}],
  practice:['서로 다른 풀이를 비교해 어떤 조건에서 각각 쓸 수 있는지 설명해 보세요.','탐구에서 본인이 바꾼 방법과 그 근거를 말하고, 다시 한다면 고칠 점을 정리해 보세요.']},
 minjok:{headline:'영어상용·선택형 심화·주도적 탐구를 함께 하는 자사고',
  character:['무학년·무계열 선택형 교육과정과 AP·전문교과를 안내합니다. 강의뿐 아니라 토론·실험·연구를 함께 다룹니다.','2025학년도부터 주제 탐구·융합 탐구를 도입했고 영어상용정책을 생활·수업에 나누어 운영합니다. 해외대학 전용 학교로 보지 않고 국내·국제 진학을 각각 살펴봅니다.'],
  life:'학교는 자율과 책임, 무감독 자율시험을 강조합니다. 기숙 생활에서 수업 언어·과제·생활 관리를 스스로 이어갈 수 있는지 봅니다.',
  fit:['영어로 수업을 이해하고 자신의 생각을 설명할 준비가 있는가?','수학뿐 아니라 인문·독서·예체능 과제도 유지하는가?','선택권이 많을 때 과목과 시간을 스스로 조정할 수 있는가?'],
  action:'영어 독해·말하기와 전 과목 학교 공부를 함께 점검합니다. 자기소개서에는 실제 학습과 활동의 선택·변화·배운 점을 정리하고 기재 배제 사항을 대조합니다.',sources:[minjokCourse],
  outcomes:[{year:'2026학년도',kind:'국내대학 등록 인원',metrics:[['서울대',18],['연세대',17],['고려대',9],['KAIST',7],['국내 등록 합계',95]],note:'학교 표의 등록자 기준입니다. 연세대(미래) 14명은 연세대 17명과 별도 항목이며 여기서 합치지 않았습니다. 대학명만으로 의대 인원을 추정하지 않습니다.',source:minjokDomestic},{year:'2026학년도',kind:'국제대학 등록 인원 · 일부 대학',metrics:[['Oxford',3],['UC Berkeley',1],['UChicago',1],['Brown',1]],note:'공식 Attending 표에서 일부 대학만 발췌했습니다. 합격 건수나 1998~2026 누계와 구분하며 국내·해외 표를 합쳐 진학률을 계산하지 않습니다.',source:minjokGlobal}],
  papers:[],paperNote:'2027 모집요강에서 개별 면접의 평가 영역·체력검사를 확인했습니다. 이번 확인에서 학교가 공개한 실제 면접 문항 원문은 확보하지 못했으므로 요강을 기출이라고 표시하지 않습니다.',
  practice:['스스로 세운 공부 계획이 잘되지 않았던 때, 무엇을 바꾸었고 결과를 어떻게 확인했나요?','공동 활동에서 서로 다른 의견을 조정한 경험과 그 뒤 달라진 행동을 설명해 보세요.']},
 hafs:{headline:'교육과정 선택과 국내·해외 진학 방향을 함께 비교할 자사고',
  character:['학교가 2025~2027학년도 입학생의 교육과정 편제표를 공개했습니다. 이전 입학생 표를 그대로 적용하지 않고 지원할 입학연도의 수학·과학·외국어 과목을 확인합니다.','2026 브로슈어는 국제, 인문사회·경제경영, 자연과학·공학 트랙을 소개합니다. 국제는 AP·외국대학 준비, 국내 트랙은 수능·논술·심층면접과 전공 과목을 연결합니다. 2025 신입생 기준의 설명이므로 2027 편제표와 다시 대조합니다.'],
  life:'GMC 안내에는 생활 규칙·일과표·주말 외출 및 귀가 절차가 따로 있습니다. 학교 수업과 자습·기숙 생활이 아이의 공부 습관에 맞는지 비교하세요.',
  fit:['수학 진도와 함께 국어·영어·사회·과학 내신을 유지하는가?','선택한 과목을 왜 공부하는지 설명할 수 있는가?','기숙 생활과 자습·귀가 규칙을 받아들일 수 있는가?'],
  action:'현재 공부를 이어가며 전 과목 반영 학기를 점검합니다. 자신의 독서·활동·학습 경험에서 지원동기와 학교 적합성을 설명할 근거를 고릅니다.',sources:[hafsCourse,link('외대부고 공식 2026 브로슈어 · 5~6쪽','https://hafs.hs.kr/hosts/hafs-hs.nitroeye.co.kr/files/2026_Brochure.pdf#page=7'),link('외대부고 학교생활·GMC 공식 메뉴','https://hafs.hs.kr/')],
  outcomes:[{year:'19기 · 연도로 환산하지 않음',kind:'공식 브로슈어의 국내대학 합격 현황',metrics:[['서울대',64],['연세대',102],['고려대',68],['KAIST',20],['의·치·한·약 합계',192]],note:'2026 브로슈어 인쇄 14쪽의 19기 열입니다. 실제 등록 인원이 아니며, 중복 합격·졸업생 포함 여부와 해당 기수의 집계 연도는 표에 명시되지 않아 합계·진학률을 계산하지 않습니다. 192명을 의대 인원으로 표시하지 않습니다.',source:link('외대부고 공식 브로슈어 · 국내대학 합격 현황','https://hafs.hs.kr/hosts/hafs-hs.nitroeye.co.kr/files/2026_Brochure.pdf#page=16')}],
  papers:[{year:'2026학년도',kind:'공식 면접 안내',stage:'신입학전형 면접 유의사항',title:'면접대상자 유의사항 · 수정사항 포함',source:link('외대부고 면접 유의사항','https://admission.hafs.hs.kr/?act=board.read&code=1415&id=79'),note:'2026 전형 운영 안내이며 실제 기출 문항으로 확인한 자료는 아닙니다. 2027 지원자는 최신 공지를 다시 확인합니다.'}],
  practice:['읽은 책이나 학교 활동이 자신의 공부 방법을 어떻게 바꾸었는지 구체적인 장면으로 설명해 보세요.','학교의 어떤 과목·활동을 자신의 관심과 연결하고 싶은지, 그 이유와 준비를 말해 보세요.']},
 sangsan:{headline:'전 과목 내신과 창의융합·인성독서 면접을 함께 볼 자사고',
  character:['2027 요강에서 수학뿐 아니라 국어·영어·과학·사회 교과와 창의융합·인성독서 면접을 함께 반영합니다. 의대 진학 실적만으로 학교의 교육과정을 대신 설명하지 않습니다.','공식 사이트에 입학연도별 교육과정과 기숙사 생활규정이 있습니다. 2024 입학생의 구 과목명을 2027 입학생 과목으로 그대로 바꾸지 않습니다.'],
  life:'독서·논술·선택과목과 수학 공부를 병행할 시간, 기숙 생활의 규칙·귀가·건강 관리를 함께 비교합니다.',
  fit:['낯선 문제를 풀 때 조건과 이유를 말로 설명하는가?','읽은 책의 줄거리뿐 아니라 근거와 자신의 관점을 말하는가?','전 과목 학교 공부와 기숙 생활을 꾸준히 관리할 수 있는가?'],
  action:'전 과목 내신을 유지하면서 독서의 핵심·근거·의견을 짧게 말해 봅니다. 창의융합 준비도 문제 암기보다 조건 해석과 설명 과정을 먼저 확인합니다.',sources:[sangsanCourse],
  outcomes:[],outcomeNote:'이번 확인에서 최신 대학별 등록 인원과 중복·졸업생 포함 여부를 함께 확인할 수 있는 표는 확보하지 못했습니다. 공식 설명회·학교 블로그의 원자료를 보고 집계 기준까지 대조합니다. 의대 합격 건수를 재학생 진학 인원으로 바꾸지 않습니다.',outcomeSources:[link('학교가 연결한 상산고 공식 블로그','https://blog.naver.com/sshs5300')],
  papers:[],paperNote:'공식 요강의 창의융합·인성독서 평가와 설명회 안내를 확인했습니다. 실제 면접 원문이 확인되지 않은 후기·복원 자료를 학교 공식 기출로 묶지 않습니다.',
  paperSources:[link('상산고 공식 입학공지·설명회 영상','https://school.jbedu.kr/sangsan/M010401/index.do')],
  practice:['읽은 책의 주장에 동의하지 않았던 부분을 근거와 함께 설명해 보세요.','익숙한 풀이가 통하지 않을 때 조건을 다시 나누어 본 경험을 설명해 보세요.']},
 hana:{headline:'교과·서류·면접·체력검사를 함께 준비하는 자사고',character:['서울 중심 모집과 전국 지원 예외를 구분합니다. 2027 요강은 교과·서류·면접과 체력검사 감점을 함께 다룹니다.','수학 선행만으로 준비를 끝내기보다 전 과목 내신과 실제 학습·협력 경험을 자기 말로 설명할 준비가 필요합니다.'],life:'학교 설명회에서 실제 과목 선택·자습·기숙 일과와 체력검사 운영을 확인합니다.',fit:['국어·영어·수학·과학·사회 공부와 활동을 함께 유지하는가?','자신이 세운 목표와 실패 뒤 바꾼 행동을 설명하는가?'],action:'지원자 구분을 확인한 뒤 교과·출결과 서류의 실제 경험을 대조합니다. 체력검사는 면접과 별도로 확인합니다.',sources:[],outcomes:[],practice:['학습 계획을 스스로 바꾼 경험과 그 이유를 설명해 보세요.','협력 활동에서 본인이 맡은 일과 다른 사람의 도움을 구분해 말해 보세요.']}
};
// The remaining school notes use their verified admissions guide, not guessed reputations.
const focus={hansung:['중등 수학·과학 탐구를 면담·소집면접으로 설명하는 과학고','학교의 수학·과학 성취도와 실제 탐구 기록을 먼저 점검합니다. 영재학교의 일정·평가를 그대로 적용하지 않습니다.','탐구 질문→방법→관찰→해석을 적고, 풀이의 조건과 근거를 말로 설명해 봅니다.'],dwfl:['외국어 학과 선택과 영어 내신·독서·표현을 함께 보는 외고','영어 내신뿐 아니라 국어·사회 독해와 외국어를 계속 공부할 이유를 봅니다. 해외대학 전용 학교로 보지 않습니다.','학과를 고른 이유와 읽기·쓰기·학교 활동 경험을 연결해 설명합니다.'],dongtan:['영어 내신과 자기주도학습·인성을 함께 보는 국제고','국제고는 국제학교와 다른 국내 특목고입니다. 영어와 함께 사회·문화 주제를 한국어로 읽고 근거를 설명할 수 있는지 봅니다.','지원 지역을 확인하고 자기주도학습·독서·협력 경험을 실제 기록으로 정리합니다.'],incheon:['지원 지역·기숙 조건까지 함께 비교할 국제고','영어 내신·독서·인성을 함께 준비합니다. 타시도 학생의 주말 기숙사 사용 조건도 학교생활 선택의 중요한 항목입니다.','지원 자격과 주말 생활 계획을 먼저 확인한 뒤 학교 교육과정에 맞는 지원 이유를 정리합니다.'],'seoul-general':['학교군·과목 편성·통학을 따져 볼 일반고 배정 경로','특정 고교 한 곳을 뜻하지 않습니다. 거주지와 학교군의 배정 절차를 확인한 뒤 실제 후보 학교의 과목·평가·통학을 비교합니다.','집 가까운지뿐 아니라 전 과목 평가 방식과 선택과목 개설을 확인하고 고등 기본기를 이어갑니다.']};
for(const s of g.PlannerHighschoolData.schools){if(profiles[s.id])continue;const f=focus[s.id];profiles[s.id]={headline:f[0],character:[f[1]],life:s.caution,fit:['현재 학교 과제를 스스로 마치고 부족한 과목을 확인하는가?','이 학교의 교육과정·생활 조건을 원하는 이유를 설명할 수 있는가?'],action:f[2],sources:[],outcomes:[],practice:s.goal==='general'?[]:['자신의 공부나 탐구에서 질문을 정하고 방법을 바꾼 경험을 설명해 보세요.','독서·협력 활동에서 실제로 한 일과 배운 점을 구분해 말해 보세요.']};}
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const links=xs=>`<div class="ha-profile-links">${xs.map(x=>`<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer">${esc(x.title)} ↗</a>`).join('')}</div>`;
function results(p){return p.outcomes.length?p.outcomes.map(x=>`<section class="ha-outcome"><h5>${esc(x.year)} · ${esc(x.kind)}</h5><dl>${x.metrics.map(([k,n])=>`<div><dt>${esc(k)}</dt><dd>${n}명</dd></div>`).join('')}</dl><p>${esc(x.note)}</p>${links([x.source])}</section>`).join(''):`<p>${esc(p.outcomeNote||'최신 대학별 실적을 집계 기준까지 확인하지 못해 숫자를 표시하지 않습니다. 학교 공식 진학 자료에서 해당 연도·등록/합격·재학생/졸업생·중복 포함 여부를 확인하세요.')}</p>${links(p.outcomeSources||[])}`;}
function render(schools,mode='profile'){
 const exam=mode==='papers';return `<section class="ha-school-research"><h3>${exam?'기출·면접 자료와 연습 순서':'학교 성격·생활·진학 결과'}</h3><p>${exam?'공식 공개 문제는 원문 사이트에서 봅니다. 면접 안내와 자체 연습 질문은 실제 기출과 구분합니다.':'선택한 학교를 교육과정·생활·준비할 역량으로 비교합니다. 진학 결과는 출처의 연도와 집계 기준까지 함께 봅니다.'}</p>${!exam?'<p class="ha-note">외대부고는 입학연도별 과목 편제와 진학 방향, 민사고는 영어상용·선택형 심화·자율 관리, 상산고는 전 과목과 창의융합·인성독서를 함께 비교하세요. 아래 적합성 질문과 공부 제안은 GFIELD의 선택 점검 기준입니다.</p>':''}<div class="ha-profile-list">${schools.map(s=>{const p=profiles[s.id],guide={...g.PlannerHighschoolData.sources[s.source]};return `<article class="ha-school-profile"><header><small>${esc(s.type)} · ${esc(s.region)}</small><h4>${esc(s.name)}</h4><p>${esc(p.headline)}</p></header>${exam?`${p.papers.length?p.papers.map(x=>`<section class="ha-paper"><small>${esc(x.kind)} · ${esc(x.year)} · ${esc(x.stage)}</small><h5>${esc(x.title)}</h5><p>${esc(x.note)}</p>${links([x.source])}</section>`).join(''):`<p class="ha-note">${esc(p.paperNote||'이번 확인에서 공개 실제 문항 원문을 확보하지 못했습니다. 아래 공식 요강은 평가 방식 안내이며 기출문제가 아닙니다.')}</p>`}${links([guide,...(p.paperSources||[])])}<details class="ha-research-detail"><summary>평가에서 무엇을 확인하나요?</summary><p>${esc(s.interview)}</p><p>${esc(s.documents)}</p></details>${p.practice.length?`<details class="ha-research-detail"><summary>GFIELD 자체 연습 질문 · 실제 기출 아님</summary><ol>${p.practice.map(q=>`<li>${esc(q)}</li>`).join('')}</ol><p>답을 외우기보다 상황→본인 행동→근거→배운 점을 설명합니다. 실제 평가 문항·배점·합격을 예측하는 자료는 아닙니다.</p></details>`:'<p>교육감 선발 일반고 배정 경로에는 학교별 면접 기출을 일괄 추가하지 않습니다.</p>'}`:`<h5>교육과정과 학교의 방향</h5><ul>${p.character.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${links([...p.sources,guide])}<h5>생활에서 확인할 점</h5><p>${esc(p.life)}</p><details class="ha-research-detail"><summary>아이에게 맞는지 살펴볼 질문</summary><ul>${p.fit.map(x=>`<li>${esc(x)}</li>`).join('')}</ul><p><b>현재 진도에서 이어갈 준비</b><br>${esc(p.action)}</p></details><h5>확인한 진학 결과와 집계 기준</h5>${results(p)}`}<footer>자료 확인 ${esc(p.checked||'2026-11-04')} · 실제 입학연도 요강·교육과정은 다시 확인합니다.</footer></article>`;}).join('')}</div>${exam?'<aside class="ha-practice-order"><h4>기출을 공부로 연결하는 순서</h4><ol><li>연도·전형·단계와 문항 공개 범위를 먼저 확인합니다.</li><li>답·해설을 보기 전에 조건과 시도한 풀이를 직접 씁니다.</li><li>막힌 이유를 개념·조건 해석·발상·서술·시간 부족으로 나눕니다.</li><li>현재 교과·심화에서 필요한 부분을 보완한 뒤 다시 설명합니다.</li></ol><p>처음부터 전 과정을 다시 시작하거나 기출 연도만 빠르게 소진하지 않습니다.</p></aside>':'<p class="ha-note">학교 전체의 실적은 개인의 합격 가능성이 아닙니다. 서로 다른 연도·중복 합격·등록 인원을 합쳐 학교 순위를 만들지 않습니다.</p>'}</section>`;
}
for(const p of Object.values(profiles)){p.papers=p.papers||[];p.checked='2026-11-04';Object.freeze(p);}
g.PlannerHighschoolProfiles=Object.freeze({profiles:Object.freeze(profiles),render});
})(window);
