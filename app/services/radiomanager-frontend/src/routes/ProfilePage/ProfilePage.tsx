import * as React from "react"
import { Suspense } from "react"
import { useServices } from "~/services"
import { wrapPromise } from "~/utils/suspense"
import ProfileView from "./components/ProfileView"

const ProfilePage: React.FC = () => {
  const { radioManagerApiService } = useServices()

  const radioChannelListResource = wrapPromise(radioManagerApiService.getChannels())

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
    <Suspense fallback={null}>
      <ProfileView radioChannelListResource={radioChannelListResource} />
    </Suspense>
  )
}

export default ProfilePage
