import { useQuery } from '@tanstack/react-query'
import { AppUpdateApis } from '../apis'

export const useAppIsUpdateAvailableConnector = () => {
  const data = useQuery({
    queryKey: ['app-update-is-update-available'],
    queryFn: () => AppUpdateApis.getIsUpdateAvailable()
  })
  return data
}
