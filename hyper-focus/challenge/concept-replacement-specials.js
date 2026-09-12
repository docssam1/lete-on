(function(root){
  'use strict';

  var INK='#24445b';
  var BLUE='#4f93ad';
  var PALE='#eef5f7';
  var BLACK='#263641';
  var WHITE='#ffffff';
  var ROD_COLORS=['#6ca6bd','#e0a35c','#7eaf87','#9b82bd'];
  var FAMILY_KEYS=[
    'checker-stack-count',
    'stack-box-fill',
    'stack-minimum-visible',
    'congruent-marked-partition',
    'net-colors-pair',
    'net-pips-pair',
    'dice-target-bottom',
    'tetra-cube-hole-count',
    'object-length-equivalence',
    'block-build-count',
    'simple-path-network',
    'rod-subset-lengths',
    'shortest-path-grid',
    'balance-substitution-pictures'
  ];
  var LESSON_ROLES=['basic','guided','review'];
  var DIFFICULTIES=['easy','same','same'];

  function esc(value){
    return String(value).replace(/[&<>"']/g,function(character){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character];
    });
  }

  function clone(value){
    return JSON.parse(JSON.stringify(value));
  }

  function text(x,y,value,size,fill,weight){
    return '<text x="'+x+'" y="'+y+'" font-size="'+(size||18)+'" fill="'+(fill||INK)+'" font-weight="'+(weight||500)+'" text-anchor="middle" dominant-baseline="middle">'+esc(value)+'</text>';
  }

  function rect(x,y,width,height,fill,stroke,strokeWidth,radius){
    return '<rect x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'" rx="'+(radius||0)+'" fill="'+(fill||WHITE)+'" stroke="'+(stroke||BLUE)+'" stroke-width="'+(strokeWidth||1.5)+'"/>';
  }

  function line(x1,y1,x2,y2,stroke,strokeWidth){
    return '<path d="M'+x1+' '+y1+'L'+x2+' '+y2+'" fill="none" stroke="'+(stroke||INK)+'" stroke-width="'+(strokeWidth||1.8)+'" stroke-linecap="round"/>';
  }

  function svg(body,height,label){
    return '<svg class="challenge-visual concept-replacement-visual" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 660 '+height+'" role="img" aria-label="'+esc(label)+'"><title>'+esc(label)+'</title>'+body+'</svg>';
  }

  function makeQuestion(spec){
    return {
      id:spec.id,
      typeId:'concept-'+spec.kind,
      lessonRole:spec.lessonRole,
      difficulty:spec.difficulty,
      difficultyEvidence:clone(spec.difficultyEvidence),
      prompt:spec.prompt,
      answer:clone(spec.answer),
      answerHtml:spec.answerHtml,
      solution:spec.solution,
      problemHtml:spec.problemHtml,
      solutionDiagram:spec.solutionDiagram,
      payload:Object.assign({
        kind:spec.kind,
        lessonRole:spec.lessonRole
      },clone(spec.payload))
    };
  }

  function polygon(points,fill,stroke,strokeWidth){
    return '<polygon points="'+points.map(function(point){return point[0]+','+point[1];}).join(' ')+'" fill="'+fill+'" stroke="'+(stroke||INK)+'" stroke-width="'+(strokeWidth||1.2)+'" stroke-linejoin="round"/>';
  }

  function isoPoint(x,y,z,originX,originY,unit){
    return [originX+(x-y)*unit*0.87,originY+(x+y)*unit*0.5-z*unit];
  }

  function isoPileBody(heights,options){
    var rows=heights.length;
    var columns=heights[0].length;
    var maximum=Math.max.apply(null,[].concat.apply([],heights));
    var unit=options.unit;
    var originX=options.originX;
    var originY=options.originY;
    var offset=options.blackOffset||0;
    var checker=options.checker===true;
    var border='#4d7183';
    var body='';
    for(var row=0;row<rows;row++){
      for(var column=0;column<columns;column++){
        var base=[
          isoPoint(column,row,0,originX,originY,unit),
          isoPoint(column+1,row,0,originX,originY,unit),
          isoPoint(column+1,row+1,0,originX,originY,unit),
          isoPoint(column,row+1,0,originX,originY,unit)
        ];
        body+=polygon(base,'#f8fbfc','#b7cbd4',0.9);
      }
    }
    var cubes=[];
    heights.forEach(function(rowValues,rowIndex){
      rowValues.forEach(function(height,columnIndex){
        for(var level=0;level<height;level++)cubes.push({x:columnIndex,y:rowIndex,z:level});
      });
    });
    cubes.sort(function(left,right){
      return (left.x+left.y)-(right.x+right.y)||left.z-right.z||left.y-right.y||left.x-right.x;
    });
    cubes.forEach(function(cube){
      var x=cube.x,y=cube.y,z=cube.z;
      var isBlack=checker&&((x+y+z+offset)%2===0);
      var customFills=typeof options.colorForCube==='function'?options.colorForCube(cube):null;
      var fills=customFills||(isBlack?['#36444d','#202b32','#151f25']:checker?['#fbfdfe','#e7f0f2','#cedfe4']:options.neutral?['#f8fcfd','#e1eef2','#c9dde4']:['#dff1eb','#b9dbd0','#91c5b6']);
      var p000=isoPoint(x,y,z,originX,originY,unit);
      var p100=isoPoint(x+1,y,z,originX,originY,unit);
      var p010=isoPoint(x,y+1,z,originX,originY,unit);
      var p110=isoPoint(x+1,y+1,z,originX,originY,unit);
      var p001=isoPoint(x,y,z+1,originX,originY,unit);
      var p101=isoPoint(x+1,y,z+1,originX,originY,unit);
      var p011=isoPoint(x,y+1,z+1,originX,originY,unit);
      var p111=isoPoint(x+1,y+1,z+1,originX,originY,unit);
      if(x===columns-1||heights[y][x+1]<=z)body+=polygon([p100,p110,p111,p101],fills[2],border,1.15);
      if(y===rows-1||heights[y+1][x]<=z)body+=polygon([p010,p110,p111,p011],fills[1],border,1.15);
      if(z===heights[y][x]-1)body+=polygon([p001,p101,p111,p011],fills[0],border,1.15);
    });
    return {body:body,maximum:maximum,cubeCount:cubes.length};
  }

  function solidHeights(size){
    return Array.from({length:size},function(){return Array(size).fill(size);});
  }

  function boxWireframe(width,depth,boxH,originX,originY,unit){
    var corners={};
    [0,width].forEach(function(x){[0,depth].forEach(function(y){[0,boxH].forEach(function(z){corners[[x,y,z].join(',')]=isoPoint(x,y,z,originX,originY,unit);});});});
    var edges=[
      [[0,0,0],[width,0,0]],[[0,depth,0],[width,depth,0]],[[0,0,boxH],[width,0,boxH]],[[0,depth,boxH],[width,depth,boxH]],
      [[0,0,0],[0,depth,0]],[[width,0,0],[width,depth,0]],[[0,0,boxH],[0,depth,boxH]],[[width,0,boxH],[width,depth,boxH]],
      [[0,0,0],[0,0,boxH]],[[width,0,0],[width,0,boxH]],[[0,depth,0],[0,depth,boxH]],[[width,depth,0],[width,depth,boxH]]
    ];
    return edges.map(function(edge){var a=corners[edge[0].join(',')],b=corners[edge[1].join(',')];return '<path d="M'+a[0]+' '+a[1]+'L'+b[0]+' '+b[1]+'" fill="none" stroke="#778a94" stroke-width="1.35" stroke-dasharray="5 4"/>';}).join('');
  }

  function stackBoxFillBody(heightMap,boxH,originX,originY,unit,showBox){
    var pile=isoPileBody(heightMap,{unit:unit,originX:originX,originY:originY,neutral:false});
    return pile.body+(showBox===false?'':boxWireframe(heightMap[0].length,heightMap.length,boxH,originX,originY,unit));
  }

  function stackBoxFillProblemSvg(heightMap,boxH){
    var body=stackBoxFillBody(heightMap,boxH,330,145,43,true);
    return svg(body,292,'높은 등각 시점으로 본 3×3 점선 상자와 안에 쌓인 쌓기나무');
  }

  function stackBoxFillSolutionSvg(heightMap,boxH){
    var full=solidHeights(3),unit=27;
    var body=text(165,18,'현재 모습',16,INK,700)+text(495,18,'가득 채운 모습',16,INK,700);
    body+=stackBoxFillBody(heightMap,boxH,165,110,unit,true);
    body+=text(330,112,'→',31,BLUE,800);
    body+=stackBoxFillBody(full,boxH,495,110,unit,false);
    return svg(body,205,'현재 쌓인 모습과 빈틈없이 가득 채운 상자를 나란히 비교한 풀이');
  }

  function stackMinimumSvg(heightMap,showGuide){
    var unit=36,originX=330,originY=148;
    var pile=isoPileBody(heightMap,{unit:unit,originX:originX,originY:originY,checker:false});
    var body=text(330,20,'쌓기나무',17,INK,700)+pile.body;
    body+=line(273,238,224,262,INK,1.7)+'<path d="M224 262l6 -9 5 10z" fill="'+INK+'"/>'+text(206,274,'앞',14,INK,700);
    body+=line(387,238,436,262,INK,1.7)+'<path d="M436 262l-11 1 5 -10z" fill="'+INK+'"/>'+text(454,274,'오른쪽',14,INK,700);
    if(showGuide){
      heightMap.forEach(function(row,rowIndex){
        row.forEach(function(height,columnIndex){
          if(!height)return;
          var top=isoPoint(columnIndex+0.5,rowIndex+0.5,height,originX,originY,unit);
          body+='<circle cx="'+top[0]+'" cy="'+(top[1]-3)+'" r="12" fill="#ffffff" stroke="#23756f" stroke-width="1.6"/>';
          body+=text(top[0],top[1]-2,height,14,'#1f625e',800);
        });
      });
      body+=rect(190,286,280,34,'#edf7f2','#75a99f',1.2,17)+text(330,303,'층별로 나누어 세기',14,'#1f625e',700);
    }else{
      body+=text(330,304,'그림을 보고 쌓기나무를 하나씩 세어 보세요.',14,'#526c7a',600);
    }
    return svg(body,329,showGuide?'각 기둥의 높이를 표시한 쌓기나무 풀이':'계단 모양으로 쌓은 쌓기나무');
  }

  function tetraCubePlanBody(heightMap,x0,y0,cellSize,solution){
    var body='';
    heightMap.forEach(function(row,rowIndex){
      row.forEach(function(height,columnIndex){
        var x=x0+columnIndex*cellSize,y=y0+rowIndex*cellSize,hole=!height;
        body+=rect(x,y,cellSize,cellSize,hole?'#ffffff':'#dff1eb',hole?'#bb826e':'#559180',1.35,1);
        if(hole)body+='<path d="M'+(x+7)+' '+(y+7)+'L'+(x+cellSize-7)+' '+(y+cellSize-7)+'M'+(x+cellSize-7)+' '+(y+7)+'L'+(x+7)+' '+(y+cellSize-7)+'" stroke="#bd7058" stroke-width="1.5" stroke-linecap="round"/>';
      });
    });
    if(solution)body+=text(x0+heightMap[0].length*cellSize/2,y0+heightMap.length*cellSize+20,'× 표시: 비어 있는 자리',12,'#8b5949',700);
    return body;
  }

  function tetraCubeHoleSvg(spec,solution){
    var map=spec.heightMap,pieceAt={},palette=[['#dff1eb','#b9dbd0','#91c5b6'],['#d9ecf3','#b3d3df','#87b8ca'],['#e8efd5','#cedda8','#aac377'],['#f1e4c8','#dec79a','#c2a66d'],['#e8dff0','#cfbddf','#b195c8'],['#f0dcd8','#ddb9b0','#c79284'],['#dcebe5','#b9d4c9','#8eb6a6'],['#e2e8f1','#c1ccdd','#98a9c2'],['#eee7d2','#d8cba4','#b9a77a']];
    (spec.pieces||[]).forEach(function(piece,pieceIndex){piece.forEach(function(cube){pieceAt[cube.join(',')]=pieceIndex;});});
    var pile=isoPileBody(map,{unit:27,originX:190,originY:150,checker:false,colorForCube:function(cube){return palette[pieceAt[[cube.x,cube.y,cube.z].join(',')]%palette.length];}});
    var body=text(190,18,'쌓기나무 모양',16,INK,700)+pile.body;
    body+=text(505,18,'위에서 본 바탕그림',16,INK,700)+tetraCubePlanBody(map,435,52,28,solution);
    body+=text(190,258,'같은 색의 쌓기나무 4개가 테트라큐브 1개입니다.',12,'#526c7a',700);
    if(solution){
      var layers=[];for(var level=1;level<=pile.maximum;level++)layers.push(flattenHeightMap(map).filter(function(height){return height>=level;}).length);
      body+=rect(350,230,282,42,'#edf7f2','#75a99f',1.2,9)+text(491,245,layers.map(function(count,index){return (index+1)+'층 '+count+'개';}).join(' + ')+' = '+pile.cubeCount+'개',12,'#1f625e',800)+text(491,260,pile.cubeCount+' ÷ 4 = '+spec.answer+'이므로 테트라큐브는 '+spec.answer+'개',12,'#1f625e',800);
    }
    return svg(body,290,solution?'구멍이 있는 쌓기나무의 층별 개수와 테트라큐브 개수 풀이':'구멍이 있는 테트라큐브 쌓기 모양과 위에서 본 바탕그림');
  }

  function countChecker(heightMap,offset){
    var counts={black:0,white:0};
    heightMap.forEach(function(row,y){row.forEach(function(height,x){for(var z=0;z<height;z++)counts[(x+y+z+(offset||0))%2===0?'black':'white']++;});});
    return counts;
  }

  function checkerStackSvg(spec,solution){
    var pile=isoPileBody(spec.heightMap,{unit:34,originX:330,originY:168,checker:true,blackOffset:spec.offset});
    var body=text(330,18,'맞닿은 쌓기나무는 검은색과 흰색이 번갈아 놓입니다.',15,INK,700)+pile.body;
    if(solution){
      body+=rect(208,276,244,35,'#edf7f2','#75a99f',1.2,17)+text(330,294,'검은색 '+spec.answer.black+'개 · 흰색 '+spec.answer.white+'개',15,'#1f625e',800);
    }else body+=text(330,294,'검은색과 흰색 쌓기나무를 각각 세어 보세요.',14,'#526c7a',650);
    return svg(body,320,solution?'층별 색을 확인한 검은색과 흰색 쌓기나무 개수 풀이':'검은색과 흰색이 번갈아 놓인 계단 모양 쌓기나무');
  }

  function partitionBoardBody(board,x0,y0,cell,solution){
    var parts=board.parts||[],partColors=['#dcefe9','#e8edf4','#f3e5c8','#eadff0'];
    var body='';
    board.cells.forEach(function(cellPosition){
      var key=cellPosition.join(','),partIndex=parts.findIndex(function(part){return part.some(function(position){return position.join(',')===key;});});
      body+=rect(x0+cellPosition[0]*cell,y0+cellPosition[1]*cell,cell,cell,solution?partColors[partIndex]:WHITE,'#708b9c',1.2,0);
    });
    board.markers.forEach(function(position){
      var cx=x0+(position[0]+0.5)*cell,cy=y0+(position[1]+0.5)*cell;
      body+='<circle cx="'+cx+'" cy="'+cy+'" r="'+(cell*0.2)+'" fill="#2f7c5c"/><path d="M'+cx+' '+(cy-cell*.2)+'q'+(cell*.12)+' -'+(cell*.18)+' '+(cell*.23)+' -'+(cell*.04)+'" fill="none" stroke="#2f7c5c" stroke-width="2"/>';
    });
    if(solution){
      var byCell={};parts.forEach(function(part,index){part.forEach(function(position){byCell[position.join(',')]=index;});});
      board.cells.forEach(function(position){
        var x=position[0],y=position[1],index=byCell[position.join(',')];
        [[[1,0],[[x+1,y],[x+1,y+1]]],[[0,1],[[x,y+1],[x+1,y+1]]]].forEach(function(edge){var neighbor=[x+edge[0][0],y+edge[0][1]];if(byCell[neighbor.join(',')]!==undefined&&byCell[neighbor.join(',')]!==index){var a=edge[1][0],b=edge[1][1];body+=line(x0+a[0]*cell,y0+a[1]*cell,x0+b[0]*cell,y0+b[1]*cell,'#2456c4',3);}});
      });
    }
    return body;
  }

  function congruentPartitionSvg(spec,solution){
    var count=spec.boards.length,slot=660/count,body='';
    spec.boards.forEach(function(board,index){
      var minX=Math.min.apply(null,board.cells.map(function(cell){return cell[0];})),minY=Math.min.apply(null,board.cells.map(function(cell){return cell[1];})),maxX=Math.max.apply(null,board.cells.map(function(cell){return cell[0];})),maxY=Math.max.apply(null,board.cells.map(function(cell){return cell[1];}));
      var cell=count===2?38:31,width=(maxX-minX+1)*cell,height=(maxY-minY+1)*cell,x=index*slot+(slot-width)/2-minX*cell,y=48+(126-height)/2-minY*cell;
      body+=text(index*slot+slot/2,20,'('+(index+1)+')',15,INK,800)+partitionBoardBody(board,x,y,cell,solution);
    });
    body+=text(330,205,solution?'굵은 선으로 나눈 두 부분은 돌리거나 뒤집으면 겹칩니다.':'각 부분에 나무 그림이 하나씩 들어가도록 선을 그으세요.',14,solution?'#1f625e':'#526c7a',700);
    return svg(body,230,solution?'나무 그림이 하나씩 들어가는 합동 도형 분할 풀이':'나무 그림이 표시된 여러 모눈 도형 나누기');
  }

  function pencilBody(x,y,width){
    return '<g aria-label="연필"><rect x="'+x+'" y="'+y+'" width="'+(width-24)+'" height="26" rx="5" fill="#5aa0be" stroke="#315e78" stroke-width="1.5"/><polygon points="'+(x+width-24)+','+y+' '+(x+width)+','+(y+13)+' '+(x+width-24)+','+(y+26)+'" fill="#f0c68e" stroke="#315e78" stroke-width="1.5"/></g>';
  }

  function eraserBody(x,y,width){
    return '<g aria-label="지우개"><rect x="'+x+'" y="'+y+'" width="'+width+'" height="26" rx="6" fill="#ef9cac" stroke="#925165" stroke-width="1.5"/><rect x="'+(x+width*.28)+'" y="'+(y+1)+'" width="'+(width*.44)+'" height="24" fill="#fff3dc" stroke="#b46b76" stroke-width="1"/></g>';
  }

  function clipBody(x,y,width){
    return '<g aria-label="클립"><path d="M'+(x+width*.22)+' '+(y+5)+'H'+(x+width*.72)+'C'+(x+width*.92)+' '+(y+5)+' '+(x+width*.92)+' '+(y+23)+' '+(x+width*.72)+' '+(y+23)+'H'+(x+width*.2)+'C'+(x+width*.05)+' '+(y+23)+' '+(x+width*.05)+' '+(y+10)+' '+(x+width*.2)+' '+(y+10)+'H'+(x+width*.65)+'" fill="none" stroke="#3f7390" stroke-width="2.2" stroke-linecap="round"/></g>';
  }

  function objectLengthSvg(spec,solution){
    var unit=22,body=text(330,18,'같은 연필·지우개·클립은 각각 길이가 같습니다.',15,INK,700);
    spec.rows.forEach(function(row,index){
      var y=43+index*47,x=70,total=0;
      row.items.forEach(function(item){var width=item==='P'?spec.units.P*unit:item==='E'?spec.units.E*unit:unit;body+=item==='P'?pencilBody(x,y,width):item==='E'?eraserBody(x,y,width):clipBody(x,y,width);x+=width;total+=width;});
      body+=line(64,y-4,64,y+31,'#6d899b',1.5)+line(x+6,y-4,x+6,y+31,'#6d899b',1.5);
      if(solution)body+=text(610,y+13,(total/unit)+'칸',13,'#1f625e',800);
      if(index%2===1&&index<spec.rows.length-1)body+=line(45,y+37,615,y+37,'#d7e1e6',1);
    });
    if(solution)body+=text(330,238,spec.solutionCaption,14,'#1f625e',800);
    return svg(body,258,solution?'연필 지우개 클립의 같은 전체 길이를 단위로 바꾼 풀이':'연필 지우개 클립을 이어 양끝을 맞춘 길이 그림');
  }

  function blockBuildSvg(spec,solution){
    var bAt={};spec.bPieces.forEach(function(piece,index){piece.forEach(function(cube){bAt[cube.join(',')]=index;});});
    var heightMap=Array.from({length:spec.depth},function(){return Array(spec.width).fill(spec.height);});
    var blue=['#77b6d5','#4d91b4','#337897'],yellow=['#f3d668','#d9b94d','#b79a37'];
    var pile=isoPileBody(heightMap,{unit:35,originX:370,originY:171,colorForCube:function(cube){return bAt[[cube.x,cube.y,cube.z].join(',')]===undefined?blue:yellow;}});
    var body=text(112,18,'보기',16,INK,800)+isoPileBody([[1]],{unit:32,originX:74,originY:80,colorForCube:function(){return blue;}}).body+text(74,125,'A 블록',14,INK,700);
    body+=isoPileBody([[1,1]],{unit:32,originX:142,originY:80,colorForCube:function(){return yellow;}}).body+text(164,125,'B 블록',14,INK,700)+line(218,22,218,226,'#d8e3e6',1.2)+text(428,18,'만든 모양',16,INK,800)+pile.body;
    if(solution)body+=rect(255,222,330,35,'#edf7f2','#75a99f',1.2,17)+text(420,240,'A 블록 '+spec.answer.A+'개 · B 블록 '+spec.answer.B+'개',15,'#1f625e',800);
    return svg(body,270,solution?'A 한 칸 블록과 B 두 칸 블록의 개수를 센 풀이':'A 한 칸 블록과 B 두 칸 블록으로 만든 직육면체');
  }

  function shortestPathCount(spec){
    var blocked=new Set(spec.blocked.map(function(point){return point.join(',');})),ways=Array.from({length:spec.rows+1},function(){return Array(spec.cols+1).fill(0);});ways[spec.rows][0]=1;
    for(var y=spec.rows;y>=0;y--)for(var x=0;x<=spec.cols;x++){
      if(x===0&&y===spec.rows||blocked.has(x+','+y))continue;
      ways[y][x]=(x?ways[y][x-1]:0)+(y<spec.rows?ways[y+1][x]:0);
    }
    return {answer:ways[0][spec.cols],ways:ways};
  }

  function shortestPathSvg(spec,solution){
    var left=110,top=35,dx=440/spec.cols,dy=185/spec.rows,result=shortestPathCount(spec),blocked=new Set(spec.blocked.map(function(point){return point.join(',');})),body='';
    for(var y=0;y<=spec.rows;y++)for(var x=0;x<spec.cols;x++)body+=line(left+x*dx,top+y*dy,left+(x+1)*dx,top+y*dy,'#8195a2',2.2);
    for(var x=0;x<=spec.cols;x++)for(var y=0;y<spec.rows;y++)body+=line(left+x*dx,top+y*dy,left+x*dx,top+(y+1)*dy,'#8195a2',2.2);
    for(var yy=0;yy<=spec.rows;yy++)for(var xx=0;xx<=spec.cols;xx++){
      var key=xx+','+yy,cx=left+xx*dx,cy=top+yy*dy;
      if(blocked.has(key))body+='<rect x="'+(cx-9)+'" y="'+(cy-9)+'" width="18" height="18" rx="3" fill="#263641"/>';
      else body+='<circle cx="'+cx+'" cy="'+cy+'" r="4" fill="#ffffff" stroke="#4f7488" stroke-width="1.5"/>';
      if(solution&&!blocked.has(key))body+=text(cx,cy-15,result.ways[yy][xx],11,'#1f625e',800);
    }
    body+=text(left,top+spec.rows*dy+24,'출발',14,INK,800)+text(left+spec.cols*dx,top-20,'도착',14,INK,800);
    return svg(body,260,solution?'오른쪽과 위쪽으로 가는 최단 경로의 지점별 가지 수 풀이':'지나갈 수 없는 검은 지점이 있는 최단거리 격자 길');
  }

  function balanceItem(kind,x,y,count,color){
    var body='',gap=22,start=x-(count-1)*gap/2;
    for(var index=0;index<count;index++){
      var cx=start+index*gap;
      if(kind==='heart')body+='<path d="M'+cx+' '+(y+7)+'C'+(cx-15)+' '+(y-4)+' '+(cx-17)+' '+(y-19)+' '+cx+' '+(y-12)+'C'+(cx+17)+' '+(y-19)+' '+(cx+15)+' '+(y-4)+' '+cx+' '+(y+7)+'Z" fill="'+color+'" stroke="#6b7783" stroke-width="1"/>';
      else if(kind==='square')body+=rect(cx-8,y-14,16,16,color,'#6b7783',1,2);
      else body+='<circle cx="'+cx+'" cy="'+(y-7)+'" r="10" fill="'+color+'" stroke="#6b7783" stroke-width="1"/>';
    }
    return body;
  }

  function balanceItems(items,x,y){
    var gap=22,total=items.reduce(function(sum,item){return sum+item.count;},0),offset=0;
    return items.map(function(item){
      var center=x-(total-1)*gap/2+(offset+(item.count-1)/2)*gap;
      offset+=item.count;
      return '<g class="balance-item-group" data-balance-key="'+esc(item.key)+'" data-balance-count="'+item.count+'">'+balanceItem(item.kind,center,y,item.count,item.color)+'</g>';
    }).join('');
  }

  function balanceScaleBody(equation,x,y,solution){
    var body=line(x-90,y+7,x+90,y+7,'#6d7f8b',2)+polygon([[x,y+7],[x-10,y+31],[x+10,y+31]],'#e8edf0','#6d7f8b',1.2);
    body+=line(x-73,y+7,x-73,y-7,'#6d7f8b',1.3)+line(x+73,y+7,x+73,y-7,'#6d7f8b',1.3);
    body+=balanceItems(equation.left,x-73,y-14);
    if(equation.query&&!solution)body+=text(x+73,y-19,'?',24,INK,900);else body+=balanceItems(equation.right,x+73,y-14);
    if(equation.query&&solution)body+=text(x+73,y-39,equation.answer+'개',14,'#1f625e',900);
    return body;
  }

  function balanceSubstitutionSvg(spec,solution){
    var positions=spec.equations.length===3?[[175,82],[485,82],[330,190]]:[[170,70],[490,70],[170,180],[490,180]],body='';
    spec.equations.forEach(function(equation,index){body+=balanceScaleBody(equation,positions[index][0],positions[index][1],solution);body+=text(positions[index][0],positions[index][1]+47,'그림 '+(index+1),12,'#526c7a',700);});
    return svg(body,260,solution?'앞 저울의 같은 무게를 차례로 바꾸어 마지막 저울을 완성한 풀이':'여러 저울의 평형 관계를 이어 마지막 접시의 개수를 찾는 그림');
  }

  function vectorKey(vector){return vector.join(',');}
  function vectorNeg(vector){return vector.map(function(value){return -value;});}
  function foldNet(cells){
    var at={};cells.forEach(function(cell,index){at[cell[0]+','+cell[1]]=index;});
    var frames=Array(cells.length),queue=[0];
    frames[0]={n:[0,0,1],u:[0,-1,0],r:[1,0,0]};
    while(queue.length){
      var index=queue.shift(),cell=cells[index],frame=frames[index];
      [[1,0,'E'],[-1,0,'W'],[0,1,'S'],[0,-1,'N']].forEach(function(step){
        var nextIndex=at[(cell[0]+step[0])+','+(cell[1]+step[1])];
        if(nextIndex===undefined)return;
        var next;
        if(step[2]==='E')next={n:frame.r,u:frame.u,r:vectorNeg(frame.n)};
        else if(step[2]==='W')next={n:vectorNeg(frame.r),u:frame.u,r:frame.n};
        else if(step[2]==='S')next={n:vectorNeg(frame.u),u:frame.n,r:frame.r};
        else next={n:frame.u,u:vectorNeg(frame.n),r:frame.r};
        if(!frames[nextIndex]){frames[nextIndex]=next;queue.push(nextIndex);}
        else if(vectorKey(frames[nextIndex].n)!==vectorKey(next.n)||vectorKey(frames[nextIndex].u)!==vectorKey(next.u)||vectorKey(frames[nextIndex].r)!==vectorKey(next.r))frames[nextIndex].invalid=true;
      });
    }
    if(frames.some(function(frame){return !frame||frame.invalid;}))return null;
    var normalKeys=frames.map(function(frame){return vectorKey(frame.n);});
    if(new Set(normalKeys).size!==6)return null;
    return frames.map(function(frame){return normalKeys.indexOf(vectorKey(vectorNeg(frame.n)));});
  }

  function normalizedNetSignature(cells){
    var variants=[];
    for(var swap=0;swap<2;swap++)for(var sx of [-1,1])for(var sy of [-1,1]){
      var transformed=cells.map(function(cell){var x=swap?cell[1]:cell[0],y=swap?cell[0]:cell[1];return [x*sx,y*sy];});
      var minX=Math.min.apply(null,transformed.map(function(cell){return cell[0];}));
      var minY=Math.min.apply(null,transformed.map(function(cell){return cell[1];}));
      variants.push(transformed.map(function(cell){return [cell[0]-minX,cell[1]-minY];}).sort(function(left,right){return left[1]-right[1]||left[0]-right[0];}).map(function(cell){return cell.join(',');}).join(';'));
    }
    return variants.sort()[0];
  }

  function netCellArt(spec,subproblem,x0,y0,cellSize,solution){
    var queryLabels=['㉠','㉡','㉢'],colors={'빨간색':'#dc938d','노란색':'#ead37b','파란색':'#82b8cf'};
    var minX=Math.min.apply(null,subproblem.cells.map(function(cell){return cell[0];}));
    var minY=Math.min.apply(null,subproblem.cells.map(function(cell){return cell[1];}));
    var body='';
    subproblem.cells.forEach(function(cell,index){
      var x=x0+(cell[0]-minX)*cellSize,y=y0+(cell[1]-minY)*cellSize;
      var queryIndex=subproblem.query.indexOf(index),given=subproblem.given.indexOf(index)>=0,showValue=given||solution&&queryIndex>=0,value=subproblem.values[index];
      var fill=spec.kind==='net-colors-pair'&&showValue?colors[value]:WHITE;
      body+=rect(x,y,cellSize,cellSize,fill,'#64899d',1.5,1);
      if(queryIndex>=0&&!solution)body+=text(x+cellSize/2,y+cellSize/2,queryLabels[queryIndex],19,INK,800);
      else if(showValue&&spec.kind==='net-colors-pair')body+=text(x+cellSize/2,y+cellSize/2,String(value).replace('색',''),12,INK,800);
      else if(showValue&&spec.kind==='net-pips-pair'){
        pipPattern(value).forEach(function(position){body+='<circle cx="'+(x+position[0]*cellSize)+'" cy="'+(y+position[1]*cellSize)+'" r="3.3" fill="'+INK+'"/>';});
      }
    });
    return body;
  }

  function pairedNetSvg(spec,solution){
    var cellSize=42,body='';
    spec.subproblems.forEach(function(subproblem,index){
      var minX=Math.min.apply(null,subproblem.cells.map(function(cell){return cell[0];})),maxX=Math.max.apply(null,subproblem.cells.map(function(cell){return cell[0];}));
      var minY=Math.min.apply(null,subproblem.cells.map(function(cell){return cell[1];})),maxY=Math.max.apply(null,subproblem.cells.map(function(cell){return cell[1];}));
      var width=(maxX-minX+1)*cellSize,height=(maxY-minY+1)*cellSize,center=index===0?170:490;
      body+=text(center,20,'('+(index+1)+')',16,INK,800);
      body+=netCellArt(spec,subproblem,center-width/2,42+(168-height)/2,cellSize,solution);
      if(solution)body+=text(center,232,subproblem.answer.join(', '),14,'#1f625e',800);
    });
    body+=line(330,18,330,238,'#d8e3e6',1.2);
    return svg(body,250,solution?'서로 다른 두 정육면체 전개도의 빈 면을 채운 풀이':'서로 다른 두 정육면체 전개도가 나란히 놓인 문제');
  }

  var START_ORIENTATION={top:1,bottom:6,north:2,south:5,east:3,west:4};
  var DIRECTION={N:{arrow:'↑',word:'위쪽'},E:{arrow:'→',word:'오른쪽'},S:{arrow:'↓',word:'아래쪽'},W:{arrow:'←',word:'왼쪽'}};

  function roll(orientation,direction){
    var o=orientation;
    if(direction==='N')return {top:o.south,bottom:o.north,north:o.top,south:o.bottom,east:o.east,west:o.west};
    if(direction==='S')return {top:o.north,bottom:o.south,north:o.bottom,south:o.top,east:o.east,west:o.west};
    if(direction==='E')return {top:o.west,bottom:o.east,north:o.north,south:o.south,east:o.top,west:o.bottom};
    if(direction==='W')return {top:o.east,bottom:o.west,north:o.north,south:o.south,east:o.bottom,west:o.top};
    throw new Error('Unknown die direction: '+direction);
  }

  function rollMany(orientation,directions){
    return directions.reduce(function(current,direction){return roll(current,direction);},clone(orientation));
  }

  function visibleFaces(orientation,view){
    if(view==='rear-left')return [orientation.top,orientation.west,orientation.north];
    if(view==='rear-right')return [orientation.top,orientation.north,orientation.east];
    if(view==='front-left')return [orientation.top,orientation.south,orientation.west];
    return [orientation.top,orientation.south,orientation.east];
  }

  function viewFaceLabel(view){
    if(view==='rear-left')return '위·뒤·왼쪽';
    if(view==='rear-right')return '위·뒤·오른쪽';
    if(view==='front-left')return '위·앞·왼쪽';
    return '위·앞·오른쪽';
  }

  function faceTrace(start,route,view){
    var current=clone(start);
    var parts=['시작 '+visibleFaces(current,view).join('·')];
    route.forEach(function(direction,index){
      current=roll(current,direction);
      parts.push((index+1)+'칸('+DIRECTION[direction].arrow+') '+visibleFaces(current,view).join('·'));
    });
    return parts.join(' → ');
  }

  function pipPattern(value){
    var points={
      1:[[0.5,0.5]],2:[[0.28,0.28],[0.72,0.72]],3:[[0.28,0.28],[0.5,0.5],[0.72,0.72]],
      4:[[0.28,0.28],[0.72,0.28],[0.28,0.72],[0.72,0.72]],
      5:[[0.28,0.28],[0.72,0.28],[0.5,0.5],[0.28,0.72],[0.72,0.72]],
      6:[[0.28,0.24],[0.72,0.24],[0.28,0.5],[0.72,0.5],[0.28,0.76],[0.72,0.76]]
    };
    return points[value]||[];
  }

  function quadPoint(points,u,v){
    var topX=points[0][0]*(1-u)+points[1][0]*u,topY=points[0][1]*(1-u)+points[1][1]*u;
    var bottomX=points[3][0]*(1-u)+points[2][0]*u,bottomY=points[3][1]*(1-u)+points[2][1]*u;
    return [topX*(1-v)+bottomX*v,topY*(1-v)+bottomY*v];
  }

  function dieBody(orientation,cx,cy,scale,view,hiddenFace,revealHidden,blank){
    var top=[[0,-34],[42,-13],[0,8],[-42,-13]];
    var left=[[-42,-13],[0,8],[0,58],[-42,37]];
    var right=[[0,8],[42,-13],[42,37],[0,58]];
    var values=visibleFaces(orientation,view);
    var faces=[top,left,right],faceKeys=['top','front','right'],fills=['#f7fbfc','#e4eef1','#cfdee3'];
    var content=faces.map(function(points,index){
      var hidden=faceKeys[index]===hiddenFace&&!revealHidden;
      var fill=blank?'#ffffff':hidden?'#fff1b8':faceKeys[index]===hiddenFace?'#edf7f2':fills[index];
      var art=polygon(points,fill,hidden?'#a9700d':'#315c73',1.7);
      if(hidden){
        var center=quadPoint(points,0.5,0.5);
        art+=text(center[0],center[1]+1,'㉠',17,'#8b5b04',900);
      }else if(!blank)art+=pipPattern(values[index]).map(function(position){
        var p=quadPoint(points,position[0],position[1]);
        return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3.8" fill="#214d67"/>';
      }).join('');
      return art;
    }).join('');
    return '<g'+(blank?' data-finish-die="blank"':'')+(hiddenFace?' data-hidden-face="'+hiddenFace+'"':'')+' transform="translate('+cx+' '+cy+') scale('+(scale||1)+')">'+content+'</g>';
  }

  var ROUTE_MARKER_SERIAL=0;

  function routePath(start,directions){
    var path=[start.slice()];
    directions.forEach(function(direction){
      var previous=path[path.length-1];
      path.push([
        previous[0]+(direction==='S'?1:direction==='N'?-1:0),
        previous[1]+(direction==='E'?1:direction==='W'?-1:0)
      ]);
    });
    return path;
  }

  function boardPoint(row,column,options){
    return [
      options.centerX+(column-row)*options.cellX,
      options.topY+(column+row)*options.cellY
    ];
  }

  function boardCellCenter(row,column,options){
    return boardPoint(row+0.5,column+0.5,options);
  }

  function diceBoardBody(board,options){
    var rows=board.rows||4,columns=board.cols||4,path=routePath(board.start,board.route);
    var targetSteps=options.targetSteps||[],targetByCell={};
    targetSteps.forEach(function(step){targetByCell[path[step+1].join(',')]=step;});
    var markerId='concept-dice-route-'+(++ROUTE_MARKER_SERIAL);
    var body='<g data-dice-board="4x4" data-viewpoint="southeast-diagonal" data-start="'+board.start.join(',')+'" data-route="'+board.route.join('')+'">';
    body+='<defs><marker id="'+markerId+'" viewBox="0 0 10 10" refX="8.6" refY="5" markerWidth="2.7" markerHeight="2.7" orient="auto"><path d="M0 1L9 5L0 9z" fill="#327594"/></marker></defs>';
    for(var row=0;row<rows;row++)for(var column=0;column<columns;column++){
      var key=row+','+column,isTarget=Object.prototype.hasOwnProperty.call(targetByCell,key);
      var points=[boardPoint(row,column,options),boardPoint(row,column+1,options),boardPoint(row+1,column+1,options),boardPoint(row+1,column,options)];
      body+='<polygon class="dice-board-cell'+(isTarget?' target':'')+'" points="'+points.map(function(point){return point.join(',');}).join(' ')+'" fill="'+(isTarget?'#fff0a6':'#ffffff')+'" stroke="'+(isTarget?'#b98213':'#78909a')+'" stroke-width="'+(isTarget?'2':'1.25')+'" stroke-linejoin="round"/>';
    }
    path.slice(1).forEach(function(cell,index){
      var previous=path[index],from=boardCellCenter(previous[0],previous[1],options),to=boardCellCenter(cell[0],cell[1],options);
      var dx=to[0]-from[0],dy=to[1]-from[1];
      body+='<line data-direction="'+board.route[index]+'" data-roll-arrow="true" x1="'+(from[0]+dx*0.08)+'" y1="'+(from[1]+dy*0.08)+'" x2="'+(to[0]-dx*0.08)+'" y2="'+(to[1]-dy*0.08)+'" stroke="#327594" stroke-width="2.25" stroke-linecap="round" marker-end="url(#'+markerId+')"/>';
    });
    var startCenter=boardCellCenter(board.start[0],board.start[1],options),dieScale=options.dieScale||0.55;
    body+='<g data-die-on-start="true">'+dieBody(board.startOrientation,startCenter[0],startCenter[1]-44*dieScale,dieScale,'front-right',options.hiddenFace,options.revealHidden,false)+'</g>';
    targetSteps.forEach(function(step){
      var cell=path[step+1],center=boardCellCenter(cell[0],cell[1],options),label=options.revealTargets?String(rollMany(board.startOrientation,board.route.slice(0,step+1)).bottom):options.targetLabel||'';
      if(label)body+='<circle cx="'+center[0]+'" cy="'+center[1]+'" r="12" fill="#ffffff" stroke="#327594" stroke-width="1.4"/>'+text(center[0],center[1]+1,label,13,'#204d65',900);
    });
    var bottomY=options.topY+(rows+columns)*options.cellY;
    body+='<path d="M'+(options.centerX-10)+' '+(bottomY+11)+'L'+options.centerX+' '+(bottomY+15)+'L'+(options.centerX+10)+' '+(bottomY+11)+'" fill="none" stroke="#245866" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>';
    return body+'</g>';
  }

  function bottomTrace(board){
    var current=clone(board.startOrientation);
    return board.route.map(function(direction){current=roll(current,direction);return current.bottom;});
  }

  function targetBottomSvg(spec,solution){
    var options={centerX:330,topY:48,cellX:42,cellY:24.25,dieScale:0.58,targetSteps:[spec.board.route.length-1],targetLabel:'㉠',revealTargets:solution};
    var body=text(330,18,'화살표를 따라 ㉠까지 굴리기',15,INK,700)+diceBoardBody(spec.board,options);
    body+=rect(245,270,170,30,solution?'#edf7f2':WHITE,solution?'#23756f':'#7da0b2',1.5,15)+text(330,285,'㉠의 밑면 '+(solution?spec.answer:'?'),14,solution?'#1f625e':INK,800);
    return svg(body,308,solution?'4×4 등각 격자에서 화살표를 따라 굴린 주사위의 마지막 밑면 풀이':'4×4 등각 격자의 시작 칸 위 입체 주사위와 ㉠까지 이어진 방향 화살표');
  }

  function finishVisibleSvg(spec,solution){
    var finish=rollMany(spec.board.startOrientation,spec.board.route);
    var options={centerX:205,topY:50,cellX:34,cellY:19.63,dieScale:0.49,targetSteps:[]};
    var body=text(205,18,'화살표를 따라 굴리기',14,INK,700)+text(520,18,'도착한 주사위',14,INK,700);
    body+=diceBoardBody(spec.board,options)+line(390,26,390,258,'#d8e3e6',1.2);
    body+=solution?dieBody(finish,520,94,0.72,'front-right'):dieBody(finish,520,94,0.72,'front-right',null,false,true);
    [['top','윗면',finish.top],['front','앞면',finish.south],['right','오른쪽 면',finish.east]].forEach(function(item,index){
      var x=438+index*82;
      body+='<g data-response-slot="'+item[0]+'">'+text(x,184,item[1],11,'#526c7a',700)+rect(x-31,198,62,27,solution?'#edf7f2':WHITE,solution?'#23756f':'#7da0b2',1.3,4)+text(x,212,solution?item[2]:'',14,solution?'#1f625e':INK,800)+'</g>';
    });
    return svg(body,274,solution?'4×4 등각 격자에서 굴린 뒤 도착 주사위의 윗면 앞면 오른쪽 면을 채운 풀이':'4×4 등각 격자의 시작 칸 위 입체 주사위와 빈 도착 주사위');
  }

  function pairedBottomSvg(spec,solution){
    var leftOptions={centerX:170,topY:48,cellX:27,cellY:15.59,dieScale:0.42,targetSteps:[spec.boards[0].route.length-1],revealTargets:solution};
    var rightOptions={centerX:490,topY:48,cellX:27,cellY:15.59,dieScale:0.42,targetSteps:[spec.boards[1].route.length-1],hiddenFace:spec.unknownFace,revealHidden:solution,revealTargets:solution};
    var body=text(170,18,'(1) 첫째 주사위',14,INK,800)+text(490,18,'(2) 둘째 주사위',14,INK,800);
    body+=diceBoardBody(spec.boards[0],leftOptions)+line(330,28,330,208,'#d8e3e6',1.2)+diceBoardBody(spec.boards[1],rightOptions);
    body+=rect(195,222,270,31,solution?'#edf7f2':WHITE,solution?'#23756f':'#7da0b2',1.4,15);
    body+=text(330,238,solution?'같은 마지막 밑면 '+spec.contactValue+' · ㉠ = '+spec.answer:'색칠한 두 도착 칸에는 같은 눈이 닿습니다.',13,solution?'#1f625e':'#526c7a',800);
    return svg(body,264,solution?'두 개의 4×4 등각 격자에서 같은 마지막 밑면과 숨은 눈을 확인한 풀이':'두 개의 4×4 등각 격자 시작 칸 위 주사위와 같은 색 도착 칸, 둘째 주사위의 숨은 면');
  }

  function childIcon(x,y){
    var body='<circle cx="'+x+'" cy="'+(y-36)+'" r="13" fill="#f7d6bd" stroke="'+INK+'" stroke-width="1.6"/>';
    body+='<path d="M'+(x-14)+' '+(y-40)+'q14-20 28 0M'+(x-12)+' '+(y-45)+'l-9 -7M'+(x+12)+' '+(y-45)+'l9 -7" fill="none" stroke="'+INK+'" stroke-width="2.2" stroke-linecap="round"/>';
    body+='<path d="M'+x+' '+(y-23)+'v35M'+x+' '+(y-8)+'l-18 15M'+x+' '+(y-8)+'l18 15M'+x+' '+(y+12)+'l-14 22M'+x+' '+(y+12)+'l15 22" fill="none" stroke="'+INK+'" stroke-width="2.2" stroke-linecap="round"/>';
    return body;
  }

  function houseIcon(x,y){
    var body='<path d="M'+(x-35)+' '+(y-4)+'L'+x+' '+(y-39)+'l35 35v43h-70z" fill="#f7dfbc" stroke="'+INK+'" stroke-width="1.8" stroke-linejoin="round"/>';
    body+='<path d="M'+(x-42)+' '+(y-2)+'L'+x+' '+(y-46)+'l42 44" fill="none" stroke="#cc765f" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>';
    body+=rect(x-12,y+9,24,30,'#d8eef0',INK,1.4,5)+text(x,y+54,'도착',13,INK,700);
    return body;
  }

  function simplePathSvg(spec,solution){
    var byId={};spec.vertices.forEach(function(vertex){byId[vertex.id]=vertex;});
    var body=childIcon(38,139)+text(39,194,'출발',13,INK,700)+houseIcon(621,126);
    spec.edges.forEach(function(edge){
      var from=byId[edge[0]],to=byId[edge[1]];
      body+=line(from.x,from.y,to.x,to.y,'#879694',8);
    });
    spec.vertices.forEach(function(vertex){
      body+='<circle cx="'+vertex.x+'" cy="'+vertex.y+'" r="'+(vertex.id===spec.start||vertex.id===spec.end?6:5)+'" fill="'+(vertex.id===spec.start||vertex.id===spec.end?INK:'#ffffff')+'" stroke="'+INK+'" stroke-width="2"/>';
      if(solution)body+=text(vertex.x,vertex.y-17,vertex.id,12,'#526c7a',700);
    });
    if(solution){
      body+=rect(170,239,320,35,'#edf7f2','#75a99f',1.2,17);
      body+=text(330,257,'위쪽 시작 '+spec.branchCounts[0]+'가지 + 아래쪽 시작 '+spec.branchCounts[1]+'가지 = '+spec.answer+'가지',14,'#1f625e',800);
    }else{
      body+=text(330,255,'갈림점에서는 연결된 어느 길로든 갈 수 있습니다.',14,'#526c7a',600);
    }
    return svg(body,284,solution?'첫 갈림을 위쪽과 아래쪽으로 나누어 단순 경로 수를 센 풀이 그림':'아이에서 과자 집까지 여러 갈림점으로 이어진 길 그림');
  }

  function rodProblemSvg(rods){
    var unit=26;
    var left=152;
    var labels=['가','나','다','라'];
    var body=text(330,20,'막대의 실제 길이를 비교해 보세요.',17,INK,700);
    rods.forEach(function(length,index){
      var y=44+index*48;
      var width=length*unit;
      body+=text(91,y+11,labels[index]+' 막대',16,INK,600);
      body+=rect(left,y,width,22,ROD_COLORS[index],INK,1.4,5);
      for(var tick=1;tick<length;tick++){
        body+=line(left+tick*unit,y,left+tick*unit,y+22,'#ffffff',1);
      }
      body+=text(left+width+43,y+11,length+' cm',16,INK,700);
    });
    return svg(body,58+rods.length*48,'자를 수 없는 여러 막대와 각 막대의 실제 길이');
  }

  function rodSumsSolutionSvg(values){
    var columns=7;
    var chipWidth=76;
    var chipHeight=32;
    var xGap=86;
    var body=text(330,21,'겹치는 합을 한 번만 남긴 전체 길이',17,INK,700);
    values.forEach(function(value,index){
      var column=index%columns;
      var row=Math.floor(index/columns);
      var x=42+column*xGap;
      var y=45+row*47;
      body+=rect(x,y,chipWidth,chipHeight,PALE,BLUE,1.3,16);
      body+=text(x+chipWidth/2,y+chipHeight/2,value+' cm',15,INK,700);
    });
    return svg(body,values.length>columns?140:94,'서로 다른 막대 조합으로 만들 수 있는 전체 길이 목록');
  }

  function levelCells(cells,z){return cells.map(function(cell){return [cell[0],cell[1],z];});}

  var CHECKER_STACK_SPECS=[
    {id:'checker-stack-count-basic',lessonRole:'basic',difficulty:'easy',heightMap:[[2,2,1,0],[2,1,1,0],[1,1,0,0]],offset:1,evidence:{metric:'visible-columns-plus-height',value:10}},
    {id:'checker-stack-count-guided',lessonRole:'guided',difficulty:'same',heightMap:[[3,2,2,1],[2,2,1,1],[1,1,1,0]],offset:0,evidence:{metric:'visible-columns-plus-height',value:14}},
    {id:'checker-stack-count-review',lessonRole:'review',difficulty:'same',heightMap:[[3,3,2,1],[2,2,1,1],[1,1,1,0]],offset:1,evidence:{metric:'visible-columns-plus-height',value:14}}
  ];

  var PARTITION_RING={cells:[[0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2]],markers:[[1,0],[1,2]],parts:[[[0,0],[1,0],[2,0],[2,1]],[[0,1],[0,2],[1,2],[2,2]]]};
  var PARTITION_RECT={cells:[[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1]],markers:[[0,0],[3,1]],parts:[[[0,0],[1,0],[0,1],[1,1]],[[2,0],[3,0],[2,1],[3,1]]]};
  var PARTITION_ZIG={cells:[[0,0],[1,0],[2,0],[3,0],[1,1],[2,1],[3,1],[4,1]],markers:[[0,0],[4,1]],parts:[[[0,0],[1,0],[2,0],[3,0]],[[1,1],[2,1],[3,1],[4,1]]]};
  var PARTITION_VERTICAL={cells:[[0,0],[1,0],[0,1],[1,1],[0,2],[1,2],[0,3],[1,3]],markers:[[0,0],[1,3]],parts:[[[0,0],[1,0],[0,1],[1,1]],[[0,2],[1,2],[0,3],[1,3]]]};
  var CONGRUENT_PARTITION_SPECS=[
    {id:'congruent-marked-partition-basic',lessonRole:'basic',difficulty:'easy',boards:[PARTITION_RECT,PARTITION_RING],evidence:{metric:'boards-to-partition',value:2}},
    {id:'congruent-marked-partition-guided',lessonRole:'guided',difficulty:'same',boards:[PARTITION_RING,PARTITION_ZIG,PARTITION_VERTICAL],evidence:{metric:'boards-to-partition',value:3}},
    {id:'congruent-marked-partition-review',lessonRole:'review',difficulty:'same',boards:[PARTITION_VERTICAL,PARTITION_RECT,PARTITION_ZIG],evidence:{metric:'boards-to-partition',value:3}}
  ];

  var OBJECT_LENGTH_SPECS=[
    {id:'object-length-equivalence-basic',lessonRole:'basic',difficulty:'easy',units:{P:7,E:3,C:1},rows:[{items:['P','C']},{items:['E','E','C','C']}],answer:1,query:'pencil-minus-two-erasers',solutionCaption:'연필 7칸 − 지우개 2개 6칸 = 클립 1개',evidence:{metric:'equal-length-relations',value:1}},
    {id:'object-length-equivalence-guided',lessonRole:'guided',difficulty:'same',units:{P:8,E:3,C:1},rows:[{items:['P','C','C']},{items:['E','E','C','C','C','C']},{items:['E']},{items:['C','C','C']}],answer:8,query:'pencil-in-clips',solutionCaption:'지우개 1개는 클립 3개, 연필 1개는 클립 8개',evidence:{metric:'equal-length-relations',value:2}},
    {id:'object-length-equivalence-review',lessonRole:'review',difficulty:'same',units:{P:9,E:4,C:1},rows:[{items:['P','C']},{items:['E','E','C','C']},{items:['E','C']},{items:['C','C','C','C','C']}],answer:9,query:'pencil-in-clips',solutionCaption:'지우개 1개는 클립 4개, 연필 1개는 클립 9개',evidence:{metric:'equal-length-relations',value:2}}
  ];

  var BLOCK_BUILD_SPECS=[
    {id:'block-build-count-basic',lessonRole:'basic',difficulty:'easy',width:4,depth:2,height:2,bPieces:[[[0,0,1],[1,0,1]],[[2,0,1],[3,0,1]],[[0,1,1],[1,1,1]],[[2,1,1],[3,1,1]]],evidence:{metric:'blocks-to-separate',value:12}},
    {id:'block-build-count-guided',lessonRole:'guided',difficulty:'same',width:4,depth:2,height:2,bPieces:[[[0,0,1],[1,0,1]],[[2,0,1],[3,0,1]],[[0,1,0],[1,1,0]]],evidence:{metric:'blocks-to-separate',value:13}},
    {id:'block-build-count-review',lessonRole:'review',difficulty:'same',width:4,depth:2,height:2,bPieces:[[[0,1,1],[1,1,1]],[[2,1,1],[3,1,1]],[[2,1,0],[3,1,0]]],evidence:{metric:'blocks-to-separate',value:13}}
  ];

  var SHORTEST_PATH_SPECS=[
    {id:'shortest-path-grid-basic',lessonRole:'basic',difficulty:'easy',cols:4,rows:3,blocked:[[0,0],[2,1]],evidence:{metric:'grid-steps-plus-blocks',value:9}},
    {id:'shortest-path-grid-guided',lessonRole:'guided',difficulty:'same',cols:5,rows:4,blocked:[[1,3],[3,1],[0,0]],evidence:{metric:'grid-steps-plus-blocks',value:12}},
    {id:'shortest-path-grid-review',lessonRole:'review',difficulty:'same',cols:5,rows:4,blocked:[[2,3],[3,2],[1,0]],evidence:{metric:'grid-steps-plus-blocks',value:12}}
  ];

  function balanceToken(key,kind,color,count){return {key:key,kind:kind,color:color,count:count};}
  var Y=function(n){return balanceToken('Y','circle','#f2c94c',n);},G=function(n){return balanceToken('G','circle','#75aa63',n);},P=function(n){return balanceToken('P','circle','#846aa9',n);};
  var C=function(n){return balanceToken('C','circle','#ded3aa',n);},S=function(n){return balanceToken('S','square','#d4b16b',n);},H=function(n){return balanceToken('H','heart','#e3c989',n);},T=function(n){return balanceToken('T','circle','#8b78b5',n);};
  var BALANCE_LABELS={Y:'노란 동그라미',G:'초록 동그라미',P:'보라 동그라미',C:'연한 동그라미',S:'네모',H:'하트',T:'보라 동그라미'};
  var BALANCE_SUBSTITUTION_SPECS=[
    {id:'balance-substitution-pictures-basic',lessonRole:'basic',difficulty:'easy',values:{Y:1,G:2,P:3},answer:5,equations:[{left:[Y(2)],right:[G(1)]},{left:[Y(1),G(1)],right:[P(1)]},{left:[G(1),P(1)],right:[Y(5)],query:true,answer:5}],evidence:{metric:'substitution-links',value:2}},
    {id:'balance-substitution-pictures-guided',lessonRole:'guided',difficulty:'same',values:{C:4,S:2,H:1,T:3},answer:7,equations:[{left:[C(2)],right:[S(4)]},{left:[S(1)],right:[H(2)]},{left:[H(3)],right:[T(1)]},{left:[C(1),T(1)],right:[H(7)],query:true,answer:7}],evidence:{metric:'substitution-links',value:3}},
    {id:'balance-substitution-pictures-review',lessonRole:'review',difficulty:'same',values:{C:6,S:2,H:1,T:4},answer:4,equations:[{left:[C(1)],right:[S(3)]},{left:[S(1)],right:[H(2)]},{left:[S(2)],right:[T(1)]},{left:[T(1)],right:[H(4)],query:true,answer:4}],evidence:{metric:'substitution-links',value:3}}
  ];

  function balanceSubstitutionSolution(spec){
    var ordered=Object.entries(spec.values).sort(function(left,right){return left[1]-right[1];});
    var lightest=ordered[0],query=spec.equations.find(function(equation){return equation.query;});
    var assignments=ordered.slice(1).map(function(entry){return BALANCE_LABELS[entry[0]]+'에 쓰는 수는 '+entry[1]+'입니다.';});
    var converted=query.left.map(function(item){return BALANCE_LABELS[item.key]+' '+item.count+'개의 값은 '+(spec.values[item.key]*item.count);});
    return '가장 가벼운 도형인 '+BALANCE_LABELS[lightest[0]]+'에 1을 써 봅시다. '+assignments.join(' ')+' 마지막 왼쪽 접시의 '+converted.join(', ')+'이므로 오른쪽 접시에 '+BALANCE_LABELS[query.right[0].key]+' '+spec.answer+'개를 놓습니다.';
  }

  var STACK_FILL_SPECS=[
    {
      id:'stack-box-fill-basic',
      lessonRole:'basic',
      difficulty:'easy',
      heightMap:[[2,2,1],[2,1,0],[2,0,0]],
      boxH:2,
      answer:8,
      answerHtml:'8개',
      prompt:'가로 3칸, 세로 3칸, 높이 2칸인 점선 상자 안에 쌓기나무를 쌓았습니다. 상자를 빈틈없이 가득 채우려면 쌓기나무가 몇 개 더 필요할까요?',
      solution:'상자를 가득 채우면 3×3×2=18개입니다. 지금 쌓인 10개를 빼면 18−10=8개가 더 필요합니다.',
      evidence:{metric:'box-height-plus-visible-columns',value:8}
    },
    {
      id:'stack-box-fill-guided',
      lessonRole:'guided',
      difficulty:'same',
      heightMap:[[3,2,2],[3,2,0],[3,0,0]],
      boxH:3,
      answer:12,
      answerHtml:'12개',
      prompt:'가로 3칸, 세로 3칸, 높이 3칸인 점선 상자 안에 쌓기나무를 쌓았습니다. 상자를 빈틈없이 가득 채우려면 쌓기나무가 몇 개 더 필요할까요?',
      solution:'상자를 가득 채우면 3×3×3=27개입니다. 지금 쌓인 15개를 빼면 27−15=12개가 더 필요합니다.',
      evidence:{metric:'box-height-plus-visible-columns',value:9}
    },
    {
      id:'stack-box-fill-review',
      lessonRole:'review',
      difficulty:'same',
      heightMap:[[3,2,2],[3,1,0],[3,0,0]],
      boxH:3,
      answer:13,
      answerHtml:'13개',
      prompt:'가로 3칸, 세로 3칸, 높이 3칸인 점선 상자 안에 쌓기나무를 쌓았습니다. 상자를 빈틈없이 가득 채우려면 쌓기나무가 몇 개 더 필요할까요?',
      solution:'상자를 가득 채우면 3×3×3=27개입니다. 지금 쌓인 14개를 빼면 27−14=13개가 더 필요합니다.',
      evidence:{metric:'box-height-plus-visible-columns',value:9}
    }
  ];

  var STACK_MINIMUM_SPECS=[
    {
      id:'stack-minimum-visible-basic',
      lessonRole:'basic',
      difficulty:'easy',
      heightMap:[[3,2,1],[2,1,0],[1,0,0]],
      answer:10,
      answerHtml:'10개',
      prompt:'다음 쌓기나무의 개수는 몇 개일까요?',
      solution:'아래층에 6개, 두 번째 층에 3개, 세 번째 층에 1개가 있습니다. 6+3+1=10개입니다.',
      evidence:{metric:'cube-count',value:10}
    },
    {
      id:'stack-minimum-visible-guided',
      lessonRole:'guided',
      difficulty:'same',
      heightMap:[[3,2,2],[2,2,1],[1,1,0]],
      answer:14,
      answerHtml:'14개',
      prompt:'다음 쌓기나무의 개수는 몇 개일까요?',
      solution:'아래층에 8개, 두 번째 층에 5개, 세 번째 층에 1개가 있습니다. 8+5+1=14개입니다.',
      evidence:{metric:'cube-count',value:14}
    },
    {
      id:'stack-minimum-visible-review',
      lessonRole:'review',
      difficulty:'same',
      heightMap:[[3,3,2],[2,1,1],[1,1,0]],
      answer:14,
      answerHtml:'14개',
      prompt:'다음 쌓기나무의 개수는 몇 개일까요?',
      solution:'아래층에 8개, 두 번째 층에 4개, 세 번째 층에 2개가 있습니다. 8+4+2=14개입니다.',
      evidence:{metric:'cube-count',value:14}
    }
  ];

  var TETRA_CUBE_HOLE_SPECS=[
    {
      id:'tetra-cube-hole-count-basic',lessonRole:'basic',difficulty:'easy',
      heightMap:[[2,2,2,2,1],[2,2,2,2,1],[1,1,0,1,1],[1,1,1,1,1],[1,1,1,1,1]],
      pieces:[
        levelCells([[0,0],[1,0],[2,0],[3,0]],0),levelCells([[4,0],[4,1],[4,2],[4,3]],0),
        levelCells([[0,1],[1,1],[2,1],[3,1]],0),levelCells([[0,2],[1,2],[0,3],[1,3]],0),
        levelCells([[3,2],[3,3],[3,4],[4,4]],0),levelCells([[2,3],[0,4],[1,4],[2,4]],0),
        levelCells([[0,0],[1,0],[2,0],[3,0]],1),levelCells([[0,1],[1,1],[2,1],[3,1]],1)
      ],holes:1,answer:8,evidence:{metric:'top-view-hole-count',value:1}
    },
    {
      id:'tetra-cube-hole-count-guided',lessonRole:'guided',difficulty:'same',
      heightMap:[[2,2,2,2,1,1],[2,2,2,2,1,1],[1,1,0,0,1,1],[1,1,1,1,1,1],[1,1,1,1,1,1]],
      pieces:[
        levelCells([[0,0],[1,0],[2,0],[3,0]],0),levelCells([[4,0],[4,1],[4,2],[4,3]],0),
        levelCells([[5,0],[5,1],[5,2],[5,3]],0),levelCells([[0,1],[0,2],[0,3],[0,4]],0),
        levelCells([[1,1],[2,1],[3,1],[1,2]],0),levelCells([[2,4],[3,4],[4,4],[5,4]],0),
        levelCells([[1,3],[2,3],[3,3],[1,4]],0),levelCells([[0,0],[1,0],[2,0],[3,0]],1),
        levelCells([[0,1],[1,1],[2,1],[3,1]],1)
      ],holes:2,answer:9,evidence:{metric:'top-view-hole-count',value:2}
    },
    {
      id:'tetra-cube-hole-count-review',lessonRole:'review',difficulty:'same',
      heightMap:[[1,1,2,2,2,2],[1,1,2,2,2,2],[1,0,1,1,0,1],[1,1,1,1,1,1],[1,1,1,1,1,1]],
      pieces:[
        levelCells([[0,0],[1,0],[2,0],[3,0]],0),levelCells([[4,0],[5,0],[4,1],[5,1]],0),
        levelCells([[0,1],[0,2],[0,3],[0,4]],0),levelCells([[2,4],[3,4],[4,4],[5,4]],0),
        levelCells([[2,2],[1,3],[2,3],[1,4]],0),levelCells([[1,1],[2,1],[3,1],[3,2]],0),
        levelCells([[5,2],[3,3],[4,3],[5,3]],0),levelCells([[2,0],[3,0],[4,0],[5,0]],1),
        levelCells([[2,1],[3,1],[4,1],[5,1]],1)
      ],holes:2,answer:9,evidence:{metric:'top-view-hole-count',value:2}
    }
  ];

  var NET_COORDS={
    N1:[[0,0],[0,1],[1,1],[2,1],[3,1],[0,2]],N2:[[1,0],[0,1],[1,1],[2,1],[3,1],[0,2]],
    N3:[[2,0],[0,1],[1,1],[2,1],[3,1],[0,2]],N4:[[3,0],[0,1],[1,1],[2,1],[3,1],[0,2]],
    N5:[[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]],N6:[[2,0],[0,1],[1,1],[2,1],[3,1],[1,2]],
    N7:[[0,0],[1,0],[1,1],[2,1],[3,1],[1,2]],N8:[[2,0],[1,1],[2,1],[3,1],[0,2],[1,2]],
    N10:[[2,0],[3,0],[4,0],[0,1],[1,1],[2,1]],N11:[[2,0],[1,1],[2,1],[0,2],[1,2],[0,3]]
  };

  function makeNetSubproblem(net,values,given,query){
    return {net:net,cells:clone(NET_COORDS[net]),values:values,given:given,query:query,answer:query.map(function(index){return values[index];})};
  }

  var NET_COLOR_SPECS=[
    {id:'net-colors-pair-basic',lessonRole:'basic',difficulty:'easy',kind:'net-colors-pair',evidence:{metric:'blank-faces-per-net',value:1},subproblems:[makeNetSubproblem('N1',['빨간색','노란색','파란색','노란색','파란색','빨간색'],[2],[4]),makeNetSubproblem('N5',['노란색','파란색','빨간색','파란색','빨간색','노란색'],[5],[0])]},
    {id:'net-colors-pair-guided',lessonRole:'guided',difficulty:'same',kind:'net-colors-pair',evidence:{metric:'blank-faces-per-net',value:2},subproblems:[makeNetSubproblem('N2',['파란색','빨간색','노란색','빨간색','노란색','파란색'],[0,2],[5,4]),makeNetSubproblem('N7',['빨간색','노란색','파란색','빨간색','파란색','노란색'],[0,1],[3,5])]},
    {id:'net-colors-pair-review',lessonRole:'review',difficulty:'same',kind:'net-colors-pair',evidence:{metric:'blank-faces-per-net',value:2},subproblems:[makeNetSubproblem('N6',['노란색','파란색','빨간색','파란색','빨간색','노란색'],[1,2],[3,4]),makeNetSubproblem('N11',['빨간색','노란색','파란색','파란색','빨간색','노란색'],[0,2],[4,3])]}
  ];

  var NET_PIP_SPECS=[
    {id:'net-pips-pair-basic',lessonRole:'basic',difficulty:'easy',kind:'net-pips-pair',evidence:{metric:'blank-faces-per-net',value:1},subproblems:[makeNetSubproblem('N3',[1,2,3,5,4,6],[0],[5]),makeNetSubproblem('N4',[2,3,1,4,6,5],[1],[3])]},
    {id:'net-pips-pair-guided',lessonRole:'guided',difficulty:'same',kind:'net-pips-pair',evidence:{metric:'blank-faces-per-net',value:2},subproblems:[makeNetSubproblem('N7',[3,1,2,4,5,6],[0,1],[3,5]),makeNetSubproblem('N8',[2,3,1,4,6,5],[0,2],[5,4])]},
    {id:'net-pips-pair-review',lessonRole:'review',difficulty:'same',kind:'net-pips-pair',evidence:{metric:'blank-faces-per-net',value:2},subproblems:[makeNetSubproblem('N10',[1,2,6,3,5,4],[0,3],[2,5]),makeNetSubproblem('N11',[2,1,3,4,5,6],[0,1],[4,5])]}
  ];

  var DICE_TARGET_SPECS=[
    {id:'dice-target-bottom-basic',lessonRole:'basic',difficulty:'easy',sourceProblemId:'dice-l4-01',board:{start:[1,0],route:['E','E','S','W'],startOrientation:{top:6,bottom:1,north:3,south:4,east:2,west:5}},evidence:{metric:'roll-count',value:4}},
    {id:'dice-target-bottom-guided',lessonRole:'guided',difficulty:'same',sourceProblemId:'dice-l4-02',board:{start:[0,0],route:['S','S','E','N','E'],startOrientation:{top:1,bottom:6,north:2,south:5,east:3,west:4}},evidence:{metric:'roll-count',value:5}},
    {id:'dice-target-bottom-review',lessonRole:'review',difficulty:'same',sourceProblemId:'dice-l4-03',board:{start:[2,0],route:['N','E','E','S','S'],startOrientation:{top:2,bottom:5,north:4,south:3,east:6,west:1}},evidence:{metric:'roll-count',value:5}}
  ];

  var DICE_FINISH_SPECS=[
    {id:'dice-finish-visible-faces-basic',lessonRole:'basic',difficulty:'easy',board:{start:[3,0],route:['E','E','N','N'],startOrientation:{top:4,bottom:3,north:6,south:1,east:2,west:5}},evidence:{metric:'roll-count',value:4}},
    {id:'dice-finish-visible-faces-guided',lessonRole:'guided',difficulty:'same',board:{start:[1,3],route:['N','W','S','S','E'],startOrientation:{top:2,bottom:5,north:3,south:4,east:1,west:6}},evidence:{metric:'roll-count',value:5}},
    {id:'dice-finish-visible-faces-review',lessonRole:'review',difficulty:'same',board:{start:[0,2],route:['E','S','S','W','W'],startOrientation:{top:3,bottom:4,north:6,south:1,east:5,west:2}},evidence:{metric:'roll-count',value:5}}
  ];

  var DICE_PAIRED_SPECS=[
    {id:'dice-paired-bottom-inference-basic',lessonRole:'basic',difficulty:'easy',unknownFace:'right',boards:[{start:[1,1],route:['E','S','E','S'],startOrientation:{top:2,bottom:5,north:4,south:3,east:6,west:1}},{start:[3,3],route:['W','N','E','N'],startOrientation:{top:4,bottom:3,north:2,south:5,east:1,west:6}}],evidence:{metric:'maximum-route-length',value:4}},
    {id:'dice-paired-bottom-inference-guided',lessonRole:'guided',difficulty:'same',unknownFace:'front',boards:[{start:[0,1],route:['S','E','S','W','W'],startOrientation:{top:2,bottom:5,north:6,south:1,east:3,west:4}},{start:[0,1],route:['E','E','S','W','W'],startOrientation:{top:4,bottom:3,north:5,south:2,east:6,west:1}}],evidence:{metric:'maximum-route-length',value:5}},
    {id:'dice-paired-bottom-inference-review',lessonRole:'review',difficulty:'same',unknownFace:'top',boards:[{start:[1,0],route:['S','E','N','E','N'],startOrientation:{top:1,bottom:6,north:2,south:5,east:3,west:4}},{start:[3,0],route:['N','N','N','E','S'],startOrientation:{top:4,bottom:3,north:6,south:1,east:2,west:5}}],evidence:{metric:'maximum-route-length',value:5}}
  ];

  var SIMPLE_PATH_SPECS=[
    {
      id:'simple-path-network-basic',lessonRole:'basic',difficulty:'easy',answer:7,branchCounts:[4,3],
      vertices:[{id:'A',x:82,y:126},{id:'B',x:190,y:42},{id:'C',x:365,y:42},{id:'T',x:574,y:126},{id:'E',x:425,y:215},{id:'D',x:190,y:215},{id:'X',x:305,y:124}],
      edges:[['A','B'],['B','C'],['C','T'],['T','E'],['E','D'],['D','A'],['B','X'],['C','X'],['X','E']],
      evidence:{metric:'independent-cycle-count',value:3}
    },
    {
      id:'simple-path-network-guided',lessonRole:'guided',difficulty:'same',answer:12,branchCounts:[6,6],
      vertices:[{id:'A',x:82,y:126},{id:'B',x:184,y:39},{id:'C',x:376,y:39},{id:'T',x:574,y:126},{id:'E',x:425,y:215},{id:'D',x:184,y:215},{id:'X',x:284,y:104},{id:'Y',x:314,y:171}],
      edges:[['A','B'],['B','C'],['C','T'],['T','E'],['E','D'],['D','A'],['B','X'],['C','X'],['X','Y'],['Y','D'],['Y','E']],
      evidence:{metric:'independent-cycle-count',value:4}
    },
    {
      id:'simple-path-network-review',lessonRole:'review',difficulty:'same',answer:12,branchCounts:[6,6],
      vertices:[{id:'A',x:82,y:132},{id:'B',x:200,y:38},{id:'C',x:400,y:58},{id:'T',x:574,y:132},{id:'E',x:404,y:219},{id:'D',x:170,y:204},{id:'X',x:315,y:94},{id:'Y',x:338,y:174}],
      edges:[['A','B'],['B','C'],['C','T'],['T','E'],['E','D'],['D','A'],['B','X'],['C','X'],['X','Y'],['Y','E'],['X','D']],
      evidence:{metric:'independent-cycle-count',value:4}
    }
  ];

  var ROD_SPECS=[
    {
      id:'rod-subset-lengths-basic',
      lessonRole:'basic',
      difficulty:'easy',
      rods:[2,3,5],
      solutionSums:[2,3,5,7,8,10],
      answer:6,
      answerHtml:'6가지',
      prompt:'아래 막대 중 하나 이상을 골라 끝과 끝을 이어 한 줄로 놓습니다. 막대는 각각 한 번만 쓸 수 있고 자르거나 겹칠 수 없습니다. 막대를 놓는 순서만 다른 것은 같은 길이입니다. 만들 수 있는 서로 다른 전체 길이는 모두 몇 가지입니까?',
      solution:'한 개만 쓰면 2, 3, 5 cm입니다. 두 개를 쓰면 2+3=5, 2+5=7, 3+5=8 cm이고, 세 개를 모두 쓰면 10 cm입니다. 같은 5 cm를 한 번만 세면 2, 3, 5, 7, 8, 10 cm의 6가지입니다.',
      evidence:{metric:'nonempty-rod-subsets',value:7}
    },
    {
      id:'rod-subset-lengths-guided',
      lessonRole:'guided',
      difficulty:'same',
      rods:[2,4,6,10],
      solutionSums:[2,4,6,8,10,12,14,16,18,20,22],
      answer:11,
      answerHtml:'11가지',
      prompt:'길이가 다른 네 막대 중 하나 이상을 골라 이어 붙입니다. 각 막대는 한 번만 쓰고, 막대를 자르거나 겹치지 않습니다. 이어 붙이는 순서가 달라도 전체 길이가 같으면 같은 경우입니다. 만들 수 있는 서로 다른 전체 길이는 몇 가지입니까?',
      solution:'모든 막대 조합의 합을 구한 뒤 같은 값을 한 번만 남깁니다. 가능한 전체 길이는 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22 cm이므로 모두 11가지입니다.',
      evidence:{metric:'nonempty-rod-subsets',value:15}
    },
    {
      id:'rod-subset-lengths-review',
      lessonRole:'review',
      difficulty:'same',
      rods:[3,5,7,9],
      solutionSums:[3,5,7,8,9,10,12,14,15,16,17,19,21,24],
      answer:14,
      answerHtml:'14가지',
      prompt:'아래 네 막대 중 원하는 막대를 하나 이상 골라 한 줄로 이어 붙입니다. 한 막대는 한 번만 쓸 수 있으며 자르거나 겹치지 않습니다. 사용한 막대의 순서만 바뀐 것은 같은 길이로 셉니다. 만들 수 있는 서로 다른 전체 길이는 모두 몇 가지입니까?',
      solution:'한 개, 두 개, 세 개, 네 개를 고르는 모든 조합의 합을 차례로 적고 같은 합은 한 번만 셉니다. 서로 다른 전체 길이는 3, 5, 7, 8, 9, 10, 12, 14, 15, 16, 17, 19, 21, 24 cm이므로 14가지입니다.',
      evidence:{metric:'nonempty-rod-subsets',value:15}
    }
  ];

  var BANK={};
  BANK['checker-stack-count']=CHECKER_STACK_SPECS.map(function(spec){
    var answer=countChecker(spec.heightMap,spec.offset),enriched=Object.assign({},spec,{answer:answer});
    return makeQuestion({id:spec.id,kind:'checker-stack-count',lessonRole:spec.lessonRole,difficulty:spec.difficulty,difficultyEvidence:spec.evidence,
      prompt:'검은색 쌓기나무와 흰색 쌓기나무가 맞닿지 않도록 번갈아 쌓았습니다. 검은색과 흰색 쌓기나무는 각각 몇 개일까요?',
      answer:answer,answerHtml:'검은색 '+answer.black+'개 · 흰색 '+answer.white+'개',
      solution:'층과 자리를 번갈아 확인하여 세면 검은색은 '+answer.black+'개, 흰색은 '+answer.white+'개입니다.',
      problemHtml:checkerStackSvg(enriched,false),solutionDiagram:checkerStackSvg(enriched,true),
      payload:{heightMap:spec.heightMap,checkerOffset:spec.offset,noFloatingCubes:true,responseMode:'color-count-pair'}});
  });
  BANK['stack-box-fill']=STACK_FILL_SPECS.map(function(spec){
    return makeQuestion({
      id:spec.id,
      kind:'stack-box-fill',
      lessonRole:spec.lessonRole,
      difficulty:spec.difficulty,
      difficultyEvidence:spec.evidence,
      prompt:spec.prompt,
      answer:spec.answer,
      answerHtml:spec.answerHtml,
      solution:spec.solution,
      problemHtml:stackBoxFillProblemSvg(spec.heightMap,spec.boxH),
      solutionDiagram:stackBoxFillSolutionSvg(spec.heightMap,spec.boxH),
      payload:{
        width:3,
        depth:3,
        boxH:spec.boxH,
        heightMap:spec.heightMap,
        placed:flattenHeightMap(spec.heightMap).reduce(function(total,height){return total+height;},0),
        full:3*3*spec.boxH,
        need:spec.answer,
        shapeRule:'left-wall-full-descending-staircase',
        camera:'geometry-standard-iso',
        responseMode:'additional-cube-count'
      }
    });
  });
  BANK['stack-minimum-visible']=STACK_MINIMUM_SPECS.map(function(spec){
    return makeQuestion({
      id:spec.id,
      kind:'stack-minimum-visible',
      lessonRole:spec.lessonRole,
      difficulty:spec.difficulty,
      difficultyEvidence:spec.evidence,
      prompt:spec.prompt,
      answer:spec.answer,
      answerHtml:spec.answerHtml,
      solution:spec.solution,
      problemHtml:stackMinimumSvg(spec.heightMap,false),
      solutionDiagram:stackMinimumSvg(spec.heightMap,true),
      payload:{
        size:3,
        heightMap:spec.heightMap,
        rowOrder:'back-to-front',
        columnOrder:'left-to-right',
        camera:'iso-plus-x-plus-z-v1',
        viewerVector:[1,1,1],
        noFloatingCubes:true,
        countMode:'all-cubes-in-drawing',
        responseMode:'cube-count'
      }
    });
  });
  BANK['congruent-marked-partition']=CONGRUENT_PARTITION_SPECS.map(function(spec){
    return makeQuestion({id:spec.id,kind:'congruent-marked-partition',lessonRole:spec.lessonRole,difficulty:spec.difficulty,difficultyEvidence:spec.evidence,
      prompt:'다음 그림을 같은 모양, 같은 크기의 두 부분으로 나누세요. 각 부분에는 나무 그림이 하나씩 들어가야 합니다.',
      answer:spec.boards.map(function(board){return clone(board.parts);}),answerHtml:'각 그림을 같은 두 부분으로 나누기',
      solution:'각 나무 그림이 서로 같은 모양의 한 부분에 하나씩 들어가도록 굵은 선을 긋습니다.',
      problemHtml:congruentPartitionSvg(spec,false),solutionDiagram:congruentPartitionSvg(spec,true),
      payload:{boards:spec.boards,allowRotation:true,allowReflection:true,oneMarkerPerPart:true,responseMode:'draw-partition-lines'}});
  });
  BANK['tetra-cube-hole-count']=TETRA_CUBE_HOLE_SPECS.map(function(spec){
    var cubeCount=flattenHeightMap(spec.heightMap).reduce(function(total,height){return total+height;},0);
    return makeQuestion({
      id:spec.id,
      kind:'tetra-cube-hole-count',
      lessonRole:spec.lessonRole,
      difficulty:spec.difficulty,
      difficultyEvidence:spec.evidence,
      prompt:'다음 쌓기나무 모양을 만들기 위해 테트라큐브를 몇 개 사용했는지 구하세요. 테트라큐브 한 개는 쌓기나무 4개로 되어 있습니다.',
      answer:spec.answer,
      answerHtml:spec.answer+'개',
      solution:(function(){var layers=[];for(var level=1;level<=Math.max.apply(null,flattenHeightMap(spec.heightMap));level++)layers.push(level+'층 '+flattenHeightMap(spec.heightMap).filter(function(height){return height>=level;}).length+'개');return layers.join(', ')+'이므로 쌓기나무는 모두 '+cubeCount+'개입니다. '+cubeCount+'÷4='+spec.answer+'이므로 테트라큐브는 '+spec.answer+'개입니다.';})(),
      problemHtml:tetraCubeHoleSvg(spec,false),
      solutionDiagram:tetraCubeHoleSvg(spec,true),
      payload:{
        heightMap:spec.heightMap,
        pieces:spec.pieces,
        holes:spec.holes,
        tetraCubeSize:4,
        cubeCount:cubeCount,
        topView:'marked-holes',
        responseMode:'tetra-cube-count'
      }
    });
  });
  BANK['object-length-equivalence']=OBJECT_LENGTH_SPECS.map(function(spec){
    var prompt=spec.query==='pencil-minus-two-erasers'?'두 줄의 양끝을 맞추었습니다. 연필은 지우개 2개보다 클립 몇 개만큼 더 길까요?':'여러 줄의 양끝을 맞추었습니다. 연필 1개의 길이는 클립 몇 개의 길이와 같을까요?';
    return makeQuestion({id:spec.id,kind:'object-length-equivalence',lessonRole:spec.lessonRole,difficulty:spec.difficulty,difficultyEvidence:spec.evidence,
      prompt:prompt,answer:spec.answer,answerHtml:spec.answer+'개',solution:spec.solutionCaption,
      problemHtml:objectLengthSvg(spec,false),solutionDiagram:objectLengthSvg(spec,true),payload:{units:spec.units,rows:spec.rows,query:spec.query,responseMode:'clip-count'}});
  });
  BANK['block-build-count']=BLOCK_BUILD_SPECS.map(function(spec){
    var total=spec.width*spec.depth*spec.height,answer={A:total-spec.bPieces.length*2,B:spec.bPieces.length},enriched=Object.assign({},spec,{answer:answer});
    return makeQuestion({id:spec.id,kind:'block-build-count',lessonRole:spec.lessonRole,difficulty:spec.difficulty,difficultyEvidence:spec.evidence,
      prompt:'A 블록과 B 블록을 사용하여 다음 모양을 만들었습니다. A 블록과 B 블록은 각각 몇 개 사용했을까요?',
      answer:answer,answerHtml:'A 블록 '+answer.A+'개 · B 블록 '+answer.B+'개',solution:'전체 한 칸은 '+total+'칸입니다. B 블록 '+answer.B+'개가 '+(answer.B*2)+'칸을 차지하므로 A 블록은 '+total+'−'+(answer.B*2)+'='+answer.A+'개입니다.',
      problemHtml:blockBuildSvg(enriched,false),solutionDiagram:blockBuildSvg(enriched,true),payload:{width:spec.width,depth:spec.depth,height:spec.height,bPieces:spec.bPieces,responseMode:'two-block-counts'}});
  });
  function buildNetPairQuestion(spec){
    var color=spec.kind==='net-colors-pair',answers=spec.subproblems.map(function(subproblem){return subproblem.answer.join(', ');});
    return makeQuestion({
      id:spec.id,kind:spec.kind,lessonRole:spec.lessonRole,difficulty:spec.difficulty,difficultyEvidence:spec.evidence,
      prompt:'서로 다른 두 전개도를 접어 주사위를 만듭니다. '+(color?'마주 보는 두 면의 색은 같습니다.':'마주 보는 두 면의 눈의 합은 7입니다.')+' (1), (2)의 빈칸에 들어갈 '+(color?'색':'눈의 수')+'을 각각 쓰세요.',
      answer:spec.subproblems.map(function(subproblem){return clone(subproblem.answer);}),
      answerHtml:answers.map(function(answer,index){return '('+(index+1)+') '+answer;}).join(' · '),
      solution:spec.subproblems.map(function(subproblem,index){
        var opposite=foldNet(subproblem.cells);
        return '('+(index+1)+') '+subproblem.query.map(function(queryIndex,queryNumber){
          var knownIndex=opposite[queryIndex],known=subproblem.values[knownIndex],answer=subproblem.answer[queryNumber],label=['㉠','㉡','㉢'][queryNumber];
          return color?label+'의 맞은편은 '+known+'이므로 '+answer+'입니다.':label+'의 맞은편은 '+known+'이므로 7−'+known+'='+answer+'입니다.';
        }).join(' ');
      }).join(' '),
      problemHtml:pairedNetSvg(spec,false),solutionDiagram:pairedNetSvg(spec,true),
      payload:{rule:color?'opposite-same-color':'opposite-sum-seven',responseMode:'paired-net-fill',subproblems:spec.subproblems}
    });
  }
  BANK['net-colors-pair']=NET_COLOR_SPECS.map(buildNetPairQuestion);
  BANK['net-pips-pair']=NET_PIP_SPECS.map(buildNetPairQuestion);
  BANK['dice-target-bottom']=DICE_TARGET_SPECS.map(function(spec){
    var answer=rollMany(spec.board.startOrientation,spec.board.route).bottom;
    var enriched=Object.assign({},spec,{answer:answer});
    return makeQuestion({
      id:spec.id,
      kind:'dice-target-bottom',
      lessonRole:spec.lessonRole,
      difficulty:spec.difficulty,
      difficultyEvidence:spec.evidence,
      prompt:'주사위를 화살표 방향으로 ㉠까지 굴릴 때, ㉠에서 바닥에 닿는 면의 눈을 구하세요.',
      answer:answer,
      answerHtml:answer+'개',
      solution:'한 칸씩 굴리면 밑면의 눈은 '+bottomTrace(spec.board).join(' → ')+'로 바뀝니다. 따라서 ㉠에서 바닥에 닿는 면의 눈은 '+answer+'입니다.',
      problemHtml:targetBottomSvg(enriched,false),
      solutionDiagram:targetBottomSvg(enriched,true),
      payload:{board:spec.board,start:spec.board.start,startOrientation:spec.board.startOrientation,route:spec.board.route,rows:4,cols:4,view:'southeast-diagonal',targetStep:spec.board.route.length,responseMode:'target-bottom-number',sourceDatabase:'geometry/games/dice-roll/levels.js',sourceProblemId:spec.sourceProblemId}
    });
  });
  BANK['dice-finish-visible-faces']=DICE_FINISH_SPECS.map(function(spec){
    var finish=rollMany(spec.board.startOrientation,spec.board.route);
    var answer=[finish.top,finish.south,finish.east];
    var enriched=Object.assign({},spec,{answer:answer});
    return makeQuestion({
      id:spec.id,
      kind:'dice-finish-visible-faces',
      lessonRole:spec.lessonRole,
      difficulty:spec.difficulty,
      difficultyEvidence:spec.evidence,
      prompt:'화살표를 따라 끝까지 굴린 뒤 주사위의 윗면·앞면·오른쪽 면의 눈을 차례로 쓰세요.',
      answer:answer,
      answerHtml:'윗면 '+answer[0]+' · 앞면 '+answer[1]+' · 오른쪽 면 '+answer[2],
      solution:'한 칸씩 굴리며 위·앞·오른쪽 면을 기록하면 '+faceTrace(spec.board.startOrientation,spec.board.route,'front-right')+'입니다. 도착한 세 면은 '+answer.join('·')+'입니다.',
      problemHtml:finishVisibleSvg(enriched,false),
      solutionDiagram:finishVisibleSvg(enriched,true),
      payload:{board:spec.board,start:spec.board.start,startOrientation:spec.board.startOrientation,route:spec.board.route,rows:4,cols:4,view:'southeast-diagonal',queryFaces:['top','front','right'],responseMode:'three-visible-face-numbers'}
    });
  });
  BANK['dice-paired-bottom-inference']=DICE_PAIRED_SPECS.map(function(spec){
    var faceKey={top:'top',front:'south',right:'east'}[spec.unknownFace];
    var firstContact=rollMany(spec.boards[0].startOrientation,spec.boards[0].route).bottom;
    var secondContact=rollMany(spec.boards[1].startOrientation,spec.boards[1].route).bottom;
    assert(firstContact===secondContact,spec.id+' must finish with the same bottom face.');
    var answer=spec.boards[1].startOrientation[faceKey];
    var enriched=Object.assign({},spec,{answer:answer,contactValue:firstContact});
    return makeQuestion({
      id:spec.id,
      kind:'dice-paired-bottom-inference',
      lessonRole:spec.lessonRole,
      difficulty:spec.difficulty,
      difficultyEvidence:spec.evidence,
      prompt:'같은 주사위 2개를 각각 화살표 방향으로 굴렸더니 색칠한 마지막 칸에 같은 눈이 닿았습니다. 둘째 주사위의 ㉠에 있는 눈을 구하세요.',
      answer:answer,
      answerHtml:'㉠ = '+answer,
      solution:'첫째 주사위의 밑면은 '+bottomTrace(spec.boards[0]).join(' → ')+'이므로 마지막 밑면은 '+firstContact+'입니다. 둘째 경로를 거꾸로 따라가면 ㉠의 눈은 '+answer+'입니다.',
      problemHtml:pairedBottomSvg(enriched,false),
      solutionDiagram:pairedBottomSvg(enriched,true),
      payload:{boards:spec.boards,unknownFace:spec.unknownFace,contactValue:firstContact,view:'southeast-diagonal',responseMode:'hidden-face-number'}
    });
  });
  BANK['simple-path-network']=SIMPLE_PATH_SPECS.map(function(spec){
    return makeQuestion({
      id:spec.id,
      kind:'simple-path-network',
      lessonRole:spec.lessonRole,
      difficulty:spec.difficulty,
      difficultyEvidence:spec.evidence,
      prompt:'혜연이가 과자 집으로 가는 길은 모두 몇 가지입니까? 단, 지나간 지점은 다시 지나가지 않습니다.',
      answer:spec.answer,
      answerHtml:spec.answer+'가지',
      solution:'첫 갈림에서 위쪽 길로 시작하는 경우는 '+spec.branchCounts[0]+'가지, 아래쪽 길로 시작하는 경우는 '+spec.branchCounts[1]+'가지입니다. 이미 지난 지점으로 돌아가는 길을 제외하면 '+spec.branchCounts[0]+'+'+spec.branchCounts[1]+'='+spec.answer+'가지입니다.',
      problemHtml:simplePathSvg(spec,false),
      solutionDiagram:simplePathSvg(spec,true),
      payload:{vertices:spec.vertices,edges:spec.edges,start:'A',end:'T',undirected:true,noRevisit:true,branchCounts:spec.branchCounts,responseMode:'number'}
    });
  });
  BANK['rod-subset-lengths']=ROD_SPECS.map(function(spec){
    return makeQuestion({
      id:spec.id,
      kind:'rod-subset-lengths',
      lessonRole:spec.lessonRole,
      difficulty:spec.difficulty,
      difficultyEvidence:spec.evidence,
      prompt:spec.prompt,
      answer:spec.answer,
      answerHtml:spec.answerHtml,
      solution:spec.solution,
      problemHtml:rodProblemSvg(spec.rods),
      solutionDiagram:rodSumsSolutionSvg(spec.solutionSums),
      payload:{
        rods:spec.rods,
        unit:'cm',
        useEachAtMostOnce:true,
        requireNonemptySubset:true,
        responseMode:'number'
      }
    });
  });
  BANK['shortest-path-grid']=SHORTEST_PATH_SPECS.map(function(spec){
    var result=shortestPathCount(spec);
    return makeQuestion({id:spec.id,kind:'shortest-path-grid',lessonRole:spec.lessonRole,difficulty:spec.difficulty,difficultyEvidence:spec.evidence,
      prompt:'출발점에서 도착점까지 오른쪽 또는 위쪽으로만 최단거리로 가려고 합니다. 검은 지점을 지나지 않는 길은 모두 몇 가지일까요?',
      answer:result.answer,answerHtml:result.answer+'가지',solution:'각 지점까지 오는 길의 수를 아래와 왼쪽에서 오는 수의 합으로 적습니다. 도착점의 수는 '+result.answer+'이므로 '+result.answer+'가지입니다.',
      problemHtml:shortestPathSvg(spec,false),solutionDiagram:shortestPathSvg(spec,true),payload:{cols:spec.cols,rows:spec.rows,blocked:spec.blocked,directions:['E','N'],responseMode:'shortest-path-count'}});
  });
  BANK['balance-substitution-pictures']=BALANCE_SUBSTITUTION_SPECS.map(function(spec){
    return makeQuestion({id:spec.id,kind:'balance-substitution-pictures',lessonRole:spec.lessonRole,difficulty:spec.difficulty,difficultyEvidence:spec.evidence,
      prompt:'앞의 양팔저울은 모두 평형을 이루고 있습니다. 앞의 관계를 이용하여 마지막 저울이 평형을 이루도록 오른쪽 접시에 같은 모양을 몇 개 놓아야 할까요?',
      answer:spec.answer,answerHtml:spec.answer+'개',solution:balanceSubstitutionSolution(spec),
      problemHtml:balanceSubstitutionSvg(spec,false),solutionDiagram:balanceSubstitutionSvg(spec,true),payload:{values:spec.values,equations:spec.equations,responseMode:'missing-object-count'}});
  });

  function assert(condition,message){
    if(!condition){
      throw new Error(message);
    }
  }

  function equal(left,right){
    return JSON.stringify(left)===JSON.stringify(right);
  }

  function orientationKey(orientation,view){
    return visibleFaces(orientation,view||'front-right').join(',');
  }

  function fullOrientationKey(orientation){
    return ['top','bottom','north','south','east','west'].map(function(key){return orientation[key];}).join(',');
  }

  function oppositeSumOrientations(){
    var orientations=[];
    for(var top=1;top<=6;top++)for(var north=1;north<=6;north++)for(var east=1;east<=6;east++){
      var orientation={top:top,bottom:7-top,north:north,south:7-north,east:east,west:7-east};
      if(new Set(Object.keys(orientation).map(function(key){return orientation[key];})).size===6)orientations.push(orientation);
    }
    return orientations;
  }

  var OPPOSITE_SUM_ORIENTATIONS=oppositeSumOrientations();

  function validateDiceBoard(board,label){
    var rows=board.rows||4,columns=board.cols||4,path=routePath(board.start,board.route),inverse={N:'S',S:'N',E:'W',W:'E'};
    assert(rows===4&&columns===4,label+' must use a 4×4 board.');
    assert(Array.isArray(board.start)&&board.start.length===2,label+' has no start cell.');
    assert(Array.isArray(board.route)&&board.route.length>=1,label+' has no route.');
    assert(path.length===board.route.length+1,label+' has a broken route.');
    path.forEach(function(cell){assert(cell[0]>=0&&cell[0]<rows&&cell[1]>=0&&cell[1]<columns,label+' leaves the 4×4 board.');});
    assert(new Set(path.map(function(cell){return cell.join(',');})).size===path.length,label+' revisits a cell.');
    board.route.forEach(function(direction,index){
      assert(Object.prototype.hasOwnProperty.call(DIRECTION,direction),label+' has an unknown direction.');
      if(index)assert(inverse[board.route[index-1]]!==direction,label+' immediately reverses direction.');
    });
    var values=['top','bottom','north','south','east','west'].map(function(key){return board.startOrientation[key];});
    assert(values.every(function(value){return Number.isInteger(value)&&value>=1&&value<=6;}),label+' has an invalid die face.');
    assert(new Set(values).size===6,label+' must use each die face exactly once.');
    assert(board.startOrientation.top+board.startOrientation.bottom===7&&board.startOrientation.north+board.startOrientation.south===7&&board.startOrientation.east+board.startOrientation.west===7,label+' violates the opposite-face sum rule.');
    return {path:path,finish:rollMany(board.startOrientation,board.route)};
  }

  function tokenCount(value,token){
    return value.split(token).length-1;
  }

  function flattenHeightMap(heightMap){
    return [].concat.apply([],heightMap);
  }

  function enumerateRodSums(rods){
    var sums=new Set();
    var subsetCount=Math.pow(2,rods.length)-1;
    for(var mask=1;mask<=subsetCount;mask++){
      var total=0;
      for(var index=0;index<rods.length;index++){
        if(mask&(1<<index)){
          total+=rods[index];
        }
      }
      sums.add(total);
    }
    return {
      subsetCount:subsetCount,
      values:Array.from(sums).sort(function(left,right){return left-right;})
    };
  }

  function enumerateSimplePaths(payload){
    var neighbors={};payload.vertices.forEach(function(vertex){neighbors[vertex.id]=[];});
    payload.edges.forEach(function(edge){neighbors[edge[0]].push(edge[1]);neighbors[edge[1]].push(edge[0]);});
    var paths=[];
    function visit(node,seen,path){
      if(node===payload.end){paths.push(path.slice());return;}
      neighbors[node].forEach(function(next){
        if(seen.has(next))return;
        seen.add(next);path.push(next);visit(next,seen,path);path.pop();seen.delete(next);
      });
    }
    visit(payload.start,new Set([payload.start]),[payload.start]);
    return paths;
  }

  function validateNetPair(question,color){
    var signatures=[];
    question.payload.subproblems.forEach(function(subproblem){
      assert(subproblem.cells.length===6&&subproblem.values.length===6,question.id+' must have six net faces.');
      var opposite=foldNet(subproblem.cells);assert(opposite&&opposite.length===6,question.id+' contains an invalid cube net.');
      for(var index=0;index<6;index++)assert(color?subproblem.values[index]===subproblem.values[opposite[index]]:subproblem.values[index]+subproblem.values[opposite[index]]===7,question.id+' violates the opposite-face rule.');
      subproblem.query.forEach(function(queryIndex,answerIndex){
        assert(subproblem.given.indexOf(opposite[queryIndex])>=0,question.id+' does not show the opposite face needed for a query.');
        assert(subproblem.answer[answerIndex]===subproblem.values[queryIndex],question.id+' has an incorrect net answer.');
      });
      signatures.push(normalizedNetSignature(subproblem.cells));
    });
    assert(new Set(signatures).size===2,question.id+' must show two genuinely different nets.');
    assert(question.payload.subproblems.every(function(subproblem){return subproblem.query.length===question.difficultyEvidence.value;}),question.id+' query count does not match difficulty.');
    return {id:question.id,netSignatures:signatures,queriesPerNet:question.difficultyEvidence.value,answer:question.answer};
  }

  function validateStructure(bank){
    assert(equal(Object.keys(bank),FAMILY_KEYS),'The replacement-special bank must have exactly the required keys.');
    FAMILY_KEYS.forEach(function(kind){
      var questions=bank[kind];
      assert(Array.isArray(questions)&&questions.length===3,kind+' must contain exactly three fixed questions.');
      questions.forEach(function(question,index){
        ['typeId','difficultyEvidence','answer','answerHtml','solution','problemHtml','solutionDiagram'].forEach(function(field){
          assert(Object.prototype.hasOwnProperty.call(question,field),question.id+' is missing '+field+'.');
        });
        assert(question.lessonRole===LESSON_ROLES[index],question.id+' has the wrong lesson role.');
        assert(question.difficulty===DIFFICULTIES[index],question.id+' has the wrong difficulty.');
        assert(question.typeId==='concept-'+kind,question.id+' has the wrong typeId.');
        assert(question.payload&&question.payload.kind===kind,question.id+' has the wrong payload.kind.');
        assert(question.difficultyEvidence&&typeof question.difficultyEvidence.metric==='string'&&Number.isFinite(question.difficultyEvidence.value),question.id+' has invalid difficulty evidence.');
        assert(/^<svg\b/.test(question.problemHtml),question.id+' must use an inline SVG problem.');
        assert(/^<svg\b/.test(question.solutionDiagram),question.id+' must use an inline SVG solution diagram.');
      });
    });
  }

  function get(){
    return Object.fromEntries(FAMILY_KEYS.map(function(key){return [key,clone(BANK[key])];}));
  }

  // This family is shared by the mock-exam sources but is intentionally not
  // added to the concept-book family list. Always return a fresh copy so an
  // exam adapter cannot mutate the fixed source bank used by another round.
  function cloneDiceFinishVisibleFaces(){
    return clone(BANK['dice-finish-visible-faces']);
  }

  function validate(){
    var bank=get();
    validateStructure(bank);
    var checkerChecks=bank['checker-stack-count'].map(function(question){
      var answer=countChecker(question.payload.heightMap,question.payload.checkerOffset);
      assert(equal(answer,question.answer),question.id+' has an incorrect black/white count.');
      assert(answer.black+answer.white===flattenHeightMap(question.payload.heightMap).reduce(function(total,height){return total+height;},0),question.id+' color counts do not cover every cube.');
      return {id:question.id,black:answer.black,white:answer.white};
    });
    var stackFillChecks=bank['stack-box-fill'].map(function(question,index){
      var payload=question.payload,map=payload.heightMap,heights=flattenHeightMap(map),placed=heights.reduce(function(total,height){return total+height;},0),full=payload.width*payload.depth*payload.boxH,occupied=heights.filter(Boolean).length;
      assert(payload.width===3&&payload.depth===3,question.id+' must use a 3×3 floor.');
      assert(Array.isArray(map)&&map.length===3&&map.every(function(row){return Array.isArray(row)&&row.length===3;}),question.id+' must have a 3×3 height map.');
      assert(payload.boxH===(index===0?2:3),question.id+' has the wrong box height.');
      assert(map.every(function(row){return row[0]===payload.boxH;}),question.id+' must keep the full left wall visible.');
      for(var row=0;row<3;row++)for(var column=0;column<3;column++){
        if(row<2)assert(map[row][column]>=map[row+1][column],question.id+' must not rise toward the viewer.');
        if(column<2)assert(map[row][column]>=map[row][column+1],question.id+' must not rise toward the open side.');
      }
      assert(placed===payload.placed&&full===payload.full&&full-placed===payload.need&&payload.need===question.answer,question.id+' has an incorrect fill count.');
      assert(occupied+payload.boxH===question.difficultyEvidence.value,question.id+' difficulty evidence does not match the visible columns and box height.');
      assert(payload.camera==='geometry-standard-iso'&&payload.responseMode==='additional-cube-count',question.id+' must use the Geometry fill-box view and response.');
      return {id:question.id,boxHeight:payload.boxH,placed:placed,full:full,need:payload.need};
    });

    var minimumStackChecks=bank['stack-minimum-visible'].map(function(question,index){
      var map=question.payload.heightMap;
      assert(Array.isArray(map)&&map.length===3&&map.every(function(row){return Array.isArray(row)&&row.length===3;}),question.id+' must have a 3×3 height map.');
      var maximum=Math.max.apply(null,flattenHeightMap(map));
      var cubeCount=flattenHeightMap(map).reduce(function(total,height){return total+height;},0);
      assert(maximum===3,question.id+' must use a three-level stair stack.');
      assert(cubeCount===question.answer,question.id+' answer does not match the cube count.');
      assert(cubeCount===question.difficultyEvidence.value,question.id+' cube count does not match the difficulty evidence.');
      for(var row=0;row<3;row++)for(var column=0;column<3;column++){
        if(row<2)assert(map[row][column]>=map[row+1][column],question.id+' must not rise toward the front.');
        if(column<2)assert(map[row][column]>=map[row][column+1],question.id+' must not rise toward the right.');
      }
      assert(question.payload.countMode==='all-cubes-in-drawing'&&question.payload.responseMode==='cube-count',question.id+' must ask for the shown cube count only.');
      assert(question.prompt==='다음 쌓기나무의 개수는 몇 개일까요?',question.id+' must use the simple cube-count prompt.');
      return {id:question.id,maximumHeight:maximum,cubes:cubeCount};
    });

    var partitionChecks=bank['congruent-marked-partition'].map(function(question){
      question.payload.boards.forEach(function(board){
        assert(board.parts.length===2&&board.markers.length===2,question.id+' must have two marked parts.');
        var cells=board.cells.map(function(cell){return cell.join(',');}),used=board.parts.flat().map(function(cell){return cell.join(',');});
        assert(new Set(cells).size===cells.length&&new Set(used).size===used.length&&used.length===cells.length,question.id+' partition must use every cell exactly once.');
        assert(board.parts.every(function(part){return part.length*2===cells.length;}),question.id+' parts must have equal area.');
        assert(board.parts.every(function(part){return board.markers.filter(function(marker){return part.some(function(cell){return equal(cell,marker);});}).length===1;}),question.id+' must put one marker in each part.');
      });
      assert(question.payload.boards.length===question.difficultyEvidence.value,question.id+' board count does not match difficulty.');
      return {id:question.id,boards:question.payload.boards.length};
    });

    var netColorChecks=bank['net-colors-pair'].map(function(question){return validateNetPair(question,true);});
    var netPipChecks=bank['net-pips-pair'].map(function(question){return validateNetPair(question,false);});

    var targetBottomChecks=bank['dice-target-bottom'].map(function(question){
      var checked=validateDiceBoard(question.payload.board,question.id),answer=checked.finish.bottom;
      assert(answer===question.answer,question.id+' has an incorrect target-bottom answer.');
      assert(question.payload.route.length===question.difficultyEvidence.value&&question.payload.targetStep===question.payload.route.length,question.id+' has an incorrect roll-count metric.');
      assert(question.payload.responseMode==='target-bottom-number'&&question.payload.view==='southeast-diagonal',question.id+' has the wrong response or viewpoint.');
      assert(tokenCount(question.problemHtml,'data-dice-board="4x4"')===1&&tokenCount(question.problemHtml,'data-die-on-start="true"')===1,question.id+' must place one 3D die on one 4×4 board.');
      assert(question.problemHtml.indexOf('㉠')>=0,question.id+' must mark the target cell.');
      return {id:question.id,rolls:question.payload.route.length,answer:answer,path:checked.path};
    });

    var tetraCubeChecks=bank['tetra-cube-hole-count'].map(function(question,index){
      var payload=question.payload,map=payload.heightMap,cubes=flattenHeightMap(map).reduce(function(total,height){return total+height;},0),holes=flattenHeightMap(map).filter(function(height){return height===0;}).length;
      assert(cubes===payload.cubeCount&&cubes===question.answer*payload.tetraCubeSize,question.id+' has an incorrect tetra-cube count.');
      assert(holes===payload.holes&&holes===(index===0?1:2),question.id+' must show one or two interior holes in the top view.');
      assert(payload.tetraCubeSize===4&&payload.topView==='marked-holes'&&payload.responseMode==='tetra-cube-count',question.id+' must use a four-cube tetra-cube and a marked top view.');
      assert(question.difficultyEvidence.metric==='top-view-hole-count'&&question.difficultyEvidence.value===payload.holes,question.id+' has incorrect hole-count evidence.');
      assert(tokenCount(question.problemHtml,'× 표시')===0&&tokenCount(question.solutionDiagram,'× 표시')===1,question.id+' must keep hole labels out of the student diagram.');
      assert(Math.max.apply(null,flattenHeightMap(map))<=2,question.id+' review must remain at a readable two-level stack.');
      var fromPieces=[];
      payload.pieces.forEach(function(piece){
        assert(piece.length===4,question.id+' every tetra-cube must contain four cubes.');
        var occupied=new Set(piece.map(function(cube){return cube.join(',');}));
        var reached=new Set([piece[0].join(',')]),queue=[piece[0]];
        while(queue.length){var cube=queue.shift();[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]].forEach(function(step){var next=[cube[0]+step[0],cube[1]+step[1],cube[2]+step[2]],key=next.join(',');if(occupied.has(key)&&!reached.has(key)){reached.add(key);queue.push(next);}});}
        assert(reached.size===4,question.id+' contains a disconnected tetra-cube.');
        fromPieces.push.apply(fromPieces,piece.map(function(cube){return cube.join(',');}));
      });
      var fromMap=[];map.forEach(function(row,y){row.forEach(function(height,x){for(var z=0;z<height;z++)fromMap.push([x,y,z].join(','));});});
      assert(new Set(fromPieces).size===fromPieces.length&&equal(fromPieces.slice().sort(),fromMap.slice().sort()),question.id+' colored tetra-cubes must cover the shown stack exactly.');
      return {id:question.id,cubes:cubes,holes:holes,tetraCubes:question.answer};
    });

    var objectLengthChecks=bank['object-length-equivalence'].map(function(question){
      var p=question.payload,totals=p.rows.map(function(row){return row.items.reduce(function(total,item){return total+p.units[item];},0);});
      for(var index=0;index<totals.length;index+=2)assert(totals[index]===totals[index+1],question.id+' paired rows must have equal length.');
      var answer=p.query==='pencil-minus-two-erasers'?p.units.P-2*p.units.E:p.units.P;
      assert(answer===question.answer,question.id+' has an incorrect object-length answer.');
      assert(/연필/.test(question.problemHtml)&&/지우개/.test(question.problemHtml)&&/클립/.test(question.problemHtml),question.id+' must visibly use pencil, eraser, and paperclips.');
      return {id:question.id,relations:totals.length/2,answer:answer};
    });

    var blockBuildChecks=bank['block-build-count'].map(function(question){
      var p=question.payload,total=p.width*p.depth*p.height,bKeys=[];
      p.bPieces.forEach(function(piece){assert(piece.length===2,question.id+' B block must contain two cubes.');piece.forEach(function(cube){bKeys.push(cube.join(','));});});
      assert(new Set(bKeys).size===bKeys.length,question.id+' B blocks must not overlap.');
      var answer={A:total-bKeys.length,B:p.bPieces.length};assert(equal(answer,question.answer),question.id+' has an incorrect A/B block count.');
      return {id:question.id,A:answer.A,B:answer.B};
    });

    var simplePathChecks=bank['simple-path-network'].map(function(question,index){
      var payload=question.payload,ids=new Set(payload.vertices.map(function(vertex){return vertex.id;}));
      var edges=new Set();
      payload.edges.forEach(function(edge){
        assert(edge.length===2&&ids.has(edge[0])&&ids.has(edge[1])&&edge[0]!==edge[1],question.id+' has an invalid edge.');
        var key=edge.slice().sort().join('|');assert(!edges.has(key),question.id+' has a duplicate edge.');edges.add(key);
      });
      var paths=enumerateSimplePaths(payload);
      var byFirst=paths.reduce(function(counts,path){var first=path[1];counts[first]=(counts[first]||0)+1;return counts;},{});
      var starts=Object.keys(byFirst).sort(function(left,right){return byFirst[right]-byFirst[left];});
      var branchCounts=starts.map(function(start){return byFirst[start];}).sort(function(left,right){return right-left;});
      assert(paths.length===question.answer,question.id+' has an incorrect simple-path count.');
      assert(equal(branchCounts,question.payload.branchCounts.slice().sort(function(left,right){return right-left;})),question.id+' branch subtotal is incorrect.');
      assert(payload.noRevisit===true&&payload.undirected===true,question.id+' must count undirected paths without revisiting a vertex.');
      assert(payload.edges.length-payload.vertices.length+1===index+3-(index===2?1:0),question.id+' has the wrong independent-cycle count.');
      return {id:question.id,vertices:payload.vertices.length,edges:payload.edges.length,paths:paths.length,branchCounts:branchCounts};
    });

    var rodChecks=bank['rod-subset-lengths'].map(function(question,index){
      var result=enumerateRodSums(question.payload.rods);
      assert(result.values.length===question.answer,question.id+' has an incorrect distinct-length count.');
      assert(equal(result.values,ROD_SPECS[index].solutionSums),question.id+' solution list does not match the independently enumerated subset sums.');
      assert(!/(정답|가능한 전체 길이|가지)/.test(question.problemHtml),question.id+' leaks an answer label into the student diagram.');
      return {
        id:question.id,
        nonemptySubsets:result.subsetCount,
        distinctLengths:result.values.length
      };
    });

    var shortestPathChecks=bank['shortest-path-grid'].map(function(question){
      var result=shortestPathCount(question.payload);assert(result.answer===question.answer,question.id+' has an incorrect shortest-path count.');
      assert(question.payload.directions.join(',')==='E,N',question.id+' must use only right and up moves.');
      return {id:question.id,answer:result.answer,blocked:question.payload.blocked.length};
    });

    var balanceChecks=bank['balance-substitution-pictures'].map(function(question){
      var p=question.payload;
      p.equations.forEach(function(equation){
        var weight=function(items){return items.reduce(function(total,item){return total+p.values[item.key]*item.count;},0);};
        assert(weight(equation.left)===weight(equation.right),question.id+' contains an unbalanced scale relation.');
      });
      var query=p.equations.filter(function(equation){return equation.query;});assert(query.length===1&&query[0].answer===question.answer,question.id+' must have one final query.');
      assert(question.problemHtml.indexOf('?')>=0&&question.problemHtml.indexOf('>'+question.answer+'개<')<0,question.id+' must not reveal the final scale answer.');
      return {id:question.id,equations:p.equations.length,answer:question.answer};
    });

    return {
      ok:true,
      familyCount:FAMILY_KEYS.length,
      questionCount:FAMILY_KEYS.reduce(function(total,key){return total+bank[key].length;},0),
      families:{
        'checker-stack-count':checkerChecks,
        'stack-box-fill':stackFillChecks,
        'stack-minimum-visible':minimumStackChecks,
        'congruent-marked-partition':partitionChecks,
        'net-colors-pair':netColorChecks,
        'net-pips-pair':netPipChecks,
        'dice-target-bottom':targetBottomChecks,
        'tetra-cube-hole-count':tetraCubeChecks,
        'object-length-equivalence':objectLengthChecks,
        'block-build-count':blockBuildChecks,
        'simple-path-network':simplePathChecks,
        'rod-subset-lengths':rodChecks,
        'shortest-path-grid':shortestPathChecks,
        'balance-substitution-pictures':balanceChecks
      }
    };
  }

  var api=Object.freeze({get:get,validate:validate,cloneDiceFinishVisibleFaces:cloneDiceFinishVisibleFaces});
  root.HFConceptReplacementSpecials=api;
  if(typeof module!=='undefined'&&module.exports){
    module.exports=api;
  }
})(typeof window!=='undefined'?window:globalThis);
