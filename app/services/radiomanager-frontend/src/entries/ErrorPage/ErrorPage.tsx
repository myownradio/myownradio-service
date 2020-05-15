import React, { useDebugValue } from "react"
import getText from "~/utils/getText"
import styles from "./ErrorPage.scss"

interface Props {
  error: Error
}

const ErrorPage: React.FC<Props> = ({ error }) => {
  useDebugValue(error.stack)

  return (
    <div className={styles.root}>
      <div className={styles.message}>
        <div className={styles.title}>Oops...</div>
        <div className={styles.description}>
          {getText("Things are little unstable here...")}
          <br />
          {getText("But I suggest to come back later")}
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
