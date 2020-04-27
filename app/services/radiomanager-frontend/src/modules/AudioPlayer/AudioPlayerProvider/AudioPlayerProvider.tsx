import * as PropTypes from "prop-types"
import * as React from "react"
import { useEffect, useMemo, useState } from "react"
import AudioPlayerContext from "../AudioPlayerContext"
import { createStore } from "../AudioPlayerStore"
import { AudioPlayerState } from "../AudioPlayerStore"

const AudioPlayerProvider: React.FC = ({ children }) => {
  const audioPlayerStore = useMemo(() => createStore(), [])

  // todo: remove after finish debugging
  const [playerState, setPlayerState] = useState<AudioPlayerState>(audioPlayerStore.state$.getValue())

  useEffect(() => {
    // todo: remove after finish debugging
    const sub = audioPlayerStore.state$.subscribe(setPlayerState)

    return (): void => {
      sub.unsubscribe()
      audioPlayerStore.shutdown()
    }
  }, [audioPlayerStore])

  return (
    <>
      <AudioPlayerContext.Provider value={audioPlayerStore}>{children}</AudioPlayerContext.Provider>
      <pre>Debug Player State: {JSON.stringify(playerState)}</pre>
      {playerState.status === "playing" && <button onClick={audioPlayerStore.stop}>Stop</button>}
    </>
  )
}

AudioPlayerProvider.propTypes = {
  children: PropTypes.node,
}

export default AudioPlayerProvider
