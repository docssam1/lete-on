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
  ],
};
