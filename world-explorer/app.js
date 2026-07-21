import * as THREE from './vendor/three.module.js';
import { countries195, countryById } from './data/countries-195.js';
import { worldGeoJSON } from './data/world-lowres.js';
import {
  CHARACTER_PROFILES, SKIN_PRESETS, HAIR_PRESETS, JACKET_PRESETS, SCARF_PRESETS, HAT_OPTIONS, COMPANION_SKINS,
  loadCharacterState, saveCharacterState, applyProfile, profileFor
} from './character-data.js';
import { createExplorerCharacter, animateExplorer, createCubiCompanion } from './character.js';
import { CameraController } from './camera-controller.js';
import { WorldMapGame } from './map-game.js';

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const GAME_KEY = 'gfield-world-max-v1';
const VILLAGE_RADIUS = 25.4;

const defaultState = {
  version: 1,
  lang: 'ko',
  points: 0,
  streak: 0,
  solved: [],
  mastery: {},
  ownedItems: [],
  audio: false,
  village: { x: -2.8, z: 2.5, camera: { mode: 'explore', yaw: Math.PI * .25, zoom: 1, pitch: .92 } },
  sessions: 0
};

function loadGameState() {
  try {
    const saved = JSON.parse(localStorage.getItem(GAME_KEY) || '{}');
    return {
      ...defaultState,
      ...saved,
      village: { ...defaultState.village, ...(saved.village || {}), camera: { ...defaultState.village.camera, ...(saved.village?.camera || {}) } },
      mastery: saved.mastery || {},
      ownedItems: Array.isArray(saved.ownedItems) ? saved.ownedItems : []
    };
  } catch {
    return structuredClone(defaultState);
  }
}

let state = loadGameState();
let characterState = loadCharacterState();

