/* Parent choices, not a student test. English dates are school periods, not completion forecasts.
 * This module never changes mathematics, science, school goals or their numeric curves.
 * Publisher catalogues confirm titles only; they do not validate individual placement.
 */
(function(g){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SUBJECTS={english:'영어',korean:'국어'},STEPS=['current','standard','focus','book','rhythm','summary'];
const SUBJECT_STEPS={english:STEPS,korean:['current','focus','book','rhythm','summary']};
const LABELS={current:'현재 공부',standard:'학년별 표준 로드맵',focus:'보완할 부분',book:'교재·자료',rhythm:'학습량',summary:'계획 확인'};
const CURRENT={
 english:[['starting','소리·낱말부터 읽기 기초를 익히고 있어요'],['reading','원서 읽기를 중심으로 공부하고 있어요'],['balanced','어휘·문법과 짧은 독해를 함께 공부하고 있어요'],['school','학교 교과서·시험 범위 중심으로 공부하고 있어요'],['independent','중등 문법을 배웠고, 낯선 글의 근거도 설명해요'],['academic','긴 글을 읽고 요약·토론·글쓰기까지 하고 있어요'],['unknown','현재 공부를 조금 더 살펴봐야 해요']],
 korean:[['reading','책 읽기를 중심으로 하고 있어요'],['school','학교 국어와 교과 어휘를 공부하고 있어요'],['balanced','독해와 글쓰기를 병행하고 있어요'],['starting','한글과 짧은 문장 읽기를 익히고 있어요'],['unknown','현재 공부를 조금 더 살펴봐야 해요']]
};
// Each route supplies instruction, transfer and a decision criterion instead of a score cutoff.
const ROUTES={
 english:{
  foundation:{title:'소리·단어와 짧은 문장부터',observation:'단어나 짧은 문장을 읽는 데 도움이 필요해요',method:'듣고 뜻을 아는 표현을 소리·철자와 연결하고, 읽을 수 있는 짧은 문장으로 다시 만납니다.',practice:'익숙한 표현을 짧게 읽고 말한 뒤, 도움을 줄여 다시 읽어봅니다.',transfer:'새로운 짧은 문장에서도 같은 소리·단어를 알아보는지 살펴봅니다.',check:'읽을 수 있는 범위와 도움받는 부분을 구분해 다음 분량을 정합니다.'},
  vocabulary:{title:'어휘를 문장 속에서 익히기',observation:'외운 단어가 잘 떠오르지 않거나 문장에서는 낯설어요',method:'감당할 새 단어와 이전 단어를 함께 보고, 뜻·소리·예문 속 쓰임을 연결합니다.',practice:'뜻을 가리고 떠올린 뒤 짧은 예문에서 확인합니다. 익숙해진 단어만 파생어·덩어리 표현으로 넓힙니다.',transfer:'처음 보는 문장에서 뜻을 고르고 문맥과 맞는지 다시 확인합니다.',check:'그날 맞힌 수보다 며칠 뒤 떠올리고 사용할 수 있는지 확인합니다.'},
  sentence:{title:'문장의 구조를 정확하게 읽기',observation:'단어는 아는데 긴 문장이 어려워요',method:'주어·동사와 수식 관계를 찾고, 문법이 실제 뜻에 어떻게 연결되는지 설명합니다.',practice:'짧은 문장에서 시작해 절과 수식어가 붙은 문장으로 넓힙니다. 모든 문장을 번역 숙제로 만들 필요는 없습니다.',transfer:'배운 구조가 들어간 낯선 문장을 읽고 핵심 뜻을 설명합니다.',check:'문법 이름을 말하는 것과 문장을 이해하는 것을 함께 확인합니다.'},
  evidence:{title:'문장 사이의 근거를 연결하기',observation:'해석은 되는데 순서·빈칸·내용 문제를 자주 틀려요',method:'지시어·연결어와 앞뒤 문장을 연결하고, 답을 고른 근거와 다른 답이 맞지 않는 이유를 찾습니다.',practice:'짧은 문단에서 중심 내용과 근거를 짚은 뒤 순서·추론 문제에 적용합니다.',transfer:'익숙하지 않은 주제에서도 지문 안의 단서로 판단합니다.',check:'답만 맞혔는지, 근거를 스스로 찾았는지 구분합니다.'},
  writing:{title:'이해한 내용을 영어로 표현하기',observation:'내용은 이해하지만 영어로 쓰기 어려워요',method:'문장 완성에서 시작해 조건에 맞는 영작과 짧은 요약으로 이어갑니다.',practice:'처음에는 핵심 단어와 문장 틀을 제공하고, 수정한 문장을 도움 없이 다시 써봅니다.',transfer:'다른 내용에서도 같은 표현을 사용하고 말로 설명해봅니다.',check:'글의 길이보다 스스로 쓴 부분과 수정 이유를 확인합니다.'},
  listening:{title:'아는 표현을 듣고 이해하기',observation:'읽으면 아는 표현인데 들리지 않아요',method:'짧게 듣고 뜻을 파악한 뒤 대본과 비교해 놓친 소리·강세·연결을 확인합니다.',practice:'필요한 구간을 다시 듣고 따라 말합니다. 정답을 외운 듣기와 새 자료 이해를 구분합니다.',transfer:'비슷한 길이의 새 음성에서 핵심 내용을 설명하고 짧게 대답합니다.',check:'대본 없이 이해한 내용과 대본이 있어야 이해하는 내용을 나눕니다.'},
  transfer:{title:'학교 공부를 낯선 글에도 적용하기',observation:'학교 시험은 잘 보지만 낯선 글은 어려워요',method:'학교 공부를 유지하면서 처음 보는 글의 어휘·문장·근거 이해를 따로 확인합니다.',practice:'부담 없는 길이의 새 글을 읽고 핵심 내용과 답의 근거를 설명합니다.',transfer:'낯선 주제와 제한된 시간에 조금씩 적응하되 정확한 이해가 먼저입니다.',check:'내신 점수 하나로 고등 영어 준비가 끝났다고 판단하지 않습니다.'}
 },
 korean:{
  foundation:{title:'한글에서 짧은 문장 이해로',observation:'한글을 읽거나 짧은 문장의 뜻을 이해하는 데 도움이 필요해요',method:'소리와 글자를 연결하고, 익숙한 낱말·짧은 문장을 읽으며 뜻을 이야기합니다.',practice:'그림과 경험을 활용하고 아이가 말한 내용을 짧은 문장으로 연결합니다.',transfer:'새로운 짧은 문장에서도 누가 무엇을 했는지 설명합니다.',check:'읽는 속도보다 스스로 읽고 뜻을 이해하는지 확인합니다.'},
  vocabulary:{title:'교과 어휘를 자기 말로 설명하기',observation:'낯선 어휘 때문에 내용을 이해하기 어려워요',method:'교과서·읽던 책에서 막힌 단어를 골라 뜻·문맥·예문으로 연결합니다.',practice:'사전 뜻을 옮기는 데서 끝내지 않고 예와 아닌 예를 말하고 문장을 만들어봅니다.',transfer:'다른 과목이나 새 글에서 같은 단어의 뜻을 다시 확인합니다.',check:'어려운 단어를 많이 외우기보다 문맥에 맞게 설명하고 쓰는지 봅니다.'},
  evidence:{title:'답의 근거를 글에서 찾기',observation:'책은 읽지만 내용과 근거를 설명하기 어려워요',method:'문장·문단의 중심 내용을 짚고, 사실과 생각을 구분하며 근거를 찾아 설명합니다.',practice:'짧은 글에서 시작해 주장의 근거와 문단 사이의 관계를 연결합니다.',transfer:'다른 주제의 글에서도 글 안의 근거와 자기 생각을 구분합니다.',check:'독서량·학원 반보다 실제로 이해하고 설명하는 모습을 봅니다.'},
  summary:{title:'읽은 내용을 구조로 정리하기',observation:'내용을 길게 말하지만 핵심을 요약하기 어려워요',method:'문단별 핵심을 짧게 적고, 원인·결과·비교 같은 관계로 전체 흐름을 정리합니다.',practice:'밑줄·그림·짧은 문장 중 편한 방법으로 정리하고 원문과 대조합니다.',transfer:'새 글을 읽고 중요한 내용과 생략할 내용을 스스로 고릅니다.',check:'분량을 줄인 것과 글의 구조를 이해한 요약을 구분합니다.'},
  writing:{title:'생각을 쓰고 다시 다듬기',observation:'말로는 설명하지만 글로 정리하기 어려워요',method:'말로 정리한 생각을 짧게 쓰고, 독자가 이해할 수 있게 한 부분씩 고칩니다.',practice:'주장과 이유, 경험과 느낌을 연결하며 피드백을 반영해 같은 글을 수정합니다.',transfer:'새 주제에서도 도움을 줄여 짧은 글을 완성합니다.',check:'글자 수나 대회 실적보다 자기 생각과 수정 과정을 확인합니다.'},
  literature:{title:'작품의 표현과 맥락을 연결하기',observation:'줄거리는 알지만 인물·표현의 의미가 어려워요',method:'인물의 말과 행동, 장면과 표현을 근거로 해석을 비교합니다.',practice:'낯선 배경은 짧게 보완하고 작품 속 어떤 표현이 판단을 뒷받침하는지 짚습니다.',transfer:'새 작품에서 인물과 표현을 연결해 자기 해석을 설명합니다.',check:'정해진 감상을 외우기보다 작품의 근거로 설명하는지 봅니다.'}
 }
};
const SOURCES={
 nePopular:{title:'NE능률 영역별 교재 안내',url:'https://netutor.neflow.ai/english/curriculum/popular'},
 neListening22:{title:'NE능률 중학영어 듣기 모의고사 22회 Level 1',url:'https://m.nebooks.co.kr/pages/book/view.asp?c=BB08040001'},
 neCurriculum:{title:'NE능률 예비중 영역별 교재 안내',url:'https://netutor.neflow.ai/english/curriculum/purpose/31?seq=31'},
 neVoca:{title:'NE능률 능률VOCA 어원편 고등 안내',url:'https://www.nebooks.co.kr/pages/book/view.asp?c=BD01000023'},
 neReading:{title:'NE능률 1316 Reading Level 1 안내',url:'https://m.nebooks.co.kr/pages/book/view.asp?c=BB07040001'},
 ne:{title:'NE능률 1316 공식 교재 안내',url:'https://m.nebooks.co.kr/pages/book/category.asp?arg2=1316&srch=B'},
 ebsPrimary:{title:'EBS 초등 교재 안내',url:'https://primary.ebs.co.kr/book/main/list'},
 ebsEnglish:{title:'EBS 기초 영문법·영독해 안내',url:'https://primary.ebs.co.kr/book/main/bookRoadMap'},
 ebsMiddle:{title:'EBS 중학 교재 안내',url:'https://mid.ebs.co.kr/book/main/list?studyTargetCode=M1'}
};
const STOPS={
 english:{foundation:['소리와 철자 연결','짧은 문장 읽고 말하기','새 문장에서 다시 읽기'],vocabulary:['뜻·소리·예문 연결','복습 단어와 새 단어 병행','새 문장에서 쓰임 확인'],sentence:['주어·동사와 수식 관계','절이 포함된 문장 읽기','낯선 문장의 뜻 설명'],evidence:['중심 내용과 근거 찾기','지시어·연결어 따라 읽기','새 글에서 추론하기'],writing:['핵심 단어로 문장 완성','조건에 맞는 영작·수정','도움 줄여 요약하기'],listening:['듣고 대본과 비교','놓친 소리 다시 듣기','새 음성의 내용 설명'],transfer:['낯선 글에서 막힌 부분','어휘·문장·근거 보완','새 주제에 정확하게 적용']},
 korean:{foundation:['소리와 글자 연결','짧은 문장 읽고 말하기','새 문장의 뜻 설명'],vocabulary:['교과서의 낯선 단어','예와 문장으로 뜻 연결','다른 과목에서 다시 확인'],evidence:['문단의 중심과 근거','사실과 생각 구분','새 글의 근거 설명'],summary:['문단별 핵심 찾기','원인·결과와 비교 정리','새 글의 흐름 요약'],writing:['말로 정리한 생각 쓰기','피드백으로 같은 글 수정','도움 줄여 새 글 쓰기'],literature:['인물의 말·행동 살피기','표현과 장면 연결','새 작품의 해석 설명']}
};
const EN_REFERENCES={general:{label:'기본부터 탄탄히',description:'읽기 기초와 학교 공부를 다지고, 중등부터 내신·수능 대비를 함께'},upper:{label:'상위권 참고 과정',description:'원서·어휘·표현을 넓히고, 초5~6에 문법을 체계적으로 정리'},extreme:{label:'극상위권 참고 과정',description:'영어 경험이 많은 아이의 독해 전략·심화 어휘·표현 병행 사례'}};
const READING_METRICS={ar:'읽는 책의 AR Book Level',srGe:'SR 성적표의 GE',unknown:'지수를 모르겠어요'};
const READING_RANGES={below1:'1 미만',one:'1점대',two:'2점대',three:'3점대',four:'4점대',fivePlus:'5 이상'};
function empty(){return {version:1,active:'english',subjects:Object.fromEntries(Object.keys(SUBJECTS).map(id=>[id,{enabled:false,current:null,focus:null,book:null,rhythm:null,...(id==='english'?{planMode:'standard',referenceProfile:null,readingMetric:null,readingRange:null}:{})}]))};}
function restore(value){
 const s=empty();if(value?.version!==1)return s;
 if(Object.hasOwn(SUBJECTS,value.active))s.active=value.active;
 for(const id of Object.keys(SUBJECTS)){
  const v=value.subjects?.[id];if(!v||typeof v!=='object')continue;const r=s.subjects[id];
  if(CURRENT[id].some(([key])=>v.current===key))r.current=v.current;
  if(Object.hasOwn(ROUTES[id],v.focus))r.focus=v.focus;
  if(ALL_BOOK_IDS.has(v.book)&&(!BOOKS[v.book].subject||BOOKS[v.book].subject===id)&&!((id==='english'&&['ebsPrimary','ebsMiddle','ebsReading'].includes(v.book))||(id==='korean'&&['ne1','ne2','ne3','ebsEnglish'].includes(v.book))))r.book=v.book;
  if(['keep','extra','exam'].includes(v.rhythm))r.rhythm=v.rhythm;
  if(id==='english'){
   r.planMode=['standard','custom'].includes(v.planMode)?v.planMode:r.focus?'custom':'standard';
   if(Object.hasOwn(EN_REFERENCES,v.referenceProfile))r.referenceProfile=v.referenceProfile;
   if(Object.hasOwn(READING_METRICS,v.readingMetric))r.readingMetric=v.readingMetric;
   if(['ar','srGe'].includes(r.readingMetric)&&Object.hasOwn(READING_RANGES,v.readingRange))r.readingRange=v.readingRange;
  }
  r.enabled=!!r.current&&v.enabled===true;
 }
 return s;
}
function stage(context={}){if(context.foreignCalendar)return 'foreign';const n=Number(context.grade);return context.grade==='pre'?'early':n>=1&&n<=2?'early':n<=4&&n>=3?'primary':n<=6&&n>=5?'upper':n<=9&&n>=7?'middle':n<=12&&n>=10?'high':'unknown';}
const BOOKS={
 current:{title:'지금 쓰는 교재·읽던 책 유지',note:'새 책을 더하기 전에 아래 학습 범위를 지금 교재의 목차와 맞춰 보세요. 같은 역할의 교재를 중복해서 풀 필요는 없습니다.'},
 school:{title:'학교 교과서·수업 자료 활용',note:'학교에서 배우는 단원과 평가 범위를 먼저 확인합니다.'},
 reader:{title:'현재 읽는 책·음원 활용',note:'편하게 이해하는 길이에서 시작합니다. 책의 단계만으로 실력을 정하지 않습니다.'},
 unknown:{title:'교재는 다음에 정하기',note:'현재 교재의 해당 단원으로 시작하세요. 설명을 읽고 예제를 풀 수 있는지 본 뒤 새 교재를 정해도 됩니다.'},
 ebsEnglish:{title:'EBS 기초 영문법·기초 영독해 중 필요한 한 영역',note:'초5~예비 중1 대상 안내 교재입니다. 두 영역을 모두 추가하지 않고 필요한 부분을 고릅니다.',source:'ebsEnglish'},
 ne1:{title:'1316 GRAMMAR Level 1',note:'문법의 첫 체계를 잡을 때 선택합니다. 한 개념을 배운 뒤 예문 설명과 짧은 영작을 함께 해 보세요.',source:'ne'},
 ne2:{title:'1316 GRAMMAR Level 2',note:'앞 단계의 시제·문장 구조를 설명할 수 있을 때 이어갑니다. 틀린 문장은 왜 고쳐야 하는지 말해 보세요.',source:'ne'},
 ne3:{title:'1316 GRAMMAR Level 3',note:'중등 문법을 정리하는 선택입니다. 문법 문제를 맞힌 뒤 같은 구조가 들어간 낯선 문장에서도 뜻을 확인합니다.',source:'ne'},
 neVocaBasic:{title:'능률VOCA 중등 기본',subject:'english',note:'처음에는 뜻·소리·철자를 연결하고, 다음에는 예문 속 쓰임을 봅니다. 새 단어와 이전에 틀린 단어를 함께 복습하세요.',source:'neCurriculum'},
 neVocaEssential:{title:'능률VOCA 중등 필수',subject:'english',note:'기본 단어가 익숙한 경우의 선택입니다. 뜻을 외운 뒤 예문과 덩어리 표현으로 다시 확인하세요.',source:'neCurriculum'},
 neVocaRoot:{title:'능률VOCA 어원편 고등',subject:'english',note:'중등 기본 어휘가 익숙하고 긴 문장 읽기를 시작한 경우에 고릅니다. 접두사·어근·접미사로 묶되 예문 속 뜻을 함께 확인합니다.',source:'neVoca'},
 neReading1:{title:'1316 Reading Level 1',subject:'english',note:'짧은 중학 독해로 넘어갈 때의 선택입니다. 한 지문의 어휘·주어와 동사·주제·답의 근거를 연결해 보세요.',source:'neReading'},
 neListening1:{title:'1316 Listening Level 1 · 보유 교재 활용',subject:'english',note:'출판사 판매 중단 교재입니다. 이미 가지고 있다면 음원과 함께 활용하고, 새로 고를 때는 능률 중학영어 듣기 모의고사 22회 Level 1을 살펴보세요.',source:'neCurriculum'},
 neListening22:{title:'능률 중학영어 듣기 모의고사 22회 Level 1',subject:'english',note:'중등 듣기 입문용입니다. 한 회를 풀고 틀린 문장만 대본과 대조한 뒤, 받아쓰기와 다시 듣기로 연결하세요.',source:'neListening22'},
 neWriting1:{title:'쓰기로 마스터하는 중학 서술형 1학년',subject:'english',note:'문장 만들기와 조건 영작이 필요한 경우의 선택입니다. 주어진 조건을 먼저 표시하고 시제·수일치·철자를 마지막에 확인하세요.',source:'neCurriculum'},
 ebsPrimary:{title:'EBS 어휘가 독해다! 초등 국어 어휘',note:'1~6단계 중 현재 읽기와 어휘에 맞는 단계를 확인합니다. 학년만으로 단계를 확정하지 않습니다.',source:'ebsPrimary'},
 ebsMiddle:{title:'EBS 어휘가 독해다! 중학 국어 어휘',note:'2022 개정판 공식 안내를 확인했습니다. 현재 어휘 이해에 맞춰 필요한 부분을 고릅니다.',source:'ebsMiddle'},
 ebsReading:{title:'EBS 필독 중학 국어 비문학 독해 1',note:'짧은 지문에서 중심 내용과 근거를 확인하는 교재 선택지입니다.',source:'ebsMiddle'}
};
const ALL_BOOK_IDS=new Set(Object.keys(BOOKS));
const FOUNDATION_BOOK_IDS=new Set(['ebsEnglish','ne1','ne2','ne3','neVocaBasic','neVocaEssential','neReading1','neListening1','neListening22','neWriting1']);
function advancedStudy(row,context={}){return stage(context)==='high'||(['upper','middle'].includes(stage(context))&&['independent','academic'].includes(row?.current));}
function contextualBook(key,id,row,context){
 const book=BOOKS[key];if(!book)return null;
 if(id==='english'&&advancedStudy(row,context)&&FOUNDATION_BOOK_IDS.has(key))return {...book,title:book.title+' · 기초 보완용',purpose:'foundation',note:'전체 영어의 본교재를 이 책으로 바꾸는 계획은 아닙니다. 현재 독해·듣기·쓰기와 병행하면서 헷갈린 기초만 필요한 단원에서 보완합니다. '+book.note};
 return book;
}
function bookOptions(id,context={},focus=null,study=null){
 const row=typeof study==='string'?{current:study}:study||{},k=stage(context),advanced=advancedStudy(row,context),foundation=focus==='foundation'||row.current==='starting';let keys=['current','school','reader'];
 if(id==='english'&&['upper','middle','high'].includes(k)){
  if(!advanced||foundation){
   if(focus==='foundation')keys.push('ne1');
   if(focus==='sentence')keys.push(...(k==='upper'?['ebsEnglish']:['ne1','ne2','ne3']));
   if(focus==='writing')keys.push('neWriting1');
   if(focus==='vocabulary')keys.push('neVocaBasic','neVocaEssential',...(k==='upper'?[]:['neVocaRoot']));
   if(['evidence','transfer'].includes(focus))keys.push('neReading1');
   if(focus==='listening')keys.push('neListening22');
  }else if(focus==='vocabulary')keys.push('neVocaRoot');
  // Retain a saved choice, with its limited purpose visible, instead of silently changing it.
  if((advanced&&FOUNDATION_BOOK_IDS.has(row.book)||row.book==='neListening1')&&!keys.includes(row.book))keys.push(row.book);
 }
 if(id==='korean'&&k!=='early'&&k!=='foreign'&&k!=='unknown'){
  if(['primary','upper'].includes(k)&&focus==='vocabulary')keys.push('ebsPrimary');
  if(k==='middle'&&focus==='vocabulary')keys.push('ebsMiddle');
  if(k==='middle'&&['evidence','summary'].includes(focus))keys.push('ebsReading');
 }
 keys.push('unknown');return keys.map(key=>({id:key,...contextualBook(key,id,row,context)}));
}
function choose(value,id,kind,key,context={}){
 const s=restore(value);if(!Object.hasOwn(SUBJECTS,id))return s;s.active=id;const row=s.subjects[id];
 if(kind==='current'&&CURRENT[id].some(([v])=>v===key)){if(row.current&&row.current!==key){row.focus=null;row.book=null;}row.current=key;row.enabled=true;
  // Keep the displayed preschool reference when this student moves into primary school.
  if(id==='english'&&context.grade==='pre'&&!context.foreignCalendar&&!row.referenceProfile)row.referenceProfile=effectiveReference(row,context);
 }
 if(kind==='focus'&&Object.hasOwn(ROUTES[id],key)){if(row.focus!==key)row.book=null;row.focus=key;}
 if(kind==='book'&&bookOptions(id,context,row.focus,row).some(x=>x.id===key))row.book=key;
 if(kind==='rhythm'&&['keep','extra','exam'].includes(key))row.rhythm=key;
 if(id==='english'&&kind==='referenceProfile'&&(Object.hasOwn(EN_REFERENCES,key)||key==='standard')&&!(context.grade==='pre'&&key==='general'))row.referenceProfile=key==='standard'?null:key;
 if(id==='english'&&isPrimaryEnglish(context)&&kind==='readingMetric'&&Object.hasOwn(READING_METRICS,key)){if(row.readingMetric!==key)row.readingRange=null;row.readingMetric=key;}
 if(id==='english'&&isPrimaryEnglish(context)&&kind==='readingRange'&&['ar','srGe'].includes(row.readingMetric)&&Object.hasOwn(READING_RANGES,key))row.readingRange=key;
 if(id==='english'&&kind==='mode'&&['standard','custom'].includes(key)){row.planMode=key;
  if(row.current&&context.grade==='pre'&&!context.foreignCalendar&&!row.referenceProfile)row.referenceProfile=effectiveReference(row,context);
 }
 if(kind==='enabled'&&['yes','later'].includes(key))row.enabled=key==='yes'&&!!row.current;
 return s;
}
function navigation(value,id,page='current'){
 const s=restore(value).subjects[id]||{},steps=id==='english'&&s.planMode==='standard'?['current','standard','summary']:SUBJECT_STEPS[id]||SUBJECT_STEPS.korean,index=Math.max(0,steps.indexOf(page));
 return {page:steps[index],steps,index,total:steps.length,previous:steps[index-1]||null,next:steps[index+1]||null,canNext:steps[index]==='standard'?!!s.current:!!s[steps[index]],missing:!s.current?'current':id==='english'&&s.planMode==='standard'?'standard':steps.find(k=>!['summary','standard'].includes(k)&&!s[k])||'summary'};
}
function calendar(context={},offset=0){
 const year=Number(context.year),month=Number(context.mon);if(!Number.isInteger(year)||year<2020||year>2100||!Number.isInteger(month)||month<1||month>12)return '시기 확인 전';
 const m=year*12+month-1+offset,y=Math.floor(m/12),mon=m%12+1;let label=y+'년 '+mon+'월';
 const n=Number(context.grade);if(!context.foreignCalendar&&n>=1&&n<=12){const delta=Math.floor((m-2)/12)-Math.floor((year*12+month-3)/12),grade=n+delta;if(grade<=12)label+=(grade<=6?' · 초'+grade:grade<=9?' · 중'+(grade-6):' · 고'+(grade-9));}
 return label;
}
function rhythm(id){return ({keep:'현재 공부량으로 함께 이어가기',extra:'목표 주 2회 · 회당 15분 추가',exam:'학교 시험 준비에 비중 더 두기'})[id]||'학습량 선택 전';}
function ageGuide(context={}){return ({early:'소리·글자와 짧은 문장의 이해, 부담 없이 읽고 말하는 경험부터 살펴봅니다.',primary:'읽기 경험을 유지하며 교과 어휘와 문장·문단 이해, 짧은 설명과 쓰기를 연결합니다.',upper:'읽던 책을 유지하면서 정확한 문장 이해, 근거 연결, 요약과 짧은 쓰기를 보완합니다.',middle:'내신 준비와 낯선 글 이해를 함께 봅니다. 학년만으로 기초 보완이나 고등 준비의 시작을 정하지 않습니다.',high:'현재 학교의 교육과정·평가와 실제 약점을 기준으로 개념·독해·실전 적용을 병행합니다.',foreign:'학교의 수업 언어와 실제 과제를 기준으로 읽기·설명·토론·쓰기를 연결합니다. 국내 학년이나 시험 단계로 일괄 환산하지 않습니다.',unknown:'현재 읽고 이해하는 범위부터 살펴봅니다. 학년과 교재 단계를 추정하지 않습니다.'})[stage(context)];}
/* Editorial synthesis: supplied English middle 1/2/3 and high-school scripts,
 * primary 5/6 bridge + vocabulary scripts; Korean literacy/reading/writing scripts.
 * English periods follow the supplied grade/semester roadmap. Checks adjust
 * difficulty within that plan; no test score conversion or fixed book deadlines.
 */
const EN_PROFILES={
 early:{title:'소리에서 문장 읽기로',talk:'지금은 어려운 책보다 읽고 뜻을 아는 문장이 늘어나는 게 중요합니다. 듣던 이야기와 읽기를 연결하고, 문장 하나를 자기 말로 이야기하게 해 주세요.',next:'익숙한 도움 없이 짧은 문장을 읽고 내용을 말하면, 쉬운 리더스의 분량을 조금씩 늘립니다.'},
 primary:{title:'원서 읽기와 문장 표현 병행',talk:'원서를 잘 읽는 힘은 계속 살리겠습니다. 읽은 내용에서 누가 무엇을 했는지 설명하고, 짧게라도 직접 쓰는 공부를 붙여 보세요.',next:'이야기의 줄거리뿐 아니라 이유와 근거를 설명하면, 설명문의 길이와 문장 구조의 범위를 조금씩 넓힙니다.'},
 bridge:{title:'원서에서 학습 영어로 연결',talk:'원서를 그만두고 문법책만 볼 필요는 없습니다. 읽기는 이어가되, 문장을 정확히 이해하고 조건에 맞게 쓰는 연습을 함께 하겠습니다.',next:'처음 보는 문장의 구조를 설명하고 짧은 조건 영작을 혼자 해내면, 중등 독해와 서술형의 범위를 넓힙니다.'},
 middleBasic:{title:'중등 어휘·문법과 내신 기본기',talk:'학년이 올라갔다고 바로 고등 문제를 풀 필요는 없습니다. 독해·듣기·쓰기를 함께 이어가면서, 지문에서 막힌 어휘와 문법을 바로 보완하겠습니다.',next:'시제·수일치·준동사·관계사를 낯선 문장에서 구분하면, 고1 수준의 짧은 독해와 통합 어법으로 이어갑니다.'},
 middleReady:{title:'중등 문법 정리에서 고등 독해로',talk:'중등 문법을 배웠다면 이제 낯선 문장에서 꺼내 쓸 차례입니다. 어법만 반복하기보다 독해의 근거와 서술형까지 묶어 공부해 보세요.',next:'낯선 지문에서도 문장 구조와 답의 근거를 설명하면 고1 수준의 독해를 늘리고, 어렵게 느낀 유형은 따로 보완합니다.'},
 highBasic:{title:'고등 어휘·구문과 학교 공부 병행',talk:'고등 영어는 아는 듯한 문장을 정확히 읽어내는 힘이 필요합니다. 어휘와 문법의 빈틈을 확인하면서 학교 지문과 낯선 지문을 함께 보겠습니다.',next:'문장마다 주어·동사와 수식 관계를 짚을 수 있으면, 순서·삽입·빈칸 등 유형별 독해와 시간 관리를 연결합니다.'},
 highReady:{title:'구문 독해에서 유형별 실전으로',talk:'기본 해석이 된다면 이제 왜 그 답인지 설명할 수 있어야 합니다. 틀린 원인을 어휘·구문·논리로 나누고, 비슷한 새 문제에서 다시 확인하겠습니다.',next:'유형별로 근거를 찾는 방식이 안정되면 전체 회차 풀이와 오답 보완을 병행합니다. 지원 전형의 영어 요구도 함께 확인합니다.'},
 foreignBasic:{title:'학교 영어 적응과 읽기 기본기',talk:'수업 내용을 몰라서 어려운지, 영어로 설명을 못 알아들어 어려운지부터 나눠 보겠습니다. 학교에서 자주 쓰는 표현과 읽기·말하기를 같은 주제로 묶어 주세요.',next:'수업 지시를 이해하고 짧은 글의 요지를 설명하면, 과목별 어휘를 넓히고 한 문단을 혼자 구성해 쓰는 비중을 늘립니다.'},
 foreignAcademic:{title:'학교 과제와 학습 영어의 깊이',talk:'원서를 읽는 수준과 수업에서 쓰고 토론하는 힘은 따로 봐야 합니다. 학교 과제를 활용해서 근거를 찾아 말하고, 글을 고쳐 쓰는 과정을 만들겠습니다.',next:'한 자료의 요약과 자기 의견을 구분해 쓰면, 자료의 길이와 종류를 넓히고 여러 자료를 근거로 자기 주장을 구성합니다.'}
};
function profile(row,context){
 const k=stage(context),ready=['independent','academic'].includes(row.current);
 if(k==='foreign')return row.focus==='foundation'||!ready?'foreignBasic':'foreignAcademic';
 if(row.current==='starting'||row.focus==='foundation')return 'early';
 if(k==='early')return row.current&&row.current!=='unknown'?'primary':'early';
 if(k==='primary')return row.current==='starting'||row.focus==='foundation'?'early':'primary';
 if(k==='upper')return ready?'middleReady':'bridge';
 if(k==='middle')return row.current==='reading'?'bridge':ready?'middleReady':'middleBasic';
 if(k==='high')return ready?'highReady':'highBasic';
 return row.current==='starting'?'early':'bridge';
}
/* Supplied curriculum sources are grade/semester teaching plans, not six monthly
 * skill ladders. All five strands run together. Calendar periods describe when
 * the grade is attended, never a promise to finish a named book in that period.
 * NE official catalogues confirm 1316, 열중16강, 수능 딥독 and listening titles:
 * https://netutor.neflow.ai/english/curriculum/popular
 * EBS high1 catalogue confirms 수능특강 Light. Unclear ASR book names are omitted.
 */
const EN_AREAS=[['vocabulary','어휘'],['sentence','문법·구문'],['evidence','독해·읽기'],['listening','듣기·말하기'],['writing','서술·쓰기']];
const enArea=(material,scope,method,check)=>({material,scope,method,check});
const EN_STANDARD={
 early:{label:'유아·초1~2',title:'혼자 읽는 힘과 표현의 기초',from:1,to:2,talk:'듣던 이야기를 혼자 읽고, 읽은 내용을 말로 풀어내는 힘을 먼저 기르겠습니다. 책의 숫자나 어려운 단어 수보다 편하게 읽고 뜻을 아는 문장이 늘어나는지 봐 주세요.',check:'짧은 새 문장을 읽고 내용을 이야기하는지, 듣고 아는 표현을 글에서도 알아보는지 확인합니다.',areas:{
 vocabulary:enArea('읽는 책의 낱말·그림·음원','익숙한 사물·행동과 반복 표현','소리·뜻·철자를 연결하고 며칠 뒤 같은 표현을 다시 만납니다.','그림이나 도움을 줄여도 뜻을 떠올리나요?'),
 sentence:enArea('현재 파닉스 자료·쉬운 리더스','소리와 철자, 짧은 문장의 뜻','소리를 합쳐 읽고, 문장에서 누가 무엇을 하는지 이야기합니다.','처음 보는 쉬운 낱말과 문장을 읽나요?'),
 evidence:enArea('아이가 이해하는 리더스·그림책','인물·행동·사건의 순서','읽은 장면을 말하고 글에서 그 내용을 다시 찾아봅니다.','그림만 보고 짐작한 내용과 읽은 내용을 구분하나요?'),
 listening:enArea('같은 책의 음원·쉬운 대화','이야기 듣기와 질문에 짧게 대답하기','듣고 따라 말한 뒤 낱말을 바꾸어 자기 경험을 말합니다.','대본 없이 익숙한 질문을 이해하나요?'),
 writing:enArea('읽던 책의 문장·그림과 경험','낱말 쓰기에서 짧은 문장 표현까지','아이가 말한 문장을 함께 적고, 혼자 쓸 수 있는 부분을 늘립니다.','보고 베끼지 않고 아는 낱말이나 표현을 쓰나요?')
 }},
 primary:{label:'초3~4',title:'원서 읽기와 정확한 문장 표현',from:3,to:4,talk:'원서를 읽는 즐거움은 이어가겠습니다. 줄거리만 묻기보다 인물의 행동과 이유를 이야기하고, 익숙한 표현으로 자기 생각을 짧게 쓰도록 연결해 주세요.',check:'새로운 짧은 이야기에서도 내용과 이유를 설명하고, 배운 표현으로 두세 문장을 스스로 쓰는지 봅니다.',areas:{
 vocabulary:enArea('현재 어휘 자료·원서에서 만난 표현','소리·철자·문맥 속 뜻','꼭 쓸 낱말을 고르고 예문과 함께 반복합니다. 어려운 우리말 뜻은 쉬운 예로 풀어 줍니다.','다른 문장에서도 같은 낱말을 알아보나요?'),
 sentence:enArea('현재 수업의 문장 자료·읽던 책','주어·동사, 현재·과거, 질문과 대답','읽은 문장의 뜻을 확인하고 시제나 주어를 바꾸어 말합니다.','문장 길이가 늘어도 누가 무엇을 하는지 찾나요?'),
 evidence:enArea('현재 원서·쉬운 설명문','사건의 순서, 중심 내용과 세부 정보','읽을 분량을 나누고 답을 뒷받침하는 문장을 찾아봅니다.','줄거리 외에 이유를 글에서 찾아 말하나요?'),
 listening:enArea('원서 음원·현재 듣기 자료','내용 이해와 짧은 설명','안 들린 표현만 대본과 비교하고 다시 듣습니다.','새로운 비슷한 음성에서도 내용을 말하나요?'),
 writing:enArea('읽은 내용 요약·짧은 경험 글','문장 연결과 이유 덧붙이기','짧게 쓰고 한 부분을 고친 뒤 다음 글에 다시 사용합니다.','첨삭받은 표현을 다음 글에서 스스로 쓰나요?')
 }},
 upper:{label:'초5~6',title:'원서를 유지하며 중등 영어로 연결',from:5,to:6,talk:'원서를 끊고 문법책만 시작하는 시기는 아닙니다. 읽던 책은 유지하면서 어휘, 정확한 문장 해석, 답의 근거, 조건에 맞는 영작을 함께 붙이겠습니다. 초6 무렵에는 중등 문법의 체계를 갖추는 쪽에 비중을 더 둡니다.',check:'낯선 문장의 주어·동사와 수식 관계를 짚고, 글의 근거를 찾아 답하며 조건을 바꾼 짧은 영작을 해 봅니다.',areas:{
 vocabulary:enArea('현재 어휘책 · 필요할 때 능률VOCA 중등 기본 · 익숙하면 중등 필수','기본 어휘 누락과 문맥 속 쓰임','뜻을 익힌 뒤 예문·덩어리 표현으로 반복합니다. 이미 익숙하면 현재 책을 유지합니다.','외운 뜻을 처음 보는 문장에도 적용하나요?'),
 sentence:enArea('현재 문법책 · 중등 입문 시 1316 GRAMMAR Level 1','문장 형식·시제·수일치와 정확한 해석','초6 전후 중등 문법을 정리하되 읽기와 영작에서 함께 사용합니다. 전권 완료 시점은 이해에 맞춥니다.','문법 이름뿐 아니라 문장의 뜻과 변형을 설명하나요?'),
 evidence:enArea('현재 원서 + 중학 입문 독해서 · 1316 Reading Level 1 예시','문장 관계·지문 흐름·정답 근거','한국어로 핵심 뜻을 설명하고, 틀린 선택지가 왜 틀렸는지 글에서 확인합니다.','줄거리 요약과 문제의 답 근거를 모두 설명하나요?'),
 listening:enArea('원서 음원 + 현재 듣기 교재','듣던 내용과 읽은 표현 연결','짧게 듣고 핵심을 말한 뒤 놓친 소리만 다시 확인합니다.','읽으면 아는 말이 들리지 않을 때 원인을 찾나요?'),
 writing:enArea('현재 교재의 영작 자료 · 중학 영문법, 문법이 쓰기다 1·2학년 활용 예시','시제 바꾸기·조건 영작·짧은 요약','읽은 문장을 바꾸어 쓰고 조건, 시제, 수일치를 직접 확인합니다.','주어진 조건을 빠뜨리지 않고 문장을 쓰나요?')
 }},
 middle1:{label:'중1',title:'어휘·문법의 체계를 잡으며 독해 병행',from:7,to:7,talk:'중1은 어휘와 문법을 탄탄하게 정리할 때입니다. 그렇다고 독해를 멈추지는 않습니다. 학기 중 배운 문법을 독해와 서술형에서 쓰고, 방학에는 헷갈린 개념을 다시 정리하겠습니다.',check:'중등 문법을 단원 이름 없이 섞어 물어도 설명하는지, 독해와 조건 영작에서 같은 개념을 사용하는지 확인합니다.',areas:{
 vocabulary:enArea('능률VOCA 중등 기본 · 익숙하면 중등 필수 · 익숙하면 중등 고난도 등 현재 단계','새 단어와 누적 복습, 예문 속 쓰임','뜻 확인 → 예문·덩어리 표현 → 유의어·반의어·파생어로 같은 단어를 여러 번 봅니다. 회독을 학기별로 나누지는 않습니다.','며칠 뒤 뜻과 쓰임을 다시 떠올리나요?'),
 sentence:enArea('학기 중 1316 GRAMMAR Level 1·2 · 방학 열중16강 문법 1·2 활용','중등 기초·심화 문법의 체계','시제·준동사·관계사 등을 읽기와 영작에 적용합니다. 방학 정리는 현재 책으로 해도 되며 같은 역할의 책을 모두 더하지 않습니다.','처음 보는 문장에서 구조와 어법 판단 이유를 말하나요?'),
 evidence:enArea('1316 Reading Level 1 · 수능 딥독 중학 수능 독해 Level 1 등 수준에 맞는 한 권','정확한 해석에서 문단 흐름과 근거까지','어휘·구문에서 막힌 곳을 찾고 소재·주제·세부 정보를 구분합니다.','해석과 답의 근거가 연결되나요?'),
 listening:enArea('현재 중학 듣기 교재 · 능률 중학 영어듣기 모의고사 22회 Level 1 예시','대화의 핵심·세부 정보, 연음·강세','짧은 회차와 오답 구간을 같은 주에 나누어 듣습니다. 놓친 표현은 읽고 따라 말합니다.','대본 없이 새 음성의 핵심 정보를 찾나요?'),
 writing:enArea('중학 영문법, 문법이 쓰기다 1·2학년 · 학교 서술형 자료','문법을 쓰기에 적용, 조건 영작','배운 문법으로 문장을 만들고 학교형 서술 문제에서도 조건과 어순을 확인합니다.','배운 개념으로 문장을 바꾸어 쓰나요?')
 }},
 middle2a:{label:'중2 1학기',title:'심화 문법을 고등 어법에 연결',from:8,to:8,startMonth:3,endMonth:8,talk:'중2 상반기에는 중등 심화 문법을 정리하면서 고등 어법으로 연결하겠습니다. 어휘·독해·듣기·쓰기는 같이 가고, 문법에서 막히는 부분에 시간을 조금 더 쓰면 됩니다.',check:'문법 단원이 정해져 있지 않아도 문장에서 판단 근거를 찾고, 독해와 영작에 같은 구조를 적용하는지 봅니다.',areas:{
 vocabulary:enArea('현재 어휘책 · 중등 고난도/고등 기초 어휘 중 맞는 단계','예문·다의어·유의어·반의어·파생어','처음 보는 문장의 의미를 생각하며 반복합니다. 기본 어휘가 비면 그 부분을 병행 보완합니다.','외운 뜻이 문맥에 맞는지 판단하나요?'),
 sentence:enArea('1316 GRAMMAR Level 3 + 현재 고등 어법 입문 자료','중등 심화와 가정법·도치·관계부사·수일치 등','개념을 정리한 뒤 여러 개념이 섞인 문장의 어법을 설명합니다.','유형 이름을 몰라도 오류와 수정 이유를 말하나요?'),
 evidence:enArea('현재 중학 독해서 · 수능 딥독 Level 2 예시','문장 구조와 글의 중심 내용 연결','문법에서 배운 구조를 지문에서 찾아 읽고 답의 근거를 짚습니다.','문장이 길어져도 핵심 뜻을 놓치지 않나요?'),
 listening:enArea('현재 듣기 교재 · 능률 중학 영어듣기 모의고사 22회 Level 2 예시','의도·이유·세부 정보','읽으면 아는 표현과 단어 자체를 모르는 경우를 구분해 다시 듣습니다.','틀린 유형의 다른 음성에서도 이해하나요?'),
 writing:enArea('중학 영문법, 문법이 쓰기다 3학년 · 학교 조건 영작 자료','심화 문법을 쓴 문장과 조건 서술','주어진 조건을 먼저 표시하고 시제·수일치·철자를 마지막에 점검합니다.','같은 문법을 새로운 내용의 문장으로 쓰나요?')
 }},
 middle2b:{label:'중2 2학기',title:'독해와 고1 학력평가 유형에 적응',from:8,to:8,startMonth:9,endMonth:2,talk:'하반기에는 낯선 지문을 정확하게 읽는 비중을 높이겠습니다. 문법을 끝냈으니 덮어 두는 것이 아니라, 독해와 서술형에서 계속 써야 합니다. 고1 문제는 목적·주제·내용 확인처럼 접근하기 쉬운 유형부터 경험해 보세요.',check:'처음 보는 지문에서 근거를 찾는지 먼저 확인합니다. 정확하게 이해할 수 있는 유형부터 시간을 재고, 틀린 원인을 어휘·구문·글의 흐름으로 나눕니다.',areas:{
 vocabulary:enArea('현재 고등 기초 어휘책 · 어근 학습 준비 시 능률VOCA 어원편','문맥 속 뜻·덩어리 표현과 누적 복습','독해에서 만난 단어를 예문으로 다시 보고 접두사·어근·접미사를 연결합니다.','낯선 단어도 문맥과 어근으로 뜻을 짐작하나요?'),
 sentence:enArea('1316 GRAMMAR Level 3의 취약 단원 + 고1 어법 자료','배운 문법의 통합 적용','독해 오답 문장의 주어·동사·수식 관계를 짚고 필요한 개념만 다시 봅니다.','어법 정답을 이유와 함께 설명하나요?'),
 evidence:enArea('수능 딥독 Level 2·3 중 맞는 단계 + 고1 학력평가 일부 유형','목적·주제·내용 확인에서 글의 연결로','짧은 새 지문을 정확하게 읽은 뒤 풀이 시간을 조절합니다. 어려운 한 회차 전체를 먼저 요구하지 않습니다.','답을 고른 근거와 다른 선택지의 오류를 찾나요?'),
 listening:enArea('중학 영어듣기 Level 2 + 준비되면 고1 듣기 일부','새 음성의 핵심·세부 내용','틀린 구간을 다시 듣고 새 회차로 확인합니다. 듣기와 독해를 동시에 푸는 연습은 듣기가 안정된 경우에만 합니다.','새 회차에서도 집중과 정확도가 유지되나요?'),
 writing:enArea('중학 영문법, 문법이 쓰기다 3학년 + 고등 기초 조건 영작 자료','조건 영작·요약문·학교 서술형','문법 조건을 지켜 짧게 쓰고 첨삭받은 문장을 도움 없이 다시 씁니다.','수정한 표현을 다음 글에서도 사용하나요?')
 }},
 middle3:{label:'중3',title:'고등 독해·어법·서술형으로 전환',from:9,to:9,eventEnd:true,talk:'중3은 학교 시험을 챙기면서 고등 영어에 적응할 시간을 확보하겠습니다. 낯선 지문을 풀어 보고 약한 유형을 찾아 보완하되, 기본 어휘와 문장이 흔들리면 그 부분을 함께 채워 주세요.',check:'고1 수준의 새 자료에서 정확한 해석, 답의 근거, 조건 영작을 함께 확인하고 반복되는 오답 원인을 찾습니다.',areas:{
 vocabulary:enArea('현재 고등 어휘책 · 워드마스터 수능 2000/능률VOCA 어원편 등','기본 누락 보완과 고등 어휘 확장','뜻만 묻는 복습과 예문 속 쓰임 확인을 함께 하며 이전 오답을 누적합니다.','교과서 밖 지문에서도 배운 어휘를 알아보나요?'),
 sentence:enArea('현재 고등 어법 자료 + 독해에서 틀린 문장','통합 어법·긴 문장의 구문','문장 구조를 표시하고 어법 오류를 왜 고쳐야 하는지 설명합니다.','익숙하지 않은 문장에도 같은 기준을 적용하나요?'),
 evidence:enArea('EBS 수능특강 Light 등 고등 입문 독해 + 고1 학력평가','순서·삽입·빈칸 등 취약 유형과 실전 독해','유형별로 근거를 찾고, 이해가 되는 범위에서 시간 안에 푸는 연습을 합니다.','시간 부족과 내용 이해 부족을 구분하나요?'),
 listening:enArea('중학 영어듣기 Level 3 · 자이스토리/고1 학력평가 듣기','회차 풀이와 취약 유형 보완','전체 듣기를 경험하고 놓친 표현은 대본 확인 후 다시 듣습니다.','새 회차에서 같은 실수가 줄어드나요?'),
 writing:enArea('학교 서술형 자료 + 고등 조건 영작 자료','실제 평가 조건에 맞는 영작·요약','핵심 내용과 문법 조건을 함께 반영하고 첨삭을 새 문장에 적용합니다.','도움 없이 조건을 모두 반영해 쓰나요?')
 }},
 preHigh:{label:'고교 입학 전 겨울',title:'마지막 내신 뒤 부족한 영역 재정비',from:9,to:9,eventStart:true,talk:'중3 마지막 시험이 끝나면 쉬어야 할 시간도 필요합니다. 그 뒤 입학 전까지는 새 책을 무작정 늘리기보다, 어휘·구문·독해·듣기·서술형 중 고등 수업에서 걸림돌이 될 부분을 정리하겠습니다.',check:'처음 보는 고1 자료로 다시 확인하고, 진학할 학교가 정해지면 교육과정과 평가 방식에 맞춰 첫 학기 계획을 조정합니다.',areas:{
 vocabulary:enArea('공부하던 고등 어휘책·누적 오답','자주 빠지는 기본 어휘와 예문','복습과 새 단어를 함께 보되 이미 익숙한 책을 처음부터 기계적으로 다시 풀지는 않습니다.','시간이 지난 뒤에도 뜻과 쓰임을 떠올리나요?'),
 sentence:enArea('현재 문법·구문 교재의 취약 단원','고등 지문에서 자주 막히는 문장 구조','개념 확인 후 다른 지문의 같은 구조를 읽고 조건 영작으로 연결합니다.','같은 구조의 새 문장도 혼자 설명하나요?'),
 evidence:enArea('현재 고등 독해서 + 고1 학력평가','취약 유형 보완과 한 회차 경험','모든 유형을 어려운 문제로 채우지 않고 정확도와 시간 사용을 함께 확인합니다.','풀이 순서와 오답 이유를 설명하나요?'),
 listening:enArea('현재 고등 듣기 자료·학력평가','실전 듣기와 놓친 구간','일정한 간격으로 듣기를 유지하고 오답을 새 음성으로 확인합니다.','듣기 실수의 원인을 알고 고칠 수 있나요?'),
 writing:enArea('고등 조건 영작·진학 학교 안내 자료','문장 변형·요약과 조건 확인','학교가 정해진 뒤 서술형 평가 방식도 살피고 배운 문장으로 연습합니다.','문법과 내용 조건을 함께 챙기나요?')
 }},
 high1:{label:'고1',title:'학교 영어와 낯선 지문을 함께',from:10,to:10,talk:'고1에서는 내신 지문을 꼼꼼히 준비하는 공부와 처음 보는 글을 읽는 공부가 같이 가야 합니다. 어휘와 문법의 빈틈은 계속 확인하고, 여름방학에는 자주 헷갈린 개념을 정리해 두겠습니다.',check:'배운 지문 밖에서도 정확히 읽고 근거를 설명하는지, 학교 서술형에서 조건을 지키는지 함께 확인합니다.',areas:{
 vocabulary:enArea('현재 고등 어휘책 · 워드마스터/능률VOCA 중 맞는 단계','예문·다의어·파생어와 누적 복습','학교 지문과 낯선 지문에서 만난 어휘를 현재 책에 연결합니다.','같은 단어의 다른 쓰임을 문맥으로 판단하나요?'),
 sentence:enArea('현재 고등 문법 개념서','문법의 빈틈과 정확한 구문 해석','연중 독해·서술형에서 확인하고 여름방학에 취약 개념을 정리합니다.','어법과 해석에 같은 개념을 활용하나요?'),
 evidence:enArea('학교 교과서·수업 자료 + 수준에 맞는 고등 독해서·고1 학력평가','정확한 독해와 유형별 근거','내신 기간에는 학교 범위에, 비내신 기간에는 낯선 지문과 취약 유형에 비중을 둡니다.','익숙하지 않은 글에서도 논리와 근거를 찾나요?'),
 listening:enArea('현재 듣기 교재·학력평가','회차 듣기와 오답 구간','새 회차를 꾸준히 듣고 놓친 표현을 다시 사용합니다.','학교 시험 기간에도 듣기 감각을 이어가나요?'),
 writing:enArea('학교 서술형·조건 영작 자료','문장 변형·요약·평가 조건','오답 문장을 고쳐 쓰고 다음 과제에서 같은 실수를 확인합니다.','서술형의 내용·어법 조건을 모두 지키나요?')
 }},
 high2:{label:'고2',title:'구문 독해와 유형별 기출의 깊이',from:11,to:11,talk:'고2에는 긴 문장을 정확히 읽는 힘과 유형별 근거 판단을 함께 기르겠습니다. 내신 공부는 유지하면서 낯선 기출에서 반복되는 오답을 확인해 주세요.',check:'해석이 되는데 틀리는지, 문장 자체를 잘못 읽었는지 구분하고 같은 유형의 새 지문에서 확인합니다.',areas:{
 vocabulary:enArea('현재 어휘책·기출 어휘','다의어·추상어·덩어리 표현','기출 문맥 속 뜻과 누적 오답을 함께 봅니다.','뜻을 문맥에 맞게 선택하나요?'),sentence:enArea('천일문 등 현재 구문 교재','길어진 절·수식·생략·도치','실제 독해에서 막힌 문장을 분석합니다.','긴 문장도 핵심 관계를 놓치지 않나요?'),evidence:enArea('자이스토리 등 유형별 기출·학교 자료','유형별 논리와 근거','순서·삽입·빈칸 등을 정확도부터 확인하고 시간도 조절합니다.','틀린 이유를 다음 지문에 적용하나요?'),listening:enArea('학력평가·현재 듣기 자료','실전 듣기 유지','회차 풀이와 오답 구간 복습을 병행합니다.','새 음성에서도 정확도가 유지되나요?'),writing:enArea('학교 조건 영작·서술형','요약과 문장 재구성','배운 구문을 조건에 맞게 쓰고 수정합니다.','내용과 어법을 함께 점검하나요?')
 }},
 high3:{label:'고3',title:'기출·EBS와 실전 적용',from:12,to:12,talk:'고3에는 기출과 해당 연도 EBS 자료를 실제 시간 안에서 풀고, 부족한 부분을 다시 채우는 공부가 함께 갑니다. 학교 평가와 지원 전형의 영어 요구도 확인하겠습니다.',check:'실전 회차의 결과뿐 아니라 어떤 어휘·구문·유형에서 반복해서 막히는지 보고 보완합니다.',areas:{
 vocabulary:enArea('현재 어휘책·기출/EBS 어휘','누적 어휘와 낯선 문맥','오답 문장으로 쓰임을 확인합니다.','실전에서도 뜻을 정확히 판단하나요?'),sentence:enArea('기출 어법·구문 오답','어법 실전과 취약 개념','필요한 개념으로 돌아가 새 문제에서 확인합니다.','같은 오류를 반복하지 않나요?'),evidence:enArea('기출 + 해당 연도 EBS 수능특강·수능완성','실전 독해와 취약 유형','회차 풀이·오답·유형 보완을 병행합니다.','시간과 정확도를 함께 관리하나요?'),listening:enArea('기출·EBS 듣기','실전 듣기와 집중 유지','새 회차와 오답 표현을 함께 복습합니다.','실전 흐름에서도 핵심을 놓치지 않나요?'),writing:enArea('학교 평가 범위·서술 자료','학교의 조건 서술','필요한 학교 과제를 마무리하며 문장 정확성을 유지합니다.','평가 조건에 맞게 설명하고 쓰나요?')
 }}
};
// User-supplied upper-track preschool plan. May dates are planning targets, never completed assessments.
const EN_PRESCHOOL={
 preschool6:{label:'6세 말까지 · 극상위권 참고',title:'함께 읽고 풀며 독해의 바탕 만들기',targetAge:6,talk:'처음에는 책도 문제도 같이 읽어 주세요. 뜻을 이야기하고 답을 함께 찾으면서 진도를 나가면 됩니다. 혼자 풀게 하는 데 서두르기보다 읽는 책을 넓히고, 익숙해진 부분부터 도움을 줄이겠습니다.',check:'처음 보는 짧은 글에서도 내용을 말하고 답의 근거를 짚는지 봅니다. CARS에서 놓친 전략은 같은 단계 STARS로 연습합니다.',goal:'6세 5월 · CARS·STARS B까지',areas:{
 vocabulary:enArea('Vocabulary Workshop Red → Purple → Green','읽은 글과 연결한 어휘·예문','6세에는 Red·Purple부터 이어가고 Green은 7세 말까지 연결합니다. 뜻을 이야기한 뒤 예문과 읽는 책에서 다시 만납니다.','새 문장에서도 단어의 뜻을 설명하나요?'),
 sentence:enArea("Let’s Target Grammar 1 · 쉬운 문법책",'쉽게 이해하는 문장 구조와 기본 문법','짧은 예문을 읽고 말로 바꿔 봅니다. 규칙을 외우는 것보다 뜻을 알고 쓰는 데 맞춥니다.','배운 문장을 바꾸어 말하고 쓰나요?'),
 evidence:enArea('DRC Grade 1·2·3 / 80-word → 120-word READING + CARS·STARS A·B','글의 중심·세부 내용·추론, 질문의 뜻','처음에는 지문과 질문을 함께 읽고 답의 근거를 찾습니다. CARS는 점검, STARS는 필요한 전략 연습에 사용합니다. 여유가 있을 때 Multiple Reading Skills를 보완 교재로 이어갑니다.','도움 없이 설명하는 부분이 늘어나나요?'),
 listening:enArea('Hello Reader Level 1·2·3·얼리 챕터북 음원','읽는 책을 듣고 뜻과 소리 연결','책을 같이 읽은 뒤 같은 음원을 자주 듣습니다. 들은 장면을 짧게 이야기하며 내용을 연결합니다.','들었던 내용과 책의 장면을 연결하나요?'),
 writing:enArea('읽은 책의 문장·쉬운 문법 예문','말로 답하기와 짧은 문장 쓰기','먼저 함께 말하고 아는 표현으로 짧게 씁니다. 아이가 쓴 문장에서 한 부분씩 고칩니다.','보고 베끼지 않고 자기 문장으로 바꾸나요?')
 }},
 preschool7:{label:'7세 말까지 · 극상위권 참고',title:'읽기 전략과 어휘·표현을 함께 확장',targetAge:7,talk:'7세에는 읽는 양을 유지하면서 어휘와 독해 전략을 더 촘촘히 연결하겠습니다. 독해서는 주교재를 정하고 필요한 유형을 보완하세요. 말하기와 쓰기도 같은 주에 함께 이어갑니다.',check:'CARS·STARS C에서 배운 전략을 새 글에도 적용하는지, 읽고 들은 내용을 자기 말과 짧은 글로 표현하는지 봅니다.',goal:'7세 5월 · CARS·STARS C',areas:{
 vocabulary:enArea('Vocabulary Workshop Green / 4000 Essential English Words 1·2 / Wordly Wise 3000 Book 2·3','다섯 권 중 세 권 이상을 순차적으로 연결하는 목표','이미 한 책은 제외하고 다음 한 권을 정합니다. 세 권을 동시에 시작하지 않고 예문·누적 복습을 함께 합니다.','외운 뜻을 문맥에서 구분하고 표현에 쓰나요?'),
 sentence:enArea('쉬운 문법책 유지 + 독해·영작 문장','문장 구조·시제·수일치의 적용','문법책만 어렵게 올리지 말고 읽고 쓰는 문장에서 배운 규칙을 확인합니다.','문법 규칙과 실제 뜻을 연결하나요?'),
 evidence:enArea('Junior Reading Expert 2·3 / 180-word READING 1·2 / Spectrum Test Practice Grade 2·3·4 / Reading Skills 4·5 / TOEFL Junior Intermediate Reading + CARS·STARS C','정확한 해석·질문 이해·읽기 전략','주 독해서와 전략 교재를 병행하고, 나머지 독해서는 한 권씩 이어가거나 필요한 유형을 골라 보완합니다. Spectrum은 언어·수학 등이 함께 든 종합 연습이므로 영어 계획에는 Reading·Language 부분을 골라 씁니다.','지문을 읽고 정답과 오답의 근거를 말하나요?'),
 listening:enArea('TOEFL Junior Intermediate 듣기 교재 + 읽는 책 음원','핵심·세부 정보와 새 음성 이해','긴 음성도 내용 단위로 듣고 놓친 표현을 다시 확인합니다. 읽는 책의 음원도 함께 유지합니다.','새 음성에서도 주요 내용을 설명하나요?'),
 writing:enArea('읽은 책 요약·스피킹·라이팅 피드백','이유를 붙여 말하기·짧은 요약과 영작','책 내용을 말로 정리한 뒤 짧게 쓰고 첨삭한 표현을 다음 글에 다시 사용합니다.','준비한 답을 외우지 않고 새 질문에도 설명하나요?')
 }}
};
function preschoolPeriods(context){
 const age=Number(context.age),year=Number(context.year),mon=Number(context.mon),dated=age>=4&&age<=8&&year>=2020&&year<=2100&&mon>=1&&mon<=12;
 const periods=Object.entries(EN_PRESCHOOL).filter(([,p])=>!dated||p.targetAge>=age||age===8&&mon<3&&p.targetAge===7).map(([key,p])=>{
  const targetYear=dated?year+p.targetAge-age:null;
  const start=p.targetAge===7&&age<7?targetYear+'년 1월':year+'년 '+mon+'월';
  const date=dated?(age===8?year+'년 '+mon+'월 ~ 입학 전':start+' ~ '+(p.targetAge===7?(targetYear+1)+'년 2월':targetYear+'년 12월')):p.targetAge===7?'7세 ~ 초등 입학 전':'6세 말까지';
  return {...p,key,date,goalDate:targetYear?targetYear+'년 5월':p.targetAge+'세 5월',talk:p.talk+(p.targetAge===7?' 7세 말까지의 공부를 바탕으로, 입학 전 1~2월에는 읽던 책과 익힌 어휘·전략을 다시 활용하겠습니다.':''),start:null,end:null};
 });
 const after=standardPeriods({...context,grade:'1',age:null,year:dated?year+8-age:null,mon:3}).map(p=>['early','primary'].includes(p.key)?{...p,label:p.key==='early'?'초1~2':p.label,title:'현재 읽는 범위에서 독립 읽기·표현 확장',talk:'입학했다고 쉬운 단계부터 다시 시작하지는 않겠습니다. 유아 때 이어온 어휘·독해서·읽기 전략을 유지하고, 혼자 읽어 설명하고 짧게 쓰는 범위를 넓힙니다. 다음 교재는 지금 책에서 도움 없이 이해하는 모습을 보고 정합니다.',check:'낯선 글에서도 질문을 이해하고 답의 근거를 찾는지, 읽은 내용을 자기 문장으로 정리하는지 확인합니다.',areas:{...EN_PRESCHOOL.preschool7.areas,
  vocabulary:enArea('현재 어휘책의 다음 권·읽는 책의 어휘','예문·유의어·파생어와 누적 복습','이미 익힌 단계는 반복 진도로 돌아가지 않고, 새 글과 자기 문장에서 다시 활용합니다.','새 문맥에서 뜻을 구분하나요?'),
  evidence:enArea('현재 독해서·CARS·STARS에서 확인한 다음 범위·원서','독립 읽기·근거 찾기·요약','현재 범위를 유지하며 혼자 읽는 비중을 늘립니다. 학년만으로 교재 단계를 올리거나 내리지 않습니다.','새 글에도 배운 전략을 적용하나요?'),
  writing:enArea('읽은 책의 짧은 요약·자기 의견·영작 피드백','이유와 근거를 붙여 말하고 쓰기','말로 정리한 뒤 짧게 쓰고, 고친 표현을 다음 글에 활용합니다.','도움 없이 자기 문장으로 표현하나요?')
 }}:p);
 return [...periods,...after];
}
function standardPeriods(context={}){
 const grade=Number(context.grade),year=Number(context.year),mon=Number(context.mon),validGrade=Number.isInteger(grade)&&grade>=1&&grade<=12,dated=Number.isInteger(year)&&year>=2020&&year<=2100&&Number.isInteger(mon)&&mon>=1&&mon<=12;
 if(context.foreignCalendar)return [{key:'foreign',date:dated?calendar(context)+'부터 · 학교 학기 일정에 맞춤':'학교 학기 일정에 맞춤',foreign:true,label:'현재 학교 과정',title:'학교 과제와 읽기·표현을 함께',areas:{vocabulary:enArea('학교 과제의 어휘·현재 어휘책','생활·학습 어휘와 문맥 속 뜻','읽는 자료의 개념어와 어근·표현을 함께 봅니다.','수업과 새 과제에서 쓰임을 설명하나요?'),sentence:enArea('학교 읽기 자료·현재 문법 자료','수업 지시와 문장 구조','과제에서 막힌 문장을 풀어 읽고 쓰기에 적용합니다.','과제 지시를 자기 말로 설명하나요?'),evidence:enArea('학교 지정 읽기·과목별 자료·읽던 원서','핵심 요약·주장과 근거','학교 수준에 맞는 자료를 읽고 다른 자료와 비교합니다.','자기 생각과 자료의 근거를 구분하나요?'),listening:enArea('수업·토론·발표 자료','듣고 메모·질문·대답하기','핵심을 메모하고 질문하거나 짧게 발표합니다.','수업의 핵심과 질문을 이해하나요?'),writing:enArea('현재 쓰기 과제·학교 평가 기준','초안·피드백·퇴고','같은 글을 고치고 다음 과제에는 도움을 줄입니다.','교사의 피드백을 새 글에 적용하나요?')},talk:'해외 학교에서는 국내 학년표에 끼워 맞추지 않겠습니다. 실제 읽기 자료와 과제를 중심으로 어휘·문장·독해·듣기·쓰기를 함께 보고, 다음 학기에는 분량과 도움의 정도를 조정하겠습니다.',check:'학기 말 학교의 과제와 피드백을 보고 다음 학기 읽기·쓰기 범위를 조정합니다.'}];
 if(context.grade==='pre')return preschoolPeriods(context);
 const last=validGrade&&grade>10?12:10,sy=dated?year-(mon<3?1:0):null,now=dated?year*12+mon-1:null;
 return Object.entries(EN_STANDARD).filter(([,p])=>p.from<=last&&(!validGrade||p.to>=grade)).flatMap(([key,p])=>{
  if(!validGrade)return [{...p,key,date:p.label+' 시기에 맞춰 조정',start:null,end:null}];
  const firstYear=sy===null?null:sy+p.from-grade,lastYear=sy===null?null:sy+p.to-grade;
  const start=firstYear===null?null:firstYear*12+(p.startMonth||3)-1,end=lastYear===null?null:(p.endMonth===8?lastYear*12+7:(lastYear+1)*12+1);
  if(dated&&end<now)return [];
  if(key==='middle3'&&grade===9&&mon<3)return [];
  let date=p.label+' · 학교 일정에 맞춤';
  if(dated){const fmt=n=>Math.floor(n/12)+'년 '+(n%12+1)+'월';date=fmt(Math.max(now,start))+' ~ '+fmt(end);if(p.eventEnd)date=(grade===9?fmt(now):firstYear+'년 3월')+' ~ 마지막 내신';if(p.eventStart)date=lastYear+'학년도 마지막 내신 후 ~ '+(lastYear+1)+'년 2월';}
  return [{...p,key,date,start:start===null?null:Math.max(now,start),end,eventBased:!!(p.eventStart||p.eventEnd)}];
 });
}
// These are alternatives by role, not five additional classes or compulsory purchases.
// Titles checked against publisher catalogues on 2026-10-26; readiness is a planning judgement.
const EN_BOOK_LINK='https://netutor.neflow.ai/english/curriculum/popular';
const enBook=(area,title,use,url=EN_BOOK_LINK)=>({area,title,use,url});
function preschoolRecommendations(context){
 const seven=Number(context.age)>=7;
 const strategy=enBook('독해 전략',seven?'CARS·STARS C':'CARS·STARS A → B',seven?'7세 5월 C를 목표로 합니다. CARS로 확인한 약점을 STARS에서 연습하고, 새 글에서도 전략을 쓰는지 봅니다.':'6세 5월 B까지를 목표로 합니다. CARS로 중심 생각·세부 내용·추론 등을 확인하고 같은 단계 STARS로 연습합니다.','https://help.carsandstars.com.au/article/360000897396-parent-training-and-learning-video-program-walkthrough-for-homes');
 return {key:seven?'preschoolUpper7':'preschoolUpper6',label:'유아 상위권 · '+(seven?'7세':'6세 말까지'),note:'영어 읽기를 꾸준히 해 온 아이를 위한 조합입니다. 처음에는 지문과 질문을 함께 읽고 뜻과 답의 근거를 이야기해 주세요. 각 영역은 같은 주에 병행하되, 같은 역할의 책은 순서대로 이어갑니다.',items:seven?[
  enBook('어휘','Vocabulary Workshop Green · 4000 Essential English Words 1·2 · Wordly Wise 3000 Book 2·3','다섯 권 중 세 권 이상을 7세 말까지 이어가는 목표입니다. 한 권씩 예문과 누적 복습을 함께 하세요.',null),
  enBook('주 독해서','Junior Reading Expert 2·3 · 180-word READING 1·2','주교재 한 권부터 정하고 문장 해석과 답의 근거를 짚습니다. 익숙해지면 다음 권으로 이어갑니다.',null),
  enBook('독해 적용','Spectrum Test Practice Grade 2·3·4','Reading·Language 부분을 골라 새로운 형식의 질문을 연습합니다. 수학 등을 포함한 종합 교재이며, 완북이 학원 합격을 보장하지는 않습니다.','https://www.carsondellosa.com/spectrum-test-practice-free-online-materials'),
  strategy,
  enBook('듣기·원서','TOEFL Junior Intermediate Listening · 읽는 책 음원','원서 읽기와 듣기를 유지하고, 처음 듣는 내용의 핵심과 세부 정보를 구분합니다.',null),
  enBook('문법·말하기·쓰기','쉬운 문법책 · 읽은 책 요약 · 영작 피드백','문법은 쉬운 책으로 이어가고, 읽은 내용을 말한 뒤 짧게 씁니다. 피드백받은 표현을 다음 글에도 써 보세요.',null)
 ]:[
  enBook('함께 읽기·듣기','Hello Reader Level 1·2·3 · 얼리 챕터북','책을 함께 읽고 뜻을 이야기한 뒤 음원도 자주 들려주세요. 문제집과 별개로 책 읽는 시간을 꾸준히 둡니다.',null),
  enBook('독해 연습','Daily Reading Comprehension Grade 1·2·3','DRC 지문과 질문을 함께 읽고 답의 근거를 찾습니다. 혼자 설명하는 부분부터 조금씩 도움을 줄입니다.','https://www.yes24.com/Product/Goods/75235218'),
  enBook('읽기 분량 확장','80-word READING → 120-word READING','각 시리즈를 순서대로 이어갑니다. 읽은 내용을 말하고 문제의 질문까지 이해했는지 함께 확인하세요.','https://www.yes24.com/Product/Goods/38466619'),
  enBook('어휘','Vocabulary Workshop Red → Purple → Green','단어의 뜻을 예문·책 내용과 연결합니다. Green은 7세 말까지 꾸준히 이어갈 범위입니다.','https://www.yes24.com/Goods/Detail/6258076'),
  enBook('쉬운 문법·표현','Let’s Target Grammar 1','쉬운 문법을 읽기·말하기·짧은 영작과 연결합니다. 어려운 문법책으로 빨리 올리는 데 초점을 두지 않습니다.',null),
  strategy
 ],extra:seven?'추가 독해 후보: Reading Skills 4·5, TOEFL Junior Intermediate Reading. 현재 주교재와 겹치는 부분은 골라 쓰고, 여러 권의 진도를 한꺼번에 늘리지 않습니다.':'여유가 있을 때: Multiple Reading Skills로 익숙한 유형을 연습하며 자신감을 쌓습니다. 읽는 책과 주 독해서를 먼저 꾸준히 이어가세요.'};
}
function englishRecommendations(row,context={}){
 const k=stage(context),grade=Number(context.grade),advanced=['independent','academic'].includes(row.current);
 if(k==='foreign')return {key:'foreign',label:'학교 자료에 맞춰 고르기',note:'학교 지정 원서와 쓰기 과제를 먼저 보겠습니다. 국내 내신 문제집을 일괄 추가하기보다, 수업에서 어려운 어휘·문장·쓰기부터 보완합니다.',items:[]};
 if(context.grade==='pre')return preschoolRecommendations(context);
 if(!row.current||row.current==='unknown'||k==='unknown')return {key:'pending',label:'현재 읽는 범위부터 확인',note:'읽는 책이나 문장 수준을 고르면 시작 교재를 좁힐 수 있습니다. 지금은 아래 학년별 표에서 교재 후보를 먼저 살펴보세요.',items:[]};
 if(row.current==='starting')return {key:'early',label:'소리와 짧은 문장 읽기',note:'소리와 철자 연결이 어려운 부분부터 보완합니다. 이미 읽는 낱말과 문장은 건너뛰고, 짧은 문장의 뜻과 표현을 함께 보세요.',items:[
  enBook('읽기 기초','초등영어 파닉스가 된다 1','소리와 철자를 연결하고, 처음 보는 쉬운 낱말도 합쳐 읽어봅니다.'),
  enBook('읽기·어휘·듣기','Easy Link Starter 1','짧은 글을 읽고 음원을 함께 듣습니다. 뜻을 아는 표현을 말로 다시 써 보세요.'),
  enBook('문장·쓰기','Write Right Beginner 1','짧은 문장을 혼자 읽을 수 있을 때, 낱말을 바꾸어 자기 문장으로 씁니다.')
 ]};
 if(k==='early'||k==='primary'&&advanced)return {key:'earlyReader',label:'지금 읽는 범위에서 이어가는 조합',note:k==='primary'&&advanced?'지금 공부하는 원서·문법·독해서를 이어가겠습니다. 초3·4가 됐다고 기초 교재로 돌아갈 필요는 없습니다. 배운 문법을 낯선 글의 해석과 영작에 쓰는지 살펴보고, 어려워하는 부분만 보완해 주세요.':'원서를 읽고 있다면 파닉스부터 다시 시작하지 않겠습니다. 현재 책의 난도와 혼자 이해하는 범위를 확인하고, 아래 역할 중 빠진 부분을 연결하세요. AR·SR만으로 교재 단계가 정해지지는 않습니다.',items:[
  enBook('어휘','현재 어휘책·원서 속 어휘','읽은 글에서 만난 표현과 누적 복습을 연결합니다. 이미 외운 단어는 새 예문에서 확인하세요.',null),
  enBook('문법·문장','현재 문법 교재·읽던 책의 문장','주어·동사와 문장 구조를 짚고, 시제나 주어를 바꾸어 자기 문장으로 써 봅니다.',null),
  enBook('독해·전략','현재 원서·독해서 / CARS·STARS 현재 단계','읽던 책은 유지합니다. 전략 교재가 필요하면 현재 이해하는 단계에서 CARS로 점검하고 STARS로 부족한 전략을 연습하세요.',null),
  enBook('듣기·말하기','원서 음원·현재 듣기 자료','책 내용을 듣고 설명하거나 질문에 대답합니다. 잘 들리지 않은 부분만 대본과 비교해 다시 들어 보세요.',null),
  enBook('쓰기','현재 문장·문단 쓰기 교재','자기 생각을 말한 뒤 문장으로 쓰고, 고친 표현을 다음 글에 사용합니다. 독해보다 쓰기가 어렵다면 쓰는 분량만 조정하세요.',null)
 ]};
 if(k==='primary')return {key:'primary',label:'읽기에서 문장 표현까지',note:'현재 원서는 계속 읽고, 필요한 역할의 문제집만 골라 붙이세요. 아래 단계가 쉬우면 같은 시리즈의 다음 단계 샘플을 확인합니다.',items:[
  enBook('어휘','능률VOCA 초등 기본','새 단어와 이전 단어를 함께 보고, 읽는 책에서 같은 표현을 찾아봅니다.'),
  enBook('문법','초등 Grammar Inside 1','문장 구조와 기본 문법을 배우고 말하기·영작에 함께 적용합니다.'),
  enBook('독해','초등영어 리딩이 된다 Basic 1','짧은 글의 중심 내용과 답의 근거를 찾는 연습입니다.'),
  {area:'듣기',title:'읽는 책의 음원·학교 듣기 자료',use:'듣고 이해한 뒤 안 들린 표현만 대본과 비교합니다.',url:null},
  enBook('쓰기','달곰한 Sentence Writing 1','문장을 완성하고, 배운 표현으로 짧은 자기 문장을 씁니다.')
 ]};
 const high=k==='high'||grade>=9&&advanced;
 if(high)return {key:'high',label:'고등 영어를 준비하는 조합',note:'내신은 학교 자료로 준비하고, 비내신 기간에는 어휘·구문·독해를 함께 이어갑니다. 아래 교재는 앞 단계의 문장을 스스로 읽을 수 있을 때 고릅니다.',items:[
  enBook('어휘','능률VOCA 어원편 고등','어근으로 묶어 익히되 예문 속 뜻과 이전 오답도 함께 확인합니다.',SOURCES.neVoca.url),
  enBook('구문','천문장 입문','긴 문장을 끊어 읽고, 주어·동사와 수식 관계를 설명합니다.'),
  enBook('독해','EBS 수능특강 Light 영어독해','고등 지문의 흐름과 정답 근거를 연습합니다. 어려운 유형은 해석부터 다시 봅니다.','https://www.ebsi.co.kr/ebs/lms/lmsm/retriveMyClmYear.ebs?cookieGradeVal=high1'),
  enBook('듣기','고1 전국연합학력평가 듣기','회차를 풀고 틀린 구간을 다시 듣습니다. 새 회차에서 같은 실수가 줄었는지 봅니다.','https://www.ebsi.co.kr/ebs/xip/xipc/previousPaperList.ebs'),
  {area:'서술형',title:'학교 서술형·조건 영작 자료',use:'독해에서 배운 구문을 조건에 맞게 쓰고, 고친 문장을 다른 내용에도 적용합니다.',url:null}
 ]};
 if(advanced)return {key:'middleReady',label:'중등 기본이 잡힌 뒤의 조합',note:'시제·문장 구조를 낯선 문장에서도 설명할 수 있을 때 이어갑니다. 이미 공부 중인 책이 같은 역할을 한다면 그대로 사용하세요.',items:[
  enBook('어휘','능률VOCA 중등 필수','기본 어휘가 익숙한 경우의 확장용입니다. 예문·유의어·파생어를 함께 봅니다.','https://m.nebooks.co.kr/pages/book/view.asp?c=BB04010007'),
  enBook('문법','1316 GRAMMAR Level 3','앞 단계 문법을 정리한 뒤 여러 개념이 섞인 문장과 어법으로 연결합니다.'),
  enBook('독해','수능 딥독 중학 수능 독해 LEVEL 2','문장 해석과 정답 근거를 함께 확인하고 고등 독해 유형에 적응합니다.'),
  enBook('듣기','능률 중학영어 듣기 모의고사 22회 Level 2','회차 풀이와 오답 구간 복습을 함께 하며 의도·이유·세부 정보를 찾습니다.'),
  enBook('서술형','중학 영문법, 문법이 쓰기다 3학년','문법을 설명하는 데서 그치지 않고 조건을 지켜 문장으로 씁니다.','https://keyedu.co.kr/book/index.php?category=20_1')
 ]};
 return {key:'bridge',label:k==='upper'?'초5~6 · 중등 영어 입문이 준비된 경우':'중등 어휘·문법의 기본을 잡는 조합',note:'원서 읽기는 유지하고, 아래 다섯 영역을 같은 주에 함께 공부합니다. 같은 역할의 교재가 있다면 새로 살 필요는 없습니다.',items:[
  enBook('어휘',grade>=7?'능률VOCA 중등 필수':'능률VOCA 중등 기본',grade>=7?'기본 어휘가 익숙할 때 선택합니다. 빈틈이 많다면 중등 기본부터 보완하세요.':'뜻과 소리를 익힌 뒤 예문으로 다시 봅니다. 기본 어휘가 익숙해지면 중등 필수로 이어갑니다.','https://m.nebooks.co.kr/pages/book/view.asp?c='+ (grade>=7?'BB04010007':'BB04010008')),
  enBook('문법','1316 GRAMMAR Level 1','한 개념을 배운 뒤 독해에서 찾아보고 짧은 문장으로도 써 봅니다.','https://m.nebooks.co.kr/pages/book/view.asp?c=BB09190001'),
  enBook('독해','1316 Reading Level 1','문장을 정확히 해석하고 답의 근거를 짚습니다. 원서 읽기와 함께 이어가세요.',SOURCES.neReading.url),
  enBook('듣기','능률 중학영어 듣기 모의고사 22회 Level 1','한 회를 풀고 틀린 문장만 받아쓰기·따라 말하기·다시 듣기로 연결합니다.',SOURCES.neListening22.url),
  enBook('서술형','중학 영문법, 문법이 쓰기다 1학년','그 주에 배운 문법의 단원을 골라 조건 영작을 합니다. 쓴 문장의 시제·수일치까지 확인하세요.','https://keyedu.co.kr/book/index.php?acts=view&category=20_1&code=623')
 ]};
}
// Reference profiles come from supplied talks, not a placement test or an academy admission rule.
// b60fface (2026-10-12 seminar): vocabulary/output early; grammar + reading in upper primary.
// 5e151ebd: ordinary middle-school plan = school English, entrance-exam preparation, optional expansion.
// 791864c8 / 87f90f13: gradual reader-to-skills transition; sentence meaning before paragraph inference.
function isPrimaryEnglish(context={}){return context.grade==='pre'||Number(context.grade)>=1&&Number(context.grade)<=6;}
function effectiveReference(row,context){
 // A primary-school general selection survives a temporary preschool view; preschool offers upper tracks only.
 if(context.grade==='pre'&&row.referenceProfile==='general')return 'upper';
 return row.referenceProfile||(context.grade==='pre'&&!context.foreignCalendar?'extreme':null);
}
function readingContext(row,context){
 if(!isPrimaryEnglish(context))return null;
 const metric=row.readingMetric,range=row.readingRange,label=metric?READING_METRICS[metric]:'읽기 지수 아직 선택 전';
 const known=['ar','srGe'].includes(metric)&&!!range;
 return {metric,range,label,summary:known?label+' · '+READING_RANGES[range]:label,
  explanation:metric==='ar'?'선택한 수치는 지금 읽는 책의 난도입니다. 책 내용을 얼마나 혼자 이해하는지도 함께 보겠습니다.':metric==='srGe'?'GE는 검사에서 보인 수행을 규준 집단과 비교한 값입니다. 그 학년의 책이나 수업을 모두 할 수 있다는 뜻은 아닙니다.':'지수가 없어도 읽던 책으로 시작할 수 있습니다. 혼자 읽고 내용을 설명하는 모습부터 살펴보겠습니다.',
  next:known?'지수를 올리기 전에 현재 읽는 책의 낯선 한 부분을 골라 보세요. 혼자 내용을 설명하고 답의 근거를 짚으면 다음 난도를 조금 경험해 봅니다. 어휘·문법·쓰기·듣기는 별도로 확인합니다.':'같이 읽어야 이해하는지, 혼자 읽고 설명하는지 먼저 확인한 뒤 책의 난도를 정하겠습니다.'};
}
function primaryReferenceAreas(key,kind){
 const upper=kind==='upper',pre=key.startsWith('preschool'),early=key==='early';
 if(pre)return {
  vocabulary:enArea('읽는 책·그림과 연결한 낱말','뜻·소리·자주 쓰는 표현','뜻을 아는 낱말을 책과 놀이에서 다시 만나고 짧게 말해 봅니다. 단어 시험만으로 진도를 정하지 않습니다.','새 장면에서도 표현을 알아듣고 쓰나요?'),
  sentence:enArea('그림책의 짧은 문장·현재 쉬운 문법 자료','의미 있는 문장 듣고 바꾸어 말하기','익숙한 문장에 단어 하나를 바꾸어 말합니다. 글자를 읽기 시작했다면 같은 문장을 보며 소리와 철자를 연결합니다.','뜻을 알고 자기 말로 바꾸나요?'),
  evidence:enArea('현재 이해하는 그림책·리더스',upper?'이야기와 쉬운 정보글을 함께 읽기':'함께 읽기에서 짧은 독립 읽기로','읽는 책의 AR 수준 또는 SR GE를 참고하되, 이야기의 재미와 혼자 이해하는 정도를 먼저 봅니다. 질문은 한두 가지로 충분합니다.','그림이나 어른의 도움 없이 설명하는 부분이 늘어나나요?'),
  listening:enArea('읽던 책 음원·노래·짧은 대화','즐겁고 꾸준한 듣기와 짧은 대답','내용을 아는 음원을 듣고 장면을 이야기합니다. 듣는 시간만 채우기보다 뜻을 알고 반응하는지 봅니다.','들은 표현을 놀이와 대화에서 쓰나요?'),
  writing:enArea('그림 이야기·말로 만든 문장',upper?'말로 생각 만들기에서 짧은 자기 문장으로':'말하기·그림·아는 낱말로 표현하기','먼저 자기 생각을 충분히 말하게 해 주세요. 쓰기는 준비된 만큼만 연결하고, 모범 답안을 베끼는 것으로 대신하지 않습니다.','자기 생각을 말하고 아는 표현으로 옮기나요?')
 };
 if(early||key==='primary')return {
  vocabulary:enArea(upper?'현재 어휘책·원서 속 표현':'현재 단계의 어휘책·읽는 책','새 어휘와 누적 복습·예문 속 쓰임','뜻과 소리를 익힌 뒤 읽는 책과 자기 문장에서 다시 씁니다. 양을 늘리기 전에 며칠 뒤에도 떠올리는지 보세요.','외운 단어를 새 문맥에서 알아보나요?'),
  sentence:enArea('초등 문법·문장 쓰기 자료','문장 구조·시제·수일치','읽는 글과 쓰는 문장에서 필요한 규칙을 배웁니다. 문법책을 먼저 다 끝내고 독해를 시작하는 순서는 아닙니다.','배운 규칙으로 자기 문장을 고치나요?'),
  evidence:enArea('현재 수준의 원서·짧은 독해서','이야기·정보글의 중심 내용과 근거','흥미 있는 원서와 짧은 독해서를 함께 봅니다. 읽기 수준이 높아져도 나이에 맞는 내용인지 확인하고, 답을 고른 근거를 짚습니다.','해석한 내용을 자기 말로 설명하나요?'),
  listening:enArea('원서 음원·현재 수업의 듣기·발표','내용을 듣고 질문·대답하기','읽던 내용부터 듣고 말합니다. 안 들린 부분만 대본과 비교하고, 다시 들은 뒤 짧게 설명합니다.','외운 대사가 아니라 새 질문에도 대답하나요?'),
  writing:enArea('현재 문장·문단 쓰기 교재·원서 감상',upper?'자기 문장 → 문단·이유와 예시':'한두 문장 → 연결된 짧은 글','주 1회 글쓰기 시간을 두는 예시부터 시작할 수 있습니다. 생각을 먼저 정리하고 초안 → 피드백 → 같은 글 고치기로 이어갑니다.','첨삭한 표현을 다음 글에도 혼자 쓰나요?')
 };
 return null;
}
function withReference(periods,row,context){
 // Current independent reading takes precedence over a generic early-grade phonics example.
 if(row.current&&!['starting','unknown'].includes(row.current))periods=periods.map(p=>p.key==='early'?{...p,title:'현재 원서 읽기와 정확한 표현 이어가기',talk:'지금 읽는 책에서 이어가겠습니다. 학년이 낮다는 이유로 파닉스부터 다시 시작하지 않고, 읽은 내용의 근거와 배운 표현을 말과 글로 연결하겠습니다.',areas:{...p.areas,
  sentence:enArea('현재 문법 자료·읽던 책의 문장','문장 구조·뜻과 표현 연결','읽던 문장의 주어·동사와 수식 관계를 보고, 주어나 시제를 바꾸어 말하거나 씁니다.','뜻을 이해하고 자기 문장으로 바꾸나요?'),
  evidence:enArea('현재 원서·독해서·필요한 읽기 전략 자료','중심 내용·근거·사건의 흐름','지금 읽는 범위에서 혼자 설명하는 부분을 확인합니다. 전략 교재는 현재 단계에서 시작하고 읽던 원서도 유지합니다.','질문의 뜻과 답의 근거를 설명하나요?'),
  writing:enArea('현재 문장·문단 쓰기 자료','읽은 내용과 자기 생각 표현하기','말로 먼저 정리하고 자기 문장으로 씁니다. 첨삭한 표현을 다음 글에서 다시 사용합니다.','보고 베끼지 않고 자기 생각을 쓰나요?')
 }}:p);
 const ref=effectiveReference(row,context);
 if(!ref||context.foreignCalendar)return periods;
 return periods.map(p=>{
  if(ref==='extreme'){
   if(!['early','primary'].includes(p.key))return p;
   const early=p.key==='early';
   return {...p,title:'현재 읽는 범위에서 독해 전략·표현 확장',talk:'학년이 바뀌었다고 읽기를 쉬운 단계로 되돌리지는 않겠습니다. 현재 이해하는 독해서와 원서, 어휘를 이어가고 문법·듣기·쓰기에도 연결합니다. D는 현재 단계에서 배운 전략을 새 글에 적용하는지 확인한 뒤 이어갑니다.',check:'책의 단계보다 지문과 질문을 이해하고 근거를 설명하는지 봅니다. CARS는 점검, STARS는 놓친 전략을 연습하는 데 사용합니다.',areas:{...EN_PRESCHOOL.preschool7.areas,vocabulary:enArea(EN_PRESCHOOL.preschool7.areas.vocabulary.material,'현재 단계의 어휘·예문과 누적 복습','이미 마친 책은 제외하고, 현재 읽기에 필요한 어휘를 다음 한 권으로 이어갑니다. 예문과 읽는 책에서 같은 표현을 다시 확인합니다.','새 문맥에서 뜻을 구분하고 자기 표현에 쓰나요?'),evidence:enArea('현재 독해서·원서 + CARS·STARS '+(early?'현재 단계 → D → E':'확인한 다음 범위'),'독해 전략·근거 설명·요약','지금 공부한 범위부터 확인합니다. D와 E는 참고 목표이며, 학년이나 AR·SR 지수로 이수한 것으로 처리하지 않습니다.','새 글에서도 스스로 근거를 설명하나요?')},...(early?{goal:'초2 말 · CARS·STARS E 참고 목표',goalSource:'사용자 제공 학습 사례 · PEAI 재원 경험',goalContext:'PEAI 재원 경험을 바탕으로 한 참고 목표',goalNote:'현재 단계 → D → E. 공식 입학 기준이나 완료 이력이 아닙니다.'}:{})};
  }
  const {goal,goalDate,goalSource,goalContext,goalNote,...base}=p,areas=primaryReferenceAreas(p.key,ref);
  if(areas)return {...base,areas,label:p.label.replace(/ · (극상위권 참고|상위권)/,''),title:p.key.startsWith('preschool')?'듣고 함께 읽으며 표현의 바탕 만들기':ref==='upper'?'원서·어휘와 말하기·쓰기 함께 넓히기':'기본 문장과 즐거운 읽기부터 탄탄히',talk:ref==='upper'?'단어를 외우고 책을 읽는 시간만 늘리기보다, 읽은 것을 자기 말과 글로 표현할 시간을 남기겠습니다. 어휘·쓰기·말하기에 조금 더 공을 들이되 문법·독해·듣기도 같은 주에 함께 갑니다.':'지금 읽을 수 있는 문장부터 꾸준히 이어가겠습니다. 소리·어휘가 어렵다면 그 부분을 보완하고, 책 읽기와 짧은 표현을 함께 합니다. 다른 아이가 끝낸 교재 목록을 그대로 따라갈 필요는 없습니다.',check:'현재 난도의 새 글을 읽고, 뜻을 설명하고, 짧게 말하거나 쓰는지 함께 봅니다.'};
  if(p.key==='upper'&&ref==='upper')return {...base,title:'원서 읽기를 지키며 중등 문법 체계 잡기',talk:'초5~6에는 원서를 계속 읽으면서 문법을 체계적으로 정리하겠습니다. 초6 2학기에 한 차례 정리하는 것을 참고 목표로 두되, 이미 배운 문법은 독해와 영작에서 써 보는 데 힘을 씁니다. 문법을 한 바퀴 봤다고 끝낸 것은 아닙니다.',check:'배운 문법으로 낯선 문장을 해석하고 조건에 맞게 써 보세요. 중등 어휘와 듣기도 함께 준비합니다.'};
  if(['middle1','middle2a','middle2b','middle3','preHigh'].includes(p.key)&&ref==='general')return {...base,title:({middle1:'학교 영어의 기본과 낯선 글 읽기',middle2a:'내신과 중등 어휘·문법 함께 다지기',middle2b:'내신을 챙기며 고등 지문 경험하기',middle3:'내신·수능 대비를 함께 연결하기',preHigh:'고등 입학 전 부족한 영역 정리'})[p.key],talk:'시험 기간에는 학교의 단어·문법·본문과 서술형을 먼저 준비하겠습니다. 비내신 기간에는 새 글을 읽고 듣는 공부로 돌아옵니다. 중2·중3부터 고등 기출을 조금씩 경험하되, 어려우면 막힌 어휘·구문부터 보완하세요. 별도 공인시험은 필요할 때 선택하면 됩니다.'};
  return p;
 });
}
function referenceRecommendations(row,context,periods){
 const ref=effectiveReference(row,context),primary=isPrimaryEnglish(context);
 if(!primary||context.foreignCalendar||!ref)return englishRecommendations(row,context);
 if(ref==='general'&&row.current==='starting')return englishRecommendations(row,context);
 if(ref==='extreme'&&context.grade==='pre')return {...preschoolRecommendations(context),label:'극상위권 참고 과정 · '+(Number(context.age)>=7?'7세':'6세 말까지')};
 if(ref==='extreme'&&Number(context.grade)<=2){
  const r=preschoolRecommendations({age:7});return {...r,key:'extremePrimary',label:'현재 읽기에서 이어갈 교재·자료',note:'독해 전략을 꾸준히 이어간 학생의 참고 사례입니다. 현재 이해하는 범위를 먼저 확인하고, 이미 마친 책은 제외하세요. 같은 역할의 교재는 한 권씩 이어갑니다.',items:r.items.map(b=>b.area==='어휘'?{...b,use:'현재 어휘책에서 예문과 누적 복습을 이어가세요. 이미 마친 책은 제외하고, 읽는 글에서 필요한 표현과 다음 한 권을 연결합니다.'}:b.area==='독해 전략'?{...b,title:'CARS·STARS 현재 단계 → D → E',use:'PEAI 재원 경험의 초2 말 E는 참고 목표입니다. D의 시작 월을 고정하지 않고 현재 단계의 새 글을 이해하는지 확인한 뒤 이어갑니다.'}:b)};
 }
 if(context.grade==='pre'||['early','primary'].includes(stage(context)))return {key:ref+'Primary',label:EN_REFERENCES[ref].label+' · 현재 읽기에 맞춰 고르기',note:'다섯 영역을 같은 주에 이어갑니다. 책의 난도는 현재 읽는 책·지수와 실제 이해를 함께 보고 정하고, 같은 역할의 책을 새로 더하지 않습니다.',items:EN_AREAS.map(([id,title])=>enBook(title,periods[0].areas[id].material,periods[0].areas[id].method,null))};
 return englishRecommendations(row,context);
}
function englishModel(value,context={}){
 const state=restore(value),row=state.subjects.english,custom=row.planMode==='custom',route=custom?ROUTES.english[row.focus]:null,book=custom?contextualBook(row.book,'english',row,context):null;
 const periods=withReference(standardPeriods(context),row,context),first=periods[0],young=['early','primary'].includes(stage(context)),selected=route?(row.focus==='transfer'?'evidence':row.focus==='foundation'?'sentence':row.focus):null;
 const tracks=EN_AREAS.map(([id,title])=>({id,title,...first.areas[id],items:periods.map(p=>p.areas[id].scope),selected:selected===id}));
 const foundation=['starting','unknown'].includes(row.current),standardReady=!!row.current;
 const appliedRhythm=custom&&row.rhythm?row.rhythm:'keep';
 const ref=effectiveReference(row,context),title=context.foreignCalendar?'학교 과정에 맞춘 영어 로드맵':context.grade==='pre'?'유아 영어 로드맵 · '+EN_REFERENCES[ref].label:first.label+(periods.length>1?'부터 '+periods.at(-1).label+'까지':'')+'의 영어 표준 로드맵';
 const support=foundation?(row.current==='starting'?'표의 학년별 방향은 유지하되, 지금은 소리·낱말·짧은 문장을 읽는 기초를 함께 보완하겠습니다. 같은 기간의 독해·듣기·쓰기도 혼자 이해할 수 있는 쉬운 자료로 이어가고, 아래 교재 예시는 준비가 됐을 때 연결합니다.':'학년별로 무엇을 준비할지 먼저 보겠습니다. 현재 교재의 낯선 문장 하나를 읽고, 내용을 설명하고, 짧게 써 보는 모습을 확인한 뒤 자료의 난도를 정해도 늦지 않습니다.'):'';
 return {id:'english',name:'영어',row,route,book,ready:standardReady,standardReady,planMode:row.planMode,title,referenceProfile:ref,reading:readingContext(row,context),recommendations:referenceRecommendations(row,context,periods),standardStages:periods,phases:periods,tracks,course:{key:profile({...row,focus:custom?row.focus:null},context),title,talk:first.talk,next:periods[1]?.talk||'학교의 다음 과정과 실제 과제에 맞춰 읽기·표현의 범위를 조정합니다.',young,foundation:row.current==='starting',foreign:!!context.foreignCalendar,tracks},current:CURRENT.english.find(([k])=>k===row.current)?.[1]||'현재 공부 확인 전',rhythm:rhythm(appliedRhythm),appliedRhythm,support,age:ageGuide(context),review:first.date,stage:stage(context),foreign:!!context.foreignCalendar,checkpoints:periods.map(p=>({title:p.label+' · 다음 공부를 위해',date:p.date,text:p.check})),later:context.foreignCalendar?[{date:'다음 학교 학기',title:'자료의 난도와 피드백 조정',text:'학교가 실제로 요구하는 읽기·발표·글쓰기를 살피고, 혼자 해내는 부분을 늘립니다. 국내 시험 단계로 일괄 환산하지 않습니다.'}]:Object.values(EN_STANDARD).filter(p=>p.from>Math.max(10,Number(context.grade)||0)&&!periods.some(x=>x.label===p.label)).map(p=>({date:p.label,title:p.title,text:p.talk}))};
}
function koreanTracks(row,context){
 const k=stage(context),early=k==='early'||row.current==='starting',older=['middle','high'].includes(k),upper=k==='upper'||older;
 const titles={vocabulary:'어휘·개념어',foundation:'한글·문장 이해',evidence:'독해·근거',literature:'독서·문학',writing:'말하기·쓰기'};
 const scopes={
 vocabulary:early?['낱말의 소리와 뜻','헷갈리는 낱말·맞춤법','읽은 책에서 새 낱말','비슷한 말·반대말','내 경험으로 낱말 설명','새 문장에서 뜻 확인']:['교과서의 낯선 개념어','사전 뜻과 문맥 대조','같은 범주의 낱말 묶기','유의어·다의어 비교','개념어로 한 문장 쓰기','다른 교과에서 뜻 설명'],
 foundation:early?['받침 있는 낱말 읽기','겹받침·이중 모음 보완','문장을 끊어 읽기','누가 무엇을 했는지 찾기','질문의 조건 끝까지 읽기','새 문장을 읽고 다시 설명']:['문장 속 주어·서술어','수식어와 핵심 내용 구분','접속 표현의 관계','긴 문장을 짧게 풀어 말하기','조건이 여러 개인 질문','새 지시문의 조건 확인'],
 evidence:early?['짧은 글의 사실 찾기','사건의 순서 이야기','문장에서 답 찾기','왜 그렇게 생각했는지 말하기','다른 답이 틀린 부분 찾기','새 글에서 내용 설명']:['문단별 중심 내용','사실·주장·근거 구분','원인·결과·대조 구조','지문과 선택지 대조','추론을 뒷받침하는 표현','낯선 글의 근거와 요약'],
 literature:early?['좋아하는 책 함께 읽기','인물과 사건 이야기','장면을 자기 말로','인물의 마음과 이유','비슷한 새 이야기 읽기','좋아한 장면과 이유']:['인물·사건·갈등 파악','인물의 말·행동과 근거','표현과 장면의 관계','작품의 배경과 주제','다른 작품의 표현 비교','새 작품의 해석 설명'],
 writing:early?['겪은 일 말로 정리','한 문장 생활문 쓰기','두세 문장으로 연결','읽은 책 한 줄 감상','내 글 한 부분 고치기','새 경험을 스스로 쓰기']:['말로 생각과 이유 정리','주장·이유·예시로 쓰기','조건에 맞게 요약하기','읽는 사람을 생각해 수정','첨삭한 같은 글 고쳐 쓰기','새 주제로 도움 줄여 쓰기']};
 const materials={vocabulary:'학교 교과서·국어사전·현재 어휘책',foundation:early?'한글 자료·짧은 읽기 책':'교과서의 문장·실제 과제 지시문',evidence:older?'현재 비문학 독해책·교과서 지문':'교과서의 설명문·현재 독해책',literature:'읽던 책·학교에서 배우는 작품',writing:'내가 쓴 생활문·독서 기록·학교 과제'};
 const weekly={vocabulary:'주 3회 · 낱말 3~5개, 뜻과 자기 문장',foundation:'주 2회 · 문장 3~5개 정확히 읽기',evidence:'주 2회 · 짧은 글 하나, 답의 근거 찾기',literature:early?'편한 시간 10~15분 · 즐겁게 읽기':'주 3회 · 읽을 분량을 나누고 한 장면 설명',writing:early?'주 1~2회 · 한두 문장, 고치기는 한 부분만':'주 1회 초안 · 다른 날 같은 글 고쳐 쓰기'};
 const checks={vocabulary:'사전 문장을 외우지 않고 예를 들어 설명하나요?',foundation:'문제의 조건을 빠뜨리지 않고 자기 말로 설명하나요?',evidence:'답을 지지하는 부분과 틀린 선택지의 오류를 짚나요?',literature:'줄거리와 자기 해석을 구분하고 작품의 근거를 말하나요?',writing:'도움받아 고친 부분을 새 글에서도 혼자 쓸 수 있나요?'};
 return {key:early?'koreanEarly':older?'koreanSecondary':upper?'koreanUpper':'koreanPrimary',title:early?'한글·문장 이해와 즐거운 읽기':upper?'정확한 읽기에서 근거 있는 설명으로':'교과 어휘·문장 이해와 글쓰기',talk:early?'많이 읽고 오래 쓰게 하기보다, 읽은 뜻을 알고 자기 경험을 한두 문장으로 써 보는 것부터 시작하겠습니다. 모든 책에 독후감을 붙일 필요는 없습니다.':'책은 계속 읽되 문제의 조건, 문장의 뜻, 답의 근거를 정확히 짚는 공부를 함께 하겠습니다. 말로 설명한 것을 짧게 쓰고 고치는 데까지 이어 주세요.',next:early?'받침 있는 문장과 질문을 혼자 읽고 내용을 말하면 교과 개념어와 짧은 독해로 넓힙니다.':'낯선 글의 핵심과 근거를 설명하면 글의 길이와 주제를 넓힙니다. 문학·비문학·어휘를 병행하고 학교 평가 범위도 따로 챙깁니다.',tracks:Object.entries(scopes).map(([id,items])=>({id,title:titles[id],items,weekly:weekly[id],material:materials[id],check:checks[id]})),young:early,foreign:k==='foreign'};
}
function model(value,id,context={}){
 if(id==='english')return englishModel(value,context);
 const s=restore(value),row=s.subjects[id],route=ROUTES[id]?.[row?.focus],name=SUBJECTS[id];if(!row)return null;
 const book=contextualBook(row.book,id,row,context),ready=!!(row.current&&route&&book&&row.rhythm),course=koreanTracks(row,context);
 const focusId=row.focus==='transfer'?'evidence':row.focus==='summary'?'evidence':row.focus==='foundation'&&id==='english'?'sentence':row.focus;
 const focusTrack=course.tracks.find(t=>t.id===focusId);
 course.tracks=course.tracks.map(t=>({...t,selected:t.id===focusId,material:t.id===focusId&&book&&!['current','unknown','reader','school'].includes(row.book)?book.title:t.id===focusId&&row.book==='school'?'학교 교과서·수업 자료':t.id===focusId&&row.book==='reader'?'현재 읽는 책·음원':t.material}));
 const phases=route&&focusTrack?focusTrack.items.map((title,i)=>({offset:i,title,method:i===0?route.method:i===1?route.practice:i===5?route.transfer:focusTrack.weekly+' · '+title,check:i===0?'첫 주에는 혼자 하는 부분과 도움받는 부분을 나눠 봅니다.':focusTrack.check,date:calendar(context,i),review:calendar(context,i+1),extra:row.rhythm==='extra'?(i===0?15:30):0})):[];
 const checkpoints=route?[{title:'첫 달 · 출발 범위 조정',date:calendar(context,1),text:'설명을 들은 직후만 풀리는지, 며칠 뒤 혼자 다시 해낼 수 있는지 봅니다. 어려우면 한 단계 쉬운 문장으로 연습량을 확보하세요.'},{title:'세 달 · 같은 난도에서 재확인',date:calendar(context,3),text:focusTrack?.check||route.check},{title:'여섯 달 · 다음 범위 선택',date:calendar(context,6),text:course.next}]:[];
 const later=route?[{date:calendar(context,6)+' 이후',title:'다음 6개월에 이어갈 공부',text:course.next},{date:'다음 범위에서도 계속',title:'남겨 둘 공부',text:id==='english'?'어휘 누적 복습·읽기·듣기는 계속합니다. 문법은 독해와 영작에서 다시 쓰고, 학교 시험 뒤에는 취약한 부분으로 돌아옵니다.':'독서와 어휘를 유지하며 새 글의 근거를 찾고 짧게 쓰는 공부를 이어갑니다. 글이 길어져도 문장 이해부터 확인합니다.'}]:[];
 return {id,name,row,route,book,ready,phases,course,tracks:course.tracks,checkpoints,later,current:CURRENT[id].find(([k])=>k===row.current)?.[1]||'현재 공부 확인 전',rhythm:rhythm(row.rhythm),age:ageGuide(context),review:calendar(context,6),stage:stage(context),foreign:stage(context)==='foreign'};
}
const button=(id,kind,value,title,selected=false,sub='')=>`<button type="button" data-language-subject="${id}" data-language-kind="${kind}" data-language-value="${value}" aria-pressed="${selected}"><span class="pathway-option-dot" aria-hidden="true"></span><strong>${esc(title)}</strong>${sub?`<span>${esc(sub)}</span>`:''}${selected?'<small>선택됨</small>':''}</button>`;
function readingControls(row,context){
 if(!isPrimaryEnglish(context))return '';
 const r=readingContext(row,context);
 return `<details class="language-reading-choice"${!row.readingMetric||['ar','srGe'].includes(row.readingMetric)&&!row.readingRange?' open':''}><summary>지금 읽는 범위도 함께 볼까요?${row.readingMetric?' · '+esc(r.summary):''}</summary><p>읽는 책이나 성적표에서 확인한 항목을 골라 주세요.</p><div class="pathway-options language-metric-options">${Object.entries(READING_METRICS).map(([key,title])=>button('english','readingMetric',key,title,row.readingMetric===key)).join('')}</div>${['ar','srGe'].includes(row.readingMetric)?`<div class="pathway-options language-range-options" aria-label="${esc(READING_METRICS[row.readingMetric])} 범위">${Object.entries(READING_RANGES).map(([key,title])=>button('english','readingRange',key,title,row.readingRange===key)).join('')}</div>`:''}<p>${esc(r.explanation)}</p><p class="language-reading-next">${esc(r.next)}</p><p class="language-caption">SR은 성적표의 GE만 이 범위에서 고릅니다. SS·PR·Lexile·ZPD는 다른 항목이므로 같은 숫자로 넣지 않습니다. AR·SR을 CARS 단계나 학원 반으로 환산하지 않습니다.</p><details><summary>AR·SR 숫자의 뜻</summary><p>AR Book Level(ATOS)은 글의 난도입니다. 관심 주제와 내용의 연령 적합성은 따로 살펴야 합니다. SR의 GE가 높아도 해당 학년의 모든 책을 독립적으로 읽는다고 단정하지 않습니다.</p><a href="https://www.renaissance.com/edword/atos/" target="_blank" rel="noopener">Renaissance · ATOS 안내</a> · <a href="https://star-help.renaissance.com/hc/en-us/articles/11584040642587-Grade-Equivalent-GE" target="_blank" rel="noopener">SR GE 안내</a></details></details>`;
}
function referenceControls(m,context){
 const reading=m.reading?`<div class="language-reading-summary"><strong>${esc(m.reading.summary)}</strong><p>${esc(m.reading.explanation)}</p></div>${g.PlannerReadingLibrary?.launcher(m.row)||''}${readingControls(m.row,context)}`:!m.foreign&&['middle','high'].includes(m.stage)?'<div class="language-reading-summary"><strong>내신과 수능 준비를 함께</strong><p>시험 기간에는 학교 범위에 비중을 두고, 평소에는 어휘·문법·독해·듣기·쓰기를 함께 이어갑니다.</p></div>':'';
 if(m.foreign)return reading;
 return `${reading}<details class="language-reference-choice"><summary>어떤 참고 과정을 살펴볼까요? · ${esc(m.referenceProfile?EN_REFERENCES[m.referenceProfile].label:'학년별 기본 과정')}</summary><p>아이에게 등급을 붙이는 선택이 아닙니다. 현재 읽기·어휘·표현과 감당할 공부량에 맞춰 비교해 보세요. 지역이나 다닌 학원만으로 과정을 정하지 않습니다.</p><div class="pathway-options language-reference-options">${Object.entries(EN_REFERENCES).filter(([key])=>context.grade!=='pre'||key!=='general').map(([key,item])=>button('english','referenceProfile',key,item.label,m.referenceProfile===key,item.description)).join('')}${m.row.referenceProfile&&context.grade!=='pre'?button('english','referenceProfile','standard','기존 학년별 과정 보기',false,'저장한 현재 공부와 보완 선택은 유지합니다.'):''}</div>${['middle','high'].includes(m.stage)?'<p class="language-caption">중등 이후에는 세 과정 모두 내신과 수능 대비를 함께 봅니다. AR·SR 목표를 대신 올리는 계획은 아닙니다.</p>':''}<details><summary>참고 과정은 어떻게 다른가요?</summary><p>상위권 과정은 원서와 어휘·표현을 넓히면서 초등 고학년에 문법 체계를 잡는 흐름입니다. 극상위권 과정은 영어 경험이 많은 학생이 독해 전략과 심화 어휘를 일찍 병행한 사례입니다. 책의 단계보다 지금 혼자 이해하고 표현하는 모습을 먼저 보겠습니다.</p><p>원서에서 학습 영어로 옮길 때도 읽기를 끊지 않고 문장 이해·어휘·쓰기 비중을 조정합니다. 어느 과정을 보더라도 아이의 나이와 감당할 공부량에 맞춰 이어가세요.</p></details></details>`;
}
function englishAcademyAdvice(m){
 if(!['early','primary','upper'].includes(m.stage))return '';
 return `<details class="language-academy-advice"><summary>영어 학원을 고르거나 계속 다닐 때, 무엇을 물어볼까요?</summary><p>원서를 많이 읽는다는 말만으로는 부족합니다. 지금 읽는 수준에서 어떤 문장을 배우고, 무엇을 직접 쓰며, 고친 내용을 다음 글에 써 보는지 확인해 보세요.</p><ul><li>“원서·어휘·문법이 같은 주에 어떻게 연결되나요? 이미 하는 교재와 겹치지는 않나요?”</li><li>“쓰기 숙제에 생각할 시간이 있나요? 첨삭 뒤 같은 글을 고치고 다음 글에도 적용하나요?”</li><li>“혼자 하는 숙제와 부모 도움이 필요한 숙제는 무엇인가요? 수학·독서·수면을 유지할 분량인가요?”</li><li>“읽기는 되는데 말이나 글로 설명이 안 되면, 수업에서 어떤 도움을 주나요?”</li></ul><details><summary>에디센 자료를 예로 살펴보면</summary><p>공식 교육과정에는 학년별 원서, 문법, Monthly Workbook의 프로젝트·쓰기가 함께 제시되어 있습니다. 초1~3과 초4~6의 원서 분량·자료 구성이 다르므로 해당 학년을 보시면 됩니다. 어휘 분량과 글쓰기 첨삭·재작성 횟수는 현재 반에 직접 확인하세요.</p><p>공식 FAQ는 숙제 소요 시간을 약 90분으로 안내하지만 개인차가 있고, 매일인지 회차별인지까지는 명시하지 않습니다. 우리 아이가 혼자 할 수 있는 분량을 물어보세요. 과거 재원 후기는 당시의 경험이며 지금 반의 운영과 같다고 보지 않겠습니다. 예비초1과 재학생의 입학 안내도 구분해 최신 공지를 확인하세요.</p><a href="http://www.edisen.co.kr/Edisen/Curriculum.asp" target="_blank" rel="noopener">공식 교육과정</a> · <a href="http://www.edisen.co.kr/Community/FAQ.asp" target="_blank" rel="noopener">공식 FAQ</a> · <a href="http://www.edisen.co.kr/EnterTest/Test_Notice.asp" target="_blank" rel="noopener">입학 공지</a></details></details>`;
}
function root(){return `<section class="language-entry" aria-label="영어와 국어도 함께 설계"><h3>영어·국어도 함께 살펴볼까요?</h3><div class="pathway-options">${Object.entries(SUBJECTS).map(([id,name])=>`<button type="button" data-language-open="${id}"><strong>${name} 현재 공부와 다음 과정</strong><span>${id==='english'?'학년별 표준 로드맵부터, 필요하면 맞춤 조정':'공부 모습에서 교재·월별 계획까지'}</span></button>`).join('')}</div></section>`;}
function heading(id,page){const name=SUBJECTS[id];return ({current:`${name}는 지금 어떻게 공부하고 있나요?`,standard:'학년별 표준 로드맵부터 살펴볼까요?',focus:`${name}에서 어떤 부분을 더 살펴볼까요?`,book:'어떤 교재·자료로 이어갈까요?',rhythm:'현재 시간 안에서 조정할까요?',summary:`${name} 계획을 함께 살펴보세요.`})[page]||`${name} 공부를 살펴봅니다.`;}
function help(value,id,page,context={}){const m=model(value,id,context);return page==='current'?(id==='english'?'지금 혼자 해내는 공부에 가장 가까운 모습을 골라 주세요. 현재 학년의 표준 로드맵을 먼저 보고, 필요한 보완은 그 위에 더하겠습니다.':'지금 혼자 해내는 공부에 가장 가까운 모습을 골라 주세요. 학년과 함께 보되, 실제 읽고 쓰는 범위에서 시작하겠습니다.'):page==='standard'?(m.foreign?'현재 학교 과정에 맞춘 기본 계획입니다. 학교 과제와 읽기·표현을 함께 이어가고, 필요하면 보완할 부분을 조정해 주세요.':'현재 학년부터 다음 학년까지 무엇을 함께 공부할지 먼저 보겠습니다. 이대로 이어가도 좋고, 우리 아이에게 필요한 부분만 조정해도 됩니다.'):page==='focus'?(id==='english'?'표준 로드맵은 그대로 이어갑니다. 더 도움이 필요한 부분을 골라 주시면 교재와 공부량을 조정하겠습니다.':m.course.talk):page==='book'?'교재는 맡길 역할이 분명해야 합니다. 아래에서 고른 책은 보완할 영역에 쓰고, 나머지 공부는 현재 교재로 이어갑니다.':page==='rhythm'?'현재 공부량으로 함께 이어갈지, 필요한 부분에 짧은 보완 시간을 더할지 골라 주세요.':m.ready?m.course.talk:'아직 고르지 않은 항목은 다음에 정해도 됩니다. 먼저 선택한 내용부터 지도에서 살펴보세요.';}
function choices(value,id,page='current',context={}){
 const m=model(value,id,context),n=navigation(value,id,page);if(!m)return '';const r=m.row;
 const options=n.page==='current'?CURRENT[id].map(([key,title])=>button(id,'current',key,title,r.current===key)).join(''):
 n.page==='standard'?`<button type="button" data-language-use-standard><strong>표준 로드맵으로 공부할게요</strong><span>교재의 역할과 학년별 과정을 그대로 이어갑니다.</span></button><button type="button" data-language-customize><strong>우리 아이에게 맞춰 조정할게요</strong><span>보완할 부분·교재·공부량만 조정합니다.</span></button>`:
 n.page==='focus'?Object.entries(ROUTES[id]).map(([key,item])=>button(id,'focus',key,item.observation,r.focus===key)).join(''):
 n.page==='book'?bookOptions(id,context,r.focus,r).map(b=>button(id,'book',b.id,b.title,r.book===b.id,b.note)).join(''):
 n.page==='rhythm'?[
  ['keep','현재 공부량으로 함께 이어가기','같은 교재의 어휘·읽기·쓰기를 연결하고, 주간 과제를 며칠로 나누겠습니다.'],
  ['extra','조금만 더하기 · 목표 주 2회, 회당 15분','첫 달 주 1회로 경험하고, 부담이 없으면 다음 달 주 2회로 늘립니다.'],
  ['exam','학교 시험 준비에 비중 더 두기','교과서·수업 자료·서술형을 우선하고, 시험 뒤에는 원래 독해·어휘 계획으로 돌아갑니다.']
 ].map(([key,title,sub])=>button(id,'rhythm',key,title,r.rhythm===key,sub)).join(''):
 `<button type="button" data-language-result>${id==='english'?(r.planMode==='standard'?'표준 로드맵 확인':'조정한 로드맵 확인'):'지도·월별 계획 살펴보기'} →</button>`;
 return `<nav class="language-subjects" aria-label="과목 바꾸기">${Object.entries(SUBJECTS).map(([key,name])=>`<button type="button" data-language-open="${key}" aria-pressed="${key===id}">${name}</button>`).join('')}</nav><p class="language-step">${n.index+1} / ${n.total} · ${LABELS[n.page]}</p><div class="pathway-options language-options">${options}</div>${id==='english'&&n.page==='current'?readingControls(r,context):''}<nav class="language-actions" aria-label="학습 설계 이동"><button type="button" ${n.previous?`data-language-page="${n.previous}"`:'data-flow-overview="home"'}>← ${n.previous?'이전':'전체 갈림길'}</button>${n.next&&n.page!=='standard'?`<button type="button" data-language-page="${n.next}"${n.canNext?'':' disabled'}>다음 →</button>`:''}<button type="button" data-language-later="${id}">다음에 생각하기</button></nav><details class="language-method"><summary>학년별 강조점과 병행 방법</summary><p>${esc(m.age)}</p><p>${id==='english'?'어휘·문법·독해·쓰기·듣기를 병행하고, 말하기도 현재 수업과 연결합니다. 문법을 모두 끝내야 독해를 시작하는 순서는 아닙니다.':'어휘·문장 이해·독해·문학·쓰기를 병행하고, 읽는 즐거움과 근거를 살피는 읽기를 함께 유지합니다.'}</p></details>`;
}
function questions(value,id,context={}){
 const m=model(value,id,context);if(!m)return [];const rows=[];
 if(m.route)rows.push({q:({foundation:'읽기 기초는 어디서 시작하면 좋을까요?',vocabulary:'외운 단어를 자꾸 잊는데 양을 늘려도 될까요?',sentence:'단어는 아는데 해석이 어색합니다. 무엇부터 볼까요?',evidence:'내용은 아는데 문제를 틀립니다. 어떻게 지도할까요?',writing:'읽기는 되는데 쓰기를 어려워하면요?',listening:'아는 단어인데 잘 안 들린다고 합니다.',transfer:'내신은 잘 보는데 낯선 지문이 어렵다면요?',summary:'읽은 내용을 길게 말하는데 요약이 안 됩니다.',literature:'줄거리 외에 무엇을 이야기하면 좋을까요?'})[m.row.focus],a:m.route.method+' '+m.route.practice+' '+m.route.check});
 if(id==='english'){
  if(context.grade==='pre'&&!context.foreignCalendar&&m.referenceProfile==='extreme'){
   rows.push({q:'6세 5월 B, 7세 5월 C까지 꼭 맞춰야 하나요?',a:'극상위권 참고 과정에 들어 있는 목표 시점입니다. 이미 그 시기가 지났다고 끝낸 것으로 보지는 않습니다. CARS에서 글과 질문을 이해하는지 확인하고, 놓친 전략은 같은 단계 STARS로 연습한 뒤 다음 단계로 이어가겠습니다.'});
   rows.push({q:'추천 교재를 전부 동시에 해야 하나요?',a:'아닙니다. 어휘·읽기·듣기·쉬운 문법·표현은 함께 하되, 같은 역할의 독해서는 한 권씩 이어가세요. 처음에는 지문과 질문을 같이 읽고 뜻과 답의 근거를 이야기해 주세요. 7세 어휘 다섯 권 중 세 권 이상도 한꺼번에 시작하는 뜻은 아닙니다.'});
  }
  rows.push({q:'원서를 그만두고 문법 학원으로 옮겨야 할까요?',a:'바로 끊을 필요는 없습니다. 읽던 책은 유지하면서 주어·동사, 시제, 수식 관계를 정확히 읽는지 보세요. 문법을 배우면 같은 구조로 짧게 영작해 봅니다. 지금 학원에서 이 연결과 피드백이 된다면 새 학원을 더하는 것보다 그 과정을 꾸준히 하는 편이 낫습니다.'});
  if(['primary','upper','middle'].includes(m.stage))rows.push({q:'책은 어려워지고 문법책도 싫어해요. 무엇부터 바꿀까요?',a:'원서를 모두 끊거나 어려운 책을 계속 밀어붙이기보다, 흥미와 이해가 맞는 책으로 읽는 시간을 지켜 주세요. 학습 교재는 짧은 지문 하나에서 어휘·문장 구조·내용을 연결하는 용도로 붙이겠습니다. 쉬운 책을 읽는 것과 필요한 문법을 배우는 것을 함께 해도 됩니다.'});
  if(['upper','middle','high'].includes(m.stage))rows.push({q:'해석은 했는데 무슨 말인지 모르겠다고 해요.',a:'문장마다 한국어로 바꾸었다고 글을 이해한 것은 아닙니다. 먼저 한 문장의 뜻을 자기 말로 풀고, 다음에는 문단의 주장·이유·예시를 연결해 보세요. 중등 이후에는 이 관계를 빈칸·순서·추론 문제와 조건 영작에 적용합니다. 어휘와 구문이 막힌 부분은 따로 짧게 보완하겠습니다.'});
  if(m.referenceProfile==='extreme'&&isPrimaryEnglish(context))rows.push({q:'초2 말 CARS E가 PEAI 입학 기준인가요?',a:'PEAI 재원 경험을 바탕으로 한 참고 사례입니다. 공식 입학 기준이나 우리 아이가 이미 마친 단계라는 뜻은 아닙니다. 현재 CARS에서 점검한 내용과 STARS 전략 연습을 확인한 뒤 D, E로 이어갈지 정하고, D의 시작 월은 고정하지 않습니다.'});
  rows.push({q:'AR 점수가 높으면 고등 영어 준비도 된 건가요?',a:'AR Book Level은 책의 난도이고, SR 성적표의 GE는 검사 수행을 규준과 비교한 값입니다. 문법·조건 영작·듣기나 국내 내신 등급으로 바로 바꿔 볼 수는 없어요. 처음 보는 글에서 문장 구조와 답의 근거를 설명하고, 주어진 조건에 맞게 쓰는 모습을 따로 확인해 주세요.'});
  if(['middle','high','upper'].includes(stage(context)))rows.push({q:'학교 영어 점수는 좋은데 왜 독해를 따로 해야 하나요?',a:'배운 지문과 범위를 잘 익힌 것은 강점입니다. 다만 고등에서는 낯선 지문과 바뀐 표현도 만나게 됩니다. 비내신 기간에 짧은 새 지문을 읽고 어휘 → 구문 → 문단의 흐름 → 답의 근거 순서로 막히는 곳을 찾아 주세요. 처음부터 어려운 한 회차를 전부 풀릴 필요는 없습니다.'});
  if(stage(context)==='middle')rows.push({q:'중2·중3이라면 고등 영어를 바로 시작해야 하나요?',a:'중등 문법을 배웠더라도 낯선 문장에 적용하는지 먼저 보겠습니다. 준비가 되면 고1 수준의 주제·목적·내용 일치부터 경험하고 순서·삽입·빈칸으로 넓힙니다. 기본 어휘나 문장이 흔들리면 그 부분을 먼저 채웁니다. 중3 마지막 학교 시험 뒤부터 입학 전까지는 부족한 영역을 다시 정리할 시간으로 잡아 주세요.'});
  if(m.course.young)rows.push({q:'아직 어린데 단어 시험과 문법책을 시작해야 하나요?',a:'지금은 소리와 글자를 연결해 혼자 읽는 힘부터 보겠습니다. 듣던 이야기에서 익숙한 표현을 읽고 말하거나 한 문장으로 써 보세요. 어려운 우리말 뜻을 외우느라 막힌다면 뜻을 쉬운 말과 예로 풀어 주세요. 긴 시험과 많은 암기량을 먼저 늘릴 필요는 없습니다.'});
 }else{
  rows.push({q:'책은 많이 읽는데 지문이나 문제 조건을 놓칩니다.',a:'독서량과 문제를 정확히 읽는 습관은 따로 챙겨야 합니다. 질문을 끝까지 읽고 ‘무엇을, 몇 가지, 어떤 조건으로’ 답해야 하는지 표시해 보세요. 답을 고른 뒤 지문에서 근거를 찾고, 틀린 선택지는 어느 말 때문에 틀렸는지 고쳐 보는 연습이 좋습니다.'});
  rows.push({q:'논술 수업을 듣는데 글쓰기를 더 해야 하나요?',a:'분량부터 늘리지 마세요. 수업에서 쓴 글을 첨삭받았다면 같은 글을 한번 고쳐 쓰고, 다음 주에는 도움을 줄여 새 글을 써 보겠습니다. 글자 수나 대회 실적보다 자기 생각과 수정 과정을 확인합니다.'});
  rows.push({q:'어려운 비문학 책은 한 주에 한 권씩 읽혀야 하나요?',a:'혼자 내용을 설명하기 어렵다면 읽을 분량을 여러 주로 나누세요. 한 부분을 읽고 핵심 문장에 표시한 뒤 원인·결과나 비교 관계로 정리합니다. 그다음 짧은 다른 지문에서도 같은 방식으로 읽어 보는 게 좋습니다. 긴 책을 빨리 끝내는 것만 목표로 잡지 않겠습니다.'});
 }
 if((m.appliedRhythm||m.row.rhythm)==='extra')rows.unshift({q:'영어·국어를 더 하면 다른 과목과 체력이 부담되지 않을까요?',a:'추가하는 것은 전체 수업이 아니라 약한 부분을 보는 짧은 시간입니다. 첫 달은 주 1회 15분, 부담이 없으면 다음 달부터 주 2회로 해 보겠습니다. 수학·과학·수면·휴식 시간을 자동으로 줄이지 않습니다. 숙제가 밀리거나 피곤해하면 추가 대신 현재 과제를 나누어 하는 방식으로 바꿉니다.'});
 if((m.appliedRhythm||m.row.rhythm)==='exam')rows.unshift({q:'시험 준비가 끝난 뒤에는 어떻게 이어가나요?',a:'실제 학교 시험 일정에 맞춰 교과서·수업 자료·서술형을 우선합니다. 시험 뒤에는 선택한 보완 학습으로 돌아가고, 틀린 원인이 단어인지 문장 구조인지부터 나눠 봅니다. 준비 기간에도 짧은 어휘 복습과 듣기는 남겨 주세요.'});
 if(m.foreign)rows.unshift({q:'해외 학교에서는 무엇을 계속 챙겨야 할까요?',a:'학교 과제를 중심으로 읽기·토론·발표·쓰기를 연결하면 됩니다. 글의 주장을 찾아 근거를 붙이고, 교사의 피드백으로 같은 글을 고쳐 보세요. 수업 지시가 어렵다면 학습 어휘와 질문하는 표현부터 연습합니다. 국내 시험 교재나 학년으로 일괄 환산하지 않습니다.'});
 return rows;
}
function renderQuestions(value,id,context={}){return `<section class="pathway-parent-questions language-questions"><h4>${SUBJECTS[id]} · 지금 선택에서 궁금한 점</h4>${questions(value,id,context).map(r=>`<details><summary>${esc(r.q)}</summary><p class="parent-answer">${esc(r.a)}</p></details>`).join('')}</section>`;}
function periodGuide(m){
 const en=m.id==='english',young=['early','primary'].includes(m.stage),applied=m.appliedRhythm||m.row.rhythm;
 const firstTitle=m.foreign?'학교 과제를 준비할 때':young?'학교 공부·일상 읽기':'학교 시험이 있을 때';
 const first=m.foreign?'학교에서 읽을 자료와 과제의 조건을 먼저 확인합니다. 필요한 표현을 읽고 들은 뒤 토론·발표·쓰기로 사용하고, 교사의 피드백으로 같은 글을 고칩니다.':en?(young?'학교나 현재 수업에서 읽는 이야기를 활용해 낱말·문장·내용을 함께 봅니다. 음원을 듣고 이야기한 뒤 짧게 써 보세요.':'교과서·수업 자료의 어휘, 핵심 문법, 조건 영작을 함께 준비합니다. 틀린 문장은 다시 써 보고 익숙한 어휘·듣기도 짧게 이어갑니다.'):'학교 작품·개념·평가 범위를 먼저 정리합니다. 선택지의 표현과 지문 근거를 대조하고, 서술형은 조건에 맞춰 써 봅니다.';
 const second=en?'읽던 책과 낯선 지문으로 돌아와 읽기·어휘·구문·듣기·쓰기를 병행합니다. 어려웠던 부분에 시간을 조금 더 쓰되 다른 영역을 중단하지 않습니다.'+(m.stage==='middle'?' 중3 마지막 학교 시험 뒤에는 입학 전까지 부족한 영역을 다시 정리합니다.':''):'읽을 책을 며칠에 나누고 문학·비문학·어휘를 병행합니다. 자기 글을 수정한 뒤 다른 글에서도 도움을 줄여 써 봅니다.';
 return `<section class="language-periods" aria-label="시기별 공부 방법"><div class="${applied==='exam'?'is-current':''}"><strong>${firstTitle}</strong><p>${first}</p></div><div class="${applied!=='exam'?'is-current':''}"><strong>${young?'여유가 있는 날·방학':m.foreign?'과제 부담이 적은 주·방학':'비내신 기간·방학'}</strong><p>${second}</p></div></section>`;
}
function weekly(m){
 if(m.id==='english'){
  const basic=m.course.foundation,reader=['primary','bridge'].includes(m.course.key),foreign=m.foreign;
  const steps=basic?[['읽고 듣는 공부','읽던 쉬운 책의 한 장면을 듣고 읽습니다. 자주 나오는 낱말의 소리·철자를 짚고 누가 무엇을 했는지 이야기해 주세요.'],['말하고 쓰는 공부','책의 문장을 따라 말하고 낱말을 바꿔 봅니다. 한 문장으로 자기 경험을 말한 뒤, 쓸 수 있는 만큼 적습니다.'],['복습하고 다시 적용','다시 읽을 때 도움을 줄이고, 비슷한 새 문장도 읽어 봅니다. 며칠 뒤 같은 표현을 떠올리는지 확인하세요.']]:reader?[['원서·듣기는 꾸준히','읽던 책과 음원을 이어갑니다. 줄거리뿐 아니라 인물의 행동과 이유도 이야기하고, 책에서 자주 만난 표현은 어휘 공부에 연결합니다.'],['문법·짧은 영작도 함께','현재 문법책에서 배운 구조를 독해에서 찾아보고 짧게 영작합니다. 문법을 모두 끝낸 뒤 독해로 넘어가는 순서가 아닙니다.'],['한 주의 공부를 연결','읽거나 들은 내용에서 핵심을 말하고 두세 문장으로 씁니다. 다음 공부에서는 배운 단어·표현을 다시 떠올리고 새 글에 써 봅니다.']]:foreign?[['학교 읽기·과목 어휘','학교 지정 읽기와 과목별 자료를 읽고 중심 내용을 정리합니다. 이해를 막는 개념어와 문장 구조를 함께 보완합니다.'],['듣기·토론·쓰기','수업을 들으며 메모하고 질문합니다. 같은 주제로 짧게 토론·발표하고 한 문단을 쓰되 학교 평가 기준을 확인합니다.'],['피드백을 다음 과제로','교사의 피드백으로 같은 글을 고치고, 다음 과제에는 도움을 줄여 적용합니다. 읽기와 어휘 복습도 계속합니다.']]:[['어휘·문법과 독해 병행','현재 어휘책과 문법책을 공부하면서 독해도 같은 주에 이어갑니다. 문법책에서 배운 구조를 지문에서 찾고, 새 단어는 문맥 속 뜻까지 확인합니다.'],['듣기·서술형도 함께','듣기 자료는 별도로 꾸준히 보되 놓친 표현을 대본과 비교합니다. 배운 문법으로 조건 영작을 하고, 독해 지문은 핵심을 짧게 요약해 봅니다.'],['새 진도와 복습 조정','이전 단어와 틀린 문장을 누적해서 복습합니다. 학교 시험이 가까우면 교과서·서술형 비중을 높이고, 시험 뒤에는 낯선 지문과 취약 유형으로 돌아옵니다.']];
  return `<section class="language-weekly language-integrated"><h4>영어는 같은 기간에 함께 공부합니다</h4><p class="language-caption">어휘·문법/구문·독해·듣기·쓰기를 따로 끝내는 과정이 아닙니다. 필요한 교재를 병행하되, 지금 수업과 숙제 안에서 서로 연결하고 약한 부분에 시간을 조금 더 씁니다.</p><ol class="language-week-bundle">${steps.map(([title,text])=>`<li><strong>${title}</strong><p>${text}</p></li>`).join('')}</ol><p class="language-speech">${m.appliedRhythm==='extra'?'기존 공부는 이어갑니다. 더하는 15분은 이번에 고른 약점을 보완하는 시간으로 쓰겠습니다.':'다섯 영역을 모두 새로 추가하는 것이 아닙니다. 현재 하고 있는 공부부터 확인하고, 빠진 부분을 같은 주 안에 연결하겠습니다.'}</p><details><summary>병행할 교재와 영역별 확인 기준</summary><div class="language-track-cards">${m.tracks.map(t=>`<article class="${t.selected?'is-selected':''}"><small>${esc(t.title)}${t.selected?' · 이번에 더 살필 부분':''}</small><strong>${esc(t.material)}</strong><p>${esc(t.check)}</p></article>`).join('')}</div></details></section>`;
 }
 return `<section class="language-weekly"><h4>읽기와 쓰기를 함께 이어가는 한 주</h4><p class="language-caption">현재 수업·숙제에 나누어 넣는 시작 예시입니다. 이미 하는 공부는 겹쳐 더하지 않고, 첫 2주에 분량을 맞춥니다.</p><div class="language-track-cards">${m.tracks.map(t=>`<article class="${t.selected?'is-selected':''}"><small>${esc(t.title)}${t.selected?' · 이번에 보완':''}</small><strong>${esc(t.weekly)}</strong><p>${esc(t.material)}</p><span>${esc(t.check)}</span></article>`).join('')}</div></section>`;
}
function checkpoints(m){return `<section class="language-checkpoints"><h4>무엇이 되면 다음으로 갈까요?</h4>${m.checkpoints.map(p=>`<div><strong>${esc(p.title)}</strong><small>${esc(p.date)}</small><p>${esc(p.text)}</p></div>`).join('')}<p class="language-caption">어려우면 교재 전체를 처음부터 반복하기보다 막힌 어휘·문장·유형을 골라 보완하고, 같은 난도의 새 자료에서 다시 확인합니다.</p></section>`;}
function later(m){if(!m.later.length)return '';return `<section class="language-next"><h4>그 뒤에도 공부가 끊기지 않도록</h4>${m.later.map(p=>`<div><small>${esc(p.date)}</small><strong>${esc(p.title)}</strong><p>${esc(p.text)}</p></div>`).join('')}</section>`;}
function monthly(m){if(m.id==='english')return englishTable(m);if(!m.phases.length)return '';
 const areas=m.tracks.map((t,idx)=>`<tr class="language-strand strand-${idx}"><th scope="row">${esc(t.title)}${t.selected?'<small>집중 보완</small>':''}</th>${t.items.map((item,i)=>`<td class="language-phase phase-${i%3}"><strong>${esc(item)}</strong><span>${esc(t.material)}</span></td>`).join('')}</tr>`).join('');
 const allTogether=m.id==='english'?`<tr><th scope="row">매달 함께 공부</th>${m.phases.map((p,i)=>`<td class="language-phase phase-${i%3}"><strong>어휘 · 문법/구문 · 독해 · 듣기 · 쓰기</strong><span>독해: ${esc(m.tracks.find(t=>t.id==='evidence').items[i])} · 배운 표현으로 말하고 쓰기</span></td>`).join('')}</tr>`:areas;
 const table=rows=>`<table class="language-table"><thead><tr><th scope="col">함께 이어갈 공부</th>${m.phases.map(p=>`<th scope="col">${esc(p.date)}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table>`;
 const plan=allTogether+`<tr><th scope="row">조금 더 살필 부분</th>${m.phases.map((p,i)=>`<td class="language-phase phase-${i%3}"><strong>${esc(p.title)}</strong><span>${esc(p.method)}</span></td>`).join('')}</tr><tr><th scope="row">교재·자료</th>${m.phases.map(()=>`<td>${esc(m.book?.title||'현재 교재 활용')}<span>${m.id==='english'?'선택한 보완 교재 + 현재 독해·어휘·듣기·쓰기 자료 병행':'현재 교과서·읽던 책과 함께'}</span></td>`).join('')}</tr><tr><th scope="row">학습량</th>${m.phases.map(p=>`<td>${esc(m.rhythm)}${m.row.rhythm==='extra'?`<span>추가 보완 · 주 ${p.extra===15?1:2}회, 총 ${p.extra}분</span>`:''}</td>`).join('')}</tr><tr><th scope="row">다음 확인</th>${m.phases.map(p=>`<td>${esc(p.review)}<span>${esc(p.check)}</span></td>`).join('')}</tr>`;
 return `<p class="language-caption">${m.id==='english'?'모든 달에 다섯 영역을 함께 공부합니다. 아래 일정은 영역을 교체하는 순서가 아니라, 그동안 더 살필 내용을 보여줍니다.':'어휘·문장 이해·독해·문학·쓰기가 같은 달에 함께 이어집니다.'}</p><div class="language-table-scroll" tabindex="0" role="region" aria-label="${m.name} 월별 학습 계획">${table(plan)}</div>${m.id==='english'?`<details><summary>같은 달에 함께 다루는 영역별 내용</summary><div class="language-table-scroll" tabindex="0" role="region" aria-label="영어 다섯 영역 동시 병행">${table(areas)}</div></details>`:''}`;
}
function englishGoal(p){return p.goal?`<p class="language-reading-goal"><small>독해 전략 목표${p.goalDate?' · '+esc(p.goalDate):''}</small><strong>${esc(p.goal)}</strong><span>CARS로 확인 · STARS로 연습</span>${p.goalContext?`<span>${esc(p.goalContext)}</span>`:''}${p.goalNote?`<span>${esc(p.goalNote)}</span>`:''}</p>`:'';}
function englishStageDetails(p){return englishGoal(p)+`<div class="language-track-cards">${EN_AREAS.map(([id,title])=>{const a=p.areas[id];return `<article><small>${title}</small><strong>${esc(a.material)}</strong><p>${esc(a.scope)}</p><span>${esc(a.method)}</span></article>`;}).join('')}</div>`;}
function englishBookShelf(m){
 const r=m.recommendations;
 return `<section class="language-book-shelf" aria-label="현재 공부에 맞는 추천 문제집"><div class="language-book-shelf-heading"><h4>추천 문제집</h4><span>${esc(r.label)}</span></div><p class="language-caption">${esc(r.note)}</p>${r.items.length?`<ul class="language-book-grid">${r.items.map((b,i)=>`<li><span class="language-book-role"><i aria-hidden="true">${String(i+1).padStart(2,'0')}</i>${esc(b.area)}</span>${b.url?`<a class="language-book-title" href="${esc(b.url)}" target="_blank" rel="noopener" aria-label="${esc(b.title)} 교재 안내, 새 탭">${esc(b.title)}<span aria-hidden="true">↗</span></a>`:`<strong class="language-book-title">${esc(b.title)}</strong>`}<p>${esc(b.use)}</p></li>`).join('')}</ul>`:''}${r.extra?`<details><summary>함께 살펴볼 교재</summary><p>${esc(r.extra)}</p></details>`:''}</section>`;
}
function englishTable(m){
 const periods=m.standardStages;
 return `<p class="language-caption">가로로 이어지는 칸은 학년·학기입니다. 모든 구간에서 다섯 영역을 함께 공부하며, 학기에 따라 더 살필 부분이 달라집니다. 교재는 역할을 보여 주는 예시이므로 같은 역할의 책을 모두 추가하지 않습니다.</p><div class="language-table-scroll" tabindex="0" role="region" aria-label="영어 학년별 표준 로드맵"><table class="language-table language-standard-table" style="--language-period-count:${periods.length}"><thead><tr><th scope="col">병행할 공부</th>${periods.map(p=>`<th scope="col">${esc(p.label)}<small>${esc(p.date)}</small></th>`).join('')}</tr></thead><tbody><tr class="language-emphasis"><th scope="row">이 시기의 중점</th>${periods.map((p,i)=>`<td class="language-phase phase-${i%3}"><strong>${esc(p.title)}</strong><span>${esc(p.talk)}</span>${englishGoal(p)}</td>`).join('')}</tr>${EN_AREAS.map(([id,title],idx)=>`<tr class="language-strand strand-${idx}"><th scope="row">${title}</th>${periods.map((p,i)=>`<td class="language-phase phase-${i%3}"><strong>${esc(p.areas[id].material)}</strong><span>${esc(p.areas[id].scope)}</span></td>`).join('')}</tr>`).join('')}<tr><th scope="row">다음 과정 전 확인</th>${periods.map(p=>`<td>${esc(p.check)}</td>`).join('')}</tr></tbody></table></div>`;
}
function englishMap(m){
 return `<div class="language-standard-landscape" tabindex="0" role="region" aria-label="영어 학년별 공부 지도"><ol class="language-standard-stops" aria-label="학년과 학기에 따라 이어지는 영어 공부">${m.standardStages.map((p,i)=>`<li class="${i===0?'is-current':''}"><span class="language-marker">${i===0?'현재':i+1}</span><small>${esc(p.label)}</small><strong>${esc(p.title)}</strong><time>${esc(p.date)}</time>${englishGoal(p)}<span class="language-concurrent">어휘 · 문법 · 독해 · 듣기 · 쓰기</span></li>`).join('')}</ol></div>`;
}
function englishAdjustment(m){
 if(m.planMode!=='custom')return `<p class="language-standard-status">학년별 표준 로드맵으로 이어갑니다. 현재 교재가 같은 역할을 하고 있다면 그대로 사용하세요.</p>`;
 return `<section class="language-custom-overlay"><h4>표준 로드맵에서 우리 아이에게 맞춘 부분</h4><dl class="language-records"><dt>더 살필 부분</dt><dd>${esc(m.route?.title||'아직 정하지 않음 · 표준 과정 유지')}</dd><dt>보완 교재</dt><dd>${esc(m.book?.title||'현재 교재에서 필요한 부분 활용')}</dd><dt>학습량</dt><dd>${esc(m.rhythm)}</dd></dl>${m.route?`<p>${esc(m.route.method)} ${esc(m.route.practice)}</p>`:''}${m.appliedRhythm==='extra'?'<p>추가 보완 시간은 첫 달 주 1회 15분으로 경험하고, 부담이 없으면 주 2회로 늘립니다. 기존 영어의 다섯 영역은 계속 함께 공부합니다.</p>':m.appliedRhythm==='exam'?'<p>학교 시험 기간에는 교과서·수업 자료·서술형에 비중을 더 두고, 시험 뒤에는 원래의 어휘·독해 계획으로 돌아갑니다. 짧은 복습과 듣기는 이어갑니다.</p>':'<p>별도 수업을 다섯 개 더하는 계획이 아닙니다. 현재 수업과 숙제 안에서 필요한 부분의 비중을 조정합니다.</p>'}</section>`;
}
function renderEnglish(value,context={},view='map'){
 const m=englishModel(value,context);if(!m.row.enabled)return '';
 const first=m.standardStages[0],header=`<header class="language-plan-heading"><div><small>영어 · 학년과 학기에 따라 이어지는 공부</small><h3>${esc(m.title)}</h3></div><button type="button" data-language-open="english" data-language-start="current">현재 공부 바꾸기</button></header>`;
 const current=`<p class="language-current">${esc(m.current)}</p><p class="language-parallel-label">어휘 · 문법/구문 · 독해 · 듣기 · 쓰기 병행 <span>학년별 방향을 먼저 보고, 필요할 때 우리 아이에게 맞춥니다.</span></p>${m.support?`<p class="language-foundation-note">${esc(m.support)}</p>`:''}`;
 const now=`<section class="language-current-period"><div class="language-period-heading"><div><small>${esc(first.date)}</small><h4>${esc(first.label+' · '+first.title)}</h4></div><span>다섯 영역 함께</span></div>${englishGoal(first)}${englishBookShelf(m)}<details><summary>교재를 함께 쓰는 방법과 다음 단계</summary><p class="language-speech">${esc(first.talk)}</p>${englishStageDetails(first)}<p class="language-caption">${esc(first.check)}</p></details></section>`;
 const stages=m.standardStages.length>1||m.later.length?`<details class="language-all-stages"><summary>다음 학년의 교재와 공부 방법까지</summary>${m.standardStages.slice(1).map(p=>`<details><summary>${esc(p.label+' · '+p.title)}</summary><p>${esc(p.date)} · ${esc(p.talk)}</p>${englishStageDetails(p)}<p class="language-caption">${esc(p.check)}</p></details>`).join('')}${later(m)}</details>`:'';
 let content;
 if(view==='table')content=englishTable(m)+now+englishAdjustment(m)+stages+`<details><summary>학교 공부와 비내신 기간의 운영</summary>${periodGuide(m)}${weekly(m)}</details>`;
 else if(view==='graph')content=`<p class="language-speech">영어는 학습 시간만으로 실력이나 등급의 상승선을 계산하지 않습니다. 같은 자리에서 학년별 공부 범위와 선택한 보완 계획을 비교해 보세요.</p>${englishMap(m)}${englishAdjustment(m)}${englishTable(m)}${now}${stages}`;
 else if(view==='map')content=englishMap(m)+now+englishAdjustment(m)+`<details class="language-standard-table-detail"><summary>학년·학기별 교재와 범위를 표로 보기</summary>${englishTable(m)}</details>${stages}<details><summary>한 주에 함께 공부하는 방법</summary>${weekly(m)}${periodGuide(m)}</details>`;
 else content=`<dl class="language-records"><dt>현재 공부</dt><dd>${esc(m.current)}</dd><dt>기준 로드맵</dt><dd>${esc(m.title)}</dd><dt>적용 방식</dt><dd>${m.planMode==='standard'?'표준 로드맵으로 공부':'표준 로드맵에 보완 계획 추가'}</dd></dl>${now}${englishAdjustment(m)}${englishTable(m)}${stages}`;
 return `<section class="language-plan" data-language-plan="english" data-language-plan-mode="${m.planMode}">${header}${current}${referenceControls(m,context)}${content}${englishAcademyAdvice(m)}<p class="language-caption">날짜는 해당 학년·학기의 공부 기간입니다. 교재 한 권의 완료일이나 성적을 약속하는 일정이 아니며, 학교 시험 일정과 실제 이해에 맞춰 분량을 조정합니다.</p>${m.book?`<details class="language-book-note"><summary>선택한 보완 교재를 활용할 때</summary><p>${esc(m.book.note)}</p>${m.book.source?`<a href="${SOURCES[m.book.source].url}" target="_blank" rel="noopener">${esc(SOURCES[m.book.source].title)}</a>`:''}</details>`:''}</section>`;
}
function render(value,id,context={},view='map'){
 if(id==='english')return renderEnglish(value,context,view);
 const m=model(value,id,context);if(!m?.row.enabled)return '';
 const header=`<header class="language-plan-heading"><div><small>${m.name} · 여섯 달의 공부와 다음 과정</small><h3>${esc(m.course.title)}</h3></div><button type="button" data-language-open="${id}" data-language-start="current">선택 바꾸기</button></header>`;
 const current=`<p class="language-current">${esc(m.current)}${m.book?' · '+esc(m.book.title):''}</p>${id==='english'&&m.route?'<p class="language-parallel-label">어휘 · 문법/구문 · 독해 · 듣기 · 쓰기 병행 <span>달라지는 것은 집중할 부분입니다.</span></p>':''}`;
 let content='';
 if(!m.route)content='<p>지금 가장 보완하고 싶은 부분을 고르면, 함께 공부할 영역과 월별 과정이 이어집니다.</p>';
 else if(view==='map')content=`${id==='english'?`<p class="language-caption"><strong>${esc(m.tracks.find(t=>t.selected)?.title||m.route.title)} 보완의 초점</strong><br>매달 다섯 영역을 함께 공부하며, 아래에는 이번에 더 살필 부분을 표시했습니다.</p>`:''}<div class="language-landscape"><ol class="language-stops"><li><span class="language-marker">현재</span><strong>${esc(m.course.title)}</strong><small>${esc(calendar(context))}</small><span>${esc(m.route.title)}</span></li>${[0,2,4].map((n,i)=>`<li><span class="language-marker">${i+1}</span><strong>${esc(m.phases[n].title)}</strong><small>${esc(m.phases[n].date)}<br>~ ${esc(m.phases[n+1].date)}</small><span>${esc(m.tracks.find(t=>t.selected)?.material||m.book?.title||'현재 교재 활용')}</span></li>`).join('')}</ol></div><p class="language-speech">${esc(m.course.talk)}</p>${weekly(m)}<details><summary>여섯 달의 영역별 과정 펼쳐 보기</summary>${monthly(m)}</details>${checkpoints(m)}${later(m)}<details><summary>학교 시험이 있을 때와 없을 때</summary>${periodGuide(m)}</details>`;
 else if(view==='table')content=`<p class="language-speech">${esc(m.course.talk)}</p>${monthly(m)}${weekly(m)}${periodGuide(m)}${checkpoints(m)}${later(m)}`;
 else if(view==='graph')content=`<p class="language-speech">${esc(m.rhythm)} · ${m.row.rhythm==='extra'?'추가하는 시간은 첫 달 주 15분, 이후 부담이 없을 때 주 30분입니다. 아래 다섯 영역 전체의 공부 시간이 아닙니다.':'현재 수업과 숙제 안에서 영역별 비중을 조정하는 계획입니다.'}</p><div class="language-load" aria-label="선택한 추가 학습 시간">${m.phases.map(p=>`<div><small>${esc(p.date)}</small><span class="language-load-track"><i style="width:${p.extra/30*100}%"></i></span><strong>${p.extra?'주 '+p.extra+'분 추가':'별도 시간 추가 없음'}</strong></div>`).join('')}</div><p class="language-caption">선택한 시간 계획입니다. 점수·실력 향상을 예측한 그래프가 아닙니다. 수학 진도 비교는 아래에서 그대로 볼 수 있습니다.</p>${monthly(m)}${checkpoints(m)}${later(m)}`;
 else content=`<dl class="language-records"><dt>현재 공부</dt><dd>${esc(m.current)}</dd><dt>보완할 부분</dt><dd>${esc(m.route.title)}</dd><dt>교재·자료</dt><dd>${esc(m.book?.title||'선택 전')}</dd><dt>학습량</dt><dd>${esc(m.rhythm)}</dd><dt>여섯 달 뒤</dt><dd>${esc(m.review)} · ${esc(m.course.next)}</dd></dl>${weekly(m)}${checkpoints(m)}${later(m)}`;
 return `<section class="language-plan" data-language-plan="${id}">${header}${current}${content}${m.route?`<p class="language-caption">여섯 달의 공부 계획입니다. 한 권을 끝내는 기간이나 다음 단계 이수를 확정한 일정은 아닙니다. 매달 확인한 이해에 맞춰 다음 범위를 조정합니다.</p>`:''}${m.book?`<details class="language-book-note"><summary>선택한 교재를 활용할 때</summary><p>${esc(m.book.note)}</p>${m.book.source?`<a href="${SOURCES[m.book.source].url}" target="_blank" rel="noopener">${esc(SOURCES[m.book.source].title)}</a>`:''}</details>`:''}</section>`;
}
g.PlannerLanguage=Object.freeze({SUBJECTS,STEPS,CURRENT,ROUTES,BOOKS,EN_STANDARD,EN_REFERENCES,READING_METRICS,READING_RANGES,standardPeriods,empty,restore,stage,choose,navigation,calendar,bookOptions,profile,model,root,heading,help,choices,questions,renderQuestions,render});
})(window);
