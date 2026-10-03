"""모델 없이 승인 음성 보존·재개·검수 기록을 확인한다."""
import importlib.util
import json
import pathlib
import tempfile
import unittest
from unittest.mock import patch

spec = importlib.util.spec_from_file_location(
    "docssam", pathlib.Path(__file__).with_name("omnivoice-docssam.py"))
voice = importlib.util.module_from_spec(spec)
spec.loader.exec_module(voice)


class VoicePreservation(unittest.TestCase):
    def test_manifest_preserves_old_approved_files(self):
        with tempfile.TemporaryDirectory() as folder:
            old = pathlib.Path(folder, "approved-old.mp3")
            old.write_bytes(b"approved original")
            normal = voice.fname("study", "안녕", voice.V1)
            slow = voice.fname("study", "안녕", voice.SLOW)
            for name in (normal, slow):
                pathlib.Path(folder, name).write_bytes(b"audio")
            with patch.object(voice, "OUT", folder), \
                 patch.object(voice, "lines", return_value=[("study", "안녕")]), \
                 patch.object(voice, "study_lines", return_value=[("study", "안녕")]):
                self.assertEqual(voice.write_manifest(folder), [slow])
            self.assertEqual(old.read_bytes(), b"approved original")
            self.assertTrue(pathlib.Path(folder, normal).is_file())
            manifest = json.loads(pathlib.Path(folder, "manifest.json").read_text("utf-8"))
            self.assertEqual(manifest["rates"][voice.SLOW], 1)
            self.assertEqual(manifest["rates"][voice.V1], 0.8)

    def test_resume_skips_public_and_staged_audio(self):
        with tempfile.TemporaryDirectory() as public, tempfile.TemporaryDirectory() as staged:
            candidates = [("published", "하나"), ("staged", "둘"), ("missing", "셋")]
            pathlib.Path(public, voice.fname(*candidates[0])).write_bytes(b"published")
            pathlib.Path(staged, voice.fname(*candidates[1])).write_bytes(b"staged")
            with patch.object(voice, "OUT", public):
                self.assertEqual(voice.pending_lines(candidates, staged), [candidates[2]])
                self.assertEqual(voice.pending_lines(candidates, staged, {"staged"}), [])

    def test_report_checkpoint_keeps_previous_results(self):
        with tempfile.TemporaryDirectory() as folder:
            path = str(pathlib.Path(folder, "report.json"))
            voice.save_report(path, {"one.mp3": {"ok": True}})
            voice.save_report(path, {"two.mp3": {"ok": False}})
            with open(path, encoding="utf-8") as handle:
                self.assertEqual(json.load(handle), {
                    "one.mp3": {"ok": True}, "two.mp3": {"ok": False}})

    def test_interrupted_encoder_preserves_finished_mp3(self):
        with tempfile.TemporaryDirectory() as folder:
            path = pathlib.Path(folder, "approved.mp3")
            path.write_bytes(b"approved")
            def fail(command):
                pathlib.Path(command[-1]).write_bytes(b"partial")
                raise SystemExit("encoder interrupted")
            with patch.object(voice, "run", side_effect=fail), \
                 patch.object(voice, "ffmpeg_exe", return_value="ffmpeg"):
                with self.assertRaises(SystemExit):
                    voice.to_mp3("input.wav", str(path))
            self.assertEqual(path.read_bytes(), b"approved")


if __name__ == "__main__":
    unittest.main()
