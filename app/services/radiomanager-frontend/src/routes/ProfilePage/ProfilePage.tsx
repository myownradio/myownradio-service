import * as React from "react";
import { useCallback } from "react";

import { useDependencies } from "~/bootstrap/dependencies";

const ProfilePage: React.FC = () => {
  const { audioUploaderService } = useDependencies();

  const handleClick = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.addEventListener("change", (event: Event) => {
      audioUploaderService.uploadAudioFile(event.target.files[0]).then(console.log);
    });
    input.click();
  }, []);

  return (
    <section>
      Upload <button onClick={handleClick}>Me</button>{" "}
    </section>
  );
};

export default ProfilePage;
