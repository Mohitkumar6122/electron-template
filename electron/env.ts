export const env = {
  isDev: !!process.env.VITE_DEV_SERVER_URL
}

export type Env = typeof env
