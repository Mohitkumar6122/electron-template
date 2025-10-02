// app-update-service.ts (main process)
import type {
  AppUpdater,
  CancellationToken,
  UpdateCheckResult
} from 'electron-updater'
import { CancellationToken as UpdaterCancellationToken } from 'electron-updater'

export class AppUpdateService {
  private isUpdateAvailable = null as boolean | null
  private isDownloading = false
  private progress = 0 // 0..1
  private cancelToken: CancellationToken | null = null

  constructor(private updater: AppUpdater) {
    this.attachUpdaterEvents()
  }

  private attachUpdaterEvents() {
    this.updater.on('checking-for-update', () => {
      // optional: keep previous progress; just not downloading yet
    })

    this.updater.on('update-available', () => {
      // autoDownload=true typically starts download after this
      this.setDownloading(true)
      this.setProgress(0)
    })

    this.updater.on('update-not-available', () => {
      this.setDownloading(false)
      this.setProgress(0)
    })

    // electron-updater emits { percent, transferred, total, bytesPerSecond }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.updater.on('download-progress', (p: any) => {
      this.setDownloading(true)
      const ratio =
        typeof p?.percent === 'number'
          ? Math.max(0, Math.min(1, p.percent / 100))
          : this.progress // keep last if unknown
      this.setProgress(ratio)
    })

    this.updater.on('update-downloaded', () => {
      this.setProgress(1)
      this.setDownloading(false)
    })

    this.updater.on('error', () => {
      this.setDownloading(false)
      this.setProgress(0)
    })
  }

  private setDownloading(v: boolean) {
    this.isDownloading = v
  }

  private setProgress(v: number) {
    this.progress = v
  }

  private setIsUpdateAvailable(v: boolean) {
    this.isUpdateAvailable = v
  }

  public getIsUpdateAvailable(): boolean | null {
    return this.isUpdateAvailable
  }

  /** Returns current progress (0..1) and whether a download is active */
  public getDownloadProgress(): { progress: number; isDownloading: boolean } {
    return { progress: this.progress, isDownloading: this.isDownloading }
  }

  /** Guarded check to avoid kicking off overlapping downloads */
  public async checkForUpdates(): Promise<UpdateCheckResult | null> {
    if (this.isDownloading) return null
    const result = await this.updater.checkForUpdates()
    this.setIsUpdateAvailable(result?.isUpdateAvailable ?? false)
    return result ?? null
  }

  /** Manually start downloading an update (no-op if already downloading) */
  public async downloadUpdate(): Promise<void> {
    if (this.isDownloading) return
    this.cancelToken = new UpdaterCancellationToken()
    this.setDownloading(true)
    this.setProgress(0)

    try {
      await this.updater.downloadUpdate(this.cancelToken)
      // 'update-downloaded' event will set progress=1 and isDownloading=false
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // If cancelled or failed, error event will also run; ensure local cleanup
      this.setDownloading(false)
      this.setProgress(0)
      if (err?.name !== 'CancellationError') throw err
    } finally {
      this.cancelToken = null
    }
  }

  /** Cancel an in-flight download (if any) */
  public cancelDownload(): void {
    this.cancelToken?.cancel()
    // defensive local reset; error event should also fire
    this.setDownloading(false)
    this.setProgress(0)
  }

  /** Install the already-downloaded update and restart */
  public quitAndInstall(isSilent = false, isForceRunAfter = true): void {
    this.updater.quitAndInstall(isSilent, isForceRunAfter)
  }
}
