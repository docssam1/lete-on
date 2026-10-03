# 독쌤 OmniVoice 음성

이 폴더는 수업·소개 화면에서 재생하는 합성 MP3와 파일 목록, 전사 검수 결과를 보관한다.
승인된 기존 MP3는 보존한다. 대사 변경으로 사용하지 않는 파일은 매니페스트에서만 빠진다.

2026-10-03 원장 결정: **전체 기능 구현·검수를 마친 뒤 음성을 한 번에 완성한다.**
그때까지 새 합성은 실행하지 않으며, 아래 명령은 마지막 음성 작업용이다.

## 누락분만 생성

`python scripts/check-docssam-voice.py`로 누락된 대사를 확인한다. 공부 대사는
`docssam-clone-v2-slow`(생성 속도 0.8, 재생 속도 1), 소개 대사는
`docssam-clone-v1`(소개 재생 속도 1)을 사용한다.

GPU 환경과 참조 녹음은 재사용하고, 별도 E: 출력에서 생성한다. 예:

```powershell
$env:HF_HOME = 'E:\Codex\model-cache\science-lab-omnivoice'
$env:TEMP = 'E:\Codex\private-audio\work'
$env:TMP = $env:TEMP
python scripts/omnivoice-docssam.py `
  --ref E:\Codex\private-audio\reference.wav --ref-ready `
  --ref-text-file E:\Codex\private-audio\reference-text.txt `
  --work-dir E:\Codex\private-audio\work `
  --out E:\Codex\private-audio\staged `
  --device cuda:0 --asr-device cpu --speed 0.8
```

`--ref-text-file`에는 해당 녹음의 확인된 전사만 넣는다. 기존 모델 캐시를
사용할 때는 `--model <OmniVoice 로컬 경로>`와 `--asr-model <Whisper 로컬 경로>`를
지정할 수 있다. 기존 공개 폴더와 별도 출력 폴더 양쪽에 있는 파일은 건너뛴다.
한 줄씩 `report.json`을 저장하므로 중단 후 같은 명령으로 재개한다.

검수는 원문을 발음용 한글로 바꾼 뒤 한국어 Whisper 전사와 비교한다.
CER가 0.35를 넘으면 최대 3회 시도 후 공개 MP3에서 제외한다.
공개 반영 시 통과한 MP3와 검수 보고서를 합치고 `--manifest-only`로 목록을 만든다.
기존 파일의 해시 보존, MP3 재생, 수업 화면의 실제 파일 연결을 확인한다.

원본 녹음·참조 WAV·참조 전사·참조가 들어 있는 듣기 HTML·모델·실행 환경은
비공개 E: 폴더에 두며 GitHub에 올리지 않는다. Google TTS는 꺼 둔다.
