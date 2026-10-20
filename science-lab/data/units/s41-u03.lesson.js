// 4-1 Ⅲ 땅의 변화 — 5E 화면·교재 구성(문항 id는 s41-u03.js의 items 참조)
// docssam 말풍선은 한 문장·25자 안팎·~해요체. mood: talk|surprised|thinking|praise|encourage
import { riverReading } from '../reading/other-units.reading.js';
export const hillLesson = {
  unitId: 's41-u03', grade: 4, title: '땅의 변화', hero: '흙 언덕 물길',
  engage: {
    say: [{ mood: 'surprised', text: '비 온 뒤 운동장에 물길이 생겼어요!' }, { mood: 'thinking', text: '흐르는 물은 흙을 어떻게 바꿀까요?' }],
    scene: 'hill-stream',
    question: '흙 언덕 꼭대기에 뿌린 색 모래는 물을 흘려보내면 어디로 갈까요?',
    predictions: [
      { id: 'stay', text: '꼭대기에 그대로 남아 있다' },
      { id: 'down', text: '물을 따라 내려가 아래쪽에 쌓인다' },
      { id: 'gone', text: '물에 녹아 없어진다' },
    ],
    answer: 'down',
    wrongNote: '실험 결과는 달랐어요. 색 모래는 깎여서 아래쪽에 쌓였어요.',
  },
  explore: {
    say: [{ mood: 'talk', text: '경사와 물의 양을 바꿔 흘려 봐요.' }],
    modes: ['lab', 'scene', 'home'],
    lab: {
      kind: 'hill',
      goal: '경사와 물의 양을 고르고, 언덕 위쪽을 눌러 컵 자리를 정한 뒤 물 붓기를 누르고 있어요. 컵이 비면 깎인 흙과 쌓인 흙을 표에 적어요.',
      columns: ['경사', '물의 양', '깎인 흙(칸)', '쌓인 흙(칸)'],
      rowText: (r) => `경사 ${r.slope}, 물 ${r.water} → 깎인 흙 ${r.cut}칸, 쌓인 흙 ${r.pile}칸`,
    },
    home: {
      title: '쟁반 흙 언덕 실험', minutes: 20, guardian: true,
      materials: [
        { name: '색 모래', qty: '한 줌', have: 'buy', buy: { coupangUrl: null, query: '색모래 만들기 재료', priceKRW: null, rocket: true } },
        { name: '넓은 쟁반(가장자리 있는 것)', qty: '1개', have: 'home' },
        { name: '화분 흙이나 모래', qty: '두 컵', have: 'home' },
        { name: '종이컵(바닥에 작은 구멍)', qty: '1개', have: 'home' },
        { name: '물', qty: '한 컵', have: 'home' },
      ],
      steps: [
        '쟁반 한쪽에 흙을 쌓아 언덕을 만들고, 반대쪽은 비워 둬요.',
        '언덕 꼭대기에 색 모래를 얇게 뿌려요.',
        '구멍 난 종이컵에 물을 붓고, 언덕 꼭대기에서 물이 천천히 흐르게 해요.',
        '색 모래와 흙이 어디로 가서 쌓이는지 관찰해 그림으로 그려요.',
        '언덕을 더 가파르게 다시 쌓고 같은 양의 물을 흘려 비교해 봐요.',
      ],
      safety: ['바닥에 신문지를 깔고 해요.', '흙 묻은 손으로 눈을 비비지 않아요.', '다 쓴 흙은 하수구에 버리지 말고 화분이나 흙에 돌려줘요.'],
      kitUrl: 'https://lete-on.gfieldacademy.net/science-lab/v2/#/s41-u03/kit',
      qr: '../assets/qr-s41-u03-kit.svg',
    },
  },
  explain: {
    say: [{ mood: 'talk', text: '흐르는 물이 한 일을 정리해 봐요.' }],
    analogy: '흐르는 물은 땅을 고치는 일꾼이에요. 높은 곳에서 흙을 깎아 싣고 가서, 낮고 느린 곳에 내려놓아요.',
    principle: '흐르는 물은 경사가 급한 위쪽을 깎고(침식), 흙을 옮겨(운반), 경사가 완만한 아래쪽에 쌓아요(퇴적).',
    fromData: (rows) => {
      if (!rows.length) return '';
      const when = (r) => `경사가 ${r.slope === '가파름' ? '가파르고' : '완만하고'} 물이 ${r.water === '많이' ? '많을' : '적을'} 때`;
      const hi = rows.reduce((a, b) => (b.cut > a.cut ? b : a)), lo = rows.reduce((a, b) => (b.cut < a.cut ? b : a));
      if (hi.cut === lo.cut) return `네 기록: ${when(hi)} 위쪽에서 ${hi.cut}칸이 깎여 아래쪽에 ${hi.pile}칸 쌓였어요. 조건을 바꿔 한 번 더 해 봐요.`;
      return `네 기록: ${when(hi)} ${hi.cut}칸으로 가장 많이 깎였고, ${when(lo)} ${lo.cut}칸으로 가장 적었어요. 깎인 만큼 아래에 쌓였어요.`;
    },
    cards: ['s41-u03-b01', 's41-u03-b02', 's41-u03-b03', 's41-u03-b04'],
    table: 's41-u03-b05',
    miniTest: ['s41-u03-b06'],
  },
  elaborate: {
    say: [{ mood: 'thinking', text: '굽은 강은 어느 쪽이 깎일까요?' }],
    items: ['s41-u03-b07', 's41-u03-b08', 's41-u03-b09'],
    reading: {
      magazine: riverReading,
      title: '돌하르방은 왜 구멍투성이일까',
      text: '제주도의 돌하르방은 현무암으로 만들어요. 현무암은 용암이 땅 위에서 빨리 식어 생긴 암석이라 알갱이가 작고 어두워요. 용암 속 가스가 빠져나간 자리가 구멍으로 남아 표면이 숭숭 뚫려 있어요.',
    },
    report: true,
  },
  evaluate: {
    say: [{ mood: 'praise', text: '마지막으로 세 문제만 풀어 봐요!' }],
    items: ['s41-u03-b10', 's41-u03-b11', 's41-u03-b12'], pass: 2,
  },
  report: {
    title: '흙 언덕 물길 탐구보고서',
    sections: [
      { key: 'wonder', label: '① 궁금한 점', from: 'engage.question' },
      { key: 'problem', label: '② 탐구 문제', hint: '예) 경사가 급할수록 흙이 더 많이 깎일까?' },
      { key: 'hypothesis', label: '③ 가설(내 예상)', from: 'engage.prediction' },
      { key: 'vars', label: '④ 조건', hint: '바꿀 조건 / 같게 할 조건 / 측정할 것', default: '바꿀 조건: 언덕의 경사\n같게 할 조건: 흙의 양, 물의 양, 물을 붓는 빠르기\n측정할 것: 깎인 흙과 쌓인 흙의 양' },
      { key: 'materials', label: '⑤ 준비물', from: 'explore.home.materials' },
      { key: 'steps', label: '⑥ 실험 과정', from: 'explore.home.steps' },
      { key: 'result', label: '⑦ 결과', from: 'explore.lab.table' },
      { key: 'conclusion', label: '⑧ 결론', hint: '결과에서 알 수 있는 것을 써요.' },
      { key: 'more', label: '⑨ 더 알고 싶은 점·아쉬운 점' },
    ],
    checks: ['바꾼 조건이 하나뿐인가요?', '물의 양과 붓는 빠르기를 같게 했나요?', '결론이 결과에서 나왔나요?'],
  },
};

