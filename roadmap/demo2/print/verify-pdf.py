#!/usr/bin/env python3
"""Check extracted content by table column; full-page reading order interleaves cells."""
import argparse,json,re
from pathlib import Path
import pdfplumber
ROOT=Path(__file__).resolve().parents[3]
p=argparse.ArgumentParser();p.add_argument('pdf',nargs='?',default='output/pdf/grade5-complete-roadmap.pdf');args=p.parse_args()
data=json.loads((ROOT/'tmp/pdfs/grade5/report.json').read_text());normalize=lambda s:re.sub(r'\s+','',s)
with pdfplumber.open(ROOT/args.pdf) as pdf:
 texts=[page.extract_text() or '' for page in pdf.pages];whole=normalize('\n'.join(texts))
 first=next(i for i,t in enumerate(texts) if '06 / COURSE DETAILS' in t)
 last=next(i for i,t in enumerate(texts) if '07 / CHECKPOINTS' in t)
 mm=72/25.4;regions=[(16*mm,0,60*mm,595),(60*mm,0,125*mm,595),(125*mm,0,281*mm,595)]
 cols=[normalize('\n'.join(page.crop(region).extract_text() or '' for page in pdf.pages[first:last])) for region in regions]
 missing=[]
 for row in data['report']['lanes']:
  for b in row['blocks']:
   for key,col in [('startLabel',0),('endLabel',0),('title',1),('method',2)]:
    if b.get(key) and normalize(b[key]) not in cols[col]:missing.append([row['id'],b['id'],key])
 for text in data['report']['front']['prose']+[a['text'] for a in data['report']['front']['priorities']]+data['report']['assumptions']+[q[k] for q in data['report']['questions'] for k in ['question','answer']]:
  if normalize(text) not in whole:missing.append(['prose',text[:45]])
 for entry in data['report']['admissions']:
  for row in entry['rows']:
   for key in ['completed','completedAt','ongoing','ongoingUntil']:
    if row.get(key) and normalize(row[key]) not in whole:missing.append(['admission',entry['id'],row['id'],key])
 assert not missing,missing
 assert '�' not in whole
 assert pdf.doc.catalog.get('Outlines'),'Missing PDF bookmarks'
 assert pdf.pages[0].images and any(page.images and '학기마다, 공부가 이어지는 시점.' in texts[i] for i,page in enumerate(pdf.pages)),'Missing cover/map images'
 assert all(abs(page.width-841.89)<1 and abs(page.height-595.276)<1 for page in pdf.pages),'Wrong print size'
 # Text must remain within the physical sheet, including running headers/footers.
 outside=[i+1 for i,page in enumerate(pdf.pages) if any(c['x0']<0 or c['x1']>page.width+.1 or c['top']<0 or c['bottom']>page.height+.1 for c in page.chars)]
 assert not outside,outside
 print(json.dumps({'pages':len(pdf.pages),'verifiedBlocks':sum(len(l['blocks']) for l in data['report']['lanes']),'months':len(data['plan']['months']),'questions':len(data['report']['questions']),'missing':missing,'outsidePage':outside},ensure_ascii=False))
