import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Keyboard, Play, Volume2, Zap } from 'lucide-react'
import { useState } from 'react'

export const GeneralSettingsPage = () => {
  const [settings, setSettings] = useState({
    autoLaunch: true,
    showMenubarIcon: true,
    showNotifications: false,
    hotkey: 'Cmd+Shift+O',
    playCaptureSound: true,
    captureSound: 'shutter',
    captureVolume: [70]
  })

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg text-foreground">General</h1>
        <p className="text-xs text-muted-foreground">
          Configure general settings for your OCR application.
        </p>
      </div>

      {/* Startup & Behavior */}
      <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-border shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <Zap className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm text-foreground">Startup & Behavior</h3>
            <p className="text-xs text-muted-foreground">
              Control how the app behaves when launched and during use
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-muted/30 border border-border">
            <div className="space-y-0.5">
              <Label className="text-xs text-foreground">
                Launch at startup
              </Label>
              <p className="text-xs text-muted-foreground">
                Automatically start the app when you log in
              </p>
            </div>
            <Switch
              checked={settings.autoLaunch}
              onCheckedChange={checked =>
                setSettings({ ...settings, autoLaunch: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-muted/30 border border-border">
            <div className="space-y-0.5">
              <Label className="text-xs text-foreground">
                Show menubar icon
              </Label>
              <p className="text-xs text-muted-foreground">
                Display the OCR icon in your menubar
              </p>
            </div>
            <Switch
              checked={settings.showMenubarIcon}
              onCheckedChange={checked =>
                setSettings({ ...settings, showMenubarIcon: checked })
              }
            />
          </div>

          <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-muted/30 border border-border">
            <div className="space-y-0.5">
              <Label className="text-xs text-foreground">
                Show notifications
              </Label>
              <p className="text-xs text-muted-foreground">
                Display system notifications for OCR completion
              </p>
            </div>
            <Switch
              checked={settings.showNotifications}
              onCheckedChange={checked =>
                setSettings({ ...settings, showNotifications: checked })
              }
            />
          </div>
        </div>
      </div>

      {/* Sound & Audio */}
      <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-border shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg flex items-center justify-center">
            <Volume2 className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm text-foreground">Sound & Audio</h3>
            <p className="text-xs text-muted-foreground">
              Configure audio feedback and sound effects
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between py-2.5 px-3 rounded-lg bg-muted/30 border border-border">
            <div className="space-y-0.5">
              <Label className="text-xs text-foreground">
                Play capture sound
              </Label>
              <p className="text-xs text-muted-foreground">
                Play a sound when capturing screenshots or images
              </p>
            </div>
            <Switch
              checked={settings.playCaptureSound}
              onCheckedChange={checked =>
                setSettings({ ...settings, playCaptureSound: checked })
              }
            />
          </div>

          {settings.playCaptureSound && (
            <>
              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
                <Label className="text-xs text-foreground">Sound effect</Label>
                <div className="flex items-center space-x-2">
                  <Select
                    value={settings.captureSound}
                    onValueChange={value =>
                      setSettings({ ...settings, captureSound: value })
                    }
                  >
                    <SelectTrigger className="bg-background/80 border-border flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="shutter">📷 Camera Shutter</SelectItem>
                      <SelectItem value="click">🔘 Click</SelectItem>
                      <SelectItem value="pop">🎈 Pop</SelectItem>
                      <SelectItem value="swoosh">💨 Swoosh</SelectItem>
                      <SelectItem value="beep">🔊 Beep</SelectItem>
                      <SelectItem value="chime">🎵 Chime</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-border hover:bg-accent text-foreground text-xs h-8 px-2 flex-shrink-0"
                    onClick={() => {
                      // Play sound preview
                      console.log(
                        `Playing ${settings.captureSound} sound preview`
                      )
                    }}
                  >
                    <Play className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Choose the sound to play when capturing
                </p>
              </div>

              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-foreground">Volume</Label>
                  <span className="text-xs text-muted-foreground">
                    {settings.captureVolume[0]}%
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Volume2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  <Slider
                    value={settings.captureVolume}
                    onValueChange={value =>
                      setSettings({ ...settings, captureVolume: value })
                    }
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Adjust the volume of the capture sound
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-border shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Keyboard className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm text-foreground">Keyboard Shortcuts</h3>
            <p className="text-xs text-muted-foreground">
              Customize keyboard shortcuts for quick access
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
            <Label htmlFor="hotkey" className="text-xs text-foreground">
              Global hotkey
            </Label>
            <Input
              id="hotkey"
              value={settings.hotkey}
              onChange={e =>
                setSettings({ ...settings, hotkey: e.target.value })
              }
              placeholder="Cmd+Shift+O"
              className="bg-background/80 border-border"
            />
            <p className="text-xs text-muted-foreground">
              Press this key combination anywhere to trigger OCR
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button variant="outline" size="sm" className="text-xs px-4">
          Restore defaults
        </Button>
      </div>
    </div>
  )
}
