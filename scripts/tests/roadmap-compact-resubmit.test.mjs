// D01 regression contract: repeat submission edits the selected record; explicit
// additions remain additions. Run only after the compact implementation is ready.
// Optional evidence output: GFIELD_TEST_OUTPUT_DIR=/absolute/qa/path node --test ...
import test, {after} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';

// The Pages workflow copies roadmap/ wholesale; keep regression code under scripts/.
const product = fileURLToPath(new URL('../../roadmap/v31/', import.meta.url));
const networkAttempts = [];
for (const name of ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource']) {
  globalThis[name] = function () {
    networkAttempts.push(name);
    throw new Error(`Network is prohibited in this regression: ${name}`);
  };
}
const importAudit = new Map();
function auditImports(name) {
  if (importAudit.has(name)) return;
  const source = fs.readFileSync(path.join(product, name), 'utf8');
  const dependencies = [...source.matchAll(/from ['"]\.\/([^'"]+)['"]/g)].map(match => match[1]);
  const networkTokens = [...source.matchAll(/fetch\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon/g)].map(match => match[0]);
  importAudit.set(name, {sha256: createHash('sha256').update(source).digest('hex'), networkTokens});
  assert.deepEqual(networkTokens, [], `Inspect network code before importing ${name}`);
  for (const dependency of dependencies) auditImports(dependency);
}
for (const name of ['compact-intake.mjs', 'scene-intake.mjs', 'quick-flow.mjs', 'paths-v10.mjs', 'workspace-engine.mjs', 'review-validation.mjs']) auditImports(name);
const load = name => import(pathToFileURL(path.join(product, name)));
const {createState, acceptPlan} = await load('engine.mjs');
const {ensureWizard, addBook, saveBookDetails, back} = await load('flow.mjs');
const {ensureV10, saveRelation} = await load('paths-v10.mjs');
const {ensureQuick, commitLearning} = await load('quick-flow.mjs');
const {startCompact, ensureCompact, collectCompact, commitCompact, isCompactStep} = await load('compact-intake.mjs');
const {startScene, collectScene, nextScene, anotherBookScene} = await load('scene-intake.mjs');
const {ensureWorkspace, validateWorkspaceState} = await load('workspace-engine.mjs');
const {validateReviewState} = await load('review-validation.mjs');
const clone = value => structuredClone(value);
const jsonRoundtrip = value => JSON.parse(JSON.stringify(value));
const forms = values => new Map(Object.entries(values));
const outcomes = [];

function scenario(name, contract, body) {
  test(name, {concurrency: false}, () => {
    const entry = {name, contract, status: 'running'};
    outcomes.push(entry);
    try {
      body(entry);
      entry.status = 'pass';
    } catch (error) {
      entry.status = 'fail';
      entry.error = {message: error.message, actual: error.actual, expected: error.expected, stack: error.stack};
      throw error;
    }
  });
}

function fresh({step = 'intro', stage = '초1'} = {}) {
  const state = ensureWorkspace(ensureQuick(ensureV10(ensureWizard(createState()))));
  state.wizard.quick.stage = stage;
  state.wizard.step = step;
  startCompact(state);
  return state;
}
function assertValid(state) {
  const review = validateReviewState(state);
  const workspace = validateWorkspaceState(state);
  assert.equal(review.valid, true, review.errors.join('\n'));
  assert.equal(workspace.valid, true, workspace.errors.join('\n'));
}
function setVolume(state, track, volume) {
  collectCompact(state, forms({[`compact:${track}:volume`]: '__custom__', [`compact:${track}:customVolume`]: volume}), `compact:${track}:customVolume`);
}
function setBook(state, track, name, volume) {
  collectCompact(state, forms({[`compact:${track}:choice`]: '__custom__'}), `compact:${track}:choice`);
  collectCompact(state, forms({[`compact:${track}:name`]: name}), `compact:${track}:name`);
  setVolume(state, track, volume);
}
function submit(state) {
  assert.equal(isCompactStep(state), true, 'Fixture must use a real compact step');
  const previous = state.wizard.step;
  commitCompact(state);
  assertValid(state);
  state.wizard.history.push(previous);
  return state;
}
function previous(state) {
  back(state);
  if (state.wizard.step === 'learning' && state.wizard.quick.compact && state.wizard.quick.scene?.context !== 'editing') startCompact(state);
  assert.equal(isCompactStep(state), true);
}
function savedCourse(state, track, name, volume, options = {}) {
  const course = addBook(state, track, name);
  saveBookDetails(state, {volume, range: options.range ?? '확인한 단원', completion: options.completion ?? 'unknown', level: options.level ?? 'unknown'});
  Object.assign(course, {edition: '2024', isbn: '9780000000001', sourceRole: 'parent_report', evidenceDate: '2025-08-20', note: '기존 합성 기록의 원래 메모'}, options);
  state.wizard.quick.courseIds[track] = course.id;
  return course;
}
function reopenSelected(state) {
  startCompact(state, {reset: true});
  state.wizard.step = 'learning';
}
function protectedRecords(state) {
  return clone({plans: state.plans, activePlanId: state.activePlanId, records: state.records, events: state.events, relations: state.wizard.v10.relations, plannedCourses: state.wizard.v10.plannedCourses, workspace: state.workspace});
}

