import * as React from "react"
import { useCallback } from "react"
import { Link } from "react-router-dom"
import { useDependencies } from "~/bootstrap/dependencies"
import useResource from "~/components/use/useResource"
import { config } from "~/config"
import { useAudioPlayerControls } from "~/modules/AudioPlayer"
import { AudioTrack, RadioChannel } from "~/services/RadioManagerService"
import { IResource, resource } from "~/utils/concurrent"
import AudioUploader from "./components/AudioUploader"

interface ChannelViewProps {
  channelResource: IResource<RadioChannel>
  audioTracksResource: IResource<AudioTrack[]>
}

const ChannelView: React.FC<ChannelViewProps> = ({ channelResource, audioTracksResource }) => {
  const [channel] = useResource(channelResource)
  const [audioTracks, setAudioTracks] = useResource(audioTracksResource)
  const { play } = useAudioPlayerControls()
  const { sessionService } = useDependencies()

  const handleUploadSuccess = useCallback(
    uploadedTrack => {
      setAudioTracks(audioTracks => [...audioTracks, uploadedTrack])
    },
    [setAudioTracks],
  )

  const handlePreviewClicked = useCallback(
    trackId => {
      return (): void => {
        const accessToken = sessionService.getAccessToken()
        const mediaFileUrl = `${config.audioPlayerUrl}audio/preview/${trackId}?token=${accessToken}`
        play(mediaFileUrl)
      }
    },
    [play, sessionService],
  )

  return (
    <>
      <aside>
        <Link to={config.routes.profile}>Back to channels</Link>
      </aside>
      <section>
        <h1>Channel Page</h1>
        Title: {channel.title}
        <h2>Audio Tracks</h2>
        <ul>
          {audioTracks.map(audioTrack => (
            <li key={audioTrack.id}>
              {audioTrack.name} <button onClick={handlePreviewClicked(audioTrack.id)}>Preview</button>
            </li>
          ))}
        </ul>
        <AudioUploader channelId={channel.id} onUploadSuccess={handleUploadSuccess} />
      </section>
    </>
  )
}

ChannelView.propTypes = {
  channelResource: resource.isRequired,
  audioTracksResource: resource.isRequired,
}

export default ChannelView
