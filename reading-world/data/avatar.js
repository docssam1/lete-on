// Shared avatar catalog — common asset used across every book/lesson.
// Base look (skin, hair style, hair color) is free to choose; accessories cost
// points earned by learning (never by chance).
window.AVATAR = {
  defaults: { skin: 'light', hair: 'short', haircolor: 'brown', background: 'meadow', clothes: 'blue', hat: 'none', glasses: 'none', pet: 'none' },

  // starter characters shown right after a child types their name
  presets: [
    { id: 'p1', name: { ko: '긴 머리', en: 'Long hair', zh: '长发' }, look: { skin: 'light', hair: 'long', haircolor: 'brown', clothes: 'red' } },
    { id: 'p2', name: { ko: '짧은 머리', en: 'Short hair', zh: '短发' }, look: { skin: 'light', hair: 'short', haircolor: 'black', clothes: 'blue' } },
    { id: 'p3', name: { ko: '양 갈래', en: 'Braids', zh: '辫子' }, look: { skin: 'tan', hair: 'braids', haircolor: 'black', clothes: 'sunny' } },
    { id: 'p4', name: { ko: '곱슬 머리', en: 'Curly', zh: '卷发' }, look: { skin: 'medium', hair: 'curly', haircolor: 'chestnut', clothes: 'green' } },
    { id: 'p5', name: { ko: '하나로 묶기', en: 'Ponytail', zh: '马尾' }, look: { skin: 'porcelain', hair: 'ponytail', haircolor: 'black', clothes: 'purple' } },
    { id: 'p6', name: { ko: '물결 머리', en: 'Wavy', zh: '波浪发' }, look: { skin: 'light', hair: 'wavy', haircolor: 'blue', clothes: 'green' } },
  ],

  categories: [
    {
      key: 'skin', name: { ko: '피부', en: 'Skin', zh: '肤色' },
      items: [
        { id: 'porcelain', name: { ko: '밝은톤', en: 'Porcelain', zh: '瓷白' }, cost: 0, fill: '#ffe8d6' },
        { id: 'light', name: { ko: '라이트', en: 'Light', zh: '浅色' }, cost: 0, fill: '#ffd9ad' },
        { id: 'medium', name: { ko: '미디엄', en: 'Medium', zh: '中等' }, cost: 0, fill: '#eab27a' },
        { id: 'tan', name: { ko: '탠', en: 'Tan', zh: '小麦' }, cost: 0, fill: '#cf9059' },
        { id: 'deep', name: { ko: '딥톤', en: 'Deep', zh: '深色' }, cost: 0, fill: '#a56a43' },
      ],
    },
    {
      key: 'hair', name: { ko: '머리 모양', en: 'Hairstyle', zh: '发型' },
      items: [
        { id: 'short', name: { ko: '단발', en: 'Short', zh: '短' }, cost: 0 },
        { id: 'long', name: { ko: '긴 머리', en: 'Long', zh: '长' }, cost: 0 },
        { id: 'wavy', name: { ko: '물결', en: 'Wavy', zh: '波浪' }, cost: 0 },
        { id: 'ponytail', name: { ko: '하나 묶기', en: 'Ponytail', zh: '马尾' }, cost: 0 },
        { id: 'braids', name: { ko: '양 갈래', en: 'Braids', zh: '辫子' }, cost: 0 },
        { id: 'bun', name: { ko: '번', en: 'Bun', zh: '丸子头' }, cost: 0 },
        { id: 'curly', name: { ko: '곱슬', en: 'Curly', zh: '卷发' }, cost: 0 },
      ],
    },
    {
      key: 'haircolor', name: { ko: '머리 색', en: 'Hair color', zh: '发色' },
      items: [
        { id: 'black', name: { ko: '검정', en: 'Black', zh: '黑' }, cost: 0, fill: '#2b2b32' },
        { id: 'brown', name: { ko: '갈색', en: 'Brown', zh: '棕' }, cost: 0, fill: '#6b4326' },
        { id: 'chestnut', name: { ko: '밤색', en: 'Chestnut', zh: '栗' }, cost: 0, fill: '#8a5a2b' },
        { id: 'blonde', name: { ko: '금발', en: 'Blonde', zh: '金' }, cost: 0, fill: '#e6b45a' },
        { id: 'red', name: { ko: '빨강', en: 'Red', zh: '红' }, cost: 20, fill: '#c65b3a' },
        { id: 'pink', name: { ko: '핑크', en: 'Pink', zh: '粉' }, cost: 30, fill: '#f28bc1' },
        { id: 'blue', name: { ko: '파랑', en: 'Blue', zh: '蓝' }, cost: 30, fill: '#6f9ae8' },
      ],
    },
    {
      key: 'clothes', name: { ko: '옷', en: 'Clothes', zh: '衣服' },
      items: [
        { id: 'blue', name: { ko: '파란 옷', en: 'Blue', zh: '蓝色' }, cost: 0, fill: '#6db3f2' },
        { id: 'red', name: { ko: '빨간 옷', en: 'Red', zh: '红色' }, cost: 0, fill: '#f28b82' },
        { id: 'green', name: { ko: '초록 옷', en: 'Green', zh: '绿色' }, cost: 0, fill: '#81c995' },
        { id: 'purple', name: { ko: '보라 옷', en: 'Purple', zh: '紫色' }, cost: 20, fill: '#b39ddb' },
        { id: 'sunny', name: { ko: '노랑 옷', en: 'Sunny', zh: '黄色' }, cost: 20, fill: '#ffd54f' },
        { id: 'mint', name: { ko: '민트 옷', en: 'Mint', zh: '薄荷' }, cost: 40, fill: '#6fd6c4' },
      ],
    },
    {
      key: 'hat', name: { ko: '모자', en: 'Hat', zh: '帽子' },
      items: [
        { id: 'none', name: { ko: '없음', en: 'None', zh: '无' }, cost: 0, emoji: '' },
        { id: 'cap', name: { ko: '야구모자', en: 'Cap', zh: '棒球帽' }, cost: 30, emoji: '🧢' },
        { id: 'party', name: { ko: '파티모자', en: 'Party Hat', zh: '派对帽' }, cost: 30, emoji: '🎉' },
        { id: 'bow', name: { ko: '리본', en: 'Bow', zh: '蝴蝶结' }, cost: 40, emoji: '🎀' },
        { id: 'flower', name: { ko: '꽃', en: 'Flower', zh: '花' }, cost: 40, emoji: '🌸' },
        { id: 'wizard', name: { ko: '마법사모자', en: 'Wizard Hat', zh: '巫师帽' }, cost: 80, emoji: '🧙' },
        { id: 'crown', name: { ko: '왕관', en: 'Crown', zh: '皇冠' }, cost: 150, emoji: '👑' },
      ],
    },
    {
      key: 'glasses', name: { ko: '안경', en: 'Glasses', zh: '眼镜' },
      items: [
        { id: 'none', name: { ko: '없음', en: 'None', zh: '无' }, cost: 0, emoji: '' },
        { id: 'round', name: { ko: '동그란 안경', en: 'Round', zh: '圆框' }, cost: 25, emoji: '👓' },
        { id: 'cool', name: { ko: '선글라스', en: 'Shades', zh: '墨镜' }, cost: 50, emoji: '🕶️' },
        { id: 'star', name: { ko: '별 안경', en: 'Star', zh: '星星' }, cost: 60, emoji: '⭐' },
      ],
    },
    {
      key: 'pet', name: { ko: '친구', en: 'Pet', zh: '伙伴' },
      items: [
        { id: 'none', name: { ko: '없음', en: 'None', zh: '无' }, cost: 0, emoji: '' },
        { id: 'cat', name: { ko: '고양이', en: 'Cat', zh: '猫' }, cost: 40, emoji: '🐱' },
        { id: 'dog', name: { ko: '강아지', en: 'Dog', zh: '狗' }, cost: 40, emoji: '🐶' },
        { id: 'bunny', name: { ko: '토끼', en: 'Bunny', zh: '兔子' }, cost: 50, emoji: '🐰' },
        { id: 'bird', name: { ko: '새', en: 'Bird', zh: '鸟' }, cost: 60, emoji: '🐦' },
        { id: 'dino', name: { ko: '공룡', en: 'Dino', zh: '恐龙' }, cost: 100, emoji: '🦖' },
      ],
    },
    {
      key: 'background', name: { ko: '배경', en: 'Background', zh: '背景' },
      items: [
        { id: 'meadow', name: { ko: '풀밭', en: 'Meadow', zh: '草地' }, cost: 0, fill: '#dff5e1' },
        { id: 'sky', name: { ko: '하늘', en: 'Sky', zh: '天空' }, cost: 20, fill: '#d6ecff' },
        { id: 'candy', name: { ko: '솜사탕', en: 'Candy', zh: '棉花糖' }, cost: 40, fill: '#ffe1ef' },
        { id: 'sunset', name: { ko: '노을', en: 'Sunset', zh: '晚霞' }, cost: 60, fill: 'url(#av_sunset)' },
        { id: 'night', name: { ko: '별밤', en: 'Starry Night', zh: '星空' }, cost: 80, fill: '#232a52', stars: true },
      ],
    },
  ],
};
