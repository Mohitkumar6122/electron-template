import { router } from '@/routes'
import { useEffect } from 'react'

export const useMainNavigateListener = () => {
  useEffect(() => {
    const handler = (_event: unknown, target: string) => {
      if (typeof target === 'string' && target.trim()) {
        router.navigate(target)
      }
    }
    window.ipcRenderer?.on('window:navigate', handler)
    return () => {
      window.ipcRenderer?.off('window:navigate', handler)
    }
  }, [])
}
