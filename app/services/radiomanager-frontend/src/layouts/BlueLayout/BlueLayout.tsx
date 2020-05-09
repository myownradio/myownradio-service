import React from "react"
import styles from "./BlueLayout.scss"

const BlueLayout: React.FC = ({ children }) => {
  return <section className={styles.root}>{children}</section>
}

export default BlueLayout
