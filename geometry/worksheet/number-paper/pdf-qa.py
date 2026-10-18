"""Independently inspect every page in the generated vector QA PDFs."""
import argparse
import concurrent.futures
import json
from pathlib import Path
import re
import subprocess
import pdfplumber
from pypdf import PdfReader
from PIL import Image, ImageDraw

parser=argparse.ArgumentParser();parser.add_argument('--directory',required=True);parser.add_argument('--pdftoppm',default='pdftoppm');args=parser.parse_args()
root=Path(args.directory);manifest=json.loads((root/'pdf-manifest.json').read_text());plans={d['name']:d for d in json.loads((root/'print-plan.json').read_text())['documents']}
render=root/'render';render.mkdir(exist_ok=True);summary=[]
def inspect(doc):
    path=Path(doc['path']);reader=PdfReader(path);plan=plans[doc['name']]
    assert len(reader.pages)==len(plan['pages'])==len(doc['pages'])
    chars=0;answers=0
    with pdfplumber.open(path) as pdf:
        for index,(page,expected) in enumerate(zip(pdf.pages,plan['pages'])):
            assert abs(page.width-595.2756)<1 and abs(page.height-841.8898)<1
            text=page.extract_text() or ''
            if expected['kind']=='blank':assert not text.strip();continue
            assert 'GFIELD' in text and f'{index+1} / {len(reader.pages)}' in text
            assert not any(x in text for x in ['undefined','NaN','\ufffd'])
            for ch in page.chars:
                assert -1<=ch['x0']<=ch['x1']<=page.width+1,(path.name,index,ch)
                assert -1<=ch['top']<=ch['bottom']<=page.height+1,(path.name,index,ch)
                chars+=1
            for p in expected['entries']:
                if expected['kind'] in ['questions','answers']:assert f"{p['number']}." in text
                if expected['kind']=='answers':
                    assert f"{plan['text']['answer']} {p['solution']['answer']}" in text
                    f=p['solution']['finish'];eq=(f"{f['left']} + {f['number']}") if f['left'] else ' + '.join(map(str,p['solution']['numbers']));assert f"{eq} = {f['total']}" in text
                    answers+=1
            # Every diagram is vector geometry and embedded text, never a low-dpi image.
            assert not page.images,(path.name,index,'raster image')
    prefix=render/doc['name'];subprocess.run([args.pdftoppm,'-r','110','-png',str(path),str(prefix)],check=True,capture_output=True)
    images=sorted(render.glob(doc['name']+'-*.png'),key=lambda p:int(p.stem.rsplit('-',1)[1]));assert len(images)==len(plan['pages'])
    for index,image in enumerate(images):
        with Image.open(image) as im:
            rgb=im.convert('RGB');dark=sum(min(px)<150 for px in rgb.getdata())
            if plan['pages'][index]['kind']=='blank':assert dark<100
            else:assert 2000<dark<rgb.width*rgb.height*.45,(image.name,dark)
            if plan['pages'][index]['kind']=='questions':
                scale=110/25.4
                for row,_ in enumerate(plan['pages'][index]['entries']):
                    # Blank response cells must remain white, not inherit SVG arrow fill.
                    for r in range(4):
                        for c in range(4):
                            x=(155.25+(c+.5)*8.1)*scale;y=(40+row*122+32.25+(r+.5)*8.1)*scale
                            assert min(rgb.getpixel((round(x),round(y))))>240,(image.name,'filled response cell',r,c)
    return {'name':doc['name'],'pages':len(images),'boundedCharacters':chars,'answersChecked':answers,'vectorOnly':True,'rendered':[str(p) for p in images]}
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:summary=list(pool.map(inspect,manifest))
contacts=[]
for doc in summary:
    for start in range(0,len(doc['rendered']),4):
        canvas=Image.new('RGB',(1000,1450),'#dce2e8');draw=ImageDraw.Draw(canvas)
        for slot,p in enumerate(doc['rendered'][start:start+4]):
            with Image.open(p) as im:
                im.thumbnail((480,690));x=10+(slot%2)*500;y=25+(slot//2)*720;canvas.paste(im,(x,y));draw.text((x,y-18),Path(p).stem,fill='#182230')
        dest=root/(doc['name']+f'-contact-{start//4+1}.png');canvas.save(dest);contacts.append(str(dest))
result={'passed':True,'totalPages':sum(d['pages'] for d in summary),'documents':summary,'contactSheets':contacts}
(root/'pdf-validation.json').write_text(json.dumps(result,indent=2));print(json.dumps({'passed':True,'pages':result['totalPages'],'contacts':len(contacts),'boundedCharacters':sum(d['boundedCharacters'] for d in summary)}))
