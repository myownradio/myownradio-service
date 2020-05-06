import { Dispatch, SetStateAction, useState } from "react"
import { Resource } from "~/utils/suspense"

export default function useResource<T>(resource: Resource<T>): [T, Dispatch<SetStateAction<T>>] {
  return useState(resource.read())
}
