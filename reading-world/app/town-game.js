// Gfield Reading Town — Phaser 3 town scene (phase-1 PoC).
// Self-contained: draws its own placeholder art (no external tiles/sprites),
// a movable avatar, and 4 buildings that call back into the app to open menus.
// Real Gfield art + Tiled JSON maps drop in later without changing the API.
window.TownGame = (function () {
  let game = null, S = null, opts = null, decorSeq = 0;
  const W = 960, H = 600;
  // buildings: key, grid position (px center), color, roof, emoji sign, label key
  const BUILDINGS = [
    { key: 'library',  x: 210, y: 165, color: '#7a5cc3', sign: '📚' },
    { key: 'wordshop', x: 750, y: 165, color: '#e08a3c', sign: '🔤' },
    { key: 'theater',  x: 480, y: 182, color: '#c0433f', sign: '🎬' },
    { key: 'practice', x: 210, y: 445, color: '#2f9e8f', sign: '🏠' },
    { key: 'report',   x: 750, y: 445, color: '#d05f8a', sign: '📊' },
  ];

  function scene() { return {
    preload() {
      if (opts.avatarUri) { try { this.load.svg('avatarTex', opts.avatarUri, { width: 96, height: 96 }); } catch (e) {} }
      const da = opts.decorArt || {};
      Object.keys(da).forEach(id => { if (da[id]) { try { this.load.svg('deco_' + id, da[id], { width: 64, height: 64 }); } catch (e) {} } });
      const ba = opts.buildingArt || {};
      Object.keys(ba).forEach(k => { if (ba[k]) { try { this.load.svg('bsign_' + k, ba[k], { width: 64, height: 64 }); } catch (e) {} } });
    },
    create() {
      S = this; const g = this.add.graphics();
      // ground — layered flat-vector meadow
      g.fillStyle(0xbfe6a4, 1).fillRect(0, 0, W, H);
      [[0xc9edb0, 46], [0xb4dd97, 36]].forEach(([col, r], ti) => { for (let i = 0; i < 14; i++) { const x = ((i * 167 + ti * 70) % (W + 80)) - 40, y = ((i * 113 + ti * 50) % (H + 60)) - 30; g.fillStyle(col, 1).fillCircle(x, y, r - (i % 3) * 7); } });
      // paths with soft edges + center plaza
      const path = (x, y, w, h) => { g.fillStyle(0xd8bf87, 1).fillRoundedRect(x - 3, y - 3, w + 6, h + 6, 10); g.fillStyle(0xecd9ab, 1).fillRoundedRect(x, y, w, h, 8); };
      path(W/2 - 26, 90, 52, H - 180); path(120, H/2 - 26, W - 240, 52);
      BUILDINGS.forEach(b => { const x = Math.min(b.x, W/2) - 20, w = Math.abs(b.x - W/2) + 24; path(x, b.y - 11, w, 22); const y = Math.min(b.y, H/2) - 20, h = Math.abs(b.y - H/2) + 24; path(b.x - 11, y, 22, h); });
      g.fillStyle(0xd8bf87, 1).fillCircle(W/2, H/2, 50); g.fillStyle(0xecd9ab, 1).fillCircle(W/2, H/2, 44); g.fillStyle(0xf4e7c4, 1).fillCircle(W/2, H/2, 19);
      // scenery — trees, bushes, flowers (flat-vector, matches decorations)
      const tree = (x, y, s) => { g.fillStyle(0x2f7a3a, 0.13).fillEllipse(x, y + 22 * s, 46 * s, 13 * s); g.fillStyle(0xa9743f, 1).fillRect(x - 3 * s, y + 6 * s, 6 * s, 16 * s); g.fillStyle(0x57a349, 1).fillCircle(x - 11 * s, y + 2 * s, 13 * s); g.fillStyle(0x57a349, 1).fillCircle(x + 11 * s, y + 2 * s, 13 * s); g.fillStyle(0x6bbf59, 1).fillCircle(x, y - 8 * s, 15 * s); g.fillStyle(0x8ed17f, 0.9).fillCircle(x - 5 * s, y - 12 * s, 6 * s); };
      const bush = (x, y) => { g.fillStyle(0x2f7a3a, 0.12).fillEllipse(x, y + 9, 34, 8); g.fillStyle(0x57a349, 1).fillCircle(x - 10, y, 11); g.fillStyle(0x57a349, 1).fillCircle(x + 10, y, 11); g.fillStyle(0x6bbf59, 1).fillCircle(x, y - 4, 13); };
      const flower = (x, y, c) => { g.fillStyle(0x4e9e43, 1).fillRect(x - 1, y - 2, 2, 8); [[-5, 0], [5, 0], [0, -5], [0, 5]].forEach(d => { g.fillStyle(c, 1).fillCircle(x + d[0], y + d[1] - 3, 3.4); }); g.fillStyle(0xffe08a, 1).fillCircle(x, y - 3, 2.2); };
      [[58, 120, 1], [905, 120, 1], [58, 500, 1], [905, 500, 0.9], [150, 255, 0.8], [812, 255, 0.8]].forEach(t => tree(t[0], t[1], t[2]));
      [[250, 545], [700, 545], [95, 420], [880, 140]].forEach(bp => bush(bp[0], bp[1]));
      [[120, 395, 0xff9ec4], [860, 395, 0xff9ec4], [420, 118, 0xffd45e], [548, 118, 0xe0777a], [300, 110, 0xff9ec4], [660, 510, 0xffd45e]].forEach(f => flower(f[0], f[1], f[2]));

      // buildings
      this.bZones = [];
      BUILDINGS.forEach(b => {
        const bg = this.add.graphics();
        const col = Phaser.Display.Color.HexStringToColor(b.color).color;
        bg.fillStyle(0x000000, 0.08).fillEllipse(b.x, b.y + 44, 120, 20);                // ground shadow
        bg.fillStyle(col, 1).fillRoundedRect(b.x - 58, b.y - 34, 116, 74, 12);          // body
        bg.fillStyle(0xffffff, 0.18).fillRoundedRect(b.x - 58, b.y - 34, 116, 20, 8);   // light top
        bg.fillStyle(col, 1).fillTriangle(b.x - 66, b.y - 34, b.x + 66, b.y - 34, b.x, b.y - 74); // roof
        bg.fillStyle(0x000000, 0.12).fillTriangle(b.x - 66, b.y - 34, b.x + 66, b.y - 34, b.x, b.y - 74);
        bg.fillStyle(0xfff3d6, 1).fillRoundedRect(b.x - 14, b.y - 6, 28, 46, 4);         // door
        if (this.textures.exists('bsign_' + b.key)) this.add.image(b.x, b.y - 52, 'bsign_' + b.key).setDisplaySize(38, 38);
        else this.add.text(b.x, b.y - 52, b.sign, { fontSize: '26px' }).setOrigin(0.5);
        const label = (opts.labels && opts.labels[b.key]) || b.key;
        this.add.text(b.x, b.y + 52, label, { fontSize: '15px', fontStyle: 'bold', color: '#31405c', backgroundColor: '#ffffffcc', padding: { x: 6, y: 3 } }).setOrigin(0.5);
        // clickable + solid
        const hit = this.add.rectangle(b.x, b.y - 4, 120, 118, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
        hit.on('pointerdown', () => openMenu(b.key));
        this.physics.add.existing(this.add.rectangle(b.x, b.y + 4, 108, 60), true); // solid base (last child)
        const solid = this.children.list[this.children.list.length - 1];
        this.bZones.push({ b, solid });
      });

      // decoration slots (unlock-slot model)
      this.slotObjs = {};
      const slots = (opts.slots) || {};
      Object.keys(slots).forEach(id => {
        const s = slots[id];
        const marker = this.add.graphics();
        marker.lineStyle(2, 0x5aa06a, 0.7); marker.strokeCircle(s.x, s.y, 20);
        marker.fillStyle(0xffffff, 0.5).fillCircle(s.x, s.y, 18);
        const plus = this.add.text(s.x, s.y, '＋', { fontSize: '20px', color: '#4f8a5f' }).setOrigin(0.5);
        const deco = this.add.text(s.x, s.y - 6, '', { fontSize: '30px' }).setOrigin(0.5).setVisible(false);
        const hit = this.add.circle(s.x, s.y, 26, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
        hit.on('pointerdown', () => { if (opts.onSlotClick) opts.onSlotClick(id); });
        this.slotObjs[id] = { marker, plus, deco, img: null, x: s.x, y: s.y };
        const cur = opts.placed && opts.placed[id];
        if (cur) {
          marker.setVisible(false); plus.setVisible(false);
          if (this.textures.exists('deco_' + id)) this.slotObjs[id].img = this.add.image(s.x, s.y - 6, 'deco_' + id).setDisplaySize(40, 40);
          else deco.setText(cur).setVisible(true);
        }
      });

      // avatar (drawn from equipped colors — shared paper-doll model)
      const look = opts.look || {};
      const skin = Phaser.Display.Color.HexStringToColor(look.skin || '#ffd9ad').color;
      const hair = Phaser.Display.Color.HexStringToColor(look.hair || '#6b4326').color;
      const cloth = Phaser.Display.Color.HexStringToColor(look.clothes || '#6db3f2').color;
      const p = this.add.container(W / 2, H / 2 + 70);
      const shadow = this.add.graphics(); shadow.fillStyle(0x000000, 0.14).fillEllipse(0, 26, 34, 10); p.add(shadow);
      if (this.textures.exists('avatarTex')) {
        const spr = this.add.image(0, 30, 'avatarTex').setOrigin(0.5, 1).setScale(0.92); p.add(spr);
      } else {
        const ag = this.add.graphics();
        ag.fillStyle(cloth, 1).fillRoundedRect(-15, 2, 30, 26, 9);      // body
        ag.fillStyle(skin, 1).fillCircle(0, -8, 15);                    // head
        ag.fillStyle(hair, 1).fillEllipse(0, -16, 30, 18);             // hair top
        ag.fillStyle(0x33405c, 1).fillCircle(-5, -8, 2).fillCircle(5, -8, 2); // eyes
        p.add(ag);
        if (look.hatEmoji) { const h = this.add.text(0, -26, look.hatEmoji, { fontSize: '20px' }).setOrigin(0.5); p.add(h); }
      }
      this.physics.add.existing(p);
      p.body.setSize(30, 26).setOffset(-15, 2);
      p.body.setCollideWorldBounds(true);
      this.physics.world.setBounds(24, 96, W - 48, H - 120);
      this.bZones.forEach(z => this.physics.add.collider(p, z.solid));
      this.player = p;
      window.__townPlayer = p; // for tests

      // prompt bubble
      this.prompt = this.add.text(0, 0, '', { fontSize: '13px', fontStyle: 'bold', color: '#fff', backgroundColor: '#31405ccc', padding: { x: 8, y: 4 } }).setOrigin(0.5).setDepth(20).setVisible(false);

      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd = this.input.keyboard.addKeys('W,A,S,D,SPACE,ENTER');
      this.input.keyboard.on('keydown-SPACE', tryOpenNear);
      this.input.keyboard.on('keydown-ENTER', tryOpenNear);
      this.touch = { x: 0, y: 0 };
    },
    update() {
      if (!this.player) return; const b = this.player.body; const sp = 190;
      let vx = 0, vy = 0;
      if (this.cursors.left.isDown || this.wasd.A.isDown) vx = -1;
      else if (this.cursors.right.isDown || this.wasd.D.isDown) vx = 1;
      if (this.cursors.up.isDown || this.wasd.W.isDown) vy = -1;
      else if (this.cursors.down.isDown || this.wasd.S.isDown) vy = 1;
      if (this.touch.x || this.touch.y) { vx = this.touch.x; vy = this.touch.y; }
      const len = Math.hypot(vx, vy) || 1; b.setVelocity((vx / len) * sp, (vy / len) * sp);
      // nearest building
      let near = null, nd = 999;
      this.bZones.forEach(z => { const d = Phaser.Math.Distance.Between(this.player.x, this.player.y, z.b.x, z.b.y + 4); if (d < nd) { nd = d; near = z.b; } });
      this._near = (near && nd < 110) ? near : null;
      if (this._near) { this.prompt.setText((opts.labels && opts.labels.open) || 'Open').setPosition(this._near.x, this._near.y - 92).setVisible(true); }
      else this.prompt.setVisible(false);
    },
  }; }

  function tryOpenNear() { if (S && S._near) openMenu(S._near.key); }
  function openMenu(key) { if (opts && opts.onOpenMenu) opts.onOpenMenu(key); }

  function mount(container, options) {
    opts = options; destroy();
    game = new Phaser.Game({
      type: Phaser.CANVAS, parent: container, width: W, height: H,
      backgroundColor: '#bfe6a4', scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_HORIZONTALLY },
      physics: { default: 'arcade', arcade: { gravity: { y: 0 }, debug: false } },
      scene: scene(),
    });
  }
  function setMove(x, y) { if (S && S.touch) { S.touch.x = x; S.touch.y = y; } }
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
        S.load.once('complete', () => { if (S && S.slotObjs[slotId] && S.textures.exists(key)) { if (o.img) o.img.destroy(); o.img = S.add.image(o.x, o.y - 6, key).setDisplaySize(40, 40); } });
        S.load.start();
      } catch (e) { if (emoji) o.deco.setText(emoji).setVisible(true); }
    } else if (emoji) { o.deco.setText(emoji).setVisible(true); }
  }
  function destroy() { if (game) { try { game.destroy(true); } catch (e) {} game = null; S = null; } }
  return { mount, setMove, setDecor, destroy };
})();