const i18n = {
  ko: {
    rotateTitle: '휴대폰을 가로로 돌려 주세요', rotateBody: '세계 탐험 게임은 가로 화면에 맞춰져 있어요.',
    worldVillage: '세계 탐험 마을', character: '캐릭터', guide: '빛나는 게임 존으로 이동해 세계를 탐험하세요.',
    flagZone: '국기 광장', clueZone: '세계 도서관', mapZone: '지도 전망대', run: '달리기', enter: '입장', enterGame: '게임 시작', nearZone: '게임 존 도착', loadingVillage: '3D 세계 탐험 마을을 만드는 중...',
    village: '마을', findCountry: '나라 찾기', nameCountry: '나라 맞히기', shapeCountry: '윤곽 맞히기', flagMap: '국기로 찾기',
    unseen: '미발견', solved: '발견', target: '문제', confirm: '선택 확정', hint: '힌트', skip: '건너뛰기', nextQuestion: '다음 문제',
    sessionComplete: '탐험 세션 완료!', correctCount: '정답', earnedPoints: '획득 포인트', newCountries: '새 나라', again: '다시 도전', returnVillage: '마을로 돌아가기',
    chooseCharacter: '탐험가를 선택하세요', chooseCharacterBody: '캐릭터와 색상을 고르면 3D 마을에 바로 적용됩니다.', skinColor: '피부색', hairColor: '머리색', jacketColor: '재킷색', scarfColor: '스카프', applyCharacter: '캐릭터 적용',
    flagTitle: '국기를 보고 나라를 맞혀요', clueTitle: '단서를 읽고 나라를 맞혀요', locationTitle: '지도에서 나라를 찾아요',
    flagPrompt: '이 국기는 어느 나라일까요?', cluePrompt: '이 설명에 알맞은 나라는 어디일까요?', findPrompt: '{country}을(를) 지도에서 찾아보세요.', highlightedPrompt: '지도에서 빛나는 나라는 어디일까요?', shapePrompt: '이 지도 윤곽의 나라는 어디일까요?', flagMapPrompt: '{flag} 국기의 나라를 지도에서 찾아보세요.',
    selectOnMap: '지도를 확대하거나 이동한 뒤 나라를 선택하세요.', selectAnswer: '정답이라고 생각하는 나라를 선택하세요.', correct: '정답이에요!', wrong: '조금 아쉬워요', correctBody: '{country}! +{points}P', wrongBody: '정답은 {country}입니다.',
    firstDiscovery: '새로운 나라를 발견했어요!', capital: '수도', region: '지역', population: '인구 규모', area: '면적 규모',
    hintLength: '나라 이름은 {count}글자예요. {blank}', hintRegion: '지역 힌트: {region}', hintPopulation: '인구는 {population}, 면적은 {area} 정도예요.', hintFirst: '첫 글자 힌트: “{first}”로 시작해요.',
    cameraFollow: 'FOLLOW', cameraExplore: 'EXPLORE', cameraOverview: 'OVERVIEW',
    flagDescription: '국기를 자세히 보고 나라를 맞혀요.', clueDescription: '지리·문화·역사 단서를 읽고 나라를 찾아요.', mapDescription: '실제 세계지도에서 나라의 위치를 찾아요.', shopDescription: '탐험가를 선택하고 의상 색을 바꿔요.',
    guideZone: '탐험 안내소', guideDescription: '게임을 설명해 주는 큐비를 만나요.',
    chooseName: '탐험가 이름을 지어주세요', chooseNameBody: '마을에서 사용할 이름을 입력해 주세요.', nameInputPlaceholder: '이름을 입력하세요', saveName: '이름 정하기', changeName: '이름 바꾸기',
    hatShop: '모자 상점', companionShop: '큐비 색깔', yourPoints: '내 포인트', locked: '잠김', owned: '보유중', buy: '구매', notEnoughPoints: '포인트가 부족해요',
    guideWelcome: '안녕! 나는 큐비야. 궁금한 걸 눌러봐!', topicZones: '게임 존 안내', topicMap: '지도 게임 4종', topicShop: '포인트와 상점', topicCurriculum: '무엇을 배우나요?', back: '뒤로',
    guideZonesBody: '국기 광장은 국기로, 세계 도서관은 단서로, 지도 전망대는 지도로 나라를 맞히는 곳이야.',
    guideMapBody: '지도 전망대에는 나라 찾기·나라 맞히기·윤곽 맞히기·국기로 찾기, 4가지 게임이 있어.',
    guideShopBody: '문제를 맞히면 포인트(⭐)를 받아. 캐릭터 메뉴의 상점에서 모자와 큐비 색깔을 살 수 있어.',
    guideCurriculumBody: '이 놀이는 초등 사회 교과의 "세계 여러 나라의 자연과 문화" 단원과 이어져 있어.',
    installNow: '설치하기', installAndroid: '홈 화면에 설치하면 주소창 없이 앱처럼 전체화면으로 즐길 수 있어요!', installIOS: '공유 버튼 → "홈 화면에 추가"를 누르면 앱처럼 설치할 수 있어요!',
    populationBands: { 'under-5m': '500만 명 미만', '5m-20m': '500만~2천만 명', '20m-50m': '2천만~5천만 명', '50m-100m': '5천만~1억 명', '100m-300m': '1억~3억 명', '300m-1b': '3억~10억 명', 'over-1b': '10억 명 이상' },
    areaBands: { micro: '매우 작은 나라', small: '작은 나라', medium: '중간 크기 나라', large: '큰 나라', 'very-large': '매우 큰 나라' },
    continents: { asia: '아시아', europe: '유럽', africa: '아프리카', 'north-america': '북아메리카', 'south-america': '남아메리카', oceania: '오세아니아', other: '기타 지역' }
  },
  zh: {
    rotateTitle: '请横屏使用', rotateBody: '世界探索游戏已针对横屏优化。', worldVillage: '世界探索村', character: '角色', guide: '前往发光的游戏区域，开始探索世界。', flagZone: '国旗广场', clueZone: '世界图书馆', mapZone: '地图观景台', run: '奔跑', enter: '进入', enterGame: '开始游戏', nearZone: '到达游戏区', loadingVillage: '正在建造3D世界探索村...', village: '村庄', findCountry: '寻找国家', nameCountry: '猜国家', shapeCountry: '看轮廓', flagMap: '看国旗找', unseen: '未发现', solved: '已发现', target: '目标', confirm: '确认选择', hint: '提示', skip: '跳过', nextQuestion: '下一题', sessionComplete: '探索完成！', correctCount: '答对', earnedPoints: '获得积分', newCountries: '新国家', again: '再挑战', returnVillage: '返回村庄', chooseCharacter: '选择探险家', chooseCharacterBody: '选择角色和颜色后会立即应用到3D村庄。', skinColor: '肤色', hairColor: '发色', jacketColor: '外套', scarfColor: '围巾', applyCharacter: '应用角色', flagTitle: '看国旗猜国家', clueTitle: '读线索猜国家', locationTitle: '在地图上找国家', flagPrompt: '这是哪个国家的国旗？', cluePrompt: '哪个国家符合这些线索？', findPrompt: '请在地图上找到{country}。', highlightedPrompt: '地图上发光的是哪个国家？', shapePrompt: '这个国家轮廓属于哪里？', flagMapPrompt: '请在地图上找到{flag}国旗的国家。', selectOnMap: '移动或缩放地图，然后选择国家。', selectAnswer: '请选择你认为正确的国家。', correct: '回答正确！', wrong: '再试试看', correctBody: '{country}！+{points}P', wrongBody: '正确答案是{country}。', firstDiscovery: '发现了新的国家！', capital: '首都', region: '地区', population: '人口规模', area: '面积规模', hintLength: '国名有{count}个字：{blank}', hintRegion: '地区提示：{region}', hintPopulation: '人口约为{population}，面积属于{area}。', hintFirst: '首字提示：以“{first}”开头。', cameraFollow: '跟随', cameraExplore: '探索', cameraOverview: '全景', flagDescription: '观察国旗并猜出国家。', clueDescription: '阅读地理、文化和历史线索。', mapDescription: '在真实世界地图上寻找国家。', shopDescription: '选择探险家并更换服装颜色。', guideZone: '探索问讯处', guideDescription: '和会讲解游戏的Qubi见面。', chooseName: '给你的探险家取个名字', chooseNameBody: '请输入在村庄里使用的名字。', nameInputPlaceholder: '请输入名字', saveName: '确定名字', changeName: '改名字', hatShop: '帽子商店', companionShop: 'Qubi颜色', yourPoints: '我的积分', locked: '未解锁', owned: '已拥有', buy: '购买', notEnoughPoints: '积分不够', guideWelcome: '你好！我是Qubi。点一下你想知道的内容吧！', topicZones: '游戏区域介绍', topicMap: '地图游戏4种', topicShop: '积分与商店', topicCurriculum: '能学到什么？', back: '返回', guideZonesBody: '国旗广场用国旗、世界图书馆用线索、地图观景台用地图来猜国家。', guideMapBody: '地图观景台里有寻找国家、猜国家名、看轮廓、看国旗找，一共4种游戏。', guideShopBody: '答对问题会获得积分（⭐）。在角色菜单的商店里可以购买帽子和Qubi的颜色。', guideCurriculumBody: '这个游戏和小学社会科的"世界各国的自然与文化"单元相关联。', installNow: '安装', installAndroid: '添加到主屏幕后可以像应用一样全屏畅玩，没有地址栏！', installIOS: '点击分享按钮 → "添加到主屏幕"，即可像应用一样安装！', populationBands: { 'under-5m': '少于500万', '5m-20m': '500万至2000万', '20m-50m': '2000万至5000万', '50m-100m': '5000万至1亿', '100m-300m': '1亿至3亿', '300m-1b': '3亿至10亿', 'over-1b': '10亿以上' }, areaBands: { micro: '微型国家', small: '小型国家', medium: '中等国家', large: '大型国家', 'very-large': '超大型国家' }, continents: { asia: '亚洲', europe: '欧洲', africa: '非洲', 'north-america': '北美洲', 'south-america': '南美洲', oceania: '大洋洲', other: '其他地区' }
  },
  ja: {
    rotateTitle: '横向きにしてください', rotateBody: '世界探検ゲームは横画面に最適化されています。', worldVillage: '世界探検村', character: 'キャラクター', guide: '光るゲームゾーンへ移動して世界を探検しよう。', flagZone: '国旗広場', clueZone: '世界図書館', mapZone: '地図展望台', run: '走る', enter: '入る', enterGame: 'ゲーム開始', nearZone: 'ゲームゾーン到着', loadingVillage: '3D世界探検村を作っています...', village: '村', findCountry: '国を探す', nameCountry: '国名を当てる', shapeCountry: '輪郭クイズ', flagMap: '国旗で探す', unseen: '未発見', solved: '発見済み', target: '問題', confirm: '選択を確定', hint: 'ヒント', skip: 'スキップ', nextQuestion: '次の問題', sessionComplete: '探検セッション完了！', correctCount: '正解', earnedPoints: '獲得ポイント', newCountries: '新しい国', again: 'もう一度', returnVillage: '村に戻る', chooseCharacter: '探検家を選ぼう', chooseCharacterBody: 'キャラクターと色を選ぶと3D村にすぐ反映されます。', skinColor: '肌の色', hairColor: '髪の色', jacketColor: 'ジャケット', scarfColor: 'スカーフ', applyCharacter: 'キャラクターを適用', flagTitle: '国旗を見て国を当てよう', clueTitle: 'ヒントを読んで国を当てよう', locationTitle: '地図で国を探そう', flagPrompt: 'この国旗はどの国？', cluePrompt: 'この説明に合う国はどこ？', findPrompt: '地図で{country}を探してください。', highlightedPrompt: '地図で光っている国はどこ？', shapePrompt: 'この国の輪郭はどこ？', flagMapPrompt: '{flag}の国を地図で探してください。', selectOnMap: '地図を移動・拡大して国を選んでください。', selectAnswer: '正しいと思う国を選んでください。', correct: '正解！', wrong: 'おしい！', correctBody: '{country}！+{points}P', wrongBody: '正解は{country}です。', firstDiscovery: '新しい国を発見！', capital: '首都', region: '地域', population: '人口規模', area: '面積規模', hintLength: '国名は{count}文字：{blank}', hintRegion: '地域ヒント：{region}', hintPopulation: '人口は{population}、面積は{area}くらいです。', hintFirst: '最初の文字は「{first}」です。', cameraFollow: 'FOLLOW', cameraExplore: 'EXPLORE', cameraOverview: 'OVERVIEW', flagDescription: '国旗をよく見て国を当てます。', clueDescription: '地理・文化・歴史のヒントを読みます。', mapDescription: '実際の世界地図で国を探します。', shopDescription: '探検家と服の色を選びます。', guideZone: '探検インフォメーション', guideDescription: 'ゲームを説明してくれるキュービに会おう。', chooseName: '探検家の名前を決めよう', chooseNameBody: '村で使う名前を入力してください。', nameInputPlaceholder: '名前を入力', saveName: '名前を決める', changeName: '名前を変える', hatShop: '帽子ショップ', companionShop: 'キュービの色', yourPoints: '所持ポイント', locked: 'ロック中', owned: '所持済み', buy: '購入', notEnoughPoints: 'ポイントが足りません', guideWelcome: 'こんにちは！ぼくはキュービだよ。気になることを押してみてね！', topicZones: 'ゲームゾーン案内', topicMap: '地図ゲーム4種類', topicShop: 'ポイントとショップ', topicCurriculum: '何が学べるの？', back: '戻る', guideZonesBody: '国旗広場は国旗で、世界図書館はヒントで、地図展望台は地図で国を当てるところだよ。', guideMapBody: '地図展望台には、国を探す・国名を当てる・輪郭クイズ・国旗で探すの4つのゲームがあるよ。', guideShopBody: '問題に正解するとポイント（⭐）がもらえるよ。キャラクターメニューのショップで帽子やキュービの色を買えるよ。', guideCurriculumBody: 'この遊びは小学校社会科の「世界のいろいろな国の自然と文化」の単元とつながっているよ。', installNow: 'インストール', installAndroid: 'ホーム画面に追加すると、アドレスバーなしで全画面アプリのように遊べるよ！', installIOS: '共有ボタン→「ホーム画面に追加」でアプリのようにインストールできるよ！', populationBands: { 'under-5m': '500万人未満', '5m-20m': '500万〜2000万人', '20m-50m': '2000万〜5000万人', '50m-100m': '5000万〜1億人', '100m-300m': '1億〜3億人', '300m-1b': '3億〜10億人', 'over-1b': '10億人以上' }, areaBands: { micro: 'とても小さい国', small: '小さい国', medium: '中くらいの国', large: '大きい国', 'very-large': 'とても大きい国' }, continents: { asia: 'アジア', europe: 'ヨーロッパ', africa: 'アフリカ', 'north-america': '北アメリカ', 'south-america': '南アメリカ', oceania: 'オセアニア', other: 'その他' }
  },
  en: {
    rotateTitle: 'Rotate your phone', rotateBody: 'World Explorer is designed for landscape play.', worldVillage: 'World Explorer Village', character: 'Character', guide: 'Walk to a glowing game zone and explore the world.', flagZone: 'Flag Plaza', clueZone: 'World Library', mapZone: 'Map Observatory', run: 'Run', enter: 'Enter', enterGame: 'Start game', nearZone: 'Game zone reached', loadingVillage: 'Building the 3D World Explorer Village...', village: 'Village', findCountry: 'Find country', nameCountry: 'Name country', shapeCountry: 'Shape quiz', flagMap: 'Flag to map', unseen: 'Unseen', solved: 'Discovered', target: 'Target', confirm: 'Confirm choice', hint: 'Hint', skip: 'Skip', nextQuestion: 'Next question', sessionComplete: 'Exploration session complete!', correctCount: 'Correct', earnedPoints: 'Points earned', newCountries: 'New countries', again: 'Play again', returnVillage: 'Return to village', chooseCharacter: 'Choose your explorer', chooseCharacterBody: 'Choose a character and colors. Changes appear in the 3D village immediately.', skinColor: 'Skin tone', hairColor: 'Hair color', jacketColor: 'Jacket', scarfColor: 'Scarf', applyCharacter: 'Apply character', flagTitle: 'Guess the country by its flag', clueTitle: 'Read the clues and name the country', locationTitle: 'Find countries on the map', flagPrompt: 'Which country has this flag?', cluePrompt: 'Which country matches these clues?', findPrompt: 'Find {country} on the map.', highlightedPrompt: 'Which country is glowing on the map?', shapePrompt: 'Which country has this outline?', flagMapPrompt: 'Find the country with the {flag} flag.', selectOnMap: 'Move or zoom the map, then select a country.', selectAnswer: 'Choose the country you think is correct.', correct: 'Correct!', wrong: 'Not quite', correctBody: '{country}! +{points}P', wrongBody: 'The correct answer is {country}.', firstDiscovery: 'You discovered a new country!', capital: 'Capital', region: 'Region', population: 'Population', area: 'Area', hintLength: 'The name has {count} letters: {blank}', hintRegion: 'Region hint: {region}', hintPopulation: 'Population: {population}. Area: {area}.', hintFirst: 'First-letter hint: it starts with “{first}”.', cameraFollow: 'FOLLOW', cameraExplore: 'EXPLORE', cameraOverview: 'OVERVIEW', flagDescription: 'Study the flag and name the country.', clueDescription: 'Read geography, culture, and history clues.', mapDescription: 'Find countries on a real world map.', shopDescription: 'Choose an explorer and customize colors.', guideZone: 'Explorer Info Booth', guideDescription: 'Meet Cubi, who explains the games.', chooseName: 'Name your explorer', chooseNameBody: 'Enter the name you want to use in the village.', nameInputPlaceholder: 'Enter a name', saveName: 'Set name', changeName: 'Change name', hatShop: 'Hat shop', companionShop: 'Cubi colors', yourPoints: 'Your points', locked: 'Locked', owned: 'Owned', buy: 'Buy', notEnoughPoints: 'Not enough points', guideWelcome: "Hi! I'm Cubi. Tap something you're curious about!", topicZones: 'Game zones', topicMap: '4 map games', topicShop: 'Points & shop', topicCurriculum: 'What will I learn?', back: 'Back', guideZonesBody: 'Flag Plaza uses flags, World Library uses clues, and Map Observatory uses the map to guess countries.', guideMapBody: 'Map Observatory has 4 games: find the country, name the country, guess the outline, and find it by flag.', guideShopBody: "Answering questions earns points (⭐). You can buy hats and Cubi colors in the shop from the character menu.", guideCurriculumBody: 'This game connects to the elementary social studies unit on "the nature and culture of countries around the world."', installNow: 'Install', installAndroid: 'Add to your home screen to play fullscreen, app-style, with no address bar!', installIOS: 'Tap Share → "Add to Home Screen" to install it like an app!', populationBands: { 'under-5m': 'under 5 million', '5m-20m': '5–20 million', '20m-50m': '20–50 million', '50m-100m': '50–100 million', '100m-300m': '100–300 million', '300m-1b': '300 million–1 billion', 'over-1b': 'over 1 billion' }, areaBands: { micro: 'a microstate', small: 'a small country', medium: 'a medium-sized country', large: 'a large country', 'very-large': 'a very large country' }, continents: { asia: 'Asia', europe: 'Europe', africa: 'Africa', 'north-america': 'North America', 'south-america': 'South America', oceania: 'Oceania', other: 'another region' }
  }
};

