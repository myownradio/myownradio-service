import { Grid } from "@material-ui/core"
import React from "react"
import BlueLayout from "~/layouts/BlueLayout"
import styles from "./LoginPage.scss"

// interface Props {}

const LoginPage: React.FC<{}> = ({}) => {
  return (
    <BlueLayout>
      <Grid container alignItems={"center"} justify={"center"} className={styles.root}>
        <Grid item>LOGIN</Grid>
      </Grid>
    </BlueLayout>
  )
}

export default LoginPage
