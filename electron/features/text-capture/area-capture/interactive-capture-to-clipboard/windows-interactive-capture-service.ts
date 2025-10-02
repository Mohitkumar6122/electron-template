import { execFileAsync } from '@electron/lib/processes'
import { BaseInteractiveCaptureToClipboard } from './base-interactive-capture-to-clipboard'

export class WindowsInteractiveCaptureService extends BaseInteractiveCaptureToClipboard {
  async captureToClipboard(): Promise<void> {
    // Trigger Windows modern snipping experience; image will be placed into clipboard
    // explorer.exe ms-screenclip: returns immediately; we'll poll the clipboard after this
    try {
      await execFileAsync('explorer.exe', ['ms-screenclip:'])
    } catch (err) {
      // Fallback to legacy snippingtool
      try {
        await execFileAsync('snippingtool', ['/clip'])
      } catch (err2) {
        // ignore
        void err
        void err2
      }
    }
  }
}