const subregionNames = {
  ko: { 'Eastern Asia': '동아시아', 'South-Eastern Asia': '동남아시아', 'Southern Asia': '남아시아', 'Western Asia': '서아시아', 'Central Asia': '중앙아시아', 'Northern Europe': '북유럽', 'Western Europe': '서유럽', 'Eastern Europe': '동유럽', 'Southern Europe': '남유럽', 'Northern Africa': '북아프리카', 'Western Africa': '서아프리카', 'Middle Africa': '중앙아프리카', 'Eastern Africa': '동아프리카', 'Southern Africa': '남아프리카', Caribbean: '카리브해', 'Central America': '중앙아메리카', 'Northern America': '북아메리카', 'South America': '남아메리카', Melanesia: '멜라네시아', Micronesia: '미크로네시아', Polynesia: '폴리네시아', 'Australia and New Zealand': '오스트레일리아·뉴질랜드' },
  zh: { 'Eastern Asia': '东亚', 'South-Eastern Asia': '东南亚', 'Southern Asia': '南亚', 'Western Asia': '西亚', 'Central Asia': '中亚', 'Northern Europe': '北欧', 'Western Europe': '西欧', 'Eastern Europe': '东欧', 'Southern Europe': '南欧', 'Northern Africa': '北非', 'Western Africa': '西非', 'Middle Africa': '中非', 'Eastern Africa': '东非', 'Southern Africa': '南非地区', Caribbean: '加勒比地区', 'Central America': '中美洲', 'Northern America': '北美洲', 'South America': '南美洲', Melanesia: '美拉尼西亚', Micronesia: '密克罗尼西亚', Polynesia: '波利尼西亚', 'Australia and New Zealand': '澳大利亚和新西兰' },
  ja: { 'Eastern Asia': '東アジア', 'South-Eastern Asia': '東南アジア', 'Southern Asia': '南アジア', 'Western Asia': '西アジア', 'Central Asia': '中央アジア', 'Northern Europe': '北ヨーロッパ', 'Western Europe': '西ヨーロッパ', 'Eastern Europe': '東ヨーロッパ', 'Southern Europe': '南ヨーロッパ', 'Northern Africa': '北アフリカ', 'Western Africa': '西アフリカ', 'Middle Africa': '中部アフリカ', 'Eastern Africa': '東アフリカ', 'Southern Africa': '南部アフリカ', Caribbean: 'カリブ海', 'Central America': '中央アメリカ', 'Northern America': '北アメリカ', 'South America': '南アメリカ', Melanesia: 'メラネシア', Micronesia: 'ミクロネシア', Polynesia: 'ポリネシア', 'Australia and New Zealand': 'オーストラリア・ニュージーランド' },
  en: {}
};

function tr(key, vars = {}) {
  const value = i18n[state.lang]?.[key] ?? i18n.ko[key] ?? key;
  if (typeof value !== 'string') return value;
  return Object.entries(vars).reduce((text, [k, v]) => text.replaceAll(`{${k}}`, String(v)), value);
}

function countryName(country) { return country?.names?.[state.lang] || country?.names?.en || country?.id || ''; }
function regionName(country) { return subregionNames[state.lang]?.[country.subregion] || country.subregion || tr('continents')[country.continent] || country.continent; }
function populationName(country) { return tr('populationBands')[country.populationBand] || country.populationBand; }
function areaName(country) { return tr('areaBands')[country.areaBand] || country.areaBand; }
function randomItem(items) { return items[Math.floor(Math.random() * items.length)]; }
function shuffle(items) { return [...items].sort(() => Math.random() - .5); }
function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
function saveState() { localStorage.setItem(GAME_KEY, JSON.stringify(state)); }

function applyLanguage() {
  document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : state.lang === 'ja' ? 'ja' : state.lang;
  document.documentElement.dataset.lang = state.lang;
  $$('[data-i18n]').forEach(el => { const value = tr(el.dataset.i18n); if (typeof value === 'string') el.textContent = value; });
  $$('.language-switch button').forEach(button => button.classList.toggle('active', button.dataset.lang === state.lang));
  updateExplorerName();
  updateVillageUi();
  updateCameraLabel();
  if (!$('#gameScreen').hidden && game.target) renderQuestion(true);
  renderCharacterDialog();
  if (!$('#installBanner').hidden) $('#installBannerText').textContent = tr(isIOSDevice() ? 'installIOS' : 'installAndroid');
  saveState();
}

function speak(text) {
  if (!state.audio || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = { ko: 'ko-KR', zh: 'zh-CN', ja: 'ja-JP', en: 'en-US' }[state.lang];
  utterance.rate = .94;
  speechSynthesis.speak(utterance);
}

// ---------- 3D village ----------
let scene, renderer, camera, cameraController, clock;
let player, companion, docent, playerVelocity = new THREE.Vector3(), targetPoint = null;
let activeZone = null, worldReady = false, villagePaused = false;
let npcs = [], activeNpc = null;
let joystickPointer = null, runHeld = false, pointerStart = null;
const joystickInput = new THREE.Vector2();
const keys = new Set();
const colliders = [];
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

const zoneDefinitions = [
  { id: 'flag', mode: 'flag', icon: '🏳️', x: -12, z: -7, radius: 3.35, labelKey: 'flagZone', descriptionKey: 'flagDescription', color: 0xe65f52 },
  { id: 'clue', mode: 'clue', icon: '📚', x: 12, z: -7, radius: 3.45, labelKey: 'clueZone', descriptionKey: 'clueDescription', color: 0x5b6fa5 },
  { id: 'location', mode: 'location', icon: '🗺️', x: 11, z: 10, radius: 3.65, labelKey: 'mapZone', descriptionKey: 'mapDescription', color: 0x3c8b72 },
  { id: 'shop', mode: null, icon: '🧑‍🚀', x: -11, z: 10, radius: 3.2, labelKey: 'character', descriptionKey: 'shopDescription', color: 0xd59a43 },
  { id: 'guide', mode: null, icon: '🧭', x: 0, z: -16, radius: 2.8, labelKey: 'guideZone', descriptionKey: 'guideDescription', color: 0x8e6da6 }
];

function mat(color, extra = {}) { return new THREE.MeshStandardMaterial({ color, roughness: .78, metalness: .02, ...extra }); }
function addMesh(parent, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position); mesh.rotation.set(...rotation); mesh.scale.set(...scale);
  mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
}
function addCollider(x, z, radius) { colliders.push({ x, z, radius }); }
function seededRandom(seed) { let value = seed >>> 0; return () => ((value = (value * 1664525 + 1013904223) >>> 0) / 4294967296); }

function createRoad(x1, z1, x2, z2, width = 2.1) {
  const dx = x2 - x1, dz = z2 - z1, length = Math.hypot(dx, dz);
  addMesh(scene, new THREE.BoxGeometry(width, .08, length), mat(0xd8b77b), [(x1 + x2) / 2, .08, (z1 + z2) / 2], [0, Math.atan2(dx, dz), 0]);
  for (let t = 0; t <= 1; t += .16) {
    addMesh(scene, new THREE.BoxGeometry(.12, .035, .42), mat(0xf5e6c2), [x1 + dx * t, .135, z1 + dz * t], [0, Math.atan2(dx, dz), 0]);
  }
}

function createTree(x, z, scale = 1, color = 0x4d9863) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.scale.setScalar(scale); scene.add(g);
  addMesh(g, new THREE.CylinderGeometry(.18, .25, 1.45, 8), mat(0x80502f), [0, .72, 0]);
  addMesh(g, new THREE.ConeGeometry(.92, 1.55, 9), mat(color), [0, 1.75, 0]);
  addMesh(g, new THREE.ConeGeometry(.68, 1.22, 9), mat(new THREE.Color(color).multiplyScalar(1.08)), [0, 2.45, 0]);
  addCollider(x, z, .72 * scale);
}

function createLamp(x, z) {
  addMesh(scene, new THREE.CylinderGeometry(.06, .09, 2.2, 8), mat(0x31505d), [x, 1.1, z]);
  addMesh(scene, new THREE.SphereGeometry(.19, 10, 8), mat(0xffd87b, { emissive: 0xffc44f, emissiveIntensity: .8 }), [x, 2.25, z]);
}

