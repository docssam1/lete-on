(function(root){'use strict';
 const rows=[
  {
    "id": 1,
    "key": "hyperfocus-bank-q01",
    "label": "앞과 뒤에서 본 모양을 보고 전체 쌓기나무 개수 맞히기"
  },
  {
    "id": 2,
    "key": "hyperfocus-bank-q02",
    "label": "상자를 꽉 채우기 위해 큐브가 몇 개 더 필요한지 찾기"
  },
  {
    "id": 3,
    "key": "hyperfocus-bank-q03",
    "label": "검은색, 흰색이 교대로 쌓인 블록의 색깔별 개수 세기"
  },
  {
    "id": 4,
    "key": "hyperfocus-bank-q04",
    "label": "반대편까지 구멍이 뻥 뚫린 블록에서 남은 개수 구하기"
  },
  {
    "id": 5,
    "key": "hyperfocus-bank-q05",
    "label": "전체 16개일 때, 그림에서 안 보이는 블록 개수 찾기"
  },
  {
    "id": 6,
    "key": "hyperfocus-bank-q06",
    "label": "블록 모양을 여러 방향에서 관찰했을 때 절대 나올 수 없는 모습 고르기"
  },
  {
    "id": 7,
    "key": "hyperfocus-bank-q07",
    "label": "전개도를 접어서 완성된 주사위 모양 찾기"
  },
  {
    "id": 8,
    "key": "hyperfocus-bank-q08",
    "label": "주사위를 화살표 방향으로 굴렸을 때 바닥에 닿는 숫자 맞히기"
  },
  {
    "id": 9,
    "key": "hyperfocus-bank-q09",
    "label": "위, 앞, 옆에서 본 그림을 바탕으로 전체 블록 수 구하기"
  },
  {
    "id": 18,
    "key": "hyperfocus-bank-q18",
    "label": "블록 4개를 모두 써서 만들 수 있는 서로 다른 입체 모양 개수 찾기"
  },
  {
    "id": 10,
    "key": "hyperfocus-bank-q10",
    "label": "규칙에 따라 빈칸에 색종이가 몇 장 겹쳐 있는지 맞히기"
  },
  {
    "id": 11,
    "key": "hyperfocus-bank-q11",
    "label": "숫자가 적힌 종이를 두 번 접었을 때, 가장 위로 올라오는 숫자들의 합 구하기"
  },
  {
    "id": 12,
    "key": "hyperfocus-bank-q12",
    "label": "두 번 접은 종이에 구멍을 하나 뚫고 펼쳤을 때 총 구멍 수 맞히기"
  },
  {
    "id": 13,
    "key": "hyperfocus-bank-q13",
    "label": "5개의 블록 조각 중 4개를 써서 네모난 빈칸을 꽉 채우기"
  },
  {
    "id": 14,
    "key": "hyperfocus-bank-q14",
    "label": "도형을 빈틈없이 자르되, 가장 적은 개수의 정사각형으로 만들기"
  },
  {
    "id": 15,
    "key": "hyperfocus-bank-q15",
    "label": "U자 모양 도형에 선 딱 2개만 그어서 6조각으로 만들기"
  },
  {
    "id": 16,
    "key": "hyperfocus-bank-q16",
    "label": "선을 따라 그릴 수 있는 크고 작은 정사각형 모두 세기"
  },
  {
    "id": 17,
    "key": "hyperfocus-bank-q17",
    "label": "크기별로 정사각형 개수 모두 찾아 더하기"
  },
  {
    "id": 19,
    "key": "hyperfocus-bank-q19",
    "label": "점판 위의 점을 이어 그릴 수 있는 정삼각형 모두 찾기"
  },
  {
    "id": 32,
    "key": "hyperfocus-bank-q32",
    "label": "거울에 비쳐서 잘못된 디지털 숫자 모양을 보고 원래 올바른 수 맞히기"
  },
  {
    "id": 38,
    "key": "hyperfocus-bank-q38",
    "label": "10명이 둥글게 앉았을 때, 오른쪽으로 2칸 간 후 마주 보는 사람 찾기"
  },
  {
    "id": 22,
    "key": "hyperfocus-bank-q22",
    "label": "잘못된 뺄셈식에서 숫자 2개 자리를 쏙 바꿔서 올바른 식 만들기"
  },
  {
    "id": 23,
    "key": "hyperfocus-bank-q23",
    "label": "숫자들 사이에 더하기(+)나 빼기(-)를 넣어서 정답 27 만들기"
  },
  {
    "id": 24,
    "key": "hyperfocus-bank-q24",
    "label": "1부터 9까지 다 더한 식에서 + 하나를 -로 바꿔서 답 29 만들기"
  },
  {
    "id": 25,
    "key": "hyperfocus-bank-q25",
    "label": "위, 아래 두 가지 힌트 칸에 '공통으로' 들어갈 수 있는 숫자 찾아 다 더하기"
  },
  {
    "id": 27,
    "key": "hyperfocus-bank-q27",
    "label": "숫자 미로의 기호를 하나도 빠짐없이 한 번씩 다 밟고 지나가며 올바른 식 만들기"
  },
  {
    "id": 34,
    "key": "hyperfocus-bank-q34",
    "label": "숫자 카드로 두 자리 수 뺄셈을 만들 때 결과가 가장 작게 나오도록 배치하기"
  },
  {
    "id": 40,
    "key": "hyperfocus-bank-q40",
    "label": "네모 모서리에 있는 숫자들의 합 규칙을 파악해서 빈칸 채우기"
  },
  {
    "id": 21,
    "key": "hyperfocus-bank-q21",
    "label": "4가지 힌트를 모두 만족하는 네 자리 자물쇠 비밀번호 풀기"
  },
  {
    "id": 29,
    "key": "hyperfocus-bank-q29",
    "label": "가로, 세로로 변하는 숫자 규칙을 찾아서 물음표 빈칸 채우기"
  },
  {
    "id": 31,
    "key": "hyperfocus-bank-q31",
    "label": "0부터 8까지의 숫자를 알파벳 식에 하나씩 대입해서 암호 해독하기"
  },
  {
    "id": 35,
    "key": "hyperfocus-bank-q35",
    "label": "달리기하는 5명의 앞뒤 힌트를 읽고 4등이 누구인지 이름 맞히기"
  },
  {
    "id": 37,
    "key": "hyperfocus-bank-q37",
    "label": "5명이 둥근 원탁에 둘러앉은 힌트를 보고 각자 자리 이름 쓰기"
  },
  {
    "id": 39,
    "key": "hyperfocus-bank-q39",
    "label": "4명이 좋아하는 과일에 대한 힌트를 읽고 B가 좋아하는 과일 2개 맞히기"
  },
  {
    "id": 41,
    "key": "hyperfocus-bank-q41",
    "label": "버튼을 누를 때마다 모양과 색깔이 바뀌는 규칙을 찾아 마지막 모습 그리기"
  },
  {
    "id": 20,
    "key": "hyperfocus-bank-q20",
    "label": "1, 2, 4, 8cm 막대를 겹치지 않게 이어 붙여 만들 수 있는 길이의 가짓수 구하기"
  },
  {
    "id": 30,
    "key": "hyperfocus-bank-q30",
    "label": "3점, 2점, 1점 과녁에 화살을 3번 쏴서 나올 수 있는 서로 다른 점수 개수 찾기"
  },
  {
    "id": 42,
    "key": "hyperfocus-bank-q42",
    "label": "7칸 중 3칸을 칠하는데 서로 옆에 딱 붙지 않게 색칠하는 가짓수 찾기"
  },
  {
    "id": 43,
    "key": "hyperfocus-bank-q43",
    "label": "4가지 색 중 3개를 골라 둥근 원탁 빈칸에 색칠하는 모든 경우 찾기"
  },
  {
    "id": 44,
    "key": "hyperfocus-bank-q44",
    "label": "백의 자리 숫자가 일의 자리보다 작고, 합이 13이며 숫자 0이 꼭 들어가는 세 자리 수 모두 찾기"
  },
  {
    "id": 45,
    "key": "hyperfocus-bank-q45",
    "label": "미술관에서 동물원으로 가는 가장 가까운 길 가짓수 구하기"
  },
  {
    "id": 26,
    "key": "hyperfocus-bank-q26",
    "label": "성냥개비 3개를 다른 곳으로 옮겨서 틀린 식을 올바르게 고치기"
  },
  {
    "id": 28,
    "key": "hyperfocus-bank-q28",
    "label": "동그라미 여러 개가 겹친 곳에서 안의 네 숫자 합이 97이 되도록 빈칸 구하기"
  },
  {
    "id": 36,
    "key": "hyperfocus-bank-q36",
    "label": "지민이와 지수 사이에 6명이 있을 때, 줄을 선 전체 인원이 가장 많을 때와 가장 적을 때 구하기"
  },
  {
    "id": 50,
    "key": "hyperfocus-bank-q50",
    "label": "지우개(4cm)와 맞물려 있는 여러 학용품의 길이를 비교해서 각각의 치수 구하기"
  },
  {
    "id": 51,
    "key": "hyperfocus-bank-q51",
    "label": "정각마다 그 시간만큼 치고 30분마다 한 번 치는 시계가 7시부터 2시까지 친 횟수"
  },
  {
    "id": 52,
    "key": "hyperfocus-bank-q52",
    "label": "평형을 이룬 여러 양팔 저울 그림을 보고 도형 간의 무게 비율 알아내기"
  },
  {
    "id": 54,
    "key": "hyperfocus-bank-q54",
    "label": "1, 1, 2, 3, 5... 규칙으로 40번째까지 숫자를 쓸 때 홀수는 몇 개인지 찾기"
  },
  {
    "id": 33,
    "key": "hyperfocus-bank-q33",
    "label": "이기면 2칸 위로, 지면 1칸 아래로 가는 가위바위보 게임에서 최종 위치 차이 구하기"
  },
  {
    "id": 46,
    "key": "hyperfocus-bank-q46",
    "label": "\"사탕 반을 주고 남은 것 반을 먹어 2개가 남았다\"를 보고 처음 사탕 개수 구하기"
  },
  {
    "id": 47,
    "key": "hyperfocus-bank-q47",
    "label": "아이들이 카드를 이리저리 바꾸고 전학생이 온 서사를 거꾸로 돌려 처음 학생 수 맞히기"
  },
  {
    "id": 48,
    "key": "hyperfocus-bank-q48",
    "label": "혼자 하면 6일 걸리는 민수와 12일 걸리는 철수가 같이 레고를 조립할 때 걸리는 기간"
  },
  {
    "id": 49,
    "key": "hyperfocus-bank-q49",
    "label": "3마리가 3일에 45개 줍는 도토리를, 10마리가 100개 주울 때 걸리는 시간"
  },
  {
    "id": 53,
    "key": "hyperfocus-bank-q53",
    "label": "글을 읽고 지우개 1개가 클립 몇 개인지 알아내기"
  }
];
 const modeKey='hyperfocus-bank-individual-mode';
 const keys=new Set([...rows.map(r=>r.key),modeKey]);
 const api={version:'hf-type-access-v1',modeKey,list:()=>rows.map(r=>({...r})),keys:()=>[...keys],has:key=>keys.has(key),keyFor:id=>{const n=typeof id==='number'?id:typeof id==='string'&&/^\\d{1,2}$/.test(id)?Number(id):NaN;return Number.isInteger(n)&&n>=1&&n<=54?'hyperfocus-bank-q'+String(n).padStart(2,'0'):null;}};
 root.HFTypeAccessCatalog=Object.freeze(api);if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
