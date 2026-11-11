"""Local quality gate checks; no synthesis, downloads or original audio changes."""
import contextlib, hashlib, importlib.util, io, json, pathlib, tempfile, unittest
spec=importlib.util.spec_from_file_location('nm_voice', pathlib.Path(__file__).with_name('omnivoice-nm.py'))
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
class VoiceQuality(unittest.TestCase):
    def test_spoken_symbols(self):
        self.assertEqual(m.spoken('ko','접시를 눌러 올리고 ✔를 눌러요'),'접시를 눌러 올리고 확인 버튼을 눌러요')
        self.assertNotIn('+',m.spoken('ko','위+아래 = 왼쪽+오른쪽!'))
        self.assertEqual(m.spoken('ko','합과 차 마법 Level 2!'),'합과 차 마법 레벨 2!')
        self.assertIn('이 단부터 구 단까지',m.spoken('ko','2~9단'))
        self.assertEqual(m.spoken('en','Ready,,, now!!'),'Ready, now.')
    def test_manifest_rejects_failed_or_changed_audio_and_preserves_originals(self):
        with tempfile.TemporaryDirectory() as d:
            tasks=[{'lang':'ko','text':text} for text in ['통과','재검수','변경됨']]
            files=[m.fname(t['lang'],t['text']) for t in tasks]
            for f in files:pathlib.Path(d,f).write_bytes(b'fixture')
            extra=pathlib.Path(d,'old-original.mp3');extra.write_bytes(b'preserve')
            report={files[0]:{'ok':True,'audioSHA256':hashlib.sha256(b'fixture').hexdigest()},files[1]:{'ok':False},files[2]:{'ok':True,'audioSHA256':'mismatch'}}
            pathlib.Path(d,'report.json').write_text(json.dumps(report))
            original_tasks,original_map=m.tasks,m.MAP
            try:
                m.tasks=lambda:tasks;m.MAP=str(pathlib.Path(d,'map.js'))
                with contextlib.redirect_stdout(io.StringIO()):self.assertEqual(m.write_map(d),1)
                result=pathlib.Path(m.MAP).read_text();self.assertIn(files[0],result);self.assertNotIn(files[1],result);self.assertNotIn(files[2],result)
                self.assertTrue(extra.exists());self.assertTrue(all(pathlib.Path(d,f).exists() for f in files))
            finally:m.tasks,m.MAP=original_tasks,original_map
    def test_new_voice_gets_its_own_file_names(self):
        self.assertNotEqual(m.fname('ko','하나'),m.fname('ko','하나','nm-numi-v2'))
        self.assertEqual(m.fname('ko','하나'),m.fname('ko','하나',None))
    def test_symbols_and_numbers_are_read_and_checked(self):
        self.assertIn('끝 수 빼기 시작, 더하기 일',m.spoken('ko','"끝 - 시작 + 1" 마법으로 세어봐요!'))
        self.assertIn('플러스',m.spoken('ko','앞으로 뛰면 +, 되돌아오면 −예요!'))
        self.assertIn('마이너스',m.spoken('ko','앞으로 뛰면 +, 되돌아오면 −예요!'))
        self.assertEqual(m.cer('ko','2와 5를 찾아봐!','이와 오를 찾아봐'),0.0)
        self.assertEqual(m.cer('ko',m.spoken('ko','완벽해! 2~9단 완전 정복!'),'완벽해 2단부터 9단까지 완전 정복.'),0.0)
        self.assertGreater(m.cer('ko','우와, 잘 셌어!','우와 잘 태어.'),0.12)
if __name__=='__main__':unittest.main()
