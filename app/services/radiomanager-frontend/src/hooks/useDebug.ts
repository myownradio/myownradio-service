import { ComponentType } from "react"
import debug from "../utils/debug"

export default function useDebug(Component: ComponentType): typeof debug {
  return debug.extend(Component.displayName || Component.name)
}
