export function createGeometryVillage(THREE, scene, options = {}) {
  if (!THREE || !scene) {
    throw new Error("createGeometryVillage requires THREE and a scene.");
  }

  const shadows = Boolean(options.shadows);
  const textures = options.textures || {};
  const root = new THREE.Group();
  root.name = "geometry-village";
  scene.add(root);

  const zones = [];
  const districts = [];
  const colliders = [];
  const animated = [];
  const reducedMotion = Boolean(options.reducedMotion);
  const compact = options.detail === "compact";

  const materials = {
    water: material(0x63c8d8, 0.2, 0.05, { transparent: true, opacity: 0.82 }),
    sand: material(0xe6c986, 0.92),
    grass: material(0x70ad63, 0.96),
    grassLight: material(0x83ba70, 0.94),
    grassDark: material(0x4f8d58, 0.97),
    meadow: material(0x79b368, 0.98),
    road: material(0xe9d8b0, 1),
    roadEdge: material(0xb69062, 0.92),
    plaza: material(0xf1dfba, 0.95),
    wood: texturedMaterial(textures.woodMid, 0xc58d57, 0.72, 2.4, 1.3),
    woodLight: texturedMaterial(textures.woodLight, 0xe4bc82, 0.72, 2.2, 1.2),
    darkWood: texturedMaterial(textures.woodDark, 0xb68155, 0.84, 2.4, 1.1),
    cream: texturedMaterial(textures.cream, 0xfff4d7, 0.9, 2, 1),
    cubeWood: texturedMaterial(textures.cubeWood, 0xd9ad72, 0.68, 1, 1),
    cubeGold: material(0xe2a940, 0.66),
    cubeCoral: material(0xd96c52, 0.7),
    origamiPink: material(0xed8e9d, 0.78),
    origamiBlue: material(0x6ea8cf, 0.74),
    mirrorBlue: material(0x6da5b8, 0.34, 0.52),
    mirrorSilver: material(0xc8d6d9, 0.22, 0.72),
    geoboardGreen: material(0x4f9874, 0.8),
    peg: material(0xf5c654, 0.58),
    crystal: material(0x84d8e8, 0.24, 0.35, { transparent: true, opacity: 0.88 }),
    crystalPink: material(0xee9bc6, 0.3, 0.24),
    stone: material(0x78878a, 0.94),
    trunk: material(0x795033, 0.95),
    leaves: material(0x3f8450, 0.9),
    leavesLight: material(0x69a95d, 0.9),
    lamp: material(0x3e5156, 0.58, 0.3),
    lampGlow: material(0xffd978, 0.5, 0.08, { emissive: 0x8f5d12, emissiveIntensity: 0.5 }),
    ring: material(0xffd45b, 0.42, 0.08, { transparent: true, opacity: 0.72 }),
    flowerPink: material(0xef7f9b, 0.78),
    flowerBlue: material(0x659cd4, 0.78),
    flowerYellow: material(0xf2c94c, 0.76),
    shapeMint: material(0x61b99a, 0.72),
    shapeBlue: material(0x5797ca, 0.7),
    shapeSun: material(0xf0bc45, 0.68),
    shapeCoral: material(0xdf7766, 0.72)
  };

  const geometries = {
    cube: new THREE.BoxGeometry(1, 1, 1),
    cylinder6: new THREE.CylinderGeometry(1, 1, 1, 6),
    cylinder8: new THREE.CylinderGeometry(1, 1, 1, 8),
    cone6: new THREE.ConeGeometry(1, 1, 6),
    pyramid: new THREE.ConeGeometry(1, 1, 4),
    sphere8: new THREE.SphereGeometry(1, 8, 6),
    crystal: new THREE.OctahedronGeometry(1, 0),
    wedge: createWedgeGeometry(),
    ring: new THREE.RingGeometry(1.5, 1.92, 32),
    torus: new THREE.TorusGeometry(1, .12, 8, 28)
  };

  buildIsland();
  buildRiver();
  const placeSpecs = [
    { id: "cubeCastle", name: "Cube Castle", x: -42, z: -24, radius: 7.2, entryDistance: 8.2, labelY: 9.3, signColor: materials.cubeCoral, build: buildCubeCastle },
    { id: "origamiStudio", name: "Origami Studio", x: 0, z: -34, radius: 5.5, entryDistance: 6.4, labelY: 8.3, signColor: materials.origamiPink, build: buildOrigamiStudio },
    { id: "mirrorManor", name: "Mirror Manor", x: 40, z: -20, radius: 5.8, entryDistance: 6.7, labelY: 8.2, signColor: materials.mirrorBlue, build: buildMirrorManor },
    { id: "geoboardYard", name: "Geoboard Yard", x: 43, z: 24, radius: 6, entryDistance: 7, labelY: 7.6, signColor: materials.geoboardGreen, build: buildGeoboardYard },
    { id: "crystalPlaza", name: "Crystal Plaza", x: -28, z: 25, radius: 5.8, entryDistance: 6.8, labelY: 7.5, signColor: materials.crystalPink, build: buildCrystalPlaza },
    { id: "shapeGarden", name: "Shape Garden", x: 13, z: 35, radius: 6.4, entryDistance: 7, labelY: 8.1, signColor: materials.shapeMint, build: buildShapeGarden },
    { id: "pathWalk", name: "Path Walk", x: -8, z: 34, radius: 5.2, entryDistance: 6, labelY: 5.8, signColor: materials.shapeSun, build: buildPathWalk }
  ];

  placeSpecs.forEach(placeZone);
  buildFutureDistricts();
  buildDecorations();

  return { zones, districts, colliders, animated };

  function material(color, roughness, metalness = 0, extra = {}) {
    return new THREE.MeshStandardMaterial({ color, roughness, metalness, ...extra });
  }

  function texturedMaterial(source, color, roughness, repeatX = 1, repeatY = 1) {
    if (!source) return material(color, roughness);
    const map = source.clone();
    map.needsUpdate = true;
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set(repeatX, repeatY);
    return new THREE.MeshStandardMaterial({ color, map, roughness, metalness: 0 });
  }

  function mesh(geometry, mat, parent = root) {
    const object = new THREE.Mesh(geometry, mat);
    object.castShadow = shadows;
    object.receiveShadow = shadows;
    parent.add(object);
    return object;
  }

  function box(parent, mat, x, y, z, sx, sy, sz) {
    const object = mesh(geometries.cube, mat, parent);
    object.position.set(x, y, z);
    object.scale.set(sx, sy, sz);
    return object;
  }

  function cylinder(parent, mat, x, y, z, radius, height, sides = 8) {
    const geometry = sides === 6 ? geometries.cylinder6 : geometries.cylinder8;
    const object = mesh(geometry, mat, parent);
    object.position.set(x, y, z);
    object.scale.set(radius, height, radius);
    return object;
  }

  function addEntryDoor(parent, mat, config) {
    const {
      x = 0,
      y,
      z,
      width,
      height,
      depth,
      accentMaterial = null,
      stripeWidth = 0,
      windowMaterial = null,
      windowY = 0,
      glowColor = 0xffd66b
    } = config;
    const door = new THREE.Group();
    door.name = `${parent.name || "building"}-entry-door`;
    door.position.set(x, y, z);
    parent.add(door);

    box(door, mat, 0, 0, 0, width, height, depth);
    if (accentMaterial && stripeWidth > 0) {
      box(door, accentMaterial, 0, 0, depth * .58, stripeWidth, height, Math.max(.025, depth * .22));
    }
    if (windowMaterial) {
      const window = mesh(new THREE.CircleGeometry(Math.min(width, height) * .22, 20), windowMaterial, door);
      window.position.set(0, windowY, depth * .62);
    }

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: glowColor,
      transparent: true,
      opacity: .035,
      depthWrite: false,
      toneMapped: false
    });
    const glow = box(parent, glowMaterial, x, y, z - depth * .62, width * .76, height * .82, .035);
    glow.name = `${parent.name || "building"}-entry-glow`;
    glow.castShadow = false;
    glow.receiveShadow = false;

    door.userData.animation = {
      type: "door",
      open: false,
      progress: 0,
      closedY: y,
      openY: y + height * .46,
      closedScaleY: 1,
      openScaleY: .08,
      speed: reducedMotion ? 100 : 7.5,
      glow
    };
    parent.userData.entryDoor = door;
    animated.push(door);
    return door;
  }

  function buildIsland() {
    const foundation = box(root, materials.grassDark, 0, -0.62, 0, 148, 1, 108);
    foundation.receiveShadow = true;
    const grass = box(root, materials.grass, 0, -0.08, 0, 142, 0.18, 102);
    grass.receiveShadow = true;

    const patches = [
      { x: -45, z: -25, rx: 26, rz: 22, mat: materials.meadow, seed: .3 },
      { x: 4, z: -31, rx: 25, rz: 19, mat: materials.grassLight, seed: 1.5 },
      { x: 44, z: -18, rx: 23, rz: 22, mat: materials.meadow, seed: 2.2 },
      { x: 42, z: 27, rx: 25, rz: 20, mat: materials.grassLight, seed: 3.1 },
      { x: -30, z: 28, rx: 27, rz: 20, mat: materials.meadow, seed: 4.2 }
    ];
    patches.forEach((patch) => addOrganicPatch(patch));

    for (const x of [-68, 68]) box(root, materials.grassDark, x, 0.45, 0, 5, 1.2, 108);
    for (const z of [-49, 49]) box(root, materials.grassDark, 0, 0.45, z, 142, 1.2, 5);

    const plazaBase = cylinder(root, materials.roadEdge, 0, -0.03, 0, 8.6, 0.18, 8);
    plazaBase.rotation.y = Math.PI / 8;
    const plazaTop = cylinder(root, materials.plaza, 0, 0.08, 0, 7.9, 0.12, 8);
    plazaTop.rotation.y = Math.PI / 8;

    const sculpture = new THREE.Group();
    sculpture.name = "central-geometry-sculpture";
    sculpture.position.set(0, 0.2, 0);
    root.add(sculpture);
    cylinder(sculpture, materials.stone, 0, .28, 0, 2.05, .55, 8);
    cylinder(sculpture, materials.water, 0, .59, 0, 1.72, .13, 32);
    cylinder(sculpture, materials.mirrorSilver, 0, .72, 0, .72, .55, 8);
    const core = mesh(geometries.crystal, materials.crystalPink, sculpture);
    core.position.y = 2.25;
    core.scale.set(1.1, 1.7, 1.1);
    core.userData.animation = { type: "spin", speed: 0.35 };
    animated.push(core);
    colliders.push({ x: 0, z: 0, radius: 1.75 });

    const plazaShapes = [
      { x: -4.7, z: 0, geometry: geometries.cube, mat: materials.cubeGold },
      { x: 4.7, z: 0, geometry: geometries.pyramid, mat: materials.origamiPink },
      { x: 0, z: -4.7, geometry: geometries.sphere8, mat: materials.origamiBlue },
      { x: 0, z: 4.7, geometry: geometries.cylinder6, mat: materials.geoboardGreen }
    ];
    plazaShapes.forEach((spec, index) => {
      cylinder(root, materials.cream, spec.x, .24, spec.z, .82, .42, 8);
      const shape = mesh(spec.geometry, spec.mat);
      shape.position.set(spec.x, 1.12, spec.z);
      shape.scale.set(.62, index === 2 ? .62 : .82, .62);
      shape.rotation.y = index * Math.PI / 4;
    });

    addCurvedPath([[-5.5, -4], [-10, -8], [-13, -13]], 3.8);
    addCurvedPath([[5.5, -3.5], [10, -7], [13, -12]], 3.8);
    addCurvedPath([[5, 4], [10, 7], [14, 11]], 3.8);
    addCurvedPath([[-5, 4], [-10, 7], [-14, 11]], 3.8);
  }

  function addOrganicPatch({ x, z, rx, rz, mat, seed = 0 }) {
    const shape = new THREE.Shape();
    const count = 18;
    for (let index = 0; index <= count; index += 1) {
      const angle = index / count * Math.PI * 2;
      const wobble = 1 + Math.sin(angle * 3 + seed) * .08 + Math.cos(angle * 5 - seed) * .045;
      const px = x + Math.cos(angle) * rx * wobble;
      const pz = z + Math.sin(angle) * rz * wobble;
      if (index === 0) shape.moveTo(px, pz); else shape.lineTo(px, pz);
    }
    const geometry = new THREE.ShapeGeometry(shape, 1);
    geometry.rotateX(-Math.PI / 2);
    const patch = mesh(geometry, mat);
    patch.position.y = .045;
    patch.receiveShadow = true;
    return patch;
  }

  function addCurvedPath(points, width = 3.2) {
    const control = points.map(([x, z]) => new THREE.Vector3(x, 0, z));
    const curve = new THREE.CatmullRomCurve3(control, false, "centripetal", .45);
    createPathRibbon(curve, width + .72, materials.roadEdge, .065);
    createPathRibbon(curve, width, materials.road, .13);

    const stones = Math.max(5, Math.floor(curve.getLength() / 4));
    for (let index = 1; index < stones; index += 1) {
      const point = curve.getPoint(index / stones);
      const stone = cylinder(root, materials.plaza, point.x, .19, point.z, .5 + (index % 3) * .09, .08, 8);
      stone.scale.z = .72;
      stone.rotation.y = index * 1.7;
    }
  }

  function createPathRibbon(curve, width, mat, y) {
    const segments = Math.max(18, Math.ceil(curve.getLength() * 1.35));
    const positions = [];
    const uvs = [];
    const indices = [];
    for (let index = 0; index <= segments; index += 1) {
      const t = index / segments;
      const point = curve.getPoint(t);
      const tangent = curve.getTangent(t).normalize();
      const nx = -tangent.z;
      const nz = tangent.x;
      positions.push(point.x + nx * width / 2, y, point.z + nz * width / 2);
      positions.push(point.x - nx * width / 2, y, point.z - nz * width / 2);
      uvs.push(0, t * 8, 1, t * 8);
      if (index < segments) {
        const offset = index * 2;
        indices.push(offset, offset + 2, offset + 1, offset + 2, offset + 3, offset + 1);
      }
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    const ribbon = mesh(geometry, mat);
    ribbon.receiveShadow = true;
    return ribbon;
  }

  function buildRiver() {
    const points = [
      new THREE.Vector3(23, 0, -50), new THREE.Vector3(27, 0, -34),
      new THREE.Vector3(28, 0, -17), new THREE.Vector3(24, 0, -1),
      new THREE.Vector3(30, 0, 19), new THREE.Vector3(29, 0, 35),
      new THREE.Vector3(35, 0, 50)
    ];
    const river = new THREE.CatmullRomCurve3(points, false, "centripetal", .42);
    createPathRibbon(river, 7.2, materials.grassDark, .09);
    const water = createPathRibbon(river, 5.65, materials.water, .18);
    water.name = "geometry-river";

    for (let index = 1; index < 22; index += 1) {
      const point = river.getPoint(index / 22);
      if (Math.abs(point.z + 17) > 5 && Math.abs(point.z - 20) > 5) {
        colliders.push({ x: point.x, z: point.z, radius: 2.65 });
      }
    }

    addBridge(28, -17, -.05);
    addBridge(30, 20, .12);

    [[26, -4], [29, 7], [31, 33]].forEach(([x, z], index) => {
      const lily = mesh(new THREE.CircleGeometry(.55 + index * .08, 18), materials.geoboardGreen);
      lily.rotation.x = -Math.PI / 2;
      lily.position.set(x, .205, z);
      const notch = mesh(geometries.sphere8, materials.flowerPink);
      notch.position.set(x + .18, .33, z - .08);
      notch.scale.set(.16, .11, .16);
    });
  }

  function addBridge(x, z, rotation) {
    const bridge = new THREE.Group();
    bridge.position.set(x, 0, z);
    bridge.rotation.y = rotation;
    root.add(bridge);
    box(bridge, materials.darkWood, 0, .31, 0, 9.2, .42, 4.2);
    const plankCount = 9;
    for (let index = 0; index < plankCount; index += 1) {
      box(bridge, materials.woodLight, -4 + index, .57 + Math.sin(index / (plankCount - 1) * Math.PI) * .22, 0, .88, .2, 3.7);
    }
    for (const side of [-1, 1]) {
      box(bridge, materials.wood, 0, 1.2, side * 1.92, 8.7, .14, .14);
      for (const px of [-4, -2, 0, 2, 4]) cylinder(bridge, materials.darkWood, px, .92, side * 1.92, .1, 1.3, 8);
    }
  }

  function placeZone(spec) {
    const group = new THREE.Group();
    group.name = spec.id;
    group.position.set(spec.x, 0, spec.z);

    const towardCenter = new THREE.Vector2(-spec.x, -spec.z).normalize();
    group.rotation.y = Math.atan2(towardCenter.x, towardCenter.y);
    root.add(group);
    spec.build(group);

    const entry = new THREE.Vector3(
      spec.x + towardCenter.x * spec.entryDistance,
      0.08,
      spec.z + towardCenter.y * spec.entryDistance
    );
    addRoad(entry);

    const ringMaterial = materials.ring.clone();
    if (spec.signColor?.color) ringMaterial.color.lerp(spec.signColor.color, .38);
    const ring = mesh(geometries.ring, ringMaterial);
    ring.name = `${spec.id}-entry-ring`;
    ring.rotation.x = -Math.PI / 2;
    ring.position.copy(entry);
    ring.position.y = 0.13;
    ring.userData.animation = { type: "pulse", speed: 1.8, minScale: 0.92, maxScale: 1.08, proximity: 0 };

    const sparklePositions = [];
    for (let index = 0; index < 8; index += 1) {
      const angle = index / 8 * Math.PI * 2;
      const radius = 1.05 + (index % 3) * .22;
      sparklePositions.push(Math.cos(angle) * radius, .18 + (index % 4) * .34, Math.sin(angle) * radius);
    }
    const sparkleGeometry = new THREE.BufferGeometry();
    sparkleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(sparklePositions, 3));
    const sparkleMaterial = new THREE.PointsMaterial({
      color: spec.signColor?.color?.getHex?.() || 0xffd45b,
      size: reducedMotion ? .2 : .34,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0,
      depthWrite: false
    });
    const arrivalFx = new THREE.Points(sparkleGeometry, sparkleMaterial);
    arrivalFx.name = `${spec.id}-arrival-sparkles`;
    arrivalFx.position.set(entry.x, .28, entry.z);
    arrivalFx.visible = false;
    arrivalFx.userData.animation = {
      type: "arrival",
      active: false,
      progress: 0,
      baseY: arrivalFx.position.y,
      phase: spec.x * .11 + spec.z * .07
    };
    root.add(arrivalFx);
    animated.push(arrivalFx);
    addEntrySign(entry, towardCenter, spec.signColor);

    zones.push({
      id: spec.id,
      name: spec.name,
      x: spec.x,
      z: spec.z,
      radius: spec.radius,
      entry,
      group,
      ring,
      entryDoor: group.userData.entryDoor || null,
      arrivalFx,
      labelPosition: new THREE.Vector3(spec.x, spec.labelY || 7, spec.z)
    });
    colliders.push({ x: spec.x, z: spec.z, radius: spec.radius });
  }

  function addEntrySign(entry, towardCenter, faceMaterial) {
    const sign = new THREE.Group();
    sign.position.copy(entry).add(new THREE.Vector3(towardCenter.y * 3.85, 0, -towardCenter.x * 3.85));
    sign.rotation.y = Math.atan2(towardCenter.x, towardCenter.y);
    root.add(sign);
    cylinder(sign, materials.darkWood, 0, .78, 0, .11, 1.56, 8);
    box(sign, materials.woodLight, 0, 1.5, 0, 2.18, .92, .2);
    box(sign, faceMaterial || materials.cream, 0, 1.5, -.13, 1.78, .58, .07);
    box(sign, materials.cream, 0, 1.5, .13, 1.78, .58, .07);
    const cap = mesh(geometries.pyramid, materials.cubeCoral, sign);
    cap.position.set(0, 2.08, 0);
    cap.scale.set(1.22, .44, .44);
    cap.rotation.y = Math.PI / 4;
  }

  function addRoad(entry) {
    const end = entry.clone().multiplyScalar(0.23);
    const delta = entry.clone().sub(end);
    const side = new THREE.Vector3(-delta.z, 0, delta.x).normalize();
    const bend = Math.sin(entry.x * .17 + entry.z * .11) * 4.2;
    const middle = end.clone().lerp(entry, .52).addScaledVector(side, bend);
    addCurvedPath([[end.x, end.z], [middle.x, middle.z], [entry.x, entry.z]], 3.15);
  }

  function buildCubeCastle(group) {
    const plinth = box(group, materials.darkWood, 0, .42, .15, 12.2, .84, 8.8);
    plinth.receiveShadow = true;
    box(group, materials.woodLight, 0, 1.55, 0, 10.8, 2.25, 7.45);
    box(group, materials.cream, 0, 3.55, -.5, 8.5, 2.15, 5.5);
    box(group, materials.darkWood, 0, 2.18, 3.79, 2.28, 3.6, .28);
    box(group, materials.wood, 0, 4.75, .15, 11.9, .58, 8.2);

    for (const x of [-3.45, -1.15, 1.15, 3.45]) {
      box(group, materials.darkWood, x, 2.05, 3.77, 1.08, 1.35, .15);
      box(group, materials.origamiBlue, x, 2.05, 3.88, .77, 1.03, .08);
      box(group, materials.cream, x, 2.05, 3.94, .08, 1.03, .06);
      box(group, materials.cream, x, 2.05, 3.94, .77, .08, .06);
    }

    for (let step = 0; step < 4; step += 1) {
      box(group, materials.woodLight, 0, .18 + step * .18, 4.85 - step * .48, 4.3 - step * .55, .18, .78);
    }
    addEntryDoor(group, materials.cubeCoral, {
      y: 2.2, z: 3.98, width: 1.25, height: 2.55, depth: .18,
      windowMaterial: materials.cream, windowY: .35, glowColor: 0xffcb68
    });

    const balcony = box(group, materials.darkWood, 0, 4.42, 3.1, 6.3, .25, 1.2);
    balcony.receiveShadow = true;
    for (const x of [-2.65, -1.75, -.85, 0, .85, 1.75, 2.65]) {
      cylinder(group, materials.woodLight, x, 4.95, 3.55, .09, 1.05, 8);
    }
    box(group, materials.woodLight, 0, 5.42, 3.55, 6.15, .15, .15);

    const blockColors = [materials.cubeGold, materials.origamiBlue, materials.cubeCoral, materials.geoboardGreen];
    const towers = [[-4.5, -2.4], [4.5, -2.4], [-4.5, 2.45], [4.5, 2.45]];
    towers.forEach(([x, z], index) => {
      box(group, blockColors[index], x, 6, z, 2.35, 3.25, 2.35);
      box(group, materials.darkWood, x, 6, z + 1.21, 1.05, 1.35, .12);
      box(group, materials.cream, x, 6, z + 1.29, .72, 1.02, .07);
      box(group, materials.cream, x, 7.45, z, 2.6, .45, 2.6);
      const roof = mesh(index % 2 ? geometries.pyramid : geometries.cone6, index % 2 ? materials.origamiPink : materials.cubeCoral, group);
      roof.position.set(x, 8.72, z);
      roof.scale.set(1.45, 2.05, 1.45);
      roof.rotation.y = Math.PI / 4;
      cylinder(group, materials.darkWood, x, 10.05, z, .055, .95, 8);
      const flag = box(group, index % 2 ? materials.cubeGold : materials.origamiBlue, x + .38, 10.28, z, .72, .38, .05);
      flag.rotation.z = -.12;
    });

    const stacked = [
      [-2.8, 5.85, -.25, materials.geoboardGreen], [-.85, 5.85, -.25, materials.origamiBlue],
      [1.1, 5.85, -.25, materials.cubeCoral], [3.05, 5.85, -.25, materials.cubeGold],
      [-1.65, 7.65, -.35, materials.cubeWood], [.85, 7.65, -.35, materials.cubeWood]
    ];
    stacked.forEach(([x, y, z, mat]) => box(group, mat, x, y, z, 1.65, 1.65, 1.65));
    const crown = cylinder(group, materials.origamiBlue, 0, 9.1, -.35, .82, 2.5, 8);
    crown.rotation.y = Math.PI / 8;

    for (const side of [-1, 1]) {
      const bed = box(group, materials.darkWood, side * 6.9, .28, 2.6, 2.7, .55, 4.4);
      bed.receiveShadow = true;
      box(group, materials.grassLight, side * 6.9, .59, 2.6, 2.35, .16, 4.05);
      for (let row = 0; row < 3; row += 1) {
        for (let column = 0; column < 2; column += 1) {
          const bloom = mesh(geometries.sphere8, (row + column) % 2 ? materials.flowerPink : materials.flowerYellow, group);
          bloom.position.set(side * (6.35 + column * .85), .9, 1.35 + row * 1.15);
          bloom.scale.set(.25, .18, .25);
        }
      }
    }

    for (const side of [-1, 1]) {
      const fence = new THREE.Group();
      fence.position.set(side * 7.65, 0, -.25);
      group.add(fence);
      for (let index = -2; index <= 2; index += 1) {
        cylinder(fence, materials.woodLight, 0, .72, index * 1.3, .12, 1.44, 8);
      }
      box(fence, materials.wood, 0, .58, 0, .15, .15, 5.5);
      box(fence, materials.wood, 0, 1.03, 0, .15, .15, 5.5);
    }

    [[-9.3, -2.6], [9.3, -2.6], [-9.4, 4.4], [9.4, 4.4]].forEach(([x, z], index) => {
      cylinder(group, materials.trunk, x, 1.25, z, .36, 2.5, 8);
      const crown = mesh(geometries.sphere8, index % 2 ? materials.leavesLight : materials.leaves, group);
      crown.position.set(x, 3.15, z);
      crown.scale.set(1.45, 1.7, 1.45);
    });

    // A small block cart gives the castle entrance a lived-in workshop feel.
    const cart = new THREE.Group();
    cart.position.set(5.55, 0, 5.75);
    cart.rotation.y = -.16;
    group.add(cart);
    box(cart, materials.darkWood, 0, .6, 0, 3.15, .22, 1.75);
    box(cart, materials.woodLight, 0, .9, 0, 2.85, .48, 1.55);
    for (const x of [-1.12, 1.12]) {
      for (const z of [-.78, .78]) {
        const wheel = cylinder(cart, materials.darkWood, x, .36, z, .32, .18, 8);
        wheel.rotation.x = Math.PI / 2;
      }
    }
    const cartBlocks = compact
      ? [[-.62, 1.45, 0, materials.cubeGold], [.48, 1.45, .1, materials.origamiBlue]]
      : [[-.83, 1.45, -.28, materials.cubeGold], [.02, 1.45, -.28, materials.origamiBlue], [.87, 1.45, -.28, materials.cubeCoral], [-.38, 1.45, .48, materials.cubeWood], [.47, 1.45, .48, materials.geoboardGreen], [.06, 2.28, .08, materials.cubeWood]];
    cartBlocks.forEach(([x, y, z, mat]) => box(cart, mat, x, y, z, .72, .72, .72));
  }

  function buildOrigamiStudio(group) {
    box(group, materials.darkWood, 0, .32, 0, 7.8, .64, 5.9);
    box(group, materials.cream, 0, 1.65, -0.25, 6.55, 2.75, 4.65);
    box(group, materials.darkWood, 0, 1.45, 2.16, 1.55, 2.45, .24);
    addEntryDoor(group, materials.origamiBlue, {
      y: 1.42, z: 2.31, width: 1.18, height: 2.1, depth: .08,
      accentMaterial: materials.cubeCoral, stripeWidth: .12, glowColor: 0xff9fb0
    });

    for (const x of [-2.12, 2.12]) {
      box(group, materials.darkWood, x, 1.72, 2.16, 1.2, 1.18, .2);
      box(group, materials.origamiBlue, x, 1.72, 2.29, .9, .88, .07);
      box(group, materials.cream, x, 1.72, 2.36, .08, .88, .04);
      box(group, materials.cream, x, 1.72, 2.36, .9, .08, .04);
    }

    for (let step = 0; step < 3; step += 1) {
      box(group, materials.woodLight, 0, .14 + step * .15, 3.28 - step * .42, 3.2 - step * .45, .16, .7);
    }

    const roofLeft = mesh(geometries.wedge, materials.origamiPink, group);
    roofLeft.position.set(-1.73, 3.78, -0.1);
    roofLeft.scale.set(3.55, 2.25, 5.45);
    const roofRight = mesh(geometries.wedge, materials.origamiBlue, group);
    roofRight.position.set(1.73, 3.78, -0.1);
    roofRight.scale.set(-3.55, 2.25, 5.45);

    box(group, materials.woodLight, 0, 3.03, 2.32, 7.15, .2, .28);
    const roundWindow = mesh(new THREE.CircleGeometry(.55, 28), materials.cubeGold, group);
    roundWindow.position.set(0, 2.85, 2.48);
    const roundInset = mesh(new THREE.CircleGeometry(.36, 24), materials.origamiBlue, group);
    roundInset.position.set(0, 2.85, 2.52);

    const crane = new THREE.Group();
    crane.position.set(0, 5.55, 0);
    group.add(crane);
    const body = mesh(geometries.pyramid, materials.cream, crane);
    body.rotation.z = Math.PI / 4;
    body.scale.set(0.65, 1.5, 0.65);
    const wingA = box(crane, materials.origamiPink, -0.75, 0, 0, 1.2, 0.12, 0.8);
    wingA.rotation.z = -0.35;
    const wingB = box(crane, materials.origamiBlue, 0.75, 0, 0, 1.2, 0.12, 0.8);
    wingB.rotation.z = 0.35;
    crane.userData.animation = { type: "sway", axis: "z", base: 0, amplitude: .055, speed: 1.25, phase: .4 };
    animated.push(crane);

    const bunting = new THREE.Group();
    bunting.position.set(0, 4.15, 2.75);
    group.add(bunting);
    box(bunting, materials.darkWood, 0, 0, 0, 5.65, .035, .035);
    const paperColors = [materials.origamiPink, materials.cubeGold, materials.origamiBlue, materials.geoboardGreen, materials.cubeCoral];
    const paperCount = compact ? 3 : 5;
    for (let index = 0; index < paperCount; index += 1) {
      const x = (index - (paperCount - 1) / 2) * 1.08;
      const flag = mesh(geometries.pyramid, paperColors[index], bunting);
      flag.position.set(x, -.33 - Math.abs(x) * .035, .02);
      flag.scale.set(.34, .58, .08);
      flag.rotation.z = Math.PI;
      flag.userData.animation = { type: "sway", axis: "z", base: Math.PI, amplitude: .055, speed: 1.45, phase: index * .7 };
      animated.push(flag);
    }

    for (const side of [-1, 1]) {
      const planter = box(group, materials.darkWood, side * 3.85, .34, 1.55, 1.25, .55, 2.4);
      planter.receiveShadow = true;
      box(group, materials.grassLight, side * 3.85, .65, 1.55, 1.02, .15, 2.12);
      for (let index = 0; index < 3; index += 1) {
        const bloom = mesh(geometries.sphere8, index % 2 ? materials.flowerBlue : materials.flowerPink, group);
        bloom.position.set(side * 3.85, .91, .75 + index * .78);
        bloom.scale.set(.22, .15, .22);
      }
    }
  }

  function buildMirrorManor(group) {
    box(group, materials.darkWood, 0, .34, 0, 8.6, .68, 6.2);
    box(group, materials.cream, 0, 1.8, -.35, 7.45, 2.95, 4.8);

    for (const side of [-1, 1]) {
      box(group, materials.mirrorBlue, side * 2.25, 2.25, -.35, 2.55, 3.8, 4.95);
      const roof = mesh(geometries.pyramid, materials.mirrorSilver, group);
      roof.position.set(side * 2.25, 4.92, -.35);
      roof.scale.set(2.45, 1.72, 2.45);
      roof.rotation.y = Math.PI / 4;

      box(group, materials.darkWood, side * 2.25, 2.28, 2.2, 1.35, 1.65, .18);
      box(group, materials.mirrorSilver, side * 2.25, 2.28, 2.32, 1.06, 1.36, .08);
      box(group, materials.cream, side * 2.25, 2.28, 2.39, .09, 1.36, .04);
      box(group, materials.cream, side * 2.25, 2.28, 2.39, 1.06, .09, .04);
    }

    box(group, materials.darkWood, 0, 1.5, 2.3, 1.55, 2.55, .25);
    addEntryDoor(group, materials.mirrorBlue, {
      y: 1.48, z: 2.45, width: 1.18, height: 2.2, depth: .08, glowColor: 0x8ce8ff
    });
    const crest = mesh(geometries.pyramid, materials.crystalPink, group);
    crest.position.set(0, 4.72, 1.2);
    crest.scale.set(1.35, 1.75, .55);
    crest.rotation.y = Math.PI / 4;

    for (const x of [-3.55, -1.05, 1.05, 3.55]) {
      cylinder(group, materials.mirrorSilver, x, 2.2, 2.5, .23, 3.7, 8);
      const cap = mesh(geometries.sphere8, materials.crystal, group);
      cap.position.set(x, 4.15, 2.5);
      cap.scale.setScalar(.36);
    }

    for (let step = 0; step < 3; step += 1) {
      box(group, materials.mirrorSilver, 0, .17 + step * .14, 3.45 - step * .4, 3.35 - step * .45, .16, .68);
    }

    for (const side of [-1, 1]) {
      box(group, materials.grassDark, side * 5, .42, .7, 1.2, .8, 4.6);
      for (let index = 0; index < 4; index += 1) {
        const hedge = mesh(geometries.sphere8, materials.leaves, group);
        hedge.position.set(side * 5, 1.0, -1 + index * 1.2);
        hedge.scale.set(.7, .65, .72);
      }
    }

    for (const side of [-1, 1]) {
      const gardenMirror = new THREE.Group();
      gardenMirror.position.set(side * 5.8, 0, 3.2);
      gardenMirror.rotation.y = side * -.1;
      group.add(gardenMirror);
      cylinder(gardenMirror, materials.darkWood, 0, .78, 0, .1, 1.56, 8);
      const frame = mesh(geometries.torus, materials.mirrorBlue, gardenMirror);
      frame.position.set(0, 1.62, 0);
      frame.scale.set(.58, .76, .58);
      const glass = mesh(new THREE.CircleGeometry(.49, compact ? 16 : 28), materials.mirrorSilver, gardenMirror);
      glass.position.set(0, 1.62, .015);
      glass.scale.y = 1.28;
      const glint = mesh(geometries.crystal, materials.crystal, gardenMirror);
      glint.position.set(side * -.34, 2.05, .08);
      glint.scale.set(.13, .21, .13);
      glint.userData.animation = { type: "bob", baseY: 2.05, amplitude: .08, speed: 1.7 + side * .15 };
      animated.push(glint);
    }
  }

  function buildGeoboardYard(group) {
    const deck = box(group, materials.darkWood, 0, 0.28, 0, 8.4, 0.56, 6.6);
    deck.receiveShadow = shadows;
    box(group, materials.woodLight, 0, 1.62, -1.25, 7.15, 2.7, 3.6);
    const roof = mesh(geometries.pyramid, materials.geoboardGreen, group);
    roof.position.set(0, 3.82, -1.25);
    roof.scale.set(4.45, 1.65, 3.2);
    roof.rotation.y = Math.PI / 4;

    box(group, materials.darkWood, 0, 2.75, 2.25, 7.05, 5.65, .34);
    box(group, materials.geoboardGreen, 0, 2.75, 2.48, 6.48, 5.08, .12);
    box(group, materials.geoboardGreen, 0, 2.75, 2.02, 6.48, 5.08, .12);
    for (const x of [-3.2, 3.2]) cylinder(group, materials.woodLight, x, 1.6, 2.22, .2, 3.1, 8);
    box(group, materials.wood, 0, .62, 2.5, 7.45, .34, 1.1);

    const pegGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.42, 6);
    const pegs = new THREE.InstancedMesh(pegGeometry, materials.peg, 25);
    pegs.name = "geoboard-pegs";
    pegs.castShadow = shadows;
    const matrix = new THREE.Matrix4();
    let index = 0;
    for (let row = 0; row < 5; row += 1) {
      for (let column = 0; column < 5; column += 1) {
        matrix.compose(
          new THREE.Vector3(-2.3 + column * 1.15, 1.08 + row * 0.82, 2.7),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0)),
          new THREE.Vector3(1, 1, 1)
        );
        pegs.setMatrixAt(index++, matrix);
      }
    }
    group.add(pegs);

    const backPegs = new THREE.InstancedMesh(pegGeometry, materials.peg, 25);
    backPegs.name = "geoboard-back-pegs";
    backPegs.castShadow = shadows;
    index = 0;
    for (let row = 0; row < 5; row += 1) {
      for (let column = 0; column < 5; column += 1) {
        matrix.compose(
          new THREE.Vector3(-2.3 + column * 1.15, 1.08 + row * .82, 1.8),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)),
          new THREE.Vector3(1, 1, 1)
        );
        backPegs.setMatrixAt(index++, matrix);
      }
    }
    group.add(backPegs);

    const bands = [
      [[-2.3, 1.05], [0, 3.5]],
      [[0, 3.5], [2.3, 1.87]],
      [[2.3, 1.87], [-1.15, 4.33]]
    ];
    bands.forEach(([a, b]) => {
      addBand(group, a, b, 2.72);
      addBand(group, a, b, 1.76);
    });

    box(group, materials.darkWood, -2.15, 1.42, .62, 1.22, 2.25, .18);
    addEntryDoor(group, materials.cubeCoral, {
      x: -2.15, y: 1.42, z: .73, width: .9, height: 1.92, depth: .08, glowColor: 0x8de6aa
    });
    for (const x of [.25, 2.05]) {
      box(group, materials.darkWood, x, 1.72, .62, 1.22, 1.1, .18);
      box(group, materials.origamiBlue, x, 1.72, .73, .9, .8, .08);
    }

    for (let index = 0; index < 4; index += 1) {
      const spool = cylinder(group, index % 2 ? materials.origamiPink : materials.cubeGold, -2.6 + index * 1.7, .75, 3.45, .42, .62, 8);
      spool.rotation.z = Math.PI / 2;
    }

    const makerTable = new THREE.Group();
    makerTable.position.set(2.45, 0, 4.25);
    group.add(makerTable);
    box(makerTable, materials.darkWood, 0, .8, 0, 3.15, .18, 1.2);
    box(makerTable, materials.woodLight, 0, .94, 0, 2.88, .12, 1.02);
    for (const x of [-1.15, 1.15]) {
      for (const z of [-.38, .38]) cylinder(makerTable, materials.darkWood, x, .39, z, .09, .78, 8);
    }
    const sampleBoard = box(makerTable, materials.geoboardGreen, 0, 1.55, 0, 1.45, 1.15, .12);
    sampleBoard.rotation.x = -.12;
    const wheel = mesh(geometries.torus, materials.cubeGold, makerTable);
    wheel.position.set(0, 1.57, .1);
    wheel.scale.setScalar(.42);
    wheel.userData.animation = { type: "spin", axis: "z", speed: .36 };
    animated.push(wheel);
  }

  function addBand(group, a, b, z = 2.72) {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const band = box(group, materials.cubeCoral, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, z, Math.hypot(dx, dy), 0.11, 0.09);
    band.rotation.z = Math.atan2(dy, dx);
  }

  function buildCrystalPlaza(group) {
    const platformBase = cylinder(group, materials.darkWood, 0, .22, 0, 5.15, .44, 8);
    platformBase.rotation.y = Math.PI / 8;
    const platform = cylinder(group, materials.mirrorSilver, 0, 0.48, 0, 4.7, 0.42, 8);
    platform.rotation.y = Math.PI / 8;
    const canopy = cylinder(group, materials.crystal, 0, 4.25, -0.5, 3.75, 0.28, 8);
    canopy.rotation.y = Math.PI / 8;

    for (const x of [-2.7, 2.7]) {
      for (const z of [-1.7, 1.7]) {
        cylinder(group, materials.mirrorSilver, x, 2.28, z, 0.2, 3.75, 8);
        const cap = mesh(geometries.crystal, materials.crystalPink, group);
        cap.position.set(x, 4.3, z);
        cap.scale.set(.34, .58, .34);
      }
    }
    box(group, materials.darkWood, 0, 1.45, 2.35, 1.65, 2.65, .22);
    addEntryDoor(group, materials.crystalPink, {
      y: 1.45, z: 2.49, width: 1.32, height: 2.3, depth: .08, glowColor: 0xffa8db
    });

    for (const x of [-1.75, 1.75]) {
      const display = cylinder(group, materials.cream, x, .88, 1.1, .72, .9, 8);
      display.rotation.y = Math.PI / 8;
      const gem = mesh(geometries.crystal, x < 0 ? materials.crystalPink : materials.crystal, group);
      gem.position.set(x, 1.8, 1.1);
      gem.scale.set(.45, .72, .45);
      gem.userData.animation = { type: "spin", speed: x < 0 ? .22 : -.19 };
      animated.push(gem);
    }

    const crystalPositions = [[0, 1.75, -0.5, 1.35], [-1.65, 1.18, -0.1, .82], [1.65, 1.08, .05, .78]];
    crystalPositions.forEach(([x, y, z, scale], index) => {
      const crystal = mesh(geometries.crystal, index === 1 ? materials.crystalPink : materials.crystal, group);
      crystal.position.set(x, y, z);
      crystal.scale.set(scale * 0.65, scale * 1.55, scale * 0.65);
      crystal.userData.animation = { type: "spin", speed: 0.18 + index * 0.07 };
      animated.push(crystal);
    });

    const halo = mesh(new THREE.TorusGeometry(2.05, .09, 10, 42), materials.ring, group);
    halo.position.set(0, 2.55, -.7);
    halo.rotation.y = Math.PI / 2;
    halo.userData.animation = { type: "spin", speed: .12 };
    animated.push(halo);

    for (let step = 0; step < 3; step += 1) {
      box(group, materials.mirrorSilver, 0, .15 + step * .15, 4.55 - step * .45, 3.8 - step * .5, .16, .72);
    }

    const lanternCount = compact ? 2 : 4;
    for (let index = 0; index < lanternCount; index += 1) {
      const side = index % 2 ? 1 : -1;
      const row = Math.floor(index / 2);
      const lantern = new THREE.Group();
      lantern.position.set(side * (4.1 + row * .72), 0, 3.5 - row * 1.2);
      group.add(lantern);
      cylinder(lantern, materials.mirrorSilver, 0, .52, 0, .42, .52, 8);
      const gem = mesh(geometries.crystal, index % 2 ? materials.crystalPink : materials.crystal, lantern);
      gem.position.set(0, 1.28, 0);
      gem.scale.set(.32, .58, .32);
      gem.userData.animation = { type: "bob", baseY: 1.28, amplitude: .09, speed: 1.45 + index * .17 };
      animated.push(gem);
    }
  }

  function buildPathWalk(group) {
    const deck = box(group, materials.darkWood, 0, .2, 0, 8.2, .4, 8.2);
    deck.receiveShadow = shadows;
    box(group, materials.grassLight, 0, .48, 0, 7.7, .18, 7.7);
    const masks = [6, 12, 6, 5, 3, 9, 3, 10, 12];
    const arms = [
      [1, 0, -.6, .92, .12, .26],
      [2, .6, 0, .26, .12, .92],
      [4, 0, .6, .92, .12, .26],
      [8, -.6, 0, .26, .12, .92]
    ];
    masks.forEach((mask, index) => {
      const row = Math.floor(index / 3);
      const column = index % 3;
      const x = (column - 1) * 2.15;
      const z = (row - 1) * 2.15;
      box(group, materials.cream, x, .67, z, 1.9, .18, 1.9);
      arms.forEach(([bit, dx, dz, sx, sy, sz]) => {
        if (mask & bit) box(group, materials.shapeSun, x + dx, .82, z + dz, sx, sy, sz);
      });
      cylinder(group, materials.shapeSun, x, .83, z, .33, .12, 8);
    });
    const sign = new THREE.Group();
    sign.position.set(0, 0, -5);
    group.add(sign);
    cylinder(sign, materials.darkWood, 0, 1.4, 0, .12, 1.4, 8);
    box(sign, materials.cream, 0, 2.8, 0, 3.6, 1.15, .28);
    box(sign, materials.shapeMint, 0, 2.8, .17, 3.25, .82, .08);
  }

  function buildShapeGarden(group) {
    const deck = box(group, materials.darkWood, 0, .3, 0, 9.4, .6, 6.8);
    deck.receiveShadow = shadows;
    box(group, materials.woodLight, 0, .72, 0, 8.75, .28, 6.15);

    // The interlocking facade previews the pieces children manipulate inside.
    box(group, materials.cream, 0, 2.35, -1.15, 7.5, 3.1, 3.65);
    box(group, materials.darkWood, 0, 3.9, -1.15, 8.05, .3, 4.15);
    const roof = mesh(geometries.pyramid, materials.shapeMint, group);
    roof.position.set(0, 5.05, -1.15);
    roof.scale.set(4.85, 1.75, 3.45);
    roof.rotation.y = Math.PI / 4;

    box(group, materials.darkWood, 0, 1.72, 1.02, 1.65, 2.55, .25);
    addEntryDoor(group, materials.shapeBlue, {
      y: 1.7, z: 1.17, width: 1.24, height: 2.18, depth: .08,
      accentMaterial: materials.shapeSun, stripeWidth: .12,
      windowMaterial: materials.cream, windowY: .34, glowColor: 0x79e6b7
    });

    [-2.35, 2.35].forEach((x) => {
      box(group, materials.darkWood, x, 2.15, .72, 1.45, 1.45, .2);
      box(group, materials.shapeBlue, x, 2.15, .84, 1.12, 1.12, .08);
      box(group, materials.cream, x, 2.15, .9, .08, 1.12, .04);
      box(group, materials.cream, x, 2.15, .9, 1.12, .08, .04);
    });

    const tileColors = [materials.shapeMint, materials.shapeBlue, materials.shapeSun, materials.shapeCoral];
    const facadePieces = [
      { cells: [[0, 0], [1, 0], [2, 0], [0, 1]], x: -2.55, y: 3.35, color: 0 },
      { cells: [[0, 0], [1, 0], [1, 1], [2, 1]], x: .65, y: 3.2, color: 2 }
    ];
    facadePieces.forEach((piece) => {
      piece.cells.forEach(([column, row]) => {
        box(group, tileColors[piece.color], piece.x + column * .62, piece.y + row * .62, .96, .54, .54, .12);
      });
    });

    for (let step = 0; step < 3; step += 1) {
      box(group, materials.woodLight, 0, .17 + step * .15, 3.18 - step * .4, 3.5 - step * .42, .16, .68);
    }

    const gardenPieces = [
      { x: -5.05, z: .5, cells: [[0, 0], [1, 0], [1, 1]], mat: materials.shapeCoral },
      { x: 3.9, z: .25, cells: [[0, 0], [0, 1], [1, 1], [2, 1]], mat: materials.shapeSun }
    ];
    gardenPieces.forEach((piece, pieceIndex) => {
      const bed = box(group, materials.darkWood, piece.x + 1, .28, piece.z, 3.35, .5, 2.85);
      bed.receiveShadow = true;
      box(group, materials.grassLight, piece.x + 1, .56, piece.z, 3.05, .16, 2.55);
      piece.cells.forEach(([column, row], cellIndex) => {
        const tile = box(group, piece.mat, piece.x + column * .82, .88, piece.z - .62 + row * .82, .68, .2, .68);
        tile.rotation.y = (pieceIndex ? -.06 : .06) * cellIndex;
      });
    });

    const mobile = new THREE.Group();
    mobile.position.set(0, 6.45, -1.1);
    group.add(mobile);
    cylinder(mobile, materials.darkWood, 0, .15, 0, .06, 1.35, 8);
    const emblemCells = [[-1, 0], [0, 0], [1, 0], [0, 1]];
    emblemCells.forEach(([column, row], index) => {
      const tile = box(mobile, tileColors[index], column * .5, .88 + row * .5, 0, .42, .42, .18);
      tile.rotation.z = .08 * (index - 1.5);
    });
    mobile.userData.animation = { type: "sway", axis: "y", base: 0, amplitude: .12, speed: .72, phase: .6 };
    animated.push(mobile);

    for (const side of [-1, 1]) {
      cylinder(group, materials.trunk, side * 5.25, 1.05, -2.75, .3, 2.1, 8);
      const crown = mesh(geometries.sphere8, side < 0 ? materials.leavesLight : materials.leaves, group);
      crown.position.set(side * 5.25, 2.7, -2.75);
      crown.scale.set(1.18, 1.42, 1.18);
    }
  }

  function buildFutureDistricts() {
    const lots = [
      { id: "spatialDistrict", x: -57, z: 20, color: materials.cubeGold, shape: geometries.cylinder6 },
      { id: "coordinateDistrict", x: 57, z: -37, color: materials.crystalPink, shape: geometries.crystal }
    ];
    lots.forEach((lot, index) => {
      const district = new THREE.Group();
      district.name = lot.id;
      district.position.set(lot.x, 0, lot.z);
      root.add(district);
      const deck = cylinder(district, materials.roadEdge, 0, .06, 0, 4.2, .16, 8);
      deck.rotation.y = Math.PI / 8;
      const top = cylinder(district, materials.plaza, 0, .18, 0, 3.75, .14, 8);
      top.rotation.y = Math.PI / 8;
      for (const [px, pz] of [[-2.8, -2.25], [2.8, -2.25], [-2.8, 2.25], [2.8, 2.25]]) {
        cylinder(district, materials.woodLight, px, .78, pz, .1, 1.5, 8);
      }
      for (const side of [-1, 1]) {
        box(district, materials.wood, 0, .82, side * 2.25, 5.55, .1, .1);
        box(district, materials.wood, side * 2.8, .82, 0, .1, .1, 4.45);
      }
      const awning = mesh(geometries.pyramid, index % 2 ? materials.origamiBlue : materials.cubeGold, district);
      awning.position.set(0, 2.15, -1.35);
      awning.scale.set(2.15, 1.25, 1.65);
      awning.rotation.y = Math.PI / 4;
      const symbol = mesh(lot.shape, lot.color, district);
      symbol.position.set(0, 1.35, .75);
      symbol.scale.set(.72, index === 1 ? 1.05 : 1.15, .72);
      symbol.userData.animation = { type: "spin", speed: .1 + index * .035 };
      animated.push(symbol);
      const towardCenter = new THREE.Vector2(-lot.x, -lot.z).normalize();
      const entry = new THREE.Vector3(lot.x + towardCenter.x * 5.4, .08, lot.z + towardCenter.y * 5.4);
      addRoad(entry);
      addEntrySign(entry, towardCenter, lot.color);

      const ringMaterial = materials.ring.clone();
      if (lot.color?.color) ringMaterial.color.lerp(lot.color.color, .42);
      const ring = mesh(geometries.ring, ringMaterial);
      ring.name = `${lot.id}-entry-ring`;
      ring.rotation.x = -Math.PI / 2;
      ring.position.copy(entry);
      ring.position.y = .13;
      ring.userData.animation = { type: "pulse", speed: 1.8, minScale: .92, maxScale: 1.08, proximity: 0 };

      const sparklePositions = [];
      for (let sparkle = 0; sparkle < 8; sparkle += 1) {
        const angle = sparkle / 8 * Math.PI * 2;
        const radius = 1.05 + (sparkle % 3) * .22;
        sparklePositions.push(Math.cos(angle) * radius, .18 + (sparkle % 4) * .34, Math.sin(angle) * radius);
      }
      const sparkleGeometry = new THREE.BufferGeometry();
      sparkleGeometry.setAttribute("position", new THREE.Float32BufferAttribute(sparklePositions, 3));
      const sparkleMaterial = new THREE.PointsMaterial({
        color: lot.color?.color?.getHex?.() || 0xffd45b,
        size: reducedMotion ? .2 : .34,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0,
        depthWrite: false
      });
      const arrivalFx = new THREE.Points(sparkleGeometry, sparkleMaterial);
      arrivalFx.name = `${lot.id}-arrival-sparkles`;
      arrivalFx.position.set(entry.x, .28, entry.z);
      arrivalFx.visible = false;
      arrivalFx.userData.animation = {
        type: "arrival",
        active: false,
        progress: 0,
        baseY: arrivalFx.position.y,
        phase: lot.x * .11 + lot.z * .07
      };
      root.add(arrivalFx);
      animated.push(arrivalFx);

      districts.push({
        id: lot.id,
        x: lot.x,
        z: lot.z,
        radius: 3.9,
        entry,
        group: district,
        ring,
        arrivalFx,
        labelPosition: new THREE.Vector3(lot.x, 4.9, lot.z)
      });
      colliders.push({ x: lot.x, z: lot.z, radius: 3.9 });
    });
  }

  function buildDecorations() {
    const treePositions = [
      [-66, -44], [-56, -45], [-43, -46], [-27, -46], [-13, -45], [14, -45], [28, -46], [46, -45], [64, -43],
      [-66, 43], [-52, 45], [-36, 44], [-20, 45], [29, 45], [46, 44], [64, 42],
      [-67, -28], [-67, -10], [-66, 9], [-66, 30], [67, -25], [67, -7], [66, 11], [67, 31],
      [-28, -12], [-17, -24], [18, -23], [27, -6], [25, 11], [12, 23], [-10, 30], [-42, 8], [-19, 9]
    ];
    for (let x = -61; x <= 61; x += 7) {
      treePositions.push([x, -44 + Math.sin(x) * 1.4], [x + 2.5, 44 + Math.cos(x) * 1.4]);
    }
    for (let z = -36; z <= 36; z += 7) {
      treePositions.push([-63 + Math.sin(z) * 1.5, z], [63 + Math.cos(z) * 1.5, z + 2]);
    }
    treePositions.push(
      [-54, -18], [-50, -14], [-56, -11], [-48, 12], [-53, 16], [-47, 20],
      [52, -34], [57, -29], [52, -25], [50, 34], [56, 31], [57, 37]
    );
    const trunks = new THREE.InstancedMesh(geometries.cylinder6, materials.trunk, treePositions.length);
    const crowns = new THREE.InstancedMesh(geometries.cone6, materials.leaves, treePositions.length);
    trunks.name = "village-tree-trunks";
    crowns.name = "village-tree-crowns";
    trunks.castShadow = shadows;
    crowns.castShadow = shadows;
    trunks.receiveShadow = shadows;
    crowns.receiveShadow = shadows;
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    treePositions.forEach(([x, z], index) => {
      matrix.compose(new THREE.Vector3(x, 1.05, z), quaternion, new THREE.Vector3(0.46, 2.1, 0.46));
      trunks.setMatrixAt(index, matrix);
      const height = 2.15 + (index % 3) * 0.16;
      matrix.compose(new THREE.Vector3(x, 3.25, z), quaternion, new THREE.Vector3(1.65, height, 1.65));
      crowns.setMatrixAt(index, matrix);
      colliders.push({ x, z, radius: 0.85 });
    });
    root.add(trunks, crowns);

    const lampPositions = [
      [-5.8, -5.8], [5.8, -5.8], [5.8, 5.8], [-5.8, 5.8], [0, -10], [10, 0], [0, 10], [-10, 0],
      [-20, 0], [20, 0], [0, -20], [0, 20], [-35, -13], [34, -10], [-21, 20], [35, 17]
    ];
    const poles = new THREE.InstancedMesh(geometries.cylinder8, materials.lamp, lampPositions.length);
    const bulbs = new THREE.InstancedMesh(geometries.sphere8, materials.lampGlow, lampPositions.length);
    poles.name = "village-lamp-poles";
    bulbs.name = "village-lamp-bulbs";
    poles.castShadow = shadows;
    lampPositions.forEach(([x, z], index) => {
      matrix.compose(new THREE.Vector3(x, 1.25, z), quaternion, new THREE.Vector3(0.11, 2.5, 0.11));
      poles.setMatrixAt(index, matrix);
      matrix.compose(new THREE.Vector3(x, 2.65, z), quaternion, new THREE.Vector3(0.25, 0.25, 0.25));
      bulbs.setMatrixAt(index, matrix);
    });
    root.add(poles, bulbs);

    const flowerPositions = [
      [-12, -4], [-13, -3], [-11, -2.5], [13, -3], [12, -1.8], [14, -1.5],
      [12, 4], [13.2, 5], [11.2, 5.4], [-13, 4], [-12, 5.4], [-14, 5.2]
    ];
    const flowerMaterials = [materials.flowerPink, materials.flowerBlue, materials.flowerYellow];
    flowerMaterials.forEach((flowerMaterial, colorIndex) => {
      const selected = flowerPositions.filter((_, index) => index % flowerMaterials.length === colorIndex);
      const flowers = new THREE.InstancedMesh(geometries.sphere8, flowerMaterial, selected.length);
      flowers.name = `village-flowers-${colorIndex}`;
      selected.forEach(([x, z], index) => {
        matrix.compose(new THREE.Vector3(x, 0.18, z), quaternion, new THREE.Vector3(0.2, 0.12, 0.2));
        flowers.setMatrixAt(index, matrix);
      });
      root.add(flowers);
    });

    const broadleafTrees = [[-23, -16], [21, -14], [-18, 18], [18, 18], [-52, -8], [53, 7], [-8, 37], [8, 38]];
    broadleafTrees.forEach(([x, z], index) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);
      root.add(tree);
      cylinder(tree, materials.trunk, 0, 1.35, 0, .42, 2.7, 8);
      const crownMaterial = index % 2 ? materials.leavesLight : materials.leaves;
      [[0, 3.15, 0, 1.55], [-.85, 2.8, .15, 1.05], [.8, 2.85, -.1, 1.1]].forEach(([cx, cy, cz, scale]) => {
        const crown = mesh(geometries.sphere8, crownMaterial, tree);
        crown.position.set(cx, cy, cz);
        crown.scale.set(scale * 1.08, scale, scale);
      });
      colliders.push({ x, z, radius: 1.05 });
    });

    const benches = [[-10, -8, .55], [10, 8, .55], [-9, 9, -.65], [11, -8, -.65]];
    benches.forEach(([x, z, rotation]) => {
      const bench = new THREE.Group();
      bench.position.set(x, 0, z);
      bench.rotation.y = rotation;
      root.add(bench);
      box(bench, materials.woodLight, 0, .55, 0, 2.2, .22, .7);
      box(bench, materials.woodLight, 0, 1.12, -.28, 2.2, .85, .16);
      for (const legX of [-.75, .75]) cylinder(bench, materials.darkWood, legX, .25, 0, .09, .5, 8);
    });

    const cottages = [
      { x: -21, z: 7, color: materials.cubeCoral, roof: materials.origamiPink, turn: .35 },
      { x: 21, z: 5, color: materials.cream, roof: materials.origamiBlue, turn: -.4 },
      { x: 4, z: 24, color: materials.woodLight, roof: materials.geoboardGreen, turn: Math.PI },
      { x: -52, z: -3, color: materials.cream, roof: materials.cubeCoral, turn: 1.1 },
      { x: -45, z: 33, color: materials.woodLight, roof: materials.origamiBlue, turn: 2.4 },
      { x: 17, z: -43, color: materials.cubeGold, roof: materials.origamiPink, turn: .2 },
      { x: 51, z: 39, color: materials.cream, roof: materials.geoboardGreen, turn: -2.4 }
    ];
    cottages.forEach((spec) => {
      const home = new THREE.Group();
      home.position.set(spec.x, 0, spec.z);
      home.rotation.y = spec.turn;
      root.add(home);
      box(home, spec.color, 0, 1.45, 0, 4.6, 2.9, 3.8);
      const roof = mesh(geometries.pyramid, spec.roof, home);
      roof.position.y = 3.75;
      roof.scale.set(3.75, 2.1, 3.3);
      roof.rotation.y = Math.PI / 4;
      box(home, materials.darkWood, 0, 1.2, 1.96, 1.05, 2.05, .18);
      box(home, materials.wood, 0, 1.2, 2.06, .75, 1.72, .08);
      for (const wx of [-1.55, 1.55]) {
        box(home, materials.darkWood, wx, 1.65, 1.96, 1.05, 1.05, .15);
        box(home, materials.origamiBlue, wx, 1.65, 2.05, .74, .75, .07);
      }
      cylinder(home, materials.darkWood, 1.45, 4.15, -.55, .32, 2.05, 8);
      colliders.push({ x: spec.x, z: spec.z, radius: 3.15 });
    });

    const rockPositions = [[-14, -16], [14, 16], [-38, 11], [37, 9], [-7, -39], [8, 42]];
    rockPositions.forEach(([x, z], index) => {
      const rock = mesh(geometries.sphere8, materials.stone);
      rock.position.set(x, .38, z);
      rock.scale.set(.72 + index % 2 * .2, .5, .62);
      rock.rotation.y = index * .9;
    });

    const tuftCount = 150;
    const tuftGeometry = new THREE.ConeGeometry(.16, .55, 5);
    const tufts = new THREE.InstancedMesh(tuftGeometry, materials.grassDark, tuftCount);
    tufts.name = "meadow-grass-tufts";
    const tuftMatrix = new THREE.Matrix4();
    const tuftQuaternion = new THREE.Quaternion();
    for (let index = 0; index < tuftCount; index += 1) {
      const x = -63 + ((index * 37) % 126);
      const z = -44 + ((index * 53) % 88);
      const centerDistance = Math.hypot(x, z);
      const hidden = centerDistance < 11 || zones.some((zone) => Math.hypot(x - zone.x, z - zone.z) < zone.radius + 4);
      const scale = hidden ? 0 : .7 + (index % 4) * .12;
      tuftQuaternion.setFromEuler(new THREE.Euler(0, index * 1.73, (index % 3 - 1) * .08));
      tuftMatrix.compose(new THREE.Vector3(x, .3, z), tuftQuaternion, new THREE.Vector3(scale, scale, scale));
      tufts.setMatrixAt(index, tuftMatrix);
    }
    root.add(tufts);
  }

  function createWedgeGeometry() {
    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -0.5, -0.5, -0.5, -0.5, -0.5, 0.5, -0.5, 0.5, -0.5, -0.5, 0.5, 0.5,
      0.5, -0.5, -0.5, 0.5, -0.5, 0.5
    ]);
    geometry.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex([
      0, 1, 2, 2, 1, 3,
      0, 4, 1, 1, 4, 5,
      0, 2, 4,
      1, 5, 3,
      2, 3, 4, 4, 3, 5
    ]);
    geometry.computeVertexNormals();
    return geometry;
  }
}
