import { InteractiveCaptureService } from './interacive-capture-service-interface'

export abstract class BaseInteractiveCaptureToClipboard
  implements InteractiveCaptureService
{
  abstract captureToClipboard(): Promise<void>
}
