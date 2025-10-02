import { getDefaultAreaCaptureService } from '../text-capture'
import { TrayService } from './tray-service'

export const getDefaultTrayService = () => {
  const areaCaptureService = getDefaultAreaCaptureService()
  return new TrayService(areaCaptureService)
}
