"""Render every exported page and check page bounds; contact sheets still need human visual review."""
import argparse,json,subprocess,math,hashlib
from pathlib import Path
import pdfplumber
from pypdf import PdfReader
from PIL import Image,ImageDraw

parser=argparse.ArgumentParser();parser.add_argument('--directory',required=True);parser.add_argument('--pdftoppm',default='pdftoppm');options=parser.parse_args()
root=Path(options.directory);render=root/'render';render.mkdir(exist_ok=True)
manifest=json.loads((root/'pdf-manifest.json').read_text());report=[]
for record in manifest:
    pdf=root/record['file'];assert hashlib.sha256(pdf.read_bytes()).hexdigest()==record['sha256']
    reader=PdfReader(pdf);assert len(reader.pages)==record['pages']
    with pdfplumber.open(pdf) as document:
        chars=0
        for page in document.pages:
            assert abs(page.width-595.276)<1 and abs(page.height-841.89)<1
            assert not page.images,'Keep diagrams and text as vectors'
            for char in page.chars:
                assert char['x0']>=0 and char['x1']<=page.width and char['top']>=0 and char['bottom']<=page.height
                color=char.get('non_stroking_color')
                chars+=1
        for page in reader.pages:
            # ReportLab interprets the unsupported short form '#fff' as 0x000fff.
            assert b'0 .058824 1 rg' not in page.get_contents().get_data(),'Short hex produced blue holes'
    subprocess.run([options.pdftoppm,'-scale-to','1400','-png',str(pdf),str(render/pdf.stem)],check=True,capture_output=True)
    images=sorted(render.glob(pdf.stem+'-*.png'));assert len(images)==record['pages']
    contacts=[]
    for offset in range(0,len(images),6):
        contact=Image.new('RGB',(1500,1500),'#d9dce1');draw=ImageDraw.Draw(contact)
        for i,path in enumerate(images[offset:offset+6]):
            im=Image.open(path).convert('RGB');im.thumbnail((480,705));x=(i%3)*500+10;y=(i//3)*750+25;contact.paste(im,(x,y));draw.text((x,y-20),path.stem,fill='black')
        path=root/f'{pdf.stem}-contact-{offset//6+1}.jpg';contact.save(path,quality=92);contacts.append(path.name)
    report.append({'file':pdf.name,'pages':record['pages'],'chars':chars,'bounded':True,'vector':True,'sha256':record['sha256'],'contacts':contacts})
(root/'pdf-validation.json').write_text(json.dumps(report,ensure_ascii=False,indent=2));print(json.dumps(report,ensure_ascii=False))
