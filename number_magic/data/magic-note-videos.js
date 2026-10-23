/* 마법 노트 짧은 영상(2026-10-23, 원장 "수 세기 누미의 마법노트 짧은 영상으로" → 콘티 docs/n01-magic-note-storyboard.html).
   화면은 시간 t 하나로만 정해진다: state(id,t)가 그 순간의 물체·숫자·자막을 돌려주고, 재생기(app/magic-note-video.js)는
   그대로 그리기만 한다. 그래서 멈췄다 다시 틀어도, 처음부터 다시 봐도 같은 t 에서는 같은 화면이다.
   수학은 그림이 정하지 않는다 — 검사기(scripts/check-magic-note-video.js)가 같은 state 로 물체 수를 센다.
   대사는 audio-lines 로 내보내 OmniVoice 생성 목록(scripts/generate-nm-audio.js)에 올린다. 녹음이 없으면 자막만 보인다. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.NM_MAGIC_NOTE_VIDEOS=api;
})(typeof window!=='undefined'?window:globalThis,function(){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1);
const ease=p=>p*p*(3-2*p);
const lerp=(a,b,p)=>a+(b-a)*p;

/* ---------------- N-01 수 세기 ---------------- */
const WORDS={ko:['하나','둘','셋','넷','다섯'],en:['one','two','three','four','five'],zh:['一','二','三','四','五']};
const LINES={
  open:{ko:'누미의 마법 노트, 열려라!',en:"Numi's Magic Note, open up!",zh:'努米的魔法笔记，打开吧！'},
  sheepOut:{ko:'아주 옛날 양치기는 양이 한 마리 나갈 때마다 조약돌을 하나씩 주머니에 넣었어요.',
    en:'Long ago, a shepherd put one pebble in a pouch each time a sheep went out.',
    zh:'很久以前，牧羊人每放出去一只羊，就往袋子里放一颗小石子。'},
  sheepIn:{ko:'저녁엔 돌아온 양마다 돌을 하나씩 꺼냈어요. 돌이 안 남았네? 양이 다 돌아왔어요!',
    en:'In the evening, he took out one pebble for each sheep that came back. No pebbles left? All the sheep are home!',
    zh:'傍晚每回来一只羊，就拿出一颗石子。石子没有剩下？羊都回来了！'},
  ask:{ko:'병아리가 몇 마리일까? 하나씩 톡톡 짚어 볼게.',en:"How many chicks are there? I'll tap them one by one.",zh:'有几只小鸡呢？我一只一只点一点。'},
  last:{ko:"마지막에 말한 '다섯'이 모두 몇 마리인지 알려 줘요. 모두 다섯 마리!",
    en:'The last number we said, five, tells how many in all. Five chicks in all!',
    zh:'最后说的“五”，告诉我们一共有几只。一共五只！'},
  twice:{ko:'어? 한 마리를 두 번 짚었더니 이상해졌어. 한 마리에 한 번씩만 짚어요!',
    en:'Oops! I tapped one chick twice, and the count went wrong. Tap each one only once!',
    zh:'咦？一只点了两次，数就错了。每只只点一次！'},
  moved:{ko:'병아리들이 자리를 바꿨어! 이번엔 오른쪽부터.',en:'The chicks moved around! This time, start from the right.',zh:'小鸡们换了位置！这次从右边开始。'},
  still:{ko:'그래도 다섯 마리!',en:'Still five chicks!',zh:'还是五只！'},
  /* 유닛 rule 과 같은 글 — 이미 있는 녹음(N-01 rule)을 그대로 쓴다. */
  rule:{ko:'하나씩 짚어요! 마지막 수가 전체 개수예요.',en:'Touch one by one! The last number is the total!',zh:'一个一个点！最后的数就是总数！'}
};
const TITLE={ko:'누미의 마법 노트',en:"Numi's Magic Note",zh:'努米的魔法笔记'};
const SUBTITLE={ko:'수 세기',en:'Counting',zh:'数数'};
/* 장면 시간표(초). 앱 음성은 0.8배속이라 콘티 초안보다 길다. */
const SCENES=[
  {id:'s0',t0:0,t1:3},{id:'s1',t0:3,t1:19},{id:'s2',t0:19,t1:30.5},{id:'s3',t0:30.5,t1:37.5},
  {id:'s3b',t0:37.5,t1:48},{id:'s4',t0:48,t1:59.5},{id:'s5',t0:59.5,t1:65}
];
const DURATION=65;
const MOVE=0.8;                                   // 양이 우리↔들판을 오가는 시간. 끝나는 순간 양·돌 수가 함께 바뀐다.
const SHEEP_OUT=[4.5,6.5,8.5], SHEEP_IN=[12.5,14,15.5];
const PEN=[[14,62],[24,62],[34,62]], POUCH=[84,66];
const T2=[24,25.3,26.6,27.9,29.2];                // S2 짚기
const TB=[38,38.6,39.2], TB_TWICE=39.8;           // S3b: 하나·둘·셋, 그리고 같은 병아리를 한 번 더(넷)
const TB_CLEAR=[43.5,44], TB_FIX=[44.5,45.1,45.7];// 잘못된 배지 지우고 3·4·5 바로잡기(대사 중이라 소리 없음)
const T4=[52.6,53.5,54.4,55.3,56.2], ORDER4=[4,3,2,1,0];   // S4: 오른쪽부터
const ROW=[[34,58],[47,58],[60,58],[73,58],[86,58]];
const SCAT=[[30,40],[42,72],[52,30],[68,74],[82,42]];     // 길이 서로 엇갈리지 않게(검사기가 간격 확인)
const SCATTER=[48,49.2];

