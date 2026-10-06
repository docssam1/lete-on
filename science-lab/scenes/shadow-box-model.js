// 그림자 장면과 실험실이 함께 쓰는 수치(브라우저·Node 테스트 양쪽에서 읽도록 THREE 없이).
// 장면 단위 1 = 10 cm. 손전등(점광원)은 x = LIGHT_X, 스크린은 x = SCREEN_X, 인형 키 FIG_H(6 cm).
export const LIGHT_X = -3, SCREEN_X = 3, EYE_Y = 1.15, FIG_H = 0.6;
export const PLACES = { '빛 가까이': -1.2, '가운데': 0, '스크린 가까이': 1.5 };
// 그림자 높이(cm): 손전등 = 물체 크기 × (빛~스크린)/(빛~물체), 햇빛(평행광) = 물체 크기 그대로
export function shadowCm(light, x) { return Math.round((light === '햇빛' ? FIG_H : FIG_H * (SCREEN_X - LIGHT_X) / (x - LIGHT_X)) * 100) / 10; }
