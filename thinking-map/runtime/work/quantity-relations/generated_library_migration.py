"""Explicitly recheck saved recipes and retain byte-exact prior rows before replacement."""
import json
import generated_item_library as lib

RECOVERY='gfield-generated-library-recovery/v1'

def revision(value):
    if type(value)is not int:raise lib.LibraryError('저장본을 다시 읽은 뒤 비교해 주세요.')
    return value

def recovery_bundle():
    with lib.connection()as db:
        db.execute('BEGIN')
        state=dict(db.execute('SELECT * FROM state WHERE id=1').fetchone())
        rows=[dict(r)for r in db.execute('SELECT * FROM items ORDER BY rowid')]
        archives=[dict(r)for r in db.execute('SELECT * FROM item_archive ORDER BY rowid')]
    return dict(schema=RECOVERY,activeRows=rows,archivedRows=archives,worksheet=lib.loads(state['worksheet']),
        note='이전 기록을 포함한 보관본입니다. 불러올 때 조건으로 다시 검산하며 보관된 지문·그림·답을 실행하지 않습니다.')

def integrity(row):
    try:
        item=lib.loads(row['payload'])
        assert isinstance(item,dict)and isinstance(item.get('id'),str)and isinstance(item.get('typeId'),str)and isinstance(item.get('parameters'),dict)and isinstance(item.get('fingerprint'),str)and isinstance(item.get('example'),dict)and isinstance(item['example'].get('problem'),dict)
        assert lib.vsha(item)==row['digest']and item['id']==row['id']==item['example']['instanceId']
        return item
    except (ValueError,KeyError,TypeError,AssertionError):
        raise lib.LibraryError('저장 기록의 해시가 맞지 않아 비교할 수 없습니다. 보관파일을 먼저 내려받아 주세요.',409)

def comparable(old,fresh):
    # The old markup is never rendered. Only trusted fresh markup is previewed.
    before=old.get('example',{});after=fresh['example']
    fields={'prompt':('문제',before.get('problem',{}).get('prompt',''),after['problem']['prompt']),
        'answer':('정답',before.get('problem',{}).get('answer',''),after['problem']['answer']),
        'solution':('풀이',before.get('problem',{}).get('solution',''),after['problem']['solution']),
        'studentVisual':('문제 그림',before.get('visualMarkup',''),after.get('visualMarkup','')),
        'response':('응답 방식',before.get('studentResponseContract'),after.get('studentResponseContract')),
        'capabilities':('최소 능력 설명',before.get('normalization',{}).get('minimumCapabilities'),after.get('normalization',{}).get('minimumCapabilities'))}
    return dict(oldId=old['id'],newId=fresh['id'],previous=dict(prompt=fields['prompt'][1],answer=fields['answer'][1],solution=fields['solution'][1]),
        current=fresh['example'],changes=[dict(field=k,label=v[0],changed=lib.portable_hash(v[1])!=lib.portable_hash(v[2]))for k,v in fields.items()],
        newDifficultyAutomaticallyApproved=False)

def local_plan(body):
    if not isinstance(body,dict)or set(body)!={'id','revision'}or not isinstance(body['id'],str):raise lib.LibraryError('비교할 저장 문항을 골라 주세요.')
    rev=revision(body['revision'])
    with lib.connection()as db:
        db.execute('BEGIN')
        state=dict(db.execute('SELECT * FROM state WHERE id=1').fetchone())
        row=db.execute('SELECT * FROM items WHERE id=?',(body['id'],)).fetchone()
        if rev!=state['revision']:raise lib.LibraryError('저장본이 바뀌었습니다. 다시 읽고 비교해 주세요.',409)
        if not row:raise lib.LibraryError('해당 저장 문항을 찾지 못했습니다.',404)
        row=dict(row);old=integrity(row)
        if lib.unpack(row,None)['state']=='ready':raise lib.LibraryError('현재 검산 버전으로 저장된 문항입니다.',409)
    fresh=lib.verified_recipe(dict(typeId=old['typeId'],parameters=old['parameters']))
    token=lib.vsha(dict(revision=rev,row=row,current=fresh['example'],fingerprint=fresh['fingerprint']))
    return dict(row=row,old=old,fresh=fresh,revision=rev,token=token,worksheet=lib.loads(state['worksheet']))

def preview(body):
    p=local_plan(body)
    return dict(token=p['token'],revision=p['revision'],comparison=comparable(p['old'],p['fresh']),previousRecordWillBeArchived=True)

