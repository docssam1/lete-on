import datetime as dt
import json
from pathlib import Path
import unittest
import refresh as monitor

TODAY = dt.date(2026, 11, 2)
CONFIG = json.loads((Path(__file__).parent / 'sources.json').read_text())
SOURCES = {s['id']: s for s in CONFIG['sources']}

class NoticeMonitorTests(unittest.TestCase):
    def test_mixed_channel_requires_title_branch_not_body_mentions(self):
        source = SOURCES['dp-blog']
        self.assertEqual(monitor.branch_for(source, '[서초 중등관] 개관 안내', CONFIG), [])
        self.assertEqual(monitor.branch_for(source, '개강 안내', CONFIG), [])
        self.assertEqual(monitor.branch_for(source, '[대치 중등관] 입반테스트', CONFIG), ['대치'])
        self.assertEqual(monitor.branch_for(source, '[분당관] 입반테스트', CONFIG), ['분당'])
        self.assertEqual(monitor.branch_for(source, '[대치 / 분당] 설명회', CONFIG), ['대치','분당'])

    def test_hwangso_never_accepts_bundang(self):
        source = SOURCES['sh-blog']
        self.assertEqual(monitor.branch_for(source, '[분당관] 입학시험 안내', CONFIG), [])
        self.assertEqual(monitor.branch_for(source, '분당 입학시험 안내', CONFIG), [])
        self.assertEqual(monitor.branch_for(source, '대치 입학시험 안내', CONFIG), ['대치'])

    def test_rss_checks_identity_date_topic_and_original_url(self):
        source = SOURCES['dp-blog']
        xml = b'''<rss><channel><title>\xeb\x8f\x8c\xed\x8c\x8c\xec\x88\x98\xed\x95\x99\xed\x95\x99\xec\x9b\x90</title><item><title>[\xeb\xb6\x84\xeb\x8b\xb9\xea\xb4\x80] \xec\x9e\x85\xed\x95\x99\xed\x85\x8c\xec\x8a\xa4\xed\x8a\xb8</title><link>https://blog.naver.com/dpmath/123?fromRss=true</link><pubDate>Mon, 02 Nov 2026 09:00:00 +0900</pubDate><description>test</description></item></channel></rss>'''
        rows = monitor.rss_items(source, CONFIG, TODAY, lambda _: xml)
        self.assertEqual(len(rows),1)
        self.assertEqual(rows[0]['branch'],'분당')
        self.assertEqual(rows[0]['url'],'https://blog.naver.com/dpmath/123')
        self.assertNotIn('description',rows[0])
        self.assertEqual(monitor.rss_items(source, CONFIG, TODAY + dt.timedelta(days=121), lambda _:xml),[])
        self.assertEqual(monitor.rss_items(source, CONFIG, TODAY-dt.timedelta(days=1), lambda _:xml),[])
        with self.assertRaises(ValueError):
            monitor.rss_items(source,CONFIG,TODAY,lambda _:xml.replace(source['identity'].encode(),b'other'))
        self.assertEqual(monitor.rss_items(source,CONFIG,TODAY,lambda _:xml.replace(b'blog.naver.com',b'evil.example')),[])

    def test_short_schedule_is_verbatim_and_modified_dates_are_not_inferred(self):
        self.assertEqual(monitor.schedule_excerpt('시험일: 11/14(토) 오전 9:30 ~ 12:50 *예약신청: 11/4'), '11/14(토) 오전 9:30 ~ 12:50')
        self.assertEqual(monitor.schedule_excerpt('수정공지 10/5 → 10/7 시험일: 10/5 오전 9:30'), '')
        self.assertEqual(monitor.category_for('중등 입학시험 성적분포',''), None)
        self.assertEqual(monitor.category_for('학부모 설명회 안내',''), 'seminar')

    def test_partial_outage_preserves_only_allowed_previous_items(self):
        config={**CONFIG,'sources':[SOURCES['sh-blog'],SOURCES['dp-blog']]}
        previous={'items':[{'id':'old','sourceId':'sh-blog','academy':'SH','branch':'대치','publishedAt':'2026-10-30'},
                           {'id':'forbidden','sourceId':'sh-blog','academy':'SH','branch':'분당'}],
                  'sources':[{'id':'sh-blog','lastSuccessAt':'2026-10-31'}]}
        def collect(source):
            if source['id']=='sh-blog':raise ValueError('temporary outage')
            return []
        data=monitor.build(config,previous,TODAY,collect)
        self.assertEqual([x['id'] for x in data['items']],['old'])
        status=next(x for x in data['sources'] if x['id']=='sh-blog')
        self.assertEqual(status['status'],'delayed')
        self.assertEqual(status['lastSuccessAt'],'2026-10-31')
        with self.assertRaises(RuntimeError):
            monitor.build({**config,'sources':[SOURCES['sh-blog']]},previous,TODAY,collect)

    def test_dg_requires_exact_academy_and_ignores_closed_dates(self):
        rows=[{'categoryCode':'master','categoryName':'대치','ssDate':'2026-11-24 11:00','ssKey':1,'ssName':'대치 설명회'},
              {'categoryCode':'bundang','categoryName':'분당','ssDate':'2026-11-24 11:00','ssKey':2,'ssName':'분당 설명회'},
              {'categoryCode':'master','categoryName':'대치','ssDate':'2026-10-24 11:00','ssKey':3,'ssName':'지난 설명회'}]
        result=monitor.dg_seminars(SOURCES['dg-daechi-seminars'],TODAY,lambda path,params:rows)
        self.assertEqual([x['id'] for x in result],['dg-daechi-seminars-1'])
        self.assertIsNone(result[0]['publishedAt'])
        calls=[]
        def api(path,params):
            calls.append(params)
            return [{'ltsDate':'2026-11-04','ltsLimit':'0','LTSTime1700':'yes'},
                    {'ltsDate':'2026-11-05','ltsLimit':'2','LTSTime1700':'yes'},
                    {'ltsDate':'2026-10-01','ltsLimit':'2','LTSTime1700':'yes'}]
        result=monitor.dg_tests(SOURCES['dg-bundang-tests'],TODAY,api)
        self.assertEqual(len(calls),9)
        self.assertTrue(all(x['acCode']=='bundang' for x in calls))
        self.assertEqual(len(result),1)
        self.assertEqual(result[0]['eventDate'],'2026-11-05')
        self.assertEqual(result[0]['branch'],'분당')

    def test_unapproved_fetch_is_rejected_before_network(self):
        for url in ['http://rss.blog.naver.com/dpmath.xml','https://example.com/test','https://127.0.0.1/']:
            with self.assertRaises(ValueError):monitor.get(url)

if __name__=='__main__': unittest.main()
