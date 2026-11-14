export function clean(value,max=2000){
 return String(value??'').normalize('NFC').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f<>]/g,'')
  .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,'[이메일 제외]')
  .replace(/(?:\+82[ -]?)?0?1[016789][ -]?\d{3,4}[ -]?\d{4}\b/g,'[연락처 제외]').trim().slice(0,max);
}

// Match the names families use to the names in approved materials. Keep a word
// boundary before an alias and allow a Korean particle after it (e.g. 천고는).
const NAMES = [
 ['천개의고원', '천\\s*개의?\\s*고원|천고'],
 ['기파랑', '기파랑(?:문해원)?'],
 ['지니국어', '지니\\s*국어|지니'],
 ['msc', 'msc|엠에스씨'],
 ['상산고', '상산고(?:등학교)?'],
 ['외대부고', '(?:용인)?(?:한국)?외(?:국어)?대(?:학교)?(?:사범대학)?부[속설]고(?:등학교)?|(?:용인)?외대부고'],
 ['민사고', '민족사관고(?:등학교)?|민사고'],
 ['하나고', '하나고(?:등학교)?'],
 ...['서울','경기','대전','대구','광주','한성','세종','경기북','인천'].map(region => [
  region + '과학고', region + '\\s*(?:과학고(?:등학교)?|과고)' + (['서울','경기','대전','대구','광주'].includes(region) ? '|' + region + '\\s*영재고' : '')
 ]),
].map(([name, pattern]) => [name, new RegExp('(?<![가-힣a-z0-9])(?:' + pattern + ')(?=$|[^가-힣a-z0-9]|[은는이가을를와과의에로만도랑]|하고|인데|에서|부터)', 'gi')]);

const STOP = new Set('어떻게 무엇 뭘 우리 아이 아이가 학생 지금 현재 질문 상담 알려주세요 좋을까요 해야 하는 하나요 있나요 있어요 정도 그냥 대해 학습 공부 하는지 어떤 이런 그런 학년 이번 지난주 지난주에 문제 단원 어떻게 무엇부터 무엇을 궁금해요 궁금합니다 해주세요 있어도 되나요 돼요 되요 계속 같이 다음 되나요 이것도 해도 아직 했는데 봤는데 가도 몇개 하나 중인 이제 어떤가요 정말 하려면 있으면 되죠 싶은데 그런데 맞나요'.split(' '));
const PARTICLES = /(에서는|에서|부터|까지|보다|에게|처럼|하고|이랑|이라|으로|들을|들이|에는요|에도|에는|인데|이나|이든|랑|은|는|을|를|와|과|만|도|에)$/u;
const WORD_FORMS = [
 [/숙제|과제(?:량|부담)?/gu, '과제'],
 [/병행|함께|같이/gu, '병행'],
 [/선지|선택지/gu, '선택지'],
 [/문풀|문제\s*풀이/gu, '문제풀이'],
 [/고[12]\s*\d{1,2}월|모평|모의고사|학평|학력평가/gu, '기출'],
 [/기본\s*정석|수학의\s*정석/gu, '정석'],
 [/에이급\s*수학/gu, 'a급수학'],
];
function normal(value) {
 let text = String(value ?? '').normalize('NFKC').toLowerCase();
 for (const [name, pattern] of NAMES) text = text.replace(pattern, name);
 return text;
}
function wording(text) {
 for (const [pattern, word] of WORD_FORMS) text = text.replace(pattern, ' ' + word);
 return text;
}
function terms(text) {
 const words = wording(text).match(/[가-힣a-z0-9]+/gu) || [];
 return [...new Set(words.map(word => {
  if (NAMES.some(([name]) => word === name)) return word;
  const stem = word.replace(PARTICLES, '');
  return stem.length >= 2 || stem === '쎈' ? stem : word;
 }).filter(word => (word.length >= 2 || word === '쎈') && !STOP.has(word) && !/^(?:초|중|고)?\d+(?:월|학년)?$/u.test(word)))];
}
const TEXTBOOKS = ['정석', '쎈'];
const relatedReading = /비문학|선지|선택지/u;
const followUp = /지난\s*(?:번|상담)|이전\s*상담|이어서|재점검|다시\s*(?:점검|확인)/u;
const retestReference = /지난번|지난|상담|이어서|재점검|이번|다시|점검|확인/u;
const scoringMark = /[ox]\s*(?:예요|에요|로|야|인가|입니까|인가요)|동그라미|엑스|채점|표시|o\s*[\/·]\s*x/u;
const notLearned = /미학습|(?:안|못)\s*배[웠운우]|배우(?:지|질)\s*(?:않|못)|배운\s*적[이은]?\s*없|배우기\s*전/u;
const assisted = /힌트|도움|도와|알려\s*(?:줘|주|줬)|같이\s*풀/u;
const excludes = /제외|빼[고야기]|뺍|포함하지|넣지/u;
function scoringRule(q) {
 if (notLearned.test(q) && (scoringMark.test(q) || /고[12]|기출|모평|시험|수행률|맞힌|점수|정답률|빼|제외|틀렸/u.test(q))) return 'unlearned';
 if (scoringMark.test(q) && (assisted.test(q) || /못\s*풀|안\s*풀|풀지\s*못|틀렸|틀린|모르는\s*(?:문제|문항)/u.test(q))) return 'independent';
 return null;
}
function supports(rule, text) {
 if (rule === 'unlearned') return notLearned.test(text) && excludes.test(text);
 if (rule === 'independent') return assisted.test(text) && /(?:\bX\b|x로|엑스|오답)/iu.test(text) && /혼자|독립|스스로/u.test(text);
 return false;
}

