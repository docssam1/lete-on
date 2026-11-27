"""Durable local recipes and verified items; client answers/markup never become authoring inputs."""
import copy
import json
import os
import sqlite3
from datetime import datetime, timezone
from functools import lru_cache
from contextlib import contextmanager
from pathlib import Path

from soma_generation_service import check_activation, vsha
from generation_dispatch import generate, version_for

W = Path(__file__).resolve().parent
O = W.parents[1]/'outputs'
DEFAULT_DB = W/'saved-bank/generated-items.private.sqlite3'
SCHEMA = 'gfield-generated-library/v1'
MODES = {'manual', 'domain', 'difficulty', 'spiral'}
MAX_ITEMS, MAX_SELECTION = 20000, 500

class LibraryError(Exception):
    def __init__(self, message, status=422):
        super().__init__(message)
        self.status = status

def path():
    return Path(os.environ.get('GFIELD_ITEM_LIBRARY_DB', str(DEFAULT_DB))).resolve()

@contextmanager
def connection():
    p = path()
    p.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(p, timeout=15)
    db.row_factory = sqlite3.Row
    db.executescript('''CREATE TABLE IF NOT EXISTS items(
        id TEXT PRIMARY KEY, payload TEXT NOT NULL, digest TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS state(id INTEGER PRIMARY KEY CHECK(id=1),
        revision INTEGER NOT NULL, worksheet TEXT NOT NULL);
        CREATE TABLE IF NOT EXISTS item_archive(archive_id TEXT PRIMARY KEY,
        source_id TEXT NOT NULL, payload TEXT NOT NULL, digest TEXT NOT NULL,
        archived_at TEXT NOT NULL, reason TEXT NOT NULL);
        INSERT OR IGNORE INTO state VALUES(1,0,'{"ids":[],"title":"","arrangement":"manual"}');''')
    try:
        with db:
            yield db
    finally:
        db.close()

def loads(text):
    def reject(value):
        raise ValueError('nonfinite')
    return json.loads(text, parse_constant=reject)

@lru_cache(maxsize=1)
def canonical(version):
    d = loads((O/'quantity-crossbook-bank.json').read_text())
    return {s['instanceId']:s for key in ['specimens','providerSpecimens','normalizationExamples','somaGeneratedVariants'] for s in d.get(key, [])}

def registry():
    p = O/'quantity-crossbook-bank.json'
    return canonical((p.stat().st_mtime_ns, p.stat().st_size))

def now():
    return datetime.now(timezone.utc).isoformat()

def portable_numbers(value):
    # JSON.stringify writes 15.0 as 15. Boolean values must still differ from 0/1.
    if type(value) is float and value.is_integer():
        return int(value)
    if isinstance(value,dict):
        return {k:portable_numbers(v) for k,v in value.items()}
    if isinstance(value,list):
        return [portable_numbers(v) for v in value]
    return value

def portable_hash(value):
    return vsha(portable_numbers(value))

def verified_recipe(item):
    if not isinstance(item, dict) or set(item) != {'typeId','parameters'}:
        raise LibraryError('유형과 문항 조건을 확인해 주세요.')
    result = generate(item['typeId'], item['parameters'])
    s, receipt = result['example'], result['receipt']
    s = loads(json.dumps(s,ensure_ascii=False))
    return dict(id=s['instanceId'], typeId=s['proposedTypeId'],
                parameters=receipt['parameters'], fingerprint=receipt['generatorBuildFingerprint'],
                example=s, savedAt=now())

def unpack(row, fingerprint):
    try:
        item = loads(row['payload'])
        if vsha(item) != row['digest'] or item['id'] != row['id']:
            raise ValueError('digest')
        if item['example']['instanceId'] != item['id']:
            raise ValueError('id')
    except (ValueError, KeyError, TypeError):
        return dict(id=row['id'], state='damaged', message='저장 기록을 확인하지 못했습니다. 보관 파일을 불러오거나 같은 조건으로 다시 만들어 주세요.')
    try:expected=version_for(item['typeId'])
    except (RuntimeError,OSError,KeyError):expected=None
    if item['fingerprint'] != expected:
        return dict(id=item['id'], typeId=item['typeId'], parameters=item['parameters'],
                    state='version-changed', message='생성 규칙이 바뀌었습니다. 이전 문항과 새 문항을 비교해 주세요.')
    return dict(item, state='ready')

