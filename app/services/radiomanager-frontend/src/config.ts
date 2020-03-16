export const config = {
  siteUrl: process.env.REACT_APP_SITE_URL as string,

  authServerUrl: process.env.REACT_APP_AUTH_SERVER_URL as string,

  routes: {
    home: "/",
    test: "/test",
    login: "/login",
  },
};

export type IConfig = typeof config;
