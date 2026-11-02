/* 2027 entry guides checked 2026-11-02. Dates are fixed civil dates in Korea,
 * never offsets from a student's study start. Concise editorial summaries only.
 * Scope: representative Seoul/Gyeonggi/Incheon guides, not a national catalogue.
 */
(function(g){'use strict';
const sources={
 sshs:{title:'서울과학고 2027 모집요강·전형 공지',url:'https://admission-sshs.info/notification',pages:'모집요강 2~6쪽 · 3단계/합격예정자 후속 공지'},
 hansung:{title:'한성과학고 2027 모집요강',url:'https://www.hischool.go.kr/school/view.do?idx=1637',document:'https://www.hischool.go.kr/FileDown.do?atchFileId=FILE_000000000044321&fileSn=0',pages:'요강 1~5쪽'},
 hafs:{title:'외대부고 2027 신입학 전형요항',url:'https://admission.hafs.hs.kr/?act=board.read&code=1415&id=85',pages:'요항 2~8쪽 · 내신 산출 부록'},
 dwfl:{title:'대원외고 2027 신입생 모집요강',url:'https://www.dwfl.hs.kr/?act=doc&mcode=131010',pages:'요강 1~2·6~7·11~15쪽'},
 incheon:{title:'인천국제고 2027 모집요강',url:'https://ii.icehs.kr/boardCnts/list.do?boardID=258507&m=020201',document:'https://doc.myapply.kr/Ii/Admission/files/basic-html/page15.html',pages:'요강 1·6~9·12~15쪽'},
 seoul:{title:'서울교육청 2027 고입 기본계획',url:'https://www.hischool.go.kr/entrance/sido/view.do?nttId=21263',document:'https://www.hischool.go.kr/FileDown.do?atchFileId=FILE_000000000044048&fileSn=0',pages:'지원자격·이중지원·붙임 1 전형 일정'},
 portal:{title:'전국 교육청·학교별 고입 요강 찾기',url:'https://www.hischool.go.kr/entrance/sido/list.do'}
};
const event=(id,title,start,end,time,note='')=>({id,title,start,end:end||start,time:time||'',note});
const schools=[
 {id:'sshs',name:'서울과학고',type:'영재학교',goal:'giftedSchool',region:'전국',year:2027,source:'sshs',
 eligibility:'중학교 재학생·이수자 또는 동등 학력으로, 수학·과학 재능과 잠재력이 있고 적합한 추천을 받은 학생. 중1·2 합격자는 상급학교 조기입학 자격이 필요합니다.',
 regional:'전국 지원. 지역인재 우선선발은 별도의 재학기간 조건을 확인합니다.',
 grades:'학생기록물과 단계별 평가를 종합합니다. 특정 선행 진도나 경시 수상만으로 지원·합격을 판단하지 않습니다.',
 attendance:'최종 합격 전 학년말 학생부로 2학기 출결·성실 이수 등을 다시 확인합니다.',
 documents:'원서·이공계 진학 확약서·자기소개서·관찰소견서 A/B·학교생활기록부Ⅱ. 학생부 공문과 자기소개서·관찰소견서의 마감이 다릅니다.',
 interview:'학생기록물 → 영재성 평가 → 창의·인성 평가. 문제 해결 과정과 과제 수행을 함께 준비합니다.',
 duplicates:'전국 영재학교 8개교 중 1개교만 지원합니다. 과학고·후기고 병행 조건은 해당 교육청 기본계획도 대조합니다.',
 caution:'의약학 계열 지원 제재와 이공계 진학 확약 내용을 학생·보호자가 함께 확인합니다. 8월 합격 예정과 12월 최종 합격을 구분합니다.',
 events:[event('apply','원서·학생부 제출','2026-05-20','2026-05-26','09:00 시작 · 마감 18:00'),event('essay','자기소개서·관찰소견서','2026-05-20','2026-05-29','마감 18:00'),event('stage2-result','2단계 대상자 발표','2026-06-26',null,'16:00'),event('stage2','영재성 평가','2026-07-05'),event('stage3-result','3단계 대상자 발표','2026-07-31',null,'16:00'),event('stage3','창의·인성 평가','2026-08-08'),event('provisional','합격 예정자 발표','2026-08-21',null,'16:00')],undated:[{title:'최종 합격자 발표',when:'2026년 12월 초',note:'요강에는 일자 미지정 · 학교 공문 확인'}]},
 {id:'hansung',name:'한성과학고',type:'과학고',goal:'scienceHigh',region:'서울',year:2027,source:'hansung',
 eligibility:'서울 소재 중학교 졸업예정자 등 요강의 학력·거주 조건에 해당하고 소속 학교장 추천을 받은 학생.',regional:'서울 중학교 졸업예정자와 전 가족 서울 실거주가 필요한 지원자 유형을 구분합니다.',
 grades:'수학·과학 성취도: 1단계 중2-1·2-2·3-1, 2단계는 중3-2까지 반영합니다.',attendance:'학생부와 면담에서 학교생활을 함께 봅니다. 2단계 학생부를 다시 제출합니다.',
 documents:'원서·자기소개서·교사추천서·학생부Ⅱ와 해당 전형 증빙. 온라인 입력과 출력 서류 도착을 각각 확인합니다.',interview:'서류·출석면담 → 소집면접. 수학·과학 개념과 탐구 과정을 자기 말로 설명합니다.',duplicates:'전국 다른 전기고와 중복 지원 불가. 합격 후 미등록해도 후기고 입학이 제한됩니다.',caution:'의약학 계열 진학 제재를 확인합니다. 12월 3일 입학 등록원 제출도 별도로 챙깁니다.',
 events:[event('apply','인터넷 원서 접수','2026-08-18','2026-08-26','마감 17:00'),event('docs','출력 원서·서류 제출','2026-08-24','2026-08-26','09:00~17:00 · 우편 도착 기준'),event('consult','출석 면담','2026-09-02','2026-10-30','학교 지정일'),event('stage2-result','소집면접 대상자 발표','2026-11-06'),event('updated-record','중3-2 학생부 제출','2026-11-16','2026-11-18','우편 도착 기준'),event('interview','소집 면접','2026-11-28'),event('result','최종 합격 발표','2026-12-02'),event('register','입학 등록원 제출','2026-12-03',null,'13:00까지')],undated:[]},
 {id:'hafs',name:'외대부고',type:'자사고',goal:'private',region:'전국·용인 지역우수자',year:2027,source:'hafs',
 eligibility:'국내 중학교 졸업(예정), 검정고시 등 중학교 동등 학력. 지역우수자 전형은 용인 거주·재학 조건을 추가 확인합니다.',regional:'전국 일반과 용인 지역우수자는 다른 모집 구분입니다. 지역우수자는 2026년 3월 3일부터의 거주·재학 조건을 확인합니다.',
 grades:'일반전형 중2·3의 4개 학기 국어·수학·영어·사회(역사)·과학. 1단계 40점, 면접 60점.',attendance:'출결 마감 2026년 11월 30일. 결석·지각 등의 산출은 요항 기준으로 확인합니다.',
 documents:'원서·학생부Ⅱ·전형별 증빙. 1단계 합격 후 온라인 자기소개서와 2단계 전형료를 제출합니다.',interview:'자기주도학습·학교 적합성과 인성. 학교 공부·독서·활동에서 본인이 한 일을 설명합니다.',duplicates:'후기 모집. 전기고 합격자는 지원할 수 없고 모집 구분 간 중복 지원도 불가합니다. 일반고 동시 지원은 거주 교육청 절차를 확인합니다.',caution:'서류는 12월 10일 17:00 도착분까지. 원서 작성 가능일과 전형료 결제 시작일을 구분합니다.',
 events:[event('apply','온라인 원서·1단계 결제','2026-12-04','2026-12-10','원서 작성은 12월 3일 10:00부터'),event('docs','1단계 서류 제출','2026-12-04','2026-12-10','09:00~17:00 · 우편 도착 기준'),event('stage1-result','1단계 합격 발표','2026-12-13',null,'15:00 예정'),event('essay','자기소개서·2단계 결제','2026-12-15','2026-12-16','09:00 시작 · 마감 17:00'),event('interview','면접','2026-12-19','2026-12-20','학교 지정일'),event('result','최종 합격 발표','2026-12-25',null,'17:00 예정'),event('gather','합격자 소집','2027-01-09',null,'예정')],undated:[]},
 {id:'dwfl',name:'대원외고',type:'외고',goal:'foreignHigh',region:'서울 등 지원자 유형별',year:2027,source:'dwfl',
 eligibility:'서울 중학교 졸업예정자 등 요강의 학력·거주 조건에 해당하는 학생. 학과와 전형을 하나씩 선택합니다.',regional:'서울 졸업예정자, 서울 실거주가 필요한 졸업자·동등학력자, 외고가 없는 시도 등의 예외를 구분합니다.',
 grades:'중2·3 영어 4개 학기 160점에서 출결 감점. 1단계 1.5배수, 2단계 면접 40점을 더합니다.',attendance:'전 학년 미인정 결석 등을 반영하며 산출 기준일은 2026년 11월 13일입니다.',
 documents:'원서·외고/국제고 입시용 학생부Ⅱ 등. 자기소개서는 면접대상자만 온라인 제출합니다.',interview:'자기주도학습·지원동기·인성. 독서와 실제 학교생활을 바탕으로 본인의 생각을 정리합니다.',duplicates:'다른 학교장 선발 후기고(외고·국제고·자사고 등)와 이중 지원 불가. 일반고 동시 지원은 교육청 절차로 확인합니다.',caution:'온라인 마감은 12월 7일 13:00, 방문 서류는 15:00. 우편 접수 불가. 공인어학·대회 실적 등 기재 배제 사항을 확인합니다.',
 events:[event('apply','인터넷 원서 접수','2026-12-03','2026-12-07','마감 13:00'),event('docs','출력 원서·서류 방문 제출','2026-12-03','2026-12-07','마감 15:00 · 주말 접수 없음'),event('stage1-result','면접대상자 발표','2026-12-09',null,'15:00'),event('essay','자기소개서 온라인 제출','2026-12-09','2026-12-11','15:00 시작 · 마감 17:00'),event('interview','면접','2026-12-21',null,'개인 시간 추후 공지'),event('result','최종 합격 발표','2026-12-24',null,'15:00'),event('register','등록금 납부','2027-01-20','2027-01-22')],undated:[]},
 {id:'incheon',name:'인천국제고',type:'국제고',goal:'internationalHigh',region:'인천·국제고 없는 시도 등',year:2027,source:'incheon',
 eligibility:'인천 또는 국제고 없는 시도 중학교 졸업예정자 등 요강의 공통 자격에 해당하는 학생.',regional:'거주 요건이 필요한 졸업자·특성화중 지원자는 전 가족 인천 실거주 등을 확인합니다. 타시도 학생은 주말 기숙사 사용 불가도 살펴봅니다.',
 grades:'중2·3 영어 4개 학기 160점에서 출결 감점. 1단계 2배수, 2단계 면접 40점을 더합니다.',attendance:'전 학년 미인정 결석 등을 반영하고 출결 마감은 2026년 11월 17일입니다.',
 documents:'원서·학생부Ⅱ·전형별 증빙, 1단계 합격자 자기소개서. 방문 원칙이며 우편은 학교와 사전 연락합니다.',interview:'자기주도학습·지원동기·진로계획·인성. 독서와 활동의 경험·생각을 본인이 설명합니다.',duplicates:'다른 외고·국제고·자사고 등과 이중 지원 불가. 평준화 일반고 동시 지원은 인천 배정 절차를 따릅니다.',caution:'온라인·서류 접수 뒤 자기소개서 제출이 별도로 있습니다. 어학시험·대회 실적 등 기재 배제 사항을 확인합니다.',
 events:[event('apply','인터넷 원서 접수','2026-12-07','2026-12-09','09:00 시작 · 마감 17:00'),event('docs','원서·서류 제출','2026-12-07','2026-12-09','09:00~17:00'),event('stage1-result','1단계 합격 발표','2026-12-14',null,'10:00'),event('essay','자기소개서 온라인 제출','2026-12-14','2026-12-15','10:00 시작 · 마감 20:00'),event('interview','면접','2026-12-21',null,'개인 시간 학교 안내'),event('result','최종 합격 발표','2026-12-29',null,'15:00')],undated:[]},
 {id:'seoul-general',name:'서울 교육감 선발 일반고',type:'일반고',goal:'general',region:'서울 학교군·지원 자격별',year:2027,source:'seoul',
 eligibility:'서울 중학교 졸업예정자 등 기본계획의 지원 자격에 해당하는 학생. 교육감 선발과 학교장 선발을 먼저 구분합니다.',regional:'거주지·출신 중학교·학교군에 따른 지원 및 배정 범위를 확인합니다.',grades:'학교별 점수 경쟁으로 일괄 해석하지 않고 배정대상자 선정과 단계별 지원·배정 절차를 확인합니다.',attendance:'학교생활기록부와 지원 자격 자료를 출신 중학교의 원서 안내에 맞춰 확인합니다.',
 documents:'고등학교 입학원서와 해당자 증빙을 출신 중학교 등 지정 접수처에 제출합니다.',interview:'교육감 선발 일반고 배정에는 별도 학교별 입학 면접을 일괄 추가하지 않습니다.',duplicates:'외고·국제고·자사고와 동시 지원 시 서울 일반고 2단계 지원 등 예외 절차를 확인합니다. 전기고 합격·미등록 상태도 담임과 대조합니다.',caution:'1월 6일은 배정대상자 발표, 1월 28일은 배정학교 발표입니다. 학교장 선발 일반고는 이 일정과 다를 수 있습니다.',
 events:[event('apply','일반고 원서 제출','2026-12-03','2026-12-07','출신 중학교 등 지정 접수처'),event('eligible','배정대상자 발표','2027-01-06'),event('assignment','배정학교 발표','2027-01-28'),event('register','입학 등록','2027-01-28','2027-01-29')],undated:[]}
];
g.PlannerHighschoolData=Object.freeze({checked:'2026-11-02',year:2027,sources,schools});
})(window);
