// Local OCR candidates only. Never a source transcription or handwriting classifier.
// Build: swiftc scripts/vision-text-candidates.swift -o /private/output/vision-text-candidates
import Foundation
import Vision
import ImageIO
import CryptoKit

enum InputError: Error, CustomStringConvertible {
    case invalid(String)
    var description: String { switch self { case .invalid(let message): return message } }
}

func sha256(_ data: Data) -> String {
    SHA256.hash(data: data).map { String(format: "%02x", $0) }.joined()
}

func run() throws {
    let args = CommandLine.arguments
    guard args.count == 3 || args.count == 4 else {
        throw InputError.invalid("Usage: vision-text-candidates INPUT.png OUTPUT.json [ko-KR,en-US]")
    }
    let input = URL(fileURLWithPath: args[1]).standardizedFileURL.resolvingSymlinksInPath()
    let output = URL(fileURLWithPath: args[2]).standardizedFileURL.resolvingSymlinksInPath()
    let repository = URL(fileURLWithPath: #filePath).deletingLastPathComponent()
        .deletingLastPathComponent().standardizedFileURL.resolvingSymlinksInPath()
    guard !output.path.hasPrefix(repository.path + "/") else {
        throw InputError.invalid("Private OCR output must be outside the code repository.")
    }
    guard input != output, !FileManager.default.fileExists(atPath: output.path) else {
        throw InputError.invalid("Output must be a new file; source and existing results are never overwritten.")
    }
    let raw = try Data(contentsOf: input)
    guard let source = CGImageSourceCreateWithData(raw as CFData, nil),
          CGImageSourceGetCount(source) == 1,
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        throw InputError.invalid("Input must be one readable rendered page image.")
    }
    let properties = CGImageSourceCopyPropertiesAtIndex(source, 0, nil) as? [CFString: Any]
    let orientation = properties?[kCGImagePropertyOrientation] as? Int ?? 1
    guard orientation == 1 else {
        throw InputError.invalid("Input orientation must be baked into pixels before OCR.")
    }
    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = false
    request.minimumTextHeight = 0
    let languages = (args.count == 4 ? args[3] : "ko-KR,en-US").split(separator: ",").map(String.init)
    let supported = try request.supportedRecognitionLanguages()
    guard !languages.isEmpty, Set(languages).count == languages.count,
          languages.allSatisfy({ supported.contains($0) }) else {
        throw InputError.invalid("Requested OCR languages unavailable: \(languages); supported: \(supported)")
    }
    request.recognitionLanguages = languages
    let started = Date()
    try VNImageRequestHandler(cgImage: image, options: [:]).perform([request])
    guard let results = request.results else {
        throw InputError.invalid("Vision returned no result object; this is not an empty-page success.")
    }
    let width = Double(image.width), height = Double(image.height)
    let observations: [[String: Any]] = results.enumerated().compactMap { index, observation in
        let candidates = observation.topCandidates(3)
        guard let top = candidates.first else { return nil }
        let box = observation.boundingBox
        // Vision uses normalized bottom-left coordinates. Review uses pixel top-left.
        let bbox = [max(0, floor(box.minX * width)), max(0, floor((1 - box.maxY) * height)),
                    min(width, ceil(box.maxX * width)), min(height, ceil((1 - box.minY) * height))]
        return ["id": "ocr-\(index + 1)", "text": top.string, "confidence": top.confidence,
                "bboxPixels": bbox,
                "normalizedBoxBottomLeft": [box.minX, box.minY, box.width, box.height],
                "alternatives": candidates.map { ["text": $0.string, "confidence": $0.confidence] as [String: Any] },
                "classification": "unknown-print-or-handwriting", "reviewStatus": "unreviewed"]
    }
    let after = try Data(contentsOf: input)
    guard after == raw else { throw InputError.invalid("Source changed during recognition.") }
    let result: [String: Any] = [
        "schemaVersion": "gfield.local-text-candidates.v1",
        "sourceImageSHA256": sha256(raw), "imageWidth": image.width, "imageHeight": image.height,
        "engine": ["name": "Apple Vision VNRecognizeTextRequest", "requestRevision": request.revision,
                   "operatingSystem": ProcessInfo.processInfo.operatingSystemVersionString,
                   "executableSHA256": sha256(try Data(contentsOf: URL(fileURLWithPath: args[0])))],
        "recognitionLanguages": languages, "recognitionLevel": "accurate", "languageCorrection": false,
        "coordinateSystem": "rendered-page-top-left-pixels", "observations": observations,
        "classification": "unknown-print-or-handwriting", "reviewStatus": "unreviewed",
        "releaseReady": false, "handwritingAccuracyMeasured": false, "mathAccuracyMeasured": false,
        "externalRequests": 0, "elapsedSeconds": Date().timeIntervalSince(started),
        "limitations": ["OCR may omit or substitute math symbols, Korean, or handwriting.",
                       "No automatic separation of printed text, teacher answers, or student handwriting.",
                       "No masking, text correction, formula reconstruction, or hidden-content recovery."]
    ]
    let data = try JSONSerialization.data(withJSONObject: result, options: [.prettyPrinted, .sortedKeys])
    try data.write(to: output, options: [.withoutOverwriting])
    print("Local OCR candidates: \(observations.count); unreviewed; releaseReady=false")
}

do { try run() }
catch { FileHandle.standardError.write(Data("ERROR: \(error)\n".utf8)); exit(2) }
