// Book 01 voice playback remains local-only while the generated cues are reviewed.
const pilotHost = ["127.0.0.1", "localhost"].includes(globalThis.location?.hostname);
const cueByPhase = {
  start: { text: "반의 반 바퀴씩 돌려 문제를 맞춰 보자.", file: "clock-start.mp3" },
  retry: { text: "아직 아니야. 돌린 방향을 다시 보자.", file: "clock-retry.mp3" },
  success: { text: "좋아, 맞았어!", file: "clock-success.mp3" }
};

export function createHandsOnVoice(player) {
  let enabled = true;
  let lastKey = "";
  const cueFor = (activityId, guide) => activityId === "turn-clock" && pilotHost && cueByPhase[guide.phase]?.text === guide.text
    ? cueByPhase[guide.phase] : null;
  const stop = () => {
    player.pause();
    if (player.readyState) player.currentTime = 0;
  };
  return {
    get enabled() { return enabled; },
    hasCue: (activityId, guide) => Boolean(cueFor(activityId, guide)),
    update(activityId, guide, roundIndex) {
      const cue = cueFor(activityId, guide);
      const key = cue ? `${activityId}:${roundIndex}:${guide.phase}` : "";
      if (key === lastKey) return;
      lastKey = key;
      stop();
      if (!cue || !enabled) return;
      player.src = new URL(`./audio/docssam/${cue.file}`, import.meta.url).href;
      player.play().catch(() => {});
    },
    toggle(activityId, guide, roundIndex) {
      enabled = !enabled;
      lastKey = "";
      if (!enabled) stop();
      else this.update(activityId, guide, roundIndex);
    },
    stop() { lastKey = ""; stop(); }
  };
}
