// 독쌤 화산 읽을거리. 기존 단원·공개 사진을 재사용하고, 사실 표현은 1차 출처와 대조했다.
import { media } from '../media/s41-u03b.media.js';

export const reading = {
  id: 's41-u03b-reading-01', unit: 's41-u03b', issue: '01',
  kicker: '독쌤의 과학 읽기', topic: '지구과학 · 화산 활동',
  title: '화산이 지나간 자리에는 무엇이 남을까?',
  lead: '뜨거운 용암이 식은 뒤에도, 화산의 이야기는 땅 위에 남아 있어요.',
  hero: {
    ...media.gallery.find((m) => m.src.endsWith('/Pahoehoe_toe.jpg')),
    cap: '용암의 겉은 먼저 식어 어둡게 굳고, 안쪽에는 뜨거운 용암이 남아 있어요. 하와이 킬라우에아, 2003.',
    credit: 'Hawaii Volcano Observatory (DAS) / USGS · Public domain',
    look: '밝은 부분과 어두운 부분은 무엇이 다를까요?',
  },
  sections: [
    { title: '산꼭대기에 남은 호수', text: '백두산 천지는 화산 활동으로 생긴 큰 웅덩이인 **칼데라**에 물이 고인 호수예요. 한라산 꼭대기의 백록담도 화산 활동이 남긴 **분화구**에 있어요. 두 호수는 화산이 땅의 모습을 바꾼 흔적이지요.' },
    { title: '용암이 돌이 되면', text: '제주의 돌담과 돌하르방에서는 **현무암**을 볼 수 있어요. 용암이 빨리 식으면 알갱이가 자랄 시간이 짧아요. 구멍이 있는 현무암도 있는데, 그 구멍은 용암 속 **가스 방울**이 있던 자리예요.' },
    { title: '땅속 열도 자원이 돼요', text: '화산 지역의 **땅속 열**은 물을 데워 온천을 만들기도 해요. 뜨거운 물과 수증기를 이용해 전기를 만드는 곳도 있어요. 이렇게 땅속의 열을 이용하는 발전을 **지열 발전**이라고 해요.' },
    { title: '이로움과 피해를 함께 봐요', text: '**화산재**는 아주 작은 고체 알갱이예요. 비행기 운항을 어렵게 하고 농작물을 해칠 수 있어요. 화산은 새로운 지형과 자원을 남기지만 큰 피해도 줄 수 있어요. 한쪽 모습만 보고 판단하지 않아요.' },
  ],
  question: '화산이 남긴 흔적 한 가지와 우리 생활에 주는 영향 한 가지를 골라, 글에서 찾은 근거와 함께 이야기해 보세요.',
  teacherTip: '이로움만 또는 피해만 말하면 다른 꼭지도 다시 읽게 하세요. 현무암에 모두 구멍이 있다고 일반화하지 않는지 살펴보세요.',
  video: media.explore,
  labHref: '../v2/#/s41-u03b/2/lab',
  publicLabHref: 'https://lete-on.gfieldacademy.net/science-lab/v2/#/s41-u03b/2/lab',
  pageHref: '../v2/#/s41-u03b/reading',
  qr: '../assets/qr-s41-u03b-lab.svg',
  sources: [
    { label: 'Smithsonian · 백두산', href: 'https://volcano.si.edu/volcano.cfm?vn=305060' },
    { label: 'UNESCO · 제주', href: 'https://whc.unesco.org/en/list/1264' },
    { label: 'USGS · 암석과 기공', href: 'https://www.usgs.gov/educational-resources/find-feature-vesicles' },
    { label: 'USGS · 지열', href: 'https://www.usgs.gov/volcanoes/coso-volcanic-field' },
    { label: 'USGS · 화산재', href: 'https://pubs.usgs.gov/fs/2010/3116/' },
  ],
};
