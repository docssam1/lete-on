"""Code preservation checks; optional integration uses existing private data and an isolated DB."""
import argparse,hashlib,json,os,socket,subprocess,sys,tempfile,time,urllib.request
from pathlib import Path
import restore

def request(root,route,body=None):
 data=None if body is None else json.dumps(body).encode()
 req=urllib.request.Request(root+route,data=data,headers={'Content-Type':'application/json'}if data is not None else{})
 with urllib.request.urlopen(req,timeout=30)as response:return response.read()
def main():
 p=argparse.ArgumentParser();p.add_argument('--private-workspace');p.add_argument('--node');p.add_argument('--report');a=p.parse_args();report=dict(passed=True)
 with tempfile.TemporaryDirectory(prefix='thinking-map-restore-')as tmp:
  home=Path(tmp);work=home/'restored';result=restore.install(work);assert result['datasetsCopied']==0
  assert restore.verify(work,require_data=False)['codeVersion']==68
  sentinel=work/'work/quantity-relations/saved-bank/generated-items.private.sqlite3';sentinel.parent.mkdir();sentinel.write_bytes(b'private-user-record-sentinel')
  assert restore.install(work)['installedCodeFiles']==0 and sentinel.read_bytes()==b'private-user-record-sentinel'
  conflict=home/'conflict';name=next(iter(restore.code_payloads()));target=conflict/name;target.parent.mkdir(parents=True);target.write_bytes(b'user edit')
  try:restore.install(conflict)
  except ValueError:pass
  else:raise AssertionError('Overwrote differing code')
  assert target.read_bytes()==b'user edit'and len(list(conflict.rglob('*.*')))==1
  try:restore.install(restore.PACKAGE/'private-workspace')
  except ValueError:pass
  else:raise AssertionError('Allowed private workspace inside Git')
  report.update(exactCodeRestored=True,installIsIdempotent=True,userDBSentinelPreserved=True,conflictingUserEditsNotOverwritten=True,privateWorkspaceInsideGitRejected=True,
      runtimeFiles=result['installedCodeFiles'],originalPagesOrPrivateDatasetsCopiedToGit=False)
  if a.private_workspace:
   source=Path(a.private_workspace).resolve();restore.verify(source,require_code=False)
   sentinel.unlink();sentinel.parent.rmdir()
   (work/'outputs').symlink_to(source/'outputs',target_is_directory=True)
   private_work=work/'work/quantity-relations';source_work=source/'work/quantity-relations'
   for f in restore.read('private-data-manifest.json')['files']:
    if f['path'].startswith('work/'):
     dest=work/f['path'];dest.symlink_to(source/f['path'])
   (private_work/'local-cache').symlink_to(source_work/'local-cache',target_is_directory=True)
   restore.verify(work)
   # Hash source/private inputs before and after; only the temporary DB may change.
   before={f['path']:restore.digest((source/f['path']).read_bytes())for f in restore.read('private-data-manifest.json')['files']}
   with socket.socket()as s:s.bind(('127.0.0.1',0));port=s.getsockname()[1]
   env=os.environ.copy();env['GFIELD_ITEM_LIBRARY_DB']=str(home/'test.sqlite3')
   cmd=[sys.executable,str(restore.PACKAGE/'start.py'),'--workspace',str(work),'--port',str(port),'--no-ocr']
   if a.node:cmd.extend(['--node',a.node])
   child=subprocess.Popen(cmd,env=env,stdout=subprocess.PIPE,stderr=subprocess.PIPE);root='http://127.0.0.1:'+str(port)
   try:
    for n in range(100):
     if child.poll()is not None:raise AssertionError(child.stderr.read().decode()[-1200:])
     try:health=json.loads(request(root,'/api/health'));break
     except OSError:time.sleep(.1)
    else:raise AssertionError('Restored listener unavailable')
    assert health['types']==450
    schema=json.loads(request(root,'/api/generation/schema'));native=json.loads(request(root,'/api/generation/native/schema'));assert(len(schema['types']),len(native['types']))==(44,18)
    html=request(root,'/thinking-map/');assert restore.digest(html)==before['outputs/quantity-crossbook-bank.html']
    recipes=[dict(typeId='CAL09',parameters=dict(dividend=504,divisor=7)),dict(typeId='MG03',parameters=dict(nativeTypeId='magic-square-four-target',setting=1,seed=2718))]
    for recipe in recipes:
     result=json.loads(request(root,'/api/library/items',recipe));assert result['item']['state']=='ready'
    state=json.loads(request(root,'/api/library'));assert len(state['items'])==2
    ids=[i['id']for i in state['items']];request(root,'/api/library/worksheet',dict(revision=state['revision'],worksheet=dict(ids=ids,title='복원 확인',arrangement='manual')))
    exported=json.loads(request(root,'/api/library/export?scope=worksheet'));assert len(exported['selectedExamples'])==2
    assert json.loads(request(root,'/api/library/recovery'))['archivedRows']==[]
    assets=json.loads((source_work/'local-cache/original-preview-manifest.private.json').read_text())['assets'];selected=list(assets.items())[:2]
    for assetid,asset in selected:assert restore.digest(request(root,'/api/original/'+assetid))==asset['sha256']
    report.update(privateIntegration=True,originalResearchReopened=False,somaTypes=44,additionalNativeTypes=18,isolatedStoredItems=2,
        exactPrivateHTMLReadback=True,existingOriginalPreviewReadbacks=len(selected),newOCR=0,externalAIRequests=0,productionPortUntouched=18768)
   finally:
    child.terminate()
    try:child.wait(timeout=10)
    except subprocess.TimeoutExpired:child.kill();child.wait()
   assert all(restore.digest((source/n).read_bytes())==h for n,h in before.items())
   report['sourcePrivateDataHashesUnchanged']=True
 if a.report:Path(a.report).write_text(json.dumps(report,indent=2)+'\n')
 print(json.dumps(report))
if __name__=='__main__':main()
