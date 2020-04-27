import { ThemeProvider, CssBaseline } from "@material-ui/core"
// import { makeStyles } from "@material-ui/styles"
import React from "react"
import AppLayout from "~/root/components/AppLayout"
import Sidebar from "./Sidebar"
// import styles from "./styles"
import { morTheme } from "./themes"

// const useStyles = makeStyles(styles)

const RadioChannelPage: React.FC = () => {
  // const styles = useStyles()

  return (
    <ThemeProvider theme={morTheme}>
      <CssBaseline />
      <AppLayout aside={<Sidebar />} content={<></>} />
    </ThemeProvider>
  )
}

export default RadioChannelPage
