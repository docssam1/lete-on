// 4-1 Ⅱ 물의 상태 변화 — 5E 화면·교재 구성(문항 id는 s41-u02.js의 items 참조)
// docssam 말풍선은 한 문장·25자 안팎·~해요체. mood: talk|surprised|thinking|praise|encourage
import { iceReading } from '../reading/other-units.reading.js';
export const freezeLesson = {
  unitId: 's41-u02', grade: 4, title: '물의 상태 변화', hero: '얼음 병 저울',
  engage: {
    say: [{ mood: 'surprised', text: '어? 얼린 페트병이 뚱뚱해졌어요!' }, { mood: 'thinking', text: '물이 얼면 무엇이 달라질까요?' }],
    scene: 'freeze-bottle',
    question: '물을 반쯤 담은 병을 얼리면 높이와 무게는 어떻게 될까요?',
    predictions: [
      { id: 'both', text: '높이도 올라가고 무게도 늘어난다' },
      { id: 'height', text: '높이는 올라가고 무게는 그대로다' },
      { id: 'down', text: '높이는 내려가고 무게는 줄어든다' },
    ],
    answer: 'height',
    wrongNote: '실험 결과는 달랐어요. 얼면 부피만 늘고 무게는 그대로였어요.',
  },
  explore: {
    say: [{ mood: 'talk', text: '물을 얼렸다 녹이며 재어 봐요.' }],
    modes: ['lab', 'scene', 'home'],
    lab: {
      kind: 'freeze', amounts: [60, 100, 140],   // amounts: 추가 탐구(얼음 병 저울)·두 팀 배틀용
      goal: '시험관 속 물을 얼렸다가 녹이며, 처음 물·다 언 얼음·다 녹은 물의 높이와 무게를 재어 표에 적어 보세요.',
      columns: ['단계', '높이(cm)', '무게(g)'],
      rowText: (r) => `${r.step} → 높이 ${Number(r.height).toFixed(1)} cm, 무게 ${Number(r.mass).toFixed(1)} g`,
    },
    home: {
      title: '얼음 병 저울 실험', minutes: 20, guardian: true,
      materials: [
        { name: '주방 저울', qty: '1개', have: 'buy', buy: { coupangUrl: null, query: '주방 전자저울 1g', priceKRW: null, rocket: true } },
        { name: '작은 플라스틱 병(뚜껑 있는 것)', qty: '1개', have: 'home' },
        { name: '유성 매직', qty: '1개', have: 'home' },
        { name: '냉동실', qty: '', have: 'home' },
      ],
      steps: [
        '플라스틱 병에 물을 반쯤 넣고 뚜껑을 닫아요.',
        '물 높이에 매직으로 선을 긋고, 저울로 무게를 재어 적어요.',
        '병을 냉동실에 넣고 물이 다 얼 때까지 기다려요(반나절 정도).',
        '꺼내서 얼음 높이를 선과 비교하고, 바로 무게를 다시 재어 적어요.',
        '얼음이 다 녹으면 높이와 무게를 한 번 더 재어 봐요.',
      ],
      safety: ['유리병은 쓰지 않아요. 얼면서 깨질 수 있어요.', '병을 가득 채우지 말고 반쯤만 넣어요.', '꺼낸 병 겉에 맺힌 물방울은 닦고 무게를 재요(응결한 물이 무게에 더해져요).'],
      kitUrl: 'https://lete-on.gfieldacademy.net/science-lab/v2/#/s41-u02/kit',
      qr: '../assets/qr-s41-u02-kit.svg',
    },
  },
  explain: {
    say: [{ mood: 'talk', text: '물의 상태 변화를 정리해 볼까요?' }],
    analogy: '얼음·물·수증기는 모두 물이에요. 같은 용기에서 물의 출입 없이 얼리거나 녹일 때 무게를 비교해요. 열린 접시에서는 증발한 물이 공기 중으로 나가요.',
    principle: '물이 얼면 부피는 늘어나고 무게는 변하지 않아요. 얼음이 녹으면 부피가 다시 줄어들어요.',
    // 시험관 기록(처음 물·다 언 얼음·다 녹은 물)에서만 말한다 — 결론은 학생이 적은 값에서 나온다.
    fromData: (rows) => {
      const at = (s) => rows.find((r) => r && r.step === s), w = at('처음 물'), i = at('다 언 얼음'), m = at('다 녹은 물');
      if (!w || !i) return rows.length ? '시험관 실험에서 처음 물과 다 언 얼음을 적으면 비교해 줄게요.' : '';
      const f = (v) => Number(v).toFixed(1), dir = (a, b) => (b > a ? '늘었고' : b < a ? '줄었고' : '그대로였고');
      const g = w.mass === i.mass ? `무게는 ${f(w.mass)} g으로 같았어요.` : `무게는 ${f(w.mass)} g에서 ${f(i.mass)} g으로 달라졌어요.`;
      return `네 기록: 처음 물이 얼었더니 높이는 ${f(w.height)} cm에서 ${f(i.height)} cm로 ${dir(w.height, i.height)}, ${g}`
        + (m ? ` 다 녹은 물은 높이 ${f(m.height)} cm, 무게 ${f(m.mass)} g이었어요.` : '');
    },
    cards: ['s41-u02-b01', 's41-u02-b02', 's41-u02-b03', 's41-u02-b04'],
    table: 's41-u02-b05',
    miniTest: ['s41-u02-b06'],
  },
  elaborate: {
    say: [{ mood: 'thinking', text: '얼음은 왜 물에 뜰까요?' }],
    items: ['s41-u02-b07', 's41-u02-b08', 's41-u02-b09', 's41-u02-b14'],
    reading: {
      magazine: iceReading,
      title: '공기에서 물을 얻는 두 방법',
      text: '차가운 면에서 수증기가 물방울이 되는 것은 응결이에요. 안개 포집 그물은 이미 공중에 떠 있던 액체 물방울을 붙잡아 모아요. 두 과정을 구별해요. 어느 장치든 주변 조건에 따라 모이는 양이 달라 실제로 확인해야 해요. 수업에서 모은 물은 맛보지 않고 관찰·측정에만 써요.',
    },
    report: true,
  },
  evaluate: {
    say: [{ mood: 'praise', text: '마지막으로 세 문제만 풀어 봐요!' }],
    items: ['s41-u02-b10', 's41-u02-b11', 's41-u02-b12', 's41-u02-b13'], pass: 3,
  },
  report: {
    title: '얼음 병 저울 탐구보고서',
    sections: [
      { key: 'wonder', label: '① 궁금한 점', from: 'engage.question' },
      { key: 'problem', label: '② 탐구 문제', hint: '예) 물이 얼면 부피와 무게는 어떻게 변할까?' },
      { key: 'hypothesis', label: '③ 가설(내 예상)', from: 'engage.prediction' },
      { key: 'vars', label: '④ 조건', hint: '바꿀 조건 / 같게 할 조건 / 측정할 것', default: '바꿀 조건: 물의 상태(처음 물 → 다 언 얼음 → 다 녹은 물)\n같게 할 조건: 같은 시험관·고무마개, 같은 저울과 컵, 잴 때마다 바깥 물기 닦기\n측정할 것: 물(얼음) 기둥의 높이(cm), 시험관 전체의 무게(g)' },
      { key: 'materials', label: '⑤ 준비물', from: 'explore.home.materials' },
      { key: 'steps', label: '⑥ 실험 과정', from: 'explore.home.steps' },
      { key: 'result', label: '⑦ 결과', from: 'explore.lab.table' },
      { key: 'conclusion', label: '⑧ 결론', hint: '결과에서 알 수 있는 것을 써요.' },
      { key: 'more', label: '⑨ 더 알고 싶은 점·아쉬운 점' },
    ],
    checks: ['바꾼 조건이 하나뿐인가요?', '얼기 전과 후의 무게를 같은 저울로 쟀나요?', '결론이 결과에서 나왔나요?'],
  },
};

