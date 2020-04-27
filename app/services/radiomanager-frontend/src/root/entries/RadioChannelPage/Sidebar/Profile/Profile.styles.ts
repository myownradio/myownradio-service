import { darken, Theme } from "@material-ui/core"
import { createStyles } from "@material-ui/styles"

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({ palette }: Theme) =>
  createStyles({
    root: {
      width: "100%",
      height: "64px",
      backgroundColor: darken(palette.primary.main, 0.4),
      borderBottom: `1px solid`,
      borderBottomColor: darken(palette.primary.main, 0.5),
    },
  })

export default styles
