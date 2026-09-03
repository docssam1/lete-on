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
    },
    {
      id: 'set-7',
      label: 'Set 7',
      theme: 'Forest Connections',
      level: 'CARS D / Bricks 300 Part 1 target band',
      passages: [
        passage(
          'forest-partners',
          'Nonfiction',
          'Partners Beneath the Forest',
          [
            'Many forest plants have partners hidden below the soil. Thin threads made by certain fungi grow around or inside plant roots. These threads reach into tiny spaces that roots cannot enter easily. This lets them collect water and nutrients, including phosphorus.',
            'The fungus passes some of these materials to the plant. In return, the plant shares sugars that it made using sunlight. This exchange can help both partners survive. It is especially useful where soil is dry or poor. One fungus may connect with several plants and form a wide underground network.',
            'Scientists study these connections carefully. A network does not mean that every tree freely sends food to every other tree. Plants and fungi can compete. They can also cooperate. Local conditions affect what moves through the soil. Still, the partnership shows that a forest is more than a collection of separate trunks. Some of its most important relationships are too small to see.'
          ],
          [
            ['fungi', 'living things such as mushrooms and molds', '균류'],
            ['nutrients', 'substances that living things need to grow', '영양분'],
            ['exchange', 'the act of giving one thing and receiving another', '교환'],
            ['network', 'a group of connected parts', '연결망'],
            ['cooperate', 'to work together', '협력하다']
          ],
          [
            { type: 'summary', prompt: 'Explain how a plant and a fungus can help each other.' },
            { type: 'evidence', prompt: 'What does the fungus provide, and what does the plant provide in return?' },
            { type: 'opinion', prompt: 'Can something be important even when people cannot see it? Use the passage in your answer.' },
            { type: 'vocabulary', prompt: 'What does "network" mean in this passage?' }
          ]
        ),
        passage(
          'quiet-channel',
          'Fable',
          'The Quiet Channel',
          [
            'Woodpecker liked everyone to hear him work. Each morning he struck a dead branch and announced, “No one helps this forest more loudly than I do.” Below him, a line of ants carried crumbs and bits of leaf beneath a fallen log.',
            'After a storm, mud blocked the narrow spring where animals drank. Woodpecker pecked at branches above the water, but his beak could not move the wet soil. “Stand back,” he called, trying again until he was tired.',
            'The ants did not answer. Hundreds of them followed cracks through the mud, carrying one grain at a time. Their narrow paths joined into a channel. Soon a thin stream reached the thirsty animals, and the pool slowly filled again.',
            'Woodpecker looked at the small workers he had barely noticed. “Your work made almost no sound,” he said. “But everyone can see its result.” From then on, he listened before deciding who was useful. The ants kept working, no louder than before.'
          ],
          [
            ['announced', 'said something clearly for others to hear', '분명히 알렸다'],
            ['blocked', 'closed so that nothing could pass', '막힌'],
            ['channel', 'a narrow path through which water can flow', '물길'],
            ['result', 'what happens because of an action', '결과'],
            ['deciding', 'making a choice or judgment', '판단하는 것']
          ],
          [
            { type: 'summary', prompt: 'Retell the problem at the spring and how it was solved.' },
            { type: 'character', prompt: 'How did Woodpecker judge the ants at first, and how did his view change?' },
            { type: 'opinion', prompt: 'Is loud work more valuable than quiet work? Explain with a story detail.' },
            { type: 'vocabulary', prompt: 'What is a "channel" in the story, and why was it useful?' }
          ]
        )
      ]
    },
    {
      id: 'set-8',
      label: 'Set 8',
      theme: 'Night Travelers',
      level: 'CARS D / Bricks 300 Part 1 target band',
      passages: [
        passage(
          'night-migration',
          'Nonfiction',
          'Why Many Birds Travel at Night',
          [
            'Many small songbirds travel hundreds or thousands of kilometers between nesting and wintering areas. A surprising number begin each part of the journey after sunset. Night air is often cooler than daytime air. It may be calmer too. These conditions can help birds avoid overheating and use less energy.',
            'Flying at night also leaves daylight for feeding and resting. To stay on course, birds combine several clues. They may use the stars and the fading light at sunset. Familiar landforms and Earth’s magnetic field can also help. No single clue guides every bird on every trip.',
            'Artificial light can interrupt this journey. Bright windows and beams may attract or confuse migrating birds. The danger can grow when clouds hide other clues. Birds may circle buildings until they are exhausted. They may also strike glass. During busy migration weeks, some cities dim unnecessary lights at night. A darker route does not remove every danger, but it can give night travelers a safer path.'
          ],
          [
            ['migrating', 'traveling from one region to another with the seasons', '이동하는'],
            ['nesting', 'building or using a place to lay eggs and raise young', '둥지를 트는'],
            ['course', 'the direction or path of travel', '이동 경로'],
            ['magnetic', 'related to the force of a magnet', '자기의'],
            ['artificial', 'made by people rather than occurring naturally', '인공적인']
          ],
          [
            { type: 'summary', prompt: 'Explain why many birds migrate at night and how they find their way.' },
            { type: 'cause', prompt: 'How can artificial light create danger for migrating birds?' },
            { type: 'opinion', prompt: 'Should tall buildings dim unnecessary lights during migration weeks? Explain.' },
            { type: 'vocabulary', prompt: 'What does "stay on course" mean in the second paragraph?' }
          ]
        ),
        passage(
          'moth-lantern',
          'Fable',
          'The Moth and the Lantern',
          [
            'At dusk, an old moth led a group toward a grove where night flowers had opened. “Keep the dark hill on your left and follow the steady moon,” she said. A young moth named Pip noticed a lantern beside a cottage.',
            '“That light is brighter, so it must be a better guide,” Pip insisted. He left the group and flew toward it. As he drew near, the lantern seemed to move around him. Pip circled again and again until his wings felt heavy.',
            'A firefly found him resting on a fence. She flashed slowly and led him away from the cottage. Once the lantern was behind them, Pip could see the hill and moon again. They reached the grove just before the flowers closed.',
            'Pip thanked the firefly. “I chose the loudest-looking answer without checking where it led,” he admitted. On the next journey, he still noticed every bright light, but he compared it with the other signs before changing direction.'
          ],
          [
            ['steady', 'not changing or shaking', '한결같은'],
            ['insisted', 'said firmly that something was true', '우겼다'],
            ['circled', 'moved around something repeatedly', '빙빙 돌았다'],
            ['direction', 'the way in which something travels', '방향'],
            ['compared', 'looked at things to notice similarities or differences', '비교했다']
          ],
          [
            { type: 'summary', prompt: 'Retell Pip’s choice, the problem it caused, and how he found the grove.' },
            { type: 'inference', prompt: 'Why did the lantern seem like a better guide to Pip at first?' },
            { type: 'opinion', prompt: 'What lesson did Pip learn about choosing a guide? Do you agree?' },
            { type: 'vocabulary', prompt: 'What does "steady" mean in the first paragraph?' }
          ]
        )
      ]
    },
    {
      id: 'set-9',
      label: 'Set 9',
      theme: 'Built to Change',
      level: 'CARS D / Bricks 300 Part 1 target band',
      passages: [
        passage(
          'moving-bridges',
          'Nonfiction',
          'Why Bridges Need Room to Move',
          [
            'A bridge may look completely still, but its materials move a little every day. Steel and concrete expand when they become warmer. They contract when they cool. A long bridge can change length by several centimeters as the temperature rises or falls.',
            'Traffic and wind create movement too. If every part were locked tightly in place, pressure could build. A surface might then crack or bend. Engineers therefore install expansion joints between sections of the road. They also use bearings. These parts let the bridge deck slide or turn by a small amount.',
            'Moving parts must be inspected and repaired. A damaged joint may let water and dirt reach pieces below the road. Too large a gap can also make travel rough. Allowing movement does not make a bridge weak. Controlled flexibility protects the larger structure. It gives ordinary changes a safe place to happen.'
          ],
          [
            ['expand', 'to become larger', '팽창하다'],
            ['contract', 'to become smaller or shorter', '수축하다'],
            ['pressure', 'a force that pushes on something', '압력'],
            ['inspected', 'examined carefully for problems', '점검된'],
            ['flexibility', 'the ability to bend or change without breaking', '유연성']
          ],
          [
            { type: 'summary', prompt: 'Explain why bridges move and how engineers manage that movement.' },
            { type: 'cause', prompt: 'What could happen if every bridge part were locked tightly in place?' },
            { type: 'opinion', prompt: 'Would a bridge be safer with no gaps at all? Use evidence from the passage.' },
            { type: 'vocabulary', prompt: 'What does "controlled flexibility" mean in the final paragraph?' }
          ]
        ),
        passage(
          'jar-basket',
          'Fable',
          'The Jar and the Woven Basket',
          [
            'On a merchant’s cart, a tall clay jar stood beside a woven basket. “You bend whenever the road turns,” the jar told the basket. “A proper container should hold one perfect shape.”',
            'The cart reached a rocky hill. At each bump, the basket shifted and pressed gently around the apples inside it. The jar remained rigid. It knocked against the wooden rail and gained a thin crack.',
            'The driver stopped and wrapped the jar in cloth. The basket leaned to make room. “You are changing shape again,” the jar whispered. “Yes,” said the basket, “so that neither of us has to fall.”',
            'When they reached the market, every apple was safe, and the jar was still in one piece. The jar no longer mistook movement for weakness. On the trip home, it asked the basket where to lean before the road became rough.'
          ],
          [
            ['woven', 'made by crossing threads or strips over and under', '엮어 만든'],
            ['proper', 'correct or suitable for a situation', '알맞은'],
            ['rigid', 'stiff and unable to bend', '딱딱한'],
            ['wrapped', 'covered by folding material around something', '감쌌다'],
            ['mistook', 'understood something incorrectly', '잘못 생각했다']
          ],
          [
            { type: 'summary', prompt: 'Retell what happened to the jar and basket on the rocky road.' },
            { type: 'cause', prompt: 'Why did the basket protect its apples better than the jar protected itself?' },
            { type: 'opinion', prompt: 'Which object showed greater strength? Explain what strength means in this story.' },
            { type: 'vocabulary', prompt: 'What does "rigid" mean, and how did being rigid affect the jar?' }
          ]
        )
      ]
    },
    {
      id: 'set-10',
      label: 'Set 10',
      theme: 'Protecting Tomorrow',
      level: 'CARS D / Bricks 300 Part 1 target band',
      passages: [
        passage(
          'seed-banks',
          'Nonfiction',
          'A Library Made of Seeds',
          [
            'A seed bank is a place that stores seeds for the future. Workers collect seeds from many varieties of crops and wild plants. Each sample is labeled with information such as the plant’s name, where it grew, and when it was collected.',
            'Before storage, many seeds are cleaned and dried. They are then kept cold, which slows the changes that happen as seeds age. Workers sometimes remove a few seeds and test whether they can still germinate. If too few sprout, they grow new plants and collect fresh seeds.',
            'Important samples may be stored in more than one location. A backup collection can help after a fire, flood, war, plant disease, or other loss. Seed banks do not replace farms or natural habitats, because living plants must continue to grow and adapt. Instead, they preserve choices. A small envelope today may provide useful traits for tomorrow’s food or restoration work.'
          ],
          [
            ['varieties', 'different kinds of the same general plant', '품종들'],
            ['sample', 'a small amount that represents a larger group', '표본'],
            ['storage', 'the act of keeping something for later use', '보관'],
            ['germinate', 'to begin to grow from a seed', '싹트다'],
            ['preserve', 'to protect something so it lasts', '보존하다']
          ],
          [
            { type: 'summary', prompt: 'Explain how a seed bank stores seeds and why that work matters.' },
            { type: 'sequence', prompt: 'What happens to seeds before, during, and after long-term storage?' },
            { type: 'opinion', prompt: 'Should communities support seed banks even when the seeds may not be used for years? Explain.' },
            { type: 'vocabulary', prompt: 'What does "preserve choices" mean in the final paragraph?' }
          ]
        ),
        passage(
          'finch-seeds',
          'Fable',
          'The Finch’s Favorite Seed',
          [
            'Finch and Wren prepared gardens before the rainy season. Finch planted only round red seeds because they had produced the sweetest berries the year before. Wren planted red seeds, small blue seeds, and several wrinkled brown ones.',
            '“Why waste space on seeds that may taste worse?” Finch asked. Wren replied, “I do not know what weather is coming, so I am giving the garden more than one chance.”',
            'The rains began late. Finch’s young red plants withered in the dry soil. Some of Wren’s plants failed too, but the brown variety grew deep roots and survived. Wren saved part of its harvest and shared the rest with Finch.',
            'Finch expected a lecture, but Wren simply handed over a pouch. “Last year taught you which berry was sweetest,” she said. “This year can teach us which seed endures.” The next season, Finch planted his favorite again, but not alone.'
          ],
          [
            ['prepared', 'made something ready', '준비했다'],
            ['variety', 'one particular kind within a larger group', '품종'],
            ['withered', 'became dry and weak', '시들었다'],
            ['survived', 'continued to live through difficulty', '살아남았다'],
            ['endures', 'continues through a difficult condition', '견뎌 낸다']
          ],
          [
            { type: 'summary', prompt: 'Retell how Finch’s and Wren’s different choices affected their gardens.' },
            { type: 'inference', prompt: 'Why did Wren plant several kinds of seeds instead of only her favorite?' },
            { type: 'opinion', prompt: 'Was Wren wise to share her harvest with Finch? Explain.' },
            { type: 'vocabulary', prompt: 'What does "endures" mean in Wren’s final sentence?' }
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
