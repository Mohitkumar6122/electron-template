import { orangeNoisyBackground } from '@/assets/backgrounds'
import { logoWhite } from '@/assets/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X } from 'lucide-react'

export const SetupPage = () => {
  // const [choice] = useState<SetupChoice>('recommended')

  // const onContinue = () => {
  //   // TODO: Wire navigation or start onboarding flow based on `choice`
  //   // For now, just log to console to keep UI-focused per request
  //   console.log('Selected setup:', choice)
  // }

  return (
    <div
      className="h-screen w-screen bg-cover bg-center relative rounded-[3rem] overflow-hidden"
      style={{ backgroundImage: `url(${orangeNoisyBackground})` }}
    >
      <div className="animate-blur-in absolute w-full h-full bg-background/70" />
      <div className="animate-blur-in relative">
        {/* Draggable top strip for frameless window */}
        <div className="absolute top-0 left-0 right-0 h-10 drag" />
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-6 right-8 rounded-full"
        >
          <X className="size-4" />
        </Button>
      </div>
      <div className="animate-blur-in h-full w-full flex justify-between relative p-4">
        <div className="flex-1 flex flex-col h-full px-8 justify-center">
          <div className="absolute top-8 left-8 flex items-center gap-2 mb-10 select-none">
            <img
              src={logoWhite}
              alt="TextCapture"
              className="h-7 w-auto invert"
            />
            <span>Text Capture</span>
          </div>

          <div className="flex flex-col gap-4 px-16">
            <h1 className="text-2xl font-bold">Setup</h1>
            <p className="text-sm text-muted-foreground">
              Choose your preferred setup for Text Capture.
            </p>
            <Card>
              <CardHeader>
                <CardTitle>Recommended</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Recommended setup for Text Capture.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Custom</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Custom setup for Text Capture.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div
          className="relative w-[700px] h-[688px] bg-muted-foreground/40 overflow-hidden"
          style={{
            clipPath:
              'path("M 0,40 A 40,40 0,0,1 40,0 L 550,0 A 40,40 0,0,1 590,30 L 590,30 A 40,40 0,0,0 630,60 L 660,60 A 40,40 0,0,1 700,100 L 700,648 A 40,40 0,0,1 660,688 L 40,688 A 40,40 0,0,1 0,648 Z")'
          }}
        ></div>
      </div>
    </div>
  )
}
