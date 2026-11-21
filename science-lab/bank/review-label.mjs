// Keep the topic intact and choose its Korean object particle for the review title.
export function reviewLabel(topic){
 if(typeof topic!=='string'||!topic.trim())throw new TypeError('복습할 주제가 필요합니다.');
 const term=topic.trim(),code=term.charCodeAt(term.length-1);
 const particle=code>=0xac00&&code<=0xd7a3?((code-0xac00)%28?'을':'를'):'';
 return `${term}${particle} 다시 살펴봐요`;
}
