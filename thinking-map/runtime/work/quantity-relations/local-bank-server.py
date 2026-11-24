import hashlib
import json
import os
import re
import subprocess
import tempfile
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse, parse_qs

PROJECT=Path(__file__).resolve().parents[2]
OUTPUT=PROJECT/'outputs'
WORK=Path(__file__).resolve().parent
VISION=WORK/'bin/vision-text-candidates'
CACHE=WORK/'local-cache/ocr'
LOCK=threading.Lock()
PORT=int(os.environ.get('GFIELD_THINKING_MAP_PORT','18766'))
MAX_IMAGE=16*1024*1024
ORIGINAL_MANIFEST=WORK/'local-cache/original-preview-manifest.private.json'
ORIGINAL_ROOT=Path('/Users/docssam/Developer/GFIELD/continuations/content-map').resolve()
TEXTBOOK_PAGE_ROOT=(WORK/'local-cache/textbook-pages').resolve()

class Handler(BaseHTTPRequestHandler):
    def reply(self, status, payload):
        data=json.dumps(payload,ensure_ascii=False).encode()
        self.send_response(status)
        self.send_header('Content-Type','application/json; charset=utf-8')
        self.send_header('Content-Length',str(len(data)))
        self.send_header('Cache-Control','no-store')
        self.end_headers();self.wfile.write(data)

    def allowed(self):
        hosts={f'127.0.0.1:{PORT}',f'localhost:{PORT}'}
        origins={f'http://127.0.0.1:{PORT}',f'http://localhost:{PORT}'}
        return self.headers.get('Host') in hosts and self.headers.get('Origin') in origins|{None}

    def do_GET(self):
        if not self.allowed():return self.reply(403,{'error':'로컬 실행 주소에서 열어 주세요.'})
        route=urlparse(self.path).path
        if route=='/api/generation/native/schema':
            try:
                from native_generation_service import schema,check_activation
                check_activation();return self.reply(200,schema())
            except (RuntimeError,OSError,AssertionError):return self.reply(503,{'error':'기존 생성기 연결의 검증 자료를 준비하고 있습니다.'})
        if route in ['/api/library','/api/library/export','/api/library/recovery']:
            import sqlite3
            from generated_item_library import snapshot,export_bundle,LibraryError
            try:
                if route=='/api/library/recovery':
                    from generated_library_migration import recovery_bundle
                    result=recovery_bundle()
                else:result=snapshot() if route=='/api/library' else export_bundle(parse_qs(urlparse(self.path).query).get('scope',['worksheet'])[0])
                return self.reply(200,result)
            except LibraryError as error:return self.reply(error.status,{'error':str(error)})
            except (RuntimeError,OSError,AssertionError,sqlite3.Error,ValueError):return self.reply(503,{'error':'저장한 문제를 읽지 못했습니다. 실행 상태와 보관 파일을 확인해 주세요.'})
        if route=='/api/generation/schema':
            try:
                from soma_generation_service import schema,check_activation
                check_activation();return self.reply(200,schema())
            except (RuntimeError,OSError,AssertionError):return self.reply(503,{'error':'조건 생성 검증 자료를 준비하지 못했습니다. 기존 변형 문항을 먼저 이용해 주세요.'})
        if route.startswith('/api/original/'):
            asset_id=route.removeprefix('/api/original/')
            if not re.fullmatch(r'[0-9a-f]{32}',asset_id):return self.reply(404,{'error':'연결된 원본 페이지가 없습니다.'})
            try:
                asset=json.loads(ORIGINAL_MANIFEST.read_text())['assets'].get(asset_id)
                if not asset:return self.reply(404,{'error':'연결된 원본 페이지가 없습니다.'})
                path=Path(asset['path']).resolve()
                if not any(path.is_relative_to(root) for root in [ORIGINAL_ROOT,TEXTBOOK_PAGE_ROOT]) or path.suffix.lower()!='.png':return self.reply(403,{'error':'등록된 원본 페이지를 열어 주세요.'})
                size=path.stat().st_size
                if size!=asset['bytes'] or size>MAX_IMAGE:return self.reply(409,{'error':'원본 페이지 크기가 기존 검증 기록과 다릅니다.'})
                raw=path.read_bytes()
                if hashlib.sha256(raw).hexdigest()!=asset['sha256']:return self.reply(409,{'error':'원본 페이지가 기존 검증 기록과 다릅니다. 해당 항목을 다시 확인해 주세요.'})
                self.send_response(200)
                self.send_header('Content-Type','image/png')
                self.send_header('Content-Length',str(len(raw)))
                self.send_header('Cache-Control','no-store')
                self.send_header('X-Content-Type-Options','nosniff')
                self.send_header('X-Original-Page-SHA256',asset['sha256'])
                self.end_headers();self.wfile.write(raw)
                return
            except (OSError,ValueError,KeyError):return self.reply(503,{'error':'기존 Drive 원본 페이지를 열지 못했습니다. Drive 연결을 확인해 주세요.'})
        if route=='/api/health':
            data=json.loads((OUTPUT/'quantity-crossbook-bank.json').read_text())
            return self.reply(200,{'status':'ready','ocrAvailable':VISION.exists(),'engine':'Apple Vision','scope':data['inputScope'],'types':len(data['types']),'originalPreviews':data.get('originalPreviewReuse',{})})
        files={'/thinking-map/':'quantity-crossbook-bank.html','/':'quantity-crossbook-bank.html','/quantity-crossbook-bank.html':'quantity-crossbook-bank.html','/quantity-relations-practice.html':'quantity-relations-practice.html','/quantity-relations-student.pdf':'quantity-relations-student.pdf','/quantity-relations-teacher.pdf':'quantity-relations-teacher.pdf'}
        if route not in files:return self.reply(404,{'error':'파일을 찾을 수 없습니다.'})
        path=OUTPUT/files[route]
        if not path.exists():return self.reply(404,{'error':'작업 화면을 먼저 생성해 주세요.'})
        raw=path.read_bytes();self.send_response(200)
        self.send_header('Content-Type','application/pdf' if path.suffix=='.pdf' else 'text/html; charset=utf-8')
        self.send_header('Content-Length',str(len(raw)));self.send_header('Cache-Control','no-store')
        self.end_headers();self.wfile.write(raw)

    def do_POST(self):
        if not self.allowed():return self.reply(403,{'error':'로컬 실행 주소에서 열어 주세요.'})
        if urlparse(self.path).path=='/api/generation/native':
            try:length=int(self.headers.get('Content-Length','0'))
            except ValueError:return self.reply(400,{'error':'요청 길이를 확인해 주세요.'})
            if not 0<length<=8192:return self.reply(413,{'error':'문제 구성을 항목별로 골라 주세요.'})
            if self.headers.get('Content-Type','').split(';')[0]!='application/json':return self.reply(415,{'error':'화면의 문제 구성 선택을 사용해 주세요.'})
            try:
                from native_generation_service import generate
                from soma_parameter_schema import ParameterError
                def reject_native_constant(value):raise ValueError('non-finite')
                body=json.loads(self.rfile.read(length),parse_constant=reject_native_constant)
                if not isinstance(body,dict)or set(body)-{'typeId','parameters'}:return self.reply(400,{'error':'유형과 문제 구성을 확인해 주세요.'})
                return self.reply(200,generate(body.get('typeId'),body.get('parameters',{})))
            except ParameterError as error:return self.reply(422,{'error':str(error),'fields':error.fields})
            except (ValueError,UnicodeError):return self.reply(400,{'error':'문제 구성을 다시 골라 주세요.'})
            except (RuntimeError,OSError,AssertionError,ArithmeticError,subprocess.SubprocessError):return self.reply(503,{'error':'현재 문항의 답 확인을 마치지 못했습니다. 확인한 예시를 이용해 주세요.'})
        if urlparse(self.path).path in ['/api/library/items','/api/library/worksheet','/api/library/import','/api/library/migration/preview','/api/library/migration/apply','/api/library/migration/file-preview','/api/library/migration/file-apply']:
            import sqlite3
            from generated_item_library import save_item,save_worksheet,import_bundle,LibraryError
            from soma_parameter_schema import ParameterError
            try:length=int(self.headers.get('Content-Length','0'))
            except ValueError:return self.reply(400,{'error':'파일의 길이를 확인해 주세요.'})
            limit=64*1024*1024 if urlparse(self.path).path in ['/api/library/import','/api/library/migration/file-preview','/api/library/migration/file-apply'] else 128*1024
            if not 0<length<=limit:return self.reply(413,{'error':'불러올 파일은 64MB 이하로 선택해 주세요.'})
            if self.headers.get('Content-Type','').split(';')[0]!='application/json':return self.reply(415,{'error':'문제은행에서 내보낸 JSON 파일을 사용해 주세요.'})
            try:
                def reject_library_constant(value):raise ValueError('non-finite')
                body=json.loads(self.rfile.read(length),parse_constant=reject_library_constant)
                route=urlparse(self.path).path
                if route=='/api/library/items':return self.reply(200,save_item(body))
                if route=='/api/library/worksheet':return self.reply(200,save_worksheet(body))
                if route.startswith('/api/library/migration/'):
                    from generated_library_migration import preview,apply,preview_file,apply_file
                    fn={'preview':preview,'apply':apply,'file-preview':preview_file,'file-apply':apply_file}[route.rsplit('/',1)[1]]
                    return self.reply(200,fn(body))
                if not isinstance(body,dict)or set(body)!={'revision','bundle'}:raise LibraryError('저장파일을 다시 선택해 주세요.')
                return self.reply(200,import_bundle(body['bundle'],body['revision']))
            except LibraryError as error:return self.reply(error.status,{'error':str(error)})
            except ParameterError as error:return self.reply(422,{'error':str(error),'fields':error.fields})
            except (ValueError,UnicodeError):return self.reply(400,{'error':'JSON 파일을 읽지 못했습니다. 원래 저장파일을 선택해 주세요.'})
            except (RuntimeError,OSError,AssertionError,ArithmeticError,sqlite3.Error):return self.reply(503,{'error':'검산 또는 저장을 마치지 못했습니다. 기존 저장본은 보존했습니다. 실행 상태를 확인해 주세요.'})
        if urlparse(self.path).path=='/api/generation/soma':
            try:length=int(self.headers.get('Content-Length','0'))
            except ValueError:return self.reply(400,{'error':'요청 길이가 올바르지 않습니다.'})
            if not 0<length<=8192:return self.reply(413,{'error':'문항 조건을 항목별로 입력해 주세요.'})
            if self.headers.get('Content-Type','').split(';')[0]!='application/json':return self.reply(415,{'error':'화면의 조건 입력란을 사용해 주세요.'})
            try:
                from soma_generation_service import generate
                from soma_parameter_schema import ParameterError
                def reject_constant(value):raise ValueError('non-finite number')
                body=json.loads(self.rfile.read(length),parse_constant=reject_constant)
                if not isinstance(body,dict)or set(body)-{'typeId','parameters'}:return self.reply(400,{'error':'유형과 문항 조건을 확인해 주세요.'})
                result=generate(body.get('typeId'),body.get('parameters',{}));return self.reply(200,result)
            except ParameterError as error:return self.reply(422,{'error':str(error),'fields':error.fields})
            except (ValueError,UnicodeError):return self.reply(400,{'error':'읽을 수 있는 문항 조건을 입력해 주세요.'})
            except (RuntimeError,OSError,AssertionError,ArithmeticError):return self.reply(503,{'error':'정답·그림 확인을 마치지 못해 생성하지 않았습니다. 기존 변형 문항을 이용해 주세요.'})
        if urlparse(self.path).path!='/api/ocr':return self.reply(404,{'error':'지원하지 않는 요청입니다.'})
        try:length=int(self.headers.get('Content-Length','0'))
        except ValueError:return self.reply(400,{'error':'이미지 길이가 올바르지 않습니다.'})
        if not 0<length<=MAX_IMAGE:return self.reply(413,{'error':'16MB 이하의 이미지로 넣어 주세요.'})
        if self.headers.get('Content-Type','').split(';')[0]!='image/png':return self.reply(415,{'error':'화면에서 PNG로 변환한 이미지를 사용해 주세요.'})
        raw=self.rfile.read(length)
        if len(raw)!=length or not raw.startswith(b'\x89PNG\r\n\x1a\n'):return self.reply(400,{'error':'읽을 수 있는 PNG 이미지가 필요합니다.'})
        digest=hashlib.sha256(raw).hexdigest()
        CACHE.mkdir(parents=True,exist_ok=True)
        cached=CACHE/(digest+'.json')
        try:
            with LOCK:
                hit=cached.exists()
                if hit:result=json.loads(cached.read_text())
                else:
                    if not VISION.exists():return self.reply(503,{'error':'Apple Vision 도구를 준비하지 못했습니다.'})
                    with tempfile.TemporaryDirectory(prefix='quantity-vision-') as temp:
                        image=Path(temp)/'input.png';result_file=Path(temp)/'ocr.json';image.write_bytes(raw)
                        process=subprocess.run([str(VISION),str(image),str(result_file),'ko-KR,en-US'],capture_output=True,text=True,timeout=90)
                        if process.returncode or not result_file.exists():return self.reply(422,{'error':'이미지에서 글자를 읽지 못했습니다. 해상도와 방향을 확인해 주세요.'})
                        result=json.loads(result_file.read_text())
                    cached.write_text(json.dumps(result,ensure_ascii=False))
            observations=sorted(result.get('observations',[]),key=lambda o:(o['bboxPixels'][1],o['bboxPixels'][0]))
            text='\n'.join(row['text'] for row in observations)
            self.reply(200,{'text':text,'cacheHit':hit,'sourceSha256':digest,'engine':'Apple Vision','observations':observations,'externalRequests':0})
        except subprocess.TimeoutExpired:self.reply(504,{'error':'이미지 인식 시간이 길어졌습니다. 문제 한 개만 잘라 다시 넣어 주세요.'})
        except (OSError,ValueError):self.reply(500,{'error':'로컬 이미지 인식 결과를 처리하지 못했습니다.'})

if __name__=='__main__':
    if not VISION.exists():
        VISION.parent.mkdir(parents=True,exist_ok=True)
        source=Path('/Users/docssam/Developer/GFIELD/gfield-content-map/scripts/vision-text-candidates.swift')
        subprocess.run(['swiftc',str(source),'-O','-o',str(VISION)],check=True)
    server=ThreadingHTTPServer(('127.0.0.1',PORT),Handler)
    print(f'Thinking map ready: http://127.0.0.1:{PORT}/thinking-map/',flush=True)
    server.serve_forever()
