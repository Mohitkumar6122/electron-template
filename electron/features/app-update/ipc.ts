import { settingsStore } from '@electron/lib/settings'
import { app, ipcMain } from 'electron'
import { getDefaultAppUpdateService } from './deps'

const appUpdateService = getDefaultAppUpdateService()

export const registerAppUpdateIpc = () => {
  ipcMain.handle('app:get-version', () => {
    return app.getVersion()
  })

  ipcMain.handle('app-update:check-for-updates', async () => {
    const result = await appUpdateService.checkForUpdates()
    return result?.isUpdateAvailable ?? false
  })

  ipcMain.handle('app-update:get-download-progress', () => {
    return appUpdateService.getDownloadProgress()
  })

  ipcMain.handle('app-update:quit-and-install', () => {
    appUpdateService.quitAndInstall()
  })

  ipcMain.handle('app-update:get-is-update-available', () => {
    return appUpdateService.getIsUpdateAvailable()
  })

  ipcMain.handle('app-update:get-auto-update-enabled', () => {
    return settingsStore.get('autoUpdateEnabled')
  })

  ipcMain.handle(
    'app-update:set-auto-update-enabled',
    (_e, enabled: boolean) => {
      settingsStore.set('autoUpdateEnabled', enabled)
      return true
    }
  )
}
