// Step 1–2 contract: source labels and academy choices do not rewrite old records.
// Design first; run only after the pre-change 22-case snapshot and product-ready notice.
// Evidence: GFIELD_TEST_OUTPUT_DIR=/absolute/.../storage-fixtures node --test this-file
// These are pure module / generated-HTML checks, not browser persistence checks.
import test, {after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

const product = fileURLToPath(new URL('../../roadmap/v31/', import.meta.url));
const networkAttempts = [];
for (const name of ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource']) {
  globalThis[name] = function () {
    networkAttempts.push(name);
    throw new Error(`Network prohibited in academy selection regression: ${name}`);
  };
}
const audit = new Map();
function auditImports(name) {
  if (audit.has(name)) return;
  const source = fs.readFileSync(path.join(product, name), 'utf8');
  const networkTokens = [...source.matchAll(/fetch\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon/g)].map(match => match[0]);
  audit.set(name, {sha256: createHash('sha256').update(source).digest('hex'), networkTokens});
  assert.deepEqual(networkTokens, [], `Review network side effects before importing ${name}`);
  for (const match of source.matchAll(/from ['"]\.\/([^'"]+)['"]/g)) auditImports(match[1]);
}
for (const name of ['compact-intake.mjs', 'engine.mjs', 'flow.mjs', 'quick-flow.mjs', 'paths-v10.mjs', 'workspace-engine.mjs', 'review-validation.mjs', 'source-review.mjs']) auditImports(name);
const load = name => import(pathToFileURL(path.join(product, name)));
const {createState, acceptPlan} = await load('engine.mjs');
const {ensureWizard, addBook, saveBookDetails} = await load('flow.mjs');
const {ensureQuick} = await load('quick-flow.mjs');
const {ensureV10, saveRelation} = await load('paths-v10.mjs');
const {ensureWorkspace, validateWorkspaceState} = await load('workspace-engine.mjs');
const {validateReviewState} = await load('review-validation.mjs');
const {startCompact, ensureCompact, collectCompact, commitCompact, compactScreen} = await load('compact-intake.mjs');
const {bookScopeOptions} = await load('book-scope-options.mjs');
const {startScene, chooseScene, collectScene, sceneScreen} = await load('scene-intake.mjs');
const {screen: legacyScreen} = await load('intake.mjs');
const {SOURCE_REVIEW, sourceReviewMarkup, sourcePendingMarkup} = await load('source-review.mjs');
const clone = value => structuredClone(value);
const roundtrip = value => JSON.parse(JSON.stringify(value));
const form = values => new Map(Object.entries(values));
const outcomes = [], fixtures = [];
let assertions = 0;
const check = new Proxy(assert, {get(target, key) {
  const method = target[key];
  return typeof method === 'function' ? (...args) => { assertions++; return method(...args); } : method;
}});

function scenario(id, contract, body) {
  test(id, {concurrency: false}, () => {
    const entry = {id, contract, status: 'running'}, before = assertions;
    outcomes.push(entry);
    try { body(entry); entry.status = 'pass'; }
    catch (error) { entry.status = 'fail'; entry.error = {message: error.message, actual: error.actual, expected: error.expected, stack: error.stack}; throw error; }
    finally { entry.assertions = assertions - before; }
  });
}
function fresh() {
  const state = ensureWorkspace(ensureQuick(ensureV10(ensureWizard(createState('2026-10-18T00:00:00.000Z')))));
  state.wizard.quick.stage = 'p5';
  state.profile.reportedAge = 5;
  state.profile.reportedBirthMonth = 2;
  state.wizard.step = 'learning';
  startCompact(state);
  return state;
}
function reopen(state) { state.wizard.step = 'learning'; startCompact(state, {reset: true}); return state; }
function assertValid(state) {
  for (const result of [validateReviewState(state), validateWorkspaceState(state)]) check.equal(result.valid, true, result.errors.join('\n'));
}
function submit(state) { commitCompact(state); assertValid(state); return state; }
function chooseAcademy(state, choice, previousForm = {}) {
  return collectCompact(state, form({...previousForm, 'compact:academy:choice': choice}), 'compact:academy:choice').academy;
}
function chooseLevel(state, level) {
  return collectCompact(state, form({'compact:academy:level': level}), 'compact:academy:level').academy;
}
function academy(state) { return ensureCompact(state).academy; }
function record(state, institution, level, suffix = '') {
  const value = {id: `synthetic-${institution}-${suffix || 'old'}`, institution, level, status: 'past', note: '원래 합성 학원 기록', sourceRole: 'legacy_parent_report', evidenceDate: '2025-07-15', sourceLocator: 'old-form/free-label'};
  state.wizard.academies.push(value);
  state.wizard.quick.academyId = value.id;
  return value;
}
function savedBook(state, track, name, volume) {
  const value = addBook(state, track, name);
  saveBookDetails(state, {volume, range: '원래 작성한 범위', completion: 'in_progress', completionInput: 'reported', level: track === 'application' ? 'middle' : 'unknown'});
  Object.assign(value, {edition: '이전 판본', isbn: '9780000000123', sourceRole: 'legacy_parent_report', evidenceDate: '2025-07-15', note: '원래 합성 교재 기록'});
  state.wizard.quick.courseIds[track] = value.id;
  return value;
}
function protectedData(state) {
  return clone({courses: state.courses, goals: state.goals, plans: state.plans, activePlanId: state.activePlanId, records: state.records, events: state.events, v10: state.wizard.v10, workspace: state.workspace});
}
function fixture(id, state, description) { fixtures.push({id, description, state: clone(state)}); }
const levelField = /<(?:input|select|textarea)\b[^>]*\bname="compact:academy:(?:level|customLevel)"[^>]*>/g;
const customLevelField = /<(?:input|textarea)\b[^>]*\bname="compact:academy:customLevel"/;
function levelOptions(html) {
  const select = html.match(/<select\b[^>]*\bname="compact:academy:level"[^>]*>([\s\S]*?)<\/select>/)?.[1] || '';
  return [...select.matchAll(/<option\b[^>]*\bvalue="([^"]*)"[^>]*>([\s\S]*?)<\/option>/g)].map(match => ({value: match[1], label: match[2].replace(/<[^>]*>/g, '')}));
}

scenario('academy-experience-question-institution-then-level', 'The user wording introduces the academy list, followed by the selected institution level; the blank question does not expose a level field.', () => {
  const state = fresh(), question = '사고력 학원에 다닌 경험이 있나요?';
  const blankHtml = compactScreen(state).html;
  check.match(blankHtml, new RegExp(question.replace('?', '\\?')));
  check.deepEqual([...blankHtml.matchAll(levelField)], []);
  for (const institution of ['필즈', '소마', 'CMS']) {
    chooseAcademy(state, institution);
    const html = compactScreen(state).html;
    const questionAt = html.indexOf(question), institutionAt = html.indexOf('name="compact:academy:choice"'), levelAt = html.indexOf('name="compact:academy:level"');
    check.ok(questionAt >= 0 && questionAt < institutionAt && institutionAt < levelAt, `${institution}: question, academy list, level order`);
    check.doesNotMatch(html, /<input\b[^>]*name="compact:academy:(?:level|customLevel)"/);
  }
});

for (const [institution, level] of [['CMS', '기존 CMS 자유 레벨'], ['시매쓰', '기존 시매쓰 자유 반'], ['필즈', '예전 자유반 <보존>'], ['소마', '옛 소마 자유반']]) {
  scenario(`legacy-${institution}-read-submit-roundtrip`, 'Reading, submitting without a level edit and JSON return preserve the exact saved academy record and unrelated learning data.', entry => {
    let state = fresh();
    record(state, institution, level);
    savedBook(state, 'arithmetic', '소마셈', 'K');
    savedBook(state, 'arithmetic', '소마셈', 'P');
    savedBook(state, 'thinking', '기존 자유 교재', '3권 중 2권째');
    reopen(state);
    fixture(`legacy-${institution}-before`, state, '무변경 표시·제출·JSON 가져오기 검수용 합성 상태');
    const original = clone(state.wizard.academies), protectedBefore = protectedData(state);
    const html = compactScreen(state).html;
    check.deepEqual(state.wizard.academies, original, 'Rendering must not rename/delete old levels');
    check.equal(academy(state).level, level);
    check.doesNotMatch(html, customLevelField);
    submit(state);
    check.deepEqual(state.wizard.academies, original);
    check.deepEqual(protectedData(state), protectedBefore);
    state = roundtrip(state);
    reopen(state);
    compactScreen(state);
    submit(state);
    check.deepEqual(state.wizard.academies, original);
    check.deepEqual(protectedData(state), protectedBefore);
    fixture(`legacy-${institution}-after`, state, '같은 ID·자유반·교재 K/P·권 표기 보존 결과');
    entry.evidence = {institution, level, academyIds: original.map(item => item.id)};
  });
}

scenario('legacy-book-name-and-volume-whitespace-exact-preservation', 'An unchanged imported course retains its exact original name, scope whitespace, provenance and extra metadata; new-input trimming does not rewrite the saved record.', () => {
  let state = fresh();
  record(state, '필즈', '  옛 자유 반  ');
  for (const track of ['application', 'depth', 'thinking', 'arithmetic']) {
    const saved = savedBook(state, track, '합성 교재', '  옛 P권  ');
    saved.course = '  합성 교재  ';
    saved.unrecognizedLegacyField = {original: ' 그대로 ', meaning: 'untouched'};
  }
  reopen(state);
  fixture('legacy-whitespace-before', state, '교재 이름·권 값·학원 자유반 앞뒤 공백을 가진 합성 기록');
  const before = protectedData(state), academiesBefore = clone(state.wizard.academies);
  for (let pass = 0; pass < 2; pass++) {
    compactScreen(state);
    submit(state);
    check.deepEqual(protectedData(state), before);
    check.deepEqual(state.wizard.academies, academiesBefore);
    state = roundtrip(state); reopen(state);
  }
});

scenario('fields-fixed-levels-and-no-free-level-textbox', 'Fields has the agreed S/E/G/H choices and unknown; the new screen does not offer arbitrary level entry.', () => {
  const state = fresh(); chooseAcademy(state, '필즈');
  const html = compactScreen(state).html, options = levelOptions(html);
  for (const value of ['S1', 'S2', 'S3', 'E1', 'E2', 'G', 'H']) check.ok(options.some(item => item.value === value || item.label === value || item.label.startsWith(`${value} `)), `Missing Fields ${value}`);
  for (const value of ['G', 'H']) check.ok(options.some(item => item.label.startsWith(value) && /주\s*1회/.test(item.label)), `${value} needs weekly frequency label`);
  check.ok(options.some(item => /모름|모르/.test(item.label)));
  check.ok(!options.some(item => item.value === '__custom__'));
  check.doesNotMatch(html, customLevelField);
});

scenario('soma-director-corrected-fixed-levels', 'The latest direct instruction supplies the five Soma levels; new inputs use those raw labels and do not claim that confirmation is pending.', () => {
  const state = fresh(); chooseAcademy(state, '소마');
  const html = compactScreen(state).html, options = levelOptions(html);
  check.deepEqual(options.map(item => item.value), ['', '프리미어1', '프리미어2', '챌린지', 'A1', 'A2', '모름']);
  check.ok(!options.some(item => /기획안|확인 대기|확인대기/.test(item.label)));
  check.doesNotMatch(html, /data-academy-confirmation="pending"/);
  check.ok(!options.some(item => item.value === '__custom__'));
  check.doesNotMatch(html, customLevelField);
});

scenario('cms-why-numbered-levels-with-no-free-level-textbox', 'CMS exposes the officially verified WHY 1–15 sequence and unknown, with no arbitrary level input or pending-confirmation claim.', () => {
  const state = fresh(); chooseAcademy(state, 'CMS');
  const html = compactScreen(state).html, options = levelOptions(html);
  check.deepEqual(options.map(item => item.value), ['', ...Array.from({length: 15}, (_, i) => `WHY ${i + 1}`), '모름']);
  check.doesNotMatch(html, /data-academy-confirmation="pending"/);
  check.ok(!options.some(item => item.value === '__custom__'));
  check.doesNotMatch(html, customLevelField);
  check.equal(academy(state).level, '');
});

scenario('new-director-selected-levels-save-their-exact-labels', 'All newly directed Soma choices and CMS boundary/unknown choices can be selected, submitted and reopened without label rewriting.', () => {
  for (const [institution, values] of [['소마', ['프리미어1', '프리미어2', '챌린지', 'A1', 'A2', '모름']], ['CMS', ['WHY 1', 'WHY 15', '모름']]]) {
    for (const value of values) {
      let state = fresh(); chooseAcademy(state, institution); chooseLevel(state, value); submit(state);
      check.equal(state.wizard.academies[0].level, value);
      state = roundtrip(state); reopen(state);
      check.equal(academy(state).level, value);
    }
  }
});

scenario('old-soma-choice-labels-remain-verbatim-after-new-list', 'Previously saved Soma labels remain selectable as existing input and survive institution switching, a no-change submission and JSON; no automatic conversion to the latest list occurs.', () => {
  for (const level of ['프리미어 P2·P3', '프리미어 P1', 'RAY KIDS', 'A반', 'A1반']) {
    let state = fresh(); record(state, '소마', level); reopen(state);
    const before = clone(state.wizard.academies);
    check.ok(levelOptions(compactScreen(state).html).some(option => option.value === level && /기존 입력/.test(option.label)));
    chooseAcademy(state, 'CMS', {'compact:academy:level': level}); chooseLevel(state, 'WHY 1');
    state = roundtrip(state);
    chooseAcademy(state, '소마', {'compact:academy:level': 'WHY 1'});
    check.equal(academy(state).level, level);
    submit(state);
    check.deepEqual(state.wizard.academies, before);
    state = roundtrip(state); reopen(state);
    check.equal(academy(state).level, level);
  }
});

scenario('explicit-cms-why-choice-changes-only-the-selected-level', 'An explicit CMS WHY selection changes its own saved level while preserving its ID, provenance, other academy records and all book values.', () => {
  let state = fresh(); record(state, '필즈', '기존 필즈 자유반');
  const selected = record(state, 'CMS', '예전 CMS 자유 레벨');
  savedBook(state, 'arithmetic', '소마셈', 'P'); reopen(state);
  const original = clone(state.wizard.academies), protectedBefore = protectedData(state);
  chooseLevel(state, 'WHY 15'); submit(state);
  const expected = original.map(item => item.id === selected.id ? {...item, level: 'WHY 15'} : item);
  check.deepEqual(state.wizard.academies, expected);
  check.deepEqual(protectedData(state), protectedBefore);
  state = roundtrip(state); reopen(state); submit(state);
  check.deepEqual(state.wizard.academies, expected);
  check.deepEqual(protectedData(state), protectedBefore);
});

for (const institution of ['시매쓰']) {
  scenario(`${institution}-level-hidden-with-pending-label`, 'An unconfirmed institution has no level field; the screen states that planning/director confirmation is pending.', () => {
    const state = fresh(); chooseAcademy(state, institution);
    const html = compactScreen(state).html;
    check.deepEqual([...html.matchAll(levelField)], []);
    check.match(html, /기획안/);
    check.match(html, /원장.*확인|확인.*대기/);
    check.equal(academy(state).level, '');
  });
}
for (const institution of ['CMS', '시매쓰']) {
  scenario(`${institution}-ignores-invalid-free-level-fields`, 'Submitting stale or injected arbitrary level fields cannot alter an existing saved institution level.', () => {
    const state = fresh(); record(state, institution, '예전 레벨 보존'); reopen(state);
    const original = clone(state.wizard.academies);
    collectCompact(state, form({'compact:academy:level': '__custom__', 'compact:academy:customLevel': '새로 덮어쓰면 안 됨'}), 'compact:academy:customLevel');
    check.equal(academy(state).level, '예전 레벨 보존');
    submit(state);
    check.deepEqual(state.wizard.academies, original);
  });
}

scenario('out-of-scope-name-inputs-remain-available', 'The change removes academy level free entry, not other-academy names or other-book name/range entry.', () => {
  const state = fresh(); chooseAcademy(state, 'other');
  collectCompact(state, form({'compact:thinking:choice': '__custom__'}), 'compact:thinking:choice');
  const html = compactScreen(state).html;
  check.match(html, /<input\b[^>]*name="compact:academy:name"/);
  check.match(html, /<input\b[^>]*name="compact:thinking:name"/);
  check.match(html, /<option\b[^>]*value="__custom__"[^>]*>직접 입력<\/option>/);
});

for (const institution of ['필즈', '소마', 'CMS', '시매쓰']) {
  scenario(`legacy-entry-generated-controls-${institution}`, 'Legacy scene and academy-entry markup use selection-only confirmed fields or preserve hidden old levels; this is generated HTML, not app event coverage.', () => {
    const state = fresh(); record(state, institution, '예전 자유 레벨');
    const before = clone(state.wizard.academies);
    startScene(state, {track: 'thinking'}); chooseScene(state, 'academy');
    const sceneHtml = sceneScreen(state).html;
    check.doesNotMatch(sceneHtml, /<input\b[^>]*name="academy:level"/);
    if (['필즈', '소마', 'CMS'].includes(institution)) check.match(sceneHtml, /<select\b[^>]*name="academy:level"/);
    else check.doesNotMatch(sceneHtml, /<(?:input|select|textarea)\b[^>]*name="academy:level"/);
    state.wizard.step = 'academy';
    state.wizard.academyDraft = {institution, academyLevel: '예전 자유 레벨'};
    const legacyHtml = legacyScreen(state, {branches: []}, {}).html;
    check.doesNotMatch(legacyHtml, /<input\b[^>]*name="academyLevel"/);
    if (['필즈', '소마', 'CMS'].includes(institution)) check.match(legacyHtml, /<select\b[^>]*name="academyLevel"/);
    else check.doesNotMatch(legacyHtml, /<(?:input|select|textarea)\b[^>]*name="academyLevel"/);
    check.deepEqual(state.wizard.academies, before);
  });
}

for (const institution of ['CMS', '시매쓰']) {
  scenario(`legacy-scene-${institution}-rejects-or-ignores-invalid-level-edit`, 'The legacy scene collector may reject or ignore a forged arbitrary field; either path must preserve the old draft and saved level.', entry => {
    const state = fresh(); record(state, institution, '숨긴 기존 값');
    startScene(state, {track: 'thinking'}); chooseScene(state, 'academy');
    const draftBefore = clone(state.wizard.quick.draft), savedBefore = clone(state.wizard.academies);
    try { collectScene(state, form({'academy:institution': institution, 'academy:level': '바꾸면 안 됨'}), 'academy:level'); entry.observedHandling = 'ignored'; }
    catch (error) { entry.observedHandling = 'rejected'; entry.rejectionMessage = error.message; }
    check.equal(state.wizard.quick.draft['academy:level'], '숨긴 기존 값');
    check.equal(state.wizard.academies[0].level, '숨긴 기존 값');
    check.deepEqual(state.wizard.quick.draft, draftBefore);
    check.deepEqual(state.wizard.academies, savedBefore);
  });
}

for (const from of ['필즈', 'CMS']) {
  scenario(`${from}-to-soma-drops-stale-form-level`, 'Changing institution discards the previous institution level still present in the browser change-event form; existing saved records remain unchanged.', () => {
    const state = fresh(); record(state, from, '이전 기관의 자유반'); reopen(state);
    const original = clone(state.wizard.academies);
    chooseAcademy(state, '소마', {'compact:academy:level': '__custom__', 'compact:academy:customLevel': '이전 기관의 자유반'});
    check.ok(['', '모름', '__unknown__'].includes(academy(state).level));
    check.deepEqual(state.wizard.academies, original);
    // A submit collects all still-rendered fields again before saving.
    collectCompact(state, form({'compact:academy:choice': '소마', 'compact:academy:level': '__custom__', 'compact:academy:customLevel': '이전 기관의 자유반'}));
    check.ok(['', '모름', '__unknown__'].includes(academy(state).level));
    submit(state);
    check.deepEqual(state.wizard.academies.find(item => item.id === original[0].id), original[0]);
    check.notEqual(state.wizard.academies.find(item => item.institution === '소마')?.level, '이전 기관의 자유반');
  });
}

scenario('fields-soma-fields-drafts-return-after-json', 'Each institution retains its own temporary selection across switching and JSON serialization without editing saved records before submit.', () => {
  let state = fresh();
  chooseAcademy(state, '필즈'); chooseLevel(state, 'S2');
  chooseAcademy(state, '소마', {'compact:academy:level': 'S2'});
  check.equal(academy(state).level, '');
  chooseLevel(state, '프리미어2');
  fixture('two-institution-drafts', state, '필즈 S2와 소마 프리미어2를 각각 임시 선택한 미제출 합성 상태');
  state = roundtrip(state);
  chooseAcademy(state, '필즈', {'compact:academy:level': '프리미어2'});
  check.equal(academy(state).level, 'S2');
  chooseAcademy(state, '소마', {'compact:academy:level': 'S2'});
  check.equal(academy(state).level, '프리미어2');
  chooseAcademy(state, '필즈', {'compact:academy:level': '프리미어2'});
  check.equal(academy(state).level, 'S2');
  check.deepEqual(state.wizard.academies, []);
  submit(state);
  check.equal(state.wizard.academies.length, 1);
  check.equal(state.wizard.academies[0].institution, '필즈');
  check.equal(state.wizard.academies[0].level, 'S2');
});

scenario('explicit-same-institution-level-change-only', 'A user choosing a new Fields level changes only that record level and leaves all its provenance and unrelated records untouched.', () => {
  let state = fresh();
  record(state, 'CMS', '숨겨도 보존할 CMS 레벨');
  const selected = record(state, '필즈', '자유반 그대로');
  const book = savedBook(state, 'application', '쎈수학', '중등 1-1');
  saveRelation(state, {kind: 'R01', sourceCourseIds: [book.id], targetPlannedCourseIds: [], condition: '합성 관계 보존'});
  state = acceptPlan(state, {routeIds: ['B09'], courseIds: [book.id], title: '학원 변경 보존용 합성 계획', reason: '이미 저장한 계획'}, '2025-07-15T00:00:00.000Z');
  reopen(state);
  const original = clone(state.wizard.academies), protectedBefore = protectedData(state);
  chooseLevel(state, 'S1'); submit(state);
  check.deepEqual(state.wizard.academies, original.map(item => item.id === selected.id ? {...item, level: 'S1'} : item));
  check.deepEqual(protectedData(state), protectedBefore);
});

scenario('switch-to-existing-institution-without-level-edit-preserves-record', 'Selecting an institution without explicitly changing its level must not erase its pre-existing record even if that level is absent from the new list.', () => {
  const state = fresh(); record(state, '필즈', '필즈 옛 자유반'); record(state, 'CMS', 'CMS 옛 레벨'); reopen(state);
  const original = clone(state.wizard.academies);
  chooseAcademy(state, '필즈', {'compact:academy:level': 'CMS 옛 레벨'});
  check.notEqual(academy(state).level, 'CMS 옛 레벨');
  submit(state);
  check.deepEqual(state.wizard.academies, original);
});

for (const [id, institution, level, otherInstitution, otherLevel] of [
  ['fields-e1', '필즈', 'E1', '소마', '프리미어2'],
  ['fields-custom', '필즈', '옛 자유반', '소마', '프리미어2'],
  ['soma-p', '소마', 'P', '필즈', 'S2'],
]) {
  scenario(`legacy-free-level-roundtrip-${id}`, 'An imported old compact custom-level value returns exactly after another institution is selected; no renaming, loss of identity or change to saved records occurs.', entry => {
    let state = fresh();
    const originalAcademy = record(state, institution, level);
    savedBook(state, 'arithmetic', '소마셈', 'K');
    reopen(state);
    // This is a persisted pre-selection-form input, not an attempt to create a
    // new free-text value through the current UI.
    state.wizard.quick.compact.academy.levelChoice = '__custom__';
    delete state.wizard.quick.compact.academyDrafts;
    const savedBefore = clone(state.wizard.academies), protectedBefore = protectedData(state);
    fixture(`free-level-${id}-before`, state, `${institution} ${level}: 예전 자유입력 compact 초안을 JSON으로 불러와 기관 왕복 검수`);
    state = roundtrip(state);
    const initialHtml = compactScreen(state).html;
    check.equal(academy(state).level, level);
    check.equal(academy(state).levelChoice, level);
    check.doesNotMatch(initialHtml, customLevelField);
    check.deepEqual(state.wizard.academies, savedBefore);

    chooseAcademy(state, otherInstitution, {'compact:academy:level': level});
    check.equal(academy(state).choice, otherInstitution);
    check.equal(academy(state).level, '');
    chooseLevel(state, otherLevel);
    check.equal(academy(state).level, otherLevel);
    check.deepEqual(state.wizard.academies, savedBefore);
    state = roundtrip(state); // The institution-specific draft cache is persisted.
    chooseAcademy(state, institution, {'compact:academy:level': otherLevel});
    check.equal(academy(state).choice, institution);
    check.equal(academy(state).level, level);
    check.equal(academy(state).levelChoice, level);
    check.equal(academy(state).id, originalAcademy.id);
    check.deepEqual(state.wizard.academies, savedBefore);
    compactScreen(state);
    submit(state);
    check.deepEqual(state.wizard.academies, savedBefore);
    check.deepEqual(protectedData(state), protectedBefore);
    state = roundtrip(state); reopen(state);
    check.equal(academy(state).level, level);
    check.equal(academy(state).id, originalAcademy.id);
    fixture(`free-level-${id}-after`, state, '기관 왕복 후 무변경 제출·JSON 왕복까지 원래 자유입력 값과 ID 보존');
    entry.evidence = {institution, originalFreeInput: level, intermediateInstitution: otherInstitution, intermediateSelection: otherLevel, restoredRawValue: academy(state).level, preservedAcademyId: originalAcademy.id, initialLevelChoice: '__custom__', jsonRoundtrips: 3};
  });
}

for (const institution of ['필즈', '소마', 'CMS']) {
  scenario(`old-custom-compact-draft-${institution}-restored`, 'An already-persisted custom level in an old compact draft is preserved, although the new screen cannot create another custom level.', () => {
    let state = fresh();
    Object.assign(academy(state), {choice: institution, name: institution, levelChoice: '__custom__', level: '이미 작성한 미제출 자유반', id: '', dirty: true});
    fixture(`old-compact-custom-${institution}`, state, '구 compact 미제출 customLevel 값을 가진 합성 상태');
    state = roundtrip(state);
    const html = compactScreen(state).html;
    check.equal(academy(state).level, '이미 작성한 미제출 자유반');
    check.doesNotMatch(html, customLevelField);
    // No editable custom control remains, so unrelated collection must not clear it.
    collectCompact(state, form({'compact:stage': 'p5'}), 'compact:stage');
    check.equal(academy(state).level, '이미 작성한 미제출 자유반');
    submit(state);
    check.equal(state.wizard.academies[0].level, '이미 작성한 미제출 자유반');
    check.equal(state.wizard.academies[0].institution, institution);
  });
}

for (const choice of ['__unentered__', '__unknown__', '__not_started__']) {
  scenario(`academy-${choice}-preserves-existing-records`, 'An unanswered/unknown/not-attended selection does not delete prior academy records.', () => {
    const state = fresh(); record(state, 'CMS', '기존 값'); reopen(state);
    const original = clone(state.wizard.academies);
    chooseAcademy(state, choice, {'compact:academy:level': '기존 값'}); submit(state);
    check.deepEqual(state.wizard.academies, original);
  });
}

for (const institution of ['필즈', 'CMS', 'other']) {
  scenario(`legacy-pending-book-and-${institution}-academy`, 'An old active learning draft restores unsubmitted book and academy input, including a free legacy level, before the old scene is marked compact.', () => {
    let state = fresh();
    delete state.wizard.quick.compact;
    state.wizard.quick.scene = {active: true, context: 'intake', choices: {thinking: 'both'}, pendingTracks: ['thinking'], academyTouched: true};
    Object.assign(state.wizard.quick.draft, {'learn:thinking:name': '옛 미제출 교재', 'learn:thinking:volume': '2권 중 1권째', 'learn:thinking:range': '4단원', 'learn:thinking:completion': 'in_progress', 'learn:thinking:completionInput': 'reported', 'academy:institution': institution, 'academy:name': institution === 'other' ? '옛 그 외 학원' : institution, 'academy:level': '옛 미제출 자유반'});
    fixture(`old-pending-${institution}`, state, '구 학습 중 입력을 compact로 처음 복구하는 합성 상태');
    state = roundtrip(state); startCompact(state);
    check.equal(ensureCompact(state).rows.thinking.name, '옛 미제출 교재');
    check.equal(ensureCompact(state).rows.thinking.volume, '2권 중 1권째');
    check.equal(academy(state).choice, institution);
    check.equal(academy(state).level, '옛 미제출 자유반');
    compactScreen(state); submit(state);
    check.equal(state.courses.length, 1);
    check.equal(state.courses[0].course, '옛 미제출 교재');
    check.equal(state.courses[0].range, '4단원');
    check.equal(state.courses[0].completion, 'in_progress');
    check.equal(state.courses[0].completionInput, 'reported');
    check.equal(state.wizard.academies.length, 1);
    check.equal(state.wizard.academies[0].institution, institution === 'other' ? '옛 그 외 학원' : institution);
    check.equal(state.wizard.academies[0].level, '옛 미제출 자유반');
  });
}

scenario('step3-book-candidates-not-implemented-by-step12', 'This approval does not add Soma 19 volumes, Soma school arithmetic or Didimdol basic; current book choices and publisher parts remain available.', () => {
  const scope = bookScopeOptions({track: 'arithmetic', bookName: '소마셈'});
  check.deepEqual(scope.options.map(item => item[0]), ['K', 'P']);
  const state = fresh(), html = compactScreen(state).html;
  check.doesNotMatch(html, /<option[^>]*value="(?:소마연산|디딤돌 기본)"/);
  for (const stage of ['입문', '초급', '중급']) check.deepEqual(bookScopeOptions({track: 'thinking', bookName: `1031 ${stage}`}).options.map(item => item[0]), ['A', 'B', 'C', 'D']);
  check.equal(bookScopeOptions({track: 'thinking', bookName: '키즈팩토'}).options.length, 6);
});

scenario('source-review-metadata-is-deeply-immutable', 'Source review metadata is immutable, keeps the separate 2026 cohort and pending source facts, and does not expose personal-plan import.', () => {
  const before = clone(SOURCE_REVIEW);
  const frozen = value => {
    if (!value || typeof value !== 'object') return;
    check.equal(Object.isFrozen(value), true);
    for (const child of Object.values(value)) frozen(child);
  };
  frozen(SOURCE_REVIEW);
  check.throws(() => { SOURCE_REVIEW.cohort.year = 2025; }, TypeError);
  check.throws(() => { SOURCE_REVIEW.pending[0].rowIds.push('synthetic'); }, TypeError);
  check.equal(SOURCE_REVIEW.cohort.year, 2026);
  check.equal(SOURCE_REVIEW.cohort.personalPlanImport, false);
  check.equal(SOURCE_REVIEW.cohort.calendarMapping, 'not_transcribed');
  check.equal(SOURCE_REVIEW.pending.length, 3);
  check.ok(SOURCE_REVIEW.pending.every(item => item.status === 'pending'));
  const html = sourceReviewMarkup();
  check.match(html, /원자료별 확인 상태/);
  check.equal(sourcePendingMarkup('not-a-source-block'), '');
  check.deepEqual(SOURCE_REVIEW, before);
});

scenario('original-monthly-and-workspace-source-json-unchanged', 'Source review annotations remain separate: original monthly/reference JSON bytes are not edited by step 1–2.', () => {
  for (const [file, expected] of [
    ['data/source-monthly.json', 'c7c12140d229f77c4d84e32b1d7693129aea5aa0cfc2d2019685a08919ba2df4'],
    ['data/workspace-source-register.json', '1b56fa613402fbc6fc351319a1d642c08dad86c40fb864d1ca539440abb823c1'],
  ]) check.equal(createHash('sha256').update(fs.readFileSync(path.join(product, file))).digest('hex'), expected, file);
});

if (process.env.GFIELD_TEST_INPUT_FIXTURES_DIR) for (const name of ['ui-legacy-cms-before.json', 'ui-legacy-fields-before.json']) {
  scenario(`ui-import-fixture-${name}`, 'The supplied browser-import fixture passes schema checks and preserves all course/academy records in a local no-op submit; actual browser import is assessed separately.', entry => {
    const filename = path.join(process.env.GFIELD_TEST_INPUT_FIXTURES_DIR, name);
    let state = JSON.parse(fs.readFileSync(filename, 'utf8'));
    assertValid(state);
    const before = protectedData(state), academiesBefore = clone(state.wizard.academies);
    compactScreen(state); submit(state);
    check.deepEqual(protectedData(state), before);
    check.deepEqual(state.wizard.academies, academiesBefore);
    state = roundtrip(state); reopen(state); submit(state);
    check.deepEqual(protectedData(state), before);
    check.deepEqual(state.wizard.academies, academiesBefore);
    entry.fixture = filename;
  });
}

scenario('network-not-attempted', 'All verification uses local modules and synthetic states only.', () => {check.deepEqual(networkAttempts, []);});

after(() => {
  const directory = process.env.GFIELD_TEST_OUTPUT_DIR;
  if (!directory) return;
  assert.equal(path.isAbsolute(directory), true, 'Evidence directory must be absolute');
  const at = new Date().toISOString();
  const runDirectory = path.join(directory, `run-${at.replaceAll(':', '-')}-${process.pid}`);
  fs.mkdirSync(runDirectory, {recursive: true});
  const fileManifest = [];
  for (const item of fixtures) {
    const filename = `${item.id}.json`, text = JSON.stringify(item.state, null, 2) + '\n';
    fs.writeFileSync(path.join(runDirectory, filename), text, {flag: 'wx'});
    fileManifest.push({file: filename, description: item.description, sha256: createHash('sha256').update(text).digest('hex')});
  }
  const report = {
    kind: 'Step 1–2 academy selection independent module / generated-HTML regression', recordedAt: at,
    synthetic: true, product, testFile: fileURLToPath(import.meta.url), testSha256: createHash('sha256').update(fs.readFileSync(fileURLToPath(import.meta.url))).digest('hex'),
    sourceAudit: [...audit].map(([file, details]) => ({file, ...details})), networkAttempts,
    summary: {cases: outcomes.length, passed: outcomes.filter(item => item.status === 'pass').length, failed: outcomes.filter(item => item.status === 'fail').length, assertions},
    limitations: ['HTML string and Map input checks do not establish actual browser layout, refresh or IndexedDB persistence.', 'JSON roundtrip is local in-memory serialization.', 'Original 22 semantic baseline and browser review are separate evidence.'],
    fixtures: fileManifest, outcomes,
  };
  const filename = path.join(runDirectory, 'result.json');
  fs.writeFileSync(filename, JSON.stringify(report, null, 2) + '\n', {flag: 'wx'});
  console.log(`Academy selection evidence: ${filename}`);
});
