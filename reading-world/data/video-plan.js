// Screen Quest — weekly video + quiz plan for G-FIELD Reading Town.
// Grade 2-3 (age 7-8) English learners. Each video has 3 key words,
// a one-line summary, and 4 CARS-style questions.
//
// SAFETY / DATA NOTES
// - Each video carries a `search` term (curated channel + topic). When a
//   specific, verified YouTube video id is chosen it goes in `id`; then the
//   app embeds it via youtube-nocookie (rel=0, no related videos). Until an id
//   is set the app shows a "search on YouTube" link instead — the quiz always
//   works either way, so a missing/dead video never blocks learning.
// - The weekly Claude schedule (Screen Quest updater) rewrites this file each
//   week: it re-checks that videos are age-appropriate, refreshes the theme,
//   and authors the quizzes. Parents can review "이번 주 영상" any time.
window.VIDEO_PLAN = {
  name: { ko: '스크린 퀘스트', en: 'Screen Quest', zh: '屏幕任务' },
  grade: 2,
  points: 12, // points earned when all 4 quiz questions are passed
  week: {
    id: '2026-W28',
    label: { ko: '2026년 7월 1주', en: 'Week of Jul 6, 2026', zh: '2026年7月第一周' },
    theme: { ko: '바닷속 친구들 🌊', en: 'Ocean Friends 🌊', zh: '海洋朋友 🌊' },
    note: {
      ko: '이번 주는 바다를 주제로 파닉스·수학·동물·과학·이야기를 함께 배워요. 하루에 영상 2개를 보고 퀴즈 4개를 모두 맞히면 포인트를 받아요!',
      en: 'This week is all about the ocean — phonics, math, animals, science, and stories. Watch 2 videos a day and pass all 4 quiz questions to earn points!',
      zh: '本周主题是海洋 — 拼读、数学、动物、科学和故事。每天看 2 个视频并答对 4 道题就能获得积分！',
    },
  },
  sections: [
    { key: 'phonics', emoji: '🔤', color: '#7a5cc3', name: { ko: '파닉스 복습', en: 'Phonics Review', zh: '拼读复习' }, playlist: 'G-FIELD Reading Town | Phonics Review' },
    { key: 'math', emoji: '🔢', color: '#e08a3c', name: { ko: '수학 영어', en: 'Math English', zh: '数学英语' }, playlist: 'G-FIELD Reading Town | Math English' },
    { key: 'animal', emoji: '🐢', color: '#2f9e8f', name: { ko: '동물 탐험', en: 'Animal Explorer', zh: '动物探险' }, playlist: 'G-FIELD Reading Town | Animal Explorer' },
    { key: 'science', emoji: '🔬', color: '#d05f8a', name: { ko: '과학 질문실', en: 'Science Question Lab', zh: '科学问题实验室' }, playlist: 'G-FIELD Reading Town | Science Question Lab' },
    { key: 'story', emoji: '📖', color: '#3d7fd6', name: { ko: '이야기 미션', en: 'Story Mission', zh: '故事任务' }, playlist: 'G-FIELD Reading Town | Story Mission' },
  ],
  days: [
    { key: 'mon', name: { ko: '월', en: 'Mon', zh: '周一' }, focus: { ko: '파닉스 + 수학', en: 'Phonics + Math', zh: '拼读 + 数学' }, videos: ['v-mon-1', 'v-mon-2'] },
    { key: 'tue', name: { ko: '화', en: 'Tue', zh: '周二' }, focus: { ko: '동물 탐험', en: 'Animal Explorer', zh: '动物探险' }, videos: ['v-tue-1', 'v-tue-2'] },
    { key: 'wed', name: { ko: '수', en: 'Wed', zh: '周三' }, focus: { ko: '이야기 읽어주기', en: 'Read-Aloud Stories', zh: '故事朗读' }, videos: ['v-wed-1', 'v-wed-2'] },
    { key: 'thu', name: { ko: '목', en: 'Thu', zh: '周四' }, focus: { ko: '바다 과학', en: 'Ocean Science', zh: '海洋科学' }, videos: ['v-thu-1', 'v-thu-2'] },
    { key: 'fri', name: { ko: '금', en: 'Fri', zh: '周五' }, focus: { ko: '복습 (수학 + 파닉스)', en: 'Review (Math + Phonics)', zh: '复习（数学 + 拼读）' }, videos: ['v-fri-1', 'v-fri-2'] },
    { key: 'sat', name: { ko: '토', en: 'Sat', zh: '周六' }, focus: { ko: '좋아하는 영상', en: 'Favorites', zh: '最爱视频' }, videos: ['v-sat-1', 'v-sat-2'] },
  ],
  videos: {
    'v-mon-1': {
      section: 'phonics', channel: 'Alphablocks', minutes: 12, search: 'Alphablocks silent e', id: '',
      title: { ko: '매직 e (Silent e)', en: 'Magic e (Silent e)', zh: '魔法 e' },
      keyWords: [{ en: 'magic e', ko: '매직 이(e)' }, { en: 'vowel', ko: '모음' }, { en: 'long sound', ko: '긴 소리' }],
      summary: { ko: '단어 끝의 소리 없는 e가 앞의 모음을 이름 소리(긴 소리)로 바꿔줘요. cap → cape!', en: 'A silent e at the end makes the vowel say its name — the long sound. cap → cape!', zh: '词尾不发音的 e 让前面的元音发长音。cap → cape！' },
      quiz: [
        { strat: 'Phonics', q: { ko: '“cap”에 매직 e를 붙이면 어떤 단어가 될까요?', en: 'Add magic e to “cap”. What word do you get?', zh: '给 “cap” 加上魔法 e 会变成哪个词？' }, choices: ['cape', 'cop', 'cup', 'clap'], answer: 0, hint: { ko: 'a가 이름 소리(에이)로 길게 바뀌어요.', en: 'The a now says its name (ay).', zh: 'a 现在发字母名的音。' } },
        { strat: 'Phonics', q: { ko: '매직 e는 앞의 모음 소리를 어떻게 바꾸나요?', en: 'What does magic e do to the vowel sound?', zh: '魔法 e 对元音有什么作用？' }, choices: ['Makes it long', 'Makes it quiet', 'Removes it', 'Doubles it'], answer: 0, hint: { ko: '짧은 소리를 긴 소리로 바꿔줘요.', en: 'It turns a short sound into a long sound.', zh: '把短音变成长音。' } },
        { strat: 'Word Meaning', q: { ko: '“kit”에 매직 e를 붙이면?', en: 'Add magic e to “kit”. What word do you get?', zh: '给 “kit” 加上魔法 e 会是？' }, choices: ['kite', 'cat', 'kid', 'kitten'], answer: 0, hint: { ko: 'i가 “아이” 소리로 길어져요.', en: 'The i says its name (eye).', zh: 'i 发长音（eye）。' } },
        { strat: 'Phonics', q: { ko: '매직 e에서 e는 소리가 나나요?', en: 'Do we say the sound of the magic e?', zh: '魔法 e 本身发音吗？' }, choices: ['No, it is silent', 'Yes, loudly', 'Only sometimes', 'Yes, like “ee”'], answer: 0, hint: { ko: 'e는 조용히 있어요. 그래서 silent e 예요.', en: 'The e stays quiet — that is why it is silent e.', zh: 'e 是不发音的，所以叫 silent e。' } },
      ],
    },
    'v-mon-2': {
      section: 'math', channel: 'Numberblocks', minutes: 15, search: 'Numberblocks 11 to 20', id: '',
      title: { ko: '11부터 20까지 (Teen Numbers)', en: '11 to 20 (Teen Numbers)', zh: '11 到 20' },
      keyWords: [{ en: 'ten', ko: '십' }, { en: 'teen', ko: '십몇' }, { en: 'ones', ko: '일의 자리' }],
      summary: { ko: '11~20은 “10과 몇 개”로 만들어져요. 13은 10 더하기 3이에요!', en: 'Teen numbers are “ten and some more”. 13 is ten plus three!', zh: '十几就是“十再加几”。13 是 10 加 3！' },
      quiz: [
        { strat: 'Number Sense', q: { ko: '10 + 4 = ?', en: '10 + 4 = ?', zh: '10 + 4 = ?' }, choices: ['13', '14', '15', '40'], answer: 1, hint: { ko: '10에서 4만큼 더 세어 보세요.', en: 'Count on 4 more from ten.', zh: '从十再数 4 个。' } },
        { strat: 'Number Sense', q: { ko: '13은 10이 1개와 낱개(일) 몇 개일까요?', en: '13 is 1 ten and how many ones?', zh: '13 是 1 个十和几个一？' }, choices: ['1', '2', '3', '13'], answer: 2, hint: { ko: '10 + ? = 13', en: '10 + ? = 13', zh: '10 + ? = 13' } },
        { strat: 'Number Sense', q: { ko: '17과 12 중 어느 수가 더 클까요?', en: 'Which is bigger, 17 or 12?', zh: '17 和 12 哪个更大？' }, choices: ['12', '17', '같아요 (same)', '11'], answer: 1, hint: { ko: '17이 12보다 더 많아요.', en: '17 is more than 12.', zh: '17 比 12 多。' } },
        { strat: 'Sequence', q: { ko: '이어 세기: 15, 16, 17, ?', en: 'Count on: 15, 16, 17, ?', zh: '接着数：15, 16, 17, ?' }, choices: ['14', '20', '18', '7'], answer: 2, hint: { ko: '17보다 하나 더 큰 수예요.', en: 'One more than 17.', zh: '比 17 多一。' } },
      ],
    },
    'v-tue-1': {
      section: 'animal', channel: 'Nat Geo Kids', minutes: 5, search: 'Nat Geo Kids ocean animals', id: '',
      title: { ko: '바닷속 동물들', en: 'Ocean Animals', zh: '海洋动物' },
      keyWords: [{ en: 'ocean', ko: '바다' }, { en: 'gills', ko: '아가미' }, { en: 'mammal', ko: '포유류' }],
      summary: { ko: '바다에는 물고기, 문어, 돌고래가 살아요. 돌고래는 물고기가 아니라 숨을 쉬러 위로 올라와요!', en: 'Fish, octopuses, and dolphins live in the ocean. Dolphins are not fish — they come up to breathe air!', zh: '海里有鱼、章鱼和海豚。海豚不是鱼，它们要浮上来呼吸空气！' },
      quiz: [
        { strat: 'Detail', q: { ko: '문어는 팔이 몇 개일까요?', en: 'How many arms does an octopus have?', zh: '章鱼有几条腕？' }, choices: ['8', '2', '4', '10'], answer: 0, hint: { ko: 'oct-는 “여덟”을 뜻해요.', en: '“Oct-” means eight.', zh: '“Oct-” 表示八。' } },
        { strat: 'Main Idea', q: { ko: '이 영상은 무엇에 대한 이야기인가요?', en: 'What is this video mostly about?', zh: '这个视频主要讲什么？' }, choices: ['Animals in the ocean', 'Farm animals', 'Cars', 'Baking bread'], answer: 0, hint: { ko: '바다에 사는 동물들을 보여줬어요.', en: 'It shows animals that live in the sea.', zh: '它展示了住在海里的动物。' } },
        { strat: 'Inference', q: { ko: '돌고래는 왜 물 위로 올라올까요?', en: 'Why do dolphins come up to the top of the water?', zh: '海豚为什么浮到水面？' }, choices: ['To breathe air', 'To sleep', 'To hide', 'To get cold'], answer: 0, hint: { ko: '돌고래는 포유류라 공기를 마셔요.', en: 'Dolphins are mammals and breathe air.', zh: '海豚是哺乳动物，要呼吸空气。' } },
        { strat: 'Word Meaning', q: { ko: '물고기가 물속에서 숨 쉬게 해주는 것은?', en: 'What helps a fish breathe under water?', zh: '什么帮助鱼在水下呼吸？' }, choices: ['Gills', 'Legs', 'Wings', 'Teeth'], answer: 0, hint: { ko: '물고기 몸 옆에 있는 “아가미”예요.', en: 'The gills on the side of a fish.', zh: '鱼身体两侧的“鳃”。' } },
      ],
    },
    'v-tue-2': {
      section: 'animal', channel: 'Nat Geo Kids', minutes: 4, search: 'Nat Geo Kids weird but true ocean animals', id: '',
      title: { ko: '신기한 바다 동물 (Weird but True)', en: 'Weird but True: Sea Animals', zh: '奇趣海洋动物' },
      keyWords: [{ en: 'seahorse', ko: '해마' }, { en: 'starfish', ko: '불가사리' }, { en: 'regrow', ko: '다시 자라다' }],
      summary: { ko: '해마 아빠가 아기를 몸에 담아 키워요. 불가사리는 팔이 떨어져도 다시 자라요!', en: 'Male seahorse dads carry the babies. A starfish can regrow an arm if it loses one!', zh: '海马爸爸把宝宝装在身上。海星掉了一条腕还能重新长出来！' },
      quiz: [
        { strat: 'Detail', q: { ko: '해마는 누가 아기를 데리고 다닐까요?', en: 'In seahorses, who carries the babies?', zh: '海马中，是谁带着宝宝？' }, choices: ['The dad', 'The mom', 'A crab', 'No one'], answer: 0, hint: { ko: '아빠 해마가 담당해요.', en: 'The dad seahorse does.', zh: '是海马爸爸。' } },
        { strat: 'Inference', q: { ko: '불가사리가 팔을 잃으면 어떻게 될까요?', en: 'What happens when a starfish loses an arm?', zh: '海星掉了一条腕会怎样？' }, choices: ['It grows a new one', 'It cannot move ever', 'It turns into a fish', 'It gets bigger arms only'], answer: 0, hint: { ko: '“regrow”는 다시 자란다는 뜻이에요.', en: '“Regrow” means it grows back.', zh: '“Regrow” 意思是重新长出来。' } },
        { strat: 'Main Idea', q: { ko: '“Weird but True”는 어떤 사실을 말하나요?', en: 'What kind of facts are “weird but true”?', zh: '“奇趣但真实”是什么样的事实？' }, choices: ['Strange but real', 'Made-up stories', 'Scary and false', 'Boring facts'], answer: 0, hint: { ko: '신기하지만 진짜인 사실이에요.', en: 'Surprising facts that are actually real.', zh: '惊奇但真实的事实。' } },
        { strat: 'Feeling', q: { ko: '이런 신기한 사실을 알면 기분이 어떨까요?', en: 'How might you feel learning these surprising facts?', zh: '知道这些奇趣事实你会怎样？' }, choices: ['Amazed / curious', 'Sleepy', 'Angry', 'Hungry'], answer: 0, hint: { ko: '“우와!” 하고 놀라며 더 알고 싶어져요.', en: 'You go “wow!” and want to learn more.', zh: '会“哇！”地想了解更多。' } },
      ],
    },
    'v-wed-1': {
      section: 'story', channel: 'Storyline Online / read-aloud', minutes: 9, search: 'The Rainbow Fish read aloud', id: '',
      title: { ko: '무지개 물고기 (The Rainbow Fish)', en: 'The Rainbow Fish', zh: '彩虹鱼' },
      keyWords: [{ en: 'shiny', ko: '반짝이는' }, { en: 'share', ko: '나누다' }, { en: 'friend', ko: '친구' }],
      summary: { ko: '반짝이는 비늘을 가진 물고기가 처음엔 나누지 않아 외로웠어요. 비늘을 나눠주자 친구가 생겼어요!', en: 'A fish with shiny scales was lonely because he would not share. When he shared his scales, he made friends!', zh: '有闪亮鳞片的鱼因为不分享而孤单。当他分享鳞片后，交到了朋友！' },
      quiz: [
        { strat: 'Main Idea', q: { ko: '이 이야기가 가르쳐 주는 것은?', en: 'What does this story teach us?', zh: '这个故事教我们什么？' }, choices: ['Sharing makes friends', 'Keep everything', 'Fish cannot swim', 'Shiny is best'], answer: 0, hint: { ko: '나눌 때 행복해졌어요.', en: 'He became happy when he shared.', zh: '分享后他变得快乐。' } },
        { strat: 'Feeling', q: { ko: '나누기 전에 무지개 물고기는 어떤 기분이었나요?', en: 'How did the Rainbow Fish feel before he shared?', zh: '分享之前彩虹鱼感觉如何？' }, choices: ['Lonely', 'Happy', 'Sleepy', 'Proud'], answer: 0, hint: { ko: '친구가 없어서 외로웠어요.', en: 'He had no friends, so he was lonely.', zh: '他没有朋友，所以孤单。' } },
        { strat: 'Sequence', q: { ko: '이야기 안에서 친구가 생긴 때는 언제인가요?', en: 'When did he make friends in the story?', zh: '故事里他什么时候交到朋友？' }, choices: ['After he shared his scales', 'Before he did anything', 'When he hid', 'He never did'], answer: 0, hint: { ko: '비늘을 나눠준 뒤예요.', en: 'It happened after he gave scales away.', zh: '在他分享鳞片之后。' } },
        { strat: 'Detail', q: { ko: '무지개 물고기가 특별했던 이유는?', en: 'What made the Rainbow Fish special?', zh: '彩虹鱼有什么特别？' }, choices: ['Shiny scales', 'Big teeth', 'Long legs', 'Loud voice'], answer: 0, hint: { ko: '반짝이는 비늘을 가지고 있었어요.', en: 'He had shiny, sparkly scales.', zh: '他有闪亮的鳞片。' } },
      ],
    },
    'v-wed-2': {
      section: 'story', channel: 'read-aloud / Vooks', minutes: 8, search: 'The Pout Pout Fish read aloud', id: '',
      title: { ko: '툴툴 물고기 (The Pout-Pout Fish)', en: 'The Pout-Pout Fish', zh: '噘嘴鱼' },
      keyWords: [{ en: 'pout', ko: '툴툴대다' }, { en: 'grumpy', ko: '뿌루퉁한' }, { en: 'cheer', ko: '기운을 북돋다' }],
      summary: { ko: '늘 뿌루퉁하던 물고기가 자기는 그런 물고기라고 생각했어요. 하지만 마음을 바꿔 기쁨을 나눌 수 있었어요!', en: 'A grumpy fish thought he was born to be gloomy. But he learned he could change and spread cheer instead!', zh: '一条爱噘嘴的鱼以为自己天生忧郁。但他学会了改变，去传播快乐！' },
      quiz: [
        { strat: 'Main Idea', q: { ko: '이 이야기의 가장 큰 가르침은?', en: 'What is the big lesson of this story?', zh: '这个故事最大的道理是？' }, choices: ['You can change your mood', 'Always be grumpy', 'Fish never smile', 'Frowning is best'], answer: 0, hint: { ko: '기분은 바꿀 수 있어요.', en: 'You can change how you feel.', zh: '心情是可以改变的。' } },
        { strat: 'Word Meaning', q: { ko: '“pout”은 무슨 뜻일까요?', en: 'What does “pout” mean?', zh: '“pout” 是什么意思？' }, choices: ['Make a grumpy face', 'Jump high', 'Sing loudly', 'Swim fast'], answer: 0, hint: { ko: '입을 삐죽 내밀며 뿌루퉁한 표정이에요.', en: 'It is a grumpy, sulky face.', zh: '是噘嘴不开心的表情。' } },
        { strat: 'Feeling', q: { ko: '이야기 끝에서 물고기의 기분은?', en: 'How does the fish feel at the end?', zh: '故事结尾鱼感觉如何？' }, choices: ['Cheerful', 'Sadder', 'Sleepy', 'Scared'], answer: 0, hint: { ko: '이제 기쁨을 나눠요.', en: 'He now spreads cheer.', zh: '他现在传播快乐。' } },
        { strat: 'Inference', q: { ko: '물고기가 배운 것은 무엇일까요?', en: 'What did the fish learn?', zh: '这条鱼学到了什么？' }, choices: ['He is not stuck being grumpy', 'He must stay gloomy', 'He cannot swim', 'Friends are bad'], answer: 0, hint: { ko: '뿌루퉁한 채로 있을 필요가 없어요.', en: 'He does not have to stay grumpy.', zh: '他不必一直噘嘴。' } },
      ],
    },
    'v-thu-1': {
      section: 'science', channel: 'SciShow Kids', minutes: 4, search: 'SciShow Kids why is the ocean salty', id: '',
      title: { ko: '바다는 왜 짤까요?', en: 'Why Is the Ocean Salty?', zh: '海水为什么是咸的？' },
      keyWords: [{ en: 'salt', ko: '소금' }, { en: 'river', ko: '강' }, { en: 'rock', ko: '바위' }],
      summary: { ko: '강물이 바위에서 작은 소금 알갱이를 씻어 바다로 옮겨요. 물은 마르고 소금은 남아서 바다가 짜져요!', en: 'Rivers wash tiny bits of salt from rocks into the sea. Water dries away but the salt stays, so the ocean is salty!', zh: '河水把岩石里的小盐粒冲进大海。水蒸发了，盐留下来，海就变咸了！' },
      quiz: [
        { strat: 'Cause & Effect', q: { ko: '바닷물이 짠 이유는 무엇 때문인가요?', en: 'Why is ocean water salty?', zh: '为什么海水是咸的？' }, choices: ['Rivers carry salt from rocks', 'Someone pours salt in', 'Fish make salt', 'The sun is salty'], answer: 0, hint: { ko: '강이 바위의 소금을 바다로 가져가요.', en: 'Rivers bring salt from rocks to the sea.', zh: '河把岩石中的盐带入海。' } },
        { strat: 'Detail', q: { ko: '소금은 원래 어디에서 오나요?', en: 'Where does the salt come from first?', zh: '盐最初从哪里来？' }, choices: ['Rocks and soil', 'Clouds', 'Boats', 'The moon'], answer: 0, hint: { ko: '바위와 흙 속에 있던 소금이에요.', en: 'It was inside rocks and soil.', zh: '来自岩石和土壤。' } },
        { strat: 'Inference', q: { ko: '물이 마를 때 소금은 어떻게 될까요?', en: 'When the water dries up, what happens to the salt?', zh: '水蒸发时盐会怎样？' }, choices: ['It stays behind', 'It flies away', 'It becomes water', 'It disappears'], answer: 0, hint: { ko: '물만 사라지고 소금은 남아요.', en: 'Only the water leaves; salt stays.', zh: '只有水离开，盐留下。' } },
        { strat: 'Main Idea', q: { ko: '이 영상이 답해주는 질문은?', en: 'What question does this video answer?', zh: '这个视频回答了什么问题？' }, choices: ['Why the ocean is salty', 'How fish sleep', 'Why the sky is blue', 'How to swim'], answer: 0, hint: { ko: '“바다는 왜 짤까?”를 설명해요.', en: 'It explains why the sea is salty.', zh: '它解释海为什么咸。' } },
      ],
    },
    'v-thu-2': {
      section: 'science', channel: 'SciShow Kids', minutes: 4, search: 'SciShow Kids where does rain come from water cycle', id: '',
      title: { ko: '비는 어디에서 올까요? (물의 여행)', en: 'Where Does Rain Come From? (Water Cycle)', zh: '雨从哪里来？（水循环）' },
      keyWords: [{ en: 'evaporate', ko: '증발하다' }, { en: 'cloud', ko: '구름' }, { en: 'rain', ko: '비' }],
      summary: { ko: '바닷물이 햇빛에 데워져 위로 올라가 구름이 돼요. 구름이 무거워지면 비가 되어 내려요!', en: 'The sun warms ocean water, it rises to make clouds, and when clouds get heavy it rains!', zh: '太阳晒暖海水，水上升变成云，云变重就下雨！' },
      quiz: [
        { strat: 'Sequence', q: { ko: '물의 여행에서 가장 먼저 일어나는 일은?', en: 'What happens first in the water cycle?', zh: '水循环里最先发生什么？' }, choices: ['Water rises up as vapor', 'Rain falls', 'A rainbow shows', 'Snow melts'], answer: 0, hint: { ko: '따뜻해진 물이 위로 올라가요.', en: 'Warm water rises up first.', zh: '暖水先上升。' } },
        { strat: 'Cause & Effect', q: { ko: '구름이 무거워지면 어떻게 되나요?', en: 'What happens when clouds get heavy?', zh: '云变重时会怎样？' }, choices: ['It rains', 'The sun hides forever', 'The sea dries up', 'Nothing'], answer: 0, hint: { ko: '무거운 구름에서 비가 내려요.', en: 'Heavy clouds drop rain.', zh: '重云会下雨。' } },
        { strat: 'Word Meaning', q: { ko: '“evaporate”는 무슨 뜻일까요?', en: 'What does “evaporate” mean?', zh: '“evaporate” 是什么意思？' }, choices: ['Turn into vapor and rise', 'Freeze into ice', 'Fall down', 'Get dirty'], answer: 0, hint: { ko: '물이 수증기가 되어 하늘로 올라가는 거예요.', en: 'Water turns to vapor and goes up.', zh: '水变成水汽升上天。' } },
        { strat: 'Main Idea', q: { ko: '이 영상은 무엇을 설명하나요?', en: 'What does this video explain?', zh: '这个视频解释什么？' }, choices: ['How rain is made', 'How to bake', 'Why cats purr', 'How cars go'], answer: 0, hint: { ko: '비가 어떻게 만들어지는지 알려줘요.', en: 'It shows how rain is made.', zh: '它讲雨是怎么形成的。' } },
      ],
    },
    'v-fri-1': {
      section: 'math', channel: 'Numberblocks', minutes: 12, search: 'Numberblocks odds and evens', id: '',
      title: { ko: '홀수와 짝수 (Odds & Evens)', en: 'Odds and Evens', zh: '奇数和偶数' },
      keyWords: [{ en: 'even', ko: '짝수' }, { en: 'odd', ko: '홀수' }, { en: 'pair', ko: '짝' }],
      summary: { ko: '짝수는 둘씩 짝을 지을 수 있어요. 홀수는 하나가 남아요. 4는 짝수, 5는 홀수!', en: 'Even numbers make pairs with none left over. Odd numbers have one left over. 4 is even, 5 is odd!', zh: '偶数能两两配对，奇数会多出一个。4 是偶数，5 是奇数！' },
      quiz: [
        { strat: 'Number Sense', q: { ko: '게 6마리가 남김없이 짝을 지어요. 6은 홀수일까요, 짝수일까요?', en: '6 crabs pair up with none left over. Is 6 odd or even?', zh: '6 只螃蟹两两配对没有剩余。6 是奇数还是偶数？' }, choices: ['odd', 'even', 'both', 'neither'], answer: 1, hint: { ko: '남는 것 없이 짝이 지어지면 짝수예요.', en: 'Pairs with none left over = even.', zh: '配对无剩余就是偶数。' } },
        { strat: 'Number Sense', q: { ko: '다음 중 홀수는 무엇인가요?', en: 'Which number is odd?', zh: '哪个数是奇数？' }, choices: ['4', '6', '7', '8'], answer: 2, hint: { ko: '짝을 지으면 하나가 남는 수예요.', en: 'One is left over when it pairs up.', zh: '配对时会剩一个。' } },
        { strat: 'Number Sense', q: { ko: '물고기 5마리가 둘씩 짝을 지으면 몇 마리가 남을까요?', en: '5 fish pair up two by two. How many are left over?', zh: '5 条鱼两两配对，会剩几条？' }, choices: ['0', '1', '2', '5'], answer: 1, hint: { ko: '2 + 2 + 1 = 5, 하나가 남아요.', en: '2 + 2 + 1 = 5, one is left.', zh: '2 + 2 + 1 = 5，剩一条。' } },
        { strat: 'Sequence', q: { ko: '짝수 세기: 2, 4, 6, ?', en: 'Count the even numbers: 2, 4, 6, ?', zh: '数偶数：2, 4, 6, ?' }, choices: ['7', '8', '9', '5'], answer: 1, hint: { ko: '2씩 커져요.', en: 'They go up by two.', zh: '每次加二。' } },
      ],
    },
    'v-fri-2': {
      section: 'phonics', channel: 'Alphablocks', minutes: 11, search: 'Alphablocks digraphs sh ch', id: '',
      title: { ko: '두 글자 한 소리 (Digraphs: sh, ch)', en: 'Two Letters, One Sound (sh, ch)', zh: '双字母一个音 (sh, ch)' },
      keyWords: [{ en: 'digraph', ko: '두 글자 소리' }, { en: 'sh', ko: '쉬 소리' }, { en: 'ch', ko: '취 소리' }],
      summary: { ko: '두 글자가 만나 한 소리를 내요. s와 h가 만나면 “쉬”, c와 h가 만나면 “취” 소리가 나요!', en: 'Two letters can join to make one sound. s + h says “sh”, and c + h says “ch”!', zh: '两个字母合起来发一个音。s + h 发 “sh”，c + h 发 “ch”！' },
      quiz: [
        { strat: 'Phonics', q: { ko: '“ship”은 어떤 소리로 시작하나요?', en: 'What sound does “ship” start with?', zh: '“ship” 以什么音开头？' }, choices: ['sh', 's', 'ch', 'p'], answer: 0, hint: { ko: 's와 h가 만나 “쉬” 소리예요.', en: 's and h make the “sh” sound.', zh: 's 和 h 发 “sh”。' } },
        { strat: 'Phonics', q: { ko: '“chip”은 어떤 소리로 시작하나요?', en: 'What sound does “chip” start with?', zh: '“chip” 以什么音开头？' }, choices: ['ch', 'sh', 'c', 'h'], answer: 0, hint: { ko: 'c와 h가 만나 “취” 소리예요.', en: 'c and h make the “ch” sound.', zh: 'c 和 h 发 “ch”。' } },
        { strat: 'Word Meaning', q: { ko: '“digraph”는 무슨 뜻일까요?', en: 'What is a “digraph”?', zh: '“digraph” 是什么？' }, choices: ['Two letters, one sound', 'One loud letter', 'Three words', 'A number'], answer: 0, hint: { ko: '두 글자가 한 소리를 내요.', en: 'Two letters that make one sound.', zh: '两个字母发一个音。' } },
        { strat: 'Phonics', q: { ko: '다음 중 “sh” 소리로 시작하는 단어는?', en: 'Which word starts with the “sh” sound?', zh: '哪个词以 “sh” 音开头？' }, choices: ['shell', 'cat', 'chin', 'top'], answer: 0, hint: { ko: '바닷가 조개 “shell”이에요.', en: 'The seashell — “shell”.', zh: '海边的贝壳 “shell”。' } },
      ],
    },
    'v-sat-1': {
      section: 'animal', channel: 'Nat Geo Kids', minutes: 5, search: 'Nat Geo Kids ocean animals fun facts', id: '',
      title: { ko: '바다 동물 재미 사실', en: 'Ocean Animal Fun Facts', zh: '海洋动物趣事' },
      keyWords: [{ en: 'whale', ko: '고래' }, { en: 'huge', ko: '거대한' }, { en: 'clever', ko: '똑똑한' }],
      summary: { ko: '고래는 지구에서 가장 큰 동물이에요. 문어는 아주 똑똑해서 문제를 풀 수 있어요!', en: 'The whale is the biggest animal on Earth. Octopuses are so clever they can solve puzzles!', zh: '鲸是地球上最大的动物。章鱼非常聪明，能解谜！' },
      quiz: [
        { strat: 'Detail', q: { ko: '지구에서 가장 큰 동물은?', en: 'What is the biggest animal on Earth?', zh: '地球上最大的动物是？' }, choices: ['The whale', 'The ant', 'The cat', 'The frog'], answer: 0, hint: { ko: '바다에 사는 거대한 고래예요.', en: 'The huge whale in the ocean.', zh: '海里巨大的鲸。' } },
        { strat: 'Word Meaning', q: { ko: '“huge”는 무슨 뜻일까요?', en: 'What does “huge” mean?', zh: '“huge” 是什么意思？' }, choices: ['Very big', 'Very small', 'Very fast', 'Very quiet'], answer: 0, hint: { ko: '엄청나게 큰 거예요.', en: 'It means very, very big.', zh: '非常非常大。' } },
        { strat: 'Inference', q: { ko: '문어가 문제를 풀 수 있다는 것은 무엇을 뜻하나요?', en: 'If an octopus can solve puzzles, what does that mean?', zh: '章鱼能解谜说明什么？' }, choices: ['It is clever', 'It is sleepy', 'It is slow', 'It is scared'], answer: 0, hint: { ko: '똑똑하다는 뜻이에요.', en: 'It means it is smart.', zh: '说明它很聪明。' } },
        { strat: 'Main Idea', q: { ko: '이 영상의 주제는 무엇인가요?', en: 'What is this video mostly about?', zh: '这个视频主要讲什么？' }, choices: ['Fun facts about sea animals', 'How to draw', 'Space rockets', 'Cooking'], answer: 0, hint: { ko: '바다 동물의 재미있는 사실이에요.', en: 'Fun facts about ocean animals.', zh: '海洋动物的趣事。' } },
      ],
    },
    'v-sat-2': {
      section: 'science', channel: 'SciShow Kids', minutes: 5, search: 'SciShow Kids sink or float experiment', id: '',
      title: { ko: '뜰까 가라앉을까? (Sink or Float)', en: 'Sink or Float?', zh: '会浮还是会沉？' },
      keyWords: [{ en: 'float', ko: '뜨다' }, { en: 'sink', ko: '가라앉다' }, { en: 'experiment', ko: '실험' }],
      summary: { ko: '어떤 물건은 물에 뜨고 어떤 것은 가라앉아요. 직접 넣어보는 실험으로 알아봐요!', en: 'Some things float on water and some sink. We find out by doing an experiment!', zh: '有些东西浮在水上，有些会沉。用实验来找答案！' },
      quiz: [
        { strat: 'Word Meaning', q: { ko: '“float”는 무슨 뜻일까요?', en: 'What does “float” mean?', zh: '“float” 是什么意思？' }, choices: ['Stay on top of water', 'Go to the bottom', 'Fly in the sky', 'Melt away'], answer: 0, hint: { ko: '물 위에 떠 있는 거예요.', en: 'It means to stay on top of the water.', zh: '停在水面上。' } },
        { strat: 'Cause & Effect', q: { ko: '“sink”는 무엇을 뜻하나요?', en: 'What does “sink” mean?', zh: '“sink” 是什么意思？' }, choices: ['Go down to the bottom', 'Rise to the top', 'Turn to ice', 'Get bigger'], answer: 0, hint: { ko: '물속으로 가라앉는 거예요.', en: 'It means to go down under the water.', zh: '沉到水底。' } },
        { strat: 'Detail', q: { ko: '뜰지 가라앉을지 어떻게 알아보나요?', en: 'How do we find out if something floats or sinks?', zh: '怎么知道东西会浮还是沉？' }, choices: ['Try it in water (experiment)', 'Just guess and stop', 'Eat it', 'Throw it away'], answer: 0, hint: { ko: '실험으로 직접 넣어봐요.', en: 'We test it in water — an experiment.', zh: '放进水里做实验。' } },
        { strat: 'Feeling', q: { ko: '실험을 하면 기분이 어떨까요?', en: 'How does doing an experiment feel?', zh: '做实验感觉如何？' }, choices: ['Fun and curious', 'Boring', 'Angry', 'Sleepy'], answer: 0, hint: { ko: '직접 해보니 재미있고 궁금해져요.', en: 'It is fun and makes you curious.', zh: '有趣又让人好奇。' } },
      ],
    },
  },
};
