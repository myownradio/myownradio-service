if (!process.env.REACT_APP_SITE_URL) {
  throw new Error("Environment variable REACT_APP_SITE_URL is required")
}

if (!process.env.REACT_APP_AUTH_API_URL) {
  throw new Error("Environment variable REACT_APP_AUTH_API_URL is required")
}

if (!process.env.REACT_APP_AUDIO_UPLOADER_URL) {
  throw new Error("Environment variable REACT_APP_AUDIO_UPLOADER_URL is required")
}

if (!process.env.REACT_APP_RADIO_MANAGER_URL) {
  throw new Error("Environment variable REACT_APP_RADIO_MANAGER_URL is required")
}

if (!process.env.REACT_APP_AUDIO_PLAYER_URL) {
  throw new Error("Environment variable REACT_APP_AUDIO_PLAYER_URL is required")
}

export const config = Object.freeze({
  siteUrl: process.env.REACT_APP_SITE_URL,
  authApiUrl: process.env.REACT_APP_AUTH_API_URL,
  audioUploaderUrl: process.env.REACT_APP_AUDIO_UPLOADER_URL,
  radioManagerUrl: process.env.REACT_APP_RADIO_MANAGER_URL,
  audioPlayerUrl: process.env.REACT_APP_AUDIO_PLAYER_URL,
  routes: {
    home: "/",
    login: "/login",
    signup: "/signup",
    logout: "/logout",
    myChannels: "/my-channels",
    createChannel: "/my-channels/new",
    channel: "/my-channels/:channelId",
  },
})

export type IConfig = typeof config