function createBench(x, z, rotation = 0) {
  const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = rotation; scene.add(g);
  addMesh(g, new THREE.BoxGeometry(1.45, .18, .45), mat(0x9f6637), [0, .55, 0]);
  addMesh(g, new THREE.BoxGeometry(1.45, .65, .13), mat(0x9f6637), [0, .92, -.18], [-.1, 0, 0]);
  addMesh(g, new THREE.BoxGeometry(.12, .55, .12), mat(0x42515a), [-.55, .27, 0]);
  addMesh(g, new THREE.BoxGeometry(.12, .55, .12), mat(0x42515a), [.55, .27, 0]);
  addCollider(x, z, .9);
}

function createFlowerPatch(x, z, color) {
  const rand = seededRandom(Math.round((x + 30) * 913 + (z + 30) * 331));
  for (let i = 0; i < 8; i += 1) {
    const px = x + (rand() - .5) * 1.4, pz = z + (rand() - .5) * 1.1;
    addMesh(scene, new THREE.CylinderGeometry(.018, .025, .28, 5), mat(0x39734c), [px, .15, pz]);
    addMesh(scene, new THREE.SphereGeometry(.09, 7, 5), mat(color), [px, .34, pz]);
  }
}

function createFountain() {
  addMesh(scene, new THREE.CylinderGeometry(2.15, 2.3, .48, 32), mat(0x9b7957), [0, .23, 0]);
  addMesh(scene, new THREE.CylinderGeometry(1.78, 1.88, .2, 32), mat(0x6bb8ca, { roughness: .25, metalness: .06, transparent: true, opacity: .86 }), [0, .52, 0]);
  addMesh(scene, new THREE.CylinderGeometry(.3, .43, 2.35, 12), mat(0xc5a171), [0, 1.55, 0]);
  addMesh(scene, new THREE.SphereGeometry(.42, 14, 10), mat(0xe9c15f, { metalness: .15 }), [0, 2.85, 0]);
  addCollider(0, 0, 2.5);
}

function createBuildingBase(zone, width, depth, wallColor, roofColor) {
  const g = new THREE.Group(); g.position.set(zone.x, 0, zone.z); scene.add(g);
  addMesh(g, new THREE.BoxGeometry(width, 2.8, depth), mat(wallColor), [0, 1.4, 0]);
  addMesh(g, new THREE.ConeGeometry(Math.max(width, depth) * .72, 1.7, 4), mat(roofColor), [0, 3.55, 0], [0, Math.PI / 4, 0], [1, .75, 1]);
  addMesh(g, new THREE.BoxGeometry(1.1, 1.7, .14), mat(0x704725), [0, .87, depth / 2 + .08]);
  addMesh(g, new THREE.BoxGeometry(.63, .63, .12), mat(0xaedce6, { emissive: 0x4e8796, emissiveIntensity: .2 }), [-width * .27, 1.55, depth / 2 + .08]);
  addMesh(g, new THREE.BoxGeometry(.63, .63, .12), mat(0xaedce6, { emissive: 0x4e8796, emissiveIntensity: .2 }), [width * .27, 1.55, depth / 2 + .08]);
  addCollider(zone.x, zone.z, Math.max(width, depth) * .56);
  return g;
}

function createFlagPlaza(zone) {
  const g = new THREE.Group(); g.position.set(zone.x, 0, zone.z); scene.add(g);
  addMesh(g, new THREE.CylinderGeometry(3.1, 3.3, .24, 32), mat(0xe0c185), [0, .12, 0]);
  for (let i = 0; i < 7; i += 1) {
    const angle = (i / 7) * Math.PI * 2;
    const x = Math.cos(angle) * 2.25, z = Math.sin(angle) * 2.25;
    addMesh(g, new THREE.CylinderGeometry(.04, .06, 2.6, 7), mat(0x405563), [x, 1.42, z]);
    const flag = addMesh(g, new THREE.PlaneGeometry(.75, .43, 4, 2), mat([0xe15b50,0x4b78a6,0xe7b84e,0x5a9b70][i%4], { side: THREE.DoubleSide }), [x + .38, 2.32, z]);
    flag.rotation.y = -angle + Math.PI / 2;
  }
  addCollider(zone.x, zone.z, 1.2);
}

function createLibrary(zone) {
  const g = createBuildingBase(zone, 5.2, 4.4, 0xd6a56d, 0x704b6e);
  addMesh(g, new THREE.BoxGeometry(2.7, .55, .22), mat(0x4f3150), [0, 3.05, 2.33]);
  for (let i = -1; i <= 1; i += 1) addMesh(g, new THREE.BoxGeometry(.32, .75, .14), mat([0xe16b55,0x4f7eaa,0xe4b84e][i+1]), [i*.42, 3.05, 2.48], [0,0,i*.08]);
}

function createObservatory(zone) {
  const g = new THREE.Group(); g.position.set(zone.x, 0, zone.z); scene.add(g);
  addMesh(g, new THREE.CylinderGeometry(2.8, 3.15, 2.7, 18), mat(0xe7d0a2), [0, 1.35, 0]);
  addMesh(g, new THREE.SphereGeometry(2.25, 18, 10, 0, Math.PI * 2, 0, Math.PI / 2), mat(0x4c7896), [0, 2.7, 0]);
  addMesh(g, new THREE.CylinderGeometry(.32, .42, 3.1, 10), mat(0x314d5f), [.6, 4.25, .15], [0, 0, -.55]);
  addMesh(g, new THREE.CylinderGeometry(.62, .62, .35, 12), mat(0x233d4d), [1.35, 4.75, .15], [0, 0, Math.PI / 2]);
  addMesh(g, new THREE.BoxGeometry(1.05, 1.7, .15), mat(0x725033), [0, .85, 3.02]);
  addCollider(zone.x, zone.z, 3.05);
}

function createShop(zone) {
  const g = createBuildingBase(zone, 4.8, 4, 0xe2b66d, 0x3e755b);
  addMesh(g, new THREE.BoxGeometry(4.4, .45, .8), mat(0xd85e51), [0, 2.65, 2.32], [.18, 0, 0]);
  addMesh(g, new THREE.TorusGeometry(.48, .1, 8, 20), mat(0xf0c457), [0, 3.05, 2.52]);
}

function createGuideBooth(zone) {
  const g = new THREE.Group(); g.position.set(zone.x, 0, zone.z); scene.add(g);
  addMesh(g, new THREE.CylinderGeometry(2.5, 2.7, .3, 24), mat(0xe0c9a0), [0, .15, 0]);
  addMesh(g, new THREE.BoxGeometry(2.6, 1.7, 1.6), mat(0xceb083), [0, 1.15, 0]);
  addMesh(g, new THREE.ConeGeometry(2.15, 1.15, 4), mat(0x8e6da6), [0, 2.55, 0], [0, Math.PI / 4, 0], [1, .7, 1]);
  addMesh(g, new THREE.BoxGeometry(1.7, .95, .12), mat(0xf3e7c9), [0, 1.35, .81]);
  addMesh(g, new THREE.BoxGeometry(1.9, .28, .16), mat(0x6c4a2e), [0, .78, .84]);
  const sign = addMesh(g, new THREE.BoxGeometry(1.1, .58, .08), mat(0xf6efd8), [0, 2.15, .86]);
  sign.rotation.x = -.08;
  addCollider(zone.x, zone.z, 1.75);
  return g;
}

function createDocent(zone) {
  const docent = createCubiCompanion(THREE, 'classic', 1.9);
  docent.position.set(zone.x, 1.05, zone.z + 2.15);
  docent.userData.baseY = docent.position.y;
  scene.add(docent);
  return docent;
}

function createZoneRing(zone) {
  const g = new THREE.Group(); g.position.set(zone.x, .18, zone.z + zone.radius + .45); scene.add(g);
  const ringMat = mat(zone.color, { emissive: zone.color, emissiveIntensity: .75, transparent: true, opacity: .82 });
  const ring = addMesh(g, new THREE.TorusGeometry(1.15, .11, 8, 32), ringMat, [0, .05, 0], [Math.PI / 2, 0, 0]);
  const beam = addMesh(g, new THREE.CylinderGeometry(.72, 1.1, 4.2, 18, 1, true), mat(zone.color, { emissive: zone.color, emissiveIntensity: .35, transparent: true, opacity: .12, side: THREE.DoubleSide }), [0, 2.05, 0]);
  zone.ring = ring; zone.beam = beam; zone.entry = new THREE.Vector3(zone.x, .12, zone.z + zone.radius + .45);
}

function rebuildCharacter() {
  const pos = player?.position?.clone() || new THREE.Vector3(state.village.x, .12, state.village.z);
  const rotation = player?.rotation?.y || 0;
  if (player) scene.remove(player);
  player = createExplorerCharacter(THREE, characterState);
  player.position.copy(pos); player.rotation.y = rotation; scene.add(player);
  if (cameraController) cameraController.target = player;
  updateExplorerName();
}

function rebuildCompanion() {
  if (!scene) return;
  const pos = companion?.position?.clone();
  if (companion) scene.remove(companion);
  companion = createCubiCompanion(THREE, characterState.companionSkin);
  if (pos) companion.position.copy(pos);
  scene.add(companion);
}

