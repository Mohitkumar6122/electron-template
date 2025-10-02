/// <reference types="vite/client" />

declare global {
  interface Window {
    ipcRenderer?: {
      on: (...args: any[]) => void
      off: (...args: any[]) => void
      send: (...args: any[]) => void
      invoke: (...args: any[]) => Promise<any>
    }
  }
}

export {}
