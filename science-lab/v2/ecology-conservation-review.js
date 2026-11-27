// Reviewed ecology conservation tasks. Original banks and earlier answers remain intact.
export const ECOLOGY_CONSERVATION_VERSION='20261123-ecology-conservation';
const unit='c22-s42-u02',prior='2ff557808cf14266';
const review={
  "c22-s42-u02-w061": {
    "before": "03b2ea245a52ebf6",
    "patch": {
      "topic": "사는 곳의 변화",
      "prompt": "학교 연못을 메워 주차장을 만들었어요. 이곳에 살던 개구리가 줄어들 수 있는 까닭을 고르세요.",
      "choices": [
        "알을 낳을 수 있는 물가가 넓어진다.",
        "물풀 사이에 몸을 숨길 곳이 많아진다.",
        "알을 낳고 살아갈 물가가 줄어든다.",
        "물속에서 구할 수 있는 먹이가 늘어난다.",
        "연못 속을 헤엄쳐 다닐 곳이 넓어진다."
      ],
      "explanation": "개구리는 물가에서 살고 물에 알을 낳아요. 연못을 메우면 살아가고 알을 낳을 곳이 줄어들 수 있어요. 사람이 사는 곳을 바꾸면 그곳 생물의 생활에도 영향을 주어요.",
      "criteria": "연못이 사라지는 변화와 개구리가 살아갈 곳의 감소를 연결해요.",
      "misconception": "포장된 주차장은 개구리가 살던 연못과 같은 환경이 아니에요.",
      "key": 2,
      "answer": "③ 알을 낳고 살아갈 물가가 줄어든다.",
      "sourceGivens": null
    },
    "removeContext": false,
    "bankId": "c22-s42-u02-b43",
    "bankBefore": "7cd6b96c64075436",
    "bankPatch": {
      "prompt": "학교 연못을 메워 주차장을 만들었어요. 이곳에 살던 개구리가 줄어들 수 있는 까닭을 고르세요.",
      "choices": [
        "알을 낳을 수 있는 물가가 넓어진다.",
        "물풀 사이에 몸을 숨길 곳이 많아진다.",
        "알을 낳고 살아갈 물가가 줄어든다.",
        "물속에서 구할 수 있는 먹이가 늘어난다.",
        "연못 속을 헤엄쳐 다닐 곳이 넓어진다."
      ],
      "givens": null,
      "explanation": "개구리는 물가에서 살고 물에 알을 낳아요. 연못을 메우면 살아가고 알을 낳을 곳이 줄어들 수 있어요. 사람이 사는 곳을 바꾸면 그곳 생물의 생활에도 영향을 주어요."
    }
  },
  "c22-s42-u02-w062": {
    "before": "4288432cda6463ee",
    "patch": {
      "topic": "물과 흙의 오염",
      "prompt": "땅에 흘린 기름이 흙에 스며들고, 빗물에 씻겨 연못으로 흘러갔어요. 오염될 수 있는 곳을 고르세요.",
      "choices": [
        "흙과 연못의 물",
        "흙만",
        "연못의 물만",
        "연못 위의 공기만",
        "기름이 담겨 있던 통만"
      ],
      "explanation": "기름이 스며든 흙과 기름이 흘러 들어간 연못의 물이 모두 오염될 수 있어요. 한 곳에 버린 물질이 다른 곳으로 옮겨 가 영향을 줄 수도 있어요.",
      "criteria": "기름이 지나간 흙과 연못의 물을 모두 골라요.",
      "misconception": "기름은 버린 자리에만 머무르지 않고 물을 따라 이동할 수 있어요.",
      "key": 0,
      "answer": "① 흙과 연못의 물",
      "sourceGivens": null
    },
    "removeContext": false,
    "bankId": "c22-s42-u02-b53",
    "bankBefore": "550fdfba7cbd43cc",
    "bankPatch": {
      "prompt": "땅에 흘린 기름이 흙에 스며들고, 빗물에 씻겨 연못으로 흘러갔어요. 오염될 수 있는 곳을 고르세요.",
      "choices": [
        "흙만",
        "연못의 물만",
        "흙과 연못의 물",
        "연못 위의 공기만",
        "기름이 담겨 있던 통만"
      ],
      "givens": null,
      "explanation": "기름이 스며든 흙과 기름이 흘러 들어간 연못의 물이 모두 오염될 수 있어요. 한 곳에 버린 물질이 다른 곳으로 옮겨 가 영향을 줄 수도 있어요."
    }
  },
  "c22-s42-u02-w063": {
    "before": "56cf6a8e23f01250",
    "patch": {
      "topic": "함께 정하는 보전 방법",
      "prompt": "두 친구의 생각을 함께 살려 화단을 지키는 방법을 고르세요.",
      "given": [
        "민지: 꽃을 가까이에서 보고 싶어.",
        "준호: 화단을 밟으면 식물이 다칠 수 있어."
      ],
      "choices": [
        "꽃을 꺾어 교실로 가져온다.",
        "화단 한가운데로 지름길을 만든다.",
        "꽃을 잘 보려고 화단 안으로 들어간다.",
        "꽃 주변의 식물을 모두 뽑아 길을 넓힌다.",
        "화단 옆의 정해진 길에서 꽃을 본다."
      ],
      "explanation": "화단 옆의 길을 이용하면 꽃을 살펴보면서 식물을 밟지 않을 수 있어요. 친구들의 생각을 듣고 사람의 이용과 식물 보호를 함께 생각한 방법이에요.",
      "criteria": "꽃을 보는 일과 식물을 밟지 않는 일을 함께 만족하는 방법을 골라요.",
      "misconception": "꽃을 관찰하려고 꺾거나 화단에 들어가면 식물을 다치게 할 수 있어요.",
      "key": 4,
      "answer": "⑤ 화단 옆의 정해진 길에서 꽃을 본다.",
      "sourceGivens": {
        "친구들의 말": [
          "민지: 꽃을 가까이에서 보고 싶어.",
          "준호: 화단을 밟으면 식물이 다칠 수 있어."
        ]
      }
    },
    "removeContext": false,
    "bankId": "c22-s42-u02-b78",
    "bankBefore": "8da11cb168c90887",
    "bankPatch": {
      "prompt": "두 친구의 생각을 함께 살려 화단을 지키는 방법을 고르세요.",
      "choices": [
        "꽃을 꺾어 교실로 가져온다.",
        "화단 옆의 정해진 길에서 꽃을 본다.",
        "화단 한가운데로 지름길을 만든다.",
        "꽃을 잘 보려고 화단 안으로 들어간다.",
        "꽃 주변의 식물을 모두 뽑아 길을 넓힌다."
      ],
      "givens": {
        "친구들의 말": [
          "민지: 꽃을 가까이에서 보고 싶어.",
          "준호: 화단을 밟으면 식물이 다칠 수 있어."
        ]
      },
      "explanation": "화단 옆의 길을 이용하면 꽃을 살펴보면서 식물을 밟지 않을 수 있어요. 친구들의 생각을 듣고 사람의 이용과 식물 보호를 함께 생각한 방법이에요."
    }
  },
  "c22-s42-u02-w068": {
    "before": "97a2addd7a78f72b",
    "patch": {
      "topic": "쓰레기가 생기는 양 줄이기",
      "prompt": "일회용 컵 쓰레기가 생기는 양을 줄이는 방법을 고르세요.",
      "choices": [
        "쓴 컵을 한곳에 모은다.",
        "쓴 컵을 눌러 담는다.",
        "쓴 컵을 종류별로 나눈다.",
        "여러 번 쓰는 물병을 사용한다.",
        "컵을 더 큰 쓰레기봉투에 담는다."
      ],
      "key": 3,
      "answer": "④ 여러 번 쓰는 물병을 사용한다.",
      "explanation": "물병을 다시 쓰면 일회용 컵을 덜 쓸 수 있어요. 컵을 모으거나 눌러 담는 것은 이미 생긴 쓰레기를 정리하는 방법이에요.",
      "criteria": "일회용 컵의 사용을 줄이는 방법을 골라요.",
      "misconception": "쓰레기의 부피를 줄이는 것과 처음부터 덜 생기게 하는 것은 달라요."
    },
    "removeContext": false
  },
  "c22-s42-u02-w070": {
    "before": "aac2dd1a9b60e074",
    "patch": {
      "topic": "생물이 사는 풀밭 지키기",
      "prompt": "학교 풀밭에 사는 생물을 지키는 방법을 모두 고르세요.",
      "choices": [
        "풀밭을 모두 포장해 운동장을 넓힌다.",
        "곤충이 먹이를 찾고 숨을 풀밭을 남긴다.",
        "정해진 관찰 길을 이용해 풀을 밟지 않는다.",
        "보이는 곤충을 모두 잡아 교실로 옮긴다.",
        "풀꽃을 모두 뽑아 맨흙으로 만든다."
      ],
      "answer": "②, ③",
      "explanation": "풀밭은 곤충이 먹이를 구하고 몸을 숨기는 곳이에요. 풀밭을 남기고 정해진 길을 이용하면 생물이 살아갈 곳을 지키는 데 도움이 돼요.",
      "criteria": "풀밭을 남기는 방법과 풀을 밟지 않는 방법을 모두 골라요.",
      "misconception": "곤충을 모두 잡거나 풀꽃을 없애는 일은 그곳 생물의 생활을 방해할 수 있어요."
    },
    "removeContext": false
  },
  "c22-s42-u02-w071": {
    "before": "6b83856ebf5ad820",
    "patch": {
      "topic": "하천의 오염 줄이기",
      "prompt": "하천을 깨끗하게 지키는 행동을 모두 고르세요.",
      "choices": [
        "세제를 필요 이상으로 많이 쓴다.",
        "남은 기름을 싱크대 배수구에 붓는다.",
        "쓰레기를 잘게 찢어 하천에 흘려보낸다.",
        "세제는 필요한 양만 사용한다.",
        "하천가의 쓰레기를 선생님과 안전하게 치운다."
      ],
      "answer": "④, ⑤",
      "explanation": "세제를 필요한 양만 쓰고 하천가의 쓰레기를 안전하게 치우면 물의 오염을 줄이는 데 도움이 돼요. 기름이나 쓰레기는 물에 흘려보내지 않아요.",
      "criteria": "오염 물질과 쓰레기가 하천에 들어가는 것을 줄이는 두 행동을 골라요.",
      "misconception": "쓰레기를 작게 만들거나 물에 흘려보내도 없어진 것은 아니에요."
    },
    "removeContext": false
  },
  "c22-s42-u02-w073": {
    "before": "59d5cf595239c3db",
    "patch": {
      "topic": "다시 쓰는 물건과 자원",
      "prompt": "일회용 컵 대신 물병을 여러 번 쓰면 버리는 ㉠[ ]의 양을 줄일 수 있어요. 새 컵을 만드는 데 필요한 ㉡[ ]도 아낄 수 있어요.",
      "given": [
        "도움 낱말: 자원, 쓰레기"
      ],
      "answer": "㉠ 쓰레기 · ㉡ 자원",
      "explanation": "물병을 다시 쓰면 버리는 일회용 컵 쓰레기가 줄어요. 새 컵을 덜 만들면 컵을 만드는 데 필요한 자원도 아낄 수 있어요.",
      "criteria": "㉠에는 쓰레기, ㉡에는 자원을 써요.",
      "misconception": "물건을 다시 쓰는 일은 쓰레기뿐 아니라 새 물건에 드는 자원도 줄이는 데 연결돼요."
    },
    "removeContext": false
  },
  "c22-s42-u02-w074": {
    "before": "b3fa4c77b57831c9",
    "patch": {
      "topic": "이동할 길과 생태계 보전",
      "prompt": "도로로 나뉜 숲 사이에 ㉠[ ]를 만들면 동물이 오갈 수 있어요. 이처럼 생물이 살거나 이동할 곳을 지키는 일은 생태계 ㉡[ ]의 한 방법이에요.",
      "given": [
        "도움 낱말: 보전, 생태 통로"
      ],
      "answer": "㉠ 생태 통로 · ㉡ 보전",
      "explanation": "생태 통로는 도로 양쪽의 숲을 오가는 동물에게 이동할 길을 제공해요. 생물이 살아갈 곳과 이동할 길을 지키는 것은 생태계 보전의 한 방법이에요.",
      "criteria": "㉠에는 생태 통로, ㉡에는 보전을 써요.",
      "misconception": "도로가 생기면 동물이 다니던 길이 끊길 수 있어요."
    },
    "removeContext": false
  },
  "c22-s42-u02-w075": {
    "before": "04d964fc9792fae6",
    "patch": {
      "topic": "오염의 종류 연결하기",
      "prompt": "더러워진 곳과 오염의 이름을 연결하세요.",
      "given": [
        "① 토양 오염   ② 대기 오염   ③ 수질 오염"
      ],
      "parts": [
        "㉠ 공장 연기로 공기가 더러워졌다.",
        "㉡ 처리하지 않은 공장 물로 하천이 더러워졌다.",
        "㉢ 버린 기름으로 흙이 더러워졌다."
      ],
      "answer": "㉠-② · ㉡-③ · ㉢-①",
      "explanation": "공기의 오염은 대기 오염, 물의 오염은 수질 오염, 흙의 오염은 토양 오염이에요. 각각 ㉠–②, ㉡–③, ㉢–①로 연결해요.",
      "criteria": "공기·물·흙과 대기·수질·토양 오염을 각각 연결해요.",
      "misconception": "공기·물·흙 중 어느 곳이 더러워졌는지 살펴요."
    },
    "removeContext": false
  },
  "c22-s42-u02-w076": {
    "before": "7a0a2edec03aa3fc",
    "patch": {
      "topic": "오염을 줄이는 방법 연결하기",
      "prompt": "오염을 줄이는 행동과 가장 직접적으로 보호하는 곳을 연결하세요.",
      "given": [
        "① 물   ② 흙   ③ 공기"
      ],
      "parts": [
        "㉠ 굴뚝 연기를 깨끗하게 하는 장치를 단다.",
        "㉡ 공장에서 쓴 물을 처리한 뒤 흘려보낸다.",
        "㉢ 폐건전지를 땅에 묻지 않고 수거함에 넣는다."
      ],
      "answer": "㉠-③ · ㉡-① · ㉢-②",
      "explanation": "굴뚝 연기를 깨끗하게 하면 공기, 공장에서 쓴 물을 처리하면 물의 오염을 줄여요. 폐건전지를 땅에 묻지 않고 모으면 흙을 보호하는 데 도움이 돼요.",
      "criteria": "연기는 공기, 공장에서 쓴 물은 물, 땅에 묻는 건전지는 흙과 연결해요.",
      "misconception": "오염을 줄이는 방법은 오염되는 곳과 원인에 맞게 골라요."
    },
    "removeContext": false
  },
  "c22-s42-u02-w077": {
    "before": "5104bdd6e7be6058",
    "patch": {
      "topic": "보전 행동과 도움 연결하기",
      "prompt": "생태계를 지키는 행동과 그 행동이 주는 도움을 연결하세요.",
      "given": [
        "① 동물이 도로 양쪽을 오가게 돕는다.   ② 버리는 비닐봉지를 줄인다.   ③ 하천으로 들어가는 오염 물질을 줄인다."
      ],
      "parts": [
        "㉠ 장바구니를 여러 번 사용한다.",
        "㉡ 공장에서 쓴 물을 깨끗하게 처리한다.",
        "㉢ 도로 위에 생태 통로를 만든다."
      ],
      "answer": "㉠-② · ㉡-③ · ㉢-①",
      "explanation": "장바구니를 다시 쓰면 일회용 비닐봉지 사용을 줄여요. 공장에서 쓴 물을 처리하면 하천의 오염을 줄이고, 생태 통로를 만들면 동물이 오갈 수 있어요.",
      "criteria": "각 행동이 줄이는 문제나 돕는 생물의 생활을 연결해요.",
      "misconception": "한 행동이 어떤 문제를 줄이는지 구체적으로 살펴요."
    },
    "removeContext": false
  },
  "c22-s42-u02-w078": {
    "before": "a155748b393d57f9",
    "patch": {
      "topic": "문제 찾기에서 실천까지",
      "prompt": "화단을 지키는 활동을 ‘문제 찾기 → 방법 정하기 → 해 보기 → 돌아보기’ 차례로 하려고 해요. 알맞은 기호를 순서대로 쓰세요.",
      "given": [
        "㉠ 정한 날에 집게로 종이 쓰레기를 줍는다.",
        "㉡ 활동 뒤 깨끗해진 곳과 더 할 일을 이야기한다.",
        "㉢ 화단에 버려진 종이 쓰레기를 찾아본다.",
        "㉣ 쓰레기를 치울 날짜와 준비물을 정한다."
      ],
      "answer": "㉢→㉣→㉠→㉡",
      "explanation": "먼저 화단의 문제를 찾고(㉢), 할 일과 준비물을 정해요(㉣). 정한 날에 해 본 뒤(㉠), 달라진 점과 더 할 일을 이야기해요(㉡).",
      "criteria": "제시한 문제 찾기·방법 정하기·해 보기·돌아보기 차례에 맞게 기호를 써요.",
      "misconception": "날짜와 준비물을 정하는 일은 정한 행동을 해 보기 전 단계예요."
    },
    "removeContext": false
  },
  "c22-s42-u02-w079": {
    "before": "11f89e0b9ed6e8f9",
    "patch": {
      "topic": "숲을 지나는 길",
      "prompt": "학교 숲의 나무와 풀을 다치게 하지 않으면서 사람이 걸어갈 길을 한 가지 그려 보세요. 그림에 ‘나무’, ‘풀’, ‘길’ 이름표를 붙이세요.",
      "answer": "나무와 풀이 있는 곳을 표시하고, 그곳을 밟거나 나무를 베지 않도록 돌아가는 길 한 가지를 그린다. 나무·풀·길 이름표를 붙인다.",
      "explanation": "나무와 풀이 자라는 곳을 먼저 정해요. 그곳을 피하면서 사람이 걸어갈 길을 그릴 수 있어요. 길의 모양이 달라도 식물을 보호하며 사람이 다닐 수 있으면 알맞아요.",
      "criteria": "나무·풀·길 이름표 / 식물이 있는 곳을 피하는 길 한 가지. 타당한 다른 배치도 인정해요.",
      "misconception": "길의 모양은 하나로 정해져 있지 않아요. 식물이 있는 곳을 어떻게 피했는지 살펴요.",
      "drawingExplanationLines": 0
    },
    "removeContext": false
  },
  "c22-s42-u02-w080": {
    "before": "bcd219df8dd74c59",
    "patch": {
      "topic": "나의 생태계 지킴이 카드",
      "prompt": "생태계를 지키는 행동 한 가지를 그림으로 나타내세요. 그림 아래에 짧은 실천 약속을 써 보세요.",
      "given": [
        "떠올려 보아요: 정해진 길로 걷기, 물건 다시 쓰기, 쓰레기 줄이기"
      ],
      "answer": "화단 옆의 길로 걷는 모습을 그리고 ‘나는 화단을 밟지 않아요.’처럼 그림에 맞는 약속 한 문장을 쓴다. 생태계를 지키는 다른 타당한 행동도 인정한다.",
      "explanation": "내가 할 수 있는 행동 하나를 골라 그림과 짧은 약속으로 표현해요. 물건을 다시 쓰거나 생물이 사는 곳을 밟지 않는 등 생태계를 지키는 행동이면 좋아요.",
      "criteria": "보전 행동 한 가지를 나타낸 그림 / 그 행동에 맞는 짧은 약속. 다른 타당한 행동도 인정해요.",
      "misconception": "여러 행동을 모두 그릴 필요는 없어요. 내가 실천할 한 가지를 분명하게 나타내요.",
      "drawingExplanationLines": 1
    },
    "removeContext": true
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const bankCache=new WeakMap(),bookCache=new WeakMap();
export function ecologyConservationItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{
  const e=Object.values(review).find(e=>e.bankId===q.id);
  if(!e||q.status!=='authored'||q.sourceRef?.type==='original'||fingerprint(q)!==e.bankBefore)return q;
  changed=true;if(bankCache.has(q))return bankCache.get(q);
  const result={...q,...e.bankPatch,contentVersion:ECOLOGY_CONSERVATION_VERSION,diagnosticOverride:{version:ECOLOGY_CONSERVATION_VERSION,distractors:null},previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};
  bankCache.set(q,result);return result;
 });return changed?next:rows;
}
export function withEcologyConservationClassroom(u,mod){
 const items=ecologyConservationItems(mod?.classroomItems,u);return items===mod?.classroomItems?mod:{...mod,classroomItems:items};
}
export function withEcologyConservationWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;
 if(bookCache.has(w))return bookCache.get(w);
 const questions=w.questions.map(q=>{const e=review[q.id];if(!e||fingerprint(q)!==e.before)return q;const out={...q,...e.patch,conservationReviewed:true};if(e.removeContext)delete out.contextFigure;return out;});
 const editedPages=w.pages.map(p=>{
  const ids=p.blocks.flatMap(b=>b.ids||[]),has=n=>ids.includes(unit+'-w'+n);
  if(!has('079')&&!has('080'))return p;
  if(has('079'))return {...p,title:'숲을 지나는 길',rail:p.rail.map((n,i)=>i===2?{...n,text:'식물이 자라는 곳을 피해 길을 그려요.'}:n)};
  return {...p,title:'한 가지 행동을 약속해요',blocks:p.blocks.filter(b=>b.type!=='diagram'||b.key!=='ecoPracticeCards'),rail:p.rail.map((n,i)=>i===0?{...n,text:'생태계를 지키는 행동 하나를 골라요. 생물이 사는 곳을 보호하거나 쓰레기를 줄이는 방법을 떠올려요.'}:i===2?{...n,text:'그림과 실천 약속이 같은 행동을 나타내는지 살펴요.'}:n)};
 });
 // Keep full-size type and space under each part. The longer examples need
 // separate pages in the actual A4 output, even though screen pages can grow.
 const pages=[];
 const groupPage=(p,group)=>({...p,section:'확인 문제 '+group.map(id=>questions.find(q=>q.id===id).no).join('·'),blocks:[{type:'questions',ids:group}]});
 for(let i=0;i<editedPages.length;i++){
  const p=editedPages[i],block=p.blocks.length===1&&p.blocks[0].type==='questions'?p.blocks[0]:null,key=block?.ids[0]?.slice(-3);
  if(key==='061')for(const group of [block.ids.slice(0,2),block.ids.slice(2)])pages.push(groupPage(p,group));
  else if(key==='069'){
   const following=editedPages[++i].blocks[0].ids;
   for(const group of [block.ids.slice(0,2),[...block.ids.slice(2),...following.slice(0,2)],following.slice(2)])pages.push(groupPage(p,group));
  }else pages.push(p);
 }
 const quickPages=w.quickPages.map(p=>({...p,blocks:p.blocks.map(b=>b.type!=='table'?b:{...b,rows:b.rows.map(row=>{const q=questions.find(q=>String(q.no)===row[0]);if(!q||!review[q.id])return row;const label=row[1].split(' · ')[0],answer=['draw','written'].includes(q.form)?'교사 확인(해설 쪽)':q.form==='choice'?'①②③④⑤'[q.key]:q.answer;return [row[0],label+' · '+q.topic,answer];})})}));
 const result={...w,questions,pages,teacherStudentPages:pages,quickPages};bookCache.set(w,result);return result;
}
