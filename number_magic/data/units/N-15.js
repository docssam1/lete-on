/* Numbers of Magic — 유닛 N-15: 문장제와 논리 (수의 나라 · 유아 5~7세)
   tier:'basic' → 경량 플로우: practice → discover(1스테이지) → lab → stamp
   콘텐츠는 전부 창작(이야기 문장제·분류 장면) — 라이선스 교재 삽화/지문 미사용 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['N-15'] = {
  id:'N-15', tier:'basic', level:'N', order:15,
  generator:'nl15_logic', edu:'유아',
  title:{ ko:'문장제와 논리', en:'Word Problems & Logic', zh:'应用题与逻辑' },
  subtitle:{ ko:'이야기 속 수를 구하고, 섞인 걸 나눠 세어요!', en:'Solve the story, then sort and count!', zh:'解决故事里的数字，再分类数一数！' },
  icon:'📖',

  practice:{ generator:'nl15_logic', level:'practice', count:4, params:{ mode:'story' },
    intro:{ ko:'이야기를 듣고 답을 구해요! 🔊 버튼을 누르면 다시 들을 수 있어요',
      en:'Listen to the story and find the answer! Press 🔊 to hear it again',
      zh:'听故事找答案！按🔊可以再听一次' } },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 이야기 속에 수학이 숨어있어요!',en:'1) Math hides inside stories!',zh:'① 故事里藏着数学！'},
        head:{ko:'더 받았으면 더하고, 나눠줬으면 빼요',en:'Got more? Add. Gave some away? Subtract.',zh:'得到更多就加，送出去就减'},
        desc:{ko:'"사탕이 <b>4개</b> 있었는데 <b>2개</b>를 더 받았어요" — 그럼 <b>더해요</b>! 4+2=<b>6개</b>. "사탕이 <b>5개</b> 있었는데 <b>2개</b>를 줬어요" — 그럼 <b>빼요</b>! 5-2=<b>3개</b>. 그리고 여러 가지가 <b>섞여 있을 때</b>는 종류별로 <b>나눠서</b> 세면 훨씬 쉬워요 — 사과랑 바나나가 섞여 있으면, 사과는 사과 바구니로, 바나나는 바나나 바구니로 나눈 다음 세어 보는 거예요!',
          en:'"There were <b>4</b> candies and got <b>2</b> more" — that means <b>add</b>! 4+2=<b>6</b>. "There were <b>5</b> candies and gave away <b>2</b>" — that means <b>subtract</b>! 5-2=<b>3</b>. And when things are <b>mixed together</b>, it\'s much easier to <b>sort them</b> by kind first — apples go in the apple basket, bananas in the banana basket, then count each!',
          zh:'"有<b>4颗</b>糖，又得到<b>2颗</b>"——那就<b>加</b>！4+2=<b>6颗</b>。"有<b>5颗</b>糖，送出去<b>2颗</b>"——那就<b>减</b>！5-2=<b>3颗</b>。东西<b>混在一起</b>时，先按种类<b>分类</b>会容易很多——苹果放苹果篮，香蕉放香蕉篮，再数一数！'},
        mathSteps:['더 받았어요 → 더해요(+)','나눠줬어요 → 빼요(-)','섞였어요 → 나눠서 세어요!'],
        result:{ko:'이야기를 잘 들으면 더할지 뺄지 알 수 있어요!',en:'Listen carefully and you\'ll know whether to add or subtract!',zh:'仔细听故事，就知道该加还是该减！'},
        book:{ko:'이런 문장제는 나중에 수학 서술형 문제 풀이의 기초가 돼요!',en:'These word problems are the foundation for solving math problems later!',zh:'这种应用题是以后解数学题的基础！'} }
    ],
    rule:{ ko:'① 더 받으면 더해요 ② 나눠주면 빼요 ③ 섞였으면 나눠서 세어요!',
      en:'① Get more → add ② Give away → subtract ③ Mixed together → sort then count!',
      zh:'① 得到更多就加 ② 送出去就减 ③ 混在一起就分类数！' }
  },

  lab:{ generator:'nl15_logic', level:'main', count:4, params:{ mode:'sort' },
    intro:{ ko:'이번엔 분류하기! 섞인 걸 톡톡 눌러 바구니에 담고, 개수를 세어 봐요',
      en:'Now let\'s sort! Tap the mixed items into baskets, then count them',
      zh:'现在来分类！点一点把混在一起的东西放进篮子，再数一数' } },

  stamp:{ label:{ ko:'이야기 수학자', en:'Story Mathematician', zh:'故事数学家' }, coins:20 },

  voice:{
    correct:[ {ko:'딩동! 딱 맞아요 📖',en:'Ding! Exactly right!',zh:'叮！完全正确！'}, {ko:'분류도 완벽! 🧺',en:'Perfect sorting too!',zh:'分类也很完美！'}, {ko:'이야기를 잘 들었어요! ✨',en:'You listened so well!',zh:'故事听得真仔细！'} ],
    wrong:[ {ko:'음~ 🔊 버튼으로 다시 들어볼까요?',en:'Hmm, want to listen again with 🔊?',zh:'嗯，按🔊再听一次吧？'}, {ko:'더하는 건지 빼는 건지 다시 생각해봐요',en:'Think again — is it adding or subtracting?',zh:'再想想是加还是减？'} ],
    finish:{ ko:'짝짝짝! 이야기 수학자 탄생! 📖✨', en:'Clap clap! A Story Mathematician is born!', zh:'鼓掌！故事数学家诞生了！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
