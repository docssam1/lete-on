/** Read-only photographs projected onto card faces. No source file is rewritten. */
export const FOOD_PAPER_POLYGONS = {
  fish: [[499,9],[523,10],[526,79],[571,114],[626,140],[678,207],[718,264],[719,299],[696,319],[604,320],[557,307],[557,287],[510,251],[483,185],[449,137],[408,128],[400,111],[411,91],[447,74],[476,73],[479,31]],
  carrot: [[56,75],[80,65],[112,75],[178,134],[228,194],[256,235],[263,265],[296,281],[307,310],[299,342],[283,365],[259,366],[241,378],[200,386],[169,373],[157,344],[153,302],[122,300],[99,289],[73,237],[58,159],[46,115]],
};

export const PAPER_PHOTO_REGIONS = Object.freeze({
  side: {source:'assembly-05.png',crop:[15,17,482,121],flipX:true},
  bodySide: {source:'assembly-05.png',crop:[185,74,312,64],flipX:true},
  nameCard: {source:'assembly-05.png',crop:[259,77,162,37]},
  bodyTop: {source:'assembly-05.png',quad:[[493,31],[186,31],[195,69],[494,81]]},
  headTop: {source:'assembly-10-branded.svg',quad:[[178,120],[452,145],[465,222],[188,196]]},
  tail: {source:'assembly-05.png',crop:[491,29,209,108],flipX:true},
  frontFoot: {source:'assembly-05.png',crop:[145,121,112,104],flipX:true},
  backFoot: {source:'assembly-05.png',crop:[398,130,106,111],flipX:true},
  lower: {source:'assembly-01.png',crop:[8,203,382,130],flipX:true},
  teeth: {source:'assembly-02.png',quad:[[301,167],[668,90],[689,119],[303,204]]},
  headTeeth: {source:'assembly-06.png',quad:[[207,115],[675,99],[692,124],[213,151]]},
  eye: {source:'assembly-06.png',crop:[85,13,119,113],polygon:[[89,67],[102,43],[127,26],[153,17],[175,17],[192,31],[199,51],[190,78],[172,102],[148,115],[125,113],[104,93]]},
  box: {source:'assembly-07.png',crop:[104,184,284,26]},
  fish: {source:'assembly-09-branded.svg',crop:[399,8,323,316],flipX:true,polygon:FOOD_PAPER_POLYGONS.fish},
  carrot: {source:'assembly-09-branded.svg',crop:[45,64,263,323],polygon:FOOD_PAPER_POLYGONS.carrot},
});

function makeCanvas(width,height){const canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;return canvas;}

function drawTriangle(context,image,source,destination){
  const [p0,p1,p2]=source,[q0,q1,q2]=destination;
  const det=p0[0]*(p1[1]-p2[1])+p1[0]*(p2[1]-p0[1])+p2[0]*(p0[1]-p1[1]);
  const coefficients=axis=>[
    (q0[axis]*(p1[1]-p2[1])+q1[axis]*(p2[1]-p0[1])+q2[axis]*(p0[1]-p1[1]))/det,
    (q0[axis]*(p2[0]-p1[0])+q1[axis]*(p0[0]-p2[0])+q2[axis]*(p1[0]-p0[0]))/det,
    (q0[axis]*(p1[0]*p2[1]-p2[0]*p1[1])+q1[axis]*(p2[0]*p0[1]-p0[0]*p2[1])+q2[axis]*(p0[0]*p1[1]-p1[0]*p0[1]))/det,
  ];
  const [a,c,e]=coefficients(0),[b,d,f]=coefficients(1);
  context.save();context.beginPath();destination.forEach(([x,y],i)=>i?context.lineTo(x,y):context.moveTo(x,y));context.closePath();context.clip();context.setTransform(a,b,c,d,e,f);context.drawImage(image,0,0);context.restore();
}

function projectPhoto(image,region){
  const isWide=region.crop?region.crop[2]>region.crop[3]*2:region===PAPER_PHOTO_REGIONS.bodyTop;
  const width=isWide?1024:512,height=isWide?256:512;
  const canvas=makeCanvas(width,height),context=canvas.getContext('2d');
  if(region.flipX){context.translate(width,0);context.scale(-1,1);}
  if(region.crop){
    const[x,y,w,h]=region.crop;
    if(region.polygon){context.beginPath();region.polygon.forEach(([px,py],i)=>{const cx=(px-x)/w*width,cy=(py-y)/h*height;i?context.lineTo(cx,cy):context.moveTo(cx,cy);});context.closePath();context.clip();}
    context.drawImage(image,x,y,w,h,0,0,width,height);
  }else{
    const[q0,q1,q2,q3]=region.quad;
    drawTriangle(context,image,[q0,q1,q2],[[0,0],[width,0],[width,height]]);
    drawTriangle(context,image,[q0,q2,q3],[[0,0],[width,height],[0,height]]);
  }
  return canvas;
}

export function foodCardOutline(kind,width=.96){
  const region=PAPER_PHOTO_REGIONS[kind],[x,y,w,h]=region.crop;
  const centerX=x+w/2,centerY=y+h/2,scale=width/w;
  return FOOD_PAPER_POLYGONS[kind].map(([px,py])=>[(region.flipX?-1:1)*(px-centerX)*scale,(centerY-py)*scale]);
}

export async function loadPaperTextures(THREE,registerTexture){
  const names=[...new Set(Object.values(PAPER_PHOTO_REGIONS).map(region=>region.source))];
  const images=new Map(await Promise.all(names.map(async name=>{
    const image=new Image();image.decoding='async';image.src=new URL(`../assets/${name}`,import.meta.url).href;await image.decode();return[name,image];
  })));
  const textures={};
  for(const[name,region]of Object.entries(PAPER_PHOTO_REGIONS)){
    const texture=new THREE.CanvasTexture(projectPhoto(images.get(region.source),region));
    texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;texture.wrapS=texture.wrapT=THREE.ClampToEdgeWrapping;
    registerTexture(texture);textures[name]=texture;
  }
  return{textures,sources:names,regions:PAPER_PHOTO_REGIONS};
}