for (const [track, book, volume] of [
  ['application', '쎈수학', '중등 1-1'],
  ['depth', '최상위 수학', '초등 3-1'],
  ['thinking', '팩토', '3권 중 2권째'],
  ['arithmetic', '소마셈', 'K1'],
]) {
  scenario(`new ${track}: previous and repeated identical submission`, 'First input creates one ID; repeated Previous submissions preserve that ID, order, fields and evidence.', entry => {
    let state = fresh();
    setBook(state, track, book, volume);
    submit(state);
    const saved = clone(state.courses);
    for (let pass = 0; pass < 4; pass++) {
      if (pass % 2 === 1) state = jsonRoundtrip(state);
      previous(state);
      submit(state);
      assert.deepEqual(state.courses, saved);
    }
    entry.evidence = {track, id: saved[0].id, count: state.courses.length, jsonRoundtrips: 2};
  });
}

scenario('learning entry and explicit edit both preserve middle identity', 'Both compact entry variants retain the selected middle course on a bare range edit.', () => {
  for (const initialStep of ['intro', 'learning']) {
    const state = fresh({step: initialStep});
    setBook(state, 'application', '쎈수학', '중등 1-1');
    submit(state);
    const id = state.courses[0].id;
    previous(state);
    setVolume(state, 'application', '1-2');
    submit(state);
    assert.equal(state.courses.length, 1);
    assert.equal(state.courses[0].id, id);
    assert.equal(state.courses[0].level, 'middle');
    assert.equal(state.courses[0].volume, '1-2');
    reopenSelected(state);
    setVolume(state, 'application', '2-1');
    submit(state);
    assert.equal(state.courses.length, 1);
    assert.equal(state.courses[0].id, id);
    assert.equal(state.courses[0].level, 'middle');
  }
});

scenario('all four axes submitted together survive JSON return', 'A combined form keeps each independently selected record across serialization and repeated Previous.', () => {
  let state = fresh();
  for (const [track, name, volume] of [['application', '쎈수학', '중등 1-1'], ['depth', '최상위 수학', '초등 2-1'], ['thinking', '팩토', '1단계 B'], ['arithmetic', '소마셈', 'K1']]) setBook(state, track, name, volume);
  submit(state);
  const saved = clone(state.courses);
  state = jsonRoundtrip(state);
  previous(state);
  submit(state);
  state = jsonRoundtrip(state);
  previous(state);
  submit(state);
  assert.deepEqual(state.courses, saved);
});

for (const status of ['unentered', 'reported-unknown', 'not-started', 'legacy-unconfirmed']) {
  scenario(`saved status ${status} and original evidence stay unchanged`, 'Unchanged submissions do not invent a completionInput or replace the original evidence date/source.', () => {
    const state = fresh();
    const options = status === 'unentered' ? {completion: 'unknown', completionInput: 'unentered'} : status === 'reported-unknown' ? {completion: 'unknown', completionInput: 'reported'} : status === 'not-started' ? {completion: 'not_started', completionInput: 'reported'} : {completion: 'unknown'};
    savedCourse(state, 'thinking', '팩토', '1단계 B', options);
    const original = clone(state.courses);
    reopenSelected(state);
    submit(state);
    previous(state);
    submit(state);
    assert.deepEqual(state.courses, original);
  });
}

