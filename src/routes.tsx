import { featureRoutes } from '@/features'
import { createHashRouter, redirect } from 'react-router'

export const router = createHashRouter([
  {
    path: '/',
    loader: ({ request }) => {
      const url = new URL(request.url)
      const target = url.searchParams.get('target')?.trim()
      if (target) {
        return redirect(target)
      }
      return null
    }
  },
  {
    path: '/',
    children: featureRoutes,
    errorElement: <div>Error</div>
  },
  { path: '*', element: <div>404</div> }
])
