#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Build/import private CARS Plus D source data from the user's restored OCR ZIP.

This script intentionally contains NO textbook passage/question wording. It reads the
user's local OCR ZIP at runtime and can upsert the reconstructed private data into
Supabase lesson_content. Default is validation/dry-run; use --apply to write.
"""
from __future__ import annotations
import argparse, getpass, json, re, tempfile, urllib.request, zipfile
from pathlib import Path

BOOK_ID = "cars-level-d"
SUPABASE_URL_DEFAULT = "https://fgahqumaldheqettmvqg.supabase.co"

PAGE_GROUPS = {
    "cd1": [4,5,6], "cd2": [7,8,9], "cd3": [10,11,12], "cd4": [13,14,15], "cd5": [16,17,18],
    "cd6": [20,21,22,23], "cd7": [24,25,26,27], "cd8": [28,29,30,31], "cd9": [32,33,34,35],
    "cd10": [36,37,38,39], "cd11": [41,42,43], "cd12": [44,45,46], "cd13": [47,48,49],
    "cd14": [50,51,52], "cd15": [53,54,55],
}

# Answer letters only; no source wording is embedded here.
ANSWER_KEYS = {
    "cd1":  "CDABCCBDCBCB",
    "cd2":  "CBADBCBDBACB",
    "cd3":  "CBCDACACCADB",
    "cd4":  "BCDBCACDBDBC",
    "cd5":  "DCBCADBCDDBD",
    "cd6":  "BCCCBDCBABBB",
    "cd7":  "CBABBBDCDABA",
    "cd8":  "CBDCABCBCBAD",
    "cd9":  "BBBCACACDCCD",
    "cd10": "BCBBDCCCCDBA",
    "cd11": "DBCACDCBBDAB",
    "cd12": "BDCBCDBCDBDC",
    "cd13": "CDBCADBACBCB",
    "cd14": "CBDCBDCDBACC",
    "cd15": "ADCBBCCDBDDB",
}

SPECIAL = {
    "cd2": {3:"sequence"}, "cd3": {4:"cause-effect"}, "cd5": {2:"branch-map"},
    "cd6": {3:"sequence"}, "cd7": {4:"cause-effect"}, "cd10": {3:"sequence"},
    "cd13": {3:"sequence"}, "cd14": {3:"sequence"},
}

SYMS = ["Ⓐ","Ⓑ","Ⓒ","Ⓓ"]


def clean_md(s: str) -> str:
    s = re.sub(r'<!--.*?-->', '', s, flags=re.S)
    s = s.replace('<u>','').replace('</u>','')
    s = re.sub(r'!\[[^\]]*\]\([^)]*\)', '', s)
    s = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', s)
    s = s.replace('***','').replace('**','').replace('*','')
    s = re.sub(r'\s+', ' ', s).strip()
    return s


def quoted_paragraphs(page_text: str, poster: bool=False) -> list[str]:
    qlines=[]
    for ln in page_text.splitlines():
        if ln.startswith('>'):
            qlines.append(re.sub(r'^>\s?', '', ln).rstrip())
        elif qlines and ln.strip()=='' :
            qlines.append('')
    if not qlines:
        return []
    if poster:
        out=[]; i=0
        while i < len(qlines):
            t=qlines[i].strip()
            if not t: i+=1; continue
            if re.match(r'^\d+\.\s', t):
                parts=[t]; i+=1
                while i<len(qlines):
                    nxt=qlines[i].strip()
                    if not nxt: i+=1; continue
                    if re.match(r'^\d+\.\s', nxt) or nxt.upper()=='RULES' or re.search(r'time is running out',nxt,re.I):
                        break
                    parts.append(nxt); i+=1
                out.append(clean_md(' '.join(parts))); continue
            out.append(clean_md(t)); i+=1
        return [x for x in out if x]
    out=[]; cur=[]
    for ln in qlines:
        if not ln.strip():
            if cur:
                out.append(clean_md(' '.join(cur))); cur=[]
        else:
            cur.append(ln.strip())
    if cur: out.append(clean_md(' '.join(cur)))
    return [x for x in out if x]


def passage_title_and_instruction(first_page: str) -> tuple[str,str]:
    lines=first_page.splitlines(); instruction=''; title=''; seen_h1=False
    for ln in lines:
        if ln.startswith('# '): seen_h1=True; continue
        if seen_h1 and ln.strip() and not ln.startswith('#') and not ln.startswith('>') and not ln.startswith('!'):
            instruction=clean_md(ln); break
    for ln in lines:
        if ln.startswith('## '):
            h=clean_md(ln[3:])
            if h != 'Finding Main Idea': title=h
            break
    return title,instruction


def parse_options(block: str) -> tuple[str,list[str]]:
    positions=[]
    for sym in SYMS:
        m=re.search(re.escape(sym)+r'\s*',block)
        if not m: return clean_md(block), []
        positions.append((m.start(),m.end()))
    prompt=block[:positions[0][0]].strip(); choices=[]
    for i,(st,en) in enumerate(positions):
        end=positions[i+1][0] if i+1<len(positions) else len(block)
        choices.append(clean_md(block[en:end]))
    return prompt,choices


def table_rows(raw: str) -> list[list[str]]:
    rows=[]
    for ln in raw.splitlines():
        if not ln.strip().startswith('|'): continue
        cells=[clean_md(c) for c in ln.strip().strip('|').split('|')]
        if cells and all(re.fullmatch(r':?-{3,}:?',c.replace(' ','')) for c in cells if c): continue
        rows.append(cells)
    return rows


def strip_table(raw: str) -> str:
    return '\n'.join(ln for ln in raw.splitlines() if not ln.strip().startswith('|'))


def special_payload(kind: str, raw_prompt: str) -> dict:
    lines=raw_prompt.splitlines(); table_idx=[i for i,l in enumerate(lines) if l.strip().startswith('|')]
    before=''; after=''
    if table_idx:
        before=clean_md('\n'.join(lines[:min(table_idx)])); after=clean_md('\n'.join(lines[max(table_idx)+1:]))
    rows=table_rows(raw_prompt)
    if kind=='cause-effect':
        data=[]
        for r in rows:
            if any(c.lower()=='cause' for c in r) or any(c.lower()=='effect' for c in r): continue
            if any(c for c in r): data=r; break
        return {"before":before,"causeLabel":"Cause","effectLabel":"Effect","cause":data[0] if data else '',"effect":data[1] if len(data)>1 else '',"after":after}
    if kind=='branch-map':
        nonsep=[r for r in rows if any(c for c in r)]; root=''; children=[]
        if nonsep: root=next((c for c in nonsep[0] if c), '')
        if len(nonsep)>1: children=nonsep[-1][:]
        while len(children)<4: children.append('')
        return {"before":before,"root":root,"children":children[:4],"after":after}
    candidate=[]; best=-1
    for r in rows:
        vals=[]
        for c in r:
            c=re.sub(r'^→\s*','',c).strip()
            if c=='→' or re.fullmatch(r'\d+',c or ''): continue
            vals.append(c)
        alpha=sum(bool(re.search(r'[A-Za-z]',v)) for v in vals)
        if alpha>best: best=alpha; candidate=vals
    boxes=[v for v in candidate if v!='→']
    if len(boxes)<3: boxes += ['']*(3-len(boxes))
    if len(boxes)>3: boxes=boxes[:3]
    return {"before":before,"boxes":boxes,"after":after}


def parse_questions(all_text: str, cid: str) -> tuple[list[list],dict]:
    start=all_text.find('## Finding Main Idea')
    if start<0: raise ValueError(f'{cid}: Finding Main Idea not found')
    pat=re.compile(r'##\s+([^\n]+)\n\n\*\*(\d+)\.\*\*\s*(.*?)(?=\n\n##\s+|\Z)',re.S)
    found=pat.findall(all_text[start:])
    if len(found)!=12: raise ValueError(f'{cid}: expected 12 questions, found {len(found)}')
    key=ANSWER_KEYS[cid]
    if len(key)!=12: raise ValueError(f'{cid}: answer key length {len(key)}')
    out=[]; visual={}
    for strategy,num_s,body in found:
        num=int(num_s); raw_prompt,choices=parse_options(body)
        if len(choices)!=4: raise ValueError(f'{cid} q{num}: expected 4 choices, found {len(choices)}')
        kind=SPECIAL.get(cid,{}).get(num)
        if kind: visual[str(num)] = special_payload(kind, raw_prompt)
        out.append([clean_md(strategy),clean_md(strip_table(raw_prompt)),choices,key[num-1],"The passage supports this answer."])
    return out,visual


def parse_timeline(page25: str) -> list[dict]:
    items=[]
    for r in table_rows(page25):
        if len(r)<2 or r[0].lower()=='year' or not re.fullmatch(r'\d{4}',r[0]): continue
        items.append({"year":r[0],"text":r[1],"side":"top" if len(items)%2==0 else "bottom"})
    return items


def build_payload(zip_path: Path) -> dict:
    with tempfile.TemporaryDirectory() as td:
        with zipfile.ZipFile(zip_path) as z: z.extractall(td)
        root=Path(td); md_dir=next((p for p in [root/'md',root] if (p/'page_04.md').exists()),None)
        if not md_dir: raise FileNotFoundError('page_04.md not found in OCR ZIP')
        pages={p:(md_dir/f'page_{p:02d}.md').read_text(encoding='utf-8') for group in PAGE_GROUPS.values() for p in group}
        lessons={}
        for cid,plist in PAGE_GROUPS.items():
            combined='\n\n'.join(pages[p] for p in plist)
            q_start=min((i for i,p in enumerate(plist) if '## Finding Main Idea' in pages[p]), default=None)
            if q_start is None: raise ValueError(f'{cid}: question pages not found')
            passage=[]
            for p in plist[:q_start]: passage.extend(quoted_paragraphs(pages[p], poster=(cid=='cd12')))
            title,instruction=passage_title_and_instruction(pages[plist[0]])
            questions,visual=parse_questions(combined,cid)
            meta={"instruction":instruction,"title":title,"visualQuestions":visual}
            if cid=='cd7':
                timeline=parse_timeline(pages[25])
                if timeline: meta["media"]=[{"type":"timeline","render":"html-timeline","items":timeline}]
            lessons[cid]={"passage":passage,"questions":questions,"meta":meta}
        return {"bookId":BOOK_ID,"lessons":lessons}


def validate(payload: dict) -> list[str]:
    lines=[]; lessons=payload.get('lessons',{}); total_special=0
    if set(lessons)!=set(PAGE_GROUPS): raise ValueError(f'expected 15 lessons, got {len(lessons)}')
    for cid in sorted(lessons,key=lambda x:int(x[2:])):
        row=lessons[cid]; pc=len(row['passage']); qc=len(row['questions']); vc=len(row['meta'].get('visualQuestions',{})); total_special += vc
        if pc<1 or qc!=12: raise ValueError(f'{cid}: passage={pc}, questions={qc}')
        if vc != len(SPECIAL.get(cid,{})): raise ValueError(f'{cid}: special meta {vc} != expected {len(SPECIAL.get(cid,{}))}')
        lines.append(f'{cid}: passage paragraphs={pc}, questions={qc}, visualMeta={vc}')
    if total_special!=8: raise ValueError(f'expected 8 special visual questions, got {total_special}')
    return lines


def upsert(url: str,key: str,cid: str,row: dict):
    endpoint=url.rstrip('/')+'/rest/v1/lesson_content?on_conflict=book_id,lesson_id'
    body=json.dumps({"book_id":BOOK_ID,"lesson_id":cid,"original_passage":row['passage'],"original_questions":{"items":row['questions'],"meta":row['meta']}},ensure_ascii=False).encode('utf-8')
    req=urllib.request.Request(endpoint,data=body,method='POST',headers={'apikey':key,'Authorization':'Bearer '+key,'Content-Type':'application/json','Prefer':'resolution=merge-duplicates,return=minimal'})
    with urllib.request.urlopen(req,timeout=30) as resp:
        if resp.status not in (200,201,204): raise RuntimeError(f'{cid}: HTTP {resp.status}')


def main():
    ap=argparse.ArgumentParser(); ap.add_argument('zip',help='restored CARS D OCR ZIP path'); ap.add_argument('--apply',action='store_true'); ap.add_argument('--url',default=SUPABASE_URL_DEFAULT); ap.add_argument('--key',default='')
    args=ap.parse_args(); payload=build_payload(Path(args.zip)); lines=validate(payload)
    print('CARS D OCR package validation OK')
    for ln in lines: print(' ',ln)
    print(' total lessons=15, questions=180, special visual questions=8')
    if not args.apply:
        print('DRY-RUN only. No Supabase data changed. Re-run with --apply to upload.'); return
    key=args.key or getpass.getpass('Supabase Service Role Key: ')
    if not key: raise SystemExit('No key supplied')
    for i,cid in enumerate(sorted(payload['lessons'],key=lambda x:int(x[2:])),1):
        upsert(args.url,key,cid,payload['lessons'][cid]); print(f'{i}/15 {cid} uploaded')
    print('DONE. Refresh Reading World and run cars-d-check.html.')

if __name__=='__main__': main()
