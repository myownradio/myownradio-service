interface PlayCommand {
  type: "PLAY"
  payload: { url: string }
}
export const playCommand = (url: string): PlayCommand => ({ type: "PLAY", payload: { url } })

interface StopCommand {
  type: "STOP"
}
export const stopCommand = (): StopCommand => ({ type: "STOP" })

export type Command = PlayCommand | StopCommand
