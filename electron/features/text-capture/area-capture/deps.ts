import { OcrServiceFactory } from '../ocr'
import { AreaCaptureService } from './area-capture-service'
import { InteractiveCaptureServiceFactory } from './interactive-capture-to-clipboard'

export const getDefaultAreaCaptureService = () => {
  const interactiveCaptureService = InteractiveCaptureServiceFactory.create()
  const ocrService = OcrServiceFactory.create()
  return new AreaCaptureService(interactiveCaptureService, ocrService)
}
