import React from "react"
import getText from "~/utils/getText"
import styles from "./NotFoundPage.scss"

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.root}>
      <div className={styles.message}>
        <div className={styles.title}>404</div>
        <div className={styles.description}>{getText("Page not found")}</div>
      </div>
    </div>
  )
}

export default NotFoundPage
