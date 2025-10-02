import {
  GetDownloadProgressResponse,
  GetIsAutoUpdateEnabledResponse
} from './types'

export class AppUpdateApis {
  static async getIsUpdateAvailable(): Promise<boolean> {
    const res = await window.ipcRenderer.invoke(
      'app-update:get-is-update-available'
    )
    return res
  }

  static async checkForUpdates(): Promise<void> {
    await window.ipcRenderer.invoke('app-update:check-for-updates')
  }

  static async getDownloadProgress(): Promise<GetDownloadProgressResponse> {
    const res = await window.ipcRenderer.invoke(
      'app-update:get-download-progress'
    )
    return res
  }

  static async quitAndInstall(): Promise<void> {
    await window.ipcRenderer.invoke('app-update:quit-and-install')
  }

  static async getIsAutoUpdateEnabled(): Promise<GetIsAutoUpdateEnabledResponse> {
    const res = await window.ipcRenderer.invoke(
      'app-update:get-is-auto-update-enabled'
    )
    return res
  }

  static async setIsAutoUpdateEnabled(enabled: boolean): Promise<void> {
    await window.ipcRenderer.invoke(
      'app-update:set-is-auto-update-enabled',
      enabled
    )
  }
}
