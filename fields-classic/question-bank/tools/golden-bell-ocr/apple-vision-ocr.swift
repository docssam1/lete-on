// 답 없는 문제지를 Apple Vision(맥 내장, 무료·기기 안에서만)으로 읽는다. 원장 Mac에서 돌린다.
//   swift apple-vision-ocr.swift <답 없는 문제지.pdf 또는 쪽 그림 폴더> <결과 폴더> [5,6,12]
// 쪽마다 <결과>/pNN.png(쪽 그림, PDF일 때) · pNN.words.json(낱말·상자·신뢰도) · pNN.txt(줄 단위) · pNN-boxes.png
// (신뢰도 0.8 미만 낱말은 빨간 상자). 결과 형식은 vision-ocr.mjs(Google)와 같아서 pptx-text.py를 그대로 쓴다.
// PDF는 110dpi로 그린다 — 저장소 도구(PyMuPDF dpi=110)와 같은 크기라 상자 좌표가 맞는다.
// 이미 pNN.words.json이 있는 쪽은 건너뛴다. 원본 그림이 들어 있으므로 결과 폴더는 git에 넣지 않는다.
import AppKit
import Foundation
import PDFKit
import Vision

let args = CommandLine.arguments
guard args.count >= 3 else {
  print("usage: swift apple-vision-ocr.swift <clean.pdf | pages folder> <out folder> [5,6,12]")
  exit(2)
}
let input = URL(fileURLWithPath: args[1]), outDir = URL(fileURLWithPath: args[2])
let only: Set<Int>? = args.count > 3 ? Set(args[3].split(separator: ",").compactMap { Int($0) }) : nil
let fm = FileManager.default
try fm.createDirectory(at: outDir, withIntermediateDirectories: true)

func pad(_ n: Int) -> String { n < 10 ? "0\(n)" : "\(n)" }

// 쪽 목록: (번호, CGImage를 만드는 함수)
var pages: [(Int, () -> CGImage?)] = []
if input.pathExtension.lowercased() == "pdf" {
  guard let doc = PDFDocument(url: input) else { print("PDF를 열 수 없습니다: \(input.path)"); exit(1) }
  for i in 0..<doc.pageCount {
    pages.append((i + 1, {
      guard let page = doc.page(at: i) else { return nil }
      let box = page.bounds(for: .mediaBox), scale = 110.0 / 72.0
      let w = Int((box.width * scale).rounded()), h = Int((box.height * scale).rounded())
      guard let ctx = CGContext(data: nil, width: w, height: h, bitsPerComponent: 8, bytesPerRow: 0,
                                space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.noneSkipLast.rawValue) else { return nil }
      ctx.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
      ctx.fill(CGRect(x: 0, y: 0, width: w, height: h))
      ctx.scaleBy(x: scale, y: scale)
      page.draw(with: .mediaBox, to: ctx)
      return ctx.makeImage()
    }))
  }
} else {
  let files = try fm.contentsOfDirectory(atPath: input.path).filter { ["png", "jpg", "jpeg"].contains(($0 as NSString).pathExtension.lowercased()) }.sorted()
  for f in files {
    let digits = f.filter(\.isNumber)
    guard let n = Int(digits) else { continue }
    let url = input.appendingPathComponent(f)
    pages.append((n, {
      guard let img = NSImage(contentsOf: url) else { return nil }
      return img.cgImage(forProposedRect: nil, context: nil, hints: nil)
    }))
  }
}

func savePNG(_ image: CGImage, _ url: URL) {
  let rep = NSBitmapImageRep(cgImage: image)
  try? rep.representation(using: .png, properties: [:])?.write(to: url)
}

// 한국어 지원 확인(지원하지 않는 macOS면 여기서 멈춘다)
let probe = VNRecognizeTextRequest()
probe.recognitionLevel = .accurate
if let langs = try? probe.supportedRecognitionLanguages(), !langs.contains("ko-KR") {
  print("이 macOS의 Vision은 한국어(ko-KR)를 지원하지 않습니다. 지원 언어: \(langs.joined(separator: ", "))")
  exit(1)
}

