// Gfield Reading Town — Phaser 3 town scene (v3: illustrated LEGO map).
// A hand-illustrated LEGO village PNG is the background; interactive layers
// (movable avatar, clickable building hotspots, decoration slots) and a living
// effects layer (fountain spray, drifting cloud shadows, chimney smoke, optional
// rain) are drawn on top. Same public API as before: mount / setMove / setDecor /
// setWeather / destroy. Building keys unchanged so main.js wiring is untouched.
window.TownGame = (function () {
  let game = null, S = null, opts = null, decorSeq = 0, weather = 'clear';
  // world = native map image size, so all coords below are image pixels
  const W = 1207, H = 837;
  const MAP_URL = 'assets/images/lego-town-map.png';

  // building hotspots keyed to features in the LEGO map (image pixel centers)
  const BUILDINGS = [
    { key: 'library',  x: 268, y: 250, w: 200, h: 210, sign: '📚' }, // book-roof library
    { key: 'practice', x: 447, y: 262, w: 130, h: 170, sign: '🏠' }, // bell-tower schoolhouse
    { key: 'theater',  x: 690, y: 292, w: 330, h: 210, sign: '🎬' }, // the two film-reel cinemas
    { key: 'report',   x: 1058, y: 252, w: 150, h: 170, sign: '📊' }, // white gazebo / dome
    { key: 'wordshop', x: 1082, y: 540, w: 190, h: 170, sign: '🔤' }, // market stalls
  ];
  // fountain + chimney anchor points (image pixels)
  const FOUNTAIN = { x: 400, y: 388 };
  const CHIMNEYS = [ { x: 185, y: 430 }, { x: 352, y: 628 }, { x: 1128, y: 392 } ];

  // ---- soft round texture (radial falloff) for particles/clouds ----
  function softDot(scene, key, color) {
    if (scene.textures.exists(key)) return;
    const r = 24, g = scene.make.graphics({ add: false });
    for (let i = r; i > 0; i--) { g.fillStyle(color, 0.045); g.fillCircle(r, r, i); }
    g.generateTexture(key, r * 2, r * 2); g.destroy();
  }
  function cloudTex(scene, key) {
    if (scene.textures.exists(key)) return;
    const g = scene.make.graphics({ add: false });
    const blobs = [[78, 62, 52], [128, 54, 44], [168, 66, 40], [104, 82, 50], [46, 74, 36], [196, 78, 30]];
    blobs.forEach(([x, y, rad]) => { for (let i = rad; i > 0; i -= 2) { g.fillStyle(0xffffff, 0.05); g.fillCircle(x, y, i); } });
    g.generateTexture(key, 236, 132); g.destroy();
  }
  function rainTex(scene, key) {
    if (scene.textures.exists(key)) return;
    const g = scene.make.graphics({ add: false });
    g.fillStyle(0xbfe0ff, 0.9).fillRect(0, 0, 2, 16);
    g.generateTexture(key, 2, 16); g.destroy();
  }

  function scene() { return {
    preload() {
      try { this.load.image('townMap', (opts.mapUrl || MAP_URL)); } catch (e) {}
      if (opts.avatarUri) { try { this.load.svg('avatarTex', opts.avatarUri, { width: 96, height: 96 }); } catch (e) {} }
      const da = opts.decorArt || {};
      Object.keys(da).forEach(id => { if (da[id]) { try { this.load.svg('deco_' + id, da[id], { width: 64, height: 64 }); } catch (e) {} } });
      const ba = opts.buildingArt || {};
      Object.keys(ba).forEach(k => { if (ba[k]) { try { this.load.svg('bsign_' + k, ba[k], { width: 64, height: 64 }); } catch (e) {} } });
    },
    create() {
      S = this;
      // background map (fallback meadow color shows if the image is missing)
      if (this.textures.exists('townMap')) {
        this.add.image(0, 0, 'townMap').setOrigin(0, 0).setDisplaySize(W, H).setDepth(0);
      } else {
        this.add.graphics().fillStyle(0x8fca6a, 1).fillRect(0, 0, W, H);
      }

      // ---- living effects layer -------------------------------------------
      softDot(this, 'pDrop', 0xcdeeff);    // fountain droplet
      softDot(this, 'pSmoke', 0xffffff);   // chimney puff
      cloudTex(this, 'pCloud');            // drifting cloud
      rainTex(this, 'pRain');              // rain streak

      // drifting cloud shadows across the map (the "흘러가는 구름" effect)
      this.clouds = [];
      const cloudDefs = [ { y: 210, a: 0.10, d: 58000, s: 1.6 }, { y: 470, a: 0.08, d: 74000, s: 2.1 }, { y: 660, a: 0.07, d: 66000, s: 1.8 } ];
      cloudDefs.forEach((c, i) => {
        const img = this.add.image(-260 - i * 320, c.y, 'pCloud').setTint(0x14200c).setAlpha(c.a).setScale(c.s).setDepth(3);
        this.tweens.add({ targets: img, x: W + 320, duration: c.d, repeat: -1, delay: i * 9000, ease: 'Linear' });
        this.clouds.push(img);
      });

      // fountain spray
      this.fountain = this.add.particles(FOUNTAIN.x, FOUNTAIN.y - 6, 'pDrop', {
        speed: { min: 24, max: 62 }, angle: { min: 250, max: 290 }, gravityY: 220,
        lifespan: 850, scale: { start: 0.55, end: 0 }, alpha: { start: 0.9, end: 0 },
        frequency: 55, quantity: 2, tint: 0xdff4ff, blendMode: 'NORMAL',
      }).setDepth(4);

      // chimney smoke
      this.smoke = CHIMNEYS.map(c => this.add.particles(c.x, c.y, 'pSmoke', {
        speed: { min: 6, max: 16 }, angle: { min: 250, max: 290 }, gravityY: -6,
        lifespan: 2600, scale: { start: 0.22, end: 1.15 }, alpha: { start: 0.42, end: 0 },
        frequency: 520, quantity: 1, tint: 0xf4f4f4, blendMode: 'NORMAL',
      }).setDepth(5));

      // rain (built now, emitting only when weather === 'rain')
      this.rainTint = this.add.rectangle(0, 0, W, H, 0x2b3a5c, 0.14).setOrigin(0, 0).setDepth(14).setVisible(false);
      this.rain = this.add.particles(0, -20, 'pRain', {
        x: { min: 0, max: W }, y: -20, speedY: { min: 420, max: 560 }, speedX: { min: -40, max: -20 },
        lifespan: 1500, quantity: 6, frequency: 24, scaleY: { min: 0.8, max: 1.4 }, alpha: { start: 0.5, end: 0.2 },
        blendMode: 'NORMAL',
      }).setDepth(15);
      this.rain.stop();

      // ---- building hotspots ----------------------------------------------
      this.bZones = [];
      BUILDINGS.forEach(b => {
        // glow ring shown when the avatar is near
        const glow = this.add.graphics().setDepth(6).setVisible(false);
        glow.lineStyle(4, 0xffe38a, 0.9).strokeRoundedRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h, 16);
        // sign chip + label
        const label = (opts.labels && opts.labels[b.key]) || b.key;
        if (this.textures.exists('bsign_' + b.key)) this.add.image(b.x, b.y - b.h / 2 + 6, 'bsign_' + b.key).setDisplaySize(34, 34).setDepth(9);
        // hand-painted wooden sign plaque (English village signage)
        const sy = b.y + b.h / 2 + 4;
        const txt = this.add.text(b.x, sy, label, { fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '16px', fontStyle: 'bold', color: '#fff3d8' }).setOrigin(0.5).setDepth(8);
        const pw = txt.width + 24, ph = txt.height + 11, px = b.x - pw / 2, py = sy - ph / 2;
        const plq = this.add.graphics().setDepth(7);
        plq.fillStyle(0x000000, 0.22).fillRoundedRect(px + 2, py + 3, pw, ph, 8);   // drop shadow
        plq.fillStyle(0x6f4a29, 1).fillRoundedRect(px, py, pw, ph, 8);              // wood body
        plq.fillStyle(0x855a34, 1).fillRoundedRect(px + 3, py + 3, pw - 6, ph * 0.42, 6); // top grain highlight
        plq.lineStyle(2, 0x3f2917, 1).strokeRoundedRect(px, py, pw, ph, 8);         // dark border
        plq.fillStyle(0xffd98a, 1).fillCircle(px + 6, py + ph / 2, 1.6).fillCircle(px + pw - 6, py + ph / 2, 1.6); // brass studs
        const hit = this.add.rectangle(b.x, b.y, b.w, b.h, 0xffffff, 0.001).setInteractive({ useHandCursor: true }).setDepth(8);
        hit.on('pointerover', () => glow.setVisible(true));
        hit.on('pointerout', () => { if (this._near !== b) glow.setVisible(false); });
        hit.on('pointerdown', () => openMenu(b.key));
        this.bZones.push({ b, glow });
      });

      // ---- decoration slots -----------------------------------------------
      this.slotObjs = {};
      const slots = (opts.slots) || {};
      Object.keys(slots).forEach(id => {
        const s = slots[id];
        const marker = this.add.graphics().setDepth(9);
        marker.lineStyle(2, 0x4f8a5f, 0.85); marker.strokeCircle(s.x, s.y, 20);
        marker.fillStyle(0xffffff, 0.55).fillCircle(s.x, s.y, 18);
        const plus = this.add.text(s.x, s.y, '＋', { fontSize: '20px', color: '#4f8a5f' }).setOrigin(0.5).setDepth(10);
        const deco = this.add.text(s.x, s.y - 6, '', { fontSize: '30px' }).setOrigin(0.5).setVisible(false).setDepth(10);
        const hit = this.add.circle(s.x, s.y, 26, 0xffffff, 0.001).setInteractive({ useHandCursor: true }).setDepth(10);
        hit.on('pointerdown', () => { if (opts.onSlotClick) opts.onSlotClick(id); });
        this.slotObjs[id] = { marker, plus, deco, img: null, x: s.x, y: s.y };
        const cur = opts.placed && opts.placed[id];
        if (cur) {
          marker.setVisible(false); plus.setVisible(false);
          if (this.textures.exists('deco_' + id)) this.slotObjs[id].img = this.add.image(s.x, s.y - 6, 'deco_' + id).setDisplaySize(40, 40).setDepth(10);
          else deco.setText(cur).setVisible(true);
        }
      });

      // ---- avatar ----------------------------------------------------------
      const look = opts.look || {};
      const skin = Phaser.Display.Color.HexStringToColor(look.skin || '#ffd9ad').color;
      const hair = Phaser.Display.Color.HexStringToColor(look.hair || '#6b4326').color;
      const cloth = Phaser.Display.Color.HexStringToColor(look.clothes || '#6db3f2').color;
      const p = this.add.container(400, 500).setDepth(12);
      const shadow = this.add.graphics(); shadow.fillStyle(0x000000, 0.16).fillEllipse(0, 26, 34, 10); p.add(shadow);
      if (this.textures.exists('avatarTex')) {
        p.add(this.add.image(0, 30, 'avatarTex').setOrigin(0.5, 1).setScale(0.92));
      } else {
        const ag = this.add.graphics();
        ag.fillStyle(cloth, 1).fillRoundedRect(-15, 2, 30, 26, 9);
        ag.fillStyle(skin, 1).fillCircle(0, -8, 15);
        ag.fillStyle(hair, 1).fillEllipse(0, -16, 30, 18);
        ag.fillStyle(0x33405c, 1).fillCircle(-5, -8, 2).fillCircle(5, -8, 2);
        p.add(ag);
        if (look.hatEmoji) p.add(this.add.text(0, -26, look.hatEmoji, { fontSize: '20px' }).setOrigin(0.5));
      }
      this.physics.add.existing(p);
      p.body.setSize(30, 26).setOffset(-15, 2);
      p.body.setCollideWorldBounds(true);
      this.physics.world.setBounds(28, 70, W - 56, H - 150);
      this.player = p;
      window.__townPlayer = p; // for tests

      // prompt bubble
      this.prompt = this.add.text(0, 0, '', { fontSize: '14px', fontStyle: 'bold', color: '#fff', backgroundColor: '#31405cdd', padding: { x: 9, y: 4 } }).setOrigin(0.5).setDepth(20).setVisible(false);

      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys('W,A,S,D,SPACE,ENTER');
      this.input.keyboard.on('keydown-SPACE', tryOpenNear);
      this.input.keyboard.on('keydown-ENTER', tryOpenNear);
      this.touch = { x: 0, y: 0 };
      if (weather === 'rain') applyWeather('rain');
    },
    update() {
      if (!this.player) return; const b = this.player.body; const sp = 215;
      let vx = 0, vy = 0;
      if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -1;
      else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = 1;
      if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -1;
      else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = 1;
      if (this.touch.x || this.touch.y) { vx = this.touch.x; vy = this.touch.y; }
      const len = Math.hypot(vx, vy) || 1; b.setVelocity((vx / len) * sp, (vy / len) * sp);
      // nearest building → prompt + glow
      let near = null, nd = 1e9;
      this.bZones.forEach(z => { const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, z.b.x, z.b.y); if (d < nd) { nd = d; near = z.b; } });
      const active = (near && nd < 150) ? near : null;
      if (active !== this._near) {
        this.bZones.forEach(z => z.glow.setVisible(z.b === active));
        this._near = active;
      }
      if (active) this.prompt.setText((opts.labels && opts.labels.open) || 'Open').setPosition(active.x, active.y - active.h / 2 - 16).setVisible(true);
      else this.prompt.setVisible(false);
    },
  }; }

  function applyWeather(type) {
    weather = type; if (!S) return;
    const raining = (type === 'rain');
    if (S.rain) { if (raining) S.rain.start(); else S.rain.stop(); }
    if (S.rainTint) S.rainTint.setVisible(raining);
  }
  function tryOpenNear() { if (S && S._near) openMenu(S._near.key); }
  function openMenu(key) { if (opts && opts.onOpenMenu) opts.onOpenMenu(key); }

  function mount(container, options) {
    opts = options; destroy();
    game = new Phaser.Game({
      type: Phaser.CANVAS, parent: container, width: W, height: H,
      backgroundColor: '#8fca6a', scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_HORIZONTALLY },
      physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
      scene: scene(),
    });
  }
  function setMove(x, y) { if (S && S.touch) { S.touch.x = x; S.touch.y = y; } }
  function setWeather(type) { applyWeather(type || 'clear'); }
  function setDecor(slotId, emoji, uri) {
    if (!S || !S.slotObjs || !S.slotObjs[slotId]) return;
    const o = S.slotObjs[slotId];
    const empty = !emoji && !uri;
    o.marker.setVisible(empty); o.plus.setVisible(empty);
    if (o.img) { o.img.destroy(); o.img = null; }
    o.deco.setVisible(false);
    if (uri) {
      const key = 'deco_' + slotId + '_' + (++decorSeq);
      try {
        S.load.svg(key, uri, { width: 64, height: 64 });
        S.load.once('complete', () => { if (S && S.slotObjs[slotId] && S.textures.exists(key)) { if (o.img) o.img.destroy(); o.img = S.add.image(o.x, o.y - 6, key).setDisplaySize(40, 40).setDepth(10); } });
        S.load.start();
      } catch (e) { if (emoji) o.deco.setText(emoji).setVisible(true); }
    } else if (emoji) { o.deco.setText(emoji).setVisible(true); }
  }
  function destroy() { if (game) { try { game.destroy(true); } catch (e) {} game = null; S = null; } }
  return { mount, setMove, setDecor, setWeather, destroy };
})();
