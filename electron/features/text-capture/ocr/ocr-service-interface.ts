import { OcrLanguage } from './types'

export interface OcrService {
  recognizeFromBuffer(image: Buffer, language?: OcrLanguage): Promise<string>
  recognizeFromPath(imagePath: string, language?: OcrLanguage): Promise<string>
}