function definesIndependent(text) {
 return /도움 없이|도움 받지 않고|도움받지 않고/u.test(text) && /혼자 풀|독립 해결|스스로/u.test(text);
}

// The same word 기출 refers to different exams. Identify the requested exam
// before ranking so an unrelated practice paper cannot stand in for it.
function examDomain(q) {
 if (!/기출|면접|실제.{0,10}문[제항]/u.test(q)) return '';
 if (/영재(?:학교|고)|과학고|과고|자사고|면접|상산고|외대부고|민사고|하나고|외고|국제고/u.test(q)) return 'school';
 if (/k[j]?mo|경시|올림피아드/u.test(q)) return 'contest';
 if (/학평|모평|학력평가|모의고사|고[12]/u.test(q)) return 'mock';
 return '';
}
function matchesExam(domain, row) {
 const text = normal(row.title + ' ' + row.body);
 if (domain === 'school') return /면접|입학시험|입학전형|선발평가|입시/u.test(text) && /기출|문항|면접/u.test(text);
 if (domain === 'contest') return /k[j]?mo|경시|올림피아드/u.test(text) && /기출|출제 문항/u.test(text);
 if (domain === 'mock') return /학평|모평|학력평가|모의고사|고[12].{0,10}기출|다른 (?:연도|회차)의? 기출/u.test(text);
 return true;
}
function passages(body) {
 return String(body || '').split(/\n\s*\n/u).flatMap(block => {
  const lines = block.trim().split(/\n/u);
  // Imported notes have a short section label on its own line.
  if (lines.length > 1 && lines[0].length <= 28 && !/[.!?。！？]/u.test(lines[0])) lines.shift();
  return lines.flatMap(line => line.trim().split(/(?<=[.!?。！？])\s+/u));
 }).map(line => line.replace(/^(?:학부모님들의 의견으로는|제공된 (?:정리 자료|대화)에는)\s*/u, '').trim()).filter(Boolean);
}
function namedIn(text) {
 return NAMES.filter(([, pattern]) => text.search(pattern) >= 0)
  .map(([name]) => name).sort((a,b) => text.indexOf(a) - text.indexOf(b));
}
function schoolInterviewSources(ranked, names, q) {
 const requestedYear = q.match(/(20\d{2})\s*(?:학년도|년)/u)?.[1];
 const eligible = ranked.filter(({row}) => {
  if (!requestedYear) return true;
  // A report's admission year may precede its publication date.
  const years = [...(row.title + ' ' + row.body).matchAll(/(20\d{2})\s*학년도/gu)].map(match => match[1]);
  return !years.length || years.includes(requestedYear);
 });
 const specific = [], remaining = [];
 for (const name of names) {
  const match = eligible.find(item => item.title.includes(name) && namedIn(item.title).length === 1 &&
   /면접|기출|문항|영향평가|응시.{0,3}사례/u.test(item.title));
  if (match) specific.push(match);
  else remaining.push(name);
 }
 const selected = new Set(specific);
 for (const name of remaining) {
  const fallback = eligible.find(item => item.title.includes(name) || item.body.includes(name));
  if (fallback) selected.add(fallback);
 }
 return [...selected].slice(0, 3).map(item => item.row);
}
function countMentions(text, words) {
 return words.filter(word => text.includes(word)).length;
}
function compare(a, b) {
 return b.score - a.score || String(b.row.updated_at || '').localeCompare(String(a.row.updated_at || '')) ||
  String(a.row.id || '').localeCompare(String(b.row.id || ''));
}
export function selectKnowledge(rows, {question, progress = '', stage = 'all', previous = ''}) {
 const q = normal(clean(question)), names = namedIn(q), keywords = terms(q);
 const recall = previous && followUp.test(q) && !names.length ? normal(clean(previous, 600)) : '';
 const context = terms(normal(clean(progress)));
 const books = TEXTBOOKS.filter(word => q.includes(word));
 const recallWords = terms(recall);
 const isRecallOnly = recall && keywords.every(word => retestReference.test(word) || /볼까요|주세요|한번|어디/u.test(word));
 const rule = scoringRule(q), domain = examDomain(q);
 const documents = rows.filter(row => row.status === 'approved' && (row.stage === 'all' || stage === 'all' || row.stage === stage))
  .filter(row => !domain || matchesExam(domain, row))
  .map(row => ({row, title: wording(normal(row.title)), body: wording(normal(row.body))}));
 const weighted = keywords.map(word => {
  const count = documents.filter(doc => doc.title.includes(word) || doc.body.includes(word)).length;
  return [word, 1 + Math.log((documents.length + 1) / (count + 1))];
 });
 // An exact title wins within the approved age group. Duplicate versions
 // use the same latest-update order as all other results.
 const candidates = documents.map(({row, title, body}) => {
  const nameCount = names.filter(name => title.includes(name) || body.includes(name)).length;
  const matches = weighted.reduce((sum, [word, weight]) => sum + weight * (title.includes(word) ? 4 : body.includes(word) ? 1 : 0), 0);
  const priorMatches = recallWords.filter(word => title.includes(word)).length;
  const lexical = matches + (isRecallOnly ? 4 * priorMatches : 0);
  const coverage = countMentions(title + ' ' + body, books);
  const evidence = row.body && rule && passages(row.body).some(line => supports(rule, line));
  const exact = normal(row.title).trim() === q.trim();
  const score = lexical + Math.min(priorMatches, 4) + coverage * 8 + nameCount * 25 +
   Math.min(3, countMentions(title + ' ' + body, context));
  return {row, score, evidence, exact, nameCount, lexical, title, body, coverage};
 });
 const exact = candidates.filter(item => item.exact).sort(compare);
 if (exact.length) return [exact[0].row];
 // A scoring decision needs a source that actually states the rule. Sharing
 // the word '문항' is insufficient evidence for marking an answer wrong.
 if (rule) {
  const examQuestion = rule === 'unlearned' && /고[12]|기출|학평|모평|모의고사/u.test(q);
  const isExamSource = item => /고[12]|기출|학평|모평|모의고사/u.test(item.title);
  const gradeSpecificExam = item => /고[12]/u.test(item.title);
  const relevant = candidates.filter(item => item.evidence).sort(compare);
  const best = examQuestion
   ? relevant.find(gradeSpecificExam) || relevant.find(isExamSource) || relevant[0]
   : relevant[0];
  if (best) return [best.row];
  const definition = rule === 'independent' && candidates.filter(item => passages(item.row.body).some(definesIndependent)).sort(compare)[0];
  return definition ? [definition.row] : [];
 }
 if (names.length) {
  const named = candidates.filter(item => item.nameCount > 0).sort(compare);
  if (!named.length) return [];
  if (domain === 'school') return schoolInterviewSources(named, names, q);
  const picked = [];
  for (const name of names) {
   const match = named.find(item => item.title.includes(name) || item.body.includes(name));
   if (match && !picked.includes(match)) picked.push(match);
  }
  if (picked.length === 1 && names.length === 1 && relatedReading.test(q) && /글쓰기|옮|계속|바꿀|비교/u.test(q)) {
   const alternative = candidates.filter(item => !item.nameCount && relatedReading.test(item.body) && /국어|문풀|글쓰기/u.test(item.title) && item.lexical > 0).sort(compare)[0];
   if (alternative) picked.push(alternative);
  }
  return picked.slice(0, 3).map(item => item.row);
 }
 let ranked = candidates.filter(item => item.lexical > 0).sort(compare);
 if (books.length > 1 && ranked.some(item => item.coverage === books.length)) {
  ranked = ranked.filter(item => item.coverage === books.length);
 }
 if (books.length && /복습|힌트|보완|오답|다시\s*풀/u.test(q) && !domain) {
  ranked = ranked.filter(item => !/교육과정표|고교 선택|학교 선택|학교의 실제 수업|학교·선택과목/u.test(item.title));
 }
 if (!ranked.length) return [];
 return ranked.filter(item => item.score >= ranked[0].score * 0.65).slice(0, 3).map(item => item.row);
}