function sceneAt(t){return SCENES.find(s=>t>=s.t0&&t<s.t1)||SCENES[SCENES.length-1];}
function lineCue(t,key){return {t,key,text:LINES[key]};}
function wordCue(t,i,key){return {t,key,word:i,text:{ko:WORDS.ko[i],en:WORDS.en[i],zh:WORDS.zh[i]}};}
const CUES=[
  lineCue(0.3,'open'),lineCue(3.2,'sheepOut'),lineCue(11.3,'sheepIn'),lineCue(19.3,'ask'),
  ...T2.map((t,i)=>wordCue(t,i,'w'+i)),
  lineCue(30.8,'last'),
  ...TB.map((t,i)=>wordCue(t,i,'w'+i)),wordCue(TB_TWICE,3,'w3'),
  lineCue(40.6,'twice'),lineCue(48.3,'moved'),
  ...T4.map((t,i)=>wordCue(t,i,'w'+i)),
  lineCue(57,'still'),lineCue(59.8,'rule')
].sort((a,b)=>a.t-b.t);
/* 움직임 줄이기 설정용 정지 화면 — 장면마다 핵심 순간 하나씩. */
const STEPS=[
  {t:2.9,say:'open'},{t:10.9,say:'sheepOut'},{t:18.9,say:'sheepIn'},{t:23.9,say:'ask'},{t:30.4,say:null},
  {t:37.4,say:'last'},{t:41,say:'twice'},{t:47.9,say:null},{t:51,say:'moved'},{t:57.6,say:'still'},{t:64.9,say:'rule'}
];

function words(lang,n,suffix){const w=WORDS[lang]||WORDS.ko;return w.slice(0,n).join(lang==='zh'?'、':', ')+(suffix||'');}
function caption(t,lang){
  const L=k=>(LINES[k][lang]||LINES[k].ko);
  // 수를 세는 동안은 지금까지 말한 수 이름을 이어서 보여 준다.
  if(t>=T2[0]&&t<30.5)return words(lang,T2.filter(x=>t>=x).length,t>=T2[4]?'!':'…');
  if(t>=TB[0]&&t<40.6)return t>=TB_TWICE?words(lang,4,'?'):words(lang,TB.filter(x=>t>=x).length,'…');
  if(t>=T4[0]&&t<57)return words(lang,T4.filter(x=>t>=x).length,t>=T4[4]?'!':'…');
  const lines=CUES.filter(c=>!('word' in c)&&c.t<=t);
  const cur=lines[lines.length-1];
  if(!cur)return '';
  if(cur.key==='open'&&t>=3)return '';
  return L(cur.key);
}

