(function () {
  'use strict';

  const app = document.getElementById('app');
  const sets = Array.isArray(window.ALPHA_PREP_SETS) ? window.ALPHA_PREP_SETS : [];
  const peers = Array.isArray(window.ALPHA_PREP_PEERS) ? window.ALPHA_PREP_PEERS : [];
  const API_URL = 'https://fgahqumaldheqettmvqg.supabase.co/functions/v1/alpha-prep-coach';
  const TRANSCRIBE_URL = 'https://fgahqumaldheqettmvqg.supabase.co/functions/v1/alpha-prep-transcribe';
  const API_KEY = 'sb_publishable_OsjJG92BLMaZrc2jTClt0g_ecdTtf_I';
  const CACHE_KEY = 'leteon:alpha-prep:coach-cache:v1';
  const SESSION_KEY = 'leteon:alpha-prep:sessions:v1';
  const READ_SECONDS = 60;
  const MAX_RECORD_SECONDS = 90;
  const MAX_FOLLOW_DEPTH = 2;
  const COACH_TIMEOUT_MS = 28000;
  const TRANSCRIBE_TIMEOUT_MS = 48000;

  const peerAnswers = {
    'city-trees': 'I think cities should spend the extra money because healthy trees cool buildings and help with rainwater. The benefit is not only for the tree; it reaches the whole neighborhood.',
    'borrowed-shade': 'Rabbit learned that a useful gift should be shared. Fox changed Rabbit more effectively by being generous than by arguing with him.',
    'bee-dance': 'The scent is important because several kinds of flowers may grow in the same direction. It helps the bees know which plants the dancer actually found.',
    'bell-on-hill': 'An apology is a good beginning, but Jun should also use the bell responsibly many times. Trust returns when his actions match his promise.',
    'tide-pools': 'Visitors may observe the animals, but I would not let them pick the animals up. Even a small action can expose them to heat or damage their home.',
    'small-shell': 'The judge made the right choice because the shell saved the crab. Its usefulness and Sol’s kindness mattered more than its appearance.',
    'sleep-memory': 'I would study earlier and sleep on time. The experiment suggests that sleep helps the brain organize practice, although sleep cannot replace studying.',
    'missing-line': 'Ava helped Eli think instead of simply rescuing him. Her clue let him recover the meaning, so he could speak naturally in his own words.',
    'bike-library': 'The read-aloud service seems most useful because it creates a learning experience, not just a delivery. It can also help children who cannot yet read alone.',
    'paper-bridge': 'Changing your mind can show strength when new evidence appears. Joon listened to the test result and improved the team’s bridge.',
    'community-fridge': 'I would begin with clear rules and volunteers instead of locks. Locks could make people feel unwelcome, while shared responsibility supports the purpose of the fridge.',
    'two-brooms': 'Choosing first was not enough to make the job fair. Fairness meant matching each tool to the work and giving both children a useful role.',
    'forest-partners': 'Something can be important even when we cannot see it. The fungal threads are hidden, but they help a plant reach water and nutrients while receiving sugars in return.',
    'quiet-channel': 'Quiet work can be just as valuable as loud work. The ants solved the real problem by joining many tiny paths into one channel, even though Woodpecker barely noticed them.',
    'night-migration': 'Tall buildings should dim unnecessary lights during migration weeks. The passage explains that bright lights can confuse birds and cause them to circle or strike glass.',
    'moth-lantern': 'Pip learned that the brightest sign is not always the most reliable guide. He needed to compare the lantern with the hill and moon before changing direction.',
    'moving-bridges': 'A bridge would not be safer with every gap removed. Small, controlled spaces let its materials expand and contract without building harmful pressure.',
    'jar-basket': 'The basket showed greater strength because it adjusted without losing its purpose. Its flexibility protected the apples and also made room for the damaged jar.',
    'seed-banks': 'Communities should support seed banks before a disaster happens. A backup is useful because no one can predict which variety may be needed after disease or environmental change.',
    'finch-seeds': 'Wren was wise to share because she saved part of the harvest first. Helping Finch did not remove her backup, and it gave both birds more choices for the next season.'
  };

  const state = {
    stage: 'lobby',
    entered: false,
    studentName: currentReaderName() || 'Reader',
    seat: 2,
    setIndex: 0,
    sessionMode: 'full',
    coachMode: 'economy',
    passageIndex: 0,
    readingStarted: false,
    secondsLeft: READ_SECONDS,
    queue: [],
    questionIndex: 0,
    answerDraft: '',
    turns: [],
    passageNotes: {},
    adaptiveUsed: {},
    peerHeard: false,
    listening: false,
    transcribing: false,
    recordingSeconds: 0,
    transcriberStatus: 'checking',
    busy: false,
    notice: '',
    report: null,
    printMode: '',
    apiStatus: 'idle',
    apiCalls: 0,
    startedAt: 0
  };

  let timer = null;
  let recognition = null;
  let mediaRecorder = null;
  let mediaStream = null;
  let recordingTimer = null;
  let transcriberCheck = null;
  let transcriptionRun = 0;
  let speechRun = 0;
  let renderedViewKey = '';
  const audioChannel = (() => {
    try { return 'BroadcastChannel' in window ? new BroadcastChannel('leteon-alpha-prep-audio') : null; } catch (_) { return null; }
  })();
  if (audioChannel) audioChannel.onmessage = () => stopSpeech();

  function currentReaderName() {
    try {
      const currentId = localStorage.getItem('leteon:current');
      const students = JSON.parse(localStorage.getItem('leteon:students') || '[]');
      const found = Array.isArray(students) ? students.find((student) => student.id === currentId) : null;
      return found && found.name ? String(found.name).slice(0, 20) : '';
    } catch (_) {
      return '';
    }
  }

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function selectedSet() {
    return sets[state.setIndex] || sets[0];
  }

  function currentPassage() {
    const set = selectedSet();
    return set && set.passages ? set.passages[state.passageIndex] : null;
  }

  function passageLimit() {
    return state.sessionMode === 'quick' ? 1 : 2;
  }

  function wordCount(text) {
    return String(text || '').trim().split(/\s+/).filter(Boolean).length;
  }

  function formatTime(seconds) {
    const safe = Math.max(0, seconds);
    return `${Math.floor(safe / 60)}:${String(safe % 60).padStart(2, '0')}`;
  }

  function progressStep() {
    if (state.stage === 'lobby' || state.stage === 'briefing' || state.stage === 'print-preview') return 1;
    if (state.stage === 'reading' || state.stage === 'collected') return 2;
    if (state.stage === 'interview' || state.stage === 'between') return 3;
    return 4;
  }

  function studioHeader() {
    const step = progressStep();
    const labels = ['Room', 'Read', 'Interview', 'Coach'];
    return `<header class="studio-header">
      <a class="brand" href="../" aria-label="Back to Reading Town">
        <span class="brand-mark">A</span>
        <span><b>ALPHA PREP</b><small>INTERVIEW STUDIO</small></span>
      </a>
      <ol class="stage-track" aria-label="Interview progress">
        ${labels.map((label, index) => `<li class="${step === index + 1 ? 'active' : step > index + 1 ? 'done' : ''}"><span>${step > index + 1 ? '✓' : index + 1}</span>${label}</li>`).join('')}
      </ol>
      <span class="mobile-stage" aria-label="Step ${step} of 4: ${labels[step - 1]}"><b>${step}/4</b>${labels[step - 1]}</span>
      <a class="town-link" href="../">Reading Town</a>
    </header>`;
  }

  function personMarkup(person, index, seated) {
    const colors = ['#d96b5f', '#347a68', '#d39b32', '#4777a8'];
    const labels = peers[index] || { name: `Student ${index + 1}` };
    const mine = index + 1 === state.seat;
    return `<div class="candidate candidate-${index + 1} ${seated ? 'seated' : ''} ${mine ? 'mine' : ''}" style="--shirt:${colors[index]}" aria-label="${mine ? esc(state.studentName) : esc(labels.name)}">
      <span class="hair"></span><span class="face"></span><span class="body"></span><span class="legs"></span>
      <small>${mine ? esc(state.studentName) : esc(labels.name)}</small>
    </div>`;
  }

  function roomScene(mode) {
    const seated = mode !== 'arrival';
    return `<div class="interview-room ${state.entered || seated ? 'entered' : ''} ${seated ? 'settled' : ''}" role="img" aria-label="Four students entering an interview room and sitting across from the director">
      <div class="room-window"><span></span><span></span><span></span></div>
      <div class="room-board"><b>WELCOME</b><small>Listen · Think · Speak</small></div>
      <div class="director"><img class="director-photo" src="assets/alpha-teacher.webp" alt=""><small>Director Henry</small></div>
      <div class="director-desk"><span></span></div>
      <div class="door"><span class="door-knob"></span></div>
      <div class="floor-line"></div>
      <div class="chairs">${[1, 2, 3, 4].map((number) => `<span class="chair chair-${number}"></span>`).join('')}</div>
      <div class="candidates">${[0, 1, 2, 3].map((index) => personMarkup(peers[index], index, seated)).join('')}</div>
      <div class="room-caption">${seated ? 'Four-candidate interview room' : 'The door opens. Walk in calmly and take your seat.'}</div>
    </div>`;
  }

  function lobbyScreen() {
    const set = selectedSet();
    return `${studioHeader()}<main class="lobby-layout">
      <section class="scene-column">
        <div class="scene-kicker">FULL MOCK INTERVIEW</div>
        <h1>Walk in ready to listen.</h1>
        <p class="scene-lead">You will read silently, speak without the paper, answer follow-up questions, and respond to another student’s idea.</p>
        ${roomScene('arrival')}
      </section>
      <section class="setup-panel" aria-labelledby="setup-title">
        <div class="panel-number">01</div>
        <h2 id="setup-title">Choose your seat</h2>
        <label class="field-label" for="student-name">Student name</label>
        <input id="student-name" class="text-input" data-field="studentName" maxlength="20" value="${esc(state.studentName)}" autocomplete="off">
        <span class="field-label">Seat</span>
        <div class="seat-picker" role="group" aria-label="Choose a seat">
          ${[1, 2, 3, 4].map((seat) => `<button type="button" data-action="seat" data-seat="${seat}" class="${state.seat === seat ? 'active' : ''}" aria-pressed="${state.seat === seat}">${seat}</button>`).join('')}
        </div>
        <label class="field-label" for="set-select">Practice set</label>
        <select id="set-select" class="select-input" data-field="setIndex">
          ${sets.map((item, index) => `<option value="${index}" ${index === state.setIndex ? 'selected' : ''}>${esc(item.label)} · ${esc(item.theme)}</option>`).join('')}
        </select>
        <p class="level-note"><b>${esc(set.level)}</b><br>Original prediction passages. No textbook pages are copied.</p>
        <span class="field-label">Session</span>
        <div class="segmented" role="group" aria-label="Choose session length">
          <button type="button" data-action="mode" data-mode="full" class="${state.sessionMode === 'full' ? 'active' : ''}">Full · 2 rounds</button>
          <button type="button" data-action="mode" data-mode="quick" class="${state.sessionMode === 'quick' ? 'active' : ''}">Quick · 1 text</button>
        </div>
        <div class="lobby-actions"><button class="quiet-command print-preview-command" type="button" data-action="preview-print">Print preview</button><button class="primary-command mobile-dock-action" type="button" data-action="enter-room" ${state.entered ? 'disabled' : ''}>${state.entered ? 'Taking your seat…' : 'Open the door'} <span>→</span></button></div>
        <p class="privacy-note">Alpha Prep does not save an audio file. Your browser converts speech to text, and you can type instead.</p>
      </section>
    </main>`;
  }

  function printablePassages() {
    return selectedSet().passages.slice(0, passageLimit());
  }

  function printPageMarkup(passage, index, total) {
    const words = wordCount(passage.paragraphs.join(' '));
    return `<article class="print-page-preview" aria-labelledby="print-passage-${index + 1}">
      <header class="print-sheet-header">
        <div><b>ALPHA PREP</b><small>INTERVIEW READING</small></div>
        <span>${esc(selectedSet().label)} · ${esc(selectedSet().theme)}</span>
      </header>
      <div class="print-student-line"><span>Name</span><i></i><span>Date</span><i></i></div>
      <div class="print-passage-meta"><b>${esc(passage.genre)}</b><span>PASSAGE ${index + 1} OF ${total}</span></div>
      <h1 id="print-passage-${index + 1}">${esc(passage.title)}</h1>
      <div class="print-passage-copy">${passage.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}</div>
      <footer><span>${words} words</span><span>Read silently for 1 minute</span></footer>
    </article>`;
  }

  function printPreviewScreen() {
    const passages = printablePassages();
    return `${studioHeader()}<main class="print-preview-layout">
      <header class="print-preview-toolbar">
        <div><div class="eyebrow">BEFORE THE INTERVIEW</div><h1>Print preview</h1><p>${esc(selectedSet().label)} · ${passages.length} passage sheet${passages.length === 1 ? '' : 's'} · one passage per A4 page</p></div>
        <div class="print-preview-actions"><button class="quiet-command" type="button" data-action="close-print-preview">Back</button><button class="primary-command" type="button" data-action="print-materials">Print ${passages.length} sheet${passages.length === 1 ? '' : 's'}</button></div>
      </header>
      <section class="print-page-stack" aria-label="Passage print preview">${passages.map((passage, index) => printPageMarkup(passage, index, passages.length)).join('')}</section>
    </main>`;
  }

  function briefingScreen() {
    const set = selectedSet();
    const timingCopy = state.sessionMode === 'full'
      ? 'You will read <b>two passages, one at a time</b>. You have <b>one minute for each passage</b>. I will collect each passage before its interview questions.'
      : 'You will have <b>one minute</b> to read. Then I will collect the passage before the interview questions.';
    return `${studioHeader()}<main class="briefing-layout">
      <section class="brief-room">${roomScene('seated')}</section>
      <section class="brief-copy">
        <div class="eyebrow">DIRECTOR’S BRIEFING</div>
        <h1>Good afternoon, everyone.</h1>
        <p>${timingCopy} Keep listening while the other students speak because I may ask for your response at any time.</p>
        <dl class="brief-facts">
          <div class="brief-detail"><dt>Set</dt><dd>${esc(set.label)} · ${esc(set.theme)}</dd></div>
          <div><dt>Rounds</dt><dd>${state.sessionMode === 'full' ? `1. ${esc(set.passages[0].genre)} · 2. ${esc(set.passages[1].genre)}` : `1. ${esc(set.passages[0].genre)}`}</dd></div>
          <div><dt>Timing</dt><dd>${state.sessionMode === 'full' ? '60 seconds for each passage' : '60 seconds'}</dd></div>
          <div class="brief-detail"><dt>Focus</dt><dd>Summary · evidence · opinion · vocabulary · listening</dd></div>
        </dl>
        <details class="coach-options" ${state.coachMode === 'deep' ? 'open' : ''}>
          <summary>Coaching options</summary>
          <label class="switch-row"><input type="checkbox" data-field="coachMode" ${state.coachMode === 'deep' ? 'checked' : ''}><span><b>Deep coaching</b><small>Use one extra adaptive check for a follow-up answer.</small></span></label>
        </details>
        <button class="primary-command mobile-dock-action" type="button" data-action="prepare-reading">Receive passage <span>→</span></button>
      </section>
    </main>`;
  }

  function readingScreen() {
    const passage = currentPassage();
    if (!passage) return errorScreen('No passage is available for this set.');
    const words = wordCount(passage.paragraphs.join(' '));
    const number = state.passageIndex + 1;
    if (!state.readingStarted) {
      return `${studioHeader()}<main class="reading-ready">
        <section class="paper-cover">
          <div class="paper-clip"></div>
          <div class="genre-stamp">${esc(passage.genre)}</div>
          <p>PASSAGE ${number} OF ${passageLimit()}</p>
          <h1>${esc(passage.title)}</h1>
          <dl><div><dt>Time</dt><dd>1 minute for this passage</dd></div><div><dt>Length</dt><dd>${words} words</dd></div><div><dt>Rule</dt><dd>Silent reading</dd></div></dl>
          <button class="primary-command mobile-dock-action" type="button" data-action="start-reading">Start 1-minute reading <span>▶</span></button>
        </section>
        <aside class="reading-instructions"><b>Before you start</b><ol><li>Find the main idea.</li><li>Hold two important details in your memory.</li><li>Notice unfamiliar words from context.</li></ol></aside>
      </main>`;
    }
    const elapsed = READ_SECONDS - state.secondsLeft;
    const progress = Math.round((elapsed / READ_SECONDS) * 100);
    return `${studioHeader()}<main class="reading-session">
      <div class="reading-status">
        <div class="reading-toolbar">
          <div><span class="live-dot"></span><b>SILENT READING</b><small>Passage ${number} of ${passageLimit()}</small></div>
          <div class="timer" aria-label="${state.secondsLeft} seconds remaining"><strong>${formatTime(state.secondsLeft)}</strong><span>remaining</span></div>
        </div>
        <div class="time-track"><span style="width:${progress}%"></span></div>
      </div>
      <article class="reading-paper" aria-labelledby="passage-title">
        <header><span>${esc(passage.genre)}</span><span>${words} words</span></header>
        <h1 id="passage-title">${esc(passage.title)}</h1>
        <div class="passage-copy">${passage.paragraphs.map((paragraph) => `<p>${esc(paragraph)}</p>`).join('')}</div>
        <footer>Read for meaning. The paper will be collected automatically.</footer>
      </article>
      <button class="quiet-command" type="button" data-action="finish-reading">I finished reading</button>
    </main>`;
  }

  function collectedScreen() {
    const passage = currentPassage();
    return `${studioHeader()}<main class="collected-screen">
      <div class="paper-slot"><div class="collected-paper"><span>${esc(passage.genre)}</span><b>${esc(passage.title)}</b></div></div>
      <section>
        <div class="eyebrow">PASSAGE COLLECTED</div>
        <h1>Look up. Breathe once.</h1>
        <p>The text will stay hidden during the interview. Answer with what you understood, not with memorized sentences.</p>
        <div class="memory-cues"><span>Main idea</span><span>2 details</span><span>Your view</span></div>
        <button class="primary-command mobile-dock-action" type="button" data-action="begin-interview">Begin the interview <span>→</span></button>
      </section>
    </main>`;
  }

  function avatarBadge(index, active) {
    const peer = peers[index];
    const mine = index + 1 === state.seat;
    return `<div class="table-person ${active ? 'speaking' : ''} ${mine ? 'mine' : ''}" style="--person:${peer.color}"><span>${mine ? initials(state.studentName) : initials(peer.name)}</span><small>${mine ? esc(state.studentName) : esc(peer.name)}</small></div>`;
  }

  function initials(name) {
    const value = String(name || 'R').trim();
    return value.split(/\s+/).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('') || 'R';
  }

  function interviewRoom(current) {
    const peerSeat = current && current.peerSeat ? current.peerSeat : 0;
    return `<div class="roundtable" aria-label="Four-person interview">
      <div class="henry ${current && current.kind === 'teacher' ? 'speaking' : ''}"><span class="teacher-portrait"><img src="assets/alpha-teacher.webp" alt="Korean male interviewer, Director Henry"></span><small>Director Henry</small></div>
      <div class="table-surface" aria-hidden="true"></div>
      ${[0, 1, 2, 3].map((index) => avatarBadge(index, current && ((current.kind === 'peer' && peerSeat === index + 1) || (current.kind !== 'peer' && index + 1 === state.seat)))).join('')}
    </div>`;
  }

  function currentQueueItem() {
    return state.queue[state.questionIndex] || null;
  }

  function interviewScreen() {
    const current = currentQueueItem();
    const passage = currentPassage();
    if (!current) return errorScreen('The question queue is empty.');
    const progress = Math.round(((state.questionIndex + (current.kind === 'peer' ? 0 : 1)) / state.queue.length) * 100);
    const isPeer = current.kind === 'peer';
    const peer = isPeer ? peers[current.peerSeat - 1] : null;
    const listeningAvailable = micSupported();
    const questionLabel = current.kind === 'ambush'
      ? 'SURPRISE LISTENING QUESTION'
      : isPeer
        ? `${peer.name.toUpperCase()}’S TURN`
        : current.adaptive
          ? `FOLLOW-UP ${current.followDepth || 1} OF ${MAX_FOLLOW_DEPTH}`
          : 'YOUR TURN';
    return `${studioHeader()}<main class="interview-layout">
      <section class="room-column">
        <div class="interview-meta"><span>${esc(passage.genre)} · ${esc(passage.title)}</span><b>${state.questionIndex + 1} / ${state.queue.length}</b></div>
        ${interviewRoom(current)}
        <div class="question-progress"><span style="width:${progress}%"></span></div>
        <div class="question-block ${current.kind === 'ambush' ? 'ambush' : ''}">
          <div class="question-kicker">${questionLabel}</div>
          <h1>${esc(current.prompt)}</h1>
          ${isPeer ? `<div class="peer-answer"><b>${esc(peer.name)}</b><p>“${esc(current.peerAnswer)}”</p></div>` : ''}
        </div>
      </section>
      <aside class="answer-panel">
        ${isPeer ? peerTurnControls(current, peer) : answerControls(current, listeningAvailable)}
      </aside>
    </main>`;
  }

  function peerTurnControls(current, peer) {
    return `<div class="panel-number">LISTEN</div>
      <h2>${state.peerHeard ? 'Keep the idea in mind.' : `${esc(peer.name)} is answering.`}</h2>
      <p>${state.peerHeard ? 'Director Henry will ask about the exact idea you just heard. Remember the claim and its reason.' : 'Listen for the claim and the reason. Do not plan your own answer yet.'}</p>
      <div class="listen-target"><span>${initials(peer.name)}</span><div><b>${esc(peer.name)}’s idea</b><small>Claim + reason</small></div></div>
      ${state.peerHeard
        ? `<button class="primary-command mobile-dock-action" type="button" data-action="after-peer">I listened <span>→</span></button>`
        : `<button class="primary-command mobile-dock-action" type="button" data-action="hear-peer">Hear the answer <span>▶</span></button>`}
      <button class="text-command" type="button" data-action="repeat-peer">Repeat question and answer</button>`;
  }

  function answerControls(current, listeningAvailable) {
    const recording = state.listening && mediaRecorder && mediaRecorder.state !== 'inactive';
    const microphoneBusy = state.listening || state.transcribing;
    const microphoneLabel = state.transcribing
      ? 'Transcribing…'
      : recording
        ? `Stop recording ${formatTime(state.recordingSeconds)}`
        : state.listening
          ? 'Stop listening'
          : 'Record answer';
    const microphoneAction = state.listening ? 'stop-mic' : 'start-mic';
    const microphoneDisabled = !listeningAvailable || state.transcribing;
    const usesBrowserBackup = state.transcriberStatus === 'fallback' && browserSpeechSupported();
    return `<div class="panel-number">SPEAK</div>
      <h2>Answer in English.</h2>
      <p class="answer-hint">${answerHint(current)}</p>
      <div class="record-row">
        <button class="mic-button ${state.listening ? 'listening' : ''} ${state.transcribing ? 'transcribing' : ''}" type="button" data-action="${microphoneAction}" ${microphoneDisabled ? 'disabled' : ''} aria-label="${esc(microphoneLabel)}"><span>${state.listening ? '■' : '●'}</span><b>${esc(microphoneLabel)}</b></button>
        <button class="sound-button" type="button" data-action="repeat-question" title="Hear the question again" aria-label="Hear the question again">↻</button>
      </div>
      ${recording ? `<div class="recording-status" aria-live="polite"><span class="recording-pulse"></span><b>Recording</b><time id="recording-time">${formatTime(state.recordingSeconds)}</time><small>Tap stop when you finish.</small></div>` : ''}
      ${state.transcribing ? '<div class="recording-status processing" aria-live="polite"><span class="recording-pulse"></span><b>Transcribing your answer</b><small>Please wait a moment.</small></div>' : ''}
      ${!listeningAvailable ? '<p class="support-note">The microphone is unavailable in this browser. You can type your answer below.</p>' : ''}
      ${usesBrowserBackup ? '<p class="support-note">High-accuracy transcription is not connected yet. The browser microphone is available as a temporary backup.</p>' : ''}
      <label class="transcript-label" for="answer-draft">Your transcript <small>Check any recognition mistakes before submitting.</small></label>
      <textarea id="answer-draft" data-field="answerDraft" rows="7" maxlength="900" placeholder="I think… because…" autocapitalize="sentences" autocomplete="off" enterkeyhint="done" spellcheck="true">${esc(state.answerDraft)}</textarea>
      <div class="answer-stats"><span>${wordCount(state.answerDraft)} words</span><span>${state.notice ? esc(state.notice) : 'Aim for a complete idea and one reason.'}</span></div>
      <div class="answer-submit-dock"><button class="primary-command" type="button" data-action="submit-answer" ${state.busy || microphoneBusy ? 'disabled' : ''}>${state.busy ? 'Coach is reviewing…' : state.transcribing ? 'Transcribing…' : state.listening ? 'Finish recording first' : 'Submit answer'} <span>→</span></button></div>
      <p class="cost-note">${state.coachMode === 'deep' ? 'Deep mode checks one follow-up answer too.' : 'Extra follow-ups continue on this device.'}</p>`;
  }

  function answerHint(current) {
    if (current.kind === 'ambush') return `Explain ${current.peerName}’s specific point first. Then evaluate it and add one new detail.`;
    if (current.type === 'summary') return 'Main idea → two important details → short ending.';
    if (current.type === 'vocabulary') return 'Use the surrounding sentence as evidence for the meaning.';
    if (current.type === 'opinion') return 'State your view, say why, and connect it to the passage.';
    if (current.adaptive) return 'Answer the exact follow-up. Add a passage detail when you can.';
    return 'Give a clear answer and support it with a reason or detail.';
  }

  function betweenScreen() {
    const completed = selectedSet().passages[state.passageIndex];
    const next = selectedSet().passages[state.passageIndex + 1];
    const notes = state.turns.filter((turn) => turn.passageId === completed.id);
    return `${studioHeader()}<main class="between-screen">
      <section>
        <div class="eyebrow">PASSAGE ${state.passageIndex + 1} COMPLETE</div>
        <h1>You kept speaking after the paper disappeared.</h1>
        <p>${notes.length} answers are saved for the coaching report. The second text changes genre, just as it may in the real interview.</p>
        <div class="between-score"><span>${notes.filter((turn) => turn.feedback && turn.feedback.scores.evidence >= 3).length}</span><b>answers with clear evidence</b></div>
      </section>
      <section class="next-passage"><span>${esc(next.genre)}</span><h2>${esc(next.title)}</h2><p>Round ${state.passageIndex + 2} of ${passageLimit()} · One minute · ${wordCount(next.paragraphs.join(' '))} words</p><button class="primary-command mobile-dock-action" type="button" data-action="next-passage">Receive next passage <span>→</span></button></section>
    </main>`;
  }

  function reportScreen() {
    const report = state.report || buildLocalReport();
    const rubric = report.rubric;
    const score = report.overall;
    return `${studioHeader()}<main class="report-layout">
      <section class="report-hero">
        <div class="report-title"><div class="eyebrow">INTERVIEW COACH REPORT</div><h1>${esc(state.studentName)}’s readiness profile</h1><p>${esc(report.summary)}</p><a class="jump-command" href="#answer-coaching">See my corrections <span>↓</span></a></div>
        <div class="overall-score"><strong>${score.toFixed(1)}</strong><span>/ 4.0</span><small>${score >= 3.4 ? 'Ready to stretch' : score >= 2.7 ? 'Developing well' : 'Build the response frame'}</small></div>
      </section>
      <section class="rubric-band">
        <header><div><span>01</span><h2>Seven interview skills</h2></div><p>Scored from the spoken or typed transcript</p></header>
        <div class="rubric-grid">${Object.entries(rubric).map(([key, item]) => `<div class="rubric-row"><div><b>${esc(item.label)}</b><small>${esc(item.note)}</small></div><div class="score-dots" aria-label="${item.score} out of 4">${[1, 2, 3, 4].map((point) => `<span class="${point <= item.score ? 'on' : ''}"></span>`).join('')}</div><strong>${item.score}</strong></div>`).join('')}</div>
      </section>
      <section class="report-columns">
        <div class="priority-section">
          <header><span>02</span><h2>Next three priorities</h2></header>
          ${report.priorities.map((item, index) => `<article class="priority-item"><b>${index + 1}</b><div><h3>${esc(item.title)}</h3><p>${esc(item.action)}</p><small>${esc(item.drill)}</small></div></article>`).join('')}
        </div>
        <div class="vocab-section">
          <header><span>03</span><h2>Henry’s vocabulary check</h2></header>
          <p>${esc(report.vocabulary.note)}</p>
          <div class="vocab-result"><strong>${report.vocabulary.used.length}</strong><span>target words used</span></div>
          <div class="vocab-list">${report.vocabulary.entries.map((entry) => `<div class="${report.vocabulary.used.includes(entry[0]) ? 'used' : ''}"><b>${esc(entry[0])}</b><span>${esc(entry[1])}</span><small>${esc(entry[2])}</small></div>`).join('')}</div>
          <p class="vocab-next"><b>Next move:</b> ${esc(report.vocabulary.next)}</p>
        </div>
      </section>
      <section class="corrections-section" id="answer-coaching">
        <header><div><span>04</span><h2>Answer-by-answer coaching</h2></div><p>Keep the idea. Upgrade the delivery.</p></header>
        <div class="correction-list">${state.turns.map((turn, index) => correctionItem(turn, index)).join('')}</div>
      </section>
      <section class="roadmap-section">
        <header><span>05</span><h2>Seven-day interview route</h2></header>
        <div class="roadmap">${report.roadmap.map((day, index) => `<article><span>DAY ${index + 1}</span><b>${esc(day.title)}</b><p>${esc(day.task)}</p></article>`).join('')}</div>
      </section>
      <section class="report-actions"><button class="quiet-command" type="button" data-action="restart">Try another set</button><button class="quiet-command" type="button" data-action="print-report">Print report</button><button class="primary-command" type="button" data-action="retry-set">Retry this set <span>↻</span></button></section>
      <p class="report-footnote">${state.apiStatus === 'ready' ? `Adaptive text coaching used ${state.apiCalls} call${state.apiCalls === 1 ? '' : 's'}; no paid voice generation was requested.` : 'Local coaching completed the session; no paid voice generation was used.'}</p>
    </main>`;
  }

  function correctionItem(turn, index) {
    const feedback = turn.feedback;
    const correction = feedback.correction || {};
    return `<details class="correction-item" ${index === 0 ? 'open' : ''}>
      <summary><span>${String(index + 1).padStart(2, '0')}</span><div><b>${esc(turn.question)}</b><small>${esc(feedback.skill || 'Complete response')}</small></div><strong>${averageScores(feedback.scores).toFixed(1)}</strong></summary>
      <div class="correction-body">
        <div><label>Your answer</label><p>${esc(turn.answer)}</p></div>
        <div class="improved"><label>Polished delivery</label><p>${esc(correction.improved || turn.answer)}</p></div>
        <dl><div><dt>What worked</dt><dd>${esc(feedback.strength)}</dd></div><div><dt>Upgrade</dt><dd>${esc(feedback.focus)}</dd></div><div><dt>Language note</dt><dd>${esc(correction.note || 'Keep the sentence direct and complete.')}</dd></div></dl>
      </div>
    </details>`;
  }

  function errorScreen(message) {
    return `${studioHeader()}<main class="error-screen"><h1>Interview studio paused</h1><p>${esc(message)}</p><button class="primary-command" type="button" data-action="restart">Return to the lobby</button></main>`;
  }

  function render() {
    if (!sets.length) {
      app.innerHTML = errorScreen('Practice data did not load.');
      return;
    }
    const nextViewKey = state.stage === 'reading'
      ? `${state.stage}:${state.passageIndex}:${state.readingStarted ? 'active' : 'ready'}`
      : state.stage === 'interview'
        ? `${state.stage}:${state.passageIndex}:${state.questionIndex}`
        : `${state.stage}:${state.passageIndex}`;
    const viewChanged = Boolean(renderedViewKey && renderedViewKey !== nextViewKey);
    const screens = {
      lobby: lobbyScreen,
      'print-preview': printPreviewScreen,
      briefing: briefingScreen,
      reading: readingScreen,
      collected: collectedScreen,
      interview: interviewScreen,
      between: betweenScreen,
      report: reportScreen
    };
    app.innerHTML = (screens[state.stage] || lobbyScreen)();
    document.body.dataset.stage = state.stage;
    document.body.dataset.printMode = state.printMode;
    renderedViewKey = nextViewKey;
    if (viewChanged) {
      requestAnimationFrame(() => {
        if (state.stage === 'interview' && window.matchMedia('(max-width: 780px)').matches) {
          const question = document.querySelector('.question-block');
          if (question) question.scrollIntoView({ block: 'start' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
      });
    }
    const draft = document.getElementById('answer-draft');
    if (draft && state.stage === 'interview' && !state.listening && !state.transcribing && !state.busy && !window.matchMedia('(max-width: 780px)').matches) {
      requestAnimationFrame(() => draft.focus({ preventScroll: true }));
    }
  }

  function enterRoom() {
    state.studentName = String(state.studentName || 'Reader').trim().slice(0, 20) || 'Reader';
    state.entered = true;
    render();
    speakSequence(['Good afternoon. Please come in and take your seat.'], 'teacher');
    window.setTimeout(() => {
      if (state.stage !== 'lobby') return;
      state.stage = 'briefing';
      render();
    }, 2500);
  }

  function prepareReading() {
    stopSpeech();
    state.stage = 'reading';
    state.readingStarted = false;
    state.secondsLeft = READ_SECONDS;
    state.startedAt = Date.now();
    render();
  }

  function startReading() {
    state.readingStarted = true;
    state.secondsLeft = READ_SECONDS;
    render();
    clearInterval(timer);
    timer = window.setInterval(() => {
      state.secondsLeft -= 1;
      if (state.secondsLeft <= 0) {
        collectPassage();
        return;
      }
      const timerNode = document.querySelector('.timer strong');
      const track = document.querySelector('.time-track span');
      if (timerNode) timerNode.textContent = formatTime(state.secondsLeft);
      if (track) track.style.width = `${Math.round(((READ_SECONDS - state.secondsLeft) / READ_SECONDS) * 100)}%`;
    }, 1000);
  }

  function collectPassage() {
    clearInterval(timer);
    timer = null;
    state.readingStarted = false;
    state.secondsLeft = 0;
    state.stage = 'collected';
    render();
    speakSequence(['Time is up. Please look at me. I will collect the passage now.'], 'teacher');
  }

  function buildQuestionQueue() {
    const passage = currentPassage();
    const questions = passage.questions || [];
    const others = [1, 2, 3, 4].filter((seat) => seat !== state.seat);
    const peerSeat = others[(state.passageIndex + state.setIndex) % others.length];
    const peer = peers[peerSeat - 1];
    const peerAnswer = peerAnswers[passage.id] || 'I think the passage gives us a reason to look at the problem from another point of view.';
    const peerClaim = peerAnswer.match(/^[^.!?]+[.!?]?/)?.[0] || peerAnswer;
    state.queue = [
      { kind: 'student', type: questions[0].type, prompt: questions[0].prompt, adaptiveSource: true, followDepth: 0 },
      { kind: 'student', type: questions[1].type, prompt: questions[1].prompt },
      { kind: 'peer', type: questions[2].type, prompt: questions[2].prompt, peerSeat, peerAnswer },
      { kind: 'ambush', type: 'interaction', prompt: `${peer.name} said, “${peerClaim}” What do you think about that specific idea? Explain it and add one detail of your own.`, peerName: peer.name, peerSeat, peerClaim },
      { kind: 'student', type: questions[3].type, prompt: questions[3].prompt }
    ];
    state.questionIndex = 0;
    state.answerDraft = '';
    state.peerHeard = false;
  }

  function beginInterview() {
    buildQuestionQueue();
    state.stage = 'interview';
    render();
    window.setTimeout(() => speakQuestion(currentQueueItem()), 180);
  }

  function speakQuestion(item) {
    if (!item) return;
    if (item.kind === 'peer') return;
    speakSequence([item.prompt], 'teacher');
  }

  function hearPeer() {
    const item = currentQueueItem();
    if (!item || item.kind !== 'peer') return;
    state.peerHeard = true;
    render();
    speakSequence([{ text: item.prompt, role: 'teacher' }, { text: item.peerAnswer, role: 'peer' }], 'teacher');
  }

  function repeatPeer() {
    const item = currentQueueItem();
    if (!item || item.kind !== 'peer') return;
    state.peerHeard = true;
    render();
    speakSequence([{ text: item.prompt, role: 'teacher' }, { text: item.peerAnswer, role: 'peer' }], 'teacher');
  }

  function afterPeer() {
    if (!state.peerHeard) return;
    state.questionIndex += 1;
    state.peerHeard = false;
    state.answerDraft = '';
    render();
    window.setTimeout(() => speakQuestion(currentQueueItem()), 150);
  }

  function micSupported() {
    if (state.transcriberStatus === 'fallback') return browserSpeechSupported();
    return recordedMicSupported() || browserSpeechSupported();
  }

  function recordedMicSupported() {
    return Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  }

  function browserSpeechSupported() {
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  async function checkTranscriber() {
    if (transcriberCheck) return transcriberCheck;
    if (!window.fetch || location.protocol === 'file:') {
      state.transcriberStatus = 'fallback';
      return false;
    }
    transcriberCheck = (async () => {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 5000);
      try {
        const response = await fetch(TRANSCRIBE_URL, {
          method: 'GET',
          headers: { apikey: API_KEY },
          signal: controller.signal
        });
        const data = response.ok ? await response.json() : null;
        state.transcriberStatus = data && data.available ? 'ready' : 'fallback';
        return state.transcriberStatus === 'ready';
      } catch (_) {
        state.transcriberStatus = 'fallback';
        return false;
      } finally {
        window.clearTimeout(timeout);
        transcriberCheck = null;
        if (state.stage === 'interview') render();
      }
    })();
    return transcriberCheck;
  }

  function normalizeSpeechText(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function speechTokenKey(value) {
    return String(value || '').toLowerCase().replace(/^[^a-z0-9']+|[^a-z0-9']+$/g, '');
  }

  function mergeSpeechText(existing, incoming) {
    const left = normalizeSpeechText(existing);
    const right = normalizeSpeechText(incoming);
    if (!left) return right;
    if (!right) return left;

    const leftWords = left.split(' ');
    const rightWords = right.split(' ');
    const leftKeys = leftWords.map(speechTokenKey);
    const rightKeys = rightWords.map(speechTokenKey);
    const sameWords = (first, second) => first.length === second.length
      && first.every((word, index) => word === second[index]);

    if (leftKeys.length <= rightKeys.length && sameWords(leftKeys, rightKeys.slice(0, leftKeys.length))) {
      return right;
    }
    if (rightKeys.length <= leftKeys.length && sameWords(rightKeys, leftKeys.slice(0, rightKeys.length))) {
      return left;
    }

    for (let overlap = Math.min(leftKeys.length, rightKeys.length); overlap > 0; overlap -= 1) {
      if (sameWords(leftKeys.slice(-overlap), rightKeys.slice(0, overlap))) {
        return [...leftWords, ...rightWords.slice(overlap)].join(' ');
      }
    }
    return `${left} ${right}`;
  }

  function speechTranscript(results) {
    let transcript = '';
    for (let index = 0; index < results.length; index += 1) {
      const alternative = results[index] && results[index][0];
      if (alternative) transcript = mergeSpeechText(transcript, alternative.transcript);
    }
    return transcript;
  }

  function preferredRecordingType() {
    if (!window.MediaRecorder || typeof window.MediaRecorder.isTypeSupported !== 'function') return '';
    return [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4'
    ].find((type) => window.MediaRecorder.isTypeSupported(type)) || '';
  }

  function clearRecordingTimer() {
    window.clearInterval(recordingTimer);
    recordingTimer = null;
  }

  function stopMediaTracks(stream) {
    if (!stream || typeof stream.getTracks !== 'function') return;
    stream.getTracks().forEach((track) => {
      try { track.stop(); } catch (_) { /* track is already stopped */ }
    });
    if (mediaStream === stream) mediaStream = null;
  }

  function cancelActiveRecording() {
    transcriptionRun += 1;
    clearRecordingTimer();
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.ondataavailable = null;
      mediaRecorder.onstop = null;
      mediaRecorder.onerror = null;
      try { mediaRecorder.stop(); } catch (_) { /* recorder is already stopped */ }
    }
    mediaRecorder = null;
    stopMediaTracks(mediaStream);
    state.listening = false;
    state.transcribing = false;
    state.recordingSeconds = 0;
  }

  function transcriptionContext() {
    const passage = currentPassage() || {};
    const item = currentQueueItem() || {};
    return {
      passageTitle: passage.title || '',
      passageGenre: passage.genre || '',
      question: item.prompt || '',
      keywords: Array.isArray(passage.vocabulary)
        ? passage.vocabulary.map((entry) => Array.isArray(entry) ? entry[0] : '').filter(Boolean)
        : []
    };
  }

  function recordingExtension(type) {
    if (/mp4/i.test(type)) return 'm4a';
    if (/mpeg|mp3/i.test(type)) return 'mp3';
    if (/wav/i.test(type)) return 'wav';
    return 'webm';
  }

  async function requestTranscription(audio, durationMs) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), TRANSCRIBE_TIMEOUT_MS);
    const form = new FormData();
    form.append('audio', audio, `alpha-prep-answer.${recordingExtension(audio.type)}`);
    form.append('durationMs', String(durationMs));
    form.append('context', JSON.stringify(transcriptionContext()));
    try {
      const response = await fetch(TRANSCRIBE_URL, {
        method: 'POST',
        headers: { apikey: API_KEY },
        body: form,
        signal: controller.signal
      });
      const data = await response.json().catch(() => null);
      if (!response.ok || !data || typeof data.text !== 'string' || !data.text.trim()) {
        if (data && data.error === 'transcriber_not_configured') state.transcriberStatus = 'fallback';
        throw new Error(data && data.error ? data.error : 'transcription_unavailable');
      }
      return normalizeSpeechText(data.text);
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function finishRecordedAnswer(recorder, stream, chunks, startedAt, recordedType) {
    clearRecordingTimer();
    stopMediaTracks(stream);
    if (mediaRecorder === recorder) mediaRecorder = null;
    state.listening = false;
    state.recordingSeconds = 0;
    const durationMs = Math.max(0, Date.now() - startedAt);
    const audio = new Blob(chunks, { type: recordedType || chunks[0]?.type || 'audio/webm' });
    if (durationMs < 500 || audio.size < 100) {
      state.notice = 'Please speak a little longer, then stop the recording.';
      render();
      return;
    }

    state.transcribing = true;
    state.notice = 'Turning your speech into text…';
    const run = ++transcriptionRun;
    render();
    try {
      const transcript = await requestTranscription(audio, durationMs);
      if (run !== transcriptionRun) return;
      state.answerDraft = [normalizeSpeechText(state.answerDraft), transcript].filter(Boolean).join(' ').slice(0, 900);
      state.notice = 'Voice transcribed. Check the words, then submit.';
      state.transcriberStatus = 'ready';
    } catch (_) {
      if (run !== transcriptionRun) return;
      state.transcriberStatus = 'fallback';
      state.notice = browserSpeechSupported()
        ? 'High-accuracy transcription is unavailable. Record once more with the browser backup, or type your answer.'
        : 'High-accuracy transcription is unavailable. You can type your answer and continue.';
    } finally {
      if (run !== transcriptionRun) return;
      state.transcribing = false;
      render();
    }
  }

  async function startRecordedMic() {
    stopSpeech();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      const preferredType = preferredRecordingType();
      const recorder = preferredType ? new MediaRecorder(stream, { mimeType: preferredType }) : new MediaRecorder(stream);
      const chunks = [];
      const startedAt = Date.now();
      const recordedType = recorder.mimeType || preferredType || 'audio/webm';
      mediaStream = stream;
      mediaRecorder = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size) chunks.push(event.data);
      };
      recorder.onerror = () => {
        recorder.onstop = null;
        cancelActiveRecording();
        state.notice = 'The recording stopped unexpectedly. Please try again or type your answer.';
        render();
      };
      recorder.onstop = () => { void finishRecordedAnswer(recorder, stream, chunks, startedAt, recordedType); };
      recorder.start(250);
      state.listening = true;
      state.recordingSeconds = 0;
      state.notice = 'Speak naturally. Your grammar will stay as you said it.';
      render();
      recordingTimer = window.setInterval(() => {
        state.recordingSeconds = Math.min(MAX_RECORD_SECONDS, Math.floor((Date.now() - startedAt) / 1000));
        const time = document.getElementById('recording-time');
        const button = document.querySelector('.mic-button b');
        if (time) time.textContent = formatTime(state.recordingSeconds);
        if (button) button.textContent = `Stop recording ${formatTime(state.recordingSeconds)}`;
        if (state.recordingSeconds >= MAX_RECORD_SECONDS) stopMic();
      }, 250);
    } catch (_) {
      stopMediaTracks(mediaStream);
      mediaRecorder = null;
      state.listening = false;
      state.notice = 'Microphone permission was not granted. Please allow it or type your answer.';
      render();
    }
  }

  async function startMic() {
    if (state.listening || state.transcribing) return;
    if (state.transcriberStatus === 'checking') await checkTranscriber();
    if (state.transcriberStatus === 'ready' && recordedMicSupported()) {
      await startRecordedMic();
      return;
    }
    if (browserSpeechSupported()) {
      startBrowserMic();
      return;
    }
    state.notice = 'The microphone service is not available yet. You can type your answer and continue.';
    render();
  }

  function startBrowserMic() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition || state.listening) return;
    stopSpeech();
    try {
      recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = true;
      recognition.continuous = false;
      recognition.maxAlternatives = 1;
      const draftBeforeMic = normalizeSpeechText(state.answerDraft);
      let heardThisTurn = '';
      let recognitionFailed = false;
      recognition.onstart = () => {
        state.listening = true;
        state.notice = 'Speak one complete idea. This browser microphone is the temporary backup.';
        render();
      };
      recognition.onresult = (event) => {
        heardThisTurn = speechTranscript(event.results);
        state.answerDraft = mergeSpeechText(draftBeforeMic, heardThisTurn).slice(0, 900).trim();
        const textarea = document.getElementById('answer-draft');
        if (textarea) textarea.value = state.answerDraft;
        const stats = document.querySelector('.answer-stats span');
        if (stats) stats.textContent = `${wordCount(state.answerDraft)} words`;
      };
      recognition.onerror = (event) => {
        recognitionFailed = true;
        state.notice = event.error === 'not-allowed' ? 'Microphone permission was not granted. You can type instead.' : 'I could not hear clearly. Try once more or type your answer.';
      };
      recognition.onend = () => {
        state.listening = false;
        recognition = null;
        if (!recognitionFailed && heardThisTurn) {
          state.notice = 'Voice captured. Tap the microphone again to add another idea.';
        }
        render();
      };
      recognition.start();
    } catch (_) {
      state.listening = false;
      state.notice = 'Voice recognition could not start. Type your answer below.';
      render();
    }
  }

  function stopMic() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      state.notice = 'Finishing the recording…';
      try { mediaRecorder.stop(); } catch (_) { /* recorder is already stopping */ }
      return;
    }
    if (recognition) {
      try { recognition.stop(); } catch (_) { /* already stopped */ }
    }
    state.listening = false;
    render();
  }

  function submitAnswer() {
    if (state.busy || state.transcribing) return;
    if (state.listening) {
      stopMic();
      return;
    }
    const answer = String(state.answerDraft || '').trim();
    if (wordCount(answer) < 3) {
      state.notice = 'Give at least one complete idea before submitting.';
      render();
      return;
    }
    const item = currentQueueItem();
    const passage = currentPassage();
    const followDepth = Number(item.followDepth) || 0;
    state.busy = true;
    state.notice = '';
    const localFeedback = analyzeAnswer(answer, item, passage);
    let followUp = '';
    const useAdaptiveCoach = shouldUseAdaptive(item, passage);
    const remoteRequest = useAdaptiveCoach
      ? requestTurnCoach(passage, item, answer, localFeedback)
      : null;
    if (useAdaptiveCoach) {
      followUp = localFollowUp(item, answer, passage, localFeedback);
      state.adaptiveUsed[passage.id] = (state.adaptiveUsed[passage.id] || 0) + 1;
      if (state.apiStatus === 'idle') state.apiStatus = 'pending';
    } else if (item.adaptive && followDepth < MAX_FOLLOW_DEPTH) {
      followUp = localFollowUp(item, answer, passage, localFeedback);
    }
    const turn = {
      passageId: passage.id,
      passageTitle: passage.title,
      genre: passage.genre,
      kind: item.kind,
      type: item.type,
      question: item.prompt,
      answer,
      peerName: item.peerName || '',
      feedback: localFeedback
    };
    state.turns.push(turn);
    let followUpItem = null;
    if (followUp && item.kind !== 'peer' && followDepth < MAX_FOLLOW_DEPTH) {
      followUpItem = {
        kind: 'student',
        type: 'followup',
        prompt: followUp,
        adaptive: true,
        followDepth: followDepth + 1,
        parentType: item.parentType || item.type
      };
      state.queue.splice(state.questionIndex + 1, 0, followUpItem);
    }
    state.busy = false;
    state.answerDraft = '';
    advanceQuestion();
    if (remoteRequest) void applyTurnCoach(remoteRequest, turn, followUpItem);
  }

  async function applyTurnCoach(request, turn, followUpItem) {
    const remote = await request;
    if (!state.turns.includes(turn)) return;
    if (!remote) {
      if (state.apiStatus !== 'ready') state.apiStatus = 'local';
      return;
    }
    turn.feedback = mergeFeedback(turn.feedback, remote.feedback || {});
    state.apiStatus = 'ready';
    const remoteFollowUp = String(remote.followUp || '').trim();
    const queuedIndex = followUpItem ? state.queue.indexOf(followUpItem) : -1;
    if (remoteFollowUp && queuedIndex > state.questionIndex) {
      followUpItem.prompt = remoteFollowUp;
    }
  }

  function shouldUseAdaptive(item, passage) {
    if (!item || item.kind === 'peer') return false;
    const used = state.adaptiveUsed[passage.id] || 0;
    const limit = state.coachMode === 'deep' ? 2 : 1;
    return used < limit && (item.adaptive || item.adaptiveSource || item.type === 'opinion' || item.kind === 'ambush');
  }

  function advanceQuestion() {
    state.questionIndex += 1;
    if (state.questionIndex < state.queue.length) {
      render();
      window.setTimeout(() => {
        const item = currentQueueItem();
        if (item && item.kind !== 'peer') speakQuestion(item);
      }, 160);
      return;
    }
    if (state.passageIndex + 1 < passageLimit()) {
      state.stage = 'between';
      render();
      return;
    }
    finishSession();
  }

  function nextPassage() {
    state.passageIndex += 1;
    state.stage = 'reading';
    state.readingStarted = false;
    state.secondsLeft = READ_SECONDS;
    state.queue = [];
    state.questionIndex = 0;
    state.answerDraft = '';
    render();
    window.scrollTo({ top: 0 });
  }

  async function finishSession() {
    state.report = buildLocalReport();
    state.stage = 'report';
    render();
    saveSession(state.report);
    const remote = await requestFinalCoach(state.report);
    if (remote) {
      state.report = mergeReport(state.report, remote);
      state.apiStatus = 'ready';
      saveSession(state.report);
      render();
    }
  }

  function analyzeAnswer(answer, item, passage) {
    const lower = answer.toLowerCase();
    const words = lower.match(/[a-z']+/g) || [];
    const targetWords = passage.vocabulary.map((entry) => entry[0].toLowerCase());
    const usedTargets = targetWords.filter((word) => new RegExp(`\\b${escapeRegex(word)}\\b`, 'i').test(answer));
    const passageKeywords = keywordList(passage);
    const keywordHits = passageKeywords.filter((word) => words.includes(word)).length;
    const evidenceMarkers = /\b(because|for example|for instance|the passage|according to|it says|this shows|the story)\b/i.test(answer);
    const organizationMarkers = /\b(first|next|then|finally|however|therefore|at first|in the end|mainly)\b/i.test(answer);
    const opinionMarkers = /\b(i think|i believe|i agree|i disagree|in my opinion|my view)\b/i.test(answer);
    const peerMarkers = item.kind !== 'ambush' || new RegExp(`\\b(${escapeRegex(item.peerName || '')}|agree|disagree|add|said|idea)\\b`, 'i').test(answer);
    const length = words.length;
    const scores = {
      comprehension: clampScore(1 + (keywordHits >= 2 ? 1 : 0) + (length >= 18 ? 1 : 0) + (length >= 34 && keywordHits >= 3 ? 1 : 0)),
      evidence: clampScore(1 + (evidenceMarkers ? 1 : 0) + (keywordHits >= 3 ? 1 : 0) + (evidenceMarkers && keywordHits >= 4 ? 1 : 0)),
      organization: clampScore(1 + (length >= 10 ? 1 : 0) + (organizationMarkers ? 1 : 0) + (length >= 28 && /[.!?].+[.!?]/.test(answer) ? 1 : 0)),
      opinion: clampScore(1 + (opinionMarkers ? 1 : 0) + (/\bbecause\b/i.test(answer) ? 1 : 0) + (opinionMarkers && keywordHits >= 2 ? 1 : 0)),
      vocabulary: clampScore(1 + (usedTargets.length ? 1 : 0) + (usedTargets.length >= 2 ? 1 : 0) + (item.type === 'vocabulary' && length >= 15 ? 1 : 0)),
      interaction: clampScore(1 + (peerMarkers ? 1 : 0) + (item.kind === 'ambush' && /\b(but|also|however|another|add)\b/i.test(answer) ? 1 : 0) + (item.kind === 'ambush' && keywordHits >= 2 ? 1 : 0)),
      delivery: clampScore(1 + (length >= 8 ? 1 : 0) + (length >= 18 ? 1 : 0) + (/[.!?]$/.test(answer.trim()) ? 1 : 0))
    };
    const weakest = Object.entries(scores).sort((a, b) => a[1] - b[1])[0][0];
    const strength = bestStrength(scores, item, usedTargets);
    const focus = focusAdvice(weakest, item, passage);
    return {
      scores,
      strength,
      focus,
      skill: skillName(weakest),
      usedVocabulary: usedTargets,
      correction: polishAnswer(answer, item, passage, evidenceMarkers)
    };
  }

  function keywordList(passage) {
    const stop = new Set('about after again also because before being between could every from have into itself many more much other over same some than that their them then there these they this through under very were what when where which while will with would your'.split(' '));
    const text = `${passage.title} ${passage.paragraphs.join(' ')}`.toLowerCase();
    const counts = {};
    (text.match(/[a-z]{4,}/g) || []).forEach((word) => {
      if (!stop.has(word)) counts[word] = (counts[word] || 0) + 1;
    });
    passage.vocabulary.forEach((entry) => { counts[entry[0].toLowerCase()] = (counts[entry[0].toLowerCase()] || 0) + 2; });
    return Object.keys(counts).sort((a, b) => counts[b] - counts[a]).slice(0, 24);
  }

  function clampScore(value) {
    return Math.max(1, Math.min(4, Math.round(value)));
  }

  function averageScores(scores) {
    const values = Object.values(scores || {}).map(Number).filter(Number.isFinite);
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 1;
  }

  function bestStrength(scores, item, usedTargets) {
    const strongest = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
    if (item.kind === 'ambush' && scores.interaction >= 3) return 'You responded to the other student’s idea instead of ignoring it.';
    if (usedTargets.length) return `You used the target word “${usedTargets[0]}” in your own response.`;
    const messages = {
      comprehension: 'Your answer stays connected to the meaning of the passage.',
      evidence: 'You support your idea with information from the text.',
      organization: 'Your response has a clear order that is easy to follow.',
      opinion: 'Your position is direct and includes a reason.',
      vocabulary: 'You explain the word through meaning and context.',
      interaction: 'You show active listening and build on another idea.',
      delivery: 'You give a complete response instead of a one-word answer.'
    };
    return messages[strongest];
  }

  function focusAdvice(skill, item, passage) {
    const messages = {
      comprehension: `Name the central idea of “${passage.title}” before adding details.`,
      evidence: 'Add one exact event, fact, or example from the passage after your claim.',
      organization: 'Use a three-part frame: main point, supporting detail, short conclusion.',
      opinion: 'State “I think…” and complete the thought with “because…”.',
      vocabulary: `Use one target word such as “${passage.vocabulary[0][0]}” in a new sentence.`,
      interaction: `Refer to ${item.peerName || 'the other student'} by name and then add or challenge one point.`,
      delivery: 'Slow down and finish each sentence before starting the next idea.'
    };
    return messages[skill];
  }

  function skillName(key) {
    return ({
      comprehension: 'Main idea control',
      evidence: 'Text evidence',
      organization: 'Response structure',
      opinion: 'Claim and reason',
      vocabulary: 'Vocabulary in context',
      interaction: 'Active listening',
      delivery: 'Complete delivery'
    })[key] || 'Complete response';
  }

  function polishAnswer(answer, item, passage, hasEvidence) {
    let improved = answer.trim()
      .replace(/\bi am agree\b/gi, 'I agree')
      .replace(/\bi am disagree\b/gi, 'I disagree')
      .replace(/\b(he|she) say\b/gi, '$1 says')
      .replace(/\bpeople is\b/gi, 'people are')
      .replace(/\bthey was\b/gi, 'they were')
      .replace(/\s+([,.!?])/g, '$1')
      .replace(/\s{2,}/g, ' ');
    improved = improved.charAt(0).toUpperCase() + improved.slice(1);
    if (!/[.!?]$/.test(improved)) improved += '.';
    let note = improved !== answer.trim() ? 'I corrected agreement, capitalization, or punctuation while keeping your idea.' : 'Your sentence form is clear. The next improvement is in the content structure.';
    if (item.kind === 'ambush' && !new RegExp(`\\b${escapeRegex(item.peerName || '')}\\b`, 'i').test(improved)) {
      improved = `I understand ${item.peerName}’s point. ${improved}`;
      note = 'Name the speaker’s idea before giving your own response.';
    } else if (item.type === 'opinion' && !/\b(i think|i believe|i agree|i disagree|in my opinion)\b/i.test(improved)) {
      improved = `I think ${improved.charAt(0).toLowerCase()}${improved.slice(1)}`;
      note = 'Lead with a clear claim so the listener knows your position.';
    } else if (!hasEvidence && item.type !== 'vocabulary') {
      note += ' Add a specific passage detail after the claim.';
    }
    return { improved, note };
  }

  function localFollowUp(item, answer, passage, feedback) {
    const scores = feedback.scores;
    if ((Number(item.followDepth) || 0) >= 1) {
      if (scores.evidence <= 2) return 'Which one fact or event from the passage proves your answer?';
      if (scores.comprehension <= 2) return 'How does that detail connect to the main idea?';
      if (scores.organization <= 2) return 'Can you say your point first, then explain why it matters?';
      return 'Why does the detail you chose matter most?';
    }
    if (scores.evidence <= 2) return 'Which exact detail from the passage best supports what you just said?';
    if (scores.organization <= 2) return 'Can you state your main point first and then give one supporting detail?';
    if (item.type === 'summary') return passage.genre !== 'Nonfiction'
      ? 'Which event changed the main character’s thinking the most, and why?'
      : 'Which fact is most important for understanding the author’s main idea, and why?';
    if (item.kind === 'ambush') return `What is one point ${item.peerName} did not mention?`;
    if (wordCount(answer) < 18) return 'Can you explain one more reason or example?';
    return 'How might someone with a different opinion respond to your idea?';
  }

  function mergeFeedback(local, remote) {
    const allowedScores = {};
    Object.keys(local.scores).forEach((key) => {
      const value = Number(remote.scores && remote.scores[key]);
      allowedScores[key] = Number.isFinite(value) ? clampScore(value) : local.scores[key];
    });
    return {
      ...local,
      scores: allowedScores,
      strength: cleanText(remote.strength, 260) || local.strength,
      focus: cleanText(remote.focus, 300) || local.focus,
      skill: cleanText(remote.skill, 80) || local.skill,
      correction: {
        improved: cleanText(remote.improvedAnswer, 900) || local.correction.improved,
        note: cleanText(remote.languageNote, 320) || local.correction.note
      }
    };
  }

  function buildLocalReport() {
    const labels = {
      comprehension: 'Comprehension',
      evidence: 'Text evidence',
      organization: 'Organization',
      opinion: 'Opinion & reasoning',
      vocabulary: 'Vocabulary',
      interaction: 'Listening & interaction',
      delivery: 'Delivery'
    };
    const totals = {};
    const counts = {};
    Object.keys(labels).forEach((key) => { totals[key] = 0; counts[key] = 0; });
    state.turns.forEach((turn) => {
      Object.entries(turn.feedback.scores || {}).forEach(([key, value]) => {
        const contextual = key === 'opinion'
          ? turn.type === 'opinion' || turn.kind === 'ambush'
          : key === 'vocabulary'
            ? turn.type === 'vocabulary' || (turn.feedback.usedVocabulary || []).length > 0
            : key === 'interaction'
              ? turn.kind === 'ambush'
              : true;
        if (key in totals && contextual) { totals[key] += Number(value) || 0; counts[key] += 1; }
      });
    });
    const rubric = {};
    Object.keys(labels).forEach((key) => {
      const raw = counts[key] ? totals[key] / counts[key] : 1;
      const score = clampScore(raw);
      rubric[key] = { label: labels[key], score, note: rubricNote(key, score) };
    });
    const overall = Object.values(rubric).reduce((sum, item) => sum + item.score, 0) / Object.keys(rubric).length;
    const weakest = Object.entries(rubric).sort((a, b) => a[1].score - b[1].score).slice(0, 3);
    const entries = selectedSet().passages.slice(0, passageLimit()).flatMap((passage) => passage.vocabulary);
    const targets = [...new Set(entries.map((entry) => entry[0]))];
    const used = [...new Set(state.turns.flatMap((turn) => turn.feedback.usedVocabulary || []))];
    return {
      overall,
      summary: overall >= 3.4
        ? 'You can explain ideas clearly under pressure. The next step is to make every answer precise, evidence-based, and responsive to the group.'
        : overall >= 2.7
          ? 'Your understanding is visible. A consistent claim–evidence–explanation frame will make your answers sound calmer and more convincing.'
          : 'You have useful ideas, but the listener needs a clearer structure. Build short complete answers before adding speed or difficult vocabulary.',
      rubric,
      priorities: weakest.map(([key]) => priorityFor(key)),
      vocabulary: {
        entries,
        targets,
        used,
        note: used.length ? `You used ${used.length} target word${used.length === 1 ? '' : 's'} while speaking.` : 'You understood the topic, but no target vocabulary appeared in the transcript yet.',
        next: 'Choose three words. Say the meaning, one synonym, and a new sentence aloud before the next mock interview.'
      },
      roadmap: roadmapFor(weakest.map(([key]) => key))
    };
  }

  function rubricNote(key, score) {
    const high = {
      comprehension: 'Main ideas and key events stay accurate.', evidence: 'Claims connect to passage details.', organization: 'Ideas arrive in a listener-friendly order.', opinion: 'Views include reasons and text links.', vocabulary: 'Word meaning is explained and applied.', interaction: 'Peer ideas are named and extended.', delivery: 'Responses are complete and controlled.'
    };
    const low = {
      comprehension: 'State the central idea before details.', evidence: 'Point to one exact fact or event.', organization: 'Use claim, detail, and closing.', opinion: 'Finish “I think… because…”.', vocabulary: 'Explain context, then use the word.', interaction: 'Name the peer’s idea before yours.', delivery: 'Finish one sentence at a time.'
    };
    return score >= 3 ? high[key] : low[key];
  }

  function priorityFor(key) {
    const map = {
      comprehension: { title: 'One-breath main idea', action: 'Begin every response with one sentence that names who or what the passage is mainly about.', drill: '20 seconds: “This passage is mainly about…”' },
      evidence: { title: 'Evidence anchor', action: 'After your claim, attach one fact or event using “For example, the passage says…”', drill: 'Underline two details, close the page, recall both.' },
      organization: { title: 'Three-step answer', action: 'Use claim → detail → meaning. Stop after the third step instead of circling the same idea.', drill: 'Record a 30-second answer with exactly three parts.' },
      opinion: { title: 'Position with a reason', action: 'Say whether you agree, then explain why the idea matters beyond the story.', drill: 'Practice both sides of one question.' },
      vocabulary: { title: 'Context-to-use vocabulary', action: 'Explain the clue that reveals a word’s meaning and use the word in a different situation.', drill: 'Meaning → clue → new sentence for five words.' },
      interaction: { title: 'Listen–link–add', action: 'Repeat the peer’s main point fairly, show your position, then contribute one new idea.', drill: '“Mina thinks… I agree/disagree because… I would add…”' },
      delivery: { title: 'Calm complete sentences', action: 'Pause for one beat, speak in short sentences, and end each thought before beginning another.', drill: 'Three 25-second answers with eye contact.' }
    };
    return map[key];
  }

  function roadmapFor(weakest) {
    const focus = weakest.map((key) => skillName(key)).join(', ');
    return [
      { title: 'Memory snapshot', task: 'Read for 60 seconds, cover the text, and state the main idea plus two details.' },
      { title: 'Summary frame', task: 'Give one nonfiction and one fiction or fable summary in 30 seconds each.' },
      { title: 'Vocabulary defense', task: 'Explain five words through context clues and use each in a new sentence.' },
      { title: 'Follow-up ladder', task: 'Answer one question, then handle three rounds of “Why?”, “Which detail?”, and “What if?”' },
      { title: 'Peer listening', task: 'Listen to a family member’s answer and respond with listen–link–add.' },
      { title: 'Target repair', task: `Spend ten minutes on the current priorities: ${focus}.` },
      { title: 'Full room rehearsal', task: 'Run two timed passages in a four-person role-play with the paper removed.' }
    ];
  }

  function cleanText(value, max) {
    return typeof value === 'string' ? value.replace(/[<>]/g, '').trim().slice(0, max) : '';
  }

  function escapeRegex(value) {
    return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function cacheRead() {
    try {
      const value = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (_) {
      return {};
    }
  }

  function cacheWrite(cache) {
    try {
      const entries = Object.entries(cache).slice(-80);
      localStorage.setItem(CACHE_KEY, JSON.stringify(Object.fromEntries(entries)));
    } catch (_) { /* local coaching still works */ }
  }

  function hashText(value) {
    let hash = 5381;
    const text = String(value || '');
    for (let index = 0; index < text.length; index += 1) hash = ((hash << 5) + hash) ^ text.charCodeAt(index);
    return (hash >>> 0).toString(36);
  }

  async function requestTurnCoach(passage, item, answer, localFeedback) {
    const key = hashText(`${passage.id}|${item.prompt}|${answer.toLowerCase().replace(/\s+/g, ' ').trim()}`);
    const cache = cacheRead();
    if (cache[key]) return cache[key];
    const priorTurns = state.turns.filter((turn) => turn.passageId === passage.id).slice(-3).map((turn) => ({ question: turn.question, answer: turn.answer }));
    const payload = {
      mode: 'turn',
      passage: {
        id: passage.id,
        title: passage.title,
        genre: passage.genre,
        text: passage.paragraphs.join('\n\n'),
        vocabulary: passage.vocabulary.map((entry) => entry[0])
      },
      question: item.prompt,
      answer,
      questionType: item.type,
      peerName: item.peerName || '',
      priorTurns,
      localScores: localFeedback.scores
    };
    const result = await callCoach(payload);
    if (result) {
      cache[key] = result;
      cacheWrite(cache);
    }
    return result;
  }

  async function requestFinalCoach(localReport) {
    if (state.turns.length < 2) return null;
    const payload = {
      mode: 'report',
      set: { label: selectedSet().label, theme: selectedSet().theme },
      passages: selectedSet().passages.slice(0, passageLimit()).map((passage) => ({
        title: passage.title,
        genre: passage.genre,
        text: passage.paragraphs.join('\n\n'),
        vocabulary: passage.vocabulary.map((entry) => entry[0])
      })),
      turns: state.turns.slice(-14).map((turn) => ({
        passageTitle: turn.passageTitle,
        genre: turn.genre,
        type: turn.type,
        question: turn.question,
        answer: turn.answer,
        localScores: turn.feedback.scores
      })),
      localRubric: Object.fromEntries(Object.entries(localReport.rubric).map(([key, value]) => [key, value.score]))
    };
    return callCoach(payload);
  }

  async function callCoach(payload) {
    if (!window.fetch || location.protocol === 'file:') return null;
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), COACH_TIMEOUT_MS);
    try {
      state.apiCalls += 1;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: API_KEY
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      if (!response.ok) return null;
      const data = await response.json();
      return data && typeof data === 'object' ? data : null;
    } catch (_) {
      return null;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  function mergeReport(local, remote) {
    const report = { ...local };
    const summary = cleanText(remote.summary, 600);
    if (summary) report.summary = summary;
    if (Array.isArray(remote.priorities) && remote.priorities.length >= 3) {
      report.priorities = remote.priorities.slice(0, 3).map((item, index) => ({
        title: cleanText(item.title, 90) || local.priorities[index].title,
        action: cleanText(item.action, 360) || local.priorities[index].action,
        drill: cleanText(item.drill, 220) || local.priorities[index].drill
      }));
    }
    if (Array.isArray(remote.roadmap) && remote.roadmap.length === 7) {
      report.roadmap = remote.roadmap.map((item, index) => ({
        title: cleanText(item.title, 80) || local.roadmap[index].title,
        task: cleanText(item.task, 300) || local.roadmap[index].task
      }));
    }
    if (Array.isArray(remote.turnFeedback)) {
      remote.turnFeedback.forEach((item) => {
        const index = Number(item.turnIndex);
        const turn = state.turns[index];
        if (!Number.isInteger(index) || !turn || !item || typeof item !== 'object') return;
        turn.feedback = mergeFeedback(turn.feedback, item);
      });
    }
    return report;
  }

  function saveSession(report) {
    try {
      const sessions = JSON.parse(localStorage.getItem(SESSION_KEY) || '[]');
      const next = Array.isArray(sessions) ? sessions : [];
      next.unshift({
        completedAt: new Date().toISOString(),
        setId: selectedSet().id,
        mode: state.sessionMode,
        overall: report.overall,
        rubric: report.rubric,
        turns: state.turns
      });
      localStorage.setItem(SESSION_KEY, JSON.stringify(next.slice(0, 5)));
    } catch (_) { /* report remains visible */ }
  }

  const MALE_ENGLISH_VOICE = /\b(male|guy|davis|david|daniel|aaron|alex|arthur|brian|eddy|fred|jorge|joey|justin|matthew|reed|rishi|ryan|tony)\b/i;
  const FEMALE_ENGLISH_VOICE = /\b(female|aria|ava|allison|emma|jenny|karen|moira|samantha|serena|susan|tessa|victoria|zira)\b/i;

  function voiceLabel(voice) {
    return `${voice && voice.name || ''} ${voice && voice.voiceURI || ''}`;
  }

  function chooseEnglishVoice(voices, preferredPattern, excludedPattern, excludedVoice) {
    const english = voices.filter((voice) => /^en[-_]/i.test(voice.lang || ''));
    const available = english.filter((voice) => voice !== excludedVoice);
    return available.find((voice) => preferredPattern.test(voiceLabel(voice)))
      || available.find((voice) => !excludedPattern.test(voiceLabel(voice)))
      || available[0]
      || excludedVoice
      || null;
  }

  function speakSequence(lines, role) {
    stopSpeech();
    if (document.hidden || !('speechSynthesis' in window) || !Array.isArray(lines) || !lines.length) return;
    if (audioChannel) audioChannel.postMessage('take-audio-focus');
    const run = ++speechRun;
    const voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
    const teacherVoice = chooseEnglishVoice(voices, MALE_ENGLISH_VOICE, FEMALE_ENGLISH_VOICE, null);
    const peerVoice = chooseEnglishVoice(voices, FEMALE_ENGLISH_VOICE, MALE_ENGLISH_VOICE, teacherVoice);
    const queue = lines.slice();
    if (typeof window.speechSynthesis.resume === 'function') window.speechSynthesis.resume();
    const next = () => {
      if (run !== speechRun || !queue.length) return;
      const entry = queue.shift();
      const activeRole = entry && typeof entry === 'object' ? entry.role || role : role;
      const spokenText = entry && typeof entry === 'object' ? entry.text : entry;
      const utterance = new SpeechSynthesisUtterance(String(spokenText || ''));
      utterance.lang = 'en-US';
      utterance.rate = activeRole === 'peer' ? 0.94 : 0.9;
      utterance.pitch = activeRole === 'peer' ? 1.08 : 0.95;
      utterance.volume = 1;
      utterance.voice = activeRole === 'peer' ? peerVoice : teacherVoice;
      utterance.onend = next;
      utterance.onerror = next;
      window.speechSynthesis.speak(utterance);
    };
    next();
  }

  function stopSpeech() {
    speechRun += 1;
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }

  function resetSession(keepSet) {
    clearInterval(timer);
    timer = null;
    cancelActiveRecording();
    if (recognition) {
      try { recognition.abort(); } catch (_) { /* no-op */ }
      recognition = null;
    }
    stopSpeech();
    const setIndex = keepSet ? state.setIndex : (state.setIndex + 1) % sets.length;
    Object.assign(state, {
      stage: 'lobby', entered: false, setIndex, passageIndex: 0, readingStarted: false,
      secondsLeft: READ_SECONDS, queue: [], questionIndex: 0, answerDraft: '', turns: [],
      passageNotes: {}, adaptiveUsed: {}, peerHeard: false, listening: false, transcribing: false,
      recordingSeconds: 0, busy: false,
      notice: '', report: null, printMode: '', apiStatus: 'idle', apiCalls: 0, startedAt: 0
    });
    render();
    window.scrollTo({ top: 0 });
  }

  app.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button || button.disabled) return;
    const action = button.dataset.action;
    if (action === 'seat') { state.seat = Number(button.dataset.seat) || 1; render(); }
    else if (action === 'mode') { state.sessionMode = button.dataset.mode === 'quick' ? 'quick' : 'full'; render(); }
    else if (action === 'preview-print') { state.printMode = 'materials'; state.stage = 'print-preview'; render(); }
    else if (action === 'close-print-preview') { state.printMode = ''; state.stage = 'lobby'; render(); }
    else if (action === 'print-materials') { state.printMode = 'materials'; document.body.dataset.printMode = 'materials'; window.print(); }
    else if (action === 'print-report') {
      state.printMode = 'report';
      document.body.dataset.printMode = 'report';
      document.querySelectorAll('.correction-item').forEach((item) => { item.open = true; });
      window.print();
    }
    else if (action === 'enter-room') enterRoom();
    else if (action === 'prepare-reading') prepareReading();
    else if (action === 'start-reading') startReading();
    else if (action === 'finish-reading') collectPassage();
    else if (action === 'begin-interview') beginInterview();
    else if (action === 'hear-peer') hearPeer();
    else if (action === 'repeat-peer') repeatPeer();
    else if (action === 'after-peer') afterPeer();
    else if (action === 'start-mic') startMic();
    else if (action === 'stop-mic') stopMic();
    else if (action === 'repeat-question') speakQuestion(currentQueueItem());
    else if (action === 'submit-answer') submitAnswer();
    else if (action === 'next-passage') nextPassage();
    else if (action === 'restart') resetSession(false);
    else if (action === 'retry-set') resetSession(true);
  });

  app.addEventListener('input', (event) => {
    if (event.target.dataset.field === 'studentName') state.studentName = event.target.value.slice(0, 20);
    if (event.target.dataset.field === 'answerDraft') {
      state.answerDraft = event.target.value.slice(0, 900);
      const stats = document.querySelector('.answer-stats span');
      if (stats) stats.textContent = `${wordCount(state.answerDraft)} words`;
    }
  });

  app.addEventListener('change', (event) => {
    if (event.target.dataset.field === 'setIndex') {
      state.setIndex = Math.max(0, Math.min(sets.length - 1, Number(event.target.value) || 0));
      render();
    }
    if (event.target.dataset.field === 'coachMode') {
      state.coachMode = event.target.checked ? 'deep' : 'economy';
      render();
    }
  });

  window.addEventListener('beforeunload', () => {
    clearInterval(timer);
    cancelActiveRecording();
    stopSpeech();
    if (recognition) {
      try { recognition.abort(); } catch (_) { /* no-op */ }
    }
    if (audioChannel) audioChannel.close();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopSpeech();
  });

  window.addEventListener('afterprint', () => {
    if (state.stage !== 'print-preview') {
      state.printMode = '';
      document.body.dataset.printMode = '';
    }
  });

  if (new URLSearchParams(location.search).has('test')) {
    window.__ALPHA_PREP_TEST__ = {
      state,
      expireReading: collectPassage,
      setStage(stage) { state.stage = stage; render(); },
      render,
      buildLocalReport,
      checkTranscriber
    };
  }

  render();
  void checkTranscriber();
})();
