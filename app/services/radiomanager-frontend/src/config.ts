if (!process.env.REACT_APP_SITE_URL) {
  throw new Error("Environment variable REACT_APP_SITE_URL is required");
}

if (!process.env.REACT_APP_AUTH_API_URL) {
  throw new Error("Environment variable REACT_APP_AUTH_API_URL is required");
}

if (!process.env.REACT_APP_AUDIO_UPLOADER_URL) {
  throw new Error("Environment variable REACT_APP_AUDIO_UPLOADER_URL is required");
}

if (!process.env.REACT_APP_RADIOMANAGER_URL) {
  throw new Error("Environment variable REACT_APP_RADIOMANAGER_URL is required");
}

export const config = Object.freeze({
  siteUrl: process.env.REACT_APP_SITE_URL,
  authApiUrl: process.env.REACT_APP_AUTH_API_URL,
  audioUploaderUrl: process.env.REACT_APP_AUDIO_UPLOADER_URL,
  radiomanagerUrl: process.env.REACT_APP_RADIOMANAGER_URL,
  routes: {
    home: "/",
    test: "/test",
    login: "/login",
    signup: "/signup",
    logout: "/logout",
    profile: "/radiomanager",
    radioChannel: "/radiomanager/:channel",
  },
});

export type IConfig = typeof config;
