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
  ],
};