for (const status of ['unentered', 'reported-unknown', 'not-started', 'reported-done', 'in-progress', 'reviewed-done', 'legacy-unconfirmed']) {
  scenario(`same-ID range edit preserves existing ${status} progress`, 'The agreed legacy scene contract preserves separately recorded progress when editing the same linked book range.', () => {
    const state = fresh();
    const options = status === 'unentered' ? {completion: 'unknown', completionInput: 'unentered'} : status === 'reported-unknown' ? {completion: 'unknown', completionInput: 'reported'} : status === 'not-started' ? {completion: 'not_started', completionInput: 'reported'} : status === 'reported-done' ? {completion: 'reported_done', completionInput: 'reported'} : status === 'in-progress' ? {completion: 'in_progress', completionInput: 'reported'} : status === 'reviewed-done' ? {completion: 'reviewed_done', completionInput: 'reported'} : {completion: 'unknown'};
    const old = savedCourse(state, 'thinking', '팩토', '1단계 B', {...options, range: '부모가 남긴 3단원', sourceRole: 'legacy_parent_report'});
    const original = clone(old);
    reopenSelected(state);
    setVolume(state, 'thinking', '2단계 B');
    submit(state);
    const actual = state.courses[0];
    assert.equal(state.courses.length, 1);
    assert.equal(actual.id, original.id);
    assert.equal(actual.volume, '2단계 B');
    assert.equal(actual.range, original.range);
    assert.equal(actual.completion, original.completion);
    assert.equal(actual.completionInput, original.completionInput);
    assert.equal(Object.hasOwn(actual, 'completionInput'), Object.hasOwn(original, 'completionInput'));
    for (const field of ['sourceRole', 'edition', 'isbn', 'note']) assert.equal(actual[field], original[field]);
  });
}

scenario('legacy middle course bare range retains evidence identity and missing input', 'Bare range editing preserves course ID, middle level, source role and absence of completionInput.', () => {
  const state = fresh();
  const old = savedCourse(state, 'application', '쎈수학', '중등 1-1', {level: 'middle', range: ''});
  assert.equal(Object.hasOwn(old, 'completionInput'), false);
  reopenSelected(state);
  setVolume(state, 'application', '1-2');
  submit(state);
  assert.equal(state.courses.length, 1);
  assert.equal(state.courses[0].id, old.id);
  assert.equal(state.courses[0].level, 'middle');
  assert.equal(state.courses[0].sourceRole, old.sourceRole);
  assert.equal(Object.hasOwn(state.courses[0], 'completionInput'), false);
});

scenario('range edit dates the changed evidence in Korea today', 'A real range edit updates evidenceDate, while the separate no-op cases retain the original evidenceDate.', () => {
  const state = fresh();
  const old = savedCourse(state, 'application', '쎈수학', '중등 1-1', {level: 'middle'});
  const oldDate = old.evidenceDate;
  reopenSelected(state);
  setVolume(state, 'application', '1-2');
  submit(state);
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en', {timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'}).formatToParts(new Date()).map(part => [part.type, part.value]));
  const today = `${parts.year}-${parts.month}-${parts.day}`;
  assert.equal(state.courses[0].id, old.id);
  assert.equal(state.courses[0].evidenceDate, today);
  assert.notEqual(state.courses[0].evidenceDate, oldDate);
});

scenario('same-name editions and ISBNs update only selected non-last ID', 'No name-based deduplication or fallback to a different edition; unselected IDs, order and values remain exact.', () => {
  const state = fresh();
  const selected = savedCourse(state, 'application', '쎈수학', '중등 1-1', {edition: '2022', isbn: '9780000000101', level: 'middle', completionInput: 'reported'});
  savedCourse(state, 'application', '쎈수학', '중등 1-1', {edition: '2026', isbn: '9780000000202', level: 'middle', completionInput: 'unentered'});
  savedCourse(state, 'application', '디딤돌 기본+응용', '초등 3-1', {edition: '2026', isbn: '9780000000303', level: 'elementary'});
  state.wizard.quick.courseIds.application = selected.id;
  const original = clone(state.courses);
  reopenSelected(state);
  setVolume(state, 'application', '1-2');
  submit(state);
  assert.deepEqual(state.courses.map(course => course.id), original.map(course => course.id));
  assert.deepEqual(state.courses.slice(1), original.slice(1));
  assert.equal(state.courses[0].id, selected.id);
  assert.equal(state.courses[0].volume, '1-2');
  assert.equal(state.courses[0].level, 'middle');
  assert.equal(state.courses[0].edition, '2022');
  assert.equal(state.courses[0].isbn, '9780000000101');
});

