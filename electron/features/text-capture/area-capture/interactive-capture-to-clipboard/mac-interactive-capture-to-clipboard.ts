import { execFileAsync } from '@electron/lib/processes'
import { BaseInteractiveCaptureToClipboard } from './base-interactive-capture-to-clipboard'

export class MacInteractiveCaptureToClipboard extends BaseInteractiveCaptureToClipboard {
  async captureToClipboard(): Promise<void> {
    await execFileAsync('screencapture', ['-i', '-c'])
  }
}
