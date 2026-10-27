// 공원 지도 위의 3D 사람들 — 두 아이(유빈·유준, 원장 2026-10-27 「유빈·유준으로 바꿔」)와 공원 안의 다른 사람들.
// 원장 2026-10-26 「예전에 쓰던 3D 캐릭터 가져와」(월드 익스플로러 탐험가) · 2026-10-27 「캐릭터 더 작아야지 · NPC 같은 친구들 … 수의 나라나 지도에 있는 캐릭터 더 가지고 와」.
// 모양은 두 곳에서 가져온다: world-explorer/character.js(탐험가: 아리·미나·루카·유준·유빈·소라·로빈), number_magic/app/char3d/char3d.js(수의 나라: 독쌤·할아버지·숫자 친구).
// 무리(actor)마다 작은 2D 캔버스 하나에 그리는데, WebGL 렌더러는 하나만 두고 무리마다 돌려 가며 그린 뒤 옮겨 붙인다(WebGL 문맥을 여러 개 만들면 브라우저가 옛것을 끊는다).
// 캔버스 원점(발 사이) = 아래에서 11.25% 높이 — report.css의 .pk-kid3d·.pk-npc canvas(bottom −13.5px)와 짝.
import * as THREE from '../world-explorer/vendor/three.module.js';
import { createExplorerCharacter, animateExplorer } from '../world-explorer/character.js';
import { makeCharacter } from '../number_magic/app/char3d/char3d.js';

