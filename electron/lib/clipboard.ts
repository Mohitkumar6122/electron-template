import { clipboard } from 'electron'
import { sleep } from './time'

export async function readClipboardImageWithRetry(
  timeoutMs = 5000,
  intervalMs = 150
): Promise<Buffer> {
  const start = Date.now()
  for (;;) {
    const buf = readClipboardImageBuffer()
    if (buf && buf.length > 0) return buf
    if (Date.now() - start > timeoutMs)
      throw new Error('Timed out waiting for image in clipboard')
    await sleep(intervalMs)
  }
}

export function readClipboardImageBuffer(): Buffer | null {
  const image = clipboard.readImage()
  if (image.isEmpty()) return null
  return image.toPNG()
}
