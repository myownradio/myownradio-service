import * as React from "react";
import * as PropTypes from "prop-types";
import Alert from "@material-ui/lab/Alert";
import Box from "@material-ui/core/Box";

interface ErrorBoxProps {
  errorMessage: string | null;
}

const ErrorBox: React.FC<ErrorBoxProps> = ({ errorMessage }) => (
  <Box height={48}>{errorMessage && <Alert severity="error">{errorMessage}</Alert>}</Box>
);

ErrorBox.propTypes = {
  errorMessage: PropTypes.string,
};

export default ErrorBox;
