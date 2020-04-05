import * as PropTypes from "prop-types";
import * as React from "react";
import { IRadioChannel } from "~/services/RadioManagerService";
import { IResource } from "~/utils/concurrent";

interface ChannelViewProps {
  channelResource: IResource<IRadioChannel>;
}

const ChannelView: React.FC<ChannelViewProps> = ({ channelResource }) => {
  const channel = channelResource.read();

  return (
    <React.Suspense fallback={null}>
      <section>
        <h1>Channel Page</h1>
        {channel && <>Title: {channel?.title}</>}
      </section>
    </React.Suspense>
  );
};

ChannelView.propTypes = {
  channelResource: PropTypes.shape({
    read: PropTypes.func.isRequired,
  }).isRequired,
};

export default ChannelView;
