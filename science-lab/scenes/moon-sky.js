import { THREE, label, clamp01 } from './_kit.js';
import { DAYS, moonModel, moonRow } from './moon-model.js';
export { DAYS, moonModel, moonRow };
// 같은 시각 달 관찰(4-2 Ⅰ 밤하늘과 우리) — 남쪽을 바라보고 선 아이의 하늘: 동쪽(왼쪽)에서 남쪽을 지나 서쪽(오른쪽)까지 펼친 그림(파노라마) 위에 그날의 달을 띄운다.
// 달의 밝은 부분은 해 쪽을 향하고, 밝은 비율은 해와 달 사이 각으로 정해진다(셰이더: 빛 방향 = cos(위상각)·화면 쪽 + sin(위상각)·해 쪽).
// 저녁(초승~보름)은 해가 진 서쪽 지평선 아래, 새벽(하현·그믐)은 해가 뜰 동쪽 지평선 아래에 해가 있다.
const W = 3.0, ALT = 1.3, BASE = 0.68, R = 0.27;
const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
export const skyPos = (fromWest) => [W - (fromWest / 180) * 2 * W, BASE + ALT * Math.sin((fromWest * Math.PI) / 180)];   // 서쪽 = 오른쪽

function moonTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d');
  g.fillStyle = '#d9d6cf'; g.fillRect(0, 0, 512, 256); let s = 11; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 9; i++) { g.fillStyle = 'rgba(120,118,112,.35)'; g.beginPath(); g.ellipse(r() * 512, 40 + r() * 170, 30 + r() * 60, 20 + r() * 40, r() * 3, 0, 7); g.fill(); }   // 바다(어두운 부분)
  for (let i = 0; i < 160; i++) { const x = r() * 512, y = r() * 256, rr = 1.5 + r() * 7; g.strokeStyle = 'rgba(90,88,84,.45)'; g.lineWidth = 1.2; g.beginPath(); g.arc(x, y, rr, 0, 7); g.stroke(); g.fillStyle = 'rgba(245,243,238,.35)'; g.beginPath(); g.arc(x - rr * 0.25, y - rr * 0.25, rr * 0.55, 0, 7); g.fill(); }   // 구덩이
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
let TEX;
function moonMesh(r = R) {
  TEX ||= moonTexture();
  const m = new THREE.ShaderMaterial({
    uniforms: { map: { value: TEX }, L: { value: new THREE.Vector3(1, 0, 0) }, glow: { value: 1 } }, transparent: true, depthWrite: false,
    vertexShader: 'varying vec3 vN; varying vec2 vU; void main(){ vU = uv; vN = normalize(mat3(modelMatrix) * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'uniform sampler2D map; uniform vec3 L; uniform float glow; varying vec3 vN; varying vec2 vU; void main(){ vec3 c = texture2D(map, vU).rgb; float d = dot(normalize(vN), normalize(L)); float lit = smoothstep(-0.03, 0.05, d); vec3 col = mix(c * 0.12, c * 1.3 + 0.08, lit); gl_FragColor = vec4(col, mix(0.14, 1.0, lit) * glow); }',
  });
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 64, 40), m); mesh.rotation.y = -Math.PI / 2;
  return mesh;
}
// 넓은 하늘 판(가로 SW × 세로 SH, 지평선 y = 0). 해가 진(뜰) 쪽 지평선에 노을빛을 둔다.
const SW = 16, SH = 7, SKY_TOP = 5;
function skyTexture(evening) {
  const c = document.createElement('canvas'); c.width = 2048; c.height = 512; const g = c.getContext('2d'), hz = (SKY_TOP / SH) * 512;
  const v = g.createLinearGradient(0, 0, 0, hz); v.addColorStop(0, '#08122e'); v.addColorStop(0.75, '#1b3164'); v.addColorStop(1, '#2f4c84'); g.fillStyle = v; g.fillRect(0, 0, 2048, 512);
  const gx = (0.5 + (evening ? 1 : -1) * (W + 0.6) / SW) * 2048, h = g.createRadialGradient(gx, hz, 8, gx, hz, 340);
  h.addColorStop(0, 'rgba(255,170,90,.8)'); h.addColorStop(0.35, 'rgba(240,120,90,.25)'); h.addColorStop(1, 'rgba(240,120,90,0)'); g.fillStyle = h; g.fillRect(0, 0, 2048, 512);
  let s = 5; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 420; i++) { g.fillStyle = `rgba(255,255,255,${0.25 + r() * 0.6})`; g.fillRect(r() * 2048, r() * (hz - 30), 1.6, 1.6); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function buildMoonSky({ letters = true, markR = 0.13, markGlow = 0.75 } = {}) {   // markR·markGlow: 교재 그림에서 적어 둔 날의 달도 크게 그릴 때
  const g = new THREE.Group();
  const skies = [true, false].map((ev) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(SW, SH), new THREE.MeshBasicMaterial({ map: skyTexture(ev), transparent: true, opacity: ev ? 1 : 0, depthWrite: false, toneMapped: false })); m.position.set(0, SKY_TOP - SH / 2, -0.6); m.userData.noFrame = true; g.add(m); return m; });
  // 지평선의 집·나무 그림자(달보다 뒤)
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(SW, 3), new THREE.MeshBasicMaterial({ color: 0x0d1424 })); ground.position.set(0, -1.5, -0.5); ground.userData.noFrame = true; g.add(ground);
  const sil = new THREE.MeshBasicMaterial({ color: 0x111a2e });
  let s = 3; const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let x = -SW / 2; x < SW / 2; x += 0.28 + r() * 0.3) { const h = 0.1 + r() * 0.3, w = 0.18 + r() * 0.3, b = new THREE.Mesh(new THREE.PlaneGeometry(w, h), sil); b.position.set(x, h / 2 - 0.02, -0.45); b.userData.noFrame = true; g.add(b); }
  const moon = moonMesh(); g.add(moon);
  const marks = DAYS.map(() => { const m = moonMesh(markR); m.visible = false; g.add(m); return m; });
  const tags = [];
  if (letters) for (const [t, fw] of [['서', 0], ['남', 90], ['동', 180]]) { const l = label(t, { size: 0.16 }); l.position.set(skyPos(fw)[0], -0.25, 0); g.add(l); tags.push(l); }
  const dayTags = DAYS.map((d) => { const l = label(`${d}일`, { size: 0.12 }); l.visible = false; g.add(l); return l; });
  const S = { day: 3, p: 1, shown: true, marks: [], t: 0 };
  const light = (mesh, day) => {
    // 해는 저녁엔 서쪽(오른쪽), 새벽엔 동쪽(왼쪽) 지평선 아래 — 밝은 쪽이 그쪽을 향한다(아래로 조금 기울게).
    const m = moonModel(day), [mx, my] = skyPos(m.fromWest);
    // 초승·그믐(이각 40° 안팎)은 실제로 아주 가늘어 화면에서 사라지므로 그림에서만 48°까지 살짝 두껍게 그린다(표의 값은 모형 값 그대로).
    const T = new THREE.Vector3(m.evening ? 1 : -1, -0.2, 0).normalize(), pa = Math.PI - (Math.max(48, m.elong) * Math.PI) / 180;   // 위상각: 해-달-나 사이 각
    mesh.material.uniforms.L.value.set(T.x * Math.sin(pa), T.y * Math.sin(pa), Math.cos(pa));
    return [mx, my];
  };
  const draw = () => {
    const m = moonModel(S.day), [mx, my] = light(moon, S.day);
    skies[0].material.opacity = m.evening ? 1 : 0; skies[1].material.opacity = m.evening ? 0 : 1;
    const a = S.shown ? smooth(0.15, 0.85, S.p) : 0; moon.visible = a > 0.01; moon.position.set(mx, my - (1 - a) * 0.25, 0); moon.material.uniforms.glow.value = a;
    // 같은 시각(저녁 또는 새벽)에 적어 둔 날의 달을 작게 남겨 위치 변화를 본다
    DAYS.forEach((d, i) => { const on = S.marks.includes(d) && d !== S.day && moonModel(d).evening === m.evening; marks[i].visible = on; dayTags[i].visible = on && letters;
      if (on) { const [x, y] = light(marks[i], d); marks[i].position.set(x, y, -0.05); marks[i].material.uniforms.glow.value = markGlow; dayTags[i].position.set(x, y + markR + 0.11, 0); } });
  };
  const set = (o) => { Object.assign(S, o); draw(); };
  draw();
  g.userData = { set, state: S, moon, tags };
  return g;
}

