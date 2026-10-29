/* Official source locators and GFIELD editorial connections. No eligibility/score rules.
 * Checked 2026-10-24; publication scope is not an annual university requirement. */
(function(g){
'use strict';
const SOURCES={
 mitFoundations:{title:'MIT 학업 준비 공식 안내 · 예시',url:'https://mitadmissions.org/apply/prepare/foundations/',scope:'교육과정별 학업 준비 안내. GFIELD의 학년별 준비 제안이나 모든 대학의 공통 조건을 뜻하지 않음',checked:'2026-10-25',status:'official_guide'},
 mit:{title:'MIT 국제 지원자 공식 안내 · 예시',url:'https://mitadmissions.org/apply/firstyear/international/',scope:'해외 고교 교육과정·성적표와 학교별 지원 조건을 확인하는 예시. 다른 대학에 일반화하지 않음',checked:'2026-10-24',status:'official_guide'},
 ucla:{title:'UCLA 국제 지원자 공식 안내 · 예시',url:'https://admission.ucla.edu/apply/international-applicants',scope:'국가·교육과정별 요건과 신입학·편입 구분을 확인하는 예시. 다른 대학에 일반화하지 않음',checked:'2026-10-24',status:'official_guide'},
 korea:{title:'대입정보포털 어디가',url:'https://www.adiga.kr/man/inf/mainView.do',scope:'대학·전형 자료 탐색. 최종 조건은 대학의 해당 연도 모집요강에서 확인',checked:'2026-10-24',status:'official_portal'},
 korea2029:{title:'2029학년도 대학입학전형기본사항 발표',url:'https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&boardSeq=107052&lev=0&m=020402&opType=N&page=1&s=moe&statusYN=W',scope:'공식 발표 게시물 확인. 전문의 세부 조항은 이 화면의 자격 판정에 사용하지 않음',checked:'2026-10-24',status:'announcement_only',year:'2029'},
 us:{title:'Common App 신입학 안내',url:'https://www.commonapp.org/apply/first-year-students/',scope:'지원 준비 항목 안내. 모든 미국 대학의 공통 전형이나 공통 시험 기준이 아님',checked:'2026-10-24',status:'official_guide'},
 uk:{title:'UCAS 과정별 지원 요건 안내',url:'https://www.ucas.com/applying/you-apply/what-and-where-study/entry-requirements',scope:'대학·과정별 자격·과목·평가 확인. 모든 과정의 동일 기준이 아님',checked:'2026-10-24',status:'official_guide'},
 ap:{title:'College Board AP 과목 안내',url:'https://apcentral.collegeboard.org/courses',scope:'공식 과목 목록 확인. AP 이수나 특정 점수를 모든 대학의 지원 조건으로 적용하지 않음',checked:'2026-10-24',status:'official_subject_list'},
 ib:{title:'IB Diploma Programme 교육과정',url:'https://www.ibo.org/programmes/diploma-programme/curriculum/',scope:'과목군과 DP core 구조 확인. 개별 과목의 판본·평가 연도는 별도 확인',checked:'2026-10-24',status:'official_curriculum'},
 alevel:{title:'Cambridge International AS & A Level',url:'https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-advanced/cambridge-international-as-and-a-levels/subjects/',scope:'확인 시 공식 사이트 점검 중. 과목별 syllabus·시험 연도·시험위원회 확인 대기',checked:'2026-10-24',status:'verification_pending'}
};
// Historical examples establish that a route exists, not its admission probability.
// Report year, enrollment year and offers remain distinct. No student scores imported.
const PREPARATION=Object.freeze({
 subjects:{title:'과목·학교 공부',stages:{primary:['현재 교과·심화에서 풀이의 이유를 설명합니다.','학교 과제와 현재 교재의 오류를 보며 다음 범위를 고릅니다.'],middle:['학교 내신을 챙기면서 비시험 기간에는 배운 범위의 낯선 문제를 풀어 보세요. 고교 후보가 생기면 수학·과학이 어느 학기에 편성되는지도 비교합니다.','시험 점수와 함께 제한시간 안에 풀이를 쓰는지, 과제가 밀리지 않는지를 보겠습니다. 선행량만으로 고교 준비를 판단하지 않습니다.'],high:['고교 첫 학기에는 수업·과제·내신에 적응하는 시간을 먼저 확보하세요. 다음 학기 과목을 고를 때 실제 개설 과목과 선수학습, 관심 분야를 함께 비교합니다.','내신과 학평에서 약한 부분을 따로 짚고 비시험 기간의 복습 시간을 남깁니다. 대학·과정별 필수·권장 과목과 수능 최저는 학교 상담에서 확인합니다.'],unknown:['현재 학교 과목과 실제 공부 범위를 먼저 확인합니다.','Grade·Year를 국내 학년으로 환산하지 않고 학교의 과목 안내를 비교합니다.']}},
 language:{title:'영어·읽기·표현',stages:{primary:['관심 있는 내용을 읽고 자신의 말과 글로 설명합니다.','이해한 내용과 생각을 연결하는지 살피고 시험 점수 목표는 뒤에 정합니다.'],middle:['학교 영어를 준비하면서 매일 어휘를 예문과 함께 익히세요. 읽은 글은 문단별 핵심과 답의 근거를 찾아 짧게 요약하고, 문법은 문장 해석·서술형 쓰기에 적용합니다.','내신이 좋아도 낯선 글을 읽을 때 어휘·문장 구조 중 무엇이 막히는지 따로 봅니다. 듣기와 짧은 쓰기를 유지하면서 비시험 기간에 부족한 영역을 보완합니다.'],high:['고등 영어는 수업 지문의 논리·어휘·구문을 정확히 읽고, 조건에 맞춰 문장을 쓰는 공부를 병행하세요. 해외 대학을 고려한다면 영어로 읽은 자료를 요약하고 의견을 근거와 함께 쓰는 연습도 이어갑니다.','내신·학평의 오답을 어휘·구문·글의 흐름·시간 부족으로 나누어 보완합니다. 지원 대학의 영어 입증·면제 조건을 확인한 뒤 필요한 시험을 준비합니다.'],unknown:['현재 수업 언어와 읽기·글쓰기·발표 경험을 확인합니다.','영어 수업 이력과 대학별 언어 조건을 구분해 확인합니다.']}},
 inquiry:{title:'관심·탐구·활동',stages:{primary:['오래 관심을 보이는 활동에서 질문과 시도를 기록합니다.','상장보다 아이가 무엇을 궁금해하고 어떻게 설명하는지 살펴봅니다.'],middle:['관심 주제의 질문·자료·시도·수정 과정을 이어갑니다.','기존 활동에서 더 탐구할 질문을 고르고 대회는 필요할 때만 비교합니다.'],high:['학교에서 이어온 탐구·활동의 본인 역할과 과정을 정리합니다.','결과를 부풀리지 않고 선택 이유·변화·배운 점을 본인의 말로 설명합니다.'],unknown:['기존 활동에서 아이가 직접 한 일과 궁금한 점을 살펴봅니다.','학교에서 가능한 탐구·발표·협업 기회를 확인합니다.']}},
 documents:{title:'학교 상담·서류',stages:{primary:['학교 유형과 진학 국가를 열린 선택지로 남겨 둡니다.','지금은 지원 서류를 만들기보다 학교 안내와 관심 변화를 살펴봅니다.'],middle:['고교별 교육과정 편성표와 평가 방식, 통학·기숙 생활, 자습 시간을 비교해 보세요. 외고·국제고는 외국어 수업뿐 아니라 수학·과학 선택과목도 살펴봅니다.','지원 시기에는 해당 학교의 모집요강에 맞춰 실제 수업·독서·탐구에서 배운 점을 본인 말로 설명합니다. 꾸민 활동을 늘리기보다 학교 공부를 지속할 환경을 고르세요.'],high:['대학별 지원 방식·서류·추천·일정을 학교와 비교합니다.','미발표 연도는 확인 대기로 두고 실제 제출·결과·등록은 별도로 기록합니다.'],unknown:['학교의 성적표·수강 과목 기록·상담 담당을 확인합니다.','지원자 구분과 필요한 학교 서류는 해당 대학의 공식 안내로 확인합니다.']}}
});
const CASES=Object.freeze([
 {id:'sshs-mit-2025',school:'서울과학고',type:'영재학교',goal:'giftedSchool',country:'us',year:'2025년 입학',destination:'MIT 학부',person:'David M. Ko',status:'본인 공개 재학 이력',evidence:'2025년 2월 서울과학고 졸업 후 같은 해 9월 MIT 학부 입학 이력을 공개했습니다.',source:'본인 공개 이력',url:'https://www.davidmko.com/',checked:'2026-10-24',verification:'self_report',stage:'undergraduate_enrollment'},
 {id:'ksa-mit-2006-report',school:'한국과학영재학교',type:'영재학교',goal:'giftedSchool',country:'us',year:'2006년 보도',destination:'MIT 학부',person:'박영수',status:'입학 사실 보도',evidence:'당시 보도에서 MIT 입학 사례로 소개했습니다. 보도 연도를 입학연도로 환산하지 않습니다.',source:'전자신문 · 2006.02.23',url:'https://www.etnews.com/200602220116',checked:'2026-10-24',verification:'news_report',stage:'undergraduate_enrollment_report'},
 {id:'csia-us-2023',school:'청심국제고',type:'국내 국제고 · 특목고',goal:'internationalHigh',country:'us',year:'2023학년도 진학현황',destination:'MIT 1명 · UCLA 1명',person:null,status:'학교 진학현황 기재',evidence:'학교가 공개한 해외대학 진학현황에 기재된 수치입니다. 국내 국제고의 사례이며 국제학교와 구분합니다.',source:'학교 공식 진학현황 · 2024.08.19 게시',url:'https://www.csia.hs.kr/?act=board.read&code=131729&id=18',checked:'2026-10-24',verification:'school_search_index',accessNote:'공식 게시물의 검색 수록 내용 확인 · 원문 재접속 대기',stage:'school_matriculation_report'},
 {id:'hafs-ucla-2025',school:'용인외대부고',type:'자사고 · 국제트랙',goal:'private',country:'us',year:'2025년 졸업·합격 발표',destination:'UCLA 등 미국 대학',person:'김태오',status:'합격 발표 · 최종 진학 미확인',evidence:'학교가 UCLA 등을 포함한 복수 대학 합격 소식을 게시했습니다. 이 자료로 UCLA 등록·진학을 확정하지 않습니다.',source:'학교 공식 게시 · 2025.05.23',url:'https://hafs.hs.kr/?act=board.read&code=1025&id=13&num=13',checked:'2026-10-24',verification:'school_republished_report',stage:'undergraduate_offer'}
].map(Object.freeze));
const CURRICULA={
 kr:{title:'국내 교육과정',math:['공통수학1','공통수학2','대수','미적분Ⅰ','확률과 통계','미적분Ⅱ','기하'],science:['통합과학','물리학','화학','생명과학','지구과학'],note:'학교 개설 과목·적용 교육과정과 선수과목을 확인합니다. 수능 출제범위와 전공 권장과목은 별도입니다.',source:'korea'},
 us:{title:'미국식 교육과정 · AP 선택',math:['학교 수학','AP Precalculus','AP Calculus AB','AP Calculus BC','AP Statistics','AP Computer Science A','AP Computer Science Principles'],science:['학교 과학','AP Biology','AP Chemistry','AP Environmental Science','AP Physics 1: Algebra-Based','AP Physics 2: Algebra-Based','AP Physics C: Mechanics','AP Physics C: Electricity and Magnetism'],note:'AP는 선택 가능한 과목입니다. 학교의 선수과목·개설 여부와 대학별 시험 정책을 따로 확인합니다.',source:'ap'},
 ib:{title:'IB 교육과정',math:['PYP·MYP 수학','DP Mathematics: Analysis and approaches','DP Mathematics: Applications and interpretation'],science:['PYP·MYP 과학','DP Biology','DP Chemistry','DP Physics','DP Computer science','DP Environmental systems and societies'],note:'DP 진입·SL/HL·과목 조합은 학교와 해당 평가 연도 안내로 확인합니다. IB를 특정 Grade나 Year로 자동 환산하지 않습니다.',source:'ib'},
 alevel:{title:'영국식 교육과정 · A level',math:['학교 수학 · GCSE/IGCSE','AS/A level Mathematics','AS/A level Further Mathematics'],science:['학교 과학 · GCSE/IGCSE','AS/A level Physics','AS/A level Chemistry','AS/A level Biology'],note:'과목명은 탐색용입니다. 시험위원회·syllabus·시험 연도 확인 전에는 단원과 선수조건을 확정하지 않습니다.',source:'alevel'},
 other:{title:'다른 교육과정',math:['학교 지정 수학'],science:['학교 지정 과학'],note:'학교 교육과정과 현재 교재를 확인한 뒤 연결합니다. 국내 과목과 동등하다고 자동 판단하지 않습니다.'},
 unknown:{title:'교육과정 확인 전',math:[],science:[],note:'학년 명칭만으로 교육과정을 추정하지 않습니다.'}
};
const FIELDS={
 math:{title:'수학·통계',activity:'규칙을 찾고 자료의 의미를 설명하기',math:'함수·대수의 관계와 증명, 확률·통계의 가정과 해석을 비교합니다.',science:'자료를 수집하고 측정의 오차와 모델의 한계를 설명하는 탐구를 연결합니다.',other:'논리적인 글쓰기와 자료 해석을 함께 이어갑니다.'},
 computing:{title:'컴퓨터·정보',activity:'절차를 설계하고 결과를 검증하기',math:'대수·함수·논리와 경우의 수를 실제 문제 해결에 연결합니다.',science:'자료 처리나 시뮬레이션에서 가정·결과·오류를 구분합니다.',other:'구현 기록과 설명을 남기고 협업·정보 윤리를 함께 살펴봅니다.'},
 engineering:{title:'공학',activity:'조건을 바꾸어 해결 방법 비교하기',math:'함수·기하·미적분의 의미와 단위·그래프 해석을 연결합니다.',science:'물리·화학의 개념과 측정·실험을 연결합니다. 수학 선수학습을 실제로 확인합니다.',other:'설계 이유와 한계를 설명하는 글쓰기·협업을 이어갑니다.'},
 natural:{title:'자연과학',activity:'현상을 관찰하고 원인을 설명하기',math:'대수·함수·통계와 필요한 미적분을 과학의 표현과 연결합니다.',science:'분야별 개념 → 자료 해석 → 가설·변인·검증을 구분해 공부합니다.',other:'과학 글 읽기와 근거에 따른 설명을 함께 이어갑니다.'},
 life:{title:'생명·환경·보건',activity:'생명과 환경의 관계를 탐구하기',math:'비율·함수·확률과 통계로 자료를 해석하고 인과관계를 성급히 단정하지 않습니다.',science:'생명·화학·환경의 연결을 살피고 필요한 물리 개념도 확인합니다.',other:'윤리·사회 맥락과 사람에 대한 이해를 함께 넓힙니다. 국가별 보건·의학 진입 경로는 별도 확인합니다.'},
 society:{title:'인문·사회·경제',activity:'사람과 사회의 변화를 자료로 설명하기',math:'통계·함수·모형을 해석하고 수치가 말하지 못하는 부분도 비교합니다.',science:'관심 주제와 관련된 과학·기술의 근거와 사회적 영향을 살펴봅니다.',other:'읽기·논증·외국어와 자료에 근거한 글쓰기를 이어갑니다.'},
 arts:{title:'예술·디자인·미디어',activity:'표현의 목적과 구성·전달 방식 비교하기',math:'비율·공간·자료의 표현을 필요한 학교 수학 개념과 연결합니다.',science:'재료·빛·소리·디지털 표현에서 필요한 과학 개념을 선택해 살펴봅니다.',other:'작품·매체를 읽고 표현의 목적·구성·수정 이유를 설명합니다. 실기·포트폴리오 요건은 학교·과정별 공식 안내에서 별도로 확인합니다.'},
 undecided:{title:'아직 정하지 않기',activity:'관심 있는 활동을 비교하며 탐색',math:'현재 교과·심화·연산을 유지하며 좋아하는 문제 해결 방식을 살펴봅니다.',science:'개념·관찰·실험·설명 중 오래 몰입하는 활동을 비교합니다.',other:'한 활동이나 성향 결과로 직업·전공을 확정하지 않습니다.'}
};
const COUNTRIES={
 kr:{title:'국내',routes:[['explore','전형 비교부터'],['record','학생부 중심 경로'],['exam','수능 중심 경로'],['special','특별전형·해외 이수 확인']],checks:[['institution','목표 대학·모집단위·입학연도 공식 안내 확인'],['subjects','지원자격·필수과목·권장과목을 구분해 확인'],['school','학교 성적·수행·과목 이수 기록 확인'],['exam','해당 전형의 수능·논술·면접 등 평가 확인'],['language','해외 이수·언어·특별전형 해당 여부 확인'],['documents','최종 모집요강의 서류·일정·제출 방식 확인']],note:'시행계획과 최종 모집요강을 구분합니다. 전형과 지역·거주 조건은 대학·모집단위·연도별로 확인합니다.',source:'korea'},
 us:{title:'미국',routes:[['explore','지원 방식 비교부터'],['school','학교별 직접 지원 확인'],['common','Common App 사용 여부 확인']],checks:[['institution','학교별 신입학·지원자 구분·입학연도 안내 확인'],['subjects','학교별 교과 이수·학업 준비 요건 확인'],['school','성적표·현재 수강 과목·학교 서류 확인'],['exam','SAT·ACT·AP 등 제출·선택·면제 정책 확인'],['language','영어 능력 입증·면제 조건 확인'],['documents','활동·추천서·에세이·추가 서류·마감 확인']],note:'시험 선택 정책과 국제학생·교육과정별 조건은 학교마다 다릅니다. Common App을 모든 학교의 지원 방식으로 가정하지 않습니다.',source:'us'},
 uk:{title:'영국',routes:[['explore','과정별 지원 요건 비교부터'],['undergrad','학부 직접 진학 요건 확인'],['foundation','Foundation 등 준비과정 검토']],checks:[['institution','대학·과정·입학연도 공식 요건 확인'],['subjects','인정 자격·선수과목·필요 성적 확인'],['school','학교 성적·예측 성적·추천 등 요구 확인'],['exam','과정별 입학시험·면접·포트폴리오 확인'],['language','영어 능력 입증·면제 조건 확인'],['documents','UCAS 또는 해당 과정의 지원 방식·마감 확인']],note:'자격 인정과 선수과목은 과정마다 다릅니다. Foundation도 자동 진학·학부 합격을 뜻하지 않습니다.',source:'uk'}
};
g.PlannerCollegeData=Object.freeze({SOURCES,CURRICULA,FIELDS,COUNTRIES,CASES,PREPARATION,checked:'2026-10-25'});
})(window);
