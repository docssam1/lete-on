#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const PREMIER_DIR = path.resolve(__dirname, "..");
const FILES = {
  exams: path.join(PREMIER_DIR, "exams.js"),
  index: path.join(PREMIER_DIR, "index.html"),
  viewer: path.join(PREMIER_DIR, "viewer.html"),
  styles: path.join(PREMIER_DIR, "styles.css"),
  baseRenderer: path.join(PREMIER_DIR, "renderers.js"),
  round1Renderer: path.join(PREMIER_DIR, "renderers-utilization-1.js"),
  round2Renderer: path.join(PREMIER_DIR, "renderers-utilization-2.js"),
  deployWorkflow: path.resolve(PREMIER_DIR, "..", ".github", "workflows", "deploy-pages.yml")
};

const failures = [];
let passed = 0;

function verify(label, check) {
  try {
    check();
    passed += 1;
    console.log(`PASS  ${label}`);
  } catch (error) {
    failures.push({ label, error });
    console.error(`FAIL  ${label}\n      ${error.message}`);
  }
}

function readRequired(file) {
  assert.ok(fs.existsSync(file), `필수 파일이 없습니다: ${path.relative(PREMIER_DIR, file)}`);
  return fs.readFileSync(file, "utf8");
}

function range(from, to) {
  return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

function permutations(values, visit) {
  const items = values.slice();
  function walk(index) {
    if (index === items.length) {
      visit(items);
      return;
    }
    for (let next = index; next < items.length; next += 1) {
      [items[index], items[next]] = [items[next], items[index]];
      walk(index + 1);
      [items[index], items[next]] = [items[next], items[index]];
    }
  }
  walk(0);
}

function stripTags(markup) {
  return String(markup).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function loadExams(source) {
  const sandbox = { window: {} };
  vm.runInNewContext(source, sandbox, { filename: FILES.exams });
  assert.ok(sandbox.window.PREMIER_EXAMS, "window.PREMIER_EXAMS가 만들어지지 않았습니다.");
  return sandbox.window.PREMIER_EXAMS;
}

function rendererRegistry(file) {
  const source = readRequired(file);
  const registry = new Map();
  const api = {
    register(id, renderer) {
      assert.ok(id, `${path.basename(file)}에 빈 그림 ID가 있습니다.`);
      assert.equal(typeof renderer, "function", `${id} 렌더러가 함수가 아닙니다.`);
      assert.ok(!registry.has(String(id)), `${id} 렌더러가 중복 등록되었습니다.`);
      registry.set(String(id), renderer);
    },
    svg(viewBox, body, className) {
      return `<svg class="${className || ""}" viewBox="${viewBox}">${body}</svg>`;
    },
    line(x1, y1, x2, y2, extra) {
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${extra || ""}/>`;
    },
    text(x, y, value, extra) {
      return `<text x="${x}" y="${y}" ${extra || ""}>${value}</text>`;
    }
  };
  const sandbox = { window: { PremierFigures: api }, console };
  vm.runInNewContext(source, sandbox, { filename: file });

  const literalIds = Array.from(
    source.matchAll(/(?:PremierFigures|Figures)\.register\s*\(\s*["'`]([^"'`]+)["'`]/g),
    (match) => match[1]
  );
  assert.equal(new Set(literalIds).size, literalIds.length, `${path.basename(file)}의 정적 그림 ID가 중복됩니다.`);
  return { registry, source, literalIds };
}

function question(exams, examId, number) {
  const exam = exams[examId];
  assert.ok(exam, `${examId} 회차가 없습니다.`);
  const found = exam.questions.find((item) => item.number === number);
  assert.ok(found, `${examId} ${number}번이 없습니다.`);
  return found;
}

const examsSource = readRequired(FILES.exams);
const exams = loadExams(examsSource);
const examIds = Object.keys(exams).sort();

verify("활용 1·2회만 등록되어 있다", () => {
  assert.deepEqual(examIds, ["utilization-1", "utilization-2"]);
});

verify("각 회차에 1~20번이 정확히 한 번씩 있다", () => {
  Object.values(exams).forEach((exam) => {
    assert.equal(exam.questions.length, 20, `${exam.id} 문항 수가 20이 아닙니다.`);
    const numbers = Array.from(exam.questions, (item) => item.number);
    assert.deepEqual([...numbers].sort((a, b) => a - b), range(1, 20), `${exam.id} 문항 번호가 빠지거나 중복됩니다.`);
    assert.equal(new Set(numbers).size, 20, `${exam.id} 문항 번호가 중복됩니다.`);
  });
});

verify("페이지 맵은 원본 시험지 1~4쪽만 사용하고 1~20번을 한 번씩 배치한다", () => {
  Object.values(exams).forEach((exam) => {
    assert.equal(exam.pages.length, 4, `${exam.id}에 원본 5쪽 이후가 연결되었습니다.`);
    const mapped = Array.from(exam.pages).flatMap((page, index) => {
      assert.ok(index < 4, `${exam.id}에 5쪽 이후 페이지가 있습니다.`);
      ["left", "right"].forEach((column) => assert.ok(Array.isArray(page[column]), `${exam.id} ${index + 1}쪽 ${column} 열이 배열이 아닙니다.`));
      Object.entries(page).forEach(([key, value]) => {
        if (/source.*page/i.test(key) && typeof value === "number") {
          assert.ok(value <= 4, `${exam.id}가 원본 ${value}쪽을 참조합니다.`);
        }
      });
      return page.left.concat(page.right);
    });
    assert.deepEqual(mapped.slice().sort((a, b) => a - b), range(1, 20), `${exam.id} 페이지 맵이 1~20번을 정확히 덮지 않습니다.`);
    assert.equal(new Set(mapped).size, 20, `${exam.id} 페이지 맵에 중복 문항이 있습니다.`);
  });
});

verify("시험 데이터에 정답·해설·풀이 값이 없다", () => {
  const forbiddenKey = /^(?:answer|answers|answerKey|correctAnswer|expectedAnswer|solution|solutions|explanation|explanations|rationale|정답|해설|풀이)$/i;
  function walk(value, cursor) {
    if (!value || typeof value !== "object") return;
    Object.entries(value).forEach(([key, child]) => {
      assert.ok(!forbiddenKey.test(key), `금지된 데이터 키가 있습니다: ${cursor}.${key}`);
      walk(child, `${cursor}.${key}`);
    });
  }
  walk(exams, "PREMIER_EXAMS");
});

verify("서재·뷰어에 정답/해설 표시 기능이 없다", () => {
  const sources = [FILES.index, FILES.viewer, FILES.baseRenderer].map(readRequired);
  const forbiddenIdentifier = /(?:show|toggle|open)(?:Answer|Solution|Explanation)|answerKey|correctAnswer|solutionPanel|explanationPanel|정답\s*보기|해설\s*보기|풀이\s*보기/i;
  sources.forEach((source, index) => {
    assert.doesNotMatch(source, forbiddenIdentifier, `${path.basename([FILES.index, FILES.viewer, FILES.baseRenderer][index])}에 정답/해설 UI 코드가 있습니다.`);
    for (const match of source.matchAll(/<(button|a|summary)\b[^>]*>([\s\S]*?)<\/\1>/gi)) {
      assert.doesNotMatch(stripTags(match[2]), /정답|해설|풀이|answer|solution|explanation/i, "정답/해설을 여는 조작 요소가 있습니다.");
    }
  });
});

verify("모바일과 A3 인쇄 레이아웃이 서로 분리되고 배포 대상에 포함된다", () => {
  const styles = readRequired(FILES.styles);
  const deploy = readRequired(FILES.deployWorkflow);
  assert.match(styles, /@media\s+screen\s+and\s+\(max-width:\s*900px\)/, "모바일 규칙이 print에도 적용될 수 있습니다.");
  assert.match(styles, /@page\s*\{[^}]*size:\s*A3\s+portrait/s, "A3 세로 인쇄 크기가 없습니다.");
  assert.match(styles, /@media\s+print\s*\{[\s\S]*?\.exam-page\s*\{[^}]*height:\s*420mm/s, "인쇄 한 쪽 높이가 A3 420mm로 고정되지 않았습니다.");
  assert.match(styles, /@media\s+print\s*\{[\s\S]*?\.paper-grid\s*\{[^}]*height:\s*348mm/s, "인쇄 2단 문제 영역 높이가 고정되지 않았습니다.");
  assert.match(styles, /@media\s+print\s*\{[\s\S]*?\.answer-space\s*\{[^}]*display:\s*none/s, "인쇄에서 빈 답란 때문에 문항이 다음 쪽으로 밀릴 수 있습니다.");
  assert.match(deploy, /-\s*'premier\/\*\*'/, "premier 변경이 Pages 배포 조건에 없습니다.");
  assert.match(deploy, /cp\s+-R\s+premier\/\.\s+_site\/premier\//, "premier 폴더가 Pages 결과물에 복사되지 않습니다.");
});

let round1;
let round2;
verify("두 회차 그림 파일을 VM에서 안전하게 등록할 수 있다", () => {
  round1 = rendererRegistry(FILES.round1Renderer);
  round2 = rendererRegistry(FILES.round2Renderer);
  const forbiddenContent = /(?:정답|해설|풀이)\s*(?:[:：]|보기|확인)|\b(?:answerKey|correctAnswer|solution|explanation)\b/i;
  assert.doesNotMatch(round1.source, forbiddenContent, "1회 그림 파일에 정답·해설 데이터가 있습니다.");
  assert.doesNotMatch(round2.source, forbiddenContent, "2회 그림 파일에 정답·해설 데이터가 있습니다.");
});

verify("모든 figure ID가 해당 회차 그림 파일에 등록되고 실제 마크업을 만든다", () => {
  assert.ok(round1 && round2, "그림 파일 등록 검사가 먼저 통과해야 합니다.");
  [
    [exams["utilization-1"], round1, "u1-"],
    [exams["utilization-2"], round2, "u2-"]
  ].forEach(([exam, renderer, prefix]) => {
    const referenced = exam.questions.filter((item) => item.figure).map((item) => String(item.figure));
    assert.equal(new Set(referenced).size, referenced.length, `${exam.id}가 같은 figure ID를 여러 문항에 공유합니다.`);
    referenced.forEach((id) => {
      assert.ok(id.startsWith(prefix), `${exam.id}의 ${id}가 다른 회차 접두사를 사용합니다.`);
      const draw = renderer.registry.get(id);
      assert.equal(typeof draw, "function", `${id}가 ${path.basename(prefix === "u1-" ? FILES.round1Renderer : FILES.round2Renderer)}에 등록되지 않았습니다.`);
      const item = exam.questions.find((candidate) => candidate.figure === id);
      const markup = draw({}, item);
      assert.equal(typeof markup, "string", `${id}가 문자열 마크업을 반환하지 않습니다.`);
      assert.ok(markup.trim().length > 0, `${id}가 빈 그림을 반환합니다.`);
      assert.doesNotMatch(markup, /그림\s*준비\s*중|(?:정답|해설|풀이)\s*(?:[:：]|보기|확인)/i, `${id}에 준비 중 또는 정답·해설 내용이 남았습니다.`);
    });
  });
});

verify("1회 1번은 '변이 4개인 조각'으로 묻는다", () => {
  const item = question(exams, "utilization-1", 1);
  assert.match(item.prompt, /변이\s*4개인\s*조각/);
  assert.doesNotMatch(item.prompt, /사각형/);
});

verify("1회 16번은 정사각형 7개로 구성된다", () => {
  const item = question(exams, "utilization-1", 16);
  assert.match(item.prompt, /정사각형\s*7개/);
  assert.doesNotMatch(item.prompt, /정사각형\s*9개/);
  assert.ok(round1, "1회 그림 파일이 먼저 로드되어야 합니다.");
  const markup = round1.registry.get("u1-q16")({}, item);
  const cells = Array.from(markup.matchAll(/<rect\b[^>]*\bx="([^"]+)"[^>]*\by="([^"]+)"[^>]*\bwidth="([^"]+)"[^>]*\bheight="([^"]+)"/g),
    (match) => match.slice(1).join(":"));
  assert.equal(new Set(cells).size, 7, "u1-q16 그림의 서로 다른 바탕 정사각형 수가 7이 아닙니다.");
});

verify("1회 12번은 붙인 색종이의 압정을 공유 꼭짓점마다 한 번만 그린다", () => {
  assert.ok(round1, "1회 그림 파일이 먼저 로드되어야 합니다.");
  const markup = round1.registry.get("u1-q12")({}, question(exams, "utilization-1", 12));
  const pinCounts = Array.from(markup.matchAll(/<g\b[^>]*>([\s\S]*?)<\/g>/g), (match) => (match[1].match(/<circle\b/g) || []).length);
  assert.deepEqual(pinCounts.slice(0, 3), [4, 6, 8], "1·2·3장을 이은 그림의 압정 수가 4·6·8개가 아닙니다.");
});

verify("1회 19번의 질문 기호 ㉠이 그림에도 정확히 표시된다", () => {
  assert.ok(round1, "1회 그림 파일이 먼저 로드되어야 합니다.");
  const item = question(exams, "utilization-1", 19);
  assert.match(item.prompt, /㉠/);
  const markup = round1.registry.get("u1-q19")({}, item);
  assert.match(markup, />㉠<\/text>/);
  assert.match(markup, />㉡<\/text>/);
});

verify("2회 3번의 모든 완성에서 곱셈식 결과는 6으로 불변이다", () => {
  const item = question(exams, "utilization-2", 3);
  assert.match(item.prompt, /1부터\s*9까지/);
  const completions = [];
  permutations(range(1, 9), (p) => {
    if (p[0] - p[1] === p[2] && p[3] * p[4] === p[5] && p[6] + p[7] === p[8]) {
      completions.push(p.slice());
    }
  });
  assert.equal(completions.length, 16, "세 식을 만족하는 위치별 완성 수가 예상한 16개가 아닙니다.");
  assert.deepEqual(Array.from(new Set(completions.map((p) => p[5]))), [6]);
});

verify("2회 7번은 지정된 더하기 성냥을 옮길 때 참인 식이 하나다", () => {
  const item = question(exams, "utilization-2", 7);
  assert.match(item.prompt, /더하기\s*기호의\s*성냥개비\s*한\s*개만/);
  assert.match(item.prompt, /오른쪽\s*수\s*4는\s*그대로/);
  const candidates = [
    { moveTo: "첫 번째 수", expression: "5−3=4", truth: 5 - 3 === 4 },
    { moveTo: "두 번째 수", expression: "4−4=4", truth: 4 - 4 === 4 },
    { moveTo: "등호", expression: "4−3≠4", truth: 4 - 3 !== 4 },
    { moveTo: "연산자", expression: "4+3=4", truth: 4 + 3 === 4 }
  ].filter((candidate) => candidate.truth);
  assert.deepEqual(candidates, [{ moveTo: "등호", expression: "4−3≠4", truth: true }]);
});

verify("2회 9번은 1~9 전수검사에서 a=6인 한 배치만 남는다", () => {
  const item = question(exams, "utilization-2", 9);
  assert.match(item.prompt, /합이\s*11/);
  const completions = [];
  permutations([2, 3, 4, 5, 6, 7], (p) => {
    const regions = [8, p[0], p[1], 1, p[2], p[3], p[4], p[5], 9];
    const sums = [
      regions[0] + regions[1],
      regions[1] + regions[2] + regions[3],
      regions[3] + regions[4] + regions[5],
      regions[5] + regions[6] + regions[7],
      regions[7] + regions[8]
    ];
    if (sums.every((sum) => sum === 11)) completions.push(regions);
  });
  assert.equal(completions.length, 1, "겹친 원 수 배열의 해가 하나가 아닙니다.");
  assert.equal(completions[0][4], 6, "a가 6이 아닙니다.");
});

verify("2회 10번은 4×5 전수 타일링에서 W 조각만 항상 남는다", () => {
  const item = question(exams, "utilization-2", 10);
  assert.match(item.prompt, /20개인\s*직사각형/);
  const pieces = {
    U: [[0, 0], [1, 0], [0, 1], [0, 2], [1, 2]],
    F: [[1, 0], [0, 1], [1, 1], [1, 2], [2, 2]],
    L: [[0, 0], [1, 0], [1, 1], [1, 2], [1, 3]],
    W: [[1, 0], [2, 0], [0, 1], [1, 1], [0, 2]],
    V: [[2, 0], [2, 1], [0, 2], [1, 2], [2, 2]]
  };
  function normalize(shape) {
    const minX = Math.min(...shape.map(([x]) => x));
    const minY = Math.min(...shape.map(([, y]) => y));
    return shape.map(([x, y]) => [x - minX, y - minY]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
  }
  function shapeKey(shape) { return normalize(shape).map(([x, y]) => `${x},${y}`).join(";"); }
  function orientations(shape) {
    const found = new Map();
    [false, true].forEach((flip) => {
      for (let turn = 0; turn < 4; turn += 1) {
        const transformed = shape.map(([originalX, originalY]) => {
          let x = flip ? -originalX : originalX;
          let y = originalY;
          for (let index = 0; index < turn; index += 1) [x, y] = [-y, x];
          return [x, y];
        });
        found.set(shapeKey(transformed), normalize(transformed));
      }
    });
    return [...found.values()];
  }
  const width = 5;
  const height = 4;
  const allPlacements = Object.fromEntries(Object.entries(pieces).map(([name, shape]) => {
    const placements = [];
    orientations(shape).forEach((oriented) => {
      const maxX = Math.max(...oriented.map(([x]) => x));
      const maxY = Math.max(...oriented.map(([, y]) => y));
      for (let oy = 0; oy + maxY < height; oy += 1) for (let ox = 0; ox + maxX < width; ox += 1) {
        placements.push(oriented.map(([x, y]) => (oy + y) * width + ox + x));
      }
    });
    return [name, placements];
  }));
  const solutions = [];
  Object.keys(pieces).forEach((omitted) => {
    const names = Object.keys(pieces).filter((name) => name !== omitted);
    function search(index, occupied) {
      if (index === names.length) {
        if (occupied.size === width * height) solutions.push({ omitted });
        return;
      }
      const name = names[index];
      allPlacements[name].forEach((placement) => {
        if (placement.some((cell) => occupied.has(cell))) return;
        const next = new Set(occupied);
        placement.forEach((cell) => next.add(cell));
        search(index + 1, next);
      });
    }
    search(0, new Set());
  });
  assert.ok(solutions.length > 0, "4×5 직사각형을 채우는 배치가 없습니다.");
  assert.deepEqual([...new Set(solutions.map((solution) => solution.omitted))], ["W"]);
});

verify("2회 14번은 빈 원 배치가 유일하다", () => {
  const item = question(exams, "utilization-2", 14);
  assert.match(item.prompt, /6부터\s*10까지/);
  const completions = [];
  permutations([6, 7, 8, 9, 10], (blanks) => {
    const ring = [blanks[0], 1, blanks[1], 2, blanks[2], 3, blanks[3], 4, blanks[4], 5];
    const sideSums = [0, 2, 4, 6, 8].map((start) => ring[start] + ring[start + 1] + ring[(start + 2) % ring.length]);
    if (new Set(sideSums).size === 1) completions.push({ blanks: blanks.slice(), sum: sideSums[0] });
  });
  assert.deepEqual(completions, [{ blanks: [8, 10, 7, 9, 6], sum: 19 }]);
});

verify("2회 15번은 추가 조건 아래 성씨 배치가 하나다", () => {
  const item = question(exams, "utilization-2", 15);
  assert.match(item.prompt, /성은\s*서로\s*다릅니다/);
  assert.match(item.prompt, /아버지의\s*성을\s*따릅니다/);
  assert.ok(round2, "2회 그림 파일이 먼저 로드되어야 합니다.");
  const clueText = stripTags(round2.registry.get("u2-q15")({}, item));
  assert.match(clueText, /세영.*외삼촌.*성.*다/);

  const completions = [];
  permutations(["천", "오", "이", "김"], (surnames) => {
    const [jaemyeong, seyeong, gyuseong, jieun] = surnames;
    if (jaemyeong !== "김") return;
    if (seyeong === "이") return;
    if (jieun === "이" || jieun === "천") return;
    completions.push({ 재명: jaemyeong, 세영: seyeong, 규성: gyuseong, 지은: jieun });
  });
  assert.deepEqual(completions, [{ 재명: "김", 세영: "천", 규성: "이", 지은: "오" }]);
});

verify("2회 19번은 두 속도를 정확히 합쳐 6일이다", () => {
  const item = question(exams, "utilization-2", 19);
  assert.match(item.prompt, /8일/);
  assert.match(item.prompt, /24일/);
  const commonWork = 24;
  const perDay = commonWork / 8 + commonWork / 24;
  assert.equal(perDay, 4);
  assert.equal(commonWork / perDay, 6);
  assert.equal(1 / 8 + 1 / 24, 1 / 6);
});

verify("2회 20번은 32가지 부호 배치 중 정확히 3가지다", () => {
  const item = question(exams, "utilization-2", 20);
  assert.match(item.prompt, /\+\s*또는\s*[−-]/);
  assert.match(item.prompt, /9/);
  const tail = [5, 4, 3, 2, 1];
  const expressions = [];
  for (let mask = 0; mask < 2 ** tail.length; mask += 1) {
    let value = 6;
    let expression = "6";
    tail.forEach((number, index) => {
      const plus = ((mask >> index) & 1) === 0;
      value += plus ? number : -number;
      expression += `${plus ? "+" : "-"}${number}`;
    });
    if (value === 9) expressions.push(expression);
  }
  assert.deepEqual(expressions, [
    "6+5-4+3-2+1",
    "6-5+4+3+2-1",
    "6+5+4-3-2-1"
  ]);
});

if (failures.length > 0) {
  console.error(`\n${failures.length}개 검사가 실패했고 ${passed}개가 통과했습니다.`);
  process.exitCode = 1;
} else {
  console.log(`\n전체 ${passed}개 검사 통과: 프리미어 활용 1·2회 뷰어 데이터가 배포 기준을 만족합니다.`);
}
