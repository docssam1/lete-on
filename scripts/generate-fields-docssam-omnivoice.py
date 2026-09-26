#!/usr/bin/env python3
"""Build the Golden Bell guide clips from a rights-cleared Docssam recording.

The reference audio and transcript are inputs, never copied to the public output.
No upload is performed. Run with --dry-run to inspect the exact script without a model.
"""

import argparse
from datetime import datetime, timezone
import json
import os
from pathlib import Path
import subprocess
import sys
import uuid


ROOT = Path(__file__).resolve().parents[1]
LINES = ROOT / "scripts" / "fields-docssam-voice-lines.mjs"


def cues():
    result = subprocess.run(["node", str(LINES)], check=True, capture_output=True, text=True, encoding="utf-8")
    items = json.loads(result.stdout)
    if len(items) != 18 or len({item["id"] for item in items}) != 18:
        raise ValueError("Expected 18 distinct Golden Bell guide cues")
    return items


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--ref-audio", type=Path, help="Rights-cleared 3-10 second voice sample")
    parser.add_argument("--ref-text", help="Exact words spoken in the reference sample")
    parser.add_argument("--out", type=Path, default=ROOT / "fields-classic/question-bank/audio/docssam")
    parser.add_argument("--device", choices=["auto", "cpu", "cuda:0"], default="auto")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    items = cues()
    build_id = "dry-run" if args.dry_run else datetime.now(timezone.utc).strftime("%Y%m%d%H%M%S") + "-" + uuid.uuid4().hex[:6]
    entries = [
        {"id": item["id"], "text": item["text"],
         "file": f"{item['id']}-{build_id}.mp3"}
        for item in items
    ]
    if args.dry_run:
        print(json.dumps({"schema": 1, "clips": entries}, ensure_ascii=False, indent=2))
        return 0

    if not args.ref_audio or not args.ref_text:
        parser.error("--ref-audio and --ref-text are both required")
    ref = args.ref_audio.resolve(strict=True)
    if ref.is_relative_to(ROOT):
        parser.error("Keep the reference recording outside the public repository")
    duration = float(subprocess.check_output(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(ref)], text=True
    ).strip())
    if not 3 <= duration <= 10:
        parser.error(f"Reference must be 3-10 seconds; found {duration:.1f}s")

    import torch
    import soundfile as sf
    from omnivoice import OmniVoice

    device = args.device
    if device == "auto":
        device = "cuda:0" if torch.cuda.is_available() and torch.cuda.get_device_properties(0).total_memory >= 10 * 1024**3 else "cpu"
    dtype = torch.float16 if device.startswith("cuda") else torch.float32
    model = OmniVoice.from_pretrained("k2-fsa/OmniVoice", device_map=device, dtype=dtype)
    args.out.mkdir(parents=True, exist_ok=True)

    import tempfile
    with tempfile.TemporaryDirectory() as temporary:
        normalized_ref = Path(temporary) / "reference.wav"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(ref), "-ac", "1", "-ar", "24000", str(normalized_ref)], check=True)
        voice_prompt = model.create_voice_clone_prompt(ref_audio=str(normalized_ref), ref_text=args.ref_text)
        for index, entry in enumerate(entries, 1):
            target = args.out / entry["file"]
            audio = model.generate(text=entry["text"], voice_clone_prompt=voice_prompt)
            wav = Path(temporary) / f"{entry['id']}.wav"
            sf.write(wav, audio[0], 24000)
            subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(wav), "-codec:a", "libmp3lame", "-b:a", "96k", str(target)], check=True)
            if target.stat().st_size == 0:
                raise RuntimeError(f"Empty output: {target}")
            print(f"[{index}/{len(entries)}] generated {entry['id']}", flush=True)

    manifest = args.out / "manifest.json"
    staged = args.out / "manifest.json.tmp"
    staged.write_text(json.dumps({"schema": 1, "clips": entries}, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    os.replace(staged, manifest)
    print(f"Ready: {len(entries)} clips; manifest: {manifest}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
