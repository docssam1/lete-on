(()=>{
const KEY='yubinYujunStore.items.v2';
const now=new Date().toISOString();
const updates={
'seed-milkstick':{shelf:5,quantity:9},'seed-kadayif':{shelf:5},
'seed-hardtak':{shelf:4,quantity:12},'seed-gangnaengi':{shelf:4},'seed-butterpop':{shelf:4},'seed-banana':{shelf:4},
'seed-goraebab':{shelf:1},'seed-oreo':{shelf:1},'seed-kunna':{shelf:1},'seed-kitsune-udon':{shelf:1,quantity:3},'seed-ritz-choco-sand':{shelf:1},'seed-popin-ice':{shelf:1},'seed-popin-pizza':{shelf:1},'seed-popin-sushi':{shelf:1},'seed-kikori-kirikabu':{shelf:1}
};
let items=[];try{const p=JSON.parse(localStorage.getItem(KEY)||'[]');if(Array.isArray(p))items=p;}catch{}
for(const item of items){if(updates[item.id])Object.assign(item,updates[item.id],{updatedAt:now});}
localStorage.setItem(KEY,JSON.stringify(items));
})();
