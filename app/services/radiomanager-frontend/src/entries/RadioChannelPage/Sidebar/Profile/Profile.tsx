import { Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/styles"
import React from "react"
import styles from "./Profile.styles"

const useStyles = makeStyles(styles)

const Profile: React.FC = () => {
  const styles = useStyles()

  return (
    <Grid container className={styles.root}>
      <Grid item></Grid>
    </Grid>
  )
}

export default Profile
