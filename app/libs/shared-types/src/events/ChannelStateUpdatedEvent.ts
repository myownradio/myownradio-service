import { UserBoundEvent } from "./UserBoundEvent"

export interface ChannelStateUpdatedEvent extends UserBoundEvent {
  type: "CHANNEL_STATE_UPDATED"
  channelId: number
}
