(function(){
  'use strict';

  // Optional bridge for licensed CARS originals kept in Supabase. It lets
  // original_questions stay backwards-compatible as a plain array, while Level D
  // may use { items:[...], meta:{...} } to carry private layout/visual metadata.
  // Nothing from the licensed source is bundled in public Git by this file.
  if (!window.Store || typeof window.Store.pullOriginal !== 'function') return;

  window.CARS_SOURCE_META = window.CARS_SOURCE_META || {};
  const basePullOriginal = window.Store.pullOriginal.bind(window.Store);

  window.Store.pullOriginal = function(bookId, lessonId){
    return basePullOriginal(bookId, lessonId).then(function(row){
      if (!row) return row;
      const raw = row.questions;
      let items = raw;
      let meta = null;

      if (raw && !Array.isArray(raw) && typeof raw === 'object') {
        if (Array.isArray(raw.items)) items = raw.items;
        else if (Array.isArray(raw.questions)) items = raw.questions;
        meta = raw.meta || raw.layout || null;
      }

      // Level D is always announced, with or without meta. A few Level B/C lessons
      // now carry meta too, for the sequence questions whose boxes cannot be
      // written as a plain sentence; those are announced only when meta is there.
      if (bookId === 'cars-level-d' || meta) {
        window.CARS_SOURCE_META[lessonId] = meta || {};
        window.dispatchEvent(new CustomEvent('cars-source-meta', {
          detail: { bookId: bookId, lessonId: lessonId }
        }));
      }

      return { passage: row.passage, questions: items };
    });
  };
})();
