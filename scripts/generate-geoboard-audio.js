#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_ROOT = path.join(ROOT, "geometry", "assets", "audio", "cubi", "geoboard");

const cues = {
  ko: {
    voice: "ko-KR-HyunsuMultilingualNeural",
    rate: "+8%",
    pitch: "+18Hz",
    tutorial1: "큐비가 먼저 보여 줄게. 손가락이 가리키는 못을 차례대로 봐.",
    tutorial2: "첫 번째 못을 누르고 다음 못을 누르면, 그 사이에 고무줄이 생겨.",
    tutorial3: "못을 계속 누르면 열린 모양이 돼. 선이 겹치거나 같은 못을 다시 쓰면 안 돼.",
    tutorial4: "마지막에 처음 못을 다시 누르면 도형이 닫혀. 이제 보기와 똑같이 만들어 보자.",
    tutorialPractice: "이제 반짝이는 못부터 눌러 삼각형을 완성해 봐.",
    tutorialComplete: "좋아! 직접 닫힌 도형을 만들었어. 이제 본 문제를 시작하자.",
    hintOpen: "보기의 못 위치를 하나씩 세어 봐. 가로와 세로 칸 수를 세면 같은 자리를 찾을 수 있어.",
    hintClosed: "한 꼭짓점을 먼저 정하고, 보기와 같은 방향으로 이어 봐. 마지막에 처음 못을 누르면 닫혀.",
  },
  zh: {
    voice: "zh-CN-YunxiaNeural",
    rate: "+10%",
    pitch: "+16Hz",
    tutorial1: "Cubi先做给你看。请按顺序看手指指向的钉子。",
    tutorial2: "先点第一个钉子，再点下一个钉子，中间就会出现一条皮筋。",
    tutorial3: "继续点钉子会做出不封口的图形。皮筋不能重叠，也不能再次使用同一个钉子。",
    tutorial4: "最后再点第一个钉子，图形就封起来了。现在照着样图做一遍吧。",
    tutorialPractice: "现在从闪亮的钉子开始，自己完成这个三角形吧。",
    tutorialComplete: "真棒！你自己做出了封闭图形。现在开始正式题目吧。",
    hintOpen: "一个一个数样图上钉子的位置。数横着和竖着几格，就能找到同样的位置。",
    hintClosed: "先定下一个顶点，再按样图的方向连接。最后点第一个钉子就封口了。",
  },
  ja: {
    voice: "ja-JP-KeitaNeural",
    rate: "+9%",
    pitch: "+18Hz",
    tutorial1: "まずCubiがやってみせるよ。指がさすくぎを順番に見てね。",
    tutorial2: "最初のくぎを押して次のくぎを押すと、その間にゴムが一本かかるよ。",
    tutorial3: "くぎを続けて押すと開いた形になるよ。ゴムを重ねたり、同じくぎをもう一度使ったりしないでね。",
    tutorial4: "最後に最初のくぎを押すと形が閉じるよ。今度は見本と同じ形をつくろう。",
    tutorialPractice: "光っているくぎから押して、三角形を完成させよう。",
    tutorialComplete: "いいね！自分で閉じた形を作れたよ。では問題を始めよう。",
    hintOpen: "見本のくぎの場所を一つずつ数えよう。よことたてのマス数を数えると同じ場所が見つかるよ。",
    hintClosed: "まず頂点を一つ決めて、見本と同じ向きにつなごう。最後に最初のくぎを押せば閉じるよ。",
  },
  en: {
    voice: "en-US-AnaNeural",
    rate: "+8%",
    pitch: "+14Hz",
    tutorial1: "Cubi will show you first. Watch the pegs the hand points to, in order.",
    tutorial2: "Tap the first peg, then the next peg. A rubber band appears between them.",
    tutorial3: "Keep tapping pegs to make an open shape. Do not overlap a band or use the same peg twice.",
    tutorial4: "Tap the first peg again at the end to close the shape. Now build the same shape as the model.",
    tutorialPractice: "Now start with the glowing peg and complete the triangle yourself.",
    tutorialComplete: "Great! You made a closed shape yourself. Now let's start the first problem.",
    hintOpen: "Count the pegs on the model one at a time. Count across and down to find the same place.",
    hintClosed: "Choose one corner first, then join the next corner in the same direction as the model. Tap the first peg last.",
  },
};

const cueNames = [
  "tutorial1",
  "tutorial2",
  "tutorial3",
  "tutorial4",
  "tutorialPractice",
  "tutorialComplete",
  "hintOpen",
  "hintClosed",
];

function generate({ text, output, voice, rate, pitch }) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const result = spawnSync("python", [
    "-m", "edge_tts",
    "--voice", voice,
    "--rate", rate,
    "--pitch", pitch,
    "--volume", "+4%",
    "--text", text,
    "--write-media", output,
  ], { encoding: "utf8" });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `edge-tts failed for ${output}`);
  }
  const stat = fs.statSync(output);
  if (stat.size < 256) throw new Error(`Generated audio is too small: ${output} (${stat.size} bytes)`);
  const header = fs.readFileSync(output).subarray(0, 3).toString("ascii");
  if (header !== "ID3" && fs.readFileSync(output)[0] !== 0xff) {
    throw new Error(`Generated file is not an MP3: ${output}`);
  }
  return stat.size;
}

function main() {
  let count = 0;
  for (const [language, config] of Object.entries(cues)) {
    for (const cue of cueNames) {
      const output = path.join(OUTPUT_ROOT, language, `${cue.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}.mp3`);
      const size = generate({ text: config[cue], output, ...config });
      console.log(`${language}/${cue}: ${size} bytes`);
      count += 1;
    }
  }
  console.log(`Generated ${count} Geoboard Cubi MP3 files in ${OUTPUT_ROOT}`);
}

main();
