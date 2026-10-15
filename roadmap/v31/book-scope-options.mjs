// Book parts, not a curriculum sequence or a level assessment.
// Publisher structures and user-provided examples remain different evidence roles.
const letters=['A','B','C','D'];
const compact=value=>String(value||'').normalize('NFKC').toLowerCase().replace(/\s+/g,'');
const sources={
 cmath:{role:'publisher',title:'시매쓰출판 공식 1031 교재 구성',url:'https://cmath.co.kr/bbs/view.asp?gbn=com&no=1081830199&pds_type=1'},
 cmathList:{role:'publisher',title:'시매쓰출판 공식 출판물 목록',url:'https://cmath.co.kr/pub/book_list.asp?sct1=310,302,305&sct2=310'},
 fields:{role:'publisher_catalog',title:'필즈 베이직 상·중·하',url:'https://www.learningshop.co.kr/goods/goods_view.php?goodsNo=1003'},
 facto:{role:'publisher',title:'팩토 공식 교재 목록 · 현행 기본·응용 구성',url:'https://www.mathtian.com/book/book_main.aspx'},
 miracleFirst:{role:'publisher',title:'기적의 계산법 1권',url:'https://school.gilbut.co.kr/book/view?bookcode=BN003275&perdevice=pc'},
 miracleLast:{role:'publisher',title:'기적의 계산법 12권',url:'https://school.gilbut.co.kr/book/view?bookcode=BN003286'},
 deoclsem:{role:'user_provided_example',title:'사용자 제공 2026 7세 E1반 운영 로드맵 · 더클셈 2~12권 사례'},
 soma:{role:'user_provided_source',title:'보존 원표에서 확인한 소마셈 K·P 표기',url:'reference/display/S1.html'},
};
const pairs=values=>values.map(value=>[value,value]);
function model(kind,values,{placeholder='권·범위 선택',customPlaceholder='기억나는 권·범위',evidence=[]}={}){
 return {kind,options:pairs(values),placeholder,customPlaceholder,unknownValue:'모름',unknownLabel:'권·범위를 모르겠어요',sources:evidence.map(key=>({...sources[key]}))};
}
function previousFactoEdition(bookName,edition,currentValue){
 const value=[bookName,edition,currentValue].join(' ');
 const years=[...String(edition||'').matchAll(/20\d{2}/g)].map(match=>Number(match[0]));
 return /원리|탐구|구판|이전\s*판/.test(value)||years.some(year=>year<2024);
}
function factoParts(level){
 const abc=level<=3?letters.slice(0,3):letters.slice(0,2);
 return ['기본','응용'].flatMap(kind=>abc.map(letter=>`${kind} ${letter}`));
}

// Existing strings are deliberately not normalized into these options. The caller
// keeps an unmatched saved value visible as an existing entry, without converting it.
export function bookScopeOptions({track='',bookName='',edition='',currentValue=''}={}){
 const name=compact(bookName);
 if(track==='thinking'){
  if(/^(?:pre1031|프리1031|1031pre|1031(?:입문|초급|중급|고급))$/.test(name)){
   return model('publisher_parts',letters,{placeholder:'A~D 중 선택',customPlaceholder:'기억나는 권·진행 범위',evidence:['cmath','cmathList']});
  }
  if(name==='필즈베이직')return model('publisher_parts',['상','중','하'],{placeholder:'상·중·하 선택',evidence:['fields']});
  const elementary=/^(?:초등)?팩토(?:(?:레벨|lv\.?)([1-6])|([1-6])(?:레벨|단계)?)?$/.exec(name);
  if(['킨더팩토','키즈팩토'].includes(name)||elementary){
   if(previousFactoEdition(bookName,edition,currentValue))return model('unconfirmed_previous_edition',[],{customPlaceholder:'기존 판본의 권·범위 그대로 입력',evidence:['facto']});
   if(name==='킨더팩토')return model('publisher_current_parts',letters,{placeholder:'A~D 중 선택',evidence:['facto']});
   if(name==='키즈팩토')return model('publisher_current_parts',factoParts(1),{placeholder:'기본·응용 권 선택',evidence:['facto']});
   const level=Number(elementary[1]||elementary[2]||0);
   const values=level?factoParts(level):Array.from({length:6},(_,index)=>index+1).flatMap(value=>factoParts(value).map(part=>`${value}레벨 ${part}`));
   return model('publisher_current_parts',values,{placeholder:level?'기본·응용 권 선택':'레벨·권 선택',evidence:['facto']});
  }
 }
 if(track==='arithmetic'){
  if(name==='기적의계산법')return model('publisher_parts',Array.from({length:12},(_,i)=>`${i+1}권`),{placeholder:'권 선택',evidence:['miracleFirst','miracleLast']});
  // This is the supplied class example, not a claim about every published volume.
  if(name==='더클셈')return model('source_example_parts',Array.from({length:11},(_,i)=>`${i+2}권`),{placeholder:'권 선택',evidence:['deoclsem']});
  if(name==='소마셈')return model('source_example_parts',['K','P'],{placeholder:'기억나는 단계 선택',customPlaceholder:'예: A5, P 단계',evidence:['soma']});
 }
 return model('unconfirmed_book_parts',[],{placeholder:'권·범위 선택',customPlaceholder:'책에 적힌 권·범위'});
}
