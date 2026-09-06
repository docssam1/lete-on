import { cubeSourceAnimation, renderCubeSourceFrame } from "./golden-bell-cube-animation.js?v=20260906a";
import { book10SourceAnimation, renderBook10SourceFrame } from "./golden-bell-book10-animation.js?v=20260906b";

export function sourceAnimationsForLesson(lesson) {
  const builder = lesson.id === "hidden-cube-count" ? cubeSourceAnimation : lesson.id === "catch-up-acorns" ? book10SourceAnimation : null;
  if (!builder) return [];
  return lesson.original.items.map((item) => {
    const animation = builder(item);
    return animation && { ...animation, label: item.typeLabel, sourceNo: item.sourceNo };
  }).filter(Boolean);
}

export function sourceAnimationFrame(animation, step, options = {}) {
  return animation.family === "cube-hidden-count"
    ? renderCubeSourceFrame(animation, step, options)
    : renderBook10SourceFrame(animation, step, options);
}

export function sourceAnimationDelay(animation, step, speed = 1) {
  const requested = Number(animation.beats[step]?.durationMs);
  const duration = Number.isFinite(requested) && requested >= 1000 ? requested : 4500;
  return Math.max(1800, duration / Math.max(0.5, Math.min(2, speed)));
}