def replace_ids(doc,mapping):
    ids=list(dict.fromkeys(mapping.get(i,i)for i in doc['ids']))
    return dict(doc,ids=ids)

def apply(body):
    if not isinstance(body,dict)or set(body)!={'id','revision','token','replaceInWorksheet'}or type(body['replaceInWorksheet'])is not bool:raise lib.LibraryError('변경 내용을 다시 열어 확인해 주세요.')
    p=local_plan(dict(id=body['id'],revision=body['revision']))
    if body['token']!=p['token']:raise lib.LibraryError('비교한 내용과 현재 결과가 다릅니다. 다시 비교해 주세요.',409)
    fresh=p['fresh'];oldid=p['old']['id'];newid=fresh['id']
    with lib.connection()as db:
        db.execute('BEGIN IMMEDIATE')
        state=db.execute('SELECT * FROM state WHERE id=1').fetchone()
        row=db.execute('SELECT * FROM items WHERE id=?',(oldid,)).fetchone()
        if state['revision']!=p['revision']or not row or dict(row)!=p['row']or lib.version_for(fresh['typeId'])!=fresh['fingerprint']:raise lib.LibraryError('다른 창에서 저장본이나 생성 규칙이 바뀌었습니다. 다시 비교해 주세요.',409)
        target=db.execute('SELECT * FROM items WHERE id=?',(newid,)).fetchone()
        if newid!=oldid and target:
            current=lib.unpack(target,None)
            if current['state']!='ready'or lib.portable_hash(current['example'])!=lib.portable_hash(fresh['example']):raise lib.LibraryError('같은 번호의 다른 저장 문항이 있습니다. 보관본을 확인해 주세요.',409)
        archiveid=lib.archive(db,row,'explicit-generator-version-migration')
        if newid==oldid:
            db.execute('UPDATE items SET payload=?,digest=? WHERE id=?',(json.dumps(fresh,ensure_ascii=False),lib.vsha(fresh),oldid))
        else:
            lib.put(db,fresh)
            # A held original stays selectable by its saved ID when replacement was not chosen.
            if body['replaceInWorksheet']:db.execute('DELETE FROM items WHERE id=?',(oldid,))
        doc=lib.loads(state['worksheet'])
        if body['replaceInWorksheet']:doc=replace_ids(doc,{oldid:newid})
        db.execute('UPDATE state SET worksheet=?,revision=revision+1 WHERE id=1',(json.dumps(doc,ensure_ascii=False),))
    return dict(snapshot=lib.snapshot(),previousArchiveId=archiveid,reusedExistingTarget=bool(target and newid!=oldid))

