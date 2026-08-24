#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const OUTPUT_ROOT = path.join(ROOT, "geometry", "assets", "audio", "cubi");

const languages = {
  ko: {
    voice: "ko-KR-HyunsuMultilingualNeural",
    rate: "+8%",
    pitch: "+18Hz",
    tutorial: {
      tutorialTake: "반짝이는 쌓기나무를 더미에서 끌어 와 볼까?",
      tutorialPlace: "빨간 자리에 천천히 내려놓아 볼까?",
      tutorialStack: "잘했어! 방금 놓은 쌓기나무 위로 하나 더 올려 볼까?"
    }
  },
  zh: {
    voice: "zh-CN-YunxiaNeural",
    rate: "+10%",
    pitch: "+16Hz",
    tutorial: {
      tutorialTake: "把闪闪发光的积木从盒子里拖出来吧。",
      tutorialPlace: "慢慢放到红色位置上吧。",
      tutorialStack: "很好！再往刚才的积木上放一个吧。"
    }
  },
  ja: {
    voice: "ja-JP-KeitaNeural",
    rate: "+9%",
    pitch: "+18Hz",
    tutorial: {
      tutorialTake: "光っている積み木をトレイから動かしてみよう。",
      tutorialPlace: "赤い場所にゆっくり置いてみよう。",
      tutorialStack: "できた！今の積み木の上にもう一つ置こう。"
    }
  },
  en: {
    voice: "en-US-AnaNeural",
    rate: "+8%",
    pitch: "+14Hz",
    tutorial: {
      tutorialTake: "Drag the sparkling cube from the tray.",
      tutorialPlace: "Lower it slowly onto the red guide.",
      tutorialStack: "Great! Place another cube on top of it."
    }
  }
};

const success = {
  successGood: "Good job!",
  successGreat: "Great job!",
  successPop: "Success!"
};

const fileNames = {
  tutorialTake: "drag-from-tray.mp3",
  tutorialPlace: "place-on-guide.mp3",
  tutorialStack: "stack-up.mp3",
  successGood: "good-job.mp3",
  successGreat: "great-job.mp3",
  successPop: "success.mp3"
};

function generate({ text, output, voice, rate, pitch, successCue }) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const result = spawnSync("python", [
    "-m", "edge_tts",
    "--voice", voice,
    "--rate", successCue ? "+18%" : rate,
    "--pitch", successCue ? "+22Hz" : pitch,
    "--volume", successCue ? "+12%" : "+4%",
    "--text", text,
    "--write-media", output
  ], { encoding: "utf8" });

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `edge-tts failed for ${output}`);
  }
  const size = fs.statSync(output).size;
  if (size < 256) throw new Error(`Generated audio is too small: ${output} (${size} bytes)`);
  return size;
}

let count = 0;
for (const [language, config] of Object.entries(languages)) {
  for (const [cue, text] of Object.entries(config.tutorial)) {
    const output = path.join(OUTPUT_ROOT, "tutorial", language, fileNames[cue]);
    const size = generate({ text, output, ...config, successCue: false });
    console.log(`${language}/${cue}: ${size} bytes`);
    count += 1;
  }
  for (const [cue, text] of Object.entries(success)) {
    const output = path.join(OUTPUT_ROOT, "success", language, fileNames[cue]);
    const size = generate({ text, output, ...config, successCue: true });
    console.log(`${language}/${cue}: ${size} bytes`);
    count += 1;
  }
}

console.log(`Generated ${count} Cubi MP3 files in ${OUTPUT_ROOT}`);
