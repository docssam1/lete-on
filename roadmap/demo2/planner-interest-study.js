/* 관심 활동의 교재 탐색. 실제 학년·진도·이수·성향 응답은 변경하지 않는다.
 * 교재 존재/학년: 출판사·EBS 공식 목록(2026-10-22 확인).
 * 활동별 개념과 공부 방법 연결은 GFIELD 편집 예시이며 교재 목차 인용이 아니다. */
(function(global){
const Z=global.PlannerInterests;
const sources=Object.freeze({didimdol:'https://www.didimdol.co.kr/search_result.asp',ebs:'https://primary.ebs.co.kr/book/main/list'});
const validGrade=g=>/^[1-6]$/.test(String(g??''))?String(g):null;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const topics={
 measure:['길이를 눈으로 비교하고 같은 물건을 단위 삼아 재어봐요. 비율식은 나중에 연결해도 괜찮아요.','cm와 m처럼 같은 단위로 길이를 비교해요. 비율식보다 재고 비교하는 경험부터 시작해요.','길이·들이·무게를 같은 단위로 나타내고 차이를 설명해요.','길이와 각도를 재고 단위가 같아야 비교할 수 있는 이유를 설명해요.','둘레와 넓이를 구분하고 같은 단위로 비교해요.','익숙한 수량을 비·비율로 나타내고 같은 관계인지 설명해요.'],
 shape:['주변에서 같은 모양과 다른 모양을 찾아 말로 설명해요.','도형을 만들고 나누며 모양의 특징을 찾아요.','선분과 각, 원처럼 배운 도형을 직접 그리고 비교해요.','각도와 삼각형·사각형의 특징을 그림으로 비교해요.','합동·대칭과 넓이의 관계를 종이 모형으로 살펴봐요.','입체도형과 전개도를 연결하고 겉넓이·부피의 뜻을 구분해요.'],
 reason:['색·모양의 반복을 찾고 다음에 올 것을 말해요.','수나 모양이 바뀌는 규칙을 말과 그림으로 설명해요.','간단한 규칙을 표로 정리하고 다른 예에서도 맞는지 살펴봐요.','표에서 수가 변하는 규칙을 찾고 예외가 있는지 비교해요.','약수·배수처럼 배운 개념을 이용해 가능한 경우를 나눠봐요.','여러 경우에서 같은 관계가 성립하는 이유와 성립하지 않는 예를 비교해요.'],
 order:['그림 카드를 순서대로 놓고 그대로 따라 해봐요.','“이럴 때는 이렇게”라는 조건을 그림 카드로 나눠봐요.','일의 순서를 말로 설명하고 빠진 단계를 찾아요.','조건에 따라 달라지는 순서를 표나 화살표로 나타내요.','여러 조건의 순서를 바꿨을 때 결과가 달라지는지 비교해요.','반복되는 절차를 간단히 나타내고 반례로 확인해요.'],
 experiment:['보고 만져본 특징을 그림과 말로 나타내요.','두 대상의 같은 점과 다른 점을 관찰해요.','관찰로 알아볼 질문을 고르고 예상과 실제 모습을 비교해요.','바꿀 조건과 같게 둘 조건을 나누고 관찰한 것을 비교해요.','비교 조건을 정하고 여러 번 관찰한 결과를 정리해요.','반복 관찰한 자료에서 차이가 생긴 이유와 설명의 한계를 살펴봐요.'],
 data:['물건을 한 기준으로 나누고 개수를 비교해요.','간단한 표와 그림으로 수량을 나타내요.','표와 그림그래프에서 알 수 있는 내용을 말로 설명해요.','막대·꺾은선그래프의 눈금과 변화를 읽어요.','여러 자료를 표로 정리하고 평균 같은 대표값의 뜻을 살펴봐요.','비율을 나타내는 그래프를 읽고 자료가 뒷받침하는 설명인지 살펴봐요.'],
 write:['그림을 보고 낱말이나 짧은 문장으로 이야기해요.','순서에 맞게 짧은 글을 쓰고 소리 내어 읽어요.','핵심 내용을 자신의 말로 요약하고 그 이유를 덧붙여요.','사실과 생각을 구분하고 예를 들어 설명해요.','전하려는 내용에 맞는 근거를 골라 문단으로 정리해요.','서로 다른 자료를 비교하고 근거와 출처를 밝혀 설명해요.']
};
function leafOf(trail){const p=Z.normalize(trail);return p.length===3&&Z.nodes[p[2]]?.subjects?p[2]:null;}
function books(leaf,grade){
 const g=validGrade(grade);if(!Object.hasOwn(topics,leaf)||!g)return [];
 const science=leaf==='experiment',writing=leaf==='write',subject=science?(+g<3?'통합교과':'과학'):writing?'국어':'수학';
 const rows=[{id:'school',title:`학교 ${subject} 교과서·수업 자료`,summary:'이미 쓰는 교재에서 관련 부분을 찾아요. 국제학교에서는 현재 학교 수업 자료를 그대로 쓸 수 있어요.',why:'새 교재를 더하기 전에 배운 내용과 활동을 연결해 볼 수 있어요.',use:'목차와 수업 내용을 보고 이번 활동과 닿는 부분을 골라요. 관련 단원이 없으면 선생님과 범위를 살펴봐요.'}];
 if(science&&+g<3)rows.push({id:'picture',title:'집이나 도서관의 자연 관찰 그림책',summary:'함께 그림을 보며 특징을 말하고 비교해요.',why:'글을 많이 쓰기보다 관찰한 것을 표현하는 데 집중할 수 있어요.',use:'아이가 그림과 짧은 설명을 이해할 수 있는 책을 함께 골라요. 특정 책을 꼭 구입할 필요는 없어요.'});
 else rows.push({id:'ebs',title:`EBS 만점왕 ${subject} · ${g}학년`,summary:'1·2학기 중 학교에서 배우는 범위와 관련된 단원을 살펴봐요.',why:'교과 내용을 다시 확인하며 활동에 필요한 말과 개념을 찾아볼 수 있어요.',use:'현재 쓰는 책의 목차에서 관련 부분만 골라요. 한 권 전체를 추가 과제로 정하지 않아도 괜찮아요.',source:sources.ebs,sourceLabel:'EBS 공식 교재 목록'});
 if(!science&&!writing)rows.push({id:'didimdol',title:`디딤돌 초등수학 기본+응용 · ${g}학년`,summary:'배운 개념을 확인한 뒤 관련 응용 문제를 골라봐요.',why:'기존 로드맵의 초등 교과 교재 후보예요. 활동과 관련된 개념을 문제에 적용해 볼 때 살펴봐요.',use:'개념 설명을 이해할 수 있는지 먼저 살펴보고 관련 문제를 골라요. 부담이 크면 학교 교재에서 다시 시작해요.',source:sources.didimdol,sourceLabel:'디딤돌 공식 교재 목록'});
 return rows.map(b=>({...b,grade:g,focus:topics[leaf][+g-1]}));
}
const methodText={
 measure:[['draw','그림으로 재고 설명하기','물건이나 선을 나란히 그리고 같은 단위로 재어봐요.','측정한 값을 그림과 식으로 나타내고 단위를 바꾸면 무엇이 달라지는지 설명해요.'],['compare','방법을 바꿔 비교하기','다른 물건을 단위로 재어 보고 왜 수가 달라지는지 이야기해요.','같은 길이나 수량을 두 방법으로 나타내고 계산과 실제 비교가 맞는지 확인해요.']],
 shape:[['draw','종이 모형으로 설명하기','종이를 접고 오리거나 모양을 붙이며 특징을 말해요.','그림·종이 모형·식을 오가며 모양의 성질과 크기의 관계를 설명해요.'],['compare','모양을 바꿔 비교하기','도형을 돌리거나 나누고 같은 점을 찾아요.','한 조건을 바꾼 도형을 그리고 변하는 것과 그대로인 것을 비교해요.']],
 reason:[['draw','표와 그림으로 규칙 찾기','색·모양·수의 변화를 그리거나 놓으며 규칙을 말해요.','여러 경우를 표로 정리하고 규칙이 맞는 이유를 말과 식으로 설명해요.'],['compare','다른 경우에서도 확인하기','찾은 규칙으로 다음 것을 만들고 맞는지 확인해요.','조건이 다른 예와 반례를 찾아 어디까지 맞는 설명인지 확인해요.']],
 order:[['draw','순서 카드로 따라 해보기','한 단계씩 그림 카드로 놓고 친구가 따라 하게 해요.','조건과 순서를 표·화살표로 나타내고 다른 사람이 그대로 실행해 봐요.'],['compare','조건 하나 바꿔보기','카드 하나의 자리를 바꾸고 결과를 비교해요.','조건이나 순서 하나를 바꾸고 예상과 실제 결과가 어떻게 달라지는지 비교해요.']],
 experiment:[['draw','관찰 그림으로 비교하기','눈으로 본 특징을 그림으로 그리고 같은 점과 다른 점을 말해요.','바꿀 조건과 같게 둘 조건을 나눠 그림과 표로 관찰 내용을 정리해요.'],['compare','예상과 관찰 비교하기','관찰 전 생각과 실제로 본 것을 나누어 이야기해요.','같은 조건에서 다시 관찰하고 예상과 다른 결과의 이유를 살펴봐요.']],
 data:[['draw','표와 그래프로 설명하기','물건을 나누고 수량을 표나 그림으로 나타내요.','자료를 표와 그래프로 나타내고 눈금·단위·대표값이 뜻하는 바를 설명해요.'],['compare','표현을 바꿔 읽어보기','같은 자료를 다르게 놓고 무엇이 잘 보이는지 말해요.','같은 자료의 그래프나 눈금을 바꾸고 강조되는 점과 오해할 수 있는 점을 비교해요.']],
 write:[['draw','말한 뒤 글로 옮기기','그림을 보며 말한 것을 짧은 문장으로 옮겨요.','핵심 내용과 근거를 먼저 말한 뒤 문단으로 정리하고 소리 내어 읽어요.'],['compare','두 설명을 비교하기','같은 그림을 설명한 두 문장을 읽고 더 잘 전해지는 말을 골라요.','두 글의 설명과 근거를 비교하고 빠진 정보나 고칠 표현을 찾아요.']]
};
function methods(leaf,grade){const g=validGrade(grade);if(!g||!Object.hasOwn(methodText,leaf))return [];return methodText[leaf].map(([id,title,lower,upper])=>({id,title,steps:[+g<=3?lower:upper,'고른 교재에서 닿는 부분을 찾아보고, 막힌 개념은 다시 읽거나 도움을 받아요.',+g<=3?'무엇을 알게 됐는지 말이나 그림으로 남기고 다른 예에서 다시 해봐요.':'방법이 맞는 이유와 아직 설명하기 어려운 점을 나누고 다른 예에서 확인해요.']}));}
function restore(value,trail,currentGrade){
 const path=Z.normalize(trail),leaf=leafOf(path),signature=path.join('/'),current=validGrade(currentGrade);
 if(!leaf)return {version:1,path:signature,leaf:null,grade:null,gradeSource:null,book:null,method:null};
 const v=value?.version===1&&value.path===signature?value:{};
 const selected=v.gradeSource==='selected'&&validGrade(v.grade),grade=selected?validGrade(v.grade):current,gradeSource=grade?(selected?'selected':'current'):null;
 const same=v.grade===grade,book=same&&books(leaf,grade).some(b=>b.id===v.book)?v.book:null;
 const method=book&&methods(leaf,grade).some(m=>m.id===v.method)?v.method:null;
 return {version:1,path:signature,leaf,grade,gradeSource,book,method};
}
function choose(value,trail,currentGrade,kind,id){
 const v=restore(value,trail,currentGrade);if(!v.leaf)return v;
 if(kind==='grade'&&validGrade(id)){const grade=validGrade(id);return {...v,grade,gradeSource:'selected',book:grade===v.grade?v.book:null,method:grade===v.grade?v.method:null};}
 if(kind==='book'&&books(v.leaf,v.grade).some(b=>b.id===id))return {...v,book:id,method:id===v.book?v.method:null};
 if(kind==='method'&&v.book&&methods(v.leaf,v.grade).some(m=>m.id===id))return {...v,method:id};
 return v;
}
function detail(value,trail,currentGrade){const v=restore(value,trail,currentGrade);return {...v,title:v.leaf?Z.nodes[v.leaf].title:'',focus:v.grade&&v.leaf?topics[v.leaf][+v.grade-1]:'',books:books(v.leaf,v.grade),bookInfo:books(v.leaf,v.grade).find(b=>b.id===v.book)||null,methods:methods(v.leaf,v.grade),methodInfo:methods(v.leaf,v.grade).find(m=>m.id===v.method)||null};}
function points(value,trail,currentGrade){const d=detail(value,trail,currentGrade);if(!d.grade)return [];const out=[{id:'grade',label:'교재 참고 학년',title:'초'+d.grade+' 기준',summary:d.gradeSource==='current'?'현재 선택한 학년을 참고했어요.':'교재를 살펴볼 기준이에요. 실제 학년은 바꾸지 않아요.'}];if(d.bookInfo)out.push({id:'books',label:'살펴볼 교재',title:d.bookInfo.title,summary:d.focus});if(d.methodInfo)out.push({id:'methods',label:'해볼 공부 방법',title:d.methodInfo.title,summary:d.methodInfo.steps[0]});return out;}
function renderTrail(value,trail,currentGrade){const rows=points(value,trail,currentGrade);if(!rows.length)return '';return `<section class="pathway-trail interest-trail study-trail" aria-labelledby="interestStudyTrailTitle"><div class="pathway-heading"><h3 id="interestStudyTrailTitle">교재와 공부 방법</h3><p>관심 활동에서 직접 이어본 공부예요. 실제 진도와는 따로 살펴봐요.</p></div><ol>${rows.map(p=>`<li><button type="button" data-study-open="${p.id}"><span class="pathway-point" aria-hidden="true"></span><small>${esc(p.label)}</small><strong>${esc(p.title)}</strong><span class="pathway-point-summary">${esc(p.summary)}</span></button></li>`).join('')}</ol></section>`;}
function renderQuestions(value,trail,currentGrade){const d=detail(value,trail,currentGrade);if(!d.grade)return '';const rows=[['고른 교재를 새로 사야 하나요?','학교나 집에 있는 교재로 먼저 살펴봐도 괜찮아요. 다른 교재는 같은 개념을 더 확인하고 싶을 때 비교할 후보예요. 학기와 개정판은 현재 수업 범위에 맞춰 확인해요.'],['이미 선행 중이면 이 학년 교재로 돌아가야 하나요?','여기서 고른 학년은 활동과 공부를 연결해 보는 참고예요. 실제 선행 진도는 그대로 두고 필요한 개념만 확인할 수 있어요. 교재 기준을 바꿔도 현재 학년·진도·일정은 바뀌지 않아요.'],['국제학교의 Grade·Year도 같은 학년으로 보면 되나요?','한국 교과의 교재 학년과 Grade·Year를 자동으로 맞추지 않아요. 현재 학교 수업 자료로 시작하거나, 한국 교재를 비교할 때만 참고 학년을 골라요. 학교 범위와 읽기 언어도 함께 살펴봐요.']];return `<section class="pathway-parent-questions" aria-labelledby="interestStudyQuestionsTitle"><h3 id="interestStudyQuestionsTitle">교재와 방법을 고를 때 궁금한 점</h3><div>${rows.map(([q,a])=>`<details><summary>${esc(q)}<span aria-hidden="true">+</span></summary><div class="parent-answer"><p>${esc(a)}</p></div></details>`).join('')}</div></section>`;}
global.PlannerInterestStudy=Object.freeze({sources,validGrade,leafOf,books,methods,restore,choose,detail,points,renderTrail,renderQuestions});
})(window);
