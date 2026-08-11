// Evidence and counselling copy used only by the CARS analysis report.
// Keep this separate from the Reading Prime and WonderSkills course data.
window.CARS_REPORT_GUIDE={
  updated:'2026-08-11',
  sources:[
    {
      id:'cars-levels',
      ko:'CARS & STARS 읽기 레벨 상관표',
      en:'CARS & STARS Reading Level Correlations',
      url:'https://help.carsandstars.com.au/hc/en-au/articles/4408365856271-CARS-STARS-Reading-Level-Correlations',
      noteKo:'B·C·D를 대략 Year 2·3·4의 텍스트 복잡도와 연결하되, 배치 결과와 교사 판단을 우선합니다.',
      noteEn:'Links B, C and D roughly to Years 2, 3 and 4 by text complexity; placement evidence and teacher judgement still take priority.'
    },
    {
      id:'cars-lessons',
      ko:'CARS & STARS 전략별 수업표와 5단계 과정',
      en:'CARS & STARS strategy lesson chart and five-step cycle',
      url:'https://help.carsandstars.com.au/hc/en-au/articles/10984649746447-STARS-Lesson-Charts',
      noteKo:'진단된 약점 전략을 명시적으로 가르친 뒤 벤치마크와 사후검사로 확인하는 구조를 처방에 반영했습니다.',
      noteEn:'Supports explicit teaching of diagnosed strategies followed by benchmark and post-test checks.'
    },
    {
      id:'ies-2022',
      ko:'미국 IES/WWC 읽기 중재 실천 가이드(4-9학년)',
      en:'IES/WWC Practice Guide: Reading Interventions in Grades 4-9',
      url:'https://ies.ed.gov/ncee/WWC/PracticeGuide/29/Published',
      noteKo:'배경·어휘 지식, 질문 생성·응답, 짧은 단락의 요지 찾기, 이해 점검, 도전 지문 연습을 수업 루틴에 반영했습니다.',
      noteEn:'Supports knowledge building, question answering, gist routines, comprehension monitoring and supported stretch-text practice.'
    },
    {
      id:'nrp',
      ko:'미국 National Reading Panel 독해 연구 종합',
      en:'National Reading Panel synthesis on comprehension',
      url:'https://www.nichd.nih.gov/publications/pubs/nrp/Pages/findings.aspx',
      noteKo:'그래픽 조직자, 질문 답하기·만들기, 이야기 구조, 요약을 함께 사용하는 다중 전략 지도를 반영했습니다.',
      noteEn:'Supports combining graphic organisers, question answering and generation, story structure and summarisation.'
    },
    {
      id:'textstat',
      ko:'Textstat 오픈소스 읽기 난도 도구',
      en:'Textstat open-source readability toolkit',
      url:'https://github.com/textstat/textstat',
      noteKo:'향후 자체 지문의 문장·어휘 난도를 보조 점검할 때 사용할 수 있는 MIT 라이선스 도구입니다. 현재 교재 추천은 공식 학년 표기와 진단 결과를 기준으로 합니다.',
      noteEn:'An MIT-licensed aid for future readability checks. Current book matching uses official grade labels and diagnostic evidence, not a formula alone.'
    }
  ],
  rx:{
    'Finding Main Idea':{
      errorKo:'세부 예시 하나를 중심 생각으로 고르거나, 첫 문장만 보고 판단했을 가능성이 큽니다.',
      errorEn:'The student may be choosing one interesting detail or relying on the opening sentence instead of integrating the whole text.',
      routineKo:'문단마다 핵심어 2개를 표시한 뒤 공통되는 내용을 10단어 안의 한 문장으로 묶게 합니다.',
      routineEn:'Mark two key words per paragraph, then combine what repeats into one sentence of ten words or fewer.',
      promptKo:'모든 문단을 덮는 한 문장은 무엇인가?',promptEn:'Which one sentence covers every paragraph?',
      criterionKo:'새 지문 3개 중 2개 이상에서 주제와 근거 세부사항을 함께 제시',criterionEn:'States the main idea and one supporting detail on at least 2 of 3 new texts.'
    },
    'Recalling Facts and Details':{
      errorKo:'기억에 의존하거나 보기와 비슷한 단어만 찾아 골랐을 수 있습니다.',
      errorEn:'The student may be answering from memory or matching surface words without locating proof.',
      routineKo:'질문의 핵심어를 동그라미 친 뒤 지문에서 같은 뜻의 문장을 찾아 줄 번호와 함께 답하게 합니다.',
      routineEn:'Circle the question key words, locate the sentence with the same meaning, and record its line number before answering.',
      promptKo:'답을 증명하는 정확한 문장은 어디인가?',promptEn:'Which exact sentence proves the answer?',
      criterionKo:'근거 문장 표시 후 세부정보 문항 4개 중 3개 이상 정답',criterionEn:'After marking evidence, answers at least 3 of 4 detail questions correctly.'
    },
    'Understanding Sequence':{
      errorKo:'글에 제시된 순서와 실제 사건의 시간 순서를 혼동했을 가능성이 있습니다.',
      errorEn:'The student may be confusing the order of presentation with the actual chronology of events.',
      routineKo:'first-next-then-finally 네 칸에 사건을 짧게 옮긴 뒤 시간 표현과 대명사를 다시 확인합니다.',
      routineEn:'Move events into a first-next-then-finally strip, then check time markers and pronoun references.',
      promptKo:'이 일 직전과 직후에는 무엇이 일어났나?',promptEn:'What happened immediately before and after this event?',
      criterionKo:'순서 카드 5개를 배열하고 각 연결어를 설명',criterionEn:'Orders five event cards and explains the time signal connecting each one.'
    },
    'Recognizing Cause and Effect':{
      errorKo:'원인과 결과를 뒤집거나, 시간상 먼저 나온 사건을 무조건 원인으로 보았을 수 있습니다.',
      errorEn:'The student may be reversing cause and result or treating any earlier event as the cause.',
      routineKo:'because 쪽에는 원인, so 쪽에는 결과를 적고 두 문장을 서로 바꾸면 뜻이 성립하는지 확인합니다.',
      routineEn:'Place the reason after because and the result after so, then test whether reversing them still makes sense.',
      promptKo:'왜 일어났고, 그 결과 무엇이 달라졌나?',promptEn:'Why did it happen, and what changed as a result?',
      criterionKo:'새 사례 4개에서 원인·결과를 3개 이상 정확히 분리',criterionEn:'Separates cause from effect correctly in at least 3 of 4 new examples.'
    },
    'Comparing and Contrasting':{
      errorKo:'두 대상 중 하나의 특징만 찾거나 같은 점과 다른 점의 기준을 섞었을 수 있습니다.',
      errorEn:'The student may be listing features of only one subject or switching the basis of comparison.',
      routineKo:'같은 기준을 행 제목으로 둔 3열 표(대상 A-공통-대상 B)에 근거를 채우게 합니다.',
      routineEn:'Use a three-column organiser (A-same-B) with one fixed comparison category per row.',
      promptKo:'같은 기준으로 보았을 때 무엇이 같고 다른가?',promptEn:'Using the same category, what is alike and what is different?',
      criterionKo:'두 대상에 대해 공통점 2개와 차이점 2개를 근거와 함께 제시',criterionEn:'Gives two similarities and two differences with textual evidence.'
    },
    'Making Predictions':{
      errorKo:'이미 일어난 일을 예측으로 고르거나 배경지식만 사용하고 지문 단서를 놓쳤을 수 있습니다.',
      errorEn:'The student may be selecting an event that already happened or predicting from background knowledge without text clues.',
      routineKo:'예측-지문 단서-배경지식 세 칸을 모두 채운 뒤 가장 가능성 높은 선택지만 남깁니다.',
      routineEn:'Complete prediction-text clue-background knowledge, then keep only the option supported by both sources.',
      promptKo:'아직 일어나지 않았고, 어떤 단서가 그것을 뒷받침하나?',promptEn:'Has it not happened yet, and which clue supports it?',
      criterionKo:'세 예측 모두에 서로 다른 지문 단서를 제시하고 2개 이상 적중',criterionEn:'Uses a distinct text clue for all three predictions and gets at least two correct.'
    },
    'Finding Word Meaning in Context':{
      errorKo:'익숙한 뜻 하나를 그대로 적용하거나 문장 속 대비·예시 단서를 놓쳤을 수 있습니다.',
      errorEn:'The student may be applying a familiar dictionary meaning while missing contrast, example or restatement clues.',
      routineKo:'낱말을 가리고 대체어를 넣어 문장을 읽은 뒤 앞뒤 문장과 자연스럽게 이어지는지 검증합니다.',
      routineEn:'Cover the word, substitute a possible meaning, and reread across the surrounding sentences to test the fit.',
      promptKo:'이 뜻을 넣었을 때 앞뒤 문장이 모두 자연스러운가?',promptEn:'Does this meaning make both surrounding sentences coherent?',
      criterionKo:'문맥 단서 유형을 말하며 낯선 낱말 4개 중 3개 이상 추론',criterionEn:'Names the clue type and infers at least 3 of 4 unfamiliar words.'
    },
    'Drawing Conclusions and Making Inferences':{
      errorKo:'가능한 생각과 지문으로 입증되는 결론을 구분하지 못했을 수 있습니다.',
      errorEn:'The student may be confusing a plausible idea with a conclusion that the text actually supports.',
      routineKo:'내 생각과 지문 단서를 각각 적고, 둘을 합친 결론을 therefore 문장으로 완성합니다.',
      routineEn:'Write what I know and the text clue separately, then combine them in a therefore sentence.',
      promptKo:'그 결론을 지지하는 단서 두 개는 무엇인가?',promptEn:'Which two clues support that conclusion?',
      criterionKo:'추론 3개 중 2개 이상에서 서로 다른 근거 2개를 연결',criterionEn:'Connects two distinct clues on at least 2 of 3 inference items.'
    },
    'Distinguishing Between Fact and Opinion':{
      errorKo:'구체적인 문장을 사실로, 강한 표현을 의견으로 판단하는 표면 규칙에 의존했을 수 있습니다.',
      errorEn:'The student may be using surface rules such as specific equals fact or strong wording equals opinion.',
      routineKo:'각 문장을 확인 가능-증거 필요-개인 판단으로 분류하고 사실은 확인 방법까지 적게 합니다.',
      routineEn:'Sort each statement into verifiable, evidence needed or personal judgement, and name how a fact could be checked.',
      promptKo:'누구나 같은 방법으로 확인할 수 있는가?',promptEn:'Could anyone verify this in the same way?',
      criterionKo:'혼합 문장 6개 중 5개 이상 분류하고 판단 근거 설명',criterionEn:'Classifies at least 5 of 6 mixed statements and explains the test used.'
    },
    "Understanding Author's Purpose":{
      errorKo:'글의 주제와 글쓴이의 목적을 같다고 보거나 특정 문장 하나만 보고 판단했을 수 있습니다.',
      errorEn:'The student may be confusing topic with purpose or deciding from one sentence instead of the whole text.',
      routineKo:'대상 독자-원하는 반응-사용한 글의 특징을 찾아 inform/persuade/entertain/instruct 중 결정합니다.',
      routineEn:'Identify audience, intended response and text features before choosing inform, persuade, entertain or instruct.',
      promptKo:'글쓴이는 독자가 무엇을 알거나 느끼거나 하길 바라는가?',promptEn:'What does the author want the reader to know, feel or do?',
      criterionKo:'서로 다른 장르 4개 중 3개 이상에서 목적과 근거 특징 제시',criterionEn:'Identifies purpose and a supporting feature in at least 3 of 4 genres.'
    },
    'Interpreting Figurative Language':{
      errorKo:'표현을 문자 그대로 해석하거나 분위기와 인물 감정을 함께 읽지 못했을 수 있습니다.',
      errorEn:'The student may be interpreting language literally or missing how imagery supports mood and feeling.',
      routineKo:'문자 뜻-실제 뜻-글에서 만드는 느낌의 세 단계로 바꾸어 말하게 합니다.',
      routineEn:'Paraphrase in three steps: literal image, intended meaning, and the effect on mood or character.',
      promptKo:'글자 그대로가 아니라면 어떤 느낌을 강조하는가?',promptEn:'If it is not literal, which feeling or quality does it emphasise?',
      criterionKo:'비유 표현 4개 중 3개 이상을 자연스러운 말로 바꾸고 효과 설명',criterionEn:'Paraphrases at least 3 of 4 figurative expressions and explains their effect.'
    },
    'Distinguishing Between Real and Make-believe':{
      errorKo:'낯설거나 드문 일을 불가능한 일로 판단했을 수 있습니다.',
      errorEn:'The student may be treating an unfamiliar or unlikely event as impossible.',
      routineKo:'실제 세계의 규칙으로 가능한가를 먼저 판단하고, 이야기 속 증거와 개인 경험을 구분합니다.',
      routineEn:'Test the event against real-world rules first, separating story evidence from personal familiarity.',
      promptKo:'드문 일인가, 현실의 규칙상 불가능한 일인가?',promptEn:'Is it merely unusual, or impossible under real-world rules?',
      criterionKo:'사례 6개 중 5개 이상을 가능·불가능으로 분류하고 이유 설명',criterionEn:'Classifies at least 5 of 6 events as possible or impossible and explains why.'
    },
    'Summarising':{
      errorKo:'예시와 반복 내용을 너무 많이 남기거나 핵심 사건의 인과 관계를 빼뜨렸을 수 있습니다.',
      errorEn:'The student may be retaining examples and repetition while omitting the causal spine of the text.',
      routineKo:'누가/무엇을-가장 중요한 변화-결과만 남긴 뒤 원문의 25% 이하로 줄입니다.',
      routineEn:'Keep who or what, the most important change, and the result; reduce the text to no more than one quarter.',
      promptKo:'이 문장을 빼도 글의 핵심이 유지되는가?',promptEn:'Would the central meaning survive if this sentence were removed?',
      criterionKo:'중심 생각과 핵심 근거를 포함해 3문장 이내로 요약',criterionEn:'Summarises in no more than three sentences with the central idea and key support.'
    }
  },
  books:{
    B:[
      {name:'CARS & STARS Plus Level B',roleKo:'핵심 과정',roleEn:'Core course',fitKo:'진단과 전략별 보충 수업을 같은 체계로 이어 갈 때',fitEn:'Best when assessment and strategy remediation should stay in one system.'},
      {name:'Evan-Moor Daily Reading Comprehension Grade 2',roleKo:'유사 난도 보충',roleEn:'Comparable supplement',fitKo:'짧은 지문을 매일 반복하며 다양한 전략을 섞어 연습할 때',fitEn:'Useful for short daily passages with mixed-strategy practice.'},
      {name:'Spectrum Reading Grade 2',roleKo:'유사 난도 보충',roleEn:'Comparable supplement',fitKo:'주제·세부사항·이야기 구조를 학년 수준으로 넓힐 때',fitEn:'Useful for grade-level work on main idea, details and story structure.'}
    ],
    C:[
      {name:'CARS & STARS Plus Level C',roleKo:'핵심 과정',roleEn:'Core course',fitKo:'전략별 진단-수업-재평가를 한 흐름으로 운영할 때',fitEn:'Best for a single strategy-based assessment, teaching and reassessment cycle.'},
      {name:'Evan-Moor Daily Reading Comprehension Grade 3',roleKo:'유사 난도 보충',roleEn:'Comparable supplement',fitKo:'픽션·논픽션과 시각 조직자를 함께 사용해 전이를 늘릴 때',fitEn:'Useful for transfer across fiction, nonfiction and visual organisers.'},
      {name:'Spectrum Reading Grade 3',roleKo:'유사 난도 보충',roleEn:'Comparable supplement',fitKo:'근거를 쓰는 서술형 응답과 문학 지문 분석을 추가할 때',fitEn:'Useful for adding evidence-based written responses and literature analysis.'}
    ],
    D:[
      {name:'CARS & STARS Plus Level D',roleKo:'핵심 과정',roleEn:'Core course',fitKo:'12개 전략을 긴 지문과 함께 체계적으로 지도할 때',fitEn:'Best for systematic work across twelve strategies with longer texts.'},
      {name:'Evan-Moor Daily Reading Comprehension Grade 4',roleKo:'유사 난도 보충',roleEn:'Comparable supplement',fitKo:'매일 짧은 독해와 서술형 반응으로 독립 적용을 늘릴 때',fitEn:'Useful for daily comprehension and constructed responses.'},
      {name:'Spectrum Reading Grade 4',roleKo:'유사 난도 보충',roleEn:'Comparable supplement',fitKo:'정보글·문학·통합적 사고를 학년 수준에서 확장할 때',fitEn:'Useful for expanding grade-level informational, literary and integrative reading.'}
    ]
  }
};
