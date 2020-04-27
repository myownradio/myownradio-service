import React, { useEffect } from "react"
import useDebug from "../../hooks/useDebug"

const RadioChannelPage: React.FC = () => {
  const debug = useDebug(RadioChannelPage)

  useEffect(() => {
    debug("Page Loaded")
  }, [debug])

  return null
}

export default RadioChannelPage
