import { useQuery } from '@tanstack/react-query'
import { AppVersionApis } from '../apis'

export const useAppVersionConnector = () => {
  const data = useQuery({
    queryKey: ['app-version'],
    queryFn: () => AppVersionApis.getAppVersion()
  })
  return data
}