def snapshot():
    fingerprint = check_activation()
    with connection() as db:
        db.execute('BEGIN')
        state = db.execute('SELECT * FROM state WHERE id=1').fetchone()
        items = [unpack(row, fingerprint) for row in db.execute('SELECT * FROM items ORDER BY rowid')]
        archived = db.execute('SELECT count(*) FROM item_archive').fetchone()[0]
    return dict(schema=SCHEMA, revision=state['revision'], fingerprint=fingerprint,
                items=items, worksheet=loads(state['worksheet']), archivedItems=archived)

def archive(db, row, reason):
    raw = dict(row)
    key = vsha(raw)
    db.execute('INSERT OR IGNORE INTO item_archive VALUES(?,?,?,?,?,?)',
        (key,row['id'],row['payload'],row['digest'],now(),reason))
    return key

def put(db, item):
    row = db.execute('SELECT * FROM items WHERE id=?', (item['id'],)).fetchone()
    if row:
        old = unpack(row, item['fingerprint'])
        if old['state'] == 'ready':
            # Same displayed question/response contract keeps its first verified recipe and ID.
            return old, False
        if old['state'] == 'version-changed':
            raise LibraryError('이전 저장 문항이 있습니다. 저장한 문제에서 변경 내용을 비교한 뒤 교체해 주세요.',409)
        archive(db,row,'damaged-record-before-explicit-repair')
    db.execute('INSERT INTO items VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET payload=excluded.payload,digest=excluded.digest',
               (item['id'],json.dumps(item,ensure_ascii=False),vsha(item)))
    return dict(item, state='ready'), True

def save_item(body):
    item = verified_recipe(body)
    with connection() as db:
        db.execute('BEGIN IMMEDIATE')
        stored, changed = put(db, item)
        if changed:
            db.execute('UPDATE state SET revision=revision+1 WHERE id=1')
        rev = db.execute('SELECT revision FROM state WHERE id=1').fetchone()[0]
    return dict(item=stored, revision=rev, duplicate=not changed)

def worksheet(value, known):
    if not isinstance(value, dict) or set(value) != {'ids','title','arrangement'}:
        raise LibraryError('문제지의 제목과 선택 문항을 확인해 주세요.')
    ids, title, arrangement = value['ids'], value['title'], value['arrangement']
    if not isinstance(ids,list) or len(ids)>MAX_SELECTION or any(not isinstance(i,str) or i not in known for i in ids):
        raise LibraryError('저장되지 않았거나 현재 확인할 수 없는 문항이 있습니다. 문항을 먼저 저장해 주세요.')
    if len(ids) != len(set(ids)):
        raise LibraryError('같은 문항은 한 번만 담아 주세요.')
    if not isinstance(title,str) or len(title)>80 or not isinstance(arrangement,str) or arrangement not in MODES:
        raise LibraryError('제목은 80자 이내로 쓰고 화면의 배열 방법을 선택해 주세요.')
    return dict(ids=ids, title=title, arrangement=arrangement)

def ready_in(db, fingerprint):
    return {r['id']:r for row in db.execute('SELECT * FROM items') if (r:=unpack(row,fingerprint))['state']=='ready'}

def save_worksheet(body):
    if not isinstance(body,dict) or set(body)!={'revision','worksheet'} or type(body['revision']) is not int:
        raise LibraryError('저장본을 다시 읽은 뒤 문제지를 저장해 주세요.')
    fingerprint = check_activation()
    with connection() as db:
        db.execute('BEGIN IMMEDIATE')
        rev = db.execute('SELECT revision FROM state WHERE id=1').fetchone()[0]
        if body['revision'] != rev:
            raise LibraryError('다른 창에서 저장본이 바뀌었습니다. 저장본 다시 읽기를 눌러 확인해 주세요.',409)
        # Held IDs retain their position until an explicit migration replaces them.
        known = set(registry()) | {r['id']for r in db.execute('SELECT id FROM items')}
        doc = worksheet(body['worksheet'], known)
        db.execute('UPDATE state SET worksheet=?,revision=revision+1 WHERE id=1',(json.dumps(doc,ensure_ascii=False),))
    return dict(revision=rev+1, worksheet=doc)

