import * as React from "react";
import { useCallback } from "react";
import { useDependencies } from "~/bootstrap/dependencies";
import useResource from "~/components/use/useResource";
import { IAudioTrack, IRadioChannel } from "~/services/RadioManagerService";
import { IResource, resource } from "~/utils/concurrent";
import { config } from "~/config";
import { Link } from "react-router-dom";

interface ChannelViewProps {
  channelResource: IResource<IRadioChannel>;
  audioTracksResource: IResource<IAudioTrack[]>;
}

const ChannelView: React.FC<ChannelViewProps> = ({ channelResource, audioTracksResource }) => {
  const [channel] = useResource(channelResource);
  const [audioTracks, setAudioTracks] = useResource(audioTracksResource);

  const { audioUploaderService, radioManagerService } = useDependencies();

  const handleUploadClick = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.addEventListener("change", async (event: Event) => {
      if (event.target) {
        const eventTarget = event.target as HTMLInputElement;
        if (eventTarget.files) {
          const { signature, rawMetadata, metadata } = await audioUploaderService.uploadAudioFile(eventTarget.files[0]);
          const { id } = await radioManagerService.addTrackToChannel(channel.id, signature, rawMetadata);

          setAudioTracks(audioTracks => [...audioTracks, { ...metadata, id }]);
        }
      }
    });
    input.click();
  }, [channel.id, audioUploaderService, radioManagerService, setAudioTracks]);

  return (
    <React.Suspense fallback={null}>
      <aside>
        <Link to={config.routes.profile}>Back to channels</Link>
      </aside>
      <section>
        <h1>Channel Page</h1>
        Title: {channel.title}
        <h2>Audio Tracks</h2>
        <ul>
          {audioTracks.map(audioTrack => (
            <li key={audioTrack.id}>{audioTrack.name}</li>
          ))}
        </ul>
        <button onClick={handleUploadClick}>Upload</button>
      </section>
    </React.Suspense>
  );
};

ChannelView.propTypes = {
  channelResource: resource.isRequired,
  audioTracksResource: resource.isRequired,
};

export default ChannelView;
