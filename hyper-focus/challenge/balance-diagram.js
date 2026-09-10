(function(root){
  'use strict';
  const ink='#42647a',metal='#dbe8f0';
  function fruit(kind,x,y,size){const k={apple:0,pear:1,berry:2,orange:3}[kind];return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${k%3*512} ${Math.floor(k/3)*512} 512 512" overflow="hidden"><image href="assets/exam-objects-illustration.png" width="1536" height="1024"/></svg>`;}
  const line=(x,y,u,v,width=2)=>`<path d="M${x} ${y}L${u} ${v}" fill="none" stroke="${ink}" stroke-width="${width}" stroke-linecap="round"/>`;
  function render(x,width,left,right,tilt=0){
    const center=x+width/2,lx=x+width*.18,rx=x+width*.82,ly=33+tilt,ry=33-tilt,half=width*.15;
    function pan(cx,beamY,items){
      const py=beamY+92,size=Math.min(46,(half*2-8)/items.length),gap=1,total=items.length*size+(items.length-1)*gap;
      const objects=items.map((kind,i)=>fruit(kind,cx-total/2+i*(size+gap),py-size+5,size)).join('');
      return `<g class="scale-pan" data-beam-y="${beamY}" data-pan-y="${py}">${objects}${line(cx,beamY+5,cx-half,py,1.5)}${line(cx,beamY+5,cx+half,py,1.5)}<circle cx="${cx}" cy="${beamY+3}" r="3" fill="white" stroke="${ink}" stroke-width="1.5"/><path d="M${cx-half} ${py}Q${cx-half+5} ${py+13} ${cx} ${py+13}Q${cx+half-5} ${py+13} ${cx+half} ${py}Z" fill="${metal}" stroke="${ink}" stroke-width="1.6"/></g>`;
    }
    return `<g class="proper-balance" data-tilt="${tilt}"><path d="M${center-5} 36H${center+5}V156H${center-5}Z" fill="#b7cfdd" stroke="${ink}" stroke-width="1.5"/><path d="M${center-6} 150L${center-22} 169H${center+22}L${center+6} 150Z" fill="${metal}" stroke="${ink}" stroke-width="1.8"/>${line(lx,ly,rx,ry,4)}<circle cx="${center}" cy="33" r="5" fill="#edf6fb" stroke="${ink}" stroke-width="2"/>${pan(lx,ly,left)}${pan(rx,ry,right)}</g>`;
  }
  const api=Object.freeze({render});root.HFChallengeBalance=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
