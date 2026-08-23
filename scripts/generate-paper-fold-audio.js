#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_ROOT = path.join(ROOT, "geometry", "assets", "audio", "foldy", "paper-fold");

const cues = {
  ko: {
    voice: "ko-KR-SunHiNeural", rate: "+9%", pitch: "+20Hz",
    tutorial1: "안녕, 나는 폴디야. 접는 선을 따라 색종이가 어떻게 바뀌는지 먼저 보여 줄게.",
    tutorial2: "빛나는 접기선을 누르면 종이 한쪽이 반대쪽으로 포개져.",
    tutorial3: "구멍을 뚫은 뒤 다시 펼치면, 접기선을 거울처럼 같은 자리에 표시가 생겨. 이제 직접 해 보자.",
    hintReady: "밝게 빛나는 선이 접기선이야. 그 선을 눌러 먼저 접어 보자.",
    hintFolded: "접기선을 거울이라고 생각해 봐. 표시가 반대쪽 어디에 나타날지 찾아봐.",
    successGood: "Good job!", successGreat: "Great job!", successPop: "Success!",
  },
  zh: {
    voice: "zh-CN-XiaoxiaoNeural", rate: "+10%", pitch: "+18Hz",
    tutorial1: "你好，我是Foldy。先看看纸沿着折痕折叠后会怎样变化。",
    tutorial2: "点击发光的折痕，纸的一边就会翻到另一边并叠在一起。",
    tutorial3: "打孔后再展开，折痕像镜子一样会在对应位置留下标记。现在自己试一试吧。",
    hintReady: "发光的线就是折痕。先点击它把纸折起来吧。",
    hintFolded: "把折痕当作镜子。找一找标记会出现在另一边的哪里。",
    successGood: "Good job!", successGreat: "Great job!", successPop: "Success!",
  },
  ja: {
    voice: "ja-JP-NanamiNeural", rate: "+9%", pitch: "+20Hz",
    tutorial1: "こんにちは、フォルディだよ。折り線にそって紙がどう変わるか、先に見てみよう。",
    tutorial2: "光っている折り線を押すと、紙の片方が反対側へ重なって折れるよ。",
    tutorial3: "穴をあけてから開くと、折り線を鏡にしたように同じ場所に印ができるよ。自分でもやってみよう。",
    hintReady: "光っている線が折り線だよ。まずそこを押して紙を折ろう。",
    hintFolded: "折り線を鏡だと思ってみて。印が反対側のどこに出るか探そう。",
    successGood: "Good job!", successGreat: "Great job!", successPop: "Success!",
  },
  en: {
    voice: "en-US-AnaNeural", rate: "+9%", pitch: "+16Hz",
    tutorial1: "Hi, I am Foldy. First, watch how the paper changes along the crease.",
    tutorial2: "Tap the glowing crease. One side turns over and stacks on the other side.",
    tutorial3: "After you punch a hole and open the paper, the crease works like a mirror and makes a matching mark. Now try it yourself.",
    hintReady: "The glowing line is the crease. Tap it first to fold the paper.",
    hintFolded: "Think of the crease as a mirror. Find where the mark appears on the other side.",
    successGood: "Good job!", successGreat: "Great job!", successPop: "Success!",
  },
};

function generate({ text, output, voice, rate, pitch }) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const result = spawnSync("python", [
    "-m", "edge_tts", "--voice", voice, "--rate", rate, "--pitch", pitch,
    "--volume", "+4%", "--text", text, "--write-media", output,
  ], { encoding: "utf8" });
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `edge-tts failed for ${output}`);
  const bytes = fs.statSync(output).size;
  const header = fs.readFileSync(output).subarray(0, 3).toString("ascii");
  if (bytes < 256 || (header !== "ID3" && fs.readFileSync(output)[0] !== 0xff)) throw new Error(`Invalid MP3: ${output}`);
  return bytes;
}

const filename = {
  tutorial1: "tutorial1", tutorial2: "tutorial2", tutorial3: "tutorial3",
  hintReady: "hint-ready", hintFolded: "hint-folded",
  successGood: "success-good", successGreat: "success-great", successPop: "success-pop",
};

let generated = 0;
for (const [language, config] of Object.entries(cues)) {
  for (const cue of Object.keys(config).filter((key) => !["voice", "rate", "pitch"].includes(key))) {
    const output = path.join(OUTPUT_ROOT, language, `${filename[cue]}.mp3`);
    console.log(`${language}/${cue}: ${generate({ text: config[cue], output, ...config })} bytes`);
    generated += 1;
  }
}
console.log(`Generated ${generated} Foldy MP3 files in ${OUTPUT_ROOT}`);
