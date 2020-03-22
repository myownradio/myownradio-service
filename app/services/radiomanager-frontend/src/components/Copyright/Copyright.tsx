import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { config } from "~/config";

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
