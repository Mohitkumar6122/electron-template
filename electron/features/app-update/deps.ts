import { autoUpdater } from 'electron-updater'
import { AppUpdateService } from './app-update-service'

const appUpdateService = new AppUpdateService(autoUpdater)

export const getDefaultAppUpdateService = () => {
  return appUpdateService
}
