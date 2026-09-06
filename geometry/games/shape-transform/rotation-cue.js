const escape = value => String(value).replace(/[&<>"']/g, char => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[char]));
const tidy = value => Number(value.toFixed(4));

export function rotationArc(angle) {
  if (![90, -90, 180].includes(angle)) throw new Error("Unsupported turn cue");
  const radius = 24, center = 32, radians = angle * Math.PI / 180;
  const end = [tidy(center + radius * Math.sin(radians)), tidy(center - radius * Math.cos(radians))];
  const direction = Math.sign(angle);
  const tangent = [Math.cos(radians) * direction, Math.sin(radians) * direction];
  const base = [end[0] - tangent[0] * 7, end[1] - tangent[1] * 7];
  const head = [end, [tidy(base[0] - tangent[1] * 3.5), tidy(base[1] + tangent[0] * 3.5)], [tidy(base[0] + tangent[1] * 3.5), tidy(base[1] - tangent[0] * 3.5)]];
  return { end, tangent, head, path:`M32 8 A24 24 0 0 ${angle > 0 ? 1 : 0} ${end.join(" ")}` };
}

export function rotationCue(angle, label = `${Math.abs(angle)}°`) {
  const { path, head } = rotationArc(angle);
  return `<svg class="rotation-cue" data-angle="${angle}" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="${escape(label)}">
    <circle cx="32" cy="32" r="24" fill="#fff" stroke="#abbab7" stroke-width="1.2"/>
    <path d="M32 8V12 M56 32H52 M32 56V52 M8 32H12" fill="none" stroke="#abbab7" stroke-width="1"/>
    <path class="rotation-arc" d="${path}" fill="none" stroke="#9d4238" stroke-width="3" stroke-linecap="round"/>
    <polygon class="rotation-head" points="${head.map(point => point.join(",")).join(" ")}" fill="#9d4238"/>
    <text x="32" y="36.5" text-anchor="middle" fill="#253330" font-family="Arial, sans-serif" font-size="14" font-weight="700">${Math.abs(angle)}°</text>
  </svg>`;
}