scenario('same-name separate real records are not collapsed', 'Previously separate records remain separate even if name, edition and volume match.', () => {
  const state = fresh();
  const first = savedCourse(state, 'thinking', '팩토', '1단계 B');
  savedCourse(state, 'thinking', '팩토', '1단계 B', {note: '별도로 입력한 두 번째 실제 기록'});
  state.wizard.quick.courseIds.thinking = first.id;
  const original = clone(state.courses);
  reopenSelected(state);
  submit(state);
  previous(state);
  submit(state);
  assert.deepEqual(state.courses, original);
});

for (const choice of ['__unentered__', '__unknown__', '__not_started__']) {
  scenario(`previous then ${choice} preserves existing records`, 'Clearing the editable selection or deferring does not erase previously recorded learning.', () => {
    const state = fresh();
    setBook(state, 'thinking', '팩토', '1단계 B');
    submit(state);
    const original = clone(state.courses);
    previous(state);
    collectCompact(state, forms({'compact:thinking:choice': choice}), 'compact:thinking:choice');
    submit(state);
    assert.deepEqual(state.courses, original);
  });
}

scenario('new blank axis remains empty and explicit states stay distinct', 'New unanswered, unknown and not-started axes do not create fake course records.', () => {
  const state = fresh();
  collectCompact(state, forms({'compact:thinking:choice': '__unknown__', 'compact:arithmetic:choice': '__not_started__'}));
  submit(state);
  previous(state);
  submit(state);
  assert.deepEqual(state.courses, []);
  assert.equal(state.wizard.axisStatus.application, undefined);
  assert.equal(state.wizard.axisStatus.thinking, 'unknown');
  assert.equal(state.wizard.axisStatus.arithmetic, 'not_started');
});

scenario('academy and book together do not duplicate on Previous', 'Academy IDs, original statuses and notes remain exact alongside the course identity.', () => {
  let state = fresh({stage: 'p5'});
  state.wizard.academies.push({id: 'synthetic-old-academy', institution: '필즈', level: '기존반', status: 'past', note: '보존할 학원 기록'});
  reopenSelected(state);
  setBook(state, 'thinking', '팩토', '1단계 B');
  collectCompact(state, forms({'compact:academy:choice': '소마'}), 'compact:academy:choice');
  collectCompact(state, forms({'compact:academy:level': '프리미어2'}), 'compact:academy:level');
  submit(state);
  const saved = {courses: clone(state.courses), academies: clone(state.wizard.academies)};
  for (let pass = 0; pass < 3; pass++) {
    state = jsonRoundtrip(state);
    previous(state);
    submit(state);
    assert.deepEqual(state.courses, saved.courses);
    assert.deepEqual(state.wizard.academies, saved.academies);
  }
});

scenario('choosing another book preserves old record and creates one new ID', 'Different book selection is still a new record; later resubmission reuses that new record.', () => {
  const state = fresh();
  setBook(state, 'thinking', '팩토', '1단계 B');
  submit(state);
  const old = clone(state.courses[0]);
  previous(state);
  setBook(state, 'thinking', '1031 입문', 'A');
  submit(state);
  assert.equal(state.courses.length, 2);
  assert.deepEqual(state.courses[0], old);
  assert.notEqual(state.courses[1].id, old.id);
  const saved = clone(state.courses);
  previous(state);
  submit(state);
  assert.deepEqual(state.courses, saved);
});

