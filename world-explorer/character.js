import { profileFor, COMPANION_SKINS } from './character-data.js';

function mat(THREE, color, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: .78, metalness: .02, ...extra });
}

function add(THREE, parent, geometry, material, position = [0, 0, 0], rotation = [0, 0, 0], scale = [1, 1, 1]) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  mesh.rotation.set(...rotation);
  mesh.scale.set(...scale);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function createHat(THREE, head, id, jacketDark, accent) {
  const g = new THREE.Group();
  g.position.set(0, .36, 0);
  head.add(g);
  if (id === 'none') return g;
  if (id === 'wide') {
    add(THREE, g, new THREE.CylinderGeometry(.45, .51, .22, 12), jacketDark, [0, 0, 0]);
    add(THREE, g, new THREE.CylinderGeometry(.7, .7, .07, 18), jacketDark, [0, -.1, .02]);
    add(THREE, g, new THREE.TorusGeometry(.46, .035, 6, 18), accent, [0, -.03, 0], [Math.PI / 2, 0, 0]);
  } else if (id === 'round') {
    add(THREE, g, new THREE.SphereGeometry(.48, 16, 10, 0, Math.PI * 2, 0, Math.PI * .56), jacketDark, [0, -.02, 0]);
    add(THREE, g, new THREE.CylinderGeometry(.58, .58, .06, 18), jacketDark, [0, -.1, .03]);
    add(THREE, g, new THREE.TorusGeometry(.42, .03, 6, 18), accent, [0, -.05, 0], [Math.PI / 2, 0, 0]);
  } else if (id === 'crown') {
    const gold = mat(THREE, 0xf0c457, { metalness: .3, roughness: .35 });
    const gem = mat(THREE, 0xd9433f, { emissive: 0x6b1a17, emissiveIntensity: .2 });
    add(THREE, g, new THREE.CylinderGeometry(.44, .48, .24, 14), gold, [0, -.02, 0]);
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * Math.PI * 2;
      add(THREE, g, new THREE.ConeGeometry(.09, .22, 6), gold, [Math.cos(a) * .4, .18, Math.sin(a) * .4]);
    }
    add(THREE, g, new THREE.SphereGeometry(.08, 10, 8), gem, [0, .32, 0]);
  } else if (id === 'safari') {
    const khaki = mat(THREE, 0xcdb682);
    add(THREE, g, new THREE.SphereGeometry(.46, 16, 10, 0, Math.PI * 2, 0, Math.PI * .62), khaki, [0, -.02, 0]);
    add(THREE, g, new THREE.CylinderGeometry(.66, .66, .07, 18), khaki, [0, -.12, 0]);
    add(THREE, g, new THREE.CylinderGeometry(.47, .47, .1, 18), accent, [0, -.06, 0]);
  } else if (id === 'wizard') {
    const purple = mat(THREE, 0x5b4a8f);
    const star = mat(THREE, 0xf0c457, { emissive: 0xf0c457, emissiveIntensity: .3 });
    add(THREE, g, new THREE.CylinderGeometry(.62, .62, .08, 16), purple, [0, -.05, 0]);
    add(THREE, g, new THREE.ConeGeometry(.4, .95, 12), purple, [0, .5, 0]);
    add(THREE, g, new THREE.SphereGeometry(.06, 8, 6), star, [.16, .68, .12]);
    add(THREE, g, new THREE.SphereGeometry(.045, 8, 6), star, [-.13, .48, -.1]);
  } else if (id === 'flower') {
    const petalColors = [0xe86a8a, 0xf0c457, 0x9a6bb0, 0x5cb26f, 0xe98fae];
    const leaf = mat(THREE, 0x4d8a52);
    add(THREE, g, new THREE.TorusGeometry(.44, .05, 6, 20), leaf, [0, -.1, 0], [Math.PI / 2, 0, 0]);
    for (let i = 0; i < 8; i += 1) {
      const a = (i / 8) * Math.PI * 2;
      const petal = mat(THREE, petalColors[i % petalColors.length]);
      add(THREE, g, new THREE.SphereGeometry(.08, 8, 6), petal, [Math.cos(a) * .44, -.08, Math.sin(a) * .44]);
    }
  } else if (id === 'pirate') {
    const black = mat(THREE, 0x2b2622);
    const skull = mat(THREE, 0xf3ecdc);
    add(THREE, g, new THREE.SphereGeometry(.5, 16, 6, 0, Math.PI, 0, Math.PI * .5), black, [0, -.02, -.18], [0, 0, 0]);
    add(THREE, g, new THREE.SphereGeometry(.5, 16, 6, 0, Math.PI, 0, Math.PI * .5), black, [0, -.02, .18], [0, Math.PI, 0]);
    add(THREE, g, new THREE.SphereGeometry(.06, 8, 6), skull, [0, .05, -.42]);
    add(THREE, g, new THREE.SphereGeometry(.025, 6, 5), black, [-.025, .06, -.4]);
    add(THREE, g, new THREE.SphereGeometry(.025, 6, 5), black, [.025, .06, -.4]);
    add(THREE, g, new THREE.TorusGeometry(.46, .03, 6, 18), accent, [0, -.2, 0], [Math.PI / 2, 0, 0]);
  } else if (id === 'astronaut') {
    const glass = mat(THREE, 0xbfe4ee, { transparent: true, opacity: .5, metalness: .2, roughness: .15 });
    const white = mat(THREE, 0xf0ece0);
    add(THREE, g, new THREE.SphereGeometry(.55, 18, 14), glass, [0, .04, .05]);
    add(THREE, g, new THREE.TorusGeometry(.52, .08, 8, 20), white, [0, -.18, 0], [Math.PI / 2, 0, 0]);
    add(THREE, g, new THREE.BoxGeometry(.16, .1, .08), accent, [.36, -.1, .3]);
  } else {
    add(THREE, g, new THREE.CylinderGeometry(.43, .47, .22, 12), jacketDark, [0, 0, 0]);
    add(THREE, g, new THREE.BoxGeometry(.56, .08, .3), jacketDark, [0, -.05, .38]);
    add(THREE, g, new THREE.CircleGeometry(.095, 14), accent, [0, .01, .225]);
  }
  return g;
}

