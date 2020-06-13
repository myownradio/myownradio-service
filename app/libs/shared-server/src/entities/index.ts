export * from "./AudioTracksEntity";
export * from "./PlayingChannelsEntity";
export * from "./RadioChannelsEntity";
export * from "./UsersEntity";
export * from "./RefreshTokensEntity";

export enum TableName {
  AudioTracks = "audio_tracks",
  PlayingChannels = "playing_channels",
  RadioChannels = "radio_channels",
  Users = "users",
  RefreshTokens = "refresh_tokens",
}
