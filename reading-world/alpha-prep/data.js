(function () {
  'use strict';

  const passage = (id, genre, title, paragraphs, vocabulary, questions) => ({
    id, genre, title, paragraphs, vocabulary, questions,
  });

  window.ALPHA_PREP_SETS = [
    {
      id: 'set-1',
      label: 'Set 1',
      theme: 'Nature Detectives',
      level: 'CARS D / Bricks 300 Part 1 target band',
      passages: [
        passage(
          'city-trees',
          'Nonfiction',
          'Why City Trees Need Room',
          [
            'A young tree planted beside a city street may look as if it has plenty of space. Above the ground, its branches can reach toward the sun. Below the pavement, however, the tree is often crowded. Roots must share a narrow strip of soil with pipes, building walls, and hard concrete.',
            'Roots do more than hold a tree in place. They absorb water and minerals, and they also need tiny pockets of air in the soil. When people walk over the same patch every day, the soil becomes packed. Water runs away instead of sinking in, and the roots may not receive what they need.',
            'Some cities now build larger planting beds and cover the ground with low fences or mulch. Others use special pavement that lets rain pass through. These changes cost more at first, but healthy trees provide shade, cool nearby buildings, and reduce rainwater flowing into streets. Giving one tree a little more room can therefore help an entire neighborhood.'
          ],
          [
            ['absorb', 'to take in', '흡수하다'],
            ['packed', 'pressed tightly together', '단단히 눌린'],
            ['reduce', 'to make something smaller or less', '줄이다'],
            ['provide', 'to give what is needed', '제공하다'],
            ['therefore', 'for that reason', '그러므로']
          ],
          [
            { type: 'summary', prompt: 'Please summarize the passage in two or three sentences.' },
            { type: 'evidence', prompt: 'Why can pavement make it difficult for a city tree to stay healthy?' },
            { type: 'opinion', prompt: 'Should a city spend extra money to give street trees more room? Explain your view.' },
            { type: 'vocabulary', prompt: 'What does "absorb" mean in the passage, and what clue helped you?' }
          ]
        ),
        passage(
          'borrowed-shade',
          'Fiction',
          'The Borrowed Shade',
          [
            'On the hottest day of summer, a rabbit found a cool patch beneath an old pear tree. “This shade belongs to me,” he announced, stretching across the whole spot.',
            'Soon a tired fox arrived. Rabbit pointed to the bright grass. “You may rest over there.” The fox quietly sat at the edge of the tree’s shadow. As the sun moved, the shadow moved too, and Rabbit kept sliding after it. Each time, he pushed Fox back into the heat.',
            'Then a strong wind shook the branches. A heavy pear dropped beside Rabbit, and he leaped away in surprise. Fox caught the rolling fruit before it fell into the stream. He split it in half and offered a piece to Rabbit.',
            'Rabbit stared at the pear and then at the wide shadow. He realized that he had not made the tree, the fruit, or the shade. “I was guarding a gift that was never mine,” he said. The two animals sat together, and the cool patch seemed large enough after all.'
          ],
          [
            ['announced', 'said something clearly to others', '분명히 알렸다'],
            ['edge', 'the outside part of something', '가장자리'],
            ['offered', 'said someone could have something', '건넸다'],
            ['realized', 'understood something clearly', '깨달았다'],
            ['guarding', 'watching and protecting', '지키는 것']
          ],
          [
            { type: 'summary', prompt: 'Retell the story, including the problem and how it was solved.' },
            { type: 'inference', prompt: 'Why did Fox share the pear even after Rabbit had been unkind?' },
            { type: 'opinion', prompt: 'What lesson did Rabbit learn? Do you agree with that lesson?' },
            { type: 'vocabulary', prompt: 'What does "realized" mean here? Use it in a new sentence.' }
          ]
        )
      ]
    },
    {
      id: 'set-2',
      label: 'Set 2',
      theme: 'Signals and Choices',
      level: 'CARS D / Bricks 300 Part 1 target band',
      passages: [
        passage(
          'bee-dance',
          'Nonfiction',
          'A Map Made of Movement',
          [
            'Honeybees cannot draw a map, but they can show one with movement. When a worker bee discovers flowers rich in nectar, she returns to the hive and performs a waggle dance. Other bees touch her and follow the pattern in the darkness.',
            'The direction of the dance gives one part of the message. A bee that moves straight upward is telling the others to fly toward the sun. A tilted path points to a direction to the right or left of the sun. The length of the waggle tells about distance. A longer waggle usually means the flowers are farther away.',
            'The dancer also carries the flowers’ scent, which helps the searching bees recognize the correct plants. Wind and moving clouds can make the trip difficult, so the message is not a perfect set of instructions. Still, it greatly narrows the search. By sharing information, one bee saves many others from flying in every direction and wasting precious energy.'
          ],
          [
            ['discovers', 'finds something for the first time', '발견하다'],
            ['performs', 'carries out an action for others to see', '수행하다'],
            ['tilted', 'slanted to one side', '기울어진'],
            ['recognize', 'know something from seeing or sensing it', '알아보다'],
            ['narrows', 'makes a range smaller', '범위를 좁힌다']
          ],
          [
            { type: 'summary', prompt: 'Explain how a waggle dance works.' },
            { type: 'sequence', prompt: 'What information does a bee receive first from the dance, and what other clues follow?' },
            { type: 'inference', prompt: 'Why is the flower scent useful even after the bees know the direction?' },
            { type: 'vocabulary', prompt: 'What does "narrows the search" mean in the final paragraph?' }
          ]
        ),
        passage(
          'bell-on-hill',
          'Fiction',
          'The Bell on the Hill',
          [
            'Every evening, Nari rang a small bell from the hill so travelers could find the village before dark. One foggy afternoon, her cousin Jun offered to help. “I can ring it while you gather firewood,” he said.',
            'Jun liked the sound so much that he rang the bell again and again, even though no traveler was nearby. The villagers finally stopped looking up. Later, a sudden storm covered the path. Nari heard a distant shout, but when Jun rang the bell, no one came to guide the lost traveler. They thought he was only playing again.',
            'Nari lit a lantern and followed the voice until she found an old merchant. After bringing him safely home, she asked Jun to explain what had happened to the village. Jun apologized and promised to ring only when the signal was needed.',
            'The next night, one clear bell note crossed the valley. This time, every villager looked toward the hill.'
          ],
          [
            ['foggy', 'filled with a thick cloud near the ground', '안개 낀'],
            ['distant', 'far away', '멀리 있는'],
            ['guide', 'to show the way', '길을 안내하다'],
            ['merchant', 'a person who buys and sells goods', '상인'],
            ['signal', 'an action or sound that gives information', '신호']
          ],
          [
            { type: 'summary', prompt: 'Tell what Jun did, what problem it caused, and how he changed.' },
            { type: 'cause', prompt: 'Why did the villagers ignore the bell during the storm?' },
            { type: 'opinion', prompt: 'Was Jun’s apology enough? What else could he do to rebuild trust?' },
            { type: 'vocabulary', prompt: 'Explain the word "signal" and give another example of a signal.' }
          ]
        )
      ]
    },
    {
      id: 'set-3',
      label: 'Set 3',
      theme: 'Ocean Neighbors',
      level: 'CARS D / Bricks 300 Part 1 target band',
      passages: [
        passage(
          'tide-pools',
          'Nonfiction',
          'Life Between Two Tides',
          [
            'A tide pool is a small pocket of seawater left behind when the ocean tide moves out. It may look peaceful, but its residents live through constant change. For part of the day, waves cover the pool. Later, sunlight warms the water while wind causes some of it to evaporate.',
            'Animals in a tide pool have special ways to survive. Sea anemones pull in their soft tentacles so they will not dry out. Crabs hide beneath cool rocks. Mussels close their shells tightly and attach themselves to stone with strong threads. These behaviors also protect them from hungry birds.',
            'Visitors can easily harm this tiny habitat without meaning to. Turning over a rock may expose an animal to heat, and taking one shell can remove a creature’s home. Careful explorers step on bare rock, keep their hands gentle, and return anything they move. A tide pool is small, but it is a complete neighborhood whose members depend on the same limited space.'
          ],
          [
            ['residents', 'people or animals that live in a place', '거주 생물'],
            ['evaporate', 'to change from liquid into gas', '증발하다'],
            ['attach', 'to fasten one thing to another', '붙이다'],
            ['expose', 'to leave something unprotected', '드러내다'],
            ['habitat', 'the natural home of a plant or animal', '서식지']
          ],
          [
            { type: 'summary', prompt: 'Summarize the challenges of tide-pool life and how animals meet them.' },
            { type: 'cause', prompt: 'How can turning over one rock cause a problem?' },
            { type: 'opinion', prompt: 'Should visitors be allowed to touch tide-pool animals? Give a rule and a reason.' },
            { type: 'vocabulary', prompt: 'Use the passage to explain what a "habitat" is.' }
          ]
        ),
        passage(
          'small-shell',
          'Fiction',
          'The Smallest Shell',
          [
            'Mara collected shells for the village festival. She hoped to win the blue ribbon, so she chose only the largest and brightest ones. At the edge of the beach, her little brother Sol held up a plain gray shell with a narrow crack.',
            '“That one will never win,” Mara said. Sol placed it gently in his pocket. On their walk home, they heard a faint scratching from a dry pool between the rocks. A young hermit crab was trapped there, far from the water.',
            'Mara tried offering her beautiful shells, but each was too large. Sol set down the gray shell. The crab slipped inside at once. Together, the children carried it close to the sea and watched it disappear beneath a wave.',
            'At the festival, Mara’s basket looked less impressive than the others. When the judge asked about the empty space in it, she told the story. “A useful shell is more valuable than a perfect one,” the judge said, tying the blue ribbon around Sol’s small gray shell.'
          ],
          [
            ['plain', 'not decorated or unusual', '수수한'],
            ['faint', 'quiet or difficult to notice', '희미한'],
            ['trapped', 'unable to escape', '갇힌'],
            ['impressive', 'causing admiration', '인상적인'],
            ['valuable', 'important or useful', '가치 있는']
          ],
          [
            { type: 'summary', prompt: 'Summarize the story and explain why the ribbon was awarded.' },
            { type: 'character', prompt: 'How did Mara’s idea of value change?' },
            { type: 'opinion', prompt: 'Do you think the judge made the right choice? Support your answer.' },
            { type: 'vocabulary', prompt: 'What does "valuable" mean in this story? Is it the same as expensive?' }
          ]
        )
      ]
    },
    {
      id: 'set-4',
      label: 'Set 4',
      theme: 'Learning and Memory',
      level: 'CARS D / Bricks 300 Part 1 target band',
      passages: [
        passage(
          'sleep-memory',
          'Nonfiction',
          'Why Practice Needs Sleep',
          [
            'Many students think learning ends when they close a book. Yet the brain keeps working after practice. During sleep, it sorts new information. It also connects new facts with things already stored in memory. This can make a lesson easier to recall the next day.',
            'In one kind of test, people learn a short finger pattern on a keyboard. Some try it again after being awake for many hours. Others practice in the evening, sleep, and try it in the morning. The group that sleeps often performs the pattern more accurately. They improve even without extra practice.',
            'Sleep cannot replace careful study. A person who never practiced gives the brain little new information to organize. However, repeating the same lesson very late may not help much. It can be better to study earlier and get enough rest. Focused practice, short breaks, and sleep give the brain several chances to strengthen a new skill.'
          ],
          [
            ['sorts', 'puts things into groups or order', '정리한다'],
            ['recall', 'to remember', '기억해 내다'],
            ['accurately', 'correctly and without mistakes', '정확하게'],
            ['replace', 'to take the place of something', '대신하다'],
            ['strengthen', 'to make stronger', '강화하다']
          ],
          [
            { type: 'summary', prompt: 'Explain the passage’s main idea about practice and sleep.' },
            { type: 'evidence', prompt: 'What happened in the keyboard-pattern experiment?' },
            { type: 'opinion', prompt: 'Would you change your study schedule after reading this? Why or why not?' },
            { type: 'vocabulary', prompt: 'What does "recall" mean, and how is it different from learning something new?' }
          ]
        ),
        passage(
          'missing-line',
          'Fiction',
          'The Missing Line',
          [
            'Eli had one line in the school play, but it was the line that solved the mystery. He repeated it all afternoon. At rehearsal, he spoke perfectly. That night, however, he kept practicing under his blanket instead of sleeping.',
            'The next morning, Eli’s head felt full of fog. When his turn came, he remembered the beginning of the sentence but not the end. His partner Ava did not whisper the missing words. Instead, she asked the question from the scene one more time and pointed to the paper clue on the table.',
            'Eli looked at the clue. The meaning of his line returned, although the exact words did not. He explained the answer in his own way, and the play continued.',
            'Afterward, Eli thanked Ava. “You didn’t give me the line,” he said. “You helped me find the idea.” Before the evening performance, he practiced once, ate dinner, and went to bed early.'
          ],
          [
            ['rehearsal', 'a practice before a performance', '리허설'],
            ['exact', 'completely correct in every detail', '정확히 같은'],
            ['clue', 'information that helps solve a problem', '단서'],
            ['continued', 'kept going', '계속되었다'],
            ['performance', 'a show for an audience', '공연']
          ],
          [
            { type: 'summary', prompt: 'Retell Eli’s problem and how he solved it.' },
            { type: 'inference', prompt: 'Why did Ava point to the clue instead of whispering the line?' },
            { type: 'opinion', prompt: 'Was it acceptable for Eli to use his own words during the play? Explain.' },
            { type: 'vocabulary', prompt: 'What is a rehearsal, and why is it useful?' }
          ]
        )
      ]
    },
    {
      id: 'set-5',
      label: 'Set 5',
      theme: 'Ideas That Travel',
      level: 'CARS D / Bricks 300 Part 1 target band',
      passages: [
        passage(
          'bike-library',
          'Nonfiction',
          'A Library on Two Wheels',
          [
            'In some places, families live far from a public library. A large bookmobile can visit towns with wide roads. However, it cannot always reach narrow mountain paths or crowded areas. To solve this problem, some communities use bicycle libraries.',
            'A bicycle library may pull a small cart filled with books. The rider follows a regular route. The bicycle stops at schools, markets, or village centers. Readers return one book and borrow another. Space is limited, so the rider records requests and changes the collection often.',
            'The bicycle does more than carry stories. Some riders read aloud or help adults complete forms. They may also bring facts about health services. Rain, steep hills, and damaged paths can delay a trip. Local volunteers sometimes build sheltered book stops. The system is simple, but it works because librarians and neighbors plan together. Readers do not have to travel to a building. The library travels to them.'
          ],
          [
            ['communities', 'groups of people living or working together', '지역 공동체'],
            ['regular', 'happening at expected times', '정기적인'],
            ['collection', 'a group of things gathered together', '소장 자료'],
            ['delay', 'to make something happen later', '늦추다'],
            ['sheltered', 'protected from weather or danger', '보호된']
          ],
          [
            { type: 'summary', prompt: 'Describe the problem, the bicycle-library solution, and why it works.' },
            { type: 'compare', prompt: 'How is a bicycle library different from a building library?' },
            { type: 'opinion', prompt: 'Which service besides lending books seems most useful? Explain.' },
            { type: 'vocabulary', prompt: 'What does "regular route" mean in this passage?' }
          ]
        ),
        passage(
          'paper-bridge',
          'Fiction',
          'The Paper Bridge',
          [
            'For the class challenge, teams had to build a bridge from ten sheets of paper. Joon folded every sheet into a thick block. “A strong bridge needs as much paper as possible in the middle,” he said.',
            'His teammate Rina disagreed. She wanted to roll some sheets into narrow tubes for supports. The two argued until the teacher placed a toy truck beside them. “You have six minutes left,” she warned.',
            'At the next table, another team quietly tested one small paper tube. It held three books before bending. Rina noticed the result, but Joon was still protecting his block. Then the teacher asked, “What did their test show you?”',
            'Joon paused. He unfolded two sheets, and Rina helped make four tubes. Their final bridge was not the prettiest, but the truck crossed it. Joon later said, “Changing my mind did not mean my first idea was foolish. It meant our evidence had improved.”'
          ],
          [
            ['challenge', 'a difficult task', '도전 과제'],
            ['supports', 'parts that hold something up', '지지대'],
            ['argued', 'gave different opinions angrily', '논쟁했다'],
            ['evidence', 'facts that help prove an idea', '근거'],
            ['improved', 'became better', '향상되었다']
          ],
          [
            { type: 'summary', prompt: 'Summarize the team’s disagreement and final solution.' },
            { type: 'inference', prompt: 'Why did the teacher ask about the other team’s test instead of giving Joon the answer?' },
            { type: 'opinion', prompt: 'Does changing your mind show weakness or strength? Use the story in your answer.' },
            { type: 'vocabulary', prompt: 'What counted as evidence in the story?' }
          ]
        )
      ]
    },
    {
      id: 'set-6',
      label: 'Set 6',
      theme: 'Fairness and Responsibility',
      level: 'CARS D / Bricks 300 Part 1 target band',
      passages: [
        passage(
          'community-fridge',
          'Nonfiction',
          'The Community Fridge',
          [
            'A community fridge is placed where neighbors can reach it. Stores, restaurants, and families leave fresh food they will not use. Anyone who needs food may take a reasonable amount. The goal is to reduce waste and let people share food with dignity.',
            'Keeping the fridge safe requires teamwork. Volunteers check dates, clean shelves, and remove unsafe food. Clear labels explain what may be donated. Some groups also record the temperature each day. This keeps milk, eggs, and other foods cold enough.',
            'The system can face problems. One person might take far more than needed. Food might also be left outside the fridge. Many communities use simple rules rather than locks. They post reminders and plan times for volunteers to help. They ask local stores to donate smaller packages. A community fridge works best when people see it as a shared responsibility, not just a box of free items.'
          ],
          [
            ['reasonable', 'fair and not too much', '알맞은'],
            ['dignity', 'the feeling of being worthy of respect', '존엄성'],
            ['requires', 'needs something in order to work', '필요로 한다'],
            ['donated', 'given to help others', '기부된'],
            ['responsibility', 'a duty to care for something', '책임']
          ],
          [
            { type: 'summary', prompt: 'Explain the purpose of a community fridge and how people keep it working.' },
            { type: 'cause', prompt: 'Why do volunteers check dates and temperatures?' },
            { type: 'opinion', prompt: 'Are simple rules enough, or should a community fridge use locks? Explain.' },
            { type: 'vocabulary', prompt: 'What does "shared responsibility" mean in the final sentence?' }
          ]
        ),
        passage(
          'two-brooms',
          'Fiction',
          'The Two Brooms',
          [
            'After the harvest festival, the town square was covered with paper ribbons. Sumi grabbed the new wide broom while her cousin Dae was left with an old narrow one. “I chose first,” Sumi said. “That makes it fair.”',
            'Sumi pushed a huge pile toward one corner, but the wide broom caught on every bench. Dae used the narrow broom to clean carefully beneath the seats. Soon he had filled two bags, while Sumi’s pile kept spreading in the wind.',
            'A shopkeeper offered to trade their tools, but Dae shook his head. “The narrow broom fits my job. Sumi’s broom fits the open path.” Sumi understood. Instead of arguing over which broom was better, they divided the square by the kind of work each tool could do.',
            'They finished before sunset. Sumi admitted that choosing first had given her a choice, but it had not automatically made the whole job fair.'
          ],
          [
            ['harvest', 'the gathering of crops', '수확'],
            ['caught', 'became stuck', '걸렸다'],
            ['carefully', 'with close attention', '조심스럽게'],
            ['trade', 'to exchange one thing for another', '바꾸다'],
            ['automatically', 'without needing another decision', '자동으로']
          ],
          [
            { type: 'summary', prompt: 'Retell how Sumi and Dae found a fair way to finish the work.' },
            { type: 'compare', prompt: 'What was each broom good at doing?' },
            { type: 'opinion', prompt: 'Was Sumi right that choosing first made things fair? Explain your definition of fairness.' },
            { type: 'vocabulary', prompt: 'What does "automatically" mean in the last sentence?' }
          ]
        )
      ]
    }
  ];

  window.ALPHA_PREP_PEERS = [
    { id: 'mina', name: 'Mina', color: '#d96b5f' },
    { id: 'leo', name: 'Leo', color: '#347a68' },
    { id: 'emma', name: 'Emma', color: '#d39b32' },
    { id: 'noah', name: 'Noah', color: '#4777a8' }
  ];
})();