def export_bundle(scope):
    if scope not in {'worksheet','all'}:
        raise LibraryError('선택 문항 또는 은행 전체를 골라 주세요.')
    s = snapshot()
    needed = set(s['worksheet']['ids'])
    if any(i['state']!='ready' and (scope=='all' or i['id']in needed) for i in s['items']):
        raise LibraryError('변경 확인이 필요한 문항이 있습니다. 먼저 비교하거나 이전 기록 포함 보관파일을 내려받아 주세요.',409)
    byid = {i['id']:i for i in s['items'] if i['state']=='ready'}
    known = dict(registry())
    known.update({i['id']:i['example'] for i in byid.values()})
    doc = worksheet(s['worksheet'], known)
    ids = doc['ids']
    items = list(byid.values()) if scope=='all' else [byid[i] for i in ids if i in byid]
    for item in items:
        item.pop('state',None)
    return dict(schema=SCHEMA, fingerprint=s['fingerprint'], scope=scope,
                items=items, worksheet=doc, selectedExamples=[known[i] for i in ids])

def import_bundle(body, expected_revision):
    if type(expected_revision) is not int:
        raise LibraryError('저장본을 다시 읽은 뒤 불러와 주세요.')
    if not isinstance(body,dict) or set(body)!={'schema','fingerprint','scope','items','worksheet','selectedExamples'} or body['schema']!=SCHEMA or body['scope'] not in ['worksheet','all']:
        raise LibraryError('이 문제은행에서 내보낸 저장파일을 선택해 주세요.')
    fingerprint = check_activation()
    if body['fingerprint'] != fingerprint:
        raise LibraryError('파일과 현재 생성 규칙의 버전이 다릅니다. 기존 파일은 보존하고 같은 조건으로 다시 만들어 주세요.',409)
    if not isinstance(body['items'],list) or len(body['items'])>MAX_ITEMS:
        raise LibraryError('저장파일의 문항 수를 확인해 주세요.')
    checked = []
    for old in body['items']:
        if not isinstance(old,dict) or set(old)!={'id','typeId','parameters','fingerprint','example','savedAt'}:
            raise LibraryError('문항 저장 형식을 확인해 주세요.')
        fresh = verified_recipe(dict(typeId=old['typeId'],parameters=old['parameters']))
        if old['fingerprint']!=fresh['fingerprint']:
            raise LibraryError('파일의 생성 규칙이 바뀌었습니다. 이전 문항과 새 검산 결과를 비교해 불러와 주세요.',409)
        if fresh['id']!=old['id'] or portable_hash(fresh['example'])!=portable_hash(old['example']):
            raise LibraryError('문항·그림·정답이 현재 검산 기록과 다릅니다. 원래 저장파일을 선택해 주세요.')
        checked.append(fresh)
    known = dict(registry())
    with connection() as db:
        db.execute('BEGIN IMMEDIATE')
        if db.execute('SELECT revision FROM state WHERE id=1').fetchone()[0] != expected_revision:
            raise LibraryError('다른 창에서 저장본이 바뀌었습니다. 저장본 다시 읽기를 눌러 확인해 주세요.',409)
        known.update({i['id']:i['example'] for i in ready_in(db,fingerprint).values()})
        known.update({i['id']:i['example'] for i in checked})
        doc = worksheet(body['worksheet'],known)
        supplied = body['selectedExamples']
        if not isinstance(supplied,list) or len(supplied)!=len(doc['ids']) or any(portable_hash(x)!=portable_hash(known[i]) for x,i in zip(supplied,doc['ids'])):
            raise LibraryError('선택 문항의 순서나 내용이 원래 저장 기록과 다릅니다.')
        added = sum(put(db,item)[1] for item in checked)
        db.execute('UPDATE state SET worksheet=?,revision=revision+1 WHERE id=1',(json.dumps(doc,ensure_ascii=False),))
    return dict(added=added, snapshot=snapshot())