export function answerFromSources(rows, {question = ''} = {}) {
 if (!rows.length) return {summary:'이 질문에 답할 수 있는 승인 자료를 아직 찾지 못했어요.', explanation:'현재 교재와 단원, 가장 궁금한 점을 적어 주세요.', next:'독쌤에게 직접 물어보실 수도 있어요.'};
 const q = normal(question), rule = scoringRule(q), keywords = terms(q);
 const lines = passages(rows[0].body);
 const names = namedIn(q);
 const wantsWorkload = /숙제|과제|병행|같이/u.test(q);
 const wantsReview = /복습|보완|힌트|막혀|어려워/u.test(q);
 const books = TEXTBOOKS.filter(book => q.includes(book));
 function relevance(line) {
  const text = wording(normal(line));
  const wordCount = countMentions(text, keywords);
  const workload = wantsWorkload && /과제|숙제/u.test(text) && /병행|부담|많|적/u.test(text);
  const reviewAdvice = wantsReview && /복습|보완|오답|적용이 어려운|반복해서 막히는/u.test(text);
  return wordCount + (reviewAdvice ? 3 : 0) + (rule === 'independent' && definesIndependent(line) ? 50 : 0) + (workload ? 5 : 0) + countMentions(text, books) * 4 + (supports(rule, line) ? 100 : 0);
 }
 // On a specific question, lead with the sentence in the approved notes that
 // answers it. Keep tied sentences in the author's order.
 const sorted = lines.map((line, i) => ({line, i, score: relevance(line)})).sort((a,b) => b.score - a.score || a.i - b.i);
 const summary = sorted[0]?.line || rows[0].title;
 const followup = lines.find(line => line !== summary && /확인해 주세요|알려주세요|살펴보세요|준비해 주세요|남겨 주세요|직접 확인/u.test(line)) || '';
 let explanation = sorted.find(item => item.line !== summary && item.line !== followup && item.score > 0)?.line || '';
 if (rows.length > 1 && names.length === 1 && relatedReading.test(q)) {
  const readingAdvice = passages(rows[1].body).find(line => relatedReading.test(line));
  if (readingAdvice) explanation = readingAdvice;
 }
 return {summary, explanation, next: followup};
}
