import { darken } from "@material-ui/core"
import { createStyles } from "@material-ui/styles"
import { MorTheme } from "../themes/morTheme"

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ palette }: MorTheme) =>
  createStyles({
    root: {
      height: "100%",
      backgroundColor: darken(palette.primary.main, 0.2),
      borderRight: `1px solid`,
      borderRightColor: darken(palette.primary.main, 0.5),
    },
    profile: {
      width: "100%",
    },
  })

export default styles