// 현행 전체 단원: 위 얼음 병 수업 정의와 기존 모형/저장 기록은 보존한다.
import {inquiry} from '../activities/s41-u02.inquiry.js';
const q=n=>`s41-u02-b${String(n).padStart(2,'0')}`;
export const recordsLesson={unitId:inquiry.unit,grade:4,title:inquiry.title,hero:'다섯 변화 관찰·물을 얻는 장치 만들기',
 engage:{say:[{mood:'thinking',text:'끓이지 않은 물도 어디로 갈까요?'},{mood:'talk',text:'관찰한 근거로 물을 모으는 장치를 만들어요.'}],question:'얼음·물·수증기로 바뀌는 모습을 어떻게 확인하고 물을 따로 모을까요?',predictions:[{id:'observe',text:'조건과 실제 관찰을 확인해 상태 변화와 수집 경로를 설명한다.'},{id:'heat',text:'물을 반드시 끓여야만 수증기가 되므로 다른 관찰은 필요 없다.'},{id:'more',text:'아직 모르므로 관찰하고 장치를 만들어 더 확인하고 싶다.'}],answer:'observe',predictionNote:'예상과 실제 결과를 나중에 근거로 비교해요.'},
 explore:{say:[{mood:'talk',text:'직접 관찰·자료·계획을 구별해 남겨요.'}],modes:['lab','model','scene','home'],modeLabels:{lab:'내 물 탐구 기록',model:'물기둥 모형',scene:'얼음 병3D',home:'실제 활동 방법'},scene:'freeze-bottle',modelLab:freezeLesson.explore.lab,modelLabel:'얼었다 녹는 물기둥 모형',modelNotice:'무게는 물+병(가정20g)의 모형 값이며, 높이 칸은 실제cm가 아니에요.',
 lab:{kind:'inquiry',config:inquiry,rowsKey:'waterInquiryRows',goal:'여덟 활동의 실제 조건·관찰·설계·제작·시험·의견과 미실행 계획을 구별해 보관해요.',columns:['활동','보관한 기록'],rowText:r=>r.title},
 home:{title:'물의 변화를 관찰하고 물 모으기 장치 만들기',minutes:255,duration:'여러 차시로 나누는 계획 예시예요. 얼리기·증발·장치 관찰의 대기 시간은 별도이며 며칠에 걸칠 수 있어요.',guardian:true,materials:[{name:'얼음·물·작은 접시·같은 재질의 안전한 투명 컵',qty:'교사가 준비·물기 확인',have:'home'},{name:'냉동용으로 확인한 곧은 투명 플라스틱 용기·뚜껑',qty:'여유 공간·제품 안내는 교사 확인',have:'home'},{name:'같은 저울·높이 표시·단위/시간 기록 도구',qty:'같은 측정 범위 확인',have:'home'},{name:'끓음 시범 장치',qty:'교사가 준비·조작, 학생은 안전거리 관찰',have:'home'},{name:'큰 그릇·처음 빈 컵·투명 덮개·고정 재료·가벼운 둥근 물체',qty:'실제 장치 제작·안정된 받침',have:'home'}],steps:inquiry.activities.map(a=>a.title+' — '+a.steps.join(' ')),safety:['가열은 교사가 맡아요. 학생은 뜨거운 용기·물·수증기에 손이나 얼굴을 가까이 대지 않아요. 사고·불편·물 쏟음은 즉시 교사에게 알려 학교 대응 절차를 따라요.','냉동용 제품 안내·뚜껑·충분한 여유 공간을 교사가 확인해요. 유리병·가득 찬 용기는 얼리지 않아요. 차가운 얼음을 오래 맨손으로 잡지 않아요.','장치는 실온 물·안전한 햇빛 자리에서 교사와 만들어요. 학생 혼자 칼 가공·가열·무거운 누름돌을 사용하지 않아요. 고정·컵 입구와 물 높이·혼입을 확인해요.','모은 물은 맛보지 않고 실험 표시를 붙여요. 직접/자료/모형·계획·미제작·미시험을 구별하며 모형 칸을 실제cm로 쓰지 않아요.']}},
 explain:{say:[{mood:'talk',text:'조건과 관찰 근거로 상태 변화를 설명해요.'}],analogy:'얼음·물·수증기는 모두 물이에요. 직접 본 변화와 설명·자료를 구별해요. 수증기는 눈에 보이지 않고 흰 김은 작은 물방울이에요.',principle:'물의 출입이 없는 같은 물·용기에서 얼 때 부피는 늘고 녹을 때 줄며 전체 무게는 같아요. 증발·끓음은 물이 수증기로, 응결은 수증기가 물로 변하는 변화예요. 장치에서 증발·응결·수집의 경로를 이어 만들고 시험해요.',cards:[15,25,31,39].map(q),table:q(52),miniTest:[q(20),q(44)],fromData:rows=>rows.length?`보관한 활동 ${rows.length}개의 실제 조건·관찰·제작·시험·의견을 열어 설명해요. 저장 수는 실제 수행이나 공식 점수가 아니에요.`:'보관한 탐구 기록이 아직 없어요. 직접 관찰·자료/모형·계획을 구별해 남겨요.'},
 elaborate:{say:[{mood:'thinking',text:'물방울이 생겼나요, 컵에 모였나요?' }],reading:{title:'물방울 관찰과 수집 성공을 구별해요',text:'큰 그릇에서 물이 증발하고 덮개에서 수증기가 물방울로 변해도, 컵에 떨어지지 않으면 따로 모으는 기능은 아직 확인되지 않았어요. 컵의 처음 상태와 물방울 길·고정·원래 물이 튄 일을 살펴요. 설계 그림과 실제 만들기, 받은 의견과 실제 시험 결과도 나누어 남겨요. 실제로 고친 뒤 같은 조건에서 다시 비교해요. 안개 포집 그물은 이미 액체인 작은 물방울을 붙잡는 과정으로 차가운 면의 새 응결과 구별해요. 수업에서 모은 물은 맛보지 않아요.'},items:[q(54),q(62),q(78)],report:true,reportNote:'여덟 활동의 실제 관찰·설계·제작·시험·의견과 미실행 계획을 정리해요. 그림이 담긴 기록 자료는 내 탐구 기록에서 내려받아요.'},
 evaluate:{say:[{mood:'encourage',text:'자료 응답과 실제 만든 근거를 따로 확인해요.'}],items:[q(47),q(55),q(63)],pass:2,performanceNote:'자료 문제를 맞혔다고 실제 관찰·장치 만들기·시험·의견 교환을 한 것으로 세지 않아요. 실제 수행은 선생님과 근거를 확인해요.'},
 report:{title:'물의 상태 변화 · 관찰과 장치 만들기 보고서',sections:[{key:'waterQuestion',label:'① 알아볼 문제·직접/자료/계획 구별'},...inquiry.activities.map((a,i)=>({key:'water_'+a.id,from:'inquiry.'+a.id,label:`${i+2}. ${a.title} · 조건과 실제 근거`})),{key:'waterMore',label:'⑩ 더 확인할 점·다음 계획'}],checks:['물의 세 상태·주변 예와 직접/자료를 구별했나요?','같은 용기의 높이·전체 무게·단위·출입·겉 물기를 확인했나요?','증발과 끓음의 공통점·교사 시범 안전을 설명했나요?','컵 바깥의 응결과 누수/흘림을 비교했나요?','장치를 실제 만들었는지·고정·직접 혼입 방지를 확인했나요?','물방울과 컵 수집·실제 의견·수정·재시험·미확인을 구별했나요?']}
};

// 2026-10-20 ⑤ 같은 패턴 정리: 기본 수업 = 위 freezeLesson(3D 실험 수업 · 예상→실험→개념). 탐구 기록 앱은 선택 기능(#/s41-u02/records)으로 옮겼다
// — 저장 키 sciLab.inquiry.s41-u02와 보고서 화면(#/s41-u02/report)은 그대로 기록장과 이어진다. 기록 교재는 #/s41-u02/records-book.
export const lesson = { ...freezeLesson,
  explore: { ...freezeLesson.explore, records: { ...recordsLesson.explore.lab, title: '탐구 기록장(선택)', note: '다섯 변화 관찰·물을 얻는 장치 제작과 의견을 따로 기록하고 싶을 때 써요. 수업은 기록 없이도 끝까지 할 수 있어요.' } },
  elaborate: { ...freezeLesson.elaborate, report: false },
  report: recordsLesson.report };
