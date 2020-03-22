import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormattedMessage } from "react-intl";

interface ErrorBoxProps {
  errorMessage: string | null;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ errorMessage }) => (
  <Box height={48}>
    {errorMessage && (
      <Alert severity="error">
        <FormattedMessage id={errorMessage} />
      </Alert>
    )}
  </Box>
);

ErrorBox.propTypes = {
  errorMessage: PropTypes.string,
};

export default ErrorBox;
