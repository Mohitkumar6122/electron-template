import { BrowserWindow, ipcMain, shell, systemPreferences } from 'electron'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { settingsStore } from '../../lib/settings'
import { closeWindow, openWindow } from '../../lib/windows'

let win: BrowserWindow | null = null

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function getPreloadPath(): string {
  // In both dev and prod, vite-plugin-electron outputs preload to dist-electron/preload.mjs
  return path.join(__dirname, 'preload.mjs')
}

export function createOnboardingWindow(): BrowserWindow {
  if (win) return win
  win = openWindow('welcome', '/onboarding/welcome', {
    width: 1280,
    height: 720,
    resizable: false,
    frame: false,
    transparent: true,
    hasShadow: false,
    titleBarStyle: 'hiddenInset',
    title: 'Welcome to Text Capture',
    webPreferences: {
      preload: getPreloadPath()
    }
  })
  if (process.platform === 'darwin') {
    win.setWindowButtonVisibility(false)
  }
  win.on('closed', () => {
    win = null
  })
  return win
}

export function registerOnboardingIpc(): void {
  ipcMain.handle('onboarding:getStatus', () => {
    const isMac = process.platform === 'darwin'
    let accessibilityGranted: boolean | null = null
    if (isMac) {
      try {
        accessibilityGranted =
          systemPreferences.isTrustedAccessibilityClient(false)
      } catch {
        accessibilityGranted = null
      }
    }
    return {
      firstRunCompleted: settingsStore.get('firstRunCompleted'),
      platform: process.platform,
      isMac,
      permissions: {
        accessibilityGranted,
        screenRecording: 'unknown'
      }
    }
  })

  ipcMain.handle(
    'onboarding:openPref',
    (_e, key: 'accessibility' | 'screen') => {
      if (process.platform !== 'darwin') return false
      const map = {
        accessibility:
          'x-apple.systempreferences:com.apple.preference.security?Privacy_Accessibility',
        screen:
          'x-apple.systempreferences:com.apple.preference.security?Privacy_ScreenCapture'
      } as const
      const url = map[key]
      if (!url) return false
      void shell.openExternal(url)
      return true
    }
  )

  ipcMain.handle('onboarding:complete', () => {
    settingsStore.set('firstRunCompleted', true)
    closeWindow('welcome')
    return true
  })
}
