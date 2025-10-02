import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'

export interface DelayProps {
  children: React.ReactNode
  delay: number
  keepDimensions?: boolean
  className?: string
}

export const Delay = (props: DelayProps) => {
  const { children, delay, keepDimensions = false, className } = props
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true)
    }, delay)
  }, [delay])

  return (
    <div className={cn(keepDimensions ? 'h-full w-full' : '', className)}>
      {isVisible && <>{children}</>}
    </div>
  )
}
