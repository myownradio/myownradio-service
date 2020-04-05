import * as PropTypes from "prop-types";

export type IResource<T> = { read: () => T };

export const resource = PropTypes.shape({
  read: PropTypes.func.isRequired,
});

export function wrapPromise<T>(promise: Promise<T>): IResource<T> {
  let status = "pending";
  let response: T | Error;

  const suspender = promise.then(
    res => {
      status = "success";
      response = res;
    },
    err => {
      status = "error";
      response = err;
    },
  );

  const read = (): T => {
    switch (status) {
      case "pending":
        throw suspender;
      case "error":
        throw response;
      default:
        return response as T;
    }
  };

  return { read };
}
