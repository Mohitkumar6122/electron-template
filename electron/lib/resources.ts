import { env } from '@electron/env'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function getResourcesRoot(): string {
  // In production, electron-builder places extraResources under process.resourcesPath
  const resourcesPath = (process as unknown as { resourcesPath?: string })
    .resourcesPath
  if (!env.isDev && resourcesPath) return path.join(resourcesPath, 'resources')
  // In development, prefer APP_ROOT set by main.ts
  const appRoot = process.env.APP_ROOT
  if (appRoot) return path.join(appRoot, 'resources')
  // Fallback: compute relative to compiled file location
  const __dirnameLocal = path.dirname(fileURLToPath(import.meta.url))
  // When bundled to dist-electron/main.js, one level up is project root
  return path.join(__dirnameLocal, '..', 'resources')
}
