/* Original wizard cosmetics. Load after numi-avatar.js.
   Extends existing hat/cape/bg contracts; no free unlock, network, wallet or progress mutation.
   art.shape names identify original SVG geometry in numi-render.js, never external assets. */
(function(root){
'use strict';
const prices={common:80,rare:180,epic:360,legendary:600};
const text=(ko,en,zh)=>({ko,en,zh});
function make(id,names,features,rarity,colors){
  return {id,ko:names[0],en:names[1],zh:names[2],free:false,price:prices[rarity],rarity,
    description:text(...features),desc:text(...features),
    art:{shape:id,base:colors[0],trim:colors[1],accent:colors[2]||'#fff5d7'}};
}
const hats=[
  make('explorer-brim',['깃털 탐험모','Feather explorer hat','羽毛探险帽'],['넓은 챙에 깃털을 꽂은 탐험 모자예요.','A broad brim and a tall feather for exploring.','宽帽檐上插着羽毛的探险帽。'],'common',['#806547','#d5b779','#eae0bb']),
  make('scholar-beret',['별단추 베레모','Star-button beret','星扣贝雷帽'],['납작한 베레모에 작은 별단추를 달았어요.','A soft flat beret fastened with a little star.','扁软贝雷帽上缀着一颗星扣。'],'common',['#655276','#bca4c9','#f3d58a']),
  make('library-cap',['책갈피 학사모','Bookmark scholar cap','书签学士帽'],['네모난 윗판과 긴 책갈피 술이 달렸어요.','A square crown with a bookmark-shaped tassel.','方形帽顶配着书签形的流苏。'],'common',['#3b5259','#cfb677','#f7ead0']),
  make('sky-goggles',['구름 비행모','Cloud aviator cap','云朵飞行帽'],['귀덮개와 둥근 고글을 함께 썼어요.','Ear flaps and round goggles for cloud flights.','护耳帽配圆圆的飞行眼镜。'],'rare',['#966b4e','#dec49a','#b8d4d1']),
  make('leaf-wreath',['월계 잎관','Laurel leaf crown','月桂叶冠'],['가지가 양쪽으로 뻗고 잎이 차례로 돋아요.','Two curved branches carry rows of laurel leaves.','两侧弯枝上依次长出月桂叶。'],'common',['#557151','#c4d09a','#e6d89c']),
  make('flower-circlet',['들꽃 화관','Meadow flower circlet','野花花冠'],['서로 다른 꽃잎 다섯 송이를 엮었어요.','Five little flowers are woven into a circlet.','五朵小花编成了一圈花冠。'],'rare',['#aa6775','#caa85e','#ffe3b5']),
  make('moon-tiara',['초승달 머리관','Crescent tiara','新月头冠'],['가느다란 관 한가운데 초승달이 떠 있어요.','A crescent moon rises above a slender band.','纤细的头冠中央升起一弯新月。'],'rare',['#746083','#dec887','#fff5d7']),
  make('crystal-diadem',['수정 봉우리 관','Crystal peak diadem','水晶峰冠'],['높이가 다른 수정 다섯 개를 세웠어요.','Five crystal peaks form a pointed diadem.','五座高低不同的水晶组成尖冠。'],'epic',['#638f93','#d8e6dc','#dac5e7']),
  make('compass-tricorne',['항해 나침반모','Compass tricorne','罗盘三角帽'],['세 귀가 접힌 모자 앞에 나침반을 달았어요.','Three folded corners frame a small compass badge.','三角折边帽前缀着一枚小罗盘。'],'rare',['#475b67','#c4a365','#eee0bc']),
  make('fox-hood',['숲 여우 두건','Forest fox hood','森林狐狸兜帽'],['뾰족한 두 귀가 난 포근한 두건이에요.','A soft hood with two pointed fox ears.','柔软兜帽上竖着两只尖尖的狐狸耳朵。'],'rare',['#b87d4e','#e3c18a','#fff2d3']),
  make('sprout-cap',['새싹 씨앗모','Sprout seed cap','嫩芽种子帽'],['씨앗 모양 모자 위로 두 잎이 올라와요.','Two fresh leaves grow from a round seed cap.','圆圆种子帽上长出了两片嫩叶。'],'common',['#91704d','#638451','#d2ddac']),
  make('winter-knit',['방울 뜨개모','Pom-pom knit cap','绒球针织帽'],['뜨개 줄무늬와 둥근 방울이 있어요.','A ribbed knitted cap topped with a round pom-pom.','针织条纹帽顶有一颗圆绒球。'],'common',['#936b79','#dfc4bf','#faf0dd']),
  make('quill-band',['깃펜 머리띠','Quill headband','羽笔头带'],['머리띠 한쪽에 긴 깃펜을 끼웠어요.','A long writing quill sits on one side of the band.','头带一侧别着一支长羽毛笔。'],'common',['#74604b','#bea66e','#ede3c9']),
  make('sailor-cap',['매듭 선원모','Knotted sailor cap','绳结水手帽'],['넓게 접은 챙 앞에 밧줄 매듭을 달았어요.','A folded white cap with a rope knot in front.','翻边白帽前系着一个绳结。'],'common',['#ede4cd','#526c73','#c9aa6a']),
  make('astral-turban',['별보석 터번','Star-jewel turban','星宝石头巾'],['천을 교차해 감고 가운데 보석을 달았어요.','Crossed folds of cloth hold a central jewel.','交叉包裹的布褶中央镶着宝石。'],'rare',['#7d6382','#d3b275','#bf8297']),
  make('mushroom-cap',['점박이 버섯모','Speckled mushroom cap','斑点蘑菇帽'],['둥근 버섯 갓 아래에 주름이 보여요.','A rounded mushroom cap with spots and fine gills.','圆圆蘑菇帽上有斑点，下面露着菌褶。'],'epic',['#9f5f56','#e4cfb1','#f9edda']),
  make('clockwork-top',['태엽 톱니모','Clockwork top hat','发条齿轮高帽'],['높은 모자 옆에 톱니와 태엽 열쇠가 있어요.','A tall hat with a gear and a winding key.','高帽一侧有齿轮和发条钥匙。'],'epic',['#5e5552','#b4935d','#e6d09b']),
  make('observatory-dome',['별돔 천문모','Observatory dome hat','星穹天文帽'],['관측 돔과 작은 망원경이 머리 위에 올라가요.','A tiny observatory dome and telescope crown the hat.','小小观测圆顶和望远镜立在帽顶。'],'legendary',['#4d586e','#c6ad6c','#e8dfbe']),
];
const capes=[
  make('traveler-short',['길잡이 짧은 망토','Guide short cape','向导短披风'],['짧고 둥근 끝에 작은 주머니를 달았어요.','A short rounded cape with a little side pocket.','短短圆边披风上缝着一个小口袋。'],'common',['#7f6b53','#cbb58c','#eadcbd']),
  make('silk-scarf',['바람결 목도리','Breeze scarf cape','轻风围巾披风'],['긴 목도리 두 끝이 양쪽으로 펼쳐져요.','Two long scarf tails spread on either side.','长围巾的两端向两侧飘开。'],'common',['#b07a7c','#e5bdac','#f2dec3']),
  make('leaf-cut',['큰잎 망토','Broadleaf cape','阔叶披风'],['잎맥과 톱니 가장자리가 있는 잎 망토예요.','A leaf-cut cloak with veins and a scalloped edge.','叶形披风有叶脉和波齿边。'],'common',['#5d7957','#c3c78d','#e5d9ad']),
  make('feathered',['깃털 어깨망토','Feather shoulder cape','羽毛肩披风'],['겹겹이 놓인 깃털이 둥근 어깨를 감싸요.','Overlapping feathers wrap around the shoulders.','层层羽毛围住圆圆的肩头。'],'rare',['#7c7485','#d3c5cf','#eee4ce']),
  make('tidal-collar',['물결 깃 망토','Tidal collar cape','潮汐领披风'],['조개 모양 깃과 물결 끝단을 그렸어요.','A shell-like collar meets a wavy lower edge.','贝壳形衣领连接着波浪下摆。'],'rare',['#5f8586','#c5d8c9','#e8d7a9']),
  make('geometric-trim',['삼각 테두리 망토','Triangle-border cape','三角饰边披风'],['직선 재단과 삼각형 테두리가 또렷해요.','A straight-cut cloak edged with repeating triangles.','直线剪裁披风镶着连续三角边纹。'],'common',['#786b83','#d5b878','#f0dfb8']),
  make('comet-tail',['혜성 꼬리 망토','Comet-tail cape','彗星尾披风'],['한쪽으로 길게 뻗은 꼬리에 혜성을 수놓았어요.','An asymmetric long tail carries an embroidered comet.','斜长尾摆上绣着一颗彗星。'],'epic',['#5f627f','#d2b775','#ede0ac']),
  make('fern-embroidered',['고사리 자수 망토','Fern-embroidered cape','蕨叶刺绣披风'],['긴 잎줄기와 작은 잎 자수가 아래로 자라요.','Fine fern fronds grow down the cloth.','细细蕨叶刺绣沿着披风向下生长。'],'common',['#65715c','#c4b784','#e5dcba']),
  make('paper-fold',['종이접기 망토','Folded-paper cape','折纸披风'],['접힌 면들이 층을 이루는 각진 망토예요.','Angular folded panels form a layered paper cloak.','有棱角的折面叠成纸披风。'],'rare',['#c6af8d','#827064','#f5e7cc']),
  make('sunburst',['햇살 부채망토','Sunburst fan cape','日光扇披风'],['어깨에서 퍼지는 부채 주름과 햇살이 있어요.','Fan pleats spread from a sun clasp at the shoulders.','扇形褶纹从肩头太阳扣向外展开。'],'rare',['#b98f51','#f0d59b','#fff0cb']),
  make('checker-weave',['바둑 직조 망토','Checker-weave cape','棋格织纹披风'],['작은 네모 직조무늬와 술 장식을 달았어요.','A woven square pattern ends in a row of tassels.','方格织纹披风下摆缀着一排流苏。'],'common',['#8b7368','#d8c3aa','#eadbc2']),
  make('butterfly-split',['나비 두날개 망토','Butterfly split cape','双翼蝴蝶披风'],['양쪽으로 나뉜 날개에 서로 다른 곡선을 넣었어요.','Two split wings carry curved vein patterns.','左右分开的双翼上绘着弯弯翅脉。'],'rare',['#98738e','#dfb9c6','#f0dbb6']),
  make('constellation',['별자리 수놓은 망토','Constellation cape','星座刺绣披风'],['별을 선으로 잇고 낮은 끝을 둘로 갈랐어요.','Linked stars sit above a gently split hem.','连线星座下是轻轻分开的双下摆。'],'epic',['#46576c','#d5bc78','#f2e6bf']),
  make('aurora-fan',['오로라 겹망토','Layered aurora cape','极光叠层披风'],['세 겹 곡선 천이 오로라처럼 겹쳐져요.','Three curved cloth layers form an aurora fan.','三层弯曲布片叠成极光扇面。'],'epic',['#607e83','#b3c7b8','#b19cbd']),
  make('atlas-scroll',['지도 두루마리 망토','Atlas-scroll cape','地图卷轴披风'],['말린 끝과 길 안내 선을 넣은 지도 망토예요.','Rolled edges frame a map and its winding route.','卷曲边缘围住地图与蜿蜒路线。'],'legendary',['#d0b890','#86735d','#f3e5c5']),
];
const bgs=[
  make('moon-orbit',['초승달 궤도','Crescent orbit','新月轨道'],['초상화 뒤에 달과 작은 궤도 점이 떠요. 마을 배경은 바뀌지 않아요.','A moon and orbital dots decorate the portrait; the village stays the same.','新月与轨道圆点装饰角色画像，不改变村庄背景。'],'common',['#a58fba','#e2ce95','#f5ecd0']),
  make('constellation-map',['이어진 별자리','Linked constellation','连线星座'],['초상화 둘레의 별을 가느다란 선으로 이어요.','Fine lines connect stars around the portrait.','细线把角色画像周围的星星连起来。'],'common',['#8494ab','#e1c68b','#f7eccb']),
  make('book-arch',['펼친 책 아치','Open-book arch','展开书拱'],['초상화 뒤를 펼쳐진 책의 아치로 꾸며요.','An arch made of open books surrounds the portrait.','展开书本组成的拱门围住角色画像。'],'rare',['#a58a6a','#dbc5a0','#f5e9cf']),
  make('compass-rose',['여행 나침반','Travel compass rose','旅行罗盘'],['초상화 뒤에 여덟 방향 나침반을 그려요.','An eight-point compass rose sits behind the portrait.','八向罗盘装饰在角色画像后方。'],'rare',['#8a7761','#d7bd80','#eee3c7']),
  make('firefly-garden',['반딧불 정원','Firefly garden','萤火花园'],['초상화 양옆의 풀잎 위로 반딧불이 떠요.','Fireflies hover above grass on both portrait sides.','萤火虫飞在角色画像两旁的草叶上。'],'common',['#7c956f','#d6c982','#ede5b2']),
  make('leaf-spiral',['잎사귀 소용돌이','Leaf spiral','叶片旋涡'],['초상화 둘레로 작은 잎이 나선을 그려요.','Small leaves trace a spiral around the portrait.','小叶片绕着角色画像画出螺旋。'],'common',['#78906d','#c6c991','#e0d4a6']),
  make('planet-rings',['세 행성 고리','Three planet rings','三行星环'],['초상화 뒤에 서로 기울기가 다른 행성 고리를 놓아요.','Three tilted planetary rings frame the portrait.','三个不同倾角的行星环围住角色画像。'],'epic',['#8f8fab','#c5b3c3','#e9cf9b']),
  make('cloud-window',['구름 창문','Cloud window','云朵窗'],['초상화가 둥근 구름 창문 안에 보여요.','A rounded cloud window frames the portrait.','角色画像出现在圆圆的云朵窗中。'],'common',['#c7d3cf','#91aaa9','#f4ecda']),
  make('crystal-cluster',['수정 동굴빛','Crystal cluster','晶洞微光'],['초상화 양옆에 높이가 다른 수정이 솟아요.','Crystal clusters of different heights frame the portrait.','角色画像两侧耸起高低不同的水晶簇。'],'rare',['#9ab5b1','#d1d7c8','#d1bfdf']),
  make('prism-fan',['프리즘 부채빛','Prism fan','棱镜扇光'],['초상화 뒤에 각진 프리즘 면이 부채처럼 펼쳐져요.','Angular prism panels spread behind the portrait.','棱角分明的棱镜面在角色画像后方扇形展开。'],'epic',['#97b2ad','#d6b7be','#e5d4a0']),
  make('sundial-ring',['해시계 테두리','Sundial ring','日晷边框'],['초상화 둘레를 눈금과 해 그림자로 꾸며요.','Ticks and a sun shadow form a sundial portrait border.','刻度与日影构成角色画像的日晷边框。'],'rare',['#b09764','#dfc890','#eee4c8']),
  make('geometric-bloom',['도형 꽃송이','Geometric bloom','几何花朵'],['초상화 뒤에 삼각형과 원으로 만든 꽃이 피어요.','A flower of triangles and circles blooms behind the portrait.','三角形与圆组成的花朵在角色画像后方盛开。'],'common',['#9d829c','#b3c1a1','#e4cd9c']),
  make('ink-ripples',['잉크 물결','Ink ripples','墨水涟漪'],['초상화 아래에서 잉크 고리가 퍼져요.','Soft ink rings spread beneath the portrait.','柔和墨圈从角色画像下方散开。'],'rare',['#75858a','#a7b8b5','#d1c5aa']),
  make('floating-scrolls',['떠다니는 두루마리','Floating scrolls','漂浮卷轴'],['초상화 양옆에 펼친 두루마리가 떠요.','Unrolled parchment scrolls float on both portrait sides.','展开的羊皮纸卷漂浮在角色画像两旁。'],'rare',['#b79b72','#e8d5ae','#f7ead0']),
  make('lantern-halo',['등불 둥근길','Lantern halo','灯笼光环'],['초상화 둘레의 작은 등불이 둥근 길을 만들어요.','Little lanterns make a circular path around the portrait.','小灯笼沿着角色画像周围连成圆路。'],'epic',['#b38a61','#e6c886','#f7e3b2']),
  make('snow-peaks',['눈산 창틀','Snow peak frame','雪山窗框'],['초상화 뒤에 눈 덮인 세 봉우리가 보여요.','Three snowy peaks form the portrait frame.','三座雪峰构成角色画像边框。'],'rare',['#a3b8ba','#dbe3d7','#eee8d6']),
  make('observatory-chart',['천문 관측도','Observatory chart','天文观测图'],['초상화 뒤에 눈금 원과 별 관측선을 겹쳐요.','Concentric scales and star-sighting lines frame the portrait.','同心刻度圆与观星线交叠在角色画像后方。'],'legendary',['#687b8f','#d0b578','#e9dfbe']),
  make('portal-rings',['겹친 마법 문','Layered magic portal','叠层魔法门'],['초상화 둘레의 겹친 문에 서로 다른 도형을 새겼어요.','Nested portal rings carry different geometric markings.','角色画像周围的叠层门环刻着不同几何纹样。'],'legendary',['#89799d','#c8b083','#ddd2b6']),
];
const groups={hat:hats,cape:capes,bg:bgs};
const slots={hat:'hats',cape:'capes',bg:'bgs'};
function item(type,id){return (groups[type]||[]).find(x=>x.id===id)||null;}
function register(){
  if(!root.NM_AVATAR)throw Error('Load numi-avatar.js before cosmetics-catalog.js');
  Object.keys(groups).forEach(type=>{const list=root.NM_AVATAR[slots[type]];
    for(const candidate of groups[type])if(!list.some(x=>x.id===candidate.id))list.push(candidate);
  });
}
const api={version:'20261024-cosmetics51',groups,prices,register,item,
  isNewItem:(type,id)=>!!item(type,id),
  // The 3D mesh kit predates these shapes. Use the existing original-HTML billboard path
  // rather than silently dropping a purchased hat or cape. Portrait BGs stay portrait-only.
  needsSprite:char=>!!(char&&(item('hat',char.hat)||item('cape',char.cape)))};
register();root.NM_COSMETICS=api;
if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
