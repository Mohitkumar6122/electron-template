import { clipboard } from 'electron'
import { AreaCaptureService } from '../text-capture'

export class TrayService {
  constructor(private readonly areaCaptureService: AreaCaptureService) {}

  async captureTextFromScreen() {
    console.info('Capturing text from screen')
    try {
      const text = await this.areaCaptureService.captureTextFromScreen()
      console.info(text)
      clipboard.writeText(text)
    } catch (error) {
      console.error('Failed to capture text from screen', error)
    }
  }
}
