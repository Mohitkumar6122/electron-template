import { SettingsLayout } from './layout'
import { AboutPage, GeneralSettingsPage, ModelsSettingsPage } from './pages'

export const settingsRoutes = [
  {
    path: 'settings',
    element: <SettingsLayout />,
    children: [
      {
        path: 'about',
        element: <AboutPage />
      },
      {
        path: 'general',
        element: <GeneralSettingsPage />
      },
      {
        path: 'models',
        element: <ModelsSettingsPage />
      }
    ]
  }
]
