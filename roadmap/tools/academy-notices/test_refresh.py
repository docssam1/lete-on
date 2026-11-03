import unittest
import datetime as dt
import hashlib
from zoneinfo import ZoneInfo
from refresh import safe_url,collect,build,canonical,published_date
NOW=dt.datetime(2026,11,3,20,tzinfo=ZoneInfo('Asia/Seoul'))
A={'id':'fields','name':'필즈','stages':['preschool','elementary'],'subject':'수학학원','url':'https://www.fieldsgood.co.kr/'}
S={'id':'fields-official','academy':'fields','url':'https://www.fieldsgood.co.kr/bbs/board.php?bo_table=notice','kind':'html','branch':'대치'}
C={'academies':[A],'sources':[S],'sharedMap':{}}
class NoticesTests(unittest.TestCase):
 def test_only_approved_https_urls(self):
  for bad in ['http://www.fieldsgood.co.kr','https://evil.example/notice','https://u:p@www.fieldsgood.co.kr/','javascript:alert(1)','https://www.fieldsgood.co.kr:8443/']:
   self.assertEqual(safe_url(bad,{'www.fieldsgood.co.kr'}),'')
 def test_publication_date_is_not_event_date(self):
  self.assertEqual(published_date('등록일 : 2026.10.06'),'2026-10-06')
  self.assertEqual(published_date('작성일 26-08-10'),'2026-08-10')
  self.assertIsNone(published_date('설명회는11월4일'))
  def fake(url,allowed):
   if 'wr_id' in url:return '등록일 : 2026.10.06'.encode(),'utf-8'
   return '<a href="/bbs/board.php?bo_table=notice&wr_id=1">2027 초등 신규모집 설명회</a>'.encode(),'utf-8'
  result=collect(S,A,NOW,fake)
  self.assertEqual(result[0]['events'],[]);self.assertEqual(result[0]['publishedAt'],'2026-10-06');self.assertEqual(result[0]['dateStatus'],'unconfirmed')
 def test_soma_official_article_link_and_publication(self):
  source={**S,'url':'https://soma1.somai.co.kr/customer/notice','kind':'soma'}
  def fake(*args):return '<a href="javascript:void(0);" class="a_notice_detail" board_seq="2638191">소마 새로운 시작<span>2026.07.22</span></a>'.encode(),'utf-8'
  row=collect(source,A,NOW,fake)[0]
  self.assertEqual(row['url'],'https://soma1.somai.co.kr/customer/notice/detail?board_seq=2638191')
  self.assertEqual(row['title'],'소마 새로운 시작');self.assertEqual(row['publishedAt'],'2026-07-22');self.assertEqual(row['events'],[])
 def test_preschool_test_is_not_promoted(self):
  def fake(url,allowed):return ('등록일 : 2026.10.06' if 'wr_id' in url else '<a href="/bbs/board.php?bo_table=notice&wr_id=1">초등 입학테스트 온라인 예약 재개</a>').encode(),'utf-8'
  result=collect(S,A,NOW,fake);self.assertEqual(result[0]['stages'],['elementary'])
 def test_failure_preserves_posts_and_last_success(self):
  old={'sources':[{'id':S['id'],'lastSuccessAt':'2026-11-02'}],'items':[{'id':'kept','academy':'fields','sourceId':S['id'],'origin':'official-list','title':'신규모집 안내','url':'https://www.fieldsgood.co.kr/bbs/board.php?bo_table=notice&wr_id=1'}]}
  def fail(*args):raise OSError('offline')
  result=build(C,old,{},[],NOW,fail)
  self.assertEqual(result['sources'][0]['lastSuccessAt'],'2026-11-02');self.assertEqual(result['sources'][0]['status'],'delayed');self.assertEqual(result['items'][0]['id'],'kept')
 def test_changed_source_does_not_rewrite_reviewed_dates(self):
  curated=[{'id':'reviewed','academy':'fields','title':'예비7세 입학안내','url':'https://fieldsgood.co.kr/guide.pdf','events':[{'label':'개강','date':'2027-01-04'}],'review':{'kind':'sha256','expected':hashlib.sha256(b'old').hexdigest()}}]
  def fake(url,allowed):
   if url.endswith('.pdf'):return b'new','utf-8'
   raise OSError()
  item=build({**C,'sources':[]},{},{},curated,NOW,fake)['items'][0]
  self.assertEqual(item['sourceState'],'changed');self.assertEqual(item['events'][0]['date'],'2027-01-04');self.assertNotIn('review',item)
 def test_canonical_article_deduplication(self):
  self.assertEqual(canonical('https://blog.naver.com/a/1?fromRss=true&trackingCode=rss'),'https://blog.naver.com/a/1')
  self.assertEqual(canonical('https://www.kiparang.co.kr/main/sub.html?Mode=view&num=220&page=&key='),'https://www.kiparang.co.kr/main/sub.html?Mode=view&num=220')
if __name__=='__main__':unittest.main()
