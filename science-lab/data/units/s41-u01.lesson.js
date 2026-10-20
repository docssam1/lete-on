// 4-1 Ⅰ 자석의 이용 — 5E 화면·교재 구성(문항 id는 s41-u01.js의 items 참조)

// ── 5E 학습 흐름 (v2 화면·교재가 같은 데이터를 쓴다) ──
// docssam 말풍선은 한 문장·25자 안팎·~해요체. mood: talk|surprised|thinking|praise|encourage
import { magnetReading } from '../reading/other-units.reading.js';
export const ringTowerLesson = {
  unitId: 's41-u01', grade: 4, title: '자석의 이용', hero: '고리 자석 탑',
  engage: {
    say: [{ mood: 'surprised', text: '어? 자석이 공중에 떠 있어요!' }, { mood: 'thinking', text: '왜 떠 있을까요? 먼저 예상해 봐요.' }],
    scene: 'ring-tower',
    question: '막대에 끼운 고리 자석이 어떤 것은 떠 있고, 어떤 것은 붙어 있어요. 왜 그럴까요?',
    predictions: [
      { id: 'light', text: '떠 있는 자석이 더 가벼워서' },
      { id: 'pole', text: '마주 보는 면이 서로 밀어 내서' },
      { id: 'rod', text: '막대가 자석을 붙잡아서' },
    ],
    answer: 'pole',
  },
  explore: {
    say: [{ mood: 'talk', text: '고리를 뒤집어서 탑을 쌓아 봐요.' }],
    modes: ['lab', 'scene', 'home'],
    lab: {
      kind: 'ring-tower', rings: 4,
      goal: '가장 높은 탑과 가장 낮은 탑을 만들어 보세요.',
      columns: ['쌓은 모양(아래→위)', '떠 있는 층', '탑 높이(칸)'],
    },
    home: {
      title: '고리 자석 탑 쌓기', minutes: 15, guardian: false,
      materials: [
        { name: '고리 자석', qty: '4개 이상', have: 'buy', buy: { coupangUrl: null, query: '고리자석 링자석 페라이트', priceKRW: null, rocket: true } },
        { name: '연필 또는 나무젓가락', qty: '1개', have: 'home' },
        { name: '지우개 또는 찰흙(받침)', qty: '1개', have: 'home' },
        { name: '자', qty: '1개', have: 'home' },
      ],
      steps: [
        '지우개나 찰흙에 연필을 똑바로 꽂아 받침을 만들어요.',
        '고리 자석을 하나씩 연필에 끼워요.',
        '자석이 뜨면 그대로, 붙으면 뒤집어서 다시 끼워 봐요.',
        '자로 탑의 높이를 재어 표에 적어요.',
        '가장 높은 탑과 가장 낮은 탑을 만든 방법을 비교해요.',
      ],
      safety: ['자석을 입에 넣지 않아요. 작은 자석은 삼키면 위험해요.', '자석끼리 세게 부딪치면 깨질 수 있어요.', '휴대폰·카드 가까이에 두지 않아요.'],
      kitUrl: 'https://lete-on.gfieldacademy.net/science-lab/v2/#/s41-u01/kit',
      qr: '../assets/qr-s41-u01-kit.svg',
    },
  },
  explain: {
    say: [{ mood: 'talk', text: '실험에서 본 것을 정리해 볼까요?' }],
    analogy: '자석의 두 극은 서로 다른 성격의 친구예요. 같은 극끼리는 밀어 내고, 다른 극끼리는 끌어당겨요.',
    fromData: '네가 만든 가장 높은 탑에서는 {floating}층이 떠 있었어요. 마주 보는 면이 같은 극이었기 때문이에요.',
    cards: ['s41-u01-a02', 's41-u01-a03', 's41-u01-a04', 's41-u01-a06'],
    table: 's41-u01-a07',
    miniTest: ['s41-u01-a11'],
  },
  elaborate: {
    say: [{ mood: 'thinking', text: '이 원리로 무엇을 만들 수 있을까요?' }],
    items: ['s41-u01-a22', 's41-u01-a21', 's41-u01-a23'],
    reading: {
      magazine: magnetReading,
      title: '떠서 달리는 열차',
      text: '자기부상 열차는 레일과 열차 바닥의 자석이 서로 밀어 내는 힘으로 떠서 달려요. 바퀴가 레일에 닿지 않아서 소리가 작고 흔들림이 적어요.',
    },
    report: true,
  },
  evaluate: {
    say: [{ mood: 'praise', text: '마지막으로 세 문제만 풀어 봐요!' }],
    items: ['s41-u01-a08', 's41-u01-a16', 's41-u01-a24'], pass: 2,
  },
  report: {
    title: '고리 자석 탑 탐구보고서',
    sections: [
      { key: 'wonder', label: '① 궁금한 점', from: 'engage.question' },
      { key: 'problem', label: '② 탐구 문제', hint: '예) 고리 자석을 어떻게 쌓으면 탑이 가장 높아질까?' },
      { key: 'hypothesis', label: '③ 가설(내 예상)', from: 'engage.prediction' },
      { key: 'vars', label: '④ 조건', hint: '바꿀 조건 / 같게 할 조건 / 측정할 것', default: '바꿀 조건: 고리 자석을 끼우는 방향\n같게 할 조건: 고리 자석의 개수·크기, 연필\n측정할 것: 탑 높이, 떠 있는 층 수' },
      { key: 'materials', label: '⑤ 준비물', from: 'explore.home.materials' },
      { key: 'steps', label: '⑥ 실험 과정', from: 'explore.home.steps' },
      { key: 'result', label: '⑦ 결과', from: 'explore.lab.table' },
      { key: 'conclusion', label: '⑧ 결론', hint: '결과에서 알 수 있는 것을 써요.' },
      { key: 'more', label: '⑨ 더 알고 싶은 점·아쉬운 점' },
    ],
    checks: ['바꾼 조건이 하나뿐인가요?', '결론이 결과에서 나왔나요?', '표에 숫자를 정확히 적었나요?'],
  },
};