function createHair(THREE, head, style, hairMaterial) {
  add(THREE, head, new THREE.SphereGeometry(.442, 16, 8, 0, Math.PI * 2, 0, Math.PI * .56), hairMaterial, [0, .05, -.01]);
  if (style === 'bob') {
    add(THREE, head, new THREE.BoxGeometry(.24, .48, .25), hairMaterial, [-.34, -.08, -.12], [0, 0, -.1]);
    add(THREE, head, new THREE.BoxGeometry(.24, .48, .25), hairMaterial, [.34, -.08, -.12], [0, 0, .1]);
  } else if (style === 'curly') {
    for (let i = 0; i < 7; i += 1) {
      const a = (i / 7) * Math.PI * 2;
      add(THREE, head, new THREE.SphereGeometry(.16, 8, 6), hairMaterial, [Math.cos(a) * .34, .12 + Math.sin(a * 2) * .05, Math.sin(a) * .27 - .1]);
    }
  } else {
    add(THREE, head, new THREE.BoxGeometry(.28, .22, .12), hairMaterial, [-.34, .02, -.2], [0, 0, -.2]);
    add(THREE, head, new THREE.BoxGeometry(.28, .22, .12), hairMaterial, [.34, .02, -.2], [0, 0, .2]);
  }
}

export function createExplorerCharacter(THREE, state) {
  const profile = profileFor(state);
  const root = new THREE.Group();
  root.name = `explorer-${profile.id}`;
  const model = new THREE.Group();
  root.add(model);

  const skin = mat(THREE, state.skin);
  const skinLight = mat(THREE, state.skin, { roughness: .82 });
  const hair = mat(THREE, state.hair);
  const jacket = mat(THREE, state.jacket);
  const jacketDark = mat(THREE, new THREE.Color(state.jacket).multiplyScalar(.68));
  const shirt = mat(THREE, 0xf3e7c9);
  const trousers = mat(THREE, profile.trousers);
  const shoes = mat(THREE, 0x49382e);
  const leather = mat(THREE, profile.backpack);
  const gold = mat(THREE, 0xf0c457, { metalness: .12 });
  const scarfMat = mat(THREE, state.scarf);

  const hips = new THREE.Group();
  hips.position.y = 1.12;
  model.add(hips);
  add(THREE, hips, new THREE.BoxGeometry(.68, .42, .45), trousers);

  const leftLeg = new THREE.Group();
  const rightLeg = new THREE.Group();
  leftLeg.position.set(-.22, -.16, 0);
  rightLeg.position.set(.22, -.16, 0);
  hips.add(leftLeg, rightLeg);
  for (const leg of [leftLeg, rightLeg]) {
    add(THREE, leg, new THREE.CylinderGeometry(.13, .15, .72, 8), trousers, [0, -.36, 0]);
    add(THREE, leg, new THREE.BoxGeometry(.34, .2, .56), shoes, [0, -.76, .12]);
  }

  const torso = new THREE.Group();
  torso.position.y = 1.72;
  model.add(torso);
  add(THREE, torso, new THREE.BoxGeometry(1.02, 1.05, .62), jacket);
  add(THREE, torso, new THREE.BoxGeometry(.38, .78, .08), shirt, [0, .02, .335]);
  add(THREE, torso, new THREE.BoxGeometry(.09, .78, .06), jacketDark, [-.22, .02, .385]);
  add(THREE, torso, new THREE.BoxGeometry(.09, .78, .06), jacketDark, [.22, .02, .385]);
  add(THREE, torso, new THREE.CircleGeometry(.13, 16), gold, [0, .18, .395]);
  add(THREE, torso, new THREE.TorusGeometry(.08, .018, 5, 16), mat(THREE, 0x2f6779), [0, .18, .412]);

  const leftArm = new THREE.Group();
  const rightArm = new THREE.Group();
  leftArm.position.set(-.64, .32, 0);
  rightArm.position.set(.64, .32, 0);
  torso.add(leftArm, rightArm);
  for (const [arm, side] of [[leftArm, -1], [rightArm, 1]]) {
    add(THREE, arm, new THREE.CylinderGeometry(.12, .14, .78, 8), jacket, [0, -.35, 0], [0, 0, side * .05]);
    add(THREE, arm, new THREE.SphereGeometry(.145, 10, 8), skinLight, [0, -.78, .02]);
  }

  const backpack = new THREE.Group();
  backpack.position.set(0, -.02, -.45);
  torso.add(backpack);
  add(THREE, backpack, new THREE.BoxGeometry(.83, .87, .36), leather);
  add(THREE, backpack, new THREE.BoxGeometry(.72, .18, .39), mat(THREE, new THREE.Color(profile.backpack).multiplyScalar(1.18)), [0, .41, 0]);
  add(THREE, backpack, new THREE.CylinderGeometry(.15, .15, .86, 10), mat(THREE, 0xe3cf9e), [.46, .02, 0], [Math.PI / 2, 0, 0]);
  add(THREE, backpack, new THREE.TorusGeometry(.25, .035, 6, 16, Math.PI), leather, [0, .58, 0]);

  add(THREE, model, new THREE.CylinderGeometry(.12, .15, .18, 8), skin, [0, 2.34, 0]);
  const head = new THREE.Group();
  head.position.set(0, 2.72, 0);
  model.add(head);
  add(THREE, head, new THREE.SphereGeometry(.43, 16, 12), skinLight, [0, 0, 0], [0, 0, 0], [1, 1.08, .98]);
  createHair(THREE, head, profile.hairStyle, hair);
  add(THREE, head, new THREE.SphereGeometry(.045, 8, 6), mat(THREE, 0x2e2927), [-.15, .02, .4]);
  add(THREE, head, new THREE.SphereGeometry(.045, 8, 6), mat(THREE, 0x2e2927), [.15, .02, .4]);
  add(THREE, head, new THREE.SphereGeometry(.05, 8, 6), skin, [0, -.07, .43], [0, 0, 0], [.75, .8, .7]);
  add(THREE, head, new THREE.TorusGeometry(.09, .018, 5, 14, Math.PI), mat(THREE, 0xa6574d), [0, -.19, .4], [0, 0, Math.PI]);
  createHat(THREE, head, state.hat, jacketDark, gold);

  const scarf = new THREE.Group();
  scarf.position.set(0, 2.28, .05);
  model.add(scarf);
  add(THREE, scarf, new THREE.TorusGeometry(.29, .09, 7, 18), scarfMat, [0, 0, 0], [Math.PI / 2, 0, 0]);
  const scarfTail = add(THREE, scarf, new THREE.BoxGeometry(.17, .65, .08), scarfMat, [.26, -.3, -.2], [.15, 0, -.18]);

  root.scale.setScalar(.92);
  root.userData.parts = { model, hips, torso, head, leftLeg, rightLeg, leftArm, rightArm, backpack, scarfTail };
  root.userData.animTime = 0;
  return root;
}

