export class AppVersionApis {
  static async getAppVersion(): Promise<string> {
    const res = await window.ipcRenderer.invoke('app:get-version')
    return res
  }
}
