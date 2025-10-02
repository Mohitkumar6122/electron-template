import { orangeNoisyBackground } from '@/assets/backgrounds'
import { logoWhite } from '@/assets/logo'
import { Delay } from '@/components'
import { BlurTextEffect } from '@/components/ui/blur-text-effect'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export const WelcomePage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    window.ipcRenderer?.invoke('hello').then(res => {
      console.log(res)
    })
  }, [])

  const onContinue = () => {
    navigate('/setup')
  }

  return (
    <div
      className="p-4 h-screen w-screen bg-cover bg-center relative rounded-[3rem] overflow-hidden"
      style={{ backgroundImage: `url(${orangeNoisyBackground})` }}
    >
      {/* Draggable top strip for frameless window */}
      <div className="absolute top-0 left-0 right-0 h-10 drag" />

      <div className="flex flex-col gap-4 h-full w-full justify-center items-center cursor-default">
        <h1 className="scroll-m-20 text-center text-7xl tracking-tight text-balance">
          <BlurTextEffect>Hi there</BlurTextEffect>{' '}
          <span className="animate-blur-in animate-hand-wave">👋</span>
        </h1>
        <br />
        <h1 className="scroll-m-20 text-center text-5xl tracking-tight text-balance">
          <Delay delay={1500} className="h-[48px]">
            <BlurTextEffect>Let's get you setup on</BlurTextEffect>
          </Delay>
        </h1>
        <div className="flex items-center gap-1 animate-blur-in animation-delay-[2s]">
          <div>
            <img
              src={logoWhite}
              alt="TextCapture"
              className="h-14 w-auto select-none invert"
            />
          </div>
          <h1 className="scroll-m-20 text-center text-5xl tracking-tight text-balance">
            <BlurTextEffect>Text Capture</BlurTextEffect>
          </h1>
        </div>
        <br />
        <Button
          className="animate-blur-in animation-delay-[2.5s] group/continue"
          onClick={onContinue}
          size="lg"
        >
          Continue
          <ArrowRightIcon className="size-4 group-hover/continue:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  )
}
