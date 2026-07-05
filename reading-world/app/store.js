/* Storage adapter (demo: local only).
 * 앱은 이 인터페이스만 사용한다. 나중에 통합 관리(서버/GitHub/Firestore)가 정리되면
 * 같은 인터페이스로 RemoteStore를 만들어 window.Store 에 갈아끼우면 되고,
 * main.js(앱 로직)는 한 줄도 바꾸지 않는다.
 *
 *   Store.listStudents()        -> [{id,name,createdAt}]
 *   Store.createStudent(name)   -> {id,name,createdAt}
 *   Store.removeStudent(id)
 *   Store.load(id)              -> savedState | null
 *   Store.save(id, data)        -> (fire-and-forget)
 *   Store.getCurrentId()/setCurrentId(id)
 *   Store.exportStudent(id)     -> {student, data}     (백업 꺼내오기용)
 *   Store.importStudent(obj)    -> {id,...}            (백업 복원용)
 */
window.Store = (function () {
  'use strict';
  const NS = 'leteon';
  const REG = NS + ':students';
  const CUR = NS + ':current';
  const dataKey = (id) => `${NS}:student:${id}:cars:lesson1`;

  const readJSON = (k, fallback) => {
    try { const v = localStorage.getItem(k); return v == null ? fallback : JSON.parse(v); }
    catch (e) { return fallback; }
  };
  const reg = () => { const v = readJSON(REG, []); return Array.isArray(v) ? v : []; };
  const setReg = (list) => localStorage.setItem(REG, JSON.stringify(list));
  const newId = () => 's_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  return {
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

    touch(id) {
      const list = reg(); const s = list.find((x) => x.id === id);
      if (s) { s.lastAt = Date.now(); setReg(list); }
    },

    load(id) { return readJSON(dataKey(id), null); },

    save(id, data) {
      if (!id) return;
      try { localStorage.setItem(dataKey(id), JSON.stringify(data)); } catch (e) {}
      this.touch(id);
    },

    getCurrentId() { try { return localStorage.getItem(CUR) || null; } catch (e) { return null; } },
    setCurrentId(id) { try { id ? localStorage.setItem(CUR, id) : localStorage.removeItem(CUR); } catch (e) {} },

    exportStudent(id) {
      const s = reg().find((x) => x.id === id) || null;
      return { v: 1, student: s, data: this.load(id) };
    },
    importStudent(obj) {
      if (!obj || !obj.student) return null;
      const s = { id: newId(), name: String(obj.student.name || 'Reader').slice(0, 20), createdAt: Date.now(), lastAt: Date.now() };
      const list = reg(); list.push(s); setReg(list);
      if (obj.data) this.save(s.id, obj.data);
      return s;
    },
  };
})();
