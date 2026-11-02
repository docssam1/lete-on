"""Public notice monitor: fixed official sources, no model/API keys, no post bodies published."""
import argparse
import concurrent.futures
import datetime as dt
import hashlib
import html
import json
from pathlib import Path
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from zoneinfo import ZoneInfo

HERE = Path(__file__).resolve().parent
PROGRAM = HERE.parent.parent
MARKER = 'globalThis.HIGHSELECT_ACADEMY_NOTICES = '
BASE = 'https://apply.dailystudy.com'
KST = ZoneInfo('Asia/Seoul')
UA = 'LETE-ON Notice Monitor (+https://lete-on.gfieldacademy.net/highschool-selection/promo/)'
REGIONS = r'대치|분당|서초|송파|위례|광진|평촌|강동|목동|전국|부산|광교|수지'


def get(url):
    parsed = urllib.parse.urlsplit(url)
    if parsed.scheme != 'https' or parsed.hostname not in {'rss.blog.naver.com', 'apply.dailystudy.com'}:
        raise ValueError('Unapproved source URL')
    request = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(request, timeout=20) as response:
        if urllib.parse.urlsplit(response.url).hostname != parsed.hostname:
            raise ValueError('Unexpected source redirect')
        body = response.read(2_000_001)
        if len(body) > 2_000_000:
            raise ValueError('Source exceeds size limit')
        return body


def api(path, params):
    value = json.loads(get(BASE + path + '?' + urllib.parse.urlencode(params)))
    if value.get('success') is not True or not isinstance(value.get('data'), list):
        raise ValueError('Unexpected public API schema')
    return value['data']


def plain(value):
    # Blog authors also use literal angle brackets for course names; do not treat them as HTML.
    value = re.sub(r'<(?:br\s*/?|/p|/div|/li)>', '\n', value, flags=re.I)
    value = re.sub(r'</?(?:img|a|p|div|span|strong|b|em|i|ul|ol|li|table|tr|td)\b[^>]*>', ' ', value, flags=re.I)
    return re.sub(r'[ \t\r]+', ' ', html.unescape(value)).strip()


def branch_for(source, title, config):
    # Only an actual title prefix identifies a branch in a mixed channel.
    prefix = re.match(r'^\s*\[([^\]]+)\]', title)
    explicit = re.findall(REGIONS, prefix.group(1) if prefix else '')
    if not explicit:
        opening = re.match(r'^\s*(대치|분당|서초|송파|위례|광진|평촌)(?:점|관|본원|\s)', title)
        explicit = [opening.group(1)] if opening else []
    if source['branch'] == 'title':
        branches = explicit
    elif explicit:
        branches = [b for b in explicit if b == source['branch']]
    else:
        branches = [source['branch']]
    allowed = config['academyBranches'].get(source['academy'], config['branches'])
    return sorted(set(b for b in branches if b in allowed))


def category_for(title, body):
    if re.search('설명회|간담회', title):
        return 'seminar'
    if re.search('성적분포|성적 분포|샘플|견본|재원생|승/강급|강급|선생님|수업영상|위치|수강료', title):
        return None
    if re.search('테스트|시험|응시|입학전형|편입전형|입반전형', title):
        return 'test'
    if re.search('개강|모집|진도표|정규반 진도', title):
        return 'test' if re.search('테스트|입반시험|편입시험|입학시험', body) else 'admission'
    return None


def schedule_excerpt(body):
    # Quote only a short, explicitly labelled schedule. Never infer a year or read image pixels.
    if re.search('수정사항|수정공지|변경되었|→|마감된 상태', body[:250]):
        return ''
    match = re.search(r'(?:시험일시|시험일|입학테스트|편입시험|응시기간)\s*[:：]\s*([^\n■★*●◆]{4,160})', body)
    if not match or not re.search(r'\d\s*(?:/|월|시|:)', match.group(1)):
        return ''
    value = re.split(r'예약신청|응시예약|개강일|준비물|시험장소|시험범위|시험문제', match.group(1))[0]
    value = value.strip(' .·-')
    return value if 3 < len(value) <= 140 and not value.endswith('...') else ''


