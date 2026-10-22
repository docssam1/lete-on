# Rebuild read-only labels after verifying a reference source update.
# S1 uses the current root roadmap; S2-S4 retain the separate Drive Build 35 source.
import json,pathlib,hashlib,re,os
os.chdir(pathlib.Path(__file__).resolve().parents[2])
j=json.load(open('roadmap/v31/data/source-monthly.json'))
html=pathlib.Path('roadmap/index.html').read_text()
calc=html.split('  calc:[',1)[1].split('\n  ]',1)[0]
blocks=[]
for text,a,m,b,n in re.findall(r"B\('([^']*)','calc',(\d+),(\d+),(\d+),(\d+)\)",calc):
 label=re.sub('<[^>]*>',' ',text);label=' '.join(label.split())
 blocks.append((label,(int(a)-5)*12+int(m)-1,(int(b)-5)*12+int(n)-1))
assert len(blocks)==7
levels=re.findall(r"\{id:'(L\d)',cls:'[^']+',summary:'([^']+)',shift:(\d+)\}",html)
assert len(levels)==5
fmt=lambda m:f'{5+m//12}세 {m%12+1}월'
rows=[]
for level,summary,shift in levels:
 shift=int(shift)
 rows.append({'id':'current:'+level+':calc','section':'S1','source':'current','name':re.sub('<[^>]*>',' ',summary)+' · '+level,'note':'현행 roadmap/index.html의 연산과정. 원표의 나이는 한국 나이이며 5세 5월~7세 7월 바깥의 기간도 보존했습니다.','blocks':[{'label':label,'from':fmt(a+shift),'to':fmt(b+shift),'edge':False,'outside':a+shift<4 or b+shift>30} for label,a,b in blocks]})
for sec in j['sections']:
 if sec['id']=='S1':continue
 for r in sec['rows']:
  if 'arithmetic' not in r['tracks'] and not(sec['id'] in ('S3','S4') and r['group']=='수학'):continue
  rows.append({'id':r['id'],'section':sec['id'],'source':'build35','name':' '.join((r['group']+' '+r['category']).split('|')).strip(),'note':r['categoryNote'],'blocks':[{'label':b['label'].replace('|',' '),'from':sec['columns'][b['start']]['label'],'to':sec['columns'][b['end']]['label'],'edge':b['end']==len(sec['columns'])-1} for b in r['blocks'] if b['label']]})
source={'driveFolder':'https://drive.google.com/drive/folders/1yQvP_416MstDfmsm3oQI0iJ94jzYAAG_','sourceDoc':'1Tpcm6vWT00gDm4I3jxrE4pt6cKeevP1g','manifestId':'GFIELD-RESPONSIVE-ROUTES-9e40a17f9ad3885e','sourceSHA256':hashlib.sha256(pathlib.Path('roadmap/v31/data/source-monthly.json').read_bytes()).hexdigest(),'currentSHA256':hashlib.sha256(html.encode()).hexdigest(),'rows':rows}
pathlib.Path('number_magic/data/diagnostic-reference.js').write_text('/* Read-only reference labels: S1 from current ROAD_L0/LEVELS; S2-S4 from Drive Build 35. Versions stay distinct; no app-course equivalence or admission standard. */\nwindow.NM_DIAGNOSTIC_REFERENCE = '+json.dumps(source,ensure_ascii=False,separators=(',',':'))+';\n')
