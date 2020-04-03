import * as React from "react";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useDependencies } from "~/bootstrap/dependencies";
import useErrorMessage from "~/components/use/useErrorMessage";
import { config } from "~/config";
import { IRadioChannel } from "~/services/RadioManagerService";
import { createUrlFromRoute } from "~/utils/router";

const ProfilePage: React.FC = () => {
  const [channels, setChannels] = useState<IRadioChannel[]>([]);
  const [error, setError] = useErrorMessage();

  const { radioManagerService } = useDependencies();

  useEffect(() => {
    radioManagerService.getChannels().then(setChannels, error => setError(error.message));
  }, [radioManagerService, setError]);

  // const { audioUploaderService } = useDependencies();

  // const handleClick = useCallback(() => {
  //   const input = document.createElement("input");
  //   input.setAttribute("type", "file");
  //   input.addEventListener("change", (event: Event) => {
  //     if (event.target) {
  //       const eventTarget = event.target as HTMLInputElement;
  //       if (eventTarget.files) {
  //         audioUploaderService.uploadAudioFile(eventTarget.files[0]).then(console.log);
  //       }
  //     }
  //   });
  //   input.click();
  // }, [audioUploaderService]);

  return (
    <section>
      {error && (
        <>
          {error} <br />
        </>
      )}
      Your channels:
      <br />
      <ul>
        {channels.map(channel => (
          <li key={channel.id}>
            <Link to={createUrlFromRoute(config.routes.channel, { channelId: channel.id })}>{channel.title}</Link>
          </li>
        ))}
      </ul>
      <br />
      Choose your radio channel from the list to start editing.
      <br />
      <Link to={config.routes.createChannel}>Create new radio channel</Link>
    </section>
  );
};

export default ProfilePage;
