export const config = {
  siteUrl: process.env.REACT_APP_SITE_URL as string,

  authApiUrl: process.env.REACT_APP_AUTH_API_URL as string,
  audioUploaderUrl: process.env.REACT_APP_AUDIO_UPLOADER_URL as string,

  routes: {
    home: "/",
    test: "/test",
    login: "/login",
    signup: "/signup",
    logout: "/logout",
  },
};

export type IConfig = typeof config;
