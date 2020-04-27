import * as React from "react"
import { Link } from "react-router-dom"
import { config } from "~/config"
import { RadioChannel } from "~/services/RadioManagerService"
import { IResource, resource } from "~/utils/concurrent"
import { createUrlFromRoute } from "~/utils/router"

interface ProfileViewProps {
  radioChannelListResource: IResource<RadioChannel[]>
}

const ProfileView: React.FC<ProfileViewProps> = ({ radioChannelListResource }) => {
  const radioChannelsList = radioChannelListResource.read()

  return (
    <section>
      Your channels:
      <br />
      <ul>
        {radioChannelsList.map(channel => (
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
  )
}

ProfileView.propTypes = {
  radioChannelListResource: resource.isRequired,
}

export default ProfileView
