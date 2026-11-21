// Version the existing clarified classroom copies without changing the raw paired bank.
export const CLASSROOM_QUESTION_VERSION='20261108-classroom-review-versions';
const entries={
  "s31-u01": {
    "s31-u01-v020": {
      "previousPrompt": "같은 병의 뚜껑을 손과 병따개로 각각 열어 본 관찰이에요. 지레의 도움을 잘못 설명한 것은 무엇인가요?",
      "previousVersion": 1,
      "currentFields": {
        "prompt": "같은 조건의 병뚜껑을 손으로 열 때보다 병따개로 열 때 힘이 덜 들었어요. 이 관찰과 맞지 않는 설명은 무엇인가요?",
        "explanation": "제시한 관찰에서는 같은 조건의 병뚜껑을 열 때 병따개를 쓰니 손에 드는 힘이 덜 들었어요. 따라서 더 큰 힘이 필요했다는 셋째 설명이 관찰과 맞지 않아요. 이 관찰의 힘 차이를 읽으며 도구가 무게를 재었다는 뜻으로 바꾸지 않아요."
      }
    }
  },
  "s31-u02": {
    "s31-u02-v003": {
      "previousPrompt": "세 관찰 카드에 모두 표시할 수 있는 특징은 무엇입니까?",
      "previousVersion": 1,
      "currentFields": {
        "prompt": "성충 개미·나비·잠자리 관찰 카드에 모두 표시할 수 있는 특징은 무엇입니까?",
        "givens": {
          "지문": "성충 개미 카드 / 성충 나비 카드 / 성충 잠자리 카드\n세 동물의 몸 생김새에서 공통된 특징을 찾는다."
        },
        "explanation": "성충 개미·나비·잠자리의 몸을 비교하면 머리·가슴·배가 구분돼요. 깃털·먹이·다리 없는 움직임은 세 동물의 공통점이 아니에요. 성충의 모습을 어린 시기까지 같다고 넓히지 않아요."
      }
    },
    "s31-u02-v012": {
      "previousPrompt": "잠자리 관찰표에 잘못 적은 내용 하나를 찾아 고르시오.",
      "previousVersion": 1,
      "currentFields": {
        "prompt": "성충 잠자리 관찰표에 잘못 적은 내용 하나를 찾아 고르시오.",
        "explanation": "성충 잠자리는 두 쌍의 날개와 세 쌍의 다리가 있지만 깃털로 덮여 있지는 않아요. 날개가 있다는 공통점만으로 새의 깃털 특징까지 옮겨 쓰면 안 돼요."
      }
    },
    "s31-u02-v013": {
      "previousPrompt": "나비 카드와 잠자리 카드에 함께 붙일 수 있는 특징을 서로 다르게 두 가지 적으시오.",
      "previousVersion": 1,
      "currentFields": {
        "prompt": "성충 나비와 성충 잠자리 카드에 함께 붙일 특징을 서로 다르게 두 가지 적으시오.",
        "explanation": "성충 나비와 잠자리에게 모두 있는 서로 다른 특징 두 가지를 써요. 날개 두 쌍·다리 세 쌍·더듬이 한 쌍 등의 타당한 공통점을 골라요. 날개 네 개와 날개 두 쌍은 같은 특징이어서 둘로 세지 않아요."
      }
    }
  }
};
const rawLoaders={
 's31-u01':()=>import('../data/units/s31-u01.similar.js'),
 's31-u02':()=>import('../data/units/s31-u02.similar.js'),
};
const cache=new WeakMap();
const clone=value=>JSON.parse(JSON.stringify(value));
const sameQuestion=(a,b)=>Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(key=>Object.hasOwn(b,key)&&JSON.stringify(a[key])===JSON.stringify(b[key]));
export async function withVersionedClassroomQuestions(unit,mod){
 const reviewed=entries[unit];
 if(!reviewed||!Array.isArray(mod?.classroomItems))return mod;
 const {similar}=await rawLoaders[unit]();
 let changed=false;
 const items=mod.classroomItems.map(q=>{
  const entry=reviewed[q.id],raw=similar.find(old=>old.id===q.id);
  if(!entry||!raw||q.status!=='authored'||q.sourceRef?.type!=='similar'||raw.status!=='authored'||raw.sourceRef?.type!=='similar'||(q.contentVersion||1)!==entry.previousVersion||(raw.contentVersion||1)!==entry.previousVersion||raw.prompt!==entry.previousPrompt||q.previousVersions?.length||raw.previousVersions?.length||!sameQuestion(q,{...raw,...entry.currentFields}))return q;
  changed=true;
  if(cache.has(raw))return cache.get(raw);
  const current={...q,contentVersion:CLASSROOM_QUESTION_VERSION,previousVersions:[{...clone(raw),version:entry.previousVersion}]};
  cache.set(raw,current);return current;
 });
 return changed?{...mod,classroomItems:items}:mod;
}