scenario('new book does not inherit the previous book progress or edition', 'Preserving same-record progress does not copy completion, range, edition or ISBN into a genuinely different book.', () => {
  const state = fresh();
  savedCourse(state, 'thinking', '팩토', '1단계 B', {completion: 'reported_done', completionInput: 'reported', range: '전체 3단원', edition: '2022', isbn: '9780000000101'});
  const original = clone(state.courses[0]);
  reopenSelected(state);
  setBook(state, 'thinking', '1031 입문', 'A');
  submit(state);
  assert.equal(state.courses.length, 2);
  assert.deepEqual(state.courses[0], original);
  const added = state.courses[1];
  assert.notEqual(added.id, original.id);
  assert.equal(added.completion, 'unknown');
  assert.equal(added.completionInput, 'unentered');
  assert.equal(added.range, '');
  assert.equal(added.edition, '');
  assert.notEqual(added.isbn, original.isbn);
});

scenario('explicit scene add can create same-name new record', 'The explicit other-book action is not deduplicated by name, edition or scope.', () => {
  const state = fresh();
  setBook(state, 'thinking', '팩토', '1단계 B');
  submit(state);
  const old = clone(state.courses[0]);
  state.wizard.step = 'learning';
  startScene(state, {track: 'thinking', entry: 'book', editing: true});
  anotherBookScene(state, 'thinking');
  collectScene(state, forms({'learn:thinking:name': '팩토', 'learn:thinking:volume': '1단계 B'}));
  nextScene(state);
  commitLearning(state, {sceneOnly: true});
  assertValid(state);
  assert.equal(state.courses.length, 2);
  assert.deepEqual(state.courses[0], old);
  assert.notEqual(state.courses[1].id, old.id);
  const saved = clone(state.courses);
  reopenSelected(state);
  submit(state);
  previous(state);
  submit(state);
  assert.deepEqual(state.courses, saved);
});

for (const track of ['application', 'depth', 'thinking', 'arithmetic']) {
  scenario(`build35 missing compact ID uses valid quick ID for ${track}`, 'An old draft without row ID reconnects only its already-linked same-track same-name record.', () => {
    let state = fresh();
    const name = track === 'application' ? '쎈수학' : '동일 교재';
    const volume = track === 'application' ? '중등 1-1' : '1단계 B';
    setBook(state, track, name, volume);
    submit(state);
    const original = clone(state.courses);
    state.wizard.quick.compact.rows[track].courseId = '';
    state.wizard.quick.compact.rows[track].baseline = null;
    state = jsonRoundtrip(state);
    previous(state);
    submit(state);
    assert.deepEqual(state.courses, original);
  });
}

scenario('legacy fallback respects selected ID among duplicate names', 'Recovery uses the supplied quick ID, not the first/last matching name.', () => {
  let state = fresh();
  const selected = savedCourse(state, 'application', '쎈수학', '중등 1-1', {level: 'middle', edition: '2022', isbn: '9780000000101'});
  savedCourse(state, 'application', '쎈수학', '중등 1-1', {level: 'middle', edition: '2026', isbn: '9780000000202'});
  state.wizard.quick.courseIds.application = selected.id;
  reopenSelected(state);
  state.wizard.quick.compact.rows.application.courseId = '';
  state.wizard.quick.compact.rows.application.baseline = null;
  state = jsonRoundtrip(state);
  const untouched = clone(state.courses[1]);
  setVolume(state, 'application', '1-2');
  submit(state);
  assert.equal(state.courses.length, 2);
  assert.equal(state.courses[0].id, selected.id);
  assert.equal(state.courses[0].level, 'middle');
  assert.equal(state.courses[0].volume, '1-2');
  assert.deepEqual(state.courses[1], untouched);
});

scenario('missing explicit row ID rejects atomically despite another valid quick ID', 'An explicit broken record link is an error, not permission to replace its identity or create a duplicate.', () => {
  const state = fresh();
  savedCourse(state, 'application', '쎈수학', '중등 1-1', {level: 'middle', edition: '2022', isbn: '9780000000101'});
  const other = savedCourse(state, 'application', '쎈수학', '중등 1-1', {level: 'middle', edition: '2026', isbn: '9780000000202'});
  reopenSelected(state);
  ensureCompact(state).rows.application.courseId = 'synthetic-explicit-id-not-in-records';
  state.wizard.quick.courseIds.application = other.id;
  const before = clone(state);
  assert.throws(() => commitCompact(state), /기록|연결|과정|교재/);
  assert.deepEqual(state, before);
});

