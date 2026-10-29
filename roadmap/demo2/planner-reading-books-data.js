/* Representative reading choices, checked against official sources on 2026-10-26.
 * ATOS values apply only to the cited English title/edition, never a whole series.
 * Oxford Levels are the publisher's own scale; null ATOS means no conversion.
 * Korean notes are original GFIELD reading suggestions, not publisher placement rules.
 * Only bibliographic metadata is included; no passages, questions or answers.
 */
(function(g){
'use strict';
const books=[
  {
    id:'ar-154567',title:'I Am Invited to a Party!',series:'Elephant & Piggie',author:'Mo Willems',
    atos:0.7,oxfordLevel:null,format:'reader',
    note:'부모와 등장인물 역할을 나누어 읽어 보세요. 짧은 문장을 읽은 뒤 표정과 말투를 함께 살펴봅니다.',
    source:'https://www.arbookfind.com/bookdetail.aspx?client=WKAR&l=EN&q=154567'
  },
  {
    id:'ar-43663',title:'Biscuit Finds a Friend',series:'Biscuit · I Can Read! My First',author:'Alyssa Satin Capucilli',
    atos:0.8,oxfordLevel:null,format:'reader',
    note:'한 번에 끝까지 읽기보다 짧게 나누어 읽어도 좋습니다. 그림을 보며 누가 누구를 도왔는지 말해 보세요.',
    source:'https://www.arbookfind.com/bookdetail.aspx?client=WKAR&l=EN&q=43663'
  },
  {
    id:'ar-154356',title:'We Are in a Book!',series:'Elephant & Piggie',author:'Mo Willems',
    atos:0.9,oxfordLevel:null,format:'reader',
    note:'말풍선을 번갈아 읽고 재미있던 장면을 골라 보세요. 같은 문장을 다시 읽으며 말투를 바꾸어 보아도 좋습니다.',
    source:'https://www.arbookfind.com/bookdetail.aspx?client=WKAR&l=EN&q=154356'
  },
  {
    id:'ar-31587',title:'Biscuit',series:'Biscuit · I Can Read! My First',author:'Alyssa Satin Capucilli',
    atos:1.4,oxfordLevel:null,format:'reader',
    note:'잠자리에서 함께 읽고 아이가 편한 부분을 맡아 보세요. 다른 Biscuit 책도 각 권의 난도를 따로 확인합니다.',
    source:'https://www.arbookfind.com/bookdetail.aspx?client=WKAR&l=EN&q=31587'
  },
  {
    id:'ar-9023',title:'Hop on Pop',series:'Dr. Seuss',author:'Dr. Seuss',
    atos:1.5,oxfordLevel:null,format:'reader',
    note:'소리가 비슷한 낱말을 찾아 읽어 보세요. 속도를 높이기보다 소리와 철자의 관계를 살펴봅니다.',
    source:'https://www.arbookfind.com/bookdetail.aspx?client=WKAR&l=EN&q=9023'
  },
  {
    id:'ar-101305',title:'Hi! Fly Guy',series:'Fly Guy #1',author:'Tedd Arnold',
    atos:1.5,oxfordLevel:null,format:'reader',
    note:'그림과 짧은 이야기를 함께 즐기며 읽어 보세요. 읽은 뒤 주인공이 무엇을 했는지 자기 말로 이야기합니다.',
    source:'https://www.arbookfind.com/bookdetailprint.aspx?l=EN&q=101305'
  },
  {
    id:'ar-330',title:'Nate the Great',series:'Nate the Great',author:'Marjorie Weinman Sharmat',
    atos:2.0,oxfordLevel:null,format:'reader',
    note:'탐정이 찾은 단서를 하나씩 짚어 보세요. 결말을 맞히는 것보다 그렇게 생각한 이유를 나누면 좋습니다.',
    source:'https://www.arbookfind.com/bookdetail.aspx?client=WKAR&l=EN&q=330'
  },
  {
    id:'ar-5453',title:'Amelia Bedelia (English)',series:'Amelia Bedelia · I Can Read! Level 2',author:'Peggy Parish',
    atos:2.5,oxfordLevel:null,format:'reader',
    note:'말장난이나 표현의 두 가지 뜻이 어려우면 부모가 설명해 주세요. 숫자가 낮아도 문화와 표현 이해는 따로 필요합니다.',
    source:'https://www.arbookfind.com/bookdetailprint.aspx?l=EN&q=5453'
  },
  {
    id:'ar-6311',title:'Dinosaurs Before Dark / Valley of the Dinosaurs',series:'Magic Tree House #1',author:'Mary Pope Osborne',
    atos:2.6,oxfordLevel:null,format:'chapter',
    note:'이야기책 본편입니다. 한 장씩 읽고 사건을 이어 말해 보세요. 같은 주제의 논픽션 Dinosaurs는 별도 난도의 책입니다.',
    source:'https://www.arbookfind.com/bookdetail.aspx?client=WKAR&l=EN&q=6311'
  },
  {
    id:'ar-7572',title:'Henry and Mudge: The First Book of Their Adventures',series:'Henry and Mudge · Ready-to-Read Level 2',author:'Cynthia Rylant',
    atos:2.7,oxfordLevel:null,format:'reader',
    note:'짧은 이야기 단위로 읽고 인물의 마음이 어떻게 달라졌는지 나눠 보세요. 익숙해진 부분은 혼자 다시 읽습니다.',
    source:'https://www.arbookfind.com/bookdetailprint.aspx?l=EN&q=7572'
  },
  {
    id:'ar-5496',title:'The Very Hungry Caterpillar',series:'단권 그림책',author:'Eric Carle',
    atos:2.9,oxfordLevel:null,format:'picture',
    note:'그림과 사건의 순서를 연결해 말해 보세요. 짧은 그림책도 어휘와 문장에 따라 ATOS가 높을 수 있습니다.',
    source:'https://www.arbookfind.com/bookdetailprint.aspx?l=EN&q=5496'
  },
  {
    id:'ar-9268',title:'The Magic Finger',series:'단권 이야기',author:'Roald Dahl',
    atos:3.1,oxfordLevel:null,format:'chapter',
    note:'인물이 내린 선택에 대해 이야기해 보세요. 사냥과 동물에 관한 장면이 아이에게 어떻게 느껴지는지도 살펴봅니다.',
    source:'https://www.arbookfind.com/bookdetailprint.aspx?l=EN&q=9268'
  },
  {
    id:'ar-308',title:'Cam Jansen and the Mystery of the Stolen Diamonds',series:'Cam Jansen #1',author:'David A. Adler',
    atos:3.2,oxfordLevel:null,format:'chapter',
    note:'장을 마칠 때 새로 알게 된 단서를 간단히 말해 보세요. 앞 장의 정보를 기억하며 이어 읽는 연습에 활용합니다.',
    source:'https://www.arbookfind.com/bookdetailprint.aspx?l=EN&q=308'
  },
  {
    id:'ar-6272',title:'Horrible Harry and the Green Slime',series:'Horrible Harry',author:'Suzy Kline',
    atos:3.3,oxfordLevel:null,format:'chapter',
    note:'학교생활 이야기를 자신의 경험과 연결해 보세요. 한 이야기씩 읽고 중요한 사건을 짧게 정리합니다.',
    source:'https://www.arbookfind.com/bookdetailprint.aspx?l=EN&q=6272'
  },
  {
    id:'ar-13392',title:'Flat Stanley (Unabridged)',series:'Flat Stanley · Stanley Lambchop',author:'Jeff Brown',
    atos:4.0,oxfordLevel:null,format:'chapter',
    note:'축약하지 않은 판본 기준입니다. 그림책 축약판은 난도가 다르므로 책의 판본을 먼저 확인하고 읽어 보세요.',
    source:'https://www.arbookfind.com/bookdetailprint.aspx?l=EN&q=13392'
  },
  {
    id:'ar-19',title:"Charlotte's Web",series:"Charlotte's Web",author:'E. B. White',
    atos:4.4,oxfordLevel:null,format:'chapter',
    note:'긴 이야기의 인물 관계를 따라가며 읽어 보세요. 우정과 이별에 대한 아이의 생각을 듣고 읽는 분량을 조절합니다.',
    source:'https://www.arbookfind.com/bookdetail.aspx?client=WKAR&l=EN&q=19'
  },
  {
    id:'ar-175946',title:'Amelia Bedelia Sets Sail',series:'Amelia Bedelia Chapter Books #7',author:'Herman Parish',
    atos:4.5,oxfordLevel:null,format:'chapter',
    note:'같은 이름의 리더스와 구별되는 챕터북입니다. 읽기 전 판본과 분량을 보고, 장마다 사건을 이어 이해하는지 살펴보세요.',
    source:'https://www.arbookfind.com/bookdetail.aspx?l=EN&q=175946'
  },
  {
    id:'ar-57569',title:'Dinosaurs: A Nonfiction Companion to Dinosaurs Before Dark',series:'Magic Tree House Research Guides',author:'Will Osborne · Mary Pope Osborne',
    atos:5.0,oxfordLevel:null,format:'nonfiction',
    note:'본편과 연결되는 논픽션입니다. 관심 있는 소제목부터 읽고 새로 알게 된 사실을 정리해 보세요. 본편의 2.6을 적용하지 않습니다.',
    source:'https://www.arbookfind.com/bookdetailprint.aspx?l=EN&q=57569'
  },
  {
    id:'ar-182',title:'The Mouse and the Motorcycle',series:'단권별 난도 확인',author:'Beverly Cleary',
    atos:5.1,oxfordLevel:null,format:'chapter',
    note:'이야기를 여러 날에 나누어 읽으며 앞부분을 떠올려 보세요. 문장 난도와 함께 긴 책을 즐겁게 이어 읽는지도 살펴봅니다.',
    source:'https://www.arbookfind.com/bookdetail.aspx?client=WKAR&l=EN&q=182'
  },
  {
    id:'ar-180673',title:'The Wild Robot',series:'Wild Robot',author:'Peter Brown',
    atos:5.1,oxfordLevel:null,format:'chapter',
    note:'로봇과 자연에 관심이 있는 아이와 함께 골라 보세요. 읽는 도중 인물의 행동과 그 이유를 연결해 이야기합니다.',
    source:'https://www.arbookfind.com/bookdetail.aspx?client=WKAR&l=EN&q=180673'
  },
  {
    id:'ort-phonics-1plus',title:"Oxford Reading Tree: Level 1+: Floppy's Phonics Fiction: Pack of 6",series:"Oxford Reading Tree · Floppy's Phonics Fiction",author:'Roderick Hunt',
    atos:null,oxfordLevel:'1+',format:'reader',
    note:'Cats, Big, Bad Bug 등 6권 묶음입니다. 배운 소리를 낱말 읽기에 써 보세요. Oxford Level은 AR 수치로 바꾸지 않습니다.',
    source:'https://home.oxfordowl.co.uk/product/oxford-reading-tree-level-1-floppys-phonics-fiction-pack-of-6-9780198484974/'
  },
  {
    id:'ort-stories-3',title:'Oxford Reading Tree: Level 3: Stories: Pack of 6',series:'Oxford Reading Tree · Biff, Chip and Kipper Stories',author:'Roderick Hunt',
    atos:null,oxfordLevel:'3',format:'reader',
    note:'A Cat in the Tree, The Egg Hunt 등 6권 묶음입니다. 소리 내어 읽은 뒤 그림을 보며 사건의 순서를 설명해 보세요.',
    source:'https://home.oxfordowl.co.uk/product/oxford-reading-tree-level-3-stories-pack-of-6-9780198481690/'
  },
  {
    id:'ort-stories-5',title:'Oxford Reading Tree: Level 5: Stories: Pack of 6',series:'Oxford Reading Tree · Biff, Chip and Kipper Stories',author:'Roderick Hunt',
    atos:null,oxfordLevel:'5',format:'reader',
    note:'The Magic Key, Pirate Adventure 등 6권 묶음입니다. 낱말을 읽는 것과 이야기의 흐름을 이해하는 것을 함께 살펴보세요.',
    source:'https://home.oxfordowl.co.uk/product/oxford-reading-tree-level-5-stories-pack-of-6-9780198482413/'
  },
  {
    id:'ort-stories-6',title:'Oxford Reading Tree: Level 6: Stories: Pack of 6',series:'Oxford Reading Tree · Biff, Chip and Kipper Stories',author:'Roderick Hunt',
    atos:null,oxfordLevel:'6',format:'reader',
    note:'Land of the Dinosaurs, In the Garden 등 6권 묶음입니다. 익숙한 인물의 새로운 모험을 읽고 장면 사이의 연결을 말해 보세요.',
    source:'https://home.oxfordowl.co.uk/product/oxford-reading-tree-level-6-stories-pack-of-6-oxford-reading-tree-biff-chip-and-kipper-stories-9780198482772/'
  }
];
g.PlannerReadingBooks=Object.freeze({checked:'2026-10-26',books:Object.freeze(books.map(book=>Object.freeze(book)))});
})(window);
