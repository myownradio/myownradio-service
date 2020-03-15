import axios, { CancelTokenSource } from "axios";

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
