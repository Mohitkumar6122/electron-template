// import { execFileAsync } from '@electron/lib/processes'
import { execFileAsync } from '@electron/lib/processes'
import { getResourcesRoot } from '@electron/lib/resources'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { BaseOcrService } from './base-ocr-service'
import { OcrLanguage } from './types'

export class WindowsOcrService extends BaseOcrService {
  async recognizeFromBuffer(
    image: Buffer,
    language?: OcrLanguage
  ): Promise<string> {
    const tmpPath = path.join(
      os.tmpdir(),
      `tc_ocr_${Date.now()}_${Math.random().toString(36).slice(2)}.png`
    )
    await fs.writeFile(tmpPath, image as unknown as string)
    try {
      const cli = this.getWindowsOcrCliPath()
      const args = [tmpPath]
      if (language) args.push(language)
      const { stdout } = await execFileAsync(cli, args)
      return stdout
    } finally {
      try {
        await fs.unlink(tmpPath)
      } catch (err) {
        // ignore unlink errors
        void err
      }
    }
  }

  private getWindowsOcrCliPath() {
    return path.join(getResourcesRoot(), 'native', 'windows', 'OcrCli.exe')
  }
}
