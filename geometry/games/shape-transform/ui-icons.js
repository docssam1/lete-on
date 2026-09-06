import ArrowLeft from "./icons/arrow-left.js";
import ArrowRight from "./icons/arrow-right.js";
import Lightbulb from "./icons/lightbulb.js";
import RotateCcw from "./icons/rotate-ccw.js";
import Volume2 from "./icons/volume-2.js";
import VolumeX from "./icons/volume-x.js";
import BookOpen from "./icons/book-open.js";
import Play from "./icons/play.js";
import Check from "./icons/check.js";
import X from "./icons/x.js";
import ArrowUp from "./icons/arrow-up.js";
import ArrowDown from "./icons/arrow-down.js";
import RotateCw from "./icons/rotate-cw.js";

const nodes = { back:ArrowLeft, next:ArrowRight, up:ArrowUp, down:ArrowDown, clockwise:RotateCw, hint:Lightbulb, retry:RotateCcw, sound:Volume2, muted:VolumeX, book:BookOpen, play:Play, check:Check, close:X };
export function icon(name) {
  const children = (nodes[name] || []).map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([key,value]) => `${key}="${value}"`).join(" ")}/>`).join("");
  return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${children}</svg>`;
}
