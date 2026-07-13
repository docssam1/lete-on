(()=>{
'use strict';
const app=document.getElementById('app');
// Pick the best ENGLISH voice for on-device TTS (Web Speech). The persistent
// "한국말로 영어" bug happens when a Korean (or other non-English) system voice
// reads English text — so we (1) only ever pick a voice whose lang is en-*,
// (2) prefer known natural voices across platforms, and (3) never fall back to a
// non-English voice. We also re-pick whenever the voice list changes, because
// voices load asynchronously and an early partial list must not lock in a poor
// choice for the whole session.
let _enVoice=null, _enVoiceCount=-1;
let _audioEl=null;
// Known good, natural-sounding English voices by exact name (Google / Microsoft
// Natural / Apple). First match in device order wins.
const GOOD_EN_VOICES=[
  'Google US English','Google UK English Female','Google UK English Male',
  'Microsoft Aria Online (Natural) - English (United States)','Microsoft Jenny Online (Natural) - English (United States)',
  'Microsoft Guy Online (Natural) - English (United States)','Microsoft Ana Online (Natural) - English (United States)',
  'Microsoft Sonia Online (Natural) - English (United Kingdom)','Microsoft Ryan Online (Natural) - English (United Kingdom)',
  'Microsoft Aria','Microsoft Jenny','Microsoft Guy','Microsoft Zira','Microsoft David','Microsoft Mark',
  'Samantha','Ava (Premium)','Ava (Enhanced)','Ava','Allison','Susan','Zoe','Karen','Serena','Daniel','Kate','Oliver','Alex','Fred','Moira','Tessa',
  'Siri','Nicky','Aaron',
];
function getBestEnVoice(){
  const synth=window.speechSynthesis; if(!synth) return null;
  const all=synth.getVoices()||[];
  if(_enVoice && all.length===_enVoiceCount) return _enVoice;   // stable list → keep cached pick
  _enVoiceCount=all.length;
  // English-only pool. lang like "en-US"/"en_GB"; also accept name containing
  // "English" as a last resort for mislabelled lang fields — but NEVER a CJK/other voice.
  let en=all.filter(v=>v.lang && /^en[-_]/i.test(v.lang));
  if(!en.length) en=all.filter(v=>/english/i.test(v.name||'') && !/[ㄱ-힝぀-ヿ一-鿿]/.test(v.name||''));
  const byName=n=>en.find(v=>v.name===n);
  _enVoice = GOOD_EN_VOICES.map(byName).find(Boolean)
    || en.find(v=>/natural/i.test(v.name||'') && /^en[-_]us/i.test(v.lang))
    || en.find(v=>/^en[-_]us/i.test(v.lang))
    || en.find(v=>/^en[-_]gb/i.test(v.lang))
    || en.find(v=>/^en[-_]au/i.test(v.lang))
    || en[0] || null;
  return _enVoice;
}
if(window.speechSynthesis){window.speechSynthesis.onvoiceschanged=()=>{_enVoice=null;_enVoiceCount=-1;getBestEnVoice();};try{getBestEnVoice();}catch(e){}}
const letters=['A','B','C','D'];
const LESSON1_ZH={zoo:'动物园',squirrels:'松鼠',robins:'知更鸟',cages:'笼子',crickets:'蟋蟀',chipmunks:'花栗鼠',moths:'飞蛾',fireflies:'萤火虫',skunks:'臭鼬',free:'免费的', 'pulling your leg':'开玩笑 / 骗你', 'shoo away':'赶走'};
// --- multi-lesson engine ---
let L={};                 // current runtime lesson (kept in the same shape the views expect)
let currentLessonId='lesson1';
let currentBookId='cars-level-b';
let originalReqRun=0;      // guards async original fetches when switching lessons
function availableLessons(bookId){const bid=bookId||currentBookId;if(bid==='cars-level-b'){const list=['lesson1'];Object.keys(window.LESSONS||{}).filter(id=>{const r=window.LESSONS[id];return(r.bookId||'cars-level-b')==='cars-level-b';}).sort((a,b)=>lessonNum(a)-lessonNum(b)).forEach(id=>{if(!list.includes(id))list.push(id);});return list;}return Object.keys(window.LESSONS||{}).filter(id=>{const r=window.LESSONS[id];return r.bookId===bid;}).sort((a,b)=>lessonNum(a)-lessonNum(b));}
function bookCatalogEntry(bid){return (window.BOOK_CATALOG||[]).find(b=>b.id===bid)||null;}
function availableBooks(){const books=new Map();
 const add=(bid)=>{if(books.has(bid))return;const c=bookCatalogEntry(bid);if(c){const title=(c.subtitle?`${c.title} · ${c.subtitle}`:c.title);books.set(bid,{id:bid,title,shortLabel:c.subtitle||c.title});}else{const r=Object.values(window.LESSONS||{}).find(x=>(x.bookId||'cars-level-b')===bid);const lvl=(r&&r.levelId)||bid.split('-').pop().toUpperCase();books.set(bid,{id:bid,title:`CARS · Level ${lvl}`,shortLabel:`Level ${lvl}`});}};
 add('cars-level-b');
 Object.values(window.LESSONS||{}).forEach(r=>add(r.bookId||'cars-level-b'));
 return [...books.values()];}
function lessonNum(id){return parseInt(String(id).replace(/[^0-9]/g,''),10)||0;}
function currentBookLabel(){return(availableBooks().find(b=>b.id===currentBookId)||{shortLabel:'Level B'}).shortLabel;}
function lessonMeta(id){if(id==='lesson1'){const b=window.LESSON1||{};return{id:'lesson1',num:1,title:b.title||'My Backyard Zoo',image:b.image||'assets/images/cars-level-b/lesson-01-my-backyard-zoo.png',theme:b.title||'My Backyard Zoo'};}const r=(window.LESSONS||{})[id]||{};return{id,num:lessonNum(id),title:r.title||id,image:r.image||'',theme:r.theme||''};}
function buildRuntimeLesson(id){
 if(id==='lesson1'){const b={...(window.LESSON1||{}),...(window.LESSON1_ORIGINAL||{})};b._zh=LESSON1_ZH;b._lessonId='lesson1';b.originalExtraTitle=b.title||'My Backyard Zoo';b.extraTitle='A New Backyard Zoo';return b;}
 const r=(window.LESSONS||{})[id];if(!r)return null;const zh={};(r.words||[]).forEach(w=>{zh[w[0]]=w[3]||w[1];});
 return {_lessonId:id,title:r.title,image:r.image,theme:r.theme,
  words:(r.words||[]).map(w=>[w[0],w[1],w[2]]),_zh:zh,
  originalPassage:(r.original&&r.original.passage)||null,originalQuestions:(r.original&&r.original.questions)||null,
  originalExtraPassage:(r.extraLearning||{}).passage||[],originalExtraQuestions:(r.extraLearning||{}).questions||[],originalExtraTitle:(r.extraLearning||{}).title||r.title,
  extraPassage:(r.newPassage||{}).passage||[],extraQuestions:(r.newPassage||{}).questions||[],extraTitle:(r.newPassage||{}).title||'New Passage'};
}
function hasOriginal(){return Array.isArray(L.originalPassage)&&Array.isArray(L.originalQuestions)&&L.originalQuestions.length>0;}
function loadLesson(id){L=buildRuntimeLesson(id)||buildRuntimeLesson('lesson1');currentLessonId=L._lessonId||'lesson1';fetchOriginal(currentLessonId);}
function fetchOriginal(id){if(hasOriginal())return;if(!(window.Store&&Store.pullOriginal))return;const bookId=(window.LESSONS&&window.LESSONS[id])?window.LESSONS[id].bookId:'cars-level-b';const run=++originalReqRun;Store.pullOriginal(bookId,id).then(o=>{if(run!==originalReqRun||currentLessonId!==id||!o)return;if(Array.isArray(o.passage)&&Array.isArray(o.questions)&&o.questions.length){L.originalPassage=o.passage;L.originalQuestions=o.questions;render();}}).catch(()=>{});}
function wordMeaning(w){return st.lang==='ko'?w[2]:st.lang==='zh'?((L._zh&&L._zh[w[0]])||w[1]):w[1]}
function wordDetail(w){return st.lang==='ko'?w[1]:st.lang==='zh'?w[1]:''}
function myWordsList(){return (profile&&profile.myWords)||[];}
function isSaved(en){return myWordsList().some(w=>w.en===en);}
function myWordSourceLabel(w){
 const src=w.source;
 if(src&&src.type==='ebook'){const meta=libBookMeta(src.bookId);return `📗 ${meta?esc(meta.title):'eBook'}`;}
 if(src&&src.type==='writing'){const u=(window.WRITING&&WRITING.units||[]).find(x=>x.id===src.bookId);return `✏️ ${u?esc(u.title):'Writing'}`;}
 const lessonId=(src&&src.lessonId)||w.lessonId;
 return lessonId?`📘 Lesson ${lessonNum(lessonId)}`:'📘';
}
function toggleSaveWord(w,source){if(!profile||!w)return;profile.myWords=profile.myWords||[];const i=profile.myWords.findIndex(x=>x.en===w[0]);if(i>=0){profile.myWords.splice(i,1);}else{
 source=source||{type:'textbook',bookId:currentBookId,lessonId:currentLessonId};
 const zh=source.type==='ebook'?(w[3]||w[1]):((L._zh&&L._zh[w[0]])||w[1]);
 profile.myWords.push({en:w[0],def:w[1],ko:w[2]||'',zh,lessonId:currentLessonId,source});
}save();}
function advanceGame(){const wc=(L.words||[]).length;st.gameIndex++;st.gameStatus='';st.gameTries=0;st.gameWrongPick='';st.gameHintOpen=false;if(st.gameIndex>=wc){st.gameDone=true;st.gameChoices=[];}else{st.gameChoices=makeGameChoices();}save();render();}
const I18N={
 ko:{lang:'한국어', home:'오늘의 학습', words:'단어 배우기', read:'교재 풀기', questions:'교재 학습', originalExtra:'추가 학습', similar:'새 지문 연습', extra:'새 지문 연습', report:'학습 리포트', learnFirst:'먼저 단어를 배워요!', start:'학습 시작', cards:'단어 배우기', memory:'암기 카드', game:'단어 게임', original:'교재 학습', stepWords:'STEP 1. 단어 배우기', stepRead:'STEP 2. 교재 풀기', stepQuestions:'STEP 3. 교재 학습', stepOriginalExtra:'STEP 4. 추가 학습', stepExtra:'STEP 5. 새 지문 연습', listenAll:'교재 듣기', listenHere:'지금 문단 듣기', stop:'멈추기', speed:'속도', startQuestions:'교재 학습 시작 ↓', previous:'← 이전', next:'다음 문제 →', skip:'건너뛰기', check:'채점하기', seeBlank:'빈 문제 보러 가기', gradeAnyway:'그대로 채점하기', unanswered:'아직 답하지 않은 문제가 있어요.', unansweredCount:'개의 빈 문제가 있어요.', originalHint:'교재 지문은 위에서 계속 볼 수 있어요.', selectAnswer:'답을 고른 뒤 다음 문제로 넘어가세요.', title:'My Backyard Zoo', originalSubtitle:'그림을 보고, 교재 지문을 들으며 천천히 읽어 보세요.', originalExtraSubtitle:'짧은 보조 지문을 읽고, 교재 내용과 연결해 더 깊이 학습해요.', extraSubtitle:'같은 12단어가 들어간 새 지문을 읽고 유사문제를 풀어요.', done:'완료', skipped:'건너뜀', remaining:'남음', known:'I know it', knownDone:'Known ✓', korean:'Korean', flip:'카드 뒤집기', finishWords:'단어 학습 완료 · 교재 풀기 →', reportTitle:'Lesson 1 결과', score:'점', progress:'진행', retry:'틀린 새 지문 연습 다시 풀기', readExtra:'새 지문 듣기', startOriginalExtra:'추가 학습 시작 →', startExtra:'새 지문 연습 시작 →', allDone:'모든 문제에 답했어요.', reviewReport:'학습 리포트 보기 →', close:'닫기', listenSentence:'전체 듣기', stopAudio:'음성 멈추기', sentenceTip:'전체를 자연스럽게 들으며, 읽는 문장을 따라가 보세요.', hidePassage:'지문 숨기기', showPassage:'지문 보기', printStudy:'인쇄하여 공부하기', wrongReview:'오답 학습', finishReview:'오답 학습 마치기'},
 en:{lang:'English', home:'Today', words:'Learn Words', read:'Read the Book', questions:'Book Study', originalExtra:'Extra Learning', similar:'New Passage Practice', extra:'New Passage Practice', report:'Learning Report', learnFirst:'Learn the words first!', start:'Start Learning', cards:'Learn Words', memory:'Memory Cards', game:'Word Game', original:'Book Study', stepWords:'STEP 1. Learn Words', stepRead:'STEP 2. Read the Book', stepQuestions:'STEP 3. Book Study', stepOriginalExtra:'STEP 4. Extra Learning', stepExtra:'STEP 5. New Passage Practice', listenAll:'Listen to the Story', listenHere:'Listen to This Paragraph', stop:'Stop', speed:'Speed', startQuestions:'Start Book Study ↓', previous:'← Previous', next:'Next →', skip:'Skip', check:'Check Answers', seeBlank:'See Unanswered', gradeAnyway:'Check Anyway', unanswered:'There are unanswered questions.', unansweredCount:' unanswered question(s).', originalHint:'Keep the passage open above.', selectAnswer:'Choose an answer or skip this question.', title:'My Backyard Zoo', originalSubtitle:'Look at the pictures and listen as you read.', originalExtraSubtitle:'Read a short helper passage and deepen your learning.', extraSubtitle:'Read a new story with the same 12 words and answer similar questions.', done:'Done', skipped:'Skipped', remaining:'Remaining', known:'I know it', knownDone:'Known ✓', korean:'Korean', flip:'Flip Card', finishWords:'Finished · Read the Book →', reportTitle:'Lesson 1 Results', score:'score', progress:'Progress', retry:'Retry Missed New Passage Questions', readExtra:'Listen to Practice Passage', startOriginalExtra:'Start Extra Learning →', startExtra:'Start New Passage Practice →', allDone:'All questions have an answer.', reviewReport:'View Learning Report →', close:'Close', listenSentence:'Listen to passage', stopAudio:'Stop audio', sentenceTip:'Listen naturally to the whole passage and follow the highlighted sentence.', hidePassage:'Hide Passage', showPassage:'Show Passage', printStudy:'Print to Study', wrongReview:'Wrong-Answer Practice', finishReview:'Finish Review'},
 zh:{lang:'中文', home:'今日学习', words:'学习单词', read:'阅读课文', questions:'教材学习', originalExtra:'追加学习', similar:'新文章练习', extra:'新文章练习', report:'学习报告', learnFirst:'先学习单词！', start:'开始学习', cards:'学习单词', memory:'记忆卡片', game:'单词游戏', original:'教材学习', stepWords:'第 1 步：学习单词', stepRead:'第 2 步：阅读课文', stepQuestions:'第 3 步：教材学习', stepOriginalExtra:'第 4 步：追加学习', stepExtra:'第 5 步：新文章练习', listenAll:'朗读课文', listenHere:'朗读本段', stop:'停止', speed:'速度', startQuestions:'开始教材学习 ↓', previous:'← 上一题', next:'下一题 →', skip:'跳过', check:'提交批改', seeBlank:'查看未答题', gradeAnyway:'直接批改', unanswered:'还有未答的题目。', unansweredCount:' 道题未作答。', originalHint:'上方可继续查看课文。', selectAnswer:'请选择答案或跳过本题。', title:'My Backyard Zoo', originalSubtitle:'看图片，边听边读课文。', originalExtraSubtitle:'阅读简短的辅助文章，加深对教材内容的理解。', extraSubtitle:'阅读含有相同 12 个单词的新故事，再完成相似练习。', done:'完成', skipped:'跳过', remaining:'剩余', known:'我认识', knownDone:'已掌握 ✓', korean:'韩语', flip:'翻转卡片', finishWords:'完成单词学习 · 阅读课文 →', reportTitle:'Lesson 1 结果', score:'分', progress:'进度', retry:'重做新文章错题', readExtra:'朗读练习文章', startOriginalExtra:'开始追加学习 →', startExtra:'开始新文章练习 →', allDone:'所有题目都已作答。', reviewReport:'查看学习报告 →', close:'关闭', listenSentence:'朗读全文', stopAudio:'停止朗读', sentenceTip:'自然朗读全文，并跟随高亮的句子。', hidePassage:'隐藏文章', showPassage:'显示文章', printStudy:'打印学习', wrongReview:'错题练习', finishReview:'完成错题练习'}
};
function defaultState(){return {view:'home',lang:'ko',wordMode:'cards',wordIndex:0,flipped:false,gameIndex:0,gameScore:0,gameChoices:[],gameDone:false,gameStatus:'',gameTries:0,gameWrongPick:'',gameHintOpen:false,known:{},para:0,speed:0.8,questionOpen:false,qMode:'original',qIndex:{original:0,originalExtra:0,similar:0,review:0},answers:{original:{},originalExtra:{},similar:{},review:{}},skipped:{original:{},originalExtra:{},similar:{},review:{}},attempts:{originalExtra:{},similar:{},review:{}},feedback:{originalExtra:{},similar:{},review:{}},original:null,originalExtra:null,similar:null,modal:null,speechRun:0,reviewComplete:false,awarded:{words:false,original:false,originalExtra:false,similar:false,review:0},passageHidden:{original:false,originalExtra:false,similar:false}};}
function normalizeState(s){s.qIndex={original:0,originalExtra:0,similar:0,review:0,...(s.qIndex||{})};s.answers={original:{},originalExtra:{},similar:{},review:{},...(s.answers||{})};s.skipped={original:{},originalExtra:{},similar:{},review:{},...(s.skipped||{})};s.attempts={originalExtra:{},similar:{},review:{},...(s.attempts||{})};s.feedback={originalExtra:{},similar:{},review:{},...(s.feedback||{})};s.passageHidden={original:false,originalExtra:false,similar:false,...(s.passageHidden||{})};s.awarded={words:false,original:false,originalExtra:false,similar:false,review:0,...(s.awarded||{})};s.modal=null;s.gameStatus=s.gameStatus||'';s.gameTries=s.gameTries||0;s.gameWrongPick=s.gameWrongPick||'';s.gameHintOpen=!!s.gameHintOpen;const SPD=[0.6,0.8,1,1.15,1.3];if(!SPD.includes(Number(s.speed)))s.speed=0.8;return s;}
let currentStudent=null;
let profile=null;      // student aggregate: { lessons:{lessonId:st}, points, lang, updatedAt }
let atTown=true;       // reading-town hub vs inside a lesson
let townView='map';    // 'map' | 'closet' | 'game' | 'pick' | 'screen' | 'notice'
let avTab='hat';       // active category in the closet
let noticeCache=null;  // notice board: null=loading, array=loaded rows
let noticeCompose=false;// notice board: compose form open
let sq={view:'plan',day:null,vid:null,qi:0};  // Screen Quest navigation state
let customizeMode='avatar';  // 'avatar' | 'town' inside the 꾸미기 screen
let lib=null;           // Library reader: {view:'shelf'|'book', bookId, pages, spread, flipDir}
let introDone=false;   // intro splash shown this session
let st=defaultState();
function introSeen(){try{return sessionStorage.getItem('rw_intro_seen')==='1'}catch(e){return introDone}}
function markIntroSeen(){introDone=true;try{sessionStorage.setItem('rw_intro_seen','1')}catch(e){}}
function introScreen(){
 const tap=st.lang==='ko'?'화면을 탭하면 소리와 함께 시작해요':st.lang==='zh'?'点击屏幕，开启声音开始':'Tap the screen to start with sound';
 const skip=st.lang==='ko'?'건너뛰기':st.lang==='zh'?'跳过':'Skip';
 return `<div class="intro" id="intro"><video class="intro-video" id="intro-video" src="assets/video/intro.mp4" muted autoplay playsinline preload="auto"></video><div class="intro-veil"></div><button class="intro-tap" id="intro-tap"><span class="intro-sound">🔊</span><b>${tap}</b></button><button class="intro-skip" id="intro-skip">${skip} →</button></div>`;
}
function bindIntro(){
 const v=document.getElementById('intro-video');
 const finish=()=>{markIntroSeen();const el=document.getElementById('intro');if(el){el.classList.add('fade-out');setTimeout(()=>render(),420);}else render();};
 if(v){const p=v.play();p&&p.catch&&p.catch(()=>{});v.onended=finish;}
 const unmute=()=>{if(v){v.muted=false;try{v.currentTime=0;}catch(e){}const p=v.play();p&&p.catch&&p.catch(()=>{});}const t=document.getElementById('intro-tap');if(t)t.classList.add('is-on');};
 const tap=document.getElementById('intro-tap');if(tap)tap.onclick=unmute;
 if(v)v.onclick=unmute;
 const sk=document.getElementById('intro-skip');if(sk)sk.onclick=finish;
}
const t=(k)=>I18N[st.lang]?.[k]??I18N.ko[k]??k;
const save=()=>{if(currentStudent&&profile){st.updatedAt=Date.now();profile.lessons=profile.lessons||{};profile.lessons[currentLessonId]=st;profile.lang=st.lang;profile.updatedAt=st.updatedAt;if(window.GameStore){GameStore.migrate(profile);if(lessonDone(currentLessonId))GameStore.markLessonComplete(profile,currentLessonId);}Store.save(currentStudent.id,profile);}};
// Growth-based points: earned only by genuine learning, never random. Not the goal — a quiet nudge.
function awardPoints(n,msg){if(!profile||n<=0)return;if(window.GameStore)GameStore.addCoins(profile,n);else profile.points=(profile.points||0)+n;save();if(msg)toast(`★ +${n}P · ${msg}`);}
// --- avatar / customization ---
function avCat(key){return ((window.AVATAR&&window.AVATAR.categories)||[]).find(c=>c.key===key);}
function avItem(key,id){const c=avCat(key);return c&&c.items.find(i=>i.id===id);}
function ensureAvatar(p){if(!p||!window.AVATAR)return;if(!p.avatar||typeof p.avatar!=='object')p.avatar={};p.avatar.equipped={...window.AVATAR.defaults,...(p.avatar.equipped||{})};if(!Array.isArray(p.avatar.owned))p.avatar.owned=[];window.AVATAR.categories.forEach(c=>c.items.forEach(it=>{if(it.cost===0){const k=c.key+':'+it.id;if(!p.avatar.owned.includes(k))p.avatar.owned.push(k);}}));}
function avEquipped(){ensureAvatar(profile);return (profile&&profile.avatar&&profile.avatar.equipped)||(window.AVATAR&&window.AVATAR.defaults)||{};}
function avOwns(key,id){ensureAvatar(profile);return !!(profile&&profile.avatar&&profile.avatar.owned.includes(key+':'+id));}
function hairPaths(style,C){const cap=`<path d="M35,52 Q34,29 60,27 Q86,29 85,52 Q79,39 60,37 Q41,39 35,52 Z" fill="${C}"/>`;
 switch(style){
  case 'none':return {back:'',front:''};
  case 'short':return {back:'',front:cap};
  case 'long':return {back:`<path d="M31,50 Q29,95 46,98 Q43,71 49,58 Q54,45 60,45 Q66,45 71,58 Q77,71 74,98 Q91,95 89,50 Q89,24 60,24 Q31,24 31,50 Z" fill="${C}"/>`,front:cap};
  case 'wavy':return {back:`<path d="M32,50 Q31,82 44,87 Q46,66 50,58 Q54,48 60,48 Q66,48 70,58 Q74,66 76,87 Q89,82 88,50 Q88,24 60,24 Q32,24 32,50 Z" fill="${C}"/>`,front:cap};
  case 'ponytail':return {back:`<path d="M80,40 Q100,45 96,68 Q93,83 82,80 Q92,64 79,53 Z" fill="${C}"/><circle cx="80" cy="42" r="4" fill="#ffffff" opacity=".55"/>`,front:cap};
  case 'bun':return {back:`<circle cx="60" cy="22" r="10" fill="${C}"/>`,front:cap};
  case 'braids':return {back:`<g fill="${C}"><path d="M37,50 Q29,84 41,94 Q48,83 41,66 Q39,56 45,51 Z"/><path d="M83,50 Q91,84 79,94 Q72,83 79,66 Q81,56 75,51 Z"/></g><circle cx="40" cy="63" r="2.6" fill="#ffffff" opacity=".5"/><circle cx="80" cy="63" r="2.6" fill="#ffffff" opacity=".5"/>`,front:cap};
  case 'curly':return {back:'',front:`<g fill="${C}"><circle cx="42" cy="41" r="10"/><circle cx="53" cy="31" r="10"/><circle cx="67" cy="31" r="10"/><circle cx="78" cy="41" r="10"/><circle cx="60" cy="45" r="11"/></g>`};
  default:return {back:'',front:cap};
 }}
function legoHair(style,c){
 const cap=`<path d="M42,41 Q41,25 60,24 Q79,25 78,41 Q69,34 60,34 Q51,34 42,41 Z" fill="${c}"/>`;
 let ex='';
 switch(style){
  case 'long': ex=`<path d="M41,38 L39,66 Q44,70 47,66 L48,40 Z" fill="${c}"/><path d="M79,38 L81,66 Q76,70 73,66 L72,40 Z" fill="${c}"/>`; break;
  case 'ponytail': ex=`<path d="M77,32 Q93,34 90,53 Q87,42 77,43 Z" fill="${c}"/><ellipse cx="79" cy="35" rx="3.4" ry="3" fill="#0000001f"/>`; break;
  case 'braids': ex=`<rect x="39" y="40" width="6" height="22" rx="3" fill="${c}"/><rect x="75" y="40" width="6" height="22" rx="3" fill="${c}"/><circle cx="42" cy="63" r="3.4" fill="${c}"/><circle cx="78" cy="63" r="3.4" fill="${c}"/>`; break;
  case 'bun': ex=`<circle cx="60" cy="18" r="7.5" fill="${c}"/>`; break;
  case 'curly': ex=`<circle cx="44" cy="36" r="4.6" fill="${c}"/><circle cx="51" cy="29" r="4.6" fill="${c}"/><circle cx="60" cy="27" r="4.6" fill="${c}"/><circle cx="69" cy="29" r="4.6" fill="${c}"/><circle cx="76" cy="36" r="4.6" fill="${c}"/>`; break;
  case 'wavy': ex=`<path d="M42,42 Q48,37 52,42 Q56,37 60,42 Q64,37 68,42 Q72,37 78,42 L78,45 Q60,39 42,45 Z" fill="${c}"/>`; break;
 }
 return cap+ex;
}
// Face expressions — original geometric shapes (no licensed decals), swapped into
// the same eye/brow/mouth slots on the head. 'happy' matches the pre-existing look
// exactly, so a profile with no saved face preference renders unchanged.
const BLUSH='<circle cx="49" cy="49" r="3" fill="#ff9aa2" opacity=".4"/><circle cx="71" cy="49" r="3" fill="#ff9aa2" opacity=".4"/>';
const DOT_EYES='<circle cx="52" cy="43" r="2.5" fill="#33272a"/><circle cx="68" cy="43" r="2.5" fill="#33272a"/>';
const SMILE='<path d="M51,48 Q60,55 69,48" fill="none" stroke="#33272a" stroke-width="2.2" stroke-linecap="round"/>';
const FACE_DEFS={
 happy:{eyes:DOT_EYES,mouth:SMILE,blush:BLUSH},
 bigsmile:{eyes:DOT_EYES,mouth:SMILE+'<rect x="54" y="47" width="12" height="4" rx="1" fill="#fff"/>',blush:BLUSH},
 wink:{eyes:'<circle cx="52" cy="43" r="2.5" fill="#33272a"/><path d="M65,43 Q68,40 71,43" fill="none" stroke="#33272a" stroke-width="2" stroke-linecap="round"/>',mouth:SMILE,blush:BLUSH},
 surprised:{eyes:'<circle cx="52" cy="43" r="3.6" fill="#33272a"/><circle cx="68" cy="43" r="3.6" fill="#33272a"/>',mouth:'<ellipse cx="60" cy="51" rx="4" ry="5" fill="#3a2b1e"/>',blush:BLUSH},
 determined:{eyes:DOT_EYES,mouth:'<path d="M52,50 L68,50" stroke="#33272a" stroke-width="2.2" stroke-linecap="round"/>',brows:'<path d="M47,39 L56,42" stroke="#33272a" stroke-width="2.2" stroke-linecap="round"/><path d="M73,39 L64,42" stroke="#33272a" stroke-width="2.2" stroke-linecap="round"/>'},
 cool:{eyes:'<path d="M49,43 Q52,40 55,43" fill="none" stroke="#33272a" stroke-width="2" stroke-linecap="round"/><path d="M65,43 Q68,40 71,43" fill="none" stroke="#33272a" stroke-width="2" stroke-linecap="round"/>',mouth:'<path d="M53,50 L67,50" stroke="#33272a" stroke-width="2.2" stroke-linecap="round"/>'},
 sleepy:{eyes:'<path d="M49,43 Q52,41 55,43" fill="none" stroke="#33272a" stroke-width="2" stroke-linecap="round"/><path d="M65,43 Q68,41 71,43" fill="none" stroke="#33272a" stroke-width="2" stroke-linecap="round"/>',mouth:'<ellipse cx="60" cy="50" rx="2.2" ry="2.6" fill="#3a2b1e"/>',blush:BLUSH,extra:'<text x="82" y="30" font-size="11" font-weight="900" fill="#8aa6c9">Z</text>'},
 silly:{eyes:'<circle cx="52" cy="43" r="2.5" fill="#33272a"/><path d="M65,43 Q68,40 71,43" fill="none" stroke="#33272a" stroke-width="2" stroke-linecap="round"/>',mouth:SMILE+'<ellipse cx="60" cy="55" rx="3" ry="4" fill="#ff8fa3"/>',blush:BLUSH},
 star:{eyes:'<text x="52" y="47" font-size="10" text-anchor="middle">✦</text><text x="68" y="47" font-size="10" text-anchor="middle">✦</text>',mouth:SMILE+'<rect x="54" y="47" width="12" height="4" rx="1" fill="#fff"/>',blush:BLUSH},
};
// LEGO minifigure avatar — round (cylindrical) head, stud, trapezoid torso (clothes),
// C-hands, legs, plus hat/hair customization. Same signature/parts as before.
function renderAvatar(eq,size,ropts){eq=eq||avEquipped();size=size||120;const noBg=ropts&&ropts.noBg;
 const bg=avItem('background',eq.background)||avItem('background','meadow');const clo=avItem('clothes',eq.clothes)||avItem('clothes','blue');
 const skin=(avItem('skin',eq.skin)||{}).fill||'#ffd9ad';const hairC=(avItem('haircolor',eq.haircolor)||{}).fill||'#6b4326';
 const hat=avItem('hat',eq.hat),gl=avItem('glasses',eq.glasses),pet=avItem('pet',eq.pet);
 const btm=avItem('bottom',eq.bottom)||avItem('bottom','navy');
 const cloF=clo?clo.fill:'#6db3f2';const PANTS=btm?btm.fill:'#3f4d66',BOOT='#29313f';
 const fd=FACE_DEFS[eq.face]||FACE_DEFS.happy;
 const stars=bg&&bg.stars?Array.from({length:10},(_,i)=>`<circle cx="${(i*17+9)%112+4}" cy="${(i*29+8)%64+6}" r="${i%3?1:1.6}" fill="#fff" opacity=".85"/>`).join(''):'';
 const hasHat=!!(hat&&hat.emoji);
 const eyes=(gl&&gl.emoji)?'':fd.eyes;
 const glT=(gl&&gl.emoji)?`<text x="60" y="48" font-size="17" text-anchor="middle">${gl.emoji}</text>`:'';
 const hatT=hasHat?`<text x="60" y="31" font-size="30" text-anchor="middle">${hat.emoji}</text>`:'';
 const petT=(pet&&pet.emoji)?`<text x="98" y="113" font-size="24" text-anchor="middle">${pet.emoji}</text>`:'';
 const hair=hasHat?'':legoHair(eq.hair||'short',hairC);
 return `<svg xmlns="http://www.w3.org/2000/svg" class="avatar-svg" viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="avatar">`+
  (noBg?'':`<rect x="0" y="0" width="120" height="120" rx="20" fill="${bg?bg.fill:'#dff5e1'}"/>${stars}`)+
  // legs + boots
  `<rect x="44" y="99" width="14" height="17" rx="2" fill="${PANTS}"/><rect x="62" y="99" width="14" height="17" rx="2" fill="${PANTS}"/>`+
  `<rect x="43" y="112" width="16" height="6" rx="2" fill="${BOOT}"/><rect x="61" y="112" width="16" height="6" rx="2" fill="${BOOT}"/>`+
  // hips
  `<rect x="42" y="92" width="36" height="9" rx="3" fill="${PANTS}"/>`+
  // arms (behind torso) + hands
  `<path d="M45,64 Q33,71 35,85 L43,85 Q42,73 50,67 Z" fill="${cloF}"/><path d="M75,64 Q87,71 85,85 L77,85 Q78,73 70,67 Z" fill="${cloF}"/>`+
  `<circle cx="37" cy="86" r="5" fill="${skin}"/><circle cx="83" cy="86" r="5" fill="${skin}"/>`+
  // torso (trapezoid = clothes)
  `<path d="M45,63 L75,63 L79,93 L41,93 Z" fill="${cloF}"/><path d="M45,63 L75,63 L76,71 L44,71 Z" fill="#ffffff" opacity=".13"/>`+
  `<rect x="41" y="89" width="38" height="4" fill="#0000001c"/>`+
  // neck
  `<rect x="54" y="56" width="12" height="6" fill="${skin}"/>`+
  // head (cylinder) + top stud
  `<rect x="54" y="20" width="12" height="7" rx="3" fill="${skin}"/><ellipse cx="60" cy="20" rx="6" ry="2.4" fill="${skin}"/>`+
  `<rect x="43" y="26" width="34" height="33" rx="13" fill="${skin}"/>`+
  // face
  (fd.brows||'')+eyes+(fd.blush||'')+fd.mouth+(fd.extra||'')+
  hair+glT+hatT+petT+`</svg>`;}
function basePicker(){const P=window.AVATAR.presets||[];const title=st.lang==='ko'?'어떤 친구로 시작할까요?':st.lang==='zh'?'想用哪个角色开始？':'Pick a character to start!';const sub=st.lang==='ko'?'나중에 언제든 바꿀 수 있어요.':st.lang==='zh'?'以后随时可以更换。':'You can change it anytime later.';const skip=st.lang==='ko'?'이걸로 시작!':st.lang==='zh'?'就用这个！':'Start!';
 const eq=avEquipped();const cards=P.map(p=>{const sel=eq.skin===p.look.skin&&eq.hair===p.look.hair&&eq.haircolor===p.look.haircolor;return `<button class="pick-card ${sel?'selected':''}" data-act="av-pick" data-preset="${p.id}"><div class="pick-ava">${renderAvatar({...window.AVATAR.defaults,...p.look},120)}</div><b>${p.name[st.lang]||p.name.en}</b></button>`;}).join('');
 return `<section class="base-picker"><h1>${title}</h1><p class="sub">${sub}</p><div class="pick-grid">${cards}</div><div class="tools center"><button class="btn primary big" data-act="av-pick-done">${skip} →</button></div></section>`;}
function closet(pts){const cats=window.AVATAR.categories;const L10N={closet:{ko:'내 캐릭터 꾸미기',en:'Customize My Character',zh:'装扮我的角色'},back:{ko:'마을로',en:'Reading Town',zh:'返回小镇'},equip:{ko:'입기',en:'Wear',zh:'穿上'},worn:{ko:'착용중',en:'Worn',zh:'已穿'},buy:{ko:'사기',en:'Buy',zh:'购买'}};const t2=k=>L10N[k][st.lang]||L10N[k].en;
 const tabs=cats.map(c=>`<button class="av-tab ${avTab===c.key?'active':''}" data-act="av-tab" data-cat="${c.key}">${c.name[st.lang]||c.name.en}</button>`).join('');
 const cat=avCat(avTab)||cats[0];const eq=avEquipped();
 const items=cat.items.map(it=>{const owned=avOwns(cat.key,it.id);const equipped=eq[cat.key]===it.id;
  const preview=`<div class="av-mini">${renderAvatar({...eq,[cat.key]:it.id},58)}</div>`;
  let ctrl;if(equipped)ctrl=`<span class="av-badge on">✓ ${t2('worn')}</span>`;else if(owned)ctrl=`<button class="btn tiny" data-act="av-equip" data-cat="${cat.key}" data-id="${it.id}">${t2('equip')}</button>`;else if(pts>=it.cost)ctrl=`<button class="btn tiny buy" data-act="av-buy" data-cat="${cat.key}" data-id="${it.id}">★${it.cost} ${t2('buy')}</button>`;else ctrl=`<span class="av-badge lock">🔒 ★${it.cost}</span>`;
  return `<div class="av-item ${equipped?'equipped':''}"><div class="av-prev">${preview}</div><b>${it.name[st.lang]||it.name.en}</b>${ctrl}</div>`;}).join('');
 const czt=(ko,en,zh)=>st.lang==='ko'?ko:st.lang==='zh'?zh:en;
 const modeTabs=`<div class="cz-modes"><button class="cz-mode ${customizeMode==='avatar'?'active':''}" data-act="cz-mode" data-mode="avatar">🧑 ${czt('아바타','Avatar','角色')}</button><button class="cz-mode ${customizeMode==='town'?'active':''}" data-act="cz-mode" data-mode="town">🏡 ${czt('마을','Town','小镇')}</button></div>`;
 const head=`<div class="closet-head"><button class="btn" data-act="town-map">← ${t2('back')}</button>${modeTabs}<span class="points-pill big">★ ${pts}P</span></div>`;
 if(customizeMode==='town')return `<section class="closet">${head}${townCloset(pts)}</section>`;
 return `<section class="closet">${head}<div class="closet-body"><div class="closet-preview">${renderAvatar(eq,210)}</div><div class="closet-shop"><div class="av-tabs">${tabs}</div><div class="av-grid">${items}</div></div></div></section>`;}
function dArt(id){const it=decoItem(id);return (window.DECOR_ART&&DECOR_ART[id])||(it?it.emoji:'');}
function decorArtUri(id){try{var svg=window.DECOR_ART&&DECOR_ART[id];if(!svg)return null;return 'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(svg)));}catch(e){return null;}}
function townCloset(pts){if(window.GameStore)GameStore.migrate(profile);const D=window.DECORATIONS||{slots:{},items:[]};const t=(ko,en,zh)=>st.lang==='ko'?ko:st.lang==='zh'?zh:en;
 const coins=window.GameStore?GameStore.coins(profile):pts;const placedMap=(profile.town&&profile.town.placedDecorations)||{};const owned=(profile.town&&profile.town.unlockedDecorations)||[];
 const intro=`<p class="td-intro">${t('빈 자리(＋)에 코인으로 장식을 사서 놓아요. 걸어다니지 않고 여기서 바로 꾸밀 수 있어요!','Buy a decoration with coins and place it in an empty spot (＋). Decorate right here — no walking needed!','用金币购买装饰放到空位（＋）。在这里就能装扮，不用走动！')}</p>`;
 const cards=Object.keys(D.slots).map(sid=>{const slot=D.slots[sid];const list=D.items.filter(x=>x.slot===sid);const placedId=placedMap[sid]||null;const placed=placedId?decoItem(placedId):null;
  const opts=list.map(it=>{const own=owned.includes(it.id);const isPlaced=placedId===it.id;let ctrl;if(isPlaced)ctrl=`<span class="av-badge on">✓</span>`;else if(own)ctrl=`<button class="btn tiny" data-act="td-place" data-id="${it.id}">${t('놓기','Place','放')}</button>`;else if(coins>=it.cost)ctrl=`<button class="btn tiny buy" data-act="td-buy" data-id="${it.id}">🪙${it.cost}</button>`;else ctrl=`<span class="av-badge lock">🔒${it.cost}</span>`;
   return `<div class="td-item ${isPlaced?'on':''}"><span class="td-art">${dArt(it.id)}</span><small>${it.name[st.lang]||it.name.en}</small>${ctrl}</div>`;}).join('');
  return `<section class="td-slot"><div class="td-slot-head"><span class="td-cur ${placed?'filled':''}">${placed?`<span class="td-art">${dArt(placed.id)}</span>`:'＋'}</span><b>${slot.name[st.lang]||slot.name.en}</b>${placed?`<button class="btn tiny" data-act="td-clear" data-slot="${esc(sid)}">${t('치우기','Remove','移除')}</button>`:''}</div><div class="td-items">${opts}</div></section>`;}).join('');
 return `<div class="td-wrap">${intro}<div class="td-grid">${cards}</div></div>`;}
function handleTownCustomize(b){const act=b.dataset.act;if(!window.GameStore){return;}GameStore.migrate(profile);
 if(act==='cz-mode'){customizeMode=b.dataset.mode;render();window.scrollTo({top:0});return;}
 const id=b.dataset.id;const it=id?decoItem(id):null;
 if(act==='td-buy'){if(it&&GameStore.spendCoins(profile,it.cost)){GameStore.unlockDecoration(profile,it.id);GameStore.placeDecoration(profile,it.slot,it.id);if(window.TownGame)TownGame.setDecor(it.slot,it.emoji,decorArtUri(it.id));save();render();}else toast(st.lang==='ko'?'코인이 부족해요.':st.lang==='zh'?'金币不够。':'Not enough coins.');return;}
 if(act==='td-place'){if(it){GameStore.placeDecoration(profile,it.slot,it.id);if(window.TownGame)TownGame.setDecor(it.slot,it.emoji,decorArtUri(it.id));save();render();}return;}
 if(act==='td-clear'){const sid=b.dataset.slot;if(sid){delete profile.town.placedDecorations[sid];if(window.TownGame)TownGame.setDecor(sid,'');save();render();}return;}}
const esc=(v)=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// ---- Library (page-flip e-book reader) ----
// Licensed page text is never bundled in git — it lives only in Supabase
// (`library_books`, book_id -> pages jsonb) and is pulled at read time, mirroring
// the lesson_content pattern used for CARS/Reading Prime originals. The catalog in
// data/library.js carries only public metadata (title, series, AR/R-G level).
const libT=(ko,en,zh)=>st.lang==='ko'?ko:st.lang==='zh'?zh:en;
function libCatalog(){return window.LIBRARY_CATALOG||{series:[],books:[]};}
function libBookMeta(id){return libCatalog().books.find(b=>b.id===id)||null;}
function libSeriesMeta(id){return libCatalog().series.find(s=>s.id===id)||null;}
function libEnsure(){if(profile&&!profile.library)profile.library={};return profile&&profile.library;}
function openLibrary(){lib={view:'shelf'};atTown=true;townView='library';render();window.scrollTo({top:0});}
function libSpreadCount(meta){return Math.ceil((meta.totalPages||0)/2);}
function libProgress(bookId){return libEnsure()&&profile.library[bookId];}
function openLibraryBook(bookId){
 const meta=libBookMeta(bookId);if(!meta)return;
 const saved=libProgress(bookId);
 const stage=(saved&&saved.introSeen)?'read':(meta.background?'intro':(meta.vocab&&meta.vocab.length?'vocab':'read'));
 lib={view:'book',bookId,pages:null,loading:true,loadError:false,spread:(saved&&typeof saved.spread==='number')?saved.spread:-1,stage,quizIndex:0,quizAnswers:[],quizFeedback:null};
 atTown=true;townView='library';render();window.scrollTo({top:0});
 libFetchPages(bookId);
}
// Fetches page text for the currently-open book. Split out from openLibraryBook so a
// failed/empty fetch (flaky connection, transient Supabase hiccup) can be retried
// without resetting reading progress or replaying the intro/vocab stages. A silent
// empty array here used to render as a totally blank page with no explanation — the
// mobile spread layout even CSS-hides the empty placeholder box, so a failed fetch
// looked like nothing was wrong at all. loadError surfaces that state explicitly.
function libFetchPages(bookId){
 if(!(window.Store&&Store.pullLibraryPages)){lib.loading=false;lib.loadError=true;render();return;}
 Store.pullLibraryPages(bookId).then(pages=>{
  if(!lib||lib.bookId!==bookId)return; // user navigated away before the fetch resolved
  const arr=Array.isArray(pages)?pages:[];
  lib.pages=arr;lib.loadError=(arr.length===0);lib.loading=false;render();
 }).catch(()=>{if(lib&&lib.bookId===bookId){lib.pages=lib.pages||[];lib.loadError=true;lib.loading=false;render();}});
}
function libSaveProgress(patch){if(!lib||lib.view!=='book'||!profile)return;libEnsure();const cur=profile.library[lib.bookId]||{};profile.library[lib.bookId]={...cur,spread:lib.spread,updatedAt:Date.now(),...(patch||{})};save();}
function libGoStage(stage){if(!lib||lib.view!=='book')return;lib.stage=stage;stopSpeak();window.scrollTo({top:0});render();}
function libGoSpread(delta){if(!lib||lib.view!=='book')return;const meta=libBookMeta(lib.bookId);const max=meta?libSpreadCount(meta)-1:0;
 lib.spread=Math.max(-1,Math.min(max,lib.spread+delta));lib.flip=delta>0?'next':'prev';stopSpeak();libSaveProgress();render();window.scrollTo({top:0});}
// Wrap a page's paragraphs into sentence-line spans (read-along highlight target),
// namespaced by page index so multiple visible pages don't collide.
function libPageBody(page,pageIdx){
 if(!page)return '';
 const paras=page.paragraphs||[];
 // Real book pagination: a chapter doesn't always start at the top of a page (the
 // previous chapter's tail may share the page). chapterTitleAt is the paragraph
 // index the heading prints before; defaults to 0 (top of page) when unset.
 const titleAt=page.chapterTitle?(page.chapterTitleAt||0):-1;
 // Illustration for this page, supplied by the director (not the licensed book's
 // own art) — served from private-facing Supabase Storage, never bundled into
 // git/GitHub Pages. Convention: {bookId}/page{N}.jpg (1-indexed to match the
 // on-screen page number). Most pages have none — the onerror handlers below
 // make that a silent no-op either way, so nothing breaks before art exists.
 const src=`${LIBRARY_IMG_BASE}/${lib.bookId}/page${pageIdx+1}.jpg`;
 if(!paras.length){
  const placeholderText=libT('(원본 삽화 페이지)','(Illustration page)','（原书插图页）');
  return `<div class="lib-page-illus-wrap"><img class="lib-page-img-full" src="${src}" alt="" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><div class="lib-page-text lib-page-illus" style="display:none">${esc(placeholderText)}</div></div>`;
 }
 let offset=0;
 const html=paras.map((p,pi)=>{
  const heading=pi===titleAt?`<h3 class="lib-ch-title">${esc(page.chapterTitle)}</h3>`:'';
  const sentences=splitSentences(p);
  const inner=sentences.map(s=>{const start=offset;const end=start+s.length;offset=end+1;return `<span class="sentence-line" data-libpage="${pageIdx}" data-start="${start}" data-end="${end}">${esc(s)} </span>`;}).join('');
  offset+=1;return `${heading}<p>${inner}</p>`;
 }).join('');
 return `<img class="lib-page-img" src="${src}" alt="" onerror="this.remove()"><div class="lib-page-content"><div class="lib-page-text">${html}</div></div>`;
}
function libAudioUrl(bookId,pageIdx){return `${AUDIO_BASE}/${bookId}/page${pageIdx+1}.mp3`;}
function libSpeakPage(pageIdx,pageText){
 stopSpeak();const run=++st.speechRun;
 const nodes=[...document.querySelectorAll(`.sentence-line[data-libpage="${pageIdx}"]`)];
 const url=libAudioUrl(lib.bookId,pageIdx);
 const el=new Audio(url);el.playbackRate=Number(st.speed)||1;_audioEl=el;
 const totalChars=nodes.length?Number(nodes[nodes.length-1].dataset.end)||0:0;let lastHL=null;
 el.ontimeupdate=()=>{if(run!==st.speechRun||!el.duration||!totalChars)return;
  const pos=(el.currentTime/el.duration)*totalChars;
  const cur=nodes.find(n=>pos>=Number(n.dataset.start)&&pos<Number(n.dataset.end));
  if(!cur||cur===lastHL)return;lastHL=cur;nodes.forEach(n=>n.classList.toggle('reading-now',n===cur));};
 el.onended=()=>{if(run===st.speechRun){_audioEl=null;nodes.forEach(n=>n.classList.remove('reading-now'));}};
 el.play().catch(()=>{_audioEl=null;
  if(!('speechSynthesis' in window)){toast(st.lang==='ko'?'이 브라우저는 읽어주기를 지원하지 않아요.':'Speech is not supported in this browser.');return;}
  const u=new SpeechSynthesisUtterance(pageText);u.lang='en-US';const v=getBestEnVoice();if(v)u.voice=v;u.rate=Number(st.speed)||1;
  let lh=null;u.onboundary=(ev)=>{if(run!==st.speechRun)return;const cur=nodes.find(n=>ev.charIndex>=Number(n.dataset.start)&&ev.charIndex<Number(n.dataset.end));if(!cur||cur===lh)return;lh=cur;nodes.forEach(n=>n.classList.toggle('reading-now',n===cur));};
  u.onend=()=>{if(run===st.speechRun)nodes.forEach(n=>n.classList.remove('reading-now'));};
  window.speechSynthesis.speak(u);});
}
// ---- Real-file (PDF) viewer — "원본 보기" tab ---------------------------------
// Loads pdf.js lazily (only when this tab actually opens) and renders the real
// scanned/exported page to a <canvas>. A transparent text-layer (positioned by
// pdf.js itself, not hand-rolled math) sits on top; the spans that fall inside
// each known-good sentence (from the same `lib.pages` data already driving the
// "읽기" tab) get tagged with the identical sentence-line/data-start/data-end
// contract libSpeakPage() already understands, so read-along highlighting works
// here with no changes to that function — same per-page mp3, same fraction-of-
// duration highlight math, just positioned over real page pixels instead of
// reconstructed HTML.
let _pdfJsLoading=null;
function ensurePdfJs(){
 if(window.pdfjsLib)return Promise.resolve(window.pdfjsLib);
 if(_pdfJsLoading)return _pdfJsLoading;
 _pdfJsLoading=new Promise((resolve,reject)=>{
  const s=document.createElement('script');
  s.src='vendor/pdfjs/pdf.min.js';
  s.onload=()=>{if(window.pdfjsLib){window.pdfjsLib.GlobalWorkerOptions.workerSrc='vendor/pdfjs/pdf.worker.min.js';resolve(window.pdfjsLib);}else reject(new Error('pdfjsLib missing after load'));};
  s.onerror=()=>reject(new Error('failed to load pdf.js'));
  document.head.appendChild(s);
 });
 return _pdfJsLoading;
}
// Collapse whitespace + normalize curly quotes for fuzzy matching, while
// keeping a per-character map back to the original string's indices — lets a
// known-good sentence be found inside pdf.js's raw extracted text without
// whitespace/quote-style differences breaking the match, and without losing
// the real character offsets needed to know which text items it spans.
function libNormMap(text){
 let out='';const map=[];let lastSpace=true;
 for(let i=0;i<text.length;i++){
  const c=text[i];
  const nc=(c==='‘'||c==='’')?"'":(c==='“'||c==='”')?'"':c.toLowerCase();
  if(/\s/.test(nc)){if(lastSpace)continue;out+=' ';map.push(i);lastSpace=true;}
  else{out+=nc;map.push(i);lastSpace=false;}
 }
 return {norm:out,map};
}
function renderLibraryPdfSentenceOverlay(page,viewport,idx){
 const overlay=document.getElementById('lib-pdf-overlay');if(!overlay)return;
 overlay.innerHTML='';overlay.style.width=viewport.width+'px';overlay.style.height=viewport.height+'px';overlay.style.setProperty('--scale-factor',viewport.scale);
 const pageData=(lib.pages||[])[idx];if(!pageData)return;
 page.getTextContent().then(tc=>window.pdfjsLib.renderTextLayer({textContentSource:tc,container:overlay,viewport}).promise.then(()=>tc)).then(tc=>{
  const spans=[...overlay.querySelectorAll('span')];const items=tc.items;
  let text='';const ranges=[];
  items.forEach((it,i)=>{const s=it.str||'';const start=text.length;text+=s;if(!/\s$/.test(s))text+=' ';ranges.push({start,end:start+s.length,span:spans[i]});});
  const {norm,map}=libNormMap(text);
  let searchFrom=0,offset=0;
  (pageData.paragraphs||[]).forEach(p=>{
   splitSentences(p).forEach(sentence=>{
    const start=offset;const end=start+sentence.length;offset=end+1;
    const needle=libNormMap(sentence).norm;if(!needle)return;
    const foundAt=norm.indexOf(needle,searchFrom);if(foundAt<0)return;
    searchFrom=foundAt+needle.length;
    const origStart=map[foundAt];const origEnd=map[Math.min(foundAt+needle.length-1,map.length-1)]+1;
    ranges.forEach(r=>{if(r.span&&r.end>origStart&&r.start<origEnd){r.span.classList.add('sentence-line');r.span.dataset.libpage=String(idx);r.span.dataset.start=String(start);r.span.dataset.end=String(end);}});
   });
  });
 }).catch(e=>console.warn('pdf text overlay failed',e));
}
function bindLibraryPdf(){
 if(!lib||lib.stage!=='original')return;
 const meta=libBookMeta(lib.bookId);if(!meta||!meta.sourceFile)return;
 const canvas=document.getElementById('lib-pdf-canvas');if(!canvas)return;
 if(canvas.dataset.rendering)return;
 const total=(lib.pages||[]).length||meta.totalPages||0;
 const idx=Math.max(0,Math.min(total-1,lib.pdfPageIndex||0));
 canvas.dataset.rendering='1';
 ensurePdfJs().then(pdfjsLib=>{
  const url=`${STORAGE_PUBLIC_BASE}/${meta.sourceFile.bucket}/${meta.sourceFile.path}`;
  const getDoc=(lib._pdfDoc&&lib._pdfDocUrl===url)?Promise.resolve(lib._pdfDoc):pdfjsLib.getDocument(url).promise.then(doc=>{lib._pdfDoc=doc;lib._pdfDocUrl=url;return doc;});
  return getDoc.then(doc=>doc.getPage(idx+(meta.sourceFile.pageOffset||1)));
 }).then(page=>{
  if(!document.body.contains(canvas))throw new Error('navigated-away');
  // Measure the stable outer card, not canvas.parentElement — that wrapper is
  // display:inline-block and sized BY the (still-empty) canvas itself, a
  // circular dependency that collapses it to near-zero on first render.
  const card=canvas.closest('.lib-pdf');
  const targetWidth=Math.max(240,((card&&card.clientWidth)||640)-8);
  const baseViewport=page.getViewport({scale:1});
  const scale=targetWidth/baseViewport.width;
  const viewport=page.getViewport({scale});
  canvas.width=viewport.width;canvas.height=viewport.height;
  canvas.style.width=viewport.width+'px';canvas.style.height=viewport.height+'px';
  const ctx=canvas.getContext('2d');
  return page.render({canvasContext:ctx,viewport}).promise.then(()=>renderLibraryPdfSentenceOverlay(page,viewport,idx));
 }).catch(e=>{if(String((e&&e.message)||e)!=='navigated-away')console.warn('pdf render failed',e);})
  .finally(()=>{delete canvas.dataset.rendering;});
}
function libPdfScreen(){
 const meta=libBookMeta(lib.bookId);if(!meta||!meta.sourceFile)return libReaderScreen();
 const head=libStageHead(meta);
 const total=(lib.pages||[]).length||meta.totalPages||0;
 if(lib.pdfPageIndex==null)lib.pdfPageIndex=lib.spread>=0?lib.spread*2:0;
 const idx=Math.max(0,Math.min(total-1,lib.pdfPageIndex));
 return `<div class="town lib-town">${head}<div class="lib-wrap"><section class="lib-pdf">
  <div class="lib-pdf-stage"><canvas id="lib-pdf-canvas"></canvas><div id="lib-pdf-overlay" class="lib-pdf-overlay"></div></div>
  <div class="lib-nav"><button class="btn tiny" data-act="lib-pdf-prev" ${idx<=0?'disabled':''}>← ${libT('이전','Prev','上一页')}</button><span class="lib-pageof">${idx+1} / ${total}</span><button class="btn tiny lib-listen" data-act="lib-pdf-listen">🔊 ${libT('듣기','Listen','朗读')}</button><button class="btn tiny" data-act="lib-pdf-next" ${idx>=total-1?'disabled':''}>${libT('다음','Next','下一页')} →</button></div>
  <p class="lib-hint">${libT('실제 책 페이지 원본이에요.','This is the real book page.','这是真实的原书页面。')}</p>
 </section></div></div>`;
}
// ---- Writing Village (wv-) — 6~9세 영어 라이팅: 편지→낱말→모델→트리→저널→답장 ----
// 전 콘텐츠는 data/writing.js의 창작물. 흐름: 캐릭터 질문 편지(말하기 리허설 포함) →
// 낱말 정원 → 모델 트리+저널 → 내 트리(낱말 골라 문장 실시간 조립+TTS) → 스스로 쓰기
// (유령 스타터 + 다듬기 체크) → 캐릭터 답장. 진행은 profile.writing에 저장.
let wv=null;
let _wvRec=null;
function WVDATA(){return window.WRITING||{pals:{},units:[]};}
function wvUnit(id){return WVDATA().units.find(u=>u.id===id)||null;}
function wvPal(u){return WVDATA().pals[u.from]||{name:'Friend',ko:'친구',e:'💌'};}
function wvEnsure(){if(profile&&!profile.writing)profile.writing={};return (profile&&profile.writing)||{};}
function wvProg(id){return wvEnsure()[id]||null;}
function wvJournalCount(){const W=wvEnsure();return Object.values(W).reduce((s,r)=>s+((r.journals||[]).length),0);}
function openWritingVillage(){stopSpeak();wv={view:'hub'};atTown=true;townView='writing';render();window.scrollTo({top:0});}
function openWvUnit(id){const u=wvUnit(id);if(!u)return;stopSpeak();wv={view:'unit',unitId:id,step:0,picks:{},journal:'',leaves:[],reply:null,treeAwarded:false,pruneAwarded:false};render();window.scrollTo({top:0});}
function wvMicSupported(){return !!(window.SpeechRecognition||window.webkitSpeechRecognition);}
function wvListenStart(){
 const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR||!wv)return;
 try{_wvRec=new SR();}catch(e){return;}
 _wvRec.lang='en-US';_wvRec.interimResults=false;_wvRec.maxAlternatives=1;
 wv.listening=true;render();
 _wvRec.onresult=ev=>{try{const t=ev.results[0][0].transcript;if(t&&wv&&wv.leaves.length<8)wv.leaves.push(t.trim());}catch(e){}};
 _wvRec.onend=()=>{if(wv){wv.listening=false;render();}};
 _wvRec.onerror=()=>{if(wv){wv.listening=false;render();}};
 try{_wvRec.start();}catch(e){wv.listening=false;render();}
}
// recipe의 {slot}에 고른 값을 끼워 문장 목록으로 조립. blank=미선택 표시.
function wvAssemble(u,picks,blank){return u.recipe.map(line=>{const s=line.replace(/\{(\w+)\}/g,(m,k)=>{const v=(picks[k]||'').trim();return v||blank||'___';});return s.charAt(0).toUpperCase()+s.slice(1);});}
function wvFilledCount(u){return u.slots.filter(s=>((wv.picks[s.k]||'').trim())).length;}
// 나무 SVG — 원본 기하 도형만. 채워진 슬롯 수만큼 가지에 잎이 핀다.
function wvTreeSvg(u,picks,size){
 size=size||260;const n=u.slots.length;const cx=size/2,groundY=size-18,topY=size*0.30;
 const leafColors=['#66bb6a','#43a047','#81c784','#4caf50','#a5d6a7','#2e7d32'];
 let branches='';
 for(let i=0;i<n;i++){
  const filled=!!((picks[u.slots[i].k]||'').trim());
  const ang=(-155+(130/(Math.max(1,n-1)))*i)*Math.PI/180;
  const bx=cx+Math.cos(ang)*size*0.34,by=topY+size*0.10+Math.sin(ang)*size*0.26;
  const label=filled?String(picks[u.slots[i].k]):u.slots[i].ko;
  const short=esc(label.length>14?label.slice(0,13)+'…':label);
  branches+=`<line x1="${cx}" y1="${topY+size*0.16}" x2="${bx}" y2="${by}" stroke="#8d6e63" stroke-width="5" stroke-linecap="round" opacity="${filled?1:.35}"/>`;
  branches+=`<g class="wv-leaf ${filled?'on':''}"><circle cx="${bx}" cy="${by}" r="${filled?26:16}" fill="${filled?leafColors[i%leafColors.length]:'#dce8d8'}"/><text x="${bx}" y="${by+3}" text-anchor="middle" font-size="${filled?8.5:9}" fill="${filled?'#fff':'#8aa08c'}" font-weight="700">${short}</text></g>`;
 }
 const crown=wvFilledCount(u)>=n?`<text x="${cx}" y="${topY-size*0.12}" text-anchor="middle" font-size="22">🌸</text>`:'';
 const center=(picks.topic||u.title);
 return `<svg viewBox="0 0 ${size} ${size}" class="wv-tree" role="img" aria-label="sentence tree">
  <ellipse cx="${cx}" cy="${groundY}" rx="${size*0.32}" ry="10" fill="#d7e6c9"/>
  <path d="M ${cx-10} ${groundY} C ${cx-8} ${groundY-size*0.3} ${cx-6} ${topY+30} ${cx} ${topY+16} C ${cx+6} ${topY+30} ${cx+8} ${groundY-size*0.3} ${cx+10} ${groundY} Z" fill="#8d6e63"/>
  ${branches}
  <circle cx="${cx}" cy="${topY+size*0.16}" r="30" fill="#fff8e1" stroke="#c9a227" stroke-width="2.5"/>
  <text x="${cx}" y="${topY+size*0.16+3}" text-anchor="middle" font-size="9" font-weight="800" fill="#7a5b00">${esc(String(center).length>13?String(center).slice(0,12)+'…':center)}</text>
  ${crown}
 </svg>`;
}
function wvChecks(u,text){
 const t=(text||'').trim();
 const sentences=splitSentences(t).filter(s=>s.trim().length>1);
 const treeWords=Object.values(wv.picks||{}).map(v=>String(v||'').trim()).filter(Boolean);
 const used=treeWords.filter(w=>t.toLowerCase().includes(w.toLowerCase().slice(0,12))).length;
 return [
  {ko:'대문자로 시작했어요',ok:/^[A-Z"']/.test(t)},
  {ko:'문장 끝에 . ! ?',ok:/[.!?]["']?\s*$/.test(t)},
  {ko:'because를 썼어요',ok:/because/i.test(t)},
  {ko:'문장이 3개 이상',ok:sentences.length>=3},
  {ko:'내 트리 낱말 2개 이상',ok:used>=2},
 ];
}
function wvRuleReply(u,picks){const s=u.reply.replace(/\{(\w+)\}/g,(m,k)=>{const v=(picks[k]||'').trim();return v||'that';});return s.replace(/([.!?]\s+)([a-z])/g,(m,a,b)=>a+b.toUpperCase());}
function wvSpeak(text){speakText(text);}
// Static Writing Village content (letters, model journals, word pronunciations)
// has pre-generated native-English MP3s (Chirp3-HD) in Supabase Storage, so it
// sounds right on every device regardless of installed voices. Play the MP3;
// fall back to on-device Web Speech if it can't load (offline / not yet
// generated). Dynamic content (child journal, AI reply, live tree sentence)
// keeps using wvSpeak/Web Speech — it can't be pre-recorded.
function wvAudioUrl(kind,unitId,i){return `${AUDIO_BASE}/writing/${unitId}-${kind==='word'?('w'+i):kind}.mp3`;}
function wvPlay(url,fallbackText){
  stopSpeak();const run=st.speechRun;let fell=false;
  const fb=()=>{if(fell||run!==st.speechRun)return;fell=true;_audioEl=null;if(fallbackText)speakText(fallbackText);};
  try{const el=new Audio(url);el.playbackRate=Number(st.speed)||1;_audioEl=el;
   el.onerror=fb;el.onended=()=>{if(run===st.speechRun)_audioEl=null;};
   el.play().catch(fb);}catch(e){fb();}
}
function wvHead(u){
 const pal=wvPal(u);
 const steps=[['💌','편지'],['🌱','낱말'],['🌳','모델'],['🌿','내 트리'],['✏️','저널'],['📬','답장']];
 const tabs=steps.map((s,i)=>`<button class="lib-tabbtn ${wv.step===i?'active':''}" data-act="wv-step" data-i="${i}" ${i>0&&wv.step<i&&!wvProg(u.id)?'':''}>${s[0]} ${s[1]}</button>`).join('');
 return `<div class="town-top lib-reader-top"><button class="btn tiny" data-act="wv-hub">← ${st.lang==='ko'?'마을 광장':'Village'}</button><b class="lib-reader-title">${u.emoji} ${esc(u.title)}</b><span class="lib-reader-tags"><span class="lib-tag">${pal.e} ${esc(pal.ko)}</span><span class="lib-tag">${u.level===1?'추천 6세+':'추천 7세+'}</span></span></div><div class="lib-stage-tabs">${tabs}</div>`;
}
function wvHubScreen(){
 const W=WVDATA();const total=wvJournalCount();
 const forest=total?`<div class="wv-forest">${'🌳'.repeat(Math.min(total,24))}${total>24?` +${total-24}`:''}</div>`:`<p class="wv-forest-empty">${st.lang==='ko'?'저널을 쓸 때마다 숲에 나무가 자라요!':'Every journal grows a tree!'}</p>`;
 const cards=W.units.map(u=>{const p=wvProg(u.id);const done=p&&p.done;const cnt=(p&&p.journals||[]).length;
  return `<button class="wv-card ${done?'done':''}" data-act="wv-open" data-unit="${u.id}"><span class="wv-card-emoji">${u.emoji}</span><b>${esc(u.title)}</b><small>${esc(u.ko)}</small><span class="wv-card-meta">${wvPal(u).e} ${done?`🌳×${cnt}`:(u.level===1?'6세+':'7세+')}</span></button>`;}).join('');
 return `<div class="town lib-town"><div class="town-top"><div class="town-brand">✏️ Writing Village</div><div class="town-tools"><button class="btn tiny" data-act="wv-book">📖 ${st.lang==='ko'?'내 이야기책':'My Storybook'} (${total})</button><button class="btn tiny" data-act="lib-back">← ${st.lang==='ko'?'마을로':'Town'}</button></div></div>
 <div class="lib-wrap"><p class="wv-sub">${st.lang==='ko'?'마을 친구들이 너에게 편지를 보냈어! 답장을 쓰면 숲이 자라나요.':'Village friends sent you letters! Write back and grow the forest.'}</p>
 ${forest}<div class="wv-grid">${cards}</div></div></div>`;
}
function wvBookScreen(){
 const W=wvEnsure();const rows=[];
 WVDATA().units.forEach(u=>{(W[u.id]&&W[u.id].journals||[]).forEach((j,ji)=>rows.push({u,j,ji}));});
 rows.sort((a,b)=>(b.j.date||0)-(a.j.date||0));
 const list=rows.length?rows.map(r=>`<article class="wv-entry"><div class="wv-entry-head"><b>${r.u.emoji} ${esc(r.u.title)}</b><small>${new Date(r.j.date).toLocaleDateString()}</small><button class="btn tiny" data-act="wv-entry-speak" data-unit="${r.u.id}" data-j="${r.ji}">🔊</button></div><p class="wv-entry-text">${esc(r.j.text)}</p>${r.j.reply?`<p class="wv-entry-reply">${wvPal(r.u).e} ${esc(r.j.reply)}</p>`:''}</article>`).join(''):`<p class="wv-forest-empty">${st.lang==='ko'?'아직 쓴 이야기가 없어요. 첫 편지에 답장해 볼까요?':'No stories yet!'}</p>`;
 return `<div class="town lib-town"><div class="town-top"><div class="town-brand">📖 My Storybook</div><div class="town-tools"><button class="btn tiny" data-act="wv-hub">← Writing Village</button></div></div><div class="lib-wrap"><div class="wv-book">${list}</div></div></div>`;
}
function wvLetterScreen(u){
 const pal=wvPal(u);
 const leaves=wv.leaves.map((l,i)=>`<span class="wv-leafchip">🍃 ${esc(l)} <button class="wv-x" data-act="wv-leaf-del" data-i="${i}">✕</button></span>`).join('');
 const mic=wvMicSupported()?`<button class="btn ${wv.listening?'secondary':'primary'}" data-act="wv-mic">${wv.listening?'🎙️ 듣고 있어요…':'🎙️ '+(st.lang==='ko'?'말로 먼저 대답해 보기':'Say it first')}</button>`:'';
 return `<div class="town lib-town">${wvHead(u)}<div class="lib-wrap"><section class="wv-panel">
  <div class="wv-envelope"><div class="wv-palrow"><span class="wv-palface">${pal.e}</span><b>${esc(pal.name)}</b><small>${esc(pal.ko)}</small></div>
  <p class="wv-letter">${esc(u.letter)}</p><p class="wv-letter-ko">${esc(u.letterKo||'')}</p>
  <div class="tools center"><button class="btn tiny" data-act="wv-letter-speak">🔊 ${st.lang==='ko'?'편지 듣기':'Listen'}</button>${mic}</div>
  ${leaves?`<div class="wv-leaves"><small>${st.lang==='ko'?'내가 말한 것 (트리에서 쓸 수 있어요)':'What I said'}:</small> ${leaves}</div>`:''}
  </div><div class="tools center"><button class="btn primary" data-act="wv-step" data-i="1">${st.lang==='ko'?'다음: 낱말 정원':'Next: Words'} →</button></div></section></div></div>`;
}
function wvWordsScreen(u){
 const cards=u.words.map((w,i)=>`<article class="word-card ${st.lang==='ko'?'ko':''}"><strong>${w[2]||''} ${esc(w[0])}</strong><p class="meaning">${esc(w[1])}</p><div class="word-actions"><button class="btn tiny" data-act="wv-word-speak" data-i="${i}">🔊</button><button class="btn tiny star ${isSaved(w[0])?'on':''}" data-act="wv-word-save" data-i="${i}">${isSaved(w[0])?'★':'☆'}</button></div></article>`).join('');
 return `<div class="town lib-town">${wvHead(u)}<div class="lib-wrap"><section class="wv-panel"><h2>🌱 ${st.lang==='ko'?'낱말 정원':'Word Garden'}</h2><div class="word-grid">${cards}</div><div class="tools center"><button class="btn primary" data-act="wv-step" data-i="2">${st.lang==='ko'?'다음: 모델 나무 구경':'Next: Model'} →</button></div></section></div></div>`;
}
function wvModelScreen(u){
 const pal=wvPal(u);
 const mockPicks={};u.slots.forEach((s,i)=>{mockPicks[s.k]=u.model.branches[i]||u.model.branches[u.model.branches.length-1]||'';});
 if(u.slots.some(s=>s.photo))mockPicks.topic=u.model.center;
 const sentences=splitSentences(u.model.journal);let off=0;
 const spans=sentences.map(s=>{const html=`<span class="sentence-line" data-wvmodel="1" data-start="${off}" data-end="${off+s.length}">${esc(s)} </span>`;off+=s.length+1;return html;}).join('');
 return `<div class="town lib-town">${wvHead(u)}<div class="lib-wrap"><section class="wv-panel"><h2>🌳 ${st.lang==='ko'?'친구의 나무와 저널':'A Friend\'s Tree & Journal'}</h2>
 <div class="wv-model"><div class="wv-treewrap">${wvTreeSvg(u,{...mockPicks,topic:u.model.center},240)}</div>
 <div class="wv-modeljournal"><div class="wv-palrow"><span class="wv-palface">${pal.e}</span><b>${st.lang==='ko'?'친구의 저널':'Friend\'s journal'}</b><button class="btn tiny" data-act="wv-model-speak">🔊</button></div><p class="wv-journaltext">${spans}</p>
 <p class="wv-tip">💡 ${st.lang==='ko'?'나무의 잎(재료)들이 문장 속에 쏙쏙 들어가 있어요!':'The leaves became sentences!'}</p></div></div>
 <div class="tools center"><button class="btn primary" data-act="wv-step" data-i="3">${st.lang==='ko'?'다음: 내 나무 키우기':'Next: My Tree'} →</button></div></section></div></div>`;
}
function wvTreeScreen(u){
 const photoSlot=u.slots.find(s=>s.photo);
 const photoPick=photoSlot?`<div class="wv-slotbox"><b>${esc(photoSlot.ko)}</b><div class="wv-chips">${(u.photos||[]).map(p=>`<button class="wv-chip photo ${wv.picks[photoSlot.k]===p.w?'on':''}" data-act="wv-pick" data-k="${photoSlot.k}" data-v="${esc(p.w)}">${p.e} ${esc(p.w)}</button>`).join('')}</div></div>`:'';
 const others=u.slots.filter(s=>!s.photo).map(s=>{
  if(s.free){const cur=wv.picks[s.k]||'';
   const leafBtns=wv.leaves.length?`<div class="wv-chips">${wv.leaves.map((l,i)=>`<button class="wv-chip leaf" data-act="wv-leaf-use" data-k="${s.k}" data-i="${i}">🍃 ${esc(l)}</button>`).join('')}</div>`:'';
   return `<div class="wv-slotbox free"><b>${esc(s.ko)}</b><input class="wv-input" data-wvfree="${s.k}" maxlength="${s.free.short?24:120}" placeholder="${esc(s.free.hint||'')}" value="${esc(cur)}">${leafBtns}</div>`;}
  return `<div class="wv-slotbox"><b>${esc(s.ko)}</b><div class="wv-chips">${s.opts.map(o=>`<button class="wv-chip ${wv.picks[s.k]===o?'on':''}" data-act="wv-pick" data-k="${s.k}" data-v="${esc(o)}">${esc(o)}</button>`).join('')}</div></div>`;
 }).join('');
 const lines=wvAssemble(u,wv.picks);
 const filled=wvFilledCount(u),totalSlots=u.slots.length;
 const preview=lines.map(l=>`<span class="${l.includes('___')?'dim':''}">${esc(l)}</span>`).join(' ');
 return `<div class="town lib-town">${wvHead(u)}<div class="lib-wrap"><section class="wv-panel"><h2>🌿 ${st.lang==='ko'?'내 문장 나무 키우기':'Grow My Sentence Tree'} <small class="wv-count">${filled}/${totalSlots}</small></h2>
 <div class="wv-treegrow"><div class="wv-treewrap">${wvTreeSvg(u,wv.picks,260)}</div>
 <div class="wv-slots">${photoPick}${others}</div></div>
 <div class="wv-preview"><b>${st.lang==='ko'?'지금까지 내 문장':'My sentences so far'}</b><p>${preview}</p><button class="btn tiny" data-act="wv-preview-speak">🔊 ${st.lang==='ko'?'들어보기':'Listen'}</button></div>
 <div class="tools center"><button class="btn primary" data-act="wv-tree-done" ${filled>=totalSlots?'':'disabled'}>${st.lang==='ko'?'나무 완성! 저널 쓰러 가기':'Tree done! Write'} →</button></div></section></div></div>`;
}
function wvJournalScreen(u){
 const ghost=wvAssemble(u,wv.picks,'___').join(' ');
 const checks=wvChecks(u,wv.journal);
 const allOk=checks.every(c=>c.ok);
 const checkHtml=checks.map(c=>`<span class="wv-check ${c.ok?'ok':''}">${c.ok?'✅':'⬜'} ${esc(c.ko)}</span>`).join('');
 return `<div class="town lib-town">${wvHead(u)}<div class="lib-wrap"><section class="wv-panel"><h2>✏️ ${st.lang==='ko'?'스스로 써 보기':'Write It Yourself'}</h2>
 <div class="wv-write"><div class="wv-treewrap small">${wvTreeSvg(u,wv.picks,180)}</div>
 <div class="wv-editor">${u.level===1?`<p class="wv-ghost">${esc(ghost)}</p>`:`<p class="wv-ghost faint">${st.lang==='ko'?'내 트리를 보며 나만의 문장으로 써 보세요!':'Use your tree!'}</p>`}
 <textarea class="wv-textarea" data-wvjournal rows="7" placeholder="${st.lang==='ko'?'여기에 내 저널을 써요…':'Write your journal here…'}">${esc(wv.journal||'')}</textarea>
 <div class="wv-checks">${checkHtml}</div></div></div>
 <div class="tools center"><button class="btn tiny" data-act="wv-journal-speak">🔊 ${st.lang==='ko'?'내 글 듣기':'Hear my writing'}</button><button class="btn primary" data-act="wv-submit">${st.lang==='ko'?'보내기':'Send'} 📮</button></div>
 ${allOk?`<p class="wv-alldone">🌸 ${st.lang==='ko'?'다듬기 완료! 나무에 꽃이 피었어요!':'All polished!'}</p>`:''}
 </section></div></div>`;
}
function wvAiPanel(u,ai){
 const stars=n=>{const v=Math.max(1,Math.min(4,Number(n)||1));return '★'.repeat(v)+'☆'.repeat(4-v);};
 const rb=ai.rubric||{};
 const fixes=(ai.fixes&&ai.fixes.length)?ai.fixes.map(f=>`<div class="wv-fix"><span class="wv-fix-orig">${esc(f.orig||'')}</span> → <b class="wv-fix-better">${esc(f.better||'')}</b><small>${esc(f.why||'')}</small></div>`).join(''):`<p class="wv-fix-none">🎉 ${st.lang==='ko'?'고칠 곳이 없어요! 완벽해요!':'Nothing to fix!'}</p>`;
 return `<div class="wv-ai">
  <h3>🌈 ${st.lang==='ko'?'무지개 펜 첨삭':'Rainbow Pen Feedback'}</h3>
  <div class="wv-praise">${(ai.praise||[]).map(p=>`<span class="wv-praise-chip">💚 ${esc(p)}</span>`).join('')}</div>
  ${fixes}
  ${ai.challenge?`<p class="wv-challenge">🎯 ${esc(ai.challenge)}</p>`:''}
  <div class="wv-rubric"><span>${st.lang==='ko'?'내용':'Content'} ${stars(rb.content)}</span><span>${st.lang==='ko'?'구성':'Organization'} ${stars(rb.organization)}</span><span>${st.lang==='ko'?'문법':'Grammar'} ${stars(rb.grammar)}</span><span>${st.lang==='ko'?'어휘':'Vocab'} ${stars(rb.vocab)}</span></div>
  ${ai.corrected?`<details class="wv-corrected"><summary>📝 ${st.lang==='ko'?'고쳐 쓴 전체 글 보기':'See the polished version'}</summary><p>${esc(ai.corrected)}</p></details>`:''}
  ${ai.replyLetter?`<div class="wv-envelope open"><div class="wv-palrow"><span class="wv-palface">${wvPal(u).e}</span><b>${esc(wvPal(u).name)}</b><small>${st.lang==='ko'?'AI 선생님 답장':'AI teacher reply'}</small></div><p class="wv-letter">${esc(ai.replyLetter)}</p><div class="tools center"><button class="btn tiny" data-act="wv-ai-speak">🔊</button></div></div>`:''}
 </div>`;
}
function wvReplyScreen(u){
 const pal=wvPal(u);
 const idx=WVDATA().units.findIndex(x=>x.id===u.id);const next=WVDATA().units[idx+1];
 const rec=wvEnsure()[u.id];const last=rec&&rec.journals&&rec.journals[rec.journals.length-1];
 const aiSec=(last&&last.ai)?wvAiPanel(u,last.ai):(wv.aiBusy?`<p class="wv-aibusy">🌈 ${st.lang==='ko'?'무지개 펜 선생님이 내 글을 읽고 있어요…':'The Rainbow Pen teacher is reading…'}</p>`:`<div class="tools center"><button class="btn violet" data-act="wv-ai">🌈 ${st.lang==='ko'?'무지개 펜 첨삭 받기 (AI 원어민 선생님)':'Get Rainbow Pen feedback'}</button></div>`);
 return `<div class="town lib-town">${wvHead(u)}<div class="lib-wrap"><section class="wv-panel wv-replywrap">
 <div class="wv-envelope open"><div class="wv-palrow"><span class="wv-palface big">${pal.e}</span><b>${esc(pal.name)}</b><small>${st.lang==='ko'?'답장이 도착했어요!':'You got a reply!'}</small></div>
 <p class="wv-letter">${esc(wv.reply||(last&&last.reply)||'')}</p>
 <div class="tools center"><button class="btn tiny" data-act="wv-reply-speak">🔊</button></div></div>
 ${aiSec}
 <div class="tools center"><button class="btn" data-act="wv-step" data-i="4">✍️ ${st.lang==='ko'?'고쳐서 다시 쓰기':'Revise & resend'}</button>${next?`<button class="btn primary" data-act="wv-open" data-unit="${next.id}">💌 ${st.lang==='ko'?'다음 편지 열기':'Next letter'}: ${next.emoji} ${esc(next.title)}</button>`:''}<button class="btn secondary" data-act="wv-hub">${st.lang==='ko'?'마을 광장으로':'Village'}</button></div>
 </section></div></div>`;
}
function writingScreen(){
 if(!wv)wv={view:'hub'};
 if(wv.view==='book')return wvBookScreen();
 if(wv.view!=='unit')return wvHubScreen();
 const u=wvUnit(wv.unitId);if(!u){wv={view:'hub'};return wvHubScreen();}
 return [wvLetterScreen,wvWordsScreen,wvModelScreen,wvTreeScreen,wvJournalScreen,wvReplyScreen][Math.max(0,Math.min(5,wv.step))](u);
}
function bindWritingInputs(){
 if(townView!=='writing'||!wv)return;
 const ta=app.querySelector('[data-wvjournal]');
 if(ta){ta.oninput=()=>{wv.journal=ta.value;const checks=wvChecks(wvUnit(wv.unitId),wv.journal);
  app.querySelectorAll('.wv-check').forEach((el,i)=>{if(checks[i])el.classList.toggle('ok',checks[i].ok);el.innerHTML=`${checks[i]&&checks[i].ok?'✅':'⬜'} ${esc(checks[i].ko)}`;});};}
 app.querySelectorAll('[data-wvfree]').forEach(inp=>{inp.oninput=()=>{wv.picks[inp.dataset.wvfree]=inp.value;};
  inp.onblur=()=>{render();};});
}
function wvSubmit(){
 const u=wvUnit(wv.unitId);if(!u)return;
 const text=(wv.journal||'').trim();
 if(text.length<10){toast(st.lang==='ko'?'조금만 더 써 볼까요? (10자 이상)':'Write a little more!');return;}
 const checks=wvChecks(u,text);
 if(checks.every(c=>c.ok)&&!wv.pruneAwarded){wv.pruneAwarded=true;awardPoints(5,st.lang==='ko'?'다듬기 완벽':'polished');}
 const W=wvEnsure();const rec=W[u.id]||(W[u.id]={});
 rec.journals=rec.journals||[];
 const reply=wvRuleReply(u,wv.picks);
 rec.journals.push({text,date:Date.now(),picks:{...wv.picks},reply});
 rec.done=true;rec.updatedAt=Date.now();
 wv.reply=reply;wv.step=5;
 awardPoints(20,st.lang==='ko'?'저널 완성':'journal');
 save();render();window.scrollTo({top:0});
}
function handleWriting(b){
 const act=b.dataset.act;const u=wv&&wv.unitId?wvUnit(wv.unitId):null;
 if(act==='wv-hub'){stopSpeak();wv={view:'hub'};render();window.scrollTo({top:0});return;}
 if(act==='wv-book'){stopSpeak();wv={view:'book'};render();window.scrollTo({top:0});return;}
 if(act==='wv-open'){openWvUnit(b.dataset.unit);return;}
 if(act==='wv-step'){wv.step=+b.dataset.i;stopSpeak();render();window.scrollTo({top:0});return;}
 if(act==='wv-mic'){if(wv.listening){try{_wvRec&&_wvRec.stop();}catch(e){}}else wvListenStart();return;}
 if(act==='wv-leaf-del'){wv.leaves.splice(+b.dataset.i,1);render();return;}
 if(act==='wv-leaf-use'){const l=wv.leaves[+b.dataset.i];if(l!=null){wv.picks[b.dataset.k]=l;render();}return;}
 if(act==='wv-letter-speak'){if(u)wvPlay(wvAudioUrl('letter',u.id),u.letter);return;}
 if(act==='wv-word-speak'){if(u){const i=+b.dataset.i;const w=u.words[i];if(w)wvPlay(wvAudioUrl('word',u.id,i),w[0]);}return;}
 if(act==='wv-word-save'){if(u){const w=u.words[+b.dataset.i];if(w)toggleSaveWord([w[0],w[1],w[1],w[1]],{type:'writing',bookId:u.id});render();}return;}
 if(act==='wv-model-speak'){if(u)wvPlay(wvAudioUrl('model',u.id),u.model.journal);return;}
 if(act==='wv-pick'){const k=b.dataset.k,v=b.dataset.v;const had=wv.picks[k];wv.picks[k]=v;render();
  if(u&&!had){const lines=wvAssemble(u,wv.picks);const line=lines.find(l=>l.toLowerCase().includes(String(v).toLowerCase().slice(0,10)));if(line&&!line.includes('___'))wvSpeak(line);}
  return;}
 if(act==='wv-preview-speak'){if(u)wvSpeak(wvAssemble(u,wv.picks,'').join(' '));return;}
 if(act==='wv-tree-done'){if(u){const rec=wvEnsure()[u.id];if(!wv.treeAwarded&&!(rec&&rec.done)){wv.treeAwarded=true;awardPoints(10,st.lang==='ko'?'나무 완성':'tree');}wv.step=4;render();window.scrollTo({top:0});}return;}
 if(act==='wv-journal-speak'){if((wv.journal||'').trim())wvSpeak(wv.journal);return;}
 if(act==='wv-submit'){wvSubmit();return;}
 if(act==='wv-reply-speak'){if(wv.reply)wvSpeak(wv.reply);return;}
 if(act==='wv-ai'){
  if(!u||wv.aiBusy)return;
  const rec=wvEnsure()[u.id];const last=rec&&rec.journals&&rec.journals[rec.journals.length-1];
  if(!last){toast(st.lang==='ko'?'저널을 먼저 보내요!':'Send a journal first!');return;}
  wv.aiBusy=true;render();
  fetch(WV_AI_URL,{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+WV_ANON,'apikey':WV_ANON},body:JSON.stringify({studentId:(currentStudent&&currentStudent.id)||'anon',palName:wvPal(u).name,unitTitle:u.title,question:u.letter,journal:last.text})})
  .then(r=>r.json().then(j=>({ok:r.ok,j})))
  .then(({ok,j})=>{wv.aiBusy=false;
   if(!ok||!j||j.error){
    const e=j&&String(j.error||'');
    const msg=e==='daily-limit'?(st.lang==='ko'?'오늘의 첨삭 횟수를 모두 썼어요. 내일 또 만나요!':'Daily limit reached — see you tomorrow!')
     :e.includes('GEMINI_API_KEY')?(st.lang==='ko'?'첨삭 기능이 아직 준비 중이에요. (관리자 설정 필요)':'Feedback is being set up.')
     :(st.lang==='ko'?'첨삭을 불러오지 못했어요. 잠시 후 다시 해봐요.':'Could not load feedback.');
    toast(msg);render();return;}
   last.ai=j;save();render();window.scrollTo({top:0});})
  .catch(()=>{wv.aiBusy=false;toast(st.lang==='ko'?'첨삭을 불러오지 못했어요. 인터넷을 확인해요.':'Network error.');render();});
  return;}
 if(act==='wv-ai-speak'){const rec=u&&wvEnsure()[u.id];const last=rec&&rec.journals&&rec.journals[rec.journals.length-1];if(last&&last.ai&&last.ai.replyLetter)wvSpeak(last.ai.replyLetter);return;}
 if(act==='wv-entry-speak'){const eu=wvUnit(b.dataset.unit);const j=eu&&(wvEnsure()[eu.id]||{}).journals?.[+b.dataset.j];if(j)wvSpeak(j.text);return;}
}
function libShelfScreen(){
 const cat=libCatalog();
 const groups=cat.series.map(s=>{
  const books=cat.books.filter(b=>b.seriesId===s.id).sort((a,b)=>a.order-b.order);
  const cards=books.map(b=>{
   const prog=libEnsure()&&profile.library[b.id];
   const meta=libBookMeta(b.id);const spreads=libSpreadCount(meta);
   const started=prog&&typeof prog.spread==='number'&&prog.spread>-1;
   const pct=started?Math.min(100,Math.round(((prog.spread+1)/spreads)*100)):0;
   return `<button class="lib-card" data-act="lib-open" data-book="${esc(b.id)}">
    <div class="lib-card-cover"><img class="lib-card-cover-img" src="${LIBRARY_IMG_BASE}/${esc(b.id)}/cover.jpg" alt="" style="display:none" onload="this.style.display='block';this.nextElementSibling.style.display='none'" onerror="this.remove()"><span class="lib-card-emoji">📗</span></div>
    <div class="lib-card-body"><b>${esc(b.title)}</b>
     <div class="lib-card-tags"><span class="lib-tag">AR ${esc(b.ar)}</span><span class="lib-tag">R/G ${esc(b.rg)}</span>${b.audio&&b.audio!=='none'?`<span class="lib-tag audio">🎧 ${libT('오디오북','Audiobook','有声书')}</span>`:''}${prog&&prog.quizBest!=null?`<span class="lib-tag quiz">📝 ${prog.quizBest}/${(b.quiz||[]).length||prog.quizTotal||0}</span>`:''}</div>
     ${started?`<div class="lib-progress"><span style="width:${pct}%"></span></div><small>${libT('이어 읽기','Continue reading','继续阅读')} · ${pct}%</small>`:`<small>${libT('새 책','New','新书')}</small>`}
    </div></button>`;
  }).join('');
  return `<section class="lib-series"><h2><span class="lib-series-dot" style="background:${s.color||'#2f8a5c'}"></span>${esc(s.name[st.lang]||s.name.en)}<small>${esc(s.author||'')}</small></h2><div class="lib-shelf">${cards}</div></section>`;
 }).join('');
 const head=`<div class="town-top"><div class="town-brand">📚 ${libT('도서관','Library','图书馆')}</div><div class="town-tools"><button class="btn tiny" data-act="lib-back">← ${libT('마을로','Town','小镇')}</button></div></div>`;
 return `<div class="town lib-town">${head}<div class="lib-wrap">${groups||`<p class="lib-empty">${libT('아직 등록된 책이 없어요.','No books yet.','还没有书。')}</p>`}</div></div>`;
}
function libStageHead(meta){
 const stage=lib.stage;
 const tabs=[];
 if(meta.background)tabs.push(['intro','📚',libT('배경지식','Background','背景知识')]);
 if(meta.vocab&&meta.vocab.length)tabs.push(['vocab','🔤',libT('어휘','Vocabulary','词汇')]);
 tabs.push(['read','📖',libT('읽기','Read','阅读')]);
 if(meta.sourceFile)tabs.push(['original','📄',libT('원본 보기','Original','原文')]);
 if(meta.quiz&&meta.quiz.length)tabs.push(['quiz','📝',libT('AR퀴즈','AR Quiz','AR测验')]);
 const tabHtml=tabs.map(([s,icon,label])=>`<button class="lib-tabbtn ${stage===s||(stage==='quizResult'&&s==='quiz')?'active':''}" data-act="lib-goto" data-stage="${s}">${icon} ${label}</button>`).join('');
 return `<div class="town-top lib-reader-top"><button class="btn tiny" data-act="lib-shelf">← ${libT('서가로','Shelf','书架')}</button><b class="lib-reader-title">${esc(meta.title)}</b><span class="lib-reader-tags"><span class="lib-tag">AR ${esc(meta.ar)}</span><span class="lib-tag">R/G ${esc(meta.rg)}</span></span></div><div class="lib-stage-tabs">${tabHtml}</div>`;
}
function libIntroScreen(){
 const meta=libBookMeta(lib.bookId);if(!meta)return libShelfScreen();
 const head=libStageHead(meta);
 const bg=meta.background?(meta.background[st.lang]||meta.background.en):'';
 const nextLbl=(meta.vocab&&meta.vocab.length)?libT('다음: 어휘 학습 →','Next: Vocabulary →','下一步：学习词汇 →'):libT('책 읽기 시작 →','Start Reading →','开始阅读 →');
 return `<div class="town lib-town">${head}<div class="lib-wrap"><section class="lib-intro"><h2>📚 ${libT('배경 지식','Background Knowledge','背景知识')}</h2><p class="lib-intro-text">${esc(bg)}</p><div class="tools center"><button class="btn primary" data-act="lib-intro-next">${nextLbl}</button></div></section></div></div>`;
}
function libVocabMeaning(w){return st.lang==='ko'?w[2]:st.lang==='zh'?w[3]:w[1];}
function libVocabScreenBook(){
 const meta=libBookMeta(lib.bookId);if(!meta)return libShelfScreen();
 const head=libStageHead(meta);
 const words=meta.vocab||[];
 const savedLbl=st.lang==='ko'?'나만의 단어':st.lang==='zh'?'我的单词':'My Words';
 const cards=words.map((w,i)=>`<article class="word-card ${st.lang==='ko'?'ko':''}"><strong>${esc(w[0])}</strong><p class="meaning">${esc(libVocabMeaning(w))}</p><div class="word-actions"><button class="btn tiny" data-act="lib-word-speak" data-i="${i}">🔊</button><button class="btn tiny star ${isSaved(w[0])?'on':''}" data-act="lib-word-save" data-i="${i}" title="${savedLbl}">${isSaved(w[0])?'★':'☆'}</button></div></article>`).join('');
 return `<div class="town lib-town">${head}<div class="lib-wrap"><section class="lib-vocab"><h2>🔤 ${libT('중요 어휘','Key Vocabulary','重点词汇')}</h2><div class="word-grid">${cards}</div><div class="tools center"><button class="btn primary" data-act="lib-vocab-next">${libT('책 읽기 시작 →','Start Reading →','开始阅读 →')}</button></div></section></div></div>`;
}
function libQuizScreenBook(){
 const meta=libBookMeta(lib.bookId);if(!meta)return libShelfScreen();
 const head=libStageHead(meta);
 const quiz=meta.quiz||[];
 if(!quiz.length)return `<div class="town lib-town">${head}<div class="lib-wrap"><p class="lib-empty">${libT('퀴즈가 없어요.','No quiz yet.','暂无测验。')}</p></div></div>`;
 if(lib.stage==='quizResult'){
  const total=quiz.length;const correct=lib.quizAnswers.filter((a,i)=>a===quiz[i][2]).length;
  const passed=correct>=Math.ceil(total*0.6);
  return `<div class="town lib-town">${head}<div class="lib-wrap"><section class="lib-quiz-result"><div class="score-orb">${correct}/${total}</div><h2>${passed?libT('통과했어요! 🏆','You passed! 🏆','通过了！🏆'):libT('한 번 더 도전해요 💪','Try again 💪','再试一次 💪')}</h2><div class="tools center"><button class="btn primary" data-act="lib-quiz-restart">${libT('다시 풀기','Retake Quiz','重新测验')}</button><button class="btn" data-act="lib-goto" data-stage="read">${libT('책으로 돌아가기','Back to Book','返回书本')}</button></div></section></div></div>`;
 }
 const idx=lib.quizIndex;const q=quiz[idx];const picked=lib.quizAnswers[idx];
 const locked=picked!=null;
 const choices=q[1].map((c,i)=>{const letter=letters[i];let cls='choice';if(locked&&letter===q[2])cls+=' correct';if(locked&&letter===picked&&picked!==q[2])cls+=' wrong';return `<button class="${cls}" data-act="lib-quiz-answer" data-letter="${letter}" ${locked?'disabled':''}><b>${letter}.</b> ${esc(c)}</button>`;}).join('');
 const fb=locked?`<div class="learn-feedback ${picked===q[2]?'good':'reveal'}"><b>${picked===q[2]?libT('정답!','Correct!','答对了！'):libT('정답: ','Answer: ','答案：')+q[2]}</b><br>${esc(q[3])}</div>`:'';
 const nextBtn=locked?`<button class="btn primary" data-act="lib-quiz-next">${idx<quiz.length-1?libT('다음 →','Next →','下一题 →'):libT('결과 보기','See Results','查看结果')}</button>`:'';
 return `<div class="town lib-town">${head}<div class="lib-wrap"><section class="lib-quiz"><div class="qtop"><div class="section-tag"><i>📝</i> ${libT('AR 퀴즈','AR Quiz','AR测验')}</div><span class="badge">${idx+1}/${quiz.length}</span></div><article class="qcard"><div class="prompt">${esc(q[0])}</div><div class="choices">${choices}</div>${fb}</article><div class="tools center">${nextBtn}</div></section></div></div>`;
}
function libReaderScreen(){
 const meta=libBookMeta(lib.bookId);if(!meta)return libShelfScreen();
 const head=libStageHead(meta);
 if(lib.loading)return `<div class="town lib-town">${head}<div class="lib-wrap"><p class="lib-empty">${libT('불러오는 중…','Loading…','加载中…')}</p></div></div>`;
 if(lib.loadError&&lib.spread>-1)return `<div class="town lib-town">${head}<div class="lib-wrap"><div class="lib-load-error"><p>${libT('책 내용을 불러오지 못했어요. 인터넷 연결을 확인해 주세요.','Could not load this book. Please check your internet connection.','未能加载书籍内容，请检查网络连接。')}</p><button class="btn primary" data-act="lib-retry">${libT('다시 시도','Retry','重试')}</button></div></div></div>`;
 const pages=lib.pages||[];const spreads=libSpreadCount(meta);
 let stage;
 if(lib.spread===-1){
  stage=`<div class="lib-book lib-cover"><div class="lib-cover-face"><img class="lib-cover-img" src="${LIBRARY_IMG_BASE}/${lib.bookId}/cover.jpg" alt="" style="display:none" onload="this.style.display='block';this.nextElementSibling.style.display='none'" onerror="this.remove()"><div class="lib-cover-emoji">📕</div><h1>${esc(meta.title)}</h1><p>${esc((libSeriesMeta(meta.seriesId)||{}).author||'')}</p><p class="lib-cover-illus">${meta.illustrator?libT('원작 삽화가 ','Original illustrator: ','原著插画 ')+esc(meta.illustrator)+libT(' · 화면 삽화는 재구성작',' · art shown here is newly recreated','，本页插图为重新创作'):''}</p></div></div>`;
 } else {
  const li=lib.spread*2,ri=li+1;
  const leftPg=pages[li],rightPg=pages[ri];
  const pageHtml=(pg,idx)=>pg?`<div class="lib-page"><div class="lib-page-num">${idx+1}</div>${libPageBody(pg,idx)}<button class="btn tiny lib-listen" data-act="lib-listen" data-page="${idx}">🔊 ${libT('듣기','Listen','听')}</button></div>`:`<div class="lib-page lib-page-blank"></div>`;
  stage=`<div class="lib-book ${lib.flip==='next'?'flip-next':lib.flip==='prev'?'flip-prev':''}">${pageHtml(leftPg,li)}<div class="lib-gutter"></div>${pageHtml(rightPg,ri)}</div>`;
 }
 const nav=`<div class="lib-nav"><button class="btn" data-act="lib-prev" ${lib.spread<=-1?'disabled':''}>← ${libT('이전','Prev','上一页')}</button><span class="lib-pageof">${lib.spread===-1?libT('표지','Cover','封面'):`${(lib.spread*2+1)}–${Math.min((lib.spread*2+2),meta.totalPages)} / ${meta.totalPages}`}</span><button class="btn primary" data-act="lib-next" ${lib.spread>=spreads-1?'disabled':''}>${libT('다음','Next','下一页')} →</button></div>`;
 const hint=`<p class="lib-hint">${libT('저장은 자동으로 돼요 · 인쇄는 지원하지 않아요','Progress saves automatically · Printing is not available','自动保存进度 · 不支持打印')}</p>`;
 return `<div class="town lib-town">${head}<div class="lib-wrap"><div class="lib-reader">${stage}</div>${nav}${hint}</div></div>`;
}
function libraryScreen(){
 if(!lib||lib.view!=='book')return libShelfScreen();
 if(lib.stage==='intro')return libIntroScreen();
 if(lib.stage==='vocab')return libVocabScreenBook();
 if(lib.stage==='quiz'||lib.stage==='quizResult')return libQuizScreenBook();
 if(lib.stage==='original')return libPdfScreen();
 return libReaderScreen();
}
function bindLibraryAudio(){
 app.querySelectorAll('[data-act="lib-listen"]').forEach(b=>{b.onclick=()=>{const idx=+b.dataset.page;const pg=(lib.pages||[])[idx];if(!pg)return;const text=(pg.paragraphs||[]).join(' ');libSpeakPage(idx,text);};});
}
function handleLibrary(b){const act=b.dataset.act;
 if(act==='lib-back'){lib=null;stopSpeak();atTown=true;townView=landingView();render();window.scrollTo({top:0});return;}
 if(act==='lib-shelf'){stopSpeak();lib={view:'shelf'};render();window.scrollTo({top:0});return;}
 if(act==='lib-open'){openLibraryBook(b.dataset.book);return;}
 if(act==='lib-prev'){libGoSpread(-1);return;}
 if(act==='lib-next'){libGoSpread(1);return;}
 if(act==='lib-pdf-prev'){stopSpeak();lib.pdfPageIndex=Math.max(0,(lib.pdfPageIndex||0)-1);render();window.scrollTo({top:0});return;}
 if(act==='lib-pdf-next'){stopSpeak();const total=(lib.pages||[]).length;lib.pdfPageIndex=Math.min(total-1,(lib.pdfPageIndex||0)+1);render();window.scrollTo({top:0});return;}
 if(act==='lib-pdf-listen'){const idx=lib.pdfPageIndex||0;const pg=(lib.pages||[])[idx];if(pg)libSpeakPage(idx,(pg.paragraphs||[]).join(' '));return;}
 if(act==='lib-intro-next'){const meta=libBookMeta(lib.bookId);libSaveProgress({introSeen:true});lib.stage=(meta&&meta.vocab&&meta.vocab.length)?'vocab':'read';stopSpeak();render();window.scrollTo({top:0});return;}
 if(act==='lib-vocab-next'){lib.stage='read';stopSpeak();render();window.scrollTo({top:0});return;}
 if(act==='lib-word-speak'){const meta=libBookMeta(lib.bookId);const w=(meta&&meta.vocab||[])[+b.dataset.i];if(w)speakText(w[0]);return;}
 if(act==='lib-word-save'){const meta=libBookMeta(lib.bookId);const w=(meta&&meta.vocab||[])[+b.dataset.i];if(w)toggleSaveWord(w,{type:'ebook',bookId:lib.bookId});render();return;}
 if(act==='lib-goto'){const meta=libBookMeta(lib.bookId);let stage=b.dataset.stage;if(stage==='quiz'&&meta){const total=(meta.quiz||[]).length;if(total>0&&lib.quizAnswers.length===total)stage='quizResult';}lib.stage=stage;stopSpeak();render();window.scrollTo({top:0});return;}
 if(act==='lib-quiz-answer'){const meta=libBookMeta(lib.bookId);const q=(meta&&meta.quiz||[])[lib.quizIndex];if(!q||lib.quizAnswers[lib.quizIndex]!=null)return;lib.quizAnswers[lib.quizIndex]=b.dataset.letter;render();return;}
 if(act==='lib-quiz-next'){const meta=libBookMeta(lib.bookId);const quiz=(meta&&meta.quiz)||[];const total=quiz.length;
  if(lib.quizIndex<total-1){lib.quizIndex++;render();window.scrollTo({top:0});return;}
  const correct=lib.quizAnswers.filter((a,i)=>a===quiz[i][2]).length;
  const prog=libProgress(lib.bookId);const passMark=Math.ceil(total*0.6);const best=Math.max(correct,(prog&&prog.quizBest)||0);
  const firstClear=!(prog&&prog.quizBest>=passMark)&&correct>=passMark;
  libSaveProgress({quizScore:correct,quizTotal:total,quizBest:best});
  if(firstClear)awardPoints(correct*5,libT('AR퀴즈 통과','AR Quiz passed','AR测验通过'));
  lib.stage='quizResult';render();window.scrollTo({top:0});return;}
 if(act==='lib-quiz-restart'){lib.quizIndex=0;lib.quizAnswers=[];lib.stage='quiz';render();window.scrollTo({top:0});return;}
 if(act==='lib-retry'){lib.loading=true;lib.loadError=false;render();libFetchPages(lib.bookId);return;}
}
const reviewQuestions=()=>(st.original?.missed||[]).map(i=>L.originalQuestions[i]).filter(Boolean);
const qs=(mode)=>mode==='original'?L.originalQuestions:mode==='originalExtra'?L.originalExtraQuestions:mode==='review'?reviewQuestions():L.extraQuestions;
const isLearningMode=(mode)=>mode==='originalExtra'||mode==='similar'||mode==='review';
function learningHint(q){const s=String(q[0]||'').toLowerCase(); if(s.includes('main idea')) return 'Think about the whole passage, not just one small detail.'; if(s.includes('sequence')) return 'Look for what happened first, next, and last.'; if(s.includes('cause')) return 'Ask: what happened, and why did it happen?'; if(s.includes('compare')) return 'Look for one way the two things are alike or different.'; if(s.includes('prediction')) return 'Use a clue from the passage to think about what may happen next.'; if(s.includes('word meaning')) return 'Read the words around it. What does the word mean here?'; if(s.includes('inference')) return 'The answer may not be written exactly. Use clues from the passage.'; if(s.includes('fact')) return 'Ask: can this be proved, or is it what someone thinks?'; if(s.includes('purpose')) return 'Think about why the writer told this story.'; if(s.includes('figurative')) return 'This expression may mean something different from the exact words.'; return 'Look back at the passage and find the best clue.';}
function learningFeedback(mode,idx,q){if(!isLearningMode(mode))return '';const f=st.feedback?.[mode]?.[idx]; if(!f)return ''; if(f.type==='correct')return `<div class="learn-feedback good"><b>Great!</b> You found the best answer. <span>Moving on…</span></div>`; if(f.type==='hint')return `<div class="learn-feedback hint"><b>Not yet.</b> ${esc(f.text)}<div><button class="btn tiny" data-act="show-answer" data-mode="${mode}">Show Answer</button></div></div>`; return `<div class="learn-feedback reveal"><b>Answer: ${esc(q[3])}</b><br>${esc(q[4]||'')}</div>`;}
function setView(view){stopSpeak();st.view=view; if(view==='questions')st.qMode='original'; if(view==='originalExtra')st.qMode='originalExtra'; if(view==='similar')st.qMode='similar';save();render();window.scrollTo({top:0,behavior:'smooth'});}
function status(mode){const total=qs(mode).length||12,a=st.answers[mode]||{},answered=Object.keys(a).length,skipped=Object.keys(st.skipped?.[mode]||{}).filter(i=>!a[i]).length;return {answered,skipped,remaining:Math.max(0,total-answered)};}
function nav(){const n=lessonNum(currentLessonId);const wc=(L.words||[]).length;const items=[['home','⌂','home','Lesson '+n],['words','▣','words',wc+' words'],['originalRead','📖','read','Book'],['questions','✎','questions','12'],['originalExtra','＋','originalExtra','12'],['similar','↻','similar','12'],['report','▥','report','Results']];const townLabel=st.lang==='ko'?'마을로':st.lang==='zh'?'返回小镇':'Reading Town';return `<aside class="side"><div class="logo">CARS<small>G-FIELD ONLINE READING</small></div><button class="town-btn" data-act="go-town"><span class="nav-icon">🏘</span><b>${townLabel}</b></button><div class="profile"><b>${currentBookLabel()} · Lesson ${n}</b><span>${esc(L.title||'')}</span></div><div class="menu">${items.map(([view,icon,label,small])=>`<button class="nav-btn ${st.view===view?'active':''}" data-view="${view}"><span class="nav-icon">${icon}</span><span><b>${t(label)}</b><small>${small}</small></span></button>`).join('')}</div><div class="side-bottom"><b>💡 ${t('learnFirst')}</b><br>${st.lang==='ko'?'문제를 풀기 전에 단어를 먼저 익혀요.':st.lang==='en'?'Learn words before solving reading questions.':'先学习单词，再完成阅读练习。'}</div></aside>`}
function top(){const o=st.original?`${st.original.score}/12`:'—';return `<div class="topbar"><div class="crumb">CARS Online Learning　›　${currentBookLabel()}　›　<b>Lesson ${lessonNum(currentLessonId)}</b></div><div class="status"><span class="progress-pill points-pill">★ ${(profile&&profile.points)||0}P</span><span class="progress-pill">${t('words')} ${Object.keys(st.known).length}/12</span><span class="progress-pill">${t('original')} ${o}</span><div class="top-language language-toggle" role="group" aria-label="Language"><button data-lang="ko" class="${st.lang==='ko'?'active':''}">한국어</button><button data-lang="en" class="${st.lang==='en'?'active':''}">English</button><button data-lang="zh" class="${st.lang==='zh'?'active':''}">中文</button></div></div></div>`}
function stepDone(view){const wc=(L.words||[]).length;switch(view){case 'words':return wc>0&&Object.keys(st.known).filter(k=>st.known[k]).length>=wc;case 'originalRead':return !!st.original;case 'questions':return !!st.original;case 'originalExtra':return !!st.originalExtra;case 'similar':return !!st.similar;case 'report':return !!st.original&&!!st.originalExtra&&!!st.similar;default:return false;}}
function flow(){const items=[['words','1',t('words')],['originalRead','2',t('read')],['questions','3',t('questions')],['originalExtra','4',t('originalExtra')],['similar','5',t('similar')],['report','6',t('report')]];return `<div class="flow">${items.map((x,i)=>{const done=stepDone(x[0]),active=st.view===x[0];return `${i?'<span class="arrow">→</span>':''}<button class="flow-step ${active?'active':''} ${done?'done':''}" data-view="${x[0]}"><small>STEP ${x[1]}${done?' <span class="flow-check">✓</span>':''}</small><b>${x[2]}</b></button>`;}).join('')}</div>`}
function art(){return `<div class="art-stack"><div class="original-figure"><img class="bw-art" src="${esc(L.image||'assets/images/cars-level-b/lesson-01-my-backyard-zoo.png')}" alt="${esc(L.title||'Lesson illustration')}"></div></div>`}
function listenButtons(passage='original'){const echoLbl=st.lang==='ko'?'따라 읽기':st.lang==='zh'?'跟读':'Read with Me';return `<div class="listen sentence-controls"><button class="btn primary" data-act="listen-all" data-passage="${passage}">▶ ${t('listenSentence')}</button><button class="btn echo-btn" data-act="echo-read" data-passage="${passage}">🎤 ${echoLbl}</button><label class="speed">${t('speed')} <select data-act="speed"><option value="0.6" ${Number(st.speed)===0.6?'selected':''}>0.6×</option><option value="0.8" ${Number(st.speed)===0.8?'selected':''}>0.8×</option><option value="1" ${Number(st.speed)===1?'selected':''}>1.0×</option><option value="1.15" ${Number(st.speed)===1.15?'selected':''}>1.15×</option><option value="1.3" ${Number(st.speed)===1.3?'selected':''}>1.3×</option></select></label><button class="btn" data-act="stop">■ ${t('stopAudio')}</button><span class="sentence-tip">${t('sentenceTip')}</span></div>`}
function splitSentences(text){let s=String(text).replace(/\n/g,' ').replace(/[\w.+\-]+@[\w.\-]+/g,function(m){return m.replace(/\./g,'\x02');}).replace(/(\d)[.](\d)/g,'$1\x02$2').replace(/\b(Mr|Mrs|Ms|Dr|Prof|Jr|Sr|St|vs|etc)\./gi,'$1\x02').replace(/\b([A-Z]\.){2,}/g,function(m){return m.replace(/\./g,'\x02');});return(s.match(/[^.!?]+[.!?]+(?:[“'”']+)?|[^.!?]+$/g)||[String(text)]).map(v=>v.trim().replace(/\x02/g,'.')).filter(Boolean)}
// Render each passage paragraph as sentence spans. A paragraph may itself contain
// hard line breaks (\n) — email/letter/diary formats keep To:/From:/Subject:, an
// address block, or a date on their own lines. splitSentences() flattens \n to spaces
// for clean sentence detection, so split on \n FIRST and rejoin the lines with <br>,
// otherwise the header collapses into one run-on line that reads like raw OCR.
function sentencePassage(paragraphs, passage){let offset=0;return paragraphs.map((p)=>{
 const inner=String(p).split('\n').map(line=>{
  if(!line.trim())return '';
  return splitSentences(line).map(sentence=>{const start=offset;const end=start+sentence.length;offset=end+1;return `<span class="sentence-line" data-passage="${passage}" data-start="${start}" data-end="${end}">${esc(sentence)} </span>`}).join('');
 }).join('<br>');
 offset+=1;return `<p class="sentence-paragraph">${inner}</p>`}).join('')}
function home(){return `<div class="work-grid"><section class="card reading-card"><div class="headrow"><div><div class="section-tag"><i>❧</i> Lesson ${lessonNum(currentLessonId)}</div><h1 class="title">${esc(L.title||t('title'))}</h1><p class="sub">${st.lang==='ko'?'단어를 먼저 익히고, 교재 지문을 들은 뒤 한 문제씩 풀어 보세요.':st.lang==='en'?'Learn the words, listen to the story, and solve one question at a time.':'先学单词，再听课文，一次完成一道题。'}</p></div><button class="btn primary" data-view="words">${t('start')} →</button></div><div class="story">${art()}<div class="passage"><p><b>${esc(L.title||'')}</b>${L.theme?` · ${esc(L.theme)}`:''}</p><p>${st.lang==='ko'?`${(L.words||[]).length}개 핵심 단어를 먼저 배우고, 교재 지문을 들은 뒤 한 문제씩 천천히 풀어 보세요.`:st.lang==='en'?`Learn ${(L.words||[]).length} focus words, listen to the story, and solve questions one at a time.`:`先学习 ${(L.words||[]).length} 个重点单词，再听课文，一次完成一道题。`}</p></div></div></section></div><section class="card learning"><h2>${t('learnFirst')} <span style="color:#2f8a5c;font-size:15px">(${(L.words||[]).length})</span></h2><div class="action-grid"><button class="action purple" data-wordmode="cards"><span class="action-step">STEP 1</span><h3>${t('cards')}</h3><p>${st.lang==='ko'?'뜻과 한국어를 확인해요.':'Meanings and Korean support.'}</p><span class="go">${t('start')}</span></button><button class="action yellow" data-wordmode="memory"><span class="action-step">STEP 1</span><h3>${t('memory')}</h3><p>${st.lang==='ko'?'카드를 뒤집어 외워요.':'Flip and remember.'}</p><span class="go">${t('start')}</span></button><button class="action blue" data-wordmode="game"><span class="action-step">STEP 1</span><h3>${t('game')}</h3><p>${st.lang==='ko'?'뜻 맞히기로 복습해요.':'Match the meaning.'}</p><span class="go">${t('start')}</span></button><button class="action pink" data-view="originalRead"><span class="action-step">STEP 2</span><h3>${t('read')}</h3><p>${st.lang==='ko'?'그림과 음성으로 읽어요.':'Read with pictures and audio.'}</p><span class="go">${t('read')}</span></button></div></section>`}
function words(){let body='';const wc=(L.words||[]).length;const myWordsLbl=st.lang==='ko'?'나만의 단어':st.lang==='zh'?'我的单词':'My Words';
 if(st.wordMode==='cards'){body=`<div class="word-grid">${L.words.map((w,i)=>`<article class="word-card ${st.known[w[0]]?'known':''} ${st.lang==='ko'?'ko':''}"><strong>${esc(w[0])}</strong><p class="meaning">${esc(wordMeaning(w))}</p>${wordDetail(w)?`<p class="word-detail">${esc(wordDetail(w))}</p>`:''}<div class="word-actions"><button class="btn tiny" data-act="word-speak" data-i="${i}">🔊</button><button class="btn tiny star ${isSaved(w[0])?'on':''}" data-act="save-word" data-i="${i}" title="${myWordsLbl}">${isSaved(w[0])?'★':'☆'}</button><button class="btn tiny ${st.known[w[0]]?'known':''}" data-act="known" data-i="${i}">${st.known[w[0]]?t('knownDone'):t('known')}</button></div></article>`).join('')}</div>`}
 else if(st.wordMode==='memory'){const w=L.words[st.wordIndex];const back=`${esc(wordMeaning(w))}${wordDetail(w)?`<br><small>${esc(wordDetail(w))}</small>`:''}`;body=`<div class="memory-stage"><p class="sub">${st.wordIndex+1} / ${wc}</p><button class="flip" data-act="flip"><div class="${st.flipped?'back':'front'}">${st.flipped?back:esc(w[0])}</div></button><div class="tools center"><button class="btn" data-act="mem-prev">${t('previous')}</button><button class="btn primary" data-act="flip">${t('flip')}</button><button class="btn" data-act="mem-next">${t('next')}</button></div></div>`}
 else if(st.wordMode==='myWords'){const list=myWordsList();body=list.length?`<div class="mywords-grid">${list.map((w,i)=>`<article class="word-card saved ${st.lang==='ko'?'ko':''}"><strong>${esc(w.en)}</strong><p class="meaning">${esc(st.lang==='ko'?(w.ko||w.def):st.lang==='zh'?(w.zh||w.def):w.def)}</p><p class="word-detail">${myWordSourceLabel(w)}</p><div class="word-actions"><button class="btn tiny" data-act="myword-speak" data-i="${i}">🔊</button><button class="btn tiny star on" data-act="myword-remove" data-i="${i}">★ ${st.lang==='ko'?'빼기':st.lang==='zh'?'移除':'Remove'}</button></div></article>`).join('')}</div>`:`<div class="mywords-empty"><div class="mw-star">⭐</div><h3>${st.lang==='ko'?'아직 저장한 단어가 없어요':st.lang==='zh'?'还没有保存的单词':'No saved words yet'}</h3><p>${st.lang==='ko'?'단어 카드나 게임에서 ☆를 눌러 나만의 단어를 모아요.':st.lang==='zh'?'在单词卡或游戏中点 ☆ 收藏你的单词。':'Tap ☆ on a word card or in the game to collect your words.'}</p></div>`}
 else{const w=L.words[st.gameIndex];if(!st.gameChoices.length&&!st.gameDone)st.gameChoices=makeGameChoices();
  if(st.gameDone){body=`<div class="game-stage"><div class="score-orb">${st.gameScore}/${wc}</div><h3>${st.lang==='ko'?'단어 게임을 마쳤어요!':st.lang==='en'?'Word game finished!':'单词游戏完成！'}</h3><div class="tools center"><button class="btn primary" data-act="restart-game">${st.lang==='ko'?'다시 하기':st.lang==='zh'?'再玩一次':'Play Again'}</button><button class="btn violet" data-view="originalRead">${t('read')} →</button></div></div>`;}
  else{const correct=w[1];const locked=st.gameStatus==='correct'||st.gameStatus==='reveal';const hint=st.lang==='ko'?(w[2]||w[1]):st.lang==='zh'?((L._zh&&L._zh[w[0]])||w[1]):(w[2]||w[1]);
   const choicesHtml=st.gameChoices.map(x=>{let cls='choice';if(locked&&x===correct)cls+=' correct';if(x===st.gameWrongPick&&x!==correct)cls+=' wrong';return `<button class="${cls}" data-game="${esc(x)}" ${locked?'disabled':''}>${esc(x)}</button>`;}).join('');
   let fb='';if(st.gameStatus==='correct')fb=`<div class="game-feedback good"><b>🎉 ${st.lang==='ko'?'정답!':st.lang==='zh'?'答对了！':'Correct!'}</b> ${st.lang==='ko'?'잘했어요.':st.lang==='zh'?'做得好。':'Well done.'}</div>`;
   else if(st.gameStatus==='hint')fb=`<div class="game-feedback hint"><b>${st.lang==='ko'?'다시 골라볼까요?':st.lang==='zh'?'再选一次好吗？':'Try again?'}</b> ${st.lang==='ko'?'힌트':st.lang==='zh'?'提示':'Hint'}: <em>${esc(hint)}</em> <button class="btn tiny" data-act="game-show-answer">${st.lang==='ko'?'정답 보기':st.lang==='zh'?'看答案':'Show Answer'}</button></div>`;
   else if(st.gameStatus==='reveal')fb=`<div class="game-feedback reveal"><b>${st.lang==='ko'?'정답':st.lang==='zh'?'答案':'Answer'}: ${esc(correct)}</b><br>${esc(hint)}</div>`;
   const hintOpen=(st.gameHintOpen&&st.gameStatus!=='reveal'&&st.gameStatus!=='correct')?`<div class="game-hint-open">💡 ${esc(hint)}</div>`:'';
   const nextBtn=st.gameStatus==='reveal'?`<div class="tools center"><button class="btn primary" data-act="game-next">${t('next')}</button></div>`:'';
   body=`<div class="game-stage"><p class="sub">${st.gameIndex+1} / ${wc}</p><div class="flip static"><div class="front">${esc(w[0])}</div></div><p>${st.lang==='ko'?'알맞은 뜻을 골라 보세요.':st.lang==='zh'?'请选择正确的意思。':'Choose the best meaning.'}</p><div class="game-tools"><button class="btn tiny ${st.gameHintOpen?'on':''}" data-act="game-hint">💡 ${st.lang==='ko'?'힌트':st.lang==='zh'?'提示':'Hint'}</button><button class="btn tiny star ${isSaved(w[0])?'on':''}" data-act="save-word-game">${isSaved(w[0])?'★ '+(st.lang==='ko'?'저장됨':st.lang==='zh'?'已保存':'Saved'):'☆ '+myWordsLbl}</button></div>${hintOpen}<div class="game-choice">${choicesHtml}</div>${fb}${nextBtn}</div>`;}}
return `<section class="card panel"><div class="panel-head"><div><div class="section-tag"><i>▣</i> ${t('stepWords')}</div><h2>${st.wordMode==='cards'?t('cards'):st.wordMode==='memory'?t('memory'):st.wordMode==='myWords'?myWordsLbl:t('game')}</h2></div><div class="segmented"><button data-wordmode="cards" class="${st.wordMode==='cards'?'active':''}">${t('cards')}</button><button data-wordmode="memory" class="${st.wordMode==='memory'?'active':''}">${t('memory')}</button><button data-wordmode="game" class="${st.wordMode==='game'?'active':''}">${t('game')}</button><button data-wordmode="myWords" class="${st.wordMode==='myWords'?'active':''}">★ ${myWordsLbl}${myWordsList().length?` (${myWordsList().length})`:''}</button></div></div>${body}</section>`}
function passageBlock(paragraphs, passage, withArt=false){const hidden=!!st.passageHidden?.[passage];const passageHtml=`<div class="passage original-passage" id="${passage}-passage">${sentencePassage(paragraphs,passage)}</div>`;return `<div class="passage-wrap ${hidden?'is-hidden':''}" id="passage-wrap-${passage}"><div class="passage-tools"><button class="btn small" data-act="toggle-passage" data-passage="${passage}">${hidden?t('showPassage'):t('hidePassage')}</button></div>${hidden?`<div class="passage-hidden-note">${t('showPassage')}</div>`:(withArt?`<div class="story">${art()}${passageHtml}</div>`:`<div class="single-passage">${passageHtml}</div>`)}</div>`}
function originalRead(){const text=passageBlock(L.originalPassage,'original',true);return `<div class="work-grid"><section class="card reading-card"><div class="headrow"><div><div class="section-tag"><i>▤</i> ${t('stepRead')}</div><h1 class="title">${esc(L.title||t('title'))}</h1><p class="sub">${t('originalSubtitle')}</p></div><div class="header-actions">${listenButtons('original')}<button class="btn print-btn" data-act="print-study" data-passage="original">🖨 ${t('printStudy')}</button></div></div>${text}<div class="tools"><button class="btn violet" data-act="open-original-questions">${t('startQuestions')}</button></div>${st.questionOpen?`<section class="question-drawer" id="question-drawer">${questionCard('original',true)}</section>`:''}</section></div>`}
function questionCard(mode,inline=false){
 const list=qs(mode),total=list.length||12,idx=st.qIndex[mode]||0,q=list[idx],answer=st.answers[mode][idx],s=status(mode),isLearn=isLearningMode(mode),isReview=mode==='review';
 const feedback=learningFeedback(mode,idx,q);
 const locked=!!(st.feedback?.[mode]?.[idx]?.type==='reveal');
 const tag=mode==='original'?t('stepQuestions'):mode==='originalExtra'?t('stepOriginalExtra'):mode==='review'?t('wrongReview'):t('stepExtra');
 const head=mode==='original'?t('questions'):mode==='originalExtra'?t('originalExtra'):mode==='review'?t('wrongReview'):t('similar');
 const lastBtn=isReview?`<button class="btn good" data-act="finish-review">${t('finishReview')}</button>`:`<button class="btn good" data-act="attempt-grade" data-mode="${mode}">${t('check')}</button>`;
 return `<div class="qtop" id="question-anchor"><div><div class="section-tag"><i>✎</i> ${tag}</div><h2>${head}</h2></div><span class="badge">${idx+1}/${total}</span></div><div class="question-status"><span class="ok-dot">${t('done')} ${s.answered}</span><span class="skip-dot">${t('skipped')} ${s.skipped}</span></div><div class="bar"><b style="width:${((idx+1)/total)*100}%"></b></div><article class="qcard"><div class="strategy">${esc(q[0])}</div><div class="prompt">${esc(q[1])}</div><div class="choices">${q[2].map((x,i)=>`<button class="choice ${answer===letters[i]?'selected':''}" data-answer="${letters[i]}" ${locked?'disabled':''}><b>${letters[i]}.</b> ${esc(x)}</button>`).join('')}</div>${feedback}</article><div class="qnav"><button class="btn" data-act="q-prev" data-mode="${mode}" ${idx===0?'disabled':''}>${t('previous')}</button><span class="sub">${isLearn?'Choose an answer. Wrong answers get a hint first.':(inline?t('originalHint'):t('selectAnswer'))}</span><button class="btn secondary" data-act="q-skip" data-mode="${mode}">${t('skip')}</button>${idx===total-1?lastBtn:`<button class="btn primary" data-act="q-next" data-mode="${mode}">${t('next')}</button>`}</div><div class="number-strip">${Array.from({length:total},(_,i)=>`<button class="num ${i===idx?'current':''} ${st.answers[mode][i]?'answered':(st.skipped?.[mode]?.[i]?'skipped':'empty')}" data-act="go-q" data-mode="${mode}" data-i="${i}">${i+1}</button>`).join('')}</div><div id="grade-result"></div>`}
function questionScreen(mode){
 const isReview=mode==='review';
 if(isReview&&st.reviewComplete)return reviewSummaryScreen();
 const isOriginal=mode==='original';
 const isExtra=mode==='originalExtra';
 const passage=(isOriginal||isReview)?L.originalPassage:(isExtra?(L.originalExtraPassage||L.originalPassage):L.extraPassage);
 const pid=(isOriginal||isReview)?'original':(isExtra?'originalExtra':'similar');
 const title=isReview?t('wrongReview'):(isOriginal?t('questions'):(isExtra?t('originalExtra'):t('similar')));
 const subtitle=isReview?(st.lang==='ko'?'틀린 문제만 다시 풀어요. 힌트를 보고 스스로 고쳐 봐요.':st.lang==='zh'?'只重做错题，看提示自己改正。':'Re-solve only the ones you missed. Use the hint and fix them.'):(isOriginal?t('originalSubtitle'):(isExtra?t('originalExtraSubtitle'):t('extraSubtitle')));
 const canPrint=!isReview;
 const audioPassage=(isOriginal||isReview)?'original':(isExtra?'originalExtra':'extra');
 const printPassage=(isOriginal||isReview)?'original':(isExtra?'originalExtra':'similar');
 const icon=isReview?'🔁':(isOriginal?'✎':isExtra?'＋':'↻');
 const h1=isReview?esc(L.title||t('title')):(isOriginal?esc(L.title||t('title')):(isExtra?esc(L.originalExtraTitle||t('title')):esc(L.extraTitle||'New Passage')));
 return `<div class="work-grid"><section class="card reading-card question-study"><div class="headrow"><div><div class="section-tag"><i>${icon}</i> ${title}</div><h1 class="title">${h1}</h1><p class="sub">${subtitle}</p></div><div class="header-actions">${listenButtons(audioPassage)}${canPrint?`<button class="btn print-btn" data-act="print-study" data-passage="${printPassage}">🖨 ${t('printStudy')}</button>`:''}</div></div>${passageBlock(passage,pid,isOriginal||isReview)}<section class="question-drawer always-open" id="question-drawer">${questionCard(mode,true)}</section></section></div>`
}
function originalExtra(){return questionScreen('originalExtra')}
function extra(){return questionScreen('similar')}
function report(){if(!st.original||!st.originalExtra||!st.similar)return `<section class="card panel"><div class="section-tag"><i>▥</i> ${t('report')}</div><h2>${st.lang==='ko'?'두 종류의 추가 문제까지 풀면 비교 리포트가 나와요.':st.lang==='en'?'Complete both practice modes to see your comparison report.':'完成两种追加练习后可查看对比报告。'}</h2></section>`;
 const T=(ko,en,zh)=>st.lang==='ko'?ko:st.lang==='zh'?zh:en;
 const old=st.original.missed,now=st.similar.missed;
 const solved=old.filter(i=>!now.includes(i)),still=old.filter(i=>now.includes(i)),fresh=now.filter(i=>!old.includes(i));
 const chips=(arr,mode)=>arr.length?[...new Set(arr.map(i=>{const q=qs(mode)[i];return q?stratInfo(q[0]).n:null;}).filter(Boolean))].map(n=>`<span class="rp-chip">${esc(n)}</span>`).join(''):'<span class="rp-none">—</span>';
 const recMode=still.length?'original':'similar',rec=(still.length?still:fresh).slice(0,3);
 const tile=(label,score,cls)=>`<div class="rp-tile ${cls}"><span class="rp-score">${score}<i>/12</i></span><small>${esc(label)}</small></div>`;
 return `<section class="card rp-card"><div class="rp-head"><div class="section-tag"><i>▥</i> ${t('report')}</div><h2 class="rp-title">${t('reportTitle')}</h2><p class="rp-sub">${T('교재 학습 → 추가 학습 → 새 지문 연습, 세 단계의 변화를 비교해요.','Compare your three stages: Book Study → Extra → New Passage.','对比三个阶段的变化。')}</p></div>
  <div class="rp-tiles">${tile(t('original'),st.original.score,'a')}${tile(t('originalExtra'),st.originalExtra.score,'b')}${tile(t('similar'),st.similar.score,'c')}</div>
  <div class="rp-grid">
   <div class="rp-box good"><div class="rp-lab">✅ ${T('해결된 약점','Improved','已改进')}</div><div class="rp-chips">${chips(solved,'original')}</div></div>
   <div class="rp-box warn"><div class="rp-lab">⚠️ ${T('계속 어려운 유형','Still tricky','仍薄弱')}</div><div class="rp-chips">${chips(still,'original')}</div></div>
   <div class="rp-box new"><div class="rp-lab">🔄 ${T('새로 흔들린 유형','Newly missed','新出错')}</div><div class="rp-chips">${chips(fresh,'similar')}</div></div>
   <div class="rp-box rec"><div class="rp-lab">🎯 ${T('추천 학습','Focus next','建议练习')}</div><div class="rp-chips">${chips(rec,recMode)}</div></div>
  </div>
  <div class="tools">${(still.length||old.length)?`<button class="btn primary" data-act="coach-start">🎯 ${coachT('스킬 코치 (적응형)','Skill Coach (adaptive)','技能教练（自适应）')}</button>`:''}<button class="btn violet" data-act="retry-similar">${t('retry')}</button></div></section>`}
function modal(){if(!st.modal)return '';const {mode}=st.modal;const blanks=Array.from({length:12},(_,i)=>i).filter(i=>!st.answers[mode][i]);return `<div class="modal-backdrop"><div class="modal"><button class="modal-x" data-act="close-modal">×</button><h2>${t('unanswered')}</h2><p><b>${blanks.length}</b>${t('unansweredCount')}</p><div class="blank-list">${blanks.map(i=>`<button class="num empty" data-act="go-q-modal" data-mode="${mode}" data-i="${i}">${i+1}</button>`).join('')}</div><div class="tools"><button class="btn" data-act="close-modal">${t('close')}</button><button class="btn primary" data-act="grade-anyway" data-mode="${mode}">${t('gradeAnyway')}</button></div></div></div>`}
function missingOriginal(){return `<section class="card panel"><div class="section-tag"><i>📖</i> ${t('questions')}</div><h2>${st.lang==='ko'?'교재 자료가 아직 연결되지 않았어요.':st.lang==='zh'?'教材内容尚未连接。':'The book content is not connected yet.'}</h2><p class="sub">${st.lang==='ko'?'선생님이 교재 자료 파일(data/lesson1.original.js)을 설치하면 이 단계가 열려요. 단어 배우기·추가 학습·새 지문 연습은 지금도 할 수 있어요.':st.lang==='zh'?'老师安装教材资料文件后即可使用此步骤。现在可以先进行单词学习、追加学习和新文章练习。':'This step opens when your teacher installs the book data file. You can still do Learn Words, Extra Learning, and New Passage Practice now.'}</p><div class="tools"><button class="btn primary" data-view="words">${t('words')} →</button><button class="btn violet" data-view="originalExtra">${t('originalExtra')} →</button></div></section>`}
const GATE_TXT={
 ko:{brand:'READING STRATEGIES',level:'Level B · C',tag:'Read · Think · Choose',who:'누가 공부해요?',continue:'이어서 학습하기',other:'다른 친구',newer:'새 친구 추가',name:'이름 또는 별명',start:'시작하기',hint:'실명 대신 별명이나 코드로 입력해도 좋아요.',license:'이 프로그램은 교재를 구입한 학생을 위한 학습 도움 자료입니다.'},
 en:{brand:'READING STRATEGIES',level:'Level B · C',tag:'Read · Think · Choose',who:"Who's studying?",continue:'Continue learning',other:'Someone else',newer:'Add a new friend',name:'Name or nickname',start:'Start',hint:'A nickname or code is fine — no real name needed.',license:'A study aid for students who have purchased the textbook.'},
 zh:{brand:'READING STRATEGIES',level:'Level B · C',tag:'Read · Think · Choose',who:'谁在学习？',continue:'继续学习',other:'换一个人',newer:'添加新朋友',name:'名字或昵称',start:'开始',hint:'用昵称或代号也可以，不必填真实姓名。',license:'本程序是面向已购买教材的学生的学习辅助工具。'}
};
function gate(){
 const g=GATE_TXT[st.lang]||GATE_TXT.ko;const students=Store.listStudents();
 const langBtns=['ko','en','zh'].map(l=>`<button data-lang="${l}" class="${st.lang===l?'active':''}">${l==='ko'?'한국어':l==='en'?'English':'中文'}</button>`).join('');
 const avaFor=(s,size)=>{let av='';try{const sv=Store.load(s.id);const eq=sv&&sv.avatar&&sv.avatar.equipped;if(eq&&window.AVATAR)av=renderAvatar(eq,size);}catch(e){}return av?`<span class="sc-ava">${av}</span>`:`<span class="avatar">${esc((s.name||'?').slice(0,1).toUpperCase())}</span>`;};
 const studentCard=(s)=>`<button class="student-card" data-pick="${esc(s.id)}">${avaFor(s,74)}<b>${esc(s.name)}</b></button>`;
 // Remember the last student who studied: offer a one-tap "continue" at the top.
 const lastId=(Store.getCurrentId&&Store.getCurrentId())||null;
 const lastStudent=lastId?students.find(s=>s.id===lastId):null;
 const others=lastStudent?students.filter(s=>s.id!==lastStudent.id):students;
 const continueBlock=lastStudent?`<div class="gate-block"><button class="continue-card" data-pick="${esc(lastStudent.id)}">${avaFor(lastStudent,64)}<span class="cc-text"><small>${g.continue}</small><b>${esc(lastStudent.name)}</b></span><span class="cc-go">→</span></button></div>`:'';
 const chips=others.length?`<div class="gate-block"><div class="gate-label">${lastStudent?g.other:g.who}</div><div class="student-cards">${others.map(studentCard).join('')}</div></div>`:'';
 return `<div class="cover"><div class="cover-card"><div class="cover-lang language-toggle">${langBtns}</div><div class="brand-badge">G-FIELD</div><h1 class="cover-title">${g.brand}</h1><div class="cover-level">${g.level}</div><div class="cover-tag">${g.tag}</div>${continueBlock}${chips}<div class="gate-block"><div class="gate-label">${g.newer}</div><form class="name-form" data-act="name-form"><input class="name-input" name="name" maxlength="20" placeholder="${g.name}" autocomplete="off" spellcheck="false"><button type="submit" class="btn primary big">${g.start} →</button></form><p class="gate-hint">${g.hint}</p></div><p class="gate-manual"><a href="manual.html" target="_blank" rel="noopener">📖 ${st.lang==='ko'?'처음이세요? 사용법 보기':st.lang==='zh'?'第一次使用？查看使用说明':'New here? See how to use'}</a></p><p class="gate-license">${g.license}</p></div></div>`;
}
function bindGate(){
 app.querySelectorAll('[data-lang]').forEach(b=>b.onclick=()=>{st.lang=b.dataset.lang;render();});
 app.querySelectorAll('[data-pick]').forEach(b=>b.onclick=()=>{const s=Store.listStudents().find(x=>x.id===b.dataset.pick);if(s)enterStudent(s);});
 const form=app.querySelector('[data-act="name-form"]');
 if(form){const inp=form.querySelector('.name-input');form.onsubmit=(e)=>{e.preventDefault();const s=Store.createStudent(inp.value);enterStudent(s);};setTimeout(()=>inp&&inp.focus(),30);}
}
function migrateProfile(saved){if(!saved)return {lessons:{},points:0};if(saved.lessons)return {points:0,...saved,lessons:saved.lessons};return {lessons:{lesson1:saved},points:0,lang:saved.lang};}
function stForLesson(id,fallbackLang){const lp=profile&&profile.lessons?profile.lessons[id]:null;const s=normalizeState({...defaultState(),...(lp||{})});s.lang=(profile&&profile.lang)||fallbackLang||s.lang;return s;}
function enterStudent(student){
 stopSpeak();const lang=st.lang;currentStudent=student;Store.setCurrentId(student.id);
 profile=migrateProfile(Store.load(student.id));ensureAvatar(profile);if(window.GameStore)GameStore.migrate(profile);currentBookId=(profile&&profile.currentBookId)||'cars-level-b';currentLessonId='lesson1';loadLesson('lesson1');
 st=stForLesson('lesson1',lang);atTown=true;townView=(profile.avatar&&profile.avatar.picked)?landingView():'pick';save();render();window.scrollTo({top:0});flushLevelUp();
 if(Store.pull){Store.pull(student.id).then(remote=>{if(remote&&currentStudent&&currentStudent.id===student.id&&(remote.updatedAt||0)>(profile.updatedAt||0)){profile=migrateProfile(remote);st=stForLesson(currentLessonId,lang);render();}}).catch(()=>{});}
}
function saveCurrentToProfile(){if(profile){profile.lessons=profile.lessons||{};profile.lessons[currentLessonId]=st;}}
function openLesson(id,view){stopSpeak();saveCurrentToProfile();const _olr=window.LESSONS&&window.LESSONS[id];if(_olr&&_olr.bookId)currentBookId=_olr.bookId;else if(id==='lesson1')currentBookId='cars-level-b';if(profile)profile.currentBookId=currentBookId;loadLesson(id);st=stForLesson(currentLessonId,st.lang);st.view=view||'home';if(view==='words')st.wordMode='cards';
 // keep qMode in sync with the view (mirrors setView) so town buildings that jump
 // straight into a question view don't record/grade answers against a stale mode.
 if(view==='questions')st.qMode='original';else if(view==='originalExtra'||view==='questionOriginalExtra')st.qMode='originalExtra';else if(view==='similar'||view==='questionSimilar')st.qMode='similar';
 atTown=false;save();render();window.scrollTo({top:0});}
function goTown(){stopSpeak();saveCurrentToProfile();atTown=true;townView='map';save();render();window.scrollTo({top:0});}
function switchStudent(){stopSpeak();saveCurrentToProfile();save();currentStudent=null;profile=null;atTown=true;render();}
function lessonDone(id){const l=profile&&profile.lessons?profile.lessons[id]:null;return !!(l&&l.original&&l.originalExtra&&l.similar);}
function lessonStarted(id){const l=profile&&profile.lessons?profile.lessons[id]:null;return !!(l&&(Object.keys(l.known||{}).length||Object.keys((l.answers||{}).original||{}).length||l.original));}
// Mastery is encouragement only — it never locks a book or lesson. Any level
// stays freely selectable regardless of difficulty (books climb the ladder just
// for orientation, not as a gate).
function lessonMastery(id){const l=profile&&profile.lessons?profile.lessons[id]:null;
 if(!l)return {stars:0,done:false,started:false};
 const done=!!(l.original&&l.originalExtra&&l.similar);
 const started=!!(Object.keys(l.known||{}).length||Object.keys((l.answers||{}).original||{}).length||l.original);
 if(!done)return {stars:0,done:false,started};
 const ss=(l.similar&&l.similar.score)||0,coachCleared=!!l.coachCleared,coachStars=l.coachStars||0;
 const noMiss=((l.similar&&l.similar.missed)||[]).length===0;
 let stars=1;if(ss>=9||coachCleared||coachStars>=2)stars=2;if(ss>=11&&(coachCleared||noMiss))stars=3;
 return {stars,done:true,started:true};}
function bookMastery(bookId){const ids=availableLessons(bookId);const total=ids.length;let done=0,started=0,stars=0;
 ids.forEach(id=>{const m=lessonMastery(id);if(m.done)done++;if(m.started)started++;stars+=m.stars;});
 return {total,done,started,stars,complete:total>0&&done>=total,pct:total?Math.round(done/total*100):0};}
// Textbook completion across the WHOLE catalog (every series, not just CARS) —
// bookMastery() itself is already series-agnostic, this just maps it over
// every available BOOK_CATALOG entry for the Reading Report's summary tally.
function allBookMasteries(){return (window.BOOK_CATALOG||[]).filter(b=>b.available).map(bk=>({book:bk,mastery:bookMastery(bk.id)}));}
// eBook side of the cumulative Reading Report: AR total/average + how many
// library books have been meaningfully engaged with. quizBest!=null is used
// as the completion signal (same value libSaveProgress already stores) —
// mirrors bookMastery's done/complete semantics but for the library shape,
// which has no lesson array to sum.
function libraryStats(){
 const prog=(profile&&profile.library)||{};
 const rows=Object.keys(prog).map(bid=>{const meta=libBookMeta(bid);if(!meta)return null;
  const p=prog[bid];const completed=p.quizBest!=null;
  return {id:bid,title:meta.title,ar:meta.ar,completed,quizBest:p.quizBest,quizTotal:p.quizTotal};}).filter(Boolean);
 const completedRows=rows.filter(r=>r.completed);
 const arSum=completedRows.reduce((s,r)=>s+(Number(r.ar)||0),0);
 const arAvg=completedRows.length?arSum/completedRows.length:0;
 return {rows,completedCount:completedRows.length,totalCount:rows.length,arSum,arAvg};}
function bookBandOf(bk){if(!bk)return 'G3';if(bk.band)return bk.band;const g=(bk.grade||'').toString();if(/start/i.test(g))return 'Starter';const m=g.match(/G\s*([1-5])/i);return m?('G'+m[1]):'G3';}
function starDots(n){return `<span class="mstars" aria-label="${n}/3">${'★'.repeat(n)}${'☆'.repeat(3-n)}</span>`;}
function boot(){render();flushLevelUp();} // always open the "누가 공부해요?" picker (saved students are cards)
function town(){
 const langBtns=['ko','en','zh'].map(l=>`<button data-lang="${l}" class="${st.lang===l?'active':''}">${l==='ko'?'한국어':l==='en'?'English':'中文'}</button>`).join('');
 const pts=(profile&&profile.points)||0;
 const stops=availableLessons().map(id=>{const m=lessonMeta(id);const done=lessonDone(id);const started=lessonStarted(id);const cur=id===currentLessonId;
  const status=done?(st.lang==='ko'?'완료':st.lang==='zh'?'完成':'Done'):started?(st.lang==='ko'?'학습 중':st.lang==='zh'?'学习中':'In progress'):(st.lang==='ko'?'시작하기':st.lang==='zh'?'开始':'Start');
  const mst=lessonMastery(id);const starsHtml=mst.stars?`<span class="stop-stars">${starDots(mst.stars)}</span>`:'';
  return `<button class="lesson-stop ${done?'done':''} ${cur?'current':''}" data-act="open-lesson" data-lesson="${esc(id)}"><span class="stop-badge">${m.num}</span><span class="stop-thumb"><img src="${esc(m.image)}" alt="" loading="lazy" onerror="this.remove()"></span><span class="stop-info"><b>Lesson ${m.num}</b><small>${esc(m.title)}</small><em class="stop-status">${done?'✓ ':''}${status}${starsHtml}</em></span></button>`;}).join('');
 ensureAvatar(profile);
 const parentBtn=`<button class="btn tiny ghost" data-act="parent-open" title="${st.lang==='ko'?'학부모':st.lang==='zh'?'家长':'Parent'}">👨‍👩‍👧</button>`;
 const noticeBtn=`<button class="btn tiny" data-act="town-notice" title="${st.lang==='ko'?'공지사항':st.lang==='zh'?'公告':'Notices'}">📢</button>`;
 const header=`<div class="town-top"><div class="town-brand">${brandHTML()}</div><div class="town-tools"><span class="points-pill">★ ${pts}P</span>${noticeBtn}${parentBtn}<div class="language-toggle town-lang">${langBtns}</div>${userChip()}</div></div>`;
 if(townView==='pick')return `<div class="town town-pick"><div class="town-top"><div class="town-brand">${brandHTML()}</div><div class="language-toggle town-lang">${langBtns}</div></div>${basePicker()}</div>`;
 if(townView==='closet')return `<div class="town">${header}${closet(pts)}</div>`;
 const customize=st.lang==='ko'?'캐릭터 꾸미기':st.lang==='zh'?'装扮角色':'Customize';
 const explore=st.lang==='ko'?'마을 탐험':st.lang==='zh'?'探索小镇':'Explore Town';
 const exploreBtn=gameAvailable()?`<button class="btn violet" data-act="town-game">${explore}</button>`:'';
 const sqName=sqAvailable()?(sqLoc(VIDEO_PLAN.name)||'Screen Quest'):'';
 const sqBtn=sqAvailable()?`<button class="btn amber" data-act="sq-open">${sqName}</button>`:'';
 const avatarCard=`<section class="avatar-card"><div class="ava-wrap">${renderAvatar(null,132)}</div><div class="ava-info"><div class="ava-hello">${st.lang==='ko'?'안녕,':st.lang==='zh'?'你好，':'Hi,'} <b>${esc(currentStudent?currentStudent.name:'')}</b>!</div><div class="ava-pts"><span class="points-pill">★ ${pts}P</span></div><div class="ava-btns">${exploreBtn}${sqBtn}<button class="btn primary" data-act="town-closet">${customize}</button></div></div></section>`;
 const _bks=availableBooks();const _bkCur=_bks.find(bk=>bk.id===currentBookId)||_bks[0]||{title:'CARS',shortLabel:'Level'};const _bookTabs=_bks.length>1?`<div class="book-tabs">${_bks.map(bk=>`<button class="book-tab ${bk.id===currentBookId?'active':''}" data-act="switch-book" data-book="${esc(bk.id)}">${esc(bk.shortLabel)}</button>`).join('')}</div>`:'';
 return `<div class="town">${header}${avatarCard}<section class="house-card"><div class="house-head"><div class="house-emoji">❦</div><div><div class="house-tag">${st.lang==='ko'?'책':st.lang==='zh'?'书':'Book'}</div><h1 class="house-title">${esc(_bkCur.title)}</h1><p>${st.lang==='ko'?'Lesson 1부터 차례로 학습해요.':st.lang==='zh'?'从第 1 课开始依次学习。':'Learn from Lesson 1 onward.'}</p></div></div>
  ${_bookTabs}<div class="lesson-path">${stops}</div></section></div>`;
}
function brandHTML(){return `<img class="brand-mark" src="assets/images/gfield-logo.svg" alt="G.FIELD" draggable="false"><span class="brand-sub">Reading Town</span>`;}
function gameAvailable(){return !!(window.Phaser&&window.TownGame);}
function landingView(){return gameAvailable()?'game':'map';}
function lastStudiedLesson(){const ls=(profile&&profile.lessons)||{};let best=null,bt=-1;Object.keys(ls).forEach(id=>{const s=ls[id];if(!s)return;const t=s.updatedAt||0;if(t>bt){bt=t;best=id;}});if(!best){const av=availableLessons();best=(av&&av[0])||'lesson1';}return best;}
function resumeInfo(){const id=lastStudiedLesson();const m=lessonMeta(id);return {id,num:m.num,title:m.title,done:lessonDone(id),started:lessonStarted(id)};}
function lookForGame(){const eq=avEquipped();const hat=avItem('hat',eq.hat);return {skin:(avItem('skin',eq.skin)||{}).fill||'#ffd9ad',hair:(avItem('haircolor',eq.haircolor)||{}).fill||'#6b4326',clothes:(avItem('clothes',eq.clothes)||{}).fill||'#6db3f2',hatEmoji:(hat&&hat.emoji)||''};}
function avatarSvgUri(){try{var svg=renderAvatar(avEquipped(),120,{noBg:true});return 'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(svg)));}catch(e){return null;}}
// Top-right identity chip: the student's own LEGO minifigure + name (membership auth comes later).
function userChip(){if(!currentStudent)return '';
 const ava=renderAvatar(avEquipped(),40,{noBg:true});
 const sw=st.lang==='ko'?'학생 바꾸기':st.lang==='zh'?'切换学生':'Switch student';
 return `<button class="user-chip" data-act="switch-student" title="${sw}"><span class="uc-ava">${ava}</span><span class="uc-name">${esc(currentStudent.name)}</span></button>`;}
function gameTownShell(){const pts=(profile&&profile.points)||0;const langBtns=['ko','en','zh'].map(l=>`<button data-lang="${l}" class="${st.lang===l?'active':''}">${l==='ko'?'한국어':l==='en'?'English':'中文'}</button>`).join('');
 const listLbl=st.lang==='ko'?'목록':st.lang==='zh'?'列表':'List';const customize=st.lang==='ko'?'꾸미기':st.lang==='zh'?'装扮':'Dress up';
 const hint=st.lang==='ko'?'지도를 탭하면 그 자리로 이동해요 · 건물을 탭하면 바로 열려요':st.lang==='zh'?'点击地图即可走过去 · 点击建筑物立即打开':'Tap the map to walk there · tap a building to open it';
 const _r=resumeInfo();
 const _cont=st.lang==='ko'?'이어서 학습하기':st.lang==='zh'?'继续学习':'Continue learning';
 const _rst=_r.done?(st.lang==='ko'?'복습':st.lang==='zh'?'复习':'Review'):(_r.started?(st.lang==='ko'?'학습 중':st.lang==='zh'?'学习中':'In progress'):(st.lang==='ko'?'시작하기':st.lang==='zh'?'开始':'Start'));
 const banner=`<button class="resume-banner" data-act="resume-lesson"><span class="rb-icon">📖</span><span class="rb-text"><small>${_cont}</small><b>Lesson ${_r.num} · ${esc(_r.title)}</b></span><span class="rb-status ${_r.done?'done':_r.started?'mid':''}">${_rst}</span><span class="rb-go">▶</span></button>`;
 return `<div class="town game-town"><div class="town-top"><div class="town-brand">${brandHTML()}</div><div class="town-tools"><span class="points-pill">🪙 ${pts}</span>${sqAvailable()?`<button class="btn tiny" data-act="sq-open">🎬 ${sqT('스크린','Screen','屏幕')}</button>`:''}<button class="btn tiny" data-act="diag-open" title="${st.lang==='ko'?'레벨 진단':st.lang==='zh'?'水平测评':'Level check'}">🧭</button><button class="btn tiny" data-act="town-notice" title="${st.lang==='ko'?'공지사항':st.lang==='zh'?'公告':'Notices'}">📢</button><button class="btn tiny" id="rw-weather" title="${st.lang==='ko'?'날씨':st.lang==='zh'?'天气':'Weather'}">☀️</button><button class="btn tiny" data-act="town-closet">🎨 ${customize}</button><button class="btn tiny" data-act="town-list">≣ ${listLbl}</button><div class="language-toggle town-lang">${langBtns}</div>${userChip()}</div></div>${banner}<div class="town-stage-wrap"><div id="town-stage"></div><div class="town-zoom"><button class="zbtn" data-zoom="in" aria-label="zoom in">＋</button><button class="zbtn" data-zoom="out" aria-label="zoom out">－</button></div></div><div id="town-menu" class="town-menu"></div><p class="town-hint">${hint}</p></div>`;}
// Two-finger pinch to zoom the town map, alongside the +/- buttons. Tracks active
// pointers on the stage; with exactly two down, scales TownGame's zoom by the change
// in finger distance each move. A single finger is left alone so it still drives
// avatar movement/building taps — only a genuine two-finger gesture zooms.
function bindPinchZoom(stage){
 const pts=new Map();let startDist=0,startZoom=1;
 const dist=()=>{const[a,b]=[...pts.values()];return Math.hypot(a.x-b.x,a.y-b.y);};
 stage.addEventListener('pointerdown',e=>{pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pts.size===2){startDist=dist();startZoom=(window.TownGame&&TownGame.getZoom)?TownGame.getZoom():1;}});
 stage.addEventListener('pointermove',e=>{if(!pts.has(e.pointerId))return;pts.set(e.pointerId,{x:e.clientX,y:e.clientY});
  if(pts.size===2&&startDist>0&&window.TownGame&&TownGame.setZoom){e.preventDefault();TownGame.setZoom(startZoom*(dist()/startDist));}},{passive:false});
 const end=e=>{pts.delete(e.pointerId);if(pts.size<2)startDist=0;};
 stage.addEventListener('pointerup',end);stage.addEventListener('pointercancel',end);stage.addEventListener('pointerleave',end);
}
function bindGameTown(){bind();
 // English village signage (fixed English names regardless of UI language)
 const labels={library:'eBook Library',wordshop:'Vocabulary Room',theater:'Screen Theater',practice:'Textbook Library',report:'Reading Report',writingvillage:'Writing Village',open:st.lang==='ko'?'탭하여 들어가기':st.lang==='zh'?'点击进入':'Tap to enter'};
 const stage=document.getElementById('town-stage');
 if(stage&&gameAvailable()){TownGame.mount(stage,{look:lookForGame(),coins:(profile&&profile.points)||0,labels,onOpenMenu:buildingMenu,slots:(window.DECORATIONS&&DECORATIONS.slots)||{},placed:placedDecoEmoji(),onSlotClick:decorationMenu,avatarUri:avatarSvgUri(),decorArt:placedDecoArt(),buildingArt:buildingArtMap()});}
 app.querySelectorAll('.town-zoom [data-zoom]').forEach(b=>{b.onclick=()=>{if(!window.TownGame||!TownGame.setZoom)return;const cur=TownGame.getZoom?TownGame.getZoom():1;TownGame.setZoom(b.dataset.zoom==='in'?cur+0.4:cur-0.4);};});
 if(stage)bindPinchZoom(stage);
 const wx=document.getElementById('rw-weather');if(wx){const icons=['☀️','🌧️'];let wi=0;wx.onclick=()=>{wi=(wi+1)%icons.length;wx.textContent=icons[wi];if(window.TownGame)TownGame.setWeather(wi===1?'rain':'clear');};}}
function buildingMenu(key){if(key==='theater'){if(window.TownGame)TownGame.destroy();enterScreenQuest();return;}
 if(key==='practice'){showBookShelf();return;}          // Study House → level ladder / book catalog
 if(key==='library'){if(window.TownGame)TownGame.destroy();openLibrary();return;}
 if(key==='writingvillage'){if(window.TownGame)TownGame.destroy();openWritingVillage();return;}
 const map={wordshop:{view:'words',icon:'🔤',title:{ko:'어휘 방 · 단어 배우기',en:'Vocabulary Room · Learn Words',zh:'词汇室 · 学习单词'},sub:{ko:'단어 카드 · 암기 카드 · 단어 게임.',en:'Word cards · memory · word game.',zh:'单词卡 · 记忆卡 · 单词游戏。'}},report:{view:'report',icon:'📊',title:{ko:'리딩 리포트 · 학습 리포트',en:'Reading Report · Learning Report',zh:'阅读报告 · 学习报告'},sub:{ko:'전략별 강점·약점을 확인해요.',en:'See your strengths and weaknesses by strategy.',zh:'查看各策略的强弱项。'}}};const m=map[key];if(!m)return;const el=document.getElementById('town-menu');if(!el)return;
 const lessons=availableLessons();
 el.innerHTML=`<div class="tm-backdrop" data-tmx></div><div class="tm-card"><button class="tm-x" data-tmx>×</button><div class="tm-head">${m.icon} <b>${m.title[st.lang]||m.title.en}</b></div><p class="tm-sub">${m.sub[st.lang]||m.sub.en}</p><div class="tm-pick">${st.lang==='ko'?'어느 레슨을 열까요?':st.lang==='zh'?'打开哪一课？':'Which lesson?'}</div><div class="tm-lessons">${lessons.map(id=>{const n=lessonNum(id);const done=lessonDone(id);const ms=lessonMastery(id);return `<button class="tm-lesson ${done?'done':''}" data-tm-lesson="${esc(id)}"><span class="stop-badge">${n}</span><span>Lesson ${n}${done?' ✓':''}${ms.stars?`<em class="tm-stars">${starDots(ms.stars)}</em>`:''}</span></button>`;}).join('')}</div></div>`;
 el.classList.add('show');
 const close=()=>{el.classList.remove('show');el.innerHTML='';};
 el.querySelectorAll('[data-tmx]').forEach(b=>b.onclick=close);
 el.querySelectorAll('[data-tm-lesson]').forEach(b=>b.onclick=()=>{openLessonAt(b.dataset.tmLesson,m.view);});}
function openLessonAt(id,view){if(window.TownGame)TownGame.destroy();openLesson(id,view);}
function _book3dHtml(bk){
 const locked=!bk.available;
 const spineStyle=`background:${bk.spineColor||bk.publisherColor};`;
 const frontStyle=`background:${bk.coverGradient};color:${bk.accentColor||'#fff'};`;
 const pubStyle=`background:rgba(0,0,0,.25);color:${bk.accentColor||'#fff'};`;
 return `<div class="book-card${locked?' locked':''}" data-book-id="${esc(bk.id)}" title="${esc(bk.fullTitle)}">
  <div class="book-3d">
   <div class="book-spine" style="${spineStyle}"></div>
   <div class="book-front" style="${frontStyle}">
    <span class="book-front-pub" style="${pubStyle}">${esc(bk.publisherAbbr)}</span>
    <span class="book-front-title">${esc(bk.title)}</span>
    <span class="book-front-sub">${esc(bk.subtitle)}</span>
    <span class="book-front-grade">${esc(bk.grade)}</span>
    ${locked?'<span class="book-front-lock">🔒</span>':''}
   </div>
  </div>
  <div class="book-card-label">
   <strong>${esc(bk.title)} <span style="font-weight:500">${esc(bk.subtitle)}</span></strong>
   <small>${esc(bk.publisher)}</small>
   ${_bookProgressHtml(bk)}
  </div>
 </div>`;}
function _bookProgressHtml(bk){if(!bk||!bk.available)return '';const bm=bookMastery(bk.id);if(!bm.total||!bm.started)return '';
 const done=bm.complete;const avg=Math.max(0,Math.min(3,Math.round(bm.stars/Math.max(1,bm.total))));
 const lbl=done?(st.lang==='ko'?'완주':st.lang==='zh'?'完成':'Cleared'):`${bm.done}/${bm.total}`;
 return `<div class="book-prog ${done?'done':''}"><div class="bp-bar"><b style="width:${bm.pct}%"></b></div><div class="bp-meta">${done?'⭐ ':''}${lbl}${bm.stars?` · ${starDots(avg)}`:''}</div></div>`;}
function bookSeriesGroups(bks){
 // Sub-group a band's books by their .series so CARS renders as one series
 // among siblings (WonderSkills, Reading Prime, ...) rather than being the
 // only thing on the shelf — series is display-only, never a gate.
 const order=[];const map={};
 bks.forEach(bk=>{const key=bk.series||bk.title;if(!map[key]){map[key]=[];order.push(key);}map[key].push(bk);});
 return order.map(key=>({series:key,color:map[key][0].publisherColor||map[key][0].spineColor||'#7bc47f',books:map[key]}));
}
function showBookShelf(){
 const t=(ko,en,zh)=>st.lang==='ko'?ko:st.lang==='zh'?zh:en;
 const catalog=window.BOOK_CATALOG||[];
 const bandOf=(bk)=>{if(bk.band)return bk.band;const g=(bk.grade||'').toString();if(/start/i.test(g))return 'Starter';const m=g.match(/G\s*([1-5])/i);return m?('G'+m[1]):'G3';};
 // ladder rungs from top (G5) down to Starter at the bottom — you climb up as you level up
 const BANDS=[{k:'G5',c:'#2b8a86'},{k:'G4',c:'#2f9e8f'},{k:'G3',c:'#3fa86a'},{k:'G2',c:'#5bb56a'},{k:'G1',c:'#7bc47f'},{k:'Starter',c:'#9ccc9e'}];
 const rungs=BANDS.map(b=>{const bks=catalog.filter(x=>bandOf(x)===b.k);
  const groups=bookSeriesGroups(bks);
  const inner=groups.length?groups.map(g=>`<div class="level-series-group"><div class="level-series-label"><span class="lib-series-dot" style="background:${g.color}"></span>${esc(g.series)}</div><div class="level-series-books">${g.books.map(_book3dHtml).join('')}</div></div>`).join(''):`<div class="level-empty">🔒 ${t('준비중','Coming soon','即将开放')}</div>`;
  return `<section class="level-row"><div class="level-tag" style="background:${b.c}">${b.k}</div><div class="level-books">${inner}</div></section>`;}).join('');
 const html=`<div class="book-shelf study-house">
  <div class="book-shelf-top">
   <h2>🏫 ${t('교재 도서관','Textbook Library','教材图书馆')}</h2>
   <button class="btn secondary" data-act="town-map">← ${t('마을로','Town','返回')}</button>
  </div>
  <p class="book-shelf-sub">${t('어느 레벨이든 자유롭게 고르세요 — 잠긴 순서는 없어요. 사다리는 난이도 안내일 뿐이에요.','Pick any level freely — nothing is locked. The ladder just shows difficulty.','任意级别都可自由选择——没有锁定，梯子只表示难度。')}</p>
  <div class="level-ladder">${rungs}</div>
 </div>`;
 if(window.TownGame)TownGame.destroy();
 const el=document.getElementById('app');
 el.innerHTML=html;
 bind();
 el.querySelectorAll('.book-card').forEach(card=>{
  card.addEventListener('click',()=>{
   const bid=card.dataset.bookId;
   const bk=(window.BOOK_CATALOG||[]).find(b=>b.id===bid);
   if(!bk)return;
   if(!bk.available){
    toast(t('아직 준비 중인 교재예요 🔒','This book is coming soon 🔒','该教材即将开放 🔒'));
    return;
   }
   startBookCopy(bk,()=>{
    currentBookId=bid;
    if(profile)profile.currentBookId=bid;
    const lessons=availableLessons(bid);
    const firstLesson=lessons[0]||'lesson1';
    openLessonAt(firstLesson,'questions');
   });
  });
 });}
function startBookCopy(bk,onDone){
 const t=(ko,en,zh)=>st.lang==='ko'?ko:st.lang==='zh'?zh:en;
 const steps=[
  t('라이선스 서버 연결 중...','Connecting to license server...','连接许可服务器...'),
  t('교재 정보 확인 중...','Verifying book metadata...','验证教材信息...'),
  t('DRM 키 교환 중...','Exchanging DRM keys...','交换 DRM 密钥...'),
  t('콘텐츠 복사 중...','Copying content...','复制内容...'),
  t('라이선스 등록 완료!','License registered!','许可证注册完成！'),
 ];
 const pubStyle=`background:${bk.publisherColor};`;
 const overlay=document.createElement('div');
 overlay.className='drm-overlay';
 overlay.innerHTML=`<div class="drm-box">
  <div class="drm-logo" style="${pubStyle}">${esc(bk.publisherAbbr)}</div>
  <div class="drm-title">${t('책 복사 중입니다','Copying Book','正在复制教材')}<br><small style="font-weight:500;opacity:.7">${esc(bk.fullTitle)}</small></div>
  <div class="drm-isbn">${esc(bk.isbn)}</div>
  <div class="drm-spin-wrap"><div class="drm-spinner"></div><div class="drm-check" id="drm-check">✓</div></div>
  <div class="drm-progress-wrap"><div class="drm-progress-bar" id="drm-bar"></div></div>
  <div class="drm-steps" id="drm-steps">${steps.map((s,i)=>`<div class="drm-step" id="drm-step-${i}">${esc(s)}</div>`).join('')}</div>
 </div>`;
 document.body.appendChild(overlay);
 const bar=overlay.querySelector('#drm-bar');
 const totalMs=2900;
 const stepMs=totalMs/steps.length;
 let prog=0;
 const progInt=setInterval(()=>{
  prog=Math.min(prog+100/(totalMs/80),100);
  bar.style.width=prog+'%';
 },80);
 steps.forEach((_,i)=>{
  setTimeout(()=>{
   const el=overlay.querySelector(`#drm-step-${i}`);
   if(el)el.classList.add('done');
  },stepMs*(i+.6));
 });
 setTimeout(()=>{
  clearInterval(progInt);
  bar.style.width='100%';
  const check=overlay.querySelector('#drm-check');
  const spin=overlay.querySelector('.drm-spinner');
  if(spin)spin.style.opacity='0';
  if(check)check.style.opacity='1';
  setTimeout(()=>{overlay.remove();onDone();},400);
 },totalMs);
}
function decoItem(id){return ((window.DECORATIONS&&DECORATIONS.items)||[]).find(x=>x.id===id);}
function placedDecoEmoji(){const t=(profile&&profile.town&&profile.town.placedDecorations)||{};const out={};Object.keys(t).forEach(slot=>{const it=decoItem(t[slot]);if(it)out[slot]=it.emoji;});return out;}
function placedDecoArt(){const t=(profile&&profile.town&&profile.town.placedDecorations)||{};const out={};Object.keys(t).forEach(slot=>{const u=decorArtUri(t[slot]);if(u)out[slot]=u;});return out;}
function svgToUri(svg){try{return svg?'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(svg))):null;}catch(e){return null;}}
function buildingArtMap(){const A=window.BUILDING_ART||{};const out={};Object.keys(A).forEach(k=>{const u=svgToUri(A[k]);if(u)out[k]=u;});return out;}
// ---- Parent dashboard ----
function parentStats(){const lessons=availableLessons();
 const rows=lessons.map(id=>{const ls=(profile.lessons||{})[id]||null;const rt=buildRuntimeLesson(id)||{};const orig=ls&&ls.original,ext=ls&&ls.originalExtra,sim=ls&&ls.similar;
  const wc=(rt.words||[]).length;const known=ls?Object.keys(ls.known||{}).filter(k=>ls.known[k]).length:0;
  return {id,num:lessonNum(id),title:rt.title||'',done:lessonDone(id),started:lessonStarted(id),orig:orig?orig.score:null,ext:ext?ext.score:null,sim:sim?sim.score:null,wc,known};});
 return {rows};}
// Cumulative strategy-weakness ranking across every lesson AND every book the
// student has ever attempted (Book Study / Extra Learning / New Passage — STEP
// 3/5/7). Question index i always maps to the same fixed-order strategy (see
// CLAUDE.md), so this only needs the saved {score,missed} per attempt — no need
// to re-fetch each lesson's (often Supabase-only) question list. That also fixes
// a latent bug where the old per-book calc silently skipped STEP-3 strategy data
// for every lesson except lesson1 (the only one with statically-bundled originals).
const CANON_STRATS=['Finding Main Idea','Recalling Facts and Details','Understanding Sequence','Recognizing Cause and Effect','Comparing and Contrasting','Making Predictions','Finding Word Meaning in Context','Drawing Conclusions and Making Inferences','Distinguishing Between Fact and Opinion',"Understanding Author's Purpose",'Interpreting Figurative Language','Distinguishing Between Real and Make-believe'];
function cumulativeStrategyStats(){
 const strat={};CANON_STRATS.forEach(s=>{strat[s]={seen:0,miss:0};});
 const lessons=(profile&&profile.lessons)||{};let attempts=0;
 Object.values(lessons).forEach(ls=>{if(!ls)return;
  ['original','originalExtra','similar'].forEach(mode=>{const att=ls[mode];if(!att||!Array.isArray(att.missed))return;attempts++;
   CANON_STRATS.forEach((s,i)=>{strat[s].seen++;if(att.missed.includes(i))strat[s].miss++;});});});
 const ranked=CANON_STRATS.map(s=>({name:s,seen:strat[s].seen,miss:strat[s].miss,rate:strat[s].seen?strat[s].miss/strat[s].seen:0}))
  .filter(r=>r.seen>0).sort((a,b)=>b.rate-a.rate||b.miss-a.miss);
 return {ranked,attempts};}
function parentDashboard(){const t=(ko,en,zh)=>st.lang==='ko'?ko:st.lang==='zh'?zh:en;const pts=window.GameStore?GameStore.coins(profile):(profile&&profile.points)||0;
 const S=parentStats();const doneN=S.rows.filter(r=>r.done).length,total=S.rows.length;const sqN=Object.keys((profile.screenQuest&&profile.screenQuest.passed)||{}).length;const myW=((profile&&profile.myWords)||[]).length;
 const sum=`<div class="pd-sum"><div class="pd-card"><span class="pd-n">${pts}</span><small>${t('총 포인트','Points','总积分')}</small></div><div class="pd-card"><span class="pd-n">${doneN}/${total}</span><small>${t('완료 레슨','Lessons done','完成课程')}</small></div><div class="pd-card"><span class="pd-n">${sqN}</span><small>${t('영상 퀴즈 통과','Video quizzes','视频测验')}</small></div><div class="pd-card"><span class="pd-n">${myW}</span><small>${t('나만의 단어','My words','我的单词')}</small></div></div>`;
 const C=cumulativeStrategyStats();
 const weakRanked=C.ranked.filter(r=>r.miss>0);
 const strong=C.ranked.filter(r=>r.miss===0).map(r=>r.name);
 const weakHtml=weakRanked.length?weakRanked.map((r,i)=>{const info=stratInfo(r.name);return `<div class="pd-weak"><div class="pd-weak-h"><span class="pd-rank">${i+1}</span><b>${esc(info.n)}</b><span class="pd-miss">${t('틀림','missed','错')} ${r.miss}/${r.seen} (${Math.round(r.rate*100)}%)</span></div><p>${esc(info.t)}</p></div>`;}).join(''):(C.attempts?`<p class="pd-empty">${t('훌륭해요! 지금까지 모든 전략을 잘 풀고 있어요.','Great job — no weak strategies so far.','太棒了，目前没有薄弱项。')}</p>`:`<p class="pd-empty">${t('아직 교재 학습 데이터가 쌓이지 않았어요.','No Book Study data yet.','还没有教材学习数据。')}</p>`);
 const strongHtml=strong.length?strong.map(n=>`<span class="pd-tag">${esc(stratInfo(n).n)}</span>`).join(''):'<span class="pd-empty">—</span>';
 const sc=v=>v==null?'—':v+'/12';
 const rowsHtml=S.rows.map(r=>{const status=r.done?t('완료','Done','完成'):r.started?t('학습 중','In progress','进行中'):t('시작 전','Not started','未开始');return `<div class="pd-row ${r.done?'done':''}"><span class="pd-lnum">${r.num}</span><div class="pd-linfo"><b>Lesson ${r.num}</b><small>${esc(r.title)}</small></div><span class="pd-stat ${r.done?'ok':r.started?'mid':''}">${status}</span><span class="pd-scv">${sc(r.orig)}</span><span class="pd-scv">${sc(r.ext)}</span><span class="pd-scv">${sc(r.sim)}</span><span class="pd-scv">${r.known}/${r.wc||12}</span></div>`;}).join('');
 const table=`<div class="pd-table"><div class="pd-row head"><span class="pd-lnum">#</span><div class="pd-linfo"><b>${t('레슨','Lesson','课程')}</b></div><span class="pd-stat">${t('상태','Status','状态')}</span><span class="pd-scv">${t('교재','Book','教材')}</span><span class="pd-scv">${t('추가','Extra','追加')}</span><span class="pd-scv">${t('새지문','New','新文')}</span><span class="pd-scv">${t('단어','Words','单词')}</span></div>${rowsHtml}</div>`;
 const name=currentStudent?esc(currentStudent.name):'';
 const dg=profile&&profile.diagnostic;const uniq=a=>[...new Set(a||[])];
 const diagSec=(dg&&dg.done)?`<section class="pd-sec pd-diag"><h3>🧭 ${t('리딩 진단 결과','Reading diagnostic result','阅读测评结果')}</h3><div class="pd-diagrow"><div class="pd-diagorb">${dg.score}<i>/${dg.total}</i></div><div class="pd-diaginfo"><p class="pd-diagline"><b>${t('응시 레벨','Tested','测试级别')}</b> ${esc(dg.testedLevel)}　→　<b>${t('추천 레벨','Recommended','推荐级别')}</b> <span class="pd-reclvl">${esc(dg.recommend)}</span></p><p class="pd-diagtags"><b>💪 ${t('강점','Strengths','强项')}:</b> ${uniq(dg.strengths).slice(0,4).map(s=>`<span class="pd-tag">${esc(stratInfo(s).n)}</span>`).join('')||'—'}</p><p class="pd-diagtags"><b>🎯 ${t('약점','Focus','弱项')}:</b> ${uniq(dg.weaknesses).slice(0,4).map(s=>`<span class="pd-tag warn">${esc(stratInfo(s).n)}</span>`).join('')||`<span class="pd-empty">${t('없음','none','无')}</span>`}</p></div></div><div class="pd-diagact"><button class="btn tiny" data-act="diag-open">↻ ${t('다시 진단','Re-test','重新测评')}</button></div></section>`:`<section class="pd-sec pd-diag"><h3>🧭 ${t('리딩 진단','Reading diagnostic','阅读测评')}</h3><p class="pd-empty">${t('아직 진단을 보지 않았어요.','No diagnostic taken yet.','还没有测评。')} <button class="btn tiny" data-act="diag-open">${t('진단 시작','Start check','开始测评')}</button></p></section>`;
 const LS=libraryStats();const BM=allBookMasteries();const tbDone=BM.filter(x=>x.mastery.complete).length,tbTotal=BM.length;const ebTotal=(libCatalog().books||[]).length;
 const readingSec=`<section class="pd-sec"><h3>📖 ${t('독서 현황','Reading overview','阅读概况')}</h3><div class="pd-sum"><div class="pd-card"><span class="pd-n">${LS.completedCount}/${ebTotal}</span><small>${t('완독한 eBook','eBooks completed','完读的电子书')}</small></div><div class="pd-card"><span class="pd-n">${LS.arAvg?LS.arAvg.toFixed(1):'—'}</span><small>${t('평균 AR 지수','Avg AR level','平均AR指数')}</small></div><div class="pd-card"><span class="pd-n">${tbDone}/${tbTotal}</span><small>${t('완주한 교재','Textbooks completed','完成的教材')}</small></div></div><p class="pd-note">${t('eBook은 AR·완독 정도만 집계돼요 — 전략별 분석은 교재 학습에서만 나와요(아래).','eBooks contribute AR level and completion only — the strategy breakdown below is textbook-only.','电子书只统计AR指数和完读情况——下方的策略分析仅来自教材学习。')}</p></section>`;
 return `<div class="town parent-dash"><div class="town-top"><div class="town-brand">👨‍👩‍👧 ${t('학부모 대시보드','Parent Dashboard','家长面板')}</div><div class="town-tools"><span class="student-chip"><b>${name}</b></span><button class="btn tiny" data-act="town-map">← ${t('마을로','Town','返回')}</button></div></div>
  ${sum}
  ${diagSec}
  ${readingSec}
  <section class="pd-sec"><h3>🎯 ${t('누적 전략별 약점 랭킹','Cumulative strategy weakness ranking','累计策略薄弱排名')}</h3><p class="pd-note">${t('지금까지 푼 모든 레슨·모든 책의 교재 학습·추가 학습·새 지문 연습을 합산한 순위예요. 1위가 가장 자주 틀리는 전략이에요.','Ranked across every lesson and every book studied so far (Book Study + Extra Learning + New Passage). #1 is the most-missed strategy.','汇总迄今学习过的所有课程和书籍（教材学习+追加学习+新文章练习）后的排名，第1名是最常错的策略。')}</p>${weakHtml}<div class="pd-strong"><b>💪 ${t('완전히 익힌 전략','Mastered','已掌握')}:</b> ${strongHtml}</div></section>
  <section class="pd-sec"><h3>📚 ${t('레슨별 진도','Progress by lesson','各课进度')}</h3>${table}</section>
  <p class="pd-foot">${t('점수는 운·뽑기가 아니라 학습 완료와 성장에만 연결돼요. 데이터는 아이별로 저장됩니다.','Points come only from learning and growth — never luck. Data is saved per child.','积分只来自学习与成长，绝非运气。数据按孩子分别保存。')}</p></div>`;}
function updateCoinHud(){const pill=document.querySelector('.game-town .town-tools .points-pill');if(pill)pill.textContent='🪙 '+(window.GameStore?GameStore.coins(profile):(profile&&profile.points)||0);}
function decorationMenu(slotId){const slot=window.DECORATIONS&&DECORATIONS.slots[slotId];if(!slot||!window.GameStore)return;GameStore.migrate(profile);
 const t2=(ko,en,zh)=>st.lang==='ko'?ko:st.lang==='zh'?zh:en;const items=(DECORATIONS.items||[]).filter(x=>x.slot===slotId);const coins=GameStore.coins(profile);const placedId=profile.town.placedDecorations[slotId]||null;const el=document.getElementById('town-menu');if(!el)return;
 const cards=items.map(it=>{const owned=(profile.town.unlockedDecorations||[]).includes(it.id);const placed=placedId===it.id;let ctrl;if(placed)ctrl=`<span class="av-badge on">✓ ${t2('놓음','Placed','已放')}</span>`;else if(owned)ctrl=`<button class="btn tiny" data-deco-place="${it.id}">${t2('놓기','Place','放置')}</button>`;else if(coins>=it.cost)ctrl=`<button class="btn tiny buy" data-deco-buy="${it.id}">🪙${it.cost} ${t2('사기','Buy','购买')}</button>`;else ctrl=`<span class="av-badge lock">🔒 🪙${it.cost}</span>`;return `<div class="av-item ${placed?'equipped':''}"><div class="av-prev"><span class="av-emoji">${it.emoji}</span></div><b>${it.name[st.lang]||it.name.en}</b>${ctrl}</div>`;}).join('');
 const clear=placedId?`<button class="btn tiny" data-deco-clear="1">${t2('치우기','Remove','移除')}</button>`:'';
 el.innerHTML=`<div class="tm-backdrop" data-tmx></div><div class="tm-card"><button class="tm-x" data-tmx>×</button><div class="tm-head">🏡 <b>${slot.name[st.lang]||slot.name.en}</b> <span class="tm-coins">🪙 ${coins}</span></div><p class="tm-sub">${t2('코인으로 장식을 사서 이 자리에 놓아요.','Buy a decoration with coins and place it here.','用金币购买装饰放在这里。')}</p><div class="av-grid">${cards}</div><div class="tools center">${clear}</div></div>`;
 el.classList.add('show');
 const close=()=>{el.classList.remove('show');el.innerHTML='';};el.querySelectorAll('[data-tmx]').forEach(b=>b.onclick=close);
 const apply=(id)=>{const it=decoItem(id);GameStore.placeDecoration(profile,slotId,id);if(window.TownGame)TownGame.setDecor(slotId,it?it.emoji:'',it?decorArtUri(it.id):null);save();updateCoinHud();decorationMenu(slotId);};
 el.querySelectorAll('[data-deco-place]').forEach(b=>b.onclick=()=>apply(b.dataset.decoPlace));
 el.querySelectorAll('[data-deco-buy]').forEach(b=>b.onclick=()=>{const it=decoItem(b.dataset.decoBuy);if(it&&GameStore.spendCoins(profile,it.cost)){GameStore.unlockDecoration(profile,it.id);apply(it.id);}else toast(st.lang==='ko'?'코인이 부족해요.':st.lang==='zh'?'金币不够。':'Not enough coins.');});
 const cl=el.querySelector('[data-deco-clear]');if(cl)cl.onclick=()=>{delete profile.town.placedDecorations[slotId];if(window.TownGame)TownGame.setDecor(slotId,'');save();decorationMenu(slotId);};}
// ---- Notice board (공지사항) ----
const NOTICE_SEED=[
 {id:'seed-carsc',pinned:true,author:'Gfield',created_at:'2026-07-07T12:00:00Z',title:'📚 CARS Level C 업데이트 완료!',body:"## 📖 소개\nCARS Level C는 '읽기 전략(Reading Strategies)'을 익히는 초등 중학년 독해 교재예요. 다양한 논픽션 주제를 읽으며 **12가지 핵심 독해 전략**을 하나씩 배웁니다.\n\n## 📊 난이도\n- 대상: **초등 3학년(G3)** 수준\n- 지문과 어휘가 Level B보다 한 단계 높아요\n- 사실 확인부터 **추론·작가 의도**까지 폭넓게 연습해요\n\n## 🧩 구성 (레슨마다 7단계)\n- STEP 1 — 핵심 단어 12개 배우기\n- STEP 2~3 — 원문 지문 읽기 + 문제 풀기\n- STEP 4~5 — 추가 학습 지문 + 문제\n- STEP 6~7 — 새 지문(핵심 어휘 활용) + 문제\n\n## 🌍 10개 레슨 주제\n- 대이동 · 화산 · 꿀벌 · 열대우림 · 태양계\n- 고대 이집트 · 물의 순환 · 제왕나비 · 해양 지대 · 공동체 정원\n\nTextbook Library(교재 도서관)에서 **G3 사다리**로 올라가면 만날 수 있어요. 오늘부터 도전해봐요! 🚀"},
 {id:'seed-welcome',pinned:false,author:'Gfield',created_at:'2026-07-07T00:00:00Z',title:'Gfield Reading Town에 오신 걸 환영해요! 🎉',body:'레고 마을에서 매일 조금씩 읽고, 단어를 배우고, Screen Quest 영상도 즐겨보세요. 열심히 하면 코인을 모아 마을과 캐릭터를 꾸밀 수 있어요!'}
];
function nbDate(s){try{const d=new Date(s);if(isNaN(d.getTime()))return '';const p=n=>('0'+n).slice(-2);return `${d.getFullYear()}.${p(d.getMonth()+1)}.${p(d.getDate())}`;}catch(e){return '';}}
function nbInline(s){return esc(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>');}
function nbFormat(body){if(!body)return '';const lines=String(body).split('\n');let html='',ul=false,pbuf=[];
 const flushP=()=>{if(pbuf.length){html+='<p>'+pbuf.join('<br>')+'</p>';pbuf=[];}};
 const flushUl=()=>{if(ul){html+='</ul>';ul=false;}};
 lines.forEach(ln=>{const s=ln.trim();
  if(!s){flushUl();flushP();return;}
  if(s.slice(0,3)==='## '){flushUl();flushP();html+='<div class="nb-h">'+nbInline(s.slice(3))+'</div>';return;}
  if(s.slice(0,2)==='- '){flushP();if(!ul){html+='<ul>';ul=true;}html+='<li>'+nbInline(s.slice(2))+'</li>';return;}
  flushUl();pbuf.push(nbInline(s));});
 flushUl();flushP();return html;}
function nbRows(){if(noticeCache===null)return null;let rows=Array.isArray(noticeCache)?noticeCache.slice():[];if(!rows.length)rows=NOTICE_SEED.slice();rows.sort((a,b)=>((b.pinned?1:0)-(a.pinned?1:0))||(new Date(b.created_at||0)-new Date(a.created_at||0)));return rows;}
function openNoticeBoard(){townView='notice';noticeCompose=false;noticeCache=null;render();window.scrollTo({top:0});
 const done=rows=>{noticeCache=Array.isArray(rows)?rows:[];if(townView==='notice')render();};
 if(window.Store&&Store.pullNotices)Store.pullNotices().then(done).catch(()=>done([]));else done([]);}
function noticeBoardScreen(){const t=(ko,en,zh)=>st.lang==='ko'?ko:st.lang==='zh'?zh:en;
 const langBtns=['ko','en','zh'].map(l=>`<button data-lang="${l}" class="${st.lang===l?'active':''}">${l==='ko'?'한국어':l==='en'?'English':'中文'}</button>`).join('');
 const rows=nbRows();
 const list=rows===null?`<div class="nb-loading">${t('불러오는 중…','Loading…','加载中…')}</div>`
  :(rows.map(n=>`<article class="nb-card ${n.pinned?'pinned':''}"><div class="nb-top">${n.pinned?`<span class="nb-pin">📌 ${t('공지','Pinned','置顶')}</span>`:''}<h3>${esc(n.title||'')}</h3><time>${nbDate(n.created_at)}</time></div>${n.body?`<div class="nb-body">${nbFormat(n.body)}</div>`:''}<div class="nb-by">— ${esc(n.author||'Gfield')}</div></article>`).join('')||`<div class="nb-empty">${t('아직 공지가 없어요.','No notices yet.','还没有公告。')}</div>`);
 const compose=noticeCompose?`<div class="nb-compose"><input id="nb-title" class="nb-in" maxlength="80" placeholder="${t('제목','Title','标题')}"><textarea id="nb-body" class="nb-in" rows="3" maxlength="1000" placeholder="${t('내용을 입력하세요','Write your message','请输入内容')}"></textarea><div class="nb-compose-btns"><button class="btn primary" data-act="nb-submit">${t('올리기','Post','发布')}</button><button class="btn" data-act="nb-compose">${t('취소','Cancel','取消')}</button></div></div>`:'';
 return `<div class="town notice-board"><div class="town-top"><div class="town-brand">📢 ${t('공지사항','Notices','公告栏')}</div><div class="town-tools"><a class="btn tiny" href="manual.html" target="_blank" rel="noopener">📖 ${t('사용법','How to use','使用说明')}</a><button class="btn tiny" data-act="nb-compose">✏️ ${t('새 공지','New','新公告')}</button><button class="btn tiny" data-act="town-map">← ${t('마을','Town','小镇')}</button><div class="language-toggle town-lang">${langBtns}</div></div></div><div class="nb-wrap">${compose}<div class="nb-list">${list}</div></div></div>`;}
function handleNotice(b){const act=b.dataset.act;
 if(act==='nb-compose'){noticeCompose=!noticeCompose;render();return;}
 if(act==='nb-submit'){const ti=(document.getElementById('nb-title')||{}).value||'';const bd=(document.getElementById('nb-body')||{}).value||'';
  if(!ti.trim()){toast(st.lang==='ko'?'제목을 입력하세요.':st.lang==='zh'?'请输入标题。':'Please enter a title.');return;}
  const rec={title:ti.trim(),body:bd.trim(),author:(currentStudent&&currentStudent.name)||'Gfield',pinned:false,created_at:new Date().toISOString()};
  if(!Array.isArray(noticeCache))noticeCache=[];noticeCache.unshift(rec);noticeCompose=false;render();
  toast(st.lang==='ko'?'공지를 올렸어요!':st.lang==='zh'?'公告已发布！':'Notice posted!');
  if(window.Store&&Store.postNotice)Store.postNotice(rec).then(()=>{if(Store.pullNotices)Store.pullNotices().then(rows=>{if(Array.isArray(rows)){noticeCache=rows;if(townView==='notice')render();}});});
  return;}}
// ---- Screen Quest (weekly video + quiz learning) ----
function sqAvailable(){return !!(window.VIDEO_PLAN&&VIDEO_PLAN.videos);}
function sqLoc(o){return o?(o[st.lang]||o.en||o.ko||''):'';}
function sqT(ko,en,zh){return st.lang==='ko'?ko:st.lang==='zh'?zh:en;}
function sqEnsure(){if(!profile.screenQuest)profile.screenQuest={passed:{}};if(!profile.screenQuest.passed)profile.screenQuest.passed={};return profile.screenQuest;}
function sqArchiveWeeks(){return Array.isArray(window.VIDEO_ARCHIVE)?window.VIDEO_ARCHIVE:[];}
function sqVideo(id){if(sqAvailable()&&VIDEO_PLAN.videos[id])return VIDEO_PLAN.videos[id];for(const p of sqArchiveWeeks()){if(p&&p.videos&&p.videos[id])return p.videos[id];}return null;}
function sqSection(v){const key=v&&v.section;let s=(VIDEO_PLAN.sections||[]).find(x=>x.key===key);if(s)return s;for(const p of sqArchiveWeeks()){s=((p&&p.sections)||[]).find(x=>x.key===key);if(s)return s;}return {emoji:'🎬',color:'#7a5cc3',name:{en:''}};}
function sqPassed(id){return !!(profile.screenQuest&&profile.screenQuest.passed&&profile.screenQuest.passed[id]);}
function sqDayDone(day){return (day.videos||[]).every(id=>sqPassed(id));}
function sqAllVideos(){const out=[];(VIDEO_PLAN.days||[]).forEach(d=>(d.videos||[]).forEach(id=>{if(!out.includes(id))out.push(id);}));return out;}
function sqEmbed(v){const sec=sqSection(v);
 if(v.id){const listp=v.playlist?`&list=${esc(v.playlist)}`:'';return `<div class="sq-embed"><iframe src="https://www.youtube-nocookie.com/embed/${esc(v.id)}?rel=0&modestbranding=1${listp}" title="${esc(sqLoc(v.title))}" allow="encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;}
 if(v.playlist){return `<div class="sq-embed"><iframe src="https://www.youtube-nocookie.com/embed/videoseries?list=${esc(v.playlist)}&rel=0&modestbranding=1" title="${esc(sqLoc(v.title))}" allow="encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;}
 const q=encodeURIComponent(v.search||sqLoc(v.title));
 return `<div class="sq-embed sq-embed-link" style="--sec:${sec.color}"><div class="sq-linkcard"><span class="sq-linkemoji">${sec.emoji}</span><p>${sqT('아직 영상이 연결되지 않았어요. 어른과 함께 유튜브에서 안전하게 찾아 보세요.','No video is linked yet. With a grown-up, find it safely on YouTube.','还没有链接视频，请和大人一起在 YouTube 上安全查找。')}</p><a class="btn primary" href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener noreferrer">▶ ${esc(v.channel)} · ${esc(v.search||'')}</a></div></div>`;}
function screenQuestScreen(){const pts=(window.GameStore?GameStore.coins(profile):(profile&&profile.points)||0);
 const langBtns=['ko','en','zh'].map(l=>`<button data-lang="${l}" class="${st.lang===l?'active':''}">${l==='ko'?'한국어':l==='en'?'English':'中文'}</button>`).join('');
 const name=sqLoc(VIDEO_PLAN.name)||'Screen Quest';
 const header=`<div class="town-top"><div class="town-brand">🎬 ${esc(name)}</div><div class="town-tools"><span class="points-pill">★ ${pts}P</span><button class="btn tiny" data-act="sq-archive">🗂️ ${sqT('자료실','Library','资料库')}</button><button class="btn tiny" data-act="town-map">← ${sqT('마을','Town','小镇')}</button><div class="language-toggle town-lang">${langBtns}</div></div></div>`;
 let body;
 if(sq.view==='archive')body=sqArchiveView();
 else if(sq.view==='quiz')body=sqQuizView();
 else if(sq.view==='result')body=sqResultView();
 else if(sq.view==='watch')body=sqWatchView();
 else if(sq.view==='day')body=sqDayView();
 else body=sqPlanView();
 return `<div class="town screen-quest">${header}${body}</div>`;}
function sqPlanView(){const w=VIDEO_PLAN.week||{};const days=VIDEO_PLAN.days||[];
 const total=sqAllVideos().length,done=sqAllVideos().filter(sqPassed).length;
 const board=days.map(d=>{const done2=(d.videos||[]).filter(sqPassed).length;const full=sqDayDone(d);
  const vids=(d.videos||[]).map(id=>{const v=sqVideo(id);if(!v)return '';const sec=sqSection(v);const p=sqPassed(id);return `<button class="sq-vchip ${p?'done':''}" data-act="sq-video" data-vid="${esc(id)}" style="--sec:${sec.color}"><span class="sq-vemoji">${sec.emoji}</span><span class="sq-vt">${esc(sqLoc(v.title))}</span>${p?'<span class="sq-check">✓</span>':''}</button>`;}).join('');
  return `<section class="sq-day ${full?'done':''}"><div class="sq-day-head"><span class="sq-daybadge">${esc(sqLoc(d.name))}</span><b>${esc(sqLoc(d.focus))}</b><span class="sq-daycount">${done2}/${(d.videos||[]).length}${full?' ✓':''}</span></div><div class="sq-vchips">${vids}</div></section>`;}).join('');
 return `<section class="sq-plan-hero"><div class="sq-week">${esc(sqLoc(w.label))}</div><h1>${esc(sqLoc(w.theme))}</h1><p>${esc(sqLoc(w.note))}</p><div class="sq-progress"><div class="sq-bar"><span style="width:${total?Math.round(done/total*100):0}%"></span></div><em>${sqT('이번 주','This week','本周')} ${done}/${total} ✓</em></div></section><div class="sq-board">${board}</div>`;}
function sqDayView(){const d=(VIDEO_PLAN.days||[]).find(x=>x.key===sq.day);if(!d)return sqPlanView();
 const cards=(d.videos||[]).map(id=>{const v=sqVideo(id);if(!v)return '';const sec=sqSection(v);const p=sqPassed(id);
  const words=(v.keyWords||[]).map(k=>`<span class="sq-kw">${esc(k.en)}<em>${esc(k.ko)}</em></span>`).join('');
  return `<section class="sq-vcard" style="--sec:${sec.color}"><div class="sq-vcard-top"><span class="sq-vemoji big">${sec.emoji}</span><div><div class="sq-vmeta">${esc(sqLoc(sec.name))} · ${esc(v.channel)} · ${v.minutes}${sqT('분','min','分')}</div><h3>${esc(sqLoc(v.title))}</h3></div>${p?'<span class="sq-check big">✓</span>':''}</div><div class="sq-kws">${words}</div><p class="sq-sum">${esc(sqLoc(v.summary))}</p><button class="btn primary big" data-act="sq-video" data-vid="${esc(id)}">${p?sqT('다시 보기','Watch again','再看一次'):sqT('영상 보고 퀴즈 풀기','Watch & Quiz','看视频做题')} →</button></section>`;}).join('');
 return `<div class="sq-sub"><button class="btn" data-act="sq-plan">← ${sqT('주간 플랜','Weekly Plan','周计划')}</button><b>${esc(sqLoc(d.name))} · ${esc(sqLoc(d.focus))}</b></div><div class="sq-vcards">${cards}</div>`;}
function sqWatchView(){const v=sqVideo(sq.vid);if(!v)return sqPlanView();const sec=sqSection(v);
 const words=(v.keyWords||[]).map(k=>`<span class="sq-kw">${esc(k.en)}<em>${esc(k.ko)}</em></span>`).join('');
 const backup=(v.id||v.playlist)?`<a class="sq-backup" href="${v.playlist?`https://www.youtube.com/playlist?list=${encodeURIComponent(v.playlist)}`:`https://www.youtube.com/results?search_query=${encodeURIComponent(v.search||sqLoc(v.title))}`}" target="_blank" rel="noopener noreferrer">🔎 ${v.playlist?sqT('유튜브에서 재생목록 열기','Open the playlist on YouTube','在 YouTube 打开播放列表'):sqT('영상이 안 나오면 여기서 찾기','Video not showing? Find it here','视频看不到？在这里查找')}</a>`:'';
 return `<div class="sq-sub"><button class="btn" data-act="sq-day" data-day="${esc(sq.day||'')}">← ${sqT('뒤로','Back','返回')}</button><b>${sec.emoji} ${esc(sqLoc(v.title))}</b></div>
 <section class="sq-watch" style="--sec:${sec.color}">${sqEmbed(v)}<div class="sq-watch-info"><div class="sq-kws">${words}</div><p class="sq-sum">${esc(sqLoc(v.summary))}</p>${backup}<button class="btn good big" data-act="sq-start-quiz" data-vid="${esc(sq.vid)}">📝 ${sqT('퀴즈 시작 (4문제)','Start Quiz (4 questions)','开始测验（4题）')} →</button></div></section>`;}
function sqQuizView(){const v=sqVideo(sq.vid);if(!v)return sqPlanView();const sec=sqSection(v);const quiz=v.quiz||[];const i=Math.min(sq.qi||0,quiz.length-1);const q=quiz[i];
 const status=(sq.quiz&&sq.quiz.status)||{};const picks=(sq.quiz&&sq.quiz.answers)||{};
 const solved=quiz.filter((_,k)=>status[k]==='correct').length;const allDone=solved===quiz.length;
 const dots=quiz.map((_,k)=>`<button class="sq-dot ${status[k]==='correct'?'ok':''} ${k===i?'cur':''}" data-act="sq-goto" data-i="${k}">${k+1}</button>`).join('');
 const opts=(q.choices||[]).map((c,k)=>{const chosen=picks[i]===k;const isCorrect=status[i]==='correct';const good=isCorrect&&chosen;const bad=chosen&&status[i]==='hint';return `<button class="sq-opt ${good?'good':''} ${bad?'bad':''}" data-act="sq-answer" data-i="${k}" ${isCorrect?'disabled':''}>${esc(c)}</button>`;}).join('');
 let fb='';if(status[i]==='correct')fb=`<div class="sq-fb good"><b>${sqT('정답이에요! 🎉','Correct! 🎉','答对了！🎉')}</b></div>`;
 else if(status[i]==='hint')fb=`<div class="sq-fb hint"><b>${sqT('다시 해볼까요?','Try again?','再试一次？')}</b> ${sqT('힌트','Hint','提示')}: <em>${esc(sqLoc(q.hint))}</em></div>`;
 const navBtns=`<div class="sq-qnav">${i>0?`<button class="btn" data-act="sq-goto" data-i="${i-1}">← ${sqT('이전','Prev','上一题')}</button>`:'<span></span>'}${i<quiz.length-1?`<button class="btn" data-act="sq-goto" data-i="${i+1}">${sqT('다음','Next','下一题')} →</button>`:(allDone?`<button class="btn good big" data-act="sq-finish">${sqT('통과! 결과 보기','Pass! See result','通过！看结果')} →</button>`:`<button class="btn" disabled>${sqT('모두 맞혀야 통과','Solve all to pass','全部答对才通过')}</button>`)}</div>`;
 return `<div class="sq-sub"><button class="btn" data-act="sq-video" data-vid="${esc(sq.vid)}">← ${sqT('영상으로','Video','视频')}</button><b>${sec.emoji} ${esc(sqLoc(v.title))}</b><span class="sq-qscore">${solved}/${quiz.length} ✓</span></div>
 <section class="sq-quiz" style="--sec:${sec.color}"><div class="sq-dots">${dots}</div><div class="sq-strat">${esc(q.strat||'')}</div><h3 class="sq-q">${esc(sqLoc(q.q))}</h3><div class="sq-opts">${opts}</div>${fb}${navBtns}</section>`;}
function sqResultView(){const v=sqVideo(sq.vid);if(!v)return sqPlanView();const sec=sqSection(v);const d=(VIDEO_PLAN.days||[]).find(x=>x.key===sq.day);
 return `<section class="sq-result" style="--sec:${sec.color}"><div class="sq-result-emoji">${sec.emoji}⭐</div><h1>${sqT('참 잘했어요!','Great job!','太棒了！')}</h1><p>${sqT('퀴즈 4문제를 모두 통과했어요.','You passed all 4 quiz questions.','你通过了全部 4 道题。')}</p><div class="sq-reward">★ +${VIDEO_PLAN.points||12}P</div><div class="tools center"><button class="btn primary big" data-act="sq-day" data-day="${esc(sq.day||'')}">${sqT('오늘의 다른 영상','Other video today','今天的另一个视频')} →</button><button class="btn" data-act="sq-plan">${sqT('주간 플랜','Weekly Plan','周计划')}</button></div></section>`;}
function sqArchWeekVideoIds(plan){const out=[];(plan.days||[]).forEach(d=>(d.videos||[]).forEach(id=>{if(!out.includes(id))out.push(id);}));return out;}
function sqArchWeekBlock(plan,isCurrent){const secs=plan.sections||[];const vmap=plan.videos||{};const ids=sqArchWeekVideoIds(plan);
 const groups=secs.map(sec=>{const list=ids.filter(id=>vmap[id]&&vmap[id].section===sec.key);if(!list.length)return '';
  const cards=list.map(id=>{const v=vmap[id];const p=sqPassed(id);return `<button class="sq-arch ${p?'done':''}" data-act="sq-video" data-vid="${esc(id)}" style="--sec:${sec.color}"><span class="sq-vemoji">${sec.emoji}</span><span class="sq-vt">${esc(sqLoc(v.title))}</span>${p?'<span class="sq-check">✓</span>':''}</button>`;}).join('');
  return `<section class="sq-arch-sec"><div class="sq-arch-head" style="--sec:${sec.color}">${sec.emoji} <b>${esc(sqLoc(sec.name))}</b><small>${esc(sec.playlist||'')}</small></div><div class="sq-arch-grid">${cards}</div></section>`;}).join('');
 const w=plan.week||{};const label=sqLoc(w.label);const theme=sqLoc(w.theme);
 return `<div class="sq-week-block${isCurrent?' current':''}"><div class="sq-week-head"><span class="sq-week-label">${esc(label)}</span>${isCurrent?`<span class="sq-week-tag">${sqT('이번 주','This week','本周')}</span>`:''}${theme?`<small>${esc(theme)}</small>`:''}</div>${groups||`<p class="sq-arch-empty">${sqT('영상이 없어요.','No videos.','没有视频。')}</p>`}</div>`;}
function sqArchiveView(){const current=sqArchWeekBlock(VIDEO_PLAN,true);
 const past=sqArchiveWeeks().map(p=>sqArchWeekBlock(p,false)).join('');
 return `<div class="sq-sub"><button class="btn" data-act="sq-plan">← ${sqT('주간 플랜','Weekly Plan','周计划')}</button><b>🗂️ ${sqT('영상 자료실','Video Library','视频资料库')}</b></div><p class="sq-arch-note">${sqT('배운 영상은 주별·섹션별로 여기에 모여요. 지난 주 영상도 언제든 다시 보고 퀴즈를 풀 수 있어요.','Videos are gathered here week by week and by section. You can rewatch and quiz past weeks anytime.','学过的视频按周和分类收藏在这里，往期视频随时可以重看和复习。')}</p>${current}${past}`;}
function enterScreenQuest(){sqEnsure();sq={view:'plan',day:null,vid:null,qi:0};townView='screen';save();render();window.scrollTo({top:0});}
function handleScreenQuest(b){const act=b.dataset.act;sqEnsure();
 if(act==='sq-open'){enterScreenQuest();return;}
 if(act==='sq-plan'){sq.view='plan';render();window.scrollTo({top:0});return;}
 if(act==='sq-archive'){sq.view='archive';render();window.scrollTo({top:0});return;}
 if(act==='sq-day'){sq.day=b.dataset.day||sq.day;sq.view='day';render();window.scrollTo({top:0});return;}
 if(act==='sq-video'){const id=b.dataset.vid;const v=sqVideo(id);if(!v)return;sq.vid=id;const d=(VIDEO_PLAN.days||[]).find(x=>(x.videos||[]).includes(id));sq.day=d?d.key:sq.day;sq.view='watch';render();window.scrollTo({top:0});return;}
 if(act==='sq-start-quiz'){sq.vid=b.dataset.vid||sq.vid;sq.qi=0;sq.quiz={answers:{},status:{}};sq.view='quiz';render();window.scrollTo({top:0});return;}
 if(act==='sq-goto'){sq.qi=Math.max(0,+b.dataset.i||0);render();window.scrollTo({top:0});return;}
 if(act==='sq-answer'){const v=sqVideo(sq.vid);if(!v)return;const quiz=v.quiz||[];const i=Math.min(sq.qi||0,quiz.length-1);const q=quiz[i];sq.quiz=sq.quiz||{answers:{},status:{}};if(sq.quiz.status[i]==='correct')return;const pick=+b.dataset.i;sq.quiz.answers[i]=pick;
  if(pick===q.answer){sq.quiz.status[i]='correct';save();render();const solved=quiz.filter((_,k)=>sq.quiz.status[k]==='correct').length;if(i<quiz.length-1&&solved<quiz.length)setTimeout(()=>{if(sq.view==='quiz'&&sq.qi===i){sq.qi=i+1;render();window.scrollTo({top:0});}},850);}
  else{sq.quiz.status[i]='hint';render();}
  return;}
 if(act==='sq-finish'){const v=sqVideo(sq.vid);if(!v)return;const quiz=v.quiz||[];const allDone=quiz.every((_,k)=>sq.quiz&&sq.quiz.status[k]==='correct');if(!allDone){toast(sqT('아직 다 맞히지 않았어요.','Not all correct yet.','还没全部答对。'));return;}
  if(!sqPassed(sq.vid)){profile.screenQuest.passed[sq.vid]=true;const msg=sqT('스크린 퀘스트 통과','Screen Quest passed','屏幕任务通过');awardPoints(VIDEO_PLAN.points||12,msg);}
  sq.view='result';save();render();window.scrollTo({top:0});return;}
}
function render(){if(!currentStudent){if(!introSeen()){app.innerHTML=introScreen();bindIntro();return;}app.innerHTML=gate();bindGate();return;}
 if(!(atTown&&townView==='game')&&window.TownGame)TownGame.destroy();
 if(atTown){if(townView==='game'&&gameAvailable()){app.innerHTML=gameTownShell();bindGameTown();return;}if(townView==='screen'&&sqAvailable()){app.innerHTML=screenQuestScreen();bind();return;}if(townView==='notice'){app.innerHTML=noticeBoardScreen();bind();return;}if(townView==='diagnostic'){app.innerHTML=diagnosticScreen();bind();return;}if(townView==='parent'){app.innerHTML=parentDashboard();bind();return;}if(townView==='library'){app.innerHTML=libraryScreen();bind();bindLibraryAudio();bindLibraryPdf();return;}if(townView==='writing'){app.innerHTML=writingScreen();bind();bindWritingInputs();return;}app.innerHTML=town();bind();return;}let content=st.view==='home'?home():st.view==='words'?words():(st.view==='originalRead'||st.view==='questions')&&!hasOriginal()?missingOriginal():st.view==='originalRead'?originalRead():st.view==='questions'?questionScreen('original'):st.view==='questionOriginalExtra'?questionScreen('originalExtra'):st.view==='questionSimilar'?questionScreen('similar'):st.view==='review'?questionScreen('review'):st.view==='coach'?coachScreen():st.view==='originalExtra'?originalExtra():st.view==='similar'?extra():report();app.innerHTML=`<div class="shell">${nav()}<main class="main">${top()}${flow()}${content}</main></div>${modal()}`;bind();}
function makeGameChoices(){const w=L.words[st.gameIndex];return [w[1],...L.words.filter((_,i)=>i!==st.gameIndex).sort(()=>Math.random()-.5).slice(0,3).map(x=>x[1])].sort(()=>Math.random()-.5)}
const AUDIO_BASE='https://fgahqumaldheqettmvqg.supabase.co/storage/v1/object/public/audio';
const LIBRARY_IMG_BASE='https://fgahqumaldheqettmvqg.supabase.co/storage/v1/object/public/library-images';
const STORAGE_PUBLIC_BASE='https://fgahqumaldheqettmvqg.supabase.co/storage/v1/object/public';
// Writing Village premium feedback — Edge Function endpoint. The anon key below is
// the same public client key already shipped in store.js; the LLM API key itself
// lives only in the Edge Function's server-side secret.
const WV_AI_URL='https://fgahqumaldheqettmvqg.supabase.co/functions/v1/writing-feedback';
const WV_ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs';
// Voice-over availability guard. If a stored MP3 no longer matches the on-screen
// text, list it here (book → {extra|new|original:true}) and the app falls back to
// on-device TTS, which reads the current text aloud, until the file is re-recorded.
// CARS C extra/new were rewritten 2026-07-08 and the Google-TTS pipeline
// regenerated their voice files the same day, so the map is now empty.
const AUDIO_STALE={};
// passage → Storage file suffix. originalExtra(추가학습)→-extra, extra(새지문)→-new.
function audioFileFor(passage){return passage==='originalExtra'?'extra':passage==='extra'?'new':passage==='original'?'original':null;}
function audioUrlFor(bookId,lessonId,passage){
 const file=audioFileFor(passage);if(!bookId||!file)return null;
 const stale=AUDIO_STALE[bookId];if(stale&&stale[file])return null;   // let TTS read the current text
 return `${AUDIO_BASE}/${bookId}/${lessonId}-${file}.mp3`;}
function speakPassage(passage){
 stopSpeak();
 const source=passage==='extra'?L.extraPassage:passage==='originalExtra'?(L.originalExtraPassage||L.originalPassage):L.originalPassage;
 if(!(source||[]).length)return;
 const text=(source||[]).join('\n\n');
 const run=++st.speechRun;
 const nodes=[...document.querySelectorAll(`.sentence-line[data-passage="${passage}"]`)];
 const bookId=(window.LESSONS&&window.LESSONS[currentLessonId])?window.LESSONS[currentLessonId].bookId:'cars-level-b';
 const audioUrl=audioUrlFor(bookId,currentLessonId,passage);
 if(audioUrl){const el=new Audio(audioUrl);el.playbackRate=Number(st.speed)||1;_audioEl=el;
  // HTML Audio has no word-boundary event like Web Speech's onboundary, so drive the
  // sentence highlight from playback time: map currentTime/duration onto the cumulative
  // character offsets the spans already carry (data-start/-end). Approximate but keeps
  // the same read-along highlight on the real MP3 path, not just the TTS fallback.
  const totalChars=nodes.length?Number(nodes[nodes.length-1].dataset.end)||0:0;let lastHL=null;
  el.ontimeupdate=()=>{if(run!==st.speechRun||!el.duration||!totalChars)return;
   const pos=(el.currentTime/el.duration)*totalChars;
   const cur=nodes.find(n=>pos>=Number(n.dataset.start)&&pos<Number(n.dataset.end));
   if(!cur||cur===lastHL)return;lastHL=cur;nodes.forEach(n=>n.classList.toggle('reading-now',n===cur));cur.scrollIntoView({behavior:'smooth',block:'center'});};
  el.onended=()=>{if(run===st.speechRun){_audioEl=null;document.querySelectorAll('.sentence-line.reading-now').forEach(n=>n.classList.remove('reading-now'));}};
  el.play().catch(()=>{_audioEl=null;speakPassageWSA(text,run,nodes);});return;}
 speakPassageWSA(text,run,nodes);}
function speakPassageWSA(text,run,nodes){if(!('speechSynthesis' in window)){toast(st.lang==='ko'?'이 브라우저는 읽어주기를 지원하지 않아요.':'Speech is not supported in this browser.');return}
 maybeVoiceHelp();
 const u=new SpeechSynthesisUtterance(text);u.lang='en-US';const _v=getBestEnVoice();if(_v){try{u.voice=_v;}catch(e){}}u.rate=Number(st.speed)||1;u.pitch=1;
 let lastHL=null;u.onboundary=(ev)=>{if(run!==st.speechRun)return;const cur=nodes.find(n=>ev.charIndex>=Number(n.dataset.start)&&ev.charIndex<Number(n.dataset.end));if(!cur||cur===lastHL)return;lastHL=cur;nodes.forEach(n=>n.classList.toggle('reading-now',n===cur));cur.scrollIntoView({behavior:'smooth',block:'center'});};
 u.onend=()=>{if(run===st.speechRun)document.querySelectorAll('.sentence-line.reading-now').forEach(n=>n.classList.remove('reading-now'));};
 window.speechSynthesis.speak(u);}
// Speak a list of chunks (usually sentences) one at a time, chaining each on the
// previous one's `onend`. Reading sentence-by-sentence keeps the chosen English
// voice from drifting mid-passage (some engines re-pick a default — often the
// system's Korean voice — partway through a long single utterance) and lets the
// child follow along naturally. Guarded by st.speechRun so stopSpeak() ends it.
function speakChunks(list){
  const synth=window.speechSynthesis; if(!synth) return;
  const chunks=(list||[]).map(s=>String(s).trim()).filter(Boolean);
  if(!chunks.length) return;
  const run=st.speechRun;                 // stopSpeak() already bumped this
  const voice=getBestEnVoice(), rate=Number(st.speed)||1;
  let i=0;
  const next=()=>{
    if(run!==st.speechRun || i>=chunks.length) return;
    const u=new SpeechSynthesisUtterance(chunks[i++]);
    u.lang='en-US'; if(voice){try{u.voice=voice;}catch(e){}} u.rate=rate; u.pitch=1;
    u.onend=()=>{ if(run===st.speechRun) next(); };
    u.onerror=()=>{ if(run===st.speechRun) next(); };
    synth.speak(u);
  };
  next();
}
function speakText(text){
  if(!('speechSynthesis' in window)){toast(st.lang==='ko'?'이 브라우저는 읽어주기를 지원하지 않아요.':'Speech is not supported in this browser.');return}
  stopSpeak();
  maybeVoiceHelp();
  const sentences=splitSentences(String(text||''));
  speakChunks(sentences.length?sentences:[String(text||'')]);
}
// When a Windows PC has NO English TTS voice installed, Windows falls back to its
// Korean voice to read English text — the "한국말로 영어" problem. A webpage can't
// install an OS voice, but it CAN deep-link straight to the Windows "add voices"
// screen via the ms-settings: URI. Show a one-time helper banner in exactly that
// situation (Windows + voices loaded + none are English), with a button that
// opens Windows Speech settings.
function _ttsVoicesLoaded(){const s=window.speechSynthesis;return !!(s&&(s.getVoices()||[]).length>0);}
function _isWindows(){try{return /Windows/i.test((navigator.userAgentData&&navigator.userAgentData.platform)||navigator.platform||navigator.userAgent||'');}catch(e){return /Windows/i.test(navigator.userAgent||'');}}
function maybeVoiceHelp(){
  try{
    if(!_isWindows()) return;                       // ms-settings: only exists on Windows
    if(!_ttsVoicesLoaded()) return;                 // voices not enumerated yet → can't judge
    if(getBestEnVoice()) return;                    // an English voice exists → all good
    if(sessionStorage.getItem('rwVoiceHelpX')) return;
    if(document.getElementById('voice-help')) return;
    const el=document.createElement('div');
    el.id='voice-help';el.className='voice-help';
    const msg=st.lang==='ko'?'이 컴퓨터에 <b>영어 음성</b>이 없어 발음이 한국어처럼 들려요. 영어 음성을 한 번만 추가하면 자연스러워져요.':'This PC has no <b>English voice</b>, so English is read with a Korean voice. Add an English voice once to fix it.';
    const btn=st.lang==='ko'?'영어 음성 설치 열기':'Open voice settings';
    el.innerHTML=`<span class="vh-msg">🔊 ${msg}</span><a class="vh-go" href="ms-settings:speech">${btn}</a><button class="vh-x" aria-label="close">✕</button>`;
    document.body.appendChild(el);
    el.querySelector('.vh-x').onclick=()=>{try{sessionStorage.setItem('rwVoiceHelpX','1');}catch(e){}el.remove();};
  }catch(e){}
}
function stopSpeak(){if(_audioEl){try{_audioEl.pause();}catch(e){}  _audioEl=null;}if('speechSynthesis' in window)window.speechSynthesis.cancel();st.speechRun++;try{document.querySelectorAll('.sentence-line.reading-now').forEach(n=>n.classList.remove('reading-now'));}catch(e){}}
// --- Read with Me (echo reading) for young learners ---
const ECHO_TXT={ko:{ready:'자, 같이 읽어봐요!',your:'이제 따라 읽어요',hear:'다시 듣기',next:'다음',done:'잘 읽었어요!',close:'닫기'},en:{ready:"Let's read together!",your:'Now you read',hear:'Hear it again',next:'Next',done:'Great reading!',close:'Close'},zh:{ready:'我们一起读吧！',your:'现在你来读',hear:'再听一次',next:'下一句',done:'读得真棒！',close:'关闭'}};
let echo={run:0,sentences:[],i:0,timer:null,phase:''};
function stopEchoTimer(){if(echo.timer){clearInterval(echo.timer);echo.timer=null;}}
function passageSentences(key){const src=key==='extra'?L.extraPassage:key==='originalExtra'?(L.originalExtraPassage||L.originalPassage):L.originalPassage;return (src||[]).flatMap(p=>splitSentences(p));}
function _echoAudioUrl(key){return audioUrlFor(currentBookId,currentLessonId,key);}
function stopEchoTimer(){if(echo.timer){clearInterval(echo.timer);echo.timer=null;}}
function _stopEchoAudio(){if(echo._seekInt){clearInterval(echo._seekInt);echo._seekInt=null;}if(echo._audio){try{echo._audio.pause();}catch(e){}}}
function passageSentences(key){const src=key==='extra'?L.extraPassage:key==='originalExtra'?(L.originalExtraPassage||L.originalPassage):L.originalPassage;return (src||[]).flatMap(p=>splitSentences(p));}
function startEcho(key){const sents=passageSentences(key);if(!sents.length)return;_stopEchoAudio();if('speechSynthesis' in window)window.speechSynthesis.cancel();let cum=0;const wordOffsets=sents.map(s=>{const w=s.split(/\s+/).filter(Boolean).length;const start=cum;cum+=w;return{start,words:w};});const url=_echoAudioUrl(key);let audio=null;if(url){audio=new Audio(url);audio.preload='auto';audio.load();}echo={run:(echo.run||0)+1,sentences:sents,i:0,timer:null,phase:'intro',key,_audio:audio,_wordOffsets:wordOffsets,_totalWords:cum,_seekInt:null};buildEchoOverlay();echoIntro();}
function buildEchoOverlay(){const old=document.getElementById('echo-overlay');if(old)old.remove();const g=ECHO_TXT[st.lang]||ECHO_TXT.ko;const el=document.createElement('div');el.id='echo-overlay';el.className='echo-overlay';el.innerHTML=`<button class="echo-x" data-echo="close" aria-label="close">×</button><div class="echo-progress"></div><div class="echo-flash"></div><div class="echo-sentence"></div><div class="echo-phase"></div><div class="echo-ring"><svg viewBox="0 0 120 120"><circle class="ring-bg" cx="60" cy="60" r="52"/><circle class="ring-fg" cx="60" cy="60" r="52"/></svg><span class="echo-count"></span></div><div class="echo-controls"><button class="btn big" data-echo="replay">🔁 ${esc(g.hear)}</button><button class="btn primary big" data-echo="next">${esc(g.next)} →</button></div>`;el.onclick=(e)=>{const b=e.target.closest('[data-echo]');if(!b)return;const a=b.dataset.echo;if(a==='close')echoClose();else if(a==='replay')echoListen(echo.i);else if(a==='next')echoNext();};document.body.appendChild(el);}
function echoEl(sel){const o=document.getElementById('echo-overlay');return o?o.querySelector(sel):null;}
function echoIntro(){const g=ECHO_TXT[st.lang]||ECHO_TXT.ko;const run=echo.run;const f=echoEl('.echo-flash');if(f){f.textContent=g.ready;f.classList.add('show');}const ctl=echoEl('.echo-controls');if(ctl)ctl.style.visibility='hidden';const ring=echoEl('.echo-ring');if(ring)ring.style.visibility='hidden';setTimeout(()=>{if(echo.run!==run)return;const ff=echoEl('.echo-flash');if(ff)ff.classList.remove('show');echoListen(0);},1700);}
function echoListen(i){const run=echo.run;echo.i=i;echo.phase='listen';stopEchoTimer();_stopEchoAudio();if('speechSynthesis' in window)window.speechSynthesis.cancel();const s=echo.sentences[i];const prog=echoEl('.echo-progress');if(prog)prog.textContent=`${i+1} / ${echo.sentences.length}`;const sen=echoEl('.echo-sentence');if(sen){sen.textContent=s;sen.classList.add('reading');}const ph=echoEl('.echo-phase');if(ph)ph.textContent='🔊';const ring=echoEl('.echo-ring');if(ring)ring.style.visibility='hidden';const ctl=echoEl('.echo-controls');if(ctl)ctl.style.visibility='visible';
 const audio=echo._audio;const off=echo._wordOffsets&&echo._wordOffsets[i];const totalW=echo._totalWords||1;
 if(audio&&off){const doPlay=()=>{if(echo.run!==run)return;const dur=audio.duration;const seekTo=(off.start/totalW)*dur;const endAt=((off.start+off.words)/totalW)*dur;audio.playbackRate=Number(st.speed)||1;if(isFinite(seekTo))audio.currentTime=seekTo;let done=false;const fin=()=>{if(done||echo.run!==run||echo.i!==i)return;done=true;_stopEchoAudio();echoRepeat(i);};audio.play().catch(()=>{_stopEchoAudio();echoListenWSA(i,run,s);return;});echo._seekInt=setInterval(()=>{if(audio.currentTime>=endAt-0.05||audio.ended)fin();},80);const est=(off.words/(2.4*(Number(st.speed)||1)))*1000+1500;setTimeout(fin,est+2000);};if(isNaN(audio.duration)||!isFinite(audio.duration)){const onMeta=()=>{doPlay();};audio.addEventListener('loadedmetadata',onMeta,{once:true});if(audio.readyState>=1)doPlay();}else{doPlay();}return;}
 echoListenWSA(i,run,s);}
function echoListenWSA(i,run,s){if(!('speechSynthesis' in window)){echoRepeat(i);return;}const u=new SpeechSynthesisUtterance(s);u.lang='en-US';const _v=getBestEnVoice();if(_v)u.voice=_v;u.rate=Number(st.speed)||1;u.pitch=1.05;let done=false;const fin=()=>{if(done||echo.run!==run||echo.i!==i)return;done=true;echoRepeat(i);};u.onend=fin;const words=s.split(/\s+/).length;const est=words/(2.4*(Number(st.speed)||1))*1000+900;setTimeout(fin,est+1600);window.speechSynthesis.speak(u);}
function echoRepeat(i){const run=echo.run;echo.phase='repeat';const g=ECHO_TXT[st.lang]||ECHO_TXT.ko;const sen=echoEl('.echo-sentence');if(sen)sen.classList.remove('reading');const ph=echoEl('.echo-phase');if(ph)ph.textContent='🎤 '+g.your;const ring=echoEl('.echo-ring');if(ring)ring.style.visibility='visible';const fg=echoEl('.ring-fg');const cnt=echoEl('.echo-count');const circ=2*Math.PI*52;if(fg)fg.style.strokeDasharray=circ;const words=echo.sentences[i].split(/\s+/).length;const total=Math.max(5,Math.min(12,Math.round(words*0.8)));let remain=total;const draw=()=>{if(cnt)cnt.textContent=Math.max(0,remain);if(fg)fg.style.strokeDashoffset=circ*(1-Math.max(0,remain)/total);};draw();stopEchoTimer();echo.timer=setInterval(()=>{if(echo.run!==run){stopEchoTimer();return;}remain--;draw();if(remain<=0){stopEchoTimer();echoNext();}},1000);}
function echoNext(){stopEchoTimer();_stopEchoAudio();if('speechSynthesis' in window)window.speechSynthesis.cancel();const n=echo.i+1;if(n>=echo.sentences.length)echoDone();else echoListen(n);}
function echoDone(){const g=ECHO_TXT[st.lang]||ECHO_TXT.ko;stopEchoTimer();_stopEchoAudio();if('speechSynthesis' in window)window.speechSynthesis.cancel();const sen=echoEl('.echo-sentence');if(sen)sen.textContent='';const ph=echoEl('.echo-phase');if(ph)ph.textContent='';const ring=echoEl('.echo-ring');if(ring)ring.style.visibility='hidden';const f=echoEl('.echo-flash');if(f){f.textContent='⭐ '+g.done;f.classList.add('show');}const ctl=echoEl('.echo-controls');if(ctl){ctl.style.visibility='visible';ctl.innerHTML=`<button class="btn primary big" data-echo="close">${esc(g.close)}</button>`;}}
function echoClose(){echo.run++;stopEchoTimer();_stopEchoAudio();if('speechSynthesis' in window)window.speechSynthesis.cancel();const el=document.getElementById('echo-overlay');if(el)el.remove();}
function focusQuestion(){requestAnimationFrame(()=>{const target=document.querySelector('#question-drawer #question-anchor');if(!target)return;const top=target.getBoundingClientRect().top+window.scrollY-14;window.scrollTo({top:Math.max(0,top),behavior:'auto'});});}
function grade(mode){const list=qs(mode),miss=[];for(let i=0;i<list.length;i++)if(st.answers[mode][i]!==list[i][3])miss.push(i);st[mode]={score:list.length-miss.length,missed:miss};st.modal=null;
 if(st.awarded&&!st.awarded[mode]){const correct=list.length-miss.length,per=mode==='original'?5:3,bonus=miss.length===0?15:0;const rm=({ko:'학습 완료',en:'learned',zh:'学习完成'})[st.lang]||'learned';awardPoints(correct*per+bonus,rm);st.awarded[mode]=true;}
 save();if(mode==='similar')maybeLevelUp();render();setTimeout(()=>{const r=document.getElementById('grade-result');if(!r)return;if(mode==='original'){r.innerHTML=midReport('original');}else{const next=mode==='originalExtra'?'similar':'report';const nextLabel=mode==='originalExtra'?t('similar'):t('reviewReport');r.innerHTML=`<div class="result"><span class="badge">${st[mode].score}/${list.length}</span><h3>${st.lang==='ko'?'채점 완료':'Checked!'}</h3><p>${mode==='originalExtra'?(st.lang==='ko'?'원문 이해를 한 번 더 확인했어요.':'Your extra learning result was saved.'):(st.lang==='ko'?'리포트에서 약점 변화를 확인하세요.':'Review your skill changes in the report.')}</p><button class="btn violet" data-view="${next}">${nextLabel} →</button></div>`;}bind();r.scrollIntoView({behavior:'smooth',block:'start'});},0)}
const STRAT=[
 ['main idea',{ko:['주제 찾기','전체가 아니라 한 부분만 보고 골랐을 수 있어요.','지문 전체가 무엇에 관한 이야기인지 한 문장으로 말해 보기.'],en:['Main Idea','You may have picked one small part, not the whole story.','Say what the whole passage is about in one sentence.'],zh:['找主旨','可能只看了一个细节，而不是整篇。','用一句话说出整篇讲什么。']}],
 ['details',{ko:['사실·세부 찾기','지문에 없거나 다른 곳의 정보를 골랐을 수 있어요.','답의 근거 문장을 지문에서 손가락으로 짚어 보기.'],en:['Facts & Details','You may have chosen information that is not in the passage.','Point to the exact sentence that proves the answer.'],zh:['事实与细节','可能选了文中没有的信息。','在文中指出证明答案的句子。']}],
 ['sequence',{ko:['순서 이해','일이 일어난 순서를 헷갈렸어요.','‘먼저 · 다음 · 마지막’ 신호어를 찾아 표시하기.'],en:['Sequence','The order of events got mixed up.','Look for the first, next, and last signal words.'],zh:['理解顺序','把事情发生的顺序弄混了。','找出“先、然后、最后”等提示词。']}],
 ['cause',{ko:['원인과 결과','무엇이 일어났고 왜 그런지 연결이 흔들렸어요.','‘왜?’라고 묻고 지문에서 이유를 찾기.'],en:['Cause & Effect','The “what happened → why” link was unclear.','Ask “why?” and find the reason in the text.'],zh:['因果关系','“发生了什么→为什么”的联系不清楚。','问“为什么”，在文中找原因。']}],
 ['compar',{ko:['비교와 대조','두 대상의 같은 점과 다른 점을 헷갈렸어요.','두 대상을 나눠 같은 점·다른 점을 적어 보기.'],en:['Compare & Contrast','Likenesses and differences got confused.','List how the two are alike and how they differ.'],zh:['比较与对照','把相同点和不同点弄混了。','分两栏写出相同点和不同点。']}],
 ['prediction',{ko:['예측하기','지문 단서보다 상상으로 골랐을 수 있어요.','지문의 마지막 단서로 다음에 올 일을 짐작하기.'],en:['Prediction','You may have guessed from imagination, not clues.','Use the last clue in the text to predict what happens next.'],zh:['预测','可能凭想象而不是线索来选。','用文中最后的线索来预测。']}],
 ['word meaning',{ko:['문맥 속 낱말 뜻','아는 뜻으로만 보고 문맥을 놓쳤어요.','그 단어 앞뒤 문장을 다시 읽어 보기.'],en:['Word Meaning','You used a familiar meaning, not the one the context needs.','Reread the sentences around the word.'],zh:['词义','只用熟悉的意思，忽略了上下文。','重读该词前后的句子。']}],
 ['inference',{ko:['추론하기','겉으로 안 쓰인 단서를 놓쳤어요.','“지문을 보면 ~일 것이다” 형태로 단서를 연결하기.'],en:['Inference','You missed a clue that was not stated directly.','Connect clues: “the text shows that…”.'],zh:['推理','漏掉了没有明说的线索。','把线索连起来：“文中说明……”。']}],
 ['opinion',{ko:['사실과 의견','사실과 누군가의 생각(의견)을 헷갈렸어요.','‘확인할 수 있나?’로 사실과 의견을 가르기.'],en:['Fact & Opinion','A fact and someone’s opinion got mixed up.','Ask “can it be proven?” to tell them apart.'],zh:['事实与观点','把事实和某人的观点弄混了。','问“能证明吗？”来区分。']}],
 ['purpose',{ko:['글쓴이의 목적','글쓴이가 왜 썼는지 다시 생각해 봐요.','네 가지 이유로 좁혀요 — 설득·정보·묘사·즐거움 중 무엇일까요?'],en:['Author’s Purpose','Rethink why the author wrote this.','Narrow it to four — persuade, inform, describe, or entertain?'],zh:['作者目的','再想想作者为什么写。','缩到四种——说服、信息、描写还是娱乐？']}],
 ['figurative',{ko:['비유 표현','표현을 글자 그대로 받아들였어요.','그 말이 진짜로 뜻하는 바를 풀어 말해 보기.'],en:['Figurative Language','You took the expression literally.','Say what the expression really means.'],zh:['比喻语言','把这个表达按字面理解了。','说出这个表达真正的意思。']}],
 ['make-believe',{ko:['실제와 상상','실제로 가능한지 다시 판단해 봐요.','실제 세상에서 일어날 수 있는지 하나씩 확인하기.'],en:['Real vs Make-believe','Decide again what could really happen.','Check each choice: could it happen in real life?'],zh:['真实与虚构','再判断什么是真实可能的。','逐项判断：现实中会发生吗？']}],
];
function stratInfo(strategy){const key=String(strategy||'').toLowerCase();const lang=st.lang==='zh'?'zh':st.lang==='en'?'en':'ko';for(const [k,tr] of STRAT){if(key.includes(k)){const a=tr[lang]||tr.en;return {n:a[0],m:a[1],t:a[2]};}}const f=({ko:['이 유형','지문을 다시 보며 근거를 찾아요.','지문에서 답의 근거를 찾아 표시하기.'],en:['This skill','Look back at the passage for the best clue.','Find and mark the clue in the passage.'],zh:['这类题','再看文中找依据。','在文中找出并标记线索。']})[lang];return {n:f[0],m:f[1],t:f[2]};}
function midReport(mode){
 const list=qs(mode),missed=st[mode]?.missed||[],total=list.length,correct=total-missed.length;
 const g=({ko:{title:'중간 리포트 · 교재 학습',sub:'몇 개 맞혔나보다, 어디서 어떤 실수를 했는지가 더 중요해요.',strong:'잘한 전략(강점)',weak:'다시 볼 전략(약점)',rec:'추천 학습법',none:'—',good:'모두 맞혔어요! 아주 잘했어요.',wr:'오답 학습',extra:'추가 학습'},en:{title:'Mid Report · Book Study',sub:'What matters is where and how you slipped — not just the count.',strong:'Strengths',weak:'To review',rec:'How to improve',none:'—',good:'All correct! Wonderful.',wr:'Wrong-answer practice',extra:'Extra Learning'},zh:{title:'中间报告 · 教材学习',sub:'重要的是哪里、怎么错，而不只是对了几个。',strong:'强项',weak:'需复习',rec:'学习建议',none:'—',good:'全对！非常棒。',wr:'错题练习',extra:'追加学习'}})[st.lang]||{};
 const strong=[...new Set(list.map((q,i)=>missed.includes(i)?null:stratInfo(q[0]).n).filter(Boolean))];
 const weakRows=missed.map(i=>{const info=stratInfo(list[i][0]);return `<div class="wk"><div class="wk-top"><span class="wk-badge">${i+1}</span><b>${esc(info.n)}</b></div><p class="wk-m">${esc(info.m)}</p></div>`;}).join('');
 const recRows=[...new Set(missed.map(i=>list[i][0]))].map(sn=>{const info=stratInfo(sn);return `<li><b>${esc(info.n)}</b> — ${esc(info.t)}</li>`;}).join('');
 return `<div class="midreport"><div class="mr-head"><span class="mr-orb">${correct}/${total}</span><div><h3>${esc(g.title)}</h3><p>${esc(g.sub)}</p></div></div><div class="mr-cols"><div class="mr-box strong"><h4>💪 ${esc(g.strong)}</h4>${strong.length?`<div class="chips">${strong.map(s=>`<span class="chip">${esc(s)}</span>`).join('')}</div>`:`<p class="mr-none">${esc(g.none)}</p>`}</div><div class="mr-box weak"><h4>🔎 ${esc(g.weak)}</h4>${missed.length?`<div class="wk-list">${weakRows}</div>`:`<p class="mr-none">${esc(g.good)}</p>`}</div></div>${missed.length?`<div class="mr-box rec"><h4>🧭 ${esc(g.rec)}</h4><ul class="rec-list">${recRows}</ul></div>`:''}<div class="tools">${missed.length?`<button class="btn primary" data-act="coach-start">🎯 ${coachT('스킬 코치 (적응형)','Skill Coach (adaptive)','技能教练（自适应）')}</button>`:''}${missed.length?`<button class="btn" data-act="start-wrong-review">🔁 ${esc(g.wr)} (${missed.length})</button>`:''}<button class="btn violet" data-view="originalExtra">${esc(g.extra)} →</button></div></div>`;
}
function reviewSummaryScreen(){
 const total=qs('review').length;let fixed=0;for(let i=0;i<total;i++){if(st.feedback?.review?.[i]?.type==='correct')fixed++;}
 const g=({ko:{t:'오답 학습 완료!',s:`틀렸던 ${total}문제를 다시 풀었고, ${fixed}문제를 스스로 고쳤어요.`,extra:'추가 학습',report:'학습 리포트'},en:{t:'Wrong-answer practice done!',s:`You re-solved ${total} missed question(s) and fixed ${fixed} on your own.`,extra:'Extra Learning',report:'Report'},zh:{t:'错题练习完成！',s:`你重做了 ${total} 道错题，自己改对了 ${fixed} 道。`,extra:'追加学习',report:'学习报告'}})[st.lang]||{};
 return `<div class="work-grid"><section class="card panel review-summary"><div class="section-tag"><i>🔁</i> ${t('wrongReview')}</div><div class="rs-orb">${fixed}/${total}</div><h2>${esc(g.t)}</h2><p class="sub">${esc(g.s)}</p><div class="tools"><button class="btn primary" data-act="start-wrong-review">🔁 ${t('wrongReview')}</button><button class="btn violet" data-view="originalExtra">${esc(g.extra)} →</button><button class="btn" data-view="report">${esc(g.report)}</button></div></section></div>`;
}
// ── Adaptive Skill Coach ────────────────────────────────────────────────────
// After the book questions are graded, the missed strategies drive a targeted,
// adaptive loop: coach the weak strategy → same-strategy practice from the extra
// passage → if still wrong, reveal + a second same-strategy question from the new
// passage → "Level Up!" when the weak skills are cleared. (CLAUDE.md roadmap.)
function coachT(ko,en,zh){return st.lang==='ko'?ko:st.lang==='zh'?zh:en;}
function coachPractice(i){const out=[];
 const qe=(L.originalExtraQuestions||[])[i];if(qe&&qe.length>=4)out.push({q:qe,passage:(L.originalExtraPassage&&L.originalExtraPassage.length?L.originalExtraPassage:L.originalPassage)||[],title:L.originalExtraTitle||L.title||'Extra Learning'});
 const qn=(L.extraQuestions||[])[i];if(qn&&qn.length>=4)out.push({q:qn,passage:(L.extraPassage||[]),title:L.extraTitle||'New Passage'});
 return out;}
function coachQueue(){const missed=(st.original&&st.original.missed)||[];const seen=new Set();const out=[];
 for(const i of missed){const pr=coachPractice(i);if(!pr.length)continue;const sn=String((pr[0].q||[])[0]||i);if(seen.has(sn))continue;seen.add(sn);out.push(i);}
 return out;}
function startCoach(){const queue=coachQueue();
 if(!queue.length){toast(coachT('약점이 없어요 — 아주 잘했어요!','No weak skills — great job!','没有薄弱点，做得好！'));if(st.original){st.view='report';save();render();}return;}
 st.coach={queue,pos:0,phase:'intro',tries:0,picked:null,reveal:false,correctNow:false,result:{},awarded:0,showP:false};st.view='coach';save();render();window.scrollTo({top:0});}
function coachCurrent(){const c=st.coach;if(!c)return null;const i=c.queue[c.pos];const pr=coachPractice(i);const item=pr[c.phase==='q2'?Math.min(1,pr.length-1):0]||pr[0];return {i,pr,item,q:item&&item.q};}
function coachScreen(){const c=st.coach;if(!c){return `<div class="work-grid"><section class="card panel"><p>${coachT('스킬 코치를 불러올 수 없어요.','Skill Coach unavailable.','无法加载技能教练。')}</p></section></div>`;}
 if(c.phase==='done')return coachDoneScreen();
 const cur=coachCurrent();if(!cur||!cur.q){coachAdvance();return coachScreen();}
 const {i,pr,item,q}=cur;const info=stratInfo(q[0]);
 const nStrat=c.queue.length,curN=c.pos+1;
 const dots=c.queue.map((qi,k)=>{const r=c.result[qi];const cls=k<c.pos?(r==='struggled'?'miss':'ok'):(k===c.pos?'cur':'');return `<span class="cch-dot ${cls}"></span>`;}).join('');
 const head=`<div class="cch-head"><div class="section-tag"><i>🎯</i> ${coachT('스킬 코치 · 적응형','Skill Coach · Adaptive','技能教练 · 自适应')}</div><div class="cch-progress"><span class="cch-count">${curN}/${nStrat}</span><div class="cch-dots">${dots}</div></div><button class="btn tiny ghost" data-act="coach-exit">✕ ${coachT('나가기','Exit','退出')}</button></div>`;
 if(c.phase==='intro'){
  return `<div class="work-grid cch-wrap"><section class="card cch-card">${head}
   <div class="cch-intro"><div class="cch-badge">${curN}</div><h2 class="cch-strat">${esc(info.n)}</h2>
   <div class="cch-why"><b>${coachT('왜 어려웠을까요?','Why it was tricky','为什么难')}</b><p>${esc(info.m)}</p></div>
   <div class="cch-tip"><b>💡 ${coachT('이렇게 해봐요','Try this','这样做')}</b><p>${esc(info.t)}</p></div>
   <div class="tools"><button class="btn primary big" data-act="coach-begin">${coachT('연습 문제 풀기','Practice now','开始练习')} →</button></div></div></section></div>`;
 }
 // q1 / q2 — passage + one same-strategy question
 const passage=(item.passage||[]);
 const pBox=passage.length?`<div class="cch-passage ${c.showP?'open':''}"><button class="cch-ptoggle" data-act="coach-togglep">📖 ${c.showP?coachT('지문 접기','Hide passage','收起文章'):coachT('지문 보기','Show passage','查看文章')}</button>${c.showP?`<div class="cch-ptext">${passage.map(p=>`<p>${esc(p)}</p>`).join('')}</div>`:''}</div>`:'';
 const stepLbl=c.phase==='q2'?coachT('다른 지문으로 한 번 더','One more, new passage','换篇文章再来'):coachT('같은 전략, 새 문제','Same skill, new question','同一策略，新题');
 const locked=c.reveal;
 const choices=q[2].map((x,k)=>{const L2=letters[k];let cls='cch-choice';if(locked&&L2===q[3])cls+=' correct';if(c.picked===L2&&L2!==q[3])cls+=' wrong';else if(c.picked===L2)cls+=' picked';return `<button class="${cls}" data-act="coach-answer" data-letter="${L2}" ${locked?'disabled':''}><b>${L2}.</b> ${esc(x)}</button>`;}).join('');
 let fb='',actions='';
 if(c.reveal&&c.correctNow){fb=`<div class="cch-fb good"><b>🎉 ${coachT('정답!','Correct!','答对了！')}</b> ${coachT('이 전략을 잘 해냈어요.','You nailed this skill.','这个策略掌握了。')}</div>`;actions=`<button class="btn primary" data-act="coach-next">${c.pos+1>=nStrat?coachT('결과 보기','See result','查看结果'):coachT('다음 전략','Next skill','下一策略')} →</button>`;}
 else if(c.reveal&&!c.correctNow){const canSecond=c.phase!=='q2'&&pr.length>1;fb=`<div class="cch-fb reveal"><b>${coachT('정답','Answer','答案')}: ${q[3]}</b><p>${esc(q[4]||info.t)}</p>${canSecond?'':`<p class="cch-word">📚 ${coachT('이 전략은 단어 학습을 한 번 더 하면 도움이 돼요.','Reviewing the words will help this skill.','复习单词会有帮助。')}</p>`}</div>`;actions=canSecond?`<button class="btn primary" data-act="coach-second">${coachT('다른 지문으로 다시','Try a new passage','换篇再试')} →</button><button class="btn" data-act="coach-next">${coachT('건너뛰기','Skip','跳过')}</button>`:`<button class="btn primary" data-act="coach-next">${c.pos+1>=nStrat?coachT('결과 보기','See result','查看结果'):coachT('다음 전략','Next skill','下一策略')} →</button>`;}
 else if(c.picked&&c.tries<2){fb=`<div class="cch-fb hint"><b>${coachT('조금 더!','Not yet!','再想想！')}</b> ${esc(learningHint(q))}</div>`;}
 return `<div class="work-grid cch-wrap"><section class="card cch-card">${head}
  <div class="cch-qhead"><span class="cch-chip">${esc(info.n)}</span><span class="cch-step">${stepLbl}</span></div>
  ${pBox}
  <div class="cch-prompt">${esc(q[1])}</div>
  <div class="cch-choices">${choices}</div>
  ${fb}
  <div class="tools">${actions}</div></section></div>`;}
function coachDoneScreen(){const c=st.coach;const mastered=c.mastered||0,partial=c.partial||0,struggled=c.struggled||0;const total=c.queue.length;const cleared=struggled===0;
 const orb=cleared?'🏆':'💪';const title=cleared?coachT('레벨 업! 🎉','Level Up! 🎉','升级啦！🎉'):coachT('한 걸음 성장!','You grew a step!','进步了一点！');
 const sub=cleared?coachT(`약했던 ${total}개 전략을 모두 다시 잡았어요.`,`You reclaimed all ${total} weak skill(s).`,`你重新掌握了全部 ${total} 个薄弱策略。`):coachT(`${mastered+partial}/${total} 전략을 다시 잡았어요. 남은 전략은 단어와 함께 한 번 더!`,`You reclaimed ${mastered+partial}/${total}. Revisit the rest with the words.`,`你重新掌握了 ${mastered+partial}/${total}，其余的配合单词再练。`);
 const coins=c.awarded||0;
 return `<div class="work-grid cch-wrap"><section class="card cch-card cch-done"><div class="cch-doneorb">${orb}</div><h2 class="cch-donetitle">${esc(title)}</h2><p class="cch-donesub">${esc(sub)}</p>
  <div class="cch-tiles"><div class="cch-tile ok"><b>${mastered}</b><small>${coachT('완전 정복','Mastered','完全掌握')}</small></div><div class="cch-tile mid"><b>${partial}</b><small>${coachT('다시 잡음','Recovered','重新掌握')}</small></div><div class="cch-tile low"><b>${struggled}</b><small>${coachT('더 연습','Keep practicing','需再练')}</small></div></div>
  ${coins>0?`<div class="cch-coins">🪙 +${coins}</div>`:''}
  <div class="tools"><button class="btn violet" data-view="report">${coachT('학습 리포트','Report','报告')} →</button>${struggled>0?`<button class="btn" data-act="coach-restart">🔁 ${coachT('다시 코치','Coach again','再教练')}</button>`:`<button class="btn primary" data-act="coach-exit">${coachT('마을로','To Town','回小镇')}</button>`}</div></section></div>`;}
function coachAdvance(){const c=st.coach;if(!c)return;c.pos++;c.phase='intro';c.tries=0;c.picked=null;c.reveal=false;c.correctNow=false;
 if(c.pos>=c.queue.length){finishCoach();return;}
 save();render();window.scrollTo({top:0});}
function finishCoach(){const c=st.coach;let mastered=0,partial=0,struggled=0;
 for(const i of c.queue){const r=c.result[i];if(r==='mastered')mastered++;else if(r==='partial')partial++;else struggled++;}
 const coins=mastered*8+partial*5;
 if(!c.awarded&&coins>0){awardPoints(coins,coachT('스킬 코치','Skill Coach','技能教练'));c.awarded=coins;}
 c.mastered=mastered;c.partial=partial;c.struggled=struggled;c.phase='done';
 st.coachCleared=struggled===0;st.coachStars=Math.min(3,Math.round((mastered+partial)/Math.max(1,c.queue.length)*3));
 save();maybeLevelUp();render();window.scrollTo({top:0});}
function handleCoach(b){const act=b.dataset.act;
 if(act==='coach-start'){startCoach();return;}
 const c=st.coach;if(!c){startCoach();return;}
 if(act==='coach-exit'){st.coach=null;stopSpeak();if(st.original){st.view='report';atTown=false;save();render();}else{goTown();}window.scrollTo({top:0});return;}
 if(act==='coach-togglep'){c.showP=!c.showP;save();render();return;}
 if(act==='coach-begin'){c.phase='q1';c.tries=0;c.picked=null;c.reveal=false;c.correctNow=false;c.showP=false;save();render();return;}
 if(act==='coach-second'){c.phase='q2';c.tries=0;c.picked=null;c.reveal=false;c.correctNow=false;c.showP=false;save();render();return;}
 if(act==='coach-next'){coachAdvance();return;}
 if(act==='coach-restart'){startCoach();return;}
 if(act==='coach-answer'){const cur=coachCurrent();if(!cur||!cur.q||c.reveal)return;const q=cur.q;const letter=b.dataset.letter;c.picked=letter;c.tries=(c.tries||0)+1;
  if(letter===q[3]){const grade=c.phase==='q2'?'partial':'mastered';const prev=c.result[cur.i];c.result[cur.i]=prev==='mastered'?'mastered':grade;c.correctNow=true;c.reveal=true;}
  else if(c.tries>=2){c.reveal=true;c.correctNow=false;if(c.phase==='q2'||coachPractice(cur.i).length<2){if(c.result[cur.i]!=='mastered'&&c.result[cur.i]!=='partial')c.result[cur.i]='struggled';}}
  save();render();return;}
}
// ── Level Up! — a reward for finishing a book level (never a gate) ───────────
function nextLevelBook(bookId){const cat=window.BOOK_CATALOG||[];const cur=cat.find(b=>b.id===bookId);if(!cur)return null;
 const rank=b=>({Starter:0,G1:1,G2:2,G3:3,G4:4,G5:5})[bookBandOf(b)]??3;const cr=rank(cur);
 return cat.filter(b=>b.available&&b.id!==bookId&&rank(b)>cr).sort((a,b)=>rank(a)-rank(b))[0]||null;}
function maybeLevelUp(){if(!profile||!currentBookId)return;const bm=bookMastery(currentBookId);if(!bm.complete)return;
 profile.levelUps=profile.levelUps||{};if(profile.levelUps[currentBookId])return;
 profile.levelUps[currentBookId]=Date.now();
 const cat=(window.BOOK_CATALOG||[]).find(b=>b.id===currentBookId);const nx=nextLevelBook(currentBookId);
 profile.pendingLevelUp={bookId:currentBookId,band:cat?bookBandOf(cat):'',title:cat?`${cat.title} ${cat.subtitle||''}`.trim():'',next:nx?{id:nx.id,label:`${nx.title} ${nx.subtitle||''}`.trim(),band:bookBandOf(nx)}:null};
 awardPoints(50,coachT('레벨 업','Level Up','升级'));save();flushLevelUp();}
function flushLevelUp(){if(!profile||!profile.pendingLevelUp)return;if(document.getElementById('levelup-overlay'))return;
 const p=profile.pendingLevelUp;const T=(ko,en,zh)=>st.lang==='ko'?ko:st.lang==='zh'?zh:en;
 const next=p.next?`<div class="lu-next"><small>${T('다음 레벨은 이렇게 있어요 — 원하면 바로, 아니면 아무 레벨이나 골라도 좋아요','A next level is ready — jump in, or pick any level you like','下一级已就绪，也可自由选择任意级别')}</small><b>${esc(p.next.label)} · ${esc(p.next.band)}</b></div>`:`<div class="lu-next"><b>${T('열린 모든 레벨을 완주했어요! 🎉','You finished every open level! 🎉','已完成所有开放级别！🎉')}</b></div>`;
 const el=document.createElement('div');el.id='levelup-overlay';el.className='lu-backdrop';
 el.innerHTML=`<div class="lu-card"><div class="lu-burst">🏆</div><div class="lu-kicker">LEVEL UP!</div><h2>${esc(p.band)} ${T('레벨 완주!','Level cleared!','级别通关！')}</h2><p class="lu-book">${esc(p.title)}</p><div class="lu-coins">🪙 +50</div>${next}<div class="lu-actions">${p.next?`<button class="btn primary big" id="lu-next">${T('다음 레벨 열기','Open next level','打开下一级')} →</button>`:''}<button class="btn" id="lu-close">${T('닫기','Close','关闭')}</button></div></div>`;
 document.body.appendChild(el);
 const close=()=>{el.remove();if(profile){profile.pendingLevelUp=null;save();}};
 el.querySelector('#lu-close').onclick=close;
 const nx=el.querySelector('#lu-next');if(nx)nx.onclick=()=>{close();if(window.TownGame)TownGame.destroy();atTown=true;showBookShelf();};}
// ── Reading Diagnostic (placement test) ─────────────────────────────────────
// A first-login placement test built on the CARS Plus rule: at a level's 12-item
// test, <6 correct → drop a level, 6–10 → this is the level, 11+ → move up. Each
// question targets one of the 12 strategies (fixed order), so the result doubles
// as a strength/weakness map that seeds a recommended roadmap. Content is created
// (git); no licensed passages are used.
let diag=null;
function diagLevels(){return (window.DIAGNOSTIC&&window.DIAGNOSTIC.levels)||[];}
function diagLevel(id){return diagLevels().find(l=>l&&l.id===id)||null;}
function diagT(ko,en,zh){return st.lang==='ko'?ko:st.lang==='zh'?zh:en;}
// Full CARS ladder, easy→hard. Only levels with loaded content take part in placement.
const DIAG_ORDER=['P','AA','A','B','C','D','E','F','G','H'];
// Levels that already have learning books in the app; others are placement-only (content TBD).
const LEVEL_BOOK={B:'cars-level-b',C:'cars-level-c'};
function bookForLevel(id){return LEVEL_BOOK[id]||null;}
function diagOrderPresent(){return DIAG_ORDER.filter(id=>diagLevel(id));}
function firstLessonOf(bookId){const a=availableLessons(bookId);return (a&&a[0])||'lesson1';}
// Per-count thresholds mirror the CARS rule (12Q: <6 down / 11+ up), scaled for shorter tests.
function diagThresholds(n){if(n>=12)return {up:11,down:6};if(n>=8)return {up:7,down:4};return {up:n,down:3};}
// Placement: returns {verdict:'up'|'fit'|'down', recommend:levelId, capped:bool}
function diagPlacement(levelId,score,n){const order=diagOrderPresent();const idx=order.indexOf(levelId);const th=diagThresholds(n||12);
 if(score>=th.up){const up=order[idx+1]||levelId;return {verdict:'up',recommend:up,capped:!order[idx+1]};}
 if(score<th.down){const dn=order[idx-1]||levelId;return {verdict:'down',recommend:dn,capped:!order[idx-1]};}
 return {verdict:'fit',recommend:levelId,capped:false};}
function startDiagnostic(levelId){const lv=diagLevel(levelId);if(!lv){toast(diagT('진단 콘텐츠를 불러오지 못했어요.','Diagnostic content unavailable.','无法加载测评内容。'));return;}
 diag={phase:'test',levelId,qIndex:0,answers:{},picked:null};atTown=true;townView='diagnostic';render();window.scrollTo({top:0});}
function openDiagnostic(){diag={phase:'intro'};atTown=true;townView='diagnostic';render();window.scrollTo({top:0});}
function diagScore(){const lv=diagLevel(diag.levelId);if(!lv)return {score:0,correct:[],missed:[]};const correct=[],missed=[];
 lv.questions.forEach((q,i)=>{(diag.answers[i]===q[3]?correct:missed).push(i);});return {score:correct.length,correct,missed};}
function finishDiagnostic(){const lv=diagLevel(diag.levelId);const {score,correct,missed}=diagScore();const pl=diagPlacement(diag.levelId,score,lv.questions.length);
 profile.diagnostic={done:true,testedLevel:diag.levelId,score,total:lv.questions.length,recommend:pl.recommend,verdict:pl.verdict,capped:pl.capped,
  strengths:correct.map(i=>lv.questions[i][0]),weaknesses:missed.map(i=>lv.questions[i][0]),at:Date.now()};
 const recBook=bookForLevel(pl.recommend);if(recBook){profile.currentBookId=recBook;currentBookId=recBook;}
 awardPoints(30,diagT('진단 완료','Diagnostic done','测评完成'));diag.phase='result';save();render();window.scrollTo({top:0});}
function diagnosticScreen(){
 if(!diag)diag={phase:'intro'};
 const langBtns=['ko','en','zh'].map(l=>`<button data-lang="${l}" class="${st.lang===l?'active':''}">${l==='ko'?'한국어':l==='en'?'English':'中文'}</button>`).join('');
 const head=`<div class="town-top"><div class="town-brand">🧭 ${diagT('리딩 진단','Reading Check','阅读测评')}</div><div class="town-tools"><div class="language-toggle town-lang">${langBtns}</div></div></div>`;
 let body='';
 if(diag.phase==='intro'){
  const levels=DIAG_ORDER.map(id=>diagLevel(id)).filter(Boolean);
  const cards=levels.map(l=>`<button class="dg-lvl${LEVEL_BOOK[l.id]?' has-book':''}" data-act="diag-start" data-level="${esc(l.id)}"><span class="dg-lvl-badge">${esc(l.id)}</span><b>${diagT('레벨','Level','级别')} ${esc(l.id)}</b><small>${esc(l.grade||'')}</small></button>`).join('');
  body=`<section class="card dg-card"><div class="dg-hero"><div class="dg-orb">🧭</div><h1>${diagT('나의 레벨을 찾아봐요','Find your level','找到你的级别')}</h1><p class="dg-sub">${diagT('짧은 지문 하나를 읽고 문제를 풀면, 딱 맞는 레벨과 강점·약점, 추천 학습 로드맵을 알려줄게요.','Read one short passage and answer the questions — we will find your level, your strengths and weak spots, and a recommended roadmap.','读一篇短文并回答问题——我们会找出你的级别、强弱项和推荐路线。')}</p></div>
   <div class="dg-pick-lab">${diagT('어느 레벨부터 시작할까요? (잘 모르면 아무거나 골라도 돼요 — 결과에 맞춰 조정해 줄게요)','Which level to start? (Not sure? Pick any — we will adjust from your result.)','从哪个级别开始？（不确定就随便选，我们会据结果调整。）')}</div>
   <div class="dg-levels">${cards}</div>
   <p class="dg-legend">${diagT('● = 학습 콘텐츠가 준비된 레벨이에요. 다른 레벨도 진단은 얼마든지 볼 수 있어요.','● = levels with lessons ready. You can still take the check at any level.','● = 已有课程的级别；其他级别也可随时测评。')}</p>
   <div class="tools"><button class="btn ghost" data-act="diag-skip">${diagT('건너뛰고 자유롭게 고르기','Skip — choose freely','跳过，自由选择')}</button></div></section>`;
 } else if(diag.phase==='test'){
  const lv=diagLevel(diag.levelId);const total=lv.questions.length;const i=diag.qIndex;const q=lv.questions[i];const picked=diag.answers[i];
  const dots=lv.questions.map((_,k)=>`<span class="dg-dot ${diag.answers[k]?'done':''} ${k===i?'cur':''}"></span>`).join('');
  const choices=q[2].map((x,k)=>{const L2=letters[k];return `<button class="dg-choice ${picked===L2?'picked':''}" data-act="diag-answer" data-letter="${L2}"><b>${L2}.</b> ${esc(x)}</button>`;}).join('');
  const answered=Object.keys(diag.answers).length;const last=i===total-1;
  body=`<section class="card dg-card"><div class="dg-testtop"><span class="dg-chip">${diagT('레벨','Level','级别')} ${esc(lv.id)} · ${diagT('진단','Check','测评')}</span><span class="dg-count">${i+1}/${total}</span></div><div class="dg-dots">${dots}</div>
   <div class="dg-passage" id="dg-passage">${(lv.passage||[]).map(p=>`<p>${esc(p)}</p>`).join('')}</div>
   <div class="dg-prompt">${esc(q[1])}</div>
   <div class="dg-choices">${choices}</div>
   <div class="dg-nav"><button class="btn" data-act="diag-prev" ${i===0?'disabled':''}>${t('previous')}</button>${last?`<button class="btn primary" data-act="diag-finish" ${answered<total?'disabled':''}>${diagT('결과 보기','See result','查看结果')} (${answered}/${total})</button>`:`<button class="btn primary" data-act="diag-next" ${!picked?'disabled':''}>${t('next')} →</button>`}</div></section>`;
 } else { // result
  const d=profile.diagnostic;const recBook=(window.BOOK_CATALOG||[]).find(b=>b.id===bookForLevel(d.recommend));
  const T=diagT;const vTxt=d.verdict==='fit'?T('딱 맞는 레벨이에요!','This level fits you!','正好合适！'):d.verdict==='up'?(d.capped?T('최고 레벨까지 잘해요! 도전 준비 완료','Top level — ready for a challenge!','已达最高级，可挑战！'):T('한 단계 위 레벨을 추천해요','We recommend the next level up','建议上升一级')):(d.capped?T('기초부터 탄탄히 시작해요','Let us build a strong base','从基础开始'):T('한 단계 아래 레벨을 추천해요','We recommend a level down','建议下降一级'));
  const uniq=a=>[...new Set(a)];
  const strengths=uniq(d.strengths).slice(0,4).map(s=>`<span class="dg-tag good">${esc(stratInfo(s).n)}</span>`).join('')||`<span class="dg-none">—</span>`;
  const weakStrats=uniq(d.weaknesses);
  const weaks=weakStrats.length?weakStrats.slice(0,4).map(s=>`<span class="dg-tag warn">${esc(stratInfo(s).n)}</span>`).join(''):`<span class="dg-none">${T('없어요! 훌륭해요','none — great!','无！很棒')}</span>`;
  const roadmap=weakStrats.slice(0,3).map((s,k)=>`<li><span class="dg-step">${k+1}</span><div><b>${esc(stratInfo(s).n)}</b><small>${esc(stratInfo(s).t)}</small></div></li>`).join('');
  body=`<section class="card dg-card dg-result"><div class="dg-resulthead"><div class="dg-scoreorb">${d.score}<i>/${d.total}</i></div><div><div class="dg-verdict">${esc(vTxt)}</div><h1>${T('추천 레벨','Recommended','推荐级别')}: <span class="dg-reclvl">${esc(d.recommend)}</span></h1><p class="dg-recbook">${recBook?esc((recBook.title+' '+(recBook.subtitle||'')).trim()):T('이 레벨의 학습 콘텐츠는 준비 중이에요 — 가까운 레벨로 시작할 수 있어요','Lessons for this level are coming soon — start at a nearby level','该级别课程即将上线——可从相近级别开始')}</p></div></div>
   <div class="dg-analysis"><div class="dg-anbox"><h3>💪 ${T('강점','Strengths','强项')}</h3><div class="dg-tags">${strengths}</div></div><div class="dg-anbox"><h3>🎯 ${T('먼저 다질 전략','Focus first','先攻克')}</h3><div class="dg-tags">${weaks}</div></div></div>
   ${roadmap?`<div class="dg-roadmap"><h3>🗺 ${T('추천 로드맵','Your roadmap','推荐路线')}</h3><ol class="dg-road">${roadmap}</ol><p class="dg-road-note">${T('추천 레벨의 Lesson 1부터 시작하고, 위 약점 전략은 스킬 코치로 집중 연습해요. 물론 레벨은 언제든 자유롭게 바꿀 수 있어요.','Start at Lesson 1 of your level and drill the weak skills with the Skill Coach. You can change levels anytime.','从推荐级别的第1课开始，用技能教练强化薄弱项。级别随时可改。')}</p></div>`:''}
   <div class="tools"><button class="btn primary big" data-act="diag-go">${T('추천 레벨로 학습 시작','Start learning','开始学习')} →</button>${weakStrats.length?`<button class="btn" data-act="diag-coach">🎯 ${T('약점 전략 바로 연습','Coach my weak skills','马上练弱项')}</button>`:''}${(d.verdict!=='fit'&&!d.capped&&diagLevel(d.recommend))?`<button class="btn" data-act="diag-retest" data-level="${esc(d.recommend)}">↻ ${T('추천 레벨로 다시 진단','Re-test at that level','按推荐级别重测')}</button>`:''}<button class="btn ghost" data-act="diag-town">${T('마을로','To Town','回小镇')}</button></div></section>`;
 }
 return `<div class="town diag-town">${head}<div class="dg-wrap">${body}</div></div>`;
}
// Map a strategy name to the fixed question index within a loaded lesson (index = strategy).
function coachStrategyIndex(name){const key=stratInfo(name).n;const src=L.originalExtraQuestions||L.extraQuestions||[];for(let i=0;i<src.length;i++){if(stratInfo((src[i]||[])[0]||'').n===key)return i;}return -1;}
// Diagnostic → Skill Coach: drill the diagnostic's weak strategies inside a real
// B/C lesson (any owned book has the same 12 strategies), no lesson attempt needed.
function diagToCoach(){const d=profile&&profile.diagnostic;if(!d)return;
 const names=[...new Set(d.weaknesses||[])];
 const bk=bookForLevel(d.recommend)||bookForLevel(d.testedLevel)||currentBookId||'cars-level-b';
 diag=null;openLesson(firstLessonOf(bk),'home');
 const seen=new Set();const queue=[];
 names.forEach(nm=>{const i=coachStrategyIndex(nm);const k=stratInfo(nm).n;if(i>=0&&coachPractice(i).length&&!seen.has(k)){seen.add(k);queue.push(i);}});
 if(!queue.length){toast(diagT('연습할 전략을 찾지 못했어요.','No strategy to practice.','未找到可练习的策略。'));return;}
 st.coach={queue,pos:0,phase:'intro',tries:0,picked:null,reveal:false,correctNow:false,result:{},awarded:0,showP:false,fromDiag:true};st.view='coach';save();render();window.scrollTo({top:0});}
function handleDiag(b){const act=b.dataset.act;if(!diag)diag={phase:'intro'};
 if(act==='diag-coach'){diagToCoach();return;}
 if(act==='diag-open'){openDiagnostic();return;}
 if(act==='diag-skip'||act==='diag-town'){diag=null;atTown=true;townView=landingView();if(profile){profile.diagnostic=profile.diagnostic||{done:false,skipped:true};save();}render();window.scrollTo({top:0});return;}
 if(act==='diag-start'||act==='diag-retest'){startDiagnostic(b.dataset.level);return;}
 if(act==='diag-answer'){diag.answers[diag.qIndex]=b.dataset.letter;diag.picked=b.dataset.letter;render();return;}
 if(act==='diag-next'){const lv=diagLevel(diag.levelId);diag.qIndex=Math.min(lv.questions.length-1,diag.qIndex+1);diag.picked=diag.answers[diag.qIndex]||null;render();window.scrollTo({top:0});return;}
 if(act==='diag-prev'){diag.qIndex=Math.max(0,diag.qIndex-1);diag.picked=diag.answers[diag.qIndex]||null;render();window.scrollTo({top:0});return;}
 if(act==='diag-finish'){finishDiagnostic();return;}
 if(act==='diag-go'){const bk=bookForLevel(profile.diagnostic.recommend);diag=null;if(bk){currentBookId=bk;if(profile)profile.currentBookId=bk;openLesson(firstLessonOf(bk),'home');}else{atTown=true;if(window.TownGame)TownGame.destroy();showBookShelf();toast(diagT('추천 레벨은 준비 중이에요. 원하는 책을 골라보세요!','That level is coming soon — pick any book!','该级别即将上线，先选一本吧！'));}return;}
}
function toast(msg){const el=document.createElement('div');el.className='toast';el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),2200)}
function printStudy(passage){
 const cfg=passage==='original'?{text:L.originalPassage,questions:L.originalQuestions,title:L.title||'My Backyard Zoo'}:passage==='originalExtra'?{text:L.originalExtraPassage||L.originalPassage,questions:L.originalExtraQuestions||L.originalQuestions,title:(L.originalExtraTitle||L.title||'Extra Learning')}:{text:L.extraPassage||[],questions:L.extraQuestions||[],title:L.extraTitle||'New Passage'};
 const artUrl=new URL(L.image||'assets/images/cars-level-b/lesson-01-my-backyard-zoo.png',window.location.href).href;
 const html=`<!doctype html><html><head><meta charset="utf-8"><title>${cfg.title}</title><style>@page{size:A4;margin:15mm}body{font-family:Arial,sans-serif;color:#111;font-size:11pt;line-height:1.45}.page{break-after:page;min-height:250mm}.page:last-child{break-after:auto}h1{font-size:22pt;margin:0 0 5mm}.meta{margin:0 0 7mm}.print-art{display:block;max-width:100%;max-height:72mm;margin:0 auto 7mm;object-fit:contain}.passage p{margin:0 0 4mm}.q{break-inside:avoid;margin:0 0 5mm}.q b{display:block;margin-bottom:2mm}.choice{margin-left:4mm}</style></head><body><section class="page"><h1>${esc(cfg.title)}</h1><div class="meta">Name: ____________________　Date: ____________________</div><img class="print-art" src="${artUrl}" alt="Lesson illustration"><div class="passage">${cfg.text.map(x=>`<p>${esc(x)}</p>`).join('')}</div></section><section class="page">${cfg.questions.slice(0,6).map((q,i)=>`<div class="q"><b>${i+1}. ${esc(q[1])}</b>${q[2].map((c,j)=>`<div class="choice">${letters[j]}. ${esc(c)}</div>`).join('')}</div>`).join('')}</section><section class="page">${cfg.questions.slice(6,12).map((q,i)=>`<div class="q"><b>${i+7}. ${esc(q[1])}</b>${q[2].map((c,j)=>`<div class="choice">${letters[j]}. ${esc(c)}</div>`).join('')}</div>`).join('')}<p style="margin-top:10mm">Answers: 1 ___ 2 ___ 3 ___ 4 ___ 5 ___ 6 ___ 7 ___ 8 ___ 9 ___ 10 ___ 11 ___ 12 ___</p></section></body></html>`;
 const w=window.open('','_blank');if(!w){toast('Pop-up was blocked.');return}w.document.write(html);w.document.close();w.focus();setTimeout(()=>w.print(),500)
}
function bind(){app.onclick=(e)=>{const b=e.target.closest('button');if(!b)return;const view=b.dataset.view;if(view){setView(view);return}if(b.dataset.lang){st.lang=b.dataset.lang;save();render();return}if(b.dataset.wordmode){st.wordMode=b.dataset.wordmode;st.view='words';save();render();return}if(b.dataset.answer){const mode=st.qMode;const current=st.qIndex[mode];const picked=b.dataset.answer;const q=qs(mode)[current];const total=qs(mode).length;if(isLearningMode(mode)){st.attempts[mode]=st.attempts[mode]||{};st.feedback[mode]=st.feedback[mode]||{};const tries=Number(st.attempts[mode][current]||0)+1;st.attempts[mode][current]=tries;if(picked===q[3]){st.answers[mode][current]=picked;delete st.skipped[mode]?.[current];st.feedback[mode][current]={type:'correct'};save();render();focusQuestion(mode);if(current<total-1)setTimeout(()=>{if(st.qIndex[mode]===current){st.qIndex[mode]=current+1;save();render();focusQuestion(mode)}},800);}else if(tries>=2){st.answers[mode][current]=picked;delete st.skipped[mode]?.[current];st.feedback[mode][current]={type:'reveal'};save();render();focusQuestion(mode);}else{st.feedback[mode][current]={type:'hint',text:learningHint(q),last:picked};save();render();focusQuestion(mode);}return;}st.answers[mode][current]=picked;delete st.skipped[mode]?.[current];if(current<total-1)st.qIndex[mode]=current+1;save();render();if(current<total-1)focusQuestion(mode);return}if(b.dataset.game){if(st.gameStatus==='correct'||st.gameStatus==='reveal')return;const gw=L.words[st.gameIndex];const correct=gw[1];const picked=b.dataset.game;if(picked===correct){if((st.gameTries||0)===0)st.gameScore++;st.gameStatus='correct';st.gameHintOpen=false;save();render();const gi=st.gameIndex;setTimeout(()=>{if(st.gameIndex===gi&&st.gameStatus==='correct')advanceGame();},950);}else{st.gameTries=(st.gameTries||0)+1;st.gameWrongPick=picked;if(st.gameTries>=2){st.gameStatus='reveal';}else{st.gameStatus='hint';st.gameHintOpen=true;}save();render();}return}const act=b.dataset.act;if(!act)return;if(act.slice(0,3)==='sq-'){handleScreenQuest(b);return;}if(act.slice(0,6)==='coach-'){handleCoach(b);return;}if(act.slice(0,5)==='diag-'){handleDiag(b);return;}if(act.slice(0,4)==='lib-'){if(townView==='writing'&&act==='lib-back'){stopSpeak();wv=null;atTown=true;townView=landingView();render();window.scrollTo({top:0});return;}handleLibrary(b);return;}if(act.slice(0,3)==='wv-'){handleWriting(b);return;}if(act.slice(0,3)==='nb-'){handleNotice(b);return;}if(act==='town-notice'){openNoticeBoard();return;}if(act.slice(0,3)==='td-'||act==='cz-mode'){handleTownCustomize(b);return;}const mode=b.dataset.mode||st.qMode;if(act==='known'){const w=L.words[+b.dataset.i][0];st.known[w]=!st.known[w];if(!st.awarded.words&&Object.keys(st.known).filter(k=>st.known[k]).length>=(L.words||[]).length){const rm=({ko:'단어 완성',en:'words learned',zh:'单词完成'})[st.lang]||'words learned';awardPoints(20,rm);st.awarded.words=true;}save();render()}else if(act==='word-speak'){speakText(L.words[+b.dataset.i][0],0,'word')}else if(act==='flip'){st.flipped=!st.flipped;save();render()}else if(act==='mem-prev'){st.wordIndex=Math.max(0,st.wordIndex-1);st.flipped=false;save();render()}else if(act==='mem-next'){st.wordIndex=Math.min(11,st.wordIndex+1);st.flipped=false;save();render()}else if(act==='restart-game'){st.gameIndex=0;st.gameScore=0;st.gameDone=false;st.gameStatus='';st.gameTries=0;st.gameWrongPick='';st.gameHintOpen=false;st.gameChoices=makeGameChoices();save();render()}else if(act==='game-hint'){st.gameHintOpen=!st.gameHintOpen;save();render()}else if(act==='game-show-answer'){st.gameStatus='reveal';save();render()}else if(act==='game-next'){advanceGame()}else if(act==='save-word'){toggleSaveWord(L.words[+b.dataset.i],{type:'textbook',bookId:currentBookId,lessonId:currentLessonId});render()}else if(act==='save-word-game'){toggleSaveWord(L.words[st.gameIndex],{type:'textbook',bookId:currentBookId,lessonId:currentLessonId});render()}else if(act==='myword-speak'){const mw=myWordsList()[+b.dataset.i];if(mw)speakText(mw.en)}else if(act==='myword-remove'){const list=(profile&&profile.myWords)||[];list.splice(+b.dataset.i,1);save();render()}else if(act==='open-original-questions'){st.view='originalRead';st.qMode='original';st.questionOpen=true;save();render();setTimeout(()=>document.getElementById('question-drawer')?.scrollIntoView({behavior:'smooth'}),20)}else if(act==='q-prev'){st.qIndex[mode]=Math.max(0,st.qIndex[mode]-1);save();render();focusQuestion(mode)}else if(act==='q-next'||act==='q-skip'){const cur=st.qIndex[mode];if(act==='q-next'&&!st.answers[mode][cur]&&st.feedback?.[mode]?.[cur]?.type!=='reveal'){toast(t('selectAnswer'));return}if(act==='q-skip'&&!st.answers[mode][cur]){st.skipped[mode]=st.skipped[mode]||{};st.skipped[mode][cur]=true}st.qIndex[mode]=Math.min(qs(mode).length-1,st.qIndex[mode]+1);save();render();focusQuestion(mode)}else if(act==='go-q'){st.qIndex[mode]=+b.dataset.i;save();render();focusQuestion(mode)}else if(act==='attempt-grade'){const unanswered=Array.from({length:qs(mode).length},(_,i)=>i).filter(i=>!st.answers[mode][i]);if(unanswered.length){st.modal={mode};save();render()}else grade(mode)}else if(act==='grade-anyway'){grade(mode)}else if(act==='close-modal'){st.modal=null;save();render()}else if(act==='go-q-modal'){st.qIndex[mode]=+b.dataset.i;st.modal=null;save();render();focusQuestion(mode)}else if(act==='show-answer'){const idx=st.qIndex[mode];st.feedback[mode]=st.feedback[mode]||{};const last=st.feedback[mode][idx]?.last;if(last&&!st.answers[mode][idx]){st.answers[mode][idx]=last;delete st.skipped[mode]?.[idx];}st.feedback[mode][idx]={type:'reveal'};save();render();focusQuestion(mode)}else if(act==='start-original-extra'){st.qMode='originalExtra';st.qIndex.originalExtra=0;st.view='questionOriginalExtra';save();render();focusQuestion('originalExtra')}else if(act==='start-extra'){st.qMode='similar';st.qIndex.similar=0;st.view='questionSimilar';save();render();focusQuestion('similar')}else if(act==='retry-similar'){st.qMode='similar';st.qIndex.similar=st.similar?.missed?.[0]??0;st.view='questionSimilar';save();render()}else if(act==='start-wrong-review'){st.qMode='review';st.qIndex.review=0;st.answers.review={};st.skipped.review={};st.attempts.review={};st.feedback.review={};st.reviewComplete=false;st.view='review';save();render();focusQuestion('review')}else if(act==='finish-review'){const rtotal=qs('review').length;let fixed=0;for(let i=0;i<rtotal;i++){if(st.feedback?.review?.[i]?.type==='correct')fixed++;}const already=st.awarded?.review||0,delta=Math.max(0,fixed-already);if(delta>0){const rm=({ko:'오답 고침',en:'fixed',zh:'改对错题'})[st.lang]||'fixed';awardPoints(delta*8,rm);st.awarded.review=fixed;}st.reviewComplete=true;save();render();window.scrollTo({top:0})}else if(act==='toggle-passage'){const p=b.dataset.passage;st.passageHidden[p]=!st.passageHidden[p];save();render();if(!st.passageHidden[p])setTimeout(()=>document.getElementById('question-drawer')?.scrollIntoView({block:'start'}),20)}else if(act==='print-study'){printStudy(b.dataset.passage||'original')}else if(act==='listen-all'){speakPassage(b.dataset.passage||'original')}else if(act==='echo-read'){startEcho(b.dataset.passage||'original')}else if(act==='stop'){stopSpeak()}else if(act==='switch-student'){switchStudent()}else if(act==='open-lesson'){openLesson(b.dataset.lesson)}else if(act==='switch-book'){currentBookId=b.dataset.book;if(profile)profile.currentBookId=currentBookId;save();render();}else if(act==='go-town'){goTown()}else if(act==='av-pick'){ensureAvatar(profile);const p=(window.AVATAR.presets||[]).find(x=>x.id===b.dataset.preset);if(p){profile.avatar.equipped={...profile.avatar.equipped,...p.look};profile.avatar.picked=true;save();render()}}else if(act==='av-pick-done'){ensureAvatar(profile);profile.avatar.picked=true;const firstTime=!(profile.diagnostic&&(profile.diagnostic.done||profile.diagnostic.skipped));if(firstTime&&diagLevels().length){diag={phase:'intro'};townView='diagnostic';}else{townView=landingView();}save();render();window.scrollTo({top:0})}else if(act==='resume-lesson'){openLesson(lastStudiedLesson())}else if(act==='town-closet'){townView='closet';render();window.scrollTo({top:0})}else if(act==='town-map'){townView='map';render();window.scrollTo({top:0})}else if(act==='parent-open'){townView='parent';render();window.scrollTo({top:0})}else if(act==='town-list'){townView='map';render();window.scrollTo({top:0})}else if(act==='town-game'){townView='game';render();window.scrollTo({top:0})}else if(act==='av-tab'){avTab=b.dataset.cat;render()}else if(act==='av-equip'){ensureAvatar(profile);profile.avatar.equipped[b.dataset.cat]=b.dataset.id;save();render()}else if(act==='av-buy'){ensureAvatar(profile);const it=avItem(b.dataset.cat,b.dataset.id);const canPay=window.GameStore?GameStore.spendCoins(profile,it?it.cost:0):((profile.points||0)>=(it?it.cost:0)&&(profile.points-=it.cost,true));if(it&&canPay){const key=b.dataset.cat+':'+b.dataset.id;if(!profile.avatar.owned.includes(key))profile.avatar.owned.push(key);profile.avatar.equipped[b.dataset.cat]=b.dataset.id;save();render();toast(st.lang==='ko'?'새 아이템을 얻었어요!':st.lang==='zh'?'获得新装扮！':'New item unlocked!')}else{toast(st.lang==='ko'?'포인트가 부족해요.':st.lang==='zh'?'积分不够。':'Not enough points.')}}else if(act==='q-skip'){}else if(b.dataset.answer){st.answers[mode][st.qIndex[mode]]=b.dataset.answer;save();render()}else if(b.dataset.game){if(b.dataset.game===L.words[st.gameIndex][1])st.gameScore++;st.gameIndex++;if(st.gameIndex>=12)st.gameDone=true;st.gameChoices=st.gameDone?[]:makeGameChoices();save();render()}};
app.onchange=(e)=>{if(e.target.matches('[data-act="speed"]')){st.speed=Number(e.target.value);save();toast(st.lang==='ko'?'읽기 속도를 바꿨어요.':'Speed updated.')}}}
// Soft deterrents against casual copying of licensed content (not real
// security — a determined user can still bypass these).
function installGuards(){try{
 document.addEventListener('contextmenu',e=>e.preventDefault());
 document.addEventListener('dragstart',e=>{if(e.target&&e.target.tagName==='IMG')e.preventDefault();});
 document.addEventListener('keydown',e=>{const k=e.key||'';
  if(k==='F12'){e.preventDefault();return;}
  if((e.ctrlKey||e.metaKey)&&e.shiftKey&&/^[ijc]$/i.test(k)){e.preventDefault();return;}
  if((e.ctrlKey||e.metaKey)&&/^[us]$/i.test(k)){e.preventDefault();return;}
  if((e.ctrlKey||e.metaKey)&&/^p$/i.test(k)){e.preventDefault();if(lib&&lib.view==='book')toast(st.lang==='ko'?'인쇄는 지원하지 않아요.':st.lang==='zh'?'不支持打印。':'Printing is not available.');return;}
  if(k==='PrintScreen'){try{navigator.clipboard&&navigator.clipboard.writeText(' ');}catch(_){}}
 },true);
 window.addEventListener('beforeprint',e=>{if(lib&&lib.view==='book'){toast(st.lang==='ko'?'인쇄는 지원하지 않아요.':st.lang==='zh'?'不支持打印。':'Printing is not available.');}});
}catch(_){}}
installGuards();
boot();
})();
