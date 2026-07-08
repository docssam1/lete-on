// Library catalog — series + book metadata only. Licensed page text lives in
// Supabase (table `library_books`, book_id -> pages jsonb), never here.
window.LIBRARY_CATALOG = {
  series: [
    { id: 'magic-tree-house', name: { ko: '매직 트리 하우스', en: 'Magic Tree House', zh: '神奇树屋' }, author: 'Mary Pope Osborne', color: '#2f8a5c' },
  ],
  // ar/rg/wc sourced from the publisher's official AR/R-G reference table for the
  // series (AR = Accelerated Reader level, R/G = grade+level band, W/C = word count).
  books: [
    {
      id: 'library-mth1', seriesId: 'magic-tree-house', order: 1,
      title: 'Dinosaurs Before Dark',
      illustrator: 'Sal Murdocca',
      ar: 2.6, rg: '2C', wc: 4737,
      totalPages: 48,
      audio: 'tts',
    },
  ],
};
