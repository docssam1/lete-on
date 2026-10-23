// 발명 아이디어 갤러리 — 학생 발명대회 수상작을 「어떤 발명 기법으로, 어떤 원리로 풀었나」로 정리한 것.
// 원장 2026-10-23: 「발명은 모방에서 온다. 우선 생각하게 하고 아이디어를 얻도록」 — 보고서의 내 아이디어 칸을 쓴 뒤에 열린다(report.js gate).
// 수상작은 이름·불편·아이디어·원리를 우리 말로 짧게 정리했다(설명서 원문을 옮기지 않는다). 대회·연도는 출처 확인용.
// 수상 학생 이름은 싣지 않는다(미성년자). 기법(tech)은 보도에 적힌 것이 드물어 대부분 우리가 붙인 것이다 — 아이에게는 「이렇게 볼 수도 있다」로 보여 준다.
// 출처: 2026-10-23 웹 검색 요약(보도·정부 브리핑). 원문 대조 전이므로 틀린 곳이 보이면 src를 열어 고친다.
// 전국과학 = 전국학생과학발명품경진대회(국립중앙과학관) · 발명전 = 대한민국학생발명전시회(특허청·한국발명진흥회)
export const TECHNIQUES = [
  { id: 'add', name: '더하기', ask: '두 물건이나 기능을 합치면?' },
  { id: 'sub', name: '빼기', ask: '불필요한 부분을 없애면?' },
  { id: 'shape', name: '모양 바꾸기', ask: '모양·구조를 바꾸면?' },
  { id: 'size', name: '크기 바꾸기', ask: '더 크게·작게·길게·접게 하면?' },
  { id: 'material', name: '재료 바꾸기', ask: '다른 재료로 만들면?' },
  { id: 'use', name: '쓰임 바꾸기', ask: '다른 곳에 쓰면?' },
  { id: 'reverse', name: '반대로 하기', ask: '위아래·안팎·순서를 뒤집으면?' },
  { id: 'borrow', name: '자연·다른 분야 빌리기', ask: '동식물이나 다른 분야는 이 문제를 어떻게 풀까?' },
];
export const SCENES = [
  { id: 'school', name: '학교·놀이' }, { id: 'home', name: '집' }, { id: 'safety', name: '안전·재난' }, { id: 'health', name: '위생·건강' }, { id: 'env', name: '환경' }, { id: 'care', name: '배려(어르신·환자)' }, { id: 'work', name: '일·여가' },
];
// { name, problem, idea, principle, tech: [기법 id], scene, level: 'elem'|'mid', award: '대회·연도·상', src: 출처 주소 }
export const WORKS = [
  { name: '사용 여부를 알 수 있는 마스크', problem: '새 마스크와 이미 쓴 마스크를 구별할 수 없다.', idea: '숨의 물기에 색이 변하는 종이, 문지르면 글자가 남는 라벨, 물을 머금으면 줄어드는 알갱이 — 세 가지 표시 방법을 붙였다.', principle: '수분 지시약(색 변화), 흡수와 건조', tech: ['add'], scene: 'health', level: 'elem', award: '2019 전국과학 대통령상 · 초4', src: 'https://edaily.co.kr/News/Read?mediaCodeNo=257&newsId=03876966622648656' },
  { name: '한 칸씩 멈추는 회전판 보드게임', problem: '회전판을 정확히 한 칸만 돌리기 어렵다.', idea: '스프링 걸쇠(볼플런저)가 원판을 한 칸마다 딸깍 멈추게 했다.', principle: '탄성력', tech: ['add'], scene: 'school', level: 'elem', award: '2018 전국과학 국무총리상 · 초5', src: 'https://www.korea.kr/goNews/resources/attaches/2018.08/13/e94464ff9f3994512fd4444b8540fb26.pdf' },
  { name: '손대지 않는 버스 하차벨', problem: '여러 사람이 손으로 누르는 하차벨로 병균이 옮는다.', idea: '발판이나 손가락 움직임을 알아채는 센서로 누르지 않고 알리고, 자외선 빛으로 소독한다.', principle: '센서, 자외선 살균', tech: ['sub', 'add'], scene: 'health', level: 'elem', award: '2020 발명전 국무총리상 · 초6', src: 'https://www.ktv.go.kr/content/view?content_id=606920' },
  { name: '납작한 플러그와 콘센트', problem: '튀어나온 플러그 때문에 가구를 벽에 붙이지 못해 공간이 버려진다.', idea: '플러그와 콘센트를 납작하게 바꿔 벽 쪽 공간을 쓸 수 있게 했다.', principle: '', tech: ['shape', 'size'], scene: 'home', level: 'mid', award: '2020 발명전 국무총리상 · 중2', src: 'https://www.seoul.co.kr/news/society/2020/08/07/20200807024021' },
  { name: '헛구름 막는 초보자용 인라인스케이트', problem: '처음 타는 사람은 바퀴가 미끄러져 엉덩방아를 찧는다.', idea: '안전벨트가 갑자기 당기면 잠기는 구조를 빌려, 바퀴가 갑자기 구르면 멈추게 했다.', principle: '관성', tech: ['borrow', 'add'], scene: 'school', level: 'elem', award: '2021 전국과학 국무총리상 · 초5', src: 'https://www.hellodd.com/news/articleView.html?idxno=94296' },
  { name: '폐필터로 만든 스스로 맑아지는 물감 물통', problem: '붓 빤 물을 자주 갈아야 하고, 물감 속 금속이 하수로 흘러간다.', idea: '버려지는 정수기 필터를 물통에 넣어 물감 물을 걸러 다시 쓴다.', principle: '여과·흡착', tech: ['use'], scene: 'env', level: 'mid', award: '2021 발명전 국무총리상 · 중2', src: 'https://www.khan.co.kr/article/202109141200021' },
  { name: '접어서 들고 다니는 2차 사고 방지 바리케이드', problem: '사고 난 차 뒤로 다른 차가 와서 또 사고가 난다.', idea: '바리케이드를 접어 가방처럼 들고 다니다 펼쳐 세운다.', principle: '', tech: ['size'], scene: 'safety', level: 'elem', award: '2022 발명전 대통령상 · 초5', src: 'https://news.nate.com/view/20220804n15763' },
  { name: '당겨서 접어 올리는 킥보드 후미등', problem: '전동 킥보드 뒤 불빛이 낮아 뒤차에서 잘 안 보인다.', idea: '후미등을 당기고 접어 올려 높이를 바꿀 수 있게 했다.', principle: '빛이 보이는 높이와 거리', tech: ['shape'], scene: 'safety', level: 'mid', award: '2022 발명전 국무총리상 · 중3', src: 'https://news.nate.com/view/20220804n15763' },
  { name: '방향을 알리고 발밑이 보이는 구조용 들것', problem: '들것을 함께 든 구조대원끼리 말이 잘 안 통하고 발밑이 안 보인다.', idea: '손잡이 스위치로 진동·불빛·소리를 보내 방향을 알리고, 발밑을 비춘다.', principle: '전기 회로', tech: ['add'], scene: 'safety', level: 'elem', award: '2023 전국과학 국무총리상 · 초4', src: 'https://www.khan.co.kr/science/science-general/article/202309051254001' },
  { name: '기름 잡는 국자', problem: '국물 위에 뜬 기름을 걷어 내기 어렵다(가족 건강 걱정).', idea: '국자에 담으면 기름은 위에 남고, 들어 올리면 맑은 국물만 아래로 빠진다.', principle: '밀도 차(기름이 뜬다), 계영배·사이펀', tech: ['borrow', 'shape'], scene: 'home', level: 'mid', award: '2024 전국과학 대통령상 · 중3', src: 'https://www.khan.co.kr/article/202409031257001' },
  { name: '밟으면 소독되는 계단 손잡이', problem: '많은 사람이 잡는 계단 손잡이가 깨끗하지 않다.', idea: '계단을 밟으면 자외선 빛이 손잡이를 소독한다.', principle: '자외선 살균', tech: ['add'], scene: 'health', level: 'elem', award: '2024 전국과학 특상 · 초6', src: 'https://www.khan.co.kr/article/202409031257001' },
  { name: '물의 힘으로 잠기는 맨홀 뚜껑', problem: '큰비가 오면 맨홀 뚜껑이 솟아 빠지고 사람이 빠지는 사고가 난다.', idea: '맨홀 아래 ㄱ자 철판이 물에 밀려 올라오며 뚜껑을 저절로 잠근다.', principle: '수압', tech: ['reverse', 'add'], scene: 'safety', level: 'mid', award: '2024 발명전 대통령상 · 중1', src: 'https://www.korea.kr/briefing/policyBriefingView.do?newsId=156648736' },
  { name: '짜서 다시 쓰는 우산 빗물 제거기', problem: '젖은 우산을 담는 일회용 비닐이 많이 버려진다.', idea: '빗물을 빨아들이는 재료로 닦고, 짜서 다시 쓴다.', principle: '흡수', tech: ['material', 'sub'], scene: 'env', level: 'elem', award: '2024 발명전 국무총리상 · 초5', src: 'https://www.korea.kr/briefing/policyBriefingView.do?newsId=156648736' },
  { name: '지진에 대비한 장력 구조 아기 침대', problem: '지진 때 떨어지는 물건으로부터 아기를 지키기 어렵다.', idea: '줄의 당기는 힘과 막대의 미는 힘이 서로 버티는 구조(텐세그리티)로 침대 틀을 만들었다.', principle: '힘의 분산', tech: ['borrow', 'shape'], scene: 'safety', level: 'mid', award: '2024 발명전 국무총리상 · 중2', src: 'https://www.korea.kr/briefing/policyBriefingView.do?newsId=156648736' },
  { name: '한 번에 꺾어 따는 감귤 가위', problem: '귤을 딴 뒤 꼭지를 한 번 더 잘라야 하고 손아귀가 아프다.', idea: '한 손으로 밀고 당기면 한 번에 꺾어 따지고, 날에는 안전 덮개가 있다.', principle: '지레, 빗면', tech: ['sub', 'shape'], scene: 'work', level: 'elem', award: '2025 전국과학 최우수상 · 초6', src: 'https://www.hankyung.com/article/2026082801101' },
  { name: '저절로 바로 서는 욕실화 발판', problem: '욕실화가 쓰러지거나 문에 끼어 신기 불편하다.', idea: '문이 움직이면 발판의 무게중심이 옮겨 가며 욕실화가 바로 놓인다.', principle: '무게중심(오뚝이)', tech: ['shape'], scene: 'home', level: 'elem', award: '2025 전국과학 최우수상 · 초6', src: 'https://www.hankyung.com/article/2026082801101' },
  { name: '돌려서 박고 빼는 둥근 머리 캠핑 팩', problem: '캠핑 팩 머리가 좁아 박기 어렵고, 뽑다가 허리와 어깨를 다친다.', idea: '머리를 넓게 바꾸고, 보조 장치를 끼워 돌려서 뽑는다.', principle: '축바퀴·나사(돌리는 힘)', tech: ['size', 'add'], scene: 'work', level: 'elem', award: '2025 발명전 국무총리상 · 초6', src: 'https://www.gnnews.co.kr/news/articleView.html?idxno=615554' },
  { name: '손으로 문 열고 스토퍼까지 내리는 문손잡이', problem: '짐을 든 어르신이 발로 문 받침(도어 스토퍼)을 내리지 못한다.', idea: '손잡이를 조금 돌리면 문만 열리고, 더 돌리면 문 받침이 내려온다. 전기나 센서 없이 기계로만.', principle: '기계식 연동(돌림 → 내림)', tech: ['add'], scene: 'care', level: 'elem', award: '2026 전국과학 대통령상 · 초5', src: 'https://www.khan.co.kr/article/202608281254001/' },
  { name: '뒤로 가면 자세가 바로잡히는 휠체어', problem: '휠체어에 오래 앉은 어르신의 몸이 앞으로 흘러내린다.', idea: '공장의 컨베이어처럼, 휠체어를 뒤로 밀면 앉는 판이 움직여 몸을 뒤로 당겨 준다.', principle: '회전 운동 → 직선 운동', tech: ['borrow'], scene: 'care', level: 'mid', award: '2026 전국과학 국무총리상 · 중3', src: 'https://www.khan.co.kr/article/202608281254001/' },
  { name: '쓰레기를 걸러 내는 하수구', problem: '하수구에 쓰레기가 막혀 물이 넘친다.', idea: '물이 휜 면을 따라 흐르는 성질로 물과 쓰레기를 나누고, 센서와 모터로 치운다.', principle: '코안다 효과(물이 곡면을 따라 흐름)', tech: ['add', 'borrow'], scene: 'env', level: 'elem', award: '2026 전국과학 최우수상 · 초', src: 'https://www.khan.co.kr/article/202608281254001/' },
  { name: '불이 났을 때 쓰는 호흡 그립톡', problem: '불이 나면 연기를 마셔 대피하기 어렵다.', idea: '휴대폰 뒤 그립톡을 떼어 펼치면 코와 입을 가리는 필터(활성탄)가 된다.', principle: '흡착(활성탄), 여과', tech: ['use', 'add'], scene: 'safety', level: 'elem', award: '2026 발명전 대통령상 · 초', src: 'https://www.newspim.com/news/view/20260830000035' },
  { name: '등에 메는 수액 폴대', problem: '수액 폴대 바퀴가 문턱에 걸리고, 환자의 손이 자유롭지 않다.', idea: '바퀴를 없애고 가방처럼 메게 했다. X자 벨트로 무게를 나누고 높이를 바꿀 수 있다.', principle: '무게(하중) 분산', tech: ['sub', 'shape'], scene: 'care', level: 'elem', award: '2026 발명전 국무총리상 · 초6', src: 'https://www.newspim.com/news/view/20260830000035' },
  { name: '고데기 끄라고 알려 주는 보조 플러그', problem: '고데기를 켜 둔 채 외출해 불이 날 수 있다.', idea: '플러그에 알람을 달아 켜 둔 시간이 길면 알려 준다.', principle: '전기 회로', tech: ['add'], scene: 'home', level: 'elem', award: '2024 발명전 수상작', src: 'https://www.korea.kr/briefing/policyBriefingView.do?newsId=156648736' },
];
// 심사에서 보는 것(대회 안내 요약) — 갤러리 위에 「이 기준으로 내 아이디어를 점검해 봐요」로 보여 준다
export const JUDGING = [
  { contest: '전국학생과학발명품경진대회', items: ['창의성', '탐구성', '실용성', '노력도', '경제성'] },
  { contest: '대한민국학생발명전시회', items: ['창의성', '필요성', '경제성', '실용성', '완성도'] },
];
