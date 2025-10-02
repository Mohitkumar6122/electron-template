import { InteractiveCaptureService } from './interacive-capture-service-interface'
import { MacInteractiveCaptureToClipboard } from './mac-interactive-capture-to-clipboard'
import { WindowsInteractiveCaptureService } from './windows-interactive-capture-service'

export class InteractiveCaptureServiceFactory {
  static create(): InteractiveCaptureService {
    if (process.platform === 'darwin') {
      return new MacInteractiveCaptureToClipboard()
    }
    if (process.platform === 'win32') {
      return new WindowsInteractiveCaptureService()
    }
    throw new Error(
      'Interactive capture service is only supported on macOS and Windows'
    )
  }
}
