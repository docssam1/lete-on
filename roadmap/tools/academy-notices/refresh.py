"""Roadmap board feed. Approved public lists only; no post bodies or student data.
Shared maths sources reuse the existing 17:00 KST collector. Dates are reviewed
in curated.json, never guessed from a month/day or a title's course level.
"""
import argparse
import concurrent.futures
import datetime as dt
import hashlib
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from zoneinfo import ZoneInfo

HERE=Path(__file__).resolve().parent
ROOT=HERE.parents[2]
CONFIG=HERE/'sources.json'
OUTPUT=ROOT/'roadmap/demo2/data/academy-notices.json'
SHARED=ROOT/'highschool-selection/data/academy-notices.js'
KST=ZoneInfo('Asia/Seoul')
LIMIT=2_000_000
UA='Mozilla/5.0 (compatible; GFIELD-Notice-Monitor/1.0; +https://lete-on.gfieldacademy.net/roadmap/)'

def plain(s):
    return re.sub(r'\s+',' ',html.unescape(re.sub(r'<[^>]*>',' ',s or ''))).strip()

def canonical(url):
    p=urllib.parse.urlsplit(html.unescape(url));q=[(k,v) for k,v in urllib.parse.parse_qsl(p.query) if k not in {'page','fromRss','trackingCode'} and not k.startswith('utm_')]
    return urllib.parse.urlunsplit((p.scheme,p.netloc,p.path,urllib.parse.urlencode(sorted(q)),''))

def published_date(text):
    m=re.search(r'(?:등록일|작성일|게시일)[^0-9]{0,80}((?:20)?[0-9]{2})[./-]([0-9]{1,2})[./-]([0-9]{1,2})',text)
    if not m:return None
    y,mo,d=map(int,m.groups());y=2000+y if y<100 else y
    try:return dt.date(y,mo,d).isoformat()
    except ValueError:return None

def safe_url(url,allowed):
    try:
        p=urllib.parse.urlsplit(html.unescape(url))
        if p.scheme!='https' or p.hostname not in allowed or p.username or p.password or p.port not in (None,443):return ''
        return urllib.parse.urlunsplit((p.scheme,p.netloc,p.path,p.query,''))
    except ValueError:return ''

def fetch(url,allowed):
    if not safe_url(url,allowed):raise ValueError('unapproved URL')
    class Redirect(urllib.request.HTTPRedirectHandler):
        def redirect_request(self,req,fp,code,msg,headers,newurl):
            if not safe_url(newurl,allowed):raise ValueError('unapproved redirect')
            return super().redirect_request(req,fp,code,msg,headers,newurl)
    with urllib.request.build_opener(Redirect()).open(urllib.request.Request(url,headers={'User-Agent':UA}),timeout=12) as r:
        body=r.read(LIMIT+1)
        if len(body)>LIMIT:raise ValueError('source too large')
        encoding=r.headers.get_content_charset() or 'utf-8'
        return body,encoding

def kind(title):
    if re.search(r'성적우수|수상자|합격자.?명단|채용|개인별|개인정보|개인 정보',title):return None
    if re.search(r'설명회|간담회|오리엔테이션',title):return 'seminar'
    if re.search(r'테스트|시험|입학전형|응시',title) and not re.search(r'테스트.?없|시험.?없|진행하지',title):return 'test'
    if re.search(r'입학|모집|접수|예약',title):return 'admission'
    if re.search(r'개강|특강|시간표|휴원|휴강|변경|공지|방학|새로운 시작',title):return 'notice'
    return None

class Anchors(HTMLParser):
    def __init__(self):super().__init__(convert_charrefs=True);self.current=None;self.links=[];self.skip=0
    def handle_starttag(self,tag,attrs):
        if tag in ('script','style'):self.skip+=1
        if tag=='a':
            a=dict(attrs);href=a.get('href','')
            if re.fullmatch(r'\d+',a.get('board_seq','')) and 'a_notice_detail' in a.get('class','').split():href='/customer/notice/detail?board_seq='+a['board_seq']
            self.current=[href,'']
        if tag=='img' and self.current:self.current[1]+=' '+dict(attrs).get('alt','')
    def handle_data(self,data):
        if self.current and not self.skip:self.current[1]+=data
    def handle_endtag(self,tag):
        if tag in ('script','style'):self.skip=max(0,self.skip-1)
        if tag=='a' and self.current:self.links.append(self.current);self.current=None