def rss_items(source, config, today, fetch=get):
    raw = fetch('https://rss.blog.naver.com/' + source['blog'] + '.xml')
    if b'<!DOCTYPE' in raw.upper() or b'<!ENTITY' in raw.upper():
        raise ValueError('Unsupported XML declaration')
    channel = ET.fromstring(raw).find('channel')
    if channel is None or source['identity'] not in html.unescape(channel.findtext('title') or ''):
        raise ValueError('Official channel identity changed')
    entries = channel.findall('item')
    if not entries:
        raise ValueError('Empty RSS channel; preserve previous data')
    output = []
    for entry in entries[:100]:
        title = plain(entry.findtext('title') or '')[:180]
        body = plain(entry.findtext('description') or '')
        category = category_for(title, body)
        branches = branch_for(source, title, config)
        if not category or not branches:
            continue
        link = urllib.parse.urlsplit(entry.findtext('link') or '')
        if link.scheme != 'https' or link.hostname != 'blog.naver.com' or not re.fullmatch('/' + re.escape(source['blog']) + r'/\d+', link.path):
            continue
        try:
            published = parsedate_to_datetime(entry.findtext('pubDate') or '').astimezone(KST).date()
        except (ValueError, TypeError, AttributeError):
            continue
        if published > today or (today - published).days > config['maxPostAgeDays']:
            continue
        url = urllib.parse.urlunsplit(('https', link.hostname, link.path, '', ''))
        for branch in branches:
            output.append({'id': source['id'] + '-' + link.path.rsplit('/', 1)[1] + '-' + branch,
                           'sourceId': source['id'], 'academy': source['academy'], 'branch': branch,
                           'category': category, 'title': title, 'url': url, 'publishedAt': published.isoformat(),
                           'eventDate': None, 'scheduleText': schedule_excerpt(body),
                           'revision': hashlib.sha256((title + '\n' + body).encode()).hexdigest()[:16]})
    return output


def dg_seminars(source, today, get_api=api):
    rows = get_api('/api/parent-seminar/sessions', {'acCode': source['acCode']})
    output = []
    for row in rows:
        if row.get('categoryCode') != source['acCode'] or row.get('categoryName') != source['branch']:
            continue
        when = row.get('ssDate', '')
        if not re.fullmatch(r'\d{4}-\d{2}-\d{2} \d{2}:\d{2}', when):
            raise ValueError('Unexpected seminar date')
        if dt.date.fromisoformat(when[:10]) < today or row.get('state') in ['취소', '종료', '삭제']:
            continue
        output.append({'id': source['id'] + '-' + str(row['ssKey']), 'sourceId': source['id'],
                       'academy': 'DG', 'branch': source['branch'], 'category': 'seminar',
                       'title': str(row['ssName'])[:180], 'url': source['url'], 'publishedAt': None,
                       'eventDate': when[:10], 'scheduleText': when + ' · ' + str(row.get('ssPlace', ''))[:80]})
    return output


def dg_tests(source, today, get_api=api):
    groups = {}
    for code, group, grades in [('E', '초등부', [4, 5, 6]), ('M', '중등부', [1, 2, 3]), ('H', '고등부', [1, 2, 3])]:
        for grade in grades:
            rows = get_api('/api/entrance-test/schedules', {'acCode': source['acCode'], 'schoolGroup': group, 'schoolYear': str(grade)})
            for row in rows:
                date = row.get('ltsDate', '')
                if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', date):
                    raise ValueError('Unexpected test date')
                if dt.date.fromisoformat(date) < today or str(row.get('ltsLimit')) == '0':
                    continue
                times = sorted(key[-4:-2] + ':' + key[-2:] for key, value in row.items()
                               if re.fullmatch(r'LTSTime\d{4}', key) and value == 'yes')
                if not times:
                    continue
                key = date + '|' + ','.join(times)
                groups.setdefault(key, {'date': date, 'times': times, 'grades': []})['grades'].append(group[0] + str(grade))
    output = []
    for key, row in sorted(groups.items()):
        grades = list(dict.fromkeys(row['grades']))
        output.append({'id': source['id'] + '-' + hashlib.sha256(key.encode()).hexdigest()[:12],
                       'sourceId': source['id'], 'academy': 'DG', 'branch': source['branch'], 'category': 'test',
                       'title': '·'.join(grades) + ' 입학테스트', 'url': source['url'], 'publishedAt': None,
                       'eventDate': row['date'], 'scheduleText': row['date'] + ' · ' + ' / '.join(row['times'])})
    return output[:12]


