import * as React from "react";
import { useEffect, useState } from "react";

import { useDependencies } from "~/bootstrap/dependencies";
import useErrorMessage from "~/components/use/useErrorMessage";
import { IRadioChannel } from "~/services/RadioManagerService";

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
        {React.Children.map(channels, channel => (
          <li>{channel.title}</li>
        ))}
      </ul>
      <br />
      Choose your radio channel from the list to start editing.
      <br />
      <button>Create new radio channel</button>
    </section>
  );
};

export default ProfilePage;
