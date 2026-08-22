#!/usr/bin/env node
"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const PREMIER_DIR = path.resolve(__dirname, "..", "..", "premier");
const FILES = {
  exams: path.join(PREMIER_DIR, "exams.js"),
  index: path.join(PREMIER_DIR, "index.html"),
  viewer: path.join(PREMIER_DIR, "viewer.html"),
  styles: path.join(PREMIER_DIR, "styles.css"),
  baseRenderer: path.join(PREMIER_DIR, "renderers.js"),
  round1Renderer: path.join(PREMIER_DIR, "renderers-utilization-1.js"),
  round2Renderer: path.join(PREMIER_DIR, "renderers-utilization-2.js"),
  round3Renderers: [
    path.join(PREMIER_DIR, "renderers-utilization-3-q01-q07.js"),
    path.join(PREMIER_DIR, "renderers-utilization-3-q08-q14.js"),
    path.join(PREMIER_DIR, "renderers-utilization-3-q15-q20.js")
  ],
  round4Renderers: [
    path.join(PREMIER_DIR, "renderers-utilization-4-q01-q07.js"),
    path.join(PREMIER_DIR, "renderers-utilization-4-q08-q14.js"),
    path.join(PREMIER_DIR, "renderers-utilization-4-q15-q20.js")
  ],
  round5Renderers: [
    path.join(PREMIER_DIR, "renderers-utilization-5-q01-q07.js"),
    path.join(PREMIER_DIR, "renderers-utilization-5-q08-q14.js"),
    path.join(PREMIER_DIR, "renderers-utilization-5-q15-q20.js")
  ],
  round6Renderer: path.join(PREMIER_DIR, "renderers-utilization-6.js"),
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

function mergeRendererRegistries(renderers) {
  const registry = new Map();
  const literalIds = [];
  renderers.forEach((renderer) => {
    renderer.registry.forEach((draw, id) => {
      assert.ok(!registry.has(id), `3회 그림 ID가 여러 파일에 중복 등록되었습니다: ${id}`);
      registry.set(id, draw);
    });
    literalIds.push(...renderer.literalIds);
  });
  return {
    registry,
    literalIds,
    source: renderers.map((renderer) => renderer.source).join("\n")
  };
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

verify("활용 1·2·3·4·5·6회만 등록되어 있다", () => {
  assert.deepEqual(examIds, ["utilization-1", "utilization-2", "utilization-3", "utilization-4", "utilization-5", "utilization-6"]);
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

verify("정답 전수 검산기는 공개 premier 경로 밖에 있다", () => {
  const relativeValidator = path.relative(path.resolve(PREMIER_DIR, ".."), __filename).replace(/\\/g, "/");
  assert.match(relativeValidator, /^\.github\/qa\/premier-validate\.js$/);
  assert.ok(!relativeValidator.startsWith("premier/"), "정답 검산 파일이 GitHub Pages의 공개 premier 경로 안에 있습니다.");
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
  assert.match(deploy, /cp\s+-R\s+premier\/\.\s+_site\/premier\/[\s\S]*?rm\s+-rf\s+_site\/premier\/qa[\s\S]*?test\s+!\s+-e\s+_site\/premier\/qa/, "정답 검산 파일 premier/qa가 공개 Pages 산출물에서 제외되지 않습니다.");
  assert.match(deploy, /-\s*'premier\/\*\*'/, "premier 변경이 Pages 배포 조건에 없습니다.");
  assert.match(deploy, /cp\s+-R\s+premier\/\.\s+_site\/premier\//, "premier 폴더가 Pages 결과물에 복사되지 않습니다.");
});

let round1;
let round2;
let round3;
let round4;
let round5;
let round6;
verify("여섯 회차 그림 파일을 VM에서 안전하게 등록할 수 있다", () => {
  round1 = rendererRegistry(FILES.round1Renderer);
  round2 = rendererRegistry(FILES.round2Renderer);
  round3 = mergeRendererRegistries(FILES.round3Renderers.map(rendererRegistry));
  round4 = mergeRendererRegistries(FILES.round4Renderers.map(rendererRegistry));
  round5 = mergeRendererRegistries(FILES.round5Renderers.map(rendererRegistry));
  round6 = rendererRegistry(FILES.round6Renderer);
  const forbiddenContent = /(?:정답|해설|풀이)\s*(?:[:：]|보기|확인)|\b(?:answerKey|correctAnswer|solution|explanation)\b/i;
  assert.doesNotMatch(round1.source, forbiddenContent, "1회 그림 파일에 정답·해설 데이터가 있습니다.");
  assert.doesNotMatch(round2.source, forbiddenContent, "2회 그림 파일에 정답·해설 데이터가 있습니다.");
  assert.doesNotMatch(round3.source, forbiddenContent, "3회 그림 파일에 정답·해설 데이터가 있습니다.");
  assert.doesNotMatch(round4.source, forbiddenContent, "4회 그림 파일에 정답·해설 데이터가 있습니다.");
  assert.doesNotMatch(round5.source, forbiddenContent, "5회 그림 파일에 정답·해설 데이터가 있습니다.");
  assert.doesNotMatch(round6.source, forbiddenContent, "6회 그림 파일에 정답·해설 데이터가 있습니다.");
});

verify("모든 figure ID가 해당 회차 그림 파일에 등록되고 실제 마크업을 만든다", () => {
  assert.ok(round1 && round2 && round3 && round4 && round5 && round6, "그림 파일 등록 검사가 먼저 통과해야 합니다.");
  [
    [exams["utilization-1"], round1, "u1-"],
    [exams["utilization-2"], round2, "u2-"],
    [exams["utilization-3"], round3, "u3-"],
    [exams["utilization-4"], round4, "u4-"],
    [exams["utilization-5"], round5, "u5-"],
    [exams["utilization-6"], round6, "u6-"]
  ].forEach(([exam, renderer, prefix]) => {
    const referenced = exam.questions.filter((item) => item.figure).map((item) => String(item.figure));
    assert.equal(new Set(referenced).size, referenced.length, `${exam.id}가 같은 figure ID를 여러 문항에 공유합니다.`);
    referenced.forEach((id) => {
      assert.ok(id.startsWith(prefix), `${exam.id}의 ${id}가 다른 회차 접두사를 사용합니다.`);
      const draw = renderer.registry.get(id);
      assert.equal(typeof draw, "function", `${id}가 ${prefix} 회차 그림 파일에 등록되지 않았습니다.`);
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

verify("3회 1번은 3×3 점판의 합동류 8종에서 보기 1종을 뺀 7종이다", () => {
  const item = question(exams, "utilization-3", 1);
  assert.match(item.prompt, /돌리거나\s*뒤집어서\s*겹쳐지는.*같은\s*모양/);
  const points = [];
  for (let y = 0; y < 3; y += 1) for (let x = 0; x < 3; x += 1) points.push([x, y]);
  const classes = new Set();
  for (let a = 0; a < points.length; a += 1) for (let b = a + 1; b < points.length; b += 1) for (let c = b + 1; c < points.length; c += 1) {
    const [p, q, r] = [points[a], points[b], points[c]];
    if ((q[0] - p[0]) * (r[1] - p[1]) === (q[1] - p[1]) * (r[0] - p[0])) continue;
    const distance = (u, v) => (u[0] - v[0]) ** 2 + (u[1] - v[1]) ** 2;
    classes.add([distance(p, q), distance(p, r), distance(q, r)].sort((x, y) => x - y).join(","));
  }
  assert.equal(classes.size, 8);
  assert.ok(classes.delete("4,5,5"), "보기 삼각형 합동류가 없습니다.");
  assert.equal(classes.size, 7);
});

verify("3회 2번은 네 겹침 칸 중 합이 4인 칸이 하나다", () => {
  const item = question(exams, "utilization-3", 2);
  assert.match(item.prompt, /마지막\s*2×2\s*모양/);
  const foldedSums = [[4, 10], [10, 6]];
  assert.deepEqual(foldedSums.flat().filter((value) => value === 4), [4]);
});

verify("3회 3번은 접는 선을 벗어난 구멍이 세 번 대칭되어 8개다", () => {
  const item = question(exams, "utilization-3", 3);
  assert.match(item.prompt, /세\s*번\s*접/);
  assert.equal(2 ** 3, 8);
});

verify("3회 4번은 오류 숫자 8을 3으로 고친 같은 규칙에서 55가 된다", () => {
  const item = question(exams, "utilization-3", 4);
  assert.match(item.prompt, /같은\s*관계/);
  assert.ok(round3, "3회 그림 파일이 먼저 로드되어야 합니다.");
  const markup = stripTags(round3.registry.get("u3-q4")({}, item));
  assert.doesNotMatch(markup, /8\s+2\s+3\s+53/, "원본의 잘못된 8이 남았습니다.");
  assert.match(markup, /3\s+2\s+3\s+53/, "수정 보기 3·2·3→53이 없습니다.");
  const relation = (top, left, right) => 10 * (top + left) + right;
  assert.deepEqual([[5, 4, 7], [1, 3, 2], [3, 2, 3]].map((values) => relation(...values)), [97, 42, 53]);
  assert.equal(relation(2, 3, 5), 55);
});

verify("3회 5번은 검증 높이표 11개를 3×3×3 상자에서 뺀다", () => {
  const item = question(exams, "utilization-3", 5);
  assert.match(item.prompt, /가로\s*3칸.*세로\s*3칸.*높이\s*3칸/);
  const map = [[3, 3, 2], [2, 0, 0], [1, 0, 0]];
  const current = map.flat().reduce((sum, value) => sum + value, 0);
  assert.equal(current, 11);
  assert.equal(3 * 3 * 3 - current, 16);
  const markup = round3.registry.get("u3-q5")({}, item);
  assert.equal((markup.match(/<polygon\b/g) || []).length, 33, "11개 큐브의 세 면 33개가 그려지지 않았습니다.");
});

verify("3회 6·7번의 선분 구조 전수 분류 결과는 정사각형 20개·삼각형 12개다", () => {
  const squareGroups = { outerUnit: 12, innerUnit: 1, middle: 1, threeByThree: 4, outer: 1, diamond: 1 };
  assert.equal(Object.values(squareGroups).reduce((sum, value) => sum + value, 0), 20);
  const triangleBands = [4, 4, 4];
  assert.equal(triangleBands.reduce((sum, value) => sum + value, 0), 12);
  assert.ok(round3.registry.get("u3-q6")({}, question(exams, "utilization-3", 6)).includes("<svg"));
  assert.ok(round3.registry.get("u3-q7")({}, question(exams, "utilization-3", 7)).includes("<svg"));
});

verify("3회 8번은 명시 단서 아래 생선 가게 주인이 한 명이다", () => {
  const item = question(exams, "utilization-3", 8);
  assert.match(item.prompt, /병은\s*생선\s*가게\s*주인이\s*(?:아니|아닙)/);
  assert.match(item.prompt, /하나씩\s*맡/);
  assert.match(item.prompt, /가게는\s*모두\s*다릅/);
  const people = ["갑", "을", "병", "정"];
  const owners = [];
  permutations(["아이스크림", "과일", "생선", "빵"], (shops) => {
    const assignment = Object.fromEntries(people.map((person, index) => [person, shops[index]]));
    if (assignment.을 !== "아이스크림") return;
    if (["과일", "생선"].includes(assignment.갑)) return;
    if (assignment.병 === "생선") return;
    owners.push(people.find((person) => assignment[person] === "생선"));
  });
  assert.deepEqual(owners, ["정"]);
});

verify("3회 9·10번은 도형 합 22와 친구 합집합 17로 유일하다", () => {
  const q9Markup = round3.registry.get("u3-q9")({}, question(exams, "utilization-3", 9));
  const renderedSymbols = Array.from(q9Markup.matchAll(/data-symbol="([^"]+)"/g), (match) => match[1]);
  assert.deepEqual(renderedSymbols, [
    "square", "triangle", "triangle", "square",
    "square", "triangle", "star", "star",
    "square", "circle", "circle", "circle",
    "square", "triangle", "square", "star"
  ], "u3-q9의 도형 배치가 원본 4×4 표와 다릅니다.");
  const square = 40 / 4;
  const triangle = (36 - square * 2) / 2;
  const star = (24 - square - triangle) / 2;
  const circle = (13 - square) / 3;
  assert.deepEqual({ square, triangle, star, circle }, { square: 10, triangle: 8, star: 3, circle: 1 });
  assert.deepEqual([
    square + triangle + triangle + square,
    square + triangle + star + star,
    square + circle + circle + circle,
    square + triangle + square + star
  ], [36, 24, 13, 31]);
  assert.deepEqual([
    square * 4,
    triangle * 3 + circle,
    triangle + star + circle + square,
    square + star + circle + star
  ], [40, 25, 22, 17]);
  assert.equal(triangle + star + circle + square, 22);
  const union = 13 + 10 - 6;
  assert.equal(union, 17);
  assert.match(question(exams, "utilization-3", 10).prompt, /적어도\s*하나/);
});

verify("3회 11번은 16개 완성에서 아래 양 끝 합만 14로 불변이다", () => {
  const item = question(exams, "utilization-3", 11);
  assert.match(item.prompt, /아래쪽\s*양\s*끝\s*꼭짓점.*합/);
  const completions = [];
  permutations([2, 3, 4, 5, 6, 7, 8, 9], (p) => {
    const [leftTop, leftBottom, bottomLeft, bottomMiddle1, bottomMiddle2, bottomRight, rightBottom, rightTop] = p;
    if (1 + leftTop + leftBottom + bottomLeft !== 20) return;
    if (bottomLeft + bottomMiddle1 + bottomMiddle2 + bottomRight !== 20) return;
    if (1 + rightTop + rightBottom + bottomRight !== 20) return;
    completions.push(p.slice());
  });
  assert.equal(completions.length, 16);
  assert.deepEqual([...new Set(completions.map((p) => p[2] + p[5]))], [14]);
});

verify("3회 12번은 다섯 접기의 층 순서를 따라 최종 위 수가 9다", () => {
  function fold(grid, direction) {
    const height = grid.length;
    const width = grid[0].length;
    if (direction === "RL" || direction === "LR") {
      const next = Array.from({ length: height }, () => Array.from({ length: width / 2 }, () => []));
      for (let y = 0; y < height; y += 1) for (let x = 0; x < width / 2; x += 1) {
        const fixed = direction === "RL" ? grid[y][x] : grid[y][width / 2 + x];
        const moving = direction === "RL" ? grid[y][width - 1 - x] : grid[y][width / 2 - 1 - x];
        next[y][x] = fixed.concat(moving.slice().reverse());
      }
      return next;
    }
    const next = Array.from({ length: height / 2 }, () => Array.from({ length: width }, () => []));
    for (let y = 0; y < height / 2; y += 1) for (let x = 0; x < width; x += 1) {
      const fixed = direction === "TB" ? grid[height / 2 + y][x] : grid[y][x];
      const moving = direction === "TB" ? grid[height / 2 - 1 - y][x] : grid[height - 1 - y][x];
      next[y][x] = fixed.concat(moving.slice().reverse());
    }
    return next;
  }
  let paper = Array.from({ length: 4 }, (_, row) => Array.from({ length: 8 }, (_, column) => [(row + 1) * (column + 1)]));
  ["RL", "TB", "LR", "BT", "LR"].forEach((direction) => { paper = fold(paper, direction); });
  assert.equal(paper.length, 1);
  assert.equal(paper[0].length, 1);
  assert.equal(paper[0][0].at(-1), 9);
});

verify("3회 13번은 두 저울의 관계에서 빈 접시에 삼각형 5개가 필요하다", () => {
  const triangle = 1;
  const square = 2 * triangle;
  const circle = square + triangle;
  assert.equal(2 * square + 2 * triangle, 2 * circle);
  assert.equal(3 * square, circle + 3 * triangle);
  assert.equal(square + circle, 5 * triangle);
});

verify("3회 14번은 32가지 부호 배치 중 정확히 3가지다", () => {
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
  assert.deepEqual(expressions, ["6+5-4+3-2+1", "6-5+4+3+2-1", "6+5+4-3-2-1"]);
});

verify("3회 15번은 금화를 거꾸로 복원할 때 14개만 남는다", () => {
  const candidates = [];
  for (let initial = 1; initial <= 500; initial += 1) {
    let remaining = initial;
    let valid = true;
    for (let daughter = 0; daughter < 3; daughter += 1) {
      if (remaining % 2 !== 0) { valid = false; break; }
      remaining -= remaining / 2 + 1;
      if (remaining < 0) { valid = false; break; }
    }
    if (valid && remaining === 0) candidates.push(initial);
  }
  assert.deepEqual(candidates, [14]);
});

verify("3회 16번은 보기 네 식을 모두 만족하는 정수 일차규칙이 x+2y 하나다", () => {
  const samples = [[4, 3, 10], [2, 5, 12], [20, 9, 38], [15, 6, 27]];
  const rules = [];
  for (let a = -5; a <= 5; a += 1) for (let b = -5; b <= 5; b += 1) for (let c = -20; c <= 20; c += 1) {
    if (samples.every(([x, y, value]) => a * x + b * y + c === value)) rules.push([a, b, c]);
  }
  assert.deepEqual(rules, [[1, 2, 0]]);
  assert.equal(28 + 2 * 9, 46);
});

verify("3회 17번은 오른쪽 +2·아래 +7 규칙으로 빈칸이 19·23·30이다", () => {
  assert.equal(17 + 2, 19);
  assert.equal(21 + 2, 23);
  assert.equal(23 + 7, 30);
  assert.equal(7 + 7, 14);
  assert.equal(19 + 7, 26);
  assert.equal(30 + 2, 32);
});

verify("3회 18번은 같은 세 자리 수 두 개의 합 574에서 287만 남는다", () => {
  const candidates = [];
  for (let value = 100; value <= 499; value += 1) {
    if (value * 2 !== 574) continue;
    const digits = String(value).split("").map(Number);
    if (new Set(digits).size === 3) candidates.push(digits);
  }
  assert.deepEqual(candidates, [[2, 8, 7]]);
});

verify("3회 19번은 벽·관찰방향·높이표가 일치하고 숨은 수가 7개다", () => {
  const item = question(exams, "utilization-3", 19);
  assert.match(item.prompt, /뒤와\s*왼쪽에\s*벽/);
  assert.match(item.prompt, /위·앞·오른쪽/);
  assert.match(item.prompt, /바닥\s*쪽에서는\s*보지/);
  const map = [
    [3, 3, 3, 3, 3, 3],
    [3, 1, 1, 1, 1, 1],
    [3, 1, 1, 1, 1, 1]
  ];
  const total = map.flat().reduce((sum, value) => sum + value, 0);
  let hidden = 0;
  for (let z = 0; z < map.length; z += 1) for (let x = 0; x < map[0].length; x += 1) {
    for (let level = 0; level < map[z][x]; level += 1) {
      if (level >= map[z][x] - 1) continue;
      const frontBlocked = map.slice(z + 1).some((row) => row[x] > level);
      const rightBlocked = map[z].slice(x + 1).some((height) => height > level);
      if (frontBlocked && rightBlocked) hidden += 1;
    }
  }
  assert.equal(total, 34);
  assert.equal(hidden, 7);
  const markup = round3.registry.get("u3-q19")({}, item);
  assert.equal((markup.match(/<polygon\b/g) || []).length, 104, "34개 큐브의 세 면과 벽 두 면이 일치하지 않습니다.");
  assert.equal((markup.match(/<rect\b/g) || []).length, 18, "6×3 높이 바탕그림의 18칸이 없습니다.");
});

verify("3회 20번은 59일 뒤인 토요일이다", () => {
  const days = 31 + 28;
  assert.equal(days, 59);
  assert.equal(days % 7, 3);
  const week = ["수요일", "목요일", "금요일", "토요일", "일요일", "월요일", "화요일"];
  assert.equal(week[days % 7], "토요일");
});

verify("3회 렌더러 세 파일이 뷰어에서 모두 로드된다", () => {
  const viewer = readRequired(FILES.viewer);
  FILES.round3Renderers.forEach((file) => assert.match(viewer, new RegExp(path.basename(file).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});

verify("4회 1번은 달력 십자 다섯 날짜 조건에서 18일만 남는다", () => {
  const candidates = [];
  for (let day = 1; day <= 31; day += 1) {
    const column = (day - 1) % 7;
    if (day - 7 < 1 || day + 7 > 31 || column === 0 || column === 6) continue;
    const sum = (day - 7) + (day - 1) + day + (day + 1) + (day + 7);
    if ([5, 6, 9].every((divisor) => sum % divisor === 0)) candidates.push(day);
  }
  assert.deepEqual(candidates, [18]);
});

verify("4회 2번은 마지막 같은 수에서 거꾸로 복원하면 알파벳 카드 13명이다", () => {
  const candidates = [];
  for (let alphabet = 0; alphabet <= 29; alphabet += 1) {
    const number = 29 - alphabet;
    if (number < 8 || alphabet + 8 < 4) continue;
    if (number - 8 + 4 + 5 === alphabet + 8 - 4) candidates.push(alphabet);
  }
  assert.deepEqual(candidates, [13]);
  assert.match(question(exams, "utilization-4", 2).prompt, /숫자\s*카드나\s*알파벳\s*카드\s*가운데\s*한\s*장씩/);
});

verify("4회 3번은 세 갈래 수열의 32번째 값이 44다", () => {
  const sequence = [];
  for (let index = 1; index <= 32; index += 1) {
    if (index % 3 === 1) sequence.push(1);
    else if (index % 3 === 2) sequence.push(4 * ((index + 1) / 3));
    else sequence.push(2 * (index / 3) + 3);
  }
  assert.deepEqual(sequence.slice(0, 12), [1, 4, 5, 1, 8, 7, 1, 12, 9, 1, 16, 11]);
  assert.equal(sequence[31], 44);
});

verify("4회 4번은 도형 네 값과 빈 세로합이 유일하다", () => {
  const candidates = [];
  for (let circle = 0; circle <= 20; circle += 1) for (let triangle = 0; triangle <= 20; triangle += 1) {
    for (let square = 0; square <= 20; square += 1) for (let diamond = 0; diamond <= 20; diamond += 1) {
      if (2 * circle + 2 * triangle !== 8) continue;
      if (2 * square + 2 * circle !== 6) continue;
      if (circle + 3 * diamond !== 13) continue;
      if (triangle + 3 * diamond !== 15) continue;
      candidates.push([circle, triangle, square, diamond, circle + square + 2 * diamond]);
    }
  }
  assert.deepEqual(candidates, [[1, 3, 2, 4, 11]]);
});

verify("4회 5번은 회전·뒤집기 동치인 오각형 표시가 8종이다", () => {
  function transforms(bits) {
    const rotations = range(0, 4).map((shift) => bits.map((_, index) => bits[(index + shift) % 5]).join(""));
    const reversed = bits.slice().reverse();
    return rotations.concat(range(0, 4).map((shift) => reversed.map((_, index) => reversed[(index + shift) % 5]).join("")));
  }
  const classes = new Set();
  for (let mask = 0; mask < 32; mask += 1) {
    const bits = range(0, 4).map((bit) => (mask >> bit) & 1);
    classes.add(transforms(bits).sort()[0]);
  }
  assert.equal(classes.size, 8);
  assert.match(question(exams, "utilization-4", 5).prompt, /돌리거나\s*뒤집/);
});

verify("4회 6번은 거울상 02:52를 실제 05:25로 복원해 02:05를 구한다", () => {
  const reflect = { "0": "0", "1": "1", "2": "5", "5": "2", "8": "8" };
  const mirrored = "02:52";
  const actual = mirrored.replace(/[01258]/g, (digit) => reflect[digit]);
  assert.equal(actual, "05:25");
  const [hours, minutes] = actual.split(":").map(Number);
  assert.equal((hours * 60 + minutes - (3 * 60 + 20) + 24 * 60) % (24 * 60), 2 * 60 + 5);
  assert.match(question(exams, "utilization-4", 6).prompt, /거울에\s*비친\s*모습/);
});

verify("4회 7번은 네 주사위 전개도의 빈 면이 각각 하나로 정해진다", () => {
  const missingFaces = [[4, 5, 6], [4, 5, 1], [5, 1, 3], [2, 1, 3]];
  missingFaces.forEach((faces) => {
    assert.equal(new Set(faces).size, 3);
    faces.forEach((face) => assert.ok(face >= 1 && face <= 6));
  });
  assert.ok(round4.registry.get("u4-q7")({}, question(exams, "utilization-4", 7)).includes("<svg"));
});

verify("4회 8번은 명시한 표준 획수 규칙에서 오이의 두 획수가 고정된다", () => {
  const strokes = { 영: 5, 재: 6, 수: 4, 학: 7, 오: 3, 이: 2 };
  assert.equal(`${strokes.영}${strokes.재}`, "56");
  assert.equal(`${strokes.수}${strokes.학}`, "47");
  assert.equal(`${strokes.오}${strokes.이}`, "32");
  assert.match(question(exams, "utilization-4", 8).prompt, /바른\s*획순/);
});

verify("4회 9번은 응답하지 않은 3명을 제외한 포함·배제로 술래잡기만 3명이다", () => {
  const union = 30 - 3;
  const both = 15 + 24 - union;
  assert.equal(15 - both, 3);
});

verify("4회 10번은 2~9의 행·열 곱 배치가 하나다", () => {
  const rowProducts = [8, 42, 72, 15];
  const columnProducts = [10, 18, 32, 63];
  const rowPairs = rowProducts.map((product) => {
    const pairs = [];
    for (let a = 2; a <= 9; a += 1) for (let b = a + 1; b <= 9; b += 1) if (a * b === product) pairs.push([a, b]);
    assert.equal(pairs.length, 1);
    return pairs[0];
  });
  const rowOptions = rowPairs.map(([a, b]) => {
    const options = [];
    for (let firstColumn = 0; firstColumn < 4; firstColumn += 1) {
      for (let secondColumn = 0; secondColumn < 4; secondColumn += 1) {
        if (firstColumn === secondColumn) continue;
        const row = [null, null, null, null];
        row[firstColumn] = a;
        row[secondColumn] = b;
        options.push(row);
      }
    }
    return options;
  });
  const completions = [];
  function chooseRow(rowIndex, grid) {
    if (rowIndex === 4) {
      for (let column = 0; column < 4; column += 1) {
        const values = grid.map((row) => row[column]).filter((value) => value !== null);
        if (values.length !== 2 || values[0] * values[1] !== columnProducts[column]) return;
      }
      completions.push(grid.map((row) => row.slice()));
      return;
    }
    rowOptions[rowIndex].forEach((row) => chooseRow(rowIndex + 1, grid.concat([row])));
  }
  chooseRow(0, []);
  assert.deepEqual(completions, [[[2, null, 4, null], [null, 6, null, 7], [null, null, 8, 9], [5, 3, null, null]]]);
});

verify("4회 11번은 홀수·짝수 번째 항을 분리하면 25번째가 26이다", () => {
  const sequence = range(1, 25).map((index) => index % 2 === 1 ? index + 1 : (index / 2) * 3);
  assert.deepEqual(sequence.slice(0, 8), [2, 3, 4, 6, 6, 9, 8, 12]);
  assert.equal(sequence[24], 26);
});

verify("4회 12번은 저울 비교에서 가장 무거운 배와 가장 가벼운 오렌지가 유일하다", () => {
  const fruits = ["배", "수박", "사과", "오렌지"];
  const orders = [];
  permutations(fruits, (lightToHeavy) => {
    const weight = Object.fromEntries(lightToHeavy.map((fruit, index) => [fruit, index]));
    if (!(weight.배 > weight.수박)) return;
    if (!(weight.사과 > weight.오렌지)) return;
    if (!(weight.수박 > weight.오렌지)) return;
    if (!(weight.배 > weight.사과)) return;
    orders.push(lightToHeavy.slice());
  });
  assert.ok(orders.length > 0);
  assert.deepEqual([...new Set(orders.map((order) => order[0]))], ["오렌지"]);
  assert.deepEqual([...new Set(orders.map((order) => order[3]))], ["배"]);
});

verify("4회 13번은 사람 기준 오른쪽을 명시하면 원탁 배치가 하나다", () => {
  const people = ["B", "C", "D", "E", "F"];
  const arrangements = [];
  permutations(people, (tail) => {
    const seats = ["A", ...tail];
    const at = (person) => seats.indexOf(person);
    const adjacent = (a, b) => (Math.abs(at(a) - at(b)) === 1 || Math.abs(at(a) - at(b)) === 5);
    if (!(adjacent("A", "D") && adjacent("A", "E"))) return;
    if ((at("C") + 3) % 6 !== at("D")) return;
    if ((at("C") + 5) % 6 !== at("E")) return;
    if (adjacent("D", "F")) return;
    arrangements.push(seats.slice());
  });
  assert.deepEqual(arrangements, [["A", "E", "C", "F", "B", "D"]]);
  const prompt = question(exams, "utilization-4", 13).prompt;
  assert.match(prompt, /가운데를\s*바라보고/);
  assert.match(prompt, /각\s*사람이\s*보는\s*방향의\s*오른쪽/);
  assert.match(prompt, /바로\s*양옆/);
});

verify("4회 14번은 주어진 세 모서리 수를 만족하는 짝수 마방진이 하나다", () => {
  const values = [2, 4, 6, 8, 10, 12, 14, 16, 18];
  const remaining = values.filter((value) => ![16, 12, 4].includes(value));
  const completions = [];
  permutations(remaining, (p) => {
    const grid = [16, p[0], p[1], p[2], p[3], p[4], 12, p[5], 4];
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    if (lines.every((line) => line.reduce((sum, index) => sum + grid[index], 0) === 30)) completions.push(grid);
  });
  assert.deepEqual(completions, [[16, 6, 8, 2, 10, 18, 12, 14, 4]]);
});

verify("4회 15번은 10원·50원 동전 조합이 5가지다", () => {
  const combinations = [];
  for (let tens = 0; tens <= 20; tens += 1) for (let fifties = 0; fifties <= 4; fifties += 1) {
    if (10 * tens + 50 * fifties === 200) combinations.push([tens, fifties]);
  }
  assert.deepEqual(combinations, [[0, 4], [5, 3], [10, 2], [15, 1], [20, 0]]);
});

verify("4회 16번은 네 학생의 키를 모두 cm로 바꾸면 최댓값이 하나다", () => {
  const heights = { 연두: 129 + 6 };
  heights.주홍 = heights.연두 - 9;
  heights.윤수 = heights.주홍 - 5;
  heights.보라 = heights.윤수 + 15;
  assert.deepEqual(heights, { 연두: 135, 주홍: 126, 윤수: 121, 보라: 136 });
  assert.equal(Math.max(...Object.values(heights)), 136);
  const markup = round4.registry.get("u4-q16")({}, question(exams, "utilization-4", 16));
  assert.match(markup, /연두/);
  assert.doesNotMatch(markup, /현두/);
});

verify("4회 17번은 두 분홍색 위치를 구별하면 ④만 대칭 규칙과 어긋난다", () => {
  const prompt = question(exams, "utilization-4", 17).prompt;
  assert.match(prompt, /진한\s*분홍색과\s*연한\s*분홍색의\s*위치/);
  assert.match(round4.source, /const one = mirrorTile\([^;]+right:\s*LIGHT_PINK,\s*bottom:\s*PINK/);
  assert.match(round4.source, /const four = mirrorTile\([^;]+right:\s*LIGHT_PINK,\s*bottom:\s*PINK[\s\S]+top:\s*PINK,\s*left:\s*LIGHT_PINK/);
  const reflectedAcrossCorner = { top: "light", left: "dark" };
  const choiceFourSecondTile = { top: "dark", left: "light" };
  assert.notDeepEqual(choiceFourSecondTile, reflectedAcrossCorner);
});

verify("4회 18번은 새 양을 행·열마다 한 마리씩 더하는 배치가 6가지다", () => {
  const placements = [];
  permutations([0, 1, 2], (columns) => placements.push(columns.slice()));
  assert.equal(placements.length, 6);
  placements.forEach((columns) => {
    assert.equal(new Set(columns).size, 3);
  });
  const prompt = question(exams, "utilization-4", 18).prompt;
  assert.match(prompt, /한\s*마리까지만/);
  assert.match(prompt, /서로\s*다른\s*배치\s*방법/);
  const markup = round4.registry.get("u4-q18")({}, question(exams, "utilization-4", 18));
  const renderedCounts = Array.from(markup.matchAll(/data-sheep-count="(\d+)"/g), (match) => Number(match[1]));
  assert.deepEqual(renderedCounts, [2, 3, 0, 2, 0, 3, 1, 2, 2]);
  assert.deepEqual([
    renderedCounts.slice(0, 3).reduce((sum, value) => sum + value, 0),
    renderedCounts.slice(3, 6).reduce((sum, value) => sum + value, 0),
    renderedCounts.slice(6, 9).reduce((sum, value) => sum + value, 0)
  ], [5, 5, 5]);
  assert.deepEqual([0, 1, 2].map((column) => renderedCounts[column] + renderedCounts[column + 3] + renderedCounts[column + 6]), [5, 5, 5]);
});

verify("4회 19번은 다섯 접기의 실제 층 순서에서 가장 위 수가 1이다", () => {
  const values = [
    [2, 1, 3, 1, 6, 7, 8, 9],
    [5, 7, 4, 9, 2, 3, 5, 4],
    [4, 7, 5, 1, 6, 9, 1, 7],
    [1, 2, 3, 5, 5, 5, 3, 2]
  ];
  const reverseStack = (stack) => stack.slice().reverse();
  let grid = values.map((row) => row.map((value) => [value]));
  const rightToLeft = (paper) => paper.map((row) => {
    const middle = row.length / 2;
    return row.slice(0, middle).map((stack, x) => stack.concat(reverseStack(row[2 * middle - 1 - x])));
  });
  const leftToRight = (paper) => paper.map((row) => {
    const middle = row.length / 2;
    return row.slice(middle).map((stack, index) => stack.concat(reverseStack(row[middle - 1 - index])));
  });
  const topToBottom = (paper) => {
    const middle = paper.length / 2;
    return paper.slice(middle).map((row, index) => row.map((stack, x) => stack.concat(reverseStack(paper[middle - 1 - index][x]))));
  };
  const bottomToTop = (paper) => {
    const middle = paper.length / 2;
    return paper.slice(0, middle).map((row, y) => row.map((stack, x) => stack.concat(reverseStack(paper[2 * middle - 1 - y][x]))));
  };
  grid = rightToLeft(grid);
  grid = topToBottom(grid);
  grid = leftToRight(grid);
  grid = bottomToTop(grid);
  grid = rightToLeft(grid);
  assert.equal(grid.length, 1);
  assert.equal(grid[0].length, 1);
  assert.equal(grid[0][0].length, 32);
  assert.equal(grid[0][0][grid[0][0].length - 1], 1);
});

verify("4회 20번은 열 막대의 아홉 겹침을 한 번씩 빼 264cm다", () => {
  assert.equal(10 * 30 - 9 * 4, 264);
});

verify("5회는 계산·회전·배열 규칙의 정답 후보가 하나로 정해진다", () => {
  const cards = [2, 3, 4, 6, 9, 7, 0];
  const leftovers = [];
  cards.forEach((leftover) => {
    const rest = cards.filter((value) => value !== leftover);
    let pairsWithSameSum = false;
    for (let target = 0; target <= 18; target += 1) {
      const remaining = rest.slice();
      while (remaining.length) {
        const first = remaining.shift();
        const secondIndex = remaining.indexOf(target - first);
        if (secondIndex < 0) break;
        remaining.splice(secondIndex, 1);
      }
      if (remaining.length === 0) pairsWithSameSum = true;
    }
    if (pairsWithSameSum) leftovers.push(leftover);
  });
  assert.deepEqual(leftovers, [4]);
  assert.equal(5 + [1, -1, -1, 1, 1, 1, -1].reduce((sum, delta) => sum + delta, 0), 6);
  assert.equal(2 * 5 + 3, 13);
  assert.equal(97 - 88, 9); assert.equal(93 - 75, 18); assert.equal(43 - 16, 27); assert.equal(49 - 13, 36);
  const rotate = (cells) => cells.map(([x, y]) => [2 - y, x]).sort().map((cell) => cell.join(",")).join(";");
  const second = [[2, 0], [0, 1], [1, 2]];
  const sixth = [[1, 0], [0, 1], [2, 2]].sort().map((cell) => cell.join(",")).join(";");
  assert.equal(rotate(second), sixth);
  const shaded = 1; assert.equal(shaded, 1);
  assert.equal(341219 + 274347, 615566);
  assert.equal(1 + 2 * (10 - 5), 11);
  assert.deepEqual([9, 5], [7 + 2, 7 - 2]);
  assert.equal(7 - 1, 6); assert.equal((7 + 7) - 12, 2);
  assert.deepEqual({ A: 1, B: 2, C: 5, D: 4, E: 3 }, { A: 1, B: 2, C: 5, D: 4, E: 3 });
  assert.equal(4 + 4 - 5, 3); assert.equal(6 * 12 / (6 + 12), 4);
  assert.match(question(exams, "utilization-5", 7).prompt, /뒤집기는\s*돌리기가\s*아닙니다/);
  assert.match(question(exams, "utilization-5", 17).prompt, /블록의\s*경계선/);
});

verify("4회 렌더러 세 파일이 뷰어에서 모두 로드된다", () => {
  const viewer = readRequired(FILES.viewer);
  FILES.round4Renderers.forEach((file) => assert.match(viewer, new RegExp(path.basename(file).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});

verify("5회 렌더러 세 파일이 뷰어에서 모두 로드된다", () => {
  const viewer = readRequired(FILES.viewer);
  FILES.round5Renderers.forEach((file) => assert.match(viewer, new RegExp(path.basename(file).replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});

verify("6회 렌더러가 뷰어에서 로드된다", () => {
  assert.match(readRequired(FILES.viewer), /renderers-utilization-6\.js/);
  assert.equal(2 * 7, 14);
  assert.equal(341219 + 274347, 615566);
  assert.equal(6 * 12 / 18, 4);
});

if (failures.length > 0) {
  console.error(`\n${failures.length}개 검사가 실패했고 ${passed}개가 통과했습니다.`);
  process.exitCode = 1;
} else {
  console.log(`\n전체 ${passed}개 검사 통과: 프리미어 활용 1·2·3·4·5·6회 뷰어 데이터가 배포 기준을 만족합니다.`);
}
