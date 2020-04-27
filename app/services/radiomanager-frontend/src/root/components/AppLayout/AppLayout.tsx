import { Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import React from "react"
import styles from "./styles"

const useStyles = makeStyles(styles)

interface Props {
  aside: React.ReactNode
  content: React.ReactNode
}

const AppLayout: React.FC<Props> = ({ aside, content }) => {
  const styles = useStyles()
  return (
    <Grid container className={styles.root}>
      <Grid item className={styles.aside}>
        {aside}
      </Grid>
      <Grid item className={styles.content}>
        {content}
      </Grid>
    </Grid>
  )
}

export default AppLayout