function buildWorld() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x9fd6e6);
  scene.fog = new THREE.Fog(0x9fd6e6, 42, 82);
  renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.55));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  $('#villageViewport').appendChild(renderer.domElement);

  camera = new THREE.PerspectiveCamera(43, innerWidth / innerHeight, .1, 150);
  const hemi = new THREE.HemisphereLight(0xdff4ff, 0x668255, 2.45); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xfff0ce, 3.0); sun.position.set(-13, 24, 16); sun.castShadow = true; sun.shadow.mapSize.set(1536, 1536); sun.shadow.camera.left = -34; sun.shadow.camera.right = 34; sun.shadow.camera.top = 34; sun.shadow.camera.bottom = -34; sun.shadow.camera.near = 1; sun.shadow.camera.far = 70; sun.shadow.bias = -.00045; scene.add(sun);
  const fill = new THREE.DirectionalLight(0xffc985, .65); fill.position.set(16, 10, -14); scene.add(fill);

  addMesh(scene, new THREE.CylinderGeometry(31, 31.8, 1.5, 72), mat(0x4d9db2, { roughness: .35, metalness: .04 }), [0, -1.22, 0]);
  addMesh(scene, new THREE.CylinderGeometry(27.75, 28.35, .7, 72), mat(0xe0c58a), [0, -.55, 0]);
  addMesh(scene, new THREE.CylinderGeometry(27, 27.5, .92, 72), mat(0x72b36c), [0, -.18, 0]);
  createRoad(0, 0, -12, -7); createRoad(0, 0, 12, -7); createRoad(0, 0, 11, 10); createRoad(0, 0, -11, 10); createRoad(0, 0, 0, -16);
  addMesh(scene, new THREE.CylinderGeometry(5.2, 5.3, .1, 32), mat(0xe8c98e), [0, .06, 0]);
  addMesh(scene, new THREE.TorusGeometry(4.9, .12, 8, 48), mat(0xb97c46), [0, .13, 0], [Math.PI / 2, 0, 0]);
  createFountain();
  createFlagPlaza(zoneDefinitions[0]); createLibrary(zoneDefinitions[1]); createObservatory(zoneDefinitions[2]); createShop(zoneDefinitions[3]); createGuideBooth(zoneDefinitions[4]); zoneDefinitions.forEach(createZoneRing);
  docent = createDocent(zoneDefinitions[4]);

  const rand = seededRandom(1207);
  const protectedAreas = zoneDefinitions.map(z => ({ x: z.x, z: z.z, radius: z.radius + 2.4 })).concat([{ x: 0, z: 0, radius: 6.2 }]);
  let attempts = 0, planted = 0;
  while (planted < 36 && attempts < 380) {
    attempts += 1; const angle = rand() * Math.PI * 2; const radius = 8 + rand() * 17.2; const x = Math.cos(angle) * radius; const z = Math.sin(angle) * radius;
    if (protectedAreas.some(a => Math.hypot(x - a.x, z - a.z) < a.radius)) continue;
    createTree(x, z, .7 + rand() * .52, rand() > .3 ? 0x4d9863 : 0x6aa45b); planted += 1;
  }
  [[-4.6,-4.5],[4.8,-4.4],[5.1,4.4],[-4.8,4.5],[-7.4,1.8],[7.3,1.5]].forEach(([x,z])=>createLamp(x,z));
  createBench(-4.6,2.9,-.85); createBench(4.5,-2.9,2.25); createBench(2.8,4.8,-2.6);
  createFlowerPatch(-5.5,-2.1,0xef87a1); createFlowerPatch(5.7,2.2,0x9e86d1); createFlowerPatch(-3.8,5.2,0xf3b75e); createFlowerPatch(3.2,-5.4,0xee7f77);

  rebuildCharacter();
  companion = createCubiCompanion(THREE, characterState.companionSkin); scene.add(companion);
  player.position.set(state.village.x, .12, state.village.z);
  companion.position.copy(player.position).add(new THREE.Vector3(-1.2, 1.8, -.8));
  cameraController = new CameraController(THREE, camera, player, renderer, { ...state.village.camera, onChange: snap => { state.village.camera = snap; updateCameraLabel(); } });
  createNPCs();
  resize();
  bindVillageControls();
  clock = new THREE.Clock();
  renderer.setAnimationLoop(animateVillage);
  worldReady = true;
  $('#villageLoading').classList.add('done');
  updateCameraLabel(); updateVillageUi();
}

function resize() {
  if (!renderer || !camera) return;
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
}

function angleLerp(current, target, amount) {
  let diff = ((target - current + Math.PI) % (Math.PI * 2)) - Math.PI;
  if (diff < -Math.PI) diff += Math.PI * 2;
  return current + diff * amount;
}

function resolvePosition(candidate) {
  const r = Math.hypot(candidate.x, candidate.z);
  if (r > VILLAGE_RADIUS) { candidate.x *= VILLAGE_RADIUS / r; candidate.z *= VILLAGE_RADIUS / r; }
  for (const c of colliders) {
    const dx = candidate.x - c.x, dz = candidate.z - c.z, dist = Math.hypot(dx, dz), min = c.radius + .46;
    if (dist < min && dist > .0001) { candidate.x = c.x + dx / dist * min; candidate.z = c.z + dz / dist * min; }
  }
  candidate.y = .12;
  return candidate;
}

function currentInput() {
  const x = (keys.has('KeyD') || keys.has('ArrowRight') ? 1 : 0) - (keys.has('KeyA') || keys.has('ArrowLeft') ? 1 : 0) + joystickInput.x;
  const y = (keys.has('KeyW') || keys.has('ArrowUp') ? 1 : 0) - (keys.has('KeyS') || keys.has('ArrowDown') ? 1 : 0) + joystickInput.y;
  const v = new THREE.Vector2(x, y); if (v.length() > 1) v.normalize(); return v;
}

function updateMovement(delta) {
  const input = currentInput();
  const manual = input.lengthSq() > .002;
  let worldDir = new THREE.Vector3();
  if (manual) {
    targetPoint = null;
    const yaw = cameraController.yaw;
    const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
    const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
    worldDir.addScaledVector(right, input.x).addScaledVector(forward, input.y);
    if (worldDir.lengthSq() > 1) worldDir.normalize();
  } else if (targetPoint) {
    worldDir.copy(targetPoint).sub(player.position); worldDir.y = 0;
    if (worldDir.length() < .28) { targetPoint = null; worldDir.set(0,0,0); } else worldDir.normalize();
  }
  const running = runHeld || keys.has('ShiftLeft') || keys.has('ShiftRight');
  const maxSpeed = running ? 6.1 : 3.45;
  const desired = worldDir.multiplyScalar(maxSpeed);
  playerVelocity.lerp(desired, 1 - Math.exp(-delta * (desired.lengthSq() ? 9.5 : 12)));
  const candidate = resolvePosition(player.position.clone().addScaledVector(playerVelocity, delta));
  player.position.copy(candidate);
  const speed = playerVelocity.length();
  let turning = 0;
  if (speed > .08) {
    const targetYaw = Math.atan2(playerVelocity.x, playerVelocity.z);
    let diff = ((targetYaw - player.rotation.y + Math.PI) % (Math.PI * 2)) - Math.PI;
    turning = clamp(diff, -1, 1);
    player.rotation.y = angleLerp(player.rotation.y, targetYaw, 1 - Math.exp(-delta * 10));
  }
  animateExplorer(player, delta, speed, turning);
  const companionOffset = new THREE.Vector3(-1.15, 1.65 + Math.sin(performance.now() * .003) * .16, -.85).applyAxisAngle(new THREE.Vector3(0,1,0), player.rotation.y);
  companion.position.lerp(player.position.clone().add(companionOffset), 1 - Math.exp(-delta * 4.5));
  companion.rotation.y += delta * .7;
}

function updateZones(time) {
  let nearest = null, nearestDist = Infinity;
  for (const zone of zoneDefinitions) {
    const dist = player.position.distanceTo(zone.entry);
    const pulse = 1 + Math.sin(time * .003 + zone.x) * .08;
    zone.ring.scale.setScalar(pulse); zone.beam.material.opacity = .1 + Math.sin(time * .0025 + zone.z) * .035;
    if (dist < 2.05 && dist < nearestDist) { nearest = zone; nearestDist = dist; }
  }
  if (nearest !== activeZone) { activeZone = nearest; renderZonePrompt(); }
}

function renderZonePrompt() {
  const prompt = $('#zonePrompt');
  if (!activeZone) { prompt.hidden = true; $('#interactButton').disabled = true; $('#villageGuide').textContent = tr('guide'); return; }
  prompt.hidden = false; $('#interactButton').disabled = false;
  $('#zoneIcon').textContent = activeZone.icon; $('#zoneName').textContent = tr(activeZone.labelKey); $('#zoneDescription').textContent = tr(activeZone.descriptionKey);
  $('#villageGuide').textContent = `${tr(activeZone.labelKey)} · ${tr(activeZone.descriptionKey)}`;
}

