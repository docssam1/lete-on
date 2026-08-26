/* Storage adapter — demo: localStorage first, best-effort Supabase sync.
 *
 * 앱(main.js)은 이 인터페이스만 사용한다. 저장 위치가 바뀌어도 main.js는 안 고친다.
 *   Store.listStudents()        -> [{id,name,createdAt}]   (이 기기에 등록된 학생)
 *   Store.createStudent(name)   -> {id,name,...}
 *   Store.removeStudent(id)
 *   Store.load(id)              -> savedState | null        (로컬, 즉시)
 *   Store.pull(id)              -> Promise<savedState|null> (원격에서 조회)
 *   Store.save(id, data)        -> 로컬 저장 + 보호된 원격 동기화(디바운스, 실패해도 무시)
 *   Store.getCurrentId()/setCurrentId(id)
 *   Store.exportStudent(id) / importStudent(obj)           (수동 백업)
 *
 * 원격은 학생별 비밀 동기화 토큰으로 보호된 백업·수집용이다.
 * 네트워크가 없거나 실패해도 로컬로 계속 동작한다(데모가 죽지 않음).
 */
window.Store = (function () {
  'use strict';

  // 공개(publishable)용 값 — 브라우저에 노출되어도 안전. 쓰기는 보호된 RPC만 허용한다.
  const SUPABASE = {
    url: 'https://fgahqumaldheqettmvqg.supabase.co',
    key: 'sb_publishable_OsjJG92BLMaZrc2jTClt0g_ecdTtf_I',
  };
  const remoteOn = () => !!(SUPABASE.url && SUPABASE.key);
  const hdr = () => ({ apikey: SUPABASE.key, Authorization: 'Bearer ' + SUPABASE.key, 'Content-Type': 'application/json' });

  const NS = 'leteon';
  const REG = NS + ':students';
  const CUR = NS + ':current';
  const dataKey = (id) => `${NS}:student:${id}:cars:lesson1`;

  const readJSON = (k, fb) => { try { const v = localStorage.getItem(k); return v == null ? fb : JSON.parse(v); } catch (e) { return fb; } };
  const reg = () => { const v = readJSON(REG, []); return Array.isArray(v) ? v : []; };
  const setReg = (list) => { try { localStorage.setItem(REG, JSON.stringify(list)); } catch (e) {} };
  const randomHex = (bytes) => {
    const out = new Uint8Array(bytes);
    if (globalThis.crypto && typeof globalThis.crypto.getRandomValues === 'function') {
      globalThis.crypto.getRandomValues(out);
    } else {
      for (let i = 0; i < out.length; i += 1) out[i] = Math.floor(Math.random() * 256);
    }
    return Array.from(out, (v) => v.toString(16).padStart(2, '0')).join('');
  };
  const newId = () => 's_' + randomHex(12);
  const newSyncToken = () => randomHex(32);
  const publicStudent = (student) => {
    if (!student) return student;
    const copy = { ...student };
    delete copy.syncToken;
    return copy;
  };
  const syncTokenOf = (id) => {
    const list = reg();
    const student = list.find((item) => item.id === id);
    if (!student) return '';
    if (!student.syncToken || String(student.syncToken).length < 32) {
      student.syncToken = newSyncToken();
      setReg(list);
    }
    return student.syncToken;
  };
  const nameOf = (id) => { const s = reg().find((x) => x.id === id); return s ? s.name : 'Reader'; };

  // ---- remote (best-effort) ----
  // Derive the analytics columns from the saved profile instead of hardcoding them,
  // so book_id/lesson_id reflect the student's current book and most-recently-studied
  // lesson. The full progress still lives in `data`; these columns are for reporting.
  function remoteMeta(data) {
    const bookId = (data && data.currentBookId) || 'cars-level-b';
    const lessons = (data && data.lessons) || {};
    let lessonId = null, best = -1;
    Object.keys(lessons).forEach((k) => { const t = (lessons[k] && lessons[k].updatedAt) || 0; if (t > best) { best = t; lessonId = k; } });
    return { bookId, lessonId: lessonId || 'lesson1' };
  }
  function remoteUpsert(id) {
    if (!remoteOn()) return;
    const token = syncTokenOf(id);
    if (!token) return;
    const data = readJSON(dataKey(id), {});
    const meta = remoteMeta(data);
    const row = {
      p_student_id: id,
      p_token: token,
      p_name: nameOf(id),
      p_book_id: meta.bookId,
      p_lesson_id: meta.lessonId,
      p_data: data,
    };
    fetch(`${SUPABASE.url}/rest/v1/rpc/reader_sync_save`, {
      method: 'POST',
      headers: hdr(),
      body: JSON.stringify(row),
    }).catch(() => {});
  }
  const pending = {};
  function scheduleRemote(id) {
    clearTimeout(pending[id]);
    pending[id] = setTimeout(() => remoteUpsert(id), 1200);
  }
  function remoteGet(id) {
    if (!remoteOn()) return Promise.resolve(null);
    const token = syncTokenOf(id);
    if (!token) return Promise.resolve(null);
    return fetch(`${SUPABASE.url}/rest/v1/rpc/reader_sync_pull`, {
      method: 'POST',
      headers: hdr(),
      body: JSON.stringify({ p_student_id: id, p_token: token }),
    })
      .then((r) => (r.ok ? r.json() : null))
      .then((result) => (result && result.data ? result.data : null))
      .catch(() => null);
  }

  return {
    remoteEnabled: remoteOn,

    listStudents() { return reg().slice().sort((a, b) => (b.lastAt || b.createdAt || 0) - (a.lastAt || a.createdAt || 0)).map(publicStudent); },

    createStudent(name) {
      const clean = String(name || '').trim().replace(/\s+/g, ' ').slice(0, 20) || 'Reader';
      const s = { id: newId(), name: clean, createdAt: Date.now(), lastAt: Date.now(), syncToken: newSyncToken() };
      const list = reg(); list.push(s); setReg(list);
      return publicStudent(s);
    },

    removeStudent(id) {
      setReg(reg().filter((s) => s.id !== id));
      try { localStorage.removeItem(dataKey(id)); } catch (e) {}
      if (this.getCurrentId() === id) this.setCurrentId(null);
    },

    touch(id) { const list = reg(); const s = list.find((x) => x.id === id); if (s) { s.lastAt = Date.now(); setReg(list); } },

    load(id) { return readJSON(dataKey(id), null); },
    pull(id) { return remoteGet(id); },

    // Fetch a lesson's licensed original passage/questions from the private table.
    pullOriginal(bookId, lessonId) {
      if (!remoteOn()) return Promise.resolve(null);
      const url = `${SUPABASE.url}/rest/v1/lesson_content?book_id=eq.${encodeURIComponent(bookId)}&lesson_id=eq.${encodeURIComponent(lessonId)}&select=original_passage,original_questions`;
      return fetch(url, { headers: hdr() })
        .then((r) => (r.ok ? r.json() : null))
        .then((rows) => (rows && rows[0] ? { passage: rows[0].original_passage, questions: rows[0].original_questions } : null))
        .catch(() => null);
    },

    // Fetch a Library book's licensed page text (never bundled in git).
    pullLibraryPages(bookId) {
      if (!remoteOn()) return Promise.resolve(null);
      const url = `${SUPABASE.url}/rest/v1/library_books?book_id=eq.${encodeURIComponent(bookId)}&select=pages`;
      return fetch(url, { headers: hdr() })
        .then((r) => (r.ok ? r.json() : null))
        .then((rows) => (rows && rows[0] ? rows[0].pages : null))
        .catch(() => null);
    },

    // ---- notice board (public announcements) ----
    pullNotices() {
      if (!remoteOn()) return Promise.resolve(null);
      const url = `${SUPABASE.url}/rest/v1/notices?select=id,created_at,title,body,pinned,author&order=pinned.desc,created_at.desc&limit=50`;
      return fetch(url, { headers: hdr() })
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);
    },
    postNotice(n) {
      if (!remoteOn() || !n || !n.title) return Promise.resolve(false);
      return fetch(`${SUPABASE.url}/rest/v1/notices`, {
        method: 'POST',
        headers: { ...hdr(), Prefer: 'return=representation' },
        body: JSON.stringify({ title: String(n.title).slice(0, 120), body: String(n.body || '').slice(0, 2000), author: String(n.author || 'Gfield').slice(0, 40), pinned: !!n.pinned }),
      }).then((r) => (r.ok ? r.json() : false)).catch(() => false);
    },

    save(id, data) {
      if (!id) return;
      try { localStorage.setItem(dataKey(id), JSON.stringify(data)); } catch (e) {}
      this.touch(id);
      scheduleRemote(id);
    },

    getCurrentId() { try { return localStorage.getItem(CUR) || null; } catch (e) { return null; } },
    setCurrentId(id) { try { id ? localStorage.setItem(CUR, id) : localStorage.removeItem(CUR); } catch (e) {} },

    // A backup carries the sync token so importing it on another device can resume
    // the same protected remote profile. Treat exported backups like a password.
    exportStudent(id) { const s = reg().find((x) => x.id === id) || null; if (s) syncTokenOf(id); return { v: 2, student: reg().find((x) => x.id === id) || null, data: this.load(id) }; },
    importStudent(obj) {
      if (!obj || !obj.student) return null;
      const existing = reg();
      const sourceId = String(obj.student.id || '');
      const sourceToken = String(obj.student.syncToken || '');
      const canResume = /^s_[a-z0-9]{12,80}$/.test(sourceId) && sourceToken.length >= 32 && !existing.some((item) => item.id === sourceId);
      const s = {
        id: canResume ? sourceId : newId(),
        name: String(obj.student.name || 'Reader').slice(0, 20),
        createdAt: Date.now(),
        lastAt: Date.now(),
        syncToken: canResume ? sourceToken : newSyncToken(),
      };
      const list = existing; list.push(s); setReg(list);
      if (obj.data) this.save(s.id, obj.data);
      return publicStudent(s);
    },
  };
})();
