import { settingsRoutes } from '@/features/settings/routes'
import { welcomeRoutes } from '@/features/welcome'

export const featureRoutes = [...welcomeRoutes, ...settingsRoutes]
