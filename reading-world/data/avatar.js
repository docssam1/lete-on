// Shared avatar catalog — common asset used across every book/lesson.
// Items are unlocked with points earned by learning (not by chance).
window.AVATAR = {
  // default look + the free items every child starts with
  defaults: { background: 'meadow', clothes: 'blue', hat: 'none', glasses: 'none', pet: 'none' },
  categories: [
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
    {
      key: 'clothes', name: { ko: '옷', en: 'Clothes', zh: '衣服' },
      items: [
        { id: 'blue', name: { ko: '파란 옷', en: 'Blue', zh: '蓝色' }, cost: 0, fill: '#6db3f2' },
        { id: 'red', name: { ko: '빨간 옷', en: 'Red', zh: '红色' }, cost: 20, fill: '#f28b82' },
        { id: 'green', name: { ko: '초록 옷', en: 'Green', zh: '绿色' }, cost: 20, fill: '#81c995' },
        { id: 'purple', name: { ko: '보라 옷', en: 'Purple', zh: '紫色' }, cost: 40, fill: '#b39ddb' },
        { id: 'sunny', name: { ko: '노랑 옷', en: 'Sunny', zh: '黄色' }, cost: 40, fill: '#ffd54f' },
      ],
    },
    {
      key: 'hat', name: { ko: '모자', en: 'Hat', zh: '帽子' },
      items: [
        { id: 'none', name: { ko: '없음', en: 'None', zh: '无' }, cost: 0, emoji: '' },
        { id: 'cap', name: { ko: '야구모자', en: 'Cap', zh: '棒球帽' }, cost: 30, emoji: '🧢' },
        { id: 'party', name: { ko: '파티모자', en: 'Party Hat', zh: '派对帽' }, cost: 30, emoji: '🎉' },
        { id: 'bow', name: { ko: '리본', en: 'Bow', zh: '蝴蝶结' }, cost: 40, emoji: '🎀' },
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
  ],
};
