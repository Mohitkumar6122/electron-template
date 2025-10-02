import { settingsStore } from '@electron/lib/settings'
import { app } from 'electron'
import { getDefaultAppUpdateService } from './deps'

const appUpdateService = getDefaultAppUpdateService()

/**
 * Auto update on startup and every 12 hours
 */
export const registerAppAutoUpdate = () => {
  const shouldAutoUpdate = () => Boolean(settingsStore.get('autoUpdateEnabled'))
  if (shouldAutoUpdate()) {
    void appUpdateService.checkForUpdates()
  }

  const TWELVE_HOURS = 12 * 60 * 60 * 1000
  const timer = setInterval(() => {
    if (shouldAutoUpdate()) {
      void appUpdateService.checkForUpdates()
    }
  }, TWELVE_HOURS)

  app.on('before-quit', () => clearInterval(timer))
}
