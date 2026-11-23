// Supported short responses and picture-only comparisons for the reviewed force workbook.
export const FORCE_GUIDED_VERSION='20261123-force-guided-tasks';
const unit='s31-u01',prior='6f61b8512dbe9647';
const review={
  "35": {
    "bankId": "s31-u01-v009",
    "bankBefore": [
      "5e9a1327760e8095",
      "3c9f31d56d08d977"
    ],
    "before": "ccfd36a3cdb95ce5",
    "prompt": "형과 동생이 받침점에서 같은 거리에 앉았더니 형 쪽이 내려갔어요. 형이 앉은 자리만 바꾸어 수평을 잡으려면 어떻게 옮기면 될까요?",
    "answer": "형이 받침점에 더 가까이 옮겨 앉아요.",
    "required": [
      "형이 받침점에 더 가까이 옮겨 앉는 방법"
    ],
    "explanation": "같은 거리에 앉았을 때 형 쪽이 내려갔으므로 형이 더 무거워요. 형이 받침점에 더 가까이 옮겨 앉으며 수평을 맞출 수 있어요. 한 번 옮겼다고 꼭 수평이 되는 것은 아니므로 양쪽 높이를 보며 조절해요.",
    "misconception": "이번에는 동생의 자리는 그대로 두고 형의 자리만 바꾸어요.",
    "lines": 1
  },
  "36": {
    "bankId": "s31-u01-v012",
    "bankBefore": [
      "297387fbd2a8db71"
    ],
    "before": "e6594fc6e5732878",
    "prompt": "생활에서 저울을 쓰는 경우 한 가지를 떠올려 보세요.",
    "parts": [
      "(1) 언제 저울을 쓰나요?",
      "(2) 그때 무엇의 무게를 재나요?"
    ],
    "answer": "(1) 빵을 만들 때 (2) 밀가루",
    "required": [
      "저울을 쓰는 상황 한 가지",
      "그 상황에서 무게를 재는 물체"
    ],
    "explanation": "빵을 만들 때 밀가루의 무게를 재거나, 우체국에서 소포의 무게를 잴 수 있어요. 언제 쓰는지와 무엇을 재는지가 이어지면 돼요. 다른 알맞은 생활 사례도 인정해요.",
    "misconception": "저울이라는 도구 이름 대신, 저울을 쓰는 때와 무게를 재는 물체를 써요.",
    "lines": 2
  },
  "37": {
    "bankId": "s31-u01-v028",
    "bankBefore": [
      "65804a1719fb3c75"
    ],
    "before": "f90ed52154c5bf0b",
    "prompt": "빈 판자의 수평을 맞췄어요. 판자와 받침대로 사과와 귤의 무게를 비교하려고 해요.",
    "parts": [
      "(1) 받침점에서 두 과일까지의 거리를 어떻게 해야 하나요?",
      "(2) 한쪽이 내려가면 어느 쪽 과일이 더 무겁나요?"
    ],
    "answer": "(1) 두 거리를 같게 해요. (2) 내려간 쪽 과일이 더 무거워요.",
    "required": [
      "받침점 양쪽의 같은 거리에 과일을 놓기",
      "내려간 쪽 과일이 더 무겁다는 설명"
    ],
    "explanation": "빈 판자가 수평인 상태에서 받침점 양쪽의 같은 거리에 사과와 귤을 하나씩 놓아요. 그때 내려간 쪽 과일이 더 무거워요. 먼저 놓을 거리를 정하고, 그다음 기울어진 모습을 읽어요.",
    "misconception": "받침점에서 두 과일까지의 거리가 다르면 기울어진 모습만으로 무게를 비교하지 않아요.",
    "lines": 2
  },
  "38": {
    "bankId": "s31-u01-v050",
    "bankBefore": [
      "9286711d005f46b3"
    ],
    "before": "a694206030729c7e",
    "prompt": "빈 판자의 수평을 맞춘 뒤, 두 주머니를 받침점 양쪽의 같은 거리에 놓아요.",
    "parts": [
      "(1) 판자는 어느 쪽으로 기울어질까요?",
      "(2) 두 주머니의 무게를 비교해 까닭을 짧게 써 보세요."
    ],
    "answer": "(1) 왼쪽 (2) 같은 거리에 놓인 왼쪽 주머니가 더 무거워요.",
    "required": [
      "판자가 왼쪽으로 기울어진다는 답",
      "같은 거리에 놓인 왼쪽 주머니가 더 무겁다는 까닭(수치를 쓰지 않아도 인정)"
    ],
    "explanation": "자료에서 왼쪽 주머니는 60 g, 오른쪽은 30 g이에요. 두 주머니가 받침점에서 같은 거리에 있으므로 더 무거운 왼쪽이 내려가요. 까닭에는 왼쪽이 더 무겁다는 뜻이 담기면 돼요.",
    "misconception": "두 주머니를 같은 거리에 놓았는지 살핀 뒤 무게를 비교해요.",
    "lines": 2
  },
  "39": {
    "bankId": "s31-u01-v058",
    "bankBefore": [
      "f8ca136ec05ecd38"
    ],
    "before": "da929980cc044506",
    "prompt": "지레를 이용한 생활 도구 한 가지를 떠올려 보세요.",
    "parts": [
      "(1) 도구의 이름을 쓰세요.",
      "(2) 무엇을 할 때 쓰는 도구인가요?"
    ],
    "answer": "(1) 병따개 (2) 병뚜껑을 딸 때 써요.",
    "required": [
      "지레를 이용한 도구 한 가지",
      "그 도구에 알맞은 쓰임"
    ],
    "explanation": "병따개는 병뚜껑을 딸 때, 장도리는 못을 뺄 때 쓸 수 있어요. 지레를 이용한 도구 이름과 그 쓰임이 알맞게 이어지면 돼요. 다른 타당한 도구와 쓰임도 인정해요.",
    "misconception": "도구 이름과 그 도구로 하는 일을 짝지어 생각해요.",
    "lines": 2
  },
  "40": {
    "bankId": "s31-u01-v067",
    "bankBefore": [
      "b7f6d11306c13109"
    ],
    "before": "b8b1fe28973d0caa",
    "prompt": "받침점에서 같은 거리에 앉자 할아버지 쪽이 내려갔어요. 할아버지는 그대로 앉아 있어요. 수평을 잡으려면 민수는 어느 쪽으로 자리를 옮기면 될까요?",
    "answer": "민수가 받침점에서 더 멀리 옮겨 앉아요.",
    "required": [
      "민수가 받침점에서 더 멀리 옮겨 앉는 방법"
    ],
    "explanation": "같은 거리에 앉았을 때 할아버지 쪽이 내려갔으므로 할아버지가 더 무거워요. 할아버지의 자리를 그대로 두면 가벼운 민수가 받침점에서 더 멀리 옮겨 앉으며 수평을 맞출 수 있어요. 양쪽 높이를 보며 조금씩 조절해요.",
    "misconception": "이번에는 할아버지는 그대로 있고 민수의 자리만 바꾸어요.",
    "lines": 1
  },
  "63": {
    "before": "42b44b1841325faa",
    "prompt": "㉡과 ㉢의 결과는 모두 수평이에요. 물체를 놓은 위치를 살펴보세요.",
    "parts": [
      "(1) 두 물체의 무게가 같다고 알 수 있는 기록의 기호를 쓰세요.",
      "(2) 그 기록을 고른 까닭을 한 문장으로 써 보세요."
    ],
    "answer": "(1) ㉢ (2) 받침점에서 같은 거리에 놓았을 때 수평이기 때문이에요.",
    "required": [
      "㉢을 고른 답",
      "같은 거리에서 수평이므로 무게가 같다는 설명"
    ],
    "explanation": "㉡은 가를 4번, 나를 2번에 놓아 받침점에서의 거리가 달라요. ㉢은 가와 다를 양쪽 3번의 같은 거리에 놓았을 때 수평이에요. 따라서 무게가 같다고 알 수 있는 기록은 ㉢이에요.",
    "misconception": "수평이라는 결과뿐 아니라 받침점에서 물체까지의 거리도 함께 살펴요.",
    "lines": 2,
    "topic": "같은 무게인 물체 찾기"
  },
  "64": {
    "before": "cc7732ac6a42b8ca",
    "prompt": "같은 상자를 직접 들어 올릴 때와 빗면을 따라 옮길 때 드는 힘을 비교하려고 해요.",
    "parts": [
      "(1) 두 방법에서 상자가 도착하는 높이는 어떻게 해야 하나요?",
      "(2) 두 방법에서 무엇을 비교하면 될까요?"
    ],
    "answer": "(1) 도착 높이를 같게 해요. (2) 상자를 옮기는 데 드는 힘을 비교해요.",
    "required": [
      "같은 도착 높이를 정하기",
      "상자를 옮기는 데 드는 힘을 비교하기"
    ],
    "explanation": "같은 상자를 같은 높이까지 옮기며 두 방법을 비교해요. 상자나 도착 높이가 다르면 방법 때문에 힘이 달라졌는지 알기 어려워요. 여기서는 직접 들 때와 빗면으로 옮길 때 드는 힘을 비교하면 돼요.",
    "misconception": "같은 상자와 같은 도착 높이에서 옮기는 방법을 바꾸어 비교해요.",
    "lines": 2
  },
  "76": {
    "before": "d5370218b6f7347e",
    "prompt": "모래주머니를 1개 실은 수레와 3개 실은 수레를 두 칸에 그리세요. 움직이기 시작할 때 더 큰 힘이 필요할 것으로 예상한 그림에 ★표 하세요.",
    "given": [
      "수레와 바닥, 당기는 방법은 같아요. 모래주머니는 모두 무게가 같아요."
    ],
    "answer": "한 칸에는 모래주머니 1개, 다른 칸에는 3개를 실은 수레를 그린다. 3개를 실은 수레 그림에 ★표 한다.",
    "required": [
      "같은 수레에 무게가 같은 모래주머니를 각각 1개와 3개 실은 두 그림",
      "3개를 실은 수레에 ★표"
    ],
    "explanation": "무게가 같은 모래주머니를 3개 실은 수레가 1개 실은 수레보다 더 무거워요. 같은 바닥에서 같은 방법으로 움직이기 시작할 때 더 큰 힘이 필요할 것으로 예상할 수 있어요. 두 그림을 그리고 3개 쪽에 ★표 하면 돼요.",
    "misconception": "수레나 바닥을 바꾸지 않고 실은 모래주머니의 수를 달리해요.",
    "drawingPanels": 2,
    "drawingExplanationLines": 0,
    "topic": "짐의 무게와 드는 힘"
  },
  "78": {
    "before": "a122bb01b558293b",
    "prompt": "자료의 ㉡을 판자 모양으로 그리세요. ‘가’, ‘나’, ‘받침점’ 이름표와 물체를 놓은 4번·2번 위치를 표시하세요.",
    "answer": "판자를 수평으로 그리고 받침점을 표시한다. 왼쪽 4번에는 가, 오른쪽 2번에는 나를 놓은 모습과 이름표를 그린다.",
    "required": [
      "수평인 판자와 받침점",
      "왼쪽 가 4번·오른쪽 나 2번의 배치와 이름표"
    ],
    "explanation": "㉡에서는 왼쪽 가를 4번, 오른쪽 나를 2번에 놓았을 때 수평이에요. 판자를 수평으로 그리고 두 물체의 위치와 이름을 표시해요. 번호가 클수록 받침점에서 멀다는 점도 그림에 맞게 나타내요.",
    "misconception": "가와 나의 위치를 바꾸어 그리지 않도록 자료에서 왼쪽과 오른쪽을 짚어요.",
    "drawingExplanationLines": 0
  },
  "80": {
    "topic": "상자를 올리는 두 방법",
    "before": "3eec074771e9bc2d",
    "prompt": "같은 상자를 같은 높이까지 올리는 두 방법을 그리세요. 한 칸에는 직접 들어 올리는 모습, 다른 칸에는 빗면을 따라 올리는 모습을 그리세요.",
    "given": [
      "두 그림에 상자가 도착하는 높이를 선으로 표시하세요."
    ],
    "answer": "직접 들어 올리는 모습과 빗면을 따라 올리는 모습을 한 칸씩 그린다. 같은 상자와 같은 도착 높이를 나타낸다.",
    "required": [
      "직접 들어 올리기·빗면을 따라 올리기의 두 그림",
      "같은 상자와 같은 도착 높이"
    ],
    "explanation": "두 그림의 상자와 도착 높이를 같게 하고 옮기는 방법을 다르게 나타내요. 직접 들 때는 위로 들어 올리고, 빗면을 쓸 때는 기울어진 면을 따라 올리는 모습을 그리면 돼요. 높이를 나타내는 선도 표시해요.",
    "misconception": "비교할 두 방법에서 상자와 도착 높이를 같게 나타내요.",
    "drawingPanels": 2,
    "drawingExplanationLines": 0
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const bankCache=new WeakMap(),bookCache=new WeakMap();
const levelRows=[{symbol:'㉡',left:'가',leftPosition:4,right:'나',rightPosition:2},{symbol:'㉢',left:'가',leftPosition:3,right:'다',rightPosition:3}];
const levelFigure='<table class="ed-table"><thead><tr><th scope="col">기록</th><th scope="col">왼쪽</th><th scope="col">오른쪽</th><th scope="col">결과</th></tr></thead><tbody>'+levelRows.map(r=>`<tr><th scope="row">${r.symbol}</th><td>${r.left} · ${r.leftPosition}번</td><td>${r.right} · ${r.rightPosition}번</td><td>수평</td></tr>`).join('')+'</tbody></table><p class="ed-given">빈 판자는 수평이고 양쪽 눈금 간격은 같아요. 번호가 클수록 받침점에서 멀어요.</p>';

const contract=(old,e)=>({...old,sample:e.answer,reviewRequired:true,rubric:{...old.rubric,required:[...e.required],pass:'뜻이 같은 짧은 답과 타당한 다른 예도 교사가 확인해요.'}});
export function forceGuidedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{
  const e=Object.values(review).find(e=>e.bankId===q.id);
  if(!e||q.status!=='authored'||q.sourceRef?.type==='original'||!e.bankBefore.includes(fingerprint(q)))return q;
  changed=true;if(bankCache.has(q))return bankCache.get(q);
  const result={...q,prompt:[e.prompt,...(e.parts||[])].join('\n'),answerContract:contract(q.answerContract,e),explanation:e.explanation,misconception:e.misconception,forceGuidedWriting:FORCE_GUIDED_VERSION,contentVersion:FORCE_GUIDED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};
  bankCache.set(q,result);return result;
 });return changed?next:rows;
}
export function withForceGuidedClassroom(u,mod){
 const items=forceGuidedItems(mod?.classroomItems,u);return items===mod?.classroomItems?mod:{...mod,classroomItems:items};
}
export function withForceGuidedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;
 if(bookCache.has(w))return bookCache.get(w);
 const questions=w.questions.map(q=>{
  const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;
  const fields={prompt:e.prompt,answer:e.answer,criteria:e.required.join(' / '),explanation:e.explanation,misconception:e.misconception,forceGuidedWriting:FORCE_GUIDED_VERSION};
  for(const key of ['topic','given','lines','drawingPanels','drawingExplanationLines'])if(Object.hasOwn(e,key))fields[key]=e[key];
  if(e.parts){fields.parts=[...e.parts];fields.answerPerPart=true;}
  if(q.no===63)fields.figure='force-guided-level-comparison';
  if(e.bankId){fields.sourceContract=contract(q.sourceContract,e);fields.sourceExplanation=e.explanation;}
  return{...q,...fields};
 });
 const cues={35:'형이 옮길 쪽을 손가락으로 가리켜 보아요.',37:'두 과일을 놓을 거리부터 짚고 기울어진 쪽을 살펴요.',39:'내가 고른 도구의 쓰임을 짝에게 말해 보아요.',63:'두 기록에서 받침점부터 물체까지의 거리를 짚어 보아요.',64:'같은 상자와 같은 도착 높이인지 짝과 확인해요.',76:'두 그림의 모래주머니 수와 ★표를 살펴보아요.',78:'받침점에서 가와 나까지의 거리를 자료와 맞춰 보아요.',80:'두 그림에서 상자와 도착 높이가 같은지 짚어 보아요.'};
 const titles={37:'놓을 거리와 기울기를 살펴요',39:'생활 도구와 수평을 알아봐요',63:'같은 무게인 물체를 찾아요',64:'같은 조건에서 힘을 비교해요',76:'짐의 무게와 드는 힘',78:'위치를 바꾸어 수평잡기',80:'두 방법을 그림으로 나타내요'};
 const pages=w.pages.map(p=>{
  const ids=p.blocks.flatMap(b=>b.ids||[]),no=Object.keys(cues).find(n=>ids.includes(unit+'-w'+n.padStart(3,'0')));
  if(!no)return p;
  return{...p,...(titles[no]?{title:titles[no]}:{}),...(['76','78','80'].includes(no)?{section:'그림으로 나타내기 '+no}:{}),rail:p.rail.map((n,i)=>{if(i!==2)return n;const{write,...note}=n;return{...note,text:cues[no]};})};
 });
 const quickPages=w.quickPages.map(p=>({...p,blocks:p.blocks.map(b=>b.type!=='table'?b:{...b,rows:b.rows.map(row=>{const q=questions.find(q=>String(q.no)===row[0]);if(q?.form==='draw')return[row[0],'그림으로 나타내기 · '+q.topic,row[2]];const e=review[Number(row[0])];return e?.topic?[row[0],row[1].split(' · ')[0]+' · '+e.topic,row[2]]:row;})})}));
 const ids=p=>p.blocks.length===1&&p.blocks[0].type==='questions'?p.blocks[0].ids:[];
 const packed=[];
 for(let i=0;i<pages.length;i++){
  const p=pages[i],first=ids(p).join(),nextPage=pages[i+1];
  if(first===unit+'-w035,'+unit+'-w036'&&ids(nextPage||{blocks:[]}).join()===unit+'-w037,'+unit+'-w038'&&ids(pages[i+2]||{blocks:[]}).join()===unit+'-w039,'+unit+'-w040'){
   packed.push({...p,section:'확인 35~37',title:'위치와 무게를 생각해요',blocks:[{type:'questions',ids:[35,36,37].map(n=>unit+'-w'+String(n).padStart(3,'0'))}]});
   packed.push({...nextPage,section:'확인 38~40',title:'힘과 도구를 알아봐요',blocks:[{type:'questions',ids:[38,39,40].map(n=>unit+'-w'+String(n).padStart(3,'0'))}],rail:p.rail.map((n,j)=>j===2?{...n,text:'도구의 쓰임과 민수가 옮길 쪽을 짝에게 말해 보아요.'}:nextPage.rail[j])});i+=2;
  }else if(first===unit+'-w063'&&ids(nextPage||{blocks:[]}).join()===unit+'-w064'){
   packed.push({...p,section:'확인 63~64',title:'같은 조건에서 비교해요',blocks:[{type:'questions',ids:[unit+'-w063',unit+'-w064']}],rail:p.rail.map((n,j)=>j===0?{...n,text:'무게를 비교할 때는 물체를 놓은 거리를 같게 해요. 옮기는 방법을 비교할 때는 상자와 도착 높이를 같게 해요.'}:j===2?{...n,text:'두 문제에서 같게 해야 하는 것을 손가락으로 짚어 보아요.'}:n)});i++;
  }else packed.push(p);
 }
 const figures={...w.figures,'force-guided-level-comparison':levelFigure};
 const result={...w,questions,pages:packed,teacherStudentPages:packed,quickPages,figures};bookCache.set(w,result);return result;
}
