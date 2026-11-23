// Three independently authored workbook drawings: show the answer in the picture.
export const FORCE_DRAWING_VERSION='20261123-force-drawing-panels';
const unit='s31-u01',prior='514c1d98d4340e0a';
const review={
  75:{before:'04621785b2e64e6b',patch:{drawingPanels:2,
    prompt:'수레를 미는 모습과 당기는 모습을 나누어 그리세요. 손이 힘을 주는 방향을 화살표로 나타내세요.',
    answer:'수레를 미는 모습과 당기는 모습을 그리고, 각각 손이 힘을 주는 방향으로 화살표를 그린다.',
    explanation:'밀 때는 손이 수레를 향해 힘을 주고, 당길 때는 손잡이를 잡아 자기 쪽으로 힘을 주어요. 두 모습을 나누어 그리고 손이 힘을 주는 방향을 화살표로 나타내면 돼요.',
    criteria:'미는 모습과 당기는 모습 / 각 손이 힘을 주는 방향의 화살표. 그림 솜씨나 별도의 설명 글은 평가하지 않아요.',
    misconception:'물체를 미는 힘과 당기는 힘의 방향을 화살표로 구별해요.'
  },cue:'두 모습에서 손이 힘을 주는 방향을 손가락으로 따라가 보아요.'},
  77:{before:'b4e83983802cca11',patch:{
    prompt:'빈 판자의 수평을 맞췄어요. 두 물체의 무게를 비교하려면 어디에 놓아야 할까요? 판자와 받침대를 그리고, 두 물체를 놓을 위치를 표시하세요.',
    answer:'받침점을 중심으로 판자 양쪽의 같은 거리에 물체를 하나씩 놓은 모습을 그린다.',
    explanation:'물체를 놓기 전 빈 판자가 수평이어야 해요. 받침점에서 같은 거리인 양쪽 위치에 두 물체를 하나씩 놓으면 무게를 비교할 수 있어요. 이 문제는 비교할 수 있는 위치를 그림으로 나타내면 돼요.',
    criteria:'판자와 받침대 / 받침점 양쪽의 같은 거리에 놓인 두 물체. 그림의 배치로 확인하며 결과를 설명하는 글은 요구하지 않아요.',
    misconception:'받침점에서 물체까지의 거리가 서로 같아야 무게를 비교할 수 있어요.'
  },cue:'받침점에서 두 물체까지의 거리가 같은지 그림에서 짚어 보아요.'},
  79:{before:'d97824c9719dffdb',patch:{drawingPanels:3,
    prompt:'전자저울을 쓰는 순서를 세 장면으로 그리세요. 각 장면에 짧은 이름표를 붙이세요.',
    given:['담을 내용: 빈 저울의 0 확인 / 물체 올리기 / 숫자가 멈추면 값과 단위 읽기'],
    answer:'① 빈 저울의 0을 확인한다. ② 물체를 올린다. ③ 숫자가 더 바뀌지 않으면 값과 단위를 읽는다. 세 장면에 맞는 그림과 짧은 이름표를 붙인다.',
    explanation:'전자저울을 평평한 곳에 놓고 빈 저울이 0을 가리키는지 확인해요. 물체를 올린 뒤 표시된 숫자가 더 바뀌지 않으면 값과 단위를 함께 읽어요. 세 장면을 차례로 그리고 짧게 이름을 붙이면 돼요.',
    criteria:'0 확인 → 물체 올리기 → 숫자가 더 바뀌지 않을 때 값과 단위 읽기의 순서 / 각 장면의 짧은 이름표. 구체적인 측정값이나 별도의 설명 글은 요구하지 않아요.',
    misconception:'물체를 올리기 전 0을 확인하고, 숫자가 더 바뀌지 않을 때 값과 단위를 함께 읽어요.'
  },cue:'세 장면을 차례로 짚으며 짝에게 사용 순서를 말해 보아요.'}
};
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const cache=new WeakMap();
export function withForceDrawingWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;
 if(cache.has(w))return cache.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];return e&&q.id===unit+'-w'+String(q.no).padStart(3,'0')&&fingerprint(q)===e.before?{...q,...e.patch,drawingExplanationLines:0,forceDrawingReviewed:FORCE_DRAWING_VERSION}:q;});
 const pages=w.pages.map(p=>{
  const ids=p.blocks.flatMap(b=>b.ids||[]),entry=Object.keys(review).find(no=>ids.length===1&&ids[0]===unit+'-w'+no.padStart(3,'0'));
  return entry?{...p,section:'그림으로 나타내기 '+entry,rail:p.rail.map((n,i)=>{if(i!==2)return n;const{write,...note}=n;return{...note,text:review[entry].cue};})}:p;
 });
 const result={...w,questions,pages,teacherStudentPages:pages};cache.set(w,result);return result;
}
