import { useRadioManagerModel } from "~/modules/RadioManager"
import { useResource } from "~/utils/suspense2"
import { RadioChannelModel } from "../RadioChannelModel"

export function useRadioChannelModel(channelId: string): RadioChannelModel {
  const radioManagerModel = useRadioManagerModel()
  return useResource(radioManagerModel.getRadioChannelModel(channelId))
}
