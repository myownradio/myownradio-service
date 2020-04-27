import { Dispatch, SetStateAction, useState } from "react"
import { IResource } from "~/utils/concurrent"

export default function useResource<T>(resource: IResource<T>): [T, Dispatch<SetStateAction<T>>] {
  return useState(resource.read())
}
