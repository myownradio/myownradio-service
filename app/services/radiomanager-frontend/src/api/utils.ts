import axios, { CancelTokenSource } from "axios";
import jwtDecode from "jwt-decode";

const CancelToken = axios.CancelToken;

const cancelTokensStack: CancelTokenSource[] = [];

export function withCancelToken<T>(callback: () => T): () => void {
  const call = CancelToken.source();

  cancelTokensStack.unshift(call);
  callback();
  cancelTokensStack.shift();

  return (): void => {
    call.cancel();
  };
}

export function getTopCancelTokenSource(): CancelTokenSource | null {
  return cancelTokensStack.length > 0 ? cancelTokensStack[0] : null;
}

export function isAccessTokenValid(accessToken: string): boolean {
  try {
    const decodedToken = jwtDecode(accessToken);
    return decodedToken.exp > Date.now() / 1000;
  } catch {
    /* NO-OP */
  }
  return false;
}
