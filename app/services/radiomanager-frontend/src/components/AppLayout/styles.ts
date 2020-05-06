import { Theme } from "@material-ui/core";
import { createStyles } from "@material-ui/styles";

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const styles = ({}: Theme) =>
  createStyles({
    root: {
      width: "100vw",
      height: "100vh",
    },
    aside: {
      width: 250,
    },
    content: {},
  })

export default styles
