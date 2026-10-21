"""Create vector PDFs from the same paper coordinates and page plan as the web activity sheets."""
import argparse,json,hashlib
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm

ap=argparse.ArgumentParser();ap.add_argument('--plan',required=True);ap.add_argument('--font',default='/System/Library/Fonts/Supplemental/AppleGothic.ttf');options=ap.parse_args()
pdfmetrics.registerFont(TTFont('Paper',options.font));plan_path=Path(options.plan);plan=json.loads(plan_path.read_text());T=plan['text'];W,H=A4
COLORS=['#ffe394','#9ce0e8','#b8e6bc','#e6b8df','#bdbbfa','#ffc4a0','#a4d4fb','#d6e69b']

class Writer:
 def __init__(self,path):
  self.c=canvas.Canvas(str(path),pagesize=A4,pageCompression=1);self.c.setTitle('GFIELD 색종이 마술 활동지');self.records=[];self.text_boxes=[]
 def text(self,value,x,y,size=11,width=182,color='#182230',leading=1.4):
  lines=['']
  for char in str(value):
   if char=='\n':lines.append('');continue
   if pdfmetrics.stringWidth(lines[-1]+char,'Paper',size)>width*mm:lines.append(char)
   else:lines[-1]+=char
  for i,line in enumerate(lines):
   top=y*mm+i*size*leading;self.c.setFillColor(HexColor(color));self.c.setFont('Paper',size);self.c.drawString(x*mm,H-top-size,line);self.text_boxes.append({'text':line,'left':x*mm,'right':x*mm+pdfmetrics.stringWidth(line,'Paper',size),'top':top,'bottom':top+size*1.25})
  return y+len(lines)*size*leading/mm
 def line(self,x,y,x2,y2,color='#bbc5cf',width=.6):
  self.c.setStrokeColor(HexColor(color));self.c.setLineWidth(width);self.c.line(x*mm,H-y*mm,x2*mm,H-y2*mm)
 def rect(self,x,y,w,h,fill=None,dash=False):
  self.c.saveState();self.c.setStrokeColor(HexColor('#566274'));self.c.setLineWidth(.7)
  if fill:self.c.setFillColor(HexColor(fill))
  if dash:self.c.setDash(3,2)
  self.c.rect(x*mm,H-(y+h)*mm,w*mm,h*mm,fill=bool(fill),stroke=1);self.c.restoreState()
 def poly(self,poly,fill='#ffe394',stroke='#40546b',width=.003):
  p=self.c.beginPath();p.moveTo(poly[0]['x'],poly[0]['y'])
  for q in poly[1:]:p.lineTo(q['x'],q['y'])
  p.close();self.c.setFillColor(HexColor(fill));self.c.setStrokeColor(HexColor(stroke));self.c.setLineWidth(width);self.c.drawPath(p,fill=1,stroke=1);return p
 def diagram(self,panel,x,y,width,height):
  c=self.c;poly=panel.get('poly',[{'x':0,'y':0},{'x':1,'y':0},{'x':1,'y':1},{'x':0,'y':1}]);left=top=-.04;right=bottom=1.04
  if panel.get('pieces'):left=top=-.08;right=bottom=1.08
  if panel.get('zoom'):
   left=min(q['x'] for q in poly);right=max(q['x'] for q in poly);top=min(q['y'] for q in poly);bottom=max(q['y'] for q in poly);margin=max(right-left,bottom-top)*.07;left-=margin;right+=margin;top-=margin;bottom+=margin
  scale=min(width*mm/(right-left),height*mm/(bottom-top));padx=(width*mm-(right-left)*scale)/2;pady=(height*mm-(bottom-top)*scale)/2
  c.saveState();c.translate(x*mm+padx-left*scale,H-y*mm-pady+top*scale);c.scale(scale,-scale)
  if panel.get('papers'):
   for p in panel['papers']:self.poly(p['poly'],COLORS[p['color']])
   if panel.get('connection'):
    route=panel['connection'];path=c.beginPath();path.moveTo(route[0]['x'],route[0]['y'])
    for q in route[1:]:path.lineTo(q['x'],q['y'])
    c.setLineJoin(1);c.setStrokeColor(HexColor('#ffffff'));c.setLineWidth(.018);c.drawPath(path);c.setStrokeColor(HexColor('#2456c4'));c.setLineWidth(.007);c.drawPath(path)
   for p in panel['papers']:
    x=p['label']['x'];yy=p['label']['y'];c.setFillColor(HexColor(COLORS[p['color']]));c.circle(x,yy,.033,stroke=0,fill=1);self.ink(p['id'],x,yy+.018,.055,center=True)
  elif panel.get('pieces'):
   for p in panel['pieces']:self.poly(p,'#dcebf9')
  else:
   self.poly(poly,'#ffffff' if panel.get('blank') else '#fff0bc')
   clip=c.beginPath();clip.moveTo(poly[0]['x'],poly[0]['y'])
   for q in poly[1:]:clip.lineTo(q['x'],q['y'])
   clip.close();c.saveState();c.clipPath(clip,stroke=0,fill=0)
   for layer in panel.get('layers') or []:self.poly(layer['poly'],'#fff0bc' if layer['front'] else '#fff6d9',width=.0015)
   if panel.get('grid') or panel.get('gridSize'):
    size=4 if panel.get('grid') else panel['gridSize'];c.setStrokeColor(HexColor('#526273'));c.setLineWidth(.002)
    for i in range(1,size):c.line(i/size,0,i/size,1);c.line(0,i/size,1,i/size)
   for m in panel.get('marks',[]):
    if m['kind']=='circle':c.setFillColor(HexColor('#ffffff'));c.setStrokeColor(HexColor('#526273'));c.setLineWidth(.003);c.circle(m['center']['x'],m['center']['y'],m['radius'],stroke=1,fill=1)
    else:self.poly(m['poly'],'#ffffff')
   for seg in panel.get('cuts',[]):c.setStrokeColor(HexColor('#4f3548'));c.setLineWidth(.005);c.line(seg[0]['x'],seg[0]['y'],seg[1]['x'],seg[1]['y'])
   for label in panel.get('inkLabels',[]):self.ink(label['value'],label['point']['x'],label['point']['y'],.125,center=True,orientation=label.get('ink'),baseline=.025)
   c.restoreState()
   for seg in panel.get('creases',[]):
    c.saveState();c.setStrokeColor(HexColor('#596572'));c.setLineWidth(.004);c.setDash(.022,.015);c.line(seg[0]['x'],seg[0]['y'],seg[1]['x'],seg[1]['y']);c.restoreState()
   for i in panel.get('targets',[]):c.setStrokeColor(HexColor('#2456c4'));c.setLineWidth(.009);c.rect(i%4/4+.009,i//4/4+.009,.232,.232,fill=0,stroke=1)
  c.restoreState()
 def ink(self,value,x,y,size,center=False,orientation=None,baseline=0):
  self.c.saveState();self.c.translate(x,y)
  if orientation:self.c.transform(*orientation,0,0)
  self.c.translate(0,baseline);self.c.scale(1,-1);self.c.setFont('Paper',size);self.c.setFillColor(HexColor('#182230'));(self.c.drawCentredString if center else self.c.drawString)(0,0,str(value));self.c.restoreState()
 def figures(self,panels,x,y,width=182,columns=3,picture_height=37):
  if not panels:return y
  gap=4;cell=(width-gap*(columns-1))/columns
  for offset in range(0,len(panels),columns):
   row=panels[offset:offset+columns];caption=max(6,max(self.text(panel['label'],x+i*(cell+gap),y,8.5,cell)-y+1 for i,panel in enumerate(row)))
   for i,panel in enumerate(row):self.diagram(panel,x+i*(cell+gap),y+caption,cell,picture_height)
   y+=picture_height+caption+3
  return y
 def card(self,p,n,y,height,answers):
  start=y;y=self.text(f"{n}. {p['title']}",14,y,13)+1;y=self.text(p['task'],14,y,10.5)+2
  if p.get('conditionTop'):y=self.text(T['condition']+p['conditionTop'],14,y,11)+2
  if answers:
   panels=p['solutions'];ph=112 if p.get('connect') else 43 if p['complex'] else 34
   y=self.figures(panels,14,y,columns=1 if p.get('connect') else 3,picture_height=ph)+2
   for line in p['solutionLines']:y=self.text(line,14,y,11 if p['complex'] else 10.5)+1
   if p['family']=='reverse' and p.get('resultOptions'):
    correct=[{'label':o['key'].upper(),'poly':p['condition'][0]['poly'],'creases':[o['chord']]} for o in p['resultOptions'] if o['correct']];y=self.figures(correct,14,y,columns=2,picture_height=40)
  elif p.get('patternOptions'):
   y=self.figures(p['condition'],14,y,columns=3,picture_height=35)+2
   y=self.figures(p['replies'][:-1],14,y,columns=max(1,len(p['replies'])-1),picture_height=36)+3
   choices=[{'label':chr(65+i),'poly':p['condition'][0]['poly'],'marks':marks} for i,marks in enumerate(p['patternOptions'])]
   y=self.figures(choices,14,y,columns=3,picture_height=43)+3;y=self.text(T['answer']+' ______',14,y,11)
  elif p['family']=='stack':
   y=self.figures(p['condition'],14,y,columns=1,picture_height=112 if p.get('connect') else 59)+2
   if not p.get('connect'):
    y=self.text(T['cutouts'],14,y,11)+2
    for i,paper in enumerate(sorted(p['papers'],key=lambda p:p['id'])):
     px=21+(i%4)*45;py=y+(i//4)*49;w=(paper['poly'][1]['x']-paper['poly'][0]['x'])*90;h=(paper['poly'][2]['y']-paper['poly'][1]['y'])*90
     self.rect(px,py,w,h,COLORS[paper['color']],True);self.text(paper['id'],px+w/2-2,py+3,14,10)
    y+=100
   y=self.text(f"{T['topLabel']} _____     {T['bottomLabel']} _____",14,y,11)+2;y=self.text(T['bottomOrderLabel'] if p.get('build') else T['orderLabel'],14,y,10.5)+2
   for i in range(len(p['papers'])):self.rect(14+i*16,y,12,10)
   y+=11
  elif p['family']=='reverse':
   y=self.figures(p['condition'],14,y,columns=3,picture_height=48)+4
   if p.get('lineChoices'):
    choices=[{'label':c['key'].upper(),'poly':c['paper'],'creases':[c['chord']]} for c in p['lineChoices']];y=self.figures(choices,14,y,columns=3,picture_height=48)
   else:
    for i,o in enumerate(p['resultOptions']):self.rect(14+i*38,y,7,7);self.text(o['key'].upper(),23+i*38,y,13,15)
    y+=10
   self.text(T['working'],14,y+4,10);self.line(14,y+20,196,y+20);self.line(14,y+35,196,y+35);y+=36
  else:
   ph=38 if p['family']=='top' else 41 if p['complex'] else 35
   y=self.figures(p['condition'],14,y,columns=3,picture_height=ph)+2
   replies=[{**r,'blank':True} for r in p['replies']];columns=2 if p['family']=='top' else max(1,len(replies));ph=41 if p['family']=='top' else 48 if p['complex'] else 30
   y=self.figures(replies,14,y,columns=columns,picture_height=ph)+2
   if p['family']=='sort':y=self.text(f"{T['triangleCount']} _____      {T['rhombusCount']} _____      {T['totalPieces']} _____",14,y+5,11)
   elif p['family']=='number':self.text(T['working'],14,y,9);self.line(14,y+7,196,y+7);self.text(T['sum']+' ______',145,start+height-8,11,50);y+=13
   elif p['family']=='top':y=self.text(T['topNumber']+' ______',14,y,11)
  if y>start+height+1:raise ValueError(f"Card overflow: {p['id']} {y-start:.1f}mm > {height}mm")
  return y
 def page(self,page,doc):
  self.text_boxes=[];kind=page['kind']
  if kind=='blank':self.c.showPage();return {'kind':kind,'ids':[],'text_boxes':[]}
  title=T['title'] if kind=='questions' else T['quickTitle'] if kind=='quick' else T['teacher'];self.text('GFIELD',14,13,14,35,'#2456c4');self.text(title,48,13,16,148);self.text(T['name']+' ____________    '+T['date']+' __________',14,24,10);self.line(14,33,196,33,'#566274');lookup={p['id']:p for p in doc['entries']}
  if kind=='quick':
   for i,id in enumerate(page['entries']):
    p=lookup[id];n=doc['entries'].index(p)+1;y=41+i*36;self.text(n,14,y,12,9);self.text(p['title'],26,y,10.5,122);a=p['answer'];value=p['quickAnswer'];self.text(value,26,y+8,10.5,122)
    if a['kind']=='pattern':self.diagram(p['solutions'][0] if p.get('cutPlan') else {'poly':p['condition'][0]['poly'],'marks':a['stages'][-1]},158,y,34,34)
    self.line(14,y+35,196,y+35)
  else:
   per=len(page['entries']);height=233 if per==1 else 115
   for i,id in enumerate(page['entries']):p=lookup[id];self.card(p,doc['entries'].index(p)+1,40+i*120,height,kind=='answers')
  self.line(14,278,196,278);self.text('GFIELD · PAPER PLAY',14,282,8);self.text(f"{page['number']} / {page['total']}",177,282,8,19)
  record={'kind':kind,'ids':page['entries'],'text_boxes':self.text_boxes};self.c.showPage();return record

manifest=[]
for doc in plan['documents']:
 path=plan_path.parent/(doc['name']+'.pdf');writer=Writer(path);records=[writer.page(page,doc) for page in doc['pages']];writer.c.save();manifest.append({'file':path.name,'pages':len(records),'bytes':path.stat().st_size,'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'page_records':records})
(plan_path.parent/'pdf-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2));print(json.dumps([{'file':m['file'],'pages':m['pages'],'bytes':m['bytes']} for m in manifest],ensure_ascii=False))
