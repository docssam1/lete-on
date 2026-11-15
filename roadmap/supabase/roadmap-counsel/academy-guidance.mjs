// Routing contains no branch/course catalogue. The displayed facts always come
// from the approved notes selected for this request, including after revisions.
const tidy = value => String(value || '').normalize('NFKC').toLowerCase();
const REGIONS = [
 ['부산', /부산|센텀|사직/u], ['창원', /창원|반송|중동/u], ['대구', /대구|수성/u],
 ['대치', /대치|강남/u], ['목동', /목동|양천/u], ['평촌', /평촌|안양/u],
 ['서울', /서울/u], ['경기', /경기(?:도|권|지역|\s|$)/u],
 ['기타', /인천|대전|광주|울산|세종|수원|용인|분당|성남|일산|고양|김해|양산|제주|천안|청주|전주|강릉|춘천|전남|전북|충남|충북|경남|경북|강원/u]
];
function regionsIn(value) {
 const text = tidy(value);
 const matches = REGIONS.filter(([,pattern]) => pattern.test(text)).map(([name]) => name);
 return matches.filter(name => name !== '서울' || !matches.some(n => ['대치','목동'].includes(n)));
}
function providerKind(row) {
 const title = row.title || '';
 if (/MK아카데미/u.test(title)) return 'mk';
 if (/EMS.*CMS|CMS.*경시관/u.test(title)) return 'cms';
 if (/KMO 대비는 어디/u.test(title)) return 'providers';
 if (/경시 준비는 어느 단계/u.test(title)) return 'stages';
 return '';
}
export function academyContext({question = '', progress = '', region = '', completedBooks = '', soloRange = ''} = {}) {
 const q = tidy(question), p = tidy(progress);
 const brand = /\bmk\b|엠케이/u.test(q) ? 'mk' : /\b(?:cms|ems)\b|씨엠에스/u.test(q) ? 'cms' : '';
 const contest = /k[j]?mo|경시|올림피아드/u.test(q + ' ' + p);
 if (brand === 'cms' && !contest && !/\bems\b/u.test(q)) return null;
 const where = /학원|수업|과정|어디|어느\s*(?:곳|지점|반)|지점|입반|다닐|추천|대비.*할|온라인|대면/u.test(q);
 if (!brand && !(contest && where)) return null;
 if (/기출|정답|문항/u.test(q) && !/학원|수업|입반|지점/u.test(q)) return null;
 const noOnline = /온라인\s*(?:말고|제외|빼고|불가|안|싫|하지\s*않|어려)/u.test(q);
 const online = !noOnline && (/온라인/u.test(q) || (!/대면|오프라인/u.test(q) && /온라인만|온라인\s*희망/u.test(tidy(region))));
 const places = regionsIn(q).length ? regionsIn(q) : regionsIn(region).length ? regionsIn(region) : regionsIn(p);
 const locality = tidy(region) || q;
 const branches = ['센텀','사직','중동','반송','수성'].filter(name => locality.includes(name));
 return {brand, online, places, branches, q, progress: p, completedBooks, soloRange};
}
export function academySources(rows, context) {
 const route = academyContext(context);
 if (!route) return null;
 let kinds;
 if (route.brand) kinds = [route.brand];
 else if (route.online) kinds = ['providers'];
 else if (route.places.length) {
  kinds = [];
  if (route.places.some(p => ['부산','창원','대구'].includes(p))) kinds.push('mk');
  if (route.places.some(p => ['대치','목동','평촌','서울','경기'].includes(p))) kinds.push('cms');
  if (route.places.some(p => ['대치','서울'].includes(p))) kinds.unshift('providers');
 } else kinds = ['providers'];
 const selected = kinds.map(kind => rows.find(row => providerKind(row) === kind)).filter(Boolean);
 // Keep an approved general note as evidence for asking about travel options
 // when there is no verified local branch; never invent a regional branch.
 if (!selected.length) {
  const general = rows.find(row => providerKind(row) === 'providers');
  if (general) selected.push(general);
 }
 if ([context.progress,context.completedBooks,context.soloRange].some(value => value?.trim())) {
  const stages = rows.find(row => providerKind(row) === 'stages');
  if (stages) selected.push(stages);
 }
 return selected.slice(0, 3);
}
function blocks(row) { return String(row?.body || '').split(/\n\s*\n/u).map(s => s.trim()).filter(Boolean); }
function needsSupport(value) {
 const text = String(value || '').replace(/(?:힌트|도움)[이가을은는]?\s*(?:없이|받지\s*않고|안\s*받고|필요\s*없[어는]?)/gu,'').replace(/어렵지\s*않|어려움[이은]?\s*없|막히지\s*않/gu,'');
 return /힌트|도움|막[혀히]|어려(?:워|움)|못\s*풀/u.test(text);
}
function courseGuidance(rows, progress, soloRange = '', completedBooks = '') {
 if (!progress && !soloRange && !completedBooks) return '현재 교재·단원과 혼자 풀 수 있는 범위, 경시 경험을 알려주시면 시작할 과정을 함께 좁혀볼게요.';
 const stage = rows.find(row => providerKind(row) === 'stages');
 if (!stage) return '';
 // Explicitly reported contest-course completion is evidence. A book title or
 // its advertised difficulty alone cannot establish independent mastery.
 const bookProgress = /kmo|경시/iu.test(completedBooks) && /완료|마침|마쳤|끝냈|끝남|통과|(?<!불)합격|입상|금상|은상|동상/u.test(completedBooks) ? completedBooks : '';
 const p = tidy(progress + ' ' + bookProgress);
 const first = /처음|경시.{0,6}(?:없|안\s*해|안\s*했)|입문\s*전/u.test(p);
 const unfinished = /(?:중[123]|중등).{0,20}(?:미완|배우는\s*중|진행\s*중|아직|안\s*끝)|(?:기초|개념).{0,10}(?:약|막|어려)/u.test(p);
 const second = /1차.{0,8}(?:(?<!불)합격|통과(?!\s*(?:못|안|실패))|입상|금상|은상|동상)|2차.{0,8}(?:준비|대비|목표)/u.test(p);
 const basic = /(?:입문|경시\s*기초).{0,8}(?:완료|마침|끝냈|끝남)|1차.{0,8}(?:준비|대비|목표)/u.test(p);
 const labels = unfinished ? ['기초'] : first ? ['입문'] : second ? ['심화','2차 대비'] : basic ? ['기본'] : [];
 const lines = String(stage.body || '').split('\n').map(s => s.trim());
 const content = labels.map(label => lines.find(line => line.startsWith(label + ':'))).filter(Boolean);
 const guidance = content.length
  ? '지금 적어주신 진도에서는 ' + content.join(' ') + ' 이 내용을 혼자 해결하는지 먼저 점검하고, 해당 지점의 입반 기준과 비교해 보세요.'
  : '현재 교재에서 혼자 풀 수 있는 범위와 정수·기하·대수·조합의 학습 경험을 확인해 진입 단계를 정해요. 교재 진도만으로 입반 수준을 확정하지 않아요.';
 const needsHelp = needsSupport(soloRange);
 const foundation = lines.find(line => line.startsWith('기초:'));
 return guidance + (needsHelp && foundation ? ' 알려주신 풀이 범위에서 도움이 필요한 단원은 ' + foundation + ' 이 부분을 보완하면서 입문 수업에서 다룰 내용과 연결해 볼게요.' : '');
}
function followup(context) {
 const fields = [];
 if (!context.completedBooks?.trim()) fields.push({key:'completedBooks',label:'어떤 교재를 어디까지 마쳤나요?',placeholder:'예: 쎈 중3-2까지. 기본 유형은 마쳤고 심화는 일부 남았어요.'});
 if (!context.soloRange?.trim()) fields.push({key:'soloRange',label:'도움 없이 혼자 풀 수 있는 범위는 어디까지인가요?',placeholder:'예: 식·함수는 혼자 풀지만, 기하 증명은 힌트가 필요해요.'});
 return fields.length ? {message:'아이에게 맞는 시작 과정을 조금 더 좁혀볼까요? 교재를 마친 범위와 혼자 해결하는 범위를 함께 살펴볼게요.',fields} : null;
}
function friendlyGuidance(explanation, soloRange) {
 const stages = [...explanation.matchAll(/(기초|입문|기본|심화|2차 대비):\s*([^.]+)\./gu)];
 if (!stages.length) return explanation;
 const lines = stages.map(([,label,content]) => label + ' 단계의 핵심은 ‘' + content + '’입니다.');
 return lines.join(' ') + (needsSupport(soloRange)
  ? ' 알려주신 풀이 범위에서 도움이 필요한 단원은 기초를 보완하면서 수업과 연결해 볼게요.'
  : ' 이 내용을 혼자 해결하고 풀이 이유를 설명하는지 살펴본 뒤, 해당 지점의 입반 기준과 비교해 보겠습니다.');
}
export function academyAnswer(rows, context) {
 const route = academyContext(context);
 if (!route || !rows.some(row => ['mk','cms','providers'].includes(providerKind(row)))) return null;
 if (route.online && route.brand) return {
  summary: '해당 학원의 온라인 과정 개설 여부는 현재 승인 자료에서 확인되지 않아요. 원하는 지점에 온라인 수업 가능 여부와 현재 모집 과정을 확인해 주세요.',
  explanation: courseGuidance(rows, route.progress, route.soloRange, route.completedBooks),
  next: '온라인 수업이 꼭 필요하다면 가능한 수업 방식과 현재 교재·진도를 함께 알려주세요.',
  followup: followup(context)
 };
 const places = route.places, summary = [], paragraphs = [];
 const append = (text,row,kind='evidence') => paragraphs.push({text,sourceIds:[row.id],kind});
 for (const row of rows) {
  const kind = providerKind(row), parts = blocks(row);
  if (kind === 'stages') continue;
  if (route.brand && kind !== route.brand) continue;
  if (kind === 'mk') {
   const regional = parts.filter(part => /^(?:부산|창원|대구)/u.test(part));
   const local = places.length ? regional.filter(part => places.some(place => part.startsWith(place))) : regional;
   const chosen = route.branches.length ? local.filter(part => route.branches.some(branch => part.includes(branch))) : local;
   const beginner = /처음|미완|경시.{0,6}없|입문\s*전/u.test(route.progress);
   const shown = chosen.map(part => beginner ? part.split(/(?<=[.!?])\s+/u).filter(line => !/HMK|고등\s*KMO/u.test(line)).join(' ') : part).filter(Boolean);
   if (shown.length) {
    summary.push('MK아카데미의 과정 안내를 보면, ' + shown.join('\n\n'));
    const introductory = /처음|입문\s*전|경시.{0,6}없/u.test(route.progress) && shown.some(text => /입문/u.test(text));
    const locations = [...new Set(shown.map(text => text.match(/^(?:부산 센텀|부산 사직|창원 중동·반송|대구 수성)/u)?.[0]).filter(Boolean))];
    append((locations.length ? locations.join('·') + '의 ' : '') + 'MK아카데미에서 안내한 ' + (introductory ? '경시 입문 과정부터' : '아래 과정들을') + ' 비교해 보시면 좋겠습니다. 마친 교재와 혼자 해결하는 범위를 살펴 아이에게 맞는 시작점을 정해볼게요.',row,'summary');
    shown.forEach(text => append(text,row));
   }
  } else if (kind === 'cms') {
   const matching = places.filter(p => ['대치','목동','평촌'].includes(p) && String(row.body).includes(p));
   // A named academy in an unsupported city is not evidence of a local branch.
   if (places.length && !matching.length && !places.some(p => ['서울','경기'].includes(p))) continue;
   const definition = parts.find(part => /EMS.*경시입문/u.test(part));
   if (matching.length) {
    const text = matching.join('·') + '에서는 CMS 경시관을 확인해 보세요. ' + (definition?.split(/(?<=[.!?])\s+/u)[0] || '');
    summary.push(text); append(text,row);
   } else { const branch = parts.find(part => /공식 지점/u.test(part)); if (branch) { summary.push(branch); append(branch,row); } }
  } else if (kind === 'providers') {
   const sentences = parts.flatMap(part => part.split(/(?<=[.!?])\s+/u));
   let selected = [];
   if (route.online) selected = sentences.filter(line => /^온라인 후보/u.test(line));
   else if (places.some(p => ['대치','서울'].includes(p))) selected = sentences.filter(line => /^대치 대면 후보/u.test(line));
   else if (!places.length) selected = sentences.filter(line => /^(?:KMO 대비|온라인 후보|대치 대면 후보)/u.test(line));
   summary.push(...selected); selected.forEach(text => append(text,row));
  }
 }
 const regional = summary.length ? summary.join('\n\n') : '요청하신 지역에서 해당 학원·과정의 개설을 확인할 수 있는 승인 자료가 아직 충분하지 않아요. 통학 가능한 인근 지역이나 온라인 수업 가능 여부를 알려주세요.';
 const explanation = courseGuidance(rows, route.progress, route.soloRange, route.completedBooks);
 const stage = rows.find(row => providerKind(row) === 'stages');
 if (paragraphs.length && explanation) paragraphs.push({text:friendlyGuidance(explanation,route.soloRange),sourceIds:stage?[stage.id]:[],kind:'guidance'});
 return {
  summary: regional,
  explanation,
  paragraphs,
  followup: followup(context),
  next: '공고에서 안내한 과정과 현재 모집 중인 반은 다를 수 있어요. 원하는 지점에 시간표·입반 조건을 확인하고, 통학 뒤에도 복습할 시간을 남길 수 있는지 함께 살펴보세요.'
 };
}
