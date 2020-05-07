import axios from "axios"

export function isCancelledRequest(value: unknown): boolean {
  return axios.isCancel(value)
}