export default {
  view: { theta: 0, phi: Math.PI / 2 }, revealAt: 2,
  frame: [[-3.4, -0.35, -0.2], [3.4, 2.5, 0.2]],
  build(kit, world) { world.add('sky', buildMoonSky()); return {}; },
  beats: [
    { text: '같은 곳에서, 해가 진 뒤 저녁 7시쯤 남쪽 하늘을 바라봐요. 오른쪽이 서쪽, 왼쪽이 동쪽이에요.', show: ['sky'], dur: 7,
      reset(o) { o.sky.userData.set({ day: 3, shown: false, marks: [] }); } },
    { text: '초승달을 본 날부터 며칠마다 같은 시각에 달을 보면, 달의 모양과 위치는 어떻게 달라질까요? 먼저 예상해요.', show: ['sky'], dur: 6,
      reset(o) { o.sky.userData.set({ day: 3, shown: true, p: 1, marks: [] }); } },
    { text: '날짜가 지날수록 같은 시각의 달은 서쪽에서 동쪽으로 옮겨 가고, 밝은 부분이 커져요. 초승달 → 상현달 → 보름달.', show: ['sky'], dur: 10,
      reset(o) { o.sky.userData.set({ day: 3, shown: true, p: 1, marks: [] }); },
      anim(p, o) { const d = p < 0.33 ? 3 : p < 0.66 ? 7 : 15; o.sky.userData.set({ day: d, p: 1, marks: [3, 7, 15].filter((x) => x < d) }); } },
    { text: '보름달 뒤에는 새벽에 보이는 달의 왼쪽이 밝고 점점 줄어요. 하현달 → 그믐달. 약 한 달(29.5일)마다 되풀이돼요. 달은 스스로 빛을 내지 않고 햇빛을 받아 밝게 보여요.', show: ['sky'], dur: 10,
      reset(o) { o.sky.userData.set({ day: 22, shown: true, p: 1, marks: [] }); },
      anim(p, o) { const d = p < 0.5 ? 22 : 26; o.sky.userData.set({ day: d, p: 1, marks: d === 26 ? [22] : [] }); } },
  ],
};