const NPC_DEFS = [
  { waypoints: [[16,-14],[19,-8]] },
  { waypoints: [[-17,13],[-11,18]] },
  { waypoints: [[15,16],[19,20]] }
];
function npcFact(lang) {
  const c = randomItem(countries195);
  const region = regionName(c), pop = populationName(c), area = areaName(c);
  const templates = {
    ko: [`${c.flag} ${countryName(c)}의 수도는 ${c.capital}이에요!`, `${c.flag} ${countryName(c)}은(는) ${region}에 있어요.`, `${c.flag} ${countryName(c)}은(는) ${area}이고 인구는 ${pop} 정도예요.`],
    zh: [`${c.flag} ${countryName(c)}的首都是${c.capital}！`, `${c.flag} ${countryName(c)}位于${region}。`, `${c.flag} ${countryName(c)}是${area}，人口约为${pop}。`],
    ja: [`${c.flag} ${countryName(c)}の首都は${c.capital}だよ！`, `${c.flag} ${countryName(c)}は${region}にあるよ。`, `${c.flag} ${countryName(c)}は${area}で、人口は${pop}くらいだよ。`],
    en: [`${c.flag} The capital of ${countryName(c)} is ${c.capital}!`, `${c.flag} ${countryName(c)} is in ${region}.`, `${c.flag} ${countryName(c)} is ${area}, with about ${pop} people.`]
  };
  const list = templates[lang] || templates.ko;
  return randomItem(list);
}
function createNPCs() {
  npcs.forEach(n => scene.remove(n.mesh));
  npcs = [];
  const pool = CHARACTER_PROFILES.filter(p => p.id !== characterState.profileId);
  NPC_DEFS.forEach((def, i) => {
    const profile = pool[i % pool.length];
    const mesh = createExplorerCharacter(THREE, { ...profile, profileId: profile.id, companionSkin: 'classic' });
    const start = def.waypoints[0];
    mesh.position.set(start[0], .12, start[1]);
    scene.add(mesh);
    npcs.push({ mesh, profile, waypoints: def.waypoints.map(w => new THREE.Vector3(w[0], .12, w[1])), wpIndex: 1, animTime: Math.random() * 10 });
  });
}
function updateNPCs(delta) {
  for (const npc of npcs) {
    const target = npc.waypoints[npc.wpIndex];
    const dir = target.clone().sub(npc.mesh.position); dir.y = 0;
    const dist = dir.length();
    let speed = 0;
    if (dist > .4) {
      dir.normalize();
      speed = 1.6;
      const next = resolvePosition(npc.mesh.position.clone().addScaledVector(dir, speed * delta));
      npc.mesh.position.copy(next);
      const targetYaw = Math.atan2(dir.x, dir.z);
      npc.mesh.rotation.y = angleLerp(npc.mesh.rotation.y, targetYaw, 1 - Math.exp(-delta * 6));
    } else {
      npc.wpIndex = (npc.wpIndex + 1) % npc.waypoints.length;
    }
    animateExplorer(npc.mesh, delta, speed, 0);
  }
}
function updateNpcProximity() {
  if (!player || !npcs.length) return;
  let nearest = null, nearestDist = Infinity;
  for (const npc of npcs) {
    const dist = player.position.distanceTo(npc.mesh.position);
    if (dist < 3.2 && dist < nearestDist) { nearest = npc; nearestDist = dist; }
  }
  if (nearest !== activeNpc) {
    activeNpc = nearest;
    if (activeNpc) {
      const name = activeNpc.profile.name[state.lang] || activeNpc.profile.name.en;
      $('#npcBubble').innerHTML = `<strong>${name}</strong><span>${npcFact(state.lang)}</span>`;
      $('#npcBubble').hidden = false;
    } else {
      $('#npcBubble').hidden = true;
    }
  }
  if (activeNpc && camera) {
    const headPos = activeNpc.mesh.position.clone().add(new THREE.Vector3(0, 2.9, 0));
    const proj = headPos.project(camera);
    const bubble = $('#npcBubble');
    bubble.style.left = `${(proj.x * .5 + .5) * innerWidth}px`;
    bubble.style.top = `${(-proj.y * .5 + .5) * innerHeight}px`;
    bubble.style.display = proj.z < 1 ? 'flex' : 'none';
  }
}

function animateVillage(time) {
  if (!worldReady || villagePaused || document.hidden || $('#villageScreen').hidden) return;
  const delta = Math.min(clock.getDelta(), .04);
  updateMovement(delta); cameraController.update(delta); updateZones(time); updateNPCs(delta); updateNpcProximity();
  if (docent) { docent.position.y = docent.userData.baseY + Math.sin(time * .0022) * .1; docent.rotation.y += delta * .5; }
  renderer.render(scene, camera);
}

function moveToWorldPoint(clientX, clientY) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1; pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera); const hit = new THREE.Vector3();
  if (raycaster.ray.intersectPlane(groundPlane, hit)) { hit.y = .12; targetPoint = resolvePosition(hit.clone()); $('#villageGuide').textContent = tr('guide'); }
}

function navigateToZone(id) {
  const zone = zoneDefinitions.find(z => z.id === id); if (!zone) return;
  targetPoint = resolvePosition(zone.entry.clone().add(new THREE.Vector3(0,0,1.05)));
  $('#villageGuide').textContent = `${tr(zone.labelKey)} →`;
}

function bindVillageControls() {
  const joystick = $('#joystick'), knob = $('#joystickKnob');
  const resetJoystick = () => { joystickPointer = null; joystickInput.set(0,0); knob.style.transform = 'translate(0px,0px)'; };
  joystick.addEventListener('pointerdown', e => { e.preventDefault(); joystickPointer = e.pointerId; joystick.setPointerCapture?.(e.pointerId); });
  joystick.addEventListener('pointermove', e => {
    if (e.pointerId !== joystickPointer) return;
    const rect = joystick.getBoundingClientRect(), dx = e.clientX - (rect.left + rect.width/2), dy = e.clientY - (rect.top + rect.height/2), radius = rect.width * .31, length = Math.hypot(dx,dy)||1, scale = Math.min(1,radius/length), lx=dx*scale, ly=dy*scale;
    knob.style.transform = `translate(${lx}px,${ly}px)`; joystickInput.set(lx/radius,-ly/radius); targetPoint = null;
  });
  joystick.addEventListener('pointerup', resetJoystick); joystick.addEventListener('pointercancel', resetJoystick);
  renderer.domElement.addEventListener('pointerdown', e => { pointerStart = { x:e.clientX,y:e.clientY,id:e.pointerId }; });
  renderer.domElement.addEventListener('pointerup', e => { if (!pointerStart || pointerStart.id!==e.pointerId) return; const d=Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y); if(d<8) moveToWorldPoint(e.clientX,e.clientY); pointerStart=null; });
  $('#runButton').addEventListener('pointerdown', e => { e.preventDefault(); runHeld=true; });
  ['pointerup','pointercancel','pointerleave'].forEach(type=>$('#runButton').addEventListener(type,()=>{runHeld=false;}));
  window.addEventListener('keydown', e => { keys.add(e.code); if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(e.code))e.preventDefault(); if((e.code==='KeyE'||e.code==='Enter')&&activeZone&&!$('#villageScreen').hidden) enterActiveZone(); if(e.code==='KeyC'&&!$('#villageScreen').hidden){cameraController.cycleMode();updateCameraLabel();} });
  window.addEventListener('keyup', e => keys.delete(e.code));
  $('#cameraModeButton').addEventListener('click',()=>{cameraController.cycleMode();updateCameraLabel();});
  $('#zoomInCamera').addEventListener('click',()=>{cameraController.zoom=clamp(cameraController.zoom+.1,.68,1.5);updateCameraLabel();});
  $('#zoomOutCamera').addEventListener('click',()=>{cameraController.zoom=clamp(cameraController.zoom-.1,.68,1.5);updateCameraLabel();});
  $('#enterZoneButton').addEventListener('click',enterActiveZone); $('#interactButton').addEventListener('click',enterActiveZone);
  $$('[data-zone-nav]').forEach(b=>b.addEventListener('click',()=>navigateToZone(b.dataset.zoneNav)));
}

function enterActiveZone() {
  if (!activeZone) return;
  if (activeZone.mode) startGame(activeZone.mode);
  else if (activeZone.id === 'guide') openGuideDialog();
  else openCharacterDialog();
}

function updateCameraLabel() {
  if (!cameraController) return;
  const key = { follow:'cameraFollow',explore:'cameraExplore',overview:'cameraOverview' }[cameraController.mode];
  $('#cameraModeLabel').textContent = tr(key);
}

function updateExplorerName() {
  const profile = profileFor(characterState);
  const name = characterState.playerName || profile.name[state.lang] || profile.name.en;
  $('#explorerName').textContent = `WORLD EXPLORER ${String(name).toUpperCase()}`;
}

function updateVillageUi() {
  $('#villagePoints').textContent = state.points; $('#villageSolved').textContent = state.solved.length;
  $('#gamePoints').textContent = state.points; $('#gameStreak').textContent = state.streak;
  renderZonePrompt();
}

// ---------- character selector ----------
let characterDraft = { ...characterState };
function itemOwned(key, price) { return price === 0 || state.ownedItems.includes(key); }
function showShopMessage(text) {
  const el = $('#shopMessage'); if (!el) return;
  el.textContent = text; el.hidden = false;
  clearTimeout(showShopMessage._t); showShopMessage._t = setTimeout(() => { el.hidden = true; }, 1600);
}
function buyItem(kind, id, price) {
  const key = `${kind}:${id}`;
  if (!itemOwned(key, price)) {
    if (state.points < price) { showShopMessage(tr('notEnoughPoints')); return; }
    state.points -= price; state.ownedItems.push(key); saveState(); updateVillageUi();
  }
  characterDraft[kind === 'hat' ? 'hat' : 'companionSkin'] = id;
  characterState = { ...characterDraft };
  saveCharacterState(characterState);
  if (kind === 'hat') rebuildCharacter(); else rebuildCompanion();
  renderCharacterDialog();
}
function renderCharacterDialog() {
  if (!$('#characterCards')) return;
  const profile = profileFor(characterDraft);
  $('#characterCards').innerHTML = CHARACTER_PROFILES.filter(p=>!p.npcOnly).map(p => `<button type="button" class="character-card ${p.id===characterDraft.profileId?'active':''}" data-profile="${p.id}"><span class="avatar">${p.id==='ari'?'🧭':p.id==='mina'?'📓':'🗺️'}</span><span><h3>${p.name[state.lang]||p.name.en}</h3><p>${p.role[state.lang]||p.role.en}</p></span></button>`).join('');
  $$('#characterCards [data-profile]').forEach(b=>b.addEventListener('click',()=>{characterDraft=applyProfile(characterDraft,b.dataset.profile);renderCharacterDialog();}));
  renderSwatches('#skinOptions',SKIN_PRESETS,'skin'); renderSwatches('#hairOptions',HAIR_PRESETS,'hair'); renderSwatches('#jacketOptions',JACKET_PRESETS,'jacket'); renderSwatches('#scarfOptions',SCARF_PRESETS,'scarf');
  $('#hatOptions').innerHTML=HAT_OPTIONS.map(h=>{const owned=itemOwned(`hat:${h.id}`,h.price);const active=h.id===characterDraft.hat;return `<button type="button" class="${active?'active':''} ${owned?'':'locked'}" data-hat="${h.id}" data-price="${h.price}">${h.icon} ${h.name[state.lang]||h.name.en}${owned?'':`<small>${h.price}P</small>`}</button>`;}).join('');
  $$('#hatOptions [data-hat]').forEach(b=>b.addEventListener('click',()=>buyItem('hat',b.dataset.hat,Number(b.dataset.price))));
  $('#companionOptions').innerHTML=COMPANION_SKINS.map(c=>{const owned=itemOwned(`companion:${c.id}`,c.price);const active=c.id===characterDraft.companionSkin;return `<button type="button" class="${active?'active':''} ${owned?'':'locked'}" data-companion="${c.id}" data-price="${c.price}">${c.icon} ${c.name[state.lang]||c.name.en}${owned?'':`<small>${c.price}P</small>`}</button>`;}).join('');
  $$('#companionOptions [data-companion]').forEach(b=>b.addEventListener('click',()=>buyItem('companion',b.dataset.companion,Number(b.dataset.price))));
  $('#dialogPoints').textContent = state.points;
  $('#dialogPlayerName').textContent = characterDraft.playerName || profile.name[state.lang] || profile.name.en;
}
function renderSwatches(rootSelector,values,key){const root=$(rootSelector);root.innerHTML=values.map(v=>`<button type="button" class="${Number(characterDraft[key])===v?'active':''}" data-value="${v}" aria-label="${key}" style="background:#${v.toString(16).padStart(6,'0')}"></button>`).join('');root.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{characterDraft[key]=Number(b.dataset.value);renderCharacterDialog();}));}
function openCharacterDialog(){characterDraft={...characterState};renderCharacterDialog();$('#characterDialog').showModal();}
$('#characterButton').addEventListener('click',openCharacterDialog); $('#closeCharacterDialog').addEventListener('click',()=>$('#characterDialog').close());
$('#saveCharacter').addEventListener('click',()=>{characterState={...characterDraft};saveCharacterState(characterState);rebuildCharacter();rebuildCompanion();$('#characterDialog').close();});
$('#characterDialog').addEventListener('click',e=>{if(e.target===$('#characterDialog'))$('#characterDialog').close();});
$('#renameButton').addEventListener('click',()=>openNameDialog(false));