def collect(source,academy,now,fetcher=fetch):
    host=urllib.parse.urlsplit(source['url']).hostname
    allowed={host,host[4:] if host.startswith('www.') else 'www.'+host}
    url=source['url']
    if source['kind']=='rss':url='https://rss.blog.naver.com/'+source['blog']+'.xml';allowed={'rss.blog.naver.com'}
    raw,encoding=fetcher(url,allowed)
    result=[]
    def add(title,url,published=None):
        title=plain(title)[:180];category=kind(title);url=canonical(url)
        if not category or len(title)<8 or not safe_url(url,{host,host[4:] if host.startswith('www.') else 'www.'+host}):return
        if published:
            try:
                age=(now.date()-dt.date.fromisoformat(published)).days
                if age>120 or age<0:return
            except ValueError:return
        stages=[x for x in academy['stages'] if not(category=='test' and x=='preschool')]
        if not stages:return
        result.append({'id':'auto-'+hashlib.sha256((academy['id']+'|'+url).encode()).hexdigest()[:18],
            'academy':academy['id'],'branch':next(iter(re.findall(r'대치|분당|목동|서초|송파|일산|잠실|수지',title)),source['branch']),'sourceId':source['id'],'kind':category,
            'title':title,'url':url,'publishedAt':published,'checkedAt':now.date().isoformat(),'stages':stages,
            'events':[],'scheduleText':'','dateStatus':'unconfirmed','origin':'official-list'})
    if source['kind']=='rss':
        if b'<!DOCTYPE' in raw.upper() or b'<!ENTITY' in raw.upper():raise ValueError('unsupported XML declaration')
        channel=ET.fromstring(raw).find('channel')
        if channel is None or source['identity'] not in (channel.findtext('title') or ''):raise ValueError('channel identity changed')
        for x in channel.findall('item')[:40]:
            try:published=parsedate_to_datetime(x.findtext('pubDate')).astimezone(KST).date().isoformat()
            except (TypeError,ValueError):published=None
            add(x.findtext('title'),x.findtext('link') or '',published)
    else:
        text=raw.decode(encoding,errors='replace');p=Anchors();p.feed(text)
        for href,title in p.links:
            target=urllib.parse.urljoin(source['url'],href)
            # Require a distinct article, never publish menus as a new notice.
            if not re.search(r'(?:wr_id|num|idx|seq|b_idx|no|id)=\d+|/(?:notice|news|board)/\d+',target,re.I):continue
            if source['kind']=='soma':
                stamp=re.search(r'20\d{2}\.\d{2}\.\d{2}',title)
                published=stamp.group().replace('.','-') if stamp else None
                title=title[:stamp.start()].strip() if stamp else title
            else:
                try:
                    article,enc=fetcher(target,allowed);published=published_date(plain(article.decode(enc,errors='replace')))
                except Exception:published=None
            add(title,target,published)
            if len(result)>=10:break
    if not result:raise ValueError('no readable notice entries')
    return result[:12]

def read_shared(path):
    marker='globalThis.HIGHSELECT_ACADEMY_NOTICES = '
    text=path.read_text(encoding='utf-8')
    if marker not in text:raise ValueError('unexpected shared feed')
    return json.loads(text.split(marker,1)[1].strip().removesuffix(';'))

