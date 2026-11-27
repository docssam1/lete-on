// Concrete elementary classification and food-web tasks; exact prior versions only.
export const ECOLOGY_FOODWEB_VERSION='20261123-ecology-foodweb-tasks';
const unit='c22-s42-u02',prior='0d90113929a004c3';
const review={
  "c22-s42-u02-w027": {
    "before": "8458cb2b948a4651",
    "patch": {
      "topic": "관찰에서 분류까지",
      "prompt": "화단을 관찰하고, 본 것을 기록해 생물과 비생물로 나눈 뒤 친구에게 소개하려고 해요. 활동 순서를 기호로 쓰세요.",
      "given": [
        "㉠ 적어 둔 대상을 생물과 비생물로 나눈다.",
        "㉡ 화단의 생물과 주변 환경을 살펴본다.",
        "㉢ 나눈 결과와 그 까닭을 친구에게 소개한다.",
        "㉣ 관찰한 대상의 이름을 적는다."
      ],
      "answer": "㉡→㉣→㉠→㉢",
      "explanation": "먼저 화단의 생물과 주변 환경을 관찰해요(㉡). 본 것의 이름을 적고(㉣), 살아 있는지에 따라 나누어요(㉠). 마지막으로 나눈 결과와 까닭을 소개해요(㉢).",
      "criteria": "제시한 관찰·기록·분류·소개 차례에 맞게 기호를 써요.",
      "misconception": "어떤 대상을 보았는지 알아야 생물과 비생물로 나눌 수 있어요."
    }
  },
  "c22-s42-u02-w028": {
    "before": "90d6f154ba05c3a6",
    "patch": {
      "topic": "생물과 비생물 나누기",
      "prompt": "목록의 여섯 대상을 생물 요소와 비생물 요소로 나누어 두 묶음으로 나타내세요. 각 묶음에 알맞은 이름표를 붙이세요.",
      "answer": "생물 요소 묶음에는 나무·개미·버섯, 비생물 요소 묶음에는 물·햇빛·흙을 넣는다. 두 묶음의 이름표를 붙인다.",
      "explanation": "살아 있는 나무·개미·버섯은 생물 요소예요. 살아 있지 않은 물·햇빛·흙은 비생물 요소예요. 묶음의 위치나 모양이 달라도 여섯 대상을 알맞게 나누면 돼요.",
      "criteria": "여섯 대상을 생물/비생물로 알맞게 분류 / 두 묶음의 이름표. 묶음의 위치와 모양은 자유로워요.",
      "misconception": "나무와 버섯도 살아 있는 생물이에요. 걷는지만으로 나누지 않아요.",
      "drawingExplanationLines": 0
    }
  },
  "c22-s42-u02-w036": {
    "before": "6392f91d8193517f",
    "patch": {
      "topic": "먹이 사슬과 먹이그물 비교",
      "prompt": "먹이그물의 특징으로 알맞은 것을 고르세요.",
      "choices": [
        "생물이 자라는 차례를 나타낸다.",
        "한 종류의 생물 수만 나타낸다.",
        "여러 먹이 사슬이 서로 이어져 있다.",
        "먹고 먹히는 관계가 한 줄로만 이어져 있다.",
        "생물이 사는 장소의 위치만 나타낸다."
      ],
      "explanation": "먹고 먹히는 관계를 한 줄로 이으면 먹이 사슬이에요. 여러 먹이 사슬이 같은 생물을 통해 서로 이어지면 먹이그물이 돼요.",
      "criteria": "여러 먹이 사슬이 서로 이어진다는 특징을 골라요.",
      "misconception": "먹이 사슬과 먹이그물은 모두 먹고 먹히는 관계를 나타내지만 연결된 모습이 달라요.",
      "key": 2,
      "answer": "③ 여러 먹이 사슬이 서로 이어져 있다.",
      "sourceExplanation": "먹고 먹히는 관계를 한 줄로 이으면 먹이 사슬이에요. 여러 먹이 사슬이 같은 생물을 통해 서로 이어지면 먹이그물이 돼요."
    },
    "bankId": "c22-s42-u02-b37",
    "bankBefore": "1414464e20884234",
    "bankPatch": {
      "prompt": "먹이그물의 특징으로 알맞은 것을 고르세요.",
      "choices": [
        "생물이 자라는 차례를 나타낸다.",
        "여러 먹이 사슬이 서로 이어져 있다.",
        "한 종류의 생물 수만 나타낸다.",
        "먹고 먹히는 관계가 한 줄로만 이어져 있다.",
        "생물이 사는 장소의 위치만 나타낸다."
      ],
      "explanation": "먹고 먹히는 관계를 한 줄로 이으면 먹이 사슬이에요. 여러 먹이 사슬이 같은 생물을 통해 서로 이어지면 먹이그물이 돼요.",
      "misconception": "먹이 사슬과 먹이그물은 모두 먹고 먹히는 관계를 나타내지만 연결된 모습이 달라요.",
      "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 4,
        "semester": 2,
        "unit": "u02",
        "area": "생명",
        "element": "E3",
        "type": "T06",
        "format": "선택형",
        "level": "기본",
        "track": "교과",
        "topic": "먹이 사슬과 먹이그물 비교",
        "concept": "먹이 사슬과 먹이그물 비교",
        "inquirySkill": "먹이 관계 비교",
        "standard": "4과14-02"
      }
    }
  },
  "c22-s42-u02-w043": {
    "before": "4dc5b3dd2a44ff7b",
    "patch": {
      "topic": "두 먹이 사슬의 공통 생물",
      "prompt": "자료의 두 먹이 사슬에 모두 나오는 생물을 모두 고르세요.",
      "choices": [
        "풀",
        "메뚜기",
        "애벌레",
        "개구리",
        "뱀"
      ],
      "key": [
        0,
        4
      ],
      "answer": "①, ⑤",
      "explanation": "첫째 사슬과 둘째 사슬에는 모두 풀과 뱀이 나와요. 이 두 생물을 연결점으로 삼으면 두 사슬을 하나의 먹이그물로 나타낼 수 있어요.",
      "criteria": "두 먹이 사슬에 공통으로 나오는 풀과 뱀을 모두 골라요.",
      "misconception": "한 사슬에만 나오는 생물과 두 사슬에 모두 나오는 생물을 구별해요."
    }
  },
  "c22-s42-u02-w044": {
    "before": "5a538b46d30084e0",
    "patch": {
      "topic": "먹이그물에서 이어진 관계",
      "prompt": "먹이그물에서 개구리가 줄었어요. 알맞은 설명을 모두 고르세요.",
      "choices": [
        "뱀은 작은 새도 먹을 수 있다.",
        "개구리가 줄면 뱀은 풀을 직접 먹게 된다.",
        "개구리는 다른 생물과 먹이로 연결되어 있지 않다.",
        "먹이로 연결된 다른 생물도 영향을 받을 수 있다."
      ],
      "key": [
        0,
        3
      ],
      "answer": "①, ④",
      "explanation": "자료에는 작은 새 → 뱀의 연결도 있어요. 개구리는 메뚜기와 뱀에 먹이로 연결되어 있으므로, 개구리의 수가 달라지면 다른 생물도 영향을 받을 수 있어요.",
      "criteria": "뱀의 다른 먹이인 작은 새를 찾고, 먹이로 연결된 생물이 서로 영향을 줄 수 있음을 골라요.",
      "misconception": "먹이그물에서는 한 생물이 여러 생물과 먹이로 연결될 수 있어요."
    }
  },
  "c22-s42-u02-w045": {
    "before": "bdc8b0d27a394d5c",
    "patch": {
      "topic": "먹이 관계와 생물 수의 변화",
      "prompt": "아래 먹이 관계에서 토끼가 줄었어요. 다른 조건이 같다면 생길 수 있는 변화를 모두 고르세요.",
      "given": [
        "먹이 관계: 풀 → 토끼 → 여우"
      ],
      "choices": [
        "풀이 토끼에게 먹히는 양이 줄어들 수 있다.",
        "여우가 먹을 토끼를 구하기 어려워질 수 있다.",
        "풀이 토끼에게 먹히는 양이 늘어난다.",
        "여우가 먹을 토끼의 수가 늘어난다."
      ],
      "key": [
        0,
        1
      ],
      "answer": "①, ②",
      "explanation": "토끼가 줄면 토끼가 먹는 풀의 양도 줄어들 수 있어요. 토끼를 먹는 여우는 먹이를 구하기 어려워질 수 있어요. 한 생물의 변화가 먹이로 연결된 다른 생물에게 영향을 주는 예예요.",
      "criteria": "풀이 먹히는 양의 감소 가능성과 여우가 먹이를 구하기 어려워질 가능성을 모두 골라요.",
      "misconception": "토끼의 변화는 먹이로 연결된 풀과 여우의 생활에도 영향을 줄 수 있어요."
    }
  },
  "c22-s42-u02-w048": {
    "before": "c40dec0b42c0f565",
    "patch": {
      "topic": "먹이그물과 생산자",
      "prompt": "여러 먹이 사슬이 서로 이어진 것을 ㉠[ ]이라고 해요. 빛을 이용해 양분을 만드는 풀은 ㉡[ ]예요.",
      "given": [
        "도움 낱말: 먹이그물, 생산자, 소비자"
      ],
      "answer": "㉠ 먹이그물 · ㉡ 생산자",
      "explanation": "여러 먹이 사슬이 이어지면 먹이그물이에요. 풀은 빛을 이용해 양분을 스스로 만들므로 생산자예요. 따라서 ㉠은 먹이그물, ㉡은 생산자예요.",
      "criteria": "㉠에는 먹이그물, ㉡에는 생산자를 써요.",
      "misconception": "풀을 먹는 동물과 풀 자체의 역할은 달라요."
    }
  },
  "c22-s42-u02-w053": {
    "before": "e4a6695edd4e55c0",
    "patch": {
      "topic": "먹히는 생물부터 차례로",
      "prompt": "아래 관계를 보고, 먹히는 생물부터 차례로 기호를 쓰세요.",
      "given": [
        "메뚜기는 풀을, 개구리는 메뚜기를, 뱀은 개구리를 먹어요.",
        "㉠ 메뚜기   ㉡ 뱀   ㉢ 풀   ㉣ 개구리"
      ],
      "answer": "㉢→㉠→㉣→㉡",
      "explanation": "메뚜기의 먹이인 풀부터 시작해요. 메뚜기 → 개구리 → 뱀으로 이어지므로 풀에 해당하는 ㉢부터 ㉠, ㉣, ㉡ 차례예요.",
      "criteria": "풀 → 메뚜기 → 개구리 → 뱀에 맞게 기호를 써요.",
      "misconception": "먹히는 생물에서 그 생물을 먹는 생물 쪽으로 이어 보아요."
    }
  },
  "c22-s42-u02-w054": {
    "before": "73842e131fc1df81",
    "patch": {
      "topic": "먹이그물 그리기",
      "prompt": "자료의 두 먹이 사슬을 하나의 먹이그물로 그리세요. 같은 생물은 한 번씩 쓰고, 먹히는 생물에서 먹는 생물 쪽으로 화살표를 이어요.",
      "drawingExplanationLines": 0,
      "misconception": "풀과 뱀을 각각 한 번씩 쓰고 두 사슬의 화살표를 모두 연결해요."
    }
  },
  "c22-s42-u02-w055": {
    "before": "0d452f38a5e117aa",
    "patch": {
      "topic": "화살표 고쳐 그리기",
      "prompt": "친구가 거꾸로 그린 화살표 세 개를 고쳐 한 줄의 먹이 사슬로 그리세요.",
      "answer": "풀 → 메뚜기 → 개구리 → 뱀으로 이름 네 개와 화살표 세 개를 그린다.",
      "explanation": "메뚜기는 풀을 먹고, 개구리는 메뚜기를, 뱀은 개구리를 먹어요. 먹히는 생물에서 먹는 생물로 화살표를 그리면 풀 → 메뚜기 → 개구리 → 뱀이 돼요.",
      "criteria": "생물 이름 네 개 / 먹히는 생물에서 먹는 생물로 향하는 화살표 세 개. 추가 설명 글은 요구하지 않아요.",
      "misconception": "화살표가 먹는 생물을 향하는지 하나씩 확인해요.",
      "drawingExplanationLines": 0
    }
  },
  "c22-s42-u02-w056": {
    "before": "55fd8a61ab5c0cbf",
    "patch": {
      "topic": "뱀의 먹이 두 가지",
      "prompt": "자료에서 뱀이 먹는 생물 두 가지를 찾아, 두 생물에서 뱀 쪽으로 화살표를 그리세요.",
      "answer": "개구리 → 뱀, 작은 새 → 뱀의 두 먹이 관계를 그린다.",
      "explanation": "자료에는 개구리 → 뱀과 작은 새 → 뱀의 관계가 있어요. 개구리와 작은 새에서 각각 뱀을 향해 화살표를 그리면 돼요.",
      "criteria": "개구리와 작은 새의 이름 / 두 생물에서 뱀으로 향하는 화살표 두 개. 이름표의 배치는 자유로워요.",
      "misconception": "뱀에서 먹이 쪽으로 화살표를 거꾸로 그리지 않아요.",
      "drawingExplanationLines": 0
    }
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const bankCache=new WeakMap(),bookCache=new WeakMap();
export function ecologyFoodwebItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{
  const e=Object.values(review).find(e=>e.bankId===q.id);
  if(!e||q.status!=='authored'||q.sourceRef?.type==='original'||fingerprint(q)!==e.bankBefore)return q;
  changed=true;if(bankCache.has(q))return bankCache.get(q);
  const result={...q,...e.bankPatch,contentVersion:ECOLOGY_FOODWEB_VERSION,diagnosticOverride:{version:ECOLOGY_FOODWEB_VERSION,distractors:null},previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};
  bankCache.set(q,result);return result;
 });return changed?next:rows;
}
export function withEcologyFoodwebClassroom(u,mod){
 const items=ecologyFoodwebItems(mod?.classroomItems,u);return items===mod?.classroomItems?mod:{...mod,classroomItems:items};
}
export function withEcologyFoodwebWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;
 if(bookCache.has(w))return bookCache.get(w);
 const questions=w.questions.map(q=>{const e=review[q.id];return e&&fingerprint(q)===e.before?{...q,...e.patch,foodwebReviewed:true}:q;});
 const titles={28:'생물과 비생물 나누기',54:'먹이그물 그리기',55:'화살표 고쳐 그리기',56:'뱀의 먹이 두 가지'};
 const cues={28:'살아 있는 것끼리 같은 묶음에 넣어요.',54:'같은 생물을 한 번씩만 쓰고 화살표를 이어요.',55:'먹히는 생물부터 손가락으로 따라가요.',56:'뱀을 향하는 화살표가 두 개 있는지 살펴요.'};
 const pages=w.pages.map(p=>{const ids=p.blocks.flatMap(b=>b.ids||[]);if(ids.includes(unit+'-w045'))return{...p,rail:p.rail.map((n,i)=>i===0?{...n,text:'먹이 관계로 연결된 한 생물의 수가 변하면 다른 생물의 생활도 달라질 수 있어요. 화살표를 따라 먹이를 찾으며 생각해요.'}:i===1?{...n,text:'중학교에서는 생물다양성 보전을 배워요. 한 생물을 지키려면 그 생물뿐 아니라 먹이와 서식지 등 다른 생물·환경과의 관계도 함께 살펴야 해요.'}:{...n,text:'토끼를 먹는 생물과 토끼에게 먹히는 생물을 짚어 보아요.'})};const no=Object.keys(titles).find(n=>ids.length===1&&ids[0]===unit+'-w'+n.padStart(3,'0'));return no?{...p,title:titles[no],rail:p.rail.map((n,i)=>i===2?{...n,text:cues[no]}:no==='56'&&i===0?{...n,text:'먹이그물에서 한 생물은 여러 생물을 먹을 수 있어요. 뱀으로 향하는 화살표를 따라 먹이를 찾아요.'}:n)}:p;});
 const figures={...w.figures,ecoSurveyCards:w.figures.ecoSurveyCards.replace('관계 지도 만들기를 위한 제공 목록이에요. 학생이 직접 조사한 결과가 아니에요.','목록의 여섯 대상을 살아 있는지에 따라 나누어 보아요.'),ecoChains:w.figures.ecoChains.replace('연습 사슬','먹이 사슬').replace('제공한 관계','먹고 먹히는 관계').replace('이 자료에 제시한 관계만 사용해요. 이름 카드의 장수는 실제 생물의 수를 뜻하지 않아요.','먹히는 생물에서 먹는 생물 쪽으로 이어진 먹이 관계예요.')};
 const quickPages=w.quickPages.map(p=>({...p,blocks:p.blocks.map(b=>b.type!=='table'?b:{...b,rows:b.rows.map(row=>{const q=questions.find(q=>String(q.no)===row[0]);if(!q||!review[q.id])return row;const label=row[1].split(' · ')[0],answer=['draw','written'].includes(q.form)?'교사 확인(해설 쪽)':q.form==='choice'?'①②③④⑤'[q.key]:q.answer;return[row[0],label+' · '+q.topic,answer];})})}));
 const result={...w,questions,pages,teacherStudentPages:pages,quickPages,figures};bookCache.set(w,result);return result;
}
