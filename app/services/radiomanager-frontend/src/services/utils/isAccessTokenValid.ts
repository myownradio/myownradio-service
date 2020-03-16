import * as jwtDecode from "jwt-decode";

export default function isAccessTokenValid(accessToken: string): boolean {
  try {
    const decodedToken = jwtDecode<{ exp?: number }>(accessToken);
    return typeof decodedToken.exp === "number" && decodedToken.exp > Date.now() / 1000;
  } catch {
    /* NO-OP */
  }
  return false;
}
