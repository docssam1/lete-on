// Read the recorded course, never the pupil's school grade or age.
const clean=t=>String(t||'').normalize('NFKC').replace(/[−–—－]/g,'-').replace(/\([^)]*(?:개정|\d{4}\s*년?)[^)]*\)/g,'').trim();
const labels={elementary:'초등',middle:'중등',high:'고등',unknown:'범위 확인 필요'};
function markers(t){
 const found=[];
 const re=/(초등학교|초등|초(?=\s*\d)|중학교|중등|중학(?!년)|중(?=\s*\d)|고등학교|고등|고교|고(?=\s*\d))\s*(?:수학\s*)?(\d{1,2})?(?:\s*학년|\s*과정)?(?:\s*-\s*([12])|\s*([12])\s*학기)?/g;
 for(const m of t.matchAll(re)){
  // A count such as "3권 중 2권째" is not a school-course marker.
  // Keep explicit semesters/grades; only exclude a number followed by a
  // book, step, item, page, repetition or unit counter.
  if(['중','고'].includes(m[1])&&m[2]&&!m[3]&&!m[4]&&!/학년/.test(m[0])&&/^\s*(?:권|단계|번|쪽|회|단원)/.test(t.slice(m.index+m[0].length)))continue;
  const level=m[1].startsWith('초')?'elementary':m[1].startsWith('중')?'middle':'high';
  const grade=m[2]?Number(m[2]):null,semester=Number(m[3]||m[4])||null;
  found.push({level,grade,semester,invalid:grade!==null&&(grade<1||grade>(level==='elementary'?6:3))});
 }
 if(!found.length&&/공통\s*수학|미적분|대수|확률\s*(?:과\s*)?통계|기하/.test(t))found.push({level:'high',grade:null,semester:null});
 return found;
}
export function parseCourseScope(course={}){
 const c=typeof course==='string'?{course}:course||{},name=clean(c.course),volume=clean(c.volume);
 const explicit=[...markers(volume),...markers(name)];
 if(explicit.some(x=>x.invalid)||/[1-6]\s*-\s*[12]\s*[/+~]\s*[12](?!\s*-)/.test(volume+' '+name))return {level:'unknown',grade:null,semester:null,label:'각 과정·학기 표기를 확인해 주세요',source:'recorded_scope',ambiguous:true};
 const levels=[...new Set(explicit.map(x=>x.level))];
 if(levels.length>1)return {level:'unknown',grade:null,semester:null,label:'서로 다른 과정이 함께 적혀 있어요',source:'recorded_scope',ambiguous:true};
 const bare=[...volume.matchAll(/(?:^|[^\d])([1-6])\s*-\s*([12])(?=$|[^\d])/g)].map(m=>({grade:Number(m[1]),semester:Number(m[2])}));
 const nameBare=[...name.matchAll(/(?:^|[^\d])([1-6])\s*-\s*([12])(?=$|[^\d])/g)].map(m=>({grade:Number(m[1]),semester:Number(m[2])}));
 const scoped=explicit.filter(x=>x.grade).map(x=>({grade:x.grade,semester:x.semester}));
 const ranges=[...scoped,...bare,...nameBare];
 const unique=[...new Map(ranges.map(x=>[`${x.grade}-${x.semester||''}`,x])).values()];
 // "중1" in the name and "1-1" in the volume refer to the same range.
 const specific=unique.filter(x=>x.semester),gradeOnly=unique.filter(x=>!x.semester&&!specific.some(y=>y.grade===x.grade));
 const distinct=[...specific,...gradeOnly];
 if(distinct.length>1)return {level:'unknown',grade:null,semester:null,label:'각 학기·과정을 나눠 확인해 주세요',source:'recorded_scope',ambiguous:true};
 let level=levels[0]||'unknown';
 if(level==='unknown'&&(bare.length||nameBare.length))level=['middle','high'].includes(c.level)?c.level:'elementary';

 const range=distinct[0]||{},grade=range.grade||null,semester=range.semester||null;
 if(grade&&grade>(level==='elementary'?6:3))return {level:'unknown',grade:null,semester:null,label:'과정과 학기 표기를 확인해 주세요',source:'recorded_scope',ambiguous:true};
 return {level,grade,semester,label:level==='unknown'?'범위 미입력·확인 필요':`${labels[level]}${grade?' '+grade+(semester?'-'+semester:'학년 과정'):' 과정'}`,source:explicit.length?'recorded_scope':(bare.length||nameBare.length)?'recorded_semester':level!=='unknown'?'recorded_level':'missing',ambiguous:false};
}

