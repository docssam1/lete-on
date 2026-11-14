// Reviewed elementary directions; retain all answer contracts and earlier presentations.
export const ECOLOGY_ELEMENTARY_VERSION='20261108-ecology-elementary';
const UNIT='c22-s42-u02';
const workbookPatches={
  "26": {
    "previous": "제공된 작용과 역할을 연결하세요.",
    "prompt": "각 생물이 양분을 얻는 방법을 읽고, 생산자·소비자·분해자 중 알맞은 역할을 연결하세요."
  },
  "28": {
    "previous": "제공 목록으로 생태계 구성 지도를 그리세요. 생물 요소와 비생물 요소를 나누고, 서로 관계를 맺을 수 있는 예 하나를 말풍선으로 표시하세요. 실제 조사 결과가 아님을 밝혀요.",
    "prompt": "주어진 목록으로 생태계 구성 지도를 그리세요. 생물 요소와 비생물 요소를 나누고, 서로 관련이 있을 수 있는 예 하나를 말풍선에 쓰세요. 직접 조사한 결과가 아니라 목록으로 만든 지도라고 적으세요."
  },
  "36": {
    "previous": "카드로 만든 먹이그물 모형의 한계로 알맞은 것을 고르세요.",
    "prompt": "카드로 만든 먹이그물 모형이 실제 생태계를 모두 보여 주지는 못해요. 이 모형이 나타내지 못하는 점을 고르세요."
  },
  "37": {
    "previous": "제시한 그물에서 두 먹이 사슬에 공통으로 들어가는 소비자 이름을 쓰세요.",
    "prompt": "그림의 두 먹이 사슬에 모두 나오는 소비자의 이름을 쓰세요."
  },
  "38": {
    "previous": "친구가 만든 화살표의 오류를 고치고 까닭을 설명하세요.",
    "prompt": "친구가 그린 화살표를 자료의 먹이 관계에 맞게 고치세요. 그렇게 고친 까닭도 설명하세요."
  },
  "41": {
    "previous": "제공 그물에서 개구리가 줄었을 때 뱀에게 남은 먹이 경로를 고르세요.",
    "prompt": "그림의 먹이그물에서 개구리가 줄어들었어요. 뱀이 먹을 수 있는 다른 먹이로 이어지는 화살표를 고르세요."
  },
  "42": {
    "previous": "제공한 여섯 관계와 맞는 화살표를 모두 고르세요.",
    "prompt": "자료에 나온 여섯 가지 먹이 관계를 보고, 알맞은 화살표를 모두 고르세요."
  },
  "49": {
    "previous": "제공한 그물에서 개구리가 줄면 뱀에게는 ㉠[ ]를 먹는 경로가 남아요. 실제 영향을 알려면 먹이의 ㉡[ ]과 환경도 살펴요.",
    "prompt": "이 먹이그물에서 개구리가 줄어도 뱀은 ㉠[ ]를 먹을 수 있어요. 실제로 어떤 영향을 받는지 알아보려면 먹이의 ㉡[ ]과 주변 환경도 함께 살펴야 해요."
  },
  "50": {
    "previous": "제공된 먹는 관계와 알맞은 연결을 짝지으세요.",
    "prompt": "어떤 생물이 어떤 생물을 먹는지 읽고, 그 관계를 나타낸 화살표를 연결하세요."
  },
  "51": {
    "previous": "카드 모형의 요소와 뜻을 연결하세요.",
    "prompt": "먹이그물 모형의 이름표·화살표·먹이 사슬이 각각 무엇을 나타내는지 연결하세요."
  },
  "56": {
    "previous": "두 사슬을 이용해 개구리가 줄어든 뒤 뱀에게 남은 먹이 경로를 표시하는 그림을 그리세요. 도움을 줄 수 있는 경로와 추가로 확인할 조건 하나를 적으세요.",
    "prompt": "두 먹이 사슬을 보고, 개구리가 줄어들어도 뱀이 먹을 수 있는 다른 먹이 관계를 그리세요. 실제로 도움이 되는지 알아보려면 어떤 조건을 더 확인해야 할지도 한 가지 적으세요."
  },
  "62": {
    "previous": "물이 맑아진 사진만 본 뒤 쓸 수 있는 판단을 고르세요.",
    "prompt": "물이 맑아진 사진을 보았어요. 이 사진만 보았을 때 알맞은 설명을 고르세요."
  },
  "67": {
    "previous": "제공 사진을 설명한 문장 중 관찰 사실을 고르세요.",
    "prompt": "사진에서 직접 볼 수 있는 모습을 설명한 문장을 고르세요."
  },
  "74": {
    "previous": "사진에서 물이 맑아 보이는 사실과, 물속 ㉠[ ]을 측정한 결과는 달라요. 생물의 회복 여부도 별도 ㉡[ ]로 확인해요.",
    "prompt": "사진에서 물이 맑아 보여도 물속 ㉠[ ]을 측정한 것은 아니에요. 생물이 다시 살아가는지도 따로 ㉡[ ]하여 확인해야 해요."
  },
  "75": {
    "previous": "연습 문제와 직접 대응할 방법을 연결하세요.",
    "prompt": "연습 상황에 나온 오염 문제와 그 문제를 줄이는 방법을 연결하세요."
  },
  "76": {
    "previous": "제공한 기록과 상태를 연결하세요.",
    "prompt": "짧은 기록을 읽고, 실제로 한 일인지·하지 못한 일인지·앞으로 할 계획인지 연결하세요."
  },
  "78": {
    "previous": "보전 문제를 조사했습니다. 우리 반이 정한 실행 계획의 순서를 쓰세요.",
    "prompt": "생태계를 지키기 위해 해결할 문제를 조사했어요. 우리 반이 정한 계획에 따라 할 일을 순서대로 쓰세요."
  },
  "80": {
    "previous": "주어진 가상 기록에서 실제로 한 일, 하지 못한 일, 앞으로 할 계획을 나누는 안내 카드를 그리세요. 확인한 효과와 아직 확인하지 못한 효과를 구별해 표시하세요.",
    "prompt": "연습용 기록을 읽고, 실제로 한 일·하지 못한 일·앞으로 할 계획을 나누는 안내 카드를 그리세요. 어떤 효과를 확인했고 어떤 효과는 아직 확인하지 못했는지도 나누어 표시하세요."
  }
};
const bankPatches={
  "c22-s42-u02-b01": {
    "previous": "작은 웅덩이를 생태계로 살피는 조사 항목을 고르세요.",
    "previousVersion": 1,
    "prompt": "작은 웅덩이를 생태계로 조사하려고 해요. 함께 살펴볼 것을 고르세요."
  },
  "c22-s42-u02-b04": {
    "previous": "생태계 조사 계획에 들어갈 항목 두 가지를 고르세요.",
    "previousVersion": 1,
    "prompt": "생태계 조사 계획을 세우려고 해요. 조사할 내용 두 가지를 고르세요."
  },
  "c22-s42-u02-b08": {
    "previous": "곰팡이를 생물 요소로 분류한 근거를 고르세요.",
    "previousVersion": 1,
    "prompt": "곰팡이를 생물 요소로 나누는 까닭을 고르세요."
  },
  "c22-s42-u02-b11": {
    "previous": "생산자라는 역할을 판단하는 기준을 고르세요.",
    "previousVersion": 1,
    "prompt": "어떤 생물이 생산자인지 알아보려면 무엇을 살펴야 할까요?"
  },
  "c22-s42-u02-b25": {
    "previous": "친구가 만든 화살표의 오류를 고치고 까닭을 설명하세요.",
    "previousVersion": "20261106-ecology-readable-workbook",
    "prompt": "친구가 그린 화살표를 자료의 먹이 관계에 맞게 고치세요. 그렇게 고친 까닭도 설명하세요."
  },
  "c22-s42-u02-b27": {
    "previous": "여러 사슬에서 같은 생물을 연결해 그물을 만들 때 알맞은 방법을 고르세요.",
    "previousVersion": 1,
    "prompt": "여러 먹이 사슬에 같은 생물이 나와요. 이 사슬들을 하나의 먹이그물로 만드는 알맞은 방법을 고르세요."
  },
  "c22-s42-u02-b29": {
    "previous": "제시한 그물에서 두 먹이 사슬에 공통으로 들어가는 소비자 이름을 쓰세요.",
    "previousVersion": "20261106-ecology-readable-workbook",
    "prompt": "그림의 두 먹이 사슬에 모두 나오는 소비자의 이름을 쓰세요."
  },
  "c22-s42-u02-b30": {
    "previous": "두 사슬을 하나의 먹이그물로 합칠 때 공통 생물을 어떻게 표시할지 설명하세요.",
    "previousVersion": 1,
    "prompt": "두 먹이 사슬을 하나의 먹이그물로 만들려고 해요. 두 사슬에 모두 나오는 생물을 어떻게 표시할지 설명하세요."
  },
  "c22-s42-u02-b32": {
    "previous": "먹이 관계가 복잡하면 생존에 유리할 수 있는 까닭을 고르세요.",
    "previousVersion": 1,
    "prompt": "여러 먹이 관계가 연결되어 있으면 생물이 살아가는 데 도움이 될 수 있어요. 그 까닭을 고르세요."
  },
  "c22-s42-u02-b33": {
    "previous": "먹이그물만으로 확정할 수 없는 것을 고르세요.",
    "previousVersion": 1,
    "prompt": "이 먹이그물 그림만 보고는 알 수 없는 것을 고르세요."
  },
  "c22-s42-u02-b34": {
    "previous": "먹이 생물이 줄었을 때 실제 영향을 조사할 항목 두 가지를 고르세요.",
    "previousVersion": 1,
    "prompt": "먹이가 되는 생물이 줄었어요. 다른 생물에게 어떤 영향이 있는지 알아보려면 무엇을 조사해야 할까요? 두 가지를 고르세요."
  },
  "c22-s42-u02-b37": {
    "previous": "카드로 만든 먹이그물 모형의 한계로 알맞은 것을 고르세요.",
    "previousVersion": "20261106-ecology-readable-workbook",
    "prompt": "카드로 만든 먹이그물 모형이 실제 생태계를 모두 보여 주지는 못해요. 이 모형이 나타내지 못하는 점을 고르세요."
  },
  "c22-s42-u02-b40": {
    "previous": "모형과 조사 기록이 다를 때 어떻게 고칠지 두 단계로 설명하세요.",
    "previousVersion": 1,
    "prompt": "먹이그물 모형이 조사 기록과 달라요. 먼저 무엇을 확인하고, 그다음 어떻게 고칠지 두 단계로 설명하세요."
  },
  "c22-s42-u02-b41": {
    "previous": "인간 활동이 생태계에 영향을 준 사례를 고르세요.",
    "previousVersion": 1,
    "prompt": "사람의 활동으로 생태계가 달라진 예를 고르세요."
  },
  "c22-s42-u02-b44": {
    "previous": "인간 활동의 영향을 알아보려고 함께 기록할 항목 두 가지를 고르세요.",
    "previousVersion": 1,
    "prompt": "사람의 활동이 생태계에 어떤 영향을 주었는지 알아보려고 해요. 함께 기록할 내용 두 가지를 고르세요."
  },
  "c22-s42-u02-b46": {
    "previous": "공기 오염을 줄이는 실천과 그 원인이 바르게 연결된 것을 고르세요.",
    "previousVersion": 1,
    "prompt": "공기 오염을 줄이는 행동과 그 행동이 도움이 되는 까닭을 알맞게 연결한 것을 고르세요."
  },
  "c22-s42-u02-b49": {
    "previous": "굴뚝 배출로 공기가 더러워진 사례의 오염 종류를 쓰세요.",
    "previousVersion": 1,
    "prompt": "굴뚝에서 나온 물질 때문에 공기가 더러워졌어요. 어떤 종류의 오염인지 쓰세요."
  },
  "c22-s42-u02-b52": {
    "previous": "땅에 쏟은 기름이 비를 따라 하천에 들어갔습니다. 타당한 설명을 고르세요.",
    "previousVersion": 1,
    "prompt": "땅에 쏟은 기름이 빗물에 쓸려 하천으로 들어갔어요. 이 일을 알맞게 설명한 것을 고르세요."
  },
  "c22-s42-u02-b53": {
    "previous": "물이 맑아진 사진만 본 뒤 쓸 수 있는 판단을 고르세요.",
    "previousVersion": "20261106-ecology-readable-workbook",
    "prompt": "물이 맑아진 사진을 보았어요. 이 사진만 보았을 때 알맞은 설명을 고르세요."
  },
  "c22-s42-u02-b55": {
    "previous": "빗물에 쓸려 하천으로 들어갈 수 있는 쓰레기를 줄이는 계획을 행동·장소·확인 방법과 함께 쓰세요.",
    "previousVersion": 1,
    "prompt": "빗물에 쓸려 하천으로 들어갈 수 있는 쓰레기를 줄이려고 해요. 어디에서 무엇을 할지, 쓰레기가 줄었는지 어떻게 확인할지 넣어 계획을 쓰세요."
  },
  "c22-s42-u02-b56": {
    "previous": "도로로 나뉜 숲에서 먼저 조사할 항목을 고르세요.",
    "previousVersion": 1,
    "prompt": "숲이 도로 때문에 나뉘었어요. 먼저 무엇을 조사하면 좋을지 고르세요."
  },
  "c22-s42-u02-b58": {
    "previous": "공원 이용과 생물 보전을 함께 고려한 의견을 고르세요.",
    "previousVersion": 1,
    "prompt": "사람이 공원을 이용하면서 생물도 보호할 수 있는 의견을 고르세요."
  },
  "c22-s42-u02-b60": {
    "previous": "학교 숲을 지나는 길을 새로 낼 때 조사할 점과 훼손을 줄일 대안을 하나씩 제안하세요.",
    "previousVersion": 1,
    "prompt": "학교 숲을 지나는 길을 새로 내려고 해요. 먼저 무엇을 조사할지 한 가지 쓰세요. 숲이 덜 망가지도록 길을 내는 방법도 한 가지 제안하세요."
  },
  "c22-s42-u02-b64": {
    "previous": "보전 실천을 돌아보는 데 필요한 항목 두 가지를 고르세요.",
    "previousVersion": 1,
    "prompt": "생태계를 지키려고 한 행동을 돌아보려면 어떤 기록이 필요할까요? 두 가지를 고르세요."
  },
  "c22-s42-u02-b68": {
    "previous": "개인 실천과 지역의 역할을 바르게 연결한 것을 고르세요.",
    "previousVersion": 1,
    "prompt": "개인이 할 수 있는 일과 지역에서 맡을 일을 알맞게 연결한 것을 고르세요."
  },
  "c22-s42-u02-b71": {
    "previous": "보전 포스터에서 조사 근거가 가장 잘 드러난 문장을 고르세요.",
    "previousVersion": 1,
    "prompt": "생태계 보전 포스터에 넣을 문장 중, 실제로 조사한 내용이 잘 드러난 것을 고르세요."
  },
  "c22-s42-u02-b73": {
    "previous": "저학년에게 보전 행동을 안내할 때 알맞은 구성을 고르세요.",
    "previousVersion": 1,
    "prompt": "저학년 친구들에게 생태계를 지키는 행동을 알려 주려고 해요. 알맞은 설명 방법을 고르세요."
  },
  "c22-s42-u02-b75": {
    "previous": "사진 자료와 우리 반의 실제 실천을 함께 소개할 때 두 내용을 어떻게 구별해 제시할지 설명하세요.",
    "previousVersion": 1,
    "prompt": "사진 자료의 내용과 우리 반이 실제로 한 일을 함께 소개하려고 해요. 두 내용을 어떻게 나누어 보여 줄지 설명하세요."
  },
  "c22-s42-u02-b77": {
    "previous": "친구가 “언제 실천할지 없어”라고 말했습니다. 알맞은 수정을 고르세요.",
    "previousVersion": 1,
    "prompt": "친구가 “언제 실천할지 없어”라고 말했어요. 계획을 어떻게 고치면 좋을지 고르세요."
  },
  "c22-s42-u02-b79": {
    "previous": "공유 상태에서 아직 실행하지 않은 것을 뜻하는 말을 보기에서 골라 쓰세요.",
    "previousVersion": 1,
    "prompt": "친구에게 발표할 날만 정하고 아직 발표하지 않았어요. 지금 어떤 단계인지 보기에서 골라 쓰세요."
  },
  "c22-s42-u02-b80": {
    "previous": "실제로 의견을 받은 뒤 기록할 항목과 그 의견을 반영하는 방법을 설명하세요.",
    "previousVersion": 1,
    "prompt": "실제로 의견을 받은 뒤에는 무엇을 기록하면 좋을까요? 받은 의견을 보고 내용을 어떻게 고칠지도 설명하세요."
  },
  "c22-s42-u02-t03": {
    "previous": "곰팡이·세균처럼 죽은 생물이나 배출물을 분해해 양분을 얻는 생물은 ( ① )예요.",
    "previousVersion": 1,
    "prompt": "죽은 생물이나 배출물을 분해해 양분을 얻는 곰팡이와 세균을 ( ① )라고 해요."
  },
  "c22-s42-u02-t05": {
    "previous": "풀밭에서 한 가지만 바꾸고 3년 동안 지켜보았어요. 풀의 양이 어떻게 되었는지 써요.",
    "previousVersion": 1,
    "prompt": "풀밭 모형에서 한 가지 조건만 바꾼 결과예요. 각 조건에서 3년 뒤 풀의 양이 처음보다 어떻게 달라졌는지 써 보세요."
  },
  "c22-s42-u02-t07": {
    "previous": "풀 → 토끼 → 여우만 사는 풀밭에서 여우가 모두 사라졌어요. 몇 해 뒤의 모습으로 알맞은 것은?",
    "previousVersion": 1,
    "prompt": "풀 → 토끼 → 여우의 먹이 관계만 나타낸 모형이에요. 여우가 모두 사라진 조건에서 몇 해 뒤의 모습으로 알맞은 것을 고르세요."
  },
  "c22-s42-u02-t12": {
    "previous": "「여우는 토끼를 잡아먹으니, 여우가 모두 사라지면 풀밭이 더 좋아진다」는 친구의 생각을 풀밭 실험 결과를 근거로 고쳐 써요.",
    "previousVersion": 1,
    "prompt": "친구는 “여우는 토끼를 잡아먹으니, 여우가 모두 사라지면 풀밭이 더 좋아진다”고 생각해요. 풀밭 모형의 결과를 보고 이 생각을 고쳐 써 보세요."
  }
};
const clone=value=>JSON.parse(JSON.stringify(value));
const cache=new WeakMap();
export function ecologyElementaryCurrentItems(rows,unit){
 if(unit!==UNIT||!Array.isArray(rows))return rows;
 let changed=false;
 const next=rows.map(q=>{
  const patch=bankPatches[q.id];
  if(!patch||q.status!=='authored'||!['authored-supplement','authored-lesson'].includes(q.sourceRef?.type)||(q.contentVersion||1)!==patch.previousVersion||q.prompt!==patch.previous)return q;
  changed=true;if(cache.has(q))return cache.get(q);
  const current={...q,prompt:patch.prompt,contentVersion:ECOLOGY_ELEMENTARY_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion||1}]};
  cache.set(q,current);return current;
 });return changed?next:rows;
}
export function withEcologyElementaryWorkbook(workbook){
 if(workbook.unit!==UNIT)return workbook;
 let changed=false;
 const questions=workbook.questions.map(q=>{
  const patch=workbookPatches[q.no];
  if(!patch||q.id!==UNIT+'-w'+String(q.no).padStart(3,'0')||!['authored-workbook','authored-supplement'].includes(q.sourceRef?.type)||q.prompt!==patch.previous)return q;
  changed=true;return {...q,prompt:patch.prompt};
 });return changed?{...workbook,questions}:workbook;
}
export function withEcologyElementaryClassroom(unit,mod){
 const items=ecologyElementaryCurrentItems(mod.classroomItems,unit);
 return items===mod.classroomItems?mod:{...mod,classroomItems:items};
}