// ex = 월드 익스플로러 탐험가(키 약 2.6), nm = 수의 나라(키를 맞춰 준다)
export const CAST = {
  // 두 아이 = 월드 익스플로러의 유빈·유준 그대로
  yubin: { ex: { profileId: 'yubin', skin: 0xf0d0a8, hair: 0x4a3728, jacket: 0x9a6bb0, scarf: 0x5cb26f, hat: 'round' } },
  yujun: { ex: { profileId: 'yujun', skin: 0xe0a97e, hair: 0x2b211d, jacket: 0xc0524a, scarf: 0xf0c457, hat: 'cap' } },
  mina: { ex: { profileId: 'mina', skin: 0xd99d73, hair: 0x241c1a, jacket: 0xd89a35, scarf: 0x4a83a6, hat: 'round' } },
  ari: { ex: { profileId: 'ari', skin: 0xf2c8a5, hair: 0x3f2c24, jacket: 0x3d8164, scarf: 0xe06855, hat: 'cap' } },
  luca: { ex: { profileId: 'luca', skin: 0x8f5d3f, hair: 0x1f1b19, jacket: 0x376f9f, scarf: 0xe1b84b, hat: 'wide' } },
  sora: { ex: { profileId: 'sora', skin: 0xeec19a, hair: 0x4a3626, jacket: 0x4a83a6, scarf: 0xf0c457, hat: 'round' } },
  robin: { ex: { profileId: 'robin', skin: 0xc98760, hair: 0x2c2938, jacket: 0x5b8d69, scarf: 0x9a5e91, hat: 'wide' } },
  // 지키는 사람들(원장 2026-10-27 「지키는 관리인은 다리 조심해야 돼 · 해안가는 파도 조심해」) — 옷 색으로 알아보게: 관리인 국방색 + 사파리 모자, 안전요원 노랑 + 빨간 목도리 + 챙 넓은 모자(빨강·캡은 유준과 헷갈려서)
  ranger: { ex: { profileId: 'luca', skin: 0xe2ad84, hair: 0x2c2938, jacket: 0x5c6b3a, scarf: 0xe1b84b, hat: 'safari' } },
  lifeguard: { ex: { profileId: 'luca', skin: 0xc98760, hair: 0x201a18, jacket: 0xf0b21a, scarf: 0xd8413a, hat: 'wide' } },
  doc: { nm: { kind: 'doc', height: 2.75 } },
  elder: { nm: { kind: 'elder', height: 2.7 } },
  numi: { nm: { kind: 'buddy', buddy: { number: 0 }, height: 1.6 } },
  poco: { nm: { kind: 'buddy', buddy: { number: 3 }, height: 1.6 } },
  momo: { nm: { kind: 'buddy', buddy: { number: 8 }, height: 1.6 } },
};
// 지도 data/park-map.js의 npcs 자리마다 누가 있는지
export const NPC_CAST = { doc: ['doc'], elder: ['elder'], luca: ['luca'], robin: ['robin'], walkers: ['mina', 'ari'], sora: ['sora'], buddies: ['numi', 'poco'], momo: ['momo'], ranger: ['ranger'], lifeguard: ['lifeguard'] };
// 공원 사람들이 하는 말 — 가끔 하나씩, 매번 다른 말로(같은 말 바로 되풀이 안 함). 누르면 바로 한마디.
// 대회 규칙은 data/contests.js의 cautions에 적힌 것만, 대회마다 다르다는 말투로(도감·휴대전화·자 금지는 일부 대회). 관찰 물음의 답은 말하지 않는다.
// 아이들이 가까이 오면 그 사람이 자기 자리를 알려 준다(place — 「여기는 어떤 곳이야」, 원장 2026-10-27). 지키는 사람(관리인·안전요원)은 안전 한마디(near)와 번갈아. 돌아다니다가 가끔(lines), 누르면 아무 줄에서나. 매번 다른 말.
export const NPC_LINES = {
  doc: { who: '독쌤', place: ['여기는 대회 본부 광장이에요. 지도를 보고 관찰할 곳을 골라요.', '천막에서 관찰 기록지와 연필을 받아 가요.', '광장에서 길이 여러 갈래로 나뉘어요 — 연못, 풀밭, 숲, 바다!'], lines: ['도감·휴대전화를 못 쓰는 대회도 있어요. 눈으로 보고, 그리고, 적어요!', '그림은 가는 연필로 — 색칠·명암 없이 선으로만.', '자를 못 쓰는 대회도 있어요. 손가락 마디·한 뼘으로 어림해 봐요.', '모르는 생물은 이름을 지어내지 말고 ①②③ 번호로 불러요.', '본 것과 생각한 것(추정)을 나눠 써요.', '두 곳을 비교할 땐 같은 방법으로 재요.'] },
  elder: { who: '할아버지', place: ['여기는 연못이란다. 물 위에 뜬 잎, 물속에 잠긴 잎, 물가에 선 풀이 다 다르지.', '연못 가장자리는 얕고 가운데는 깊단다. 깊이마다 사는 풀이 다르지.', '수련 잎 위를 보거라. 잠자리가 쉬었다 가는 자리란다.'], lines: ['천천히, 오래 보면 처음엔 안 보이던 게 보인단다.', '잎 하나도 앞면이랑 뒷면이 다르지.', '아침이랑 낮이랑 연못이 달라 보일 게다.', '눈으로 보고, 만져 보고, 냄새도 맡아 보거라.'] },
  luca: { who: '루카', place: ['여기는 바위 언덕이야. 햇빛 드는 쪽이랑 그늘진 쪽 이끼를 비교해 봐!', '바위 틈 흙에도 작은 풀이 자라.', '언덕 위는 바람이 세서 풀이 키가 작아.'], lines: ['바위마다 알갱이 크기가 달라!', '이 바위는 반짝이는 알갱이가 섞여 있어.', '바위 틈에 이끼가 자라는 쪽이 따로 있네.', '손으로 문질러 보면 거친 바위, 매끈한 바위가 있어.'] },
  robin: { who: '로빈', place: ['여기는 습지야. 물이 얕아서 갈대랑 부들이 물 밖으로 솟아 있어.', '데크 위로만 다녀야 해. 습지 바닥은 발이 푹 빠져.', '물가 풀숲은 새랑 개구리가 숨기 좋은 곳이야.'], lines: ['부들 이삭은 갈색 소시지 같아!', '갈대 잎은 길고 납작해. 몇 cm쯤일까?', '데크 아래 물속에도 뭔가 움직여.', '습지는 물이 얕아서 풀이 물 밖으로 솟아 있어.'] },
  walkers: { who: '미나·아리', place: ['여기는 바닷가 산책로야. 한쪽은 공원 숲, 한쪽은 바다!', '산책로에서 정문으로 들어가면 대회 광장이야.'], lines: ['산책로 따라 해변까지 가 보자!', '숲 그늘은 확실히 시원하다.', '꽃밭 쪽에 나비가 날아다녀!', '연못 정자에서 쉬었다 가자.'] },
  sora: { who: '소라', place: ['여기는 백사장이야. 파도가 닿는 곳은 젖어 있고 위쪽은 말라 있어.', '밀물 때 물이 어디까지 왔는지 해초 줄을 보면 알 수 있어.'], lines: ['젖은 모래랑 마른 모래 색이 달라!', '조개껍데기 무늬가 다 달라.', '파도가 지나간 자리에 줄무늬가 생겼어.', '모래 속에 작은 구멍이 있어. 누가 사는 걸까?'] },
  buddies: { who: '누미·포코', place: ['여기는 모래사장! 모래알이 아주아주 작아.', '파라솔 그늘 모래는 시원하고, 햇빛 모래는 뜨거워!'], lines: ['모래알 몇 개인지 세어 볼까? 하나, 둘…', '조개껍데기 셋! 포코 숫자랑 같아!', '발자국이 줄지어 있어. 몇 걸음이었을까?', '모래성 높이를 손가락으로 재 보자!'] },
  momo: { who: '모모', place: ['여기는 동쪽 모래밭이야. 밀물 때 밀려온 해초랑 조개껍데기가 줄지어 있어!', '이 모퉁이 모래밭에서 조개껍데기를 찾아봐!'], lines: ['8자로 걸으면 발자국도 8이 돼!', '바닷물은 들어왔다 나갔다 해.', '갈매기 발자국은 세 갈래야!'] },
  ranger: { who: '공원 관리인', place: ['여기는 개울 다리예요. 연못 물이 이 개울로 흘러 나가요.', '다리 아래 물살이 빠른 곳과 느린 곳을 비교해 봐요.', '저는 공원 관리인이에요. 길을 잃으면 저를 찾아요.'], near: ['다리 건널 때는 난간 잡고 천천히!', '다리 위에서는 뛰지 않기!', '데크 판자가 젖으면 미끄러워요. 조심!', '개울에 손 넣을 땐 꼭 어른과 같이!', '물가 돌은 이끼가 껴서 미끄러워요.'], lines: ['다리 건널 때는 난간 잡고 천천히!', '데크 판자가 젖으면 미끄러워요. 조심!', '꽃과 풀은 꺾지 말고 그 자리에서 관찰해요.', '곤충은 관찰하고 나면 살던 곳에 놓아줘요.', '쓰레기는 꼭 가지고 돌아가요.'] },
  lifeguard: { who: '해변 안전요원', place: ['여기는 해수욕장 앞 백사장이에요. 저는 망루에서 바다를 지켜봐요.', '파도가 닿는 젖은 모래와 위쪽 마른 모래를 비교해 봐요 — 물가는 어른과 함께!', '안내 방송을 잘 들어요. 물에서 나오라고 하면 바로 나와요.'], near: ['파도 조심! 물에는 들어가지 말고 모래에서 관찰해요.', '밀물 때는 물이 금방 차올라요. 물가에서 떨어져요!', '갑자기 큰 파도가 올 수 있어요. 바다를 등지지 마세요.', '물가에는 혼자 가지 않기!'], lines: ['파도 조심! 물에는 들어가지 말고 모래에서 관찰해요.', '젖은 바위는 미끄러워요. 뛰지 마세요!', '모자 쓰고, 물 자주 마셔요!', '물가에는 혼자 가지 않기!'] },
};