def file_plan(body):
    if not isinstance(body,dict)or set(body)!={'revision','bundle'}:raise lib.LibraryError('보관파일을 선택해 주세요.')
    rev=revision(body['revision']);bundle=body['bundle']
    if not isinstance(bundle,dict):raise lib.LibraryError('문제은행 보관파일을 선택해 주세요.')
    archives=[]
    if bundle.get('schema')==lib.SCHEMA:
        if not isinstance(bundle.get('items'),list):raise lib.LibraryError('문항 목록을 확인해 주세요.')
        rows=[dict(id=i.get('id'),payload=json.dumps(i,ensure_ascii=False),digest=lib.vsha(i))for i in bundle['items']if isinstance(i,dict)]
        if len(rows)!=len(bundle['items']):raise lib.LibraryError('문항 저장 형식을 확인해 주세요.')
    elif bundle.get('schema')==RECOVERY:
        rows=bundle.get('activeRows');archives=bundle.get('archivedRows',[])
        if not isinstance(rows,list)or not isinstance(archives,list):raise lib.LibraryError('보관 기록 목록을 확인해 주세요.')
    else:raise lib.LibraryError('이 문제은행에서 내보낸 파일을 선택해 주세요.')
    if len(rows)+len(archives)>lib.MAX_ITEMS:raise lib.LibraryError('보관파일의 문항 수를 확인해 주세요.')
    fresh=[];comparisons=[];olditems=[];oldids=set()
    for row in rows:
        if not isinstance(row,dict)or set(row)!={'id','payload','digest'}:raise lib.LibraryError('문항 보관 형식을 확인해 주세요.')
        old=integrity(row)
        if old['id']in oldids:raise lib.LibraryError('보관파일에 같은 문항 번호가 겹칩니다.')
        oldids.add(old['id']);olditems.append(old)
        new=lib.verified_recipe(dict(typeId=old['typeId'],parameters=old['parameters']));fresh.append(new);comparisons.append(comparable(old,new))
    with lib.connection()as db:
        state=db.execute('SELECT * FROM state WHERE id=1').fetchone()
        if state['revision']!=rev:raise lib.LibraryError('저장본이 바뀌었습니다. 다시 읽고 불러와 주세요.',409)
        known=set(lib.registry())|{i['id']for i in fresh}|{r['id']for r in db.execute('SELECT id FROM items')}
    mapping={old['id']:new['id']for old,new in zip(olditems,fresh)}
    doc=replace_ids(bundle.get('worksheet',{}),mapping)if isinstance(bundle.get('worksheet'),dict)and isinstance(bundle['worksheet'].get('ids'),list)and all(isinstance(i,str)for i in bundle['worksheet']['ids'])else None
    if doc is None:raise lib.LibraryError('보관파일의 문제지를 확인해 주세요.')
    doc=lib.worksheet(doc,known)
    for row in archives:
        if not isinstance(row,dict)or set(row)!={'archive_id','source_id','payload','digest','archived_at','reason'}or not all(isinstance(v,str)for v in row.values()):raise lib.LibraryError('이전 기록의 보관 형식을 확인해 주세요.')
        if row['archive_id']!=lib.vsha(dict(id=row['source_id'],payload=row['payload'],digest=row['digest'])):raise lib.LibraryError('이전 기록의 식별값을 확인해 주세요.')
    token=lib.vsha(dict(revision=rev,bundle=bundle,current=[dict(example=f['example'],fingerprint=f['fingerprint'])for f in fresh],worksheet=doc))
    return dict(rows=rows,archives=archives,fresh=fresh,comparisons=comparisons,worksheet=doc,token=token,revision=rev)

def preview_file(body):
    p=file_plan(body)
    return dict(token=p['token'],revision=p['revision'],comparisons=p['comparisons'],worksheet=p['worksheet'],
        externalOldContentsVerified=False,message='파일의 이전 지문·그림·답은 승인하지 않습니다. 조건으로 다시 검산한 새 문항을 비교해 불러옵니다.')

def apply_file(body):
    if not isinstance(body,dict)or set(body)!={'revision','bundle','token'}:raise lib.LibraryError('파일의 비교 결과를 다시 확인해 주세요.')
    p=file_plan(dict(revision=body['revision'],bundle=body['bundle']))
    if body['token']!=p['token']:raise lib.LibraryError('비교 후 조건이나 생성 규칙이 바뀌었습니다. 다시 비교해 주세요.',409)
    with lib.connection()as db:
        db.execute('BEGIN IMMEDIATE')
        if db.execute('SELECT revision FROM state WHERE id=1').fetchone()[0]!=p['revision']:raise lib.LibraryError('다른 창에서 저장본이 바뀌었습니다. 다시 비교해 주세요.',409)
        for row in p['rows']:lib.archive(db,row,'external-record-before-explicit-recheck')
        for row in p['archives']:
            db.execute('INSERT OR IGNORE INTO item_archive VALUES(?,?,?,?,?,?)',tuple(row[k]for k in ['archive_id','source_id','payload','digest','archived_at','reason']))
        for fresh in p['fresh']:
            if lib.version_for(fresh['typeId'])!=fresh['fingerprint']:raise lib.LibraryError('생성 규칙이 바뀌었습니다. 다시 비교해 주세요.',409)
            target=db.execute('SELECT * FROM items WHERE id=?',(fresh['id'],)).fetchone()
            if target and lib.unpack(target,None)['state']!='ready':
                lib.archive(db,target,'local-record-before-explicit-file-recheck')
                db.execute('DELETE FROM items WHERE id=?',(fresh['id'],))
            elif target and lib.portable_hash(lib.unpack(target,None)['example'])!=lib.portable_hash(fresh['example']):
                raise lib.LibraryError('같은 번호의 다른 문항이 있습니다. 저장본을 확인해 주세요.',409)
            lib.put(db,fresh)
        db.execute('UPDATE state SET worksheet=?,revision=revision+1 WHERE id=1',(json.dumps(p['worksheet'],ensure_ascii=False),))
    return dict(snapshot=lib.snapshot(),recheckedItems=len(p['fresh']),previousRecordsPreserved=True)