def read_previous(path):
    if not path.exists():
        return {'items': [], 'sources': []}
    return json.loads(path.read_text().split(MARKER, 1)[1].strip().removesuffix(';'))


def build(config, previous, today, collect=None):
    def collect_default(source):
        if source['kind'] == 'rss':
            return rss_items(source, config, today)
        if source['kind'] == 'dg-seminars':
            return dg_seminars(source, today)
        return dg_tests(source, today)
    collect = collect or collect_default
    old_sources = {x['id']: x for x in previous.get('sources', [])}
    items, statuses = [], []
    successes = 0
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        tasks = {pool.submit(collect, source): source for source in config['sources']}
        for task in concurrent.futures.as_completed(tasks):
            source = tasks[task]
            status = {key: source[key] for key in ['id', 'academy', 'branch', 'url']}
            status['checkedAt'] = today.isoformat()
            try:
                result = task.result()
                for item in result:
                    allowed = config['academyBranches'].get(item['academy'], config['branches'])
                    if item['branch'] not in allowed or item['sourceId'] != source['id']:
                        raise ValueError('Branch/source policy violation')
                items.extend(result)
                status.update(status='ok', lastSuccessAt=today.isoformat())
                successes += 1
            except Exception as exc:
                # An outage is never interpreted as removal of all earlier announcements.
                items.extend(x for x in previous.get('items', []) if x['sourceId'] == source['id'])
                status.update(status='delayed', lastSuccessAt=old_sources.get(source['id'], {}).get('lastSuccessAt'))
                print(source['id'] + ': ' + type(exc).__name__ + ': ' + str(exc)[:160], file=sys.stderr)
            statuses.append(status)
    if successes == 0:
        raise RuntimeError('All sources failed; refusing to replace the public feed')
    # Re-check carried-forward items too. A policy change must never preserve a forbidden branch.
    items = [x for x in items if x['branch'] in config['academyBranches'].get(x['academy'], config['branches'])]
    items = [x for x in items if (not x.get('eventDate') or x['eventDate'] >= today.isoformat()) and
             (not x.get('publishedAt') or (today - dt.date.fromisoformat(x['publishedAt'])).days <= config['maxPostAgeDays'])]
    unique = {x['id']: x for x in items}
    return {'schemaVersion': 1, 'checkedAt': today.isoformat(),
            'policy': {'branches': config['branches'], 'academyBranches': config['academyBranches']},
            'sources': sorted(statuses, key=lambda x: x['id']),
            'items': sorted(unique.values(), key=lambda x: (0, x['eventDate'], x['id']) if x.get('eventDate') else (1, -dt.date.fromisoformat(x['publishedAt']).toordinal(), x['id']))}


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, default=PROGRAM / 'data/academy-notices.js')
    args = parser.parse_args()
    config = json.loads((HERE / 'sources.json').read_text())
    result = build(config, read_previous(args.output), dt.datetime.now(KST).date())
    text = '// Generated from approved public channels. Do not add post bodies or personal data.\n' + MARKER + json.dumps(result, ensure_ascii=False, indent=2) + ';\n'
    changed = not args.output.exists() or args.output.read_text() != text
    if changed:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        temp = args.output.with_suffix('.tmp')
        temp.write_text(text)
        temp.replace(args.output)
    print(json.dumps({'changed': changed, 'items': len(result['items']), 'sources': {x['id']: x['status'] for x in result['sources']}}, ensure_ascii=False))


if __name__ == '__main__':
    main()