// Shared user policy for both short and optional detailed flows.
const policyTrackOf=c=>c.intakeTrack||(c.axis==='curriculum'?/심화/.test(c.depth||'')?'depth':'application':c.axis);
const policyTrackCourses=(s,key)=>(s.courses||[]).filter(c=>policyTrackOf(c)===key);
export function compareBookPolicy(s){
 const q=s.wizard?.quick||{},direction=q.learningDirection||'current',style=q.depthStyle||'unknown',drill=q.drillNeed||'unknown';
 // Optional depth plans add their existing comparison without changing the base pace.
 const wantsDepth=direction==='deepen'||['add_depth','depth_focus'].includes(s.wizard?.v10?.direction);
 const candidates=[],questions=[];
 const add=(axis,c,scope,title,text,bookKeys=[],confirmation=[])=>candidates.push({axis,courseId:c?.id||null,scope,title,text,bookKeys,confirmation});
 for(const axis of ['application','depth'])for(const c of policyTrackCourses(s,axis).filter(c=>c.completion!=='not_started')){
  const scope=parseCourseScope(c),label=axis==='depth'?'심화':'교과 개념·응용';
  if(scope.level==='unknown'){
   add(axis,c,scope,`${label} 범위부터 확인`,`${c.course} ${c.volume||''} 기록은 그대로 남겨 두고, 초등·중등 구분과 학기를 확인한 뒤 다음 교재를 비교해요.`,[],['학교 학년이나 교재 권 번호로 범위를 채우지 않아요.']);continue;
  }
  if(scope.level==='high'){
   add(axis,c,scope,`${scope.label}의 교재를 따로 비교`,`${label} 기록의 범위에 맞는 최근 풀이와 목적을 확인해요. 초등 교재 정책을 이 범위에 그대로 적용하지 않아요.`);continue;
  }
  if(scope.level==='middle'){
   add(axis,c,scope,drill==='yes'?'중등 문제 드릴 후보 · 쎈 중등 수학':'중등 범위의 학습과 드릴 필요를 확인',drill==='yes'?'기록한 중등 범위에서 유형·응용 문제 드릴이 많이 필요한 경우 쎈 중등 수학을 비교해요. 필요한 단계와 병행할 양은 최근 풀이를 보고 정해요.':drill==='no'?'기존 중등 과정을 이어가며 필요한 개념과 유형을 확인해요. 문제 드릴 교재를 추가할 필요는 따로 살펴봐요.':'중등 과정을 공부한다는 기록만으로 드릴 교재를 정하지 않아요. 많은 유형·응용 문제 연습이 필요한지 먼저 골라 주세요.',drill==='yes'?['ssen_middle']:[],drill==='unknown'?['문제 드릴 필요를 선택하면 중등 쎈 비교 후보를 볼 수 있어요.']:[]);continue;
  }
  if(axis==='application'){
   if(direction==='consolidate'){
    add(axis,c,scope,drill==='yes'?'초등 문제 드릴을 선택적으로 비교':'현재 초등 범위 꼼꼼히 다지기',drill==='yes'?'개념→응용→심화를 차근차근 공부하면서 유형·응용 문제 드릴이 많이 필요한 경우 초등 쎈도 비교할 수 있어요. 필요한 유형과 단계를 먼저 정해요.':'현재 교재의 필요한 개념·유형을 다시 살펴봐요. 일반 다지기만으로 새 드릴 교재가 정해지지는 않아요.',drill==='yes'?['ssen']:[],drill==='unknown'?['많은 문제 드릴이 필요한지는 선택해서 알려 주세요.']:[]);
   }else if(scope.grade!==null&&scope.grade>=3){
    add(axis,c,scope,'초3 과정부터 비교 · 디딤돌 응용','기록한 실제 초3 이상 과정에서는 기본+응용의 학습량을 고려해 디딤돌 응용을 다음 후보로 비교해요. 기본+응용은 기본 개념을 배우는 역할로 남기며 현재 기록을 바꾸지 않아요.',['didimdol_eungyong'],['필요한 개념 보완과 응용 범위는 최근 풀이를 보고 정해요.']);
   }else{
    add(axis,c,scope,'기본 개념 학습 · 디딤돌 기본+응용 비교','기본 개념 학습이 필요하면 디딤돌 기본+응용을 비교해요. 응용과 심화는 각자 기록한 범위로 이어갈 수 있어요.',['didimdol_application'],scope.grade===null?['정확한 학기를 확인하기 전에는 초3 과정 기준을 적용하지 않아요.']:[]);
   }
  }else{
   const bookKeys=style==='careful'?['didimdol_s']:style==='compact'?['didimdol_top']:['didimdol_s','didimdol_top'];
   add(axis,c,scope,style==='careful'?'유형별로 꼼꼼한 심화 · 최상위 S 비교':style==='compact'?'심화 분량·진행 방식 비교 · 최상위 수학':'심화 목적에 따라 S와 최상위 수학 비교',style==='careful'?'집에서 유형별로 꼼꼼하게 심화 학습을 하려면 최상위 S를 비교하거나 이어갈 수 있어요. 응용과 심화의 학기가 달라도 각 범위를 유지해요.':style==='compact'?'심화의 학습량을 고려해 조금 빠르게 진행하려는 경우 최상위 수학을 비교해요. 선택한 진행 방식은 실제 속도나 숙달을 판정한 결과가 아니에요.':'최상위 S는 유형별로 꼼꼼한 심화, 최상위 수학은 심화 분량과 진행 방식을 고려할 때 비교해요. S를 했다는 이유로 최상위로 자동 승급하지 않아요.',bookKeys,['현재 심화 교재·학기·완료 상태를 그대로 두고 다음 선택을 비교해요.']);
  }
 }
 if(wantsDepth&&!policyTrackCourses(s,'depth').some(c=>c.completion!=='not_started')){
  const elementary=policyTrackCourses(s,'application').some(c=>c.completion!=='not_started'&&parseCourseScope(c).level==='elementary');
  add('depth',null,{level:'unknown',grade:null,semester:null,label:'심화 범위 미입력',source:'missing',ambiguous:false},'심화는 원하는 범위를 따로 정하기','심화 기록이 없다는 것은 심화를 완료했다는 뜻이 아니에요. 응용을 먼저 이어가고 심화를 나중에 채우거나 서로 다른 학기를 병행할 수 있어요.'+(elementary?(style==='careful'?' 유형별로 꼼꼼하게 심화를 하려면 최상위 S를 비교해요.':style==='compact'?' 심화의 분량을 고려해 조금 빠르게 진행하려면 최상위 수학을 비교해요.':' 유형별로 꼼꼼한 심화는 최상위 S, 심화 분량과 진행 방식을 고려할 때는 최상위 수학을 비교해요.'):' 심화의 실제 범위를 먼저 확인해요.'),elementary?(style==='careful'?['didimdol_s']:style==='compact'?['didimdol_top']:['didimdol_s','didimdol_top']):[],['심화 학기와 풀이를 먼저 확인해요. 교과 범위를 심화 기록으로 복사하지 않아요.']);
 }
 if(!candidates.length)questions.push(s.wizard?.axisStatus?.application==='not_started'?'교과는 아직 따로 시작하지 않은 기록을 유지해요. 사고력·연산부터 이어가고, 교과나 심화를 시작할 때 범위를 더할 수 있어요.':'사고력·연산만 기록해도 계속할 수 있어요. 교과나 심화를 따로 공부했거나 시작하려 할 때 범위를 추가하면 교재 후보도 비교할 수 있어요.');
 if(style==='unknown'&&(wantsDepth||policyTrackCourses(s,'depth').length))questions.push('심화를 꼼꼼하게 할지, 분량과 진행 방식을 조절할지 선택할 수 있어요.');
 if(q.supportTime==='none'||q.supportTime==='brief')questions.push('알려주신 관리 시간에 맞춰 병행할 양과 도움이 필요한 부분을 확인해요. 관리 시간으로 교재 난도나 학습 능력을 정하지 않아요.');
 if(q.independentWork==='together')questions.push('함께 풀 때 필요한 도움과 혼자 해결하는 범위를 살펴보고 심화의 양을 정해요.');
 const bookKeys=[...new Set(candidates.flatMap(c=>c.bookKeys))];
 const title=({current:'지금 흐름을 두고 다음 후보 비교',faster:'실제 범위에서 더 빠른 진행 비교',consolidate:'지금 범위 다지기와 드릴 구분',deepen:'심화 범위와 운영 방식 비교'})[direction]||'공부하는 범위에 맞춰 교재 비교';
 return {title,text:candidates.length?'교과와 심화는 각각 기록한 과정으로 비교해요. 아래 후보는 현재 교재와 기록을 바꾸지 않습니다.':'입력한 학습 기록을 유지해요. 빈 교과·심화 기록을 학원 경험이나 학교 학년으로 채우지 않습니다.',bookKey:bookKeys[0],bookKeys,candidates,questions,source:'사용자 직접 발언 2026-10-05 교재 운용 정정 / 2026-10-10 초1·2 교과 없는 경로 정정',proposal:true};
}
