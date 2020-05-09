import Container from "@material-ui/core/Container"
import React from "react"
import styles from "./BlueLayout.scss"

const BlueLayout: React.FC = ({ children }) => {
  return (
    <section className={styles.root}>
      <Container maxWidth={"md"} className={styles.container}>{children}</Container>
    </section>
  )
}

export default BlueLayout
