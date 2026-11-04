/* Self observations and manual workload records. Test results are not inferred
 * from checks, page counts, attendance, or course completion. */
(function(g){
'use strict';
const C=g.PlannerCurriculum;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STATUSES={unknown:'아직 확인 전',unseen:'아직 배우지 않음',learning:'학습 중',independent:'혼자 설명·적용 가능',review:'복습 필요'};
const UNITS={session:'회차',unit:'단원',page:'쪽'};
// Individual checks retain the supplied subject slides' named concepts.
// The grouping/tier is a teaching sequence, not an official exam scope.
const DETAILS={
 integer:[
  ['약수와 배수','소수의 성질','메르센 소수·페르마 소수·쌍둥이 소수의 예','배수 판정법','나눗셈 정리','소인수분해의 유일성','양의 약수의 개수','양의 약수의 총합','유클리드 호제법','최대공약수의 성질'],
  ['합동식의 정의와 기본 성질','인수분해·식 변형으로 부정방정식 풀기','기수법','완전제곱수의 성질'],
  ['페르마의 작은 정리','오일러의 정리','중국인의 나머지 정리','윌슨의 정리','정수의 분할'],
  ['오일러 φ 함수','최대정수함수의 정의와 성질','p 지수의 성질','잉여계','무한강하법','고차 부정방정식']
 ],
 algebra:[
  ['인수분해와 식 변형','근과 계수의 관계','대칭식','교대식'],
  ['번분수','부분분수합','가비의 리','제곱근·산술·기하·조화평균 부등식'],
  ['정수값을 가지는 다항식','함수와 그래프','변형·대체·치환','미정계수법','코시법 (자료 표기)','수학적 귀납법','코시·슈바르츠 부등식','재배열 부등식','체비셰프 부등식'],
  ['쉬르 부등식','젠센 부등식','횔더 부등식','민코프스키 부등식','삼각함수의 덧셈정리','2배각·반각 공식','삼각함수의 합성','곱을 합·차로 바꾸는 공식','합·차를 곱으로 바꾸는 공식']
 ],
 geometry:[
  ['삼각형의 오심','피타고라스 정리','삼각형의 중점연결정리','원주각의 성질','원에 내접하는 사각형의 성질','네 점이 한 원 위에 있을 조건'],
  ['체바의 정리','메넬라우스의 정리','방멱의 정리','브리앙숑의 정리','톨레미의 정리','심슨의 정리','사인 정리','코사인 정리','보조선으로 관계 찾기'],
  ['파푸스의 중선정리','스튜어트의 정리','반 아우벨의 정리','몰리의 정리','평행이동·회전·대칭을 통한 등적변형','일정한 값에 대한 문제','덮어씌우기','공점선·오일러의 직선','공선점·뉴턴의 정리','공원점','존재 문제·귀류법·귀납법','염색 문제','구조성과 극단성'],
  ['에르되시·모델의 정리','나폴레옹의 삼각형','수족삼각형','오일러의 정리와 역정리','뒤란드의 문제 (자료 표기)','카르노의 정리','브라마굽타의 문제','뫼비우스의 문제','데자르그의 정리','파스칼의 정리','나비의 정리','삼각형 넓이의 여러 표현','바리뇽의 정리','포이어바흐의 정리']
 ],
 combinatorics:[
  ['합의 원칙','곱의 원칙','순열','조합','중복·누락 없이 경우 나누기'],
  ['같은 것을 포함한 순열','중복순열','중복조합','집합의 분할','대응 원리'],
  ['포함·배제의 원리','대칭성 원리','극단성 원리','비둘기집 원리','불변량'],
  ['분할과 분배','블록 문제','제2종 스털링 수']
 ],
 sequences:[
  ['수열의 유계성','수열의 단조성','수열의 주기성','법에 따른 주기수열','피보나치 수열'],
  ['점화수열의 부동점 방법','점화수열의 특성근법','점화수열의 소거법']
 ]
};
const TOPICS=C.AREAS.flatMap(a=>a.groups.flatMap((group,j)=>(DETAILS[a.id]?.[j]||group.items).map((title,i)=>({id:a.id+'-'+j+'-'+i,area:a.id,areaTitle:a.title,group:group.title,tier:group.tier,title}))));
const ids=new Set(TOPICS.map(t=>t.id));
function restore(v){
 const s={version:1,concepts:{},work:{},workMonth:null,reviewMonths:1,mock:g.PlannerMockEvidence?.restore(v?.version===1?v.mock:null)||{version:1,records:[]}};if(v?.version!==1)return s;
 if(/^(20\d\d|2100)-(0[1-9]|1[0-2])$/.test(v.workMonth||''))s.workMonth=v.workMonth;
 if(Number.isFinite(+v.reviewMonths)&&+v.reviewMonths>=.5&&+v.reviewMonths<=6)s.reviewMonths=+v.reviewMonths;
 for(const [id,status]of Object.entries(v.concepts||{}))if(ids.has(id)&&Object.hasOwn(STATUSES,status))s.concepts[id]=status;
 for(const [key,r]of Object.entries(v.work||{})){
  let p;try{p=JSON.parse(key);}catch{continue;}
  if(!Array.isArray(p)||p.length!==3||typeof p[0]!=='string'||p[0].length>300||!/^(20\d\d|2100)-(0[1-9]|1[0-2])$/.test(p[1])||!Object.hasOwn(UNITS,p[2]))continue;
  if(!Number.isInteger(r?.planned)||r.planned<1||r.planned>9999||!Number.isInteger(r.completed)||r.completed<0||r.completed>99999)continue;
  s.work[key]={planned:r.planned,completed:r.completed};
 }return s;
}
function choose(v,id,status){const s=restore(v);if(ids.has(id)&&Object.hasOwn(STATUSES,status))s.concepts[id]=status;return s;}
function saveWork(v,input,courses){
 const s=restore(v),planned=Number(input.planned),completed=Number(input.completed);
 if(!courses.includes(input.course)||!/^(20\d\d|2100)-(0[1-9]|1[0-2])$/.test(input.month||'')||!Object.hasOwn(UNITS,input.unit)||!Number.isInteger(planned)||planned<1||planned>9999||!Number.isInteger(completed)||completed<0||completed>99999)return{state:s,error:'교재·월·단위를 선택하고 계획 분량과 완료 분량을 정수로 입력해 주세요. 계획은 1 이상이어야 합니다.'};
 s.workMonth=input.month;s.work[JSON.stringify([input.course,input.month,input.unit])]={planned,completed};return{state:s,error:null};
}
function summary(v){const s=restore(v),counts=Object.fromEntries(Object.keys(STATUSES).map(k=>[k,0]));for(const t of TOPICS)counts[s.concepts[t.id]||'unknown']++;return{counts,total:TOPICS.length,recorded:TOPICS.length-counts.unknown,independentPercent:Math.round(counts.independent/TOPICS.length*100)};}
function workSummary(v,month){const groups={};for(const [key,r]of Object.entries(restore(v).work)){const [,m,unit]=JSON.parse(key);if(m!==month)continue;const row=groups[unit]||{unit,planned:0,completed:0,count:0};row.planned+=r.planned;row.completed+=r.completed;row.count++;groups[unit]=row;}return Object.values(groups).map(x=>({...x,percent:Math.round(x.completed/x.planned*100)}));}
function render(v,options={}){
 const s=restore(v),p=summary(s),stage=C.KMO.find(x=>x.id===options.stage),topics=TOPICS.filter(t=>(!options.area||t.area===options.area)&&(!stage||stage.areas.includes(t.area)&&t.tier<=stage.tier));
 return `<section class="learning-evidence"><header><h3>경시 개념 확인</h3><p>전체 ${p.total}개 중 기록 ${p.recorded}개 · 혼자 설명·적용 ${p.counts.independent}개 · 복습 필요 ${p.counts.review}개</p></header><p>실제로 새 문제를 풀고 이유를 설명하는 모습을 보고 기록하세요. 아래 비율은 체크 기록이며 테스트 점수나 자동 승급 판정이 아닙니다.</p>${C.AREAS.filter(a=>topics.some(t=>t.area===a.id)).map(a=>`<details${options.stage?' open':''}><summary>${esc(a.title)} · ${topics.filter(t=>t.area===a.id&&s.concepts[t.id]==='independent').length}/${topics.filter(t=>t.area===a.id).length}개 설명·적용</summary>${topics.filter(t=>t.area===a.id).map(t=>`<label class="concept-check"><span><strong>${esc(t.title)}</strong><small>${esc(t.group)}</small></span><select data-concept-check="${t.id}" aria-label="${esc(t.title+' 확인 상태')}">${Object.entries(STATUSES).map(([id,title])=>`<option value="${id}"${(s.concepts[t.id]||'unknown')===id?' selected':''}>${title}</option>`).join('')}</select></label>`).join('')}</details>`).join('')}<label class="concept-review-period">복습 확인 주기 · 개월<input type="number" min="0.5" max="6" step="0.5" data-concept-review-months value="${s.reviewMonths}"></label><p>복습 필요로 표시한 내용은 핵심 로드맵에 별도 복습 과정으로 연결합니다. 체크만으로 교재 완료나 다음 경시 단계 이수를 만들지는 않습니다.</p></section>`;
}
function renderWork(v,courses,month){
 const s=restore(v),groups=workSummary(s,month),records=Object.entries(s.work).filter(([key])=>JSON.parse(key)[1]===month);
 return `<section class="learning-evidence"><h3>월별 학습 수행률</h3><p>정한 분량 중 실제 마친 분량을 기록합니다. 같은 단위끼리 계산하며, 단원·회차·쪽수를 섞어 평균내지 않습니다.</p>${groups.map(r=>`<p><strong>${UNITS[r.unit]} 기준 ${r.percent}%</strong> · 계획 ${r.planned}${UNITS[r.unit]} / 완료 ${r.completed}${UNITS[r.unit]}</p>`).join('')||'<p>이 달의 수행 기록이 없습니다.</p>'}<form data-learning-work class="curriculum-form"><label>교재·과정<select name="course">${courses.map(c=>`<option>${esc(c)}</option>`).join('')}</select></label><label>기록할 월<input name="month" data-learning-work-month type="month" value="${month}" required></label><div class="curriculum-fields"><label>단위<select name="unit">${Object.entries(UNITS).map(([id,t])=>`<option value="${id}">${t}</option>`).join('')}</select></label><label>계획<input name="planned" type="number" min="1" max="9999" required></label><label>완료<input name="completed" type="number" min="0" max="99999" required></label></div><p role="alert" data-learning-error></p><button type="submit">수행 분량 기록</button></form>${records.length?`<details><summary>이번 달 기록 ${records.length}개</summary><ul>${records.map(([key,r])=>{const [course,,unit]=JSON.parse(key);return `<li>${esc(course)} · ${r.completed}/${r.planned}${UNITS[unit]} · <button type="button" data-work-remove="${esc(key)}">기록 삭제</button></li>`;}).join('')}</ul></details>`:''}<aside><h4>교과·사고력 권별 테스트 · 연동 준비 중</h4><p>현재는 수행 분량을 직접 기록합니다. 별도로 개발 중인 권별 테스트가 연결되면 응시 여부·결과·보완 범위와 학습 수행 기록을 함께 확인할 계획입니다. 아직 자동 테스트 결과를 가져오거나 점수를 계산하지 않습니다.</p></aside></section>`;
}
function attachReviews(m,v,months=null){
 const s=restore(v),topics=TOPICS.filter(t=>s.concepts[t.id]==='review');m=g.PlannerMockEvidence?.attach(m,s.mock)||m;if(!topics.length)return m;
 const n=months!==null&&Number.isFinite(+months)&&+months>0?+months:s.reviewMonths;
 const blocks=C.AREAS.filter(a=>topics.some(t=>t.area===a.id)).map(a=>({id:'concept-review-'+a.id,title:a.title+' · 체크한 개념 복습',start:0,end:n,full:n,guide:'intro',tasks:topics.filter(t=>t.area===a.id).map(t=>t.title).join(' / ')}));
 return{...m,lanes:[...m.lanes,{id:'conceptReview',title:'경시 개념 복습',current:topics.length+'개 복습 필요',blocks}],horizon:Math.max(m.horizon,n)};
}
g.PlannerLearningEvidence=Object.freeze({TOPICS,STATUSES,UNITS,restore,choose,saveWork,summary,workSummary,render,renderWork,attachReviews});
})(window);
