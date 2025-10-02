import { useQuery } from '@tanstack/react-query'
import { AppUpdateApis } from '../apis'

export const useAppUpdateDownloadProgressConnector = () => {
  const data = useQuery({
    queryKey: ['app-update-download-progress'],
    queryFn: () => AppUpdateApis.getDownloadProgress(),
    refetchInterval: 1000
  })
  return data
}
