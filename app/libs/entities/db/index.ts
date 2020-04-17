export * from "./AudioTracksEntity";
export * from "./RadioChannelsEntity";
export * from "./PlayingChannelsEntity";
export * from "./UsersEntity";
export * from "./RefreshTokensEntity";

export enum TableName {
  AudioTracks = "audio_tracks",
  RadioChannels = "radio_channels",
  PlayingChannels = "playing_channels",
  Users = "users",
  RefreshTokens = "refresh_tokens",
}
