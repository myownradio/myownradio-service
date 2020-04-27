import { Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import React from "react"
import Profile from "./Profile"
import styles from "./Sidebar.styles"

const useStyles = makeStyles(styles)

const Sidebar: React.FC = () => {
  const styles = useStyles()

  return (
    <Grid container spacing={0} className={styles.root}>
      <Grid item className={styles.profile}>
        <Profile />
      </Grid>
    </Grid>
  )
}

export default Sidebar
