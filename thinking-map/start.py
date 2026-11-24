"""Launch the private local bank using exact restored code and separately verified private data."""
import argparse,importlib.util,json,os,shutil,subprocess,sys
from pathlib import Path
from restore import verify

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('--workspace',required=True);p.add_argument('--port',type=int,default=18768);p.add_argument('--node');p.add_argument('--vision-binary');p.add_argument('--no-ocr',action='store_true');p.add_argument('--check',action='store_true');a=p.parse_args()
 if not 1024<=a.port<=65535:raise ValueError('Use an unprivileged local port.')
 workspace=Path(a.workspace).resolve();report=verify(workspace);work=workspace/'work/quantity-relations';sys.path.insert(0,str(work))
 import soma_generation_service as soma
 import native_generation_service as native
 report.update(somaFingerprint=soma.check_activation(),nativeFingerprint=native.check_activation())
 node=a.node or(native.NODE if Path(native.NODE).is_file()else shutil.which('node'))
 if not node:raise ValueError('Provide an installed Node runtime with --node.')
 native.NODE=str(Path(node).resolve());report['nodeVersion']=subprocess.check_output([native.NODE,'--version'],text=True).strip()
 if a.check:print(json.dumps(dict(report,passed=True)));return
 os.environ['GFIELD_THINKING_MAP_PORT']=str(a.port)
 spec=importlib.util.spec_from_file_location('thinking_map_http',work/'local-bank-server.py');server=importlib.util.module_from_spec(spec);spec.loader.exec_module(server)
 if a.no_ocr:server.VISION=work/'bin/ocr-disabled'
 elif a.vision_binary:
  server.VISION=Path(a.vision_binary).resolve()
  if not server.VISION.is_file():raise ValueError('The configured Apple Vision binary is missing.')
 elif not server.VISION.exists():
  if sys.platform!='darwin':raise ValueError('Apple Vision needs macOS. Use --no-ocr for text-only work.')
  server.VISION.parent.mkdir(parents=True,exist_ok=True)
  subprocess.run(['swiftc',str(work/'vision-text-candidates.swift'),'-O','-o',str(server.VISION)],check=True)
 listener=server.ThreadingHTTPServer(('127.0.0.1',a.port),server.Handler)
 print('Thinking map ready: http://127.0.0.1:'+str(a.port)+'/thinking-map/',flush=True)
 try:listener.serve_forever()
 finally:listener.server_close()
if __name__=='__main__':main()