def build(config,previous,shared,curated,now,fetcher=fetch):
    today=now.date().isoformat();academies={a['id']:a for a in config['academies']};items=[];sources=[]
    old_sources={s['id']:s for s in previous.get('sources',[])}
    for code,aid in config['sharedMap'].items():
        for s in shared.get('sources',[]):
            if s.get('academy')==code:sources.append({'id':s['id'],'academy':aid,'url':s['url'],'branch':s['branch'],'checkedAt':s.get('checkedAt'),'lastSuccessAt':s.get('lastSuccessAt'),'status':s.get('status','delayed')})
        for x in shared.get('items',[]):
            if x.get('academy')!=code:continue
            if not safe_url(x.get('url',''),{'blog.naver.com','apply.dailystudy.com'}):continue
            items.append({'id':'shared-'+x['id'],'academy':aid,'branch':x['branch'],'sourceId':x['sourceId'],
                'kind':x['category'],'title':x['title'],'url':canonical(x['url']),'publishedAt':x.get('publishedAt'),
                'checkedAt':next((s.get('checkedAt') for s in sources if s['id']==x['sourceId']),None),
                'stages':academies[aid]['stages'],'events':[{'label':'일정','date':x['eventDate']}] if x.get('eventDate') else [],
                'scheduleText':x.get('scheduleText',''),'dateStatus':'confirmed' if x.get('eventDate') else 'unconfirmed','origin':'shared-monitor'})
    def one(s):
        state={k:s[k] for k in ('id','academy','url','branch')};state['checkedAt']=today
        try:
            posts=collect(s,academies[s['academy']],now,fetcher);state.update(status='ok',lastSuccessAt=today);return state,posts
        except Exception:
            old=old_sources.get(s['id'],{});state.update(status='delayed',lastSuccessAt=old.get('lastSuccessAt'))
            return state,[x for x in previous.get('items',[]) if x.get('sourceId')==s['id'] and x.get('origin')=='official-list']
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        for state,posts in pool.map(one,config['sources']):sources.append(state);items.extend(posts)
    # Human-reviewed schedules override only the same article; new revisions never rewrite dates.
    for x in curated:
        x=dict(x);x['url']=canonical(x['url']);x['origin']='reviewed';aid=x['academy'];x['stages']=academies[aid]['stages'] if 'stages' not in x else x['stages']
        review=x.pop('review',{});x['scheduleCheckedAt']=None;x['sourceState']=None if review.get('kind')=='archived' else 'delayed'
        try:
            if review.get('kind')=='shared-revision':
                match=next((r for r in shared.get('items',[]) if canonical(r['url'])==x['url']),None)
                source=next((r for r in shared.get('sources',[]) if match and r['id']==match['sourceId']),{})
                if match and source.get('status')=='ok':x['sourceState']='unchanged' if match.get('revision')==review.get('expected') else 'changed';x['scheduleCheckedAt']=source.get('lastSuccessAt')
            elif review.get('kind')=='sha256':
                raw,_=fetcher(x['url'],{urllib.parse.urlsplit(x['url']).hostname})
                x['sourceState']='unchanged' if hashlib.sha256(raw).hexdigest()==review.get('expected') else 'changed';x['scheduleCheckedAt']=today
        except Exception:pass
        items=[old for old in items if not(old['academy']==aid and old['url']==x['url'])];items.append(x)
    seen={}
    for x in items:
        if x['academy'] in academies and isinstance(x.get('title'),str):seen[x['id']]=x
    return {'schemaVersion':1,'generatedAt':now.isoformat(timespec='seconds'),'academies':config['academies'],'sources':sources,'items':list(seen.values())}

def main():
    p=argparse.ArgumentParser();p.add_argument('--shared',type=Path,default=SHARED);p.add_argument('--output',type=Path,default=OUTPUT);args=p.parse_args()
    config=json.loads(CONFIG.read_text());previous=json.loads(args.output.read_text()) if args.output.exists() else {}
    # Missing shared collection fails the run before overwriting a previously good combined feed.
    shared=read_shared(args.shared);curated=json.loads((HERE/'curated.json').read_text())
    value=build(config,previous,shared,curated,dt.datetime.now(KST));args.output.parent.mkdir(parents=True,exist_ok=True)
    temp=args.output.with_suffix('.tmp');temp.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n');temp.replace(args.output)
    print(json.dumps({'items':len(value['items']),'sources':len(value['sources']),'delayed':sum(x['status']!='ok' for x in value['sources'])}))
if __name__=='__main__':main()
