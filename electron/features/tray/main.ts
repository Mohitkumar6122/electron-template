import maximize from '@electron/assets/icons/maximize'
import rotateCcw from '@electron/assets/icons/rotate-ccw'
import logoWhite from '@electron/assets/logo'
import {
  createTrayIcon,
  createTrayIconWithNotificationDot
} from '@electron/lib/images'
import { openWindow } from '@electron/lib/windows'
import { Menu, nativeTheme, Tray } from 'electron'
import { autoUpdater } from 'electron-updater'
import { getDefaultAppUpdateService } from '../app-update'
import { getDefaultTrayService } from './deps'

const appUpdateService = getDefaultAppUpdateService()

// save a reference to the Tray object globally to avoid garbage collection
let tray: Tray | null = null
let isUpdateDownloaded = true

nativeTheme.on('updated', () => {
  console.log(
    nativeTheme.shouldUseDarkColors,
    nativeTheme.shouldUseHighContrastColors,
    nativeTheme.shouldUseInvertedColorScheme
  )
})

const logoIcon = createTrayIcon(logoWhite)
const logoIconWithNotificationDot = createTrayIconWithNotificationDot(logoWhite)
const maximizeIcon = createTrayIcon(maximize)
const dotIcon = createTrayIcon(rotateCcw, '#FF8A00')

if (process.platform === 'darwin') {
  logoIcon.setTemplateImage(true)
  maximizeIcon.setTemplateImage(true)
  logoIconWithNotificationDot.setTemplateImage(true)
}

// The Tray can only be instantiated after the 'ready' event is fired
const buildContextMenu = () => {
  const items: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = []
  if (isUpdateDownloaded) {
    items.push({
      icon: dotIcon,
      label: 'Restart to install new updates',
      click: () => {
        void appUpdateService.quitAndInstall()
      }
    })
    items.push({ type: 'separator' })
  }
  items.push({
    label: 'Capture Text',
    icon: maximizeIcon,
    click: () => {
      const trayService = getDefaultTrayService()
      void trayService.captureTextFromScreen()
    }
  })
  items.push({ type: 'separator' })
  items.push({
    label: 'About Text Capture...',
    click: () => {
      void openWindow('settings', '/settings/about')
    }
  })
  items.push({
    label: 'Check for Updates...',
    click: async () => {
      await appUpdateService.checkForUpdates()
      void openWindow('settings', '/settings/about')
    }
  })
  items.push({ type: 'separator' })
  items.push({
    label: 'Settings...',
    click: () => {
      void openWindow('settings', '/settings/general')
    }
  })
  items.push({ type: 'separator' })
  items.push({ label: 'Quit', role: 'quit' })
  return Menu.buildFromTemplate(items)
}

const getTrayIcon = () => {
  return isUpdateDownloaded ? logoIconWithNotificationDot : logoIcon
}

const updateTrayAppearance = () => {
  if (!tray) return
  tray.setImage(getTrayIcon())
  tray.setContextMenu(buildContextMenu())
}

export const createTray = () => {
  tray = new Tray(getTrayIcon())
  tray.setContextMenu(buildContextMenu())

  // Subscribe to updater events to toggle badge and menu header
  autoUpdater.on('update-downloaded', () => {
    isUpdateDownloaded = true
    updateTrayAppearance()
  })
  autoUpdater.on('update-not-available', () => {
    isUpdateDownloaded = false
    updateTrayAppearance()
  })
  autoUpdater.on('error', () => {
    // if an error occurs, we do not show the badge
    isUpdateDownloaded = false
    updateTrayAppearance()
  })
}
