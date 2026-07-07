(()=>{
'use strict';
const app=document.getElementById('app');
// Pick best English voice once and reuse — prefers Google/natural voices over robotic fallbacks
let _enVoice=null;
let _audioEl=null;
function getBestEnVoice(){
  if(_enVoice)return _enVoice;
  const all=window.speechSynthesis?window.speechSynthesis.getVoices():[];
  const en=all.filter(v=>v.lang.startsWith('en'));
  // Priority: Google US > Google > any en-US local > any en-US > any en
  _enVoice=en.find(v=>v.name==='Google US English')
    ||en.find(v=>/google/i.test(v.name)&&v.lang==='en-US')
    ||en.find(v=>/google/i.test(v.name))
    ||en.find(v=>v.lang==='en-US'&&v.localService)
    ||en.find(v=>v.lang==='en-US')
    ||en[0]||null;
  return _enVoice;
}
if(window.speechSynthesis)window.speechSynthesis.onvoiceschanged=()=>{_enVoice=null;getBestEnVoice();};
const letters=['A','B','C','D'];
const LESSON1_ZH={zoo:'动物园',squirrels:'松鼠',robins:'知更鸟',cages:'笼子',crickets:'蟋蟀',chipmunks:'花栗鼠',moths:'飞蛾',fireflies:'萤火虫',skunks:'臭鼬',free:'免费的', 'pulling your leg':'开玩笑 / 骗你', 'shoo away':'赶走'};
// --- multi-lesson engine ---
let L={};                 // current runtime lesson (kept in the same shape the views expect)
let currentLessonId='lesson1';
let currentBookId='cars-level-b';
let originalReqRun=0;      // guards async original fetches when switching lessons
function availableLessons(bookId){const bid=bookId||currentBookId;if(bid==='cars-level-b'){const list=['lesson1'];Object.keys(window.LESSONS||{}).filter(id=>{const r=window.LESSONS[id];return(r.bookId||'cars-level-b')==='cars-level-b';}).sort((a,b)=>lessonNum(a)-lessonNum(b)).forEach(id=>{if(!list.includes(id))list.push(id);});return list;}return Object.keys(window.LESSONS||{}).filter(id=>{const r=window.LESSONS[id];return r.bookId===bid;}).sort((a,b)=>lessonNum(a)-lessonNum(b));}
function availableBooks(){const books=new Map();books.set('cars-level-b',{id:'cars-level-b',title:'CARS · Level B',shortLabel:'Level B'});Object.values(window.LESSONS||{}).forEach(r=>{const bid=r.bookId||'cars-level-b';if(!books.has(bid)){const lvl=r.levelId||bid.split('-').pop().toUpperCase();books.set(bid,{id:bid,title:`CARS · Level ${lvl}`,shortLabel:`Level ${lvl}`});}});return[...books.values()];}
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
function toggleSaveWord(w){if(!profile||!w)return;profile.myWords=profile.myWords||[];const i=profile.myWords.findIndex(x=>x.en===w[0]);if(i>=0){profile.myWords.splice(i,1);}else{profile.myWords.push({en:w[0],def:w[1],ko:w[2]||'',zh:(L._zh&&L._zh[w[0]])||w[1],lessonId:currentLessonId});}save();}
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
let townView='map';    // 'map' | 'closet' | 'game' | 'pick' | 'screen'
let avTab='hat';       // active category in the closet
let sq={view:'plan',day:null,vid:null,qi:0};  // Screen Quest navigation state
let customizeMode='avatar';  // 'avatar' | 'town' inside the 꾸미기 screen
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
function renderAvatar(eq,size,ropts){eq=eq||avEquipped();size=size||120;const noBg=ropts&&ropts.noBg;
 const bg=avItem('background',eq.background)||avItem('background','meadow');const clo=avItem('clothes',eq.clothes)||avItem('clothes','blue');
 const skin=(avItem('skin',eq.skin)||{}).fill||'#ffd9ad';const hairC=(avItem('haircolor',eq.haircolor)||{}).fill||'#6b4326';const hair=hairPaths(eq.hair||'short',hairC);
 const hat=avItem('hat',eq.hat),gl=avItem('glasses',eq.glasses),pet=avItem('pet',eq.pet);
 const stars=bg&&bg.stars?Array.from({length:10},(_,i)=>`<circle cx="${(i*17+9)%112+4}" cy="${(i*29+8)%64+6}" r="${i%3?1:1.6}" fill="#fff" opacity=".85"/>`).join(''):'';
 const eyes=(gl&&gl.emoji)?'':`<ellipse cx="52" cy="53" rx="3" ry="4" fill="#3a4256"/><ellipse cx="68" cy="53" rx="3" ry="4" fill="#3a4256"/><circle cx="53.1" cy="51.4" r="1" fill="#fff"/><circle cx="69.1" cy="51.4" r="1" fill="#fff"/>`;
 const glT=(gl&&gl.emoji)?`<text x="60" y="56" font-size="19" text-anchor="middle">${gl.emoji}</text>`:'';
 const hatT=(hat&&hat.emoji)?`<text x="60" y="33" font-size="29" text-anchor="middle">${hat.emoji}</text>`:'';
 const petT=(pet&&pet.emoji)?`<text x="98" y="113" font-size="25" text-anchor="middle">${pet.emoji}</text>`:'';
 return `<svg xmlns="http://www.w3.org/2000/svg" class="avatar-svg" viewBox="0 0 120 120" width="${size}" height="${size}" role="img" aria-label="avatar"><defs><linearGradient id="av_sunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffd39b"/><stop offset="1" stop-color="#ff9a9e"/></linearGradient></defs>${noBg?'':`<rect x="0" y="0" width="120" height="120" rx="20" fill="${bg?bg.fill:'#dff5e1'}"/>${stars}`}${hair.back}<path d="M40,86 Q60,76 80,86 L83,113 Q83,118 77,118 L43,118 Q37,118 37,113 Z" fill="${clo?clo.fill:'#6db3f2'}"/><circle cx="38" cy="100" r="6" fill="${skin}"/><circle cx="82" cy="100" r="6" fill="${skin}"/><circle cx="46" cy="54" r="4" fill="${skin}"/><circle cx="74" cy="54" r="4" fill="${skin}"/><circle cx="60" cy="52" r="24" fill="${skin}"/>${hair.front}${eyes}<circle cx="47" cy="61" r="3.6" fill="#ff9aa2" opacity=".45"/><circle cx="73" cy="61" r="3.6" fill="#ff9aa2" opacity=".45"/><path d="M53,62 Q60,69 67,62" fill="none" stroke="#3a4256" stroke-width="2.4" stroke-linecap="round"/>${glT}${hatT}${petT}</svg>`;}
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
const reviewQuestions=()=>(st.original?.missed||[]).map(i=>L.originalQuestions[i]).filter(Boolean);
const qs=(mode)=>mode==='original'?L.originalQuestions:mode==='originalExtra'?L.originalExtraQuestions:mode==='review'?reviewQuestions():L.extraQuestions;
const isLearningMode=(mode)=>mode==='originalExtra'||mode==='similar'||mode==='review';
function learningHint(q){const s=String(q[0]||'').toLowerCase(); if(s.includes('main idea')) return 'Think about the whole passage, not just one small detail.'; if(s.includes('sequence')) return 'Look for what happened first, next, and last.'; if(s.includes('cause')) return 'Ask: what happened, and why did it happen?'; if(s.includes('compare')) return 'Look for one way the two things are alike or different.'; if(s.includes('prediction')) return 'Use a clue from the passage to think about what may happen next.'; if(s.includes('word meaning')) return 'Read the words around it. What does the word mean here?'; if(s.includes('inference')) return 'The answer may not be written exactly. Use clues from the passage.'; if(s.includes('fact')) return 'Ask: can this be proved, or is it what someone thinks?'; if(s.includes('purpose')) return 'Think about why the writer told this story.'; if(s.includes('figurative')) return 'This expression may mean something different from the exact words.'; return 'Look back at the passage and find the best clue.';}
function learningFeedback(mode,idx,q){if(!isLearningMode(mode))return '';const f=st.feedback?.[mode]?.[idx]; if(!f)return ''; if(f.type==='correct')return `<div class="learn-feedback good"><b>Great!</b> You found the best answer. <span>Moving on…</span></div>`; if(f.type==='hint')return `<div class="learn-feedback hint"><b>Not yet.</b> ${esc(f.text)}<div><button class="btn tiny" data-act="show-answer" data-mode="${mode}">Show Answer</button></div></div>`; return `<div class="learn-feedback reveal"><b>Answer: ${esc(q[3])}</b><br>${esc(q[4]||'')}</div>`;}
function setView(view){stopSpeak();st.view=view; if(view==='questions')st.qMode='original'; if(view==='originalExtra')st.qMode='originalExtra'; if(view==='similar')st.qMode='similar';save();render();window.scrollTo({top:0,behavior:'smooth'});}
function status(mode){const total=qs(mode).length||12,a=st.answers[mode]||{},answered=Object.keys(a).length,skipped=Object.keys(st.skipped?.[mode]||{}).filter(i=>!a[i]).length;return {answered,skipped,remaining:Math.max(0,total-answered)};}
function nav(){const n=lessonNum(currentLessonId);const wc=(L.words||[]).length;const items=[['home','⌂','home','Lesson '+n],['words','▣','words',wc+' words'],['originalRead','📖','read','Book'],['questions','✎','questions','12'],['originalExtra','＋','originalExtra','12'],['similar','↻','similar','12'],['report','▥','report','Results']];const townLabel=st.lang==='ko'?'마을로':st.lang==='zh'?'返回小镇':'Reading Town';return `<aside class="side"><div class="logo">CARS<small>G-FIELD ONLINE READING</small></div><button class="town-btn" data-act="go-town"><span class="nav-icon">🏘</span><b>${townLabel}</b></button><div class="profile"><b>${currentBookLabel()} · Lesson ${n}</b><span>${esc(L.title||'')}</span></div><div class="menu">${items.map(([view,icon,label,small])=>`<button class="nav-btn ${st.view===view?'active':''}" data-view="${view}"><span class="nav-icon">${icon}</span><span><b>${t(label)}</b><small>${small}</small></span></button>`).join('')}</div><div class="side-bottom"><b>💡 ${t('learnFirst')}</b><br>${st.lang==='ko'?'문제를 풀기 전에 단어를 먼저 익혀요.':st.lang==='en'?'Learn words before solving reading questions.':'先学习单词，再完成阅读练习。'}</div></aside>`}
function top(){const o=st.original?`${st.original.score}/12`:'—';return `<div class="topbar"><div class="crumb">CARS Online Learning　›　${currentBookLabel()}　›　<b>Lesson ${lessonNum(currentLessonId)}</b></div><div class="status">${currentStudent?`<span class="student-chip"><span class="chip-avatar">${esc((currentStudent.name||'?').slice(0,1).toUpperCase())}</span><b>${esc(currentStudent.name)}</b><button class="chip-switch" data-act="switch-student" title="${st.lang==='ko'?'학생 바꾸기':st.lang==='zh'?'切换学生':'Switch student'}">⇄</button></span>`:''}<span class="progress-pill points-pill">★ ${(profile&&profile.points)||0}P</span><span class="progress-pill">${t('words')} ${Object.keys(st.known).length}/12</span><span class="progress-pill">${t('original')} ${o}</span><div class="top-language language-toggle" role="group" aria-label="Language"><button data-lang="ko" class="${st.lang==='ko'?'active':''}">한국어</button><button data-lang="en" class="${st.lang==='en'?'active':''}">English</button><button data-lang="zh" class="${st.lang==='zh'?'active':''}">中文</button></div></div></div>`}
function stepDone(view){const wc=(L.words||[]).length;switch(view){case 'words':return wc>0&&Object.keys(st.known).filter(k=>st.known[k]).length>=wc;case 'originalRead':return !!st.original;case 'questions':return !!st.original;case 'originalExtra':return !!st.originalExtra;case 'similar':return !!st.similar;case 'report':return !!st.original&&!!st.originalExtra&&!!st.similar;default:return false;}}
function flow(){const items=[['words','1',t('words')],['originalRead','2',t('read')],['questions','3',t('questions')],['originalExtra','4',t('originalExtra')],['similar','5',t('similar')],['report','6',t('report')]];return `<div class="flow">${items.map((x,i)=>{const done=stepDone(x[0]),active=st.view===x[0];return `${i?'<span class="arrow">→</span>':''}<button class="flow-step ${active?'active':''} ${done?'done':''}" data-view="${x[0]}"><small>STEP ${x[1]}${done?' <span class="flow-check">✓</span>':''}</small><b>${x[2]}</b></button>`;}).join('')}</div>`}
function art(){return `<div class="art-stack"><div class="original-figure"><img class="bw-art" src="${esc(L.image||'assets/images/cars-level-b/lesson-01-my-backyard-zoo.png')}" alt="${esc(L.title||'Lesson illustration')}"></div></div>`}
function listenButtons(passage='original'){const echoLbl=st.lang==='ko'?'따라 읽기':st.lang==='zh'?'跟读':'Read with Me';return `<div class="listen sentence-controls"><button class="btn primary" data-act="listen-all" data-passage="${passage}">▶ ${t('listenSentence')}</button><button class="btn echo-btn" data-act="echo-read" data-passage="${passage}">🎤 ${echoLbl}</button><label class="speed">${t('speed')} <select data-act="speed"><option value="0.6" ${Number(st.speed)===0.6?'selected':''}>0.6×</option><option value="0.8" ${Number(st.speed)===0.8?'selected':''}>0.8×</option><option value="1" ${Number(st.speed)===1?'selected':''}>1.0×</option><option value="1.15" ${Number(st.speed)===1.15?'selected':''}>1.15×</option><option value="1.3" ${Number(st.speed)===1.3?'selected':''}>1.3×</option></select></label><button class="btn" data-act="stop">■ ${t('stopAudio')}</button><span class="sentence-tip">${t('sentenceTip')}</span></div>`}
function splitSentences(text){let s=String(text).replace(/(\d)[.](\d)/g,'$1\x02$2').replace(/\b(Mr|Mrs|Ms|Dr|Prof|Jr|Sr|St|vs|etc)\./gi,'$1\x02').replace(/\b([A-Z]\.){2,}/g,function(m){return m.replace(/\./g,'\x02');});return(s.match(/[^.!?]+[.!?]+(?:[“'”']+)?|[^.!?]+$/g)||[String(text)]).map(v=>v.trim().replace(/\x02/g,'.')).filter(Boolean)}
function sentencePassage(paragraphs, passage){let offset=0;return paragraphs.map((p,pi)=>{const sentences=splitSentences(p);const html=sentences.map((sentence,si)=>{const start=offset;const end=start+sentence.length;offset=end+1;return `<span class="sentence-line" data-passage="${passage}" data-start="${start}" data-end="${end}">${esc(sentence)} </span>`}).join('');offset+=1;return `<p class="sentence-paragraph">${html}</p>`}).join('')}
function home(){return `<div class="work-grid"><section class="card reading-card"><div class="headrow"><div><div class="section-tag"><i>🌿</i> Lesson ${lessonNum(currentLessonId)}</div><h1 class="title">${esc(L.title||t('title'))}</h1><p class="sub">${st.lang==='ko'?'단어를 먼저 익히고, 교재 지문을 들은 뒤 한 문제씩 풀어 보세요.':st.lang==='en'?'Learn the words, listen to the story, and solve one question at a time.':'先学单词，再听课文，一次完成一道题。'}</p></div><button class="btn primary" data-view="words">${t('start')} →</button></div><div class="story">${art()}<div class="passage"><p><b>${esc(L.title||'')}</b>${L.theme?` · ${esc(L.theme)}`:''}</p><p>${st.lang==='ko'?`${(L.words||[]).length}개 핵심 단어를 먼저 배우고, 교재 지문을 들은 뒤 한 문제씩 천천히 풀어 보세요.`:st.lang==='en'?`Learn ${(L.words||[]).length} focus words, listen to the story, and solve questions one at a time.`:`先学习 ${(L.words||[]).length} 个重点单词，再听课文，一次完成一道题。`}</p></div></div></section></div><section class="card learning"><h2>${t('learnFirst')} <span style="color:#0aa394;font-size:15px">(${(L.words||[]).length})</span></h2><div class="action-grid"><button class="action purple" data-wordmode="cards"><div class="emoji">📚</div><h3>${t('cards')}</h3><p>${st.lang==='ko'?'뜻과 한국어를 확인해요.':'Meanings and Korean support.'}</p><span class="go">${t('start')}</span></button><button class="action yellow" data-wordmode="memory"><div class="emoji">🃏</div><h3>${t('memory')}</h3><p>${st.lang==='ko'?'카드를 뒤집어 외워요.':'Flip and remember.'}</p><span class="go">${t('start')}</span></button><button class="action blue" data-wordmode="game"><div class="emoji">🎮</div><h3>${t('game')}</h3><p>${st.lang==='ko'?'뜻 맞히기로 복습해요.':'Match the meaning.'}</p><span class="go">${t('start')}</span></button><button class="action pink" data-view="originalRead"><div class="emoji">📖</div><h3>${t('read')}</h3><p>${st.lang==='ko'?'그림과 음성으로 읽어요.':'Read with pictures and audio.'}</p><span class="go">${t('read')}</span></button></div></section>`}
function words(){let body='';const wc=(L.words||[]).length;const myWordsLbl=st.lang==='ko'?'나만의 단어':st.lang==='zh'?'我的单词':'My Words';
 if(st.wordMode==='cards'){body=`<div class="word-grid">${L.words.map((w,i)=>`<article class="word-card ${st.known[w[0]]?'known':''} ${st.lang==='ko'?'ko':''}"><strong>${esc(w[0])}</strong><p class="meaning">${esc(wordMeaning(w))}</p>${wordDetail(w)?`<p class="word-detail">${esc(wordDetail(w))}</p>`:''}<div class="word-actions"><button class="btn tiny" data-act="word-speak" data-i="${i}">🔊</button><button class="btn tiny star ${isSaved(w[0])?'on':''}" data-act="save-word" data-i="${i}" title="${myWordsLbl}">${isSaved(w[0])?'★':'☆'}</button><button class="btn tiny ${st.known[w[0]]?'known':''}" data-act="known" data-i="${i}">${st.known[w[0]]?t('knownDone'):t('known')}</button></div></article>`).join('')}</div>`}
 else if(st.wordMode==='memory'){const w=L.words[st.wordIndex];const back=`${esc(wordMeaning(w))}${wordDetail(w)?`<br><small>${esc(wordDetail(w))}</small>`:''}`;body=`<div class="memory-stage"><p class="sub">${st.wordIndex+1} / ${wc}</p><button class="flip" data-act="flip"><div class="${st.flipped?'back':'front'}">${st.flipped?back:esc(w[0])}</div></button><div class="tools center"><button class="btn" data-act="mem-prev">${t('previous')}</button><button class="btn primary" data-act="flip">${t('flip')}</button><button class="btn" data-act="mem-next">${t('next')}</button></div></div>`}
 else if(st.wordMode==='myWords'){const list=myWordsList();body=list.length?`<div class="mywords-grid">${list.map((w,i)=>`<article class="word-card saved ${st.lang==='ko'?'ko':''}"><strong>${esc(w.en)}</strong><p class="meaning">${esc(st.lang==='ko'?(w.ko||w.def):st.lang==='zh'?(w.zh||w.def):w.def)}</p>${w.lessonId?`<p class="word-detail">Lesson ${lessonNum(w.lessonId)}</p>`:''}<div class="word-actions"><button class="btn tiny" data-act="myword-speak" data-i="${i}">🔊</button><button class="btn tiny star on" data-act="myword-remove" data-i="${i}">★ ${st.lang==='ko'?'빼기':st.lang==='zh'?'移除':'Remove'}</button></div></article>`).join('')}</div>`:`<div class="mywords-empty"><div class="mw-star">⭐</div><h3>${st.lang==='ko'?'아직 저장한 단어가 없어요':st.lang==='zh'?'还没有保存的单词':'No saved words yet'}</h3><p>${st.lang==='ko'?'단어 카드나 게임에서 ☆를 눌러 나만의 단어를 모아요.':st.lang==='zh'?'在单词卡或游戏中点 ☆ 收藏你的单词。':'Tap ☆ on a word card or in the game to collect your words.'}</p></div>`}
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
function originalRead(){const text=passageBlock(L.originalPassage,'original',true);return `<div class="work-grid"><section class="card reading-card"><div class="headrow"><div><div class="section-tag"><i>📖</i> ${t('stepRead')}</div><h1 class="title">${esc(L.title||t('title'))}</h1><p class="sub">${t('originalSubtitle')}</p></div><div class="header-actions">${listenButtons('original')}<button class="btn print-btn" data-act="print-study" data-passage="original">🖨 ${t('printStudy')}</button></div></div>${text}<div class="tools"><button class="btn violet" data-act="open-original-questions">${t('startQuestions')}</button></div>${st.questionOpen?`<section class="question-drawer" id="question-drawer">${questionCard('original',true)}</section>`:''}</section></div>`}
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
  <div class="tools"><button class="btn primary" data-act="retry-similar">${t('retry')}</button></div></section>`}
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
 return `<div class="cover"><div class="cover-card"><div class="cover-lang language-toggle">${langBtns}</div><div class="brand-badge">G-FIELD</div><h1 class="cover-title">${g.brand}</h1><div class="cover-level">${g.level}</div><div class="cover-tag">${g.tag}</div>${continueBlock}${chips}<div class="gate-block"><div class="gate-label">${g.newer}</div><form class="name-form" data-act="name-form"><input class="name-input" name="name" maxlength="20" placeholder="${g.name}" autocomplete="off" spellcheck="false"><button type="submit" class="btn primary big">${g.start} →</button></form><p class="gate-hint">${g.hint}</p></div><p class="gate-license">${g.license}</p></div></div>`;
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
 st=stForLesson('lesson1',lang);atTown=true;townView=(profile.avatar&&profile.avatar.picked)?'map':'pick';save();render();window.scrollTo({top:0});
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
function boot(){render();} // always open the "누가 공부해요?" picker (saved students are cards)
function town(){
 const langBtns=['ko','en','zh'].map(l=>`<button data-lang="${l}" class="${st.lang===l?'active':''}">${l==='ko'?'한국어':l==='en'?'English':'中文'}</button>`).join('');
 const pts=(profile&&profile.points)||0;
 const stops=availableLessons().map(id=>{const m=lessonMeta(id);const done=lessonDone(id);const started=lessonStarted(id);const cur=id===currentLessonId;
  const status=done?(st.lang==='ko'?'완료':st.lang==='zh'?'完成':'Done'):started?(st.lang==='ko'?'학습 중':st.lang==='zh'?'学习中':'In progress'):(st.lang==='ko'?'시작하기':st.lang==='zh'?'开始':'Start');
  return `<button class="lesson-stop ${done?'done':''} ${cur?'current':''}" data-act="open-lesson" data-lesson="${esc(id)}"><span class="stop-badge">${m.num}</span><span class="stop-thumb"><img src="${esc(m.image)}" alt="" loading="lazy"></span><span class="stop-info"><b>Lesson ${m.num}</b><small>${esc(m.title)}</small><em class="stop-status">${done?'✓ ':''}${status}</em></span></button>`;}).join('');
 ensureAvatar(profile);
 const chip=currentStudent?`<span class="student-chip"><span class="chip-avatar">${esc((currentStudent.name||'?').slice(0,1).toUpperCase())}</span><b>${esc(currentStudent.name)}</b><button class="chip-switch" data-act="switch-student" title="${st.lang==='ko'?'학생 바꾸기':st.lang==='zh'?'切换学生':'Switch student'}">⇄</button></span>`:'';
 const parentBtn=`<button class="btn tiny ghost" data-act="parent-open" title="${st.lang==='ko'?'학부모':st.lang==='zh'?'家长':'Parent'}">👨‍👩‍👧</button>`;
 const header=`<div class="town-top"><div class="town-brand">Gfield Reading Town</div><div class="town-tools">${chip}<span class="points-pill">★ ${pts}P</span>${parentBtn}<div class="language-toggle town-lang">${langBtns}</div></div></div>`;
 if(townView==='pick')return `<div class="town town-pick"><div class="town-top"><div class="town-brand">Gfield Reading Town</div><div class="language-toggle town-lang">${langBtns}</div></div>${basePicker()}</div>`;
 if(townView==='closet')return `<div class="town">${header}${closet(pts)}</div>`;
 const customize=st.lang==='ko'?'캐릭터 꾸미기':st.lang==='zh'?'装扮角色':'Customize';
 const explore=st.lang==='ko'?'마을 탐험':st.lang==='zh'?'探索小镇':'Explore Town';
 const exploreBtn=gameAvailable()?`<button class="btn violet" data-act="town-game">🎮 ${explore}</button>`:'';
 const sqName=sqAvailable()?(sqLoc(VIDEO_PLAN.name)||'Screen Quest'):'';
 const sqBtn=sqAvailable()?`<button class="btn amber" data-act="sq-open">🎬 ${sqName}</button>`:'';
 const avatarCard=`<section class="avatar-card"><div class="ava-wrap">${renderAvatar(null,132)}</div><div class="ava-info"><div class="ava-hello">${st.lang==='ko'?'안녕,':st.lang==='zh'?'你好，':'Hi,'} <b>${esc(currentStudent?currentStudent.name:'')}</b>!</div><div class="ava-pts"><span class="points-pill">★ ${pts}P</span></div><div class="ava-btns">${exploreBtn}${sqBtn}<button class="btn primary" data-act="town-closet">🎨 ${customize}</button></div></div></section>`;
 const _bks=availableBooks();const _bkCur=_bks.find(bk=>bk.id===currentBookId)||_bks[0]||{title:'CARS',shortLabel:'Level'};const _bookTabs=_bks.length>1?`<div class="book-tabs">${_bks.map(bk=>`<button class="book-tab ${bk.id===currentBookId?'active':''}" data-act="switch-book" data-book="${esc(bk.id)}">${esc(bk.shortLabel)}</button>`).join('')}</div>`:'';
 return `<div class="town">${header}${avatarCard}<section class="house-card"><div class="house-head"><div class="house-emoji">🏠</div><div><div class="house-tag">${st.lang==='ko'?'책':st.lang==='zh'?'书':'Book'}</div><h1 class="house-title">${esc(_bkCur.title)}</h1><p>${st.lang==='ko'?'Lesson 1부터 차례로 학습해요.':st.lang==='zh'?'从第 1 课开始依次学习。':'Learn from Lesson 1 onward.'}</p></div></div>
  ${_bookTabs}<div class="lesson-path">${stops}</div></section></div>`;
}
function gameAvailable(){return !!(window.Phaser&&window.TownGame);}
function lookForGame(){const eq=avEquipped();const hat=avItem('hat',eq.hat);return {skin:(avItem('skin',eq.skin)||{}).fill||'#ffd9ad',hair:(avItem('haircolor',eq.haircolor)||{}).fill||'#6b4326',clothes:(avItem('clothes',eq.clothes)||{}).fill||'#6db3f2',hatEmoji:(hat&&hat.emoji)||''};}
function avatarSvgUri(){try{var svg=renderAvatar(avEquipped(),120,{noBg:true});return 'data:image/svg+xml;base64,'+btoa(unescape(encodeURIComponent(svg)));}catch(e){return null;}}
function gameTownShell(){const pts=(profile&&profile.points)||0;const langBtns=['ko','en','zh'].map(l=>`<button data-lang="${l}" class="${st.lang===l?'active':''}">${l==='ko'?'한국어':l==='en'?'English':'中文'}</button>`).join('');
 const listLbl=st.lang==='ko'?'목록':st.lang==='zh'?'列表':'List';const customize=st.lang==='ko'?'꾸미기':st.lang==='zh'?'装扮':'Dress up';
 const hint=st.lang==='ko'?'방향키나 아래 버튼으로 움직여요 · 건물에 다가가 스페이스/탭!':st.lang==='zh'?'用方向键或下方按钮移动 · 走近建筑物按空格/点击！':'Move with arrows or the buttons · walk up to a building and press Space/tap!';
 return `<div class="town game-town"><div class="town-top"><div class="town-brand">Gfield Reading Town</div><div class="town-tools"><span class="points-pill">🪙 ${pts}</span>${sqAvailable()?`<button class="btn tiny" data-act="sq-open">🎬 ${sqT('스크린','Screen','屏幕')}</button>`:''}<button class="btn tiny" data-act="town-closet">🎨 ${customize}</button><button class="btn tiny" data-act="town-list">≣ ${listLbl}</button><div class="language-toggle town-lang">${langBtns}</div></div></div><div class="town-stage-wrap"><div id="town-stage"></div></div><div class="town-dpad"><button class="dpad" data-move="0,-1" aria-label="up">▲</button><div class="dpad-mid"><button class="dpad" data-move="-1,0" aria-label="left">◀</button><button class="dpad" data-move="1,0" aria-label="right">▶</button></div><button class="dpad" data-move="0,1" aria-label="down">▼</button></div><div id="town-menu" class="town-menu"></div><p class="town-hint">${hint}</p></div>`;}
function bindGameTown(){bind();
 const labels={library:st.lang==='ko'?'도서관':st.lang==='zh'?'图书馆':'Library',wordshop:st.lang==='ko'?'단어 상점':st.lang==='zh'?'单词商店':'Word Shop',theater:st.lang==='ko'?'영상 극장':st.lang==='zh'?'视频剧场':'Screen Theater',practice:st.lang==='ko'?'연습의 집':st.lang==='zh'?'练习屋':'Practice House',report:st.lang==='ko'?'리포트 홀':st.lang==='zh'?'报告厅':'Report Hall',open:st.lang==='ko'?'스페이스/탭하여 열기':st.lang==='zh'?'空格/点击打开':'Space / tap to open'};
 const stage=document.getElementById('town-stage');
 if(stage&&gameAvailable()){TownGame.mount(stage,{look:lookForGame(),coins:(profile&&profile.points)||0,labels,onOpenMenu:buildingMenu,slots:(window.DECORATIONS&&DECORATIONS.slots)||{},placed:placedDecoEmoji(),onSlotClick:decorationMenu,avatarUri:avatarSvgUri(),decorArt:placedDecoArt(),buildingArt:buildingArtMap()});}
 app.querySelectorAll('.town-dpad [data-move]').forEach(b=>{const[x,y]=b.dataset.move.split(',').map(Number);const on=e=>{e.preventDefault();TownGame.setMove(x,y);};const off=()=>TownGame.setMove(0,0);b.addEventListener('pointerdown',on);b.addEventListener('pointerup',off);b.addEventListener('pointerleave',off);b.addEventListener('pointercancel',off);});}
function buildingMenu(key){if(key==='theater'){if(window.TownGame)TownGame.destroy();enterScreenQuest();return;}
 if(key==='library'){showBookShelf();return;}
 const map={wordshop:{view:'words',icon:'🔤',title:{ko:'단어 상점 · 단어 배우기',en:'Word Shop · Learn Words',zh:'单词商店 · 学习单词'},sub:{ko:'단어 카드 · 암기 카드 · 단어 게임.',en:'Word cards · memory · word game.',zh:'单词卡 · 记忆卡 · 单词游戏。'}},practice:{view:'originalExtra',icon:'🏠',title:{ko:'연습의 집 · 추가 학습',en:'Practice House · Extra Learning',zh:'练习屋 · 追加学习'},sub:{ko:'추가 학습과 새 지문 연습으로 약점을 채워요.',en:'Extra learning + new passage practice.',zh:'追加学习与新文章练习。'}},report:{view:'report',icon:'📊',title:{ko:'리포트 홀 · 학습 리포트',en:'Report Hall · Learning Report',zh:'报告厅 · 学习报告'},sub:{ko:'전략별 강점·약점을 확인해요.',en:'See your strengths and weaknesses by strategy.',zh:'查看各策略的强弱项。'}}};const m=map[key];if(!m)return;const el=document.getElementById('town-menu');if(!el)return;
 const lessons=availableLessons();
 el.innerHTML=`<div class="tm-backdrop" data-tmx></div><div class="tm-card"><button class="tm-x" data-tmx>×</button><div class="tm-head">${m.icon} <b>${m.title[st.lang]||m.title.en}</b></div><p class="tm-sub">${m.sub[st.lang]||m.sub.en}</p><div class="tm-pick">${st.lang==='ko'?'어느 레슨을 열까요?':st.lang==='zh'?'打开哪一课？':'Which lesson?'}</div><div class="tm-lessons">${lessons.map(id=>{const n=lessonNum(id);const done=lessonDone(id);return `<button class="tm-lesson ${done?'done':''}" data-tm-lesson="${esc(id)}"><span class="stop-badge">${n}</span><span>Lesson ${n}${done?' ✓':''}</span></button>`;}).join('')}</div></div>`;
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
  </div>
 </div>`;}
function showBookShelf(){
 const t=(ko,en,zh)=>st.lang==='ko'?ko:st.lang==='zh'?zh:en;
 const catalog=window.BOOK_CATALOG||[];
 const booksHtml=catalog.map(bk=>_book3dHtml(bk)).join('');
 const html=`<div class="book-shelf">
  <div class="book-shelf-top">
   <h2>📚 ${t('도서관','Library','图书馆')}</h2>
   <button class="btn secondary" data-act="town-map">← ${t('마을로','Town','返回')}</button>
  </div>
  <p class="book-shelf-sub">${t('교재를 선택하세요. 🔒 는 준비 중인 교재예요.','Choose a textbook. 🔒 = coming soon.','请选择教材。🔒 = 即将开放。')}</p>
  <div class="book-grid">${booksHtml}</div>
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
function parentStats(){const lessons=availableLessons();const strat={};
 const rows=lessons.map(id=>{const ls=(profile.lessons||{})[id]||null;const rt=buildRuntimeLesson(id)||{};const oq=rt.originalQuestions||[];const orig=ls&&ls.original,ext=ls&&ls.originalExtra,sim=ls&&ls.similar;
  if(orig&&oq.length){const missed=orig.missed||[];oq.forEach((q,i)=>{const info=stratInfo(q&&q[0]);const e=strat[info.n]||(strat[info.n]={miss:0,seen:0,tip:info.t});e.seen++;if(missed.includes(i))e.miss++;});}
  const wc=(rt.words||[]).length;const known=ls?Object.keys(ls.known||{}).filter(k=>ls.known[k]).length:0;
  return {id,num:lessonNum(id),title:rt.title||'',done:lessonDone(id),started:lessonStarted(id),orig:orig?orig.score:null,ext:ext?ext.score:null,sim:sim?sim.score:null,wc,known};});
 return {rows,strat};}
function parentDashboard(){const t=(ko,en,zh)=>st.lang==='ko'?ko:st.lang==='zh'?zh:en;const pts=window.GameStore?GameStore.coins(profile):(profile&&profile.points)||0;
 const S=parentStats();const doneN=S.rows.filter(r=>r.done).length,total=S.rows.length;const sqN=Object.keys((profile.screenQuest&&profile.screenQuest.passed)||{}).length;const myW=((profile&&profile.myWords)||[]).length;
 const sum=`<div class="pd-sum"><div class="pd-card"><span class="pd-n">${pts}</span><small>${t('총 포인트','Points','总积分')}</small></div><div class="pd-card"><span class="pd-n">${doneN}/${total}</span><small>${t('완료 레슨','Lessons done','完成课程')}</small></div><div class="pd-card"><span class="pd-n">${sqN}</span><small>${t('영상 퀴즈 통과','Video quizzes','视频测验')}</small></div><div class="pd-card"><span class="pd-n">${myW}</span><small>${t('나만의 단어','My words','我的单词')}</small></div></div>`;
 const weak=Object.entries(S.strat).filter(([,e])=>e.miss>0).sort((a,b)=>b[1].miss-a[1].miss);
 const strong=Object.entries(S.strat).filter(([,e])=>e.seen>0&&e.miss===0).map(([n])=>n);
 const weakHtml=weak.length?weak.map(([n,e])=>`<div class="pd-weak"><div class="pd-weak-h"><b>${esc(n)}</b><span class="pd-miss">${t('틀림','missed','错')} ${e.miss}/${e.seen}</span></div><p>${esc(e.tip)}</p></div>`).join(''):`<p class="pd-empty">${t('아직 교재 학습(진단) 데이터가 쌓이지 않았어요.','No diagnostic Book Study data yet.','还没有教材学习数据。')}</p>`;
 const strongHtml=strong.length?strong.map(n=>`<span class="pd-tag">${esc(n)}</span>`).join(''):'<span class="pd-empty">—</span>';
 const sc=v=>v==null?'—':v+'/12';
 const rowsHtml=S.rows.map(r=>{const status=r.done?t('완료','Done','完成'):r.started?t('학습 중','In progress','进行中'):t('시작 전','Not started','未开始');return `<div class="pd-row ${r.done?'done':''}"><span class="pd-lnum">${r.num}</span><div class="pd-linfo"><b>Lesson ${r.num}</b><small>${esc(r.title)}</small></div><span class="pd-stat ${r.done?'ok':r.started?'mid':''}">${status}</span><span class="pd-scv">${sc(r.orig)}</span><span class="pd-scv">${sc(r.ext)}</span><span class="pd-scv">${sc(r.sim)}</span><span class="pd-scv">${r.known}/${r.wc||12}</span></div>`;}).join('');
 const table=`<div class="pd-table"><div class="pd-row head"><span class="pd-lnum">#</span><div class="pd-linfo"><b>${t('레슨','Lesson','课程')}</b></div><span class="pd-stat">${t('상태','Status','状态')}</span><span class="pd-scv">${t('교재','Book','教材')}</span><span class="pd-scv">${t('추가','Extra','追加')}</span><span class="pd-scv">${t('새지문','New','新文')}</span><span class="pd-scv">${t('단어','Words','单词')}</span></div>${rowsHtml}</div>`;
 const name=currentStudent?esc(currentStudent.name):'';
 return `<div class="town parent-dash"><div class="town-top"><div class="town-brand">👨‍👩‍👧 ${t('학부모 대시보드','Parent Dashboard','家长面板')}</div><div class="town-tools"><span class="student-chip"><b>${name}</b></span><button class="btn tiny" data-act="town-map">← ${t('마을로','Town','返回')}</button></div></div>
  ${sum}
  <section class="pd-sec"><h3>🎯 ${t('전략별 약점','Weak reading strategies','薄弱阅读策略')}</h3><p class="pd-note">${t('교재 학습(진단)에서 자주 틀린 독해 전략이에요. 이 유형을 새 지문 연습에서 집중하면 좋아요.','Strategies most missed in the diagnostic Book Study — focus these in New Passage Practice.','教材学习中最常错的策略，可在新文章练习中重点练习。')}</p>${weakHtml}<div class="pd-strong"><b>💪 ${t('잘하는 전략','Strong','强项')}:</b> ${strongHtml}</div></section>
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
// ---- Screen Quest (weekly video + quiz learning) ----
function sqAvailable(){return !!(window.VIDEO_PLAN&&VIDEO_PLAN.videos);}
function sqLoc(o){return o?(o[st.lang]||o.en||o.ko||''):'';}
function sqT(ko,en,zh){return st.lang==='ko'?ko:st.lang==='zh'?zh:en;}
function sqEnsure(){if(!profile.screenQuest)profile.screenQuest={passed:{}};if(!profile.screenQuest.passed)profile.screenQuest.passed={};return profile.screenQuest;}
function sqVideo(id){return sqAvailable()?VIDEO_PLAN.videos[id]:null;}
function sqSection(v){return (VIDEO_PLAN.sections||[]).find(s=>s.key===(v&&v.section))||{emoji:'🎬',color:'#7a5cc3',name:{en:''}};}
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
function sqArchiveView(){const secs=VIDEO_PLAN.sections||[];
 const groups=secs.map(sec=>{const vids=sqAllVideos().map(sqVideo).filter(v=>v&&v.section===sec.key);if(!vids.length)return '';
  const cards=vids.map(v=>{const id=Object.keys(VIDEO_PLAN.videos).find(k=>VIDEO_PLAN.videos[k]===v);const p=sqPassed(id);return `<button class="sq-arch ${p?'done':''}" data-act="sq-video" data-vid="${esc(id)}" style="--sec:${sec.color}"><span class="sq-vemoji">${sec.emoji}</span><span class="sq-vt">${esc(sqLoc(v.title))}</span>${p?'<span class="sq-check">✓</span>':''}</button>`;}).join('');
  return `<section class="sq-arch-sec"><div class="sq-arch-head" style="--sec:${sec.color}">${sec.emoji} <b>${esc(sqLoc(sec.name))}</b><small>${esc(sec.playlist||'')}</small></div><div class="sq-arch-grid">${cards}</div></section>`;}).join('');
 return `<div class="sq-sub"><button class="btn" data-act="sq-plan">← ${sqT('주간 플랜','Weekly Plan','周计划')}</button><b>🗂️ ${sqT('영상 자료실','Video Library','视频资料库')}</b></div><p class="sq-arch-note">${sqT('배운 영상은 섹션별로 여기에 모여요. 언제든 다시 보고 퀴즈를 풀 수 있어요.','Videos you learn are gathered here by section. Watch and quiz again anytime.','学过的视频按分类收藏在这里，随时可以重看和复习。')}</p>${groups}`;}
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
 if(atTown){if(townView==='game'&&gameAvailable()){app.innerHTML=gameTownShell();bindGameTown();return;}if(townView==='screen'&&sqAvailable()){app.innerHTML=screenQuestScreen();bind();return;}if(townView==='parent'){app.innerHTML=parentDashboard();bind();return;}app.innerHTML=town();bind();return;}let content=st.view==='home'?home():st.view==='words'?words():(st.view==='originalRead'||st.view==='questions')&&!hasOriginal()?missingOriginal():st.view==='originalRead'?originalRead():st.view==='questions'?questionScreen('original'):st.view==='questionOriginalExtra'?questionScreen('originalExtra'):st.view==='questionSimilar'?questionScreen('similar'):st.view==='review'?questionScreen('review'):st.view==='originalExtra'?originalExtra():st.view==='similar'?extra():report();app.innerHTML=`<div class="shell">${nav()}<main class="main">${top()}${flow()}${content}</main></div>${modal()}`;bind();}
function makeGameChoices(){const w=L.words[st.gameIndex];return [w[1],...L.words.filter((_,i)=>i!==st.gameIndex).sort(()=>Math.random()-.5).slice(0,3).map(x=>x[1])].sort(()=>Math.random()-.5)}
function speakPassage(passage){
 stopSpeak();
 const source=passage==='extra'?L.extraPassage:passage==='originalExtra'?(L.originalExtraPassage||L.originalPassage):L.originalPassage;
 if(!(source||[]).length)return;
 const text=(source||[]).join('\n\n');
 const run=++st.speechRun;
 const nodes=[...document.querySelectorAll(`.sentence-line[data-passage="${passage}"]`)];
 const AUDIO_BASE='https://fgahqumaldheqettmvqg.supabase.co/storage/v1/object/public/audio';
 const bookId=(window.LESSONS&&window.LESSONS[currentLessonId])&&window.LESSONS[currentLessonId].bookId;
 let audioUrl=null;
 if(bookId){
   if(passage==='originalExtra')audioUrl=`${AUDIO_BASE}/${bookId}/${currentLessonId}-extra.mp3`;
   else if(passage==='extra')audioUrl=`${AUDIO_BASE}/${bookId}/${currentLessonId}-new.mp3`;
   else if(passage==='original')audioUrl=`${AUDIO_BASE}/${bookId}/${currentLessonId}-original.mp3`;
 }
 if(audioUrl){const el=new Audio(audioUrl);el.playbackRate=Number(st.speed)||1;_audioEl=el;el.onended=()=>{if(run===st.speechRun)_audioEl=null;};el.play().catch(()=>{_audioEl=null;speakPassageWSA(text,run,nodes);});return;}
 speakPassageWSA(text,run,nodes);}
function speakPassageWSA(text,run,nodes){if(!('speechSynthesis' in window)){toast(st.lang==='ko'?'이 브라우저는 읽어주기를 지원하지 않아요.':'Speech is not supported in this browser.');return}
 const u=new SpeechSynthesisUtterance(text);u.lang='en-US';const _v=getBestEnVoice();if(_v)u.voice=_v;u.rate=Number(st.speed)||1;u.pitch=1;
 let lastHL=null;u.onboundary=(ev)=>{if(run!==st.speechRun)return;const cur=nodes.find(n=>ev.charIndex>=Number(n.dataset.start)&&ev.charIndex<Number(n.dataset.end));if(!cur||cur===lastHL)return;lastHL=cur;nodes.forEach(n=>n.classList.toggle('reading-now',n===cur));cur.scrollIntoView({behavior:'smooth',block:'center'});};
 u.onend=()=>{if(run===st.speechRun)document.querySelectorAll('.sentence-line.reading-now').forEach(n=>n.classList.remove('reading-now'));};
 window.speechSynthesis.speak(u);}
function speakText(text){if(!('speechSynthesis' in window)){toast(st.lang==='ko'?'이 브라우저는 읽어주기를 지원하지 않아요.':'Speech is not supported in this browser.');return}stopSpeak();const u=new SpeechSynthesisUtterance(text);u.lang='en-US';const _v=getBestEnVoice();if(_v)u.voice=_v;u.rate=Number(st.speed)||1;window.speechSynthesis.speak(u)}
function stopSpeak(){if(_audioEl){try{_audioEl.pause();}catch(e){}  _audioEl=null;}if('speechSynthesis' in window)window.speechSynthesis.cancel();st.speechRun++;try{document.querySelectorAll('.sentence-line.reading-now').forEach(n=>n.classList.remove('reading-now'));}catch(e){}}
// --- Read with Me (echo reading) for young learners ---
const ECHO_TXT={ko:{ready:'자, 같이 읽어봐요!',your:'이제 따라 읽어요',hear:'다시 듣기',next:'다음',done:'잘 읽었어요!',close:'닫기'},en:{ready:"Let's read together!",your:'Now you read',hear:'Hear it again',next:'Next',done:'Great reading!',close:'Close'},zh:{ready:'我们一起读吧！',your:'现在你来读',hear:'再听一次',next:'下一句',done:'读得真棒！',close:'关闭'}};
let echo={run:0,sentences:[],i:0,timer:null,phase:''};
function stopEchoTimer(){if(echo.timer){clearInterval(echo.timer);echo.timer=null;}}
function passageSentences(key){const src=key==='extra'?L.extraPassage:key==='originalExtra'?(L.originalExtraPassage||L.originalPassage):L.originalPassage;return (src||[]).flatMap(p=>splitSentences(p));}
function _echoAudioUrl(key){const AUDIO_BASE='https://fgahqumaldheqettmvqg.supabase.co/storage/v1/object/public/audio';const bid=currentBookId,lid=currentLessonId;if(key==='originalExtra')return`${AUDIO_BASE}/${bid}/${lid}-extra.mp3`;if(key==='extra')return`${AUDIO_BASE}/${bid}/${lid}-new.mp3`;if(key==='original')return`${AUDIO_BASE}/${bid}/${lid}-original.mp3`;return null;}
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
 save();render();setTimeout(()=>{const r=document.getElementById('grade-result');if(!r)return;if(mode==='original'){r.innerHTML=midReport('original');}else{const next=mode==='originalExtra'?'similar':'report';const nextLabel=mode==='originalExtra'?t('similar'):t('reviewReport');r.innerHTML=`<div class="result"><span class="badge">${st[mode].score}/${list.length}</span><h3>${st.lang==='ko'?'채점 완료':'Checked!'}</h3><p>${mode==='originalExtra'?(st.lang==='ko'?'원문 이해를 한 번 더 확인했어요.':'Your extra learning result was saved.'):(st.lang==='ko'?'리포트에서 약점 변화를 확인하세요.':'Review your skill changes in the report.')}</p><button class="btn violet" data-view="${next}">${nextLabel} →</button></div>`;}bind();r.scrollIntoView({behavior:'smooth',block:'start'});},0)}
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
 ['purpose',{ko:['글쓴이의 목적','글쓴이가 왜 썼는지 다시 생각해 봐요.','설명하려고? 즐겁게 하려고? 설득하려고? 골라 보기.'],en:['Author’s Purpose','Rethink why the author wrote this.','To inform, to entertain, or to persuade — which one?'],zh:['作者目的','再想想作者为什么写。','说明、娱乐还是说服？']}],
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
 return `<div class="midreport"><div class="mr-head"><span class="mr-orb">${correct}/${total}</span><div><h3>${esc(g.title)}</h3><p>${esc(g.sub)}</p></div></div><div class="mr-cols"><div class="mr-box strong"><h4>💪 ${esc(g.strong)}</h4>${strong.length?`<div class="chips">${strong.map(s=>`<span class="chip">${esc(s)}</span>`).join('')}</div>`:`<p class="mr-none">${esc(g.none)}</p>`}</div><div class="mr-box weak"><h4>🔎 ${esc(g.weak)}</h4>${missed.length?`<div class="wk-list">${weakRows}</div>`:`<p class="mr-none">${esc(g.good)}</p>`}</div></div>${missed.length?`<div class="mr-box rec"><h4>🧭 ${esc(g.rec)}</h4><ul class="rec-list">${recRows}</ul></div>`:''}<div class="tools">${missed.length?`<button class="btn primary" data-act="start-wrong-review">🔁 ${esc(g.wr)} (${missed.length})</button>`:''}<button class="btn violet" data-view="originalExtra">${esc(g.extra)} →</button></div></div>`;
}
function reviewSummaryScreen(){
 const total=qs('review').length;let fixed=0;for(let i=0;i<total;i++){if(st.feedback?.review?.[i]?.type==='correct')fixed++;}
 const g=({ko:{t:'오답 학습 완료!',s:`틀렸던 ${total}문제를 다시 풀었고, ${fixed}문제를 스스로 고쳤어요.`,extra:'추가 학습',report:'학습 리포트'},en:{t:'Wrong-answer practice done!',s:`You re-solved ${total} missed question(s) and fixed ${fixed} on your own.`,extra:'Extra Learning',report:'Report'},zh:{t:'错题练习完成！',s:`你重做了 ${total} 道错题，自己改对了 ${fixed} 道。`,extra:'追加学习',report:'学习报告'}})[st.lang]||{};
 return `<div class="work-grid"><section class="card panel review-summary"><div class="section-tag"><i>🔁</i> ${t('wrongReview')}</div><div class="rs-orb">${fixed}/${total}</div><h2>${esc(g.t)}</h2><p class="sub">${esc(g.s)}</p><div class="tools"><button class="btn primary" data-act="start-wrong-review">🔁 ${t('wrongReview')}</button><button class="btn violet" data-view="originalExtra">${esc(g.extra)} →</button><button class="btn" data-view="report">${esc(g.report)}</button></div></section></div>`;
}
function toast(msg){const el=document.createElement('div');el.className='toast';el.textContent=msg;document.body.appendChild(el);setTimeout(()=>el.remove(),2200)}
function printStudy(passage){
 const cfg=passage==='original'?{text:L.originalPassage,questions:L.originalQuestions,title:L.title||'My Backyard Zoo'}:passage==='originalExtra'?{text:L.originalExtraPassage||L.originalPassage,questions:L.originalExtraQuestions||L.originalQuestions,title:(L.originalExtraTitle||L.title||'Extra Learning')}:{text:L.extraPassage||[],questions:L.extraQuestions||[],title:L.extraTitle||'New Passage'};
 const artUrl=new URL(L.image||'assets/images/cars-level-b/lesson-01-my-backyard-zoo.png',window.location.href).href;
 const html=`<!doctype html><html><head><meta charset="utf-8"><title>${cfg.title}</title><style>@page{size:A4;margin:15mm}body{font-family:Arial,sans-serif;color:#111;font-size:11pt;line-height:1.45}.page{break-after:page;min-height:250mm}.page:last-child{break-after:auto}h1{font-size:22pt;margin:0 0 5mm}.meta{margin:0 0 7mm}.print-art{display:block;max-width:100%;max-height:72mm;margin:0 auto 7mm;object-fit:contain}.passage p{margin:0 0 4mm}.q{break-inside:avoid;margin:0 0 5mm}.q b{display:block;margin-bottom:2mm}.choice{margin-left:4mm}</style></head><body><section class="page"><h1>${esc(cfg.title)}</h1><div class="meta">Name: ____________________　Date: ____________________</div><img class="print-art" src="${artUrl}" alt="Lesson illustration"><div class="passage">${cfg.text.map(x=>`<p>${esc(x)}</p>`).join('')}</div></section><section class="page">${cfg.questions.slice(0,6).map((q,i)=>`<div class="q"><b>${i+1}. ${esc(q[1])}</b>${q[2].map((c,j)=>`<div class="choice">${letters[j]}. ${esc(c)}</div>`).join('')}</div>`).join('')}</section><section class="page">${cfg.questions.slice(6,12).map((q,i)=>`<div class="q"><b>${i+7}. ${esc(q[1])}</b>${q[2].map((c,j)=>`<div class="choice">${letters[j]}. ${esc(c)}</div>`).join('')}</div>`).join('')}<p style="margin-top:10mm">Answers: 1 ___ 2 ___ 3 ___ 4 ___ 5 ___ 6 ___ 7 ___ 8 ___ 9 ___ 10 ___ 11 ___ 12 ___</p></section></body></html>`;
 const w=window.open('','_blank');if(!w){toast('Pop-up was blocked.');return}w.document.write(html);w.document.close();w.focus();setTimeout(()=>w.print(),500)
}
function bind(){app.onclick=(e)=>{const b=e.target.closest('button');if(!b)return;const view=b.dataset.view;if(view){setView(view);return}if(b.dataset.lang){st.lang=b.dataset.lang;save();render();return}if(b.dataset.wordmode){st.wordMode=b.dataset.wordmode;st.view='words';save();render();return}if(b.dataset.answer){const mode=st.qMode;const current=st.qIndex[mode];const picked=b.dataset.answer;const q=qs(mode)[current];const total=qs(mode).length;if(isLearningMode(mode)){st.attempts[mode]=st.attempts[mode]||{};st.feedback[mode]=st.feedback[mode]||{};const tries=Number(st.attempts[mode][current]||0)+1;st.attempts[mode][current]=tries;if(picked===q[3]){st.answers[mode][current]=picked;delete st.skipped[mode]?.[current];st.feedback[mode][current]={type:'correct'};save();render();focusQuestion(mode);if(current<total-1)setTimeout(()=>{if(st.qIndex[mode]===current){st.qIndex[mode]=current+1;save();render();focusQuestion(mode)}},800);}else if(tries>=2){st.answers[mode][current]=picked;delete st.skipped[mode]?.[current];st.feedback[mode][current]={type:'reveal'};save();render();focusQuestion(mode);}else{st.feedback[mode][current]={type:'hint',text:learningHint(q),last:picked};save();render();focusQuestion(mode);}return;}st.answers[mode][current]=picked;delete st.skipped[mode]?.[current];if(current<total-1)st.qIndex[mode]=current+1;save();render();if(current<total-1)focusQuestion(mode);return}if(b.dataset.game){if(st.gameStatus==='correct'||st.gameStatus==='reveal')return;const gw=L.words[st.gameIndex];const correct=gw[1];const picked=b.dataset.game;if(picked===correct){if((st.gameTries||0)===0)st.gameScore++;st.gameStatus='correct';st.gameHintOpen=false;save();render();const gi=st.gameIndex;setTimeout(()=>{if(st.gameIndex===gi&&st.gameStatus==='correct')advanceGame();},950);}else{st.gameTries=(st.gameTries||0)+1;st.gameWrongPick=picked;if(st.gameTries>=2){st.gameStatus='reveal';}else{st.gameStatus='hint';st.gameHintOpen=true;}save();render();}return}const act=b.dataset.act;if(!act)return;if(act.slice(0,3)==='sq-'){handleScreenQuest(b);return;}if(act.slice(0,3)==='td-'||act==='cz-mode'){handleTownCustomize(b);return;}const mode=b.dataset.mode||st.qMode;if(act==='known'){const w=L.words[+b.dataset.i][0];st.known[w]=!st.known[w];if(!st.awarded.words&&Object.keys(st.known).filter(k=>st.known[k]).length>=(L.words||[]).length){const rm=({ko:'단어 완성',en:'words learned',zh:'单词完成'})[st.lang]||'words learned';awardPoints(20,rm);st.awarded.words=true;}save();render()}else if(act==='word-speak'){speakText(L.words[+b.dataset.i][0],0,'word')}else if(act==='flip'){st.flipped=!st.flipped;save();render()}else if(act==='mem-prev'){st.wordIndex=Math.max(0,st.wordIndex-1);st.flipped=false;save();render()}else if(act==='mem-next'){st.wordIndex=Math.min(11,st.wordIndex+1);st.flipped=false;save();render()}else if(act==='restart-game'){st.gameIndex=0;st.gameScore=0;st.gameDone=false;st.gameStatus='';st.gameTries=0;st.gameWrongPick='';st.gameHintOpen=false;st.gameChoices=makeGameChoices();save();render()}else if(act==='game-hint'){st.gameHintOpen=!st.gameHintOpen;save();render()}else if(act==='game-show-answer'){st.gameStatus='reveal';save();render()}else if(act==='game-next'){advanceGame()}else if(act==='save-word'){toggleSaveWord(L.words[+b.dataset.i]);render()}else if(act==='save-word-game'){toggleSaveWord(L.words[st.gameIndex]);render()}else if(act==='myword-speak'){const mw=myWordsList()[+b.dataset.i];if(mw)speakText(mw.en)}else if(act==='myword-remove'){const list=(profile&&profile.myWords)||[];list.splice(+b.dataset.i,1);save();render()}else if(act==='open-original-questions'){st.view='originalRead';st.qMode='original';st.questionOpen=true;save();render();setTimeout(()=>document.getElementById('question-drawer')?.scrollIntoView({behavior:'smooth'}),20)}else if(act==='q-prev'){st.qIndex[mode]=Math.max(0,st.qIndex[mode]-1);save();render();focusQuestion(mode)}else if(act==='q-next'||act==='q-skip'){const cur=st.qIndex[mode];if(act==='q-next'&&!st.answers[mode][cur]&&st.feedback?.[mode]?.[cur]?.type!=='reveal'){toast(t('selectAnswer'));return}if(act==='q-skip'&&!st.answers[mode][cur]){st.skipped[mode]=st.skipped[mode]||{};st.skipped[mode][cur]=true}st.qIndex[mode]=Math.min(qs(mode).length-1,st.qIndex[mode]+1);save();render();focusQuestion(mode)}else if(act==='go-q'){st.qIndex[mode]=+b.dataset.i;save();render();focusQuestion(mode)}else if(act==='attempt-grade'){const unanswered=Array.from({length:qs(mode).length},(_,i)=>i).filter(i=>!st.answers[mode][i]);if(unanswered.length){st.modal={mode};save();render()}else grade(mode)}else if(act==='grade-anyway'){grade(mode)}else if(act==='close-modal'){st.modal=null;save();render()}else if(act==='go-q-modal'){st.qIndex[mode]=+b.dataset.i;st.modal=null;save();render();focusQuestion(mode)}else if(act==='show-answer'){const idx=st.qIndex[mode];st.feedback[mode]=st.feedback[mode]||{};const last=st.feedback[mode][idx]?.last;if(last&&!st.answers[mode][idx]){st.answers[mode][idx]=last;delete st.skipped[mode]?.[idx];}st.feedback[mode][idx]={type:'reveal'};save();render();focusQuestion(mode)}else if(act==='start-original-extra'){st.qMode='originalExtra';st.qIndex.originalExtra=0;st.view='questionOriginalExtra';save();render();focusQuestion('originalExtra')}else if(act==='start-extra'){st.qMode='similar';st.qIndex.similar=0;st.view='questionSimilar';save();render();focusQuestion('similar')}else if(act==='retry-similar'){st.qMode='similar';st.qIndex.similar=st.similar?.missed?.[0]??0;st.view='questionSimilar';save();render()}else if(act==='start-wrong-review'){st.qMode='review';st.qIndex.review=0;st.answers.review={};st.skipped.review={};st.attempts.review={};st.feedback.review={};st.reviewComplete=false;st.view='review';save();render();focusQuestion('review')}else if(act==='finish-review'){const rtotal=qs('review').length;let fixed=0;for(let i=0;i<rtotal;i++){if(st.feedback?.review?.[i]?.type==='correct')fixed++;}const already=st.awarded?.review||0,delta=Math.max(0,fixed-already);if(delta>0){const rm=({ko:'오답 고침',en:'fixed',zh:'改对错题'})[st.lang]||'fixed';awardPoints(delta*8,rm);st.awarded.review=fixed;}st.reviewComplete=true;save();render();window.scrollTo({top:0})}else if(act==='toggle-passage'){const p=b.dataset.passage;st.passageHidden[p]=!st.passageHidden[p];save();render();if(!st.passageHidden[p])setTimeout(()=>document.getElementById('question-drawer')?.scrollIntoView({block:'start'}),20)}else if(act==='print-study'){printStudy(b.dataset.passage||'original')}else if(act==='listen-all'){speakPassage(b.dataset.passage||'original')}else if(act==='echo-read'){startEcho(b.dataset.passage||'original')}else if(act==='stop'){stopSpeak()}else if(act==='switch-student'){switchStudent()}else if(act==='open-lesson'){openLesson(b.dataset.lesson)}else if(act==='switch-book'){currentBookId=b.dataset.book;if(profile)profile.currentBookId=currentBookId;save();render();}else if(act==='go-town'){goTown()}else if(act==='av-pick'){ensureAvatar(profile);const p=(window.AVATAR.presets||[]).find(x=>x.id===b.dataset.preset);if(p){profile.avatar.equipped={...profile.avatar.equipped,...p.look};profile.avatar.picked=true;save();render()}}else if(act==='av-pick-done'){ensureAvatar(profile);profile.avatar.picked=true;townView='map';save();render();window.scrollTo({top:0})}else if(act==='town-closet'){townView='closet';render();window.scrollTo({top:0})}else if(act==='town-map'){townView='map';render();window.scrollTo({top:0})}else if(act==='parent-open'){townView='parent';render();window.scrollTo({top:0})}else if(act==='town-list'){townView='map';render();window.scrollTo({top:0})}else if(act==='town-game'){townView='game';render();window.scrollTo({top:0})}else if(act==='av-tab'){avTab=b.dataset.cat;render()}else if(act==='av-equip'){ensureAvatar(profile);profile.avatar.equipped[b.dataset.cat]=b.dataset.id;save();render()}else if(act==='av-buy'){ensureAvatar(profile);const it=avItem(b.dataset.cat,b.dataset.id);const canPay=window.GameStore?GameStore.spendCoins(profile,it?it.cost:0):((profile.points||0)>=(it?it.cost:0)&&(profile.points-=it.cost,true));if(it&&canPay){const key=b.dataset.cat+':'+b.dataset.id;if(!profile.avatar.owned.includes(key))profile.avatar.owned.push(key);profile.avatar.equipped[b.dataset.cat]=b.dataset.id;save();render();toast(st.lang==='ko'?'새 아이템을 얻었어요!':st.lang==='zh'?'获得新装扮！':'New item unlocked!')}else{toast(st.lang==='ko'?'포인트가 부족해요.':st.lang==='zh'?'积分不够。':'Not enough points.')}}else if(act==='q-skip'){}else if(b.dataset.answer){st.answers[mode][st.qIndex[mode]]=b.dataset.answer;save();render()}else if(b.dataset.game){if(b.dataset.game===L.words[st.gameIndex][1])st.gameScore++;st.gameIndex++;if(st.gameIndex>=12)st.gameDone=true;st.gameChoices=st.gameDone?[]:makeGameChoices();save();render()}};
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
  if(k==='PrintScreen'){try{navigator.clipboard&&navigator.clipboard.writeText(' ');}catch(_){}}
 },true);
}catch(_){}}
installGuards();
boot();
})();
