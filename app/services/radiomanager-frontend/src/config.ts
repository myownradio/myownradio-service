export const config = {
  siteUrl: process.env.REACT_APP_SITE_URL as string,

  authApiUrl: process.env.REACT_APP_AUTH_API_URL as string,

  routes: {
    home: "/",
    test: "/test",
    login: "/login",
    signup: "/signup",
  },
};

export type IConfig = typeof config;
