import { logoWhite } from '@/assets/logo'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  ExternalLink,
  Key,
  Mail,
  RefreshCw,
  RotateCcw,
  Shield,
  Star,
  Unlink
} from 'lucide-react'
import { useState } from 'react'
import { AppUpdateApis } from '../../apis'
import {
  useAppIsUpdateAvailableConnector,
  useAppUpdateDownloadProgressConnector,
  useAppVersionConnector
} from '../../connectors'

export const AboutPage = () => {
  const appVersion = useAppVersionConnector()
  const downloadProgress = useAppUpdateDownloadProgressConnector()
  const isUpdateAvailable = useAppIsUpdateAvailableConnector()
  const progressRatio = downloadProgress.data?.progress ?? 0
  const progressPercent = Math.round(progressRatio * 100)
  const isDownloading = downloadProgress.data?.isDownloading ?? false
  const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(false)

  const handleCheckForUpdates = async () => {
    setIsCheckingForUpdates(true)
    await AppUpdateApis.checkForUpdates()
    await isUpdateAvailable.refetch()
    setIsCheckingForUpdates(false)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg text-foreground">About</h1>
        <p className="text-xs text-muted-foreground">
          Information about your OCR application and license management.
        </p>
      </div>

      {/* App Information */}
      <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-600 via-purple-600 to-blue-900 rounded-xl flex items-center justify-center shadow-lg">
              <img src={logoWhite} alt="Text Capture" className="w-9 h-9" />
            </div>
            <div>
              <h3 className="text-sm text-foreground">Text Capture</h3>
              <p className="text-xs text-muted-foreground">
                Capture text from anywhere
              </p>
            </div>
          </div>
          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-2 py-0.5 text-xs">
            v{appVersion.data}
          </Badge>
        </div>

        <p className="text-xs text-foreground leading-relaxed">
          Text Capture is a simple to use, yet powerful OCR application. It is
          created with love and care by our team at FLR42. We hope you enjoy
          using it as much as we enjoy making it.
        </p>
      </div>

      {/* License */}
      <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Key className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm text-foreground">License</h3>
              <p className="text-xs text-muted-foreground">
                Manage app license
              </p>
            </div>
          </div>
          <Button variant="outline" size="xs">
            <Key className="mr-1.5 h-3 w-3" />
            Manage License
          </Button>
        </div>

        <div className="space-y-2">
          <div className="p-3 rounded-lg border border-destructive/50 bg-destructive/5">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs text-foreground">Unlink Device</Label>
                <p className="text-xs text-muted-foreground">
                  Remove this device from your license
                </p>
              </div>
              <Button variant="destructive" size="xs" className="h-6 px-2">
                <Unlink className="mr-1 h-3 w-3" />
                Unlink
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Updates */}
      <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <RefreshCw className="h-3.5 w-3.5 text-white" />
            </div>
            <div>
              <h3 className="text-sm text-foreground">Updates</h3>
              <p className="text-xs text-muted-foreground">
                Manage app updates
              </p>
            </div>
          </div>
          {!isDownloading && progressPercent === 0 && (
            <Button
              size="xs"
              variant="outline"
              onClick={handleCheckForUpdates}
              disabled={isCheckingForUpdates}
            >
              <RefreshCw
                className={cn(
                  'mr-1.5 h-3.5 w-3.5',
                  isCheckingForUpdates && 'animate-spin'
                )}
              />
              Check for updates
            </Button>
          )}

          {isDownloading && (
            <div className="w-full max-w-64">
              <div className="flex items-center justify-between mb-1">
                <Label className="text-xs text-foreground">
                  Downloading update…
                </Label>
                <span className="text-xs text-muted-foreground">
                  {progressPercent}%
                </span>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>
          )}

          {!isDownloading && progressPercent === 100 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => AppUpdateApis.quitAndInstall()}
            >
              <RotateCcw className="mr-1.5 h-3 w-3" />
              Update and re-open
            </Button>
          )}
        </div>

        <div className="space-y-2">
          {isUpdateAvailable.data === false &&
            !isCheckingForUpdates &&
            !isDownloading && (
              <div className="w-full text-xs text-muted-foreground">
                No new updates available. You're on the latest version
              </div>
            )}

          {isCheckingForUpdates && (
            <div className="w-full text-xs text-muted-foreground">
              Checking for updates...
            </div>
          )}

          <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-muted/30 border border-border">
            <div className="space-y-0.5">
              <Label className="text-xs text-foreground">
                Automatically check for updates
              </Label>
              <p className="text-xs text-muted-foreground">
                Check for new versions when the app starts
              </p>
            </div>
            <Switch checked={true} onCheckedChange={() => {}} />
          </div>
        </div>
      </div>

      {/* Release Notes */}
      <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-border shadow-sm">
        <div className="mb-3">
          <h3 className="text-sm text-foreground mb-1">Release Notes</h3>
          <p className="text-xs text-muted-foreground">
            What's new in version 2.1.3
          </p>
        </div>

        <div className="space-y-2">
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center justify-between mb-2">
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs px-2 py-0.5">
                New
              </Badge>
              <span className="text-xs text-muted-foreground">v2.1.3</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3 mt-1.5"></div>
                <span className="text-xs text-foreground">
                  Added support for cloud-based OCR models (OpenAI, Google,
                  Azure)
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3 mt-1.5"></div>
                <span className="text-xs text-foreground">
                  Improved capture sound options with volume control
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mr-3 mt-1.5"></div>
                <span className="text-xs text-foreground">
                  Enhanced model management interface
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                Fixed
              </Badge>
              <span className="text-xs text-muted-foreground">v2.1.2</span>
            </div>
            <div className="space-y-1">
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3 mt-1.5"></div>
                <span className="text-xs text-foreground">
                  Fixed issue with language detection on macOS Ventura
                </span>
              </div>
              <div className="flex items-start">
                <div className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-3 mt-1.5"></div>
                <span className="text-xs text-foreground">
                  Improved accuracy for handwritten text recognition
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Support & Resources */}
      <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-border shadow-sm">
        <div className="mb-3">
          <h3 className="text-sm text-foreground mb-1">Support & Resources</h3>
          <p className="text-xs text-muted-foreground">
            Get help and access documentation
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center border-border hover:bg-accent text-foreground text-xs h-6 px-2"
          >
            <Mail className="mr-1.5 h-3 w-3" />
            Contact Support
            <ExternalLink className="ml-1 h-2.5 w-2.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center border-border hover:bg-accent text-foreground text-xs h-6 px-2"
          >
            <ExternalLink className="mr-1.5 h-3 w-3" />
            User Guide
            <ExternalLink className="ml-1 h-2.5 w-2.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center border-border hover:bg-accent text-foreground text-xs h-6 px-2"
          >
            <Shield className="mr-1.5 h-3 w-3" />
            Privacy Policy
            <ExternalLink className="ml-1 h-2.5 w-2.5" />
          </Button>
        </div>
      </div>

      {/* Leave a Review */}
      <div className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 backdrop-blur-sm rounded-xl p-3 border-2 border-dashed border-yellow-200/60 dark:border-yellow-800/60 shadow-sm">
        <div className="text-center space-y-2">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
            <Star className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm text-foreground mb-1">Love Text Capture?</h3>
            <p className="text-xs text-muted-foreground">
              Help others discover this app by leaving a review on the App Store
            </p>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <Button className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-3 text-xs h-7">
              <Star className="mr-1.5 h-3 w-3" />
              Rate on App Store
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300 text-xs h-7 px-3"
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              Share App
            </Button>
          </div>
        </div>
      </div>

      {/* Legal */}
      <div className="text-center text-xs text-muted-foreground pt-2">
        <p className="text-xs">© 2024 Text Capture. All rights reserved.</p>
        <div className="mt-1 flex justify-center items-center space-x-2">
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
          >
            Terms of Service
          </Button>
          <span className="text-muted-foreground/60">•</span>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
          >
            End User License Agreement
          </Button>
          <span className="text-muted-foreground/60">•</span>
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
          >
            Refund Policy
          </Button>
        </div>
      </div>
    </div>
  )
}
