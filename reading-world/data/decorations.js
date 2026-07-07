// Shared town-decoration catalog (common asset). Phase-2 unlock-slot model:
// the map has fixed slots; a child spends coins to unlock a decoration and
// place it in its slot (no free placement yet). Placeholder emoji art now;
// real Gfield art swaps in behind the same ids.
window.DECORATIONS = {
  // fixed slots on lego-town-map (1207x837), kept clear of buildings/paths
  slots: {
    lamp:   { x: 560, y: 455, name: { ko: '가로등', en: 'Lamp', zh: '路灯' } },
    sign:   { x: 720, y: 430, name: { ko: '간판', en: 'Sign', zh: '招牌' } },
    garden: { x: 150, y: 470, name: { ko: '정원', en: 'Garden', zh: '花园' } },
    bench:  { x: 660, y: 560, name: { ko: '벤치', en: 'Bench', zh: '长椅' } },
    pond:   { x: 455, y: 705, name: { ko: '연못', en: 'Pond', zh: '池塘' } },
    gate:   { x: 620, y: 135, name: { ko: '대문', en: 'Gate', zh: '大门' } },
  },
  // each decoration belongs to one slot
  items: [
    { id: 'lamp_lantern', slot: 'lamp',   name: { ko: '홍등', en: 'Lantern', zh: '灯笼' }, cost: 20, emoji: '🏮' },
    { id: 'lamp_bulb',    slot: 'lamp',   name: { ko: '전등', en: 'Light', zh: '灯' },   cost: 15, emoji: '💡' },
    { id: 'sign_board',   slot: 'sign',   name: { ko: '안내판', en: 'Board', zh: '告示牌' }, cost: 15, emoji: '🪧' },
    { id: 'sign_flag',    slot: 'sign',   name: { ko: '깃발', en: 'Flag', zh: '旗帜' }, cost: 20, emoji: '🚩' },
    { id: 'sign_mail',    slot: 'sign',   name: { ko: '우체통', en: 'Mailbox', zh: '邮箱' }, cost: 25, emoji: '📮' },
    { id: 'garden_tulip', slot: 'garden', name: { ko: '튤립', en: 'Tulips', zh: '郁金香' }, cost: 15, emoji: '🌷' },
    { id: 'garden_sun',   slot: 'garden', name: { ko: '해바라기', en: 'Sunflower', zh: '向日葵' }, cost: 20, emoji: '🌻' },
    { id: 'garden_tree',  slot: 'garden', name: { ko: '나무', en: 'Tree', zh: '树' }, cost: 30, emoji: '🌳' },
    { id: 'bench_chair',  slot: 'bench',  name: { ko: '벤치', en: 'Bench', zh: '长椅' }, cost: 20, emoji: '🪑' },
    { id: 'bench_umbrella',slot: 'bench', name: { ko: '파라솔', en: 'Umbrella', zh: '遮阳伞' }, cost: 35, emoji: '⛱️' },
    { id: 'pond_lily',    slot: 'pond',   name: { ko: '연꽃', en: 'Lily', zh: '莲花' }, cost: 25, emoji: '🪷' },
    { id: 'pond_duck',    slot: 'pond',   name: { ko: '오리', en: 'Duck', zh: '鸭子' }, cost: 30, emoji: '🦆' },
    { id: 'pond_fountain',slot: 'pond',   name: { ko: '분수', en: 'Fountain', zh: '喷泉' }, cost: 60, emoji: '⛲' },
    { id: 'gate_arch',    slot: 'gate',   name: { ko: '아치문', en: 'Arch Gate', zh: '拱门' }, cost: 30, emoji: '⛩️' },
    { id: 'gate_castle',  slot: 'gate',   name: { ko: '성문', en: 'Castle Gate', zh: '城门' }, cost: 90, emoji: '🏰' },
    // 🌊 ocean theme
    { id: 'garden_palm',  slot: 'garden', name: { ko: '야자수', en: 'Palm Tree', zh: '棕榈树' }, cost: 30, emoji: '🌴' },
    { id: 'pond_fish',    slot: 'pond',   name: { ko: '물고기', en: 'Fish', zh: '鱼' }, cost: 20, emoji: '🐠' },
    { id: 'pond_shell',   slot: 'pond',   name: { ko: '조개', en: 'Shell', zh: '贝壳' }, cost: 15, emoji: '🐚' },
    { id: 'bench_beach',  slot: 'bench',  name: { ko: '바닷가', en: 'Beach', zh: '沙滩' }, cost: 35, emoji: '🏖️' },
    { id: 'sign_chime',   slot: 'sign',   name: { ko: '풍경', en: 'Wind Chime', zh: '风铃' }, cost: 15, emoji: '🎐' },
    // 🌸 seasonal theme
    { id: 'garden_blossom', slot: 'garden', name: { ko: '벚꽃', en: 'Blossom', zh: '樱花' }, cost: 20, emoji: '🌸' },
    { id: 'garden_maple', slot: 'garden', name: { ko: '단풍', en: 'Maple', zh: '枫叶' }, cost: 20, emoji: '🍁' },
    { id: 'bench_snowman',slot: 'bench',  name: { ko: '눈사람', en: 'Snowman', zh: '雪人' }, cost: 30, emoji: '⛄' },
    { id: 'sign_carp',    slot: 'sign',   name: { ko: '잉어깃발', en: 'Carp Flag', zh: '鲤鱼旗' }, cost: 25, emoji: '🎏' },
    { id: 'lamp_candle',  slot: 'lamp',   name: { ko: '촛불', en: 'Candle', zh: '蜡烛' }, cost: 15, emoji: '🕯️' },
    { id: 'gate_bamboo',  slot: 'gate',   name: { ko: '대나무', en: 'Bamboo', zh: '竹子' }, cost: 25, emoji: '🎋' },
    { id: 'gate_rainbow', slot: 'gate',   name: { ko: '무지개', en: 'Rainbow', zh: '彩虹' }, cost: 45, emoji: '🌈' },
  ],
};
