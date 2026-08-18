// reading-world 교재들의 words 배열([en, 영영뜻, 한글뜻, 중국어])을 모아
// vocab-quiz/books-data.js 를 생성한다. 새 교재가 늘면 BOOKS에 한 줄 추가.
// 실행: node vocab-quiz/build-books.mjs   (저장소 루트에서)
import { createRequire } from 'module';
import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const dataDir = join(here, '..', 'reading-world', 'data');
const require = createRequire(import.meta.url);

const BOOKS = [
  { id: 'cars-b', title: 'CARS Level B', level: '기초', icon: '📕', hue: 8,
    lessons: Array.from({length: 10}, (_, i) => 'lesson' + (i + 1)) },
  { id: 'cars-c', title: 'CARS Level C', level: '초중급', icon: '📗', hue: 140,
    lessons: Array.from({length: 10}, (_, i) => 'lc' + (i + 1)) },
  { id: 'cars-d', title: 'CARS Level D', level: '중급', icon: '📔', hue: 350,
    lessons: Array.from({length: 15}, (_, i) => 'cd' + (i + 1)) },
  { id: 'bricks-1', title: 'Bricks Reading 250 L1', level: '기초', icon: '🧱', hue: 20,
    lessons: Array.from({length: 14}, (_, i) => 'br' + (i + 1)) },
  { id: 'rp1', title: 'Reading Prime 1', level: '초중급', icon: '📘', hue: 210,
    lessons: Array.from({length: 7}, (_, i) => 'rp' + (i + 1)) },
  { id: 'ws3', title: 'WonderSkills Adv 3', level: '중급', icon: '📙', hue: 32,
    lessons: Array.from({length: 12}, (_, i) => 'ws' + (i + 1)) },
  { id: 'sl4', title: 'Subject Link 4', level: '중상급', icon: '📓', hue: 268,
    lessons: Array.from({length: 16}, (_, i) => 'sl' + (i + 1)) },
];

function loadLesson(id){
  global.window = {};
  // cd2~cd15는 cdN-data.js 파일이 CARS_D_REGISTER(list)를 호출하는 방식
  let registered = null;
  global.window.CARS_D_REGISTER = list => { registered = (list || [])[0] || null; };
  const candidates = [id + '.js', id + '-data.js'];
  let loaded = false;
  for (const f of candidates){
    try { require(join(dataDir, f)); loaded = true; break; } catch (e) {}
  }
  if (!loaded) return null;
  const L = (global.window.LESSONS || {})[id] || registered || global.window.LESSON1;
  return L && Array.isArray(L.words) && L.words.length ? L : null;
}

function toWord(row){
  const [en, def, koStr] = row;
  const koShow = String(koStr || '').trim();
  const ko = koShow.split(/[,·]/).map(s => s.trim()).filter(Boolean);
  return { en: String(en).trim(), def: String(def || '').trim(), ko, koShow };
}

const out = [];
for (const b of BOOKS){
  const chapters = [];
  for (const id of b.lessons){
    const L = loadLesson(id);
    if (!L) { console.warn('skip (no words):', id); continue; }
    chapters.push({
      id,
      label: L.title ? String(L.title) : id,
      words: L.words.map(toWord),
    });
  }
  if (chapters.length){
    out.push({ id: b.id, title: b.title, level: b.level, icon: b.icon, hue: b.hue, chapters });
    console.log(b.id, '→', chapters.length, 'chapters,',
      chapters.reduce((n, c) => n + c.words.length, 0), 'words');
  }
}

const body = '// 자동 생성 파일 — 수정하지 말 것. 원본: reading-world/data/*.js\n'
  + '// 재생성: node vocab-quiz/build-books.mjs\n'
  + 'window.VOCAB_BOOKS = ' + JSON.stringify(out, null, 1) + ';\n';
writeFileSync(join(here, 'books-data.js'), body);
console.log('books-data.js written:', out.length, 'books');
