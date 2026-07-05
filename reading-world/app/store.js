/* Storage adapter — demo: localStorage first, best-effort Supabase sync.
 *
 * 앱(main.js)은 이 인터페이스만 사용한다. 저장 위치가 바뀌어도 main.js는 안 고친다.
 *   Store.listStudents()        -> [{id,name,createdAt}]   (이 기기에 등록된 학생)
 *   Store.createStudent(name)   -> {id,name,...}
 *   Store.removeStudent(id)
 *   Store.load(id)              -> savedState | null        (로컬, 즉시)
 *   Store.pull(id)              -> Promise<savedState|null> (원격에서 조회)
 *   Store.save(id, data)        -> 로컬 저장 + 원격 upsert(디바운스, 실패해도 무시)
 *   Store.getCurrentId()/setCurrentId(id)
 *   Store.exportStudent(id) / importStudent(obj)           (수동 백업)
 *
 * 원격은 "선생님이 데이터를 한곳에서 볼 수 있게" 하는 수집용이다.
 * 네트워크가 없거나 실패해도 로컬로 계속 동작한다(데모가 죽지 않음).
 */
window.Store = (function () {
  'use strict';

  // 공개(publishable)용 값 — 브라우저에 노출되어도 안전. 쓰기 권한은 테이블 정책(RLS)으로 제어.
  const SUPABASE = {
    url: 'https://fgahqumaldheqettmvqg.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnYWhxdW1hbGRoZXFldHRtdnFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NjAzNDcsImV4cCI6MjA5NzIzNjM0N30.iUXLFteDc_xIp_Xj506BKTxnZRYMObmTYQ2Dgh9RAqs',
    table: 'readers',
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
  const newId = () => 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  const nameOf = (id) => { const s = reg().find((x) => x.id === id); return s ? s.name : 'Reader'; };

  // ---- remote (best-effort) ----
  function remoteUpsert(id) {
    if (!remoteOn()) return;
    const row = { student_id: id, name: nameOf(id), book_id: 'cars-level-b', lesson_id: 'lesson1', data: readJSON(dataKey(id), {}) };
    fetch(`${SUPABASE.url}/rest/v1/${SUPABASE.table}`, {
      method: 'POST',
      headers: { ...hdr(), Prefer: 'resolution=merge-duplicates,return=minimal' },
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
    const url = `${SUPABASE.url}/rest/v1/${SUPABASE.table}?student_id=eq.${encodeURIComponent(id)}&select=data,updated_at`;
    return fetch(url, { headers: hdr() })
      .then((r) => (r.ok ? r.json() : null))
      .then((rows) => (rows && rows[0] ? rows[0].data : null))
      .catch(() => null);
  }

  return {
    remoteEnabled: remoteOn,

    listStudents() { return reg().slice().sort((a, b) => (b.lastAt || b.createdAt || 0) - (a.lastAt || a.createdAt || 0)); },

    createStudent(name) {
      const clean = String(name || '').trim().replace(/\s+/g, ' ').slice(0, 20) || 'Reader';
      const s = { id: newId(), name: clean, createdAt: Date.now(), lastAt: Date.now() };
      const list = reg(); list.push(s); setReg(list);
      return s;
    },

    removeStudent(id) {
      setReg(reg().filter((s) => s.id !== id));
      try { localStorage.removeItem(dataKey(id)); } catch (e) {}
      if (this.getCurrentId() === id) this.setCurrentId(null);
    },

    touch(id) { const list = reg(); const s = list.find((x) => x.id === id); if (s) { s.lastAt = Date.now(); setReg(list); } },

    load(id) { return readJSON(dataKey(id), null); },
    pull(id) { return remoteGet(id); },

    save(id, data) {
      if (!id) return;
      try { localStorage.setItem(dataKey(id), JSON.stringify(data)); } catch (e) {}
      this.touch(id);
      scheduleRemote(id);
    },

    getCurrentId() { try { return localStorage.getItem(CUR) || null; } catch (e) { return null; } },
    setCurrentId(id) { try { id ? localStorage.setItem(CUR, id) : localStorage.removeItem(CUR); } catch (e) {} },

    exportStudent(id) { const s = reg().find((x) => x.id === id) || null; return { v: 1, student: s, data: this.load(id) }; },
    importStudent(obj) {
      if (!obj || !obj.student) return null;
      const s = { id: newId(), name: String(obj.student.name || 'Reader').slice(0, 20), createdAt: Date.now(), lastAt: Date.now() };
      const list = reg(); list.push(s); setReg(list);
      if (obj.data) this.save(s.id, obj.data);
      return s;
    },
  };
})();
