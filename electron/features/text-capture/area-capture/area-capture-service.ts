import { readClipboardImageWithRetry } from '@electron/lib/clipboard'
import { clipboard } from 'electron'
import { OcrService } from '../ocr'
import { InteractiveCaptureService } from './interactive-capture-to-clipboard'

export class AreaCaptureService {
  constructor(
    private readonly interactiveCaptureService: InteractiveCaptureService,
    private readonly ocrService: OcrService
  ) {}

  async captureTextFromScreen() {
    clipboard.clear()

    try {
      await this.interactiveCaptureService.captureToClipboard()
      const imageBuffer = await readClipboardImageWithRetry()
      const text = await this.ocrService.recognizeFromBuffer(imageBuffer, 'en')
      return text
    } catch (error) {
      console.error(error)
      throw new Error('Failed to capture text from screen')
    }
  }
}
