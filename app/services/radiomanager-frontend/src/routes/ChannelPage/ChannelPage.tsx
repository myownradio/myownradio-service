import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDependencies } from "~/bootstrap/dependencies";
import ErrorBox from "~/components/ErrorBox";
import useErrorMessage from "~/components/use/useErrorMessage";
import { IRadioChannel } from "~/services/RadioManagerService";
import AbstractErrorWithReason from "~/services/errors/AbstractErrorWithReason";

const ChannelPage: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { radioManagerService } = useDependencies();
  const [channel, setChannel] = useState<IRadioChannel>();
  const [errorMessage, setErrorMessage] = useErrorMessage();

  useEffect(() => {
    radioManagerService.getChannel(channelId).then(setChannel, error => {
      if (error instanceof AbstractErrorWithReason) {
        setErrorMessage(error.localeKey);
      } else {
        setErrorMessage("api_error");
      }
    });
  }, [channelId, radioManagerService, setErrorMessage, setChannel]);

  return (
    <section>
      <ErrorBox errorMessage={errorMessage} />
      <h1>Channel Page</h1>
      {channel && <>Title: {channel?.title}</>}
    </section>
  );
};

export default ChannelPage;
