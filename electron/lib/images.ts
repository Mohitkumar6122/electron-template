import { nativeImage } from 'electron'
import { PNG } from 'pngjs'

const dataUrlToBuffer = (dataUrl: string): Buffer => {
  const base64 = dataUrl.split(',')[1] ?? ''
  return Buffer.from(base64, 'base64')
}

const bufferToDataUrl = (buffer: Buffer): string => {
  const base64 = buffer.toString('base64')
  return `data:image/png;base64,${base64}`
}

const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)
  return { r, g, b }
}

const applyColorToPng = (
  png: PNG,
  color: { r: number; g: number; b: number }
): void => {
  for (let i = 0; i < png.data.length; i += 4) {
    const alpha = png.data[i + 3] ?? 0
    if (alpha > 0) {
      // Apply color while preserving alpha
      png.data[i] = color.r
      png.data[i + 1] = color.g
      png.data[i + 2] = color.b
    }
  }
}

export const createTrayIcon = (dataUrls: string[], color?: string) => {
  if (color) {
    // When color is provided, apply it to the icon
    const rgb = hexToRgb(color)
    const firstBuf = dataUrlToBuffer(dataUrls[0])
    const firstPng = PNG.sync.read(firstBuf)
    applyColorToPng(firstPng, rgb)
    const firstOut = PNG.sync.write(firstPng)

    const icon = nativeImage.createFromDataURL(bufferToDataUrl(firstOut))

    dataUrls.forEach((dataUrl, index) => {
      if (index === 0) return
      const buf = dataUrlToBuffer(dataUrl)
      const png = PNG.sync.read(buf)
      applyColorToPng(png, rgb)
      const out = PNG.sync.write(png)
      icon.addRepresentation({
        scaleFactor: index * 2,
        dataURL: bufferToDataUrl(out)
      })
    })

    // Don't set template image when color is specified, so the color is preserved
    return icon
  }

  // Default behavior without color
  const icon = nativeImage.createFromDataURL(dataUrls[0])

  dataUrls.forEach((dataUrl, index) => {
    if (index === 0) return
    icon.addRepresentation({
      scaleFactor: index * 2,
      dataURL: dataUrl
    })
  })

  if (process.platform === 'darwin') {
    icon.setTemplateImage(true)
  }

  return icon
}

const ORANGE_RGB = { r: 255, g: 138, b: 0 }

const drawNotificationDotOnPng = (png: PNG, margin: number = 0): void => {
  const w = png.width
  const h = png.height
  const minSide = Math.min(w, h)

  const radius = Math.max(2, Math.round(minSide * 0.18))

  const cx = w - radius - margin
  const cy = radius + margin

  const r2 = radius * radius

  for (
    let y = Math.max(0, cy - radius);
    y < Math.min(h, cy + radius + 1);
    y++
  ) {
    for (
      let x = Math.max(0, cx - radius);
      x < Math.min(w, cx + radius + 1);
      x++
    ) {
      const dx = x - cx
      const dy = y - cy
      if (dx * dx + dy * dy <= r2) {
        const idx = (w * y + x) << 2
        png.data[idx] = ORANGE_RGB.r
        png.data[idx + 1] = ORANGE_RGB.g
        png.data[idx + 2] = ORANGE_RGB.b
        png.data[idx + 3] = 255
      }
    }
  }
}

export const createTrayIconWithNotificationDot = (dataUrls: string[]) => {
  // Build a nativeImage with multiple representations, each overlaid with a dot
  const first = dataUrls[0]
  const firstBuf = dataUrlToBuffer(first)
  const firstPng = PNG.sync.read(firstBuf)
  drawNotificationDotOnPng(firstPng)
  const firstOut = PNG.sync.write(firstPng)

  const icon = nativeImage.createFromDataURL(bufferToDataUrl(firstOut))

  dataUrls.forEach((dataUrl, index) => {
    if (index === 0) return
    const buf = dataUrlToBuffer(dataUrl)
    const png = PNG.sync.read(buf)
    drawNotificationDotOnPng(png)
    const out = PNG.sync.write(png)
    icon.addRepresentation({
      scaleFactor: index + 1,
      dataURL: bufferToDataUrl(out)
    })
  })

  // Important: do NOT set template image on macOS so the orange dot keeps color
  return icon
}
