// Library catalog — series + book metadata only. Licensed page text lives in
// Supabase (table `library_books`, book_id -> pages jsonb), never here.
window.LIBRARY_CATALOG = {
  series: [
    { id: 'magic-tree-house', name: { ko: '매직 트리 하우스', en: 'Magic Tree House', zh: '神奇树屋' }, author: 'Mary Pope Osborne', color: '#2f8a5c' },
  ],
  // ar/rg/wc sourced from the publisher's official AR/R-G reference table for the
  // series (AR = Accelerated Reader level, R/G = grade+level band, W/C = word count).
  books: [
    {
      id: 'library-mth1', seriesId: 'magic-tree-house', order: 1,
      title: 'Dinosaurs Before Dark',
      illustrator: 'Sal Murdocca',
      ar: 2.6, rg: '2C', wc: 4737,
      lexile: 510, genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G2',
      totalPages: 36, // real per-page count from the source book, not a synthetic split
      audio: 'tts',
      // Present only once a real source file has been uploaded to Supabase Storage
      // (bucket below). Absent/null for every other book — gates the "원본 보기"
      // PDF/EPUB tab so it never shows for a book with nothing to display.
      // pageOffset: reader page index 0 (this book's `pages[0]`) is real PDF
      // page 10 (verified against the actual file) — printed-page front
      // matter (cover/title/copyright) fills PDF pages 1-9, which aren't
      // part of the reader's page array at all.
      sourceFile: { type: 'pdf', bucket: 'library-pdfs', path: 'library-mth1.pdf', pages: 57, pageOffset: 10 },
      // Created content (original writing, not reproduced from the licensed text) that
      // frames the real book: pre-reading background knowledge, key vocabulary drawn
      // from the real pages with our own kid-friendly definitions, and an original
      // comprehension quiz modeled on the real plot (not a copy of any publisher's
      // actual AR test, which we don't have access to).
      background: {
        ko: '이야기가 시작되기 전에 알아두면 좋아요! 이 책은 미국 펜실베이니아주 프로그 크릭이라는 작은 마을에 사는 남매, 잭과 애니의 이야기예요. 어느 날 숲에서 신비한 나무집을 발견하면서 모험이 시작돼요. 나무집 안은 오래된 책들로 가득한데, 책 속 그림을 자세히 들여다보면 진짜로 그 장소와 시간으로 이동할 수 있어요! 이번 이야기의 배경은 공룡들이 살던 아주 먼 옛날, 백악기(Cretaceous period)예요. 하늘을 나는 파충류 프테라노돈, 뿔이 세 개인 초식 공룡 트리케라톱스, 그리고 무시무시한 티라노사우루스 렉스까지 만나게 돼요.',
        en: 'Before you start: this story follows Jack and Annie, a brother and sister who live in the small town of Frog Creek, Pennsylvania. One day they find a mysterious tree house in the woods — and it is full of old books. When they look closely at a picture inside one of the books, something amazing happens: the tree house can carry them to that very place and time! This adventure takes them back to the Cretaceous period, a time long ago when dinosaurs ruled the earth. Along the way they meet a flying reptile called a Pteranodon, a three-horned plant-eater called a Triceratops, and a fearsome Tyrannosaurus rex.',
        zh: '在开始阅读之前：这个故事讲述了住在美国宾夕法尼亚州蛙溪镇的杰克和安妮兄妹。一天，他们在树林里发现了一座神秘的树屋，里面装满了古老的书。当他们仔细看书里的一幅图画时，奇妙的事情发生了——树屋能带他们穿越到那个地方和时代！这次冒险把他们带回了恐龙时代——白垩纪。一路上他们遇到了会飞的爬行动物翼龙、长着三只角的植食恐龙三角龙，还有可怕的霸王龙。',
      },
      vocab: [
        ['reptile', 'a cold-blooded animal with scaly or leathery skin', '파충류', '爬行动物'],
        ['creature', 'a living animal, especially one that seems strange or wild', '생물, 동물', '生物'],
        ['ancient', 'from a time very long ago', '고대의, 아주 오래된', '古老的'],
        ['crest', 'a growth of bone or feathers on top of an animal’s head', '(동물 머리 위의) 볏, 돌기', '冠状突起'],
        ['ferns', 'green plants with feathery leaves and no flowers', '고사리류 식물', '蕨类植物'],
        ['cautiously', 'carefully, so as to avoid danger', '조심스럽게', '谨慎地'],
        ['colonies', 'groups of the same kind of animal living closely together', '군집, 무리', '群落'],
        ['medallion', 'a round piece of metal, often worn as jewelry', '메달, 목걸이 장식', '圆形奖章'],
        ['enormous', 'extremely large in size', '거대한', '巨大的'],
        ['bellowing', 'making a loud, deep roaring sound', '울부짖는, 큰 소리로 우는', '吼叫'],
      ],
      quiz: [
        ['What do Jack and Annie find inside the tree house?', ['Toys', 'Books', 'Food', 'Maps'], 'B', 'The tree house is filled with old and new books — that is what first amazes Annie and Jack.'],
        ['What does Jack wish for while looking at the picture of a Pteranodon?', ['To fly a real airplane', 'To read more dinosaur books', 'To go home early', 'To see a real Pteranodon'], 'D', 'Jack says he wishes he could see a Pteranodon for real, right before the tree house starts to spin.'],
        ['What happens to the tree house right after Jack makes his wish?', ['It spins and carries them to another time', 'It catches fire', 'It falls out of the tree', 'It turns into a boat'], 'A', 'The wind picks up, the tree house spins faster and faster, and when it stops, Jack and Annie are in a different, ancient time.'],
        ['What name does Annie give to the Pteranodon?', ['Rex', 'Spike', 'Henry', 'Buddy'], 'C', 'Annie names the Pteranodon Henry, after their neighbor’s dog, because he feels gentle and friendly to her.'],
        ['What does Jack find shining in the tall grass?', ['A dinosaur egg', 'A gold medallion with the letter M', 'A pair of glasses', 'A silver key'], 'B', 'Jack picks up a gold medallion engraved with a fancy letter M, which makes him realize someone else visited before them.'],
        ['What kind of dinosaur do Jack and Annie find guarding a valley full of nests?', ['Triceratops', 'Tyrannosaurus rex', 'Stegosaurus', 'Duck-billed dinosaurs (Anatosaurus)'], 'D', 'The valley is filled with mud nests, and the Anatosauruses — duck-billed dinosaurs — watch over their babies there.'],
        ['How does Jack escape from the Tyrannosaurus rex on the hill?', ['He rides away on the Pteranodon’s back', 'He hides inside a nest', 'He climbs the tallest tree', 'He runs faster than the dinosaur'], 'A', 'Henry the Pteranodon swoops down and carries Jack safely into the sky, away from the charging Tyrannosaurus rex.'],
        ['How do Jack and Annie finally get back home to Frog Creek?', ['The Pteranodon flies them home', 'They walk back through the forest', 'They wish on a picture of the Frog Creek woods', 'They fall asleep and wake up at home'], 'C', 'Jack finds the picture of the Frog Creek woods in the book about Pennsylvania and wishes to go home, and the tree house spins them back.'],
      ],
    },
      {
        "id": "library-mth4",
        "seriesId": "magic-tree-house",
        "order": 4,
        "title": "Pirates Past Noon",
        "illustrator": "Sal Murdocca",
        "ar": 2.8,
        "rg": "2C",
        "wc": 5314,
        "genre": "fiction-fantasy",
        "fictionType": "fiction",
        "grade": "G2",
        "totalPages": 43,
        "audio": "tts",
        "background": {
          "ko": "잭과 애니는 남매예요. 두 사람은 집 근처 숲속에서 마법의 나무 집을 발견하죠. 비 오는 어느 오후, 나무 집은 두 사람을 아주 먼 옛날, 해적들이 살던 따뜻하고 햇살 가득한 섬으로 데려가요. 말하는 앵무새가 그곳으로 이끌지만, 욕심 많은 해적들이 남매를 붙잡아 보물 찾는 일을 도우라고 하면서 모험은 곧 위험해져요. 잭과 애니가 신비한 지도와 고래에 얽힌 수수께끼, 그리고 약간의 용기로 어떻게 빠져나오는지 살펴보세요. 그리고 그 앵무새를 잘 지켜보세요—보이는 게 전부가 아니랍니다!",
          "en": "Jack and Annie are a brother and sister who discover a magic tree house hidden in the woods near their home. On a rainy afternoon, the tree house whisks them far away to a warm, sunny island from the days of pirates, hundreds of years ago. A talking parrot leads them there, but the adventure quickly turns dangerous when greedy pirates capture them and demand help finding buried treasure. As you read, watch how Jack and Annie use a mysterious map, a clever clue about a whale, and a bit of courage to get away. And keep an eye on that parrot—she may be far more than she seems!",
          "zh": "杰克和安妮是一对兄妹，他们在家附近的树林里发现了一座神奇的树屋。在一个下雨的下午，树屋把他们带到了几百年前海盗出没的、阳光明媚的温暖小岛。一只会说话的鹦鹉把他们引到那里，但当贪婪的海盗抓住他们、逼他们帮忙寻找埋藏的宝藏时，冒险很快变得危险起来。阅读时，请留意杰克和安妮如何借助一张神秘的地图、一个关于鲸鱼的巧妙线索和一点勇气逃脱。还要多留心那只鹦鹉——她可不只是一只普通的鸟哦！"
        },
        "vocab": [
          [
            "medallion",
            "a round, flat piece of metal, like a large coin, often kept as something precious",
            "메달; 큰 동전 모양의 둥근 금속 장식",
            "大奖章；圆形金属饰片"
          ],
          [
            "treasure",
            "a collection of very valuable things such as gold, silver, or jewels",
            "보물",
            "财宝；珍宝"
          ],
          [
            "deserted",
            "empty and quiet, with no people around",
            "사람이 없는; 인적이 끊긴",
            "荒无人烟的；无人的"
          ],
          [
            "gale",
            "a very strong and powerful wind",
            "강풍; 세찬 바람",
            "大风；狂风"
          ],
          [
            "shudder",
            "to shake for a moment because you are frightened or cold",
            "(겁이나 추위로) 몸을 부르르 떨다",
            "(因恐惧或寒冷)发抖；战栗"
          ],
          [
            "squawk",
            "a loud, harsh cry made by a bird",
            "(새가) 꽥꽥 우는 소리",
            "(鸟)刺耳地叫；呱呱叫"
          ],
          [
            "dreary",
            "dull, gray, and gloomy",
            "음침한; 우중충한",
            "阴沉的；沉闷的"
          ],
          [
            "mutineers",
            "people who refuse to obey their leader and turn against them",
            "반란자들; 명령을 거부하고 맞서는 사람들",
            "反叛者；哗变的人"
          ],
          [
            "enchantress",
            "a woman who can do magic",
            "마법을 부리는 여자; 마녀",
            "女魔法师；女巫"
          ],
          [
            "invisible",
            "not able to be seen",
            "눈에 보이지 않는",
            "看不见的；隐形的"
          ]
        ],
        "quiz": [
          [
            "Why was Annie so eager to visit the tree house on the rainy morning?",
            [
              "She had a feeling the mysterious M person would show up",
              "She wanted to get out of the rain",
              "She hoped to catch a new pet parrot",
              "She needed to return some library books"
            ],
            "A",
            "Annie insisted on going because she sensed the M person would finally appear that day."
          ],
          [
            "What word did the green parrot keep repeating?",
            [
              "Hello",
              "Too late!",
              "Treasure",
              "Go home"
            ],
            "B",
            "The parrot squawked \"Too late!\" over and over, both in the woods and on the island."
          ],
          [
            "How did Jack and Annie travel back to the time of pirates?",
            [
              "They rowed a boat across the ocean",
              "They followed a treasure map on foot",
              "They pointed at a picture in a book and made a wish",
              "They climbed down a secret tunnel"
            ],
            "C",
            "The tree house carries them wherever they wish when they point to a picture in one of its books."
          ],
          [
            "What did the pirate captain want more than anything else?",
            [
              "A brand-new ship",
              "To make friends with the children",
              "To learn how to read maps by himself",
              "To dig up the buried treasure"
            ],
            "D",
            "The captain captured Jack and Annie only because he was desperate to find the hidden gold."
          ],
          [
            "The map said the gold lay beneath the \"whale's eye.\" What did the whale's eye turn out to be?",
            [
              "A big black rock on the island",
              "A lighthouse on the shore",
              "A cave hidden under the water",
              "The captain's one good eye"
            ],
            "A",
            "Jack and Annie realized the island was shaped like a whale and that a large black rock marked its eye."
          ],
          [
            "Why did the two pirate helpers abandon their captain and run off?",
            [
              "They had found their own treasure map",
              "They wanted to rescue Jack and Annie",
              "They were frightened by the fierce storm and the parrot's warnings",
              "They were simply tired of digging"
            ],
            "C",
            "Scared by the parrot's cries and the coming storm, the two pirates fled to the boat and left the captain behind."
          ],
          [
            "What did Jack end up bringing home from the adventure?",
            [
              "A pirate flag",
              "The gold medallion",
              "The whole treasure chest",
              "A green parrot feather"
            ],
            "B",
            "Jack held on to the gold medallion, which mysteriously turned up in his pocket back home."
          ],
          [
            "Who did the parrot Polly turn out to really be?",
            [
              "A magical enchantress and librarian from Camelot",
              "A pirate hiding in disguise",
              "A neighbor from Jack and Annie's town",
              "Just an ordinary talking bird"
            ],
            "A",
            "Back in the woods the parrot transformed into Morgan le Fay, the enchantress who owns the tree house and collects books."
          ]
        ]
      },
    {
      id: 'library-mth5', seriesId: 'magic-tree-house', order: 5,
      title: 'Night of the Ninjas',
      illustrator: 'Sal Murdocca',
      ar: 2.7, rg: '2C', wc: 5418,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G2',
      totalPages: 42, audio: 'tts',
      background: {
        ko: '잭과 애니는 마법의 나무 집을 타고 일본의 달빛 어린 숲으로 여행을 떠나요. 그곳에는 신비로운 닌자들이 살아요. 나무 집 안에는 귀여운 흰 쥐 피넛이 있는데, 이 쥐가 닌자 방식으로 그들을 안내해줘요. 하지만 무서운 사무라이 전사들이 잭이 가진 돌을 빼앗으려 쫓아오기 시작해요! 잭과 애니는 닌자 스승에게서 자연을 이용하고, 자연이 되고, 자연을 따르는 세 가지 교훈을 배우면서 위험을 헤쳐나가야 해요.',
        en: 'Jack and Annie travel by magic tree house to a moonlit forest in ancient Japan, where shadowy ninja warriors move like ghosts through the trees. Inside the tree house they find a small white mouse named Peanut, who becomes their guide through the ninja way. When fierce samurai warriors begin hunting them, Jack and Annie must learn the three ninja teachings from a mysterious ninja master: use nature, be nature, follow nature. With the moonstone they carry home, they have found one of the four things they need to help their friend Morgan.',
        zh: '杰克和安妮乘坐魔法树屋来到古日本一片月光笼罩的森林，神秘的忍者战士像幽灵一样穿梭于树间。树屋里有一只名叫花生的白色小老鼠，它成了他们的向导，引领他们走上忍者之道。当凶猛的武士开始追杀他们，杰克和安妮必须向神秘的忍者师父学习三条忍者教导：利用自然、成为自然、追随自然。带着他们带回家的月光石，他们已经找到了帮助朋友摩根所需四件事之一。',
      },
      vocab: [
        ['ninja', 'a type of Japanese warrior trained in secret arts of fighting, stealth, and disguise', '닌자(일본 무사)', '忍者'],
        ['samurai', 'a member of the powerful warrior class in ancient Japan, trained to fight and follow a strict code of honor', '사무라이(일본 무사)', '武士（武者）'],
        ['feudal', 'relating to a system where lords owned land and people worked for them in exchange for protection', '봉건 시대의', '封建的'],
        ['dojo', 'a hall or room where martial arts, such as judo or karate, are practiced and taught', '도장(무술 훈련장)', '道场（武术训练室）'],
        ['lantern', 'a portable light with a handle and a case around the flame to protect it from wind', '등불, 랜턴', '灯笼；提灯'],
        ['disguise', 'a change in appearance using clothes, makeup, or other means to hide who you really are', '변장', '伪装；乔装'],
        ['mission', 'an important task that someone is sent to do, often involving danger or secrecy', '임무', '任务；使命'],
        ['scroll', 'a rolled-up length of paper or parchment used for writing, especially in ancient times', '두루마리', '卷轴'],
        ['moonlit', 'lit up or made bright by the light of the moon', '달빛에 물든, 달빛이 비치는', '月光照耀的；月色朦胧的'],
        ['shadow', 'a dark area made when something blocks the light', '그림자', '影子；阴影'],
      ],
      quiz: [
        ['Where does the magic tree house take Jack and Annie?', ['A feudal Japanese castle surrounded by a wide moat', 'A moonlit forest in ancient Japan where ninja warriors live', 'A busy marketplace in ancient Japan during a festival', 'A snowy mountain temple high in the Japanese Alps'], 'B', 'The tree house carries them to a moonlit forest in ancient Japan, exactly the kind of hidden, shadowy place where ninja warriors would train and hide.'],
        ['Why has Morgan sent Jack and Annie on this adventure?', ['To bring back a samurai sword to put in her library', 'To find and carry back a lost story before it disappears forever', 'To learn to fight like the ninjas so they can protect Morgan', 'To deliver a message to the ninja master from Morgan'], 'B', 'As part of their mission to become Master Librarians, Morgan sends them to find and rescue one special lost story.'],
        ['What small creature inside the tree house becomes Jack and Annie\'s guide?', ['A tiny golden firefly that lights the dark paths', 'A white mouse named Peanut who shows them the ninja way', 'A baby fox kit that leads them to the ninja master\'s cave', 'A black cat that appears and disappears in the shadows'], 'C', 'Peanut, a small white mouse living in the tree house, acts as their guide — leading them by instinct on the right paths.'],
        ['Why do the samurai warriors chase Jack and Annie through the forest?', ['The samurai think the children stole food from the village', 'The samurai mistake them for enemy ninja spies', 'The samurai want the moonstone that Jack is carrying', 'The samurai want to capture them and take them to the Emperor'], 'D', 'The samurai want the moonstone — a glowing stone that the ninja master gave Jack as one of the four things he needs to help Morgan.'],
        ['What does Jack learn from his research book about ninjas?', ['Ninjas were always men who wore bright red armor', 'Ninjas trained for years to lift enormous weights', 'Ninjas were shadowy warriors who used disguise and surprise as their main weapons', 'Ninjas refused to use any weapons and fought only with their hands'], 'C', 'Jack reads that ninjas were masters of stealth, disguise, and surprise — appearing and disappearing like shadows, using the darkness and nature to their advantage.'],
        ['How do Jack and Annie escape the samurai who surround them on the mountainside?', ['They throw stones to create a distraction and run for the tree', 'They follow Peanut through a secret forest path the samurai do not know', 'They climb into the cave and block the entrance with heavy rocks', 'They stay completely still and blend into the dark rocks behind them'], 'B', 'Following Peanut\'s lead and the ninja master\'s lesson about following nature, they trust the mouse to guide them on a safe path through the shadows.'],
        ['What is the lost story that Jack and Annie carry back for Morgan?', ['A legend about how the ninja first learned their secret arts from mountain spirits', 'An ancient tale about the power of stillness, patience, and the quiet strength of nature', 'A recipe for the ninja master\'s special moonlit tea ceremony', 'A history of the wars between the ninja and samurai clans'], 'C', 'The lost story is a very old tale about the deepest teaching of the ninja way — that true power comes from stillness, patience, and understanding nature.'],
        ['What important lesson does the ninja master teach Jack and Annie?', ['Speed and strength are the keys to winning every fight', 'The best ninja never sleeps and never eats', 'A good ninja always attacks before the enemy can strike first', 'Real bravery is knowing when to be still and quiet instead of fighting'], 'D', 'The master\'s most important lesson is that true courage is not always loud — sometimes the bravest thing is to be as still and patient as the natural world itself.'],
      ],
    },
    {
      id: 'library-mth7', seriesId: 'magic-tree-house', order: 7,
      title: 'Sunset of the Sabertooth',
      illustrator: 'Sal Murdocca',
      ar: 3.0, rg: '3A', wc: 5040,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G3',
      totalPages: 32,
      audio: 'tts',
      background: {
        ko: '잭과 애니는 마법의 나무 집을 타고 약 35,000년 전, 지구가 두꺼운 얼음으로 뒤덮인 빙하기 세계로 떠나요. 이 얼음의 땅에는 긴 곡선 모양의 엄니를 가진 털북숭이 매머드 떼와, 검처럼 날카로운 송곳니를 가진 무시무시한 검치호가 살고 있었어요. 바위 동굴 속에서 살아가는 초기 인류는 동굴 벽에 동물 그림을 그리고 뼈로 만든 피리로 음악을 연주했답니다. 모건의 비밀 임무를 받은 두 사람은 이 험난하고 낯선 세계에서 용기를 내야 해요.',
        en: 'Jack and Annie ride their magic tree house back about thirty-five thousand years to the Ice Age — a frozen world of howling winds and endless snow. Here woolly mammoths march in great herds, and the fearsome saber-toothed tiger prowls the tundra on enormous curved fangs. In caves carved out of the rock, early people paint animals on the walls and play music on bone flutes. Sent on a secret mission by the enchantress Morgan, Jack and Annie must summon every bit of courage they have to survive this wild and ancient world.',
        zh: '杰克和安妮乘坐魔法树屋，回到了大约三万五千年前的冰河时代——一个狂风呼啸、白雪皑皑的冰封世界。在这里，猛犸象成群结队地行走，凶猛的剑齿虎在冰原上悄悄游荡，它们的巨大弯曲尖牙令人胆战心惊。早期人类住在岩石洞穴里，在洞壁上画动物，用骨制笛子演奏音乐。受魔法师摩根的秘密任务委托，杰克和安妮必须鼓起全部勇气，在这个荒野而古老的世界中生存下来。',
      },
      vocab: [
        ['Ice Age', 'a long period in history when much of the earth was covered in thick sheets of ice', '빙하기', '冰河时代'],
        ['mammoth', 'a huge prehistoric animal like an elephant with very long curved tusks and shaggy hair, now extinct', '매머드', '猛犸象'],
        ['saber-toothed', 'having very long, curved, sharp upper fangs shaped like a sword', '검치의(검처럼 긴 이빨을 가진)', '剑齿的'],
        ['glacier', 'a huge, slow-moving mass of ice that covers mountains and valleys', '빙하', '冰川'],
        ['tundra', 'a wide flat land in very cold regions where the ground stays frozen and no trees can grow', '툰드라(동토 지대)', '冻原'],
        ['clan', 'a group of related families or people who live, hunt, and travel together', '씨족, 무리', '氏族；部落'],
        ['extinct', 'no longer alive anywhere in the world; a whole type of animal has completely died out', '멸종한', '灭绝的'],
        ['tusk', 'a very long, pointed tooth that sticks out of an animal\'s mouth, like on an elephant or mammoth', '엄니', '长牙；象牙'],
        ['flute', 'a thin musical instrument you blow across to make music; early people made them from animal bones', '피리, 플루트', '笛子'],
        ['ancestor', 'a person or animal that lived long ago and from whom others are descended', '조상', '祖先'],
      ],
      quiz: [
        ['Where does the tree house take Jack and Annie in this story?', ['Ancient Egypt during the pharaohs', 'A tropical jungle in South America', 'The Ice Age, about 35,000 years ago', 'A Viking ship in the North Sea'], 'C', 'The tree house carries them back to the Ice Age, a frozen time of mammoths and saber-toothed tigers.'],
        ['What animal do Jack and Annie encounter that is now completely extinct?', ['A giant panda', 'A woolly mammoth with long curved tusks', 'A great white shark', 'A Komodo dragon'], 'B', 'Woolly mammoths, those huge shaggy relatives of the elephant, thrived in the Ice Age but died out long ago.'],
        ['How do the Ice Age people Jack and Annie meet protect themselves from the cold?', ['They live in caves and keep fires burning for warmth', 'They build wooden huts covered in snow', 'They wear suits made from mammoth tusks', 'They never feel cold because they have very thick skin'], 'A', 'The clan shelters in deep caverns, surviving the bitter cold with fire, animal skins, and each other.'],
        ['What does Annie do when a huge saber-toothed tiger faces her?', ['She throws her backpack to distract it', 'She tells Jack to run as fast as he can', 'She climbs the nearest tree', 'She stays very still and speaks softly, trying not to frighten it'], 'D', 'Annie\'s gentle way with animals — staying calm and showing she means no harm — is her best defense.'],
        ['What decorates the walls inside the cave where the clan lives?', ['Paintings of the animals the Ice Age people hunted and lived beside', 'Carved maps showing where to find food', 'Lists of rules for the clan written in symbols', 'Drawings of the magic tree house and the future'], 'A', 'The clan\'s cave art shows the animals of their world — a breathtaking record painted on rock thousands of years ago.'],
        ['Why is the woolly mammoth so well suited to life in the Ice Age?', ['It can sleep under the ice without getting cold', 'Its thick shaggy coat and heavy layer of body fat protect it from freezing temperatures', 'It eats only snow and never needs other food', 'Its enormous size stops the wind from reaching its skin'], 'B', 'The woolly mammoth\'s long hair and fat layer were exactly what it needed to thrive in the brutal cold of the Ice Age.'],
        ['Who sent Jack and Annie on this adventure?', ['An old clan elder who asked them to bring back a message', 'The woolly mammoth, who spoke to them in a dream', 'Morgan le Fay, the enchantress who owns the tree house', 'A mysterious book that appeared in their bedroom'], 'C', 'Morgan le Fay sends Jack and Annie on their missions as they work toward becoming true Master Librarians.'],
        ['What happens to the saber-toothed tiger and the woolly mammoth thousands of years after the Ice Age?', ['They evolve into modern lions and elephants', 'They are still alive in very cold places today', 'They are kept safely in zoos around the world', 'They become extinct and die out completely'], 'D', 'Both the saber-toothed tiger and the woolly mammoth became extinct long ago — they live on only in fossils and books.'],
      ],
    },
    {
      id: 'library-mth9', seriesId: 'magic-tree-house', order: 9,
      title: 'Dolphins at Daybreak',
      illustrator: 'Sal Murdocca',
      ar: 3.1, rg: '3A', wc: 4756,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G3',
      totalPages: 39, audio: 'tts',
      background: {
        ko: '잭과 애니는 마법의 나무 집을 타고 새벽녘의 바닷속 세계로 들어가요. 나무 집 밖에는 작은 잠수함 꼬투리 두 개가 기다리고 있어요! 산호초와 알록달록한 물고기가 가득한 아름다운 바닷속이지만, 무서운 상어도 있어요. 다행히 돌고래 두 마리가 용감하게 그들을 안내해줘요. 잭과 애니는 돌고래가 음파를 이용해 길을 찾는다는 것도 알게 되고, 바닷속의 신비도 탐험하면서, 바다를 소중히 지켜야 한다는 중요한 교훈을 얻게 돼요.',
        en: 'Jack and Annie travel by magic tree house to the ocean floor at daybreak, where two miniature submarine pods are waiting outside. The underwater world is breathtaking — a coral reef alive with colorful fish and shimmering light. But danger is close: sharks circle nearby. Two friendly dolphins become their brave guides through the reef and the open ocean. Jack and Annie learn how dolphins use sonar to find their way, discover an ancient sailor\'s story about dolphins saving lives, and come home with a deep respect for the ocean and all the life it holds.',
        zh: '杰克和安妮乘坐魔法树屋来到黎明时分的海底世界，树屋外停着两个小型潜水艇舱！海底世界美不胜收——充满活力的珊瑚礁、五彩缤纷的鱼儿和闪闪发光的水光。但危险就在附近：鲨鱼在附近盘旋。两只友善的海豚成了他们勇敢的向导，带领他们穿越礁石和大海。杰克和安妮了解到海豚如何利用声呐寻路，发现了一个关于海豚救人的古老水手故事，带着对海洋和其中所有生命的深深敬意回到了家。',
      },
      vocab: [
        ['coral', 'a hard, colorful, rock-like material formed by tiny sea creatures that builds up to create reefs', '산호', '珊瑚'],
        ['dolphin', 'a smart, friendly sea mammal that breathes air, lives in groups, and communicates with clicking sounds', '돌고래', '海豚'],
        ['submarine', 'a vehicle that travels underwater, with a sealed hull to keep water out', '잠수함', '潜水艇'],
        ['current', 'a steady movement of water flowing in a particular direction through the ocean or a river', '(물)살, 해류', '水流；洋流'],
        ['kelp', 'a large, brown seaweed that grows in cold ocean waters and can form tall underwater forests', '다시마(해조류)', '海带；巨藻'],
        ['tide pool', 'a small rocky pool left along a shore when the tide goes out, full of small sea creatures', '조수 웅덩이', '潮池'],
        ['reef', 'a ridge of rock or coral just below or at the surface of the sea', '(해저) 암초, 산호초', '礁石；珊瑚礁'],
        ['sonar', 'a system that uses sound waves to locate objects underwater, also used by dolphins and bats', '음파 탐지 장치(소나)', '声呐'],
        ['abyss', 'a very deep, dark place in the ocean or the earth, so deep it seems to have no bottom', '심연(매우 깊은 곳)', '深渊'],
        ['moray eel', 'a long, snake-like fish that hides in rocks and coral in the ocean', '곰치(바다 뱀장어)', '海鳗；裸胸鳝'],
      ],
      quiz: [
        ['Where does the magic tree house take Jack and Annie?', ['The bottom of a deep jungle river', 'The surface of the Atlantic Ocean in a storm', 'An underwater coral reef at daybreak', 'A frozen Arctic sea beneath the ice'], 'C', 'The tree house takes them to a beautiful coral reef in the ocean just as the light of dawn is beginning to filter through the water.'],
        ['What do Jack and Annie find waiting outside the tree house when they arrive?', ['A pair of flippers and diving masks', 'Two miniature submarine pods ready to use', 'A raft tied to the tree house rope', 'A message from Morgan written on a bottle'], 'B', 'Two small submarine pods are floating just outside the tree house, perfectly sized for Jack and Annie to use underwater.'],
        ['Who guides Jack and Annie through the dangerous parts of the reef?', ['A wise old sea turtle', 'A pair of friendly dolphins', 'A young mermaid who lives near the coral', 'An octopus that knows a secret passage'], 'B', 'Two dolphins swim alongside Jack and Annie, leading them away from danger and helping them find their way through the reef.'],
        ['What special ability do dolphins use to find food and find their way in the dark ocean?', ['They have eyes that can see in complete darkness', 'They remember the shape of every rock on the ocean floor', 'They send out sound waves and listen for the echo to locate things — called sonar', 'They follow the trail of glowing fish that only they can see'], 'C', 'Dolphins produce clicking sounds and listen for the echoes that bounce back, giving them a detailed picture of what is around them even in murky water.'],
        ['What danger circles near the submarine pods when Jack and Annie first enter the water?', ['A giant squid with long grasping arms', 'Sharks circling close to the pods', 'A school of stinging jellyfish', 'A strong underwater current pulling them away'], 'B', 'Sharks are circling near the entrance to the reef, making it dangerous for Jack and Annie to move freely at first.'],
        ['What does Jack read about in his research book that links sailors and dolphins?', ['How ancient sailors trained dolphins to carry their messages', 'An ancient sailor\'s tale about dolphins saving the lives of drowning people', 'A story about a sailor who discovered the first coral reef', 'How dolphins helped ancient fishermen find fish'], 'B', 'Jack\'s book tells old stories of sailors rescued from shipwrecks and storms by dolphins, which explains why sailors have always honored them.'],
        ['What brave thing does Annie do when the sharks come too close?', ['She bangs on her pod to make loud noise that scares them', 'She throws her backpack to distract them', 'She swims toward the sharks to draw their attention away from Jack', 'She signals the dolphins to attack the sharks'], 'C', 'In a act of pure courage, Annie swims toward the sharks, drawing them away from Jack while he gets to safety.'],
        ['What important idea do Jack and Annie carry home from their ocean adventure?', ['The ocean is too dangerous for people to ever enter', 'Dolphins should be kept in aquariums where they are safe', 'The ocean is just as rich and full of life as the land, and it deserves our protection', 'Only professional scientists should study the ocean'], 'D', 'Seeing the incredible life of the coral reef makes Jack and Annie realize the ocean is a world as complex and precious as the land above it.'],
      ],
    },
    {
      id: 'library-mth10', seriesId: 'magic-tree-house', order: 10,
      title: 'Ghost Town at Sundown',
      illustrator: 'Sal Murdocca',
      ar: 3.0, rg: '3A', wc: 5207,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G3',
      totalPages: 40, audio: 'tts',
      background: {
        ko: '잭과 애니는 마법의 나무 집을 타고 해가 지는 서부 개척 시대의 유령 마을로 가요. 텅 빈 거리, 삐걱거리는 마루, 흔들리는 유리문… 분위기가 으스스해요. 하지만 유령 카우보이 슬림을 만나고 나서, 이곳이 이야기로 가득 찬 특별한 장소라는 걸 알게 돼요. 슬림은 잭과 애니가 마스터 사서가 되기 위한 여정에서 잃어버린 이야기를 찾도록 도와줘요. 그런데 갑자기 들소 떼가 달려오고, 밤이 되면서 진짜 유령의 기운이 온 마을에 퍼져나가요.',
        en: 'Jack and Annie travel by magic tree house to a deserted Wild West ghost town at sundown. Empty streets, creaking floorboards, and swinging saloon doors create an eerie mood. But when they meet Slim, a friendly ghost who was once a storyteller, they discover the town is full of lost tales waiting to be found. Slim helps them on their quest to become Master Librarians. Then a longhorn cattle stampede roars through town, and as the sun sinks below the horizon, the whole town fills with the unmistakable chill of real ghosts.',
        zh: '杰克和安妮乘坐魔法树屋来到日落时分一座废弃的西部鬼城。空荡荡的街道、吱呀作响的地板和摇摆的酒馆门营造出一种阴森的气氛。但当他们遇到斯利姆——一个曾经是说故事人的友善鬼魂时，他们发现这座城镇里满是等待被发现的失落故事。斯利姆帮助他们踏上成为大师级图书管理员的旅程。随后一群长角牛呼啸着穿过镇子，当太阳沉落地平线下，整个镇子充满了真实鬼魂的寒意。',
      },
      vocab: [
        ['ghost town', 'a town that used to have people living in it but is now empty and abandoned', '유령 마을(폐허가 된 마을)', '鬼城（废弃的小镇）'],
        ['saloon', 'a bar or pub in the Wild West where cowboys gathered to drink and socialize', '서부 시대 술집(살롱)', '西部酒吧（沙龙）'],
        ['lasso', 'a long rope with a loop at the end, used by cowboys to catch cattle or horses', '올가미 밧줄', '套索'],
        ['rodeo', 'a competition where cowboys show their skills at riding horses and roping cattle', '로데오(카우보이 경기)', '牛仔竞技表演'],
        ['outlaw', 'a person who breaks the law and often hides from the authorities, like a bandit or robber', '무법자', '歹徒；不法之徒'],
        ['sheriff', 'the person chosen to be the chief law officer of a county or town in the American West', '보안관', '（美国西部的）县警长'],
        ['spurs', 'sharp metal points attached to the heels of a cowboy\'s boots, used to urge a horse to go faster', '(카우보이 부츠의) 박차', '马刺'],
        ['stampede', 'a sudden, wild rush of a large group of frightened animals, especially cattle or horses', '(가축 떼의) 돌진, 폭주', '（牲畜群）惊跑；踩踏'],
        ['legend', 'an old story handed down through generations that may or may not be completely true', '전설', '传说；民间故事'],
        ['harmonica', 'a small musical instrument played by blowing air in and out through a row of metal reeds', '하모니카', '口琴'],
      ],
      quiz: [
        ['Where does the magic tree house take Jack and Annie?', ['A misty mountain town in frontier Colorado', 'A Wild West ghost town at sundown', 'A busy gold rush camp in California', 'A desert canyon in the American Southwest'], 'B', 'The tree house carries them to a deserted Wild West ghost town just as the sun is setting, filling the empty streets with eerie shadows.'],
        ['What is Morgan\'s mission for Jack and Annie in this story?', ['To win a horse race against outlaws', 'To find a lost story hidden somewhere in the ghost town', 'To bring back a piece of real gold from the mine', 'To rescue a stranded cowboy from a flooded river'], 'A', 'As part of their quest to become Master Librarians, Morgan sends them to find one special lost story before it disappears forever.'],
        ['Who is Slim, and what is unusual about him?', ['A real cowboy who hid from outlaws in the old saloon', 'A friendly ghost who was once a great storyteller', 'A sheriff who never left town even after everyone else did', 'A traveling musician who got lost in the ghost town'], 'D', 'Slim is a friendly ghost — once a beloved storyteller — who drifted back to the town he loved even after his own death.'],
        ['What strange things happen in the saloon that make Jack and Annie feel uneasy?', ['The piano plays by itself and dark shadows move across the walls', 'The doors lock on their own and the lights go out', 'A voice calls their names from behind the bar', 'Books fly off the shelves on their own'], 'A', 'An unseen force plays the old piano on its own and ghostly shadows move around the walls, giving the saloon a truly haunted feeling.'],
        ['What frightening event suddenly roars through the ghost town?', ['A flash flood pours down the main street', 'A tornado spins through the center of town', 'A longhorn cattle stampede charges through the streets', 'A band of outlaws on horseback rides in shooting guns'], 'A', 'A herd of longhorn cattle stampedes through the empty town, forcing Jack and Annie to scramble for safety.'],
        ['How does Slim help Jack and Annie escape the danger?', ['He summons a ghost horse to carry them out of town', 'He makes himself solid for a moment and lifts them onto a roof', 'He guides them to a safe hiding place high on a rooftop above the street', 'He scares the cattle away with a loud ghost howl'], 'C', 'Slim, knowing every inch of the old town, leads Jack and Annie to a rooftop where the stampeding longhorns cannot reach them.'],
        ['What is the lost story that Jack and Annie must find and carry back?', ['A legend of how the Wild West was settled by brave pioneer families', 'A recipe for the best cowboy chili ever cooked on the plains', 'The legend of a ghost cowboy who kept the memory and spirit of the old West alive', 'A true account of the biggest gold strike in history'], 'B', 'The lost story is the legend of the ghost cowboy himself — a tale of loyalty to place and people that would vanish if not preserved.'],
        ['What does this adventure mean for Jack and Annie\'s larger goal?', ['They give up and decide the mission is too dangerous', 'The ghost town was the wrong place and they must try again', 'They find no story and return empty-handed to the tree house', 'It is another step forward on their journey toward becoming Master Librarians'], 'D', 'Each completed mission brings Jack and Annie closer to earning the title of Master Librarian, the goal Morgan has set for them.'],
      ],
    },
    {
      id: 'library-mth11', seriesId: 'magic-tree-house', order: 11,
      title: 'Lions at Lunchtime',
      illustrator: 'Sal Murdocca',
      ar: 3.0, rg: '3A', wc: 5292,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G3',
      totalPages: 42, audio: 'tts',
      background: {
        ko: '잭과 애니는 마법의 나무 집을 타고 아프리카 사바나로 여행을 떠나요. 때는 정오, 따가운 햇빛 아래 대평원이 펼쳐져 있어요. 수천 마리의 누 떼가 강을 건너는 대이동이 한창이고, 마사이 전사 아주마가 야생에서 안전하게 지내는 방법을 가르쳐줘요. 강에는 악어가 득실거리고, 어미를 잃은 새끼 누도 있어요. 그리고 물론, 점심을 먹으러 나온 사자들도 있답니다! 잭과 애니는 이 모험을 통해 아프리카 자연의 경이로움을 느끼고 생명의 소중함을 배워요.',
        en: 'Jack and Annie travel by magic tree house to the African savanna at lunchtime, where the midday sun blazes over the endless grasslands. Thousands of wildebeest are crossing the river in the famous Great Migration, and a Masai warrior named Ajuma teaches them how to stay safe among wild animals. The river is full of crocodiles, a baby wildebeest is separated from the herd, and lions — out for their midday meal — are watching from the tall grass. Jack and Annie discover the wonders of Africa\'s wildlife and learn important lessons about courage and the circle of life.',
        zh: '杰克和安妮乘坐魔法树屋在午餐时间来到非洲大草原，正午的阳光炙烤着一望无际的草原。数千只角马正在进行著名的大迁徙，穿越河流，马赛族战士阿朱马教他们如何在野生动物中保持安全。河里满是鳄鱼，一只小角马与兽群失散，而狮子——出来觅食——正从高高的草丛中虎视眈眈。杰克和安妮发现了非洲野生动物的奇观，学到了关于勇气和生命循环的重要教训。',
      },
      vocab: [
        ['savanna', 'a wide, flat, grassy plain in Africa or other tropical regions with scattered trees and a dry season', '사바나(열대 초원)', '热带草原（大草原）'],
        ['wildebeest', 'a large African antelope with a shaggy mane and curved horns, famous for migrating in huge herds', '누(아프리카 야생 동물)', '角马（非洲羚羊）'],
        ['migration', 'the regular seasonal journey of animals from one place to another to find food or better weather', '이동(철새나 동물의 계절적)', '迁徙；迁移'],
        ['predator', 'an animal that hunts, kills, and eats other animals to survive', '포식자', '捕食者'],
        ['warrior', 'a skilled and brave fighter, especially one who belongs to a group that has a strong tradition of fighting', '전사(용사)', '战士；勇士'],
        ['crocodile', 'a large reptile with a long body, thick scaly skin, and powerful jaws, that lives near rivers in Africa', '악어', '鳄鱼'],
        ['herd', 'a large group of animals of the same kind that live and move together', '(동물의) 떼', '（动物）群'],
        ['acacia', 'a type of thorny tree or shrub found in Africa and warm regions, with feathery leaves and often flat-topped branches', '아카시아(나무)', '金合欢（非洲刺槐）'],
        ['territory', 'an area of land that an animal defends as its own and does not allow other animals to enter', '(동물의) 영역, 세력권', '（动物的）领地；领域'],
        ['drought', 'a long period with little or no rain that causes rivers and water holes to dry up', '가뭄', '干旱'],
      ],
      quiz: [
        ['Where does the magic tree house take Jack and Annie?', ['The wild African savanna during the Great Migration', 'A jungle river in the heart of the Congo', 'An open desert at the edge of the Sahara', 'A crater lake in the mountains of Tanzania'], 'A', 'The tree house carries them to the African savanna at the peak of the Great Migration, when thousands of wildebeest thunder across the plains.'],
        ['What is the Great Migration?', ['The yearly journey of African elephants to the sea', 'The yearly journey of thousands of wildebeest and zebra across the savanna and rivers', 'The movement of Masai warriors from one grazing land to another', 'The path lions follow when they change their territory each year'], 'B', 'Each year millions of wildebeest, zebra, and other animals travel huge distances following the rains and fresh grass — a spectacle unlike any other on Earth.'],
        ['Who helps Jack and Annie learn how to stay safe on the savanna?', ['A young elephant that becomes their guide', 'Ajuma, a Masai warrior who shares his knowledge of the wild', 'An old lion that decides not to eat them', 'Morgan le Fay, who appears disguised as a park ranger'], 'B', 'Ajuma is a skilled Masai warrior who knows how to live alongside the wildlife of the savanna and generously shares that knowledge with Jack and Annie.'],
        ['What is the problem that Jack and Annie must help solve?', ['A lion cub is stuck in a ravine and cannot get out', 'A baby wildebeest has been separated from the herd and cannot cross the river', 'Ajuma has lost his spear and cannot protect himself', 'The Masai\'s cattle have wandered into lion territory'], 'D', 'A small wildebeest separated from the herd stands alone at the river, unable to make the dangerous crossing without the protection of the group.'],
        ['Why is crossing the river the most frightening part of the journey?', ['The river is too wide to swim across safely', 'The current is so strong it would sweep the wildebeest away', 'The river is full of crocodiles waiting to ambush animals that enter the water', 'The banks are too steep for a small wildebeest to climb out on the other side'], 'A', 'Nile crocodiles lie in wait in the river during the migration, lunging at animals that enter the water — making the crossing a life-or-death challenge.'],
        ['How do Jack and Annie help the baby wildebeest cross the river?', ['They carry it across on their backs', 'They build a small bridge using fallen branches', 'They distract the crocodiles while the wildebeest dashes across a safer shallow spot', 'They wave their arms to scare the crocodiles to the far bank'], 'C', 'By drawing the crocodiles\' attention at one spot, Jack and Annie give the baby wildebeest a window to dash across where the danger is less.'],
        ['What story does Ajuma share with Jack and Annie?', ['A legend about how the first wildebeest was created from the wind and dry grass', 'An ancient Masai warrior\'s tale about the lions of the savanna and their bond with the land', 'A story about how the Masai people first came to live on the great plains', 'A tale of a hero who wrestled a crocodile to save his people'], 'C', 'Ajuma tells an ancient Masai story about lions, one of the powerful animals his people have shared the savanna with for countless generations.'],
        ['What does Jack learn from his research book about lions?', ['Lions hunt all day and rarely sleep', 'Lions live only in very small family groups with one lion per pride', 'Lions are the only big cats that can roar loud enough to be heard five miles away', 'Lions rest and sleep during the hottest part of the day and do most of their hunting at dusk and night'], 'D', 'Jack\'s book explains that lions are most active in the cool of morning and evening, spending the blazing midday hours resting in the shade.'],
      ],
    },
    {
      id: 'library-mth14', seriesId: 'magic-tree-house', order: 14,
      title: 'Day of the Dragon King',
      illustrator: 'Sal Murdocca',
      ar: 3.3, rg: '3B', wc: 5565,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G3',
      totalPages: 45, audio: 'tts',
      background: {
        ko: '잭과 애니는 마법의 나무 집을 타고 2,000년도 더 된 고대 중국으로 가요. 그 시대의 황제는 "용왕"이라는 별명을 가진 진시황이에요. 그는 자신이 원하지 않는 모든 책을 불태우도록 명령했어요. 잭과 애니의 임무는 영원히 사라질지도 모르는 아름다운 시가 담긴 두루마리를 구하는 거예요. 젊은 학자와 비단 짜는 여인의 도움을 받아, 두 사람은 황궁과 만리장성, 그리고 진시황의 병마용이 있는 곳까지 모험을 펼쳐요.',
        en: 'Jack and Annie travel by magic tree house to ancient China more than two thousand years ago, during the reign of the First Emperor — nicknamed the Dragon King. He has ordered all books burned except those that support his own version of history. Jack and Annie\'s mission is to rescue a scroll of ancient poetry before it is destroyed forever. With the help of a young scholar and a silk weaver, they explore the imperial palace, the Great Wall of China, and the underground realm of the Dragon King\'s terracotta warriors.',
        zh: '杰克和安妮乘坐魔法树屋来到两千多年前的中国古代，那时是第一位皇帝的统治时期，他有个绰号叫"龙王"。他下令焚烧所有不符合他历史观的书籍。杰克和安妮的任务是抢救一卷即将被毁灭的古代诗歌卷轴。在一位年轻学者和一位织绸女工的帮助下，他们探访了皇宫、长城，以及龙王兵马俑的地下世界。',
      },
      vocab: [
        ['emperor', 'the all-powerful ruler of an empire, who has complete control over a vast country and its people', '황제', '皇帝'],
        ['scroll', 'a roll of paper or animal skin with writing on it, used before books were invented', '두루마리', '卷轴'],
        ['silk', 'a smooth, shiny, very fine fabric woven from threads spun by silkworms, highly valued in ancient China', '비단', '丝绸'],
        ['scholar', 'a person who has studied deeply and knows a great deal, especially about literature, history, or science', '학자', '学者'],
        ['dynasty', 'a series of rulers from the same family who rule one after another over a long period', '왕조', '王朝'],
        ['jade', 'a hard, usually green precious stone used in ancient China and other cultures to make jewelry and ornaments', '비취(옥)', '玉（翡翠）'],
        ['terracotta', 'a brownish-red baked clay used to make pottery, statues, tiles, and the famous life-size warrior figures of ancient China', '테라코타(구운 점토)', '赤陶（陶土）'],
        ['decree', 'an official order from a ruler or government that everyone must obey', '칙령, 포고령', '法令；敕令'],
        ['bamboo', 'a tall, fast-growing grass with hollow woody stems, used in Asia for building, food, paper, and many other purposes', '대나무', '竹子'],
        ['calligraphy', 'beautiful handwriting done as an art form, especially important in Chinese and Japanese cultures', '서예(붓글씨)', '书法；毛笔字'],
      ],
      quiz: [
        ['Where does the magic tree house take Jack and Annie?', ['Ancient China during the rule of the First Emperor', 'A medieval kingdom in Japan during the age of samurai', 'The Silk Road in Central Asia hundreds of years ago', 'An ancient Chinese fishing village on the Yangtze River'], 'A', 'The tree house carries them to ancient China more than two thousand years ago, at the height of the First Emperor\'s fearsome power.'],
        ['Why is the First Emperor called the Dragon King, and what has he ordered?', ['He keeps a dragon as a pet and orders all rivers to be dammed', 'He loves dragons and orders dragon statues built in every city', 'He wants only his version of history to survive, so he orders all other books burned', 'He wears dragon armor and orders every house to display a dragon flag'], 'A', 'The Dragon King has ordered that any book not approved by him must be burned — threatening to destroy centuries of Chinese knowledge and poetry forever.'],
        ['What is Morgan\'s special mission for Jack and Annie in ancient China?', ['To bring back a piece of the Great Wall as proof they visited', 'To deliver a secret message to the Emperor\'s chief advisor', 'To rescue an ancient scroll of poetry that would otherwise be destroyed', 'To find a piece of jade hidden somewhere inside the imperial palace'], 'C', 'Morgan sends them to save a scroll of beautiful ancient poems — irreplaceable works of art that the Emperor\'s book-burning would erase from history.'],
        ['Who helps Jack and Annie carry out their dangerous mission?', ['An old hermit living in a cave near the Wall', 'A young scholar and a silk weaver who work together to hide books', 'The Emperor\'s youngest son, who secretly hates his father\'s decree', 'A traveling merchant who smuggles books in hidden carts'], 'B', 'A young scholar and a silk weaver, both risking great danger, work together to help Jack and Annie find and hide the precious scroll.'],
        ['What does Jack learn about the Great Wall of China from his research book?', ['It was built to mark the boundary between two rivers', 'It was built to keep tigers and wild animals out of the farmlands', 'It was built to protect China against invasions from the northern steppes', 'It was originally a canal wall built to control flooding'], 'C', 'The Great Wall was constructed to defend China against raids by nomadic warriors from the north — one of the largest building projects in all of human history.'],
        ['What are the terracotta warriors, and why does the Emperor have them built?', ['They are clay decorations placed around the Emperor\'s palace gardens', 'They are life-size clay soldiers made to guard the Emperor\'s burial tomb in the afterlife', 'They are statues of past emperors placed along the Silk Road', 'They are training dummies used to teach real soldiers how to fight'], 'C', 'The Emperor ordered thousands of life-size clay soldiers, horses, and chariots to be buried with him so they could protect and serve him in the next world.'],
        ['How do Jack and Annie escape when the Emperor\'s guards try to capture them?', ['They disguise themselves as silk weavers and walk out the front gate', 'They escape through a hidden tunnel in the palace wall', 'They bribe a guard with a piece of jade they found in the palace', 'The young scholar creates a distraction that allows them to run'], 'D', 'The scholar shows them a secret tunnel hidden in the palace walls, giving them a way to escape without the guards catching them.'],
        ['What does the rescued scroll contain, and why does it matter?', ['A list of the Emperor\'s enemies that proves how cruel he was', 'An ancient map showing where treasures are buried across China', 'The Emperor\'s secret diary, full of confessions about his crimes', 'Beautiful ancient poems that express the hopes and feelings of people who lived two thousand years ago'], 'D', 'The scroll carries poems of great beauty — voices from two thousand years ago that would have been silenced forever if Jack and Annie had not saved them.'],
      ],
    },
    {
      id: 'library-mth15', seriesId: 'magic-tree-house', order: 15,
      title: 'Viking Ships at Sunrise',
      illustrator: 'Sal Murdocca',
      ar: 3.3, rg: '3B', wc: 5686,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G3',
      totalPages: 43,
      audio: 'tts',
      background: {
        ko: '지금으로부터 천 년도 더 된 옛날, 유럽에는 \'암흑시대\'라고 불리던 시절이 있었어요. 그때는 사람들이 살기가 무척 힘들었고, 책은 아주 귀하고 소중했답니다. 아일랜드 해안의 작은 섬에서는 수도사들이 함께 모여 살면서 직접 농사를 짓고, 손으로 한 자 한 자 아름다운 책을 베껴 썼어요. 하지만 바다는 위험했어요. 뱀 머리를 새긴 배를 탄 사나운 바이킹들이 보물을 찾아 바다를 누볐거든요. 이 이야기에서 오빠와 여동생은 잃어버린 특별한 이야기 한 편을 찾으러 그 섬으로 시간 여행을 떠나요.',
        en: 'Long ago, more than a thousand years back, part of Europe went through a time called the Dark Ages, when life was hard and books were rare and precious. On a tiny island off the coast of Ireland, a group of monks lived together in a monastery, growing their own food and copying stories by hand into beautiful books. But the seas were dangerous: fierce Viking raiders sailed in ships with carved serpent heads, hunting for treasure. In this adventure, a brother and sister travel back in time to that island to find one special lost story. They will need to be brave, clever, and quick to escape the Vikings and get home.',
        zh: '一千多年前，欧洲经历过一段被称为"黑暗时代"的日子，那时人们生活艰难，书籍非常稀少又珍贵。在爱尔兰海岸边的一座小岛上，修道士们住在一起，自己种粮食，还用手一笔一画地把故事抄写成漂亮的书。可是大海很危险，凶猛的维京海盗驾着刻有蛇头的船四处寻找财宝。在这个冒险故事里，一对兄妹穿越时空回到那座小岛，去寻找一个失落的特别故事。他们必须勇敢又机智，才能躲开维京人，平安回家。',
      },
      vocab: [
        ['mist', 'a thin cloud of tiny water drops floating in the air', '안개', '薄雾'],
        ['steep', 'rising or dropping sharply and hard to climb', '가파른', '陡峭的'],
        ['monk', 'a religious man who lives and works quietly with others in a special community', '수도사', '修道士'],
        ['serpent', 'a snake, or a large snake-like creature', '뱀, 큰 뱀', '蛇；巨蛇'],
        ['invader', 'a person who enters a place by force to attack it or take things', '침략자', '入侵者'],
        ['voyage', 'a long journey, especially one made by boat or ship', '항해', '航行；航海'],
        ['horizon', 'the faraway line where the sky seems to meet the sea or land', '수평선, 지평선', '地平线；水平线'],
        ['current', 'water that moves strongly in one direction', '물살, 해류', '水流；潮流'],
        ['jagged', 'having a rough, sharp, uneven edge', '들쭉날쭉한, 뾰족뾰족한', '参差不齐的；锯齿状的'],
        ['deserted', 'empty, with no people around', '텅 빈, 버려진', '空无一人的；荒废的'],
      ],
      quiz: [
        ['Where did the magic tree house take Jack and Annie?', ['A castle in France', 'An island off the coast of Ireland', 'A town in ancient Rome', 'A faraway jungle'], 'B', 'The tree house carries them to a small island near Ireland during the Dark Ages.'],
        ['What were the children trying to find on the island?', ['A lost story to carry back to Morgan', 'A chest full of gold', 'A magic sword', 'A new library card'], 'A', 'Morgan sends them to bring back one special lost story written long ago.'],
        ['Who welcomed the children and showed them around the monastery?', ['A Viking chief', 'A queen', 'A kind monk named Brother Patrick', 'A fisherman'], 'C', 'A friendly monk, Brother Patrick, greets them and gives them a tour.'],
        ['What did the monks spend most of their time doing in the library?', ['Cooking big meals', 'Practicing for war', 'Sleeping all day', 'Writing and copying books by hand'], 'D', 'In the library the monks read, play chess, and above all make books by hand.'],
        ['Why were the island people afraid of the Vikings?', ['The Vikings sang too loudly', 'The Vikings raided places and carried people away', 'The Vikings ate all the fish', 'The Vikings refused to talk to anyone'], 'B', 'Viking raiders were feared for attacking coastal places, stealing treasure, and taking people as slaves.'],
        ['How did the children warn the monks that the Vikings were coming?', ['They lit a bonfire', 'They sent a letter', 'They waved a flag', 'They rang the church bell'], 'D', 'Annie pulls the bell rope, and the ringing bell calls the monks out to be warned.'],
        ['What happened after Jack and Annie climbed into a Viking ship to hide?', ['The ship came loose and drifted out to sea', 'The Vikings caught them at once', 'The ship stayed safely on the shore', 'They rowed easily back home'], 'A', 'The anchor rope slipped free while they were aboard, and the ship floated out to sea.'],
        ['What finally pushed the children\'s ship safely back toward the shore?', ['A strong, lucky wind', 'A passing fishing boat', 'A giant sea serpent', 'Brother Patrick swimming behind it'], 'C', 'A huge sea serpent presses its neck against the ship and pushes it toward shore.'],
      ],
    },
    {
      id: 'library-mth16', seriesId: 'magic-tree-house', order: 16,
      title: 'Hour of the Olympics',
      illustrator: 'Sal Murdocca',
      ar: 3.3, rg: '3B', wc: 5220,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G3',
      totalPages: 41,
      audio: 'tts',
      background: {
        ko: '잭과 여동생 애니는 집 근처 숲속에 숨겨진 마법의 나무 집을 발견해요. 나무 집 안에 있는 책의 그림을 가리키며 소원을 빌면, 그 시대와 장소로 순식간에 데려다준답니다. 이번 모험에서는 아주 먼 옛날 고대 그리스, 최초의 올림픽 경기가 열리는 날로 떠나요. 마법의 사서 모건은 영영 사라질지도 모르는 이야기를 구해 오라는 비밀 임무를 두 사람에게 맡겼어요. 하지만 고대 그리스에서는 여자아이가 경기를 구경조차 할 수 없어서, 용감한 애니의 호기심이 큰 문제를 일으킬 수도 있답니다.',
        en: 'Jack and his little sister Annie find a magic tree house hidden in the woods near their home. When they point to a picture in one of its books and make a wish, the tree house whisks them away to that time and place. In this adventure it carries them all the way back to ancient Greece, on the very first day of the ancient Olympic Games. Morgan, the magical librarian, has sent them on a secret mission to rescue a story that could be lost forever. But in ancient Greece girls are not even allowed to watch the games, so brave Annie\'s curiosity could land them in serious trouble.',
        zh: '杰克和妹妹安妮在家附近的树林里发现了一座隐藏的魔法树屋。只要指着屋里某本书上的图画许下愿望，树屋就会把他们送到那个时代和地方。这一次，树屋带他们回到了很久很久以前的古希腊，正好赶上第一届古代奥林匹克运动会开幕。魔法图书管理员摩根交给他们一项秘密任务：抢救一个可能永远失传的故事。可是在古希腊，女孩子连看比赛都不被允许，所以勇敢又好奇的安妮很可能会惹上大麻烦。',
      },
      vocab: [
        ['philosopher', 'a person who thinks deeply about life and loves wisdom', '철학자', '哲学家'],
        ['democracy', 'a kind of government in which citizens share freedom and a voice', '민주주의', '民主制度'],
        ['chariot', 'a light two-wheeled cart pulled by horses, used for racing', '전차(이륜 마차)', '战车（双轮马车）'],
        ['javelin', 'a light spear that athletes throw as far as they can in a contest', '투창(창던지기)', '标枪'],
        ['gymnasium', 'a place where athletes train and practice their sports', '체육관·훈련장', '体育馆（训练场）'],
        ['athlete', 'a person trained to compete in sports and games', '운동선수', '运动员'],
        ['anonymous', 'made or written by someone whose name is not known', '익명의', '匿名的'],
        ['scroll', 'a rolled-up sheet of paper used for writing', '두루마리', '卷轴'],
        ['tunic', 'a loose, simple piece of clothing worn in ancient Greece', '튜닉(헐렁한 겉옷)', '束腰外衣（长袍）'],
        ['constellation', 'a group of stars that form a pattern in the night sky', '별자리', '星座'],
      ],
      quiz: [
        ['Where does the magic tree house take Jack and Annie in this story?', ['Ancient Rome', 'Ireland', 'Ancient Greece', 'Ancient China'], 'C', 'The tree house carries them back to ancient Greece during the first Olympic Games.'],
        ['Why did Morgan send Jack and Annie on this journey?', ['To rescue a story that might be lost', 'To win an Olympic race', 'To find a flying horse', 'To build a temple'], 'A', 'Their secret mission as Master Librarians is to bring back a story before it disappears.'],
        ['Who is the friendly bearded man they meet named Plato?', ['A soldier', 'A king', 'A chariot racer', 'A philosopher who loves wisdom'], 'D', 'Plato explains that a philosopher is a lover of wisdom, and he becomes their guide.'],
        ['Why can\'t the young woman put her real name on the story she wrote?', ['Girls in ancient Greece were not allowed to write and share stories', 'She had forgotten how to spell it', 'She was too shy to sign her work', 'The story was not finished yet'], 'A', 'Because women were not permitted to be authors then, she signs it "Anonymous" to stay safe.'],
        ['What surprising thing does Annie do at the games?', ['She races a chariot by herself', 'She sneaks in disguised as a soldier', 'She sings on the theater stage', 'She hides inside the temple of Zeus'], 'B', 'Annie borrows a soldier\'s costume and helmet so she can watch the forbidden games.'],
        ['How do Jack and Annie finally get away from the guards?', ['They dash into the olive trees', 'Plato hides them in his house', 'A winged white horse pulls them off in a chariot', 'They climb up the giant statue of Zeus'], 'C', 'A magnificent winged horse gallops up and carries their chariot into the sky.'],
        ['What is the name of the great winged horse from Greek mythology?', ['Hercules', 'Nike', 'Sarph', 'Pegasus'], 'D', 'Morgan later tells them the flying horse is Pegasus of Greek myth.'],
        ['At the end, how does Morgan show Annie that Pegasus is still near?', ['She gives Annie a small toy horse', 'She points to Pegasus shining as a pattern of stars in the sky', 'Pegasus flies back down to the tree house', 'She paints a picture of the horse'], 'B', 'Morgan reveals Pegasus as a constellation, showing the old stories are always with us.'],
      ],
    },
    {
      id: 'library-mth18', seriesId: 'magic-tree-house', order: 18,
      title: 'Buffalo Before Breakfast',
      illustrator: 'Sal Murdocca',
      ar: 3.3, rg: '3B', wc: 5402,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G3',
      totalPages: 43, audio: 'tts',
      background: {
        ko: '잭과 애니는 마법의 나무 집을 타고 수백 년 전 아메리카 대평원으로 시간 여행을 떠나요. 끝없이 펼쳐진 풀밭과 거대한 들소 떼가 있는 그곳에서, 라코타 원주민 소년 블랙 호크를 만나요. 블랙 호크는 들소가 얼마나 소중한 존재인지, 그리고 자연과 함께 사는 방법을 두 남매에게 가르쳐줘요. 그런데 거대한 들소 떼가 마을을 향해 달려오기 시작하면, 잭과 애니는 빠르게 생각하고 행동해야 해요. 이 모험을 통해, 모든 살아있는 것이 서로 연결되어 있다는 깊은 지혜를 배울 수 있답니다.',
        en: 'Jack and Annie travel by magic tree house to the Great Plains of North America hundreds of years ago, where endless grasslands stretch to the horizon and massive buffalo herds thunder across the earth. They meet a Lakota boy named Black Hawk, who shows them how sacred the buffalo is to his people — providing food, clothing, shelter, and tools. When a massive stampede heads toward the village, Jack and Annie must think and act fast. This adventure teaches them a profound truth that Black Hawk\'s people have always known: every living thing is connected.',
        zh: '杰克和安妮乘坐魔法树屋回到数百年前的北美大平原，那里一望无际的草原延伸至天边，庞大的野牛群轰鸣着穿越大地。他们遇到了一位名叫黑鹰的拉科塔男孩，他向他们展示了野牛对他的族人有多么神圣——提供食物、衣物、住所和工具。当一群庞大的野牛向村庄奔来，杰克和安妮必须迅速思考和行动。这段冒险让他们学到了一个深刻的道理：万物相连。',
      },
      vocab: [
        ['prairie', 'a wide, flat area of grassland with very few trees, found in the middle of North America', '대초원', '大草原'],
        ['buffalo', 'a large, shaggy wild animal of the North American plains, also called a bison, that once lived in huge herds', '들소(바이슨)', '北美野牛'],
        ['stampede', 'a sudden rush of a large number of frightened animals running wildly together in the same direction', '(동물 떼의) 폭주, 달림', '（动物群）狂奔；踩踏'],
        ['tepee', 'a cone-shaped tent made from wooden poles and animal hides, used as a home by some Native American peoples', '원뿔형 인디언 천막', '（北美印第安人的）圆锥形帐篷'],
        ['plains', 'a large area of flat land with few trees, especially the grasslands of central North America', '평원', '平原'],
        ['tribe', 'a group of families who share the same culture, traditions, and often the same ancestors', '부족', '部落'],
        ['chant', 'words or sounds repeated over and over in a rhythmic way, often as part of a ceremony or prayer', '노래(주로 의례용)', '吟唱；圣歌'],
        ['harvest', 'the time when crops or natural foods are gathered, or the act of collecting them', '수확', '收获；收割'],
        ['ancestor', 'a person in your family who lived a long time before you, further back than a grandparent', '조상', '祖先'],
        ['flint', 'a very hard grey rock that makes sparks when struck against metal, used by early peoples to start fires', '부싯돌', '燧石'],
      ],
      quiz: [
        ['Where does the magic tree house take Jack and Annie?', ['The Amazon rainforest in South America', 'The Great Plains of North America with the Lakota people', 'A snowy valley in the Rocky Mountains', 'A coastal fishing village in the Pacific Northwest'], 'B', 'The tree house carries them to the vast Great Plains where the Lakota people lived among enormous buffalo herds.'],
        ['Who is the first person Jack and Annie meet on the Great Plains?', ['A Lakota warrior on horseback', 'A young Lakota boy named Black Hawk who becomes their friend', 'A traveling fur trapper with a wagon', 'An elderly medicine man who speaks to spirits'], 'B', 'Black Hawk, a Lakota boy, is the first person they meet and he becomes their trusted guide to life on the plains.'],
        ['Why do the Lakota people consider the buffalo sacred?', ['Because the buffalo can run faster than any horse', 'Because the buffalo can predict the weather far in advance', 'Because the buffalo provides almost everything the people need — food, clothing, shelter, and tools', 'Because the buffalo has lived on the plains longer than any other animal'], 'C', 'For the Lakota and many other plains peoples, the buffalo was a holy gift that supplied nearly everything life required.'],
        ['What serious danger suddenly threatens the village?', ['A sudden fierce thunderstorm', 'A rival war party riding toward the camp', 'A massive buffalo stampede heading straight toward the village', 'A prairie fire driven by a strong west wind'], 'C', 'A huge herd of frightened buffalo begins stampeding toward the village, threatening everyone in its path.'],
        ['How do Jack and Annie help turn the stampeding herd away from the village?', ['They build a tall wooden barrier across the path', 'They climb a high tree and shout to warn everyone', 'They wave blankets and beat drums to frighten the buffalo in a new direction', 'They follow Black Hawk\'s advice to make noise and start controlled fires on the sides'], 'D', 'Following Black Hawk\'s quick thinking, they create noise and small guiding fires on the flanks that steer the stampede away.'],
        ['What does Black Hawk teach Jack and Annie about how the Lakota use the buffalo?', ['They only use the hide to make tepees', 'Every single part of the buffalo is used and nothing is wasted', 'They trade most of the meat to other tribes for horses', 'They only hunt buffalo during the full moon'], 'B', 'Black Hawk explains that the Lakota use every part — hide, meat, bones, sinew — so the buffalo\'s life is fully honored.'],
        ['What gift does Black Hawk give Jack and Annie as they prepare to leave?', ['A pair of moccasins made from soft deer hide', 'A small painted buffalo hide that tells the story of their meeting', 'A carved bone flute that plays songs of the plains', 'A feathered headdress for each of them to wear'], 'C', 'Black Hawk gives them a small painted buffalo hide as a reminder of their time together and the story of their shared adventure.'],
        ['What is the most important lesson Jack takes home from the Great Plains?', ['Buffalo are the most dangerous animals on the plains', 'The Lakota people were the best horse riders in North America', 'Plains life is too hard for people who are not born there', 'Every living thing is connected and deserves to be treated with respect'], 'D', 'Watching the Lakota honor the buffalo and the land, Jack understands that the world\'s living creatures are bound together and must be respected.'],
      ],
    },
    {
      id: 'library-mth19', seriesId: 'magic-tree-house', order: 19,
      title: 'Tigers at Twilight',
      illustrator: 'Sal Murdocca',
      ar: 3.0, rg: '3A', wc: 5296,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G3',
      totalPages: 44,
      audio: 'tts',
      background: {
        ko: '인도의 울창한 숲속에는 지구에서 가장 아름다운 동물 중 하나가 살고 있어요. 빛이 서서히 사라지는 황혼의 숲에서, 호랑이는 풀밭과 나무 그늘 사이에 줄무늬 몸을 감추고 조용히 움직인답니다. 잭과 애니는 마법의 나무 집을 타고 인도의 숲으로 떠나요. 그곳에서 어미 호랑이와 새끼 호랑이를 만나게 되면서, 두 사람은 거대하고 위험한 야생 동물 앞에서도 친절함을 잃지 않는 법을 배우게 돼요. 하지만 숲의 황혼은 빠르게 어두워지고, 위험도 점점 가까이 다가오고 있어요.',
        en: 'Deep in a forest in India, one of the world\'s most beautiful animals makes its home. At twilight, when the light fades through the trees, a tiger can slip silently through the shadows, its striped coat hiding it perfectly. Jack and Annie travel there in their magic tree house and soon come face to face with a mother tiger and her cubs. In the golden glow of the Indian evening, they must decide how to help — and how to stay safe — as the forest grows darker and the dangers of the wild draw closer.',
        zh: '在印度茂密的森林深处，生活着世界上最美丽的动物之一。在暮色降临、光线穿透树林的黄昏时分，老虎悄然穿行于阴影之中，它那条纹斑斓的皮毛让它完美地隐匿其间。杰克和安妮乘坐魔法树屋来到了这里，很快就与一只母老虎和她的幼崽相遇。在印度傍晚的金色光芒中，他们必须决定如何帮助这些动物——同时保护好自己——因为森林越来越黑，野外的危险也越来越近。',
      },
      vocab: [
        ['twilight', 'the soft dim light just after the sun sets in the evening', '황혼, 해질 무렵', '黄昏；暮色'],
        ['camouflage', 'coloring or patterns that help an animal blend into its surroundings so it is hard to see', '위장(보호색)', '伪装；保护色'],
        ['predator', 'an animal that hunts and eats other animals', '포식자', '捕食者'],
        ['habitat', 'the natural place where an animal or plant lives and grows', '서식지', '栖息地'],
        ['sanctuary', 'a safe place where animals are protected and can live without being hunted', '야생 동물 보호구역', '野生动物保护区'],
        ['stalk', 'to walk slowly and quietly toward something without being seen or heard', '몰래 추적하다, 살금살금 다가가다', '悄悄追踪；蹑足而行'],
        ['cub', 'a young animal, especially the young of a large wild animal like a tiger, lion, or bear', '새끼(맹수의)', '幼崽'],
        ['dense', 'thick and packed closely together, making it hard to see through or move through', '빽빽한, 울창한', '茂密的；密集的'],
        ['endangered', 'at risk of dying out completely because there are so few left in the world', '멸종 위기에 처한', '濒危的'],
        ['reserve', 'land set aside by the government where wild animals are protected and can live safely', '보호 구역', '自然保护区'],
      ],
      quiz: [
        ['Where does the magic tree house take Jack and Annie?', ['A dense forest in India as the evening light fades', 'The African savanna at dawn', 'A rain forest in Brazil at midday', 'An island off the coast of Australia'], 'A', 'The tree house carries them to a dense Indian forest at twilight, the perfect time to see tigers in the wild.'],
        ['What kind of big cat do Jack and Annie encounter?', ['A lion', 'A cheetah', 'A snow leopard', 'A Bengal tiger'], 'D', 'Bengal tigers, one of the world\'s most magnificent and endangered big cats, live in the forests of India.'],
        ['Why is a tiger\'s striped coat such a useful pattern?', ['The stripes confuse other tigers and mark each cat\'s territory', 'The stripes help the tiger blend into shadows and tall grass, making it nearly invisible', 'The stripes make the tiger look bigger to frighten away enemies', 'The stripes tell other animals that the tiger is in charge'], 'B', 'A tiger\'s vertical stripes mimic the dappled light and shadow of the forest, giving it superb natural camouflage.'],
        ['What is Annie\'s first impulse when she sees the tiger cubs?', ['She wants to run away before the mother finds them', 'She tells Jack to write down facts about them in his notebook', 'She longs to help and stay near the small, vulnerable animals', 'She tries to lure the cubs away with food'], 'C', 'Annie always feels a pull toward animals in need, and the sight of the vulnerable cubs makes her want to protect them.'],
        ['What does Jack use to find out facts about tigers and the Indian forest?', ['A research book he brought from the tree house', 'A sign posted on the edge of the forest', 'A local guide who meets them on the path', 'His school notebook full of science facts'], 'A', 'Jack\'s faithful research book gives him information about Bengal tigers, their habitat, and how they behave.'],
        ['How does the mother tiger react when she senses Jack and Annie near her cubs?', ['She walks away calmly, trusting the children', 'She growls and crouches low, ready to defend her family', 'She picks up her cubs and flees into the undergrowth', 'She looks at them curiously and then goes to sleep'], 'B', 'Like any mother, the tigress places herself between the threat and her cubs, signaling she will fight to protect them.'],
        ['When does most of this story take place?', ['At sunrise, when the birds begin to sing', 'During the middle of the afternoon', 'In the middle of the night under a full moon', 'At twilight, when the forest is bathed in fading golden light'], 'D', 'Twilight — the hazy hour between day and night — sets the mood for the whole adventure and gives the book its title.'],
        ['What important lesson do Jack and Annie carry home from the Indian forest?', ['Wild animals are too dangerous for anyone to care about', 'Tigers attack humans at every opportunity', 'Powerful wild animals like tigers deserve our respect and protection', 'The forest is an empty and silent place'], 'C', 'Seeing the Bengal tiger as a devoted mother caring for her cubs makes Jack and Annie understand why protecting wild creatures matters.'],
      ],
    },
    {
      id: 'library-mth20', seriesId: 'magic-tree-house', order: 20,
      title: 'Dingoes at Dinnertime',
      illustrator: 'Sal Murdocca',
      ar: 3.2, rg: '3A', wc: 6369,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G3',
      totalPages: 54, audio: 'tts',
      background: {
        ko: '잭과 애니는 마법의 나무 집을 타고 호주의 아웃백, 즉 드넓고 메마른 붉은 땅으로 여행을 떠나요. 낮 동안 그곳은 타는 듯이 뜨겁고, 온갖 신기한 동물들이 살고 있어요. 그런데 갑자기 덤불에 불이 붙으면서 모든 게 달라져요! 새끼 캥거루는 어미와 떨어지고, 코알라는 나무에 갇히고, 잭과 애니는 빠르게 번지는 불길을 피해야 해요. 다행히 야생 딩고 한 마리가 탈출로를 안내해줘요. 원주민 어른이 불과 땅의 관계에 대해 들려주는 이야기를 들으면, 이 모험이 얼마나 깊은 의미를 담고 있는지 알 수 있답니다.',
        en: 'Jack and Annie travel by magic tree house to the Australian Outback — a vast, dry, red land where the midday sun blazes and strange animals roam. Then a bushfire breaks out and everything changes. A baby kangaroo is separated from its mother, a koala is trapped in a burning tree, and Jack and Annie must dodge the fast-spreading flames. A wild dingo becomes their unexpected guide toward safety. An Aboriginal elder\'s story about fire and the land gives the whole adventure a deeper meaning, and Jack and Annie come home with a new respect for the surprising, fragile world Down Under.',
        zh: '杰克和安妮乘坐魔法树屋来到澳大利亚内陆——一片辽阔干燥的红色大地，正午的阳光炙热难耐，各种奇异的动物四处漫游。就在这时，一场丛林大火突然爆发，一切都变了。一只小袋鼠和妈妈走散，一只考拉被困在燃烧的树上，杰克和安妮也要拼命躲避迅速蔓延的火焰。一只野生澳洲野狗意外地成了他们的向导，引领他们找到安全之地。一位原住民老人讲述了关于火与土地的故事，让整段冒险有了更深的意义。',
      },
      vocab: [
        ['outback', 'the vast remote and dry inland area of Australia, far from cities and towns', '아웃백(호주 오지)', '澳大利亚内陆（荒野）'],
        ['dingo', 'a wild dog native to Australia with a sandy-colored coat and a bushy tail', '딩고(호주 들개)', '澳洲野狗'],
        ['kangaroo', 'a large Australian animal with powerful back legs for jumping and a pouch for carrying its baby', '캥거루', '袋鼠'],
        ['koala', 'a furry Australian animal that lives in eucalyptus trees and sleeps most of the day', '코알라', '考拉（无尾熊）'],
        ['bushfire', 'a fast-spreading fire that burns through dry grass and trees in the countryside', '덤불 화재, 산불', '丛林火灾'],
        ['eucalyptus', 'a tall Australian tree with silvery leaves that koalas eat and whose oil can help fires spread', '유칼립투스 나무', '桉树（尤加利树）'],
        ['Aboriginal', 'relating to the original people who have lived in Australia since ancient times', '호주 원주민(의)', '澳大利亚原住民的'],
        ['pouch', 'the pocket of skin on a female kangaroo\'s belly where she carries and protects her baby', '(캥거루의) 육아낭', '（袋鼠的）育儿袋'],
        ['ember', 'a small piece of burning or glowing coal or wood from a fire', '불씨, 잉걸불', '余烬；火星'],
        ['drought', 'a long period of time when there is very little rain and the land becomes very dry', '가뭄', '干旱'],
      ],
      quiz: [
        ['Where does the magic tree house take Jack and Annie?', ['The rainforests of South America', 'The Australian Outback', 'A dusty desert in Africa', 'A remote island in the Pacific'], 'B', 'The tree house carries them to the Australian Outback, a sun-baked land of red earth and extraordinary wildlife.'],
        ['What sudden danger do Jack and Annie face shortly after arriving?', ['A herd of kangaroos charges toward them', 'A fast-spreading bushfire breaks out', 'A flash flood fills the dry creek bed', 'A venomous snake blocks the path'], 'B', 'A bushfire races across the dry land, threatening all the animals and forcing Jack and Annie to act quickly.'],
        ['Which animal needs Jack and Annie\'s help most urgently?', ['A young dingo pup stuck in a hollow log', 'An old koala that cannot move on its own', 'A baby kangaroo that has been separated from its mother', 'A lizard trapped beneath a fallen branch'], 'C', 'A baby kangaroo, called a joey, is separated from its mother during the chaos and cannot survive alone.'],
        ['What role does the wild dingo play in the story?', ['It frightens Jack and Annie and they must escape from it', 'It attacks a crocodile to protect them', 'It guides them safely away from the fire', 'It shows them where the tree house is hidden'], 'C', 'The dingo, which Jack had feared at first, turns out to be guiding them on a safe path away from the flames.'],
        ['What does the Aboriginal elder explain about bushfires?', ['They are always caused by people being careless', 'Fire is part of nature\'s cycle and helps the land regenerate and grow stronger', 'Fire is destructive and must always be put out immediately', 'Animals should never be rescued from fires'], 'B', 'The elder shares traditional wisdom: fire has long been part of the Australian land\'s rhythm, clearing old growth so new life can begin.'],
        ['How do Jack and Annie help the koala escape the burning tree?', ['They splash water on the branches to cool them down', 'They shake the trunk until the koala jumps to the ground', 'They carry the koala on their backs to reach a safe boulder', 'They call out to the dingo to climb up and get the koala'], 'C', 'They carry the koala across their backs and bring it to a tall, fire-safe boulder where it is out of reach of the flames.'],
        ['What ancient story does Jack learn from the Aboriginal elder?', ['A legend about the first kangaroo that ever lived', 'A tale about a great flood that covered all of Australia', 'A story about how the dingo got its sandy coat', 'An ancient legend about fire, the land, and the connection between all living things'], 'D', 'Jack learns a powerful ancient story — that fire and land and living things are all connected — which he carries home as a reminder.'],
        ['What surprising fact does Jack\'s research book reveal about Australia?', ['It has no dangerous animals at all', 'It is the world\'s smallest continent', 'All Australian animals can only be found in zoos', 'Australia is home to more unique animals than any other continent on Earth'], 'D', 'Australia\'s long isolation gave rise to animals found nowhere else on Earth — kangaroos, koalas, platypuses, dingoes, and many more.'],
      ],
    },
  ],
};
