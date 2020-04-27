import createDebug from "debug"
import { ComponentType } from "react"

const debug = createDebug("radiomanager")

export default function useDebug(Component: ComponentType): createDebug.Debugger {
  return debug.extend(Component.displayName || Component.name)
}
