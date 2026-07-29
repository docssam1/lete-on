/* =========================================================================
   문제 풀 (problem pool)

   Every game shows a child five problems per level. Until now those five were
   the only five that existed, so "🔁 한번 더 연습하기" replayed the exact same
   puzzles in the exact same order — the child was remembering answers, not
   working them out.

   Each level now carries a POOL of problems. This module hands the engine one
   session's worth (five) out of that pool, and steps to a fresh, non-overlapping
   five every time the child asks to practise the level again. With a pool of
   twenty that is four full rounds before anything repeats.

   The engine is untouched: it still receives an array of five problems on
   `level.problems` and neither knows nor cares where they came from.

   How the step happens: "한번 더 연습하기" reloads the game with
   `?level=N&practice=1`. Seeing that, this module advances the saved cursor for
   level N only — the levels the child is not playing keep theirs — and stores it
   so the progression survives closing the app.

   The first five entries of every pool are the original hand-authored problems,
   so a child's first visit to a level is always the version we tested.
   ========================================================================= */

function readCursor(storeKey) {
  try {
    var raw = localStorage.getItem(storeKey);
    var value = Number(raw);
    return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
  } catch (e) {
    return 0;
  }
}

function writeCursor(storeKey, value) {
  try {
    localStorage.setItem(storeKey, String(value));
  } catch (e) {
    /* private mode — the child just replays this round's set */
  }
}

function urlFlags() {
  try {
    var params = new URL(window.location.href).searchParams;
    return {
      practice: params.get("practice") === "1",
      level: Number(params.get("level")) || 0
    };
  } catch (e) {
    return { practice: false, level: 0 };
  }
}

/**
 * Pick this session's problems for one level.
 *
 * @param {string} game   game folder name, e.g. "count-heights"
 * @param {number} level  1-based level number
 * @param {Array}  pool   every problem authored or generated for the level
 * @param {number} size   how many the engine should see (default 5)
 */
export function sessionProblems(game, level, pool, size) {
  var count = size || 5;
  if (!Array.isArray(pool) || pool.length <= count) return pool || [];

  var rounds = Math.floor(pool.length / count);
  var storeKey = "gfield-pool-" + game + "-" + level;
  var cursor = readCursor(storeKey);
  var flags = urlFlags();

  if (flags.practice && flags.level === level) {
    cursor += 1;
    writeCursor(storeKey, cursor);
  }

  var start = (cursor % rounds) * count;
  return pool.slice(start, start + count);
}