var done = 0, skipped = 0, failed = 0
for (n, make) in pages {
  if let only, !only.contains(n) { continue }
  let name = "p\(pad(n))"
  let wordsURL = outDir.appendingPathComponent("\(name).words.json")
  if fm.fileExists(atPath: wordsURL.path) { skipped += 1; continue }
  guard let cg = make() else { print("FAIL \(name): 그림을 만들 수 없음"); failed += 1; continue }
  if input.pathExtension.lowercased() == "pdf" { savePNG(cg, outDir.appendingPathComponent("\(name).png")) }
  let W = CGFloat(cg.width), H = CGFloat(cg.height)

  let req = VNRecognizeTextRequest()
  req.recognitionLevel = .accurate
  req.recognitionLanguages = ["ko-KR", "en-US"]
  req.usesLanguageCorrection = false // 식·수는 사전 교정을 하면 망가진다
  do { try VNImageRequestHandler(cgImage: cg, options: [:]).perform([req]) } catch {
    print("FAIL \(name): \(error.localizedDescription)"); failed += 1; continue
  }

  // 낱말 = 공백으로 나눈 조각. 상자는 Vision 정규 좌표(왼쪽 아래 원점) → 그림 픽셀(왼쪽 위 원점).
  var words: [[String: Any]] = []
  var lines: [(cy: CGFloat, h: CGFloat, items: [(x: CGFloat, text: String)])] = []
  let re = try! NSRegularExpression(pattern: "\\S+")
  for obs in req.results ?? [] {
    guard let cand = obs.topCandidates(1).first else { continue }
    let s = cand.string
    for m in re.matches(in: s, range: NSRange(location: 0, length: (s as NSString).length)) {
      guard let r = Range(m.range, in: s) else { continue }
      let rect = (try? cand.boundingBox(for: r))?.boundingBox ?? obs.boundingBox
      let box = [Int(rect.minX * W), Int((1 - rect.maxY) * H), Int(rect.maxX * W), Int((1 - rect.minY) * H)]
      words.append(["text": String(s[r]), "conf": Double(cand.confidence), "box": box])
    }
    // 줄: 세로 가운데가 줄 높이의 절반 안이면 같은 줄
    let ob = obs.boundingBox
    let cy = (1 - ob.midY) * H, h = ob.height * H, x = ob.minX * W
    if let i = lines.firstIndex(where: { abs($0.cy - cy) <= max($0.h, h) / 2 }) {
      lines[i].items.append((x, s))
    } else {
      lines.append((cy, h, [(x, s)]))
    }
  }
  let text = lines.sorted { $0.cy < $1.cy }.map { $0.items.sorted { $0.x < $1.x }.map { $0.text }.joined(separator: " ") }.joined(separator: "\n") + "\n"

  let json = try JSONSerialization.data(withJSONObject: words, options: [.withoutEscapingSlashes])
  try json.write(to: wordsURL)
  try text.write(to: outDir.appendingPathComponent("\(name).txt"), atomically: true, encoding: .utf8)

  // 확인용 그림: 신뢰도 낮은 낱말은 빨강, 나머지는 옅은 파랑
  let rep = NSBitmapImageRep(cgImage: cg)
  NSGraphicsContext.saveGraphicsState()
  NSGraphicsContext.current = NSGraphicsContext(bitmapImageRep: rep)
  var low = 0
  for w in words {
    let b = w["box"] as! [Int], c = w["conf"] as! Double
    let rect = NSRect(x: CGFloat(b[0]), y: H - CGFloat(b[3]), width: CGFloat(b[2] - b[0]), height: CGFloat(b[3] - b[1]))
    let path = NSBezierPath(rect: rect)
    if c < 0.8 { low += 1; NSColor(red: 0.86, green: 0.12, blue: 0.12, alpha: 1).setStroke(); path.lineWidth = 3 }
    else { NSColor(red: 0.35, green: 0.55, blue: 0.9, alpha: 1).setStroke(); path.lineWidth = 1 }
    path.stroke()
  }
  NSGraphicsContext.restoreGraphicsState()
  try? rep.representation(using: .png, properties: [:])?.write(to: outDir.appendingPathComponent("\(name)-boxes.png"))

  print("OK \(name): words \(words.count), low-confidence \(low)")
  done += 1
}
print("ocr done \(done), skipped \(skipped), failed \(failed)")
exit(failed > 0 ? 1 : 0)
