import * as React from "react";
import { useParams, Redirect } from "react-router-dom";
import { useDependencies } from "~/bootstrap/dependencies";
import CatchError from "~/components/CatchError";
import { config } from "~/config";
import { wrapPromise } from "~/utils/concurrent";
import ChannelView from "./components/ChannelView";

const ChannelPage: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { radioManagerService } = useDependencies();

  const channelResource = wrapPromise(radioManagerService.getChannel(channelId));
  const audioTracksResource = wrapPromise(radioManagerService.getAudioTracks(channelId));

  return (
    <CatchError fallback={<Redirect to={config.routes.profile} />}>
      <React.Suspense fallback={null}>
        <ChannelView channelResource={channelResource} audioTracksResource={audioTracksResource} />
      </React.Suspense>
    </CatchError>
  );
};

export default ChannelPage;