function chicks(t){
  const out=[];
  for(let i=0;i<5;i++){
    let [x,y]=ROW[i];
    if(t>=SCATTER[0]){const p=ease(seg(t,SCATTER[0],SCATTER[1]));x=lerp(ROW[i][0],SCAT[i][0],p);y=lerp(ROW[i][1],SCAT[i][1],p)-Math.sin(p*Math.PI)*6;}
    let badge=null,tone='ok',hopAt=null,fade=1;
    if(t<30.5){const k=T2[i];if(t>=k){badge=String(i+1);hopAt=k;}}
    else if(t<37.5){
      if(i<4){if(t<31){badge=String(i+1);fade=1-seg(t,30.5,31);}}
      else if(t<31)badge='5';
    }else if(t<48){
      if(i<3&&t>=TB[i]){badge=String(i+1);hopAt=TB[i];}
      if(i===2&&t>=TB_TWICE&&t<TB_CLEAR[1]){badge='3·4';tone='bad';hopAt=TB_TWICE;fade=t>=TB_CLEAR[0]?1-seg(t,TB_CLEAR[0],TB_CLEAR[1]):1;}
      if(i===2&&t>=TB_CLEAR[1]){badge=t>=TB_FIX[0]?'3':null;hopAt=TB_FIX[0];}
      if(i===3&&t>=TB_FIX[1]){badge='4';hopAt=TB_FIX[1];}
      if(i===4&&t>=TB_FIX[2]){badge='5';hopAt=TB_FIX[2];}
    }else{
      const n=ORDER4.indexOf(i),k=T4[n];if(t>=k){badge=String(n+1);hopAt=k;}
    }
    const hop=hopAt!=null&&t-hopAt<0.35?Math.sin(seg(t,hopAt,hopAt+0.35)*Math.PI):0;
    const shake=tone==='bad'&&t<TB_TWICE+0.8?Math.sin((t-TB_TWICE)*40)*(1-seg(t,TB_TWICE,TB_TWICE+0.8)):0;
    out.push({id:'c'+i,kind:'chick',emo:'🐤',x,y,show:true,badge,tone,fade,hop,shake,done:!!badge&&tone==='ok'});
  }
  return out;
}
function touchTarget(t){
  // 마법봉은 방금 짚은 병아리 곁에 머문다.
  const pick=(times,map)=>{let k=-1;times.forEach((x,i)=>{if(t>=x)k=i;});return k<0?null:map(k);};
  if(t>=T2[0]&&t<30.5)return pick(T2,k=>k);
  if(t>=TB[0]&&t<TB_CLEAR[0])return t>=TB_TWICE?2:pick(TB,k=>k);
  if(t>=TB_FIX[0]&&t<48)return pick(TB_FIX,k=>k+2);
  if(t>=T4[0]&&t<56.8)return pick(T4,k=>ORDER4[k]);
  return null;
}
function sheepAndPebbles(t){
  const sheep=[],pebbles=[];
  for(let i=0;i<3;i++){
    let x=PEN[i][0],y=PEN[i][1],show=true,away=false,flip=false;
    const o=SHEEP_OUT[i],b=SHEEP_IN[i];
    if(t>=o&&t<o+MOVE){x=lerp(PEN[i][0],112,ease(seg(t,o,o+MOVE)));flip=true;}
    else if(t>=o+MOVE&&t<b){show=false;away=true;}
    else if(t>=b&&t<b+MOVE){x=lerp(112,PEN[i][0],ease(seg(t,b,b+MOVE)));}
    sheep.push({id:'s'+i,kind:'sheep',emo:'🐑',x,y,show,away,flip,hop:0});
    // 조약돌은 양이 다 나간 순간 주머니에 들어가고, 양이 다 돌아온 순간 꺼내진다(그 사이엔 떨어지거나 올라오는 중).
    const sx=POUCH[0]-4+i*4, sy=POUCH[1]-7;
    let pshow=false,inPouch=false,py=sy;
    if(t>=o&&t<o+MOVE){pshow=true;py=lerp(20,sy,ease(seg(t,o,o+MOVE)));}
    else if(t>=o+MOVE&&t<b+MOVE){pshow=true;inPouch=true;if(t>=b)py=lerp(sy,20,ease(seg(t,b,b+MOVE)));}
    pebbles.push({id:'p'+i,kind:'pebble',x:sx,y:py,show:pshow,inPouch:inPouch&&t<b,fade:t>=b&&t<b+MOVE?1-seg(t,b,b+MOVE):1});
  }
  return {sheep,pebbles};
}