// ---------- naming dialog ----------
function openNameDialog(firstRun){
  $('#nameInput').value = characterState.playerName || '';
  $('#nameInput').placeholder = tr('nameInputPlaceholder');
  $('#nameDialog').dataset.firstRun = firstRun ? '1' : '0';
  $('#closeNameDialog').hidden = !!firstRun;
  $('#nameDialog').showModal();
  setTimeout(()=>$('#nameInput').focus(),50);
}
function commitName(){
  const value = $('#nameInput').value.trim().slice(0,12);
  characterState = { ...characterState, playerName: value };
  saveCharacterState(characterState);
  updateExplorerName();
  if ($('#dialogPlayerName')) renderCharacterDialog();
  $('#nameDialog').close();
}
$('#saveName').addEventListener('click',commitName);
$('#closeNameDialog').addEventListener('click',()=>$('#nameDialog').close());
$('#nameInput').addEventListener('keydown',e=>{if(e.key==='Enter')commitName();});

// ---------- guide booth dialogue ----------
const GUIDE_TOPICS = ['topicZones','topicMap','topicShop','topicCurriculum'];
const GUIDE_BODIES = { topicZones:'guideZonesBody', topicMap:'guideMapBody', topicShop:'guideShopBody', topicCurriculum:'guideCurriculumBody' };
function renderGuideTopics(){
  $('#guideDetail').hidden = true; $('#guideTopicList').hidden = false;
  $('#guideMessage').textContent = tr('guideWelcome');
  $('#guideTopicList').innerHTML = GUIDE_TOPICS.map(key=>`<button type="button" data-topic="${key}">${tr(key)}</button>`).join('');
  $$('#guideTopicList [data-topic]').forEach(b=>b.addEventListener('click',()=>{
    $('#guideTopicList').hidden = true; $('#guideDetail').hidden = false;
    $('#guideDetailTitle').textContent = tr(b.dataset.topic);
    $('#guideDetailBody').textContent = tr(GUIDE_BODIES[b.dataset.topic]);
  }));
}
$('#guideBackButton').addEventListener('click',renderGuideTopics);
function openGuideDialog(){ renderGuideTopics(); $('#guideDialog').showModal(); }
$('#closeGuideDialog').addEventListener('click',()=>$('#guideDialog').close());
$('#guideDialog').addEventListener('click',e=>{if(e.target===$('#guideDialog'))$('#guideDialog').close();});

// ---------- map and quiz game ----------
let mapGame;
const game = { mode:'flag', mapMode:'find-country', index:0, total:5, correct:0, earned:0, newCountries:0, target:null, choices:[], hintLevel:0, selectedMap:null, locked:false, lastId:null };

function chooseTarget(requireShape=false) {
  let pool = countries195.filter(c=>c.id!==game.lastId);
  if (requireShape) pool = pool.filter(c=>mapGame.hasShape(c.id));
  const unsolved = pool.filter(c=>!state.solved.includes(c.id));
  if (unsolved.length && Math.random()<.68) pool=unsolved;
  const target=randomItem(pool);game.lastId=target.id;return target;
}
function choicePool(target){let pool=countries195.filter(c=>c.id!==target.id&&c.continent===target.continent);if(pool.length<3)pool=countries195.filter(c=>c.id!==target.id);return shuffle([target,...shuffle(pool).slice(0,3)]);}
function clueFor(c){if(state.lang==='ko'&&c.clue)return `${c.clue} ${c.human||''}`.trim();const capital=c.capital||countryName(c);const region=regionName(c),pop=populationName(c),area=areaName(c);if(state.lang==='en')return `This country is in ${region}. Its capital is ${capital}. It is ${area}, with a population of ${pop}.`;if(state.lang==='ja')return `この国は${region}にあります。首都は${capital}です。${area}で、人口は${pop}です。`;if(state.lang==='zh')return `这个国家位于${region}，首都是${capital}。它属于${area}，人口约为${pop}。`;return `이 나라는 ${region}에 있어요. 수도는 ${capital}이고, ${area}이며 인구는 ${pop} 정도예요.`;}

function transitionScreens(callback){const fade=$('#fadeLayer');fade.classList.add('show');setTimeout(()=>{callback();requestAnimationFrame(()=>setTimeout(()=>fade.classList.remove('show'),50));},280);}
function startGame(mode){
  game.mode=mode;game.index=0;game.correct=0;game.earned=0;game.newCountries=0;game.lastId=null;
  if(mode==='location'&&!['find-country','highlight-name','shape-name','flag-map'].includes(game.mapMode))game.mapMode='find-country';
  state.village.x=player.position.x;state.village.z=player.position.z;state.village.camera=cameraController.snapshot();saveState();
  transitionScreens(()=>{$('#villageScreen').hidden=true;$('#villageScreen').classList.remove('active');$('#gameScreen').hidden=false;$('#gameScreen').classList.add('active');villagePaused=true;mapGame.setSolved(state.solved);nextQuestion();});
}
function returnVillage(){
  transitionScreens(()=>{$('#gameScreen').hidden=true;$('#gameScreen').classList.remove('active');$('#villageScreen').hidden=false;$('#villageScreen').classList.add('active');$('#feedbackOverlay').hidden=true;$('#sessionResult').hidden=true;villagePaused=false;clock.getDelta();resize();updateVillageUi();});
}

function nextQuestion(){
  if(game.index>=game.total){showSessionResult();return;}
  game.index+=1;game.target=chooseTarget(game.mode==='location'&&game.mapMode==='shape-name');game.choices=choicePool(game.target);game.hintLevel=0;game.selectedMap=null;game.locked=false;
  $('#hintBox').hidden=true;$('#confirmMap').disabled=true;$('#feedbackOverlay').hidden=true;renderQuestion();
}

function renderQuestion(preserve=false){
  if(!game.target)return;
  const c=game.target;
  $('#questionProgress').textContent=`${game.index} / ${game.total}`;$('#gameStreak').textContent=state.streak;$('#gamePoints').textContent=state.points;
  $('#flagVisual').hidden=true;$('#clueVisual').hidden=true;$('#shapeVisual').hidden=true;$('#mapStage').hidden=true;$('#mapSubmodeTabs').hidden=game.mode!=='location';$('#answers').innerHTML='';$('#confirmMap').hidden=true;$('#questionSupport').textContent='';
  $$('#mapSubmodeTabs button').forEach(b=>b.classList.toggle('active',b.dataset.mapMode===game.mapMode));
  if(game.mode==='flag'){
    $('#gameModeIcon').textContent='🏳️';$('#gameModeLabel').textContent='FLAG PLAZA';$('#gameQuestionTitle').textContent=tr('flagTitle');$('#questionPrompt').textContent=tr('flagPrompt');$('#questionSupport').textContent=tr('selectAnswer');$('#flagVisual').hidden=false;$('#bigFlag').textContent=c.flag;renderAnswers();
  }else if(game.mode==='clue'){
    $('#gameModeIcon').textContent='📚';$('#gameModeLabel').textContent='WORLD LIBRARY';$('#gameQuestionTitle').textContent=tr('clueTitle');$('#questionPrompt').textContent=tr('cluePrompt');$('#questionSupport').textContent=tr('selectAnswer');$('#clueVisual').hidden=false;$('#clueText').textContent=clueFor(c);renderAnswers();
  }else{
    $('#gameModeIcon').textContent='🗺️';$('#gameModeLabel').textContent='MAP OBSERVATORY';$('#gameQuestionTitle').textContent=tr('locationTitle');renderLocationQuestion();
  }
  if(!preserve)speak($('#questionPrompt').textContent);
}

