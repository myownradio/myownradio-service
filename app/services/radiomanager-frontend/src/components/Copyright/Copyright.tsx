import * as React from "react";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { config } from "~/config";
import { FormattedMessage } from "react-intl";

const Copyright: React.FC = () => {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      <FormattedMessage id="ui_common_copyright" />
      {" © "}
      <Link color="inherit" href={config.siteUrl}>
        Myownradio
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

export default Copyright;
