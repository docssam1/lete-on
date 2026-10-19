/* SomaSem P, 2019 publication: short arithmetic topic cues from the public
 * eight-volume contents. These are app practice anchors, not publisher items
 * or a claim that the book uses the same question or solution format. */
(function () {
  'use strict';
  const W = typeof window !== 'undefined' ? window : globalThis;
  const c = (course, topics, refs) => ({ course, topics, refs: refs.split(' ') });
  W.NM_SOMA_P_2019 = { series: 'soma-p', before: 'f-order10', courses: [
    c(1, '30까지 5 더하기·빼기', 'AD3@1 SB3@1'),
    c(2, '30까지 6 더하기·빼기', 'AD3@1 SB3@1'),
    c(3, '30까지 10 더하기·빼기', 'AD4@1 SB3@1'),
    c(4, '30까지 9 더하기·빼기', 'AD3@2 SB3@2'),
    c(5, '9까지 가르기·모으기', 'NS2@2'),
    c(6, '10 가르기·모으기', 'NS3@2'),
    c(7, '10을 이용한 더하기', 'AD2@1'),
    c(8, '10을 이용한 빼기', 'SB2@1')
  ] };
})();
