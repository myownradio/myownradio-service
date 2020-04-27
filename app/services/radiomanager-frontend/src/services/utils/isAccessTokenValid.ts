import jwtDecode = require("jwt-decode")

export default function isAccessTokenValid(accessToken: string): boolean {
  try {
    const decodedToken = jwtDecode<{ exp?: number }>(accessToken)
    return typeof decodedToken.exp === "number" && decodedToken.exp > Date.now() / 1000
  } catch (e) {
    // todo sentry integration
  }
  return false
}
