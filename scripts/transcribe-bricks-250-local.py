#!/usr/bin/env python3
"""Transcribe selected Bricks 250 tracks locally for source verification."""

import argparse
import json
import os
import sys
from pathlib import Path


def parse_args():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True)
    parser.add_argument("--audio-dir", required=True)
    parser.add_argument("--packages", required=True)
    parser.add_argument("--cache-dir", required=True)
    parser.add_argument("--model", default="small.en")
    parser.add_argument("--units", default="")
    parser.add_argument("--force", action="store_true")
    return parser.parse_args()


def count_words(text):
    return len(text.strip().split())


def main():
    args = parse_args()
    packages = str(Path(args.packages).resolve())
    sys.path.insert(0, packages)
    os.environ["HF_HOME"] = str(Path(args.cache_dir).resolve())
    from faster_whisper import WhisperModel

    data_path = Path(args.data).resolve()
    audio_dir = Path(args.audio_dir).resolve()
    output_path = data_path.with_name(data_path.stem + ".local-whisper.json")
    data = json.loads(data_path.read_text(encoding="utf-8"))
    units = data["levels"]["2"]
    requested = {int(value) for value in args.units.split(",") if value.strip()}
    selected = [
        unit for unit in units
        if (not requested and unit.get("original", {}).get("needsReview")) or unit["unit"] in requested
    ]
    cache = json.loads(output_path.read_text(encoding="utf-8")) if output_path.exists() else {}

    print(f"Loading local Whisper model {args.model} on CPU int8", flush=True)
    model = WhisperModel(
        args.model,
        device="cpu",
        compute_type="int8",
        download_root=str(Path(args.cache_dir).resolve()),
    )

    for unit in selected:
        key = str(unit["unit"])
        if key in cache and not args.force:
            print(f"Unit {key}: using cached transcript", flush=True)
            continue
        track = f"Track{unit['unit'] + 1:02d}.mp3"
        audio_path = audio_dir / track
        if not audio_path.exists():
            raise FileNotFoundError(audio_path)
        print(f"Unit {key}: transcribing {track}", flush=True)
        segments_iter, info = model.transcribe(
            str(audio_path),
            language="en",
            beam_size=5,
            best_of=5,
            temperature=0,
            condition_on_previous_text=False,
            vad_filter=True,
            vad_parameters={"min_silence_duration_ms": 500},
            word_timestamps=True,
            initial_prompt=unit["title"],
        )
        segments = []
        for segment in segments_iter:
            text = segment.text.strip()
            if text:
                segments.append({
                    "start": round(segment.start, 2),
                    "end": round(segment.end, 2),
                    "text": text,
                })
        transcript = " ".join(segment["text"] for segment in segments)
        cache[key] = {
            "unit": unit["unit"],
            "title": unit["title"],
            "track": track,
            "duration": round(info.duration, 2),
            "languageProbability": round(info.language_probability, 5),
            "wordCount": count_words(transcript),
            "segments": segments,
            "transcript": transcript,
            "ocrParagraphs": unit["original"]["paragraphs"],
            "reviewNote": unit["original"].get("reviewNote", ""),
        }
        output_path.write_text(json.dumps(cache, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Unit {key}: wrote {len(segments)} segments, {cache[key]['wordCount']} words", flush=True)

    print(f"Wrote {output_path}", flush=True)


if __name__ == "__main__":
    main()