function renderLocationQuestion(){
  const c=game.target;mapGame.setSolved(state.solved);mapGame.clearSelection();game.selectedMap=null;
  if(game.mapMode==='find-country'){$('#questionPrompt').textContent=tr('findPrompt',{country:countryName(c)});$('#questionSupport').textContent=tr('selectOnMap');$('#mapStage').hidden=false;$('#confirmMap').hidden=false;mapGame.setChallenge({type:'find-country',targetId:c.id});}
  else if(game.mapMode==='flag-map'){$('#questionPrompt').textContent=tr('flagMapPrompt',{flag:c.flag});$('#questionSupport').textContent=tr('selectOnMap');$('#mapStage').hidden=false;$('#confirmMap').hidden=false;mapGame.setChallenge({type:'flag-map',targetId:c.id});}
  else if(game.mapMode==='highlight-name'){$('#questionPrompt').textContent=tr('highlightedPrompt');$('#questionSupport').textContent=tr('selectAnswer');$('#mapStage').hidden=false;mapGame.setChallenge({type:'highlight-name',targetId:c.id});renderAnswers();}
  else{$('#questionPrompt').textContent=tr('shapePrompt');$('#questionSupport').textContent=tr('selectAnswer');$('#shapeVisual').hidden=false;mapGame.setChallenge({type:'shape-name',targetId:c.id});mapGame.renderShape(c.id,$('#shapeSvg'));renderAnswers();}
}

function renderAnswers(){
  const root=$('#answers');root.innerHTML=game.choices.map((c,i)=>`<button type="button" data-country="${c.id}"><span>${i+1}</span> ${countryName(c)}</button>`).join('');
  root.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>submitAnswer(b.dataset.country,b)));
}

function submitAnswer(id,button=null){
  if(game.locked)return;game.locked=true;const correct=id===game.target.id;const first=!state.solved.includes(game.target.id);let gained=0;
  if(correct){gained=10+(game.hintLevel===0?3:0)+Math.min(state.streak,5)*2+(first?15:0);state.points+=gained;state.streak+=1;game.correct+=1;game.earned+=gained;if(first){state.solved.push(game.target.id);game.newCountries+=1;}const m=state.mastery[game.target.id]||{flag:0,clue:0,location:0};m[game.mode]=(m[game.mode]||0)+1;state.mastery[game.target.id]=m;button?.classList.add('correct');if(game.mode==='location'&&['find-country','flag-map'].includes(game.mapMode))mapGame.markSelection(id,true);}else{state.streak=0;button?.classList.add('wrong');const correctButton=$(`#answers [data-country="${game.target.id}"]`);correctButton?.classList.add('correct');if(game.mode==='location'&&['find-country','flag-map'].includes(game.mapMode))mapGame.markSelection(id,false);}
  saveState();updateVillageUi();showFeedback(correct,gained,first);
}

function showFeedback(correct,gained,first){
  const c=game.target;$('#feedbackIcon').textContent=correct?'✅':'🧭';$('#feedbackTitle').textContent=tr(correct?'correct':'wrong');$('#feedbackText').textContent=tr(correct?'correctBody':'wrongBody',{country:countryName(c),points:gained})+(correct&&first?` ${tr('firstDiscovery')}`:'');
  $('#countryMiniCard').innerHTML=`<span class="mini-flag">${c.flag}</span><div><h3>${countryName(c)}</h3><p><b>${tr('capital')}:</b> ${c.capital||'-'} · <b>${tr('region')}:</b> ${regionName(c)}<br><b>${tr('population')}:</b> ${populationName(c)} · <b>${tr('area')}:</b> ${areaName(c)}</p></div>`;
  $('#feedbackOverlay').hidden=false;speak(correct?`${countryName(c)}!`:countryName(c));
}

function hintText(level){const c=game.target,name=countryName(c),letters=[...name].filter(ch=>!/[\s·-]/.test(ch)),blank=[...name].map(ch=>/[\s·-]/.test(ch)?ch:'＿').join(' '),first=letters[0]||'';if(level===0)return tr('hintLength',{count:letters.length,blank});if(level===1)return tr('hintRegion',{region:regionName(c)});if(level===2)return tr('hintPopulation',{population:populationName(c),area:areaName(c)});return tr('hintFirst',{first});}
function showHint(){if(game.locked)return;const level=Math.min(game.hintLevel,3),text=hintText(level);$('#hintBox').hidden=false;$('#hintStep').textContent=`${level+1}/4`;$('#hintText').textContent=text;if(game.mode==='location')mapGame.hint(level,game.target);if(game.hintLevel<3)game.hintLevel+=1;speak(text);}
function showSessionResult(){state.sessions+=1;saveState();$('#feedbackOverlay').hidden=true;$('#resultCorrect').textContent=`${game.correct}/${game.total}`;$('#resultPoints').textContent=`+${game.earned}`;$('#resultNew').textContent=game.newCountries;$('#sessionResult').hidden=false;}

function onMapCountryClick(id){if(game.mode!=='location'||game.locked||!['find-country','flag-map'].includes(game.mapMode))return;game.selectedMap=id;mapGame.markSelection(id);$('#confirmMap').disabled=false;}

function initMap(){mapGame=new WorldMapGame({svg:$('#worldSvg'),countries:countries195,geojson:worldGeoJSON,onCountryClick:onMapCountryClick});mapGame.setSolved(state.solved);}

// ---------- UI events ----------
$$('.language-switch button').forEach(button=>button.addEventListener('click',()=>{state.lang=button.dataset.lang;applyLanguage();}));
$('#backVillage').addEventListener('click',returnVillage);$('#resultVillage').addEventListener('click',returnVillage);$('#playAgain').addEventListener('click',()=>{game.index=0;game.correct=0;game.earned=0;game.newCountries=0;$('#sessionResult').hidden=true;nextQuestion();});
$('#nextQuestionButton').addEventListener('click',nextQuestion);$('#hintButton').addEventListener('click',showHint);$('#skipButton').addEventListener('click',()=>submitAnswer(''));$('#confirmMap').addEventListener('click',()=>{if(game.selectedMap)submitAnswer(game.selectedMap);});
$('#voiceButton').addEventListener('click',()=>{state.audio=!state.audio;$('#voiceButton').textContent=state.audio?'🔊':'🔈';$('#voiceButton').setAttribute('aria-pressed',String(state.audio));saveState();if(state.audio&&game.target)speak($('#questionPrompt').textContent);});
$('#mapZoomIn').addEventListener('click',()=>mapGame.zoomBy(1.35));$('#mapZoomOut').addEventListener('click',()=>mapGame.zoomBy(1/1.35));$('#mapReset').addEventListener('click',()=>mapGame.reset());
$$('#mapSubmodeTabs [data-map-mode]').forEach(button=>button.addEventListener('click',()=>{if(game.locked)return;game.mapMode=button.dataset.mapMode;if(game.mapMode==='shape-name'&&!mapGame.hasShape(game.target.id)){game.target=chooseTarget(true);game.choices=choicePool(game.target);}game.hintLevel=0;$('#hintBox').hidden=true;renderQuestion();}));
window.addEventListener('resize',resize);window.addEventListener('beforeunload',()=>{if(player){state.village.x=player.position.x;state.village.z=player.position.z;state.village.camera=cameraController.snapshot();saveState();}});document.addEventListener('visibilitychange',()=>{if(!document.hidden&&clock)clock.getDelta();});
window.addEventListener('keydown',e=>{if($('#gameScreen').hidden||game.locked)return;if(['Digit1','Digit2','Digit3','Digit4'].includes(e.code)){const i=Number(e.code.slice(-1))-1;$('#answers button')?.parentElement?.children[i]?.click();}});

// ---------- PWA: install, fullscreen, service worker ----------
const INSTALL_DISMISS_KEY='gfield-world-install-dismissed-session';
let deferredInstallPrompt=null;
function isStandaloneDisplay(){return matchMedia('(display-mode: standalone)').matches||matchMedia('(display-mode: fullscreen)').matches||navigator.standalone===true;}
function isIOSDevice(){return /iphone|ipad|ipod/i.test(navigator.userAgent)&&!window.MSStream;}
function setupFullscreen(){
  const el=document.documentElement;
  const supported=!!(el.requestFullscreen||el.webkitRequestFullscreen);
  if(!supported)return;
  $('#fullscreenButton').hidden=false;
  $('#fullscreenButton').addEventListener('click',()=>{
    if(document.fullscreenElement||document.webkitFullscreenElement){(document.exitFullscreen||document.webkitExitFullscreen).call(document);}
    else{(el.requestFullscreen||el.webkitRequestFullscreen).call(el).catch(()=>{});}
  });
}
function setupInstallBanner(){
  if(isStandaloneDisplay()||sessionStorage.getItem(INSTALL_DISMISS_KEY))return;
  if(isIOSDevice()){
    $('#installBannerText').textContent=tr('installIOS');
    $('#installActionButton').hidden=true;
    $('#installBanner').hidden=false;
  }else{
    window.addEventListener('beforeinstallprompt',e=>{
      e.preventDefault();deferredInstallPrompt=e;
      $('#installBannerText').textContent=tr('installAndroid');
      $('#installActionButton').hidden=false;
      $('#installBanner').hidden=false;
    });
  }
  $('#installBannerClose').addEventListener('click',()=>{$('#installBanner').hidden=true;sessionStorage.setItem(INSTALL_DISMISS_KEY,'1');});
  $('#installActionButton').addEventListener('click',async()=>{
    if(!deferredInstallPrompt)return;
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt=null;
    $('#installBanner').hidden=true;
    sessionStorage.setItem(INSTALL_DISMISS_KEY,'1');
  });
}
function registerServiceWorker(){
  if(!('serviceWorker'in navigator))return;
  navigator.serviceWorker.register('/world-explorer/sw.js',{scope:'/world-explorer/'}).catch(()=>{});
}

// ---------- boot ----------
function boot(){
  applyLanguage();renderCharacterDialog();initMap();
  try{buildWorld();}catch(error){console.error('3D village failed',error);$('#villageLoading').innerHTML='<strong>3D 마을을 시작하지 못했어요. WebGL과 인터넷 연결을 확인해 주세요.</strong>';}
  $('#voiceButton').textContent=state.audio?'🔊':'🔈';$('#voiceButton').setAttribute('aria-pressed',String(state.audio));
  if(!characterState.playerName) setTimeout(()=>openNameDialog(true),900);
  setupFullscreen();setupInstallBanner();registerServiceWorker();
}
boot();
