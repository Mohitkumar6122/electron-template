import { RouterProvider } from 'react-router'
import { useMainNavigateListener } from './hooks/use-main-navigate-listener'
import { router } from './routes'

export const App = () => {
  useMainNavigateListener()
  return <RouterProvider router={router} />
}
