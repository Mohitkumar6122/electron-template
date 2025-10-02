import Foundation
import Vision
import ImageIO
import CoreGraphics

func loadCGImage(from path: String) throws -> CGImage {
    let url = URL(fileURLWithPath: path)
    guard let src = CGImageSourceCreateWithURL(url as CFURL, nil) else {
        throw NSError(domain: "vision-ocr", code: 1, userInfo: [NSLocalizedDescriptionKey: "Failed to create image source"]) 
    }
    guard let image = CGImageSourceCreateImageAtIndex(src, 0, nil) else {
        throw NSError(domain: "vision-ocr", code: 2, userInfo: [NSLocalizedDescriptionKey: "Failed to decode image"]) 
    }
    return image
}

func recognizeText(cgImage: CGImage, languages: [String]?) throws -> String {
    var recognized: [String] = []
    let request = VNRecognizeTextRequest { request, error in
        if let error = error {
            fputs("OCR error: \(error)\n", stderr)
            return
        }
        guard let observations = request.results as? [VNRecognizedTextObservation] else { return }
        for obs in observations {
            if let top = obs.topCandidates(1).first {
                recognized.append(top.string)
            }
        }
    }
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = true
    if let langs = languages, !langs.isEmpty {
        request.recognitionLanguages = langs
    }

    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    try handler.perform([request])
    return recognized.joined(separator: "\n")
}

func main() {
    var args = CommandLine.arguments
    guard args.count >= 2 else {
        fputs("Usage: vision-ocr <imagePath> [lang1 lang2 ...]\n", stderr)
        exit(2)
    }
    // remove executable path
    _ = args.removeFirst()
    let imagePath = args.removeFirst()
    let languages = args.isEmpty ? nil : args
    do {
        let cg = try loadCGImage(from: imagePath)
        let text = try recognizeText(cgImage: cg, languages: languages)
        print(text)
    } catch {
        fputs("\(error)\n", stderr)
        exit(1)
    }
}
main()


