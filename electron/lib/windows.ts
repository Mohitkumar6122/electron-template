import { BrowserWindow } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const windows = new Map<string, BrowserWindow>()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function getRendererDist(): string {
  const appRoot = process.env.APP_ROOT || path.join(__dirname, '..')
  return path.join(appRoot, 'dist')
}

function getPreloadPath(): string {
  const appRoot = process.env.APP_ROOT || path.join(__dirname, '..')
  const isDev = !!process.env.VITE_DEV_SERVER_URL
  if (isDev) {
    // In dev, vite-plugin-electron outputs preload into /dist-electron
    return path.join(appRoot, 'dist-electron', 'preload.mjs')
  }
  // In production, compiled files live next to this file in dist-electron
  return path.join(__dirname, 'preload.mjs')
}

export function getWindow(wid: string): BrowserWindow | undefined {
  return windows.get(wid)
}

export function closeWindow(wid: string): boolean {
  const win = windows.get(wid)
  if (!win) return false
  // Remove from map on close to avoid re-entrancy issues
  windows.delete(wid)
  win.close()
  return true
}

export function openWindow(
  id: string,
  target: string,
  options: Electron.BrowserWindowConstructorOptions = {}
): BrowserWindow {
  const existing = windows.get(id)
  if (existing) {
    if (existing.isMinimized()) existing.restore()
    existing.focus()
    existing.webContents.send('window:navigate', target)
    return existing
  }

  const appRoot = process.env.APP_ROOT || path.join(__dirname, '..')
  const win = new BrowserWindow({
    width: 840,
    height: 610,
    resizable: true,
    frame: false,
    titleBarStyle: 'hiddenInset',
    title: 'Text Capture',
    transparent: true,
    show: false,
    // Windows/Linux taskbar icon (ignored on macOS; use .icns in packaging)
    icon: path.join(appRoot, 'resources', 'icons', 'icon.png'),
    webPreferences: {
      preload: getPreloadPath(),
      ...(options.webPreferences || {})
    },
    ...options
  })

  const devUrl = process.env.VITE_DEV_SERVER_URL
  if (devUrl) {
    const devBase = devUrl.replace(/\/+$/, '')
    void win.loadURL(`${devBase}#/?target=${encodeURIComponent(target)}`)
    // win.webContents.openDevTools({ mode: 'detach' })
  } else {
    const filePath = path.join(getRendererDist(), 'index.html')
    // Hash-based routing requires the URL hash to include the path.
    // We still pass the `wid` as a query param so the loader can redirect.
    void win.loadFile(filePath, {
      hash: `/?target=${encodeURIComponent(target)}`
    })
  }

  win.once('ready-to-show', () => {
    win.show()
  })

  win.on('closed', () => {
    windows.delete(id)
  })

  windows.set(id, win)
  return win
}
