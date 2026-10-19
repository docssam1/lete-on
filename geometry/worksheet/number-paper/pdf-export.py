"""Build vector QA PDFs from the browser's exported page/diagram plan.

No browser automation. The website's native Print remains its user-facing path.
Use --font to provide an installed, licensed TrueType font with Korean glyphs.
"""
import argparse
import io
import json
import re
from pathlib import Path
import xml.etree.ElementTree as ET
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor as _HexColor
from reportlab.lib.units import mm
from reportlab.lib.pagesizes import A4

parser=argparse.ArgumentParser()
parser.add_argument('--plan',required=True)
parser.add_argument('--font',default='/System/Library/Fonts/Supplemental/AppleGothic.ttf')
options=parser.parse_args()
pdfmetrics.registerFont(TTFont('Paper',options.font))
W,H=A4
INK='#182230'
def HexColor(value):
    # CSS SVG permits #fff; ReportLab otherwise treats it as 0x000fff.
    if value.startswith('#') and len(value)==4:value='#'+''.join(c*2 for c in value[1:])
    return _HexColor(value)
class PaperPDF:
    def __init__(self,path):
        self.c=canvas.Canvas(str(path),pagesize=A4,pageCompression=1)
        self.c.setTitle('GFIELD Number Paper Worksheet')
        self.boxes=[]
    def line(self,x,y,x2,y2,color='#bac3ce',width=.6):
        self.c.setStrokeColor(HexColor(color));self.c.setLineWidth(width);self.c.line(x*mm,H-y*mm,x2*mm,H-y2*mm)
    def text(self,text,x,y,size=10,width=None,color=INK):
        lines=['']
        for char in str(text):
            if char=='\n':lines.append('');continue
            if width and pdfmetrics.stringWidth(lines[-1]+char,'Paper',size)>width*mm:lines.append(char)
            else:lines[-1]+=char
        for n,value in enumerate(lines):
            top=y*mm+n*size*1.5
            self.c.setFillColor(HexColor(color));self.c.setFont('Paper',size);self.c.drawString(x*mm,H-top-size,value)
            self.boxes.append({'text':value,'left':x*mm,'top':top,'right':x*mm+pdfmetrics.stringWidth(value,'Paper',size),'bottom':top+size*1.3})
        return y+len(lines)*size*1.5/mm
    def svg(self,source,x,y,width,height):
        c=self.c;c.saveState();c.translate(x*mm,H-y*mm);c.scale(width*mm/200,-height*mm/166)
        def draw(node):
            tag=node.tag.rsplit('}',1)[-1];a=node.attrib
            if tag in ['defs','pattern']:return
            c.saveState()
            if tag=='svg' and a.get('x') is not None:
                vb=list(map(float,a.get('viewBox','0 0 100 100').split()));c.translate(float(a['x']),float(a.get('y',0)));c.scale(float(a['width'])/vb[2],float(a['height'])/vb[3])
            for name,raw in re.findall(r'(translate|scale|rotate)\(([^)]*)\)',a.get('transform','')):
                values=[float(v) for v in re.split('[, ]+',raw.strip())]
                if name=='translate':c.translate(values[0],values[1] if len(values)>1 else 0)
                elif name=='scale':c.scale(values[0],values[1] if len(values)>1 else values[0])
                else:
                    if len(values)==3:c.translate(values[1],values[2]);c.rotate(values[0]);c.translate(-values[1],-values[2])
                    else:c.rotate(values[0])
            stroke=a.get('stroke','none');fill=a.get('fill','none')
            if stroke!='none':c.setStrokeColor(HexColor(stroke));c.setLineWidth(float(a.get('stroke-width',1)))
            if fill not in ['none'] and not fill.startswith('url'):c.setFillColor(HexColor(fill))
            if 'stroke-dasharray' in a:c.setDash(list(map(float,a['stroke-dasharray'].split())))
            if tag=='rect':
                px,py,pw,ph=[float(a.get(k,0)) for k in ['x','y','width','height']]
                hatch=fill.startswith('url')
                if hatch:c.setFillColor(HexColor('#fff'))
                c.rect(px,py,pw,ph,stroke=int(stroke!='none'),fill=int(fill!='none'))
                if hatch:
                    c.saveState();clip=c.beginPath();clip.rect(px,py,pw,ph);c.clipPath(clip,stroke=0);c.setStrokeColor(HexColor('#5e3542'));c.setLineWidth(1.3)
                    for i in range(-40,80,7):c.line(px+i,py+ph,px+i+ph,py)
                    c.restoreState()
            elif tag=='path':
                tokens=re.findall(r'[A-Za-z]|-?\d+(?:\.\d+)?',a.get('d',''));path=c.beginPath();i=0;cmd=None;cx=cy=0
                while i<len(tokens):
                    if tokens[i].isalpha():cmd=tokens[i];i+=1
                    if cmd in ['M','L']:
                        cx,cy=map(float,tokens[i:i+2]);i+=2
                        (path.moveTo if cmd=='M' else path.lineTo)(cx,cy);cmd='L'
                    elif cmd=='H':cx=float(tokens[i]);i+=1;path.lineTo(cx,cy)
                    elif cmd=='V':cy=float(tokens[i]);i+=1;path.lineTo(cx,cy)
                    elif cmd=='C':
                        values=list(map(float,tokens[i:i+6]));i+=6;path.curveTo(*values);cx,cy=values[-2:]
                    elif cmd=='Z':path.close();cmd=None
                    else:raise ValueError('Unsupported vector path: '+str(cmd))
                c.setLineCap(1);c.setLineJoin(1);c.drawPath(path,stroke=int(stroke!='none'),fill=int(fill!='none'))
            elif tag=='text':
                px,py=float(a['x']),float(a['y']);size=float(a.get('font-size',22));c.translate(px,py);c.scale(1,-1);c.setFont('Paper',size)
                value=''.join(node.itertext());c.setFillColor(HexColor(a.get('fill',INK)));c.drawCentredString(0,0,value)
            else:
                for child in node:draw(child)
            c.restoreState()
        draw(ET.fromstring(source));c.restoreState()
    def page(self,page,doc):
        self.boxes=[];t=doc['text'];kind=page['kind']
        if kind=='blank':self.c.showPage();return {'kind':kind,'boxes':[],'ids':[]}
        title=t['title'] if kind=='questions' else t['quickTitle'] if kind=='quick' else t['teacher']
        self.text('GFIELD',12,12,14,color='#2456c4');self.text(title,43,12,15,width=155)
        self.text(t['name']+' ____________     '+t['date']+' __________',12,24,10)
        self.line(12,34,198,34,color='#566274')
        if kind=='quick':
            self.text(t['question'],14,42,11);self.text(t['activity'],43,42,11);self.text(t['answer'],160,42,11)
            for n,p in enumerate(page['entries']):
                y=53+n*9;self.text(str(p['number']),14,y,11);self.text(p['label'],43,y,11);self.text(str(p['solution']['answer']),160,y,12);self.line(12,y+7,198,y+7)
        else:
            for index,p in enumerate(page['entries']):
                y=40+index*122;self.text(str(p['number'])+'. '+p['label'],12,y,13)
                if kind=='answers':self.text(t['answer']+' '+str(p['solution']['answer']),164,y,12)
                self.text(p['prompt'] if kind=='questions' else t['hint'],12,y+10,10,width=185)
                if kind=='questions':
                    for n,f in enumerate(p['questionFigures']):
                        x=12+n*47;self.text(f['label'],x,y+20,8.5,width=45);self.svg(f['svg'],x,y+30,45,37.35)
                    self.text(t['calc'],12,y+73,10,width=185);self.text(t['working'],12,y+82,9,color='#566274');self.line(12,y+94,198,y+94);self.line(12,y+101,198,y+101)
                    self.text(t['sum'],156,y+106,11);self.c.setStrokeColor(HexColor('#566274'));self.c.setLineWidth(1);self.c.rect(170*mm,H-(y+115)*mm,28*mm,9*mm,stroke=1,fill=0)
                else:
                    for n,f in enumerate(p['answerFigures']):
                        x=12+n*34.5;self.text(f['label'],x,y+22,8.5,width=32.5);self.svg(f['svg'],x,y+35,32.5,26.975)
                    sol=p['solution'];x=86;line_y=self.text(t['basket'],x,y+22,10,width=112);line_y=self.text(' + '.join(map(str,sol['numbers'])),x,line_y+1,10,width=112)
                    line_y=self.text(t['makeTen'] if sol['groups'] else t['direct'],x,line_y+3,10,width=112)
                    for group in sol['groups']:
                        value=' + '.join(map(str,group['terms']))+' = 10'
                        for whole,a,b in group['splits']:value+='  ('+t['split']+': '+str(whole)+' = '+str(a)+' + '+str(b)+')'
                        line_y=self.text(value,x,line_y+1,9.5,width=112)
                    f=sol['finish'];equation=(str(f['left'])+' + '+str(f['number'])) if f['left'] else ' + '.join(map(str,sol['numbers']));self.line(x,line_y+3,198,line_y+3,color='#566274');self.text(equation+' = '+str(f['total']),x,line_y+6,13,width=112)
                self.line(12,y+118,198,y+118)
        self.line(12,279,198,279);self.text('GFIELD · PAPER THINKING',12,282,9,color='#566274');self.text(str(page['number'])+' / '+str(page['total']),184,282,9,color='#566274')
        result={'kind':kind,'boxes':self.boxes,'ids':[p['id'] for p in page['entries']]};self.c.showPage();return result

plan=Path(options.plan);data=json.loads(plan.read_text());manifest=[]
for doc in data['documents']:
    path=plan.parent/(doc['name']+'.pdf');pdf=PaperPDF(path);pages=[pdf.page(p,doc) for p in doc['pages']];pdf.c.save();manifest.append({'name':doc['name'],'path':str(path),'mode':doc['mode'],'ids':doc['ids'],'pages':pages})
(plan.parent/'pdf-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2))
print(json.dumps([{'name':d['name'],'pages':len(d['pages'])} for d in manifest]))