// 현행 단원은 재료·거리·극·나침반·생활 설계를 모두 다룬다. 위 고리 탑 원고는 보존한다.
import {inquiry} from '../activities/s41-u01.inquiry.js';
const q=n=>`s41-u01-b${String(n).padStart(2,'0')}`;
export const recordsLesson={unitId:inquiry.unit,grade:4,title:inquiry.title,hero:'자석 관찰·비교·생활 속 장치 설계',
 engage:{observationBased:true,say:[{mood:'thinking',text:'반짝이는 금속은 모두 자석에 붙을까요? 실제 시료를 살펴봐요.'}],question:'자석과 물체·두 자석 사이의 힘을 어떤 관찰로 설명하고 생활에 이용할까요?',predictions:[{id:'observe',text:'재료와 조건을 확인하여 실제 결과를 비교해야 한다.'},{id:'metal',text:'금속은 모두 붙으므로 비교할 필요가 없다.'},{id:'more',text:'아직 모르므로 여러 시료와 자석으로 더 확인하고 싶다.'}],answer:'observe',predictionNote:'예상과 실제 결과는 나중에 근거로 비교해요.'},
 explore:{say:[{mood:'talk',text:'같게 할 조건과 실제 결과를 구별해 남겨요.'}],modes:['lab','model','scene','home'],modeLabels:{lab:'내 자석 탐구 기록',model:'고리 탑 모형',scene:'고리 탑 3D',home:'실제 활동 방법'},scene:'ring-tower',modelLab:ringTowerLesson.explore.lab,
 lab:{kind:'inquiry',config:inquiry,rowsKey:'magnetInquiryRows',goal:'일곱 활동의 실제 조건·관찰·설계·의견과 아직 할 계획을 구별해 보관해요.',columns:['활동','보관한 기록'],rowText:r=>r.title},
 home:{title:'자석을 관찰하고 생활 속 장치 설계하기',minutes:210,duration:'여러 차시로 나누는 계획 예시예요. 제작·시험은 교사와 가능 여부를 정해요.',guardian:true,materials:[{name:'끝이 뭉툭한 철·알루미늄·나무·고무·종이·플라스틱 시료',qty:'실제 재료 확인',have:'home'},{name:'교사가 극을 확인한 막대자석·고리 자석',qty:'작은 자석은 교사 관리',have:'home'},{name:'비자성 가이드·안정된 받침',qty:'교사가 준비·고정 확인',have:'home'},{name:'나침반·방위 확인 자료·거리/높이 도구',qty:'제품의 N/S 표식과 단위 확인',have:'home'},{name:'얇은 종이·플라스틱 판·장치 설계 재료·기록 도구',qty:'실제 두께·간격·안전 확인',have:'home'}],steps:inquiry.activities.map(a=>a.title+' — '+a.steps.join(' ')),safety:['자석은 입·코·귀에 넣지 않아요. 작은 자석은 교사가 관리하고 사용 전후 개수를 확인해요. 깨진 자석은 쓰지 않아요.','자석을 세게 부딪치거나 손이 끼지 않게 해요. 강한 자석·자석 절단/가열/타격·학생 철가루 직접 살포를 요구하지 않아요.','가이드·받침·부품 고정은 교사가 확인해요. 뾰족한 연필을 직접 꽂거나 큰 수조에 손을 넣지 않아요. 자석은 전자 기기·카드에서 멀리 보관해요.','설계만 해도 되며 미제작·미시험은 그대로 밝혀요. 화면 모형 칸·예시를 실제 관찰값으로 바꾸지 않아요.']}},
 explain:{say:[{mood:'talk',text:'실제 조건과 관찰 근거를 가리켜 자석의 성질을 설명해요.'}],analogy:'어떤 물건이 어떤 재료로 만들어졌는지 살핀 뒤 반응으로 확인해요. 모양이 비슷하다는 것만으로 같은 결과를 정하지 않아요.',principle:'자석과 철 시료는 끌어당기며, 두 자석은 같은 극끼리 밀어 내고 다른 극끼리 끌어당겨요. 거리·사이 판·가이드·나침반의 외부 조건을 살피고, 확인한 성질로 생활 장치를 설계해요.',cards:[2,10,18,26].map(q),table:q(42),miniTest:[q(34),q(46)],fromData:rows=>rows.length?`보관한 활동 ${rows.length}개의 조건·실제 결과·설계와 의견을 열어 설명해요. 저장 수는 실제 수행이나 공식 점수가 아니에요.`:'보관한 탐구 기록이 아직 없어요. 실제 관찰·자료/모형·계획을 구별하여 남겨요.'},
 elaborate:{say:[{mood:'thinking',text:'어떤 불편을 해결하고 두 부품 사이의 어떤 힘을 이용할까요?'}],reading:{title:'잡히는 기능과 안전한 사용을 함께',text:'자석으로 종이를 잡는 장치를 설계할 때는 자석이 있다는 설명만으로 충분하지 않아요. 어느 철 부분과 자석이 마주 보는지, 또는 두 자석의 어느 극이 마주 보는지 표시해야 해요. 종이 두께와 간격·자석 고정·꺼내는 방법도 생각해요. 종이가 잡혀도 부품이 빠지거나 손이 끼면 고칠 점이 있어요. 여러 타당한 설계를 비교하고 실제 사용자 의견과 시험 결과를 구별해요. 아직 시험하지 않았다면 확인할 방법을 적으면 돼요. 설계 단계에서 반드시 실제 제작까지 해야 하는 것은 아니에요.'},items:[q(40),q(56),q(64)],report:true,reportNote:'일곱 활동의 실제 조건·그림·설계·시험·의견과 계획을 구별해 정리해요. 그림이 담긴 자료는 내 탐구 기록에서 내려받아요.'},
 evaluate:{say:[{mood:'encourage',text:'자료 문제와 실제 관찰·설계의 근거를 따로 확인해요.'}],items:[q(3),q(27),q(51)],pass:2,performanceNote:'자료 문제를 맞혔다고 실제 관찰·장치 제작·시험·의견 교환을 한 것으로 세지 않아요. 열린 설계와 실제 수행은 선생님과 근거를 확인해요.'},
 report:{title:'자석의 이용 · 관찰과 생활 속 설계 보고서',sections:[{key:'magnetQuestion',label:'① 알아볼 문제·직접 관찰과 자료/계획 구별'},...inquiry.activities.map((a,i)=>({key:'magnet_'+a.id,from:'inquiry.'+a.id,label:`${i+2}. ${a.title} · 조건과 실제 근거`})),{key:'magnetMore',label:'⑨ 더 확인할 점·다음 계획'}],checks:['시료의 확인한 재료·예상·실제 결과를 구별했나요?','거리·단위·사이 판·같게 한 조건과 한계를 밝혔나요?','마주 보는 극·고리 가이드·실제/모형을 구별했나요?','나침반의 외부 조건과 실제 방향을 설명했나요?','장치의 목적·부품·성질·고정·확인 계획을 연결했나요?','실제 제작·시험·의견·수정과 앞으로 할 일을 구별했나요?']}
};

// 2026-10-20 ⑤ 같은 패턴 정리: 기본 수업 = 위 ringTowerLesson(3D 실험 수업 · 예상→실험→개념). 탐구 기록 앱은 선택 기능(#/s41-u01/records)으로 옮겼다
// — 저장 키 sciLab.inquiry.s41-u01와 보고서 화면(#/s41-u01/report)은 그대로 기록장과 이어진다. 기록 교재는 #/s41-u01/records-book.
export const lesson = { ...ringTowerLesson,
  explore: { ...ringTowerLesson.explore, records: { ...recordsLesson.explore.lab, title: '탐구 기록장(선택)', note: '자석 관찰·분류·생활 속 장치 설계와 의견을 따로 기록하고 싶을 때 써요. 수업은 기록 없이도 끝까지 할 수 있어요.' } },
  elaborate: { ...ringTowerLesson.elaborate, report: false },
  report: recordsLesson.report };