import {inquiry} from '../activities/s41-u03.inquiry.js';
const q=n=>`s41-u03-b${String(n).padStart(2,'0')}`;
export const recordsLesson={unitId:inquiry.unit,grade:4,title:inquiry.title,hero:'물길·화산 모형·암석 분류·대처 실천',
 engage:{say:[{mood:'thinking',text:'땅의 변화는 어떤 근거로 알까요?'},{mood:'talk',text:'관찰·자료·모형을 구별해 살펴요.'}],question:'물길·화산·암석을 어떻게 알아보고 화산·지진의 영향에 안전하게 대처할까요?',predictions:[{id:'evidence',text:'같은 조건의 관찰·출처 있는 자료와 모형의 한계를 확인한다.'},{id:'looks',text:'한 장의 사진이나 산의 겉모양으로 모든 과정과 대처를 정한다.'},{id:'more',text:'아직 모르므로 관찰하고 실제로 연습하며 더 확인하고 싶다.'}],answer:'evidence',predictionNote:'예상과 실제 근거를 나중에 비교해요.'},
 explore:{say:[{mood:'talk',text:'직접 한 일과 자료·계획을 나눠 남겨요.'}],modes:['lab','model','scene','home'],modeLabels:{lab:'내 땅 탐구 기록',model:'언덕 물길 모형',scene:'언덕3D',home:'실제 활동 방법'},scene:'hill-stream',modelLab:hillLesson.explore.lab,modelLabel:'흙 언덕 물길 가상 모형',modelNotice:'깎인 흙·쌓인 흙의 가상 칸은 실제cm나 무게가 아니에요. 실제 강의 모든 조건을 재현하지 않아요.',
 lab:{kind:'inquiry',config:inquiry,rowsKey:'groundInquiryRows',goal:'여덟 활동의 조건·관찰·모형·분류·조사·실제 연습/의견과 미실행 계획을 구별해 보관해요.',columns:['활동','보관한 기록'],rowText:r=>r.title},
 home:{title:'땅의 변화를 관찰하고 안전하게 대처하기',minutes:225,duration:'여러 차시로 나누는 계획 예시예요. 조사·관찰·대처 연습을 교사와 준비하며, 한 번에 모든 활동을 마친 것으로 세지 않아요.',guardian:true,materials:[{name:'흙·넓은 쟁반·작은 물컵·기울기 받침·기록 도구',qty:'교사 준비·흙 가루/흘림 방지',have:'home'},{name:'교사 준비 점토 산·실온 물·작은 숟가락',qty:'열린 홈·안정된 받침, 가열 없음',have:'home'},{name:'교사 확인 현무암/화강암 표본·돋보기 또는 사진',qty:'같은 관찰 조건·받침',have:'home'},{name:'출처 있는 강/화산/지진 자료·학교 안전 계획',qty:'기관·장소/시기·확인 날짜·도움 방법',have:'home'}],steps:inquiry.activities.map(a=>a.title+' — '+a.steps.join(' ')),safety:['흙 언덕은 작은 쟁반에서 관찰해요. 구멍 가공은 교사가 맡고 흙을 입에 대거나 가루를 날리지 않아요. 흙은 하수구에 버리지 않아요.','화산 모형은 실온 물로 모습만 표현해요. 학생 가열·뜨거운 재료·가루/약품 혼합·연기 만들기를 요구하지 않아요. 실험 물은 마시지 않아요.','암석을 깨거나 가루 내기·냄새 맡기를 하지 않아요. 위험한 강가·실제 화산재/가스·지붕 청소에 접근하지 않아요.','학교 계획과 교사의 현장 확인을 우선해요. 흔들릴 때 몸 보호와 멈춘 뒤 이동을 구별하고 달리기·밀집·승강기 탑승·학생 가스/전기 조작을 하지 않아요. 불편이나 위험은 즉시 교사에게 알려요.']}},
 explain:{say:[{mood:'talk',text:'조건과 근거로 변화를 설명해요.'}],analogy:'직접 본 모습·자료의 설명·모형의 대응·내 추측을 나누면 땅의 변화를 더 정확히 설명할 수 있어요.',principle:'흐르는 물은 깎고·옮기고·쌓아요. 화산 모형은 일부 모습만 표현하며 실제 분출물의 고체/액체/기체를 구별해요. 현무암/화강암은 같은 조건의 색·알갱이·구멍을 함께 관찰해 분류해요. 화산·지진의 생활 영향을 조사하고 안전한 대처를 실제로 연습해요.',cards:[19,35,43,51].map(q),table:q(59),miniTest:[q(27),q(76)],fromData:rows=>rows.length?`보관한 활동 ${rows.length}개의 조건·관찰·자료/모형·분류·연습/의견을 열어 근거를 설명해요. 저장 수는 실제 수행이나 공식 점수가 아니에요.`:'보관한 탐구 기록이 아직 없어요. 실제로 한 일과 자료·모형·계획을 구별해 남겨요.'},
 elaborate:{say:[{mood:'thinking',text:'계획과 실제로 연습한 것은 어떻게 다를까요?'}],reading:{title:'자료의 근거에서 안전한 실천으로',text:'한 장의 사진이나 규모 숫자만으로 지진 피해의 모든 차이를 알 수는 없어요. 거리·지반·건물·대비 조건을 더 살펴요. 화산의 피해와 이로운 이용도 서로 다른 장소/시기의 자료를 구별해 조사해요. 안전 행동을 적은 계획과 교사와 실제로 연습한 행동은 달라요. 흔들릴 때 몸을 보호하고 멈춘 뒤 안내에 따라 질서 있게 이동하는 단계를 구별해요. 실제 어려움·의견·고친 점·재확인과 미실천 계획을 남겨요.'},items:[q(66),q(74),q(82)],report:true,reportNote:'여덟 활동의 직접 관찰·자료·모형·분류·조사·연습과 실제 의견을 정리해요. 그림이 담긴 기록 자료는 내 탐구 기록에서 내려받아요.'},
 evaluate:{say:[{mood:'encourage',text:'자료 답과 실제 수행의 근거를 따로 봐요.'}],items:[q(48),q(64),q(72)],pass:2,performanceNote:'자료 문제 정답은 실제 관찰·모형 제작·분류·대처 실천·소통의 증명이 아니에요. 실제 수행은 선생님과 근거를 확인해요.'},
 report:{title:'땅의 변화 · 관찰·분류·대처 보고서',sections:[{key:'groundQuestion',label:'① 알아볼 문제·직접/자료/모형/계획'},...inquiry.activities.map((a,i)=>({key:'ground_'+a.id,from:'inquiry.'+a.id,label:`${i+2}. ${a.title} · 조건과 실제 근거`})),{key:'groundMore',label:'⑩ 더 확인할 점·다음 계획'}],checks:['처음 언덕·물 양/붓는 위치/시간·한 조건 비교를 확인했나요?','강 지형 자료의 위치/시기·작용 근거·모형 한계를 구별했나요?','화산 모형의 대응/한계와 실제 분출물의 상태를 나눴나요?','두 암석의 특징·분류/수정·실제 의견을 남겼나요?','화산 피해/이용·지진 피해를 출처와 함께 조사했나요?','대처 계획과 실제 연습/어려움/보완·미실천을 구별했나요?']}
};

// 2026-10-20 ⑤ 같은 패턴 정리: 기본 수업 = 위 hillLesson(3D 실험 수업 · 예상→실험→개념). 탐구 기록 앱은 선택 기능(#/s41-u03/records)으로 옮겼다
// — 저장 키 sciLab.inquiry.s41-u03와 보고서 화면(#/s41-u03/report)은 그대로 기록장과 이어진다. 기록 교재는 #/s41-u03/records-book.
export const lesson = { ...hillLesson,
  explore: { ...hillLesson.explore, records: { ...recordsLesson.explore.lab, title: '탐구 기록장(선택)', note: '물길·화산 모형·암석 분류·대처 실천을 따로 기록하고 싶을 때 써요. 수업은 기록 없이도 끝까지 할 수 있어요.' } },
  elaborate: { ...hillLesson.elaborate, report: false },
  report: recordsLesson.report };