scenario('legacy fallback does not borrow a different book or track ID', 'Only an already-linked same-name, same-track record can be recovered.', () => {
  for (const mismatch of ['book', 'track']) {
    const state = fresh();
    const old = savedCourse(state, mismatch === 'track' ? 'arithmetic' : 'thinking', mismatch === 'book' ? '다른 책' : '팩토', '기존 범위');
    reopenSelected(state);
    setBook(state, 'thinking', '팩토', '1단계 B');
    const row = ensureCompact(state).rows.thinking;
    row.courseId = '';
    row.baseline = null;
    state.wizard.quick.courseIds.thinking = old.id;
    const saved = clone(state.courses);
    submit(state);
    assert.equal(state.courses.length, 2);
    assert.deepEqual(state.courses[0], saved[0]);
    assert.notEqual(state.courses[1].id, old.id);
    assert.equal(state.courses[1].intakeTrack, 'thinking');
  }
});

scenario('course-ID relations, baseline plan and monthly reference remain unchanged', 'Editing the selected record preserves accepted snapshots, relation source IDs and linked actual record IDs.', () => {
  let state = fresh();
  const course = savedCourse(state, 'application', '쎈수학', '중등 1-1', {level: 'middle'});
  saveRelation(state, {kind: 'R01', sourceCourseIds: [course.id], targetPlannedCourseIds: [], condition: '합성 관계 보존'});
  state = acceptPlan(state, {routeIds: ['B09'], courseIds: [course.id], title: '합성 기준 계획', reason: 'D01 보호 검수'}, '2025-08-20T00:00:00.000Z');
  state.workspace.actualRecords.push({id: 'synthetic-linked-actual', itemId: `legacy:${course.id}`, kind: 'observation', occurred: {precision: 'unknown', value: ''}, note: '원래 교재에 연결된 관찰'});
  assertValid(state);
  const protectedBefore = protectedRecords(state);
  reopenSelected(state);
  setVolume(state, 'application', '1-2');
  submit(state);
  state = jsonRoundtrip(state);
  previous(state);
  submit(state);
  assert.equal(state.courses.length, 1);
  assert.equal(state.courses[0].id, course.id);
  assert.deepEqual(protectedRecords(state), protectedBefore);
});

scenario('rejected partial custom input is atomic', 'A missing explicit custom name does not alter existing courses or protected records.', () => {
  const state = fresh();
  savedCourse(state, 'thinking', '팩토', '1단계 B');
  reopenSelected(state);
  setBook(state, 'thinking', '', '2권');
  const before = clone(state);
  assert.throws(() => commitCompact(state), /교재 이름/);
  assert.deepEqual(state, before);
});

scenario('no network was attempted', 'All regression cases use local modules and synthetic state only.', () => {
  assert.deepEqual(networkAttempts, []);
});

after(() => {
  const outputDirectory = process.env.GFIELD_TEST_OUTPUT_DIR;
  if (!outputDirectory) return;
  assert.equal(path.isAbsolute(outputDirectory), true, 'Evidence directory must be absolute');
  fs.mkdirSync(outputDirectory, {recursive: true});
  const recordedAt = new Date().toISOString();
  const filename = `compact-regression-${recordedAt.replaceAll(':', '-')}-${process.pid}.json`;
  const report = {
    kind: 'D01 independent module regression; no browser or external service execution',
    recordedAt,
    testFile: fileURLToPath(import.meta.url),
    testSha256: createHash('sha256').update(fs.readFileSync(fileURLToPath(import.meta.url))).digest('hex'),
    product,
    sourceAudit: [...importAudit].map(([file, details]) => ({file, ...details})),
    synthetic: true,
    networkAttempts,
    summary: {cases: outcomes.length, passed: outcomes.filter(entry => entry.status === 'pass').length, failed: outcomes.filter(entry => entry.status === 'fail').length},
    limitations: ['No browser persistence, refresh, file picker or layout was exercised.', 'JSON roundtrip is in-memory serialization, not an IndexedDB test.', 'Full monthly plan/report regression is a separate preservation suite.'],
    outcomes,
  };
  const destination = path.join(outputDirectory, filename);
  fs.writeFileSync(destination, JSON.stringify(report, null, 2), {flag: 'wx'});
  console.log(`D01 module evidence: ${destination}`);
});