const W = 132, H = 120;

function member(id) {
  const d = CAST[id];
  if (d.ex) {
    const c = createExplorerCharacter(THREE, d.ex); c.scale.setScalar(0.92); let want = 0;
    return { obj: c, setFace(a) { want = a; }, wave() {},
      tick(dt, walking, reduced) { let x = want - c.rotation.y; while (x > Math.PI) x -= 2 * Math.PI; while (x < -Math.PI) x += 2 * Math.PI; c.rotation.y += x * Math.min(1, dt * 9); animateExplorer(c, reduced ? 0 : dt, walking ? 2.4 : 0); } };
  }
  const c = makeCharacter(THREE, { ...d.nm, blob: false, shadows: false }); let t = Math.random() * 10, was = null;
  return { obj: c.object, setFace(a) { c.face(a); }, wave() { c.wave(); },
    tick(dt, walking, reduced) { if (was !== walking) { c.setWalking(walking, 1); was = walking; } t += dt; c.update(reduced ? 0 : dt, t); } };
}

export function createCast({ reduced = false } = {}) {
  const dpr = Math.min(2.5, devicePixelRatio || 1);
  const R = new THREE.WebGLRenderer({ canvas: document.createElement('canvas'), alpha: true, antialias: true });
  R.setPixelRatio(dpr); R.setSize(W, H, false); R.outputColorSpace = THREE.SRGBColorSpace;
  // 지도 카메라처럼 약 40° 내려다본다. 가로 ±2.2, 세로 4.0(아래 0.45 · 위 3.55)
  const cam = new THREE.OrthographicCamera(-2.2, 2.2, 3.55, -0.45, 0.1, 50);
  const el = THREE.MathUtils.degToRad(38); cam.position.set(0, Math.sin(el) * 20, Math.cos(el) * 20); cam.lookAt(0, 0, 0);
  const actors = new Set(); let raf = 0, last = performance.now(), paused = false;
  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (!paused) for (const a of actors) {
      if (a.hidden) continue;
      a.members.forEach((m) => m.tick(dt, a.walking, reduced));
      R.render(a.scene, cam); a.ctx.clearRect(0, 0, a.ctx.canvas.width, a.ctx.canvas.height); a.ctx.drawImage(R.domElement, 0, 0, a.ctx.canvas.width, a.ctx.canvas.height);
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);
  return {
    // ids: 한 캔버스에 나란히 세울 사람들(둘이면 ±0.95). rest: 서 있을 때 몸 방향(라디안, 0 = 앞)
    add(canvas, ids, rest = ids.length > 1 ? [0.45, -0.45] : [0]) {
      canvas.width = W * dpr; canvas.height = H * dpr;
      const scene = new THREE.Scene();
      scene.add(new THREE.HemisphereLight(0xfffbef, 0x6d7f55, 1.6));
      const sun = new THREE.DirectionalLight(0xffffff, 2.2); sun.position.set(-3, 8, 5); scene.add(sun);
      const members = ids.map((id, i) => {
        const m = member(id), x = ids.length > 1 ? (i ? 0.95 : -0.95) : 0; m.obj.position.x = x;
        const blob = new THREE.Mesh(new THREE.CircleGeometry(CAST[id].nm?.kind === 'buddy' ? 0.42 : 0.62, 24), new THREE.MeshBasicMaterial({ color: 0x14200f, transparent: true, opacity: 0.28, depthWrite: false }));
        blob.rotation.x = -Math.PI / 2; blob.position.set(x, 0.01, 0); scene.add(blob, m.obj); m.setFace(rest[i] ?? 0); return m;
      });
      const a = { scene, members, ctx: canvas.getContext('2d'), walking: false, hidden: false };
      actors.add(a);
      return {
        setWalking(on) { a.walking = !!on; },
        // dx·dy = 그림 위 이동 방향(화면 아래 = 앞). 0, 0이면 서 있는 방향
        face(dx = 0, dy = 0) { if (!dx && !dy) members.forEach((m, i) => m.setFace(rest[i] ?? 0)); else { const ang = Math.atan2(dx, dy); members.forEach((m) => m.setFace(ang)); } },
        wave() { members.forEach((m) => m.wave()); },
        dispose() { actors.delete(a); scene.traverse((o) => o.geometry?.dispose?.()); },
      };
    },
    pause(on) { paused = !!on; },
    dispose() { cancelAnimationFrame(raf); actors.clear(); R.dispose(); },
  };
}
