const copy = {
  ko:{
    myShape:"내 도형", movePrompt:"도형을 조건에 맞게 옮겨 보세요.", turnPrompt:"점 O를 중심으로 도형을 조건에 맞게 돌려 보세요.",
    check:"도형 확인", start:"조건의 방향과 양을 살펴보세요.", ready:"움직인 도형을 확인해 보세요.",
    left:"왼쪽으로 1칸", right:"오른쪽으로 1칸", up:"위로 1칸", down:"아래로 1칸",
    ccw:"반시계 방향으로 반의 반 바퀴", cw:"시계 방향으로 반의 반 바퀴",
    turn:"시계 방향", counterTurn:"반시계 방향",
    unmoved:"도형이 처음 위치에 있어요. 조건에 있는 방향과 칸 수를 살펴보세요.",
    moveDirection:"조건과 반대쪽으로 움직인 부분이 있어요. 방향을 다시 살펴보세요.",
    moveAxis:"조건에 없는 방향으로도 움직였어요. 가로와 세로를 따로 살펴보세요.",
    moveDistance:"방향은 맞게 살펴보고 있어요. 가로와 세로의 칸 수를 각각 다시 세어 보세요.",
    unturned:"도형이 아직 처음 방향이에요. 빨간 점을 기준으로 돌아간 방향을 살펴보세요.",
    turnDirection:"반대 방향으로 돌렸어요. 원에 표시된 화살표 방향을 다시 살펴보세요.",
    turnAmount:"돌린 양이 조건과 달라요. 반의 반 바퀴와 반 바퀴를 구별해 보세요."
  },
  en:{
    myShape:"My shape", movePrompt:"Move the shape as specified.", turnPrompt:"Turn the shape about O as specified.",
    check:"Check shape", start:"Look at the direction and amount.", ready:"Check the shape you moved.",
    left:"1 square left", right:"1 square right", up:"1 square up", down:"1 square down",
    ccw:"Quarter turn counterclockwise", cw:"Quarter turn clockwise",
    turn:"Clockwise", counterTurn:"Counterclockwise",
    unmoved:"The shape is still at the start. Look at the direction and number of squares.",
    moveDirection:"Part of the move goes in the opposite direction. Check the direction again.",
    moveAxis:"You also moved along an axis that was not specified. Check each axis separately.",
    moveDistance:"Check the number of horizontal and vertical squares separately.",
    unturned:"The shape has not turned yet. Follow the red point around O.",
    turnDirection:"You turned the opposite way. Look at the circular arrow again.",
    turnAmount:"The amount of turning is different. Compare a quarter turn with a half turn."
  },
  zh:{
    myShape:"我的图形", movePrompt:"按条件移动图形。", turnPrompt:"以 O 点为中心，按条件旋转图形。",
    check:"检查图形", start:"观察方向和变化的量。", ready:"检查移动后的图形。",
    left:"向左 1 格", right:"向右 1 格", up:"向上 1 格", down:"向下 1 格",
    ccw:"逆时针转四分之一圈", cw:"顺时针转四分之一圈",
    turn:"顺时针", counterTurn:"逆时针",
    unmoved:"图形还在原来的位置。再看看方向和格数。",
    moveDirection:"有一部分移动的方向相反。再看看方向。",
    moveAxis:"还沿着条件中没有要求的方向移动了。请分别检查横向和纵向。",
    moveDistance:"请分别再数一数横向和纵向的格数。",
    unturned:"图形还没有转动。观察红点绕 O 点转动的方向。",
    turnDirection:"旋转方向相反。再看看圆上的箭头。",
    turnAmount:"旋转的量不符合条件。区分四分之一圈和半圈。"
  },
  ja:{
    myShape:"自分の図形", movePrompt:"条件に合わせて図形を動かしましょう。", turnPrompt:"点 O を中心に、条件に合わせて図形を回しましょう。",
    check:"図形を確かめる", start:"方向と量を確かめましょう。", ready:"動かした図形を確かめましょう。",
    left:"左へ 1 マス", right:"右へ 1 マス", up:"上へ 1 マス", down:"下へ 1 マス",
    ccw:"反時計回りに 90°", cw:"時計回りに 90°",
    turn:"時計回り", counterTurn:"反時計回り",
    unmoved:"図形はまだ最初の位置です。方向とマスの数を見直しましょう。",
    moveDirection:"反対の方向に動かした部分があります。方向を見直しましょう。",
    moveAxis:"条件にない方向にも動かしています。横と縦を別々に確かめましょう。",
    moveDistance:"横と縦のマスの数を、それぞれ数え直しましょう。",
    unturned:"図形はまだ回っていません。赤い点が O の周りを動く向きを見ましょう。",
    turnDirection:"反対の方向に回しています。円の矢印を見直しましょう。",
    turnAmount:"回した量が条件と違います。90° と 180° を区別しましょう。"
  }
};
export const activityCopy = language => copy[language] || copy.ko;
