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
      id: 'library-mth5', seriesId: 'magic-tree-house', order: 5,
      title: 'Night of the Ninjas',
      illustrator: 'Sal Murdocca',
      ar: 3.1, rg: '3A', wc: 5304,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G3',
      totalPages: 42,
      audio: 'tts',
      background: {
        ko: '지금으로부터 약 500년 전 일본에는 두 종류의 전사가 있었어요. 사무라이는 명예로운 규율을 따르는 기사였고, 닌자(시노비)는 어둠 속에서 소리 없이 움직이는 비밀 전사였답니다. 닌자는 어릴 때부터 나무 타기, 물속 수영, 변장, 그리고 달빛 아래 흔적 없이 달리기를 훈련했어요. 잭과 애니는 마법의 나무 집을 타고 달빛 가득한 일본 숲으로 떠나요. 그곳에서 닌자들의 비밀 수련을 직접 경험하고, 마법사 모건의 임무를 완수해야 해요.',
        en: 'About five hundred years ago in Japan, there were two kinds of warriors. Samurai were knights who followed a strict code of honor and wore fine armor. But there were also ninja — or shinobi — shadow warriors trained in secret arts: climbing walls, moving without a sound, disguising themselves, and vanishing into darkness. Jack and Annie travel to a moonlit Japanese forest where ninjas practice their mysterious skills — and must use every trick they can to stay safe and complete Morgan\'s mission.',
        zh: '大约五百年前的日本，有两种武士。武士是遵守严格武士道的骑士，身披精良盔甲。而忍者——又称"信步"——则是秘密训练多年的暗影战士：爬墙、悄无声息地移动、乔装打扮，消失在黑暗之中。杰克和安妮来到月光照耀的日本森林，忍者们在这里练习神秘技艺——两人必须运用所有智慧保持安全，完成摩根的任务。',
      },
      vocab: [
        ['ninja', 'a specially trained secret warrior of ancient Japan who moved silently and worked in shadows', '닌자(비밀 전사)', '忍者'],
        ['samurai', 'a skilled Japanese warrior who served a lord and followed a strict code of honor', '사무라이(무사)', '武士'],
        ['stealth', 'moving so quietly and carefully that no one can see or hear you', '은밀한 움직임', '隐秘行动'],
        ['meditation', 'the practice of sitting very still and quietly to clear and calm your mind', '명상', '冥想'],
        ['shrine', 'a special place set apart for worship, often surrounded by nature', '신사, 성소', '神社；圣地'],
        ['mist', 'a thin cloud of tiny water drops floating in the air, making things hard to see', '안개', '薄雾'],
        ['warrior', 'a person experienced and skilled in fighting and battle', '전사, 무사', '战士'],
        ['bamboo', 'a tall grass with hollow woody stems, used in Japan for building and tools', '대나무', '竹子'],
        ['scroll', 'a roll of paper or silk with writing or pictures on it', '두루마리', '卷轴'],
        ['disguise', 'something worn or done to make yourself look like a completely different person', '변장', '伪装'],
      ],
      quiz: [
        ['What country does the magic tree house take Jack and Annie to?', ['Ancient Egypt', 'Feudal Japan', 'Viking Norway', 'Ancient China'], 'B', 'The tree house carries them to Japan about five hundred years ago, during the age of samurai and ninja.'],
        ['What kind of secret warriors live and train in the moonlit forest?', ['Samurai knights in shining armor', 'Ninja — silent shadow warriors of Japan', 'Viking raiders looking for treasure', 'Monks who copy ancient books'], 'B', 'Ninja trained for years in stealth, climbing, disguise, and the art of moving through darkness without being heard or seen.'],
        ['Why must Jack and Annie stay as quiet as possible throughout the adventure?', ['The forest animals will all run away if they make noise', 'Any sound could alert the guards and put them in serious danger', 'The whole tree house will shake if they speak above a whisper', 'They are playing a game with strict rules about silence'], 'B', 'Ninja guards patrol the forest, and a single snapped twig or careless footstep could give away their hiding place.'],
        ['What does Jack use to find out about ninjas and ancient Japan?', ['A map drawn on a piece of silk he found on the ground', 'A research book he brought from the tree house', 'A note left behind by Morgan le Fay', 'An old sword with writing on the blade'], 'B', 'As always, Jack keeps his research book close — it gives him important facts about Japan, the samurai code, and ninja training methods.'],
        ['What special item has Morgan sent Jack and Annie to find?', ['A moonstone hidden somewhere in the forest', 'A jade necklace from an old shrine', 'A secret map rolled up in a bamboo scroll', 'The ancient sword of a legendary samurai'], 'A', 'Morgan has given them a special mission to recover a moonstone — a glowing gem tied to the magic she needs.'],
        ['What does Jack learn about the samurai code of honor from his book?', ['Samurai were allowed to break any rule if it helped them win a fight', 'Samurai lived by Bushido — courage, loyalty, and respect above all else', 'Samurai only traveled and fought at night, just like ninja', 'Samurai never carried weapons because fighting was strictly forbidden'], 'B', 'Jack reads that samurai followed Bushido, a warrior code that demanded bravery, loyalty to one\'s lord, and deep respect for others.'],
        ['How do Jack and Annie keep from being spotted by the samurai guards?', ['They challenge the samurai to a sword-fighting contest to buy time', 'They move slowly through the shadows, using the stealth tricks the ninja showed them', 'They ride away on horses borrowed from the village stables', 'Morgan appears and creates a magical barrier around them'], 'B', 'By staying low, hugging the dark edges of the forest, and treading as silently as the ninja taught, Jack and Annie slip past the guards.'],
        ['What role does Morgan play at the end of the adventure?', ['She leads an army of samurai against the ninja guards', 'She teaches Jack the art of sword fighting so he can protect Annie', 'She stays home and waits while Jack and Annie do everything alone', 'She is revealed to have been watching over and guiding them throughout'], 'D', 'Morgan le Fay, as always, has quietly guided the adventure — and when Jack and Annie return with the moonstone, her careful plan comes together.'],
      ],
    },
    {
      id: 'library-mth9', seriesId: 'magic-tree-house', order: 9,
      title: 'Dolphins at Daybreak',
      illustrator: 'Sal Murdocca',
      ar: 3.0, rg: '3A', wc: 5149,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G3',
      totalPages: 38,
      audio: 'tts',
      background: {
        ko: '바다는 지구 표면의 70퍼센트 이상을 덮고 있어요. 하지만 깊은 바닷속에는 아직 탐험되지 않은 신비한 세계가 가득하답니다. 산호초는 수천 가지 생물의 집이고, 문어는 놀라운 방법으로 포식자를 피하며, 돌고래는 수중 음파를 이용해 먹이를 찾아요. 잭과 애니는 소형 잠수함을 타고 바다 속 세계로 뛰어들어요. 마스터 사서가 되기 위한 수수께끼를 풀어야 하는데, 시간이 촉박하고 상어도 가까이 있답니다.',
        en: 'More than two-thirds of our planet is covered by ocean, but much of what lies beneath the surface remains unexplored. Coral reefs are home to thousands of dazzling sea creatures. Octopuses escape enemies using tricks of color and ink. Dolphins use natural sonar — sending out clicks that bounce back — to navigate in perfect darkness. Jack and Annie ride a mini-submarine into this hidden world. As Master Librarians in training, they must solve an ancient riddle before daybreak — and stay safe from the sharks that circle outside.',
        zh: '地球表面超过三分之二被海洋覆盖，但水下的很多地方至今仍未被探索。珊瑚礁是数千种海洋生物的家园，章鱼用变色和喷墨躲避天敌，海豚用天然声纳——发出在水中反弹的声音——在黑暗中导航。杰克和安妮乘坐一艘小型潜水艇进入这个隐秘的世界。作为见习图书馆员，他们必须在破晓前解开一个古老的谜题——同时躲开外面盘旋的鲨鱼。',
      },
      vocab: [
        ['submarine', 'a vehicle that can travel deep underwater, like a sealed ship that moves beneath the ocean surface', '잠수함', '潜水艇'],
        ['coral reef', 'a ridge of hard coral near the surface of warm, shallow ocean water, home to thousands of sea animals', '산호초', '珊瑚礁'],
        ['dolphin', 'a smart, social sea mammal that breathes air, lives in groups, and communicates with clicks and whistles', '돌고래', '海豚'],
        ['sonar', 'a system of using sound waves to locate objects underwater — dolphins have their own built-in natural sonar', '음파 탐지기(소나)', '声纳'],
        ['current', 'a steady stream of water moving continuously in one direction through the ocean', '해류, 물살', '海流；水流'],
        ['tentacle', 'one of the long, flexible arms of an octopus or squid, used to grab and hold things', '촉수', '触手'],
        ['predator', 'an animal that hunts and eats other animals to survive', '포식자', '捕食者'],
        ['riddle', 'a puzzling question or mystery that requires clever thinking to solve', '수수께끼', '谜题'],
        ['tide pool', 'a small pool left in coastal rocks at low tide, filled with small sea creatures', '조수 웅덩이', '潮汐池'],
        ['navigate', 'to find your way from one place to another, especially in water or in the dark', '항법으로 길을 찾다', '导航；找路'],
      ],
      quiz: [
        ['How do Jack and Annie travel to explore the bottom of the ocean?', ['They swim down wearing special diving suits', 'They ride in a small underwater submarine', 'A giant sea turtle carries them on its back', 'Morgan turns them into fish for the adventure'], 'B', 'A mini-submarine is waiting for them — just big enough for Jack, Annie, and their backpack — and it takes them straight to the ocean floor.'],
        ['What ancient riddle has Morgan given Jack and Annie to solve?', ['Where does the sun sleep when it goes down at night?', 'What is always in front of you but can never be seen?', 'Where do you find the place where land meets water meets sky?', 'What creature speaks all languages yet never says a word?'], 'C', 'Morgan\'s riddle points to the place where three worlds — land, ocean, and sky — come together: the seashore at the moment of sunrise.'],
        ['What amazing underwater structure are Jack and Annie exploring?', ['A shipwreck resting on the ocean floor', 'A coral reef bursting with colorful sea life', 'A forest of giant kelp seaweed', 'An underwater cave with glowing walls'], 'B', 'The coral reef is one of the richest and most colorful places on Earth — a living city of fish, crabs, sea stars, and coral creatures.'],
        ['What does Jack learn about how dolphins find their food in the dark?', ['Dolphins have night-vision eyes that work perfectly underwater', 'Dolphins use a special sense of smell that works in water', 'Dolphins send out clicking sounds that bounce off objects — natural sonar', 'Dolphins simply wait on the surface and catch jumping fish'], 'C', 'Dolphins\' natural sonar is remarkably accurate — the echoes of their clicks paint a precise picture of everything around them, even in total darkness.'],
        ['What danger do Jack and Annie face when the submarine\'s power runs out?', ['The sub begins to sink toward the ocean floor and won\'t stop', 'A shark circles the sub and blocks their way back to the surface', 'The ocean current sweeps the sub away from the coral reef', 'The sub\'s walls start letting in cold seawater'], 'B', 'A large shark takes an interest in the little sub, and with no power to maneuver, Jack and Annie are stuck until help arrives.'],
        ['How do Jack and Annie get away from the shark and find the surface?', ['They use the sub\'s emergency signal flare to scare the shark away', 'A pod of dolphins surrounds the sub and guides them safely to the surface', 'Annie spots a current that carries them up to a nearby beach', 'Morgan le Fay appears as a dolphin and leads them home'], 'B', 'The pod of dolphins comes to their rescue — surrounding the small sub, driving off the shark, and escorting Jack and Annie all the way to the surface.'],
        ['What does Jack write in his notebook about octopuses?', ['Octopuses are among the slowest creatures in the sea', 'Octopuses can change their color and texture to look just like the rocks around them', 'Octopuses live only in warm tropical waters near the shore', 'Octopuses are completely blind but can sense vibrations in the water'], 'B', 'Jack is amazed to read that octopuses are master camouflage artists — they can shift color and texture almost instantly to vanish against any background.'],
        ['What do Jack and Annie figure out by the end of the adventure?', ['The answer to Morgan\'s riddle is the coral reef itself', 'The answer to Morgan\'s riddle is the seashore at sunrise, where land and sea and sky all meet', 'The whole adventure was a dream — they never left the tree house at all', 'Morgan\'s riddle has no answer because it is meant to be a lifelong mystery'], 'D', 'Standing at the water\'s edge as the sun climbs above the horizon, they see it: the exact moment and place where land, ocean, and sky all come together — the answer Morgan was waiting for.'],
      ],
    },
    {
      id: 'library-mth10', seriesId: 'magic-tree-house', order: 10,
      title: 'Ghost Town at Sundown',
      illustrator: 'Sal Murdocca',
      ar: 3.3, rg: '3B', wc: 5600,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G3',
      totalPages: 45,
      audio: 'tts',
      background: {
        ko: '1800년대 후반 미국의 서부는 넓고 황량한 땅이었어요. 금을 찾으러 온 사람들이 몰려들면서 마을이 생겨났지만, 금이 떨어지면 사람들은 떠나고 마을은 텅 빈 유령 마을이 되었어요. 카우보이들은 말을 타고 소 떼를 몰았고, 무법자들은 사막과 협곡을 누볐어요. 잭과 애니는 마법의 나무 집을 타고 유령 마을로 향해요. 그곳에서 아주 특별한 카우보이를 만나게 되는데, 그가 유령인지 아닌지도 불확실하답니다.',
        en: 'In the late 1800s, the American West was a vast and wild frontier. During the Gold Rush, thousands of people flooded west hoping to strike it rich. Towns sprang up almost overnight — but when the gold ran out, the people left and the buildings stood empty. These forgotten places are called ghost towns. Cowboys rode the open range herding cattle, and lawless outlaws roamed the canyons and arroyos. Jack and Annie are swept into one of these abandoned towns, where a mysterious cowboy with a silver rope seems to need their help — and might not be entirely alive.',
        zh: '19世纪后期，美国西部是一片广阔而荒野的边疆。淘金热期间，数千人涌向西部希望一夜暴富。城镇几乎一夜之间拔地而起——但当金矿耗尽，人们离开，建筑物空无一人。这些被遗忘的地方被称为"鬼城"。牛仔骑马放牧，无法无天的歹徒在峡谷和沟壑中横行。杰克和安妮被带到一个废弃的小镇，在那里，一个手拿银色套索的神秘牛仔似乎需要他们的帮助——而他可能并不完全属于活人的世界。',
      },
      vocab: [
        ['cowboy', 'a person, usually a man, who herds cattle on horseback across the wide-open lands of the American West', '카우보이(소몰이꾼)', '牛仔'],
        ['outlaw', 'a criminal who breaks the law and hides from the sheriff and the law', '무법자, 악당', '亡命之徒；歹徒'],
        ['lasso', 'a long rope with a sliding loop at the end, thrown over an animal\'s head to catch it', '올가미 밧줄, 라소', '套索'],
        ['corral', 'a fenced yard where horses or cattle are kept, especially near a ranch', '가축 우리, 울타리', '畜栏；围场'],
        ['ghost town', 'a town that used to be busy and full of people but is now completely empty and abandoned', '유령 마을', '鬼城；废弃小镇'],
        ['canyon', 'a deep valley with steep rock sides carved out by a river over thousands of years', '협곡', '峡谷'],
        ['sheriff', 'an elected lawman in the American West who kept order, enforced the law, and caught criminals', '보안관', '警长；保安官'],
        ['bandit', 'a robber who attacks travellers on roads or trails, especially in the Wild West', '강도, 산적', '土匪；强盗'],
        ['desperado', 'a dangerous outlaw, usually wanted by the law and not afraid of anyone', '무법자, 악당(특히 총잡이)', '亡命徒；歹徒'],
        ['frontier', 'the edge of explored and settled land, beyond which few people have gone before', '변경, 프런티어', '边疆；前沿地带'],
      ],
      quiz: [
        ['What kind of place does the magic tree house take Jack and Annie to?', ['A peaceful ranch on the open prairie', 'An empty ghost town from the days of the Gold Rush', 'A busy mining camp full of prospectors', 'A fort on the edge of the frontier'], 'B', 'The tree house sets down in an abandoned ghost town — buildings still standing, doors creaking in the wind, but not a single living person in sight.'],
        ['Who is the mysterious figure Jack and Annie encounter in the ghost town?', ['A rough outlaw who wants to steal Jack\'s backpack', 'The ghost of a cowboy named Slim who is tied to this town', 'A traveling merchant who got lost crossing the desert', 'A retired sheriff who never left after the gold ran out'], 'B', 'Slim is a ghostly cowboy — kind and helpful, but clearly not part of the living world — and he has unfinished business that has kept him in the town.'],
        ['What does Annie manage to do with the wild horse in the ghost town?', ['She teaches it to jump over the corral fence', 'She scares it away to stop it hurting Jack', 'She speaks to it gently and earns its trust completely', 'She ties it up with the ghost cowboy\'s lasso'], 'C', 'Annie has a natural gift with animals. Speaking softly and moving carefully, she calms the frightened wild horse until it accepts her.'],
        ['What are the outlaws searching for in the abandoned town?', ['The ghost cowboy\'s silver lasso, which they believe has magical powers', 'A hidden stash of gold left behind when the town was deserted', 'The magic tree house, which they have been tracking for weeks', 'The deed to the town, which would make them its legal owners'], 'D', 'The outlaws are after the gold — hidden somewhere in the ghost town before its last residents fled — and they will do anything to find it first.'],
        ['What is the unsolved mystery that keeps Slim\'s ghost bound to the town?', ['He lost a bet he never paid back before he died', 'He can\'t leave until someone finds and returns something that belongs to him', 'He promised to guard the ghost town until new settlers arrived', 'He was looking for his horse when he died and never found it'], 'C', 'Slim\'s ghost is tied to the town because something of his is still lost there. Once it is found and restored to him, he can finally rest in peace.'],
        ['How does the ghost cowboy Slim help Jack and Annie during their adventure?', ['He rides a phantom horse and drives off the outlaws with his ghostly presence', 'He leads them to hiding places and explains the history of the town', 'He fights the outlaws hand-to-hand so Jack and Annie can escape', 'He uses magic to make the outlaws fall asleep'], 'B', 'Though Slim can\'t confront the outlaws directly, he helps Jack and Annie by showing them where to hide and sharing what he knows about the lost gold.'],
        ['What does Jack write in his notebook about the Gold Rush?', ['Gold Rush towns were carefully planned cities with wide streets and stone buildings', 'Gold Rush towns sprang up fast and fell apart just as fast when the gold ran out', 'The Gold Rush only happened in California and lasted just one year', 'Most Gold Rush miners became very wealthy and never had to work again'], 'B', 'Jack reads that Gold Rush towns were built in a frenzy of hope — and emptied just as fast, leaving behind ghost towns all across the West.'],
        ['How do Jack and Annie finally escape from the outlaws at the end?', ['They trap the outlaws in the empty jailhouse and lock the door', 'Annie rides the wild horse at full gallop away from the outlaws', 'Slim\'s ghost rides in front of the outlaws to make them flee in terror', 'They call for Morgan le Fay, who arrives and chases the outlaws away'], 'B', 'Once Annie has won the wild horse\'s trust, it becomes their fastest way out — she rides hard and Jack clings on behind as they gallop to safety.'],
      ],
    },
    {
      id: 'library-mth11', seriesId: 'magic-tree-house', order: 11,
      title: 'Lions at Lunchtime',
      illustrator: 'Sal Murdocca',
      ar: 3.0, rg: '3A', wc: 5231,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G3',
      totalPages: 40,
      audio: 'tts',
      background: {
        ko: '아프리카 동부의 케냐와 탄자니아에는 매년 지구에서 가장 장대한 자연 현상 중 하나가 펼쳐져요. 100만 마리가 넘는 누(wildebeest), 얼룩말, 가젤이 신선한 풀을 찾아 수천 킬로미터를 이동하는 "대이동(Great Migration)"이에요. 사자와 치타, 악어는 이동하는 무리를 기다리다 먹이를 사냥해요. 마사이족은 수천 년 동안 이 야생동물과 함께 이 땅에서 살아온 아프리카 전통 부족이에요. 잭과 애니는 나무 집을 타고 이 광활한 사바나로 뛰어들어요.',
        en: 'Every year on the East African savanna, one of nature\'s most breathtaking events unfolds. More than a million wildebeest, zebras, and gazelles stream across the Serengeti and Masai Mara plains in the Great Migration — following the rains and the fresh grass. Lions, cheetahs, and crocodiles wait along the route, hunting the herds. The Masai people have lived alongside these great wild animals for thousands of years, herding their own cattle across the same grasslands. Jack and Annie land right in the middle of this vast, wild world and must find their way safely through it.',
        zh: '每年在非洲东部大草原上，大自然最壮观的奇景之一就会上演。超过一百万头角马、斑马和瞪羚在塞伦盖蒂和马赛马拉平原上迁徙，追随雨水和新鲜的草——这就是"大迁徙"。狮子、猎豹和鳄鱼在沿途守候，猎杀兽群。马赛人在这片广阔草地上与这些野生动物共存了数千年，在同样的草原上放牧牛群。杰克和安妮降落在这个广阔而狂野的世界中央，必须安全地找到出路。',
      },
      vocab: [
        ['savanna', 'a flat, open grassland in Africa with scattered trees, bushes, and grasses', '사바나(열대 초원)', '热带稀树草原'],
        ['wildebeest', 'a large African animal with a big head, curved horns, and a long beard that migrates in giant herds', '누(아프리카 영양)', '角马'],
        ['migration', 'the seasonal journey that animals make from one place to another to find food or better weather', '대이동, 이동', '迁徙'],
        ['Masai', 'a people of Kenya and Tanzania in East Africa, known as skilled warriors and cattle herders', '마사이족', '马赛族'],
        ['crocodile', 'a large reptile with strong jaws and sharp teeth that lurks in African rivers and lakes', '악어', '鳄鱼'],
        ['stampede', 'a sudden rush of a large number of frightened animals all running wildly in the same direction', '동물 떼의 갑작스러운 질주', '（动物的）大逃奔；踩踏'],
        ['herd', 'a large group of the same kind of animals living and moving together', '(동물)떼, 무리', '兽群；畜群'],
        ['acacia', 'a thorny, flat-topped tree found across African savannas, important for shade and as food for animals', '아카시아(아프리카 가시나무)', '金合欢树'],
        ['predator', 'an animal that hunts, catches, and eats other animals for food', '포식자', '捕食者'],
        ['plains', 'large areas of flat or gently rolling land with few trees, stretching to the horizon', '평원, 초원', '平原'],
      ],
      quiz: [
        ['Where does the magic tree house take Jack and Annie?', ['A rain forest in central Africa near the Congo River', 'The vast East African savanna during the Great Migration', 'A desert oasis where nomads water their camels', 'A coastal fishing village on the shores of the Indian Ocean'], 'B', 'The tree house lands them on the open savanna of East Africa, right in the path of the greatest animal migration on Earth.'],
        ['What massive natural event is happening around Jack and Annie?', ['A thunderstorm so powerful that all the animals hide underground', 'The Great Migration — millions of wildebeest and zebras crossing the plains', 'A volcanic eruption that fills the sky with ash and drives animals away', 'A long drought that has left the savanna brown and almost empty'], 'B', 'The Great Migration is exactly what its name says: over a million hoofed animals moving together in search of fresh grass and water.'],
        ['Who do Jack and Annie meet on the savanna who helps them?', ['A group of tourists on a jeep safari', 'A Masai warrior who knows the land and the animals', 'An old lion tamer who has lived on the plains for years', 'A young wildebeest calf who has been separated from its herd'], 'B', 'A Masai warrior greets them on the open plain. His people have lived and herded alongside these wild animals for generations.'],
        ['What dangerous animals are lurking at the river where the herds must cross?', ['Hippopotamuses that block the river crossing with their huge bodies', 'Crocodiles hiding in the water, waiting to snatch animals that wade in', 'Sharks that have swum up from the ocean to hunt in the shallow river', 'Lions that have learned to swim so they can ambush crossing animals'], 'C', 'Crocodiles are patient hunters. They drift motionless in the murky water and then explode into action when wildebeest wade into the river.'],
        ['What animals are following the migrating herds, staying close for an easy meal?', ['Eagles swooping down from the sky to take small calves', 'Lions, who have learned to follow the migration to find prey', 'Elephants that eat the same grass and compete for food', 'Chimpanzees that travel alongside the herds for company'], 'B', 'Lions follow the migration route. A herd of hundreds of thousands of animals passing through their territory means food will be plentiful.'],
        ['How does Jack learn what wildebeest eat and why they must keep moving?', ['A Masai elder tells him the history of the migration around a campfire', 'He reads from a research book about the animals and ecosystems of East Africa', 'He watches a nature video on a small screen inside the tree house', 'Annie figures it out by tasting the grass and noticing it is fresh'], 'B', 'Jack\'s faithful research book comes through again — explaining the cycle of rain, new grass, and the wildebeest\'s endless seasonal journey.'],
        ['What problem must Jack and Annie help solve involving the river crossing?', ['A bridge has washed away and the herds can\'t get across at all', 'The crossing is too narrow and the animals panic and trample each other', 'The Masai warrior\'s cattle are blocking the route and must be moved', 'They must find a safer place for the herds to ford the river past the crocodiles'], 'D', 'With crocodiles filling the main ford, Jack and Annie help find an alternative route where the wildebeest can cross with less danger.'],
        ['What traditional gift does the Masai warrior offer Jack and Annie as thanks?', ['A leather pouch filled with dried herbs and healing plants', 'A calabash gourd containing a traditional Masai food made from grain', 'A carved wooden club that all Masai warriors carry', 'A red and blue beaded bracelet that marks them as friends of the tribe'], 'B', 'The Masai warrior shares a calabash of traditional grain porridge — food that has sustained his people on the great savanna for generations — as a gesture of thanks and friendship.'],
      ],
    },
    {
      id: 'library-mth18', seriesId: 'magic-tree-house', order: 18,
      title: 'Buffalo Before Breakfast',
      illustrator: 'Sal Murdocca',
      ar: 3.2, rg: '3B', wc: 5526,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G3',
      totalPages: 45,
      audio: 'tts',
      background: {
        ko: '약 150년 전, 북아메리카의 거대한 대평원(Great Plains)에는 수천만 마리의 아메리카 들소(버팔로)가 살고 있었어요. 라코타(수족)는 수백 년 동안 버팔로와 함께 대평원에서 살아온 아메리카 원주민 부족이에요. 버팔로는 라코타에게 음식과 옷, 천막, 도구를 제공했어요. 라코타의 신성한 전설 속 "흰 버팔로 여인(White Buffalo Woman)"은 부족에게 가장 중요한 가르침을 주었답니다. 잭과 애니는 나무 집을 타고 그 광활한 대평원으로 떠나 라코타 소년과 그의 할머니를 만나게 돼요.',
        en: 'About one hundred and fifty years ago, the Great Plains of North America were home to enormous herds of American bison — often called buffalo. Tens of millions of these huge animals roamed the grasslands from Canada to Texas. The Lakota people, also known as the Sioux, had lived in harmony with the buffalo for centuries. The animals provided everything: food, clothing, shelter, and tools. In Lakota tradition, a sacred figure called White Buffalo Woman gave the people their most important teachings. Jack and Annie travel there by tree house and meet a Lakota boy and his grandmother on the open, windswept plains.',
        zh: '大约一百五十年前，北美大平原是无数美洲野牛的家园，这些野牛常被称为"buffalo"。数以千万计的巨大动物在从加拿大到德克萨斯的草地上漫游。拉科他人（又称苏族人）世代与野牛和谐共存，野牛提供了他们所需的一切：食物、衣物、住所和工具。在拉科他传统中，一位神圣的形象"白水牛女"赐予族人最重要的教义。杰克和安妮乘树屋来到这里，在广阔多风的平原上遇到了一个拉科他男孩和他的祖母。',
      },
      vocab: [
        ['prairie', 'a wide, flat, grass-covered plain with very few trees, stretching for miles across North America', '대평원, 프레리', '大草原；牧场'],
        ['bison', 'a large, shaggy-coated wild animal of the North American plains, often called a buffalo, that once roamed in tens of millions', '들소(버팔로)', '野牛；美洲野牛'],
        ['stampede', 'a sudden rush in which a large herd of frightened animals all run wildly in the same direction', '떼지어 달아나기', '（动物）踩踏；奔逃'],
        ['Lakota', 'a Native American people of the Great Plains, also known as the Sioux, who lived in close harmony with the buffalo', '라코타족(수족)', '拉科他族（苏族）'],
        ['pemmican', 'a traditional Lakota food made from dried buffalo meat mixed with fat and sometimes berries — easy to carry and full of energy', '페미컨(라코타 전통 식품)', '培肯肉饼（拉科他传统食物）'],
        ['sacred', 'holy; treated with the deepest respect because of its spiritual meaning', '신성한', '神圣的'],
        ['tepee', 'a cone-shaped shelter made from long poles covered with buffalo hides, used by Plains tribes', '티피(원뿔 모양 천막)', '圆锥形帐篷（印第安帐篷）'],
        ['ceremony', 'a special formal event that follows traditional customs to mark something important', '의식, 예식', '仪式；典礼'],
        ['plains', 'wide, open, flat land with grasses and very few trees stretching to the horizon', '평원, 대평원', '平原；平地'],
        ['vision', 'a powerful experience in which someone seems to see a holy or spiritual being', '환상, 신성한 계시', '异象；神圣的幻象'],
      ],
      quiz: [
        ['Where does the magic tree house take Jack and Annie?', ['The Rocky Mountain forests of northern Canada', 'The open prairie of the Great Plains, where the Lakota people live', 'A river valley in the deep American South', 'A desert canyon in the Southwest United States'], 'B', 'The tree house carries them to the wide, windswept Great Plains — the heart of Lakota country — where endless grass stretches to the horizon.'],
        ['Who do Jack and Annie meet on the open plains?', ['A group of pioneers in covered wagons heading west', 'A Lakota boy named Black Hawk and his wise grandmother', 'A lone trapper who has lived on the plains for thirty years', 'A US cavalry soldier who warns them about the buffalo herds'], 'B', 'They meet Black Hawk, a Lakota boy about their age, and his grandmother, who is gathering food on the prairie.'],
        ['How does a terrifying buffalo stampede start during the adventure?', ['Annie shouts to warn everyone that wolves are approaching', 'Jack accidentally startles a jackrabbit, which spooks the enormous herd', 'Thunder from a sudden storm sends the whole herd galloping in panic', 'The Lakota grandmother\'s cattle run into the buffalo and set off a chain reaction'], 'B', 'A jackrabbit bolts out of the grass right by Jack\'s feet — and the sudden movement is all it takes to send hundreds of buffalo thundering across the plain.'],
        ['What does Jack read about how the Lakota used every part of the buffalo?', ['Lakota people only used the meat; the rest of the animal was left behind', 'Lakota people used the meat, bones, hide, and organs — wasting almost nothing', 'Lakota people only hunted buffalo once a year during a special ceremony', 'Lakota people traded most of the buffalo to other tribes and kept very little'], 'B', 'Jack reads that the Lakota had an incredibly respectful relationship with the buffalo — using nearly every part of the animal and giving thanks for what they took.'],
        ['What traditional food does the grandmother share with Jack and Annie?', ['A bowl of fresh-caught river fish cooked with wild herbs and roots', 'Pemmican — a dense, nourishing cake of dried buffalo meat mixed with fat', 'Roasted corn mixed with dried berries and sweetened with honey', 'Flat bread baked on a hot stone beside the fire'], 'B', 'The grandmother offers them pemmican — a traditional Lakota food that travels well and keeps warriors and travellers strong across the long plains journeys.'],
        ['What sacred Lakota legend does Jack and Annie learn about?', ['The story of the Great Turtle who carries the world on its back', 'The legend of White Buffalo Woman, who gave the Lakota their most important teachings', 'The tale of the Thunder Bird who brings rain to the dry plains each spring', 'The story of the first fire, stolen from the sun by a brave Lakota hero'], 'B', 'White Buffalo Woman is one of the most sacred figures in Lakota belief. She appeared to the people long ago and gave them gifts of wisdom, ceremony, and respect for all living things.'],
        ['What special gift does the adventure end with Jack and Annie receiving?', ['A pouch of sacred prairie soil to remind them of the Great Plains', 'An eagle\'s feather — the second of four gifts needed to break Teddy\'s spell', 'A piece of a painted buffalo hide showing the story of the migration', 'A small clay pot filled with pemmican for the journey home'], 'B', 'An eagle\'s feather — given to mark their bravery on the plains — turns out to be the second of the four special gifts Morgan\'s note said they must collect to free Teddy.'],
        ['What does Jack realize about the relationship between the Lakota and the land?', ['The Lakota survived by taking as much as possible from the land before moving on', 'The Lakota lived in careful balance with nature, respecting the animals and the earth', 'The Lakota were mainly farmers who hunted buffalo only in emergencies', 'The Lakota believed the land belonged to no one and should be left completely alone'], 'B', 'Everything Jack sees — the way the Lakota used the buffalo, thanked the land, and moved with the seasons — shows a people living in deep, careful balance with the natural world.'],
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
      ar: 3.4, rg: '3B', wc: 5296,
      genre: 'fiction-fantasy', fictionType: 'fiction', grade: 'G3',
      totalPages: 46,
      audio: 'tts',
      background: {
        ko: '호주는 세계에서 가장 작고 가장 평탄한 대륙이에요. 약 2억 년 전에 다른 대륙과 분리되었기 때문에, 호주의 동물들은 세상 어디에도 없는 독특한 방식으로 진화했어요. 캥거루, 코알라, 왈라비처럼 새끼를 배 안의 주머니에서 키우는 "유대류(marsupial)" 동물이 170종 이상 살고 있답니다. 호주 원주민(애보리진)은 적어도 4만 년 전부터 이 땅에서 살아왔어요. 그들의 전통 "드림타임(Dreamtime)" 이야기에는 세상을 창조한 무지개 뱀이 등장해요. 잭과 애니는 가뭄에 타들어가는 호주 숲에 도착하고, 그곳에서 진짜 놀라운 모험을 경험하게 돼요.',
        en: 'Australia is the world\'s smallest and flattest continent — and because it separated from the other continents about 200 million years ago, its animals evolved in their own unique way. More than 170 kinds of marsupials — animals that carry their young in a pouch — live here, from kangaroos and koalas to wombats and wallabies. The Aboriginal people, the first Australians, have lived on this land for at least 40,000 years. In their Dreamtime traditions, the Rainbow Serpent created the world and still sends life-giving rain. Jack and Annie arrive in a forest gripped by drought, and their adventure will take them through wildfire, wilderness, and wonder.',
        zh: '澳大利亚是世界上最小、最平坦的大陆——因为它大约在两亿年前与其他大陆分离，这里的动物以独特的方式进化。超过170种有袋动物——将幼仔放在育儿袋里抚养的动物——生活在这里，包括袋鼠、考拉、袋熊和沙袋鼠。澳大利亚原住民（土著人）是澳大利亚的第一批居民，已在这片土地上生活了至少四万年。在他们的"梦幻时代"传统中，彩虹蛇创造了世界，至今仍在降下滋养生命的雨水。杰克和安妮降落在一片干旱笼罩的森林里，他们的冒险将带他们经历野火、荒野和惊奇。',
      },
      vocab: [
        ['marsupial', 'an animal that carries and raises its young inside a pouch on its belly', '유대류(새끼를 주머니에 넣어 키우는 동물)', '有袋动物'],
        ['drought', 'a long period of time with very little or no rain, making the land dry and the plants wilt', '가뭄', '干旱'],
        ['dingo', 'the wild dog of Australia, with a sandy-colored coat, that hunts in packs', '딩고(호주 야생 개)', '澳洲野狗（丁哥）'],
        ['joey', 'a baby kangaroo, especially one still living and growing inside its mother\'s pouch', '조이(새끼 캥거루)', '小袋鼠（幼崽）'],
        ['emu', 'a very large bird of Australia that cannot fly but can run extremely fast on its long legs', '에뮤(호주산 대형 새)', '鸸鹋'],
        ['kookaburra', 'an Australian bird famous for its loud call that sounds exactly like a person laughing', '쿠카부라(호주 웃음 새)', '笑翠鸟'],
        ['Aborigine', 'a member of the first people to have lived in Australia, with a culture going back at least 40,000 years', '호주 원주민(애보리진)', '澳大利亚土著人'],
        ['Dreamtime', 'the time of creation in Aboriginal Australian belief, when ancestral spirits shaped the land, animals, and people', '드림타임(원주민 창조 신화 시대)', '梦幻时代（土著创世神话）'],
        ['wildfire', 'a fire that starts in dry land or forest and spreads very quickly out of control', '산불, 들불', '野火；山火'],
        ['Rainbow Serpent', 'a powerful ancestral spirit in Aboriginal mythology, pictured as a giant snake that brings life-giving rain', '무지개 뱀(원주민 신화)', '彩虹蛇（土著神话）'],
      ],
      quiz: [
        ['Where does the magic tree house take Jack and Annie?', ['A lush tropical rain forest in northern Australia', 'A drought-stricken Australian forest with brown, dry trees', 'A beach on the coast of Australia where sea turtles nest', 'A busy harbor city in southern Australia'], 'B', 'The tree house sets down in a scrubby Australian forest where a long drought has dried everything brown and the air smells faintly of smoke.'],
        ['What animal do Jack and Annie discover sleeping in a tree fork?', ['A dingo curled up on a low branch', 'An emu that has built a nest high in the gum tree', 'A koala — a sleepy marsupial with round ears and curved claws', 'A kookaburra sitting on a branch and cackling loudly'], 'C', 'A koala is wedged into the fork of a gum tree, fast asleep. Jack reads that koalas sleep most of the day, getting moisture from eucalyptus leaves instead of drinking water.'],
        ['Why does the mother kangaroo throw her joey out of her pouch when the dingoes chase her?', ['She is angry at the joey and wants to teach it to run by itself', 'Without the extra weight in her pouch, she can leap much faster and lead the dingoes away', 'The joey is too hot and jumps out on its own to cool off in the shade', 'She thinks Jack and Annie will protect the joey better than she can'], 'B', 'Jack reads that this is actually the mother\'s way of protecting the baby — she can out-leap the dingoes without the weight in her pouch, then return for the joey once she has lost the chase.'],
        ['What does the joey do when it is alone and frightened on the ground?', ['It hops in fast circles, crying out for its mother to return', 'It digs itself a shallow hole to hide in until the danger has passed', 'It climbs into Jack\'s backpack, thinking it is a cozy pouch', 'It runs toward Annie and hides behind her legs, trembling'], 'C', 'The joey spots Jack\'s open backpack and takes a flying leap straight inside, then turns around and peeks out — it feels just like being safe in a pouch.'],
        ['What disaster forces Jack, Annie, and the animals to run for their lives?', ['A flash flood sweeping through the dry creek bed below them', 'A wildfire spreading fast through the drought-dried trees and brush', 'A massive earthquake that splits the ground open nearby', 'A huge flock of emus stampeding through the forest'], 'B', 'A distant wisp of smoke becomes a roaring wildfire that leaps from tree to tree. In the drought-dry forest, everything burns fast.'],
        ['What mysterious painting does Teddy howl at in the darkness of the cave?', ['A painting of the first kangaroo, left by Aboriginal hunters', 'A drawing of the tree house, left there by Morgan le Fay long ago', 'The Rainbow Serpent — a glowing painting of the spirit who sends rain', 'A picture of Teddy himself in his true form before the spell was cast'], 'C', 'In the darkness of the cave, Teddy howls — and a glowing white serpent appears on the wall, with painted handprints below it. It is the Rainbow Serpent of Aboriginal Dreamtime.'],
        ['How is the wildfire put out and the animals saved?', ['Firefighting planes arrive and drop water over the burning trees', 'The animals and Jack and Annie dig a firebreak around the forest together', 'Rain suddenly pours down — the Rainbow Serpent\'s power has answered the ceremony', 'The fire simply burns itself out when it reaches the river bank'], 'C', 'After Jack and Annie press their hands into the painted handprints on the cave wall, thunder rolls and rain pours down — putting out the wildfire and saving the animals.'],
        ['Who turns out to be Teddy after Morgan breaks the spell at the end?', ['A young librarian from Morgan\'s collection of lost books', 'A prince who was turned into a dog by a rival enchantress', 'A boy named Ted, Morgan\'s apprentice from Camelot, who accidentally changed himself into a dog', 'A friendly forest spirit who took the form of a dog to help Jack and Annie'], 'C', 'In a flutter of time, Teddy transforms back into a boy with a freckled face and twinkly eyes — it is Ted, Morgan\'s young helper from Camelot, who had accidentally cast the dog spell on himself.'],
      ],
    },
  ],
};
