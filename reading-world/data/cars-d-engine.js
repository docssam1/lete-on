if (!window.LESSONS) window.LESSONS = {};
(function(){
  const STRATEGIES=['Finding Main Idea','Recalling Facts and Details','Understanding Sequence','Recognising Cause and Effect','Comparing and Contrasting','Making Predictions','Finding Word Meaning in Context','Drawing Conclusions and Making Inferences','Distinguishing Between Fact and Opinion',"Identifying Author's Purpose",'Interpreting Figurative Language','Summarising'];
  const LETTERS='ABCD';
  function place(correct, wrongs, letter){
    const vals=[];
    (wrongs||[]).forEach(x=>{x=String(x||'').trim();if(x&&x!==correct&&!vals.includes(x))vals.push(x);});
    ['The passage does not support this idea.','This choice changes an important detail from the passage.','This choice focuses on something that never happened.','This choice gives the opposite of what the passage explains.'].forEach(x=>{if(vals.length<3&&x!==correct&&!vals.includes(x))vals.push(x);});
    const out=[],idx=LETTERS.indexOf(letter);let wi=0;for(let i=0;i<4;i++)out.push(i===idx?correct:vals[wi++]);return out;
  }
  function questions(p,pattern){
    const q=[];function add(i,text,correct,wrongs,explanation){const letter=pattern[i];q.push([STRATEGIES[i],text,place(correct,wrongs,letter),letter,explanation]);}
    add(0,'What is this passage mostly about?',p.main,p.main_wrong,'The passage develops this idea from beginning to end.');
    add(1,p.detail_q,p.detail_a,p.detail_wrong||p.sequence.slice(1),'This detail is stated directly in the passage.');
    add(2,'Which event happened first?',p.sequence[0],p.sequence.slice(1),'The passage presents this event before the other choices.');
    add(3,p.cause_q,p.cause_a,p.cause_wrong||['because the event happened by accident','because everyone forgot the original plan','because a rule forced the characters to do it'],'The passage links this cause directly to the result.');
    add(4,p.compare_q,p.compare_a,p.compare_wrong||['They were completely alike in every way.','They had nothing in common at all.','Only one of them affected the events in the passage.'],'The passage gives information that supports this comparison.');
    add(5,p.predict_q,p.predict_a,p.predict_wrong||['The opposite result would happen for no clear reason.','Nothing at all would change.','Everyone would immediately abandon the plan.'],'This prediction follows logically from the events and information in the passage.');
    add(6,`In the passage, what does the word '${p.vocab[0]}' most likely mean?`,p.vocab[1],p.vocab_wrong||['to stop completely','to move in a noisy hurry','to hide something from view'],'The surrounding sentence gives clues to this meaning.');
    add(7,p.infer_q,p.infer_a,p.infer_wrong||['No one learned anything from the experience.','The main character disliked every part of the event.','The problem could never happen again.'],'This conclusion is not stated word for word, but it is supported by the passage.');
    add(8,'Which statement is an opinion?',p.opinion,p.facts.slice(0,3),'This statement expresses a judgement or feeling rather than a fact that can be checked.');
    const purposes={inform:['to explain or teach readers about the topic',['to persuade readers to buy a product','to entertain readers with a completely imaginary adventure','to give step-by-step directions for a craft']],entertain:['to entertain readers with a story',['to list scientific measurements','to advertise a product or service','to provide rules for entering a contest']],instruct:['to explain how to plan or complete something',['to tell a fantasy story','to describe one person’s childhood','to convince readers to purchase equipment']],persuade:['to persuade readers to take part or take action',['to retell an ancient myth','to explain a natural cycle only','to describe a character’s private thoughts']],describe:['to describe a place, event, or experience clearly',['to provide contest rules','to argue that one side is always correct','to teach a mathematical formula']]};
    const pc=purposes[p.purpose];add(9,"What is the author's main purpose?",pc[0],pc[1],'The organisation and details of the passage match this purpose.');
    add(10,`What does the phrase '${p.figurative[0]}' mean in the passage?`,p.figurative[1],p.figurative_wrong||['The words should be understood only in their exact literal sense.','A magical event actually changed the object.','The speaker forgot what was happening.'],'The phrase is figurative and communicates this idea in a vivid way.');
    add(11,'Which sentence best summarises the passage?',p.summary,p.summary_wrong,'A good summary includes the central idea and the most important events or facts.');return q;
  }
  window.CARS_D_REGISTER=function(list){(list||[]).forEach(l=>{const extra={...l.extra,questions:questions(l.extra,l.extra._pattern)};delete extra._pattern;const newer={...l.new,questions:questions(l.new,l.new._pattern)};delete newer._pattern;window.LESSONS[l.id]={bookId:'cars-level-d',levelId:'D',lessonId:l.id,chapter:l.chapter,chapterNumber:l.num,page:l.page,title:l.title,theme:l.theme,image:'',rewardPoints:{lessonComplete:40},words:l.words,extraLearning:extra,newPassage:newer};});};
})();
