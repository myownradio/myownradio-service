const axios = require("axios");

export default function createAuthServerApi(authServerEndpoint) {
  const axiosClient = axios.create({
    baseURL: authServerEndpoint,
    timeout: 15000,
    withCredentials: true
  });

  return {
    login(email, password) {
      return axiosClient.post("/login", { email, password });
    }
  };
}