export function animateExplorer(character, delta, speed, turning = 0) {
  if (!character?.userData?.parts) return;
  const p = character.userData.parts;
  character.userData.animTime += delta * (2.2 + speed * 1.8);
  const t = character.userData.animTime;
  const moving = Math.min(1, speed / 2.8);
  const stride = Math.sin(t * 4.5) * .62 * moving;
  const bounce = Math.abs(Math.sin(t * 4.5)) * .075 * moving;

  p.leftLeg.rotation.x += (stride - p.leftLeg.rotation.x) * Math.min(1, delta * 14);
  p.rightLeg.rotation.x += (-stride - p.rightLeg.rotation.x) * Math.min(1, delta * 14);
  p.leftArm.rotation.x += (-stride * .78 - p.leftArm.rotation.x) * Math.min(1, delta * 12);
  p.rightArm.rotation.x += (stride * .78 - p.rightArm.rotation.x) * Math.min(1, delta * 12);
  p.model.position.y += ((moving ? bounce : Math.sin(t * 1.25) * .018) - p.model.position.y) * Math.min(1, delta * 10);
  p.torso.rotation.z += ((turning * -.05) - p.torso.rotation.z) * Math.min(1, delta * 8);
  p.head.rotation.y += ((moving ? Math.sin(t * 2.1) * .025 : Math.sin(t * .55) * .08) - p.head.rotation.y) * Math.min(1, delta * 4);
  p.backpack.rotation.x = Math.sin(t * 4.5 + .8) * .045 * moving;
  p.scarfTail.rotation.x = .15 + Math.sin(t * 4.5 + 1.2) * .12 * moving;
  p.scarfTail.rotation.z = -.18 + Math.sin(t * 2.2) * .05;
}

export function createCubiCompanion(THREE, skinId = 'classic', scale = .68) {
  const skin = COMPANION_SKINS.find(s => s.id === skinId) || COMPANION_SKINS[0];
  const root = new THREE.Group();
  const wood = mat(THREE, skin.wood, { emissive: skin.wood, emissiveIntensity: .06 });
  const dark = mat(THREE, skin.dark);
  const cube = new THREE.BoxGeometry(.48, .48, .48);
  add(THREE, root, cube, wood, [-.24, 0, 0]);
  add(THREE, root, cube, wood, [.24, 0, 0]);
  const face = add(THREE, root, cube, wood, [0, .47, 0]);
  add(THREE, face, new THREE.SphereGeometry(.035, 8, 6), dark, [-.1, .05, .245]);
  add(THREE, face, new THREE.SphereGeometry(.035, 8, 6), dark, [.1, .05, .245]);
  root.scale.setScalar(scale);
  root.userData.skinId = skin.id;
  return root;
}
