import fs from 'node:fs/promises'
import { OcrService } from './ocr-service-interface'
import { OcrLanguage } from './types'

export abstract class BaseOcrService implements OcrService {
  /**
   * Perform OCR on an image at the given absolute path.
   */
  async recognizeFromPath(
    imagePath: string,
    language?: OcrLanguage
  ): Promise<string> {
    const data = await fs.readFile(imagePath)
    return this.recognizeFromBuffer(data, language)
  }

  /**
   * Perform OCR on an image buffer.
   */
  abstract recognizeFromBuffer(
    image: Buffer,
    language?: OcrLanguage
  ): Promise<string>
}