function stateN01(t,lang){
  t=clamp(t,0,DURATION);lang=lang||'ko';
  const sc=sceneAt(t);
  const st={id:'N-01',t,scene:sc.id,bg:'plain',dusk:0,objects:[],numi:null,pouch:false,big:null,lasso:0,note:null,wand:null,caption:caption(t,lang)};
  if(sc.id==='s0'){
    st.bg='note';st.numi={src:'numi-0-happy',x:16,y:62,size:26};
    st.note={title:TITLE[lang]||TITLE.ko,sub:SUBTITLE[lang]||SUBTITLE.ko,open:ease(seg(t,0,0.6)),lines:[]};
    st.sparkle=seg(t,0.6,1.6);
    return st;
  }
  if(sc.id==='s1'){
    st.bg='field';st.dusk=ease(seg(t,11,11.6));st.pouch=true;
    const {sheep,pebbles}=sheepAndPebbles(t);st.objects=[...sheep,...pebbles];
    return st;
  }
  if(sc.id==='s5'){
    st.bg='note';st.numi={src:'numi-0-happy',x:16,y:62,size:26};
    const r=LINES.rule[lang]||LINES.rule.ko,parts=r.split(/(?<=[!！])\s*/).filter(Boolean);
    st.note={title:null,open:1,lines:parts.map((p,i)=>({text:p,p:seg(t,59.8+i*1.1,60.8+i*1.1)}))};
    return st;
  }
  // s2·s3·s3b·s4 — 같은 병아리 다섯 마리
  st.objects=chicks(t);
  if(sc.id!=='s4'){
    const mood=t>=30.5&&t<37.5?'numi-0-happy':(t>=TB_TWICE&&t<TB_FIX[0])?'numi-0-think':'numi-0';
    st.numi={src:mood,x:15,y:60,size:24};
  }
  const w=touchTarget(t);
  if(w!=null){const c=st.objects[w];st.wand={x:c.x+3,y:c.y+5};}
  if(sc.id==='s3'){
    const fly=ease(seg(t,31,32));
    st.big=t>=31?{text:'5',x:lerp(ROW[4][0],86,fly),y:lerp(ROW[4][1]-9,20,fly),scale:lerp(0.5,1,fly)}:null;
    st.lasso=ease(seg(t,32,33));
  }
  if(sc.id==='s4'&&t>=56.8)st.big={text:'5',x:86,y:84,scale:ease(seg(t,56.8,57.3))*0.8};
  return st;
}
/* 검사기·재생기가 함께 쓰는 사실 — 장면별로 화면에 있어야 할 물체 수. */
const EXPECT={s1:{sheep:3,pebbles:3},s2:{chick:5},s3:{chick:5,big:'5'},s3b:{chick:5},s4:{chick:5,big:'5'}};

const VIDEOS={
  'N-01':{id:'N-01',duration:DURATION,scenes:SCENES,cues:CUES,steps:STEPS,state:stateN01,expect:EXPECT,
    title:TITLE,touches:{s2:T2,s3b:[...TB,TB_TWICE,...TB_FIX],s4:T4},scatter:SCATTER,
    /* OmniVoice 생성 목록에 올릴 대사(rule 은 유닛 rule 녹음이 이미 있어 뺀다). */
    audioLines:()=>{const out=[];
      Object.entries(LINES).forEach(([k,v])=>{if(k!=='rule')out.push({key:'video-'+k,text:v});});
      WORDS.ko.forEach((_,i)=>out.push({key:'video-w'+i,text:{ko:WORDS.ko[i],en:WORDS.en[i],zh:WORDS.zh[i]}}));
      return out;}}
};
return {has:id=>!!VIDEOS[id],get:id=>VIDEOS[id]||null,ids:()=>Object.keys(VIDEOS)};
});
