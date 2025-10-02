import { AppleVisionOcrService } from './apple-vision-ocr-service'
import { OcrService } from './ocr-service-interface'
import { WindowsOcrService } from './windows-ocr-service'

export class OcrServiceFactory {
  static create(): OcrService {
    if (process.platform === 'darwin') {
      return new AppleVisionOcrService()
    }
    if (process.platform === 'win32') {
      return new WindowsOcrService()
    }
    throw new Error('OCR is only supported on macOS and Windows')
  }
}
